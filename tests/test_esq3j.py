"""ESQ3h (blocos/esq3/ORDEM-3h.md): A, a suite that runs no test is a failure; B, nothing a reader
cannot see in a mostra or its unidade; C, a test for each of the fifth reading's three plants."""
from __future__ import annotations

import contextlib
import datetime as dt
import io
import unittest
from decimal import Decimal
from unittest import mock

from oedp import conferir as conf
from oedp import numeros
from tests import adiante
from tests.apoio import perto_do_relogio
from tests.test_esq3i import arvore_de_rascunho, check1_de, relogio_real

# --------------------------------------------------------------------------- A


class A_NenhumTesteEUmaFalha(unittest.TestCase):
    def test_adiante_sobre_uma_arvore_sem_testes(self):
        raiz = arvore_de_rascunho(self, {"test_vazio.py": "import unittest\n"})
        linhas: list[str] = []
        self.assertEqual(adiante.correr((1, 400), raiz=raiz, imprimir=linhas.append), 1, linhas)
        self.assertEqual(linhas, ["adiante · days +0 (real clock) · 0 tests · failed: no test ran",
                                  "adiante · days +1 · 0 tests · failed: no test ran",
                                  "adiante · days +400 · 0 tests · failed: no test ran", "adiante: failed"])

    def test_um_executor_que_diz_passou_sem_testes(self):
        # Python 3.12's unittest exits 5 when no test ran, so the line above fails on the exit code too;
        # a runner that exits 0 with no test (as unittest did before 3.12) still fails on the count.
        linhas: list[str] = []
        with mock.patch.object(adiante, "uma_corrida", return_value=(0, True, [])):
            self.assertEqual(adiante.correr((), imprimir=linhas.append), 1)
        self.assertEqual(linhas, ["adiante · days +0 (real clock) · 0 tests · failed: no test ran", "adiante: failed"])

    def test_tudo_com_uma_bateria_vazia(self):
        from oedp import __main__ as cli
        saida = io.StringIO()
        with mock.patch.object(cli, "cmd_conferir", return_value=0), mock.patch.object(cli, "cmd_construir", return_value=0), \
                mock.patch.object(cli.unittest.defaultTestLoader, "discover", return_value=unittest.TestSuite()), \
                contextlib.redirect_stdout(saida), contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(cli.cmd_tudo(None), 1)
        self.assertIn("tudo: the suite ran no test\n", saida.getvalue())
        self.assertTrue(saida.getvalue().endswith("tudo: failed\n"), saida.getvalue())


# --------------------------------------------------------------------------- B


INVISIVEIS = ("​", "‌", "‍", "⁠", "﻿", "‎")


class B_NadaQueOLeitorNaoVe(unittest.TestCase):
    def recusa(self, mostra: str, unidade: str, valor: str) -> str:
        with self.assertRaises(numeros.ErroDeFigura, msg=(mostra, unidade)) as e:
            numeros.ler_forma(mostra, unidade, Decimal(valor))
        return str(e.exception)

    def test_o_hifen_brando_antes_do_simbolo_nos_dois_campos(self):
        r = check1_de(self, "­%", "1,5 ­%", "1.5")
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertTrue(any(x.startswith("indice:") and "U+00AD SOFT HYPHEN in the mostra, which is not on the list" in x
                            for x in r.razoes), r.razoes)

    def test_cada_invisivel_no_mostra_e_na_unidade(self):
        limpa = "pontos percentuais"
        for x in INVISIVEIS:
            codigo = f"U+{ord(x):04X}"
            for mostra, unidade, campo in ((f"0,19 pon{x}tos percentuais", limpa, "mostra"),
                                           (f"0,19 {x}pontos percentuais", limpa, "mostra"),
                                           ("0,19 pontos percentuais", f"pon{x}tos percentuais", "unidade"),
                                           ("0,19 pontos percentuais", f"{x}pontos percentuais", "unidade")):
                msg = self.recusa(mostra, unidade, "0.19")
                self.assertIn(f"{codigo} ", msg)
                self.assertIn(f" in the {campo}", msg)
                self.assertIn("which is not on the list of what a display may hold", msg)  # ESQ3j: the list replaced this rule

    def test_o_separador_de_linha(self):
        msg = self.recusa("1,5 %", "%", "1.5")
        self.assertIn("U+2028 LINE SEPARATOR in the mostra", msg)

    def test_um_controlo_sem_nome_diz_a_categoria(self):
        msg = self.recusa("1,5 %", "\u0007%", "1.5")
        self.assertIn("U+0007 in the unidade (category Cc, which has no Unicode name)", msg)

    def test_os_tres_espacos_passam(self):
        for espaco in numeros.ESPACOS:
            self.assertEqual(numeros.ler_forma(f"0,19 pontos{espaco}percentuais", "pontos percentuais", Decimal("0.19")),
                             (Decimal("0.19"), 2, 1))
            self.assertEqual(check1_de(self, "%", f"1,5{espaco}%", "1.5").estado, conf.PASSOU)


# --------------------------------------------------------------------------- C


class C1_UmEspacoProibidoNoFimDosDoisCampos(unittest.TestCase):
    def test_tabulacao_quebra_de_linha_e_espaco_ideografico_no_fim(self):
        for x, nome in (("\t", "U+0009 in the mostra"), ("\n", "U+000A in the mostra"),
                        ("　", "U+3000 IDEOGRAPHIC SPACE in the mostra")):
            r = check1_de(self, f"%{x}", f"1,5 %{x}", "1.5")
            self.assertEqual(r.estado, conf.FALHOU, repr(x))
            # Refused by the space rule itself, which looks at every character, the ends included; the rule
            # of what a reader cannot see would refuse these too, and must not be what hides a stripped end.
            self.assertTrue(any(y.startswith("indice:") and nome in y and "where the one form has a space" in y
                                for y in r.razoes), (repr(x), r.razoes))


class C2_CadaCorridaMovidaConta(unittest.TestCase):
    def correr(self, modulo: str) -> tuple[int, list[str]]:
        raiz = arvore_de_rascunho(self, {"test_dias.py": modulo})
        linhas: list[str] = []
        return adiante.correr((1, 400), raiz=raiz, imprimir=linhas.append), linhas

    def test_falha_amanha_e_passa_daqui_a_quatrocentos_dias(self):
        hoje = relogio_real()["date_today"]
        saida, linhas = self.correr(f"""
            import datetime, unittest
            class UmDia(unittest.TestCase):
                def test_falha_so_um_dia_adiante(self):
                    self.assertFalse({hoje + 1} <= datetime.date.today().toordinal() <= {hoje + 2})
            """)
        self.assertEqual(saida, 1, linhas)
        self.assertTrue(linhas[1].startswith("adiante · days +1 · 1 tests · failed: test_falha_so_um_dia_adiante"), linhas)
        self.assertEqual(linhas[2], "adiante · days +400 · 1 tests · passed")
        self.assertEqual(linhas[-1], "adiante: failed")

    def test_menos_testes_amanha_e_os_mesmos_depois(self):
        hoje = relogio_real()["date_today"]
        saida, linhas = self.correr(f"""
            import datetime, unittest
            class Sempre(unittest.TestCase):
                def test_sempre(self):
                    pass
            if not ({hoje + 1} <= datetime.date.today().toordinal() <= {hoje + 2}):
                class ForaDeAmanha(unittest.TestCase):
                    def test_fora_de_amanha(self):
                        pass
            """)
        self.assertEqual(saida, 1, linhas)
        self.assertEqual(linhas[1], "adiante · days +1 · 1 tests · failed: ran 1 tests, and the run at the real clock ran 2")
        self.assertEqual(linhas[2], "adiante · days +400 · 2 tests · passed")


class C3_PertoDoRelogioDosDoisLados(unittest.TestCase):
    AGORA = dt.datetime(2026, 11, 16, 12, 0, tzinfo=dt.timezone.utc)

    def test_tres_instantes(self):
        self.assertFalse(perto_do_relogio(self.AGORA - dt.timedelta(days=1), self.AGORA, 120))  # long before
        self.assertFalse(perto_do_relogio(self.AGORA + dt.timedelta(days=1), self.AGORA, 120))  # long after
        self.assertTrue(perto_do_relogio(self.AGORA - dt.timedelta(seconds=5), self.AGORA, 120))
        self.assertTrue(perto_do_relogio(self.AGORA + dt.timedelta(seconds=5), self.AGORA, 120))
