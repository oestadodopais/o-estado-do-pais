"""Work order ESQ1f: the second code and security reading. Each item with a plant, and a
test for each of the three errors planted in the reader's copy."""
from __future__ import annotations

import contextlib
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import conferir as conf
from oedp import construir as build
from oedp import fontes, julgados, noar, numeros
from oedp.peca import ler
from oedp.ambiente import sem_git_local
from tests.apoio import ENSAIOS, LOJA, PECA, REPO, Plantada, loja_fora_do_repositorio, sitio_de_ensaio

DERIVADOS_EM_CIRCULO = '''
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


def git_temporario(caso) -> Path:
    pasta = Path(tempfile.mkdtemp(prefix="oedp-git-"))
    caso.addCleanup(shutil.rmtree, pasta, True)
    subprocess.run(["git", "init", "-q", "-b", "main", str(pasta)], check=True, env=sem_git_local())
    return pasta


def commit(pasta: Path, *caminhos):
    endereco = "ensaio" + "@" + "ensaio.invalid"  # built from parts, so this file passes check 8
    subprocess.run(["git", "-C", str(pasta), "add", *caminhos], check=True, env=sem_git_local())
    subprocess.run(["git", "-C", str(pasta), "-c", "user.name=Ensaio", "-c", f"user.email={endereco}",
                    "commit", "-q", "-m", "ensaio"], check=True, env=sem_git_local())


class Base(unittest.TestCase):
    def plantar(self, trocas=(), loja=LOJA, depois=None):
        p = Plantada(trocas)
        self.addCleanup(p.apagar)
        if depois:
            depois(p)
        peca = ler(p.peca)
        ctx, erros = build.contexto(REPO, p.pasta, [peca] if peca.vinculada else [])
        return {r.verificacao: r for r in conf.conferir_peca(p.peca, ctx, loja, anterior=("absent", None))}, p, erros

    def falha(self, r, n, motivo):
        self.assertEqual(r[n].estado, conf.FALHOU, r[n].linha())
        self.assertTrue(any(motivo in x for x in r[n].razoes), r[n].linha())


# --------------------------------------------------------------------------- 1


class Item01NaoSeApaga(unittest.TestCase):
    def test_planta_peca_publicada_apagada_ou_renomeada(self):
        repo = git_temporario(self)
        (repo / "pecas" / "2026").mkdir(parents=True)
        shutil.copy2(PECA, repo / "pecas" / "2026" / PECA.name)
        rascunho = PECA.read_text(encoding="utf-8").replace('estado = "publicada"', 'estado = "rascunho"')
        (repo / "pecas" / "2026" / "2026-11-17-rascunho-de-ensaio.md").write_text(rascunho, encoding="utf-8")
        commit(repo, "pecas")
        self.assertEqual(conf.pecas_desaparecidas(repo), ([], True))
        (repo / "pecas" / "2026" / PECA.name).rename(repo / "pecas" / "2026" / "2026-11-16-outro-nome.md")
        (repo / "pecas" / "2026" / "2026-11-17-rascunho-de-ensaio.md").unlink()
        razoes, havia = conf.pecas_desaparecidas(repo)
        self.assertTrue(havia)
        self.assertEqual(razoes, [f"pecas/2026/{PECA.name} was published on main and is gone here (deleted or renamed); "
                                  "a published piece can only be withdrawn"])


# --------------------------------------------------------------------------- 2


class Item02EstadoNumSentido(Base):
    def test_planta_rascunho_depois_de_publicada(self):
        def rascunho(p):
            with open(p.peca, "a", encoding="utf-8") as f:
                f.write('\n[[estado]]\nestado = "rascunho"\nem = "2026-11-17T09:00:00Z"\npor = "ensaio"\nrazao = "Ensaio."\n')
        r, _, _ = self.plantar(depois=rascunho)
        self.falha(r, 9, "a piece that was published cannot become a draft again")

    def test_o_comando_recusa(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        r = subprocess.run([sys.executable, "-m", "oedp", "estado", str(p.peca), "rascunho", "--razao", "Ensaio."],
                           cwd=REPO, capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn("it can only be withdrawn (retirada) or published again, never made a draft", r.stderr)


# --------------------------------------------------------------------------- 3


class Item03LigacoesSimbolicas(Base):
    def test_planta_ligacao_em_mesas(self):
        r, p, erros = self.plantar(depois=lambda p: (p.pasta / "mesas" / "ligacao.md").symlink_to(p.pasta / "mesas" / "ensaio.md"))
        self.assertIn("mesas/ligacao.md is a symbolic link; nothing under mesas/ may be one", erros)
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        self.assertFalse(build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA).ok)


# --------------------------------------------------------------------------- 4


class Item04PublicarUmaPecaHonesta(unittest.TestCase):
    def test_uma_peca_honesta_publica(self):
        p = Plantada([('estado = "publicada"', 'estado = "rascunho"')])
        self.addCleanup(p.apagar)
        env = dict(os.environ, OEDP_FONTES=str(loja_fora_do_repositorio(self)))
        r = subprocess.run([sys.executable, "-m", "oedp", "estado", str(p.peca), "publicada", "--razao", "Ensaio."],
                           cwd=REPO, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(ler(p.peca).estado, "publicada")

    def test_planta_sem_main_recusa_e_diz_porque(self):
        from oedp import __main__ as cli

        p = Plantada([('estado = "publicada"', 'estado = "rascunho"')])
        self.addCleanup(p.apagar)
        erro = io.StringIO()
        with mock.patch.dict(os.environ, {"OEDP_FONTES": str(loja_fora_do_repositorio(self))}), \
                mock.patch.object(conf, "anterior_em_main", return_value=("unavailable", None)), \
                contextlib.redirect_stderr(erro):
            codigo = cli.principal(["estado", str(p.peca), "publicada", "--razao", "Ensaio."])
        self.assertEqual(codigo, 1)
        self.assertIn("main is not at hand, so the record cannot be proved to have only grown", erro.getvalue())
        self.assertEqual(ler(p.peca).estado, "rascunho")


# --------------------------------------------------------------------------- 5


class Item05TextosJulgados(unittest.TestCase):
    def test_planta_registo_de_texto_invalido_e_juiz_sem_familia(self):
        registo = {"passo": [{"nome": "escrita", "lugar": "redator", "familia": "anthropic", "modelo": "m",
                              "inicio": "2026-11-15T09:00:00Z", "fim": "2026-11-15T09:30:00Z"}],
                   "leitura": [{"lugar": "juiz", "modelo": "m", "inicio": "2026-11-15T10:00:00Z", "fim": "2026-11-15T10:20:00Z",
                                "impressao": "a" * 64, "plantas_postas": 1, "plantas_apanhadas": 1, "achados": 0,
                                "adotados": 0, "veredicto": "passa"}]}
        self.assertIn("textos.registo.toml [[leitura]] number 1 lacks the field familia",
                      julgados.erros_do_registo("textos.registo.toml", registo))
        self.assertEqual(julgados.erros_de_julgamento("textos.toml", registo, "a" * 64),
                         ["textos.toml: the juiz reading on its current fingerprint has no familia, so it cannot be told from the writer's"])

    def test_planta_registo_de_texto_cortado_face_a_main(self):
        repo = git_temporario(self)
        alvo = repo / "textos.registo.toml"
        from oedp import ensaio  # the record a tests' tree is given (ESQ3d: no record of the sentences is stored)

        alvo.write_text(ensaio.registo_dos_textos(ensaio.TEXTOS.read_bytes()), encoding="utf-8")
        commit(repo, "textos.registo.toml")
        self.assertEqual(julgados.historia(repo, alvo), [])
        texto = alvo.read_text(encoding="utf-8")
        alvo.write_text(texto[: texto.rindex("\n[[leitura]]")] + "\n", encoding="utf-8")
        self.assertEqual(julgados.historia(repo, alvo),
                         ["textos.registo.toml: the record on main is not the beginning of the record now: a table was removed or changed"])

    def test_planta_retirada_tambem_pede_o_julgamento(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        with open(p.peca, "a", encoding="utf-8") as f:
            f.write('\n[[estado]]\nestado = "retirada"\nem = "2026-11-17T09:00:00Z"\npor = "ensaio"\nrazao = "Ensaio."\n')
        f = p.pasta / "textos.registo.toml"
        f.write_text(f.read_text(encoding="utf-8").replace('impressao = "', 'impressao = "0'), encoding="utf-8")
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA)
        self.assertFalse(c.ok)
        self.assertTrue(any("textos.toml: no juiz reading on its current fingerprint" in m for m in c.mensagens), c.mensagens)


# --------------------------------------------------------------------------- 6 and 7


class Item06Sinais(Base):
    def test_planta_sinal_separado_por_tabulacao(self):
        r, _, _ = self.plantar([('mostra = "104,7 pontos"', 'mostra = "−\\t104,7 pontos"')])
        self.falha(r, 1, "shows -104.7, but valor 104.7")

    def test_planta_valor_negativo_sem_sinal_na_fonte(self):
        r, _, _ = self.plantar([('valor = "104.7"', 'valor = "-104.7"'), ('mostra = "104,7 pontos"', 'mostra = "−104,7 pontos"')])
        self.falha(r, 2, "indice: the excerpt does not hold valor -104.7")

    def test_sinais_no_excerto(self):
        self.assertTrue(numeros.contem_figura("caiu para -1,4 pontos", "-1.4"))
        self.assertTrue(numeros.contem_figura("caiu para − 1,4 pontos", "-1.4"))
        self.assertFalse(numeros.contem_figura("subiu 1,4 pontos", "-1.4"))
        self.assertFalse(numeros.contem_figura("caiu para -1,4 pontos", "1.4"))


class Item07Circulos(Base):
    def test_planta_derivados_em_circulo(self):
        r, _, _ = self.plantar([("\n[[pessoa]]", DERIVADOS_EM_CIRCULO)])
        self.falha(r, 3, "circulo_a: its calculation depends on itself (circulo_a -> circulo_b -> circulo_a)")


# --------------------------------------------------------------------------- 8 to 10


class Item08Aspas(Base):
    def test_planta_aspas_em_entidade(self):
        r, _, _ = self.plantar([("Este ensaio concede-a.", "Este ensaio concede-a: &laquo;frase de ensaio&raquo;.")])
        self.falha(r, 9, "corpo: a quotation mark (« ») typed in the text")

    def test_planta_aspas_dentro_de_palavras_ligadas(self):
        r, _, _ = self.plantar([("[O despacho de ensaio foi assinado]{despacho}", "[«O despacho de ensaio foi assinado»]{despacho}")])
        self.falha(r, 9, "corpo: a quotation mark (« ») typed in the text")


LEITURA_DA_MESMA_FAMILIA = '''
[[leitura]]
lugar = "leitor"
familia = "anthropic"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T12:00:00Z"
fim = "2026-11-16T12:05:00Z"
impressao = "04caca8b3aad3f076a27ee754c680c97a5c401f2e21439c7b7524fa29bd27cbf"
plantas_postas = 0
plantas_apanhadas = 0
achados = 0
adotados = 0
veredicto = "passa"
'''


class Item09MesmaFamiliaSoLevanta(Base):
    def test_planta_leitura_da_mesma_familia_que_passa(self):
        def acrescentar(p):
            with open(p.peca, "a", encoding="utf-8") as f:
                f.write(LEITURA_DA_MESMA_FAMILIA)
        r, _, _ = self.plantar(depois=acrescentar)
        self.falha(r, 9, "a reading by anthropic, the family that produced what it read, can only raise (veredicto levanta), not passa")

    def test_registar_recusa(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        r = subprocess.run([sys.executable, "-m", "oedp", "registar", str(p.peca), "leitura", "--lugar", "leitor", "--familia", "anthropic",
                            "--modelo", "m", "--inicio", "2026-11-16T12:00:00Z", "--fim", "2026-11-16T12:05:00Z",
                            "--impressao", ler(p.peca).impressao, "--plantas-postas", "0", "--plantas-apanhadas", "0",
                            "--achados", "0", "--adotados", "0", "--veredicto", "passa"], cwd=REPO, capture_output=True, text=True)
        self.assertEqual(r.returncode, 1)
        self.assertIn("can only raise (veredicto levanta), not passa", r.stderr)


class Item10UmaFamilia(Base):
    def test_planta_passo_de_outra_familia(self):
        def acrescentar(p):
            with open(p.peca, "a", encoding="utf-8") as f:
                f.write('\n[[passo]]\nnome = "edicao"\nlugar = "direcao"\nfamilia = "openai"\nmodelo = "m"\n'
                        'inicio = "2026-11-16T12:00:00Z"\nfim = "2026-11-16T12:05:00Z"\n')
        r, _, _ = self.plantar(depois=acrescentar)
        self.falha(r, 5, "the production steps are by more than one family (anthropic, openai)")


# --------------------------------------------------------------------------- 11 to 13


class Item11ValoresDoToml(Base):
    def test_planta_endereco_escrito_com_escape(self):
        r, _, _ = self.plantar([('largar_se = "', 'largar_se = "maria.exemplo\\u0040exemplo.pt ')])
        self.falha(r, 8, "an e-mail address other than the two allowed")


class Item12LojaConfinada(unittest.TestCase):
    def test_planta_pasta_da_loja_que_e_ligacao(self):
        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        fora = Path(tempfile.mkdtemp(prefix="oedp-fora-"))
        self.addCleanup(shutil.rmtree, loja, True)
        self.addCleanup(shutil.rmtree, fora, True)
        (loja / "sha256").symlink_to(fora, target_is_directory=True)
        with self.assertRaises(fontes.ErroDaLoja) as e:
            fontes.guardar(loja, b"copia de ensaio")
        self.assertIn("sha256 in the store is a symbolic link; the store's folders may not be", str(e.exception))
        self.assertEqual(list(fora.iterdir()), [])


class Item13Manifesto(unittest.TestCase):
    def test_planta_ficheiro_fora_do_manifesto(self):
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        self.assertTrue(build.construir(REPO, raiz=sitio_de_ensaio(self), saida=saida, loja=LOJA).ok)
        est = saida / "static"
        self.assertEqual(build.manifesto_confere(est), [])
        (est / "a-mais.html").write_text("<p>a mais</p>", encoding="utf-8")
        self.assertEqual(build.manifesto_confere(est), ["manifesto.json does not list a-mais.html, which is in the output folder"])
        razoes = noar.conferir("https://e.invalid", est, lambda u: b"")
        self.assertEqual(len(razoes), 1)
        self.assertTrue(razoes[0].startswith("the build's manifesto.json does not list exactly the files of the output folder"))
        man = json.loads((est / "manifesto.json").read_text(encoding="utf-8"))
        man["ficheiros"]["fantasma.html"] = "0" * 64
        (est / "a-mais.html").unlink()
        (est / "manifesto.json").write_text(json.dumps(man), encoding="utf-8")
        self.assertEqual(build.manifesto_confere(est), ["manifesto.json lists fantasma.html, which is not in the output folder"])


# --------------------------------------------------------------------------- the three planted in the reader's copy


class OsTresPlantados(Base):
    def test_enfase_com_sublinhado(self):
        r, _, _ = self.plantar([("[o documento de ensaio publicado na segunda-feira, 16 de novembro]{indice}",
                                 "o documento de ensaio publicado na _terça-feira_, [16 de novembro]{indice}")])
        self.falha(r, 6, "2026-11-16 is a segunda-feira, not a terça-feira")
        r, _, _ = self.plantar([("## A leitura deste projeto", "Pessoa de _Ensaio_ esteve presente.\n\n## A leitura deste projeto")])
        self.falha(r, 7, "a paragraph of corpo prints the name and references none of the person's lines")

    def test_loja_relativa_dentro_do_repositorio(self):
        sha = ler(PECA).fontes["doc_pdf"]["sha256"]
        r = subprocess.run([sys.executable, "-m", "oedp", "texto", sha], cwd=REPO, capture_output=True, text=True,
                           env=dict(os.environ, OEDP_FONTES="ensaios/fontes"))
        self.assertEqual(r.returncode, 2)
        self.assertIn("refused: OEDP_FONTES resolves inside the repository (ensaios/fontes)", r.stderr)

    def test_antes_e_agora_com_os_seus_valores(self):
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        self.assertTrue(build.construir(REPO, raiz=sitio_de_ensaio(self), saida=saida, loja=LOJA).ok)
        for nome in ("correcoes/index.html", "pecas/2026-11-16-peca-de-ensaio/index.html"):
            html = (saida / "static" / nome).read_text(encoding="utf-8")
            self.assertIn('<span class="rotulo">Antes dizia:</span> escrita para ensaiar o esqueleto', html)
            self.assertIn('<span class="rotulo">Agora diz:</span> escrita para provar o esqueleto', html)


if __name__ == "__main__":
    unittest.main()
