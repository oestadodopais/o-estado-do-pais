"""The ten checks: the test piece passes them all, and each check bites on a plant of its own.

A plant is a copy of the test piece with one thing broken. Each must fail its
check, for the reason stated, so a check that stops biting is caught here.
"""
from __future__ import annotations

import json
import os
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from oedp import conferir as conf
from oedp import construir as build
from oedp import noar, privacidade
from tests.apoio import LOJA, REPO, Plantada


class Limpa(unittest.TestCase):
    def plantar(self, trocas, loja=LOJA):
        p = Plantada(trocas)
        self.addCleanup(p.apagar)
        return p.resultados(loja)

    def falha(self, resultados, n, motivo):
        r = resultados[n]
        self.assertEqual(r.estado, conf.FALHOU, r.linha())
        self.assertTrue(any(motivo in x for x in r.razoes), f"check {n} failed for another reason: {r.linha()}")


class APecaDeEnsaioPassa(Limpa):
    def test_passa_as_nove_conferencias_da_peca(self):
        r = self.plantar([])
        for n in range(1, 10):
            self.assertEqual(r[n].estado, conf.PASSOU, r[n].linha())
        self.assertIn("terco: not compared, left to the numbers editor", r[1].notas)


class Check1(Limpa):
    def test_planta_mostra_que_nao_e_o_valor(self):
        r = self.plantar([('mostra = "104,7 pontos"', 'mostra = "104,8 pontos"')])
        self.falha(r, 1, "mostra '104,8 pontos' shows 104.8, but valor 104.7")

    def test_planta_algarismo_fora_de_referencia(self):
        r = self.plantar([("Este ensaio concede-a.", "Este ensaio concede-a desde 2025.")])
        self.falha(r, 1, "a digit outside any reference")

    def test_planta_referencia_sem_linha(self):
        r = self.plantar([("ficara em {indice_anterior}", "ficara em {indice_antigo}")])
        self.falha(r, 1, "the reference {indice_antigo} names no line")

    def test_planta_escala_errada(self):
        r = self.plantar([('mostra = "1,2 milhões de euros"', 'mostra = "1,2 mil milhões de euros"')])
        self.falha(r, 1, "valor 1234567")


class Check2(Limpa):
    def test_planta_excerto_que_nao_esta_na_fonte(self):
        r = self.plantar([("pontos no terceiro trimestre'''", "pontos no terceiro semestre'''")])
        self.falha(r, 2, "indice: the excerpt is not in the text of the stored copy of doc_pdf")

    def test_planta_copia_adulterada(self):
        loja = Path(tempfile.mkdtemp(prefix="oedp-loja-"))
        self.addCleanup(shutil.rmtree, loja, True)
        shutil.copytree(LOJA, loja, dirs_exist_ok=True)
        copia = next(p for p in loja.rglob("*") if p.is_file() and p.read_bytes().startswith(b"%PDF"))
        copia.write_bytes(copia.read_bytes() + b"\n")
        r = self.plantar([], loja=loja)
        self.falha(r, 2, "fonte doc_pdf: the stored copy hashes to")

    def test_planta_excerto_sem_o_valor(self):
        r = self.plantar([("excerto = '''contra 102,3 pontos no segundo trimestre'''", "excerto = '''pontos no segundo trimestre'''")])
        self.falha(r, 2, "indice_anterior: the excerpt does not hold valor 102.3")

    def test_sem_loja_uma_peca_publicada_falha_e_um_rascunho_nao_corre(self):
        r = self.plantar([], loja=None)
        self.falha(r, 2, "OEDP_FONTES is not set")
        r = self.plantar([('estado = "publicada"', 'estado = "rascunho"')], loja=None)
        self.assertEqual(r[2].estado, conf.NAO_CORRIDO)


class Check3(Limpa):
    def test_planta_derivado_que_nao_recompoe(self):
        r = self.plantar([('valor = "2.4"', 'valor = "2.5"'), ('mostra = "2,4 pontos"', 'mostra = "2,5 pontos"')])
        self.falha(r, 3, "diferenca: calculo gives 2.4, valor is 2.5")
        self.assertEqual(r[1].estado, conf.PASSOU, "the plant must break check 3 and not check 1")


class Check3Arredondamento(Limpa):
    def test_planta_round_que_nao_e_o_passo_exterior(self):
        r = self.plantar([('calculo = "round ( indice - indice_anterior , 1 )"', 'calculo = "round ( indice , 1 ) - indice_anterior"')])
        self.falha(r, 3, "diferenca: round may appear only once and only as the outermost step of calculo")


class Check4(Limpa):
    def test_planta_texto_mudado_depois_do_juiz(self):
        r = self.plantar([("Este ensaio concede-a.", "Este ensaio aceita-a.")])
        self.falha(r, 4, "is not the 04caca8b3aad3f076a27ee754c680c97a5c401f2e21439c7b7524fa29bd27cbf of its last passing juiz reading")

    def test_num_rascunho_nao_vincula(self):
        r = self.plantar([("Este ensaio concede-a.", "Este ensaio aceita-a."), ('estado = "publicada"', 'estado = "rascunho"')])
        self.assertEqual(r[4].estado, conf.NAO_VINCULA)
        self.assertTrue(any("would fail once published" in n for n in r[4].notas))


class Check5(Limpa):
    def test_planta_numeros_lidos_pela_mesma_familia(self):
        r = self.plantar([('lugar = "numeros"\nfamilia = "openai"', 'lugar = "numeros"\nfamilia = "anthropic"')])
        self.falha(r, 5, "the numeros reading is by anthropic, the family that produced what it read")

    def test_planta_planta_por_apanhar(self):
        r = self.plantar([("plantas_postas = 2\nplantas_apanhadas = 2\nachados = 0\nadotados = 0\nveredicto = \"passa\"\npessoas_vistas = [\"pessoa_de_ensaio\"]\n\n[[correcao]]",
                           "plantas_postas = 2\nplantas_apanhadas = 1\nachados = 0\nadotados = 0\nveredicto = \"passa\"\npessoas_vistas = [\"pessoa_de_ensaio\"]\n\n[[correcao]]")])
        self.falha(r, 5, "the juiz reading caught 1 of 2 planted errors")


class Check6(Limpa):
    def test_planta_dia_da_semana_errado(self):
        r = self.plantar([("na segunda-feira, 16 de novembro", "na terça-feira, 16 de novembro")])
        self.falha(r, 6, "2026-11-16 is a segunda-feira, not a terça-feira")

    def test_planta_data_que_nao_existe(self):
        r = self.plantar([('quando = "2026-11-12"', 'quando = "2026-02-30"')])
        self.falha(r, 6, "quando '2026-02-30' is not a real date")


class Check7(Limpa):
    def test_planta_nome_sem_linha_no_paragrafo(self):
        r = self.plantar([("## A leitura deste projeto", "A Pessoa de Ensaio esteve presente.\n\n## A leitura deste projeto")])
        self.falha(r, 7, "pessoa_de_ensaio: a paragraph of corpo prints the name and references none of the person's lines")

    def test_planta_leitor_que_nao_viu_a_pessoa(self):
        r = self.plantar([('veredicto = "passa"\npessoas_vistas = ["pessoa_de_ensaio"]\n\n[[leitura]]', 'veredicto = "passa"\npessoas_vistas = []\n\n[[leitura]]')])
        self.falha(r, 7, "the justica reader's pessoas_vistas do not equal the declared people")


class Check8(Limpa):
    def test_planta_caminho_da_maquina(self):
        caminho = "/" + "Users" + "/" + "mariaexemplo" + "/notas.txt"
        r = self.plantar([("Este ensaio concede-a.", f"Este ensaio concede-a. Ver {caminho}.")])
        self.falha(r, 8, "a machine path")

    def test_planta_endereco_de_email(self):
        endereco = "maria.exemplo" + "@" + "exemplo.pt"
        r = self.plantar([('largar_se = "', f'largar_se = "{endereco} ')])
        self.falha(r, 8, "an e-mail address other than the two allowed")

    def test_planta_cadeia_proibida(self):
        cadeia = "Nome Proibido De Ensaio"
        with mock.patch.dict(os.environ, {"PRIVACIDADE_PROIBIDOS": "linha vazia acima\n" + cadeia + "\n"}):
            r = self.plantar([("Este ensaio concede-a.", "Este ensaio concede-a. nome proibido de ensaio.")])
        self.falha(r, 8, "holds forbidden string number 2")

    def test_planta_chave_privada(self):
        chave = "-----" + "BEGIN" + " RSA PRIVATE KEY-----"
        r = self.plantar([('largar_se = "', f'largar_se = "{chave} ')])
        self.falha(r, 8, "a private key pattern")

    def test_sem_lista_diz_que_nao_ha_lista_e_no_github_falha(self):
        dados = [("a.txt", b"nada")]
        sem = privacidade.conferir(dados, {})
        self.assertTrue(sem.passou)
        self.assertEqual(sem.nota, "list of forbidden strings not available here")
        no_github = privacidade.conferir(dados, {"GITHUB_ACTIONS": "true"})
        self.assertFalse(no_github.passou)
        self.assertIn("list of forbidden strings not available here", no_github.falha_da_lista)

    def test_ligacao_web_com_home_nao_e_caminho(self):
        self.assertEqual(privacidade.achados_em("x", b'<a href="https://example.org/home/x">a</a>', []), [])

    def test_a_arvore_seguida_passa(self):
        r = conf.check8_arvore(REPO)
        self.assertEqual(r.estado, conf.PASSOU, r.linha())


class Check9(Limpa):
    def test_planta_titulo_de_fecho_em_falta(self):
        r = self.plantar([("## A objeção mais forte\n", "")])
        self.falha(r, 9, "the last three ## headings must be")

    def test_planta_campo_que_a_especificacao_nao_tem(self):
        r = self.plantar([('provisorio = false\nmostra = "102,3 pontos"', 'provisorio = false\nmostrar = "102,3 pontos"')])
        self.falha(r, 9, "lacks the field mostra")

    def test_planta_ligacao_partida_no_sitio_construido(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-sitio-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "index.html").write_text('<a href="/metodo/">x</a><a href="#nada">y</a>', encoding="utf-8")
        erros = build.ligacoes_partidas(pasta)
        self.assertTrue(any("the link /metodo/ leads to no built file" in x for x in erros), erros)
        self.assertTrue(any("the anchor #nada" in x for x in erros), erros)

    def test_planta_vercel_que_publica_sozinho(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-vercel-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        (pasta / "vercel.json").write_text(json.dumps({"git": {"deploymentEnabled": {"main": True, "*": False}}}), encoding="utf-8")
        self.assertTrue(any("deploymentEnabled" in x for x in conf.check9_vercel(pasta)))
        (pasta / "vercel.json").unlink()
        self.assertTrue(any("vercel.json is missing" in x for x in conf.check9_vercel(pasta)))
        self.assertEqual(conf.check9_vercel(REPO), [])

    def _direitos(self, mudar):
        p = Plantada()
        self.addCleanup(p.apagar)
        registo = p.pasta / "direitos" / "example.org.toml"
        mudar(registo)
        return p.resultados()

    def test_planta_fonte_sem_registo_de_direitos(self):
        r = self._direitos(lambda f: f.unlink())
        self.falha(r, 9, "fonte doc_pdf: the host example.org of its url_final has no rights record direitos/example.org.toml")

    def test_planta_registo_que_diz_nao(self):
        r = self._direitos(lambda f: f.write_text(f.read_text(encoding="utf-8").replace('guardar = "sim"', 'guardar = "nao"'), encoding="utf-8"))
        self.falha(r, 9, 'fonte doc_pdf: the rights record of example.org says guardar = "nao"')

    def test_planta_excerto_mais_longo_do_que_o_registo_deixa(self):
        r = self._direitos(lambda f: f.write_text(f.read_text(encoding="utf-8").replace("excerto_max = 200", "excerto_max = 60"), encoding="utf-8"))
        self.falha(r, 9, "terco: the excerpt has 65 characters; the rights record of example.org allows 60")

    def test_sem_a_pagina_do_metodo_nenhuma_peca_se_publica(self):
        p = Plantada()
        self.addCleanup(p.apagar)
        (p.pasta / "paginas" / "metodo.md").unlink()
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA)
        self.assertFalse(c.ok)
        self.assertTrue(any("the link /metodo/ leads to no built file" in m for m in c.mensagens), c.mensagens)

    def test_conferir_sai_com_um_quando_uma_conferencia_falha(self):
        import subprocess
        import sys

        p = Plantada([('mostra = "104,7 pontos"', 'mostra = "104,8 pontos"')])
        self.addCleanup(p.apagar)
        env = dict(os.environ, OEDP_FONTES=str(LOJA))
        r = subprocess.run([sys.executable, "-m", "oedp", "conferir", str(p.peca)], cwd=REPO, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 1, r.stdout + r.stderr)
        self.assertIn("check  1 (every figure resolves) · 2026-11-16-peca-de-ensaio: failed", r.stdout)

    def test_a_construcao_para_numa_peca_que_falha(self):
        p = Plantada([("## A objeção mais forte\n", "")])
        self.addCleanup(p.apagar)
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        c = build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA)
        self.assertFalse(c.ok)
        self.assertFalse((saida / "static").exists())


class Check10(unittest.TestCase):
    def setUp(self):
        self.saida = Path(tempfile.mkdtemp(prefix="oedp-noar-"))
        self.addCleanup(shutil.rmtree, self.saida, True)
        c = build.construir(REPO, raiz=REPO / "ensaios", saida=self.saida, loja=LOJA)
        self.assertTrue(c.ok, c.mensagens)
        self.estatica = self.saida / "static"
        self.vivo = {"https://ensaio.invalid/" + f.relative_to(self.estatica).as_posix(): f.read_bytes()
                     for f in self.estatica.rglob("*") if f.is_file()}

    def buscar(self, url):
        if url not in self.vivo:
            raise OSError("404")
        return self.vivo[url]

    def test_o_que_esta_no_ar_e_o_construido(self):
        self.assertEqual(noar.conferir("https://ensaio.invalid", self.estatica, self.buscar), [])

    def test_planta_pagina_no_ar_diferente(self):
        chave = "https://ensaio.invalid/pecas/2026-11-16-peca-de-ensaio/index.html"
        self.vivo[chave] = self.vivo[chave].replace(b"concede-a", b"aceita-a")
        razoes = noar.conferir("https://ensaio.invalid", self.estatica, self.buscar)
        self.assertTrue(any(r.startswith("pecas/2026-11-16-peca-de-ensaio/index.html: live SHA-256") for r in razoes), razoes)


if __name__ == "__main__":
    unittest.main()
