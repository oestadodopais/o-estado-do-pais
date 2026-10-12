#!/usr/bin/env python3
"""JD1-b: limpeza de raízes e recusa da estrutura local em todo o ramo."""
import gzip
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile

RAIZ = Path(__file__).resolve().parents[2]

def modulo(nome, caminho):
    spec = importlib.util.spec_from_file_location(nome, RAIZ / caminho)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m

limpar = modulo('limpar_jd1', 'scripts/leituras/limpar-caminhos.py')
guarda = modulo('privacidade_jd1', 'scripts/check-privacidade.py')
projetos = 'Instruments' + '/'
arvores = '.claude' + '/worktrees/'
casos = []
with tempfile.TemporaryDirectory(prefix='oedp-jd1-privacidade-') as tmp:
    pasta = Path(tmp)
    subprocess.run(['git', 'init', '-q', str(pasta)], check=True)
    for i, marca in enumerate(guarda.ESTRUTURA_LOCAL):
        nome = f'plantada-{i}.log'
        (pasta / nome).write_bytes(marca)
        subprocess.run(['git', '-C', str(pasta), 'add', '--', nome], check=True)
    (pasta / 'comprimida.log.gz').write_bytes(gzip.compress((projetos + 'OEstadoDoPais/' + arvores + 'ensaio/dist').encode()))
    subprocess.run(['git', '-C', str(pasta), 'add', '--', 'comprimida.log.gz'], check=True)
    r = guarda.medir_rastreados(pasta, True)
    assert not r['passou'] and r['quantidade'] == 3 and all(p['mordeu'] for p in r['plantas']), r
    casos.append('A guarda lê a lista real do Git e recusa ambos os fragmentos, incluindo gzip.')
    (pasta / 'nao-rastreado.log').write_text(projetos)
    (pasta / 'codigo.py').write_text("pasta = '$HOME/" + projetos + "ResearchHub'\n")
    subprocess.run(['git', '-C', str(pasta), 'add', '--', 'codigo.py'], check=True)
    r = limpar.limpar(pasta, pasta, rastreado=True)
    assert len(r['mudados']) == 3
    assert (pasta / 'codigo.py').read_text() == "pasta = '$HOME/" + projetos + "ResearchHub'\n"
    assert (pasta / 'nao-rastreado.log').read_text() == projetos
    assert guarda.medir_rastreados(pasta, True)['passou']
    assert limpar.limpar(pasta, pasta, rastreado=True)['mudados'] == []
    assert gzip.decompress((pasta / 'comprimida.log.gz').read_bytes()) == b'<worktree>/dist'
    casos.append('A limpeza rastreada só altera a lista do Git; guarda verde, gzip legível e segunda passagem sem mudanças.')
    raiz = pasta / 'sitio'
    arvore = raiz / '.claude' / 'worktrees' / 'ramo'
    trocas = limpar.caminhos_a_trocar(arvore, None, None, None, None)
    assert limpar.substituir_texto(str(arvore) + '/dist ' + str(raiz) + '/src', trocas, '') == '<worktree>/dist <sitio>/src'
    casos.append('A worktree e a pasta principal do sítio têm marcas distintas, sem raiz local.')
    for prefixo in ('~/', '<casa>/', '/Users/CONTA-DE-ENSAIO/', '$HOME/'):
        origem = prefixo + projetos + 'OEstadoDoPais/' + arvores + 'ramo/dist'
        assert limpar.retirar_estrutura(origem) == '<worktree>/dist', origem
        assert limpar.retirar_estrutura(prefixo + projetos + 'ResearchHub/content') == '<motor>/content'
    casos.append('As raízes históricas, também mascaradas, desaparecem sem perder caminhos dentro do repositório.')
print(json.dumps({'passou': True, 'casos': casos}, ensure_ascii=False, indent=2))
