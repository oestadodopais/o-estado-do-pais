"""ESQ2e: the repairs after the third code and security reading (blocos/esq2/ORDEM-2e.md).
Section A: a test for each error planted in the reader's copy. Section B: the rule for a
withdrawn piece coming back. Section C: git's per-repository variables kept away from every
git command, so that the suite cannot act on the repository it runs in."""
from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import ambiente, leituras, registo
from oedp import conferir as conf
from oedp import construir as build
from oedp.peca import ler
from tests.apoio import LOJA, REPO, Plantada
from tests.test_esq2b import ANTERIOR, IMPLANTACAO, Base as BasePublicar
from tests.test_esq2x import ensaio_sem_pecas
from tests.test_esq2a import Base as BaseLeitura, bloco
from tests.test_esq2y import ESTADO, JUIZ

F0 = "eb4440a8e2428baca143cc2ab8bb9eecc2f9c7aa20357c2ad519d785fd64a5a1"  # the test piece's fingerprint before any change


# --------------------------------------------------------------------------- A


class A1ManifestoEOSinal(unittest.TestCase):
    def test_planta_pasta_com_static_sem_manifesto(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-outros-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "static").mkdir()
        (pasta / "carta.txt").write_text("not a build\n", encoding="utf-8")
        (pasta / "fotos").mkdir()
        (pasta / "fotos" / "a.jpg").write_bytes(b"jpg")
        antes = sorted(f.relative_to(pasta).as_posix() for f in pasta.rglob("*"))
        vazia = Path(tempfile.mkdtemp(prefix="oedp-vazia-"))
        self.addCleanup(shutil.rmtree, vazia, True)
        c = build.construir(REPO, raiz=vazia, saida=pasta)
        self.assertFalse(c.ok)
        self.assertTrue(any("holds no earlier build (no static/manifesto.json)" in m for m in c.mensagens), c.mensagens)
        self.assertEqual(sorted(f.relative_to(pasta).as_posix() for f in pasta.rglob("*")), antes)


class A2ARespostaMaisRecente(BasePublicar):
    def correr_com_erro(self, args, cwd):
        self.chamadas.append(args)
        if args[:2] == ["vercel", "deploy"]:
            return 0, f"{IMPLANTACAO}\n", ""
        return (1, "", "Error: reset\n") if args == ["vercel", "promote", IMPLANTACAO, "--yes"] else (0, "", "")

    def sitio(self, primeira, depois):
        """`primeira` answers every address in the first pass, `depois` in every later one."""
        passagens = [0]

        def buscar(url):
            if url.endswith("/manifesto.json"):
                passagens[0] += 1
            return (primeira if passagens[0] <= 1 else depois)(url)
        return buscar

    def preparar_antigo(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-antigo-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        antigo = ensaio_sem_pecas(pasta)
        self.primeira_linha(hashlib.sha256((antigo / "index.html").read_bytes()).hexdigest())
        self.correr = self.correr_com_erro
        return self.servir(antigo)

    def test_antes_o_antigo_depois_outra_coisa_volta_atras(self):
        antigo = self.preparar_antigo()
        self.assertEqual(self.publicar(buscar=self.sitio(antigo, lambda url: b"something else")), 1)
        self.assertIn(["vercel", "promote", ANTERIOR, "--yes"], self.chamadas)

    def test_antes_outra_coisa_depois_o_antigo_nao_volta_atras(self):
        antigo = self.preparar_antigo()
        self.assertEqual(self.publicar(buscar=self.sitio(lambda url: b"something else", antigo)), 1)
        self.assertNotIn(["vercel", "promote", ANTERIOR, "--yes"], self.chamadas)
        self.assertIn("the public address still serves", self.registo()[-1]["resultado"])


class A3TokensQueNaoSaoUmNumero(BaseLeitura):
    def lancar(self, registo_texto: str):
        pasta = self.montar("juiz")

        def substituto(args, ambiente_):
            Path(args[3]).write_text(bloco([]), encoding="utf-8")
            Path(args[3] + ".eventos.log").write_text(registo_texto, encoding="utf-8")
            return 0, "codex exit=0 · modelo gpt-de-ensaio · raciocínio xhigh · 01:00:00 a 01:20:00 UTC\n"

        linhas = []
        self.assertEqual(leituras.lancar(pasta, executar=substituto, ambiente={"CODEX_RACIOCINIO": "xhigh"},
                                         imprimir=linhas.append), 0)
        return pasta, linhas

    def test_planta_linha_sem_numero(self):
        for registo_texto in ("tokens used\nnot available\n", "tokens used\n\n", "tokens used\n"):
            pasta, linhas = self.lancar(registo_texto)
            self.assertNotIn("tokens", json.loads((pasta / "leitura.json").read_text()), registo_texto)
            self.assertTrue(any("has no line 'tokens used' followed by a number" in l for l in linhas), linhas)


# --------------------------------------------------------------------------- B


def com_registo(caso, trocas, *tabelas: str) -> Plantada:
    p = Plantada(trocas)
    caso.addCleanup(p.apagar)
    atual = ler(p.peca).impressao
    with open(p.peca, "a", encoding="utf-8") as f:
        for t in tabelas:
            f.write(t.replace("{impressao}", atual))
    return p


CORRECAO = '''
[[correcao]]
em = "2026-11-14T11:00:00Z"
especie = "correcao"
antes = "Este ensaio concede-a."
depois = "Este ensaio concede-a sem reservas."
razao = "Correção de ensaio."
causa = "juiz"
impressao_antes = "{antes}"
impressao_depois = "{impressao}"
'''
MUDAR_O_TEXTO = [("Este ensaio concede-a.", "Este ensaio concede-a sem reservas.")]


class B1JuizNaImpressaoDeEntao(unittest.TestCase):
    def test_retirada_julgada_publicada_e_depois_corrigida(self):
        # the reader's sequence: withdrawn, judged on the fingerprint of then, published, corrected
        p = com_registo(self, MUDAR_O_TEXTO,
                        ESTADO.format(estado="retirada", em="2026-11-14T09:00:00Z"),
                        JUIZ.format(inicio="2026-11-14T09:10:00Z", fim="2026-11-14T09:40:00Z", impressao=F0),
                        ESTADO.format(estado="publicada", em="2026-11-14T10:00:00Z"),
                        CORRECAO.replace("{antes}", F0),
                        JUIZ.format(inicio="2026-11-14T11:10:00Z", fim="2026-11-14T11:30:00Z", impressao="{impressao}"))
        self.assertNotEqual(ler(p.peca).impressao, F0)
        self.assertEqual(conf.republicada_sem_juiz(ler(p.peca)), [])
        r = p.resultados(LOJA)[4]
        self.assertEqual(r.estado, conf.PASSOU, r.linha())

    def test_planta_juiz_numa_impressao_que_a_peca_nunca_teve(self):
        p = com_registo(self, (),
                        ESTADO.format(estado="retirada", em="2026-11-14T09:00:00Z"),
                        JUIZ.format(inicio="2026-11-14T09:10:00Z", fim="2026-11-14T09:40:00Z", impressao="f" * 64),
                        ESTADO.format(estado="publicada", em="2026-11-14T10:00:00Z"))
        r = p.resultados(LOJA)[4]
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("with no passing juiz reading begun after that withdrawal and ended before that publication "
                      "(on a fingerprint the piece had", r.linha())


class B2NadaAcabaAntesDeComecar(unittest.TestCase):
    def test_planta_juiz_das_11_00_as_09_10(self):
        p = com_registo(self, (),
                        ESTADO.format(estado="retirada", em="2026-11-14T09:00:00Z"),
                        JUIZ.format(inicio="2026-11-14T11:00:00Z", fim="2026-11-14T09:10:00Z", impressao="{impressao}"),
                        ESTADO.format(estado="publicada", em="2026-11-14T10:00:00Z"))
        r = p.resultados(LOJA)[9]
        self.assertEqual(r.estado, conf.FALHOU)
        self.assertIn("fim 2026-11-14T09:10:00Z is before inicio 2026-11-14T11:00:00Z; nothing on a record ends before it begins",
                      r.linha())

    def test_registar_recusa_escrever_um(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        antes = p.peca.read_bytes()
        for tabela, campos in (("leitura", {"lugar": "juiz", "familia": "openai", "modelo": "m", "inicio": "2026-11-14T11:00:00Z",
                                            "fim": "2026-11-14T09:10:00Z", "impressao": ler(p.peca).impressao,
                                            "plantas_postas": 1, "plantas_apanhadas": 1, "achados": 0, "adotados": 0,
                                            "veredicto": "passa"}),
                               ("passo", {"nome": "edicao", "lugar": "direcao", "familia": "anthropic", "modelo": "m",
                                          "inicio": "2026-11-14T11:00:00Z", "fim": "2026-11-14T10:00:00Z"})):
            with self.assertRaises(registo.ErroDoRegisto) as e:
                registo.acrescentar(p.peca, tabela, campos)
            self.assertIn("nothing on a record ends before it begins", str(e.exception))
        self.assertEqual(p.peca.read_bytes(), antes)

    def test_o_registo_do_codigo_tambem(self):
        from oedp import codigo
        from tests.test_esq2h import leitura, passo
        tabelas = [passo(), ("leitura", {**leitura("a" * 64)[1], "inicio": "2026-11-15T05:00:00Z", "fim": "2026-11-15T04:00:00Z"})]
        self.assertTrue(any("nothing on a record ends before it begins" in x for x in codigo.erros_do_registo(tabelas)))


# --------------------------------------------------------------------------- C


class C3AsVariaveisDoGit(unittest.TestCase):
    def test_a_lista_inclui_o_dir_e_o_index(self):
        for nome in ("GIT_DIR", "GIT_INDEX_FILE", "GIT_WORK_TREE", "GIT_COMMON_DIR", "GIT_OBJECT_DIRECTORY"):
            self.assertIn(nome, ambiente.variaveis_locais())
        self.assertNotIn("GIT_DIR", ambiente.sem_git_local({"GIT_DIR": "/x", "HOME": "/h"}))
        self.assertEqual(ambiente.sem_git_local({"GIT_DIR": "/x", "HOME": "/h"}), {"HOME": "/h"})

    def test_o_comando_limpa_as_variaveis_ao_comecar(self):
        from oedp import __main__ as cli

        with mock.patch.dict(os.environ, {"GIT_DIR": "/nao/existe/.git", "GIT_INDEX_FILE": "/nao/existe/index"}):
            with mock.patch("sys.stdout"):
                self.assertEqual(cli.principal(["impressao", "codigo"]), 0)
            self.assertNotIn("GIT_DIR", os.environ)
            self.assertNotIn("GIT_INDEX_FILE", os.environ)

    def test_planta_um_git_init_herda_o_git_dir_de_outro_repositorio(self):
        raiz = Path(tempfile.mkdtemp(prefix="oedp-git-"))
        self.addCleanup(shutil.rmtree, raiz, True)
        outro, alvo = raiz / "outro", raiz / "alvo"
        subprocess.run(["git", "init", "-q", str(outro)], check=True, env=ambiente.sem_git_local())
        configuracao = (outro / ".git" / "config").read_bytes()
        alvo.mkdir()
        herdado = {**ambiente.sem_git_local(), "GIT_DIR": str(outro / ".git")}
        # The plant: with the inherited GIT_DIR, `git -C alvo init --bare` acts on the other repository.
        subprocess.run(["git", "-C", str(alvo), "init", "-q", "--bare"], check=True, env=herdado)
        self.assertFalse((alvo / ".git").exists() or (alvo / "HEAD").exists())
        self.assertNotEqual((outro / ".git" / "config").read_bytes(), configuracao)  # core.bare = true written there
        # The repair: the same command with the environment the tests give it acts on its folder.
        (outro / ".git" / "config").write_bytes(configuracao)
        subprocess.run(["git", "-C", str(alvo), "init", "-q", "--bare"], check=True, env=ambiente.sem_git_local(herdado))
        self.assertTrue((alvo / "HEAD").is_file())
        self.assertEqual((outro / ".git" / "config").read_bytes(), configuracao)
