"""ESQ2b item 2: `estado … publicada` refuses whatever the build would refuse, with the
build's own reasons, and writes nothing when it refuses."""
from __future__ import annotations

import contextlib
import io
import os
import unittest
from unittest import mock

from oedp import codigo
from oedp.peca import ler
from tests.apoio import Plantada, loja_fora_do_repositorio


class EstadoPublicada(unittest.TestCase):
    def rascunho(self):
        p = Plantada([('estado = "publicada"', 'estado = "rascunho"')])
        self.addCleanup(p.apagar)
        return p

    def publicar(self, p):
        from oedp import __main__ as cli

        erro = io.StringIO()
        with mock.patch.dict(os.environ, {"OEDP_FONTES": str(loja_fora_do_repositorio(self))}), contextlib.redirect_stderr(erro):
            saida = cli.principal(["estado", str(p.peca), "publicada", "--razao", "Ensaio."])
        return saida, erro.getvalue()

    def recusa(self, p, mensagem):
        antes = p.peca.read_bytes()
        saida, erro = self.publicar(p)
        self.assertEqual(saida, 1, erro)
        self.assertIn("refused: the site would not build with the piece published:", erro)
        self.assertIn(mensagem, erro)
        self.assertEqual(p.peca.read_bytes(), antes)
        self.assertEqual(ler(p.peca).estado, "rascunho")

    def test_uma_peca_honesta_publica(self):
        p = self.rascunho()
        saida, erro = self.publicar(p)
        self.assertEqual(saida, 0, erro)
        self.assertEqual(ler(p.peca).estado, "publicada")

    def test_planta_metodo_sem_julgamento_que_passe(self):
        p = self.rascunho()
        f = p.pasta / "paginas" / "metodo.md"
        f.write_text(f.read_text(encoding="utf-8").replace('veredicto = "passa"', 'veredicto = "nao_passa"'), encoding="utf-8")
        self.recusa(p, "paginas/metodo.md: the last juiz reading on its current fingerprint says nao_passa")

    def test_planta_textos_sem_julgamento_que_passe(self):
        p = self.rascunho()
        f = p.pasta / "textos.registo.toml"
        f.write_text(f.read_text(encoding="utf-8").replace('impressao = "', 'impressao = "0'), encoding="utf-8")
        self.recusa(p, "textos.toml: no juiz reading on its current fingerprint")

    def test_planta_codigo_sem_leitura_que_passe(self):
        p = self.rascunho()
        (p.pasta / codigo.REGISTO).write_text("# no reading\n", encoding="utf-8")
        self.recusa(p, "check  5 (verified and judged by the other family) · code: no seguranca reading on the current code fingerprint")
