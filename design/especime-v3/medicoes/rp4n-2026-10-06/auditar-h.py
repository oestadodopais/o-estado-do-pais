"""RP4-n-h: relê o registo original, a cópia e os achados plantados sem caminhos locais."""
from pathlib import Path
import os,json,subprocess,hashlib,re
site=Path.cwd();motor=Path(os.environ['RESEARCHHUB_DIR']);b=Path(__file__).parent;out=b/'h';out.mkdir(exist_ok=True)
def git(p,*args):return subprocess.check_output(['git',*args],cwd=p,text=True).strip()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def escreve(nome,obj):(out/nome).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
base_s='66852410165e7f38b0bd42757e848681e0468db1';base_m='542fe4ee9d67ecf2245892fd98ccd1c442829704'
m=json.loads((motor/'publisher/recortes/pensao-rp4n.json').read_text());a=m['alojamento'];rel=Path(a['manifesto']).parent
principal=Path(git(motor,'rev-parse','--path-format=absolute','--git-common-dir')).parent
copias=[];pedidos=[]
for nome,raiz in [('worktree',motor),('arvore-principal',principal)]:
 pasta=raiz/rel
 for f in sorted(pasta.rglob('*')):
  if not f.is_file():continue
  item={'arvore':nome,'ficheiro':str(f.relative_to(raiz)),'bytes':f.stat().st_size,'sha256':sha(f)}
  copias.append(item)
  if f.suffix=='.json':
   d=json.loads(f.read_text())
   if d.get('sha256')==m['pdf_sha256']:pedidos.append(item)
assert not pedidos,'Um pedido apareceu: rever o ramo de alojamento antes de fechar.'
pdf=motor/m['pdf'];assert sha(pdf)==m['pdf_sha256']
origem=principal/rel/a['ficheiro'];assert sha(origem)==sha(pdf)
original=git(motor,'show',a['commit']+':'+a['manifesto'])+'\n'
assert hashlib.sha256(original.encode()).hexdigest()==a['manifesto_sha256']
assert m['pdf_sha256']+'  '+a['ficheiro'] in original
msg=git(motor,'show','-s','--format=%B',a['commit']);nota=next(x for x in msg.splitlines() if 'Os PDFs ficam fora de git' in x)
prova=json.loads((motor/'content/13 Dominios/pensao-rp4n.json').read_text())['pensao-legal']['alojada']['prova_data']
reg={'cabeca_motor':git(motor,'rev-parse','HEAD'),'pdf':m['pdf'],'pdf_sha256':sha(pdf),'bytes':pdf.stat().st_size,'prova':prova,'manifesto_original':original,'nota_do_commit':nota,'data_commit':git(motor,'show','-s','--format=%cI',a['commit']),'inventario_source':copias,'pedidos_com_estes_bytes':pedidos,'pdf_ignorado':git(motor,'check-ignore',str(rel/a['ficheiro']))}
escreve('pensao-prova.json',reg)
agua=git(site,'show',base_s+':src/data/o-que-e-das-familias.mjs')
linha=git(site,'show',base_s+':ledger/claims/penalizacao-antecipacao-um-ano-neutra.yml')
oe=git(motor,'show',base_m+':publisher/oe1_build.py')
r=json.loads((b/'g/reescrita.json').read_text())
confirmacoes={'sitio':base_s,'motor':base_m,'agua':'noventa e três por cento' in agua,'pensao':'one year early' in agua,'data_na_base':re.search(r'access_date: (.+)',linha)[1],'denominador':'pela «DESPESA TOTAL»' in oe,'pares_da_reescrita':len(r['pares'])}
assert all(confirmacoes[k] for k in ['agua','pensao','denominador'])
escreve('plantas-da-direcao.json',confirmacoes)
pdfmapa=motor/'content/13 Dominios/source/rp4n/mapa4-g.pdf'
texto=subprocess.check_output(['pdftotext','-layout','-f','6','-l','6',str(pdfmapa),'-'],text=True)
nota=texto.split('Nota:')[1].replace('\f','').strip();assert 'DESPESA TOTAL CONSOLIDADA' in nota
escreve('mapa4-nota.json',{'ficheiro':str(pdfmapa.relative_to(motor)),'sha256':sha(pdfmapa),'pagina':6,'nota':nota,'decisao':'A nota define as exclusões da despesa consolidada, não enumera diretamente o que a DESPESA TOTAL inclui. Conserva-se a frase, como manda o achado 13.'})
f='publisher/manifest.evora.json'
escreve('rp4n-16.json',{'questao':'RP4N-16','ficheiro':f,'base':base_m,'blob_base':git(motor,'rev-parse',base_m+':'+f),'blob_agora':git(motor,'hash-object',f),'decisao':'Caminho local herdado, juntar à lista JD1-9; não alterado nesta passagem.'})
for nome,p,base in [('sitio',site,base_s),('motor',motor,base_m)]:
 commits=[]
 for c in git(p,'rev-list','--reverse',base+'..HEAD').splitlines():
  msg=git(p,'show','-s','--format=%B',c)
  co='Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>'
  sess='Claude-Session: https://claude.ai/code/session_01FHYNTtspyh84DJTCarQ444'
  assert (co+'\n'+sess in msg) if nome=='sitio' else (co in msg and 'Claude-Session:' not in msg)
  commits.append({'sha':c,'titulo':git(p,'show','-s','--format=%s',c)})
 escreve('commits-'+nome+'.json',{'base':base,'cabeca':git(p,'rev-parse','HEAD'),'commits':commits})
print('RP4N-h: prova do alojamento, nota, plantas da direção e trailers conferidos.')
