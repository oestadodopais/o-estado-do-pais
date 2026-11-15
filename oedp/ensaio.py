"""The test site (ensaios/: one test piece with invented figures, its store, its desk, a
test Method page and test records) built into a folder of its own.

It is what the browser test, the screenshots and the code reader's package are built
from, so that each of them shows the pages a published piece would have without any
real piece being published. Nothing here is ever deployed.
"""
from __future__ import annotations

import hashlib
import shutil
from pathlib import Path

from . import codigo
from . import construir as build
from . import marca

REPO = Path(__file__).resolve().parent.parent
ENSAIOS = REPO / "ensaios"
LOJA = ENSAIOS / "fontes"
TEXTOS = ENSAIOS / "textos.toml"  # the test site's own fixed sentences (ORDEM-3d, decision 1)
PECA_ID = "2026-11-16-peca-de-ensaio"


def marcar(raiz: Path) -> Path:
    """Mark a folder the tests assembled, so that the records signed by the tests' model name
    count in it (`marca.py`). Refused for the repository's own tree."""
    raiz = Path(raiz)
    if raiz.resolve() == REPO.resolve():
        raise ValueError("refused: the repository's own tree is never marked as a tree assembled for the tests")
    raiz.mkdir(parents=True, exist_ok=True)
    (raiz / marca.FICHEIRO).write_text(marca.FRASE, encoding="utf-8")
    return raiz


def registo_dos_textos(textos: bytes) -> str:
    """The test site's record of its own fixed sentences (ensaios/textos.toml): one invented writing
    step and one invented passing judgment, signed by the tests' model name, on the fingerprint of
    the file given. Written into each tree the tests assemble, never stored (ORDEM-3d, decision 2):
    the file it judges has a key the real textos.toml may never hold, so it never fits the real one."""
    impressao = hashlib.sha256(textos).hexdigest()
    return (
        "# The record of this tests' tree's textos.toml, written when the tree was assembled. Invented for the tests.\n"
        f'\n[[passo]]\nnome = "escrita"\nlugar = "redator"\nfamilia = "anthropic"\nmodelo = "{marca.MODELO}"\n'
        'inicio = "2026-11-15T09:00:00Z"\nfim = "2026-11-15T09:30:00Z"\n'
        f'\n[[leitura]]\nlugar = "juiz"\nfamilia = "openai"\nmodelo = "{marca.MODELO}"\n'
        'inicio = "2026-11-15T10:00:00Z"\nfim = "2026-11-15T10:20:00Z"\n'
        f'impressao = "{impressao}"\n'
        'plantas_postas = 2\nplantas_apanhadas = 2\nachados = 0\nadotados = 0\nveredicto = "passa"\n'
    )


def copiar_textos(raiz: Path) -> Path:
    """The test site's own fixed sentences as `raiz`'s textos.toml, and their record written beside them."""
    dados = TEXTOS.read_bytes()
    (Path(raiz) / "textos.toml").write_bytes(dados)
    (Path(raiz) / "textos.registo.toml").write_text(registo_dos_textos(dados), encoding="utf-8")
    return Path(raiz)


def copiar_sitio(raiz: Path, com_pecas: bool = True, repo: Path = REPO) -> Path:
    """Copy the test site's pieces, desk, Method page and rights records into `raiz`, with its own
    fixed sentences; write the records of its sentences and of the code; and mark it as a tree
    assembled for the tests."""
    raiz = marcar(Path(raiz))
    for sub in ("mesas", "paginas", "direitos") + (("pecas",) if com_pecas else ()):
        shutil.copytree(ENSAIOS / sub, raiz / sub, dirs_exist_ok=True)
    copiar_textos(raiz)
    (raiz / codigo.REGISTO).write_text(registo_de_ensaio(repo), encoding="utf-8")
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
        f'\n[[passo]]\nnome = "construcao"\nlugar = "construtor"\nfamilia = "anthropic"\nmodelo = "{marca.MODELO}"\n'
        'inicio = "2026-11-15T02:00:00Z"\nfim = "2026-11-15T04:00:00Z"\n'
        f'\n[[leitura]]\nlugar = "seguranca"\nfamilia = "openai"\nmodelo = "{marca.MODELO}"\n'
        'inicio = "2026-11-15T04:10:00Z"\nfim = "2026-11-15T04:40:00Z"\n'
        f'impressao = "{_IMPRESSOES[chave]}"\n'
        'plantas_postas = 3\nplantas_apanhadas = 3\nachados = 2\nadotados = 2\nveredicto = "passa"\n'
    )


# The browser test's second page (ORDEM esq3, item C): the test piece with its text no longer
# printing the previous quarter's figure, so that line is only an input of the calculation the
# text shows, and its receipt sits after those the text uses. Built only with the checks off,
# into a folder of its own, for the browser to click; it is not a piece anything judges.
SO_ENTRADA = ("No trimestre anterior ficara em {indice_anterior}, [uma subida de]", "No trimestre anterior, [uma subida de]")


def construir_ensaio_so_entrada(pasta: Path, repo: Path = REPO) -> build.Construcao:
    pasta = Path(pasta)
    raiz = copiar_sitio(pasta / "raiz", True, repo)
    peca = raiz / "pecas" / "2026" / f"{PECA_ID}.md"
    texto = peca.read_text(encoding="utf-8")
    if SO_ENTRADA[0] not in texto:
        raise ValueError("the test piece no longer holds the sentence the input-only page is made from")
    peca.write_text(texto.replace(SO_ENTRADA[0], SO_ENTRADA[1], 1), encoding="utf-8")
    return build.construir(repo, raiz=raiz, saida=pasta / "saida", loja=LOJA, conferir_antes=False)


def construir_ensaio(pasta: Path, com_pecas: bool = True, repo: Path = REPO, conferir_antes: bool = True) -> build.Construcao:
    """Build the test site into `<pasta>/saida/static`, from a copy of it in `<pasta>/raiz`.

    `conferir_antes=False` builds the pages without running the ten checks on the test
    piece first: the browser test and the screenshots need the pages, not a second run of
    checks that `tudo` already runs on the same piece, and on GitHub the browser step is
    not given the list of forbidden strings (only the step that runs `tudo` is)."""
    pasta = Path(pasta)
    raiz = copiar_sitio(pasta / "raiz", com_pecas, repo)
    return build.construir(repo, raiz=raiz, saida=pasta / "saida", loja=LOJA, conferir_antes=conferir_antes)
