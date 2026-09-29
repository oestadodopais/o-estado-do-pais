"""Lê os contadores da sessão e as horas da C1g e da C1h, sem estimar preços."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
AQUI = Path(__file__).resolve().parent
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--sessao', required=True)
args = ap.parse_args()
ficheiros = list((Path.home()/'.codex/sessions').rglob('*'+args.sessao+'.jsonl'))
assert len(ficheiros) == 1
campos = ('input_tokens','cached_input_tokens','cache_write_input_tokens','output_tokens','reasoning_output_tokens','total_tokens')
prefixos = {'c1g':'A quarta leitura a frio do C1 (as passagens C1e e C1f)', 'c1h':'A quinta leitura a frio do C1 (a passagem C1g)'}
marcas = {}; ultimo = None; fim_g = None
for linha in ficheiros[0].open():
    try: e = json.loads(linha)
    except ValueError:
        if linha.endswith('\n'): raise
        continue
    p = e.get('payload', {})
    if e.get('type') == 'response_item' and p.get('role') == 'user':
        texto = ' '.join(c.get('text','') for c in p.get('content',[]) if isinstance(c,dict))
        for etapa, prefixo in prefixos.items():
            if texto.startswith(prefixo):
                assert etapa not in marcas and ultimo
                marcas[etapa] = {'pedido':e['timestamp'], 'antes':ultimo}
                if etapa == 'c1h': fim_g = ultimo
    if e.get('type') == 'event_msg' and p.get('type') == 'token_count':
        uso = (p.get('info') or {}).get('total_token_usage')
        if uso:
            limite = ((p.get('rate_limits') or {}).get('primary') or {})
            ultimo = {'hora':e['timestamp'], 'cumulativos':{k:uso.get(k,0) for k in campos},
                      'percentagem_da_semana':limite.get('used_percent')}
assert set(marcas) == set(prefixos) and fim_g and ultimo
for etapa, fim in [('c1g',fim_g),('c1h',ultimo)]:
    inicio = marcas[etapa]
    custo = {k:fim['cumulativos'][k]-inicio['antes']['cumulativos'][k] for k in campos}
    assert all(v >= 0 for v in custo.values())
    r = {'sessao':args.sessao, **inicio, 'ultima_leitura':fim, etapa:custo,
         'segundos':(datetime.fromisoformat(fim['hora'])-datetime.fromisoformat(inicio['pedido'])).total_seconds(),
         'registado_em':datetime.now(timezone.utc).isoformat(), 'unidade':'tokens expostos pelo runtime',
         'duracao_de':'pedido', 'duracao_ate':'ultima_leitura.hora',
         'limites':['Entrada em cache incluída na entrada; raciocínio incluído na saída. Não somados duas vezes.',
                    'C1g termina no último contador antes do pedido C1h. C1h termina na leitura indicada, sem o fecho posterior.',
                    'Sem preço exposto. Sem subagentes.']}
    (AQUI.parent/etapa/'custo.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
    print(etapa, custo['total_tokens'], 'símbolos;', r['segundos'], 'segundos;', fim['percentagem_da_semana'], '% da semana')
