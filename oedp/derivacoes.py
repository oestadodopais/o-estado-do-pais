"""Check 3's arithmetic, lifted from the engine's `core/derivations.py`.

What was lifted, and nothing else: the grammar (numbers, line ids, `+ - * /`,
parentheses and `round ( x , n )`, every token separated by spaces), the fixed
local context (28 significant digits, half-even for intermediate results), `round`
rounding half up (away from zero), the narrow form of a number, ASCII digits for
`round`'s places, exact comparison by value, and a zero printed without a sign.
What was left out: the engine's printed-mark propagation and document functions,
which the piece file does not have. The engine's shared file of cases is kept as
`ensaios/derivacoes-paridade.json` and the tests evaluate every case in it.
"""
from __future__ import annotations

import re
from decimal import (
    ROUND_HALF_EVEN,
    ROUND_HALF_UP,
    Context,
    Decimal,
    DivisionByZero,
    InvalidOperation,
    localcontext,
)

PRECISAO = 28
REGRA_DAS_INTERMEDIAS = ROUND_HALF_EVEN
REGRA_DO_ROUND = ROUND_HALF_UP

LITERAL = re.compile(r"-?\d+(\.\d+)?\Z", re.ASCII)
_COMECA_COMO_NUMERO = re.compile(r"[0-9+.-]")
_CASAS = re.compile(r"[0-9]+\Z", re.ASCII)


class ErroDeConta(Exception):
    """The expression is malformed, or refers to something it cannot use."""


def contexto() -> Context:
    return Context(
        prec=PRECISAO,
        rounding=REGRA_DAS_INTERMEDIAS,
        Emin=-999999,
        Emax=999999,
        capitals=1,
        clamp=0,
        flags=[],
        traps=[InvalidOperation, DivisionByZero],
    )


def simbolos(expr: str) -> list[str]:
    espacado = str(expr)
    for p in "(),":
        espacado = espacado.replace(p, f" {p} ")
    return espacado.split()


def numero(texto: str) -> Decimal:
    """A value written in the narrow form, or ErroDeConta."""
    if not isinstance(texto, str) or not LITERAL.match(texto):
        raise ErroDeConta(f"{texto!r} is not a plain decimal number (digits, one dot, a leading minus)")
    return Decimal(texto)


def avaliar(expr: str, valores: dict[str, str], proprio: str | None = None) -> Decimal:
    """Evaluate `expr`; `valores` maps line ids to their `valor` strings."""
    with localcontext(contexto()):
        return _avaliar(expr, valores, proprio)


def _avaliar(expr: str, valores: dict[str, str], proprio: str | None) -> Decimal:
    toks = simbolos(expr)
    if not toks:
        raise ErroDeConta("the calculation is empty")
    pos = 0

    def espreita():
        return toks[pos] if pos < len(toks) else None

    def avanca():
        nonlocal pos
        if pos >= len(toks):
            raise ErroDeConta("the calculation ends mid-expression")
        t = toks[pos]
        pos += 1
        return t

    def espera(t):
        veio = avanca()
        if veio != t:
            raise ErroDeConta(f"expected {t!r}, found {veio!r}")

    def valor_de(t):
        if _COMECA_COMO_NUMERO.match(t):
            if not LITERAL.match(t):
                raise ErroDeConta(f"{t!r} is not a number in this grammar (no exponent, no plus sign, no Infinity, no NaN)")
            return Decimal(t)
        if t == proprio:
            raise ErroDeConta(f"the calculation refers to its own line ({t!r})")
        if t not in valores:
            raise ErroDeConta(f"the calculation refers to {t!r}, which is not a line with a valor in this fact sheet")
        return numero(valores[t])

    def primario():
        t = avanca()
        if t == "(":
            v = expressao()
            espera(")")
            return v
        if t == "-":
            return -primario()
        if t == "round":
            espera("(")
            v = expressao()
            espera(",")
            casas = avanca()
            if not _CASAS.match(casas):
                raise ErroDeConta(f"round() needs a whole number of places in ASCII digits, found {casas!r}")
            espera(")")
            return v.quantize(Decimal(1).scaleb(-int(casas)), rounding=REGRA_DO_ROUND)
        if t in {")", ",", "+", "*", "/"}:
            raise ErroDeConta(f"stray {t!r}")
        return valor_de(t)

    def termo():
        v = primario()
        while espreita() in {"*", "/"}:
            op = avanca()
            d = primario()
            if op == "*":
                v = v * d
            else:
                try:
                    v = v / d
                except (DivisionByZero, InvalidOperation):
                    raise ErroDeConta("the calculation divides by zero") from None
        return v

    def expressao():
        v = termo()
        while espreita() in {"+", "-"}:
            op = avanca()
            d = termo()
            v = v + d if op == "+" else v - d
        return v

    resultado = expressao()
    if pos != len(toks):
        raise ErroDeConta(f"trailing tokens: {' '.join(toks[pos:])!r}")
    return resultado


def canonica(v: Decimal) -> str:
    """The canonical string of a value; any zero is `0`."""
    if v.is_zero():
        return "0"
    with localcontext() as ctx:
        ctx.prec = max(PRECISAO, len(v.as_tuple().digits))
        return format(v.normalize(), "f")


_SIMBOLO = re.compile(r"(?:-?\d+(?:\.\d+)?|[a-z][a-z0-9_]*|[-+*/(),])\Z", re.ASCII)


def erros_de_espacamento(expr: str) -> list[str]:
    """The piece file's grammar: every token separated by spaces (`round(0.5,0)` is refused)."""
    return [f"{t!r} is not one token: in calculo every token is separated by spaces"
            for t in str(expr).split() if not _SIMBOLO.match(t)]


def arredondamento_exterior(toks: list[str]) -> int | None:
    """The places of a `round ( x , n )` that wraps the whole expression, or None.

    The piece file allows `round` only once and only as the outermost step
    (docs/ESPEC-PECA.md, edit of 14 November 2026, 22:18 UTC): the receipt shows the
    arithmetic and then the rounding in words, which a rounding in the middle cannot be.
    """
    if len(toks) < 6 or toks[0] != "round" or toks[1] != "(" or toks[-1] != ")" or toks[-3] != ",":
        return None
    if toks.count("round") != 1 or not _CASAS.match(toks[-2]):
        return None
    profundidade = 0
    for i, t in enumerate(toks[1:], 1):
        profundidade += {"(": 1, ")": -1}.get(t, 0)
        if profundidade == 0 and i != len(toks) - 1:
            return None
    return int(toks[-2])


def ids_em(expr: str) -> list[str]:
    """The line ids an expression names, in order."""
    return [t for t in simbolos(expr) if re.fullmatch(r"[a-z][a-z0-9_]*", t) and t != "round"]
