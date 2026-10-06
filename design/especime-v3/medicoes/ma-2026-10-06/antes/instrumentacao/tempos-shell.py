#!/usr/bin/env python3
"""Observa os passos reais do npm sem mudar a ordem nem a paragem no primeiro erro.

Uso interno: npm_config_script_shell=<este ficheiro>. Recebe os argumentos da
shell do npm. Só decompõe as duas cadeias declaradas em passos unidos por &&;
os restantes comandos chegam inteiros à shell. Os tempos vão para ficheiros
independentes e são reunidos por tempos.mjs, incluindo os passos interrompidos.
"""
import datetime
import json
import os
from pathlib import Path
import shlex
import signal
import subprocess
import sys
import time
import uuid


def agora():
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='milliseconds')


def main():
    argumentos = sys.argv[1:]
    evento = os.environ.get('npm_lifecycle_event', '')
    pasta = os.environ.get('OEDP_TEMPOS_DIR')
    if not pasta or len(argumentos) != 2 or argumentos[0] != '-c':
        os.execv('/bin/sh', ['/bin/sh', *argumentos])
    if evento == 'check:alvos':
        argumentos[1] += ' --json ' + shlex.quote(str(Path(pasta) / 'alvos.json'))
    cadeia = os.environ.get('OEDP_CADEIA', evento)
    # Os scripts internos do npm ficam dentro do passo que os chamou. Assim
    # conta-se cada conferência uma vez, e mede-se também o astro sem npm.
    decompor = evento in ('build', 'verify')
    if os.environ.get('OEDP_TEMPOS_PASSO') and not decompor:
        os.execv('/bin/sh', ['/bin/sh', *argumentos])
    inicio_cadeia, relogio_cadeia = agora(), time.monotonic()
    comandos = argumentos[1].split(' && ') if decompor else [argumentos[1]]
    for comando in comandos:
        inicio, relogio = agora(), time.monotonic()
        ambiente = dict(os.environ, OEDP_TEMPOS_PASSO='1', OEDP_CADEIA=cadeia)
        filho = subprocess.Popen(['/bin/sh', '-c', comando], env=ambiente)
        for s in (signal.SIGINT, signal.SIGTERM):
            signal.signal(s, lambda sig, frame: filho.send_signal(sig))
        codigo = filho.wait()
        codigo = codigo if codigo >= 0 else 128 - codigo
        dir_tempos = Path(pasta) / '.tempos'
        dir_tempos.mkdir(parents=True, exist_ok=True)
        passo = comando if decompor else 'npm run ' + evento
        (dir_tempos / (str(uuid.uuid4()) + '.json')).write_text(json.dumps({
            'passo': passo, 'cadeia': cadeia, 'inicio': inicio, 'fim': agora(),
            'segundos': time.monotonic() - relogio, 'codigo': codigo,
        }) + '\n')
        if codigo:
            break
    if decompor:
        (dir_tempos / (str(uuid.uuid4()) + '.json')).write_text(json.dumps({
            'passo': 'cadeia:' + evento, 'cadeia': cadeia, 'inicio': inicio_cadeia, 'fim': agora(),
            'segundos': time.monotonic() - relogio_cadeia, 'codigo': codigo,
        }) + '\n')
    return codigo


if __name__ == '__main__':
    raise SystemExit(main())
