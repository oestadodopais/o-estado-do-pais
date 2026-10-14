"""C1e: os nomes lidos do Git e os caminhos locais também não entram em dist/.

S1 (02.10.2026, ponto 6 do brief): também não entram em `api/`, a pasta das funções que correm na Vercel
ao lado do sítio, que é código público como o resto do repositório. E uma célula nova prova que `api/` não
tem segredo nenhum: nenhuma chave secreta da base (`sb_secret_`), nenhum papel de serviço (`service_role`) e
nenhum `SUGESTOES_SAL=` com valor, que é o sal da marca do endereço e vive só na Vercel; desde a passagem S1-b
(03.10.2026), também nenhum `SUGESTOES_CHAVE=` com valor (a chave que a função da base exige), e os dois nomes
apanham-se também entre aspas, na forma de uma propriedade. O conhecido-positivo
da célula é a chave pública da base (`sb_publishable_`), que o código da função leva de propósito e que o
mesmo leitor tem de ver. As plantas são cópias em memória do código da função, com um segredo ou um caminho
plantado, e cada uma tem de morder; as cadeias plantadas compõem-se aqui por partes, para nenhuma chave
falsa ficar escrita no repositório.
"""
import argparse
import gzip
import os
import subprocess
import importlib.util
import json
import re
from pathlib import Path
import sys
sys.dont_write_bytecode = True
RAIZ = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('detetor_c1', RAIZ/'design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py')
detetor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(detetor)

def conferir(ficheiros):
    vistos, achados = 0, []
    for nome, corpo in ficheiros:
        vistos += 1
        if detetor.tem_caminho(corpo): achados.append(nome)
    return {'ficheiros': vistos, 'quantidade': len(achados), 'achados': achados}

# A célula dos segredos (S1): o que não pode estar em `api/`. As marcas compõem-se por partes de propósito.
# S1-b (03.10.2026, o achado 9 da leitura a frio do Sol): o nome do sal e o da chave da função apanham-se também
# entre aspas, na forma de uma propriedade («"SUGESTOES_SAL": "…"»), e não só na forma de uma atribuição.
SEGREDOS = [
    ('chave secreta da base', re.compile(rb'sb_' + rb'secret_')),
    ('papel de serviço', re.compile(rb'service' + rb'_role')),
    ('o sal da marca com valor', re.compile(rb'SUGESTOES_' + rb'SAL["\']?\s*[:=]\s*["\']?[^\s"\';,)]+')),
    ('a chave da função com valor', re.compile(rb'SUGESTOES_' + rb'CHAVE["\']?\s*[:=]\s*["\']?[^\s"\';,)]+')),
]
PUBLICA = re.compile(rb'sb_' + rb'publishable_[A-Za-z0-9_-]+')


def ficheiros_da_api(raiz):
    pasta = raiz / 'api'
    return sorted(p for p in pasta.rglob('*') if p.is_file()) if pasta.is_dir() else []


def segredos_em(corpo):
    return [nome for nome, marca in SEGREDOS if marca.search(corpo)]


def conferir_incorporador(corpo):
    """ER1: leitura estática da superfície permitida, além do ensaio no navegador.
    Não é uma prova geral de segurança de JavaScript arbitrário. Restringe o
    guião pequeno à forma auditada, sem origens, APIs ou seletores adicionais.
    """
    erros = []
    proibidas = r'\b(?:cookie|localStorage|sessionStorage|indexedDB|navigator|location|XMLHttpRequest|WebSocket|Worker|Image|sendBeacon|eval|Function|import|postMessage|parent|top|innerText|getElementsBy\w*|body)\b'
    if re.search(proibidas, corpo) or re.search(r'document\s*(?:\.referrer|\[)', corpo): erros.append('ER1 privacidade: API fora dos elementos próprios.')
    # A única origem literal vem da configuração canónica, lida sem rede.
    config = (RAIZ / 'site.config.mjs').read_text()
    host = re.search(r"SITE_HOST_DISPLAY = '([^']+)'", config).group(1).encode('idna').decode()
    origens = re.findall(r'https?://[^\s\'"<>]+', corpo)
    if origens != ['https://' + host]: erros.append('ER1 privacidade: endereço fora da origem fixa do projeto.')
    if len(re.findall(r'\bfetch\s*\(', corpo)) != 1 or "fetch(origem + '/livro-razao/' + id + '.json', {" not in corpo:
        erros.append('ER1 privacidade: o pedido não é exclusivamente o JSON da linha.')
    for opcao in ("credentials: 'omit'", "redirect: 'error'", "referrerPolicy: 'no-referrer'"):
        if opcao not in corpo: erros.append('ER1 privacidade: o pedido perdeu a opção ' + opcao + '.')
    seletores = re.findall(r'document\.querySelector(?:All)?\(([^\n]+)\)', corpo)
    if len(seletores) != 1 or "document.querySelectorAll('p.oedp-numero[data-oedp]')" not in corpo:
        erros.append('ER1 privacidade: leitura fora dos parágrafos próprios.')
    if re.search(r'\b(?:innerHTML|outerHTML|insertAdjacentHTML|src|href)\s*=\s*(?:d|j|c)\.', corpo):
        erros.append('ER1 privacidade: a resposta pode executar código ou escolher um endereço.')
    return erros


def medir_incorporador(dist, prova):
    caminhos = [RAIZ / 'public/incorporar.js', dist / 'incorporar.js']
    erros = []
    plantas = []
    for caminho in caminhos:
        if not caminho.is_file():
            erros.append('ER1 privacidade: falta o guião de incorporação.')
            continue
        erros += conferir_incorporador(caminho.read_text())
    if all(p.is_file() for p in caminhos) and caminhos[0].read_bytes() != caminhos[1].read_bytes():
        erros.append('ER1 privacidade: o guião construído difere do publicado.')
    if prova and caminhos[0].is_file():
        corpo = caminhos[0].read_text()
        for nome, acrescento, mensagem in [
            ('pedido-de-fora', "\nfetch('https://fora.invalid/receber');", 'ER1 privacidade: endereço fora da origem fixa do projeto.'),
            ('cookie', '\ndocument.cookie;', 'ER1 privacidade: API fora dos elementos próprios.'),
            ('armazenamento', '\nlocalStorage.setItem("x", "y");', 'ER1 privacidade: API fora dos elementos próprios.'),
            ('pagina-anfitria', '\ndocument.querySelectorAll("body");', 'ER1 privacidade: leitura fora dos parágrafos próprios.'),
        ]:
            achados = conferir_incorporador(corpo + acrescento)
            plantas.append({'nome': nome, 'mensagem': mensagem, 'mordeu': mensagem in achados})
        for palavra, acesso in [
            ('postMessage', 'window.postMessage("x", "*");'),
            ('parent', 'window.parent;'), ('top', 'window.top;'),
            ('innerText', 'document.documentElement.innerText;'),
            ('getElementsBy', 'document.getElementsByTagName("p");'),
            ('body', 'document.body;'),
        ]:
            mensagem = 'ER1 privacidade: API fora dos elementos próprios.'
            plantas.append({'nome': palavra, 'mensagem': mensagem,
                            'mordeu': mensagem in conferir_incorporador(corpo + '\n' + acesso)})
        for nome, antigo, novo, mensagem in [
            ('credenciais', "credentials: 'omit'", "credentials: 'include'", "ER1 privacidade: o pedido perdeu a opção credentials: 'omit'."),
            ('redirecionamento', "redirect: 'error'", "redirect: 'follow'", "ER1 privacidade: o pedido perdeu a opção redirect: 'error'."),
        ]:
            plantas.append({'nome': nome, 'mensagem': mensagem, 'mordeu': mensagem in conferir_incorporador(corpo.replace(antigo, novo))})
    return {'erros': erros, 'plantas': plantas, 'passou': not erros and all(p['mordeu'] for p in plantas)}


def medir_api(raiz, prova):
    """S1: os caminhos e os nomes em `api/`, e a célula dos segredos, com as plantas."""
    detetor.ler_proibidos()
    positivos = detetor.positivos_de_nome()
    ficheiros = ficheiros_da_api(raiz)
    caminhos = conferir((str(p.relative_to(raiz)), p.read_bytes()) for p in ficheiros)
    achados = [{'ficheiro': str(p.relative_to(raiz)), 'segredos': s}
               for p in ficheiros if (s := segredos_em(p.read_bytes()))]
    publicas = sum(len(PUBLICA.findall(p.read_bytes())) for p in ficheiros)
    plantas = []
    if prova:
        if not ficheiros:
            raise ValueError('Falta um ficheiro em api/ para plantar.')
        corpo = ficheiros[0].read_bytes()
        plantados = [
            ('segredo-chave-secreta', b'const k = "' + b'sb_' + b'secret_' + b'0' * 24 + b'";'),
            ('segredo-papel-de-servico', b'// a chave do ' + b'service' + b'_role vai aqui'),
            ('segredo-sal-com-valor', b'SUGESTOES_' + b'SAL=' + b'0' * 16),
            ('segredo-sal-entre-aspas', b'{ "SUGESTOES_' + b'SAL": "' + b'0' * 16 + b'" }'),
            ('segredo-chave-com-valor', b'SUGESTOES_' + b'CHAVE=' + b'0' * 16),
            ('segredo-chave-entre-aspas', b"{ 'SUGESTOES_" + b"CHAVE': '" + b'0' * 16 + b"' }"),
        ]
        for nome, linha in plantados:
            plantas.append({'id': nome, 'mordeu': bool(segredos_em(corpo + b'\n' + linha + b'\n'))})
        # O nome do sal e o da chave sem valor, como o código os lê do ambiente, não são segredo nenhum.
        plantas.append({'id': 'sal-lido-do-ambiente-sem-valor',
                        'mordeu': not segredos_em(b'const sal = process.env.SUGESTOES_' + b'SAL;')})
        plantas.append({'id': 'chave-lida-do-ambiente-sem-valor',
                        'mordeu': not segredos_em(b"const chave = (process.env.SUGESTOES_" + b"CHAVE ?? '').trim();")})
        plantas.append({'id': 'nome-vazio-entre-aspas-sem-valor',
                        'mordeu': not segredos_em(b'{ "SUGESTOES_' + b'SAL": "" }')})
        for i, caminho in enumerate(detetor.proibidos()):
            plantas.append({'id': f'api-caminho-{i + 1}',
                            'mordeu': conferir([('api-plantado.js', corpo + b'\n// ' + caminho + b'\n')])['quantidade'] == 1})
        plantas.append({'id': 'api-nome-pessoal',
                        'mordeu': bool(positivos) and conferir([('api-plantado.js', corpo + b'\n// ' + positivos[0] + b'\n')])['quantidade'] == 1})
    passou = (bool(positivos) and bool(ficheiros) and caminhos['quantidade'] == 0 and not achados and publicas > 0
              and all(p['mordeu'] for p in plantas))
    return {'ficheiros': len(ficheiros), 'conhecido_positivo_de_nome': bool(positivos),
            'aviso': '' if positivos else 'Correu sem conhecido-positivo de nome; corrida recusada.',
            'caminhos_e_nomes': caminhos['quantidade'],
            'achados_de_caminhos': caminhos['achados'], 'segredos': achados,
            'chaves_publicas_vistas': publicas, 'plantas': plantas, 'passou': passou}


# JD1-c, achado 8: fragmentos portáveis são recusados nos registos, não no código.
# As marcas constroem-se por partes para o próprio detetor cumprir a regra.
ESTRUTURA_LOCAL = (b'Instruments' + b'/', b'.claude' + b'/worktrees/')


def e_registo(nome):
    return nome.endswith(('.log', '.log.gz')) or (
        nome.startswith(('design/especime-v3/medicoes/', 'design/especime-v3/critica/'))
        and nome.endswith(('.md', '.json', '.txt', '.gz')))


def tem_estrutura_local(nome, dados):
    if not e_registo(nome):
        return False
    corpo = gzip.decompress(dados) if nome.endswith('.gz') else dados
    return any(m in nome.encode() or m in dados or m in corpo for m in ESTRUTURA_LOCAL)


def tem_cadeia_pessoal(nome, dados, cadeias):
    corpo = gzip.decompress(dados) if nome.endswith('.gz') else dados
    return any(detetor.contem_cadeias(b, cadeias) for b in (os.fsencode(nome), dados, corpo))


def recusar_rastreado(nome, dados, cadeias):
    """A conferência e as plantas percorrem a mesma decisão."""
    return tem_estrutura_local(nome, dados) or tem_cadeia_pessoal(nome, dados, cadeias)


def plantas_identidades():
    from unittest.mock import patch, Mock
    plantas = []
    for i, identidade in enumerate(sorted(detetor.IDENTIDADES_DO_PROJETO), 1):
        recusada = False
        try:
            detetor._ler_proibidos(identidade, True)
        except ValueError:
            recusada = True
        plantas.append({'id': f'identidade-{i}-segredo', 'mordeu': recusada})
        with patch.object(detetor.subprocess, 'run', return_value=Mock(returncode=1)), \
                patch.object(detetor, 'git', return_value=identidade):
            # Percorre a função real sem usar nem alterar a cache dos autores.
            autores = detetor._nomes_dos_autores()
        plantas.append({'id': f'identidade-{i}-autor', 'mordeu': not autores})
    return plantas


def plantas_normalizacao():
    from unittest.mock import patch
    import unicodedata
    inteiro = 'Pessoa ' + 'Sintética ' + 'Exemplo'
    curto = 'Pessoa Exemplo'
    entrada = '\ufeff\u2003' + unicodedata.normalize('NFD', inteiro) + '\u00a0\ufeff'
    with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': entrada}), \
            patch.object(detetor, 'nomes_dos_autores', return_value=()), \
            patch.object(detetor.Path, 'home', return_value=Path('/') / 'home' / 'runner'):
        cadeias = detetor.cadeias_pessoais()
        plantas = [
            {'id': 'normalizacao-bom-pagina', 'mordeu': bool(conferir([('index.html', inteiro.encode())])['quantidade'])},
            {'id': 'normalizacao-abreviada-limpa', 'mordeu': cadeias == (inteiro.encode(), curto.encode())},
            {'id': 'normalizacao-nfd-pagina', 'mordeu': detetor.tem_caminho(unicodedata.normalize('NFD', inteiro.upper()).encode())},
        ]
        with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': 'Pessoa\u200b ' + 'Sintética ' + 'Exemplo'}):
            recusada = False
            try:
                detetor.ler_proibidos()
            except ValueError:
                recusada = True
            plantas.append({'id': 'normalizacao-formato-recusado', 'mordeu': recusada})
    return plantas


def plantas_pessoais():
    # Só em memória. Os rótulos da prova nunca incluem a cadeia plantada.
    cadeia = 'Pessoa-Sintética-RH1'.encode()
    casos = [
        ('texto', 'ensaio.txt', cadeia, True),
        ('gzip', 'registo.log.gz', gzip.compress(cadeia), True),
        ('nome', cadeia.decode() + '.txt', b'inocuo', True),
        ('outra-caixa', 'ensaio.txt', cadeia.decode().upper().encode(), True),
        ('binario', 'ensaio.pdf', b'%PDF\x00\xff' + cadeia + b'\x00', True),
    ]
    for codificacao in ('utf-16-le', 'utf-16-be', 'latin-1'):
        casos.append((codificacao, 'ensaio.bin', cadeia.decode().encode(codificacao), True))
    for caso, entidade in [('entidade-nome', '&eacute;'), ('entidade-decimal', '&#233;'),
                           ('entidade-hexadecimal', '&#xE9;'), ('escape-unicode', r'\u00e9')]:
        casos.append((caso, 'ensaio.txt', cadeia.decode().replace('é', entidade).encode(), True))
    # Estes casos isolam cada lado do OR, além de provarem a ausência de alarme.
    casos.extend([('decisao-estrutura', 'registo.log', ESTRUTURA_LOCAL[0], True),
                  ('decisao-inocua', 'registo.log', b'<worktree>/dist', False)])
    plantas = [{'id': 'ramo-pessoal-' + caso, 'mordeu': recusar_rastreado(nome, dados, (cadeia,)) == esperado}
               for caso, nome, dados, esperado in casos]
    return plantas + plantas_identidades() + plantas_normalizacao() + plantas_formas_d()


def plantas_formas_d():
    """RH1-d: cada representação e cada variante de espaço, só em memória."""
    import unicodedata
    inteiro = 'Pessoa ' + 'Sintética ' + 'Exemplo'
    plantas = []
    for caso, espaco in [('duplo', '  '), ('inseparavel', '\u00a0'), ('tabulador', '\t')]:
        lidas = detetor._ler_proibidos(inteiro.replace(' ', espaco), True)
        plantas.append({'id': 'espaco-segredo-' + caso,
                        'mordeu': lidas == (inteiro.encode(),) and detetor.contem_cadeias(inteiro.encode(), lidas)})
    for caso, espaco in [('duplo', '  '), ('inseparavel', '\u00a0'), ('quebra', '\n'),
                         ('entidade', '&nbsp;'), ('decimal', '&#160;'), ('hexadecimal', '&#xA0;')]:
        for codificacao in ('utf-8', 'utf-16-le', 'utf-16-be', 'latin-1'):
            corpo = inteiro.replace(' ', espaco).encode(codificacao)
            plantas.append({'id': 'espaco-pagina-' + caso + '-' + codificacao,
                            'mordeu': recusar_rastreado('ensaio.bin', corpo, (inteiro.encode(),))})
    dobravel = 'Pessoa ' + 'Sintética ' + 'Straße'
    for normalizacao in ('NFC', 'NFD'):
        for caixa, texto in [('minusculas', dobravel.lower()), ('casefold', dobravel.casefold()),
                             ('maiusculas', dobravel.upper())]:
            for codificacao in ('utf-8', 'utf-16-le', 'utf-16-be', 'latin-1'):
                try:
                    corpo = unicodedata.normalize(normalizacao, texto).encode(codificacao)
                except UnicodeEncodeError:
                    continue  # NFD com marcas combinantes não cabe em Latin-1.
                plantas.append({'id': 'forma-' + normalizacao + '-' + caixa + '-' + codificacao,
                                'mordeu': recusar_rastreado('ensaio.bin', corpo, (dobravel.encode(),))})
    plantas.append({'id': 'espacos-controlo-inocuo',
                    'mordeu': not recusar_rastreado('ensaio.txt', b'Uma pagina publica.', (inteiro.encode(),))})
    return plantas


def plantas_transferidas():
    """RH1-b: equivalentes em memória das guardas pessoais do HTML e do M5."""
    from unittest.mock import patch
    inteiro = 'Pessoa ' + 'Sintética ' + 'Exemplo'
    curto = inteiro.split()[0] + ' ' + inteiro.split()[-1]
    casos = [
        ('nome-inteiro', 'index.html', '<p>' + inteiro + '</p>'),
        ('documento-alojado-for-abreviado', 'estudos/ensaio/documento/index.html', '<p>for ' + curto + '</p>'),
        ('documento-alojado-en', 'en/studies/ensaio/document/index.html', '<p>for ' + curto.upper() + '</p>'),
        ('atributo', 'index.html', '<p title="' + inteiro + '"></p>'),
        ('json-ld', 'index.html', '<script type="application/ld+json">{"author":"' + curto + '"}</script>'),
        ('rotulo', 'index.html', '<span class="rotulo-ia-linha">' + inteiro + '</span>'),
        ('regra-do-metodo', 'metodo/index.html', '<strong>' + curto + '</strong>'),
        ('m5-pagina-com-comentario', 'sobre/index.html', '<!-- ' + inteiro + ' -->'),
    ]
    plantas = []
    with patch.dict(os.environ, {'PRIVACIDADE_PROIBIDOS': inteiro}), \
            patch.object(detetor, 'nomes_dos_autores', return_value=()), \
            patch.object(detetor.Path, 'home', return_value=Path('/') / 'home' / 'runner'):
        for caso, nome, corpo in casos:
            plantas.append({'id': 'transferida-' + caso,
                            'mordeu': conferir([(nome, corpo.encode())])['quantidade'] == 1})
        for nome, caso in [('src/views/Ensaio.astro', 'm5-vista'), ('public/ensaio.txt', 'fonte-publica')]:
            plantas.append({'id': 'transferida-' + caso,
                            'mordeu': tem_cadeia_pessoal(nome, ('const nome = "' + curto + '";').encode(), detetor.cadeias_pessoais())})
        plantas.append({'id': 'transferida-controlo-publico',
                        'mordeu': not conferir([('index.html', '\n'.join(sorted(detetor.IDENTIDADES_DO_PROJETO)).encode())])['quantidade']})
    return plantas


def medir_rastreados(raiz, prova):
    cadeias = detetor.cadeias_pessoais()
    nomes = subprocess.check_output(['git', '-C', str(raiz), 'ls-files', '-z']).decode().split('\0')
    ficheiros, achados = 0, []
    for nome in filter(None, nomes):
        p = raiz / nome
        if not p.exists() and not p.is_symlink():
            continue  # Uma remoção da worktree não publica o ficheiro removido.
        ficheiros += 1
        dados = os.readlink(p).encode() if p.is_symlink() else p.read_bytes()
        if recusar_rastreado(nome, dados, cadeias):
            achados.append(nome)
    plantas = []
    if prova:
        for i, marca in enumerate(ESTRUTURA_LOCAL, 1):
            for nome, dados, caso in [('registo.log', b'raiz/' + marca + b'ficheiro', 'texto'),
                                      ('design/especime-v3/medicoes/ensaio/registo.json.gz', gzip.compress(marca), 'gzip'),
                                      ('design/especime-v3/critica/' + (marca + b'ficheiro.md').decode(), b'inocuo', 'nome')]:
                plantas.append({'id': f'ramo-estrutura-{i}-{caso}', 'mordeu': tem_estrutura_local(nome, dados)})
        nome = 'design/especime-v3/medicoes/ensaio/registo.json.gz'
        assert e_registo(nome), 'A planta inócua tem de entrar no detetor dos registos.'
        plantas.append({'id': 'ramo-estrutura-inocua', 'mordeu': not tem_estrutura_local(nome, gzip.compress(b'<worktree>/dist <sitio>/src <motor>/content')), 'mensagem': 'Registo comprimido dentro do âmbito, com marcadores portáveis, lido e aceite.'})
    if prova:
        plantas.extend(plantas_pessoais())
        plantas.append({'id': 'guiao-com-casa-portavel', 'mordeu': not tem_estrutura_local('scripts/ensaio.sh', b'$HOME/' + ESTRUTURA_LOCAL[0] + b'ResearchHub'), 'mensagem': 'Caminho relativo à casa permitido no guião.'})
    return {'ficheiros': ficheiros, 'quantidade': len(achados), 'achados': achados, 'plantas': plantas,
            'passou': ficheiros > 0 and not achados and all(p['mordeu'] for p in plantas)}


def medir(dist, prova):
    detetor.ler_proibidos()
    nomes = detetor.positivos_de_nome()
    ficheiros = sorted(p for p in dist.rglob('*') if p.is_file())
    r = conferir((str(p.relative_to(dist)), p.read_bytes()) for p in ficheiros)
    r['plantas'] = []
    r['conhecido_positivo_de_nome'] = bool(nomes)
    r['aviso'] = '' if nomes else 'Correu sem conhecido-positivo de nome; corrida recusada.'
    if prova:
        r['plantas'].extend(plantas_transferidas())
        pagina = next((p for p in ficheiros if p.suffix == '.html'), None)
        if pagina is None: raise ValueError('Falta uma página construída para plantar o nome.')
        corpo = pagina.read_bytes()
        # As cópias são só em memória. Nenhum nome vai para a prova escrita.
        for i, nome in enumerate(nomes):
            copia = corpo.replace(b'</body>', b'<p>'+nome+b'</p></body>')
            if copia == corpo: raise ValueError('A planta não encontrou o corpo da página.')
            plantada = conferir([('pagina-construida.html', copia)])
            r['plantas'].append({'id':f'nome-pessoal-{i+1}', 'pagina_base':str(pagina.relative_to(dist)),
                                'mordeu':plantada['quantidade']==1, 'falha':'nome pessoal ou caminho local na página construída'})
        from unittest.mock import patch
        # O nome real é lido e plantado só em memória, nunca no resultado.
        nome_real = Path.home().name
        pessoal = bool(detetor.nome_da_casa())
        r['plantas'].append({'id': 'nome-da-casa-real', 'nome_pessoal': pessoal,
                            'esperado': 'detetar' if pessoal else 'conta genérica ou curta',
                            'mordeu': detetor.tem_caminho(b'<p>'+nome_real.encode()+b'</p>') == pessoal})
        with patch.object(detetor.Path, 'home', return_value=Path('/')/'Users'/'mariaexemplo'):
            r['plantas'].append({'id': 'nome-pessoal-portavel',
                                'mordeu': detetor.tem_caminho(b'<p>mariaexemplo</p>')})
        with patch.object(detetor.Path, 'home', return_value=Path('/')/'home'/'runner'):
            r['plantas'].append({'id': 'ligacao-home-na-conta-generica',
                                'mordeu': not detetor.tem_caminho(b'<a href="https://example.org/home/x">fonte</a>')})
        # A mesma página pode conter URL, seletor CSS e palavras de código.
        inocuo = b'<style>:root { color: red }</style><a href="https://example.org">root runner app</a>'
        for nome in ('', 'root', 'runner', 'app', 'code'):
            pasta = Path('/') / nome
            with patch.object(detetor.Path, 'home', return_value=pasta):
                r['plantas'].append({'id': 'pasta-generica-' + (nome or 'raiz'),
                                    'mordeu': not detetor.tem_caminho(inocuo)})
        for i, caminho in enumerate(detetor.proibidos()):
            r['plantas'].append({'id':f'caminho-{i+1}', 'mordeu':conferir([('pagina-construida.html',corpo+b'<p>'+caminho+b'</p>')])['quantidade']==1})
    r['api'] = medir_api(RAIZ, prova)
    r['rastreado'] = medir_rastreados(RAIZ, prova)
    r['incorporador'] = medir_incorporador(dist, prova)
    r['passou'] = bool(nomes) and bool(ficheiros) and r['quantidade']==0 and all(p['mordeu'] for p in r['plantas']) and r['api']['passou'] and r['rastreado']['passou'] and r['incorporador']['passou']
    return r


def json_seguro(resultado):
    texto = json.dumps(resultado, ensure_ascii=False, indent=2) + '\n'
    fugas = sum(detetor.contem_cadeias(texto.encode(), (c,)) for c in detetor.cadeias_pessoais())
    if fugas:
        raise ValueError(f'Privacidade: {fugas} cadeia(s) ia(m) sair; o JSON não se imprime nem se escreve.')
    return texto


if __name__ == '__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--dist',type=Path,default=RAIZ/'dist');ap.add_argument('--prova',action='store_true');ap.add_argument('--json',type=Path)
    args = ap.parse_args()
    try:
        detetor.carregar_proibidos_locais()
        r = medir(args.dist, args.prova)
        texto = json_seguro(r)
        if args.json:
            args.json.write_text(texto, encoding='utf-8')
    except ValueError as erro:
        print(str(erro), file=sys.stderr)
        raise SystemExit(1)
    except (OSError, subprocess.SubprocessError):
        print('Privacidade: não foi possível ler uma fonte; corrida recusada.', file=sys.stderr)
        raise SystemExit(1)
    print(texto, end='')
    raise SystemExit(not r['passou'])
