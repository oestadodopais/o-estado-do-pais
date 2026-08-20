# Nota da etapa 2 · a primeira página, secretária e telemóvel

*Quem construiu: **Claude Opus**, construtor B, sozinho, sem subagentes. Ramo
`redesenho-v3`, a partir de `d34d8d0` (a etapa 1 fechou em `484da14`). Nada foi
empurrado, nada foi posto no ar, `vercel.json` não foi tocado, e nenhum byte de
`src/data/metodo.mjs` ou de `src/data/sobre.mjs` mudou. Escrita no Acordo de
1990, sem travessões.*

*Esta nota foi escrita no ponto de controlo a seguir à subetapa 2c, antes de
qualquer auditoria, e é completada no fim. Todos os números que ela traz vêm de
um comando que está escrito ao lado deles.*

---

## 0. Os commits

| Commit | Subetapa | O quê |
| --- | --- | --- |
| `b80200f` | 2a | prova, figuras: o lado do limiar declarado, as três chaves do painel, e uma só palavra para a cobertura |
| `0c1ef02` | 2b | início, cabeça: a linha de comando, a cabeça 2+2, o mapa que respira e a banda da região |
| `1c0f1b7` | 2c | início, painel: as peças nas duas densidades, a régua-espécime, as portas e o instrumento a tinta |
| `99a2694` | 2d | início, runtime: o estado no endereço, e um script que só escolhe cadeias já validadas |
| `d7f7a7e` | 2e | início, telemóvel: o âmbito como destinos, o selo do país como único alvo, e as medidas em filas |
| `2d34617` | 2f | réguas: a invariância como conselheiro, a matriz de aceitação e as 64 capturas |
| `14c533c` | 2g | início, revisão: as sete correcções do lugar de direcção à primeira página |
| *(o commit que contém esta nota)* | 2h | início, proximidade e duas arestas: o gesto da Emenda 3 atrás de um toque, ISSUES I20 e I21 |

---

## 1. Subetapa 2a · os dados e a prova

### O lado do limiar (ISSUES I6)

Cada `limiar` de `src/data/figuras.mjs` passa a declarar `lado`:

| linha | limiar | lado |
| --- | --- | --- |
| `divida-publica-2025` | 60 | `superior` (teto) |
| `posicao-de-investimento-internacional-2025` | −35 | `inferior` (chão) |
| `custo-unitario-do-trabalho-2025` | 9 | `superior` |
| `precos-da-habitacao-2025` | 9 | `superior` |

É um campo escrito, nunca inferido do sinal. A nota de cada uma das quatro
linhas do livro-razão traz o limiar com o seu sinal («Limiar do Procedimento
relativo aos Desequilíbrios Macroeconómicos: 60%», «: -35%», «: +9% (EA)», «:
+9%»), lidas hoje nos ficheiros; o LADO é a leitura do quadro que o plano fixa, e
está atribuído ao plano no comentário do ficheiro em vez de ser dado como escrito
na fonte.

### `src/lib/estado.mjs`

`estadoDaMedida(claim, limiar)` → `fora` · `dentro` · `sem` · `null`. A igualdade
conta como `dentro`, e a razão está escrita ao lado da regra: um limiar do quadro
é «não passar de», e quem está exactamente nele não passou. Sem `lado` declarado
a resposta é `null`, e um `null` não se rende.

`estadoDaRegua(claim, referencia)` → `{ estado, colore }`. Duas referências, e só
uma colore: o teto legal do índice de dívida é um limiar formal publicado (a lei
fixa-o) e colore; a base 100 de um índice cuja unidade é uma média não colore
(Emenda 1).

`escalaDaRegua(valor, referencia)` calcula as pontas da escala dos dois números
que já existem, por regra mecânica (passo = o menor de {1, 2, 5}×10^k que chegue
para cinco divisões; pontas arredondadas para fora; um passo extra só do lado
onde está o VALOR). Nenhuma ponta é escrita à mão. As cinco escalas que a página
usa hoje: dívida 0–100, posição de investimento −60–0, custo do trabalho 0–25,
preços da habitação 0–20, índice de dívida de Évora 0–150 (o teto calha na ponta,
e é lá que um teto legal deve estar).

### As três chaves da prova, e o que a máquina consegue provar

`painel_total` = 8, `painel_com_limiar` = 4, `painel_fora_do_limiar` = 4, cada
uma com a porta `/#painel` (`/en#painel` na edição inglesa). `contasDoPortao()`
reconta as três com a REGRA escrita dentro do portão, e não importa
`estadoDaMedida()`: partilhar a regra seria confirmar uma função contra ela
própria.

**Os três estragos plantados**, cada um fechou a construção com a mensagem do
próprio portão, e os três foram revertidos:

```
1) src/lib/prova.mjs: FIGURAS.length → FIGURAS.length + 1
   npm run build
   ✗ a prova diz que "painel_total" é 9 e o portão conta 8 (vista: ledger).
     Não é um desacordo de rendição: são duas contas da mesma coisa, e discordam.

2) src/lib/prova.mjs: FIGURAS.filter((f) => f.limiar) → FIGURAS.filter((f) => f)
   npm run build
   ✗ a prova diz que "painel_com_limiar" é 8 e o portão conta 4 (vista: ledger).

3) src/lib/estado.mjs: em `lado === 'superior'`, `valor > alvo` → `valor < alvo`
   npm run build
   ✗ a prova diz que "painel_fora_do_limiar" é 1 e o portão conta 4 (vista: ledger).
```

**E um quarto, que NÃO fechou a construção, e é o achado desta subetapa.** O
brief pedia como terceiro estrago «editar o valor de uma linha para o outro lado
do seu limiar». Fi-lo, e o resultado é este:

```
sed -i '' 's/^value: "17,6"/value: "8,6"/' ledger/claims/precos-da-habitacao-2025.yml
npm run build
  → código de saída: 0 · 0 erros
```

A construção fica verde porque as duas contas se movem juntas: a prova e o portão
leem o mesmo ficheiro do livro-razão, e uma linha alterada não é um desacordo, é
uma alteração. **Isto não é um buraco do portão: é o limite que ele próprio
declara**, e está escrito em `scripts/gate-html.mjs` ao lado da tabela das vistas
(«`'ledger'` … apanha um erro de qualquer um dos dois lados; **não apanha um
livro-razão errado, que é trabalho da verificação contra a fonte**»). O que
apanha um valor mudado é a reconferência contra a fonte (`verifications[]`) e a
travessia do motor, não este varrimento. Fica dito em vez de ser contornado, e o
estrago foi revertido (`value: "17,6"` conferido depois).

### O vocabulário de cobertura (defeito 7)

Saíram cinco cadeias, nas duas edições: `municipios.semPagina`,
`municipios.comPagina`, `home.instr2.coberturaLabel`, `home.instr2.legendaAceso`,
`home.instr2.legendaApagado`. Entraram duas, `cobertura.temPagina` e
`cobertura.semPaginaAinda`, e cada rendição leva `data-cobertura`.

`scripts/medir-defeitos.mjs` ganhou a medida «frases de cobertura».

**Antes**, e é honesto dizer o que «antes» quer dizer: na construção da base
`77e82eb` a medida imprime «nenhuma marca data-cobertura no dist/», porque não
havia marca nenhuma — as três formulações concorrentes eram invisíveis a
qualquer régua. Contadas à mão nas cadeias que saíram: **três** distintas para
«com página» (`coberturaLabel`, `legendaAceso`, `comPagina`) e **duas** para «sem
página» (`legendaApagado`, `semPagina`), em cada edição.

**Depois** (`node scripts/medir-defeitos.mjs`, com o painel da 2c construído):

```
frases de cobertura · en · com-pagina ... 1 distinta(s) em 6 ocorrência(s)  ✓
frases de cobertura · en · sem-pagina ... 1 distinta(s) em 308 ocorrência(s)  ✓
frases de cobertura · pt-PT · com-pagina ... 1 distinta(s) em 6 ocorrência(s)  ✓
frases de cobertura · pt-PT · sem-pagina ... 1 distinta(s) em 308 ocorrência(s)  ✓
```

À primeira corrida a medida deu **2 distintas** em «com página» e apanhou um
defeito verdadeiro: a seta «→» ia dentro da marca no índice dos concelhos, e
«tem página →» é outra cadeia. A seta saiu para fora da marca.

### `regioes.mjs`

Um `slug` por região (`portugal`, `grande-lisboa`, `peninsula-de-setubal`,
`algarve`, `madeira`, `alentejo`): a lista fechada que o âmbito do endereço
resolve.

---

## 2. Subetapa 2b · a cabeça

### O que ficou construído

- **`Comando.astro`**: âmbito (País · Região · Município) e densidade (Relance ·
  Leitura breve), em `<a href>` para destinos que existem sem script: `/`,
  `/#convergencia`, `/municipios`, `/?densidade=leitura`. O script troca-lhes o
  `href` para a forma do estado e acrescenta `role="button"` e `aria-pressed`.
- **`Cabeca.astro`**: nove blocos no HTML, um aceso. País, as seis leituras da
  régua (Portugal incluído), Évora, e um bloco para os outros 307 concelhos.
- **`FilaDeEstados.astro`**: um quadrado de 15px por medida, agrupado por estado,
  **com a palavra ao lado** — o estado nunca é dito só pela cor. Um concelho sem
  página não renderiza fila nenhuma (decisão b).
- **`MapaRespira.astro`**: um só instrumento, três posturas por folha de estilos.
  308 pontos iguais, ■ para «tem página», □ para os outros.
- **`Pesquisa.astro`**: os 308 resultados saem do servidor, escondidos; a
  pesquisa tira o `hidden` aos que casam. Nenhum resultado é criado no cliente.
- **`BandaDaRegiao.astro`**: a régua da convergência em largura inteira, na
  gramática da Emenda 4, sem cor e sem distância em algarismos.
- `InstrumentoMapa.astro` e `public/js/mapa.js` saíram. Nenhuma outra vista os
  usava (conferido: `MunicipioView.astro` nomeia `InstrumentoConvergencia` só num
  comentário, e não importa nenhum dos dois). **Não foi preciso adaptar nenhuma
  chamada de `MunicipioView.astro`**, ao contrário do que o brief admitia.

### A manchete deixa de ser uma palavra

«Quatro limiares europeus ultrapassados» passa a
`data-prova="painel_fora_do_limiar"` com a porta `/#painel`, e rende **«4
limiares europeus ultrapassados.»**. É o desvio n.º 6 do plano, e é deliberado: o
portão compara algarismos, e uma palavra escrita à mão fica errada na primeira
segunda-feira em que o painel mudar. Há duas frases (uma e muitas) e é o SERVIDOR
que escolhe.

### As duas medições que mudaram o desenho

**1. `[hidden]` perdia para as regras desta folha.** O atributo `hidden` vale
`display: none` por regra do navegador, e uma regra de navegador perde para
qualquer selector de classe. Medido na página construída: as nove cabeças, os 308
resultados da pesquisa e (à segunda medição, na 2c) os sete painéis apareciam
todos ao mesmo tempo. Como `hidden` é o único mecanismo com que o script muda de
estado, `[hidden] { display: none !important }` é a linha que faz o estado
existir.

**2. A ficha do mapa transbordava a janela a 390.** Medido:
`document.documentElement.scrollWidth` = **400** para `clientWidth` = 390. A
mesma medição na construção da base dá 390. A causa: `figure.mapa` em duas
colunas (`170px minmax(0, 1fr)`) com o conteúdo mínimo da ficha mais largo do que
a coluna que sobra. Abaixo de 640 empilha-se, e as três larguras voltam a fechar:

| largura | `scrollWidth` | `clientWidth` |
| --- | --- | --- |
| 1280 | 1280 | 1280 |
| 390 | 390 | 390 |
| 320 | 320 | 320 |

### As áreas de toque do mapa, e o que a geometria não deixa fazer

Cada ponto leva uma área invisível igual a **metade da distância ao vizinho mais
próximo**, com tecto em 24 CSS px de lado. Medido sobre os 308 centróides:

| | unidades de campo | a 1280 (mapa de 281px) |
| --- | --- | --- |
| vizinho mais próximo (mínimo) | 1,41 | — |
| lado do alvo, mínimo | — | **6,1 px** |
| lado do alvo, mediana | — | **6,4 px** |
| lado do alvo, máximo | — | **24,0 px** (o tecto) |

**24×24 CSS px por ponto não é alcançável**, e fica dito em vez de contornado:
com vizinhos a 1,41 unidades num campo de 600×790, nenhum desenho dá 24px a esses
pontos sem lhes dar o do lado, e uma área sobreposta não é um alvo maior — é uma
porta que abre o concelho errado (é a medição da etapa 1d, ISSUES I13, aplicada a
um mapa). O caminho fiável para escolher um concelho é a pesquisa, que é o que a
Emenda 3 já nomeia como caminho principal no telemóvel. Fica em ISSUES como
**I17**.

---

## 3. Subetapa 2c · o painel

### A peça

Um `<details>` nativo: fechado é Relance, aberto é Leitura breve. Sem JavaScript
cada medida abre-se sozinha, com teclado e com estado anunciado pelo navegador.

**O selo é UM por peça, e é o último elemento dela.** A prancha desenha dois — um
no pé e outro na linha do recibo — e dois alvos de 44px a poucos píxeis um do
outro sobrepõem-se, que é exactamente o defeito que a etapa 1d recusou. Aqui a
linha do recibo É a linha do selo: fechada, o pé diz só o selo; aberta, ganha à
frente as palavras «o recibo completo está na linha», por folha de estilos sobre
`[open] ~` e não pelo script.

O corpo do valor é decidido na construção pelo número de glifos: ≤ 5 → 80px, ≤ 7
→ 60px, daí para cima 44px. O símbolo da unidade fica fora do elemento
`data-claim` (defeito 8), na linha «unidade · período».

### As quatro escolhas editoriais desta subetapa

São chamadas da direcção; escrevi a melhor versão e sigo, como o brief manda.

1. **A frase de cada peça de Évora é a `nota` do mosaico do relance**, e não a
   frase da leitura breve da página do município. A relocação R2 autoriza as oito
   medidas do RELANCE; a frase «O poder de compra por habitante está acima da
   média nacional…» está na `leitura`, e relocá-la seria um movimento que o
   registo não autoriza.
2. **O poder de compra não leva palavra de estado.** A Emenda 1 tira a cor a uma
   posição face a uma média, e o vocabulário de estado do sítio tem três palavras
   fechadas: «fora do limiar», «dentro do limiar», «sem limiar». «Acima da média
   nacional» seria uma quarta, e a peça rende `sem limiar`, que é verdade.
3. **Só há régua onde há referência publicada** (Emenda 4): as quatro medidas com
   limiar, o índice de dívida contra o teto legal, e a peça da região contra a
   média da UE-27. As outras dizem-no por palavras.
4. **O estado vazio leva moldura cinzenta e não tracejada.** A prancha desenha-o
   a tracejado, e o tracejado é a língua do «falta um campo» (regra 5 do Método).
   Uma segunda leitura do mesmo desenho seria uma segunda língua.

### As portas (R5)

Três linhas, com os textos das secções v2 cortados. **Duas formas de linha, e a
razão não é de gosto**: em Municípios e Estudos as contagens abrem a mesma
página, e a linha inteira é a ligação; na Agenda as quatro contagens abrem quatro
secções diferentes (`/agenda#estado-em_curso` e as outras três), e uma ligação
dentro de outra ligação não é HTML — por isso cada contagem é a sua própria
porta. **Não há porta para o catálogo nem para o dossiê** (plano §4, desvio 1).

### O instrumento n.º 1, a tinta (ISSUES I12, §4 item P)

Saíram os quatro literais de ficha morta: `fill="var(--yellow)"` (a barra da
distância, que passa a TINTA, como a Emenda 4 manda) e três `var(--paper-2)` (as
chapas dos rótulos, que passam a papel), no gabarito e no seu par
`public/js/convergencia.js`. **I12 fecha-se aqui na parte que é desta etapa**;
sobram os três literais de `AgendaView.astro` e `MunicipioView.astro`, que são
das etapas 4 e 3.

**§4 item P fecha-se**: o `aria-live="polite"` estava na frase da região com que
a página foi construída, e ao trocar de região o script mostrava outra frase, sem
marca nenhuma — quem ouve a página não recebia nada. A marca sobe para o
contentor `.brief`, que é o que muda.

**§4 item O fica adiado, e a razão é de propriedade**: pôr o título da linha no
texto oculto de cada selo é uma alteração a `Provenance.astro`, que é do
construtor A durante toda a fase. O pedido está escrito abaixo, com a alteração
exacta.

---

## 4. As réguas, antes e depois

`node scripts/medir-defeitos.mjs`, sobre a mesma construção que o portão varre.

| medida | base `77e82eb` | depois da 2c |
| --- | --- | --- |
| páginas | 307 | 307 |
| porta de correcções | 307/307 | 307/307 |
| primeira página · valores sem selo | 0 | **0** |
| primeira página · selos para outra linha | 0 | **0** |
| frases de moldura | 77 distintas · 2 367 | **94 distintas · 2 405** |
| `[descrição em preparação]` | 0 | 0 |
| linhas com `#page=` | 23 de 132 | 23 de 132 |
| linhas com recorte | 22 de 132 | 22 de 132 |
| localizadores internos | 0 | 0 |

**As frases de moldura SUBIRAM, e o plano esperava que descessem. As duas coisas
são verdade, e a régua diz porquê.** As 17 frases novas são, uma a uma, as
duplicações que o registo autorizou, e cada uma aparece em exactamente duas
páginas:

- **R2**, as oito medidas de Évora: sete notas distintas por edição (duas
  medidas partilham a mesma nota) mais o nome de uma medida, agora na primeira
  página e na página do município;
- **R6**, a frase de abertura de Évora, pela mesma razão.

Nenhuma frase SAIU, e é isto que desfaz a expectativa do plano: a régua só conta
uma frase quando ela aparece em **mais do que uma página**, e os textos das
secções da primeira página v2 (`home.numeros.eyebrow`, `h2`, `sub`, e as onze
cadeias de `home.instr2.*`) apareciam numa página só. Cortá-los não podia baixar
esta contagem, e não baixou. A descida que o plano §4 espera pertence à fase da
voz, e a etapa 3, ao reescrever a página do município, pode tirar as 17 se a
direcção quiser as duplicações desfeitas.

Comando e saída, ipsis verbis, guardados em
`design/especime-v3/medicoes/2026-08-20-etapa-2c-<sha>-defeitos.json`.

---

## 5. Pedidos ao dono da folha (construtor A)

Nenhum destes ficheiros foi tocado por esta etapa.

1. **`src/styles/site.css`, o bloco de remapeamento do amarelo (etapa 1c).** As
   seis regras que remapeiam `fill="var(--yellow)"` e `var(--paper-2)` dentro de
   `.rule-svg` já não governam nada: os literais saíram do gabarito e do
   `convergencia.js`. As regras de `.map-svg` (`[data-aceso] rect`, `.mun-lit`)
   também não: o instrumento n.º 2 deixou de existir. **Podem sair as que dizem
   respeito ao mapa e à régua da convergência**; as de `.mun-distancia-svg`,
   `.mun-serie-svg` e `.agenda-eixo-svg` ficam, porque essas vistas são das
   etapas 3 e 4.

2. **`src/components/Provenance.astro`, §4 item O.** O texto oculto do selo diz
   hoje «<verLinha>: [calculado · ]<trabalho>». Numa legenda partilhada, catorze
   selos dão três nomes acessíveis distintos. A alteração pedida: o texto oculto
   passa a levar também o TÍTULO daquela linha, e `seloDaLinha()` em
   `scripts/gate-html.mjs` aprende a nova forma (é uma extensão de uma
   conferência que já existe, com estrago plantado e revertido). Não a fiz porque
   o ficheiro é do construtor A durante toda a fase.

3. **`src/components/Masthead.astro`, linha 120.** `const painel = ${home}#numeros`
   é a porta do sinal de tempo, e é a mesma âncora que `painel_reconferido_em`
   usa em `src/lib/prova.mjs`. A primeira página v3 chama ao painel `#painel`, e
   por isso mantive **também** um `id="numeros"` — na linha onde a data de
   reconferência do painel se vê, que é exactamente o que as duas portas
   prometem. Se a cadeira preferir um nome só, são duas linhas: esta e a de
   `prova.mjs`, no mesmo commit.

4. **`src/components/Claim.astro`, a palavra do provisório (decisão d).** Onde
   `pib-pc-portugal-2024` rende — o instrumento n.º 1 e a banda da região —
   deixei o valor a passar por `<Claim>` como sempre. A palavra «provisório» vem
   de `Claim.astro`, lendo `source_flag`, e é do construtor A, depois desta
   etapa.

5. **`scripts/medir-contraste.mjs`, o `PARES`.** Os pares que esta etapa pinta são
   todos os que a etapa 1c já mede: `amber/paper` e `onamber/amber` (o marcador
   «fora» e o seu contorno), `cobalt/paper` e `ink/cobalt` (o marcador «dentro» e
   o seu contorno), `ochre/paper` e `cobalt-palavra/paper` (as palavras de
   estado), `g3/paper` (as molduras das peças), `g2/paper` (a calha da régua e as
   fronteiras dos comandos), `ink/paper` e `muted/paper` (texto). **Nenhum par
   novo**, e por isso não há pedido de entrada nova no array.

---

## 6. O que fica dito, e não descoberto depois

1. **A ilha da CAOP é o mapa.** Os dois `data-slot` recebem o nome e o distrito
   de `data-m` e `data-d` do nó daquele concelho, e o distrito é a cadeia da
   Carta tal como ela a escreve. Para Beja isso dá «Beja · município · Beja», que
   é verdade e é redundante; a etiqueta de Évora, que vem de `municipios.mjs`,
   diz «distrito de Évora». **É uma incoerência de forma entre um concelho e os
   outros 307**, e é uma chamada da direcção: ou os 307 ganham o prefixo (que
   teria de ser calculado, e seria errado nas 30 ilhas), ou Évora perde o dela.
2. **`src/lib/inicio.mjs` é um ficheiro que o brief não nomeia.** Guarda a lista
   fechada dos âmbitos, o slug de cada concelho e a geometria dos alvos: é
   leitura dos dados que já existem na forma de que o endereço precisa, e não
   acrescenta um facto ao sítio. Por isso está em `src/lib/` e não em `src/data/`.
3. **Dois concelhos chamam-se Lagoa** (Faro e Ilha de São Miguel), e é a única
   colisão de nome nos 308. Um slug repetido punha os dois na mesma chave de
   endereço e o segundo deixava de poder ser escolhido, em silêncio. Onde o nome é
   único o slug é o nome; onde não é, leva também o distrito ou ilha
   (`lagoa-faro`, `lagoa-ilha-de-sao-miguel`).
4. **Nove `<h1>` no documento, oito deles `hidden`.** É deliberado e o preço está
   medido: `hidden` tira o elemento da árvore de acessibilidade, e por isso há
   sempre exactamente um título de nível 1 activo. A alternativa era compor o
   título no cliente.
5. **O quarto estrago plantado não fecha a construção** (§1), e o que isso mostra
   é o limite que o portão declara de si próprio.
6. **As frases de moldura subiram** (§4), e a subida é inteiramente as
   duplicações autorizadas R2 e R6.
7. **O `home.instr2.*` inteiro e três chaves de `home.numeros` saíram de
   `strings.mjs`** na 2f, depois de a régua da invariância os apanhar com o mesmo
   valor nas duas edições. Estavam duplicados: a etapa 2b copiou-lhes o texto para
   `inicio.mapa.*` e `inicio.cabeca.ledePais` em vez de mover as chaves, e uma
   cadeia em dois sítios diverge à primeira alteração. Conferido que nenhuma vista
   os usava, com um positivo conhecido a provar que o `grep` sabe encontrar.
8. **`public/js/convergencia.js` foi tocado** para lhe tirar os quatro literais de
   ficha morta. O brief dá-me `InstrumentoConvergencia.astro` e não nomeia o seu
   par de execução; deixar lá `var(--yellow)` era deixar aberto exactamente o
   defeito que a etapa fecha.

---

---

## 8. Subetapa 2d · o tempo de execução

`public/js/inicio.js`, adiado, progressivo, sem dependências.

**O que ele pode fazer**: trocar `hidden`, `open`, `aria-pressed` e
`aria-current`; escrever o `textContent` de dois `<span data-slot>` com texto
copiado da ilha da CAOP; juntar duas cadeias que já estão na página para a região
viva; e mexer no endereço. **O que não faz**: `innerHTML`, texto composto, um
algarismo.

**As listas fechadas são LIDAS do documento**, e não escritas no script: os
blocos de cabeça dão os âmbitos com bloco próprio, os pontos do mapa dão os 308
concelhos. Uma lista escrita no cliente divergiria da do servidor à primeira
alteração; esta não pode divergir, porque é a mesma.

**O endereço normaliza-se à chegada** com `replaceState`. Cinco valores maus,
medidos: `ambito=lisboa`, `densidade=fundo`, `ambito=municipio:evora;alert(1)`,
um `ambito` de 2 000 caracteres, e `regiao:atlantida`. Os cinco caem em País ·
Relance, o endereço fica «/», e **nenhum é ecoado na página**.

## 9. Subetapa 2e · o telemóvel

O âmbito passa a dois destinos de largura inteira ao lado do selo do país; **o
selo inteiro é o alvo e nenhum ponto é alvo** (Emenda 3), e um toque devolve os
oito concelhos mais próximos — que não são botões criados no cliente, são os
mesmos 308 resultados que o servidor rendeu, com o `hidden` tirado aos oito. As
oito medidas passam a filas, número primeiro e estado à direita.

**O que não entrou, e porquê**: a régua da convergência como porta de uma linha.
O destino que a prancha lhe dá é uma âncora na mesma página, e uma porta que abre
o que está logo abaixo não é uma porta. O instrumento fica e rola dentro da sua
caixa, como a `IDENTIDADE.md` §11 manda.

## 10. Subetapa 2f · as três réguas

### A matriz de aceitação (plano §13)

`node tests/inicio/matriz.mjs` — Chromium sem cabeça, fora da construção,
**55 de 55 células passam**.

| célula | prova |
| --- | --- |
| estado inicial · País · Relance | pais · relance · 8 peças |
| manchete do País | «4 limiares europeus ultrapassados.» |
| ordem do teclado · comando → painel → portas | comando 13 · painel 28 · portas 64 · 83 paragens |
| cinco mudanças de estado (densidade, modo região, Alentejo, modo município, Évora) | cada uma com endereço, bloco, foco e anúncio |
| foco volta ao comando, nas cinco | `leitura`, `regiao`, `alentejo`, `municipio`, `evora` |
| região viva diz a mudança, nas cinco | o rótulo do âmbito e a palavra da densidade |
| âmbito Alentejo · painel de uma peça | regiao:alentejo · 1 peça |
| âmbito Évora · painel de oito peças | municipio:evora · 8 peças |
| para trás, cinco vezes | cada passo repôs o seu estado |
| para a frente | `/?densidade=leitura` |
| recarga em cada estado | os cinco endereços repõem o seu bloco e a sua densidade |
| uma peça abre só a sua | 1 aberta |
| o comando global abre todas | 8 de 8 |
| cinco valores inválidos | caem em pais/relance, endereço «/», sem eco |
| edições pt e en · estado do endereço | regiao:alentejo · leitura, nas duas |
| a ligação de idioma leva o estado | `/en?ambito=regiao%3Aalentejo&densidade=leitura` |
| larguras 320 · 390 · 768 · 1280 | `scrollWidth − clientWidth` = 0 nas quatro |
| tema claro · papel e tinta | papel `rgb(246,247,244)` · tinta `rgb(23,25,27)` |
| tema claro · o contorno do marcador é a tinta do tema | `rgb(23,25,27)` |
| tema escuro · papel e tinta | papel `rgb(21,23,26)` · tinta `rgb(236,238,234)` |
| tema escuro · o contorno do marcador é a tinta do tema | `rgb(236,238,234)` |
| movimento reduzido | `transition-duration` 1e-05s (o valor que o motor força) |
| **o selo de cada peça é alvo de 44×44** | **31 de 31 selos de peça · mínimo 100×44** |
| **nenhum selo dentro de outro alvo** | **0 aninhados em 31** |
| nenhum par de áreas de toque sobrepostas na peça | 0 pares |
| **o selo é o maior alvo da peça** | **selo 7 040px² · maior outro 2 415px²** |
| sem JavaScript · `/` | completo e correcto: 8 peças, 8 valores, 8 selos |
| sem JavaScript · `/?ambito=regiao:alentejo` | mostra o defeito, com os comandos como ligações que abrem |
| sem JavaScript · `/?ambito=municipio:beja` | idem |
| sem JavaScript · `/?densidade=leitura` | idem |
| sem JavaScript · a nota da densidade está à vista | nas quatro |

**ISSUES I13 fecha-se na primeira página**: os 31 selos das peças têm todos alvo
de 44×44 ou mais, nenhum está aninhado noutro alvo, e não há um único par de
áreas sobrepostas. A saída foi a que a etapa 1d escreveu: dar altura à fila.

### A régua da invariância

`node scripts/medir-invariancia.mjs <base> dist` — imprime e não falha.

```
322 rotas · 15 idênticas em texto · 307 com diferenças
```

E as 307 dividem-se em três, sem sobra:

| quantas | rotas | diferença |
| --- | --- | --- |
| 2 | `/` e `/en/` | **+705 −18**: o conjunto de mudanças desta etapa |
| 303 | todas as outras páginas | **+1 «Menu»**: o comando da navegação móvel da etapa 1e |
| 2 | `/municipios/` e `/en/municipalities/` | **+2 −1**: «Menu», mais «tem página» a entrar e «Abrir a página →» a sair — o vocabulário de cobertura (defeito 7) |

As 15 idênticas são as páginas de documento de estudo, que são bytes exactos da
origem e não levam a mobília do sítio.

`node scripts/medir-invariancia.mjs --chaves` imprime **14 chaves** com o mesmo
valor nas duas edições. Quatro são desta etapa e as quatro estão em «Identidades
aceites» de `CHAVES-EN.md`: `inicio.mapa.madeira` e `inicio.mapa.total` (nome
próprio e palavra igual), `inicio.mapa.coberturaB` («concelho» fica em português
na edição inglesa, como `municipios.h1` já decidiu) e
`inicio.cabeca.tituloVazioB` («.», pontuação).

### As duas réguas antigas, depois de tudo

- **Defeitos**: 307 páginas; porta de correcções 307/307; primeira página 0
  valores sem selo e 0 selos para outra linha; **frases de moldura 94 distintas ·
  2 405 ocorrências** (77 · 2 367 na base — a subida está explicada no §4);
  `[descrição em preparação]` 0; linhas com `#page=` 23 de 132; com recorte 22;
  localizadores internos 0. **Frases de cobertura: 1 distinta por estado e por
  edição**, nas quatro combinações.
- **Contraste**: `2026-08-20-etapa-2f-contraste.json` é **idêntico, byte a byte**,
  ao da etapa 1c. Era o resultado esperado e é a prova de que esta etapa não
  introduziu um par novo: pinta com as fichas que a etapa 1c já mede, e não
  escreve um literal de cor em lado nenhum.

### As capturas

**64 ficheiros** em `design/especime-v3/capturas/etapa-2/`, nomeados
`<estado>-<largura>-<edição>-<tema>.png`: oito estados (País Relance, País
Leitura breve, Região Alentejo, Évora Relance, Évora Leitura breve, Beja vazio, a
vista de escolha, e a rendição sem JavaScript) × 1280 e 390 × pt e en × claro e
escuro. Página inteira, depois de `document.fonts.ready`.

**As capturas escuras são o primeiro teste a sério da proposta escura** (decisão
f), e a condição que a direcção lhe pôs está medida na matriz: o contorno do
marcador de estado é a tinta do tema nos dois temas, e vem sempre de uma ficha.

### Uma medição que a captura mudou

Na primeira volta das capturas, a régua do índice de dívida de Évora escrevia o
rótulo da referência («limite legal») por cima da ponta direita da escala,
porque um tecto legal É o extremo da sua própria escala. A ponta que a referência
tapa deixou de se escrever: o que se perde é a repetição, porque o rótulo da
referência traz o mesmo algarismo com a palavra que o explica.

---

## 7. Quem fez o quê, e quanto custou

Tudo o que está acima foi construído por **Claude Opus**, num só fio, sem
subagentes e sem delegação. Nenhuma parte desta etapa correu noutro modelo.

**Contagem de fichas:** a única contagem que esta sessão reporta é o orçamento
que sobra. No fim da subetapa 2c o contador dizia cerca de **14,49 milhões de
fichas por usar**, de um tecto de 15 milhões (≈ **510 mil** para as subetapas 2a
a 2c); no fim da 2f dizia cerca de **14,38 milhões**, ou seja **≈ 620 mil fichas**
para a etapa inteira. Fica dentro da escala do brief (500 a 700 mil) e abaixo do
tecto de 850 mil que mandava parar. Não tenho um número exacto e não o invento:
o que existe é a diferença de dois contadores.
---

## 2g · a revisão do lugar de direção

*Construtor B2, **Claude Opus**, sozinho, sem subagentes, 20.08.2026, a partir de
`d015fec`. Um commit. Nada foi empurrado, nada foi posto no ar, `vercel.json` não
foi tocado, nenhum ficheiro partilhado (`tokens.css`, `site.css`, `Base.astro`,
`Masthead.astro`, `SiteFooter.astro`, `Claim.astro`, `Provenance.astro`,
`Frase.astro`, `PortaDeCorreccoes.astro`) mudou um byte, e nem `src/data/metodo.mjs`
nem `src/data/sobre.mjs` foram abertos. Nenhum portão novo. Todos os números
abaixo trazem ao lado o comando que os produziu.*

**Os onze ficheiros que mudaram**, todos da lista da BRIEF-etapa-2 §2:
`src/views/HomeView.astro`, `src/components/inicio/{Cabeca,MapaRespira,Pesquisa}.astro`,
`src/components/InstrumentoConvergencia.astro`, `src/styles/inicio.css`,
`public/js/{inicio,convergencia}.js`, `src/lib/inicio.mjs`, `src/i18n/strings.mjs`,
`tests/inicio/matriz.mjs`.

### 1 · o sangramento de âmbito

«Painel europeu reconferido a 2026-08-18.» é o sinal de tempo do painel EUROPEU e
rendia-se debaixo das oito medidas de Évora e debaixo do estado vazio de Beja. A
linha ganhou `data-so-pais`, que é o mecanismo que a página já tinha para o
instrumento n.º 1 e para as portas. A âncora `id="numeros"` continua no documento
em qualquer âmbito, e por isso as duas portas que a prometem — o sinal de tempo
do cabeçalho e a chave `painel_reconferido_em` — continuam a resolver.

**A varredura das outras cadeias só do País**, medida e não presumida
(`node /…/medir.mjs`, sobre `dist/`, quatro âmbitos):

| o que é | onde vive | antes | depois |
| --- | --- | --- | --- |
| o sinal de tempo do painel | `HomeView`, `#painel` | via-se nos quatro âmbitos | **só no País** |
| a lede | `Cabeca.astro`, um bloco por âmbito | já trocava com o âmbito | sem mudança |
| a manchete | idem, nove `h1` e um aceso | já trocava | sem mudança |
| o rótulo das portas («As páginas · o resto vive a uma porta») | `Portas.astro`, dentro de `[data-so-pais]` | já só no País | sem mudança |
| o instrumento n.º 1 inteiro | `#convergencia`, `[data-so-pais]` | já só no País | sem mudança |

```
antes:  (defeito)                 verificacao: "Painel europeu reconferido a 2026-08-18."
        ?ambito=regiao:alentejo   verificacao: "Painel europeu reconferido a 2026-08-18."
        ?ambito=municipio:evora   verificacao: "Painel europeu reconferido a 2026-08-18."
        ?ambito=municipio:beja    verificacao: "Painel europeu reconferido a 2026-08-18."
depois: (defeito) "Painel europeu reconferido a 2026-08-18." · os outros três: null
```

### 2 · a ficha do mapa deixa de mandar na altura da cabeça

Saíram da ficha, para uma camada de fundo `<details>` por baixo do mapa: a citação
inteira da CAOP (`data-verbatim="caop-fonte"`, conferida carácter a carácter como
sempre), a porta do CSV, e as duas dicas de uso. Ficaram: a linha de cobertura com
as duas contagens da prova e as suas portas, a frase de neutralidade, as contagens
por parcela com os seus selos, e **uma linha de fonte compacta** montada dos campos
da própria linha do livro-razão — `source` · `document.title` · `reference_date`
(marcado `data-nonledger="data-de-referencia"`, o motivo que já existia) — com o
selo de `municipios-portugal-caop-2025` na forma de sempre. Nenhuma palavra nova.

O rótulo da camada é `inicio.mapa.deepTitulo`, que é `home.instr2.deepTitulo` da v2
relocado com a sua secção, sem uma palavra mudada: relocação **R3**, cuja nota foi
actualizada em `RELOCACOES.md`.

**As duas dicas só existem onde o mapa escolhe pontos.** «Passe o cursor sobre um
ponto» e «Teclado: Tab até ao mapa» descrevem o que só é verdade na secretária,
com o mapa inteiro e com script: entram `hidden` do servidor, o script acende-as,
e a folha volta a apagá-las abaixo de 640 e na postura de localizador. Antes, a do
cursor rendia-se sempre, inclusive sem JavaScript, onde o mapa não responde a nada.

**Medido** (`node /…/alturas.mjs`, Chromium sem cabeça sobre as duas construções):

| | 2f | 2g |
| --- | --- | --- |
| ficha do mapa, 1280 | 820px | **515px** |
| cabeça (`.cabeca-grelha`), 1280 | 826px | **558px** |
| ficha do mapa, 390 | 487px | **329px** |
| página inteira, 1280, Relance | 3 972px | **3 705px** |
| página inteira, 390, Relance | 4 950px | **3 937px** |

### 3 · a largura da leitura breve

A regra da prancha: `grid-column: span 2` para a peça aberta, uma coluna para as
fechadas, e com as oito abertas a grelha fica 2 × 4. O comando da densidade é um
`<details>` DENTRO da peça, e por isso quem muda de largura é o antepassado:
`.painel:not(.painel-um) .peca:has(.peca-mais[open]) { grid-column: span 2 }`,
acima de 640 (abaixo o painel é uma coluna só e um `span 2` criaria uma coluna
implícita). O lado seguro de falhar está escolhido: num motor sem `:has()` a peça
fica com a largura de hoje.

**Medido** (`node /…/medir.mjs`, `?densidade=leitura`):

| largura | régua antes | régua depois | peça antes | peça depois | transbordo |
| --- | --- | --- | --- | --- | --- |
| 768 | 309px | **673px** | 343px | 707px | 0 |
| 1280 | 224px | **502px** | 258px | 536px | 0 |

Capturas `pais-leitura-*` e `evora-leitura-*` refeitas (as 64 foram refeitas, ver §7).

### 4 · a régua da convergência é uma porta no telemóvel

Abaixo de 640 o instrumento fecha-se atrás de um `<details>` cujo `<summary>` leva
**palavras e mais nada**: o título do instrumento (`home.instr1.h2`) e o comando
(`densidade.abrir` / `fechar`). Nenhum valor e nenhum selo lá dentro — um selo
dentro de um `<summary>` é uma porta dentro de outra porta (Emenda 2). Na
secretária a porta não existe e o corpo está à vista, como sempre esteve.

**O corpo é irmão do `<details>` e não filho dele**, e é a única decisão de forma
desta subetapa que não segue o brief à letra. Um `<details>` fechado esconde o que
tem dentro pelo `::details-content`, e não conheço regra de folha universalmente
suportada que o volte a mostrar acima de 640; verificá-lo só em Chromium não é
verificá-lo. Com o corpo ao lado, a folha usa `[open] ~`, que existe em todo o
lado, e é a mesma mecânica que o pé da peça já usa nesta folha. O que se perde é a
associação de árvore entre o comando e o que ele abre; o que se ganha é que a
secretária não depende de um pseudo-elemento que ainda não está em todos os
motores. Fica dito para a cadeira decidir.

**«120 130» não foi o que eu medi, e o que medi está aqui.** As caixas dos rótulos
120 e 130 do eixo, a 320 e a 390, não se tocam (`120[527,6..541,6]`,
`130[595,1..609,1]`, numa tela de 660px que rola dentro da sua caixa). O único par
de caixas sobrepostas do instrumento era outro, e estava em TODAS as larguras,
1280 incluída: o nome da região e o seu valor no marcador («Portugal» / «82»),
encostados por 18 unidades de patamar com corpos de 12,5px e 16px — 0,53px de
sobreposição a 390. O nome subiu para 24 unidades e a chapa de papel por baixo
subiu as mesmas seis, no gabarito e no seu par de execução
(`public/js/convergencia.js`, que desenha os mesmos marcadores quando o leitor põe
mais regiões na régua).

**Medido** (`node tests/inicio/matriz.mjs`, células novas):

```
320 · a régua da convergência é uma porta de palavras
     porta 284×44, sem alvo dentro e sem alvo à volta, sem algarismos; abre o instrumento
320 · rótulos do instrumento sem caixas sobrepostas
     13 rótulos · 0 pares sobrepostos · rola na sua caixa · transbordo 0
390 · a régua da convergência é uma porta de palavras
     porta 354×44, sem alvo dentro e sem alvo à volta, sem algarismos; abre o instrumento
390 · rótulos do instrumento sem caixas sobrepostas
     13 rótulos · 0 pares sobrepostos · rola na sua caixa · transbordo 0
secretária · a porta da régua não existe e o instrumento está à vista
     porta false · corpo true · instrumento true
```

Antes da correcção, a mesma medição a 320 e a 390 dava
`[["Portugal","82"]]` — um par, em cada largura, e também a 1280.

### 5 · a vista de escolha com a caixa vazia

A regra da prancha (`V3Completo.dc.html`, `renderVals()`, linha 626): com a caixa
vazia, Évora e o concelho escolhido, se houver um; os outros aparecem quando o
leitor escrever. Está agora em `inicio.js` (o filtro passou a incluir o escolhido, e
é chamado sempre que o âmbito muda) e no servidor (`Pesquisa.astro` rende visível
só quem tem página, que é o caso de arranque da mesma regra, porque a página
constrói-se no âmbito País).

**A causa do que a revisão viu, e o que ela custa.** Os oito nomes das capturas
(«Arcos de Valdevez, Caminha, Melgaço…») não eram os oito mais próximos: eram os
oito PRIMEIROS da Carta, que é o que a ordenação por distância devolve quando a
geometria degenera e todas as distâncias saem `NaN`. Mas o defeito é o menor dos
dois problemas: a 2e fazia o selo do país devolver os oito concelhos mais próximos
do sítio tocado (BRIEF-etapa-2 §7, segunda metade da Emenda 3), e **isso e a regra
da prancha não podem ser as duas verdade do mesmo estado**, porque as duas
descrevem a lista com a caixa vazia. Ficou a da prancha, que é a instrução mais
recente e explícita (2g, ponto 5): o selo do país abre a vista de escolha e põe o
foco na pesquisa, e a ordenação espacial saiu.

**Uma cadeia mudou por causa disso**, e é a única mudança de texto que não é
relocação nem chave nova: `inicio.movel.proximos` dizia «Um toque no mapa devolve
os concelhos mais próximos, para escolher. No telemóvel os pontos não são alvos: a
pesquisa é o caminho.» A primeira metade passou a descrever o que a página deixou
de fazer, e saiu; ficou a segunda, que continua verdadeira. Nas duas edições, e
está em `CHAVES-EN.md`. **É a única coisa desta subetapa que precisa da palavra da
direcção**, e fica assinalada em vez de decidida.

**Medido:**

```
1280 · vista de escolha, caixa vazia
     sem escolha: evora · com Beja escolhida: beja · evora
390 · vista de escolha, caixa vazia
     sem escolha: evora · com Beja escolhida: beja · evora
antes (390): Arcos de Valdevez · Caminha · Melgaço · Monção · Paredes de Coura
             · Ponte da Barca · Valença · Vila Nova de Cerveira
```

### 6 · Évora na leitura breve

O mapa pequeno passa a estar DENTRO do cartão localizador, e não ao lado dele. O
mapa é o mesmo SVG das três posturas — 308 pontos desenham-se uma vez —, e por
isso é a moldura que se move: na postura `inteiro` o cartão dissolve-se
(`display: contents`) e só a tela se vê ao lado da ficha; na postura `localizador`
o cartão volta a ser uma caixa com moldura e a tela é o seu primeiro item. Não é o
script que troca isto: é `data-postura`, que já existia, lido pela folha. O
`cartao.hidden` do script saiu, porque esconder o cartão passaria a esconder o
mapa.

E resolve, de caminho, uma coisa que as capturas da 2e mostravam e ninguém tinha
medido: a 390, o mapa de 170px do localizador desenhava-se POR CIMA das duas
linhas «Abrir um concelho» e «Ver uma região», porque a coluna do selo tem 84px e
ele estava fora do cartão. Agora o cartão inteiro desce para a segunda fila, com o
mapa a 84px lá dentro, e o selo do país — que ficaria a ser uma porta invisível
sobre um espaço em branco — desaparece nessa postura.

**Medido:**

```
Évora · o mapa do localizador está dentro do cartão, e o mapa inteiro fica no Relance
     leitura: localizador 170px dentro do cartão (moldura 1px) · relance: inteiro 281px
     com ficha · 1 mapa no documento
```

### 7 · o rótulo do distrito (ISSUES I18, fechado)

Uma regra para os 308, a da prancha: `distrito de <d>` quando o campo da Carta é um
distrito, o nome de ilha nu quando começa por «Ilha». A regra decide-se na
construção (`src/lib/inicio.mjs`, `eIlha()`), cada ponto da ilha da CAOP leva
`data-ilha`, e o prefixo é um par de cadeias validadas (`inicio.cabeca.distritoDe`,
«distrito de » / «district of ») que já está escrito na página nas duas edições: o
script só lhe troca o `hidden`. As duas ranhuras continuam ranhuras. A mesma regra
vale no que o mapa lê em voz alta, que é o outro sítio onde o campo da Carta se
rende como etiqueta.

Évora continua a trazer a sua etiqueta de `municipios.mjs` («distrito de Évora»),
que o ficheiro publica e que esta subetapa não abriu.

**Medido** (30 dos 308 concelhos são de ilha, contados sobre `dist/index.html`:
`grep -o 'data-ilha="sim"' dist/index.html | wc -l` → 30):

```
o rótulo do distrito segue uma regra só nos 308 (ISSUES I18)
     Beja «distrito de Beja» · Horta «Ilha do Faial» · Lagoa «Ilha de São Miguel»
     · Évora traz a sua etiqueta de municipios.mjs
```

---

## 2g · as réguas

### A matriz de aceitação

`node tests/inicio/matriz.mjs` — **68 de 68 células passam** (55 da 2f, todas ainda
verdes, mais 13 novas, uma por correcção e algumas por largura). As 13:

```
passa  o sinal de tempo do painel só se lê no âmbito País
       pais true · regiao false · évora false · beja false
passa  a ficha do mapa é compacta e o fundo leva a citação, o CSV e as dicas
       ficha 515px · citação, CSV e dicas na camada de fundo, fechada · linha de fonte com selo
passa  largura 768 · a peça aberta ocupa duas colunas
       régua 673px · grid-column-start «span 2» em 8 peças · transbordo 0
passa  largura 1280 · a peça aberta ocupa duas colunas
       régua 502px · grid-column-start «span 2» em 8 peças · transbordo 0
passa  largura 320 · a régua da convergência é uma porta de palavras
passa  largura 320 · rótulos do instrumento sem caixas sobrepostas
passa  largura 390 · a régua da convergência é uma porta de palavras
passa  largura 390 · rótulos do instrumento sem caixas sobrepostas
passa  secretária · a porta da régua não existe e o instrumento está à vista
passa  largura 1280 · vista de escolha, caixa vazia
passa  largura 390 · vista de escolha, caixa vazia
passa  Évora · o mapa do localizador está dentro do cartão, e o mapa inteiro fica no Relance
passa  o rótulo do distrito segue uma regra só nos 308 (ISSUES I18)
```

As células da 2f que estas mudanças tocam continuam verdes, e são: as cinco mudanças
de estado, o foco e o anúncio de cada uma, para trás e para a frente, a recarga em
cada estado, os cinco valores inválidos, as quatro larguras sem transbordo, os dois
temas, o movimento reduzido, **o selo de 44×44 em 31 de 31 peças, 0 aninhados, 0
pares sobrepostos, o selo como maior alvo (7 040px² contra 2 415px²)**, e as quatro
rendições sem JavaScript.

### O transbordo, estado a estado — e um defeito que NÃO é meu e não fica escondido

`node /…/varrer.mjs dist-2f dist-2g`, seis estados × quatro larguras, nas duas
construções. **23 das 24 combinações dão zero nas duas.** A que não dá é a mesma
nas duas:

```
dist-2f  evora-leitura  320:10 regua-ref-rotulo «limite legal»  |  390:10 …  |  768:0  |  1280:0
dist-2g  evora-leitura  320:10 regua-ref-rotulo «limite legal»  |  390:10 …  |  768:0  |  1280:0
```

O rótulo da referência da régua do índice de dívida de Évora («limite legal») sai
10px para fora da janela a 320 e a 390, porque um tecto legal é o extremo da sua
própria escala e o rótulo está centrado nele. **Vem da 2c/2f, não desta subetapa,
não é nenhuma das sete, e não a corrigi**: a instrução desta ronda é fazer as sete
e nada mais. Fica em `ISSUES.md` como **I20**, com a medição e o remédio de uma
linha.

### A régua da invariância

`node scripts/medir-invariancia.mjs <2f> <2g>` — o delta exacto desta subetapa,
com a construção da 2f refeita a partir do mesmo ramo para o efeito:

```
322 rotas · 320 idênticas em texto · 2 com diferenças
  /      +10 −1
  /en/   +10 −1
```

**Nenhuma outra rota mudou um bloco de texto.** Os dez que entram, um a um
(`node /…/diffblocos.mjs`):

| bloco que entra | de que correcção |
| --- | --- |
| «No telemóvel os pontos não são alvos: a pesquisa é o caminho.» | 5 (a cadeia aparada) |
| «Direção-Geral do Território (DGT) · Carta Administrativa Oficial de Portugal (CAOP)» | 2 (a linha de fonte) |
| «2025» | 2 (o `reference_date` da mesma linha) |
| «fonte» | 2 (o selo da mesma linha) |
| «Linha do livro-razão: calculado · O Estado do País, apuramento próprio» | 2 (o texto oculto do mesmo selo) |
| «Método, ressalvas e proveniência» | 2 (o rótulo da camada de fundo, R3) |
| «A régua da convergência» | 4 (o nome na porta) |
| «abrir» · «fechar» | 4 (as duas metades do comando da porta) |
| «distrito de» × 2 | 7 (o rótulo de âmbito e a leitura do mapa) |

E o único que sai: «Um toque no mapa devolve os concelhos mais próximos, para
escolher. No telemóvel os pontos não são alvos: a pesquisa é o caminho.» (5).

**As correcções 1, 3 e 6 não acrescentam nem tiram um bloco de texto**, e é isso
que se espera delas: são forma.

Contra a base `77e82eb`, para comparar com a linha da 2f: `/` e `/en/` passam de
`+705 −18` a `+706 −16`; as outras 305 rotas com diferenças continuam a ser as da
etapa 1e («Menu») e a do vocabulário de cobertura em `/municipios`.

`node scripts/medir-invariancia.mjs --chaves` imprime **14 chaves** com o mesmo
valor nas duas edições — o mesmo número da 2f, e nenhuma nova. As três cadeias
que esta subetapa escreveu têm inglês próprio.

### As duas réguas antigas

- **Defeitos**: `node scripts/medir-defeitos.mjs --json` dá um ficheiro **idêntico,
  byte a byte**, ao da 2f (`diff` sem saída). 307 páginas; porta de correcções
  307/307; primeira página 0 valores sem selo e 0 selos para outra linha; frases de
  moldura 94 distintas · 2 405 ocorrências; cobertura 1 distinta por estado e por
  edição nas quatro combinações. **Delta: nenhum**, e era o esperado — esta
  subetapa não move uma frase de uma página para outra.
- **Contraste**: `2026-08-20-etapa-2g-contraste.json` é **idêntico, byte a byte**,
  ao da 2f e ao da 1c. Nenhum par novo, nenhum literal de cor.

Guardados em `design/especime-v3/medicoes/2026-08-20-etapa-2g-{defeitos,contraste,matriz,invariancia}.json`.

### As capturas

`node tests/inicio/capturas.mjs` — **as 64 refeitas**, mesmos nomes, mesma pasta.
Todas mudaram: a cabeça encolheu em todos os estados (2), a porta da régua entra em
todas as capturas a 390 (4), o sinal de tempo sai de três âmbitos (1), a leitura
breve muda de grelha (3), a vista de escolha muda de lista (5), Évora muda de
cartão (6) e Beja muda de rótulo (7).

---

## 2g · o que fica por fazer, e porquê

1. **I20, o transbordo de 10px em Évora na leitura breve** (acima). Vem da 2c, não
   é das sete, e não lhe toquei.
2. **I21, «Toque num ponto para escolher o concelho.» no telemóvel.** A dica rende-se
   sempre que o âmbito é Município, inclusive a 390, onde nenhum ponto é alvo
   (Emenda 3: o selo inteiro é o alvo). É da mesma família das duas dicas que o
   ponto 2 mandou fechar, mas o ponto 2 nomeia duas e esta é a terceira. Fica dita.
3. **A ordenação espacial do selo do país** (ponto 5 acima): saiu, e a razão é que
   contradiz a regra da prancha para a caixa vazia. É uma chamada da direcção se
   quiser as duas coisas — teriam de ser estados diferentes, com gestos diferentes.
4. **A cadeia `inicio.movel.proximos`**, aparada em vez de removida. Chamada
   editorial, assinalada.

## 2g · quem fez o quê, e quanto custou

**Claude Opus** (construtor B2), num só fio, sem subagentes e sem delegação. Nenhuma
parte desta subetapa correu noutro modelo.

**Contagem de fichas:** a única contagem honesta é a diferença de dois contadores.
No início desta subetapa o contador dizia cerca de **14,97 milhões** por usar; no
commit dizia cerca de **14,64 milhões** — ou seja **≈ 335 mil fichas**. A
estimativa do brief era 120 a 200 mil, e foi passada: o que a passou foi a
medição, não a escrita. Sete correcções, treze células novas de matriz, uma
segunda construção do ramo para ter o delta de invariância exacto em vez de o
inferir de duas leituras contra a base, uma varredura de seis estados por quatro
larguras nas duas construções, e 64 capturas refeitas. Não tenho um número exacto
e não o invento.

---

## 2h · a proximidade, e duas arestas

*Construtor B3, **Claude Opus**, sozinho, sem subagentes, 20.08.2026, a partir de
`14c533c`. Um commit. Nada foi empurrado, nada foi posto no ar, `vercel.json` não
foi tocado, nenhum ficheiro partilhado (`tokens.css`, `site.css`, `Base.astro`,
`Masthead.astro`, `SiteFooter.astro`, `Claim.astro`, `Provenance.astro`,
`Frase.astro`, `PortaDeCorreccoes.astro`) mudou um byte, nenhum portão novo,
nenhum número inventado. Todos os números abaixo trazem ao lado o comando que os
produziu.*

**Os oito ficheiros que mudaram**, todos da lista da BRIEF-etapa-2 §2:
`src/components/inicio/{Regua,MapaRespira,Pesquisa}.astro`,
`src/styles/inicio.css`, `public/js/inicio.js`, `src/i18n/strings.mjs`,
`tests/inicio/{matriz,capturas}.mjs`.

### 1 · a lista de proximidade volta, atrás de um toque a sério

A Emenda 3 diz que no telemóvel, «na escolha, um toque no mapa devolve os
concelhos mais próximos como botões (lista de proximidade sobre os centróides
CAOP)», e a prancha do telemóvel desenha-o. A 2g tirou-a, e a nota da 2g escreveu
porquê e o que faltava decidir: a lista de proximidade e a regra da prancha para
a caixa vazia estavam a descrever **o mesmo estado**, e «teriam de ser estados
diferentes, com gestos diferentes». É o que a 2h faz.

**Três estados, três gestos**, e nenhum deles precisa que outro deixe de ser
verdade:

| gesto | o que a fila mostra |
| --- | --- |
| caixa escrita | os que casam com o que está escrito, no máximo oito |
| toque no selo, já dentro da vista | os mais próximos do sítio tocado, no máximo oito |
| nem uma coisa nem outra | Évora e o concelho escolhido (a regra da 2g, intacta) |

O primeiro toque no selo, vindo de outro âmbito, continua a ser **a porta**: abre
a vista, limpa a caixa e põe o foco na pesquisa. O toque seguinte, já lá dentro,
é **o gesto**. Escrever desfaz o gesto; tocar outra vez refá-lo noutro sítio.

**O defeito da 2e não volta, e a guarda é explícita.** O que a revisão da 2g
apanhou nas capturas («Arcos de Valdevez, Caminha, Melgaço…») era o defeito e não
a funcionalidade: sem toque nenhum, a ordenação saía do canto do campo e a
«proximidade» era a ordem da Carta. `maisProximosDe()` recusa-se a devolver uma
lista quando não houve toque a sério — `detail` 0, que é o que uma activação por
teclado traz —, quando o rectângulo do mapa é degenerado, quando o ponto tocado
cai fora do mapa, ou quando alguma distância não é um número finito. **Sem lista,
fica a regra da caixa vazia**: nunca uma lista errada a fingir-se de certa.

**A regra da fase mantém-se inteira.** Uma ordenação sobre os 308 centróides que
o servidor desenhou não é uma figura: decide QUEM se acende, e nada mais. Não se
escreve, não se arredonda, não aparece. Os botões são os mesmos 308 que o
servidor rendeu, os nomes são os que a Carta escreveu, e o script continua a
trocar `hidden` e mais nada. Os botões acendem-se pela **ordem da Carta**, que é
a ordem em que estão no documento: a distância escolhe o conjunto, não a fila.
Reordenar nós não está na lista do que este script pode fazer.

**Uma entrada na história por toque, e não duas.** O selo é um `[data-modo]` como
os outros e o ouvinte geral também o servia, o que fazia o mesmo toque passar
duas vezes por `vai()` — duas entradas iguais na história, e um «voltar» que à
primeira não fazia nada. O ouvinte geral passa a ignorá-lo; o `aria-pressed` do
selo continua a ser posto por `aplica()`, como sempre foi.

**A cadeia `inicio.movel.proximos` volta ao que era**, nas duas edições, porque o
gesto que ela descreve voltou: «Um toque no mapa devolve os concelhos mais
próximos, para escolher. No telemóvel os pontos não são alvos: a pesquisa é o
caminho.» Não é texto novo — é a cadeia que a 2e escreveu e a 2g aparou, e está
em `CHAVES-EN.md` com as duas metades. Com dois estados, as duas frases são
verdadeiras ao mesmo tempo: os pontos continuam a não ser alvos, e o selo inteiro
continua a ser um.

**Medido** (`node tests/inicio/matriz.mjs`, célula «largura 390 · a lista de
proximidade entra com um toque, e só com um»). A célula calcula a lista do seu
lado, sobre `caop-centroids.mjs`, e compara com o que a página acende — se as
duas baterem certo, a ordenação do cliente é a dos centróides e não a da Carta:

```
sem toque (a porta):        evora
com toque em (450, 521) do campo 600×790:
   a página acende:         alvito · cuba · evora · portel · redondo
                            · reguengos-de-monsaraz · viana-do-alentejo · vidigueira
   a matriz calcula:        alvito · cuba · evora · portel · redondo
                            · reguengos-de-monsaraz · viana-do-alentejo · vidigueira
   8 botões · 0 algarismos · 1 entrada na história
a escrever «bej»:           beja          (o toque desfaz-se)
a limpar a caixa:           evora         (volta a regra da caixa vazia)
Enter no selo, já na vista: evora         (uma tecla não é um sítio)
```

### 2 · ISSUES I20, fechado · o rótulo da referência prende-se à ponta

O rótulo da referência da régua estava centrado no traço da referência, e um
tecto legal **é** o extremo da sua própria escala: centrado no 100%, metade dele
ficava fora da caixa e empurrava a página. Passa a encostar-se à ponta quando lá
calha — que é a mesma ponta onde a escala já não se escreve, precisamente porque
o rótulo a tapava. Os dois limites são os que já existiam (18 e 82), e nenhuma
palavra mudou: «limite legal» e «UE-27 = 100» são as que eram.

**E o defeito tinha seis instâncias, não uma.** A varredura da 2g apanhou-o em
`evora-leitura` porque é o estado que ela varria; os cinco «UE-27 = 100» das
regiões estão no mesmo 100% e transbordavam pelo mesmo motivo, num estado que a
lista dos seis não continha. Medido antes e depois, com o estado da região
acrescentado:

```
node …/varrer.mjs dist-2h-antes dist-2h        (seis estados × quatro larguras)
dist-2h-antes  evora-leitura  320:10 regua-ref-rotulo «limite legal» | 390:10 … | 768:0 | 1280:0
dist-2h        evora-leitura  320:0  | 390:0  | 768:0 | 1280:0
   antes 22 de 24 a zero · depois 24 de 24 a zero

o estado que a lista dos seis não tinha:
dist-2h-antes  regiao-alentejo-leitura  320:15 SPAN «UE-27 = 100» | 390:15 … | 768:0 | 1280:0
dist-2h        regiao-alentejo-leitura  320:0  | 390:0  | 768:0 | 1280:0
```

A varredura **mudou de sítio**: era um guião do rascunho, e passou a ser uma
célula da matriz («ISSUES I20 · seis estados × quatro larguras sem transbordo, e
o rótulo dentro da régua»), com `regiao-alentejo-leitura` no lugar do
`regiao-alentejo` fechado. Um defeito que só uma ferramenta de fora vê volta na
subetapa seguinte. A célula mede duas coisas: o transbordo da página, e se o
rótulo cabe na caixa da própria régua — porque uma régua dentro de um contentor
que rolasse esconderia o mesmo defeito em vez de o fechar. **24 de 24 a zero, e 0
rótulos fora da régua.**

### 3 · ISSUES I21, fechado · a dica que descrevia o que a página não faz

«Toque num ponto para escolher o concelho.» rendia-se sempre que o âmbito era
Município, inclusive a 390, onde nenhum ponto é alvo: a Emenda 3 diz que o selo
inteiro é o alvo e a folha põe `pointer-events: none` em todos os `.mun-alvo`
abaixo de 640. Passa a seguir a regra das outras duas dicas, que o ponto 2 da 2g
fechou: entra `hidden` do servidor (o caso sem script), o script acende-a no
âmbito Município, e a folha volta a apagá-la abaixo de 640 e na postura de
localizador. Nenhuma palavra mudou.

**Medido** (`node tests/inicio/matriz.mjs`, célula «ISSUES I21»):

```
1280 no âmbito Município  visível      (o mapa escolhe pontos, e a dica é verdade)
 390 no âmbito Município  não visível
1280 no âmbito País       não visível
sem script, 1280 e 390    não visível
```

---

## 2h · as réguas

### A matriz de aceitação

`node tests/inicio/matriz.mjs` — **71 de 71 células passam** (as 68 da 2g, todas
ainda verdes, mais três: a lista de proximidade, I20 e I21). Uma célula da 2g
mudou de guião sem mudar de medida: «largura 390 · vista de escolha, caixa
vazia», na metade do concelho escolhido, deixou de tocar no selo — em
`?ambito=municipio:beja` a página **já** está na vista, e a 390 o
`[data-modo="municipio"]` à vista é o selo, pelo que tocar-lhe ali passou a ser o
gesto da proximidade e não a porta. O que a célula mede é a lista com que a vista
se apresenta, e essa lê-se sem lhe tocar. As duas continuam a dar
`sem escolha: evora · com Beja escolhida: beja · evora`.

### A régua da invariância

`node scripts/medir-invariancia.mjs <2g> <2h>`, com a construção da 2g guardada
antes da primeira alteração:

```
322 rotas · 320 idênticas em texto · 2 com diferenças
  /      +1 −1
  /en/   +1 −1
```

O bloco que entra e o que sai são o mesmo par nas duas edições — a cadeia
`inicio.movel.proximos` inteira a substituir a metade que a 2g deixou. **Mais
nada mudou de texto em lado nenhum**: as correcções 2 e 3 são forma, e nem uma
palavra se moveu por causa delas. `--chaves` imprime **14 chaves** com o mesmo
valor nas duas edições, o mesmo número da 2f e da 2g, e nenhuma nova.

### As duas réguas antigas

- **Defeitos**: `node scripts/medir-defeitos.mjs --json` dá um ficheiro
  **idêntico, byte a byte**, ao da 2g (`diff` sem saída, código 0). 307 páginas;
  porta de correcções 307/307; primeira página 0 valores sem selo e 0 selos para
  outra linha; frases de moldura 94 distintas · 2 405 ocorrências; cobertura 1
  distinta por estado e por edição nas quatro combinações. **Delta: nenhum.** A
  frase que mudou aparece numa página por edição, e a régua das molduras só conta
  as que aparecem em mais do que uma.
- **Contraste**: `node scripts/medir-contraste.mjs --json` dá um ficheiro
  **idêntico, byte a byte**, ao da 2g e ao da 2f. Nenhum par novo, nenhum literal
  de cor: o rótulo da régua já era `--ink` e continua a ser.

Guardados em `design/especime-v3/medicoes/2026-08-20-etapa-2h-{defeitos,contraste,invariancia}.json`.

### As capturas

`node tests/inicio/capturas.mjs` — **68**, na mesma pasta e com os mesmos nomes:
as 64 refeitas (a `escolha-*` e a `escolha-1280-*` porque a vista mudou de
guião, a `evora-leitura-*` e o resto porque a régua mudou de rótulo), mais
**quatro novas**, `escolha-proxima-390-{pt,en}-{claro,escuro}`, que é a vista de
escolha **depois** do gesto: o único estado desta página que uma captura não
alcançava sem tocar duas vezes. O guião das capturas ganhou, para isso, um campo
de larguras por estado — este só existe a 390, porque só lá o selo é o alvo.

---

## 2h · o que fica por fazer, e porquê

1. **O foco depois do gesto vai para a caixa de pesquisa**, como ia antes. Num
   telemóvel a sério isso levanta o teclado do sistema por cima dos botões que o
   toque acabou de acender, e o foco no primeiro botão da lista seria
   provavelmente melhor. **Não mudei, e não é preciso adivinhar porquê: não
   consigo medir um teclado de sistema num Chromium sem cabeça**, e trocar o foco
   por uma melhoria que não posso medir é escrever uma opinião no código. Fica
   dito, para quem tiver um telefone na mão.
2. **A fila sai pela ordem da Carta**, e não pela distância. Pô-la por distância
   seria reordenar nós, que não está na lista do que o script pode fazer. Se a
   direcção quiser a ordem da distância, é uma decisão de forma com um custo de
   regra, e tem de ser dita.
3. **I19** continua aberto, e continua a ser da fase da voz.

## 2h · quem fez o quê, e quanto custou

**Claude Opus** (construtor B3), num só fio, sem subagentes e sem delegação.
Nenhuma parte desta subetapa correu noutro modelo.

**Contagem de fichas:** a única contagem honesta é a diferença de dois
contadores. No início desta subetapa o contador dizia **14 972 786** por usar; no
commit dizia **14 773 295** — ou seja **≈ 199 mil fichas**, das quais a maior
parte é medição: a matriz inteira duas vezes, a varredura de seis estados por
quatro larguras nas duas construções, e 68 capturas. Não tenho um número exacto
para lá desta diferença, e não o invento.
