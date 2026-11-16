"""ESQ2c: the repairs after the first code and security reading of the second block
(blocos/esq2/ORDEM-2c.md). Section A: a test for each of the five errors planted in the
reader's copy, failing if it becomes true. Section B: the reader's findings. Section C: from
the judge of the Method page. No network; `vercel`, curl and the launcher are stand-ins."""
from __future__ import annotations

import contextlib
import datetime as dt
import io
import json
import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import codigo, datas, fontes, leituras, navegador, publicar, reconferir, registo
from oedp import conferir as conf
from oedp import construir as build
from oedp.peca import ler
from tests.apoio import ENSAIOS, LOJA, PECA, REPO, Plantada, loja_fora_do_repositorio, perto_do_relogio
from tests.test_esq1d import DOCUMENTO, SitioFalso
from tests.test_esq2a import PDF, PLANTA_BOA, Base as BaseLeitura, ComLeitura, achado, bloco
from tests.test_esq2b import ANTERIOR, IMPLANTACAO, Base as BasePublicar
from tests.test_esq2b4 import NAO_LIGOU, RESPONDEU, curl
from tests.test_esq2c import HTML, TEXTOS

VAZIA = subprocess.CompletedProcess([], 52, "", "curl: (52) Empty reply from server")


# --------------------------------------------------------------------------- A


class A1FraseExata(ComLeitura):
    def test_planta_em_frase_8_nao_e_apanhada_por_frase_80(self):
        pasta, _ = self.lida(achados=[achado("frase 80", "trava", "a real blocking finding")])
        p = leituras.pontuar(pasta, imprimir=lambda *a: None)
        self.assertEqual((p["plantas_apanhadas"], p["achados"], p["veredicto"]), (0, 1, "nao_passa"))
        self.assertIn("real findings at trava: [1] (closed only by a repair read again)", p["razoes"])


class A2UltimaLinhaNoAr(unittest.TestCase):
    def test_a_ultima_linha_no_ar_e_a_que_volta(self):
        oficina = Path(tempfile.mkdtemp(prefix="oedp-oficina-"))
        self.addCleanup(shutil.rmtree, oficina, True)
        for n, (resultado, endereco) in enumerate((("no ar", "https://primeira.invalid"), ("no ar", "https://segunda.invalid"),
                                                   ("falhou: x", "https://terceira.invalid"))):
            publicar.acrescentar(oficina, {"em": f"2026-11-1{n}T00:00:00Z", "implantacao": endereco, "resultado": resultado})
        self.assertEqual(publicar.ultima_no_ar(oficina)["implantacao"], "https://segunda.invalid")


class A3ONavegadorContaNaImpressao(unittest.TestCase):
    def test_requirements_navegador_e_codigo(self):
        self.assertTrue(codigo.e_codigo("requirements-navegador.txt"))
        self.assertIn("requirements-navegador.txt", [n for n, _ in codigo.lista(REPO)])


class A4ResumoEExcerto(unittest.TestCase):
    """Proof 1's condition is decided in Python (navegador.recibo_a_vista) from the boxes the
    page reports, so it can be proved without a browser: both boxes must be in the window."""

    DENTRO, FORA = {"cima": 100, "baixo": 140, "altura": 40}, {"cima": -45, "baixo": -1, "altura": 44}

    def estado(self, resumo, excerto):
        return {"existe": True, "aberto": True, "janela": 844, "resumo": resumo, "excerto": excerto}

    def test_os_dois_na_janela(self):
        self.assertTrue(navegador.recibo_a_vista(self.estado(self.DENTRO, self.DENTRO)))

    def test_planta_so_o_resumo_ou_so_o_excerto(self):
        self.assertFalse(navegador.recibo_a_vista(self.estado(self.DENTRO, self.FORA)))
        self.assertFalse(navegador.recibo_a_vista(self.estado(self.FORA, self.DENTRO)))
        self.assertFalse(navegador.recibo_a_vista(self.estado(self.DENTRO, None)))
        self.assertFalse(navegador.recibo_a_vista({**self.estado(self.DENTRO, self.DENTRO), "aberto": False}))


class A5PlantarCorreACheck6(BaseLeitura):
    def test_planta_dia_da_semana_errado(self):
        pasta = self.montar("juiz")
        antes = self.todos(pasta / "pacote")
        lista = PLANTA_BOA.replace("[uma subida de]{diferenca}", "na segunda-feira, 16 de novembro]{indice}").replace(
            "[uma descida de]{diferenca}", "na terça-feira, 16 de novembro]{indice}")
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, lista)
        self.assertIn("a check gives another result on the planted piece (check 6: failed", str(e.exception))
        self.assertEqual(self.todos(pasta / "pacote"), antes)


# --------------------------------------------------------------------------- B


class B1PacoteIntacto(ComLeitura):
    def test_planta_ficheiro_mudado_a_mais_e_em_falta_antes_de_lancar(self):
        pasta = self.montar("juiz")
        texto = pasta / "pacote" / "TEXTO-NUMERADO.md"
        for mudar, mensagem in ((lambda: texto.write_text("outra coisa\n", encoding="utf-8"), "changed: TEXTO-NUMERADO.md"),
                                (lambda: (pasta / "pacote" / "RASCUNHO.md").write_text("x\n", encoding="utf-8"), "not listed: RASCUNHO.md"),
                                (lambda: (pasta / "pacote" / "LEIA-ME.md").unlink(), "missing: LEIA-ME.md")):
            mudar()
            linhas, chamadas = [], []
            codigo_saida = leituras.lancar(pasta, executar=lambda a, e: chamadas.append(a) or (0, ""),
                                           ambiente={"CODEX_RACIOCINIO": "xhigh"}, imprimir=linhas.append)
            self.assertEqual(codigo_saida, 2)
            self.assertEqual(chamadas, [])
            self.assertIn("refused: the package is not the one built", linhas[0])
            self.assertIn(mensagem, linhas[0])

    def test_planta_pacote_mudado_depois_de_plantado(self):
        pasta, p = self.lida(achados=[achado("frase 8")])
        dados = json.loads((pasta / "chave.json").read_text())
        self.assertIn("TEXTO-NUMERADO.md", dados["ficheiros"])
        (pasta / "pacote" / "peca.md").write_bytes((pasta / "pacote" / "peca.md").read_bytes() + b"\n")
        for passo in (lambda: leituras.pontuar(pasta, imprimir=lambda *a: None), lambda: leituras.registar(pasta, imprimir=lambda *a: None)):
            with self.assertRaises(leituras.Recusa) as e:
                passo()
            self.assertIn("refused: the package is not the one planted (changed: peca.md)", str(e.exception))
        self.assertFalse((pasta / "pontuacao.json").exists())


class B2Gravidade(ComLeitura):
    def test_planta_trava_com_maiuscula(self):
        pasta, _ = self.lida(achados=[achado("frase 8"), achado("frase 2", "Trava")])
        with self.assertRaises(leituras.Recusa) as e:
            leituras.pontuar(pasta, self.decisoes('[[decisao]]\nachado = 2\ndecisao = "recusado"\nrazao = "no"\n'),
                             imprimir=lambda *a: None)
        self.assertIn("[[achado]] number 2 has gravidade 'Trava', which is not exactly trava, corrigir or menor", str(e.exception))
        self.assertFalse((pasta / "pontuacao.json").exists())

    def test_o_comando_sai_com_dois(self):
        pasta, _ = self.lida(achados=[achado("frase 8", "grave")])
        erro = io.StringIO()
        from oedp import __main__ as cli
        with contextlib.redirect_stderr(erro):
            self.assertEqual(cli.principal(["leitura", "pontuar", str(pasta)]), 2)
        self.assertIn("gravidade 'grave'", erro.getvalue())


class B3ExcertoInteiro(unittest.TestCase):
    def test_a_regra(self):
        for texto in ("1000", "-100", "−100", "100,5", "2.100", "x100", "100x"):
            self.assertIsNone(fontes.procurar("100", [texto], None), texto)
        for texto in ("a 99 100 250 b", "total: 100.", "(100)", "100"):
            self.assertEqual(fontes.procurar("100", [texto], None), 1, texto)
        self.assertEqual(fontes.procurar("Total de ensaio: 1 234 567 euros", ["x Total de ensaio: 1 234 567 euros y"], None), 1)
        self.assertIsNone(fontes.procurar("O índice", ["NO índice"], None))

    def test_planta_excerto_cortado_no_meio_de_um_numero(self):
        p = Plantada([("excerto = '''Total de ensaio: 1 234 567 euros'''", "excerto = '''Total de ensaio: 1 234 56'''")])
        self.addCleanup(p.apagar)
        r = p.resultados(LOJA)[2]
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("total: the excerpt is not in the text of the stored copy of tabela_html", r.linha())

    def test_planta_reconferencia_com_o_numero_dentro_de_outro(self):
        loja = loja_fora_do_repositorio(self)
        oficina = Path(tempfile.mkdtemp(prefix="oedp-oficina-"))
        self.addCleanup(shutil.rmtree, oficina, True)
        p = Plantada([("excerto = '''Total de ensaio: 1 234 567 euros'''", "excerto = '''1 234 567'''")])
        self.addCleanup(p.apagar)
        self.assertEqual(p.resultados(LOJA)[2].estado, conf.PASSOU)  # the short excerpt is found whole today
        original = fontes.caminho_da_copia(loja, HTML).read_bytes()
        pdf = fontes.caminho_da_copia(loja, PDF).read_bytes()
        self.assertEqual(original.count(b"1&nbsp;234&nbsp;567"), 1)  # the stored table writes the spaces as entities
        for novo in (b"1&nbsp;234&nbsp;5678", b"-1&nbsp;234&nbsp;567", b"1&nbsp;234&nbsp;567,5"):
            pagina = original.replace(b"1&nbsp;234&nbsp;567", novo)
            buscar = lambda url, l, pagina=pagina: fontes.guardar(l, pdf if url.endswith(".pdf") else pagina)
            saida, rel = reconferir.reconferir([p.peca], loja, oficina, TEXTOS, retirar=False, buscar=buscar,
                                               imprimir=lambda *a: None)
            r = json.loads(rel.read_text())["fontes"][1]
            self.assertEqual((saida, r["resultado"], r["linhas"]), (1, "falhou", ["total"]), novo)


class B4So200(unittest.TestCase):
    def setUp(self):
        self.loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, self.loja, True)
        from oedp import direitos
        self.direitos = Path(tempfile.mkdtemp(prefix="oedp-direitos-"))
        self.addCleanup(shutil.rmtree, self.direitos, True)
        (self.direitos / "fim.invalid.toml").write_text((ENSAIOS / "direitos" / "example.org.toml").read_text(encoding="utf-8"),
                                                        encoding="utf-8")
        self.de = direitos.para_buscar(self.direitos)
        self.s = SitioFalso({"https://fim.invalid/doc": (206, DOCUMENTO, "")}, {"fim.invalid": ["93.184.216.34"]})

    def guardados(self):
        return [f for f in self.loja.rglob("*") if f.is_file() and f.name != "hosts.json"]

    def test_planta_resposta_parcial_em_fonte_pagina_e_termos(self):
        for chamar in (lambda: fontes.buscar("https://fim.invalid/doc", self.loja, self.de, self.s.transporte, False, self.s.resolver),
                       lambda: fontes.buscar("https://fim.invalid/doc", self.loja, None, self.s.transporte, True, self.s.resolver),
                       lambda: fontes.com_pagina("", "https://fim.invalid/doc", self.loja, self.de, self.s.transporte, self.s.resolver)):
            with self.assertRaises(fontes.ErroDaLoja) as e:
                chamar()
            self.assertIn("answered 206; only an answer 200 is stored", str(e.exception))
        self.assertEqual(self.guardados(), [])

    def test_planta_resposta_parcial_na_reconferencia_nao_retira(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        oficina = Path(tempfile.mkdtemp(prefix="oedp-oficina-"))
        self.addCleanup(shutil.rmtree, oficina, True)
        antes = p.peca.read_bytes()
        buscar = lambda url, loja: fontes.buscar("https://fim.invalid/doc", loja, self.de, self.s.transporte, False, self.s.resolver)
        saida, rel = reconferir.reconferir([p.peca], self.loja, oficina, TEXTOS, buscar=buscar, imprimir=lambda *a: None)
        self.assertEqual(saida, 1)
        self.assertEqual({r["resultado"] for r in json.loads(rel.read_text())["fontes"]}, {"inacessivel"})
        self.assertEqual(p.peca.read_bytes(), antes)


class B5PrazoDoRelogio(BasePublicar):
    def test_planta_buscas_que_param(self):
        self.primeira_linha()
        quando = []
        base = self.correr

        def correr(args, cwd):
            quando.append((args, self.sono[0]))
            return base(args, cwd)

        def parada(url):  # every fetch stalls for its whole BUSCA_S seconds
            self.sono[0] += publicar.BUSCA_S
            raise TimeoutError("timed out")

        self.correr = correr
        self.assertEqual(self.publicar(buscar=parada), 1)
        volta = [t for args, t in quando if args == ["vercel", "promote", ANTERIOR, "--yes"]]
        self.assertEqual(len(volta), 1)
        self.assertLessEqual(volta[0], publicar.ESPERA_S + publicar.BUSCA_S)


class B6PromocaoComErro(BasePublicar):
    def correr_com_erro(self, args, cwd):
        self.chamadas.append(args)
        if args[:2] == ["vercel", "deploy"]:
            return 0, f"{IMPLANTACAO}\n", ""
        if args == ["vercel", "promote", IMPLANTACAO, "--yes"]:
            return 1, "", "Error: the connection was reset\n"
        return 0, "", ""

    def test_tomou_efeito_regista_no_ar(self):
        self.primeira_linha()
        self.correr = self.correr_com_erro
        self.assertEqual(self.publicar(), 0)
        ultima = self.registo()[-1]
        self.assertEqual((ultima["resultado"], ultima["nota"]), ("no ar", "vercel promote had exited 1"))
        self.assertNotIn(["vercel", "promote", ANTERIOR, "--yes"], self.chamadas)

    def antigo(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-antigo-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        return ensaio_sem_pecas(pasta)

    def test_nao_tomou_efeito_nada_a_desfazer(self):
        antigo = self.antigo()
        import hashlib
        self.primeira_linha(hashlib.sha256((antigo / "index.html").read_bytes()).hexdigest())
        self.correr = self.correr_com_erro
        self.assertEqual(self.publicar(buscar=self.servir(antigo)), 1)
        self.assertNotIn(["vercel", "promote", ANTERIOR, "--yes"], self.chamadas)
        self.assertIn("falhou: vercel promote exited 1; the public address still serves", self.registo()[-1]["resultado"])

    def test_outra_coisa_no_ar_volta_atras(self):
        self.primeira_linha("c" * 64)
        self.correr = self.correr_com_erro
        self.assertEqual(self.publicar(buscar=self.servir(self.antigo())), 1)
        self.assertIn(["vercel", "promote", ANTERIOR, "--yes"], self.chamadas)


def ensaio_sem_pecas(pasta: Path) -> Path:
    from oedp import ensaio
    c = ensaio.construir_ensaio(pasta, com_pecas=False, conferir_antes=False)
    assert c.ok, c.mensagens
    return c.estatica


class B7SoOQueFoiConstruido(BasePublicar):
    def test_construir_esvazia_a_pasta_inteira(self):
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        (saida / "static").mkdir()
        (saida / "static" / "manifesto.json").write_text("{}\n", encoding="utf-8")  # an earlier build
        (saida / "functions").mkdir()
        (saida / "functions" / "velha.func").write_text("left by another build\n", encoding="utf-8")
        vazia = Path(tempfile.mkdtemp(prefix="oedp-vazia-"))
        self.addCleanup(shutil.rmtree, vazia, True)
        self.assertTrue(build.construir(REPO, raiz=vazia, saida=saida).ok)
        self.assertEqual(sorted(f.name for f in saida.iterdir()), ["config.json", "static"])

    def test_planta_publicar_com_sobras_na_saida(self):
        self.primeira_linha()
        (self.c.estatica.parent / "functions").mkdir()
        self.assertEqual(self.publicar(), 1)
        self.assertTrue(any("holds functions, which this build did not make" in l for l in self.linhas), self.linhas)
        self.assertEqual(self.chamadas, [])

    def test_planta_caminho_privado_na_configuracao(self):
        repo = Path(tempfile.mkdtemp(prefix="oedp-repo-"))
        self.addCleanup(shutil.rmtree, repo, True)
        for nome in ("textos.toml", "sitio.toml"):
            shutil.copy2(REPO / nome, repo / nome)
        shutil.copytree(REPO / "public", repo / "public")
        vercel = json.loads((REPO / "vercel.json").read_text(encoding="utf-8"))
        vercel["routes"][0]["headers"]["X-Origem"] = "/" + "Users/alguem/site"
        (repo / "vercel.json").write_text(json.dumps(vercel), encoding="utf-8")
        vazia, saida = Path(tempfile.mkdtemp(prefix="oedp-vazia-")), Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, vazia, True)
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(repo, raiz=vazia, saida=saida)
        self.assertFalse(c.ok)
        self.assertTrue(any(m.startswith("check 8: built file config.json: a machine path") for m in c.mensagens), c.mensagens)


class B8LugaresDaFolha(BaseLeitura):
    def test_uma_fonte_planta_se_em_fonte(self):
        pasta = self.montar("numeros")
        self.plantar(pasta, f'''
[[planta]]
id = "Q4"
ficheiro = "folha.toml"
antes = 'titulo = "Documento de ensaio com números inventados"'
depois = 'titulo = "Documento oficial com números verdadeiros"'
descricao = "the source's title is not the document's"
desmente = "Documento de ensaio com números inventados. Não é uma fonte real."
desmente_em = "fontes/{PDF}.txt"
''')
        self.assertEqual(json.loads((pasta / "chave.json").read_text())["plantas"][0]["lugares"], ["fonte doc_pdf"])

    def test_planta_numa_pessoa_sem_frase_que_mude(self):
        for lugar, ficheiro, mensagem in (("numeros", "folha.toml", "the plant changed nothing a finding could name"),
                                          ("juiz", "peca.md", "the numbered text did not change")):
            pasta = self.montar(lugar)
            with self.assertRaises(leituras.Recusa) as e:
                self.plantar(pasta, f'''
[[planta]]
id = "Q5"
ficheiro = "{ficheiro}"
antes = 'cargo = "ministra de ensaio"'
depois = 'cargo = "secretária de ensaio"'
descricao = "the person's role is not the one the source gives"
desmente = "disse a Pessoa de Ensaio, ministra de ensaio"
desmente_em = "fontes/{HTML}.txt"
''')
            self.assertIn(mensagem, str(e.exception))


class B9RegistarOutraVez(ComLeitura):
    def test_planta_registo_interrompido(self):
        pasta, p = self.lida(achados=[achado("frase 8")], extra='pessoas_vistas = ["pessoa_de_ensaio"]\n')
        leituras.pontuar(pasta, imprimir=lambda *a: None)
        leituras.registar(pasta, imprimir=lambda *a: None)
        dados = json.loads((pasta / "leitura.json").read_text())
        del dados["registada_em"]  # as if the run had stopped after appending, before marking
        (pasta / "leitura.json").write_text(json.dumps(dados))
        antes = p.peca.read_bytes()
        with self.assertRaises(leituras.Recusa) as e:
            leituras.registar(pasta, imprimir=lambda *a: None)
        self.assertIn("already holds a juiz reading with this start, end and fingerprint", str(e.exception))
        self.assertEqual(p.peca.read_bytes(), antes)


class B10OutroProtocoloTambemTentaOutraVez(unittest.TestCase):
    def transportar(self, respostas):
        chamadas, correr = curl(respostas)
        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            r = fontes.transporte_curl("https://e.invalid/", Path(tempfile.gettempdir()) / "oedp-t")
        return chamadas, r

    def test_resposta_vazia_e_depois_sem_ligacao_uma_vez(self):
        chamadas, r = self.transportar([VAZIA, NAO_LIGOU, RESPONDEU])
        self.assertEqual(len(chamadas), 3)
        self.assertIn("--http1.1", chamadas[1])
        self.assertIn("--http1.1", chamadas[2])
        self.assertEqual((r.saida, r.sem_ligacao), (0, False))

    def test_planta_resposta_vazia_e_depois_sem_ligacao_duas_vezes(self):
        chamadas, r = self.transportar([VAZIA, NAO_LIGOU, NAO_LIGOU, RESPONDEU])
        self.assertEqual(len(chamadas), 3)
        self.assertTrue(r.sem_ligacao)
        self.assertEqual(r.erro, "e.invalid did not connect within 10 seconds, twice")

    def test_um_head_que_nao_ligou_nao_fica_na_memoria(self):
        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, loja, True)
        memoria = fontes.memoria_da_loja(loja)
        s = SitioFalso({}, {"e.invalid": ["93.184.216.34"]})

        def transporte(url, destino, metodo="GET", endereco=None, **kw):
            if metodo == "HEAD":
                return fontes.Resposta(28, 0, url, "", 0, "e.invalid did not connect within 10 seconds, twice", sem_ligacao=True)
            return s.transporte(url, destino, metodo, endereco)

        with self.assertRaises(fontes.ErroDaLoja):
            fontes.seguir("https://e.invalid/doc", loja, transporte, s.resolver, memoria)
        self.assertFalse(memoria.sabe("e.invalid", "sem_head"))


# --------------------------------------------------------------------------- C


def ultimo_instante_do_registo(caminho: Path) -> dt.datetime:
    """The latest instant on a piece's own record: every inicio, fim and em of every table."""
    registo = ler(caminho).registo
    return max(i for tabelas in registo.values() if isinstance(tabelas, list) for t in tabelas if isinstance(t, dict)
               for k in ("inicio", "fim", "em") if (i := datas.instante_real(str(t.get(k, "")))))


def _instante(i: dt.datetime) -> str:
    return i.strftime("%Y-%m-%dT%H:%M:%SZ")


class C11RepublicarPedeJuizNovo(unittest.TestCase):
    # The order of the instants (ORDEM-3g, C1, second form), each read from the test piece's own
    # record, none typed: every step and reading on that record (the last of them, ULTIMO); the
    # withdrawal, a minute after it; the new juiz reading of juiz_novo, from two to three minutes
    # after it; the publication table written by hand, at four minutes; the publication by the
    # command, at five, with the clock the command reads (registo.agora) pinned to that instant.
    # So nothing on the record can lie between the withdrawal and a publication but the new
    # reading, and no test of this class depends on the day it runs. Typed, the withdrawal fell
    # two days before the record's readings, the command published at the real clock, and the
    # first test failed from the day the record's first juiz reading ended (16 November 2026,
    # 10:25 UTC). That the command reads the real clock when nothing is pinned is tested below.
    ULTIMO = ultimo_instante_do_registo(PECA)
    RETIRADA_EM = _instante(ULTIMO + dt.timedelta(minutes=1))
    JUIZ_INICIO, JUIZ_FIM = _instante(ULTIMO + dt.timedelta(minutes=2)), _instante(ULTIMO + dt.timedelta(minutes=3))
    PUBLICADA_A_MAO_EM = _instante(ULTIMO + dt.timedelta(minutes=4))
    PUBLICADA_EM = _instante(ULTIMO + dt.timedelta(minutes=5))  # the command's publication, pinned
    RETIRADA = f'\n[[estado]]\nestado = "retirada"\nem = "{RETIRADA_EM}"\npor = "ensaio"\nrazao = "Ensaio."\n'

    def retirada(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        with open(p.peca, "a", encoding="utf-8") as f:
            f.write(self.RETIRADA)
        return p

    def publicar(self, p):
        from oedp import __main__ as cli
        erro = io.StringIO()
        with mock.patch.dict(os.environ, {"OEDP_FONTES": str(loja_fora_do_repositorio(self))}), \
                mock.patch.object(registo, "agora", return_value=self.PUBLICADA_EM), contextlib.redirect_stderr(erro):
            saida = cli.principal(["estado", str(p.peca), "publicada", "--razao", "Ensaio."])
        return saida, erro.getvalue()

    def juiz_novo(self, p):
        peca = ler(p.peca)
        registo.acrescentar(p.peca, "leitura", {
            "lugar": "juiz", "familia": "openai", "modelo": "modelo-de-ensaio", "inicio": self.JUIZ_INICIO,
            "fim": self.JUIZ_FIM, "impressao": peca.impressao, "plantas_postas": 1, "plantas_apanhadas": 1,
            "achados": 0, "adotados": 0, "veredicto": "passa", "pessoas_vistas": ["pessoa_de_ensaio"]})

    def test_planta_retirada_e_publicada_sem_nada_entre_as_duas(self):
        p = self.retirada()
        antes = p.peca.read_bytes()
        saida, erro = self.publicar(p)
        self.assertEqual(saida, 1, erro)
        self.assertIn(f"the piece was withdrawn at {self.RETIRADA_EM} and published again at {self.PUBLICADA_EM} ", erro)
        self.assertIn("with no passing juiz reading begun after that withdrawal and ended before that publication", erro)
        self.assertEqual(p.peca.read_bytes(), antes)

    def test_planta_tabela_escrita_a_mao(self):
        p = self.retirada()
        with open(p.peca, "a", encoding="utf-8") as f:
            f.write(f'\n[[estado]]\nestado = "publicada"\nem = "{self.PUBLICADA_A_MAO_EM}"\npor = "a mao"\nrazao = "Ensaio."\n')
        r = p.resultados(LOJA)[4]
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn(f"the piece was withdrawn at {self.RETIRADA_EM} and published again at {self.PUBLICADA_A_MAO_EM}", r.linha())

    def test_nenhuma_leitura_do_registo_comeca_depois_da_retirada(self):
        leituras_do_registo = ler(PECA).registo.get("leitura", [])
        self.assertTrue(leituras_do_registo)
        self.assertTrue(all(datas.instante_real(l["inicio"]) < datas.instante_real(self.RETIRADA_EM) for l in leituras_do_registo))
        self.assertLess(datas.instante_real(self.RETIRADA_EM), datas.instante_real(self.JUIZ_INICIO))
        self.assertLess(datas.instante_real(self.JUIZ_FIM), datas.instante_real(self.PUBLICADA_A_MAO_EM))
        self.assertLess(datas.instante_real(self.JUIZ_FIM), datas.instante_real(self.PUBLICADA_EM))

    def test_retirada_julgada_outra_vez_e_publicada(self):
        p = self.retirada()
        self.juiz_novo(p)
        saida, erro = self.publicar(p)
        self.assertEqual(saida, 0, erro)
        self.assertEqual(ler(p.peca).estado, "publicada")
        self.assertEqual(ler(p.peca).registo["estado"][-1]["em"], self.PUBLICADA_EM)

    def test_sem_o_pino_o_comando_le_o_relogio_real(self):
        # A withdrawal needs no judgment: the command writes its em from the clock, unpinned.
        from oedp import __main__ as cli
        p = Plantada()
        self.addCleanup(p.apagar)
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(cli.principal(["estado", str(p.peca), "retirada", "--razao", "Ensaio."]), 0)
        escrito = datas.instante_real(ler(p.peca).registo["estado"][-1]["em"])
        self.assertTrue(perto_do_relogio(escrito, dt.datetime.now(dt.timezone.utc), 120), escrito)


class C12ReconferirRetiraPorOmissao(unittest.TestCase):
    def test_por_omissao_retira(self):
        loja = loja_fora_do_repositorio(self)
        oficina = Path(tempfile.mkdtemp(prefix="oedp-oficina-"))
        self.addCleanup(shutil.rmtree, oficina, True)
        p = Plantada()
        self.addCleanup(p.apagar)
        html = fontes.caminho_da_copia(loja, HTML).read_bytes()
        buscar = lambda url, l: fontes.guardar(l, b"<html><body>outra coisa</body></html>" if url.endswith(".pdf") else html)
        saida, _ = reconferir.reconferir([p.peca], loja, oficina, TEXTOS, buscar=buscar, imprimir=lambda *a: None)
        self.assertEqual(saida, 1)
        self.assertEqual(ler(p.peca).estado, "retirada")

    def test_o_comando_tem_so_relatar_e_nao_retirar(self):
        from oedp import __main__ as cli
        with mock.patch.object(cli, "cmd_reconferir", return_value=0) as m:
            cli.principal(["reconferir", "--so-relatar"])
        self.assertTrue(m.call_args[0][0].so_relatar)
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit):
            cli.principal(["reconferir", "--retirar"])
