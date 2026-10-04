#!/usr/bin/env python3
"""Lê o custo do próprio registo, sem guardar o seu caminho.
Uso: python3 <este guião> <construir.log>.
A linha final «tokens used» só existe depois de o construtor terminar. Até
lá guarda-se o contador cumulativo do rollout da MESMA sessão e diz-se que
é parcial. O custo final não se inventa nem se infere dos tokens em cache.
"""
import datetime,json,re,sys
from pathlib import Path
log=Path(sys.argv[1]);texto=log.read_text(errors='replace')
modelo=re.search(r'^model: (.+)$',texto,re.M)
sessao=re.search(r'^session id: ([0-9a-f-]+)$',texto,re.M)
final=re.findall(r'^tokens used\s*\n([\d,]+)\s*$',texto,re.M)
assert modelo and sessao,'Registo sem modelo ou identidade da sessão.'
registos=list((Path.home()/'.codex/sessions').rglob('*'+sessao[1]+'*.jsonl'))
assert len(registos)==1,'O registo da sessão não é unívoco.'
primeiro=None;ultimo=None
for l in registos[0].open():
 o=json.loads(l)
 if primeiro is None:first=o;primeiro=o['timestamp']
 p=o.get('payload',{})
 if p.get('type')=='token_count' and p.get('info',{}).get('total_token_usage'):
  ultimo=o
assert ultimo,'Contador cumulativo ausente.'
def instante(t):return datetime.datetime.fromisoformat(t.replace('Z','+00:00'))
agora=datetime.datetime.now(datetime.timezone.utc)
saida=dict(modelo=modelo[1],inicio=primeiro,leitura=ultimo['timestamp'],fecho=agora.isoformat(),
 segundos_ate_leitura=round((instante(ultimo['timestamp'])-instante(primeiro)).total_seconds(),3),
 segundos_ate_fecho=round((agora-instante(primeiro)).total_seconds(),3),
 tokens_used=int(final[-1].replace(',','')) if final else None,
 total_cumulativo_parcial=ultimo['payload']['info']['total_token_usage'],
 estado='final' if final else 'parcial: a sessão ainda não escreveu a linha tokens used',
 comando='python3 design/especime-v3/medicoes/h2-2026-10-04/custo-h2.py <registo-do-construtor>',
 conhecido_positivo=dict(o_que='modelo e identidade lidos no cabeçalho; um único rollout correspondente com contador cumulativo',encontrado=True))
Path(__file__).with_name('custo.json').write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:saida[k] for k in ['modelo','segundos_ate_fecho','tokens_used','estado']},ensure_ascii=False))
