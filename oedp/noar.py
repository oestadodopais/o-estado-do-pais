"""Check 10: what is live is what was built.

The build just made is the truth: its `manifesto.json` lists every file and its
SHA-256, and every one of them must be live with the same bytes. A build that lists
no page is a failure, not a pass. Each page is also fetched at its public address
(`/`, `/pecas/<id>/`, `/temas/<tema>/`, `/metodo/`, `/correcoes/`) and compared with the
built `index.html` behind it, because what a reader receives is what the host serves
at that address. The fetcher is a parameter, so the tests give a site held in memory.
"""
from __future__ import annotations

import hashlib
import urllib.error
import urllib.request
from pathlib import Path

from .fontes import AGENTE


def buscar_na_rede(url: str, tempo: float = 60) -> bytes:
    pedido = urllib.request.Request(url, headers={"User-Agent": AGENTE, "Cache-Control": "no-cache"})
    with urllib.request.urlopen(pedido, timeout=tempo) as r:
        return r.read()


def endereco_publico(nome: str) -> str | None:
    """`pecas/x/index.html` -> `pecas/x/`; `index.html` -> ``; other files -> None."""
    if nome == "index.html":
        return ""
    if nome.endswith("/index.html"):
        return nome[: -len("index.html")]
    return None


def conferir(endereco: str, estatica: Path, buscar=buscar_na_rede, parar=None, vistos: dict | None = None) -> list[str]:
    """Reasons the live site differs from the build at `estatica`; empty when equal. `parar`,
    when given, is asked before every fetch; when it says the time is up, the comparison
    stops there with that as a reason (publicar's deadline). `vistos`, when given, receives the
    SHA-256 of what each address answered."""
    base = endereco.rstrip("/")
    proprio_f = Path(estatica) / "manifesto.json"
    if not proprio_f.is_file():
        return [f"there is no build to compare with ({proprio_f} is missing); run construir first"]
    # The list is recomputed from the output folder, not taken from the manifest file.
    from .construir import manifesto, manifesto_confere

    proprio = manifesto(Path(estatica))["ficheiros"]
    diferencas = manifesto_confere(Path(estatica))
    if diferencas:
        return ["the build's manifesto.json does not list exactly the files of the output folder: " + "; ".join(diferencas)]
    if not any(nome.endswith(".html") for nome in proprio):
        return ["the build lists no page, so nothing can be shown to be live"]
    razoes = []

    class SemTempo(Exception):
        pass

    def vivo(url: str) -> bytes | None:
        if parar is not None and parar():
            raise SemTempo(url)
        try:
            dados = buscar(url)
            if vistos is not None:
                vistos[url] = hashlib.sha256(dados).hexdigest()
            return dados
        except (urllib.error.URLError, OSError, ValueError) as e:
            razoes.append(f"{url} could not be fetched ({e})")
            return None

    try:
        dados = vivo(base + "/manifesto.json")
        if dados is not None and dados != proprio_f.read_bytes():
            razoes.append("the live manifesto.json is not the built one")
        for nome, sha in sorted(proprio.items()):
            construido = (Path(estatica) / nome).read_bytes() if (Path(estatica) / nome).is_file() else None
            if construido is None or hashlib.sha256(construido).hexdigest() != sha:
                razoes.append(f"{nome}: the build's own file does not match its manifest")
                continue
            dados = vivo(base + "/" + nome)
            if dados is not None and hashlib.sha256(dados).hexdigest() != sha:
                razoes.append(f"{nome}: live SHA-256 {hashlib.sha256(dados).hexdigest()} is not the built {sha}")
            publico = endereco_publico(nome)
            if publico is not None:
                dados = vivo(base + "/" + publico)
                if dados is not None and hashlib.sha256(dados).hexdigest() != sha:
                    razoes.append(f"/{publico}: what the host serves at the public address is not the built {nome}")
    except SemTempo as e:
        razoes.append(f"the time to compare ran out before {e} was fetched")
    return razoes
