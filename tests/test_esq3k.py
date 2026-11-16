"""ESQ3j (blocos/esq3/ORDEM-3j.md): A, every test file is run or the gate fails; B, a display holds
only what is on a list; C, tests that depended on a real record or sentence; D, a test for each of
the sixth reading's three plants."""
from __future__ import annotations

import subprocess
import sys
import textwrap
import unittest
from decimal import Decimal
from pathlib import Path

from oedp import conferir as conf
from oedp import descoberta, numeros
from tests import adiante
from tests.apoio import REPO
from tests.test_esq3i import arvore_de_rascunho, check1_de

FALHA = """
    import unittest
    class Escondido(unittest.TestCase):
        def test_tem_de_falhar(self):
            self.fail("this test must run")
    """
PASSA = """
    import unittest
    class Visivel(unittest.TestCase):
        def test_passa(self):
            pass
    """


def com_subpasta(caso, com_init: bool) -> Path:
    raiz = arvore_de_rascunho(caso, {"test_visivel.py": PASSA})
    (raiz / "tests" / "escondido").mkdir()
    if com_init:
        (raiz / "tests" / "escondido" / "__init__.py").write_text("", encoding="utf-8")
    (raiz / "tests" / "escondido" / "test_must_fail.py").write_text(textwrap.dedent(FALHA), encoding="utf-8")
    return raiz


def passo_dos_testes(raiz: Path) -> subprocess.CompletedProcess:
    """`tudo`'s test step on a scratch tree, in a process of its own (its `tests` is not this suite's)."""
    codigo = "import sys; from pathlib import Path; from oedp.__main__ import passo_dos_testes; sys.exit(0 if passo_dos_testes(Path(sys.argv[1])) else 1)"
    return subprocess.run([sys.executable, "-c", codigo, str(raiz)], cwd=REPO, capture_output=True, text=True, timeout=120)


# --------------------------------------------------------------------------- A


class A_CadaFicheiroDeTestesCorre(unittest.TestCase):
    def test_tudo_nomeia_o_ficheiro_numa_subpasta_sem_init(self):
        r = passo_dos_testes(com_subpasta(self, com_init=False))
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn("tudo: tests/escondido/test_must_fail.py matches test*.py and no test of the suite comes from it", r.stdout)

    def test_adiante_nomeia_o_ficheiro_em_cada_corrida(self):
        linhas: list[str] = []
        self.assertEqual(adiante.correr((1,), raiz=com_subpasta(self, com_init=False), imprimir=linhas.append), 1)
        for linha in linhas[:2]:
            self.assertIn("failed: tests/escondido/test_must_fail.py not loaded", linha)

    def test_com_init_corre_como_antes(self):
        r = passo_dos_testes(com_subpasta(self, com_init=True))
        self.assertEqual(r.returncode, 1, r.stdout)  # it ran, and its test failed
        self.assertIn("this test must run", r.stderr)
        self.assertNotIn("no test of the suite comes from it", r.stdout)

    def test_um_ficheiro_sem_testes_e_nomeado(self):
        self.assertEqual(descoberta.nao_carregados(["tests.test_a.C.test_x"], self.raiz_com(["test_a.py", "test_b.py"])),
                         ["tests/test_b.py"])

    def raiz_com(self, nomes) -> Path:
        raiz = arvore_de_rascunho(self, {n: "import unittest\n" for n in nomes})
        return raiz

    def test_a_arvore_real(self):
        suite = unittest.defaultTestLoader.discover(str(REPO / "tests"), top_level_dir=str(REPO))
        self.assertEqual(descoberta.nao_carregados(descoberta.ids_da_bateria(suite), REPO), [])
        self.assertEqual(len(list((REPO / "tests").rglob("test*.py"))), len(list((REPO / "tests").glob("test*.py"))))


# --------------------------------------------------------------------------- D1


class D1_UmaBateriaDeModulosVazios(unittest.TestCase):
    def test_uma_descoberta_real_sem_testes_falha(self):
        r = passo_dos_testes(arvore_de_rascunho(self, {"test_vazio.py": "import unittest\n"}))
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn("tudo: the suite ran no test", r.stdout)

    def test_um_pacote_vazio_da_uma_bateria_aninhada_vazia(self):
        # Discovery gives a nested empty suite for an empty package, and no file matches the pattern,
        # so only the count of tests run can fail the step (the reading's case).
        raiz = arvore_de_rascunho(self, {})
        (raiz / "tests" / "vazio").mkdir()
        (raiz / "tests" / "vazio" / "__init__.py").write_text("", encoding="utf-8")
        r = passo_dos_testes(raiz)
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn("tudo: the suite ran no test", r.stdout)
        self.assertNotIn("no test of the suite comes from it", r.stdout)


# --------------------------------------------------------------------------- B


from oedp.peca import ler  # noqa: E402
from tests.apoio import Plantada  # noqa: E402

FORA_DA_LISTA = {"U+E000": "", "U+F0000": "\U000f0000", "U+034F": "͏", "U+FE0F": "️", "U+E0100": "\U000e0100",
                 "U+3164": "ㅤ", "U+115F": "ᅟ", "U+00AD": "­", "U+200D": "‍",
                 "U+FF11": "１",  # FULLWIDTH DIGIT ONE
                 "U+0661": "١",  # ARABIC-INDIC DIGIT ONE
                 "U+03B1": "α"}  # GREEK SMALL LETTER ALPHA


def check1_livre(caso, mostra: str):
    """Check 1 on the test piece with its free display (`terco`, mostra_livre) given this mostra."""
    p = Plantada([('mostra = "um terço"', f'mostra = "{mostra}"')])
    caso.addCleanup(p.apagar)
    return conf.check1(ler(p.peca))


class B_SoOQueEstaNaLista(unittest.TestCase):
    def recusa(self, mostra, unidade, valor="1.5") -> str:
        with self.assertRaises(numeros.ErroDeFigura, msg=(mostra, unidade)) as e:
            numeros.ler_forma(mostra, unidade, Decimal(valor))
        return str(e.exception)

    def test_fora_da_lista_no_mostra_e_na_unidade(self):
        for codigo, x in FORA_DA_LISTA.items():
            msg = self.recusa(f"1,5 ca{x}sos", "casos")
            self.assertIn(f"{codigo} ", msg)
            self.assertIn(" in the mostra", msg)
            msg = self.recusa("1,5 casos", f"ca{x}sos")
            self.assertIn(f"{codigo} ", msg)
            self.assertIn(" in the unidade", msg)

    def test_um_a_cirilico_numa_unidade_que_parece_latina(self):
        r = check1_de(self, "cаsos", "1,5 casos", "1.5")
        self.assertTrue(any(x.startswith("indice:") and "U+0430 CYRILLIC SMALL LETTER A in the unidade" in x for x in r.razoes), r.razoes)

    def test_um_acento_decomposto(self):
        msg = self.recusa("1,5 põntos", "pontos")
        self.assertIn("U+0303 COMBINING TILDE in the mostra, after 'o': a decomposed accent; type the accented letter as one character", msg)

    def test_numa_mostra_livre(self):
        for mostra, codigo in (("um­ terço", "U+00AD"), ("um terço", "U+0327")):
            r = check1_livre(self, mostra)
            self.assertEqual(r.estado, conf.FALHOU, mostra)
            self.assertTrue(any(x.startswith("terco:") and codigo in x for x in r.razoes), r.razoes)

    def test_so_0_a_9_sao_algarismos_do_numero(self):
        msg = self.recusa("¹,5 %", "%")
        self.assertIn("U+00B9 SUPERSCRIPT ONE in the mostra", msg)
        r = check1_de(self, "%", "¹,5 %", "1.5")
        self.assertTrue(any(x.startswith("indice:") and "U+00B9" in x for x in r.razoes), r.razoes)
        # «²» is on the list (as in m²), and is still no digit of the number: a refusal, not a traceback.
        self.assertIn("'²,' comes before the number", self.recusa("²,5 %", "%"))

    def test_aceites(self):
        for mostra, unidade, valor in (("1,5 %", "%", "1.5"), ("2,4 pontos percentuais", "pontos percentuais", "2.4"),
                                       ("104,7 €", "€", "104.7"), ("3,2 µg/m³", "µg/m³", "3.2"), ("45,0 m²", "m²", "45.0"),
                                       ("21,5 °C", "°C", "21.5"), ("0,3 p.p.", "p.p.", "0.3"), ("12,0 €/mês", "€/mês", "12.0"),
                                       ("1,5 MW", "MW", "1.5")):
            r = check1_de(self, unidade, mostra, valor)
            self.assertEqual(r.estado, conf.PASSOU, (mostra, r.linha()))
        self.assertEqual(check1_livre(self, "um terço").estado, conf.PASSOU)
