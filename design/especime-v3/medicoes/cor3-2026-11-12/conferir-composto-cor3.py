#!/usr/bin/env python3
"""Conferir as folhas decididas contra os documentos compostos, sem rede.

Uso: python3 conferir-composto-cor3.py <motor> [--saida <resultado.json>]
Uma correção parada continua a falhar a prova de igualdade. As plantas têm de
acrescentar uma falha à sua própria frase, mesmo quando outra correção está parada.
"""
from pathlib import Path
import argparse, hashlib, json, re, sys

HERE = Path(__file__).resolve().parent
DOCUMENTS = {
    ('orcamento', 'pt'): 'content/27 Orcamento 2027 O que muda/O Orçamento de 2027, o que muda e para quem (pt-PT).html',
    ('orcamento', 'en'): 'content/27 Orcamento 2027 O que muda/The 2027 Budget, what changes, and for whom.html',
    ('reforma', 'pt'): 'content/11 Seguranca Social/Penalizações por Reforma Antecipada em Portugal (pt-PT).html',
    ('habitacao', 'pt'): 'content/28 Habitacao Estudo/A casa em Portugal e na Europa.html',
    ('habitacao', 'en'): 'content/28 Habitacao Estudo/Housing in Portugal and in Europe.html',
}
PARAGENS = {}  # as três paragens da passagem do motor foram decididas a 12.11.2026 (ver as folhas)

def sections(text):
    return re.findall(r'^## (C\d\d)[^\n]*\n(.*?)(?=^## |\Z)', text, re.M | re.S)

def cases():
    out = []
    def add(study, correction, lang, before, after, part=1):
        out.append(dict(estudo=study, correcao=correction, lingua=lang, trecho=part,
                        antes=before, depois=after))
    sheets = {study: (HERE / ('FOLHA-' + study + '-decidida.md')).read_text()
              for study in ('orcamento', 'reforma', 'habitacao')}
    assert [len(sections(sheets[s])) for s in sheets] == [12, 9, 20]
    for cid, block in sections(sheets['orcamento']):
        for lang, label in [('pt', 'Português'), ('en', 'English')]:
            before = re.search(r'\*\*' + label + r', hoje \(publicado\):\*\* (.*)', block)[1]
            after = re.search(r'\*\*' + label + r', corrigido \(publicado\):\*\* (.*)', block)[1]
            if cid == 'C10':
                after = re.search(r'^- ' + lang + ': (.*)', block, re.M)[1]
            add('orcamento', cid, lang, before, after)
    for cid, block in sections(sheets['reforma']):
        pairs = re.findall(r'antes:\n\n```\n(.*?)\n```\n\nDepois:\n\n```\n(.*?)\n```', block, re.S)
        assert pairs, cid
        for part, (before, after) in enumerate(pairs, 1):
            add('reforma', cid, 'pt', before, after, part)
    for cid, block in sections(sheets['habitacao']):
        if cid == 'C20':
            continue  # Cartão do sítio, expressamente reservado à passagem seguinte.
        for lang, chunk in zip(('pt', 'en'), re.split(r'\*\*(?:Português|English)\*\*', block)[1:]):
            before = re.search(r'Atual:\n> (.*)', chunk)[1]
            after = re.search(r'Novo:\n> (.*)', chunk)[1]
            if cid == 'C06':
                after = ''  # A decisão é apagar a frase inteira, incluindo o espaço anterior.
            add('habitacao', cid, lang, before, after)
            if cid == 'C07':
                before, after = re.search(r'- ' + lang + r', antes: «(.*?)» depois: «(.*?)»', block).groups()
                add('habitacao', cid, lang, before, after, 2)
    return out, sheets

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('motor', type=Path)
    parser.add_argument('--saida', type=Path)
    args = parser.parse_args()
    sys.path.insert(0, str(args.motor.resolve()))
    from core.reconcile import visible_text
    from core.documento_md import render
    def norm(text, html=False):
        surface = visible_text(text if html or re.search(r'</?(?:p|span|strong)\b', text) else render(text), is_html=True)
        return re.sub(r'\s+', ' ', surface.replace('\u202f', ' ').replace('\xa0', ' ')).strip()
    raw = {key: (args.motor / file).read_text() for key, file in DOCUMENTS.items()}
    docs = {key: norm(value, html=True) for key, value in raw.items()}
    entries, sheets = cases()
    def check(case, documents):
        text = documents[(case['estudo'], case['lingua'])]
        before, after = norm(case['antes']), norm(case['depois']) if case['depois'] else ''
        n_before = text.count(before)
        n_after = text.count(after) if after else None
        return dict(antes_ocorrencias=n_before, depois_ocorrencias=n_after,
                    conforme=n_before == 0 and (n_after == 1 if after else True))
    results = []
    for case in entries:
        result = {k: case[k] for k in ('estudo', 'correcao', 'lingua', 'trecho')}
        result.update(check(case, docs))
        if (case['estudo'], case['correcao']) in PARAGENS:
            result['paragem'] = PARAGENS[(case['estudo'], case['correcao'])]
        results.append(result)
    plants = []
    for kind, cid in [('algarismo_trocado', 'C01'), ('antes_reposto', 'C09')]:
        case = next(c for c in entries if (c['estudo'], c['lingua'], c['correcao']) == ('orcamento', 'pt', cid))
        assert check(case, docs)['conforme'], 'A planta exige uma frase de controlo conforme.'
        copies = dict(docs)
        key = ('orcamento', 'pt')
        if kind == 'algarismo_trocado':
            after = norm(case['depois'])
            match = re.search(r'\d', after)
            assert match
            digit = str((int(match[0]) + 1) % 10)
            altered = after[:match.start()] + digit + after[match.end():]
            copies[key] = copies[key].replace(after, altered, 1)
        else:
            copies[key] += ' ' + norm(case['antes'])
        result = check(case, copies)
        assert not result['conforme'], 'Planta não detetada: ' + kind
        plants.append(dict(planta=kind, estudo='orcamento', correcao=cid, lingua='pt', codigo=1, **result))
    failed = sum(not result['conforme'] for result in results)
    output = dict(codigo=1 if failed else 0,
                  folhas={s: dict(sha256=hashlib.sha256(text.encode()).hexdigest(), correcoes=len(sections(text))) for s, text in sheets.items()},
                  documentos={DOCUMENTS[key]: hashlib.sha256(text.encode()).hexdigest() for key, text in raw.items()},
                  trechos=len(results), conformes=len(results) - failed, nao_conformes=failed,
                  correcoes_fora_do_ambito=[dict(estudo='habitacao', correcao='C20', motivo='Cartão do sítio')],
                  resultados=results, plantas=plants)
    if args.saida:
        args.saida.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    print(f"COR3 composto: {len(results) - failed}/{len(results)} trechos conformes; {failed} não conformes; {len(plants)} plantas detetadas")
    for result in results:
        if not result['conforme']:
            print(result['estudo'], result['correcao'], result['lingua'], result['trecho'],
                  'antes=' + str(result['antes_ocorrencias']), 'depois=' + str(result['depois_ocorrencias']),
                  result.get('paragem', 'Divergência não prevista'))
    return output['codigo']

if __name__ == '__main__':
    raise SystemExit(main())
