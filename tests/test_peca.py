"""The piece file: fingerprints, the record that only grows, the arithmetic, the store's readings."""
from __future__ import annotations

import hashlib
import io
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from decimal import Decimal
from pathlib import Path

from oedp import derivacoes, fontes, numeros, registo
from oedp.peca import impressoes, ler
from tests.apoio import ENSAIOS, LOJA, PECA, REPO, Plantada


class Impressoes(unittest.TestCase):
    def test_as_duas_impressoes_seguem_a_especificacao(self):
        bruto = PECA.read_bytes()
        corte = bruto.index(b"\n+++ registo\n") + 1
        folha_ini = bruto.index(b"\n+++ folha\n") + len(b"\n+++ folha\n")
        peca, folha = impressoes(bruto)
        self.assertEqual(peca, hashlib.sha256(bruto[:corte]).hexdigest())
        self.assertEqual(folha, hashlib.sha256(bruto[folha_ini:corte]).hexdigest())

    def test_o_registo_nao_muda_a_impressao(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        antes = ler(p.peca)
        registo.acrescentar(p.peca, "passo", {"nome": "nota", "lugar": "especialista", "familia": "anthropic",
                                              "modelo": "modelo-de-ensaio", "inicio": "2026-11-16T12:00:00Z",
                                              "fim": "2026-11-16T12:01:00Z"})
        depois = ler(p.peca)
        self.assertEqual(antes.impressao, depois.impressao)
        self.assertTrue(p.peca.read_bytes().startswith(antes.bruto))

    def test_o_registo_recusa_um_valor_fora_da_lista(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        antes = p.peca.read_bytes()
        with self.assertRaises(registo.ErroDoRegisto):
            registo.acrescentar(p.peca, "estado", {"estado": "publicadissima", "em": "2026-11-16T12:00:00Z", "por": "x", "razao": "y"})
        self.assertEqual(p.peca.read_bytes(), antes)


class Comandos(unittest.TestCase):
    def correr(self, *args, cwd=REPO, env=None):
        return subprocess.run([sys.executable, "-m", "oedp", *args], cwd=cwd, capture_output=True, text=True, env=env)

    def test_impressao(self):
        r = self.correr("impressao", str(PECA))
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn(ler(PECA).impressao, r.stdout)

    def test_nova_cria_as_quatro_secoes(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-nova-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        shutil.copytree(REPO / "oedp", pasta / "oedp", ignore=shutil.ignore_patterns("__pycache__"))
        r = self.correr("nova", "2026-11-20-uma-peca", "--tipo", "artigo", cwd=pasta)
        self.assertEqual(r.returncode, 0, r.stderr)
        novo = pasta / "pecas" / "2026" / "2026-11-20-uma-peca.md"
        p = ler(novo)
        self.assertEqual(p.cabeca["tipo"], "artigo")
        self.assertEqual(p.estado, "rascunho")
        self.assertEqual(self.correr("nova", "2026-11-20-uma-peca", "--tipo", "artigo", cwd=pasta).returncode, 2)
        self.assertEqual(self.correr("nova", "2026-02-30-x", "--tipo", "artigo", cwd=pasta).returncode, 2)

    def test_registar_e_estado(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        antes = p.peca.read_bytes()
        r = self.correr("registar", str(p.peca), "leitura", "--lugar", "leitor", "--familia", "anthropic",
                        "--modelo", "modelo-de-ensaio", "--inicio", "2026-11-16T12:00:00Z", "--fim", "2026-11-16T12:05:00Z",
                        "--impressao", ler(p.peca).impressao, "--plantas-postas", "0", "--plantas-apanhadas", "0",
                        "--achados", "1", "--adotados", "0", "--veredicto", "levanta")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue(p.peca.read_bytes().startswith(antes))
        r = self.correr("estado", str(p.peca), "rascunho", "--razao", "Ensaio.")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(ler(p.peca).estado, "rascunho")

    def test_texto_imprime_as_paginas(self):
        import os

        env = dict(os.environ, OEDP_FONTES=str(LOJA))
        sha = ler(PECA).fontes["doc_pdf"]["sha256"]
        r = self.correr("texto", sha, env=env)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("=== p. 2 ===", r.stdout)
        self.assertIn("O índice de ensaio fixou-se em 104,7 pontos no terceiro trimestre", r.stdout)


class Paridade(unittest.TestCase):
    """The engine's shared file of cases (core/derivacoes-paridade.json), copied byte for byte."""

    def test_os_casos_do_motor(self):
        dados = json.loads((ENSAIOS / "derivacoes-paridade.json").read_text(encoding="utf-8"))
        for caso in dados["casos"]:
            obtido = derivacoes.avaliar(caso["expr"], {})
            self.assertEqual(obtido, Decimal(caso["espera"]), caso["id"])
            if "canonica" in caso:
                self.assertEqual(derivacoes.canonica(obtido), caso["canonica"], caso["id"])
        for caso in dados["recusas"]:
            with self.assertRaises(derivacoes.ErroDeConta, msg=caso["id"]):
                derivacoes.avaliar(caso["expr"], {})
        for caso in dados["quase-iguais"]:
            self.assertNotEqual(derivacoes.avaliar(caso["expr"], {}), Decimal(caso["espera_errada"]), caso["id"])
        # the engine's file at its commit 7f7e268, measured on 14 November 2026
        bruto = (ENSAIOS / "derivacoes-paridade.json").read_bytes()
        self.assertEqual(hashlib.sha256(bruto).hexdigest(), "e427112f9761459392051e2a810f5e9d4df64100b5c7d655adeb058e692d9f1e")
        self.assertEqual((len(dados["casos"]), len(dados["recusas"]), len(dados["quase-iguais"])), (32, 10, 2))


class Numeros(unittest.TestCase):
    def test_mostra(self):
        self.assertEqual(numeros.ler_mostra("1 234,5 mil milhões de euros"), (Decimal("1234.5"), 1, 10**9))
        self.assertEqual(numeros.ler_mostra("−1,4 pontos"), (Decimal("-1.4"), 1, 1))
        self.assertEqual(numeros.escala_da_unidade("milhões de euros"), 10**6)
        self.assertEqual(numeros.esperado(Decimal("2345.05"), 10**6, 10**9, 1), Decimal("2.3"))
        self.assertEqual(numeros.esperado(Decimal("0.25"), 1, 1, 1), Decimal("0.3"))

    def test_formas_impressas(self):
        self.assertTrue(numeros.contem_figura("total de 1.234.567,8 euros", "1234567.8"))
        self.assertFalse(numeros.contem_figura("total de 11 234 euros", "1234"))


class Fontes(unittest.TestCase):
    def test_xlsx_csv_e_json(self):
        import openpyxl

        livro = openpyxl.Workbook()
        livro.active["A1"] = "Total de ensaio"
        livro.active["B1"] = 17.2
        dados = io.BytesIO()
        livro.save(dados)
        self.assertEqual(fontes.texto_por_pagina(dados.getvalue()), ["Total de ensaio 17.2"])
        self.assertEqual(fontes.texto_por_pagina(b"a;b\n1,5;2\n"), ["a;b 1,5;2"])
        self.assertEqual(fontes.texto_por_pagina(b'{"x": "p\xc3\xa1gina"}'), ['{"x": "página"}'])

    def test_robots_fechado_recusa_sem_rede(self):
        class Resposta(io.BytesIO):
            def __init__(self, dados, url):
                super().__init__(dados)
                self.url, self.status, self.headers = url, 200, {"Content-Type": "text/html"}

            def geturl(self):
                return self.url

        def abrir(pedido, timeout=0):
            self.assertIn("OEstadoDoPais", pedido.get_header("User-agent"))
            if pedido.full_url.endswith("/robots.txt"):
                return Resposta(b"User-agent: *\nDisallow: /privado/\n", pedido.full_url)
            return Resposta(b"<html><body>ok</body></html>", pedido.full_url)

        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, loja, True)
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.buscar("https://ensaio.invalid/privado/x.pdf", loja, abrir)
        self.assertIn("closes this address", str(e.exception))
        def sem_ligacao(pedido, timeout=0):
            if pedido.full_url.endswith("/robots.txt"):
                return Resposta(b"", pedido.full_url)
            raise OSError("timed out")

        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.buscar("https://ensaio.invalid/publico/x.html", loja, sem_ligacao)
        self.assertIn("could not be fetched", str(e.exception))
        tabela = fontes.buscar("https://ensaio.invalid/publico/x.html", loja, abrir)
        self.assertIn('sha256 = "', tabela)
        self.assertEqual(len(list(loja.rglob("*"))), 3)  # sha256/, sha256/xx/, the copy


if __name__ == "__main__":
    unittest.main()
