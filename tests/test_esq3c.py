"""ESQ3 items C (the second heading, r_entra_em) and H (the Method page's last re-check), which
need the four fixed sentences of docs/ESPEC-PAGINAS.md's edit of 15 November 2026, 13:09 UTC.
The pages are rendered directly, without the build's gate."""
from __future__ import annotations

import re
import unittest

from oedp import construir as build
from oedp import paginas
from tests.apoio import REPO
from tests.test_esq3 import NAO_USADA, SO_ENTRADA, pagina_plantada, recibo


def contexto():
    return build.contexto(REPO, REPO, [])[0]


class C_OSegundoTituloEEntraEm(unittest.TestCase):
    def test_uma_linha_so_de_entrada_vem_debaixo_do_segundo_titulo(self):
        _, html, _ = pagina_plantada(self, SO_ENTRADA)
        depois = html.split('<h3 class="recibos-entradas">Números que entram nas contas acima</h3>', 1)
        self.assertEqual(len(depois), 2)
        self.assertEqual(re.findall(r'id="r-([a-z_]+)"></span>', depois[1]), ["indice_anterior"])
        self.assertIn('<p class="entra-em">Entra na conta de <a href="#r-diferenca">2,4 pontos</a></p>',
                      recibo(html, "indice_anterior"))

    def test_sem_linha_so_de_entrada_nao_ha_segundo_titulo(self):
        for trocas in ([], NAO_USADA):
            _, html, _ = pagina_plantada(self, trocas)
            self.assertNotIn("recibos-entradas", html)

    def test_impressa_e_de_entrada_uma_vez_debaixo_do_primeiro_titulo_com_entra_em(self):
        _, html, _ = pagina_plantada(self, [])
        self.assertEqual(html.count('id="r-indice"'), 1)
        self.assertIn('<p class="entra-em">Entra na conta de <a href="#r-diferenca">', recibo(html, "indice"))
        self.assertNotIn("entra-em", recibo(html, "total"))

    def test_planta_a_linha_so_de_entrada_debaixo_do_primeiro_titulo(self):
        _, html, _ = pagina_plantada(self, SO_ENTRADA)
        plantado = html.replace('<h3 class="recibos-entradas">Números que entram nas contas acima</h3>', "", 1)
        self.assertNotIn("recibos-entradas", plantado)


class H_AUltimaReconferenciaNoMetodo(unittest.TestCase):
    def metodo(self, tabelas):
        ctx = contexto()
        ctx.reconferencias = tabelas
        ctx.metodo = ctx.metodo or "Texto."
        return re.search(r'<p class="reconferencia">(.*?)</p>', paginas.pagina_do_metodo(ctx)).group(1)

    def test_nenhuma(self):
        self.assertEqual(self.metodo([]), "Ainda não houve nenhuma conferência das fontes das peças publicadas.")

    def test_a_ultima_que_podia_retirar(self):
        t = lambda em, so, r: {"em": em, "pecas": 2, "excertos": 9, "falhados": len(r), "retiradas": r, "so_relatar": so}
        tabelas = [t("2026-11-22T06:00:00Z", False, ["2026-11-15-a"]), t("2026-11-29T06:00:00Z", False, []),
                   t("2026-11-30T06:00:00Z", True, ["2026-11-15-b"])]
        self.assertEqual(self.metodo(tabelas), "Última conferência das fontes: 29 de novembro de 2026. Peças conferidas: 2. "
                                               "Excertos conferidos: 9. Peças retiradas: 0.")
        self.assertEqual(self.metodo(tabelas[2:]), "Ainda não houve nenhuma conferência das fontes das peças publicadas.")


if __name__ == "__main__":
    unittest.main()
