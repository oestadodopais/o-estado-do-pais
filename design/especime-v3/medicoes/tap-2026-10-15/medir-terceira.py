"""Mede diferenças e sela as provas da terceira passagem, sem gravar caminhos locais."""
import argparse,collections,hashlib,json,subprocess
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--motor',type=Path,required=True);p.add_argument('--selar',action='store_true');a=p.parse_args()
out=Path(__file__).resolve().parent;study=a.motor/'content/22 TAP'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(name,data):(out/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def git(*args):return subprocess.check_output(['git','-C',str(a.motor),*args])
def historic(rev):return git('show',rev+':content/22 TAP/ledger.json')
def compare(before,after,old,new):
    x={r['id']:r for r in json.loads(old)['claims']};y={r['id']:r for r in json.loads(new)['claims']}
    assert x.keys()==y.keys(),'A passagem não autoriza linhas novas ou removidas'
    return {'antes':before,'depois':after,'total':len(y),'ledger_antes_sha256':hashlib.sha256(old).hexdigest(),'ledger_depois_sha256':hashlib.sha256(new).hexdigest(),'linhas':[{'id':id,'campos':[k for k in sorted(x[id].keys()|y[id].keys()) if x[id].get(k)!=y[id].get(k)]} for id in y if x[id]!=y[id]]}
old=historic('1e920bf');new=(study/'ledger.json').read_bytes()
third=compare('1e920bf','árvore da terceira passagem',old,new)
assert all(r['value']==s['value'] for r,s in zip(json.loads(old)['claims'],json.loads(new)['claims']))
assert git('show','1e920bf:publisher/tap.py')==(a.motor/'publisher/tap.py').read_bytes(),'Réguas do gerador alteradas'
head=git('rev-parse','HEAD').decode().strip()
if git('show','HEAD:content/22 TAP/ledger.json')==new:third['depois']=head
write('comparacao-linhas-terceira.json',{'segunda':compare('449c862','1e920bf',historic('449c862'),old),'terceira':third,'valores_numericos_inalterados':True,'gerador_inalterado_sha256':digest(a.motor/'publisher/tap.py')})
print('Comparação documental medida.')
if not a.selar:raise SystemExit(0)
assert not git('status','--porcelain').strip(),'Motor não está limpo'
gate=json.loads((out/'terceira-motor-prova.json').read_text());test=json.loads((out/'terceira-teste-prova.json').read_text())
assert gate['cabeca']==test['cabeca']==head
assert gate['codigo']==test['codigo']==0
assert gate['arvore_limpa_antes_e_depois'] and test['arvore_limpa_antes_e_depois']
log=(out/'terceira-publisher.tap_test.log').read_text();groups=collections.defaultdict(list)
for line in log.splitlines():
    if not line.startswith('PASS planta: '):continue
    label=line.removeprefix('PASS planta: ').split('; ',1)[0]
    group='colunas: falta área' if label.startswith('colunas ') else 'página fora dos limites' if label in ('página fora do documento','página após o fim') else label
    groups[group].append(label)
result=next(line for line in log.splitlines() if line.startswith('PASS TAP:'))
write('terceira-plantas.json',{'plantas_distintas':len(groups),'execucoes':sum(map(len,groups.values())),'criterio':'Uma operação plantada por grupo; remoção da caixa repetida por seletor e limites inferior/superior de página agrupados.','grupos':groups,'resultado':result})
files=['ledger.json','extracoes.json','plantas.json','fontes.json','conferencia-terceira.json','source/MANIFEST.sha256']
logs=['terceira-motor.log','terceira-publisher.tap_test.log','terceira-motor-prova.json','terceira-teste-prova.json','terceira-plantas.json','terceira-commit-motor.log','comparacao-linhas-terceira.json','terceira-conferencia-visual.json']
write('entrega-terceira.json',{'commit_motor':head,'core_gate_conteudo_commit':gate['cabeca'],'core_gate_codigo':gate['codigo'],'core_gate_duracao_s':gate['duracao_s'],'tap_test_conteudo_commit':test['cabeca'],'tap_test_codigo':test['codigo'],'tap_test_duracao_s':test['duracao_s'],'tap_test_resultado':result,'arvore_limpa_antes_e_depois':True,'fontes_sha256':{f:digest(study/f) for f in files},'gerador_sha256':digest(out/'gerar-relatorio.py'),'gerador_motor_sha256':digest(a.motor/'publisher/tap.py'),'teste_motor_sha256':digest(a.motor/'publisher/tap_test.py'),'involucro_sha256':digest(out/'executar-prova.py'),'medidor_sha256':digest(Path(__file__)),'registos_sha256':{f:digest(out/f) for f in logs},'tokens_used':'não exposto','exportacao_para_paginas':False,'limite':'As réguas dos achados 8 e 9 não foram alteradas; datas ISO do decreto conferidas documentalmente.'})
print('Entrega selada na cabeça '+head)
