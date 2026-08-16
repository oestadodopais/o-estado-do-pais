# Direção C · Editorial generoso

Exploração de desenho, fase 2. Não está em uso no sítio. Cinco páginas reais,
redesenhadas com o texto e os números do sítio construído em `e897e06`.

## A ideia

O sítio lido como um livro de referência que por acaso traz um livro-razão.
Uma coluna de leitura larga, letra maior, muito ar, e o aparelho passado para a
margem: proveniência, ressalvas, contagens e o que a página não sabe deixam de
ser uma caixa que compete com a leitura e passam a ser **nota de margem**, na
letra da mobília, ao lado do parágrafo que anotam.

A pergunta que a direção responde é a do enunciado: e se a confiança viesse da
calma e da legibilidade em vez do aparelho. A resposta é que a prova não
desaparece, muda de peso: continua a um clique de qualquer valor, mas deixa de
gritar. Uma página que se lê sem esforço até ao fim é uma página onde a
proveniência foi lida; uma página que parece um painel de instrumentos é uma
página que se percorre com os olhos e se abandona.

## Tipo

Hoje são três famílias para três funções (IDENTIDADE §1): serifada só na marca,
sem serifa na prosa, monoespaçada nos valores. A função da serifada é uma
palavra por página.

Aqui são **duas famílias para as duas funções que a casa vende**:

| | Onde |
|---|---|
| `--f-leitura` (serifada) | a marca, os títulos, toda a prosa, as legendas, o Fundo |
| `--f-mono` | todo o valor medido, datas, rótulos, selos, marcador, eixos |

A sem serifa sai da página. Com a serifada na prosa, ela não tem função nenhuma
que não seja repetir. A distinção que passa a ver-se é «isto lê-se» contra
«isto mede-se», que é a distinção que o §1 já dizia ser o produto: uma frase
serifada com um número monoespaçado dentro dela lê-se como uma citação do
livro-razão no meio da prosa. O contraste entre as duas letras é maior do que o
que havia entre a sem serifa e a mono, e por isso o número salta mais.

**Nenhum ficheiro de tipo, nenhum pedido de rede, zero bytes.** As pilhas são as
que `src/styles/tokens.css` já declara (Iowan Old Style, Palatino, Georgia,
Times New Roman; SF Mono, Menlo, Consolas). A primeira página promete «Não faz
pedidos de rede», e uma direção que gastasse essa promessa numa fonte de
titulagem estaria a trocar o argumento pelo aspeto. O preço desta escolha é
que a cascata muda de máquina para máquina; `font-size-adjust` fixa a altura de
x aparente para que uma página em Georgia não pareça maior do que a mesma
página em Iowan Old Style.

Corpo a 19px, entrelinha 1,62, medida de 640px. A medida fixa-se em pixéis e
não em `ch` porque com serifada o `ch` encolhe e a linha ficava curta.

## Cor

**Muda só nos neutros.** O papel deixa de ser azulado e passa a ser quente
(`#fbfaf7`), a tinta passa a castanha-escura (`#1b1a17`), os fios aclaram e
aquecem. Razão: uma página que se lê durante minutos cansa menos num branco
quente, e nesta direção há mais fios do que caixas, porque o que separa passa a
ser uma linha e espaço em vez de um fundo.

**Os dois acentos não mexem, nem um dígito.** `--yellow: #e8a80c` continua a ser
a marca de medição e `--oxblood: #7c2333` o erro admitido. Mexer-lhes na matiz
obrigava o colofão da primeira página a mudar de frase («O amarelo #E8A80C é
reservado a marcas de medição»), obrigava o portão a aprender um valor novo, e
não ganhava nada: o que faz falta à leitura são os neutros.

Contrastes calculados sobre estes valores, não copiados (fórmula de luminância
relativa das WCAG 2, corrida sobre os pares que a folha usa):

| Par | Claro | Escuro |
|---|---|---|
| tinta sobre papel | 16,67:1 | 15,07:1 |
| `--muted` sobre papel | 6,87:1 | 6,64:1 |
| `--muted` sobre `--paper-3` | 5,66:1 | 5,73:1 |
| oxblood sobre papel | 9,38:1 | 7,10:1 |
| tinta sobre amarelo | 8,32:1 | 8,32:1 |
| `--axis` sobre papel (traço, não texto) | 3,56:1 | 3,45:1 |

Todo o texto passa AA com folga. O `--axis` é traço de instrumento e a exigência
é 3:1.

## O selo

Muda em três coisas, e nenhuma delas é o que ele faz.

1. **A palavra «fonte» passa a estar à vista.** Hoje o selo mostra o título de um
   estudo e esconde em `.vh` o que ele é; um leitor que vê «Avaliação Económica
   Regional de Portugal 2026» ao lado de um número não sabe que aquilo abre
   alguma coisa. Passa a ler-se `▪ fonte`.
2. **O título do estudo passa a detalhe.** Dentro de uma frase, o selo encolhe
   para o quadrado e a palavra: uma frase com quatro medições precisa de quatro
   portas, não de quatro títulos. Fora de frase (numa medida do painel, num
   recibo, numa legenda de desenho) o título fica à vista, porque ali há espaço
   e é ele que distingue uma linha da seguinte.
3. **O recibo mínimo é o mesmo elemento.** Ao passar o cursor ou ao chegar pelo
   teclado, o título deixa de estar escondido e passa a ser um cartão debaixo do
   selo. Um elemento, dois estados, nenhuma marcação a mais e nenhum JavaScript:
   é a regra do `.vh` invertida por CSS. Em toque, o selo faz o que sempre fez,
   que é abrir a linha.

O que não muda: é sempre uma âncora para a linha, e os dois estados continuam a
ser o quadrado cheio e o quadrado a tracejado (IDENTIDADE §5). Os dois aparecem
lado a lado na regra 5 do Método e no quadro.

**O marcador passa a ser porta.** `[a verificar]` mantém a classe e a forma
(mono, tracejado, o mesmo tracejado do selo incompleto: um sinal, duas
aparições) e passa a ligar a `/a-verificar`, que é a página que o explica. A
promessa do §6 era «uma página que o explica»; a um clique de onde o sinal
aparece é melhor do que a um clique de onde o sinal é listado. Dentro de um
selo continua a ser um `<span>`, porque uma âncora não entra dentro de outra.

## A linha do livro-razão como recibo

`02-linha.html`. De cima para baixo:

1. **O valor**, sozinho, grande, com a unidade e o id. É a camada Relance.
2. **A frase em palavras**: «Publicado pelo Eurostat, na série House price
   index, nominal - annual data (tipsho20). Lido a 2026-08-12. Dados de 2025.»
   Os valores são os campos da ficha; as palavras que os ligam são rótulos. O
   leitor lê uma frase em vez de decifrar uma tabela de sete linhas.
3. **A prova, degrau a degrau**, cada degrau com o rótulo na calha:
   - *Onde no documento* · o lugar do recorte da linha impressa, desenhado e
     vazio, com uma nota marcada «protótipo» a dizer porquê. O campo
     `document.crop` não existe no formato (bloco T); o lugar existe agora, para
     que o desenho não seja inventado no dia em que o campo chegar. Fica à vista
     em vez de desaparecer, porque um recibo que esconde o degrau que lhe falta
     não é um recibo.
   - *Campo devolvido* · o excerto transcrito, em mono, com um fio amarelo à
     esquerda: é medição, e o amarelo é a marca de medição.
   - *O pedido* · o endereço exato, para quem quiser repetir.
   - *Verificações* · «Lido a 2026-08-12» e «Reconferido a [a verificar]», com a
     frase do próprio Método a dizer porque é que o segundo está vazio. É o
     estado vazio desenhado (IDENTIDADE §7), não um bloco que não aconteceu.
   - *Correções e atualizações desta linha* · o registo, ou o seu estado vazio.
4. **A margem** leva a ficha, o estado da proveniência, o estudo, as portas para
   onde esta linha aparece noutro sítio, e a porta de correções. Hoje a página
   da linha não tem porta de correções nenhuma, e é a aterragem mais provável de
   um técnico municipal que chega de uma pesquisa.

## O que cada um dos quatro leitores recebe

**Cidadão de um concelho.** A página de Évora deixa de abrir com uma grelha de
ladrilhos e passa a abrir com oito medidas em lista editorial: o valor à
esquerda, o nome, a unidade, uma frase e a porta. Lê-se de cima a baixo como um
artigo. O aparelho («o que esta página não sabe», a proveniência, o método e as
ressalvas) sai do caminho para a margem e para o Fundo, sem perder um item.

**Jornalista.** O recibo dá-lhe, pela ordem em que precisa: o valor, a frase
citável com a atribuição já feita, o excerto transcrito, e o endereço. O selo
tracejado passa a ser inconfundível, porque o tracejado agora repete-se no
marcador, e o marcador leva à página que explica o que falta. O que continua a
faltar é o recorte, e isso é o bloco T.

**Investigador.** O id em mono debaixo do valor, os campos da ficha na margem
com os nomes do formato, os degraus da prova pela ordem do caminho, e as
descargas de dados mantidas no Fundo dos instrumentos. O que a direção não
resolve: séries, `lastmod`, JSON por linha.

**Técnico municipal.** A porta de correções está na margem de todas as cinco
páginas, incluindo a da linha. Vinte palavras, sempre as mesmas, sempre no
mesmo sítio.

## Os nove testes de aceitação (BRIEF §6.8), um a um

**1. Qualquer número → a linha impressa em ≤ 1 clique, sem descarregar mais de 1
MB.** · **Parcial.** O desenho faz a sua metade: o selo é uma porta ao lado de
cada valor, e a linha que ele abre põe a prova como primeiro bloco depois do
valor. Nos protótipos, dos 130 valores rendidos, 121 têm o selo ao lado e 8
estão dentro de um desenho e têm legenda de portas; o único sem porta é o valor
da própria linha em `02-linha.html`, que é a página onde ele vive. A metade que
falta não é de desenho: `document.crop` não existe, e por isso o que se vê é o
lugar do recorte, marcado «protótipo». Nenhum protótipo oferece um descarregar
de documento.

**2. Qualquer página → a porta de correções em 0 cliques.** · **Passa.** As cinco
páginas trazem a porta, com as mesmas palavras: na margem em `01`, `02` e `03`,
na faixa de fecho em `04` e `05`.

**3. Qualquer linha → data da última leitura e da última releitura independente,
à vista.** · **Parcial, e é a parte do desenho que está pronta.** O bloco
«Verificações» mostra «Lido a» com a data da linha e desenha «Reconferido a»
com o marcador e a razão. Quando `verifications[]` existir, o bloco enche-se sem
mudar de forma.

**4. Frases de moldura ≤ 12 distintas, meta-comentário 0.** · **Não é uma prova
que um desenho possa dar.** O que a direção pode prometer é não acrescentar
nenhuma, e não acrescenta: toda a prosa destes protótipos é copiada das páginas
construídas, e as palavras novas são rótulos de campo («A prova», «Onde no
documento», «O pedido», «Verificações», «Datas», «Portas»). A conferência conta
zero algarismos sem origem, o que é o mesmo mecanismo aplicado aos números.

**5. `/municipios` com as 308 entradas em estado honesto.** · **Fora do âmbito,
com a peça feita.** O índice não existe em `dist/` e não foi prototipado. O que
a direção lhe entrega é o estado vazio já desenhado: `mun-campo-vazio`, o selo
tracejado, o marcador com porta, e a lista editorial que serve tanto oito
medidas como uma só.

**6. `/agenda` viva com pelo menos três itens e o rastro de critério de cada
um.** · **Passa.** `05-agenda.html` rende os cinco itens dos quatro estados,
cada critério com o seu tipo, o quadro, as linhas do livro-razão com selo, o
limiar com o endereço e a data da leitura, mais o calendário das fontes inteiro,
com data ou com o marcador a dizer que a fonte não publica nenhuma.

**7. Teste dos dois minutos 4/4.** · **Parcial, e a direção move duas alíneas.**
(a) a linha de método fica colada à marca, no topo, e a porta para o Sobre está
na navegação e no rodapé de todas as páginas; a direção não escreve nem apaga as
duas frases do Sobre. (b) falha para 307 dos 308 concelhos, e é conteúdo, não
desenho. (c) é conteúdo. (d) é a alínea que a direção move: a data da leitura e
a porta de correções passam a estar em todas as páginas de linha, que é onde
faltavam.

**8. `[descrição em preparação]` = 0; primeira página com todos os valores
selados às suas próprias linhas.** · **Passa no que o protótipo rende.** O
segundo marcador não aparece em lado nenhum. Em `01-primeira.html` há 35 valores
do livro-razão: 33 com o seu selo ao lado, 2 desenhados dentro da régua e
cobertos pela legenda de portas. As duas contagens do próprio sítio no cabeçalho
levam porta e não levam selo, como manda o §10.

**9. Zero endereços de fonte a falhar, ou cada falha com a sua atualização
tipada e cópia fixada.** · **Fora do âmbito.** É do motor e do livro-razão.
O desenho só lhe abre lugar: o degrau «O pedido» no recibo, onde a cópia fixada
entraria ao lado do endereço vivo.

## O que custa construir

- **Tipos: zero.** Nenhum ficheiro, nenhum pedido, nenhum byte. A direção usa as
  pilhas de sistema que as fichas já declaram.
- **Folha.** `tokens.css` + `_estilo.css` desta direção: 39,7 KiB em bruto,
  23,0 KiB apertados. Hoje: `tokens.css` + `site.css`, 60,7 KiB em bruto,
  40,7 KiB apertados. **O número não é comparável de frente**: esta folha veste
  cinco tipos de página e os componentes que partilham, e o sítio tem mais sete
  tipos que ela ainda não veste (arquivo, leitura de estudo, índice do
  livro-razão, correções, sobre, a-verificar, índice de municípios). O que se
  pode dizer com honestidade é que a direção **tira** regras: as caixas com
  fundo, as sombras e a segunda coluna com moldura desaparecem, e a grelha passa
  a ser uma só, declarada em três fichas.
- **Componentes que mudam.** `Provenance.astro`: a palavra «fonte» visível e o
  título do estudo como detalhe (o `.vh` sai). `Masthead.astro`: disposição, o
  sinal de tempo numa tira debaixo de um fio. `LinhaView.astro`: reordenada
  como recibo, com um bloco novo para as verificações. `MunicipioView.astro`:
  ladrilhos para lista editorial, aparelho para margem. `MetodoView.astro` e
  `AgendaView.astro`: rótulos para a calha. `Claim.astro` e `Frase.astro` não
  mudam. `site.css` é reescrita.
- **O que o portão tem de aprender.** Três coisas, e todas são regras a mudar em
  `IDENTIDADE.md`, não conferências novas: (i) a família serifada deixa de estar
  presa a `.wordmark`, e a conferência passa a ser o inverso, que a sem serifa
  não aparece; (ii) o marcador passa a poder ser uma âncora para `/a-verificar`,
  e a conferência do formato tem de o aceitar; (iii) o selo passa a ter uma
  palavra visível fixa antes da etiqueta do estudo, e a conferência que compara
  a etiqueta com a rendição daquela linha tem de contar com ela.
- **Duas linhas de texto do sítio mudam por consequência**: o colofão da
  primeira página, que hoje nomeia três famílias e passa a nomear duas, e o
  rótulo de leitor de ecrã do selo, que deixa de ser preciso porque a palavra
  passa a estar à vista.

## Se só metade pudesse ser construída

Construir, por esta ordem:

1. **O recibo da linha do livro-razão**, com o lugar do recorte e o bloco das
   verificações desenhados a vazio, e a porta de correções na margem. É a página
   mais importante do sítio e a que hoje serve pior três dos quatro leitores.
2. **O selo com a palavra «fonte» e o recibo mínimo**, e o marcador com porta.
   São dez linhas de CSS e uma mudança num componente, e resolvem o defeito
   medido na parte 1 do brief: o leitor não sabe que aquilo abre alguma coisa.

Deixar para depois, sem prejuízo nenhum:

3. **A troca de famílias e a paleta quente.** É a alma da direção, mas é também
   a parte que se pode aplicar num dia sobre tudo o resto, porque é folha.
4. **A grelha de três colunas com notas de margem.** É a parte cara: obriga a
   rever cada tipo de página, e ganha pouco nas páginas curtas.

O que **não** cortaria em caso nenhum: o selo ao lado de cada valor, a legenda
de portas nos desenhos, o marcador único, e os estados vazios desenhados.

## O que não foi feito

- O índice de municípios, o arquivo, a leitura de um estudo, o Sobre, as
  correções e a página do marcador não foram prototipados: o pedido eram cinco
  páginas, e estas cinco são as que o brief nomeia.
- O recorte da linha impressa e o registo de releituras estão desenhados a
  vazio, porque os campos não existem. Não foi inventado nenhum valor para os
  encher.
- A edição inglesa não foi prototipada. Nada na direção depende do comprimento
  das palavras portuguesas: os rótulos vivem numa calha de 120px e numa margem
  de 240px, e todos partem em duas linhas sem partir a grelha.
- Os travessões que aparecem nos protótipos estão todos dentro de material
  transcrito (títulos de trabalhos como «Évora — Quinze Anos, Cinco Mandatos», o
  excerto do Eurostat, as citações da agenda), que IDENTIDADE §9 manda citar
  pelas palavras exatas. Fora disso a conferência conta zero.
