"""EO1-d: o mesmo corpo deve preferir a cópia que conserva o recibo do pedido."""
import importlib.util
import subprocess
from pathlib import Path
from unittest.mock import patch

root = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('pacote', root / 'scripts/leituras/pacote.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
body = b'corpo igual nas duas fontes'
digest = module.sha256_de(body)
old = 'content/13/source/diploma.pdf'
new = 'content/25/source/diploma.pdf'

def git(repo, *args):
    if args[0] == 'ls-tree':
        return {'ledger/provas': b'', 'content/13/source': old.encode()+b'\0',
                'content/25/source': new.encode()+b'\0'}.get(args[-1], b'')
    raise AssertionError(args)

def run(args, **kwargs):
    key = args[-1].split(':', 1)[1]
    if 'show' in args:
        return subprocess.CompletedProcess(args, 0, body, b'')
    return subprocess.CompletedProcess(args, 0 if key == new+'.pedido.json' else 1, b'', b'')

with patch.object(module, 'git', git), patch.object(module.subprocess, 'run', run):
    result = module.indice_dos_corpos(Path('sitio'), 'cabeca', Path('motor'), 'cabeca', {'content/13', 'content/25'}, {digest})
    assert result[digest][0] == new, 'a cópia sem recibo ganhou'
    assert result[digest][1] == 'fontes do estudo (content/25)'
print('EO1-d pacote: cópias com hash igual, preferência pelo recibo: código 0')
