#!/usr/bin/env python3
"""As plantas do R1 no motor (23.09.2026): cada uma estraga UM ficheiro da
worktree do motor, corre a conferência que o protege, exige código diferente de
zero COM a falha esperada, e repõe os bytes originais, conferidos pelo sha256.

    python3 design/especime-v3/medicoes/r1-2026-09-23/plantar-motor.py <worktree do motor> [nome]

Escreve `planta-motor-<nome>.txt` (a saída do comando) e `plantas-motor.json`
(o índice) ao lado deste guião. Nenhuma planta pede nada à rede: as do Portal
BASE correm sobre o registo e sobre servidores locais, e as do exportador e do
construtor dos domínios sobre os ficheiros alojados."""
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

PLANTAS = [
    {"nome": "base-com-navegador",
     "ficheiro": "core/sources.py",
     "de": '        "caida_em": "2026-09-16",\n',
     "para": '        "browser_ua": True,\n        "caida_em": "2026-09-16",\n',
     "comando": ["python3", "-m", "core.http_nome_test"],
     "mordida": r"lidas com a identidade de um\s+navegador: \['portal_base'\]"},
    {"nome": "base-sem-queda-no-registo",
     "ficheiro": "core/sources.py",
     "de": '        "caida_em": "2026-09-16",\n',
     "para": '',
     "comando": ["python3", "-m", "core.http_nome_test"],
     "mordida": r"o Portal BASE não está caído no registo"},
    {"nome": "cliente-sem-recusa",
     "ficheiro": "core/http.py",
     "de": '    caida = source.get("caida_em")\n    if caida:\n',
     "para": '    caida = source.get("caida_em")\n    if False and caida:\n',
     "comando": ["python3", "-m", "core.http_nome_test"],
     "mordida": r"uma fonte marcada como caída não foi recusada antes do pedido"},
    {"nome": "saude-do-nucleo-com-navegador",
     "ficheiro": "core/sources.py",
     "de": '        "caida_em": "2026-09-16",\n',
     "para": '        "browser_ua": True,\n        "caida_em": "2026-09-16",\n',
     "comando": ["python3", "-c",
                 "import sys\nfrom core import health_check as hc\n"
                 "r=hc.h.run(only=['portal_base: a fonte caiu a 16.09.2026, nenhum pedido'])[0]\n"
                 "print(('PASS' if r.ok else 'FAIL'), r.name, '|', r.detail)\nsys.exit(0 if r.ok else 1)"],
     "mordida": r"FAIL .*voltou a declarar browser_ua"},
]


def corre(p):
    alvo = MOTOR / p["ficheiro"]
    original = alvo.read_bytes()
    texto = original.decode("utf-8")
    if texto.count(p["de"]) != 1:
        raise SystemExit(f"{p['nome']}: o trecho a estragar aparece {texto.count(p['de'])} vezes em {p['ficheiro']}")
    try:
        alvo.write_bytes(texto.replace(p["de"], p["para"], 1).encode("utf-8"))
        r = subprocess.run(p["comando"], cwd=MOTOR, capture_output=True, text=True)
    finally:
        alvo.write_bytes(original)
    saida = r.stdout + r.stderr
    (AQUI / f"planta-motor-{p['nome']}.txt").write_text(
        f"$ {' '.join(p['comando'][:3])}  (em {p['ficheiro']}, estragado)\ncódigo {r.returncode}\n\n{saida}",
        encoding="utf-8")
    reposto = sha(alvo.read_bytes())
    mordeu = bool(re.search(p["mordida"], saida))
    return {"nome": p["nome"], "ficheiro": p["ficheiro"], "comando": " ".join(p["comando"][:3]),
            "codigo": r.returncode, "mordida": p["mordida"], "mordeu": mordeu,
            "antes": sha(original), "reposto": reposto,
            "passou": r.returncode != 0 and mordeu and sha(original) == reposto}


indice = AQUI / "plantas-motor.json"
registos = json.loads(indice.read_text(encoding="utf-8")) if indice.exists() else []
registos = [x for x in registos if not APENAS or x["nome"] != APENAS]
for p in PLANTAS:
    if APENAS and p["nome"] != APENAS:
        continue
    reg = corre(p)
    registos = [x for x in registos if x["nome"] != reg["nome"]] + [reg]
    print(f"{'OK' if reg['passou'] else 'FALHA'} {reg['nome']}: código {reg['codigo']}, mordeu={reg['mordeu']}, bytes repostos={reg['antes'] == reg['reposto']}")
indice.write_text(json.dumps(registos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
if not all(x["passou"] for x in registos):
    sys.exit(1)
