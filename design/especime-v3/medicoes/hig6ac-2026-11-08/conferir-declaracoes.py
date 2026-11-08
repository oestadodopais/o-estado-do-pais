"""Diagnóstico das oito declarações da VOZ-2A, sem alterar a camada 0."""
import ast
import json
import os
from pathlib import Path
import re
import subprocess
import sys

raiz = Path(__file__).resolve().parents[4]
motor = Path(os.environ['RESEARCHHUB_DIR'])
lista = json.loads((raiz / 'design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json').read_text())
manifesto = (raiz / 'studies-src/manifest.yml').read_text()
origens = {}
for bloco in re.split(r'(?m)^  - slug: ', manifesto)[1:]:
    slug = bloco.splitlines()[0].strip()
    lingua = re.search(r'(?m)^    lang: (.+)$', bloco)
    origem = re.search(r'(?m)^    origin_ref: (content/.+?) @ ', bloco)
    if lingua and origem:
        origens[(slug, lingua.group(1))] = str(Path(origem.group(1)).parent / 'ledger.json')
arvore = ast.parse((motor / 'core/assertions.py').read_text())
padroes = next(ast.literal_eval(n.value) for n in arvore.body if isinstance(n, ast.Assign)
               and any(isinstance(t, ast.Name) and t.id == 'QUANTIFIER_PATTERNS' for t in n.targets))
regua = re.compile('|'.join(padroes), re.I)

def normal(t):
    return re.sub(r'\s+', ' ', t.replace('\u200b', '').replace('*', '').replace('`', '')).strip(' .;!?')

resultados = []
for entrada in lista:
    if 'assercao' not in entrada:
        continue
    livro = origens[(entrada['estudo'], entrada['lingua'])]
    dados = json.loads((motor / livro).read_text())
    declaradas = [a for a in dados.get('assertions', []) if a.get('id') == entrada['assercao']]
    citacoes = [q for a in declaradas for q in a.get('quotes', [])]
    # Recorte das orações destas oito entradas, por pontuação e conjunção antes do quantificador.
    # Não é uma proposta de analisador sintático para a regra de produção.
    partes = re.split(r'[.;!?]|(?:,\s*|\s+)(?:and|e)\s+(?=none\b|nenhum(?:a)?\b)', entrada['nova'])
    oracoes = [normal(p) for p in partes if regua.search(p)]
    cobertas = [o for o in oracoes if any(o in normal(q) for q in citacoes)]
    resultado = {'id': entrada['id'], 'estudo': entrada['estudo'], 'lingua': entrada['lingua'],
                 'livro': livro, 'assercao': entrada['assercao'], 'existe': bool(declaradas),
                 'oracoes': oracoes, 'citacoes': citacoes,
                 'cobertura': bool(oracoes) and len(cobertas) == len(oracoes)}
    resultados.append(resultado)
    print(entrada['id'], 'existe=' + str(resultado['existe']), 'cobertura=' + str(resultado['cobertura']))
recusadas = [r['id'] for r in resultados if not (r['existe'] and r['cobertura'])]
prova = {'motor_commit': subprocess.check_output(['git', '-C', str(motor), 'rev-parse', 'HEAD'], text=True).strip(),
         'resultados': resultados, 'recusadas': recusadas}
if len(sys.argv) > 1:
    Path(sys.argv[1]).write_text(json.dumps(prova, ensure_ascii=False, indent=2) + '\n')
print('declarações:', len(resultados), 'recusadas:', ', '.join(recusadas) or 'nenhuma')
raise SystemExit(9 if recusadas else 0)
