#!/usr/bin/env python3
"""H3: acerta no mapa do repositório as citações que ficaram longe da linha citada por causa deste bloco.

Compara as duas corridas de `scripts/leituras/conferir-mapa.py` guardadas nesta pasta: a do commit do brief
(`conferir-mapa-base.txt`, sobre uma extração desse commit) e a da cabeça do código (`conferir-mapa.txt`). Uma citação
que está longe agora e não estava longe na base é uma citação que andou com este bloco: o bloco acrescentou linhas acima
dela no ficheiro citado. Para cada uma, procura na linha do mapa a citação («…») e a referência `ficheiro:linha` que a
precede, e troca o número dessa referência pela linha onde o conferidor a acha agora, no mesmo ficheiro (a mais perto
da antiga, se houver mais do que uma). Não toca nas citações que já estavam longe na base (são de quem cuida do mapa),
nem no texto de nenhuma citação. Escreve `mapa-acertado.json` com cada troca.
Uso, da raiz da worktree:  python3 design/especime-v3/medicoes/h3-2026-10-05/acertar-mapa.py
"""
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
PASTA = Path('design/especime-v3/medicoes/h3-2026-10-05')
MAPA = Path('design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md')
LINHA = re.compile(r'\s+mapa l\.(\d+) «(.*?)» citada em \[(.*?)\] → está em \[(.*?)\]')
REF = re.compile(r'`([^`\s]+?):(\d+)`')


def longe(nome):
    return [(int(m.group(1)), m.group(2), m.group(4)) for m in map(LINHA.match, (PASTA / nome).read_text(encoding='utf-8').splitlines()) if m]


base = {(c) for _, c, _ in longe('conferir-mapa-base.txt')}
agora = [x for x in longe('conferir-mapa.txt') if x[1] not in base]
linhas = MAPA.read_text(encoding='utf-8').split('\n')
trocas = []
falhas = []
for l, citacao, onde in agora:
    texto = linhas[l - 1]
    i = texto.find('«' + citacao)
    if i < 0:
        falhas.append({'linha': l, 'citacao': citacao, 'porque': 'a citação não está na linha do mapa'})
        continue
    antes = [m for m in REF.finditer(texto[:i])]
    if not antes:
        falhas.append({'linha': l, 'citacao': citacao, 'porque': 'nenhuma referência antes da citação'})
        continue
    ref = antes[-1]
    ficheiro, velha = ref.group(1), int(ref.group(2))
    novos = [x.strip().strip("'").rsplit(':', 1) for x in onde.split(',') if x.strip()]
    # um caminho que o conferidor cortou (sem «:linha») não se usa
    candidatos = [int(par[1]) for par in novos if len(par) == 2 and par[0] == ficheiro and par[1].isdigit()]
    if not candidatos:
        falhas.append({'linha': l, 'citacao': citacao, 'porque': f'o conferidor acha-a noutro ficheiro ({onde})'})
        continue
    nova = min(candidatos, key=lambda n: abs(n - velha))
    texto = texto[: ref.start(2)] + str(nova) + texto[ref.end(2):]
    linhas[l - 1] = texto
    trocas.append({'linha_do_mapa': l, 'citacao': citacao, 'ficheiro': ficheiro, 'antes': velha, 'depois': nova})
MAPA.write_text('\n'.join(linhas), encoding='utf-8')
saida = {'guiao': str(PASTA / 'acertar-mapa.py'), 'citacoes_que_andaram': len(agora), 'trocas': trocas, 'falhas': falhas}
(PASTA / 'mapa-acertado.json').write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'H3 mapa: {len(agora)} citação(ões) que andaram com o bloco, {len(trocas)} acertada(s), {len(falhas)} por acertar.')
for f in falhas:
    print(f'  por acertar: l.{f["linha"]} «{f["citacao"]}»: {f["porque"]}')
raise SystemExit(1 if falhas else 0)
