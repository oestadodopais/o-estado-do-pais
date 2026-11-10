"""Cada recusa local impede a fusão mesmo que a corrida remota esteja verde."""
import json
import subprocess
import unittest
from ferramenta_aterrar import Aterrar

class Sobreposicao(unittest.TestCase):
    def test_cada_vermelho_local_nao_funde(self):
        for modo in ['series-falha','ledger-corpos-falha','frases-afirmacao-falha','cruzamento-falha','camada-0-falha']:
            with self.subTest(modo=modo):
                b = Aterrar('runTest'); b.setUp()
                try:
                    # A API simulada está verde antes da tentativa local.
                    consulta = subprocess.run([str(b.bin / 'gh'),'run','view','123'],
                        cwd=b.w,env={**b.env,'MODO':modo},capture_output=True,text=True,check=True)
                    remoto = json.loads(consulta.stdout)
                    self.assertEqual((remoto['status'],remoto['conclusion']),('completed','success'))
                    b.chamadas.write_text('')
                    r, recibo, chamadas = b.correr(modo)
                    self.assertNotEqual(r.returncode,0)
                    self.assertFalse(any(c[:2]==['git','merge'] for c in chamadas))
                    self.assertNotIn('github',[p['passo'] for p in recibo['passos']])
                    self.assertNotIn('fundir-main',[p['passo'] for p in recibo['passos']])
                finally:
                    b.doCleanups()

if __name__ == '__main__':
    unittest.main(defaultTest='Sobreposicao')
