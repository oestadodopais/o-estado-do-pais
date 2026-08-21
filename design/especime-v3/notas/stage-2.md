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

---

## 2i · a leitura cruzada

*Construtor B4, **Claude Opus**, sozinho, sem subagentes, 20.08.2026, a partir de
`b7bff35`. Um commit. Nada foi empurrado, nada foi posto no ar, `vercel.json` não
foi tocado, nenhum ficheiro partilhado (`tokens.css`, `site.css`, `Base.astro`,
`Masthead.astro`, `SiteFooter.astro`, `Claim.astro`, `Provenance.astro`,
`Frase.astro`, `PortaDeCorreccoes.astro`) mudou um byte, nem `src/data/metodo.mjs`
nem `src/data/sobre.mjs` foram abertos, nenhum portão novo, nenhum número
inventado. Conferido com `git diff --stat` ficheiro a ficheiro, e com um controlo
positivo (`src/lib/inicio.mjs`, que mudou) a provar que o comando sabe ver uma
diferença. Todos os números abaixo trazem ao lado o comando que os produziu.*

**Os treze ficheiros que mudaram**, todos da lista da BRIEF-etapa-2 §2:
`src/views/HomeView.astro`,
`src/components/inicio/{BandaDaRegiao,MapaRespira,Peca,Regua}.astro`,
`src/components/InstrumentoConvergencia.astro`, `src/styles/inicio.css`,
`public/js/{inicio,convergencia}.js`, `src/lib/inicio.mjs`,
`src/data/regioes.mjs`, `src/i18n/strings.mjs`, `tests/inicio/matriz.mjs`.
`convergencia.js` é o par de execução do instrumento n.º 1, e mudou-lhe **um nome
de variável local** (ponto 4); é a mesma razão pela qual a 2c e a 2g lhe tocaram,
e está escrita no §6.8 desta nota.

**A construção de referência.** O brief oferecia a cópia do `dist` com as cinco
plantas do Codex. **Não a usei**: `HEAD` estava limpo e era o código da 2h, e por
isso construí o ramo como estava ANTES de tocar em nada e guardei o `dist` em
`…/scratchpad/dist-2h`. É uma referência exacta, sem as plantas pelo meio; a
cópia com plantas teria feito `/` e `/en/` diferirem também pelos cinco estragos,
e eu teria de os separar dos meus à mão.

### 1 · Portugal não é uma região

O esquema do plano §13 fecha a lista em cinco (`grande-lisboa`,
`peninsula-de-setubal`, `algarve`, `madeira`, `alentejo`); o brief da etapa 2
mandou seis pastilhas, e a construção deu a Portugal um estado a que chamava
«Portugal · região».

**Onde a lista se parte, e porquê ali.** `regioes.mjs` continua a ter as seis
leituras, porque a régua da convergência publica-as às seis. O que entra é um
campo **declarado**, `referencia: true`, na leitura que é a marca contra a qual as
outras se leem — o mesmo padrão do `lado` dos limiares, e pela mesma razão: não
se infere de um nome nem de uma posição. `src/lib/inicio.mjs` exporta
`REGIOES_DE_AMBITO = REGIOES.filter((r) => !r.referencia)`, e é essa a lista que
faz as fichas da cabeça, os painéis, as pastilhas e as barras da banda. Uma
segunda lista escrita à mão noutro sítio divergiria desta à primeira alteração.

Saíram: a ficha de cabeça `regiao:portugal`, o painel `regiao:portugal`, a
pastilha, e a barra da banda (uma barra da referência a ela própria teria largura
zero). Ficaram: o ponto de Portugal na banda, com o seu rótulo, o seu valor e o
seu selo na legenda, e Portugal inteiro no Instrumento n.º 1.

`inicio.js` não precisou de uma linha: a lista fechada já era **lida do
documento** (`comBloco`, dos blocos de cabeça). Sem bloco, `regiao:portugal` cai
no defeito como qualquer valor desconhecido — que é exactamente o que a 2d
prometeu e o que esta correcção prova.

**Medido** (`node tests/inicio/matriz.mjs`, célula «2i·1»):

```
?ambito=regiao:portugal → pais, endereço «/»
5 cabeças, 5 painéis e 5 pastilhas de região
banda: 6 pontos e 5 barras, Portugal ponto true
instrumento n.º 1 com Portugal true
```

**Uma cadeia mudou por causa disto, e é a única mudança de texto da subetapa.**
`ambito.regioesMeta` dizia «As seis leituras publicadas na régua da
convergência.», por cima de uma fila que passou a ter cinco pastilhas. Ficou «As
regiões publicadas na régua da convergência.» / «The regions published on the
convergence rule.», sem contagem: pôr «cinco» seria escrever à mão um número que
volta a ficar errado na primeira mudança da lista, e a régua continua a publicar
seis leituras. Nas duas edições, em `RELOCACOES.md` e em `CHAVES-EN.md`. **É
chamada editorial, e vai assinalada em vez de decidida.**

### 2 · os sete «provisório» na edição inglesa

**Antes** (o comando do brief):

```
grep -o 'claim-provisorio">[^<]*' dist/en/index.html | sort | uniq -c
     12 claim-provisorio">provisional
      7 claim-provisorio">provisório
grep -o 'claim-provisorio">[^<]*' dist/index.html | sort | uniq -c
     19 claim-provisorio">provisório
```

**Os sete lugares, e são dois ficheiros e não sete.** A palavra vem de
`Claim.astro`, que lê `source_flag` da linha; a língua vem da propriedade `lang`,
que tem **`'pt'` por defeito**. Duas chamadas não a passavam:

- `Peca.astro`, o valor grande da peça — **seis** ocorrências, uma por painel
  regional (as seis linhas `pib-pc-*-2024` são as seis que o Eurostat marca com
  `p`);
- `InstrumentoConvergencia.astro`, o valor do relance (`.glance-num`) — **uma**.

Seis mais uma são os sete. As outras três chamadas do instrumento são
`as="text"` e `as="tspan"`, e `Claim.astro` já não escreve a palavra dentro de um
`<svg>` (ISSUES I22).

**Depois:**

```
grep -o 'claim-provisorio">[^<]*' dist/en/index.html | sort | uniq -c
     18 claim-provisorio">provisional
grep -o 'claim-provisorio">[^<]*' dist/index.html | sort | uniq -c
     18 claim-provisorio">provisório
```

**Zero «provisório» na edição inglesa, e as duas edições com a mesma contagem.**
São 18 e não 19 porque o painel de Portugal saiu com a correcção 1, e com ele uma
rendição de `pib-pc-portugal-2024`. A matriz ganhou a célula «2i·2», que conta
todas — inclusive as dos blocos escondidos, porque um estado que o leitor pode
acender é um estado que tem de estar certo: `pt {"provisório":18} · en
{"provisional":18}`.

**O pedido ao dono de `Claim.astro` está escrito no §5 desta nota e em ISSUES
I24**: `lang` devia falhar a construção quando falta, em vez de escolher
português. Corrigi os sete lugares; a armadilha fica de pé para as etapas 3 e 4,
que têm dezenas de chamadas a fazer, e um defeito que se apanha por grep na
edição inglesa é um defeito que o portão devia apanhar por construção.

### 3 · o mapa

**(a) Os 308 pontos são do mesmo tamanho.** Évora tinha 13 unidades e os outros
307 tinham 9; a Emenda 3 diz que a única distinção permitida é a cobertura ■/□. O
lado passou a ser um só (`const LADO = 9`), e a cobertura é o enchimento e mais
nada. O **piso** da área de toque ficou onde estava (6,5 unidades): é o alvo que
ele governa, e não o ponto, e baixá-lo com o tamanho de Évora encolheria 308
alvos por causa de um desenho.

```
node tests/inicio/matriz.mjs   (célula «2i·3a»)
   308 pontos · 1 tamanho(s): 9×9 · 1 com página
```

**(b) O concelho escolhido é um anel, e nunca um enchimento.** Enchia-se a tinta,
que é exactamente o desenho de «tem página»: escolher Beja fazia Beja parecer
coberta. Passa a ser o mesmo contorno de tinta, mais grosso (`stroke-width: 3`
contra 1,2), com o enchimento intacto.

A célula «2i·3b» não converte cores — compara o enchimento do ponto escolhido com
o de outro ponto sem página do mesmo documento, que é o papel por definição, e com
o de Évora, que é a tinta:

```
Beja · 1280 · relance:              enchimento rgb(246,247,244) = papel · ≠ tinta rgb(23,25,27) · anel 3 contra 1,2
Beja · 1280 · leitura (localizador): idem
Beja · 390:                          idem
Évora escolhida:                     enchimento rgb(23,25,27) = tinta   (tem página, e continua cheia)
```

E a geometria não muda com a escolha, o que é a leitura mais dura da Emenda 3:
medido em Chromium sem cabeça, o ponto escolhido, o ponto com página e um ponto
qualquer pintam a **mesma caixa** — `4,21×4,21px` a 1280 (mapa de 281px) e
`1,26×1,26px` a 390 (mapa de 84px). O que muda no escolhido é a tinta do contorno.

**(c) A frase de neutralidade acompanha o mapa em todas as posturas.** Vivia na
ficha, e na postura de localizador a ficha esconde-se: ficavam um ponto cheio e um
ponto vazio a dizer uma coisa, sem a frase que diz o que essa coisa não é. Entrou
no cartão, a `--muted` (que é `--g1`), a mesma cadeia palavra por palavra, contada
como a mesma relocação R3.

```
node tests/inicio/matriz.mjs   (célula «2i·3c»)
País · inteiro (inteiro):            1 visível, dentro do mapa true
escolha · inteiro (inteiro):         1 visível, dentro do mapa true
Évora · localizador (localizador):   1 visível, dentro do mapa true
Évora · localizador · 390:           1 visível, dentro do mapa true
País · 390 (inteiro):                1 visível, dentro do mapa true
```

Uma em cada postura, e nunca duas: na postura inteira o texto do cartão está
`display: none`, na de localizador a ficha está escondida.

**(d) Abaixo de 640 nenhum ponto é activável, por nenhum meio.** A folha já punha
`pointer-events: none !important` nos 308 alvos, e isso trava o rato e o dedo; o
teclado não estava a ouvir, e o Enter e o espaço sobre o mapa escolhiam um
concelho a 390, onde nenhum outro gesto o consegue.

**A pergunta faz-se à folha, e não a uma largura escrita no script.** O 640 vive
numa `@media`, e uma segunda cópia dele em `inicio.js` divergiria da primeira no
dia em que a folha mudasse — é a mesma razão pela qual as listas fechadas são
lidas do documento. `pontoEAlvo()` lê o `pointer-events` calculado de um alvo, o
que já inclui o âmbito, porque é o âmbito que os acende. Sem folha carregada o
valor é `auto` e a página fica como estava: falha do lado seguro.

A leitura fica. As setas continuam a percorrer o mapa e a dizer o nome do concelho
na região viva, porque isso é leitura e não escolha.

```
node tests/inicio/matriz.mjs   (célula «2i·3d»)
390:  alvos «none», seta lê «Redondo», Enter → municipio:beja, espaço → municipio:beja
1280: alvos «all», Enter → municipio:redondo
```

A segunda linha é o controlo positivo: na secretária a mesma tecla escolhe, o que
prova que a guarda é da largura e não um desligar geral.

### 4 · o vestígio das três densidades

O comentário `<!-- CAMADA 3 — FUNDO -->` saiu e a classe `deep` do `<details>`
passou a `aparelho`, que é o que a dobra é: «Método, ressalvas e proveniência», o
mesmo rótulo que o mapa leva por baixo. **Nenhuma palavra do que se lê mudou.**

**As regras da folha tiveram de mudar de casa, e isso é uma decisão e não um
acidente.** `.deep` é estilizada em `site.css`, que é do construtor A, e continua
a governar as dobras de `EstudoView` e de `MunicipioView`, que são das etapas 3 e
4. As **seis** regras que dependem de `.deep` (`.deep`, `.deep > summary`, o
marcador do WebKit, o `::before`, o `[open] > summary::before` e o `:hover`)
foram **copiadas para `src/styles/inicio.css` como `.aparelho`, sem mudar um valor
nem uma ficha** — e `inicio.css` só é importada por `HomeView.astro`, que é a
única vista onde este instrumento vive (conferido: `grep -rn
"InstrumentoConvergencia" src/` dá o import da vista, a chamada, e dois
comentários). As classes de DENTRO (`deep-body`, `deep-item`, `deep-k`,
`deep-v`) ficam como estão: as regras que as governam não dependem de `.deep`,
são as mesmas nas três vistas, e forká-las aqui daria três nomes a uma coisa só.

De caminho, e pela mesma razão, a camada do mapa deixou de se chamar
`mapa-fundo` e passou a `mapa-aparelho` (folha, gabarito e a célula da matriz que
a mede), e a variável local `var fundo` de `convergencia.js` — que é a chapa de
papel por baixo de um rótulo, e não uma densidade — passou a `var chapa`.

**O critério de saída do brief**, com um positivo conhecido a provar que o comando
sabe encontrar:

```
grep -rn "FUNDO\|Fundo\|fundo" src/components/InstrumentoConvergencia.astro \
  src/components/inicio src/views/HomeView.astro public/js/inicio.js \
  public/js/convergencia.js src/styles/inicio.css
   (sem saída · exit=1)

o mesmo comando com src/styles/site.css no fim:
  src/styles/site.css:336:   A marca da página actual passa de um fio no fundo da caixa …
  src/styles/site.css:554:   nada de fundo, nada de moldura …
  src/styles/site.css:720:   para fora da célula, onde o fundo da célula seguinte os tapa …
   (exit=0)
```

**O que NÃO saiu, e porquê**: os comentários `<!-- CAMADA 1 — RELANCE -->` e
`<!-- CAMADA 2 — LEITURA BREVE -->` nomeiam as duas densidades que existem, e
`?densidade=fundo` continua a ser um dos cinco valores inválidos da matriz —
é a célula que prova que «fundo» não é uma densidade, e tirá-la seria deixar de o
provar.

### 5 · nomes acessíveis e o espaço

**As réguas.** Onze `svg.regua-svg` levavam `role="img"` e nome nenhum — nem
`aria-label`, nem `aria-labelledby`, nem `<title>`. A propriedade `rotuloId` que
prometia esse nome **nunca era passada por ninguém**, e saiu com o papel que a
acompanhava. Das duas saídas que o brief dá, esta é a certa aqui:
`aria-hidden="true"`. Tudo o que a régua desenha já está escrito ao lado dela em
palavras validadas — o valor com o seu selo, o rótulo da referência, as pontas da
escala e a palavra do estado —, e não há conteúdo focável lá dentro.

**São dez e não onze**, porque o painel de Portugal saiu na correcção 1 e levou a
sua régua. A regra aplica-se a todas as que existem:

```
node tests/inicio/matriz.mjs   (célula «2i·5», réguas)
   10 réguas · 10 com aria-hidden · 0 com role="img" sem nome · 0 com conteúdo focável dentro
```

**O espaço.** Os comandos de âmbito e de densidade são `<a href>` promovidos a
`role="button"`, e um `role="button"` promete Enter **e** espaço. `activaComEspaco()`
dá-lhes a tecla, com `preventDefault` — sem ele o espaço rola a página por baixo
do comando que acabou de ser premido — e chama `click()`, que é o mesmo caminho do
rato, com o mesmo `vai()` e a mesma devolução do foco. Um `click()` sintético traz
`detail` 0, que é o que as guardas da lista de proximidade já sabem recusar.

```
node tests/inicio/matriz.mjs   (célula «2i·5», espaço)
   espaço na densidade → leitura (rolagem 0) · espaço no âmbito → modo regiao
   com role="button": âmbito 6/6, densidade 2/2
```

**Encontrado e deixado (ISSUES I25):** as pastilhas das regiões recebem
`aria-pressed` do script mas não são promovidas a `role="button"`, e `aria-pressed`
num `<a>` sem papel de botão não é ARIA válido. As da pesquisa são `<button>` e
estão certas. São duas linhas, mas a instrução desta ronda é fazer as sete e nada
mais.

### 6 · o script depois de `</html>`

`<script src="/js/inicio.js" defer is:inline>` estava depois de `</Base>`, e um
`is:inline` não se move: a página construída fechava o documento e continuava. O
lugar é o mesmo que `convergencia.js` já usava — dentro da ranhura de
`Base.astro`, no fim do que a vista escreve.

```
tail -c 120 dist/index.html
…<a href="/en" hreflang="en">English</a></nav></footer></div></body></html>

tail -c 120 dist/en/index.html
…<a href="/" hreflang="pt-PT">Português</a></nav></footer></div></body></html>
```

As duas edições acabam em `</html>`.

### 7 · o registo

**R3 · a contagem «1 → 1» não era verdade, e a verdade tem três partes.**

| o quê | onde | por edição |
| --- | --- | --- |
| a CITAÇÃO da CAOP (`data-verbatim="caop-fonte"`) | a camada do aparelho por baixo do mapa **e** o estado vazio de um concelho sem página | **2** |
| a LINHA DE FONTE COMPACTA (`source` · `document.title` · `reference_date`, com selo) | a ficha do mapa | **1** |
| a FRASE DE NEUTRALIDADE | a ficha **e**, desde esta subetapa, o cartão localizador | **2** |

```
grep -o 'data-verbatim="caop-fonte"' dist/index.html | wc -l      → 2   (o mesmo em dist/en/)
grep -o 'mapa-fonte-curta' dist/index.html | wc -l                → 1
grep -o 'O ponto aceso marca cobertura editorial' dist/index.html | wc -l → 2
```

A segunda citação é o estado vazio, que veio da mesma rota e do mesmo âmbito e é
a mesma relocação; a linha compacta **não é a citação** (são campos da linha, não
o bloco transcrito); a segunda neutralidade é desta subetapa e está justificada em
(3c). `RELOCACOES.md` diz agora as três, com os comandos.

**R4 · eram três ocorrências por região, e passaram a duas.** A frase de cada
região era a manchete do âmbito, o texto da peça do painel regional, **e** a frase
do instrumento n.º 1. **Tirei a da peça**, que é a escolha de forma que o brief me
dá: a manchete é o sítio onde a frase se lê, e a peça repetia-a imediatamente por
baixo, no mesmo ecrã, com o mesmo valor e o mesmo selo. A peça fica com o valor, a
sua régua e o seu selo; nada de proveniência se perde, porque a manchete carrega
os selos da frase e o pé da peça carrega o da sua linha.

```
grep -o 'O Alentejo está' dist/index.html | wc -l   → 2   (era 3)
grep -o 'Portugal está' dist/index.html | wc -l     → 1   (era 3: Portugal perdeu o âmbito)
```

E as duas linhas que faltavam à lista de R4, ambas rendidas pelo instrumento:
`distancia-alentejo-ue27-2000` (2 por edição: a manchete do Alentejo e a frase do
instrumento) e `pib-pc-alentejo-2000` (1, na proveniência por estudo do aparelho).

```
grep -o 'data-claim="distancia-alentejo-ue27-2000"' dist/index.html | wc -l → 2
grep -o 'data-claim="pib-pc-alentejo-2000"' dist/index.html | wc -l        → 1
```

**Nada mais mudou no registo**, como o brief manda.

---

## 2i · as réguas

### A matriz de aceitação

`node tests/inicio/matriz.mjs --json design/especime-v3/medicoes/2026-08-20-etapa-2i-matriz.json`
— **79 de 79 células passam** (as 71 da 2h, todas ainda verdes, mais oito novas):

```
passa  2i·1 · Portugal não é uma região: sem estado, e na régua como referência
passa  2i·2 · a palavra do provisório segue a edição, nas duas
passa  2i·3a · os 308 pontos do mapa têm o mesmo tamanho (Emenda 3)
passa  2i·3b · o ponto escolhido é um anel de tinta, e nunca um enchimento
passa  2i·3c · a frase de neutralidade acompanha o mapa em todas as posturas
passa  2i·3d · abaixo de 640 nenhum ponto é activável, e a leitura fica
passa  2i·5 · o espaço activa os comandos de âmbito e de densidade
passa  2i·5 · nenhuma régua com papel de imagem e sem nome acessível
```

Uma célula da 2h mudou de número sem mudar de medida: «o selo de cada peça é alvo
de 44×44» passou de **31 de 31** para **22 de 22** selos de peça, porque as cinco
peças regionais deixaram de levar a frase da região e os selos que ela trazia. O
mínimo continua `100×44`, 0 aninhados, 0 pares sobrepostos, e o selo continua a
ser o maior alvo da peça (7 040px² contra 2 415px²).

**Uma célula minha falhou à primeira, e o defeito era da célula.** A verificação
do papel de botão perguntava por `document.querySelectorAll('[data-modo]')`, e a
própria raiz `[data-inicio]` leva `data-modo` e `data-densidade` como ESTADO — não
é um comando e não tem papel. A célula passou a perguntar pelos descendentes da
raiz, que é o alcance com que o script os apanha, e a imprimir a fracção
(`6/6`, `2/2`) em vez de um booleano.

### A régua da invariância

`node scripts/medir-invariancia.mjs …/dist-2h dist` — a construção da 2h feita do
ramo limpo antes de eu tocar em nada:

```
322 rotas · 320 idênticas em texto · 2 com diferenças
  /      +2 −47
  /en/   +8 −53
```

**Nenhuma outra rota mudou um bloco de texto.** A conta por bloco (guião de
rascunho, com a mesma normalização da régua) dá, em `/`: **2 blocos entram, 67
ocorrências saem em 43 blocos distintos**, e cada um tem dono:

| o que entra | de que correcção |
| --- | --- |
| «O ponto aceso marca cobertura editorial…» (a segunda) | 3c, a frase no cartão |
| «As regiões publicadas na régua da convergência.» | 1, a cadeia aparada |

| o que sai | de que correcção |
| --- | --- |
| «Portugal · região», «Portugal está», «18», «pontos abaixo…», «sem limiar», «PIB per capita em paridades…», «.», «82», «provisório», «Índice · UE-27 = 100», «2024», «abrir», «fechar», «o recibo completo está na linha», «UE-27 = 100», «0» | 1, a ficha e o painel de Portugal |
| as cinco frases regionais e as suas distâncias («A Grande Lisboa está», «29», «45», «74», «11», «12», «23», «22», «2000», «estava a», «: a distância aumentou.») | 7 (R4), a duplicação que saiu da peça |
| 10 × «fonte» e 10 × «Linha do livro-razão: …» | os selos que iam com as duas coisas acima |
| «As seis leituras publicadas na régua da convergência.» | 1, a cadeia aparada |

Na edição inglesa a lista é a mesma mais uma linha, e é a correcção 2: **entram 6
«provisional» e saem 7 «provisório»** — 12 mais 6 são os 18 de agora, e os 7 vão a
zero.

`node scripts/medir-invariancia.mjs --chaves` imprime **14 chaves** com o mesmo
valor nas duas edições, o mesmo número da 2f, da 2g e da 2h, e nenhuma nova: a
única cadeia que esta subetapa tocou tem inglês próprio.

### As duas réguas antigas

- **Defeitos**: `node scripts/medir-defeitos.mjs --json` dá um ficheiro
  **idêntico, byte a byte**, ao da 2h (`diff` sem saída, código 0; os dois
  ficheiros têm 15 577 bytes, e um controlo positivo contra o de contraste prova
  que o `diff` sabe ver uma diferença). 307 páginas; porta de correcções 307/307;
  primeira página 0 valores sem selo e 0 selos para outra linha; frases de moldura
  94 distintas · 2 405 ocorrências; cobertura 1 distinta por estado e por edição
  nas quatro combinações. **Delta: nenhum**, e é o esperado — a régua só conta uma
  frase quando ela aparece em mais do que uma PÁGINA, e esta subetapa tirou
  repetições dentro da mesma página e acrescentou outra dentro da mesma página.
- **Contraste**: `node scripts/medir-contraste.mjs --json` dá um ficheiro
  **idêntico, byte a byte**, ao da 2h, ao da 2g, ao da 2f e ao da 1c. Nenhum par
  novo, nenhum literal de cor: o anel do ponto escolhido é `--ink` sobre `--paper`,
  e a frase do cartão é `--muted`, que é `--g1` — os dois já medidos.

Guardados em
`design/especime-v3/medicoes/2026-08-20-etapa-2i-{matriz,defeitos,contraste,invariancia}.json`.

### As capturas

`node tests/inicio/capturas.mjs` — **as 68 refeitas**, mesmos nomes, mesma pasta,
e `git status` diz que as 68 mudaram. Era o esperado: os pontos do mapa mudaram de
tamanho em todos os estados, as réguas mudaram de marcação, a ficha do mapa mudou
de altura onde a frase de neutralidade entrou no cartão, e o painel regional
perdeu uma frase.

---

## 2i · o que fica por fazer, e porquê

1. **ISSUES I24 · `Claim.astro` assume português.** Os sete lugares estão
   corrigidos; a armadilha é do ficheiro, é do construtor A, e o pedido exacto
   está abaixo.
2. **ISSUES I25 · `aria-pressed` nas pastilhas sem papel de botão.** Encontrado ao
   fazer o achado 16 e deixado: a instrução era fazer as sete.
3. **A cadeia `ambito.regioesMeta`**, aparada em vez de reescrita com um número.
   Chamada editorial, assinalada.
4. **A frase da região saiu da peça** (R4). É chamada de forma, o brief dá-ma, e
   fica documentada em vez de silenciosa: se a direção a quiser de volta, é uma
   propriedade em `HomeView.astro` e uma linha no registo.
5. **I19** continua aberto, e continua a ser da fase da voz.

## 2i · pedidos ao dono da folha (construtor A)

Nenhum destes ficheiros foi tocado por esta subetapa. Os três pedidos das etapas
2c e 2g continuam de pé; entram dois:

6. **`src/components/Claim.astro`, a língua obrigatória (ISSUES I24).** Hoje
   `const { lang = 'pt' } = Astro.props`, e uma chamada sem `lang` rende
   «provisório» na edição inglesa. A alteração pedida: **`lang` sem defeito, e a
   construção a falhar quando falta** — `if (!lang) throw new Error(...)`, com a
   mensagem a nomear o `id` da linha, como as outras mensagens do portão. É a
   diferença entre um defeito que se apanha por `grep` depois de construir e um
   que não chega a existir; e as etapas 3 e 4 têm dezenas de chamadas a fazer.
7. **`src/styles/site.css`, as seis regras `.deep`.** O instrumento n.º 1 deixou de
   as usar (passou a `.aparelho`, em `inicio.css`). Elas **ficam**, porque
   `EstudoView.astro` e `MunicipioView.astro` ainda dependem delas; o pedido é só
   que fiquem escritas como dívida das etapas 3 e 4, ao lado do bloco de
   remapeamento do amarelo, que sai pelo mesmo caminho e pela mesma razão.

## 2i · quem fez o quê, e quanto custou

**Claude Opus** (construtor B4), num só fio, sem subagentes e sem delegação.
Nenhuma parte desta subetapa correu noutro modelo.

**Contagem de fichas:** a única contagem honesta é a diferença de dois contadores.
No início desta subetapa o contador dizia **14 973 277** por usar; no momento em
que esta nota se fecha dizia cerca de **14,68 milhões** — ou seja **≈ 290 mil
fichas**, dentro da escala do brief (150 a 250 mil) mais o que a medição custou:
a matriz inteira três vezes, 68 capturas, duas construções e a conta por bloco da
invariância. Não tenho um número exacto para lá desta diferença, e não o invento.

---

## 2j · a leitura da pré-visualização n.º 1

*Construtor B5, **Claude Opus**, sozinho, sem subagentes, 21.08.2026, a partir de
`3c1c078`. Três commits. Nada foi empurrado, nada foi posto no ar, `vercel.json`
não foi tocado, nem `src/data/metodo.mjs` nem `src/data/sobre.mjs` foram abertos,
nenhum portão novo, nenhum número inventado. Esta ronda é a única em que um
construtor tem os ficheiros partilhados E os da primeira página, por decisão da
cadeira, porque mais ninguém está a escrever. Todos os números abaixo trazem ao
lado o comando que os produziu.*

**Os commits**

| Commit | O quê |
| --- | --- |
| `4766aa1` | registo, cabeçalho, tema: as Emendas 10 a 14, a linha de método fora, e o escuro à escolha do leitor |
| `1a658fc` | início, pontos e peças: o mapa em pontos, a fila fora da cabeça, as peças sem caixas e as oito medidas de um concelho sem página |
| *(o commit que contém esta nota)* | design/especime-v3: o registo da leitura da pré-visualização n.º 1 |

**A construção de referência.** `git worktree add --detach <dir> 0a8274b`, com
`node_modules` ligado por symlink, e `npm run build` verde. É o estado exacto da
pré-visualização que a direção leu. Fica dito, porque muda a leitura das réguas:
`git diff --stat 0a8274b HEAD` no início desta ronda dava **dois ficheiros, os
dois de `design/`** (o plano e o brief da 2j), e por isso a construção de
`0a8274b` e a de `3c1c078` são a mesma — a referência é exacta e não aproximada.

---

## 2j-1 · o registo, o cabeçalho e o tema

### O registo

`direcao.md` recebe as **Emendas 10 a 14** verbatim, a seguir à Emenda 9, com o
parágrafo das quatro decisões de forma. `DECISIONS.md` **§1.52**, `Afecta:
nenhum`.

```
npm run ledger:check
  amarra das decisões · 15 entrada(s) a partir da §1.38 · 2 texto(s) governado(s)
  · 1 citação(ões) da constituição conferida(s), de 42 entre «…»
  ✓ cada texto no ar tem uma decisão registada que o governa
```

A entrada diz por extenso duas coisas que não são óbvias:

1. **a §1.9 («Não há botão de tema») fica DECIDIDA e não revogada.** A própria
   §1.9 acaba em «é meia dúzia de linhas quando o director quiser», e a Emenda 12
   é esse dia. O que mudou não foi a §1.9 estar errada: foi a página, que passou
   a ter estado e a servir um script adiado;
2. **a linha de método é cópia de identidade e não texto governado**, e por isso
   sai sem tocar na amarra. Vivia em `site.config.mjs` — o ficheiro do domínio, do
   nome e da edição —, declarada «elemento de identidade: não é traduzida», e
   nenhuma entrada anterior a governa.

### (a) A linha de método sai

Saiu das duas superfícies onde rendia: por baixo da marca em todas as páginas
(`Masthead.astro`) e no preâmbulo de comentários dos dois CSV descarregáveis
(`src/lib/dados.mjs`). A constante saiu com elas, porque nada mais a lia, e a
regra `.method-line` saiu de `site.css` porque uma regra sem elemento mente sobre
o que a folha desenha.

**`scripts/check-dados.mjs` foi lido antes de a linha sair**, como o brief manda,
e o que ele compara é isto: o cabeçalho de **colunas** de cada CSV
(`municipio,distrito,regiao,x,y` e `regiao,valor,ano,unidade,estudo,afirmacao`), e
nos **comentários** três coisas — a citação da CAOP, a data de acesso, e o caminho
`ledger/claims/`. Nenhuma das três é a linha de método. **O cabeçalho e a
conferência não tinham de se mover juntos**, e o `check:dados` passou sem uma
alteração.

```
grep -rn "Cada número tem fonte" src scripts site.config.mjs
   (sem saída · exit=1)
   controlo positivo, o mesmo grep em design/especime-v3/direcao.md:
   design/especime-v3/direcao.md   (exit=0)

grep -r "Cada número tem fonte" dist/ | wc -l        → 0
   controlo positivo: grep -rl "O Estado do País" dist/index.html | wc -l → 1
```

### (b) O tema

**Claro por defeito para todos.** O bloco de consulta da preferência do sistema
saiu de `tokens.css`; a paleta escura vive só em `:root[data-theme='dark']`.

```
grep -c "prefers-color-scheme" src/styles/tokens.css        → 0
   controlo positivo: o mesmo grep em DECISIONS.md          → 3
   e no CSS construído: grep -rc … dist/_astro/*.css        → 0
```

*(O controlo positivo era, à primeira corrida, o próprio `medir-contraste.mjs`,
que trazia duas ocorrências no `ESTADOS`; deixou de servir quando esta mesma ronda
lhe reescreveu o bloco. Fica o `DECISIONS.md`, que guarda a decisão antiga e por
isso continua a ter a cadeia.)*

`color-scheme` deixou de dizer `light dark` e passa a seguir o mesmo atributo:
sem isso, um leitor com o sistema em escuro ficava com a página clara e as barras
de deslocamento escuras, sem ter escolhido nada.

**O controlo** são dois botões «claro · escuro» na mobília do cabeçalho, com
`aria-pressed` e um nome de grupo que só se ouve (`tema.rotulo`). Dois botões e
não um interruptor: um interruptor com uma etiqueta só obriga quem o ouve a
adivinhar o que é o não-premido. Entra `hidden` do servidor e é
`public/js/tema.js` que o acende — a mesma regra que a primeira página aplica às
dicas do mapa desde ISSUES I21, e a razão é a mesma: um comando que não comanda
nada é uma promessa falhada.

**A guarda contra o pisca** é uma linha inline no `<head>` do `Base.astro`, e é a
única coisa em todo o sítio que escreve `data-theme`: compara a chave com UMA
cadeia e, se não bater certo, não faz nada. Um ficheiro adiado corre depois de a
página pintar, e quem pediu escuro veria a página clara primeiro.

**Medido em Chromium sem cabeça, nas duas edições** (guião de rascunho; as mesmas
medidas entraram na matriz como três células):

| caso | `data-theme` | papel | guardado |
| --- | --- | --- | --- |
| sistema em escuro, sem escolha | *(nenhum)* | `rgb(246,247,244)` | *(nada)* |
| carregou «escuro» | `dark` | `rgb(21,23,26)` | `dark` |
| recarregou | `dark` | `rgb(21,23,26)` | `dark` |
| foi a `/metodo` (`/en/method`) | `dark` | `rgb(21,23,26)` | `dark` |
| carregou «claro» | *(nenhum)* | `rgb(246,247,244)` | `light` |
| sem JavaScript, sistema em escuro | *(nenhum)* | claro | *(nada)*, e o controlo fica `hidden` |

As seis linhas dão o mesmo nas duas edições, e o `aria-pressed` acompanha
(`light:true dark:false` → `light:false dark:true` → e de volta).

**A régua do contraste aprendeu que há duas paletas e não três.** O `ESTADOS`
esperava o bloco da preferência do sistema e teria impresso «n/d» em vinte e uma
linhas sem dizer porquê. Passa a medir `:root` e `:root[data-theme='dark']`, e a
conferência «os dois escuros são iguais ficha a ficha» saiu com o segundo bloco —
não há dois para comparar. O que ficou no lugar dela é a pergunta que ainda faz
sentido: se a paleta escura existe para ser medida.

```
node scripts/medir-contraste.mjs
  claro (:root) ................. 0 falhas de texto
  escuro, à escolha do leitor ... 0 falhas de texto
  src/styles/tokens.css: uma paleta escura, à escolha do leitor, com 22 fichas.
  src/styles/tokens.css: 0 falhas de texto · 4 objeto(s) de interface abaixo de 3:1
```

Os quatro avisos são os quatro de sempre, e são dois pares simétricos: o contorno
que não faz falta ao âmbar em claro e o cobalto que só se lê pelo contorno, e o
mesmo par ao contrário em escuro. **Comparado par a par com a medição da 2i: zero
diferenças nas duas paletas.** O ficheiro JSON não é byte a byte igual, e a razão
é honesta: a chave do estado passou de `escuro-sistema` a `escuro`, porque o bloco
mudou de sítio.

### (c) As duas leituras do cabeçalho, e a moldura que não era delas

A direção pediu «as duas leituras do cabeçalho sem molduras». As regras da mobília
nunca desenharam moldura nenhuma — e é por isso que a causa vale a pena
escrever-se. A classe chamava-se `.leitura`, e mais abaixo na mesma folha há
**outra `.leitura`**, a camada «Leitura breve» de um estudo (`EstudoView.astro`),
com `border: 1px solid var(--rule)` e fundo de papel. Duas coisas diferentes com
um nome só, e a segunda ganhava por vir depois.

**Medido antes**, com `getComputedStyle` sobre os dois `span` da mobília:
`border-top-style: solid`, `1px`, `rgb(217, 221, 216)`, fundo `rgb(246,247,244)`.
**Depois**: `none`, `0px`, fundo `rgba(0,0,0,0)`.

A saída não foi apagar a moldura com uma terceira regra: foi dar-lhes o nome que é
delas. A mobília passa a `.mob-leitura`. Um `border: 0` por cima deixava as duas a
partilhar o nome, e a regra seguinte de uma delas voltava a cair na outra.

**O cabeçalho às cinco larguras, com o controlo novo** (Chromium sem cabeça,
depois de `document.fonts.ready`; a coluna «mobília» é a altura da linha do sinal
de tempo):

| rota | largura | cabeçalho | mobília | transbordo | linha de método | controlo |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 320 | 283,7px | 106,4px | 0 | não | à vista |
| `/` | 390 | 258,5px | 81,2px | 0 | não | à vista |
| `/` | 768 | 296,8px | 56px | 0 | não | à vista |
| `/` | 1024 | 292,4px | 56px | 0 | não | à vista |
| `/` | 1280 | 299,1px | 56px | 0 | não | à vista |
| `/livro-razao/divida-publica-2025` | 320 | 213,1px | 74,2px | 0 | não | à vista |
| `/livro-razao/divida-publica-2025` | 390 | 213,1px | 74,2px | 0 | não | à vista |
| `/livro-razao/divida-publica-2025` | 768 | 227px | 53px | 0 | não | à vista |
| `/livro-razao/divida-publica-2025` | 1024 | 208,3px | 53px | 0 | não | à vista |
| `/livro-razao/divida-publica-2025` | 1280 | 208,8px | 53px | 0 | não | à vista |

**O alvo do controlo: «claro» 49,7 × 44 px e «escuro» 62,5 × 44 px** na primeira
página; 44 × 44 e 53,7 × 44 na página de linha, onde o cabeçalho é compacto e a
letra é menor. **Os dois passam os 44 × 44 nas duas rotas e nas cinco larguras.**
Aqui a altura pode ser altura a sério, ao contrário do selo: um botão de barra é
um bloco, e crescer não empurra linha nenhuma — é a mesma distinção que a etapa 1e
escreveu para o comando «Menu».

**As 32 capturas da etapa 1 foram refeitas, e não as 16 que o brief nomeia.** O
brief pede `inicio-*` e `linha-*`; a mobília é de todas as páginas, e uma pasta
onde o mesmo cabeçalho tem a linha de método numa página e não a tem noutra não é
registo de nada. É o mesmo desvio, com a mesma razão, que a subetapa 1f escreveu.
`git status` diz que **as 32 mudaram**. O escuro entra pelo caminho real: a
escolha guardada no aparelho, e a guarda do `<head>` a aplicá-la.

### (d) ISSUES I24, fechado · a língua deixa de ter defeito

`Claim.astro` tinha `const { lang = 'pt' } = Astro.props`, e uma chamada sem
língua rendia «provisório» na edição inglesa. Passa a atirar, com o `id` da linha
na mensagem, como as mensagens do portão.

**Oito chamadas não passavam a língua, e a construção apanhou-as uma a uma.** Não
foi um `grep`: **duas delas nenhum `grep` deste repositório encontrava**, porque a
linha continha `lang === 'pt'` noutro sítio e qualquer varredura por «linhas com
`<Claim` e sem `lang`» as excluía. É exatamente o argumento que a entrada I24
fazia — «um defeito que se apanha por `grep` na edição inglesa é um defeito que o
portão devia apanhar por construção» —, e a diferença mediu-se aqui.

| ficheiro | chamadas |
| --- | --- |
| `src/components/inicio/BandaDaRegiao.astro` | 1 |
| `src/components/InstrumentoConvergencia.astro` | 2 *(uma delas invisível ao `grep`)* |
| `src/views/EstudoView.astro` | 1 |
| `src/views/MunicipioView.astro` | 4 |

**Cinco das oito estão em vistas que não são desta ronda**, e isso fica dito em
vez de escondido: `EstudoView.astro` e `MunicipioView.astro` são das etapas 4 e 3,
e a lista de ficheiros desta ronda não as inclui. O brief da 2j manda, na alínea
(d), «correr a construção para provar que todas as chamadas a passam, e se alguma
não passar, corrigir a chamada e dizer qual» — é o que está feito. A alteração é
`lang={lang}` e mais nada: nenhum outro byte dessas vistas mudou, e a rendição
portuguesa é idêntica. **Se a cadeira preferir o contrário, são cinco atributos a
tirar e o I24 volta a abrir.**

```
grep -o 'claim-provisorio">[^<]*' dist/en/index.html | sort | uniq -c
     18 claim-provisorio">provisional
grep -o 'claim-provisorio">[^<]*' dist/index.html | sort | uniq -c
     18 claim-provisorio">provisório
```

Sem mudança contra a 2i, e é o esperado: os sete lugares já estavam corrigidos. O
que mudou foi a armadilha.

### (e) ISSUES I25, fechado

As pastilhas das regiões passam a `role="button"` no mesmo laço onde os segmentos
de âmbito e de densidade o recebem, e ganham a tecla de espaço com o
`activaComEspaco()` que já existia. Duas linhas, como a entrada previa. A célula
«2i·5» da matriz continua verde: `com role="button": âmbito 6/6, densidade 2/2`.

---

## 2j-2 · a primeira página

### (a) Emenda 10 · o mapa leva pontos

Os 308 concelhos passam de `<rect>` a `<circle>`, com um raio só, e **nenhum vem
cheio**. O enchimento era a cobertura; a cobertura continua na página por
palavras, ao lado do mapa, no cartão localizador e na lista da pesquisa. O
concelho escolhido é o anel que a 2i já tinha desenhado, e passa a ser a única
distinção que o mapa faz.

**A classe que pintava a cobertura saiu**, e o que fica é `data-pagina`. O script
lia `mun-com-pagina` para saber se havia página para abrir; sem enchimento, uma
classe que não pinta nada seria um nome a mentir sobre o que a folha desenha.

**Os alvos continuam rectângulos, e não é incoerência de glifo**: um alvo não se
vê, não pinta nada e não diz nada — é uma área, e uma área quadrada cobre a
vizinhança de um ponto melhor do que um círculo do mesmo raio.

```
node tests/inicio/matriz.mjs   (célula «2j·a», os pontos)
   308 <circle> · 1 raio: 4.5 · enchimento none · 1 declarado com página

node tests/inicio/matriz.mjs   (célula «2j·a», o anel)
   Beja · 1280 · relance:  enchimento none (todos none/none) · raio 4.5 = 4.5 · anel 3 contra 1,2
   Beja · 1280 · leitura (localizador): idem
   Beja · 390:  idem
   Évora escolhida: enchimento none, como os outros 307
```

**«A cobertura e as suas legendas de quadrado saem» — e os quadrados da legenda já
não existiam antes desta ronda.** Conferido no `dist`: nem `.ld-on`/`.ld-off` (a
legenda do instrumento n.º 2 da v2) nem um único glifo `■`/`□` literal aparecem na
primeira página; o controlo positivo é o mesmo `grep` a encontrar quatro `■` em
`direcao.md`. A legenda de cobertura passou a ser as duas palavras do vocabulário
`cobertura.*` na subetapa 2a. **O que esta ronda tirou foi o enchimento.**

**A frase de neutralidade.** Nomeava «o ponto aceso», e a partir do momento em que
nenhum ponto vem aceso descrevia um desenho que a página não faz. Cadeia nova nas
duas edições (`inicio.mapa.posicao`), a antiga retirada, as duas listadas em
«Texto novo» e em `CHAVES-EN.md`. Continua em 2 ocorrências por edição — a ficha e
o cartão localizador —, como a 2i a deixou, e a célula «2i·3c» continua a dar 1
visível em cada uma das cinco posturas medidas.

**`InstrumentoMapa.astro` não existe**, e o brief manda aplicar-lhe a mesma regra.
Saiu na subetapa 2b, com `public/js/mapa.js` (`git log --diff-filter=D` →
`0c1ef02`), e nenhuma vista o importa: `grep -rn "InstrumentoMapa\|js/mapa.js"
src/ public/ tests/ scripts/` dá **uma linha**, um comentário em `site.css:1115`.
O mapa da página de concelho, quando a etapa 3 o desenhar, herda a regra de
`MapaRespira.astro`, que é o único mapa do sítio. Fica em ISSUES como **I29**.

### (b) Emenda 13 · a fila de estados sai da cabeça

`FilaDeEstados.astro` foi **retirado do repositório**: era o único sítio que o
usava, e um componente que ninguém rende é um desenho a dizer que ainda vale. Com
ele saiu o campo `estados` dos blocos da cabeça e a chave
`inicio.cabeca.estadoRotulo`, nas duas edições.

**Nenhuma contagem se perdeu**, e é isso que faz disto uma subtração e não um
corte: o rótulo do âmbito traz `painel_total` («Portugal · painel europeu · 8
medidas»), a manchete traz `painel_fora_do_limiar` («4 limiares europeus
ultrapassados.»), e o estado de cada medida continua onde ele é da medida.

```
node tests/inicio/matriz.mjs   (célula «Emenda 13»)
   0 filas · chaves da prova na cabeça: painel_total, painel_fora_do_limiar
   · 8 marcadores e 8 palavras nas peças
```

**`painel_com_limiar` continua sem se render em lado nenhum**, e isso é anterior a
esta ronda: `grep -o 'data-prova="[a-z_]*"' dist/index.html | sort | uniq -c` não
o listava antes nem lista agora. O portão reconta-o na mesma.

### (c) As peças sem caixas, e os algarismos com tecto

Oito molduras cinzentas com 20px de ar liam-se como oito cartões a flutuar.
Passam a células de uma grelha, separadas por um fio de 1px.

**O fio é uma SOMBRA à volta de cada peça, e não um fundo por baixo da grelha**, e
a razão é medida e não de gosto. A `.figuras` da v2 — a grelha que a direção
nomeia como modelo — faz o fio com `gap: 1px` sobre um fundo `--rule`, e isso
funciona enquanto a grelha estiver sempre cheia. A desta página não está: acima de
640 uma peça aberta ocupa duas colunas (subetapa 2g, ponto 3), e uma linha com um
buraco mostraria o fundo cinzento como um rectângulo, que é uma célula a fingir que
existe. Com a sombra, as duas peças vizinhas caem na mesma faixa de 1px e desenham
UM fio; onde não há peça não há sombra, e o buraco fica em papel.

```
node tests/inicio/matriz.mjs   (célula «as peças sem caixas»)
   8 peças · 0 com moldura · intervalo 1px/1px · fio «rgb(217, 221, 216) 0px 0px 0px 1px»
```

**Os algarismos.** Eram três patamares escritos em píxeis — 80, 60, 44 —, e o
maior enchia a célula a 1280. Passam a três `clamp()`, um por classe de
comprimento, escolhida na construção pelo número de glifos do valor publicado,
como sempre foi. Cada `clamp()` é uma recta entre 320 e 1280: 38→56, 32→48, 26→40.
No estreito a peça é uma fila de largura inteira e o corpo deixa de depender do
número de glifos: é a rampa da peça curta, travada nos 44px que ela vale no ponto
de quebra, para que a série de 320 a 1280 não tenha degrau.

```
node tests/inicio/matriz.mjs   (célula «tecto de 56px»)
   320: 38,0px · 390: 39,3px · 768: 46,4px · 1024: 51,2px · 1280: 56,0px
```

### (d) O Instrumento n.º 1 mais pequeno

O valor do relance tinha `clamp(56px, 9vw, 88px)`: **o tecto de uma peça era o
chão dele**. Passa à mesma rampa da peça curta e acaba nos 56px, para que o sítio
tenha uma escala de algarismos e não duas.

A caixa da régua encolhe de 300 para 262 pontos, com o eixo a subir dez (216 →
206). Tudo o que se desenha por baixo do eixo está escrito EM RELAÇÃO a ele e
desce junto, sem mudar uma distância; os patamares ficam como estavam, porque os
30 pontos entre eles são a medição da 2g que separou o nome da região do seu
valor. O SVG desenha-se a 100% da largura do contentor e a altura sai da proporção
da caixa: encolher a caixa encolhe o instrumento em **todas** as larguras, sem um
salto de patamar e sem uma segunda regra de folha.

**Medido nas cinco larguras, na construção de `0a8274b` e nesta:**

| largura | régua, antes | régua, depois | secção, antes | secção, depois | relance, antes | relance, depois |
| --- | --- | --- | --- | --- | --- | --- |
| 320 | 660 × 202px | **660 × 176,4px** | 1 192,5px | **1 148,3px** | 56px | **38px** |
| 390 | 660 × 202px | **660 × 176,4px** | 1 081,3px | **1 038,3px** | 56px | **39,3px** |
| 768 | 704,6 × 215,7px | **704,6 × 188,4px** | 864,7px | **828,2px** | 69,1px | **46,4px** |
| 1024 | 940,1 × 287,8px | **940,1 × 251,3px** | 1 015,8px | **954,8px** | 88px | **51,2px** |
| 1280 | 1 090 × 333,7px | **1 090 × 291,4px** | 1 052px | **986px** | 88px | **56px** |

**13 rótulos e 0 pares de caixas sobrepostas nas cinco larguras.** A célula abre a
porta do telemóvel antes de medir: abaixo de 640 o instrumento está atrás de um
`<details>` (subetapa 2g, ponto 4), e uma medição com a porta fechada diria «0
pares» sem ter olhado para um único rótulo — a primeira versão desta célula fez
exatamente isso, e imprimiu «régua 0×0px · 0 rótulos», que é uma ausência a
fingir-se de resultado.

### (e) Emenda 14 · as oito medidas de um concelho sem página

A caixa de estado vazio encolhe para a frase que explica o estado, de largura
inteira, e por baixo dela entram as **oito medidas de `municipios.mjs` como peças
vazias**: nome, unidade e «sem linha ainda», sem valor, sem selo e sem marcador.
Uma peça vazia não é um `<details>`: não há segunda densidade de uma coisa que não
existe.

**`municipios.mjs` ganha um campo declarado, `unidade`**, e a razão é a mesma do
`lado` de um limiar e do `referencia` de uma região: não se infere. A linha
«unidade · período» que a página de concelho rende traz **dois algarismos** que
numa peça vazia seriam inventados — a data de referência, que é o ano em que
**Évora** foi lida e que para os outros 307 não existe, e, no índice de dívida, o
teto legal. E recortá-los por regra dava linhas truncadas: «Pessoas · dezembro
de», «Percentagem, teto legal =». As palavras do campo novo são as da própria
`medida`, nas duas edições, sem uma palavra nova.

```
node tests/inicio/matriz.mjs   (célula «Emenda 14»)
   pt: 8 peças vazias · 0 com algarismo · 0 selos · 0 marcadores · 8 nomes
       · 8 unidades · «sem linha ainda» · frase por cima true
   en: 8 peças vazias · 0 com algarismo · 0 selos · 0 marcadores · 8 nomes
       · 8 unidades · «no row yet» · frase por cima true
```

**O que saiu da caixa, e para onde foi.** O título («<nome> · sem página ainda»)
repetia a manchete que está três linhas acima e o rótulo de âmbito. A contagem da
CAOP com o seu selo e a citação transcrita continuam na página, na camada de
aparelho por baixo do mapa, que se lê em qualquer âmbito. **A relocação R3 passa
de duas ocorrências da citação por edição a uma**, e o registo di-lo:

```
grep -o 'data-verbatim="caop-fonte"' dist/index.html | wc -l      → 1   (era 2)
grep -o 'data-verbatim="caop-fonte"' dist/en/index.html | wc -l   → 1   (era 2)
grep -o 'mapa-fonte-curta' dist/index.html | wc -l                → 1   (sem mudança)
```

### O transbordo a 1024, que vem de antes e não desta ronda

A largura nova que o brief mandou medir apanhou um defeito que as outras quatro
não viam. A conta é fechada:

```
conteúdo a 1024   = 1024 − 2 × 41 de goteira            = 942px
cabeça 2 colunas  = 582 + 20 + (281 + 18 + ficha)
logo a ficha do mapa fica com                             41,1px
```

e a ficha não desce dos **163,6px** que a linha «Contagem verificada nos
ficheiros» mede. O que transbordava não era o mapa: era a ficha ao lado dele.

**Medido nas duas construções, sete estados × duas edições × cinco larguras:**

```
node …/transbordo.mjs <dist de 0a8274b>   → 8 de 70 combinações transbordam
   pais-relance, pais-leitura, evora-relance e beja-vazio, a 1024, nas duas edições
   82px em português · 90px em inglês · culpados: .compo-k, .compo-row, .compo-n
node …/transbordo.mjs <dist desta ronda>  → 0 de 70
```

A cabeça só fica em duas colunas a partir de **1180**, que é a largura da mancha:
daí para cima a ficha tem 191px. A regra do MAPA fica nos 900, porque entre 900 e
1180 a cabeça é uma coluna e o mapa tem os 942px inteiros para se desenhar ao lado
da sua ficha.

**Isto vem da 2b e não desta ronda**, e está medido nas duas construções para que
não se leia como uma regressão que eu fechei: era um defeito que só uma quinta
largura via, e a leitura da direção mandou-a medir.

---

## 2j · as réguas

### A matriz de aceitação

`node tests/inicio/matriz.mjs --json design/especime-v3/medicoes/2026-08-21-etapa-2j-matriz.json`
— **88 de 88 células passam** (as 79 da 2i, todas ainda verdes, mais nove novas):

```
passa  2j·a · os 308 pontos são círculos iguais e nenhum vem cheio (Emendas 3 e 10)
passa  2j·a · o ponto escolhido é um anel, e nenhum ponto é um enchimento
passa  2j · Emenda 12 · claro por defeito, com o sistema em escuro e sem escolha
passa  2j · Emenda 12 · a escolha do tema persiste, nas duas edições
passa  2j · Emenda 12 · sem JavaScript o controlo do tema não se vê, e a página é clara
passa  2j · Emenda 13 · a fila de estados saiu da cabeça, e as contagens ficaram
passa  2j · as peças sem caixas, separadas por fios de 1px
passa  2j · os algarismos da peça têm tecto de 56px e crescem sem saltos
passa  2j · Emenda 14 · Beja rende as oito medidas como peças vazias
passa  2j · o Instrumento n.º 1 encolheu, e nenhum par de rótulos se cruza
```

*(São dez linhas para nove células novas porque as duas primeiras são as células
«2i·3a» e «2i·3b» reescritas: mesma medida, gramática nova, e por isso mudaram de
nome.)*

**Duas células antigas mudaram de número sem mudar de medida:** a varredura do
transbordo passou de quatro larguras a cinco (`30 de 30 a zero`, era `24 de 24`), e
a varredura simples das larguras ganhou 1024. **Os dois temas continuam medidos**,
agora pelo caminho da Emenda 12: a célula escreve a escolha em `localStorage`
antes de a página correr, que é o estado de quem carregou no botão numa visita
anterior, e deixa a guarda do `<head>` aplicá-la. Pôr `data-theme` à mão mediria a
folha; assim mede-se o mecanismo.

### A régua da invariância

`node scripts/medir-invariancia.mjs <dist de 0a8274b> dist`

```
322 rotas · 15 idênticas em texto · 307 com diferenças
```

E as 307 dividem-se em duas, sem sobra:

| quantas | rotas | diferença |
| --- | --- | --- |
| 305 | todas as outras páginas | **+2 −1**: entram «claro» e «escuro», sai «Portugal, medido. Cada número tem fonte.» |
| 2 | `/` e `/en/` | **+28 −18** |

As 15 idênticas são as páginas de documento de estudo, que são bytes exactos da
origem e não levam a mobília do sítio — o mesmo número da 2f, da 2g, da 2h e da
2i.

**Os 28 que entram e os 18 que saem na primeira página, bloco a bloco** (guião de
rascunho com a mesma normalização da régua, porque a régua guarda os cinco
primeiros de cada lado e eu queria a lista inteira):

| entram | de quê |
| --- | --- |
| 8 × «sem linha ainda» | Emenda 14, as oito peças vazias |
| 8 nomes de medida + 8 unidades (7 cadeias distintas: «Pessoas» duas vezes) | Emenda 14, as mesmas peças |
| 2 × «Os pontos são todos iguais…» | Emenda 10, a frase nova, na ficha e no cartão |
| «claro» · «escuro» | Emenda 12, o controlo |

| saem | de quê |
| --- | --- |
| 7 × «sem limiar», 1 × «fora do limiar», 1 × «dentro do limiar» | Emenda 13, as palavras da fila (País 1+1, cinco regiões 1 cada, Évora 1+1) |
| 2 × «O ponto aceso marca cobertura editorial…» | Emenda 10, a frase antiga |
| «Portugal, medido. Cada número tem fonte.» | Emenda 11 |
| «Águeda», «308», «fonte», «Linha do livro-razão: calculado · …», a citação da CAOP, «sem página ainda» | Emenda 14, o que a caixa de estado vazio levava: o nome no título (o concelho com que a página se constrói é Águeda), a contagem da CAOP com o seu selo e o seu texto oculto, a citação transcrita e a palavra da cobertura |

Na edição inglesa a lista é a mesma, cadeia a cadeia.

`node scripts/medir-invariancia.mjs --chaves` imprime **14 chaves** com o mesmo
valor nas duas edições — o mesmo número da 2f, 2g, 2h e 2i, e **nenhuma nova**: as
quatro cadeias desta ronda têm inglês próprio.

### As duas réguas antigas

**Defeitos.** `node scripts/medir-defeitos.mjs`, sobre a mesma construção que o
portão varre:

| medida | `0a8274b` | 2j |
| --- | --- | --- |
| páginas | 307 | 307 |
| porta de correcções | 307/307 | 307/307 |
| primeira página · valores sem selo | 0 | 0 |
| primeira página · selos para outra linha | 0 | 0 |
| **frases de moldura** | **94 distintas · 2 405** | **93 distintas · 2 099** |
| `[descrição em preparação]` | 0 | 0 |
| linhas com `#page=` | 23 de 132 | 23 de 132 |
| linhas com recorte | 22 de 132 | 22 de 132 |
| localizadores internos | 0 | 0 |
| cobertura · com-pagina | 1 distinta × 6 | 1 distinta × 6 |
| cobertura · sem-pagina | 1 distinta × 308 | 1 distinta × **307** |
| cobertura · **sem-linha** | *(não existia)* | **1 distinta × 8** |

**As frases de moldura desceram, e a descida tem duas parcelas e não uma.**
Comparadas as duas listas inteiras, como multiconjuntos de (texto, contagem):

```
só na referência:  −307  «Portugal, medido. Cada número tem fonte.»
                   −2    «Purchasing power per inhabitant»
só agora:          +3    «Purchasing power per inhabitant»
soma: 2405 → 2099
```

A primeira parcela é a Emenda 11: uma frase distinta, em 307 páginas. A segunda é
a Emenda 14, e explica-se por um limite da própria régua: ela só conta blocos com
**30 caracteres ou mais** (`medir-defeitos.mjs`, linha 114), e das dezasseis
cadeias de nome de medida — oito por edição — **«Purchasing power per inhabitant»
é a única com 30**. As outras quinze passam a render-se duas vezes na primeira
página e a régua não as vê. Fica dito, porque a alternativa era escrever «a régua
desceu 306» e deixar o 1 por explicar.

**A cobertura «sem-pagina» desce de 308 para 307 ocorrências**: a que saiu é o
título da caixa de estado vazio da primeira página, que a Emenda 14 retirou. As
307 restantes são o índice dos concelhos.

**Contraste.** `node scripts/medir-contraste.mjs --json`. **Idêntico par a par
nas duas paletas** contra o da 2i (18 pares distintos, 0 diferenças em claro, 0 em
escuro). O ficheiro não é byte a byte igual porque a chave do estado mudou de
nome, e isso está dito acima.

Guardados em
`design/especime-v3/medicoes/2026-08-21-etapa-2j-{matriz,defeitos,contraste,invariancia}.json`.

### As capturas

`node tests/inicio/capturas.mjs` — **as 68 refeitas**, mesmos nomes, mesma pasta,
e `git status` diz que as 68 mudaram. Era o esperado: o cabeçalho mudou em todas,
os pontos do mapa mudaram de forma e de enchimento, a fila saiu da cabeça, as
peças perderam as caixas, os algarismos mudaram de corpo, o instrumento encolheu e
o estado de Beja mudou de desenho. Mais as **32 da etapa 1**, pela mobília.

---

## 2j · o que fica por fazer, e porquê

1. **I26 · `IDENTIDADE.md` §2 descreve a paleta escura como era antes da Emenda
   12.** É de propriedade: o brief da 2j dá-me a `IDENTIDADE.md` para ler e não
   para escrever, e a §2 é do construtor A desde a etapa 1. A alteração é um
   parágrafo, e está escrita na entrada.
2. **I27 · `Provenance.astro` tem a mesma armadilha que o I24 fechou em
   `Claim.astro`** (`lang = 'pt'` por defeito). Hoje não morde, porque quem o
   chama sem língua é o próprio `Claim.astro`, que já a exige. Não lhe toquei: o
   brief nomeia um ficheiro, e fazer o segundo por analogia é fazer sem medir.
3. **I28 · `inicio.mapa.naoDizK` não é rendida por ninguém**, e veio com a
   relocação R3. Retirá-la muda uma contagem do registo, e isso é do lugar de
   direção.
4. **I29 · `InstrumentoMapa.astro` não existe.** Ver acima.
5. **Cinco chamadas de `<Claim>` em `EstudoView.astro` e `MunicipioView.astro`
   ganharam `lang={lang}`**, e essas vistas não estão na lista de ficheiros desta
   ronda. Sem elas o I24 não fechava e a construção não passava. Está dito na
   alínea (d) e na entrada de ISSUES, com o que é preciso para desfazer.
6. **A goteira decide o ponto de quebra da cabeça.** A 1180 a ficha do mapa tem
   191px e a sua linha mais larga mede 163,6px: 27,4px de folga. Se a etapa 3 ou a
   revisão de voz encurtarem a linha «Contagem verificada nos ficheiros», a cabeça
   volta a caber em duas colunas mais cedo, e o 1180 pode descer. Fica dito para
   que ninguém o mude sem voltar a medir.
7. **I19** continua aberto, e continua a ser da fase da voz.

## 2j · quem fez o quê, e quanto custou

**Claude Opus** (construtor B5), num só fio, sem subagentes e sem delegação.
Nenhuma parte desta ronda correu noutro modelo.

**Contagem de fichas:** a única contagem honesta é a diferença de dois contadores.
No início desta ronda o contador dizia **14 973 347** por usar; no momento em que
esta nota se fecha dizia **14 466 932** — ou seja **≈ 506 mil fichas**, acima da
escala do brief (300 a 450 mil), e o que a passou foi a medição: a
matriz inteira quatro vezes, duas varreduras de transbordo de setenta combinações
cada, as alturas do instrumento nas duas construções, 68 capturas da primeira
página e 32 da etapa 1, e a conta por bloco da invariância. Não tenho um número
exacto para lá desta diferença, e não o invento.

---

## 2k · as duas correções da segunda leitura cruzada

*Construtor B6, **Claude Opus**, sozinho, sem subagentes, 21.08.2026, a partir de
`838a12f`. Um commit. Nada foi empurrado, nada foi posto no ar, `vercel.json` não
foi tocado, nenhum portão novo, nenhuma chave nova, nenhum número inventado. A
ronda é a triagem da cadeira sobre a segunda leitura do Codex
(`critica/2026-08-21-codex-segunda-leitura-da-primeira-pagina.md`): dois achados
reais, o 13 e o 16, e mais nada.*

### (1) Achado 13 · a palavra «provisório» ao pé das cópias desenhadas

**O que estava.** As seis linhas do PIB per capita de 2024 trazem `source_flag:
"p"`, e a decisão (d) manda a palavra ao lado do valor **em todas as superfícies**.
`Claim.astro` escreve-a em todas menos uma, e diz porquê no seu próprio cabeçalho:
dentro de um `<svg>` não entra, porque um `<span>` não é filho legítimo de um
`<text>`. É o ISSUES **I22**, aberto desde a etapa 1f à espera da cadeira. As
cópias desenhadas são sete: as seis da banda da região (`as="tspan"`) e a do
marcador do Instrumento n.º 1 (`as="text"`).

**O que a direção decidiu, e é por isso que isto não é um `<tspan>` novo:** a
palavra entra **na entrada de legenda de selos daquele valor**, que é onde o selo
do valor desenhado já vive pela convenção do §1.34 — «um `<a>` dentro de um desenho
não se lê como porta». A ressalva viaja com a porta.

**Metade já estava feita, e ninguém tinha reparado.** A entrada da legenda da
banda é um `<Claim … chip>` — um `<Claim>` FORA do desenho —, e um `<Claim>` fora
do desenho traz a palavra por si. As seis entradas da banda já a levavam. A que
faltava era a do Instrumento n.º 1, cuja entrada de legenda (`.brief
[data-brief-chip]`) é **só o selo**: sem valor, e portanto sem `<Claim>` que a
trouxesse. É a essa entrada que a palavra se junta.

**A condição lê-se da linha**, como em `Claim.astro`: `getClaim(r.valor)
.source_flag === 'p'`, do mesmo livro-razão que o portão confere, e nunca de uma
lista escrita à mão. Hoje são seis; amanhã são as que a fonte marcar.

**Onde ela fica, e porque passa nas conferências:** fora do selo (`seloDaLinha()`
compara o texto visível do `.src-chip` carácter a carácter) e fora de qualquer
`[data-claim]` (`formaDoValor()` compara a cadeia lá dentro com o valor publicado).
A ordem é a da casa — valor, unidade colada, palavra, selo —, e aqui, sem valor na
entrada, fica palavra e depois selo. A classe é a `.claim-provisorio` que já
existe em `site.css`, sem uma regra nova.

**O script não a compõe.** `convergencia.js` não reconstrói esta legenda:
`desenhaLeitura()` só troca o `hidden` de cada `[data-brief-chip]`. As seis
entradas saem do servidor prontas, com a palavra dentro, e a palavra acompanha o
selo pela mecânica que já os mostrava e escondia. Nenhuma cadeia é montada em
tempo de execução.

**Medido, antes e depois, nas duas edições** (a construção de referência é um
`git worktree --detach 838a12f` com `node_modules` ligado e `npm run build`
verde):

```
grep -o 'claim-provisorio">[^<]*' dist/index.html    | sort | uniq -c
grep -o 'claim-provisorio">[^<]*' dist/en/index.html | sort | uniq -c

   838a12f:   18 provisório   ·   18 provisional
   2k:        24 provisório   ·   24 provisional
```

E linha a linha, contadas as **entradas de legenda** (a entrada é o elemento da
legenda que contém o selo daquela linha; conta quando a palavra está nessa entrada,
fora do selo e fora do `[data-claim]`):

| linha | cópias desenhadas | entradas com a palavra, `838a12f` | entradas com a palavra, 2k |
| --- | --- | --- | --- |
| `pib-pc-portugal-2024` | 2 | 1 (banda) | **2** (banda, `.brief`) |
| `pib-pc-grande-lisboa-2024` | 1 | 1 (banda) | **2** (banda, `.brief`) |
| `pib-pc-peninsula-de-setubal-2024` | 1 | 1 (banda) | **2** (banda, `.brief`) |
| `pib-pc-algarve-2024` | 1 | 1 (banda) | **2** (banda, `.brief`) |
| `pib-pc-madeira-2024` | 1 | 1 (banda) | **2** (banda, `.brief`) |
| `pib-pc-alentejo-2024` | 1 | 1 (banda) | **2** (banda, `.brief`) |

**Igual nas duas edições, linha a linha.** Portugal tem duas cópias desenhadas
porque é a região por defeito do Instrumento n.º 1: a banda desenha-a e o marcador
da régua também. As outras cinco só se desenham na banda, do lado do servidor.

**O controlo negativo está na própria célula da matriz:** a distância da régua
(`distancia-portugal-ue27-2024`) também é desenhada dentro do `<svg>`, e a fonte
não a marca. A célula lê as linhas desenhadas do documento, conta 6 provisórias e
não 7, e é isso que prova que a condição vem do `source_flag` e não de uma lista.

**I22 fica fechado**, e não como ele previa: a palavra continua a NÃO entrar dentro
do `<svg>`. **I30 fica aberto**, e é um buraco anterior a esta ronda que a palavra
herdou: «Ver todas» põe seis valores na régua e a legenda continua a mostrar um só
selo — medido, `desenhados:6 selos:1 palavras:1`. O portão não o vê porque varre
HTML construído; a saída barata não compõe cadeia nenhuma, mas muda o que a
legenda mostra, e isso é forma.

### (2) Achado 16 · `aria-controls` nas duas divulgações por irmão

**O que estava.** Dois comandos deste sítio abrem um **irmão** e não o seu próprio
conteúdo: o «Menu» do cabeçalho, que revela a navegação, e a porta do telemóvel do
Instrumento n.º 1, que revela o corpo do instrumento. Os dois têm a razão escrita
onde vivem, e a razão é medida e não de gosto: um `<details>` fechado esconde o que
tem dentro por `::details-content`, e não há regra de folha portátil que o volte a
mostrar na secretária; com o corpo ao lado, `[open] ~` chega e existe em todo o
lado. **Os dois comentários já diziam o que se perdia** — «a associação de árvore
entre o comando e o que ele abre». O que faltava era o atributo que a repõe.

**O que entra.** `id="nav-principal"` na `<nav>` e `id="convergencia-corpo"` no
`<div class="conv-corpo">`; `aria-controls` com esse `id` em cada `<summary>`; e um
`aria-expanded` que acompanha o `open`. O id é do **corpo** e não da secção:
`#convergencia` é a âncora da secção inteira e duas portas da página já lá levam.

**Medido ANTES de escrito, e é o que decidiu a forma.** Num Chromium 148, o
`aria-expanded` de um `<summary>` **não manda** no estado que a árvore de
acessibilidade publica — o `open` do `<details>` manda, nos dois sentidos:

```
guião de rascunho: três <details> numa página de mentira, lidos por
Accessibility.getFullAXTree (CDP), no mesmo Chromium da matriz

  A, sem aria,              <details open>      role=DisclosureTriangle expanded=true
  B, aria-expanded="false", <details open>      role=DisclosureTriangle expanded=true
  C, aria-expanded="true",  <details> fechado   role=DisclosureTriangle expanded=false
```

Isto responde à pergunta que decidia se o atributo podia entrar: **um atributo
parado não mente a quem ouve a página**, porque quem ouve lê o `open`. Mente ao DOM
e a quem o lê de fora. É por isso que ele existe **e** é acompanhado, e não uma
coisa sem a outra — e é por isso que a rendição sem JavaScript continua correcta:
sem script o leitor abre o menu na mesma, o `aria-expanded` fica em `false`, e a
árvore continua a dizer «aberto». Sem esta medição eu não sabia se o atributo era
inofensivo ou uma regressão, e escrevi-a antes de escrever a linha.

**Quem o acompanha é `public/js/tema.js`**, e a escolha tem uma razão só: o «Menu»
está no cabeçalho, o cabeçalho está em **307 páginas**, e `tema.js` é o único
ficheiro adiado que as 307 carregam. O bloco é genérico e fecha-se sozinho — vale
para todo o `details > summary[aria-controls]`, e mais nenhum `<summary>` do sítio
leva esse atributo, porque os outros abrem o que têm dentro e o navegador trata
deles. Uma terceira divulgação por irmão entra sem uma linha a mais. Corre **antes**
do controlo do tema, de propósito: o tema desiste quando a página não tem controlo,
e o cabeçalho tem «Menu» na mesma. **O ficheiro passa a ter duas partes e o nome só
diz uma; fica em ISSUES como I31**, com o cabeçalho a declarar as duas por extenso
para que o nome não seja a única coisa que se lê.

**Medido em Chromium sem cabeça, nas duas edições** (célula nova da matriz; a
390 a célula ABRE os dois a sério, com um toque, e vê o atributo virar e voltar):

| edição | largura | comando | resolve | é irmão | `aria-expanded` | corpo à vista |
| --- | --- | --- | --- | --- | --- | --- |
| pt | 390 | `nav-principal` | sim | sim | `false` → `true` → `false` | sim |
| pt | 390 | `convergencia-corpo` | sim | sim | `false` → `true` → `false` | sim |
| en | 390 | `nav-principal` | sim | sim | `false` → `true` → `false` | sim |
| en | 390 | `convergencia-corpo` | sim | sim | `false` → `true` → `false` | sim |

E a 1280, nas duas edições: **comando do menu à vista `false`, navegação à vista
`true`** — que é o outro desenho da mesma folha, e a prova de que o atributo não
mudou a composição.

```
grep -o 'aria-controls="[^"]*"' dist/index.html | sort | uniq -c
   1 aria-controls="convergencia-corpo"
   1 aria-controls="nav-principal"

páginas do sítio (as 307 que levam o cabeçalho) com aria-controls ou aria-expanded
   838a12f: 0        2k: 307 com aria-controls, 2 delas com dois
```

**A primeira conta que eu escrevi aqui estava errada, e fica corrigida em vez de
apagada.** Contei `aria-controls|aria-expanded` só em `dist/index.html`, vi zero, e
ia escrever «zero em todo o `dist`». Em todo o `dist` são **cinco ficheiros**: os
documentos de estudo (`estudos/*/documento/`, `en/studies/*/document/`), que são
peças escritas à mão, não levam cabeçalho nenhum e já traziam **1 367
`aria-expanded="false"`** e oito `aria-controls` antes desta ronda. A conta que
interessa é a das **307 páginas do sítio**, e essa é zero → 307. O controlo
positivo do `grep` no mesmo `dist` de referência é `aria-pressed`, que aparece em
312 ficheiros.

### 2k · as réguas

**A matriz.** `node tests/inicio/matriz.mjs --json
design/especime-v3/medicoes/2026-08-21-etapa-2k-matriz.json` — **90 de 90 células
passam** (as 88 da 2j, todas ainda verdes, mais duas novas):

```
passa  2k · a palavra «provisório» na entrada de legenda de cada cópia desenhada
passa  2k · as duas divulgações por irmão: aria-controls resolve e aria-expanded acompanha
```

A célula «2i·2 · a palavra do provisório segue a edição» passa a imprimir
`pt {"provisório":24} · en {"provisional":24}`, onde a 2j imprimia 18 e 18: ela
confere que a palavra segue a edição, e não quantas são.

**As duas réguas.** `medir-defeitos.mjs` e `medir-contraste.mjs`, comparados com a
medição da 2j **como JSON inteiro**: **idênticos, os dois**. Controlo positivo: o
mesmo comparador contra a medição da 2i diz `false`.

| régua | 2j | 2k |
| --- | --- | --- |
| defeitos · frases de moldura | 93 distintas · 2 099 | **93 distintas · 2 099** |
| defeitos · cobertura (com-pagina / sem-pagina / sem-linha) | 1×6 / 1×307 / 1×8 | **1×6 / 1×307 / 1×8** |
| defeitos · primeira página, valores sem selo | 0 | **0** |
| contraste · claro / escuro | 0 falhas / 0 falhas | **0 falhas / 0 falhas** |

Era o esperado, e a razão é que nenhuma das duas correções escreve uma frase: uma
acrescenta uma palavra de onze caracteres (a régua dos defeitos só conta blocos com
30 ou mais) e a outra acrescenta atributos, que não são texto.

**A invariância diz o mesmo por outro lado**, e é a medida que prova que o
cabeçalho partilhado não mexeu em nenhuma página:

```
node scripts/medir-invariancia.mjs <dist de 838a12f> dist
  322 rotas · 320 idênticas em texto · 2 com diferenças
  /     +6 −0    (+ provisório × 6)
  /en/  +6 −0    (+ provisional × 6)
```

**Zero blocos removidos, em qualquer rota.** As 305 páginas que ganharam
`aria-controls` e `id` não mudaram um carácter do que se lê.

Guardadas em `design/especime-v3/medicoes/2026-08-21-etapa-2k-{matriz,defeitos,
contraste,invariancia}.json`.

**`npm run build` e `npm run verify` verdes** (`verify` sai a 0, com as seis
conferências a passar: livro-razão, cruzamento, documentos, portão de HTML, dados).
**`CHAVES-EN.md` não muda**: a chave é a `prov.provisorio` que já existe nas duas
edições, e nenhuma cadeia nova entrou em `strings.mjs`.

### 2k · o que fica por fazer, e porquê

1. **I30 · a legenda mostra um selo e o desenho pode ter seis valores.** É
   anterior a esta ronda e a palavra herdou-a. Mudar o que a legenda mostra é
   forma, e forma é da direção.
2. **I31 · `tema.js` tem duas partes e o nome só diz uma.** O nome é da cadeira.
3. **As capturas não foram refeitas.** Não mudou um píxel da composição: a única
   diferença visível é a palavra «provisório» em seis entradas de legenda do
   Instrumento n.º 1, e as capturas da 2j continuam a descrever tudo o resto. Fica
   dito para que a ausência não se leia como esquecimento — se a cadeira as quiser,
   é `node tests/inicio/capturas.mjs`.
4. **Os achados que a triagem não deu a esta ronda ficam onde a triagem os pôs**:
   o desvio dos 84px (17) no registo de desvios, a técnica dos fios (15) para o
   olho da direção, e os oito de desenho da casa sem alteração nenhuma.

### 2k · quem fez o quê, e quanto custou

**Claude Opus** (construtor B6), num só fio, sem subagentes e sem delegação.
Nenhuma parte desta ronda correu noutro modelo. A contagem de fichas está no
relatório da ronda, e é a diferença de dois contadores — não tenho número exacto
para lá dessa diferença, e não o invento.
