"""Mede a C1e, incluindo a paragem real do livro, sem a converter em sucesso."""
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
AQUI=Path(__file__).resolve().parent
BLOCO=AQUI.parent
SITIO=AQUI.parents[4]
BASE='5c862efb38055965618a9d29f26ac12a25ac99eb'
BASE_MOTOR='1af04566898ddfc2c5244c55c7f229b1c287fee2'
def git(*args,repo=SITIO):return subprocess.check_output(['git',*args],cwd=repo,text=True).strip()
def ler(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def medir(motor,final):
    erros=[]
    def exige(ok,msg):
        if not ok:erros.append(msg)
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
                if detetor.tem_caminho(p.read_bytes()):achados.append({'arvore':rot,'ficheiro':nome})
    antigo=git('show','3e83a271f4c5af0b1f6809436916c1b06d6e0b1c:indicators/refresh.py',repo=motor).encode()
    anfitrioes=re.findall(rb'\b[a-z0-9_-]*(?:macbook|imac|mac-mini|macmini)[a-z0-9_.-]*\.local\b',antigo,re.I)
    positivos=[detetor.tem_caminho(b) for b in detetor.proibidos()+anfitrioes+list(detetor.nomes_dos_autores())+[sys.executable.encode()]]
    caminhos={'ficheiros':total,'quantidade':len(achados),'achados':achados,'conhecidos_positivos':positivos,'anfitrioes':len(anfitrioes),'nomes_lidos_do_git':len(detetor.nomes_dos_autores())}
    exige(not achados and all(positivos) and anfitrioes and detetor.nomes_dos_autores(),'Falhou a privacidade ou um conhecido-positivo.')
    arquivo=subprocess.check_output(['git','archive',BASE,'ledger/claims'],cwd=SITIO)
    mudancas=[];n=0;recibos=[]
    with tarfile.open(fileobj=io.BytesIO(arquivo)) as t:
        for m in t.getmembers():
            if not m.isfile():continue
            a=yaml.safe_load(t.extractfile(m).read());b=yaml.safe_load((SITIO/m.name).read_text());n+=1
            if a!=b:
                mudancas.append(a['id'])
                esperado=json.loads(json.dumps(a))
                for c in esperado.get('corrections',[]):
                    if c.get('kind')=='proveniencia' and c.get('field')=='access_date':c['reason_en']=c['reason_en'].replace('the value 49.3.','the value 49,3.')
                exige(a['id']=='divida-das-familias-2025-ue' and b==esperado,'Uma linha mudou fora da razão inglesa autorizada.')
            motivos=[]
            if b.get('derived_from') and not b.get('verifications'):motivos.append('segunda leitura da linha calculada')
            if any(v['result']=='inacessivel' for v in b.get('verifications',[])[-2:]):motivos.append('tentativa sem valor lido')
            if b['id']=='divida-das-familias-2025-ue':motivos.append('razão inglesa com vírgula')
            if motivos:recibos.append({'id':b['id'],'motivos':motivos})
    exige(mudancas==['divida-das-familias-2025-ue'],'A alteração autorizada da razão não está isolada.')
    protegidos=[f for f in git('diff','--name-only',BASE_MOTOR,repo=motor).splitlines() if (Path(f).parent==Path('indicators') and f.endswith('.json')) or f.startswith(('.maintenance-locks/','sweeps/')) or f=='publisher/recortes/manifest.regioes.json']
    exige(not protegidos,'Mudou um ficheiro protegido do motor.')
    provas={k:ler(AQUI/(k+'.json')) for k in ('proveniencia','paragem-prr','plantas-confianca','calendario-memoria','privacidade-dist-anterior','motor-rede-real','relatorio','custo') if (AQUI/(k+'.json')).exists()}
    exige(len(provas.get('proveniencia',{}).get('erros_do_livro',[]))==16,'A paragem medida mudou; é preciso voltar a lê-la.')
    for p in provas.get('proveniencia',{}).get('plantas',[]):exige(p['mordeu'],'Uma planta de proveniência não mordeu.')
    for p in provas.get('plantas-confianca',{}).get('plantas',[]):exige(p['passou'],'Uma planta de recibo não mordeu.')
    for p in provas.get('plantas-confianca',{}).get('controlos',[]):exige(p['passou'],'Um controlo de confiança falhou.')
    for p in provas.get('calendario-memoria',{}).get('paginas',[]):exige(not p['erros'] and all(x['passou'] for x in p['plantas']),'Falhou o calendário em memória.')
    exige(provas.get('privacidade-dist-anterior',{}).get('passou'),'Falhou a guarda sobre a construção anterior.')
    exige(provas.get('motor-rede-real',{}).get('quantidade')==provas.get('motor-rede-real',{}).get('passaram')==16,'Falhou uma prova do cliente real.')
    exige((AQUI/'cruzamento.codigo').read_text().strip()=='0','A travessia isolada não passou.')
    portoes={}
    for nome in ('build','verify','typecheck'):
        base=BLOCO/'portoes/c1e'/nome
        if Path(str(base)+'.codigo').exists():
            r={k:Path(str(base)+'.'+k).read_text().strip() for k in ('codigo','cabeca','inicio','fim')};r['codigo']=int(r['codigo']);portoes[nome]=r
            exige(r['codigo']==(0 if nome=='typecheck' else 1),f'O código de {nome} difere da paragem esperada.')
    motor_gate=None
    if (AQUI/'motor-commit.codigo').exists():
        estado=ler(AQUI/'motor-commit.arvore.json')
        iguais=all(hashlib.sha256(subprocess.check_output(['git','show',f"HEAD:{r['ficheiro']}"],cwd=motor)).hexdigest()==r['sha256'] for r in estado['ficheiros'])
        motor_gate={'codigo':int((AQUI/'motor-commit.codigo').read_text()),'cabeca':git('rev-parse','HEAD',repo=motor),'arvore_medida':estado,'bytes_iguais':iguais}
        exige(motor_gate['codigo']==0 and iguais and 'GATE: PASS' in (AQUI/'motor-commit.log').read_text(),'O portão do motor não prova os bytes entregues.')
    dist=ler(SITIO/'dist/version.json')['commit']
    if final:
        exige(len(portoes)==3 and len({x['cabeca'] for x in portoes.values()})==1,'Faltam os três códigos da mesma cabeça.')
        exige(motor_gate is not None,'Falta o portão do motor.')
        exige(provas.get('relatorio',{}).get('numeros_sem_ficheiro')==0 and provas.get('relatorio',{}).get('conhecido_positivo',{}).get('encontrado'),'O relatório não está conferido.')
        if portoes:
            cabeça=portoes['build']['cabeca']
            exige(dist!=cabeça,'A construção bloqueada foi contornada.')
            exige(all(f.startswith(str(BLOCO.relative_to(SITIO))+'/') for f in git('diff','--name-only',cabeça,'HEAD').splitlines()),'Mudou código depois dos portões.')
    commits={rot:[dict(zip(('hash','assunto'),x.split(' ',1))) for x in git('log','--reverse','--format=%H %s',base+'..HEAD',repo=repo).splitlines()] for rot,repo,base in [('sitio',SITIO,'48a5a1c181c1753036d301204884c57119bba8a5'),('motor',motor,'4eb2867936dd14ad2654751722e390804e68dda3')]}
    return {'base':BASE,'base_motor':BASE_MOTOR,'cabeca_sitio':git('rev-parse','HEAD'),'cabeca_motor':git('rev-parse','HEAD',repo=motor),'commits':commits,'linhas_conferidas':n,'linhas_alteradas':mudancas,'valores_alterados':0,'protegidos_motor_alterados':protegidos,'portoes':portoes,'motor':motor_gate,'caminhos':caminhos,'provas':provas,'capturas':{'estado':'por fazer, construção parada pela história do PRR','dist_anterior':dist,'recibos_a_captar':recibos,'quantidade_de_recibos':len(recibos),'edicoes':['pt','en'],'larguras':[390,768,1024,1280,1600],'evora':'o traço do início desconhecido precisa de captura nas duas edições'},'aceitacao_integral':False,'paragem':'16 entradas de proveniência anteriores ao acesso em vigor nas cinco linhas do PRR','erros_da_medicao':erros}
if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--motor',required=True,type=Path);ap.add_argument('--final',action='store_true');ap.add_argument('--verifica',action='store_true');args=ap.parse_args()
    r=medir(args.motor,args.final or args.verifica)
    if not args.verifica:
        (AQUI/'medidas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
        geral=ler(BLOCO/'medidas.json');geral['C1e']=r;(BLOCO/'medidas.json').write_text(json.dumps(geral,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'portoes':r['portoes'],'caminhos':r['caminhos'],'paragem':r['paragem'],'erros_da_medicao':r['erros_da_medicao']},ensure_ascii=False,indent=2));raise SystemExit(bool(r['erros_da_medicao']))
