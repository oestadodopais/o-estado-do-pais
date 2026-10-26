"""HB1-c1: os ordinais e as contagens das frases, medidos nos corpos alojados do motor.
Uso: python3 medir-hb1c.py <motor> > medidas.json  (escreve medidas.json ao lado).
Cada medição traz o nome, o valor, o comando e um conhecido-positivo (o valor de uma
linha selada no livro do estudo, lido pela mesma função de célula)."""
import json,sys,hashlib
from pathlib import Path
motor=Path(sys.argv[1]);src=motor/'content/23 Habitacao/source/eurostat'
book={r['id']:r for r in json.loads((motor/'content/28 Habitacao Estudo/ledger.json').read_text())['claims']}
EU27=['AT','BE','BG','CY','CZ','DE','DK','EE','EL','ES','FI','FR','HR','HU','IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK']
def load(name):
    raw=(src/name).read_bytes();return json.loads(raw),hashlib.sha256(raw).hexdigest()
def cell(j,coords):
    idx=0
    for d,size in zip(j['id'],j['size']):
        idx=idx*size+j['dimension'][d]['category']['index'][coords[d]]
    v=j['value'].get(str(idx));return None if v is None else float(v)
def ranking(name,fixed,time):
    j,h=load(name);vals={}
    for g in EU27:
        if g not in j['dimension']['geo']['category']['index']:continue
        v=cell(j,{**fixed,'geo':g,'time':time})
        if v is not None:vals[g]=v
    return j,h,vals
COMANDO='python3 design/especime-v3/medicoes/hb1-2026-10-21/correcao-hb1c/medir-hb1c.py <motor>'
out=[]
def medida(nome,valor,positivo,ficheiro,h,extra=None):
    out.append(dict(nome=nome,valor=valor,comando=COMANDO,corpo='content/23 Habitacao/source/eurostat/'+ficheiro,sha256=h,conhecido_positivo=positivo,**(extra or {})))
def positivo(row_id,j,coords):
    lido=cell(j,coords);selado=float(book[row_id]['value']);assert lido==selado,(row_id,lido,selado)
    return dict(linha=row_id,valor_selado=book[row_id]['value'],valor_lido=lido,igual=True)
def above(vals,g):return sorted([k for k,v in vals.items() if v>vals[g]],key=lambda k:-vals[k])
def tied(vals,g):return sorted([k for k,v in vals.items() if v==vals[g] and k!=g])
# 1. índice nominal trimestral, 2.º trimestre de 2026
f={'freq':'Q','purchase':'TOTAL','unit':'I15_Q'};j,h,v=ranking('prc_hpi_q.json',f,'2026-Q2')
medida('prc_hpi_q I15_Q 2026-Q2: Estados-membros com dados',len(v),positivo('hab-prc-hpi-q-q-total-i15-q-pt-2026-q2',j,{**f,'geo':'PT','time':'2026-Q2'}),'prc_hpi_q.json',h,dict(sem_dados=sorted(set(EU27)-set(v))))
medida('prc_hpi_q I15_Q 2026-Q2: acima de Portugal, por ordem',[[g,v[g]] for g in above(v,'PT')],None,'prc_hpi_q.json',h,dict(ordinal_de_portugal=len(above(v,'PT'))+1,portugal=v['PT']))
# 2. variação anual, 2.º trimestre de 2026
f2={'freq':'Q','purchase':'TOTAL','unit':'RCH_A'};j,h,v2=ranking('prc_hpi_q.json',f2,'2026-Q2')
medida('prc_hpi_q RCH_A 2026-Q2: acima de Portugal',[[g,v2[g]] for g in above(v2,'PT')],positivo('hab-prc-hpi-q-q-total-rch-a-pt-2026-q2',j,{**f2,'geo':'PT','time':'2026-Q2'}),'prc_hpi_q.json',h,dict(com_dados=len(v2),empatados=tied(v2,'PT'),portugal=v2['PT']))
# 3. índice real anual, 2025
f3={'freq':'A','unit':'I15_A_AVG'};j,h,v3=ranking('tipsho10.json',f3,'2025')
medida('tipsho10 I15_A_AVG 2025: acima de Portugal',[[g,v3[g]] for g in above(v3,'PT')],positivo('hab-tipsho10-a-i15-a-avg-pt-2025',j,{**f3,'geo':'PT','time':'2025'}),'tipsho10.json',h,dict(com_dados=len(v3),segundo=sorted(v3.items(),key=lambda x:-x[1])[1]))
# 4. rácio preço-rendimento, 2024
f4={'freq':'A','unit':'PTIR_I15'};j,h,v4=ranking('tipsho60.json',f4,'2024')
medida('tipsho60 PTIR_I15 2024: acima de Portugal',[[g,v4[g]] for g in above(v4,'PT')],positivo('hab-tipsho60-a-ptir-i15-pt-2024',j,{**f4,'geo':'PT','time':'2024'}),'tipsho60.json',h,dict(com_dados=len(v4)))
# 5. 25 a 34 anos a viver com os pais, 2025
f5={'freq':'A','age':'Y25-34','sex':'T','unit':'PC'};j,h,v5=ranking('ilc_lvps08.json',f5,'2025')
medida('ilc_lvps08 Y25-34 2025: acima de Portugal, por ordem',[[g,v5[g]] for g in above(v5,'PT')],positivo('hab-ilc-lvps08-a-y25-34-t-pc-pt-2025',j,{**f5,'geo':'PT','time':'2025'}),'ilc_lvps08.json',h,dict(ordinal_de_portugal=len(above(v5,'PT'))+1,com_dados=len(v5),empatados=tied(v5,'PT'),mais_alto=max(v5.items(),key=lambda x:x[1])))
# 6. idade de saída, 2025
f6={'freq':'A','unit':'AVG','sex':'T'};j,h,v6=ranking('yth_demo_030.json',f6,'2025')
medida('yth_demo_030 2025: acima de Portugal, por ordem',[[g,v6[g]] for g in above(v6,'PT')],positivo('hab-yth-demo-030-a-avg-t-pt-2025',j,{**f6,'geo':'PT','time':'2025'}),'yth_demo_030.json',h,dict(ordinal_de_portugal=len(above(v6,'PT'))+1,com_dados=len(v6),empatados=tied(v6,'PT')))
# 7. a sobrecarga total de 2025: cobertura, a mais baixa e a mais alta
f7={'freq':'A','unit':'PC','tenure':'TOTAL'};j,h,v7=ranking('hb1b-ilc_lvho07c.json',f7,'2025')
lo=min(v7.items(),key=lambda x:x[1]);hi=max(v7.items(),key=lambda x:x[1])
medida('ilc_lvho07c TOTAL 2025: Estados-membros com dados',len(v7),positivo('hab-ilc-lvho07c-a-pc-total-pt-2025',j,{**f7,'geo':'PT','time':'2025'}),'hb1b-ilc_lvho07c.json',h,dict(sem_dados=sorted(set(EU27)-set(v7)),mais_baixa=lo,mais_alta=hi,empatados_com_a_mais_baixa=[k for k,x in v7.items() if x==lo[1] and k!=lo[0]],empatados_com_a_mais_alta=[k for k,x in v7.items() if x==hi[1] and k!=hi[0]]))
# 8. as datas de atualização dos dois corpos da sobrecarga
a,ha=load('hb1b-ilc_lvho07c.json');b,hb=load('hb1b-tespm140.json')
medida('updated dos dois corpos da sobrecarga',dict(ilc_lvho07c=a['updated'],tespm140=b['updated'],mesmo_dia=a['updated'][:10]==b['updated'][:10],por_regime_mais_recente=a['updated']>b['updated']),None,'hb1b-ilc_lvho07c.json + hb1b-tespm140.json',ha+' / '+hb)
Path(__file__).with_name('medidas.json').write_text(json.dumps(out,ensure_ascii=False,indent=1)+'\n')
for m in out:print(m['nome'],'=',json.dumps(m['valor'],ensure_ascii=False)[:160],'|',json.dumps({k:m[k] for k in m if k not in('nome','valor','comando','corpo','sha256','conhecido_positivo')},ensure_ascii=False)[:220])
