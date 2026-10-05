#!/usr/bin/env python3
"""RP4-m: o registo do portão do motor na cabeça final do motor, lido dos ficheiros que a corrida escreveu.

Uso: python3 design/especime-v3/medicoes/rp4m-2026-10-05/portao-do-motor.py <pasta da corrida> <prefixo> <worktree do motor> [<etiqueta>]

A corrida escreve, antes e depois de `python3 -m core.gate`, cada coisa no seu ficheiro, e o código lê-se do
ficheiro depois de o processo acabar (nunca atrás de um «|»): `<prefixo>.cabeca` (git rev-parse HEAD),
`<prefixo>.estado` (git status --porcelain --untracked-files=no, vazio numa árvore limpa), `<prefixo>.inicio`,
`<prefixo>.log`, `<prefixo>.codigo` e `<prefixo>.fim`. Este guião corre de novo, na mesma cabeça, as quatro suítes
do bloco, cada uma com o código lido do seu ficheiro, para guardar as contagens da linha PASS e das plantas, e
escreve `portao-do-motor.json` nesta pasta, sem caminho nenhum da máquina. Com a etiqueta (a passagem RP4-m-b usa
`rp4mb`), escreve `portao-do-motor-<etiqueta>.json`, e o ficheiro do bloco fica como estava.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
pasta, prefixo, motor = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
ETIQUETA = sys.argv[4] if len(sys.argv) > 4 else None
ler = lambda ext: (pasta / f"{prefixo}.{ext}").read_text(encoding="utf-8")
cabeca = ler("cabeca").strip()
agora = subprocess.run(["git", "-C", str(motor), "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
if agora != cabeca:
    raise SystemExit(f"a cabeça do motor andou depois da corrida ({cabeca[:8]} → {agora[:8]}): corra o portão outra vez")
log = ler("log")
SUITES = {"publisher.dominios_series_test": "dominios_series_test", "publisher.dominios_series_corredor_test": "dominios_series_corredor_test",
          "indicators.refresh_guiao_solto_test": "refresh_guiao_solto_test", "core.reconcile_test": "reconcile_test"}
contas, plantas, codigos = {}, {}, {}
for modulo, nome in SUITES.items():
    saida, codigo = pasta / f"{prefixo}-{nome}.saida", pasta / f"{prefixo}-{nome}.codigo"
    with saida.open("w", encoding="utf-8") as f:
        r = subprocess.run([sys.executable, "-m", modulo], cwd=str(motor), stdout=f, stderr=subprocess.STDOUT)
    codigo.write_text(f"{r.returncode}\n")
    codigos[nome] = int(codigo.read_text().strip())
    texto = saida.read_text(encoding="utf-8")
    n = re.search(r"PASS\D{0,30}(\d+)", texto)
    contas[nome] = int(n.group(1)) if (n and codigos[nome] == 0) else None
    p = re.search(r"plantas: (\d+) morderam", texto)
    if p:
        plantas[nome] = int(p.group(1))
ok = [m.group(1) for m in re.finditer(r"^GATE\s+(\S+)\s+ok$", log, re.M)]
saida = {
    "o_que": "o portão do motor (python3 -m core.gate) na cabeça final do motor, com o código lido de ficheiro",
    "cabeca": cabeca, "estado_antes": ler("estado"), "inicio": ler("inicio").strip(), "fim": ler("fim").strip(),
    "codigo": int(ler("codigo").strip()), "ultima_linha": log.strip().splitlines()[-1],
    "suites_ok": ok, "suites_ok_quantas": len(ok),
    "contas": contas, "contas_quantas": len(contas), "codigos_das_suites": codigos,
    "contas_de": "cada suíte do bloco corrida de novo na mesma cabeça e na árvore limpa (python3 -m <módulo>), com o código lido de ficheiro; a linha PASS de cada uma",
    "plantas_mordidas": plantas, "plantas_de": "a linha «plantas: N morderam» da saída da suíte",
}
(AQUI / (f"portao-do-motor-{ETIQUETA}.json" if ETIQUETA else "portao-do-motor.json")).write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({k: saida[k] for k in ("codigo", "suites_ok_quantas", "contas", "codigos_das_suites", "plantas_mordidas")}, ensure_ascii=False))
