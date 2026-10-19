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
import re
import signal
import subprocess
import sys
import tempfile
import time


def pasta_dos_pedidos(worktree):
    real = os.path.realpath(worktree)
    return pathlib.Path('/tmp') / ('oedp-escrivao-' + hashlib.sha1(real.encode()).hexdigest()[:12])


def agora():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def git(repo, *args, entrada=None):
    return subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True, input=entrada)


def validar_mensagem(repo, pedido):
    mensagem = pedido.get('mensagem')
    if not isinstance(mensagem, str) or not mensagem.strip():
        return 'mensagem vazia'
    if not re.search(r'^Co-Authored-By: \S[^\n]* <[^<>\s]+@[^<>\s]+>$', mensagem, re.M):
        return 'a mensagem não traz o trailer Co-Authored-By'
    if not e_motor(repo) and not re.search(r'^Claude-Session: \S+$', mensagem, re.M):
        return 'a mensagem do sítio não traz a linha Claude-Session'
    if any(c in mensagem for c in ('\u2014', '\u2013')):
        return 'travessão na mensagem'
    return None


def validar(repo, pedido):
    recusa = validar_mensagem(repo, pedido)
    if recusa:
        return recusa
    ficheiros = pedido.get('ficheiros')
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


def e_motor(repo):
    return (pathlib.Path(repo) / 'core' / 'gate.py').exists()


def iniciar_portoes(repo, pedido, repos, saida_f):
    """Os três portões do sítio fora da sandbox, a pedido do construtor (13.10.2026, a primeira passagem com a
    aprovação a `never`): o navegador das conferências (Playwright) não arranca dentro da sandbox do Codex, e sete
    conferências do `verify` fecham por isso. O escrivão corre `portoes.sh` na worktree, com a pasta de saída dentro
    dela ou em /tmp, e com `OEDP_CONFERIR_MOTOR=1` quando o pedido traz `motor`. Devolve o processo, para o ciclo
    continuar a bater enquanto ele corre, ou um resultado de recusa."""
    saida = pedido.get('saida')
    if not isinstance(saida, str) or not saida:
        return {'codigo': 2, 'recusa': 'pedido de portões sem pasta de saída'}
    raiz = pathlib.Path(os.path.realpath(repo))
    destino = pathlib.Path(saida) if os.path.isabs(saida) else raiz / saida
    pai_real = pathlib.Path(os.path.realpath(destino if destino.exists() else destino.parent))
    em_tmp = str(pai_real).startswith(('/tmp/', '/private/tmp/')) or pai_real in (pathlib.Path('/tmp'), pathlib.Path('/private/tmp'))
    if not (pai_real == raiz or raiz in pai_real.parents or em_tmp):
        return {'codigo': 2, 'recusa': f'a pasta de saída tem de ficar na worktree ou em /tmp: {saida}'}
    guiao = raiz / 'scripts' / 'leituras' / 'portoes.sh'
    if not guiao.exists():
        return {'codigo': 2, 'recusa': 'esta worktree não tem scripts/leituras/portoes.sh; os três portões são do sítio'}
    ambiente = dict(os.environ)
    motores = [r for r in repos if e_motor(r)]
    if motores:
        ambiente['RESEARCHHUB_DIR'] = motores[0]
    if pedido.get('motor'):
        if not motores:
            return {'codigo': 2, 'recusa': 'pediu o portão do motor e o lançador não deu nenhuma worktree do motor'}
        ambiente['OEDP_CONFERIR_MOTOR'] = '1'
    return subprocess.Popen(['sh', str(guiao), str(raiz), str(destino)], cwd=str(raiz), env=ambiente,
                            stdout=saida_f, stderr=subprocess.STDOUT, text=True)


def dentro_da_worktree_ou_tmp(repo, caminho):
    raiz = pathlib.Path(os.path.realpath(repo))
    alvo = pathlib.Path(caminho) if os.path.isabs(caminho) else raiz / caminho
    real = pathlib.Path(os.path.realpath(alvo if alvo.exists() else alvo.parent))
    em_tmp = str(real).startswith(('/tmp/', '/private/tmp/')) or real in (pathlib.Path('/tmp'), pathlib.Path('/private/tmp'))
    return real == raiz or raiz in real.parents or em_tmp


def iniciar_capturas(repo, pedido, saida_f):
    """As capturas das páginas fora da sandbox, a pedido do construtor (13.10.2026): o mesmo navegador que as
    conferências usam, que não arranca dentro da sandbox. Corre só o `captar.mjs` do próprio repositório, com o
    pedido JSON e a pasta de saída dentro da worktree ou em /tmp, sobre o `dist/` da worktree; o próprio guião
    recusa outra cabeça, pedidos externos e rotas em falta."""
    pedido_json = pedido.get('pedido')
    saida = pedido.get('saida')
    if not isinstance(pedido_json, str) or not pedido_json or not isinstance(saida, str) or not saida:
        return {'codigo': 2, 'recusa': 'pedido de capturas sem o ficheiro do pedido ou sem a pasta de saída'}
    raiz = pathlib.Path(os.path.realpath(repo))
    if not dentro_da_worktree_ou_tmp(repo, pedido_json) or not dentro_da_worktree_ou_tmp(repo, saida):
        return {'codigo': 2, 'recusa': 'o pedido e a pasta de saída das capturas têm de ficar na worktree ou em /tmp'}
    guiao = raiz / 'scripts' / 'leituras' / 'captar.mjs'
    if not guiao.exists():
        return {'codigo': 2, 'recusa': 'esta worktree não tem scripts/leituras/captar.mjs'}
    if not (raiz / 'dist' / 'version.json').exists():
        return {'codigo': 2, 'recusa': 'não há dist/version.json na worktree; corre os portões (o build) antes das capturas'}
    pedido_abs = pedido_json if os.path.isabs(pedido_json) else str(raiz / pedido_json)
    saida_abs = saida if os.path.isabs(saida) else str(raiz / saida)
    return subprocess.Popen(['node', str(guiao), pedido_abs, saida_abs, 'dist'], cwd=str(raiz), env=dict(os.environ),
                            stdout=saida_f, stderr=subprocess.STDOUT, text=True)


def concluir_portoes(repo, pedido, processo, saida_texto):
    raiz = pathlib.Path(os.path.realpath(repo))
    destino = pathlib.Path(pedido['saida']) if os.path.isabs(pedido['saida']) else raiz / pedido['saida']
    codigos = {}
    for g in ('build', 'verify', 'typecheck', 'motor'):
        f = destino / f'{g}.codigo'
        if f.exists():
            codigos[g] = f.read_text(encoding='utf-8').strip()
    return {'codigo': processo.returncode, 'codigos': codigos, 'saida': saida_texto[-6000:]}


def executar(repo, pedido, bater=None):
    if pedido.get('tipo') == 'fundir':
        return fundir(repo, pedido, bater)
    if pedido.get('tipo') not in (None, 'commit'):
        return {'codigo': 2, 'recusa': 'operação desconhecida'}
    recusa = validar(repo, pedido)
    if recusa:
        return {'codigo': 2, 'recusa': recusa}
    ficheiros = pedido['ficheiros']
    adicionar = git(repo, 'add', '--', *ficheiros)
    if adicionar.returncode != 0:
        return {'codigo': adicionar.returncode, 'recusa': 'git add falhou', 'saida': (adicionar.stdout + adicionar.stderr)[-3000:]}
    mensagem = pedido['mensagem'].rstrip('\n') + '\n'
    # O commit corre em processo próprio e o escrivão continua a bater enquanto os hooks correm (a leitura a frio da
    # higiene de 13.10, o achado 6: o pre-commit do motor demora cerca de dois minutos e meio, e o batimento parava).
    # A saída vai para um ficheiro temporário e não para um tubo: um hook que escreva muito encheria o tubo e
    # ficaria parado até ao teto (a leitura curta da higiene de 13.10, o achado 8).
    with tempfile.TemporaryFile(mode='w+', encoding='utf-8', errors='replace') as saida_f:
        commit = subprocess.Popen(['git', '-C', repo, 'commit', '-q', '-F', '-'], stdin=subprocess.PIPE,
                                  stdout=saida_f, stderr=subprocess.STDOUT, text=True)
        commit.stdin.write(mensagem)
        commit.stdin.close()
        inicio = time.time()
        while commit.poll() is None:
            if bater:
                bater()
            if time.time() - inicio > 1800:
                commit.kill()
                commit.wait()
                break
        saida_f.seek(0)
        saida = saida_f.read()
    cabeca = git(repo, 'rev-parse', '--short=8', 'HEAD').stdout.strip()
    resultado = {'codigo': commit.returncode, 'cabeca': cabeca, 'saida': saida[-6000:]}
    if time.time() - inicio > 1800:
        resultado['recusa'] = 'o commit passou de trinta minutos (os hooks) e foi interrompido'
    return resultado


def fundir(repo, pedido, bater=None):
    """Funde main ou master e aborta um conflito sem escolher um lado."""
    ramo = pedido.get('ramo')
    if ramo not in ('main', 'master'):
        return {'codigo': 2, 'recusa': 'fundir só aceita main ou master'}
    recusa = validar_mensagem(repo, pedido)
    if recusa:
        return {'codigo': 2, 'recusa': recusa}
    mensagem = pedido['mensagem'].rstrip('\n') + '\n'
    titulo = mensagem.splitlines()[0]
    data = re.search(r'\b\d{2}\.\d{2}\.\d{4}\b', titulo)
    if not re.search(r'\bfusão\b', titulo, re.I) or not data:
        return {'codigo': 2, 'recusa': 'a primeira linha tem de dizer a fusão e a data (DD.MM.AAAA)'}
    try:
        datetime.datetime.strptime(data.group(), '%d.%m.%Y')
    except ValueError:
        return {'codigo': 2, 'recusa': 'data da fusão inválida'}
    estado = git(repo, 'status', '--porcelain', '--untracked-files=no')
    if estado.returncode or estado.stdout.strip():
        return {'codigo': 9, 'recusa': 'a árvore tem modificações seguidas ou não se conseguiu ler'}
    for marcador in ('MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply'):
        caminho = git(repo, 'rev-parse', '--git-path', marcador)
        if caminho.returncode:
            return {'codigo': 9, 'recusa': 'não se conseguiu conferir uma operação em curso'}
        alvo = pathlib.Path(caminho.stdout.strip())
        if not alvo.is_absolute():
            alvo = pathlib.Path(repo) / alvo
        if alvo.exists():
            return {'codigo': 9, 'recusa': 'há uma operação Git em curso'}
    antes = git(repo, 'rev-parse', 'HEAD').stdout.strip()
    with tempfile.TemporaryFile(mode='w+', encoding='utf-8', errors='replace') as saida_f:
        processo = subprocess.Popen(['git', '-C', repo, '-c', 'rerere.enabled=false', 'merge', '-m', mensagem, 'refs/heads/' + ramo],
                                    stdout=saida_f, stderr=subprocess.STDOUT, text=True, start_new_session=True)
        inicio = time.monotonic()
        excedeu = False
        while processo.poll() is None:
            if bater:
                bater()
            else:
                time.sleep(0.1)
            if time.monotonic() - inicio > 1800:
                os.killpg(processo.pid, signal.SIGTERM)
                try:
                    processo.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    os.killpg(processo.pid, signal.SIGKILL)
                    processo.wait()
                excedeu = True
                break
        saida_f.seek(0)
        saida = saida_f.read()
    conflitos = git(repo, 'diff', '--cached', '--name-only', '--diff-filter=U', '-z').stdout.rstrip('\0').split('\0')
    conflitos = [f for f in conflitos if f]
    aborto = None
    if processo.returncode:
        # Só aborta a fusão que este pedido abriu; uma recusa anterior não abre MERGE_HEAD.
        if git(repo, 'rev-parse', '--verify', 'MERGE_HEAD').returncode == 0:
            aborto = git(repo, 'merge', '--abort')
            saida += aborto.stdout + aborto.stderr
    depois = git(repo, 'rev-parse', 'HEAD').stdout.strip()
    resultado = {'codigo': 1 if conflitos else processo.returncode, 'cabeca': depois,
                 'cabeca_antes': antes, 'conflitos': conflitos, 'saida': saida[-6000:]}
    if processo.returncode == 0:
        alvo = git(repo, 'rev-parse', 'refs/heads/' + ramo).stdout.strip()
        resultado['tipo_fusao'] = ('sem-alteracao' if depois == antes else
                                  'avanco-rapido' if depois == alvo else 'commit-de-fusao')
        resultado['criou_commit'] = resultado['tipo_fusao'] == 'commit-de-fusao'
    if aborto is not None:
        resultado['aborto_codigo'] = aborto.returncode
        if aborto.returncode or depois != antes or git(repo, 'status', '--porcelain', '--untracked-files=no').stdout.strip():
            resultado.update(codigo=1, recusa='a reposição depois da fusão falhada não ficou confirmada')
    if excedeu:
        resultado.update(codigo=1, recusa='a fusão passou de trinta minutos')
    return resultado


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
                if dados.get('tipo') in ('portoes', 'capturas'):
                    longo = dados['tipo']
                    teto = 3000 if longo == 'portoes' else 1200
                    saida_f = tempfile.TemporaryFile(mode='w+', encoding='utf-8', errors='replace')
                    processo = iniciar_portoes(repo, dados, list(pastas), saida_f) if longo == 'portoes' else iniciar_capturas(repo, dados, saida_f)
                    if isinstance(processo, dict):
                        saida_f.close()
                        escrever_resultado(pedido, processo)
                        continue
                    print(f"{agora()} {pedido.name}: {longo} a correr (pid {processo.pid})", flush=True)
                    inicio = time.time()
                    while processo.poll() is None:
                        for outra in pastas.values():
                            (outra / 'batimento').write_text(agora() + '\n', encoding='utf-8')
                        if time.time() - inicio > teto:
                            processo.kill()
                            processo.wait()
                            break
                        time.sleep(1)
                    saida_f.seek(0)
                    saida_texto = saida_f.read()
                    saida_f.close()
                    if longo == 'portoes':
                        resultado = concluir_portoes(repo, dados, processo, saida_texto)
                    else:
                        resultado = {'codigo': processo.returncode, 'saida': saida_texto[-6000:]}
                    if time.time() - inicio > teto:
                        resultado['recusa'] = f'{longo}: passou do teto ({teto // 60} minutos) e foi interrompido'
                    escrever_resultado(pedido, resultado)
                    continue
                def bater(pastas=pastas):
                    for outra in pastas.values():
                        (outra / 'batimento').write_text(agora() + '\n', encoding='utf-8')
                    time.sleep(1)
                escrever_resultado(pedido, executar(repo, dados, bater))
        time.sleep(2)


if __name__ == '__main__':
    principal(sys.argv[1:])
