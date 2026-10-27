"""Plantas do pré-voo e da recusa do lançador antes de chamar o Codex."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
import sys
from apoio_ferramentas import GUIOES, comando, commit, git, repo, worktree


class PreVoo(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='ensaio-pre-voo-')
        self.addCleanup(self.tmp.cleanup)
        self.p = Path(self.tmp.name)
        self.s = repo(self.p / 'sitio', 'main')
        self.m = repo(self.p / 'motor', 'master')
        self.sw = worktree(self.s, self.p / 'sitio-ramo')
        self.mw = worktree(self.m, self.p / 'motor-ramo')
        (self.sw / 'node_modules').mkdir()
        self.env = {k: v for k, v in os.environ.items() if k not in ('OEDP_RELATORIO', 'OEDP_LANCADOR_BASE', 'RESEARCHHUB_LOCK_DIR')}
        self.env.update(OEDP_TRANCA=str(self.p / 'tranca'), RESEARCHHUB_DIR=str(self.mw), CODEX_RACIOCINIO='high')

    def correr(self):
        return subprocess.run(['sh', str(GUIOES / 'pre-voo.sh'), str(self.sw), str(self.mw)], env=self.env, capture_output=True, text=True)

    def test_verde_e_nao_seguidos_permitidos(self):
        (self.sw / 'nota').write_text('não seguida')
        r = self.correr()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn('vai ser definido', r.stdout)
        self.assertTrue(all(l.startswith('0 ') for l in r.stdout.splitlines()))
        self.assertNotIn(str(self.p), r.stdout)

    def test_node_modules_ausente_e_ligado(self):
        (self.sw / 'node_modules').rmdir()
        r = self.correr()
        self.assertEqual(r.returncode, 9)
        self.assertIn('9 node_modules', r.stdout)
        (self.sw / 'node_modules').symlink_to(self.s, target_is_directory=True)
        self.assertEqual(self.correr().returncode, 9)

    def test_master_por_fundir(self):
        (self.m / 'linha').write_text('novo master\n')
        commit(self.m, 'master avançou')
        r = self.correr()
        self.assertEqual(r.returncode, 9)
        self.assertIn('9 master antepassado', r.stdout)

    def test_cache_em_falta_e_lista(self):
        for base in (self.m, self.mw):
            (base / 'conteudo com espaço').mkdir()
        (self.m / 'conteudo com espaço/snippets.json').write_text('{}')
        r = self.correr()
        self.assertEqual(r.returncode, 9)
        self.assertIn('9 cache conteudo com espaço/snippets.json', r.stdout)
        (self.mw / 'conteudo com espaço/snippets.json').write_text('{}')
        self.assertEqual(self.correr().returncode, 0)

    def test_suja_tranca_e_ficheiros_do_lancador(self):
        (self.sw / 'linha').write_text('modificada')
        self.assertEqual(self.correr().returncode, 9)
        (self.sw / 'linha').write_text('base\n')
        (self.p / 'tranca').write_text('pid=123 ensaio')
        self.assertIn('ocupada por pid=123 ensaio', self.correr().stdout)
        (self.p / 'tranca').unlink()
        pasta = self.sw / 'design/especime-v3/medicoes/bloco'
        pasta.mkdir(parents=True)
        (pasta / 'RELATORIO.escrivao.log').touch()
        self.assertEqual(self.correr().returncode, 9)
        (pasta / 'RELATORIO.escrivao.log').unlink()
        self.env.update(OEDP_RELATORIO=str(pasta / 'RELATORIO.md'), OEDP_LANCADOR_BASE=str(pasta / 'RELATORIO'))
        self.assertEqual(self.correr().returncode, 9)
        self.env['OEDP_LANCADOR_BASE'] = str(self.p / 'externo/RELATORIO')
        self.assertEqual(self.correr().returncode, 0)

    def test_lancador_recusa_sem_esforco_escolhido(self):
        prompt = self.p / 'prompt.md'
        prompt.write_text('ensaio')
        env = {k: v for k, v in self.env.items() if k != 'CODEX_RACIOCINIO'}
        r = subprocess.run(['sh', str(GUIOES / 'construir-codex.sh'), str(self.sw), str(prompt), str(self.p / 'relatorio.md')],
                           env=env, capture_output=True, text=True, timeout=10)
        self.assertEqual(r.returncode, 9, r.stdout + r.stderr)
        self.assertIn('9 CODEX_RACIOCINIO por escolher', r.stdout + r.stderr)
        self.assertNotIn('INICIO ', r.stdout)
        r = subprocess.run(['sh', str(GUIOES / 'ler.sh'), str(self.p), str(prompt), str(self.p / 'saida.md')],
                           env=env, capture_output=True, text=True, timeout=10)
        self.assertEqual(r.returncode, 9, r.stdout + r.stderr)
        self.assertIn('9 CODEX_RACIOCINIO por escolher', r.stdout + r.stderr)

    def test_lancador_recusa_antes_do_codex(self):
        (self.m / 'linha').write_text('master por fundir\n')
        commit(self.m, 'master avançou')
        prompt = self.p / 'prompt.md'
        prompt.write_text('ensaio')
        r = subprocess.run(['sh', str(GUIOES / 'construir-codex.sh'), str(self.sw), str(prompt), str(self.p / 'relatorio.md')],
                           env=self.env, capture_output=True, text=True, timeout=10)
        self.assertEqual(r.returncode, 9, r.stdout + r.stderr)
        self.assertIn('9 master antepassado', r.stdout)
        self.assertNotIn('INICIO ', r.stdout)

    def test_lancador_verde_guarda_registos_fora_e_define_trancas(self):
        binario = self.p / 'bin'
        binario.mkdir()
        # Os serviços do lançador são cópias inertes; o pré-voo é o verdadeiro.
        comando(binario, 'python3', '''import json,os,sys,time
from pathlib import Path
a=sys.argv[1:]
if a and a[0].endswith('/pontos.py'):
    if '--json' in a: Path(a[a.index('--json')+1]).write_text('{}')
    sys.exit(0)
if a and a[0].endswith('/escrivao.py'): time.sleep(30); sys.exit(0)
os.execv(os.environ['PYTHON_REAL'], [os.environ['PYTHON_REAL'],*a])
''')
        # Evita a recursão do shebang env python3 da própria cópia.
        f = binario / 'python3'
        f.write_text(f.read_text().replace('#!/usr/bin/env python3', '#!' + sys.executable, 1))
        comando(binario, 'codex', '''import os,sys
from pathlib import Path
assert Path(os.environ['RESEARCHHUB_LOCK_DIR']).is_dir()
assert os.environ['RESEARCHHUB_DIR']
assert sys.stdin.read()
Path(sys.argv[sys.argv.index('-o')+1]).write_text('saída sintética')
''')
        prompt = self.p / 'prompt.md'
        prompt.write_text('ensaio')
        pasta = self.p / 'relatorio'
        pasta.mkdir()
        env = dict(self.env, PATH=str(binario) + ':' + os.environ['PATH'], PYTHON_REAL=sys.executable, TMPDIR=str(self.p))
        r = subprocess.run(['sh', str(GUIOES / 'construir-codex.sh'), str(self.sw), str(prompt), str(pasta / 'RELATORIO.md')],
                           env=env, capture_output=True, text=True, timeout=15)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertEqual((pasta / 'RELATORIO.md').read_text(), 'saída sintética')
        self.assertEqual(len(list(pasta.iterdir())), 1)
        self.assertEqual(len(list(self.p.glob('oedp-construtor.*/RELATORIO.escrivao.log'))), 1)
        self.assertEqual(len(list(self.p.glob('oedp-construtor.*/RELATORIO.pontos.json'))), 1)


if __name__ == '__main__':
    unittest.main()
