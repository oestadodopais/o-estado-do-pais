#!/usr/bin/env python3
"""ED2, adenda B (07.11.2026): o cabeçalho de cada página de estudo em dois dist/ (o de main e o da cabeça), e as páginas em que as datas ou a porta mudam.
uso: python3 medir-cabecalhos.py <dist antes> <dist depois>"""
import glob, html, os, re, sys
def cabecalhos(d):
    r = {}
    for f in glob.glob(f'{d}/estudos/*/index.html') + glob.glob(f'{d}/en/studies/*/index.html'):
        m = re.search(r'<p class="estudo-publicado".*?</p>', open(f, encoding='utf-8').read(), flags=re.S)
        if m: r[os.path.relpath(f, d)] = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(0)))).strip()
    return r
a, b = cabecalhos(sys.argv[1]), cabecalhos(sys.argv[2])
assert a and set(a) == set(b), 'as duas construções não têm as mesmas páginas de estudo'
perdeu = sorted(k for k in a if ('atualizado a' in a[k] or 'updated on' in a[k]) and 'Edições:' not in b[k] and 'Editions:' not in b[k] and a[k] != b[k])
print(f'páginas de estudo: {len(a)}; com a data de atualização perdida, sem linha das edições: {len(perdeu)}')
for k in perdeu: print(f'  {k}\n    antes:  {a[k]}\n    depois: {b[k]}')
sys.exit(1 if perdeu else 0)
