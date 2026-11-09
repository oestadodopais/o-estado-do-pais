#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda E da CAM2-A (09.11.2026), só nas cópias do pacote.
uso: python3 cam2a-curta-e-plantar.py <pacote>"""
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
planta('diff.patch', 'P1', 'a máscara engole também a palavra a seguir ao número (3 % dos agricultores e 3 % das famílias dão a mesma chave)',
       "(?: \\p{Nd}{3}(?!\\p{Nd})))*%?/gu, '⟦número⟧');", "(?: \\p{Nd}{3}(?!\\p{Nd})))*%?(?:\\s+\\p{L}+)?/gu, '⟦número⟧');")
planta('diff.patch', 'P2', 'a chave da cobertura volta ao texto inteiro',
       "${f.sha256 ?? sha256(normalDaChave(f.frase))}", "${f.sha256 ?? sha256(normal(f.frase))}")
planta('diff.patch', 'P3', 'a presença do par inglês compara o texto inteiro',
       "return par && normalDaChave(par.frase) === normalDaChave(f.en);", "return par && normal(par.frase) === normal(f.en);")
planta('diff.patch', 'P4', 'o inventário guarda o sha256 da frase sem normalizar',
       "sha256:sha256(normalDaChave(frase))}", "sha256:sha256(frase)}")
planta('relatorio-construtor.md', 'P5', 'o relatório dá 2343 pendentes (1291 + 1142 dá 2433)',
       "Restam 2433 pendentes", "Restam 2343 pendentes")
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
