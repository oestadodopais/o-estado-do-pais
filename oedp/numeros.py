"""Reading a figure as a reader sees it (`mostra`) and as a source prints it.

Check 1 compares `mostra` with `valor`: the figure shown must equal `valor` times
the scale of `unidade`, divided by the scale of `mostra`, rounded half up to the
decimals shown. Check 2 asks that a `valor` line's excerpt hold the digits of
`valor` in one of the ways a source prints them.
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
FIGURA = re.compile(
    r"(?:(?P<sinal>[-−+])\s*)?(?P<inteiro>\d{1,3}(?:[" + ESPACOS + r"]\d{3})+|\d+)(?:,(?P<decimais>\d+))?"
    r"(?:[" + ESPACOS + r"]+(?P<escala>" + _ESC_RE + r")(?![\w]))?",
)
ESCALA_INICIAL = re.compile(r"\s*(?P<escala>" + _ESC_RE + r")(?![\w])")


class ErroDeFigura(Exception):
    pass


def _escala(palavras: str | None) -> int:
    if not palavras:
        return 1
    chave = re.sub("[" + ESPACOS + "]+", " ", palavras)
    return dict(ESCALAS)[chave]


def ler_mostra(mostra: str) -> tuple[Decimal, int, int]:
    """(figure shown with its sign, decimals shown, scale of the words after it)."""
    achados = list(FIGURA.finditer(mostra))
    if not achados:
        raise ErroDeFigura(f"mostra {mostra!r} has no figure")
    if len(achados) > 1:
        raise ErroDeFigura(f"mostra {mostra!r} shows more than one figure, and cannot be compared with one valor")
    m = achados[0]
    inteiro = re.sub("[" + ESPACOS + "]", "", m["inteiro"])
    decimais = m["decimais"] or ""
    figura = Decimal(inteiro + ("." + decimais if decimais else ""))
    if m["sinal"] in ("-", "−"):
        figura = -figura
    return figura, len(decimais), _escala(m["escala"])


def escala_da_unidade(unidade: str) -> int:
    m = ESCALA_INICIAL.match(unidade or "")
    return _escala(m["escala"]) if m else 1


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


# The units check 1 tells apart (docs/ESPEC-PECA.md, check 1, edit of 15 November 2026, 15:17 UTC):
# per cent, per mille and percentage points are three units, and a currency is not another. A unit
# in words that is not here is not compared by the script: it is the numbers editor's.
UNIDADES = {
    "%": "per cent", "por cento": "per cent",
    "‰": "per mille", "por mil": "per mille",
    "pontos percentuais": "percentage points", "ponto percentual": "percentage points", "p.p.": "percentage points",
    "euros": "euro", "euro": "euro", "€": "euro", "eur": "euro",
    "dólares": "dollar", "dólar": "dollar", "$": "dollar", "usd": "dollar",
    "libras": "pound", "libra": "pound", "£": "pound", "gbp": "pound",
}
_ESCALA_OU_DE = re.compile(r"\A(?:(?:" + _ESC_RE + r")(?![\w])[" + ESPACOS + r"]*)?(?:de[" + ESPACOS + r"]+)?", re.IGNORECASE)


def unidade_lida(texto: str) -> tuple[str, str | None]:
    """(the unit's words, the unit it is when UNIDADES knows it). A scale word that opens it
    («mil», «milhões de») and a «de» are left out: they belong to the number."""
    palavras = re.sub("[" + ESPACOS + r"]+", " ", _ESCALA_OU_DE.sub("", str(texto).strip(), count=1)).strip()
    return palavras, UNIDADES.get(palavras.lower())


def unidade_da_mostra(mostra: str) -> str:
    """What a mostra prints after its figure (the figure's scale word read with the figure)."""
    m = FIGURA.search(mostra)
    return mostra[m.end():].strip() if m else ""
