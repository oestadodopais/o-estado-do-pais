# Correções pequenas, sétima passagem · relatório do construtor

*Escrito a 29.08.2026 por Claude Opus 5, ramo `pequenas-7-2026-08-29`, saído de
`main` `3de3ba7`, contra `briefs/BRIEF-correcoes-pequenas-7.md`. Quatro commits
de código, mais o que traz este relatório, que não pode conter o seu próprio
resumo. Nada fundido. Sem travessões na prosa, e o quarto commit é o que repara
os quinze que escrevi contra a regra.*

## 0 · O que fica feito, em três linhas

* **I97.** O nome do organismo que publica e a edição do documento passam a
  dizer em que língua estão, com a regra da §1.82. Em `dist/en`, organismos sem
  marca 6 911 → 0 e edições portuguesas sem marca 3 148 → 0; em `dist/pt`, os
  164 do Eurostat passam a levar `lang="en"`, de 0. A régua ganha quatro
  conferências e quatro estragos plantados.
* **I98.** O feixe do desenho volta a correr, e não era um seletor: eram dez
  coisas, e `.movel-selo` era só a primeira porque o guião morre à primeira. 20
  cartões de 20 verdes, seis estragos plantados, e entra no `npm run verify`
  porque corre em 0,26 s.
* **I100.** A M4 da régua das áreas fica verde, com a régua 22 de 22. A marca
  tinha duas metades e ela não sabia nenhuma; e a lista das marcas deixa de ser
  copiada para dentro da régua e passa a ser lida da régua da casa.

## 1 · Os commits

| commit | o quê |
| --- | --- |
| `0754e18` | I100: a M4 da régua das áreas lê as marcas da régua da casa, e deixa de as copiar |
| `83fec32` | I98: o feixe do desenho volta a correr, e entra no verify; não era um seletor, eram dez |
| `442ce8f` | I97: o nome do organismo e a edição do documento dizem em que língua estão |
| `30a7ebf` | os travessões saem da prosa nova destas três correções |

Todos com caminhos explícitos no `git add`, nunca `-A` nem `.`. Todos com os
dois trailers. `DECISIONS.md` não foi tocado, `public/` não foi tocado, o
cabeçalho e os manifestos não foram tocados, o motor não foi tocado. A cadeia
inteira (`npm run build`, `npm run verify`, `npm run typecheck`) corre verde em
cada um dos quatro, e o `verify` dos dois últimos já inclui o feixe do desenho.

## 2 · I97 · a língua dos nomes de organismo e das edições

### 2.1 · O que o livro-razão tem, contado

| | distintos | a declarar |
| --- | ---: | ---: |
| `source` | 17 | 16 |
| `document.edition` | 62 | 61 |

O que não se declara, nos dois casos, é o marcador `[a verificar]`: uma linha
sem organismo não tem organismo nenhum, e declarar a língua de um buraco não diz
nada. `CampoDaLinha` já o rende com `lang="pt-PT"` nas duas edições.

**A contagem do brief estava por baixo, e a diferença está medida.** O brief diz
«12 das 62 edições de documentos em português»; contadas uma a uma, são **16 em
português** de **61 distintas além do marcador**. As quatro que faltavam à conta
são as da família «indicador NNNN» (são sete cadeias distintas e não uma) e a
«nama_10r_2gdp, atualizado 2026-02-10», que é um código com uma palavra
portuguesa lá dentro.

### 2.2 · Como cada uma foi classificada, e porquê

**Os organismos: 15 portugueses, 1 inglês.** O inglês é o Eurostat. Os quinze
portugueses incluem três siglas nuas (INE, ERSAR, PORDATA), que contam como o
nome de que saíram: uma sigla portuguesa lida com fonética inglesa soa a outra
coisa. E incluem o nome da própria casa, «O Estado do País», que fica em
português nas duas edições, como o «Arquivo de estudos» e o «Registo de
correções» já ficavam na tabela dos títulos.

**Nenhum se traduz, nem os que têm nome inglês oficial.** O INE publica em inglês
como «Statistics Portugal». Escrever isso na tabela seria a casa a escolher por
qual dos dois nomes a fonte se chama nesta linha, e a linha guarda um só. Rende
o que ela guarda, na língua em que está.

**As edições obrigaram a uma terceira resposta, e é a decisão desta passagem.**
Um ano («2024»), uma data («12.08.2026») e um código de série do Eurostat
(«tipsbd10») não estão em português nem em inglês. Marcá-los `pt-PT` na edição
inglesa dizia a um leitor de ecrã que «tipsbd10» é português, que é exactamente o
defeito que a I97 veio fechar, virado ao contrário; marcá-los `en` era o mesmo
erro do outro lado. Por isso `LINGUA_DAS_EDICOES` declara **três coisas**: `pt`,
`en` e `null`.

E `null` **escrito** não é o mesmo que a chave em falta. A régua separa os dois
pela presença da chave (`hasOwnProperty`, como as duas tabelas anteriores já
faziam): uma edição declarada `null` está decidida e não leva marca; uma edição
que falte à tabela fecha a construção. É a diferença entre «não tem língua» e
«ninguém olhou».

| as 61 edições | quantas |
| --- | ---: |
| escritas em português | 16 |
| anos | 7 |
| datas | 3 |
| nomes de ficheiro do publicador | 3 |
| códigos de série do Eurostat | 32 |
| escritas em inglês | 0 |

A coluna do inglês fica de pé na mesma: a regra é sobre a espécie de cadeia, e
não sobre o que hoje calha existir.

**Uma edição misturada marca-se inteira, pela prosa que traz.**
«nama_10r_2gdp, atualizado 2026-02-10» é um código do Eurostat e uma palavra
portuguesa, e é a palavra que se lê mal: o campo leva `pt-PT`. É a mesma regra
dos campos transcritos, que se marcam inteiros na língua do campo (a razão está
escrita em L5 da própria régua). E «indicador 0014580» é português e não um
código: «indicador» é a palavra que o INE imprime.

### 2.3 · As contagens, antes e depois

Medidas com uma varredura própria sobre `dist/`, escrita para isto e não a régua
que este commit acrescenta: são duas contas da mesma coisa, e batem certo.

**Os nomes de organismo**

| | antes | depois |
| --- | ---: | ---: |
| rendidos em `dist/en` | 6 920 | 6 920 |
| com `lang="pt-PT"` em `dist/en` | 9 | 6 756 |
| sem marca em `dist/en` | 6 911 | 164 |
| com `lang="en"` em `dist/pt` | 0 | 164 |

Os 9 de antes eram os marcadores, que já herdavam a marca do próprio marcador.
Os 164 que ficam sem marca em `dist/en` são o Eurostat, que está na língua da
página e não a leva.

**As edições de documento**

| | antes | depois |
| --- | ---: | ---: |
| rendidas em `dist/en` | 4 542 | 4 542 |
| com `lang="pt-PT"` em `dist/en` | 4 | 3 152 |
| sem marca em `dist/en` | 4 538 | 1 390 |

As 1 390 que ficam sem marca são as que não estão em língua nenhuma, e é o que
se decidiu que elas são. Em `dist/pt` nenhuma edição precisa de marca, porque
nenhuma está em inglês.

**O que a régua conta do seu lado**, nas duas edições juntas: 13 822 organismos
rendidos, 6 911 a marcar e 6 911 com marca; 9 076 edições rendidas, 3 148 a
marcar, 3 148 com marca e 2 780 sem língua nenhuma.

### 2.4 · Onde a marca se faz

Pela mesma peça que marca os títulos (`CampoDaLinha`, com a propriedade
`lingua`), em quatro sítios: `src/components/ItemDoLivro.astro` e
`src/views/LivroView.astro` para o organismo, e `src/views/LinhaView.astro` para
o organismo e a edição, na ficha do aparelho e na frase de atribuição.

Que não haja um quinto sítio não é uma suposição: a régua varre **todos** os
`[data-linha-campo="source"]` e `[data-linha-campo="document.edition"]` de
`dist/`, e um sítio esquecido apareceria como um campo sem marca.

### 2.5 · A régua, e os quatro estragos plantados

Quatro conferências novas, com a numeração a dizer o que cada uma é:

* **L2c** · todo o `source` do livro-razão tem língua declarada, e a tabela não
  nomeia nenhum que já não exista;
* **L2d** · o mesmo para `document.edition`, com as três respostas;
* **L4d** · nas duas edições, nenhum nome de organismo na língua errada sem a
  marca da sua;
* **L4e** · o mesmo para a edição.

Cada uma vista vermelha, e sempre numa cópia:

| estrago | onde | resultado |
| --- | --- | --- |
| `source: "Instituto Inventado de Estatística"` | cópia do livro-razão (`OEDP_LEDGER_DIR`) | L2c vermelha |
| `edition: "edição inventada de 2026"` | a mesma cópia | L2d vermelha |
| `lang="pt-PT"` tirado de um `source` numa página inglesa | cópia de `dist/` (`OEDP_DIST`) | L4d vermelha |
| `lang="pt-PT"` tirado de uma `edition` numa página inglesa | a mesma cópia | L4e vermelha |

As duas cópias foram repostas e voltaram a correr verdes. Nada foi plantado no
que a construção publica.

### 2.6 · O inventário não mudou, e isso foi medido

`npm run check:voz` dá o mesmo número antes e depois: **701 frases distintas, 30
123 ocorrências em 1 378 rotas, 582 linhas do inventário com bloco (506 vivas,
76 retiradas)**. Era o esperado, e a razão é a que o brief escreve: um nome de
organismo é origem e não prosa da casa, e vive dentro de `data-linha-claim`,
onde a régua da voz deixa cair o bloco inteiro. A unidade já vivia ali desde a
I92.

## 3 · I98 · o feixe do desenho

### 3.1 · A decisão, e a razão

**O seletor está a mais, e não é de `inicio.css`.** `.movel-selo` não existe em
folha nenhuma de `src/styles/`, não existe em ficheiro nenhum de `src/`, e não
existe em `dist/index.html`. Controlo positivo da mesma procura na mesma folha:
`mapa-linha` dá 6 ocorrências. Ele saiu com a forma do telemóvel da Emenda 18 (o
selo que substituía o mapa abaixo de 640), e a Emenda 20c substituiu essa forma
ao devolver o mapa ao telemóvel. Ler uma regra que não existe só podia morrer.

### 3.2 · E era a primeira de dez

O guião morre à primeira leitura que falha, e por isso a linha da ISSUES via
uma. Com uma cópia do guião que regista em vez de matar, aparecem as outras
nove:

| # | o quê | medido |
| --- | --- | --- |
| 1 | `.movel-selo` | 0 em `src/`, 0 em `dist/index.html` |
| 2 | `.peca[data-estado="sem"] .peca-topo` na primeira página | 0 ali, 634 páginas no sítio; as 13 peças da primeira página têm todas limiar |
| 3 | o mesmo, no cartão dos estados | idem |
| 4 | `.claim-com-provisorio` na primeira página | 0 ali, 24 páginas no sítio |
| 5 | `span.eyebrow` na primeira página | 0 ali (a primeira página não tem `.eyebrow` nenhum), 6 552 páginas no sítio |
| 6 | `span.marcador` | 0; o marcador é hoje `a.marcador`, porque passou a ser a porta da sua página |
| 7 | `.banda-legenda-item` | 0 em 6 590 páginas |
| 8 | `.banda` | 0 em 6 590 páginas (controlo positivo: `class="peca` dá 636) |
| 9 | `circle.mun` em `dist/index.html` | 0; a Emenda 20a trocou os 308 pontos por 29 `path.uni` |
| 10 | a linha que `inicio.css` usa para importar `mapa.css` | reprovava **9 dos 20 cartões** por pedido para fora |

### 3.3 · Os quatro consertos, e três são de classe

1. **A folha importada entra no lugar da linha que a importava**, e só na cópia
   que se embute. As impressões digitais das famílias continuam a ler a folha
   crua: uma classe de `mapa.css` contada como classe de `inicio.css` podia
   virar a impressão digital do início e fazer uma página de distrito passar por
   primeira página.
2. **A rota de uma peça procura-se numa lista de candidatas** e deixa de se
   escrever à mão, com o cartão a imprimir de onde ela veio. É a técnica que o
   cartão do selo já usava para o selo a tracejado, generalizada. É a razão por
   que o feixe apodrece, e fecha quatro dos dez de uma vez.
3. **Uma ausência afirmada passa a ser uma ausência medida.** O selo do telemóvel
   e a banda das regiões param a corrida se voltarem a render, como a legenda de
   neutralidade da Emenda 3 já parava.
4. **O cartão do mapa retrata o mapa que existe**: 29 unidades iguais, 29
   portas, 29 nomes por baixo, os 14 concelhos de um distrito aberto, e os 308
   pontos onde eles hoje vivem, que é o cartão localizador da página de um
   concelho.

### 3.4 · Os seis estragos plantados

Numa cópia de `dist/index.html`, com a página reposta e o `sha256` conferido
igual ao original no fim.

| estrago | resultado |
| --- | --- |
| o selo do telemóvel de volta à primeira página | vermelho |
| a banda das regiões de volta | vermelho |
| uma unidade do mapa pintada e as outras não | vermelho, «2 feitios diferentes» |
| uma unidade que deixa de ser porta | vermelho, «29 unidades e 28 portas» |
| um nome retirado da lista por baixo do mapa | vermelho, «28 nomes para 29 unidades» |
| a marcação de uma unidade partida | vermelho |

### 3.5 · Entra no `verify`, e o custo está medido

**0,26 s de relógio**, três corridas seguidas com o mesmo número, sobre as 6 590
páginas de `dist/`; escreve 5,3 MB em `design-system/`, que está no
`.gitignore`. O tecto do brief era de trinta segundos, e isto é um centésimo
dele. Entra em `npm run verify` como `npm run design:feixe`.

**Fica fora do `npm run build`**, e é de propósito: é onde as páginas se fazem, e
o feixe lê o que a construção acabou de escrever.

### 3.6 · O que fica por decidir, e é da direção

O feixe não tem cartão nenhum para as três famílias de página que nasceram
depois dele (`area.css`, `distrito.css`, `regiao.css`) nem para `texto.css`, e a
lista `FOLHAS` não as conhece. Não é um defeito do que existe: é uma cobertura
que não acompanhou o sítio, e escolher que páginas entram no retrato do sistema
de desenho é decisão do lugar de direção. Fica escrito na I98.

**E fica dito o que aqui é prosa nova e não uma peça movida.** O cartão do mapa
teve de ser reescrito: os títulos das secções e as notas passaram de descrever
308 pontos a descrever 29 unidades. Cada afirmação que ele faz é medida na
corrida (as unidades, as portas, os nomes, os concelhos do distrito, os pontos e
o anel do localizador), e nenhuma inventa uma forma que a página não tenha, mas
as frases são minhas e não estavam lá. É o único sítio desta passagem onde
escrevi sobre o sistema de desenho em vez de mover um apontador, e a direção há
de querer lê-las.

## 4 · I100 · a M4 da régua das áreas

### 4.1 · A marca tinha duas metades

| estado | blocos medidos | por classificar |
| --- | ---: | ---: |
| antes | 112 por edição | 18 por edição |
| com `[data-nome]` na lista de origens | 103 | 9 |
| com a substituição na descrição do `<head>` | 103 | **0** |

Os 18 eram os nove nomes das áreas, duas vezes: uma no `<h1>` marcado
`data-nome`, e outra na `<meta name="description">`, que numa página de área é o
nome da área. A régua da casa troca na descrição o texto de cada elemento
marcado pelo lugar que ele ocupa (`<lugar>`, `<nome>`), para que a descrição se
conte uma vez e não uma por área; a linha `| conteudo | <nome> |` do inventário
já existia. Sem essa troca a marca ficava meio aprendida.

A régua fica **22 de 22**.

### 4.2 · A decisão: não chama `medir-defeitos.mjs`, e a razão é o estrago

O brief dava as duas saídas. A que se seguiu foi ensinar a marca, e a que não se
seguiu foi pôr a M4 a chamar `medir-defeitos.mjs` como a M7 da régua do mapa
faz, **porque isso matava o estrago plantado**: os estragos desta régua são uma
transformação do HTML no caminho entre o ficheiro e o navegador, e nunca em
disco (está escrito no próprio ficheiro: «o estrago não toca em disco»); a outra
régua lê o `dist/` do disco. Um bloco de prosa plantado à saída do servidor
nunca lhe chegaria, e a célula ficava com o número certo e sem controlo positivo
nenhum, que é o contrário da regra 14 da casa.

### 4.3 · Mas a lista deixa de ser uma cópia

A causa da I100 não é `data-nome`: é uma lista de marcas escrita à mão em duas
pontas, que cresce numa e não na outra. Passa a ser **lida** de
`scripts/medir-defeitos.mjs`, pelo nome das cinco constantes que `frasesDaCasa()`
soma, e a corrida pára com o nome da constante que não encontrar. Lida como
texto e não importada: um `import` corria a régua inteira sobre as 6 590 páginas
de `dist/`.

A extracção foi provada nos dois sentidos com fonte fabricada: uma constante
escrita em duas cadeias somadas devolve a soma (`'[data-a],' + '[data-b]'` →
`[data-a],[data-b]`); uma que não existe e uma sem seletor devolvem nada, e
fecham a corrida a 2.

### 4.4 · O que continua diferente, e fica

A lista dos **elementos** de bloco não se lê de lá: aqui traz `div` e não traz
`span.eyebrow`. Medi as duas formas nas vinte rotas desta célula e a diferença é
de **zero blocos** (103 por edição em ambas), e por isso fica como está em vez de
mudar sem efeito. O que cresce é a lista das marcas, e é essa que passa a ter uma
fonte só.

### 4.5 · Os seis estragos plantados

Os cinco que já lá estavam continuam vermelhos, e entra um sexto, que é o que a
célula não sabia ver: **`data-nome` retirado das páginas de área** devolve
exactamente os 18 blocos por classificar de que a linha se queixava, nas duas
edições.

## 5 · O que achei fora do brief, e não corrigi

Duas linhas novas na ISSUES, sem correcção, como o brief manda.

* **I102 · `src/components/inicio/BandaDaRegiao.astro` é código morto.** Não é
  importado por vista nenhuma e não rende em página nenhuma: `class="banda`
  aparece em **0** das 6 590 páginas construídas, com `class="peca` a aparecer em
  636 como controlo positivo, e nenhum ficheiro de `src/` o importa (controlo
  positivo: `InstrumentoConvergencia` tem 2 importações). Foi o feixe do desenho
  que o encontrou, ao tentar retratá-lo.
* **I103 · as três cadeias `inicio.movel.*` de `src/i18n/strings.mjs` estão
  mortas, e a razão escrita ao lado delas envelheceu.** «Abrir um concelho»,
  «Ver uma região» e «Abrir a escolha de concelho» ficaram quando a forma do
  telemóvel da Emenda 18 saiu, com o comentário a prometer que «a forma do
  telemóvel que elas nomeiam volta com o mapa por distritos». O mapa por
  distritos chegou com a Emenda 20c e elas não voltaram. Medido: 0 ocorrências
  das três nas 6 590 páginas (controlo positivo: «Livro-razão» aparece em 3 297),
  e 0 leituras de `inicio.movel` em `src/`.

## 6 · O que não fiz, e devia ficar dito

* **Não toquei em `DECISIONS.md`**, em `public/`, no cabeçalho, nos manifestos,
  nem em nada do motor.
* **Não fundi nada.** O ramo fica empurrado, e a fusão é do lugar de direção.
* **A I95 e a I99 não entraram**, como o brief diz: são do motor.
* **A tabela das línguas não foi relida por ninguém além de mim.** Declarei a
  língua dos 16 organismos e das 61 edições olhando para cada cadeia. Se a
  direção discordar de alguma, muda-se uma linha. As que mais merecem um segundo
  olhar são três: «Eurostat» declarado `en` (é o que o brief manda, e é o nome
  inglês de um organismo europeu, mas escreve-se igual em português);
  «nama_10r_2gdp, atualizado 2026-02-10» declarado `pt` por causa de uma palavra
  no meio de um código; e os três nomes de ficheiro do publicador declarados sem
  língua, que trazem palavras inglesas dentro mas são nomes de ficheiro.
* **A prosa nova do cartão do mapa** está assinalada na §3.6, e é o único sítio
  onde escrevi frases novas sobre o sistema de desenho.

## 7 · O custo

Cerca de **370 000 símbolos**, lidos do contador de orçamento da própria sessão:
15 000 000 quando abriu e cerca de 14 630 000 quando esta linha foi escrita. É a
aritmética desse contador e não uma contabilidade por chamada, e o que vier
depois desta linha fica de fora dela. Uma só construção completa custa 3 min 40 s
de relógio, e foram cinco.
