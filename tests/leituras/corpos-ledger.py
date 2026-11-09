#!/usr/bin/env python3
"""CAM2-A: controlos e plantas dos corpos e dos excertos, sem rede."""
import sys
from pathlib import Path
import hashlib
import gzip
import json
import os
import subprocess
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts/leituras'))
import importlib.util
spec = importlib.util.spec_from_file_location('corpos_cam2a', Path(__file__).resolve().parents[2] / 'scripts/leituras/corpos-ledger.py')
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
raw = b'<html><body><p>Texto da <b>fonte</b> de ensaio.</p><script>invisivel</script></body></html>'
sha = hashlib.sha256(raw).hexdigest()
linha = {'id':'planta', 'excerpt':'Texto da fonte de ensaio.', 'document':{'source_sha256':sha}}
indice = {sha: ('repo', 'head', 'corpo.html')}
assert c.conferir([linha], {}, True), 'corpo ausente passou'
with patch.object(c, 'git', return_value=raw):
    assert not c.conferir([linha], indice, True)
    assert c.conferir([{**linha, 'excerpt':'Excerto que nao esta na fonte'}], indice, True)
with patch.object(c, 'git', return_value=b'bytes trocados'):
    try: c.conferir([linha], indice, True)
    except ValueError: pass
    else: raise AssertionError('sha diferente passou')
assert c.normal('comuni-\ncação  e  ﬁm') == 'comunicação e fim'
assert c.texto_do_corpo(gzip.compress(raw)) == 'Texto da fonte de ensaio.'
env = {k:v for k,v in os.environ.items() if k != 'RESEARCHHUB_DIR'}
r = subprocess.run([sys.executable, str(Path(c.__file__))], input=json.dumps({'linhas':[linha]}), text=True, capture_output=True, env=env, check=True)
a = json.loads(r.stdout); assert not a['limpa'] and a['lidas'] == 0 and 'não leu' in a['estado']
print('corpos: controlo verde; falta de corpo, excerto ausente e bytes trocados recusados; HTML, gzip, normalização e ausência do motor conferidos')
