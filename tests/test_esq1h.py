"""Work order ESQ1h: a fall printed in words («menos 2,1%») supports a negative valor."""
from __future__ import annotations

import unittest

from oedp import numeros

# The release's own words, as the pilot piece's line quotes them.
DA_FONTE = "a secção D (menos 2,1%)"


class SinalEmPalavras(unittest.TestCase):
    def test_um_valor_negativo_e_achado_depois_de_menos(self):
        self.assertTrue(numeros.contem_figura(DA_FONTE, "-2.1"))
        self.assertTrue(numeros.contem_figura("a secção D (Menos 2,1%)", "-2.1"))

    def test_planta_um_valor_positivo_nao_e_achado_com_sinal_ou_menos(self):
        self.assertFalse(numeros.contem_figura(DA_FONTE, "2.1"))
        self.assertFalse(numeros.contem_figura("a secção D (-2,1%)", "2.1"))
        self.assertFalse(numeros.contem_figura("a secção D (− 2,1%)", "2.1"))

    def test_planta_um_valor_negativo_nao_e_achado_sem_sinal(self):
        self.assertFalse(numeros.contem_figura("a secção D (2,1%)", "-2.1"))
        self.assertFalse(numeros.contem_figura("a secção D (demenos 2,1%)", "-2.1"))


if __name__ == "__main__":
    unittest.main()
