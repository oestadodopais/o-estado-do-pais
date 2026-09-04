# F1.1b · a leitura breve no cartão, e o que vem a seguir ao mapa

*Relatório do construtor (Claude Opus 5), 04.09.2026, sobre o brief
`design/observatorio/BRIEF-F1.1b-a-leitura-breve-e-o-que-vem-a-seguir-ao-mapa.md`.
Ramo `leitura-2026-09-04`, a partir de `origin/main` em `1dbd1cef`. Sem travessões
na prosa. Nenhum número deste relatório foi escrito à mão: cada um tem ao lado o
comando que o mediu.*

## 0 · O que se construiu, em três frases

Os dois painéis de baixo saíram da primeira página e no lugar deles ficou uma
área de leitura: 21 `<details>` nativos fechados, um por medida, com o nome da
medida como `<summary>` e, dentro, a unidade, o limiar onde o quadro publica um
com a sua régua, a definição da medida, as três datas e o selo que abre a linha.
A seguir ao mapa entrou a secção dos domínios, com o domínio que hoje tem página,
o seu nome como porta e a faixa das suas medidas de cabeça que não se rendem já
nesta página. As três medidas dos dois quadros que pertencem a um domínio com
página têm **a mesma leitura das outras dezoito** e acrescentam, no fim, a porta
«Ver no domínio →».

*Este relatório cobre as duas passagens. A segunda, de 04.09.2026, corrige uma
decisão do lugar de direção depois da leitura a frio do Codex
(`design/especime-v3/critica/2026-09-04-codex-leitura-f11b-leitura.md`), e está
na §9.*

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
onde o cartão daquela medida já apontava desde 01.09.2026.

**A leitura é a mesma para as 21** (decisão corrigida de 04.09.2026): a unidade,
o limiar onde o quadro publica um (com a comparação, na forma que a peça
imprimia) e a sua régua, a definição da medida onde ela existe, as três datas da
carta, e o selo, que é a porta para a linha. **As três medidas que vivem num
domínio acrescentam, no fim, a porta «Ver no domínio →»**, e não trocam a leitura
por ela.

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
| `tests/inicio/leitura.mjs` | **novo**, com as células J1, J3, J4, J5, J6, J7 e J12 e cinco estragos plantados. Na segunda passagem, 18 células: a J3 e a J4 passaram a correr nas duas edições e nos dois motores, e a J4 a tocar nos 21 cartões em português |
| `tests/inicio/porta.mjs` | A10 passa a contar dentro das leituras (contava dentro das peças, que saíram) e a exigir as duas coleções não vazias; A13 lê a faixa DA CABEÇA (a página passou a ter duas); A17 lê faixa a faixa em vez de página a página; a planta da A3 muda de alvo, porque o alvo antigo saiu da página |
| `tests/inicio/faixa.mjs` | F1 e F12 comparam os cartões da faixa da cabeça com as leituras da página; as células que medem cada cartão (F2, F3, F5, F7, F8) continuam a ler todos os cartões das duas faixas |
| `tests/inicio/lista.mjs` | L8 conta as leituras de cada metade em vez das peças e das linhas sociais |
| `tests/inicio/matriz.mjs` | os seletores seguem a área de leitura, a faixa da cabeça ou o cartão, conforme a coisa que cada célula mede (59 pedaços de diferença, 40 linhas novas com um seletor ou um valor); a célula da grelha de duas colunas passa a medir a largura da régua de uma leitura aberta, que é a metade dela que sobrevive à saída da grelha (ver a §5.2) |

### 3.7 · Os ficheiros da voz

`VOZ-MARCADORES.md`: a exceção da raiz «confer» no rótulo da terceira data ganha a
rota `home` (já valia em `dominio`, e pela mesma razão). `INVENTARIO-FRASES.md`:
**nenhuma linha nova e nenhuma linha retirada** depois da segunda passagem (as
quatro que a primeira tinha passado a «retirada» voltaram a «viva», e o que mudou
nelas foi só a coluna do bloco, que nomeia quem reclassificou), mais uma secção
nova que diz o que o bloco acrescentou e o que não pode ser linha.
`critica/REVISOES-DO-INVENTARIO.md`: a entrada do bloco `leitura`.

## 4 · O que se perde, dito

**Nenhuma frase sai do sítio, e por pouco.** A primeira passagem tirou duas: a
definição da dívida pública e a da taxa de emprego, nas duas edições, porque a
leitura dessas medidas na primeira página tinha sido reduzida a uma linha com a
porta para o domínio. A leitura a frio do Codex mediu o que essa instrução
custava (Blocking 3), o lugar de direção corrigiu a decisão no mesmo dia, e as
duas voltaram com a leitura inteira. As quatro linhas do inventário voltaram a
«viva». **A §9 conta a passagem por extenso.**

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
| J3 | sem guião: as 21 leituras presentes, fechadas, com `id` | não havia leituras | 21 de 21, 0 abertas, 0 sem id, 0 com id errado, 21 com `<summary>`, **nas duas edições e nos dois motores** (quatro células) | `leitura.mjs` J3 |
| J4 | com guião: um toque abre a sua e fecha a anterior, e o endereço passa a `#<id>` | não havia | **os 21 cartões tocados em português e 5 em inglês, nos dois motores**: 18 abrem a sua leitura aqui, uma de cada vez, com `#m-<id>` na barra; 3 vão à página do domínio, à âncora daquela medida | `leitura.mjs` J4 |
| J5 | a secção dos domínios a seguir ao mapa | não havia | 1 domínio, depois do mapa e antes da área de leitura, com a porta para `/dominios/economia-e-financas-publicas` (e o par inglês) e a faixa de 2 cartões com «n de 2»; nenhum valor selado repetido | `leitura.mjs` J5, `porta.mjs` A17 |
| J6 | a altura de `/` a 390 menor do que hoje | **6 959 px** (`/`) · **6 911 px** (`/en`) | **4 667 px** (menos 2 292) · **4 625 px** (menos 2 286), e **os mesmos depois da segunda passagem**: o conteúdo reposto vive dentro de dobras fechadas e não custa altura (§9.1) | `leitura.mjs` J6, `porta.mjs` A2 |
| J7 | o primeiro ecrã a 390 × 664 igual ao do F1.1 | fundo máximo 653,7 px (`/`) · 641,1 px (`/en`) | **653,7 px · 641,1 px**, os mesmos | `leitura.mjs` J7, `porta.mjs` A1 |
| J8 | `/estudos` a ≤ 1 toque e ≤ 1,5 ecrãs | a porta mais acima a 662,7 px (1 ecrã) em `/`, 650,1 px (0,98) em `/en` | **os mesmos** | `porta.mjs` A15 |
| J9 | nenhum número novo, com as diferenças ditas | *(ver a §5.1)* | *(ver a §5.1)* | `numeros-novos.mjs` |
| J10 | `build`, `verify` e `typecheck` a 0, e as réguas de `tests/inicio` | *(ver a §5.2)* | *(ver a §5.2)* | os três comandos |
| J11 | as plantas vermelhas e depois verdes | não havia | 5 de 5, e cada uma diz agora QUAL das células nomeadas não estava verde antes | `leitura.mjs --vermelhos` |

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
| `data-nonledger` | 16 → 16 | 74 690 → 74 832 |
| `data-verbatim` | 6 → 6 | 23 → 23 |

**Estas contagens do sítio inteiro são as deste bloco, medidas antes de
`origin/main` em `95d5ca95` entrar no ramo**, porque é assim que a diferença é só
dele. Sobre a árvore já fundida o mesmo comando dá `data-prova` **14 588** e
`data-nonledger` **108 832** (`data-claim` e `data-verbatim` não mudam): as duas
subidas são do bloco F1.4, que acrescentou a busca do índice do livro-razão e as
datas de publicação lidas do repositório, e nenhuma delas passa por `/` nem por
`/en`. **As contagens de `/` e de `/en`, que são as que este bloco mexeu, são
iguais nas duas árvores**, motivo a motivo, medidas com
`--so index.html,en/index.html` nas duas.

**Em `/` e `/en`, as diferenças, uma a uma, e cada uma reconciliada:**

| classe · valor | antes | depois | porquê |
|---|---|---|---|
| `data-claim` (distintos) | 22 | **24** | entram `saldo-das-administracoes-publicas-2025` e `ganho-medio-mensal-2024`, os dois cartões da faixa do domínio. **Nenhum dos 21 é contado duas vezes** (a régua A3) |
| `data-claim` (ocorrências) | 44 | 48 | os dois valores novos, nas duas edições |
| `data-nonledger="data-da-linha"` | 0 | **126** | as três datas de cada uma das 21 leituras, nas duas edições (21 × 3 × 2) |
| `data-nonledger="numeracao"` | 84 | 92 | o «n de N» dos dois cartões da faixa do domínio (2 × 2 × 2) |
| `data-nonledger="data-de-referencia"` | 88 | 92 | a unidade dos dois cartões novos, nas duas edições |
| `data-nonledger="proveniencia"` | 86 | 90 | os selos dos dois cartões novos, nas duas edições |
| `data-nonledger="escala-de-instrumento"` | 62 | **62** | sem diferença |
| `data-nonledger="limiar-do-quadro"` | 60 | **60** | sem diferença |

**As duas últimas linhas são a prova da segunda passagem.** Durante a primeira,
com as três leituras reduzidas a uma porta, `escala-de-instrumento` caía de 62
para 50 e `limiar-do-quadro` de 60 para 56, e `proveniencia` e
`data-de-referencia` desciam em vez de subirem: eram a régua e o limiar da dívida,
os escalões etários da taxa de emprego e três selos a sair da página. Com a
leitura inteira reposta, as quatro contas fecham no sítio certo.

As contagens de antes saíram da construção de `1dbd1cef` numa árvore própria; as
de depois, desta. Cada linha da segunda tabela fecha à unidade.

### 5.2 · J10 · os três comandos e as réguas

Os três, sobre a árvore da primeira passagem, já com `origin/main` em `0b51016d`
fundido, com os códigos lidos de ficheiros e não de um `echo` a seguir a um
comando em segundo plano:

```
npm run build     > build-final.log 2>&1; echo $? > build-final.code   →  0
npm run verify    > verify-final.log 2>&1; echo $? > verify-final.code →  0
npm run typecheck > tc-final.log 2>&1; echo $? > tc-final.code         →  0
```

Depois da segunda passagem, e da fusão de `origin/main` em `95d5ca95` (o bloco
F1.4, que pôs a `check:indice` dentro da `verify` e mudou o `package.json`), os
três voltaram a correr sobre a árvore fundida, com um `npm ci` novo pelo meio: os
códigos estão na §10.2, e são os mesmos.

**As treze réguas de `tests/inicio`**, corridas sobre a construção final. O
décimo quarto ficheiro da pasta, `capturas.mjs`, não conta aqui porque não mede:
fotografa, e o que ele deu está na §8. O «antes» de cinco delas está medido: `porta` e `faixa` correram na árvore deste
ramo antes de uma linha mudar, e `matriz`, `correcoes-a` e `mapa-navegacao`
correram numa árvore própria construída em `1dbd1cef`, para que a diferença fosse
do bloco e não de outra coisa. Das outras oito não há medida de partida, e a
coluna diz isso em vez de a inventar.

| régua | antes (`1dbd1cef`) | depois | o que mudou nela |
|---|---|---|---|
| `leitura` | não existia | **18 de 18 células, 5 de 5 plantas** | nova; a segunda passagem levou-a de 13 a 18 células (a J3 e a J4 nas duas edições e nos dois motores) |
| `porta` | 34 de 34 | 34 de 34 | A10 conta dentro das leituras e exige as duas coleções não vazias; A13 lê a faixa da cabeça; A17 lê faixa a faixa; duas plantas mudaram de alvo (a da A3, cujo alvo saiu da página; a da A2, cujos mil píxeis de papel deixaram de chegar) |
| `faixa` | 80 de 80 | 80 de 80 | F1 e F12 comparam os cartões da faixa da cabeça com as leituras da página |
| `lista` | não medida na partida | 94 de 94 | L8 conta as leituras de cada metade |
| `matriz` | **3 de 84 vermelhas** | **as mesmas 3** | dezassete sítios seguem a coisa que agora lá está; nenhuma célula nova ficou vermelha |
| `correcoes-a` | 32 de 32 | 32 de 32 | nenhuma mudança na régua; o alvo do nome do domínio foi feito de 44 px depois de ela o recusar |
| `mapa-navegacao` | 9 de 9 | 9 de 9 | N3 lê o corpo da página na área de leitura |
| `app`, `areas`, `mapa-distritos`, `regioes`, `rotulo`, `numeros-novos` | não medidas na partida | verdes | nada |

**As três células vermelhas da matriz são as mesmas antes e depois**, e nenhuma é
deste bloco: «a linha da reconferência», «Emenda 14 · um concelho sem estudos
rende as sete peças» (a página de Águeda rende oito) e «a língua de um título
citado» (a exceção aprovada da §1.91, decisão 6). As duas primeiras foram
medidas na árvore de partida com o mesmo comando.

**As treze correram outra vez sobre a construção da árvore com `origin/main` em
`95d5ca95` fundido**, e deram os mesmos números, célula a célula: `leitura` 18 de
18, `porta` 34 de 34, `faixa` 80 de 80, `lista` 94 de 94, `app` 39 de 39, `areas`
22 de 22, `correcoes-a` 32 de 32, `mapa-distritos` 43 de 43, `mapa-navegacao` 9 de
9, `regioes` 30 de 30, `rotulo` 7 de 7, `numeros-novos` verde, e a `matriz` as
mesmas **3 de 84** com os mesmos três nomes. As cinco plantas da `leitura` e as
treze da `porta` também. **Correr outra vez não era formalidade**: o F1.4 mexeu em
`ValorDaProva.astro` e em `NomeDaMedida.astro`, que a primeira página usa. As oito
capturas refeitas sobre a árvore fundida saem byte a byte iguais às que já estavam
no ramo, e as seis alturas da §8 não mudam.

## 6 · Os estragos plantados (J11)

`node tests/inicio/leitura.mjs --vermelhos` planta cinco estragos no HTML servido,
entre o ficheiro e o navegador, e exige três coisas de cada um: **verde antes**
(as células que ele nomeia passam sem ele), **o HTML mudou** (a transformação dá
bytes diferentes) e **vermelho depois** (todas as células nomeadas caem).

| planta | células |
|---|---|
| um painel de baixo de volta (a peça com o nome da medida) | J1.pt |
| um `<details>` da área de leitura sem id | J3.pt.chromium, J3.pt.webkit, J12.pt |
| a secção dos domínios sem a porta | J5.pt |
| a leitura de uma medida do domínio reduzida a uma linha com a porta | J12.pt |
| a faixa do domínio com um valor selado repetido | J5.pt |

**As cinco passaram**, com as três exigências cada uma, e cada linha diz agora
QUAL das células nomeadas não estava verde antes (Major 7 da leitura a frio: um
relatório de plantas que não o diga não é reproduzível por quem lê). A quinta é a
que o brief pede; a quarta inverteu-se na segunda passagem, e passou a repor o
defeito que a leitura a frio mediu (a leitura de uma medida do domínio reduzida a
uma linha), que é o que a J12 tem de recusar; as outras três são as do §4 do
brief.

**E as treze plantas de `porta.mjs` também**, depois de duas mudarem de alvo: a
da A3 apontava a uma marca que saiu da página com o painel (e mudou duas vezes no
mesmo dia, porque a classe da área de leitura também mudou), e a da A2 punha mil
píxeis de papel no fim do corpo, que deixaram de levar a página acima do teto
quando ela encolheu 2 292 px. Passou a cem mil, que é maior do que qualquer teto
que a casa venha a escrever. As sete plantas de `faixa.mjs` passaram sem
mudança.

## 7 · O que não se fez, e porquê

1. **A faixa do domínio com cinco cartões** (§1, item 5 do brief). Medidas as duas
   formas, ficou a que o próprio brief autoriza. Ver a §2.2, com o que cai em cada
   uma.
2. **A manchete do domínio na secção dos domínios** (§1, item 3). O seu primeiro
   valor é uma linha que já é um cartão desta página, e a régua A3 conta
   `data-claim` por id. Ver a §2.3.
3. **O valor com selo dentro da leitura breve** (§1, item 1). Mesma razão, e a
   medida J2 exige a A3 verde. Ver a §2.1.
4. **A fila dos estudos não mudou de sítio, e a decisão está tomada.** O item 4
   do brief diz duas coisas que não podem ser as duas verdade: «fica onde o F1.2b
   a pôs» e «depois da secção dos domínios». O F1.2b pô-la dentro do bloco da
   faixa, logo por baixo dos cartões, e é lá que ela cumpre a medida J8 (a ≤ 1
   toque e ≤ 1,5 ecrãs, que a célula A15 de `porta.mjs` mede); depois da secção
   dos domínios ficaria a mais de três ecrãs, e a J8 cairia. A leitura a frio
   apanhou o conflito (Major 4) e **o lugar de direção decidiu a 04.09.2026: a
   fila dos estudos fica logo a seguir à faixa, onde o F1.2b a pôs e onde cumpre
   o ecrã e meio, e a secção dos domínios vem depois do mapa.** É o que a página
   faz, e a célula J5 mede a ordem («depois do mapa» e «antes da área de
   leitura»).
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

## 9 · A segunda passagem, sobre a leitura a frio do Codex (04.09.2026)

A leitura está em
`design/especime-v3/critica/2026-09-04-codex-leitura-f11b-leitura.md`. O leitor
viu **as cinco plantas de três classes** (5 de 5) e trouxe nove achados
distintos. A triagem é do lugar de direção, pela delegação da §1.98, e está no
cabeçalho daquele ficheiro. O que esta passagem mudou:

### 9.1 · Blocking 3 (com o Blocking 2) · a leitura das três medidas do domínio volta inteira

**O achado.** Reduzir a leitura dos três cartões do domínio a uma linha com a
porta apagou conteúdo do leitor, e não o compactou. Medido pelo leitor, por
edição: a primeira página passava de **7 para 5 definições**, de **13 para 12
limiares**, de **13 para 12 réguas** e de **21 para 18 selos de fonte** na área de
leitura. Saíam a definição da dívida pública e a da taxa de emprego, o limiar e a
régua da dívida, e três portas para a linha.

**A origem.** A instrução era do lugar de direção, de 04.09, e não do brief; o
brief §1 item 1 manda cada cartão abrir a sua leitura com o limiar ou a posição,
o contexto, as datas e a porta para a linha. A primeira passagem seguiu a
instrução e escreveu a perda na §4; o leitor mostrou que a perda era maior do que
o que estava escrito.

**A decisão corrigida** (lugar de direção, 04.09.2026): **os 21 cartões têm a
mesma leitura breve** (a definição, o limiar ou a posição com a régua, as três
datas, o selo da fonte; o valor fica só no cartão), **e os três do domínio
acrescentam a porta «Ver no domínio →» no fim.** É o que a página faz agora, e é
o que a célula J12 mede leitura a leitura. A planta que media a forma antiga
inverteu-se: passou a repor a linha única com a porta, e a J12 tem de a recusar.

**A altura não subiu com o conteúdo reposto, e isso mediu-se.** O lugar de
direção esperava que a J6 subisse; não subiu: `/` a 390 continua a **4 667 px** e
`/en` a **4 625 px**, os mesmos números da primeira passagem. A razão é a forma:
tudo o que voltou (as duas definições, o limiar e a régua da dívida, os três
selos) vive DENTRO de um `<details>` fechado, e uma dobra fechada mede o seu
`<summary>` e mais nada. O que a segunda passagem devolveu ao leitor não custa um
píxel a quem não abre a leitura, e é essa a forma que o bloco escolheu.

### 9.2 · Major 4 · a ordem, decidida

Ver a §7, item 4. A fila dos estudos fica logo a seguir à faixa; a secção dos
domínios vem depois do mapa. A J5 mede as duas metades da ordem.

### 9.3 · Major 7 · as réguas passam a provar o que dizem

| o que o leitor mediu | o que mudou |
|---|---|
| a J3 corria só em português: uma leitura inglesa sem `id` não caía em célula nenhuma | **J3 corre nas duas edições e nos dois motores** (quatro células) |
| a J12 nunca lia o `id` | **a J12 lê o `id` duas vezes**: conta `id="m-<id>"` no HTML servido, uma vez por medida, e compara-o com o `id` do `<details>` no navegador |
| a J4 tocava nos dois primeiros cartões locais em Chromium | **a J4 toca nos 21 em português e numa amostra de cinco em inglês, nos dois motores**, e exige de cada cartão o que a sua classe promete: o que leva a uma âncora desta página abre a sua leitura e fecha a anterior; o que leva à página do domínio chega à âncora daquela medida lá dentro. A amostra inglesa apanha as duas classes de propósito |
| o relatório das plantas não era reproduzível quando uma célula já estava vermelha | **cada planta diz agora QUAL das células nomeadas não estava verde**, ou que ela não existe |

### 9.4 · Major 6 · a porta declarada em prosa, como o F1.9a

A cadeia «Ver no domínio →» / «See it in the domain →» **não pode** ser uma linha
`viva` do `INVENTARIO-FRASES.md`: as medidas 8 e 9 da régua da voz excluem o
texto que vive dentro de um `<a>`, e a exclusão corre nos dois sentidos, de modo
que uma linha `viva` assim fecha a construção. A declaração passou a ter a forma
que o F1.9a usou para «Subir» / «Back to top»: um parágrafo com o nome, as duas
edições, a origem (`src/i18n/strings.mjs`, `dominios.verNoDominio`), o limite
mecânico por extenso, e a nota de que **o buraco é do F3.1** e não deste bloco.

### 9.5 · O que a reposição obrigou a mexer nas réguas, e nada mais

Repor a leitura inteira nas três medidas do domínio mudou o que cinco células da
`matriz` contavam, e as cinco seguem a coisa em vez de a esconder:

| célula | antes da reposição | depois |
|---|---|---|
| «sem JavaScript» (cinco endereços) | a área de leitura levava **18** selos | leva **21**, um por leitura |
| «a régua de uma leitura aberta» (768 e 1280) | as leituras com porta saíam da conta, porque não tinham régua | **todas as que têm limiar entram**: onde há linha de limiar há régua |
| «nenhum par de áreas de toque sobrepostas na leitura» | o selo e a porta ficavam a 17 px, e as áreas efectivas cruzavam-se por 1,4 px | **27 px de ar por cima da porta**, medidos: as duas áreas deixam de se tocar |
| «o selo é o maior alvo do corpo da leitura» | o selo mede 52,5 × 19,2 px e a porta 105,8 × 32 | **a porta sai da conta, com a razão escrita**: não é aparelho da leitura, é um destino sozinho na sua linha, e a célula acima já mede que os dois não se tocam |
| «Emenda 16 · o Painel Social tem oito leituras» | a célula excluía da conta dos selos as leituras COM porta, porque a primeira instrução as reduzia a uma linha | **conta as oito**, e a das portas fica ao lado com o seu número exigido (`portas === 2`, e não `> 0`) |

**A quinta linha é um achado desta passagem e não da anterior, e o modo como
apareceu diz-se.** Com a leitura reposta, a exclusão que a célula fazia deixou de
ser verdadeira e passou a ser um buraco: **dois dos oito selos do Painel Social
ficavam por medir e a célula passava à mesma**, porque o que ela contava era o
resto. Não foi uma régua que o apanhou, foi a releitura dos comentários do
próprio bloco à procura de frases que descrevessem a forma antiga. Corrigida, a
célula mede `8 leituras, todas com selo (2 acrescentam a porta para o domínio)`,
e a `matriz` continua nas mesmas **3 de 84**.

### 9.6 · Major 8 e Minor 9 · ficam, e diz-se porquê

**Major 8**: o comando da densidade abre as 21 leituras de uma vez, e é de
propósito. Ele é a DENSIDADE («Relance» e «Leitura breve», as duas palavras da
casa desde a Emenda 2), e não um toque num cartão: o estado `?densidade=leitura`
é partilhável desde a Emenda 7 e continua a resolver. A promessa de «uma de cada
vez» é a do TOQUE NUM CARTÃO, e é essa que a J4 mede, agora nos 21.

**Minor 9**: «Domínios» aparece como título da secção e outra vez no rótulo de
destino dos cartões do domínio. Fica: é o nome da família de páginas, é a
sobrancelha com que a página de chegada se nomeia, e é a palavra que o menu já
usa. Não é conteúdo de medida repetido: as duas medidas da faixa do domínio são
novas na primeira página e não duplicam nenhuma das 21.

### 9.7 · O que a segunda passagem mediu

`node tests/inicio/leitura.mjs --vermelhos`, sobre a construção final:

```
  leitura ✓ 18 de 18 célula(s) · plantas ✓
```

* **J12** · 21 leituras inteiras (unidade, três datas e selo em todas; **13 com
  limiar e régua**, e **7 com a definição da medida**), e 3 delas acrescentam a
  porta para o domínio. Os números que o leitor mediu do outro lado eram 12
  limiares, 12 réguas, 5 definições e 18 selos; voltaram a 13, 13, 7 e 21;
* **J3** · quatro células (`pt`/`en` × Chromium/WebKit), 21 leituras de 21, 0 sem
  `id`, 0 com `id` errado, e as 21 âncoras contadas no HTML servido;
* **J4** · quatro células. Em português, **21 cartões tocados** nos dois motores:
  18 abrem a sua leitura aqui, uma de cada vez, e 3 vão à página do domínio. Em
  inglês, a amostra de cinco (2 de domínio e 3 locais), nos dois motores;
* **as cinco plantas**, com «verde antes» célula a célula.

### 9.8 · O que era planta, e não achado

O Blocking 1 (as leituras sem `id`, na fonte e no diff), a parte do Major 7 sobre
o `!d.id` trocado por `false`, e o Major 5 (o relatório a dizer 5 667 px numa
tabela e 4 667 noutra) são as plantas P1a, P1b, P2, P3 e P4 do pacote. O leitor
viu as cinco.


## 10 · A cabeça, a fusão do `main` e a corrida do portão

**`8400fbec`, verde na corrida `portao` n.º 33837745555**, das 04:41:36 às
05:05:35 UTC de 04.09.2026 (23m59s). Esta cabeça é a fusão de `origin/main`
em `95d5ca95` (o bloco F1.4: os nomes, as datas e a busca do índice do
livro-razão) dentro deste ramo.

### 10.1 · O que a fusão trouxe, e o único conflito

O F1.4 mexeu nas vistas do livro-razão e das áreas, na `LinhaView`, em
`datas.mjs`, no `gate-html.mjs`, no `package.json`, no fluxo de trabalho e nos
ficheiros da voz. **Não tocou na `HomeView`, nem em `src/components/inicio/`, nem
em `inicio.css`, nem em `public/js/inicio.js`** (medido com
`git diff --name-only`, com um positivo conhecido ao lado a provar que o comando
apanha).

**Mas tocou em duas peças partilhadas que a primeira página usa**, e isso mediu-se
em vez de se supor: `NomeDaMedida.astro` (peça nova) e `ValorDaProva.astro`, que
passou a escrever `dd.mm.aaaa` numa chave da prova que é uma data. A chave é
`painel_reconferido_em`, e ela não se rende em `/` nem em `/en`: as onze chaves da
prova destas duas páginas estão medidas, e não é nenhuma delas. **A consequência
medida é nenhuma**: as treze réguas dão os mesmos números sobre a árvore fundida
(§5.2), as contagens das quatro classes de algarismos em `/` e `/en` são iguais
motivo a motivo (§5.1), e as oito capturas refeitas saem byte a byte iguais às que
já estavam no ramo.

Houve **um conflito, e num ficheiro de registo**:
`design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`, onde os dois blocos
acrescentaram uma linha a seguir à do bloco `porta`. Resolveu-se apagando as três
marcas do conflito e mais nada: ficaram as duas linhas, a `leitura` deste bloco e
a `nomes` do F1.4, por esta ordem. Não ficou nenhuma marca de conflito em ficheiro
nenhum da árvore: `git grep -nE '^(<{7} |={7}$|>{7} )'` não devolve nada, e a
mesma peneira corrida sobre um ficheiro com um conflito a sério devolve as três
linhas, que é o que prova que ela apanha.

### 10.2 · Os três comandos, outra vez, sobre a árvore fundida

O F1.4 pôs a `check:indice` dentro da `verify` e mudou o `package.json`, e por
isso a árvore fundida levou um `npm ci` novo antes dos comandos.

| comando | código |
| --- | --- |
| `npm run build` | **0** |
| `npm run verify` | **0**, já com a `check:indice` lá dentro, verde |
| `npm run typecheck` | **0** |

Os três códigos foram lidos dos ficheiros de cada comando (`build-p5.code`,
`verify-p5.code`, `tc-p5.code`), e não do que o terminal disse a seguir a um
comando em segundo plano. **Cada commit que escreve ou corrige esta secção levou
os três antes do empurrão**, e os dois últimos deram **0, 0 e 0** (`*-p7.code` e
`*-p8.code`), com as treze plantas da `porta` e as cinco da `leitura` verdes
depois deles. O que muda entre a última corrida dos comandos e o commit é a prosa
deste relatório, que portão nenhum lê; quem confere a árvore exacta que foi
empurrada é a corrida do `portao` sobre ela. **Uma nota de método, porque custou uma medição errada:** a primeira
corrida das plantas da `porta` sobre a árvore fundida caiu com um tempo esgotado à
espera de `[data-grelha] h1`, e não era defeito nenhum: um `npm run build` corria
ao mesmo tempo e reescreve `dist/`, que é o que as plantas servem. Uma régua que
lê `dist/` não corre ao lado de um comando que o refaz.

### 10.3 · As corridas deste ramo

*(`8400fbec` é a cabeça que o resto deste relatório mede; as que vêm depois são os
commits que escrevem esta secção, e o parágrafo do fim diz porquê)*

| corrida | cabeça | como acabou |
| --- | --- | --- |
| 33828544853 | `0ef0a291` | cancelada pelo empurrão seguinte |
| 33829193640 | `a3d53ac8` | **verde** em 22m17s (primeira passagem) |
| 33836453244 | `9f3998fd` | cancelada pelo empurrão seguinte |
| 33837061176 | `9b20a2b8` | cancelada pelo empurrão seguinte |
| 33837745555 | `8400fbec` | **verde** em 23m59s (segunda passagem, com o `main` fundido) |
| 33840337730 | `a81bc122` | **verde** em 18m15s (o commit que escreveu esta secção) |

Os três cancelamentos são o `cancel-in-progress` do fluxo de trabalho: cada
empurrão novo mata a corrida da cabeça anterior. Nenhuma corrida deste ramo ficou
vermelha.

**A corrida da cabeça fundida leva 23m59s contra o tecto de 30 minutos** do
`timeout-minutes` em `.github/workflows/portao.yml`: a construção 12m47s e a
`verify` 5m48s, e o resto é o anfitrião, o `npm ci` e o Chromium. O F1.4 mediu
20m30s no mesmo dia, e a corrida da primeira passagem deste ramo levou 22m17s. Não
é uma regressão de um bloco, é a soma deles: seis minutos de folga é pouco, e o
tecto é uma decisão do diretor. **As corridas não levam todas o mesmo**: a
seguinte, sobre a mesma árvore mais prosa, levou 18m15s, e a diferença é do
anfitrião e da cache do `npm`, não da árvore. Quem decidir mexer no tecto tem de
olhar para a pior e não para a média.

*Esta secção é ela própria um commit, e por isso a cabeça que ele faz não é a que
está escrita acima: é a mesma disciplina que o F1.4 seguiu na §10.6 do relatório
dele. Os três comandos correram outra vez sobre a árvore dele antes do empurrão, e
a corrida dele fica no registo do ramo.*

**O bloco não foi fundido em `main`.**
