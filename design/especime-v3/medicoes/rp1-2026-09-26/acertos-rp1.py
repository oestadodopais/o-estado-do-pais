#!/usr/bin/env python3
"""Prova cada acerto e a igualdade das leituras restantes, incluindo as do L1."""
import hashlib
import copy
import json
import subprocess
from pathlib import Path
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[3]
BASE='38d3627894416097de26c52346c595c45a7b2884'
def main():
    registo=json.loads((AQUI/'acertos-rp1.json').read_text())
    antigo=subprocess.check_output(['git','show',BASE+':src/data/leituras-das-medidas.mjs'],cwd=RAIZ,text=True)
    codigo="""import {LEITURAS_RP1 as fonte} from './design/observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs';
import {LEITURAS_DAS_MEDIDAS as atual} from './src/data/leituras-das-medidas.mjs';
const {LEITURAS_DAS_MEDIDAS: anterior}=await import('data:text/javascript;base64,'+Buffer.from(ANTIGO).toString('base64'));
console.log(JSON.stringify({fonte,atual,anterior}));""".replace('ANTIGO',json.dumps(antigo))
    d=json.loads(subprocess.check_output(['node','--input-type=module','-e',codigo],cwd=RAIZ))
    esperado={id:copy.deepcopy(d['fonte'][id]) for id in registo['publicadas']}
    auditoria=json.loads((RAIZ/'tests/cartao/leituras-provadas.json').read_text())
    for a in registo['acertos']:
        alvo=esperado[a['id']][a['lang']]
        for k in a['caminho'][:-1]:alvo=alvo[k]
        k=a['caminho'][-1]
        assert alvo[k]==a['antes'],a
        alvo[k]=a['depois']
        m=next(m for m in auditoria['medidas'] if m['id']==a['id'])
        apoios=[ap for f in m['folhas'] for p in f['partes'] for ap in p.get('apoios',[])]+[ap for n in m['algarismos'] for ap in n['apoios']]
        for ap in a['apoios']:
            assert any(x.get('origem')==ap.get('origem') and x.get('linha')==ap.get('linha') and x['campo']==ap['campo'] and ap['literal'] in x['literal'] for x in apoios),(a['id'],ap)
    assert {**d['anterior'],**esperado}==d['atual'],'Alteração fora dos acertos ou das medidas autorizadas'
    assert set(registo['paradas'])==set(d['fonte'])-set(esperado)
    resultado=dict(redacao='terceira', fonte_sha256=hashlib.sha256((RAIZ/registo['fonte']).read_bytes()).hexdigest(), acertos=len(registo['acertos']),medidas_novas=len(esperado),leituras_antigas_intactas=len(d['anterior']),diferencas_fora_dos_acertos=0)
    (AQUI/'acertos-provados.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(resultado,ensure_ascii=False))
if __name__=='__main__':main()
