#!/usr/bin/env python3
"""Planta alterações no brief, no guião e no JSON depois de uma conferência verde.
Uso: python3 tests/leituras/briefs-presos.py [--json ficheiro]. Cópia sintética.
"""
import importlib.util
import json
import os
from unittest.mock import patch
from pathlib import Path
import sys
import tempfile

RAIZ = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('briefs', RAIZ / 'scripts/check-briefs.py')
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
casos = []
with tempfile.TemporaryDirectory(prefix='oedp-brief-preso-') as tmp:
    p = Path(tmp); mod.RAIZ = str(p)
    medidas = p / 'design/observatorio/medidas'; medidas.mkdir(parents=True)
    mod.MEDIDAS = str(medidas)
    brief = p / 'design/observatorio/BRIEF-ENSAIO-prova.md'
    texto = '# Ensaio de 06.10.2026\n\n## 0 · O que se mediu\n\nHá 13 objetos (`objetos`).\n'
    brief.write_text(texto)
    guiao = medidas / 'BRIEF-ENSAIO.py'
    escrito = {'brief': str(brief.relative_to(p)), 'guiao': str(guiao.relative_to(p)),
               'medidas': [{'nome': 'objetos', 'valor': 13, 'comando': 'ensaio sintético',
                            'conhecido_positivo': {'o_que': 'o objeto plantado', 'encontrado': True}}]}
    programa = "import json,os\nfrom pathlib import Path\np=Path('passagens')\np.write_text(p.read_text()+'x' if p.exists() else 'x')\nPath(os.environ['OEDP_MEDIDAS_JSON']).write_text(" + repr(json.dumps(escrito)) + ")\n"
    guiao.write_text(programa)
    ficheiro = medidas / 'BRIEF-ENSAIO.json'; ficheiro.write_text(json.dumps(escrito))
    corrida = {'cabeca': 'a' * 40, 'hora': '2026-10-06T00:00:00+00:00',
               'invocacao': ['python3', 'scripts/check-briefs.py', '--escrever-presos'],
               'id': '11111111-1111-4111-8111-111111111111', 'codigo': 0}
    def conferir(presos=None, selar=False):
        erros, novos, estado = [], {}, {'presos': 0, 'reexecutados': 0}
        mod.confere(str(brief), erros, [], {}, presos, novos, estado, corrida if selar else None)
        return erros, novos, estado
    # A planta local não herda o modo CI do portão que a chamou.
    os.environ.pop('CI', None)
    os.environ.pop('GITHUB_ACTIONS', None)
    erros, presos, estado = conferir(selar=True)
    assert not erros and estado['reexecutados'] == 1
    erros, _, estado = conferir(presos)
    assert not erros and estado['presos'] == 1 and (p / 'passagens').read_text() == 'x'
    casos.append({'planta': 'controlo preso não volta a executar o guião', 'mensagem': 'bytes iguais; §0 e JSON conferidos', 'passou': True})
    erros, novos, estado = conferir(presos, selar=True)
    assert not erros and estado['reexecutados'] == 1 and novos
    assert novos[str(brief.relative_to(p))]['execucao'] == corrida
    casos.append({'planta': 'a gravação executa mesmo com selo válido',
                  'mensagem': 'Só se selam guiões verdes desta invocação.', 'passou': True})
    manual = {k: {c: v for c, v in selo.items() if c != 'execucao'} for k, selo in presos.items()}
    erros, novos, _ = conferir(manual)
    assert any('selo recusado: falta o registo de execução verde' in e for e in erros) and not novos
    casos.append({'planta': 'selo escrito à mão sem execução', 'mensagens': erros, 'passou': True})
    for variavel in ('GITHUB_ACTIONS', 'CI'):
        antes = len((p / 'passagens').read_text())
        with patch.dict(os.environ, {variavel: 'true'}):
            erros, novos, estado = conferir(presos)
        assert not erros and estado == {'presos': 0, 'reexecutados': 1} and not novos
        assert len((p / 'passagens').read_text()) == antes + 1
        casos.append({'planta': f'{variavel} ignora um selo válido',
                      'mensagem': 'O guião correu com a variável de GitHub/CI no ambiente.', 'passou': True})
    brief.write_text(texto.replace('13 objetos', '14 objetos'))
    erros, _, estado = conferir(presos)
    assert estado['reexecutados'] == 1 and any('o §0 escreve «14»' in e for e in erros)
    casos.append({'planta': 'número alterado no brief preso', 'mensagens': erros, 'passou': True})
    brief.write_text(texto)
    guiao.write_text(programa.replace('"valor": 13', '"valor": 14'))
    erros, _, estado = conferir(presos)
    assert estado['reexecutados'] == 1 and any('vale 14 hoje' in e for e in erros)
    casos.append({'planta': 'número alterado no guião preso', 'mensagens': erros, 'passou': True})
    guiao.write_text(programa)
    ficheiro.write_text(json.dumps(escrito).replace('"valor": 13', '"valor": 14'))
    erros, _, estado = conferir(presos)
    assert estado['reexecutados'] == 1 and any('ficheiro diz 14' in e for e in erros)
    casos.append({'planta': 'JSON alterado com os selos antigos', 'mensagens': erros, 'passou': True})
    erros, novos, estado = conferir(presos, selar=True)
    assert erros and not novos and estado['reexecutados'] == 1
    assert any('ficheiro diz 14' in e for e in erros)
    casos.append({'planta': 'corrida vermelha não produz selo', 'mensagens': erros, 'passou': True})
saida = {'ok': True, 'casos': casos}
if '--json' in sys.argv:
    Path(sys.argv[sys.argv.index('--json') + 1]).write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
