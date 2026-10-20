"""Confere o grupo da comparação no cubo alojado e regista o seu hash."""
import hashlib
import json
import re
import sys
from pathlib import Path
motor, saida = map(Path, sys.argv[1:])
ficheiro = 'content/26 Saude e Parcerias Efeitos/source/saude/eurostat-prs2.json'
corpo = (motor / ficheiro).read_bytes()
c = json.loads(corpo)
membros = 'BE BG CZ DK DE EE IE EL ES FR HR IT CY LV LT LU HU MT NL AT PL PT RO SI SK FI SE'.split()
def valor(g):
    coords = dict(freq='A', unit='P_HTHAB', wstatus='PRACT', med_spec='PHYS', geo=g, time='2024')
    i = 0
    for d, n in zip(c['id'], c['size']):
        i = i * n + c['dimension'][d]['category']['index'][coords[d]]
    return c['value'].get(str(i))
valores = {g: valor(g) for g in membros}
presentes = {g: v for g, v in valores.items() if v is not None}
alojados = {g: valor(g) for g in c['dimension']['geo']['category']['index'] if re.fullmatch('[A-Z]{2}', g)}
ausentes = [g for g in membros if valores[g] is None]
assert ausentes == ['SK']
assert min(presentes, key=presentes.get) == 'BE'
assert max(presentes, key=presentes.get) == 'EL'
assert any(v is not None and v < presentes['BE'] for g, v in alojados.items() if g not in membros)
r = dict(ficheiro=ficheiro, sha256=hashlib.sha256(corpo).hexdigest(), ano='2024', categoria='PRACT',
         membros=len(membros), com_valor=len(presentes), ausentes=ausentes, valores=valores,
         minimo='BE', maximo='EL', paises_alojados=len(alojados),
         fora_da_uniao={g: v for g, v in alojados.items() if g not in membros})
saida.write_text(json.dumps(r, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: r[k] for k in ['membros', 'com_valor', 'ausentes', 'minimo', 'maximo', 'paises_alojados']}))
