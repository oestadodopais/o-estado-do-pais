"""ESQ2 item H: the code has a record, and nothing is published on code the other family has not read."""
from __future__ import annotations

import hashlib
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from oedp import codigo, ensaio, registo
from oedp import construir as build
from oedp import julgados
from tests.apoio import LOJA, REPO, Plantada
from tests.test_esq1f import commit, git_temporario

A, B = "a" * 64, "b" * 64


def passo(familia="anthropic"):
    return ("passo", {"nome": "construcao", "lugar": "construtor", "familia": familia, "modelo": "m",
                      "inicio": "2026-11-15T02:00:00Z", "fim": "2026-11-15T03:00:00Z"})


def leitura(impressao, familia="openai", veredicto="passa", postas=2, apanhadas=2):
    return ("leitura", {"lugar": "seguranca", "familia": familia, "modelo": "m", "inicio": "2026-11-15T04:00:00Z",
                        "fim": "2026-11-15T04:30:00Z", "impressao": impressao, "plantas_postas": postas,
                        "plantas_apanhadas": apanhadas, "achados": 1, "adotados": 1, "veredicto": veredicto})


class Impressao(unittest.TestCase):
    def test_o_que_conta_e_o_que_nao_conta(self):
        for fora in ("pecas/2026/x.md", "mesas/a.md", "paginas/metodo.md", "direitos/x.toml", "docs/ESPEC-PECA.md",
                     "equipa/juiz.md", "design/x.md", "textos.toml", "textos.registo.toml", "codigo.registo.toml",
                     "sitio.toml", "README.md", "CLAUDE.md"):
            self.assertFalse(codigo.e_codigo(fora), fora)
        for dentro in ("oedp/peca.py", "tests/apoio.py", ".github/workflows/portao.yml", "vercel.json", "public/estilo.css",
                       "requirements.txt", "ensaios/pecas/2026/2026-11-16-peca-de-ensaio.md", "scripts/leituras/ler.sh",
                       "docs.txt", "pecas.md"):
            self.assertTrue(codigo.e_codigo(dentro), dentro)

    def test_a_impressao_refeita_a_mao(self):
        nomes = subprocess.run(["git", "-C", str(REPO), "ls-files", "-z"], capture_output=True, check=True).stdout.decode().split("\0")
        linhas = sorted(n for n in nomes if n and codigo.e_codigo(n) and (REPO / n).is_file())
        texto = "".join(f"{hashlib.sha256((REPO / n).read_bytes()).hexdigest()}  {n}\n" for n in linhas)
        self.assertEqual(codigo.impressao(REPO), hashlib.sha256(texto.encode()).hexdigest())
        self.assertIn("oedp/peca.py", linhas)
        self.assertNotIn("README.md", linhas)

    def test_planta_um_byte_muda_a_impressao(self):
        lista = codigo.lista(REPO)
        antes = codigo.impressao_da_lista(lista)
        nome, sha = next((n, s) for n, s in lista if n == "oedp/conferir.py")
        dados = bytearray((REPO / nome).read_bytes())
        dados[-1] ^= 1
        mudada = [(n, hashlib.sha256(bytes(dados)).hexdigest() if n == nome else s) for n, s in lista]
        self.assertNotEqual(codigo.impressao_da_lista(mudada), antes)

    def test_a_impressao_de_uma_pasta_e_a_do_git(self):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-arvore-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        arquivo = subprocess.run(["git", "-C", str(REPO), "archive", "HEAD"], capture_output=True, check=True).stdout
        subprocess.run(["tar", "-x", "-C", str(pasta)], input=arquivo, check=True)
        subprocess.run(["git", "init", "-q", str(pasta)], check=True)
        subprocess.run(["git", "-C", str(pasta), "add", "-A"], check=True)
        self.assertEqual(codigo.impressao_de_pasta(pasta), codigo.impressao(pasta))
        antes = codigo.impressao_de_pasta(pasta)
        (pasta / "docs" / "nota.md").write_text("not code\n", encoding="utf-8")
        self.assertEqual(codigo.impressao_de_pasta(pasta), antes)
        (pasta / "oedp" / "novo.py").write_text("x = 1\n", encoding="utf-8")
        self.assertNotEqual(codigo.impressao_de_pasta(pasta), antes)

    def test_o_comando(self):
        r = subprocess.run([sys.executable, "-m", "oedp", "impressao", "codigo"], cwd=REPO, capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(r.stdout, f"code       {codigo.impressao(REPO)}\n")


class Portao(unittest.TestCase):
    def test_uma_leitura_que_passa_abre(self):
        self.assertEqual(codigo.erros_do_portao([passo(), leitura(A)], A), [])

    def test_planta_um_byte_depois_da_leitura(self):
        erros = codigo.erros_do_portao([passo(), leitura(A)], B)
        self.assertEqual(erros, [f"code: no seguranca reading on the current code fingerprint ({B[:12]}…); "
                                 f"the last passing seguranca reading is on {A[:12]}…"])

    def test_planta_leitura_da_familia_que_construiu(self):
        erros = codigo.erros_do_portao([passo("anthropic"), leitura(A, familia="anthropic")], A)
        self.assertIn("code: the seguranca reading is by anthropic, a family that built this code "
                      "(construcao steps since the previous passing reading: anthropic)", erros)

    def test_planta_leitura_sem_plantas(self):
        erros = codigo.erros_do_portao([passo(), leitura(A, postas=0, apanhadas=0)], A)
        self.assertEqual(erros, ["code: the seguranca reading on the current code fingerprint had no planted error"])

    def test_planta_plantas_por_apanhar_e_veredicto(self):
        erros = codigo.erros_do_portao([passo(), leitura(A, veredicto="nao_passa", postas=3, apanhadas=2)], A)
        self.assertIn("code: the last seguranca reading on the current code fingerprint says nao_passa", erros)
        self.assertIn("code: the seguranca reading on the current code fingerprint caught 2 of 3 planted errors", erros)

    def test_planta_sem_construcao_depois_da_leitura_anterior(self):
        erros = codigo.erros_do_portao([passo(), leitura(A), leitura(B)], B)
        self.assertEqual(erros, ["code: no construcao step is recorded after the previous passing seguranca reading, "
                                 "so who built the code that was read is unknown"])

    def test_a_janela_comeca_na_leitura_anterior(self):
        # openai built the first block and anthropic read it; anthropic built the second and openai read it
        tabelas = [passo("openai"), leitura(A, familia="anthropic"), passo("anthropic"), leitura(B, familia="openai")]
        self.assertEqual(codigo.erros_do_portao(tabelas, B), [])
        # but openai may not read a block that openai built since the last passing reading
        tabelas = [passo("openai"), leitura(A, familia="anthropic"), passo("openai"), leitura(B, familia="openai")]
        self.assertTrue(any("is by openai, a family that built this code" in x for x in codigo.erros_do_portao(tabelas, B)))

    def test_a_ultima_leitura_na_impressao_conta(self):
        tabelas = [passo(), leitura(A), leitura(A, veredicto="nao_passa")]
        self.assertIn("code: the last seguranca reading on the current code fingerprint says nao_passa",
                      codigo.erros_do_portao(tabelas, A))


class Registo(unittest.TestCase):
    def ficheiro(self, texto=""):
        pasta = Path(tempfile.mkdtemp(prefix="oedp-codigo-"))
        self.addCleanup(shutil.rmtree, pasta, True)
        f = pasta / codigo.REGISTO
        f.write_text("# a test record of the code\n" + texto, encoding="utf-8")
        return f

    def registar(self, f, *args):
        return subprocess.run([sys.executable, "-m", "oedp", "registar", str(f), *args], cwd=REPO, capture_output=True, text=True)

    PASSO = ["passo", "--nome", "construcao", "--lugar", "construtor", "--familia", "anthropic", "--modelo", "m",
             "--inicio", "2026-11-15T02:00:00Z", "--fim", "2026-11-15T03:00:00Z"]

    def leitura(self, familia="openai", veredicto="passa"):
        return ["leitura", "--lugar", "seguranca", "--familia", familia, "--modelo", "m", "--inicio", "2026-11-15T04:00:00Z",
                "--fim", "2026-11-15T04:30:00Z", "--impressao", A, "--plantas-postas", "2", "--plantas-apanhadas", "2",
                "--achados", "0", "--adotados", "0", "--veredicto", veredicto]

    def test_registar_acrescenta_na_ordem(self):
        f = self.ficheiro()
        antes = f.read_bytes()
        for args in (self.PASSO, self.leitura()):
            r = self.registar(f, *args)
            self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue(f.read_bytes().startswith(antes))
        tabelas = codigo.em_ordem(f.read_text(encoding="utf-8"))
        self.assertEqual([n for n, _ in tabelas], ["passo", "leitura"])
        self.assertEqual(codigo.erros_do_registo(tabelas), [])
        self.assertEqual(codigo.erros_do_portao(tabelas, A), [])

    def test_planta_passo_que_nao_e_construcao(self):
        f = self.ficheiro()
        r = self.registar(f, *[("escrita" if x == "construcao" else x) for x in self.PASSO])
        self.assertEqual(r.returncode, 1)
        self.assertIn("nome 'escrita' is not one of construcao", r.stderr)

    def test_planta_leitura_que_nao_e_seguranca(self):
        f = self.ficheiro()
        r = self.registar(f, *[("juiz" if x == "seguranca" else x) for x in self.leitura()])
        self.assertEqual(r.returncode, 1)
        self.assertIn("lugar 'juiz' is not one of seguranca", r.stderr)

    def test_planta_leitura_que_passa_da_familia_que_construiu(self):
        f = self.ficheiro()
        self.assertEqual(self.registar(f, *self.PASSO).returncode, 0)
        antes = f.read_bytes()
        r = self.registar(f, *self.leitura(familia="anthropic"))
        self.assertEqual(r.returncode, 1)
        self.assertIn("a reading by anthropic, a family that built since the last passing reading, can only raise", r.stderr)
        self.assertEqual(f.read_bytes(), antes)
        self.assertEqual(self.registar(f, *self.leitura(familia="anthropic", veredicto="levanta")).returncode, 0)

    def test_planta_cabecalho_que_esconde_a_ordem(self):
        with self.assertRaises(codigo.ErroDoCodigo) as e:
            codigo.em_ordem('[[passo]]\nnome = "construcao"\n\n[[ leitura ]]\nlugar = "seguranca"\n')
        self.assertIn("is not written as [[passo]] or [[leitura]]", str(e.exception))
        with self.assertRaises(codigo.ErroDoCodigo) as e:
            codigo.em_ordem('[[ passo ]]\nnome = "construcao"\n')
        self.assertIn("a value outside any [[passo]] or [[leitura]] table", str(e.exception))
        with self.assertRaises(codigo.ErroDoCodigo) as e:
            codigo.em_ordem('[[passo]]\nnome = "construcao"\n\n[[estado]]\nestado = "publicada"\n')
        self.assertIn("is not a table of this record", str(e.exception))

    def test_o_registo_real_existe_vazio(self):
        self.assertEqual(codigo.em_ordem((REPO / codigo.REGISTO).read_text(encoding="utf-8")), [])

    def test_planta_registo_que_nao_continua_o_de_main(self):
        repo = git_temporario(self)
        alvo = repo / codigo.REGISTO
        alvo.write_text("# record\n" + registo.tabela("passo", passo()[1]) + registo.tabela("leitura", leitura(A)[1]), encoding="utf-8")
        commit(repo, codigo.REGISTO)
        self.assertEqual(julgados.historia(repo, alvo), [])
        texto = alvo.read_text(encoding="utf-8")
        alvo.write_text(texto.replace('veredicto = "passa"', 'veredicto = "levanta"'), encoding="utf-8")
        self.assertEqual(julgados.historia(repo, alvo),
                         ["codigo.registo.toml: the record on main is not the beginning of the record now: a table was removed or changed"])


class NaConstrucao(unittest.TestCase):
    def construir(self, texto_do_registo):
        p = Plantada()
        self.addCleanup(p.apagar)
        (p.pasta / codigo.REGISTO).write_text(texto_do_registo, encoding="utf-8")
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        return build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA)

    def test_com_a_leitura_constroi(self):
        self.assertTrue(self.construir(ensaio.registo_de_ensaio()).ok)

    def test_planta_codigo_mudado_depois_da_leitura(self):
        atual = codigo.impressao(REPO)
        velho = ensaio.registo_de_ensaio().replace(atual, "0" * 64)
        c = self.construir(velho)
        self.assertFalse(c.ok)
        self.assertIn(f"check  5 (verified and judged by the other family) · code: no seguranca reading on the current code "
                      f"fingerprint ({atual[:12]}…); the last passing seguranca reading is on 000000000000…", c.mensagens)

    def test_planta_sem_registo_do_codigo_falha_a_publicada_mas_nao_a_previa(self):
        c = self.construir("# empty\n")
        self.assertFalse(c.ok)
        self.assertTrue(any("no seguranca reading on the current code fingerprint" in m for m in c.mensagens), c.mensagens)
        p = Plantada()
        self.addCleanup(p.apagar)
        (p.pasta / codigo.REGISTO).write_text("# empty\n", encoding="utf-8")
        saida = Path(tempfile.mkdtemp(prefix="oedp-saida-"))
        self.addCleanup(shutil.rmtree, saida, True)
        self.assertTrue(build.construir(REPO, raiz=p.pasta, saida=saida, loja=LOJA, com_rascunhos=True).ok)

    def test_sem_peca_publicada_nao_vincula_e_diz_o_que_falharia(self):
        from oedp.__main__ import conferir_tudo

        linhas = []
        ok, _ = conferir_tudo([], imprimir=linhas.append)
        codigo_ = [l for l in linhas if "· the code:" in l]
        self.assertEqual(len(codigo_), 1, linhas)
        self.assertIn("not binding", codigo_[0])
        self.assertIn("would fail once a piece is published: code: no seguranca reading on the current code fingerprint", codigo_[0])
