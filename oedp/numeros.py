"""Reading a figure as a reader sees it (`mostra`) and as a source prints it.

Check 1 reads a `mostra` in its one form (`ler_forma`; docs/ESPEC-PECA.md, check 1, edit of
15 November 2026, 17:07 UTC) and compares it with `valor`: the figure shown must equal `valor`
divided by the scale word the `mostra` may carry, rounded half up to the decimals shown.
Check 2 asks that a `valor` line's excerpt hold the digits of `valor` in one of the ways a
source prints them.
"""
from __future__ import annotations

import re
from decimal import ROUND_HALF_UP, Decimal, localcontext

ESPACOS = "   "
# Longest first, so "mil milhões" is read before "mil".
ESCALAS = (
    ("mil milhões", 10**9),
    ("biliões", 10**12),
    ("bilião", 10**12),
    ("milhões", 10**6),
    ("milhão", 10**6),
    ("mil", 10**3),
)
_ESC_RE = "|".join(re.escape(n).replace("\\ ", "[" + ESPACOS + "]+") for n, _ in ESCALAS)
# Where the page finds a printed figure and the scale word read with it (`paginas.sem_quebra`).
FIGURA = re.compile(
    r"(?:(?P<sinal>[-−+])\s*)?(?P<inteiro>\d{1,3}(?:[" + ESPACOS + r"]\d{3})+|\d+)(?:,(?P<decimais>\d+))?"
    r"(?:[" + ESPACOS + r"]+(?P<escala>" + _ESC_RE + r")(?![\w]))?",
)


class ErroDeFigura(Exception):
    pass


# The one form of a mostra: an optional minus sign right before the number, the number in
# Portuguese form, a space, optionally one scale word, and the line's own unidade letter for letter.
NUMERO_PT = re.compile(r"(?P<inteiro>\d{1,3}(?:[" + ESPACOS + r"]\d{3})+|\d+)(?:,(?P<decimais>\d+))?")
ESCALAS_DA_MOSTRA = (("mil milhões de", 10**9), ("milhões de", 10**6), ("mil", 10**3))


def _palavras(texto: str) -> str:
    """Trimmed, with every run of white space (a no-break space included) taken as one space."""
    return re.sub(r"\s+", " ", str(texto)).strip()


def ler_forma(mostra: str, unidade: str, valor: Decimal) -> tuple[Decimal, int, int]:
    """(the figure shown with its sign, the decimals shown, the scale of the scale word) of a mostra
    in its one form, or ErroDeFigura saying which part is wrong. Nothing before the number but a
    minus sign right before it, present exactly when `valor` is negative; after the number a space,
    optionally «mil», «milhões de» or «mil milhões de», then `unidade` letter for letter, and
    nothing after it."""
    i = next((k for k, c in enumerate(mostra) if c.isdigit()), None)
    if i is None:
        raise ErroDeFigura(f"mostra {mostra!r} has no number")
    antes = mostra[:i]
    if antes not in ("", "-", "\u2212"):
        raise ErroDeFigura(f"mostra {mostra!r}: {antes!r} comes before the number; nothing may, but a minus sign right before it")
    m = NUMERO_PT.match(mostra, i)
    resto = mostra[m.end():]
    if resto and not resto[0].isspace():
        raise ErroDeFigura(f"mostra {mostra!r}: the number {mostra[i:m.end()]!r} is followed by {resto[:1]!r}; in Portuguese "
                           "form a number has a decimal comma and is followed by a space and the unit")
    resto_p, unidade_p = _palavras(resto), _palavras(unidade)
    escala = 1 if resto_p == unidade_p else next(
        (e for palavra, e in ESCALAS_DA_MOSTRA if resto_p == _palavras(f"{palavra} {unidade_p}")), None)
    if escala is None:
        raise ErroDeFigura(f"mostra {mostra!r}: after the number comes {resto_p!r}, which is not the line's unidade "
                           f"{unidade_p!r} letter for letter; only «mil», «milhões de» or «mil milhões de» may come before it")
    negativo = bool(antes)
    if negativo != (valor < 0):
        raise ErroDeFigura(f"mostra {mostra!r}: " + (f"a minus sign, but valor {valor} is not negative" if negativo
                                                       else f"valor {valor} is negative, and there is no minus sign right before the number"))
    inteiro = re.sub(r"\s", "", m["inteiro"])
    decimais = m["decimais"] or ""
    figura = Decimal(inteiro + ("." + decimais if decimais else ""))
    return (-figura if negativo else figura), len(decimais), escala


def esperado(valor: Decimal, escala_unidade: int, escala_mostra: int, casas: int) -> Decimal:
    with localcontext() as ctx:
        ctx.prec = 80
        bruto = valor * escala_unidade / escala_mostra
        return bruto.quantize(Decimal(1).scaleb(-casas), rounding=ROUND_HALF_UP)


def portugues(v: Decimal | str) -> str:
    """A plain decimal written with a decimal comma, for a calculation shown to readers."""
    return str(v).replace(".", ",")


def formas_impressas(valor: str) -> set[str]:
    """The ways a source may print `valor` (absolute), after NFKC (spaces are plain)."""
    texto = valor.lstrip("-")
    inteiro, _, decimais = texto.partition(".")
    grupos = []
    resto = inteiro
    while len(resto) > 3:
        grupos.insert(0, resto[-3:])
        resto = resto[:-3]
    grupos.insert(0, resto)
    formas = set()
    for mil in ("", " ", ".", ","):
        if mil and len(grupos) == 1:
            continue
        corpo = mil.join(grupos)
        if not decimais:
            formas.add(corpo)
            continue
        for dec in (".", ","):
            if mil and mil == dec:
                continue
            formas.add(corpo + dec + decimais)
    return formas


# A whole number as a source prints it: thousands groups (space, point or comma) and
# decimals. The longest reading wins, so `234` is not found inside `1 234 567`, nor
# `4,7` inside `104,7`.
NUMERO_INTEIRO = re.compile(r"(?<![\d.,])(?:\d{1,3}(?:[ .,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?)(?![\d])")


# A row of a table (`linha_de_quadro = true`): every space separates two numbers, so only a point
# or a comma groups thousands (docs/ESPEC-PECA.md, check 2, edit of 15 November 2026, 15:17 UTC).
NUMERO_DE_QUADRO = re.compile(r"(?<![\d.,])(?:\d{1,3}(?:[.,]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?)(?![\d])")


MENOS_SEM_SINAL = {"pelo", "ao", "ou", "nada", "não", "nem"}  # pelo menos, ao menos, mais ou menos, nada menos, não menos, nem menos


def ocorrencias(excerto_normalizado: str, valor: str, quadro: bool = False) -> list[tuple[int, int]]:
    """The places (start, end) in the normalised excerpt where it holds the figure, in order.

    A negative valor is found only with its sign (hyphen or minus sign, a space allowed
    after it) or the word «menos» before it; a positive one only without. The place is the
    number itself, its sign left out. Check 2 counts these (`ocorrencia`), and the page
    marks one of them (docs/ESPEC-PECA.md, edit of 15 November 2026, 13:17 UTC). With `quadro`
    (the line's `linha_de_quadro`), a space always separates two numbers."""
    formas = formas_impressas(valor)
    negativo = valor.strip().startswith("-")
    lugares = []
    for m in (NUMERO_DE_QUADRO if quadro else NUMERO_INTEIRO).finditer(excerto_normalizado):
        if m.group(0) not in formas:
            continue
        antes = excerto_normalizado[: m.start()]
        # A sign, or the word «menos» as Portuguese sources print a fall ("menos 2,1%") ...
        com_sinal = re.search(r"[-\u2212] ?\Z", antes) is not None
        menos = re.search(r"(?:(?<![^\W\d_])([^\W\d_]+)\s+)?(?<![^\W\d_])menos\s+\Z", antes, re.IGNORECASE)
        # ... unless it belongs to an expression that means something else ("pelo menos 2,1": at least).
        if menos and (menos.group(1) or "").lower() not in MENOS_SEM_SINAL:
            com_sinal = True
        if com_sinal == negativo:
            lugares.append((m.start(), m.end()))
    return lugares


def contem_figura(excerto_normalizado: str, valor: str, quadro: bool = False) -> bool:
    """Whether the excerpt holds the figure at least once (see `ocorrencias`)."""
    return bool(ocorrencias(excerto_normalizado, valor, quadro))

