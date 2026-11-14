"""Check 10: what is live is what was built.

Fetches `/manifesto.json` from an address, then every file it lists, and compares
each SHA-256 with the build's own manifest. The fetcher is a parameter so the
tests can give a site held in memory instead of the network.
"""
from __future__ import annotations

import hashlib
import json
import urllib.error
import urllib.request
from pathlib import Path

from .fontes import AGENTE


def buscar_na_rede(url: str) -> bytes:
    pedido = urllib.request.Request(url, headers={"User-Agent": AGENTE, "Cache-Control": "no-cache"})
    with urllib.request.urlopen(pedido, timeout=60) as r:
        return r.read()


def conferir(endereco: str, estatica: Path, buscar=buscar_na_rede) -> list[str]:
    """Reasons the live site differs from the build at `estatica`; empty when equal."""
    base = endereco.rstrip("/")
    proprio_f = Path(estatica) / "manifesto.json"
    if not proprio_f.is_file():
        return [f"there is no build to compare with ({proprio_f} is missing); run construir first"]
    proprio = json.loads(proprio_f.read_text(encoding="utf-8"))["ficheiros"]
    try:
        vivo_bruto = buscar(base + "/manifesto.json")
        vivo = json.loads(vivo_bruto.decode("utf-8"))["ficheiros"]
    except (urllib.error.URLError, OSError, ValueError, KeyError) as e:
        return [f"{base}/manifesto.json could not be read ({e})"]
    razoes = []
    if vivo_bruto != proprio_f.read_bytes():
        razoes.append("the live manifesto.json is not the built one")
    for nome in sorted(set(proprio) - set(vivo)):
        razoes.append(f"{nome} is built and not listed live")
    for nome, sha in sorted(vivo.items()):
        if nome not in proprio:
            razoes.append(f"{nome} is listed live and was not built")
            continue
        endereco_f = base + "/" + nome
        try:
            dados = buscar(endereco_f)
        except (urllib.error.URLError, OSError) as e:
            razoes.append(f"{nome}: could not be fetched ({e})")
            continue
        real = hashlib.sha256(dados).hexdigest()
        if real != proprio[nome]:
            razoes.append(f"{nome}: live SHA-256 {real} is not the built {proprio[nome]}")
    return razoes
