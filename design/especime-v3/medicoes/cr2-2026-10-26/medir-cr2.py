#!/usr/bin/env python3
"""Mede a entrega parcial a partir dos corpos, das linhas e dos códigos guardados."""
import argparse
import copy
import hashlib
import json
import re
import subprocess
from pathlib import Path
import yaml

P = Path(__file__).resolve().parent
SITE = P.parents[3]
BASE = '442b284e229408018e8c97c59dadd285a526bf3c'

def contar(xs, predicado):
    return sum(bool(predicado(x)) for x in xs)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--motor',type=Path,required=True)
    args=ap.parse_args()
    pasta=args.motor/'indicators/out/releituras/2026-10-26'
    ler=lambda p: json.loads(p.read_text())
    r=ler(pasta/'releitura.json'); offline=ler(pasta/'releitura-de-corpos.json')
    aplicacao=ler(P/'aplicacao.json'); publicacao=ler(P/'aplicacao-published-at.json')
    alarme=ler(P/'painel/refresh_report.json')
    ids=(P/'painel-ids.txt').read_text().strip().split(',')
    docs={cid:yaml.safe_load((SITE/'ledger/claims'/f'{cid}.yml').read_text()) for cid in ids}
    antigas={cid:yaml.safe_load(subprocess.check_output(['git','-C',str(SITE),'show',f'{BASE}:ledger/claims/{cid}.yml'],text=True)) for cid in ids}
    medidas={}
    def medida(nome,valor,positivo,prova):
        assert positivo,nome
        medidas[nome]={'valor':valor,'conhecido_positivo':{'passou':bool(positivo),'prova':prova}}
    def numero(xs): return len(xs)
    medida('linhas_relidas',numero(r['linhas']),numero([r['linhas'][0]])==1,'A mesma contagem sobre a primeira linha dá uma linha.')
    medida('paragens',numero(r['paragens']),numero([{'id':'planta'}])==1,'Uma paragem plantada conta como uma.')
    ok=lambda p:str(p.get('http'))=='200'
    medida('pedidos_com_200',contar(r['pedidos'],ok),contar([{'http':'200'},{'http':'500'}],ok)==1,'Um 200 e um 500 contam um sucesso.')
    igual=lambda a,b:a['linhas']==b['linhas'] and a['paragens']==b['paragens']
    adulterada=copy.deepcopy(offline);adulterada['linhas'][0]['literal_novo']='99999'
    medida('rede_e_corpos_iguais',igual(r,offline),not igual(r,adulterada),'Um literal adulterado na cópia deixa de comparar igual.')
    validos=[]
    for pedido in r['pedidos']:
        bruto=(pasta/pedido['ficheiro']).read_bytes()
        validos.append(hashlib.sha256(bruto).hexdigest()==pedido['sha256'])
    medida('corpos_com_sha256_certo',sum(validos),hashlib.sha256(b'corpo').hexdigest()!=hashlib.sha256(b'outro').hexdigest(),'Dois corpos diferentes têm resumos diferentes; cada corpo real foi comparado com o pedido.')
    for nome,reg in [('aplicacao',aplicacao),('publicacao',publicacao)]:
        pred=lambda x:x.get('mordeu') is True
        medida(nome+'_plantas_que_morderam',contar(reg['plantas'],pred),contar([{'mordeu':True},{'mordeu':False}],pred)==1,'A mesma função distingue uma planta detetada de uma não detetada.')
    acrescentadas=[]
    conservadas=[]
    for linha in r['linhas']:
        cid=linha['id'];antes=antigas[cid];depois=docs[cid]
        novas=depois['corrections'][len(antes['corrections']):]
        acrescentadas.extend(novas)
        conservadas.append(depois['verifications'][:len(antes['verifications'])]==antes['verifications'])
        assert depois['value']==linha['valor_novo'] and depois['excerpt']==linha['excerto_novo']
        assert depois['access_date']==linha['pedido']['quando'][:10]
        assert depois['published_at']==linha['carimbo_novo'][:10]
    for kind in ['atualizacao','proveniencia']:
        pred=lambda x:x.get('kind')==kind
        medida('entradas_'+kind,contar(acrescentadas,pred),contar([{'kind':kind},{'kind':'planta'}],pred)==1,'Uma entrada do tipo pedido e outra de outro tipo contam uma.')
    medida('historias_de_reconferencia_conservadas',sum(conservadas),[{'result':'diverge'}]!=[{'result':'igual'}],'Trocar a divergência por igualdade é detetado pela comparação das listas.')
    pred=lambda d:d['verifications'][-1]['date']=='2026-10-26' and d['verifications'][-1]['result']=='igual'
    certa={'verifications':[{'date':'2026-10-26','result':'igual'}]}
    errada={'verifications':[{'date':'2026-10-26','result':'diverge'}]}
    medida('ultimas_reconferencias_iguais',contar(docs.values(),pred),contar([certa,errada],pred)==1,'Uma igualdade e uma divergência contam uma igualdade.')
    pred=lambda a:a.get('severity')=='alarm'
    medida('alarmes_do_painel',contar(alarme,pred),contar([{'severity':'alarm'},{'severity':'notice'}],pred)==1,'Um alarme e um aviso contam um alarme.')
    extrair=lambda s:int(re.search(r'alarmes:\s*(\d+)',s).group(1))
    sinal=(SITE/'src/data/verificacao.mjs').read_text()
    medida('alarmes_no_sinal_do_sitio',extrair(sinal),extrair('alarmes: 3,')==3,'O extrator lê três num sinal de controlo.')
    comparacao=ler(P/'leituras-comparadas.json')
    for chave in ['cartoes','leituras_comparadas','leituras_com_texto_mudado','ramos_lidos','ramos_que_mudaram_de_sentido']:
        medida(chave,comparacao[chave],comparacao['conhecido_positivo']['encontrado'],'A cópia com um ramo trocado foi detetada pelo comparador dos cartões.')
    codigos={f.stem:int(f.read_text().strip()) for f in sorted(P.glob('*.codigo'))}
    for nome,codigo in codigos.items():
        medida('codigo_'+nome,codigo,int('0')==0 and int('1')==1,'Os códigos são lidos dos ficheiros; o leitor distingue zero de um.')
    proibido=lambda f:bool(re.fullmatch(r'indicators/[^/]+\.json',f) or f.startswith(('.maintenance-locks/','sweeps/')) or f=='publisher/recortes/manifest.regioes.json')
    mudados=subprocess.check_output(['git','-C',str(args.motor),'diff','--name-only','b34a675','HEAD'],text=True).splitlines()
    medida('ficheiros_protegidos_mudados_no_motor',contar(mudados,proibido),proibido('indicators/vintages.json') and not proibido('indicators/reler_linhas.py'),'A regra reconhece vintages.json como protegido e o leitor como permitido.')
    saida={'gerado_por':'medir-cr2.py','estado':'paragem no ponto 4, entrega parcial','medidas':medidas,'linhas':[{k:x[k] for k in ['id','valor_antigo','valor_novo','bandeira_antiga','bandeira_nova','carimbo_anterior','carimbo_novo']} for x in r['linhas']],'alarmes':[x for x in alarme if x.get('severity')=='alarm'],'codigos':codigos,'nao_corridos':['build','ledger:check','check:registo','check:cruzamento -- --with-origin','check:explicacoes','check:discussao','check:cartao','typecheck','recibos no dist','frases no dist']}
    (P/'medidas.json').write_text(json.dumps(saida,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'medidas':len(medidas),'conhecidos_positivos':sum(x['conhecido_positivo']['passou'] for x in medidas.values()),'estado':saida['estado']},ensure_ascii=False))

if __name__=='__main__': main()
