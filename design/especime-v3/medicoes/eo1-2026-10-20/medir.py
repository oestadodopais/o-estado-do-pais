"""EO1: mede os livros na cabeça recebida; nunca preenche valores ausentes."""
import argparse, hashlib, json, subprocess, sys
from pathlib import Path
P = argparse.ArgumentParser()
P.add_argument('motor', type=Path)
P.add_argument('--saida', type=Path, default=Path(__file__).parent / 'partida.json')
P.add_argument('--selagem', action='store_true')
a = P.parse_args()
sys.path.insert(0, str(a.motor))
from publisher import oe2027_medidas as M
from publisher import oe2027_analise as A
from core import derivations as D
books = {'PM': '25 Orcamento 2027 Medidas', 'AN': '24 Orcamento 2027 Analise', 'DOM': '13 Dominios'}
out = {'cabeca_motor': subprocess.check_output(['git','rev-parse','HEAD'], cwd=a.motor,text=True).strip(), 'livros': {}, 'linhas': {}, 'derivadas': [], 'novas': []}
for code, folder in books.items():
 p=a.motor/'content'/folder/'ledger.json'; raw=p.read_bytes(); book=json.loads(raw)
 out['livros'][code]={'ficheiro':str(p.relative_to(a.motor)), 'sha256':hashlib.sha256(raw).hexdigest()}
 for r in book['claims']:
  out['linhas'][code+':'+r['id']]={k:r.get(k) for k in ('value','unit','period','locator','excerpt','document','derivation','check')}
required = '''pm-q4-1-r17-c0 pm-q4-1-r17-c1 pm-q4-1-r17-c2 pm-q4-1-r17-c4 pm-q4-1-r31-c0 pm-q4-1-r31-c1 pm-q4-1-r31-c2 pm-q4-1-r31-c4 pm-q4-1-r32-c0 pm-q4-1-r32-c1 pm-q4-1-r32-c3 pm-q4-1-r32-c4 pm-q4-1-r21-c0 pm-q4-1-r21-c1 pm-q4-1-r21-c2 pm-q4-1-r21-c4 pm-q4-1-r27-c0 pm-q4-1-r27-c1 pm-q4-1-r27-c2 pm-q4-1-r27-c3 pm-q4-1-r27-c4 pm-q4-1-r19-c0 pm-q4-1-r19-c1 pm-q4-1-r19-c2 pm-q4-1-r11-c1 pm-q4-1-r11-c2 pm-q4-1-r12-c1 pm-q4-1-r12-c2 pm-q4-1-r13-c1 pm-q4-1-r13-c2 pm-q4-1-r22-c1 pm-q4-1-r22-c2'''.split()
for r,cs in {21:[1,2,4,5],22:[1,2],23:[1,2],50:[1,2,4,5],51:[1,2],52:[1,2],36:[1,2,5],54:[1,2,4,5]}.items():required += [f'pm-q3-1-r{r}-c{c}' for c in cs]
for r,cs in {37:[0,1,2,3],27:[1],33:[1],34:[1],31:[1],26:[1],24:[1]}.items():required += [f'pm-q3-3-r{r}-c{c}' for c in cs]
required += [f'pm-q3-2-r{r}-c0' for r in range(5,27)]
for r,cs in {8:[1,2],9:[2],11:[1,2],19:[1,2],21:[2],22:[2],24:[2]}.items():required += [f'pm-q2-3-r{r}-c{c}' for c in cs]
for r,cs in {42:[1,2,3],43:[2,3],44:[2,3],45:[2,3],46:[3],47:[3],50:[2,3]}.items():required += [f'pm-q3-6-r{r}-c{c}' for c in cs]
required += '''pm-grafico-3-5-poenmp-2027 pm-objetivo-divida-final-decada pm-trajetoria-divida-2026-2027 ce-primavera-2026-pib-2027 ce-primavera-2026-saldo-2027 ce-primavera-2026-divida-2026 ce-primavera-2026-divida-2027 ce-primavera-2026-divida-texto-divergente'''.split()
required += [f'europa-divida-{c}-2025' for c in ['pt','eu27_2020','ee','el','es']]+[f'europa-saldo-{c}-2025' for c in ['pt','eu27_2020','ro','cy']]
required += ['utao-'+s for s in 'saldo revisao-saldo politicas-revisao politicas-saldo juros salarios novas-medidas novas-saldo divida-racio divida-stock divida-efeitos divida-ajustamento risco-pib risco-fenomenos risco-fraude risco-emprego risco-sns risco-mercados risco-juros risco-contingencias'.split()]
required += ['cfp-'+s for s in 'medidas pensoes-irs reembolsos comparabilidade riscos emprego-receita'.split()]
required += '''pm-remuneracoes-atualizacao pm-salario-minimo pm-pensoes-atualizacao pm-csi-referencia-2027 pm-pensoes-capitulo3 diploma-oe-artigo60-irs diploma-irc-artigo3 diploma-habitacao-artigo8 diploma-habitacao-artigo9 diploma-habitacao-preambulo diploma-cirs-artigo25 diploma-habitacao-artigo10 diploma-habitacao-artigo18 diploma-civa-artigo18'''.split()
required += [f'irs-escalao-{n}-taxa-{t}' for n in range(1,10) for t in ['normal','media']]
required += ['posicao-'+s for s in 'governo-irs governo-irc governo-csi-pensoes governo-salarios governo-divida85 psd-impostos ps-irc ps-rendas ps-pensoes pcp-smn pcp-salarios pcp-irc pcp-irs-rendas pcp-habitacao pcp-pensoes chega-habitacao livre-iva be-rendimentos cds-orcamento jpp-irs'.split()]
keys=['PM:'+s for s in required]+['DOM:divida-publica-2025-notificacao-ine-2026-09']+['AN:oe-2027-calendario-'+s for s in ['entrega','generalidade','especialidade','final-global']]+['AN:oe-2027-saude-investimento-variacao']
for k in keys: assert k in out['linhas'], 'Identificador ausente: '+k
out['linhas_mandato']=keys
out['comparacoes']={
 'divida_2025':['PM:europa-divida-pt-2025','DOM:divida-publica-2025-notificacao-ine-2026-09'],
 'saldo_2027':['PM:pm-q4-1-r32-c4','PM:pm-q3-3-r37-c3'],
 'divida_2027':['PM:pm-q3-6-r42-c3','PM:ce-primavera-2026-divida-2027','PM:pm-grafico-3-5-poenmp-2027'],
 'juros_2027':['PM:pm-q4-1-r21-c1','PM:pm-q3-1-r36-c2']}
if a.selagem:
 import re
 original=json.loads(a.saida.read_text())
 original['selagem_cabeca_motor']=out['cabeca_motor']
 specs=M.load(M.STUDY/'partes/eo1.json')
 by={r['id']:r for r in M.load(M.STUDY/'ledger.json')['claims']}
 original['linhas_seladas']={r['id']:r for r in by.values()
                            if r['id'] in {s['id'] for s in specs['rows']+specs['derived']}}
 for s in specs['rows']:
  proofs=[]
  segments=s.get('quote_segments') or [{'page':s.get('page',1),'quote':s['quote']}]
  body,receipt=A.source(s['file'])
  for segment in segments:
   text=A.norm(re.sub(r'(?<=\w)-[ \t]*\r?\n[ \t]*(?=\w)','',
                      A.pages(s['file'])[segment['page']-1]))
   q=A.norm(segment['quote'])
   assert q in text, s['id']
   proofs.append({'pagina':segment['page'],'inicio':text.index(q),
                  'fim':text.index(q)+len(q),'excerto':q})
  original['novas'].append({'id':s['id'],'ficheiro':s['file'],
                            'sha256':hashlib.sha256(body).hexdigest(),
                            'superficie':'texto extraído, espaços normalizados e hifens de mudança de linha reunidos',
                            'posicoes':proofs})
 for s in specs['derived']:
  result=D.evaluate(s['check'],by,self_id=s['id'])
  difference=result-A.number(by[s['id']]['value'])
  assert difference==0,s['id']
  original['derivadas'].append({'id':s['id'],'expressao':s['check'],
                              'componentes':{k:by[k]['value'] for k in s['components']},
                              'resultado':str(result),'diferenca':str(difference)})
 original['novas']=list({p['id']:p for p in original['novas']}.values())
 original['derivadas']=list({p['id']:p for p in original['derivadas']}.values())
 out=original
# O livro integral fica medido para confrontar as linhas anteriores e posteriores.
a.saida.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('EO1 partida:',len(keys),'identificadores obrigatórios encontrados;',len(out['linhas']),'linhas medidas')
