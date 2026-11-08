#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda I da COR-AGUA (08.11.2026), só nas cópias do pacote.
uso: python3 coragua-curta-i-plantar.py <pacote>"""
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
B = 'motor/content/01 Energy Water and Climate/Onde Está a Água — Technical Source/onde_body.html'
planta('built/estudos/onde-esta-a-agua/documento/index.html', 'I1', 'a conclusão portuguesa diz «até ao dobro do volume atribuído»',
       'até ao volume atribuído', 'até ao dobro do volume atribuído')
planta('built/en/studies/onde-esta-a-agua/document/index.html', 'I2', 'a linha da fonte do cartão inglês volta a 2017',
       'EDIA 2026 tariff notice', 'EDIA 2017 tariff notice')
planta('ledger/claims/coragua-ersar-encargo-mensal-2024.yml', 'I3', 'a nota 87 no excerto da ERSAR troca a taxa de gestão de resíduos por uma taxa de saneamento',
       'Taxa de Recursos Hídricos e Taxa de Gestão de Resíduos', 'Taxa de Recursos Hídricos e Taxa de Saneamento')
planta(B, 'I4', 'o corpo inglês do motor diz «above the allotted volume»',
       'up to the allotted volume', 'above the allotted volume')
planta('built/estudos/onde-esta-a-agua/documento/index.html', 'I5', 'a conclusão portuguesa passa a «9 a 35 vezes»',
       'Esse valor é 19 a 35 vezes', 'Esse valor é 9 a 35 vezes')
for x in PAC.rglob('*'):
    if x.is_file(): os.chmod(x, x.stat().st_mode)
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
