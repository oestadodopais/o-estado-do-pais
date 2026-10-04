#!/usr/bin/env python3
"""Corre uma conferência isolada, conserva código, duração e registo sem caminhos locais.
Uso: python3 <este guião> <nome> <comando> [argumentos...]."""
import datetime, json, os, pathlib, re, subprocess, sys, time
pasta = pathlib.Path(os.environ.get('OEDP_MEDICOES', pathlib.Path(__file__).resolve().parent))
pasta.mkdir(parents=True, exist_ok=True)
nome, *comando = sys.argv[1:]
def limpar(s):
    s = s.replace(str(pasta), '<provas>')
    for valor, marca in [(os.getcwd(), '<sitio>'), (str(pathlib.Path.home()), '<pasta-local>')]:
        s = s.replace(valor, marca)
    return re.sub(r'/(?:Users|home)/[^/\s]+', '<pasta-local>', s)
inicio = datetime.datetime.now(datetime.timezone.utc).isoformat()
cabeca = subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
estado = subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],text=True)
if os.environ.get('OEDP_EXIGIR_ARVORE_LIMPA') == '1' and estado:
    raise SystemExit('A prova exige uma árvore seguida limpa antes do comando.')
t0 = time.monotonic()
r = subprocess.run(comando, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
estado_fim = subprocess.check_output(['git','status','--porcelain','--untracked-files=no'],text=True)
codigo = r.returncode or (1 if os.environ.get('OEDP_EXIGIR_ARVORE_LIMPA') == '1' and estado_fim else 0)
(pasta / f'{nome}.log').write_text(limpar(r.stdout.decode('utf-8', errors='replace')))
(pasta / f'{nome}.codigo').write_text(str(codigo) + '\n')
registo = dict(comando=limpar(' '.join(comando)), codigo=codigo, inicio=inicio,
               segundos=round(time.monotonic()-t0, 3), cabeca=cabeca, estado=estado, estado_fim=estado_fim)
(pasta / f'{nome}.json').write_text(json.dumps(registo, ensure_ascii=False, indent=2)+'\n')
print(f'{nome}: código {codigo}, {registo["segundos"]} s', flush=True)
sys.exit(codigo)
