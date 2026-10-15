#!/usr/bin/env python3
"""As medidas de que o mandato ME1 depende (a regra 14 do CLAUDE.md), lidas por guião e nunca de memória:
o que a página do Método no ar diz hoje (onde está a secção da política, para onde aponta o rótulo, onde
aparecem nomes de modelos e de fornecedores), o que o livro-razão tem na família das afirmações, onde vive
o direito de resposta, que ficheiros compõem ou conferem a porta da política, e o que a amarra das decisões
exige. Escreve `medidas-mandato.json` ao lado e imprime um resumo. uso: python3 medir-mandato.py [raiz do sítio]"""
import json, pathlib, re, subprocess, sys, urllib.request, html as htmlmod, datetime

RAIZ = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parents[4]).resolve()
SAIDA = pathlib.Path(__file__).with_name('medidas-mandato.json')
m = {'medido_em': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'raiz': '<sitio>', 'medidas': {}}

def medida(nome, valor, comando, conhecido_positivo=None):
    m['medidas'][nome] = {'valor': valor, 'comando': comando}
    if conhecido_positivo is not None:
        m['medidas'][nome]['conhecido_positivo'] = conhecido_positivo

def pagina(url):
    # Por curl e não por urllib: o Python desta máquina não encontra os certificados raiz (CERTIFICATE_VERIFY_FAILED).
    r = subprocess.run(['curl', '-sSL', '--max-time', '30', '-A', 'OEstadoDoPais/medir-mandato', url], capture_output=True)
    if r.returncode != 0 or not r.stdout:
        raise SystemExit(f'medir-mandato: não li {url} (curl {r.returncode}); nada se escreve.')
    return r.stdout.decode('utf-8', 'replace')

def texto(h):
    h = re.sub(r'<script.*?</script>|<style.*?</style>', '', h, flags=re.S)
    return htmlmod.unescape(re.sub(r'<[^>]+>', ' ', h))

# 1. A página do Método no ar, nas duas edições.
NOMES = re.compile(r'Claude|Anthropic|Codex|OpenAI|Opus|Fable|gpt-\d', re.I)
for lang, url in (('pt', 'https://oestadodopais.pt/metodo/'), ('en', 'https://oestadodopais.pt/en/method/')):
    h = pagina(url)
    t = texto(h)
    h2 = re.findall(r'<h2[^>]*>(.*?)</h2>', h, flags=re.S)
    titulos = [re.sub(r'\s+', ' ', texto(x)).strip() for x in h2]
    pos = next((i for i, x in enumerate(titulos) if 'inteligência artificial' in x.lower() or 'artificial intelligence' in x.lower()), None)
    medida(f'metodo_{lang}_h2', titulos, f'curl {url} | h2')
    medida(f'metodo_{lang}_posicao_da_seccao_da_politica', {'posicao': pos + 1 if pos is not None else None, 'de': len(titulos)}, 'o índice do <h2> cujo texto fala da inteligência artificial, entre todos os <h2> da página')
    medida(f'metodo_{lang}_nomes_de_modelos', sorted(set(x.lower() for x in NOMES.findall(t))), 'as ocorrências distintas de Claude, Anthropic, Codex, OpenAI, Opus, Fable ou gpt- no texto visível')
    medida(f'metodo_{lang}_frases_com_nomes', len([s for s in re.split(r'(?<=[.!?])\s+', t) if NOMES.search(s)]), 'as frases do texto visível com um desses nomes')
    medida(f'metodo_{lang}_id_politica_presente', 'id="politica-de-ia"' in h, 'grep id="politica-de-ia"')
# As outras páginas: nenhum nome de modelo.
outras = {}
for p in ('/', '/sobre/', '/precos/', '/en/', '/en/about/', '/livro-razao/divida-publica-2025/'):
    t = texto(pagina('https://oestadodopais.pt' + p))
    outras[p] = sorted(set(x.lower() for x in NOMES.findall(t)))
medida('outras_paginas_nomes_de_modelos', outras, 'as mesmas ocorrências em seis páginas que não são o Método', 'o Método tem de dar nomes com o mesmo guião (conhecido-positivo acima)')
# O rótulo: para onde aponta.
h = pagina('https://oestadodopais.pt/precos/')
medida('rotulo_href', sorted(set(re.findall(r'href="(/metodo#[^"]*)"', h))), 'os href para /metodo# na página /precos/')
medida('rotulo_texto', re.sub(r'\s+', ' ', texto(re.search(r'<div class="rotulo-ia[^"]*"[^>]*>(.*?)</div>', h, flags=re.S).group(1))).strip() if re.search(r'<div class="rotulo-ia', h) else None, 'o texto do <div class="rotulo-ia…"> de /precos/')

def git_grep(padrao, caminhos):
    r = subprocess.run(['git', '-C', str(RAIZ), 'grep', '-l', '-e', padrao, '--', *caminhos], capture_output=True, text=True)
    assert r.returncode in (0, 1), r.stderr
    return sorted(r.stdout.split())

# 2. O livro-razão: a família das afirmações e as suas fontes.
afirm = git_grep('^afirmacao: true', ['ledger/claims'])
fontes = {}
for f in afirm:
    s = re.search(r'^source:\s*"?([^"\n]+)"?', (RAIZ / f).read_text(encoding='utf-8'), re.M)
    fontes[f.split('/')[-1]] = s.group(1) if s else None
medida('afirmacoes', {'linhas': len(afirm), 'fontes': fontes}, "git grep -l '^afirmacao: true' -- ledger/claims; o campo source de cada uma")
medida('linhas_do_livro', len(list((RAIZ / 'ledger/claims').glob('*.yml'))), 'ls ledger/claims/*.yml | wc -l')

# 3. O direito de resposta, a página das correções.
medida('direito_de_resposta', git_grep('direitoDeResposta', ['src']), "git grep -l direitoDeResposta -- src")

# 4. A porta da política: quem a compõe e quem a confere.
medida('ficheiros_da_ancora', git_grep('ancora_da_politica\\|ANCORA_DA_POLITICA\\|politica-de-ia', ['src', 'scripts', 'tests']), "git grep -l 'ancora_da_politica\\|ANCORA_DA_POLITICA\\|politica-de-ia' -- src scripts tests")
oraculo = json.loads((RAIZ / 'scripts/textos-aprovados.json').read_text(encoding='utf-8'))
medida('oraculo_chaves', [k for k in oraculo if k != '_'], 'as chaves de scripts/textos-aprovados.json')
medida('oraculo_ancora', oraculo['ancora_da_politica'], 'textos-aprovados.json ancora_da_politica')

# 5. A amarra das decisões e as citações marcadas.
ident = (RAIZ / 'IDENTIDADE.md').read_text(encoding='utf-8')
cits = [i + 1 for i, l in enumerate(ident.splitlines()) if '(`metodo`)' in l]
medida('identidade_citacoes_metodo', cits, "grep -n '(`metodo`)' IDENTIDADE.md (linhas)")
dec = (RAIZ / 'DECISIONS.md').read_text(encoding='utf-8').splitlines()
ult = [(i + 1, l) for i, l in enumerate(dec) if l.startswith('**Texto:**') and 'metodo' in l][-1]
medida('ultima_entrada_texto_metodo', {'linha': ult[0], 'texto': ult[1]}, "a última linha '**Texto:**' com metodo em DECISIONS.md")
import hashlib
sha = hashlib.sha256((RAIZ / 'src/data/metodo.mjs').read_bytes()).hexdigest()[:12]
medida('metodo_mjs_sha12_hoje', sha, 'sha256 de src/data/metodo.mjs, 12 primeiros hex (a conta de scripts/check-ledger.mjs)', 'tem de ser igual ao da última entrada Texto: metodo')

# 6. O sinal das fontes e as reconferências.
fm = (RAIZ / 'src/data/fontes.mjs').read_text(encoding='utf-8')
medida('fontes_mjs_conferidoEm', re.search(r"conferidoEm:\s*'([^']+)'", fm).group(1), "grep conferidoEm src/data/fontes.mjs")
datas = []
for f in (RAIZ / 'ledger/claims').glob('*.yml'):
    t = f.read_text(encoding='utf-8')
    if 'verifications:' in t:
        datas += re.findall(r'^\s*-\s*date:\s*"(20\d\d-\d\d-\d\d)"', t, re.M)
medida('verifications_data_maxima', max(datas) if datas else None, "o máximo das datas '- date:' sob verifications nas linhas")

# 7. Os estudos abrem com a leitura do projeto?
conclui = git_grep('O que este projeto conclui', ['src', 'registos', 'studies-src'])
medida('estudos_o_que_este_projeto_conclui', {'ficheiros': len(conclui), 'exemplos': conclui[:5]}, "git grep -l 'O que este projeto conclui' -- src registos studies-src")

# 8. As chaves da prova disponíveis.
prova = (RAIZ / 'src/lib/prova.mjs').read_text(encoding='utf-8')
chaves = re.findall(r'^  ([a-z_]+): \{\n    pt:', prova, re.M)
medida('chaves_da_prova', chaves, "as chaves com descrição pt em src/lib/prova.mjs")

# Nenhuma cadeia pessoal nem caminho da máquina na saída.
txt = json.dumps(m, ensure_ascii=False, indent=1)
assert str(pathlib.Path.home()) not in txt
SAIDA.write_text(txt + '\n', encoding='utf-8')
for k, v in m['medidas'].items():
    val = v['valor']
    print(f"{k}: {json.dumps(val, ensure_ascii=False)[:230]}")
print('escrito:', SAIDA.name)
