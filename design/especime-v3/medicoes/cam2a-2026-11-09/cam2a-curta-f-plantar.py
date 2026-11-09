#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda F da CAM2-A (09.11.2026), só nas cópias do pacote.
uso: python3 cam2a-curta-f-plantar.py <pacote>"""
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
planta('diff.patch', 'P1', 'as citações da frase impressa comparam-se com a chave mascarada (um 9,0 contra um 8,0 passa outra vez)',
       "JSON.stringify(citacoes(frase, lingua)) !== JSON.stringify(citacoes(f[lingua], lingua))",
       "JSON.stringify(citacoes(normalDaChave(frase), lingua)) !== JSON.stringify(citacoes(normalDaChave(f[lingua]), lingua))")
planta('diff.patch', 'P2', 'a expressão de um modelo deixa de estar presa ao fim (uma oração acrescentada no fim casa)',
       ".join('')+'$','u');", ".join(''),'u');")
planta('diff.patch', 'P3', 'o valor de um modelo aceita qualquer texto até ao ponto e vírgula (uma atribuição escrita à mão casa)',
       r"const numero='[-+−]?\\d+(?:[., ]\\d+)*%?'", r"const numero='[-+−]?\\d+(?:[., ]\\d+)*%?[^;]*'")
planta('diff.patch', 'P4', 'a conferência dos modelos compara só os identificadores (um modelo com outro texto passa)',
       "return JSON.stringify(lista)===JSON.stringify(modelosDasFontes(strings,metodo))?[]",
       "return JSON.stringify(lista.map(m=>m.id))===JSON.stringify(modelosDasFontes(strings,metodo).map(m=>m.id))?[]")
planta('relatorio-construtor.md', 'P5', 'o relatório dá 2437 pendentes (1288 + 1139 dá 2427)',
       "Restam 2427 pendentes", "Restam 2437 pendentes")
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
