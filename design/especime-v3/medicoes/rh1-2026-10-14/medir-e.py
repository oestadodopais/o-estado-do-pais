#!/usr/bin/env python3
"""RH1-e: provas, custo, referências históricas e âmbito das auditorias."""
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import time
from types import ModuleType
from unittest.mock import patch

sys.dont_write_bytecode = True
AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
PREFIXO = AQUI.relative_to(RAIZ).as_posix() + '/'
DETECTOR = 'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py'
GUARDA = 'scripts/check-privacidade.py'


def modulo(nome, caminho):
    spec = importlib.util.spec_from_file_location(nome, RAIZ / caminho)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def git(*args):
    return subprocess.check_output(['git', *args], cwd=RAIZ)


def provas(guarda):
    teste = modulo('teste_e', 'tests/leituras/privacidade-rh1e.py')
    ensaio = teste.ensaiar()
    plantas = guarda.plantas_pessoais()
    historico = []
    for fase, ref in [('c', 'a1f6094e'), ('d', '9157e23e')]:
        m = ModuleType('historico_' + fase)
        m.__file__ = str(RAIZ / DETECTOR)
        exec(compile(git('show', ref + ':' + DETECTOR), '<detetor-historico>', 'exec'), vars(m))
        with patch.object(guarda, 'detetor', m):
            primeiras = guarda.plantas_formas_e()[:24]
        casos = [p for p in primeiras if p['id'].endswith('-utf-8')]
        historico.append({'fase': fase, 'cabeca': git('rev-parse', ref).decode().strip(),
                          'casos': casos, 'quantidade': len(casos),
                          'passou': len(casos) == 6 and all(p['mordeu'] == (fase == 'c') for p in casos)})
    return {'cabeca': git('rev-parse', 'HEAD').decode().strip(), 'ensaio': ensaio,
            'plantas_do_portao': plantas, 'quantidade_ensaio': len(ensaio['casos']),
            'quantidade_portao': len(plantas), 'quantidade_novas': len(guarda.plantas_formas_e()),
            'historico': historico, 'passou': ensaio['passou'] and all(p['mordeu'] for p in plantas)
            and all(h['passou'] for h in historico)}


def referencias():
    c = [(DETECTOR, n, inicio) for n, inicio in [(55, 'def _ler_proibidos'), (105, 'def formas_comparaveis'),
         (119, 'def contem_cadeias'), (159, 'def _nomes_dos_autores'), (171, 'nomes_dos_autores =')]]
    c += [(GUARDA, n, 'def ' + inicio) for n, inicio in [(189, 'recusar_rastreado'), (194, 'plantas_identidades'),
          (212, 'plantas_normalizacao'), (237, 'plantas_pessoais'), (290, 'medir_rastreados')]]
    c += [('scripts/gate-html.mjs', 374, '// RH1-c'), (PREFIXO + 'medir-b.py', 57, 'def reproduzir_entrega'),
          (PREFIXO + 'medir-c.py', 44, "'pdf_seguidos':"),
          ('tests/leituras/privacidade-rh1c.py', 58, 'fonte = inspect.getsource')]
    d = [(DETECTOR, n, inicio) for n, inicio in [(55, 'def _ler_proibidos'), (106, 'def formas_comparaveis'),
         (177, 'def espacos_unicode'), (181, 'def contem_cadeias')]]
    d += [(GUARDA, 260, 'def plantas_formas_d'), (PREFIXO + 'medir-c.py', 57, 'def auditar_entrega'),
          (PREFIXO + 'medir-d.py', 23, 'def medir_tempo'), ('tests/leituras/privacidade-rh1d.py', 13, 'def ensaiar')]
    linhas = []
    for ref, itens in [('a1f6094e', c), ('9157e23e', d)]:
        for ficheiro, numero, inicio in itens:
            texto = git('show', ref + ':' + ficheiro).decode().splitlines()[numero - 1].strip()
            linhas.append({'cabeca': git('rev-parse', ref).decode().strip(), 'ficheiro': ficheiro,
                           'linha': numero, 'inicio_esperado': inicio, 'passou': texto.startswith(inicio)})
    # As referências novas são lidas da cabeça comitada, nunca da árvore suja.
    for ficheiro, inicios in [(DETECTOR, ['def _ler_proibidos', 'def equivalencias_unicode', 'def formas_comparaveis', 'def contem_cadeias']),
                              (GUARDA, ['def plantas_formas_e']),
                              ('tests/leituras/privacidade-rh1e.py', ['def ensaiar']),
                              (PREFIXO + 'medir-e.py', ['def provas', 'def referencias', 'def escopo_d', 'def auditar_e'])]:
        texto = git('show', 'HEAD:' + ficheiro).decode().splitlines()
        for inicio in inicios:
            numeros = [i for i, l in enumerate(texto, 1) if l.startswith(inicio)]
            linhas.append({'cabeca': git('rev-parse', 'HEAD').decode().strip(), 'ficheiro': ficheiro,
                           'linha': numeros[0] if len(numeros) == 1 else None,
                           'inicio_esperado': inicio, 'passou': len(numeros) == 1})
    return {'referencias': linhas, 'quantidade': len(linhas), 'passou': all(l['passou'] for l in linhas)}


def escopo_d(guarda):
    ref = 'f8006eaa'
    nomes = [n for n in git('ls-tree', '-r', '--name-only', '-z', ref, '--', PREFIXO).decode().split('\0') if n]
    proprio = PREFIXO + 'auditoria-entrega-d.json'
    conferidos = [n for n in nomes if n != proprio]
    locais = [PREFIXO + 'portoes-' + f + '/alvos.json' for f in ('b', 'c', 'd')]
    cadeias = guarda.detetor.cadeias_pessoais()
    achados = [n for n in conferidos if guarda.recusar_rastreado(n, git('show', ref + ':' + n), cadeias)]
    for n in locais:
        assert n not in nomes and subprocess.run(['git', 'check-ignore', '-q', n], cwd=RAIZ).returncode == 0
        if guarda.recusar_rastreado(n, (RAIZ / n).read_bytes(), cadeias):
            achados.append(n)
    anterior = json.loads(git('show', ref + ':' + proprio))
    total = len(conferidos) + len(locais)
    return {'cabeca': git('rev-parse', ref).decode().strip(), 'momento': 'depois dos portões RH1-d e antes do registo da auditoria',
            'seguidos_no_pacote': len(nomes), 'proprio_registo_excluido': len(nomes) - len(conferidos),
            'alvos_ignorados_acrescentados': len(locais), 'total_conferido': total,
            'total_anterior': anterior['ficheiros_conferidos_antes_deste_registo'],
            'ficheiros_seguidos_conferidos': conferidos, 'ficheiros_locais_conferidos': locais, 'achados': achados,
            'passou': not achados and total == anterior['ficheiros_conferidos_antes_deste_registo']}


def auditar_e(guarda):
    portoes = modulo('portoes_e_auditoria', PREFIXO + 'medir-c.py').medir_portoes('e')
    assert portoes['passou'] and portoes['cabeca'] == portoes['cabeca_fim']
    excluidos = [AQUI / 'auditoria-entrega-e.json', AQUI / 'auditoria-e.log']
    ficheiros = [p for p in sorted(AQUI.rglob('*')) if p.is_file() and p not in excluidos]
    cadeias = guarda.detetor.cadeias_pessoais()
    achados = [p.relative_to(RAIZ).as_posix() for p in ficheiros
               if guarda.recusar_rastreado(p.relative_to(RAIZ).as_posix(), p.read_bytes(), cadeias)]
    return {'momento': 'depois dos portões RH1-e, do relatório e da conferência dos números',
            'cabeca_portoes': portoes['cabeca'], 'ficheiros': len(ficheiros),
            'manifesto': [p.relative_to(RAIZ).as_posix() for p in ficheiros],
            'excluidos': [p.relative_to(RAIZ).as_posix() for p in excluidos],
            'alvos_locais': sum(p.name == 'alvos.json' for p in ficheiros),
            'achados': achados, 'passou': not achados}


def perfil(guarda):
    tempos = {}
    def envolver(objeto, nome):
        original = getattr(objeto, nome)
        tempos[nome] = {'chamadas': 0, 'segundos': 0.0}
        def medido(*args, **kwargs):
            inicio = time.perf_counter()
            try:
                return original(*args, **kwargs)
            finally:
                tempos[nome]['chamadas'] += 1
                tempos[nome]['segundos'] += time.perf_counter() - inicio
        setattr(objeto, nome, medido)
    for nome in ('conferir', 'medir_api', 'medir_rastreados', 'plantas_pessoais', 'plantas_formas_e'):
        envolver(guarda, nome)
    for nome in ('contem_cadeias', 'formas_comparaveis'):
        envolver(guarda.detetor, nome)
    resultado = guarda.medir(RAIZ / 'dist', True)
    return {'tempos_inclusivos': tempos, 'passou': resultado['passou']}


def main():
    guarda = modulo('guarda_e_medida', GUARDA)
    guarda.detetor.carregar_proibidos_locais()
    if '--perfil' in sys.argv:
        resultado, nome = perfil(guarda), 'perfil-conferencia-e.json'
    elif '--tempo' in sys.argv:
        fase = sys.argv[sys.argv.index('--tempo') + 1]
        assert fase in ('antes', 'depois')
        resultado = modulo('tempo_e', PREFIXO + 'medir-d.py').medir_tempo()
        nome = 'tempo-' + fase + '-e.json'
    elif '--referencias' in sys.argv:
        resultado, nome = referencias(), 'referencias-e.json'
    elif '--escopo-d' in sys.argv:
        resultado, nome = escopo_d(guarda), 'escopo-auditoria-d.json'
    elif '--auditar' in sys.argv:
        resultado, nome = auditar_e(guarda), 'auditoria-entrega-e.json'
    elif '--portoes' in sys.argv:
        resultado = modulo('portoes_e', PREFIXO + 'medir-c.py').medir_portoes('e')
        texto = (AQUI / 'portoes-e/verify.log').read_text()
        tempo = re.search(r'✓ npm run check:privacidade · ([0-9.]+) s · código 0', texto)
        assert tempo, 'Falta o tempo da privacidade verde.'
        resultado['privacidade_segundos'] = float(tempo[1])
        nome = 'portoes-e-resumo.json'
        custo = {'isolada': {f: round(json.loads((AQUI / ('tempo-' + f + '-e.json')).read_text())['segundos'], 1)
                             for f in ('antes', 'depois')}, 'portao': resultado['privacidade_segundos']}
        custo['intermedia'] = round(json.loads((AQUI / 'tempo-intermedio-e.json').read_text())['segundos'], 1)
        custo['primeira_depois'] = round(json.loads((AQUI / 'tempo-primeira-depois-e.json').read_text())['segundos'], 1)
        custo['versao_d_no_corpus_atual'] = round(json.loads((AQUI / 'tempo-versao-d.json').read_text())['segundos'], 1)
        (AQUI / 'custo-e.json').write_text(guarda.json_seguro(custo))
    else:
        resultado, nome = provas(guarda), 'medidas-e.json'
    (AQUI / nome).write_text(guarda.json_seguro(resultado), encoding='utf-8')
    print(json.dumps({k: resultado[k] for k in ('passou', 'segundos', 'codigos', 'privacidade_segundos',
                     'quantidade_ensaio', 'quantidade_portao', 'quantidade_novas', 'quantidade',
                     'seguidos_no_pacote', 'total_conferido', 'ficheiros') if k in resultado}, ensure_ascii=False))
    return int(not resultado['passou'])


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception:
        print('RH1-e: medição recusada sem publicar dados privados.', file=sys.stderr)
        raise SystemExit(1)
