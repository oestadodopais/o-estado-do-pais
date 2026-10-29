"""Fusão real em Git temporário, incluindo conflito e protocolo por ficheiro."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time
import unittest
from unittest.mock import patch
from apoio_ferramentas import GUIOES, commit, git, repo, worktree

spec = importlib.util.spec_from_file_location('escrivao', GUIOES / 'escrivao.py')
escrivao = importlib.util.module_from_spec(spec)
spec.loader.exec_module(escrivao)


MENSAGEM = ('Fusão de main, 19.10.2026\n\nCorpo conservado na fusão.\n\n'
            'Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>\n'
            'Claude-Session: e687d1ce-db3c-4833-a78e-958a5a6ba786\n')


class Fundir(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='ensaio-fundir-')
        self.addCleanup(self.tmp.cleanup)
        self.p = Path(self.tmp.name)
        self.main = repo(self.p / 'principal', 'main')
        self.w = worktree(self.main, self.p / 'ramo')

    def test_conflito_aborta_e_repoe_bytes(self):
        (self.main / 'linha').write_text('alteração na principal\n')
        (self.main / '.gitignore').write_text('node_modules/\n__pycache__/\ncache/\n')
        commit(self.main, 'principal')
        (self.w / 'linha').write_text('alteração no ramo\n')
        commit(self.w, 'ramo')
        (self.w / 'nao-seguido').write_bytes(b'\x00\x01guardar\n')
        antes = {f.name: f.read_bytes() for f in self.w.iterdir() if f.name != '.git'}
        cabeca = git(self.w, 'rev-parse', 'HEAD')
        r = escrivao.fundir(str(self.w), {'ramo': 'main', 'mensagem': MENSAGEM})
        self.assertEqual(r['codigo'], 1)
        self.assertEqual(r['conflitos'], ['linha'])
        self.assertEqual(r['aborto_codigo'], 0)
        self.assertEqual(cabeca, git(self.w, 'rev-parse', 'HEAD'))
        self.assertEqual(antes, {f.name: f.read_bytes() for f in self.w.iterdir() if f.name != '.git'})
        self.assertEqual(git(self.w, 'status', '--porcelain'), '?? nao-seguido')
        self.assertFalse(Path(git(self.w, 'rev-parse', '--git-path', 'MERGE_HEAD')).exists())

    def test_marcadores_ja_comitados_recusam_antes_da_fusao(self):
        (self.main / 'linha').write_text('<' * 7 + ' ramo\ntexto\n' + '=' * 7 + '\noutro\n' + '>' * 7 + ' main\n')
        commit(self.main, 'marcadores plantados')
        antes = git(self.w, 'rev-parse', 'HEAD')
        r = escrivao.fundir(str(self.w), {'ramo': 'main', 'mensagem': MENSAGEM})
        self.assertEqual(r['codigo'], 9)
        self.assertIn('marcadores de conflito', r['recusa'])
        self.assertEqual(antes, git(self.w, 'rev-parse', 'HEAD'))
        self.assertEqual(git(self.w, 'status', '--porcelain'), '')

    def test_suja_e_ramo_arbitrario_recusados(self):
        (self.w / 'linha').write_text('por registar\n')
        self.assertEqual(escrivao.fundir(str(self.w), {'ramo': 'main', 'mensagem': MENSAGEM})['codigo'], 9)
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
            mensagem = self.p / 'mensagem.txt'
            mensagem.write_text(MENSAGEM)
            r = subprocess.run(['sh', str(GUIOES / 'fundir.sh'), 'main', '-F', str(mensagem)], cwd=self.w, capture_output=True, text=True, timeout=20)
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
            self.assertEqual(git(self.w, 'rev-parse', 'HEAD'), git(self.main, 'rev-parse', 'HEAD'))
            pedidos = list(pasta.glob('pedido-*.json'))
            self.assertEqual(len(pedidos), 1)
            self.assertEqual(json.loads(pedidos[0].read_text())['tipo'], 'fundir')
            self.assertEqual(json.loads(pedidos[0].read_text())['mensagem'], MENSAGEM.rstrip('\n'))
            resultado = json.loads(pedidos[0].with_suffix('.resultado').read_text())
            self.assertEqual(resultado['codigo'], 0)
            self.assertEqual(resultado['tipo_fusao'], 'avanco-rapido')
            self.assertFalse(resultado['criou_commit'])
            self.assertIn('não criou commit', r.stdout)
        finally:
            processo.terminate()
            processo.wait(timeout=5)
            import shutil
            shutil.rmtree(pasta)

    def test_master_tambem_funde(self):
        git(self.main, 'branch', 'master')
        self.assertEqual(escrivao.fundir(str(self.w), {'ramo': 'master', 'mensagem': MENSAGEM.replace('main', 'master')})['codigo'], 0)

    def test_mensagem_sem_trailer_recusada_antes_de_fundir(self):
        (self.main / 'linha').write_text('avanço por fundir\n')
        commit(self.main, 'avanço')
        antes = git(self.w, 'rev-parse', 'HEAD')
        mensagem = 'Fusão de main, 19.10.2026\n'
        with patch.object(escrivao.subprocess, 'Popen', wraps=subprocess.Popen) as processo:
            r = escrivao.fundir(str(self.w), {'ramo': 'main', 'mensagem': mensagem})
            self.assertEqual(r['codigo'], 2, r)
            self.assertIn('Co-Authored-By', r['recusa'])
            processo.assert_not_called()
        self.assertEqual(git(self.w, 'rev-parse', 'HEAD'), antes)
        self.assertEqual(git(self.w, 'status', '--porcelain'), '')

    def test_regras_da_mensagem(self):
        for mensagem, motivo in (
            (None, 'vazia'),
            (MENSAGEM.split('Claude-Session:')[0], 'Claude-Session'),
            (MENSAGEM.replace('Fusão', 'Integração'), 'primeira linha'),
            (MENSAGEM.replace('19.10.2026', '31.02.2026'), 'data'),
            (MENSAGEM.replace('19.10.2026', 'hoje'), 'primeira linha'),
            (MENSAGEM.replace('Corpo', 'Corpo' + chr(0x2014)), 'travessão'),
            (MENSAGEM.replace('Corpo', 'Corpo' + chr(0x2013)), 'travessão'),
        ):
            with self.subTest(motivo=motivo):
                with patch.object(escrivao.subprocess, 'Popen') as processo:
                    r = escrivao.fundir(str(self.w), {'ramo': 'main', 'mensagem': mensagem})
                    self.assertEqual(r['codigo'], 2)
                    self.assertIn(motivo, r['recusa'])
                    processo.assert_not_called()
        # O motor exige autoria, mas não uma sessão do sítio.
        (self.w / 'core').mkdir()
        (self.w / 'core' / 'gate.py').touch()
        r = escrivao.fundir(str(self.w), {'ramo': 'main', 'mensagem': MENSAGEM.split('Claude-Session:')[0]})
        self.assertEqual(r['codigo'], 0, r)
        self.assertFalse(r['criou_commit'])

    def test_fusao_sem_avanco_rapido(self):
        (self.main / '.gitignore').write_text('node_modules/\n__pycache__/\ncache/\n')
        commit(self.main, 'nova cache')
        (self.w / 'linha').write_text('mudança independente\n')
        commit(self.w, 'novo conteúdo')
        antes = git(self.w, 'rev-parse', 'HEAD')
        r = escrivao.fundir(str(self.w), {'ramo': 'main', 'mensagem': MENSAGEM})
        self.assertEqual(r['codigo'], 0, r)
        self.assertEqual(r['tipo_fusao'], 'commit-de-fusao')
        self.assertTrue(r['criou_commit'])
        self.assertEqual(git(self.w, 'log', '-1', '--format=%B'), MENSAGEM.strip())
        self.assertEqual(git(self.w, 'rev-parse', 'HEAD^1'), antes)
        self.assertEqual(git(self.w, 'rev-parse', 'HEAD^2'), git(self.main, 'rev-parse', 'HEAD'))
        self.assertEqual((self.w / 'linha').read_text(), 'mudança independente\n')
        self.assertIn('cache/', (self.w / '.gitignore').read_text())


if __name__ == '__main__':
    unittest.main()
