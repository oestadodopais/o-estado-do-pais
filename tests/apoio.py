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


class Plantada:
    """A copy of the test site (piece, desk, method) in a temporary folder."""

    def __init__(self, trocas: list[tuple[str, str]] = (), so_acima_do_registo: bool = False):
        self.pasta = Path(tempfile.mkdtemp(prefix="oedp-ensaio-"))
        for sub in ("pecas", "mesas", "paginas"):
            shutil.copytree(ENSAIOS / sub, self.pasta / sub)
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
