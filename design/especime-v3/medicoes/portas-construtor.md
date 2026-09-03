# F1.2b · os cartões, o menu e os estudos à vista · relatório do construtor

*Ramo `portas-2026-09-03`, tirado de `origin/main` em `d82bc4cf`. Construtor
Claude Opus 5, 03.09.2026. O bloco é o F1.2b do
`design/observatorio/BRIEF-F1.2b-cartoes-menu-estudos.md`, escrito a partir do
item 9 do brief do F1.2, da entrada «Domínios» que o F1.2 deixou para depois do
F1.1, e da segunda metade da linha F1.9 do plano. Sem travessões na prosa.*

## 1 · O resultado, em cinco linhas

*Segunda passagem, 03.09.2026, depois da leitura a frio do Codex
(`design/especime-v3/critica/2026-09-03-codex-leitura-f12b-portas.md`: cinco
plantas de três classes, **5 de 5 vistas**, doze achados distintos). Quatro dos
doze eram as plantas e não estão neste ramo; conferido antes de mexer em nada, e
a §14 imprime o comando de cada um. Seis são reais e estão consertados; os outros
dois são o pacote da leitura e uma decisão do diretor. A §14 diz o que cada um
passou a ser.*

**As sete medidas de aceitação, de E1 a E7, estão verdes nas duas edições**,
medidas pela régua do F1.1 (`tests/inicio/porta.mjs`), que passou de 24 para
**34** células. **Os sete estragos plantados deste bloco foram vistos vermelhos e
depois verdes**, ao lado dos sete que o F1.1 deixou: são catorze plantas, e
nenhuma passou por planta sem plantar.

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

**O NOME ACESSÍVEL da manchete passou a ser a frase, e mais nada**, em três
camadas e não em duas: o domínio e o concelho, que o brief nomeia, e também a
região, que ficaria a única com o defeito depois de o mecanismo existir. A
primeira passagem tinha tirado o selo de dentro da frase e deixado o seu texto no
fim do nome do título; a segunda dá ao `<h1>` um `aria-labelledby` para os
pedaços da frase e lê o nome CALCULADO em Chromium e em WebKit (§4). **Nenhuma
cadeia nova entrou no sítio: nenhum commit deste bloco tocou `strings.mjs`, o
inventário ou as chaves inglesas.**

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
  --json design/especime-v3/medicoes/portas-medidas-antes.json    → saída 1 · 24 de 34
node tests/inicio/porta.mjs --vermelhos \
  --json design/especime-v3/medicoes/portas-medidas-depois.json   → saída 0 · 34 de 34 · 14 de 14 plantas
```

**As dez células vermelhas da partida são exactamente as deste bloco**, cinco por
edição: A13 (os cartões apontam todos à leitura desta página), A14 («Domínios»
não está no menu, que tem onze portas), A15 (a porta dos estudos mais acima está
a 9,14 ecrãs), A16 (o nome do título traz o texto do selo nas três camadas que
citam linhas) e A17 (o domínio, a região e o concelho sem posição nenhuma nos
cartões). As outras vinte e quatro passam dos dois lados.

**E o teto que cada lado guarda é o que o governa** (segunda passagem, Minor 11):
o JSON de partida traz `{"teto": 6941, "tetoDaPartida": 6941, "filaDosEstudos": 0}`
e o desta construção `{"teto": 6991, "tetoDaPartida": 6941, "filaDosEstudos": 50}`.
A régua imprime a conta em cada linha.

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
| E3b | o «n de N» de cada faixa com o N da própria página (segunda passagem, Major 7; a A17) | o domínio, a região e o concelho **sem posição nenhuma**: 5, 2 e 8 cartões sem ela | 1..21 de 21 na primeira página, 1..5 de 5 no domínio, 1..2 de 2 na região, 1..8 de 8 no concelho, com os dois algarismos declarados `numeracao` | ✓ |
| E5 | as réguas do F1.1 e as do sítio verdes; `build`, `verify`, `typecheck` a 0 | — | os três a 0, lidos de ficheiros escritos pelo próprio comando; a lista das réguas está na §7 | ✓ |
| E6 | uma planta por porta, vermelha e depois verde | — | as quatro vistas vermelhas e repostas verdes; a §6 imprime-as | ✓ |
| E7 pt | a manchete sem texto de selo, medida pelo NOME ACESSÍVEL do `<h1>` (segunda passagem: era pelo texto, e por prefixo) | medido na partida: o nome do domínio é «A dívida pública é 89,7 % **fonte · Quadro institucional de indicadores** …», o do concelho «Évora tem 58 567 **fonte · Évora — Economia, Investidores, Portas Abertas 2026**…», o da região idem duas vezes | as quatro camadas com o nome calculado IGUAL à frase e sem texto de selo nenhum, em **Chromium e em WebKit**; cada valor com o SEU selo (a linha certa), ao pé do número e fora da frase, medido em píxeis | ✓ |
| E7 en | o mesmo | o nome acabava em «**source · Institutional indicator framework**» | idem | ✓ |

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
extremo da mesma célula. Medido a 390 nas duas construções: o cartão mede
**163,0 px** em `/` e **181,7 px** em `/en`, com e sem o rótulo.

**E A CÉLULA MEDE-O, e não é o relatório que o afirma.** A A13 exige, em cada um
dos 21 cartões, três coisas sobre o rótulo: existe onde o destino é de fora e não
existe nos outros; tem caixa (um rótulo de largura zero não é um rótulo); e não
se sobrepõe ao selo daquele cartão, com quem partilha a fila do pé. A primeira
redação da célula contava só a presença, e a folha escrevia num comentário que a
sobreposição estava medida quando não estava: o comentário e a célula ficaram os
dois consertados, e é a célula que manda.

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

## 4 · O nome acessível da manchete, e porque é que ele se compõe de pedaços

*Reescrita na segunda passagem, 03.09.2026, sobre o achado Major 5 da leitura a
frio. A primeira redação desta secção descrevia a forma que ela tinha então, e
essa forma estava a meio caminho.*

O item 9 do `BRIEF-F1.1-porta-da-frente.md` desenha a coisa numa linha: «a
manchete é uma frase; o selo vai ao pé do número, na linha de baixo». A primeira
passagem tirou o texto do selo de DENTRO da frase e pô-lo no fim do `<h1>`. A
frase deixou de se partir ao meio, e o leitor a frio apanhou o que faltava: **o
NOME ACESSÍVEL do título continuava a acabar com «fonte · Quadro
institucional…»**, duas vezes na página do domínio e uma na de cada concelho.
Quem percorre uma página pelos títulos ouvia o nome de duas ligações colado ao
fim da manchete. A medida E7 media um PREFIXO, e um prefixo aceita o que vem
depois dele.

### O teorema que fecha a porta óbvia

A forma óbvia era um `aria-labelledby` para UM `<span>` com a frase inteira lá
dentro. Ela não é possível, e a razão é um portão que não se enfraquece.
`auditaSelo()` exige que o selo de um valor esteja dentro do PAI do elemento que
leva o `data-claim`. Daí sai um teorema de uma linha:

> se um elemento CONTÉM um valor, contém também o selo desse valor
> (o pai do valor está dentro dele, e o selo está dentro do pai).

Logo **qualquer elemento que embrulhe a frase embrulha também os selos**, e o
nome tirado dele voltaria a acabar em «fonte». O único elemento que se pode
referir sem arrastar um selo é o próprio valor.

### A forma que fica

O `<h1>` leva um `aria-labelledby` que lista, pela ordem da frase, **cada corrida
de texto, cada valor, cada símbolo de unidade e cada marca declarada**, cada um
com o seu `id`. Os selos ficam no `<h1>` (o portão exige-os lá) e fora da lista
(o nome não os quer). Os valores continuam filhos DIRETOS do título, e por isso o
pai deles é o título, que é onde os selos estão: **o portão continua a exigir
exactamente o que exigia, e não se lhe tocou.**

### O que isto custa, medido nos dois motores

O algoritmo do nome acessível junta o texto de duas referências com um espaço
pelo meio. Medido a 03.09.2026 com a mesma página de prova em Chromium e em
WebKit:

| forma | nome calculado |
| --- | --- |
| `aria-labelledby` para UMA referência | «A dívida pública é 89,7% do PIB.» |
| `aria-labelledby` para VÁRIAS | «A dívida pública é 89,7 % do PIB.» |
| sem `aria-labelledby` (o estado da primeira passagem) | «A dívida pública é 89,7% do PIB. fonte · Quadro» |

**O símbolo da unidade fica separado do número por um espaço, e só no nome.** O
texto à vista não muda um píxel, e o `%` continua colado ao número como a §11
manda. Um leitor de ecrã diz «oitenta e nove vírgula sete por cento» nos dois
casos, porque o espaço antes de um símbolo não se ouve. É o preço de o selo sair
do nome sem o portão se abrir; está medido, está escrito no cabeçalho de
`src/components/Manchete.astro`, e a célula A16 compara o nome com a frase **com
os espaços tirados dos dois lados**, para que nenhuma palavra possa cair sem ser
vista.

### O que o nome passou a ser, nas quatro camadas e nos dois motores

Medido pelo `ariaSnapshot()` do próprio `<h1>`, que é o nome que o navegador
calcula e não uma recomposição da régua:

| camada | nome acessível do `<h1>` (pt) | traz texto de selo |
| --- | --- | --- |
| país | «Portugal ultrapassa 4 limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre 9.» | não |
| domínio | «A dívida pública é 89,7 % do PIB, fora do limiar de 60 %; o saldo das administrações públicas é 0,7 % do PIB, dentro do limiar de −3 %.» | não |
| região | «O Alentejo está 23 pontos abaixo da média da UE-27. Em 2000 estava a 22 : a distância aumentou.» | não |
| concelho | «Évora tem 58 567 pessoas.» | não |

Chromium e WebKit dão o **mesmo nome**, carácter a carácter, nas quatro camadas e
nas duas edições. A célula recusa se os dois divergirem.

### O `nowrap` do valor, e a razão de o modo plano existir

`.cabeca-h1 .claim-value` declara `white-space: nowrap` na folha; entre o valor e
o `%` não há oportunidade de quebra nenhuma para o navegador (um símbolo colado a
um número é a classe PO da UAX #14, e a regra LB25 proíbe a quebra ali). Medido
nas duas edições a 390: o valor rende num só rectângulo e o símbolo fica na mesma
linha do valor. O modo `plano` de `<Claim>` existe para o valor ser filho direto
do título; **não dispensa nada**, e um chamador que se esqueça do selo vê a
construção fechar com a mensagem de sempre.

### O que a manchete ganhou e perdeu

A altura do `<h1>` do domínio a 390 passou de **190,2 px a 186,8 px** e a da
edição inglesa de **221,5 px a 218,2 px**: encolheu, porque os selos saíram do
corpo da manchete (28 px) para uma linha própria de 13 px.

## 5 · O que NÃO entrou

**Nenhuma cadeia nova, e a prova é um comando com a sua saída** (segunda
passagem, Major 8: «neither voice inventory nor its origins is supplied»). As
três superfícies novas rendem cadeias que já estavam declaradas
(`s.dominios.eyebrow`, `s.estudos.h1`, `s.nav.dominios`), e as três chegam ao
leitor dentro de uma âncora ou de um `<span>` que a régua da voz não recolhe.

```
git diff --stat 86632082 HEAD -- src/i18n/strings.mjs   design/especime-v3/INVENTARIO-FRASES.md design/especime-v3/CHAVES-EN.md   design/especime-v3/critica/REVISOES-DO-INVENTARIO.md design/especime-v3/VOZ-MARCADORES.md
  → sem saída
```

**A base da comparação é `86632082` e não `d82bc4cf`, e a razão fica dita**:
contra o ponto de partida do ramo o `strings.mjs` mostra onze linhas
acrescentadas, e elas são do F1.8 (`documentoDeslocamento`, o nome de uma caixa
que se desloca), que entrou por fusão. `git log d82bc4cf..HEAD -- src/i18n/strings.mjs`
nomeia os três commits, e nenhum é deste bloco.

**E o portão da voz confirma-o do outro lado**, sobre a construção deste ramo:

```
voz ✓ 65 marcadores · 11 exceções · 800 frases distintas, 34 133 ocorrências em
1 382 rotas · autorreferência 0 · nada por classificar · 756 linhas do inventário
com bloco (670 vivas, todas rendidas; 86 retiradas, nenhuma rendida)
```

«Nada por classificar» é a metade que importa: um bloco de texto novo numa rota
inventariada fecharia a construção. As manchetes ganharam `<span>` à volta de
cada corrida de texto para o nome acessível se compor, e o texto que a régua da
voz recolhe não mudou um carácter, que é o que este verde diz.

**Nenhum número novo, e a prova conta as quatro classes** que a régua
`tests/inicio/numeros-novos.mjs` conhece, sobre as 7 238 páginas construídas dos
dois lados. **A auditoria ficou guardada** (segunda passagem, Major 8: os dois
JSON da primeira passagem cobriam quatro páginas e não sustentavam a conta das
9 948), em `design/especime-v3/medicoes/portas-numeros-sitio-{antes,depois}.json`:

| classe | o que é | antes | depois | o que mudou |
| --- | --- | --- | --- | --- |
| `data-claim` | o valor de uma linha do livro-razão | 2 916 distintos · 31 244 | **2 916 distintos · 31 244** | **nada**: o resumo sha256 da lista ordenada das chaves é o MESMO dos dois lados, ou seja nenhum id entrou nem saiu |
| `data-prova` | uma contagem do sítio, que o portão reconta | 47 · 14 584 | **47 · 14 584** | nada; mesmo resumo |
| `data-nonledger` | contexto estrutural, com o motivo em `ledger/allowlist.yml` | 16 motivos · 64 742 | **16 motivos · 74 690** | **nenhum motivo novo** (mesmo resumo); `numeracao` passa de **124 a 10 072**, mais 9 948 |
| `data-verbatim` | uma citação transcrita | 6 chaves · 23 | **6 chaves · 23** | nada; mesmo resumo |

**O ficheiro guardado é pequeno de propósito**: traz a contagem de cada classe, o
mapa motivo→ocorrências onde ele é pequeno (os 16 motivos, as 47 chaves da prova,
as 6 transcrições) e um **resumo sha256 da lista ordenada das chaves** de cada
classe. É o resumo que sustenta «nenhum id entrou nem saiu» sem pôr os 2 916
identificadores do livro-razão dentro do relatório.

**As 9 948 ocorrências dizem-se por extenso, e a conta fecha ao algarismo** (e
agora contra o ficheiro guardado, e não contra a memória do relatório): são
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
| **a manchete do domínio com dois valores e um selo só** (segunda passagem, Major 6) | A16.pt, A16.en | sim | sim | as duas vermelhas |
| **um selo da manchete a abrir a linha do outro valor** (segunda passagem, Major 6) | A16.pt, A16.en | sim | sim | as duas vermelhas |
| **a faixa de uma região a dizer «de 21»** (segunda passagem, Major 7) | A17.pt, A17.en | sim | sim | as duas vermelhas |

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
do que o teto, e a mobília do menu em duas filas. **São catorze ao todo**, sete do
F1.1 e sete deste bloco.

**AS TRÊS PLANTAS DA SEGUNDA PASSAGEM SÃO OS CASOS QUE A LEITURA A FRIO NOMEOU**,
e não variações do que já caía. A do selo a menos e a do selo trocado são as duas
metades do Major 6 («one remaining or wrongly targeted seal can satisfy every
value»): na primeira o nome não muda, a frase não muda, e o saldo das
administrações públicas fica sem porta; na segunda a contagem de selos continua
certa e o que está errado é o destino. A da faixa da região é o Major 7 à letra
(«a region showing "1 de 21" with both numerals still marked `numeracao` would
pass»): o ordinal fica certo, a marca fica declarada, e o que passa a estar errado
é o N.

## 7 · As réguas, e o que mudou em cada uma

| régua · célula | media antes | passa a medir |
| --- | --- | --- |
| `porta` A2 | teto 6 941 / 6 890 px, escrito | o teto passa a ser uma REGRA e não um segundo número (Minor 11): teto da partida **mais a altura da fila dos estudos medida na construção que se está a ler**. Na árvore de partida a fila não existe e o teto é 6 941 / 6 890; nesta é 6 991 / 6 940 |
| `porta` A13 (nova) | — | o destino de cada um dos 21 cartões, cartão a cartão, contra `dominioDaLinha()`, com a âncora conferida na página de chegada; e o rótulo do destino em cada cartão que aponta para fora e em nenhum dos outros, com caixa, sem se sobrepor ao selo daquele cartão, **e com a PALAVRA comparada com `dominios.eyebrow` da edição** (Minor 12) |
| `porta` A14 (nova) | — | «Domínios» no menu pelo `href`, com a página a responder 200, **e pela PALAVRA**: o texto do item comparado com `nav.dominios` da edição, lido de `strings.mjs`, com a gaveta aberta para a etiqueta ter caixa (Minor 12) |
| `porta` A15 (nova) | — | `/estudos` a ≤ 1 toque e ≤ 1,5 ecrãs, com as portas dentro de gavetas fechadas deitadas fora antes de medir |
| `porta` A16 (nova, reescrita na segunda passagem) | media um PREFIXO do texto, e «o pai deste valor tem algum selo» | o NOME ACESSÍVEL calculado do `<h1>`, lido por `ariaSnapshot()` em **Chromium e WebKit**, igual à frase e sem texto de selo; e, por valor, **um** selo para a linha DAQUELE valor, sem cruzar nenhum pedaço da frase e na linha de baixo (Major 5 e Major 6) |
| `porta` A17 (nova, segunda passagem) | — | o «n de N» das quatro faixas: uma posição por cartão, o total igual ao número de cartões DAQUELA página, o ordinal de 1 a N pela ordem do documento, e os dois algarismos com o motivo `numeracao` (Major 7) |
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
porta 0 (34 de 34 células, 14 de 14 plantas)
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
bloco entrega sem o poder fechar.** *(A leitura a frio nomeia-o Major 9; a
triagem do lugar de direção manda-o para os pendentes, porque é uma decisão de
forma do diretor. Fica medido aqui e não consertado à revelia.)* A fila do menu passou a não caber numa linha
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

**As capturas**, em `design/especime-v3/capturas/portas-2026-09-03/`, **30
ficheiros**, só PNG, sem dados pessoais: `/`,
`/dominios/economia-e-financas-publicas`, `/municipios/evora` e
`/regioes/alentejo`, nas duas edições, a **390 × 664** e a **1 280**. Mais duas
(`*-inicio-390x664-fila-dos-estudos.png`) com a página descida até à fila dos
estudos: a 390 × 664 ela começa a 662,7 px, ou seja mesmo por baixo da dobra, e
não se via em nenhuma das outras.

**As medições**, em `design/especime-v3/medicoes/`:

| ficheiro | o que traz |
| --- | --- |
| `portas-medidas-antes.json` | as 32 células sobre a construção de partida (saída 1, 24 de 32) |
| `portas-medidas-depois.json` | as 32 células sobre esta construção (saída 0, 32 de 32, 11 de 11 plantas) |
| `portas-numeros-antes.json` | o inventário dos algarismos das quatro páginas deste bloco, na partida |
| `portas-numeros-depois.json` | o mesmo, nesta construção |
| `portas-numeros-sitio-antes.json` | a auditoria das **7 238 páginas** na partida, condensada: contagens, motivos e o resumo sha256 das chaves de cada classe |
| `portas-numeros-sitio-depois.json` | o mesmo, nesta construção (segunda passagem, Major 8) |

## 12 · A fusão com o `main`, e o que ela custou

O `main` andou enquanto este bloco se construía: o F1.8 (a moldura à volta do
documento alojado) fundiu-se em `86632082`. O ramo foi fundido com ele antes de
fechar, e a fusão **não teve um conflito**: os ficheiros que os dois blocos tocam
não se cruzam. O que entrou do outro lado e que muda a corrida deste:

* `package.json` ganha `check:moldura` dentro do `verify`, e por isso o `verify`
  deste ramo passa a abrir um navegador;
* `.github/workflows/portao.yml` ganha um passo que instala o Chromium do
  Playwright, sem o qual aquela régua não corre no anfitrião limpo;
* `scripts/gate-html.mjs` ganha uma conferência do `<h1>` escondido, e ela vive
  DENTRO de `verificaDocumento()`, ou seja só nas páginas de documento alojado.
  **Não toca na manchete deste bloco**, e isso foi lido antes de fundir e não
  presumido.

**Os três portões voltaram a correr na árvore fundida**, e não só antes da fusão,
e as sete medidas deste bloco foram medidas outra vez sobre a construção dela:

```
npm run build      → 0
npm run verify     → 0     (já com o check:moldura do F1.8, que abre um navegador)
npm run typecheck  → 0
node tests/inicio/porta.mjs --vermelhos → 0 · 32 de 32 células · 11 de 11 plantas
```

**Nenhuma medida mexeu com a fusão**: a altura de `/` a 390 continua a 6 959 px e
a de `/en` a 6 911; a porta dos estudos continua a 662,7 px (650,1 na inglesa); os
três cartões continuam a apontar para as três âncoras do domínio; e as quatro
manchetes continuam com o texto inteiro a começar pela frase.

## 13 · O diff

Os ficheiros do sítio e das réguas, sem este relatório, sem as capturas e sem as
medições:

```
git diff --stat d82bc4cf HEAD -- <os doze ficheiros do sítio e das réguas>
  → 12 ficheiros, 1 008 linhas acrescentadas e 40 tiradas
```

Um ficheiro novo (`src/components/Manchete.astro`) e onze mudados, dos quais dois
são réguas. Ao todo, com o relatório, as quatro medições e as 30 capturas, **47
ficheiros** deste bloco. O `git diff --name-only d82bc4cf HEAD` conta 49 fora dos
ficheiros do F1.8, e os dois a mais são a fusão: `package.json` e
`package-lock.json` chegam do outro lado.

## 14 · Segunda passagem, depois da leitura a frio do Codex (03.09.2026)

*A leitura está em `design/especime-v3/critica/2026-09-03-codex-leitura-f12b-portas.md`:
Codex `gpt-5.6-sol`, xhigh, sobre um pacote com cinco plantas de três classes,
**cinco de cinco vistas**, doze achados distintos. A triagem do lugar de direção
está no cabeçalho daquele ficheiro.*

### As quatro plantas, e a prova de que não estão neste ramo

Quatro dos doze achados são as plantas que o pacote levava. Conferidos neste ramo
antes de mexer em nada, cada um com o seu comando:

| planta | o achado que ela gerou | conferido aqui |
| --- | --- | --- |
| P1a e P1b · `dominioDaLinha()` a exigir a linha principal **e** uma secundária (`&&`) | Blocking 1 | o ramo tem `\|\|`: `m.claim === id \|\| (m.claims ?? []).some(…)`, e a A13 conta 3 cartões para o domínio |
| P4 · a entrada do menu a apontar a `/dominio` | Blocking 2 | `grep -c 'href="/dominio"' dist/index.html` → **0**; `href="/dominios"` está lá |
| P2 · a régua a aceitar os estudos a 9,5 ecrãs | Blocking 3 | `ALTURA_DA_DOBRA = 1.5`, uma vez só no ficheiro |
| P3 · o relatório a dizer 6 627 px na prosa | Minor 10 | `grep -c '6 627'` → **0**; `grep -c '662,7'` → 3 |

**Nenhum é real neste ramo.**

### Os seis achados reais, e o que cada um passou a ser

**Major 5 · o nome acessível ainda acabava com as palavras do selo.** Real, e era
o que o bloco devia ter fechado. A §4 foi reescrita inteira: o `<h1>` ganha um
`aria-labelledby` que lista os pedaços da frase, os selos ficam dentro do título
(o portão exige-o) e fora da lista (o nome não os quer), e a A16 passa a ler o
nome CALCULADO por `ariaSnapshot()` em Chromium e em WebKit, nas quatro camadas e
nas duas edições. O teorema que fecha a porta óbvia (um `aria-labelledby` para um
`<span>` com a frase toda) está escrito na §4 e no cabeçalho de
`src/components/Manchete.astro`, e o preço medido (um espaço antes do símbolo da
unidade, no nome e não à vista) também.

**Major 6 · a A16 não provava que cada valor tinha a sua porta.** Real. A célula
perguntava se o PAI de um valor continha ALGUM `.src-chip`, e como os valores
partilham o `<h1>` um selo satisfazia todos. Passa a exigir, por valor, **um**
selo cujo `href` é o caminho da linha DAQUELE valor, e a medir onde ele está: não
cruza nenhum pedaço da frase, e fica na linha de baixo a menos de um ecrã
pequeno. **Duas plantas novas** provam as duas metades: a manchete do domínio com
dois valores e um selo só, e um selo a abrir a linha do outro valor.

**Major 7 · nenhuma régua lia o «n de N».** Real, e era o único item deste bloco
sem régua. Entra a **A17**: nas quatro camadas e nas duas edições, uma posição por
cartão, o total igual ao número de cartões DAQUELA página (contado no HTML dela e
não escrito na régua), o ordinal a correr de 1 a N pela ordem do documento, e os
dois algarismos com o motivo `numeracao`. A planta é a do achado, à letra: a faixa
de uma região a dizer «de 21», com o ordinal certo e a marca declarada.

**Major 8 · a prova da voz e dos números estava incompleta.** Real. A auditoria
das 7 238 páginas ficou guardada, condensada, nos dois ficheiros
`portas-numeros-sitio-{antes,depois}.json`, com o resumo sha256 da lista ordenada
das chaves de cada classe: é ele que sustenta «nenhum id entrou nem saiu» sem pôr
o livro-razão dentro do relatório, e é nele que se lê `numeracao` a passar de 124
a 10 072. A prova da voz passou a ser um comando com a sua saída, contra
`86632082`, com a nota de que as onze linhas que o `strings.mjs` mostra contra o
ponto de partida do ramo são do F1.8 e entraram por fusão. Ver a §5.

**Minor 11 · o JSON de partida guardava o teto novo.** Real, e o conserto é mais
do que o achado pedia: em vez de escrever o teto antigo a mais um sítio, **o teto
passou a ser uma regra** (o teto da partida mais a altura da fila dos estudos
medida na construção que se está a ler). Na árvore de partida a fila não existe, a
parcela é 0 e o JSON guarda 6 941 / 6 890; nesta guarda 6 991 / 6 940. Deixou de
haver um segundo número escrito à mão, e a régua diz a conta em cada linha que
imprime.

**Minor 12 · as réguas do menu e do rótulo não conferiam as palavras.** Real. A
A14 compara o texto do item do menu com `nav.dominios` da edição, lido de
`src/i18n/strings.mjs` e nunca escrito na régua, **com a gaveta aberta** (a fila
vive num `<details>` fechado abaixo de 640 px, e o conteúdo de uma gaveta fechada
não tem caixa: a primeira redação desta conferência media a gaveta e não a
etiqueta, e disse-o). A A13 compara o rótulo de destino de cada cartão com
`dominios.eyebrow` da edição.

### Os dois achados sem ação, e porquê

**Major 4 · o pacote não continha as páginas inglesas.** É uma limitação do
pacote da leitura, dita pela própria triagem. As páginas existem e estão medidas:
a A13, a A16 e a A17 correm sobre `/en/domains/…`, `/en/municipalities/evora` e
`/en/regions/alentejo` em cada corrida, e o JSON das medições traz as suas
leituras. Não há aqui nada para consertar no sítio.

**Major 9 · a fila a mais do cabeçalho a partir de 1024.** É a decisão de forma
do diretor, já nos pendentes. A medição está na §9 (5), dos dois lados e às cinco
larguras, e este bloco não a inventa.

### O que a segunda passagem custou à página

**Nada, e está medido.** A altura de `/` a 390 continua a 6 959 px e a de `/en` a
6 911; o teto continua a 6 991 / 6 940 pela regra nova; a porta dos estudos
continua a 662,7 px e a 650,1 px. A manchete não mudou de texto nem de forma
visível: o que mudou foi a árvore por dentro (cada corrida de texto ganhou um
`<span>` com `id`) e o `aria-labelledby` do título.
