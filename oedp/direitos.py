"""Rights records: `direitos/<host>.toml`, one per publisher's host.

A record says whether the publisher's terms let a copy be kept (`guardar`: "sim",
"nao" or "nao_dito") and how long an excerpt may be (`excerto_max`, characters).
`fonte` refuses a host with no record or with `guardar = "nao"`; check 9 refuses a
piece whose source has no record, a record that says "nao", or an excerpt longer
than `excerto_max`. The records are the rights editor's to write.
"""
from __future__ import annotations

import re
import tomllib
import unicodedata
import urllib.parse
from pathlib import Path

from . import datas
from .fontes import ErroDaLoja

CAMPOS = {"editor": str, "termos_url": str, "termos_sha256": str, "lido_em": str, "guardar": str,
          "excerto_max": int, "credito": str, "duvidas": list}
GUARDAR = {"sim", "nao", "nao_dito"}


class ErroDosDireitos(ErroDaLoja):
    pass


def host_de(url: str) -> str:
    return (urllib.parse.urlsplit(url or "").hostname or "").lower()


def erros_do_registo(nome: str, d: dict) -> list[str]:
    erros = []
    for k, tipo in CAMPOS.items():
        v = d.get(k)
        if k not in d:
            erros.append(f"{nome}: lacks the field {k}")
        elif not isinstance(v, tipo) or (tipo is int and isinstance(v, bool)):
            erros.append(f"{nome}: field {k} has the wrong type")
    for k in d:
        if k not in CAMPOS:
            erros.append(f"{nome}: field {k} is not a field of a rights record")
    if d.get("guardar") not in GUARDAR:
        erros.append(f"{nome}: guardar must be sim, nao or nao_dito")
    if isinstance(d.get("excerto_max"), int) and d["excerto_max"] < 0:
        erros.append(f"{nome}: excerto_max is negative")
    if isinstance(d.get("termos_sha256"), str) and not re.fullmatch(r"[0-9a-f]{64}", d["termos_sha256"]):
        erros.append(f"{nome}: termos_sha256 is not a SHA-256")
    if isinstance(d.get("lido_em"), str) and datas.instante_real(d["lido_em"]) is None:
        erros.append(f"{nome}: lido_em is not a real date in the form YYYY-MM-DDTHH:MM:SSZ")
    if isinstance(d.get("duvidas"), list) and not all(isinstance(x, str) for x in d["duvidas"]):
        erros.append(f"{nome}: duvidas must be a list of texts")
    return erros


def ler_pasta(pasta: Path) -> tuple[dict[str, dict], list[str]]:
    """(host -> record, errors) for every `<host>.toml` in the folder."""
    registos, erros = {}, []
    for f in sorted(Path(pasta).glob("*.toml")) if Path(pasta).is_dir() else []:
        try:
            d = tomllib.loads(f.read_text(encoding="utf-8"))
        except tomllib.TOMLDecodeError as e:
            erros.append(f"direitos/{f.name}: not valid TOML ({e})")
            continue
        problemas = erros_do_registo(f"direitos/{f.name}", d)
        erros += problemas
        if not problemas:
            registos[f.stem.lower()] = d
    return registos, erros


def para_buscar(pasta: Path):
    """The check `fonte` makes before and after fetching a host."""
    registos, erros = ler_pasta(pasta)

    def direitos_de(host: str) -> dict:
        host = host.lower()
        if host not in registos:
            invalido = [e for e in erros if e.startswith(f"direitos/{host}.toml")]
            if invalido:
                raise ErroDosDireitos(f"refused: the rights record of {host} is invalid: " + "; ".join(invalido))
            raise ErroDosDireitos(f"refused: {host} has no rights record (direitos/{host}.toml); "
                                  f"start one with `python3 -m oedp fonte --termos <the publisher's terms page>`")
        if registos[host]["guardar"] == "nao":
            raise ErroDosDireitos(f"refused: the rights record of {host} says guardar = \"nao\": no copy may be kept")
        return registos[host]

    return direitos_de


def tamanho(excerto: str) -> int:
    return len(unicodedata.normalize("NFC", str(excerto).strip()))


def erros_da_peca(peca, registos: dict[str, dict]) -> list[str]:
    """Check 9's three refusals for one piece."""
    erros = []
    for fid, f in peca.fontes.items():
        host = host_de(str(f.get("url_final", "")))
        r = registos.get(host)
        if r is None:
            erros.append(f"fonte {fid}: the host {host or '(none)'} of its url_final has no rights record direitos/{host}.toml")
            continue
        if r.get("guardar") == "nao":
            erros.append(f"fonte {fid}: the rights record of {host} says guardar = \"nao\"")
        limite = r.get("excerto_max")
        for lid, l in peca.linhas.items():
            if l.get("fonte") == fid and "excerto" in l and tamanho(l["excerto"]) > limite:
                erros.append(f"{lid}: the excerpt has {tamanho(l['excerto'])} characters; the rights record of {host} allows {limite}")
    return erros
