#!/usr/bin/env python3
"""Extrai do ficheiro do IMPIC os contratos cujo adjudicante tem o NIF dado,
sem carregar o ficheiro todo em memoria: procura o NIF e delimita o objeto JSON."""
import json,sys,re
path=sys.argv[1]; nif=sys.argv[2]
data=open(path,encoding='utf-8').read()
alvo=f'"adjudicante":["{nif} '
out=[]
pos=0
while True:
    k=data.find(alvo,pos)
    if k<0: break
    # recuar ate ao '{' que abre o objeto
    i=data.rfind('{"idcontrato"',0,k)
    # avancar ate fechar o objeto: contagem de chavetas fora de strings
    depth=0; j=i; instr=False; esc=False
    while j<len(data):
        c=data[j]
        if esc: esc=False
        elif c=='\\': esc=True
        elif c=='"': instr=not instr
        elif not instr:
            if c=='{': depth+=1
            elif c=='}':
                depth-=1
                if depth==0: break
        j+=1
    try:
        out.append(json.loads(data[i:j+1]))
    except Exception as e:
        print("FALHOU em",i,e,file=sys.stderr)
    pos=j+1
json.dump(out,open(sys.argv[3],'w',encoding='utf-8'),ensure_ascii=False)
print(f"{path}: {len(out)} contratos com adjudicante NIF {nif}")
