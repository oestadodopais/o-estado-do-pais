#!/usr/bin/env python3
"""RP4-m-b: a frase da conta nas páginas construídas, contada numa construção (o ponto 5 do mandato da passagem).

Uso (na raiz do sítio, sobre o `dist/` que lá estiver):
    python3 design/especime-v3/medicoes/rp4m-2026-10-05/medir-rp4mb-dist.py <etiqueta>

Escreve `rp4mb-dist-<etiqueta>.json` nesta pasta: o commit do `dist/version.json`, quantas páginas leu, as páginas
com a frase da conta nova (as cadeias `derivadaFrase` e `derivadaFraseVarias` das duas edições, lidas de
`src/i18n/strings.mjs` pelo node) e as páginas com uma das duas metades que a passagem tirou. Corre-se com a
etiqueta `antes` sobre a construção da cabeça 1a186832, onde a metade tirada ainda está (é o conhecido-positivo do
detetor), e com `depois` sobre a construção da cabeça do código da passagem. Nenhum caminho da máquina no registo.
"""
import json
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[3]
ETIQUETA = sys.argv[1] if len(sys.argv) > 1 else "medida"
METADES_TIRADAS = (", e a conta refaz-se em cada construção do sítio", ", and the calculation is redone at every build of the site")
r = subprocess.run(["node", "--input-type=module", "-e",
                    "import { STRINGS } from './src/i18n/strings.mjs'; const s = (l) => STRINGS[l].livro.serieNoTempo; "
                    "console.log(JSON.stringify([s('pt').derivadaFrase, s('pt').derivadaFraseVarias, s('en').derivadaFrase, s('en').derivadaFraseVarias]));"],
                   cwd=str(SITIO), capture_output=True, text=True)
if r.returncode != 0:
    raise SystemExit(f"o node não leu as cadeias: {r.stderr[:300]}")
frases = json.loads(r.stdout)
versao = json.loads((SITIO / "dist/version.json").read_text(encoding="utf-8"))
paginas = sorted((SITIO / "dist").rglob("*.html"))
com_a_frase, com_a_metade = [], []
for p in paginas:
    texto = p.read_text(encoding="utf-8", errors="replace")
    rel = str(p.relative_to(SITIO / "dist"))
    if any(f in texto for f in frases):
        com_a_frase.append(rel)
    if any(m in texto for m in METADES_TIRADAS):
        com_a_metade.append(rel)
saida = {"o_que": "a frase da conta nas páginas de dist/ (medir-rp4mb-dist.py)", "etiqueta": ETIQUETA,
         "dist_commit": versao.get("commit"), "dist_construido_em": versao.get("construido_em"),
         "frases_novas": frases, "metades_tiradas": list(METADES_TIRADAS), "paginas_lidas": len(paginas),
         "paginas_com_a_frase_nova": com_a_frase, "paginas_com_a_metade_tirada": com_a_metade}
(AQUI / f"rp4mb-dist-{ETIQUETA}.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({k: (len(v) if isinstance(v, list) else v) for k, v in saida.items() if k not in ("frases_novas", "metades_tiradas")}, ensure_ascii=False))
