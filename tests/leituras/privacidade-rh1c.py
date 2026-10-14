#!/usr/bin/env python3
"""RH1-c: formatos, normalização e mutações, apenas com cadeias sintéticas."""
import importlib.util
import inspect
import json
import os
from pathlib import Path
import subprocess
import sys
from unittest.mock import patch

sys.dont_write_bytecode = True
RAIZ = Path(__file__).resolve().parents[2]


def ensaiar():
    spec = importlib.util.spec_from_file_location('guarda_rh1c', RAIZ / 'scripts/check-privacidade.py')
    g = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(g)
    d = g.detetor
    casos = g.plantas_pessoais()
    assert all(p['mordeu'] for p in casos), 'RH1-c: planta do portão não mordeu.'

    def provar(nome, condicao):
        assert condicao, 'RH1-c: falhou ' + nome
        casos.append({'id': nome, 'mordeu': True})

    for i, marca in enumerate(('\x00', '\u200b'), 1):
        valor = 'Pessoa Sintética Um\nPessoa' + marca + ' Sintética Dois'
        ambiente = dict(os.environ, CI='true', PRIVACIDADE_PROIBIDOS=valor,
                        PYTHONDONTWRITEBYTECODE='1')
        # O sistema não admite NUL no ambiente. Esse caso percorre o mesmo leitor.
        if marca == '\x00':
            try:
                d._ler_proibidos(valor, True)
            except ValueError as erro:
                provar(f'interior-{i}', 'linha 2' in str(erro) and 'Pessoa' not in str(erro))
            else:
                provar(f'interior-{i}', False)
        else:
            r = subprocess.run([sys.executable, 'scripts/check-privacidade.py', '--prova'],
                               cwd=RAIZ, env=ambiente, capture_output=True)
            provar(f'interior-{i}-recusa-corrida', r.returncode == 1 and not r.stdout
                   and b'linha 2' in r.stderr and b'Pessoa' not in r.stderr)
    provar('linhas-crlf', d._ler_proibidos('Pessoa Sintética Um\r\nPessoa Sintética Dois\r\n', True)
           == ('Pessoa Sintética Um'.encode(), 'Pessoa Sintética Dois'.encode()))
    try:
        d._ler_proibidos('ae\u0301b', True)
    except ValueError:
        provar('minimo-depois-de-nfc', True)
    else:
        provar('minimo-depois-de-nfc', False)
    cadeia = 'Pessoa Sintética Exemplo'.encode()
    provar('controlo-inocuo', not d.contem_cadeias(b'<p>Texto publico.</p>', (cadeia,)))
    with patch.object(d.html, 'unescape', side_effect=AssertionError('Descodificação desnecessária.')):
        provar('sem-entidades-nao-descodifica', not d.contem_cadeias(b'Texto publico.', (cadeia,)))

    fonte = inspect.getsource(g.recusar_rastreado)
    assert fonte.count(' or ') == 1, 'RH1-c: a linha de decisão mudou.'
    espaco = dict(vars(g))
    exec(compile(fonte.replace(' or ', ' and '), '<mutacao-sintetica>', 'exec'), espaco)
    with patch.object(g, 'recusar_rastreado', espaco['recusar_rastreado']):
        plantas = g.plantas_pessoais()
        provar('mutacao-or-and-recusa-no-portao', not all(p['mordeu'] for p in plantas))
        provar('mutacao-isola-cadeia', not next(p['mordeu'] for p in plantas if p['id'] == 'ramo-pessoal-texto'))
        provar('mutacao-isola-estrutura', not next(p['mordeu'] for p in plantas if p['id'] == 'ramo-pessoal-decisao-estrutura'))
    with patch.object(d, '_ler_proibidos', return_value=(b'identidade-publica',)):
        provar('mutacao-identidades-no-segredo', not all(p['mordeu'] for p in g.plantas_identidades()))
    # Simula a retirada da exclusão, conservando a leitura do Git simulada pela planta.
    with patch.object(d, '_nomes_dos_autores', side_effect=lambda: (d.git('log').encode(),)):
        provar('mutacao-identidades-nos-autores', not all(p['mordeu'] for p in g.plantas_identidades()))
    return {'passou': all(p['mordeu'] for p in casos), 'casos': casos}


if __name__ == '__main__':
    try:
        print(json.dumps(ensaiar(), ensure_ascii=False, indent=2))
    except AssertionError as erro:
        print(str(erro), file=sys.stderr)
        raise SystemExit(1)
    except Exception:
        print('RH1-c: ensaio recusado sem publicar dados.', file=sys.stderr)
        raise SystemExit(1)
