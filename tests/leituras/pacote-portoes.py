#!/usr/bin/env python3
"""Prova que as citações chegam e que um registo inteiro não atravessa o pacote.

Uso: python3 tests/leituras/pacote-portoes.py [--json ficheiro]. Só usa Git e
ficheiros de ensaio numa pasta temporária; não lê nem escreve o motor real.
"""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import os
from unittest.mock import patch

RAIZ = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('pacote', RAIZ/'scripts/leituras/pacote.py')
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
casos = []
with tempfile.TemporaryDirectory(prefix='oedp-ma-pacote-') as tmp:
    tmp = Path(tmp); repo = tmp/'repo'; repo.mkdir()
    def git(*args):
        return subprocess.check_output(['git', '-C', str(repo), *args], stderr=subprocess.PIPE).decode().strip()
    def guardar(f, texto):
        p = repo/f; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(texto)
    def commit():
        fs = git('ls-files','-z','--others','--modified','--exclude-standard').strip('\0').split('\0')
        git('add','--',*fs)
        git('-c','user.name=Ensaio','-c','user.email=ensaio@example.invalid','commit','-qm','Ensaio sintético')
        return git('rev-parse','HEAD')
    git('init','-q'); guardar('base','base'); base = commit()
    guardar('brief.md','# Ensaio\n'); guardar('med/relatorio.md','# Ensaio\n<!-- portao: portoes/verify.log | npm run check:series · -->\n')
    guardar('med/portoes/verify.log','✓ npm run check:series · verde\n✓ npm run check:series · segunda linha\nREGISTO INTEIRO NÃO CITADO\n')
    for g in ['build','verify','typecheck']: guardar(f'med/portoes/{g}.codigo','0\n')
    guardar('med/portoes/tempos.json','{"segundos": 1}\n')
    head = commit(); nums = tmp/'numeros'; nums.write_text('conferência sintética\n')
    env = {**os.environ, 'PACOTE_EXTRA':'med/portoes'}
    for k in ['PACOTE_MOTOR','PACOTE_RETIRA']: env.pop(k,None)
    def montar(dest):
        return subprocess.run([sys.executable,str(RAIZ/'scripts/leituras/pacote.py'),str(repo),base,head,str(dest),str(repo/'brief.md'),str(repo/'med/relatorio.md'),str(nums)],env=env,capture_output=True,text=True)
    dest = tmp/'pacote'; r = montar(dest); assert r.returncode == 0, r.stderr
    f = 'med/portoes/verify.log'; corpo = '✓ npm run check:series · verde\n✓ npm run check:series · segunda linha\n'.encode()
    assert (dest/f).read_bytes() == corpo
    assert 'REGISTO INTEIRO' not in (dest/'diff.patch').read_text()
    assert all((dest/f'med/portoes/{g}.codigo').read_text()=='0\n' for g in ['build','verify','typecheck'])
    assert (dest/'med/portoes/tempos.json').is_file()
    casos.append({'planta':'controlo com PACOTE_EXTRA', 'mensagem':'Só as linhas citadas, os três códigos e os tempos chegaram.', 'passou':True})
    escrever_bytes = Path.write_bytes
    def perder_linha(alvo, dados):
        if alvo.as_posix().endswith(f):
            dados = b'\n'.join(dados.splitlines()[1:]) + b'\n'
        return escrever_bytes(alvo, dados)
    argumentos = ['pacote.py', str(repo), base, head, str(tmp/'linha-retirada'),
                  str(repo/'brief.md'), str(repo/'med/relatorio.md'), str(nums)]
    # A falha é injetada na escrita; a conferência só é chamada pelo fluxo normal.
    with patch.dict(os.environ, env, clear=True), patch.object(sys, 'argv', argumentos), patch.object(Path, 'write_bytes', perder_linha):
        try:
            mod.principal()
        except ValueError as e:
            assert 'faltam as linhas citadas de med/portoes/verify.log' in str(e)
            casos.append({'planta':'linha retirada durante a montagem normal', 'mensagem':str(e), 'passou':True})
        else:
            raise AssertionError('a citação em falta não fechou a montagem normal')
    guardar('med/relatorio.md','# Ensaio\n<!-- portao: portoes/verify.log | npm run check:ausente · -->\n'); head = commit()
    r = montar(tmp/'recusado'); assert r.returncode != 0 and not (tmp/'recusado').exists()
    mensagem = next(l.removeprefix('ValueError: ') for l in r.stderr.splitlines() if l.startswith('ValueError:'))
    assert 'não existe uma linha' in mensagem
    casos.append({'planta':'citação sem linha de origem','mensagem':mensagem,'passou':True})
saida = {'ok':True,'casos':casos}
if '--json' in sys.argv: Path(sys.argv[sys.argv.index('--json')+1]).write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(saida,ensure_ascii=False,indent=2))
