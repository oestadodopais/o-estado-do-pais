#!/usr/bin/env python3
"""Montagem do pacote, chamada por pacote.sh depois da conferência dos números.

H2, M49: PACOTE_RETIRA filtra apenas o diff do sítio; PACOTE_MOTOR filtra o
motor inteiro (diff e ficheiros). Padrões fnmatch sobre o caminho relativo
completo, sensíveis a maiúsculas. Aspas interiores permitem espaços. As
cópias vêm dos objetos Git da cabeça, nunca da árvore de trabalho.
"""
import fnmatch
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shlex
import re
import shutil
import subprocess
import sys


def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), '-c', 'core.quotepath=off', *args])


def caminhos(repo, base, cabeca):
    # Sem renames: cada secção pertence a um só caminho, incluindo eliminações.
    return [os.fsdecode(p) for p in git(repo, 'diff', '--no-renames', '--name-only', '-z', base, cabeca).split(b'\0') if p]


def bate(caminho, padroes):
    return any(fnmatch.fnmatchcase(caminho, p) for p in padroes)


def relativo(caminho):
    p = PurePosixPath(caminho)
    if p.is_absolute() or '..' in p.parts or not p.parts:
        raise ValueError('O pacote só aceita caminhos relativos dentro da árvore.')
    return caminho


def copiar(repo, cabeca, f, destino):
    # Uma eliminação fica no diff, sem fabricar o ficheiro da cabeça.
    r = subprocess.run(['git', '-C', str(repo), 'cat-file', '-e', f'{cabeca}:{f}'], stderr=subprocess.DEVNULL)
    if r.returncode:
        return False
    alvo = destino / relativo(f)
    alvo.parent.mkdir(parents=True, exist_ok=True)
    alvo.write_bytes(git(repo, 'show', f'{cabeca}:{f}'))
    return True


def diferenca(repo, base, cabeca, f):
    # --literal-pathspecs impede que um nome real seja interpretado como glob.
    return subprocess.check_output(['git', '--literal-pathspecs', '-C', str(repo), '-c', 'core.quotepath=off',
                                    'diff', '--no-renames', base, cabeca, '--', f])


def linhas_dos_portoes(repo, cabeca, relatorio, texto, arvore):
    """Comentários portao: <registo relativo ao relatório> | <início da linha>.

    Só se retiram ANSI, espaço inicial e os marcadores ✓, ✗ e ▶ para comparar
    o início. Copiam-se as linhas originais, com os seus números no índice.
    A falta de uma citação fecha a montagem antes de criar a pasta.
    """
    registos = {f for f in arvore if Path(f).name in {'build.log', 'verify.log', 'typecheck.log'}
                and str(Path(f).with_suffix('.codigo')) in arvore}
    citadas, indice = {}, []
    for nome, prefixo in re.findall(r'<!--\s*portao:\s*([^|\n]+)\|\s*(.*?)\s*-->', texto):
        f = os.path.normpath(str(Path(relatorio).parent / nome.strip()))
        relativo(f)
        if f not in registos or not prefixo:
            raise ValueError(f'O pacote recusa a citação: registo de portão ausente ou início vazio: {f}.')
        corpo = git(repo, 'show', f'{cabeca}:{f}')
        achadas = []
        for n, linha in enumerate(corpo.decode().splitlines(), 1):
            limpa = re.sub(r'\x1b\[[0-9;]*m', '', linha).lstrip(' \t✓✗▶')
            if limpa.startswith(prefixo):
                achadas.append(n)
                citadas.setdefault(f, {})[n] = linha
        if not achadas:
            raise ValueError(f'O pacote recusa a citação: {f}: não existe uma linha que comece por «{prefixo}».')
        indice.append({'registo': f, 'inicio': prefixo, 'linhas': achadas,
                       'origem_sha256': hashlib.sha256(corpo).hexdigest()})
    filtrados = {f: ('\n'.join(linhas[n] for n in sorted(linhas)) + '\n').encode()
                 for f, linhas in citadas.items()}
    return registos, filtrados, indice


def conferir_citacoes(destino, repo, cabeca, relatorio, inteiros=False):
    """Relê a entrega e extrai as citações por uma leitura independente.

    Não recebe os bytes preparados pelo escritor: uma falha nessa preparação
    ou na escrita tem de ser apanhada pelo caminho normal da montagem.
    """
    esperadas = {}
    for linha in (destino / 'relatorio-construtor.md').read_text().splitlines():
        if '<!--' not in linha or 'portao:' not in linha:
            continue
        declaracao = linha.split('portao:', 1)[1].split('-->', 1)[0]
        nome, separador, prefixo = declaracao.partition('|')
        if not separador or not prefixo.strip():
            raise ValueError('O pacote recusa a entrega: citação de portão incompleta.')
        f = relativo(os.path.normpath(str(Path(relatorio).parent / nome.strip())))
        origem = git(repo, 'show', f'{cabeca}:{f}').decode().splitlines()
        encontradas = {}
        for numero, conteudo in enumerate(origem):
            sem_cor = re.sub(r'\x1b\[[0-9;]*m', '', conteudo)
            if sem_cor.strip().lstrip('✓✗▶').lstrip().startswith(prefixo.strip()):
                encontradas[numero] = conteudo
        if not encontradas:
            raise ValueError(f'O pacote recusa a entrega: citação sem origem em {f}.')
        esperadas.setdefault(f, {}).update(encontradas)
    for f, linhas in esperadas.items():
        corpo = ('\n'.join(linhas[n] for n in sorted(linhas)) + '\n').encode()
        if inteiros:
            corpo = git(repo, 'show', f'{cabeca}:{f}')
        alvo = destino / f
        if not alvo.is_file() or alvo.read_bytes() != corpo:
            raise ValueError(f'O pacote recusa a entrega: faltam as linhas citadas de {f}.')


def principal():
    repo, base, cabeca, destino, brief, relatorio, numeros, *construidos = sys.argv[1:]
    # Nunca substituir o argumento literal: «.» apagava todos os pontos do texto.
    repo_dado = str(Path(repo).absolute())
    repo, destino = Path(repo).resolve(), Path(destino)
    retira = shlex.split(os.environ.get('PACOTE_RETIRA', ''))
    motor = shlex.split(os.environ.get('PACOTE_MOTOR', ''))
    extra = shlex.split(os.environ.get('PACOTE_EXTRA', ''))
    modo_logs = os.environ.get('PACOTE_LOGS', '')
    if modo_logs not in ('', 'inteiros'):
        raise ValueError('PACOTE_LOGS só aceita inteiros, ou fica por definir.')
    inteiros = modo_logs == 'inteiros'
    if motor and len(motor) < 3:
        raise ValueError('PACOTE_MOTOR exige árvore, base e cabeça, seguidas dos padrões opcionais.')
    for arvore, nome in [(repo, 'repositório')] + ([(Path(motor[0]).resolve(), 'motor')] if motor else []):
        if git(arvore, 'status', '--porcelain', '--untracked-files=no').strip():
            raise ValueError(f'O pacote recusa a árvore do {nome}: há modificações em ficheiros seguidos por comitar.')
    # Confere os dois intervalos antes de criar o pacote.
    mudados = caminhos(repo, base, cabeca)
    do_motor = caminhos(motor[0], motor[1], motor[2]) if motor else []
    rel_relatorio = os.path.relpath(Path(relatorio).resolve(), repo)
    arvore = {os.fsdecode(f) for f in git(repo, 'ls-tree', '-r', '--name-only', '-z', cabeca).split(b'\0') if f}
    registos, filtrados, indice = linhas_dos_portoes(repo, cabeca, rel_relatorio,
                                                  Path(relatorio).read_text(), arvore)
    if destino.exists() and any(destino.iterdir()):
        raise ValueError('O pacote exige uma pasta nova ou vazia: não conserva registos de uma montagem anterior.')
    destino.mkdir(parents=True, exist_ok=True)
    texto_numeros = Path(numeros).read_text().replace(repo_dado, '<sitio>').replace(str(repo), '<sitio>').replace(str(Path.home()), '<pasta-local>')
    (destino / 'numeros-do-relatorio.txt').write_text(texto_numeros)
    shutil.copyfile(brief, destino / 'brief.md')
    shutil.copyfile(relatorio, destino / 'relatorio-construtor.md')
    retirados, partes, copiados = [], [], 0
    for f in mudados:
        if f == rel_relatorio or bate(f, ['*.png', '*.jpg', '*.webp']):
            continue
        if f in registos:
            continue
        trecho = diferenca(repo, base, cabeca, f)
        if bate(f, retira):
            retirados.append((f, len(trecho.splitlines())))
        else:
            partes.append(trecho)
        copiados += copiar(repo, cabeca, f, destino)
    (destino / 'diff.patch').write_bytes(b''.join(partes))
    if retira:
        tabela = ['# Retirado do diff do pacote', '',
                  'Padrões de PACOTE_RETIRA: ' + ', '.join(f'`{p}`' for p in retira) + '.', '',
                  'Só saem do diff. Os ficheiros existentes na cabeça ficam inteiros nos seus caminhos; as eliminações não têm cópia.', '',
                  '| caminho | linhas retiradas do diff |', '|---|---|']
        tabela += [f'| `{f.replace("|", "&#124;")}` | {n} |' for f, n in retirados]
        (destino / 'RETIRADO-DO-PACOTE.md').write_text('\n'.join(tabela)+'\n')
    n_extra = 0
    for e in extra:
        for f in git(repo, 'ls-tree', '-r', '--name-only', '-z', cabeca, '--', relativo(e)).split(b'\0'):
            if f:
                nome = os.fsdecode(f)
                if nome not in registos:
                    n_extra += copiar(repo, cabeca, nome, destino)
    extras = {os.fsdecode(f) for e in extra for f in git(repo, 'ls-tree', '-r', '--name-only', '-z', cabeca, '--', relativo(e)).split(b'\0') if f}
    selecionados = registos & (set(mudados) | set(filtrados) | extras)
    # Os códigos e os tempos acompanham sempre os registos do intervalo ou
    # citados. PACOTE_EXTRA passa pela mesma escolha explícita de registos inteiros.
    pastas = {str(Path(f).parent) for f in selecionados}
    for pasta in pastas:
        for f in sorted(arvore):
            if str(Path(f).parent) == pasta and (f.endswith('.codigo') or Path(f).name == 'tempos.json'):
                copiar(repo, cabeca, f, destino)
    omitidos = []
    for f in sorted(selecionados):
        original = git(repo, 'show', f'{cabeca}:{f}')
        corpo = original if inteiros else filtrados.get(f, b'')
        if corpo:
            alvo = destino / f
            alvo.parent.mkdir(parents=True, exist_ok=True)
            alvo.write_bytes(corpo)
        if corpo != original:
            omitidos.append({'registo': f, 'bytes_originais': len(original),
                             'bytes_conservados': len(corpo), 'bytes_retirados': len(original) - len(corpo)})
            print(f'Pacote: registo reduzido ou deixado de fora: {f} ({len(original)} bytes; {len(corpo)} conservados).')
    (destino / 'registos-dos-portoes.json').write_text(json.dumps(
        {'modo': 'inteiros' if inteiros else 'citados', 'omitidos': omitidos}, ensure_ascii=False, indent=2) + '\n')
    (destino / 'linhas-dos-portoes.json').write_text(json.dumps(indice, ensure_ascii=False, indent=2)+'\n')
    n_motor = 0
    if motor:
        pasta = destino / 'motor'
        pasta.mkdir(parents=True, exist_ok=True)
        excluidos = motor[3:]
        linha = '# Motor: diff sem os caminhos que casam com ' + (', '.join(excluidos) if excluidos else '(nenhum padrão)') + '.\n'
        partes_motor = [linha.encode()]
        for f in do_motor:
            if bate(f, excluidos):
                continue
            partes_motor.append(diferenca(motor[0], motor[1], motor[2], f))
            n_motor += copiar(motor[0], motor[2], f, pasta)
        (pasta / 'diff.patch').write_bytes(b''.join(partes_motor))
    for f in construidos:
        alvo = destino / 'built' / relativo(f)
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(repo / 'dist' / f, alvo)
    conferir_citacoes(destino, repo, cabeca, rel_relatorio, inteiros)
    print(f'Pacote: {copiados} ficheiros mudados, {n_extra} extra, {len(retirados)} secções retiradas, {n_motor} ficheiros do motor, {len(construidos)} páginas construídas.')


if __name__ == '__main__':
    principal()
