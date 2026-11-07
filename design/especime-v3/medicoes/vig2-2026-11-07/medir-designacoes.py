"""VIG2 A: confere o índice real em leitura, sem o copiar para o repositório.

Uso: python3 medir-designacoes.py <motor> <indice-real> <medidas.json>
"""
import copy
import hashlib
import json
from pathlib import Path
import re
import sys

sys.path.insert(0, sys.argv[1])
from vigilancia import diario, verificar
from vigilancia.transporte import Recusa

fonte = Path(sys.argv[2])
bruto = fonte.read_bytes()
digest = hashlib.sha256(bruto).hexdigest()
assert digest == '99a9f14c0bd32512fe91c178eb183d946ea751d1b857f859cfc7580479dd7bd9'
indice = json.loads(bruto)
antes = copy.deepcopy(indice)
detalhes = diario.detalhes_resumo(indice)
partes = detalhes['partes']
verificar.resumo_partes(indice, partes)
entradas = [e for e in diario.entradas_vigentes(indice['entradas']) if e['origem'] != 'dar'
            and (e.get('estreia', True) or e.get('revisao'))]
# Conferência independente do auxiliar de apresentação do motor.
esperadas = [re.sub(r'\s+', ' ', e['titulo'].partition('  -  Diário da República')[0]).strip()
             for e in entradas]
assert len(esperadas) == len(set(esperadas)) == 36
linhas = [l for p in partes for l in p.splitlines()]
contagens = []
for e, titulo in zip(entradas, esperadas):
    prefixo = ('Revisão' if e.get('revisao') else 'Entrada') + ': ' + titulo
    contagens.append(sum(l == prefixo + ' (detalhes no índice).' or l.startswith(prefixo + ' | ')
                         for l in linhas))
assert contagens == [1] * 36
assert sum(l.startswith(('Entrada: ', 'Revisão: ')) for l in linhas) == 36
assert all(len(p.encode()) < 2500 for p in partes)
alteradas = [e for e, titulo in zip(entradas, esperadas)
             if e['titulo'].partition('  -  Diário da República')[0] != titulo]
alvo = alteradas[0]
titulo = re.sub(r'\s+', ' ', alvo['titulo'].partition('  -  Diário da República')[0]).strip()
prefixo = ('Revisão' if alvo.get('revisao') else 'Entrada') + ': ' + titulo
adulteradas = ['\n'.join(l for l in p.splitlines()
                        if not (l == prefixo + ' (detalhes no índice).' or l.startswith(prefixo + ' | '))) + '\n'
               for p in partes]
try:
    verificar.resumo_partes(indice, adulteradas)
except Recusa as erro:
    recusa = str(erro)
    assert recusa == 'designações das partes divergem do índice, por omissão ou repetição'
else:
    raise AssertionError('designação retirada do índice real escapou à verificação')
assert indice == antes
assert fonte.read_bytes() == bruto
raiz = diario.REGISTO.parent
historico = json.loads((raiz / 'indice/2026-10-12.json').read_text())
referencia = (raiz / 'tests/fixtures/resumo-2026-10-12-antes-vig2.md').read_bytes()
h = diario.detalhes_resumo(historico)
assert len(h['partes']) == 1 and h['texto'].encode() == referencia
medidas = {
    'natureza': 'Índice real de 07.11.2026 fornecido em leitura pelo lugar de direção.',
    'indice_sha256': digest, 'indice_preservado': True,
    'entradas': len(indice['entradas']), 'designacoes': len(esperadas),
    'designacoes_normalizadas': len(alteradas), 'ocorrencias_por_designacao': contagens,
    'designacoes_exatamente_uma_vez': sum(n == 1 for n in contagens),
    'partes': {'quantidade': len(partes), 'bytes': [len(p.encode()) for p in partes]},
    'limite_exclusivo_bytes': 2500, 'designacoes_omitidas': detalhes['omitidas'],
    'indice_real_codigo': 0, 'designacao_real_tirada': {'codigo': 0, 'recusa_observada': recusa},
    'historico_12_10': {'codigo': 0, 'igual_byte_a_byte': True, 'bytes': len(referencia),
                       'sha256': hashlib.sha256(referencia).hexdigest()},
}
Path(sys.argv[3]).write_text(json.dumps(medidas, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'partes': medidas['partes'], 'designacoes': len(esperadas),
                  'normalizadas': len(alteradas), 'todas_exatamente_uma_vez': True,
                  'indice_preservado': True, 'historico_identico': True}, ensure_ascii=False))
