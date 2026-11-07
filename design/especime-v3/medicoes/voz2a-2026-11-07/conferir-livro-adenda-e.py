"""Mede a proposta da adenda E; não escreve livros compostos.

Uso: python3 <este ficheiro> <motor>, com a patch da adenda E aplicada.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys

motor = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(motor))
from core.compor import compor, construir_livro, _normalizado, _tight

pasta = Path(__file__).resolve().parent
serial = lambda x: (json.dumps(x, ensure_ascii=False, indent=1) + '\n').encode()
def publicado(p):
    return subprocess.check_output(['git', 'show', '155a9f2:' + p.relative_to(motor).as_posix()], cwd=motor)

fonte = motor / 'content/14 Évora 2027/ledger.json'
antes14 = json.loads(publicado(fonte))
depois14 = json.loads(fonte.read_bytes())
citacoes = ['nenhum dos documentos lidos lista contratos, adjudicatários ou valores',
            'none of the documents read lists contracts, contractors or values']
esperado14 = json.loads(json.dumps(antes14))
a14 = next(a for a in esperado14['assertions'] if a['id'] == 'base-sem-contratos')
a14['quotes'] = citacoes
assert depois14 == esperado14, 'Outra mudança no livro da fonte 14'
medidas = {'fonte14': {'unica_mudanca': 'assertions.base-sem-contratos.quotes',
                       'linhas_identicas': antes14['claims'] == depois14['claims'],
                       'sha256_antes': hashlib.sha256(publicado(fonte)).hexdigest(),
                       'sha256_depois': hashlib.sha256(fonte.read_bytes()).hexdigest()}, 'estudos': []}
for numero in ('16', '18', '19'):
    estudo, = (motor / 'content').glob(numero + ' *')
    fontes = {}
    comps = [compor(p, fontes) for p in sorted((estudo / 'Technical Source').glob('documento.*.md.tmpl'))]
    novo, _ = construir_livro(estudo, comps, fontes)
    antes = json.loads(publicado(estudo / 'ledger.json'))
    campos = {k: {'antes': antes.get(k), 'depois': novo.get(k)}
              for k in antes.keys() | novo.keys() if antes.get(k) != novo.get(k)}
    resumo = {'estudo': estudo.name, 'linhas_identicas': antes['claims'] == novo['claims'],
              'linhas': len(novo['claims']), 'campos_diferentes': list(sorted(campos))}
    if numero == '19':
        esperado = json.loads(json.dumps(antes))
        esperado['ignore'].remove('256')
        for f in esperado['composto_de']:
            if f['pasta'] == '14 Évora 2027': f['ledger_sha256'] = hashlib.sha256(fonte.read_bytes()).hexdigest()
        esperado['assertions'] = [a for a in esperado['assertions'] if a['id'] != 'nenhum-uniformiza']
        next(a for a in esperado['assertions'] if a['id'] == 'base-sem-contratos')['quotes'] = citacoes
        resumo['campos_fora_da_autorizacao'] = sorted(k for k in esperado.keys() | novo.keys() if esperado.get(k) != novo.get(k))
        importada = next(a for a in novo['assertions'] if a['id'] == 'base-sem-contratos')
        assert importada == a14, 'A asserção importada difere da fonte'
        resumo['base_sem_contratos'] = {'importada_identica_a_fonte': True, 'id_e_review_conservados': True,
                                      'quotes': importada['quotes'], 'prosa': {}}
        for lingua, citacao in zip(('pt', 'en'), citacoes):
            comp, = [c for c in comps if c.lingua == lingua]
            presente = _tight(citacao) in _normalizado(comp.md)
            assert presente, (lingua, citacao)
            resumo['base_sem_contratos']['prosa'][lingua] = presente
        resumo['diferencas'] = campos
        print('19: campos diferentes:', ', '.join(sorted(campos)))
        print('19: campos fora da autorização:', ', '.join(resumo['campos_fora_da_autorizacao']))
        print('19: base-sem-contratos importada da fonte, com id e review conservados; citações presentes em pt e en.')
        for k, v in campos.items():
            if k == 'composto_de':
                for a, b in zip(v['antes'], v['depois']):
                    if a != b: print('19: composto_de:', json.dumps({'antes': a, 'depois': b}, ensure_ascii=False))
            elif k == 'ignore': print('19: ignore:', len(v['antes']), '->', len(v['depois']), '; sai 256')
            elif k == 'assertions': print('19: assertions:', len(v['antes']), '->', len(v['depois']), '; sai nenhum-uniformiza; mudam só as duas citações de base-sem-contratos')
    print(numero + ': linhas idênticas:', resumo['linhas_identicas'], '; linhas:', resumo['linhas'])
    medidas['estudos'].append(resumo)
(pasta / 'medidas-adenda-e-voz2.json').write_text(json.dumps(medidas, ensure_ascii=False, indent=2) + '\n')
sys.exit(1 if any(x.get('campos_fora_da_autorizacao') for x in medidas['estudos']) else 0)
