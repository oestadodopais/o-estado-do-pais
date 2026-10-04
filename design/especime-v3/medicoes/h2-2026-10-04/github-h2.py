#!/usr/bin/env python3
"""Conserva a única corrida autorizada e a premissa I194 medida no runner.
Uso: python3 <este guião>. Requer gh autenticado; não publica nem altera nada.
"""
import hashlib, json, re, subprocess
from pathlib import Path

pasta=Path(__file__).resolve().parent
corrida='37238803296'
comando=['gh','run','view',corrida]
meta=json.loads(subprocess.check_output(comando+['--json','databaseId,headSha,status,conclusion,jobs,url'],text=True))
assert meta['status']=='completed','A corrida ainda não terminou.'
assert meta['conclusion']=='success','O portão remoto não acabou verde.'
cabeca=(pasta/'portoes/cabeca').read_text().strip()
assert meta['headSha']==cabeca,'A corrida não é desta cabeça.'
bruto=subprocess.check_output(comando+['--log'],text=True)
casos=[json.loads(l.split('I194 ',1)[1]) for l in bruto.splitlines() if 'I194 {' in l]
assert len(casos)==1,'Esperava a medida da substituição, sem duplicados.'
c=casos[0]
assert c['mordeu'] and c['codigo_da_troca']==0 and c['passos_da_troca']==1
assert c['antes']['resumo']==c['depois']['resumo']
assert c['antes']['escrito']==c['depois']['escrito']
assert c['antes']['inode']!=c['depois']['inode']
assert 'ubuntu-24.04' in bruto,'O registo não confirma a imagem do runner.'
# Não guardar a árvore do runner nem os diretórios do portátil.
limpo=re.sub(r'/(?:home|Users)/[^\s"\'<>]+','<arvore-do-anfitriao>',bruto)
for origem in [str(Path.cwd()),str(Path.home())]:
    limpo=limpo.replace(origem,'<pasta-local>')
(pasta/'github-ensaio.log').write_text(limpo)
(pasta/'github-ensaio.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
prova=dict(corrida=int(corrida),cabeca=cabeca,imagem='ubuntu-24.04',casos=casos,
    comando=' '.join(comando)+' --log',log_sha256=hashlib.sha256(limpo.encode()).hexdigest(),
    conhecido_positivo=dict(o_que='mesma cabeça, imagem no log, cópia com bytes e hora iguais, inode distinto e D a recusar',encontrado=True))
(pasta/'github-i194.json').write_text(json.dumps(prova,ensure_ascii=False,indent=2)+'\n')
historico=[]
for tentativa in ['1','2']:
    historico.append(json.loads(subprocess.check_output(['gh','run','view','37199669028','--attempt',tentativa,'--json','databaseId,attempt,headSha,status,conclusion,url'],text=True)))
assert historico[0]['headSha']==historico[1]['headSha']
assert [h['conclusion'] for h in historico]==['failure','success']
(pasta/'github-historico.json').write_text(json.dumps(dict(comando='gh run view 37199669028 --attempt <tentativa> --json databaseId,attempt,headSha,status,conclusion,url',tentativas=historico),ensure_ascii=False,indent=2)+'\n')
print(f"Corrida {corrida}: verde; I194 medida no ubuntu-24.04.")
