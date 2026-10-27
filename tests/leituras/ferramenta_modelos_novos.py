"""modelos-novos.sh com uma CLI agy simulada: um modelo novo dá código 3 e é nomeado; a lista igual dá 0; a lista vazia dá 9."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from apoio_ferramentas import GUIOES, comando


class ModelosNovos(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='ensaio-modelos-')
        self.addCleanup(self.tmp.cleanup)
        self.p = Path(self.tmp.name)
        self.bin = self.p / 'bin'
        self.bin.mkdir()
        self.ficheiro = self.p / 'modelos.json'
        self.ficheiro.write_text(json.dumps({
            'lugares': {'leitor': {'modelo': 'x-1', 'esforco': 'high'}},
            'por_medir': ['y'],
            'listas_conhecidas': {'agy': ['a-1', 'a-2'], 'agy_lida_a': '2026-10-27', 'codex': 'não lista', 'claude': 'não lista'},
        }))

    def correr(self, lista):
        comando(self.bin, 'agy', 'import sys\nprint("Fetching available models...")\n' + ''.join(f'print({json.dumps(i + chr(9) + i.upper())})\n' for i in lista))
        env = dict(os.environ, PATH=str(self.bin) + ':' + os.environ['PATH'], MODELOS_EM_USO=str(self.ficheiro))
        return subprocess.run(['sh', str(GUIOES / 'modelos-novos.sh')], env=env, capture_output=True, text=True, timeout=30)

    def test_lista_igual(self):
        r = self.correr(['a-1', 'a-2'])
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn('leitor: x-1 · high', r.stdout)
        self.assertNotIn('MODELOS NOVOS', r.stdout)

    def test_modelo_novo_nomeado(self):
        r = self.correr(['a-1', 'a-2', 'a-3-novo'])
        self.assertEqual(r.returncode, 3, r.stdout + r.stderr)
        self.assertIn('MODELOS NOVOS por ensaiar (M51): a-3-novo', r.stdout)

    def test_lista_vazia_nao_e_resultado(self):
        r = self.correr([])
        self.assertEqual(r.returncode, 9, r.stdout + r.stderr)
        self.assertIn('não listou nenhum modelo', r.stdout)

    def test_ficheiro_em_falta(self):
        env = dict(os.environ, MODELOS_EM_USO=str(self.p / 'nao-existe.json'))
        r = subprocess.run(['sh', str(GUIOES / 'modelos-novos.sh')], env=env, capture_output=True, text=True, timeout=30)
        self.assertEqual(r.returncode, 9)


if __name__ == '__main__':
    unittest.main()
