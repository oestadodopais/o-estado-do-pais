# Nota do construtor · A voz do livro-razão (27.08.2026)

*Ramo `voz-do-livro-razao-2026-08-27`, a partir de `main` em `ef46826`.
Construtor: Claude Opus 5. Objecto: a decisão do diretor de 27.08.2026 que fecha
as duas linhas deixadas «à decisão do diretor» no `PROTOCOLO-DAS-LEITURAS.md` e
nas exceções do `VOZ-MARCADORES.md`.*

## O que a decisão manda, e o que mudou

**As ledes saem, nas duas edições.** `livro.lede1`, `livroConcelhos.lede` e
`livroConcelhos.ledeDoConcelho`; e `livro.metaDescription` passa a nomear a
página, «Livro-razão · O Estado do País» e «Ledger · O Estado do País». Uma
página do livro-razão leva o seu título, as suas contagens, a sua pesquisa onde a
tem e as suas linhas.

**As contagens de proveniência saem dos índices.** No índice principal saíram os
dois grupos por estado da proveniência, com os títulos «2544 de 2552 linhas com
proveniência completa» e «8 de 2552 linhas com campos por confirmar»; a lista
passou a ser uma só, pela ordem do livro-razão. No índice dos concelhos saiu a
terceira parcela, «2417 com proveniência completa». Ficam «N afirmações · M
calculadas · K linhas de concelhos» e «N linhas · 308 concelhos», que são o
conteúdo de cada índice.

**Os dois estados do selo continuam os dois na página** (`IDENTIDADE.md` §5.2):
cada linha leva o seu, cheio ou a tracejado, e a legenda do aparelho nomeia-os
lado a lado.

## O que não saiu, e foi lido e não assumido

`indexaveis`, `divida` e `concelhos_linhas_completas` ficam na tabela de
`src/lib/prova.mjs`. `scripts/gate-html.mjs` percorre `Object.entries(PROVA)` e
exige que ele saiba **contar** cada chave, e não que alguma página a renda: a
construção continua a dizer «prova · 44 chaves reconferidas pelo portão». É a
mesma leitura da §1.66 A3, feita no código do portão e não por analogia.

## As contas do bloco

| medida | antes | depois |
| --- | --- | --- |
| exceções de `VOZ-MARCADORES.md` | 8 (1 de registo) | 5 (0 de registo) |
| marcadores | 62 | 62 |
| frases distintas varridas | 577 | 567 |
| linhas do inventário | 453 | 437 |
| chaves da prova rendidas em `/livro-razao` | 5 | 3 |
| chaves da prova rendidas em `/livro-razao/concelhos` | 3 | 2 |

## Os estragos plantados, vermelhos e depois verdes

**Planta 1 · uma lede reposta.** `livro.lede1` de volta às duas edições e rendido
em `LivroView.astro`. `npm run check:voz` saiu a 1 com quatro problemas: o
tripwire, pelos marcadores «nós» em `/livro-razao` e «we · us» em `/en/ledger`, e
o nome, com os dois blocos por classificar. Retirada, verde.

*Uma nota que a planta deu de graça:* posta só na edição portuguesa, a construção
fecha antes de chegar à voz, com o guarda de paridade de chaves do i18n («só em
pt: livro.lede1»). E, com o `dist/` deixado vazio por essa falha, `check-voz.mjs`
corrido à mão sai **verde com zero rotas medidas**. Na cadeia do `build` isso não
acontece, porque o `astro build` falha antes; corrido à mão, é uma leitura falsa.

**Planta 2 · uma contagem de proveniência reposta.** A terceira parcela do índice
dos concelhos de volta, com `contaCompletas` nas duas edições.
`npm run check:voz` saiu a 1 com dois problemas, os dois pelo inventário: «bloco
por classificar em /livro-razao/concelhos» e o seu gémeo em
`/en/ledger/municipalities`. Retirada, verde.

## O que fica

A leitura cruzada do diff deste bloco está por fazer, e o portão di-lo a cada
construção: o registo das revisões marca `voz-do-livro-razao` como `por ler`.

**Duas células de `tests/linha/correcoes-b.mjs` já estavam vermelhas em `main`**,
e continuam: a B10 de `municipio pt` e a de `municipio en`. As duas apontam para
a página de Évora, que este bloco não toca: um alvo de 82,5 × 18,4 px, que é o
marcador `[a verificar]` posto no nome do presidente interino pela correção I77
do bloco anterior, e um rótulo a 11,5 px na nota do excesso sobre o teto legal,
que ficou à vista quando o G6 tirou a dobra que o escondia. Ficam para quem
decidir a forma.
