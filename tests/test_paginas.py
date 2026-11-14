"""The five pages, the holding page, the fixed sentences and the hosting configuration."""
from __future__ import annotations

import hashlib
import json
import re
import shutil
import tempfile
import tomllib
import unittest
from pathlib import Path

from oedp import construir as build
from tests.apoio import ENSAIOS, LOJA, PECA, REPO, Plantada

ESPERA_SHA = "7cd78372ec71f95d061800946e6a64356625861781e34efa5b2c89921c77e352"  # measured on the live holding page's files


def tabela_dos_textos() -> dict:
    texto = (REPO / "docs" / "ESPEC-PAGINAS.md").read_text(encoding="utf-8")
    tabela = texto.split("## The fixed sentences (`textos.toml`)", 1)[1]
    esperado = {}
    for linha in tabela.splitlines():
        m = re.match(r"\| (`.+?`(?:, `.+?`)*) \| (.+) \|$", linha)
        if not m:
            continue
        chaves = re.findall(r"`([^`]+)`", m[1])
        valores = [m[2]] if len(chaves) == 1 else m[2].split(" · ")
        assert len(chaves) == len(valores), linha
        esperado.update(zip(chaves, valores))
    return esperado


class Textos(unittest.TestCase):
    def test_textos_toml_e_a_tabela_da_especificacao(self):
        esperado = tabela_dos_textos()
        real = tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8"))
        self.assertEqual(len(esperado), 67)
        self.assertEqual(real, esperado)


class Espera(unittest.TestCase):
    def setUp(self):
        self.saida = Path(tempfile.mkdtemp(prefix="oedp-espera-"))
        self.addCleanup(shutil.rmtree, self.saida, True)

    def test_sem_peca_publicada_e_a_pagina_de_espera(self):
        vazia = Path(tempfile.mkdtemp(prefix="oedp-vazia-"))
        self.addCleanup(shutil.rmtree, vazia, True)
        c = build.construir(REPO, raiz=vazia, saida=self.saida)
        self.assertTrue(c.ok, c.mensagens)
        est = self.saida / "static"
        self.assertEqual(sorted(p.name for p in est.iterdir()), ["404.html", "index.html", "manifesto.json"])
        for nome in ("index.html", "404.html"):
            dados = (est / nome).read_bytes()
            self.assertEqual(dados, (ENSAIOS / "pagina-de-espera" / nome).read_bytes())
            self.assertEqual(hashlib.sha256(dados).hexdigest(), ESPERA_SHA)
            self.assertEqual(len(dados), 2340)

    def test_um_rascunho_nao_muda_a_pagina_de_espera(self):
        p = Plantada([('estado = "publicada"', 'estado = "rascunho"')])
        self.addCleanup(p.apagar)
        c = build.construir(REPO, raiz=p.pasta, saida=self.saida, loja=LOJA)
        self.assertTrue(c.ok, c.mensagens)
        self.assertEqual(hashlib.sha256((self.saida / "static/index.html").read_bytes()).hexdigest(), ESPERA_SHA)

    def test_configuracao_do_anfitriao(self):
        c = build.construir(REPO, raiz=Path(tempfile.mkdtemp(prefix="oedp-vazia-")), saida=self.saida)
        self.assertTrue(c.ok)
        cfg = json.loads((self.saida / "config.json").read_text(encoding="utf-8"))
        self.assertEqual(cfg["version"], 3)
        vercel = json.loads((REPO / "vercel.json").read_text(encoding="utf-8"))
        for rota in vercel["routes"]:
            self.assertIn(rota, cfg["routes"])
        self.assertEqual(len(vercel["routes"]), 4)
        self.assertIn({"src": "/(.*)", "headers": {"X-Robots-Tag": "noindex, nofollow"}, "continue": True}, cfg["routes"])
        self.assertEqual(cfg["routes"][-2:], [{"handle": "filesystem"}, {"src": "/(.*)", "status": 404, "dest": "/404.html"}])
        self.assertNotIn("lancamento", tomllib.loads((REPO / "sitio.toml").read_text(encoding="utf-8")))


class CincoPaginas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.saida = Path(tempfile.mkdtemp(prefix="oedp-paginas-"))
        c = build.construir(REPO, raiz=ENSAIOS, saida=cls.saida, loja=LOJA)
        assert c.ok, c.mensagens
        cls.est = cls.saida / "static"

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.saida, ignore_errors=True)

    def ler(self, nome):
        return (self.est / nome).read_text(encoding="utf-8")

    def test_os_cinco_tipos_e_o_404(self):
        for nome in ("index.html", "temas/ensaio/index.html", "pecas/2026-11-16-peca-de-ensaio/index.html",
                     "metodo/index.html", "correcoes/index.html", "404.html"):
            html = self.ler(nome)
            self.assertIn('<html lang="pt-PT">', html)
            self.assertEqual(html.count("<h1"), 1, nome)
            self.assertIn('<meta name="robots" content="noindex, nofollow">', html)
            self.assertIn('Texto gerado e editado por inteligência artificial. Nenhuma pessoa o revê antes de ser publicado. <a href="/metodo/">Como é feito</a>', html)
            self.assertLess(html.index("rotulo-ia-linha"), html.index("wordmark"), "the AI line sits above the name")
            self.assertNotIn("<script", html)
            self.assertNotIn("sitemap", html)

    def test_a_pagina_da_peca_leva_a_impressao(self):
        from oedp.peca import ler

        peca = ler(PECA)
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn(f'<meta name="impressao" content="{peca.impressao}">', html)
        self.assertIn(f"<code>{peca.impressao}</code>", html)
        self.assertIn("Publicada a 16 de novembro de 2026, às 10h40.", html)
        self.assertIn("Da encomenda à publicação: 2 h 40 min.", html)
        ordem = re.findall(r'<details class="recibo" id="r-([a-z_]+)"', html)
        self.assertEqual(ordem, ["indice", "diferenca", "indice_anterior", "total", "terco", "declaracao", "despacho", "proxima"])
        self.assertLess(html.index('class="correcoes-da-peca"'), html.index('class="texto"'))

    def test_manifesto_lista_cada_ficheiro(self):
        man = json.loads(self.ler("manifesto.json"))["ficheiros"]
        reais = {f.relative_to(self.est).as_posix() for f in self.est.rglob("*") if f.is_file()} - {"manifesto.json"}
        self.assertEqual(set(man), reais)
        for nome, sha in man.items():
            self.assertEqual(hashlib.sha256((self.est / nome).read_bytes()).hexdigest(), sha)

    def test_cada_ligacao_interna_resolve(self):
        self.assertEqual(build.ligacoes_partidas(self.est), [])

    def test_a_folha_de_estilo_tem_no_maximo_oitocentas_linhas(self):
        self.assertLessEqual(len((REPO / "public" / "estilo.css").read_text(encoding="utf-8").splitlines()), 800)

    def test_peca_retirada_mostra_so_titulo_frase_razao_e_registo(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        with open(p.peca, "a", encoding="utf-8") as f:
            f.write('\n[[estado]]\nestado = "retirada"\nem = "2026-11-17T09:00:00Z"\npor = "ensaio"\nrazao = "Razão de ensaio."\n')
        saida = Path(tempfile.mkdtemp(prefix="oedp-retirada-"))
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA)
        self.assertTrue(c.ok, c.mensagens)
        html = (saida / "static/pecas/2026-11-16-peca-de-ensaio/index.html").read_text(encoding="utf-8")
        self.assertIn("Esta peça foi retirada a 17 de novembro de 2026.", html)
        self.assertIn("Razão de ensaio.", html)
        self.assertNotIn('class="texto"', html)
        self.assertNotIn("recibo", html)
        self.assertEqual((saida / "static/index.html").read_bytes(), (ENSAIOS / "pagina-de-espera/index.html").read_bytes())

    def test_lancamento_tira_o_noindex(self):
        from oedp import paginas

        ctx = paginas.Contexto(textos=tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8")), lancamento=True)
        self.assertNotIn("noindex", paginas.pagina_404(ctx))
        self.assertNotIn("X-Robots-Tag", json.dumps(build.configuracao(REPO, True)))


if __name__ == "__main__":
    unittest.main()
