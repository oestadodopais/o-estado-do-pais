#!/usr/bin/env python3
"""R4: nenhum ficheiro desta pasta nem da pasta das capturas leva um caminho da máquina ou o nome do utilizador dela.

O detetor é o da C1 (`design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py`, `tem_caminho`), o mesmo que o
`check:privacidade` corre sobre `dist/` e `api/`, que não lê estas pastas. Corre sobre os bytes de cada ficheiro,
imagens incluídas. O conhecido-positivo corre primeiro, em memória: uma cópia do relatório com a pasta pessoal da
máquina no fim, e outra com o nome da conta, compostas aqui a partir de `Path.home()`; nenhuma das duas cadeias vai para
o resultado. O resultado diz quantos ficheiros leu e quais apontou, pelo nome relativo à raiz da worktree.
Uso, da raiz da worktree:  python3 design/especime-v3/medicoes/r4-2026-10-05/varrer-caminhos.py
Sai com 0 quando o conhecido-positivo foi encontrado e nenhum ficheiro foi apontado; 1 quando há ficheiros apontados;
2 quando o conhecido-positivo não foi encontrado (e então o zero não vale).
"""
import importlib.util
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
RAIZ = Path.cwd()
PASTA = Path('design/especime-v3/medicoes/r4-2026-10-05')
CAPTURAS = Path('design/especime-v3/capturas/r4-2026-10-05')
spec = importlib.util.spec_from_file_location('detetor_c1', RAIZ / 'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py')
detetor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(detetor)

relatorio = (PASTA / 'LEIA-ME.md').read_bytes()
casa = Path.home()
nome = casa.name
pessoal = len(nome) >= 6 and nome.lower() not in detetor.CONTAS_GENERICAS
positivos = [
    {'o_que': 'o relatório com a pasta pessoal da máquina no fim', 'encontrado': detetor.tem_caminho(relatorio + b'\n' + str(casa).encode() + b'/x\n')},
    {'o_que': 'o relatório com o nome da conta da máquina no fim', 'esperado': 'detetar' if pessoal else 'conta genérica ou curta',
     'encontrado': detetor.tem_caminho(relatorio + b'\n' + nome.encode() + b'\n') == pessoal},
]
ficheiros = sorted(p for pasta in (PASTA, CAPTURAS) for p in pasta.rglob('*') if p.is_file() and p.name != 'caminhos-da-maquina.json')
apontados = [str(p) for p in ficheiros if detetor.tem_caminho(p.read_bytes())]
saida = {
    'guiao': str(PASTA / 'varrer-caminhos.py'),
    'detetor': 'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py, tem_caminho',
    'pastas': [str(PASTA), str(CAPTURAS)],
    'ficheiros_lidos': len(ficheiros),
    'imagens_lidas': sum(1 for p in ficheiros if p.suffix == '.png'),
    'ficheiros_apontados': apontados,
    'quantidade_apontada': len(apontados),
    'conhecido_positivo': positivos,
}
corpo = json.dumps(saida, ensure_ascii=False, indent=2) + '\n'
# O próprio resultado passa pelo mesmo detetor antes de ser escrito.
saida['o_proprio_resultado_limpo'] = not detetor.tem_caminho(corpo.encode())
corpo = json.dumps(saida, ensure_ascii=False, indent=2) + '\n'
(PASTA / 'caminhos-da-maquina.json').write_text(corpo, encoding='utf-8')
print(f"R4 caminhos: {len(ficheiros)} ficheiro(s) lido(s), {len(apontados)} apontado(s); conhecido-positivo "
      f"{'encontrado' if all(p['encontrado'] for p in positivos) else 'NÃO encontrado'}; o resultado limpo: {saida['o_proprio_resultado_limpo']}.")
for a in apontados:
    print(f'  apontado: {a}')
if not all(p['encontrado'] for p in positivos):
    raise SystemExit(2)
raise SystemExit(1 if apontados or not saida['o_proprio_resultado_limpo'] else 0)
