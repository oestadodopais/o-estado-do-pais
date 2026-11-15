"""The test site (ensaios/: one test piece with invented figures, its store, its desk, a
test Method page and test records) built into a folder of its own.

It is what the browser test, the screenshots and the code reader's package are built
from, so that each of them shows the pages a published piece would have without any
real piece being published. Nothing here is ever deployed.
"""
from __future__ import annotations

import shutil
from pathlib import Path

from . import codigo
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
    (raiz / codigo.REGISTO).write_text(registo_de_ensaio(), encoding="utf-8")
    return raiz


_IMPRESSOES: dict[str, str] = {}


def registo_de_ensaio(repo: Path = REPO) -> str:
    """The test site's record of the code: one invented construction and one invented
    passing reading on the code as it is now, so that the test piece builds as published.
    The fingerprint is computed here because it changes with every change to the code; a
    record written once would be stale at the next commit. Nothing here is real, and the
    real record (codigo.registo.toml at the root) is never written by this function."""
    chave = str(Path(repo).resolve())
    if chave not in _IMPRESSOES:
        _IMPRESSOES[chave] = codigo.impressao(repo)
    return (
        "# The record of the code for the test site only. The tables are invented for the tests.\n"
        '\n[[passo]]\nnome = "construcao"\nlugar = "construtor"\nfamilia = "anthropic"\nmodelo = "modelo-de-ensaio"\n'
        'inicio = "2026-11-15T02:00:00Z"\nfim = "2026-11-15T04:00:00Z"\n'
        '\n[[leitura]]\nlugar = "seguranca"\nfamilia = "openai"\nmodelo = "modelo-de-ensaio"\n'
        'inicio = "2026-11-15T04:10:00Z"\nfim = "2026-11-15T04:40:00Z"\n'
        f'impressao = "{_IMPRESSOES[chave]}"\n'
        'plantas_postas = 3\nplantas_apanhadas = 3\nachados = 2\nadotados = 2\nveredicto = "passa"\n'
    )


def construir_ensaio(pasta: Path, com_pecas: bool = True, repo: Path = REPO, conferir_antes: bool = True) -> build.Construcao:
    """Build the test site into `<pasta>/saida/static`, from a copy of it in `<pasta>/raiz`.

    `conferir_antes=False` builds the pages without running the ten checks on the test
    piece first: the browser test and the screenshots need the pages, not a second run of
    checks that `tudo` already runs on the same piece, and on GitHub the browser step is
    not given the list of forbidden strings (only the step that runs `tudo` is)."""
    pasta = Path(pasta)
    raiz = copiar_sitio(pasta / "raiz", com_pecas)
    return build.construir(repo, raiz=raiz, saida=pasta / "saida", loja=LOJA, conferir_antes=conferir_antes)
