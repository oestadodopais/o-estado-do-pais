# F1.2b · os cartões, o menu e os estudos à vista · relatório do construtor

*Ramo `portas-2026-09-03`, tirado de `origin/main` em `d82bc4cf`. Construtor
Claude Opus 5, 03.09.2026. O bloco é o F1.2b do
`design/observatorio/BRIEF-F1.2b-cartoes-menu-estudos.md`, escrito a partir do
item 9 do brief do F1.2, da entrada «Domínios» que o F1.2 deixou para depois do
F1.1, e da segunda metade da linha F1.9 do plano. Sem travessões na prosa.*

## 1 · O resultado, em cinco linhas

**As sete medidas de aceitação, de E1 a E7, estão verdes nas duas edições**,
medidas pela régua do F1.1 (`tests/inicio/porta.mjs`), que passou de 24 para 32
células. **Os quatro estragos plantados do E6 foram vistos vermelhos e depois
verdes**, ao lado dos sete que o F1.1 deixou: são onze plantas, e nenhuma passou
por planta sem plantar.

**Três dos vinte e um cartões da faixa passam a abrir a página do domínio**, na
âncora da sua medida (`#m-e3`, `#m-t1`, `#m-t2`), e dizem-no com uma palavra que
já existia; os outros dezoito continuam a abrir a leitura breve da mesma página.
Quem decide é uma tabela só, `dominioDaLinha()`, que lê a lista dos domínios com
página e não uma segunda lista escrita à mão.

**«Domínios» entra no menu nas duas edições**, e a fila passa de onze a doze
posições. **A fila dos estudos entra logo por baixo da faixa**: `/estudos` fica a
**um toque** e a **1,00 ecrã** de `/` a 390 × 664 (0,98 em `/en`), onde antes
estava a dois toques ou a mais de nove ecrãs.

**A altura de `/` a 390 sobe 50 px, que é exactamente a altura da fila dos
estudos**, e o teto da régua sobe os mesmos 50 px, com a medição escrita ao lado
dele. Mais nada deste bloco custa altura ao telemóvel; a manchete do domínio
ENCOLHEU 3,4 px.

**A manchete deixou de trazer o texto do selo dentro da frase em três camadas**,
e não em duas: o domínio e o concelho, que o brief nomeia, e também a região, que
ficaria a única com o defeito depois de o mecanismo existir. **Nenhuma cadeia
nova entrou no sítio: `src/i18n/strings.mjs` não foi tocado.**

**Uma coisa custou mais do que o brief mede, e está medida na §9 (5):** o doze
avo item do menu não cabe na fila com a ligação da edição ao lado, e a mobília
ganha uma fila física a partir de 1024. O cabeçalho passa de 323,1 px para
363,5 px a 1280, e a página inteira sobe 41 px a essa largura. A 390, que é onde
o brief mede, não muda nada. Não há arranjo que não seja uma decisão de desenho,
e por isso este bloco mede-o e deixa-o dito em vez de o inventar.

## 2 · As medidas de aceitação, de partida e de chegada

Tudo medido com a mesma régua, `tests/inicio/porta.mjs`, sobre duas construções:
a da árvore de partida (`d82bc4cf`, construída neste ramo antes de se mexer em
nada e guardada à parte, lida com `OEDP_DIST`) e a desta. **As duas saídas estão
no repositório**, para que ninguém tenha de acreditar na tabela:

```
OEDP_DIST=<a construção de partida> node tests/inicio/porta.mjs \
  --json design/especime-v3/medicoes/portas-medidas-antes.json    → saída 1 · 24 de 32
node tests/inicio/porta.mjs --vermelhos \
  --json design/especime-v3/medicoes/portas-medidas-depois.json   → saída 0 · 32 de 32 · 11 de 11 plantas
```

| # | medida | antes (`d82bc4cf`) | depois | estado |
| --- | --- | --- | --- | --- |
| E1 pt | cada cartão da faixa cujo id de linha está na lista de medidas do domínio aponta à página do domínio; os outros à leitura breve | 21 cartões, **0** para a página do domínio, 21 para a leitura breve | 21 cartões, **3** para a página do domínio (`divida-publica-2025` → `#m-e3`, `taxa-de-emprego-2025` → `#m-t1`, `taxa-de-desemprego-2025` → `#m-t2`), 18 para a leitura breve; 0 errados | ✓ |
| E1 en | o mesmo | 21 · 0 · 21 | 21 · 3 · 18; 0 errados | ✓ |
| E2 pt | «Domínios» no menu, com destino que existe | **não está** (o menu tinha 11 posições) | `/dominios` no menu, e a página responde 200; 12 posições | ✓ |
| E2 en | o mesmo | **não está** | `/en/domains` no menu, 200; 12 posições | ✓ |
| E3 pt | `/estudos` a ≤ 1 toque e ≤ 1,5 ecrãs de `/` a 390 × 664 | 3 portas no documento, 2 tocáveis; a mais acima a **6 070,7 px** (**9,14 ecrãs**), que é o cartão dos estudos no fim da página; a do menu está dentro do `<details>` fechado e custa dois toques | 4 portas no documento, 3 tocáveis sem abrir gaveta; a mais acima a **662,7 px** (**1,00 ecrã**), alvo 354 × 44 px; **um toque** chegou a `/estudos` | ✓ |
| E3 en | o mesmo | 3 portas, 2 tocáveis; a mais acima a **6 041,8 px** (**9,10 ecrãs**) | a mais acima a **650,1 px** (**0,98 ecrã**), alvo 354 × 44 px; um toque chegou a `/en/studies` | ✓ |
| E4 pt | a altura de `/` a 390 não sobe mais do que a altura da fila dos estudos | **6 909 px** (teto 6 941) | **6 959 px** (mais **50**, que é a altura da fila; teto 6 991, folga 32) | ✓ |
| E4 en | o mesmo | 6 861 px (teto 6 890) | 6 911 px (mais 50; teto 6 940, folga 29) | ✓ |
| E5 | as réguas do F1.1 e as do sítio verdes; `build`, `verify`, `typecheck` a 0 | — | os três a 0, lidos de ficheiros escritos pelo próprio comando; a lista das réguas está na §7 | ✓ |
| E6 | uma planta por porta, vermelha e depois verde | — | as quatro vistas vermelhas e repostas verdes; a §6 imprime-as | ✓ |
| E7 pt | a manchete sem texto de selo dentro da frase, pelo texto acessível do `<h1>` | domínio: «A dívida pública é 89,7%**fonte · Quadro institucional de indicadores** do PIB, …»; concelho: «Évora tem 58 567**fonte · Évora — Economia, Investidores, Portas Abertas 2026** pessoas.»; região: idem, duas vezes | as quatro camadas com o texto inteiro a COMEÇAR pela frase: país 0 selos, domínio 2, região 2, concelho 1, todos fora da frase | ✓ |
| E7 en | o mesmo | domínio: «Government debt is 89,7%**source · Institutional indicator framework** of GDP, …» | idem | ✓ |

## 3 · O que se construiu, item a item do brief §1

**1 · Os cartões da faixa.** `dominioDaLinha()`, em `src/lib/dominios.mjs`, é a
tabela única do destino: dado o id de uma linha, diz se ela é a medida de um
domínio **que tem página** e qual é a âncora dessa medida lá dentro. Não escreve
uma lista de ids; percorre `dominiosComPagina()`, que é a mesma condição por que
a página do domínio existe («declara medidas E as linhas dessas medidas existem»).
Uma lista escrita aqui era a promessa de apontar para uma página que não foi
construída.

Hoje casam três das vinte e uma linhas da faixa, e as três estão medidas e ditas:

| cartão | linha | medida do domínio | destino |
| --- | --- | --- | --- |
| Dívida pública | `divida-publica-2025` | E3 | `/dominios/economia-e-financas-publicas#m-e3` |
| Taxa de emprego | `taxa-de-emprego-2025` | T1 | `…#m-t1` |
| Taxa de desemprego | `taxa-de-desemprego-2025` | T2 | `…#m-t2` |

**A porta vai à secção e não ao topo da página**, que é o achado Major 11 da
leitura a frio do F1.2 aplicado aqui: quem toca no cartão da dívida pública quer
a dívida pública, e não o princípio de um domínio com dez medidas. A âncora
compõe-se **uma vez**, em `ancoraDaMedida()`, e a `DominioView` passou a lê-la de
lá: duas composições da mesma cadeia divergiriam em silêncio no dia em que uma
delas mudasse, e a porta ficava a apontar para um `id` que não existe. A régua
confere que o `id` existe na página de chegada, e não só que o caminho responde.

**O rótulo do destino é uma palavra que já existia.** `s.dominios.eyebrow`
(«Domínios» / «Domains») é a sobrancelha da página do domínio e do índice deles,
declarada desde o F1.2: o cartão diz para onde leva com a palavra que a página de
chegada usa para se nomear. **Não é uma frase nova, e não é uma porta**: é um
`<span>`, porque a porta do cartão é o cartão inteiro e um segundo alvo lá dentro
seria uma área sobreposta, que é o que a régua dos alvos recusa desde a I13.

**E NÃO CUSTA UMA FILA AO CARTÃO.** Senta-se na quinta fila, que tem 44 px de
altura e leva o selo encostado à esquerda; com `justify-self: end` fica no outro
extremo da mesma célula. Medido: o cartão mede **163,0 px** em `/` e **181,7 px**
em `/en`, antes e depois, e as caixas do rótulo e do selo não se tocam nos três
cartões.

**2 · «Domínios» no menu.** A fila de `Masthead.astro` passa de onze a doze
posições, nas duas edições, entre «Áreas» e «Estudos»: primeiro as quatro
maneiras de cortar o território (concelhos, regiões, distritos, áreas), depois a
maneira de cortar a matéria (os domínios), e só então o que não é nem uma coisa
nem outra. **A cadeia já existia**: `nav.dominios` foi declarada pelo F1.2 para o
rodapé, nas duas edições, com a nota que dizia «o menu do cabeçalho fica para
depois do F1.1». Ficou, e é este o commit. A §1.51 fica emendada pela segunda vez
com a mesma razão que o F1.1 escreveu: a fila tem tantas posições quantos os
índices do sítio.

**3 · O selo fora da manchete.** É o item que mais custou a desenhar, e a §4
escreve porquê. Em resumo: o `<h1>` passa a ser a frase, e os selos são o seu
último filho, numa linha por baixo. Feito na página do domínio (que o brief pede)
e na dos 308 concelhos (que o item 9 do brief do F1.1 pede e o F1.1 não pôde
construir porque a vista era do F1.2). **E também na das nove regiões**, que a
letra do brief não nomeia: tem o mesmo defeito, tem a mesma cura, e ficaria a
única das quatro camadas com o selo dentro da frase depois de o mecanismo existir.
Fica dito e não escondido.

**A posição «n de N» entra nas faixas das outras três camadas.** O F1.1 deixou-a
só na primeira página, com a razão escrita («uma região tem outra lista e outro
número, e escrever ali "de 21" seria um algarismo certo noutra página e errado
naquela»), e o que faltava era cada faixa contar a sua. Cada vista conta o
ordinal e o total da lista que ela rende, e por isso são **1 de 21** na primeira
página, **1 de 5** na do domínio, **1 de 2** na de uma região e **1 de 8** na de
um concelho. Os dois algarismos continuam a levar o motivo `numeracao` do
registo, como no F1.1.

**A primeira redação rendeu «de 5» com o ordinal em branco na página do
domínio**, e fica dito porque é a razão de a `Faixa` ter ganho uma guarda: a
vista passava `total` e não passava `posicao`, o `undefined` não rende nada em
Astro, e o defeito só se via no HTML construído. A faixa passa a atirar quando
recebe um total e um cartão sem posição, e o mesmo para um cartão sem destino.

**4 · Os estudos à vista.** Uma fila, uma porta, logo por baixo dos cartões,
dentro de `.faixa-bloco` (que é o filho da grelha da cabeça onde a faixa já
está, e por isso não pede colocação nova em largura nenhuma).

**É uma porta e mais nada, e isso é disciplina e não pressa.** Uma contagem ao
lado dela («N trabalhos no arquivo») seria um algarismo a mais nesta página, e
uma frase a dizer o que o arquivo é seria uma frase nova sobre a casa, que o §2
do brief recusa. O texto é `s.estudos.h1`, que é o título da página de chegada. O
bloco inteiro é a ligação, e por isso a régua da voz não o recolhe («uma ligação
inteira não é uma frase, é um destino»): **nenhuma cadeia nova entra no
inventário, porque nenhuma cadeia nova existe.**

## 4 · O selo fora da frase: a forma, e porque é que ela é a que o portão permite

O item 9 do `BRIEF-F1.1-porta-da-frente.md` desenha-a numa linha: «a manchete é
uma frase; o selo vai ao pé do número, na linha de baixo». A pergunta que ele não
responde é ONDE, na árvore, e essa é decidida por um portão que não se
enfraquece.

**`auditaSelo()` (`scripts/gate-html.mjs`) exige que o selo de um valor esteja
dentro do PAI do elemento que leva o `data-claim`**, «o selo é do VALOR e não da
secção», e é essa regra que impede um selo no fim da página de passar por porta
de um número que está no princípio. Um selo num `<p>` a seguir ao `</h1>` deixa
de estar no pai do valor, e a construção fecha.

**A saída é a que a regra permite sem se abrir:** o valor é filho DIRECTO do
`<h1>` e os selos são o último filho do mesmo `<h1>`. O pai é o mesmo, o portão
continua a exigir o que exigia, e a frase lê-se inteira antes de qualquer selo.
Na folha, `.manchete-selos` é um bloco, e o que se vê é a frase e, na linha de
baixo, os selos ao pé do número.

**Isso obrigou a um modo novo em `<Claim>`, e ele não dispensa nada.** Com
`sufixo`, o componente embrulhava o valor e o símbolo num `<span class="claim">`,
e o pai do valor passava a ser esse invólucro, que não tem selo nenhum lá dentro.
O modo `plano` rende os mesmos filhos, pela mesma ordem (valor, unidade colada,
palavra da ressalva), sem o invólucro. **Quem o usa continua a ter de pôr o selo,
e é o portão que lho cobra**: um chamador que se esqueça vê a construção fechar
com a mensagem de sempre. Foi por isso que o modo ficou em `Claim.astro` e não na
vista: a ordem dos três filhos está escrita na §11 uma vez, e uma segunda
composição fora do componente podia escrevê-la ao contrário sem nada cair.

**O `nowrap` que o invólucro dava não se perdeu, e mediu-se.**
`.cabeca-h1 .claim-value` declara-o na folha; entre o valor e o `%` não há
oportunidade de quebra nenhuma para o navegador (um símbolo colado a um número é
a classe PO da UAX #14, e a regra LB25 proíbe a quebra ali). Medido nas duas
edições a 390: **o valor rende num só rectângulo e o símbolo fica na mesma linha
do valor**, nos dois números da manchete do domínio.

**A célula que mede isto é mecânica e não uma leitura.** O texto do `<h1>` com os
selos retirados é a FRASE; o texto inteiro tem de COMEÇAR por ela. Um selo pelo
meio parte a frase e a comparação cai; um selo no fim não a parte. E a célula
exige, na mesma linha, que cada valor do livro-razão da manchete continue a ter o
seu selo: sem essa segunda metade, a maneira mais fácil de a passar era tirar as
portas, que é o contrário do que o bloco quer.

**O que a manchete ganhou e perdeu, medido:** a altura do `<h1>` do domínio a 390
passou de **190,2 px a 186,8 px** em `/dominios/…` e de **221,5 px a 218,2 px** na
edição inglesa. Encolheu, porque os selos saíram do corpo da manchete
(28 px) para uma linha própria de 13 px.

## 5 · O que NÃO entrou

**Nenhuma cadeia nova.** `git diff src/i18n/strings.mjs` não tem saída: as três
superfícies novas rendem cadeias que já estavam declaradas
(`s.dominios.eyebrow`, `s.estudos.h1`, `s.nav.dominios`), e as três chegam ao
leitor dentro de uma âncora ou de um `<span>` que a régua da voz não recolhe. O
`INVENTARIO-FRASES.md` e o `CHAVES-EN.md` ficam como estavam, e `npm run
check:voz` continua a dizer «nada por classificar».

**Nenhum número novo, e a prova conta as quatro classes** que a régua
`tests/inicio/numeros-novos.mjs` conhece, sobre as 7 238 páginas construídas dos
dois lados:

| classe | o que é | antes | depois | o que mudou |
| --- | --- | --- | --- | --- |
| `data-claim` | o valor de uma linha do livro-razão | 2 916 distintos · 31 244 | **2 916 distintos · 31 244** | **nada**: nenhum id entrou nem saiu, e nenhuma ocorrência |
| `data-prova` | uma contagem do sítio, que o portão reconta | 47 · 14 584 | **47 · 14 584** | nada |
| `data-nonledger` | contexto estrutural, com o motivo em `ledger/allowlist.yml` | 16 motivos · 64 742 | **16 motivos · 74 690** | **nenhum motivo novo**; mais 9 948 ocorrências, todas de `numeracao` |
| `data-verbatim` | uma citação transcrita | 6 chaves · 23 | **6 chaves · 23** | nada |

**As 9 948 ocorrências dizem-se por extenso, e a conta fecha ao algarismo**: são
o ordinal e o total de cada cartão das faixas que ganharam a posição, nas duas
edições. 308 concelhos × 8 cartões × 2 algarismos × 2 edições = 9 856; 9 regiões
× 2 × 2 × 2 = 72; 1 domínio × 5 × 2 × 2 = 20. Somam **9 948**. Nenhum é uma
medição de Portugal, nenhum é escrito à mão (os dois saem do comprimento da lista
que a faixa rende), e o motivo é o que o F1.1 declarou para a numeração de
secções e de instrumentos.

**E o livro-razão está intacto:** `git diff --stat -- ledger/` não tem saída.

**Nenhuma cor nova, nenhum tipo novo.** As três peças novas usam as fichas que a
casa já tem, e o contraste está medido na §8.

## 6 · Os estragos plantados (E6), vermelhos e depois verdes

`node tests/inicio/porta.mjs --vermelhos`, saída **0**. Cada planta exige três
coisas, como as do F1.1: **verde antes** (as células que ela nomeia passam sem
ela), **o HTML mudou** (a transformação dá bytes diferentes) e **vermelho depois**
(TODAS as células nomeadas caem).

| planta | células | verde antes | html mudou | vermelho depois |
| --- | --- | --- | --- | --- |
| um cartão do domínio a apontar à linha desta página | A13.pt, A13.en | sim | sim | as duas vermelhas |
| o menu sem «Domínios» | A14.pt, A14.en | sim | sim | as duas vermelhas |
| os estudos a mais de 1,5 ecrãs (a fila escondida) | A15.pt, A15.en | sim | sim | as duas vermelhas |
| o selo de volta dentro da manchete do domínio | A16.pt, A16.en | sim | sim | as duas vermelhas |

**A conferência de «o html mudou» tinha um buraco, e este bloco fechou-o.** Ela
lia sempre `/index.html` e `/en/index.html`, e a planta do selo só toca na página
do domínio: dava «html mudou: NÃO» com o estrago a funcionar. As plantas passam a
poder nomear as rotas que tocam, e por defeito continuam a ser as duas primeiras
páginas, que é o que as sete plantas do F1.1 tocam.

**A planta do menu falhou à primeira, e a razão fica escrita**: o recorte
procurava um `<li>` à volta da âncora, e a fila do menu é uma corrida de `<a>`
sem `<li>` nenhum. Uma planta que não planta nada foi vista como planta que não
planta nada (a régua imprimiu «html mudou: NÃO»), que é para isso que aquela
conferência existe.

**As sete plantas do F1.1 continuam verdes** na mesma corrida, e a lista está na
saída da régua: o selo do último cartão, a cópia de um valor, a Comissão numa
frase só, a busca sem `action`, uma unidade do mapa sem nome, a página mais alta
do que o teto, e a mobília do menu em duas filas.

## 7 · As réguas, e o que mudou em cada uma

| régua · célula | media antes | passa a medir |
| --- | --- | --- |
| `porta` A2 | teto 6 941 / 6 890 px | teto **6 991 / 6 940**, subido em exactamente 50 px, que é a altura medida da fila dos estudos, com a medição escrita na régua |
| `porta` A13 (nova) | — | o destino de cada um dos 21 cartões, cartão a cartão, contra `dominioDaLinha()`, com a âncora conferida na página de chegada |
| `porta` A14 (nova) | — | «Domínios» no menu pelo `href`, com a página a responder 200 |
| `porta` A15 (nova) | — | `/estudos` a ≤ 1 toque e ≤ 1,5 ecrãs, com as portas dentro de gavetas fechadas deitadas fora antes de medir |
| `porta` A16 (nova) | — | a manchete das quatro camadas sem texto de selo dentro da frase, e nenhum valor sem selo |
| `porta` (plantas) | o html muda nas duas primeiras páginas | o html muda nas rotas que a planta nomeia |
| `faixa` F7 | o destino de um cartão é uma âncora DESTA página | o destino é o que cada forma promete: `#id` existe aqui; `/caminho#id` responde 200 e tem o `id` lá dentro; `/caminho` responde 200 |

**Nenhuma régua foi desligada e nenhuma foi enfraquecida.** A F7 e a A2 são as
duas que mudaram de exigência, e as duas ficaram mais apertadas do que estavam: a
F7 passou a saber recusar uma porta para uma página que não existe (antes só
sabia recusar uma âncora que não existe nesta), e a A2 continua a recusar acima
de um teto medido, agora com a subida escrita e justificada.

**As réguas da casa, corridas sobre esta construção, com o código de saída de
cada uma lido de um ficheiro escrito pelo próprio comando:**

```
app 0 · areas 0 · correcoes-a 0 · faixa 0 · lista 0 · mapa-distritos 0
mapa-navegacao 0 · matriz 0 · regioes 0 · rotulo 0 · numeros-novos 0
porta 0 (32 de 32 células, 11 de 11 plantas)
dominio/pagina 0 (6 de 6 plantas) · dominio/medidas 0 · dominio/alcance 0
texto/correcoes-b 0
linha/correcoes-b 1 · texto/correcoes-c 1   (as duas eram-no na árvore de partida)
```

**As duas vermelhas foram medidas dos dois lados, e não presumidas.** Uma cópia
de cada régua com `OEDP_DIST` correu sobre a construção de partida:
`linha/correcoes-b` falha as MESMAS quatro células (`B10` em texto pt/en e em
municipio pt/en) nas duas, e `texto/correcoes-c` falha as mesmas duas (`C1` a 390
nas duas edições). Na rota que este bloco toca, a do concelho, a linha da medida
é **igual carácter a carácter** nas duas construções: «156 alvos · 80 abaixo de
44 (78 em prosa corrida, 2 na mobília, 0 fora da exceção) · texto abaixo de 12px:
0 · dentro de desenhos: 29 · pares sobrepostos: 10 · alvos dentro de outro alvo:
0». **A posição «1 de 8» não acrescentou um alvo nem uma sobreposição**, porque é
um `<span>` e não uma porta.

## 8 · O contraste das peças novas

Medido no navegador, sobre as cores computadas, nos dois temas. O teto é 4,5:1
para texto.

| peça | corpo | claro | escuro |
| --- | --- | --- | --- |
| `.cartao-destino` (o rótulo «Domínios» do cartão) | 12 px | 6,24:1 | 9,52:1 |
| `.inicio-estudos-porta` (a fila dos estudos) | 13 px | 16,39:1 | 15,38:1 |
| `.manchete-selos .src-chip` (o selo na linha de baixo) | 12 px | 6,24:1 | 9,52:1 |

**Nenhuma cadeia entrou abaixo de 12 px**, que é o chão que o achado D4 fixou e
que a régua `correcoes-a` (item A9) mede.

## 9 · O que ficou por fazer, e porquê

**1 · A linha dos pendentes não foi escrita por este ramo, e é de propósito.**
`design/especime-v3/PENDENTES-DO-DIRETOR.md` não está na lista de ficheiros do
bloco (brief §3) e é do lugar de direção, que o tem aberto na árvore principal. É
a mesma razão que o F1.1 escreveu. Não há pendente novo do diretor neste bloco: o
que ele decide continua a ser o que o F1.2 já lhe pôs à frente (o slug de cada
domínio, a medida de cabeça e as cinco da faixa, a manchete do domínio, o estado
de «Trabalho» e a frase da fronteira).

**2 · A `DECISIONS.md` §1.51 fica por emendar neste ramo, pela mesma razão.** A
fila do menu passou de onze a doze posições, e a emenda é uma linha. Fica aqui
para quem funde:

> **§1.51, segunda emenda (03.09.2026, F1.2b).** A fila do menu passa de onze a
> doze posições com «Domínios», entre «Áreas» e «Estudos». A razão é a do F1.1: a
> fila tem tantas posições quantos os índices do sítio, e as páginas dos domínios
> existem desde o F1.2 com porta só no rodapé.

**3 · A manchete da região não está na letra do brief**, e foi feita. A razão está
na §3, item 3, e a decisão de a desfazer é de uma linha (`RegiaoView.astro`).

**4 · A fila dos estudos não traz a contagem do arquivo**, e o brief permitia-a
(«um cartão ou uma fila»). Não entrou pela razão da §3: seria um algarismo a mais
numa página que este bloco tem de não fazer crescer, e a porta cumpre a medida
sozinha.

**5 · O QUE O DOZE AVO ITEM DO MENU CUSTA A PARTIR DE 1024, e é o custo que este
bloco entrega sem o poder fechar.** A fila do menu passou a não caber numa linha
com a ligação da edição ao lado, e a mobília ganhou uma fila física a partir de
1024. Medido nas duas construções, com a mesma sonda:

| largura | cabeçalho antes | cabeçalho depois | filas da barra antes → depois | filas do menu antes → depois |
| --- | --- | --- | --- | --- |
| 640 | 278,6 px | **278,6 px** | 2 → 2 | 2 → 2 |
| 768 | 380,4 px | **380,4 px** | 2 → 2 | 2 → 2 |
| 1024 | 356,8 px | **391,2 px** | 2 → 2 | **1 → 2** |
| 1280 | 323,1 px | **363,5 px** | **1 → 2** | 1 → 1 |
| 1440 | 323,1 px | **363,5 px** | **1 → 2** | 1 → 1 |

**A 390 não muda nada** (a fila vive dentro do `<details>` fechado do menu, e a
célula A11 continua a medir 62 px numa fila física), e é por isso que a medida
E4 do brief, que é a do telemóvel, fica verde. **A 1280 a página inteira sobe 41
px** (4 173 → 4 214 em `/`, 4 156 → 4 197 em `/en`), e os 41 são os 40,4 do
cabeçalho: **a fila dos estudos não custa altura nenhuma a 1280**, porque a
coluna esquerda da cabeça é mais baixa do que a coluna do mapa ao lado dela e os
50 px cabem dentro dela.

**Não há aqui um arranjo que não seja uma decisão de desenho**, e por isso este
bloco não o inventa: o menu tem doze portas porque o sítio tem doze índices, e a
fila de `.topbar` quebra quando elas não cabem. As saídas (encolher o corpo da
navegação, recolher as quatro camadas do território numa só posição, ou pôr a
ligação da edição noutro sítio) mudam a mobília de 7 222 páginas e são do
diretor. Fica medido e dito, e não escondido num relatório que só falasse do
telemóvel.

**6 · As 32 capturas do F1.2 foram reescritas por uma régua e repostas.**
`tests/dominio/medidas.mjs` fotografa as duas rotas do domínio para
`design/especime-v3/capturas/dominio-2026-09-03/` sempre que corre, e correu
nesta construção: as 32 saíram com a manchete nova e com «1 de 5» na faixa. Foram
REPOSTAS (`git checkout --`), porque aquelas capturas são o registo do que o F1.2
construiu e não deste bloco. Fica dito porque é um efeito de correr uma régua de
outro bloco, e quem correr aquela régua a seguir vai vê-lo outra vez.

**7 · As células vermelhas de outras réguas continuam vermelhas, e eram-no antes
deste bloco.** São seis: `B10` de `tests/linha/correcoes-b.mjs` em texto pt/en e
em municipio pt/en, e `C1` de `tests/texto/correcoes-c.mjs` nas duas edições. A
`C1` não corre sobre rota nenhuma que este bloco toque; a `B10` corre sobre a do
concelho, que ele toca, e por isso foi medida dos dois lados: a linha da medida é
igual carácter a carácter nas duas construções (§7). O que a faz cair na página
do concelho é a porta do cartão a sobrepor-se ao selo dele, que é o desenho que o
F1.1 decidiu e mediu («os selos ficam por cima, e quem apanha o toque é medido e
não afirmado»), e não a posição que este bloco lhe acrescentou.

## 10 · Os portões, com os códigos de saída lidos dos registos

Cada comando escreveu o seu código de saída num ficheiro à parte, lido a seguir.

```
npm run build      → 0
npm run verify     → 0
npm run typecheck  → 0
```

**O `check:mortos` apanhou um defeito deste bloco antes de o portão fechar**: a
`RegiaoView` ficou com a importação de `Frase` declarada e sem uso depois de a
manchete passar a `<Manchete>`. Está tirada, e fica dito porque é a prova de que
o portão dos identificadores mortos serve para o que foi feito.

## 11 · Onde estão as capturas e as medições

**As capturas**, em `design/especime-v3/capturas/portas-2026-09-03/`, só PNG, sem
dados pessoais: `/`, `/dominios/economia-e-financas-publicas`,
`/municipios/evora` e `/regioes/alentejo`, nas duas edições, a **390 × 664** e a
**1 280**.

**As medições**, em `design/especime-v3/medicoes/`:

| ficheiro | o que traz |
| --- | --- |
| `portas-medidas-antes.json` | as 32 células sobre a construção de partida (saída 1, 24 de 32) |
| `portas-medidas-depois.json` | as 32 células sobre esta construção (saída 0, 32 de 32, 11 de 11 plantas) |
| `portas-numeros-antes.json` | o inventário dos algarismos das quatro páginas deste bloco, na partida |
| `portas-numeros-depois.json` | o mesmo, nesta construção |

## 12 · O diff

Os ficheiros do sítio e das réguas, sem este relatório, sem as capturas e sem as
medições:

```
git diff --stat d82bc4cf -- src/ tests/
  → 12 ficheiros, 978 linhas acrescentadas e 40 tiradas
```

Um ficheiro novo (`src/components/Manchete.astro`) e onze mudados, dos quais dois
são réguas. Ao todo, com o relatório, as quatro medições e as 28 capturas, 45
ficheiros.
