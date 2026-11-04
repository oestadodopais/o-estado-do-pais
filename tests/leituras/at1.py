"""AT1: empacotamento sem rede, isenções e exclusão entre corridas reais."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch
from apoio_ferramentas import git, commit, worktree

RAIZ = Path(__file__).resolve().parents[2]
GUIOES = RAIZ / 'scripts/leituras'
spec = importlib.util.spec_from_file_location('prebuilt', GUIOES / 'vercel-prebuilt.py')
pb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pb)


class Prebuilt(unittest.TestCase):
    def setUp(self):
        (RAIZ / '.vercel').mkdir(exist_ok=True)
        self.tmp = tempfile.TemporaryDirectory(prefix='ensaio-at1-', dir=RAIZ / '.vercel')
        self.addCleanup(self.tmp.cleanup)
        self.w = Path(self.tmp.name)
        self.output = self.w / '.vercel/output'
        self.func = self.output / 'functions/api/sugestoes.func'
        self.func.mkdir(parents=True)
        (self.w / 'api').mkdir()
        (self.w / 'api/sugestoes.js').write_text('// função de ensaio\n')
        (self.w / 'dist').mkdir()
        (self.w / 'dist/index.html').write_text('cópia conferida')
        for nome in ('version.json', 'prova.json'):
            (self.w / 'dist' / nome).write_text(json.dumps({'commit': 'c' * 40}))
        self.origem = json.loads((RAIZ / 'vercel.json').read_text())
        self.config = {'version': 3, 'routes': copy.deepcopy(self.origem['routes'])}
        self.vc = {'runtime': 'nodejs22.x', 'handler': 'index.js', 'launcherType': 'Nodejs', 'regions': ['dub1']}
        (self.func / 'index.js').write_text('// lançador falso\n')
        self.escrever()

    def escrever(self):
        for p, d in ((self.w / 'vercel.json', self.origem), (self.output / 'config.json', self.config),
                     (self.func / '.vc-config.json', self.vc)):
            p.write_text(json.dumps(d))

    def test_verde_e_cada_regra_em_falta(self):
        r = pb.trocar(self.w)
        self.assertEqual(r['funcoes'], 1)
        self.assertEqual(r['sha256'], pb.inventario(self.w / 'dist'))
        rotas = copy.deepcopy(self.config['routes'])
        for i in range(len(rotas)):
            self.config['routes'] = rotas[:i] + rotas[i + 1:]
            self.escrever()
            with self.assertRaisesRegex(ValueError, 'regra ausente'):
                pb.conferir(self.w)
        self.config['routes'] = rotas
        self.escrever()
        pb.conferir(self.w)

    def test_funcao_campos_regiao_e_handler(self):
        for campo in ('runtime', 'handler', 'launcherType'):
            with self.subTest(campo=campo):
                anterior = self.vc.pop(campo)
                self.escrever()
                with self.assertRaises(ValueError):
                    pb.trocar(self.w)
                self.vc[campo] = anterior
        self.escrever()
        (self.func / '.vc-config.json').unlink()
        with self.assertRaisesRegex(ValueError, 'vc-config'):
            pb.trocar(self.w)
        self.escrever()
        self.vc['handler'] = '../fora.js'
        self.escrever()
        with self.assertRaisesRegex(ValueError, 'handler ausente'):
            pb.trocar(self.w)
        self.vc['handler'] = 'index.js'
        self.vc['regions'] = ['iad1']
        self.escrever()
        with self.assertRaisesRegex(ValueError, 'região'):
            pb.trocar(self.w)

    def test_regioes_ausentes_completadas_em_cada_funcao(self):
        self.vc.pop('regions')
        self.escrever()
        outra = self.output / 'functions/extra.func'
        outra.mkdir()
        (outra / '.vc-config.json').write_text(json.dumps(self.vc))
        with self.assertRaisesRegex(ValueError, 'região'):
            pb.conferir_regras(self.w)
        pb.trocar(self.w)
        for pasta in (self.func, outra):
            config = json.loads((pasta / '.vc-config.json').read_text())
            self.assertEqual(config['regions'], ['dub1'])
            self.assertEqual({k: v for k, v in config.items() if k != 'regions'}, self.vc)
        config['regions'] = ['iad1']
        (outra / '.vc-config.json').write_text(json.dumps(config))
        with self.assertRaisesRegex(ValueError, 'extra.func'):
            pb.trocar(self.w)
        self.assertEqual(json.loads((outra / '.vc-config.json').read_text())['regions'], ['iad1'])

    def test_origem_sem_regioes_recusada(self):
        self.origem.pop('regions')
        self.vc.pop('regions')
        self.escrever()
        for conferir in (pb.trocar, pb.conferir_regras):
            with self.assertRaisesRegex(ValueError, 'vercel.json sem regions'):
                conferir(self.w)
        self.assertNotIn('regions', json.loads((self.func / '.vc-config.json').read_text()))

    def iniciar_git(self):
        git(self.w, 'init', '-q')
        git(self.w, 'config', 'core.hooksPath', os.devnull)
        (self.w / '.gitignore').write_text('dist/\n.vercel/\n')
        (self.w / 'linha').write_text('base\n')
        (self.w / 'package-lock.json').write_text('{}\n')
        git(self.w, 'add', '--', 'api/sugestoes.js', 'vercel.json', 'package-lock.json')
        commit(self.w, 'ensaio: cabeça conferida')
        self.projeto = {'projectId': 'projeto-de-ensaio', 'projectName': 'sitio-de-ensaio', 'orgId': 'equipa-de-ensaio'}
        (self.w / '.vercel/project.json').write_text(json.dumps(self.projeto))
        head = git(self.w, 'rev-parse', 'HEAD')
        for nome in ('version.json', 'prova.json'):
            (self.w / 'dist' / nome).write_text(json.dumps({'commit': head}))

    def test_build_altera_lock_e_nao_prepara_pacote(self):
        self.iniciar_git()
        self.vc.pop('regions')
        self.escrever()
        real_run = subprocess.run
        def executar(args, **kwargs):
            if args[0] != 'vercel':
                return real_run(args, **kwargs)
            if args[1] == 'build':
                (self.w / 'package-lock.json').write_text('{"mudou":true}\n')
                (self.w / 'dist/index.html').write_text('outra construção')
            return subprocess.CompletedProcess(args, 0)
        with patch.object(pb.subprocess, 'run', side_effect=executar):
            with self.assertRaisesRegex(ValueError, 'ficheiros alterados:.*package-lock.json'):
                pb.preparar(self.w)
        self.assertEqual((self.w / 'dist/index.html').read_text(), 'cópia conferida')
        self.assertFalse((self.output / 'static').exists())
        self.assertNotIn('regions', json.loads((self.func / '.vc-config.json').read_text()))
        self.assertIn('mudou', (self.w / 'package-lock.json').read_text())

    def test_build_limpo_completa_regiao_e_conserva_handler(self):
        self.iniciar_git()
        self.vc.pop('regions')
        self.escrever()
        real_run = subprocess.run
        comandos = []
        def executar(args, **kwargs):
            if args[0] != 'vercel':
                return real_run(args, **kwargs)
            comandos.append(args)
            if args[1] == 'build':
                (self.w / 'dist/index.html').write_text('outra construção')
            return subprocess.CompletedProcess(args, 0)
        with patch.object(pb.subprocess, 'run', side_effect=executar):
            prova = pb.preparar(self.w)
        self.assertEqual(len(comandos), 2)
        self.assertEqual(prova['regioes'], ['dub1'])
        self.assertEqual(json.loads((self.func / '.vc-config.json').read_text()), {**self.vc, 'regions': ['dub1']})
        self.assertEqual((self.output / 'static/index.html').read_text(), 'cópia conferida')
        pb.conferir_arvore(self.w)

    def test_arvore_limpa_ignorados_nao_seguidos_e_indice(self):
        self.iniciar_git()
        (self.w / '.vercel/artefacto').write_text('ignorado')
        pb.conferir_arvore(self.w)
        novo = self.w / 'novo.txt'
        novo.write_text('não ignorado')
        with self.assertRaisesRegex(ValueError, 'novo.txt'):
            pb.conferir_arvore(self.w)
        novo.unlink()
        (self.w / 'linha').unlink()
        with self.assertRaisesRegex(ValueError, 'linha'):
            pb.conferir_arvore(self.w)
        (self.w / 'linha').write_text('outra versão\n')
        git(self.w, 'add', '--', 'linha')
        with self.assertRaisesRegex(ValueError, 'linha'):
            pb.conferir_arvore(self.w)

    def test_sha256_lista_e_ligacoes(self):
        for modo in ('bytes', 'extra', 'falta', 'ligacao'):
            pb.trocar(self.w)
            p = self.output / 'static/index.html'
            if modo == 'bytes':
                p.write_text('alterado')
            elif modo == 'extra':
                (self.output / 'static/extra').touch()
            elif modo == 'falta':
                p.unlink()
            else:
                p.unlink()
                p.symlink_to(self.w / 'dist/index.html')
            with self.assertRaisesRegex(ValueError, 'sha256|ligação'):
                pb.conferir(self.w)

    def test_build_reconstroi_mas_copia_conferida_sobrevive(self):
        self.iniciar_git()
        real_run = subprocess.run
        comandos = []
        def executar(args, **kwargs):
            if args[0] != 'vercel':
                return real_run(args, **kwargs)
            comandos.append(args)
            if args[:2] == ['vercel', 'build']:
                (self.w / 'dist/index.html').write_text('outra construção')
        with patch.object(pb.subprocess, 'run', side_effect=executar):
            pb.preparar(self.w)
        self.assertEqual(comandos, [['vercel', 'pull', '--yes', '--environment=production'], ['vercel', 'build', '--prod']])
        self.assertEqual((self.output / 'static/index.html').read_text(), 'cópia conferida')
        def falhar(args, **kwargs):
            if args[0] != 'vercel':
                return real_run(args, **kwargs)
            raise OSError('ensaio')
        with patch.object(pb.subprocess, 'run', side_effect=falhar):
            with self.assertRaises(OSError):
                pb.preparar(self.w)
        self.assertEqual((self.w / 'dist/index.html').read_text(), 'cópia conferida')

    def test_sem_ligacao_principal_recusa_antes_da_rede(self):
        self.iniciar_git()
        projeto = self.w / '.vercel/project.json'
        real_run = subprocess.run
        def executar(args, **kwargs):
            self.assertNotEqual(args[0], 'vercel', 'não pode haver rede sem ligação')
            return real_run(args, **kwargs)
        for valor in (None, {}, {'projectId': 'incompleto'}):
            with self.subTest(valor=valor):
                projeto.unlink(missing_ok=True)
                if valor is not None:
                    projeto.write_text(json.dumps(valor))
                with patch.object(pb.subprocess, 'run', side_effect=executar):
                    with self.assertRaisesRegex(ValueError, 'árvore principal.*ligação'):
                        pb.preparar(self.w)

    def test_ligacao_da_principal_substitui_antiga_e_apaga_ambiente(self):
        self.iniciar_git()
        destino = self.w / '.vercel/worktree'
        worktree(self.w, destino)
        (destino / '.vercel').mkdir()
        projeto = destino / '.vercel/project.json'
        ambiente = destino / '.vercel/.env.production.local'
        for ligada in (False, True):
            with self.subTest(ligada=ligada):
                projeto.unlink(missing_ok=True)
                if ligada:
                    projeto.write_text(json.dumps({**self.projeto, 'projectId': 'outro'}))
                ambiente.write_text('ambiente de ensaio antigo')
                self.assertEqual(pb.ligar_projeto(destino), self.projeto)
                self.assertEqual(projeto.read_bytes(), (self.w / '.vercel/project.json').read_bytes())
                self.assertFalse(ambiente.exists())

    def test_pull_troca_identidade_recusa_antes_do_build(self):
        self.iniciar_git()
        real_run = subprocess.run
        for chave in ('projectId', 'projectName', 'orgId'):
            with self.subTest(chave=chave):
                (self.w / '.vercel/project.json').write_text(json.dumps(self.projeto))
                comandos = []
                def executar(args, **kwargs):
                    if args[0] != 'vercel':
                        return real_run(args, **kwargs)
                    comandos.append(args[1])
                    self.assertEqual(args[1], 'pull', 'build proibido com outro projeto')
                    (self.w / '.vercel/project.json').write_text(json.dumps({**self.projeto, chave: 'outro'}))
                with patch.object(pb.subprocess, 'run', side_effect=executar):
                    with self.assertRaisesRegex(ValueError, 'difere da árvore principal: ' + chave):
                        pb.preparar(self.w)
                self.assertEqual(comandos, ['pull'])

    def test_ensaio_envia_comprimido_e_sem_promocao(self):
        self.iniciar_git()
        real_run = subprocess.run
        comandos = []
        def executar(args, **kwargs):
            if args[0] != 'vercel':
                return real_run(args, **kwargs)
            comandos.append(args)
            if args[1] == 'deploy':
                self.assertIn('--archive=tgz', args)
                self.assertIn('--prebuilt', args)
                self.assertIn('--prod', args)
                self.assertIn('--skip-domain', args)
                pb.conferir_projeto(self.w, self.projeto)
                pb.conferir(self.w)
        with patch.object(pb.subprocess, 'run', side_effect=executar):
            pb.enviar_ensaio(self.w)
        self.assertEqual([c[1] for c in comandos], ['pull', 'build', 'deploy'])


class Voz(unittest.TestCase):
    def test_isencoes_so_no_cabecalho(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / 'mandato.md'
            for cabecalho, esperado in [('Página: metodo\n', 0), ('Página: sobre\n', 0),
                                       ('Página: inicio\n', 1), ('', 1), ('Página: metodo\nPágina: inicio\n', 1)]:
                p.write_text('# Ensaio\n' + cabecalho + '\n## Frase\n«A página explica as conferências ao leitor.»\n')
                r = subprocess.run([sys.executable, str(GUIOES / 'voz-do-mandato.py'), str(RAIZ), str(p)], capture_output=True)
                self.assertEqual(r.returncode, esperado, r.stdout)


class Tranca(unittest.TestCase):
    def test_duas_corridas_dois_builds_e_cruzamento(self):
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp)
            binario = p / 'bin'; binario.mkdir()
            git = binario / 'git'
            git.write_text('#!/bin/sh\ncase "$*" in *rev-parse*) echo cabeca;; esac\n'); git.chmod(0o755)
            npm = binario / 'npm'
            npm.write_text('''#!/usr/bin/env python3
import json,os,time
from pathlib import Path
p=Path(os.environ['EVENTOS'])
with p.open('a') as f: f.write(json.dumps({'evento':'inicio','pid':os.getpid(),'hora':time.monotonic()})+'\\n')
time.sleep(.3)
with p.open('a') as f: f.write(json.dumps({'evento':'fim','pid':os.getpid(),'hora':time.monotonic()})+'\\n')
'''); npm.chmod(0o755)
            env = {**os.environ, 'PATH': str(binario) + ':' + os.environ['PATH'], 'OEDP_TRANCA': str(p / 'lock'), 'EVENTOS': str(p / 'eventos')}
            env.pop('OEDP_TRANCA_DONO', None)
            for dupla in (('build','build'), ('corrida','corrida'), ('build','corrida')):
                (p / 'eventos').write_text('')
                processos=[]
                inicio=time.monotonic()
                for i, tipo in enumerate(dupla):
                    w = p / ('-'.join(dupla) + str(i)); w.mkdir()
                    (w / 'package.json').write_text('{"scripts":{"verify":"npm run ensaio"}}')
                    args = [sys.executable, str(GUIOES / 'com-tranca.py'), 'npm', 'run', 'build'] if tipo == 'build' else ['sh', str(GUIOES / 'conferir-tudo.sh'), str(w), str(w / 'saida'), '--sem-build']
                    processos.append(subprocess.Popen(args, cwd=w, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True))
                for proc in processos:
                    out, err=proc.communicate(timeout=25)
                    self.assertEqual(proc.returncode, 0, out+err)
                eventos=[json.loads(l) for l in (p / 'eventos').read_text().splitlines()]
                self.assertEqual([e['evento'] for e in eventos], ['inicio','fim','inicio','fim'])
                self.assertFalse((p / 'lock').exists())
                print(json.dumps({'dupla':dupla,'segundos':time.monotonic()-inicio,'sem_espera':eventos[1]['hora']-eventos[0]['hora'], 'intervalo':eventos[2]['hora']-eventos[1]['hora']}))

    def test_tranca_viva_nao_caduca(self):
        sys.path.insert(0, str(GUIOES))
        from tranca import expirar
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'lock'; p.write_text(f'pid={os.getpid()} ensaio')
            os.utime(p,(time.time()-2500,time.time()-2500))
            expirar(p)
            self.assertTrue(p.exists())


if __name__ == '__main__':
    unittest.main()
