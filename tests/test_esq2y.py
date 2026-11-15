"""ESQ2d: the repairs after the second code and security reading (blocos/esq2/ORDEM-2d.md).
Section A: a test for each error planted in the reader's copy, failing if it becomes true.
Section B: the reader's findings. Section C: from the direction seat's use of the block.
(C6 is in test_esq2b and test_esq2h: the gate's tests use a record of their own.)"""
from __future__ import annotations

import contextlib
import hashlib
import io
import json
import shutil
import tempfile
import unittest
from pathlib import Path

from oedp import fontes, leituras, publicar, reconferir
from oedp import conferir as conf
from oedp import construir as build
from oedp.peca import ler
from tests.apoio import LOJA, PECA, REPO, Plantada, loja_fora_do_repositorio
from tests.test_esq2a import PLANTA_BOA, Base as BaseLeitura, bloco
from tests.test_esq2b import ANTERIOR, IMPLANTACAO, Base as BasePublicar
from tests.test_esq2c import HTML, TEXTOS
from tests.test_esq2x import PDF, ensaio_sem_pecas

JUIZ = '''
[[leitura]]
lugar = "juiz"
familia = "openai"
modelo = "modelo-de-ensaio"
inicio = "{inicio}"
fim = "{fim}"
impressao = "{impressao}"
plantas_postas = 1
plantas_apanhadas = 1
achados = 0
adotados = 0
veredicto = "passa"
pessoas_vistas = ["pessoa_de_ensaio"]
'''
ESTADO = '\n[[estado]]\nestado = "{estado}"\nem = "{em}"\npor = "ensaio"\nrazao = "Ensaio."\n'


def com_registo(caso, *tabelas: str) -> Plantada:
    """The test piece with tables appended to its record (as written by hand)."""
    p = Plantada()
    caso.addCleanup(p.apagar)
    impressao = ler(p.peca).impressao
    with open(p.peca, "a", encoding="utf-8") as f:
        for t in tabelas:
            f.write(t.replace("{impressao}", impressao))
    return p


# --------------------------------------------------------------------------- A


class A1VirgulaAntesDoNumero(unittest.TestCase):
    def test_100_nao_esta_em_2_virgula_100(self):
        self.assertIsNone(fontes.procurar("100", ["2,100"], None))
        self.assertIsNone(fontes.procurar("100", ["o valor 2,100 euros"], None))
        self.assertEqual(fontes.procurar("100", ["a, 100 b"], None), 1)  # a comma that follows no digit


class A2PromocaoComErroComparaOsDoisMinutos(BasePublicar):
    def test_uma_passagem_falha_e_depois_o_sitio_confere(self):
        self.primeira_linha()

        def correr(args, cwd):
            self.chamadas.append(args)
            if args[:2] == ["vercel", "deploy"]:
                return 0, f"{IMPLANTACAO}\n", ""
            return (1, "", "Error: reset\n") if args == ["vercel", "promote", IMPLANTACAO, "--yes"] else (0, "", "")

        servir = self.servir(self.c.estatica)
        falhou = [False]

        def buscar(url):  # the manifest times out once, then the site is the new build
            if url.endswith("/manifesto.json") and not falhou[0]:
                falhou[0] = True
                raise TimeoutError("timed out")
            return servir(url)

        self.correr = correr
        self.assertEqual(self.publicar(buscar=buscar), 0)
        self.assertTrue(falhou[0])
        self.assertEqual(self.registo()[-1]["resultado"], "no ar")
        self.assertNotIn(["vercel", "promote", ANTERIOR, "--yes"], self.chamadas)


class A3JuizComecadoAntesDaRetirada(unittest.TestCase):
    def test_planta_juiz_que_comecou_antes_e_acabou_depois(self):
        p = com_registo(self, ESTADO.format(estado="retirada", em="2026-11-14T09:00:00Z"),
                        JUIZ.format(inicio="2026-11-14T08:50:00Z", fim="2026-11-14T09:10:00Z", impressao="{impressao}"),
                        ESTADO.format(estado="publicada", em="2026-11-14T10:00:00Z"))
        r = p.resultados(LOJA)[4]
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("the piece was withdrawn at 2026-11-14T09:00:00Z and published again at 2026-11-14T10:00:00Z", r.linha())


# --------------------------------------------------------------------------- B


class B1PlantarLeOPacoteAntes(BaseLeitura):
    def test_planta_edicao_a_mao_entre_montar_e_plantar(self):
        pasta = self.montar("juiz")
        (pasta / "pacote" / "LEIA-ME.md").write_text("edited by hand\n", encoding="utf-8")
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, PLANTA_BOA)
        self.assertIn("refused: the package is not the one built (changed: LEIA-ME.md)", str(e.exception))
        self.assertFalse((pasta / "chave.json").exists())

    def test_planta_ficheiro_a_mais_entre_montar_e_plantar(self):
        pasta = self.montar("juiz")
        (pasta / "pacote" / "RASCUNHO.md").write_text("a draft\n", encoding="utf-8")
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, PLANTA_BOA)
        self.assertIn("not listed: RASCUNHO.md", str(e.exception))


class B2JuizEntreARetiradaEAPublicacao(unittest.TestCase):
    def test_planta_juiz_depois_da_publicacao(self):
        p = com_registo(self, ESTADO.format(estado="retirada", em="2026-11-14T09:00:00Z"),
                        ESTADO.format(estado="publicada", em="2026-11-14T10:00:00Z"),
                        JUIZ.format(inicio="2026-11-14T11:00:00Z", fim="2026-11-14T11:10:00Z", impressao="{impressao}"))
        r = p.resultados(LOJA)[4]
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("with no passing juiz reading begun after that withdrawal and ended before that publication", r.linha())

    def test_a_ordem_honesta(self):
        p = com_registo(self, ESTADO.format(estado="retirada", em="2026-11-14T09:00:00Z"),
                        JUIZ.format(inicio="2026-11-14T09:10:00Z", fim="2026-11-14T09:40:00Z", impressao="{impressao}"),
                        ESTADO.format(estado="publicada", em="2026-11-14T10:00:00Z"))
        self.assertEqual(conf.republicada_sem_juiz(ler(p.peca)), [])
        self.assertEqual(p.resultados(LOJA)[4].estado, conf.PASSOU, p.resultados(LOJA)[4].linha())


class B3PromocaoComErroDentroDoPrazo(BasePublicar):
    def test_buscas_de_nove_segundos(self):
        self.primeira_linha()
        quando = []

        def correr(args, cwd):
            quando.append((args, self.sono[0]))
            self.chamadas.append(args)
            if args[:2] == ["vercel", "deploy"]:
                return 0, f"{IMPLANTACAO}\n", ""
            return (1, "", "Error: reset\n") if args == ["vercel", "promote", IMPLANTACAO, "--yes"] else (0, "", "")

        def lenta(url):
            self.sono[0] += 9
            raise TimeoutError("timed out")

        self.correr = correr
        self.assertEqual(self.publicar(buscar=lenta), 1)
        volta = [t for args, t in quando if args == ["vercel", "promote", ANTERIOR, "--yes"]]
        self.assertEqual(len(volta), 1)
        self.assertLessEqual(volta[0], 130)


class B4SoSeEsvaziaUmaConstrucao(unittest.TestCase):
    def outros_ficheiros(self) -> Path:
        pasta = Path(tempfile.mkdtemp(prefix="oedp-outros-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "carta.txt").write_text("not a build\n", encoding="utf-8")
        (pasta / "fotos").mkdir()
        (pasta / "fotos" / "a.jpg").write_bytes(b"jpg")
        return pasta

    def construir(self, saida):
        vazia = Path(tempfile.mkdtemp(prefix="oedp-vazia-"))
        self.addCleanup(shutil.rmtree, vazia, True)
        return build.construir(REPO, raiz=vazia, saida=saida)

    def intacta(self, pasta):
        return sorted(f.relative_to(pasta).as_posix() for f in pasta.rglob("*"))

    def test_planta_ligacao_para_uma_pasta_de_outros_ficheiros(self):
        alvo = self.outros_ficheiros()
        antes = self.intacta(alvo)
        ligacao = Path(tempfile.mkdtemp(prefix="oedp-ligacao-")) / "saida"
        self.addCleanup(shutil.rmtree, ligacao.parent, True)
        ligacao.symlink_to(alvo)
        c = self.construir(ligacao)
        self.assertFalse(c.ok)
        self.assertIn(f"refused: {ligacao} is a symbolic link; give an output folder of its own", c.mensagens)
        self.assertEqual(self.intacta(alvo), antes)

    def test_planta_pasta_de_outros_ficheiros(self):
        alvo = self.outros_ficheiros()
        antes = self.intacta(alvo)
        c = self.construir(alvo)
        self.assertFalse(c.ok)
        self.assertTrue(any("is not empty and holds no earlier build (no static/manifesto.json)" in m for m in c.mensagens), c.mensagens)
        self.assertEqual(self.intacta(alvo), antes)

    def test_uma_pasta_vazia_ou_que_nao_existe(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        self.assertTrue(self.construir(pasta).ok)
        self.assertTrue(self.construir(pasta).ok)  # now an earlier build: emptied and built again
        self.assertTrue(self.construir(pasta / "nova").ok)


class B5Check6NaoLeACitacao(unittest.TestCase):
    def test_dia_errado_dentro_da_citacao_passa(self):
        p = Plantada([("excerto = '''As contas de ensaio estão certas'''",
                       "excerto = '''As contas de ensaio estão certas desde terça-feira, 16 de novembro de 2026'''")])
        self.addCleanup(p.apagar)
        self.assertEqual(p.resultados(LOJA)[6].estado, conf.PASSOU)

    def test_planta_o_mesmo_dia_errado_na_frase_que_a_introduz(self):
        p = Plantada([("A Pessoa de Ensaio, [ministra de ensaio]{declaracao}, disse {declaracao}.",
                       "A Pessoa de Ensaio, [ministra de ensaio]{declaracao}, disse na [terça-feira, 16 de novembro de 2026]{declaracao} {declaracao}.")])
        self.addCleanup(p.apagar)
        r = p.resultados(LOJA)[6]
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("corpo", r.linha())


# --------------------------------------------------------------------------- C


class C7CapturasDaPecaDeEnsaio(unittest.TestCase):
    def test_a_peca_de_ensaio_e_mandada_para_capturas_sem_peca(self):
        from oedp import __main__ as cli

        erro = io.StringIO()
        with contextlib.redirect_stderr(erro):
            self.assertEqual(cli.principal(["capturas", tempfile.gettempdir(), str(PECA)]), 2)
        self.assertIn("is the test piece, and its pages are taken by `python3 -m oedp capturas <folder>` with no piece named",
                      erro.getvalue())
        self.assertNotIn("OEDP_FONTES is not set", erro.getvalue())


class C8OCustoDeUmaLeitura(BaseLeitura):
    def lancar(self, registo_texto: str | None):
        pasta = self.montar("juiz")

        def substituto(args, ambiente):
            Path(args[3]).write_text(bloco([]), encoding="utf-8")
            if registo_texto is not None:
                Path(args[3] + ".eventos.log").write_text(registo_texto, encoding="utf-8")
            return 0, "codex exit=0 · modelo gpt-de-ensaio · raciocínio xhigh · 01:00:00 a 01:20:00 UTC\n"

        linhas = []
        self.assertEqual(leituras.lancar(pasta, executar=substituto, ambiente={"CODEX_RACIOCINIO": "xhigh"},
                                         imprimir=linhas.append), 0)
        return pasta, linhas

    def test_o_numero_vai_para_a_leitura_e_o_pontuar_mostra_o(self):
        pasta, _ = self.lancar("thinking\n...\ntokens used\n186,277\n")
        self.assertEqual(json.loads((pasta / "leitura.json").read_text())["tokens"], 186277)
        linhas = []
        leituras.pontuar(pasta, imprimir=linhas.append)
        self.assertIn("tokens used by the reading: 186277", linhas)

    def test_planta_registo_sem_a_linha(self):
        pasta, linhas = self.lancar("thinking\nno count here\n")
        self.assertNotIn("tokens", json.loads((pasta / "leitura.json").read_text()))
        self.assertTrue(any("has no line 'tokens used' followed by a number" in l for l in linhas), linhas)
        saida = []
        leituras.pontuar(pasta, imprimir=saida.append)
        self.assertIn("tokens used by the reading: not recorded", saida)
