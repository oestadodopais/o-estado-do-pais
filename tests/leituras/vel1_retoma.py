"""Uma tentativa vermelha pode deixar um envio válido, ligado à cabeça e aos bytes."""
import json
from pathlib import Path
import unittest
from at1_aterrar import Preparada

class Retoma(unittest.TestCase):
    def setUp(self):
        self.base = Preparada('runTest')
        self.base.setUp()
        self.addCleanup(self.base.doCleanups)
        self.b = self.base.b
        r, recibo, _ = self.b.correr('vermelho')
        self.assertEqual(r.returncode, 1)
        self.assertIn('vercel_preparado', recibo)
        self.assertTrue(recibo['envio_inventario'])
        self.anterior = self.b.saida / 'aterragem.json'
        self.b.saida = self.b.p / 'retoma'
        self.b.chamadas.write_text('')

    def mudar_recibo(self, mudar):
        d = json.loads(self.anterior.read_text())
        mudar(d)
        self.anterior.write_text(json.dumps(d))

    def retomar(self, reutiliza):
        r, recibo, chamadas = self.b.correr('vermelho')
        self.assertEqual(r.returncode, 1)
        envios = [c for c in chamadas if c[:2] == ['vercel', 'deploy']]
        self.assertEqual(len(envios), 0 if reutiliza else 1)
        self.assertEqual('envio_reutilizado' in recibo, reutiliza)
        self.assertFalse(any(c[:2] == ['git', 'merge'] for c in chamadas))
        return recibo

    def test_mesma_cabeca_e_inventario_reutilizam(self):
        recibo = self.retomar(True)
        self.assertEqual(recibo['vercel_preparado'], 'https://ensaio-at1.vercel.app')

    def test_outra_cabeca_no_recibo_refaz(self):
        self.mudar_recibo(lambda d: d.update(cabeca='b' * 40))
        self.retomar(False)

    def test_um_ficheiro_diferente_refaz(self):
        f = self.b.w / 'dist/version.json'
        d = json.loads(f.read_text()); d['planta'] = 'bytes diferentes'
        f.write_text(json.dumps(d))
        self.retomar(False)

    def test_um_ficheiro_novo_refaz(self):
        (self.b.w / 'dist/novo.txt').write_text('planta')
        self.retomar(False)

    def test_outro_modo_refaz(self):
        self.mudar_recibo(lambda d: d.update(recurso=True))
        self.retomar(False)

    def test_envio_sem_confirmacao_refaz(self):
        self.mudar_recibo(lambda d: d.update(passos=[p for p in d['passos'] if p['passo'] != 'vercel-preparado']))
        self.retomar(False)

if __name__ == '__main__':
    unittest.main(defaultTest='Retoma')
