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
