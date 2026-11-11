import hashlib,json
from pathlib import Path
from core.citacoes_atribuidas import conferir_todas
from core.texto_julgado import unidades
tech=Path('content/19 Évora 2027 Capital Europeia da Cultura/Technical Source')
contracts=json.loads((tech/'texto-julgado.json').read_text())
sha=hashlib.sha256((tech/'evb/CITACOES-atribuidas.json').read_bytes()).hexdigest()
for lang in ('pt','en'):
 assert sha==contracts[lang]['citacoes_atribuidas_sha256']
 count=conferir_todas(unidades((tech/contracts[lang]['referencia']).read_text()),tech,lang)
 print(f'{lang}: {count} citações conferidas, resumo do contrato igual ao ficheiro instalado')
print('EVB_D_CITACOES: PASS')
