#!/usr/bin/env python3
"""MOT1, as medidas do §0: os quatro estudos compostos de Évora, recompostos em memória contra o publicado, e o que
cada gabarito tem. Só leitura. uso: python3 -B medir-mot1.py <motor>"""
import sys, re, difflib, hashlib
from pathlib import Path
motor = Path(sys.argv[1]); sys.path.insert(0, str(motor))
from core import compor as C
tot = {'gabaritos': 0, 'blocos': 0, 'emendas': 0, 'sai': 0, 'marcadores': 0, 'iguais': 0}
for pasta in sorted((motor / 'content').glob('1[6-9] *')):
    fontes = {}
    for g in sorted((pasta / 'Technical Source').glob('documento.*.md.tmpl')):
        t = g.read_text(encoding='utf-8').splitlines()
        nb = sum(1 for l in t if l.startswith('@@bloco '))
        ne = sum(1 for l in t if re.match(r'@@\s+(troca|sem-linha|sem-coluna|sem-item|cabecalho|acrescenta-cabecalho):', l))
        ns = sum(1 for l in t if l.startswith('@@sai '))
        nf = sum(1 for l in t if l.startswith('@@fonte '))
        comp = C.compor(g, fontes)
        atual = (pasta / comp.edicao).read_text(encoding='utf-8')
        igual = comp.md == atual
        dif = [l for l in difflib.unified_diff(atual.splitlines(), comp.md.splitlines(), lineterm='', n=0) if l[:1] in '+-' and l[:3] not in ('+++', '---')]
        nm = len(re.findall(r'⟦[^⟧]+⟧', '\n'.join(t)))
        print(f'{pasta.name} | {g.name} | fontes {nf} | diretivas @@bloco {nb} | emendas {ne} | @@sai {ns} | marcadores na prosa {nm} | linhas {len(atual.splitlines())} | igual ao publicado: {"sim" if igual else "não"} | linhas diferentes {len(dif)}')
        for l in dif[:6]: print('     ', l[:170])
        tot['gabaritos'] += 1; tot['blocos'] += nb; tot['emendas'] += ne; tot['sai'] += ns; tot['marcadores'] += nm; tot['iguais'] += igual
print('TOTAL', tot)
