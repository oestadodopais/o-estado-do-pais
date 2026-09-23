#!/usr/bin/env python3
"""As plantas da passagem de correção do R1 no motor (23.09.2026, achado 4).

    python3 design/especime-v3/medicoes/r1-2026-09-23/plantar-motor-correcao.py <worktree do motor> [nome]

Cada planta estraga UMA linha de UM ficheiro da worktree do motor, corre
`python3 -m core.http_nome_test`, exige código diferente de zero COM a falha
esperada, e repõe os bytes originais, conferidos pelo sha256. Escreve
`planta-motor-correcao-<nome>.txt` (a saída, com o caminho da worktree tirado) e
`plantas-motor-correcao.json` (o índice) ao lado deste guião. As plantas do R1
(`plantar-motor.py`, `plantas-motor.json`) ficam como estavam: são o registo do
estado do motor no R1.

Nenhuma planta pede nada à rede: o teste corre contra servidores em 127.0.0.1 e
lê os ficheiros que o git conhece.
"""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MOTOR = Path(sys.argv[1]).resolve()
APENAS = sys.argv[2] if len(sys.argv) > 2 else None
sha = lambda b: hashlib.sha256(b).hexdigest()
TESTE = ["python3", "-m", "core.http_nome_test"]

PLANTAS = [
    {"nome": "cliente-com-navegador-aceite",
     "o_que": "o cliente deixa de recusar `browser_ua=True`",
     "ficheiro": "core/http.py",
     "de": "        if self.browser_ua:\n",
     "para": "        if False and self.browser_ua:\n",
     "mordidas": [r"um cliente pedido com a identidade de um navegador não foi recusado com a razão"]},
    {"nome": "nome-de-fora-aceite",
     "o_que": "a porta `user_agent=` volta a aceitar qualquer cadeia",
     "ficheiro": "core/http.py",
     "de": "        if self.user_agent is not None and not e_nome_da_casa(self.user_agent):\n",
     "para": "        if False and self.user_agent is not None and not e_nome_da_casa(self.user_agent):\n",
     "mordidas": [r"um cliente pedido com o nome de um navegador em `user_agent=` não foi recusado"]},
    {"nome": "for-source-de-fora-aceite",
     "o_que": "`for_source()` volta a aceitar um dicionário que não é do registo",
     "ficheiro": "core/http.py",
     "de": "    if not any(source == s for s in sources.SOURCES.values()):\n",
     "para": "    if False and not any(source == s for s in sources.SOURCES.values()):\n",
     "mordidas": [r"for_source\(\) aceitou um dicionário de fora do registo"]},
    {"nome": "for-source-com-a-chave-aceite",
     "o_que": "`for_source()` deixa de recusar a chave `browser_ua`",
     "ficheiro": "core/http.py",
     "de": '    if "browser_ua" in source:\n',
     "para": '    if False and "browser_ua" in source:\n',
     "mordidas": [r"uma entrada do registo com a forma antiga da excepção reabriu uma porta",
                  r"não recusou com IdentidadeDeNavegadorRecusada uma fonte com a chave browser_ua"]},
    {"nome": "cabecalho-de-fora-aceite",
     "o_que": "as cinco portas deixam passar um `User-Agent` de quem chama",
     "ficheiro": "core/http.py",
     "de": "    if dado is None:\n        return cab\n    raise NomeDaCasaForcado(\n",
     "para": "    if dado is None or True:\n        return cab\n    raise NomeDaCasaForcado(\n",
     "mordidas": [r"nem todas as portas recusaram um User-Agent de fora",
                  r"uma entrada do registo com a forma antiga da excepção reabriu uma porta"]},
    {"nome": "registo-com-a-chave",
     "o_que": "a chave `browser_ua` volta a uma entrada do registo, a False",
     "ficheiro": "core/sources.py",
     "de": '        "notes": "Per-subsite _api/web/lists; Note fields not $filterable.",\n',
     "para": '        "browser_ua": False,\n        "notes": "Per-subsite _api/web/lists; Note fields not $filterable.",\n',
     "mordidas": [r"o registo das fontes tem a chave browser_ua em: \['tribunal_contas'\]"]},
    {"nome": "estudo-com-navegador-de-volta",
     "o_que": "uma busca de um estudo volta a mandar o nome de um navegador pelo `requests`",
     "ficheiro": "content/06 Évora Economy/Technical Source/fetch_iefp_check.py",
     "de": 'r = requests.get(URL, headers={"User-Agent": CASA_UA}, timeout=120)\n',
     "para": 'r = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"}, timeout=120)\n',
     "mordidas": [r"linha\(s\) de código do motor com o nome de um navegador: "
                  r"\['content/06 Évora Economy/Technical Source/fetch_iefp_check\.py:\d+'\]"]},
]


def corre(p):
    alvo = MOTOR / p["ficheiro"]
    original = alvo.read_bytes()
    texto = original.decode("utf-8")
    if texto.count(p["de"]) != 1:
        raise SystemExit(f"{p['nome']}: o trecho a estragar aparece {texto.count(p['de'])} vezes em {p['ficheiro']}")
    try:
        alvo.write_bytes(texto.replace(p["de"], p["para"], 1).encode("utf-8"))
        r = subprocess.run(TESTE, cwd=MOTOR, capture_output=True, text=True)
    finally:
        alvo.write_bytes(original)
    saida = (r.stdout + r.stderr).replace(str(MOTOR), "<motor>")
    (AQUI / f"planta-motor-correcao-{p['nome']}.txt").write_text(
        f"$ {' '.join(TESTE)}  (em {p['ficheiro']}, estragado: {p['o_que']})\ncódigo {r.returncode}\n\n{saida}",
        encoding="utf-8")
    reposto = sha(alvo.read_bytes())
    mordeu = [bool(re.search(m, saida)) for m in p["mordidas"]]
    return {"nome": p["nome"], "o_que": p["o_que"], "ficheiro": p["ficheiro"], "comando": " ".join(TESTE),
            "codigo": r.returncode, "mordidas": p["mordidas"], "mordeu": all(mordeu),
            "antes": sha(original), "reposto": reposto,
            "passou": r.returncode != 0 and all(mordeu) and sha(original) == reposto}


cabeca = subprocess.run(["git", "rev-parse", "HEAD"], cwd=MOTOR, capture_output=True, text=True).stdout.strip()
limpa = subprocess.run(["git", "status", "--porcelain"], cwd=MOTOR, capture_output=True, text=True).stdout.strip()
if limpa:
    raise SystemExit(f"a worktree do motor não está limpa, e as plantas só valem sobre uma cabeça:\n{limpa}")
indice = AQUI / "plantas-motor-correcao.json"
anterior = json.loads(indice.read_text(encoding="utf-8")) if indice.exists() else {}
registos = [x for x in anterior.get("plantas", []) if not APENAS or x["nome"] != APENAS]
for p in PLANTAS:
    if APENAS and p["nome"] != APENAS:
        continue
    reg = corre(p)
    registos = [x for x in registos if x["nome"] != reg["nome"]] + [reg]
    print(f"{'OK' if reg['passou'] else 'FALHA'} {reg['nome']}: código {reg['codigo']}, "
          f"mordeu={reg['mordeu']}, bytes repostos={reg['antes'] == reg['reposto']}")
indice.write_text(json.dumps({"cabeca_do_motor": cabeca, "teste": " ".join(TESTE), "plantas": registos},
                             ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
if not all(x["passou"] for x in registos):
    sys.exit(1)
