"""The text as a reader reads it, one numbered sentence per line: TEXTO-NUMERADO.md.

It is made by the code that builds the page's text, not by patterns run over a built
page: the title and the lead through `paginas.texto_simples`, the text through
`paginas.markdown_com_referencias` (in the mode that prints a reference's words without
its link), and the kind through the fixed sentence `tipo_<kind>`. The HTML that code
returns is read with an HTML parser, block by block, so the numbered text holds the
same words as the page, in the same order. A test compares the two on the test piece.

The rule that splits sentences, deterministic, and this module's own reading:

* Each block is split on its own: the kind, the title, the lead, then each paragraph,
  heading and list item of the text, and each row of a table (its cells joined by
  " | ").
* Inside a block, a sentence ends at `.`, `!`, `?` or `…` (with any `»`, `”`, `)` or
  `]` right after it) when white space follows and the next character is a capital
  letter, a digit, `«` or `“`, unless the word before the stop is an abbreviation of
  `ABREVIATURAS` (so «p. 2» is not split).
* White space is collapsed to one space, and the no-break space the page puts between
  a number and its unit is written as a plain space.

Lines are `[N] sentence`, N counting from 1 over the whole text; blocks are separated by
a blank line.
"""
from __future__ import annotations

import html.parser
import re

from . import paginas
from .peca import Peca

ABREVIATURAS = frozenset({"p", "pp", "n", "art", "arts", "al", "sr", "sra", "dr", "dra", "prof", "profa", "eng",
                          "etc", "cf", "vs", "vol", "cap", "fig", "ex", "min", "máx", "mín", "aprox", "séc"})
_FIM = re.compile(r"[.!?…]+[»”)\]]*(\s+)")
_ABRE = re.compile(r"[A-ZÁÉÍÓÚÂÊÔÀÃÕÇ0-9«“]")


class _Blocos(html.parser.HTMLParser):
    """The text of each block element of a fragment of HTML, in order."""

    BLOCOS = {"p", "h1", "h2", "h3", "h4", "li", "tr", "blockquote"}
    CELULAS = {"td", "th"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocos: list[str] = []
        self.atual: list[str] = []
        self.celulas = 0

    def _fechar(self):
        texto = limpar("".join(self.atual))
        if texto:
            self.blocos.append(texto)
        self.atual, self.celulas = [], 0

    def handle_starttag(self, tag, attrs):
        if tag in self.BLOCOS:
            self._fechar()
        elif tag in self.CELULAS:
            if self.celulas:
                self.atual.append(" | ")
            self.celulas += 1
        elif tag == "br":
            self.atual.append(" ")

    def handle_endtag(self, tag):
        if tag in self.BLOCOS:
            self._fechar()

    def handle_data(self, data):
        self.atual.append(data)

    def close(self):
        super().close()
        self._fechar()


def limpar(texto: str) -> str:
    return re.sub(r"\s+", " ", texto.replace(" ", " ").replace(" ", " ")).strip()


def blocos_de_html(fragmento: str) -> list[str]:
    p = _Blocos()
    p.feed(fragmento)
    p.close()
    return p.blocos


def frases(bloco: str) -> list[str]:
    """One block split into sentences by the rule above."""
    partes, inicio = [], 0
    for m in _FIM.finditer(bloco):
        seguinte = bloco[m.end() : m.end() + 1]
        if not seguinte or not _ABRE.match(seguinte):
            continue
        palavra = re.search(r"(\w+)[.!?…]*[»”)\]]*\s*$", bloco[inicio : m.start(1)])
        if palavra and palavra.group(1).lower() in ABREVIATURAS and bloco[m.start()] == ".":
            continue
        partes.append(bloco[inicio : m.start(1)].strip())
        inicio = m.end()
    resto = bloco[inicio:].strip()
    if resto:
        partes.append(resto)
    return [p for p in partes if p]


def blocos_da_peca(peca: Peca, ctx: paginas.Contexto) -> list[str]:
    """The kind, the title, the lead and the blocks of the text, as the page prints them."""
    blocos = [ctx.t("tipo_" + str(peca.cabeca.get("tipo")))]
    for campo in ("titulo", "entrada"):
        blocos.append(limpar(paginas.texto_simples(peca, str(peca.cabeca.get(campo, "")))))
    blocos += blocos_de_html(paginas.markdown_com_referencias(peca, peca.corpo, modo="texto"))
    return [b for b in blocos if b]


def blocos_da_prosa(prosa: str) -> list[str]:
    """The Method page's prose as the page prints it."""
    return blocos_de_html(paginas.markdown_com_referencias(None, prosa))


def numerar(blocos: list[str]) -> str:
    n, saida = 0, []
    for bloco in blocos:
        linhas = []
        for f in frases(bloco):
            n += 1
            linhas.append(f"[{n}] {f}")
        if linhas:
            saida.append("\n".join(linhas))
    return "\n\n".join(saida) + "\n"


def lista(texto_numerado: str) -> list[str]:
    """The sentences of a numbered text, in order (index 0 is sentence 1)."""
    return [m.group(2) for m in re.finditer(r"(?m)^\[(\d+)\] (.*)$", texto_numerado)]
