#!/usr/bin/env python3
"""RP4-m-b: as duas leituras de que o ponto 4 (o ficheiro trancado do motor) depende, cada uma com a sua origem.

Uso: python3 design/especime-v3/medicoes/rp4m-2026-10-05/medir-rp4mb-pip.py

  · A ORDEM DO PIP FREEZE: a linha de `pip/_internal/operations/freeze.py` do pip instalado que ordena os pacotes, achada
    pelo texto (`sorted(installations.values(), key=lambda x: x.name.lower())`) e não por um número de linha escrito
    aqui; regista a versão do pip, o número da linha e o texto dela.
  · O XLRD 2.0.2: a versão instalada (`importlib.metadata`) e a resposta do PyPI ao pedido da versão
    (`https://pypi.org/pypi/xlrd/2.0.2/json`, pelo `curl`), com a hora, o cliente, o código HTTP e o sha256 dos
    bytes, e da resposta só o nome, a versão e, por ficheiro publicado, o nome, a hora de publicação e o sha256.

Escreve `rp4mb-pip.json` nesta pasta, sem caminho nenhum da máquina (o caminho do pip diz-se relativo ao pacote).
"""
import hashlib
import importlib.metadata
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import pip

AQUI = Path(__file__).resolve().parent
freeze = Path(pip.__file__).resolve().parent / "_internal" / "operations" / "freeze.py"
linhas = freeze.read_text(encoding="utf-8").splitlines()
CHAVE = "sorted(installations.values(), key=lambda x: x.name.lower())"
achadas = [(i + 1, l.strip()) for i, l in enumerate(linhas) if CHAVE in l]
URL = "https://pypi.org/pypi/xlrd/2.0.2/json"
hora = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
r = subprocess.run(["curl", "-s", "--max-time", "30", "-w", "\n%{http_code}", URL], capture_output=True)
corpo, _, codigo = r.stdout.rpartition(b"\n")
cliente = subprocess.run(["curl", "--version"], capture_output=True, text=True).stdout.splitlines()[0].split(" (")[0]
d = json.loads(corpo.decode("utf-8")) if r.returncode == 0 and codigo == b"200" else {}
saida = {
    "o_que": "as leituras do ponto 4 da passagem RP4-m-b (medir-rp4mb-pip.py)",
    "pip": {"versao": pip.__version__, "ficheiro": "pip/_internal/operations/freeze.py",
            "linha_da_ordem": achadas[0][0] if len(achadas) == 1 else None, "texto": achadas[0][1] if len(achadas) == 1 else None,
            "linhas_achadas": len(achadas)},
    "xlrd_instalado": importlib.metadata.version("xlrd"),
    "pypi": {"url": URL, "hora": hora, "cliente": cliente, "http": int(codigo) if codigo.isdigit() else None,
             "bytes": len(corpo), "sha256": hashlib.sha256(corpo).hexdigest(),
             "nome": (d.get("info") or {}).get("name"), "versao": (d.get("info") or {}).get("version"),
             "ficheiros": [{"nome": u["filename"], "publicado": u["upload_time_iso_8601"], "sha256": u["digests"]["sha256"]}
                           for u in d.get("urls", [])]},
}
(AQUI / "rp4mb-pip.json").write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"pip": saida["pip"]["versao"], "linha": saida["pip"]["linha_da_ordem"], "xlrd": saida["xlrd_instalado"],
                  "pypi_http": saida["pypi"]["http"], "pypi_versao": saida["pypi"]["versao"]}, ensure_ascii=False))
