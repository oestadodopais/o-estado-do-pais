"""Work order ESQ1e: the fetcher against real hosts, rights records that prove themselves,
and the designer's second reading. Each rule with a plant."""
from __future__ import annotations

import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import conferir as conf
from oedp import construir as build
from oedp import fontes
from oedp.peca import ler
from tests.apoio import ENSAIOS, LOJA, PECA, REPO, Plantada, sitio_de_ensaio
from tests.test_esq1d import SitioFalso

PUBLICO = ["93.184.216.34"]


# --------------------------------------------------------------------------- 1 and 2


class Item01Pequeno(unittest.TestCase):
    def setUp(self):
        self.loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, self.loja, True)

    def test_planta_resposta_de_manutencao(self):
        corpo = "Servidor em Manutencao, tente mais tarde.".encode()
        s = SitioFalso({"https://fim.invalid/doc": (200, corpo, "")}, {"fim.invalid": PUBLICO})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.buscar("https://fim.invalid/doc", self.loja, None, s.transporte, False, s.resolver)
        self.assertIn("answered 200 with only 41 bytes", str(e.exception))
        self.assertIn("«Servidor em Manutencao, tente mais tarde.»", str(e.exception))
        self.assertEqual([p for p in self.loja.rglob("*") if p.is_file()], [])
        avisos = []
        fontes.buscar("https://fim.invalid/doc", self.loja, None, s.transporte, False, s.resolver, pequeno=True, avisos=avisos)
        self.assertIn("stored: 41 bytes, type text/html; its text begins: «Servidor em Manutencao, tente mais tarde.»", avisos)


class Item02Http11(unittest.TestCase):
    def test_planta_falha_de_transporte_tenta_http11(self):
        chamadas = []

        def correr(args, **kw):
            chamadas.append(args)
            if len(chamadas) == 1:
                return subprocess.CompletedProcess(args, 28, "", "curl: (28) Invalid HTTP header field was received")
            return subprocess.CompletedProcess(args, 0, '{"http_code":200,"url_effective":"https://e.invalid/"}', "")

        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            r = fontes.transporte_curl("https://e.invalid/", Path(tempfile.gettempdir()) / "oedp-t")
        self.assertEqual(len(chamadas), 2)
        self.assertNotIn("--http1.1", chamadas[0])
        self.assertIn("--http1.1", chamadas[1])
        self.assertEqual(r.saida, 0)
        self.assertIn("tried once more with --http1.1, which succeeded", r.nota)

    def test_as_notas_de_todos_os_pedidos_chegam_a_quem_chama(self):
        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, loja, True)
        corpo = b"documento de ensaio " * 30
        s = SitioFalso({"https://fim.invalid/doc": (200, corpo, "")}, {"fim.invalid": PUBLICO})
        base = s.transporte

        def com_nota(url, destino, metodo="GET", endereco=None):
            r = base(url, destino, metodo, endereco)
            r.nota = f"{metodo} {url}: tried once more with --http1.1, which succeeded"
            return r

        avisos = []
        fontes.buscar("https://fim.invalid/doc", loja, None, com_nota, False, s.resolver, avisos=avisos)
        self.assertIn("GET https://fim.invalid/robots.txt: tried once more with --http1.1, which succeeded", avisos)
        self.assertIn("HEAD https://fim.invalid/doc: tried once more with --http1.1, which succeeded", avisos)
        self.assertIn("GET https://fim.invalid/doc: tried once more with --http1.1, which succeeded", avisos)

    def test_um_endereco_que_nao_resolve_nao_e_tentado_outra_vez(self):
        chamadas = []

        def correr(args, **kw):
            chamadas.append(args)
            return subprocess.CompletedProcess(args, 6, "", "curl: (6) Could not resolve host")

        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            r = fontes.transporte_curl("https://e.invalid/", Path(tempfile.gettempdir()) / "oedp-t")
        self.assertEqual(len(chamadas), 1)
        self.assertEqual(r.nota, "")


# --------------------------------------------------------------------------- 3


class Item03Check8LeOQueAindaNaoFoiCommitado(unittest.TestCase):
    def test_planta_ficheiro_por_seguir_e_ficheiro_nomeado(self):
        repo = Path(tempfile.mkdtemp(prefix="oedp-git-"))
        self.addCleanup(shutil.rmtree, repo, True)
        git = lambda *a: subprocess.run(["git", "-C", str(repo), *a], check=True, capture_output=True)
        git("init", "-q")
        (repo / "limpo.txt").write_text("nada\n", encoding="utf-8")
        (repo / ".gitignore").write_text("ignorado.txt\n", encoding="utf-8")
        git("add", "limpo.txt", ".gitignore")
        caminho = "/" + "Users" + "/" + "mariaexemplo" + "/x"
        (repo / "ignorado.txt").write_text(caminho, encoding="utf-8")
        self.assertEqual(conf.check8_arvore(repo, {}).estado, conf.PASSOU, "an ignored file is not read")
        (repo / "novo.md").write_text(caminho, encoding="utf-8")
        r = conf.check8_arvore(repo, {})
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("novo.md: a machine path at character 0", r.razoes)
        (repo / "novo.md").unlink()
        fora = Path(tempfile.mkdtemp(prefix="oedp-fora-")) / "registo.toml"
        self.addCleanup(shutil.rmtree, fora.parent, True)
        fora.write_text(caminho, encoding="utf-8")
        r = conf.check8_arvore(repo, {}, extras=[fora])
        self.assertTrue(any(x.endswith("registo.toml: a machine path at character 0") for x in r.razoes), r.razoes)


# --------------------------------------------------------------------------- 4


class Item04ApoioDosDireitos(unittest.TestCase):
    def plantar(self, excerto, loja=LOJA, rascunho=False, extra=""):
        trocas = [('estado = "publicada"', 'estado = "rascunho"')] if rascunho else []
        p = Plantada(trocas)
        self.addCleanup(p.apagar)
        termos = ler(PECA).fontes["doc_pdf"]["sha256"]  # a stored copy stands in for the publisher's terms
        f = p.pasta / "direitos" / "example.org.toml"
        texto = f.read_text(encoding="utf-8").replace('termos_sha256 = "' + "0" * 64 + '"', f'termos_sha256 = "{termos}"')
        texto += f'licenca = "Licença de ensaio"\nreproduzir = "nao_dito"{extra}\n\n[[apoio]]\ncampo = "guardar"\nexcerto = "{excerto}"\n'
        f.write_text(texto, encoding="utf-8")
        peca = ler(p.peca)
        ctx, erros = build.contexto(REPO, p.pasta, [peca] if peca.vinculada else [])
        resultados = {r.verificacao: r for r in conf.conferir_peca(p.peca, ctx, loja, anterior=("absent", None))}
        return resultados, erros

    def test_um_apoio_que_esta_nos_termos_passa(self):
        r, erros = self.plantar("Documento de ensaio com números inventados.")
        self.assertEqual(erros, [])
        self.assertEqual(r[9].estado, conf.PASSOU, r[9].linha())

    def test_planta_apoio_que_nao_esta_nos_termos(self):
        r, _ = self.plantar("Este texto de apoio não existe nos termos.")
        self.assertEqual(r[9].estado, conf.FALHOU)
        self.assertIn("direitos/example.org.toml: [[apoio]] number 1 (for guardar) is not in the stored terms", r[9].razoes)

    def test_sem_loja_um_rascunho_nao_corre_e_uma_publicada_falha(self):
        r, _ = self.plantar("Documento de ensaio com números inventados.", loja=None, rascunho=True)
        self.assertEqual(r[9].estado, conf.NAO_CORRIDO)
        r, _ = self.plantar("Documento de ensaio com números inventados.", loja=None)
        self.assertEqual(r[9].estado, conf.FALHOU)
        self.assertTrue(any("need the store of sources" in x for x in r[9].razoes), r[9].razoes)

    def test_planta_reproduzir_fora_da_lista(self):
        from oedp import direitos

        self.assertIn("direitos/x.toml: reproduzir must be sim, nao or nao_dito",
                      direitos.erros_do_registo("direitos/x.toml", {**_registo_valido(), "reproduzir": "talvez"}))


def _registo_valido():
    import tomllib

    return tomllib.loads((ENSAIOS / "direitos" / "example.org.toml").read_text(encoding="utf-8"))


# --------------------------------------------------------------------------- 5 to 11: the pages


class Paginas(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.saida = Path(tempfile.mkdtemp(prefix="oedp-1e-"))
        assert build.construir(REPO, raiz=sitio_de_ensaio(cls), saida=cls.saida, loja=LOJA).ok
        cls.est = cls.saida / "static"

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.saida, ignore_errors=True)

    def ler(self, nome):
        return (self.est / nome).read_text(encoding="utf-8")

    def test_05_tabelas_viram_listas_no_telemovel(self):
        css = (REPO / "public" / "estilo.css").read_text(encoding="utf-8")
        self.assertIn("@media (max-width: 599px)", css)
        self.assertIn(".tabela td::before { content: attr(data-rotulo); display: block;", css)
        self.assertIn("th, td { text-align: left; padding: 8px 24px 8px 0;", css)
        for nome in ("pecas/2026-11-16-peca-de-ensaio/index.html", "metodo/index.html"):
            tabela = re.search(r'<div class="tabela">.*?</div>', self.ler(nome), re.S).group(0)
            cabecalhos = re.findall(r'<th scope="col">([^<]+)</th>', tabela)
            for linha in re.findall(r"<tr><td.*?</tr>", tabela):
                self.assertEqual(re.findall(r'data-rotulo="([^"]+)"', linha), cabecalhos)

    def test_05_planta_valor_sem_rotulo(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-sitio-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "index.html").write_text('<div class="tabela"><table><tr><td>3 de 3</td></tr></table></div>', encoding="utf-8")
        self.assertEqual(build.ligacoes_partidas(pasta), ["index.html: a value of a table carries no data-rotulo, so on a phone it would sit under no label"])

    def test_06_os_numeros_antes_da_equipa(self):
        html = self.ler("metodo/index.html")
        self.assertLess(html.index('<h2>Em números</h2>'), html.index('<h2>A equipa e o seu registo</h2>'))

    def test_07_a_frase_do_registo(self):
        self.assertIn("<p>Quem leu esta peça, quando, e o que encontrou.", self.ler("pecas/2026-11-16-peca-de-ensaio/index.html"))

    def test_08_o_tema_nao_liga_a_si_nem_aos_recibos(self):
        html = self.ler("temas/ensaio/index.html")
        seguir = re.search(r'<section class="seguir-bloco">.*?</section>', html, re.S).group(0)
        self.assertNotIn('class="ligada"', seguir)
        self.assertNotIn('class="ref"', seguir)
        self.assertIn("A próxima edição de ensaio sai a 16 de fevereiro de 2027.", seguir)
        self.assertNotIn('href="/temas/ensaio/"', html)

    def test_08_planta_pagina_que_liga_a_si(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-sitio-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "metodo").mkdir()
        (pasta / "metodo" / "index.html").write_text('<a href="/metodo/">Método</a>', encoding="utf-8")
        self.assertEqual(build.ligacoes_partidas(pasta), ["metodo/index.html: the link /metodo/ leads to the page itself; a page does not link to itself"])

    def test_08_nenhuma_pagina_construida_liga_a_si(self):
        self.assertEqual(build.ligacoes_partidas(self.est), [])

    def test_09_a_ordem_das_correcoes(self):
        html = self.ler("correcoes/index.html")
        entrada = re.search(r'<div class="correcao">.*?</div>', html, re.S).group(0)
        posicoes = [entrada.index(x) for x in ("16 de novembro de 2026 · Correção", 'class="correcao-peca"', "Antes dizia:", "Agora diz:",
                                               "Correção de ensaio, feita para provar a página das correções.")]
        self.assertEqual(posicoes, sorted(posicoes))

    def test_10_todo_o_mostra_na_letra_das_figuras(self):
        self.assertIn('<summary><span class="figura">um terço</span></summary>', self.ler("pecas/2026-11-16-peca-de-ensaio/index.html"))

    def test_11_coluna_centrada_e_nome_sem_ligacao_na_primeira(self):
        css = (REPO / "public" / "estilo.css").read_text(encoding="utf-8")
        self.assertIn(".wrap { max-width: calc(68ch + 2 * var(--gutter)); margin: 0 auto;", css)
        self.assertIn("margin-inline: calc((100% - var(--largura)) / 2);", css)
        self.assertIn(".equipa .tabela {\n    --largura: min(760px, calc(100vw - 2 * var(--gutter)));", css)
        self.assertIn('<h1 class="wordmark">O Estado do País</h1>', self.ler("index.html"))
        self.assertIn('<span aria-current="page">Início</span>', self.ler("index.html"))


if __name__ == "__main__":
    unittest.main()
