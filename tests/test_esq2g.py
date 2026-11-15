"""ESQ2 item G: the gate on GitHub reads the store once its key exists, and the key is
given to the checkout of the store alone (check 8 reads the workflow)."""
from __future__ import annotations

import re
import unittest

from oedp import conferir as conf
from tests.apoio import REPO

FLUXO = (REPO / ".github" / "workflows" / "portao.yml").read_text(encoding="utf-8")


class ChaveDasFontes(unittest.TestCase):
    def test_o_fluxo_real(self):
        self.assertEqual(conf.chave_das_fontes_so_no_checkout(FLUXO), [])
        # the store is checked out with the pinned action, read before the checks, and given to them
        loja = FLUXO.index("repository: oestadodopais/o-estado-do-pais-fontes")
        self.assertLess(loja, FLUXO.index("run: python3 -m oedp tudo"))
        self.assertEqual(len(re.findall(r"uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7\.0\.1", FLUXO)), 2)
        self.assertIn("OEDP_FONTES: ${{ steps.fontes.outputs.pasta }}", FLUXO)
        self.assertIn('echo "FONTES_CHAVE is not set: the checks run without the store of sources, as before"', FLUXO)

    def test_planta_chave_dada_ao_passo_das_dependencias(self):
        plantado = FLUXO.replace("      - name: Dependencies\n", "      - name: Dependencies\n        env:\n"
                                 "          CHAVE: ${{ secrets.FONTES_CHAVE }}\n", 1)
        self.assertNotEqual(plantado, FLUXO)
        self.assertEqual(conf.chave_das_fontes_so_no_checkout(plantado),
                         [f"line {plantado.splitlines().index('          CHAVE: ${{ secrets.FONTES_CHAVE }}') + 1}: "
                          "FONTES_CHAVE is given to a step other than the checkout of the store"])

    def test_planta_chave_dada_ao_trabalho_inteiro(self):
        plantado = FLUXO.replace("    timeout-minutes: 20\n", "    timeout-minutes: 20\n    env:\n      CHAVE: ${{ secrets.FONTES_CHAVE }}\n", 1)
        self.assertNotEqual(plantado, FLUXO)
        self.assertTrue(conf.chave_das_fontes_so_no_checkout(plantado))

    def test_planta_chave_em_vez_do_sim_ou_nao(self):
        plantado = FLUXO.replace("TEM_CHAVE: ${{ secrets.FONTES_CHAVE != '' }}", "TEM_CHAVE: ${{ secrets.FONTES_CHAVE }}", 1)
        self.assertNotEqual(plantado, FLUXO)
        self.assertEqual(len(conf.chave_das_fontes_so_no_checkout(plantado)), 1)

    def test_check8_le_o_fluxo(self):
        r = conf.check8_arvore(REPO)
        self.assertNotIn("FONTES_CHAVE", " ".join(r.razoes))
