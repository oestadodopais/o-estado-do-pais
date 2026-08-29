# Os nomes do mapa ao lado, e os dois painéis com nome · relatório do construtor

*Bloco `inicio-lista-2026-08-29`, saído de `main` `a76f829`, num worktree. Construtor: Claude Opus 5. Brief: `design/especime-v3/briefs/BRIEF-inicio-lista-e-paineis.md`. Todas as medições correram em Chromium sem cabeça sobre o `dist/` construído, nas duas edições, e cada número desta página saiu de uma corrida que se diz ao lado dele.*

## 0 · O que ficou feito, e o que não ficou

**Feito:** os 29 nomes saíram de dentro do mapa e são agora um bloco irmão da cabeça e do instrumento; no ecrã largo ficam na coluna esquerda, por baixo da manchete e ao lado do mapa, e o mapa e os nomes respondem-se nos dois sentidos, com o rato e com o teclado, sem uma linha de JavaScript. Abaixo de 1024 os nomes vão em linha, separados por ponto, com o alvo de 44 px feito de `padding`. Os dois painéis levam nome, e a contagem de cada um vem da prova.

**Não feito, e a razão está medida na §5:** a regra da folha que esconde um grupo acima da largura em que ele deixa de fazer falta (ponto 2 do brief). O mecanismo está construído e medido, e o número está na marcação; o que não se ligou foi o interruptor, porque as duas medidas de «alvo de 44 px» que a casa usa não dão a mesma resposta, e pela medida que a casa adoptou na I82 esconder o grupo do continente tira a 18 distritos o único alvo de 44 px que eles têm. **Parei e digo**, como o brief manda: a Emenda 20c é do diretor e a §1.84 é do lugar de direção. Fica também em `ISSUES.md`, I101.

## 1 · As medições, antes e depois

### 1.1 · A altura da primeira página, nas duas edições

Medida em `document.documentElement.scrollHeight`, com o servidor de ficheiros da casa e o tipo carregado (`document.fonts.ready`). O «antes» é `a76f829`; o «depois» é a construção deste ramo.

| janela | página pt | página en | menos |
|---|---|---|---|
| 320 | 8 314 → **7 697** | 8 295 → **7 661** | 617 · 634 px |
| 360 | 8 062 → **7 411** | 8 142 → **7 508** | 651 · 634 px |
| 390 | 8 034 → **7 339** | 8 008 → **7 313** | 695 · 695 px |
| 430 | 7 930 → **7 173** | 7 933 → **7 176** | 757 · 757 px |
| 768 | 5 665 → **5 188** | 5 758 → **5 281** | 477 · 477 px |
| 1024 | 4 991 → **3 901** | 4 950 → **3 860** | 1 090 · 1 090 px |
| 1280 | 4 791 → **4 003** | 4 775 → **3 987** | 788 · 788 px |

### 1.2 · A altura da lista, e a ocupação da coluna esquerda

| janela | tela do mapa | lista antes | lista depois |
|---|---|---|---|
| 320 | 320 px | 1 237,6 | **516,4** |
| 360 | 360 px | 1 237,6 | **516,4** |
| 390 | 390 px | 1 237,6 | **472,4** |
| 430 | 430 px | 1 237,6 | **428,4** |
| 768 | 281 px | 814,8 | **296,4** |
| 1024 | 340,1 px | 1 237,6 | **418,8** |
| 1280 | 490 px | 814,8 | **418,8** |

A 1280, antes: a grelha da cabeça media **1 552,1 px**, a cabeça acabava a 709 e a grelha a 1 969,4, e a lista estava na coluna direita (abcissa 696), por baixo do mapa. Eram **1 260,4 px de papel vazio** na coluna esquerda, por baixo da manchete, que é o que o diretor viu.

A 1280, depois: a lista está na coluna esquerda (abcissa 94, a mesma da cabeça, com a mesma largura de 582 px), começa a 735 (a cabeça acaba a 709) e acaba a 1 153,8; a coluna do instrumento acaba a 1 136,6. A grelha mede **736,5 px**, contra 1 552,1. A lista passa 17,2 px para além do fim do mapa, e é isso que a célula L3 mede, com um limite de 60 px.

A 1024: a grelha mede **659,7 px**, a lista está em 41 (a banda da cabeça), começa a 644,8 e mede 418,8.

### 1.3 · Que grupos se veem, em cada largura, e porquê

Os três grupos estão à vista nas sete larguras e nas duas edições (célula L4). A razão de cada um é a unidade mais pequena da sua parcela no mapa, medida no navegador pela caixa da área, contra os 44 px:

| janela | tela | continente | Madeira | Açores |
|---|---|---|---|---|
| 320 | 320 | 40,2 px | 7,9 px | 1,4 px |
| 360 | 360 | 45,2 px | 8,9 px | 1,6 px |
| 390 | 390 | 49,0 px | 9,6 px | 1,7 px |
| 430 | 430 | 54,0 px | 10,6 px | 1,9 px |
| 768 | 281 | 35,3 px | 6,9 px | 1,3 px |
| 1024 | 340,1 | 42,7 px | 8,4 px | 1,5 px |
| 1280 | 490 | 61,5 px | 12,1 px | 2,2 px |

A construção declara a fronteira de cada parcela em `data-alvo-abaixo-de`, calculada em `parcelasDoMapa()`: **351 px** para o continente, **1 787 px** para a Madeira e **9 925 px** para os Açores. A célula L9 confronta a declaração com a medição do navegador nas sete larguras, nos dois sentidos, e é verde: abaixo da fronteira há sempre pelo menos uma unidade sob 44 px, e a partir dela não há nenhuma.

### 1.4 · A altura de alvo de cada nome

O nome mais baixo mede **44,0 px** em todas as sete larguras e nas duas edições, e nenhum par de nomes que partilha a coluna se sobrepõe (célula L5: 29 nomes, 0 sobreposições, 20 colunas na forma em linha até 430, 25 a 768, 4 na forma em coluna a 1024 e a 1280).

### 1.5 · O par de estado, nos dois sentidos

Medido no estilo computado, a 1280, sobre Lisboa, com Faro como testemunha (célula L6):

| estado | contorno da área | sublinhado do nome |
|---|---|---|
| em repouso | 1 px | 1 px |
| rato no nome | **3 px** (as outras 28 ficam em 1 px) | 3 px |
| rato na área | 3 px | **3 px** (Faro fica em 1 px) |
| Tab até ao nome | **3 px** | 3 px |

O `Tab` põe-se a partir do nome anterior e mede-se `document.activeElement`, porque um `focus()` de guião não acende `:focus-visible` em todos os motores e o que interessa é o que vê quem carrega em Tab.

### 1.6 · O contraste da marca

`node scripts/medir-contraste.mjs`, sobre `src/styles/tokens.css`, nos dois temas:

* `ink / paper` (texto, limiar 4,5): **16,39:1** no claro, **15,38:1** no escuro;
* `rule-strong / paper` (objeto de interface, limiar 3): **3,47:1** no claro, **5,80:1** no escuro.

A marca não introduz cor nenhuma. Do lado do mapa é o mesmo par `ink / paper` com o traço de 1 px a passar a 3 px. Do lado do nome, o sublinhado passa de 1 px para 3 px e a sua tinta passa de `rule-strong` para a do texto, ou seja de 3,47:1 para 16,39:1 no claro: a cor melhora, e a marca sobrevive sem ela porque a espessura triplica. A célula L7 mede isto por construção, e o estrago «a marca só por cor» é visto vermelho.

### 1.7 · O peso

* A primeira página passou de **145,2 KB** para **152,0 KB** de HTML, medido pela célula M4a de `tests/inicio/mapa-distritos.mjs`. Os caminhos do desenho ficam nos mesmos 29,9 KB.
* Desses 6,8 KB, **6 461 bytes** são o bloco `<style>` do par: 58 selectores, 29 por sentido, compostos das 29 unidades do artefacto.
* O resto são as três marcas `data-alvo-abaixo-de` e as duas linhas de nome dos painéis.

## 2 · As decisões de forma, e porquê

### 2.1 · A colocação: um bloco irmão, e três colocações declaradas

A lista era filha de `MapaRespira.astro`, e por isso vivia na coluna do instrumento. Uma lista dentro do mapa não muda de coluna: para ir para a esquerda teria de ser rendida uma segunda vez, e duas rendições dos mesmos 29 nomes seriam 58 ligações para 29 páginas. Passou a ser um componente próprio (`src/components/inicio/ListaDosNomes.astro`), rendido por `HomeView` como terceiro filho de `.cabeca-grelha`. A célula L1 mede que continua a ser uma só: 29 nomes, 29 slugs distintos, 29 destinos distintos.

Acima de 1024 as três colocações são explícitas e não são decoração: a cabeça na coluna 1 fila 1, a lista na coluna 1 fila 2, o instrumento na coluna 2 a atravessar as duas filas. Com colocação automática, o terceiro filho caía na fila 2 por acaso e o mapa ficava preso à fila 1, sem nada ao lado dos nomes.

Abaixo de 640 a folha dissolve a grelha (`display: contents`) e numera os itens da coluna; a lista leva `order: 5`, logo a seguir ao mapa, que é onde ela estava quando vivia dentro dele. Sem número, a ordem do documento punha-a antes do comando.

### 2.2 · O par de estado: `:has()` composto do artefacto, e não um guião

O CSS não sabe dizer «o elemento cujo atributo vale o mesmo que aquele». Um par entre 29 áreas e 29 nomes pede uma regra por unidade, e as 29 regras não podem ser escritas à mão numa folha estática: isso seria uma segunda lista dos slugs ao lado da do motor, que é o que a fronteira do mapa proíbe. São compostas na construção, do mesmo `paisDoMapa()` que desenha as áreas, e vão no documento num `<style is:inline>`.

**O que custa o `:has()`:** 6 461 bytes por página, medidos, em duas páginas (`/` e `/en`). Duas famílias de selectores, uma por sentido, cada uma com um bloco de declarações só; escrever 58 blocos seria 58 vezes as mesmas duas declarações.

**O que custaria o guião:** escrevi um para medir, e não entrou. São 26 linhas e **1 202 bytes** sem minificação (`design/especime-v3/medicoes/` não o guarda; foi medido e deitado fora). É cinco vezes mais leve, e mesmo assim foi recusado por duas razões, e nenhuma é o peso:

1. um par de estado que só existe com JavaScript é um par que não existe para quem o desliga, e a primeira página desta casa promete-se inteira sem script;
2. o guião da primeira página vive em `public/js/inicio.js`, e este bloco não toca em `public/`.

Há uma terceira razão, mais funda: o que `HomeView.astro` escreve na sua cabeça é que «o script troca `hidden`, `open`, `aria-pressed` e `aria-current`, e mais nada». Uma classe de marca visual seria uma coisa nova nessa lista, e a lista existe para não crescer.

### 2.3 · A forma em linha, e o alvo por `padding`

Abaixo de 1024 os nomes correm uns a seguir aos outros com um ponto pelo meio, e o alvo de 44 px faz-se de 12 px de `padding` em cima e em baixo sobre uma linha de 20 px. Isso põe 29 nomes em 4 a 6 linhas em vez de 29, e é o que corta 617 a 757 px da altura da página no telemóvel.

**O ponto é da folha e não da marcação**, e a razão é a régua da voz: um separador escrito no `<li>` punha texto fora da ligação, e um `<li>` com texto fora de um comando é uma frase da casa por classificar (`textoForaDeComandos` em `scripts/medir-defeitos.mjs`). O separador é decoração, e vive onde a decoração vive.

**O ponto é de quem vem antes, e o item é atómico.** A primeira forma desta folha punha o separador a abrir o item seguinte, e a captura mostrou o defeito: uma linha começava por «· Ilha de São Jorge» e outra acabava em «Castelo Branco ·», porque há oportunidade de quebra dos dois lados de uma caixa em linha. O item passou a ser um `inline-block` com `white-space: nowrap`: dentro dele nada se parte, nem o nome nem o ponto que o segue, e a quebra só pode acontecer entre dois itens.

### 2.4 · Os 44 px contra os «uns 250 px» do brief

O brief pede o continente em duas colunas de nove e uns 250 px de altura. As duas coisas juntas só cabem com linhas de 27 px, e a casa mede o alvo a 44 px também a 1280: a célula M1c de `tests/inicio/mapa-distritos.mjs` exige, a 1280, que cada nome da lista seja um alvo de 44 px, e é uma célula que já estava verde antes deste bloco.

**Escolhi os 44 px**, e a lista mede **418,8 px** em vez de 250. O que o brief queria com o número continua feito: a lista fica ao lado do mapa (acaba a 1 153,8 quando o mapa acaba a 1 136,6, dentro dos 1 260,4 px que a coluna esquerda tinha vazios) e a página deixa de crescer (a grelha passa de 1 552,1 para 736,5 px). Baixar para 250 px era baixar o alvo para 27 px, e isso é uma decisão de régua e não de folha: ou a casa passa a ter duas alturas de alvo, uma para o dedo e outra para o rato, ou não passa. Não a tomei.

### 2.5 · Os dois painéis

A linha de nome é a mesma forma nos dois (`.painel-nome`, o mesmo bloco de declarações que `.social-titulo` já tinha). O nome é o que a fonte dá ao painel; a contagem é um `<ValorDaProva>`, que é a marca que o portão de HTML reconta por conta própria: `painel_com_limiar` para as 13 e `painel_social_total` para as 8. Nenhum algarismo está escrito numa cadeia, e a célula L8 mede exactamente isso, nas duas edições, e vê vermelho quando um deles é escrito à mão.

**Os espaços estão dentro das cadeias**, e não é descuido: entre uma expressão e um elemento, uma mudança de linha do gabarito não é um espaço, e as duas metades colavam-se ao algarismo. Foi visto numa captura e corrigido. É a mesma forma da manchete, que escreve «Portugal ultrapassa » com o espaço lá dentro pela mesma razão.

**O fio passou para o nome.** `.painel` abria com um `border-top`, e com um nome por cima o fio ficava por baixo dele. A regra mudou-se para `.painel-nome`, e desliga-se na grelha que vem logo a seguir a um nome: as duas outras páginas que rendem `.painel` (a de um concelho e a de uma região) ficam exactamente como estavam. O fio entre os dois painéis já existia, em `.social`, e não mudou.

**`.social-titulo` não foi renomeada**, e a razão é medida: `scripts/design-bundle.mjs` procura essa classe pelo nome, e uma renomeação partia-o em silêncio. As duas classes partilham o mesmo bloco de declarações, com a razão escrita ao lado.

### 2.6 · O que não mudou

Nenhuma frase nova da casa. As oito linhas que entraram no inventário são quatro dicas de chaves da prova (a glosa que `<ValorDaProva>` põe no `title`, que a régua lê desde a I79) e as quatro linhas de nome dos dois painéis, nas duas edições; duas linhas saíram, que eram o nome do Painel Social sozinho, e saem em vez de ficarem `retirada` porque a casa não tirou aquele nome de lado nenhum. Os nomes das parcelas continuam declarados `data-lugar`, e os 29 nomes das unidades continuam inteiros dentro das suas ligações, que é o que os mantém fora do inventário. Os manifestos, os ícones, o cabeçalho e `public/` não foram tocados.

## 3 · As células e os estragos

**A régua nova, `tests/inicio/lista.mjs`: 46 células, todas verdes.**

| célula | o que mede | quantas |
|---|---|---|
| L1 | uma lista só: 29 nomes, 29 slugs, 29 destinos | 2 (pt, en) |
| L2 | a lista na coluna esquerda, por baixo da manchete e ao lado do mapa | 2 (1024, 1280) |
| L3 | a grelha não passa mais de 60 px da coluna do mapa | 1 |
| L4 | nenhuma unidade sem alvo tocável: todos os grupos e nomes à vista | 14 (7 larguras × 2 edições) |
| L5 | cada nome à vista é um alvo de 44 px, e nenhum se sobrepõe | 14 |
| L6 | o par nos dois sentidos, com o rato e com o teclado, e só naquela unidade | 3 |
| L7 | a marca não é só cor | 1 |
| L8 | o nome de cada painel traz a contagem da prova | 2 |
| L9 | `data-alvo-abaixo-de` contra a medição do navegador | 7 |

**Oito estragos plantados, oito vistos vermelhos** (`node tests/inicio/lista.mjs --vermelhos`). Nenhum toca em disco: são transformações do HTML no caminho entre o ficheiro e o navegador, como na régua do mapa.

| estrago | células que o apanham |
|---|---|
| uma ligação duplicada: o mesmo nome duas vezes | L1·pt, L1·en (30 nomes para 29 slugs) |
| a lista de volta para baixo do mapa, a 1280 | L2·1024, L2·1280, L3 (folga 863,6 px) |
| um grupo escondido numa largura em que uma unidade fica abaixo dos 44 px | L4 a 320, 360, 390 (18 nomes escondidos) |
| um alvo com 40 px | L5 em todas as larguras (o mais baixo 40,0) |
| o rato num nome sem resposta do mapa (a folha do par retirada) | L6a, L6b, L6c (1 px → 1 px) |
| a marca só por cor | L6a, L6b, L6c, e L7 |
| o nome de um painel com uma contagem escrita à mão | L8·pt, L8·en («14» sem `data-prova`) |
| o `data-alvo-abaixo-de` de um grupo com o número trocado | L9 a 320, 768, 1024 |

**As réguas que já existiam, na construção deste ramo:** `tests/inicio/mapa-distritos.mjs` 43 células, todas verdes (M1c e M2·430c, que medem o alvo de cada nome da lista, incluídas); `tests/inicio/mapa-navegacao.mjs` 9 de 9; `tests/inicio/app.mjs` 39 de 39. `tests/inicio/areas.mjs` dá 20 de 22, e a célula vermelha é anterior a este ramo: fica em `ISSUES.md`, I100, com a medição.

**Os portões:** `npm run build`, `npm run verify` e `npm run typecheck` saem todos a 0. A régua da voz diz «autorreferência 0 · nada por classificar · 582 linhas do inventário com bloco (506 vivas, todas rendidas; 76 retiradas, nenhuma rendida)».

## 4 · Os commits

| commit | o quê |
|---|---|
| `3adb668` | os nomes na coluna esquerda: a lista sai de `MapaRespira` para `ListaDosNomes.astro`, `parcelasDoMapa()` ganha a largura por parcela, o par de estado em `:has()`, a forma em linha no telemóvel, os dois painéis com nome, e as oito linhas do inventário |
| `a8f4ad0` | `tests/inicio/lista.mjs`: as 46 células e os oito estragos plantados |
| o terceiro | este relatório e as duas linhas de `ISSUES.md` (I100 e I101). Não leva aqui o seu próprio resumo, porque escrevê-lo mudava-o |

*Os três saem de `a76f829`, no ramo `inicio-lista-2026-08-29`. Cada um leva os dois trailers, e cada `git add` nomeou os caminhos um a um.*

## 5 · Onde parei, e digo

O ponto 2 do brief manda esconder o grupo de uma parcela nas larguras em que ela não precisa da rede de alvos, e nomeia a fonte do número: `parcelasDoMapa()`. Construí o mecanismo e medi-o. **O interruptor não ficou ligado, e a razão é que as duas medidas de «alvo de 44 px» que a casa usa não dão a mesma resposta.**

**A medida da construção é a CAIXA da unidade.** É a única que ela pode ter: `src/lib/mapa.mjs` escreve, na sua cabeça, que ali não se calcula geometria nenhuma, e o artefacto do motor dá a caixa e o ponto representativo e mais nada. Por ela, o continente deixa de precisar da rede a partir de uma tela de 351 px.

**A medida da casa é o QUADRADO INSCRITO, desde a I82.** `tests/inicio/mapa-distritos.mjs` escreve porquê, e mede-o no navegador: «o centro da caixa da Ilha da Madeira cai fora do polígono da Ilha da Madeira», e numa forma côncava, que é o que uma costa é, quase nada da caixa é a forma.

As duas discordam, e discordam exactamente onde o ponto 2 age. Medido a 29.08 sobre `a76f829`, e igual na construção deste ramo:

| janela | tela | continente: chega aos 44 px pela caixa | pelo quadrado inscrito |
|---|---|---|---|
| 320 | 320 | 16 de 18 | **0 de 18** |
| 360 | 360 | 18 de 18 | **0 de 18** |
| 390 | 390 | 18 de 18 | **1 de 18** (Beja) |
| 430 | 430 | 18 de 18 | **3 de 18** (Beja, Castelo Branco, Évora) |
| 1280 | 490 | 18 de 18 | 5 de 18 |

Esconder o grupo do continente a 360, a 390 e a 430, que é o que o ponto 2 escreve, tira a 18, a 17 e a 15 distritos o único alvo de 44 px que eles têm. E o próprio ponto 2 fecha com a frase que o governa: «o que a Emenda 20c protege (nenhuma unidade sem alvo tocável) continua protegido, e medido». As duas metades do ponto 2 não podem ser verdadeiras ao mesmo tempo.

**A célula M2b da régua do mapa não apanharia isto**, e isso é o segundo achado: ela pergunta ao DOM (`querySelectorAll`), e um grupo escondido pela folha continua no DOM. A célula L4 desta régua pergunta ao estilo computado e à caixa, e é ela que vê o estrago vermelho.

**O que deixei construído, para que a decisão custe uma linha de folha e não um bloco:** cada grupo leva `data-alvo-abaixo-de` com a largura de mapa abaixo da qual a sua parcela deixa de ter todas as unidades como alvo, calculada em `parcelasDoMapa()` e conferida contra o navegador pela célula L9. Hoje vale 351 para o continente, 1 787 para a Madeira e 9 925 para os Açores.

**O que fica para o lugar de direção:** qual das duas medidas manda. Se for a caixa, liga-se a regra e o grupo do continente sai a partir de 351 px, e a célula L4 tem de passar a ler a mesma medida. Se for o quadrado inscrito, o ponto 2 não tem efeito nenhum hoje, porque nenhuma das três parcelas chega aos 44 px por essa medida em largura nenhuma de telemóvel, e o que resolve a altura da página no telemóvel é a forma em linha, que já está feita e mede o que a §1.1 diz.

## 6 · O custo em símbolos

A sessão do construtor gastou aproximadamente **365 mil símbolos** de contexto, contados pela diferença do orçamento da sessão entre a primeira leitura do brief e a escrita deste relatório (15,00 M no início, 14,63 M aqui). É contexto consumido, e não a fatura: inclui as leituras repetidas dos ficheiros grandes da casa e as saídas das réguas. As quatro construções completas (`npm run build`) levaram cerca de três minutos cada; a régua nova leva cerca de um minuto por corrida e cerca de oito por corrida de estragos.
