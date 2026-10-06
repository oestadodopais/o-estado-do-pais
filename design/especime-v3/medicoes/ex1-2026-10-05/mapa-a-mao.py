#!/usr/bin/env python3
"""EX1: as referências do mapa que se corrigiram à mão, depois da conta do diff, achadas por comparação e não de memória.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/ex1-2026-10-05/mapa-a-mao.py <cabeça de partida> <cabeça do código sem o mapa> [--json <saída>]

Lê o mapa da cabeça de partida e o mapa de agora (HEAD), alinha as linhas que já existiam (com os algarismos tapados, para
que só os números de linha possam diferir), e, para cada referência `ficheiro:linha` dessas linhas, compara o número de
agora com o que a conta do diff dá entre a cabeça de partida e a cabeça do código (a regra de `linhas-do-mapa.py`). As
referências em que os dois diferem são as que se corrigiram à mão. Escreve a lista e a contagem; não altera nada.
"""
import difflib, json, re, subprocess, sys
BASE, CODIGO = sys.argv[1], sys.argv[2]
SAIDA = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
MAPA = 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'
RE_REF = re.compile(r'`((?:scripts|tests|src|design|ledger|public|registos|studies-src|api|supabase)/[^`\s:]+?\.(?:mjs|astro|json|md|py|yml|js|css|sql)|package\.json|vercel\.json|CLAUDE\.md|DECISIONS\.md):(\d+)`')
git = lambda *a: subprocess.run(['git', *a], capture_output=True, text=True, check=True).stdout
antes = git('show', f'{BASE}:{MAPA}').split('\n')
agora = git('show', f'HEAD:{MAPA}').split('\n')
pedacos = {}
def hunks(f):
    if f not in pedacos:
        out = git('diff', '-U0', BASE, CODIGO, '--', f)
        pedacos[f] = [(int(m.group(1)), int(m.group(2) or 1), int(m.group(3)), int(m.group(4) or 1)) for m in re.finditer(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', out, re.M)]
    return pedacos[f]
def pela_conta(f, ln):
    desvio = 0
    for a, b, c, d in hunks(f):
        if b == 0:
            if a < ln: desvio += d
            continue
        if a + b - 1 < ln: desvio += d - b
        elif a <= ln: return c
    return ln + desvio
tapa = lambda l: re.sub(r'\d', '#', l)
sm = difflib.SequenceMatcher(a=[tapa(l) for l in antes], b=[tapa(l) for l in agora], autojunk=False)
a_mao = []; conferidas = 0
for bloco in sm.get_matching_blocks():
    for k in range(bloco.size):
        la, lb = antes[bloco.a + k], agora[bloco.b + k]
        ra, rb = RE_REF.findall(la), RE_REF.findall(lb)
        for (fa, na), (fb, nb) in zip(ra, rb):
            conferidas += 1
            conta = pela_conta(fa, int(na))
            if int(nb) != conta:
                a_mao.append({'mapa_linha_agora': bloco.b + k + 1, 'ficheiro': fa, 'na_partida': int(na), 'pela_conta': conta, 'agora': int(nb)})
r = {'o_que': 'as referências do mapa corrigidas à mão depois da conta do diff (mapa-a-mao.py)', 'cabeca_de_partida': BASE, 'cabeca_do_codigo': CODIGO,
     'referencias_comparadas': conferidas, 'corrigidas_a_mao': len(a_mao), 'lista': a_mao}
if SAIDA: open(SAIDA, 'w', encoding='utf-8').write(json.dumps(r, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: r[k] for k in ('referencias_comparadas', 'corrigidas_a_mao')}), *[f"l.{x['mapa_linha_agora']} {x['ficheiro']}: {x['na_partida']} -> conta {x['pela_conta']} -> agora {x['agora']}" for x in a_mao], sep='\n')
