"""ESQ3c (blocos/esq3/ORDEM-3c.md): what the code reader found in the third block. Each rule
is read by a checker, on the real output and on a plant that it must refuse."""
from __future__ import annotations

import json
import re
import shutil
import tempfile
import tomllib
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

from oedp import conferir as conf
from oedp import construir as build
from oedp import forma, leituras, numeros, paginas
from oedp.peca import ler
from tests.apoio import LOJA, REPO, Plantada
from tests.test_esq2a import ComLeitura, achado
from tests.test_esq3 import pagina_plantada, recibo, texto
from tests.test_esq3d import NEGATIVA

NB = " "
MENOS = "−"
TEXTOS = tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8"))


def pasta_temporaria(caso, prefixo: str) -> Path:
    p = Path(tempfile.mkdtemp(prefix=prefixo))
    caso.addCleanup(shutil.rmtree, p, True)
    return p


# --------------------------------------------------------------------------- A. a test for each planted error


class A1_UmAchadoMenorAdotadoNaoPassa(ComLeitura):
    """Every plant caught and one real finding at menor adopted: nao_passa, for each seat whose pass counts."""

    def test_nos_tres_lugares(self):
        for lugar in ("numeros", "juiz", "seguranca"):
            pasta, _ = self.lida(achados=[achado("frase 7", problema="it rose"), achado("frase 2", "menor", "a small real one")])
            dados = json.loads((pasta / "leitura.json").read_text())
            dados["lugar"] = lugar  # the rule reads the seat only; the package is the juiz's
            (pasta / "leitura.json").write_text(json.dumps(dados))
            p = leituras.pontuar(pasta, self.decisoes('[[decisao]]\nachado = 2\ndecisao = "adotado"\n'), imprimir=lambda *a: None)
            self.assertEqual((p["veredicto"], p["plantas_apanhadas"], p["plantas_postas"], p["adotados"]), ("nao_passa", 1, 1, 1), lugar)
            self.assertTrue(any(r.startswith("real findings adopted: [2]") for r in p["razoes"]), (lugar, p["razoes"]))


class A2_UmResultadoNegativoTemOSeuSinal(unittest.TestCase):
    def test_na_conta_construida(self):
        _, html, _ = pagina_plantada(self, NEGATIVA)
        conta = re.search(r'<dd class="conta">(.*?)<ul', recibo(html, "diferenca"), re.S).group(1)
        self.assertTrue(texto(conta).endswith(f"{NB}= {MENOS}103,83 (arredondado a 2 casas decimais)"), texto(conta))


class A3_OsSeisCamposDoLeitor(unittest.TestCase):
    SEIS = ("mede", "populacao", "periodo", "compara", "diz", "onde")  # docs/ESPEC-PECA.md, check 9

    def test_cada_campo_recusa_o_nome_de_uma_linha(self):
        self.assertEqual(set(forma.CAMPOS_DO_LEITOR), set(self.SEIS))
        peca = ler(Plantada([]).peca)
        alvo = {"mede": "indice", "populacao": "indice", "periodo": "indice", "onde": "indice", "compara": "diferenca", "diz": "despacho"}
        for campo in self.SEIS:
            peca2 = ler(Plantada([]).peca)
            peca2.linhas[alvo[campo]][campo] = f"ver a linha indice_anterior ({campo})"
            erros = forma.ids_nos_campos_do_leitor(peca2)
            self.assertTrue(any(f"{campo} holds 'indice_anterior'" in x for x in erros), (campo, erros))
        self.assertEqual(forma.ids_nos_campos_do_leitor(peca), [])

    def test_planta_um_campo_tirado_da_lista(self):
        with mock.patch.object(forma, "CAMPOS_DO_LEITOR", ("mede", "periodo", "compara", "diz", "onde")):
            peca = ler(Plantada([]).peca)
            peca.linhas["indice"]["populacao"] = "ver indice_anterior"
            self.assertEqual(forma.ids_nos_campos_do_leitor(peca), [])  # what the walk above refuses


# --------------------------------------------------------------------------- B. the arithmetic computes


def conta(linhas: dict, calculo: str, resultado: dict) -> str:
    ctx = paginas.Contexto(textos=TEXTOS)
    peca = SimpleNamespace(linhas={k: {"tipo": "valor", "periodo": f"período de {k}", **v} for k, v in linhas.items()})
    peca.linhas["r"] = {"id": "r", "tipo": "derivado", "calculo": calculo, **resultado}
    return paginas._conta(ctx, peca, peca.linhas["r"])


def aritmetica(html: str) -> str:
    return texto(html.split('<ul class="entradas-da-conta">')[0])


def lista(html: str) -> list[str]:
    return [texto(li) for li in re.findall(r"<li>(.*?)</li>", html)]


class B_AContaFazAsContas(unittest.TestCase):
    def test_entradas_que_o_mostra_arredonda(self):
        h = conta({"a": {"valor": "1.234", "mostra": "1,2"}, "b": {"valor": "1.211", "mostra": "1,2"}}, "a - b", {"valor": "0.023", "mostra": "0,023"})
        self.assertEqual(aritmetica(h), f"1,234 {MENOS} 1,211{NB}= 0,023")
        self.assertEqual(lista(h), ["1,234 · período de a", "1,211 · período de b"])

    def test_uma_entrada_noutra_escala(self):
        h = conta({"a": {"valor": "1500", "mostra": "1,5 mil", "unidade": "euros"}}, "a / 1000", {"valor": "1.5", "mostra": "1,5"})
        self.assertEqual(aritmetica(h), f"1{NB}500 ÷ 1{NB}000{NB}= 1,5")
        self.assertEqual(lista(h), [f"1{NB}500 · período de a"])

    def test_zeros_que_o_mostra_mostra_e_o_sinal_do_resultado(self):
        h = conta({"a": {"valor": "3.07", "mostra": "3,07 %"}, "b": {"valor": "4.6", "mostra": "4,60 %"}}, "a - b",
                  {"valor": "-1.53", "mostra": "-1,53 pontos percentuais"})
        self.assertEqual(aritmetica(h), f"3,07 {MENOS} 4,60{NB}= {MENOS}1,53")
        self.assertEqual(lista(h), ["3,07 · período de a", "4,60 · período de b"])
        h = conta({"a": {"valor": "4.4", "mostra": "4,40 %"}}, "a + 0", {"valor": "4.4", "mostra": "4,4 %"})
        self.assertEqual(aritmetica(h), f"4,40 + 0{NB}= 4,4")

    def test_planta_a_conta_pelo_mostra(self):
        """ESQ3's rule: the number as the mostra shows it, «1,2 − 1,2 = 0,023»."""
        def pelo_mostra(linha):
            m = numeros.FIGURA.search(str(linha.get("mostra", "")))
            return m["inteiro"] + ("," + m["decimais"] if m["decimais"] else ""), m["sinal"] in ("-", MENOS)
        with mock.patch.object(paginas, "numero_mostrado", pelo_mostra):
            h = conta({"a": {"valor": "1.234", "mostra": "1,2"}, "b": {"valor": "1.211", "mostra": "1,2"}}, "a - b", {"valor": "0.023", "mostra": "0,023"})
        self.assertEqual(aritmetica(h), f"1,2 {MENOS} 1,2{NB}= 0,023")


if __name__ == "__main__":
    unittest.main()
