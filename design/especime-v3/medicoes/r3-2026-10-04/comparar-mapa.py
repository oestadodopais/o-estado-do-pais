#!/usr/bin/env python3
"""R3: as citações do mapa do repositório que ficaram longe da linha citada com este bloco.

Compara as duas corridas de `scripts/leituras/conferir-mapa.py` guardadas nesta pasta, a da cabeça do brief
(`conferir-mapa-base.txt`, sobre uma extração de 358e3649) e a da cabeça do bloco (`conferir-mapa.txt`), pelo texto citado,
e diz quais das citações longe da linha são novas e quantas delas citam um ficheiro que o bloco mudou
(`git diff --name-only 358e3649..HEAD`). O conhecido-positivo: a corrida da base tem citações longe da linha, e o mesmo
leitor das linhas encontra-as.
Uso, da raiz da worktree:  python3 design/especime-v3/medicoes/r3-2026-10-04/comparar-mapa.py
"""
import json
import re
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
PASTA = Path('design/especime-v3/medicoes/r3-2026-10-04')
LINHA = re.compile(r'\s+mapa l\.(\d+) «(.*?)» citada em \[(.*?)\] → está em \[(.*?)\]')


def longe(nome):
    return [(m.group(2), m.group(3), m.group(4)) for m in map(LINHA.match, (PASTA / nome).read_text(encoding='utf-8').splitlines()) if m]


def ficheiros(lista):
    return {x.strip().strip("'").split(':')[0] for x in lista.split(',') if x.strip()}


base, agora = longe('conferir-mapa-base.txt'), longe('conferir-mapa.txt')
tocados = set(subprocess.run(['git', 'diff', '--name-only', '358e3649..HEAD'], capture_output=True, text=True, check=True).stdout.split())
textos_da_base = {b[0] for b in base}
novas = [a for a in agora if a[0] not in textos_da_base]
do_bloco = [a for a in novas if ficheiros(a[2]) & tocados]
saida = {
    'guiao': str(PASTA / 'comparar-mapa.py'),
    'longe_na_base': len(base),
    'longe_agora': len(agora),
    'novas_longe': len(novas),
    'novas_longe_em_ficheiros_tocados_pelo_bloco': len(do_bloco),
    'novas': [{'texto': a[0], 'esta_em': a[2], 'em_ficheiro_tocado_pelo_bloco': a in do_bloco} for a in novas],
    'conhecido_positivo': {'o_que': 'a corrida da base tem citações longe da linha, e o mesmo leitor encontra-as', 'encontrado': len(base) > 0},
}
(PASTA / 'mapa-citacoes-que-andaram.json').write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f"R3 mapa: {len(base)} longe na base, {len(agora)} agora, {len(novas)} novas, {len(do_bloco)} em ficheiros que o bloco mudou.")
raise SystemExit(0 if saida['conhecido_positivo']['encontrado'] else 2)
