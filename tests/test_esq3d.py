"""ESQ3b (blocos/esq3/ORDEM-3b.md), items A to G: what the designer found on the rebuilt page.
Each rule is read by a checker, on the real output and on a plant that it must refuse."""
from __future__ import annotations

import argparse
import contextlib
import io
import json
import re
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import __main__ as cli
from oedp import construir as build
from oedp import paginas
from tests.apoio import LOJA, REPO, Plantada
from tests.test_esq3 import CSS, linha_valor, marcado, pagina_plantada, recibo, regras, texto

NB = "\u00a0"
MENOS = "\u2212"
CTX = paginas.Contexto(textos={"r_excerto": "Excerto"})

LINHA_DE_QUADRO = [("excerto = '''Total de ensaio: 1 234 567 euros'''",
                    "excerto = '''Total 2025 2.39 1.5 2026 3.04 3.3 3.61 3.8 Total de ensaio: 1 234 567 euros'''")]


def digitos_colados(fragmento: str) -> list[str]:
    """Every place in the excerpts of a page where two digits are glued by a no-break space."""
    return [m.group(0) for b in re.findall(r'<blockquote class="excerto">(.*?)</blockquote>', fragmento, re.S)
            for m in re.finditer(r"\d[\u00a0\u202f]\d", b)]


class A_NadaColadoNoExcertoAlemDaFigura(unittest.TestCase):
    def test_uma_linha_de_quadro_so_tem_espacos_comuns(self):
        _, html, _ = pagina_plantada(self, LINHA_DE_QUADRO)
        self.assertIn("Total 2025 2.39 1.5 2026 3.04 3.3 3.61 3.8 Total de ensaio: <mark>1 234 567</mark> euros", recibo(html, "total"))
        self.assertEqual(digitos_colados(html), [])

    def test_planta_a_regra_retirada(self):
        antiga = lambda t: paginas._PAGINA.sub(r"\1" + NB, re.sub(r"(?<=\d) (?=\d)", NB, t))
        with mock.patch.object(paginas, "sem_quebra_na_fonte", antiga):
            _, html, _ = pagina_plantada(self, LINHA_DE_QUADRO)
        self.assertIn(f"2025{NB}2.39", recibo(html, "total"))
        self.assertGreater(len(digitos_colados(html)), 5)

    def test_a_marca_nao_parte(self):
        self.assertIn("white-space: nowrap", dict(regras(CSS))[".excerto mark"])
        plantado = CSS.replace("text-underline-offset: 3px; white-space: nowrap; }", "text-underline-offset: 3px; }")
        self.assertNotIn("white-space: nowrap", dict(regras(plantado))[".excerto mark"])


class D_AMarcaLevaOSinal(unittest.TestCase):
    def test_um_valor_negativo_numa_linha_de_quadro(self):
        excerto = "Information and communication 2026 3.69 -0.18 -3.88 -2.14 -0.03"
        self.assertEqual(marcado(linha_valor(excerto, "-2.14")), "-2.14")
        self.assertEqual(marcado(linha_valor(excerto, "-0.03")), "-0.03")
        self.assertEqual(marcado(linha_valor("a taxa foi de - 2,1 %", "-2.1")), "- 2,1")
        self.assertEqual(marcado(linha_valor("a taxa foi de \u22122,1 %", "-2.1")), "\u22122,1")
        self.assertEqual(marcado(linha_valor("o índice caiu menos 2,1 %", "-2.1")), "menos 2,1")
        html = paginas._excerto(CTX, linha_valor(excerto, "-2.14"))
        self.assertIn("-3.88 <mark>-2.14</mark> -0.03", html)

    def test_um_valor_positivo_depois_de_uma_palavra_com_hifen(self):
        self.assertEqual(marcado(linha_valor("a relação custo-benefício 3,5 melhorou", "3.5")), "3,5")
        self.assertEqual(marcado(linha_valor("pelo menos 2,1 %", "2.1")), "2,1")

    def test_planta_a_marca_sem_o_sinal(self):
        """The marked place as check 2 finds it, the number alone: what ESQ3 marked."""
        linha = linha_valor("2026 3.69 -0.18 -3.88 -2.14 -0.03", "-2.14")
        par = paginas.fontes.normalizar_com_mapa(linha["excerto"])
        a, b = paginas.numeros.ocorrencias(par[0], "-2.14")[0]
        self.assertEqual(linha["excerto"][par[1][a][0] : par[1][b - 1][1]], "2.14")
        self.assertNotEqual(marcado(linha), "2.14")


NEGATIVA = [('valor = "104.7"', 'valor = "-1.53"'), ('mostra = "104,7 pontos"', 'mostra = "-1,53 pontos percentuais"'),
            ('calculo = "round ( indice - indice_anterior , 1 )"\nvalor = "2.4"', 'calculo = "round ( indice - indice_anterior , 2 )"\nvalor = "-103.83"'),
            ('mostra = "2,4 pontos"', 'mostra = "-103,83 pontos"')]


class E_OSinalMenosVerdadeiro(unittest.TestCase):
    def test_no_texto_no_resumo_e_na_conta(self):
        _, html, _ = pagina_plantada(self, NEGATIVA)
        corpo = re.search(r'<div class="texto">.*?</div>', html, re.S).group(0)
        self.assertIn(f">{MENOS}1,53 pontos percentuais</a>", corpo)
        self.assertIn(f'<span class="figura">{MENOS}1,53 pontos percentuais</span>', recibo(html, "indice"))
        self.assertIn(f"({MENOS}1,53) {MENOS} 102,3", texto(recibo(html, "diferenca")))
        self.assertIn(f'<span class="figura">{MENOS}103,83{NB}pontos</span>', recibo(html, "diferenca"))
        self.assertIn(f"subiu para {MENOS}1,53 pontos percentuais", html)  # the title, in <title> and <h1>
        self.assertNotRegex(texto(html), r"(?<![\w-])-1,53")

    def test_um_hifen_dentro_de_palavras_fica(self):
        self.assertEqual(paginas.mostra_impressa({"mostra": "pós-2020 3 %"}), "pós-2020 3 %")
        self.assertEqual(paginas.mostra_impressa({"mostra": "-meio ponto"}), "-meio ponto")
        self.assertEqual(paginas.mostra_impressa({"mostra": "- 4 %"}), f"{MENOS} 4 %")

    def test_planta_o_hifen_impresso(self):
        with mock.patch.object(paginas, "mostra_impressa", lambda l: str(l.get("mostra", ""))):
            _, html, _ = pagina_plantada(self, NEGATIVA)
        self.assertRegex(texto(html), r"(?<![\w-])-1,53")

    def test_o_ficheiro_da_peca_nao_muda(self):
        p = Plantada(NEGATIVA)
        self.addCleanup(p.apagar)
        antes = p.peca.read_bytes()
        saida = Path(tempfile.mkdtemp(prefix="oedp-esq3d-"))
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA, conferir_antes=False)
        self.assertTrue(c.ok, c.mensagens)
        self.assertEqual(p.peca.read_bytes(), antes)
        self.assertIn(b'mostra = "-1,53 pontos percentuais"', antes)
        self.assertIn(f"{MENOS}1,53", (c.estatica / "pecas" / "2026-11-16-peca-de-ensaio" / "index.html").read_text(encoding="utf-8"))


MEDE_COM_PAGINA = [('mede = "Índice de ensaio, inventado para os ensaios"\npopulacao = "Nenhuma: é um índice de ensaio"\nperiodo = "Terceiro',
                    'mede = "Índice de ensaio, inventado para os ensaios (p. 10)"\npopulacao = "Nenhuma: é um índice de ensaio"\nperiodo = "Terceiro')]


class F_OPComONumeroEmTodosOsCampos(unittest.TestCase):
    def test_no_mede(self):
        _, html, _ = pagina_plantada(self, MEDE_COM_PAGINA)
        r = recibo(html, "indice")
        self.assertIn(f"<dt>O que mede</dt><dd>Índice de ensaio, inventado para os ensaios (p.{NB}10)</dd>", r)
        self.assertIn(f'<span class="mede">Índice de ensaio, inventado para os ensaios (p.{NB}10)</span>', r)

    def test_planta_o_mede_sem_a_regra(self):
        with mock.patch.object(paginas, "_campo", lambda t: paginas.e(str(t))):
            _, html, _ = pagina_plantada(self, MEDE_COM_PAGINA)
        self.assertIn("(p. 10)", recibo(html, "indice"))


class G_AsEntradasDaContaParecemLigacoesARecibos(unittest.TestCase):
    def test_sublinhado_pontilhado(self):
        regra = dict(regras(CSS))[".recibo dd.conta a"]
        self.assertIn("text-decoration-style: dotted", regra)
        self.assertEqual(dict(regras(CSS))["a.ref, a.ligada"], regra)  # the same look as every other link to a receipt
        _, html, _ = pagina_plantada(self, [])
        conta = re.search(r'<dd class="conta">.*?</dd>', recibo(html, "diferenca"), re.S).group(0)
        self.assertEqual(len(re.findall(r'<a href="#r-', conta)), 4)  # two in the arithmetic, two in the list

    def test_planta_sem_a_regra(self):
        plantado = CSS.replace(".recibo dd.conta a {", ".recibo dd.abrir-x a {")
        self.assertNotIn(".recibo dd.conta a", dict(regras(plantado)))


class B_AContaDizOQueMede(unittest.TestCase):
    def test_o_mede_por_extenso_primeiro(self):
        _, html, _ = pagina_plantada(self, [])
        dl = re.search(r"<dl>(.*?)</dl>", recibo(html, "diferenca"), re.S).group(1)
        self.assertTrue(dl.startswith("<dt>O que mede</dt><dd>Diferença do índice de ensaio entre dois trimestres</dd><dt>Conta</dt>"), dl[:120])

    def test_sem_mede_nao_ha_linha(self):
        peca, _, ctx = pagina_plantada(self, [])
        peca.linhas["diferenca"]["mede"] = ""
        self.assertNotIn("O que mede", paginas._recibo(ctx, peca, "diferenca", {"diferenca"}, ["diferenca"]))

    def test_planta_a_conta_sem_o_mede(self):
        _, html, _ = pagina_plantada(self, [])
        plantado = html.replace("<dt>O que mede</dt><dd>Diferença do índice de ensaio entre dois trimestres</dd>", "", 1)
        dl = re.search(r"<dl>(.*?)</dl>", recibo(plantado, "diferenca"), re.S).group(1)
        self.assertTrue(dl.startswith("<dt>Conta</dt>"))


class C_OResumoNumTelefoneEAberto(unittest.TestCase):
    def regra_no_telefone(self, css, seletor):
        bloco = css.split("@media (max-width: 599px) {", 1)[1].split("\n}\n", 1)[0]
        return dict(regras(bloco)).get(seletor, "")

    def test_duas_linhas_no_telefone(self):
        mede = self.regra_no_telefone(CSS, ".recibo > summary > .mede")
        for d in ("-webkit-line-clamp: 2", "line-clamp: 2", "display: -webkit-box", "-webkit-box-orient: vertical",
                  "overflow: hidden", "white-space: normal", "grid-row: 2"):
            self.assertIn(d, mede)
        self.assertIn("grid-row: 1", self.regra_no_telefone(CSS, ".recibo > summary > .figura"))
        self.assertIn("grid-column: 2; grid-row: 1", self.regra_no_telefone(CSS, ".recibo > summary::after"))

    def test_aberto_so_a_figura(self):
        self.assertIn("display: none", dict(regras(CSS))[".recibo[open] > summary > .mede"])

    def test_planta_sem_o_corte_em_duas_linhas(self):
        plantado = CSS.replace("    -webkit-line-clamp: 2;\n    line-clamp: 2;\n", "")
        self.assertNotIn("line-clamp", self.regra_no_telefone(plantado, ".recibo > summary > .mede"))


if __name__ == "__main__":
    unittest.main()


# --------------------------------------------------------------------------- I. an adopted finding stops a pass

from oedp import leituras  # noqa: E402
from tests.test_esq2a import ComLeitura, achado  # noqa: E402


class I_UmAchadoAdotadoNaoPassa(ComLeitura):
    """The juiz's reading of the test piece, with one plant caught and one real finding at corrigir."""

    def pontuar(self, lugar, decisao):
        pasta, _ = self.lida(lugar=lugar, achados=[achado("frase 7", problema="it rose"), achado("frase 2", "corrigir", "a real one")])
        return leituras.pontuar(pasta, self.decisoes(decisao), imprimir=lambda *a: None)

    def test_planta_um_achado_corrigir_adotado(self):
        p = self.pontuar("juiz", '[[decisao]]\nachado = 2\ndecisao = "adotado"\n')
        self.assertEqual((p["veredicto"], p["plantas_apanhadas"], p["plantas_postas"], p["adotados"]), ("nao_passa", 1, 1, 1))
        self.assertIn("real findings adopted: [2] (what was read is about to change; the pass belongs to what is read after the repair)",
                      p["razoes"])

    def test_o_mesmo_recusado_passa(self):
        p = self.pontuar("juiz", '[[decisao]]\nachado = 2\ndecisao = "recusado"\nrazao = "the text says it already"\n')
        self.assertEqual((p["veredicto"], p["adotados"]), ("passa", 0))

    def test_um_lugar_da_familia_que_produziu_continua_a_levantar(self):
        pasta, _ = self.lida(lugar="especialista", plantas=None, achados=[achado("frase 2", "corrigir", "a real one")])
        p = leituras.pontuar(pasta, self.decisoes('[[decisao]]\nachado = 1\ndecisao = "adotado"\n'), modelo="claude-de-ensaio",
                             inicio="2026-11-15T01:00:00Z", fim="2026-11-15T01:10:00Z", imprimir=lambda *a: None)
        self.assertEqual((p["veredicto"], p["adotados"]), ("levanta", 1))


# --------------------------------------------------------------------------- H. custo reads the launcher's log

from oedp import custo  # noqa: E402
from oedp.peca import ler  # noqa: E402
from tests.test_esq3b import leitura_json  # noqa: E402

JUIZ = dict(lugar="juiz", inicio="2026-11-16T10:00:00Z", impressao="e669aa751d4354e1018d215270eb145410cabb62107e7c932fa19a902a44212e")


class H_OCustoLeORegistoDoLancador(unittest.TestCase):
    def custo(self, registo: str | None, **mais):
        oficina = Path(tempfile.mkdtemp(prefix="oedp-oficina-"))
        self.addCleanup(shutil.rmtree, oficina, True)
        leitura_json(oficina, "juiz-1", **JUIZ, **mais)
        if registo is not None:
            (oficina / "leituras" / "2026-11-16-peca-de-ensaio" / "juiz-1" / "LEITURA.md.eventos.log").write_text(registo, encoding="utf-8")
        p = Plantada([])
        self.addCleanup(p.apagar)
        dados = custo.custo(ler(p.peca), oficina)
        return next(r for r in dados["linhas"] if r["lugar"] == "juiz" and r["inicio"] == JUIZ["inicio"]), dados

    def test_do_registo_quando_o_json_nao_tem(self):
        juiz, dados = self.custo("...\ntokens used\n60,733\n")
        self.assertEqual((juiz["tokens"], juiz["tokens_de"]), (60733, "LEITURA.md.eventos.log"))
        self.assertEqual(dados["totais"]["tokens_lidos_de"], {"LEITURA.md.eventos.log": 1})
        self.assertIn("60733 (log)", custo.texto(dados))
        self.assertIn("tokens read from: 1 readings' LEITURA.md.eventos.log", custo.texto(dados))

    def test_o_json_primeiro(self):
        juiz, _ = self.custo("tokens used\n60,733\n", tokens=100)
        self.assertEqual((juiz["tokens"], juiz["tokens_de"]), (100, "leitura.json"))

    def test_planta_um_registo_sem_numero(self):
        for registo in ("tokens used\nnot available\n", "nothing here\n", None):
            juiz, dados = self.custo(registo)
            self.assertEqual((juiz["tokens"], juiz["tokens_de"]), (None, None), registo)
            self.assertEqual(dados["totais"]["tokens_por_familia"], {})


# --------------------------------------------------------------------------- J. divulgacoes --proximas

import datetime as dt  # noqa: E402

from oedp import divulgacoes  # noqa: E402


def linha_do_calendario(titulo, periodo, data, nota=""):
    return (f'<tr class="tb_ine_tr_odd"><td><span class="datadestaques">{titulo}\n   </span></td>'
            f'<td class="caldst_texto">\n&nbsp;{periodo}\n</td><td class="caldst_texto" colspan="2">\n{data}</td>'
            f'<!--  <td class="caldst_texto"></td> --><td class="caldst_texto_just">\n'
            + (f'<p style="text-align: left;">{nota}</p>\n<p></p>' if nota else "&nbsp;") + "\n</td></tr>")


# A page written here in the structure of the real calendar (measured on 15 November 2026), with invented rows.
CALENDARIO = ('<!doctype html><html><body><table class="institu"><tbody><tr><td>Calendário</td></tr></tbody></table>'
              '<table cellpadding="0" class="tb_ine" summary="Destaquesdestaques"><caption>Calendário</caption><thead><tr>'
              '<th class="calendario1">Destaques</th><th class="calendario2">Período</th><th colspan="2">Data</th>'
              '<th class="calendario4">Observações</th></tr></thead><tbody>'
              + linha_do_calendario("Um inquérito de ensaio", "2025", "20 de novembro de 2026")
              + linha_do_calendario("Um índice de ensaio", "Outubro de 2026", "17 de novembro de 2026")
              + linha_do_calendario("Umas contas de ensaio", "2025", "18 de novembro de 2026",
                                    "Adiado para 18 de dezembro, por uma razão de ensaio. (09-11-2026)")
              + "</tbody></table></body></html>").encode("utf-8")
HOJE = dt.date(2026, 11, 15)


class J_AsProximas(unittest.TestCase):
    def test_le_o_calendario_por_ordem_com_a_nota(self):
        lidas = divulgacoes.ler_calendario(CALENDARIO)
        self.assertEqual([(d.data, d.titulo, d.periodo, d.nota) for d in lidas],
                         [("2026-11-17", "Um índice de ensaio", "Outubro de 2026", ""),
                          ("2026-11-18", "Umas contas de ensaio", "2025", "Adiado para 18 de dezembro, por uma razão de ensaio. (09-11-2026)"),
                          ("2026-11-20", "Um inquérito de ensaio", "2025", "")])
        linhas = []
        self.assertEqual(divulgacoes.correr_proximas(CALENDARIO, None, False, HOJE, linhas.append), 0)
        self.assertEqual(linhas[1], "2026-11-18  Umas contas de ensaio · 2025  note: Adiado para 18 de dezembro, por uma razão de ensaio. (09-11-2026)")

    def test_os_proximos_dias(self):
        linhas = []
        divulgacoes.correr_proximas(CALENDARIO, 4, False, HOJE, linhas.append)
        self.assertEqual([l[:10] for l in linhas], ["2026-11-17", "2026-11-18"])
        linhas = []
        divulgacoes.correr_proximas(CALENDARIO, 1, True, HOJE, linhas.append)
        self.assertEqual(json.loads(linhas[0])["proximas"], [])

    def test_planta_um_calendario_que_mudou_de_forma(self):
        linhas = []
        self.assertEqual(divulgacoes.correr_proximas(CALENDARIO.replace(b'class="tb_ine"', b'class="outra"'), None, False, HOJE,
                                                     linhas.append), 1)
        self.assertIn("holds no row this command can read", linhas[0])

    def test_planta_a_nota_perdida(self):
        """ESQ3c, item I: a row whose note is not where the head puts it stops the command (the cell made a <th>,
        or taken out), and a row with no date too."""
        sem_quarta = CALENDARIO.replace(b'<td class="caldst_texto_just">', b'<th class="caldst_texto_just">').replace(b"</p>\n<p></p>\n</td>", b"</p>\n<p></p>\n</th>")
        tirada = re.sub(rb'<td class="caldst_texto_just">.*?</td>', b"", CALENDARIO, count=1, flags=re.S)
        sem_data = CALENDARIO.replace(b"\n20 de novembro de 2026</td>", b"\n</td>")
        for pagina, motivo in ((sem_quarta, "has 3 cells where its head has 4"), (tirada, "has 3 cells where its head has 4"),
                               (sem_data, "has no date")):
            linhas, erros = [], []
            self.assertEqual(divulgacoes.correr_proximas(pagina, None, False, HOJE, linhas.append, erros.append), 1)
            self.assertEqual(linhas, [])
            self.assertTrue(any(motivo in e for e in erros), erros)

    def test_o_comando_le_o_calendario(self):
        f = Path(tempfile.mkdtemp(prefix="oedp-calendario-"))
        self.addCleanup(shutil.rmtree, f, True)
        (f / "calendario.html").write_bytes(CALENDARIO)
        pedidos = []
        with mock.patch.object(divulgacoes, "buscar", lambda **kw: pedidos.append(kw) or CALENDARIO):
            saida = io.StringIO()
            with contextlib.redirect_stdout(saida):
                self.assertEqual(cli.cmd_divulgacoes(argparse.Namespace(dias=None, json=False, de=None, proximas=True)), 0)
                self.assertEqual(cli.cmd_divulgacoes(argparse.Namespace(dias=None, json=False, de=str(f / "calendario.html"), proximas=True)), 0)
        self.assertEqual(pedidos, [{"endereco": divulgacoes.CALENDARIO}])
        self.assertEqual(len(saida.getvalue().splitlines()), 6)
