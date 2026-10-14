#!/usr/bin/env python3
"""RH1: mede o ramo real e as plantas sintéticas sem publicar cadeias privadas."""
import importlib.util
import json
import os
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


def main():
    guarda = modulo('guarda_medida_rh1', 'scripts/check-privacidade.py')
    ensaio = modulo('ensaio_medida_rh1', 'tests/leituras/privacidade-segredo.py')
    rastreado = guarda.medir_rastreados(RAIZ, True)
    sintetico = ensaio.ensaiar()
    resultado = {
        'cabeca_medida': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ).decode().strip(),
        'ficheiros_seguidos_conferidos': rastreado['ficheiros'],
        'rastreado': rastreado, 'ensaio': sintetico,
        'passou': rastreado['passou'] and sintetico['passou'],
    }
    texto = guarda.json_seguro(resultado)
    destino = Path(os.environ.get('OEDP_MEDIDAS_JSON', AQUI / 'medidas.json'))
    destino.write_text(texto, encoding='utf-8')
    print(json.dumps({'passou': resultado['passou'], 'ficheiros': rastreado['ficheiros'],
                      'ocorrencias': rastreado['quantidade'],
                      'plantas': len(rastreado['plantas']) + len(sintetico['plantas']),
                      'cadeias_sinteticas_lidas': sintetico['cadeias_sinteticas_lidas']}, ensure_ascii=False))
    return int(not resultado['passou'])


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception:
        print('RH1: medição recusada; nenhum dado privado se imprime.', file=sys.stderr)
        raise SystemExit(1)
