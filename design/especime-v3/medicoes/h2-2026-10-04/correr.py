#!/usr/bin/env python3
"""Corre uma conferência isolada, conserva código, duração e registo sem caminhos locais.
Uso: python3 <este guião> <nome> <comando> [argumentos...]."""
import datetime, json, os, pathlib, re, subprocess, sys, time
pasta = pathlib.Path(__file__).resolve().parent
nome, *comando = sys.argv[1:]
def limpar(s):
    for valor, marca in [(os.getcwd(), '<sitio>'), (str(pathlib.Path.home()), '<pasta-local>')]:
        s = s.replace(valor, marca)
    return re.sub(r'/(?:Users|home)/[^/\s]+', '<pasta-local>', s)
inicio = datetime.datetime.now(datetime.timezone.utc).isoformat()
t0 = time.monotonic()
r = subprocess.run(comando, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
(pasta / f'{nome}.log').write_text(limpar(r.stdout.decode('utf-8', errors='replace')))
(pasta / f'{nome}.codigo').write_text(str(r.returncode) + '\n')
registo = dict(comando=limpar(' '.join(comando)), codigo=r.returncode, inicio=inicio,
               segundos=round(time.monotonic()-t0, 3), cabeca=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip())
(pasta / f'{nome}.json').write_text(json.dumps(registo, ensure_ascii=False, indent=2)+'\n')
print(f'{nome}: código {r.returncode}, {registo["segundos"]} s', flush=True)
sys.exit(r.returncode)
