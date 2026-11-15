"""The code's fingerprint, its record, and the gate that keeps a piece off the site
while the code it would be built with has not been read by the other family.

docs/ESPEC-PECA.md, "The fingerprints", edit of 15 November 2026:

* **The fingerprint** is the SHA-256 of the list, sorted by path, of every tracked
  file's path and SHA-256, leaving out what is judged on its own or is not code
  (`EXCLUIDOS`). The list is written one line per file, `<sha256>  <path>\\n` (the
  form `shasum -a 256` prints), sorted by path as Python sorts strings, and encoded
  as UTF-8. The bytes hashed are those in the working tree; a tracked symbolic link
  is hashed as the text `link:<target>`. A reader can redo it with
  `git ls-files -z`, the exclusions below, and `shasum -a 256`.
* **The record** is `codigo.registo.toml` at the root: `[[passo]]` tables with
  `nome = "construcao"` and `[[leitura]]` tables with `lugar = "seguranca"`, appended
  by `registar` only, validated like the other records and compared with `main`.
* **The gate:** the last `seguranca` reading whose `impressao` is the current
  fingerprint passes, caught every plant of at least one, and is of a family other
  than that of every `construcao` step recorded after the passing reading before it;
  and at least one `construcao` step is recorded after that earlier reading.

Order matters to the gate ("recorded after"), and a TOML parser keeps the order of
each array but not the order between `[[passo]]` and `[[leitura]]`; so the record is
read table by table, in the order of the file (`em_ordem`).
"""
from __future__ import annotations

import hashlib
import os
import re
import subprocess
import tomllib
from pathlib import Path

REGISTO = "codigo.registo.toml"
EXCLUIDAS_PASTAS = ("pecas/", "mesas/", "paginas/", "direitos/", "docs/", "equipa/", "design/")
EXCLUIDOS_FICHEIROS = frozenset({"textos.toml", "textos.registo.toml", REGISTO, "sitio.toml", "README.md", "CLAUDE.md"})
VALORES = {("passo", "nome"): {"construcao"}, ("leitura", "lugar"): {"seguranca"}}


class ErroDoCodigo(Exception):
    pass


def e_codigo(caminho: str) -> bool:
    """Whether a tracked path counts in the code's fingerprint."""
    return caminho not in EXCLUIDOS_FICHEIROS and not caminho.startswith(EXCLUIDAS_PASTAS)


def ficheiros_seguidos(repo: Path) -> list[str]:
    r = subprocess.run(["git", "-C", str(repo), "ls-files", "-z"], capture_output=True)
    if r.returncode != 0:
        raise ErroDoCodigo(f"git could not list the tracked files ({r.stderr.decode(errors='replace').strip()})")
    return [n for n in r.stdout.decode("utf-8").split("\0") if n]


def lista(repo: Path) -> list[tuple[str, str]]:
    """(path, SHA-256) of every tracked file that is code, sorted by path."""
    linhas = []
    for nome in sorted(n for n in ficheiros_seguidos(repo) if e_codigo(n)):
        p = Path(repo) / nome
        if p.is_symlink():
            dados = b"link:" + os.readlink(p).encode("utf-8")
        elif p.is_file():
            dados = p.read_bytes()
        else:
            continue  # tracked but deleted here: its absence changes the list, and so the fingerprint
        linhas.append((nome, hashlib.sha256(dados).hexdigest()))
    return linhas


def impressao_da_lista(linhas: list[tuple[str, str]]) -> str:
    texto = "".join(f"{sha}  {nome}\n" for nome, sha in sorted(linhas))
    return hashlib.sha256(texto.encode("utf-8")).hexdigest()


def impressao(repo: Path) -> str:
    """The code's fingerprint of the repository's working tree."""
    return impressao_da_lista(lista(repo))


def impressao_de_pasta(pasta: Path) -> str:
    """The same fingerprint of a folder that holds exactly the tracked files of a commit
    (what `git archive` writes), read without git."""
    pasta = Path(pasta)
    linhas = []
    for f in sorted(pasta.rglob("*")):
        nome = f.relative_to(pasta).as_posix()
        if f.is_dir() and not f.is_symlink() or not e_codigo(nome):
            continue
        dados = b"link:" + os.readlink(f).encode("utf-8") if f.is_symlink() else f.read_bytes()
        linhas.append((nome, hashlib.sha256(dados).hexdigest()))
    return impressao_da_lista(linhas)


# --------------------------------------------------------------------------- the record

_CABECA = re.compile(r"^\[\[(passo|leitura)\]\][ \t]*$", re.M)


def em_ordem(texto: str) -> list[tuple[str, dict]]:
    """The record's tables in the order of the file, each as (name, fields). Raises
    ErroDoCodigo when a table is not valid TOML or something other than [[passo]] and
    [[leitura]] holds a value."""
    cabecas = list(_CABECA.finditer(texto))
    antes = texto[: cabecas[0].start()] if cabecas else texto
    try:
        if tomllib.loads(antes):
            raise ErroDoCodigo(f"{REGISTO}: a value outside any [[passo]] or [[leitura]] table")
    except tomllib.TOMLDecodeError as e:
        raise ErroDoCodigo(f"{REGISTO} is not valid TOML ({e})") from None
    tabelas = []
    for i, m in enumerate(cabecas):
        fim = cabecas[i + 1].start() if i + 1 < len(cabecas) else len(texto)
        try:
            dados = tomllib.loads(texto[m.end() : fim])
        except tomllib.TOMLDecodeError as e:
            raise ErroDoCodigo(f"{REGISTO}: [[{m.group(1)}]] number {i + 1} is not valid TOML ({e})") from None
        tabelas.append((m.group(1), dados))
    # The whole file must parse as one TOML document with nothing else in it.
    try:
        inteiro = tomllib.loads(texto)
    except tomllib.TOMLDecodeError as e:
        raise ErroDoCodigo(f"{REGISTO} is not valid TOML ({e})") from None
    if set(inteiro) - {"passo", "leitura"}:
        raise ErroDoCodigo(f"{REGISTO}: [[{', '.join(sorted(set(inteiro) - {'passo', 'leitura'}))}]] is not a table of this record")
    if como_registo(tabelas) != inteiro:
        raise ErroDoCodigo(f"{REGISTO}: a table header is not written as [[passo]] or [[leitura]] on a line of its own")
    return tabelas


def como_registo(tabelas: list[tuple[str, dict]]) -> dict:
    registo: dict = {}
    for nome, t in tabelas:
        registo.setdefault(nome, []).append(t)
    return registo


def ler(repo: Path, raiz: Path | None = None) -> tuple[list[tuple[str, dict]], str]:
    """(the tables in order, the file read), from `raiz` and else from `repo`; ([], "")
    when neither has the file. The test site carries its own record in its root."""
    for pasta in ([Path(raiz)] if raiz is not None else []) + [Path(repo)]:
        f = pasta / REGISTO
        if f.is_file():
            return em_ordem(f.read_text(encoding="utf-8")), str(f)
    return [], ""


def erros_de_familia(tabelas: list[tuple[str, dict]]) -> list[str]:
    """A reading by a family that built since the last passing reading can only raise."""
    erros, construtoras, n = [], set(), 0
    for nome, t in tabelas:
        if nome == "passo":
            construtoras.add(t.get("familia"))
            continue
        n += 1
        if t.get("familia") in construtoras and t.get("veredicto") != "levanta":
            erros.append(f"{REGISTO} [[leitura]] number {n}: a reading by {t.get('familia')}, a family that built "
                         f"since the last passing reading, can only raise (veredicto levanta), not {t.get('veredicto')}")
        if t.get("veredicto") == "passa" and t.get("familia") not in construtoras:
            construtoras = set()
    return erros


def erros_do_registo(tabelas: list[tuple[str, dict]]) -> list[str]:
    """The same validation as the other records (forma.erros_do_registo, with this record's
    two values), with the family rule read in the order of the file."""
    from . import forma

    registo = como_registo(tabelas)
    erros = forma.erros_do_registo(registo, REGISTO, ("passo", "leitura"), datas_aqui=True, valores=VALORES,
                                   familia=False)
    for n, t in enumerate(registo.get("leitura", []), 1):
        if "pessoas_vistas" in t:
            erros.append(f"{REGISTO} [[leitura]] number {n}: pessoas_vistas belongs to the justica and juiz readings only")
    return erros + erros_de_familia(tabelas)


def erros_do_portao(tabelas: list[tuple[str, dict]], atual: str) -> list[str]:
    """Why nothing may be built as published on the code whose fingerprint is `atual`;
    empty when the gate is open."""
    leituras = [(i, t) for i, (nome, t) in enumerate(tabelas) if nome == "leitura" and t.get("lugar") == "seguranca"]
    sobre = [(i, t) for i, t in leituras if t.get("impressao") == atual]
    if not sobre:
        ultima_passa = next((t for _, t in reversed(leituras) if t.get("veredicto") == "passa"), None)
        mais = (f"; the last passing seguranca reading is on {str(ultima_passa.get('impressao'))[:12]}…"
                if ultima_passa else "; no seguranca reading has ever passed")
        return [f"code: no seguranca reading on the current code fingerprint ({atual[:12]}…){mais}"]
    i, l = sobre[-1]
    erros = []
    if l.get("veredicto") != "passa":
        erros.append(f"code: the last seguranca reading on the current code fingerprint says {l.get('veredicto')}")
    postas, apanhadas = l.get("plantas_postas"), l.get("plantas_apanhadas")
    if not isinstance(postas, int) or postas < 1:
        erros.append("code: the seguranca reading on the current code fingerprint had no planted error")
    elif apanhadas != postas:
        erros.append(f"code: the seguranca reading on the current code fingerprint caught {apanhadas} of {postas} planted errors")
    anterior = next((j for j, t in reversed(leituras) if j < i and t.get("veredicto") == "passa"), -1)
    passos = [t for j, (nome, t) in enumerate(tabelas) if nome == "passo" and j > anterior and t.get("nome") == "construcao"]
    if not passos:
        erros.append("code: no construcao step is recorded after the previous passing seguranca reading, "
                     "so who built the code that was read is unknown")
    familias = sorted({str(p.get("familia")) for p in passos})
    if l.get("familia") in familias:
        erros.append(f"code: the seguranca reading is by {l.get('familia')}, a family that built this code "
                     f"(construcao steps since the previous passing reading: {', '.join(familias)})")
    return erros


def historia(repo: Path, caminho: Path) -> list[str]:
    """The repository's own record only grows: what main holds is its beginning."""
    from . import julgados

    return julgados.historia(repo, caminho)
