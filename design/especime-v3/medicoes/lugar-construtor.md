# F1.10 · uma coisa, um lugar

*Relatório do construtor (Claude Opus 5), 04.09.2026, sobre o brief
`design/observatorio/BRIEF-F1.10-uma-coisa-um-lugar.md`. Ramo `lugar-2026-09-04`,
a partir de `origin/main` em `306e4c68`. Sem travessões na prosa. Nenhum número
deste relatório foi escrito à mão: cada um tem ao lado o comando que o mediu.*

---

## Estado · 08.09.2026, 10:46 UTC · a régua, a página europeia, o índice dos domínios, o vocabulário, as frases de hierarquia, o nome do índice, o menu em dois pesos e o §9

| | |
|---|---|
| cabeça | a última do ramo (`git rev-parse HEAD`) |
| `main` fundido | `43f4b52a` (fusão `47d957f6`) e `d9066379` (fusão `5757746f`, o F1.1d e o §9 do brief) |
| `build` · `verify` · `typecheck` | **0** · **0** · **0** (códigos lidos de `build.exit`, `verify.exit`, `typecheck.exit`) |
| a régua do bloco | `scripts/check-lugar.mjs`, no `verify`, **7,84 s** (`/usr/bin/time -p node scripts/check-lugar.mjs`) |
| feito | a régua (encargo (b)); **§9.1** (o índice dos domínios deixa de falar da cobertura da casa); **8.8** («Números e fontes» / «Numbers and sources» como nome visível do índice e da entrada do menu); **8.9** (o menu em dois pesos, com os três destinos do leitor à vista a 390 e os outros dez a um toque); **§7.5** (o menu e o rodapé com a mesma lista pela mesma ordem, e «Áreas de governo» por extenso); **8.16** (a página «Portugal na União Europeia», a faixa da primeira página com as medidas de cabeça do domínio vivo); **8.13** (a secção dos domínios passa a índice, 0 valores selados); **8.12** (em repouso só a linha do toque; o cabeçalho e o contexto de um painel só junto de uma leitura dele); **8.14 inteiro** (o comando de densidade fora e as duas palavras a 0 nas páginas do leitor); **§2.2** (as cinco frases de hierarquia nos cinco índices) |
| a seguir | o resto do §9 (os pontos 2 a 10), 8.4 e 8.5, 8.15, 8.11, e as páginas (item 4 do encargo) |

---

## A tabela das medidas (decisão do lugar de direção, 07.09)

**O «antes» é o `dist/` da fusão de `origin/main` (`43f4b52a`) na cabeça
`47d957f6`, medido a 08.09.2026.** Nenhum destes números foi escrito à mão: cada
um sai do comando que está na última coluna. A régua imprime os doze de uma vez,
e cada um tem um teto escrito ao lado no próprio ficheiro, com a data em que foi
medido: a régua falha quando a medição passa do teto **e também quando ela fica
mais de oito abaixo dele**, porque um teto com folga a mais é uma régua a dormir.

| medida | antes | depois | o comando |
|---|---|---|---|
| L1 · páginas com dois destinos iguais fora do cabeçalho e do rodapé | 6 596 | **6 598** (+2: as duas páginas novas) | `node scripts/check-lugar.mjs` |
| L2a · segundas listas dos 308 concelhos (fora de `/municipios`, fora de uma lista fechada) | 2 (`/` e `/en`) | 2 (por fazer) | idem |
| L2b · réguas inteiras da convergência fora de `/regioes` | 18 | 18 (por fazer) | idem |
| L2c · sinopses de estudo fora de `/estudos` | 10 (5 em `/municipios/evora`, 5 na inglesa) | 10 (por fazer) | idem |
| L3 · palavras fora do vocabulário fechado, no texto da casa | 51 | 51 (por fazer) | idem |
| L4 · frases de definição e de hierarquia em falta | 10 (as cinco de hierarquia × 2 edições; a de definição já está a 1) | **0** · feito | idem |
| L5 · páginas abaixo da primeira sem caminho no cabeçalho | 7 211 | **7 213** (+2: as duas páginas novas) | idem |
| L6 · selos cuja etiqueta não é o publicador da linha | 26 168 | **26 174** (+6: as duas páginas novas) | idem |
| L7 · a releitura do leitor de primeira vez | é do lugar de direção | — | a leitura do Codex |
| L8 · os três portões | **0 · 0 · 0** | 0 · 0 · 0 | `npm run build\|verify\|typecheck > x.log 2>&1; echo $? > x.exit` |
| L9 · as plantas vermelhas e depois verdes | conhecido-positivo corrido (ver abaixo) | por fechar | `node scripts/check-lugar.mjs` sobre o `dist/` com o estrago |
| 8.5 · blocos com «limiar» sem o qualificador nem a frase ao lado | 706 | **708** (+2: as duas páginas novas) | idem |
| 8.8 · «livro-razão» nos menus, nos rodapés e nos títulos | 24 172 | **0** · feito | idem |
| 8.13 · valores selados na secção dos domínios de `/` | 4 (2 por edição) | **0** · feito | idem |
| 8.14 · «Relance» e «Leitura breve» nas páginas do leitor | 1 304 (325 + 327 por edição) | **0** · feito | idem |

**O conhecido-positivo da L9 já correu, e a régua viu-o.** Com dois estragos
plantados no `dist/` (`<p>O município de Évora.</p>` e
`<p class="mun-estudo-frase">Uma sinopse plantada.</p>` dentro do `</main>` de
`/regioes/alentejo`), a régua sobe a L3 de 51 para 52 e a L2c de 10 para 11 e sai
com **1**; restaurada a página, volta a **0**. As cinco plantas que a L9 escreve
correm no fecho do bloco, contra os tetos finais.

**A célula A11 correu, e passa nas duas edições.** `node
tests/inicio/correcoes-a.mjs`: «a frase de definição, uma vez, na letra da prosa
e sem porta», 1 ocorrência, Spectral 12 px, **2 linhas** a 390 px (o teto da
célula é 3), 0 ligações, 0 algarismos.

**Duas células da mesma régua estão vermelhas, e não são deste ramo.** A7 («a
cabeça e a manchete começam antes de 40% do ecrã») falha nas duas edições, e a
razão está no que ela imprime: **4 leituras no documento** onde a célula exige 3.
A quarta é o contador das séries atrasadas que o F1.6 pôs na mobília
(04.09.2026); a célula não corre no `verify` nem na CI e ninguém a correu desde
então. O item 8.1 e o §7.3 deste brief mandam essas linhas SAIR do cabeçalho de
todas as páginas para a página da medida e para o Método: a célula reescreve-se
quando esse item entrar, e não antes.

---

## O que a segunda sessão fez, item a item

### 8.16 · «Portugal na União Europeia», e a faixa devolvida aos domínios

**A página nova** (`src/views/UniaoEuropeiaView.astro`, `/uniao-europeia` e
`/en/european-union`) leva os 21 cartões dos dois quadros da União e as suas
leituras, a faixa em cima e a área de leitura por baixo, como a primeira página
as tinha. **A chave da rota não se traduz e o caminho sim** (`uniaoEuropeia`,
`/uniao-europeia`, `/en/european-union`): é a regra desta tabela, escrita nas
regiões, nas áreas, nos concelhos e nos domínios, «o que se traduz é o rótulo e
nunca a chave». Sem `:slug`, e por isso sem a questão que os domínios deixaram
nos pendentes.

**A faixa da primeira página** passa a levar as medidas de cabeça dos domínios
vivos, lidas da declaração do próprio domínio (`FAIXA_DO_DOMINIO_1` em
`src/data/dominios.mjs`, hoje E3, E2, T1, T2 e T3): a dívida pública, o saldo das
administrações públicas, a taxa de emprego, a taxa de desemprego e o ganho médio
mensal. Cada cartão leva à leitura daquela medida **na página do domínio**, com a
âncora composta pela mesma função que a página do domínio usa. Um domínio novo
traz as suas sem uma linha mudar na vista.

**A porta para a página nova** fica ao pé da faixa, na fila de portas que o F1.2b
pôs por baixo dos cartões, e no menu e no rodapé. **Uma porta, e mais nada:** sem
contagem ao lado (seria um algarismo a mais) e sem frase a dizer o que a página é
(seria uma frase nova sobre a casa).

**As seis chaves da prova cuja porta era a âncora do painel** (`painel_total`,
`painel_com_limiar`, `painel_fora_do_limiar`, `painel_dentro_do_limiar`,
`painel_social_total`, `painel_reconferido_em`) passam a abrir a página nova. A
regra não mudou, e é ela que obriga: a porta de uma chave da prova é o sítio onde
o que ela conta se vê.

**Três réguas foram atrás da mudança, e nenhuma foi enfraquecida:** a F16 do
`check:formas` (as duas contagens por extenso da frase do Painel Social) e duas
secções do feixe do sistema de desenho (a régua contra o limiar e o cartão do
Painel Social) passam a ler a página onde o conteúdo está, com o mesmo teste.

### 8.13 · a secção dos domínios passa a ser o índice dos domínios

**0 valores selados**, medido: a régua desceu de 4 para **0**. A secção lista os
dezoito nomes com o seu estado e a porta de quem tem página, e é a mesma leitura
que `/dominios` faz, com a mesma tabela por trás.

**Sem a contagem das medidas, e a razão é a regra da casa.** O item 8.13 escreve
«o que está vivo com a contagem das suas medidas». Uma contagem é um número da
casa, e um número da casa entra por `data-prova`, com quem o reconte de outro
ponto de observação: `scripts/gate-html.mjs` percorre as chaves da prova e fecha
a construção quando não sabe contar uma. A prova é uma tabela de CHAVES FIXAS, e
uma contagem por domínio pedia dezoito chaves novas para um índice de navegação.
A contagem das medidas de um domínio lê-se onde ela é o conteúdo da página: na
página do domínio. **Fica para decisão do lugar de direção se a quiser na
primeira página.**

### 8.12 e a primeira metade de 8.14

Na página nova, em repouso a área de leitura mostra **só** a linha «Toque num
cartão para ler a medida.»; o cabeçalho de um painel e a sua frase de contexto
rendem-se **junto de uma leitura daquele painel**, e nunca sozinhos. Quem os
acende é `public/js/leituras.js`, pela marca `data-contexto-quadro`, que é a
mesma que cada dobra leva em `data-quadro`. **Sem guião nada muda:** as vinte e
uma ficam à vista, fechadas, com os dois cabeçalhos por cima das suas.

**O comando de densidade saiu**, e com ele as palavras «Relance» e «Leitura
breve» da primeira página (a régua desceu de 1 304 para 1 300). O que falta da
8.14 são as duas palavras nas páginas do concelho e do domínio, que é o item 4 do
encargo, e as vinte e uma frases de definição da Comissão, que é o 8.4.

**O bloco das leituras saiu de `public/js/inicio.js`** e está inteiro em
`public/js/leituras.js`, que é o guião da página nova. **O que ficou por tirar, e
diz-se:** `inicio.js` ainda tem a máquina de estado da densidade
(`?densidade=`), que nenhuma marca da primeira página acende. Sai com o resto da
8.14, junto com as células da matriz que a medem, para que a régua e o guião
saiam no mesmo commit.


### 8.14 (o resto) e §2.2 · as duas palavras saem, e as frases de hierarquia entram

**«Relance» e «Leitura breve» a 0 nas páginas do leitor**, medido (1 304 antes, 0
depois). Eram seis superfícies, e as seis passaram a dizer o que a secção tem, com
as duas cadeias que a §1.98 declarou (`secoes.medidas`, `secoes.leitura`):

```
src/views/MunicipioView.astro          o «h2» do relance, o do «breve» e dois rótulos de camada
src/views/DominioView.astro            o «h2» da secção das leituras
src/views/EstudoView.astro             os dois rótulos de camada da leitura de um estudo
src/components/InstrumentoConvergencia.astro  os dois rótulos de camada, que eram as duas
                                       únicas cadeias visíveis deste componente escritas à
                                       mão fora de `strings.mjs` (achado B.4.1)
```

As quatro linhas do inventário da voz («Relance», «Leitura breve», «At a glance»,
«Brief reading») passaram a `retirada` com a razão escrita. O termo continua a
existir na decisão e no brief: o que sai é a superfície.

**As cinco frases de hierarquia rendem-se nos cinco índices** (`/municipios`,
`/distritos`, `/regioes`, `/dominios`, `/areas`), uma vez cada, nas duas edições:
a L4 desce de 10 para 0. A frase do território **pára nos quatro níveis**, e é a
decisão medida da primeira sessão: o repositório não tem correspondência nenhuma
entre as 29 unidades da Carta e as 9 regiões NUTS II, e uma afirmação sobre a
sobreposição das duas divisões não resolve em dado nenhum desta árvore.


### 8.8, 8.9 e §7.5 · o nome do índice, e o menu em dois pesos

**«Números e fontes» / «Numbers and sources»** passa a ser o nome visível do
índice e da entrada do menu, e os títulos das páginas vão com ele (o índice, o
índice dos concelhos e a página de cada concelho no índice). **«livro-razão» fica
onde a decisão o manda ficar:** no Método (o `<h2>` «O livro-razão» continua
`viva` no inventário), no JSON, nos endereços, e em «linha do livro-razão», que
continua a ser o nome de uma linha. A régua desceu de **24 177 para 0**.

**A medida 8.8 da régua aprendeu a não contar o nome de uma LINHA**, e é a
decisão à letra: a mobília do cabeçalho leva o contador das séries atrasadas do
F1.6 («278 linhas do livro-razão»), e contar aquilo era contar o termo que fica.
A régua tira «linha(s) do livro-razão» e «ledger row(s)» antes de contar.

**Duas linhas do inventário saíram do ficheiro em vez de passarem a `retirada`**,
e a razão é a mesma que a primeira sessão escreveu para «Município»:
`ondeVolta()` procura a frase retirada por palavra inteira dentro de qualquer
frase rendida, e a varredura das dicas recolhe «linhas do livro-razão dessas
séries» do `title` de uma contagem da prova. Uma linha `retirada` que a régua acha
por dentro de uma dica fecharia a construção para sempre.

**O menu passa a ter três grupos** (`src/lib/navegacao.mjs`, uma lista só para o
menu e para o rodapé): o do leitor (Concelhos, Estudos, Números e fontes), o do
país (Regiões, Distritos, Domínios, Áreas de governo, Portugal na União Europeia)
e o da casa (Sobre, Método, Correções, Agenda). «Início» fica num grupo seu, à
cabeça, e abaixo de 640 px sai da barra para dentro do menu: não é um dos três
destinos, e ali cada posição custa uma linha de 44 px.

**Medido, a 390 × 664 e a 1 280 × 800**, com a página construída num servidor
local e o Chromium:

| | antes | depois |
|---|---|---|
| a cabeça a 390 | 177,5 px | **213,9 px** |
| a barra a 390 | 54,0 px | **90,4 px** |
| destinos do leitor à vista a 390, sem abrir o menu | 0 | **3** (Concelhos, Estudos, Números e fontes) |
| ligações à vista a 390 com o menu aberto | 12 | **13** |
| a cabeça a 1 280 | 397,9 px | **396,3 px** |
| a barra a 1 280 | 123,2 px | **121,6 px** |

O «antes» a 390 é a mesma página com a navegação escondida, que é exactamente o
que a folha fazia abaixo de 640 px; o «antes» a 1 280 é a mesma página com os
grupos em `display: contents` e um só corpo de letra, que é a fila plana que lá
estava. **A cabeça cresce 36,4 px a 390 e é isso que compra os três destinos no
primeiro ecrã**; a 1 280 não muda (menos 1,6 px).

**O axe continua a 0** (`npm run check:alvos`: 0 nós em violação, 0 graves, em 46
rotas × 2 larguras), e os grupos são `<span>` e não listas de propósito: envolver
as âncoras em `<ul>` dava a cada grupo um papel que um leitor de ecrã anuncia três
vezes por página.

**O rodapé passou a ler a mesma lista** (§7.5). Eram duas listas escritas em dois
ficheiros, e tinham divergido: «Distritos» estava no menu e não estava no rodapé.


### §9.1 · o índice dos domínios deixa de falar da cobertura da casa

O §9 do brief chegou com o `main` de 08.09 (a leitura cruzada do inventário das
frases pelo Codex) e o ponto 1 toca exactamente nas linhas que este bloco estava
a escrever: **as linhas do índice dos domínios que falam de vagas, de «no ar», de
«publicado» e de «conferido** saem da voz do leitor com o 8.13 e o §7.8.

**O que mudou.** Os dois índices dos domínios (o de `/dominios` e a secção da
primeira página) passam a listar **os domínios com página**: o nome, a
**contagem das suas medidas** e a porta; e o domínio cujas medidas vivem dentro de
outro, com a porta para a secção onde elas estão. As dezasseis linhas «ainda sem
medidas conferidas · vaga» passaram ao **Método**, à secção nova «O que se mede a
seguir» (`/metodo#a-seguir`), que é a casa do método e onde a Emenda 15 deixa a
casa falar de si.

**A contagem não é um número da casa sobre o mundo, e por isso não precisa de uma
chave da prova:** é a numeração de uma lista rendida — quantas medidas a página de
chegada lista —, e leva a marca que a casa já usa para isso,
`data-nonledger="numeracao"`, a mesma da posição de um cartão na faixa. É a
correção do que a primeira redação do 8.13 nesta sessão deixou por fazer, com a
razão escrita.

**A descrição de `/dominios` perdeu a segunda metade.** Dizia «As áreas da vida
do país com medidas publicadas, e as que ainda não têm medidas conferidas.», e
desde que as dezasseis passaram ao Método isso deixou de ser verdade sobre o que
está por baixo dela.

**Uma exceção de `VOZ-MARCADORES.md` saiu, e foi o portão a dizê-lo.** A raiz
«confer» na ausência declarada de um domínio deixou de ser precisa quando a frase
saiu do índice; o `check:voz` imprimiu-a como «exceção por exercer» e ela saiu do
ficheiro. **Eram onze, são dez.**

**Mais uma linha saiu do ficheiro do inventário em vez de passar a `retirada`**,
pela armadilha do `ondeVolta()`: «no verified measures yet» vivia por dentro da
descrição inglesa de `/dominios`. Com a descrição corrigida, a armadilha
desapareceu e a linha pôde passar a `retirada` como as outras treze.

---

## Os achados desta sessão contra o brief

**1. A manchete do país continua a falar do Procedimento, e o brief não diz o que
ela passa a ser.** Com os 21 cartões fora da primeira página, a manchete «Portugal
ultrapassa N limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre
M» e a lede que nomeia as medidas fora do limiar ficaram a falar de um quadro que
mudou de página. As duas contagens já abrem a página nova, e nenhuma é um valor
selado (são chaves da prova), por isso nenhuma régua cai. **Uma manchete nova é
uma frase nova sobre o país, e isso é decisão de quem escreve o brief.** O item
8.15 vai medir a manchete no telemóvel; a pergunta de que quadro ela fala fica
para o lugar de direção.

**2. Uma célula da régua dos alvos ficou vermelha por causa de UM item de menu, e
a causa era antiga.** Acrescentar «Portugal na União Europeia» ao menu fez a
cabeça crescer, e a H7 de `tests/acessibilidade/alvos.mjs` («uma porta de OUTRA
linha dentro da área de um algarismo de manchete») caiu em `/en/regions/alentejo`
a 1 280 px. **A causa não era o menu:** com `line-height: 1.12`, a caixa PRÓPRIA
de um algarismo da manchete (48 px a 40 px de corpo, que é a métrica do tipo) é
maior do que o avanço entre as duas linhas (46,8 px), e as caixas dos dois
algarismos sobrepõem-se 1,2 px. Medido: a caixa do «23» vai de 350,3 a 398,3 e a
do «22» começa a 397,1, e os dois pontos de baixo da área do «23» respondem
`a.claim-value` da outra linha. **Na edição portuguesa a mesma manchete quebra
com os algarismos desencontrados e não acontece**: é uma colisão que muda de lado
a cada mudança de altura do cabeçalho, e por isso ia voltar em qualquer item deste
bloco que mexa na cabeça (8.9 e 8.11 mexem).

A correção de 04.09 (Blocking 5) dera ao alvo a altura da caixa de linha, para
que duas áreas seguidas ladrilhem; não chega quando os dois algarismos ficam um
por cima do outro. **A correção é a entrelinha**, e é a única que resolve a
causa: a caixa própria de um algarismo não se encolhe (é a métrica do tipo), e
por isso o avanço tem de ser maior do que ela. `line-height: 1.25` numa manchete
que cita mais do que uma linha (`h1.cabeca-h1[data-citadas]:not([data-citadas='1'])`),
que dá 50 px a 40 px de corpo. O tamanho do tipo não muda e a regra da manchete
não muda: muda o ar entre as linhas de uma frase que cita dois números.

**3. Cinco tetos da régua subiram, e a razão é a única que faz um teto subir.** O
sítio ganhou duas páginas, e a página nova traz a mesma mobília que todas as
outras: L1 +2, L5 +2, L6 +6, 8.5 +2, 8.8 +5. Nenhuma página antiga piorou. A
régua diz por escrito que um teto que suba porque uma página antiga piorou é a
régua a ser desligada.


---

## O que fica por fazer, pela ordem em que se faz

A régua imprime os doze números a qualquer momento
(`node scripts/check-lugar.mjs`), e é por ela que se sabe onde o bloco está.

| # | o que falta | onde se toca | a nota de quem retoma |
|---|---|---|---|
| 1 | **8.5** · «limiar» nunca sozinho | `src/i18n/strings.mjs` (`estado.*`), `Faixa.astro`, `LeituraBreve.astro`, `Peca.astro` | **NÃO é uma troca de duas cadeias.** «dentro do limiar» e «fora do limiar» servem os cartões dos dois quadros da União E os do domínio e do concelho, e nestes o limiar é o LIMITE LEGAL da dívida de uma câmara, que não é da Comissão. O qualificador tem de vir de QUEM FIXOU o limiar daquela medida, e isso é um campo que a declaração da medida ainda não tem. É o primeiro sítio onde este bloco precisa de uma decisão do lugar de direção |
| 2 | **8.4** · a definição de uma linha de cada painel e de cada uma das 21 medidas | `src/data/figuras.mjs`, `UniaoEuropeiaView.astro`, o inventário da voz | cada definição sai da descrição da PRÓPRIA Comissão e é citada com o documento, o endereço, a data de acesso e o excerto literal; onde não houver frase da Comissão que sirva, escreve-se só com os campos da linha e di-lo. **Nunca se inventa.** O §9.3 acrescenta: sem uma palavra sobre a conferência da casa. É o item mais caro do que falta, e o que precisa de leitura das fontes primárias |
| 3 | **8.15** · a manchete no telemóvel | `Manchete.astro`, `src/data/`, a célula A1 de `tests/inicio/porta.mjs` | e com ela a pergunta que o achado 1 desta sessão deixa: **de que quadro fala a manchete do país agora que os 21 cartões mudaram de página** |
| 4 | **8.11 e §7.3** · a prosa e as linhas de frescura fora do primeiro ecrã | `Masthead.astro` (as três leituras da mobília), `MunicipioView`, `DominioView`, `EstudoView`, `LivroView` | é o que endireita a célula A7 de `correcoes-a.mjs`, vermelha desde o F1.6 por a mobília ter quatro leituras onde a célula exige três |
| 5 | **o resto do §9** (pontos 2 a 10) | o inventário da voz, `DominioView`, `Pesquisa.astro` | os pontos 5, 8 e 9 são reclassificações e correções de prosa no inventário e custam pouco; o 2 e o 6 andam com o 8.11; o 7 anda com a busca única do §2.6 |
| 6 | **item 4 do encargo** · as páginas | `MunicipioView`, `RegiaoView`, `DominioView`, os índices, `EstudoView`, `MetodoView` | a linha dos estudos do concelho (§1 e 8.6), a régua da região (§7.6), o domínio (§7.7), os estudos (§7.4 e 8.6), o Método no telemóvel (§7.9) |
| 7 | **item 5 do encargo** · o caminho no cabeçalho (§2.5, com o desenho da §C), a busca é uma (§2.6), «fonte» diz o publicador (§2.4, §7.2, a L6), as datas de frescura (§7.3) | `Caminho.astro` (por escrever), `Pesquisa.astro`, `Provenance.astro`, `gate-html.mjs` | a L5 (7 213) e a L6 (26 174) são os dois números grandes que ainda não desceram, e são estes dois itens |
| 8 | **o fecho** | as capturas, as plantas da L9, o `REVISOES-DO-INVENTARIO.md` | as capturas de `/`, `/municipios`, uma região, um concelho, **a página europeia** e um estudo a 390 × 664 e 1 280 nas duas edições |

---

## Estado ao pausar (04.09, manhã)

**O bloco parou a meio, por ordem do diretor** (o portátil fecha-se; o bloco
continua noutra sessão). O que está no ramo está inteiro e verde: nenhuma
alteração ficou pela metade, e nada foi deixado com um portão vermelho.

| | |
|---|---|
| ramo | `lugar-2026-09-04` |
| ponto de partida | `origin/main` em `306e4c68` |
| última cabeça | a corrida a ler é a primeira linha de `gh run list --branch lugar-2026-09-04` |
| `main` a fundir na sessão seguinte | `69ba3abf` |
| `build` · `verify` · `typecheck` sobre `c0f623c5` | **0** · **0** · **0** |

A §E diz o resto, incluindo o que ficou por acabar no quarto commit e porque é
que a corrida da CI pode esgotar o tempo neste ramo (o `timeout` de 45 minutos
está em `main` e este ramo ainda não o fundiu).

### O que a sessão seguinte faz primeiro

`main` andou: está em **`69ba3abf`** (os ficheiros de registo e o
`timeout-minutes` do `portao.yml` subido para 45). **Funde `origin/main` antes de
tocar em código**, torna a correr os três portões, e só então continua pela lista
de baixo. O `timeout` da CI já não é o aperto que a alínea (b) do encargo
descrevia: o bloco pode acrescentar a régua `check:lugar` ao `verify` com a folga
que ela precisar, e continua a ter de medir e escrever o custo dela.

### O que está feito

| brief | item | estado |
|---|---|---|
| §2.1 | a frase de definição na primeira página | **feito**, nas duas edições |
| §2.3 | o vocabulário fechado | **feito nas cadeias que se rendem**, nas duas edições (a lista exata está na §A abaixo), menos as duas frases de `CONTEXTO_DOS_PAINEIS`, que são do F1.6 |
| §5, L8 | os três portões a 0 | **feito** para o que está no ramo |

Os ficheiros que este ramo tocou, e mais nenhum:

```
src/i18n/strings.mjs                              o vocabulário e as nove chaves novas
src/lib/prova.mjs                                 três origens de contagem («title»)
src/data/concelhos.mjs                            o nome e duas definições das medidas de concelho
src/data/dominios.mjs                             o nome de uma medida e a frase da fronteira
scripts/check-voz.mjs                             a sentinela do arame da classe
tests/inicio/correcoes-a.mjs                      a célula A11
design/especime-v3/INVENTARIO-FRASES.md           39 linhas e a secção do bloco
design/especime-v3/critica/REVISOES-DO-INVENTARIO.md  a entrada «lugar»
design/especime-v3/CHAVES-EN.md                   as chaves novas e as que mudaram
design/especime-v3/medicoes/lugar-construtor.md   este relatório
design/especime-v3/medicoes/lugar-2026-09-04/     os quatro guiões da medição
```

**Nada do que o construtor do F1.6 tem na mão foi tocado:** o bloco do atraso em
`LinhaView.astro`, o cartão do desemprego registado em `MunicipioView.astro`,
`src/data/metodo.mjs`, `CONTEXTO_DOS_PAINEIS` em `src/data/figuras.mjs`,
`src/data/fontes.mjs` e o `DECISIONS.md`. Nenhum desses ficheiros aparece no
`git diff` deste ramo.

**A frase de definição.** `s.identidade` deixa de ser «Um observatório de
Portugal.» e passa a «Um observatório de Portugal: cada número com a sua fonte,
lido por território, por domínio e em estudos.» (e a inglesa, «An observatory of
Portugal: every number with its source, read by territory, by domain and in
studies.»). Continua onde a Emenda 18 a pôs: por baixo da marca, na primeira
página e em mais lado nenhum, sem quem a faz, sem adjetivos, sem porta, sem
algarismo e sem selo; a classe do inventário continua a ser navegação e a rota
`home` continua com autorreferência 0. Origem escrita ao lado dela em
`src/i18n/strings.mjs`: decisão do lugar de direção, `DECISIONS.md` §1.98,
segunda emenda, item 3.

Duas réguas foram atrás dela, e as duas com a razão escrita:

* `scripts/check-voz.mjs` · a **sentinela** do arame da classe por provar era a
  frase antiga, palavra por palavra. Passa a ser a cadeia nova inteira: uma
  sentinela cortada no prefixo deixava de provar que a frase nova se rende.
* `tests/inicio/correcoes-a.mjs` · a célula **A11** exigia `linhas === 1`. Uma
  frase de dezasseis palavras não cabe numa linha a 390 px, e exigir que
  coubesse era exigir que a frase não mudasse. A célula mantém tudo o que media
  (uma ocorrência, a letra da prosa, sem porta, sem algarismo) e troca o «uma
  linha» por um tecto medido de três a 390 px. *Esta régua não corre no `verify`
  nem na CI; corre-se à mão.*

### O que está a meio, e como se retoma

**As cadeias estão escritas e declaradas; falta a vista que as rende.** São
chaves novas em `src/i18n/strings.mjs`, nas duas edições, com a razão escrita ao
lado de cada uma. Nenhuma se rende ainda, e por isso nenhuma está no
`INVENTARIO-FRASES.md`: uma linha `viva` que não se rende fecha a construção, e é
a régua a dizer a verdade. **Quem as usar declara-as no mesmo commit.**

| chave | pt | para onde vai |
|---|---|---|
| `hierarquia.territorio` | O país lê-se em quatro níveis: país, região NUTS II, distrito ou ilha, concelho. | `/municipios`, `/distritos`, `/regioes` (brief §2.2) |
| `hierarquia.dominio` | Um domínio é um assunto da carta dos conteúdos; uma área de governo é um ministério. | `/dominios` |
| `hierarquia.area` | Uma área de governo é um ministério; um domínio é um assunto da carta dos conteúdos. | `/areas` |
| `secoes.medidas` | As medidas | o `<h2>` que hoje diz «Relance» em `MunicipioView.astro` |
| `secoes.leitura` | A leitura de cada medida | os `<h2>` que hoje dizem «Leitura breve» em `MunicipioView.astro` e `DominioView.astro` |
| `nav.rotuloCaminho` | Onde está | o nome da região de navegação do caminho (brief §2.5) |
| `regioes.compararPorta` | Comparar as regiões | a porta da página de uma região para `/regioes` (brief §1) |
| `municipio.estudosPorta` | Os estudos sobre este concelho, no arquivo | a porta da página do concelho para `/estudos?concelho=` |
| `estudos.filtroConcelhoA` · `filtroConcelhoB` · `filtroTudo` | Mostram-se só os estudos sobre  · . · Ver o arquivo inteiro | o estado do arquivo filtrado, escondido do servidor e aceso pelo guião |

**A frase do território pára nos quatro níveis, e é uma decisão medida.** O brief
escreve-a com uma segunda oração, «as regiões não contêm distritos inteiros», e
manda conferi-la nos dados do sítio antes de a escrever. **Foi conferida e não se
escreve.** O repositório não tem correspondência nenhuma entre as 29 unidades da
Carta e as 9 regiões NUTS II: `regiaoDe()`, em `src/data/caop-centroids.mjs`,
devolve «continente», «acores» ou «madeira», que são as três parcelas do mapa e
não as regiões da régua, e `src/data/regioes.mjs` declara as nove regiões sem uma
lista de distritos nem de concelhos. Uma afirmação sobre a sobreposição das duas
divisões não resolve em dado nenhum desta árvore.

```
grep -n "regiaoDe" src/data/caop-centroids.mjs   → devolve continente|acores|madeira
grep -n "distrito\|concelhos" src/data/regioes.mjs → 0 linhas
```

### O que não foi tocado

Nada disto foi começado. A ordem abaixo é a que o construtor seguinte pode
seguir, e é a do custo crescente.

| brief | item | nota para quem retoma |
|---|---|---|
| §1, linha das 21 medidas | o cartão das três medidas partilhadas | os painéis de baixo já saíram no F1.1b; falta a linha única com a porta «Ver no domínio →» |
| §1, linha dos 308 | a busca da primeira página deixa de trazer os 308 resultados | `HomeView.astro` rende `<Pesquisa>` com os 308 `<li>`; `/municipios` já tem lista única (F1.7) |
| §1, linha dos 308 | os nomes da tabela do mapa do domínio passam a portas | `MapaPorConcelho.astro`, `<th scope="row" data-lugar>` → `<a>` |
| §1, linha das 9 regiões | a régua inteira sai da página de uma região | `RegiaoView.astro` rende `<InstrumentoConvergencia>` inteiro; troca-se pela porta `regioes.compararPorta` |
| §1, linha dos estudos | as sinopses saem da página do concelho | `MunicipioView.astro`, `<p class="mun-estudo-frase">`; fica o título e a porta |
| §1, linha dos domínios | «Trabalho» indentado dentro do primeiro domínio | `DominiosView.astro` já sabe o `dentroDe`; falta a forma |
| §2.2 | as cinco frases de hierarquia | as cadeias existem; falta rendê-las e declará-las |
| §2.4 | «fonte» diz sempre o publicador | por medir; a L6 é a comparação do selo com o `source` da linha |
| §2.5 | o caminho no cabeçalho | o desenho está pensado (§C abaixo) e não escrito |
| §2.6 | a busca é uma | `/municipios` tem hoje uma cópia do formulário dentro de `MunicipiosView.astro`, e a primeira página usa `Pesquisa.astro` |
| encargo (a) | o cartão do T3 diz «sem limiar» | medido: 3 ocorrências na página do domínio, 14 na de um concelho, 2 na de uma região, 0 na primeira página |
| encargo (b) | a régua `check:lugar` e o custo dela | por escrever; a L9 (plantas vermelhas e depois verdes) vai com ela |
| §5 | L1 a L7, as capturas | por medir |

### Os três portões, no que está no ramo

| comando | código |
|---|---|
| `npm run build` | **0** |
| `npm run verify` | **0** |
| `npm run typecheck` | **0** |

Os três correram sobre a árvore que este ramo empurra, e os códigos foram lidos
dos ficheiros de saída e não do ecrã. A §D diz o que cada corrida imprimiu.

---

## A · O vocabulário fechado: o que mudou, cadeia a cadeia

A decisão é a `DECISIONS.md` §1.98, segunda emenda, item 2, pela delegação do
diretor de 04.09.2026: «medida», «linha do livro-razão», «estudo», «domínio»,
«área de governo», e para o território «país, região, distrito, concelho», com
«concelho» como a palavra visível e os endereços `/municipios` sem mudar.

### A.1 · O território: «concelho» é a palavra visível

| ficheiro | chave | antes | depois |
|---|---|---|---|
| `src/i18n/strings.mjs` | `nav.municipios` (pt) | Municípios | Concelhos |
| | `municipios.metaTitle` | Municípios · O Estado do País | Concelhos · O Estado do País |
| | `municipios.eyebrow` | Municípios | Concelhos |
| | `municipio.eyebrow` | Município | Concelho |
| | `municipio.metaCauda` | o município, medido · … | o concelho, medido · … |
| | `municipio.metaDescricaoA` | … sobre o município de | … sobre o concelho de |
| | `municipio.voltarMapa` | Voltar ao mapa dos municípios | Voltar ao mapa dos concelhos |
| | `municipio.municipioLink` | A página do município | A página do concelho |
| | `inicio.mapa.svgLabel` | Mapa de pontos dos municípios de Portugal. | Mapa de pontos dos concelhos de Portugal. |
| | `inicio.mapa.readoutHint` · `tecladoHint` | … ler o município · … municípios vizinhos | … ler o concelho · … concelhos vizinhos |

**A edição inglesa não muda.** «municipality» é a tradução de «concelho» e não é
uma segunda palavra para a mesma coisa: o defeito que o leitor de primeira vez
mediu («the same place type is "Municípios", "Os concelhos de Portugal",
"Município" and "nome do concelho"») é do português. A L3 mede «município(s)»,
que é a palavra portuguesa.

### A.2 · A câmara é o organismo; o concelho é o território

É a **exceção ao vocabulário fechado**, e está escrita ao lado de cada cadeia. Um
concelho não orçamenta, não cobra, não paga e não presta contas: quem o faz é a
câmara, que é a palavra que a página do domínio já usava («Quanto deve a minha
câmara?»). Trocá-la por «concelho» seria trocar uma palavra certa por uma falsa.

| ficheiro | antes | depois |
|---|---|---|
| `src/i18n/strings.mjs` | A última prestação de contas do município | A última prestação de contas da câmara |
| | O que o município orçamentou … a prestação de contas é dele. | O que a câmara orçamentou … a prestação de contas é dela. |
| | O município publica | A câmara publica |
| | A Direção-Geral … e o município publicam a dívida … | A Direção-Geral … e a câmara publicam a dívida … |
| `src/data/concelhos.mjs` | Dívida total do município | Dívida total da câmara |
| | … os dados das contas dos municípios. (×2) | … os dados das contas das câmaras. |
| `src/data/dominios.mjs` | Dívida do município contra o limite legal | Dívida da câmara contra o limite legal |
| | … a dívida dos municípios e o que se ganha … | … a dívida das câmaras e o que se ganha … |

### A.3 · «estudo» e não «trabalho»

| ficheiro | chave | antes | depois |
|---|---|---|---|
| `src/i18n/strings.mjs` | `rodape.estudos` | trabalhos no arquivo / works in the archive | estudos no arquivo / studies in the archive |
| | `inicio.portas.estudosA` | ` trabalhos · ` / ` works · ` | ` estudos · ` / ` studies · ` |
| | `area.trabalhosK` (pt) | Os trabalhos | Os estudos |
| | `municipio.estudosK` | Os trabalhos sobre este concelho / The works about this municipality | Os estudos sobre este concelho / The studies about this municipality |
| `src/lib/prova.mjs` | `estudos` (a origem) | trabalhos no arquivo / works in the archive | estudos no arquivo / studies in the archive |
| | `leituras` (a origem) | trabalhos do arquivo com leitura … / archive works … | estudos do arquivo com leitura … / archive studies … |
| | `CHAVE_DAS_PECAS(<área>)` (a origem) | peças na página desta área de governo / pieces on this area of government’s page | estudos e medidas na página desta área de governo / studies and measures on this area of government’s page |

O inglês de `area.trabalhosK` já dizia «The studies» antes deste bloco.

**As origens da prova contam, e a primeira passagem esqueceu-as.** Cada contagem
do sítio leva um `title` com a origem dela, e a varredura das dicas (I79) recolhe
esses `title` como frases da casa: era por aí que «trabalhos no arquivo» e «works
in the archive» continuavam a render-se na primeira página depois de a cadeia de
`strings.mjs` já ter mudado. Foi o portão da voz que o disse, e não a leitura.

### A.4 · O que **não** mudou, e porquê

* **Os endereços.** `/municipios`, `/en/municipalities`, `?ambito=municipio:` e
  os slugs continuam como estão: é o que a decisão escreve à letra.
* **«peça», nas frases da política de IA** (`src/data/politica-ia.mjs`: «nenhum
  humano revê cada peça antes de sair», «e não peça a peça», «Qualquer peça que
  nomeie uma pessoa»). São as palavras aprovadas pelo diretor, copiadas da
  `POLITICA-DA-AUTONOMIA.md`, e a regra da casa é que o que se copia de uma fonte
  fica como a fonte o escreveu. **A régua do bloco tem de as isentar por escrito**,
  e não por saltar as rotas do Método e do Sobre.
* **«trabalho» no sentido de emprego** («Quantas procuram trabalho e não
  encontram?», «custo unitário do trabalho», «Trabalho, Solidariedade e Segurança
  Social»). A L3 mede «trabalho(s)» **como nome de estudo**, e estas não o são.
* **«indicador»** nos documentos alojados e nas páginas de leitura: são texto
  transcrito, e o §3 do brief põe as duas famílias fora do bloco.

---

## B · As medições de partida (sobre `dist/` de `306e4c68`)

Todas correm sobre a construção verde do ponto de partida, com os guiões que
ficaram em `design/especime-v3/medicoes/lugar-2026-09-04/`.

### B.1 · As palavras do vocabulário, no texto da casa

`node design/especime-v3/medicoes/lugar-2026-09-04/palavras.mjs dist` conta as
ocorrências **fora de toda a origem declarada** (`data-claim`, `data-linha-claim`,
`data-verbatim`, `data-nonledger`, `data-agenda`, `data-registo*`, `data-lugar`,
`data-nome`, `data-medida-*`), em 7 238 páginas:

| palavra | ocorrências | páginas |
|---|---|---|
| `Municípios` | 7 232 | 3 615 |
| `Município` (fora de «Municípios») | 327 | — |
| `municípios` | 941 | 313 |
| `município` | 1 063 | 325 |
| `indicador` | 51 | 8 |
| `indicadores` | 16 | 6 |
| `peça` | 10 | 5 |
| `peças` | 5 | 3 |
| `Trabalho` | 313 | 310 |
| `trabalho` | 30 | 19 |
| `trabalhos` | 8 | 8 |
| `Relance` | 325 | 324 |
| `Leitura breve` | 327 | 326 |
| `Painel` | 3 616 | 3 614 |

As duas contagens grandes são mobília: «Municípios» é o item do menu em cada
página portuguesa, e «Painel» é a leitura do painel europeu no cabeçalho. As
outras estão quase todas nos documentos alojados e nas páginas de leitura, que o
§3 do brief põe fora deste bloco.

### B.2 · Onde cada palavra se rende, por rota

`node design/especime-v3/medicoes/lugar-2026-09-04/contexto.mjs dist` imprime uma
página por rota e por edição, com os blocos de texto da casa que mordem. O que
interessa para o trabalho que falta:

* **`/` (pt)** · «Relance» e «Leitura breve» nos dois botões do comando das duas
  densidades (é a utilização que a decisão permite: são os nomes das densidades),
  «Os indicadores do painel do Procedimento…» e «Os indicadores que o
  livro-razão guarda…» nas duas frases de contexto dos painéis, e « trabalhos · »
  na fila das portas.
* **`/dominios/<slug>` (pt)** · «Leitura breve» como `<h2>` de secção, a frase da
  fronteira com «a dívida dos municípios», e duas frases com «indicador» que são
  campos da fonte.
* **`/municipios/<slug>` (pt)** · «Município», «Relance», «Leitura breve»,
  «Voltar ao mapa dos municípios» e as duas definições da DGAL.
* **`/regioes` e `/regioes/<slug>` (pt)** · «Leitura breve», que vem de
  `InstrumentoConvergencia.astro`.
* **`/areas` e `/areas/<slug>` (pt)** · «Os trabalhos» e o nome da área
  «Trabalho, Solidariedade e Segurança Social».
* **`/estudos` (pt)** · « trabalhos no arquivo» e as sinopses dos estudos.

**Duas destas frases não são deste bloco.** «Os indicadores do painel do
Procedimento…» e «Os indicadores que o livro-razão guarda…» vivem em
`CONTEXTO_DOS_PAINEIS`, em `src/data/figuras.mjs`, que é do construtor do F1.6 a
correr em paralelo. Ficaram por tocar de propósito, e o «indicador» delas conta
para a L3: **a sessão seguinte tem de as passar depois de o F1.6 fundir**, ou de
combinar com quem lá está.

### B.3 · O mesmo, depois (sobre o `dist/` deste ramo)

O mesmo comando, sobre a construção verde deste ramo. Uma palavra que caiu para
uma página de `estudos/<slug>/documento` ou `/texto` está num documento alojado
ou numa página de leitura, que o §3 do brief põe fora deste bloco.

| palavra | antes | depois | onde ficam as que ficam |
|---|---|---|---|
| `Municípios` | 7 232 | **4** | 2 documentos alojados |
| `Município` (fora de «Municípios») | 327 | **23** | 5 documentos alojados |
| `municípios` | 941 | **16** | 4 documentos alojados |
| `município` | 1 063 | **128** | 15 páginas: os documentos alojados, e as **sinopses dos estudos** em `src/data/studies.mjs` («no município de Évora»), que este bloco não tocou |
| `trabalhos` | 8 | **1** | `/metodo`, na cadeia de `src/data/metodo.mjs` que é do construtor do F1.6 |
| `trabalho` | 30 | **23** | o sentido de emprego, e os documentos alojados |
| `Trabalho` | 313 | 313 | o nome do domínio e o da área de governo, que são nomes e não a palavra |
| `indicadores` | 16 | 16 | os documentos alojados, e as duas frases de `CONTEXTO_DOS_PAINEIS` na primeira página, que são do F1.6 |
| `indicador` | 51 | 51 | os documentos alojados, e dois campos da fonte na página do domínio |
| `peça` · `peças` | 10 · 5 | 10 · 5 | as frases da política de IA e os documentos alojados (§A.4) |
| `Relance` | 325 | 325 | por fazer: são os `<h2>` de secção que a §1.98 manda mudar |
| `Leitura breve` | 327 | 327 | idem |
| `Painel` | 3 616 | 3 616 | a leitura do painel europeu no cabeçalho, que é a utilização permitida |

```
node design/especime-v3/medicoes/lugar-2026-09-04/palavras.mjs dist
```

### B.4 · Três achados que a sessão seguinte precisa

1. **`InstrumentoConvergencia.astro:308` escreve a cadeia à mão**, fora de
   `src/i18n/strings.mjs`:
   `<p class="layer-tag">{lang === 'pt' ? 'Leitura breve' : 'Brief reading'}</p>`.
   É o rótulo de uma camada de um instrumento, que é a utilização permitida da
   palavra, mas a cadeia tem de vir da tabela como todas as outras.
2. **`/municipios` não lê `?concelho=`.** A busca da primeira página é um
   `<form method="get">` para `/municipios`, e `public/js/municipios.js` filtra a
   lista pelo que está escrito no campo, que numa construção estática chega
   vazio. O leitor que submete cai na lista inteira. Sem isso, a tarefa «o meu
   concelho» custa dois toques e uma varredura, e não dois toques.
3. **A tabela do mapa do domínio é invisível à régua dos alvos.** Vive dentro de
   um `<details>` fechado, e `tests/acessibilidade/alvos.mjs` salta os elementos
   cuja caixa mede zero (`if (r.width === 0 && r.height === 0) continue;`).
   Transformar os 308 nomes em portas não acrescenta alvos medidos à H2.

### B.5 · «sem limiar», por página (encargo (a))

`grep -o 'sem limiar' <ficheiro> | wc -l`, sobre `dist/` de `306e4c68`:

| página | ocorrências |
|---|---|
| `/` | 0 |
| `/dominios/economia-e-financas-publicas` | 3 |
| `/municipios/evora` | 14 |
| `/regioes/alentejo` | 2 |

A palavra é rendida por `Faixa.astro` (o cartão) e por `Peca.astro` (a leitura).
Pela Emenda 1 sai do **cartão** e fica na **leitura**: a correção é uma linha em
`Faixa.astro` (não desenhar a palavra quando `estado === 'sem'`, como já não
desenha o quadrado) e uma frase nova na leitura do T3 em `DominioView.astro`,
onde hoje o bloco do limiar não se rende de todo.

---

## C · O caminho no cabeçalho: o desenho, por escrever

Fica aqui para não se pensar duas vezes.

* **Onde vive.** Um componente `Caminho.astro` dentro do `<header>` do
  `Masthead.astro`, a seguir à marca, como `<nav aria-label={s.nav.rotuloCaminho}>`.
* **Porque é que não custa uma linha ao inventário da voz.** `blocosDe()` mede
  `p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption` e
  `span.eyebrow`, e um `<nav>` com `<a>` e `<span>` não é nenhum deles. Um
  `<p class="caminho">` seria um bloco por classificar em 7 237 páginas.
* **De onde vêm os degraus.** Um `src/lib/caminho.mjs` com uma tabela de pais por
  chave de rota (`municipio` → `municipios` → `home`, `linha` → `livro` → `home`,
  e por aí) e um resolvedor de nome de folha por rota, a ler os mesmos ficheiros
  que as vistas já leem. O nome de uma linha do livro-razão vem da escada de
  `src/lib/nomes.mjs` e **não se rende quando ela não dá texto**, que é a regra
  que `NomeDaMedida.astro` já escreve.
* **O que fica de fora, e é o §3 do brief:** os documentos alojados (`documento`)
  e as páginas de leitura (`texto`). A régua da L5 tem de nomear as duas exceções
  com a razão, e não saltá-las em silêncio.
* **As marcas de cada folha:** `data-lugar` para um concelho, um distrito ou uma
  região; `data-nome="dominios"` para um domínio; `data-nome="areas"` para uma
  área; `TituloDeTrabalho` para um estudo, que é o que põe a marca de língua na
  edição inglesa e o que a L6 do `check:lingua` exige.

---

## D · As corridas

Os três portões, sobre a árvore deste ramo, com os códigos lidos dos registos e
não da memória:

| comando | código | registo |
|---|---|---|
| `npm run build` | **0** | `build3.log`, 7 222 páginas em 4 m 31 s; a voz com 815 frases distintas em 1 382 rotas, autorreferência 0, nada por classificar, 789 linhas do inventário (684 vivas, todas rendidas; 105 retiradas, nenhuma rendida) |
| `npm run verify` | **0** | `verify.log`, as vinte e uma passagens da cadeia, incluindo `check:alvos` e `check:indice --navegador` |
| `npm run typecheck` | **0** | `typecheck.log`, sem uma linha de saída |

```
npm run build     > build3.log 2>&1;    echo $? > build3.exit     → 0
npm run verify    > verify.log 2>&1;    echo $? > verify.exit     → 0
npm run typecheck > typecheck.log 2>&1; echo $? > typecheck.exit  → 0
```

**A régua do bloco (`check:lugar`) não existe**, e por isso as L1 a L7 não têm
número. É a primeira coisa que a sessão seguinte escreve depois de fundir o
`main`: sem ela, o que este bloco arrumou fica guardado pela leitura de quem revê
o diff, e não por uma construção que fecha.

### As réguas de fora da cadeia

`tests/inicio/correcoes-a.mjs` mudou (a célula A11) e **não foi corrida**: abre um
navegador e não está no `verify` nem na CI, e o bloco parou antes de a correr. A
alteração é a que está escrita na §«O que está feito», e a célula tem de ser
corrida na sessão seguinte antes de o bloco fechar.

---

## E · A cabeça e a corrida do portão

O ramo tem quatro commits sobre `306e4c68`, e a cabeça deste relatório é a do
quarto. Um commit não pode conter o seu próprio resumo, e por isso o que aqui se
escreve é o do terceiro, que é o que a CI conferiu primeiro.

| | |
|---|---|
| ramo | `lugar-2026-09-04` |
| ponto de partida | `origin/main` em `306e4c68` |
| `main` a fundir na sessão seguinte | `69ba3abf` |
| cabeça com os três portões corridos à mão | `c0f623c5` |
| corrida `portao` dessa cabeça | `33854329164`, cancelada pelo push seguinte (ver abaixo) |

Os códigos foram lidos dos ficheiros de saída de cada corrida, e não do ecrã.

| corrida | `build` | `verify` | `typecheck` |
|---|---|---|---|
| a árvore de `c0f623c5` | **0** | **0** | **0** |
| a árvore do quarto commit | **0** | por acabar | **0** |

**O `verify` do quarto commit não chegou ao fim, e diz-se em vez de se supor.**
Ficou no oitavo dos vinte e um passos quando a sessão fechou, e não por um
vermelho: o portátil tinha, ao mesmo tempo, a construção de outra worktree
(`toque-2026-09-04`) a ocupar um núcleo inteiro, e a cadeia do `verify` abre
navegadores. O que separa esta árvore da de `c0f623c5`, onde o `verify` correu
verde, são **três comentários sem travessões e esta secção**: nenhuma linha de
código, nenhuma cadeia, nada que chegue ao `dist/`. Quem retomar o bloco corre-o
outra vez, que é de qualquer modo o primeiro passo depois de fundir o `main`.

**A corrida da CI pode esgotar o tempo, e a razão está escrita.** Este ramo sai
de `306e4c68`, onde o `portao.yml` ainda diz `timeout-minutes: 30`; a subida para
45 está em `main`, em `69ba3abf`, que este ramo não fundiu. A corrida
`33854329164` ia nos vinte minutos e ainda dentro do `npm run build` quando a
sessão fechou. **Se ela sair vermelha por tempo, não é um defeito deste ramo:** a
fusão do `main` na sessão seguinte resolve-a, e o primeiro sinal a acreditar é a
corrida que vier depois dessa fusão.

**A corrida a ler é sempre a ÚLTIMA do ramo, e não a que está nesta tabela.** O
`portao.yml` tem `concurrency` com `cancel-in-progress: true` sobre
`${{ github.ref }}`: um segundo push no mesmo ramo **cancela** a corrida do
primeiro. A corrida `33854329164`, que este relatório nomeia porque é a da cabeça
que ele podia nomear, foi cancelada pelo push do commit que o escreve. Um
relatório não pode conter o resumo do seu próprio commit nem o número da corrida
que esse commit dispara, e é por isso que a regra fica escrita em vez do número:
`gh run list --branch lugar-2026-09-04`, e lê-se a primeira linha.

**Não se funde em `main`.** O bloco está a meio, e a fusão é do lugar de direção
depois de o bloco fechar.
