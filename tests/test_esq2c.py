"""ESQ2 item C: the weekly re-check. The fetcher is a stand-in; nothing touches the network."""
from __future__ import annotations

import json
import shutil
import tempfile
import tomllib
import unittest
from pathlib import Path

from oedp import construir as build
from oedp import fontes, reconferir
from oedp.peca import ler
from tests.apoio import REPO, Plantada, loja_fora_do_repositorio

PDF = "3f9a602b9c8e9f75b8fdd9e63aadddfae0a1776aa4a31241b567946b3add3e89"
HTML = "29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b"
TEXTOS = tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8"))


class Reconferir(unittest.TestCase):
    def setUp(self):
        self.loja = loja_fora_do_repositorio(self)
        self.oficina = Path(tempfile.mkdtemp(prefix="oedp-oficina-"))
        self.addCleanup(shutil.rmtree, self.oficina, True)
        self.p = Plantada()
        self.addCleanup(self.p.apagar)
        self.linhas = []

    def buscador(self, respostas: dict):
        """url -> bytes (stored, like the real fetcher) or an exception to raise."""
        def buscar(url, loja):
            r = respostas[url]
            if isinstance(r, Exception):
                raise r
            return fontes.guardar(loja, r)
        return buscar

    def original(self, sha):
        return fontes.caminho_da_copia(self.loja, sha).read_bytes()

    def correr(self, respostas, retirar=False):
        return reconferir.reconferir([self.p.peca], self.loja, self.oficina, TEXTOS, retirar=retirar,
                                     buscar=self.buscador(respostas), imprimir=self.linhas.append, hoje="2026-11-22")

    def test_igual(self):
        codigo, relatorio = self.correr({"https://example.org/ensaio/documento.pdf": self.original(PDF),
                                         "https://example.org/ensaio/tabela.html": self.original(HTML)})
        self.assertEqual(codigo, 0)
        dados = json.loads(relatorio.read_text(encoding="utf-8"))
        self.assertEqual([r["resultado"] for r in dados["fontes"]], ["igual", "igual"])
        self.assertEqual(relatorio, self.oficina / "reconferencias" / "2026-11-22.json")
        self.assertEqual(len([l for l in self.linhas if " · " in l]), 2)

    def test_mudou_mas_os_excertos_mantem_se(self):
        nova = self.original(HTML).replace(b"</body>", b"<p>Uma nota acrescentada pelo editor de ensaio.</p></body>")
        self.assertNotEqual(nova, self.original(HTML))
        codigo, relatorio = self.correr({"https://example.org/ensaio/documento.pdf": self.original(PDF),
                                         "https://example.org/ensaio/tabela.html": nova})
        self.assertEqual(codigo, 0)
        r = json.loads(relatorio.read_text(encoding="utf-8"))["fontes"][1]
        self.assertEqual(r["resultado"], "mudou, os excertos mantêm-se")
        self.assertEqual((r["sha256_guardado"], r["sha256_novo"]), (HTML, fontes.guardar(self.loja, nova)))
        self.assertTrue(fontes.caminho_da_copia(self.loja, r["sha256_novo"]).is_file())
        self.assertTrue(fontes.caminho_da_copia(self.loja, HTML).is_file())

    def test_planta_fonte_mudada_sem_o_excerto_e_retirada(self):
        nova = b"<html><body><p>O documento de ensaio foi revisto e diz agora outra coisa.</p></body></html>"
        antes = self.p.peca.read_bytes()
        codigo, relatorio = self.correr({"https://example.org/ensaio/documento.pdf": nova,
                                         "https://example.org/ensaio/tabela.html": self.original(HTML)})
        self.assertEqual(codigo, 1)
        r = json.loads(relatorio.read_text(encoding="utf-8"))["fontes"][0]
        self.assertEqual((r["resultado"], r["linhas"]), ("falhou", ["indice", "indice_anterior", "despacho", "proxima"]))
        self.assertEqual(self.p.peca.read_bytes(), antes)  # without --retirar, the piece is left untouched

        codigo, _ = self.correr({"https://example.org/ensaio/documento.pdf": nova,
                                 "https://example.org/ensaio/tabela.html": self.original(HTML)}, retirar=True)
        self.assertEqual(codigo, 1)
        self.assertTrue(self.p.peca.read_bytes().startswith(antes))
        peca = ler(self.p.peca)
        self.assertEqual(peca.estado, "retirada")
        self.assertEqual(peca.ultimo_estado()["razao"], "Um número deixou de corresponder à fonte e está a ser conferido.")
        self.assertEqual(peca.ultimo_estado()["por"], "python3 -m oedp reconferir")
        self.assertEqual(peca.impressao, ler(self.p.peca).impressao)
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(REPO, raiz=self.p.pasta, saida=saida, loja=self.loja)
        self.assertTrue(c.ok, c.mensagens)
        pagina = (saida / "static" / "pecas" / peca.id / "index.html").read_text(encoding="utf-8")
        self.assertIn('<p class="retirada">Esta peça foi retirada a ', pagina)
        self.assertIn("<p>Um número deixou de corresponder à fonte e está a ser conferido.</p>", pagina)
        self.assertNotIn('class="texto"', pagina)

    def test_planta_fonte_inacessivel_nao_retira_e_falha(self):
        antes = self.p.peca.read_bytes()
        codigo, relatorio = self.correr({"https://example.org/ensaio/documento.pdf": fontes.ErroDaLoja("refused: answered 503"),
                                         "https://example.org/ensaio/tabela.html": self.original(HTML)}, retirar=True)
        self.assertEqual(codigo, 1)
        self.assertEqual(self.p.peca.read_bytes(), antes)
        r = json.loads(relatorio.read_text(encoding="utf-8"))["fontes"][0]
        self.assertEqual((r["resultado"], r["razao"]), ("inacessivel", "refused: answered 503"))

    def test_a_pagina_do_editor_nao_e_reconferida(self):
        p = Plantada([('publicado_em = "2026-11-16"\n\n[[fonte]]',
                       f'publicado_em = "2026-11-16"\npagina = "https://example.org/ensaio/"\npagina_sha256 = "{HTML}"\n\n[[fonte]]')])
        self.addCleanup(p.apagar)
        pedidos = []

        def buscar(url, loja):
            pedidos.append(url)
            return {"https://example.org/ensaio/documento.pdf": PDF, "https://example.org/ensaio/tabela.html": HTML}[url]

        reconferir.reconferir([p.peca], self.loja, self.oficina, TEXTOS, buscar=buscar, imprimir=self.linhas.append)
        self.assertEqual(pedidos, ["https://example.org/ensaio/documento.pdf", "https://example.org/ensaio/tabela.html"])

    def test_um_segundo_relatorio_no_mesmo_dia_nao_apaga_o_primeiro(self):
        respostas = {"https://example.org/ensaio/documento.pdf": self.original(PDF),
                     "https://example.org/ensaio/tabela.html": self.original(HTML)}
        _, um = self.correr(respostas)
        _, dois = self.correr(respostas)
        self.assertNotEqual(um, dois)
        self.assertTrue(um.is_file() and dois.is_file())
