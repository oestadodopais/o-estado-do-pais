# -*- coding: utf-8 -*-
"""As linhas do inventário que o bloco `lugar` reclassifica ou acrescenta."""
import io, sys

P = 'design/especime-v3/INVENTARIO-FRASES.md'
s = io.open(P, encoding='utf8').read()

RAZAO = {
  'vocabulario': ('o vocabulário fechado do sítio (`DECISIONS.md` §1.98, segunda emenda, item 2, '
                  'pela delegação do diretor de 04.09.2026): a palavra visível do território é '
                  '«concelho», o trabalho de autor é um «estudo», e quem tem a dívida e presta '
                  'contas é a câmara, que é o organismo e não o território'),
  'definicao': ('a frase de identidade passou a ser a frase de DEFINIÇÃO do sítio '
                '(`DECISIONS.md` §1.98, segunda emenda, item 3): diz as três maneiras de ler o '
                'sítio e a origem de cada número, que é o que a leitura de um leitor de primeira '
                'vez mediu em falta'),
}

def retira(texto, razao):
    """Marca uma linha `viva` como `retirada`, com o bloco e a razão."""
    global s
    achou = None
    for linha in s.split('\n'):
        if linha.startswith('| ') and f'| {texto} | ' in linha and linha.rstrip().endswith('| viva | — |'):
            achou = linha
            break
    if achou is None:
        print(f'!!! não achei viva: {texto[:70]}'); sys.exit(1)
    classe = achou.split('|')[1].strip()
    nova = f'| {classe} | {texto} | lugar | retirada | {RAZAO[razao]} |'
    s = s.replace(achou, nova, 1)

def acrescenta(classe, texto, depois_de):
    """Acrescenta uma linha `viva` do bloco `lugar` a seguir a outra."""
    global s
    alvo = None
    for linha in s.split('\n'):
        if linha.startswith('| ') and f'| {depois_de} | ' in linha:
            alvo = linha
            break
    if alvo is None:
        print(f'!!! não achei âncora: {depois_de[:70]}'); sys.exit(1)
    s = s.replace(alvo, alvo + '\n' + f'| {classe} | {texto} | lugar | viva | — |', 1)

PARES = [
  # (classe, antes, depois, razão)
  ('navegacao', 'Um observatório de Portugal.',
   'Um observatório de Portugal: cada número com a sua fonte, lido por território, por domínio e em estudos.', 'definicao'),
  ('navegacao', 'An observatory of Portugal.',
   'An observatory of Portugal: every number with its source, read by territory, by domain and in studies.', 'definicao'),
  ('navegacao', 'Município', 'Concelho', 'vocabulario'),
  ('navegacao', 'Municípios', 'Concelhos', 'vocabulario'),
  ('conteudo', 'A última prestação de contas do município', 'A última prestação de contas da câmara', 'vocabulario'),
  ('conteudo', 'O município publica', 'A câmara publica', 'vocabulario'),
  ('conteudo',
   'O que o município orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números do próprio município sobre si mesmo: a prestação de contas é dele.',
   'O que a câmara orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números da própria câmara sobre si mesma: a prestação de contas é dela.',
   'vocabulario'),
  ('conteudo', 'Os trabalhos sobre este concelho', 'Os estudos sobre este concelho', 'vocabulario'),
  ('conteudo',
   'Lista anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios.',
   'Lista anual da Direção-Geral das Autarquias Locais, que publica os dados das contas das câmaras.',
   'vocabulario'),
  ('conteudo',
   'Série anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. Exclui dívidas não orçamentais e exceções legais.',
   'Série anual da Direção-Geral das Autarquias Locais, que publica os dados das contas das câmaras. Exclui dívidas não orçamentais e exceções legais.',
   'vocabulario'),
  ('conteudo',
   'A Direção-Geral das Autarquias Locais e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena.',
   'A Direção-Geral das Autarquias Locais e a câmara publicam a dívida do mesmo ano com uma diferença. A diferença é pequena.',
   'vocabulario'),
  ('conteudo', 'trabalhos no arquivo', 'estudos no arquivo', 'vocabulario'),
  ('conteudo', 'works in the archive', 'studies in the archive', 'vocabulario'),
  ('conteudo', 'Os trabalhos', 'Os estudos', 'vocabulario'),
  ('navegacao', 'Mapa de pontos dos municípios de Portugal.', 'Mapa de pontos dos concelhos de Portugal.', 'vocabulario'),
  ('conteudo',
   'O que as fontes publicam sobre o município de <lugar>: população, poder de compra, emprego, empresas, dívida e execução orçamental.',
   'O que as fontes publicam sobre o concelho de <lugar>: população, poder de compra, emprego, empresas, dívida e execução orçamental.',
   'vocabulario'),
]

for classe, antes, depois, razao in PARES:
    retira(antes, razao)
    acrescenta(classe, depois, antes)

io.open(P, 'w', encoding='utf8').write(s)
print(f'{len(PARES)} pares reclassificados')
