"""Lista as diferenças de dados desde a cabeça recebida, sem testar regras novas."""
from pathlib import Path
import argparse, hashlib, json, subprocess
HERE = Path(__file__).resolve().parent
BASE = '0df1935'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--motor', type=Path, required=True)
    args = parser.parse_args()
    relative = 'content/23 Habitacao/ledger.json'
    before = json.loads(subprocess.check_output(['git', 'show', BASE + ':' + relative], cwd=args.motor))
    after = json.loads((args.motor / relative).read_text())
    old = {r['id']: r for r in before['claims']}
    changed = []
    for row in after['claims']:
        previous = old.get(row['id'])
        if previous != row:
            fields = ['linha nova'] if previous is None else sorted(k for k in set(previous) | set(row) if previous.get(k) != row.get(k))
            changed.append({'id': row['id'], 'campos': fields})
    result = {'base_motor': subprocess.check_output(['git', 'rev-parse', BASE], cwd=args.motor, text=True).strip(),
              'livro_sha256': hashlib.sha256((args.motor / relative).read_bytes()).hexdigest(),
              'linhas': changed, 'retiradas': sorted(set(old) - {r['id'] for r in after['claims']})}
    (HERE / 'linhas-alteradas.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(str(len(changed)) + ' linhas mudadas; ' + str(len(result['retiradas'])) + ' retiradas.')

if __name__ == '__main__': main()
