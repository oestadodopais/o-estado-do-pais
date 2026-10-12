#!/usr/bin/env python3
"""Regista um comando, a cabeça, as horas e o código, sem caminhos da máquina."""
import datetime
import os
import re
import subprocess
import sys
from pathlib import Path

AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[3]
MOTOR=Path(os.environ.get('RP1_MOTOR',str(Path.home()/'Instruments/ResearchHub/.worktrees/rp1-2026-09-26')))

def publico(s):
    s=s.replace(str(RAIZ),'<worktree do sítio>')
    s=s.replace(str(Path.home()/'Instruments/ResearchHub'),'~/Instruments/ResearchHub')
    s=re.sub(r'/private/tmp/claude-501/[^\s"<>`]+','<scratchpad da sessão>',s)
    prefixo=str(Path.home().parent)+'/'
    s=re.sub(re.escape(prefixo)+r'[^\s"<>`]+','<caminho local omitido>',s)
    return re.sub(re.escape(Path.home().name),'<utilizador local>',s,flags=re.I)

def main():
    args=sys.argv[1:]; motor=args[0]=='--motor'
    if motor: args.pop(0)
    nome=args.pop(0); cwd=MOTOR if motor else RAIZ
    p=AQUI/nome; p.parent.mkdir(parents=True,exist_ok=True)
    agora=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
    cabeca=subprocess.check_output(['git','rev-parse','HEAD'],cwd=cwd,text=True).strip()
    for extensao,valor in [('cabeca',cabeca),('inicio',agora())]:
        Path(str(p)+'.'+extensao).write_text(valor+'\n')
    Path(str(p)+'.codigo').unlink(missing_ok=True)
    with Path(str(p)+'.log').open('w') as log:
        processo=subprocess.Popen(args,cwd=cwd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
        for linha in processo.stdout:
            log.write(publico(linha)); log.flush()
        codigo=processo.wait()
    Path(str(p)+'.fim').write_text(agora()+'\n')
    Path(str(p)+'.codigo').write_text(str(codigo)+'\n')
    print(f'{nome}: código {codigo}; cabeça {cabeca}')
    return codigo

if __name__=='__main__':raise SystemExit(main())
