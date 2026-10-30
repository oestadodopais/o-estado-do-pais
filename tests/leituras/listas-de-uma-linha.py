"""Confere as expansões antes de caracteres não ASCII no /bin/sh real."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


RAIZ = Path(__file__).resolve().parents[2]
GUIAO = RAIZ / 'scripts/leituras/listas-de-uma-linha.sh'


def correr(guiao):
    ambiente = os.environ.copy()
    ambiente.update(LANG='en_GB.UTF-8', LC_ALL='')
    return subprocess.run(
        ['/bin/sh', str(guiao), str(RAIZ), 'invest-exec-pct'],
        cwd=RAIZ, env=ambiente, capture_output=True, text=True,
    )


class ListasDeUmaLinha(unittest.TestCase):
    def test_guiao_corrigido(self):
        resultado = correr(GUIAO)
        self.assertEqual(resultado.returncode, 0, resultado.stderr)
        self.assertIn('pelo id «invest-exec-pct»:', resultado.stdout.splitlines())

    def test_linha_antiga_morde(self):
        texto = GUIAO.read_text(encoding='utf-8')
        linhas = texto.splitlines(keepends=True)
        self.assertTrue(linhas[9].startswith('echo "pelo id «${ID}»:";'))
        linhas[9] = linhas[9].replace('${ID}', '$ID', 1)
        with tempfile.TemporaryDirectory() as pasta:
            antigo = Path(pasta) / GUIAO.name
            antigo.write_text(''.join(linhas), encoding='utf-8')
            resultado = correr(antigo)
        if resultado.returncode == 0:
            mensagem = 'SALTA listas-de-uma-linha · a linha antiga não falha neste /bin/sh'
            print(mensagem, flush=True)
            self.skipTest('a linha antiga não falha neste /bin/sh')
        self.assertNotEqual(resultado.returncode, 0)
        self.assertIn('unbound variable', resultado.stderr)


if __name__ == '__main__':
    unittest.main(verbosity=2)
