"""Work order ESQ1i: «pelo menos 2,1» is "at least", not a minus; and the two cases
planted in the reader's copy."""
from __future__ import annotations

import unittest

from oedp import conferir as conf
from oedp import numeros
from tests.test_esq1g import Base

EXPRESSOES = ("pelo menos", "ao menos", "mais ou menos", "nada menos", "não menos", "nem menos")


class MenosQueNaoESinal(unittest.TestCase):
    def test_cada_expressao_deixa_a_figura_sem_sinal(self):
        for expressao in EXPRESSOES:
            texto = f"o índice subiu {expressao} 2,1%"
            self.assertTrue(numeros.contem_figura(texto, "2.1"), expressao)
            self.assertFalse(numeros.contem_figura(texto, "-2.1"), expressao)
            maiusculas = f"{expressao.capitalize()} 2,1%"
            self.assertTrue(numeros.contem_figura(maiusculas, "2.1"), maiusculas)

    def test_menos_sozinho_continua_a_ser_sinal(self):
        self.assertTrue(numeros.contem_figura("a secção D (menos 2,1%)", "-2.1"))
        self.assertFalse(numeros.contem_figura("a secção D (menos 2,1%)", "2.1"))


class OsDoisPlantados(Base):
    def test_menos_seguido_de_outra_palavra_nao_e_sinal(self):
        self.assertFalse(numeros.contem_figura("menos de 2,1%", "-2.1"))
        self.assertTrue(numeros.contem_figura("menos de 2,1%", "2.1"))

    def test_toda_a_leitura_que_passa_apanhou_todas_as_plantas_em_qualquer_lugar(self):
        def acrescentar(p):
            with open(p.peca, "a", encoding="utf-8") as f:
                f.write('\n[[leitura]]\nlugar = "oposto"\nfamilia = "openai"\nmodelo = "m"\ninicio = "2026-11-16T12:00:00Z"\n'
                        'fim = "2026-11-16T12:05:00Z"\nimpressao = "' + "a" * 64 + '"\nplantas_postas = 2\nplantas_apanhadas = 1\n'
                        'achados = 0\nadotados = 0\nveredicto = "passa"\n')
        r, _ = self.plantar(depois=acrescentar)
        self.falha(r, 9, "a reading recorded as passing caught 1 of 2 planted errors; it passes only if it caught every one")
        self.assertEqual(r[5].estado, conf.PASSOU)


if __name__ == "__main__":
    unittest.main()
