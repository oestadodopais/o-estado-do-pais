"""Reproduz o conflito do §1.5 sem alterar a conferência nem as plantas do motor.
Uso: python3 provar-conflito-atribuicoes-d.py <motor> <resultado.json>
A variante em memória acrescenta apenas a procura pela janela exigida.
"""
import ast, json, os, subprocess, sys, types
from pathlib import Path
motor = Path(sys.argv[1]).resolve()
resultado = Path(sys.argv[2]).resolve()
os.chdir(motor)
sys.path.insert(0, str(motor))
from core import attributions as current
from core.attributions_test import LEDGER, run
source=Path('core/attributions.py').read_text()
old=types.ModuleType('core.atribuicoes_antigas');old.__package__='core'
sys.modules[old.__name__]=old
exec(subprocess.check_output(['git','show','cf5bd5b:core/attributions.py'],text=True),old.__dict__)
candidate=types.ModuleType('core.atribuicoes_janela');candidate.__package__='core';sys.modules[candidate.__name__]=candidate
source=source.replace('    for block in reading_blocks(raw, is_html):','    blocks = [re.sub(r"\\s+", " ", visible_text(b, is_html=False)).strip() for b in reading_blocks(raw, is_html)]\n    full = " ".join(blocks)\n    offset = 0\n    for block in blocks:')
source=source.replace('            found = nearby_entities(text, m, lexicon)','            found = nearby_entities(text, m, lexicon)\n            if not found:\n                found = lexicon.found_in(text[max(0, m.start() - WINDOW):m.end() + WINDOW])\n            if not found:\n                found = lexicon.found_in(full[max(0, offset + m.start() - WINDOW):offset + m.end() + WINDOW])')
source=source.replace('    return violations, undeclared, checked','        offset += len(text) + 1\n    return violations, undeclared, checked')
exec(source,candidate.__dict__)
contextual=json.loads(json.dumps(LEDGER))
contextual['claims'].extend([
 {**LEDGER['claims'][0], 'id':'reference-eight','value':'8','attributed_to':['DGADR']},
 {**LEDGER['claims'][0], 'id':'reference-year','value':'2024','attributed_to':['DGADR']},
 {**LEDGER['claims'][0], 'id':'household','value':'1,348','attributed_to':['ERSAR']},
 {**LEDGER['claims'][0], 'id':'irrigation','value':'0,0706','attributed_to':['EDIA']},
])
contextual['entity_aliases']['APA']=[]
# Lê exatamente as doze plantas existentes, sem as reescrever.
tree=ast.parse(Path('core/attributions_test.py').read_text())
cases=next(ast.literal_eval(n.value) for n in ast.walk(tree) if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='cases' for t in n.targets))
import core.attributions_test as tests
cases.extend([
 ('d-frase-anterior', '<p>O recenseamento do INE mostra a falta de contadores. Hoje, 71% dos agricultores não têm contador.</p>', 1),
 ('d-legenda-anterior', '<figcaption>Fonte: INE</figcaption><p>71% dos agricultores não têm contador.</p>', 1),
])
results=[]
for name, text, expected in cases:
 row={'nome':name,'texto':text,'esperado':expected,'origem':'adenda D' if name.startswith('d-') else 'adenda B'}
 for label,module in [('cf5bd5b',old),('cabeca',current),('janela_exigida_sem_outras_mudancas',candidate)]:
  tests.attributions=module;code,out=run(text,contextual,name);row[label]={'codigo':code,'saida':out.strip()}
 results.append(row)
tests.attributions=current
resultado.write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
for r in results:
 print(r['nome'], 'esperado',r['esperado'], 'cf5',r['cf5bd5b']['codigo'],'cabeça',r['cabeca']['codigo'],'janela',r['janela_exigida_sem_outras_mudancas']['codigo'])
for r in results:
 if r['esperado']!=r['janela_exigida_sem_outras_mudancas']['codigo']:
  print('CONFLITO',r['nome'],r['texto'],r['janela_exigida_sem_outras_mudancas']['saida'])

conflitos = [r['nome'] for r in results if r['esperado'] != r['janela_exigida_sem_outras_mudancas']['codigo']]
assert conflitos == ['reference-code'], conflitos
for r in results:
 if r['nome'] == 'reference-code' or r['nome'].startswith('d-'):
  assert r['cf5bd5b']['codigo'] == 1 and r['cabeca']['codigo'] == 0
print('PROVA: conflito reproduzido; código 0 confirma a reprodução, não o fecho do mandato.')
