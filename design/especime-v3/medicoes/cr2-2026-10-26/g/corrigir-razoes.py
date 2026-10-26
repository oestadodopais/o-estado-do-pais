"""Corrige só as razões, pelas linhas ALARM copiadas do painel."""
import json, re
from pathlib import Path
from decimal import Decimal
import yaml
p=Path(__file__).resolve().parent.parent
ids=[i for i in json.loads((p/'ids.json').read_text()) if i not in ['divida-publica-2025','divida-publica-2025-ue']]
def ler(dia):
 f=f'painel-2026-10-{dia}.alarmes.txt'
 return {m[1]:dict(ficheiro=f,linha=n,antiga=m[2],nova=m[3],old=m[4],new=m[5]) for n,l in enumerate((p/f).read_text().splitlines(),1) if (m:=re.match(r'ALARM\s+(\S+):.*carimbo (\S+) -> (\S+), valor (\S+) -> (\S+)',l))}
a,b=ler('19'),ler('26')
def data(s):return '.'.join(s[:10].split('-')[::-1])
def valor(s,en=False):
 s=str(s).replace(',','.').replace(' ','').replace('\u00a0','').replace('\u202f','');v=Decimal(s)
 t=f'{v:,.1f}'.replace(',','\u202f')
 if v==v.to_integral() and abs(v)>=1000:t=t[:-2]
 return t if en else t.replace('.',',')
provas=[]
for cid in ids:
 f=Path('ledger/claims')/(cid+'.yml');s=f.read_text();antes=yaml.safe_load(s)
 u=next(e for e in antes['corrections'] if str(e['date'])=='2026-10-26' and e['kind']=='atualizacao')
 r=b[cid];caso='B' if cid=='divida-das-empresas-2025-ue' else 'A' if cid in a else 'C'
 if caso=='A':assert Decimal(a[cid]['new'])==Decimal(r['new'])
 assert Decimal(str(u['new_value']).replace(',','.').replace(' ','').replace('\u00a0','').replace('\u202f',''))==Decimal(r['new'])
 for en,key in [(False,'reason'),(True,'reason_en')]:
  old,new=valor(u['old_value'],en),valor(u['new_value'],en)
  if caso in ['A','B']:
   x=a[cid];ant,nova,n26=data(x['antiga']),data(x['nova']),data(r['nova'])
   if caso=='A':
    t=(f'Eurostat revised the value from {old} to {new} in the dataset update of {nova} (the dataset stamp moved from {ant} to {nova}): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of {n26}' if en else f'O Eurostat reviu o valor de {old} para {new} na atualização do conjunto de {nova} (o carimbo passou de {ant} a {nova}): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de {n26}')
   else:
    t=(f'Eurostat revised the value from 70.0 to 70.3 in the dataset update of {nova} (the dataset stamp moved from {ant} to {nova}) and again to 70.2 in the one of {n26}: the weekly check of 19.10.2026 caught the first revision and the one of 26.10.2026 the second' if en else f'O Eurostat reviu o valor de 70,0 para 70,3 na atualização do conjunto de {nova} (o carimbo passou de {ant} a {nova}) e outra vez para 70,2 na de {n26}: a reconferência semanal de 19.10.2026 viu a primeira revisão e a de 26.10.2026 a segunda')
  else:
   ant,nova=data(r['antiga']),data(r['nova'])
   t=(f'Eurostat revised the value from {old} to {new} in the dataset update of {nova} (the dataset stamp moved from {ant} to {nova}): the weekly check of 26.10.2026 caught the revision' if en else f'O Eurostat reviu o valor de {old} para {new} na atualização do conjunto de {nova} (o carimbo passou de {ant} a {nova}): a reconferência semanal de 26.10.2026 viu a revisão')
  t+=('; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); '+('the site published 70.0.' if caso=='B' else 'the site published the value of the earlier reading.') if en else '; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); '+('o sítio publicava 70,0.' if caso=='B' else 'o sítio publicava o valor da leitura anterior.'))
  u[key]=t
 # Substitui apenas as duas razões da atualização de outubro.
 partes=re.split(r'(?=^ *- date:)',s,flags=re.M)
 for n,bloco in enumerate(partes):
  m=re.match(r"( *)- date: ['\"]?2026-10-26",bloco)
  if m and re.search(r'\n +kind: atualizacao\n',bloco):
   margem=m[1]+'  '
   for key in ['reason','reason_en']:
    bloco=re.sub(rf'^{margem}{key}:[^\n]*(?:\n{margem}  [^\n]*)*',lambda m:f'{margem}{key}: '+json.dumps(u[key],ensure_ascii=False),bloco,flags=re.M)
   partes[n]=bloco
 s=''.join(partes).replace('no dia da reconferência que viu a revisão','o dia da releitura pelo cliente da casa').replace('the day of the check that caught the revision','the day of the re-read by the house client')
 depois=yaml.safe_load(s)
 expected=json.loads(json.dumps(antes,default=str));actual=json.loads(json.dumps(depois,default=str))
 for e in expected['corrections']:
  if e['date']=='2026-10-26':
   if e['kind']=='atualizacao':e.update({k:u[k] for k in ['reason','reason_en']})
   else:
    for k in ['reason','reason_en']:e[k]=e[k].replace('no dia da reconferência que viu a revisão','o dia da releitura pelo cliente da casa').replace('the day of the check that caught the revision','the day of the re-read by the house client')
 if expected!=actual:
  for e,z in zip(expected['corrections'],actual['corrections']):
   for k in set(e)|set(z):
    if e.get(k)!=z.get(k):print(cid,k,repr(e.get(k)),repr(z.get(k)))
 assert expected==actual,cid
 f.write_text(s)
 provas.append(dict(id=cid,caso=caso,registo19=a.get(cid),registo26=r,reason=u['reason'],reason_en=u['reason_en']))
(p/'g/razoes.json').write_text(json.dumps(provas,ensure_ascii=False,indent=2)+'\n')
print(f'{len(provas)} razões bilingues corrigidas; restantes campos conservados')
