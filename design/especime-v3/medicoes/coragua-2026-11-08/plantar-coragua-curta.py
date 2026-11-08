#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda D da COR-AGUA (08.11.2026), só nas cópias do pacote.
uso: python3 coragua-curta-plantar.py <pacote>"""
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
L = 'motor/content/01 Energy Water and Climate/Onde Está a Água — Technical Source/ledger_onde_pt.json'
planta('built/estudos/onde-esta-a-agua/documento/index.html', 'D1', 'a conclusão do rácio na edição portuguesa passa de 19 a 35 para 19 a 53 vezes',
       'é 19 a 35 vezes a tarifa', 'é 19 a 53 vezes a tarifa')
planta('built/en/studies/onde-esta-a-agua/document/index.html', 'D2', 'o segundo escalão da EDIA na edição inglesa passa de mais 400 % a mais 300 %',
       'the base price plus 400%', 'the base price plus 300%')
planta(L, 'D3', 'o excerto do simulador da EDIA no livro do motor com o limite do escalão mudado (125 % para 120 %)',
       'De 110% até 125% do volume autorizado – aplicação de Preço Base + 400%', 'De 110% até 120% do volume autorizado – aplicação de Preço Base + 400%')
planta('built/estudos/agua-nao-faturada/documento/index.html', 'D4', 'o inquérito da Gulbenkian volta a ser dado à Ipsos APEME na edição portuguesa',
       'pelo C-Lab', 'pela Ipsos APEME')
planta('ledger/claims/coragua-ersar-encargo-mensal-2024.yml', 'D5', 'o localizador da ERSAR aponta a barra de 2023 em vez da de 2024',
       'barra de 2024', 'barra de 2023')
for x in PAC.rglob('*'):
    if x.is_file(): os.chmod(x, x.stat().st_mode)
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
