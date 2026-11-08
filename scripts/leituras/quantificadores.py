#!/usr/bin/env python3
"""Lê o vocabulário do motor por AST, sem o copiar nem executar o motor."""
import ast
import json
import os
from pathlib import Path
import re
import sys


def normal(texto):
    texto = re.sub(r"\s+", " ", texto.replace("*", "").replace("`", ""))
    texto = re.sub(r"\s+([,.;:)»%])", r"\1", texto)
    return re.sub(r"([(«])\s+", r"\1", texto)


def livros_do_estudo(estudo, lingua, motor, sitio):
    import yaml
    manifesto = yaml.safe_load((sitio / 'studies-src/manifest.yml').read_text())
    content = (motor / 'content').resolve()
    pastas = set()
    for edicao in manifesto['edicoes']:
        if edicao.get('slug') != estudo or edicao.get('lang') != lingua:
            continue
        origem = edicao.get('origin_ref', '').split(' @ ')[0]
        pasta = (motor / origem).resolve().parent
        if not pasta.is_relative_to(content):
            raise ValueError('origem do estudo fora de content do motor')
        pastas.add(pasta)
    # As composições declaram as fontes nas diretivas do próprio motor.
    importacoes = {}
    for tmpl in content.glob('*/Technical Source/documento.*.md.tmpl'):
        fontes = re.findall(r'^@@fonte\s+\S+\s+(.+)$', tmpl.read_text(), re.M)
        importacoes.setdefault(tmpl.parent.parent, set()).update((content / f.strip()).resolve() for f in fontes)
    while True:
        novas = {p for p, fontes in importacoes.items() if fontes & pastas}
        if novas <= pastas:
            break
        pastas.update(novas)
    return sorted(p / 'ledger.json' for p in pastas if (p / 'ledger.json').is_file())


def conferir(lista, motor, sitio=None):
    sitio = sitio or Path(__file__).resolve().parents[2]
    arvore = ast.parse((motor / 'core/assertions.py').read_text(encoding='utf-8'))
    valores = [ast.literal_eval(n.value) for n in arvore.body
               if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and
               t.id == 'QUANTIFIER_PATTERNS' for t in n.targets)]
    if len(valores) != 1 or not valores[0] or not all(isinstance(p, str) for p in valores[0]):
        raise ValueError('QUANTIFIER_PATTERNS ausente ou inválido no motor')
    regua = re.compile('|'.join(valores[0]), re.I)
    erros, cache = [], {}
    for f in lista:
        texto = normal(f.get('nova', ''))
        ocorrencias = list(regua.finditer(texto))
        if not ocorrencias and 'assercao' not in f:
            continue
        erro = {'id': f['id'], 'quantificadores': [m.group() for m in ocorrencias]}
        if not (isinstance(f.get('assercao'), str) and re.fullmatch(r'[\w][\w.-]*', f['assercao'])):
            erros.append({**erro, 'razao': 'falta declaração de asserção válida'})
            continue
        chave = (f.get('estudo'), f.get('lingua'))
        if chave not in cache:
            cache[chave] = [a for livro in livros_do_estudo(*chave, motor, sitio)
                            for a in json.loads(livro.read_text()).get('assertions', [])]
        declaradas = [a for a in cache[chave] if a.get('id') == f['assercao']]
        if not declaradas:
            erros.append({**erro, 'razao': 'asserção ausente dos livros do estudo e das suas composições'})
            continue
        spans = []
        for a in declaradas:
            for citacao in a.get('quotes', []):
                q = normal(citacao)
                if not q:
                    continue
                inicio = 0
                while (i := texto.find(q, inicio)) >= 0:
                    spans.append((i, i + len(q)))
                    inicio = i + 1
        if any(not any(a <= m.start() and m.end() <= b for a, b in spans) for m in ocorrencias):
            erros.append({**erro, 'razao': 'citação ausente da nova ou sem cobrir cada ocorrência do quantificador'})
    return erros


if __name__ == '__main__':
    try:
        motor = os.environ.get('RESEARCHHUB_DIR')
        if not motor:
            raise ValueError('falta RESEARCHHUB_DIR para ler os quantificadores')
        print(json.dumps(conferir(json.load(sys.stdin), Path(motor), Path(sys.argv[1]) if len(sys.argv) > 1 else None), ensure_ascii=False))
    except (OSError, ValueError, SyntaxError) as e:
        print('quantificadores: ' + (str(e) if isinstance(e, ValueError) else 'régua do motor ilegível'), file=sys.stderr)
        sys.exit(9)
