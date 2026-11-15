"""ESQ3f (blocos/esq3/ORDEM-3f.md): one form for a mostra, and the two tests the third reading's
plants showed missing."""
from __future__ import annotations

import json
import shutil
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path
from unittest import mock

from oedp import conferir as conf
from oedp import leituras, numeros
from tests.test_esq2a import ComLeitura, achado
from tests.test_esq3e import check1_com


class A_UmaFormaParaOMostra(unittest.TestCase):
    CASOS_DO_LEITOR = (  # (unidade, mostra, the part named in the refusal)
        ("euros", "USD 104,7", "comes before the number"), ("euros", "dólares 104,7", "comes before the number"),
        ("euros", "$104,7", "comes before the number"), ("euros", "−€104,7", "comes before the number"),
        ("euros", "€ -104,7", "comes before the number"), ("euros", "104,7 Milhares de euros", "which is not the line's unidade"),
        ("%", "104,7 por mil", "which is not the line's unidade"), ("‰", "104,7 %", "which is not the line's unidade"),
        ("euros", "104,7 Euros", "which is not the line's unidade"),
    )

    def test_os_casos_do_leitor_sao_recusados(self):
        for unidade, mostra, parte in self.CASOS_DO_LEITOR:
            r = check1_com(self, unidade, mostra)
            self.assertEqual(r.estado, conf.FALHOU, (unidade, mostra))
            self.assertTrue(any(x.startswith("indice:") and parte in x for x in r.razoes), (mostra, r.razoes))
            self.assertFalse(any(x.startswith("indice:") for x in r.notas), r.notas)  # never a note

    def test_o_sinal_so_quando_o_valor_e_negativo(self):
        r = check1_com(self, "pontos", "-104,7 pontos")
        self.assertTrue(any("a minus sign, but valor 104.7 is not negative" in x for x in r.razoes), r.razoes)
        self.assertEqual(numeros.ler_forma("−104,7 pontos", "pontos", Decimal("-104.7")), (Decimal("-104.7"), 1, 1))
        with self.assertRaises(numeros.ErroDeFigura) as e:
            numeros.ler_forma("104,7 pontos", "pontos", Decimal("-104.7"))
        self.assertIn("valor -104.7 is negative, and there is no minus sign right before the number", str(e.exception))

    def test_uma_palavra_de_escala(self):
        self.assertEqual(numeros.ler_forma("1,5 mil euros", "euros", Decimal("1500")), (Decimal("1.5"), 1, 1000))
        with self.assertRaises(numeros.ErroDeFigura):
            numeros.ler_forma("1,5 milhares de euros", "euros", Decimal("1500"))
        with self.assertRaises(numeros.ErroDeFigura):  # matched as written, in lower case
            numeros.ler_forma("1,5 Mil euros", "euros", Decimal("1500"))
        self.assertEqual(numeros.ler_forma("602,5 mil postos de trabalho", "mil postos de trabalho", Decimal("602.5")), (Decimal("602.5"), 1, 1))

    def test_planta_o_que_vem_antes_do_numero_lido(self):
        """The ESQ3e reading of a unit before the number: «USD 104,7» on a line in euros was a note, not a refusal."""
        original = numeros.ler_forma

        def tolerante(mostra, unidade, valor):
            i = next(k for k, c in enumerate(mostra) if c.isdigit())
            return original(mostra[i:] + (" " + unidade if unidade else ""), unidade, valor)
        with mock.patch.object(numeros, "ler_forma", tolerante):
            r = check1_com(self, "euros", "USD 104,7")
        self.assertFalse(any(x.startswith("indice:") for x in r.razoes))


class B1_UmaLeituraSemPlantas(ComLeitura):
    def pontuar(self, lugar, decisao):
        pasta, _ = self.lida(plantas=None, achados=[achado("frase 2", "menor", "a small real one")])
        dados = json.loads((pasta / "leitura.json").read_text())
        dados["lugar"] = lugar  # the rule reads the seat only; the package is a juiz's with no plant
        (pasta / "leitura.json").write_text(json.dumps(dados))
        return leituras.pontuar(pasta, self.decisoes(decisao), imprimir=lambda *a: None)

    def test_justica_oposto_correcoes(self):
        for lugar in ("justica", "oposto", "correcoes"):
            p = self.pontuar(lugar, '[[decisao]]\nachado = 1\ndecisao = "adotado"\n')
            self.assertEqual((p["plantas_postas"], p["adotados"], p["veredicto"]), (0, 1, "nao_passa"), lugar)
            p = self.pontuar(lugar, '[[decisao]]\nachado = 1\ndecisao = "recusado"\nrazao = "not so"\n')
            self.assertEqual((p["plantas_postas"], p["adotados"], p["veredicto"]), (0, 0, "passa"), lugar)


class B2_OMarcadorComEspacoAntes(unittest.TestCase):
    def test_so_um_espaco_antes(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-log-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        f = pasta / "LEITURA.md.eventos.log"
        f.write_text("tokens used\n100\n tokens used\n999\n", encoding="utf-8")
        self.assertEqual(leituras.tokens_do_registo(f), 100)


if __name__ == "__main__":
    unittest.main()
