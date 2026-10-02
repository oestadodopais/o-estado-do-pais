#!/usr/bin/env python3
"""A origem nova do K2 (a diferença de emprego entre sexos em pontos percentuais), conferida contra os bytes selados.

uso: python3 design/especime-v3/medicoes/k2-2026-10-02/origens-k2.py <saída.json>

A origem `ce-swd-2026-222-disparidade-de-emprego` de `src/data/figuras.mjs` cita o Relatório por País 2026 da Comissão
Europeia (SWD(2026) 222), que o bloco L1 já pediu pelo cliente da casa e selou no motor (`indicators/out/l1-2026-09-24/`):
o PDF e a sua extração `pdftotext -layout`. Este guião não pede nada à rede. Abre os dois ficheiros no motor, recalcula o
sha256 de cada um e compara-o com o que a origem declara e com o registo do pedido (`pedidos.jsonl`), e confere que o
excerto declarado é uma subcadeia literal do texto da extração com os espaços colapsados (a regra de `origens-l1.py`).
O conhecido-positivo é a origem que o L1 já recortou do mesmo ficheiro (`ce-swd-2026-222-habitacao`): o mesmo leitor tem
de a encontrar. Nenhum caminho da máquina vai para a saída: o motor nomeia-se pela pasta relativa.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[4]
_VIZINHAS = [RAIZ.parent, RAIZ.parents[3]] if len(RAIZ.parents) > 3 else [RAIZ.parent]
CANDIDATOS = [os.environ.get('OEDP_MOTOR')] + [str(v / 'ResearchHub') for v in _VIZINHAS]
MOTOR = next((Path(c) for c in CANDIDATOS if c and (Path(c) / 'indicators/out/l1-2026-09-24/pedidos.jsonl').exists()), None)


def colapsa(t):
    return re.sub(r'\s+', ' ', t).strip()


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def origens():
    js = ("import('./src/data/figuras.mjs').then(m => console.log(JSON.stringify(m.ORIGENS_DAS_DEFINICOES)))")
    r = subprocess.run(['node', '--input-type=module', '-e', js], cwd=RAIZ, capture_output=True, text=True, check=True)
    return json.loads(r.stdout)


def main():
    saida = sys.argv[1] if len(sys.argv) > 1 else None
    if MOTOR is None:
        print('o motor não foi encontrado ao lado do sítio; defina OEDP_MOTOR', file=sys.stderr)
        return 1
    o = origens()
    pedidos = [json.loads(l) for l in (MOTOR / 'indicators/out/l1-2026-09-24/pedidos.jsonl').read_text(encoding='utf-8').splitlines() if l.strip()]
    resultados = []
    for chave in ['ce-swd-2026-222-habitacao', 'ce-swd-2026-222-disparidade-de-emprego']:
        d = o.get(chave)
        if not d:
            resultados.append({'origem': chave, 'existe': False})
            continue
        selo = d['selo']
        pdf = MOTOR / selo['motor']
        txt = MOTOR / selo['extracao']['ficheiro']
        texto = colapsa(txt.read_text(encoding='utf-8'))
        pedido = next((p for p in pedidos if p.get('sha256') == selo['sha256'] or p.get('url') == d['url']), None)
        resultados.append({
            'origem': chave,
            'existe': True,
            'conhecido_positivo': chave == 'ce-swd-2026-222-habitacao',
            'pdf': selo['motor'],
            'sha256_do_pdf_declarado': selo['sha256'],
            'sha256_do_pdf_medido': sha(pdf),
            'pdf_confere': sha(pdf) == selo['sha256'],
            'extracao': selo['extracao']['ficheiro'],
            'sha256_da_extracao_declarado': selo['extracao']['sha256'],
            'sha256_da_extracao_medido': sha(txt),
            'extracao_confere': sha(txt) == selo['extracao']['sha256'],
            'pedido_registado': bool(pedido),
            'hora_do_pedido': pedido.get('timestamp_utc') if pedido else None,
            'hora_confere': bool(pedido) and pedido.get('timestamp_utc') == selo['hora'],
            'url_do_pedido_igual': bool(pedido) and pedido.get('url') == d['url'],
            'excerto': d['excerto'],
            'excerto_no_texto': d['excerto'] in texto,
        })
    certo = all(r.get('existe') and r['pdf_confere'] and r['extracao_confere'] and r['excerto_no_texto'] and r['pedido_registado'] and r['hora_confere'] for r in resultados)
    j = {'o_que': 'a origem nova do K2 conferida contra os bytes selados no motor, com o conhecido-positivo do L1', 'certo': certo, 'resultados': resultados}
    if saida:
        Path(saida).write_text(json.dumps(j, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(j, ensure_ascii=False, indent=2))
    return 0 if certo else 1


if __name__ == '__main__':
    sys.exit(main())
