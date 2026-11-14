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

    def test_robots_e_direitos_com_um_transporte_falso(self):
        from oedp import direitos

        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, loja, True)
        pasta = Path(tempfile.mkdtemp(prefix="oedp-direitos-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        registo_ok = (ENSAIOS / "direitos" / "example.org.toml").read_text(encoding="utf-8")
        (pasta / "ensaio.invalid.toml").write_text(registo_ok, encoding="utf-8")
        (pasta / "fechado.invalid.toml").write_text(registo_ok.replace('guardar = "sim"', 'guardar = "nao"'), encoding="utf-8")
        direitos_de = direitos.para_buscar(pasta)
        respostas = {}

        def falso(url, destino):
            saida, http, corpo, final = respostas.get(url, (0, 404, b"", url))
            if corpo:
                destino.write_bytes(corpo)
            return fontes.Resposta(saida, http, final, "text/html", len(corpo), "erro de ensaio" if saida else "")

        def buscar(url):
            return fontes.buscar(url, loja, direitos_de=direitos_de, transporte=falso)

        def vazia():
            return [p for p in loja.rglob("*") if p.is_file()]

        base = "https://ensaio.invalid"
        respostas[base + "/robots.txt"] = (0, 200, b"User-agent: *\nDisallow: /privado/\n", base + "/robots.txt")
        respostas[base + "/publico/x.html"] = (0, 200, b"<html><body>ok</body></html>", base + "/publico/x.html")
        with self.assertRaises(fontes.ErroDaLoja) as e:
            buscar(base + "/privado/x.pdf")
        self.assertIn("closes this address to oestadodopais", str(e.exception))
        self.assertEqual(vazia(), [])
        tabela = buscar(base + "/publico/x.html")
        self.assertIn('http = 200', tabela)
        self.assertEqual(len(vazia()), 1)
        # RFC 9309, 2.3.1.3 and 2.3.1.4: 4xx means no rules; 5xx or a network error means complete disallow
        respostas[base + "/robots.txt"] = (0, 404, b"", base + "/robots.txt")
        self.assertTrue(fontes.robots_permite(base + "/privado/x", loja, falso)[0])
        respostas[base + "/robots.txt"] = (0, 503, b"", base + "/robots.txt")
        self.assertFalse(fontes.robots_permite(base + "/publico/x", loja, falso)[0])
        respostas[base + "/robots.txt"] = (7, 0, b"", base + "/robots.txt")
        self.assertFalse(fontes.robots_permite(base + "/publico/x", loja, falso)[0])
        respostas[base + "/robots.txt"] = (47, 301, b"", base + "/robots.txt")
        self.assertTrue(fontes.robots_permite(base + "/publico/x", loja, falso)[0])
        # the document itself refused: reported, nothing stored
        respostas[base + "/robots.txt"] = (0, 404, b"", base + "/robots.txt")
        respostas[base + "/recusado.pdf"] = (0, 403, b"<html>no</html>", base + "/recusado.pdf")
        antes = vazia()
        with self.assertRaises(fontes.ErroDaLoja) as e:
            buscar(base + "/recusado.pdf")
        self.assertIn("answered 403", str(e.exception))
        self.assertEqual(vazia(), antes)
        # rights: no record, a record that says nao, and a redirect to a host with no record
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.buscar("https://sem-registo.invalid/x", loja, direitos_de=direitos_de, transporte=falso)
        self.assertIn("sem-registo.invalid has no rights record", str(e.exception))
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.buscar("https://fechado.invalid/x", loja, direitos_de=direitos_de, transporte=falso)
        self.assertIn('says guardar = "nao"', str(e.exception))
        respostas[base + "/salta"] = (0, 200, b"outro", "https://outro.invalid/y")
        with self.assertRaises(fontes.ErroDaLoja) as e:
            buscar(base + "/salta")
        self.assertIn("outro.invalid has no rights record", str(e.exception))
        self.assertEqual(vazia(), antes)
        # --termos begins a record for a host that has none
        respostas["https://sem-registo.invalid/robots.txt"] = (0, 404, b"", "https://sem-registo.invalid/robots.txt")
        respostas["https://sem-registo.invalid/termos"] = (0, 200, b"termos de ensaio", "https://sem-registo.invalid/termos")
        inicio = fontes.buscar("https://sem-registo.invalid/termos", loja, transporte=falso, termos=True)
        self.assertTrue(inicio.startswith("# direitos/sem-registo.invalid.toml\n"))
        self.assertIn('guardar = ""', inicio)

    def test_curl_com_lista_de_argumentos_e_sem_curl_recusa(self):
        from unittest import mock

        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, loja, True)
        visto = {}

        def correr(args, **kw):
            visto["args"], visto["kw"] = args, kw
            return subprocess.CompletedProcess(args, 0, '{"http_code":200,"url_effective":"https://e.invalid/","content_type":"text/html; charset=utf-8","size_download":0}', "")

        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            r = fontes.transporte_curl("https://e.invalid/", loja / "t")
        self.assertIsInstance(visto["args"], list)
        self.assertNotIn("shell", visto["kw"])
        for opcao in ("--silent", "--show-error", "--location", "--max-redirs", "--max-time", "--max-filesize",
                      "--proto", "--proto-redir", "--user-agent", "--output", "--write-out"):
            self.assertIn(opcao, visto["args"])
        self.assertNotIn("--insecure", visto["args"])
        self.assertNotIn("-k", visto["args"])
        self.assertEqual(visto["args"][visto["args"].index("--write-out") + 1], "%{json}")
        self.assertEqual(visto["args"][visto["args"].index("--proto") + 1], "=https,http")
        self.assertEqual((r.http, r.tipo), (200, "text/html"))
        with mock.patch.object(fontes.shutil, "which", return_value=None):
            with self.assertRaises(fontes.ErroDaLoja) as e:
                fontes.transporte_curl("https://e.invalid/", loja / "t")
        self.assertIn("curl is not installed", str(e.exception))

    def test_regras_de_robots(self):
        t = "User-agent: *\nDisallow: /privado/\nAllow: /privado/sim\n\nUser-agent: OEstadoDoPais\nDisallow: /so-a-nos\n"
        self.assertTrue(fontes.robots_decide(t, "https://x/privado/a"))  # the agent's own group replaces *
        self.assertFalse(fontes.robots_decide(t, "https://x/so-a-nos/a"))
        t2 = "User-agent: *\nDisallow: /privado/\nAllow: /privado/sim\nDisallow: /*.pdf$\n"
        self.assertTrue(fontes.robots_decide(t2, "https://x/privado/sim"))  # the longest match wins
        self.assertFalse(fontes.robots_decide(t2, "https://x/a.pdf"))
        self.assertTrue(fontes.robots_decide(t2, "https://x/a.pdfx"))

if __name__ == "__main__":
    unittest.main()
