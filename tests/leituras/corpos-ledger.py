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
# COR3-B: o quadro conserva a ordem dos cabeçalhos, a linha, a seleção e a página.
quadro = {'id': 'planta-quadro', 'excerpt': 'Quadro 3.2. Principais medidas\n(milhões de euros)\nImpacto incremental em 2027\nAtualização do limite do mínimo de existência -121\nSeleção: 2027; impacto incremental; milhões de euros', 'document': {'page': 2, 'locator': 'Quadro 3.2; coluna 1: 2027; impacto incremental; milhões de euros; p. 2 PDF'}}
paginas = ['', c.normal('Quadro 3.2. Principais medidas (milhões de euros) Impacto incremental em 2027 Outra linha 100 Atualização do limite do mínimo de existência -121')]
assert c.excerto_pdf_confere(quadro, paginas)
for antes, depois in [('-121', '-122'), ('Quadro 3.2', 'Quadro 3.3'), ('Seleção: 2027', 'Seleção: 2026')]:
    assert not c.excerto_pdf_confere({**quadro, 'excerpt': quadro['excerpt'].replace(antes, depois)}, paginas)
assert not c.excerto_pdf_confere({**quadro, 'document': {**quadro['document'], 'page': 1}}, paginas)
assert not c.excerto_pdf_confere(quadro, ['', 'Atualização do limite do mínimo de existência -121 ' + paginas[1].split('Outra linha')[0]])
assert not c.excerto_pdf_confere({**quadro, 'excerpt': quadro['excerpt'] + '\nPalavras inventadas.'}, paginas)
print('COR3-B: quadro com seleção provado; valor, cabeçalho, seleção, página, ordem e texto inventado recusados')
