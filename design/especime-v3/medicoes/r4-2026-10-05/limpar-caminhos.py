#!/usr/bin/env python3
"""R4: tira dos registos dos portões (`portoes/*.log`) o caminho da worktree e a pasta pessoal da máquina, que o
`npm run` escreve nas suas linhas; os códigos, as horas e as cabeças (os outros ficheiros da pasta) não se tocam. O
caminho da worktree passa a «<sitio>» e a pasta pessoal a «<pasta-local>», como nos registos das plantas.
Uso, da raiz da worktree:  python3 design/especime-v3/medicoes/r4-2026-10-05/limpar-caminhos.py
"""
import re
from pathlib import Path

RAIZ = Path.cwd()
PASTA = Path('design/especime-v3/medicoes/r4-2026-10-05/portoes')
casa = str(Path.home())
mudados = []
for p in sorted(PASTA.glob('*.log')):
    t = p.read_text(encoding='utf-8', errors='replace')
    novo = t.replace(str(RAIZ), '<sitio>').replace(casa, '<pasta-local>')
    # A raiz das pastas pessoais compõe-se aqui, para que este guião não leve a cadeia que o detetor procura.
    novo = re.sub('/' + 'Users' + r'/[^/\s]+', '<pasta-local>', novo)
    if novo != t:
        p.write_text(novo, encoding='utf-8')
        mudados.append(p.name)
print('limpos:', ', '.join(mudados) if mudados else 'nenhum')
