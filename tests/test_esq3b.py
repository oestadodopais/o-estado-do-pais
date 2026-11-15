"""ESQ3 (blocos/esq3/ORDEM.md), items H, I, J and K: the record of the weekly re-check, what a
piece cost, the statistics office's releases, and the numbered copy's label. No test touches
the network: the fetchers are stand-ins and the releases page is one written here.
"""
from __future__ import annotations

import argparse
import contextlib
import datetime as dt
import io
import json
import os
import re
import shutil
import tempfile
import tomllib
import unittest
from pathlib import Path
from unittest import mock

from oedp import __main__ as cli
from oedp import codigo, custo, datas, divulgacoes, ensaio, fontes, julgados, leituras, numerado, reconferir
from oedp import construir as build
from oedp.peca import ler
from tests.apoio import REPO, Plantada, loja_fora_do_repositorio
from tests.test_esq1f import commit, git_temporario

PDF = "3f9a602b9c8e9f75b8fdd9e63aadddfae0a1776aa4a31241b567946b3add3e89"
HTML = "29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b"
TEXTOS = tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8"))
PDF_URL, HTML_URL = "https://example.org/ensaio/documento.pdf", "https://example.org/ensaio/tabela.html"


def pasta_temporaria(caso, prefixo: str) -> Path:
    p = Path(tempfile.mkdtemp(prefix=prefixo))
    caso.addCleanup(shutil.rmtree, p, True)
    return p


# --------------------------------------------------------------------------- H. the record of the weekly re-check


class H_ORegistoDasReconferencias(unittest.TestCase):
    def setUp(self):
        self.loja = loja_fora_do_repositorio(self)
        self.oficina = pasta_temporaria(self, "oedp-oficina-")
        self.raiz = pasta_temporaria(self, "oedp-raiz-")
        self.p = Plantada()
        self.addCleanup(self.p.apagar)

    def original(self, sha):
        return fontes.caminho_da_copia(self.loja, sha).read_bytes()

    def correr(self, respostas, retirar=False, registo_em="raiz"):
        def buscar(url, loja):
            r = respostas[url]
            if isinstance(r, Exception):
                raise r
            return fontes.guardar(loja, r)
        return reconferir.reconferir([self.p.peca], self.loja, self.oficina, TEXTOS, retirar=retirar, buscar=buscar,
                                     imprimir=lambda *a: None, hoje="2026-11-22",
                                     registo_em=self.raiz if registo_em == "raiz" else registo_em)

    def tabelas(self) -> list[dict]:
        f = self.raiz / reconferir.REGISTO
        return tomllib.loads(f.read_text(encoding="utf-8")).get("reconferencia", []) if f.is_file() else []

    def test_uma_volta_inteira_acrescenta_uma_tabela(self):
        self.correr({PDF_URL: self.original(PDF), HTML_URL: self.original(HTML)})
        t = self.tabelas()
        self.assertEqual(len(t), 1)
        self.assertEqual({k: v for k, v in t[0].items() if k != "em"},
                         {"pecas": 1, "excertos": 7, "falhados": 0, "retiradas": [], "so_relatar": True})
        self.assertIsNotNone(datas.instante_real(t[0]["em"]))
        self.correr({PDF_URL: self.original(PDF), HTML_URL: self.original(HTML)})
        self.assertEqual(len(self.tabelas()), 2)
        self.assertEqual(reconferir.ler_registo(self.raiz), (self.tabelas(), []))

    def test_uma_fonte_que_falha_e_retirada(self):
        nova = b"<html><body><p>O documento de ensaio foi revisto e diz agora outra coisa.</p></body></html>"
        self.correr({PDF_URL: nova, HTML_URL: self.original(HTML)}, retirar=True)
        t = self.tabelas()
        self.assertEqual({k: v for k, v in t[0].items() if k != "em"},
                         {"pecas": 1, "excertos": 7, "falhados": 4, "retiradas": ["2026-11-16-peca-de-ensaio"], "so_relatar": False})

    def test_uma_fonte_inacessivel_nao_conta_como_procurada(self):
        self.correr({PDF_URL: fontes.ErroDaLoja("refused: example.org answered 503"), HTML_URL: self.original(HTML)})
        self.assertEqual((self.tabelas()[0]["excertos"], self.tabelas()[0]["falhados"]), (3, 0))

    def test_planta_uma_volta_parcial_nao_acrescenta(self):
        self.correr({PDF_URL: self.original(PDF), HTML_URL: self.original(HTML)}, registo_em=None)
        self.assertEqual(self.tabelas(), [])
        self.assertFalse((self.raiz / reconferir.REGISTO).exists())

    def test_planta_uma_volta_parada_por_um_erro_nao_acrescenta(self):
        with self.assertRaises(RuntimeError):
            self.correr({PDF_URL: RuntimeError("the disk is full"), HTML_URL: self.original(HTML)})
        self.assertFalse((self.raiz / reconferir.REGISTO).exists())

    def test_o_comando_so_regista_uma_volta_inteira(self):
        visto = {}

        def falso(caminhos, loja, oficina, textos, **kw):
            visto["registo_em"] = kw.get("registo_em")
            return 0, Path("relatorio.json")

        ambiente = {"OEDP_FONTES": str(self.loja), "OEDP_OFICINA": str(self.oficina)}
        with mock.patch.dict(os.environ, ambiente), mock.patch.object(reconferir, "reconferir", falso), \
                mock.patch.object(reconferir, "pecas_publicadas", lambda raiz: [self.p.peca]):
            cli.cmd_reconferir(argparse.Namespace(pecas=[str(self.p.peca)], so_relatar=True))
            self.assertIsNone(visto["registo_em"])
            cli.cmd_reconferir(argparse.Namespace(pecas=[], so_relatar=True))
            self.assertEqual(visto["registo_em"], REPO)

    def test_a_forma_do_registo(self):
        bom = ('[[reconferencia]]\nem = "2026-11-22T06:00:00Z"\npecas = 1\nexcertos = 7\nfalhados = 0\nretiradas = []\n'
               'so_relatar = false\n')
        self.assertEqual(reconferir.erros_do_registo(tomllib.loads(bom)), [])
        for antes, depois, motivo in (("falhados = 0", "falhados = 8", "falhados 8 is above excertos 7"),
                                      ("pecas = 1", 'pecas = "1"', "field pecas must be a whole number of 0 or more"),
                                      ("pecas = 1", "pecas = -1", "field pecas must be a whole number of 0 or more"),
                                      ("so_relatar = false\n", "", "lacks the field so_relatar"),
                                      ("retiradas = []", 'retiradas = ["Peça"]', "retiradas must list piece ids"),
                                      ('em = "2026-11-22T06:00:00Z"', 'em = "2026-11-31T06:00:00Z"', "is not a real date"),
                                      ("so_relatar = false\n", "so_relatar = false\nnota = \"x\"\n", "field nota is not in this record")):
            erros = reconferir.erros_do_registo(tomllib.loads(bom.replace(antes, depois)))
            self.assertTrue(any(motivo in e for e in erros), (motivo, erros))
        (self.raiz / reconferir.REGISTO).write_text(bom.replace("falhados = 0", "falhados = 8"), encoding="utf-8")
        _, erros = build.contexto(REPO, self.raiz, [])
        self.assertTrue(any("falhados 8 is above excertos 7" in e for e in erros), erros)

    def test_fora_da_impressao_do_codigo(self):
        self.assertFalse(codigo.e_codigo("reconferencias.toml"))
        self.assertTrue(codigo.e_codigo("oedp/reconferir.py"))
        with mock.patch.object(codigo, "EXCLUIDOS_FICHEIROS", codigo.EXCLUIDOS_FICHEIROS - {"reconferencias.toml"}):
            self.assertTrue(codigo.e_codigo("reconferencias.toml"))  # the plant: a weekly run would change the code's fingerprint


class H_ORegistoSoCresce(unittest.TestCase):
    """A repository whose main holds two runs; the branch cuts one."""

    def setUp(self):
        self.repo = git_temporario(self)
        self.f = self.repo / reconferir.REGISTO
        self.uma = '\n[[reconferencia]]\nem = "2026-11-22T06:00:00Z"\npecas = 1\nexcertos = 7\nfalhados = 0\nretiradas = []\nso_relatar = false\n'
        self.duas = self.uma + self.uma.replace("2026-11-22", "2026-11-29")
        self.f.write_text(self.duas, encoding="utf-8")
        commit(self.repo, reconferir.REGISTO)

    def test_o_que_cresce_passa(self):
        self.f.write_text(self.duas + self.uma.replace("2026-11-22", "2026-12-06"), encoding="utf-8")
        self.assertEqual(julgados.historia(self.repo, self.f), [])

    def test_planta_uma_tabela_tirada_ou_mudada(self):
        for agora in (self.uma, self.duas.replace("excertos = 7", "excertos = 6", 1)):
            self.f.write_text(agora, encoding="utf-8")
            self.assertEqual(julgados.historia(self.repo, self.f),
                             ["reconferencias.toml: the record on main is not the beginning of the record now: a table was removed or changed"])

    def test_falha_onde_os_outros_registos_falham(self):
        """In the build's context, a cut record joins the judgment of the reader's text outside pieces (check 4),
        as a cut textos.registo.toml does."""
        self.f.write_text(self.uma, encoding="utf-8")
        chamadas = []
        original = julgados.historia

        def espia(repo, caminho):
            chamadas.append(Path(caminho).name)
            return original(self.repo, self.f) if Path(caminho).name == reconferir.REGISTO else original(repo, caminho)

        with mock.patch.object(julgados, "historia", espia):
            ctx, _ = build.contexto(REPO, self.repo, [])
        self.assertIn(reconferir.REGISTO, chamadas)
        self.assertIn("reconferencias.toml: the record on main is not the beginning of the record now: a table was removed or changed",
                      ctx.julgamento)


# --------------------------------------------------------------------------- C. the browser test's input-only page


class C_APaginaSoDeEntrada(unittest.TestCase):
    """The second page of the browser test (navegador, proof 5), built without a browser."""

    def test_a_linha_so_de_entrada_vem_depois_e_volta_a_conta(self):
        c = ensaio.construir_ensaio_so_entrada(pasta_temporaria(self, "oedp-so-entrada-"))
        self.assertTrue(c.ok, c.mensagens)
        html = (c.estatica / "pecas" / ensaio.PECA_ID / "index.html").read_text(encoding="utf-8")
        texto = re.search(r'<div class="texto">.*?</div>', html, re.S).group(0)
        self.assertNotIn("#r-indice_anterior", texto)
        ordem = re.findall(r'<span class="ancora" id="r-([a-z_]+)"></span>', html)
        self.assertEqual(ordem[-1], "indice_anterior")
        self.assertIn('<a href="#r-indice_anterior">102,3</a>', html)
        self.assertIn('<p class="voltar"><a href="#r-diferenca">Voltar ao texto</a></p></details>', html)
        self.assertEqual(build.ligacoes_partidas(c.estatica), [])

    def test_planta_uma_peca_de_ensaio_que_mudou(self):
        with mock.patch.object(ensaio, "SO_ENTRADA", ("uma frase que a peça não tem", "")):
            with self.assertRaises(ValueError):
                ensaio.construir_ensaio_so_entrada(pasta_temporaria(self, "oedp-so-entrada-"))


# --------------------------------------------------------------------------- I. what a piece cost


def leitura_json(pasta: Path, nome: str, **campos):
    (pasta / "leituras" / "2026-11-16-peca-de-ensaio" / nome).mkdir(parents=True)
    (pasta / "leituras" / "2026-11-16-peca-de-ensaio" / nome / "leitura.json").write_text(json.dumps(campos), encoding="utf-8")


class I_OCusto(unittest.TestCase):
    def setUp(self):
        self.oficina = pasta_temporaria(self, "oedp-oficina-")
        leitura_json(self.oficina, "juiz-1", lugar="juiz", inicio="2026-11-16T10:00:00Z", tokens=60733,
                     impressao="e669aa751d4354e1018d215270eb145410cabb62107e7c932fa19a902a44212e")
        leitura_json(self.oficina, "numeros-1", lugar="numeros", inicio="2026-11-16T08:45:00Z", tokens=1000,
                     impressao="0" * 64)  # another fingerprint: not this reading
        leitura_json(self.oficina, "justica-1", lugar="justica", inicio="2026-11-16T10:00:00Z",
                     impressao="e669aa751d4354e1018d215270eb145410cabb62107e7c932fa19a902a44212e")

    def custo(self, trocas=(), acrescentar=""):
        p = Plantada(list(trocas))
        self.addCleanup(p.apagar)
        if acrescentar:
            with open(p.peca, "a", encoding="utf-8") as f:
                f.write(acrescentar)
        return custo.custo(ler(p.peca), self.oficina), p

    def test_linhas_e_totais(self):
        dados, _ = self.custo()
        inicios = [r["inicio"] for r in dados["linhas"]]
        self.assertEqual(inicios, sorted(inicios))
        self.assertEqual(len(dados["linhas"]), 11)  # 4 steps, 7 readings
        juiz = next(r for r in dados["linhas"] if r["lugar"] == "juiz")
        self.assertEqual((juiz["tokens"], juiz["oficina"], juiz["minutos"], juiz["plantas"], juiz["veredicto"]),
                         (60733, "juiz-1", "25.0", "3 of 3", "passa"))
        numeros = next(r for r in dados["linhas"] if r["lugar"] == "numeros")
        self.assertIsNone(numeros["tokens"])  # its leitura.json is on another fingerprint
        t = dados["totais"]
        self.assertEqual((t["decorrido_minutos"], t["minutos_de_passos"], t["minutos_de_leituras"]), ("250.0", "85.0", "89.0"))
        self.assertEqual((t["tokens_por_familia"], t["leituras_sem_tokens_por_familia"]), ({"openai": 60733}, {"openai": 6}))
        self.assertEqual((t["reportagens_depois_da_escrita"], t["leituras_numeros_depois_da_escrita"]), (0, 0))
        self.assertIn("tokens by family: openai: 60733 tokens (6 readings with none known)", custo.texto(dados))

    def test_planta_reportagem_e_numeros_depois_da_escrita(self):
        mais = ('\n[[passo]]\nnome = "reportagem"\nlugar = "reporter"\nfamilia = "anthropic"\nmodelo = "m"\n'
                'inicio = "2026-11-16T12:20:00Z"\nfim = "2026-11-16T12:30:00Z"\n'
                '\n[[leitura]]\nlugar = "numeros"\nfamilia = "openai"\nmodelo = "m"\ninicio = "2026-11-16T12:31:00Z"\n'
                'fim = "2026-11-16T12:40:00Z"\nimpressao = "' + "1" * 64 + '"\nplantas_postas = 1\nplantas_apanhadas = 1\n'
                'achados = 0\nadotados = 0\nveredicto = "passa"\n')
        dados, _ = self.custo(acrescentar=mais)
        t = dados["totais"]
        self.assertEqual((t["reportagens_depois_da_escrita"], t["leituras_numeros_depois_da_escrita"]), (1, 1))
        self.assertEqual(t["decorrido_minutos"], "280.0")

    def test_nao_escreve_nada(self):
        antes = {f: f.read_bytes() for f in self.oficina.rglob("*") if f.is_file()}
        dados, p = self.custo()
        peca_antes = p.peca.read_bytes()
        with mock.patch.dict(os.environ, {"OEDP_OFICINA": str(self.oficina)}):
            with mock.patch("builtins.print"):
                self.assertEqual(cli.cmd_custo(argparse.Namespace(peca=str(p.peca), json=True)), 0)
        self.assertEqual({f: f.read_bytes() for f in self.oficina.rglob("*") if f.is_file()}, antes)
        self.assertEqual(p.peca.read_bytes(), peca_antes)

    def test_sem_oficina(self):
        dados = custo.custo(ler(Plantada([]).peca), None)
        self.assertEqual(dados["totais"]["tokens_por_familia"], {})
        self.assertIn("(OEDP_OFICINA not set: no tokens read)", custo.texto(dados))


# --------------------------------------------------------------------------- J. the statistics office's releases


def item(titulo, periodo, data, boui):
    return (f'<div class="destaque_item"><div class="container"><div class="div_dst_lst_title">'
            f'<div class="linkdestaques"><a title="{titulo} (Ver detalhe)" class="linkdestaques" '
            f'href="/xportal/xmain?xpid=INE&xpgid=ine_destaques&amp;DESTAQUESdest_boui={boui}&amp;DESTAQUESmodo=2">{titulo}</a>\n'
            f'   - {periodo}\n</div><br>\n<div class="datadestaques">{data}<br><br></div></div>'
            f'<div class="div_dir_files"><a title="Download do documento" href="/ngt_server/x.jsp?b={boui}">PDF</a></div>'
            f'</div><div class="linha_cinzenta"></div></div>')


# A page written here in the structure of the real one (measured on 15 November 2026), with invented releases.
PAGINA = ("<!doctype html><html><head><title>Ensaio</title></head><body><div id=\"destaques_lista\">"
          + item("Um índice de ensaio aumentou 1,5%", "3.º Trimestre de 2026", "12 de novembro de 2026", 111)
          + item("Outro índice de ensaio diminuiu 2,2%", "Outubro de 2026", "13 de novembro de 2026", 222)
          + item("Uma série de ensaio antiga", "2025", "1 de novembro de 2026", 333)
          + item("Um destaque sem data", "2026", "", 444)
          + "</div></body></html>").encode("utf-8")
HOJE = dt.date(2026, 11, 15)


class J_AsDivulgacoes(unittest.TestCase):
    def test_le_a_pagina(self):
        lidas = divulgacoes.ler(PAGINA)
        self.assertEqual([(d.data, d.titulo) for d in lidas],
                         [("2026-11-13", "Outro índice de ensaio diminuiu 2,2% - Outubro de 2026"),
                          ("2026-11-12", "Um índice de ensaio aumentou 1,5% - 3.º Trimestre de 2026"),
                          ("2026-11-01", "Uma série de ensaio antiga - 2025")])
        self.assertEqual(lidas[0].endereco, "https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=222&DESTAQUESmodo=2")

    def test_os_ultimos_dias(self):
        linhas = []
        self.assertEqual(divulgacoes.correr(PAGINA, 7, False, HOJE, linhas.append), 0)
        self.assertEqual([l.split("  ")[0] for l in linhas], ["2026-11-13", "2026-11-12"])
        linhas = []
        divulgacoes.correr(PAGINA, 15, False, HOJE, linhas.append)
        self.assertEqual(len(linhas), 3)
        linhas = []
        divulgacoes.correr(PAGINA, 3, True, HOJE, linhas.append)
        dados = json.loads(linhas[0])
        self.assertEqual([d["data"] for d in dados["divulgacoes"]], ["2026-11-13"])

    def test_nenhuma_nos_ultimos_dias_diz_qual_e_a_ultima(self):
        linhas = []
        self.assertEqual(divulgacoes.correr(PAGINA, 1, False, HOJE, linhas.append), 0)
        self.assertEqual(linhas, ["no release of the statistics office in the last 1 days (to 2026-11-15); the latest on its page is of "
                                  "2026-11-13: Outro índice de ensaio diminuiu 2,2% - Outubro de 2026"])

    def test_planta_uma_pagina_que_mudou_de_forma(self):
        linhas = []
        mudada = PAGINA.replace(b'class="datadestaques"', b'class="data-nova"')
        self.assertEqual(divulgacoes.correr(mudada, 7, False, HOJE, linhas.append), 1)
        self.assertIn("holds no release this command can read", linhas[0])
        linhas = []
        self.assertEqual(divulgacoes.correr(b"<html><body>Erro</body></html>", 7, True, HOJE, linhas.append), 1)
        self.assertNotIn("[]", linhas[0])

    def transporte(self, respostas, pedidos):
        def t(url, destino, metodo="GET", endereco=None, **kw):
            pedidos.append((metodo, url, str(destino.parent)))
            http, corpo = respostas[(metodo, url)]
            Path(destino).write_bytes(corpo)
            return fontes.Resposta(0, http, url, "text/html", len(corpo), "", "")
        return t

    def test_le_uma_pagina_sem_guardar_nada(self):
        pedidos = []
        respostas = {("GET", "https://www.ine.pt/robots.txt"): (404, b""), ("HEAD", divulgacoes.ENDERECO): (200, b""),
                     ("GET", divulgacoes.ENDERECO): (200, PAGINA)}
        dados = divulgacoes.buscar(self.transporte(respostas, pedidos), resolver=lambda h, p: ["93.184.216.34"])
        self.assertEqual(dados, PAGINA)
        self.assertEqual([m for m, _, _ in pedidos], ["GET", "HEAD", "GET"])
        self.assertFalse(any(Path(p).exists() for _, _, p in pedidos))  # the temporary folder is gone

    def test_planta_uma_pagina_que_nao_se_le(self):
        pedidos = []
        respostas = {("GET", "https://www.ine.pt/robots.txt"): (404, b""), ("HEAD", divulgacoes.ENDERECO): (503, b"")}
        with self.assertRaises(divulgacoes.ErroDasDivulgacoes) as e:
            divulgacoes.buscar(self.transporte(respostas, pedidos), resolver=lambda h, p: ["93.184.216.34"])
        self.assertIn("could not be read", str(e.exception))
        with self.assertRaises(divulgacoes.ErroDasDivulgacoes):
            divulgacoes.buscar(self.transporte(respostas, []), resolver=lambda h, p: ["10.0.0.1"])  # not a public address

    def test_o_comando_le_uma_copia_guardada_a_mao(self):
        f = pasta_temporaria(self, "oedp-pagina-") / "destaques.html"
        f.write_bytes(PAGINA)
        with mock.patch.object(divulgacoes, "buscar", side_effect=AssertionError("no fetch")):
            saida = io.StringIO()
            with contextlib.redirect_stdout(saida), contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(cli.cmd_divulgacoes(argparse.Namespace(dias=400, json=False, de=str(f))), 0)
                self.assertEqual(cli.cmd_divulgacoes(argparse.Namespace(dias=0, json=False, de=str(f))), 2)
            self.assertEqual(len(saida.getvalue().splitlines()), 3)


# --------------------------------------------------------------------------- K. the numbered copy does not number the label


class K_ORotuloNaoENumerado(unittest.TestCase):
    def test_a_primeira_linha_diz_o_rotulo_e_o_titulo_e_a_frase_1(self):
        texto = leituras.texto_numerado_da_peca(Plantada([]).peca.read_bytes())
        primeira, resto = texto.split("\n\n", 1)
        self.assertEqual(primeira, "(Above the title the page prints the label of the kind of piece, «Diário». "
                                   "It is not a sentence of the text, and is not numbered.)")
        self.assertTrue(resto.startswith("[1] Peça de ensaio com números inventados"))
        self.assertEqual(numerado.lista(texto)[0][:17], "Peça de ensaio co")

    def test_planta_o_rotulo_como_frase_1(self):
        antiga = numerado.blocos_da_peca
        with mock.patch.object(numerado, "blocos_da_peca", lambda p, c: [c.t("tipo_" + p.cabeca["tipo"])] + antiga(p, c)):
            texto = leituras.texto_numerado_da_peca(Plantada([]).peca.read_bytes())
        self.assertEqual(numerado.lista(texto)[0], "Diário")

    def test_as_leituras_acham_as_frases_que_um_achado_nomeia(self):
        antes = leituras.texto_numerado_da_peca(Plantada([]).peca.read_bytes())
        p = Plantada([("uma subida de]{diferenca}", "uma descida de]{diferenca}")])
        depois = leituras.texto_numerado_da_peca(p.peca.read_bytes())
        p.apagar()
        self.assertEqual(leituras.lugares_no_texto(antes, depois), ["frase 7"])
        self.assertIn("uma descida de 2,4 pontos", numerado.lista(depois)[6])


if __name__ == "__main__":
    unittest.main()
