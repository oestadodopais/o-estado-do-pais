#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda J da COR-AGUA (08.11.2026), só nas cópias do pacote.
uso: python3 coragua-curta-j-plantar.py <pacote>"""
import subprocess, sys, pathlib, os
PAC = pathlib.Path(sys.argv[1]); P = '<caminho>'
ok = 0
def planta(rel, pid, desc, old, new):
    global ok
    f = PAC / rel
    if not f.exists(): print(f'{pid}: ficheiro ausente {rel}'); return
    n = f.read_text(encoding='utf-8', errors='replace').count(old)
    if n != 1: print(f'{pid}: âncora com {n} ocorrências em {rel}: {old[:60]!r}'); return
    st = f.stat()
    r = subprocess.run([sys.executable, P, str(PAC), rel, pid, desc, old, new], capture_output=True, text=True)
    os.utime(f, ns=(st.st_atime_ns, st.st_mtime_ns))  # a planta não muda a hora do ficheiro (a leitura curta da adenda H)
    print(f'{pid}: exit={r.returncode} {(r.stdout or r.stderr).strip()[:110]}')
    ok += r.returncode == 0
T = 'motor/content/01 Energy Water and Climate/Onde Está a Água — Technical Source/'
planta('built/estudos/onde-esta-a-agua/documento/index.html', 'J1', 'o cartão português passa a comparar com a tarifa «em todo o Alqueva»',
       'face à tarifa por metro cúbico nos blocos de rega do Alqueva', 'face à tarifa por metro cúbico em todo o Alqueva')
planta('built/en/studies/onde-esta-a-agua/document/index.html', 'J2', 'o cartão inglês volta a dizer o que o regante paga',
       "against the per-cubic-metre tariff in Alqueva's irrigation blocks", "against what an Alqueva irrigator pays per cubic metre")
planta(T + 'body_onde_pt.html', 'J3', 'o corpo português do motor volta ao «acrescenta-lhe»',
       'acrescenta à tarifa a taxa', 'acrescenta-lhe a taxa')
planta('studies-src/onde-esta-a-agua/en.html', 'J4', 'a fonte inglesa acrescenta a taxa ao encargo doméstico',
       'adds to the tariff the water-resources levy', 'adds to the household charge the water-resources levy')
planta(T + 'onde_body.html', 'J5', 'o cartão no corpo inglês do motor fala do encargo total',
       "a household's average charge per cubic metre, against", "a household's total charge per cubic metre, against")
for x in PAC.rglob('*'):
    if x.is_file(): os.chmod(x, x.stat().st_mode)
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
