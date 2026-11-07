"""VIG2 (07.11.2026): o tamanho do resumo mínimo (designações, razões, cabeçalhos DAR) sobre um índice da vigilância, pela própria função do motor cortada no ponto da recusa. uso: python3 minimo-do-resumo.py <motor> <índice>"""
import sys, json, re, types
M, indice = sys.argv[1], sys.argv[2]
sys.path.insert(0, M)
import vigilancia
src = open(M + '/vigilancia/diario.py', encoding='utf-8').read()
a = "    if len(montar(itens, blocos).encode()) >= 2500:\n        raise Recusa('designações, razões e cabeçalhos DAR excedem o limite do resumo; nenhum omitido em silêncio')"
assert src.count(a) == 1
src = src.replace(a, "    return {'minimo_bytes': len(montar(itens, blocos).encode()), 'atos': len(atos), 'grupos_dar': len(blocos), 'linhas_de_fontes': len(linhas)}")
mod = types.ModuleType('vigilancia.diario_minimo'); mod.__package__ = 'vigilancia'; mod.__file__ = M + '/vigilancia/diario.py'
exec(compile(src, M + '/vigilancia/diario.py', 'exec'), mod.__dict__)
print(json.dumps(mod.detalhes_resumo(json.load(open(indice, encoding='utf-8'))), ensure_ascii=False))
