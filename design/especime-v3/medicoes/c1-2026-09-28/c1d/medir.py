"""Confere a C1d contra o Git, o livro, os corpos e os códigos efetivos."""
import argparse
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
import subprocess
import sys
import tarfile
sys.dont_write_bytecode = True
import yaml
from html.parser import HTMLParser
AQUI = Path(__file__).resolve().parent
BLOCO = AQUI.parent
SITIO = AQUI.parents[4]
BASE = '7b4328906d938bd6eeecb8f1e1fc18c1b809e964'
BASE_MOTOR = '1e77ce06b0053acbcab73c6650ab52983a61c44f'
def git(*args, repo=SITIO):
    return subprocess.check_output(['git', *args], cwd=repo, text=True).strip()
def ler(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def commits(repo, base):
    return [dict(zip(('hash','assunto'), x.split(' ',1))) for x in git('log','--reverse','--format=%H %s',f'{base}..HEAD',repo=repo).splitlines()]
class Texto(HTMLParser):
    def __init__(self): super().__init__(); self.partes=[]; self.ignorar=0
    def handle_starttag(self,t,a):
        if t in ('script','style'): self.ignorar+=1
    def handle_endtag(self,t):
        if t in ('script','style'): self.ignorar=max(0,self.ignorar-1)
    def handle_data(self,d):
        if not self.ignorar: self.partes.append(d)

def medir(motor, final):
    erros=[]
    def exige(ok, msg):
        if not ok: erros.append(msg)
    spec=importlib.util.spec_from_file_location('detetor_c1',BLOCO/'medir-c1.py')
    detetor=importlib.util.module_from_spec(spec);spec.loader.exec_module(detetor)
    achados=[];total=0
    for rot,repo,base in [('sítio',SITIO,'48a5a1c181c1753036d301204884c57119bba8a5'),('motor',motor,'4eb2867936dd14ad2654751722e390804e68dda3')]:
        nomes=set(git('diff','--name-only',base,repo=repo).splitlines())|set(git('ls-files','--others','--exclude-standard',repo=repo).splitlines())
        if rot=='sítio':
            nomes={n for n in nomes if n.startswith(('src/','scripts/','tests/','ledger/',str(BLOCO.relative_to(SITIO))+'/')) or n in ('design/especime-v3/INVENTARIO-FRASES.md','design/especime-v3/ISSUES.md','design/especime-v3/critica/REVISOES-DO-INVENTARIO.md')}
            nomes|={str(p.relative_to(repo)) for p in BLOCO.rglob('*') if p.is_file()}
        for nome in sorted(nomes):
            p=repo/nome
            if p.is_file() and '__pycache__' not in p.parts:
                total+=1
                if detetor.tem_caminho(p.read_bytes()): achados.append({'arvore':rot,'ficheiro':nome})
    antigo=git('show','3e83a271f4c5af0b1f6809436916c1b06d6e0b1c:indicators/refresh.py',repo=motor).encode()
    anfitrioes=re.findall(rb'\b[a-z0-9_-]*(?:macbook|imac|mac-mini|macmini)[a-z0-9_.-]*\.local\b',antigo,re.I)
    amostras=detetor.proibidos()+anfitrioes+list(detetor.nomes_dos_autores())+[sys.executable.encode()]
    positivos=[detetor.tem_caminho(x) for x in amostras]
    navegador=b'<a href="'+b'/' + b'home/html/index.en.html">'
    caminhos={'ficheiros':total,'quantidade':len(achados),'achados':achados,'conhecidos_positivos':positivos,
              'anfitrioes_antigos':len(anfitrioes),'nomes_lidos_do_git':len(detetor.nomes_dos_autores()),
              'interpretador_fora_do_repositorio_detetado':positivos[-1],
              'conhecido_negativo_navegacao_web':not detetor.tem_caminho(navegador),
              'ambito':'Ficheiros atuais do construtor desde o C1, pasta integral das provas, inventário, questões, registo das revisões e ficheiros tocados do motor. Exclui documentos da direção que o construtor não editou. Não reescreve commits antigos.',
              'excecoes':'Dois nomes portáveis de intérpretes e atributos de navegação relativa do BCE nos diretórios declarados. Nomes pessoais e caminhos locais continuam conferidos dentro dos atributos.'}
    exige(not achados and all(positivos) and anfitrioes and detetor.nomes_dos_autores() and caminhos['conhecido_negativo_navegacao_web'],'A privacidade ou um conhecido de controlo falhou.')
    arquivo=subprocess.check_output(['git','archive',BASE,'ledger/claims'],cwd=SITIO)
    mudancas=[];contagens={k:0 for k in ('correcao','atualizacao','proveniencia')};n=0
    with tarfile.open(fileobj=io.BytesIO(arquivo)) as t:
        for membro in t.getmembers():
            if not membro.isfile():continue
            a=yaml.safe_load(t.extractfile(membro).read());b=yaml.safe_load((SITIO/membro.name).read_text());n+=1
            for campo in ('value','source_url'):
                if a.get(campo)!=b.get(campo):mudancas.append({'id':a['id'],'campo':campo,'antes':a.get(campo),'depois':b.get(campo)})
            for c in b.get('corrections',[]):contagens[c['kind']]+=1
    exige({(x['id'],x['campo']) for x in mudancas}=={('indice-de-divida-limite-legal','source_url')},'Um valor ou uma fonte mudou fora do mandato C1d.')
    exige(n==len(list((SITIO/'ledger/claims').glob('*.yml'))),'A lista de linhas mudou.')
    limite='ledger/claims/indice-de-divida-limite-legal.yml'
    exige((SITIO/limite).read_bytes()==subprocess.check_output(['git','show',f'a677770f:{limite}'],cwd=SITIO),'O limite não é exatamente o de a677770f.')
    man=ler(SITIO/'ledger/cruzamentos/evora.json')['rows']['indice-de-divida-limite-legal']
    exige(man==json.loads(git('show','a677770f:ledger/cruzamentos/evora.json'))['rows']['indice-de-divida-limite-legal'],'O cruzamento do limite difere de a677770f.')
    excertos=ler(AQUI/'excertos.json')
    exige(len(excertos['linhas'])==17,'A lista dos excertos não tem as dezassete entradas.')
    for r in excertos['linhas']:
        l=yaml.safe_load((SITIO/'ledger/claims'/f"{r['id']}.yml").read_text())
        cs=[c for c in l['corrections'] if c['kind']=='proveniencia' and c.get('field')=='excerpt']
        exige(len(cs)==1 and cs[0]==r['entrada'] and cs[0]['new_value']==l['excerpt'] and l['access_date']==r['access_date_conservado'] and l['value']==r['value'],f"História do excerto em falta: {r['id']}.")
    bandeiras=ler(AQUI/'bandeiras-provadas.json')
    for r in bandeiras['linhas']:
        p=AQUI/r['corpo']; exige(sha(p)==r['sha256'],'Um corpo de bandeira perdeu a integridade.')
        js=ler(p);pos=0
        for d,tamanho in zip(js['id'],js['size']):
            idx=js['dimension'][d]['category']['index'];cod=r['coordenada_selada'][d]
            pos=pos*tamanho+(idx.index(cod) if isinstance(idx,list) else idx[cod])
        exige(pos==r['posicao'],'A posição de uma marca diverge da coordenada.')
        for campo in ('value','status'):
            valor=js[campo][pos] if isinstance(js[campo],list) else js[campo][str(pos)]
            exige(valor==r['pedaco_do_corpo'][campo][str(pos)],'O recorte de uma marca difere do corpo alojado.')
    literais=[]
    for cid,r in ler(AQUI/'origens.json').items():
        p=motor/r['selo']['motor'];exige(sha(p)==r['selo']['sha256'],f'O corpo de {cid} mudou.')
        if p.suffix=='.html':
            h=Texto();h.feed(p.read_text());texto=' '.join(' '.join(h.partes).split())
        else: texto=json.dumps(ler(p),ensure_ascii=False)
        contiguo=r['excerto'] in texto
        literais.append({'id':cid,'contiguo':contiguo,'sha256':r['selo']['sha256']})
        exige(contiguo,f'O literal de {cid} não é contíguo.')
    mudados=git('diff','--name-only',BASE_MOTOR,repo=motor).splitlines()
    protegidos=[f for f in mudados if (Path(f).parent==Path('indicators') and f.endswith('.json')) or f.startswith(('.maintenance-locks/','sweeps/')) or f=='publisher/recortes/manifest.regioes.json']
    exige(not protegidos,'Um ficheiro protegido do motor mudou na C1d.')
    estado_motor=ler(AQUI/'motor-commit.arvore.json')
    estado_motor['conferido_com_commit']=git('rev-parse','HEAD',repo=motor)
    estado_motor['bytes_iguais_no_commit']=all(hashlib.sha256(subprocess.check_output(['git','show',f"HEAD:{r['ficheiro']}"],cwd=motor)).hexdigest()==r['sha256'] for r in estado_motor['ficheiros'])
    exige(estado_motor['bytes_iguais_no_commit'] and (AQUI/'motor-commit.codigo').read_text().strip()=='0' and 'GATE: PASS' in (AQUI/'motor-commit.log').read_text(),'O portão do motor não prova a árvore entregue.')
    portoes={}
    for nome in ('build','verify','typecheck'):
        base=BLOCO/'portoes/c1d'/nome
        if Path(str(base)+'.codigo').exists():
            p={k:Path(str(base)+'.'+k).read_text().strip() for k in ('codigo','cabeca','inicio','fim')};p['codigo']=int(p['codigo']);portoes[nome]=p
            exige(p['codigo']==0,f'O portão {nome} não está a zero.')
        else: exige(not final,f'Falta o portão {nome}.')
    capturas=ler(AQUI/'capturas-depois.json') if (AQUI/'capturas-depois.json').exists() else None
    if capturas:
        exige(not capturas['aceitacao']['falhas'],'As capturas têm falhas.')
        for r in capturas['resultados']+capturas['recortes']:exige(sha(AQUI/'capturas'/r['ficheiro'])==r['sha256'],'Uma captura perdeu a integridade.')
        for f,r in ler(AQUI/'paginas-depois/INDICE.json')['copias'].items():exige(sha(AQUI/'paginas-depois'/f)==r['sha256'],'Uma cópia perdeu a integridade.')
        matriz={(l,w) for l in ('pt','en') for w in (390,768,1024,1280,1600)}
        for cid in capturas['idsDeRecibos']:exige({(r['lingua'],r['largura']) for r in capturas['resultados'] if r['familia']==f'recibo-{cid}'}==matriz,'A matriz de um recibo está incompleta.')
    provas={f:ler(AQUI/(f+'.json')) for f in ('historia-proveniencia','historia-valores','plantas-confianca','k17','calendario','recibos-finais','relatorio','custo') if (AQUI/(f+'.json')).exists()}
    if final:
        exige(len(portoes)==3 and len({p['cabeca'] for p in portoes.values()})==1,'Os portões não têm a mesma cabeça.')
        exige(capturas is not None,'Faltam as capturas finais.')
        if len(portoes)==3:
            cabeça=portoes['build']['cabeca']
            exige(all(f.startswith(str(BLOCO.relative_to(SITIO))+'/') for f in git('diff','--name-only',cabeça,'HEAD').splitlines()),'Depois da cabeça medida mudou código fora das provas.')
            exige(capturas is not None and capturas['dist_construido_de']==cabeça,'As capturas são de outra cabeça.')
        exige(len(provas)==8,'Faltam provas isoladas da C1d.')
        exige(provas.get('relatorio',{}).get('numeros_sem_ficheiro')==0 and provas.get('relatorio',{}).get('conhecido_positivo',{}).get('encontrado'),'O relatório não está conferido a zero.')
        exige(not provas.get('recibos-finais',{}).get('erros',['em falta']),'Os recibos finais têm falhas.')
    exige(not provas.get('k17',{}).get('erros'),'A K17 tem erros.')
    return {'base':BASE,'base_motor':BASE_MOTOR,'cabeca_sitio':git('rev-parse','HEAD'),'cabeca_motor':git('rev-parse','HEAD',repo=motor),
        'commits':{'sitio':commits(SITIO,'48a5a1c181c1753036d301204884c57119bba8a5'),'motor':commits(motor,'4eb2867936dd14ad2654751722e390804e68dda3')},
        'linhas_conferidas':n,'mudancas_de_valor_ou_endereco':mudancas,'contagens_registo':contagens,'caminhos':caminhos,
        'protegidos_motor_alterados':protegidos,'portao_motor':{'codigo':int((AQUI/'motor-commit.codigo').read_text()),'cabeca_dos_bytes_conferidos':estado_motor['conferido_com_commit']},'arvore_do_portao_motor':estado_motor,'portoes':portoes,'excertos':excertos,'bandeiras':bandeiras,
        'literais':literais,'provas':provas,'capturas':None if capturas is None else {'paginas':len(capturas['resultados']),'recortes':len(capturas['recortes']),'cabeca':capturas['dist_construido_de'],'falhas':capturas['aceitacao']['falhas']},'erros':erros}
if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--motor',type=Path,required=True);ap.add_argument('--final',action='store_true');ap.add_argument('--verifica',action='store_true');args=ap.parse_args()
    r=medir(args.motor,args.final or args.verifica)
    if not args.verifica:
        (AQUI/'medidas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
        geral=ler(BLOCO/'medidas.json');geral['C1d']=r;(BLOCO/'medidas.json').write_text(json.dumps(geral,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'linhas':r['linhas_conferidas'],'caminhos':r['caminhos'],'erros':r['erros']},ensure_ascii=False,indent=2))
    raise SystemExit(bool(r['erros']))
