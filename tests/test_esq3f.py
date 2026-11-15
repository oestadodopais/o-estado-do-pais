"""ESQ3d (blocos/esq3/ORDEM-3d.md): the tests' site has its own fixed sentences, and their record is
written when a tests' tree is assembled; nothing invented about the fixed sentences is stored."""
from __future__ import annotations

import hashlib
import shutil
import tempfile
import tomllib
import unittest
from pathlib import Path

from oedp import construir as build
from oedp import ensaio, marca
from tests.apoio import ENSAIOS, REPO
from tests.test_esq3e import arvore_do_repositorio

RAZAO_DO_MODELO = "is signed by the tests' model name (modelo-de-ensaio)"
RAZAO_DA_IMPRESSAO = "textos.toml: no juiz reading on its current fingerprint"


def pasta_temporaria(caso, prefixo: str) -> Path:
    p = Path(tempfile.mkdtemp(prefix=prefixo))
    caso.addCleanup(shutil.rmtree, p, True)
    return p


class A_AsFrasesDoEnsaio(unittest.TestCase):
    def test_as_chaves_sao_as_mesmas_menos_uma(self):
        real = tomllib.loads((REPO / "textos.toml").read_text(encoding="utf-8"))
        do_ensaio = tomllib.loads(ensaio.TEXTOS.read_text(encoding="utf-8"))
        self.assertEqual(set(do_ensaio) - set(real), {"arvore_de_ensaio"})
        self.assertEqual(set(real) - set(do_ensaio), set())
        self.assertNotEqual(ensaio.TEXTOS.read_bytes(), (REPO / "textos.toml").read_bytes())

    def test_a_chave_no_ficheiro_real_e_recusada(self):
        arvore = arvore_do_repositorio(self)
        shutil.copy2(ensaio.TEXTOS, arvore / "textos.toml")  # the tests' file as a real tree's
        _, erros = build.contexto(REPO, arvore, [])
        self.assertIn("textos.toml holds the key arvore_de_ensaio, which marks the tests' own fixed sentences; "
                      "the real file may never hold it", erros)

    def test_planta_a_mesma_chave_numa_arvore_marcada(self):
        """The control the refusal rests on: in a tree the tests assembled, the key is the tests' own."""
        arvore = ensaio.copiar_sitio(pasta_temporaria(self, "oedp-ensaio-") / "raiz")
        _, erros = build.contexto(REPO, arvore, [])
        self.assertFalse(any("arvore_de_ensaio" in e for e in erros), erros)


class B_ORegistoEscritoAoMontar(unittest.TestCase):
    def test_nada_de_inventado_sobre_as_frases_esta_guardado(self):
        self.assertFalse((ENSAIOS / "textos.registo.toml").exists())
        arvore = ensaio.copiar_sitio(pasta_temporaria(self, "oedp-ensaio-") / "raiz")
        registo = tomllib.loads((arvore / "textos.registo.toml").read_text(encoding="utf-8"))
        self.assertEqual(registo["leitura"][0]["impressao"], hashlib.sha256((arvore / "textos.toml").read_bytes()).hexdigest())
        self.assertEqual((arvore / "textos.toml").read_bytes(), ensaio.TEXTOS.read_bytes())
        self.assertTrue(marca.de_ensaio(arvore))

    def test_a_arvore_montada_constroi_a_sua_peca_publicada(self):
        c = ensaio.construir_ensaio(pasta_temporaria(self, "oedp-ensaio-"))
        self.assertTrue(c.ok, c.mensagens)
        self.assertTrue((c.estatica / "pecas" / ensaio.PECA_ID / "index.html").is_file())

    def montada_no_repositorio(self, modelo=None, impressao_real=False) -> tuple[list, list]:
        arvore = arvore_do_repositorio(self)
        texto = ensaio.registo_dos_textos(ensaio.TEXTOS.read_bytes())
        if modelo:
            texto = texto.replace(f'modelo = "{marca.MODELO}"', f'modelo = "{modelo}"')
        if impressao_real:
            texto = texto.replace(hashlib.sha256(ensaio.TEXTOS.read_bytes()).hexdigest(),
                                  hashlib.sha256((REPO / "textos.toml").read_bytes()).hexdigest())
        (arvore / "textos.registo.toml").write_text(texto, encoding="utf-8")
        ctx, _ = build.contexto(REPO, arvore, [])
        return ctx.ensaio, ctx.julgamento

    def test_copiado_para_a_arvore_do_repositorio_e_recusado_duas_vezes(self):
        ensaio_, julgamento = self.montada_no_repositorio()
        self.assertTrue(ensaio_ and all(RAZAO_DO_MODELO in x for x in ensaio_), ensaio_)
        self.assertTrue(any(x.startswith(RAZAO_DA_IMPRESSAO) for x in julgamento), julgamento)

    def test_planta_so_a_impressao(self):
        """The tests' model name taken off: the judgment is still on a fingerprint that is not the real file's."""
        ensaio_, julgamento = self.montada_no_repositorio(modelo="outro-modelo")
        self.assertEqual(ensaio_, [])
        self.assertTrue(any(x.startswith(RAZAO_DA_IMPRESSAO) for x in julgamento), julgamento)

    def test_planta_so_o_nome_do_modelo(self):
        """The fingerprint made the real file's: the tests' model name is still refused."""
        ensaio_, julgamento = self.montada_no_repositorio(impressao_real=True)
        self.assertTrue(ensaio_ and all(RAZAO_DO_MODELO in x for x in ensaio_), ensaio_)
        self.assertFalse(any(x.startswith(RAZAO_DA_IMPRESSAO) for x in julgamento), julgamento)

    def test_a_arvore_do_repositorio_nao_constroi_nada_publicado(self):
        ctx, _ = build.contexto(REPO, REPO, [])
        self.assertTrue(any(x.startswith("textos.toml:") for x in ctx.julgamento), ctx.julgamento)  # the real sentences have no judgment
        self.assertEqual(ctx.ensaio, [])
        c = build.construir(REPO, saida=pasta_temporaria(self, "oedp-saida-") / "s", loja=None)
        self.assertTrue(c.ok, c.mensagens)
        self.assertEqual(sorted(p.name for p in c.estatica.iterdir()), ["404.html", "index.html", "manifesto.json"])


if __name__ == "__main__":
    unittest.main()


class C_OPatchNoSitioDeEnsaio(unittest.TestCase):
    def test_o_metodo_diz_que_ainda_nao_houve_conferencia(self):
        c = ensaio.construir_ensaio(pasta_temporaria(self, "oedp-ensaio-"))
        self.assertTrue(c.ok, c.mensagens)
        metodo = (c.estatica / "metodo" / "index.html").read_text(encoding="utf-8")
        self.assertIn('<p class="reconferencia">Ainda não houve nenhuma conferência das fontes das peças publicadas.</p>', metodo)

    def test_planta_um_registo_de_volta_inteira(self):
        raiz = ensaio.copiar_sitio(pasta_temporaria(self, "oedp-ensaio-") / "raiz")
        (raiz / "reconferencias.toml").write_text('[[reconferencia]]\nem = "2026-11-22T06:00:00Z"\npecas = 1\nexcertos = 7\n'
                                                  'falhados = 0\nretiradas = []\nso_relatar = false\n', encoding="utf-8")
        c = build.construir(REPO, raiz=raiz, saida=pasta_temporaria(self, "oedp-saida-") / "s", loja=ensaio.LOJA, conferir_antes=False)
        self.assertTrue(c.ok, c.mensagens)
        metodo = (c.estatica / "metodo" / "index.html").read_text(encoding="utf-8")
        self.assertIn("Última conferência das fontes: 22 de novembro de 2026. Peças conferidas: 1. Excertos conferidos: 7. "
                      "Peças retiradas: 0.", metodo)
