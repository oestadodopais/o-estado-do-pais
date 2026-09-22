# M3b · Os dezoito nomes confirmados voltam aos recibos, pela marca por fonte

*Construtor: Claude Opus 5, 22.09.2026, na worktree `nomes-no-sitio-2026-09-22`,
sobre `d6f46e45`. O brief é
`design/observatorio/BRIEF-M3b-os-nomes-confirmados-voltam-aos-recibos.md`. Cada
número desta página foi contado num guião que corre sobre o `dist/` construído e
que fica ao lado; nenhum foi escrito de cabeça. Sem travessões na prosa.*

## O ficheiro

`src/data/enquadramento/nomes.json` é, byte a byte, o que o motor exportou em
`indicators/out/nomes-conferidos-2026-09-21/nomes.json`. Copiado com `cp`,
conferido com `cmp` e com o resumo dos dois lados:

| | |
|---|---|
| `sha256` no motor | `46a7c1be160c4d24f85a699f97648598dd91ad6005266bd0a0939e0cfe60cafb` |
| `sha256` no sítio | `46a7c1be160c4d24f85a699f97648598dd91ad6005266bd0a0939e0cfe60cafb` |
| `cmp` | iguais, código 0 |
| o que estava antes | `8a790de32c6beec2c9c0a03a767288f5c1c2c672eefe2031f4e67a08aaec7ef3` (a exportação de 15.09) |

Contado no ficheiro, e igual ao que o cabeçalho dele declara: **18 nomes com
`mesma_medida: true`** (4 do INE, 14 da PORDATA), 19 recusados, 4 por decidir.
Nenhum campo `aviso` em lado nenhum. Os 18 nomes estão em **15 linhas**: três
delas (`despesa-em-id-2024`, `risco-de-pobreza-ou-exclusao-2025`,
`competencias-digitais-2025`) têm os dois nomes confirmados.

O `check:nomes` conta 23 recusados e não 19, e a diferença é deliberada: a régua
do sítio conta como recusado todo o nome que exista e não se renda, e os quatro
«por decidir» têm nome. Os 19 do motor são os que ele marcou
`mesma_medida: false`.

## A regra nova, em três linhas

A `correspondencia` deixou de ser uma cadeia por medida, julgada para o nome da
PORDATA e lida para os dois, que foi a porta por onde os nomes do INE de outros
indicadores passaram (`DECISIONS.md` §1.115). Passa a ser um objeto por fonte.
Um nome da fonte X rende-se quando, **naquela fonte**, `correspondencia[X]` é
«exata», o `estado` é «lido», o `mesma_medida` é `true`, não há campo `aviso`, e
o endereço e a hora de leitura existem. Os três leitores do sítio aprendem a
regra cada um por sua conta, como já era:

| leitor | onde |
|---|---|
| `nomeOficial()` | `src/lib/enquadramento.mjs` |
| `NOMES_OFICIAIS` | `scripts/medir-defeitos.mjs` |
| `lerNomes()` | `scripts/check-nomes-oficiais.mjs` |

**A forma antiga rende zero nomes nos três, e não em silêncio.** O `check:nomes`
ganha a célula **N7**, que fecha a construção a dizer que forma encontrou. Um
zero calado era o defeito de 21.09 outra vez, com o estado de verificação a
viver num sítio que nenhum código lê.

## O que as páginas rendem, medido no `dist`

Contado por `medir-nomes.mjs`, que lê o ficheiro pela marca por fonte e as
páginas construídas por conta própria (`nomes-no-dist.json` ao lado):

| | |
|---|---|
| páginas lidas | 7 354 |
| nomes oficiais em recibo | **36** (8 do INE, 28 da PORDATA) |
| por edição | 18 na portuguesa, 18 na inglesa |
| linhas com recibo nomeado | 15 |
| títulos de cartão do degrau 2 | **0** |
| nomes rendidos fora dos confirmados | 0 em recibo, 0 em cartão |

As 15 linhas, e de que fonte é o nome de cada uma:

| linha | fonte |
|---|---|
| `abandono-escolar-precoce-2025` | PORDATA |
| `competencias-digitais-2025` | INE e PORDATA |
| `desemprego-de-longa-duracao-2025` | PORDATA |
| `despesa-em-id-2024` | INE e PORDATA |
| `divida-publica-2025` | PORDATA |
| `formacao-bruta-de-capital-fixo-2025` | PORDATA |
| `independencia-da-justica-2025` | PORDATA |
| `indice-de-percepcao-da-corrupcao-2025` | PORDATA |
| `necessidades-medicas-nao-satisfeitas-2025` | PORDATA |
| `posicao-de-investimento-internacional-2025` | PORDATA |
| `racio-s80-s20-2025` | PORDATA |
| `risco-de-pobreza-ou-exclusao-2025` | INE e PORDATA |
| `taxa-de-desemprego-2025` | PORDATA |
| `taxa-de-desemprego-mip-2025` | PORDATA |
| `taxa-de-emprego-2025` | INE |

### Os zero títulos de cartão, com a razão medida

O degrau 2 da escada dos nomes só morde onde não há nome do projeto. Das 15
linhas com nome confirmado, catorze têm nome do projeto: nove em
`src/data/figuras.mjs` e cinco em `src/data/nomes-das-medidas.mjs`, que são
exatamente as cinco que o ganharam a 21.09 quando os nomes oficiais saíram do
ar. A décima quinta,
`indice-de-percepcao-da-corrupcao-2025`, é a única que o degrau 2 nomearia
(«Índice de perceção de corrupção», da PORDATA), **e não tem cartão em página
nenhuma**: não está declarada como medida em lado nenhum, e a razão está escrita
no repositório desde antes deste bloco, em `src/data/dominios.mjs` («duas linhas
do `quadro-institucional` não estão aqui... a única página do leitor que as rende
é a da própria linha») e em `src/data/areas.mjs` («a palavra "corrupção" não
ocorre uma única vez neste diploma»).

O resultado é, portanto, um zero com dono: a fonte `oficial` do `check:voz` fica
declarada e não exercida (a régua imprime `oficial 0`), e volta a morder no dia
em que o lugar de direção declarar aquela linha como medida. Não é uma falha
deste bloco nem um portão a dormir: o `check:nomes` continua a exigir que
qualquer título de cartão com `data-nome="oficial"` seja um nome confirmado
daquela linha, e as plantas provam-no em cada corrida.

## As plantas

O `check:nomes --prova` corre **24 plantas** (eram 21), todas sobre um ficheiro
de nomes escrito para elas, já na forma por fonte. As três novas:

1. **a marca «exata» da fonte com o `mesma_medida` a `null`**, que é como o motor
   escreve um nome por decidir: a marca da fonte sozinha não chega;
2. **um `mesma_medida: true` cujo `estado` não é «lido»**: um nome que o motor
   não leu na fonte não se rende, traga a marca que trouxer;
3. **a forma antiga do ficheiro**, que prova as duas coisas ao mesmo tempo: que
   um ficheiro assim rende zero nomes confirmados, e que a régua diz porquê em
   vez de dar um verde calado.

A planta «um nome sem estado» passou a chamar-se «um nome sem veredicto», porque
`estado` é agora um campo do ficheiro; a célula protege o mesmo, e a planta
continua a morder.

## A paragem que houve, e o que ficou dela

Com os nomes de volta, o `gate:html` fechou a construção com **2 erros**: o nome
com que o INE publica a despesa em investigação e desenvolvimento acaba em
«(sector institucional e sector empresas)», e a conferência da grafia da casa
apanhou as duas ocorrências de «sector» na página de `despesa-em-id-2024`.

Escrever «setor» ali era a casa a publicar um nome que o INE não publica, e a
§9 da constituição nomeia este caso à letra: «O que é transcrito nunca se
converte. Um excerto, o título de um documento, o nome de uma fonte, o título de
um trabalho publicado, uma citação entre «…»: cita-se pelas palavras exatas»
(`IDENTIDADE.md` §9). O motivo `nome-oficial-da-medida` entrou por isso em
`NONLEDGER_CITADO`, ao lado de `titulo-de-estudo`, `proveniencia` e
`identificador-tecnico`, que lá estão pela mesma razão e pela mesma via.

**O portão não se enfraqueceu no que protege**, e é a isenção mais estreita das
quatro: dentro desta marca não pode estar prosa nenhuma da casa, porque o
`check:nomes` compara o texto rendido, carácter a carácter, com o nome daquela
linha no ficheiro do motor. A prova da ortografia passou de seis casos a oito, e
os dois novos são um par: uma forma anterior ao Acordo dentro do nome oficial
passa (esperado 0), e a mesma forma dentro de um `data-nonledger` que não é
transcrito continua a ser apanhada (esperado 1). O conhecido-positivo correu:
pondo `data-da-linha` na lista dos transcritos, o portão fechou a 1 com a razão
escrita, e a lista foi reposta.

## As capturas

`captar-recibo.mjs` (pelo guião do B1, `captar-peca3.mjs`) serve o `dist/` por um
servidor próprio, corta a rede para fora, e mede a página ao mesmo tempo que a
fotografa. As quatro capturas estão em
`design/especime-v3/capturas/m3b-2026-09-22/`, com o manifesto em
`capturas-recibo.json` (Chromium 148.0.7778.96):

| ficheiro | rota | altura | nomes oficiais | deslocamento lateral |
|---|---|---|---|---|
| `recibo-despesa-em-id-2024-pt-390.png` | `/livro-razao/despesa-em-id-2024/` | 2 854 px | 2 | 0 |
| `recibo-despesa-em-id-2024-pt-1280.png` | `/livro-razao/despesa-em-id-2024/` | 1 602 px | 2 | 0 |
| `recibo-despesa-em-id-2024-en-390.png` | `/en/ledger/despesa-em-id-2024/` | 2 926 px | 2 | 0 |
| `recibo-despesa-em-id-2024-en-1280.png` | `/en/ledger/despesa-em-id-2024/` | 1 602 px | 2 | 0 |

O guião tem o seu conhecido-positivo: se um recibo não tiver os dois nomes, ou
se algum nome transbordar a página, sai com erro e não escreve o manifesto.

Na edição inglesa os dois rótulos são «Name at Statistics Portugal» e «Name at
PORDATA», e os nomes ficam em português com `lang="pt-PT"`, que é a regra de
sempre: não se traduz o nome de uma fonte.

## O que este bloco não fez

Nenhum nome escrito à mão nem traduzido. Nenhuma escrita no motor. Nenhum valor
do livro-razão mudou. Nenhum `push`. Os quatro nomes por decidir continuam por
decidir, e esperam o motor: o da PORDATA para `tipslm90` espera a correção da
linha (I129), e os três do INE esperam uma página do INE que declare a população
do indicador.

## Os três portões na cabeça final

Cada um no seu comando, com o código lido de um ficheiro e nunca atrás de um
`|`, na cabeça `50eb7aa38eaf1d5f22c1550dc875110a9622396b`. Os ficheiros estão ao
lado desta página.

| portão | início (UTC) | fim (UTC) | código | registo |
|---|---|---|---|---|
| `npm run build` | 08:11:25 | 08:16:14 | **0** | `build.log`, 11 058 linhas |
| `npm run verify` | 08:16:39 | 08:24:23 | **0** | `verify.log`, 946 linhas |
| `npm run typecheck` | 08:24:37 | 08:24:38 | **0** | `typecheck.log`, 4 linhas |

O `build` dessa corrida conta, na linha do `check:nomes`: 7 354 páginas lidas,
43 analisadas, 36 nomes em recibo, 0 em título de cartão, 4 confirmados do INE e
14 da PORDATA, 23 recusados, e as 24 plantas recusadas ou aceites como deviam.

**Uma corrida anterior foi deitada fora, e fica dito porquê.** A primeira
tentativa de correr os três seguidos leu um `build.codigo` que tinha ficado da
corrida anterior, e por isso o `verify` arrancou com o `astro build` ainda a
escrever o `dist/`: saiu a 1 num ficheiro que ainda não existia
(`dist/municipios/evora/index.html`). Não é um defeito do sítio nem de um
portão: é a regra da casa a ser quebrada por quem a escreveu, porque a presença
de um ficheiro não é prova de que ele é desta corrida. Os ficheiros foram
apagados e os três portões correram de novo, por ordem, cada um depois de o
anterior ter escrito o seu código.
