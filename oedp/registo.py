"""Appending to the record: one table at the end of the file, never a byte above.

The file is opened for appending only. Before writing, the new table is parsed
with the rest of the record and checked against the specification's shape, so a
bad value is refused instead of written.
"""
from __future__ import annotations

import datetime as dt
from pathlib import Path

from . import forma
from .peca import ler, ler_bytes


def agora() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _valor(v) -> str:
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, int):
        return str(v)
    if isinstance(v, list):
        return "[" + ", ".join(_valor(x) for x in v) + "]"
    texto = str(v)
    escapado = texto.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n").replace("\t", "\\t")
    return '"' + escapado + '"'


def tabela(nome: str, campos: dict) -> str:
    return f"\n[[{nome}]]\n" + "".join(f"{k} = {_valor(v)}\n" for k, v in campos.items())


class ErroDoRegisto(Exception):
    pass


def acrescentar(caminho: Path, nome: str, campos: dict) -> str:
    """Append one [[nome]] table; returns the text appended."""
    caminho = Path(caminho)
    antes = caminho.read_bytes()
    peca = ler_bytes(antes, caminho)  # raises if the file is not a piece
    texto = tabela(nome, campos)
    if not antes.endswith(b"\n"):
        texto = "\n" + texto
    novo = ler_bytes(antes + texto.encode("utf-8"), caminho)
    exigidos, opcionais = forma.CAMPOS_REGISTO[nome]
    erros: list[str] = []
    forma._tabela(f"[[{nome}]]", novo.registo[nome][-1], exigidos, opcionais, erros)
    for (tab, campo), permitidos in forma.VALORES.items():
        if tab == nome and campos.get(campo) not in permitidos and campo in campos:
            erros.append(f"{campo} {campos[campo]!r} is not one of {', '.join(sorted(permitidos))}")
    if erros:
        raise ErroDoRegisto("; ".join(erros))
    with open(caminho, "ab") as f:
        f.write(texto.encode("utf-8"))
    depois = caminho.read_bytes()
    if not depois.startswith(antes):
        raise ErroDoRegisto("the file changed above the new table; this must never happen")
    if peca.impressao != ler(caminho).impressao:
        raise ErroDoRegisto("the piece's fingerprint changed; this must never happen")
    return texto
