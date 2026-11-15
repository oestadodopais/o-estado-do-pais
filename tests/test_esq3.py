"""ESQ3 (blocos/esq3/ORDEM.md): the piece page as readers found it, and three small tools.

Each rule is read by a checker written here, run once on the real output and once on a
plant (the output as the old code made it, or the rule's error put back), which the
checker must refuse for the stated reason.
"""
from __future__ import annotations

import hashlib
import html as html_mod
import re
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import conferir as conf
from oedp import construir as build
from oedp import fontes, numeros, paginas
from oedp.peca import ler
from tests.apoio import LOJA, REPO, Plantada, loja_fora_do_repositorio, sitio_de_ensaio

NB = "\u00a0"
MENOS = "−"
CSS = (REPO / "public" / "estilo.css").read_text(encoding="utf-8")


def regras(css: str) -> list[tuple[str, str]]:
    """(selector, declarations) of every rule, comments taken out, media blocks opened."""
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    return [(s.strip(), d) for s, d in re.findall(r"([^{}]+)\{([^{}]*)\}", css)]


def pagina_plantada(caso, trocas) -> tuple:
    """A copy of the test piece with `trocas` applied, and its page built directly (no checks)."""
    p = Plantada(trocas)
    caso.addCleanup(p.apagar)
    peca = ler(p.peca)
    ctx, _ = build.contexto(REPO, p.pasta, [peca])
    return peca, paginas.pagina_da_peca(peca, ctx), ctx


def recibo(html: str, lid: str) -> str:
    m = re.search(r'<details class="recibo"><summary>(?:(?!</details>).)*?<span class="ancora" id="r-' + lid
                  + r'"></span>.*?</details>', html, re.S)
    return m.group(0) if m else ""


def texto(fragmento: str) -> str:
    return html_mod.unescape(re.sub(r"<[^>]+>", "", fragmento))


class SitioDeEnsaio(unittest.TestCase):
    """The test site built as published, once for the class."""

    @classmethod
    def setUpClass(cls):
        cls.saida = Path(tempfile.mkdtemp(prefix="oedp-esq3-"))
        cls.addClassCleanup(shutil.rmtree, cls.saida, True)
        c = build.construir(REPO, raiz=sitio_de_ensaio(cls), saida=cls.saida, loja=LOJA)
        assert c.ok, c.mensagens
        cls.est = c.estatica

    def ler(self, nome: str) -> str:
        return (self.est / nome).read_text(encoding="utf-8")


# --------------------------------------------------------------------------- A. the mark is not a sign


def marcas_com_caracter(css: str) -> list[str]:
    """Every ::before or ::after of a summary whose content holds a character."""
    erros = []
    for seletor, decl in regras(css):
        if not re.search(r"summary:{1,2}(?:before|after)", seletor):
            continue
        m = re.search(r"content\s*:\s*([^;]+)", decl)
        if m and m.group(1).strip() not in ("''", '""', "none"):
            erros.append(f"{seletor}: content {m.group(1).strip()}")
    return erros


def resumos_que_nao_abrem_pela_figura(html: str) -> list[str]:
    """A receipt's summary whose first thing is not the figure (or a quotation's words, an act's
    sentence), and the record's summary whose first thing is not its heading."""
    erros = []
    for resumo in re.findall(r'<details class="recibo"><summary>(.*?)</summary>', html, re.S):
        if not re.match(r'<span( class="figura")?>[^<\s+\-−]', resumo):
            erros.append(resumo[:60])
    for resumo in re.findall(r'<details class="registo"[^>]*><summary>(.*?)</summary>', html, re.S):
        if not resumo.startswith("<h2>"):
            erros.append(resumo[:60])
    return erros


class A_AMarcaNaoESinal(SitioDeEnsaio):
    def test_nenhuma_marca_de_resumo_tem_caracter(self):
        self.assertEqual(marcas_com_caracter(CSS), [])
        # the chevron: an empty box with two borders, at the end of the line, turned when open
        depois = dict(regras(CSS))[".recibo > summary::after, .registo > summary::after"]
        for declaracao in ("content: ''", "margin-left: auto", "border-right: 2px solid", "border-bottom: 2px solid", "rotate(45deg)"):
            self.assertIn(declaracao, depois)
        self.assertIn("rotate(-135deg)", dict(regras(CSS))[".recibo[open] > summary::after, .registo[open] > summary::after"])

    def test_planta_o_mais_e_o_menos_de_antes(self):
        for conteudo in ("'+'", "'\\2212'", "'-'", "'›'"):
            plantado = CSS.replace("content: '';", f"content: {conteudo};", 1)
            self.assertEqual(len(marcas_com_caracter(plantado)), 1, conteudo)
        antes = CSS + "\n.recibo > summary::before { content: '+'; }\n"
        self.assertEqual(marcas_com_caracter(antes), [".recibo > summary::before: content '+'"])

    def test_o_anel_de_foco_e_os_44_px_ficam(self):
        self.assertIn(":focus-visible { outline: 2px solid var(--focus)", CSS)
        self.assertIn("min-height: 44px", dict(regras(CSS))[".recibo > summary, .registo > summary"])

    def test_cada_resumo_abre_pela_figura(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertEqual(len(re.findall(r'<details class="recibo">', html)), 8)
        self.assertEqual(resumos_que_nao_abrem_pela_figura(html), [])

    def test_planta_um_sinal_antes_da_figura(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        plantado = html.replace('<summary><span class="figura">', '<summary>+ <span class="figura">', 1)
        self.assertEqual(len(resumos_que_nao_abrem_pela_figura(plantado)), 1)
        plantado = html.replace('<summary><h2>', '<summary><span>+</span><h2>', 1)
        self.assertEqual(len(resumos_que_nao_abrem_pela_figura(plantado)), 1)


# --------------------------------------------------------------------------- B. a calculation prints what its receipts print


def aritmetica(html: str, lid: str) -> str:
    """The arithmetic of a computed figure's receipt, as text (the list under it left out)."""
    m = re.search(r'<dd class="conta">(.*?)(?:<ul class="entradas-da-conta">|</dd>)', recibo(html, lid), re.S)
    return texto(m.group(1)) if m else ""


def entradas_listadas(html: str, lid: str) -> list[str]:
    return [texto(li) for li in re.findall(r"<li>(.*?)</li>", recibo(html, lid))]


QUATRO_E_QUARENTA = [
    ('valor = "104.7"', 'valor = "4.7"'), ('unidade = "pontos"\nmede = "Índice', 'unidade = "%"\nmede = "Índice'),
    ('mostra = "104,7 pontos"', 'mostra = "4,70 %"'),
    ('valor = "102.3"', 'valor = "4.4"'), ('mostra = "102,3 pontos"', 'mostra = "4,40 %"'),
    ('calculo = "round ( indice - indice_anterior , 1 )"\nvalor = "2.4"\nunidade = "pontos"',
     'calculo = "round ( indice - indice_anterior , 2 )"\nvalor = "0.3"\nunidade = "pontos percentuais"'),
    ('mostra = "2,4 pontos"', 'mostra = "0,30 pontos percentuais"'),
]
NEGATIVOS = [
    ('valor = "104.7"', 'valor = "-0.11"'), ('mostra = "104,7 pontos"', 'mostra = "-0,11 %"'),
    ('valor = "102.3"', 'valor = "-0.38"'), ('mostra = "102,3 pontos"', 'mostra = "−0,38 %"'),
    ('calculo = "round ( indice - indice_anterior , 1 )"\nvalor = "2.4"', 'calculo = "round ( indice - indice_anterior , 2 )"\nvalor = "0.27"'),
    ('mostra = "2,4 pontos"', 'mostra = "0,27 pontos percentuais"'),
]


class B_AContaImprimeOQueOsRecibosImprimem(unittest.TestCase):
    def test_uma_entrada_e_o_resultado_como_os_seus_mostra(self):
        _, html, _ = pagina_plantada(self, QUATRO_E_QUARENTA)
        self.assertEqual(aritmetica(html, "diferenca"), f"4,70 {MENOS} 4,40{NB}= 0,30 (arredondado a 2 casas decimais)")
        self.assertIn('<span class="figura">4,40' + NB + "%</span>", recibo(html, "indice_anterior"))

    def test_planta_a_conta_pelo_valor(self):
        """The old code printed each input from its valor: «4,7 − 4,4 = 0,3»."""
        antigo = lambda linha: (numeros.portugues(str(linha.get("valor", "")).lstrip("-")), str(linha.get("valor", "")).startswith("-"))
        with mock.patch.object(paginas, "numero_mostrado", antigo):
            _, html, _ = pagina_plantada(self, QUATRO_E_QUARENTA)
        self.assertEqual(aritmetica(html, "diferenca"), f"4,7 {MENOS} 4,4{NB}= 0,3 (arredondado a 2 casas decimais)")
        self.assertNotIn("4,40", aritmetica(html, "diferenca"))

    def test_uma_entrada_negativa_entre_parenteses_com_o_sinal_menos(self):
        _, html, _ = pagina_plantada(self, NEGATIVOS)
        conta = aritmetica(html, "diferenca")
        self.assertEqual(conta, f"({MENOS}0,11) {MENOS} ({MENOS}0,38){NB}= 0,27 (arredondado a 2 casas decimais)")
        self.assertNotIn("-", conta)  # never a hyphen, though the first mostra has one
        self.assertIn(f'(<a href="#r-indice">{MENOS}0,11</a>)', recibo(html, "diferenca"))

    def test_planta_o_hifen_sem_parenteses(self):
        """The old arithmetic: «-0,11 − -0,38»."""
        _, html, _ = pagina_plantada(self, NEGATIVOS)
        dd = re.search(r'<dd class="conta">.*?</dd>', recibo(html, "diferenca"), re.S).group(0)
        plantado = html.replace(dd, f'<dd class="conta">-0,11 {MENOS} -0,38{NB}= 0,27</dd>')
        conta = aritmetica(plantado, "diferenca")
        self.assertIn("-", conta)
        self.assertNotIn(f"({MENOS}0,11)", conta)

    def test_a_lista_sob_a_conta_nomeia_cada_entrada_uma_vez_com_o_periodo(self):
        _, html, _ = pagina_plantada(self, [('calculo = "round ( indice - indice_anterior , 1 )"\nvalor = "2.4"',
                                             'calculo = "round ( indice - indice_anterior + indice - indice , 1 )"\nvalor = "2.4"')])
        self.assertEqual(entradas_listadas(html, "diferenca"),
                         ["104,7 · Terceiro trimestre de ensaio", "102,3 · Segundo trimestre de ensaio"])
        lista = re.search(r'<ul class="entradas-da-conta">.*?</ul>', recibo(html, "diferenca")).group(0)
        self.assertIn('<a href="#r-indice">104,7</a>', lista)

    def test_planta_a_lista_com_uma_entrada_repetida_ou_sem_periodo(self):
        _, html, _ = pagina_plantada(self, [])
        bom = entradas_listadas(html, "diferenca")
        self.assertEqual(bom, ["104,7 · Terceiro trimestre de ensaio", "102,3 · Segundo trimestre de ensaio"])
        plantado = html.replace("<li>", "<li>x</li><li>", 1)
        self.assertNotEqual(entradas_listadas(plantado, "diferenca"), bom)

    def test_uma_entrada_que_e_uma_conta_nao_tem_linha_na_lista(self):
        trocas = [('[[linha]]\nid = "total"', '[[linha]]\nid = "dobro"\ntipo = "derivado"\ncalculo = "diferenca * 2"\nvalor = "4.8"\n'
                   'unidade = "pontos"\nmede = "O dobro da diferença"\nperiodo = "Ensaio"\ncompara = "Ensaio"\nmostra = "4,8 pontos"\n\n'
                   '[[linha]]\nid = "total"'), ("e {terco} dos inquiridos", "e {terco} dos inquiridos, {dobro}")]
        _, html, _ = pagina_plantada(self, trocas)
        self.assertEqual(aritmetica(html, "dobro"), f"2,4 × 2{NB}= 4,8")
        self.assertEqual(entradas_listadas(html, "dobro"), [])


# --------------------------------------------------------------------------- C. receipts for what the text uses


SO_ENTRADA = [("No trimestre anterior ficara em {indice_anterior}, [uma subida de]", "No trimestre anterior, [uma subida de]")]
NAO_USADA = [('[[pessoa]]\nid = "pessoa_de_ensaio"', '[[linha]]\nid = "sem_uso"\ntipo = "valor"\nfonte = "doc_pdf"\nonde = "p. 2"\n'
              "excerto = '''contra 102,3 pontos no segundo trimestre'''\nvalor = \"102.3\"\nunidade = \"pontos\"\n"
              'mede = "Uma linha que nada usa"\npopulacao = "Ensaio"\nperiodo = "Ensaio"\nprovisorio = false\nmostra = "102,3 pontos"\n\n'
              '[[pessoa]]\nid = "pessoa_de_ensaio"')]


def ordem_dos_recibos(html: str) -> list[str]:
    return re.findall(r'<details class="recibo"><summary>.*?</summary><span class="ancora" id="r-([a-z_]+)"', html, re.S)


class C_RecibosDoQueOTextoUsa(SitioDeEnsaio):
    def test_uma_linha_sem_uso_nao_tem_recibo_e_fica_no_ficheiro(self):
        peca, html, _ = pagina_plantada(self, NAO_USADA)
        self.assertIn("sem_uso", peca.linhas)
        self.assertNotIn("r-sem_uso", html)
        self.assertNotIn("Uma linha que nada usa", html)

    def test_planta_todas_as_linhas_como_antes(self):
        peca, html, _ = pagina_plantada(self, NAO_USADA)
        with mock.patch.object(paginas, "recibos_da_pagina", lambda p: (list(p.linhas), [])):
            plantado = paginas.pagina_da_peca(peca, build.contexto(REPO, peca.caminho.parents[2], [peca])[0])
        self.assertIn("r-sem_uso", plantado)

    def test_uma_linha_so_de_entrada_vem_depois_das_usadas_e_volta_a_conta(self):
        peca, html, _ = pagina_plantada(self, SO_ENTRADA)
        self.assertEqual(paginas.recibos_da_pagina(peca),
                         (["indice", "diferenca", "total", "terco", "declaracao", "despacho", "proxima"], ["indice_anterior"]))
        self.assertEqual(ordem_dos_recibos(html)[-1], "indice_anterior")
        # r_voltar of an input-only line leads to the receipt of the calculation it enters,
        # as before; a click on the input in the arithmetic leads to its receipt
        self.assertIn('<p class="voltar"><a href="#r-diferenca">Voltar ao texto</a></p>', recibo(html, "indice_anterior"))
        self.assertIn('<a href="#r-indice_anterior">102,3</a>', recibo(html, "diferenca"))
        self.assertEqual(build.ancoras_fechadas(html) & {"r-indice_anterior"}, set())

    def test_planta_uma_volta_para_uma_conta_que_nao_esta_na_pagina(self):
        trocas = SO_ENTRADA + [('[[linha]]\nid = "total"', '[[linha]]\nid = "outra"\ntipo = "derivado"\ncalculo = "indice_anterior * 2"\n'
                                'valor = "204.6"\nunidade = "pontos"\nmede = "Ensaio"\nperiodo = "Ensaio"\ncompara = "Ensaio"\n'
                                'mostra = "204,6 pontos"\n\n[[linha]]\nid = "total"')]
        peca, html, _ = pagina_plantada(self, trocas)
        self.assertNotIn("r-outra", html)
        self.assertIn('href="#r-diferenca">Voltar ao texto', recibo(html, "indice_anterior"))
        # the old rule went to the first calculation of the fact sheet that names the line
        primeira_da_folha = next(l for l, x in peca.linhas.items() if x.get("tipo") == "derivado" and "indice_anterior" in x["calculo"])
        self.assertEqual(primeira_da_folha, "diferenca")
        self.assertEqual(paginas._volta(peca, "indice_anterior", set(), ["outra", "diferenca"]), "#r-outra")

    def test_uma_linha_impressa_e_de_entrada_aparece_uma_vez_debaixo_do_primeiro_titulo(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertEqual(ordem_dos_recibos(html).count("indice"), 1)
        self.assertEqual(ordem_dos_recibos(html), ["indice", "diferenca", "indice_anterior", "total", "terco", "declaracao",
                                                   "despacho", "proxima"])

    def test_o_resumo_fechado_diz_o_que_e(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn(f'<summary><span class="figura">2,4{NB}pontos</span> <span class="mede">Diferença do índice de ensaio entre '
                      'dois trimestres</span></summary>', html)
        self.assertIn('<summary><span>«As contas de ensaio estão certas»</span></summary>', html)
        regra = next(d for s, d in regras(CSS) if s == ".recibo > summary > .mede")  # the rule outside the phone's
        for d in ("overflow: hidden", "white-space: nowrap", "text-overflow: ellipsis", "min-width: 0"):
            self.assertIn(d, regra)
        self.assertIn("flex: none", next(d for s, d in regras(CSS) if s == ".recibo > summary > .figura"))

    def test_um_ato_diz_a_sua_frase_uma_vez(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        frase = "O despacho de ensaio foi assinado pela ministra de ensaio."
        self.assertEqual(html.count(frase), 1)
        self.assertIn(f"<summary><span>{frase}</span></summary>", recibo(html, "despacho"))
        self.assertNotIn("O que o documento estabelece", html)

    def test_planta_a_frase_do_ato_duas_vezes(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        frase = "O despacho de ensaio foi assinado pela ministra de ensaio."
        plantado = html.replace("<dl><dt>Excerto</dt>", f"<dl><dt>O que o documento estabelece</dt><dd>{frase}</dd><dt>Excerto</dt>", 1)
        self.assertEqual(plantado.count(frase), 2)

    def test_toda_a_ligacao_a_um_recibo_tem_o_seu_recibo(self):
        for trocas in (SO_ENTRADA, NAO_USADA, []):
            _, html, _ = pagina_plantada(self, trocas)
            ancoras = set(re.findall(r'\bid="([^"]+)"', html))
            for href in re.findall(r'href="#(r-[a-z0-9_]+)"', html):
                self.assertIn(href, ancoras)
        self.assertEqual(build.ligacoes_partidas(self.est), [])


# --------------------------------------------------------------------------- D. the figure marked inside its excerpt


def linha_valor(excerto: str, valor: str, **mais) -> dict:
    return {"tipo": "valor", "excerto": excerto, "valor": valor, **mais}


def marcado(linha: dict) -> str | None:
    lugar = paginas.lugar_da_figura(linha)
    return None if lugar is None else str(linha["excerto"]).strip()[lugar[0] : lugar[1]]


class D_AFiguraMarcadaNoExcerto(SitioDeEnsaio):
    def test_um_espaco_fino_dentro_do_numero(self):
        linha = linha_valor("os salários passaram de 1\u202f581 para 1\u202f617 euros", "1617")
        self.assertEqual(marcado(linha), "1\u202f617")
        self.assertIn("<mark>1\u202f617</mark> euros", paginas._excerto(paginas.Contexto(textos={"r_excerto": "Excerto"}), linha))

    def test_uma_quebra_de_linha_antes_da_figura(self):
        linha = linha_valor("Total de ensaio:\n  1 234 567 euros", "1234567")
        self.assertEqual(marcado(linha), "1 234 567")
        html = paginas._excerto(paginas.Contexto(textos={"r_excerto": "Excerto"}), linha)
        self.assertIn("Total de ensaio:\n  <mark>1 234 567</mark> euros", html)

    def test_planta_o_lugar_do_texto_normalizado_usado_no_impresso(self):
        """Without carrying the place back, the line break and the indent shift the mark."""
        linha = linha_valor("Total de ensaio:\n  1 234 567 euros", "1234567")
        normalizado = fontes.normalizar(linha["excerto"])
        identidade = lambda t: (fontes.normalizar(t), [(i, i + 1) for i in range(len(fontes.normalizar(t)))])
        with mock.patch.object(fontes, "normalizar_com_mapa", identidade):
            self.assertNotEqual(marcado(linha), "1 234 567")
        self.assertEqual(normalizado, "Total de ensaio: 1 234 567 euros")

    def test_mais_de_uma_ocorrencia(self):
        excerto = "De 1 a 4 trabalhadores 2,6 2,9 2,6 3,1"
        self.assertIsNone(marcado(linha_valor(excerto, "2.6")))
        self.assertEqual(paginas.lugar_da_figura(linha_valor(excerto, "2.6", ocorrencia=2)), (31, 34))
        self.assertEqual(paginas.lugar_da_figura(linha_valor(excerto, "2.6", ocorrencia=1)), (23, 26))
        self.assertIsNone(paginas.lugar_da_figura(linha_valor(excerto, "2.6", ocorrencia=3)))
        self.assertEqual(marcado(linha_valor(excerto, "3.1")), "3,1")

    def test_planta_marcar_a_primeira_quando_ha_duas(self):
        excerto = "De 1 a 4 trabalhadores 2,6 2,9 2,6 3,1"
        original = numeros.ocorrencias
        primeira = lambda texto, valor, quadro=False: original(texto, valor, quadro)[:1]
        with mock.patch.object(numeros, "ocorrencias", primeira):
            self.assertIsNotNone(marcado(linha_valor(excerto, "2.6")))  # the rule broken: one marked though two exist

    def test_o_excerto_marcado_na_pagina_e_a_folha_de_estilo(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn("contra <mark>102,3</mark> pontos no segundo trimestre", recibo(html, "indice_anterior"))
        self.assertIn("Total de ensaio: <mark>1 234 567</mark> euros", recibo(html, "total"))  # the mark keeps it whole (ESQ3b A)
        self.assertEqual(html.count("<mark>"), 4)  # indice, indice_anterior, total, terco
        excerto = dict(regras(CSS))[".excerto"]
        self.assertIn("white-space: pre-line", excerto)
        self.assertEqual([s for s, d in regras(CSS) if "pre-line" in d], [".excerto"])
        marca = dict(regras(CSS))[".excerto mark"]
        for d in ("background: var(--marca)", "font-weight: 600", "text-decoration: underline"):
            self.assertIn(d, marca)
        self.assertEqual(CSS.count("--marca:"), 2)  # light and dark

    def test_ocorrencia_na_forma(self):
        base = ("mostra = \"104,7 pontos\"\n", )
        for valor, motivo in (("0", "ocorrencia 0 is not a whole number of 1 or more"),
                              ("-1", "ocorrencia -1 is not a whole number of 1 or more"),
                              ("1.5", "field ocorrencia must be inteiro"), ('"2"', "field ocorrencia must be inteiro"),
                              ("true", "field ocorrencia must be inteiro")):
            p = Plantada([(base[0], base[0] + f"ocorrencia = {valor}\n")])
            self.addCleanup(p.apagar)
            r = p.resultados()
            self.assertEqual(r[9].estado, conf.FALHOU, valor)
            self.assertTrue(any(motivo in x for x in r[9].razoes), r[9].linha())
        p = Plantada([('mostra = "2,4 pontos"\n', 'mostra = "2,4 pontos"\nocorrencia = 1\n')])
        self.addCleanup(p.apagar)
        r = p.resultados()
        self.assertTrue(any("diferenca: ocorrencia belongs to a valor line only" in x for x in r[9].razoes), r[9].linha())
        p = Plantada([(base[0], base[0] + "ocorrencia = 1\n")])
        self.addCleanup(p.apagar)
        self.assertEqual(p.resultados()[9].estado, conf.PASSOU)


class D_OcorrenciaNoCheck2(unittest.TestCase):
    """A store of its own whose table copy holds a figure twice in one sentence."""

    def setUp(self):
        self.loja = loja_fora_do_repositorio(self)
        antiga = "29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b"
        dados = fontes.caminho_da_copia(self.loja, antiga).read_bytes() + b" Total repetido: 1 234 567 euros e 1 234 567 euros."
        self.sha = fontes.guardar(self.loja, dados)
        self.trocas = [(f'bytes = 564\nsha256 = "{antiga}"', f'bytes = {len(dados)}\nsha256 = "{self.sha}"'),
                       ("excerto = '''Total de ensaio: 1 234 567 euros'''",
                        "excerto = '''Total repetido: 1 234 567 euros e 1 234 567 euros.'''")]

    def check2(self, mais=()):
        p = Plantada(self.trocas + list(mais))
        self.addCleanup(p.apagar)
        return conf.check2(ler(p.peca), self.loja)

    def test_duas_sem_ocorrencia_e_uma_nota(self):
        r = self.check2()
        self.assertEqual(r.estado, conf.PASSOU, r.linha())
        self.assertIn("total: the figure 1234567 occurs 2 times in the excerpt and the line has no ocorrencia, so the page marks "
                      "none of them", r.notas)

    def test_ocorrencia_que_existe_passa_sem_nota(self):
        r = self.check2([('mostra = "1,2 milhões de euros"\n', 'mostra = "1,2 milhões de euros"\nocorrencia = 2\n')])
        self.assertEqual(r.estado, conf.PASSOU, r.linha())
        self.assertFalse(any("occurs" in n for n in r.notas), r.notas)

    def test_planta_ocorrencia_que_nao_existe(self):
        r = self.check2([('mostra = "1,2 milhões de euros"\n', 'mostra = "1,2 milhões de euros"\nocorrencia = 3\n')])
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("total: ocorrencia = 3, but the figure 1234567 occurs 2 times in the excerpt", r.razoes)


# --------------------------------------------------------------------------- E. where a line may break, links that touch


class E_OndeUmaLinhaPodePartir(SitioDeEnsaio):
    def test_uma_linha_impressa(self):
        q = paginas.sem_quebra
        self.assertEqual(q("0,19 pontos percentuais", True), "0,19 pontos percentuais")
        self.assertEqual(q("4,40 %", True), f"4,40{NB}%")
        self.assertEqual(q("1 617 euros", True), f"1{NB}617{NB}euros")
        self.assertEqual(q("−0,38 pontos percentuais", True), "−0,38 pontos percentuais")
        self.assertEqual(q("602,5 mil postos de trabalho", True), f"602,5{NB}mil postos de trabalho")
        self.assertEqual(q("58,8 ‰", True), f"58,8{NB}‰")
        self.assertEqual(q("um terço", True), f"um{NB}terço")
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn(f">104,7{NB}pontos</a>", html)

    def test_planta_a_linha_inteira_presa(self):
        antigo = lambda texto, impressa: re.sub(r"[ \u202f]", NB, texto) if impressa else texto
        self.assertNotEqual(antigo("0,19 pontos percentuais", True), paginas.sem_quebra("0,19 pontos percentuais", True))

    def test_um_intervalo_fica_inteiro(self):
        self.assertEqual(paginas.sem_quebra("de 1 a 4 trabalhadores", False), f"de 1{NB}a{NB}4{NB}trabalhadores")
        _, html, _ = pagina_plantada(self, [("[O despacho de ensaio foi assinado]{despacho}", "[O despacho de 1 a 4 de ensaio foi assinado]{despacho}")])
        self.assertIn(f"O despacho de 1{NB}a{NB}4{NB}de ensaio foi assinado</a>", html)

    def test_planta_o_intervalo_sem_a_regra(self):
        with mock.patch.object(paginas, "_INTERVALO", re.compile(r"(?!)")):
            self.assertIn("a 4", paginas.sem_quebra("de 1 a 4 trabalhadores", False))

    def test_no_excerto_e_no_onde(self):
        # ESQ3b, item A: only «p.» is glued; a space between two digits is an ordinary space,
        # and the figure the receipt marks is kept whole by the stylesheet.
        self.assertEqual(paginas.sem_quebra_na_fonte("p. 12, passando de 1 617 euros"), f"p.{NB}12, passando de 1 617 euros")
        self.assertEqual(paginas.sem_quebra_na_fonte("cap. 3"), "cap. 3")
        linha = linha_valor("passando de 1 617 euros", "1617")
        html = paginas._excerto(paginas.Contexto(textos={"r_excerto": "Excerto"}), linha)
        self.assertIn("passando de <mark>1 617</mark> euros", html)
        pagina = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn(f"<dt>Onde está</dt><dd>p.{NB}2, primeiro parágrafo</dd>", recibo(pagina, "indice"))

    def test_planta_o_p_sem_a_regra(self):
        with mock.patch.object(paginas, "sem_quebra_na_fonte", lambda t: t):
            html = paginas._excerto(paginas.Contexto(textos={"r_excerto": "Excerto"}), linha_valor("p. 3: de 1 617 euros", "1617"))
        self.assertIn("p. 3", html)
        self.assertNotIn(NB, html)

    def test_ligacoes_que_se_tocam(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        self.assertIn('<a class="ligada" href="#r-diferenca">uma subida de</a> <a class="ref encostada" href="#r-diferenca">', html)
        self.assertEqual(html.count("encostada"), 1)
        self.assertIn("margin-left", dict(regras(CSS))["a.ref.encostada, a.ligada.encostada"])
        _, html, _ = pagina_plantada(self, [("{diferenca} {diferenca}.", "{diferenca}, {diferenca}.")])
        self.assertNotIn("encostada", html)
        self.assertIn('<a class="ref encostada"', paginas.marcar_encostadas(
            '<a class="ref" href="#r-a">1</a><span id="u-b"></span><a class="ref" href="#r-b">2</a>'))

    def test_planta_ligacoes_que_se_tocam_sem_classe(self):
        with mock.patch.object(paginas, "marcar_encostadas", lambda f: f):
            _, html, _ = pagina_plantada(self, [])
        self.assertNotIn("encostada", html)


# --------------------------------------------------------------------------- F. four small repairs


class F_QuatroReparacoes(SitioDeEnsaio):
    def test_o_registo_guarda_a_margem_da_coluna(self):
        r = dict(regras(CSS))
        self.assertNotIn("width:", r[".registo"].replace("max-width", ""))
        self.assertNotIn("margin-inline", r[".registo"])
        self.assertIn("width: var(--largura)", r[".registo .tabela"])
        self.assertIn("margin-inline: calc((100% - var(--largura)) / 2)", r[".registo .tabela"])

    def test_planta_a_caixa_do_registo_toda_mais_larga(self):
        plantado = CSS.replace(".registo { max-width: 68ch;", ".registo { --largura: 980px; width: var(--largura); "
                               "margin-inline: calc((100% - var(--largura)) / 2); max-width: 68ch;")
        self.assertIn("margin-inline", dict(regras(plantado))[".registo"])

    def test_a_linha_da_ia_no_metodo_acaba_no_ponto(self):
        metodo = self.ler("metodo/index.html")
        linha = re.search(r'<p class="rotulo-ia-linha">(.*?)</p>', metodo).group(1)
        self.assertEqual(linha, "Texto gerado e editado por inteligência artificial. Nenhuma pessoa o revê antes de ser publicado.")
        self.assertNotIn('aria-current="page">Como é feito', metodo)
        self.assertIn('<a href="/metodo/">Como é feito</a></p>', self.ler("correcoes/index.html"))
        self.assertEqual(build.ligacoes_partidas(self.est), [])

    def test_planta_a_ligacao_da_ia_no_metodo(self):
        """The old Method page printed ia_ligacao as plain text marked as the current page."""
        metodo = self.ler("metodo/index.html")
        frase = "Nenhuma pessoa o revê antes de ser publicado."
        for plantado in (metodo.replace(frase + "</p>", frase + ' <span aria-current="page">Como é feito</span></p>', 1),
                         metodo.replace(frase + "</p>", frase + ' <a href="/metodo/">Como é feito</a></p>', 1)):
            linha = re.search(r'<p class="rotulo-ia-linha">(.*?)</p>', plantado).group(1)
            self.assertNotEqual(linha, "Texto gerado e editado por inteligência artificial. " + frase)

    def test_a_pagina_das_correcoes_por_ordem(self):
        html = self.ler("correcoes/index.html")
        posicoes = [html.index(x) for x in ('<p class="intro">Todas as correções', '<section class="correcoes-lista">',
                                             "<h2>Como apontar um erro</h2>", "Escreva para")]
        self.assertEqual(posicoes, sorted(posicoes))
        ctx = paginas.Contexto(textos=build.contexto(REPO, REPO, [])[0].textos)
        vazia = paginas.pagina_das_correcoes(ctx)
        posicoes = [vazia.index(x) for x in ('<p class="intro">', "Ainda não há correções nem atualizações.", "<h2>Como apontar um erro</h2>")]
        self.assertEqual(posicoes, sorted(posicoes))

    def test_planta_o_erro_antes_da_lista(self):
        html = self.ler("correcoes/index.html")
        erro = re.search(r'<section class="erro">.*?</section>', html, re.S).group(0)
        plantado = html.replace(erro, "").replace('<section class="correcoes-lista">', erro + '<section class="correcoes-lista">')
        self.assertLess(plantado.index("<h2>Como apontar um erro</h2>"), plantado.index('<section class="correcoes-lista">'))

    def test_a_data_a_hora_e_os_temas_de_uma_peca_publicada(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        cabeca = re.search(r'<header class="peca-cabeca">(.*?)</header>', html, re.S).group(1)
        ordem = ['<p class="eyebrow">Diário</p>', '<h1 class="peca-titulo">', '<p class="entrada">',
                 '<p class="publicada">Publicada a 16 de novembro de 2026, às 10h40.</p>',
                 '<p class="temas"><a href="/temas/ensaio/">']
        posicoes = [cabeca.index(x) for x in ordem]
        self.assertEqual(posicoes, sorted(posicoes))

    def test_planta_a_data_depois_dos_temas(self):
        html = self.ler("pecas/2026-11-16-peca-de-ensaio/index.html")
        publicada = re.search(r'<p class="publicada">.*?</p>', html).group(0)
        plantado = html.replace(publicada, "", 1).replace("</p></header>", "</p>" + publicada + "</header>", 1)
        cabeca = re.search(r'<header class="peca-cabeca">(.*?)</header>', plantado, re.S).group(1)
        self.assertGreater(cabeca.index('<p class="publicada">'), cabeca.index('<p class="temas">'))

    def test_um_rascunho_nao_tem_data_de_publicacao(self):
        peca, html, _ = pagina_plantada(self, [('[[estado]]\nestado = "publicada"', '[[estado]]\nestado = "rascunho"')])
        self.assertEqual(peca.estado, "rascunho")
        self.assertNotIn('class="publicada"', html)


# --------------------------------------------------------------------------- G. what conferir now says


class G_OQueOConferirDiz(unittest.TestCase):
    def resultados(self, trocas):
        p = Plantada(trocas)
        self.addCleanup(p.apagar)
        return p.resultados()

    def test_planta_o_id_de_uma_linha_num_campo_do_leitor(self):
        for campo, antes in (("onde", 'onde = "p. 2, primeiro parágrafo"'), ("mede", 'mede = "Inquiridos de ensaio que responderam"'),
                             ("periodo", 'periodo = "Segundo e terceiro trimestres de ensaio"'),
                             ("compara", 'compara = "A mesma medida'), ("diz", 'diz = "O despacho de ensaio foi assinado pela ministra de ensaio."')):
            depois = antes[:-1] + ' (ver a linha indice_anterior)"' if antes.endswith('"') else antes + " (ver indice_anterior)"
            r = self.resultados([(antes, depois)])
            self.assertEqual(r[9].estado, conf.FALHOU, campo)
            self.assertTrue(any(f"{campo} holds 'indice_anterior', the id of a line or source of this piece" in x for x in r[9].razoes),
                            r[9].linha())
        r = self.resultados([('onde = "tabela"', 'onde = "tabela, como em tabela_html"')])
        self.assertTrue(any("onde holds 'tabela_html'" in x for x in r[9].razoes), r[9].linha())

    def test_um_id_sem_traco_ou_dentro_de_outra_palavra_nao_conta(self):
        r = self.resultados([('mede = "Total de ensaio, inventado para os ensaios"', 'mede = "Total de ensaio (indice_anteriores)"')])
        self.assertEqual(r[9].estado, conf.PASSOU, r[9].linha())
        r = self.resultados([('mede = "Total de ensaio, inventado para os ensaios"', 'mede = "O total do indice de ensaio"')])
        self.assertEqual(r[9].estado, conf.PASSOU, r[9].linha())

    def test_onde_que_nomeia_um_paragrafo_e_uma_nota(self):
        r = self.resultados([])
        notas = [n for n in r[2].notas if "onde names a paragraph" in n]
        # indice and indice_anterior («primeiro parágrafo»), terco («segundo»), declaracao («último»)
        self.assertEqual([n.split(":")[0] for n in notas], ["indice", "indice_anterior", "terco", "declaracao"])
        self.assertEqual(r[2].estado, conf.PASSOU)

    def test_planta_onde_sem_paragrafo(self):
        r = self.resultados([('onde = "p. 2, primeiro parágrafo"', 'onde = "p. 2"')])
        self.assertEqual(len([n for n in r[2].notas if "onde names a paragraph" in n]), 3)

    def test_o_tamanho_de_um_diario(self):
        peca = ler(Plantada([]).peca)
        palavras, figuras = conf.tamanho(peca)
        self.assertEqual(figuras, 6)  # title 1; text: indice, indice_anterior, diferenca, total, terco (mostra_livre)
        self.assertEqual(conf.nota_de_tamanho(peca), [])
        longo = " ".join(["palavra"] * 500)
        r = self.resultados([("Esta é uma peça de ensaio.", "Esta é uma peça de ensaio. " + longo)])
        self.assertTrue(any(f"a diario of {palavras + 500} words of text and 6 printed figures" in n for n in r[1].notas), r[1].notas)
        self.assertEqual(r[1].estado, conf.PASSOU)
        # twenty figures is the size (edit of 13:44 UTC): 20 says nothing, 21 is a note
        for extra, nota in ((14, False), (15, True)):
            muitas = " ".join(["{indice}"] * extra)
            r = self.resultados([("Esta é uma peça de ensaio.", "Esta é uma peça de ensaio. " + muitas)])
            self.assertEqual(any(f"and {6 + extra} printed figures, past the size of a daily item (500 words, 20 figures)" in n
                                 for n in r[1].notas), nota, r[1].notas)

    def test_planta_os_titulos_de_fecho_contados(self):
        peca = ler(Plantada([]).peca)
        palavras, _ = conf.tamanho(peca)
        corpo_com_titulos = sum(1 for p in peca.corpo.split() if re.search(r"[^\W_]", p))
        self.assertLess(palavras, corpo_com_titulos)

    def test_um_artigo_nao_tem_nota_de_tamanho(self):
        longo = " ".join(["palavra"] * 600)
        r = self.resultados([('tipo = "diario"', 'tipo = "artigo"'), ("Esta é uma peça de ensaio.", "Esta é uma peça de ensaio. " + longo)])
        self.assertFalse(any("a diario of" in n for n in r[1].notas), r[1].notas)


if __name__ == "__main__":
    unittest.main()
