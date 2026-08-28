# O sítio no ecrã principal · o relatório do construtor

*Escrito a 28.08.2026 pelo construtor (Claude Opus 5) para o lugar de direção,
sobre o ramo `app-2026-08-28`, saído de `main` `162df96`. Responde ao
`design/marca/BRIEF-app.md` §3, com as decisões do diretor de 28.08.2026 a
preencher os vazios do brief. Todos os números desta nota vêm de um comando que
está escrito ao lado deles. Sem travessões na prosa; o ponto médio é o separador.*

```
node design/marca/exportar.mjs app                          os seis ficheiros de public/
npm run build · npm run verify · npm run typecheck           a cadeia inteira, verde
node scripts/gate-html.mjs                                   2 manifestos, 7 ícones conferidos
node tests/inicio/app.mjs                                    68 de 68 células
node tests/inicio/app.mjs --vermelhos                        10 estragos, 10 vermelhos, sai com 0
node tests/inicio/app.mjs --json design/especime-v3/medicoes/2026-08-28-app-reguas.json
```

---

## 0 · O que é «feito», e o que este relatório não pode dizer

O `BRIEF-app.md` §3 põe a prova no telemóvel do diretor: «adicionar ao ecrã
principal» mostra o ícone da marca e o nome curto, e a aplicação abre sem a
moldura do navegador. **Nada aqui substitui isso, e é preciso dizê-lo antes dos
números.** Um Chromium sem cabeça não instala uma aplicação, não desenha um ecrã
principal e não arredonda os cantos de um ícone. O que este trabalho entrega são
as condições de isso acontecer, medidas uma a uma. A prova de que funciona é uma
fotografia de um telemóvel, e é do diretor.

---

## 1 · Os oito ficheiros, e de onde saiu cada um

Nenhum foi desenhado à mão nem retocado. Os seis primeiros saem de
`node design/marca/exportar.mjs app`, que ganhou a ronda `app` para isto; os dois
manifestos são ficheiros de texto, e a razão de não serem gerados está na §5.

| ficheiro | bytes | de onde | como |
|---|---|---|---|
| `public/apple-touch-icon.png` | 4 494 | `direcoes-e2/e2c-unida-28-papel-tinta.svg` | captura de 180 px, forma `normal`, tema claro, com fundo |
| `public/icon-192.png` | 4 836 | o mesmo | captura de 192 px, forma `normal` |
| `public/icon-512.png` | 13 341 | o mesmo | captura de 512 px, forma `normal` |
| `public/icon-512-maskable.png` | 11 082 | o mesmo | captura de 512 px, forma `maskable` (o CSS do SVG reduz o sinal a 0,78) |
| `public/favicon.svg` | 809 | `direcoes-e2/e2-unida-28.svg` | composto dos dois caminhos do grupo `.sinal` e da transformação dele, sem o campo, com a regra do esquema escuro do sistema |
| `public/favicon.ico` | 5 430 | `public/favicon.svg` | duas capturas com fundo transparente (32 e 16), escritas como DIB de 32 bits num contentor ICO |
| `public/manifest.webmanifest` | 1 182 | escrito, conferido pelo portão | os campos da edição portuguesa |
| `public/en/manifest.webmanifest` | 1 099 | escrito, conferido pelo portão | os mesmos, com `lang`, `id` e `start_url` da edição inglesa |

**As duas fontes, e porquê duas.** O diretor escolheu dois ficheiros da
exploração do «e», e a §6 ter das NOTAS mede a razão. A cela do ecrã principal é
`papel sobre tinta`: 78,7 % de tinta na cela contra 22,8 % da cela clara, que é o
número que decide se um ícone segura o seu lugar numa grelha de ícones. O favicon
é o sinal de tinta **sem o campo**: um favicon é desenhado pelo navegador sobre o
separador dele, e um quadrado opaco no meio de uma barra de separadores é uma
mancha e não uma marca.

**Três coisas que o exportador passou a saber fazer**, e nenhuma delas é retoque:

1. **Compor o favicon** dos caminhos do SVG da direção. Extrai o `transform` do
   grupo `.sinal` e os dois `d`, e para com o nome do defeito se não forem dois:
   um «e» sem a barra é um «c».
2. **Ler os píxeis de um PNG dos próprios bytes**, para medir a opacidade do 180.
   O iOS compõe o `apple-touch-icon` sobre preto, e um canto transparente num
   ícone que já é quase preto sai preto sem ninguém dar por isso. O exportador
   mede os 32 400 píxeis e **para** se algum não tiver alfa 255.
3. **Escrever um ICO com DIB e não com PNG lá dentro.** Um ICO aceita as duas
   coisas, e um PNG dentro do ICO era menos código. Mas o `/favicon.ico` é o
   endereço que os clientes velhos pedem sozinhos, que é a única razão de ele
   existir ao lado do `favicon.svg`, e o PNG dentro do ICO é justamente a parte
   do formato que os clientes velhos não leem.

**Uma coisa medida e não suposta, sobre a forma do favicon.** A folha do SVG da
direção tem dois desenhos, o `.sinal` e o `.sinal-favicon`, e a regra da casa é
que os 32 e os 16 usam o segundo. **Nesta direção os dois são o mesmo desenho**:
os quatro `d` são iguais carácter a carácter, contados do ficheiro. A
simplificação é, aqui, um não acontecimento, e o favicon leva o `.sinal`.

**O enquadramento do favicon fica o do ícone, e isso tem um custo que se diz.** A
tinta ocupa um quadrado de 360 no `viewBox` de 512, ou seja o «e» aparece a
70,3 % da célula do separador, com ar à volta. Cortar o `viewBox` à tinta daria
um sinal 1,42 vezes maior no mesmo espaço. **Não se cortou**, e a razão é que as
medições de legibilidade da §6 ter (corda de 2,1 px medida aos 16 px, banda de
3 px) são deste enquadramento: cortá-lo punha no ar uma geometria que não foi
medida. Fica como pergunta para a direção, não como defeito.

---

## 2 · A zona segura do `maskable`, medida nos píxeis

Um ícone adaptável do Android é recortado com uma forma que o sistema escolhe, e
a única coisa garantida é o **círculo inscrito de raio 40 % centrado**. Num
ficheiro de 512 px isso são **204,8 px**.

| medida | valor |
|---|---|
| ficheiro | `icon-512-maskable.png`, 512 × 512 |
| campo (cor do canto) | `#17191b` |
| píxeis de sinal (diferem do campo em mais de 8 níveis) | **36 322** |
| píxel de sinal mais afastado do centro | (168, 366) |
| distância desse píxel ao centro | **141,7 px** |
| raio do círculo seguro | **204,8 px** |
| folga que sobra | **63,1 px** |
| píxeis de sinal fora do círculo | **0** |

A distância conta-se ao **canto do píxel** mais afastado do centro e não ao
centro dele: um píxel é um quadrado de lado 1 e a tinta dele chega ao canto;
medir pelo centro dava meio píxel de folga que não existe.

O número bate com o desenho, e a conta serve de segunda leitura: o sinal, sem
redução, é um círculo de raio 180 px no quadrado de 512 (a caixa da tinta mede
360 e começa em (76, 76), medida no navegador); a folha do `maskable` reduz o
grupo a 0,78, o que dá 140,4 px. Os 141,7 medidos são esses 140,4 mais o canto do
píxel e o suavizado.

---

## 3 · O cabeçalho às sete larguras

A pergunta é a da âncora B (`design/marca/NOTAS.md` §5): o sinal à altura de
maiúscula do nome **não obriga o cabeçalho a crescer**, e a âncora A obrigaria (a
caixa de tinta passava de 26 px para 39 px). Mede-se com a página carregada, o
`<header>` medido, uma folha acrescentada no momento a esconder o sinal, e o
`<header>` medido outra vez. É a mesma página, o mesmo tipo já carregado e a
mesma composição: a única diferença é o sinal.

**Vinte e oito medições, 0,00 px de diferença em todas.**

| largura | `/` (grande) | `/en` (grande) | `/metodo` (compacto) | `/en/method` (compacto) |
|---|---|---|---|---|
| 320 | 200,73 → 200,73 | 200,73 → 200,73 | 168,33 → 168,33 | 168,33 → 168,33 |
| 360 | 200,73 → 200,73 | 200,73 → 200,73 | 168,33 → 168,33 | 168,33 → 168,33 |
| 390 | 200,73 → 200,73 | 200,73 → 200,73 | 168,33 → 168,33 | 168,33 → 168,33 |
| 430 | 177,55 → 177,55 | 177,55 → 177,55 | 145,14 → 145,14 | 145,14 → 145,14 |
| 768 | 320,83 → 320,83 | 320,83 → 320,83 | 226,98 → 226,98 | 226,98 → 226,98 |
| 1024 | 316,38 → 316,38 | 316,38 → 316,38 | 208,34 → 208,34 | 208,34 → 208,34 |
| 1280 | 323,11 → 323,11 | 323,11 → 323,11 | 208,75 → 208,75 | 208,75 → 208,75 |

*(com o sinal → sem o sinal, em píxeis de CSS. A marca fica numa linha em todas.)*

**E o lockup, medido e não afirmado.**

| largura | corpo do nome | altura de maiúscula | tinta do sinal | da maiúscula | desvio da base | folga | da maiúscula |
|---|---|---|---|---|---|---|---|
| 320, 360, 390, 430 (grande) | 34,00 | **22,44** | 22,44 | 1,000 | 0,00 | 9,42 | **0,420** |
| 768 (grande) | 56,83 | 37,51 | 37,50 | 1,000 | 0,00 | 15,75 | 0,420 |
| 1024, 1280 (grande) | 68,00 | 44,88 | 44,88 | 1,000 | 0,00 | 18,84 | 0,420 |
| 320 a 430 (compacto) | 24,00 | 15,84 | 15,83 | 0,999 | 0,00 | 6,64 | 0,419 |
| 768 (compacto) | 26,11 | 17,23 | 17,22 | 0,999 | 0,00 | 7,23 | 0,420 |
| 1024, 1280 (compacto) | 34,00 | 22,44 | 22,44 | 1,000 | 0,00 | 9,42 | 0,420 |

**A altura de maiúscula sai do tipo carregado**, com o `actualBoundingBoxAscent`
de um «E» na fonte que a página está mesmo a usar, e não da nota: dá 22,44 px em
34 de corpo, ou seja **0,660**, que confirma o valor que a §5 das NOTAS leu da
tabela `OS/2` do ficheiro. O que se mede no sinal é a **caixa da tinta** e não a
do SVG, porque a caixa podia ter ar à volta sem se ver: o `viewBox` do sinal do
cabeçalho está recortado à tinta (`76 76 360 360`), medida no navegador.

Três coisas que só apareceram ao medir:

* **`letter-spacing: normal` no sinal não é cosmética.** O `.wordmark` aperta as
  letras em menos 0,014em, e o aperto aplica-se também depois de um elemento
  substituído. Sem essa linha a folga media 0,2632em em vez de 0,2772em, ou seja
  o aperto do texto a comer 5 % de uma medida que não é de texto.
* **O sinal assenta na linha de base com 0,00 px de desvio**, o que é o que a
  §6 bis item 6 pede. Um `inline-block` alinha o bordo de baixo pela base sem
  mais nada.
* **A largura de 430 dá um cabeçalho mais baixo do que a de 390** (177,55 contra
  200,73). Não é deste trabalho: é o ponto de rutura da navegação que já lá
  estava, e aparece igual com o sinal e sem ele.

**Em escuro o «e» é papel, pelo caminho real.** O sinal pinta-se com
`currentColor`, herdado de `.wordmark`, que é `var(--ink)`. Medido com a escolha
guardada em `localStorage`, que é o único caminho para o escuro desde a Emenda
12: em claro o navegador desenha o caminho com `#17191b`, em escuro com
`#eceeea`, e são exatamente as duas tintas de `tokens.css`.

---

## 4 · As réguas, e os casos vermelhos

`tests/inicio/app.mjs`, 68 células, sai com 0. Não entra no `npm run build` e não
constrói nada, como a `regioes.mjs`: o código de saída é o que faz um estrago
plantado ser visível.

**O leitor de PNG é próprio, e é a razão de a conferência valer.** O exportador
tem o dele, para medir a opacidade do 180; uma régua que usasse esse leitor
confirmava-se a si própria, e um defeito nele passava pelos dois lados ao mesmo
tempo. Pela mesma razão a varredura das cabeças usa expressões sobre o HTML
servido e não o `node-html-parser` do portão.

| célula | o que mede | o que mediu |
|---|---|---|
| A1 | os dois manifestos, campo a campo | oito campos por edição, todos certos |
| A2 | cada ícone declarado existe com o tamanho da **cabeça do PNG** | 192, 512 e 512 `maskable`, nas duas edições |
| A3 | a zona segura do `maskable`, nos píxeis | 0 píxeis fora, 63,1 px de folga |
| A4 | o `apple-touch-icon` opaco e de 180 | 180 × 180, alfa mínimo 255 em 32 400 píxeis |
| A5a | o `favicon.ico` pelo seu diretório | 2 imagens, 32 × 32 e 16 × 16, 32 bits/px, 4 264 B e 1 128 B, ambas cabem |
| A5b | o `favicon.svg` | 2 caminhos, regra do escuro presente, sem campo, iguais aos de `e2-unida-28.svg` |
| A6 | as cinco ligações na cabeça de **todas** as rotas | 6 570 rotas da casa, zero faltas; 16 documentos alojados fora da conta e nenhum tocado |
| A7 | a altura do cabeçalho com e sem sinal | 28 medições, 0,00 px |
| A8 | a âncora B | tinta a 1,000 da maiúscula, base a 0,00, folga a 0,420 |
| A9 | a tinta do tema no sinal | `#17191b` em claro, `#eceeea` em escuro |
| A10 | as três proibições | 6 586 páginas e 5 ficheiros de JavaScript, zero achados |

**Os documentos alojados ficam de fora da A6, e a exclusão é medida.** São 16, e
é a regra que a casa já tem, escrita no portão de HTML: obra alojada intacta,
conferida carácter a carácter contra a origem. Não passam pelo `Base.astro`, não
têm cabeçalho da casa nem canónico, e pôr-lhes uma ligação na cabeça mudava os
bytes de um ficheiro que o `check:documentos` compara com o resumo do original. A
célula conta-os e confere que **nenhum** deles traz nenhuma das ligações, em vez
de os subtrair em silêncio. As **proibições** da A10, essas, valem também para
eles: as ligações não lhes tocam porque são obra de outrem, mas «este sítio não
regista um service worker» é uma afirmação sobre tudo o que ele serve.

### Os dez estragos plantados da régua (`--vermelhos`, sai com 0)

Nenhum toca em disco. São transformações no caminho entre o ficheiro e quem o lê,
em três formas, porque esta régua lê três coisas diferentes: HTML servido, bytes
de um ficheiro binário, e píxeis já descodificados (que é onde um píxel de tinta
fora do círculo seguro se planta sem reescrever um PNG).

| estrago | célula | o que ela imprimiu com ele |
|---|---|---|
| um píxel de sinal em (10, 10) | A3 | o mais longe a **347,9 px**, folga de menos 143,1 px, 1 píxel fora |
| um píxel transparente no canto | A4 | alfa mínimo **0**, 1 abaixo de 255 |
| `icon-512.png` com os bytes do de 192 | A2 (as duas edições) | «tem 192 × 192 na cabeça do PNG e declara 512x512» |
| `display` trocado por `browser` | A1·pt | «display é "browser" e devia ser "standalone"» |
| o manifesto português numa página inglesa | A6 | 3 283 rotas com a edição errada |
| a etiqueta obsoleta de volta | A10 | 6 586 páginas |
| o ICO com uma imagem só no diretório | A5a | 1 imagem, 32 × 32 |
| a regra do escuro fora do `favicon.svg` | A5b | `prefers-color-scheme: false` |
| o sinal a 1,32em de altura | A7 e A8 | mais **34,75 px** de cabeçalho a 1280; no compacto a marca passa a **2 linhas**; a base desvia menos 22,44 px |
| a cor do sinal fixada em âmbar | A9 | desenhado com `#e0a21a` nos dois temas |

### E quinze estragos no portão de HTML

O `BRIEF-app.md` §3 pede que o portão «aceite as ligações novas porque as
RECONHECE, não porque se lhes abre uma exceção». Nenhuma delas ia partir nada se
ninguém lhes mexesse (a varredura dos algarismos da cabeça lê o título e a
descrição, não atributos), e é por isso que valia a pena escrevê-lo. Cada um
destes foi visto vermelho e reposto verde, com o portão a correr sobre o `dist/`
construído:

manifesto retirado de uma página · manifesto da outra edição · `short_name`
trocado · ícone apagado de `dist/` · `icon-512.png` com 192 px lá dentro · duas
`theme-color` com `media` · `theme-color` de outra cor · a etiqueta obsoleta de
volta · `apple-touch-icon` a apontar para outro ficheiro · `sizes` do ICO trocado
· `favicon.svg` apagado · o papel claro dos tokens mexido · o papel escuro mexido
· os papéis do controlo do tema mexidos · os papéis do controlo do tema apagados.

### E quatro na régua do inventário

A frase nova da casa é o nome curto, e ela vive numa superfície que régua nenhuma
alcançava. A medida 8 de `medir-defeitos.mjs` passa a ler, em cada rota
inventariada, a etiqueta `apple-mobile-web-app-title` daquela página e o `name` e
o `short_name` do manifesto que aquela página liga. Vermelhos: a linha fora do
inventário (1 358 blocos por classificar) · a linha `retirada` com a frase a
render-se · **a recolha desligada** (a linha `viva` que não se rende fecha a
construção, que é a prova de que a extensão é carga e não enfeite) · o
`short_name` do manifesto mudado sem ninguém o declarar (681 blocos por
classificar).

---

## 5 · As três decisões que tomei, e uma que não tomei sozinho

### 5.1 · Uma etiqueta `theme-color` e não duas

**Isto afasta-se do brief, e é a coisa mais importante deste relatório.** O
`BRIEF-app.md` §3 pede «`<meta name="theme-color">` com `media` para claro e
escuro (os dois papéis dos tokens)». Não foi feito assim, e a razão não é gosto:

Desde a **Emenda 12** (21.08.2026, `DECISIONS.md` §1.52) o escuro deste sítio
**deixou de vir da preferência do sistema** e passou a ser um pedido do leitor,
feito no controlo do cabeçalho e guardado no aparelho dele. O sítio é claro para
toda a gente até alguém carregar no botão. Uma etiqueta com
`media="(prefers-color-scheme: dark)"` mandaria o navegador pintar a barra de
escuro a um leitor de sistema escuro que **nunca pediu o escuro**, e cuja página é
de papel claro: seria uma barra escura por cima de uma página clara, ou seja a
etiqueta a mentir sobre o papel que está por baixo dela.

**O que está feito**: uma etiqueta no `<head>` com o papel claro, que é o do sítio
para toda a gente, e `public/js/tema.js` a trocá-la pelo papel escuro quando o
leitor escolhe o escuro. Os dois papéis dos tokens estão os dois, cada um no sítio
onde é verdade, e o portão confere que as três cópias da cor (os tokens, o
`site.config.mjs` e o controlo do tema) dizem a mesma coisa.

**A direção pode reverter isto numa linha**, e o portão diz onde. Fica registado
como divergência do brief, e não como detalhe de construção.

### 5.2 · Os manifestos ficam escritos, e o portão confere-os

O brief põe-nos em `public/`, e é onde estão. Um manifesto é o único ficheiro
público deste sítio que ninguém compõe: não é uma página que o portão varra nem
um cartão que um guião desenhe. A casa já recusou uma vez ficheiros
datilografados que ninguém confere (`IDENTIDADE.md` §10). Por isso o portão lê os
dois manifestos construídos e compara cada campo com a sua fonte de verdade: o
nome e o nome curto com `site.config.mjs`, as duas cores com o papel de
`tokens.css`, e cada ícone com o ficheiro em `dist/` e com o tamanho que a cabeça
do PNG declara. Ficam escritos onde o brief os põe, e errados não podem ficar.

### 5.3 · O sinal do cabeçalho lê o `favicon.svg`, e não o SVG da direção

São a mesma forma, e é por isso: o `favicon.svg` já é uma composição de
`e2-unida-28.svg` feita pelo exportador, e ler a origem outra vez daria uma
**segunda derivação** da mesma coisa. Duas derivações divergem no dia em que uma
delas for corrigida. Assim há uma só, e o que o separador do navegador mostra é,
aos mesmos contornos, o que o cabeçalho mostra. A régua confere que os dois
caminhos do favicon são, carácter a carácter, os do grupo do sinal do SVG da
direção.

### 5.4 · A classe do nome curto no inventário, que não é minha para decidir

O brief §5 escreve «classe conteúdo» para o `name` e o `short_name`, e é o que a
tabela faz. **A régua das três classes do próprio inventário diz outra coisa
sobre a mesma cadeia**: «navegação, o que leva a outro sítio … o nome da
publicação»; e foi por essa régua que a Emenda 18 classificou a frase de
identidade como navegação, «como o nome da publicação». «O Estado» é o nome da
publicação encurtado para caber numa cela de 60 pt.

Segui o brief, que é a instrução escrita da direção, e registei a divergência na
secção do bloco do inventário em vez de a resolver sozinho. Nenhuma das duas
classes muda a contagem que a construção fecha: a autorreferência continua a zero
em todas as rotas medidas.

E uma coisa mecânica que decidiu o número de linhas: **entrou uma linha e não
duas**. «O Estado do País» já está declarado no inventário (o nome da publicação,
`navegacao`, bloco `até 2026-08-26`), porque é a mesma cadeia que o cabeçalho
compõe. Declará-la outra vez no bloco `app` não acrescentava nada e trocava a
classe da que já existe, porque o mapa do inventário é `texto → classe` e a
última linha ganharia. O que é novo é o nome curto.

---

## 6 · O que não fiz, e o que fica por saber

* **Não instalei a aplicação em nenhum telemóvel.** É a §0, e é do diretor.
* **Não conferi a colisão do «e» minúsculo redondo com marcas de outrem.** Fica
  como estava na §6 bis das NOTAS: por conferir, e é a primeira coisa a fazer
  quando houver rede.
* **Não cortei o `viewBox` do favicon à tinta**, e a §1 diz o que isso custa e
  porque não se fez.
* **Não mexi na `PRANCHA.html` nem em `direcoes/`.** A §6 ter das NOTAS escreve
  que uma célula da exploração «passa a direção e ganha lá um lugar» se a direção
  a escolher. O diretor escolheu; a arrumação de `direcoes-e2/` para `direcoes/`,
  e o lugar dela na ordem da §7, não estão no brief da aplicação e não foram
  feitos aqui.
* **Não toquei em `DECISIONS.md`**, por instrução, e há aqui duas coisas que
  provavelmente lá querem entrar: a escolha da marca e a divergência da §5.1.
* **Não fundi nem publiquei.** O ramo é `app-2026-08-28` e fica onde está.
* **A entrada do bloco `app` em `REVISOES-DO-INVENTARIO.md` diz `por ler`**, que
  é o que ela é: a leitura cruzada do diff faz-se antes da fusão, e não antes do
  commit. O `check:voz` imprime-a em todas as construções para que ninguém a
  esqueça.

---

## 7 · O custo

Aproximadamente **370 mil símbolos** de janela consumidos nesta sessão, dos quais
cerca de 100 mil num sub-agente de leitura (Explore, modelo herdado) mandado ler
as duas réguas grandes da casa, `matriz.mjs` e `correcoes-a.mjs`, para que as
convenções de `tests/inicio/app.mjs` fossem copiadas e não inventadas. O resto foi
do construtor (Claude Opus 5). O número é o do contador de sessão e é uma
aproximação, não uma leitura de faturação.

Sete commits, todos com caminhos explícitos e os dois trailers, todos com
`npm run build`, `npm run verify` e `npm run typecheck` verdes.
