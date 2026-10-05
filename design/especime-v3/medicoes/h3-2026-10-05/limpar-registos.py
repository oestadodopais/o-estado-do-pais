#!/usr/bin/env python3
"""H3: troca os caminhos da máquina dos registos desta pasta por marcas, antes de os guardar na prova pública.

A forma é a do H2 (`design/especime-v3/medicoes/h2-2026-10-04/limpar-registos.py`): a raiz da worktree passa a
`<worktree>`, a pasta pessoal a `<pasta-local>`, o nome da conta a `<utilizador-local>`, as pastas temporárias do
sistema a `<temporario>`. Lê os `.log`, os `.txt`, os `.erros`, os `.estado` e os `.json` (os registos que as corridas
escrevem), e não toca em códigos, datas, resumos nem no texto dos diagnósticos. Escreve `registos-limpos.json` com os
ficheiros que mudou. Uso, da raiz da worktree: python3 design/especime-v3/medicoes/h3-2026-10-05/limpar-registos.py
"""
import json
import re
from pathlib import Path

pasta = Path(__file__).resolve().parent
raiz = Path.cwd()
casa = Path.home()
raizes = [(str(raiz), '<worktree>'), (str(casa), '<pasta-local>')]
mudados = []
for f in sorted(pasta.rglob('*')):
    if not f.is_file() or f.suffix not in {'.log', '.txt', '.erros', '.estado', '.json'} or f.name == 'registos-limpos.json':
        continue
    antes = f.read_text(encoding='utf-8', errors='surrogateescape')
    depois = antes
    for valor, marca in raizes:
        depois = depois.replace(valor, marca)
    if len(casa.name) >= 6:
        depois = depois.replace(casa.name, '<utilizador-local>')
    depois = re.sub(r'/(?:Users|home)/[^/\s"\']+', '<pasta-local>', depois)
    # as duas pastas temporárias escrevem-se aos pedaços, para este guião não levar, ele próprio, um caminho da máquina
    depois = re.sub(r'(?:/private)?' + '/' + r'var/folders/[^\s"\'<>]+', '<temporario>', depois)
    depois = re.sub(r'(?:/private)?' + '/' + r'tmp/claude-[^\s"\'<>]+', '<temporario>', depois)
    if depois != antes:
        f.write_text(depois, encoding='utf-8', errors='surrogateescape')
        mudados.append(str(f.relative_to(pasta)))
saida = {'comando': 'python3 design/especime-v3/medicoes/h3-2026-10-05/limpar-registos.py', 'registos': mudados}
(pasta / 'registos-limpos.json').write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'H3: {len(mudados)} registo(s) com caminhos trocados por marcas.')
