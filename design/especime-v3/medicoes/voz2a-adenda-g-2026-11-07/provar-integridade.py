"""Confere arquivos, bytes publicados, referências e contagens, sem modificar fontes.
Uso: python3 <este ficheiro> <motor>
"""
from pathlib import Path
import hashlib,json,subprocess,sys
import yaml
pasta=Path(__file__).resolve().parent
site=pasta.parents[3]
motor=Path(sys.argv[1]).resolve()
sys.path.insert(0,str(motor))
from publisher.export_records import walk_figures

def git(repo,ref,p):
    return subprocess.check_output(['git','show',ref+':'+p],cwd=repo)
def sha(b):return hashlib.sha256(b).hexdigest()
base_site='14f931195'
base_motor='155a9f2'
antes=yaml.safe_load(git(site,base_site,'studies-src/manifest.yml'))
depois=yaml.safe_load((site/'studies-src/manifest.yml').read_text())
alvos={f['estudo'] for f in json.loads((pasta.parent/'voz2a-2026-11-07/FRASES-VOZ-2A.json').read_text())}
arquivos=0;correntes=0
for e in depois['edicoes']:
    velho=next(v for v in antes['edicoes'] if (v['slug'],v['lang'])==(e['slug'],e['lang']))
    if e['slug'] not in alvos:
        assert e==velho,('edição fora do âmbito',e['slug'])
        assert (site/'studies-src'/e['edicoes'][-1]['file']).read_bytes()==git(site,base_site,'studies-src/'+velho['edicoes'][-1]['file'])
        continue
    assert e['edicoes'][-1]['natureza']=='atualizacao'
    for v,old in zip(e['edicoes'][:-1],velho['edicoes']):
        assert (site/'studies-src'/v['file']).read_bytes()==git(site,base_site,'studies-src/'+old['file'])
        arquivos+=1
    fonte,ref=e['origin_ref'].split(' @ ')
    bruto=git(motor,ref,fonte)
    assert bruto==(site/'studies-src'/e['raw_file']).read_bytes()
    assert bruto==(site/'studies-src'/e['edicoes'][-1]['file']).read_bytes()
    assert sha(bruto)==e['sha256_normalized']==e['edicoes'][-1]['sha256']
    correntes+=1
refs=0;records=0;blocos=[]
for p in motor.glob('content/*/*.record.json'):
    old=json.loads(git(motor,base_motor,p.relative_to(motor).as_posix()));new=json.loads(p.read_text())
    figs=lambda r:[(f['row'],f['printed'],f['value']) for f,_ in walk_figures(r)]
    assert figs(old)==figs(new),(p.name,'referências alteradas')
    refs+=len(figs(new));records+=1
    if len(old['blocks'])!=len(new['blocks']):blocos.append({'estudo':p.parent.name,'lingua':new['lang'],'antes':len(old['blocks']),'depois':len(new['blocks'])})
totais=[]
for ref in (base_motor,None):
    contagens={};estratos={}
    for p in motor.glob('content/*/records.manifest.json'):
        m=json.loads(git(motor,ref,p.relative_to(motor).as_posix()) if ref else p.read_bytes())
        for e in m['registos']:
            for k,v in e.get('voz',{}).items():
                if isinstance(v,int):contagens[k]=contagens.get(k,0)+v
            for k,v in e.get('voz',{}).get('estratos',{}).items():estratos[k]=estratos.get(k,0)+v
    totais.append({'contagens':contagens,'estratos':estratos})
resultado={'arquivos_conferidos':arquivos,'correntes_conferidas':correntes,'registos_conferidos':records,'referencias_identicas':refs,'blocos_alterados':blocos,'prova_voz_antes':totais[0],'prova_voz_depois':totais[1]}
(pasta/'integridade.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
print('Arquivos conservados:',arquivos,'; edições atuais com bytes do commit:',correntes)
print('Registos:',records,'; referências idênticas:',refs)
for campo in ('contagens','estratos'):
    for k,v in totais[0][campo].items():
        novo=totais[1][campo].get(k)
        if v!=novo:print(campo,k,str(v)+' -> '+str(novo))
