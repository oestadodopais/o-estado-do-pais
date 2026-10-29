#!/usr/bin/env python3
"""Os marcadores da voz (design/especime-v3/VOZ-MARCADORES.md) sobre as frases de um mandato, antes de lançar (a lição de 29.10.2026:
a OG1-B4 parou em check:voz por «a página» como sujeito, escrito pelo lugar de direção). Lê a tabela dos marcadores (as linhas
«| raiz | … |» e «| palavra | … |»), tira do mandato as frases entre « e » e diz que marcador cada frase aciona.
uso: voz-do-mandato.py <worktree do sítio> <mandato.md> [<mandato.md>...]"""
import re, sys
from pathlib import Path
W = Path(sys.argv[1]); tabela = (W / 'design/especime-v3/VOZ-MARCADORES.md').read_text(encoding='utf-8')
marcadores = []
for linha in tabela.splitlines():
    m = re.match(r'^\|\s*(raiz|palavra)\s*\|\s*([^|]+?)\s*\|', linha)
    if m: marcadores.append((m.group(1), m.group(2)))
if not marcadores: sys.exit('nenhum marcador lido da tabela')
total = 0
for caminho in sys.argv[2:]:
    texto = Path(caminho).read_text(encoding='utf-8')
    # cada linha do mandato que traz aspas angulares é uma frase do leitor ou a sua explicação: mede-se a linha inteira (as frases do §3 têm aspas dentro de aspas)
    frases = [l for l in texto.splitlines() if '«' in l and len(l) >= 20]
    achados = []
    for f in frases:
        baixo = f.lower()
        for tipo, marca in marcadores:
            marca_baixa = marca.lower()
            if tipo == 'raiz':
                bate = marca_baixa in baixo
            else:
                bate = re.search(r'(?<![\wÀ-ÿ])' + re.escape(marca_baixa) + r'(?![\wÀ-ÿ])', baixo) is not None
            if bate: achados.append((tipo, marca, f[:110]))
    print(f'{Path(caminho).name}: {len(frases)} linhas com aspas, {len(achados)} marcador(es) acionado(s)')
    for tipo, marca, f in achados: print(f'  [{tipo}] «{marca}» em: «{f}…»')
    total += len(achados)
sys.exit(1 if total else 0)
