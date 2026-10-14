#!/usr/bin/env python3
"""RH1-b: conta a marca antes da decisão e mede a proteção transferida."""
import importlib.util
import json
from html.parser import HTMLParser
from pathlib import Path
import re
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


class Marcas(HTMLParser):
    def __init__(self):
        super().__init__()
        self.quantidade = 0

    def handle_starttag(self, tag, attrs):
        self.quantidade += sum(k == 'data-rotulo-nome' for k, _ in attrs)


def contar():
    paginas = sorted((RAIZ / 'dist').rglob('*.html'))
    dist = {'paginas_lidas': len(paginas), 'ocorrencias_literais': 0, 'atributos_rendidos': 0}
    for p in paginas:
        texto = p.read_text(encoding='utf-8')
        leitor = Marcas()
        leitor.feed(texto)
        dist['atributos_rendidos'] += leitor.quantidade
        dist['ocorrencias_literais'] += texto.count('data-rotulo-nome')
    src = {'ficheiros_lidos': 0, 'ocorrencias_literais': 0, 'atributos_em_tags': 0, 'ficheiros_com_marca': []}
    for p in sorted((RAIZ / 'src').rglob('*')):
        if not p.is_file():
            continue
        texto = p.read_bytes().decode('utf-8', errors='replace')
        src['ficheiros_lidos'] += 1
        ocorrencias = texto.count('data-rotulo-nome')
        src['ocorrencias_literais'] += ocorrencias
        src['atributos_em_tags'] += len(re.findall(r'<[A-Za-z][^<>]*\bdata-rotulo-nome\b', texto))
        if ocorrencias:
            src['ficheiros_com_marca'].append({'ficheiro': p.relative_to(RAIZ).as_posix(), 'ocorrencias': ocorrencias})
    assert paginas and src['ficheiros_lidos'], 'Faltam ficheiros para medir.'
    return {'dist': dist, 'src': src,
            'versao_dist': json.loads((RAIZ / 'dist/version.json').read_text())}


def main():
    guarda = modulo('guarda_rh1b_medida', 'scripts/check-privacidade.py')
    resultado = {'cabeca': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ).decode().strip(),
                 'marca': contar()}
    antes = '--antes' in sys.argv
    if antes:
        alvos = AQUI / 'portoes/alvos.json'
        resultado['alvos_bytes_antes'] = alvos.stat().st_size
        destino = AQUI / 'rotulo-nome-antes-b.json'
    else:
        teste = modulo('teste_rh1b_medida', 'tests/leituras/privacidade-rh1b.py')
        resultado['plantas'] = teste.ensaiar()
        resultado['rastreado'] = guarda.medir_rastreados(RAIZ, True)
        resultado['passou'] = resultado['plantas']['passou'] and resultado['rastreado']['passou']
        destino = AQUI / 'medidas-b.json'
    destino.write_text(guarda.json_seguro(resultado), encoding='utf-8')
    print(json.dumps({'marca': resultado['marca'], 'passou': resultado.get('passou'),
                      'plantas': len(resultado.get('plantas', {}).get('casos', []))}, ensure_ascii=False))
    return int(not resultado.get('passou', True))


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception:
        print('RH1-b: medição recusada sem publicar dados privados.', file=sys.stderr)
        raise SystemExit(1)
