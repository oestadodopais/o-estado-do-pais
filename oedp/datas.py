"""Dates: real dates, weekdays beside dates (check 6), and dates as readers see them."""
from __future__ import annotations

import datetime as dt
import re
from zoneinfo import ZoneInfo

LISBOA = ZoneInfo("Europe/Lisbon")
MESES = ("janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
         "agosto", "setembro", "outubro", "novembro", "dezembro")
# Monday is 0, as in datetime.weekday().
DIAS = (
    ("segunda-feira", "segunda"),
    ("terça-feira", "terça"),
    ("quarta-feira", "quarta"),
    ("quinta-feira", "quinta"),
    ("sexta-feira", "sexta"),
    ("sábado",),
    ("domingo",),
)
_NOME_DIA = {n: i for i, nomes in enumerate(DIAS) for n in nomes}
_DIA_RE = "|".join(sorted((re.escape(n) for n in _NOME_DIA), key=len, reverse=True))
_MES_RE = "|".join(MESES)
_DATA_RE = (
    r"(?:(?P<d1>\d{1,2})(?:\.º|º)? de (?P<m1>" + _MES_RE + r")(?: de (?P<a1>\d{4}))?"
    r"|(?P<d2>\d{1,2})[./](?P<m2>\d{1,2})(?:[./](?P<a2>\d{4}))?"
    r"|(?P<a3>\d{4})-(?P<m3>\d{2})-(?P<d3>\d{2}))"
)
# A weekday then a date ("segunda-feira, 16 de novembro"), or a date then a weekday
# ("16 de novembro, segunda-feira" or "16 de novembro (segunda-feira)").
DIA_ANTES = re.compile(r"(?<![\w-])(?P<dia>" + _DIA_RE + r")(?![\w-]),?\s+(?:dia\s+)?" + _DATA_RE, re.IGNORECASE)
DIA_DEPOIS = re.compile(_DATA_RE + r"\s*[,(]\s*(?P<dia>" + _DIA_RE + r")(?![\w-])", re.IGNORECASE)

DATA_ISO = re.compile(r"(\d{4})-(\d{2})-(\d{2})\Z")
INSTANTE_ISO = re.compile(r"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z\Z")


def data_real(texto: str) -> dt.date | None:
    m = DATA_ISO.match(texto or "")
    if not m:
        return None
    try:
        return dt.date(int(m[1]), int(m[2]), int(m[3]))
    except ValueError:
        return None


def instante_real(texto: str) -> dt.datetime | None:
    m = INSTANTE_ISO.match(texto or "")
    if not m:
        return None
    try:
        return dt.datetime(*(int(m[i]) for i in range(1, 7)), tzinfo=dt.timezone.utc)
    except ValueError:
        return None


def _data_do_achado(m: re.Match, ano_da_peca: int) -> tuple[dt.date | None, str]:
    g = m.groupdict()
    if g.get("d1"):
        d, mes, a = int(g["d1"]), MESES.index(g["m1"].lower()) + 1, g.get("a1")
    elif g.get("d2"):
        d, mes, a = int(g["d2"]), int(g["m2"]), g.get("a2")
    else:
        d, mes, a = int(g["d3"]), int(g["m3"]), g.get("a3")
    ano = int(a) if a else ano_da_peca
    try:
        return dt.date(ano, mes, d), ""
    except ValueError:
        return None, f"{d}/{mes}/{ano} is not a real date"


def dias_errados(texto: str, ano_da_peca: int) -> list[str]:
    """Every weekday beside a date that is not that date's weekday, as reasons."""
    erros = []
    for padrao in (DIA_ANTES, DIA_DEPOIS):
        for m in padrao.finditer(texto):
            data, problema = _data_do_achado(m, ano_da_peca)
            escrito = m.group("dia").lower()
            if data is None:
                erros.append(f"'{m.group(0)}': {problema}")
                continue
            certo = DIAS[data.weekday()][0]
            if _NOME_DIA[escrito] != data.weekday():
                erros.append(f"'{m.group(0)}': {data.isoformat()} is a {certo}, not a {escrito}")
    return erros


def por_extenso(d: dt.date) -> str:
    """16 de novembro de 2026."""
    return f"{d.day} de {MESES[d.month - 1]} de {d.year}"


def em_lisboa(instante: dt.datetime) -> dt.datetime:
    return instante.astimezone(LISBOA)


def hora(instante: dt.datetime) -> str:
    """14h05, Lisbon time."""
    t = em_lisboa(instante)
    return f"{t.hour}h{t.minute:02d}"
