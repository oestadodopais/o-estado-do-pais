"""Reader's text that is not a piece, and its judgment.

`paginas/metodo.md` carries its own record after a line `+++ registo`; its fingerprint
is the SHA-256 of the bytes before that line. `textos.toml` has its record beside it,
in `textos.registo.toml`; its fingerprint is the SHA-256 of `textos.toml`. No piece is
built as published unless each has a passing `juiz` reading on its current
fingerprint, by a family other than its `escrita` step's, with every plant caught
(docs/ESPEC-PAGINAS.md, edit of 14 November 2026, 22:34 UTC).
"""
from __future__ import annotations

import hashlib
import tomllib
from pathlib import Path

LINHA = b"+++ registo"


class ErroDoJulgado(Exception):
    pass


def separar(bruto: bytes) -> tuple[bytes, bytes]:
    """(the text, the record) of a page file; raises when there is no `+++ registo` line."""
    if bruto.startswith(LINHA + b"\n"):
        return b"", bruto[len(LINHA) + 1 :]
    i = bruto.find(b"\n" + LINHA + b"\n")
    if i < 0:
        if bruto.endswith(b"\n" + LINHA):
            return bruto[: len(bruto) - len(LINHA)], b""
        raise ErroDoJulgado("the file has no line '+++ registo' after its text")
    return bruto[: i + 1], bruto[i + 1 + len(LINHA) + 1 :]


def metodo(caminho: Path) -> tuple[str, dict, str]:
    """(prose, record, fingerprint) of paginas/metodo.md."""
    texto, registo = separar(Path(caminho).read_bytes())
    try:
        tabelas = tomllib.loads(registo.decode("utf-8"))
    except (tomllib.TOMLDecodeError, UnicodeDecodeError) as e:
        raise ErroDoJulgado(f"its record is not valid TOML ({e})") from None
    return texto.decode("utf-8"), tabelas, hashlib.sha256(texto).hexdigest()


def textos(repo: Path, raiz: Path) -> tuple[dict, str, str]:
    """(record, fingerprint, where the record was read) for textos.toml."""
    impressao = hashlib.sha256((Path(repo) / "textos.toml").read_bytes()).hexdigest()
    for pasta in (Path(raiz), Path(repo)):
        f = pasta / "textos.registo.toml"
        if f.is_file():
            try:
                return tomllib.loads(f.read_text(encoding="utf-8")), impressao, str(f)
            except tomllib.TOMLDecodeError as e:
                raise ErroDoJulgado(f"textos.registo.toml is not valid TOML ({e})") from None
    return {}, impressao, ""


def erros_do_registo(nome: str, registo: dict) -> list[str]:
    """The record of a text is validated by the same code as a piece's record (passo and
    leitura tables only), with its timestamps checked here."""
    from . import forma

    return forma.erros_do_registo(registo, nome, ("passo", "leitura"), datas_aqui=True)


def historia(repo: Path, caminho: Path) -> list[str]:
    """The repository's own record only grows: what main holds is the beginning of what
    it holds now. Only the repository's paginas/metodo.md, textos.registo.toml,
    codigo.registo.toml and reconferencias.toml have a history; a test record anywhere else
    has none."""
    import subprocess

    from . import conferir

    try:
        relativo = (Path(caminho).absolute().parent.resolve() / Path(caminho).name).relative_to(Path(repo).resolve()).as_posix()
    except ValueError:
        return []
    if relativo not in ("paginas/metodo.md", "textos.registo.toml", "codigo.registo.toml", "reconferencias.toml"):
        return []
    ref = conferir.ref_main(repo)
    if ref is None:
        return [f"{relativo}: main is not at hand, so its record cannot be proved to have only grown"]
    r = subprocess.run(["git", "-C", str(repo), "show", f"{ref}:{relativo}"], capture_output=True)
    if r.returncode != 0:
        return []
    antes, agora = r.stdout, Path(caminho).read_bytes()
    if relativo == "paginas/metodo.md":
        try:
            antes, agora = separar(antes)[1], separar(agora)[1]
        except ErroDoJulgado:
            return [f"{relativo}: its record cannot be compared with main's"]
    if not agora.startswith(antes):
        return [f"{relativo}: the record on main is not the beginning of the record now: a table was removed or changed"]
    return []


def erros_de_julgamento(nome: str, registo: dict, impressao: str) -> list[str]:
    """Why this text cannot stand published; empty when its judgment is in order."""
    escrita = {p.get("familia") for p in registo.get("passo", []) if p.get("nome") == "escrita"}
    if not escrita:
        return [f"{nome}: no escrita step is on record, so the family that wrote it is unknown"]
    sobre = [l for l in registo.get("leitura", []) if l.get("lugar") == "juiz" and l.get("impressao") == impressao]
    if not sobre:
        return [f"{nome}: no juiz reading on its current fingerprint ({impressao[:12]}…)"]
    l = sobre[-1]
    erros = []
    if not l.get("familia"):
        return [f"{nome}: the juiz reading on its current fingerprint has no familia, so it cannot be told from the writer's"]
    if l.get("veredicto") != "passa":
        erros.append(f"{nome}: the last juiz reading on its current fingerprint says {l.get('veredicto')}")
    if l.get("familia") in escrita:
        erros.append(f"{nome}: the juiz reading is by {l.get('familia')}, the family that wrote it")
    postas, apanhadas = l.get("plantas_postas"), l.get("plantas_apanhadas")
    if not isinstance(postas, int) or postas < 1:
        erros.append(f"{nome}: the juiz reading had no planted error")
    elif apanhadas != postas:
        erros.append(f"{nome}: the juiz reading caught {apanhadas} of {postas} planted errors")
    return erros
