"""Shared helpers: the test piece, its store, and a planted copy of it in a temporary folder."""
from __future__ import annotations

import shutil
import tempfile
from pathlib import Path

from oedp import construir as build
from oedp import conferir as conf

REPO = Path(__file__).resolve().parent.parent
ENSAIOS = REPO / "ensaios"
LOJA = ENSAIOS / "fontes"
PECA = ENSAIOS / "pecas" / "2026" / "2026-11-16-peca-de-ensaio.md"


def perto_do_relogio(instante, agora, segundos: float) -> bool:
    """Whether `instante` lies within `segundos` of `agora`, before or after (two aware datetimes)."""
    return abs((instante - agora).total_seconds()) <= segundos


def erros_dos_registos(raiz: Path) -> list[str]:
    """Whether a tree's records are records, whatever they hold (ESQ3i, A; ESQ3j, D3): the sentences'
    record and the code's record exist, parse, hold only their own tables and every entry has its
    fields; `reconferencias.toml`, when present, has the shape of its record. The errors, each
    naming its file; [] when all are well formed."""
    import tomllib

    from oedp import codigo, julgados, reconferir

    erros = []
    f = Path(raiz) / "textos.registo.toml"
    if not f.is_file():
        erros.append("textos.registo.toml: absent")
    else:
        try:
            textos = tomllib.loads(f.read_text(encoding="utf-8"))
            erros += [f"textos.registo.toml: [[{k}]] is not a table of this record" for k in set(textos) - {"passo", "leitura"}]
            erros += [f"textos.registo.toml: {x}" for x in julgados.erros_do_registo("textos.toml", textos)]
        except tomllib.TOMLDecodeError as e:
            erros.append(f"textos.registo.toml: not valid TOML ({e})")
    f = Path(raiz) / codigo.REGISTO
    if not f.is_file():
        erros.append(f"{codigo.REGISTO}: absent")
    else:
        try:
            erros += [f"{codigo.REGISTO}: {x}" for x in codigo.erros_do_registo(codigo.em_ordem(f.read_text(encoding="utf-8")))]
        except codigo.ErroDoCodigo as e:
            erros.append(str(e))
    erros += reconferir.ler_registo(Path(raiz))[1]  # [1]: the errors of its shape; [0] would be its entries
    return erros


def loja_fora_do_repositorio(caso) -> Path:
    """A copy of the test store in a temporary folder: OEDP_FONTES may not point inside the repository."""
    pasta = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
    caso.addCleanup(shutil.rmtree, pasta, True)
    shutil.copytree(LOJA, pasta, dirs_exist_ok=True)
    return pasta


def sitio_de_ensaio(caso) -> Path:
    """A copy of the test site (ensaios/) in a temporary folder, with its invented record of
    the code on the code as it is now (oedp/ensaio.py), so that the test piece builds as
    published. `caso` is a test case, or a test class in setUpClass."""
    from oedp import ensaio

    pasta = Path(tempfile.mkdtemp(prefix="oedp-sitio-"))
    limpar = caso.addClassCleanup if isinstance(caso, type) else caso.addCleanup
    limpar(shutil.rmtree, pasta, True)
    return ensaio.copiar_sitio(pasta)


class Plantada:
    """A copy of the test site (piece, desk, method) in a temporary folder."""

    def __init__(self, trocas: list[tuple[str, str]] = (), so_acima_do_registo: bool = False):
        self.pasta = Path(tempfile.mkdtemp(prefix="oedp-ensaio-"))
        from oedp import ensaio as _ensaio

        _ensaio.marcar(self.pasta)  # a tree assembled for the tests (oedp/marca.py)
        for sub in ("pecas", "mesas", "paginas", "direitos"):
            shutil.copytree(ENSAIOS / sub, self.pasta / sub)
        _ensaio.copiar_textos(self.pasta)  # its own sentences and their record, written here (ORDEM-3d)
        from oedp import codigo, ensaio

        (self.pasta / codigo.REGISTO).write_text(ensaio.registo_de_ensaio(), encoding="utf-8")
        self.peca = self.pasta / "pecas" / "2026" / PECA.name
        texto = self.peca.read_text(encoding="utf-8")
        for antes, depois in trocas:
            if antes not in texto:
                raise AssertionError(f"the plant did not find {antes!r}")
            texto = texto.replace(antes, depois, 1)
        self.peca.write_text(texto, encoding="utf-8")

    def resultados(self, loja: Path | None = LOJA) -> dict[int, conf.Resultado]:
        from oedp.peca import ler

        p = ler(self.peca)
        ctx, _ = build.contexto(REPO, self.pasta, [p] if p.estado in ("publicada", "retirada") else [])
        return {r.verificacao: r for r in conf.conferir_peca(self.peca, ctx, loja)}

    def apagar(self):
        shutil.rmtree(self.pasta, ignore_errors=True)
