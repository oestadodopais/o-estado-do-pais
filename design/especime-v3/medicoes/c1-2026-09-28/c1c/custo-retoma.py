"""Mede a retoma pela diferença entre cumulativos reais da mesma sessão."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
AQUI=Path(__file__).resolve().parent
CAMPOS=('input_tokens','cached_input_tokens','cache_write_input_tokens','output_tokens','reasoning_output_tokens','total_tokens')
INICIO='A decisão do lugar de direção sobre a paragem da DGAL (28.09.2026):'
def medir(eventos):
    anterior=ultimo=fronteira=meta=None
    modelos=set()
    for e in eventos:
        p=e.get('payload',{})
        if e.get('type')=='session_meta': meta={'id':p['id'],'inicio':e['timestamp']}
        if e.get('type')=='turn_context' and p.get('model'): modelos.add(p['model'])
        if e.get('type')=='response_item' and p.get('role')=='user':
            texto=' '.join(x.get('text','') for x in p.get('content',[]) if isinstance(x,dict))
            if texto.startswith(INICIO):
                assert fronteira is None, 'A fronteira da retoma tem de ser única.'
                assert ultimo is not None, 'Falta o cumulativo anterior à retoma.'
                fronteira=e['timestamp'];anterior=ultimo
        if e.get('type')=='event_msg' and p.get('type')=='token_count':
            uso=(p.get('info') or {}).get('total_token_usage')
            if uso is not None:
                assert all(isinstance(uso.get(k),int) and uso[k]>=0 for k in CAMPOS)
                assert uso['total_tokens']==uso['input_tokens']+uso['output_tokens']
                ultimo={'hora':e['timestamp'],'cumulativos':{k:uso[k] for k in CAMPOS}}
    assert meta and fronteira and anterior and ultimo and ultimo['hora']>fronteira
    delta={k:ultimo['cumulativos'][k]-anterior['cumulativos'][k] for k in CAMPOS}
    assert all(v>=0 for v in delta.values())
    segundos=(datetime.fromisoformat(ultimo['hora'].replace('Z','+00:00'))-datetime.fromisoformat(fronteira.replace('Z','+00:00'))).total_seconds()
    return {'sessao':meta,'inicio_da_retoma':fronteira,'modelos_expostos':sorted(modelos) or ['not exposed'],'antes_da_retoma':anterior,'ultima_leitura':ultimo,'custo_da_retoma':delta,'segundos_ate_ultima_leitura':segundos}
def eventos(p):
    for l in p.open():
        try: yield json.loads(l)
        except ValueError:
            if l.endswith('\n'): raise
ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--sessao',required=True);args=ap.parse_args()
candidatos=list((Path.home()/'.codex/sessions/2026/09/28').glob(f'*{args.sessao}.jsonl'))
assert len(candidatos)==1
r=medir(eventos(candidatos[0]))
r.update({'registado_em':datetime.now(timezone.utc).isoformat(),'unidade':'tokens expostos pelo runtime','limites':['Só esta retoma, desde o pedido de autorização. A primeira passagem do C1c fica no cumulativo anterior, separado.','A entrada em cache já está incluída na entrada; o raciocínio já está incluído na saída.','Não inclui revisões automáticas nem estima preço. Não houve agentes nesta retoma.','É uma leitura até à hora declarada; a sessão continua a consumir depois dela.']})
(AQUI/'custo-retoma.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'retoma':r['custo_da_retoma'],'segundos':r['segundos_ate_ultima_leitura']},ensure_ascii=False))
