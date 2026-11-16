"""ESQ3g (blocos/esq3/ORDEM-3g.md): C, no test depends on the day it runs (the moved clock and
`oedp adiante`); A, the one form says a space; B, three tests the fourth reading's plants showed
missing. No network."""
from __future__ import annotations

import datetime as dt
import json
import os
import re
import subprocess
import sys
import tempfile
import shutil
import textwrap
import time
import unittest
from pathlib import Path

from tests import adiante
from tests.apoio import REPO

# --------------------------------------------------------------------------- C2

# A child prints its clock, then starts a child of its own (the same code, given "neto") with the
# environment it inherited, and prints that one's too.
_RELOGIOS = textwrap.dedent("""
    import datetime, json, subprocess, sys, time
    def ler():
        return {"now": datetime.datetime.now(datetime.timezone.utc).timestamp(),
                "utcnow": datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc).timestamp(),
                "today": datetime.datetime.today().timestamp(),
                "date_today": datetime.date.today().toordinal(), "time": time.time()}
    neto = None
    if sys.argv[1:] != ["neto"]:
        r = subprocess.run([sys.executable, "-c", CODIGO, "neto"], capture_output=True, text=True, check=True)
        neto = json.loads(r.stdout)["filho"]
    print(json.dumps({"filho": ler(), "neto": neto}))
""")


def relogios(env: dict[str, str]) -> dict:
    corpo = "import warnings\nwarnings.simplefilter('ignore')\n" + _RELOGIOS
    codigo = "CODIGO = " + repr("CODIGO = None\n" + corpo) + "\n" + corpo
    r = subprocess.run([sys.executable, "-c", codigo], env=env, capture_output=True, text=True, timeout=60)
    if r.returncode != 0:
        raise AssertionError(r.stderr)
    return json.loads(r.stdout)


class C2ORelogioMovido(unittest.TestCase):
    def assertAdiante(self, lido: dict, quem: str, dias_minimos: int):
        agora, hoje = time.time(), dt.date.today().toordinal()
        for chave in ("now", "utcnow", "today", "time"):
            self.assertGreaterEqual(lido[quem][chave] - agora, dias_minimos * 86400, (quem, chave))
        self.assertGreaterEqual(lido[quem]["date_today"] - hoje, dias_minimos, (quem, "date_today"))

    def test_quatrocentos_dias_no_filho_e_no_neto(self):
        lido = relogios(adiante.ambiente(400))
        self.assertAdiante(lido, "filho", 399)
        self.assertAdiante(lido, "neto", 399)

    def test_sem_a_variavel_o_relogio_real(self):
        # The shim's folder on the path, the variable absent: the real clock, in the child and its child.
        env = {k: v for k, v in os.environ.items() if k != adiante.VARIAVEL}
        env["PYTHONPATH"] = str(adiante.RELOGIO)
        lido = relogios(env)
        for quem in ("filho", "neto"):
            for chave in ("now", "utcnow", "today", "time"):
                self.assertLess(abs(lido[quem][chave] - time.time()), 120, (quem, chave))
            self.assertLessEqual(abs(lido[quem]["date_today"] - dt.date.today().toordinal()), 1, quem)

    def test_a_corrida_ao_relogio_real_nao_tem_o_relogio(self):
        env = adiante.ambiente(None)
        self.assertNotIn(adiante.VARIAVEL, env)
        self.assertNotIn(str(adiante.RELOGIO), env.get("PYTHONPATH", "").split(os.pathsep))


def arvore_de_rascunho(caso, modulos: dict[str, str]) -> Path:
    """A scratch tree with a tests/ package holding `modulos`, outside the repository."""
    raiz = Path(tempfile.mkdtemp(prefix="oedp-adiante-"))
    caso.addCleanup(shutil.rmtree, raiz, True)
    (raiz / "tests").mkdir()
    (raiz / "tests" / "__init__.py").write_text("", encoding="utf-8")
    for nome, texto in modulos.items():
        (raiz / "tests" / nome).write_text(textwrap.dedent(texto), encoding="utf-8")
    return raiz


class C2Adiante(unittest.TestCase):
    def correr(self, raiz: Path) -> tuple[int, list[str]]:
        linhas: list[str] = []
        return adiante.correr((1, 400), raiz=raiz, imprimir=linhas.append), linhas

    def test_planta_um_teste_que_passa_hoje_e_falha_amanha(self):
        # Twelve hours from now, typed into the test as a date is typed into a fixture.
        limite = (dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=12)).strftime("%Y-%m-%dT%H:%M:%SZ")
        raiz = arvore_de_rascunho(self, {"test_amanha.py": f"""
            import datetime, unittest
            class Amanha(unittest.TestCase):
                def test_passa_hoje_e_falha_amanha(self):
                    limite = datetime.datetime.strptime("{limite}", "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=datetime.timezone.utc)
                    self.assertLess(datetime.datetime.now(datetime.timezone.utc), limite)
                def test_sempre(self):
                    pass
            """})
        saida, linhas = self.correr(raiz)
        self.assertEqual(saida, 1, linhas)
        self.assertEqual(linhas[0], "adiante · days +0 (real clock) · 2 tests · passed")
        for n, linha in zip((1, 400), linhas[1:3]):
            self.assertTrue(linha.startswith(f"adiante · days +{n} · 2 tests · failed: test_passa_hoje_e_falha_amanha "), linha)
            self.assertIn("Amanha.test_passa_hoje_e_falha_amanha", linha)
        self.assertEqual(linhas[-1], "adiante: failed")

    def test_planta_menos_testes_com_o_relogio_movido(self):
        # Under the moved clock a class is not defined, and the run passes with fewer tests.
        hoje = dt.date.today().toordinal()
        raiz = arvore_de_rascunho(self, {"test_menos.py": f"""
            import datetime, unittest
            class Sempre(unittest.TestCase):
                def test_sempre(self):
                    pass
            if datetime.date.today().toordinal() <= {hoje + 0}:
                class SoHoje(unittest.TestCase):
                    def test_so_hoje(self):
                        pass
            """})
        saida, linhas = self.correr(raiz)
        self.assertEqual(saida, 1, linhas)
        self.assertEqual(linhas[1], "adiante · days +1 · 1 tests · failed: ran 1 tests, and the run at the real clock ran 2")

    def test_uma_arvore_sem_teste_dependente_do_dia_passa(self):
        raiz = arvore_de_rascunho(self, {"test_sempre.py": """
            import unittest
            class Sempre(unittest.TestCase):
                def test_sempre(self):
                    pass
            """})
        saida, linhas = self.correr(raiz)
        self.assertEqual(saida, 0, linhas)
        self.assertEqual(linhas, ["adiante · days +0 (real clock) · 1 tests · passed", "adiante · days +1 · 1 tests · passed",
                                  "adiante · days +400 · 1 tests · passed", "adiante: passed"])

    def test_o_comando_passa_os_dias(self):
        from oedp import __main__ as cli
        from unittest import mock
        with mock.patch("oedp.ambiente.limpar"), \
                mock.patch("subprocess.run", return_value=subprocess.CompletedProcess([], 0)) as m:
            self.assertEqual(cli.principal(["adiante", "--dias", "3", "--dias", "30"]), 0)
        self.assertEqual(m.call_args[0][0][1:], ["-m", "tests.adiante", "--dias", "3", "--dias", "30"])
        self.assertEqual(m.call_args[1]["cwd"], REPO)


class C2NadaEmOedpMoveORelogio(unittest.TestCase):
    # The variable, the shim's module name, or its folder named as a path.
    NOMES = re.compile(r"OEDP_ENSAIO_DIAS_ADIANTE|sitecustomize|[\"'/\\]relogio[\"'/\\]")

    def nomeados(self, pasta: Path) -> list[str]:
        return [f"{f.relative_to(pasta.parent)}:{n}" for f in sorted(pasta.rglob("*.py"))
                for n, linha in enumerate(f.read_text(encoding="utf-8").splitlines(), 1) if self.NOMES.search(linha)]

    def test_nenhuma_linha_de_oedp_nomeia_a_variavel_ou_o_relogio(self):
        self.assertEqual(self.nomeados(REPO / "oedp"), [])

    def test_planta_o_padrao_apanha_o_que_procura(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-nomes-")) / "oedp"
        self.addCleanup(shutil.rmtree, pasta.parent, True)
        pasta.mkdir()
        for n, linha in enumerate(('dias = os.environ.get("OEDP_ENSAIO_DIAS_ADIANTE")', "import sitecustomize",
                                   'caminho = REPO / "tests" / "relogio"', 'caminho = "tests/relogio/x.py"')):
            (pasta / f"m{n}.py").write_text(linha + "\n", encoding="utf-8")
        (pasta / "fica.py").write_text("relogio=time.monotonic\n", encoding="utf-8")  # a parameter's name, as in publicar.py
        self.assertEqual(self.nomeados(pasta), [f"oedp/m{n}.py:1" for n in range(4)])

    def test_o_relogio_nao_e_um_pacote_dos_testes(self):
        # Not a package, so `unittest discover` never imports the shim into the suite's own process.
        self.assertFalse((REPO / "tests" / "relogio" / "__init__.py").exists())


class C2Portao(unittest.TestCase):
    def test_o_passo_adiante_vem_depois_de_tudo_com_o_mesmo_ambiente(self):
        texto = (REPO / ".github" / "workflows" / "portao.yml").read_text(encoding="utf-8")
        sem_comentarios = "\n".join(l for l in texto.splitlines() if not l.lstrip().startswith("#"))
        passos = re.split(r"\n      - ", sem_comentarios)
        nomes = [re.match(r"(?:name: )?(.*)", p).group(1) for p in passos]
        i = nomes.index("Checks, build and tests")
        self.assertEqual(nomes[i + 1], "The suite with the clock moved ahead", nomes)
        tudo, seguinte = passos[i], passos[i + 1]
        self.assertIn("run: python3 -m oedp tudo", tudo)
        self.assertTrue(seguinte.rstrip().endswith("run: python3 -m oedp adiante"), seguinte)
        ambiente = lambda p: sorted(re.findall(r"^\s+([A-Z_]+): (.+)$", p, re.M))
        self.assertEqual(ambiente(seguinte), ambiente(tudo))
        self.assertEqual([n for n, _ in ambiente(tudo)], ["OEDP_FONTES", "PRIVACIDADE_PROIBIDOS"])
