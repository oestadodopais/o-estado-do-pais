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
        for campo in ('runtime', 'handler', 'launcherType', 'regions'):
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
        comandos = []
        def executar(args, **kwargs):
            comandos.append(args)
            if args[:2] == ['vercel', 'build']:
                (self.w / 'dist/index.html').write_text('outra construção')
        with patch.object(pb.subprocess, 'check_output', return_value='c' * 40), patch.object(pb.subprocess, 'run', side_effect=executar):
            pb.preparar(self.w)
        self.assertEqual(comandos, [['vercel', 'pull', '--yes', '--environment=production'], ['vercel', 'build', '--prod']])
        self.assertEqual((self.output / 'static/index.html').read_text(), 'cópia conferida')
        with patch.object(pb.subprocess, 'check_output', return_value='c' * 40), patch.object(pb.subprocess, 'run', side_effect=OSError('ensaio')):
            with self.assertRaises(OSError):
                pb.preparar(self.w)
        self.assertEqual((self.w / 'dist/index.html').read_text(), 'cópia conferida')


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
