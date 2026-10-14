#!/usr/bin/env python3
"""RH1-d: procura em bytes, espaços e formas sem descodificar os ficheiros."""
import importlib.util
import json
from pathlib import Path
import sys
from unittest.mock import patch

sys.dont_write_bytecode = True
RAIZ = Path(__file__).resolve().parents[2]


def ensaiar():
    spec = importlib.util.spec_from_file_location('guarda_rh1d', RAIZ / 'scripts/check-privacidade.py')
    g = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(g)
    d = g.detetor
    casos = g.plantas_formas_d()
    assert all(p['mordeu'] for p in casos), 'RH1-d: planta do portão não mordeu.'

    def provar(nome, condicao):
        assert condicao, 'RH1-d: falhou ' + nome
        casos.append({'id': nome, 'mordeu': True})

    inteiro = 'Pessoa Sintética Exemplo'
    for i, espaco in enumerate(d.espacos_unicode()):
        if espaco == '\n':
            continue  # LF continua a delimitar entradas do segredo.
        if espaco == '\t' or d.unicodedata.category(espaco) == 'Zs':
            lidas = d._ler_proibidos(inteiro.replace(' ', espaco), True)
            provar('espaco-unicode-' + str(i), lidas == (inteiro.encode(),))
        else:
            try:
                d._ler_proibidos(inteiro.replace(' ', espaco), True)
            except ValueError:
                provar('separador-recusado-' + str(i), True)
            else:
                provar('separador-recusado-' + str(i), False)
        provar('espaco-na-pagina-' + str(i), d.contem_cadeias(inteiro.replace(' ', espaco).encode(), (inteiro.encode(),)))
    for caso, texto in [
        ('entidade-nome', inteiro.replace('é', '&eacute;')),
        ('entidade-decimal', inteiro.replace('é', '&#233;')),
        ('entidade-hexadecimal', inteiro.replace('é', '&#xE9;')),
        ('escape', inteiro.replace('é', r'\u00e9')),
        ('formas-misturadas', inteiro.replace('é', '&#x00E9;').replace(' ', '&nbsp;\t')),
        ('ascii-em-entidade', inteiro.replace('P', '&#80;')),
        ('ascii-em-escape', inteiro.replace('P', r'\u0050')),
        ('caixa-mista', 'pEsSoA SINTÉtica eXeMpLo'),
    ]:
        provar(caso, d.contem_cadeias(texto.encode(), (b'cadeia-sintetica-ausente', inteiro.encode())))

    class Corpo(bytes):
        baixou = 0

        def decode(self, *args, **kwargs):
            raise AssertionError('RH1-d: o corpo não pode ser descodificado.')

        def lower(self):
            self.baixou += 1
            return super().lower()

    cadeias = (inteiro.encode(),)
    padrao = d.formas_comparaveis(cadeias)
    corpo = Corpo(inteiro.replace(' ', '&nbsp;').encode())
    with patch.object(d.html, 'unescape', side_effect=AssertionError('RH1-d: descodificação de HTML.')), \
            patch.object(d.unicodedata, 'normalize', side_effect=AssertionError('RH1-d: normalização do corpo.')):
        provar('corpo-em-bytes-uma-copia', d.contem_cadeias(corpo, cadeias) and corpo.baixou == 1)
        provar('formas-em-cache', d.formas_comparaveis(cadeias) is padrao)
    with patch.object(d, 'contem_cadeias', return_value=False):
        provar('detetor-cego-recusa-plantas', not all(p['mordeu'] for p in g.plantas_formas_d()))
    return {'passou': all(p['mordeu'] for p in casos), 'casos': casos}


if __name__ == '__main__':
    try:
        print(json.dumps(ensaiar(), ensure_ascii=False, indent=2))
    except AssertionError as erro:
        print(str(erro), file=sys.stderr)
        raise SystemExit(1)
    except Exception:
        print('RH1-d: ensaio recusado sem publicar dados privados.', file=sys.stderr)
        raise SystemExit(1)
