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
    # O ensaio só pode executar o motor sintético que cria abaixo. A opção da
    # corrida exterior não pode levá-lo ao motor real, mesmo com o build falso.
    ambiente = {k: v for k, v in os.environ.items()
                if k not in ('OEDP_CONFERIR_MOTOR', 'RESEARCHHUB_DIR')}
    # A tranca real vive em /tmp desde 13.10.2026 (M79); o ensaio aponta-a para a sua pasta «comum» para não
    # tocar na tranca da máquina e para provar a recusa da escrita numa pasta inexistente.
    env = dict(ambiente, PATH=str(binario) + ':' + os.environ['PATH'], COMUM=str(comum), CHAMADAS=str(p / 'chamadas'),
               OEDP_TRANCA=str(comum / 'oedp-construcao.lock'))
    def correr(nome, **mudancas):
        return subprocess.run(['sh', str(RAIZ / 'scripts/leituras/portoes.sh'), str(p), nome],
                              env={**env, **mudancas}, capture_output=True, text=True)
    comando('git', 'case "$*" in *status*) [ "${ARVORE_SUJA:-0}" = 0 ] || echo " M ficheiro";; *--git-common-dir*) echo "$COMUM";; *HEAD*) echo cabeca-sintetica;; esac\n')
    r = correr('suja', ARVORE_SUJA='1')
    assert r.returncode == 9 and 'árvore suja' in r.stderr
    assert not (p / 'suja/build.codigo').exists() and not (comum / 'oedp-construcao.lock').exists()
    casos.append({'planta': 'árvore suja recusada antes da tranca e dos portões', 'codigo': r.returncode, 'mensagem': r.stderr.strip()})
    for nome, conteudo, esperado in [('v2d', {'perfil': 'v2d'}, 1), ('v2c', {'perfil': 'v2c'}, 1), ('perfil-invalido', {'perfil': 'outro'}, 9)]:
        (p / nome).mkdir()
        (p / nome / 'selecao.json').write_text(json.dumps(conteudo))
        r = correr(nome)
        assert r.returncode == esperado
        assert not (p / nome / 'verify.codigo').exists()
        assert not (p / nome / 'motor.codigo').exists()
        if nome in ('v2c', 'v2d'):
            assert (p / nome / 'build.codigo').read_text().strip() == '7'
            assert (p / nome / 'check:discussao.codigo').read_text().strip() == '125'
        casos.append({'planta': nome, 'codigo': r.returncode})
    comando('npm', 'echo "$*" >> "$CHAMADAS"\n')
    (p / 'v2c-verde').mkdir()
    (p / 'v2c-verde/selecao.json').write_text(json.dumps({'perfil': 'v2c'}))
    r = correr('v2c-verde')
    assert r.returncode == 0
    nomes = {f.stem for f in (p / 'v2c-verde').glob('*.codigo')}
    assert nomes == {'build','check:discussao','check:navegacao','check:primeira','check:cabeca','gate:html','check:alvos','check:css','check:frases-compostas','check:lugar'}
    assert all(f.read_text().strip() == '0' for f in (p / 'v2c-verde').glob('*.codigo'))
    casos.append({'planta': 'seleção verde exata sem motor', 'codigo': r.returncode})
    (p / 'v2d-verde').mkdir()
    (p / 'v2d-verde/selecao.json').write_text(json.dumps({'perfil': 'v2d'}))
    r = correr('v2d-verde')
    assert r.returncode == 0
    nomes = {f.stem for f in (p / 'v2d-verde').glob('*.codigo')}
    assert nomes == {'build','check:discussao','check:palavras','check:frases-compostas','gate:html','check:alvos','check:css','check:lugar','check:series','typecheck'}
    assert all(f.read_text().strip() == '0' for f in (p / 'v2d-verde').glob('*.codigo'))
    casos.append({'planta': 'seleção V2-d exata', 'codigo': r.returncode})
    comando('npm', 'echo "$PWD é a pasta de ensaio"\necho "$*" >> "$CHAMADAS"\n[ "$2" != build ] || exit 7\n')
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
    r = correr('sem-tranca', OEDP_TRANCA=str(p / 'pasta-inexistente' / 'oedp-construcao.lock'))
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
    motor = p / 'motor'; (motor / 'core').mkdir(parents=True)
    (motor / 'core/__init__.py').write_text('')
    (motor / 'core/gate.py').write_text('print("motor de ensaio conferido")\n')
    comando('npm', 'exit 0\n')
    r = correr('com-motor', OEDP_CONFERIR_MOTOR='1', RESEARCHHUB_DIR=str(motor))
    assert r.returncode == 0, r.stderr
    assert (p / 'com-motor/motor.codigo').read_text().strip() == '0'
    assert 'motor de ensaio conferido' in (p / 'com-motor/motor.log').read_text()
    assert not tranca.exists()
    casos.append({'planta': 'motor exercido sob a tranca comum', 'codigo': r.returncode, 'mensagem': 'Motor e sítio conferidos antes de soltar a tranca.'})
saida = {'ok': True, 'casos': casos}
if '--json' in sys.argv:
    Path(sys.argv[sys.argv.index('--json') + 1]).write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
