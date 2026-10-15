#!/usr/bin/env python3
"""Os blocos do Método construído, como a régua da voz os lê, nas duas edições.

O Método é uma rota isenta (`ROTAS_QUE_PROVAM_A_RENDICAO` em `scripts/medir-defeitos.mjs`): a medição junta os
seus blocos ao conjunto que prova que uma linha viva se rende, pela medida 8 (`frasesDaCasa`), pela varredura da
voz (`frasesDaVoz`) e pelas dicas (`dicasDaCasa`), e não os imprime. Este guião escreve uma cópia temporária da
medição, ao lado da original para que os caminhos relativos resolvam, com um gancho que guarda esses três
conjuntos só para o Método, corre-a sobre o `dist/` que existe, apaga a cópia e escreve `blocos-do-metodo.json`.
A original não muda um byte.

uso: python3 blocos-do-metodo.py <raiz do sítio> <saída.json>"""
import json, pathlib, subprocess, sys

RAIZ = pathlib.Path(sys.argv[1]).resolve()
SAIDA = pathlib.Path(sys.argv[2])
original = (RAIZ / 'scripts/medir-defeitos.mjs').read_text(encoding='utf-8')
gancho = "  if (rota && ROTAS_QUE_PROVAM_A_RENDICAO.has(rota.key)) {\n"
saida = "        ...medicao,\n"
assert original.count(gancho) == 1 and original.count(saida) == 1, 'a medição mudou de forma: o gancho não tem onde entrar'
copia = original.replace(gancho, gancho + "    if (rota.key === 'metodo') { globalThis.__metodo ??= {}; globalThis.__metodo[caminho || '/'] = "
                         "{ casa: frasesDaCasa(root, rota.key), voz: frasesDaVoz(root), dicas: dicasDaCasa(root) }; }\n")
copia = copia.replace(saida, "        metodo_isento: globalThis.__metodo,\n" + saida)
temporaria = RAIZ / 'scripts/_medir-defeitos-blocos-do-metodo.mjs'
temporaria.write_text(copia, encoding='utf-8')
try:
    r = subprocess.run(['node', str(temporaria), '--json'], cwd=RAIZ, capture_output=True, text=True)
finally:
    temporaria.unlink()
if r.returncode != 0:
    raise SystemExit(f'a medição saiu com {r.returncode}: {r.stderr[-400:]}')
blocos = json.loads(r.stdout)['metodo_isento']
assert set(blocos) == {'/metodo', '/en/method'}, sorted(blocos)
SAIDA.write_text(json.dumps(blocos, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(json.dumps({k: {x: len(y) for x, y in v.items()} for k, v in blocos.items()}, ensure_ascii=False))
