#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
As quatro maquetas da estrutura nova, compostas a partir do `dist/` construido
e de `src/data/`. Nada se escreve a mao: cada valor, nome, frase e data e
copiado de um ficheiro do repositorio e vem pelo caminho declarado aqui.
Nada se escreve dentro do repositorio: so se le.

O MATERIAL EXTRAIDO, e de onde veio:
  _cards.json   os <article class="cartao-medida"> de dist/dominios/*, dist/areas/*
  _cards_src.json  de que pagina veio cada um
  _ordem.json   a ordem de cada medida na pagina onde ela se rende hoje
  _dm.json      DOMINIO_DAS_MEDIDAS, de src/data/dominios.mjs
  _evora.json   os <li class="cartao"> e os <details class="dobra"> de
                dist/municipios/evora/index.html
  _uniao.json   os mesmos, de dist/uniao-europeia/index.html
  _mapa.json    o <figure class="mapa"> de dist/index.html
  _sec_*.html   as seccoes do documento, de
                dist/estudos/evora-2027-prometido-painel-dinheiro/texto/index.html

AS DECISOES DO DIRETOR de 17.09.2026, aplicadas aqui: a leitura antes do mapa;
uma fila de ate quatro cartoes por tema, com a porta para o tema; uma so «Taxa
de desemprego»; a frase de definicao com uma frase so; o lugar e o tema como
duas coisas; a leitura de um estudo em duas frases; o menu de cinco numa linha
a 390.
"""
import json
import os
import re

RAIZ = '/Users/nunosantos/Instruments/OEstadoDoPais'
DIST = os.path.join(RAIZ, 'dist')
AQUI = os.path.dirname(os.path.abspath(__file__))


def ler(caminho):
    with open(os.path.join(DIST, caminho), encoding='utf-8') as f:
        return f.read()


def lerf(caminho):
    with open(os.path.join(AQUI, caminho), encoding='utf-8') as f:
        return f.read()


def carrega(nome):
    with open(os.path.join(AQUI, nome), encoding='utf-8') as f:
        return json.load(f)


# ---------------------------------------------------------------- o vocabulario
TEMAS = [
    ('economia-e-financas-publicas', 'Economia e finanças públicas'),
    ('trabalho', 'Trabalho'),
    ('populacao', 'População'),
    ('migracao', 'Migração'),
    ('seguranca-social-e-pensoes', 'Segurança social e pensões'),
    ('agua', 'Água'),
    ('educacao', 'Educação'),
    ('saude', 'Saúde'),
    ('habitacao', 'Habitação'),
    ('investimento', 'Investimento'),
    ('ciencia-tecnologia-e-inteligencia-artificial',
     'Ciência, tecnologia e inteligência artificial'),
    ('espaco', 'Espaço'),
    ('infraestruturas-e-ferrovia', 'Infraestruturas e ferrovia'),
    ('ambiente-e-sustentabilidade', 'Ambiente e sustentabilidade'),
    ('cultura', 'Cultura'),
    ('seguranca', 'Segurança'),
    ('justica', 'Justiça'),
    ('governo-e-democracia', 'Governo e democracia'),
]
NOME_DO_TEMA = dict(TEMAS)
ORDEM_DO_TEMA = {s: i for i, (s, _) in enumerate(TEMAS)}

MENU = [
    ('pais.html', 'Portugal'),
    (None, 'Lugares'),
    (None, 'Temas'),
    ('estudos.html', 'Estudos'),
    (None, 'Sobre'),
]

CARTOES_POR_TEMA_NA_PRIMEIRA_PAGINA = 4


def cabeca(titulo, actual, nome_e_h1):
    """A cabeca: o menu de cinco e o nome, sem linha por baixo."""
    itens = []
    for href, palavra in MENU:
        marca = ' aria-current="page"' if palavra == actual else ''
        itens.append('<a href="%s"%s>%s</a>' % (href or '#', marca, palavra))
    nome = ('<h1 class="wordmark">O Estado do País</h1>' if nome_e_h1 else
            '<p class="wordmark"><a href="pais.html">O Estado do País</a></p>')
    return (
        '<title>%s</title>'
        '<link rel="stylesheet" href="estilo.css">'
        '<link rel="stylesheet" href="maqueta.css">'
        '<body><div class="wrap"><header>'
        '<nav class="maq-menu" aria-label="Navegação principal">%s</nav>'
        '<div class="masthead maq-masthead">%s</div>'
        '</header><main id="conteudo">' % (titulo, ''.join(itens), nome)
    )


RODAPE = (
    '</main><footer class="rodape maq-rodape">'
    '<p class="maq-rodape-linha">'
    '<a href="pais.html">Início</a> · <a href="#">Números e fontes</a> · '
    '<a href="#">Método</a> · <a href="#">Correções</a> · <a href="#">Agenda</a> · '
    '<a href="#" hreflang="en" lang="en">English</a> · '
    '<a class="ligacao-email" href="mailto:correcoes@oestadodopais.pt">correcoes@oestadodopais.pt</a> · '
    'Texto gerado por inteligência artificial, segundo o <a href="#">Método</a>. · '
    'Publicação gratuita'
    '</p></footer></div>'
)


def seccao(rotulo, corpo):
    return ('<section class="maq-sec"><div class="sec-head">'
            '<h2 class="eyebrow">%s</h2></div>%s</section>' % (rotulo, corpo))


# ------------------------------------------------------- cortar por frases (D6)
FIM_DE_FRASE = re.compile(r'[.!?]["»”\')]*(?=\s|$)')


def primeiras_frases(html, quantas):
    """As primeiras `quantas` frases, contadas fora da marcacao.

    Corta so onde um ponto final e seguido de espaco e de maiuscula (ou do fim
    do texto), para nao partir «art. 52.º», «n.º 73/2013» nem «45 784 603,10 €».
    O corte cai sempre a seguir ao ponto e nunca dentro de uma etiqueta.
    """
    dentro = False
    frases = 0
    i = 0
    n = len(html)
    while i < n:
        c = html[i]
        if c == '<':
            dentro = True
        elif c == '>':
            dentro = False
        elif not dentro and c in '.!?':
            j = i + 1
            while j < n and html[j] in '"\u00bb\u201d\')':
                j += 1
            resto = html[j:]
            fim = re.sub(r'<[^>]*>', '', resto).strip() == ''
            seguinte = re.match(r'\s+(?:<[^>]*>\s*)*(.)', resto)
            if fim or (seguinte and (seguinte.group(1).isupper() or
                                     seguinte.group(1) == '\u00ab')):
                frases += 1
                if frases >= quantas or fim:
                    return equilibra(html[:j])
            i = j - 1
        i += 1
    return html


def equilibra(fragmento):
    """Fecha as etiquetas que ficaram abertas no corte."""
    abertas = []
    for m in re.finditer(r'<(/?)([a-zA-Z0-9]+)[^>]*?(/?)>', fragmento):
        if m.group(3) == '/' or m.group(2).lower() in ('br', 'hr', 'img'):
            continue
        if m.group(1) == '/':
            if abertas and abertas[-1] == m.group(2).lower():
                abertas.pop()
        else:
            abertas.append(m.group(2).lower())
    return fragmento + ''.join('</%s>' % t for t in reversed(abertas))


# ------------------------------------------------- os cartoes do pais, por tema
CARTOES = carrega('_cards.json')
DOMINIO_DAS_MEDIDAS = carrega('_dm.json')
ORDEM_NA_PAGINA = carrega('_ordem.json')
UNIAO = carrega('_uniao.json')
EVORA = carrega('_evora.json')

# D3 · UMA MEDIDA SO ONDE HAVIA DUAS COM O MESMO NOME.
# `taxa-de-desemprego-2025` e `taxa-de-desemprego-mip-2025` rendem o mesmo nome,
# o mesmo valor (6 % da populacao ativa, 2025), a mesma frase e a mesma regua;
# a do painel europeu traz, alem disso, o valor de referencia (abaixo, 10 %).
# Fica a mais completa. Conferido: e o unico nome repetido dentro de um tema.
MEDIDAS_QUE_SAEM = {'taxa-de-desemprego-2025'}
# A que fica herda o LUGAR da que sai: a ordem de importancia e a da pagina do
# dominio (a ordem da carta, T1 a T5), e nao a da pagina de area, que e
# alfabetica. Sem isto a taxa de desemprego caia para fora da fila de quatro.
ORDEM_HERDADA = {'taxa-de-desemprego-mip-2025': 'taxa-de-desemprego-2025'}


def cartao_de_dobra(mid, fonte, frase_de=('dobra-definicao', 'dobra-frase'),
                    regua_de=('dobra-limiar',), palavra_do_cartao=False,
                    frase_manual=None, marcador=None, uma_frase=True):
    """O cartao do P2 a partir do cartao da faixa e da dobra da mesma pagina."""
    c, db = fonte[mid]['cartao'], fonte[mid]['dobra']
    corte = c.find('<p class="cartao-nome"')
    topo, resto = c[:corte], c[corte:]
    claim = topo[topo.find('<span class="claim claim-com-chip">'):]
    claim = claim.replace('class="claim-value cartao-valor"',
                          'class="claim-value cartao-medida-num"')
    if marcador:
        claim = re.sub(r'<span data-claim="[^"]*" class="claim-value cartao-medida-num">.*?</span>',
                       '<span class="marcador">%s</span>' % marcador, claim, flags=re.S)
    nome = re.search(r'<p class="cartao-nome"[^>]*>(.*?)</p>', resto, re.S).group(1)
    unidade = re.search(r'<p class="cartao-unidade"[^>]*>(.*?)</p>', resto, re.S).group(1)

    frase = frase_manual
    if frase is None:
        for classe in frase_de:
            m = re.search(r'<p class="%s"[^>]*>(.*?)</p>' % classe, db, re.S)
            if m:
                frase = m.group(1)
                break
    if frase is None:
        frase = ''
    if uma_frase and frase:
        frase = primeiras_frases(frase, 1)

    regua = ''
    for classe in regua_de:
        m = re.search(r'<p class="%s"[^>]*>(.*?)</p>' % classe, db, re.S)
        if m:
            regua = ('<p class="cartao-medida-regua">'
                     '<span class="cartao-medida-regua-item">%s</span></p>' % m.group(1))
            break
    if not regua and palavra_do_cartao:
        p = re.search(r'<span class="cartao-palavra[^"]*">(.*?)</span>', topo, re.S)
        palavra = p.group(1).strip() if p else ''
        # D4 · «sem valor de referencia» nao se escreve: nao se diz o que nao ha.
        if palavra and 'sem valor de referência' not in palavra:
            regua = ('<p class="cartao-medida-regua">'
                     '<span class="cartao-medida-regua-item"><span>%s</span>'
                     '</span></p>' % palavra)
    return (
        '<article class="cartao-medida" data-cartao-medida="%s">'
        '<span class="cartao-medida-nome">%s</span>'
        '<p class="cartao-medida-valor">%s'
        '<span class="campo-valor cartao-medida-unidade">%s</span></p>'
        '<p class="cartao-medida-frase">%s</p>%s</article>'
        % (mid, nome, claim, unidade, frase, regua)
    )


def cartoes_por_tema(pares):
    """{slug do tema: [(mid, html)]}, cada tema pela ordem da pagina de hoje."""
    por = {}
    for mid, tema in pares:
        if mid in MEDIDAS_QUE_SAEM:
            continue
        c = CARTOES.get(mid)
        if not c and mid in UNIAO:
            c = cartao_de_dobra(mid, UNIAO)
        if not c:
            continue          # sem cartao construido: nao se inventa nenhum
        por.setdefault(tema, []).append((mid, c))
    for tema in por:
        por[tema].sort(key=lambda p: ORDEM_NA_PAGINA.get(
            ORDEM_HERDADA.get(p[0], p[0]), [99, 99]))
    return por


def bloco_dos_temas(por_tema, quantos=None, porta_do_tema=True):
    """Uma fila por tema, e a porta para a pagina do tema."""
    saida = []
    for slug in sorted(por_tema, key=lambda s: ORDEM_DO_TEMA.get(s, 99)):
        todos = por_tema[slug]
        mostra = todos[:quantos] if quantos else todos
        nome = NOME_DO_TEMA.get(slug, slug)
        porta = ''
        if porta_do_tema:
            porta = ('<p class="maq-porta-do-tema">'
                     '<a href="#tema-%s">Todas as medidas de %s</a></p>'
                     % (slug, nome))
        saida.append(
            '<div class="maq-tema"><h3 class="maq-tema-k">%s</h3>'
            '<div class="maq-cartoes">%s</div>%s</div>'
            % (nome, ''.join(c for _, c in mostra), porta)
        )
    return ''.join(saida)


# ------------------------------------------------------------------- os estudos
#
# D5 · O LUGAR E O TEMA SAO DUAS COISAS, e o tema e um dos dezoito. A tabela e
# do diretor (17.09.2026), escrita aqui como a das medidas do concelho: nao sai
# de `studies.mjs`, que so tem o eixo `SUBJECTS` com um valor, `evora`.
TEMA_DO_ESTUDO = {
    'evora-2027-prometido-painel-dinheiro': 'cultura',
    'evora-prometido-pago-auditado-2026': 'economia-e-financas-publicas',
    'evora-quinze-anos-cinco-mandatos': 'governo-e-democracia',
    'evora-economia-investidores-portas-abertas-2026': 'economia-e-financas-publicas',
    'evora-orcamentado-pago-devido-2025': 'economia-e-financas-publicas',
    'evora-os-pelouros-quem-os-teve-o-que-fizeram': 'governo-e-democracia',
    'penalizacoes-por-reforma-antecipada-2026': 'seguranca-social-e-pensoes',
    'onde-esta-a-agua': 'agua',
    'agua-nao-faturada': 'agua',
    'avaliacao-economica-regional-de-portugal-2026': 'economia-e-financas-publicas',
    'which-door-is-yours': 'investimento',
    'alentejo-algarve': 'economia-e-financas-publicas',
    'evolucao-de-portugal-desde-1981': 'populacao',
}

# Os tres estudos cujo titulo vem em ingles (a edicao que existe e a inglesa).
# Os estudos cujo TITULO vem em ingles. Sao DOIS e nao tres: o diretor disse
# tres, e o registo tem dois. Os dois com `titleUnverified` («Onde está a água?»
# e «Água Não Faturada») tem edicao inglesa, mas o titulo dela e o portugues,
# porque o ingles nao e conhecido; nao sao titulos em ingles. Fica dito.
TITULO_EM_INGLES = {'which-door-is-yours', 'alentejo-algarve'}

ESTUDOS = [
    # slug, titulo, data, lugar, leitura ou descricao
    ('evora-2027-prometido-painel-dinheiro',
     'Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas',
     '16.09.2026', 'Évora', None),
    ('penalizacoes-por-reforma-antecipada-2026',
     'Penalizações por Reforma Antecipada em Portugal', '24.08.2026', None,
     'O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro.'),
    ('evora-prometido-pago-auditado-2026',
     'Évora — Prometido, Pago, Auditado 2026', '15.08.2026', 'Évora',
     'Uma leitura transversal do município de Évora: o registo de projetos do plano '
     'de recuperação, o registo de contratos públicos e o catálogo do tribunal de '
     'contas do Estado.'),
    ('evora-quinze-anos-cinco-mandatos',
     'Évora — Quinze Anos, Cinco Mandatos', '12.08.2026', 'Évora',
     'Quinze anos de governo municipal em Évora, ao longo de cinco mandatos.'),
    ('evora-economia-investidores-portas-abertas-2026',
     'Évora — Economia, Investidores, Portas Abertas 2026', '12.08.2026', 'Évora',
     'Economia, investidores e portas abertas no concelho de Évora.'),
    ('evora-orcamentado-pago-devido-2025',
     'Évora — Orçamentado, Pago, Devido 2025', '12.08.2026', 'Évora',
     'O que foi orçamentado, o que foi pago e o que ficou em dívida no concelho de Évora.'),
    ('evora-os-pelouros-quem-os-teve-o-que-fizeram',
     'Évora — Os Pelouros, Quem Os Teve, O Que Fizeram', '12.08.2026', 'Évora',
     'Quem teve cada pelouro da Câmara Municipal de Évora ao longo de cinco mandatos, '
     'quanto gastaram as contas do próprio município nas áreas que esses pelouros '
     'cobrem, e o que os relatórios dizem que essas áreas fizeram.'),
    # D5 · a primeira frase do proprio estudo, transcrita do <p class="standfirst">
    # de `studies-src/onde-esta-a-agua/pt.html`, no lugar do «[a verificar]».
    ('onde-esta-a-agua', 'Onde está a água?', '12.08.2026', None,
     'A água de Portugal: onde está, de onde vem e o que a autonomia exigiria de facto.'),
    ('agua-nao-faturada', 'Água Não Faturada', '12.08.2026', None,
     'Água não faturada nos sistemas de abastecimento em Portugal.'),
    ('avaliacao-economica-regional-de-portugal-2026',
     'Avaliação Económica Regional de Portugal 2026', '12.08.2026', None,
     'Avaliação económica das regiões de Portugal.'),
    ('which-door-is-yours',
     'Which Door Is Yours — public funding in Portugal, August 2026',
     '12.08.2026', None, 'Financiamento público em Portugal.'),
    ('alentejo-algarve', 'Alentejo &amp; Algarve — Economy, Society, Strategy',
     '12.08.2026', None,
     'Economia, sociedade e estratégia no Alentejo e no Algarve.'),
    ('evolucao-de-portugal-desde-1981', 'Evolução de Portugal desde 1981',
     '12.08.2026', None, 'Séries longas sobre a evolução do país.'),
]

RESUMO = lerf('_sec_resumo.html')
RESUMO_P = re.search(r'<p data-registo-bloco="2".*?</p>', RESUMO, re.S).group(0)


def leitura_de_2027():
    """O «Em resumo» do estudo de 2027, sem as portas para as figuras."""
    t = re.sub(r'<a class="texto-figura[^"]*" href="[^"]*"[^>]*>(.*?)</a>',
               r'<span class="claim-value">\1</span>', RESUMO_P)
    return re.sub(r'</?p[^>]*>', '', t)


def linha_de_estudo(slug, titulo, data, lugar, texto):
    if texto is None:
        texto = leitura_de_2027()
    # D6 · a leitura de um estudo mostra as duas primeiras frases.
    texto = primeiras_frases(texto, 2)
    if slug in TITULO_EM_INGLES:
        titulo += ' <span class="maq-em-ingles">(em inglês)</span>'
    alvo = 'estudo.html' if slug == 'evora-2027-prometido-painel-dinheiro' else '#'
    meta = []
    if lugar:
        meta.append('<span>%s</span>' % lugar)
    meta.append('<span>%s</span>' % NOME_DO_TEMA[TEMA_DO_ESTUDO[slug]])
    meta.append('<span><span data-voz>publicado a</span> %s</span>' % data)
    return ('<article class="maq-estudo">'
            '<h3 class="maq-estudo-k"><a href="%s">%s</a></h3>'
            '<p class="maq-estudo-meta">%s</p>'
            '<p class="maq-estudo-leitura">%s</p></article>'
            % (alvo, titulo, ''.join(meta), texto))


# ------------------------------------------------------------------ o que mudou
MUDOU = [
    ('17.09.2026',
     '«Évora 2027: o prometido, o que o painel escreveu, e o dinheiro em linhas» '
     'passa a abrir com a leitura do projeto: «Em resumo», «O que este projeto '
     'conclui», «O que podia funcionar melhor».'),
    ('16.09.2026',
     'Entra o estudo «Évora 2027: o prometido, o que o painel escreveu, e o '
     'dinheiro em linhas», nas edições portuguesa e inglesa.'),
    ('16.09.2026',
     'Cada medida passa a ter um nome em português, e as três datas de cada '
     'medida passam a estar em «Fonte e verificação».'),
]


def bloco_mudou(linhas):
    return '<ol class="maq-mudou">%s</ol>' % ''.join(
        '<li><span class="maq-mudou-data">%s</span>'
        '<p class="maq-mudou-o-que">%s</p></li>' % (d, t) for d, t in linhas)


# =========================================================== 1 · a página do país
def pagina_do_pais():
    inicio = ler('index.html')
    i = inicio.find('<h1 class="cabeca-h1"')
    leitura = inicio[i:inicio.find('</h1>', i) + len('</h1>')]
    leitura = leitura.replace('<h1 class="cabeca-h1"', '<p class="cabeca-h1 maq-leitura"')
    leitura = leitura.replace('</h1>', '</p>')

    mapa = lerf('_mapa.html')
    mapa = re.sub(r'<script[^>]*></script>', '', mapa)
    mapa = re.sub(r'<p class="mapa-nome-aviso".*?</p>', '', mapa, flags=re.S)
    mapa = re.sub(r'<p class="mapa-nome-portas">.*?</p>', '', mapa, flags=re.S)
    # D1 · a legenda do mapa é «308 concelhos», ligada aos lugares, sem a marca
    # da fonte: o recibo da contagem vive na página da linha.
    mapa = re.sub(
        r'<p class="mapa-nome-repouso" data-mapa-repouso="pais">.*?</p>',
        '<p class="mapa-nome-repouso" data-mapa-repouso="pais">'
        '<a class="maq-porta-dos-lugares" href="#lugares">'
        '<span data-claim="municipios-portugal-caop-2025" class="claim-value">308</span>'
        ' concelhos</a></p>', mapa, flags=re.S)
    mapa = mapa.replace('href="/distritos/', 'href="#distrito-')
    mapa = mapa.replace('href="/regioes/', 'href="#regiao-')

    # D2 · por tema, uma fila de até quatro cartões e a porta para o tema.
    temas = bloco_dos_temas(cartoes_por_tema(DOMINIO_DAS_MEDIDAS),
                            quantos=CARTOES_POR_TEMA_NA_PRIMEIRA_PAGINA)
    recentes = ''.join(linha_de_estudo(*e) for e in ESTUDOS[:3])

    return (
        cabeca('O Estado do País', 'Portugal', True)
        # D1 · a leitura vem antes do mapa.
        + '<div class="maq-bloco-leitura">%s</div>' % leitura
        + '<div class="maq-mapa">%s</div>' % mapa
        + seccao('Temas', temas)
        + seccao('Estudos sobre este lugar', recentes)
        + seccao('O que mudou', bloco_mudou(MUDOU))
        + RODAPE
    )


# ========================================================== 2 · a página de Évora
#
# O tema de cada medida do concelho. As quatro primeiras saem de
# DOMINIO_DAS_MEDIDAS pela medida do país com o mesmo identificador; as outras
# não estão declaradas em lado nenhum do repositório e ficam aqui, ditas.
TEMA_DA_MEDIDA_DE_EVORA = {
    'evora-indice-de-divida-2024': 'economia-e-financas-publicas',
    'evora-ganho-medio-mensal-2024': 'trabalho',
    'evora-desemprego-registado-2025-12': 'trabalho',
    'evora-poder-de-compra-2023': 'economia-e-financas-publicas',
    'evora-empresas-2024': 'economia-e-financas-publicas',
    'evora-divida-dgal-2024': 'economia-e-financas-publicas',
    'evora-prazo-medio-de-pagamento-2025-12': 'economia-e-financas-publicas',
    'evora-populacao-2025': 'populacao',
}

# D4 · a frase de definição diz o que a medida mede, numa frase só.
#   · o prazo médio de pagamento: a frase é do diretor (17.09.2026), porque a
#     construída explica a falta da fonte em vez de dizer o que a medida mede;
#     e o valor «N.d.» passa a ser a marca «sem valor publicado».
#   · o índice de dívida: a dobra não traz frase de definição; esta é a do campo
#     «Aritmética» de dist/livro-razao/evora-indice-de-divida-2024/index.html,
#     transcrita, que é a única frase construída que diz o que o índice mede.
FRASE_DA_MEDIDA_DE_EVORA = {
    'evora-prazo-medio-de-pagamento-2025-12':
        # A frase e a do diretor, palavra por palavra; so leva o ponto final,
        # que as outras sete frases dos cartoes tem e a dele nao trazia.
        'Dias que a câmara demora a pagar aos fornecedores, pela lista anual da '
        'Direção-Geral das Autarquias Locais.',
    'evora-indice-de-divida-2024':
        'O limite legal é 1,5 vezes a média da receita corrente líquida dos três '
        'anos anteriores (art. 52.º da Lei n.º 73/2013), e o índice mede a dívida '
        'contra esse limite numa escala em que o teto é 150.',
}
MARCADOR_DA_MEDIDA_DE_EVORA = {
    'evora-prazo-medio-de-pagamento-2025-12': 'sem valor publicado',
}

ESTUDOS_DE_EVORA = [
    'evora-2027-prometido-painel-dinheiro',
    'evora-prometido-pago-auditado-2026',
    'evora-economia-investidores-portas-abertas-2026',
    'evora-orcamentado-pago-devido-2025',
    'evora-quinze-anos-cinco-mandatos',
    'evora-os-pelouros-quem-os-teve-o-que-fizeram',
]


def pagina_de_evora():
    ordem = list(EVORA.keys())
    por_tema = {}
    for mid, tema in TEMA_DA_MEDIDA_DE_EVORA.items():
        c = cartao_de_dobra(
            mid, EVORA,
            frase_de=('dobra-frase', 'mun-distancia-legenda'),
            regua_de=(),
            palavra_do_cartao=True,
            frase_manual=FRASE_DA_MEDIDA_DE_EVORA.get(mid),
            marcador=MARCADOR_DA_MEDIDA_DE_EVORA.get(mid),
        )
        por_tema.setdefault(tema, []).append((mid, c))
    for tema in por_tema:
        por_tema[tema].sort(key=lambda p: ordem.index(p[0]))
    blocos = bloco_dos_temas(por_tema, quantos=None, porta_do_tema=False)

    def valor(claim, v, etiqueta, sufixo=''):
        return ('<span class="claim claim-com-chip">'
                '<span class="claim-value">%s</span>%s'
                '<a class="src-chip" href="#%s" title="%s">'
                '<span class="src-chip-texto">fonte</span></a></span>'
                % (v, ('<span class="claim-sufixo">%s</span>' % sufixo) if sufixo else '',
                   claim, etiqueta))

    dgal = 'Direção-Geral das Autarquias Locais (DGAL)'
    cicf = 'CICF/IPCA — Anuário Financeiro dos Municípios Portugueses'
    leitura = (
        '<p class="cabeca-h1 maq-leitura maq-leitura-lugar">'
        'Évora tem ' + valor('evora-populacao-2025', '58 567', 'INE') + ' pessoas e '
        'um poder de compra por habitante de '
        + valor('evora-poder-de-compra-2023', '111,47', 'INE') + ', acima da média '
        'nacional, que é a base do índice. A dívida total da câmara era de '
        + valor('evora-divida-dgal-2024', '54 681 562', dgal) + ' € em 2024, e o '
        'índice de dívida desceu de '
        + valor('evora-indice-de-divida-2014', '242,6', 'calculado', '%')
        + ' em 2014 para '
        + valor('evora-indice-de-divida-2024', '105,5', 'calculado', '%')
        + ', contra um teto legal de '
        + valor('indice-de-divida-limite-legal', '150', cicf, '%') + '.</p>'
    )

    linha = ('<p class="maq-linha-do-lugar">'
             '<a href="pais.html">Portugal</a><span aria-hidden="true">›</span>'
             '<a href="#regiao-alentejo">Alentejo</a><span aria-hidden="true">›</span>'
             '<a href="#distrito-evora">Évora</a><span aria-hidden="true">›</span>'
             '<a href="evora.html" aria-current="page">Évora</a></p>')

    por_slug = {e[0]: e for e in ESTUDOS}
    estudos = ''.join(linha_de_estudo(*por_slug[s]) for s in ESTUDOS_DE_EVORA)

    return (
        cabeca('Évora · O Estado do País', 'Lugares', False)
        + ('<div class="maq-cabeca-do-lugar">%s'
           '<h1 class="maq-nome-do-lugar">Évora</h1></div>' % linha)
        + '<div class="maq-bloco-leitura">%s</div>' % leitura
        + seccao('Temas', blocos)
        + seccao('Estudos sobre este lugar', estudos)
        + seccao('O que mudou', bloco_mudou(MUDOU))
        + RODAPE
    )


# ========================================================= 3 · a página do estudo
def pagina_do_estudo():
    def limpa(html):
        html = re.sub(r'<a class="texto-secao-topo".*?</a>', '', html, flags=re.S)
        html = re.sub(r'<span id="posicao-bloco-\d+"[^>]*>.*?</span>', '', html, flags=re.S)
        return html.replace('href="#linha-', 'href="#l-')

    corpo = (
        '<h1 class="maq-estudo-titulo">Évora 2027: o prometido, o que o painel '
        'escreveu, e o dinheiro em linhas</h1>'
        '<div class="texto"><div class="texto-corpo" style="--seccoes: 11" data-seccoes="11">'
        '<article class="texto-artigo maq-leitura-do-estudo">%s%s%s</article>'
        '<article class="texto-artigo maq-texto-do-estudo">%s%s'
        '<p class="maq-resto">o resto do texto segue</p></article>'
        '</div></div>'
        '<p class="maq-documento-original">'
        '<a href="#">Documento original (PDF)</a> · '
        '<span data-voz>publicado a</span> 16.09.2026</p>'
        % (limpa(lerf('_sec_resumo.html')), limpa(lerf('_sec_conclui.html')),
           limpa(lerf('_sec_melhor.html')), limpa(lerf('_sec_limites.html')),
           limpa(lerf('_sec_linha.html')))
    )
    return cabeca('Évora 2027 · O Estado do País', 'Estudos', False) + corpo + RODAPE


# ======================================================== 4 · a lista dos estudos
def pagina_dos_estudos():
    return (
        cabeca('Estudos · O Estado do País', 'Estudos', False)
        + '<h1 class="maq-titulo-da-lista">Estudos</h1>'
        + ('<div class="maq-lista-dos-estudos">%s</div>'
           % ''.join(linha_de_estudo(*e) for e in ESTUDOS))
        + RODAPE
    )


PAGINAS = {
    'pais.html': pagina_do_pais,
    'evora.html': pagina_de_evora,
    'estudo.html': pagina_do_estudo,
    'estudos.html': pagina_dos_estudos,
}

if __name__ == '__main__':
    for nome, fn in PAGINAS.items():
        html = ('<!DOCTYPE html><html lang="pt-PT"><head>'
                '<meta charset="utf-8">'
                '<meta name="viewport" content="width=device-width, initial-scale=1">'
                + fn().replace('<body>', '</head><body>', 1) + '</body></html>')
        with open(os.path.join(AQUI, nome), 'w', encoding='utf-8') as f:
            f.write(html)
        print(nome, len(html), 'símbolos')
