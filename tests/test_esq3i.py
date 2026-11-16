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


def relogio_real() -> dict:
    """The real clock, read in a child without the shim: the suite itself may be running under a
    moved clock (`oedp adiante`), so this process's clock is not the reference."""
    return relogios(adiante.ambiente(None))["filho"]


class C2ORelogioMovido(unittest.TestCase):
    def test_quatrocentos_dias_no_filho_e_no_neto(self):
        lido, real = relogios(adiante.ambiente(400)), relogio_real()
        for quem in ("filho", "neto"):
            for chave in ("now", "utcnow", "today", "time"):
                self.assertGreaterEqual(lido[quem][chave] - real[chave], 399 * 86400, (quem, chave))
            self.assertGreaterEqual(lido[quem]["date_today"] - real["date_today"], 399, (quem, "date_today"))

    def test_sem_a_variavel_o_relogio_real(self):
        # The shim's folder on the path, the variable absent: the real clock, in the child and its child.
        env = adiante.ambiente(None)
        env["PYTHONPATH"] = str(adiante.RELOGIO)
        lido, real = relogios(env), relogio_real()
        for quem in ("filho", "neto"):
            for chave in ("now", "utcnow", "today", "time"):
                self.assertLess(abs(lido[quem][chave] - real[chave]), 120, (quem, chave))
            self.assertLessEqual(abs(lido[quem]["date_today"] - real["date_today"]), 1, quem)

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
        limite = dt.datetime.fromtimestamp(relogio_real()["time"] + 12 * 3600, dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
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
        hoje = relogio_real()["date_today"]
        raiz = arvore_de_rascunho(self, {"test_menos.py": f"""
            import datetime, unittest
            class Sempre(unittest.TestCase):
                def test_sempre(self):
                    pass
            if datetime.date.today().toordinal() <= {hoje}:
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
        ambiente = lambda p: dict(re.findall(r"^\s+([A-Z_]+): (.+)$", p, re.M))
        # The store as the checks have it; the private list stays with the step that runs the checks (check 8).
        self.assertEqual(ambiente(seguinte), {"OEDP_FONTES": ambiente(tudo)["OEDP_FONTES"]})
        self.assertIn("PRIVACIDADE_PROIBIDOS", ambiente(tudo))


# --------------------------------------------------------------------------- A


from decimal import Decimal  # noqa: E402

from oedp import conferir as conf  # noqa: E402
from oedp import numeros  # noqa: E402
from oedp.peca import ler  # noqa: E402
from tests.apoio import Plantada  # noqa: E402
from tests.test_esq3 import MENOS, NB, aritmetica, entradas_listadas, pagina_plantada, recibo  # noqa: E402

LINHA_INDICE = ('valor = "104.7"\nunidade = "pontos"', 'mostra = "104,7 pontos"')


def toml(texto: str) -> str:
    """A TOML basic string: JSON's escapes are TOML's (\\t, \\n, \\uXXXX)."""
    return json.dumps(texto)


def trocas_do_indice(unidade: str, mostra: str, valor: str = "104.7") -> list[tuple[str, str]]:
    return [(LINHA_INDICE[0], f"valor = {toml(valor)}\nunidade = {toml(unidade)}"), (LINHA_INDICE[1], f"mostra = {toml(mostra)}")]


def check1_de(caso, unidade: str, mostra: str, valor: str = "104.7"):
    """Check 1 on the test piece with the line `indice` given this unidade, mostra and valor."""
    p = Plantada(trocas_do_indice(unidade, mostra, valor))
    caso.addCleanup(p.apagar)
    return conf.check1(ler(p.peca))


class A_UmEspacoSo(unittest.TestCase):
    RECUSADOS = (  # (unidade, mostra, valor, what the refusal says)
        ("%", "1,5\t%", "1.5", "U+0009 in the mostra"),
        ("%", "1,5\n%", "1.5", "U+000A in the mostra"),
        ("%", "1,5  %", "1.5", "two spaces in a row in the mostra"),
        ("%", "1,5 % ", "1.5", "a space (U+0020 SPACE) at the end of the mostra"),
        ("pontos\tpercentuais", "0,19 pontos percentuais", "0.19", "U+0009 in the unidade"),
        ("pontos  percentuais", "0,19 pontos percentuais", "0.19", "two spaces in a row in the unidade"),
        ("%", "1,5 %", "1.5", "U+2009 THIN SPACE in the mostra"),
        ("%", "1,5​%", "1.5", "U+200B ZERO WIDTH SPACE in the mostra"),
        (" %", "1,5 %", "1.5", "a space (U+0020 SPACE) at the start of the unidade"),
        ("%", "1,5  %", "1.5", "two spaces in a row in the mostra (U+00A0 NO-BREAK SPACE, U+202F NARROW NO-BREAK SPACE)"),
    )

    def test_recusados_com_o_caracter_e_o_campo(self):
        for unidade, mostra, valor, diz in self.RECUSADOS:
            r = check1_de(self, unidade, mostra, valor)
            self.assertEqual(r.estado, conf.FALHOU, (unidade, mostra))
            self.assertTrue(any(x.startswith("indice:") and diz in x for x in r.razoes), (mostra, diz, r.razoes))

    def test_os_tres_espacos_passam_e_contam_como_a_mesma_letra(self):
        for espaco in numeros.ESPACOS:
            r = check1_de(self, "%", f"1,5{espaco}%", "1.5")
            self.assertEqual(r.estado, conf.PASSOU, (hex(ord(espaco)), r.linha()))
        r = check1_de(self, "pontos percentuais", "0,19 pontos percentuais", "0.19")
        self.assertEqual(r.estado, conf.PASSOU, r.linha())
        self.assertEqual(numeros.ler_forma("1 500,5 mil euros", "euros", Decimal("1500500")), (Decimal("1500.5"), 1, 1000))


class A_APaginaJuntaONumeroEAUnidade(unittest.TestCase):
    def test_cada_espaco_aceite_da_um_espaco_sem_quebra(self):
        for unidade in ("pontos", "%"):
            for espaco in numeros.ESPACOS:
                _, html, _ = pagina_plantada(self, trocas_do_indice(unidade, f"104,7{espaco}{unidade}"))
                # The figure in the title and the text (each a link to its receipt), and in its receipt's summary.
                impressos = re.findall(r'<a class="ref" href="#r-indice"[^>]*>(\d[^<]*)</a>', html)
                impressos += re.findall(r'<span class="figura">([^<]*)</span>', recibo(html, "indice"))
                self.assertGreaterEqual(len(impressos), 3, html)
                for f in impressos:
                    self.assertEqual(f, f"104,7{NB}{unidade}", (unidade, hex(ord(espaco))))


# --------------------------------------------------------------------------- B


class B1_UmMaisNaoESinal(unittest.TestCase):
    def test_mais_recusado_nos_dois_sinais(self):
        for unidade, mostra, valor in (("%", "+4,4 %", "-4.4"), ("%", "+4,4 %", "4.4"),
                                       ("euros", "+104,7 euros", "-104.7"), ("euros", "+104,7 euros", "104.7")):
            r = check1_de(self, unidade, mostra, valor)
            self.assertEqual(r.estado, conf.FALHOU, (mostra, valor))
            self.assertTrue(any(x.startswith("indice:") and "'+' comes before the number" in x for x in r.razoes), (mostra, valor, r.razoes))


class B2_NadaDepoisDaUnidade(unittest.TestCase):
    def test_o_que_vem_depois_da_unidade_e_recusado(self):
        for unidade, mostra, valor in (("pontos", "2,4 pontos percentuais", "2.4"), ("euros", "104,7 euros por mês", "104.7"),
                                       ("euros", "104,7 euros.", "104.7"), ("", "104,7 x", "104.7")):
            r = check1_de(self, unidade, mostra, valor)
            self.assertEqual(r.estado, conf.FALHOU, (unidade, mostra))
            self.assertTrue(any(x.startswith("indice:") and "which is not the line's unidade" in x for x in r.razoes), (mostra, r.razoes))

    def test_uma_unidade_vazia_aceita_so_o_numero(self):
        self.assertEqual(check1_de(self, "", "104,7").estado, conf.PASSOU)

    def test_a_escala_antes_de_uma_unidade_curta(self):
        self.assertEqual(numeros.ler_forma("1,5 mil m", "m", Decimal("1500")), (Decimal("1.5"), 1, 1000))
        r = check1_de(self, "m", "1,5 mil m", "1500")
        self.assertEqual(r.estado, conf.PASSOU, r.linha())


# A derived receipt whose inputs and result are negative and shown with a final zero.
ZEROS_NEGATIVOS = [
    ('valor = "104.7"', 'valor = "-4.5"'), ('unidade = "pontos"\nmede = "Índice', 'unidade = "%"\nmede = "Índice'),
    ('mostra = "104,7 pontos"', 'mostra = "−4,50 %"'),
    ('valor = "102.3"', 'valor = "-4.4"'), ('mostra = "102,3 pontos"', 'mostra = "−4,40 %"'),
    ('unidade = "pontos"\nmede = "Índice', 'unidade = "%"\nmede = "Índice'),
    ('calculo = "round ( indice - indice_anterior , 1 )"\nvalor = "2.4"\nunidade = "pontos"',
     'calculo = "round ( indice - indice_anterior , 2 )"\nvalor = "-0.1"\nunidade = "%"'),
    ('mostra = "2,4 pontos"', 'mostra = "−0,10 %"'),
]


class B3_UmaLinhaNegativaGuardaOsZeros(unittest.TestCase):
    def test_entrada_e_resultado_negativos_com_os_seus_zeros(self):
        _, html, _ = pagina_plantada(self, ZEROS_NEGATIVOS)
        self.assertEqual(aritmetica(html, "diferenca"),
                         f"({MENOS}4,50) {MENOS} ({MENOS}4,40){NB}= {MENOS}0,10 (arredondado a 2 casas decimais)")
        self.assertEqual(entradas_listadas(html, "diferenca"),
                         [f"{MENOS}4,50 · Terceiro trimestre de ensaio", f"{MENOS}4,40 · Segundo trimestre de ensaio"])
