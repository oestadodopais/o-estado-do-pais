#!/usr/bin/env python3
"""Confere uma leitura a frio contra o pacote que leu: cada identificador de linha que a leitura cita (em crases) tem de
existir nos livros do pacote, e cada ficheiro que cita tem de existir no pacote. Mede o que a leitura inventou.
uso: conferir-leitura.py <leitura.md> <pacote> [<prefixo de id>...]   (prefixos por omissão: og1- hab- der- oe- pm- m1- painel-)"""
import json, re, sys, pathlib
leitura = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'); pac = pathlib.Path(sys.argv[2])
prefixos = tuple(sys.argv[3:]) or ('og1-', 'hab-', 'der-', 'oe-', 'pm-', 'm1-', 'painel-', 'sobrecarga-', 'divida-', 'fluxo-', 'custo-', 'formacao-', 'licencas-', 'pib-')
ids = set()
for p in pac.rglob('*.json'):
    try: d = json.loads(p.read_text(encoding='utf-8'))
    except Exception: continue
    def walk(x):
        if isinstance(x, dict):
            for k in ('id', 'site_id', 'rh_id', 'claim'):
                v = x.get(k)
                if isinstance(v, str): ids.add(v)
            for v in x.values(): walk(v)
        elif isinstance(x, list):
            for v in x: walk(v)
    walk(d)
for p in pac.rglob('*.yml'):
    m = re.search(r'^id:\s*"?([^"\n]+)"?', p.read_text(encoding='utf-8', errors='replace'), re.M)
    if m: ids.add(m.group(1).strip())
citados = sorted({c for c in re.findall(r'`([a-z0-9][a-z0-9._-]{3,})`', leitura) if c.startswith(prefixos)})
existem = [c for c in citados if c in ids]; inventados = [c for c in citados if c not in ids]
alvos = re.findall(r'\]\(file://([^)#]+)', leitura)
from urllib.parse import unquote
ficheiros = sorted({unquote(a).split(str(pac.resolve()) + '/', 1)[1] if (str(pac.resolve()) + '/') in unquote(a) else unquote(a) for a in alvos}) or sorted({f for f in re.findall(r'\[([^\]\s]+?):(?:\d+)', leitura)})
fich_ok = [f for f in ficheiros if (pac / f).exists()]; fich_nao = [f for f in ficheiros if not (pac / f).exists()]
print(f"ids citados: {len(citados)} · existem: {len(existem)} · inventados: {len(inventados)}")
print("inventados:", ', '.join(inventados) if inventados else 'nenhum')
print(f"ficheiros citados: {len(ficheiros)} · existem: {len(fich_ok)} · não existem: {len(fich_nao)}")
if fich_nao: print("não existem:", ', '.join(fich_nao))
