# Os vazios · relatório do construtor (Claude Opus)

*Ramo `vazios-2026-08-28`, saído de `main` `35313eb`. Contra
`design/especime-v3/briefs/BRIEF-vazios.md`, escrito pelo lugar de direção a
28.08.2026. Nada aqui foi fundido nem empurrado: o ramo fica para o lugar de
direção.*

## 0 · As contagens, antes e depois

Contadas na construção, com `grep -ro` sobre `dist/` inteiro (não sobre uma
amostra, e não sobre as páginas de concelho só): cada ocorrência da cadeia em
qualquer ficheiro `.html`.

| o que se conta | antes (`35313eb`) | com as sete medidas | com a regra 3 | com as onze linhas |
| --- | --- | --- | --- | --- |
| «sem linha ainda» em `dist/` | 320 | 12 | 11 | *(por medir)* |
| «no row yet» em `dist/` | 320 | 12 | 11 | *(por medir)* |
| peças por página de concelho, edição portuguesa | 8 × 308 | 7 × 308 | 7 × 308 | 7 × 308 |
| peças por página de concelho, edição inglesa | 8 × 308 | 7 × 308 | 7 × 308 | 7 × 308 |

**De onde vinham as 320.** 308 da execução da receita, uma por página; 9 do
prazo médio de pagamento, que a Direção-Geral imprime «N.d.» em nove concelhos;
2 de Penedono, a dívida total e o índice; e 1 do campo «Decidiu» do mandato de
2017 a 2021 na página de Évora. A soma é 320 nas duas edições, e as quatro
famílias fecham por regras diferentes: a primeira pela regra 1, as três do meio
pela regra 2, e a última pela regra 3.

**As quatro contagens do livro-razão** (as quatro linhas do inventário que levam
um número por dentro): estão em `2590 afirmações · 329 calculadas · 2447 linhas
de concelhos` e `2447 linhas · 308 concelhos`, nas duas edições. *(Mudam com as
onze linhas do motor; por medir enquanto elas não chegarem.)*

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
  lista das peças, ela está errada e tem de mudar** — fica assinalado em vez de
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
| B3 | a marca rendida dentro do elemento da linha, com selo, sem palavra de estado e sem barra | *(salta enquanto não houver nenhuma peça com marca)* |

## 4 · Os commits

| commit | o que faz | o que ficou verde |
| --- | --- | --- |
| `9ab6ec8` | as sete medidas: `execucaoDaReceita` sai de `MEDIDAS_DO_CONCELHO`, e tudo o que assumia oito passa a sete | `npm run build` inteiro, `verify`, `typecheck` |
| `782d759` | a marca como valor: a lista fechada, a propagação na receita, os dois sentidos da conferência 8, a peça sem estado, a distância que exige números, o campo «Decidiu» sem valores nem nota, o inventário e a régua nova | `npm run build` inteiro, `verify`, `typecheck`; `tests/municipio/vazios.mjs` 6 de 7 (a que falta espera as linhas), `tests/municipio/concelhos.mjs` 12 de 12, `tests/inicio/matriz.mjs` 87 de 87 |

Cada commit foi feito com caminhos explícitos, nunca `git add -A` nem
`git add .`, e leva os dois trailers. `DECISIONS.md` não foi tocado. O ramo não
foi fundido nem empurrado.

## 5 · O que não consegui fazer com honestidade

**1. As onze linhas do motor não chegaram, e nada foi escrito no lugar delas.**
Três dos critérios de «feito» do brief ficam por medir, e ficam ditos por medir e
não aproximados: `dist/` sem uma ocorrência das duas cadeias (estão em 11 e 11);
Penedono e os nove com «N.d.» na página, com selo; e
`src/data/concelhos.gerado.json` sem um vazio (tem 12). A regra 2 está provada
onde podia ser provada sem inventar uma linha: em memória, sobre linhas de
ensaio, com estragos plantados (§3, células A2 a A5). A célula B3, que mede a
marca numa página construída, **salta** e diz porquê, em vez de passar por não
ter encontrado nada.

**2. A regra 3 tinha um terceiro sítio que a decisão não previa, e a saída dele é
uma escolha minha.** «Depois de 1 e 2, «sem linha ainda» e «no row yet» não
rendem em lado nenhum» conta com duas famílias. Havia uma terceira: o campo
«Decidiu» do mandato de 2017 a 2021 na página de Évora, que não tem valores nem
nota própria e dizia a cadeia da casa. Das três saídas possíveis, duas eram
inaceitáveis: deixar o campo em branco é a célula vazia que a `IDENTIDADE.md` §7
recusa, e escrever ali uma frase seria inventá-la, porque dos cinco campos de um
mandato quatro têm uma nota com o FACTO que os explica e este não tem nenhum
facto lido. **Fica sem se render o par inteiro**, como não se rende a secção de
um concelho sem trabalho publicado, e volta no dia em que o mandato tiver a sua
nota. **É matéria do lugar de direção**, e o que está feito é reversível numa
linha.

**3. A descrição do `<head>` de uma página de concelho continua a nomear
«execução orçamental».** Está lida como a lista das FAMÍLIAS de medidas e não das
peças, e sob essa leitura continua verdadeira porque o prazo médio de pagamento
fica. Se o lugar de direção a ler como a lista das peças, ela está errada desde
o `9ab6ec8`, e a correção é uma frase nova com a sua linha do inventário.

**4. A marca é aceite com uma escrita só, `N.d.`, e é de propósito.** A cadeia
vem do brief e do que a casa já tinha escrito sobre Évora em
`src/data/municipios.mjs`. Se o exportador escrever outra («N.D.», «n.d.»,
«N.d»), `ledger:check` fecha a construção e diz o valor que encontrou. É o modo
de falhar que se quer: alto, e não uma marca a mais que passa em silêncio.

**5. O `check:voz` verde NÃO prova que a cadeia saiu de `dist/`, e isso tem de
ficar dito.** A varredura da voz salta os blocos com `data-cobertura`, e a peça
vazia leva essa marca: as duas linhas do inventário eram mantidas vivas pelo
campo do mandato de Évora, e mais nada. O que prova a ausência em `dist/` inteiro
é a célula B1 da régua nova, que conta todas as ocorrências em todos os ficheiros
`.html` e que vê primeiro a frase plantada numa cópia. Ler o `check:voz` verde
como prova de que a frase não rende seria ler uma régua pelo nome.

**6. Não corri nada do motor.** O repositório `ResearchHub` não foi tocado, e o
exportador não foi corrido: espera o aviso do lugar de direção, tal como o brief
manda.

## 6 · O custo

**Aproximadamente 400 mil símbolos** até ao ponto em que este relatório é escrito
(ler a casa, a construção repetida quatro vezes, as três réguas de navegador e a
escrita). O número é aproximado e vai dito como tal: não tenho como o medir ao
símbolo de dentro da sessão.

**Quatro construções inteiras** (`npm run build`, cerca de 2m20 cada, 6 546
páginas): a de base em `35313eb` para fixar as contagens de partida, a das sete
medidas, a da regra 2, e a que ficou. Mais três corridas de `verify` e três de
`typecheck`, e as três réguas de navegador (`concelhos` 12 de 12, `matriz` 87 de
87, `vazios` 6 de 7).
