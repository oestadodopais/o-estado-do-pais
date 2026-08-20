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
| *(o commit que contém esta nota completa)* | 2f | réguas: a invariância como conselheiro, a matriz de aceitação e as 64 capturas |

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