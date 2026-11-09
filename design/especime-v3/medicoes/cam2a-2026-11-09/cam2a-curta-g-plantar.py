#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura curta da adenda G da CAM2-A (09.11.2026), só nas cópias do pacote.
uso: python3 cam2a-curta-g-plantar.py <pacote>"""
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
planta('diff.patch', 'G1', 'o catálogo volta a aceitar linhas sem releitura (todas as linhas no âmbito que não são afirmações)',
       "Boolean(linhaDoAmbito(l) && Array.isArray(l.verifications) && l.verifications.length && l.afirmacao !== true",
       "Boolean(linhaDoAmbito(l) && l.afirmacao !== true")
planta('diff.patch', 'G2', 'a recusa de uma alternativa tipada só olha as unidades (um nome de indicador com «segundo» passa)',
       "for(const a of dados.alternativas) if(tiposDaFrase(a.texto,a.lingua).length)",
       "for(const a of dados.alternativas) if(a.campo==='unidade'&&tiposDaFrase(a.texto,a.lingua).length)")
planta('diff.patch', 'G3', 'a simulação deixa de provar que cada revisão impressa casa com o modelo',
       "assert.equal(modeloDaFrase(b.frases[0],p.lingua,p.tipo),'revisao-'+p.lingua,'catálogo restrito perdeu revisão impressa');revisoesImpressas++;",
       "revisoesImpressas++;")
planta('diff.patch', 'G4', 'a base do histórico fica em d9a6489a9 (o relatório e a adenda dizem d21c48f0b)',
       "+const BASE = 'd21c48f0b';", "+const BASE = 'd9a6489a9';")
planta('relatorio-construtor.md', 'G5', 'o relatório dá 2623 linhas no catálogo (são 2632)',
       "O catálogo medido tem 2632 linhas", "O catálogo medido tem 2623 linhas")
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
