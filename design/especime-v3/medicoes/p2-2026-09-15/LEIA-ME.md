# Bloco P2 · O número e o seu sentido: o cartão de uma medida

*O relatório do construtor (Claude Opus 5), na forma do §3 do brief
`design/observatorio/BRIEF-P2-o-numero-e-o-seu-sentido.md`. Worktree
`.claude/worktrees/cartao-2026-09-15`, ramo `cartao-2026-09-15`, sobre
`2ab86986`. Prosa em português, sem travessões.*

---

## 0 · O que o diretor tem de olhar primeiro nas capturas

**Duas coisas, e as duas se veem nas capturas antes de se lerem aqui.**

**(1) Quarenta e quatro cartões portugueses e noventa ingleses ficaram sem nome.**
É a consequência medida do item 4: um cartão cujo único nome era o título do
documento da fonte, na língua da fonte, passa a não ter nome nenhum. Em português
perdem-se vinte nomes (quinze títulos de documento e cinco rótulos da fonte, todos
em inglês); **em inglês perdem-se sessenta e seis** (cinquenta e seis títulos e dez
rótulos, todos em português). A regra do item 4 é simétrica, e é a do brief F1.15
§1.3 («nas páginas portuguesas, 0 títulos de documento à vista; nas inglesas, o
mesmo com os títulos portugueses»), mas o custo dela na edição inglesa é três
vezes o da portuguesa, e isso não estava escrito em lado nenhum antes de ser
medido. **O `nomes.json` que chegou às 19:43 não fecha este buraco**: ele traz o
nome oficial do INE e da PORDATA para o RECIBO (a norma §1.5), e para trinta e
duas medidas, não para as cento e trinta e uma. **É decisão do diretor**, nas
capturas: ou fica assim até o motor exportar um nome de cartão por linha, ou o
cartão volta a mostrar o nome na língua da fonte com a marca `lang` enquanto
espera.

**(2) O cartão da habitação acabou com mais texto do que começou: 13 nós para
19.** A régua é a resposta à pergunta dele («17,6 % de quê, e é muito ou pouco»),
e custa treze nós de texto e duas marcas da fonte a mais por cartão: «2024: 9,1 ·
União Europeia: 5,5 · acima do valor de referência, 9 %». O recibo que saiu valia
sete. O §5.1 da norma manda justificar linha a linha um bloco de palavras que
acabe com mais texto do que começou, e o §4 da tabela das cadeias fá-lo. Onde não
há régua nem frase, que é a maior parte dos 131 cartões, a contagem desceu de 9,9
para 6,6. **Se a régua for a mais, é ali que se corta**, e é decisão dele.

---

## 1 · A tabela do mandato, com a medida de cada item

| # | o que o brief pede | a medida | o resultado |
| --- | --- | --- | --- |
| 1 | o cartão com cinco coisas e nada mais | as cinco coisas e só elas em 100 % dos cartões das duas edições; «Publicado por», «Documento», «Lido na fonte a», «Dados de» a 0; a chave a 0 no texto visível | **cumprido.** 262 cartões (131 pt, 131 en), 0 blocos a mais, 0 rótulos de recibo, 0 chaves. Medido pela régua nova (`tests/cartao/cartao.mjs`, células K1, K2, K3), no `verify` |
| 2 | o recibo ganha as duas datas da norma §2.5 e o nome oficial com a sua origem | a linha da próxima conferência em 100 % dos recibos com entrada no calendário | **cumprido, as duas metades.** As cinco linhas do livro-razão com acontecimento datado no calendário (`divida-publica-2025`, `evora-concentracao-vab4-2024`, `evora-empresas-2024`, `evora-vab-empresarial-2024`, `portugal-concentracao-vab4-2024`) rendem «Próxima conferência» nas duas edições, com a porta para o acontecimento na agenda: 5 de 5. E com o `nomes.json` que chegou às 19:43, o recibo ganhou o nome oficial: **17 recibos por edição com «Nome na PORDATA» e 9 com «Nome no INE»**, cada um com a porta para o endereço e a data a que o motor o leu. São os que o motor marca como a MESMA medida; os oito marcados «medida vizinha» e os sete por confirmar não chegam ao leitor |
| 3 | a linha do tipo sai; o índice di-lo uma vez; a legenda da marca sai das páginas do leitor | «Governo Constitucional» a 1 no `dist/` de cada edição; a legenda a 0 fora do Método | **cumprido o primeiro, não cumprido à letra o segundo.** «Governo Constitucional» **1** em português e «Constitutional Government» **1** em inglês, os dois no índice das áreas (eram 9 e 9). A legenda da marca passa de **319 rotas por edição para 1** (o índice do livro-razão) e não para 0: as duas razões estão no §3 da tabela das cadeias, e as duas são mecânicas (o Método é texto governado e a decisão 1 da emenda de 15.09 à §1.108 diz quando ele se toca; `design:feixe` compõe o cartão do sistema de desenho lendo `p.marca-legenda` daquela rota, e sem ela o `verify` fecha) |
| 4 | nenhum título de documento da fonte à vista na edição portuguesa | zero cadeias em inglês nos cartões da edição portuguesa, medido por uma régua nova sobre o `dist/` | **cumprido, com o custo medido no §0.** 0 elementos com `lang` declarado diferente do da página, nos 262 cartões, fora de duas exceções escritas na régua (a unidade que fica em português numa página inglesa, 3 ocorrências, pela I92; o marcador da casa, 8, pela `IDENTIDADE.md` §6). Célula K4 |
| 5 | «acima / abaixo / dentro do valor de referência», «sem valor de referência» | «limiar» a 0 no texto visível do `dist/` fora do Método | **cumprido nos cartões deste bloco; não cumprido no `dist/` inteiro, e a razão é a divisão do trabalho.** Nos 262 cartões a palavra está a 0 (célula K7), e as três cadeias novas usam **as mesmas chaves que o bloco P1 escreve** (`estado.acima`, `.abaixo`, `.entre`). As restantes cadeias com «limiar» (o cartão da faixa, a peça, a leitura breve, os títulos dos painéis) são a metade da troca que o P1 faz no ramo `porta-2026-09-15`, e duplicá-las aqui era garantir um conflito de fusão entre dois lados com o mesmo texto. A medida cumpre-se na fusão dos dois ramos |
| 1d | a régua: o período anterior, a União e a palavra contra o valor de referência, tudo lido de linhas | a régua só onde a linha existe; nenhum valor à mão | **cumprido, com as 59 linhas que o motor selou às 19:43.** Por edição: **45 cartões com régua**, dos quais 45 com o período anterior, 23 com o agregado da União e 7 com a palavra contra o valor de referência. Nenhum valor é escrito pela casa: cada um é um `<Claim>` com a marca da fonte da sua linha. As cinco medidas sem agregado europeu desenham-se sem ele e não escrevem a ausência por palavras (§0.2 do brief). A célula K9 compara o valor de referência nas suas duas testemunhas, a declaração de `figuras.mjs` e a leitura da página da Comissão: **13 de 13 batem certo** |
| 6 | um só gabarito; a faixa deixa de deslizar acima de 768; o mapa preenche a coluna a partir de 1024 | as capturas nas cinco larguras sem saltos, medidas por uma régua que compara as posições dos números e dos títulos entre cartões | **cumprido o gabarito e a faixa; não feito o mapa.** A régua é `gabarito-do-cartao.mjs`, 30 medições (3 rotas × 2 edições × 5 larguras). O espalhamento das posições do valor e do título dentro de cada cartão: **0 px em 14 das 30** (eram 2 das 30) e **máximo 17,6 px** (era 38,4). A faixa deixa de deslizar a partir de 768 px em todas as rotas medidas (deslizava em todas as larguras). Transbordo horizontal 0 nas cinco larguras, antes e depois. **O mapa não foi tocado**: é do bloco P1, que corre em paralelo e tem `MapaRespira.astro` e `mapa.css` abertos |
| 7 | uma régua nova para o cartão, com cinco plantas a morder | as plantas a morder, com a saída no relatório | **cumprido, com oito e não cinco.** `tests/cartao/cartao.mjs --prova` monta um `dist/` de mentira com oito estragos plantados, um por célula, e exige que os oito mordam e que o cartão são não dê nenhum vermelho. Corre no `verify` (`npm run check:cartao`). A saída está no §5 |
| 8 | as capturas e a tabela das cadeias | completas | **cumprido.** 80 capturas (4 rotas × 2 edições × 5 larguras × antes/depois) em `design/especime-v3/capturas/p2-2026-09-15/`; a tabela em `cadeias-antes-depois.md`, ao lado deste ficheiro |

---

## 2 · A contagem dos pedaços de texto por cartão, antes e depois

A contagem é de **nós de texto à vista**, por cartão, depois de tirar o que só um
leitor de ecrã ouve (`.vh` e `aria-hidden`). Medida sobre o `dist/` de `2ab86986`
e sobre o da cabeça final, com o mesmo guião.

| família de página | edição | cartões | antes | depois, sem a régua | depois, com a régua |
| --- | --- | --- | --- | --- | --- |
| área da habitação | pt | 3 | 12,3 (13, 13, 11) | 8,3 (11, 9, 5) | **16,3** (19, 17, 13) |
| área da habitação | en | 3 | 12,3 (13, 13, 11) | 8,7 (11, 9, 6) | **16,7** (19, 17, 14) |
| área da economia | pt | 88 | 9,9 | 5,6 | **6,6** |
| área da economia | en | 88 | 10,0 | 5,1 | **6,2** |

A coluna do meio é a construção das 19:30 UTC, antes de as linhas do motor
chegarem; a da direita é a cabeça final. A justificação linha a linha, que o §5.1
da norma manda escrever para um bloco que acabe com mais texto do que começou,
está no §4 da tabela das cadeias.

**As cinco coisas não são cinco nós de texto**, e a diferença está dita para não
parecer uma conta que não fecha: o cartão tem no máximo quatro BLOCOS (o nome, a
linha do valor, a frase, a régua) mais a marca da fonte, que vive dentro da linha
do valor porque `auditaSelo()` procura o selo no PAI do elemento do valor e um
invólucro entre os dois partia a conferência. A linha do valor tem quatro nós (o
valor, a palavra da marca, a unidade, a preposição e o período) e a régua tem
nove quando tem as três comparações, e é daí que vêm os dezanove nós do cartão dos
preços da habitação.

O cartão que o diretor leu, pedaço a pedaço, está no §4 da tabela das cadeias.

**As outras contagens do cartão**, medidas sobre a cabeça final:

| | pt | en |
| --- | --- | --- |
| cartões | 131 | 131 |
| com nome | 87 (eram 107) | 41 (eram 107) |
| com a frase do que medem | 15 | 15 |
| com régua | 45 | 45 |
| com o período anterior | 45 | 45 |
| com o agregado da União | 23 | 23 |
| com a palavra contra o valor de referência | 7 | 7 |

---

## 3 · As cadeias mudadas ou retiradas

Estão em `cadeias-antes-depois.md`, ao lado deste ficheiro: nove cadeias novas,
uma retirada da rendição, sete que não mudam de texto e mudam de lugar, e a lista
do que este bloco não tocou de propósito.

**Os textos governados não foram tocados**, e os shas dizem-no: `metodo.mjs`
`92b0fbdb…`, `sobre.mjs` `0507f5f3…`, `politica-ia.mjs` `821d62c2…`, os mesmos
antes e depois (nenhum dos três aparece no `git status` do ramo).

---

## 4 · O gabarito do cartão, medido

`node design/especime-v3/medicoes/p2-2026-09-15/gabarito-do-cartao.mjs`, com a
saída em `gabarito-antes.json` e `gabarito-depois.json`. O número é o
**espalhamento**, em píxeis, das posições do valor e do título **dentro de cada
cartão**: é essa distância que o olho lê como uma serra quando varia de cartão
para cartão.

| rota | edição | 390 | 768 | 1024 | 1280 | 1600 |
| --- | --- | --- | --- | --- | --- | --- |
| primeira página | pt | 38,4 → **17,6** | 36 → **15,5** | 36 → **0** | 36 → **0** | 36 → **0** |
| primeira página | en | 19,2 → **1,4** | 17,6 → **0** | 17,6 → **0** | 17,6 → **0** | 17,6 → **0** |
| domínio | pt | 38,4 → **17,6** | 36 → **15,5** | 17,6 → **15,5** | 17,6 → **15,5** | 17,6 → **15,5** |
| domínio | en | 38,4 → **17,6** | 36 → **15,5** | 36 → **15,5** | 36 → **15,5** | 36 → **15,5** |
| União Europeia | pt | 19,2 → **1,4** | 17,6 → **0** | 17,6 → **0** | 0 → **0** | 0 → **0** |
| União Europeia | en | 19,2 → **1,4** | 17,6 → **0** | 17,6 → **0** | 17,6 → **15,5** | 17,6 → **15,5** |

**Onde não é 0, é exactamente uma linha (15,5 px), e a causa está medida e não
inferida.** A fila do estado reserva duas linhas; as que não alinham ocupam três.
São duas famílias:

* as duas palavras de estado mais longas do sítio, «dentro do limiar do Pacto de
  Estabilidade e Crescimento» (54 caracteres) e «fora do limiar recomendado pelo
  Conselho da UE» (46), na página do domínio;
* na página europeia inglesa, «within the Commission threshold» (30 caracteres)
  ocupa **duas** linhas nos cartões 5 a 9 e **três** nos cartões 10 a 13, com a
  mesma cadeia e a mesma largura: a fila do estado carrega também o contador da
  posição, e um ordinal de dois algarismos muda a quebra.

**O que isto quer dizer para a fusão, dito sem prometer.** As cadeias que o bloco
P1 põe no lugar daquelas duas têm 28 a 30 caracteres. As de 26 e 28 que hoje
cabem em duas linhas foram medidas; a de 30 **não cabe** em duas nos cartões com
ordinal de dois algarismos, e isso também foi medido, na edição inglesa. Ou a
reserva sobe a três linhas (e todos os cartões crescem uma linha), ou o contador
da posição sai da fila do estado, ou o cartão alarga. **São três desenhos
diferentes e decide-se em capturas com o diretor, depois de os dois ramos
estarem juntos**, porque antes disso a medição é sobre o texto que vai mudar.

---

## 5 · As saídas das réguas

### A régua nova do bloco (`npm run check:cartao`, dentro do `verify`)

```
  prova: 8 estragos plantados, 8 vistos; o cartão são a 0; a régua com as duas
  comparações de uma medida, a série bienal, a ausência da linha da União e uma
  chave que não se inventa; as duas testemunhas do valor de referência com um par
  bom e dois maus

  A RÉGUA DO CARTÃO DE UMA MEDIDA · bloco P2

    páginas lidas                    7358
    cartões                          262 (131 pt, 131 en)
    com nome                         128
    sem nome (à espera do motor)     134
    com a frase do que medem         30
    com régua                        90
    «Governo Constitucional»         1 pt · 1 en
    legenda da marca                 2 página(s)
    unidade na outra língua          3 (a exceção da I92)
    o marcador em português          8 (a exceção da IDENTIDADE §6)
    valores de referência, as duas testemunhas comparadas  13
    medidas com nome oficial no recibo                    11
    ficheiros do motor               referencias.json sim · nomes.json sim

  ✓ as cinco coisas e só elas, em todos os cartões das duas edições
```

**As oito plantas, e o que cada uma prova:** um bloco a mais no cartão (K1); um
rótulo de recibo dentro dele (K2); a chave no texto visível (K3); um título de
documento em inglês numa página portuguesa (K4); um algarismo na régua sem linha
e sem motivo declarado (K5); a frase mudada (K6); a palavra «limiar» (K7); a
legenda da marca numa página de área (K8). O cartão são, no mesmo `dist/` de
mentira, dá 0 vermelhos, que é a outra metade da prova: uma régua que grita por
tudo também diz sempre alguma coisa.

**As linhas do enquadramento provam-se com linhas verdadeiras**, e nunca com uma
linha falsa, como o §0.2 do brief manda. A prova exerce quatro casos, os quatro
sobre o livro-razão a sério: as duas comparações de `precos-da-habitacao-2025`; a
série BIENAL, `competencias-digitais-2025`, cujo período anterior é
`competencias-digitais-2023` e não `-2024`; a ausência da linha da União em
`saldo-da-balanca-corrente-2025`; e uma medida cujo período não é um ano
(`evora-desemprego-registado-2025-12`), para a qual a régua não inventa chave
nenhuma. **A prova tem guardas nos dois sentidos**: se a linha da União daquela
medida passar a existir, ou se a régua passar a calcular o período anterior em vez
de o procurar, a prova falha e diz o que mudar, em vez de passar calada. Foi ela
que apanhou, às 19:45, que a régua calculava o ano anterior: às 19:30 o negativo
era «a linha `precos-da-habitacao-2024` não existe», e às 19:45 ela existia, e a
prova disse-o.

**A célula K9 prova-se com pares escritos na prova**, e não com um estrago num
ficheiro do motor: o que se prova é a comparação, e um ficheiro de dados do motor
não se estraga para testar o sítio. Três pares: um com dois números diferentes, um
com dois sentidos diferentes, e um bom («+/-3% (EA)» contra a banda declarada),
que também prova que a leitura expande as duas pontas de um «+/-n» que uma
expressão de números lia como um número só.

### As réguas de hoje que mediam o cartão antigo

**Nenhuma refeita, e a razão é que nenhuma mede o cartão antigo.** Procurou-se
`livro-item` em `scripts/` e em `tests/`: as cinco ocorrências são de
`tests/linha/recibo.mjs`, `tests/livro/indice.mjs`, `tests/linha/correcoes-b.mjs`
e `tests/municipio/concelhos.mjs`, e as quatro medem os DOIS ÍNDICES DO
LIVRO-RAZÃO e a lista das linhas de um concelho, que continuam a render
`ItemDoLivro` e não mudaram um byte. O que mede a página de uma área é
`scripts/check-areas.mjs` e o `gate-html.mjs`, pela marca `data-area-peca`, que o
cartão novo continua a levar: as duas continuam verdes sem uma linha mudada.

---

## 6 · Os commits e a cabeça final

| | |
| --- | --- |
| `472f563e` | O brief do bloco, o guião das capturas e as quarenta capturas de antes |
| `7c25c13c` | A máquina do enquadramento, a escada do nome do cartão e a próxima conferência de uma linha |
| `b84d47f8` | As cadeias do cartão: a preposição, as três palavras da régua e a segunda data |
| `a7549270` | O cartão de uma medida: cinco coisas, e nada mais |
| `9a275352` | A orgânica dita uma vez, e a legenda da marca fora das listas |
| `0469a6e7` | O recibo ganha a segunda data: quando a fonte volta a publicar |
| `2abfc41c` | O gabarito do cartão da faixa, e a faixa que deixa de deslizar acima de 768 px |
| `06e21f54` | A régua do cartão, com oito estragos plantados, entra no verify |
| `5bafae14` | O inventário das frases e o registo das revisões |
| `53b706c6` | As linhas do enquadramento e os dois ficheiros do motor |
| `cebbcd72` | A régua lê as linhas do motor, e uma linha que é régua de outra não é uma medida |
| `97ac42f3` | O recibo ganha o nome oficial da medida, com a origem de cada um |
| `0ffd15f7` | A régua do bloco compara as duas testemunhas do valor de referência |
| `aa84b85e` | O inventário com as linhas do motor, e a contagem do livro-razão datada |
| `45b2b561` | A catraca da L1 sobe 118, que são as 59 linhas novas vezes duas edições |
| `4eb57d98` | O tecto do cartão do sistema de desenho sobe, porque o livro-razão cresceu |
| (o último) | O relatório, a tabela das cadeias, as medições e as quarenta capturas de depois |

**A cabeça final está no §7**, com os códigos dos portões.

**As nove primeiras são de antes de as linhas do motor chegarem**, às 19:43 UTC; as
sete seguintes são o que elas obrigaram a mudar. Ficam separadas porque foram
assim: o que a chegada das linhas partiu, e o que ela destravou, lê-se melhor em
commits do que numa reescrita.

---

## 7 · Os três portões

Cada comando no seu, separados por `;`, com o código de saída escrito num
ficheiro e lido de lá. A razão está escrita na §1.108: «a primeira corrida dos
portões deu `build=1` sem o build ter corrido (um glob sem par abortou a cadeia em
zsh), e só a segunda, com os códigos lidos dos ficheiros, conta.»

Os três ficheiros ficam em `design/especime-v3/medicoes/p2-2026-09-15/portoes/`:
`build.code`, `verify.code` e `typecheck.code`. **Os três dizem 0**, e os três
foram escritos pela corrida que correu sobre a cabeça do código
(`4eb57d98`, «O tecto do cartão do sistema de desenho sobe»). O commit que se
segue acrescenta só documentos e imagens: o relatório, as duas tabelas, as
medições e as 40 capturas de depois, e nenhum deles entra na cadeia de nenhum
portão (a lista de documentos de `check:registo` é fechada e está escrita em
`scripts/check-registo.mjs`; o `check:voz` lê o inventário das frases e o registo
das revisões, que já estão na cabeça medida).

Depois do último commit, `npm run build` correu outra vez para o carimbo do
`dist/`, como o brief manda.

---

## 8 · O que fica para o lugar de direção

### O que as linhas do motor destravaram, e o que ainda falta

As 59 linhas chegaram às 19:43 UTC e a régua passou a render-se em **45 cartões
por edição**, dos 131 das páginas de área: 45 com o período anterior, 23 com o
agregado da União e 7 com a palavra contra o valor de referência.

O que continua sem comparação, e porquê:

* **22 medidas não têm chave possível**, porque o período não é um ano
  (`-2026-08`, `-2025-12`, `-2021-12`). Descer um mês, um trimestre ou um semestre
  é conhecimento da série, e a série é do motor: estas esperam uma entrada em
  `referencias.json` que diga qual é o período anterior de cada uma;
* **64 não têm linha do período anterior** e **86 não têm agregado da União**: são
  as medidas que não estão entre as 32 que o motor enquadrou. As chaves são as
  mesmas duas regras de nome (`<slug>-<período anterior>` e `<slug>-<período>-ue`),
  e o dia em que a linha existir a régua rende-a sem uma linha de código nova;
* **5 das 32 enquadradas não têm agregado europeu**, e a ausência é da fonte e não
  da casa: o conjunto do Eurostat não traz valor no agregado naquele período. São
  `saldo-da-balanca-corrente-2025` (`tipsbp10`),
  `posicao-de-investimento-internacional-2025` (`tipsii10`),
  `desempenho-das-exportacoes-2025` (`tipsbp60`),
  `fluxo-de-credito-as-empresas-2025` (`tipspc30`) e `credito-malparado-2025`
  (`tipsbd10`). O cartão desenha-se sem a comparação europeia e **não escreve a
  ausência por palavras**, que é o §0.2 do brief.

**Do `nomes.json`, 17 dos 32 indicadores entram no recibo** (os que o motor marca
como a mesma medida): 17 com o nome da PORDATA e 9 com o do INE. Ficam de fora os
**8 marcados «medida vizinha»** e os **7 por confirmar**, e nenhum chega ao leitor.
Quem os quiser fechar tem a lista no ficheiro, com a nota de cada um.

### As quatro decisões que o construtor não tomou

1. **Os nomes de cartão que se perderam** (o §0). 44 cartões portugueses e 90
   ingleses sem nome. O `nomes.json` não resolve isto: ele traz o nome oficial
   para o RECIBO, e só para 32 medidas. Ou fica assim até o motor exportar um nome
   de cartão por linha (o item 1 do F1.15), ou o cartão volta a mostrar o nome na
   língua da fonte com a marca `lang` enquanto espera. É a decisão com mais efeito
   nas capturas.
2. **A régua custa duas marcas da fonte a mais por cartão** (o §0, ponto 2). Cada
   valor dela é uma linha e leva a porta para ela; não há forma de a tirar sem
   tirar a proveniência. Se a régua for a mais, corta-se o que o diretor decidir:
   o período anterior, o agregado, ou os dois.
3. **A fila do estado do cartão da faixa** (o §4). Reservar três linhas, tirar o
   contador da posição da fila, ou alargar o cartão: decide-se depois de os dois
   ramos estarem juntos, porque antes disso a medição é sobre o texto que muda.
4. **A origem da definição no cartão.** A frase do que a medida mede rende-se sem
   a origem ao lado (o publicador, o documento, o endereço, a data, o excerto),
   que continua inteira na página do domínio e na europeia. É o §2.1 da norma
   («tudo o resto fica atrás de um toque»), e é uma leitura da decisão de
   09.09.2026 que o construtor fez e não decidiu: se a direção quiser a origem
   também aqui, são duas linhas a mais por cartão.

### O que não se fez, e porquê

* **O mapa a preencher a sua coluna a partir de 1024 px** (item 6, terceira
  parte). `MapaRespira.astro` e `src/styles/mapa.css` estão abertos no ramo do
  bloco P1, que corre em paralelo, e a instrução ao construtor nomeia o mapa como
  coisa dele. A grelha da cabeça a 1024 não foi tocada.
* **A troca de «limiar» fora dos cartões** (item 5). É a metade do P1, pela mesma
  razão, e com as mesmas chaves.
* **O sinal à frente do valor** («+17,6 %», item 1b). O cartão escreve «17,6
  variação anual média, % em 2025», sem o sinal. Pôr um «+» onde a fonte publica
  «17,6» pede um campo declarado que diga que aquela unidade é uma variação, e
  nenhum ficheiro de dados o tem; adivinhá-lo pelo texto da unidade era inferir um
  campo, que é o que a casa proíbe desde a declaração do `lado` de um valor de
  referência («é um campo DECLARADO, e nunca inferido do sinal»). Fica para uma
  decisão de quem escreve `figuras.mjs`, com o campo a declarar-se por medida.
  **O `referencias.json` traz o `sentido` de cada valor de referência**, que é um
  campo declarado da mesma família: se a direção quiser o sinal, é dali que ele
  sai, e não do texto da unidade.

### A catraca da L1 subiu pela primeira vez, e o diretor tem de o saber

`check:lugar` conta as páginas com dois destinos iguais fora da mobília, e a
constante que o teto guarda é uma **catraca**: está escrito no código que «só
desce, e desce com a data e a razão ao lado». **Subiu**, de 2 170 para 2 290, e é
a primeira vez.

**Não subiu por o sítio ter piorado numa página.** Subiu porque o livro-razão
cresceu: cada linha tem página própria nas duas edições, e as 59 linhas do
enquadramento trazem 118 páginas novas à família `linha`, que passa de 1 422 para
1 540. 1 540 menos 1 422 são 118, e 118 são 59 vezes 2.

**Nenhuma das 118 tem um par de portas novo**, e isso foi medido: das 59 páginas
novas da edição portuguesa, **0** rendem qualquer um dos três blocos que este
bloco acrescentou ao recibo, porque nenhuma delas tem entrada no calendário nem
nome oficial exportado. Os dois pares que elas trazem são os dois padrões que a
família já tinha, cada um com mais 118 ocorrências e nenhuma ocorrência nova: o
endereço da fonte rendido em três sítios da mesma página (716 para 834), e a porta
da regra da releitura ao lado da porta do Método no rodapé do aparelho (678 para
796).

**O que isto pede de decisão:** ou a catraca passa a contar uma proporção em vez
de uma contagem (porque uma contagem de páginas sobe sempre que o livro-razão
cresce, mesmo com o sítio a melhorar), ou fica como está e sobe com a razão escrita
de cada vez. A composição medida está em `l1-composicao-2026-09-15.txt`, ao lado
deste ficheiro.

### E o tecto do cartão do sistema de desenho subiu pela mesma razão

`design:feixe` tem um tecto de tamanho por cartão, e o cartão do índice do
livro-razão é um retrato de `livro-razao/index.html`, que tem **uma fila por linha
do livro-razão**. Com as 59 linhas novas, o índice passou de 2 916 filas para
2 975 e o cartão de 496 para **542,1 KiB**, acima do tecto de 512.

Medido nesta corrida: o maior cartão é o do índice, com 542,1 KiB; os dois
seguintes são a primeira página, com 483,0 e 482,9. O tecto passa a 768 KiB, que
dá ao maior 226 KiB de folga. **O que ele continua a proibir é um cartão que
ninguém abre**, que é a razão pela qual ele existe.

**A decisão que vem a seguir fica escrita para não ser uma surpresa:** um retrato
do índice inteiro deixa de ser um espécime de desenho quando a página que ele
retrata tem dez mil filas, e o cartão passa a ser um recorte dela.

### Um achado que não é deste bloco e fica escrito

**As 59 linhas do motor entraram nas páginas de área como cartões próprios**, e
não deviam: `precos-da-habitacao-2024` é a mesma medida que
`precos-da-habitacao-2025`, um período antes. A página da habitação passou de três
cartões para seis, e o valor de 2024 ficou selado duas vezes na mesma página. O
bloco fechou-o (`eLinhaDeEnquadramento()` em `src/lib/areas.mjs`, o agregado da
União em `SEM_AREA`, e a mesma regra em `check-areas.mjs` com código próprio), mas
a lição é do processo e não do código: **uma exportação nova do motor entra nas
páginas do sítio por regras de nome que ninguém reviu para ela**, e mexe em três
contagens que ninguém tinha ligado a ela (as peças de uma área, a catraca da L1, o
tamanho de um cartão do sistema de desenho). Vale uma linha nos `ISSUES`, e vale
para o dia em que o motor exportar a série inteira de uma medida.

---

## 9 · O custo

| | |
| --- | --- |
| modelo | Claude Opus 5 (1M de contexto), uma passagem, em duas metades (antes e depois de as linhas do motor chegarem) |
| tempo de parede | das 18:40 às 20:45 UTC+1, cerca de **2 h 05 m** |
| símbolos | o contador do harness é a origem; o lugar de direção escreve o número na emenda da §1.108 |

A leitura de língua (§5.2 da norma), a medição às cegas do Sonnet e a leitura a
frio do Codex fazem-se a seguir, e nenhuma delas é do construtor: a família que
construiu nunca verifica o que construiu.
