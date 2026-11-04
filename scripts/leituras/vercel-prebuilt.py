#!/usr/bin/env python3
"""Conserva o dist conferido; a Vercel empacota as funções e as rotas.

Sem --trocar ou --conferir faz pull e build, com rede e conta da direção.
As duas opções locais permitem provar a cópia e todas as recusas sem rede.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile


def ler(p):
    return json.loads(p.read_text())


def exigir(condicao, motivo):
    if not condicao:
        raise ValueError(motivo)


def inventario(pasta):
    exigir(pasta.is_dir() and not pasta.is_symlink(), 'pasta estática ausente ou ligada')
    resultado = {}
    for p in sorted(pasta.rglob('*')):
        exigir(not p.is_symlink(), 'ligação simbólica nos estáticos')
        if p.is_file():
            resultado[p.relative_to(pasta).as_posix()] = hashlib.sha256(p.read_bytes()).hexdigest()
    exigir(bool(resultado), 'pasta estática vazia')
    return resultado


def regioes_funcoes(w, completar=False):
    regioes = ler(w / 'vercel.json').get('regions')
    exigir(isinstance(regioes, list) and bool(regioes)
           and all(isinstance(r, str) and bool(r.strip()) for r in regioes),
           'vercel.json sem regions válidas')
    pastas = sorted((w / '.vercel/output/functions').rglob('*.func'))
    exigir(bool(pastas), 'nenhuma função empacotada')
    configuracoes = []
    for pasta in pastas:
        vc = pasta / '.vc-config.json'
        nome = vc.relative_to(w / '.vercel/output').as_posix()
        exigir(vc.is_file(), 'falta ' + nome)
        config = ler(vc)
        exigir(('regions' not in config and completar) or config.get('regions') == regioes,
               'região da função diferente do vercel.json: ' + nome)
        configuracoes.append((vc, config))
    # Só completa ausências, depois de recusar qualquer divergência.
    for vc, config in configuracoes:
        if 'regions' not in config:
            config['regions'] = regioes
            vc.write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n')
    return regioes


def conferir_arvore(w):
    estado = subprocess.check_output(
        ['git', 'status', '--porcelain=v1', '--untracked-files=all', '--ignore-submodules=none'],
        cwd=w, text=True).strip()
    exigir(not estado, 'árvore diferente da cabeça; ficheiros alterados: ' + estado)


def conferir_regras(w):
    origem = ler(w / 'vercel.json')
    saida = w / '.vercel/output'
    config = ler(saida / 'config.json')
    exigir(config.get('version') == 3, 'Build Output API diferente da versão 3')
    # A ferramenta pode ancorar as expressões. Os restantes campos são literais.
    def normalizar(regra):
        r = dict(regra)
        if 'src' in r:
            r['src'] = r['src'].removeprefix('^').removesuffix('$')
        return r
    rotas = iter(config.get('routes', []))
    for regra in origem['routes']:
        esperado = normalizar(regra)
        exigir(any(all(normalizar(r).get(k) == v for k, v in esperado.items()) for r in rotas),
               'regra ausente ou fora de ordem: ' + json.dumps(regra, ensure_ascii=False))
    funcoes = sorted(p for p in (w / 'api').rglob('*') if p.is_file() and p.suffix in ('.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'))
    exigir([p.relative_to(w / 'api').as_posix() for p in funcoes] == ['sugestoes.js'], 'inventário das funções mudou; rever o empacotamento')
    pasta = saida / 'functions/api/sugestoes.func'
    vc = pasta / '.vc-config.json'
    exigir(vc.is_file(), 'falta functions/api/sugestoes.func/.vc-config.json')
    f = ler(vc)
    for chave in ('runtime', 'handler', 'launcherType'):
        exigir(isinstance(f.get(chave), str) and bool(f[chave]), 'falta ' + chave + ' na função')
    exigir(f['launcherType'] == 'Nodejs', 'launcherType diferente de Nodejs')
    handler = (pasta / f['handler']).resolve()
    exigir(handler.is_relative_to(pasta.resolve()) and handler.is_file(), 'handler ausente ou fora da função')
    regioes = regioes_funcoes(w)
    return {'regras': len(origem['routes']), 'funcoes': len(funcoes), 'regioes': regioes}


def conferir(w):
    prova = conferir_regras(w)
    dist = inventario(w / 'dist')
    exigir(dist == inventario(w / '.vercel/output/static'), 'sha256 ou lista de ficheiros diferente de dist')
    prova.update(ficheiros=len(dist), sha256=dist)
    return prova


def trocar(w):
    regioes_funcoes(w, completar=True)
    conferir_regras(w)
    inventario(w / 'dist')
    alvo = w / '.vercel/output/static'
    exigir(not alvo.is_symlink(), 'static não pode ser uma ligação')
    if alvo.exists():
        shutil.rmtree(alvo)
    shutil.copytree(w / 'dist', alvo, copy_function=shutil.copy2)
    return conferir(w)


def preparar(w):
    conferir_arvore(w)
    cabeca = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=w, text=True).strip()
    for nome in ('version.json', 'prova.json'):
        exigir(ler(w / 'dist' / nome).get('commit') == cabeca, 'dist não é da cabeça: ' + nome)
    antes = inventario(w / 'dist')
    (w / '.vercel').mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='at1-dist-', dir=w / '.vercel') as tmp:
        copia = Path(tmp) / 'dist'
        shutil.copytree(w / 'dist', copia, copy_function=shutil.copy2)
        try:
            subprocess.run(['vercel', 'pull', '--yes', '--environment=production'], cwd=w, check=True)
            subprocess.run(['vercel', 'build', '--prod'], cwd=w, check=True)
        finally:
            if (w / 'dist').exists():
                shutil.rmtree(w / 'dist')
            shutil.copytree(copia, w / 'dist', copy_function=shutil.copy2)
            conferir_arvore(w)
        exigir(inventario(w / 'dist') == antes, 'dist mudou durante a preparação')
    exigir(subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=w, text=True).strip() == cabeca, 'a cabeça mudou durante a preparação')
    prova = trocar(w)
    prova['cabeca'] = cabeca
    return prova


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('worktree', type=Path)
    modo = p.add_mutually_exclusive_group()
    modo.add_argument('--trocar', action='store_true')
    modo.add_argument('--conferir', action='store_true')
    a = p.parse_args()
    w = a.worktree.resolve()
    try:
        prova = conferir(w) if a.conferir else trocar(w) if a.trocar else preparar(w)
        (w / '.vercel/at1-prova.json').write_text(json.dumps(prova, ensure_ascii=False, indent=2) + '\n')
        print(json.dumps({k: v for k, v in prova.items() if k != 'sha256'}, ensure_ascii=False))
    except (ValueError, OSError, subprocess.CalledProcessError) as e:
        # Os erros de sistema podem trazer caminhos locais: o recibo exterior limpa-os.
        print('vercel-prebuilt: ' + str(e))
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
