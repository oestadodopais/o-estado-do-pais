"""ESQ2b item 3: the receipts of a quotation and of an act show the date read, in the place
the receipt of a figure shows it (after the source and where it is, before the link)."""
from __future__ import annotations

import re
import tomllib
import unittest

from oedp import construir as build
from oedp import paginas
from oedp.peca import ler
from tests.apoio import REPO, Plantada

ORDEM = {
    "valor": ["O que mede", "A quem se refere", "Período", "Fonte", "Onde está", "Excerto", "Lido a", "(ligação)"],
    "citacao": ["Quem disse", "Quando", "Fonte", "Onde está", "Lido a", "(ligação)"],
    # What the document establishes is the summary, and is not printed a second time (ESQ3, item C).
    "ato": ["Excerto", "Fonte", "Onde está", "Quando", "Lido a", "(ligação)"],
}


def rotulos(recibo: str) -> list[str]:
    """The labels of a receipt's list, in order, with the link to the source as «(ligação)»."""
    return [m.group(1) or "(ligação)" for m in re.finditer(r'<dt>([^<]+)</dt>|<dd class="abrir">', recibo)]


class LidoA(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.p = Plantada()
        peca = ler(cls.p.peca)
        ctx, _ = build.contexto(REPO, cls.p.pasta, [peca])
        cls.html = paginas.pagina_da_peca(peca, ctx)

    @classmethod
    def tearDownClass(cls):
        cls.p.apagar()

    def recibo(self, lid: str, html: str | None = None) -> str:
        return re.search(rf'<span class="ancora" id="r-{lid}"></span>.*?</details>', html or self.html, re.S).group(0)

    def test_os_tres_recibos_mostram_lido_a_no_mesmo_lugar(self):
        for lid, tipo in (("indice", "valor"), ("declaracao", "citacao"), ("despacho", "ato")):
            self.assertEqual(rotulos(self.recibo(lid)), ORDEM[tipo], lid)
        self.assertIn("<dt>Lido a</dt><dd>16 de novembro de 2026</dd>", self.recibo("declaracao"))
        self.assertIn("<dt>Lido a</dt><dd>16 de novembro de 2026</dd>", self.recibo("despacho"))

    def test_planta_recibo_de_ato_sem_lido_a(self):
        plantado = self.html.replace(self.recibo("despacho"),
                                     re.sub(r"<dt>Lido a</dt><dd>[^<]*</dd>", "", self.recibo("despacho")), 1)
        self.assertNotEqual(plantado, self.html)
        self.assertNotEqual(rotulos(self.recibo("despacho", plantado)), ORDEM["ato"])

    def test_os_textos_sao_os_da_tabela(self):
        # The sentences of the file this page was built from (the test site's own), never the real file's
        # typed or assumed equal to them (ESQ3i, B).
        textos = tomllib.loads((self.p.pasta / "textos.toml").read_text(encoding="utf-8"))
        # The sentences are present and printed; that they are the table's words is test_paginas's
        # test_textos_toml_e_a_tabela_da_especificacao (ESQ3i, B: no real sentence typed here).
        self.assertTrue(textos["lugar_desenhador"].strip())
        self.assertTrue(textos["registo_intro"].strip())
        self.assertIn(paginas.e(textos["registo_intro"]), self.html)  # escaped, as the page prints them (ESQ3j, C2)
        self.assertIn(paginas.e(textos["recibos_intro"]), self.html)
        self.assertIn(paginas.e(textos["rodape"]), self.html)
