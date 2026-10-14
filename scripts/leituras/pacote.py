#!/usr/bin/env python3
"""Montagem do pacote, chamada por pacote.sh depois da conferência dos números.

H2, M49: PACOTE_RETIRA filtra apenas o diff do sítio; PACOTE_MOTOR filtra o
motor inteiro (diff e ficheiros). Padrões fnmatch sobre o caminho relativo
completo, sensíveis a maiúsculas. Aspas interiores permitem espaços. As
cópias vêm dos objetos Git da cabeça, nunca da árvore de trabalho.
Qualquer build.log, verify.log ou typecheck.log com um .codigo ao lado é um
registo de portão. Por omissão só chegam as linhas citadas no relatório,
com os códigos e tempos; cada redução é dita com os tamanhos. PACOTE_LOGS=inteiros
conserva os registos completos. A entrega relê as citações independentemente.

M83 (14.10.2026, §1.192): OS CORPOS ALOJADOS VÃO NO PACOTE PELO GUIÃO, NUNCA DE MEMÓRIA. A leitura
curta da V2-a-b (13.10.2026) não pôde conferir as palavras das frases contra as fontes porque o pacote
não trazia os documentos do motor; a regra existia desde 12.10 (M65) mas vivia nos guiões de cada sessão.
Agora cada linha mudada em ledger/claims/ que declare `document.source_sha256` exige, na cabeça do motor
dada por PACOTE_MOTOR, o documento com esse resumo: resolve-se pelos recibos do sítio
(ledger/provas/*/provas.json) e pelas fontes do estudo que a nota da linha declara (content/<estudo>/source/,
mais PACOTE_ESTUDOS="<pasta> <pasta>" para estudos sem nota), copia-se para motor/<caminho> com o recibo do
pedido (<caminho>.pedido.json) e a pasta direitos/ ao lado, confere-se byte a byte pelo sha256 depois de
escrito, e escreve-se motor/CORPOS-ALOJADOS.md e motor/corpos-alojados.json. Sem um corpo, a montagem recusa
antes de criar a pasta; só PACOTE_SEM_CORPOS="<a razão, vinte caracteres ou mais>" a deixa passar, e a razão
fica escrita em SEM-CORPOS-ALOJADOS.md, que o leitor lê como Blocking. As páginas construídas das linhas
mudadas (livro-razao/<id>/ e en/ledger/<id>/) entram sozinhas quando dist/ as tiver; as que faltarem ficam
ditas no manifesto, com a versão que dist/version.json declara.
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


SHA_DA_LINHA = re.compile(r'^\s*source_sha256:\s*"([0-9a-f]{64})"', re.M)
ESTUDO_DA_NOTA = re.compile(r'Cruzado de ResearchHub (content/[^·"\n]+?)\s*·')


def sha256_de(dados):
    return hashlib.sha256(dados).hexdigest()


def linhas_com_corpos(repo, cabeca, mudados):
    """As linhas do livro-razão mudadas no intervalo e presentes na cabeça: {id: (sha256 do documento ou None, estudo da nota ou None)}."""
    linhas = {}
    for f in mudados:
        if not (f.startswith('ledger/claims/') and f.endswith('.yml')):
            continue
        if subprocess.run(['git', '-C', str(repo), 'cat-file', '-e', f'{cabeca}:{f}'], stderr=subprocess.DEVNULL).returncode:
            continue  # uma eliminação não tem corpo a levar
        texto = git(repo, 'show', f'{cabeca}:{f}').decode('utf-8', 'replace')
        sha, estudo = SHA_DA_LINHA.search(texto), ESTUDO_DA_NOTA.search(texto)
        linhas[Path(f).stem] = (sha.group(1) if sha else None, estudo.group(1).strip() if estudo else None)
    return linhas


def indice_dos_corpos(repo, cabeca, motor, cabeca_motor, estudos, precisos):
    """sha256 -> caminho no motor, para os resumos precisos: primeiro pelos recibos do sítio, depois pelas fontes dos
    estudos (content/<estudo>/source/**), cada candidato conferido pelo sha256 dos bytes na cabeça do motor."""
    indice, precisos = {}, set(precisos)

    def confirmar(caminho):
        r = subprocess.run(['git', '-C', str(motor), '-c', 'core.quotepath=off', 'show', f'{cabeca_motor}:{caminho}'], capture_output=True)
        if r.returncode == 0:
            s = sha256_de(r.stdout)
            if s in precisos and s not in indice:
                indice[s] = caminho

    def arvore(repositorio, cab, pasta):
        return [os.fsdecode(p) for p in git(repositorio, 'ls-tree', '-r', '--name-only', '-z', cab, '--', pasta).split(b'\0') if p]

    for f in arvore(repo, cabeca, 'ledger/provas'):
        if not f.endswith('provas.json'):
            continue
        try:
            provas = json.loads(git(repo, 'show', f'{cabeca}:{f}'))
        except ValueError:
            continue
        for linha in (provas.get('rows') or {}).values():
            if isinstance(linha, dict) and linha.get('sha256') in precisos and linha['sha256'] not in indice and linha.get('motor_path'):
                confirmar(linha['motor_path'])
    for estudo in sorted(e for e in estudos if e):
        for nome in arvore(motor, cabeca_motor, f'{estudo}/source'):
            if precisos <= set(indice):
                break
            if nome.endswith('.pedido.json') or '/direitos/' in nome:
                continue
            confirmar(nome)
    return indice


def levar_corpos(repo, cabeca, motor, linhas, estudos_extra, razao_sem_corpos):
    """Decide, antes de criar a pasta, que corpos alojados o pacote leva e quais faltam; a falta sem razão recusa."""
    precisos = {sha for sha, _ in linhas.values() if sha}
    estudos = {estudo for sha, estudo in linhas.values() if sha} | set(estudos_extra)
    indice = indice_dos_corpos(repo, cabeca, Path(motor[0]).resolve(), motor[2], estudos, precisos) if (motor and precisos) else {}
    registo, em_falta = [], []
    for ident, (sha, estudo) in sorted(linhas.items()):
        if not sha:
            registo.append({'linha': ident, 'sha256': None, 'caminho': None, 'estado': 'sem documento alojado (linha derivada ou sem source_sha256)'})
        elif sha in indice:
            registo.append({'linha': ident, 'sha256': sha, 'caminho': indice[sha], 'estado': 'copiado'})
        else:
            em_falta.append((ident, sha))
            registo.append({'linha': ident, 'sha256': sha, 'caminho': None, 'estado': 'EM FALTA'})
    if em_falta and not razao_sem_corpos:
        faltas = ', '.join(f'{i} ({s[:12]})' for i, s in em_falta)
        if not motor:
            raise ValueError(f'O pacote recusa: o bloco toca {len(em_falta)} linha(s) com documento alojado e PACOTE_MOTOR não foi dado; os corpos alojados têm de vir da cabeça do motor (M83): {faltas}.')
        percorridos = ', '.join(sorted(e for e in estudos if e)) or 'nenhum declarado na nota das linhas nem em PACOTE_ESTUDOS'
        raise ValueError(f'O pacote recusa: corpo alojado não encontrado na cabeça do motor para {len(em_falta)} linha(s) (M83): {faltas}; estudos percorridos: {percorridos}.')
    return registo, em_falta


def escrever_corpos(destino, motor, registo, em_falta, razao_sem_corpos, paginas, paginas_em_falta, versao_dist):
    """Copia os corpos decididos, confere cada cópia pelo sha256 da linha, junta o recibo do pedido e os direitos, e escreve o manifesto."""
    pasta = destino / 'motor'
    anexos, n = [], 0
    for r in registo:
        if r['estado'] != 'copiado':
            continue
        if not copiar(motor[0], motor[2], r['caminho'], pasta):
            raise ValueError(f'O pacote recusa: o corpo alojado {r["caminho"]} desapareceu da cabeça do motor durante a montagem.')
        if sha256_de((pasta / r['caminho']).read_bytes()) != r['sha256']:
            raise ValueError(f'O pacote recusa: a cópia de {r["caminho"]} não tem o sha256 que a linha {r["linha"]} declara.')
        n += 1
        pedido = r['caminho'] + '.pedido.json'
        if copiar(motor[0], motor[2], pedido, pasta):
            anexos.append(pedido)
        direitos = str(PurePosixPath(r['caminho']).parent / 'direitos')
        for p in git(motor[0], 'ls-tree', '-r', '--name-only', '-z', motor[2], '--', direitos).split(b'\0'):
            if p and copiar(motor[0], motor[2], os.fsdecode(p), pasta):
                anexos.append(os.fsdecode(p))
    if registo:
        pasta.mkdir(parents=True, exist_ok=True)
        linhas_md = ['# Os corpos alojados das linhas que o bloco toca (M83)', '',
                     f'Copiados da cabeça `{motor[2] if motor else "(sem PACOTE_MOTOR)"}` do motor para `motor/<caminho>` pelo guião do pacote, cada um conferido '
                     'pelo sha256 que a linha declara (`document.source_sha256`); ao lado, o recibo do pedido (`<caminho>.pedido.json`) e a pasta '
                     '`direitos/` da mesma fonte, quando existem. Uma linha «EM FALTA» só chega ao pacote com a razão declarada em `SEM-CORPOS-ALOJADOS.md`, '
                     'e é Blocking na leitura. As páginas construídas das linhas entram de `dist/` quando lá estão; as que faltam estão listadas abaixo.', '',
                     '| linha | sha256 (12) | caminho no motor | estado |', '|---|---|---|---|']
        linhas_md += [f'| `{r["linha"]}` | {(r["sha256"] or "")[:12]} | {("`" + r["caminho"] + "`") if r["caminho"] else ""} | {r["estado"]} |' for r in registo]
        if anexos:
            linhas_md += ['', 'Ao lado dos corpos: ' + ', '.join(f'`{a}`' for a in sorted(set(anexos))) + '.']
        linhas_md += ['', f'Páginas construídas das linhas no pacote: {len(paginas)}; em falta em `dist/`: ' + (', '.join(f'`{p}`' for p in paginas_em_falta) if paginas_em_falta else 'nenhuma') + '.',
                      f'A versão que `dist/version.json` declara: {versao_dist or "(sem ficheiro)"}.']
        (pasta / 'CORPOS-ALOJADOS.md').write_text('\n'.join(linhas_md) + '\n', encoding='utf-8')
        (pasta / 'corpos-alojados.json').write_text(json.dumps({'cabeca_do_motor': motor[2] if motor else None, 'linhas': registo, 'anexos': sorted(set(anexos)),
                                                                'paginas_construidas': paginas, 'paginas_em_falta': paginas_em_falta, 'dist_version': versao_dist,
                                                                'sem_corpos_razao': razao_sem_corpos or None}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if em_falta:
        (destino / 'SEM-CORPOS-ALOJADOS.md').write_text('# Corpos alojados em falta neste pacote, com a razão declarada pelo lugar de direção\n\n'
                                                        f'Razão (PACOTE_SEM_CORPOS): {razao_sem_corpos}\n\n' +
                                                        '\n'.join(f'- `{i}` ({s[:12]}): as palavras desta linha não podem ser conferidas contra a fonte neste pacote.' for i, s in em_falta) +
                                                        '\n\nPara o leitor: cada uma destas linhas é um achado Blocking na primeira linha da leitura.\n', encoding='utf-8')
        print(f'Pacote: {len(em_falta)} corpo(s) alojado(s) EM FALTA com razão declarada; SEM-CORPOS-ALOJADOS.md escrito.')
    return n


def principal():
    repo, base, cabeca, destino, brief, relatorio, numeros, *construidos = sys.argv[1:]
    # Nunca substituir o argumento literal: «.» apagava todos os pontos do texto.
    repo_dado = str(Path(repo).absolute())
    repo, destino = Path(repo).resolve(), Path(destino)
    retira = shlex.split(os.environ.get('PACOTE_RETIRA', ''))
    motor = shlex.split(os.environ.get('PACOTE_MOTOR', ''))
    extra = shlex.split(os.environ.get('PACOTE_EXTRA', ''))
    modo_logs = os.environ.get('PACOTE_LOGS', '')
    razao_sem_corpos = os.environ.get('PACOTE_SEM_CORPOS', '').strip()
    if razao_sem_corpos and len(razao_sem_corpos) < 20:
        raise ValueError('PACOTE_SEM_CORPOS exige uma razão escrita (pelo menos vinte caracteres), que fica no pacote.')
    estudos_extra = shlex.split(os.environ.get('PACOTE_ESTUDOS', ''))
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
    # M83: os corpos alojados das linhas mudadas decidem-se aqui, antes de existir a pasta; a falta sem razão recusa.
    linhas = linhas_com_corpos(repo, cabeca, mudados)
    registo_corpos, em_falta = levar_corpos(repo, cabeca, motor, linhas, estudos_extra, razao_sem_corpos)
    paginas, paginas_em_falta = [], []
    for ident in sorted(linhas):
        for pagina in (f'livro-razao/{ident}/index.html', f'en/ledger/{ident}/index.html'):
            if (repo / 'dist' / pagina).is_file():
                if pagina not in construidos:
                    paginas.append(pagina)
            else:
                paginas_em_falta.append(pagina)
    construidos = list(construidos) + paginas
    versao_dist = None
    if (repo / 'dist' / 'version.json').is_file():
        try:
            versao_dist = json.loads((repo / 'dist' / 'version.json').read_text(encoding='utf-8'))
        except ValueError:
            versao_dist = '(ilegível)'
    if destino.exists() and any(destino.iterdir()):
        raise ValueError('O pacote exige uma pasta nova ou vazia: não conserva registos de uma montagem anterior.')
    destino.mkdir(parents=True, exist_ok=True)
    # M78 (13.10.2026): o rasto do conferir-relatorio.py trazia o caminho da worktree (apanhado pelo leitor da
    # V1-d); além do sítio e da casa, anonimizam-se o motor, a pasta do pacote e as pastas temporárias, e o
    # que sobrar com a forma de um caminho da máquina faz o pacote recusar, em vez de sair no rasto.
    texto_numeros = Path(numeros).read_text()
    for caminho, marca in [(repo_dado, '<sitio>'), (str(repo), '<sitio>')] + \
            ([(motor[0], '<motor>'), (str(Path(motor[0]).resolve()), '<motor>')] if motor else []) + \
            [(str(destino.resolve()), '<pacote>'), (str(destino), '<pacote>'),
             (os.environ.get('TMPDIR', '').rstrip('/') or '/nunca', '<temporario>'), ('/private/tmp', '<temporario>'), ('/tmp', '<temporario>'),
             (str(Path.home()), '<pasta-local>')]:
        if caminho and caminho != '/':
            texto_numeros = texto_numeros.replace(caminho, marca)
    # As marcas compõem-se por partes de propósito, para o próprio guião não trazer a forma de um caminho.
    sobra = re.search('/Us' + 'ers/|/ho' + 'me/[a-z]|/priv' + 'ate/|[.]cla' + 'ude/work' + 'trees/', texto_numeros)
    if sobra:
        raise ValueError(f'O pacote recusa o rasto dos números: ficou um caminho da máquina ({sobra.group(0)}) em numeros-do-relatorio.txt.')
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
    n_corpos = escrever_corpos(destino, motor, registo_corpos, em_falta, razao_sem_corpos, paginas, paginas_em_falta, versao_dist)
    for f in construidos:
        alvo = destino / 'built' / relativo(f)
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(repo / 'dist' / f, alvo)
    conferir_citacoes(destino, repo, cabeca, rel_relatorio, inteiros)
    print(f'Pacote: {copiados} ficheiros mudados, {n_extra} extra, {len(retirados)} secções retiradas, {n_motor} ficheiros do motor, '
          f'{n_corpos} corpos alojados ({len(em_falta)} em falta), {len(construidos)} páginas construídas ({len(paginas)} das linhas mudadas, de dist/).')


if __name__ == '__main__':
    principal()
