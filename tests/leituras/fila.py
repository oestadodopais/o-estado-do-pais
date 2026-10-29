"""PL1: cinco recusas e duas passagens da fila, com calendário fixo."""
from datetime import date
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('fila_pl1', Path(__file__).resolve().parents[2] / 'scripts/leituras/fila.py')
fila = importlib.util.module_from_spec(spec); spec.loader.exec_module(fila)


class Fila(unittest.TestCase):
    def setUp(self):
        self.t = tempfile.TemporaryDirectory(); self.addCleanup(self.t.cleanup)
        self.p = Path(self.t.name) / 'FILA.md'
        self.texto = '| Ordem | Bloco | Tipo | Estado | Razão |\n| --- | --- | --- | --- | --- |\n| 1 | M1 | maquinaria | pronto | |\n| 2 | C1 | conteúdo | mandato escrito ontem | |\n'
        self.p.write_text(self.texto)

    def conferir(self, bloco='M1', dia=date(2026, 10, 29)):
        fila.conferir(fila.ler_fila(self.p), bloco, dia)

    def test_recusa_maquinaria_antes_de_conteudo_pronto(self):
        with self.assertRaisesRegex(ValueError, 'espera por C1'):
            self.conferir()

    def test_passagem_sexta(self):
        self.conferir(dia=date(2026, 10, 30))

    def test_passagem_condicao(self):
        self.p.write_text(self.texto.replace('ontem | |', 'ontem | condição: M1 |'))
        self.conferir()

    def test_recusa_bloco_fora_da_fila(self):
        with self.assertRaisesRegex(ValueError, 'fora da fila'):
            self.conferir('X')

    def test_recusa_tipo_inventado(self):
        self.p.write_text(self.texto.replace('conteúdo', 'inventado'))
        with self.assertRaisesRegex(ValueError, 'tipo inválido'):
            self.conferir()

    def test_recusa_ordem_repetida(self):
        self.p.write_text(self.texto.replace('| 2 |', '| 1 |'))
        with self.assertRaisesRegex(ValueError, 'repetido'):
            self.conferir()

    def test_recusa_maquinaria_depois_de_navegacao(self):
        self.p.write_text(self.texto.replace('| 1 |', '| 3 |').replace('conteúdo', 'navegação').replace('mandato escrito ontem', 'por preparar'))
        with self.assertRaisesRegex(ValueError, 'espera por C1'):
            self.conferir()

    def test_tipos_dos_blocos_aterrados(self):
        self.p.write_text(self.texto + '\n## Aterrados\n\n| Bloco | Tipo | Recebido |\n| --- | --- | --- |\n| N1 | navegação | porta |\n')
        self.assertEqual(fila.ler_tipos(self.p)['n1'], 'navegação')
        with self.assertRaisesRegex(ValueError, 'fora da fila'):
            self.conferir('N1')

    def test_espera_de_fonte_e_condicao_sem_colisao(self):
        self.p.write_text(self.texto.replace('mandato escrito ontem', 'à espera de fonte'))
        self.conferir()
        self.p.write_text(self.texto.replace('ontem | |', 'ontem | condição: M10 |'))
        with self.assertRaisesRegex(ValueError, 'espera por C1'):
            self.conferir()


if __name__ == '__main__':
    unittest.main(verbosity=2)
