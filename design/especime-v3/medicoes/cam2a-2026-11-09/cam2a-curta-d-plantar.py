#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda D da CAM2-A (09.11.2026), só nas cópias do pacote.
uso: python3 cam2a-curta-d-plantar.py <pacote>"""
import subprocess, sys, pathlib
PAC = pathlib.Path(sys.argv[1]); P = str(pathlib.Path.home() / 'Instruments/OEstadoDoPais/scripts/leituras/plantar.py')
ok = 0
def planta(rel, pid, desc, old, new):
    global ok
    f = PAC / rel
    if not f.exists(): print(f'{pid}: ficheiro ausente {rel}'); return
    n = f.read_text(encoding='utf-8', errors='replace').count(old)
    if n != 1: print(f'{pid}: âncora com {n} ocorrências em {rel}: {old[:60]!r}'); return
    r = subprocess.run([sys.executable, P, str(PAC), rel, pid, desc, old, new], capture_output=True, text=True)
    print(f'{pid}: exit={r.returncode} {(r.stdout or r.stderr).strip()[:110]}')
    ok += r.returncode == 0
planta('diff.patch', 'M1', 'uma entrada sem o campo do juízo (ou com null) passa',
       "+      if (f.juizo !== 'por julgar') erros.push(`${id}: juízo tem de ficar por julgar`);",
       "+      if (f.juizo != null && f.juizo !== 'por julgar') erros.push(`${id}: juízo tem de ficar por julgar`);")
planta('diff.patch', 'M2', 'a cobertura pelo par só corre do português para o inglês',
       "+    const par=parDaFrase(paginas,o);if(!par)continue;",
       "+    const par=parDaFrase(paginas,o);if(!par||o.lingua==='en')continue;")
planta('diff.patch', 'M3', 'o contador dos pares sem cobertura nunca sobe',
       "if(!cobertura.has(chave({estudo:pagina.estudo,lingua:destino,frase:par.frase})))m.sem_cobertura++;",
       "if(!cobertura.has(chave({estudo:pagina.estudo,lingua:destino,frase:par.frase})))m.sem_cobertura+=0;")
planta('diff.patch', 'M4', 'o teto das por registar só morde no dobro',
       "+  if (r.pendentes.length > TETO_PENDENTES) {",
       "+  if (r.pendentes.length > TETO_PENDENTES * 2) {")
planta('relatorio-construtor.md', 'M5', 'o relatório dá 2453 pendentes (1292 + 1143 dá 2435)',
       "1314 PT e 1165 EN, e 2435 pendentes:", "1314 PT e 1165 EN, e 2453 pendentes:")
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
