"""ESQ2 item E: a link to a receipt opens the receipt.

Without a browser: no link in a built page leads to a <details>, a <summary> or inside a
<summary> (check 9), and the receipts' anchors are inside their boxes' content. The
browser test itself (`python3 -m oedp navegador`) runs in the workflow, not here; here
only what it says when it cannot run.
"""
from __future__ import annotations

import io
import re
import shutil
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

from oedp import construir as build
from oedp import ensaio, navegador
from tests.apoio import REPO


class Ancoras(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pasta = Path(tempfile.mkdtemp(prefix="oedp-esq2e-"))
        cls.c = ensaio.construir_ensaio(cls.pasta)
        assert cls.c.ok, cls.c.mensagens
        cls.pagina = cls.c.estatica / "pecas" / ensaio.PECA_ID / "index.html"

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.pasta, ignore_errors=True)

    def test_cada_ancora_de_recibo_esta_dentro_do_conteudo(self):
        texto = self.pagina.read_text(encoding="utf-8")
        recibos = re.findall(r'<details class="recibo">(.*?)</details>', texto, re.S)
        self.assertGreater(len(recibos), 5)
        for r in recibos:
            # the summary first, then the anchor, as the first thing of the content
            self.assertRegex(r, r'^<summary>.*?</summary><span class="ancora" id="r-[a-z][a-z0-9_]*"></span>')
        self.assertNotRegex(texto, r'<details[^>]*\bid="r-')
        self.assertNotRegex(texto, r'<summary[^>]*\bid=')
        ligacoes = re.findall(r'href="#(r-[a-z0-9_]+)"', texto)
        self.assertTrue(ligacoes)
        self.assertEqual(build.ligacoes_partidas(self.c.estatica), [])

    def _plantar(self, troca) -> list[str]:
        copia = Path(tempfile.mkdtemp(prefix="oedp-esq2e-planta-"))
        self.addCleanup(shutil.rmtree, copia, True)
        shutil.copytree(self.c.estatica, copia / "static")
        f = copia / "static" / "pecas" / ensaio.PECA_ID / "index.html"
        antes = f.read_text(encoding="utf-8")
        depois = troca(antes)
        self.assertNotEqual(antes, depois)
        f.write_text(depois, encoding="utf-8")
        return build.ligacoes_partidas(copia / "static")

    def test_planta_a_marcacao_antiga_ancora_no_details(self):
        erros = self._plantar(lambda t: re.sub(
            r'<details class="recibo"><summary>(.*?)</summary><span class="ancora" id="(r-[a-z0-9_]+)"></span>',
            r'<details class="recibo" id="\2"><summary>\1</summary>', t, flags=re.S))
        self.assertTrue(erros)
        self.assertTrue(all("leads to a <details>, a <summary> or inside a <summary>" in x for x in erros), erros)
        self.assertTrue(any("#r-indice" in x for x in erros), erros)

    def test_planta_ancora_no_summary(self):
        erros = self._plantar(lambda t: t.replace(
            '<summary><span class="figura">104,7 pontos</span> <span class="mede">Índice de ensaio, inventado para os ensaios</span></summary><span class="ancora" id="r-indice"></span>',
            '<summary id="r-indice"><span class="figura">104,7 pontos</span> <span class="mede">Índice de ensaio, inventado para os ensaios</span></summary>', 1))
        self.assertTrue(any("#r-indice" in x and "<summary>" in x for x in erros), erros)

    def test_planta_ancora_dentro_do_summary(self):
        erros = self._plantar(lambda t: t.replace(
            '<summary><span class="figura">104,7 pontos</span> <span class="mede">Índice de ensaio, inventado para os ensaios</span></summary><span class="ancora" id="r-indice"></span>',
            '<summary><span class="figura" id="r-indice">104,7 pontos</span></summary>', 1))
        self.assertTrue(any("#r-indice" in x and "inside a <summary>" in x for x in erros), erros)


class SemNavegador(unittest.TestCase):
    def _correr(self, exigir):
        saida = io.StringIO()
        with mock.patch.object(navegador, "playwright", side_effect=navegador.SemPlaywright("Playwright is not installed here (planted)")):
            with redirect_stdout(saida):
                codigo = navegador.correr(exigir, imprimir=print)
        return codigo, saida.getvalue()

    def test_sem_playwright_diz_que_nao_correu(self):
        codigo, texto = self._correr([])
        self.assertEqual(codigo, 0)
        self.assertIn("not run here", texto)
        self.assertNotIn("passed", texto)

    def test_sem_playwright_um_motor_exigido_falha(self):
        codigo, texto = self._correr(["chromium", "firefox", "webkit"])
        self.assertEqual(codigo, 1)
        self.assertIn("failed", texto)
        self.assertIn("required here: chromium, firefox, webkit", texto)

    def test_motor_desconhecido_recusado(self):
        codigo, texto = self._correr(["netscape"])
        self.assertEqual(codigo, 2)
        self.assertIn("netscape is not one of", texto)


class NoPortao(unittest.TestCase):
    def test_o_portao_corre_o_navegador_nos_tres_motores_depois_de_tudo(self):
        fluxo = (REPO / ".github" / "workflows" / "portao.yml").read_text(encoding="utf-8")
        self.assertEqual(re.findall(r"(?m)^  ([a-z][a-z0-9_-]*):$", fluxo.split("jobs:", 1)[1]), ["portao"])
        tudo = fluxo.index("run: python3 -m oedp tudo")
        nav = fluxo.index("run: python3 -m oedp navegador --exigir chromium,firefox,webkit")
        self.assertLess(tudo, nav)
        self.assertIn("requirements-navegador.txt", fluxo[tudo:nav])
        self.assertIn("playwright install", fluxo[tudo:nav])

    def test_tudo_nao_importa_o_playwright(self):
        for f in sorted((REPO / "oedp").glob("*.py")):
            if f.name != "navegador.py":
                self.assertNotIn("playwright", f.read_text(encoding="utf-8").replace("navegador.playwright()", ""), f.name)
