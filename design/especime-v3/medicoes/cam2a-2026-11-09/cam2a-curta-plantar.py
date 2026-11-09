#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda C da CAM2-A (09.11.2026), só nas cópias do pacote.
uso: python3 cam2a-curta-plantar.py <pacote>"""
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
planta('diff.patch', 'K1', 'uma entrada presa por citação pode levar qualquer juízo (por exemplo «julgado» escrito à mão)',
       "if ((!presa && f.juizo !== 'por julgar') || ('juizo' in f && f.juizo !== 'por julgar'))",
       "if (!presa && f.juizo !== 'por julgar')")
planta('diff.patch', 'K2', 'o detetor deixa de cortar depois de .» (só corta depois de . seguido de maiúscula)',
       "f.split(/(?<=[.!?]»)\\s+(?=\\p{Lu})/u)", "f.split(/(?<=[.!?])\\s+(?=\\p{Lu})/u)")
planta('diff.patch', 'K3', 'as frases dos concelhos voltam a contar por página e não pela coleção',
       "['municipio','distrito','regiao','area','uniaoEuropeia'].includes(key)", "['distrito','regiao','area','uniaoEuropeia'].includes(key)")
planta('diff.patch', 'K4', 'uma entrada da lista de um mandato vale se um só campo bater (o id, por exemplo)',
       "entradas.some(e=>campos.every(k=>JSON.stringify(e[k])===JSON.stringify(f[k])))", "entradas.some(e=>campos.some(k=>JSON.stringify(e[k])===JSON.stringify(f[k])))")
planta('relatorio-construtor.md', 'K5', 'o relatório dá 1053 pendentes portuguesas (1053 + 1085 não dá 2118)',
       "- 2118 pendentes: 1033 PT e", "- 2118 pendentes: 1053 PT e")
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
