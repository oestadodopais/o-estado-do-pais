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
    proibidas = r'\b(?:cookie|localStorage|sessionStorage|indexedDB|navigator|location|XMLHttpRequest|WebSocket|Worker|Image|sendBeacon|eval|Function|import)\b'
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
        for nome, antigo, novo, mensagem in [
            ('credenciais', "credentials: 'omit'", "credentials: 'include'", "ER1 privacidade: o pedido perdeu a opção credentials: 'omit'."),
            ('redirecionamento', "redirect: 'error'", "redirect: 'follow'", "ER1 privacidade: o pedido perdeu a opção redirect: 'error'."),
        ]:
            plantas.append({'nome': nome, 'mensagem': mensagem, 'mordeu': mensagem in conferir_incorporador(corpo.replace(antigo, novo))})
    return {'erros': erros, 'plantas': plantas, 'passou': not erros and all(p['mordeu'] for p in plantas)}


def medir_api(raiz, prova):
    """S1: os caminhos e os nomes em `api/`, e a célula dos segredos, com as plantas."""
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
        nomes = detetor.nomes_dos_autores()
        if not nomes:
            raise ValueError('O Git não forneceu nomes para o conhecido-positivo de api/.')
        plantas.append({'id': 'api-nome-do-git',
                        'mordeu': conferir([('api-plantado.js', corpo + b'\n// ' + nomes[0] + b'\n')])['quantidade'] == 1})
    passou = (bool(ficheiros) and caminhos['quantidade'] == 0 and not achados and publicas > 0
              and all(p['mordeu'] for p in plantas))
    return {'ficheiros': len(ficheiros), 'caminhos_e_nomes': caminhos['quantidade'],
            'achados_de_caminhos': caminhos['achados'], 'segredos': achados,
            'chaves_publicas_vistas': publicas, 'plantas': plantas, 'passou': passou}


def medir(dist, prova):
    ficheiros = sorted(p for p in dist.rglob('*') if p.is_file())
    r = conferir((str(p.relative_to(dist)), p.read_bytes()) for p in ficheiros)
    r['plantas'] = []
    if prova:
        pagina = next((p for p in ficheiros if p.suffix == '.html'), None)
        if pagina is None: raise ValueError('Falta uma página construída para plantar o nome.')
        corpo = pagina.read_bytes()
        nomes = detetor.nomes_dos_autores()
        if not nomes: raise ValueError('O Git não forneceu nomes para o conhecido-positivo.')
        # As cópias são só em memória. Nenhum nome vai para a prova escrita.
        for i, nome in enumerate(nomes):
            copia = corpo.replace(b'</body>', b'<p>'+nome+b'</p></body>')
            if copia == corpo: raise ValueError('A planta não encontrou o corpo da página.')
            plantada = conferir([('pagina-construida.html', copia)])
            r['plantas'].append({'id':f'nome-do-git-{i+1}', 'pagina_base':str(pagina.relative_to(dist)),
                                'mordeu':plantada['quantidade']==1, 'falha':'nome pessoal ou caminho local na página construída'})
        from unittest.mock import patch
        # O nome real é lido e plantado só em memória, nunca no resultado.
        nome_real = Path.home().name
        pessoal = len(nome_real) >= 6 and nome_real.lower() not in detetor.CONTAS_GENERICAS
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
    r['incorporador'] = medir_incorporador(dist, prova)
    r['passou'] = bool(ficheiros) and r['quantidade']==0 and all(p['mordeu'] for p in r['plantas']) and r['api']['passou'] and r['incorporador']['passou']
    return r

if __name__ == '__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--dist',type=Path,default=RAIZ/'dist');ap.add_argument('--prova',action='store_true');ap.add_argument('--json',type=Path)
    args=ap.parse_args();r=medir(args.dist,args.prova)
    if args.json: args.json.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(r,ensure_ascii=False,indent=2));raise SystemExit(not r['passou'])
