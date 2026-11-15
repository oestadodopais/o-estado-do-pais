"""ESQ3e (blocos/esq3/ORDEM-3e.md): what the code reader found in the repairs. Each rule is read by
a checker, on the real output and on a plant that it must refuse."""
from __future__ import annotations

import json
import shutil
import tempfile
import tomllib
import unittest
from pathlib import Path
from unittest import mock

from oedp import conferir as conf
from oedp import construir as build
from oedp import codigo, ensaio, fontes, leituras, marca, numeros, reconferir
from oedp.peca import ler
from tests.apoio import REPO, Plantada, loja_fora_do_repositorio
from tests.test_esq2a import ComLeitura, achado
from tests.test_esq3e import arvore_do_repositorio, check1_com

TEXTOS = tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8"))
RAZAO = "is signed by the tests' model name (modelo-de-ensaio), which counts only in a tree assembled for the tests"


def pasta_temporaria(caso, prefixo: str) -> Path:
    p = Path(tempfile.mkdtemp(prefix=prefixo))
    caso.addCleanup(shutil.rmtree, p, True)
    return p


# --------------------------------------------------------------------------- A1. both kinds of table, every kind of record


def so_uma_tabela(texto: str, tabela: str) -> str:
    """A record's text with every table signed by the tests' model name re-signed by another, but for
    the first `[[tabela]]` so signed."""
    partes = texto.split(f'modelo = "{marca.MODELO}"')
    saida, ficou = partes[0], False
    for parte in partes[1:]:
        cabeca = saida[saida.rfind("[[") :]
        manter = not ficou and cabeca.startswith(f"[[{tabela}]]")
        saida += (f'modelo = "{marca.MODELO}"' if manter else 'modelo = "outro-modelo"') + parte
        ficou = ficou or manter
    return saida


class A1_PassoELeituraEmCadaRegisto(unittest.TestCase):
    def test_cada_tipo_de_tabela_em_cada_registo(self):
        for tabela in ("passo", "leitura"):
            arvore = arvore_do_repositorio(self)
            (arvore / "textos.registo.toml").write_text(so_uma_tabela(ensaio.registo_dos_textos((REPO / "textos.toml").read_bytes()), tabela), encoding="utf-8")
            shutil.copy2(REPO / "ensaios" / "paginas" / "metodo.md", arvore / "paginas" / "metodo.md")
            metodo = (arvore / "paginas" / "metodo.md").read_text(encoding="utf-8")
            corte = metodo.index("+++ registo") + len("+++ registo")
            (arvore / "paginas" / "metodo.md").write_text(metodo[:corte] + so_uma_tabela(metodo[corte:], tabela), encoding="utf-8")
            (arvore / codigo.REGISTO).write_text(so_uma_tabela(ensaio.registo_de_ensaio(), tabela), encoding="utf-8")
            ctx, _ = build.contexto(REPO, arvore, [])
            for nome in ("textos.registo.toml", "paginas/metodo.md", codigo.REGISTO):
                self.assertTrue(any(x.startswith(f"{nome}: [[{tabela}]]") and RAZAO in x for x in ctx.ensaio), (tabela, nome, ctx.ensaio))
            p = Plantada([])
            self.addCleanup(p.apagar)
            p.peca.write_text(so_uma_tabela(p.peca.read_text(encoding="utf-8"), tabela), encoding="utf-8")
            (p.pasta / marca.FICHEIRO).unlink()
            r = conf.check5(ler(p.peca))
            self.assertTrue(any(x.startswith(f"2026-11-16-peca-de-ensaio: [[{tabela}]]") for x in r.razoes), (tabela, r.linha()))

    def test_planta_so_as_leituras(self):
        """The reader's plant: the barrier looking at [[leitura]] tables alone lets a step through."""
        original = marca.assinadas

        def so_leituras(tabelas, nome, raiz):
            return [x for x in original(tabelas, nome, raiz) if "[[leitura]]" in x]

        p = Plantada([])
        self.addCleanup(p.apagar)
        p.peca.write_text(so_uma_tabela(p.peca.read_text(encoding="utf-8"), "passo"), encoding="utf-8")
        (p.pasta / marca.FICHEIRO).unlink()
        with mock.patch.object(marca, "assinadas", so_leituras):
            self.assertEqual(conf.assinadas_pelo_ensaio(ler(p.peca)), [])


# --------------------------------------------------------------------------- A2. the re-check honours linha_de_quadro


PDF = "3f9a602b9c8e9f75b8fdd9e63aadddfae0a1776aa4a31241b567946b3add3e89"
HTML = "29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b"


class A2_AReconferenciaLeAsLinhasDeQuadro(unittest.TestCase):
    def setUp(self):
        self.loja = loja_fora_do_repositorio(self)
        self.oficina = pasta_temporaria(self, "oedp-oficina-")
        self.nova = fontes.caminho_da_copia(self.loja, HTML).read_bytes() + b"\nQuadro\n100\n200\n1 617 Euros\n"

    def falham(self, excerto, valor, quadro):
        mais = "" if quadro is None else f"\nlinha_de_quadro = {quadro}"
        p = Plantada([("excerto = '''Total de ensaio: 1 234 567 euros'''\nvalor = \"1234567\"",
                       f"excerto = '''{excerto}'''\nvalor = \"{valor}\"{mais}")])
        self.addCleanup(p.apagar)
        linhas = []
        respostas = {"https://example.org/ensaio/documento.pdf": fontes.caminho_da_copia(self.loja, PDF).read_bytes(),
                     "https://example.org/ensaio/tabela.html": self.nova}
        _, relatorio = reconferir.reconferir([p.peca], self.loja, self.oficina, TEXTOS, retirar=False,
                                             buscar=lambda url, loja: fontes.guardar(loja, respostas[url]), imprimir=linhas.append,
                                             hoje="2026-11-22")
        fonte = next(f for f in json.loads(relatorio.read_text())["fontes"] if f["fonte"] == "tabela_html")
        return "total" in fonte.get("linhas", [])

    def test_nos_dois_sentidos(self):
        self.assertFalse(self.falham("100\n200", "100", "true"))
        self.assertTrue(self.falham("100\n200", "100", None))
        self.assertTrue(self.falham("1 617 Euros", "1617", "true"))
        self.assertFalse(self.falham("1 617 Euros", "1617", None))

    def test_planta_o_campo_lido_como_texto(self):
        """The reader's plant: linha_de_quadro compared with the text "true", so never honoured."""
        original = numeros.contem_figura
        with mock.patch.object(numeros, "contem_figura", lambda t, v, quadro=False: original(t, v, quadro == "true")):
            self.assertTrue(self.falham("100\n200", "100", "true"))  # the sound line would be withdrawn


# --------------------------------------------------------------------------- A3. check 1 knows every alias of its units


UNIDADES_DA_ESPECIFICACAO = {
    "%": "per cent", "por cento": "per cent", "‰": "per mille", "por mil": "per mille",
    "pontos percentuais": "percentage points", "ponto percentual": "percentage points", "p.p.": "percentage points",
    "euros": "euro", "euro": "euro", "€": "euro", "eur": "euro", "dólares": "dollar", "dólar": "dollar", "$": "dollar",
    "usd": "dollar", "libras": "pound", "libra": "pound", "£": "pound", "gbp": "pound",
}


class A3_AsUnidadesDoCheck1(unittest.TestCase):
    def test_por_mil_e_por_cento_nos_dois_sentidos(self):
        for unidade, mostra in (("%", "104,7 por mil"), ("por mil", "104,7 %"), ("por cento", "104,7 ‰")):
            r = check1_com(self, unidade, mostra)
            self.assertEqual(r.estado, conf.FALHOU, (unidade, mostra, r.linha()))

    def test_cada_nome_da_tabela(self):
        outra = {"per cent": "‰", "per mille": "%", "percentage points": "%", "euro": "$", "dollar": "€", "pound": "€"}
        for nome, tipo in UNIDADES_DA_ESPECIFICACAO.items():
            self.assertEqual(numeros.unidade_lida(nome), (nome, tipo), nome)
            r = check1_com(self, outra[tipo], f"104,7 {nome}")
            self.assertEqual(r.estado, conf.FALHOU, (nome, r.linha()))

    def test_planta_um_nome_tirado_da_tabela(self):
        with mock.patch.dict(numeros.UNIDADES, {}, clear=False):
            del numeros.UNIDADES["por mil"]
            r = check1_com(self, "%", "104,7 por mil")
        self.assertEqual(r.estado, conf.PASSOU)  # what the reader found: a tenfold mismatch left to a note


# --------------------------------------------------------------------------- C. every seat that can pass


class C_TodosOsLugaresQuePodemPassar(ComLeitura):
    def pontuar(self, lugar, decisao):
        pasta, _ = self.lida(achados=[achado("frase 7", problema="it rose"), achado("frase 2", "menor", "a small real one")])
        dados = json.loads((pasta / "leitura.json").read_text())
        dados["lugar"] = lugar  # the rule reads the seat only; the package is the juiz's
        (pasta / "leitura.json").write_text(json.dumps(dados))
        return leituras.pontuar(pasta, self.decisoes(decisao), imprimir=lambda *a: None)

    def test_justica_e_oposto(self):
        for lugar in ("justica", "oposto"):
            p = self.pontuar(lugar, '[[decisao]]\nachado = 2\ndecisao = "adotado"\n')
            self.assertEqual((p["veredicto"], p["plantas_apanhadas"], p["adotados"]), ("nao_passa", 1, 1), lugar)
            self.assertTrue(any(r.startswith("real findings adopted: [2]") for r in p["razoes"]), p["razoes"])
            p = self.pontuar(lugar, '[[decisao]]\nachado = 2\ndecisao = "recusado"\nrazao = "not so"\n')
            self.assertEqual((p["veredicto"], p["adotados"]), ("passa", 0), lugar)

    def test_a_regra_nao_le_a_lista_dos_tres(self):
        """The order of ESQ3b named three seats; the rule no longer reads that list, so changing it changes nothing."""
        with mock.patch.object(leituras, "COM_PLANTAS_OBRIGATORIAS", ("numeros", "juiz", "seguranca")):
            p = self.pontuar("justica", '[[decisao]]\nachado = 2\ndecisao = "adotado"\n')
        self.assertEqual(p["veredicto"], "nao_passa")


if __name__ == "__main__":
    unittest.main()


# --------------------------------------------------------------------------- B. a unit before the number


class B_UmaUnidadeAntesDoNumero(unittest.TestCase):
    def test_antes_ou_depois(self):
        for unidade, mostra in (("euros", "$104,7"), ("euros", "$ 104,7"), ("dólares", "€ 104,7"), ("euros", "104,7 $"), ("%", "‰ 104,7")):
            r = check1_com(self, unidade, mostra)
            self.assertEqual(r.estado, conf.FALHOU, (unidade, mostra, r.linha()))
            self.assertTrue(any("prints a unit in" in x for x in r.razoes), r.razoes)
        for unidade, mostra in (("euros", "€ 104,7"), ("euros", "104,7 €"), ("dólares", "$104,7")):
            r = check1_com(self, unidade, mostra)
            self.assertEqual(r.estado, conf.PASSOU, (unidade, mostra, r.linha()))
            self.assertFalse(any("unit mostra prints" in n for n in r.notas), r.notas)

    def test_planta_so_depois_do_numero(self):
        """The reader's case: only the words after the figure were read, so «$104,7» on a line in euros passed."""
        def so_depois(mostra):
            m = numeros.FIGURA.search(mostra)
            return [mostra[m.end():].strip()] if m and mostra[m.end():].strip() else []
        with mock.patch.object(numeros, "unidades_da_mostra", so_depois):
            r = check1_com(self, "euros", "$104,7")
        self.assertEqual(r.estado, conf.PASSOU)


# --------------------------------------------------------------------------- D. a scale word, whatever its case


class D_UmaPalavraDeEscalaEmQualquerCaixa(unittest.TestCase):
    def test_mil_e_mil(self):
        for unidade, mostra in (("Mil euros", "104,7 mil euros"), ("mil euros", "104,7 Mil euros"), ("MIL euros", "104,7 mil euros")):
            r = check1_com(self, unidade, mostra)
            self.assertEqual(r.estado, conf.PASSOU, (unidade, mostra, r.linha()))
        from oedp import paginas
        self.assertEqual(paginas.numero_mostrado({"valor": "104.7", "unidade": "Mil euros", "mostra": "104,7 mil euros"}), ("104,7", False))
        self.assertEqual(paginas.sem_quebra("104,7 Mil euros", True), "104,7 Mil euros")

    def test_planta_a_escala_so_em_minusculas(self):
        import re as re_
        caso = re_.compile(numeros.ESCALA_INICIAL.pattern)  # without re.IGNORECASE
        with mock.patch.object(numeros, "ESCALA_INICIAL", caso):
            r = check1_com(self, "Mil euros", "104,7 mil euros")
        self.assertEqual(r.estado, conf.FALHOU)  # the reader's case: 0.1 expected


# --------------------------------------------------------------------------- F. the places of plants in code


from types import SimpleNamespace  # noqa: E402


class F_AsLinhasDasPlantasNoCodigo(unittest.TestCase):
    def chave_no_fim(self):
        pacote = pasta_temporaria(self, "oedp-pacote-")
        (pacote / "arvore" / "oedp").mkdir(parents=True)
        # the first plant went in at line 2; a later plant put a line before it
        (pacote / "arvore" / "oedp" / "x.py").write_text("um = 1\nnovo = 0\ndois = 3\ntres = 3\n", encoding="utf-8")
        plantas = [{"id": "P1", "antes": "dois = 2\n", "depois": "dois = 3\n"}, {"id": "P2", "antes": "um = 1\n", "depois": "um = 1\nnovo = 0\n"}]
        chave = [{"id": "P1", "ficheiro": "arvore/oedp/x.py", "lugares": ["ficheiro oedp/x.py"], "ficheiro_codigo": "oedp/x.py", "linhas": [2]},
                 {"id": "P2", "ficheiro": "arvore/oedp/x.py", "lugares": ["ficheiro oedp/x.py"], "ficheiro_codigo": "oedp/x.py", "linhas": [1, 2]}]
        return SimpleNamespace(pacote=pacote), plantas, chave

    def test_as_linhas_no_pacote_final(self):
        p, plantas, chave = self.chave_no_fim()
        leituras._lugares_no_fim(p, plantas, chave)
        self.assertEqual([c["linhas"] for c in chave], [[3], [1, 2]])

    def test_um_texto_que_ja_nao_esta_la_e_recusado(self):
        p, plantas, chave = self.chave_no_fim()
        plantas[0]["depois"] = "dois = 4\n"
        with self.assertRaises(leituras.Recusa) as e:
            leituras._lugares_no_fim(p, plantas, chave)
        self.assertIn("P1: its new text is not found exactly once in arvore/oedp/x.py", str(e.exception))


# --------------------------------------------------------------------------- E. a calendar row with too many cells


import re  # noqa: E402

from oedp import divulgacoes  # noqa: E402
from tests.test_esq3d import CALENDARIO, HOJE  # noqa: E402


class E_UmaLinhaComCelulasAMais(unittest.TestCase):
    def test_recusada_e_nomeada(self):
        # the reader's case: an empty fourth cell, and the note «Adiado» in a fifth
        a_mais = re.sub(rb'(<td class="caldst_texto_just">\n<p style="text-align: left;">)', rb'<td class="caldst_texto_just">\n</td>\1',
                        CALENDARIO, count=1)
        self.assertNotEqual(a_mais, CALENDARIO)
        linhas, erros = [], []
        self.assertEqual(divulgacoes.correr_proximas(a_mais, None, False, HOJE, linhas.append, erros.append), 1)
        self.assertEqual(linhas, [])
        self.assertTrue(any("has 5 cells where its head has 4" in e for e in erros), erros)

    def test_planta_so_as_que_tem_menos(self):
        a_mais = re.sub(rb'(<td class="caldst_texto_just">\n<p style="text-align: left;">)', rb'<td class="caldst_texto_just">\n</td>\1',
                        CALENDARIO, count=1)
        p = divulgacoes._Calendario()
        p.feed(a_mais.decode("utf-8"))
        p.close()
        cinco = [c for c in p.linhas if len(c) == 5]
        self.assertEqual(len(cinco), 1)
        self.assertEqual(cinco[0][3], "")  # read as the note, the fourth cell would print the row without «Adiado»
        self.assertTrue(cinco[0][4].startswith("Adiado"))


# --------------------------------------------------------------------------- G. the token marker, exactly


class G_OMarcadorExato(unittest.TestCase):
    def tokens(self, texto):
        f = pasta_temporaria(self, "oedp-log-") / "LEITURA.md.eventos.log"
        f.write_text(texto, encoding="utf-8")
        return leituras.tokens_do_registo(f)

    def test_so_a_linha_exata(self):
        self.assertEqual(self.tokens("tokens used\n100\n tokens used \n999\n"), 100)
        self.assertEqual(self.tokens("tokens used\n100\ntokens used  \n999\n"), 100)
        self.assertEqual(self.tokens("tokens used\n60,733\n"), 60733)

    def test_planta_o_marcador_com_espacos(self):
        """The reader's case: a padded line taken for the marker gave 999."""
        f = pasta_temporaria(self, "oedp-log-") / "x.log"
        f.write_text("tokens used\n100\n tokens used \n999\n", encoding="utf-8")
        linhas = f.read_text(encoding="utf-8").splitlines()
        com_espacos = next(int(linhas[i + 1]) for i in range(len(linhas) - 1, -1, -1) if linhas[i].strip() == "tokens used")
        self.assertEqual(com_espacos, 999)
        self.assertNotEqual(com_espacos, leituras.tokens_do_registo(f))
