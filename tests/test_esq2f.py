"""ESQ2 item F: the link to a source says what it does, and a receipt can link the
publisher's own page for the document."""
from __future__ import annotations

import shutil
import tempfile
import tomllib
import unittest
from pathlib import Path

from oedp import conferir as conf
from oedp import construir as build
from oedp import direitos, fontes, paginas
from oedp.peca import ler
from tests.apoio import ENSAIOS, LOJA, REPO, Plantada
from tests.test_esq1d import DOCUMENTO, SitioFalso

PAGINA_SHA = "29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b"  # a copy in the test store
DEPOIS_DO_PDF = 'publicado_em = "2026-11-16"\n\n[[fonte]]'


def com_campos(campos: str) -> list[tuple[str, str]]:
    """A plant that adds fields to the test piece's first source (the PDF)."""
    return [(DEPOIS_DO_PDF, 'publicado_em = "2026-11-16"\n' + campos + '\n[[fonte]]')]


class PalavrasDaLigacao(unittest.TestCase):
    def setUp(self):
        self.ctx = paginas.Contexto(textos=tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8")))

    def test_pagina_web_abre_e_ficheiro_descarrega(self):
        for tipo, quer in (("text/html", "Abrir a fonte"), ("application/xhtml+xml", "Abrir a fonte"),
                           ("text/html; charset=utf-8", "Abrir a fonte"), ("application/pdf", "Descarregar a fonte"),
                           ("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Descarregar a fonte"),
                           ("text/csv", "Descarregar a fonte"), ("", "Descarregar a fonte")):
            self.assertEqual(paginas.palavras_da_ligacao(self.ctx, {"tipo_conteudo": tipo}), quer, tipo)

    def test_na_pagina_construida(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        peca = ler(p.peca)
        ctx, _ = build.contexto(REPO, p.pasta, [peca])
        html = paginas.pagina_da_peca(peca, ctx)
        self.assertIn('<a href="https://example.org/ensaio/documento.pdf" rel="noopener noreferrer">Descarregar a fonte</a>', html)
        self.assertIn('<a href="https://example.org/ensaio/tabela.html" rel="noopener noreferrer">Abrir a fonte</a>', html)
        self.assertNotIn('documento.pdf" rel="noopener noreferrer">Abrir a fonte', html)
        self.assertNotIn("Ver a página onde a fonte foi publicada", html)


class PaginaDoEditor(unittest.TestCase):
    def plantada(self, campos):
        p = Plantada(com_campos(campos))
        self.addCleanup(p.apagar)
        return p

    def test_com_pagina_guardada_passa_e_o_recibo_liga_a_pagina(self):
        p = self.plantada(f'pagina = "https://example.org/ensaio/"\npagina_sha256 = "{PAGINA_SHA}"\n')
        r = p.resultados(LOJA)
        self.assertEqual(r[2].estado, conf.PASSOU, r[2].linha())
        self.assertEqual(r[9].estado, conf.PASSOU, r[9].linha())
        peca = ler(p.peca)
        ctx, _ = build.contexto(REPO, p.pasta, [peca])
        html = paginas.pagina_da_peca(peca, ctx)
        self.assertIn('Descarregar a fonte</a></dd><dd class="abrir"><a href="https://example.org/ensaio/" '
                      'rel="noopener noreferrer">Ver a página onde a fonte foi publicada</a></dd>', html)

    def test_planta_pagina_sem_impressao(self):
        r = self.plantada('pagina = "https://example.org/ensaio/"\n').resultados(LOJA)
        self.assertEqual(r[9].estado, conf.FALHOU)
        self.assertIn("pagina and pagina_sha256 go together", r[9].linha())

    def test_planta_impressao_sem_pagina(self):
        r = self.plantada(f'pagina_sha256 = "{PAGINA_SHA}"\n').resultados(LOJA)
        self.assertEqual(r[9].estado, conf.FALHOU)
        self.assertIn("pagina and pagina_sha256 go together", r[9].linha())

    def test_planta_pagina_que_nao_esta_na_loja(self):
        r = self.plantada('pagina = "https://example.org/ensaio/"\npagina_sha256 = "' + "ab" * 32 + '"\n').resultados(LOJA)
        self.assertEqual(r[2].estado, conf.FALHOU)  # the test piece is published: a missing copy fails
        self.assertIn("fonte doc_pdf: no copy of its pagina in the store under " + "ab" * 32, r[2].linha())

    def test_planta_pagina_cuja_copia_nao_da_a_impressao(self):
        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, loja, True)
        shutil.copytree(LOJA, loja, dirs_exist_ok=True)
        falsa = "cd" * 32
        destino = fontes.caminho_da_copia(loja, falsa)
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_bytes(b"outra coisa")
        r = self.plantada(f'pagina = "https://example.org/ensaio/"\npagina_sha256 = "{falsa}"\n').resultados(loja)
        self.assertEqual(r[2].estado, conf.FALHOU)
        self.assertIn("the stored copy of its pagina hashes to", r[2].linha())

    def test_planta_pagina_de_anfitriao_sem_registo_de_direitos(self):
        r = self.plantada(f'pagina = "https://outro.invalid/ensaio/"\npagina_sha256 = "{PAGINA_SHA}"\n').resultados(LOJA)
        self.assertEqual(r[9].estado, conf.FALHOU)
        self.assertIn("the host outro.invalid of its pagina has no rights record direitos/outro.invalid.toml", r[9].linha())


class FontePagina(unittest.TestCase):
    """`fonte <url> --pagina <address>` fetches the page under the source's rules (the network is a fake)."""

    PUBLICO = ["93.184.216.34"]

    def setUp(self):
        self.loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, self.loja, True)
        self.direitos = Path(tempfile.mkdtemp(prefix="oedp-direitos-"))
        self.addCleanup(shutil.rmtree, self.direitos, True)
        (self.direitos / "fim.invalid.toml").write_text((ENSAIOS / "direitos" / "example.org.toml").read_text(encoding="utf-8"),
                                                        encoding="utf-8")

    def site(self, paginas_, enderecos=None):
        return SitioFalso(paginas_, enderecos or {h: self.PUBLICO for h in ("fim.invalid", "sem.invalid", "interno.invalid")})

    def correr(self, s, pagina):
        tabela = fontes.buscar("https://fim.invalid/doc", self.loja, direitos.para_buscar(self.direitos), s.transporte,
                               False, s.resolver)
        return fontes.com_pagina(tabela, pagina, self.loja, direitos.para_buscar(self.direitos), s.transporte, s.resolver)

    def test_guarda_a_pagina_e_imprime_os_dois_campos(self):
        pagina = b"<html><body>" + DOCUMENTO + b"</body></html>"
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, ""), "https://fim.invalid/p": (200, pagina, "")})
        tabela = self.correr(s, "https://fim.invalid/p")
        dados = tomllib.loads(tabela)["fonte"][0]
        self.assertEqual(dados["pagina"], "https://fim.invalid/p")
        import hashlib
        self.assertEqual(dados["pagina_sha256"], hashlib.sha256(pagina).hexdigest())
        self.assertTrue(fontes.caminho_da_copia(self.loja, dados["pagina_sha256"]).is_file())

    def test_planta_pagina_de_anfitriao_sem_direitos(self):
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, ""), "https://sem.invalid/p": (200, DOCUMENTO + b"x", "")})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.correr(s, "https://sem.invalid/p")
        self.assertIn("sem.invalid has no rights record", str(e.exception))

    def test_planta_pagina_que_robots_fecha(self):
        robots = b"User-agent: *\nDisallow: /p\n"
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, ""), "https://fim.invalid/robots.txt": (200, robots, ""),
                       "https://fim.invalid/p": (200, DOCUMENTO + b"x", "")})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.com_pagina("", "https://fim.invalid/p", self.loja, direitos.para_buscar(self.direitos), s.transporte, s.resolver)
        self.assertIn("closes this address", str(e.exception))

    def test_planta_pagina_num_endereco_privado(self):
        s = self.site({"https://interno.invalid/p": (200, DOCUMENTO, "")},
                      {"interno.invalid": ["10.0.0.7"]})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.com_pagina("", "https://interno.invalid/p", self.loja, direitos.para_buscar(self.direitos), s.transporte, s.resolver)
        self.assertIn("not a public address", str(e.exception))

    def test_planta_pagina_que_nao_responde_200(self):
        s = self.site({"https://fim.invalid/p": (404, b"", "")})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.com_pagina("", "https://fim.invalid/p", self.loja, direitos.para_buscar(self.direitos), s.transporte, s.resolver)
        self.assertIn("answered 404", str(e.exception))
