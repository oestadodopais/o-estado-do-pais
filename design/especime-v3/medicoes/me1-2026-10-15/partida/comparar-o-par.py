#!/usr/bin/env python3
"""O §0 do mandato repetido pelo construtor: as medidas do lugar de direção contra as do construtor, campo a campo.

`../medidas-mandato.json` é a corrida do lugar de direção (02:52 UTC de 15.10.2026); `medidas-mandato-do-construtor.json`
é a do construtor, com o mesmo guião (`../medir-mandato.py`, o mesmo sha256) corrido sobre a worktree de partida
(`61919ee1`, que é `4b50b92e` com os ficheiros do mandato) às 03:20 UTC, antes de mudar um ficheiro. A hora da medição
não se compara; tudo o resto compara-se inteiro. Escreve `comparacao.json` ao lado.

uso: python3 comparar-o-par.py"""
import json, pathlib

AQUI = pathlib.Path(__file__).resolve().parent
d = json.loads((AQUI.parent / 'medidas-mandato.json').read_text(encoding='utf-8'))
c = json.loads((AQUI / 'medidas-mandato-do-construtor.json').read_text(encoding='utf-8'))
chaves = sorted(set(d['medidas']) | set(c['medidas']))
divergentes = [k for k in chaves if d['medidas'].get(k) != c['medidas'].get(k)]
# conhecido-positivo: a mesma comparação, com um valor mudado numa cópia, tem de achar uma divergência
copia = json.loads(json.dumps(c)); copia['medidas']['linhas_do_livro']['valor'] += 1
positivo = [k for k in chaves if d['medidas'].get(k) != copia['medidas'].get(k)] == ['linhas_do_livro']
saida = {'diretor_medido_em': d['medido_em'], 'construtor_medido_em': c['medido_em'], 'medidas_comparadas': len(chaves),
         'divergentes': divergentes, 'conhecido_positivo': {'o_que': 'uma cópia com linhas_do_livro mais um diverge só nessa medida', 'encontrado': positivo},
         'comando': 'python3 design/especime-v3/medicoes/me1-2026-10-15/partida/comparar-o-par.py'}
(AQUI / 'comparacao.json').write_text(json.dumps(saida, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(json.dumps(saida, ensure_ascii=False))
