# Direção A · Refinamento

## A ideia

Esta identidade já existe e está quase certa. A pergunta que a direção A responde
é até onde ela chega sem trocar nenhuma das suas peças: as mesmas três famílias
de tipos, os mesmos treze valores de cor, as mesmas três disposições, as mesmas
três camadas, o mesmo selo ao lado de cada valor. O que muda é o que se decide
depois de as peças estarem escolhidas: o ritmo, a hierarquia, a densidade, a
disciplina da grelha, e o lugar de cada coisa.

Uma auditoria a 13.08.2026 encontrou 42% da folha de estilo debaixo de secções
sem correspondência no estudo, e a explicação foi seis tipos de página resolvidos
um a um. A direção A trata a causa: dá nome ao que estava espalhado por
literais, para que o sétimo tipo de página não precise de decidir outra vez.

## O tipo

Nenhuma família nova, nenhum tipo pedido à rede, nenhum byte de tipografia.
Serifada só na marca, monoespaçada em valores e mobília, sem serifa na prosa.

O que muda é a escala. A folha do sítio usa doze corpos entre 9,5px e 18px,
muitos a meio ponto uns dos outros; meio ponto não é hierarquia, é ruído. A
direção A fixa quatro degraus por família e um corpo para cada função, e um
corpo que não esteja na escala passa a ser um defeito e não um gosto. Um dos
tetos é medido e não escolhido: o valor de um mosaico não pode passar de 38px
porque é esse o corpo a que dez algarismos monoespaçados cabem na célula mais
estreita da grelha de quatro colunas, e o valor mais longo do sítio é uma dívida
municipal em euros.

Custo por não trocar de tipos: nos sistemas em que «Iowan Old Style» e «Avenir
Next» não existem, a marca cai em Georgia e a prosa em Segoe UI, e a identidade
é outra. A direção A não resolve isso e diz que não resolve. A opção existe e
está orçada abaixo.

## A cor

Zero alterações de valor, nos três estados do tema. O que passa a estar escrito
é o significado de cada papel, que hoje se aprende a ler a folha:

- `--paper` a página e a leitura · `--paper-2` um objeto medido (um mosaico, um
  instrumento, o bloco da prova) · `--paper-3` um estado pequeno e local (o
  quadrado cheio do selo, o fundo do marcador, uma célula vazia).
- O aparelho deixa de ter chão: recua por corpo e por `--muted`, e o chão fica
  reservado ao que foi medido. Antes, a leitura e o aparelho partilhavam
  `--paper-2` e pesavam o mesmo.

Contrastes, recalculados por mim a partir dos valores (não copiados da folha):
tinta sobre papel 17,17:1 claro e 15,99:1 escuro; `--muted` sobre papel 6,28:1
claro e 6,85:1 escuro, e 5,47:1 no fundo mais escuro dos três, o que passa AA
para texto normal em todos os casos. O oxblood dá 9,45:1 e 7,22:1, que são
exatamente os valores que a folha do sítio declara. Nada é impresso sobre o
amarelo em nenhuma página: em tema escuro a tinta sobre amarelo daria 1,77:1, e
por isso a marca de medição continua a ser só marca.

## O ritmo, a grelha e a densidade

Sete degraus de espaço (4 a 56) e três pesos de fio, com uma regra nova: o fio
de página (1,5px a tinta) emoldura a página, fecha o cabeçalho e abre o rodapé,
e mais nada. Hoje esse fio aparece três vezes por página e nenhuma delas ganha.

A grelha fecha a aritmética. Oito mosaicos rendem em quatro colunas, duas ou
uma, e nunca em três mais três mais dois com uma célula vazia, que é o que a
grelha automática de hoje faz entre cerca de 845 e 1 122 pixels de janela (conta
feita sobre a regra `repeat(auto-fit, minmax(258px, 1fr))` e a goteira da folha,
não medida no navegador). É a regra 7 da identidade aplicada onde ela falha.

Dentro do mosaico, o espaço passa a agrupar: o nome cola-se ao valor, a unidade
cola-se ao nome, a frase afasta-se, e o selo desce ao pé da célula com um fio
por cima. Os oito selos de uma grelha ficam alinhados na mesma linha de base,
que é o que faz a grelha parecer uma tabela e não oito cartões soltos.

## O selo

É a peça central desta direção, e a única mudança de substância.

Hoje o selo mostra o título do estudo («Quadro institucional de indicadores,
leitura direta da fonte») e esconde num elemento invisível as palavras que dizem
o que ele faz. O resultado é que o leitor vê uma legenda comprida, repetida
dezenas de vezes, e não vê uma porta. Na página de Évora isso são 91 selos e
3 805 caracteres de título de estudo impressos na página; na primeira página,
2 175. Uma frase com quatro medições fica com quatro legendas de quarenta
caracteres pelo meio, e deixa de se ler como frase.

Na direção A o selo mostra a palavra **fonte**, sublinhada, com o quadrado ao
lado, e guarda o título do estudo num filho nomeado (`data-selo-etiqueta`) para
o portão e para quem lê com leitor de ecrã. O texto continua no HTML rendido, e
por isso a conferência que compara a etiqueta do selo com a rendição daquela
linha continua a poder correr; o que muda é onde ela a lê. Depois desta troca,
o título de estudo impresso passa a 276 caracteres em Évora e 45 na primeira
página, e sobra onde ele é informação e não mobília: no relance de um
instrumento e na legenda de portas de um desenho, onde o selo tem forma longa.

Os dois estados continuam desenhados e agora aparecem lado a lado na regra 5 do
Método, que é a página que os explica: quadrado cheio quando a proveniência está
completa, quadrado a tracejado com o marcador quando falta um campo.

O sublinhado é permanente, e é uma inversão deliberada de uma decisão da casa
(«sessenta e dois sublinhados numa página de índice seriam ruído»). O argumento
mudou porque a palavra mudou: sublinhar quarenta caracteres de título de estudo
é ruído; sublinhar cinco letras é a única coisa que diz ao leitor, sem gesto
nenhum, que aquilo abre. O selo não leva seta: a seta da casa é a de «Abrir a
leitura →», e reservar-lhe espaço abria um buraco no meio das frases.

Onde o selo está sozinho (mosaico, relance, legenda de desenho) tem alvo de
toque declarado nas fichas de valor; dentro de uma frase não tem, porque ali
partiria a entrelinha.

## O marcador

Continua a ser um só, `[a verificar]`, numa só classe. O que muda é que passa a
ser porta para `/a-verificar` onde está sozinho, que é a promessa que a
identidade faz e o sítio ainda não construiu em todo o lado. Dentro do selo
continua a ser texto e não ligação, porque uma âncora não entra dentro de outra;
ali a porta é a do próprio selo, e a linha diz o que lhe falta.

## A página de uma linha, como recibo

A ordem de hoje é: valor, excerto, histórico, e uma ficha de proveniência ao
lado. A ordem da direção A é a do recibo:

1. **O valor**, grande, com a unidade, e uma frase em palavras por baixo:
   «Publicado por Eurostat, na série House price index, nominal - annual data,
   edição tipsho20. Lido a 2026-08-12, com dados de 2025.» Os campos continuam
   marcados um a um (`data-linha-campo`), e por isso a comparação carácter a
   carácter do portão continua a valer onde quer que o campo esteja posto.
2. **A prova**: o recorte da linha impressa, a porta para a página do documento,
   o campo devolvido tal como a fonte o devolve, e por baixo o pedido exato.
   O recorte e a porta ainda não têm dados (`document.page` e `document.crop`
   são o bloco T), e por isso estão desenhados como caixas de exemplo, com o
   traço a tracejado e sem um único algarismo dentro.
3. **Verificações**: lido a, dados de, e reconferido a. O terceiro é uma caixa
   de exemplo pela mesma razão, e por baixo está a frase que o Método já publica
   sobre isso, com a porta para a regra.
4. **Correções e atualizações desta linha**, como hoje.
5. O aparelho, à direita e mais leve: a ficha de proveniência, o estado, a porta
   das correções, e o lugar desenhado para esta linha em JSON.

O que isto muda para quem chega de uma pesquisa: a primeira coisa que vê é o
valor e de onde ele veio dito por palavras, e a segunda é a prova. A ficha de
campos, que é o que hoje ocupa o primeiro terço do olhar, passa a ser o que é:
o aparelho.

## O cabeçalho como sinal de tempo

O cabeçalho já perdeu a data de edição. O que a direção A faz é desenhá-lo com
intenção: as duas leituras deixam de ser uma tira de versaletes corridos e
passam a ser duas leituras de instrumento, cada uma com o seu rótulo pequeno em
cima e o seu valor em monoespaçada tabular por baixo, alinhadas na mesma linha
de base, debaixo do único fio de página do cabeçalho. Lê-se como um mostrador,
que é o que é, e não como uma linha de mobília de jornal.

## Os quatro leitores do BRIEF, parte 4

**Cidadão de um concelho.** Ganha a página do município mais legível: os oito
mosaicos com o valor a caber (a dívida municipal em euros deixa de transbordar
da célula), a leitura breve sem quarenta caracteres de legenda a cada número, e
o aparelho («o que esta página não sabe») recuado para a coluna leve em vez de
competir com a leitura. O que ele não ganha aqui é uma página para o seu
concelho: isso é conteúdo, não desenho.

**Jornalista.** O selo diz «fonte» e sublinha-se, por isso vê-se que abre; o
estado a tracejado com o marcador ao lado distingue à distância o que é citável
do que está em dívida; e a página da linha põe a prova em primeiro lugar, com o
recorte e a porta para a página do documento desenhados no sítio onde vão ficar.
Enquanto o recorte não existir, ele continua a receber um excerto transcrito, e
a caixa de exemplo diz-lhe isso em vez de o esconder.

**Investigador.** A página da linha ganha um bloco de verificações com data de
leitura e lugar declarado para a releitura independente, e um lugar desenhado
para a linha em JSON. A frase de origem em palavras é citável tal como está.

**Trabalhador do município.** A porta das correções está nas cinco páginas
prototipadas, incluindo a página da linha, que é onde ele mais provavelmente
aterra; e está na coluna do aparelho, à altura do olhar, não no fim da página.

## As nove provas de aceitação (BRIEF §6.8)

| | Prova | Resultado | Onde se vê |
|---|---|---|---|
| 1 | Qualquer número à linha impressa em ≤ 1 clique, sem descarregar mais de 1 MB | **parcial** | O desenho põe o recorte e a porta da página no topo de `02-linha.html`, a um clique do selo. Os dados não existem (`document.page`, `document.crop`), e por isso são caixas de exemplo. O desenho passa; a linha ainda não. |
| 2 | Porta das correções a 0 cliques em qualquer página | **passa** | Nas cinco páginas, uma ocorrência de `data-porta-correccoes` com o endereço à vista. |
| 3 | Data da última leitura e da última releitura independente, visíveis na linha | **parcial** | O bloco «Verificações» tem as duas linhas. A segunda não tem campo no formato, e o Método já publica que a conta é zero por isso; a caixa de exemplo está no lugar do campo. |
| 4 | Frases de moldura ≤ 12 distintas, meta-comentário 0 | **parcial, e mede-se** | Não é uma prova de desenho e a direção A não reescreve texto nenhum. O que ela faz é mensurável: o título de estudo impresso nos selos passa de 2 175 para 45 caracteres na primeira página e de 3 805 para 276 em Évora, sem perder uma única porta nem uma única etiqueta para o portão. |
| 5 | Índice de `/municipios` com os 308 concelhos em estado honesto | **não abordado** | Não é uma das cinco páginas. O estado vazio de que esse índice precisa está desenhado (`.mun-campo-vazio` e a caixa de exemplo) e é reutilizável. |
| 6 | `/agenda` com pelo menos três itens, cada um com o seu critério | **passa** | `05-agenda.html`: cinco itens, quatro estados com a sua contagem, dez critérios no item da habitação, e o calendário das fontes com dezasseis acontecimentos. |
| 7 | Teste dos dois minutos 4/4 | **parcial** | (a) o que o sítio é: a linha de método e o sinal de tempo dizem-no, mas a primeira página não o explica em prosa e a direção A não acrescenta prosa. (b) o concelho: fora destas páginas. (c) abrir um estudo: fora destas páginas. (d) quando foi conferido e como corrigir: melhora, e é o único dos quatro que este desenho move sozinho. |
| 8 | `[descrição em preparação]` a zero; primeira página com todos os valores selados na sua própria linha | **passa, com a nota do desenho** | O segundo marcador não existe em nenhuma página construída (procura sobre `dist/`: zero ficheiros). Em `01-primeira.html`, os 28 valores estão todos selados: 26 com selo ao lado, e os 2 desenhados dentro do SVG cobertos por legenda de portas, que é a convenção da identidade §10. Em `03-municipio.html`, 91 valores e 91 selos, com 6 valores de SVG cobertos por legenda. |
| 9 | Zero endereços de fonte a falhar, ou cada falha com a sua atualização e cópia fixada | **não abordado** | É trabalho de dados. O desenho dá ao endereço um lugar declarado («Pedido») e ao histórico da linha o bloco onde uma atualização de endereço aparece. |

Duas destas respostas (1 e 3) são «parcial» pelo mesmo motivo, e é um motivo
bom: a direção desenha o sítio onde o bloco T vai pôr os dados, em vez de fingir
que já os tem.

## O que custa

**Tipos: zero.** Nenhum ficheiro, nenhum pedido, nenhum byte. Se a direção quiser
fechar a diferença entre sistemas, a peça mais barata é um subconjunto da
serifada com os dezasseis glifos de «O Estado do País» alojado no próprio sítio,
que num WOFF2 fica na ordem de poucos quilobytes. Não está feito aqui e não
está orçado com um número, porque não medi nenhum ficheiro real: seria um
número inventado.

**Folha de estilo.** A folha desta direção, com os comentários, são 42 423 bytes
(`tokens.css` 7 894 + `_estilo.css` 34 529); apertada, 31 558. A folha do sítio
hoje são 62 204 bytes, 41 667 apertada. A comparação não é de igual para igual:
a minha cobre os cinco tipos de página prototipados, e a do sítio cobre todos.
O que é comparável é a densidade: a minha usa fichas de valor onde a do sítio
usa literais, e por isso encolhe quando um tipo de página novo entra em vez de
crescer.

**Componentes a mudar** (nomes de classe iguais aos do sítio, de propósito, e é
metade do custo desta direção):

1. `Provenance.astro`: a palavra «fonte» à vista, o título do estudo num filho
   `data-selo-etiqueta`, e uma variante longa.
2. O marcador passa a ligação onde está sozinho (uma linha em `Frase.astro` e
   nas páginas que o imprimem fora de um selo).
3. `LinhaView.astro`: a nova ordem, o bloco da prova, o bloco das verificações.
4. `Masthead.astro`: o sinal de tempo como pares de rótulo e valor.
5. A grelha dos mosaicos passa a colunas fixas, e `.figura` de grelha a caixa
   flexível para o selo assentar no pé.
6. Uma folha nova, e a passagem dos literais às fichas de valor.

**O que o portão tem de aprender.** Três coisas, todas pequenas e todas dentro
de conferências que já existem:

1. A etiqueta do selo lê-se em `[data-selo-etiqueta]`, e não no texto inteiro do
   elemento (que agora começa pela palavra «fonte»).
2. Um número do próprio sítio pode ter como porta uma âncora da própria página:
   é o caso das contagens de estado na agenda, cuja porta é a secção que elas
   contam.
3. As caixas `data-exemplo` são de protótipo e não podem chegar a uma página
   construída. É uma conferência nova de uma linha, ou uma entrada na lista
   fechada de motivos, conforme onde couber sem abrir portão novo.

**O que não custa nada.** Os textos decididos não se tocam. O Sobre, as dez
regras do Método, os limiares, os excertos e as ressalvas estão nos protótipos
tal como saem da construção de hoje, palavra por palavra.

## O que se corta se só metade for construído

Fica: **o selo**, **a página da linha como recibo** e **o recuo do aparelho**.
São os três que servem a promessa do sítio («a prova a um clique») e são os três
que o leitor sente.

Sai: a rebase da escala de tipo e de espaço, o desenho do sinal de tempo, e a
troca da grelha automática por colunas fixas. São melhorias reais, mas nenhuma
delas muda o que o leitor consegue confirmar; e a grelha, sozinha, pode ser
corrigida com duas linhas quando houver ocasião.

## Os limites desta direção, ditos aqui

- A direção A não escreve texto. Se o problema do sítio for o que ele diz de si
  próprio, esta direção não o resolve: apenas faz o texto existente pesar menos.
- Não toca em `/sobre`, nas páginas de leitura, no índice do livro-razão nem no
  índice dos municípios, que não são das cinco páginas prototipadas.
- Os protótipos não levam script, e por isso mostram o estado sem JavaScript dos
  dois instrumentos da primeira página: a régua com Portugal, e o mapa sem
  leitura ao passar o cursor. A frase que o sítio já publica sobre isso está lá.
- O contraste foi calculado; o comportamento com um leitor de ecrã real não foi
  ensaiado, e a ordem de leitura do bloco da prova é a única coisa que eu
  ensaiaria antes de construir.
