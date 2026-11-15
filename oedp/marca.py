"""The tests' model name, and the mark of a tree assembled for the tests (ORDEM-3c, decision 3;
docs/ESPEC-PECA.md, check 5, edit of 15 November 2026, 15:17 UTC).

The invented records the tests use (under `ensaios/`, and the code's record `ensaio.py` writes)
are signed by one model name, `MODELO`. They are made on real fingerprints (the fixed sentences'
and the code's), so a wrong copy of one over a real record would have made it count. No gate
counts a `[[leitura]]` or a `[[passo]]` signed by that name unless the tree it checks carries the
mark, the file `FICHEIRO` at its root, which `ensaio.marcar` writes into the folders the tests
assemble and nowhere else. The mark is refused in the repository's own tree, and there
`de_ensaio` is never true.
"""
from __future__ import annotations

from pathlib import Path

MODELO = "modelo-de-ensaio"
FICHEIRO = "ARVORE-DE-ENSAIO.txt"
FRASE = ("This folder was assembled for the tests by oedp/ensaio.py: the readings and steps signed by the tests' "
         "model name count in it and nowhere else.\n")
REPO = Path(__file__).resolve().parent.parent


def de_ensaio(raiz: Path) -> bool:
    """Whether `raiz` is a tree assembled for the tests: it carries the mark and is not the repository."""
    raiz = Path(raiz).resolve()
    return raiz != REPO and (raiz / FICHEIRO).is_file()


def raiz_do_registo(caminho: Path) -> Path:
    """The tree a record file belongs to: `<root>/pecas/<year>/<id>.md`, `<root>/paginas/metodo.md`,
    or a record at the root (`textos.registo.toml`, `codigo.registo.toml`)."""
    caminho = Path(caminho).absolute()
    if caminho.parent.parent.name == "pecas":
        return caminho.parents[2]
    if caminho.parent.name == "paginas":
        return caminho.parents[1]
    return caminho.parent


def assinadas(tabelas, nome: str, raiz: Path) -> list[str]:
    """The reasons a record is refused: each [[passo]] and [[leitura]] signed by the tests' model
    name, when `raiz` is not a tree assembled for the tests. `tabelas` is a record as a dict of
    lists, or as (table name, table) pairs in the order of the file."""
    if de_ensaio(raiz):
        return []
    pares = tabelas if isinstance(tabelas, list) else [(k, t) for k, v in tabelas.items() if isinstance(v, list) for t in v]
    contagem: dict[str, int] = {}
    razoes = []
    for k, t in pares:
        contagem[k] = contagem.get(k, 0) + 1
        if k in ("passo", "leitura") and isinstance(t, dict) and t.get("modelo") == MODELO:
            razoes.append(f"{nome}: [[{k}]] number {contagem[k]} is signed by the tests' model name ({MODELO}), which counts "
                          "only in a tree assembled for the tests (oedp/ensaio.py); this tree is not one")
    return razoes
