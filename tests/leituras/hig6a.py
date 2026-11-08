"""Plantas do pré-mandato, do teto e da data da planta, em pastas temporárias."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

RAIZ = Path(__file__).resolve().parents[2]
GUIOES = RAIZ / 'scripts/leituras'


def modulo(nome):
    spec = importlib.util.spec_from_file_location(nome, GUIOES / (nome + '.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


class HIG6A(unittest.TestCase):
    def test_terceira_retoma_e_novo_arranque_do_mesmo_bloco(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            registar = modulo('retomas').registar
            def correr(bloco='A', retoma=False, decisao=''):
                return registar(p / 'estado', bloco, p / 'RELATORIO', retoma, decisao)
            self.assertEqual(correr()['retomas'], 0)
            self.assertEqual(correr(retoma=True)['retomas'], 1)
            self.assertEqual(correr()['retomas'], 2)  # outra sessão a frio também conta
            for d in ['', '2026-11-08 curta', '2026-02-30 Uma razão longa e escrita para continuar.']:
                with self.assertRaises(ValueError): correr(decisao=d)
            self.assertTrue(json.loads((p / 'RELATORIO.retomas.json').read_text())['recusada'])
            d = '2026-11-08 A correção está delimitada e exige esta retoma.'
            self.assertEqual(correr(decisao=d)['retomas'], 3)
            self.assertEqual(json.loads((p / 'RELATORIO.retomas.json').read_text())['decisao'], d)
            with self.assertRaises(ValueError): correr()
            self.assertEqual(correr('B')['retomas'], 0)
            self.assertEqual(correr('C', retoma=True)['retomas'], 1)

    def test_quantificadores_lidos_sem_copia(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp); (p / 'core').mkdir()
            f = p / 'core/assertions.py'
            f.write_text("QUANTIFIER_PATTERNS = [r'\\bonly\\b']\nraise RuntimeError('não executar')\n")
            conferir = modulo('quantificadores').conferir
            lista = [{'id':'P', 'nova':'Only one.'}]
            self.assertEqual(len(conferir(lista, p)), 1)
            lista[0]['assercao'] = 'id-da-asserção'
            self.assertEqual(conferir(lista, p), [])
            lista[0]['assercao'] = ''
            self.assertEqual(len(conferir(lista, p)), 1)
            f.write_text("QUANTIFIER_PATTERNS = [r'\\bfonte\\b']\n")
            self.assertEqual(conferir(lista, p), [])
            lista[0]['nova'] = 'A fonte.'
            self.assertEqual(len(conferir(lista, p)), 1)

    def test_plantar_conserva_mtime_ns(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp); pacote = p / 'pacote'; pacote.mkdir()
            f = pacote / 'pagina.html'; f.write_text('Antes da planta.')
            os.utime(f, ns=(1000000000123456789, 1000000000987654321))
            antes = f.stat()
            r = subprocess.run([sys.executable, str(GUIOES / 'plantar.py'), str(pacote), 'pagina.html', 'P',
                                'Prova da data', 'Antes', 'Depois'], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0)
            self.assertEqual(f.stat().st_mtime_ns, antes.st_mtime_ns)
            self.assertEqual(f.stat().st_atime_ns, antes.st_atime_ns)
            self.assertEqual(f.read_text(), 'Depois da planta.')
            d = json.loads((p / 'pacote.plantas.json').read_text())['plantas'][0]
            self.assertNotEqual(d['sha256_antes'], d['sha256_depois'])

    def test_cabecalho_repetido_antes_do_nada_e_codigos(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp); guioes = p / 'scripts/leituras'; guioes.mkdir(parents=True)
            # Duplo de execução: mede só o encaminhamento; a régua real tem plantas em frases.mjs.
            (guioes / 'conferir-frases.mjs').write_text("console.log(process.argv[2].split('/').pop()); process.exitCode = process.argv[2].endsWith('recusa.json') ? 9 : 0;\n")
            m = p / 'mandato.md'
            env = {k:v for k,v in os.environ.items() if k != 'OEDP_ACRESCENTA'}
            def correr(texto):
                m.write_text(texto)
                return subprocess.run([sys.executable, str(GUIOES / 'pre-mandato.py'), str(p), str(m)], env=env, capture_output=True, text=True)
            r = correr('Acrescenta: nada\nFrases: verde.json\nFrases: recusa.json\n')
            self.assertEqual(r.returncode, 9)
            self.assertIn('verde.json', r.stdout); self.assertIn('recusa.json', r.stdout)
            self.assertEqual(correr('Acrescenta: nada\nFrases: verde.json\n').returncode, 0)
            self.assertEqual(correr('Acrescenta: nada\nFrases:\n').returncode, 9)
            self.assertEqual(correr('Acrescenta: nada\nFrases: /absoluto.json\n').returncode, 9)


if __name__ == '__main__':
    unittest.main()
