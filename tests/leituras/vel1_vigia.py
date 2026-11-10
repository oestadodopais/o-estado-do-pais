"""O gh falso falha duas consultas e depois responde, sem esperar tempo real."""
import importlib
import json
import os
import signal
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
from apoio_ferramentas import GUIOES, comando, git
from ferramenta_aterrar import Aterrar
sys.path.insert(0, str(GUIOES))
at = importlib.import_module('aterrar')

class Vigia(unittest.TestCase):
    def setUp(self):
        self.b = Aterrar('runTest')
        self.b.setUp()
        self.addCleanup(self.b.doCleanups)
        self.b.env['CONTAGEM'] = str(self.b.p / 'contagem')
        comando(self.b.bin, 'gh', '''import json,os,signal,sys
from pathlib import Path
a=sys.argv[1:]
if a[:2]==['run','list']:
 print(json.dumps([{'databaseId':123,'headSha':os.environ['CABECA'],'headBranch':'ensaio',
 'status':'in_progress','conclusion':None,'url':'https://example.invalid/123','workflowName':'portão'}]))
elif a[:2]==['run','watch']:
 if os.environ.get('SINAL_FILHO')=='vigia':os.kill(os.getpid(),signal.SIGTERM)
 if os.environ.get('INTERROMPER')=='vigia':os.kill(os.getppid(),int(os.environ['SINAL']));sys.exit(0)
 if os.environ.get('SAIDA_130')=='vigia':sys.exit(130)
 assert a[-3:]==['--interval','10','--exit-status'];sys.exit(1)
elif a[:2]==['run','view']:
 f=Path(os.environ['CONTAGEM']);n=int(f.read_text())+1 if f.exists() else 1;f.write_text(str(n))
 if os.environ.get('SINAL_FILHO')=='consulta' and n==1:os.kill(os.getpid(),signal.SIGTERM)
 if os.environ.get('INTERROMPER')=='consulta' and n==1:os.kill(os.getppid(),int(os.environ['SINAL']));sys.exit(0)
 if os.environ.get('SAIDA_130')=='consulta' and n==1:sys.exit(130)
 modo=os.environ.get('CONSULTA','recupera')
 if modo=='rede' or (modo=='recupera' and n<=2):sys.exit(1)
 print(json.dumps({'headSha':os.environ['CABECA'] if modo!='outra' else 'b'*40,
 'status':'in_progress' if modo=='pendente' or (modo=='recupera' and n<=12) else 'completed',
 'conclusion':'failure' if modo=='vermelho' else 'cancelled' if modo=='cancelada' else 'success'}))
else:sys.exit(88)
''')

    def correr(self, modo, vigia_segundos=0):
        relogio = [0]
        def esperar(segundos):
            relogio[0] += segundos
        original = at.Aterragem.correr
        def correr(a, nome, args, **kwargs):
            if nome == 'github-vigia':
                relogio[0] += vigia_segundos
            return original(a, nome, args, **kwargs)
        with patch.object(at.time, 'monotonic', side_effect=lambda: relogio[0]), \
                patch.object(at.Aterragem, 'correr', correr), patch.dict(os.environ, {**self.b.env, 'CONSULTA':modo}), patch.object(at.Aterragem, 'esperar', side_effect=esperar) as pausa:
            a = at.Aterragem(str(self.b.w), str(self.b.saida))
            try:
                a.github()
                codigo = 0
            except at.Parar as erro:
                codigo = erro.codigo
            return codigo, a, pausa

    def test_duas_falhas_de_rede_dez_pendentes_depois_verde(self):
        codigo, a, pausa = self.correr('recupera')
        self.assertEqual(codigo, 0)
        self.assertEqual(Path(self.b.env['CONTAGEM']).read_text(), '13')
        self.assertEqual(sum(c.args[0] for c in pausa.call_args_list), 360)
        self.assertEqual((self.b.saida / 'github.codigo').read_text(), '0\n')
        self.assertEqual(a.recibo['passos'][-1]['passo'], 'github')

    def conferir_interrupcao(self, passo, sinal=None, filho=False):
        self.b.env['CONSULTA'] = 'verde'
        if filho:
            self.b.env['SINAL_FILHO'] = passo
        elif sinal is None:
            self.b.env['SAIDA_130'] = passo
        else:
            self.b.env.update(INTERROMPER=passo, SINAL=str(sinal))
        resultado, recibo, chamadas = self.b.correr()
        codigo = 128 + signal.SIGTERM if filho else 130
        self.assertEqual(resultado.returncode, codigo)
        self.assertEqual(recibo['codigo'], codigo)
        self.assertFalse(any(c[1:2] == ['merge'] for c in chamadas))
        self.assertFalse(any(c[:2] == ['git', 'push'] and c[-1] == 'main' for c in chamadas))
        self.assertEqual(git(self.b.main, 'rev-parse', 'HEAD'), self.b.main_antes)
        contagem = Path(self.b.env['CONTAGEM'])
        self.assertEqual(int(contagem.read_text()) if contagem.exists() else 0,
                         0 if passo == 'vigia' else 1)

    def test_sigint_durante_vigia_para_sem_fundir(self):
        self.conferir_interrupcao('vigia', signal.SIGINT)

    def test_sigint_durante_consulta_para_sem_fundir(self):
        self.conferir_interrupcao('consulta', signal.SIGINT)

    def test_sigterm_durante_vigia_para_sem_fundir(self):
        self.conferir_interrupcao('vigia', signal.SIGTERM)

    def test_sigterm_durante_consulta_para_sem_fundir(self):
        self.conferir_interrupcao('consulta', signal.SIGTERM)

    def test_saida_130_do_vigia_para_sem_fundir(self):
        self.conferir_interrupcao('vigia')

    def test_saida_130_da_consulta_para_sem_fundir(self):
        self.conferir_interrupcao('consulta')

    def test_sinal_no_processo_vigia_para_sem_fundir(self):
        self.conferir_interrupcao('vigia', filho=True)

    def test_sinal_no_processo_consulta_para_sem_fundir(self):
        self.conferir_interrupcao('consulta', filho=True)

    def test_rede_indisponivel_ate_ao_teto(self):
        codigo, _, pausa = self.correr('rede')
        self.assertNotEqual(codigo, 0)
        self.assertEqual(Path(self.b.env['CONTAGEM']).read_text(), '180')
        self.assertEqual(sum(c.args[0] for c in pausa.call_args_list), 5400)

    def test_corrida_pendente_nao_e_verde(self):
        codigo, _, pausa = self.correr('pendente')
        self.assertEqual(codigo, 124)
        self.assertEqual(sum(c.args[0] for c in pausa.call_args_list), 5400)
        self.assertEqual((self.b.saida / 'github.codigo').read_text(), '124\n')
        self.assertEqual(Path(self.b.env['CONTAGEM']).read_text(), '180')

    def test_teto_conta_desde_o_inicio_do_vigia(self):
        codigo, _, pausa = self.correr('pendente', vigia_segundos=5355)
        self.assertEqual(codigo, 124)
        self.assertEqual(sum(c.args[0] for c in pausa.call_args_list), 45)
        self.assertEqual(Path(self.b.env['CONTAGEM']).read_text(), '2')

    def test_vermelho_confirmado_para_sem_repetir(self):
        codigo, _, pausa = self.correr('vermelho')
        self.assertNotEqual(codigo, 0)
        self.assertEqual(Path(self.b.env['CONTAGEM']).read_text(), '1')
        pausa.assert_not_called()

    def test_cancelada_nao_e_verde(self):
        codigo, _, _ = self.correr('cancelada')
        self.assertNotEqual(codigo, 0)

    def test_outra_cabeca_nao_e_verde(self):
        codigo, _, _ = self.correr('outra')
        self.assertNotEqual(codigo, 0)

if __name__ == '__main__':
    unittest.main(defaultTest='Vigia')
