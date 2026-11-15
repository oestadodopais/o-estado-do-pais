"""Rights records: `direitos/<host>.toml`, one per publisher's host.

A record says whether the publisher's terms let a copy be kept (`guardar`: "sim",
"nao" or "nao_dito") and how long an excerpt may be (`excerto_max`, characters).
`fonte` refuses a host with no record or with `guardar = "nao"`; check 9 refuses a
piece whose source has no record, a record that says "nao", or an excerpt longer
than `excerto_max`. The records are the rights editor's to write.
"""
from __future__ import annotations

import hashlib
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
# Optional: the licence named by the terms, whether they let a text be reproduced, and
# [[apoio]] tables, each an excerpt of the stored terms (termos_sha256) that supports a field.
OPCIONAIS = {"licenca": str, "reproduzir": str, "apoio": list}


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
    for k, v in d.items():
        if k not in CAMPOS and k not in OPCIONAIS:
            erros.append(f"{nome}: field {k} is not a field of a rights record")
        elif k in OPCIONAIS and not isinstance(v, OPCIONAIS[k]):
            erros.append(f"{nome}: field {k} has the wrong type")
    if "reproduzir" in d and d.get("reproduzir") not in GUARDAR:
        erros.append(f"{nome}: reproduzir must be sim, nao or nao_dito")
    for n, a in enumerate(d.get("apoio", []) if isinstance(d.get("apoio"), list) else [], 1):
        if not isinstance(a, dict) or set(a) != {"campo", "excerto"}:
            erros.append(f"{nome}: [[apoio]] number {n} must have exactly campo and excerto")
            continue
        if a["campo"] not in (set(CAMPOS) | set(OPCIONAIS)) - {"apoio"}:
            erros.append(f"{nome}: [[apoio]] number {n} supports {a['campo']!r}, which is not a field of the record")
        if not isinstance(a["excerto"], str) or not a["excerto"].strip():
            erros.append(f"{nome}: [[apoio]] number {n} has an empty excerto")
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


def apoios_da_peca(peca, registos: dict[str, dict], loja) -> tuple[list[str], list[str]]:
    """(failures, why it could not run) for the [[apoio]] excerpts of the records this
    piece's sources use: each must be found in the stored copy of the terms."""
    from . import fontes

    razoes, em_falta = [], []
    hosts = sorted({host_de(str(f.get("url_final", ""))) for f in peca.fontes.values()})
    for host in hosts:
        r = registos.get(host)
        if not r or not r.get("apoio"):
            continue
        if loja is None or not Path(loja).is_dir():
            em_falta.append(f"direitos/{host}.toml: its [[apoio]] excerpts need the store of sources, and it is not at hand")
            continue
        try:
            copia = fontes.caminho_da_copia(loja, str(r.get("termos_sha256", "")))
        except fontes.ErroDaLoja as e:
            razoes.append(f"direitos/{host}.toml: {e}")
            continue
        if not copia.is_file():
            em_falta.append(f"direitos/{host}.toml: no copy of its terms in the store under {r.get('termos_sha256')}")
            continue
        dados = copia.read_bytes()
        if hashlib.sha256(dados).hexdigest() != r.get("termos_sha256"):
            razoes.append(f"direitos/{host}.toml: the stored terms do not hash to termos_sha256")
            continue
        paginas = fontes.texto_por_pagina(dados)
        for n, a in enumerate(r["apoio"], 1):
            if fontes.procurar(str(a.get("excerto", "")), paginas, None) is None:
                razoes.append(f"direitos/{host}.toml: [[apoio]] number {n} (for {a.get('campo')}) is not in the stored terms")
    return razoes, em_falta


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
        if "pagina" in f:
            host_p = host_de(str(f.get("pagina", "")))
            r_p = registos.get(host_p)
            if r_p is None:
                erros.append(f"fonte {fid}: the host {host_p or '(none)'} of its pagina has no rights record direitos/{host_p}.toml")
            elif r_p.get("guardar") == "nao":
                erros.append(f"fonte {fid}: the rights record of {host_p}, the host of its pagina, says guardar = \"nao\"")
        limite = r.get("excerto_max")
        for lid, l in peca.linhas.items():
            if l.get("fonte") == fid and "excerto" in l and tamanho(l["excerto"]) > limite:
                erros.append(f"{lid}: the excerpt has {tamanho(l['excerto'])} characters; the rights record of {host} allows {limite}")
    return erros
