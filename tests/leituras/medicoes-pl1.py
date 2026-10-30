"""Exercita os medidores sem rede externa e sem dados inventados de produção."""
import importlib.util
import io
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout, redirect_stderr
from unittest.mock import patch

GUIOES = Path(__file__).resolve().parents[2] / 'scripts/leituras'


def modulo(nome):
    spec = importlib.util.spec_from_file_location(nome, GUIOES / (nome + '.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


def exigir_ferramentas_pdf(teste):
    faltam = []
    try:
        import fitz
    except ImportError:
        faltam.append('fitz')
    if shutil.which('pdftotext') is None:
        faltam.append('pdftotext')
    if faltam:
        razao = 'falta: ' + ', '.join(faltam)
        print(f'SALTA medicoes-pl1 · {teste._testMethodName} · {razao}', flush=True)
        teste.skipTest(razao)
    return fitz


class Medicoes(unittest.TestCase):
    def setUp(self):
        self.t = tempfile.TemporaryDirectory(); self.addCleanup(self.t.cleanup)
        self.p = Path(self.t.name)

    def test_uso_dos_tres(self):
        for nome in ('medir-blocos', 'medir-pdf', 'medir-no-ar'):
            r = subprocess.run([sys.executable, str(GUIOES / (nome + '.py'))], capture_output=True, text=True)
            self.assertEqual(r.returncode, 2)
            self.assertIn('usage:', r.stderr)

    def test_html_motor_real(self):
        motor = os.environ.get('RESEARCHHUB_DIR')
        if not motor:
            self.skipTest('RESEARCHHUB_DIR ausente; importação real por medir')
        p = self.p / 'pagina.html'
        p.write_text('<html><head><title>Ignorar</title></head><body><p>Um</p><p>Dois</p><p>Três</p><p>Quatro</p><p>Frase procurada Ana</p></body></html>')
        r = subprocess.run([sys.executable, str(GUIOES / 'medir-blocos.py'), str(p), 'Frase procurada', '--nomes', 'Ana Rui'], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn('Início da frase nos blocos: 4', r.stdout)
        self.assertIn('[0] Um', r.stdout)
        self.assertIn('Ana: 4', r.stdout)
        self.assertIn('Rui: ausente', r.stdout)
        self.assertNotIn('Ignorar', r.stdout)

    def test_pdf_fitz_e_layout_reais(self):
        fitz = exigir_ferramentas_pdf(self)
        p = self.p / 'ensaio.pdf'
        with fitz.open() as doc:
            pagina = doc.new_page()
            pagina.insert_text((72, 72), 'Paragrafo do ensaio com texto medido.')
            doc.save(p)
        r = subprocess.run([sys.executable, str(GUIOES / 'medir-pdf.py'), str(p), '1', 'Paragrafo do ensaio'], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn('Paragrafo do ensaio com texto medido.', r.stdout)
        self.assertIn('"box": [', r.stdout)
        self.assertIn('"page": 1', r.stdout)
        r = subprocess.run([sys.executable, str(GUIOES / 'medir-pdf.py'), str(p), '2', 'Paragrafo'], capture_output=True, text=True)
        self.assertEqual(r.returncode, 9)
        self.assertIn('página fora', r.stderr)

    def test_pdf_sem_ferramentas_salta_com_linha(self):
        escondidas = self.p / 'ferramentas-escondidas'
        escondidas.mkdir()
        (escondidas / 'fitz.py').write_text("raise ImportError('fitz escondido pela planta')\n")
        ambiente = os.environ.copy()
        ambiente.update(PATH=str(escondidas), PYTHONPATH=str(escondidas))
        r = subprocess.run(
            [sys.executable, str(Path(__file__).resolve()), 'Medicoes.test_pdf_fitz_e_layout_reais'],
            env=ambiente, capture_output=True, text=True,
        )
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        linha = 'SALTA medicoes-pl1 · test_pdf_fitz_e_layout_reais · falta: fitz, pdftotext'
        self.assertIn(linha, r.stdout.splitlines())
        self.assertIn('test_pdf_fitz_e_layout_reais', r.stderr)
        self.assertIn("skipped 'falta: fitz, pdftotext'", r.stderr)
        self.assertIn('Ran 1 test', r.stderr)
        self.assertIn('OK (skipped=1)', r.stderr)
        print(r.stdout, end='', flush=True)

    def test_pdf_com_ferramentas_corre_sem_salto(self):
        exigir_ferramentas_pdf(self)
        r = subprocess.run(
            [sys.executable, str(Path(__file__).resolve()), 'Medicoes.test_pdf_fitz_e_layout_reais'],
            capture_output=True, text=True,
        )
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn('test_pdf_fitz_e_layout_reais', r.stderr)
        self.assertIn('Ran 1 test', r.stderr)
        self.assertIn('OK', r.stderr)
        self.assertNotIn('skipped', r.stderr)
        self.assertNotIn('SALTA', r.stdout + r.stderr)
        print('CONFERE medicoes-pl1 · test_pdf_fitz_e_layout_reais · correu sem salto', flush=True)

    def test_no_ar_igual_diferente_http_e_caminho(self):
        m = modulo('medir-no-ar')
        html = '<html><body><p>Uma <b>frase</b>.</p><script>oculto</script></body></html>'
        (self.p / 'index.html').write_text(html)
        self.assertEqual(m.texto(html), ['Uma frase.'])
        for remoto, codigo, marca in [(html, 0, 'texto igual'), (html.replace('Uma', 'Outra'), 1, '+Outra frase.')]:
            out = io.StringIO()
            with patch.object(sys, 'argv', ['medir-no-ar', str(self.p), '/']), patch.object(m.subprocess, 'run', return_value=subprocess.CompletedProcess([], 0, remoto.encode(), b'')), redirect_stdout(out):
                self.assertEqual(m.main(), codigo)
            self.assertIn(marca, out.getvalue())
        with patch.object(sys, 'argv', ['medir-no-ar', str(self.p), '/']), patch.object(m.subprocess, 'run', side_effect=subprocess.CalledProcessError(22, ['curl'])), redirect_stderr(io.StringIO()):
            self.assertEqual(m.main(), 9)
        with patch.object(sys, 'argv', ['medir-no-ar', str(self.p), '/../segredo']), redirect_stderr(io.StringIO()):
            self.assertEqual(m.main(), 9)


if __name__ == '__main__':
    unittest.main(verbosity=2)
