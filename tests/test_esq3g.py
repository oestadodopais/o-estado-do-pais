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
