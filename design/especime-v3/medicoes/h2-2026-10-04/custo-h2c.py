#!/usr/bin/env python3
"""Mede só a passagem H2-c numa sessão retomada, sem publicar o caminho do registo.
Uso: python3 <este guião> <registo-do-lançador>.
A linha final do lançamento H2 pertence ao H2, não à passagem retomada.
"""
import datetime,json,os,re,sys
from pathlib import Path
texto=Path(sys.argv[1]).read_text(errors='replace')
modelo=re.search(r'^model: (.+)$',texto,re.M)
sessao=re.search(r'^session id: (.+)$',texto,re.M)
assert modelo and sessao
ficheiros=list((Path.home()/'.codex/sessions').rglob('*'+sessao[1]+'*.jsonl'))
assert len(ficheiros)==1
inicio=None;anterior=None;ultimo=None;leitura=None;base=None;modelo_contexto=None
for linha in ficheiros[0].open():
    o=json.loads(linha);p=o.get('payload',{})
    if o.get('type')=='turn_context':modelo_contexto=p.get('model')
    mensagem=p.get('message','') if p.get('type')=='user_message' else ''.join(c.get('text','') for c in p.get('content',[]) if isinstance(c,dict)) if p.get('role')=='user' else ''
    if '# O mandato da passagem H2-c' in mensagem and inicio is None:
        inicio=o['timestamp'];base=anterior
    if p.get('type')=='token_count' and p.get('info',{}).get('total_token_usage'):
        anterior=p['info']['total_token_usage']
        if inicio:ultimo=anterior;leitura=o['timestamp']
assert inicio and base and ultimo and leitura
assert modelo_contexto==modelo[1],'Modelo do turno difere do lançador.'
parcial={k:ultimo[k]-base[k] for k in ultimo}
assert all(v>=0 for v in parcial.values())
assert parcial['input_tokens']+parcial['output_tokens']==parcial['total_tokens']
agora=datetime.datetime.now(datetime.timezone.utc)
segundos=round((agora-datetime.datetime.fromisoformat(inicio.replace('Z','+00:00'))).total_seconds(),3)
pasta=Path(os.environ.get('OEDP_MEDICOES',Path(__file__).resolve().parent))
r=dict(modelo=modelo[1],inicio=inicio,leitura=leitura,fecho=agora.isoformat(),segundos_ate_fecho=segundos,
       tokens_used=None,estado='parcial H2-c: linha final [verify]',total_cumulativo_parcial=parcial,
       contador_antes_da_passagem=base,contador_na_leitura=ultimo,
       comando='python3 design/especime-v3/medicoes/h2-2026-10-04/custo-h2c.py <registo-do-lançador>',
       conhecido_positivo=dict(o_que='modelo confirmado no contexto do turno; mandato H2-c encontrado na mensagem do utilizador; diferença dos contadores não negativa e soma das entradas e saídas igual ao total',encontrado=True))
(pasta/'custo-h2c.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:r[k] for k in ['modelo','segundos_ate_fecho','tokens_used','estado']},ensure_ascii=False))
