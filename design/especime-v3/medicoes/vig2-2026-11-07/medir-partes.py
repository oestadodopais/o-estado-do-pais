"""VIG2: reconstrói a fixture sintética e mede as partes, sem rede.

Uso: python3 medir-partes.py <motor> <pasta de saída nova>
A escala vem da medida de 07.11; o conteúdo não reconstrói o índice real.
"""
import hashlib
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, sys.argv[1])
from vigilancia import diario, verificar
from vigilancia.tests.test_resumo_partes import indice_acumulado, ProvasPartes

saida = Path(sys.argv[2])
saida.mkdir(parents=True, exist_ok=False)
indice = indice_acumulado()
with patch.object(diario, 'repartir_resumo', wraps=diario.repartir_resumo) as repartir:
    detalhes = diario.detalhes_resumo(indice)
_, linhas, unidades = repartir.call_args.args
minimo_bytes = len(('\n'.join(linhas + unidades) + '\n').encode())
partes = detalhes['partes']
verificar.resumo_partes(indice, partes)
recibo = {'quantidade': len(partes), 'bytes': [len(p.encode()) for p in partes]}
indice['corridas'][-1]['resumo'] = {'partes': recibo}
diario.escrever_resumo(saida, indice, detalhes)
provas = {}
for nome in ('acumulacao', 'designacao_tirada', 'parte_acima_limite', 'numero_errado', 'uma_parte_identica'):
    resultado = unittest.TestResult()
    ProvasPartes('test_vig2_' + nome).run(resultado)
    provas[nome] = {'codigo': 0 if resultado.wasSuccessful() else 1, 'provas': resultado.testsRun}
    if not resultado.wasSuccessful():
        raise SystemExit('Prova recusada: ' + nome)
antes = Path(sys.argv[1]) / 'vigilancia/tests/fixtures/resumo-2026-10-12-antes-vig2.md'
medidas = {
    'natureza': 'Ensaio sintético identificado; não é o índice real de 07.11.2026.',
    'origem_da_escala': 'medida-2026-11-07.json',
    'conteudo': 'Cinco atos e 5096 declarações em oito DAR. Títulos extensos sintéticos forçam a divisão; razão e oradores também sintéticos.',
    'entradas': len(indice['entradas']), 'designacoes': len(detalhes['designacoes']),
    'grupos_dar': len(detalhes['grupos_dar']), 'minimo_bytes': minimo_bytes,
    'limite_exclusivo_bytes': 2500, 'partes': recibo,
    'descricoes_cortadas': detalhes['descricoes_cortadas'], 'designacoes_omitidas': detalhes['omitidas'],
    'historico_12_10': {'bytes': len(antes.read_bytes()), 'sha256': hashlib.sha256(antes.read_bytes()).hexdigest(),
                       'referencia': 'Saída do código anterior à VIG2 sobre o índice do repositório, congelada antes da alteração.'},
    'cinco_provas': provas,
}
(saida / 'medidas-vig2.json').write_text(json.dumps(medidas, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'minimo_bytes': minimo_bytes, 'partes': recibo, 'cinco_provas': provas}, ensure_ascii=False))
