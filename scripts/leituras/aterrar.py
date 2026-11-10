#!/usr/bin/env python3
"""Aterragem pela regra 7, com cada recusa e código no recibo.

A direção chama esta ferramenta depois dos portões locais e da leitura a frio.
Prepara uma produção sem domínio em paralelo com o portão do GitHub.
Os comandos externos têm um teto de 90 minutos; as consultas, de dois minutos.
A worktree limpa é removida no fim, salvo ATERRAR_CONSERVA_WORKTREE=1.
"""
import datetime
import hashlib
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
from fila import ler_fila, ler_tipos


def agora():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


class Parar(Exception):
    def __init__(self, codigo, motivo, sinal=None):
        self.codigo, self.motivo = codigo, motivo
        self.sinal = sinal


class FalhaComando(Parar):
    """Uma falha recuperável ao consultar um serviço externo."""


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
        config = json.loads((self.sitio / 'vercel.json').read_text()) if (self.sitio / 'vercel.json').exists() else {}
        self.recurso = os.environ.get('OEDP_ATERRAR_RECURSO') == '1'
        self.preconstruido = config.get('git', {}).get('deploymentEnabled', {}).get('main') is False
        self.novo_fluxo = self.preconstruido or self.recurso
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
        while segundos > 0:
            self.pulsar()
            parcela = min(10, segundos)
            time.sleep(parcela)
            segundos -= parcela

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
                    if self.tranca.exists():
                        time.sleep(min(10, max(0, teto - (time.monotonic() - inicio))))
                else:
                    if agora_mono >= aviso:
                        texto = f'à espera da tranca (teto {teto} segundos, 60 minutos por omissão): {dono}'
                        print(higienizar(texto, self.sitio, self.motor), flush=True)
                        aviso = agora_mono + 300
                    time.sleep(min(10, max(0, teto - (time.monotonic() - inicio))))
        self.registar('tranca', 0, espera_segundos=time.monotonic() - inicio)

    def largar_tranca(self):
        # A I238: a tranca só durante os passos que tocam a máquina (as conferências com o motor e a fusão),
        # nunca durante as esperas pela corrida do GitHub e pela Vercel, que não tocam nas árvores; um
        # construtor à espera dos portões deixa de bater no teto do escrivão por causa de uma aterragem.
        if self.dono is not None and self.tranca.exists() and self.tranca.read_text() == self.dono:
            self.tranca.unlink()
        self.dono = None
        self.registar('tranca-largada', 0)

    def correr(self, nome, args, cwd=None, teto=5400):
        inicio = agora()
        relogio = time.monotonic()
        falha = None
        codigo = 9
        # A saída bruta só vive num temporário anónimo; nunca entra no relatório.
        with tempfile.TemporaryFile(mode='w+', encoding='utf-8', errors='replace') as f:
            p = None
            try:
                p = subprocess.Popen(args, cwd=cwd or self.sitio, stdout=f, stderr=subprocess.STDOUT,
                                     env={**os.environ, 'NO_COLOR': '1', **({'OEDP_TRANCA_DONO': self.dono.strip()} if self.dono else {})}, start_new_session=True)
                limite = time.monotonic() + teto
                while p.poll() is None:
                    self.pulsar()
                    try:
                        p.wait(timeout=min(10, max(0.1, limite - time.monotonic())))
                    except subprocess.TimeoutExpired:
                        if time.monotonic() >= limite:
                            raise FalhaComando(124, nome + ' excedeu o tempo limite')
                codigo = p.returncode if p.returncode >= 0 else 128 - p.returncode
            except (Parar, OSError) as erro:
                falha = erro if isinstance(erro, Parar) else FalhaComando(9, nome + ' não arrancou')
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
        self.registar(nome, codigo, inicio=inicio, segundos=time.monotonic() - relogio, teto_segundos=teto, comando=args)
        if falha:
            raise falha
        if codigo:
            raise FalhaComando(codigo, nome + ' falhou', sinal=-p.returncode if p.returncode < 0 else None)
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
        fila = self.sitio / 'design/observatorio/FILA.md'
        try:
            conhecidos = {d['Bloco'] for d in ler_fila(fila)}
            # O arquivo conserva nomes com a caixa original, usada nos assuntos.
            conhecidos.update(ler_tipos(fila, preservar_caixa=True))
        except (OSError, ValueError) as e:
            raise Parar(9, str(e) if isinstance(e, ValueError) else 'fila: ficheiro ilegível') from e
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

    def conferir_ficheiros_registos(self, base):
        self.exigir(isinstance(base, str) and bool(re.fullmatch(r'[0-9a-f]{40,64}', base)) and base != self.cabeca,
                    'recibo só de registos sem base de comparação válida')
        # Sem deteção de renomes: confere tanto a origem como o destino.
        ficheiros = [f for f in git(self.sitio, 'diff', '--no-renames', '--name-only', '-z',
                                    base + '...' + self.cabeca, bruto=True).split('\0') if f]
        fora = [f for f in ficheiros if f != 'DECISIONS.md' and not f.startswith(('design/', 'scripts/leituras/'))]
        self.exigir(not fora, 'aterragem só de registos muda ficheiros fora do âmbito: ' + ', '.join(fora))
        self.recibo['base_registos'] = base
        self.recibo['ficheiros_registos'] = ficheiros

    def conferir_blocos(self):
        conhecidos = self.blocos_conhecidos()
        blocos = os.environ.get('OEDP_BLOCOS', '').split()
        self.exigir(len(set(blocos)) == len(blocos) and
                    all(re.fullmatch(r'[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*', b) for b in blocos),
                    'OEDP_BLOCOS tem blocos repetidos ou inválidos')
        self.recibo['blocos'] = blocos
        base = git(self.sitio, 'rev-parse', 'main')
        if base == self.cabeca:
            provados = [r for r in self.recibos_anteriores() if r.get('cabeca') == self.cabeca and
                        r.get('blocos') == blocos and
                        ((blocos and r.get('custos_por_bloco')) or (not blocos and r.get('so_registos'))) and
                        any(p.get('passo') == 'fundir-main' and p.get('codigo') == 0 for p in r.get('passos', []))]
            self.exigir(bool(provados), 'main já está nesta cabeça, mas falta recibo que prove os blocos e o custo ou os registos')
            anterior = max(provados, key=lambda r: r.get('inicio', ''))
            for chave in ('custo', 'custos_por_bloco', 'so_registos', 'sem_custo', 'decisao_do_financiador'):
                if chave in anterior:
                    self.recibo[chave] = anterior[chave]
            if self.recibo.get('so_registos'):
                self.conferir_ficheiros_registos(anterior.get('base_registos'))
            return
        assuntos = git(self.sitio, 'log', '--reverse', '--format=%s', 'main..HEAD').splitlines()
        def registo(assunto):
            m = re.match(r'^([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)-r(?=$|[: .])', assunto)
            return bool(m and m.group(1) in conhecidos)
        if not blocos:
            self.exigir(bool(assuntos) and registo(assuntos[0]) and all(registo(a) for a in assuntos),
                        'falta OEDP_BLOCOS; só um ramo de registos com prefixo conhecido dispensa blocos')
            self.conferir_ficheiros_registos(base)
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
        self.guardar()

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
        decisao = os.environ.get('ATERRAR_DECISAO', '').strip()
        anterior = self.recibo.get('decisao_do_financiador')
        if anterior:
            self.exigir(decisao == anterior, 'a retoma exige ATERRAR_DECISAO igual à decisão guardada')
        if decisao:
            data = re.search(r'(?<!\d)(\d{2}\.\d{2}\.\d{4})(?!\d)', decisao)
            self.exigir(bool(data), 'ATERRAR_DECISAO exige data DD.MM.AAAA')
            try:
                datetime.datetime.strptime(data.group(), '%d.%m.%Y')
            except ValueError:
                raise Parar(9, 'ATERRAR_DECISAO traz uma data inválida')
            restante = (decisao[:data.start()] + decisao[data.end():]).strip()
            self.exigir(len(restante) >= 20, 'ATERRAR_DECISAO exige vinte carateres além da data')
            self.recibo['decisao_do_financiador'] = decisao
        medidas = {}
        self.recibo['medidas_de_custo'] = medidas
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
            presente = isinstance(o, dict) and 'pontos_codex_por_bloco' in o
            declarado = o['pontos_codex_por_bloco'] if presente else None
            medida = medidas[b] = {'pontos': pontos, 'origem_orcamento': 'custo' if presente else 'por omissão'}
            if not presente:
                limite = 10
                self.recibo['orcamento_por_omissao'] = limite
            elif type(declarado) is int or (isinstance(declarado, str) and re.fullmatch(r'[0-9]+', declarado)):
                limite = int(declarado)
                self.exigir(limite > 0, 'orçamento ilegível: ' + b)
            elif isinstance(declarado, str) and re.match(r'sem teto\b', declarado):
                citacao = re.search(r'§[0-9]+(?:\.[0-9]+)*(?![\w.])', declarado)
                self.exigir(bool(citacao), 'orçamento ilegível: ' + b)
                medida.update(orcamento='sem teto', decisao=citacao.group())
                continue
            else:
                raise Parar(9, 'orçamento ilegível: ' + b)
            medida['orcamento'] = limite
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
            limite = time.monotonic() + 5400
            try:
                self.correr('github-vigia', ['gh', 'run', 'watch', str(corrida['databaseId']), '--interval', '10', '--exit-status'])
            except FalhaComando as erro:
                if erro.codigo == 130 or erro.sinal is not None:
                    raise
            # Um erro do vigia não é o estado da corrida. Só a API decide.
            confirmada = None
            consulta = 0
            while True:
                if consulta:
                    self.esperar(min(30, max(0, limite - time.monotonic())))
                restante = limite - time.monotonic()
                if restante <= 0:
                    self.escrever('github.codigo', '124\n')
                    self.registar('github', 124, endereco=corrida['url'])
                    raise Parar(124, 'esgotado o teto de 90 minutos de espera pelo GitHub')
                consulta += 1
                try:
                    confirmada = json.loads(self.correr(f'github-conclusao-{consulta}',
                        ['gh', 'run', 'view', str(corrida['databaseId']),
                         '--json', 'headSha,status,conclusion,url'], teto=min(120, restante)))
                except FalhaComando as erro:
                    if erro.codigo == 130 or erro.sinal is not None:
                        raise
                    continue
                except ValueError:
                    continue
                self.exigir(isinstance(confirmada, dict), 'a conclusão do GitHub não é um objeto')
                self.exigir(confirmada.get('headSha') == self.cabeca, 'a conclusão do GitHub é de outra cabeça')
                if confirmada.get('status') == 'completed':
                    break
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

    def inventario_dist(self):
        dist = self.sitio / 'dist'
        self.exigir(dist.is_dir() and not dist.is_symlink(), 'dist ausente ou ligado a outra pasta')
        mapa = {}
        for f in sorted(dist.rglob('*')):
            self.exigir(not f.is_symlink(), 'ligação simbólica no dist')
            if f.is_file():
                mapa[f.relative_to(dist).as_posix()] = hashlib.sha256(f.read_bytes()).hexdigest()
        self.exigir(bool(mapa), 'dist vazio')
        return mapa

    def preparar_envio(self):
        self.preparar()
        inventario = self.inventario_dist()
        candidatos = [r for r in self.recibos_anteriores()
            if r.get('cabeca') == self.cabeca and r.get('envio_inventario') == inventario
            and r.get('recurso') is self.recurso
            and isinstance(r.get('vercel_preparado'), str)
            and re.fullmatch(r'https://[a-zA-Z0-9-]+\.vercel\.app', r['vercel_preparado'])
            and any(p.get('passo') in ('vercel-preparado', 'envio-reutilizado') and p.get('codigo') == 0
                    for p in r.get('passos', []))]
        if candidatos:
            anterior = max(candidatos, key=lambda r: r.get('inicio', ''))
            self.recibo.update(vercel_preparado=anterior['vercel_preparado'],
                envio_inventario=inventario, recurso=self.recurso,
                envio_reutilizado={'inicio': anterior.get('inicio'), 'endereco': anterior['vercel_preparado']})
            self.escrever('vercel.url', anterior['vercel_preparado'] + '\n')
            self.registar('envio-reutilizado', 0)
            return
        if not self.recurso:
            self.correr('vercel-prebuilt', ['sh', 'scripts/leituras/vercel-prebuilt.sh', str(self.sitio)])
        else:
            self.correr('vercel-ligar', ['python3', 'scripts/leituras/vercel-prebuilt.py', str(self.sitio), '--ligar'])
        args = ['vercel', 'deploy', '--archive=tgz', '--prod', '--skip-domain', '--yes', '--meta', 'githubCommitSha=' + self.cabeca]
        if not self.recurso:
            args.insert(2, '--prebuilt')
        texto = self.correr('vercel-preparado', args)
        texto = re.sub(r'\x1b\[[0-9;]*m', '', texto)
        urls = re.findall(r'https://[a-zA-Z0-9-]+\.vercel\.app(?=\s|$)', texto)
        self.exigir(bool(urls) and len(set(urls)) == 1, 'o envio não devolveu um endereço único da Vercel')
        self.exigir(self.inventario_dist() == inventario, 'o dist mudou durante a preparação do envio')
        self.recibo['envio_inventario'] = inventario
        self.recibo['vercel_preparado'] = urls[0]
        self.recibo['recurso'] = self.recurso
        self.escrever('vercel.url', urls[0] + '\n')
        self.guardar()

    def preparar(self):
        # A PREPARAÇÃO DA WORKTREE (21.10.2026, I250): as conferências locais precisam do `node_modules` e do `dist/`
        # da própria worktree; uma worktree nova não os tem, e três aterragens caíram por isso. Os dois são ignorados
        # pelo git, pelo que a árvore continua limpa. Prepara-se, não se recusa; corre dentro da tranca, depois da
        # corrida do GitHub verde no fluxo antigo; no preparado, em paralelo com ela.
        if not (Path(self.sitio) / 'node_modules').is_dir():
            self.correr('preparar-dependencias', ['npm', 'ci', '--no-audit', '--no-fund'])
        versao = Path(self.sitio) / 'dist' / 'version.json'
        motivo = None
        if not versao.is_file():
            motivo = {'motivo': 'em falta'}
        else:
            try:
                commit = json.loads(versao.read_text(encoding='utf-8')).get('commit')
            except (OSError, ValueError, AttributeError) as e:
                raise Parar(9, 'dist/version.json ilegível') from e
            if commit != self.cabeca:
                motivo = {'motivo': 'de outra cabeça', 'commit': commit}
        if motivo:
            self.recibo['preparar_dist'] = motivo
            self.guardar()
            self.correr('preparar-dist', ['npm', 'run', 'build'])

    def remover_worktree(self):
        """A aterragem já aconteceu; uma falha de limpeza fica apenas como aviso."""
        try:
            if os.environ.get('ATERRAR_CONSERVA_WORKTREE') == '1':
                self.registar('remover-worktree', 0, estado='conservada', motivo='ATERRAR_CONSERVA_WORKTREE=1')
                return
            estado = self.correr('conferir-limpeza-worktree',
                                 ['git', '-c', 'core.quotepath=false', 'status', '--porcelain', '--untracked-files=all'], teto=120)
            if estado.strip():
                self.registar('remover-worktree', 0, estado='conservada', ficheiros=estado.splitlines(),
                              aviso='a worktree tem ficheiros por registar; não se remove')
                return
            self.correr('remover-worktree', ['git', 'worktree', 'remove', str(self.sitio)], cwd=self.principal)
            self.recibo['passos'][-1]['estado'] = 'removida'
            self.guardar()
        except Parar as erro:
            self.registar('remover-worktree', erro.codigo, estado='aviso', aviso=erro.motivo)
        except (OSError, ValueError, KeyError, IndexError, TypeError):
            self.registar('remover-worktree', 9, estado='aviso',
                          aviso='não foi possível confirmar a remoção da worktree; consultar o último passo')

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
            self.tomar_tranca()
            self.conferir_arvores()
            self.preparar()
            if self.novo_fluxo:
                self.preparar_envio()
            self.correr('series', ['npm', 'run', 'check:series'])
            ledger = self.correr('ledger-corpos', ['npm', 'run', 'ledger:check'])
            self.exigir(bool(re.search(r'^M83: corpos lidos; .*limpa=true; recusas=0$', ledger, re.M)), 'ledger:check não confirmou corpos lidos')
            frases = self.correr('frases-afirmacao', ['npm', 'run', 'check:frases-afirmacao'])
            self.exigir(bool(re.search(r'^excertos: corpos lidos; limpa=true; linhas lidas=\d+$', frases, re.M)), 'check:frases-afirmacao não confirmou corpos lidos')
            self.correr('cruzamento', ['npm', 'run', 'check:cruzamento', '--', '--with-origin'])
            self.correr('camada-0', ['npm', 'run', 'verify:com-motor'])
            self.largar_tranca()
            self.github()
            self.conferir_limite_diario()
            self.tomar_tranca()
            self.conferir_limite_diario()
            # A cabeça de ambas as árvores volta a ser conferida antes da fusão.
            self.conferir_arvores()
            self.correr('fundir-main', ['git', 'merge', '--ff-only', 'refs/heads/' + self.ramo], cwd=self.principal)
            self.exigir(git(self.principal, 'rev-parse', 'HEAD') == self.cabeca, 'main não está na cabeça conferida')
            self.correr('publicar-main', ['git', 'push', 'origin', 'main'], cwd=self.principal)
            if self.novo_fluxo:
                self.correr('vercel-promover', ['vercel', 'promote', self.recibo['vercel_preparado'], '--yes'])
            else:
                self.largar_tranca()
                self.vercel()
            self.correr('verify-deploy', ['npm', 'run', 'verify:deploy'], cwd=self.principal)
            if self.novo_fluxo:
                self.largar_tranca()
            self.conferir_arvores()
            self.exigir(git(self.principal, 'rev-parse', 'HEAD') == self.cabeca, 'main mudou depois do lançamento')
            remoto = self.correr('conferir-ramo-remoto', ['git', 'ls-remote', '--exit-code', 'origin', 'refs/heads/' + self.ramo])
            self.exigir(remoto.split()[0] == self.cabeca, 'o ramo remoto mudou; não se apaga')
            self.correr('apagar-ramo-remoto', ['git', 'push', 'origin', '--delete', self.ramo])
            self.correr('destacar-worktree', ['git', 'switch', '--detach', self.cabeca])
            self.correr('apagar-ramo-local', ['git', 'branch', '-d', self.ramo], cwd=self.principal)
            codigo = 0
            self.remover_worktree()
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
            raise Parar(130, 'aterragem interrompida', sinal=_sinal)
        signal.signal(signal.SIGTERM, interromper)
        signal.signal(signal.SIGINT, interromper)
        return aterragem.executar()
    except (OSError, ValueError) as erro:
        print('aterragem código 9: ' + higienizar(str(erro), argv[0]), file=sys.stderr)
        return 9


if __name__ == '__main__':
    sys.exit(principal_cli(sys.argv[1:]))
