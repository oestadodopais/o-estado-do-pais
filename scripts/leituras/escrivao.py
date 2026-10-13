#!/usr/bin/env python3
"""O escrivão dos commits do construtor (M79, 13.10.2026, DECISIONS.md §1.190).

Porquê: o Codex mantém `.git` só de leitura dentro da sandbox `workspace-write` (a pasta ou o ficheiro
`.git` e o alvo do `gitdir:` de uma worktree são caminhos protegidos), por isso cada `git commit` do
construtor pedia uma escalada, e com `--approve-for-me` cada pedido abria uma sub-sessão «guardian» que lia
a história inteira da sessão: 23 revisões a 12.10.2026, 1,94 milhões de símbolos fora da cache, cerca de
doze por cento dos pontos da semana. O escrivão corre fora da sandbox, lançado por `construir-codex.sh`, e
faz os commits que o construtor lhe pede por ficheiro (`comitar.sh`): só nas worktrees que recebeu, só com
caminhos de ficheiros explícitos dentro delas, nunca pastas, nunca `-A` nem `.`, nunca `push`; a mensagem
tem de trazer o trailer `Co-Authored-By:` e não leva travessões. Os hooks do repositório correm como num
commit à mão (no motor, o `core.gate` do pre-commit).

uso: python3 scripts/leituras/escrivao.py <worktree> [<outra worktree>...]

Cada worktree tem a sua pasta de pedidos em `/tmp/oedp-escrivao-<sha1 do caminho real, 12 caracteres>`,
que o `comitar.sh` calcula da mesma maneira. Um pedido é `pedido-<id>.json` com `mensagem` e `ficheiros`;
o resultado é `pedido-<id>.resultado` ao lado, com o código, a cabeça nova e as últimas linhas da saída do
git. Um pedido deixado por um lançamento anterior recusa-se ao arrancar, em vez de se executar às cegas.
O ficheiro `batimento` diz que o escrivão está vivo; o `comitar.sh` recusa pedir quando ele falta.
"""
import datetime
import hashlib
import json
import os
import pathlib
import subprocess
import sys
import time


def pasta_dos_pedidos(worktree):
    real = os.path.realpath(worktree)
    return pathlib.Path('/tmp') / ('oedp-escrivao-' + hashlib.sha1(real.encode()).hexdigest()[:12])


def agora():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def git(repo, *args, entrada=None):
    return subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True, input=entrada)


def validar(repo, pedido):
    mensagem = pedido.get('mensagem')
    ficheiros = pedido.get('ficheiros')
    if not isinstance(mensagem, str) or not mensagem.strip():
        return 'mensagem vazia'
    if 'Co-Authored-By:' not in mensagem:
        return 'a mensagem não traz o trailer Co-Authored-By'
    if '—' in mensagem:
        return 'travessão na mensagem'
    if not isinstance(ficheiros, list) or not ficheiros:
        return 'lista de ficheiros vazia'
    if len(ficheiros) > 400:
        return 'mais de quatrocentos ficheiros num pedido; divide-o'
    raiz = pathlib.Path(os.path.realpath(repo))
    for f in ficheiros:
        if not isinstance(f, str) or not f or f in ('.', '*', './') or f.startswith('-'):
            return f'caminho recusado: {f!r}'
        partes = pathlib.PurePosixPath(f).parts
        if os.path.isabs(f) or '..' in partes:
            return f'caminho fora da worktree: {f}'
        if '.git' in partes:
            return f'dentro de .git: {f}'
        alvo = raiz / f
        real = pathlib.Path(os.path.realpath(alvo))
        if real != raiz and raiz not in real.parents:
            return f'o caminho resolve fora da worktree: {f}'
        if alvo.is_dir() and not alvo.is_symlink():
            return f'é uma pasta; lista os ficheiros: {f}'
        if not alvo.exists() and not alvo.is_symlink():
            seguido = git(repo, 'ls-files', '--error-unmatch', '--', f)
            if seguido.returncode != 0:
                return f'não existe nem é um ficheiro seguido apagado: {f}'
    return None


def executar(repo, pedido):
    recusa = validar(repo, pedido)
    if recusa:
        return {'codigo': 2, 'recusa': recusa}
    ficheiros = pedido['ficheiros']
    adicionar = git(repo, 'add', '--', *ficheiros)
    if adicionar.returncode != 0:
        return {'codigo': adicionar.returncode, 'recusa': 'git add falhou', 'saida': (adicionar.stdout + adicionar.stderr)[-3000:]}
    mensagem = pedido['mensagem'].rstrip('\n') + '\n'
    commit = git(repo, 'commit', '-q', '-F', '-', entrada=mensagem)
    cabeca = git(repo, 'rev-parse', '--short=8', 'HEAD').stdout.strip()
    return {'codigo': commit.returncode, 'cabeca': cabeca, 'saida': (commit.stdout + commit.stderr)[-6000:]}


def escrever_resultado(pedido, resultado):
    resultado['quando'] = agora()
    destino = pedido.with_suffix('.resultado')
    provisorio = destino.with_suffix('.tmp')
    provisorio.write_text(json.dumps(resultado, ensure_ascii=False, indent=1), encoding='utf-8')
    provisorio.rename(destino)
    print(f"{resultado['quando']} {pedido.name}: código {resultado['codigo']} {resultado.get('cabeca', '')} {resultado.get('recusa', '')}", flush=True)


def pendentes(pasta):
    for pedido in sorted(pasta.glob('pedido-*.json')):
        if not pedido.with_suffix('.resultado').exists():
            yield pedido


def principal(argv):
    repos = [os.path.realpath(p) for p in argv]
    if not repos:
        sys.exit('uso: escrivao.py <worktree> [<outra worktree>...]')
    pastas = {}
    for repo in repos:
        if git(repo, 'rev-parse', '--show-toplevel').returncode != 0:
            sys.exit(f'escrivão: {repo} não é um repositório git')
        pasta = pasta_dos_pedidos(repo)
        pasta.mkdir(mode=0o700, exist_ok=True)
        (pasta / 'repo').write_text(repo + '\n', encoding='utf-8')
        for velho in pendentes(pasta):
            escrever_resultado(velho, {'codigo': 2, 'recusa': 'pedido anterior ao arranque deste escrivão; repete-o'})
        pastas[repo] = pasta
    print(f'escrivão a servir {len(repos)} worktree(s) desde {agora()}: ' + ' '.join(str(p) for p in pastas.values()), flush=True)
    while True:
        for repo, pasta in pastas.items():
            (pasta / 'batimento').write_text(agora() + '\n', encoding='utf-8')
            for pedido in pendentes(pasta):
                try:
                    dados = json.loads(pedido.read_text(encoding='utf-8'))
                except (ValueError, OSError) as erro:
                    escrever_resultado(pedido, {'codigo': 2, 'recusa': f'pedido ilegível: {erro}'})
                    continue
                if not isinstance(dados, dict):
                    escrever_resultado(pedido, {'codigo': 2, 'recusa': 'o pedido não é um objeto JSON'})
                    continue
                escrever_resultado(pedido, executar(repo, dados))
        time.sleep(2)


if __name__ == '__main__':
    principal(sys.argv[1:])
