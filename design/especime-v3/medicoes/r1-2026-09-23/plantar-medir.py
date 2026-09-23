#!/usr/bin/env python3
"""As plantas do `medir.py` do R1 (passagem de correção, 23.09.2026, achado 3).

    python3 design/especime-v3/medicoes/r1-2026-09-23/plantar-medir.py      (na raiz do sítio)

O achado 3 da leitura a frio: o `medir.py` escrevia no ficheiro se o excerto da
origem `eurostat-tipspd30` era igual ao rótulo da resposta guardada do Eurostat,
e só falhava na diferença de sha256; uma origem que dissesse «% of GNP» onde a
resposta diz «% of GDP» passava. Cada planta aqui pega no `figuras.mjs` da cabeça
do R1, muda UMA coisa na origem, e corre o `medir.py` verdadeiro sobre essa cópia
(`OEDP_FIGURAS`), com as medidas escritas num ficheiro temporário
(`OEDP_MEDIDAS_JSON`) para não pisar o `medidas.json` do bloco. Exige código
diferente de zero COM a falha esperada. O `figuras.mjs` do sítio não é tocado.

Escreve `planta-medir-<nome>.txt` (a saída) e `plantas-medir.json` (o índice).
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
CABECA_R1 = 'bc68892b'
MEDIR = AQUI / 'medir.py'

original = subprocess.run(['git', 'show', f'{CABECA_R1}:src/data/figuras.mjs'], cwd=RAIZ,
                          capture_output=True, text=True, check=True).stdout
bloco = re.search(r"\n  'eurostat-tipspd30': \{\n.*?\n  \},", original, re.S)
if not bloco:
    raise SystemExit('não encontrei a origem eurostat-tipspd30 no figuras.mjs da cabeça do R1')

PLANTAS = [
    {'nome': 'excerto-com-outro-conceito',
     'o_que': 'o excerto da origem diz «% of GNP» onde a resposta diz «% of GDP»',
     'de': "excerto: 'Non-financial corporations debt, consolidated - % of GDP'",
     'para': "excerto: 'Non-financial corporations debt, consolidated - % of GNP'",
     'mordida': r"o excerto da origem eurostat-tipspd30 \('Non-financial corporations debt, consolidated - % of GNP'\) "
                r"não é, byte a byte, o rótulo da resposta guardada"},
    {'nome': 'endereco-de-outro-pedido',
     'o_que': 'a origem aponta para outro pedido (outra unidade) que não o da resposta guardada',
     'de': 'unit=PC_GDP',
     'para': 'unit=MIO_EUR',
     'mordida': r"o endereço da origem eurostat-tipspd30 \(.*unit=MIO_EUR.*\) não é o do pedido"},
]

registos = []
with tempfile.TemporaryDirectory() as tmp:
    for p in PLANTAS:
        dentro = bloco.group(0)
        if dentro.count(p['de']) != 1:
            raise SystemExit(f"{p['nome']}: o trecho a estragar aparece {dentro.count(p['de'])} vezes na origem")
        plantado = original.replace(dentro, dentro.replace(p['de'], p['para']), 1)
        fig = Path(tmp) / f"figuras-{p['nome']}.mjs"
        fig.write_text(plantado, encoding='utf-8')
        saida_json = Path(tmp) / f"medidas-{p['nome']}.json"
        resumo = lambda: hashlib.sha256((AQUI / 'medidas.json').read_bytes()).hexdigest()
        antes = resumo()
        r = subprocess.run([sys.executable, str(MEDIR)], cwd=RAIZ, capture_output=True, text=True,
                           env={**os.environ, 'OEDP_FIGURAS': str(fig), 'OEDP_MEDIDAS_JSON': str(saida_json)})
        saida = (r.stdout + r.stderr).replace(str(RAIZ), '<sítio>').replace(tmp, '<temporário>')
        (AQUI / f"planta-medir-{p['nome']}.txt").write_text(
            f"$ OEDP_FIGURAS=<cópia plantada> OEDP_MEDIDAS_JSON=<temporário> python3 {MEDIR.relative_to(RAIZ)}\n"
            f"planta: {p['o_que']}\ncódigo {r.returncode}\n\n{saida}", encoding='utf-8')
        mordeu = bool(re.search(p['mordida'], saida))
        medidas_intactas = resumo() == antes and saida_json.exists()
        registos.append({'nome': p['nome'], 'o_que': p['o_que'], 'codigo': r.returncode, 'mordida': p['mordida'],
                         'mordeu': mordeu, 'medidas_json_do_bloco_nao_tocado': medidas_intactas,
                         'passou': r.returncode != 0 and mordeu and medidas_intactas})
        print(f"{'OK' if registos[-1]['passou'] else 'FALHA'} {p['nome']}: código {r.returncode}, mordeu={mordeu}")

(AQUI / 'plantas-medir.json').write_text(json.dumps({'cabeca_das_figuras': CABECA_R1, 'plantas': registos},
                                                    ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
if not all(x['passou'] for x in registos):
    sys.exit(1)
