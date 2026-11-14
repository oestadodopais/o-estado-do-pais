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
    r"(?P<sinal>[-−+])?(?P<inteiro>\d{1,3}(?:[" + ESPACOS + r"]\d{3})+|\d+)(?:,(?P<decimais>\d+))?"
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


def contem_figura(excerto_normalizado: str, valor: str) -> bool:
    for forma in formas_impressas(valor):
        padrao = r"(?<!\d)(?<!\d[.,])" + re.escape(forma) + r"(?!\d)(?![.,]\d)"
        if re.search(padrao, excerto_normalizado):
            return True
    return False
