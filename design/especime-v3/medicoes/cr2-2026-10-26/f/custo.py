"""Conta as ferramentas no registo da sessão, sem copiar o seu conteúdo."""
import argparse
import json
import re
from pathlib import Path
ap=argparse.ArgumentParser();ap.add_argument('--sessao',type=Path,required=True);a=ap.parse_args()
chamadas={};internas={};tokens=None
for linha in a.sessao.open():
 d=json.loads(linha);q=d.get('payload',{})
 if d['type']=='response_item' and q.get('type') in ('function_call','custom_tool_call'):
  nome=q.get('name','?');chamadas[nome]=chamadas.get(nome,0)+1
  if nome.endswith('exec'):
   for n in re.findall(r'tools\.([a-zA-Z0-9_]+)\(',q.get('input',q.get('arguments',''))):internas[n]=internas.get(n,0)+1
 if d['type']=='event_msg' and q.get('type')=='token_count':tokens=q.get('info',{}).get('total_token_usage')
p=Path(__file__).resolve().parent
r={'momento':'medição antes do commit; exclui o pedido de commit e a inspeção final','chamadas':chamadas,'total_chamadas':sum(chamadas.values()),'ferramentas_internas':internas,'tokens':tokens,'construcoes':1,'conferencias_pedidas':7,'conferencias_adicionais':7,'categorias_adicionais':6,'medicoes_auxiliares':11,'corridas_inteiras':0,'capturas':0,'gate_motor':0,'configuracao_declarada':'Sol 6.1 medium'}
assert r['total_chamadas']>0
(p/'custo.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
anterior=json.loads((p.parent/'custo.json').read_text());anterior['continuacao_cr2f']=r
(p.parent/'custo.json').write_text(json.dumps(anterior,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'chamadas':r['total_chamadas'],'internas':internas,'tokens':tokens},ensure_ascii=False))
