"""Conserva as provas anteriores e mede a continuação CR2-e a partir dos ficheiros."""
import json
from pathlib import Path
p=Path(__file__).resolve().parent
base=p.parent
ler=lambda f:json.loads(f.read_text())
r=ler(base/'medidas.json')
a=ler(base/'frases-antes.json');d=ler(p/'frases-resolvedores.json')
chave=lambda f:tuple(f[k] for k in ['familia','id','lang','caminho'])
m={chave(f):f for f in a['frases']}
c=[dict(f,antes=m[chave(f)]['texto'],mudou=f['texto']!=m[chave(f)]['texto']) for f in d['frases']]
f={'origem':'resolvedores, sem conferência do HTML','total':len(c),'iguais':sum(not f['mudou'] for f in c),'mudadas':[f for f in c if f['mudou']],'fontes':len(d['fontes']),'comparacao':c}
(p/'frases-comparadas-sem-html.json').write_text(json.dumps(f,ensure_ascii=False,indent=2)+'\n')
atual={'partida':ler(p/'partida.json'),'codigos':{f.stem:int(f.read_text()) for f in sorted(p.glob('*.codigo'))},'dist':ler(p/'dist-parcial.json'),'frases_sem_html':{k:v for k,v in f.items() if k!='comparacao'},'recibos':{'estado':'não conferidos: construção incompleta, sem recibos nem version.json','atualizados_esperados':30,'pendentes_esperados':4},'selos':{'reposicao_pela_direcao':'c63fa86e7','artefactos_adicionais_alterados':[]},'motor':{'cabeca_observada':'d8f0513b0713bedbd73f0c510bed875659a2f04f','cabeca_indicada_no_mandato':'e4628c173dd4ffd155ba58ad8fa2cd74f8fe7e93','arvore_limpa':True,'alterado_nesta_passagem':False}}
r.update(gerado_por='e/medir.py',estado='CR2-e: construção recusada por falta de lugar declarado numa das quinze linhas',continuacao_cr2e=atual)
(base/'medidas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'codigos':atual['codigos'],'frases_iguais':f['iguais'],'frases_mudadas':len(f['mudadas'])},ensure_ascii=False))
