#!/usr/bin/env python3
"""O inventário das frases depois do bloco ME1: as linhas que o Método deixou de render e as linhas novas dele.

Lê os blocos do Método como a régua da voz os lê (`blocos-do-metodo.json`, despejado de uma cópia temporária de
`scripts/medir-defeitos.mjs` que guarda, só para o Método, o que a medição junta às rotas isentas: a medida 8 e
a varredura da voz), e escreve em `design/especime-v3/INVENTARIO-FRASES.md`:

  · as linhas que deixaram de se render com a página nova: duas saem do ficheiro (os títulos «O livro-razão» e
    «The ledger», que não podem ser sentinelas, porque são palavras correntes de outras páginas), e as outras
    passam a «retirada», com a razão escrita (os papéis da H4, os casos do TP1 e o sinal das fontes);
  · uma secção nova com as linhas do Método, nas duas edições: os títulos das secções novas (navegação), os
    parágrafos da primeira secção (divulgação, como as linhas da H4 que substituem) e os das outras
    (autorreferência, a que o Método pode ter). Um bloco que a medida 8 lê com algarismos que mudam com os
    dados entra pela forma da varredura da voz, sem os números: uma linha com uma contagem por dentro deixava
    de se render na primeira atualização e fechava a construção;
  · pela decisão do lugar de direção sobre a questão ME1-21 (15.10.2026), as quatro primeiras recusas do
    Método, nas duas edições (divulgação, como a quinta, que tem linha desde o S1-c): estavam na página desde
    antes do bloco e nenhum portão as prendia;
  · pela leitura a frio do Codex (15.10.2026, o achado 11), a frase da escala do fecho, em palavras correntes:
    a antiga, do bloco `dominio`, passa a «retirada» com a razão, e a nova entra viva na secção ME1, como
    autorreferência (diz o que este projeto escolheu); e, pela leitura curta da passagem de correção (o achado
    7), a redação intermédia («as classes da escala») fica na secção ME1 como «retirada», com a razão, e a frase
    viva diz «os valores onde a cor muda».

É repetível: as linhas já retiradas ou já fora do ficheiro não mudam, e uma secção ME1 que já exista reescreve-se
inteira a partir dos blocos da página (foi o que a passagem de correção, depois da leitura das frases construídas
pelo lugar de direção, precisou: sete parágrafos mudaram nas duas edições).

uso: python3 inventario-me1.py <raiz do sítio> <blocos-do-metodo.json>"""
import json, pathlib, re, sys

RAIZ = pathlib.Path(sys.argv[1]).resolve()
BLOCOS = json.loads(pathlib.Path(sys.argv[2]).read_text(encoding='utf-8'))
INV = RAIZ / 'design/especime-v3/INVENTARIO-FRASES.md'
texto = INV.read_text(encoding='utf-8')
linhas = texto.split('\n')

SAEM = {'| conteudo | O livro-razão | até 2026-08-26 | viva | — |', '| conteudo | The ledger | até 2026-08-26 | viva | — |'}
RAZOES = {
    'frescura': 'ME1 (15.10.2026): o sinal das fontes saiu do Método, que era a única página que o rendia, até o corredor do GitHub ser armado (mostrava a última corrida da máquina, de 01.09.2026); volta com ele, e a linha volta a «viva».',
    'h4': 'ME1 (15.10.2026): a secção da política passou a ser a primeira do Método e a dizer os papéis e a regra das famílias em parágrafos, sem nomes de modelos nem de fornecedores; as frases novas estão na secção ME1.',
    'tp1': 'ME1 (15.10.2026): os dois casos do que se publica passaram a um parágrafo da primeira secção do Método; a frase nova está na secção ME1.',
}
retiradas, sairam = [], []
novas_linhas = []
ESCALA_ANTIGA = re.compile(r'^\| (conteudo) \| (As classes são marcas redondas da escala, e não um limite oficial\.|The classes are round scale marks, not an official limit\.) \| (dominio) \| viva \|.*\|$')
RAZAO_DA_ESCALA = ('ME1 (15.10.2026), a leitura a frio do Codex, o achado 11: a frase da escala do fecho do Método era ininteligível '
                   'para um leitor de primeira vez e passa a dizer o mesmo em palavras correntes; a frase nova está na secção ME1.')
for l in linhas:
    if l in SAEM:
        sairam.append(l)
        continue
    e = ESCALA_ANTIGA.match(l)
    if e:
        retiradas.append(e.group(2))
        novas_linhas.append(f'| {e.group(1)} | {e.group(2)} | {e.group(3)} | retirada | {RAZAO_DA_ESCALA} |')
        continue
    m = re.match(r'^\| (divulgacao|conteudo|navegacao|autorreferencia) \| (.+?) \| (h4|tp1|frescura) \| viva \| (.*) \|$', l)
    if m:
        classe, frase, bloco, _ = m.groups()
        alvo = {'h4': ('Os três papéis', 'São três papéis', 'There are three roles', 'A direção decide o que se faz', 'A construção faz as páginas e o motor',
                       'A leitura confere o que a construção', 'Direction decides what is done', 'Building makes the pages and the engine',
                       'Reading checks what building delivered', 'A construção e a leitura são sempre de famílias de modelos',
                       'Building and reading are always done by different families of models'),
                'tp1': ('Publica-se · Um valor novo', 'Published · A new value', 'Não se publica, e a direção decide', 'Not published, and direction decides'),
                'frescura': ('Séries atrasadas:', 'Series behind:', 'séries publicadas atrás do último período da fonte',
                             'series published behind the source’s latest period', 'linhas do livro-razão dessas séries', 'ledger rows in those series')}[bloco]
        if frase.startswith(alvo):
            retiradas.append(frase)
            novas_linhas.append(f'| {classe} | {frase} | {bloco} | retirada | {RAZOES[bloco]} |')
            continue
    novas_linhas.append(l)

# As linhas novas, pela ordem da página, lidas dos blocos da régua.
def tem_numero_que_muda(t):
    # As entidades de carácter que a régua lê cruas (o apóstrofo inglês é `&#39;`) não são números.
    return bool(re.search(r'\d', re.sub(r'&#\d+;', '', t)))

def linhas_da_rota(rota):
    casa, voz = BLOCOS[rota]['casa'], BLOCOS[rota]['voz']
    return casa, voz

NOVAS = []
TITULOS = {'pt': ['Quem escreve estas páginas', 'De onde vêm os números', 'O recibo de cada número', 'Como se confere', 'O que está por confirmar',
                  'O que se mede, e quem decide', 'O que este projeto não faz'],
           'en': ['Who writes these pages', 'Where the numbers come from', 'The receipt for each number', 'How it is checked',
                  'What is still to be confirmed', 'What gets measured, and who decides', 'What this project does not do']}
# O início de cada parágrafo, pela ordem da página. Os três com contagens da prova procuram-se pela forma da
# varredura da voz (sem os números); os outros pela da medida 8, que traz o texto das ligações.
PELA_VOZ = {
    'pt': ['Hoje a lista tem entradas', 'Hoje entradas têm pelo menos', 'O registo público das correções'],
    'en': ['Today the list has entries', 'Today entries have at least', 'The public register of corrections'],
}
INICIOS = {
    'pt': {'divulgacao': ['O trabalho divide-se em três papéis', 'A construção e a leitura são sempre de famílias diferentes de sistemas',
                          'Um valor novo da mesma medida, no mesmo formato e da mesma fonte'],
           'autorreferencia': ['Como estas páginas são feitas, conferidas e corrigidas', 'Os números destas páginas vêm de fontes oficiais',
                               'A imprensa', 'Todos os números publicados estão numa só lista', 'Ao lado de cada medição há um selo',
                               'Hoje a lista tem entradas', 'O recibo inclui um código', 'Estas páginas são geradas a partir dessa lista',
                               'Antes de uma mudança chegar a estas páginas', 'Estas verificações provam', 'Hoje entradas têm pelo menos',
                               'Quando um campo da origem de um número', 'O registo público das correções', 'Quem encontrar um erro escreve para',
                               'O que se mede a seguir decide-se', 'Os estudos de Évora abrem', 'Não classifica partidos']},
    'en': {'divulgacao': ['The work is divided into three roles', 'Building and reading are always done by different families of systems',
                          'A new value of the same measure, in the same format and from the same source'],
           'autorreferencia': ['How these pages are made, checked and corrected', 'The numbers on these pages come from official sources',
                               'The press', 'Every published number is in a single list', 'Beside every measurement there is a seal',
                               'Today the list has entries', 'The receipt includes code', 'These pages are generated from that list',
                               'Before a change reaches these pages', 'These checks prove', 'Today entries have at least', 'When a field in a number',
                               'The public register of corrections', 'Anyone who finds an error writes to', 'What gets measured next is decided',
                               'The Évora studies open', 'It does not rank or classify parties']},
}
# As quatro primeiras recusas (a decisão do ME1-21): a quinta já tem linha viva desde o S1-c.
RECUSAS = {
    'pt': ['Este projeto não aceita dinheiro de nenhuma entidade que mede', 'Este projeto não escreve para ter leitores a mais',
           'Este projeto não publica um número que não tenha lido na fonte', 'Este projeto não chama jornalista à inteligência artificial'],
    'en': ['This project takes no money from any entity it measures', 'This project does not write to gain more readers',
           'This project publishes no figure it has not read at the source', 'This project does not call artificial intelligence a journalist'],
}
ORDINAIS = ['primeira', 'segunda', 'terceira', 'quarta']
# A frase nova da escala do fecho (a leitura a frio do Codex, o achado 11).
ESCALA_NOVA = {'pt': 'Nos mapas, os valores onde a cor muda são números redondos', 'en': 'On the maps, the values where the colour changes are round numbers'}
RAZAO_DA_ESCALA_NOVA = {
    'pt': ('A frase da escala do fecho do Método, em palavras correntes (a leitura a frio do Codex, 15.10.2026, o achado 11, e a '
           'leitura curta da passagem de correção, o achado 7); a antiga, do bloco dominio, e a redação intermédia passaram a retiradas.'),
    'en': 'A mesma frase na edição inglesa (o achado 11 da leitura a frio e o achado 7 da leitura curta).',
}
# A redação intermédia da escala, que a leitura curta leu como um termo ainda por explicar: fica como retirada.
ESCALA_INTERMEDIA = [
    ('autorreferencia', 'Nos mapas, as classes da escala são números redondos escolhidos por este projeto, e não um limite oficial.'),
    ('autorreferencia', 'On the maps, the scale classes are round numbers chosen by this project, not an official limit.'),
]
RAZAO_DA_ESCALA_INTERMEDIA = ('ME1 (15.10.2026), a leitura curta da passagem de correção pelo Codex, o achado 7: «as classes da escala» '
                              'era um termo ainda por explicar para um leitor de primeira vez, e a frase viva diz «os valores onde a cor muda».')
RAZAO_DO_MANDATO = 'O Método para o leitor (o mandato ME1, palavra por palavra).'
def razao_da_recusa(lingua, n):
    if lingua == 'en':
        return f'A {ORDINAIS[n]} recusa do Método na edição inglesa (a decisão do ME1-21, 15.10.2026).'
    return (f'A {ORDINAIS[n]} recusa do Método, de `POLITICA.recusas` em `src/data/politica-ia.mjs`, na página desde antes '
            'do bloco ME1 e sem portão que a prendesse (a questão ME1-21); entra viva pela decisão do lugar de direção de '
            '15.10.2026, com a amarra das decisões a carimbar o módulo.')

for lingua, rota in (('pt', '/metodo'), ('en', '/en/method')):
    casa, voz = linhas_da_rota(rota)
    for t in TITULOS[lingua]:
        assert t in casa, f'{rota}: o título «{t}» não é um bloco da régua'
        NOVAS.append(('navegacao', t, RAZAO_DO_MANDATO))
    for classe in ('divulgacao', 'autorreferencia'):
        for inicio in INICIOS[lingua][classe]:
            fonte = voz if inicio in PELA_VOZ[lingua] else casa
            achados = [t for t in fonte if t.startswith(inicio)]
            if len(achados) != 1:
                raise SystemExit(f'{rota}: «{inicio}…» é {len(achados)} bloco(s) da leitura que lhe cabe')
            if tem_numero_que_muda(achados[0]):
                raise SystemExit(f'{rota}: «{inicio}…» traz algarismos na forma escolhida')
            NOVAS.append((classe, achados[0], RAZAO_DO_MANDATO))
    for n, inicio in enumerate(RECUSAS[lingua]):
        achados = [t for t in casa if t.startswith(inicio)]
        if len(achados) != 1:
            raise SystemExit(f'{rota}: a recusa «{inicio}…» é {len(achados)} bloco(s) da medida 8')
        NOVAS.append(('divulgacao', achados[0], razao_da_recusa(lingua, n)))
    inicio = ESCALA_NOVA[lingua]
    achados = [t for t in casa if t.startswith(inicio)]
    if len(achados) != 1:
        raise SystemExit(f'{rota}: a frase nova da escala «{inicio}…» é {len(achados)} bloco(s) da medida 8')
    NOVAS.append(('autorreferencia', achados[0], RAZAO_DA_ESCALA_NOVA[lingua]))
vistos = set()
saida = []
for classe, t, razao in NOVAS:
    if t in vistos:
        continue
    vistos.add(t)
    assert '|' not in t and '|' not in razao
    saida.append(f'| {classe} | {t} | me1 | viva | {razao} |')
for classe, t in ESCALA_INTERMEDIA:
    assert t not in vistos, 'a redação intermédia da escala voltou à página'
    saida.append(f'| {classe} | {t} | me1 | retirada | {RAZAO_DA_ESCALA_INTERMEDIA} |')

secao = [
    '',
    '## ME1 · o Método para o leitor (15.10.2026)',
    '',
    '*O Método passa a nove secções em palavras correntes, pela ordem do mandato',
    '`design/observatorio/mandatos/MANDATO-ME1-2026-10-15.md`. O Método não é uma rota medida (a Emenda 15 isenta-o da',
    'contagem e dos blocos por classificar), e estas linhas entram para provar que os blocos novos se rendem e para',
    'que uma frase mudada sem passar por aqui feche a construção: os títulos das secções novas (navegação), os',
    'parágrafos da primeira secção, que é a política (divulgação, como as linhas da H4 que substituem), e os das',
    'outras secções (a autorreferência que o Método pode ter). O texto é o que a régua lê, tirado das páginas',
    'construídas por `design/especime-v3/medicoes/me1-2026-10-15/inventario-me1.py` e não datilografado: um parágrafo',
    'com contagens da prova entra pela forma da varredura da voz, sem os números, porque uma linha com uma contagem',
    'por dentro deixava de se render na primeira atualização dos dados. As linhas que o Método deixou de render',
    'passaram a «retirada», com a razão, salvo os dois títulos «O livro-razão» e «The ledger», que saíram do',
    'ficheiro: são palavras correntes de outras páginas e não podiam ser sentinelas. Pela decisão do lugar de',
    'direção sobre a questão ME1-21, entram também as quatro primeiras recusas do Método, nas duas edições, que',
    'estavam na página desde antes do bloco sem portão que as prendesse; a quinta tem linha desde o S1-c. E, pela',
    'leitura a frio do Codex (o achado 11), a frase da escala do fecho em palavras correntes, que substitui a do',
    'bloco dominio, retirada; a redação intermédia dessa frase, que a leitura curta da passagem de correção leu como',
    'ainda por explicar (o achado 7), fica aqui como retirada.*',
    '',
    '| classe | texto | bloco | estado | razão |',
    '| --- | --- | --- | --- | --- |',
    *saida,
    '',
]
corpo = '\n'.join(novas_linhas)
CABECA_DA_SECCAO = '## ME1 · o Método para o leitor (15.10.2026)'
if CABECA_DA_SECCAO in corpo:
    # a secção é a última do ficheiro: reescreve-se dela até ao fim
    corpo = corpo[:corpo.index(CABECA_DA_SECCAO)].rstrip('\n') + '\n'
    assert '| me1 |' not in corpo, 'há linhas do bloco me1 fora da sua secção'
final = corpo.rstrip('\n') + '\n' + '\n'.join(secao)
INV.write_text(final, encoding='utf-8')
print(json.dumps({'sairam_do_ficheiro': len(sairam), 'retiradas': len(retiradas), 'novas': len(saida)}, ensure_ascii=False))
