"""The thirteen items of the code and security reading (work order ESQ1d), each with a plant.

And the five errors that were planted in the reader's copy of the tree: each has a
test here or elsewhere that would catch it if it ever became true.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path
from unittest import mock

from oedp import conferir as conf
from oedp import construir as build
from oedp import derivacoes, fontes, noar, numeros, paginas
from oedp.peca import impressoes, ler
from oedp.ambiente import sem_git_local
from tests.apoio import ENSAIOS, LOJA, PECA, REPO, Plantada, loja_fora_do_repositorio, sitio_de_ensaio


class Base(unittest.TestCase):
    def plantar(self, trocas=(), loja=LOJA, anterior=("absent", None), depois=None):
        p = Plantada(trocas)
        self.addCleanup(p.apagar)
        if depois:
            depois(p)
        peca = ler(p.peca)
        ctx, _ = build.contexto(REPO, p.pasta, [peca] if peca.vinculada else [])
        return {r.verificacao: r for r in conf.conferir_peca(p.peca, ctx, loja, anterior=anterior)}, p

    def falha(self, r, n, motivo):
        self.assertEqual(r[n].estado, conf.FALHOU, r[n].linha())
        self.assertTrue(any(motivo in x for x in r[n].razoes), r[n].linha())


def retirar(p):
    with open(p.peca, "a", encoding="utf-8") as f:
        f.write('\n[[estado]]\nestado = "retirada"\nem = "2026-11-17T09:00:00Z"\npor = "ensaio"\nrazao = "Razão de ensaio."\n')


def sem_correcao(p):
    texto = p.peca.read_text(encoding="utf-8")
    p.peca.write_text(texto[: texto.index("\n[[correcao]]")] + "\n", encoding="utf-8")


def versao_anterior() -> bytes:
    """The test piece as it was before its correction: the earlier lead, the record up to publication."""
    acima, registo = PECA.read_bytes().split(b"+++ registo\n", 1)
    acima = acima.replace(b"escrita para provar o esqueleto", b"escrita para ensaiar o esqueleto")
    # the headings it had then, before the edit of 15 November 2026
    acima = acima.replace("## O melhor argumento contra esta leitura\n".encode(), "## A objeção mais forte\n".encode())
    acima = acima.replace("## O que acompanhar\n".encode(), "## O que seguir\n".encode())
    j = registo.index(b"\n[[leitura]]", registo.index(b"\n[[estado]]"))
    return acima + b"+++ registo\n" + registo[: j + 1]


# --------------------------------------------------------------------------- 1


class Item01Retirada(Base):
    def test_planta_peca_retirada_mudada_depois_do_juiz(self):
        r, _ = self.plantar([("Este ensaio concede-a.", "Este ensaio aceita-a.")], depois=retirar)
        self.falha(r, 4, "of its last passing juiz reading")
        self.assertEqual(r[5].estado, conf.FALHOU)


# --------------------------------------------------------------------------- 2


class Item02NoAr(unittest.TestCase):
    def setUp(self):
        self.saida = Path(tempfile.mkdtemp(prefix="oedp-noar-"))
        self.addCleanup(shutil.rmtree, self.saida, True)
        self.assertTrue(build.construir(REPO, raiz=sitio_de_ensaio(self), saida=self.saida, loja=LOJA).ok)
        self.est = self.saida / "static"
        self.vivo = {}
        for f in self.est.rglob("*"):
            if f.is_file():
                nome = f.relative_to(self.est).as_posix()
                self.vivo["https://e.invalid/" + nome] = f.read_bytes()
                if noar.endereco_publico(nome) is not None:
                    self.vivo["https://e.invalid/" + noar.endereco_publico(nome)] = f.read_bytes()

    def buscar(self, url):
        if url not in self.vivo:
            raise OSError("404")
        return self.vivo[url]

    def test_planta_construcao_sem_paginas(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-sem-paginas-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "estilo.css").write_text("p {}", encoding="utf-8")
        (pasta / "manifesto.json").write_text(json.dumps(build.manifesto(pasta)), encoding="utf-8")
        self.assertEqual(noar.conferir("https://e.invalid", pasta, self.buscar),
                         ["the build lists no page, so nothing can be shown to be live"])

    def test_planta_endereco_publico_diferente(self):
        chave = "https://e.invalid/pecas/2026-11-16-peca-de-ensaio/"
        self.vivo[chave] = self.vivo[chave].replace(b"concede-a", b"aceita-a")
        razoes = noar.conferir("https://e.invalid", self.est, self.buscar)
        self.assertEqual(razoes, ["/pecas/2026-11-16-peca-de-ensaio/: what the host serves at the public address is not the built pecas/2026-11-16-peca-de-ensaio/index.html"])

    def test_planta_ficheiro_construido_que_falta_no_ar(self):
        del self.vivo["https://e.invalid/correcoes/index.html"]
        razoes = noar.conferir("https://e.invalid", self.est, self.buscar)
        self.assertTrue(any(x.startswith("https://e.invalid/correcoes/index.html could not be fetched") for x in razoes), razoes)


# --------------------------------------------------------------------------- 3


class Item03Historia(Base):
    def test_a_versao_anterior_tem_a_impressao_registada(self):
        self.assertEqual(impressoes(versao_anterior())[0], ler(PECA).registo["correcao"][0]["impressao_antes"])
        # A record that only grew, over the same text, passes. (The test piece changed again above
        # its record when the closing headings were renamed on 15 November 2026, with no
        # [[correcao]] for that change, so main holding version A would rightly fail it now.)
        acima, registo = PECA.read_bytes().split(b"+++ registo\n", 1)
        j = registo.index(b"\n[[leitura]]", registo.index(b"\n[[estado]]"))
        r, _ = self.plantar(anterior=("here", acima + b"+++ registo\n" + registo[: j + 1]))
        self.assertEqual(r[4].estado, conf.PASSOU, r[4].linha())

    def test_planta_registo_cortado(self):
        r, _ = self.plantar(anterior=("here", PECA.read_bytes()), depois=sem_correcao)
        self.falha(r, 4, "the record on main is not the beginning of the record now")

    def test_planta_mudanca_sem_correcao(self):
        r, _ = self.plantar(anterior=("here", versao_anterior()), depois=sem_correcao)
        self.falha(r, 4, "changed above the record line, but no [[correcao]] joins e669aa751d43")

    def test_sem_main_uma_publicada_falha_e_um_rascunho_nao_vincula(self):
        r, _ = self.plantar(anterior=("unavailable", None))
        self.falha(r, 4, "main is not at hand")
        r, _ = self.plantar([('estado = "publicada"', 'estado = "rascunho"')], anterior=("unavailable", None))
        self.assertEqual(r[4].estado, conf.NAO_VINCULA)
        self.assertIn("history against main: not run here, main is not at hand", r[4].notas)

    def test_so_as_pecas_do_repositorio_tem_historia(self):
        self.assertEqual(conf.anterior_em_main(REPO, PECA), ("absent", None))


# --------------------------------------------------------------------------- 4


class Item04Numeros(Base):
    def test_planta_sinal_separado(self):
        r, _ = self.plantar([('mostra = "104,7 pontos"', 'mostra = "− 104,7 pontos"')])
        self.falha(r, 1, "comes before the number; nothing may, but a minus sign right before it")  # ESQ3f: one form

    def test_planta_figura_dentro_de_outra(self):
        r, _ = self.plantar([('valor = "104.7"', 'valor = "4.7"'), ('mostra = "104,7 pontos"', 'mostra = "4,7 pontos"')])
        self.falha(r, 2, "indice: the excerpt does not hold valor 4.7")

    def test_numero_inteiro(self):
        self.assertFalse(numeros.contem_figura("Total de ensaio: 1 234 567 euros", "234"))
        self.assertTrue(numeros.contem_figura("Total de ensaio: 1 234 567 euros", "1234567"))
        self.assertFalse(numeros.contem_figura("fixou-se em 104,7 pontos", "4.7"))
        self.assertTrue(numeros.contem_figura("em 2025 ficou em 17,2 %", "17.2"))


# --------------------------------------------------------------------------- 5


class Item05OQueOLeitorLe(Base):
    def test_planta_dia_da_semana_fora_da_referencia(self):
        r, _ = self.plantar([("[o documento de ensaio publicado na segunda-feira, 16 de novembro]{indice}",
                              "o documento de ensaio publicado na terça-feira, [16 de novembro]{indice}")])
        self.falha(r, 6, "2026-11-16 is a segunda-feira, not a terça-feira")

    def test_planta_nome_partido_por_enfase(self):
        r, _ = self.plantar([("## A leitura deste projeto", "Pessoa de **Ensaio** esteve presente.\n\n## A leitura deste projeto")])
        self.falha(r, 7, "a paragraph of corpo prints the name and references none of the person's lines")


# --------------------------------------------------------------------------- 6


class Item06Privacidade(Base):
    def test_planta_endereco_em_entidade(self):
        endereco = "exemplo" + "&commat;" + "example.invalid"  # built from parts, so this file passes check 8
        r, _ = self.plantar([("Este ensaio concede-a.", "Este ensaio concede-a. " + endereco)])
        self.falha(r, 8, "an e-mail address other than the two allowed")

    def test_planta_mensagens_retidas(self):
        endereco = "maria.exemplo" + "&#64;" + "exemplo.pt"
        r, _ = self.plantar([('mostra = "104,7 pontos"', f'mostra = "104,8 pontos {endereco}"')])
        self.assertEqual(r[8].estado, conf.FALHOU)
        self.assertEqual(r[1].estado, conf.FALHOU)
        self.assertEqual(r[1].razoes, [conf.RETIDO])
        for x in r.values():
            self.assertNotIn("exemplo", x.linha())


# --------------------------------------------------------------------------- 7


class Item07RegrasDoTexto(Base):
    def test_planta_citacao_escrita_a_mao(self):
        r, _ = self.plantar([("Este ensaio concede-a.", "Este ensaio concede-a: «frase de ensaio».")])
        self.falha(r, 9, "corpo: a quotation mark (« ») typed in the text")

    def test_planta_aspas_direitas_e_codigo(self):
        r, _ = self.plantar([("Este ensaio concede-a.", 'Este ensaio diz "ensaio" e `código`.')])
        self.falha(r, 9, 'corpo: a quotation mark (") typed in the text')
        self.falha(r, 9, "corpo: inline code")

    def test_planta_html_no_titulo(self):
        r, _ = self.plantar([('titulo = "Peça de ensaio', 'titulo = "<b>Peça</b> de ensaio')])
        self.falha(r, 9, "titulo: raw HTML")


# --------------------------------------------------------------------------- 8


class Item08Gramatica(Base):
    def test_planta_simbolos_colados(self):
        r, _ = self.plantar([('calculo = "round ( indice - indice_anterior , 1 )"', 'calculo = "round(indice - indice_anterior,1)"')])
        self.falha(r, 3, "'round(indice' is not one token: in calculo every token is separated by spaces")

    def test_round_colado_recusado_e_os_casos_do_motor_aceites(self):
        self.assertTrue(derivacoes.erros_de_espacamento("round(0.5,0)"))
        casos = json.loads((ENSAIOS / "derivacoes-paridade.json").read_text(encoding="utf-8"))["casos"]
        for caso in casos:
            self.assertEqual(derivacoes.erros_de_espacamento(caso["expr"]), [], caso["id"])


# --------------------------------------------------------------------------- 9


class Item09TextoDoLeitorJulgado(unittest.TestCase):
    def construir(self, mudar):
        p = Plantada()
        self.addCleanup(p.apagar)
        mudar(p)
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        return build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA)

    def test_planta_metodo_mudado_depois_do_juiz(self):
        def mudar(p):
            f = p.pasta / "paginas" / "metodo.md"
            f.write_text(f.read_text(encoding="utf-8").replace("Um parágrafo de ensaio.", "Um parágrafo mudado."), encoding="utf-8")
        c = self.construir(mudar)
        self.assertFalse(c.ok)
        self.assertTrue(any("paginas/metodo.md: no juiz reading on its current fingerprint" in m for m in c.mensagens), c.mensagens)

    def test_planta_textos_sem_juiz_na_impressao_atual(self):
        def mudar(p):
            f = p.pasta / "textos.registo.toml"
            f.write_text(f.read_text(encoding="utf-8").replace('impressao = "', 'impressao = "0'), encoding="utf-8")
        c = self.construir(mudar)
        self.assertFalse(c.ok)
        self.assertTrue(any("textos.toml: " in m for m in c.mensagens), c.mensagens)

    def test_planta_juiz_da_mesma_familia(self):
        def mudar(p):
            f = p.pasta / "paginas" / "metodo.md"
            texto = f.read_text(encoding="utf-8")
            f.write_text(texto.replace('lugar = "juiz"\nfamilia = "openai"', 'lugar = "juiz"\nfamilia = "anthropic"'), encoding="utf-8")
        c = self.construir(mudar)
        self.assertTrue(any("paginas/metodo.md: the juiz reading is by anthropic, the family that wrote it" in m for m in c.mensagens), c.mensagens)

    def test_registar_acrescenta_aos_dois(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        for f in (p.pasta / "paginas" / "metodo.md", p.pasta / "textos.registo.toml"):
            antes = f.read_bytes()
            r = subprocess.run([sys.executable, "-m", "oedp", "registar", str(f), "passo", "--nome", "edicao", "--lugar", "direcao",
                                "--familia", "anthropic", "--modelo", "modelo-de-ensaio", "--inicio", "2026-11-15T11:00:00Z",
                                "--fim", "2026-11-15T11:05:00Z"], cwd=REPO, capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertTrue(f.read_bytes().startswith(antes))
        self.assertEqual(len(tomllib.loads((p.pasta / "textos.registo.toml").read_text(encoding="utf-8"))["passo"]), 2)

    def test_os_registos_reais_existem(self):
        """The real records exist and are records, whatever they hold (ESQ3i, A): each parses, holds
        only the tables its record may hold, and every entry has its fields."""
        from oedp import codigo, julgados, reconferir
        self.assertTrue((REPO / "textos.registo.toml").is_file())
        textos = tomllib.loads((REPO / "textos.registo.toml").read_text(encoding="utf-8"))
        self.assertLessEqual(set(textos), {"passo", "leitura"})
        self.assertEqual(julgados.erros_do_registo("textos.toml", textos), [])
        self.assertTrue((REPO / codigo.REGISTO).is_file())
        self.assertEqual(codigo.erros_do_registo(codigo.em_ordem((REPO / codigo.REGISTO).read_text(encoding="utf-8"))), [])
        self.assertEqual(reconferir.ler_registo(REPO)[1], [])  # no file is no run yet; a file is a record

    def test_planta_um_registo_que_nao_e_registo(self):
        from oedp import julgados
        self.assertTrue(julgados.erros_do_registo("textos.toml", {"passo": [{"nome": "escrita"}]}))


# --------------------------------------------------------------------------- 10


DOCUMENTO = b"documento de ensaio " * 30  # more than 512 bytes, like a real document


class SitioFalso:
    """A site held in memory: url -> (http, body, redirect). Records every request."""

    def __init__(self, paginas, enderecos, sem_head=()):
        self.paginas, self.enderecos, self.pedidos, self.sem_head = paginas, enderecos, [], set(sem_head)

    def transporte(self, url, destino, metodo="GET", endereco=None):
        self.pedidos.append((metodo, url, endereco))
        if metodo == "HEAD" and url in self.sem_head:
            return fontes.Resposta(52, 0, url, "", 0, "curl: (52) Empty reply from server", "")
        http, corpo, redirecao = self.paginas.get(url, (404, b"", ""))
        if metodo == "GET" and corpo:
            destino.write_bytes(corpo)
        return fontes.Resposta(0, http, url, "text/html", len(corpo), "", redirecao)

    def resolver(self, host, porta):
        if host not in self.enderecos:
            raise OSError("unknown host")
        return self.enderecos[host]


class Item10Redirecoes(unittest.TestCase):
    PUBLICO = ["93.184.216.34"]

    def setUp(self):
        self.loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, self.loja, True)
        registo = (ENSAIOS / "direitos" / "example.org.toml").read_text(encoding="utf-8")
        self.direitos = Path(tempfile.mkdtemp(prefix="oedp-direitos-"))
        self.addCleanup(shutil.rmtree, self.direitos, True)
        (self.direitos / "fim.invalid.toml").write_text(registo, encoding="utf-8")

    def site(self, paginas, enderecos=None):
        return SitioFalso(paginas, enderecos or {h: self.PUBLICO for h in ("a.invalid", "fim.invalid", "b.invalid")})

    def buscar(self, s, url, termos=False):
        from oedp import direitos
        return fontes.buscar(url, self.loja, None if termos else direitos.para_buscar(self.direitos),
                             s.transporte, termos, s.resolver)

    def guardados(self):
        return [p for p in self.loja.rglob("*") if p.is_file()]

    def test_segue_e_guarda_no_fim(self):
        s = self.site({"https://a.invalid/x": (302, b"", "https://fim.invalid/doc"),
                       "https://fim.invalid/doc": (200, DOCUMENTO, "")})
        tabela = self.buscar(s, "https://a.invalid/x")
        self.assertIn('url_final = "https://fim.invalid/doc"', tabela)
        self.assertEqual(len(self.guardados()), 1)
        gets = [p for p in s.pedidos if p[0] == "GET" and not p[1].endswith("/robots.txt")]
        self.assertEqual(gets, [("GET", "https://fim.invalid/doc", "93.184.216.34")])

    def test_sem_head_vai_por_get_com_os_direitos_antes(self):
        s = self.site({"https://fim.invalid/doc": (200, DOCUMENTO, "")})
        s.sem_head = {"https://fim.invalid/doc"}
        self.assertIn('url_final = "https://fim.invalid/doc"', self.buscar(s, "https://fim.invalid/doc"))
        s = self.site({"https://a.invalid/x": (302, b"", "https://fim.invalid/doc"),
                       "https://fim.invalid/doc": (200, DOCUMENTO, "")})
        s.sem_head = {"https://a.invalid/x"}
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(s, "https://a.invalid/x")
        self.assertIn("a.invalid has no rights record", str(e.exception))
        self.assertFalse([p for p in s.pedidos if p[0] == "GET" and not p[1].endswith("/robots.txt")])

    def test_planta_salto_para_endereco_privado(self):
        s = self.site({"https://a.invalid/x": (302, b"", "https://interno.invalid/y")},
                      {"a.invalid": self.PUBLICO, "interno.invalid": ["10.0.0.5"]})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(s, "https://a.invalid/x")
        self.assertIn("interno.invalid resolves to 10.0.0.5, which is not a public address", str(e.exception))
        self.assertEqual(self.guardados(), [])

    def test_planta_termos_em_loopback(self):
        s = self.site({}, {"localhost": ["127.0.0.1"]})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(s, "http://localhost/termos", termos=True)
        self.assertIn("localhost resolves to 127.0.0.1, which is not a public address", str(e.exception))

    def test_planta_mais_de_cinco_saltos(self):
        paginas = {f"https://a.invalid/{i}": (301, b"", f"https://a.invalid/{i + 1}") for i in range(7)}
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(self.site(paginas), "https://a.invalid/0")
        self.assertIn("redirects more than five times", str(e.exception))

    def test_planta_robots_do_segundo_salto(self):
        s = self.site({"https://a.invalid/x": (302, b"", "https://fim.invalid/doc"),
                       "https://fim.invalid/robots.txt": (200, b"User-agent: *\nDisallow: /\n", ""),
                       "https://fim.invalid/doc": (200, DOCUMENTO, "")})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(s, "https://a.invalid/x")
        self.assertIn("https://fim.invalid/robots.txt closes this address", str(e.exception))
        self.assertEqual(self.guardados(), [])

    def test_planta_direitos_do_fim_antes_de_descarregar(self):
        s = self.site({"https://a.invalid/x": (302, b"", "https://b.invalid/doc"),
                       "https://b.invalid/doc": (200, DOCUMENTO, "")})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(s, "https://a.invalid/x")
        self.assertIn("b.invalid has no rights record", str(e.exception))
        self.assertFalse([p for p in s.pedidos if p[0] == "GET" and p[1] == "https://b.invalid/doc"])

    def test_planta_esquema_que_nao_e_web(self):
        s = self.site({"https://a.invalid/x": (302, b"", "ftp://fim.invalid/doc")})
        with self.assertRaises(fontes.ErroDaLoja) as e:
            self.buscar(s, "https://a.invalid/x")
        self.assertIn("ftp://fim.invalid/doc is not an https or http address", str(e.exception))

    def test_curl_sem_redirecoes_e_com_endereco_fixo(self):
        visto = {}

        def correr(args, **kw):
            visto["args"], visto["kw"] = args, kw
            return subprocess.CompletedProcess(args, 0, '{"http_code":200,"url_effective":"https://e.invalid/"}', "")

        with mock.patch.object(fontes.shutil, "which", return_value="/usr/bin/curl"), mock.patch.object(fontes.subprocess, "run", correr):
            fontes.transporte_curl("https://e.invalid/x", self.loja / "t", "HEAD", "93.184.216.34")
        a = visto["args"]
        self.assertIsInstance(a, list)
        self.assertNotIn("shell", visto["kw"])
        self.assertNotIn("--location", a)
        self.assertNotIn("--insecure", a)
        self.assertIn("--head", a)
        self.assertEqual(a[a.index("--resolve") + 1], "e.invalid:443:93.184.216.34")
        with mock.patch.object(fontes.shutil, "which", return_value=None):
            with self.assertRaises(fontes.ErroDaLoja):
                fontes.transporte_curl("https://e.invalid/", self.loja / "t")


# --------------------------------------------------------------------------- 11


class Item11Loja(unittest.TestCase):
    def test_planta_loja_dentro_do_repositorio(self):
        sha = ler(PECA).fontes["doc_pdf"]["sha256"]
        env = dict(os.environ, OEDP_FONTES=str(LOJA))
        r = subprocess.run([sys.executable, "-m", "oedp", "texto", sha], cwd=REPO, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 2)
        self.assertIn("refused: OEDP_FONTES resolves inside the repository (ensaios/fontes)", r.stderr)
        env = dict(os.environ, OEDP_FONTES=str(loja_fora_do_repositorio(self)))
        r = subprocess.run([sys.executable, "-m", "oedp", "texto", sha], cwd=REPO, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_planta_ligacao_simbolica_em_public(self):
        repo = Path(tempfile.mkdtemp(prefix="oedp-repo-"))
        self.addCleanup(shutil.rmtree, repo, True)
        for nome in ("textos.toml", "sitio.toml", "vercel.json"):
            shutil.copy2(REPO / nome, repo / nome)
        shutil.copytree(REPO / "public", repo / "public")
        (repo / "public" / "tipos" / "ligacao").symlink_to(LOJA)
        # The code's fingerprint is read from git (oedp/codigo.py): the copy is a repository,
        # and the test site carries an invented passing reading of this copy's code.
        subprocess.run(["git", "init", "-q", str(repo)], check=True, env=sem_git_local())
        subprocess.run(["git", "-C", str(repo), "add", "."], check=True, env=sem_git_local())
        from oedp import codigo, ensaio
        p = Plantada()
        self.addCleanup(p.apagar)
        (p.pasta / codigo.REGISTO).write_text(ensaio.registo_de_ensaio(repo), encoding="utf-8")
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(repo, raiz=p.pasta, saida=saida, loja=LOJA)
        self.assertFalse(c.ok)
        self.assertIn("check 9: public/tipos/ligacao is a symbolic link, and the build does not follow links", c.mensagens)


# --------------------------------------------------------------------------- 12


class Item12Segredo(unittest.TestCase):
    def test_o_fluxo_real_da_o_segredo_so_ao_passo_das_conferencias(self):
        self.assertEqual(conf.segredo_so_no_passo((REPO / ".github/workflows/portao.yml").read_text(encoding="utf-8")), [])

    def test_planta_segredo_ao_trabalho_inteiro(self):
        texto = (REPO / ".github/workflows/portao.yml").read_text(encoding="utf-8")
        texto = texto.replace("        env:\n          PRIVACIDADE_PROIBIDOS: ${{ secrets.PRIVACIDADE_PROIBIDOS }}\n", "")
        texto = texto.replace("    timeout-minutes: 20\n", "    timeout-minutes: 20\n    env:\n      PRIVACIDADE_PROIBIDOS: ${{ secrets.PRIVACIDADE_PROIBIDOS }}\n")
        self.assertEqual(len(conf.segredo_so_no_passo(texto)), 1)
        self.assertIn("the secret is given outside a step", conf.segredo_so_no_passo(texto)[0])


# --------------------------------------------------------------------------- 13


class Item13ONome(unittest.TestCase):
    def test_o_nome_leva_a_primeira_pagina(self):
        ctx = paginas.Contexto(textos=tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8")))
        self.assertIn(f'<p class="wordmark"><a href="/">{paginas.e(ctx.t("nome"))}</a></p>', paginas.pagina_404(ctx))
        self.assertIn(f'<h1 class="wordmark">{paginas.e(ctx.t("nome"))}</h1>', paginas.pagina_inicial(ctx))


# --------------------------------------------------------------------------- the five planted in the reader's copy


class OsCincoPlantados(Base):
    def test_check2_le_as_citacoes(self):
        r, _ = self.plantar([("excerto = '''As contas de ensaio estão certas'''", "excerto = '''As contas de ensaio estão erradas'''")])
        self.falha(r, 2, "declaracao: the excerpt is not in the text of the stored copy of tabela_html")

    def test_estado_publicada_confere_como_publicada(self):
        p = Plantada([('estado = "publicada"', 'estado = "rascunho"'), ("Este ensaio concede-a.", "Este ensaio aceita-a.")])
        self.addCleanup(p.apagar)
        env = dict(os.environ, OEDP_FONTES=str(loja_fora_do_repositorio(self)))
        r = subprocess.run([sys.executable, "-m", "oedp", "estado", str(p.peca), "publicada", "--razao", "Ensaio."],
                           cwd=REPO, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn("check  4 (the published text is the judged text)", r.stderr)
        self.assertEqual(ler(p.peca).estado, "rascunho")

    def test_uma_referencia_e_escapada(self):
        peca = ler(PECA)
        html = paginas.em_linha(peca, "Ensaio [<svg onload=alert()>]{indice}.")
        self.assertNotIn("<svg", html)
        self.assertIn("&lt;svg onload=alert()&gt;", html)

    # The sentence about corrections: tests.test_paginas.Textos compares textos.toml with the table, key by key.
    # The count of adopted findings: the report is outside the tree; the built Method page's count is
    # asserted by tests.test_paginas.CincoPaginas.test_o_registo_da_equipa_no_metodo.


if __name__ == "__main__":
    unittest.main()
