+++ cabeca
id = "2026-11-16-peca-de-ensaio"
tipo = "diario"
titulo = "Peça de ensaio com números inventados: o índice de ensaio subiu para {indice}"
entrada = "Uma peça de ensaio, com números inventados, escrita para provar o esqueleto. [O índice de ensaio subiu]{diferenca} face ao trimestre anterior."
temas = ["ensaio"]

[encomenda]
pergunta = "O esqueleto constrói uma peça de ensaio com todas as suas partes?"
porque_hoje = "É a peça de ensaio do primeiro bloco do esqueleto."
largar_se = "Se uma das dez conferências não morder a sua planta."
+++ corpo
Esta é uma peça de ensaio. Todos os números são inventados e nenhum documento citado existe.

O índice de ensaio ficou em {indice} no terceiro trimestre, segundo [o documento de ensaio publicado na segunda-feira, 16 de novembro]{indice}. No trimestre anterior ficara em {indice_anterior}, [uma subida de]{diferenca} {diferenca}.

[A tabela de ensaio]{total} dá um total de {total}, e {terco} dos inquiridos de ensaio responderam.

A Pessoa de Ensaio, [ministra de ensaio]{declaracao}, disse {declaracao}. [O despacho de ensaio foi assinado]{despacho} pela mesma ministra.

## A leitura deste projeto

Nesta peça de ensaio, a leitura é só uma: [o índice de ensaio subiu]{diferenca}, e só nestes números inventados.

## A objeção mais forte

A objeção de ensaio diz que um trimestre não chega para ver uma tendência. Este ensaio concede-a.

## O que seguir

[A próxima edição de ensaio sai a 16 de fevereiro de 2027]{proxima}.
+++ folha
[[fonte]]
id = "doc_pdf"
titulo = "Documento de ensaio com números inventados"
editor = "Editor de ensaio"
url = "https://example.org/ensaio/documento.pdf"
url_final = "https://example.org/ensaio/documento.pdf"
lido_em = "2026-11-16T08:12:44Z"
http = 200
tipo_conteudo = "application/pdf"
bytes = 1967
sha256 = "3f9a602b9c8e9f75b8fdd9e63aadddfae0a1776aa4a31241b567946b3add3e89"
publicado_em = "2026-11-16"

[[fonte]]
id = "tabela_html"
titulo = "Tabela de ensaio com números inventados"
editor = "Editor de ensaio"
url = "https://example.org/ensaio/tabela.html"
url_final = "https://example.org/ensaio/tabela.html"
lido_em = "2026-11-16T08:20:05Z"
http = 200
tipo_conteudo = "text/html"
bytes = 564
sha256 = "29503ef83196bddecc5c55648890d537fb94747865f8c07997ef8c996e39739b"
publicado_em = ""

[[linha]]
id = "indice"
tipo = "valor"
fonte = "doc_pdf"
onde = "p. 2, primeiro parágrafo"
excerto = '''O índice de ensaio fixou-se em 104,7 pontos no terceiro trimestre'''
valor = "104.7"
unidade = "pontos"
mede = "Índice de ensaio, inventado para os ensaios"
populacao = "Nenhuma: é um índice de ensaio"
periodo = "Terceiro trimestre de ensaio"
provisorio = true
mostra = "104,7 pontos"

[[linha]]
id = "indice_anterior"
tipo = "valor"
fonte = "doc_pdf"
onde = "p. 2, primeiro parágrafo"
excerto = '''contra 102,3 pontos no segundo trimestre'''
valor = "102.3"
unidade = "pontos"
mede = "Índice de ensaio, inventado para os ensaios"
populacao = "Nenhuma: é um índice de ensaio"
periodo = "Segundo trimestre de ensaio"
provisorio = false
mostra = "102,3 pontos"

[[linha]]
id = "diferenca"
tipo = "derivado"
calculo = "round ( indice - indice_anterior , 1 )"
valor = "2.4"
unidade = "pontos"
mede = "Diferença do índice de ensaio entre dois trimestres"
periodo = "Segundo e terceiro trimestres de ensaio"
compara = "A mesma medida, a mesma unidade e a mesma população de ensaio, sem quebra de série"
mostra = "2,4 pontos"

[[linha]]
id = "total"
tipo = "valor"
fonte = "tabela_html"
onde = "tabela"
excerto = '''Total de ensaio: 1 234 567 euros'''
valor = "1234567"
unidade = "euros"
mede = "Total de ensaio, inventado para os ensaios"
populacao = "Nenhuma: é um total de ensaio"
periodo = "Ano de ensaio"
provisorio = false
mostra = "1,2 milhões de euros"

[[linha]]
id = "terco"
tipo = "valor"
fonte = "tabela_html"
onde = "segundo parágrafo"
excerto = '''Responderam 33,3 % dos inquiridos de ensaio, um terço da amostra.'''
valor = "33.3"
unidade = "%"
mede = "Inquiridos de ensaio que responderam"
populacao = "Inquiridos de ensaio"
periodo = "Ano de ensaio"
provisorio = false
mostra = "um terço"
mostra_livre = true

[[linha]]
id = "declaracao"
tipo = "citacao"
fonte = "tabela_html"
onde = "último parágrafo"
excerto = '''As contas de ensaio estão certas'''
quem = "pessoa_de_ensaio"
entidade = ""
quando = "2026-11-12"

[[linha]]
id = "despacho"
tipo = "ato"
fonte = "doc_pdf"
onde = "p. 1"
excerto = '''O despacho de ensaio foi assinado a 12 de novembro de 2026.'''
diz = "O despacho de ensaio foi assinado pela ministra de ensaio."
quem = "pessoa_de_ensaio"
quando = "2026-11-12"

[[linha]]
id = "proxima"
tipo = "ato"
fonte = "doc_pdf"
onde = "p. 2"
excerto = '''A próxima edição de ensaio sai a 16 de fevereiro de 2027.'''
diz = "A próxima edição de ensaio tem data marcada."
quem = ""
quando = "2026-11-16"

[[pessoa]]
id = "pessoa_de_ensaio"
nome = "Pessoa de Ensaio"
nome_curto = ""
cargo = "ministra de ensaio"
linhas = ["declaracao", "despacho"]
+++ registo

[[passo]]
nome = "encomenda"
lugar = "direcao"
familia = "anthropic"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T08:00:00Z"
fim = "2026-11-16T08:05:00Z"

[[passo]]
nome = "reportagem"
lugar = "reporter"
familia = "anthropic"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T08:05:00Z"
fim = "2026-11-16T08:40:00Z"

[[leitura]]
lugar = "numeros"
familia = "openai"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T08:45:00Z"
fim = "2026-11-16T09:05:00Z"
impressao = "9bd6d62c3f59f90475bcdbefe04b2a17e717990f105f4bab6925d277483f20d1"
plantas_postas = 3
plantas_apanhadas = 3
achados = 1
adotados = 1
veredicto = "passa"

[[passo]]
nome = "escrita"
lugar = "redator"
familia = "anthropic"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T09:10:00Z"
fim = "2026-11-16T09:40:00Z"

[[passo]]
nome = "edicao"
lugar = "direcao"
familia = "anthropic"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T09:40:00Z"
fim = "2026-11-16T09:55:00Z"

[[leitura]]
lugar = "justica"
familia = "openai"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T10:00:00Z"
fim = "2026-11-16T10:10:00Z"
impressao = "e669aa751d4354e1018d215270eb145410cabb62107e7c932fa19a902a44212e"
plantas_postas = 2
plantas_apanhadas = 2
achados = 0
adotados = 0
veredicto = "passa"
pessoas_vistas = ["Pessoa de Ensaio"]

[[leitura]]
lugar = "juiz"
familia = "openai"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T10:00:00Z"
fim = "2026-11-16T10:25:00Z"
impressao = "e669aa751d4354e1018d215270eb145410cabb62107e7c932fa19a902a44212e"
plantas_postas = 3
plantas_apanhadas = 3
achados = 1
adotados = 1
veredicto = "passa"
pessoas_vistas = ["pessoa_de_ensaio"]

[[estado]]
estado = "publicada"
em = "2026-11-16T10:40:00Z"
por = "python3 -m oedp estado"
razao = "Peça de ensaio, publicada só nos ensaios do esqueleto."

[[leitura]]
lugar = "justica"
familia = "openai"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T11:00:00Z"
fim = "2026-11-16T11:06:00Z"
impressao = "04caca8b3aad3f076a27ee754c680c97a5c401f2e21439c7b7524fa29bd27cbf"
plantas_postas = 1
plantas_apanhadas = 1
achados = 0
adotados = 0
veredicto = "passa"
pessoas_vistas = ["pessoa_de_ensaio"]

[[leitura]]
lugar = "juiz"
familia = "openai"
modelo = "modelo-de-ensaio"
inicio = "2026-11-16T11:00:00Z"
fim = "2026-11-16T11:12:00Z"
impressao = "04caca8b3aad3f076a27ee754c680c97a5c401f2e21439c7b7524fa29bd27cbf"
plantas_postas = 2
plantas_apanhadas = 2
achados = 0
adotados = 0
veredicto = "passa"
pessoas_vistas = ["pessoa_de_ensaio"]

[[correcao]]
em = "2026-11-16T11:20:00Z"
especie = "correcao"
antes = "escrita para ensaiar o esqueleto"
depois = "escrita para provar o esqueleto"
razao = "Correção de ensaio, feita para provar a página das correções."
causa = "juiz"
impressao_antes = "e669aa751d4354e1018d215270eb145410cabb62107e7c932fa19a902a44212e"
impressao_depois = "04caca8b3aad3f076a27ee754c680c97a5c401f2e21439c7b7524fa29bd27cbf"
