# Os vazios · relatório do construtor (Claude Opus)

*Ramo `vazios-2026-08-28`, saído de `main` `35313eb`. Contra
`design/especime-v3/briefs/BRIEF-vazios.md`, escrito pelo lugar de direção a
28.08.2026. Nada aqui foi fundido nem empurrado: o ramo fica para o lugar de
direção.*

## 0 · As contagens, antes e depois

Contadas na construção, com `grep -ro` sobre `dist/` inteiro (não sobre uma
amostra, e não sobre as páginas de concelho só): cada ocorrência da cadeia em
qualquer ficheiro `.html`.

| o que se conta | antes (`35313eb`) | sete medidas | regra 3 | onze linhas | com o índice |
| --- | --- | --- | --- | --- | --- |
| «sem linha ainda» em `dist/` | 320 | 12 | 11 | 1 | **0** |
| «no row yet» em `dist/` | 320 | 12 | 11 | 1 | **0** |
| peças por página de concelho, edição portuguesa | 8 × 308 | 7 × 308 | 7 × 308 | 7 × 308 | **7 × 308** |
| peças por página de concelho, edição inglesa | 8 × 308 | 7 × 308 | 7 × 308 | 7 × 308 | **7 × 308** |
| peças a mostrar «N.d.», com selo | 0 | 0 | 0 | 20 | **22**, em 9 concelhos, nas duas edições |
| vazios em `src/data/concelhos.gerado.json` | 12 | 12 | 12 | 1 | **0** |

**A última ocorrência caiu com a última linha.** Até o motor escrever
`penedono-indice-de-divida-2024`, restava uma peça vazia em cada edição, a do
índice de dívida de Penedono; a linha chegou a 28.08.2026 (motor `011c5ec`), e
com ela a peça passou a mostrar «N.d.» com o seu selo. **As duas cadeias da
ausência não rendem em ficheiro nenhum de `dist/`**, e quem o diz é uma régua que
viu primeiro a frase plantada numa cópia.

**De onde vinham as 320.** 308 da execução da receita, uma por página; 9 do
prazo médio de pagamento, que a Direção-Geral imprime «N.d.» em nove concelhos;
2 de Penedono, a dívida total e o índice; e 1 do campo «Decidiu» do mandato de
2017 a 2021 na página de Évora. A soma é 320 nas duas edições, e as quatro
famílias fecham por regras diferentes: a primeira pela regra 1, as três do meio
pela regra 2, e a última pela regra 3.

**As quatro contagens do livro-razão** (as quatro linhas do inventário que levam
um número por dentro), lidas da construção e declaradas em `bloco vazios`:

| linha do inventário | antes | com as onze | com o índice |
| --- | --- | --- | --- |
| índice do livro-razão, edição portuguesa | `2590 afirmações · 329 calculadas · 2447 linhas de concelhos` | `2601 · 329 · 2458` | `2602 afirmações · 330 calculadas · 2459 linhas de concelhos` |
| índice do livro-razão, edição inglesa | `2590 claims · 329 calculated · 2447 municipality rows` | `2601 · 329 · 2458` | `2602 claims · 330 calculated · 2459 municipality rows` |
| índice dos concelhos, edição portuguesa | `2447 linhas · 308 concelhos` | `2458 linhas · 308 concelhos` | `2459 linhas · 308 concelhos` |
| índice dos concelhos, edição inglesa | `2447 rows · 308 municipalities` | `2458 rows · 308 municipalities` | `2459 rows · 308 municipalities` |

**A contagem das calculadas foi o instrumento que apanhou a linha em falta.**
Onze linhas novas, onze publicadas, zero calculadas: 329 antes e 329 depois. Se o
índice de Penedono tivesse sido escrito nessa passagem, a contagem estaria em
330, e foi ela que o disse sem ninguém ter de o ir procurar. Com a linha do
`011c5ec` está em **330**, e o `ledger:check` diz «2602 afirmações válidas · 330
derivadas · 334 com aritmética reavaliada no build»: a aritmética reavaliada sobe
de 333 para 334, e a que entrou é a que dá uma marca em vez de um número.

**A saída do exportador**, corrido de `~/Instruments/ResearchHub` (motor em
`41ce466`), com o comando que o brief fixa e mais nada tocado no motor:

```
(1) motor 41ce466, as onze linhas
11 nova(s) · 0 alterada(s) · 2446 inalterada(s) · registo a escrever
src/data/concelhos.gerado.json: 308 object(s), 2463 row id(s) named, 1 null
Escritas 2457 linhas em .../ledger/claims

(2) motor 011c5ec, o índice de Penedono
1 nova(s) · 0 alterada(s) · 2457 inalterada(s) · registo a escrever
src/data/concelhos.gerado.json: 308 object(s), 2464 row id(s) named, 0 null
Escritas 2458 linhas em .../ledger/claims

nas duas corridas:
dívida de proveniência que atravessa: 0 linha(s) com excerto "[a verificar]"
pending_page: 0 linha(s) sem sítio desenhado onde ser impressa
```

Os onze valores são os quatro bytes `N.d.`, conferidos ficheiro a ficheiro. O
registo da travessia ganha onze entradas e não perde nenhuma; nos 2 446 antigos
muda um campo só, `rh_ledger_sha256`, que é o resumo do livro-razão do motor e
muda porque ele cresceu. `exported_row_sha256` e `origin_row_sha256` estão iguais
nos 2 446, e é isso que diz que nenhuma linha publicada se mexeu.

## 1 · O que assumia oito, e mudou

`MEDIDAS_DO_CONCELHO` perdeu `execucaoDaReceita`. A busca foi por `grep -rn
"oito"` sobre `src/`, `scripts/`, `tests/` e `design/especime-v3/`, e cada
ocorrência foi aberta e lida antes de mexer: as que descrevem o sítio de hoje
passam a sete, as que contam história ficam com a história (a peça que a Emenda
19a tirou da primeira página tinha oito medidas nesse dia, e escrever «sete» ali
seria reescrever o passado).

**Onde o número mudou** (onze ficheiros, mais o brief que entrou no ramo):

* `src/data/concelhos.mjs` · a lista, o cabeçalho, e a razão da saída escrita no
  lugar onde a medida estava;
* `src/data/municipios.mjs` · a entrada de Évora perde a chave
  `execucaoDaReceita`, e a nota das duas peças vazias passa a ser a nota de uma;
* `src/lib/inicio.mjs`, `src/lib/livro-concelhos.mjs`, `src/views/MunicipioView.astro`,
  `src/views/HomeView.astro`, `src/components/inicio/Peca.astro`,
  `src/i18n/strings.mjs` · comentários que diziam «as oito»;
* `tests/inicio/matriz.mjs` · a célula «um concelho sem estudos rende as sete
  peças e mais nada», `m.pecas === 7`;
* `tests/municipio/concelhos.mjs` · a ordem da Emenda 14 sem «Execução da
  receita», e as duas células que pediam oito peças;
* `tests/municipio/gerar-teste-308.mjs` · o cabeçalho.

**O que NÃO mudou, e a razão está lida e não suposta:**

* **`Execução da receita` e `Revenue execution` continuam `viva` no
  inventário.** Não são o nome da peça que saiu: são o rótulo `<dt>` da camada
  das contas de Évora (`s.municipio.contasExecucao`), que a decisão D2 de 26.08
  já lá tinha posto. A régua confirma-o mecanicamente: `check:voz` ficou verde
  depois de a peça sair, e uma linha `viva` que deixasse de render fechava a
  construção.
* **A descrição do `<head>` de uma página de concelho continua a dizer
  «execução orçamental».** É uma escolha, e vai dita: a frase enumera famílias
  de medidas («população, poder de compra, emprego, empresas, dívida e execução
  orçamental») e não peças, e o prazo médio de pagamento, que fica, é uma
  medida de execução do orçamento publicada na mesma série da Direção-Geral.
  Mudá-la seria uma frase nova, uma linha nova do inventário e uma linha
  `retirada`, e o brief não a pede. **Se o lugar de direção ler a frase como a
  lista das peças, ela está errada e tem de mudar**, e fica assinalado em vez de
  decidido por mim.
* **A camada das contas de Évora ficou como estava**, com os dois valores e os
  dois selos, tal como o brief manda.

## 2 · Onde o valor textual entra em cada régua

A marca é `N.d.`, tal como a fonte a imprime, e é a mesma cadeia nas duas
edições. Não é traduzida, não é formatada, e não é zero. A lista das marcas é
fechada e vive num sítio só, `VALORES_NAO_NUMERICOS` em `src/lib/ledger.mjs`,
com a fonte que a imprime escrita ao lado; qualquer outro valor sem algarismos
continua a fechar a construção, que é o que a conferência 3 do validador sempre
fez.

**A regra que o código aplica não é «se for N.d.»**, é `parsePtNumber(valor) ===
null`, que é a pergunta que a casa já fazia: um valor que não é um número simples
não se compara, não se desenha e não se arredonda. A lista fechada só decide o
que é publicável.

| régua | o que faz com um valor textual | o que mudou |
| --- | --- | --- |
| `ledger:check` (`validateLedger`) | aceita o valor sem algarismos **se e só se** for uma marca declarada; e uma linha com `check` cuja receita dá a marca tem de publicar a marca | mudou: a conferência 3 ganhou a porta da marca, e a 8 ganhou os dois sentidos (número onde a receita dá marca, marca onde a receita dá número) |
| `evaluateCheck` | leva a marca consigo por cima de `+ - * /` e de `round( … , n )`, como uma calculadora; duas marcas diferentes na mesma expressão atiram | mudou: atirava sempre que uma entrada não era número |
| `check:cruzamento` | compara resumos de bytes e cadeias, e nunca converte um valor em número | **não mudou, e foi lido para o confirmar**: as únicas conversões do ficheiro são `Number()` sobre contagens de correções e de reconferências |
| `check:dados` | as suas quatro conversões (`parsePtNumber`) são sobre `municipios-*-caop-2025`, sobre as linhas da convergência e sobre linhas contadas em ficheiros alojados; o CSV e o JSON do livro-razão são comparados como **cadeias** | **não mudou, e foi lido para o confirmar**: nenhuma linha de medida de concelho passa por uma conversão numérica |
| `gate:html` (o portão que reconta as provas) | um `[data-claim]` é conferido por `digitsOf` e por `formaDoValor`, que comparam cadeias: `N.d.` bate consigo próprio dos dois lados. O índice `VALORES_DO_LIVRO`, que procura valores do livro-razão em prosa sem selo, salta os valores sem algarismos (`if (!d) continue`), que é a linha que já lá estava | **não mudou, e foi lido para o confirmar** |
| `prova.mjs` | as três chaves dos concelhos contam LINHAS e concelhos, nunca valores | **não mudou, e foi lido para o confirmar** |
| `check:voz` | o inventário passa a declarar as duas palavras da ausência como `retirada`, com a razão | mudou: as duas linhas e a nota da Emenda 19 que dizia que elas continuavam a ler-se na página de Évora |
| `check:cadeia`, `check:mapa`, `check:regioes`, `cartoes` | não tocam nos valores das medidas de concelho (`cartoes.mjs` trata o valor como `String`) | **não mudaram, e foram lidos para o confirmar** |

**Na página**, o valor textual entra por três sítios, e cada um perde alguma
coisa de propósito:

1. **`Claim.astro`** escreve o valor tal e qual, como sempre escreveu: nenhuma
   linha mudou aqui, e é o teste de que a casa nunca formatou nada.
2. **A peça** (`pecasDoConcelho` e `Peca.astro`) perde a barra, a palavra de
   estado e o quadrado. A razão da palavra está escrita no código: as três
   palavras da casa são «fora do limiar», «dentro do limiar» e «sem limiar», e
   num índice de dívida cujo teto legal está publicado e cujo valor a fonte não
   determina nenhuma é verdade. Fica o valor, a unidade, o nome, a nota da
   medida (que é conteúdo sobre a medida e não sobre a ausência) e o selo.
3. **A distância desenhada** (`MunicipioView.astro`) passa a exigir dois
   NÚMEROS, e não dois ids. Com as duas linhas de Penedono a marca chegava à
   geometria e o desenho escrevia `NaN` num atributo do SVG. A frase do índice
   também deixa de se compor, porque «N.d.%» seria a marca da fonte com um
   símbolo colado que ela não imprimiu.

## 3 · O que foi provado, e com que estrago plantado

A régua nova é `tests/municipio/vazios.mjs`. Corre fora da construção, imprime e
sai com 0, como as outras réguas de `tests/`. **As linhas de ensaio vivem no mapa
que `loadClaims()` guarda em memória e nunca em `ledger/claims/`**: são
injectadas depois de o mapa estar carregado e saem dele no fim de cada bloco.

| célula | o que prova | o estrago que ela viu primeiro |
| --- | --- | --- |
| A1 | a marca é a cadeia inteira | `N.d. (2024)` e `não disponível` não são marca |
| A2 | o validador aceita a marca | uma linha de ensaio com `value: "não disponível"` fecha a construção |
| A3 | a receita leva a marca | um valor não declarado (`n.a.`) continua a atirar |
| A4 | a linha calculada publica o que a receita dá | a mesma linha a publicar `0` e a publicar `7,5` fecha, nos dois casos |
| A5 | a peça da marca não tem estado nem barra | a mesma peça com `7,5` volta a ter estado `dentro` e régua |
| B1 | «sem linha ainda» e «no row yet» a zero em `dist/` | a frase plantada numa cópia em memória de uma página construída, que o detector tem de ver antes de poder contar zero |
| B2 | as 308 páginas com sete peças, nas duas edições | (contagem directa, não é uma prova de ausência) |
| B3 | a marca rendida dentro do elemento da linha, com selo, e sem comparação nenhuma | as 20 peças construídas, que corrigiram a própria célula (ver abaixo) |

**A célula B3 foi corrigida pelo que ela mediu, e a correção é do assunto.** A
primeira redação pedia que uma peça com marca não tivesse palavra de estado
nenhuma. As 20 peças construídas mostraram que isso está errado: o prazo médio de
pagamento e a dívida total do município não têm limiar publicado, e por isso
dizem «sem limiar» nas 308 páginas, com valor ou com marca. Tirar a palavra só às
nove com marca seria dizer daquelas nove uma coisa diferente do que se diz das
outras 299, e falsa: o que lhes falta não é o limiar, é o valor. A regra que a
célula passa a medir é a que a decisão quer dizer: **uma marca nunca produz uma
comparação**, nunca «fora do limiar», nunca «dentro do limiar», nunca um quadrado
pintado, nunca uma barra. Onde há limiar publicado e o valor é marca, que é o
índice de dívida, a peça fica sem estado nenhum, e isso mede-se na célula A5.

O estado das oito células, na construção final: **8 de 8**. A B1 conta zero nas
duas edições, e conta-o depois de ter visto a frase plantada; a B3 encontra **22
peças** com «N.d.» em 9 concelhos, nas duas edições, todas com o valor dentro do
elemento da linha e com selo, com estados «sem» e «(nenhum)», sem um quadrado
pintado e sem uma barra. As três medidas do índice de dívida de Penedono estão na
segunda dessas duas: é a peça com estado «(nenhum)», que é o que a A5 mede em
memória e o que a página agora rende.

## 4 · Os commits

| commit | o que faz | o que ficou verde |
| --- | --- | --- |
| `9ab6ec8` | **as sete medidas**: `execucaoDaReceita` sai de `MEDIDAS_DO_CONCELHO`, e os onze ficheiros que assumiam oito passam a sete | `npm run build` inteiro, `verify`, `typecheck` |
| `782d759` | **a marca como valor**: a lista fechada, a propagação na receita, os dois sentidos da conferência 8, a peça sem estado, a distância que exige números, o campo «Decidiu» sem valores nem nota, o inventário e a régua nova | `build`, `verify`, `typecheck`; `vazios` 6 de 7, `concelhos` 12 de 12, `matriz` 87 de 87 |
| `220bb46` | **o relatório**, na primeira redação | (documento) |
| `7ac6dd4` | **as onze linhas do motor**, o id do prazo médio de Évora, as quatro contagens declaradas em `bloco vazios`, a linha do registo das revisões, e a célula B3 corrigida pelo que mediu | `build`, `verify`, `typecheck`; `vazios` 7 de 8, `concelhos` 12 de 12 |
| `0977666` | **o relatório com as contagens medidas**, e seis travessões fora da prosa nova | (documento) |
| *(este)* | **a linha do índice de Penedono**, escrita pelo motor `011c5ec`, as quatro contagens outra vez, e o fecho do relatório | `build`, `verify`, `typecheck`; `vazios` 8 de 8, `concelhos` 12 de 12, `matriz` 87 de 87 |

Cada commit foi feito com caminhos explícitos, nunca `git add -A` nem
`git add .`, e leva os dois trailers. `DECISIONS.md` não foi tocado. Do motor
correu-se um comando só, o do brief. O ramo não foi fundido nem empurrado.

Fica por cometer, de propósito, um ficheiro que apareceu na árvore e não é meu:
`design/especime-v3/briefs/BRIEF-vazios-M8.md`.

## 5 · O que não consegui fazer com honestidade, e o que se fechou pelo caminho

*O §5.1 esteve aberto e fechou: fica escrito como esteve, porque o modo como se
fechou é a parte útil. Os quatro seguintes são escolhas e limites, e ficam.*

### 5.1 · Faltou uma linha do livro-razão, e ela veio do sítio de onde tinha de vir

**Fica registado como aconteceu, porque é a parte que interessa.** Na primeira
passagem do exportador (motor `41ce466`) o motor não escreveu
`penedono-indice-de-divida-2024`: o ficheiro gerado nomeava 2 463 ids e deixava
um a nulo, a página de Penedono rendia seis peças com valor e uma vazia, e daí
vinha a única ocorrência de «sem linha ainda» e de «no row yet» que restava em
cada edição. Três critérios de «feito» do brief ficavam presos nessa linha.

**Não a escrevi, e a razão é a mesma pela qual o brief a proíbe duas vezes.** Um
selo é a porta para `/livro-razao/<id>`, e sem linha não há porta: render «N.d.»
naquela peça sem linha seria pôr um valor numa página do leitor fora do
livro-razão, que é a única coisa que a casa nunca faz (`Claim.astro`: «a ÚNICA
maneira de pôr um número numa página»), e o portão fechava a construção por isso
mesmo. Uma linha do livro-razão nasce da leitura de uma fonte, e eu não li
nenhuma.

**O que se fez foi medir a falta e nomeá-la.** A contagem das calculadas ficou em
329 depois de onze linhas novas, e foi ela que disse que faltava uma linha
derivada; o relatório pediu-a ao motor, com a forma exacta de que ela precisava.
O motor escreveu-a a 28.08.2026 (`011c5ec`), com `value: "N.d."`, as duas
entradas e a escala em `derived_from`, e o `check` dos 307 irmãos,
`round ( penedono-divida-dgal-2024 / penedono-limite-divida-dgal-2024 *
indice-de-divida-limite-legal , 1 )`.

**Passou sem uma linha de código mudar**, que era o que a célula A4 já prometia
sobre uma linha de ensaio com a receita real: o `ledger:check` reavalia a
expressão, a receita dá a marca, a linha publica a marca, e a conferência 8 dá-a
por verificada. As três contagens fecharam de uma vez: `dist/` a 0 e 0, o
ficheiro gerado sem vazios, e a peça do índice de Penedono a mostrar «N.d.» com o
seu selo, sem palavra de estado, sem quadrado e sem barra.

**A lição, que é do assunto e não deste bloco:** a régua que apanhou a falta não
foi nenhuma das que a procuravam. Foi uma contagem que a página publica sobre si
própria, «330 calculadas», que ficou parada quando devia ter subido.

### 5.2 · O terceiro sítio da regra 3, confirmado pelo lugar de direção

«Depois de 1 e 2, «sem linha ainda» e «no row yet» não rendem em lado nenhum»
contava com duas famílias de peças. Havia uma terceira: o campo «Decidiu» do
mandato de 2017 a 2021 na página de Évora, que não tem valores nem nota própria e
dizia a cadeia da casa. Deixar o campo em branco é a célula vazia que a
`IDENTIDADE.md` §7 recusa; escrever ali uma frase seria inventá-la, porque dos
cinco campos de um mandato quatro têm uma nota com o FACTO que os explica e este
não tem nenhum facto lido. **O par inteiro deixa de se render**, e volta no dia em
que o mandato tiver a sua nota. O lugar de direção confirmou a escolha a
28.08.2026, e ela fica registada aqui como o terceiro sítio da regra 3.

### 5.3 · O `check:voz` verde não prova que a cadeia saiu do `dist/`

A varredura da voz salta os blocos com `data-cobertura`, e a peça vazia leva essa
marca: as duas linhas do inventário eram mantidas vivas pelo campo do mandato de
Évora, e mais nada. Prova disso: o `check:voz` ficou vermelho nas duas linhas no
minuto em que aquele campo saiu, com onze ocorrências ainda em `dist/`. O que
prova a ausência em `dist/` inteiro é a célula B1 da régua nova, que conta todas
as ocorrências em todos os ficheiros `.html` e que vê primeiro a frase plantada
numa cópia. **Ler o `check:voz` verde como prova de que a frase não rende seria
ler uma régua pelo nome.**

### 5.4 · A descrição do `<head>` que diz «execução orçamental»

Fica como está, por decisão do lugar de direção de 28.08.2026. Está lida como a
lista das FAMÍLIAS de medidas e não das peças, e sob essa leitura continua
verdadeira porque o prazo médio de pagamento fica.

### 5.5 · A escrita da marca é uma só, e foi conferida nos bytes

`N.d.`, quatro bytes, nas onze linhas, lidas ficheiro a ficheiro depois de o
exportador correr. Se um dia outra fonte imprimir outra escrita, o
`ledger:check` fecha a construção e diz o valor que encontrou: é o modo de falhar
que se quer, alto, e não uma marca a mais a passar em silêncio.

## 6 · O custo

**Aproximadamente 510 mil símbolos**, e aproximado vai dito como tal: não tenho
como o medir ao símbolo de dentro da sessão. Do fecho, a última passagem, foram
cerca de 30 mil.

O que se pode contar é o trabalho: ler a casa antes de lhe tocar, **seis
construções inteiras** (`npm run build`, cerca de 2m20 cada, 6 546 páginas: a de
base em `35313eb` para fixar as contagens de partida, a das sete medidas, a da
regra 2, a das onze linhas, a das correções, e a do índice de Penedono), cinco
corridas de `verify` e cinco de `typecheck`, as réguas de navegador três vezes
(`concelhos` 12 de 12 em todas, `matriz` 87 de 87) e a régua nova seis vezes.

**Duas corridas do exportador do motor**, as duas com o comando que o brief fixa,
e nada mais tocado no motor em nenhuma delas.
