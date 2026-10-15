"""Aterragem com Git temporário e GitHub, Vercel e npm simulados. Nada se publica."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import time
from apoio_ferramentas import GUIOES, comando, commit, git, repo, worktree


class Aterrar(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='ensaio-aterrar-')
        self.addCleanup(self.tmp.cleanup)
        self.p = Path(self.tmp.name)
        self.main = repo(self.p / 'principal', 'main')
        self.w = worktree(self.main, self.p / 'ramo')
        (self.w / 'linha').write_text('cabeça a aterrar\n')
        commit(self.w, 'ramo pronto')
        self.cabeca = git(self.w, 'rev-parse', 'HEAD')
        self.main_antes = git(self.main, 'rev-parse', 'HEAD')
        self.motor = repo(self.p / 'motor', 'master')
        self.bin = self.p / 'bin'
        self.bin.mkdir()
        self.chamadas = self.p / 'chamadas.jsonl'
        comum = '''import json,os,sys
from pathlib import Path
a=sys.argv[1:]
with open(os.environ['CHAMADAS'],'a') as f: f.write(json.dumps({'cmd':[Path(sys.argv[0]).name,*a], 'cwd':os.getcwd()})+'\\n')
modo=os.environ.get('MODO','verde')
'''
        comando(self.bin, 'git', comum + '''
if a[0]=='push':
    if modo=='push-main-falha' and a[-1]=='main': sys.exit(7)
    sys.exit(0)
if a[0]=='ls-remote':
    print(os.environ['CABECA']+'\\trefs/heads/ensaio'); sys.exit(0)
os.execv(os.environ['GIT_REAL'], ['git',*a])
''')
        comando(self.bin, 'gh', comum + '''
if a[:2]==['run','list']:
    if modo=='lista-invalida': print('{}'); sys.exit(0)
    if modo=='corrida-invalida': print('[null]'); sys.exit(0)
    print(json.dumps([{'databaseId':123,'headSha':os.environ['CABECA'] if modo!='outra-cabeca' else 'b'*40,
        'headBranch':'ensaio','status':'completed','conclusion':'failure' if modo=='vermelho' else 'success',
        'url':'https://example.invalid/corrida/123','workflowName':'portão'}]))
elif a[:2]==['run','watch']: sys.exit(1 if modo=='vermelho' else 0)
elif a[:2]==['run','view']:
    if modo=='conclusao-invalida': print('null'); sys.exit(0)
    print(json.dumps({'headSha':os.environ['CABECA'],'status':'completed','conclusion':'failure' if modo=='conclusao-vermelha' else 'success'}))
else: sys.exit(88)
''')
        comando(self.bin, 'npm', comum + '''
if modo=='series-falha' and a[1]=='check:series': sys.exit(6)
if modo=='cruzamento-falha' and a[1]=='check:cruzamento': sys.exit(5)
if modo=='deploy-falha' and a[1]=='verify:deploy': sys.exit(4)
assert os.environ.get('RESEARCHHUB_DIR')
''')
        comando(self.bin, 'vercel', comum + '''
assert a==['ls','--environment','production','--meta','githubCommitSha='+os.environ['CABECA']]
print('1m https://example.invalid/lancamento ● '+('Error' if modo=='vercel-falha' else 'Ready')+' Production 1m')
''')
        self.env = dict(os.environ, PATH=str(self.bin) + ':' + os.environ['PATH'], GIT_REAL=shutil.which('git'),
                        CHAMADAS=str(self.chamadas), CABECA=self.cabeca, RESEARCHHUB_DIR=str(self.motor),
                        OEDP_TRANCA=str(self.p / 'tranca'))
        self.saida = self.p / 'saida'

    def correr(self, modo='verde', arvore=None):
        self.env['MODO'] = modo
        r = subprocess.run(['sh', str(GUIOES / 'aterrar.sh'), str(arvore or self.w), str(self.saida)],
                           env=self.env, capture_output=True, text=True, timeout=20)
        recibo = json.loads((self.saida / 'aterragem.json').read_text())
        self.assertEqual(recibo['codigo'], r.returncode, r.stdout + r.stderr)
        self.assertTrue(all('cabeca' in p and 'hora' in p and 'codigo' in p for p in recibo['passos']))
        self.assertFalse((self.p / 'tranca').exists())
        self.assertNotIn(str(self.p), (self.saida / 'aterragem.json').read_text())
        chamadas = [json.loads(l)['cmd'] for l in self.chamadas.read_text().splitlines()]
        return r, recibo, chamadas

    def test_ficheiro_por_registar(self):
        (self.w / 'nao-seguido').write_text('planta')
        r, _, chamadas = self.correr()
        self.assertEqual(r.returncode, 9)
        self.assertFalse(any(c[0] == 'git' and c[1] in ('push', 'merge') for c in chamadas))

    def test_main_e_motor_sujo_recusados(self):
        (self.motor / 'nao-seguido').touch()
        r, _, chamadas = self.correr()
        self.assertEqual(r.returncode, 9)
        self.assertFalse(any(c[1] == 'push' for c in chamadas if c[0] == 'git'))

    def test_main_recusado(self):
        r, _, _ = self.correr(arvore=self.main)
        self.assertEqual(r.returncode, 9)

    def test_main_por_fundir(self):
        (self.main / 'linha').write_text('main avançou\n')
        commit(self.main, 'avanço de main')
        r, _, chamadas = self.correr()
        self.assertEqual(r.returncode, 9)
        self.assertFalse(any(c[1] == 'push' for c in chamadas if c[0] == 'git'))

    def test_motor_ausente(self):
        del self.env['RESEARCHHUB_DIR']
        r, _, _ = self.correr()
        self.assertEqual(r.returncode, 9)

    def test_corrida_vermelha(self):
        r, _, chamadas = self.correr('vermelho')
        self.assertEqual(r.returncode, 1)
        self.assertEqual((self.saida / 'github.codigo').read_text(), '1\n')
        self.assertEqual((self.saida / 'github.url').read_text(), 'https://example.invalid/corrida/123\n')
        self.assertFalse(any(c[0] in ('npm', 'vercel') or c[1:2] == ['merge'] for c in chamadas))
        self.assertEqual(git(self.main, 'rev-parse', 'HEAD'), self.main_antes)

    def test_conclusao_vermelha_e_cabeca_errada(self):
        for modo, codigo in (('conclusao-vermelha', 1), ('outra-cabeca', 9)):
            with self.subTest(modo=modo):
                self.saida = self.p / modo
                r, _, chamadas = self.correr(modo)
                self.assertEqual(r.returncode, codigo)
                self.assertFalse(any(c[1:2] == ['merge'] for c in chamadas))

    def test_respostas_do_github_com_estrutura_invalida(self):
        for modo in ('lista-invalida', 'corrida-invalida', 'conclusao-invalida'):
            with self.subTest(modo=modo):
                self.saida = self.p / modo
                r, _, chamadas = self.correr(modo)
                self.assertEqual(r.returncode, 9)
                self.assertNotIn('Traceback', r.stderr)
                self.assertFalse(any(c[1:2] == ['merge'] for c in chamadas))

    def test_conferencias_e_publicacao_falhadas_nao_apagam(self):
        for modo, codigo in (('series-falha', 6), ('cruzamento-falha', 5), ('push-main-falha', 7), ('vercel-falha', 1), ('deploy-falha', 4)):
            with self.subTest(modo=modo):
                self.saida = self.p / modo
                self.chamadas.write_text('')
                r, _, chamadas = self.correr(modo)
                self.assertEqual(r.returncode, codigo)
                self.assertFalse(any('--delete' in c or '-d' in c for c in chamadas))
                self.assertEqual(git(self.w, 'branch', '--show-current'), 'ensaio')
                if modo in ('series-falha', 'cruzamento-falha'):
                    self.assertFalse(any(c[1:2] == ['merge'] for c in chamadas))

    def test_verde_ordem_codigos_e_limpeza(self):
        r, recibo, chamadas = self.correr()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertEqual(git(self.main, 'rev-parse', 'HEAD'), self.cabeca)
        self.assertEqual(git(self.w, 'branch', '--show-current'), '')
        self.assertEqual(git(self.main, 'branch', '--list', 'ensaio'), '')
        for nome in ('series', 'cruzamento', 'verify-deploy', 'github'):
            self.assertEqual((self.saida / (nome + '.codigo')).read_text(), '0\n')
        passos = [p['passo'] for p in recibo['passos']]
        ordem = ['publicar-ramo', 'github', 'series', 'cruzamento', 'fundir-main', 'publicar-main',
                 'vercel-pronto', 'verify-deploy', 'apagar-ramo-remoto', 'destacar-worktree', 'apagar-ramo-local']
        self.assertEqual([p for p in passos if p in ordem], ordem)
        self.assertIn(['gh', 'run', 'watch', '123', '--interval', '60', '--exit-status'], chamadas)
        self.assertIn(['npm', 'run', 'check:cruzamento', '--', '--with-origin'], chamadas)
        self.assertEqual(sum(c == ['git', 'push', 'origin', 'main'] for c in chamadas), 1)

    def test_bandeira_de_forcar_ausente(self):
        for nome in ('aterrar.sh', 'aterrar.py'):
            texto = (GUIOES / nome).read_text()
            self.assertNotIn('--' + 'force', texto)
            self.assertNotIn("'-f'", texto)
            self.assertNotIn("'-D'", texto)

    def test_tranca_ocupada_para_antes_de_publicar(self):
        tranca = self.p / 'tranca'
        tranca.write_text('dono do ensaio\n')
        processo = subprocess.Popen(['sh', str(GUIOES / 'aterrar.sh'), str(self.w), str(self.saida)],
                                   env=self.env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        try:
            self.assertIn('à espera da tranca', processo.stdout.readline())
            processo.terminate()
            processo.communicate(timeout=5)
            self.assertEqual(processo.returncode, 130)
            self.assertEqual(tranca.read_text(), 'dono do ensaio\n')
            chamadas = [json.loads(l)['cmd'] for l in self.chamadas.read_text().splitlines()]
            self.assertFalse(any(c[1:2] == ['push'] for c in chamadas))
        finally:
            if processo.poll() is None:
                processo.kill()
                processo.wait()

    def test_tranca_caducada(self):
        tranca = self.p / 'tranca'
        tranca.write_text('dono antigo do ensaio\n')
        os.utime(tranca, (time.time() - 2401, time.time() - 2401))
        self.assertEqual(self.correr()[0].returncode, 0)


if __name__ == '__main__':
    unittest.main()
