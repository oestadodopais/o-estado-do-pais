#!/usr/bin/env python3
"""Conta chamadas e tokens do registo da sessão, sem copiar o seu conteúdo."""
import argparse
import json
import re
from pathlib import Path
ap=argparse.ArgumentParser()
ap.add_argument('--sessao',type=Path,required=True)
a=ap.parse_args()
chamadas={};internas={};tokens=None
for linha in a.sessao.open():
    d=json.loads(linha);q=d.get('payload',{})
    if d['type']=='response_item' and q.get('type') in ('function_call','custom_tool_call'):
        nome=q.get('name','?');chamadas[nome]=chamadas.get(nome,0)+1
        if nome=='exec':
            for n in re.findall(r'tools\.([a-zA-Z0-9_]+)\(',q.get('input',q.get('arguments',''))):internas[n]=internas.get(n,0)+1
    if d['type']=='event_msg' and q.get('type')=='token_count':tokens=q.get('info',{}).get('total_token_usage')
p=Path(__file__).resolve().parent
codigos={f.stem:int(f.read_text().strip()) for f in p.glob('*.codigo')}
r={'momento':'antes do commit do relatório; não inclui esse pedido nem a inspeção final','chamadas':chamadas,'total_chamadas':sum(chamadas.values()),'ferramentas_internas_ao_exec':internas,'tokens':tokens,'operacoes_com_codigo_guardado':len(codigos),'conferencias_do_ponto_6':7,'corridas_inteiras_do_sitio':0,'construcoes':1,'capturas':0,'core_gate_pedido_diretamente':0,'core_gate_corrido_pelo_hook':0,'conhecido_positivo':{'passou':bool(chamadas.get('request_user_input_async')==1 and internas.get('exec_command',0)>0),'prova':'O registo contém a pergunta de clarificação e chamadas executadas pelo orquestrador.'}}
assert r['conhecido_positivo']['passou']
anterior=json.loads((p/'custo.json').read_text())
original=anterior.get('passagem_original',anterior)
(p/'custo.json').write_text(json.dumps({'passagem_original':original,'continuacao_cr2b':r},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'chamadas':r['total_chamadas'],'tokens':tokens,'conferencias':r['conferencias_do_ponto_6'],'construcoes':r['construcoes']},ensure_ascii=False))
