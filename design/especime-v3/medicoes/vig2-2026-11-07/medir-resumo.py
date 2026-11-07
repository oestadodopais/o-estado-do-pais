"""VIG2 (07.11.2026): mede o resumo da vigilância com o limite levantado, numa cópia dos dados da vigilância; não escreve no motor. uso: python3 medir-resumo.py <motor> <cópia dos dados>"""
import sys, types, json
M, dados = sys.argv[1], sys.argv[2]
sys.path.insert(0, M)
import vigilancia
src = open(M + '/vigilancia/diario.py', encoding='utf-8').read()
n = src.count('2500')
src = src.replace('>= 2500', '>= 10**9').replace('< 2500', '< 10**9')
mod = types.ModuleType('vigilancia.diario'); mod.__file__ = M + '/vigilancia/diario.py'; mod.__package__ = 'vigilancia'
sys.modules['vigilancia.diario'] = mod
exec(compile(src, mod.__file__, 'exec'), mod.__dict__)
r = mod.executar(dados)
from pathlib import Path
res = sorted(Path(dados, 'resumo').glob('*.md'))[-1]
t = res.read_text(encoding='utf-8')
print(json.dumps({'ocorrencias_do_limite_no_codigo': n, 'resumo': res.name, 'bytes': len(t.encode()), 'linhas': t.count('\n'),
                  'medidas': r['medidas'], 'falhas': len(r['falhas']), 'fila': len(r['fila'])}, ensure_ascii=False))
