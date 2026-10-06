#!/usr/bin/env python3
"""Lê respostas, símbolos e segundos de uma sessão, sem copiar texto nem caminhos.

Uso: python3 scripts/leituras/custo.py <sessão.jsonl> [saída.json] [--desde ISO]
Aceita Claude (message.id e usage) e Codex (event_msg/token_count acumulado).
No Claude conta cada id uma vez, entrada da última parte e máximo da saída;
essa saída é um mínimo do fluxo. No Codex usa o último contador, nunca a soma
dos acumulados; --desde subtrai o último contador anterior ao corte. O intervalo
assim cortado inclui trabalho entre esse contador e o corte. Respostas sem id
contam-se por registo no Codex. Campos ausentes ficam null, não viram zeros.
Os segundos vão da primeira à última marca temporal do intervalo lido. O total
final «tokens used» do lançador não se reconstrói daqui. O sha256 identifica os
bytes lidos; um registo truncado ou um contador que recue fecha a leitura.
"""
import argparse
from datetime import datetime
import hashlib
import json
from pathlib import Path


def instante(s): return datetime.fromisoformat(s.replace('Z','+00:00'))


def medir(dados, desde=None):
    eventos = [json.loads(l) for l in dados.decode().splitlines() if l.strip()]
    corte = instante(desde) if desde else None
    escolhidos = [e for e in eventos if not corte or (e.get('timestamp') and instante(e['timestamp']) >= corte)]
    marcas = sorted(e['timestamp'] for e in escolhidos if e.get('timestamp'))
    saida = {'registo_sha256':hashlib.sha256(dados).hexdigest(),'desde':desde,
             'primeira_entrada':marcas[0] if marcas else None,'ultima_entrada':marcas[-1] if marcas else None,
             'segundos':(instante(marcas[-1])-instante(marcas[0])).total_seconds() if marcas else None}
    claude = [e['message'] for e in escolhidos if isinstance(e.get('message'),dict) and e['message'].get('usage') and e['message'].get('id')]
    contadores = [(e.get('timestamp'),e['payload']['info']['total_token_usage']) for e in eventos
                  if e.get('type')=='event_msg' and e.get('payload',{}).get('type')=='token_count'
                  and e['payload'].get('info',{} ) and e['payload']['info'].get('total_token_usage')]
    if claude and contadores: raise ValueError('O registo mistura formatos de sessões diferentes.')
    if claude:
        por_id = {}
        for m in claude:
            anterior = por_id.get(m['id'],{})
            u = dict(m['usage'])
            saidas = [x['output_tokens'] for x in [u,anterior] if isinstance(x.get('output_tokens'),int)]
            if saidas: u['output_tokens'] = max(saidas)
            u['_caracteres'] = max(len(json.dumps(m.get('content'),ensure_ascii=False)),anterior.get('_caracteres',0))
            u['_modelo'] = m.get('model') or 'not exposed'; por_id[m['id']] = u
        campos = ('input_tokens','cache_creation_input_tokens','cache_read_input_tokens','output_tokens')
        somas = {k:sum(u[k] for u in por_id.values()) if all(k in u for u in por_id.values()) else None for k in campos}
        saida.update(formato='Claude',respostas_do_modelo=len(por_id),modelos=sorted({u['_modelo'] for u in por_id.values()}),
                     simbolos=somas,saida_minima=True,
                     respostas_com_saida_parcial=sum(u['_caracteres']>1000 and isinstance(u.get('output_tokens'),int) and u['output_tokens']<=10 for u in por_id.values()))
    elif contadores:
        anterior = {}
        for _, u in contadores:
            if any(v < 0 or v < anterior.get(k,0) for k,v in u.items()):
                raise ValueError('O contador acumulado recuou; não se pode somar esta sessão.')
            anterior = u
        antes = [u for t,u in contadores if corte and t and instante(t)<corte]
        depois = [(t,u) for t,u in contadores if not corte or (t and instante(t)>=corte)]
        if not depois: raise ValueError('Não há contador no intervalo pedido.')
        prev = antes[-1] if antes else {}; stamp,u = depois[-1]
        delta = {k:v-prev.get(k,0) for k,v in u.items()}
        respostas = [e for e in escolhidos if e.get('type')=='response_item' and e.get('payload',{}).get('type')=='message' and e['payload'].get('role')=='assistant']
        ids = {e['payload'].get('id') or f'registo-{i}' for i,e in enumerate(respostas)}
        modelos = sorted({e.get('payload',{}).get('model') for e in escolhidos if e.get('type')=='turn_context' and e.get('payload',{}).get('model')})
        saida.update(formato='Codex',respostas_do_modelo=len(ids) if respostas else None,modelos=modelos or ['not exposed'],
                     simbolos=delta,contador_anterior=prev,ultima_medicao=stamp,saida_minima=False,
                     limite='Último contador disponível, não o total final do lançador.')
    else: raise ValueError('Não há contadores de utilização reconhecidos no intervalo pedido.')
    return saida


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__); p.add_argument('sessao'); p.add_argument('saida',nargs='?'); p.add_argument('--desde')
    a = p.parse_args(); resultado = json.dumps(medir(Path(a.sessao).read_bytes(),a.desde),ensure_ascii=False,indent=2)+'\n'
    if a.saida: Path(a.saida).write_text(resultado)
    print(resultado,end='')
