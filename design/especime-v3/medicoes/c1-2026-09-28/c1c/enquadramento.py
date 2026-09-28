"""C1c: compara a geração inteira e aplica só o valor autorizado e as bandeiras."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import subprocess
import yaml

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[4]
ALVO = 'divida-das-familias-2025-ue'
BASE = 'b7f352ce253effe7d21dc97bacc1d9b67665e592'

def selado(p):
    return subprocess.check_output(['git', 'show', f'{BASE}:{p.relative_to(SITIO)}'], cwd=SITIO, text=True)

def sha(b):
    return hashlib.sha256(b).hexdigest()

def escrever(nome, valor):
    (AQUI / nome).write_text(json.dumps(valor, ensure_ascii=False, indent=2) + '\n')

def campo(texto, nome, valor):
    novo = f'{nome}: {json.dumps(valor, ensure_ascii=False)}'
    if re.search(r'^' + re.escape(nome) + ':', texto, re.M):
        return re.sub(r'^' + re.escape(nome) + r':.*$', lambda _: novo, texto, flags=re.M)
    return texto.rstrip() + '\n\n' + novo + '\n'

def conferir_atualizacao(antes, depois):
    entradas = [c for c in depois['corrections'] if c.get('kind') == 'atualizacao' and c.get('old_value') == antes['value'] and c.get('new_value') == depois['value'] and c.get('date') == depois['access_date'] and c.get('reason') and c.get('reason_en')]
    assert len(entradas) == 1, 'o novo valor exige a atualização tipada correspondente'
    assert antes['source_url'] == depois['source_url'], 'o endereço selado mudou'

ap=argparse.ArgumentParser(description=__doc__)
ap.add_argument('--motor',type=Path,required=True)
ap.add_argument('--aplicar',action='store_true')
args=ap.parse_args()
motor=args.motor.expanduser().resolve()
sys.path.insert(0,str(motor))
from indicators import enquadramento as E
from indicators.refresh import pt_to_float
from indicators.enquadramento_coordenadas_test import conferir
saida=motor/'indicators/out/enquadramento-2026-09-28'
recs=[json.loads(l) for l in (saida/'pedidos.jsonl').read_text().splitlines()]
por_url={r['url']:r for r in recs if r.get('http')=='200'}
comparacoes=[]
for p in sorted((saida/'claims').glob('*.yml')):
    origem=yaml.safe_load(p.read_text()); destino=SITIO/'ledger/claims'/p.name
    atual=yaml.safe_load(selado(destino)) if destino.exists() else {}
    campos={k:{'sitio':atual.get(k),'gerado':v} for k,v in origem.items() if v!=atual.get(k)}
    comparacoes.append({'id':origem['id'],'valor_sitio':atual.get('value'),'valor_gerado':origem['value'],'valor_numerico_diferente':pt_to_float(atual.get('value'))!=pt_to_float(origem['value']),'campos_diferentes':campos,'aplicar_valor':origem['id']==ALVO})
assert not any(r['valor_numerico_diferente'] and r['id'] != ALVO for r in comparacoes), 'PARAGEM: o gerador encontrou outro valor diferente'
novo=yaml.safe_load((saida/'claims'/f'{ALVO}.yml').read_text())
assert novo['value']=='49,2', 'PARAGEM: o corpo não trouxe 49,2'
assert por_url[novo['source_url']]['http']=='200'
# Cada corpo é reconferido antes de sustentar a bandeira ou o número.
for r in por_url.values():
    assert sha((saida/r['ficheiro']).read_bytes())==r['sha256']
planos=[]
for p in sorted((SITIO/'ledger/claims').glob('*.yml')):
    bruto=selado(p); linha=yaml.safe_load(bruto)
    if linha.get('study')!='quadro-institucional' or linha.get('source_url') not in por_url: continue
    r=por_url[linha['source_url']]
    js=json.loads((saida/r['ficheiro']).read_text())
    try: recorte=E.resposta_selada(js,linha['source_url'],linha)
    except ValueError: continue
    periodo=linha['reference_date']
    if periodo not in recorte['dimension']['time']['category']['index']: continue
    valor=E.extract(recorte,periodo)[1]
    flag=E.bandeira_da_observacao(recorte,periodo)
    if not flag or flag==linha.get('source_flag'): continue
    # A bandeira não abre a porta a uma revisão de outro número.
    assert p.stem==ALVO or pt_to_float(linha['value'])==valor, f'PARAGEM: mudou também {p.stem}'
    notas=yaml.safe_load(E.com_bandeira('id: ensaio\n',recorte,periodo))
    planos.append({'id':p.stem,'flag':flag,'valor_conservado':p.stem!=ALVO,'corpo_sha256':r['sha256'],'url':r['url'],'quando':r['quando'],'notas':{k:v for k,v in notas.items() if k.startswith('source_flag')}})
antes=selado(SITIO/'ledger/claims'/f'{ALVO}.yml')
a=yaml.safe_load(antes)
correcao={'date':'2026-09-28','kind':'atualizacao','old_value':'49,3','new_value':novo['value'],'reason':'O Eurostat reviu o valor da União a 26.09.2026 (o carimbo do conjunto passou de 19.09.2026 a 26.09.2026); a reconferência semanal de 28.09.2026 viu a revisão.','reason_en':'Eurostat revised the EU value on 26.09.2026 (the dataset stamp moved from 19.09.2026 to 26.09.2026); the weekly check of 28.09.2026 caught the revision.'}
resultado=antes
for k in ('value','excerpt','access_date','source_flag','source_flag_note','source_flag_note_en'):
    if k in novo: resultado=campo(resultado,k,novo[k])
resultado=resultado.replace('corrections: []','corrections:\n'+yaml.safe_dump([correcao],allow_unicode=True,sort_keys=False,default_flow_style=False).rstrip())
verificacoes=a.get('verifications',[])
conservadas=[v for v in verificacoes if v['date']>=novo['access_date']]
# O bloco antigo sai inteiro, sem tocar nos campos de bandeira acrescentados.
inicio=resultado.index('verifications:\n')
fim=inicio+len('verifications:\n')
while fim<len(resultado):
    fecho=resultado.find('\n',fim)
    if fecho<0: fecho=len(resultado)
    l=resultado[fim:fecho]
    if l.strip() and not l.startswith((' ','\t','-')): break
    fim=fecho+1
from indicators.refresh import render_verification
bloco='verifications:\n'+'\n'.join(l for v in conservadas for l in render_verification(v))+'\n\n'
resultado=resultado[:inicio]+bloco+resultado[fim:]
b=yaml.safe_load(resultado)
conferir_atualizacao(a,b)
plantas=[]
for nome,mutacao in [('sem entrada',lambda c:c.update(corrections=[])),('valor antigo errado',lambda c:c['corrections'][-1].update(old_value='0')),('valor novo errado',lambda c:c['corrections'][-1].update(new_value='0'))]:
    c=json.loads(json.dumps(b)); mutacao(c)
    try: conferir_atualizacao(a,c)
    except AssertionError: plantas.append({'nome':nome,'mordeu':True})
    else: raise AssertionError(nome)
escrever('gerador-plantas.json',conferir())
escrever('comparacao-gerada.json',{'linhas':comparacoes,'ausencias':json.loads((saida/'resumo.json').read_text())['ausencias']})
escrever('bandeiras.json',{'linhas':planos,'aplicadas':all(yaml.safe_load((SITIO/'ledger/claims'/f"{p['id']}.yml").read_text()).get('source_flag')==p['flag'] for p in planos) or args.aplicar})
escrever('atualizacao-divida.json',{'antes':a,'depois':b,'antes_sha256':sha(antes.encode()),'depois_sha256':sha(resultado.encode()),'verificacoes_anteriores_ao_novo_acesso':[v for v in verificacoes if v not in conservadas],'corpo':por_url[novo['source_url']],'plantas':plantas,'aplicada':yaml.safe_load((SITIO/'ledger/claims'/f'{ALVO}.yml').read_text())==b or args.aplicar})
if args.aplicar:
    atual=(SITIO/'ledger/claims'/f'{ALVO}.yml').read_text()
    assert atual in (antes,resultado), 'PARAGEM: a linha mudou depois da comparação; não se sobrepõe'
    (SITIO/'ledger/claims'/f'{ALVO}.yml').write_text(resultado)
    for plano in planos:
        if plano['id']==ALVO: continue
        p=SITIO/'ledger/claims'/f"{plano['id']}.yml"; texto=p.read_text(); linha=yaml.safe_load(texto)
        if linha.get('source_flag') == plano['flag']: continue
        texto=campo(texto,'excerpt',linha['excerpt']+' '+plano['flag'])
        for k,v in plano['notas'].items(): texto=campo(texto,k,v)
        p.write_text(texto)
print(json.dumps({'geradas':len(comparacoes),'bandeiras':len(planos),'atualizacao':novo['value'],'aplicado':args.aplicar},ensure_ascii=False))
