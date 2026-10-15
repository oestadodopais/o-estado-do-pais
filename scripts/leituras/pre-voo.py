#!/usr/bin/env python3
"""Confere as condições de arranque antes de lançar o construtor.

Uso: pre-voo.sh <worktree do sítio> <worktree do motor>.
OEDP_RELATORIO e OEDP_LANCADOR_BASE permitem conferir os destinos antes de
existirem. Sem eles, procura os ficheiros do lançador nas pastas de relatórios.
Não copia caches nem resolve uma árvore suja ou uma tranca ocupada.
"""
import os
from pathlib import Path
import sys
from arvores import antepassado, higienizar, limpa, principal, raiz


def conferir(sitio, motor):
    resultados = []

    def linha(nome, passou, detalhe=''):
        resultados.append(passou)
        print(higienizar(f'{0 if passou else 9} {nome}' + (': ' + detalhe if detalhe else ''), sitio, motor))

    for nome, repo, ramo in (('sítio', sitio, 'main'), ('motor', motor, 'master')):
        try:
            raiz(repo)
            linha(nome + ' sem modificações seguidas', limpa(repo))
            linha(ramo + ' antepassado da cabeça', antepassado(repo, ramo))
        except (OSError, ValueError) as erro:
            linha(nome, False, str(erro))
    linha('node_modules na worktree', (sitio / 'node_modules').is_dir() and not (sitio / 'node_modules').is_symlink())
    try:
        origem = principal(motor, 'master')
        caches = sorted(origem.rglob('snippets.json'))
        linha('lista das caches da árvore principal', True, f'{len(caches)} ficheiros')
        for cache in caches:
            relativo = cache.relative_to(origem)
            linha('cache ' + relativo.as_posix(), (motor / relativo).is_file())
    except (OSError, ValueError) as erro:
        linha('caches do motor', False, str(erro))
    linha('RESEARCHHUB_LOCK_DIR', True, 'definido' if os.environ.get('RESEARCHHUB_LOCK_DIR') else 'vai ser definido pelo lançador antes do arranque')
    relatorio = os.environ.get('OEDP_RELATORIO')
    base = os.environ.get('OEDP_LANCADOR_BASE')
    if base and relatorio:
        pasta = Path(relatorio).resolve().parent
        for sufixo in ('.escrivao.log', '.pontos.json'):
            destino = Path(base + sufixo).resolve()
            linha('ficheiro do lançador ' + sufixo, pasta not in destino.parents and destino != pasta,
                  'fora da pasta do relatório' if pasta not in destino.parents else 'dentro da pasta do relatório')
    elif base:
        linha('destino do relatório', False, 'OEDP_LANCADOR_BASE sem OEDP_RELATORIO')
    pastas = {sitio / 'design' / 'especime-v3' / 'medicoes'}
    if relatorio:
        pastas.add(Path(relatorio).resolve().parent)
    intrusos = set()
    for pasta in pastas:
        if pasta.exists():
            for padrao in ('*.escrivao.log', '*.pontos.json'):
                intrusos.update(pasta.rglob(padrao))
    linha('ficheiros do lançador fora das pastas de relatórios', not intrusos,
          ', '.join(sorted(str(p) for p in intrusos)))
    tranca = Path(os.environ.get('OEDP_TRANCA', '/tmp/oedp-construcao.lock'))
    try:
        dono = tranca.read_text().strip()
        linha('tranca da máquina', False, 'ocupada por ' + dono)
    except FileNotFoundError:
        linha('tranca da máquina', True, 'livre')
    except OSError:
        linha('tranca da máquina', False, 'não foi possível ler o dono')
    return 0 if all(resultados) else 9


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('uso: pre-voo.sh <worktree do sítio> <worktree do motor>')
    sys.exit(conferir(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()))
