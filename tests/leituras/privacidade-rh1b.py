#!/usr/bin/env python3
"""RH1-b: a proteção antiga vive na privacidade, com plantas só sintéticas."""
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


def ensaiar():
    spec = importlib.util.spec_from_file_location('guarda_rh1b', RAIZ / 'scripts/check-privacidade.py')
    g = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(g)
    casos = g.plantas_transferidas()
    assert all(p['mordeu'] for p in casos), 'RH1-b: planta transferida não mordeu.'
    inteiro = 'Pessoa ' + 'Sintética ' + 'Exemplo'
    curto = inteiro.split()[0] + ' ' + inteiro.split()[-1]
    def provar(nome, condicao):
        assert condicao, 'RH1-b: falhou ' + nome
        casos.append({'id': nome, 'mordeu': True})
    with patch.object(g.detetor, 'tem_caminho', return_value=False):
        provar('detetor-cego-recusa-as-plantas', not all(p['mordeu'] for p in g.plantas_transferidas()))
    with tempfile.TemporaryDirectory(prefix='oedp-rh1b-') as tmp:
        raiz = Path(tmp)
        ambiente_git = {k: v for k, v in os.environ.items() if not k.startswith('GIT_')}
        def git(*args):
            r = subprocess.run(['git', *args], cwd=raiz, env=ambiente_git, capture_output=True)
            assert r.returncode == 0, 'RH1-b: operação do Git sintético recusada.'
            return r.stdout
        git('init', '-q')
        for nome in ('public/incorporar.js', 'site.config.mjs'):
            p = raiz / nome
            p.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(RAIZ / nome, p)
        for nome, corpo in [('dist/index.html', b'<html><body>Ensaio.</body></html>'),
                            ('api/ensaio.js', b'const chave = "sb_' + b'publishable_00000000";'),
                            ('src/views/Ensaio.astro', b'---\nconst texto = "Ensaio";\n---\n<p>Ensaio</p>')]:
            p = raiz / nome
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(corpo)
        shutil.copyfile(raiz / 'public/incorporar.js', raiz / 'dist/incorporar.js')
        for p in raiz.rglob('*'):
            if p.is_file() and '.git' not in p.parts:
                git('update-index', '--add', '--', p.relative_to(raiz).as_posix())
        with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': inteiro}), \
                patch.object(g, 'RAIZ', raiz), \
                patch.object(g.detetor, 'nomes_dos_autores', return_value=()), \
                patch.object(g.detetor.Path, 'home', return_value=Path('/') / 'home' / 'runner'):
            provar('repositorio-limpo', g.medir(raiz / 'dist', True)['passou'])
            for nome, corpo, campo in [
                ('dist/estudos/ensaio/documento/index.html', '<html><body><p>for ' + curto + '</p></body></html>', 'dist'),
                ('dist/en/studies/ensaio/document/index.html', '<html><body><p>for ' + curto.upper() + '</p></body></html>', 'dist'),
                ('dist/sobre/index.html', '<html><body><!-- ' + inteiro + ' --></body></html>', 'dist'),
                ('dist/metodo/index.html', '<html><body><strong>' + inteiro + '</strong></body></html>', 'dist'),
                ('src/views/Ensaio.astro', 'const nome = "' + inteiro + '";', 'rastreado'),
            ]:
                p = raiz / nome
                original = p.read_bytes() if p.exists() else None
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(corpo, encoding='utf-8')
                r = g.medir(raiz / 'dist', True)
                quantidade = r['quantidade'] if campo == 'dist' else r['rastreado']['quantidade']
                provar('corrida-' + nome, not r['passou'] and quantidade == 1)
                provar('json-sem-cadeias-' + nome, all(c.casefold() not in g.json_seguro(r).casefold() for c in (inteiro, curto)))
                if original is None:
                    p.unlink()
                else:
                    p.write_bytes(original)
            provar('reposicao-limpa', g.medir(raiz / 'dist', True)['passou'])
        with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': ''}, clear=True), \
                patch.object(g.detetor, 'nomes_dos_autores', return_value=(inteiro.encode(),)), \
                patch.object(g.detetor.Path, 'home', return_value=Path('/') / 'home' / 'runner'):
            provar('forma-abreviada-do-git', g.detetor.tem_caminho(('for ' + curto).encode()))
        with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': inteiro}, clear=True), \
                patch.object(g.detetor, 'nomes_dos_autores', return_value=()):
            try:
                g.json_seguro({'ficheiro': curto + '.txt'})
            except ValueError as erro:
                provar('saida-recusa-forma-abreviada', curto not in str(erro))
            else:
                provar('saida-recusa-forma-abreviada', False)
    oraculo = json.loads((RAIZ / 'scripts/textos-aprovados.json').read_text())
    provar('oraculo-sem-campos-pessoais', 'responsavel' not in oraculo and 'lingua_do_responsavel' not in oraculo)
    alvo = 'design/especime-v3/medicoes/ensaio-rh1b/portoes/alvos.json'
    r = subprocess.run(['git', 'check-ignore', '--no-index', '-q', alvo], cwd=RAIZ, capture_output=True)
    provar('alvos-ignorados', r.returncode == 0)
    r = subprocess.run(['git', 'check-ignore', '--no-index', '-q', 'public/alvos.json'], cwd=RAIZ, capture_output=True)
    provar('regra-dos-alvos-limitada-as-medicoes', r.returncode == 1)
    return {'passou': all(c['mordeu'] for c in casos), 'casos': casos}


if __name__ == '__main__':
    try:
        print(json.dumps(ensaiar(), ensure_ascii=False, indent=2))
    except AssertionError as erro:
        print(str(erro), file=sys.stderr)
        raise SystemExit(1)
    except Exception:
        print('RH1-b: ensaio recusado sem publicar dados.', file=sys.stderr)
        raise SystemExit(1)
