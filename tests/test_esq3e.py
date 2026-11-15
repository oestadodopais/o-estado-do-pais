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


# --------------------------------------------------------------------------- D. a decided finding is a real finding


class D_UmAchadoDecididoEReal(ComLeitura):
    def test_dois_achados_no_lugar_da_planta_um_apanha_o_outro_adotado(self):
        pasta, _ = self.lida(achados=[achado("frase 7", problema="it rose"), achado("frase 7", "corrigir", "another fault there")])
        p = leituras.pontuar(pasta, self.decisoes('[[decisao]]\nachado = 2\ndecisao = "adotado"\n'), imprimir=lambda *a: None)
        self.assertEqual((p["plantas_apanhadas"], p["achados"], p["adotados"], p["veredicto"]), (1, 1, 1, "nao_passa"))
        self.assertEqual(p["plantas"][0]["achados"], [1])

    def test_planta_o_lugar_que_engole_o_achado(self):
        """ESQ3's matching: both findings at the place were credited to the plant, none was real."""
        pasta, _ = self.lida(achados=[achado("frase 7", problema="it rose"), achado("frase 7", "corrigir", "another fault there")])
        with self.assertRaises(leituras.Recusa) as e:  # undecided, the pair is now refused rather than swallowed
            leituras.pontuar(pasta, imprimir=lambda *a: None)
        self.assertIn("findings [1, 2] share its place", str(e.exception))
        self.assertFalse((pasta / "pontuacao.json").exists())

    def test_quatro_achados_num_ficheiro_um_deles_de_uma_planta(self):
        """The decisions of the code reading this order answers are the model: [[planta]] names the plant's
        finding, [[decisao]] the three others."""
        pasta, _ = self.lida(achados=[achado("ficheiro oedp/x.py:10", problema="the plant"), achado("ficheiro oedp/x.py:20", "trava", "a"),
                                      achado("ficheiro oedp/x.py:30", "corrigir", "b"), achado("ficheiro oedp/x.py:40", "menor", "c")])
        chave = json.loads((pasta / "chave.json").read_text())
        planta = chave["plantas"][0]
        planta.update(lugares=["ficheiro oedp/x.py:10"], ficheiro_codigo="oedp/x.py", linhas=[10])
        (pasta / "chave.json").write_text(json.dumps(chave))
        decisoes = (f'[[planta]]\nid = "{planta["id"]}"\napanhada = true\nachado = 1\n'
                    '[[decisao]]\nachado = 2\ndecisao = "adotado"\n'
                    '[[decisao]]\nachado = 3\ndecisao = "recusado"\nrazao = "not so"\n'
                    '[[decisao]]\nachado = 4\ndecisao = "recusado"\nrazao = "not so either"\n')
        p = leituras.pontuar(pasta, self.decisoes(decisoes), imprimir=lambda *a: None)
        self.assertEqual((p["plantas_apanhadas"], p["plantas_postas"], p["achados"], p["adotados"], p["veredicto"]), (1, 1, 3, 1, "nao_passa"))
        self.assertTrue(any("real findings at trava: [2]" in r for r in p["razoes"]), p["razoes"])

    def test_um_achado_que_e_planta_e_decisao_e_recusado(self):
        pasta, _ = self.lida(achados=[achado("frase 7", problema="it rose")])
        chave = json.loads((pasta / "chave.json").read_text())
        decisoes = f'[[planta]]\nid = "{chave["plantas"][0]["id"]}"\napanhada = true\nachado = 1\n[[decisao]]\nachado = 1\ndecisao = "adotado"\n'
        with self.assertRaises(leituras.Recusa) as e:
            leituras.pontuar(pasta, self.decisoes(decisoes), imprimir=lambda *a: None)
        self.assertIn("named both as a plant's catch", str(e.exception))


# --------------------------------------------------------------------------- F. the tests' model name counts only in a tests' tree

from oedp import __main__ as cli  # noqa: E402
from oedp import codigo, ensaio, marca, publicar, registo  # noqa: E402
from tests.apoio import ENSAIOS  # noqa: E402

RAZAO = "is signed by the tests' model name (modelo-de-ensaio), which counts only in a tree assembled for the tests"


def arvore_do_repositorio(caso) -> Path:
    """A copy of the repository's own site (no mark): its pages, desks, rights, pieces and records."""
    pasta = pasta_temporaria(caso, "oedp-arvore-")
    for sub in ("pecas", "mesas", "paginas", "direitos"):
        if (REPO / sub).is_dir():
            shutil.copytree(REPO / sub, pasta / sub)
    for f in ("textos.registo.toml", "codigo.registo.toml"):
        if (REPO / f).is_file():
            shutil.copy2(REPO / f, pasta / f)
    return pasta


class F_ONomeDoModeloDeEnsaio(unittest.TestCase):
    def test_o_registo_de_ensaio_copiado_por_cima_do_real(self):
        """The reader's mistake: ensaios/textos.registo.toml over textos.registo.toml."""
        arvore = arvore_do_repositorio(self)
        shutil.copy2(ENSAIOS / "textos.registo.toml", arvore / "textos.registo.toml")
        ctx, _ = build.contexto(REPO, arvore, [])
        self.assertTrue(ctx.ensaio and all(RAZAO in x for x in ctx.ensaio), ctx.ensaio)
        self.assertTrue(all(x.startswith("textos.registo.toml: [[") for x in ctx.ensaio))
        ok, resultados = cli.conferir_tudo([], raiz=arvore, imprimir=lambda *a: None)
        quatro = next(r for r in resultados if r.alvo == "records signed by the tests' model name")
        self.assertEqual(quatro.estado, conf.FALHOU)
        self.assertFalse(ok)
        c = build.construir(REPO, raiz=arvore, saida=pasta_temporaria(self, "oedp-saida-") / "s", loja=None)
        self.assertFalse(c.ok)
        self.assertTrue(any(RAZAO in m for m in c.mensagens), c.mensagens)

    def test_planta_sem_a_barreira_o_engano_passa(self):
        arvore = arvore_do_repositorio(self)
        shutil.copy2(ENSAIOS / "textos.registo.toml", arvore / "textos.registo.toml")
        with mock.patch.object(marca, "assinadas", lambda *a: []):
            ctx, _ = build.contexto(REPO, arvore, [])
        self.assertEqual(ctx.ensaio, [])
        self.assertFalse(any("textos.toml" in x for x in ctx.julgamento), ctx.julgamento)  # the invented judgment would count

    def test_a_pagina_do_metodo_e_o_registo_do_codigo(self):
        arvore = arvore_do_repositorio(self)
        shutil.copy2(ENSAIOS / "paginas" / "metodo.md", arvore / "paginas" / "metodo.md")
        (arvore / codigo.REGISTO).write_text(ensaio.registo_de_ensaio(), encoding="utf-8")
        ctx, _ = build.contexto(REPO, arvore, [])
        nomes = {x.split(":")[0] for x in ctx.ensaio}
        self.assertEqual(nomes, {"paginas/metodo.md", "codigo.registo.toml"}, ctx.ensaio)

    def test_o_registo_de_uma_peca(self):
        p = Plantada([])
        self.addCleanup(p.apagar)
        (p.pasta / marca.FICHEIRO).unlink()  # the same piece, in a tree that is not marked
        r = p.resultados()
        for n in (4, 5):
            self.assertEqual(r[n].estado, conf.FALHOU, r[n].linha())
            self.assertTrue(any(RAZAO in x for x in r[n].razoes), r[n].linha())

    def test_a_arvore_do_ensaio_constroi_a_sua_peca_publicada(self):
        pasta = pasta_temporaria(self, "oedp-ensaio-")
        c = ensaio.construir_ensaio(pasta)
        self.assertTrue(c.ok, c.mensagens)
        self.assertTrue((c.estatica / "pecas" / ensaio.PECA_ID / "index.html").is_file())
        self.assertEqual((pasta / "raiz" / marca.FICHEIRO).read_text(encoding="utf-8"), marca.FRASE)
        p = Plantada([])
        self.addCleanup(p.apagar)
        self.assertEqual({p_.verificacao: p_.estado for p_ in p.resultados().values()}[5], conf.PASSOU)

    def test_a_marca_na_arvore_do_repositorio(self):
        with self.assertRaises(ValueError):
            ensaio.marcar(REPO)
        self.assertFalse(marca.de_ensaio(REPO))
        falsa = pasta_temporaria(self, "oedp-repo-")
        for f in ("textos.toml", "sitio.toml", "vercel.json"):
            shutil.copy2(REPO / f, falsa / f)
        (falsa / marca.FICHEIRO).write_text(marca.FRASE, encoding="utf-8")
        with mock.patch.object(cli, "REPO", falsa), mock.patch.object(conf, "REPO", falsa):
            ok, resultados = cli.conferir_tudo([], raiz=falsa, imprimir=lambda *a: None)
        nove = [r for r in resultados if r.alvo == "the repository's tree"]
        self.assertEqual([r.estado for r in nove], [conf.FALHOU])
        self.assertIn("ARVORE-DE-ENSAIO.txt is the mark of a tree assembled for the tests", nove[0].razoes[0])
        self.assertFalse(ok)

    def test_publicar_recusa_ao_lado_da_marca(self):
        pasta = pasta_temporaria(self, "oedp-pub-")
        (pasta / marca.FICHEIRO).write_text(marca.FRASE, encoding="utf-8")
        razoes = publicar.condicoes(pasta, {"OEDP_FONTES": "x", "OEDP_OFICINA": "y"})
        self.assertTrue(any("ARVORE-DE-ENSAIO.txt is here" in r for r in razoes), razoes)
        (pasta / marca.FICHEIRO).unlink()
        self.assertFalse(any("ARVORE-DE-ENSAIO.txt" in r for r in publicar.condicoes(pasta, {"OEDP_FONTES": "x", "OEDP_OFICINA": "y"})))

    def test_registar_recusa_o_nome_sem_a_marca(self):
        campos = {"nome": "edicao", "lugar": "direcao", "familia": "anthropic", "modelo": marca.MODELO,
                  "inicio": "2026-11-16T13:00:00Z", "fim": "2026-11-16T13:05:00Z"}
        p = Plantada([])
        self.addCleanup(p.apagar)
        registo.acrescentar(p.peca, "passo", campos)  # marked: written
        (p.pasta / marca.FICHEIRO).unlink()
        antes = p.peca.read_bytes()
        with self.assertRaises(registo.ErroDoRegisto) as e:
            registo.acrescentar(p.peca, "passo", campos)
        self.assertIn("is the tests' own, and counts only in a tree assembled for the tests", str(e.exception))
        self.assertEqual(p.peca.read_bytes(), antes)


# --------------------------------------------------------------------------- C. check 1 holds a mostra to its line's unit


def check1_com(caso, unidade: str, mostra: str):
    p = Plantada([('unidade = "pontos"\nmede = "Índice de ensaio, inventado para os ensaios"\npopulacao = "Nenhuma: é um índice de ensaio"\nperiodo = "Terceiro',
                   f'unidade = "{unidade}"\nmede = "Índice de ensaio, inventado para os ensaios"\npopulacao = "Nenhuma: é um índice de ensaio"\nperiodo = "Terceiro'),
                  ('mostra = "104,7 pontos"', f'mostra = "{mostra}"')])
    caso.addCleanup(p.apagar)
    return conf.check1(ler(p.peca))


class C_AUnidadeDoMostra(unittest.TestCase):
    RECUSADOS = (("‰", "104,7 %", "per cent", "per mille"), ("%", "104,7 ‰", "per mille", "per cent"),
                 ("%", "104,7 pontos percentuais", "percentage points", "per cent"),
                 ("pontos percentuais", "104,7 %", "per cent", "percentage points"),
                 ("euros", "104,7 dólares", "dollar", "euro"), ("€", "104,7 libras", "pound", "euro"))

    def test_pares_que_a_conferencia_distingue(self):
        for unidade, mostra, tipo_m, tipo_u in self.RECUSADOS:
            r = check1_com(self, unidade, mostra)
            self.assertEqual(r.estado, conf.FALHOU, (unidade, mostra))
            self.assertTrue(any(f"prints a unit in {tipo_m}" in x and f"is in {tipo_u}" in x for x in r.razoes), r.razoes)

    def test_a_mesma_unidade_passa(self):
        for unidade, mostra in (("%", "104,7 %"), ("‰", "104,7 ‰"), ("euros", "104,7 €"), ("mil euros", "104,7 mil euros"),
                                ("pontos percentuais", "104,7 pontos percentuais"), ("pontos", "104,7 pontos")):
            r = check1_com(self, unidade, mostra)
            self.assertEqual(r.estado, conf.PASSOU, (unidade, mostra, r.linha()))
            self.assertFalse(any("unit mostra prints" in n for n in r.notas), r.notas)

    def test_uma_unidade_que_nao_conhece_e_uma_nota(self):
        r = check1_com(self, "pontos", "104,7 graus")
        self.assertEqual(r.estado, conf.PASSOU, r.linha())
        self.assertTrue(any("indice: the unit mostra prints ('graus') and unidade ('pontos') are not compared" in n for n in r.notas), r.notas)

    def test_planta_sem_comparar_a_unidade(self):
        with mock.patch.object(numeros, "unidade_lida", lambda texto: ("", None)):
            r = check1_com(self, "‰", "104,7 %")
        self.assertEqual(r.estado, conf.PASSOU)  # a per mille shown as a per cent: what the reader found


# --------------------------------------------------------------------------- G. a row of a table


from oedp import fontes  # noqa: E402
from tests.apoio import loja_fora_do_repositorio  # noqa: E402

HTML_ANTIGO = "29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b"


class G_UmaLinhaDeQuadro(unittest.TestCase):
    def setUp(self):
        self.loja = loja_fora_do_repositorio(self)
        dados = fontes.caminho_da_copia(self.loja, HTML_ANTIGO).read_bytes() + "\n100\n200\n98 102 105\n1 617 Euros\n".encode()
        self.sha = fontes.guardar(self.loja, dados)
        self.base = [(f'bytes = 564\nsha256 = "{HTML_ANTIGO}"', f'bytes = {len(dados)}\nsha256 = "{self.sha}"')]

    def linha(self, excerto, valor, quadro=None):
        mais = "" if quadro is None else f"linha_de_quadro = {quadro}\n"
        p = Plantada(self.base + [("excerto = '''Total de ensaio: 1 234 567 euros'''\nvalor = \"1234567\"",
                                   f"excerto = '''{excerto}'''\nvalor = \"{valor}\"\n{mais}".rstrip("\n"))])
        self.addCleanup(p.apagar)
        peca = ler(p.peca)
        return conf.check2(peca, self.loja), peca.linhas["total"], p

    def test_cem_e_duzentos_em_duas_linhas(self):
        r, _, _ = self.linha("100\n200", "100")
        self.assertTrue(any("total: the excerpt does not hold valor 100" in x for x in r.razoes), r.linha())
        r, l, _ = self.linha("100\n200", "100", "true")
        self.assertEqual(r.estado, conf.PASSOU, r.linha())
        self.assertEqual(paginas.lugar_da_figura(l), (0, 3))

    def test_noventa_e_oito_cento_e_dois_cento_e_cinco(self):
        r, _, _ = self.linha("98 102 105", "102")
        self.assertTrue(any("total: the excerpt does not hold valor 102" in x for x in r.razoes), r.linha())
        r, l, _ = self.linha("98 102 105", "102", "true")
        self.assertEqual(r.estado, conf.PASSOU, r.linha())
        self.assertEqual(l["excerto"][slice(*paginas.lugar_da_figura(l))], "102")

    def test_mil_seiscentos_e_dezassete(self):
        r, _, _ = self.linha("1 617 Euros", "1617")
        self.assertEqual(r.estado, conf.PASSOU, r.linha())
        r, _, _ = self.linha("1 617 Euros", "1617", "true")
        self.assertTrue(any("total: the excerpt does not hold valor 1617" in x for x in r.razoes), r.linha())

    def test_a_forma_do_campo(self):
        _, _, p = self.linha("98 102 105", "102", '"sim"')
        self.assertTrue(any("field linha_de_quadro must be sim_nao" in x for x in p.resultados()[9].razoes))
        p2 = Plantada([('mostra = "2,4 pontos"\n', 'mostra = "2,4 pontos"\nlinha_de_quadro = true\n')])
        self.addCleanup(p2.apagar)
        self.assertTrue(any("diferenca: linha_de_quadro belongs to a valor line only" in x for x in p2.resultados()[9].razoes))

    def test_planta_o_campo_ignorado(self):
        with mock.patch.object(numeros, "NUMERO_DE_QUADRO", numeros.NUMERO_INTEIRO):
            r, _, _ = self.linha("98 102 105", "102", "true")
        self.assertEqual(r.estado, conf.FALHOU)  # the row read as one number, 98102105
