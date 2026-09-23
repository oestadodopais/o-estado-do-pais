#!/usr/bin/env python3
"""O que a passagem de correção do R1 fez no motor, num JSON (23.09.2026, achado 4).

    python3 design/especime-v3/medicoes/r1-2026-09-23/recolher-motor-correcao.py <repositório do motor>

Como `recolher-motor.py`, e pela mesma razão: o motor é privado e não vive dentro
do sítio, e o `medir.py` do bloco lê só o que está dentro do sítio. Este guião lê
do git do motor o ramo `r1c-2026-09-23`, a base, a cabeça e cada commit com o seu
trailer; a medida dos chamadores das portas do cliente, na base (antes) e na
cabeça (depois), por `git grep`; como os commits do R1 aterraram em `master`; e,
das saídas guardadas nesta pasta, o que cada conferência disse. Escreve
`motor/motor-correcao.json`. Nenhum número é escrito à mão, e o guião falha se
uma linha que procura não estiver lá.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MOTOR = Path(sys.argv[1]).resolve()
RAMO = 'r1c-2026-09-23'
# O nome de um navegador tal como vai num User-Agent: o mesmo padrão da prova 12
# de core/http_nome_test.py, montado aqui em pedaços pela mesma razão.
NAVEGADOR = '(Mozilla|AppleWebKit|Chrome|Safari|Firefox|Gecko|Edg)' + '/[0-9]'
CODIGO = ['*.py', '*.sh', '*.js', '*.mjs', '*.ts']


def git(*a, ok=(0,)):
    r = subprocess.run(['git', '-c', 'core.quotepath=off', *a], cwd=MOTOR, capture_output=True, text=True)
    if r.returncode not in ok:
        raise SystemExit(f'git {" ".join(a)}: {r.stderr}')
    return r.stdout


def linhas_com(ref, padrao, *caminhos, fixo=False):
    """As linhas que casam com o padrão em `ref`, como (ficheiro, n, conteúdo).

    Zero linhas é um resultado, e o código 1 do `git grep` di-lo; qualquer outro
    código faz o guião parar.
    """
    bandeira = '-F' if fixo else '-E'
    saida = git('grep', '-n', '-I', bandeira, padrao, ref, '--', *caminhos, ok=(0, 1))
    fora = []
    for l in saida.splitlines():
        if not l:
            continue
        _, resto = l.split(':', 1)                       # tira o `ref:` da frente
        m = re.match(r'(.+?):(\d+):(.*)', resto)
        fora.append((m.group(1), int(m.group(2)), m.group(3)))
    return fora


def chamadas(ref, padrao, *caminhos):
    """As linhas de código (não as de comentário, nem uma definição) que casam com o padrão."""
    return [(f, n, c) for f, n, c in linhas_com(ref, padrao, *caminhos)
            if not c.lstrip().startswith('#') and not c.lstrip().startswith('def ')]


def conta(texto, rx, nome):
    m = re.search(rx, texto, re.M)
    if not m:
        raise SystemExit(f'{nome}: não encontrei {rx!r}')
    return m


base = git('merge-base', 'master', RAMO).strip()
cabeca = git('rev-parse', RAMO).strip()
commits = []
for sha in git('rev-list', '--reverse', f'{base}..{RAMO}').split():
    corpo = git('log', '-1', '--format=%B', sha)
    trailer = re.search(r'^Co-Authored-By: (.+?) <', corpo, re.M)
    ficheiros = [f for f in git('diff-tree', '--no-commit-id', '--name-only', '-r', sha).split('\n') if f]
    commits.append({'sha': sha[:7], 'assunto': git('log', '-1', '--format=%s', sha).strip(),
                     'trailer': trailer.group(1) if trailer else None, 'ficheiros': len(ficheiros)})
estat = git('diff', '--shortstat', f'{base}..{RAMO}')
m_est = re.search(r'(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?', estat)

# Os chamadores das portas, antes (na base) e depois (na cabeça). Uma prova do
# detetor antes de contar: o mesmo padrão tem de casar com um nome montado aqui.
if not re.search(NAVEGADOR, 'Mozilla' + '/5.0 (planta)'):
    raise SystemExit('o padrão do nome de um navegador não casa com o conhecido-positivo')
portas = {}
for nome, ref in (('antes', base), ('depois', cabeca)):
    fs = chamadas(ref, r'for_source\(', *CODIGO)
    ua = chamadas(ref, r'HttpClient\([^)]*user_agent=', *CODIGO)
    portas[nome] = {
        'httpclient_browser_ua_true': [f'{f}:{n}' for f, n, _ in chamadas(ref, r'HttpClient\([^)]*browser_ua=True', *CODIGO)],
        'nome_de_navegador_no_codigo': sorted({f for f, _, _ in linhas_com(ref, NAVEGADOR, *CODIGO)}),
        'for_source_chamadas': len(fs),
        'for_source_com_sources_get': sum(1 for _, _, c in fs if re.search(r'for_source\(sources\.get\(', c)),
        # As outras, escritas por inteiro para quem as quiser conferir: passam uma
        # variável lida do registo, uma fixture posta no registo, ou são a própria
        # chamada substituída por uma cena de falsificação.
        'for_source_outras': [f'{f}:{n}: {c.strip()}' for f, n, c in fs if not re.search(r'for_source\(sources\.get\(', c)],
        'user_agent_chamadas': [f'{f}:{n}: {c.strip()}' for f, n, c in ua],
        'registo_com_a_chave_browser_ua': len(linhas_com(ref, '"browser_ua":', 'core/sources.py', fixo=True)),
        'constante_de_navegador_no_cliente': len(linhas_com(ref, 'BROWSER_UA = (', 'core/http.py', fixo=True)),
    }
    portas[nome]['httpclient_browser_ua_true_n'] = len(portas[nome]['httpclient_browser_ua_true'])
    portas[nome]['nome_de_navegador_no_codigo_n'] = len(portas[nome]['nome_de_navegador_no_codigo'])
    portas[nome]['user_agent_chamadas_n'] = len(portas[nome]['user_agent_chamadas'])
    portas[nome]['for_source_outras_n'] = len(portas[nome]['for_source_outras'])
    # Das outras, as que só NOMEIAM a função, numa docstring ou numa mensagem
    # («`for_source()` levanta…», «for_source() recebeu…»: parênteses vazios), e as
    # que a CHAMAM com um argumento que não é `sources.get(...)` escrito ali.
    portas[nome]['for_source_mencoes_em_texto_n'] = sum(
        1 for linha in portas[nome]['for_source_outras'] if re.search(r'for_source\(\)', linha))
    portas[nome]['for_source_por_variavel'] = [
        linha for linha in portas[nome]['for_source_outras'] if not re.search(r'for_source\(\)', linha)]
    portas[nome]['for_source_por_variavel_n'] = len(portas[nome]['for_source_por_variavel'])
browser_ua_estudo_10 = sorted({f for f, _, _ in chamadas(base, r'HttpClient\([^)]*browser_ua=True', 'content/10 Housing')})
ficheiros_de_codigo = len([f for f in git('ls-files', '-z', '--', *CODIGO).split('\0') if f])

# Os commits do R1 como aterraram em master, pelo assunto (foram rebaseados).
r1 = json.loads((AQUI / 'motor' / 'motor.json').read_text(encoding='utf-8'))
em_master = {}
for linha in git('log', '--format=%h %s', f"{r1['base_master']}..master").splitlines():
    sha, assunto = linha.split(' ', 1)
    em_master[assunto] = sha
aterrados = [{'no_ramo': c['sha'], 'em_master': em_master.get(c['assunto']), 'assunto': c['assunto']} for c in r1['commits']]
if any(a['em_master'] is None for a in aterrados):
    raise SystemExit(f'um commit do R1 não se encontra em master pelo assunto: {aterrados}')

gate = (AQUI / 'motor' / 'core-gate-correcao.txt').read_text(encoding='utf-8')
nome_test = (AQUI / 'motor' / 'http-nome-test-correcao.txt').read_text(encoding='utf-8')
nucleo = (AQUI / 'saude-nucleo-correcao.txt').read_text(encoding='utf-8')
dinheiro = (AQUI / 'saude-pt-public-money-correcao.txt').read_text(encoding='utf-8')
plantas = json.loads((AQUI / 'plantas-motor-correcao.json').read_text(encoding='utf-8'))
varridos = conta(nome_test, r'o código do motor, varrido\s+(\d+) ficheiros, (\d+) com o nome de um navegador', 'http_nome_test')

saida = {
    'ramo': RAMO, 'base_master': base[:7], 'cabeca': cabeca[:7],
    'commits': commits, 'commits_n': len(commits),
    'diff_ficheiros': int(m_est.group(1)), 'diff_linhas_mais': int(m_est.group(2) or 0),
    'diff_linhas_menos': int(m_est.group(3) or 0),
    'portas': portas,
    'browser_ua_true_no_estudo_10_ficheiros': browser_ua_estudo_10,
    'browser_ua_true_no_estudo_10_ficheiros_n': len(browser_ua_estudo_10),
    'ficheiros_de_codigo_na_cabeca': ficheiros_de_codigo,
    'r1_aterrado_em_master': aterrados,
    'core_gate': {'resultado': conta(gate, r'^GATE: (PASS|FAIL)', 'core.gate').group(1),
                  'codigo': int(conta(gate, r'^codigo (\d+)', 'core.gate').group(1)),
                  'cabeca': conta(gate, r'^([0-9a-f]{7}) ', 'core.gate').group(1)},
    'http_nome_test': {'conferencias': int(conta(nome_test, r'HTTP_NOME: PASS — (\d+) conferências', 'http_nome_test').group(1)),
                       'ficheiros_varridos': int(varridos.group(1)), 'com_nome_de_navegador': int(varridos.group(2))},
    'saude_nucleo': [int(x) for x in conta(nucleo, r'^(\d+)/(\d+) checks passed', 'núcleo').groups()],
    'saude_pt_public_money': [int(x) for x in conta(dinheiro, r'^(\d+)/(\d+) checks passed', 'pt_public_money').groups()],
    'plantas': {'cabeca': plantas['cabeca_do_motor'][:7], 'corridas': len(plantas['plantas']),
                'morderam': sum(1 for p in plantas['plantas'] if p['mordeu']),
                'repostas': sum(1 for p in plantas['plantas'] if p['antes'] == p['reposto']),
                'passaram': sum(1 for p in plantas['plantas'] if p['passou'])},
}
(AQUI / 'motor' / 'motor-correcao.json').write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(saida, ensure_ascii=False, indent=2))
