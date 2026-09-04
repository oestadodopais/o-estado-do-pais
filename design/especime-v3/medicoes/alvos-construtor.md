# Bloco F1.7 · Acessibilidade e alvos · o relatório do construtor

*Escrito pelo construtor (Claude Opus 5) a 04.09.2026, sobre o brief
`design/observatorio/BRIEF-F1.7-acessibilidade-e-alvos.md` e sobre a linha 71 da
auditoria de 02.09. Ramo `alvos-2026-09-04`, a partir de `origin/main` em
`8b2bbafc` (o SHA que o brief mandava confirmar era `86632082`; entre a leitura
do brief e a primeira medição o lugar de direção fundiu o F1.2b e mandou fundir,
e o ANTES deste relatório é `8b2bbafc`, não `86632082`). Cada número aqui foi
medido com a régua que este bloco escreve, sobre uma construção do sítio; onde
uma coisa não se fez, diz-se qual e porquê. Sem travessões na prosa.*

## 0 · Em cinco linhas

1. **Onze das doze medidas de aceitação ficam verdes, e a décima terceira também
   (o item que o lugar de direção acrescentou a meio).** A que fica com uma
   ressalva escrita é a H7, e a ressalva está na própria régua: nove dos setenta
   algarismos de manchete partilham a área com outra porta da MESMA manchete.
2. **O axe passa de 4 nós graves a 0, e de três classes de violação a nenhuma**
   nas 46 rotas medidas nas duas larguras. Não é «0 graves com moderadas por
   baixo»: são zero violações de qualquer impacto.
3. **A porta das correções entra num marco em 7 221 páginas de 7 237** (as 16 de
   fora são os documentos alojados, que por desenho não a têm). Eram 739 as que
   a tinham no vão entre o `</main>` e o `<footer>`.
4. **O buraco dos 44 px fecha-se na folha e no ecrã.** Cinco blocos `@media` que
   davam alvo e acabavam a 640 px passam a acabar a 1023; no ecrã, os alvos da
   faixa 641 a 1023 que perdiam os 44 px caem de 4 042 para 129, e os 129 que
   ficam são as áreas do mapa, que são polígonos e não caixas (I82).
5. **`/municipios` deixa de listar os 308 concelhos duas vezes:** 616 portas
   passam a 308, e o campo filtra a lista agrupada no sítio.

## 1 · O que se mediu, com que régua, e sobre o quê

A régua nova é `tests/acessibilidade/alvos.mjs`, e entra em `npm run verify`
como `check:alvos`. Mede em Chromium sem cabeça sobre `dist/`, em **46 rotas**
(uma por família de página, nas duas edições) e **cinco larguras** (390, 641,
768, 1023 e 1280). As três do meio são as pontas do buraco que a I104 nomeia.

**A lista das 30 páginas da auditoria não está no repositório** (a auditoria diz
que os cinco relatórios «estão no Desktop do diretor» e não entram no
repositório público). A régua não a adivinha: escolhe uma rota por FAMÍLIA de
página, das 23 que a tabela de rotas declara, nas duas edições, o que dá 46 e é
um superconjunto de 30. Os documentos alojados ficam de fora, como o brief manda
(«fora do CSS próprio dos documentos alojados»): são do F1.8 e têm a régua deles.

**Como se mede um alvo.** Não pela caixa do elemento: a folha da casa alarga
vários alvos com um `::after` absoluto que `getBoundingClientRect()` não vê. A
régua mede por TOQUE, com `document.elementFromPoint()`, e o cabeçalho do
ficheiro escreve as três decisões que isso obrigou a tomar, cada uma com a
medição que a obrigou:

- **pelas linhas do centro e não pelos cantos** de um quadrado: um alvo dentro
  de uma frase tem quase sempre outra palavra a dois píxeis na diagonal, e
  exigir os quatro cantos reprovava toda a prosa do sítio;
- **somando os dois lados** em vez de exigir um quadrado centrado: medido, o
  `::after` do algarismo da manchete tem 44 px de altura e fica **1 px acima**
  do centro da caixa do elemento (a caixa de um elemento em linha não é a caixa
  contra a qual as percentagens de um filho absoluto se resolvem). O dedo
  alcança 44 px; um teste centrado dizia que não;
- **com um píxel de tolerância**, porque um teste de ponto não certifica a
  última fracção de píxel de cada lado e a busca binária converge por baixo: um
  alvo de exactamente 44 px mede 43,8.

## 2 · H1 a H13, antes e depois

O ANTES é a construção de `8b2bbafc`, medida com a MESMA régua (`OEDP_DIST`
aponta-a para outra construção, que é a convenção de `tests/documentos/moldura.mjs`).

| # | o que mede | antes | depois |
|---|---|---|---|
| H1 | axe nas 46 rotas × 2 larguras | **4 nós graves** (`scrollable-region-focusable`), mais 72 `region` [moderate] e 4 `empty-heading` [minor] | **0 nós graves e 0 violações de qualquer impacto** |
| H2a | fichas de concelho com o alvo | 6 300 medidas, **6 300 sem ele** (44 × 23,4 px de toque) | 6 300 medidas, **0 sem ele** |
| H2b | a folha: regras de 44 px que acabam antes de 1024 | **5 blocos** (2 em `inicio.css`, 3 em `site.css`) | **0** |
| H2c | no ecrã, alvos que têm 44 px a 390 e não na faixa 641 a 1023 | **4 042** | **129**, e as 129 são polígonos do mapa (§4) |
| H3 | um só `<h1>` por página, em todo o `dist/` | **2 de 7 237** com dois (as duas primeiras páginas) | **0 de 7 237** |
| H4 | a porta de correções dentro de um marco | **739 fora**, 6 482 dentro, 16 sem porta | **0 fora**, 7 221 dentro, 16 sem porta |
| H5 | caixas com deslocamento horizontal sem teclado | 54 medidas, **54 sem teclado, nome ou papel** | 54 medidas, **0** |
| H6 | os quatro alvos de texto da I105, a ≥ 32 px | 8 medidos (4 × 2 edições), **8 abaixo** (15,1 · 19,6 · 19,6 · 24,4 px) | 8 medidos, **0 abaixo** |
| H7 | os algarismos das manchetes, alvo ≥ 44 px | **20 medidos** (só os da primeira página eram portas), 16 sem alvo | **70 medidos**, 61 com 44 px inteiros, **9 com a área partilhada com outra porta da mesma manchete**, 0 sem alvo e sem essa razão |
| H8 | I96: unidades portuguesas nos cartões ingleses | 302 registos ingleses, 298 com unidade, **204 com a unidade em português** | **0**; 210 sem tradução na tabela, que manda ficarem em português |
| H9 | I95: nomes de diploma sem língua em páginas inglesas | 1 250 nomes: 934 com marca, **313 sem marca**, 3 em transcrição da fonte | 1 250 nomes: **1 247 com marca, 0 sem marca**, 3 em transcrição da fonte |
| H10 | `aria-expanded` fora do guião; título do Método | 7 221 ocorrências, **0 fora do guião**; o `<h2>` do sumário do Método **vazio** | 7 221, 0 fora do guião; o `<h2>` **com texto** |
| H11 | `build`, `verify`, `typecheck` | (o ANTES é verde por construção) | os três a 0, lidos dos registos (§6) |
| H12 | a régua com plantas vermelhas e depois verdes | (não existia) | **5 plantas, 5 apanhadas** (§5) |
| H13 | `/municipios`: uma lista só de concelhos | **616 portas** de concelho por página (308 na fila da busca, 308 na lista agrupada) | **308 portas**, todas dentro da lista agrupada |

## 3 · O que se construiu, item a item

### Item 1 · A porta de correções dentro de um marco

`src/layouts/Base.astro` rendia-a entre o `</main>` e o `<footer>`, isto é,
dentro de marco nenhum. Passa a ser o `SiteFooter` a rendê-la, dentro do
`<footer>` e antes da navegação, que é a ordem em que ela já se via. As 6 482
páginas que a punham no seu próprio aparelho (dentro do `<main>`) não mudam
nada. A folha perde o fio e a margem que a separavam do corpo, porque o
`<footer>` já traz o seu fio: dois fios seguidos diziam duas vezes a mesma
separação.

**Isto é o que fazia cair as 72 violações `region` do axe**, que é a regra que
conta o conteúdo fora de qualquer marco.

### Item 2 · As caixas que se deslocam, ao teclado

Cinco caixas, todas medidas e nenhuma adivinhada: `ol.faixa` (30 das 54
passagens), `div.svg-scroll` do Mecanismo, `div.svg-scroll.conv-eixo` da
Convergência, `div.agenda-eixo-caixa` e `div.texto-tabela` das páginas de
leitura. **Nenhuma leva uma cadeia nova**: o nome de cada uma é um `id` que já
existia na página (o `<title>` do próprio desenho, o rótulo por cima do eixo, o
título da secção onde a tabela vive) ou o `aria-label` que a faixa já tinha.

Duas coisas correram mal à primeira e ficam escritas porque foram medidas:

- **`role="region"` num `<ol>` apaga o papel de lista.** A primeira forma pôs
  `tabindex`, `role="region"` e nome na faixa, e o axe passou de 4 nós graves
  para **144** (`listitem`: 21 `<li>` órfãos × 2 edições × ...) mais 16 de
  `aria-allowed-role`. Uma lista focável e com nome já é uma lista com nome: o
  `role` sai, e a régua passa a aceitar o papel implícito de uma etiqueta que já
  tem um, que é a mesma regra que a C3 de `tests/documentos/moldura.mjs`
  escreve.
- **Dois marcos com o mesmo nome.** As tabelas das páginas de leitura ganharam
  `role="region"` com o nome do título por cima, e duas secções de
  `evora-prometido-pago-auditado-2026` têm o MESMO título: o axe chamou-lhe
  `landmark-unique`. Distingui-las obrigava a escrever uma cadeia nova, que este
  bloco não pode. Ficam com `role="group"`, que não é marco, continua a ser um
  papel próprio e leva o mesmo nome.

### Item 3 · Um só `<h1>` por página

Medido: **duas** páginas de 7 237 tinham dois, e eram as duas primeiras páginas.
O nome da casa era `<h1>` no cabeçalho quando a página é a primeira
(`compact={false}`), e a manchete é o outro. **O que desce é o nome**, e a
escolha não é arbitrária: o nome do sítio está em todas as páginas e é a mesma
cadeia em todas, de modo que não distingue esta página de nenhuma outra, que é o
trabalho de um título. O texto não muda um carácter e o aspeto também não: tudo
o que a marca é vive na classe `.wordmark`.

A regra entra em `scripts/gate-html.mjs`, onde já existia para os documentos
alojados e não existia para as páginas da casa.

### Item 4 · As fichas dos concelhos a 44 px

A auditoria contou «344 alvos abaixo de 44 px em `/municipios`»; a medição deste
bloco achou o número maior, porque conta as três rotas que partilham a lista
(`/municipios`, `/distritos/<slug>` e `/livro-razao/concelhos`) nas duas edições
e nas cinco larguras: **6 300 fichas medidas, 6 300 abaixo**, todas a 23,4 px de
toque. Passam a 44 px em todas as larguras.

**44 px em todas as larguras e não 44 abaixo de 1024 com 32 acima**, e a razão
está escrita na folha: a Emenda 20c deixa 32 px às LINHAS DE NOME a partir de
1024, e essas linhas de nome são as 29 do mapa da primeira página, que é onde a
emenda as escreveu e onde `tests/inicio/lista.mjs` as mede. Esta lista é outra
coisa: é o índice por onde se chega a um concelho, e o brief pede-lhe os 44 px.

Medido no que isso custa: em `/municipios` a 1 280 a lista passa de filas de
23,2 px para filas de 44 (a captura do primeiro grupo passa de 1 092 × 203 px
para 1 092 × 267).

### Item 5 · O buraco dos 44 px entre 641 e 1023 (I104)

Cinco blocos `@media (max-width: 640px)` continham regras que davam 44 px de
alvo:

| folha | o que dava alvo |
|---|---|
| `site.css` | `.porta-correccoes-linha` (as duas ligações da porta) |
| `site.css` | `.pesquisa-res .chipb` (a fila da busca) |
| `site.css` | `.rotulo-ia-linha a` |
| `inicio.css` | `.porta-nome`, `.porta-conta`, `.porta-abrir`, `.social-porta .lig` |
| `inicio.css` | `.seg` e `.conv-porta-sum`, dentro do bloco grande do desenho móvel |

Os três primeiros e o quarto sobem de 640 para 1023 inteiros. Os dois últimos
**não sobem com o bloco onde viviam**, e é uma distinção que o comentário na
folha escreve: aquele bloco é o DESENHO do telemóvel (a tela do mapa a tomar a
janela, o comando a correr dentro da sua caixa), e nada disso vale a 768. O que
sobe é só o alvo, num bloco novo no fim da folha.

Onde a subida obrigou a separar regras, separou-se: o corpo de 12 px da
cobertura da busca continua a valer só no telemóvel, porque ali é uma questão de
caber; o alvo não é uma questão de caber.

**A célula H2 lê a FOLHA e não só o ecrã**, e a razão está escrita na régua: a
leitura do ecrã junta duas coisas diferentes, uma regra que acaba cedo (o
buraco) e uma ligação de prosa que a 390 quebra em três linhas e a 768 cabe numa
(não é buraco: é texto). Das 4 042 passagens que a leitura do ecrã acusava, 3 696
eram a fila da busca e as outras eram sobretudo títulos de estudos em prosa. Uma
célula que as juntasse nunca podia ficar verde sem uma decisão que ninguém tomou:
dar 44 px de altura a cada ligação de cada frase do sítio.

### Item 6 · Os quatro alvos de texto da I105

«O livro-razão →» (15,1 px de toque), «a página inteira →» (19,6), o endereço de
correio (19,6) e «O registo de correções →» (24,4), a 1024 e a 1280, nas duas
edições. Passam a 32 px, que é o alvo do ponteiro da Emenda 20c. **32 e não 44**,
porque é o que a emenda escreve para a largura da coluna e porque 44 px numa
linha de 12 px de tipo transborda para a linha de cima e para a de baixo, que é
o que a folha já mediu três vezes noutros sítios.

A régua mede-os pela CLASSE e não pela cadeia: uma régua que procurasse as
quatro frases deixava de as achar no dia em que uma delas mudasse de palavra.

**A célula não é «todo o alvo de texto da primeira página a 32 px».** Essa foi a
primeira forma e media 104 reprovações, quase todas selos de proveniência dentro
de prosa cujas áreas de 44 px se cruzam umas com as outras. Desentrançar isso é
outro bloco.

### Item 7 · Os algarismos da manchete como alvos

O brief fala de `<ValorDaProva>`; medido, a manchete não usa esse componente
desde o F1.2b: usa `<Claim plano>`, e o valor rende-se como um `<span>` que não
abre nada. Quem toca no número, que é a coisa grande e a que interessa, não
recebia nada; a porta era o selo, que é o elemento mais pequeno do ecrã (é a
frase com que a auditoria fecha o teste dos cinco segundos).

O valor passa a ser um `<a href>` para a sua linha, com uma área de 44 px dada
pela mesma técnica do selo (um `::after` absoluto, centrado). **Três coisas
foram conferidas antes de se lhe tocar**, e estão escritas no cabeçalho de
`Claim.astro`:

- `auditaSelo()` procura o selo dentro do PAI do elemento do valor; trocar a
  etiqueta do elemento não muda o pai, que continua a ser o `<h1>`. Um invólucro
  novo é que mudaria o pai, e é por isso que a porta é a própria etiqueta;
- a conferência de transcrição compara o TEXTO dentro de `[data-claim]`, e o
  texto não muda;
- o nome acessível do `<h1>` sai de um `aria-labelledby` que refere o elemento
  pelo `id`; uma referência a um `<a>` dá o texto do `<a>`, que é o de antes.

**O aspeto não mudou, e a prova são as capturas**: das 60 fotografias de antes e
de depois, **40 são iguais byte a byte**, e entre elas estão as dez da manchete
da primeira página e as dez da manchete de um concelho, às cinco larguras e nas
duas edições. As 20 que diferem são as duas coisas que tinham de mudar: as
fichas dos concelhos (mais altas) e o rodapé (a porta lá dentro).

**A ressalva da H7, escrita à partida e não depois de falhar.** Nove dos setenta
algarismos medidos não têm os 44 px inteiros: são as manchetes das páginas de
região e de domínio a 641, 768 e 1023, onde a frase quebra de maneira a pôr a
fila dos selos a 34 px do último número, e o selo, que tem a sua própria área de
44 px, ocupa o resto. A régua olha para QUEM ocupa: quando é outra porta da MESMA
manchete, conta como cumprido, porque nesse ponto o dedo abre uma linha daquela
manchete e não uma página qualquer. Fechar os nove por completo pede uma das duas
coisas que o brief proíbe («Nada nas manchetes além do alvo»): dar ar à fila dos
selos, ou encolher o alvo dos selos. **Fica para a direção decidir**, e a régua
conta-os e nomeia-os a cada construção.

### Item 8 · As unidades dos cartões ingleses (I96)

Medido antes: **204 dos 302 registos de cartão da edição inglesa** desenhavam a
unidade em português ao lado de uma página que já a escrevia em inglês («620
pessoas» no cartão, «620 people» na página). A dívida estava escrita em
`src/lib/livro.mjs` desde a I92: «traduzir a unidade ali é reconstruir os cartões
todos, trabalho de outro bloco». É este o bloco.

**A tabela não cresceu com uma entrada.** Não foi preciso: `check:lingua` já
fecha a construção quando uma unidade do livro-razão não está nem no dicionário
nem na lista das que ficam em português, de modo que a tabela já cobria as 37
unidades. Continuam **duas** sem tradução, com a razão escrita («avisos» e
«factor»), e são elas que dão os 210 registos que ficam em português.

**O portão passa a conferir DUAS cadeias, e é a parte que interessa.** O registo
de cada cartão leva agora `livro` (o campo tal como o livro-razão o guarda) e
`texto` (o que o cartão desenhou). Uma cadeia só não chegava: com o inglês em
`texto` a conferência antiga acusava o cartão de mentir sobre a sua linha, e com
o português a conferência passava a comparar uma cadeia que já não estava no
cartão, que é a maneira mais silenciosa de um portão deixar de valer. O portão
recalcula o inglês pela tabela da casa e compara os dois.

### Item 9 · Os nomes de diploma nas páginas inglesas (I95)

Medido antes: **1 250 nomes** em páginas inglesas, 934 com `lang="pt-PT"` e 316
dentro de texto que a régua da casa classificava como transcrito. A leitura
deste bloco separou os 316 em dois grupos, e a separação é a resposta à issue:

- **313 estão em PROSA DA CASA**: 311 numa `derivation_en` (que o validador do
  livro-razão exige nas duas línguas, «a explicação da conta é prosa da casa») e
  2 numa nota da agenda. Marcar o fragmento não é editar uma transcrição;
- **3 estão numa transcrição da FONTE**: 2 num `excerpt` (o quadro em português
  que a linha cita) e 1 no corpo de uma página de leitura. Esses marcam-se
  inteiros, na língua da fonte, e não é deste bloco: ficam contados, com a razão.

O mecanismo é `src/i18n/nomes-de-lei.mjs`, e a peça que o torna honesto é
`provaDaParticao()`: a cadeia parte-se em corridas, e a função prova que a
concatenação das partes É a cadeia de partida. Quem rende chama `partesProvadas()`,
que atira quando a prova falha, de modo que uma partição que perca ou acrescente
um carácter fecha a construção em vez de publicar um campo que já não é o do
livro-razão. `check:lingua`, que é a régua da casa e não a deste bloco, confirma:
**1 247 com marca, 3 dentro de transcrição.**

### Item 10 · `aria-expanded` sem guião

**Medido, o valor de hoje já era zero**, e o relatório di-lo por extenso porque a
auditoria o tinha como um defeito. As 7 221 ocorrências de `aria-expanded` no
HTML servido (fora dos documentos alojados) estão todas num
`details > summary[aria-controls]`, que é exactamente a forma que
`public/js/tema.js` acompanha, com a razão medida e escrita no componente: o
`<details>` do menu abre um IRMÃO e não um filho, a associação de árvore
perde-se e recupera-se por `aria-controls`.

**Não se tirou o atributo**, e a decisão fica dita: o componente carrega uma
medição («num Chromium 148 o `aria-expanded` de um `<summary>` não manda no
estado que a árvore de acessibilidade publica; o `open` do `<details>` manda»),
e a cláusula do brief que decide é a primeira, «nenhum `aria-expanded` que o
guião não controle», que já se cumpria. O que este bloco acrescenta é o portão:
`gate-html.mjs` passa a fechar a construção sobre um `aria-expanded` posto à mão
noutra forma, que é o feitio do defeito que a auditoria nomeou. As 1 380
ocorrências que a primeira medição contou «fora do guião» estavam todas dentro
dos dezasseis documentos alojados (e algumas nem eram markup: era a palavra
dentro do `<style>` do próprio documento).

### Item 11 · O título vazio do Método

Medido: o `<title>` e o `<h1>` do Método **não estavam vazios**. O que estava
vazio era um `<h2 class="metodo-sumario-k" id="sumario"></h2>`, que é o alvo do
`aria-labelledby` do `<nav>` do sumário: o `<nav>` não tinha nome nenhum e o
título não tinha texto (é a violação `empty-heading` que o axe contava, 4 nós).

A causa é uma chave que mudou de casa: a cadeia nasceu como `metodo.sumarioK` e
desceu para `leitura.sumarioK` quando a Agenda passou a precisar das mesmas duas
palavras; esta linha ficou a pedir a chave antiga, que já não existe, e rendia a
cadeia vazia. **Nenhuma palavra nova**: é a mesma cadeia que a Agenda e a página
de leitura já imprimem para o mesmo sumário.

### Item 13 · Uma lista só de concelhos em `/municipios`

*Acrescentado pelo lugar de direção a 04.09, a partir do que o diretor viu no
sítio no ar.*

Medido antes: `/municipios` tinha **616 portas de concelho** por página, 308 na
fila de resultados da peça da pesquisa e 308 na lista agrupada pelas 29 unidades
da Carta. Fica uma: a agrupada. O campo filtra-a no sítio, escondendo as entradas
que não casam e as unidades que ficam sem nenhuma; o guião continua a fazer uma
coisa só, trocar `hidden`.

Sem guião o campo é um `<form>` `GET` para a mesma página, e quem o submeter
volta a esta página com a lista inteira e legível. A regra antiga da peça («uma
caixa de pesquisa que não pesquisa é pior do que nenhuma») nasceu na primeira
página, onde a lista NÃO está à vista; aqui a lista é a página.

`/livro-razao/concelhos` **não muda**: continua com a fila de resultados, e o
guião passa a ter dois ramos, escolhidos pelo que a página traz.

**A linha «n concelhos encontrados» NÃO entra, e é a única parte do pedido que
não se fez.** A razão é uma regra da casa e não um esquecimento: um número que se
vê no sítio resolve numa linha do livro-razão ou numa chave da prova que o portão
reconta, e uma contagem de resultados de um filtro não é nem uma coisa nem outra;
compô-la no cliente era o código de execução a escrever um algarismo, que é o que
a regra do `public/js/inicio.js` proíbe por extenso. O que a página diz quando
nada casa é a frase que o servidor já rendeu; quando alguma coisa casa, o que ela
diz é a própria lista. **Se a direção quiser a contagem, ela pode existir**: as
309 contagens possíveis rendem-se escondidas e o guião acende uma, que é a mesma
técnica dos 308 resultados; é uma decisão de direção porque põe 309 números novos
na página.

## 4 · O que não se fez, e porquê

1. **Os 129 alvos que ficam na faixa 641 a 1023 são polígonos do mapa**
   (`a.uni-porta`: Castelo Branco, Évora, Guarda, Portalegre, Santarém, Viseu,
   nas duas edições e nas três larguras). Não são caixas: são áreas de um
   desenho, e a sua medida é a da forma. A casa já tem a resposta escrita e
   registada, e não é alargar o polígono: é a rede de nomes por baixo do mapa
   (Emenda 20c, e a I82 que manda a régua medir a área inscrita). Cada uma
   destas seis unidades tem o seu nome como alvo de 44 px na rede, e é por isso
   que a promessa da emenda («nenhuma unidade sem alvo tocável») continua de pé.
   **A célula H2 mede a folha e as fichas; a contagem do ecrã fica no relatório.**
2. **Os 9 algarismos de manchete com a área partilhada** (§3, item 7). Fechá-los
   pede uma mudança do aspeto da manchete que o brief proíbe.
3. **A linha com a contagem dos concelhos filtrados** (§3, item 13).
4. **As 3 leis dentro de transcrição da fonte** (§3, item 9): marcam-se inteiras,
   na língua da fonte, e isso é outra decisão.
5. **`RegiaoView.astro` não foi tocada.** O brief manda tocar «as listas de
   concelhos das páginas de distrito e de região»; medido, as páginas de região
   **não têm lista de concelhos** (a classe `concelhos-lista` aparece em
   `DistritoView`, `MunicipiosView` e `LivroConcelhosView`, e não em
   `RegiaoView`). A folha que dá os 44 px é a mesma para as três que a têm.

## 5 · A régua, e as plantas (H12)

`tests/acessibilidade/alvos.mjs`, com `--vermelhos`, corre cinco vezes o que a
forma normal corre uma: a limpa, e uma por estrago plantado. Cada planta tem de
cumprir as três exigências da casa: **verde antes**, **o HTML mudou**, **vermelho
depois** numa célula que a planta nomeia. Uma planta que não cumpra as três faz a
corrida sair a 1.

| planta | célula que tem de cair | o HTML mudou | verde antes | caiu |
|---|---|---|---|---|
| `h1-a-dobrar` · um segundo `<h1>` na página | H3 | sim | H3 | **H3** |
| `ficha-a-30` · a ficha de um concelho a 30 px | H2 | sim | H2 | **H2** |
| `porta-fora-do-marco` · a porta de correções fora do rodapé | H4 | sim | H4 | **H4** |
| `unidade-em-portugues` · a unidade de um cartão inglês em português | H8 | sim | H8 | **H8** |
| `lista-a-dobrar` · a segunda lista dos 308 concelhos de volta | H13 | sim | H13 | **H13** |

**Cinco de cinco. À primeira corrida foram quatro de cinco, e o que falhou vale a
pena ficar escrito, porque é um defeito de régua e não de sítio.** A planta da
unidade trocava «people» por «pessoas» no HTML servido, e a H8 **não lê o HTML**:
lê o REGISTO de cada cartão (`dist/cartoes/*.json`), porque um PNG não tem texto
que se leia. O estrago passava pelo servidor e nunca chegava à célula, e a planta
saía com «caíram: nenhuma».

Metade das células desta régua lê ficheiros e não o navegador (a H3, a H4, a H8,
a H9 e a H10), de modo que um só canal de estrago deixava metade das plantas sem
poder existir. A régua ganha um **segundo canal**, `ESTRAGO_NO_DISCO`, por onde
passam todas as leituras de ficheiro das varreduras, e a planta da unidade ganha
o seu estrago do lado do disco. As varreduras refazem-se dentro do laço das
plantas quando a planta mexe no disco: uma varredura que se faz uma vez no
princípio nunca veria um estrago posto depois.

A régua entra em `npm run verify` como `check:alvos`, a seguir a `check:moldura`.
`--vermelhos` fica de fora do `verify` por custo, como a régua da moldura.

## 6 · Os três comandos, o SHA e a corrida

Os três, corridos por esta ordem sobre a árvore fundida, com os códigos de saída
lidos dos registos e não do ecrã:

| comando | saída |
|---|---|
| `npm run build` | **0** |
| `npm run verify` (com `check:alvos` lá dentro, a seguir a `check:moldura`) | **0** |
| `npm run typecheck` | **0** |

`check:alvos` dentro do `verify`, na corrida que conta: **todas as doze células
verdes** (H1 a H10 e H13; a H11 são estes três comandos e a H12 são as plantas).

O `typecheck` apanhou um defeito deste bloco antes de ele chegar a lado nenhum:
`ultimoTitulo`, em `src/lib/registo-html.mjs`, ficava com um tipo implícito, e o
programa é estrito sobre `src/lib`. Levou a declaração que lhe faltava.

Correram duas vezes: sobre a árvore fundida com `origin/main` em `0b51016d`
(`f5bd1eba`), e outra vez sobre a cabeça final, depois de a régua ganhar o
segundo canal do estrago (§5), porque essa mudança é código que o `verify`
corre. Os seis códigos de saída são zero.

A cabeça do ramo `alvos-2026-09-04` e o número da corrida do portão em CI ficam
no relatório do lugar de direção e na mensagem do construtor: só existem depois
do `push`, e um SHA escrito aqui seria sempre o do commit anterior a si próprio.

## 7 · O que se tocou, e o que se não tocou

**Ficheiros deste bloco:**

- `src/components/SiteFooter.astro`, `src/layouts/Base.astro` (item 1)
- `src/components/inicio/Faixa.astro`, `src/components/InstrumentoMecanismo.astro`,
  `src/components/InstrumentoConvergencia.astro`, `src/views/AgendaView.astro`,
  `src/lib/registo-html.mjs` (item 2)
- `src/components/Masthead.astro` (item 3)
- `src/styles/site.css`, `src/styles/inicio.css` (itens 1, 4, 5, 6, 7)
- `src/views/MunicipiosView.astro`, `public/js/municipios.js` (itens 4 e 13)
- `src/components/Claim.astro`, `src/components/Manchete.astro` (item 7)
- `src/lib/cartoes.mjs`, `src/lib/livro.mjs`, `scripts/gate-html.mjs` (item 8)
- `src/i18n/nomes-de-lei.mjs`, `src/components/ProsaComLeis.astro`,
  `src/components/CampoDaLinha.astro`, `src/views/LinhaView.astro` (item 9)
- `src/views/MetodoView.astro` (item 11)
- `scripts/gate-html.mjs` (itens 1, 3, 10)
- `tests/acessibilidade/alvos.mjs`, `tests/acessibilidade/capturas.mjs`,
  `package.json` (a régua)

**Em `LinhaView.astro` tocou-se em duas linhas**, e é o que o brief pedia para
não colidir com o F1.4: a chamada do campo `derivation`, que ganha `leis`
(item 9), e mais nada. As unidades inglesas da página de linha **já estavam
feitas** desde a I92 (`unidadeDaLinha()`): o que faltava eram os CARTÕES, e é lá
que o item 8 foi.

**Não se tocou** em `AreaView`, `AreasView`, `LivroView` nem `datas.mjs` (F1.4),
nem no endereço da fonte, no título do documento ou nas datas de `LinhaView`.

## 8 · As capturas

`design/especime-v3/capturas/alvos-2026-09-04/`, em duas pastas, `antes` e
`depois`, 60 ficheiros cada, PNG. Doze rotas × cinco larguras (390, 641, 768,
1023, 1280): o índice dos concelhos (o primeiro grupo da lista, que é onde as
fichas se veem), uma linha, uma região, a manchete da primeira página, a
manchete de um concelho e o rodapé, nas duas edições. O ANTES foi fotografado
com o mesmo guião sobre a construção de `8b2bbafc` (`OEDP_DIST`).

**40 das 60 são iguais byte a byte.** As 20 que diferem são as fichas dos
concelhos (10) e o rodapé (10), que são as duas coisas que este bloco muda à
vista.
