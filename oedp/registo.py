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


def _plantas(campos: dict) -> list[str]:
    """A reading recorded as passing caught every plant."""
    if campos.get("veredicto") == "passa" and campos.get("plantas_apanhadas") != campos.get("plantas_postas"):
        return [f"a reading recorded as passing caught {campos.get('plantas_apanhadas')} of {campos.get('plantas_postas')} "
                "planted errors; it passes only if it caught every one"]
    return []


def _acrescentar_a_texto(caminho: Path, antes: bytes, nome: str, campos: dict) -> str:
    """Append to the record of paginas/metodo.md, to textos.registo.toml or to
    codigo.registo.toml."""
    import tomllib

    from . import codigo, julgados

    if nome not in ("passo", "leitura"):
        raise ErroDoRegisto(f"the record of {caminho.name} takes passo and leitura tables only")
    if caminho.name == codigo.REGISTO:
        return _acrescentar_ao_codigo(caminho, antes, nome, campos)
    if caminho.name != "textos.registo.toml":
        try:
            julgados.separar(antes)
        except julgados.ErroDoJulgado as e:
            raise ErroDoRegisto(f"{caminho.name}: {e}") from None
    texto = tabela(nome, campos)
    if antes and not antes.endswith(b"\n"):
        texto = "\n" + texto
    exigidos, opcionais = forma.CAMPOS_REGISTO[nome]
    erros: list[str] = []
    novo = tomllib.loads(texto)[nome][-1]
    forma._tabela(f"[[{nome}]]", novo, exigidos, opcionais, erros)
    erros += forma.erros_de_tempo(f"[[{nome}]]", novo)
    erros += _plantas(campos)
    registo_atual = tomllib.loads((antes if caminho.name == "textos.registo.toml" else julgados.separar(antes)[1]).decode("utf-8"))
    juntos = {k: list(v) for k, v in registo_atual.items()}
    juntos.setdefault(nome, []).append(novo)
    if not forma.erros_de_familia(registo_atual):
        erros += forma.erros_de_familia(juntos)
    for (tab, campo), permitidos in forma.VALORES.items():
        if tab == nome and campo in campos and campos.get(campo) not in permitidos:
            erros.append(f"{campo} {campos[campo]!r} is not one of {', '.join(sorted(permitidos))}")
    if erros:
        raise ErroDoRegisto("; ".join(erros))
    with open(caminho, "ab") as f:
        f.write(texto.encode("utf-8"))
    if not caminho.read_bytes().startswith(antes):
        raise ErroDoRegisto("the file changed above the new table; this must never happen")
    return texto


def _acrescentar_ao_codigo(caminho: Path, antes: bytes, nome: str, campos: dict) -> str:
    """Append to codigo.registo.toml: the record as it would be is validated whole, in the
    order of the file, before a byte is written."""
    from . import codigo

    texto = tabela(nome, campos)
    if antes and not antes.endswith(b"\n"):
        texto = "\n" + texto
    try:
        agora = codigo.em_ordem(antes.decode("utf-8"))
        depois = codigo.em_ordem((antes + texto.encode("utf-8")).decode("utf-8"))
    except codigo.ErroDoCodigo as e:
        raise ErroDoRegisto(str(e)) from None
    erros = [x for x in codigo.erros_do_registo(depois) if x not in codigo.erros_do_registo(agora)]
    erros += _plantas(campos)
    if erros:
        raise ErroDoRegisto("; ".join(erros))
    with open(caminho, "ab") as f:
        f.write(texto.encode("utf-8"))
    if not caminho.read_bytes().startswith(antes):
        raise ErroDoRegisto("the file changed above the new table; this must never happen")
    return texto


def acrescentar(caminho: Path, nome: str, campos: dict) -> str:
    """Append one [[nome]] table; returns the text appended.

    The file is a piece, paginas/metodo.md (a record after its text),
    textos.registo.toml (the record of textos.toml) or codigo.registo.toml (the code's)."""
    caminho = Path(caminho)
    from . import marca

    if campos.get("modelo") == marca.MODELO and not marca.de_ensaio(marca.raiz_do_registo(caminho)):
        raise ErroDoRegisto(f"the model name {marca.MODELO!r} is the tests' own, and counts only in a tree assembled for "
                            "the tests (oedp/ensaio.py); this file's tree is not one")
    antes = caminho.read_bytes()
    if caminho.name in ("textos.registo.toml", "codigo.registo.toml") or not antes.startswith(b"+++ cabeca\n"):
        return _acrescentar_a_texto(caminho, antes, nome, campos)
    peca = ler_bytes(antes, caminho)  # raises if the file is not a piece
    texto = tabela(nome, campos)
    if not antes.endswith(b"\n"):
        texto = "\n" + texto
    novo = ler_bytes(antes + texto.encode("utf-8"), caminho)
    exigidos, opcionais = forma.CAMPOS_REGISTO[nome]
    erros: list[str] = [] if forma.erros_de_familia(peca.registo) else list(forma.erros_de_familia(novo.registo))
    erros += _plantas(campos)
    forma._tabela(f"[[{nome}]]", novo.registo[nome][-1], exigidos, opcionais, erros)
    erros += forma.erros_de_tempo(f"[[{nome}]]", novo.registo[nome][-1])
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
