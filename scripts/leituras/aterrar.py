#!/usr/bin/env python3
"""Aterragem pela regra 7, com cada recusa e código no recibo.

A direção chama esta ferramenta depois dos portões locais e da leitura a frio.
Não cria lançamentos: espera a integração da Vercel, limitada a 45 consultas.
Os comandos externos têm um teto de 50 minutos; as consultas, de dois minutos.
A worktree fica destacada na cabeça aterrada depois de apagar o ramo local.
"""
import datetime
import json
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
        while True:
            try:
                with self.tranca.open('x') as f:
                    self.dono = f'{agora()} <worktree> pid={os.getpid()} aterragem\n'
                    f.write(self.dono)
                break
            except FileExistsError:
                if time.time() - self.tranca.stat().st_mtime > 2400:
                    expirar(self.tranca)
                else:
                    print(higienizar('à espera da tranca: ' + self.tranca.read_text().strip(), self.sitio, self.motor), flush=True)
                    time.sleep(10)
        self.registar('tranca', 0)

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

    def executar(self):
        codigo = 9
        try:
            self.tomar_tranca()
            self.conferir_arvores()
            self.cabeca_motor = git(self.motor, 'rev-parse', 'HEAD')
            self.recibo['cabeca_motor'] = self.cabeca_motor
            self.registar('condicoes', 0)
            self.correr('publicar-ramo', ['git', 'push', '-u', 'origin', self.ramo])
            self.github()
            self.correr('series', ['npm', 'run', 'check:series'])
            self.correr('cruzamento', ['npm', 'run', 'check:cruzamento', '--', '--with-origin'])
            self.conferir_arvores()
            self.correr('fundir-main', ['git', 'merge', '--ff-only', 'refs/heads/' + self.ramo], cwd=self.principal)
            self.exigir(git(self.principal, 'rev-parse', 'HEAD') == self.cabeca, 'main não está na cabeça conferida')
            self.correr('publicar-main', ['git', 'push', 'origin', 'main'], cwd=self.principal)
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
