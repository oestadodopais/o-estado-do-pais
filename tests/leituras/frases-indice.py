"""O escrivão chama o controlo do índice depois de o preparar, antes do commit."""
import importlib.util
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest.mock import patch
spec = importlib.util.spec_from_file_location('escrivao', 'scripts/leituras/escrivao.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
with TemporaryDirectory() as d:
    p = Path(d)
    (p/'scripts').mkdir()
    (p/'scripts/check-frases-afirmacao.mjs').touch()
    ordem = []
    def git(repo, *args):
        ordem.append(args[0]); return SimpleNamespace(returncode=0,stdout='',stderr='')
    def run(args, **kwargs):
        assert ordem == ['add']
        assert args == ['sh','scripts/leituras/comitar.sh','--conferir-indice']
        ordem.append('índice'); return SimpleNamespace(returncode=1,stdout='entrada nova',stderr='')
    with patch.object(m,'validar',return_value=None), patch.object(m,'git',side_effect=git), patch.object(m.subprocess,'run',side_effect=run), patch.object(m.subprocess,'Popen') as commit:
        r=m.executar(d,{'ficheiros':['linha'],'mensagem':'ensaio'})
        assert r['codigo']==1
        assert 'índice' in r['recusa']
        commit.assert_not_called()
print('índice preparado: uma recusa impede o commit no escrivão')
# A AUD1 tem de reconhecer as mesmas contrações e os verbos acrescentados.
import ast
import re
arvore=ast.parse(Path('design/especime-v3/medicoes/cam2a-2026-11-09/listar-frases.py').read_text())
expressoes={n.targets[0].id:eval(compile(ast.Expression(n.value),'<planta>','eval'),{'re':re}) for n in arvore.body if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id in ('ATR','CAU')}
for marca in ('por causa','resulta','resultado'):
    for prep in ('de','do','da','dos','das'):
        assert expressoes['CAU'].search('A mudança '+marca+' '+prep+' elementos.'), (marca,prep)
for verbo in ('diz','dizem','refere','referem','indica','indicam','conclui','concluem','estima','estimam','alerta','alertam'):
    assert expressoes['ATR'].search('A fonte '+verbo+' algo.'), verbo
assert not expressoes['ATR'].search('Mecanismo de Alerta')
print('AUD1: contrações e verbos portugueses conferidos')
