#!/usr/bin/env python3
"""Exerce a tranca e a recusa do build vermelho com comandos locais substituídos.
Não constrói nem publica. Uso: python3 tests/leituras/portoes.py [--json ficheiro].
"""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time

RAIZ = Path(__file__).resolve().parents[2]
casos = []
with tempfile.TemporaryDirectory(prefix='oedp-portoes-') as tmp:
    p = Path(tmp)
    (p / 'scripts/leituras').mkdir(parents=True)
    for f in ('limpar-caminhos.py', 'processo.py', 'tranca.py'):
        (p / 'scripts/leituras' / f).symlink_to(RAIZ / 'scripts/leituras' / f)
    binario = p / 'bin'; binario.mkdir()
    comum = p / 'comum'; comum.mkdir()
    def comando(nome, corpo):
        f = binario / nome; f.write_text('#!/bin/sh\n' + corpo); f.chmod(0o755)
    comando('git', 'case "$*" in *--git-common-dir*) echo "$COMUM";; *HEAD*) echo cabeca-sintetica;; esac\n')
    comando('npm', 'echo "$PWD é a pasta de ensaio"\necho "$*" >> "$CHAMADAS"\n[ "$2" != build ] || exit 7\n')
    comando('node', 'echo "$*" >> "$CHAMADAS"\n')
    env = dict(os.environ, PATH=str(binario) + ':' + os.environ['PATH'], COMUM=str(comum), CHAMADAS=str(p / 'chamadas'))
    def correr(nome, **mudancas):
        return subprocess.run(['sh', str(RAIZ / 'scripts/leituras/portoes.sh'), str(p), nome],
                              env={**env, **mudancas}, capture_output=True, text=True)
    r = correr('vermelho')
    assert r.returncode == 1
    assert 'o build não ficou verde e não pode pagar passos da união' in (p / 'vermelho/verify.log').read_text()
    codigos = {g: int((p / 'vermelho' / (g + '.codigo')).read_text()) for g in ('build', 'verify', 'typecheck')}
    assert codigos == {'build': 7, 'verify': 125, 'typecheck': 0}
    assert 'verify-depois-do-build' not in (p / 'chamadas').read_text()
    assert not (comum / 'oedp-construcao.lock').exists()
    assert '<worktree> é a pasta de ensaio' in (p / 'vermelho/build.log').read_text()
    assert str(p) not in (p / 'vermelho/build.log').read_text()
    casos.append({'planta': 'build vermelho não paga conferências', 'codigo': r.returncode,
                  'codigos': codigos, 'mensagem': (p / 'vermelho/verify.log').read_text().strip()})
    r = correr('sem-tranca', COMUM=str(p / 'pasta-inexistente'))
    assert r.returncode == 9 and not (p / 'sem-tranca/build.codigo').exists()
    assert 'nenhum portão correu' in r.stderr
    casos.append({'planta': 'escrita da tranca recusada', 'codigo': r.returncode, 'mensagem': r.stderr.strip()})
    tranca = comum / 'oedp-construcao.lock'; tranca.write_text('tranca de ensaio\n')
    proc = subprocess.Popen(['sh', str(RAIZ / 'scripts/leituras/portoes.sh'), str(p), 'ocupada'], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    # A mensagem só aparece depois de a criação exclusiva ter sido recusada.
    linha = proc.stderr.readline().strip()
    assert linha == 'à espera da tranca da máquina: tranca de ensaio'
    assert tranca.read_text() == 'tranca de ensaio\n' and not (p / 'ocupada/build.codigo').exists()
    proc.terminate(); proc.communicate(timeout=15)
    assert tranca.read_text() == 'tranca de ensaio\n'
    casos.append({'planta': 'tranca de outra corrida não é substituída nem solta', 'mensagem': linha, 'codigo': proc.returncode})
    os.utime(tranca, (time.time() - 2401, time.time() - 2401))
    r = correr('caducada')
    assert r.returncode == 1 and 'tranca com mais de quarenta minutos' in r.stderr
    assert not tranca.exists()
    casos.append({'planta': 'tranca caducada deixa correr', 'codigo': r.returncode,
                  'mensagem': r.stderr.strip()})
    partes = p / 'restos/.tempos'
    partes.mkdir(parents=True)
    (partes / 'morta.json').write_text('{"passo":"não pode entrar","segundos":999}')
    r = correr('restos')
    assert r.returncode == 9 and 'códigos ou partes .tempos' in r.stderr
    assert not partes.exists() and not (p / 'restos/build.inicio').exists()
    casos.append({'planta': 'partes de corrida morta', 'codigo': r.returncode, 'mensagem': r.stderr.strip()})
    comando('npm', 'echo "$*" >> "$CHAMADAS"\necho $$ > "$PID_FILHO"\ntouch "$TOMADA"\nsleep 30\necho indevido >> "$CHAMADAS"\n')
    tomada = p / 'tomada'
    proc = subprocess.Popen(['sh', str(RAIZ / 'scripts/leituras/portoes.sh'), str(p), 'interrompida'],
                            env={**env, 'TOMADA': str(tomada), 'PID_FILHO': str(p / 'pid-filho')},
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        limite = time.monotonic() + 10
        while not tomada.exists() and time.monotonic() < limite:
            time.sleep(0.02)
        assert tomada.exists() and tranca.exists(), 'o portão não chegou a tomar a tranca'
        proc.terminate()
        _, erro = proc.communicate(timeout=10)
        assert proc.returncode == 130 and not tranca.exists(), erro
        assert 'corrida interrompida; os portões seguintes não correm' in erro
        assert not (p / 'interrompida/verify.codigo').exists()
        assert not (p / 'interrompida/typecheck.codigo').exists()
        assert 'indevido' not in (p / 'chamadas').read_text()
        try:
            os.kill(int((p / 'pid-filho').read_text()), 0)
        except ProcessLookupError:
            pass
        else:
            raise AssertionError('o processo do portão ficou vivo depois de soltar a tranca')
        casos.append({'planta': 'TERM depois de tomar a tranca', 'codigo': proc.returncode,
                      'mensagem': next(l for l in erro.splitlines() if 'corrida interrompida' in l)})
    finally:
        if proc.poll() is None:
            proc.terminate()
            proc.communicate(timeout=10)
saida = {'ok': True, 'casos': casos}
if '--json' in sys.argv:
    Path(sys.argv[sys.argv.index('--json') + 1]).write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
