"""ESQ2 item A: the readings as scripts (montar, plantar, lancar, pontuar, registar).

The workshop and the store are temporary folders outside the repository; the briefs are
stand-ins (the real equipa/ is copied into the tree last); the launcher is a stand-in;
nothing touches the network.
"""
from __future__ import annotations

import html.parser
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path

from oedp import leituras, numerado
from oedp.__main__ import MODELO
from oedp.peca import ler, paragrafos
from oedp.ambiente import sem_git_local
from tests.apoio import ENSAIOS, PECA, REPO, Plantada, loja_fora_do_repositorio, sitio_de_ensaio
from tests.test_esq1f import commit, git_temporario

PDF = "3f9a602b9c8e9f75b8fdd9e63aadddfae0a1776aa4a31241b567946b3add3e89"
PLANTA_BOA = f"""
[[planta]]
id = "Q7"
ficheiro = "peca.md"
antes = '''[uma subida de]{{diferenca}}'''
depois = '''[uma descida de]{{diferenca}}'''
descricao = "the change between the two quarters is called a fall where the index rose"
desmente = '''contra 102,3 pontos no segundo trimestre'''
desmente_em = "fontes/{PDF}.txt"
"""


def bloco(achados: list[dict], veredicto="nao_passa", extra="") -> str:
    partes = [f'lugar = "juiz"\nveredicto = "{veredicto}"\nnao_conferido = []\n{extra}']
    for a in achados:
        partes.append("[[achado]]\n" + "".join(f"{k} = {json.dumps(v, ensure_ascii=False)}\n" for k, v in a.items()))
    return "Reading.\n\n```toml\n" + "\n".join(partes) + "```\n"


def achado(onde, gravidade="corrigir", problema="wrong"):
    return {"onde": onde, "gravidade": gravidade, "texto": "x", "problema": problema, "fonte_diz": ""}


class Base(unittest.TestCase):
    def setUp(self):
        self.oficina = Path(tempfile.mkdtemp(prefix="oedp-oficina-"))
        self.addCleanup(shutil.rmtree, self.oficina, True)
        self.loja = loja_fora_do_repositorio(self)
        self.equipa = Path(tempfile.mkdtemp(prefix="oedp-equipa-"))
        self.addCleanup(shutil.rmtree, self.equipa, True)
        (self.equipa / "00-comum.md").write_text("# Common (stand-in)\n", encoding="utf-8")
        for lugar in ("numeros", "oposto", "especialista", "justica", "juiz", "leitor", "desenhador", "seguranca"):
            (self.equipa / f"{lugar}.md").write_text(f"# {lugar} (stand-in)\n", encoding="utf-8")
        self.saidas = []

    def montar(self, lugar, alvo=PECA, **kw):
        kw.setdefault("oficina_", str(self.oficina))
        kw.setdefault("loja", self.loja)
        kw.setdefault("equipa", self.equipa)
        return leituras.montar(str(alvo), lugar, **kw)

    def lista(self, texto):
        f = Path(tempfile.mkdtemp(prefix="oedp-lista-")) / "lista.toml"
        self.addCleanup(shutil.rmtree, f.parent, True)
        f.write_text(texto, encoding="utf-8")
        return f

    def plantar(self, pasta, texto, **kw):
        return leituras.plantar(pasta, self.lista(texto), loja=kw.pop("loja", self.loja), imprimir=self.saidas.append, **kw)

    def todos(self, pasta) -> dict[str, bytes]:
        return {f.relative_to(pasta).as_posix(): f.read_bytes() for f in sorted(Path(pasta).rglob("*")) if f.is_file()}


# --------------------------------------------------------------------------- A1


class Montar(Base):
    def test_planta_oficina_por_definir_e_dentro_do_repositorio(self):
        with self.assertRaises(leituras.Recusa) as e:
            self.montar("juiz", oficina_="")
        self.assertIn("OEDP_OFICINA is not set", str(e.exception))
        with self.assertRaises(leituras.Recusa) as e:
            self.montar("juiz", oficina_=str(REPO / "ensaios" / "oficina"))
        self.assertIn("OEDP_OFICINA resolves inside the repository", str(e.exception))

    def test_planta_fonte_que_nao_esta_na_loja(self):
        vazia = Path(tempfile.mkdtemp(prefix="oedp-loja-vazia-"))
        self.addCleanup(shutil.rmtree, vazia, True)
        with self.assertRaises(leituras.Recusa) as e:
            self.montar("juiz", loja=vazia)
        self.assertIn("these stored sources are not in the store", str(e.exception))
        self.assertFalse(list((self.oficina / "leituras").rglob("*.json")) if (self.oficina / "leituras").exists() else [])

    def test_planta_numeros_sem_fonte(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-sem-fonte-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        f = pasta / "pecas" / "2026" / "2026-11-20-sem-fonte.md"
        f.parent.mkdir(parents=True)
        f.write_text(MODELO.format(id="2026-11-20-sem-fonte", tipo="diario"), encoding="utf-8")
        with self.assertRaises(leituras.Recusa) as e:
            self.montar("numeros", alvo=f)
        self.assertIn("the piece has no [[fonte]]", str(e.exception))

    def test_planta_lugar_que_nao_le_o_alvo(self):
        with self.assertRaises(leituras.Recusa) as e:
            self.montar("seguranca")
        self.assertIn("the seat seguranca does not read peca", str(e.exception))

    def test_numeros_nao_le_nenhum_byte_do_texto(self):
        pasta = self.montar("numeros")
        peca = ler(PECA)
        ficheiros = self.todos(pasta / "pacote")
        self.assertEqual(sorted(ficheiros), sorted(["LEIA-ME.md", "PERGUNTA.md", "direitos/example.org.toml", "folha.toml",
                                                    f"fontes/{PDF}.txt",
                                                    "fontes/29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b.txt"]))
        juntos = b"\n".join(ficheiros.values()).decode("utf-8")
        for proibido in [peca.cabeca["titulo"], peca.cabeca["entrada"]] + [p.strip() for p in paragrafos(peca.corpo) if not p.startswith("#")]:
            self.assertNotIn(proibido, juntos)
        self.assertEqual(ficheiros["PERGUNTA.md"].decode().strip(), peca.cabeca["encomenda"]["pergunta"])
        dados = json.loads((pasta / "leitura.json").read_text(encoding="utf-8"))
        self.assertEqual(dados["impressao"], peca.impressao_folha)
        self.assertEqual(dados["ficheiros"], {k: leituras.sha(v) for k, v in ficheiros.items()})

    def test_planta_numeros_com_texto_seria_apanhado(self):
        # the proof above bites: a package holding the title would fail it
        pasta = self.montar("numeros")
        (pasta / "pacote" / "PERGUNTA.md").write_text(ler(PECA).cabeca["titulo"], encoding="utf-8")
        juntos = b"\n".join(self.todos(pasta / "pacote").values()).decode("utf-8")
        self.assertIn(ler(PECA).cabeca["titulo"], juntos)

    def test_juiz_leitor_especialista_e_folha(self):
        juiz = self.montar("juiz")
        self.assertEqual(sorted(self.todos(juiz / "pacote")), ["LEIA-ME.md", "TEXTO-NUMERADO.md",
                         "fontes/29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b.txt", f"fontes/{PDF}.txt", "peca.md"])
        self.assertEqual((juiz / "pacote" / "peca.md").read_bytes(), PECA.read_bytes()[: PECA.read_bytes().index(b"\n+++ registo\n") + 1])
        self.assertEqual(json.loads((juiz / "leitura.json").read_text())["impressao"], ler(PECA).impressao)
        leia = (juiz / "pacote" / "LEIA-ME.md").read_text(encoding="utf-8")
        for nome in ("TEXTO-NUMERADO.md", "peca.md", "fontes/<sha256>.txt"):
            self.assertIn(f"- `{nome}`", leia)
        self.assertEqual(sorted(self.todos(self.montar("leitor") / "pacote")), ["TEXTO-NUMERADO.md"])
        self.assertEqual(sorted(self.todos(self.montar("especialista") / "pacote")),
                         ["LEIA-ME.md", "TEXTO-NUMERADO.md", "mesas/ensaio.md", "peca.md"])
        folha = self.montar("oposto", folha=True)
        self.assertEqual(sorted(self.todos(folha / "pacote"))[:3], ["ENCOMENDA.md", "LEIA-ME.md", "folha.toml"])
        self.assertEqual(json.loads((folha / "leitura.json").read_text())["impressao"], ler(PECA).impressao_folha)
        self.assertEqual(sorted(p.name for p in (self.oficina / "leituras" / ler(PECA).id).iterdir()),
                         ["especialista-1", "juiz-1", "leitor-1", "oposto-1"])

    def test_o_prompt(self):
        seccao = self.lista("# Extra section\n")
        pasta = self.montar("juiz", seccao=str(seccao))
        self.assertEqual((pasta / "PROMPT.md").read_text(encoding="utf-8"),
                         "# Common (stand-in)\n\n---\n\n# juiz (stand-in)\n\n---\n\n" + leituras.SECCAO + "\n# Extra section\n")

    def test_o_desenhador_sem_capturas_e_recusado(self):
        def sem(caminho, destino):
            raise leituras.Recusa("refused: Playwright for Python is not installed here (planted)")
        with self.assertRaises(leituras.Recusa) as e:
            self.montar("desenhador", capturar=sem)
        self.assertIn("Playwright", str(e.exception))
        feitas = []
        pasta = self.montar("desenhador", capturar=lambda c, d: (d.mkdir(parents=True), (d / "x.png").write_bytes(b"png"), feitas.append(c)))
        self.assertEqual(sorted(self.todos(pasta / "pacote")), ["ESPEC-PAGINAS.md", "LEIA-ME.md", "capturas/x.png"])


class TextoNumerado(Base):
    def test_o_texto_numerado_e_o_da_pagina(self):
        from oedp import ensaio

        pasta = Path(tempfile.mkdtemp(prefix="oedp-numerado-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        c = ensaio.construir_ensaio(pasta)
        self.assertTrue(c.ok, c.mensagens)
        pagina = (c.estatica / "pecas" / ensaio.PECA_ID / "index.html").read_text(encoding="utf-8")

        class Texto(html.parser.HTMLParser):
            """The words of the title, the lead and the text of the built page (the kind's label is
            said in the copy's first line, unnumbered: ESQ3, item K)."""
            def __init__(self):
                super().__init__(convert_charrefs=True)
                self.dentro, self.partes, self.profundidade = None, [], 0
            def handle_starttag(self, tag, attrs):
                classe = dict(attrs).get("class", "")
                if self.dentro:
                    self.profundidade += 1
                elif classe in ("peca-titulo", "entrada", "texto"):
                    self.dentro, self.profundidade = classe, 1
                    self.partes.append(" ")
            def partes_fechadas(self):
                return False
            def handle_endtag(self, tag):
                if self.dentro:
                    self.profundidade -= 1
                    if self.profundidade == 0:
                        self.dentro = None
            def handle_data(self, data):
                if self.dentro:
                    self.partes.append(data)

        t = Texto()
        t.feed(pagina[: pagina.index('<section class="recibos"')])
        da_pagina = numerado.limpar("".join(t.partes))
        numerado_ = leituras.texto_numerado_da_peca(PECA.read_bytes())
        do_numerado = numerado.limpar(" ".join(numerado.lista(numerado_)))
        self.assertEqual(do_numerado, da_pagina)
        self.assertIn("[7] No trimestre anterior ficara em 102,3 pontos, uma subida de 2,4 pontos.", numerado_)
        # The page is built with the test site's sentences, the copy with the real ones that
        # texto_numerado_da_peca reads: the label is the real file's, read, never typed.
        self.assertRegex(pagina, r'<p class="eyebrow">[^<]+</p>')
        rotulo = leituras.contexto_de_textos(REPO).t("tipo_" + ler(PECA).cabeca["tipo"])
        self.assertTrue(numerado_.startswith(f"(Above the title the page prints the label of the kind of piece, «{rotulo}». "
                                             "It is not a sentence of the text, and is not numbered.)\n\n[1] Peça de ensaio"))
        self.assertNotIn(f"] {rotulo}\n", numerado_)

    def test_a_regra_das_frases(self):
        self.assertEqual(numerado.frases("Diz a p. 2 que sim. E depois? «Não.» Fim 3. 4 pessoas… Mais"),
                         ["Diz a p. 2 que sim.", "E depois?", "«Não.»", "Fim 3.", "4 pessoas…", "Mais"])
        self.assertEqual(numerado.frases("um valor de 2,4 pontos. e segue"), ["um valor de 2,4 pontos. e segue"])


class MetodoTextosCodigo(Base):
    def falso_repo(self) -> Path:
        repo = Path(tempfile.mkdtemp(prefix="oedp-repo-"))
        self.addCleanup(shutil.rmtree, repo, True)
        for nome in ("docs", "oedp"):
            shutil.copytree(REPO / nome, repo / nome, ignore=shutil.ignore_patterns("__pycache__"))
        shutil.copytree(self.equipa, repo / "equipa")
        for nome in ("README.md", "textos.toml", "sitio.toml", "vercel.json"):
            shutil.copy2(REPO / nome, repo / nome)
        shutil.copytree(REPO / "public", repo / "public")
        return repo

    def test_o_juiz_do_metodo(self):
        sitio = sitio_de_ensaio(self)
        extra = self.lista("anexo\n")
        pasta = self.montar("juiz", alvo=sitio / "paginas" / "metodo.md", repo=self.falso_repo(), com=[str(extra)])
        nomes = sorted(self.todos(pasta / "pacote"))
        for nome in ("metodo.md", "TEXTO-NUMERADO.md", "referencia/README.md", "referencia/textos.toml",
                     "referencia/docs/ESPEC-PECA.md", "referencia/equipa/juiz.md", "referencia/oedp/leituras.py", "referencia/lista.toml"):
            self.assertIn(nome, nomes)
        self.assertIn("[1] Texto de ensaio da página do Método, escrito para provar o esqueleto.",
                      (pasta / "pacote" / "TEXTO-NUMERADO.md").read_text(encoding="utf-8"))

    def test_o_juiz_dos_textos(self):
        pasta = self.montar("juiz", alvo=REPO / "textos.toml")
        numerados = (pasta / "pacote" / "TEXTOS-NUMERADOS.md").read_text(encoding="utf-8")
        self.assertIn("[1] `nome`: O Estado do País\n", numerados)
        self.assertIn("`r_descarregar`: Descarregar a fonte", numerados)
        self.assertTrue((pasta / "pacote" / "construido" / "pecas" / "2026-11-16-peca-de-ensaio" / "index.html").is_file())
        self.assertTrue((pasta / "pacote" / "docs" / "ESPEC-PAGINAS.md").is_file())
        # a plant in a sentence is seen in the built pages too: the two files never disagree
        self.plantar(pasta, '''
[[planta]]
id = "Q3"
ficheiro = "TEXTOS-NUMERADOS.md"
antes = "`r_voltar`: Voltar ao texto"
depois = "`r_voltar`: Voltar ao início do texto"
descricao = "the back link's words are not the specification's"
desmente = "| `r_voltar` | Voltar ao texto |"
desmente_em = "docs/ESPEC-PAGINAS.md"
''')
        pagina = (pasta / "pacote" / "construido" / "pecas" / "2026-11-16-peca-de-ensaio" / "index.html").read_text(encoding="utf-8")
        self.assertIn(">Voltar ao início do texto</a>", pagina)
        self.assertNotIn(">Voltar ao texto</a>", pagina)


def falsos_artefactos(arvore: Path, pacote: Path) -> int:
    """A stand-in for running tudo and the build in arvore/: tudo 'fails' when a file holds QUEBRA."""
    (pacote / "construido").mkdir(exist_ok=True)
    (pacote / "construido-sem-pecas").mkdir(exist_ok=True)
    quebrado = any(b"QUEBRA" in f.read_bytes() for f in arvore.rglob("*.py"))
    (pacote / "saida-tudo.txt").write_text("tudo: " + ("failed" if quebrado else "passed") + "\n", encoding="utf-8")
    return (1, ["tests.test_a.A.test_quebra"]) if quebrado else (0, [])


class Codigo(Base):
    def repo_com_dois_commits(self):
        repo = git_temporario(self)
        (repo / "oedp").mkdir()
        (repo / "oedp" / "a.py").write_text("def a():\n    return 1\n", encoding="utf-8")
        (repo / "oedp" / "b.py").write_text("def b():\n    return 2\n", encoding="utf-8")
        commit(repo, "oedp")
        base = subprocess.run(["git", "-C", str(repo), "rev-parse", "HEAD"], capture_output=True, text=True,
                              env=sem_git_local()).stdout.strip()
        (repo / "oedp" / "a.py").write_text("def a():\n    return 1\n\n\ndef c(x):\n    return x > 0\n", encoding="utf-8")
        commit(repo, "oedp")
        return repo, base

    def test_o_pacote_e_as_plantas_no_codigo(self):
        repo, base = self.repo_com_dois_commits()
        ordem = self.lista("# The order\n\nc(x) is true only for a positive x.\n")
        pasta = self.montar("seguranca", alvo="codigo", repo=repo, base=base, ordens=[str(ordem)], artefactos=falsos_artefactos)
        nomes = sorted(self.todos(pasta / "pacote"))
        self.assertEqual(nomes, ["LEIA-ME.md", "arvore/oedp/a.py", "arvore/oedp/b.py", "diff.patch", "lista.toml", "saida-tudo.txt"])
        self.assertTrue((pasta / "base" / "oedp" / "a.py").is_file())
        self.assertFalse((pasta / "pacote" / "base").exists())
        self.assertIn("+def c(x):", (pasta / "pacote" / "diff.patch").read_text())
        planta = '''
[[planta]]
id = "Q9"
ficheiro = "arvore/oedp/a.py"
antes = "    return x > 0\\n"
depois = "    return x >= 0\\n"
descricao = "c(0) is now true"
desmente = "c(x) is true only for a positive x."
desmente_em = "lista.toml"
'''
        self.plantar(pasta, planta, artefactos=falsos_artefactos)
        diff = (pasta / "pacote" / "diff.patch").read_text()
        self.assertIn("+    return x >= 0", diff)
        self.assertNotIn("+    return x > 0", diff)
        chave = json.loads((pasta / "chave.json").read_text())["plantas"][0]
        self.assertEqual((chave["lugares"], chave["ficheiro_codigo"], chave["linhas"]), (["ficheiro oedp/a.py"], "oedp/a.py", [6]))

    def test_planta_no_codigo_que_o_diff_nao_mostra(self):
        # the diff is made again from the planted tree, so a plant shows in it as an added line;
        # one that adds only a blank line after an unchanged one does not, and is refused
        repo, base = self.repo_com_dois_commits()
        ordem = self.lista("# The order\n\nb returns two.\n")
        pasta = self.montar("seguranca", alvo="codigo", repo=repo, base=base, ordens=[str(ordem)], artefactos=falsos_artefactos)
        antes = self.todos(pasta / "pacote")
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, '[[planta]]\nid = "Q9"\nficheiro = "arvore/oedp/b.py"\nantes = "    return 2\\n"\n'
                                'depois = "    return 2\\n\\n"\ndescricao = "a blank line"\ndesmente = "b returns two."\n'
                                'desmente_em = "lista.toml"\n', artefactos=falsos_artefactos)
        self.assertIn("the planted line is not in diff.patch", str(e.exception))
        self.assertEqual(self.todos(pasta / "pacote"), antes)

    def test_planta_no_codigo_que_um_teste_apanha(self):
        repo, base = self.repo_com_dois_commits()
        ordem = self.lista("# The order\n\nc(x) is true only for a positive x.\n")
        pasta = self.montar("seguranca", alvo="codigo", repo=repo, base=base, ordens=[str(ordem)], artefactos=falsos_artefactos)
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, '[[planta]]\nid = "Q9"\nficheiro = "arvore/oedp/a.py"\nantes = "return x > 0"\n'
                                'depois = "return x > 0  # QUEBRA"\ndescricao = "d"\ndesmente = "c(x) is true only"\ndesmente_em = "lista.toml"\n',
                         artefactos=falsos_artefactos)
        self.assertIn("tudo exits 1 in the planted tree (failing: tests.test_a.A.test_quebra)", str(e.exception))

    def test_planta_arvore_com_um_teste_que_falha_recusa_o_pacote(self):
        repo, base = self.repo_com_dois_commits()
        (repo / "oedp" / "b.py").write_text("def b():\n    return 2  # QUEBRA\n", encoding="utf-8")
        commit(repo, "oedp")
        ordem = self.lista("# The order\n")
        with self.assertRaises(leituras.Recusa) as e:
            self.montar("seguranca", alvo="codigo", repo=repo, base=base, ordens=[str(ordem)], artefactos=falsos_artefactos)
        self.assertIn("refused: tudo exits 1 in the unpacked tree", str(e.exception))
        self.assertIn("failing: tests.test_a.A.test_quebra", str(e.exception))
        self.assertEqual(list((self.oficina / "leituras" / "codigo").iterdir()), [])

    def test_planta_pacote_feito_a_mao_a_volta_de_uma_arvore_que_falha(self):
        repo, base = self.repo_com_dois_commits()
        ordem = self.lista("# The order\n\nc(x) is true only for a positive x.\n")
        pasta = self.montar("seguranca", alvo="codigo", repo=repo, base=base, ordens=[str(ordem)], artefactos=falsos_artefactos)
        dados = json.loads((pasta / "leitura.json").read_text())
        self.assertEqual(dados["codigo"]["saida_tudo"], 0)
        dados["codigo"]["saida_tudo"] = 1  # as a package made by hand around a failing tree would say
        (pasta / "leitura.json").write_text(json.dumps(dados))
        antes = self.todos(pasta / "pacote")
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, '[[planta]]\nid = "Q9"\nficheiro = "arvore/oedp/a.py"\nantes = "return x > 0"\n'
                                'depois = "return x >= 0"\ndescricao = "d"\ndesmente = "c(x) is true only"\ndesmente_em = "lista.toml"\n',
                         artefactos=falsos_artefactos)
        self.assertIn("refused: tudo did not exit 0 in the unplanted tree (exit 1)", str(e.exception))
        self.assertEqual(self.todos(pasta / "pacote"), antes)

    def test_os_testes_que_falharam_lidos_da_saida_real(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-unittest-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "test_x.py").write_text(
            "import unittest\n\nclass T(unittest.TestCase):\n    def test_bom(self):\n        pass\n"
            "    def test_mau(self):\n        self.assertEqual(1, 2)\n    def test_erro(self):\n        raise RuntimeError('x')\n",
            encoding="utf-8")
        r = subprocess.run([sys.executable, "-m", "unittest", "test_x"], cwd=pasta, capture_output=True, text=True)
        self.assertNotEqual(r.returncode, 0)
        self.assertEqual(leituras.testes_que_falharam(r.stdout + r.stderr), ["test_x.T.test_erro", "test_x.T.test_mau"])


# --------------------------------------------------------------------------- A2


class Plantar(Base):
    def test_uma_planta_boa(self):
        pasta = self.montar("juiz")
        self.plantar(pasta, PLANTA_BOA)
        numerado_ = (pasta / "pacote" / "TEXTO-NUMERADO.md").read_text(encoding="utf-8")
        self.assertIn("[7] No trimestre anterior ficara em 102,3 pontos, uma descida de 2,4 pontos.", numerado_)
        chave = json.loads((pasta / "chave.json").read_text(encoding="utf-8"))["plantas"]
        self.assertEqual(chave[0]["lugares"], ["frase 7"])
        self.assertEqual(chave[0]["sha256_antes"], ler(PECA).impressao)
        self.assertFalse((pasta / "pacote" / "chave.json").exists())
        horas = {f.stat().st_mtime for f in (pasta / "pacote").rglob("*")}
        self.assertEqual(len(horas), 1)
        for f in (pasta / "pacote").rglob("*"):
            if f.is_file():
                self.assertNotIn("Q7", f.read_text(encoding="utf-8"))
                self.assertNotIn("called a fall", f.read_text(encoding="utf-8"))

    def recusa(self, pasta, texto, mensagem):
        antes = self.todos(pasta / "pacote")
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, texto)
        self.assertIn(mensagem, str(e.exception))
        self.assertEqual(self.todos(pasta / "pacote"), antes)
        self.assertFalse((pasta / "chave.json").exists())

    def test_planta_antes_achado_duas_vezes(self):
        self.recusa(self.montar("juiz"), PLANTA_BOA.replace("[uma subida de]{diferenca}", "ensaio"), "antes is found")

    def test_planta_sem_nada_que_a_desminta(self):
        self.recusa(self.montar("juiz"), PLANTA_BOA.replace("contra 102,3 pontos", "contra 999 pontos"),
                    "the words of desmente are not in")

    def test_planta_desmentida_no_proprio_ficheiro_ou_num_derivado(self):
        pasta = self.montar("juiz")
        self.recusa(pasta, PLANTA_BOA.replace(f"fontes/{PDF}.txt", "peca.md"), "desmente_em is the planted file itself")
        self.recusa(pasta, PLANTA_BOA.replace(f"fontes/{PDF}.txt", "TEXTO-NUMERADO.md"), "is made again from peca.md")

    def test_planta_que_o_leitor_nao_ve(self):
        self.recusa(self.montar("juiz"), PLANTA_BOA.replace("[uma subida de]{diferenca}", "Total de ensaio, inventado para os ensaios")
                    .replace("[uma descida de]{diferenca}", "Total de ensaio, inventado"),
                    "the numbered text did not change, so a reader of it cannot see the plant")

    def test_planta_que_uma_conferencia_apanha(self):
        self.recusa(self.montar("juiz"), PLANTA_BOA.replace("[uma subida de]{diferenca}", "No trimestre anterior").replace(
                    "[uma descida de]{diferenca}", "No 2.º trimestre anterior"), "a check gives another result on the planted piece (check 1: failed")

    def test_planta_cujo_id_esta_no_pacote(self):
        self.recusa(self.montar("juiz"), PLANTA_BOA.replace('id = "Q7"', 'id = "ensaio"'), "the id ensaio is inside the package")

    def test_tudo_ou_nada(self):
        segunda = PLANTA_BOA.replace('"Q7"', '"Q8"').replace("[uma subida de]{diferenca}", "Este ensaio concede-a.").replace(
            "[uma descida de]{diferenca}", "Este ensaio recusa-a.").replace("contra 102,3", "contra 1 102,3")
        self.recusa(self.montar("juiz"), PLANTA_BOA + segunda, "the words of desmente are not in")

    def test_sem_loja_nao_se_planta_numa_peca(self):
        pasta = self.montar("juiz")
        with self.assertRaises(leituras.Recusa) as e:
            self.plantar(pasta, PLANTA_BOA, loja=None)
        self.assertIn("check 2 must run on the planted piece", str(e.exception))

    def test_planta_na_folha_do_editor_de_numeros(self):
        pasta = self.montar("numeros")
        self.plantar(pasta, f'''
[[planta]]
id = "Q5"
ficheiro = "folha.toml"
antes = 'periodo = "Segundo trimestre de ensaio"'
depois = 'periodo = "Primeiro trimestre de ensaio"'
descricao = "the previous quarter is given the wrong period"
desmente = "contra 102,3 pontos no segundo trimestre"
desmente_em = "fontes/{PDF}.txt"
''')
        self.assertEqual(json.loads((pasta / "chave.json").read_text())["plantas"][0]["lugares"], ["linha indice_anterior"])


# --------------------------------------------------------------------------- A3, A4, A5


class Lancar(Base):
    def test_lugar_claude_nao_lanca_nada(self):
        pasta = self.montar("especialista")
        chamadas, linhas = [], []
        self.assertEqual(leituras.lancar(pasta, executar=lambda a, e: chamadas.append(a) or (0, ""), ambiente={},
                                         imprimir=linhas.append), 0)
        self.assertEqual(chamadas, [])
        self.assertTrue(any(str(pasta / "LEITURA.md") in l for l in linhas))

    def test_planta_sem_raciocinio_escolhido(self):
        pasta = self.montar("juiz")
        chamadas, linhas = [], []
        self.assertEqual(leituras.lancar(pasta, executar=lambda a, e: chamadas.append(a) or (0, ""), ambiente={},
                                         imprimir=linhas.append), 2)
        self.assertEqual(chamadas, [])
        self.assertIn("CODEX_RACIOCINIO is not set", linhas[0])

    def test_lanca_com_o_substituto_e_regista_modelo_e_horas(self):
        pasta = self.montar("juiz")
        chamadas = []

        def substituto(args, ambiente):
            chamadas.append(args)
            Path(args[3]).write_text(bloco([]), encoding="utf-8")
            return 0, "codex exit=0 · modelo gpt-de-ensaio · raciocínio xhigh · 01:00:00 a 01:20:00 UTC · saída em x\n"

        self.assertEqual(leituras.lancar(pasta, executar=substituto, ambiente={"CODEX_RACIOCINIO": "xhigh"}, imprimir=lambda *a: None), 0)
        self.assertEqual(chamadas, [[str(leituras.LER_SH), str(pasta / "pacote"), str(pasta / "PROMPT.md"), str(pasta / "LEITURA.md")]])
        dados = json.loads((pasta / "leitura.json").read_text())
        self.assertEqual(dados["modelo"], "gpt-de-ensaio")
        self.assertRegex(dados["inicio"], r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ")


class ComLeitura(Base):
    """A scored reading's folder for the tests of pontuar and registar; no test of its own."""

    def lida(self, lugar="juiz", plantas=PLANTA_BOA, achados=(), veredicto="nao_passa", **kw):
        p = Plantada()
        self.addCleanup(p.apagar)
        pasta = self.montar(lugar, alvo=p.peca)
        if plantas:
            self.plantar(pasta, plantas)
        (pasta / "LEITURA.md").write_text(bloco(list(achados), veredicto, kw.get("extra", "")), encoding="utf-8")
        dados = json.loads((pasta / "leitura.json").read_text())
        dados.update({"modelo": "gpt-de-ensaio", "inicio": "2026-11-15T01:00:00Z", "fim": "2026-11-15T01:20:00Z"})
        (pasta / "leitura.json").write_text(json.dumps(dados))
        return pasta, p

    def decisoes(self, texto):
        return self.lista(texto)


class Pontuar(ComLeitura):
    def test_planta_sem_bloco_e_onde_fora_das_formas(self):
        pasta, _ = self.lida()
        (pasta / "LEITURA.md").write_text("no block\n", encoding="utf-8")
        with self.assertRaises(leituras.Recusa) as e:
            leituras.pontuar(pasta, imprimir=lambda *a: None)
        self.assertIn("no fenced toml block", str(e.exception))
        (pasta / "LEITURA.md").write_text(bloco([achado("corpo, paragraph 3")]), encoding="utf-8")
        with self.assertRaises(leituras.Recusa) as e:
            leituras.pontuar(pasta, imprimir=lambda *a: None)
        self.assertIn("not one of the forms of the common page", str(e.exception))
        self.assertFalse((pasta / "pontuacao.json").exists())

    def test_apanhada_e_decidida_passa(self):
        pasta, _ = self.lida(achados=[achado("frase 7", problema="it rose"), achado("frase 2", "menor", "a real one")])
        linhas = []
        with self.assertRaises(leituras.Recusa) as e:  # the real finding has no decision yet
            leituras.pontuar(pasta, imprimir=linhas.append)
        self.assertIn("real findings with no decision: [2]", str(e.exception))
        # A finding adopted stops a juiz's pass (ESQ3b, item I); declined with a reason, the reading passes.
        p = leituras.pontuar(pasta, self.decisoes('[[decisao]]\nachado = 2\ndecisao = "recusado"\nrazao = "not so"\n'),
                             imprimir=linhas.append)
        self.assertEqual((p["veredicto"], p["plantas_postas"], p["plantas_apanhadas"], p["achados"], p["adotados"]), ("passa", 1, 1, 1, 0))
        self.assertEqual(p["veredicto_do_leitor"], "nao_passa")
        self.assertTrue(any("the change between the two quarters is called a fall" in l and "finding 1: it rose" in l for l in linhas))

    def test_planta_o_passa_do_leitor_nao_vale(self):
        pasta, _ = self.lida(achados=[achado("frase 3")], veredicto="passa")
        p = leituras.pontuar(pasta, imprimir=lambda *a: None)
        self.assertEqual(p["veredicto"], "nao_passa")
        self.assertIn("caught 0 of 1 plants", p["razoes"])

    def test_planta_achado_real_a_trava(self):
        pasta, _ = self.lida(achados=[achado("frase 7"), achado("linha total", "trava")])
        p = leituras.pontuar(pasta, self.decisoes('[[decisao]]\nachado = 2\ndecisao = "recusado"\nrazao = "no"\n'), imprimir=lambda *a: None)
        self.assertEqual(p["veredicto"], "nao_passa")
        self.assertIn("real findings at trava: [2] (closed only by a repair read again)", p["razoes"])

    def test_planta_juiz_sem_plantas(self):
        pasta, _ = self.lida(plantas=None)
        p = leituras.pontuar(pasta, imprimir=lambda *a: None)
        self.assertEqual(p["veredicto"], "nao_passa")
        self.assertIn("a juiz reading needs at least one plant", p["razoes"])

    def test_planta_mesma_familia_so_levanta(self):
        pasta, _ = self.lida(lugar="especialista", plantas=None, achados=[achado("frase 2")])
        with self.assertRaises(leituras.Recusa):
            leituras.pontuar(pasta, imprimir=lambda *a: None)  # a Claude seat gives its model and times
        p = leituras.pontuar(pasta, modelo="claude-de-ensaio", inicio="2026-11-15T01:00:00Z", fim="2026-11-15T01:10:00Z",
                             imprimir=lambda *a: None)
        self.assertEqual(p["veredicto"], "levanta")

    def test_decisoes_sobre_plantas(self):
        pasta, _ = self.lida(achados=[achado("frase 7")])
        p = leituras.pontuar(pasta, self.decisoes('[[planta]]\nid = "Q7"\napanhada = false\nachado = 1\nrazao = "a false match"\n'),
                             imprimir=lambda *a: None)
        self.assertEqual((p["plantas_apanhadas"], p["veredicto"]), (0, "nao_passa"))
        pasta, _ = self.lida(achados=[achado("frase 8")])
        with self.assertRaises(leituras.Recusa) as e:
            leituras.pontuar(pasta, self.decisoes('[[planta]]\nid = "Q7"\napanhada = true\nachado = 1\nrazao = "close"\n'),
                             imprimir=lambda *a: None)
        self.assertIn("may never turn a miss into a catch", str(e.exception))


class PontuarCodigo(Base):
    repo_com_dois_commits = Codigo.repo_com_dois_commits

    def test_um_achado_no_ficheiro_e_so_candidato(self):
        repo, base = self.repo_com_dois_commits()
        (repo / codigo_registo()).write_text("", encoding="utf-8")
        ordem = self.lista("# The order\n\nc(x) is true only for a positive x.\n")
        pasta = self.montar("seguranca", alvo="codigo", repo=repo, base=base, ordens=[str(ordem)], artefactos=falsos_artefactos)
        self.plantar(pasta, '[[planta]]\nid = "Q9"\nficheiro = "arvore/oedp/a.py"\nantes = "return x > 0"\ndepois = "return x >= 0"\n'
                            'descricao = "c(0) is now true"\ndesmente = "c(x) is true only"\ndesmente_em = "lista.toml"\n',
                     artefactos=falsos_artefactos)
        (pasta / "LEITURA.md").write_text(bloco([achado("ficheiro arvore/oedp/a.py:6")]), encoding="utf-8")
        dados = json.loads((pasta / "leitura.json").read_text())
        dados.update({"modelo": "gpt-de-ensaio", "inicio": "2026-11-15T01:00:00Z", "fim": "2026-11-15T01:20:00Z"})
        (pasta / "leitura.json").write_text(json.dumps(dados))
        with self.assertRaises(leituras.Recusa) as e:
            leituras.pontuar(pasta, imprimir=lambda *a: None)
        self.assertIn("Q9 (oedp/a.py, lines [6]): candidate findings [1]", str(e.exception))
        decisoes = self.lista('[[planta]]\nid = "Q9"\napanhada = true\nachado = 1\nrazao = "it names the >= at line 6"\n')
        p = leituras.pontuar(pasta, decisoes, imprimir=lambda *a: None)
        self.assertEqual((p["plantas_apanhadas"], p["achados"]), (1, 0))


def codigo_registo():
    from oedp import codigo
    return codigo.REGISTO


class Registar(ComLeitura):
    def test_regista_na_peca_e_so_uma_vez(self):
        pasta, p = self.lida(achados=[achado("frase 7")], extra='pessoas_vistas = ["pessoa_de_ensaio"]\n')
        with self.assertRaises(leituras.Recusa) as e:
            leituras.registar(pasta, imprimir=lambda *a: None)
        self.assertIn("there is no pontuacao.json", str(e.exception))
        leituras.pontuar(pasta, imprimir=lambda *a: None)
        antes = p.peca.read_bytes()
        leituras.registar(pasta, imprimir=lambda *a: None)
        depois = p.peca.read_bytes()
        self.assertTrue(depois.startswith(antes))
        ultima = ler(p.peca).registo["leitura"][-1]
        self.assertEqual((ultima["impressao"], ultima["veredicto"], ultima["plantas_apanhadas"], ultima["pessoas_vistas"]),
                         (ler(p.peca).impressao, "passa", 1, ["pessoa_de_ensaio"]))
        with self.assertRaises(leituras.Recusa) as e:
            leituras.registar(pasta, imprimir=lambda *a: None)
        self.assertIn("registered already", str(e.exception))

    def test_planta_pontuacao_mais_velha_que_a_leitura(self):
        pasta, _ = self.lida(achados=[achado("frase 7")])
        leituras.pontuar(pasta, imprimir=lambda *a: None)
        os.utime(pasta / "pontuacao.json", (1_000_000_000, 1_000_000_000))
        with self.assertRaises(leituras.Recusa) as e:
            leituras.registar(pasta, imprimir=lambda *a: None)
        self.assertIn("pontuacao.json is older than LEITURA.md", str(e.exception))
