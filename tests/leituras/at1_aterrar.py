"""AT1: o envio preparado nunca promove antes do portão e de main."""
import json
import subprocess
from pathlib import Path
import sys
import unittest
from apoio_ferramentas import comando, commit, git
from ferramenta_aterrar import Aterrar


class Preparada(unittest.TestCase):
    def setUp(self):
        self.b = Aterrar('runTest')
        self.b.setUp()
        self.addCleanup(self.b.doCleanups)
        b = self.b
        (b.w / 'vercel.json').write_text('{"git":{"deploymentEnabled":{"main":false,"*":false}}}')
        pasta = b.w / 'scripts/leituras'; pasta.mkdir(parents=True)
        (pasta / 'vercel-prebuilt.sh').write_text('''#!/bin/sh
[ "${MODO:-}" != prebuilt-falha ] || exit 8
printf '%s\\n' 'preparação de ensaio'
''')
        (pasta / 'vercel-prebuilt.py').write_text('import sys\nassert sys.argv[-1] == \"--ligar\"\n')
        git(b.w, 'add', '--', 'vercel.json', 'scripts/leituras/vercel-prebuilt.sh', 'scripts/leituras/vercel-prebuilt.py')
        commit(b.w, 'ensaio: preparação AT1')
        b.cabeca = git(b.w, 'rev-parse', 'HEAD'); b.env['CABECA'] = b.cabeca
        comando(b.bin, 'vercel', '''import json,os,sys
from pathlib import Path
a=sys.argv[1:]
with open(os.environ['CHAMADAS'],'a') as f: f.write(json.dumps({'cmd':['vercel',*a],'cwd':os.getcwd()})+'\\n')
modo=os.environ.get('MODO','verde')
if a[0]=='deploy':
    assert '--prod' in a and '--skip-domain' in a
    assert '--archive=tgz' in a
    assert ('--prebuilt' in a) == (os.environ.get('OEDP_ATERRAR_RECURSO')!='1')
    if modo=='envio-falha': sys.exit(7)
    print('https://ensaio-at1.vercel.app')
elif a[0]=='promote':
    assert a[1]=='https://ensaio-at1.vercel.app'
    if modo=='promover-falha': sys.exit(6)
else: sys.exit(88)
''')

    def test_verde_envio_antes_da_espera_promocao_depois_de_main(self):
        r, recibo, chamadas = self.b.correr()
        self.assertEqual(r.returncode, 0, r.stdout+r.stderr+str(recibo))
        passos=[p['passo'] for p in recibo['passos']]
        ordem=['publicar-ramo','vercel-prebuilt','vercel-preparado','github','fundir-main','publicar-main','vercel-promover','verify-deploy']
        self.assertEqual([p for p in passos if p in ordem],ordem)
        self.assertEqual(recibo['vercel_preparado'],'https://ensaio-at1.vercel.app')
        for p in recibo['passos']:
            if 'comando' in p:
                self.assertIn('inicio',p); self.assertIn('hora',p); self.assertGreaterEqual(p['segundos'],0)
        self.assertEqual(git(self.b.main,'rev-parse','HEAD'),self.b.cabeca)

    def test_planta_envio_sem_archive_recusado(self):
        args = [str(self.b.bin / 'vercel'), 'deploy', '--prebuilt', '--prod', '--skip-domain']
        r = subprocess.run(args, cwd=self.b.w, env=self.b.env, capture_output=True, text=True)
        self.assertNotEqual(r.returncode, 0)
        self.assertIn('AssertionError', r.stderr)
        r = subprocess.run([*args, '--archive=tgz'], cwd=self.b.w, env=self.b.env, capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stderr)

    def test_github_vermelho_nao_promove_nem_funde(self):
        r, recibo, chamadas=self.b.correr('vermelho')
        self.assertEqual(r.returncode,1)
        self.assertTrue(any(c[:2]==['vercel','deploy'] for c in chamadas))
        self.assertFalse(any(c[:2] in (['vercel','promote'],['git','merge']) for c in chamadas))
        self.assertEqual(git(self.b.main,'rev-parse','HEAD'),self.b.main_antes)

    def test_push_main_falhado_nao_promove(self):
        r, _, chamadas=self.b.correr('push-main-falha')
        self.assertEqual(r.returncode,7)
        self.assertFalse(any(c[:2]==['vercel','promote'] for c in chamadas))

    def test_preparacao_falhada_nao_funde(self):
        r, _, chamadas=self.b.correr('prebuilt-falha')
        self.assertEqual(r.returncode,8)
        self.assertFalse(any(c[:2] in (['vercel','deploy'],['git','merge']) for c in chamadas))

    def test_envio_falhado_nao_funde(self):
        r, _, chamadas=self.b.correr('envio-falha')
        self.assertEqual(r.returncode,7)
        self.assertFalse(any(c[:2]==['git','merge'] for c in chamadas))

    def test_recurso_mantem_portao_e_envio_de_main(self):
        self.b.env['OEDP_ATERRAR_RECURSO']='1'
        r, recibo, chamadas=self.b.correr()
        self.assertEqual(r.returncode,0,r.stdout+r.stderr+str(recibo))
        self.assertTrue(recibo['recurso'])
        self.assertNotIn('vercel-prebuilt',[p['passo'] for p in recibo['passos']])
        self.assertTrue(any(c[:2]==['vercel','promote'] for c in chamadas))


if __name__ == '__main__':
    # A classe importada fornece a fixture; a suite do legado corre no seu ficheiro.
    unittest.main(defaultTest='Preparada')
