#!/usr/bin/env python3
"""RP3-b: as conferências corridas entre os commits da passagem, com o código de cada uma lido do ficheiro que a corrida escreveu.

uso: python3 design/especime-v3/medicoes/rp3-2026-10-04/rp3b/entre-commits.py <pasta dos registos da corrida>

Os registos ficaram na pasta temporária da sessão (não se versionam: são saídas de terminal com caminhos da máquina);
este guião lê só os códigos, um inteiro por ficheiro, e escreve `entre-commits.json` com o nome da conferência, o
comando, o código e o commit que ela antecedeu. Nenhum caminho entra no ficheiro.
"""
import json
import pathlib
import sys

pasta = pathlib.Path(sys.argv[1])
CORRIDAS = [
    ("o construtor das séries (o motor)", "python3 publisher/export_series.py --site <worktree do sítio>", "rp3b-es-1.codigo", "47f12e1 (motor)"),
    ("a suíte do RP3 no motor, com as plantas novas", "python3 -m publisher.dominios_series_test", "rp3b-dst-3.codigo", "47f12e1 (motor)"),
    ("ledger:check, com as plantas novas da S13 e da S14", "npm run ledger:check", "rp3b-ledger-1.codigo", "5a6a1169"),
    ("typecheck", "npm run typecheck", "rp3b-tc-1.codigo", "5a6a1169"),
    ("check:voz, com a marca da série obrigatória", "node scripts/check-voz.mjs", "rp3b-voz-1.codigo", "46a42f0c"),
    ("check:lugar, com a lista fechada e a exceção da API do INE", "node scripts/check-lugar.mjs", "rp3b-lugar-2.codigo", "a147d48f"),
    ("check:palavras, com os buracos novos", "node tests/voz/palavras-proibidas.mjs --prova", "rp3b-palavras-1.codigo", "a147d48f"),
    ("gate:html, com a lista fechada", "node scripts/gate-html.mjs", "rp3b-gate-1.codigo", "a147d48f"),
    ("check:mortos", "node scripts/check-mortos.mjs --prova", "rp3b-mortos-1.codigo", "a147d48f"),
    ("check:series com o motor ao lado", "RESEARCHHUB_DIR=<motor> node tests/series/series.mjs --prova", "rp3b-series-4.codigo", "23fc9c5e"),
    ("check:series sem o motor", "node tests/series/series.mjs --prova", "rp3b-series-4b.codigo", "23fc9c5e"),
    ("ledger:check no ramo rebaseado", "npm run ledger:check", None, "b3e9e0ac"),
]
saida = []
for nome, comando, ficheiro, antes_de in CORRIDAS:
    if ficheiro is None:
        continue
    f = pasta / ficheiro
    codigo = int(f.read_text().strip()) if f.is_file() else None
    saida.append({"conferencia": nome, "comando": comando, "codigo": codigo, "antes_do_commit": antes_de})
destino = pathlib.Path(__file__).resolve().parent / "entre-commits.json"
destino.write_text(json.dumps({"_": "Escrito por design/especime-v3/medicoes/rp3-2026-10-04/rp3b/entre-commits.py.", "corridas": saida,
                               "todas_a_zero": all(x["codigo"] == 0 for x in saida)}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"entre-commits: {len(saida)} corridas, {sum(1 for x in saida if x['codigo'] == 0)} a 0")
raise SystemExit(0 if all(x["codigo"] == 0 for x in saida) else 1)
