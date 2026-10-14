#!/usr/bin/env python3
"""RH1-d: mede a mesma conferência antes e depois e regista provas e portões."""
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import time
from types import ModuleType

sys.dont_write_bytecode = True
AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]


def modulo(nome, caminho):
    spec = importlib.util.spec_from_file_location(nome, RAIZ / caminho)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def conferir_versao(referencia):
    """Executa código histórico em memória sobre a árvore e o dist atuais."""
    referencia = subprocess.check_output(['git', 'rev-parse', '--verify', referencia + '^{commit}'], cwd=RAIZ).decode().strip()
    modulos = []
    for caminho in ('design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py', 'scripts/check-privacidade.py'):
        m = ModuleType('medicao_historica_' + str(len(modulos)))
        m.__file__ = str(RAIZ / caminho)
        fonte = subprocess.check_output(['git', 'show', referencia + ':' + caminho], cwd=RAIZ)
        exec(compile(fonte, '<conferencia-historica>', 'exec'), vars(m))
        modulos.append(m)
    detetor, guarda = modulos
    guarda.detetor = detetor
    detetor.carregar_proibidos_locais()
    resultado = guarda.medir(RAIZ / 'dist', True)
    print(guarda.json_seguro(resultado))
    return int(not resultado['passou'])


def medir_tempo(referencia=None):
    comando = ['python3', 'scripts/check-privacidade.py', '--prova']
    if referencia:
        comando = ['python3', Path(__file__).relative_to(RAIZ).as_posix(), '--conferir-versao', referencia]
    inicio = time.perf_counter()
    r = subprocess.run(comando, cwd=RAIZ, capture_output=True)
    segundos = time.perf_counter() - inicio
    if r.returncode:
        raise RuntimeError('Conferência recusada.')
    dados = json.loads(r.stdout)
    return {'comando': ' '.join(comando), 'versao_conferencia': referencia or 'arvore_atual',
            'cabeca': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ).decode().strip(),
            'versao_dist': json.loads((RAIZ / 'dist/version.json').read_text()),
            'segundos': segundos, 'codigo': r.returncode, 'passou': dados['passou'],
            'ficheiros_dist': dados['ficheiros'], 'ficheiros_seguidos': dados['rastreado']['ficheiros']}


def main():
    if '--conferir-versao' in sys.argv:
        return conferir_versao(sys.argv[sys.argv.index('--conferir-versao') + 1])
    guarda = modulo('guarda_medida_d', 'scripts/check-privacidade.py')
    guarda.detetor.carregar_proibidos_locais()
    if '--tempo-versao' in sys.argv:
        referencia = sys.argv[sys.argv.index('--tempo-versao') + 1]
        resultado = medir_tempo(referencia)
        destino = AQUI / 'tempo-versao-d.json'
    elif '--tempo' in sys.argv:
        fase = sys.argv[sys.argv.index('--tempo') + 1]
        assert fase in ('antes', 'depois'), 'Fase de medição inválida.'
        resultado = medir_tempo()
        destino = AQUI / ('tempo-' + fase + '-d.json')
    elif '--portoes' in sys.argv:
        anterior = modulo('medida_c_d', 'design/especime-v3/medicoes/rh1-2026-10-14/medir-c.py')
        resultado = anterior.medir_portoes('d')
        texto = (AQUI / 'portoes-d/verify.log').read_text()
        medicao = re.search(r'✓ npm run check:privacidade · ([0-9.]+) s · código ([0-9]+)', texto)
        assert medicao and medicao[2] == '0', 'Falta o tempo da privacidade verde.'
        resultado['privacidade_segundos'] = float(medicao[1])
        destino = AQUI / 'portoes-d-resumo.json'
    else:
        teste = modulo('teste_medida_d', 'tests/leituras/privacidade-rh1d.py')
        resultado = {'cabeca': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ).decode().strip(),
                     'ensaio': teste.ensaiar(), 'plantas_do_portao': guarda.plantas_pessoais()}
        resultado['passou'] = resultado['ensaio']['passou'] and all(p['mordeu'] for p in resultado['plantas_do_portao'])
        destino = AQUI / 'medidas-d.json'
    destino.write_text(guarda.json_seguro(resultado), encoding='utf-8')
    resumo = {k: resultado[k] for k in ('cabeca', 'passou', 'segundos', 'privacidade_segundos', 'codigos') if k in resultado}
    if 'ensaio' in resultado:
        resumo['plantas_ensaio'] = len(resultado['ensaio']['casos'])
        resumo['plantas_do_portao'] = len(resultado['plantas_do_portao'])
    print(json.dumps(resumo, ensure_ascii=False))
    return int(not resultado['passou'])


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception:
        print('RH1-d: medição recusada sem publicar dados privados.', file=sys.stderr)
        raise SystemExit(1)
