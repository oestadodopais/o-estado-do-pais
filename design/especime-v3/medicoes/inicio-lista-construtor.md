# Os nomes do mapa ao lado, e os dois painéis com nome · relatório do construtor

*Bloco `inicio-lista-2026-08-29`, saído de `main` `a76f829`, num worktree. Construtor: Claude Opus 5. Brief: `design/especime-v3/briefs/BRIEF-inicio-lista-e-paineis.md`. Todas as medições correram em Chromium sem cabeça sobre o `dist/` construído, nas duas edições, e cada número desta página saiu de uma corrida que se diz ao lado dele.*

*Segunda passagem, 29.08.2026, sobre os seis achados da leitura cruzada: os alvos do telemóvel passam a ter 44 px nos dois sentidos, a pontuação entre os nomes sai, a lista passa a vir antes do mapa no documento, a régua passa a medir o que dizia que media, o `data-alvo-abaixo-de` sai por decisão do lugar de direção (I101), e as frases deste relatório que descreviam o estado anterior estão corrigidas. Os números abaixo são todos da construção depois desses seis consertos.*

## 0 · O que ficou feito

Os 29 nomes saíram de dentro do mapa e são um bloco irmão da cabeça e do instrumento, e vêm antes dele no documento. No ecrã largo ficam na coluna esquerda, por baixo da manchete e ao lado do mapa, e o mapa e os nomes respondem-se nos dois sentidos, com o rato e com o teclado, sem uma linha de JavaScript. Abaixo de 1024 os nomes vão em linha, sem pontuação, com o alvo de 44 × 44 px. Os dois painéis levam nome, e a contagem de cada um vem da prova e bate com o que está por baixo dela.

A decisão do lugar de direção sobre a I101 está aplicada: **a rede não se esconde**. Abaixo de 1024 mostra-se sempre, em linha; a partir de 1024 mostra-se a lista da coluna esquerda; nenhuma largura mostra as duas.

## 1 · As medições, antes e depois

### 1.1 · A altura da primeira página, nas duas edições

Medida em `document.documentElement.scrollHeight`, com o tipo carregado. O «antes» é `a76f829`.

| janela | página pt | página en | menos |
|---|---|---|---|
| 320 | 8 314 → **7 785** | 8 295 → **7 749** | 529 · 546 px |
| 360 | 8 062 → **7 411** | 8 142 → **7 508** | 651 · 634 px |
| 390 | 8 034 → **7 383** | 8 008 → **7 357** | 651 · 651 px |
| 430 | 7 930 → **7 173** | 7 933 → **7 176** | 757 · 757 px |
| 768 | 5 665 → **5 188** | 5 758 → **5 281** | 477 · 477 px |
| 1024 | 4 991 → **3 901** | 4 950 → **3 860** | 1 090 · 1 090 px |
| 1280 | 4 791 → **4 003** | 4 775 → **3 987** | 788 · 788 px |

### 1.2 · A altura da lista, e o alvo de cada nome

| janela | tela do mapa | lista antes | lista depois | o alvo mais pequeno |
|---|---|---|---|---|
| 320 | 320 px | 1 237,6 | **604,4** | 44,0 × 44,0 px |
| 360 | 360 px | 1 237,6 | **516,4** | 44,0 × 44,0 px |
| 390 | 390 px | 1 237,6 | **516,4** | 44,0 × 44,0 px |
| 430 | 430 px | 1 237,6 | **428,4** | 44,0 × 44,0 px |
| 768 | 281 px | 814,8 | **296,4** | 44,0 × 44,0 px |
| 1024 | 340,1 px | 1 237,6 | **418,8** | 99,3 × 44,0 px |
| 1280 | 490 px | 814,8 | **418,8** | 99,3 × 44,0 px |

O alvo é medido em largura E em altura, e nenhum par de alvos se interseta a nenhuma das sete larguras (célula L5, 29 de 29 à vista em cada uma). Na primeira passagem deste bloco o alvo media 44 px de altura e apenas isso: medida essa forma outra vez, «Beja» dava **27,8 × 44 px** e «Faro» 29,0 × 44. A largura mínima e o `padding` dos lados entraram com a leitura cruzada.

### 1.3 · A ocupação da coluna esquerda, a 1280 e a 1024

A 1280, antes: a grelha da cabeça media **1 552,1 px**, a cabeça acabava a 709 e a grelha a 1 969,4, e a lista estava na coluna direita (abcissa 696), por baixo do mapa. Eram **1 260,4 px de papel vazio** na coluna esquerda, que é o que o diretor viu.

A 1280, depois: a lista está na coluna esquerda (abcissa 94, a mesma da cabeça, com a mesma largura de 582 px), começa a 735 e acaba a 1 153,8; a coluna do instrumento acaba a 1 136,6. A grelha mede **736,5 px**, contra 1 552,1, e passa 17,2 px para além do fim do mapa (a célula L3 mede-o, com um limite de 60).

A 1024: a grelha mede **659,7 px** e a lista 418,8, na mesma banda da cabeça.

### 1.4 · Uma forma de cada vez, às sete larguras

Depois da decisão sobre a I101, a regra é uma só, e a célula L9 mede-a nas sete larguras e nas duas edições, em dois sítios que não podem divergir: a `display` da `<ul>` (o que a folha manda) e o número de linhas que os 18 nomes do continente ocupam (o que o ecrã mostra).

| janela | forma | os 18 do continente | nomes à vista |
|---|---|---|---|
| 320 | rede em linha (`flex`) | 6 linhas | 29 de 29 |
| 360 | rede em linha (`flex`) | 5 linhas | 29 de 29 |
| 390 | rede em linha (`flex`) | 5 linhas | 29 de 29 |
| 430 | rede em linha (`flex`) | 4 linhas | 29 de 29 |
| 768 | rede em linha (`flex`) | 2 linhas | 29 de 29 |
| 1024 | lista da coluna esquerda (`block`) | 9 linhas, duas colunas de nove | 29 de 29 |
| 1280 | lista da coluna esquerda (`block`) | 9 linhas, duas colunas de nove | 29 de 29 |

*O número de linhas é a contagem de topos distintos entre os 18 nomes do continente, lida da corrida da célula L9; é igual nas duas edições a cada largura. Antes deste bloco eram dezoito a todas as larguras: o grupo do continente media 814,8 px a 390, que são dezoito linhas de 44 px mais o rótulo.*

### 1.5 · O par de estado, nos 29 pares

Medido no estilo computado, a 1280, com as 28 restantes como testemunhas em cada passo (células L6a a L6d):

| célula | o que se aponta | o que muda | resultado |
|---|---|---|---|
| L6a | o rato em cada um dos 29 nomes | o contorno da área daquela unidade | 29/29 · 1 px → 3 px na apontada, 1 px nas outras 28 |
| L6b | o rato em cada uma das 29 áreas | o sublinhado do nome daquela unidade | 29/29 · 1 px → 3 px no apontado, 1 px nos outros 28 |
| L6c | o `Tab` até cada um dos 29 nomes | o contorno da área | 29/29 |
| L6d | o `Tab` até cada uma das 29 áreas | o sublinhado do nome | 29/29 |

O rato do lado do mapa vai ao **ponto representativo** do artefacto e não ao centro da caixa: numa forma côncava o centro da caixa cai fora da forma (I82), e o `:hover` não acenderia. O `Tab` põe-se a partir do elemento anterior e mede-se `document.activeElement`, porque um `focus()` de guião não acende `:focus-visible` em todos os motores.

### 1.6 · O contraste da marca

`node scripts/medir-contraste.mjs`, sobre `src/styles/tokens.css`, nos dois temas: `ink / paper` (texto, limiar 4,5) **16,39:1** no claro e **15,38:1** no escuro; `rule-strong / paper` (objeto de interface, limiar 3) **3,47:1** no claro e **5,80:1** no escuro.

A marca não introduz cor nenhuma. Do lado do mapa é o mesmo par `ink / paper` com o traço de 1 px a passar a 3 px. Do lado do nome, o sublinhado passa de 1 px para 3 px e a sua tinta passa de `rule-strong` para a do texto, ou seja de 3,47:1 para 16,39:1 no claro: a cor melhora, e a marca sobrevive sem ela porque a espessura triplica. A célula L7 mede-o nas duas edições.

### 1.7 · O peso

* A primeira página passou de **145,2 KB** para **151,9 KB** de HTML (célula M4a de `tests/inicio/mapa-distritos.mjs`). Os caminhos do desenho ficam nos mesmos 29,9 KB.
* Desses 6,7 KB, **6 461 bytes** são o bloco `<style>` do par: 58 selectores, 29 por sentido, compostos das 29 unidades do artefacto.
* `data-alvo-abaixo-de` conta **0** ocorrências na página construída: saiu com a decisão da I101.

## 2 · As decisões de forma, e porquê

### 2.1 · A colocação: um bloco irmão, e três colocações declaradas

A lista era filha de `MapaRespira.astro` e vivia na coluna do instrumento. Uma lista dentro do mapa não muda de coluna: para ir para a esquerda teria de ser rendida uma segunda vez, e duas rendições dos mesmos 29 nomes seriam 58 ligações para 29 páginas. Passou a ser `src/components/inicio/ListaDosNomes.astro`, rendido por `HomeView` como filho de `.cabeca-grelha`. A célula L1 compara o conjunto dos slugs da lista com o das áreas do desenho: os dois têm 29 elementos e são o mesmo conjunto, com 29 destinos distintos.

Acima de 1024 as três colocações são explícitas: a cabeça na coluna 1 fila 1, a lista na coluna 1 fila 2, o instrumento na coluna 2 a atravessar as duas filas. Com colocação automática o terceiro filho caía na fila 2 por acaso e o mapa ficava preso à fila 1.

### 2.2 · A ordem do documento é a do ecrã largo, e abaixo de 1024 a folha inverte-a

A lista vinha depois do mapa no documento, e acima de 1024 ela está à esquerda e o mapa à direita: quem percorre a página pelo teclado ou com um leitor de ecrã encontrava as 29 áreas antes dos 29 nomes, ao contrário do que vê quem olha. **A lista passa a vir antes**, que é o que ela é: o índice do mapa. A célula L1 mede a ordem com `compareDocumentPosition` e não com a folha.

**Abaixo de 1024 a ordem visual e a do documento divergem, e é uma escolha.** Ali o mapa é a coisa e os nomes são a rede dele, e uma rede lê-se por baixo daquilo que protege: a folha põe o mapa primeiro com `order`, entre 640 e 1024 na grelha de uma coluna e abaixo de 640 na coluna dissolvida. É a única largura em que as duas ordens não coincidem, e a folha escreve porquê no sítio onde o faz.

O par de estado não depende da ordem: o selector é `.cabeca-grelha:has(...) ...`, um antepassado comum e dois descendentes, e as células L6a a L6d correram verdes depois da troca.

### 2.3 · O par de estado: `:has()` composto do artefacto, e não um guião

O CSS não sabe dizer «o elemento cujo atributo vale o mesmo que aquele». Um par entre 29 áreas e 29 nomes pede uma regra por unidade, e as 29 regras não podem ser escritas à mão numa folha estática: isso seria uma segunda lista dos slugs ao lado da do motor, que é o que a fronteira do mapa proíbe. São compostas na construção e vão no documento num `<style is:inline>`.

**O que custa o `:has()`:** 6 461 bytes por página, medidos, em duas páginas. **O que custaria o guião:** escrevi um para medir e não entrou; são 26 linhas e **1 202 bytes** sem minificação. É cinco vezes mais leve, e foi recusado por três razões, e nenhuma é o peso: um par que só existe com JavaScript não existe para quem o desliga; o guião da primeira página vive em `public/js/`, que este bloco não toca; e `HomeView.astro` escreve que o script troca `hidden`, `open`, `aria-pressed` e `aria-current` e mais nada, e essa lista existe para não crescer.

### 2.4 · A forma em linha, sem pontuação, com o alvo nos dois sentidos

Abaixo de 1024 os nomes correm uns a seguir aos outros, e o alvo de cada um mede 44 px de altura (12 de `padding` sobre uma linha de 20) e pelo menos 44 de largura (`min-width` com 6 de folga de cada lado e o nome ao centro). É isso que corta 477 a 1 090 px da altura da página.

**Sem pontuação entre os nomes.** Havia um ponto por `::after`, e a leitura cruzada apanhou o que ele fazia: com o item inquebrável, o ponto nunca abre uma linha mas fica pendurado no fim dela («Castelo Branco ·», «Lisboa ·»). A primeira redação deste relatório dizia que o problema estava resolvido, e não estava: estava metade resolvido, e a outra metade era visível na captura. O que separa os nomes passa a ser o intervalo entre eles (`column-gap: 0.75em`) e o sublinhado que cada ligação já tem, e a `<ul>` passa a ser uma fila flexível: a linha parte entre itens e mais lado nenhum, sem caracteres a decidir onde. A célula L10 confere que nenhum `::before` nem `::after` da lista tem conteúdo, a nenhuma das sete larguras e em nenhuma das duas edições.

### 2.5 · Os 44 px contra os «uns 250 px» do brief

O brief pede o continente em duas colunas de nove e uns 250 px de altura. As duas coisas juntas só cabem com linhas de 27 px, e a casa mede o alvo a 44 px também a 1280 (célula M1c da régua do mapa, verde antes deste bloco). Escolhi os 44 px, e a lista mede **418,8 px**. O que o brief queria com o número continua feito: a lista fica ao lado do mapa e a página deixa de crescer. Baixar para 250 px era baixar o alvo para 27 px, e isso é uma decisão de régua e não de folha.

### 2.6 · Os dois painéis

A linha de nome é a mesma forma nos dois (`.painel-nome`, o bloco de declarações que `.social-titulo` já tinha; as duas classes ficam porque `scripts/design-bundle.mjs` procura a segunda pelo nome). O nome é o que a fonte dá ao painel; a contagem é um `<ValorDaProva>` que o portão de HTML reconta: `painel_com_limiar` para as 13 e `painel_social_total` para as 8. **E a célula L8 não se contenta com a marca certa:** conta as peças de `#painel` e as linhas de `#painel-social` na própria página e exige que os dois algarismos sejam esses. Um número certo com a marca certa que não conta o que está por baixo dele continua a ser um número errado, e o estrago que o planta é visto vermelho.

Os espaços estão dentro das cadeias, porque entre uma expressão e um elemento uma mudança de linha do gabarito não é um espaço. O fio passou de `.painel` para `.painel-nome` e desliga-se na grelha logo a seguir a um nome: as páginas de concelho e de região que rendem `.painel` ficam como estavam.

### 2.7 · O que saiu, e o que não mudou

**Saiu `data-alvo-abaixo-de`** (I101, decisão do lugar de direção), e com ele o `larguraMinimaPx` de `parcelasDoMapa()` e a função que o calculava: ninguém os lia, a medida que carregavam é a da caixa e não a do quadrado inscrito que a casa adoptou na I82, e bytes que nenhum leitor usa não ficam na página. A pergunta fica aberta na I101 na forma que resta: se um dia se quiser esconder a rede, a medida do quadrado inscrito tem de vir do motor no artefacto.

Nenhuma frase nova da casa. As oito linhas do inventário são quatro dicas de chaves da prova e as quatro linhas de nome dos painéis, nas duas edições; duas saíram, que eram o nome do Painel Social sozinho. Os manifestos, os ícones, o cabeçalho e `public/` não foram tocados.

## 3 · As células e os estragos

**`tests/inicio/lista.mjs`: 72 células, todas verdes.**

| célula | o que mede | quantas |
|---|---|---|
| L1 | uma lista só, e os seus slugs são o conjunto dos slugs das áreas; e a ordem do documento | 2 |
| L2 | a lista na coluna esquerda, por baixo da manchete e ao lado do mapa | 4 |
| L3 | a grelha não passa mais de 60 px da coluna do mapa | 2 |
| L4 | nenhuma unidade sem alvo tocável: tantos grupos quantas parcelas, e os 29 nomes à vista | 14 |
| L5 | cada nome é um alvo de 44 × 44 px, e nenhum par de alvos se interseta | 14 |
| L6 | o par nos 29 pares, nos dois sentidos e pelas duas portas | 4 |
| L7 | a marca não é só cor | 2 |
| L8 | o nome de cada painel conta o que está na página, com o algarismo da prova | 2 |
| L9 | uma forma de cada vez às sete larguras, e nenhuma esconde a lista | 14 |
| L10 | sem pontuação entre os nomes | 14 |

**Doze estragos plantados, doze apanhados** (`node tests/inicio/lista.mjs --vermelhos`). Cada um exige agora três coisas, e não uma: **verde antes** (as células que ele nomeia passam sem ele), **o HTML mudou** (a transformação dá bytes diferentes nas duas páginas, para que um `replace` que falha em silêncio não passe por estrago) e **vermelho depois**. Falhar qualquer das três é vermelho do corredor.

| estrago | células que o apanham |
|---|---|
| uma ligação duplicada | L1 nas duas edições (30 ligações para 29 slugs) |
| o mapa antes dos nomes no documento | L1 nas duas edições |
| a lista de volta para baixo do mapa, a 1280 | L2 e L3 nas duas edições |
| um grupo escondido | L4 e L9 (18 nomes escondidos) |
| um alvo com 40 px de altura | L5 nas 14 (o mais baixo 40,0) |
| um alvo com menos de 44 px de largura | L5 nas 14 (o mais estreito 27,8) |
| a folha do par retirada | L6 e L7 |
| a marca só por cor | L6 e L7 |
| o nome de um painel com uma contagem escrita à mão | L8 nas duas edições |
| o nome de um painel a contar outra coisa (marca certa, número certo, contagem errada) | L8 nas duas edições (diz 7, a lista tem 8) |
| a forma em linha a 1024 e a 1280 | L9 (os 18 do continente em 2 linhas onde deviam ser 9) |
| um ponto de separação de volta | L10 nas 14 (26 `li::after` com conteúdo) |

**As réguas vizinhas, na construção deste ramo:** `mapa-distritos` 43 de 43, `mapa-navegacao` 9 de 9, `app` 39 de 39. `areas` dá 20 de 22, e a célula vermelha é anterior a este ramo (I100).

**Os portões:** `npm run build`, `npm run verify` e `npm run typecheck` saem todos a 0.

## 4 · Os commits

| commit | o quê |
|---|---|
| `3adb668` | os nomes na coluna esquerda: a lista sai de `MapaRespira` para `ListaDosNomes.astro`, o par de estado em `:has()`, a forma em linha no telemóvel, os dois painéis com nome, e as oito linhas do inventário |
| `a8f4ad0` | a primeira forma de `tests/inicio/lista.mjs` |
| `5b4fc7f` | a primeira forma deste relatório, e as linhas I100 e I101 de `ISSUES.md` |
| os da segunda passagem | os seis consertos da leitura cruzada: o alvo nos dois sentidos, a pontuação fora, a ordem do documento, a régua a medir o que diz, o `data-alvo-abaixo-de` fora com a decisão da I101, e este relatório corrigido |

*Todos saem de `a76f829`, no ramo `inicio-lista-2026-08-29`, cada um com os dois trailers e com os caminhos nomeados um a um no `git add`.*

## 5 · O que fica aberto

**I101**, na forma que a decisão do lugar de direção lhe deu: a construção não sabe medir o alvo pela medida da casa, e enquanto o quadrado inscrito não vier do motor no artefacto a rede não se esconde a largura nenhuma. A tabela que sustenta a decisão, medida a 29.08 sobre `a76f829` e igual nesta construção:

| janela | tela | continente: chega aos 44 px pela caixa | pelo quadrado inscrito |
|---|---|---|---|
| 320 | 320 | 16 de 18 | **0 de 18** |
| 360 | 360 | 18 de 18 | **0 de 18** |
| 390 | 390 | 18 de 18 | **1 de 18** (Beja) |
| 430 | 430 | 18 de 18 | **3 de 18** (Beja, Castelo Branco, Évora) |
| 1280 | 490 | 18 de 18 | 5 de 18 |

**I100**, a célula M4 de `tests/inicio/areas.mjs`, vermelha desde `fc1d013` por não conhecer a marca `data-nome`. Achado fora do brief, não corrigido aqui.

## 6 · O custo em símbolos

Cerca de **430 mil símbolos** de contexto ao fim da segunda passagem, contados pela diferença do orçamento da sessão entre a primeira leitura do brief e esta linha (15,00 M no início, 14,57 M aqui). É contexto consumido e não a fatura: inclui as leituras dos ficheiros grandes da casa e as saídas das réguas. Sete construções completas de cerca de três minutos cada; a régua nova leva cerca de dois minutos por corrida e cerca de vinte por corrida de estragos, que é o preço de as doze plantas correrem duas vezes cada.
