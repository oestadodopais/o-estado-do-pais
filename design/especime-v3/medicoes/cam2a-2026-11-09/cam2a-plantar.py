#!/usr/bin/env python3
"""As cinco plantas do pacote da leitura a frio da CAM2-A (09.11.2026), só nas cópias do pacote.
uso: python3 cam2a-plantar.py <pacote>"""
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
planta('diff.patch', 'G1', 'o detetor português perde a marca «de acordo com»',
       "|de acordo com|disse|disseram|afirmou|afirma|afirmam|defende|defendeu|considera|considerou|declarou|garantiu|acusou|criticou|reconheceu|prometeu|anunciou|escreveu|escreve').test(t)};",
       "|disse|disseram|afirmou|afirma|afirmam|defende|defendeu|considera|considerou|declarou|garantiu|acusou|criticou|reconheceu|prometeu|anunciou|escreveu|escreve').test(t)};")
planta('diff.patch', 'G2', 'a lista das por registar pode crescer sempre que já tinha entradas',
       "+  return [...d].filter(k => !a.has(k)).map(k => `por registar: entrada nova: ${k}`);",
       "+  return [...d].filter(k => !a.has(k) && a.size === 0).map(k => `por registar: entrada nova: ${k}`);")
planta('diff.patch', 'G3', 'a citação só se confere no excerto a partir de quarenta carateres',
       "for (const c of pt.filter(c => [...c].length >= 12))",
       "for (const c of pt.filter(c => [...c].length >= 40))")
planta('diff.patch', 'G4', 'uma linha cujo corpo não está alojado passa sem erro no ledger:check',
       "+            erros.append(f'{linha[\"id\"]}: corpo não alojado pelo sha256'); continue",
       "+            continue")
planta('diff.patch', 'G5', 'uma entrada do registo altera a citação de Paulo Raimundo («vidas» passa a «casas»)',
       "Paulo Raimundo, a 15.10.2026, numa intervenção publicada na página do PCP: «Sim, está em curso, de facto, um assalto às nossas vidas",
       "Paulo Raimundo, a 15.10.2026, numa intervenção publicada na página do PCP: «Sim, está em curso, de facto, um assalto às nossas casas")
print(f'plantas: {ok} de 5'); sys.exit(0 if ok == 5 else 1)
