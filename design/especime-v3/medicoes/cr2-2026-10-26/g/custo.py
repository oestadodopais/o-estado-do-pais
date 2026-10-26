"""Mede chamadas e tokens da sessão, sem copiar conteúdo ou caminhos pessoais."""
import json
from pathlib import Path
p=Path(__file__).resolve().parent
sessao=None
for f in sorted((Path.home()/'.codex/sessions/2026/10/26').glob('*.jsonl'),key=lambda f:f.stat().st_mtime,reverse=True):
 for l in f.open():
  d=json.loads(l)
  if d.get('type')=='session_meta':
   if d.get('payload',{}).get('cwd')==str(Path.cwd()):sessao=f
   break
 if sessao:break
assert sessao
contagem={};tokens=None
for l in sessao.open():
 d=json.loads(l);q=d.get('payload',{})
 if d.get('type')=='response_item' and q.get('type') in ['function_call','custom_tool_call']:
  n=q.get('name','?');contagem[n]=contagem.get(n,0)+1
 if d.get('type')=='event_msg' and q.get('type')=='token_count':tokens=q.get('info',{}).get('total_token_usage')
r=dict(momento='antes do commit; exclui pedido de commit e inspeção final',chamadas=contagem,total_chamadas=sum(contagem.values()),tokens=tokens,construcoes=1,conferencias_pedidas=6,corridas_inteiras=0,capturas=0,gate_motor=0)
(p/'custo.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
consolidado=p.parent/'custo.json';c=json.loads(consolidado.read_text());c['continuacao_cr2g']=r;consolidado.write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n')
for f in [p/'RELATORIO.md',p.parent/'LEIA-ME.md']:
 s=f.read_text();s+=f"\nCusto CR2-g medido antes do commit: {r['total_chamadas']} chamadas de ferramentas. tokens used: {tokens.get('total_tokens') if tokens else 'não exposto'} (total acumulado observado, incluindo entrada em cache). A medição exclui o pedido de commit e a inspeção final.\n";f.write_text(s)
print(json.dumps(r,ensure_ascii=False))
