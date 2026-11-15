"""Work order ESQ1g: the third code and security reading, and the closing headings."""
from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from oedp import conferir as conf
from oedp import construir as build
from oedp import julgados
from oedp.forma import FECHO
from oedp.peca import ler
from tests.apoio import ENSAIOS, LOJA, PECA, REPO, Plantada, sitio_de_ensaio


class Base(unittest.TestCase):
    def plantar(self, trocas=(), depois=None):
        p = Plantada(trocas)
        self.addCleanup(p.apagar)
        if depois:
            depois(p)
        peca = ler(p.peca)
        ctx, _ = build.contexto(REPO, p.pasta, [peca] if peca.vinculada else [])
        return {r.verificacao: r for r in conf.conferir_peca(p.peca, ctx, LOJA, anterior=("absent", None))}, p

    def falha(self, r, n, motivo):
        self.assertEqual(r[n].estado, conf.FALHOU, r[n].linha())
        self.assertTrue(any(motivo in x for x in r[n].razoes), r[n].linha())


def mudar_ultima(lugar, antes, depois):
    def mudar(p):
        texto = p.peca.read_text(encoding="utf-8")
        k = texto.rindex(f'lugar = "{lugar}"')
        p.peca.write_text(texto[:k] + texto[k:].replace(antes, depois, 1), encoding="utf-8")
    return mudar


# --------------------------------------------------------------------------- 1


class Item01PassaSoComTodasAsPlantas(Base):
    def test_planta_justica_que_passa_com_uma_de_duas(self):
        def mudar(p):
            mudar_ultima("justica", "plantas_postas = 1", "plantas_postas = 2")(p)
        r, _ = self.plantar(depois=mudar)
        self.falha(r, 9, "a reading recorded as passing caught 1 of 2 planted errors; it passes only if it caught every one")
        self.falha(r, 7, "the justica reading caught 1 of 2 planted errors")

    def test_planta_justica_sem_plantas(self):
        def mudar(p):
            texto = p.peca.read_text(encoding="utf-8")
            k = texto.rindex('lugar = "justica"')
            fim = texto[k:].replace("plantas_postas = 1", "plantas_postas = 0", 1).replace("plantas_apanhadas = 1", "plantas_apanhadas = 0", 1)
            p.peca.write_text(texto[:k] + fim, encoding="utf-8")
        r, _ = self.plantar(depois=mudar)
        self.falha(r, 7, "the justica reading had no planted error")

    def test_registar_recusa(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        r = subprocess.run([sys.executable, "-m", "oedp", "registar", str(p.peca), "leitura", "--lugar", "oposto", "--familia", "openai",
                            "--modelo", "m", "--inicio", "2026-11-16T12:00:00Z", "--fim", "2026-11-16T12:05:00Z",
                            "--impressao", ler(p.peca).impressao, "--plantas-postas", "2", "--plantas-apanhadas", "1",
                            "--achados", "0", "--adotados", "0", "--veredicto", "passa"], cwd=REPO, capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn("a reading recorded as passing caught 1 of 2 planted errors", r.stderr)


# --------------------------------------------------------------------------- 2


class Item02RegistoDosTextosComoODeUmaPeca(unittest.TestCase):
    def registo(self, **leitura):
        base = {"lugar": "juiz", "familia": "openai", "modelo": "m", "inicio": "2026-11-15T10:00:00Z", "fim": "2026-11-15T10:20:00Z",
                "impressao": "a" * 64, "plantas_postas": 1, "plantas_apanhadas": 1, "achados": 0, "adotados": 0, "veredicto": "passa"}
        base.update(leitura)
        return {"passo": [{"nome": "escrita", "lugar": "redator", "familia": "anthropic", "modelo": "m",
                           "inicio": "2026-11-15T09:00:00Z", "fim": "2026-11-15T09:30:00Z"}], "leitura": [base]}

    def test_o_registo_valido_passa(self):
        self.assertEqual(julgados.erros_do_registo("textos.registo.toml", self.registo()), [])

    def test_plantas_de_um_registo_de_texto(self):
        n = "textos.registo.toml [[leitura]] number 1"
        casos = {
            "fim": ("2026-02-30T10:20:00Z", f"{n}: fim '2026-02-30T10:20:00Z' is not a real date in the form YYYY-MM-DDTHH:MM:SSZ"),
            "impressao": ("abc", f"{n}: impressao is not a SHA-256"),
            "adotados": (2, f"{n}: adotados must be between 0 and achados"),
            "plantas_apanhadas": (3, f"{n}: plantas_apanhadas must be between 0 and plantas_postas"),
        }
        for campo, (valor, mensagem) in casos.items():
            self.assertIn(mensagem, julgados.erros_do_registo("textos.registo.toml", self.registo(**{campo: valor})), campo)


# --------------------------------------------------------------------------- 3


class Item03AspasSimples(Base):
    def test_planta_aspas_simples(self):
        r, _ = self.plantar([("Este ensaio concede-a.", "Este ensaio concede-a: ‘frase de ensaio’.")])
        self.falha(r, 9, "corpo: a quotation mark (‘ ’) typed in the text")

    def test_um_apostrofo_dentro_de_palavra_fica(self):
        r, _ = self.plantar([("Este ensaio concede-a.", "Este ensaio concede-a, d’água.")])
        self.assertFalse(any("quotation mark" in x for x in r[9].razoes), r[9].linha())


# --------------------------------------------------------------------------- 4


class Item04SoOManifestoDaRaiz(unittest.TestCase):
    def test_planta_manifesto_mais_fundo(self):
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        self.assertTrue(build.construir(REPO, raiz=sitio_de_ensaio(self), saida=saida, loja=LOJA).ok)
        est = saida / "static"
        (est / "tipos" / "manifesto.json").write_text("{}", encoding="utf-8")
        self.assertIn("tipos/manifesto.json", build.manifesto(est)["ficheiros"])
        self.assertEqual(build.manifesto_confere(est), ["manifesto.json does not list tipos/manifesto.json, which is in the output folder"])


# --------------------------------------------------------------------------- 5: the two planted in the reader's copy


CIRCULO_DEPOIS_DE_QUEM_DEPENDE = '''
[[linha]]
id = "antes_do_circulo"
tipo = "derivado"
calculo = "circulo_a"
valor = "1"
unidade = "pontos"
mede = "Ensaio"
periodo = "Ensaio"
compara = "Ensaio"
mostra = "1 ponto"

[[linha]]
id = "circulo_a"
tipo = "derivado"
calculo = "circulo_b"
valor = "1"
unidade = "pontos"
mede = "Ensaio"
periodo = "Ensaio"
compara = "Ensaio"
mostra = "1 ponto"

[[linha]]
id = "circulo_b"
tipo = "derivado"
calculo = "circulo_a"
valor = "1"
unidade = "pontos"
mede = "Ensaio"
periodo = "Ensaio"
compara = "Ensaio"
mostra = "1 ponto"

[[pessoa]]'''


class OsDoisPlantados(Base):
    def test_circulo_alcancado_de_uma_linha_anterior(self):
        r, _ = self.plantar([("\n[[pessoa]]", CIRCULO_DEPOIS_DE_QUEM_DEPENDE)])
        self.falha(r, 3, "circulo_a: its calculation depends on itself (circulo_a -> circulo_b -> circulo_a)")

    def test_publicada_retirada_rascunho(self):
        def estados(p):
            with open(p.peca, "a", encoding="utf-8") as f:
                for estado in ("retirada", "rascunho"):
                    f.write(f'\n[[estado]]\nestado = "{estado}"\nem = "2026-11-17T09:00:00Z"\npor = "ensaio"\nrazao = "Ensaio."\n')
        r, _ = self.plantar(depois=estados)
        self.falha(r, 9, "a piece that was published cannot become a draft again; it can only be withdrawn")


# --------------------------------------------------------------------------- 6


class Item06OsTitulosDeFecho(Base):
    def test_as_palavras_da_especificacao(self):
        self.assertEqual(FECHO, ("A leitura deste projeto", "O melhor argumento contra esta leitura", "O que acompanhar"))
        espec = (REPO / "docs" / "ESPEC-PECA.md").read_text(encoding="utf-8")
        self.assertIn("`## A leitura deste projeto` (what the project thinks), `## O melhor argumento contra esta leitura`", espec)
        corpo = ler(PECA).corpo
        self.assertEqual([l[3:] for l in corpo.split("\n") if l.startswith("## ")], list(FECHO))

    def test_planta_titulo_antigo(self):
        r, _ = self.plantar([("## O que acompanhar\n", "## O que seguir\n")])
        self.falha(r, 9, "the last three ## headings must be, in order and in these words: A leitura deste projeto; "
                         "O melhor argumento contra esta leitura; O que acompanhar")

    def test_a_pagina_do_tema_le_o_ultimo_titulo(self):
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        self.assertTrue(build.construir(REPO, raiz=sitio_de_ensaio(self), saida=saida, loja=LOJA).ok)
        html = (saida / "static" / "temas" / "ensaio" / "index.html").read_text(encoding="utf-8")
        self.assertIn("A próxima edição de ensaio sai a 16 de fevereiro de 2027.", html)

    def test_nova_escreve_os_novos_titulos(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-nova-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        shutil.copytree(REPO / "oedp", pasta / "oedp", ignore=shutil.ignore_patterns("__pycache__"))
        r = subprocess.run([sys.executable, "-m", "oedp", "nova", "2026-11-20-uma-peca", "--tipo", "diario"], cwd=pasta,
                           capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        corpo = ler(pasta / "pecas" / "2026" / "2026-11-20-uma-peca.md").corpo
        self.assertEqual([l[3:] for l in corpo.split("\n") if l.startswith("## ")], list(FECHO))


if __name__ == "__main__":
    unittest.main()
