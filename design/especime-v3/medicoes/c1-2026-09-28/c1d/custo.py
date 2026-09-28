"""Separa o custo da paragem, da retoma C1c e da passagem C1d."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
AQUI=Path(__file__).resolve().parent
CAMPOS=('input_tokens','cached_input_tokens','cache_write_input_tokens','output_tokens','reasoning_output_tokens','total_tokens')
FRONTEIRAS={'retoma_c1c':'A decisão do lugar de direção sobre a paragem da DGAL (28.09.2026):', 'c1d':'A segunda leitura a frio do C1 (a passagem C1c), pelo Claude Opus 5.5,'}
ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--sessao',required=True);args=ap.parse_args()
ps=list((Path.home()/'.codex/sessions/2026/09/28').glob(f'*{args.sessao}.jsonl'));assert len(ps)==1
ultimo=None;antes={};modelos=set();meta=None
for linha in ps[0].open():
    try:e=json.loads(linha)
    except ValueError:
        if linha.endswith('\n'):raise
        continue
    p=e.get('payload',{})
    if e.get('type')=='session_meta':meta={'id':p['id'],'inicio':e['timestamp']}
    if e.get('type')=='turn_context' and p.get('model'):modelos.add(p['model'])
    if e.get('type')=='response_item' and p.get('role')=='user':
        texto=' '.join(c.get('text','') for c in p.get('content',[]) if isinstance(c,dict))
        for chave,prefixo in FRONTEIRAS.items():
            if texto.startswith(prefixo):
                assert ultimo and chave not in antes
                antes[chave]={'pedido':e['timestamp'],'cumulativo_anterior':ultimo}
    if e.get('type')=='event_msg' and p.get('type')=='token_count':
        uso=(p.get('info') or {}).get('total_token_usage')
        if uso:ultimo={'hora':e['timestamp'],'cumulativos':{k:uso[k] for k in CAMPOS}}
assert meta and ultimo and set(antes)==set(FRONTEIRAS)
def diferenca(de,ate):
    r={k:ate['cumulativos'][k]-de['cumulativos'][k] for k in CAMPOS};assert all(v>=0 for v in r.values());return r
r={'sessao':meta,'registado_em':datetime.now(timezone.utc).isoformat(),'modelos_expostos':sorted(modelos),'fronteiras':antes,'ultima_leitura':ultimo,
   'passagem_c1c_ate_paragem':{'simbolos':677285,'origem':'Registo do lançamento, declarado pelo lugar de direção no mandato C1d. Não é uma conversão dos tokens do runtime.'},
   'retoma_c1c':diferenca(antes['retoma_c1c']['cumulativo_anterior'],antes['c1d']['cumulativo_anterior']),
   'passagem_c1d':diferenca(antes['c1d']['cumulativo_anterior'],ultimo),
   'unidade_retoma_e_c1d':'tokens expostos pelo runtime',
   'limites':['Entrada em cache incluída na entrada; raciocínio incluído na saída. Não somados duas vezes.','Preço não exposto. Não inclui revisões automáticas. Sem agentes na C1d.','A leitura termina na hora indicada; o fecho posterior ainda consome.']}
(AQUI/'custo.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'retoma_c1c':r['retoma_c1c'],'passagem_c1d':r['passagem_c1d']},ensure_ascii=False))
