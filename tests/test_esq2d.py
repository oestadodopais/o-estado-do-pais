"""ESQ2 item D: the fetcher remembers what a host never answers, and asks it another way,
while every rule of what may be fetched still refuses as before. No network."""
from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import direitos, fontes
from tests.apoio import ENSAIOS
from tests.test_esq1d import DOCUMENTO, SitioFalso

PUBLICO = ["93.184.216.34"]


class ComMemoria(SitioFalso):
    """The fake site, recording whether each request was asked over HTTP/1.1 first, and
    answering only over HTTP/1.1 for the hosts in `so_http11`."""

    def __init__(self, *a, so_http11=(), **kw):
        super().__init__(*a, **kw)
        self.so_http11 = set(so_http11)
        self.pedidos11 = []

    def transporte(self, url, destino, metodo="GET", endereco=None, primeiro_http11=False):
        self.pedidos11.append((metodo, url, primeiro_http11))
        r = super().transporte(url, destino, metodo, endereco)
        if (url.split("/")[2] in self.so_http11) and not primeiro_http11:
            r.http11 = True  # as transporte_curl says it: the default failed and HTTP/1.1 answered
        return r


class Base(unittest.TestCase):
    def setUp(self):
        self.loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, self.loja, True)
        self.direitos = Path(tempfile.mkdtemp(prefix="oedp-direitos-"))
        self.addCleanup(shutil.rmtree, self.direitos, True)
        (self.direitos / "fim.invalid.toml").write_text((ENSAIOS / "direitos" / "example.org.toml").read_text(encoding="utf-8"),
                                                        encoding="utf-8")

    def site(self, paginas, **kw):
        return ComMemoria(paginas, {h: PUBLICO for h in ("fim.invalid", "a.invalid", "sem.invalid")} | kw.pop("enderecos", {}), **kw)

    def buscar(self, s, url):
        return fontes.buscar(url, self.loja, direitos.para_buscar(self.direitos), s.transporte, False, s.resolver)

    def memoria(self) -> dict:
        return json.loads((self.loja / "hosts.json").read_text(encoding="utf-8"))


class SemHead(Base):
    def test_a_segunda_busca_nao_pede_head(self):
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, "")}, sem_head={"https://fim.invalid/doc"})
        self.buscar(s, "https://fim.invalid/doc")
        self.assertEqual([p[0] for p in s.pedidos if p[1] == "https://fim.invalid/doc"], ["HEAD", "GET"])
        self.assertIn("sem_head", self.memoria()["fim.invalid"])
        s.pedidos.clear()
        self.assertIn('url_final = "https://fim.invalid/doc"', self.buscar(s, "https://fim.invalid/doc"))
        self.assertEqual([p[0] for p in s.pedidos if p[1] == "https://fim.invalid/doc"], ["GET"])
        self.assertNotIn("HEAD", [p[0] for p in s.pedidos])

    def test_sem_memoria_a_segunda_busca_pede_head_outra_vez(self):
        # the plant: the same two fetches with the cache lost ask HEAD again (losing it loses only time)
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, "")}, sem_head={"https://fim.invalid/doc"})
        self.buscar(s, "https://fim.invalid/doc")
        (self.loja / "hosts.json").unlink()
        s.pedidos.clear()
        self.buscar(s, "https://fim.invalid/doc")
        self.assertIn("HEAD", [p[0] for p in s.pedidos])

    def test_memoria_estragada_e_memoria_vazia(self):
        (self.loja / "hosts.json").write_text("{not json", encoding="utf-8")
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, "")})
        self.buscar(s, "https://fim.invalid/doc")
        self.assertIn("HEAD", [p[0] for p in s.pedidos])


class Http11(Base):
    def test_a_segunda_busca_pede_http11_primeiro(self):
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, "")}, so_http11={"fim.invalid"})
        self.buscar(s, "https://fim.invalid/doc")
        self.assertIn("http11", self.memoria()["fim.invalid"])
        s.pedidos11.clear()
        self.buscar(s, "https://fim.invalid/doc")
        self.assertTrue(s.pedidos11)
        self.assertTrue(all(primeiro for _, _, primeiro in s.pedidos11), s.pedidos11)

    def test_o_curl_pede_http11_primeiro_e_tenta_o_outro_depois(self):
        chamadas = []

        def correr(args, **kw):
            chamadas.append(args)
            if len(chamadas) == 1:
                return subprocess.CompletedProcess(args, 52, "", "curl: (52) Empty reply from server")
            return subprocess.CompletedProcess(args, 0, '{"http_code":200,"url_effective":"https://e.invalid/"}', "")

        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            r = fontes.transporte_curl("https://e.invalid/", Path(tempfile.gettempdir()) / "oedp-t", primeiro_http11=True)
        self.assertIn("--http1.1", chamadas[0])
        self.assertNotIn("--http1.1", chamadas[1])
        self.assertEqual((r.saida, r.http11), (0, False))
        self.assertIn("tried once more without --http1.1, which succeeded", r.nota)

    def test_o_curl_diz_quando_so_o_http11_respondeu(self):
        chamadas = []

        def correr(args, **kw):
            chamadas.append(args)
            if len(chamadas) == 1:
                return subprocess.CompletedProcess(args, 16, "", "curl: (16) HTTP/2 stream was not closed cleanly")
            return subprocess.CompletedProcess(args, 0, '{"http_code":200,"url_effective":"https://e.invalid/"}', "")

        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            r = fontes.transporte_curl("https://e.invalid/", Path(tempfile.gettempdir()) / "oedp-t")
        self.assertTrue(r.http11)


class AsRegrasNaoMudam(Base):
    """With the host remembered for both (no HEAD, HTTP/1.1 first), every refusal stands."""

    def setUp(self):
        super().setUp()
        memoria = {h: {"sem_head": "2026-11-15T00:00:00Z", "http11": "2026-11-15T00:00:00Z"}
                   for h in ("fim.invalid", "a.invalid", "sem.invalid", "interno.invalid")}
        (self.loja / "hosts.json").write_text(json.dumps(memoria), encoding="utf-8")

    def recusa(self, s, url, mensagem):
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(s, url)
        self.assertIn(mensagem, str(e.exception))
        self.assertFalse([p for p in self.loja.rglob("*") if p.is_file() and p.name != "hosts.json"])
        self.assertNotIn("HEAD", [p[0] for p in s.pedidos])

    def test_planta_robots_que_fecha(self):
        s = self.site({"https://fim.invalid/robots.txt": (200, b"User-agent: *\nDisallow: /\n", ""),
                       "https://fim.invalid/doc": (200, DOCUMENTO, "")})
        self.recusa(s, "https://fim.invalid/doc", "closes this address")

    def test_planta_endereco_privado(self):
        s = self.site({"https://interno.invalid/doc": (200, DOCUMENTO, "")}, enderecos={"interno.invalid": ["10.0.0.9"]})
        self.recusa(s, "https://interno.invalid/doc", "not a public address")

    def test_planta_anfitriao_sem_direitos(self):
        s = self.site({"https://sem.invalid/doc": (200, DOCUMENTO, "")})
        self.recusa(s, "https://sem.invalid/doc", "sem.invalid has no rights record")
        self.assertFalse([p for p in s.pedidos if p[0] == "GET" and not p[1].endswith("/robots.txt")])

    def test_planta_redirecoes_a_mais(self):
        paginas = {f"https://fim.invalid/{n}": (302, b"", f"https://fim.invalid/{n + 1}") for n in range(8)}
        self.recusa(self.site(paginas), "https://fim.invalid/0", "redirects more than five times")

    def test_planta_redirecao_para_endereco_privado(self):
        s = self.site({"https://fim.invalid/doc": (302, b"", "https://interno.invalid/y")},
                      enderecos={"interno.invalid": ["10.0.0.5"]})
        self.recusa(s, "https://fim.invalid/doc", "interno.invalid resolves to 10.0.0.5, which is not a public address")
