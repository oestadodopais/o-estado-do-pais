#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura a frio da COR-AGUA (08.11.2026), só nas cópias do pacote.
uso: python3 coragua-plantar.py <pacote>"""
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
planta('built/estudos/onde-esta-a-agua/documento/index.html', 'C1', 'a citação do despacho da EDIA trocada: «atualizar» passa a «alterar»',
       'veio atualizar alguns aspetos', 'veio alterar alguns aspetos')
planta('built/en/studies/agua-nao-faturada/document/index.html', 'C2', 'o mínimo da eficiência da DGADR na edição inglesa passa de 8 % a 6 %',
       'lows of 8% (Alvor)', 'lows of 6% (Alvor)')
planta('ledger/claims/coragua-tc-auditoria-ano.yml', 'C3', 'o excerto do Tribunal de Contas com o ano do diferendo mudado (2013 para 2011)',
       'pela EDP desde 2013', 'pela EDP desde 2011')
planta('ledger/claims/coragua-gulbenkian-sem-contador.yml', 'C4', 'o sha256 da cópia da Gulbenkian mudado num algarismo',
       '623abfec8fcc7aa9c9c2cfe7e7ad0e9494fb04429d282be9c687b93b64622bd7', '623abfec8fcc7aa9c9c2cfe7e7ad0e9494fb04429d282be9c687b93b64622bd8')
planta('built/en/studies/agua-nao-faturada/document/index.html', 'C5', 'um valor pago do PRR nos dados do gráfico inglês diferente do português (18993466 para 18939466)',
       '18993466', '18939466')
# a hora de mudança (ctime) não se repõe: muda-se em todos os ficheiros do pacote, para nenhuma planta se ver por ela (a leitura da HIG-6A, 15)
for x in PAC.rglob('*'):
    if x.is_file(): os.chmod(x, x.stat().st_mode)
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
