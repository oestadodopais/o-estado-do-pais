"""VEL1 C: remover a worktree só depois da aterragem, preservando trabalho novo."""
import json
import shutil
import unittest
from unittest.mock import patch
import ferramenta_aterrar
from ferramenta_aterrar import Aterrar
from apoio_ferramentas import GUIOES, commit, git


class Limpeza(unittest.TestCase):
    def setUp(self):
        self.b = Aterrar('runTest')
        self.b.setUp()
        self.addCleanup(self.b.doCleanups)
        self.b.env.pop('ATERRAR_CONSERVA_WORKTREE', None)
        self.b.env['BLOCO'] = str(self.b.w)
        falso = self.b.bin / 'git'
        texto = falso.read_text().replace("os.execv(os.environ['GIT_REAL'], ['git',*a])", '''
import subprocess
if a[:2]==['branch','-d'] and modo in ('novo-ficheiro','nova-alteracao','indice-alterado','estado-falha'):
    r=subprocess.run([os.environ['GIT_REAL'],*a])
    if r.returncode: sys.exit(r.returncode)
    bloco=Path(os.environ['BLOCO'])
    if modo=='estado-falha': (bloco/'estado-falha').touch()
    elif modo=='novo-ficheiro': (bloco/'ficheiro novo.txt').write_text('trabalho novo')
    else:
        (bloco/'linha').write_text('alteração posterior')
        if modo=='indice-alterado':
            subprocess.run([os.environ['GIT_REAL'],'-C',str(bloco),'add','--','linha'],check=True)
    sys.exit(0)
if 'status' in a and (Path(os.environ['BLOCO'])/'estado-falha').exists(): sys.exit(16)
if a[:2]==['worktree','remove'] and modo=='remover-falha': sys.exit(17)
os.execv(os.environ['GIT_REAL'], ['git',*a])
''')
        falso.write_text(texto)

    def test_limpa_sai_com_ignorados_e_comando_na_principal(self):
        (self.b.w / 'node_modules').mkdir()
        (self.b.w / 'node_modules/planta').write_text('ignorado')
        r, recibo, chamadas = self.b.correr()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertFalse(self.b.w.exists())
        self.assertNotIn(str(self.b.w.resolve()), git(self.b.main, 'worktree', 'list', '--porcelain'))
        self.assertEqual(recibo['passos'][-1]['passo'], 'remover-worktree')
        self.assertEqual(recibo['passos'][-1]['estado'], 'removida')
        remover = ['git', 'worktree', 'remove', str(self.b.w.resolve())]
        self.assertIn(remover, chamadas)
        invocacao = next(json.loads(l) for l in self.b.chamadas.read_text().splitlines() if json.loads(l)['cmd'] == remover)
        self.assertEqual(invocacao['cwd'], str(self.b.main.resolve()))
        self.assertEqual((self.b.saida / 'remover-worktree.codigo').read_text(), '0\n')

    def conferir_trabalho_preservado(self, modo, ficheiro):
        r, recibo, chamadas = self.b.correr(modo)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertTrue(self.b.w.exists())
        passo = recibo['passos'][-1]
        self.assertEqual(passo['estado'], 'conservada')
        self.assertTrue(any(ficheiro in f for f in passo['ficheiros']))
        self.assertFalse(any(c[:3] == ['git', 'worktree', 'remove'] for c in chamadas))

    def test_ficheiro_novo_fica_nomeado_no_recibo(self):
        self.conferir_trabalho_preservado('novo-ficheiro', 'ficheiro novo.txt')

    def test_alteracao_fica_nomeada_no_recibo(self):
        self.conferir_trabalho_preservado('nova-alteracao', 'linha')

    def test_indice_alterado_fica_nomeado_no_recibo(self):
        self.conferir_trabalho_preservado('indice-alterado', 'linha')

    def test_variavel_conserva(self):
        self.b.env['ATERRAR_CONSERVA_WORKTREE'] = '1'
        r, recibo, chamadas = self.b.correr()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertTrue(self.b.w.exists())
        self.assertEqual(git(self.b.w, 'branch', '--show-current'), '')
        self.assertEqual(recibo['passos'][-1]['motivo'], 'ATERRAR_CONSERVA_WORKTREE=1')
        self.assertFalse(any(c[:3] == ['git', 'worktree', 'remove'] for c in chamadas))

    def conferir_aviso(self, modo):
        r, recibo, _ = self.b.correr(modo)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertTrue(self.b.w.exists())
        self.assertIn('aviso', recibo['passos'][-1])
        self.assertNotEqual(recibo['passos'][-1]['codigo'], 0)

    def test_falha_de_remocao_avisa_sem_mudar_codigo(self):
        self.conferir_aviso('remover-falha')

    def test_falha_de_estado_avisa_sem_mudar_codigo(self):
        self.conferir_aviso('estado-falha')

    def test_falha_antes_nao_chega_a_remocao(self):
        r, recibo, chamadas = self.b.correr('deploy-falha')
        self.assertEqual(r.returncode, 4)
        self.assertTrue(self.b.w.exists())
        self.assertEqual(git(self.b.w, 'branch', '--show-current'), 'ensaio')
        self.assertNotIn('remover-worktree', [p['passo'] for p in recibo['passos']])
        self.assertFalse(any(c[:3] == ['git', 'worktree', 'remove'] for c in chamadas))

    def test_recibo_sobrevive_ao_codigo_removido(self):
        pasta = self.b.w / 'scripts/leituras'
        pasta.mkdir(parents=True)
        nomes = ('aterrar.sh', 'aterrar.py', 'arvores.py', 'tranca.py', 'fila.py', 'limpar-caminhos.py')
        for nome in nomes:
            shutil.copyfile(GUIOES / nome, pasta / nome)
        git(self.b.w, 'add', '--', *['scripts/leituras/' + n for n in nomes])
        commit(self.b.w, 'ensaio: ferramenta dentro da worktree a remover')
        self.b.env['CABECA'] = git(self.b.w, 'rev-parse', 'HEAD')
        with patch.object(ferramenta_aterrar, 'GUIOES', pasta):
            r, recibo, _ = self.b.correr()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertFalse(self.b.w.exists())
        self.assertEqual(recibo['passos'][-1]['estado'], 'removida')


if __name__ == '__main__':
    unittest.main(defaultTest='Limpeza', verbosity=2)
