"""Every test file is run (docs: ORDEM esq3j, A). `unittest` discovery silently leaves out a file in
a folder with no `__init__.py`, and a file that holds no test adds nothing; either way a test that
is written is never run, and nobody is told. `nao_carregados` names, from the ids of the tests a
run loaded, every file under `tests/` whose name matches the discovery pattern from which no test
comes. `tudo` uses it on its suite; `tests/adiante.py` on each of its runs."""
from __future__ import annotations

import fnmatch
from pathlib import Path

PADRAO = "test*.py"  # unittest's default discovery pattern, used by both runners


def nao_carregados(ids, raiz: Path, pasta: str = "tests") -> list[str]:
    """The files under `raiz/pasta`, at any depth, whose name matches PADRAO and from which no test
    id in `ids` comes (a test id is `<module>.<class>.<method>`, the module dotted from `raiz`)."""
    ids = list(ids)
    faltam = []
    for f in sorted((Path(raiz) / pasta).rglob("*.py")):
        relativo = f.relative_to(raiz)
        if not fnmatch.fnmatch(f.name, PADRAO) or any(p == "__pycache__" or p.startswith(".") for p in relativo.parts):
            continue
        modulo = ".".join(relativo.with_suffix("").parts)
        if not any(i == modulo or i.startswith(modulo + ".") for i in ids):
            faltam.append(relativo.as_posix())
    return faltam


def ids_da_bateria(suite) -> list[str]:
    """The id of every test of a suite, nested suites opened; read it before the suite is run, since a
    run lets go of each test it has run."""
    ids = []
    for t in suite:
        ids += ids_da_bateria(t) if hasattr(t, "__iter__") else [t.id()]
    return ids
