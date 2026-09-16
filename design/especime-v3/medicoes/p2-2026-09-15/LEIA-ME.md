# Bloco P2 · O número e o seu sentido: o cartão de uma medida

*O relatório do construtor (Claude Opus 5), na forma do §3 do brief
`design/observatorio/BRIEF-P2-o-numero-e-o-seu-sentido.md`. Worktree
`.claude/worktrees/cartao-2026-09-15`, ramo `cartao-2026-09-15`, sobre
`2ab86986`. Prosa em português, sem travessões.*

---

## 0 · Os três acertos de 15.09 à noite, e o que eles mudaram

O lugar de direção leu as capturas da cabeça `2dceb7b9` e mandou três acertos.
Estão feitos, cada um no seu commit, e o que eles mudaram está medido:

| o acerto | antes | depois |
| --- | --- | --- |
| **(1) nenhum cartão fica sem nome** | 87 cartões com nome em português, 41 em inglês | **107 em cada edição**: 21 com o nome do projeto, 5 com o nome oficial confirmado do INE ou da PORDATA, e **81 com o nome que a fonte dá à medida** (15 deles com a marca `lang` em português, 71 em inglês, porque é nessa edição que os títulos portugueses são os estrangeiros) |
| **(2) uma marca da fonte por cartão** | 199 marcas por edição, em 131 cartões | **131 por edição, uma por cartão**; os 68 valores de régua ficam sem marca própria e a porta deles é a do cartão, que abre o recibo, onde o bloco «O enquadramento» os lista |

**Um achado do acerto 2, e fica escrito porque não se vê a ler o código.** Escrevi
uma dispensa no portão de HTML para o valor de régua sem marca própria, e medi-a a
seguir: **zero vezes exercida em 7 358 páginas**. A razão é de 28.08.2026 e não
deste bloco: a guarda `paginaDoLivro` do portão inclui a rota `area` desde o dia
em que a página de área passou a render campos do livro-razão com a marca deles, e
nessas páginas o portão confere cada CAMPO contra a linha (mais conferência, e não
menos) e a conferência do SELO é a que não corre. Nunca houve nada para dispensar,
e a dispensa saiu. **Quem promete a porta é a célula K10 da régua do bloco**:
nenhum cartão com mais do que uma marca, e o recibo da medida a listar cada linha
que a régua dela cita. Um leitor do cartão procuraria essa conferência no portão, e
ela não está lá: está escrito nos dois ficheiros.
| **(3) o valor de referência entre parênteses** | «acima do valor de referência, 9%» | **«acima do valor de referência (9%)»** |

**O que continua sem nome, e não há nome para lhe dar: 24 cartões por edição.**
São as linhas DERIVADAS, que não têm fonte nem documento porque a proveniência
delas é a das origens, e as quatro cujo único título de documento é o próprio
marcador. A lista está no §8, para o bloco P3 lhes dar o nome do projeto.

**O acerto (3) fica a «(9%)» e não a «(9 %)»**, e é uma escolha e não um
esquecimento: a mesma linha escreve-se «limiar 60% · acima» no cartão da faixa e
na peça do painel, e duas formas para o mesmo número na mesma casa é o que este
bloco existe para não ter. O símbolo é um campo declarado por medida em
`src/data/figuras.mjs` (doze escrevem «%» e a taxa de atividade escreve « pp»): se
a direção quiser o espaço fino, põe-se ali, uma vez, e chega a todos os sítios ao
mesmo tempo.

---

## 0b · O que o diretor tem de olhar nas capturas

**O cartão da habitação tem mais texto do que tinha: 13 nós para 17.** A régua é a
resposta à pergunta dele («17,6 % de quê, e é muito ou pouco»), e custa onze nós
de texto: «2024: 9,1 · União Europeia: 5,5 · acima do valor de referência (9%)».
O recibo que saiu valia sete. O §5.1 da norma manda justificar linha a linha um
bloco de palavras que acabe com mais texto do que começou, e o §4 da tabela das
cadeias fá-lo. Onde não há régua nem frase, que é a maior parte dos 131 cartões, a
contagem desceu de 9,9 para 6,5. **Se a régua for a mais, é ali que se corta.**

---

## 1 · A tabela do mandato, com a medida de cada item

| # | o que o brief pede | a medida | o resultado |
| --- | --- | --- | --- |
| 1 | o cartão com cinco coisas e nada mais | as cinco coisas e só elas em 100 % dos cartões das duas edições; «Publicado por», «Documento», «Lido na fonte a», «Dados de» a 0; a chave a 0 no texto visível | **cumprido.** 262 cartões (131 pt, 131 en), 0 blocos a mais, 0 rótulos de recibo, 0 chaves. Medido pela régua nova (`tests/cartao/cartao.mjs`, células K1, K2, K3), no `verify` |
| 2 | o recibo ganha as duas datas da norma §2.5 e o nome oficial com a sua origem | a linha da próxima conferência em 100 % dos recibos com entrada no calendário | **cumprido, as duas metades.** As cinco linhas do livro-razão com acontecimento datado no calendário (`divida-publica-2025`, `evora-concentracao-vab4-2024`, `evora-empresas-2024`, `evora-vab-empresarial-2024`, `portugal-concentracao-vab4-2024`) rendem «Próxima conferência» nas duas edições, com a porta para o acontecimento na agenda: 5 de 5. E com o `nomes.json` que chegou às 19:43, o recibo ganhou o nome oficial: **17 recibos por edição com «Nome na PORDATA» e 9 com «Nome no INE»**, cada um com a porta para o endereço e a data a que o motor o leu. São os que o motor marca como a MESMA medida; os oito marcados «medida vizinha» e os sete por confirmar não chegam ao leitor |
| 3 | a linha do tipo sai; o índice di-lo uma vez; a legenda da marca sai das páginas do leitor | «Governo Constitucional» a 1 no `dist/` de cada edição; a legenda a 0 fora do Método | **cumprido o primeiro, não cumprido à letra o segundo.** «Governo Constitucional» **1** em português e «Constitutional Government» **1** em inglês, os dois no índice das áreas (eram 9 e 9). A legenda da marca passa de **319 rotas por edição para 1** (o índice do livro-razão) e não para 0: as duas razões estão no §3 da tabela das cadeias, e as duas são mecânicas (o Método é texto governado e a decisão 1 da emenda de 15.09 à §1.108 diz quando ele se toca; `design:feixe` compõe o cartão do sistema de desenho lendo `p.marca-legenda` daquela rota, e sem ela o `verify` fecha) |
| 4 | nenhum título de documento da fonte à vista na edição portuguesa | zero cadeias em inglês nos cartões da edição portuguesa | **a regra mudou a 15.09 à noite, e a medida com ela.** Cumpri-la à letra deixava 44 cartões portugueses e 90 ingleses sem nome nenhum, e o lugar de direção decidiu o contrário sobre as capturas: nenhum cartão fica sem nome, e o que está na língua da fonte di-lo com a marca `lang`. A célula K4 passa a medir o que a I91 sempre mandou: **o nome de um cartão carrega a língua que as tabelas declaram para ele, nem a mais nem a menos**. **86 no total das duas edições** com o nome na língua da fonte e a marca `lang`, todos com a marca certa e 0 sem ela. **O relatório dizia «86 cartões por edição», e estava errado** (achado 16 da leitura a frio de 15.09.2026): 86 é o total que a régua imprime, e reparte-se em **15 na edição portuguesa e 71 na inglesa**, que são os dois números da tabela do §2. Os cartões com o nome que a fonte dá à medida são **81 por edição**; a marca `lang` só vai nos que estão na outra língua, e é por isso que os dois números não são o mesmo |
| 5 | «acima / abaixo / dentro do valor de referência», «sem valor de referência» | «limiar» a 0 no texto visível do `dist/` fora do Método | **cumprido nos cartões deste bloco; não cumprido no `dist/` inteiro, e a razão é a divisão do trabalho.** Nos 262 cartões a palavra está a 0 (célula K7), e as três cadeias novas usam **as mesmas chaves que o bloco P1 escreve** (`estado.acima`, `.abaixo`, `.entre`). As restantes cadeias com «limiar» (o cartão da faixa, a peça, a leitura breve, os títulos dos painéis) são a metade da troca que o P1 faz no ramo `porta-2026-09-15`, e duplicá-las aqui era garantir um conflito de fusão entre dois lados com o mesmo texto. A medida cumpre-se na fusão dos dois ramos |
| 1d | a régua: o período anterior, a União e a palavra contra o valor de referência, tudo lido de linhas | a régua só onde a linha existe; nenhum valor à mão | **cumprido, com as 59 linhas que o motor selou às 19:43.** Por edição: **45 cartões com régua**, dos quais 45 com o período anterior, 23 com o agregado da União e 7 com a palavra contra o valor de referência. Nenhum valor é escrito pela casa: cada um é um `<Claim>`, e a porta dele é a marca única do cartão, que abre o recibo onde o bloco «O enquadramento» os lista (a decisão de 15.09 à noite). As cinco medidas sem agregado europeu desenham-se sem ele e não escrevem a ausência por palavras (§0.2 do brief). A célula K9 compara o valor de referência nas suas duas testemunhas, a declaração de `figuras.mjs` e a leitura da página da Comissão: **13 de 13 batem certo** |
| 6 | um só gabarito; a faixa deixa de deslizar acima de 768; o mapa preenche a coluna a partir de 1024 | as capturas nas cinco larguras sem saltos, medidas por uma régua que compara as posições dos números e dos títulos entre cartões | **cumprido o gabarito e a faixa; não feito o mapa.** A régua é `gabarito-do-cartao.mjs`, 30 medições (3 rotas × 2 edições × 5 larguras). O espalhamento das posições do valor e do título dentro de cada cartão: **0 px em 14 das 30** (eram 2 das 30) e **máximo 17,6 px** (era 38,4). A faixa deixa de deslizar a partir de 768 px em todas as rotas medidas (deslizava em todas as larguras). Transbordo horizontal 0 nas cinco larguras, antes e depois. **O mapa não foi tocado**: é do bloco P1, que corre em paralelo e tem `MapaRespira.astro` e `mapa.css` abertos |
| 7 | uma régua nova para o cartão, com cinco plantas a morder | as plantas a morder, com a saída no relatório | **cumprido, com oito e não cinco.** `tests/cartao/cartao.mjs --prova` monta um `dist/` de mentira com oito estragos plantados, um por célula, e exige que os oito mordam e que o cartão são não dê nenhum vermelho. Corre no `verify` (`npm run check:cartao`). A saída está no §5 |
| 8 | as capturas e a tabela das cadeias | completas | **cumprido.** 80 capturas (4 rotas × 2 edições × 5 larguras × antes/depois) em `design/especime-v3/capturas/p2-2026-09-15/`; a tabela em `cadeias-antes-depois.md`, ao lado deste ficheiro |

---

## 2 · A contagem dos pedaços de texto por cartão, antes e depois

A contagem é de **nós de texto à vista**, por cartão, depois de tirar o que só um
leitor de ecrã ouve (`.vh` e `aria-hidden`). Medida sobre o `dist/` de `2ab86986`
e sobre o da cabeça final, com o mesmo guião.

| família de página | edição | cartões | antes | sem a régua | com a régua | depois dos acertos |
| --- | --- | --- | --- | --- | --- | --- |
| área da habitação | pt | 3 | 12,3 (13, 13, 11) | 8,3 | 16,3 | **14,7** (17, 15, 12) |
| área da habitação | en | 3 | 12,3 (13, 13, 11) | 8,7 | 16,7 | **14,7** (17, 15, 12) |
| área da economia | pt | 88 | 9,9 | 5,6 | 6,6 | **6,5** |
| área da economia | en | 88 | 10,0 | 5,1 | 6,2 | **6,5** |

As colunas do meio são as três construções do dia: às 19:30 UTC o cartão tinha
perdido o recibo e ainda não tinha a régua; às 20:30 tinha a régua com três marcas;
a última é a dos três acertos, com uma marca só (as duas palavras «fonte» que
saíram são os dois nós a menos) e com o nome de volta em 20 cartões portugueses e
66 ingleses. **As duas edições passam a ler o mesmo número de pedaços**, que é o
que se espera de duas edições da mesma página.

A justificação linha a linha, que o §5.1 da norma manda escrever para um bloco que
acabe com mais texto do que começou, está no §4 da tabela das cadeias.

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
| com nome | 107 | 107 |
| com o nome do projeto (`figuras.mjs`, `dominios.mjs`) | 21 | 21 |
| com o nome oficial confirmado (INE ou PORDATA) | 5 | 5 |
| com o nome que a fonte dá à medida | 81 | 81 |
| desses, com a marca `lang` porque estão na outra língua | 15 | 71 |
| sem nome, e sem nome nenhum para dar | 24 | 24 |
| marcas da fonte | 131 (eram 199) | 131 (eram 199) |
| valores de régua sem marca própria | 68 | 68 |
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
  prova: 9 estragos plantados, 9 vistos; o cartão são a 0; a régua com as duas
  comparações de uma medida, a série bienal, a ausência da linha da União e uma
  chave que não se inventa; as duas testemunhas do valor de referência com um par
  bom e dois maus

  A RÉGUA DO CARTÃO DE UMA MEDIDA · bloco P2

    páginas lidas                    7358
    cartões                          262 (131 pt, 131 en)
    com nome                         214
    sem nome (à espera do motor)     48
    com a frase do que medem         30
    com régua                        90
    «Governo Constitucional»         1 pt · 1 en
    legenda da marca                 2 página(s)
    nome na língua da fonte          86 (com a marca «lang»; é o total das duas edições: 15 pt e 71 en)
    unidade na outra língua          3 (a exceção da I92)
    o marcador em português          8 (a exceção da IDENTIDADE §6)
    valores de régua sem marca própria                    136 (a porta é a do cartão)
    valores de referência, as duas testemunhas comparadas  13
    medidas com nome oficial no recibo                    11
    ficheiros do motor               referencias.json sim · nomes.json sim

  ✓ as cinco coisas e só elas, em todos os cartões das duas edições
```

**As nove plantas, e o que cada uma prova:** um bloco a mais no cartão (K1); um
rótulo de recibo dentro dele (K2); a chave no texto visível (K3); um nome
estrangeiro SEM a marca da língua (K4, que é a pergunta nova depois do acerto 1);
um algarismo na régua sem linha e sem motivo declarado (K5); a frase mudada (K6);
a palavra «limiar» (K7); a legenda da marca numa página de área (K8); e um cartão
com duas marcas da fonte, com um valor de régua cujo recibo não o lista (K10). O cartão são, no mesmo `dist/` de
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
| `2dceb7b9` | O relatório, a tabela das cadeias, as medições e as quarenta capturas de depois |
| `355d8ed2` | Nenhum cartão fica sem nome: a escada ganha um degrau e deixa de ter fundo |
| `b2b9a827` | Uma marca da fonte por cartão, e o recibo passa a listar o enquadramento |
| `8cbca79c` | O valor de referência entre parênteses, e sem a vírgula solta |
| `d42d1a53` | As duas tabelas das línguas saem de `nomes.mjs`, que já não as usa |
| `d8bbb6de` | A dispensa que eu tinha escrito no portão nunca dispensou nada, e sai |
| (o último) | O relatório e a tabela refeitos com os acertos, e as quarenta capturas de depois outra vez |

**A cabeça final está no §7**, com os códigos dos portões.

**As nove primeiras são de antes de as linhas do motor chegarem**, às 19:43 UTC; as
sete seguintes são o que elas obrigaram a mudar; as três últimas são os acertos que
o lugar de direção mandou depois de ler as capturas. Ficam separadas porque foram
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

1. ~~**Os nomes de cartão que se perderam**~~ **Decidido a 15.09 à noite:** nenhum
   cartão fica sem nome, e o que não tem nome do projeto nem nome oficial mostra o
   nome da fonte com a marca `lang`. **Fica o que sobra:** 81 cartões por edição
   com o nome da fonte, que o bloco P3 tem de nomear (a lista está no §7 da tabela
   das cadeias), e **24 por edição sem nome nenhum**, para os quais não há nome da
   fonte para mostrar (a lista está no §8 da mesma tabela).
2. ~~**A régua custa duas marcas da fonte a mais por cartão**~~ **Decidido a 15.09
   à noite:** uma marca por cartão, e o recibo lista as linhas do enquadramento. A
   dispensa é declarada, o portão de HTML só a aceita quando o cartão tem a marca
   da linha que o item declara, e a régua do bloco confere que o recibo lista
   mesmo aquelas linhas.
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

---

# 10 · A passagem de correção da leitura a frio (16.09.2026)

*Construtor: Claude Opus 5. A leitura a frio do Codex (`gpt-5.6-sol`, xhigh) aos
blocos P1 e P2 fundidos está em
`design/especime-v3/critica/2026-09-15-codex-leitura-p1-p2.md`, com o registo das
plantas ao lado e a triagem do lugar de direção na cabeça do ficheiro. Esta
secção diz o que a passagem mudou na família do cartão e do recibo; a das
palavras da primeira página está no relatório do P1. Sem travessões.*

## 10.1 · Os achados corrigidos, com a medida de cada um

| achado | o que era | o que é, medido |
| --- | --- | --- |
| 2 | o cartão só nas páginas de área; a página do domínio ficou com a família antiga, com «Publicado por» e «período de referência» à vista | **o cartão rende-se na página do domínio**, com o nome, o valor com a unidade e o período, a frase, a régua e a marca da fonte; os valores irmãos são cartões pela mesma regra. **«Publicado por», «Published by», «período de referência» e «reference period» a 0 nas duas páginas de domínio das duas edições.** O que fica à volta do cartão é o âmbito de uma medida, o rótulo de um valor e a frase de quem fixou o valor de referência: é conteúdo desta página e o cartão não tem campo para eles |
| 2 | o rótulo da origem de uma definição era «Publicado por» | **«Definição de» e «Definition by».** «Publicado por» é o rótulo do publicador de uma LINHA, e ao pé de uma frase citada da Comissão lia-se como se aquele fosse o publicador do número |
| 3 | a régua do cartão só falhava sem a linha do valor, e o relatório dizia «as cinco coisas em todos» com 48 cartões sem nome | **a régua falha num cartão sem nome** (célula K11), e **as 24 linhas sem nome por edição deixam de se render como cartão**. A régua escreve os números como eles são: **36 de 236 com frase** e **68 de 236 com régua**, e a linha verde do fim diz o que foi conferido |
| 11 | nada conferia que a linha do período anterior era a observação anterior da mesma série | **a régua exige o mesmo `document.edition` e a mesma `unit`**, e a célula K12 mede-o sobre o `dist/`. **Das 45 réguas com período anterior de cada edição, 30 ficam e 15 deixam de render** |
| 12 | o tecto do cartão do sistema de desenho subiu para 768 KiB para admitir um cartão de 542,1 KiB | **passa a ser o medido mais 10 %**: 542,5 KiB mais um décimo, que dá **596,75 KiB**. Os dois números estão no código, e subir o tecto é mudar o número medido, com a data e a corrida ao lado |
| 16 | o relatório dizia «86 cartões por edição com o nome na língua da fonte» e a tabela dizia 81 | **os dois números são de coisas diferentes, e agora está escrito**: 86 é o total das duas edições dos nomes com a marca `lang` (15 na portuguesa e 71 na inglesa); os cartões com o nome que a fonte dá à medida são 81 por edição. A marca `lang` só vai nos que estão na outra língua |
| 17 | «Próxima conferência»; «As áreas seguem a orgânica…»; o espaço a mais em «( 9 %)» | «**Próxima verificação**» (o inglês «Next check» fica); «**As áreas são as do Governo em funções (o XXV Governo Constitucional).**»; e o espaço, que não estava escrito em lado nenhum: ver o §10.3 |

## 10.2 · O que se fez com os 24 cartões sem nome, e a lista

**A decisão, que o lugar de direção delegou nesta passagem:** uma linha que não
tem nome em degrau nenhum da escada **não se rende como cartão**. O nome é a
primeira das cinco coisas; um cartão sem ele é o defeito que a leitura a frio
apanhou, e escrever um nome à mão era a casa a baptizar uma medida do Estado.

**O que elas rendem é o que elas são: a linha do livro-razão com a sua
aritmética.** O valor, a unidade e o período ficam, com a marca da fonte ao lado
(que é a porta do recibo); no lugar do nome fica a **conta por palavras**, que é
o campo `derivation` que a linha já declara nas duas edições e que diz o que
aquele número é. Nenhuma cadeia nova: o texto é o da linha, marcado
`data-linha-campo="derivation"` e conferido pelo portão carácter a carácter. A
chave e os rótulos de recibo continuam proibidos ali dentro, e a régua do bloco
confere-o.

**A página onde elas vivem não lhes dá nome nenhum**: a página de área agrupa as
medidas por matéria, e a matéria é um cabeçalho de grupo, não o nome de uma
medida. Era o primeiro caminho que a instrução do lugar de direção mandava tentar,
e não existe.

**Medido na cabeça desta passagem:** 24 linhas por edição, 48 no total; **21 por
edição com a conta escrita** e **3 sem conta nenhuma**. A lista, com o que cada
uma tem:

*As vinte e uma derivadas, que não têm fonte nem documento porque a proveniência
delas é a das origens, e todas com `derivation` nas duas edições:*

| # | linha | onde vive |
| --- | --- | --- |
| 1 | `distancia-acores-ue27-2024` | `/areas/economia-e-coesao-territorial` |
| 2 | `distancia-alentejo-ue27-2000` | idem |
| 3 | `distancia-alentejo-ue27-2024` | idem |
| 4 | `distancia-algarve-ue27-2024` | idem |
| 5 | `distancia-centro-ue27-2024` | idem |
| 6 | `distancia-grande-lisboa-ue27-2024` | idem |
| 7 | `distancia-madeira-ue27-2024` | idem |
| 8 | `distancia-norte-ue27-2024` | idem |
| 9 | `distancia-oeste-e-vale-do-tejo-ue27-2024` | idem |
| 10 | `distancia-peninsula-de-setubal-ue27-2024` | idem |
| 11 | `distancia-portugal-ue27-2024` | idem |
| 12 | `distancia-setubal-grande-lisboa-2024` | idem |
| 13 | `evora-divergencia-municipio-dgal-2024` | idem |
| 14 | `evora-indice-de-divida-2014` | idem |
| 15 | `evora-indice-de-divida-2017` | idem |
| 16 | `evora-indice-de-divida-2021` | idem |
| 17 | `evora-indice-de-divida-2024` | idem |
| 18 | `evora-pelouros-2021-total` | idem |
| 19 | `evora-pelouros-2025-total` | idem |
| 20 | `evora-prr-execucao-2026` | idem |
| 21 | `evora-prr-vencido-quota-2026` | idem |

*As três cujo único título de documento é o próprio marcador («[a verificar]»), e
que não têm conta nenhuma para escrever:*

| # | linha | onde vive | o que ela tem |
| --- | --- | --- | --- |
| 22 | `avisos-pt2030-abertos` | `/areas/economia-e-coesao-territorial` | `source` e `document.title` são o marcador; `derivation` é `null` |
| 23 | `avisos-pt2030-pessoas-singulares` | idem | idem |
| 24 | `ciclo-substituicao-condutas` | `/areas/ambiente-e-energia` | idem |

**As três rendem o valor, a unidade e o período, com o estado «por-confirmar» que
já levavam, e mais nada.** Não há nome nem conta para escrever, e a casa não
inventa nem um nem outra. O nome delas é trabalho do motor
(`BRIEF-M1-o-nome-das-entradas-sem-nome.md`), e as três já estão na dívida de
proveniência que o `ledger:check` imprime a cada construção.

**E o relatório diz o que o P2 dizia mal:** a nota do §0 falava de «as quatro
cujo único título de documento é o próprio marcador». São **três**, contadas na
cabeça desta passagem.

## 10.3 · O espaço que ninguém escreveu, e a forma que fica

O diretor leu «acima do valor de referência ( 9 %)» nas capturas. **O HTML
construído não tinha espaço nenhum ali**: quem os punha era a folha.
`.cartao-medida-regua-item` é um `inline-flex` com `gap: 0 4px`, e num contentor
de flexão **cada corrida de texto vira um filho seu**, com o vão entre ela e a
seguinte. Os parênteses, o algarismo e o símbolo eram três filhos, e o olho lia
três vãos onde a casa tinha escrito zero.

Fechado o valor entre parênteses num `<span>` inline, o item volta a ter dois
filhos (o rótulo e o valor) e o único vão que se vê é o de 4 px entre eles. O
mesmo espaço solto saiu de depois dos dois pontos de «União Europeia:», que o
somava ao `gap`.

**A forma que fica, e é uma só em todo o sítio:** o símbolo escreve-se **como a
medida o declara** em `src/data/figuras.mjs` (doze escrevem «%» e a taxa de
atividade escreve « pp», com o espaço dentro da declaração) e a página não lhe
acrescenta nada. Dá **«(9%)» e «(2 pp)»**, que é o que o cartão da faixa, a peça
e a leitura breve já escreviam («limiar 60% · acima»). A medição está em
`vao-da-regua.txt`, com a régua ao lado: 32 itens da régua medidos no navegador,
**0 com mais de dois filhos de flexão**.

## 10.4 · O que a passagem NÃO fez do achado 2, e porquê

**O cartão não substituiu a faixa na primeira página nem em «Portugal na União
Europeia».** Fica escrito com a razão, porque é a parte maior do achado 2 e não
aterrou.

1. **O que a faixa é hoje não é um cartão:** é uma grelha de cinco filas (o
   estado, o valor, o nome, a unidade e o selo) com uma âncora VAZIA por cima das
   três primeiras, que é a forma que cumpre as duas metades da regra da casa («os
   cartões da faixa são alvos inteiros» e «o selo nunca fica aninhado dentro de
   outro alvo», Emenda 2). O cartão de uma medida tem a marca da fonte **dentro**
   da linha do valor, porque é lá que `auditaSelo()` a confere. Pôr o cartão
   dentro da faixa obriga a mudar a porta de sítio (o nome passa a ser a
   ligação), e isso é uma decisão de desenho sobre alvos, não uma correção.
2. **Resolveria por decreto a decisão 3 do §8 deste relatório**, que ficou aberta
   para o diretor: a fila do estado do cartão da faixa tem três desenhos
   possíveis (reservar três linhas, tirar o contador da posição, ou alargar o
   cartão) e o §4 diz que se decide «em capturas com o diretor, depois de os dois
   ramos estarem juntos». O cartão na faixa apaga a fila do estado, porque a
   régua do cartão já diz a palavra: é um dos três desenhos, escolhido sem ele.
3. **O custo medido, para quem o fizer:** 25 regras de `src/styles/inicio.css`
   (`.cartao`, `.cartao-porta`, `.cartao-valor`, `.cartao-nome`,
   `.cartao-unidade`, `.cartao-topo`, `.cartao-palavra`, `.cartao-posicao`,
   `.cartao-destino` e os seus `@media`), e as réguas que medem a faixa por
   dentro: `tests/inicio/porta.mjs`, `tests/inicio/faixa.mjs`,
   `tests/inicio/matriz.mjs`, `tests/inicio/correcoes-a.mjs`,
   `tests/inicio/leitura.mjs`, mais `scripts/design-bundle.mjs` e
   `scripts/capturas-toque.mjs`. É um bloco, não um acerto.

**E há uma parte do achado 2 que uma passagem de correção não pode fechar
sozinha, e é do diretor.** A medida diz «os rótulos de recibo a 0 em todas as
páginas do leitor». Na página do domínio isso fez-se. **Nas 308 páginas de
concelho e em «Portugal na União Europeia» fica «período de referência»**, dentro
da dobra da leitura breve de cada medida, e a razão é a **carta dos conteúdos,
§1, regra 3**: «Três datas por medida, sempre: o período de referência, a data em
que a fonte o publicou, e a data em que a casa conferiu a fonte.» O
`check:formas` (F5) fecha a construção com menos de três dentro de uma leitura
breve, e um portão não se enfraquece. Na página do domínio a conta fecha porque o
CARTÃO passou a escrever a primeira das três («em 2025», com a mesma marca
`data-da-linha`); nas dobras não há cartão, e tirar a data seria descer de três
para duas. **Ou a carta se emenda, ou as dobras ganham o cartão: as duas são
decisão do diretor.** Medido na cabeça desta passagem: «Publicado por» e
«Published by» a **0** fora do livro-razão; «período de referência» e «reference
period» em **309 páginas por edição** (as 308 de concelho e a europeia), e a **0**
nas de domínio.

## 10.5 · As capturas e as saídas

**As capturas «depois» foram refeitas** com
`node design/especime-v3/medicoes/p2-2026-09-15/capturas-cartao.mjs --momento=depois`
sobre a cabeça desta passagem: 40 imagens (quatro rotas × duas edições × cinco
larguras) em `design/especime-v3/capturas/p2-2026-09-15/`. As de «antes»
continuam a ser as da cabeça `2ab86986`.

**As saídas das réguas desta passagem**, ao lado deste ficheiro:

| ficheiro | o que é |
| --- | --- |
| `cartao-depois.txt` | a régua do cartão na cabeça final, com as onze plantas e os números como eles são |
| `vao-da-regua.txt` | os vãos da régua de um cartão, medidos no navegador |
| `l1-composicao-2026-09-16.txt` | a composição da L1 na cabeça final, para a comparar com a de 15.09 |
| `../p1-2026-09-15/check-lugar-depois.txt` | a corrida do `check:lugar` com a catraca a 2 284 |

**E a tabela das cadeias ganhou o §9**, com as cinco cadeias que esta passagem
mudou nesta família e as três mudanças que não mexeram numa cadeia.
