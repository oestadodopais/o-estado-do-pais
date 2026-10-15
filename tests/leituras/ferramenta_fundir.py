"""Fusão real em Git temporário, incluindo conflito e protocolo por ficheiro."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time
import unittest
from apoio_ferramentas import GUIOES, commit, git, repo, worktree

spec = importlib.util.spec_from_file_location('escrivao', GUIOES / 'escrivao.py')
escrivao = importlib.util.module_from_spec(spec)
spec.loader.exec_module(escrivao)


class Fundir(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='ensaio-fundir-')
        self.addCleanup(self.tmp.cleanup)
        self.p = Path(self.tmp.name)
        self.main = repo(self.p / 'principal', 'main')
        self.w = worktree(self.main, self.p / 'ramo')

    def test_conflito_aborta_e_repoe_bytes(self):
        (self.main / 'linha').write_text('alteração na principal\n')
        commit(self.main, 'principal')
        (self.w / 'linha').write_text('alteração no ramo\n')
        commit(self.w, 'ramo')
        (self.w / 'nao-seguido').write_bytes(b'\x00\x01guardar\n')
        antes = {f.name: f.read_bytes() for f in self.w.iterdir() if f.name != '.git'}
        cabeca = git(self.w, 'rev-parse', 'HEAD')
        r = escrivao.fundir(str(self.w), {'ramo': 'main'})
        self.assertEqual(r['codigo'], 1)
        self.assertEqual(r['conflitos'], ['linha'])
        self.assertEqual(r['aborto_codigo'], 0)
        self.assertEqual(cabeca, git(self.w, 'rev-parse', 'HEAD'))
        self.assertEqual(antes, {f.name: f.read_bytes() for f in self.w.iterdir() if f.name != '.git'})
        self.assertEqual(git(self.w, 'status', '--porcelain'), '?? nao-seguido')
        self.assertFalse(Path(git(self.w, 'rev-parse', '--git-path', 'MERGE_HEAD')).exists())

    def test_suja_e_ramo_arbitrario_recusados(self):
        (self.w / 'linha').write_text('por registar\n')
        self.assertEqual(escrivao.fundir(str(self.w), {'ramo': 'main'})['codigo'], 9)
        self.assertEqual(escrivao.fundir(str(self.w), {'ramo': 'outro'})['codigo'], 2)
        self.assertEqual((self.w / 'linha').read_text(), 'por registar\n')

    def test_protocolo_cliente_e_batimento(self):
        (self.main / 'linha').write_text('avanço\n')
        commit(self.main, 'avanço')
        processo = subprocess.Popen(['python3', str(GUIOES / 'escrivao.py'), str(self.w)], stdout=subprocess.DEVNULL)
        pasta = escrivao.pasta_dos_pedidos(str(self.w))
        try:
            for _ in range(100):
                if (pasta / 'batimento').exists():
                    break
                time.sleep(0.05)
            r = subprocess.run(['sh', str(GUIOES / 'fundir.sh'), 'main'], cwd=self.w, capture_output=True, text=True, timeout=20)
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            self.assertEqual(git(self.w, 'rev-parse', 'HEAD'), git(self.main, 'rev-parse', 'HEAD'))
            pedidos = list(pasta.glob('pedido-*.json'))
            self.assertEqual(len(pedidos), 1)
            self.assertEqual(json.loads(pedidos[0].read_text())['tipo'], 'fundir')
            self.assertEqual(json.loads(pedidos[0].with_suffix('.resultado').read_text())['codigo'], 0)
        finally:
            processo.terminate()
            processo.wait(timeout=5)
            import shutil
            shutil.rmtree(pasta)

    def test_master_tambem_funde(self):
        git(self.main, 'branch', 'master')
        self.assertEqual(escrivao.fundir(str(self.w), {'ramo': 'master'})['codigo'], 0)

    def test_fusao_sem_avanco_rapido(self):
        (self.main / '.gitignore').write_text('node_modules/\n__pycache__/\ncache/\n')
        commit(self.main, 'nova cache')
        (self.w / 'linha').write_text('mudança independente\n')
        commit(self.w, 'novo conteúdo')
        antes = git(self.w, 'rev-parse', 'HEAD')
        r = escrivao.fundir(str(self.w), {'ramo': 'main'})
        self.assertEqual(r['codigo'], 0, r)
        self.assertEqual(git(self.w, 'rev-parse', 'HEAD^1'), antes)
        self.assertEqual(git(self.w, 'rev-parse', 'HEAD^2'), git(self.main, 'rev-parse', 'HEAD'))
        self.assertEqual((self.w / 'linha').read_text(), 'mudança independente\n')
        self.assertIn('cache/', (self.w / '.gitignore').read_text())


if __name__ == '__main__':
    unittest.main()
