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
"""
from __future__ import annotations

import datetime as dt
import html.parser
import json
import re
import urllib.parse
from dataclasses import asdict, dataclass

from . import datas, fontes

ENDERECO = "https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&xlang=pt"
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


def ler(conteudo: bytes, base: str = ENDERECO) -> list[Divulgacao]:
    """The releases a page holds that can be read whole (a date, a title, an address), newest
    first; a release missing any of the three is left out."""
    p = _Lista()
    p.feed(fontes._descodificar(conteudo))
    p.close()
    lidas = []
    for item in p.itens:
        titulo = re.sub(r"\s+", " ", item["titulo"]).strip()
        m = DATA.search(item["data"])
        data = None
        if m and m.group(2).lower() in MESES:
            data = datas.data_real(f"{int(m.group(3)):04d}-{MESES[m.group(2).lower()]:02d}-{int(m.group(1)):02d}")
        if titulo and data and item["href"]:
            lidas.append(Divulgacao(data.isoformat(), titulo, urllib.parse.urljoin(base, item["href"])))
    return sorted(lidas, key=lambda d: d.data, reverse=True)


def recentes(lidas: list[Divulgacao], dias: int, hoje: dt.date) -> list[Divulgacao]:
    desde = hoje - dt.timedelta(days=dias - 1)
    return [d for d in lidas if desde.isoformat() <= d.data <= hoje.isoformat()]


def buscar(transporte=fontes.transporte_curl, resolver=fontes.resolver_dns) -> bytes:
    try:
        _, dados = fontes.ler_pagina(ENDERECO, transporte, resolver)
    except fontes.ErroDaLoja as e:
        raise ErroDasDivulgacoes(f"the statistics office's list of releases could not be read: {e}") from None
    return dados


def correr(dados: bytes, dias: int, como_json: bool, hoje: dt.date, imprimir=print) -> int:
    """Print the releases of the last `dias` days from the bytes of the page; the exit code."""
    lidas = ler(dados)
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
