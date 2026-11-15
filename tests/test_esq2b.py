"""ESQ2 item B: publishing. Git runs on temporary repositories (the remote is a folder);
`vercel` and the fetches are stand-ins. Nothing leaves the machine."""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

from oedp import ensaio, publicar
from tests.apoio import REPO

PUBLICO = "https://xn--oestadodopas-2fb.pt"
IMPLANTACAO = "https://implantacao-de-ensaio.invalid"
ANTERIOR = "https://implantacao-anterior.invalid"


def git(pasta, *args):
    endereco = "ensaio" + "@" + "ensaio.invalid"
    return subprocess.run(["git", "-C", str(pasta), "-c", "user.name=Ensaio", "-c", f"user.email={endereco}", *args],
                          check=True, capture_output=True, text=True)


class Base(unittest.TestCase):
    def setUp(self):
        raiz = Path(tempfile.mkdtemp(prefix="oedp-publicar-"))
        self.addCleanup(shutil.rmtree, raiz, True)
        self.origem, self.repo, self.oficina = raiz / "origem.git", raiz / "repo", raiz / "oficina"
        subprocess.run(["git", "init", "-q", "--bare", "-b", "main", str(self.origem)], check=True)
        subprocess.run(["git", "init", "-q", "-b", "main", str(self.repo)], check=True)
        shutil.copy2(REPO / "sitio.toml", self.repo / "sitio.toml")
        git(self.repo, "add", "sitio.toml")
        git(self.repo, "commit", "-q", "-m", "ensaio")
        git(self.repo, "remote", "add", "origin", str(self.origem))
        git(self.repo, "push", "-q", "origin", "main")
        (self.repo / ".vercel").mkdir()
        (self.repo / ".vercel" / "project.json").write_text("{}", encoding="utf-8")
        self.oficina.mkdir()
        self.ambiente = {"OEDP_FONTES": str(raiz / "loja"), "OEDP_OFICINA": str(self.oficina)}
        self.saida = raiz / "construido"
        self.c = ensaio.construir_ensaio(self.saida, conferir_antes=False)
        assert self.c.ok, self.c.mensagens
        self.chamadas, self.linhas, self.sono = [], [], [0.0]

    def primeira_linha(self, inicio_sha="a" * 64):
        with open(self.oficina / "publicacoes.jsonl", "a", encoding="utf-8") as f:
            f.write(json.dumps({"em": "2026-11-14T21:00:00Z", "commit": "0" * 40, "implantacao": ANTERIOR,
                                "manifesto_sha256": "b" * 64, "inicio_sha256": inicio_sha, "resultado": "no ar"}) + "\n")

    def correr(self, args, cwd):
        self.chamadas.append(args)
        if args[:2] == ["vercel", "deploy"]:
            return 0, f"Vercel CLI\n{IMPLANTACAO}\n", "some progress on standard error\n"
        return 0, "", ""

    def preparar(self, repo, loja, imprimir):
        return publicar.Preparado(True, [], self.c.estatica)

    def servir(self, estatica: Path):
        def buscar(url):
            caminho = url[len(PUBLICO):].lstrip("/")
            if caminho == "" or caminho.endswith("/"):
                caminho += "index.html"
            return (estatica / caminho).read_bytes()
        return buscar

    def publicar(self, ensaio=False, buscar=None, ambiente=None):
        def dormir(s):
            self.sono[0] += s
        return publicar.publicar(self.repo, self.oficina, None, self.ambiente if ambiente is None else ambiente, ensaio=ensaio,
                                 correr=self.correr, buscar=buscar or self.servir(self.c.estatica), dormir=dormir,
                                 relogio=lambda: self.sono[0], preparar_=self.preparar, imprimir=self.linhas.append)

    def registo(self):
        return [json.loads(l) for l in (self.oficina / "publicacoes.jsonl").read_text(encoding="utf-8").splitlines()]


class Recusas(Base):
    def test_planta_ficheiro_seguido_mudado(self):
        self.primeira_linha()
        (self.repo / "sitio.toml").write_text("# changed\n", encoding="utf-8")
        self.assertEqual(self.publicar(), 2)
        self.assertTrue(any("the working tree has changes to tracked files" in l for l in self.linhas), self.linhas)
        self.assertEqual(self.chamadas, [])

    def test_planta_head_que_nao_e_main(self):
        self.primeira_linha()
        (self.repo / "outro.txt").write_text("x\n", encoding="utf-8")
        git(self.repo, "add", "outro.txt")
        git(self.repo, "commit", "-q", "-m", "a commit that is not on main")
        self.assertEqual(self.publicar(), 2)
        self.assertTrue(any("is not origin/main" in l for l in self.linhas), self.linhas)
        self.assertEqual(self.chamadas, [])

    def test_planta_sem_loja_nem_oficina(self):
        self.primeira_linha()
        self.assertEqual(self.publicar(ambiente={}), 2)
        self.assertIn("refused: OEDP_FONTES is not set", self.linhas)
        self.assertIn("refused: OEDP_OFICINA is not set", self.linhas)

    def test_planta_sem_project_json(self):
        self.primeira_linha()
        (self.repo / ".vercel" / "project.json").unlink()
        self.assertEqual(self.publicar(), 2)
        self.assertTrue(any(".vercel/project.json does not exist" in l for l in self.linhas))

    def test_planta_sem_linha_no_ar_nao_implanta(self):
        self.assertEqual(self.publicar(), 2)
        self.assertTrue(any("has no line whose result is 'no ar'" in l for l in self.linhas))
        self.assertEqual(self.chamadas, [])

    def test_o_portao_do_codigo_fecha_a_publicacao_real(self):
        # the repository's own record of the code has no reading yet, so step 2 refuses
        p = publicar.preparar(REPO, None, imprimir=lambda *a: None)
        self.assertFalse(p.ok)
        self.assertTrue(any("the code's gate is closed: code: no seguranca reading on the current code fingerprint" in m
                            for m in p.mensagens), p.mensagens)


class Implantar(Base):
    def test_ensaio_nao_corre_nenhum_comando(self):
        self.primeira_linha()
        self.assertEqual(self.publicar(ensaio=True), 0)
        self.assertEqual(self.chamadas, [])
        self.assertIn("  vercel deploy --prebuilt --prod --skip-domain --yes", self.linhas)
        self.assertIn("  vercel promote <the address the first command prints> --yes", self.linhas)
        self.assertEqual(len(self.registo()), 1)

    def test_no_ar(self):
        self.primeira_linha()
        self.assertEqual(self.publicar(), 0)
        self.assertEqual(self.chamadas, [publicar.DEPLOY, ["vercel", "promote", IMPLANTACAO, "--yes"]])
        ultima = self.registo()[-1]
        self.assertEqual((ultima["resultado"], ultima["implantacao"]), ("no ar", IMPLANTACAO))
        self.assertEqual(ultima["inicio_sha256"], hashlib.sha256((self.c.estatica / "index.html").read_bytes()).hexdigest())
        self.assertEqual(ultima["manifesto_sha256"], hashlib.sha256((self.c.estatica / "manifesto.json").read_bytes()).hexdigest())
        erros = list((self.oficina / "publicacoes").glob("*-deploy-stderr.txt"))
        self.assertEqual([f.read_text() for f in erros], ["some progress on standard error\n"])

    def test_planta_site_que_nao_fica_igual_volta_atras(self):
        antigo = Path(tempfile.mkdtemp(prefix="oedp-antigo-"))
        self.addCleanup(shutil.rmtree, antigo, True)
        c = ensaio.construir_ensaio(antigo, com_pecas=False, conferir_antes=False)
        inicio_antigo = hashlib.sha256((c.estatica / "index.html").read_bytes()).hexdigest()
        self.primeira_linha(inicio_antigo)
        self.assertEqual(self.publicar(buscar=self.servir(c.estatica)), 1)
        self.assertEqual(self.chamadas, [publicar.DEPLOY, ["vercel", "promote", IMPLANTACAO, "--yes"],
                                         ["vercel", "promote", ANTERIOR, "--yes"]])
        self.assertGreaterEqual(self.sono[0], publicar.ESPERA_S)
        ultima = self.registo()[-1]
        self.assertTrue(ultima["resultado"].startswith("falhou: no-ar did not pass in 120 s"), ultima)
        self.assertIn("front page as before: True", ultima["resultado"])
        self.assertTrue(any("the front page is again the one the last line recorded" in l for l in self.linhas), self.linhas)

    def test_planta_implantacao_que_falha(self):
        self.primeira_linha()

        def falha(args, cwd):
            self.chamadas.append(args)
            return 1, "", "Error: not authorised\n"

        self.correr = falha
        self.assertEqual(self.publicar(), 1)
        self.assertEqual(self.chamadas, [publicar.DEPLOY])
        self.assertEqual(self.registo()[-1]["resultado"], "falhou: vercel deploy exited 1")

    def test_o_endereco_publico_esta_no_sitio(self):
        self.assertEqual(publicar.endereco(REPO), PUBLICO)
