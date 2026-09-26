#!/usr/bin/env python3
"""Lê a contagem de tokens da sessão do construtor, sem estimar um preço."""
import json
from pathlib import Path
AQUI=Path(__file__).resolve().parent
REGISTO=Path.home()/'.codex/sessions/2026/09/26/rollout-2026-09-26T14-50-19-01a0ddfb-28f2-7522-ad5d-af8f210018d8.jsonl'
meta=None; ultimo=None; modelo=None
for linha in REGISTO.open():
    d=json.loads(linha);p=d.get('payload',{})
    if d.get('type')=='session_meta':meta=d
    if d.get('type')=='turn_context' and p.get('model'):modelo=p['model']
    if p.get('type')=='token_count' and p.get('info',{}).get('total_token_usage'):
        ultimo=dict(hora=d['timestamp'],**p['info']['total_token_usage'])
assert meta and ultimo and meta['payload']['cwd']==str(AQUI.parents[3])
resultado=dict(registo=REGISTO.name,inicio=meta['timestamp'],modelo=modelo,**ultimo,euros=None,limite='Contagem cumulativa do registo desta sessão, incluindo entradas em cache; não é uma estimativa de faturação nem inclui sessões separadas de revisão automática.')
(AQUI/'custo.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(resultado,ensure_ascii=False))
