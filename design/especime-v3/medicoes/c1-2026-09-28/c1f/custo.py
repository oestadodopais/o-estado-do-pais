"""Lê o custo exposto da C1f até ao instante registado, sem estimar um preço."""
import argparse
from datetime import datetime,timezone
import json
from pathlib import Path
AQUI=Path(__file__).resolve().parent
ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--sessao',required=True);args=ap.parse_args()
ficheiros=list((Path.home()/'.codex/sessions/2026/09/28').glob(f'*{args.sessao}.jsonl'));assert len(ficheiros)==1
campos=('input_tokens','cached_input_tokens','cache_write_input_tokens','output_tokens','reasoning_output_tokens','total_tokens')
ultimo=None;antes=None;pedido=None
for linha in ficheiros[0].open():
    try:e=json.loads(linha)
    except ValueError:
        if linha.endswith('\n'):raise
        continue
    p=e.get('payload',{})
    if e.get('type')=='response_item' and p.get('role')=='user':
        texto=' '.join(c.get('text','') for c in p.get('content',[]) if isinstance(c,dict))
        if texto.startswith('A decisão do lugar de direção sobre a paragem da C1e (28.09.2026):'):
            assert antes is None and ultimo;antes=ultimo;pedido=e['timestamp']
    if e.get('type')=='event_msg' and p.get('type')=='token_count':
        uso=(p.get('info') or {}).get('total_token_usage')
        if uso:ultimo={'hora':e['timestamp'],'cumulativos':{k:uso.get(k,0) for k in campos}}
assert antes and ultimo
custo={k:ultimo['cumulativos'][k]-antes['cumulativos'][k] for k in campos};assert all(v>=0 for v in custo.values())
r={'sessao':args.sessao,'pedido':pedido,'registado_em':datetime.now(timezone.utc).isoformat(),'antes':antes,'ultima_leitura':ultimo,'c1f':custo,'unidade':'tokens expostos pelo runtime','limites':['Entrada em cache incluída na entrada; raciocínio incluído na saída. Não somados duas vezes.','Sem preço exposto. Não inclui revisões automáticas nem o fecho posterior a esta leitura. Sem subagentes.']}
(AQUI/'custo.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(custo))
