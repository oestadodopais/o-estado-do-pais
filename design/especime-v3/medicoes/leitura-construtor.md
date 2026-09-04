# F1.1b · a leitura breve no cartão, e o que vem a seguir ao mapa

*Relatório do construtor (Claude Opus 5), 04.09.2026, sobre o brief
`design/observatorio/BRIEF-F1.1b-a-leitura-breve-e-o-que-vem-a-seguir-ao-mapa.md`.
Ramo `leitura-2026-09-04`, a partir de `origin/main` em `1dbd1cef`. Sem travessões
na prosa. Nenhum número deste relatório foi escrito à mão: cada um tem ao lado o
comando que o mediu.*

## 0 · O que se construiu, em três frases

Os dois painéis de baixo saíram da primeira página e no lugar deles ficou uma
área de leitura: 21 `<details>` nativos fechados, um por medida, com o nome da
medida como `<summary>` e, dentro, a unidade, o limiar onde o quadro publica um,
a frase da medida, as três datas, a régua contra o limiar e o selo que abre a
linha. A seguir ao mapa
entrou a secção dos domínios, com o domínio que hoje tem página, o seu nome como
porta e a faixa das suas medidas de cabeça que não se rendem já nesta página. As
três medidas dos dois quadros que pertencem a um domínio com página não têm aqui
uma segunda leitura: têm uma linha com a porta para a leitura delas no domínio.

## 1 · O que o brief supunha e o que a medição encontrou

O bloco começou por medir o «hoje», antes de uma linha mudar. Três das suposições
do brief não sobreviveram à medição, e as três mudaram o que se construiu.

### 1.1 · «antes: cartão, painel e leitura, três»

O brief escreve, na medida J1, que o nome de cada medida aparece hoje em três
lugares. **Aparece em dois.** A peça do painel e a leitura breve eram a mesma
coisa: a peça É a leitura, com a dobra lá dentro.

```
node <script de contagem> · dist/index.html e dist/en/index.html de 1dbd1cef
  cada um dos 21 nomes: 2 ocorrências (o cartão da faixa e a peça ou a linha social)
  data-medida-nome no documento: 42 (21 cartões + 13 peças + 8 linhas sociais)
```

O que este bloco muda não é o número de lugares: é **qual é o segundo**. Um
`<summary>` de uma linha, num `<details>` fechado, em vez de uma peça inteira ou
de uma linha de lista. A medida J1 fica escrita na régua como o brief a quis (dois
lugares, contados por id), e o «antes» está aqui corrigido.

### 1.2 · «os cinco da faixa do domínio já estavam na página»

Das cinco medidas de cabeça do domínio 1 (`FAIXA_DO_DOMINIO_1` = E3, E2, T1, T2,
T3), **três** já são cartões desta página e **duas não estavam cá**:

| chave | linha | está na faixa da cabeça? |
|---|---|---|
| E3 | `divida-publica-2025` | sim, é um dos 13 do Procedimento |
| E2 | `saldo-das-administracoes-publicas-2025` | **não** |
| T1 | `taxa-de-emprego-2025` | sim, é um dos 8 do Painel Social |
| T2 | `taxa-de-desemprego-2025` | sim, é um dos 8 do Painel Social |
| T3 | `ganho-medio-mensal-2024` | **não** |

O brief diz «a dívida pública, o saldo e as taxas de emprego e desemprego são
também cartões do Procedimento»: o saldo não é cartão nenhum desta página, e as
duas taxas são do Painel Social e não do Procedimento.

### 1.3 · «a porta "Ver o domínio →" (a cadeia que o F1.2b já declarou)»

*(a segunda emenda da §1.98, de 04.09, chama-lhe «Ver no domínio →», e é essa a
forma que ficou.)*

O F1.2b **não declarou** essa cadeia. O que ele declarou foi o rótulo de destino
de um cartão, que é `s.dominios.eyebrow` («Domínios» / «Domains»), a sobrancelha
da página de chegada.

```
grep -rn "Ver no domínio\|Ver o domínio\|verNoDominio" src/  →  nenhuma ocorrência
```

O que se fez está na §3.3.

## 2 · As três decisões que as réguas obrigaram

### 2.1 · O valor não entra na leitura breve

O §1, item 1 do brief escreve o conteúdo de uma leitura como «o valor com selo, o
limiar ou a posição, a frase de contexto do painel a que pertence, as três datas,
a porta para a linha». O item 5 do mesmo §1 escreve «os 21 valores da faixa
continuam a aparecer uma só vez fora das páginas de linha (a régua A3)», e a
medida J2 exige a A3 verde.

As duas coisas não podem ser verdade ao mesmo tempo: a A3 conta `data-claim` por
id no HTML construído e exige exactamente um por página. **Manda a medida de
aceitação.** O valor fica no cartão, que é o «Relance» daquela medida e a porta
que traz o leitor até à leitura; a leitura leva o limiar, a frase, as três datas e
o selo, que é a porta para a linha. É a mesma decisão que o F1.1 já tinha tomado
quando tirou os 21 valores às peças.

**A decisão do lugar de direção de 04.09 diz a mesma coisa por outras palavras.**
A segunda emenda da §1.98 escreve, para as três medidas partilhadas com o
domínio: «na primeira página o cartão delas abre só uma linha com o valor e a
porta "Ver no domínio →", sem reler». O VALOR é o do cartão, que é onde ele está
e onde ele se lê uma vez; a LINHA que o cartão abre é a porta. É o que a página
faz: o cartão mostra o valor com o seu selo e leva ao domínio; a leitura daquela
medida na área de leitura é uma linha só, a porta. A régua J12 mede-o cartão a
cartão e leitura a leitura.

### 2.2 · A faixa do domínio leva as medidas que não estão já na página

O item 5 do brief decide que os cartões repetidos da faixa do domínio «não levam o
valor selado, só o nome e a porta», e autoriza a alternativa: «se a régua ou a
régua de voz o recusarem, a faixa do domínio na primeira página leva só as
medidas que não estão no Procedimento, e o relatório mede as duas formas».

**Uma forma foi construída; a outra foi medida pelas plantas e pela leitura das
células, e diz-se qual foi qual.** A página construída é a da alternativa. A forma
das cinco não foi construída: o que dela se sabe está abaixo, e cada linha diz o
que a sustenta.

| forma | o que cai | como se sabe |
|---|---|---|
| cinco cartões, todos com valor | **A3** conta `data-claim` por id no HTML construído e exige exactamente um: três dos 21 (`divida-publica-2025`, `taxa-de-emprego-2025`, `taxa-de-desemprego-2025`) passariam a dois. **J1** conta o nome dessas três em três lugares em vez de dois | **medido por planta**: «a faixa do domínio com um valor selado repetido» (`leitura.mjs --vermelhos`) põe no cartão do saldo a linha da dívida pública, e a célula J5 cai; a mesma repetição é o que a A3 conta do outro lado |
| cinco cartões, três sem valor selado | **A1** exige selo com caixa em cada cartão da faixa e três ficariam sem. **J1** continua a contar três nomes em três lugares. E dois cartões do mesmo id na mesma página dão dois elementos com o mesmo `id` de HTML (`k-<id>`, que `Faixa.astro` compõe para o `aria-labelledby` da porta) | **lido nas células e no componente**, não construído: a planta «um cartão sem selo» prova que a A1 apanha um cartão sem selo (corre-se em cada corrida de `porta.mjs --vermelhos`), e o `id` duplicado lê-se em `Faixa.astro`. A contagem da J1 tem o ramo escrito na régua e não tem planta própria |
| as medidas que não estão já na página (a que ficou) | nada | **medido**: todas as réguas verdes sobre a construção final |

A faixa do domínio na primeira página leva hoje **dois** cartões, o saldo das
administrações públicas e o ganho médio mensal, e diz «1 de 2» e «2 de 2». A
condição não é uma lista escrita: é o conjunto dos ids da faixa da cabeça, lido na
própria vista, e por isso o dia em que uma medida sair da faixa da cabeça ela
entra na do domínio sem uma linha mudar.

### 2.3 · A manchete do domínio não entra na primeira página

O item 3 do brief pede, na secção dos domínios, «o nome, a manchete do domínio (a
mesma do `DominioView`), a faixa das cinco medidas de cabeça e a porta». A
manchete do domínio 1 nomeia duas linhas do livro-razão, `divida-publica-2025` e
`saldo-das-administracoes-publicas-2025`, cada uma com o seu valor e o seu selo
(`src/views/DominioView.astro`, a constante `manchete`).

O primeiro dos dois valores é a linha `divida-publica-2025`, que já é um cartão
desta página. Rendê-la aqui punha um segundo `data-claim` daquela linha em `/`, e
a A3 cai. **A manchete não entra**, e a medida J5 fica cumprida sem ela: a secção
tem o nome do domínio como porta, a faixa com «n de N» e o destino de cada cartão
na página do domínio. O leitor lê a manchete do domínio na página do domínio, a um
toque de distância, que é onde ela é a manchete de alguma coisa.

## 3 · O que se construiu, ficheiro a ficheiro

### 3.1 · `src/components/inicio/LeituraBreve.astro` (novo)

A área de leitura: uma lista de `<details>` nativos fechados, um por medida, com
o nome da medida como `<summary>` e o `id` `m-<id da linha>`, que é a âncora para
onde o cartão daquela medida já apontava desde 01.09.2026. Uma leitura é uma de
duas coisas:

* a **leitura inteira** de uma medida que só vive nesta página: a unidade, o
  limiar onde o quadro publica um (com a comparação, na forma que a peça
  imprimia), a frase da medida onde ela existe, as três datas da carta e o selo,
  que é a porta para a linha;
* a **porta** de uma medida que vive num domínio: uma ligação, e mais nada.

### 3.2 · `src/views/HomeView.astro`

Sai a grelha das treze `<Peca>` e sai o `<ListaSocial>`; entram as duas metades
da área de leitura, cada uma com o nome do seu quadro, a sua contagem reconferida
e a sua frase de contexto. A secção `#painel` e a secção `#painel-social` ficam
com os mesmos `id`, porque são as âncoras das portas das duas chaves da prova, e
o portão de HTML fecha a construção quando uma porta aponta para uma âncora que
não existe: foi o que ele fez à primeira construção deste bloco, com quatro erros
nas duas edições.

Entra a secção dos domínios, a seguir ao mapa e antes da área de leitura, com o
domínio que tem página, o seu nome como porta e a faixa das suas medidas de
cabeça que não se rendem já nesta página.

`ListaSocial.astro` **fica no repositório** e deixa de se render, como ficaram
`InstrumentoConvergencia.astro` e `BandaDaRegiao.astro` quando saíram de `/`:
nada se apaga, o que sai é a rendição.

### 3.3 · `src/i18n/strings.mjs` · uma cadeia nova

`dominios.verNoDominio` = «Ver no domínio» / «See it in the domain». É a porta da
leitura de uma medida que vive num domínio. **Não pode ser uma linha do
`INVENTARIO-FRASES.md`**, e a razão está medida e escrita lá: o texto vive todo
dentro de um `<a>`, que as medidas 8 e 9 da régua da voz excluem nos dois
sentidos, e uma linha `viva` assim fecha a construção. Fica nomeada em prosa na
secção nova do inventário, como a leitura do índice de 03.09 fez com «Subir».

### 3.4 · `public/js/inicio.js`

Duas coisas, e nenhuma escreve texto ou compõe um número (a regra do ficheiro):

* o comando da densidade passa a governar as leituras (`.peca-mais, [data-leitura]`);
* um ouvinte no documento fecha a leitura anterior quando uma ligação para outra
  leitura é tocada, e a leitura do fragmento abre-se à chegada e no `hashchange`.
  O ouvinte é UM, no documento, e pergunta «esta ligação vai a uma leitura?» e não
  «este elemento é um cartão»: o guião continua a não nomear a faixa, que é o que
  a célula F4 da régua da faixa promete.

### 3.5 · `src/styles/inicio.css`

Só a secção da primeira página, no fim do ficheiro: a área de leitura e a fila dos
domínios. Nenhuma cor nova, nenhum tipo novo, nenhum corpo de número novo; todas
as fichas são as que a folha já declara, e o sinal de dobra é, carácter a
carácter, o de `.peca-seta`.

### 3.6 · As réguas

| ficheiro | o que mudou |
|---|---|
| `tests/inicio/leitura.mjs` | **novo**, com as células J1, J3, J4, J5, J6, J7 e J12 e cinco estragos plantados |
| `tests/inicio/porta.mjs` | A10 passa a contar dentro das leituras (contava dentro das peças, que saíram) e a exigir as duas coleções não vazias; A13 lê a faixa DA CABEÇA (a página passou a ter duas); A17 lê faixa a faixa em vez de página a página; a planta da A3 muda de alvo, porque o alvo antigo saiu da página |
| `tests/inicio/faixa.mjs` | F1 e F12 comparam os cartões da faixa da cabeça com as leituras da página; as células que medem cada cartão (F2, F3, F5, F7, F8) continuam a ler todos os cartões das duas faixas |
| `tests/inicio/lista.mjs` | L8 conta as leituras de cada metade em vez das peças e das linhas sociais |
| `tests/inicio/matriz.mjs` | os seletores seguem a área de leitura, a faixa da cabeça ou o cartão, conforme a coisa que cada célula mede (59 pedaços de diferença, 40 linhas novas com um seletor ou um valor); a célula da grelha de duas colunas passa a medir a largura da régua de uma leitura aberta, que é a metade dela que sobrevive à saída da grelha (ver a §5.2) |

### 3.7 · Os ficheiros da voz

`VOZ-MARCADORES.md`: a exceção da raiz «confer» no rótulo da terceira data ganha a
rota `home` (já valia em `dominio`, e pela mesma razão). `INVENTARIO-FRASES.md`:
quatro linhas passam a «retirada» com a razão escrita, e uma secção nova diz o que
o bloco acrescentou e o que não pode ser linha. `critica/REVISOES-DO-INVENTARIO.md`:
a entrada do bloco `leitura`.

## 4 · O que se perde, dito

**Duas frases saem do sítio.** A definição da dívida pública («Dívida bruta das
administrações públicas, no conceito do Procedimento dos Défices Excessivos.
Está acima do limiar do painel europeu.») e a da taxa de emprego («Proporção das
pessoas dos 20 aos 64 anos com emprego.»), nas duas edições. As duas viviam na
peça do painel; as duas medidas passaram a ter, na área de leitura, uma linha só
com a porta para o domínio, e a página do domínio não rende a frase de
`figuras.mjs` (rende a pergunta da carta, que é outra coisa). As quatro linhas do
inventário passaram a «retirada» com esta razão escrita, e o portão da voz confere
que não voltam em silêncio. **É uma perda de conteúdo, e a decisão é do lugar de
direção de 04.09.2026.**

**A régua contra o limiar quase saiu do sítio inteiro, e voltou.** A primeira
redação deste bloco deixou-a cair com a peça, porque o §1 do brief não a lista
entre o que uma leitura leva. O que isso custava só se viu quando o feixe do
sistema de desenho parou a corrida com «não encontrei uma peça fora do limiar com
régua»: a régua contra um LIMIAR PUBLICADO só existia no painel da primeira
página, porque as sete medidas de um concelho e as da régua da convergência não
têm limiar do quadro. Deixá-la cair era tirar do sítio a única forma gráfica que a
Emenda 4 desenhou para «de que lado do limiar está o valor, e a que distância».
Está dentro da dobra de cada leitura, onde não custa um píxel enquanto a leitura
estiver fechada, e o cartão do sistema de desenho passa a retratá-la aí. **Foi um
portão da casa a apanhar uma perda que o brief não previu, e fica escrito.**

**Uma lição, e não uma perda: um nome de classe que já existe restila em
silêncio.** A primeira redação chamou `.leitura` ao `<details>` de cada medida.
`site.css` já tem `.leitura` (moldura de 1 px nos quatro lados e fundo de papel,
a mobília da página de um estudo migrado), `.leitura-frase` e `.leitura-breve`, e
o que se viu na página construída foi cada leitura dentro de uma caixa que
ninguém desenhou. Não foi o olho que o apanhou: foi a célula «as leituras sem
caixas, separadas por fios» da matriz, a contar 13 com moldura. As classes deste
bloco passaram a `dobra-*`, que é a palavra que a casa usa desde a I54, e as
marcas de dados (`data-leituras`, `data-leitura`) continuam a nomear o que a
coisa é.

**O nome da fonte sai da linha de cada medida do Painel Social.** A lista compacta
escrevia «Eurostat» ao lado da unidade. O selo do pé de cada leitura é a porta
para a linha, e é lá que a fonte está escrita com as suas três datas.

## 5 · As onze medidas de aceitação, antes e depois

*(as células e os comandos estão em `tests/inicio/leitura.mjs`, `porta.mjs`,
`faixa.mjs`, `lista.mjs`, `matriz.mjs` e `numeros-novos.mjs`; o «antes» é a
construção de `1dbd1cef`, medida numa árvore própria (`git worktree add
.claude/worktrees/base-1dbd1cef --detach 1dbd1cef`), e o «depois» é a deste ramo)*

| # | medida | antes | depois | régua |
|---|---|---|---|---|
| J1 | os 21 nomes em exactamente dois lugares, por id | 2 lugares: o cartão da faixa e a peça do painel (ou a linha social) · 42 `[data-medida-nome]` no documento | 2 lugares: o cartão da faixa da cabeça e o `<summary>` da sua leitura · 44 no documento (os 2 que sobram são os cartões da faixa do domínio, que não são medidas destas) · **0 fora dos dois lugares, nas duas edições** | `leitura.mjs` J1 |
| J2 | os 21 valores selados uma só vez, e a Comissão em cada frase de contexto | A3 0 fora da conta · A4 2 frases, 0 sem a Comissão | **igual** | `porta.mjs` A3, A4 |
| J3 | sem guião: as 21 leituras presentes, fechadas, com `id` | não havia leituras | 21 de 21, 0 abertas, 0 sem id, 0 com id errado, 21 com `<summary>`, em Chromium e em WebKit | `leitura.mjs` J3 |
| J4 | com guião: um toque abre a sua e fecha a anterior, e o endereço passa a `#<id>` | não havia | dois toques, dois endereços (`#m-<id>`), uma leitura aberta de cada vez | `leitura.mjs` J4 |
| J5 | a secção dos domínios a seguir ao mapa | não havia | 1 domínio, depois do mapa e antes da área de leitura, com a porta para `/dominios/economia-e-financas-publicas` (e o par inglês) e a faixa de 2 cartões com «n de 2»; nenhum valor selado repetido | `leitura.mjs` J5, `porta.mjs` A17 |
| J6 | a altura de `/` a 390 menor do que hoje | **6 959 px** (`/`) · **6 911 px** (`/en`) | **4 667 px** (menos 2 292) · **4 625 px** (menos 2 286) | `leitura.mjs` J6, `porta.mjs` A2 |
| J7 | o primeiro ecrã a 390 × 664 igual ao do F1.1 | fundo máximo 653,7 px (`/`) · 641,1 px (`/en`) | **653,7 px · 641,1 px**, os mesmos | `leitura.mjs` J7, `porta.mjs` A1 |
| J8 | `/estudos` a ≤ 1 toque e ≤ 1,5 ecrãs | a porta mais acima a 662,7 px (1 ecrã) em `/`, 650,1 px (0,98) em `/en` | **os mesmos** | `porta.mjs` A15 |
| J9 | nenhum número novo, com as diferenças ditas | *(ver a §5.1)* | *(ver a §5.1)* | `numeros-novos.mjs` |
| J10 | `build`, `verify` e `typecheck` a 0, e as réguas de `tests/inicio` | *(ver a §5.2)* | *(ver a §5.2)* | os três comandos |
| J11 | as plantas vermelhas e depois verdes | não havia | 5 de 5 | `leitura.mjs --vermelhos` |

### 5.1 · J9 · o inventário das classes de algarismos

```
node tests/inicio/numeros-novos.mjs --json <ficheiro>
node tests/inicio/numeros-novos.mjs --so index.html,en/index.html --json <ficheiro>
```

**No sítio inteiro (7 238 páginas), nenhuma classe ganha um valor distinto novo:**

| classe | distintos | ocorrências |
|---|---|---|
| `data-claim` | 2 916 → 2 916 | 31 244 → 31 248 |
| `data-prova` | 47 → 47 | 14 584 → 14 584 |
| `data-nonledger` | 16 → 16 | 74 690 → 74 786 |
| `data-verbatim` | 6 → 6 | 23 → 23 |

**Em `/` e `/en`, as diferenças, uma a uma, e cada uma reconciliada:**

| classe · valor | antes | depois | porquê |
|---|---|---|---|
| `data-claim` (distintos) | 22 | **24** | entram `saldo-das-administracoes-publicas-2025` e `ganho-medio-mensal-2024`, os dois cartões da faixa do domínio. **Nenhum dos 21 é contado duas vezes** (a régua A3) |
| `data-claim` (ocorrências) | 44 | 48 | os dois valores novos, nas duas edições |
| `data-nonledger="data-da-linha"` | 0 | **108** | as três datas de cada uma das 18 leituras inteiras, nas duas edições (18 × 3 × 2) |
| `data-nonledger="numeracao"` | 84 | 92 | o «n de N» dos dois cartões da faixa do domínio (2 × 2 × 2) |
| `data-nonledger="escala-de-instrumento"` | 62 | 50 | as três leituras que passaram a porta levavam 6 marcas por edição (2 na régua da dívida pública, 4 nos escalões etários da taxa de emprego) |
| `data-nonledger="limiar-do-quadro"` | 60 | 56 | as 2 marcas do limiar da dívida pública (a linha e a referência da régua), por edição |
| `data-nonledger="data-de-referencia"` | 88 | 86 | saem 3 por edição (a unidade das três leituras que passaram a porta) e entram 2 (os dois cartões novos) |
| `data-nonledger="proveniencia"` | 86 | 84 | saem 3 selos por edição (o pé das três leituras que passaram a porta) e entram 2 (os selos dos dois cartões novos) |

As contagens de antes saíram da construção de `1dbd1cef` numa árvore própria; as
de depois, desta. Cada linha da segunda tabela fecha à unidade.

### 5.2 · J10 · os três comandos e as réguas

Os três, sobre a árvore final (com `origin/main` fundido), com os códigos lidos
de ficheiros e não de um `echo` a seguir a um comando em segundo plano:

```
npm run build     > build-final.log 2>&1; echo $? > build-final.code   →  0
npm run verify    > verify-final.log 2>&1; echo $? > verify-final.code →  0
npm run typecheck > tc-final.log 2>&1; echo $? > tc-final.code         →  0
```

**As treze réguas de `tests/inicio`**, corridas sobre a construção final. O
«antes» de cinco delas está medido: `porta` e `faixa` correram na árvore deste
ramo antes de uma linha mudar, e `matriz`, `correcoes-a` e `mapa-navegacao`
correram numa árvore própria construída em `1dbd1cef`, para que a diferença fosse
do bloco e não de outra coisa. Das outras oito não há medida de partida, e a
coluna diz isso em vez de a inventar.

| régua | antes (`1dbd1cef`) | depois | o que mudou nela |
|---|---|---|---|
| `leitura` | não existia | **13 de 13 células, 5 de 5 plantas** | nova |
| `porta` | 34 de 34 | 34 de 34 | A10 conta dentro das leituras e exige as duas coleções não vazias; A13 lê a faixa da cabeça; A17 lê faixa a faixa; duas plantas mudaram de alvo (a da A3, cujo alvo saiu da página; a da A2, cujos mil píxeis de papel deixaram de chegar) |
| `faixa` | 80 de 80 | 80 de 80 | F1 e F12 comparam os cartões da faixa da cabeça com as leituras da página |
| `lista` | não medida na partida | 94 de 94 | L8 conta as leituras de cada metade |
| `matriz` | **3 de 84 vermelhas** | **as mesmas 3** | dezassete sítios seguem a coisa que agora lá está; nenhuma célula nova ficou vermelha |
| `correcoes-a` | 32 de 32 | 32 de 32 | nenhuma mudança na régua; o alvo do nome do domínio foi feito de 44 px depois de ela o recusar |
| `mapa-navegacao` | 9 de 9 | 9 de 9 | N3 lê o corpo da página na área de leitura |
| `app`, `areas`, `mapa-distritos`, `regioes`, `rotulo`, `capturas`, `numeros-novos` | não medidas na partida | verdes | nada |

**As três células vermelhas da matriz são as mesmas antes e depois**, e nenhuma é
deste bloco: «a linha da reconferência», «Emenda 14 · um concelho sem estudos
rende as sete peças» (a página de Águeda rende oito) e «a língua de um título
citado» (a exceção aprovada da §1.91, decisão 6). As duas primeiras foram
medidas na árvore de partida com o mesmo comando.

## 6 · Os estragos plantados (J11)

`node tests/inicio/leitura.mjs --vermelhos` planta cinco estragos no HTML servido,
entre o ficheiro e o navegador, e exige três coisas de cada um: **verde antes**
(as células que ele nomeia passam sem ele), **o HTML mudou** (a transformação dá
bytes diferentes) e **vermelho depois** (todas as células nomeadas caem).

| planta | células |
|---|---|
| um painel de baixo de volta (a peça com o nome da medida) | J1.pt |
| um `<details>` da área de leitura sem id | J3.chromium, J3.webkit |
| a secção dos domínios sem a porta | J5.pt |
| a leitura de uma medida do domínio com a leitura inteira de volta | J12.pt |
| a faixa do domínio com um valor selado repetido | J5.pt |

A quinta é a que o brief pede e a quarta é da decisão do lugar de direção de
04.09; as outras três são as do §4 do brief.

## 7 · O que não se fez, e porquê

1. **A faixa do domínio com cinco cartões** (§1, item 5 do brief). Medidas as duas
   formas, ficou a que o próprio brief autoriza. Ver a §2.2, com o que cai em cada
   uma.
2. **A manchete do domínio na secção dos domínios** (§1, item 3). O seu primeiro
   valor é uma linha que já é um cartão desta página, e a régua A3 conta
   `data-claim` por id. Ver a §2.3.
3. **O valor com selo dentro da leitura breve** (§1, item 1). Mesma razão, e a
   medida J2 exige a A3 verde. Ver a §2.1.
4. **A fila dos estudos não mudou de sítio.** O item 4 do brief diz duas coisas
   que não podem ser as duas verdade: «fica onde o F1.2b a pôs» e «depois da
   secção dos domínios». O F1.2b pô-la dentro do bloco da faixa, logo por baixo
   dos cartões, e é lá que ela cumpre a medida J8 (a ≤ 1 toque e ≤ 1,5 ecrãs, que
   a célula A15 de `porta.mjs` mede). Depois da secção dos domínios ela ficaria a
   mais de três ecrãs, e a J8 cairia. Fica onde estava.
5. **A cadeia «Ver o domínio →» não existia.** O brief e o lugar de direção dizem
   que o F1.2b a declarou; medido, o que ele declarou foi `s.dominios.eyebrow`,
   que é o rótulo de destino de um cartão. Declarou-se uma cadeia nova para a
   porta da leitura, «Ver no domínio» / «See it in the domain», e o nome do
   domínio é a porta da secção. Ver a §3.3.
6. **Uma coisa que este bloco viu e não corrigiu, porque não é ficheiro dele.** Na
   página do domínio, o cartão do ganho médio mensal (T3) rende a palavra «sem
   limiar», e a Emenda 1 e o item B8 do bloco B dizem o contrário: onde o quadro
   nunca publicou limiar nenhum, o cartão não leva palavra de estado, porque
   dizê-la é dizer que a casa procurou um limiar e não o encontrou. Na faixa da
   cabeça da primeira página a regra já é essa, e na faixa do domínio desta página
   também; em `src/views/DominioView.astro` continua a não ser. A régua A10 de
   `porta.mjs` mede a palavra em `/` e não na página do domínio, e por isso o
   defeito não fecha construção nenhuma. É um achado para `ISSUES.md`.
7. **O teto da A2 ficou com folga, e não se mexeu.** A célula A2 de `porta.mjs`
   mede a altura contra «o teto da árvore de partida do F1.1 mais a altura da fila
   dos estudos» (6 991 px em `/`), e a página passou a medir 4 667: sobram 2 324 px
   de folga, e a planta «a página mais alta do que a árvore de partida» deixou de
   a derrubar com mil píxeis de papel (passou a cem mil, com a razão escrita ao
   lado). **Não se mexeu no teto**, porque o número é o do F1.1 e a fórmula é a do
   F1.2b, e nenhum dos dois é deste bloco; quem passa a segurar a altura é a
   célula J6 de `leitura.mjs`, que exige MENOR do que a árvore de partida deste
   ramo e traz os dois números escritos. **Uma decisão para o lugar de direção:**
   repor o teto da A2 na altura medida hoje faria dela um roquete outra vez.

8. **A medição às cegas e a leitura a frio não são deste lugar.** A família que
   construiu não verifica o que construiu: o Sonnet mede numa cópia e o Codex lê
   com plantas.

## 8 · As capturas

`design/especime-v3/capturas/leitura-2026-09-04/`, oito PNG, tema claro, sobre a
construção final:

| ficheiro | altura da página |
|---|---|
| `inicio-390-pt.png` | 4 667 px |
| `inicio-390-en.png` | 4 625 px |
| `inicio-768-pt.png` | 4 114 px |
| `inicio-768-en.png` | 4 114 px |
| `inicio-1280-pt.png` | 3 389 px |
| `inicio-1280-en.png` | 3 370 px |
| `inicio-390x664-primeiro-ecra-pt.png` | o primeiro ecrã, sem rolar |
| `inicio-390x664-primeiro-ecra-en.png` | o primeiro ecrã, sem rolar |

