"""The latest releases of the statistics office: `python3 -m oedp divulgacoes [--dias N] [--json]`
(ORDEM esq3, item J; decision 8).

It reads one page, the office's list of releases (`ENDERECO`), through the fetcher of
`fontes.py` (its agent string, its limits, its rules), stores nothing, and prints for each
release its date, its title and the address of its page, newest first, keeping those of the
last N days (7 when not given): this module's reading of «the last N days» is today and the
N - 1 days before it, by the calendar of Lisbon. It exits 1 with a plain message when the
page cannot be read or holds no release it can parse: an empty list is never printed as if
it were the news. When the page holds releases but none in those days, it says so and
names the latest.

The structure read, measured on the page fetched by hand on 15 November 2026: each release
is a `<div class="destaque_item">` holding an `<a class="linkdestaques" href="…">` with the
title (and after the link, inside the same `<div class="linkdestaques">`, the period it
covers, « - 3.º Trimestre de 2026»), and a `<div class="datadestaques">` with the date
written out («13 de novembro de 2026»). The central bank's and Eurostat's lists are not
read here: nobody has measured their addresses yet.

`--proximas` reads instead the office's calendar of what is still to come (`CALENDARIO`;
ORDEM-3b, item J), the same way: one page, nothing stored, exit 1 when it cannot be read or
parsed. Measured on the page fetched by hand on 15 November 2026, 14:37 UTC: a
`<table class="tb_ine">` whose body rows each hold four cells, the title (in a
`span.datadestaques`), the period, the date written out, and a note (one row said its release
was put off). Every row is printed, its note with it, oldest first; `--dias N`, when given,
keeps those of today and the N - 1 days after it.
"""
from __future__ import annotations

import datetime as dt
import html.parser
import json
import re
import sys
import urllib.parse
from dataclasses import asdict, dataclass

from . import datas, fontes

ENDERECO = "https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&xlang=pt"
CALENDARIO = "https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_calendarios&xlang=pt"
MESES = {m: i for i, m in enumerate(("janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto",
                                      "setembro", "outubro", "novembro", "dezembro"), 1)}
DATA = re.compile(r"(\d{1,2}) de ([a-zç]+) de (\d{4})", re.IGNORECASE)


class ErroDasDivulgacoes(Exception):
    pass


@dataclass
class Divulgacao:
    data: str  # YYYY-MM-DD
    titulo: str
    endereco: str


class _Lista(html.parser.HTMLParser):
    """The releases of the page, in the order the page gives them."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.itens: list[dict] = []
        self.pilha: list[str] = []  # the class of each open <div>
        self.onde: str | None = None  # "titulo" or "data" while inside one

    def _dentro(self, classe: str) -> bool:
        return classe in self.pilha

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        classes = (a.get("class") or "").split()
        if tag == "div":
            classe = next((c for c in classes if c in ("destaque_item", "linkdestaques", "datadestaques")), "")
            self.pilha.append(classe)
            if classe == "destaque_item":
                self.itens.append({"titulo": "", "href": "", "data": ""})
            elif self.itens and self._dentro("destaque_item"):
                self.onde = {"linkdestaques": "titulo", "datadestaques": "data"}.get(classe, self.onde)
        elif tag == "a" and "linkdestaques" in classes and self.itens and self._dentro("destaque_item") and not self.itens[-1]["href"]:
            self.itens[-1]["href"] = a.get("href") or ""

    def handle_endtag(self, tag):
        if tag == "div" and self.pilha:
            classe = self.pilha.pop()
            if classe in ("linkdestaques", "datadestaques"):
                self.onde = None

    def handle_data(self, data):
        if self.onde and self.itens and self._dentro("destaque_item"):
            self.itens[-1][self.onde] += data


def _erro(texto: str):
    print(texto, file=sys.stderr)


def ler(conteudo: bytes, base: str = ENDERECO) -> list[Divulgacao]:
    """The releases a page holds that can be read whole, newest first (see `ler_tudo`)."""
    return ler_tudo(conteudo, base)[0]


def ler_tudo(conteudo: bytes, base: str = ENDERECO) -> tuple[list[Divulgacao], list[str]]:
    """(the releases read whole: a date, a title, an address, newest first; the releases that
    could not be read whole, named). A list with a release missing is not the list (ORDEM-3c,
    item I): the caller refuses to print it."""
    p = _Lista()
    p.feed(fontes._descodificar(conteudo))
    p.close()
    lidas, falhas = [], []
    for n, item in enumerate(p.itens, 1):
        titulo = re.sub(r"\s+", " ", item["titulo"]).strip()
        m = DATA.search(item["data"])
        data = None
        if m and m.group(2).lower() in MESES:
            data = datas.data_real(f"{int(m.group(3)):04d}-{MESES[m.group(2).lower()]:02d}-{int(m.group(1)):02d}")
        if titulo and data and item["href"]:
            lidas.append(Divulgacao(data.isoformat(), titulo, urllib.parse.urljoin(base, item["href"])))
        else:
            falta = [nome for nome, v in (("title", titulo), ("date", data), ("address", item["href"])) if not v]
            falhas.append(f"release number {n} on the page ({titulo[:60] or 'no title'}) has no {' and no '.join(falta)}")
    return sorted(lidas, key=lambda d: d.data, reverse=True), falhas


@dataclass
class Proxima:
    data: str  # YYYY-MM-DD
    titulo: str
    periodo: str
    nota: str  # "" when the row has none


class _Calendario(html.parser.HTMLParser):
    """The cells of each body row of the calendar's table, in order."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.linhas: list[list[str]] = []
        self.cabeca: list[str] = []  # the head's cells, in order
        self.na_tabela = 0  # depth of <table class="tb_ine">
        self.no_corpo = False
        self.na_cabeca = False
        self.celula: list[str] | None = None
        self.th_no_corpo = []  # body rows that hold a <th>: a cell where the head puts none

    def handle_starttag(self, tag, attrs):
        classes = (dict(attrs).get("class") or "").split()
        if tag == "table":
            if self.na_tabela or "tb_ine" in classes:
                self.na_tabela += 1
        elif self.na_tabela == 1 and tag == "tbody":
            self.no_corpo = True
        elif self.na_tabela == 1 and tag == "thead":
            self.na_cabeca = True
        elif self.na_tabela == 1 and self.na_cabeca and tag == "th":
            self.celula = []
        elif self.na_tabela == 1 and self.no_corpo and tag == "tr":
            self.linhas.append([])
        elif self.na_tabela == 1 and self.no_corpo and tag == "th" and self.linhas:
            self.th_no_corpo.append(len(self.linhas))
        elif self.na_tabela == 1 and self.no_corpo and tag == "td" and self.linhas:
            self.celula = []
        elif self.celula is not None and tag in ("p", "br"):
            self.celula.append(" ")

    def handle_endtag(self, tag):
        if tag == "table" and self.na_tabela:
            self.na_tabela -= 1
        elif tag == "tbody" and self.na_tabela == 1:
            self.no_corpo = False
        elif tag == "thead" and self.na_tabela == 1:
            self.na_cabeca = False
        elif tag == "th" and self.na_cabeca and self.celula is not None:
            self.cabeca.append(re.sub(r"\s+", " ", "".join(self.celula)).strip())
            self.celula = None
        elif tag == "td" and self.celula is not None:
            self.linhas[-1].append(re.sub(r"\s+", " ", "".join(self.celula)).strip())
            self.celula = None

    def handle_data(self, data):
        if self.celula is not None:
            self.celula.append(data)


def _data(texto: str):
    m = DATA.search(texto)
    if m and m.group(2).lower() in MESES:
        return datas.data_real(f"{int(m.group(3)):04d}-{MESES[m.group(2).lower()]:02d}-{int(m.group(1)):02d}")
    return None


def ler_calendario(conteudo: bytes) -> list[Proxima]:
    """The rows of the calendar read whole, oldest first (see `ler_calendario_tudo`)."""
    return ler_calendario_tudo(conteudo)[0]


def ler_calendario_tudo(conteudo: bytes) -> tuple[list[Proxima], list[str]]:
    """(the rows read whole: a title, a period, a date, and the note in the cell the head puts it,
    oldest first; the rows that could not be read whole, named). A row with fewer cells than the
    table's head, or whose note is not where the head puts it, is not read (ORDEM-3c, item I)."""
    p = _Calendario()
    p.feed(fontes._descodificar(conteudo))
    p.close()
    nota = next((i for i, c in enumerate(p.cabeca) if c.lower().startswith("observa")), None)
    lidas, falhas = [], []
    if p.linhas and (nota is None or len(p.cabeca) < 4):
        return [], [f"the calendar's head ({' | '.join(p.cabeca) or 'none'}) is not the four cells this command reads "
                    "(title, period, date, Observações)"]
    for n, celulas in enumerate(p.linhas, 1):
        data = _data(celulas[2]) if len(celulas) >= 3 else None
        nome = celulas[0][:60] if celulas else "no title"
        if n in p.th_no_corpo or len(celulas) < len(p.cabeca):
            falhas.append(f"row number {n} of the calendar ({nome}) has {len(celulas)} cells where its head has "
                          f"{len(p.cabeca)}, so its note is not where the head puts it")
        elif not (celulas[0] and celulas[1] and data):
            falta = [k for k, v in (("title", celulas[0]), ("period", celulas[1]), ("date", data)) if not v]
            falhas.append(f"row number {n} of the calendar ({nome}) has no {' and no '.join(falta)}")
        else:
            lidas.append(Proxima(data.isoformat(), celulas[0], celulas[1], celulas[nota]))
    return sorted(lidas, key=lambda d: d.data), falhas


def correr_proximas(dados: bytes, dias: int | None, como_json: bool, hoje: dt.date, imprimir=print, erro=_erro) -> int:
    lidas, falhas = ler_calendario_tudo(dados)
    if falhas:  # a calendar with a row missing is not the calendar: nothing is listed
        for f in falhas:
            erro(f"divulgacoes --proximas: {f}")
        erro(f"divulgacoes --proximas: {len(falhas)} row(s) of {CALENDARIO} could not be read whole; nothing is listed.")
        return 1
    if not lidas:
        imprimir(f"divulgacoes --proximas: the page {CALENDARIO} holds no row this command can read (no row with a title, "
                 "a period and a date); its structure may have changed. Nothing is listed.")
        return 1
    escolhidas = lidas if dias is None else [d for d in lidas
                                             if hoje.isoformat() <= d.data <= (hoje + dt.timedelta(days=dias - 1)).isoformat()]
    if como_json:
        imprimir(json.dumps({"endereco": CALENDARIO, "hoje": hoje.isoformat(), "dias": dias,
                             "proximas": [asdict(d) for d in escolhidas]}, ensure_ascii=False, indent=1))
        return 0
    if not escolhidas:
        imprimir(f"no release in the statistics office's calendar in the {dias} days from {hoje.isoformat()}; the first on "
                 f"its page is of {lidas[0].data}: {lidas[0].titulo}")
        return 0
    for d in escolhidas:
        imprimir(f"{d.data}  {d.titulo} · {d.periodo}" + (f"  note: {d.nota}" if d.nota else ""))
    return 0


def recentes(lidas: list[Divulgacao], dias: int, hoje: dt.date) -> list[Divulgacao]:
    desde = hoje - dt.timedelta(days=dias - 1)
    return [d for d in lidas if desde.isoformat() <= d.data <= hoje.isoformat()]


def buscar(transporte=fontes.transporte_curl, resolver=fontes.resolver_dns, endereco: str = ENDERECO) -> bytes:
    try:
        _, dados = fontes.ler_pagina(endereco, transporte, resolver)
    except fontes.ErroDaLoja as e:
        qual = "calendar" if endereco == CALENDARIO else "list of releases"
        raise ErroDasDivulgacoes(f"the statistics office's {qual} could not be read: {e}") from None
    return dados


def correr(dados: bytes, dias: int, como_json: bool, hoje: dt.date, imprimir=print, erro=_erro) -> int:
    """Print the releases of the last `dias` days from the bytes of the page; the exit code."""
    lidas, falhas = ler_tudo(dados)
    if falhas:  # a list with a release missing is not the list: nothing is listed
        for f in falhas:
            erro(f"divulgacoes: {f}")
        erro(f"divulgacoes: {len(falhas)} release(s) of {ENDERECO} could not be read whole; nothing is listed.")
        return 1
    if not lidas:
        imprimir(f"divulgacoes: the page {ENDERECO} holds no release this command can read (no item with a date, a "
                 "title and an address); its structure may have changed. Nothing is listed.")
        return 1
    escolhidas = recentes(lidas, dias, hoje)
    if como_json:
        imprimir(json.dumps({"endereco": ENDERECO, "hoje": hoje.isoformat(), "dias": dias,
                             "divulgacoes": [asdict(d) for d in escolhidas],
                             "mais_recente_na_pagina": asdict(lidas[0])}, ensure_ascii=False, indent=1))
        return 0
    if not escolhidas:
        imprimir(f"no release of the statistics office in the last {dias} days (to {hoje.isoformat()}); the latest on its "
                 f"page is of {lidas[0].data}: {lidas[0].titulo}")
        return 0
    for d in escolhidas:
        imprimir(f"{d.data}  {d.titulo}  {d.endereco}")
    return 0
