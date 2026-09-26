#!/usr/bin/env python3
"""Confere os excertos do RP1 nos corpos registados pelo cliente do projeto."""
import hashlib
import html
import json
import os
import re
import subprocess
from pathlib import Path
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[3]
MOTOR=Path(os.environ.get('RP1_MOTOR',str(Path.home()/'Instruments/ResearchHub/.worktrees/rp1-2026-09-26')))

def normal(s): return ' '.join(s.split())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    codigo="import {ORIGENS_RP1} from './src/data/origens-rp1.mjs';console.log(JSON.stringify(ORIGENS_RP1));"
    origens=json.loads(subprocess.check_output(['node','--input-type=module','-e',codigo],cwd=RAIZ))
    conferidas=[]
    for chave,o in origens.items():
        selo=o['selo']; p=MOTOR/selo['motor']
        assert sha(p)==selo['sha256'],chave+': corpo alterado'
        pedidos=[json.loads(l) for l in (p.parent/'pedidos.jsonl').read_text().splitlines()]
        r=[r for r in pedidos if r['file']==p.name and r['sha256']==selo['sha256']]
        assert len(r)==1,chave+': pedido não identificado'
        r=r[0]
        assert (r['url'],r['timestamp_utc'],r['cliente'])==(o['url'],selo['hora'],selo['cliente']),chave
        assert o['lido']==selo['hora'][:10] and str(r['http'])=='200',chave
        if p.parent.name.startswith('rp1-'):
            alojada=MOTOR/'content/13 Dominios/source/rp1'/p.name
            assert alojada.read_bytes()==p.read_bytes(),chave+': alojamento divergente'
        if selo.get('extracao'):
            p=MOTOR/selo['extracao']['ficheiro']
            assert sha(p)==selo['extracao']['sha256'],chave+': extração alterada'
            texto=normal(p.read_text())
        else:
            texto=p.read_text()
            if p.suffix=='.json':
                d=json.loads(texto)
                campo=selo['campo']
                if campo=='extension.description, texto normalizado':
                    texto=html.unescape(re.sub('<[^>]*>',' ',d['extension']['description']))
                elif campo=='Dimensoes.Categoria_Dim[dim_num=3,categ_cod=04].categ_dsg':
                    categorias=[c for grupo in d[0]['Dimensoes']['Categoria_Dim'] for itens in grupo.values() for c in itens if c['dim_num']=='3' and c['categ_cod']=='04']
                    assert len(categorias)==1,chave
                    texto=categorias[0]['categ_dsg']
                else:
                    assert campo=='Dimensoes.Descricao_Dim[0].nota_dsg'
                    texto=d[0]['Dimensoes']['Descricao_Dim'][0]['nota_dsg']
            else:
                texto=re.sub(r'<(script|style)\b[^>]*>.*?</\1>',' ',texto,flags=re.S|re.I)
                texto=html.unescape(re.sub('<[^>]*>',' ',texto))
            texto=normal(texto)
        assert normal(o['excerto']) in texto,chave+': excerto não literal'
        conferidas.append(dict(origem=chave,sha256=selo['sha256'],literal=True,pedido=True))
    (AQUI/'origens-provadas.json').write_text(json.dumps(conferidas,ensure_ascii=False,indent=2)+'\n')
    print(f'Origens RP1: {len(conferidas)} excertos, corpos, pedidos e selos conferidos.')
if __name__=='__main__':main()
