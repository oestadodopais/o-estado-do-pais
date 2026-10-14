#!/usr/bin/env python3
"""RH1: plantas sintéticas, isoladas do ficheiro privado da máquina."""
import gzip
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from unittest.mock import patch

sys.dont_write_bytecode = True
RAIZ = Path(__file__).resolve().parents[2]
DETE = 'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py'
CADEIAS = ('pessoa-sintetica-um', 'Sintética Exemplo')


def ensaiar():
    casos = []
    def provar(nome, condicao):
        if not condicao:
            raise AssertionError('RH1: falhou a planta ' + nome)
        casos.append({'id': nome, 'mordeu': True})

    with tempfile.TemporaryDirectory(prefix='oedp-rh1-') as tmp:
        pasta = Path(tmp)
        ambiente = {k: v for k, v in os.environ.items()
                    if k not in ('PRIVACIDADE_PROIBIDOS', 'CI', 'GITHUB_ACTIONS')
                    and not k.startswith(('GIT_', 'OEDP_'))}
        ambiente.update(GITHUB_ACTIONS='true', PYTHONDONTWRITEBYTECODE='1',
                        GIT_AUTHOR_NAME='O Estado do País', GIT_COMMITTER_NAME='O Estado do País',
                        GIT_AUTHOR_EMAIL='correcoes@oestadodopais.pt', GIT_COMMITTER_EMAIL='correcoes@oestadodopais.pt')
        def git(*args, entrada=None):
            r = subprocess.run(['git', *args], cwd=pasta, env=ambiente,
                               input=entrada, capture_output=True)
            if r.returncode:
                raise AssertionError('RH1: operação do Git sintético recusada')
            return r.stdout.strip()
        git('init', '-q')
        for nome in ('scripts/check-privacidade.py', DETE, 'public/incorporar.js', 'site.config.mjs'):
            destino = pasta / nome
            destino.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(RAIZ / nome, destino)
            git('update-index', '--add', '--', nome)
        for nome, corpo in [('api/ensaio.js', b'const chave = "sb_' + b'publishable_00000000";'),
                            ('dist/index.html', b'<html><body>Pagina de ensaio.</body></html>')]:
            destino = pasta / nome
            destino.parent.mkdir(parents=True, exist_ok=True)
            destino.write_bytes(corpo)
            git('update-index', '--add', '--', nome)
        shutil.copyfile(pasta / 'public/incorporar.js', pasta / 'dist/incorporar.js')
        git('update-index', '--add', '--', 'dist/incorporar.js')
        arvore = git('write-tree').decode()
        cabeca = git('commit-tree', arvore, '-m', 'Ensaio sintético RH1')
        git('update-ref', 'HEAD', cabeca.decode())
        spec = importlib.util.spec_from_file_location('guarda_rh1', pasta / 'scripts/check-privacidade.py')
        guarda = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(guarda)
        d = guarda.detetor
        segredo = '\n \n ' + CADEIAS[0] + ' \n' + CADEIAS[1] + '\n'
        destino_json = pasta / 'saida.json'
        def correr(valor=None, ci='GITHUB_ACTIONS'):
            env = dict(ambiente)
            env.pop('GITHUB_ACTIONS', None)
            env[ci] = 'true'
            if valor is not None:
                env['PRIVACIDADE_PROIBIDOS'] = valor
            destino_json.unlink(missing_ok=True)
            return subprocess.run([sys.executable, 'scripts/check-privacidade.py', '--prova',
                                   '--json', str(destino_json)], cwd=pasta, env=env,
                                  capture_output=True)
        for ci in ('GITHUB_ACTIONS', 'CI'):
            for rotulo, valor in [('ausente', None), ('vazio', ' \n\t')]:
                r = correr(valor, ci)
                provar(ci + '-' + rotulo, r.returncode == 1 and b'PRIVACIDADE_PROIBIDOS' in r.stderr
                       and not r.stdout and not destino_json.exists())
        for i, valor in enumerate(sorted(d.IDENTIDADES_DO_PROJETO) + ['abc']):
            r = correr('\n' + valor.upper())
            provar('segredo-invalido-' + str(i), r.returncode == 1 and b'linha 2' in r.stderr
                   and valor.casefold().encode() not in r.stderr.lower() and not destino_json.exists())
        r = correr(segredo)
        provar('repositorio-limpo-e-json', r.returncode == 0 and destino_json.is_file()
               and json.loads(r.stdout)['passou']
               and all(c.casefold() not in r.stdout.decode().casefold() for c in CADEIAS)
               and destino_json.read_bytes() == r.stdout)
        base = json.loads(r.stdout)
        provar('plantas-dist-api-rastreado', all(p['mordeu'] for p in base['plantas'] + base['api']['plantas'] + base['rastreado']['plantas']))
        with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': segredo}, clear=True):
            provar('linhas-limpas', d.ler_proibidos() == tuple(c.encode() for c in CADEIAS))
            provar('git-reescrito-sem-base', d.nomes_dos_autores() == ())
            with patch.object(d, 'git', side_effect=lambda *a: '\n'.join(sorted(d.IDENTIDADES_DO_PROJETO) + ['codex', 'claude', 'bot', 'openai']) if a[0] == 'log' else ''):
                d.nomes_dos_autores.cache_clear()
                provar('autores-do-projeto-excluidos', d.nomes_dos_autores() == ())
            d.nomes_dos_autores.cache_clear()
            with patch.object(d.Path, 'home', return_value=Path('/') / 'home' / 'runner'):
                provar('positivo-do-segredo', d.positivos_de_nome() == (CADEIAS[0].encode(),))
            with patch.object(d, 'nomes_dos_autores', return_value=(b'Autor Sintetico',)):
                provar('positivo-do-autor-conservado', d.positivos_de_nome() == (b'Autor Sintetico',)
                       and guarda.tem_cadeia_pessoal('ensaio.txt', b'AUTOR SINTETICO', d.cadeias_pessoais()))
            for caso, nome, corpo in [
                ('texto', 'ensaio.txt', CADEIAS[0].encode()),
                ('gzip', 'ensaio.log.gz', gzip.compress(CADEIAS[0].encode())),
                ('nome', CADEIAS[0] + '.txt', b'inocuo'),
                ('caixa', 'ensaio.txt', CADEIAS[1].upper().encode()),
                ('binario', 'ensaio.pdf', b'%PDF\x00\xff' + CADEIAS[0].encode() + b'\x00'),
            ]:
                (pasta / nome).write_bytes(corpo)
                git('update-index', '--add', '--', nome)
                resultado = guarda.medir_rastreados(pasta, True)
                provar('rastreado-' + caso, not resultado['passou'] and resultado['achados'] == [nome])
                r = correr(segredo)
                provar('saida-' + caso, r.returncode == 1 and all(c.casefold() not in (r.stdout + r.stderr).decode().casefold() for c in CADEIAS))
                if caso == 'nome':
                    provar('json-recusado-antes-da-escrita', not destino_json.exists() and not r.stdout and b'1 cadeia(s)' in r.stderr)
                git('update-index', '--force-remove', '--', nome)
                (pasta / nome).unlink()
            for superficie in ('dist/index.html', 'api/ensaio.js'):
                p = pasta / superficie
                original = p.read_bytes()
                p.write_bytes(original + CADEIAS[1].upper().encode())
                r = correr(segredo)
                provar('segredo-em-' + superficie.split('/')[0], r.returncode == 1 and not json.loads(r.stdout)['passou'])
                p.write_bytes(original)
            nomes = '\n'.join(sorted(d.IDENTIDADES_DO_PROJETO)).encode()
            (pasta / 'identidades.txt').write_bytes(nomes)
            git('update-index', '--add', '--', 'identidades.txt')
            provar('identidades-publicas-passam', guarda.medir_rastreados(pasta, True)['passou'])
        with patch.dict(os.environ, {}, clear=True):
            with patch.object(d.Path, 'home', return_value=Path('/') / 'home' / 'runner'):
                provar('sem-fontes-recusa-dist-api', not guarda.medir(pasta / 'dist', True)['passou']
                       and not guarda.medir_api(pasta, True)['passou'])
            with patch.object(d.Path, 'home', return_value=Path('/') / 'home' / 'conta-sintetica'):
                provar('positivo-da-casa', d.positivos_de_nome() == (b'conta-sintetica',)
                       and guarda.tem_cadeia_pessoal('ensaio.txt', b'CONTA-SINTETICA', d.cadeias_pessoais()))
        with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': 'usr/bin/env'}, clear=True):
            provar('segredo-antes-das-excecoes-de-caminhos', d.tem_caminho(b'#!/usr/bin/env python3'))
        # O carregador é ensaiado por substituição das leituras, sem abrir $HOME.
        with patch.dict(os.environ, {}, clear=True), patch.object(Path, 'is_file', return_value=True), patch.object(Path, 'read_text', return_value=segredo) as leitura:
            d.carregar_proibidos_locais()
            provar('carregamento-local', os.environ['PRIVACIDADE_PROIBIDOS'] == segredo and leitura.call_count == 1)
            d.carregar_proibidos_locais()
            provar('ambiente-prevalece', leitura.call_count == 1)
        with patch.dict(os.environ, {'CI': 'true'}, clear=True), patch.object(Path, 'read_text') as leitura:
            d.carregar_proibidos_locais()
            provar('ci-nao-le-casa', not leitura.called)
        return {'passou': True, 'cadeias_sinteticas_lidas': len(CADEIAS),
                'ficheiros_sinteticos_conferidos': base['rastreado']['ficheiros'], 'plantas': casos}


if __name__ == '__main__':
    try:
        print(json.dumps(ensaiar(), ensure_ascii=False, indent=2))
    except AssertionError as erro:
        print(str(erro), file=sys.stderr)
        raise SystemExit(1)
    except Exception:
        # Um traceback mostraria a raiz temporária; a falha nunca publica dados.
        print('RH1: uma planta sintética falhou.', file=sys.stderr)
        raise SystemExit(1)
