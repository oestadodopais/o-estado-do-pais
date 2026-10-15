#!/usr/bin/env python3
"""RH1-c: provas sintéticas, reprodução das contagens e leitura dos portões."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

sys.dont_write_bytecode = True
AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]


def modulo(nome, caminho):
    spec = importlib.util.spec_from_file_location(nome, RAIZ / caminho)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def medir_portoes(fase='c'):
    pasta = AQUI / ('portoes-' + fase)
    codigos = {n: int((pasta / (n + '.codigo')).read_text()) for n in ('build', 'verify', 'typecheck')}
    texto = (pasta / 'verify.log').read_text()
    inicio = texto.index('    {', texto.index('✓ npm run check:privacidade ·'))
    privacidade, _ = json.JSONDecoder().raw_decode(texto[inicio:].lstrip())
    verify = json.loads((pasta / 'verify.json').read_text())
    return {'cabeca': (pasta / 'cabeca').read_text().strip(),
            'cabeca_fim': (pasta / 'cabeca.fim').read_text().strip(),
            'codigos': codigos, 'celulas': verify['celulas'], 'privacidade': privacidade,
            'passou': all(c == 0 for c in codigos.values()) and privacidade['passou']}


def main():
    guarda = modulo('guarda_rh1c_medida', 'scripts/check-privacidade.py')
    if '--portoes' in sys.argv:
        resultado = medir_portoes()
        destino = AQUI / 'portoes-c-resumo.json'
    else:
        teste = modulo('teste_rh1c_medida', 'tests/leituras/privacidade-rh1c.py')
        anterior = modulo('medida_b_rh1c', 'design/especime-v3/medicoes/rh1-2026-10-14/medir-b.py')
        seguidos = subprocess.check_output(['git', 'ls-files', '-z'], cwd=RAIZ).decode().split('\0')
        resultado = {'cabeca': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ).decode().strip(),
                     'pdf_seguidos': sum(n.lower().endswith('.pdf') for n in seguidos if n),
                     'plantas': teste.ensaiar(), 'reproducao_b': anterior.reproduzir_entrega(),
                     'rastreado': guarda.medir_rastreados(RAIZ, True)}
        resultado['passou'] = all(resultado[n]['passou'] for n in ('plantas', 'reproducao_b', 'rastreado'))
        destino = AQUI / 'medidas-c.json'
    destino.write_text(guarda.json_seguro(resultado), encoding='utf-8')
    print(json.dumps({'passou': resultado['passou'], 'cabeca': resultado['cabeca'],
                      'pdf_seguidos': resultado.get('pdf_seguidos'),
                      'plantas': len(resultado.get('plantas', {}).get('casos', [])),
                      'codigos': resultado.get('codigos')}, ensure_ascii=False))
    return int(not resultado['passou'])


def auditar_entrega(fase):
    """RH1-c usa o âmbito histórico; RH1-d audita a pasta atual, sem o registo."""
    if fase not in ('c', 'd'):
        raise ValueError('Passagem de auditoria inválida.')
    guarda = modulo('guarda_auditoria', 'scripts/check-privacidade.py')
    guarda.detetor.carregar_proibidos_locais()
    destino = AQUI / ('auditoria-entrega-' + fase + '.json')
    prefixo = AQUI.relative_to(RAIZ).as_posix() + '/'
    if fase == 'c':
        nomes = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', '-z',
                                         'c0f09ff8', '--', prefixo], cwd=RAIZ).decode().split('\0')
        nomes = [n for n in nomes if n and n != destino.relative_to(RAIZ).as_posix()]
        ficheiros = [(n, subprocess.check_output(['git', 'show', 'c0f09ff8:' + n], cwd=RAIZ)) for n in nomes]
        for local in ('portoes-b/alvos.json', 'portoes-c/alvos.json'):
            assert prefixo + local not in nomes, 'Alvo histórico inesperadamente seguido.'
            ficheiros.append((prefixo + local, (AQUI / local).read_bytes()))
    else:
        ficheiros = [(p.relative_to(RAIZ).as_posix(), p.read_bytes())
                     for p in sorted(AQUI.rglob('*')) if p.is_file() and p != destino]
    cadeias = guarda.detetor.cadeias_pessoais()
    achados = [n for n, corpo in ficheiros if guarda.recusar_rastreado(n, corpo, cadeias)]
    locais = [n for n, _ in ficheiros if n.endswith('/alvos.json') and (RAIZ / n).is_file()]
    ignorados = [n for n in locais if subprocess.run(['git', 'check-ignore', '-q', n],
                                                    cwd=RAIZ, capture_output=True).returncode == 0]
    resultado = {'ficheiros_conferidos_antes_deste_registo': len(ficheiros),
                 'inclui_alvos_locais_ignorados': bool(ignorados), 'achados': achados, 'passou': not achados}
    destino.write_text(guarda.json_seguro(resultado), encoding='utf-8')
    return resultado


if __name__ == '__main__':
    try:
        if '--auditar' in sys.argv:
            resultado = auditar_entrega(sys.argv[sys.argv.index('--auditar') + 1])
            print(json.dumps({'passou': resultado['passou'],
                              'ficheiros': resultado['ficheiros_conferidos_antes_deste_registo']}))
            raise SystemExit(int(not resultado['passou']))
        raise SystemExit(main())
    except Exception:
        print('RH1-c: medição recusada sem publicar dados privados.', file=sys.stderr)
        raise SystemExit(1)
