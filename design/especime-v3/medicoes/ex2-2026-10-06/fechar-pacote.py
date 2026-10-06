"""Confere o pacote e reserva para a direção os guiões e o manifesto dos estragos."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import subprocess

pasta = Path('design/especime-v3/medicoes/ex2-2026-10-06')
pacote = Path('node_modules/.cache/ex2-leitura')
manifesto = json.loads((pasta / 'pacote.json').read_text())
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
for p in manifesto['paginas']:
    assert sha(pacote / p['ficheiro']) == p['sha256_copia'], 'A cópia mudou depois de plantada.'
    assert sha(Path('dist') / p['ficheiro'].removeprefix('built/')) == p['sha256_original'], 'O original construído foi alterado.'
for p in manifesto['plantas']:
    assert p['sha256_antes'] != p['sha256_depois'], 'Um estrago não mudou a cópia.'
    assert sha(pacote / p['ficheiro']) == p['sha256_depois'], 'O estrago não é o registado.'
capturas = json.loads((pasta / 'capturas.json').read_text())['capturas']
for c in capturas:
    assert sha(pacote / c['ficheiro']) == c['sha256'], 'A captura copiada difere do original.'

# O leitor recebe as alterações do sítio, sem o guião que revela os estragos das cópias.
reservados = [str(pasta / f) for f in ['preparar-pacote.mjs', 'fechar-pacote.py', 'pacote.json']]
for f in reservados:
    (pacote / f).unlink(missing_ok=True)
diff = pacote / 'diff.patch'
partes = re.split(r'(?=^diff --git )', diff.read_text(), flags=re.M)
diff.write_text(''.join(t for t in partes if not any(t.startswith(f'diff --git a/{f} b/{f}\n') for f in reservados)))
shutil.copyfile('dist/version.json', pacote / 'built/version.json')
manifesto['destino'] = '<worktree>/' + pacote.as_posix()
manifesto['comando'] = 'node design/especime-v3/medicoes/ex2-2026-10-06/preparar-pacote.mjs node_modules/.cache/ex2-leitura; python3 design/especime-v3/medicoes/ex2-2026-10-06/fechar-pacote.py'
manifesto['reservados_a_direcao'] = reservados
manifesto['conferencia'] = {'paginas': len(manifesto['paginas']), 'estragos': len(manifesto['plantas']), 'capturas': len(capturas), 'originais_intactos': True, 'resumos_conferem': True, 'versao_copiada': sha(pacote / 'built/version.json') == sha(Path('dist/version.json'))}
(pasta / 'pacote.json').write_text(json.dumps(manifesto, ensure_ascii=False, indent=2) + '\n')
relatorio = pasta / 'LEIA-ME.md'
texto = relatorio.read_text().replace('<p>', '&lt;p&gt;')
if '\n## Pacote para a leitura a frio\n' in texto:
    texto = texto.split('\n## Pacote para a leitura a frio\n')[0]
texto += f'''
## Pacote para a leitura a frio

O pacote local está em `<worktree>/{pacote.as_posix()}`, numa pasta ignorada pelo Git dentro da worktree. Contém {len(manifesto['paginas'])} páginas construídas, as {len(capturas)} capturas e {len(manifesto['plantas'])} estragos apenas nas cópias, registados por SHA-256 em [pacote.json](pacote.json). Os originais em `dist/` foram reconferidos e permanecem intactos. Os guiões e o manifesto que revelam os estragos ficam reservados à direção, fora do pacote entregue ao leitor. O código da conferência e os comandos estão no manifesto e em `fechar-pacote.py`.
'''
relatorio.write_text(texto)
shutil.copyfile(relatorio, pacote / 'relatorio-construtor.md')
shutil.copyfile(relatorio, pacote / pasta / 'LEIA-ME.md')
(pacote / 'LEITURA.md').write_text('Ler o brief e as páginas em built/, com as capturas. Responder ao teste dos dois minutos: percebe-se o que cada número que mudou é? Um editor de um diário português imprimiria as páginas? O guião e o manifesto dos estragos são reservados ao lugar de direção e não fazem parte deste pacote.\n')
r = subprocess.run(['python3', 'scripts/leituras/conferir-relatorio.py', str(relatorio), str(pasta)], capture_output=True, text=True)
saida = (r.stdout + r.stderr).replace(str(Path.cwd()), '<worktree>').replace(str(Path.home()), '<casa>')
(pasta / 'numeros-do-relatorio.log').write_text(saida)
(pasta / 'numeros-do-relatorio.codigo').write_text(str(r.returncode) + '\n')
(pacote / 'numeros-do-relatorio.txt').write_text(saida + f'código de saída: {r.returncode}\n')
assert r.returncode == 0, 'A conferência dos números do relatório falhou.'
print(json.dumps(manifesto['conferencia'], ensure_ascii=False))
