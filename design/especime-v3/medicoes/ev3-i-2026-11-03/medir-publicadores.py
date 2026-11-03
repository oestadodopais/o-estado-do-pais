"""Confere os publicadores EV3 no texto alojado; recebe a raiz do motor."""
from pathlib import Path
import sys,json
motor=Path(sys.argv[1]).resolve();sys.path.insert(0,str(motor))
from publisher.oe2027_analise import pages,norm
from publisher.publicadores import publicador
pasta=Path(__file__).parent
prova=json.loads((pasta/'publicadores.json').read_text())
for p in prova:
 texto=norm(' '.join(pages(p['arquivo'])))
 ocorrencias=texto.casefold().count(p['publicador'].casefold())
 assert ocorrencias==p['ocorrencias'] and ocorrencias>0,p['ficheiro']
 print(p['ficheiro'],p['publicador'],ocorrencias)
livro=motor/'content/19 Évora 2027 Capital Europeia da Cultura/Technical Source/outubro-2026/ledger.json'
linhas=json.loads(livro.read_text())['claims']
for row in linhas:
 nome=publicador(row)
 assert nome==row['publisher'],row['id']
 assert norm(' '.join(pages(row['document']['file']))).casefold().count(nome.casefold())>0,row['id']
print('Cobertura do registo fechado:',len(linhas),'linhas EV3; todas conferidas.')
