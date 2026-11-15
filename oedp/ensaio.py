"""The test site (ensaios/: one test piece with invented figures, its store, its desk, a
test Method page and test records) built into a folder of its own.

It is what the browser test, the screenshots and the code reader's package are built
from, so that each of them shows the pages a published piece would have without any
real piece being published. Nothing here is ever deployed.
"""
from __future__ import annotations

import shutil
from pathlib import Path

from . import construir as build

REPO = Path(__file__).resolve().parent.parent
ENSAIOS = REPO / "ensaios"
LOJA = ENSAIOS / "fontes"
PECA_ID = "2026-11-16-peca-de-ensaio"


def copiar_sitio(raiz: Path, com_pecas: bool = True) -> Path:
    """Copy the test site's pieces, desk, Method page, rights records and records into `raiz`."""
    raiz = Path(raiz)
    raiz.mkdir(parents=True, exist_ok=True)
    for sub in ("mesas", "paginas", "direitos") + (("pecas",) if com_pecas else ()):
        shutil.copytree(ENSAIOS / sub, raiz / sub, dirs_exist_ok=True)
    shutil.copy2(ENSAIOS / "textos.registo.toml", raiz / "textos.registo.toml")
    return raiz


def construir_ensaio(pasta: Path, com_pecas: bool = True, repo: Path = REPO) -> build.Construcao:
    """Build the test site into `<pasta>/saida/static`, from a copy of it in `<pasta>/raiz`."""
    pasta = Path(pasta)
    raiz = copiar_sitio(pasta / "raiz", com_pecas)
    return build.construir(repo, raiz=raiz, saida=pasta / "saida", loja=LOJA)
