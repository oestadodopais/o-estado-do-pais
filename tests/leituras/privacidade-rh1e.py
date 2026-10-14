#!/usr/bin/env python3
"""RH1-e: regressões reais, separadores e procura sem descodificar corpos."""
import importlib.util
import json
from pathlib import Path
import sys
from unittest.mock import patch

sys.dont_write_bytecode = True
RAIZ = Path(__file__).resolve().parents[2]
DETECTOR = 'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py'


def ensaiar():
    spec = importlib.util.spec_from_file_location('guarda_rh1e', RAIZ / 'scripts/check-privacidade.py')
    g = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(g)
    d = g.detetor
    casos = g.plantas_formas_e()
    assert all(p['mordeu'] for p in casos), 'RH1-e: planta do portão não mordeu.'

    def provar(nome, condicao):
        assert condicao, 'RH1-e: falhou ' + nome
        casos.append({'id': nome, 'mordeu': True})

    regressoes = [
        ('nfc-nfd', 'Pessoa Ártica Sintética', 'Pessoa A\u0301rtica Sintética'),
        ('sem-ponto-virgula', 'Pessoa Sintética', 'Pessoa Sint&eacute' + 'tica'),
        ('apos', "Pessoa D'Exemplo", 'Pessoa D&apos;Exemplo'),
        ('ccaron', 'Pessoa Čartica', 'Pessoa &Ccaron;artica'),
        ('eszett', 'Pessoa Strasse', 'Pessoa Straße'),
        ('ligatura', 'Pessoa Fictícia', 'Pessoa ﬁctícia'),
    ]
    for caso, segredo, texto in regressoes:
        cadeia = (segredo.encode(),)
        corpo = texto.encode()
        provar('regressao-e-' + caso, d.contem_cadeias(corpo, cadeia))

    class Corpo(bytes):
        baixou = 0

        def decode(self, *args, **kwargs):
            raise AssertionError('RH1-e: o corpo não pode ser descodificado.')

        def lower(self):
            self.baixou += 1
            return type(self)(super().lower())

    for caso, segredo, texto in regressoes:
        cadeia = (segredo.encode(),)
        padrao = d.formas_comparaveis(cadeia)
        corpo = Corpo(texto.encode())
        with patch.object(d.html, 'unescape', side_effect=AssertionError('RH1-e: HTML do corpo.')), \
                patch.object(d.unicodedata, 'normalize', side_effect=AssertionError('RH1-e: normalização do corpo.')):
            provar('bytes-sem-descodificacao-' + caso, d.contem_cadeias(corpo, cadeia) and corpo.baixou == 1
                   and d.formas_comparaveis(cadeia) is padrao)
    with patch.object(d, 'contem_cadeias', return_value=False):
        plantas = g.plantas_formas_e()
        provar('detetor-cego-recusa-seis-regressoes', all(not p['mordeu'] for p in plantas[:24]))
    leitor = d._ler_proibidos
    def colapsar_antes(valor, ci):
        return leitor('\n'.join(' '.join(linha.split()) for linha in valor.split('\n')), ci)

    with patch.object(d, '_ler_proibidos', colapsar_antes):
        plantas = g.plantas_formas_e()
        recusas = [p for p in plantas if p['id'].startswith('e-separador-') or 'duas-entradas' in p['id']]
        provar('colapso-prematuro-recusa-oito-plantas', len(recusas) == 8 and all(not p['mordeu'] for p in recusas))
    return {'passou': all(p['mordeu'] for p in casos), 'casos': casos}


if __name__ == '__main__':
    try:
        print(json.dumps(ensaiar(), ensure_ascii=False, indent=2))
    except AssertionError as erro:
        print(str(erro), file=sys.stderr)
        raise SystemExit(1)
    except Exception:
        print('RH1-e: ensaio recusado sem publicar dados privados.', file=sys.stderr)
        raise SystemExit(1)
