"""Reading a figure as a reader sees it (`mostra`) and as a source prints it.

Check 1 reads a `mostra` in its one form (`ler_forma`; docs/ESPEC-PECA.md, check 1, edits of
15 November 2026, 17:07 UTC, and 16 November 2026, 10:50 UTC) and compares it with `valor`: the figure shown must equal `valor`
divided by the scale word the `mostra` may carry, rounded half up to the decimals shown.
Check 2 asks that a `valor` line's excerpt hold the digits of `valor` in one of the ways a
source prints them.
"""
from __future__ import annotations

import re
import unicodedata
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
# Where the form has a space it is exactly one of ESPACOS, the three counting as the same letter.
NUMERO_PT = re.compile(r"(?P<inteiro>[0-9]{1,3}(?:[" + ESPACOS + r"][0-9]{3})+|[0-9]+)(?:,(?P<decimais>[0-9]+))?")
ESCALAS_DA_MOSTRA = (("mil milhões de", 10**9), ("milhões de", 10**6), ("mil", 10**3))


def _nome(c: str) -> str:
    nome = unicodedata.name(c, "")
    return f"U+{ord(c):04X}" + (f" {nome}" if nome else "")


def _sem_nome(c: str) -> str:
    """For a character with no Unicode name (a control), its category, said after the field."""
    return "" if unicodedata.name(c, "") else f" (category {unicodedata.category(c)}, which has no Unicode name)"


# What a mostra and its unidade may hold, and nothing else (docs/ESPEC-PECA.md, check 1, edit of
# 16 November 2026, 13:13 UTC): a Latin letter typed as one character (LATIN_), the digits 0 to 9
# (DIGITOS, the only digits of a number), the three spaces (ESPACOS), and these signs.
DIGITOS = "0123456789"
SINAIS = "%‰,.-−/()€$£°ºª²³µ"  # µ is U+00B5 MICRO SIGN
LATIN_ = ("LATIN SMALL LETTER ", "LATIN CAPITAL LETTER ")


def na_lista(c: str) -> bool:
    if c in DIGITOS or c in ESPACOS or c in SINAIS:
        return True
    return unicodedata.category(c) in ("Ll", "Lu") and unicodedata.name(c, "").startswith(LATIN_)


def so_caracteres_da_lista(campo: str, texto: str) -> None:
    """The rules on characters, for every display, free ones included: white space that is not one
    of ESPACOS is refused as the space rule says it, then anything else off the list."""
    for c in texto:
        if c.isspace() and c not in ESPACOS:
            raise ErroDeFigura(f"{campo} {texto!r}: {_nome(c)} in the {campo}{_sem_nome(c)}; where the one form has a space "
                               "it is exactly one ordinary space, U+00A0 NO-BREAK SPACE or U+202F NARROW NO-BREAK SPACE")
    so_o_que_a_lista_permite(campo, texto)


def so_o_que_a_lista_permite(campo: str, texto: str) -> None:
    """ErroDeFigura naming the character (code point, and its Unicode name or its category) and the
    field when `texto` holds a character that is not on the list (`na_lista`). A combining mark
    that makes one letter with the letter before it is a decomposed accent, said as such."""
    for k, c in enumerate(texto):
        if na_lista(c):
            continue
        if k and unicodedata.category(c).startswith("M") and len(unicodedata.normalize("NFC", texto[k - 1] + c)) == 1:
            raise ErroDeFigura(f"{campo} {texto!r}: {_nome(c)} in the {campo}, after {texto[k - 1]!r}: a decomposed accent; "
                               f"type the accented letter as one character ({unicodedata.normalize('NFC', texto[k - 1] + c)!r})")
        raise ErroDeFigura(f"{campo} {texto!r}: {_nome(c)} in the {campo}{_sem_nome(c)}, which is not on the list of what "
                           f"a display may hold: Latin letters, the digits 0 to 9, the three spaces and the signs {SINAIS}")


def so_os_espacos_da_forma(campo: str, texto: str) -> None:
    """ErroDeFigura naming the character and the field (`mostra` or `unidade`) when `texto` holds
    white space that is not one of ESPACOS, a character not on the list (`so_o_que_a_lista_permite`),
    two spaces in a row, or a space at either end (docs/ESPEC-PECA.md, check 1, edits of 16 November
    2026, 10:50 and 13:13 UTC). Every character is looked at, the ends included."""
    so_caracteres_da_lista(campo, texto)
    for a, b in zip(texto, texto[1:]):
        if a in ESPACOS and b in ESPACOS:
            raise ErroDeFigura(f"{campo} {texto!r}: two spaces in a row in the {campo} ({_nome(a)}, {_nome(b)}); "
                               "where the one form has a space it is exactly one")
    for onde, c in (("start", texto[:1]), ("end", texto[-1:])):
        if c and c in ESPACOS:
            raise ErroDeFigura(f"{campo} {texto!r}: a space ({_nome(c)}) at the {onde} of the {campo}")


def _palavras(texto: str) -> str:
    """The three spaces of the form read as one letter, the ordinary space."""
    return str(texto).replace("\u00a0", " ").replace("\u202f", " ")


def ler_forma(mostra: str, unidade: str, valor: Decimal) -> tuple[Decimal, int, int]:
    """(the figure shown with its sign, the decimals shown, the scale of the scale word) of a mostra
    in its one form, or ErroDeFigura saying which part is wrong. Nothing before the number but a
    minus sign right before it, present exactly when `valor` is negative; after the number a space,
    optionally «mil», «milhões de» or «mil milhões de», then `unidade` letter for letter, and
    nothing after it. Every space of the form, in the mostra and in the unidade, is one of ESPACOS,
    alone (so_os_espacos_da_forma)."""
    so_os_espacos_da_forma("mostra", mostra)
    so_os_espacos_da_forma("unidade", unidade)
    i = next((k for k, c in enumerate(mostra) if c in DIGITOS), None)  # only 0 to 9 are digits of a number
    if i is None:
        raise ErroDeFigura(f"mostra {mostra!r} has no number")
    antes = mostra[:i]
    if antes not in ("", "-", "\u2212"):
        raise ErroDeFigura(f"mostra {mostra!r}: {antes!r} comes before the number; nothing may, but a minus sign right before it")
    m = NUMERO_PT.match(mostra, i)
    resto = mostra[m.end():]
    if resto and resto[0] not in ESPACOS:
        raise ErroDeFigura(f"mostra {mostra!r}: the number {mostra[i:m.end()]!r} is followed by {resto[:1]!r}; in Portuguese "
                           "form a number has a decimal comma and is followed by a space and the unit")
    resto_p, unidade_p = _palavras(resto[1:]), _palavras(unidade)  # after the one space
    escala = 1 if resto_p == unidade_p else next(
        (e for palavra, e in ESCALAS_DA_MOSTRA if resto_p == " ".join(filter(None, (palavra, unidade_p)))), None)
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

