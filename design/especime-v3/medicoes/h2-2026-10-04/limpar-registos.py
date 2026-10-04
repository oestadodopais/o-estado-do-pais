#!/usr/bin/env python3
"""Troca caminhos dos logs por marcas antes de os guardar na prova pública.
Não altera códigos, datas, resumos de ficheiros nem texto de diagnósticos.
"""
import json, re
from pathlib import Path
pasta=Path(__file__).resolve().parent
raizes=[(str(Path.cwd()),'<sitio>'),(str(Path.home()),'<pasta-local>')]
mudados=[]
for f in pasta.rglob('*.log'):
    antes=f.read_text()
    depois=antes
    for valor,marca in raizes:depois=depois.replace(valor,marca)
    depois=depois.replace(Path.home().name,'<utilizador-local>')
    depois=re.sub(r'/(?:Users|home)/[^/\s]+','<pasta-local>',depois)
    depois=re.sub(r'(?:/private)?/var/folders/[^\s"\'<>]+','<temporario>',depois)
    depois=re.sub(r'/Library/Developer/CommandLineTools/[^\s"\'<>]+','<ferramenta-do-sistema>',depois)
    if depois!=antes:
        f.write_text(depois)
        mudados.append(str(f.relative_to(pasta)))
saida=dict(comando='python3 design/especime-v3/medicoes/h2-2026-10-04/limpar-registos.py',registos=mudados)
(pasta/'registos-limpos.json').write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
print(f'{len(mudados)} registos com caminhos trocados por marcas.')
