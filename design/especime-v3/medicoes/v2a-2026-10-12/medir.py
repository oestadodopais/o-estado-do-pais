#!/usr/bin/env python3
"""Mede as linhas comitadas e os documentos selados, sem copiar valores do brief."""
import argparse, hashlib, json, pathlib, subprocess
import yaml

p = argparse.ArgumentParser()
p.add_argument('--sitio', required=True)
p.add_argument('--motor', required=True)
p.add_argument('--saida', required=True)
p.add_argument('--base', default='20322174')
a = p.parse_args()
site, motor = pathlib.Path(a.sitio), pathlib.Path(a.motor)
def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), *args], text=True).strip()
head = git(site, 'rev-parse', 'HEAD')
def tree(ref):
    return {s.split('\t')[1]: s.split('\t')[0] for s in git(site, 'ls-tree', '-r', ref, 'ledger/claims').splitlines()}
old, new = tree(a.base), tree(head)
added = sorted(new.keys() - old.keys())
rows = []
for path in added:
    row = yaml.safe_load(git(site, 'show', f'{head}:{path}'))
    rows.append({k: row.get(k) for k in ['id', 'value', 'unit', 'name', 'source', 'attributed_to', 'published_at', 'reference_date', 'document', 'excerpt']})
docs = []
source = motor / 'content/15 Orcamento do Estado 2027/source/v2a'
for receipt in sorted(source.glob('*.pedido.json')):
    r = json.loads(receipt.read_text())
    file = receipt.name.removesuffix('.pedido.json')
    raw = (source / file).read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    assert digest == r['sha256'], file
    docs.append({'ficheiro': file, 'bytes': len(raw), 'sha256': digest, 'estado': r['estado'],
                 'pedido': r['pedido'], 'acedido_em': r['acedido_em']})
result = {'base': a.base, 'cabeca_sitio': head, 'cabeca_motor': git(motor, 'rev-parse', 'HEAD'),
          'linhas_anteriores': len(old), 'linhas_finais': len(new), 'acrescentadas': len(added),
          'anteriores_alteradas': [f for f, blob in old.items() if new.get(f) != blob],
          'linhas': rows, 'documentos': docs}
assert not result['anteriores_alteradas']
pathlib.Path(a.saida).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(f"{len(old)} → {len(new)} linhas; {len(rows)} novas; {len(docs)} documentos conferidos por sha256.")
