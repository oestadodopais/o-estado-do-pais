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
    def test_o_manifesto_da_aplicacao_sem_o_comentario_antigo(self):
        dados = json.loads((REPO / "public" / "manifest.webmanifest").read_text(encoding="utf-8"))
        self.assertNotIn("_", dados)
        self.assertEqual(dados["name"], "O Estado do País")

    def test_textos_toml_e_a_tabela_da_especificacao(self):
        esperado = tabela_dos_textos()
        real = tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8"))
        self.assertEqual(len(esperado), 84)
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
            ligacao = '<span aria-current="page">Como é feito</span>' if nome.startswith("metodo/") else '<a href="/metodo/">Como é feito</a>'
            self.assertIn('Texto gerado e editado por inteligência artificial. Nenhuma pessoa o revê antes de ser publicado. ' + ligacao, html)
            self.assertLess(html.index("rotulo-ia-linha"), html.index("wordmark"), "the AI line sits above the name")
            self.assertNotIn("<script", html)
            self.assertRegex(html, r'<body>\n<a class="saltar" href="#conteudo">Saltar para o texto</a>\n')
            self.assertIn('<main id="conteudo">', html)
            self.assertNotIn("sitemap", html)

    def test_a_pagina_da_peca_leva_a_impressao(self):
        from oedp.peca import ler

        peca = ler(PECA)
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn(f'<meta name="impressao" content="{peca.impressao}">', html)
        self.assertIn(f"<code>{peca.impressao}</code>", html)
        self.assertIn("Publicada a 16 de novembro de 2026, às 10h40.", html)
        self.assertIn("Da encomenda à publicação: 2 h 40 min.", html)
        self.assertIn('<td class="mono" data-rotulo="Erros plantados apanhados">3 de 3</td>', html)
        self.assertNotRegex(html, r">\d+/\d+<")
        ordem = re.findall(r'<details class="recibo" id="r-([a-z_]+)"', html)
        self.assertEqual(ordem, ["indice", "diferenca", "indice_anterior", "total", "terco", "declaracao", "despacho", "proxima"])
        self.assertLess(html.index('class="correcoes-da-peca"'), html.index('class="texto"'))

    def test_o_registo_da_equipa_no_metodo(self):
        html = self.ler("metodo/index.html")
        for chave in ("Lugar", "Leituras", "Erros plantados apanhados", "Achados reais adotados", "Falhas apontadas por correções"):
            self.assertIn(f'<th scope="col">{chave}</th>', html)
        # juiz: three readings, 3 of 3, 2 of 2 and 1 of 1, one finding adopted, one miss named by the correction's causa
        self.assertIn('<tr><td class="lugar" data-rotulo="Lugar">Juiz</td><td class="mono" data-rotulo="Leituras">3</td>'
                      '<td class="mono" data-rotulo="Erros plantados apanhados">6 de 6</td><td class="mono" data-rotulo="Achados reais adotados">1</td>'
                      '<td class="mono" data-rotulo="Falhas apontadas por correções">1</td></tr>', html)
        # the four counts are a block of their own, under numeros_titulo, before the team's record
        self.assertLess(html.index('<section class="numeros"><h2>Em números</h2><dl class="contagens"><dt>Peças publicadas</dt>'),
                        html.index('<section class="equipa">'))
        self.assertIn('<dt>Peças publicadas</dt><dd class="mono">1</dd><dt>Correções</dt><dd class="mono">1</dd>'
                      '<dt>Atualizações</dt><dd class="mono">0</dd><dt>Peças retiradas</dt><dd class="mono">0</dd>', html)
        self.assertIn('<h2>Taxa de erro medida</h2><p>Ainda não houve auditoria.</p>', html)

    def test_a_conta_e_aritmetica_e_nunca_a_expressao(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn('<dd class="conta"><a href="#r-indice">104,7</a> \u2212 <a href="#r-indice_anterior">102,3</a>'
                      '\u00a0= 2,4 (arredondado a uma casa decimal)</dd>', html)
        self.assertNotIn("round", html)
        self.assertNotIn("indice - indice_anterior", html)

    def test_a_conta_com_outras_formas(self):
        from types import SimpleNamespace
        from oedp import paginas

        ctx = paginas.Contexto(textos=tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8")))
        peca = SimpleNamespace(linhas={"a": {"valor": "30800"}, "b": {"valor": "39900"}})
        conta = lambda c, v: paginas._conta(ctx, peca, {"calculo": c, "valor": v})
        self.assertEqual(conta("round ( a / b * 100 , 0 )", "77"),
                         '<a href="#r-a">30800</a> \u00f7 <a href="#r-b">39900</a> \u00d7 100\u00a0= 77 (arredondado à unidade)')
        self.assertEqual(conta("( a + b ) / 2", "35350"),
                         '(<a href="#r-a">30800</a> + <a href="#r-b">39900</a>) \u00f7 2\u00a0= 35350')
        self.assertEqual(conta("round ( - a + b , 2 )", "9100.00"),
                         '\u2212<a href="#r-a">30800</a> + <a href="#r-b">39900</a>\u00a0= 9100,00 (arredondado a 2 casas decimais)')

    def test_uma_linha_impressa_nao_parte(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn('>1,2\u00a0milhões\u00a0de\u00a0euros</a>', html)
        self.assertIn('>um\u00a0terço</a>', html)
        self.assertIn("segunda-feira, 16\u00a0de novembro</a>", html)
        self.assertIn("16\u00a0de fevereiro de 2027</a>", html)
        for nome in ("index.html", "temas/ensaio/index.html"):
            self.assertIn("subiu para 104,7\u00a0pontos</a>", self.ler(nome))

    def test_o_sinal_de_provisorio_e_o_regresso_ao_texto(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn('<summary><span class="figura">104,7\u00a0pontos</span></summary><p class="sinal">Valor provisório</p><dl>', html)
        self.assertNotIn('class="provisorio"', html)
        self.assertIn('<summary><span>O despacho de ensaio foi assinado pela ministra de ensaio.</span></summary>', html)
        recibos = re.findall(r'<details class="recibo" id="r-([a-z_]+)">.*?</details>', html, re.S)
        self.assertEqual(len(recibos), 8)
        for lid in recibos:
            self.assertIn(f'<p class="voltar"><a href="#u-{lid}">Voltar ao texto</a></p></details>', html)
        self.assertIn('<h1 class="peca-titulo">Peça de ensaio com números inventados: o índice de ensaio subiu para '
                      '<a class="ref" href="#r-indice" id="u-indice">', html)

    def test_o_registo_diz_quando_e_segue_a_ordem(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn('<thead><tr><th scope="col">Quando</th><th scope="col">Leitura</th>', html)
        quando = re.findall(r'<td class="quando"[^>]*>([^<]+)<br>([^<]+)</td>', html)
        self.assertEqual([h for _, h in quando], ["9h05", "10h10", "10h25", "11h06", "11h12", "12h06", "12h10"])
        self.assertEqual(quando[0][0], "16 de novembro de 2026")

    def test_a_folha_de_estilo_cumpre_as_regras_do_desenho(self):
        css = (REPO / "public" / "estilo.css").read_text(encoding="utf-8")
        tamanhos = [float(x) for x in re.findall(r"font-size:\s*(?:clamp\()?\s*([0-9.]+)px", css)]
        self.assertTrue(tamanhos)
        self.assertGreaterEqual(min(tamanhos), 12)
        self.assertNotIn("oldstyle-nums", css)
        self.assertIn("lining-nums proportional-nums", css)
        # the one exception: the name at the top, a link to the front page, not underlined
        self.assertEqual(re.findall(r"([^{}\n]+)\{[^}]*text-decoration(?:-line)?:\s*none", css), [".wordmark a "])
        self.assertIn("a.ref, a.ligada { text-decoration-line: underline; text-decoration-style: dotted;", css)
        self.assertEqual(len(re.findall(r"\.wordmark\s*\{[^}]*font-size", css)), 1)
        self.assertNotIn("masthead-compact", css)
        self.assertIn("main > .dia-bloco:first-child { border-top: 0; padding-top: 0; }", css)
        self.assertIn('<main id="conteudo">\n<section class="dia-bloco">', self.ler("index.html"))

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
