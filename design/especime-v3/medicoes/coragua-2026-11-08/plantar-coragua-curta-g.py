#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta das adendas G e H da COR-AGUA (08.11.2026), só nas cópias do pacote.
uso: python3 coragua-curta-g-plantar.py <pacote>"""
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
planta('built/estudos/onde-esta-a-agua/documento/index.html', 'G1', 'a conclusão portuguesa perde «nos blocos de rega»',
       'para a rega nos blocos de rega (cálculo', 'para a rega (cálculo')
planta('built/en/studies/onde-esta-a-agua/document/index.html', 'G2', 'o consumo de referência na conclusão inglesa passa de 10 a 15 m³',
       'consumption of 10 m³ a month', 'consumption of 15 m³ a month')
planta('built/correcoes/index.html', 'G3', 'o rácio antigo na entrada portuguesa do registo passa de 27 a 29',
       'data-claim="coragua-historico-racio-minimo" class="claim-value">27<', 'data-claim="coragua-historico-racio-minimo" class="claim-value">29<')
planta('ledger/claims/coragua-ersar-encargo-mensal-2024.yml', 'G4', 'o excerto da ERSAR cita a Figura 552 em vez da 553',
       'Figura 553⁸⁷.', 'Figura 552⁸⁷.')
planta('built/en/studies/onde-esta-a-agua/document/index.html', 'G5', 'a frase inglesa dos valores base perde «for the irrigation blocks»',
       'The 2026 base values for the irrigation blocks are', 'The 2026 base values are')
for x in PAC.rglob('*'):
    if x.is_file(): os.chmod(x, x.stat().st_mode)
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
