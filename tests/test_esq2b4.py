"""ESQ2b item 4: a host that does not connect within ten seconds is tried once more, and twice
is a failure that names the host and stores nothing. No network: curl is a stand-in."""
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

NAO_LIGOU = subprocess.CompletedProcess([], 28, json.dumps({"exitcode": 28, "time_connect": 0, "http_code": 0}),
                                        "curl: (28) Failed to connect to e.invalid port 443 after 10002 ms: Timeout was reached")
RESPONDEU = subprocess.CompletedProcess([], 0, json.dumps({"http_code": 200, "url_effective": "https://e.invalid/", "time_connect": 0.05}), "")


def curl(respostas):
    chamadas = []

    def correr(args, **kw):
        chamadas.append(args)
        return respostas[min(len(chamadas), len(respostas)) - 1]

    return chamadas, correr


class Transporte(unittest.TestCase):
    def transportar(self, respostas):
        chamadas, correr = curl(respostas)
        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            r = fontes.transporte_curl("https://e.invalid/", Path(tempfile.gettempdir()) / "oedp-t")
        return chamadas, r

    def test_uma_ligacao_que_para_uma_vez_e_tentada_outra_vez(self):
        chamadas, r = self.transportar([NAO_LIGOU, RESPONDEU])
        self.assertEqual(len(chamadas), 2)
        for args in chamadas:
            self.assertEqual(args[args.index("--connect-timeout") + 1], "10")
            self.assertEqual(args[args.index("--max-time") + 1], "120")
        self.assertEqual((r.saida, r.sem_ligacao), (0, False))
        self.assertIn("e.invalid did not connect within 10 seconds; tried once more, which succeeded", r.nota)

    def test_planta_uma_ligacao_que_para_duas_vezes(self):
        chamadas, r = self.transportar([NAO_LIGOU, NAO_LIGOU, RESPONDEU])
        self.assertEqual(len(chamadas), 2)  # no third attempt, and no retry over HTTP/1.1
        self.assertTrue(r.sem_ligacao)
        self.assertEqual(r.erro, "e.invalid did not connect within 10 seconds, twice")
        self.assertIn("tried once more, which did not connect either", r.nota)

    def test_outro_fim_de_tempo_nao_e_uma_ligacao_que_parou(self):
        # exit 28 after connecting (the total time ran out) is not retried as a connection
        depois = subprocess.CompletedProcess([], 28, json.dumps({"time_connect": 0.04, "http_code": 0}),
                                             "curl: (28) Operation timed out after 120000 milliseconds")
        self.assertFalse(fontes.nao_ligou(depois))
        self.assertTrue(fontes.nao_ligou(NAO_LIGOU))


class SemLigacao(SitioFalso):
    """A fake site whose host never connects (as transporte_curl reports it after two attempts)."""

    def transporte(self, url, destino, metodo="GET", endereco=None, **kw):
        self.pedidos.append((metodo, url, endereco))
        host = url.split("/")[2]
        if host == "parado.invalid" and (not url.endswith("/robots.txt") or self.robots_parado):
            return fontes.Resposta(28, 0, url, "", 0, f"{host} did not connect within 10 seconds, twice", sem_ligacao=True)
        return super().transporte(url, destino, metodo, endereco)


class Buscar(unittest.TestCase):
    def setUp(self):
        self.loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, self.loja, True)
        self.direitos = Path(tempfile.mkdtemp(prefix="oedp-direitos-"))
        self.addCleanup(shutil.rmtree, self.direitos, True)
        (self.direitos / "parado.invalid.toml").write_text((ENSAIOS / "direitos" / "example.org.toml").read_text(encoding="utf-8"),
                                                           encoding="utf-8")

    def recusa(self, robots_parado, mensagem):
        s = SemLigacao({"https://parado.invalid/doc": (200, DOCUMENTO, "")}, {"parado.invalid": ["93.184.216.34"]})
        s.robots_parado = robots_parado
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.buscar("https://parado.invalid/doc", self.loja, direitos.para_buscar(self.direitos), s.transporte, False, s.resolver)
        self.assertIn(mensagem, str(e.exception))
        self.assertIn("parado.invalid did not connect within 10 seconds, twice", str(e.exception))
        self.assertFalse([p for p in self.loja.rglob("*") if p.is_file() and p.name != "hosts.json"])
        return s

    def test_planta_documento_que_nao_liga(self):
        self.recusa(False, "refused: https://parado.invalid/doc could not be fetched")
        memoria = self.loja / "hosts.json"
        self.assertFalse(memoria.is_file() and "sem_head" in memoria.read_text())  # not remembered as a host without HEAD

    def test_planta_robots_que_nao_liga(self):
        self.recusa(True, "robots.txt could not be reached")
