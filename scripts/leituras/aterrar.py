#!/usr/bin/env python3
"""Aterragem pela regra 7, com cada recusa e código no recibo.

A direção chama esta ferramenta depois dos portões locais e da leitura a frio.
Não cria lançamentos: espera a integração da Vercel, limitada a 45 consultas.
Os comandos externos têm um teto de 50 minutos; as consultas, de dois minutos.
A worktree fica destacada na cabeça aterrada depois de apagar o ramo local.
"""
import datetime
import json
import math
import os
from pathlib import Path
import re
import signal
import subprocess
import sys
import tempfile
import time
from arvores import antepassado, git, higienizar, limpa, principal, raiz
from tranca import expirar


def agora():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


class Parar(Exception):
    def __init__(self, codigo, motivo):
        self.codigo, self.motivo = codigo, motivo


class Aterragem:
    def __init__(self, sitio, saida):
        if not Path(sitio).is_absolute():
            raise ValueError('a worktree tem de ser absoluta')
        self.sitio = raiz(sitio)
        self.motor = Path(os.environ['RESEARCHHUB_DIR']).resolve() if os.environ.get('RESEARCHHUB_DIR') else None
        self.principal = principal(self.sitio, 'main')
        self.saida = Path(saida).resolve()
        for arvore in (self.sitio, self.motor, self.principal):
            if arvore and (arvore == self.saida or arvore in self.saida.parents):
                raise ValueError('a pasta de saída tem de ficar fora das árvores para não as sujar')
        self.saida.mkdir(parents=True, exist_ok=False)
        self.cabeca = git(self.sitio, 'rev-parse', 'HEAD')
        self.ramo = git(self.sitio, 'branch', '--show-current')
        self.recibo = {'cabeca': self.cabeca, 'ramo': self.ramo, 'inicio': agora(), 'passos': []}
        self.tranca = Path(os.environ.get('OEDP_TRANCA', '/tmp/oedp-construcao.lock'))
        self.dono = None
        self.guardar()

    def escrever(self, nome, texto):
        limpo = higienizar(texto, self.sitio, self.motor, self.principal)
        (self.saida / nome).write_text(limpo, encoding='utf-8')

    def guardar(self):
        self.escrever('aterragem.json', json.dumps(self.recibo, ensure_ascii=False, indent=2) + '\n')

    def registar(self, passo, codigo, **dados):
        self.recibo['passos'].append(dict(passo=passo, codigo=codigo, hora=agora(), cabeca=self.cabeca, **dados))
        self.guardar()

    def exigir(self, condicao, motivo):
        if not condicao:
            raise Parar(9, motivo)

    def pulsar(self):
        if self.dono is not None:
            self.exigir(self.tranca.exists() and self.tranca.read_text() == self.dono, 'perdeu-se a tranca da máquina')
            os.utime(self.tranca, None)

    def esperar(self, segundos):
        for _ in range(segundos // 10):
            self.pulsar()
            time.sleep(10)

    def tomar_tranca(self):
        inicio = time.monotonic()
        # A variável encurta o teto apenas nos ensaios; nunca permite alargá-lo.
        teto = int(os.environ.get('OEDP_ENSAIO_TRANCA_TETO', '3600'))
        self.exigir(0 < teto <= 3600, 'teto da tranca inválido')
        aviso = inicio
        while True:
            try:
                with self.tranca.open('x') as f:
                    self.dono = f'{agora()} <worktree> pid={os.getpid()} aterragem\n'
                    f.write(self.dono)
                break
            except FileExistsError:
                agora_mono = time.monotonic()
                dono = self.tranca.read_text().strip()
                if agora_mono - inicio >= teto:
                    self.registar('tranca', 75, dono=dono, teto_segundos=teto,
                                  espera_segundos=agora_mono - inicio)
                    raise Parar(75, 'esgotado o teto de espera pela tranca')
                if time.time() - self.tranca.stat().st_mtime > 2400:
                    expirar(self.tranca)
                else:
                    if agora_mono >= aviso:
                        texto = f'à espera da tranca (teto {teto} segundos, 60 minutos por omissão): {dono}'
                        print(higienizar(texto, self.sitio, self.motor), flush=True)
                        aviso = agora_mono + 300
                    time.sleep(min(10, max(0, teto - (time.monotonic() - inicio))))
        self.registar('tranca', 0)

    def largar_tranca(self):
        # A I238: a tranca só durante os passos que tocam a máquina (as conferências com o motor e a fusão),
        # nunca durante as esperas pela corrida do GitHub e pela Vercel, que não tocam nas árvores; um
        # construtor à espera dos portões deixa de bater no teto do escrivão por causa de uma aterragem.
        if self.dono is not None and self.tranca.exists() and self.tranca.read_text() == self.dono:
            self.tranca.unlink()
        self.dono = None
        self.registar('tranca-largada', 0)

    def correr(self, nome, args, cwd=None, teto=3000):
        inicio = agora()
        falha = None
        codigo = 9
        # A saída bruta só vive num temporário anónimo; nunca entra no relatório.
        with tempfile.TemporaryFile(mode='w+', encoding='utf-8', errors='replace') as f:
            p = None
            try:
                p = subprocess.Popen(args, cwd=cwd or self.sitio, stdout=f, stderr=subprocess.STDOUT,
                                     env={**os.environ, 'NO_COLOR': '1'}, start_new_session=True)
                limite = time.monotonic() + teto
                while p.poll() is None:
                    self.pulsar()
                    try:
                        p.wait(timeout=min(10, max(0.1, limite - time.monotonic())))
                    except subprocess.TimeoutExpired:
                        if time.monotonic() >= limite:
                            raise Parar(124, nome + ' excedeu o tempo limite')
                codigo = p.returncode if p.returncode >= 0 else 128 - p.returncode
            except (Parar, OSError) as erro:
                falha = erro if isinstance(erro, Parar) else Parar(9, nome + ' não arrancou')
                codigo = falha.codigo
                if p is not None and p.poll() is None:
                    os.killpg(p.pid, signal.SIGTERM)
                    try:
                        p.wait(timeout=10)
                    except subprocess.TimeoutExpired:
                        os.killpg(p.pid, signal.SIGKILL)
                        p.wait()
            f.seek(0)
            texto = f.read()
        self.escrever(nome + '.log', texto)
        self.escrever(nome + '.codigo', str(codigo) + '\n')
        # O passo seguinte depende do código relido, não do sucesso de lançar o processo.
        codigo = int((self.saida / (nome + '.codigo')).read_text())
        self.registar(nome, codigo, inicio=inicio, comando=args)
        if falha:
            raise falha
        if codigo:
            raise Parar(codigo, nome + ' falhou')
        return texto

    def conferir_arvores(self):
        self.exigir(bool(self.ramo) and self.ramo != 'main', 'a cabeça tem de estar num ramo diferente de main')
        self.exigir(limpa(self.sitio, True), 'a worktree tem ficheiros por registar')
        self.exigir(antepassado(self.sitio, 'main'), 'main não é antepassado da cabeça')
        self.exigir(self.motor is not None, 'falta RESEARCHHUB_DIR')
        raiz(self.motor)
        self.exigir(limpa(self.motor, True), 'a árvore do motor tem ficheiros por registar')
        self.exigir(limpa(self.principal, True), 'a árvore principal tem ficheiros por registar')
        self.exigir(git(self.principal, 'branch', '--show-current') == 'main', 'a árvore principal saiu de main')
        self.exigir(git(self.sitio, 'rev-parse', 'HEAD') == self.cabeca and
                    git(self.sitio, 'branch', '--show-current') == self.ramo, 'a cabeça ou o ramo mudou durante a aterragem')
        if hasattr(self, 'cabeca_motor'):
            self.exigir(git(self.motor, 'rev-parse', 'HEAD') == self.cabeca_motor, 'a cabeça do motor mudou durante a aterragem')

    def pasta_aterragens(self):
        # Partilhada pelas worktrees; o ambiente permite o arquivo noutro volume.
        return Path(os.environ.get('OEDP_ATERRAGENS', self.principal.parent / '_aterragens'))

    def blocos_conhecidos(self):
        conhecidos = set()
        fila = self.sitio / 'design/observatorio/FILA.md'
        if fila.exists():
            cabecalho = None
            for linha in fila.read_text().splitlines():
                if not linha.startswith('|'):
                    cabecalho = None
                    continue
                c = [x.strip() for x in linha.strip().strip('|').split('|')]
                if 'Bloco' in c and 'Tipo' in c:
                    cabecalho = c
                elif cabecalho and len(c) == len(cabecalho):
                    d = dict(zip(cabecalho, c))
                    if d['Tipo'] in ('conteúdo', 'navegação', 'maquinaria'):
                        conhecidos.add(d['Bloco'])
        for pasta in (self.sitio / 'design/especime-v3/medicoes').glob('*'):
            if not pasta.is_dir():
                continue
            conhecidos.add(re.sub(r'-\d{4}-\d{2}-\d{2}$', '', pasta.name))
            for f in pasta.glob('custo*.json'):
                d = json.loads(f.read_text())
                if isinstance(d, dict) and isinstance(d.get('bloco'), str):
                    m = re.match(r'[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*', d['bloco'])
                    if m:
                        conhecidos.add(m.group())
        return conhecidos

    def conferir_blocos(self):
        blocos = os.environ.get('OEDP_BLOCOS', '').split()
        self.exigir(len(set(blocos)) == len(blocos) and
                    all(re.fullmatch(r'[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*', b) for b in blocos),
                    'OEDP_BLOCOS tem blocos repetidos ou inválidos')
        self.recibo['blocos'] = blocos
        if git(self.sitio, 'rev-parse', 'main') == self.cabeca:
            provados = [r for r in self.recibos_anteriores() if r.get('cabeca') == self.cabeca and
                        r.get('blocos') == blocos and
                        ((blocos and r.get('custos_por_bloco')) or (not blocos and r.get('so_registos'))) and
                        any(p.get('passo') == 'fundir-main' and p.get('codigo') == 0 for p in r.get('passos', []))]
            self.exigir(bool(provados), 'main já está nesta cabeça, mas falta recibo que prove os blocos e o custo ou os registos')
            anterior = max(provados, key=lambda r: r.get('inicio', ''))
            for chave in ('custo', 'custos_por_bloco', 'so_registos', 'sem_custo', 'decisao_do_financiador'):
                if chave in anterior:
                    self.recibo[chave] = anterior[chave]
            return
        assuntos = git(self.sitio, 'log', '--reverse', '--format=%s', 'main..HEAD').splitlines()
        conhecidos = self.blocos_conhecidos()
        def registo(assunto):
            m = re.match(r'^([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)-r(?=$|[: .])', assunto)
            return bool(m and m.group(1) in conhecidos)
        if not blocos:
            self.exigir(bool(assuntos) and registo(assuntos[0]) and all(registo(a) for a in assuntos),
                        'falta OEDP_BLOCOS; só um ramo de registos com prefixo conhecido dispensa blocos')
            self.recibo['so_registos'] = True
            self.recibo['custos_por_bloco'] = {}
            return
        encontrados = set()
        for assunto in assuntos:
            if registo(assunto):
                continue
            candidatos = [b for b in blocos if re.match(re.escape(b) + r'(?=$|[^A-Za-z0-9])', assunto)]
            # Um sufixo -r desconhecido nunca se mascara como commit de conteúdo.
            self.exigir(not re.match(r'^[^ :]+-r(?=$|[: .])', assunto), 'prefixo de registos desconhecido: ' + assunto)
            self.exigir(bool(candidatos), 'commit fora dos blocos declarados: ' + assunto)
            encontrados.add(max(candidatos, key=len))
        self.exigir(encontrados == set(blocos), 'bloco declarado sem commit: ' + ' '.join(sorted(set(blocos) - encontrados)))

    def recibos_anteriores(self):
        recibos = []
        for p in self.pasta_aterragens().glob('*/aterragem.json'):
            if p.resolve() == (self.saida / 'aterragem.json').resolve():
                continue
            d = json.loads(p.read_text())
            self.exigir(isinstance(d, dict), 'recibo de aterragem ilegível')
            recibos.append(d)
        return recibos

    def conferir_limite_diario(self):
        hoje = datetime.datetime.now(datetime.timezone.utc).date()
        concluidas = 0
        for r in self.recibos_anteriores():
            if r.get('codigo') != 0:
                continue
            inicio = datetime.datetime.fromisoformat(r['inicio'].replace('Z', '+00:00'))
            self.exigir(inicio.tzinfo is not None, 'recibo sem fuso horário')
            concluidas += inicio.astimezone(datetime.timezone.utc).date() == hoje
        razao = os.environ.get('ATERRAR_LOTE_EXTRA', '').strip()
        self.recibo['aterragens_do_dia'] = concluidas
        if razao:
            self.recibo['lote_extra'] = razao
        self.exigir(concluidas < 2 or bool(razao), 'já há duas aterragens concluídas neste dia UTC; falta ATERRAR_LOTE_EXTRA="<razão>"')

    def conferir_corrida(self):
        candidatas = []
        for p in self.pasta_aterragens().glob('*conferir*/cabeca'):
            if p.read_text().strip() == self.cabeca:
                candidatas.append(p.parent)
        if not candidatas:
            self.recibo['conferencias'] = {'modo': 'por medir', 'motivo': 'nenhuma pasta conferir desta cabeça'}
            return
        pasta = max(candidatas, key=lambda p: p.stat().st_mtime_ns)
        resumo = json.loads((pasta / 'resumo.json').read_text())
        self.exigir(resumo.get('cabeca') == self.cabeca and resumo.get('cabeca_fim') == self.cabeca,
                    'a corrida de conferências não terminou nesta cabeça')
        self.exigir(bool(resumo.get('passos')) and all(p.get('codigo') == 0 for p in resumo['passos']),
                    'a corrida de conferências desta cabeça tem passos vermelhos')
        dirigida = pasta / 'DIRIGIDAS.txt'
        self.recibo['conferencias'] = {'modo': 'dirigidas' if dirigida.exists() else 'inteira',
                                      'pasta': pasta.name, 'passos': [p['passo'] for p in resumo['passos']]}
        if dirigida.exists():
            self.recibo['conferencias']['declaracao'] = dirigida.read_text()

    def conferir_custo(self):
        razao = os.environ.get('ATERRAR_SEM_CUSTO', '').strip()
        so_registos = not self.recibo['blocos'] and self.recibo.get('so_registos') is True
        self.exigir(not razao or so_registos, 'ATERRAR_SEM_CUSTO só vale para uma aterragem só de registos, sem blocos declarados')
        if so_registos:
            if razao:
                self.recibo['sem_custo'] = razao
            self.recibo['custos_por_bloco'] = {}
            return
        por_bloco = dict(self.recibo.get('custos_por_bloco', {})) if 'custo' in self.recibo else {}
        if not por_bloco:
            ficheiros = git(self.sitio, 'diff', '--name-only', '--diff-filter=ACMR', 'main...HEAD').splitlines()
            custos = [f for f in ficheiros if re.fullmatch(r'design/especime-v3/medicoes/[^/]+/custo[^/]*\.json', f)]
            for f in custos:
                d = json.loads((self.sitio / f).read_text())
                nome = d.get('bloco', '') if isinstance(d, dict) else ''
                for b in self.recibo['blocos']:
                    if re.match(re.escape(b) + r'(?=$|[ :·(])', nome):
                        self.exigir(b not in por_bloco, 'mais de um ficheiro de custo para ' + b)
                        por_bloco[b] = f
        self.exigir(set(por_bloco) == set(self.recibo['blocos']) and bool(por_bloco),
                    'falta custo-<data>.json identificado pelo campo bloco para: ' +
                    ' '.join(sorted(set(self.recibo['blocos']) - set(por_bloco))))
        decisao = os.environ.get('ATERRAR_DECISAO', '').strip() or self.recibo.get('decisao_do_financiador', '')
        if decisao:
            self.recibo['decisao_do_financiador'] = decisao
        medidas = {}
        def numero(v):
            return type(v) in (int, float) and math.isfinite(v) and v >= 0
        for b, f in por_bloco.items():
            d = json.loads((self.sitio / f).read_text())
            pontos = d.get('pontos_do_bloco')
            if pontos is None:
                passagens = d.get('passagens_codex', [])
                self.exigir(isinstance(passagens, list), 'passagens_codex inválidas: ' + b)
                valores = [p.get('pontos') for p in passagens if isinstance(p, dict) and p.get('pontos') is not None]
                self.exigir(bool(valores) and all(numero(v) for v in valores), 'custo por medir ou pontos inválidos: ' + b)
                pontos = sum(valores)
            self.exigir(numero(pontos), 'pontos_do_bloco inválido: ' + b)
            o = d.get('orcamento')
            declarado = o.get('pontos_codex_por_bloco') if isinstance(o, dict) else None
            if declarado is None:
                limite = 10
                self.recibo['orcamento_por_omissao'] = limite
            else:
                m = re.search(r'\d+', str(declarado))
                self.exigir(bool(m) and int(m.group()) > 0, 'orçamento sem inteiro positivo: ' + b)
                limite = int(m.group())
            medidas[b] = {'pontos': pontos, 'orcamento': limite,
                          'origem_orcamento': 'por omissão' if declarado is None else 'custo'}
            self.exigir(pontos < limite or bool(decisao),
                        f'{b}: {pontos:g} pontos atingem o orçamento de {limite}; falta ATERRAR_DECISAO')
        self.recibo['custo'] = list(por_bloco.values())
        self.recibo['custos_por_bloco'] = por_bloco
        self.recibo['medidas_de_custo'] = medidas

    def github(self):
        for tentativa in range(45):
            if tentativa:
                self.esperar(60)
            texto = self.correr(f'github-lista-{tentativa + 1}', ['gh', 'run', 'list', '--workflow', 'portao.yml',
                '--branch', self.ramo, '--commit', self.cabeca, '--event', 'push', '--limit', '1',
                '--json', 'databaseId,headSha,headBranch,status,conclusion,url,workflowName'], teto=120)
            corridas = json.loads(texto)
            self.exigir(isinstance(corridas, list), 'a lista de corridas do GitHub não é uma lista')
            if not corridas:
                continue
            corrida = corridas[0]
            self.exigir(isinstance(corrida, dict), 'a corrida do GitHub não é um objeto')
            self.exigir(corrida.get('headSha') == self.cabeca and corrida.get('headBranch') == self.ramo
                        and corrida.get('workflowName') == 'portão', 'a corrida recebida não é o portão desta cabeça e ramo')
            self.exigir(isinstance(corrida.get('databaseId'), int) and bool(corrida.get('url')), 'a corrida não tem identificador ou endereço')
            self.recibo['corrida'] = corrida
            self.escrever('github.url', corrida['url'] + '\n')
            self.guardar()
            try:
                self.correr('github-vigia', ['gh', 'run', 'watch', str(corrida['databaseId']), '--interval', '60', '--exit-status'])
            except Parar as erro:
                self.escrever('github.codigo', str(erro.codigo) + '\n')
                raise
            confirmada = json.loads(self.correr('github-conclusao', ['gh', 'run', 'view', str(corrida['databaseId']),
                '--json', 'headSha,status,conclusion,url'], teto=120))
            self.exigir(isinstance(confirmada, dict), 'a conclusão do GitHub não é um objeto')
            passou = confirmada.get('headSha') == self.cabeca and confirmada.get('status') == 'completed' and confirmada.get('conclusion') == 'success'
            self.escrever('github.codigo', '0\n' if passou else '1\n')
            self.registar('github', 0 if passou else 1, endereco=corrida['url'])
            if not passou:
                raise Parar(1, 'a corrida do GitHub não ficou verde')
            return
        raise Parar(124, 'a corrida portão não apareceu em 45 consultas')

    def vercel(self):
        for tentativa in range(45):
            if tentativa:
                self.esperar(60)
            texto = self.correr(f'vercel-{tentativa + 1}', ['vercel', 'ls', '--environment', 'production',
                '--meta', 'githubCommitSha=' + self.cabeca], cwd=self.principal, teto=120)
            texto = re.sub(r'\x1b\[[0-9;]*m', '', texto)
            linhas = [l for l in texto.splitlines() if re.search(r'https://\S+', l) and re.search(r'\bProduction\b', l)]
            if linhas and re.search(r'\bReady\b', linhas[0]):
                self.registar('vercel-pronto', 0)
                return
            if linhas and re.search(r'\b(Error|Canceled|Cancelled)\b', linhas[0]):
                raise Parar(1, 'o lançamento desta cabeça falhou na Vercel')
        raise Parar(124, 'a Vercel não mostrou esta cabeça pronta em 45 consultas')

    def preparar(self):
        # A PREPARAÇÃO DA WORKTREE (21.10.2026, I250): as conferências locais precisam do `node_modules` e do `dist/`
        # da própria worktree; uma worktree nova não os tem, e três aterragens caíram por isso. Os dois são ignorados
        # pelo git, pelo que a árvore continua limpa. Prepara-se, não se recusa; corre dentro da tranca, depois da
        # corrida do GitHub verde, para não construir o que o GitHub recusou.
        if not (Path(self.sitio) / 'node_modules').is_dir():
            self.correr('preparar-dependencias', ['npm', 'ci', '--no-audit', '--no-fund'])
        if not (Path(self.sitio) / 'dist' / 'version.json').is_file():
            self.correr('preparar-dist', ['npm', 'run', 'build'])

    def executar(self):
        codigo = 9
        try:
            self.conferir_arvores()
            self.conferir_blocos()
            self.conferir_custo()
            self.conferir_limite_diario()
            self.conferir_corrida()
            self.cabeca_motor = git(self.motor, 'rev-parse', 'HEAD')
            self.recibo['cabeca_motor'] = self.cabeca_motor
            self.registar('condicoes', 0)
            self.correr('publicar-ramo', ['git', 'push', '-u', 'origin', self.ramo])
            self.github()
            self.conferir_limite_diario()
            self.tomar_tranca()
            self.conferir_limite_diario()
            self.conferir_arvores()
            self.preparar()
            self.correr('series', ['npm', 'run', 'check:series'])
            self.correr('cruzamento', ['npm', 'run', 'check:cruzamento', '--', '--with-origin'])
            self.conferir_arvores()
            self.correr('fundir-main', ['git', 'merge', '--ff-only', 'refs/heads/' + self.ramo], cwd=self.principal)
            self.exigir(git(self.principal, 'rev-parse', 'HEAD') == self.cabeca, 'main não está na cabeça conferida')
            self.correr('publicar-main', ['git', 'push', 'origin', 'main'], cwd=self.principal)
            self.largar_tranca()
            self.vercel()
            self.correr('verify-deploy', ['npm', 'run', 'verify:deploy'], cwd=self.principal)
            self.conferir_arvores()
            self.exigir(git(self.principal, 'rev-parse', 'HEAD') == self.cabeca, 'main mudou depois do lançamento')
            remoto = self.correr('conferir-ramo-remoto', ['git', 'ls-remote', '--exit-code', 'origin', 'refs/heads/' + self.ramo])
            self.exigir(remoto.split()[0] == self.cabeca, 'o ramo remoto mudou; não se apaga')
            self.correr('apagar-ramo-remoto', ['git', 'push', 'origin', '--delete', self.ramo])
            self.correr('destacar-worktree', ['git', 'switch', '--detach', self.cabeca])
            self.correr('apagar-ramo-local', ['git', 'branch', '-d', self.ramo], cwd=self.principal)
            codigo = 0
        except Parar as erro:
            codigo = erro.codigo
            self.registar('parou', codigo, motivo=erro.motivo)
        except (OSError, ValueError, KeyError, IndexError, TypeError):
            codigo = 9
            self.registar('parou', codigo, motivo='não foi possível ler um comando, uma resposta ou um ficheiro; consultar o último passo')
        finally:
            self.recibo.update(codigo=codigo, fim=agora())
            try:
                self.guardar()
            finally:
                if self.dono is not None and self.tranca.exists() and self.tranca.read_text() == self.dono:
                    self.tranca.unlink()
        print(f'aterragem código {codigo} · cabeça {self.cabeca}')
        return codigo


def principal_cli(argv):
    if len(argv) != 2:
        print('uso: aterrar.sh <worktree absoluta> <pasta de saída nova, fora das árvores>', file=sys.stderr)
        return 9
    try:
        aterragem = Aterragem(*argv)
        def interromper(_sinal, _quadro):
            raise Parar(130, 'aterragem interrompida')
        signal.signal(signal.SIGTERM, interromper)
        signal.signal(signal.SIGINT, interromper)
        return aterragem.executar()
    except (OSError, ValueError) as erro:
        print('aterragem código 9: ' + higienizar(str(erro), argv[0]), file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(principal_cli(sys.argv[1:]))
