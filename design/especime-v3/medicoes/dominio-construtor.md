# F1.2 · a página do primeiro domínio · relatório do construtor

*Ramo `dominio-2026-09-03`, tirado de `origin/main` em `d8b14a88` e fundido com
`d447286f` antes de fechar; a construção é o commit `f5f66e30`. Construtor
Claude Opus 5, 03.09.2026. O bloco é o F1.2 do
`design/observatorio/PLANO-fiabilidade-2026-09-02.md` §3, escrito no
`design/observatorio/BRIEF-F1.2-pagina-do-dominio.md`. Sem travessões na prosa.*

## 1 · O resultado, em cinco linhas

A página do primeiro domínio existe nas duas edições, com a cabeça comum, a
manchete de números selados, a faixa das cinco medidas, a frase da fronteira, as
dez leituras breves com as três datas e a ausência de T4a dita como ausência. O
índice dos dezoito domínios da carta existe, cada um com o seu estado. O ganho
médio mensal entrou nas 308 páginas de concelho, nas duas edições, com o controlo
positivo verde.

**Duas das quatro formas gráficas desenham; as outras duas recusam-se, e a recusa
é mecânica e medida:** o livro-razão não tem um segundo período de nenhuma das
dez medidas deste domínio, nem uma única linha de um Estado-membro que não seja
Portugal. As duas funções que as desenhariam existem e devolvem `null`; no dia em
que o motor atravessar a segunda linha, elas desenham sem que uma linha de
código mude.

Três coisas ficaram diferentes do que o brief supôs, e as três estão
argumentadas na §7: o slug da edição inglesa, o estado do domínio «Trabalho» no
índice, e a medida que o mapa de E5 pinta.

## 2 · O que entrou, item a item do brief §2

| # | o que o brief pede | onde está |
|---|---|---|
| 1 | a rota e as páginas | `src/lib/routes.mjs` (`dominios`, `dominio`), `src/pages/dominios/{index,[slug]}.astro`, `src/pages/en/domains/{index,[slug]}.astro`, `src/views/DominioView.astro`, `src/views/DominiosView.astro`, `src/data/dominios.mjs` |
| 2 | a cabeça comum | `CabecaDoLugar.astro` com `forma="lugar"`, o mesmo componente das três camadas; **sem instrumento**, e o componente aprendeu a não render a coluna vazia quando a camada não tem um |
| 3 | a faixa das cinco medidas | `Faixa.astro`, o mesmo componente; cada cartão abre a leitura breve daquela medida na mesma página (`#m-e3`, `#m-e2`, `#m-t1`, `#m-t2`, `#m-t3`) |
| 4 | a frase da fronteira | `<p class="dominio-fronteira" id="fronteira" data-fronteira>`, uma vez, com id; o texto está em `src/data/dominios.mjs` |
| 5 | a leitura breve de cada medida | as dez, com o valor selado, o limiar quando existe, as três datas, a fonte pela marca forte, e a forma que a fonte permite |
| 6 | a regra dos vazios | o cartão de T4a, com a pergunta da carta, «Não há número público para isto.», a fonte que se procurou e a razão do inventário |
| 7 | as quatro formas, e o portão | `src/components/formas/*`, `scripts/check-formas.mjs`, `npm run check:formas` no `build` e no `verify` |
| 8 | o ganho médio nas 308 páginas de concelho | a oitava medida de `MEDIDAS_DO_CONCELHO`, ligada a cada concelho pelo código do INE. **`src/views/MunicipioView.astro` não foi tocado**, e é a prova de que o bloco dos 308 desenhou bem a peça: a medida nova entra pela declaração, e a vista rende as oito como rendia as sete |
| 9 | os cartões da primeira página a apontarem ao domínio | **não feito**, e a razão é a do brief: o F1.1 é dono de `HomeView.astro` e ainda não se fundiu (§8) |
| 10 | a emenda à §1.90 e o `VISAO.md` §4 | `DECISIONS.md` §1.90, emenda de 03.09.2026; `VISAO.md` §4, camada 2 |

## 3 · As medidas de aceitação, B1 a B15

| # | medida | medido | como |
|---|---|---|---|
| B1 | as duas páginas do domínio existem, com canonical e hreflang cruzados, no sitemap, sem `noindex` | **verde** | `dist/dominios/economia-e-financas-publicas/index.html` (466 212 B) e `dist/en/domains/economia-e-financas-publicas/index.html` (466 213 B); canonical de cada uma para si própria; `hreflang` `pt-PT`, `en` e `x-default` iguais nas duas; `grep -c noindex` a **0** nas quatro páginas novas; as quatro no `dist/sitemap-0.xml` |
| B2 | «Ganho médio» em 308 de 308 páginas de concelho nas duas edições, com o controlo positivo a 308 | **308/308 nas duas** | `grep -l 'Ganho médio mensal' dist/municipios/*/index.html \| wc -l` → 308 de 308; `'Average monthly earnings'` em `dist/en/municipalities/*` → 308 de 308; controlo «População residente» 308 e «Resident population» 308 |
| B3 | as 314 linhas da §1.90 alcançáveis da página do domínio | **314 de 314, a 2 portas** | `node tests/dominio/alcance.mjs`: 0 portas → 7 das 314 citadas na própria página; 1 porta → 7; **2 portas → 314 das 314**; 3 portas → 314. A régua lê as 314 do livro-razão (as 6 do estudo `dominios-2026` e as 308 cujo localizador é o indicador 0012656), e não de uma lista escrita |
| B4 | as quatro formas só, SVG estático, sem `<script>`; cada número desenhado resolve numa linha; o portão recusa um número solto, provado com uma planta | **verde** | `npm run check:formas` (F2, F3) e a planta P1 da régua, vista vermelha e depois verde |
| B5 | cada leitura breve com as três datas em dd.mm.aaaa e a fonte nomeada como a linha a diz | **60 datas conferidas** (10 medidas × 3 × 2 edições) | `check:formas` F1 recompõe cada data do livro-razão por `dataDaCasa()` e compara-a carácter a carácter; F5 exige três por leitura breve com valor. A fonte entra por `data-linha-campo`, que o `gate:html` compara com o campo da linha |
| B6 | a regra dos vazios; zero valores inventados; `git diff` do livro-razão vazio | **verde** | `git diff --stat -- ledger/claims/` **vazio**, 2 916 linhas antes e depois; o único ficheiro tocado sob `ledger/` é `allowlist.yml` (+27 linhas: os dois motivos novos, com a razão de cada um). O cartão de T4a rende a pergunta, «Não há número público para isto.», a fonte procurada e a razão, sem um único valor |
| B7 | a manchete com todos os algarismos como valores da prova recontados pelo portão; nenhuma subtração à mão | **verde** | `npm run gate:html` a 0. A frase é «A dívida pública é 89,7 % do PIB, fora do limiar de 60 %; o saldo das administrações públicas é 0,7 % do PIB, dentro do limiar de −3 %.»: **89,7** e **0,7** são `<Claim/>`, **60** e **3** são `limiar-do-quadro`, e as duas palavras de estado saem de `estadoDaMedida()` sobre os mesmos números. Nenhuma diferença ao limiar |
| B8 | a frase da fronteira uma vez por página, com id, rastreável à carta | **1 de 1** | `check:formas` F4 conta os `[data-fronteira]` e exige exactamente um com id; a planta P3 duplica-a e o portão vê-a. As palavras vêm da carta: §5 deste relatório |
| B9 | o índice com os 18 domínios, o primeiro com ligação e os outros sem | **18, com 1 + 1 + 16** | 18 `<li data-dominio>` em cada edição. **1** com página própria («Economia e finanças públicas»), **1** com porta para a página onde as suas medidas vivem («Trabalho»), **16** sem ligação e com «ainda sem medidas conferidas». A diferença para a letra do brief está argumentada na §7 (b) |
| B10 | nenhum número novo no sítio | **2 916 de 2 916, e 0 fora** | o sítio construído cita **2 916 ids distintos**, que são exactamente as 2 916 linhas do livro-razão; **0 ids citados que não sejam linhas**. Com `git diff --stat -- ledger/claims/` vazio, nenhum número novo entrou: o que mudou foi que 314 linhas passaram a ter porta |
| B11 | a 390 × 664 o primeiro ecrã contém o nome, a manchete inteira, o primeiro cartão inteiro e o seu selo | **verde nas duas edições** | `node tests/dominio/medidas.mjs`: pt, rótulo até **231 px**, manchete até **435**, cartão até **625**, selo até **612**; en, **231 / 466 / 656 / 644**. Todos abaixo dos 664 |
| B12 | contraste ≥ 4,5:1 e ≥ 3:1 nos dois temas nas peças novas; texto alternativo em cada SVG | **verde, com uma nota medida** | ver a tabela do contraste, abaixo |
| B13 | `build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos; `check:voz` e `check:lingua` verdes | **0, 0, 0** | os três estados lidos de ficheiros escritos pelo próprio comando (`echo "exit=$?" > b6.exit`), e não de um `tail`. `voz ✓ … autorreferência 0 · nada por classificar`; `língua ✓ 7 222 páginas lidas` |
| B14 | uma régua nova com estragos plantados vistos vermelhos | **6 de 6** | §6 deste relatório |
| B15 | a §1.90 emendada com a data e o hash; o `VISAO.md` §4 conferido | **verde** | `DECISIONS.md` §1.90, «Emenda de 03.09.2026»; `VISAO.md` §4, camada 2, com o que existe e o que espera |

### O contraste, medido no que o navegador pinta (B12)

`getComputedStyle` sobre a página servida, e não as cadeias da folha.

| par | claro | escuro | limiar |
|---|---|---|---|
| a pergunta de cada medida | 16,39:1 | 15,38:1 | 4,5 |
| o nome da medida, as datas, a legenda | 6,24:1 | 9,52:1 | 4,5 |
| a frase da fronteira, o rótulo de uma classe | 16,39:1 | 15,38:1 | 4,5 |
| o fio de cada concelho no mapa (`--g2`) contra o papel | 3,47:1 | 5,80:1 | 3 |
| as duas classes do mapa do limiar, uma contra a outra | 3,70:1 | 3,70:1 | 3 |
| as cinco tintas da escala contra o papel | 1,22 · 1,74 · 2,91 · 5,60 · 12,35 | 1,25 · 1,88 · 3,79 · 7,84 · 13,74 | — |
| as cinco tintas, entre vizinhas | 1,42 · 1,68 · 1,93 · 2,20 | 1,50 · 2,02 · 2,07 · 1,75 | — |

**A nota, e é aritmética e não uma desculpa.** Cinco degraus ORDENADOS não podem
estar a 3:1 uns dos outros: 3⁴ = 81 e o contraste máximo entre duas cores é 21:1.
O que a WCAG 1.4.11 pede é que o OBJETO GRÁFICO se veja, e é isso que o fio de
`--g2` garante em cada um dos 308, seja qual for a sua classe (3,47:1 em claro,
5,80:1 em escuro). A classe lê-se do enchimento contra a legenda, com os cortes
escritos, e a alternativa em texto é a porta para os valores concelho a concelho.
A primeira redação punha o fio à cor do papel e a classe mais clara media
**1,12:1**: um concelho sem fronteira nenhuma. Foi a medição que o apanhou.

**O texto alternativo de cada desenho** vem do elemento que já escreve o nome da
medida, por `aria-labelledby`, e o que a régua mede é o TEXTO que um leitor de
ecrã ouve: «Dívida do município contra o limite legal», «Ganho médio mensal»,
«Ganho médio mensal». Nenhum desenho acrescenta uma palavra ao sítio.

### As capturas

32 PNG em `design/especime-v3/capturas/dominio-2026-09-03/`: as duas rotas novas,
nas duas edições, às **sete larguras da casa** (320, 360, 390, 430, 768, 1024,
1 280) no tema claro, mais o par a 390 no tema escuro, que é onde a escala do
mapa inverte.

## 4 · As quatro formas, e porque duas não desenham

As quatro estão em `src/lib/dominios.mjs`, uma função cada, e cada uma devolve
`null` quando as linhas de que precisa não existem. **A recusa é mecânica, e não
uma omissão de quem escreveu a página.**

| forma | o que pede | o que o livro-razão tem | desenha? |
|---|---|---|---|
| 1 · a série pequena do passado do país | dois ou mais períodos da mesma medida (mesmo `document.edition`, mesma unidade) | **um período** em cada uma das dez medidas deste domínio | não |
| 2 · onde Portugal está entre 27 | 27 linhas do mesmo conjunto e do mesmo período | **nenhuma linha** de um Estado-membro que não seja Portugal | não |
| 3 · a barra do concelho contra o país | a linha do concelho e a do país, na mesma unidade | as duas, para T3 | **sim**, uma vez |
| 4 · o mapa por concelho | as 308 linhas | as 308 do ganho médio (T3) e as 308 do índice de dívida (E5) | **sim**, duas vezes |

**A prova de que a forma 1 não pode desenhar** é a mesma leitura que a função
faz: nenhuma das dez medidas tem uma segunda linha no seu conjunto de dados. Vê-se
com o comando abaixo, que devolve as linhas do livro-razão agrupadas pelo
`document.edition` de cada uma das dez:

```
node --input-type=module -e "
const {loadClaims}=await import('./src/lib/ledger.mjs');
const {MEDIDAS_DO_DOMINIO_1}=await import('./src/data/dominios.mjs');
const cl=loadClaims();
for(const m of MEDIDAS_DO_DOMINIO_1){ if(!m.claim) continue;
  const e=cl.get(m.claim).document?.edition;
  const n=[...cl.values()].filter(c=>c.document?.edition===e).length;
  console.log(m.chave, e, n); }"
```

**A forma 4 compõe-se de dois artefactos, e o erro está medido.** O motor publica
as 29 unidades da Carta no campo nacional (`mapa/pais.json`, cada uma com a sua
`caixa`) e os concelhos de cada unidade na grelha local dessa unidade
(`mapa/distritos/<slug>.json`). Não há um caminho de concelho no campo nacional,
e o manifesto não publica a transformação entre as duas grelhas. Ela deduz-se dos
dois ficheiros: a união das caixas dos concelhos de uma unidade preenche o campo
local sem margem, e a transformação é a caixa da unidade sobre essa união.

A prova NÃO é de caixa (seria circular, porque é a caixa que define a
transformação): é de **área**. A soma das áreas dos concelhos transformados de
cada unidade contra a área do caminho dessa unidade em `mapa/pais.json`, medida
nas 29:

| unidade | erro |
|---|---|
| as 18 do continente | entre **−0,345 %** (Lisboa) e **+0,095 %** (Santarém); a maior em módulo é **0,345 %** |
| as 11 das ilhas | até **6,3 %** (Ilha do Corvo), onde o caminho da unidade tem 292 unidades de área e o erro é o arredondamento a inteiros do próprio artefacto |

Nenhuma coordenada é reescrita: a transformação vai num `transform` do grupo, e o
`d` de cada concelho é, carácter a carácter, o que o motor publicou. Os 308
caminhos valem **353 KiB** e por isso declaram-se **uma vez por página**
(`GeometriaDosConcelhos.astro`), com cada mapa a referi-los por `<use>`: o
segundo mapa custa 308 elementos e não 353 KiB.

**A cor de cada mapa tem a sua regra escrita.** O mapa do ganho médio usa cinco
tintas de cinzento com os cortes escritos ao lado (não há limiar publicado para o
que se ganha, e nenhuma cor da casa pode fazer de juízo onde a fonte não publica
referência, §1.79). O mapa do índice de dívida usa **duas classes só**, cobalto e
âmbar, que são as duas palavras que a casa já usa nas peças: o corte é o limite
do artigo 52.º da Lei n.º 73/2013, que a linha `indice-de-divida-limite-legal`
publica com o seu selo no valor da medida, logo acima do mapa. Em qualquer dos
dois, um concelho sem valor publicado leva **trama** e nunca uma cor da escala.

## 5 · As cadeias novas, com a origem de cada facto

**Onde cada cadeia vive, e porquê.** A mobília do sítio (rótulos, estados,
portas) está em `src/i18n/strings.mjs`, no bloco `dominios`, e a lista com o
inglês ao lado está em `design/especime-v3/CHAVES-EN.md`, na secção do bloco
F1.2. O CONTEÚDO do domínio (as perguntas, os nomes das medidas, as unidades, o
âmbito, a frase da fronteira e a ausência) está em `src/data/dominios.mjs`, ao
lado do id da linha de que fala, como as sete medidas de um concelho vivem em
`src/data/concelhos.mjs` e não em `strings.mjs`.

**A origem de cada facto, cadeia a cadeia:**

| o que se rende | de onde vem, palavra por palavra |
|---|---|
| os nomes dos dezoito domínios | a tabela do §2 da `CARTA-DOS-CONTEUDOS.md`, sem uma palavra mudada; o inglês é a tradução do nome da matéria |
| a vaga de cada domínio | a mesma tabela, coluna «vaga» |
| as dez perguntas | o §3 da carta, domínios 1 e 2, coluna «pergunta», transcritas |
| a pergunta da ausência (T4a) | a mesma pergunta de T4 da carta, com «no meu concelho» acrescentado, que é a coluna «concelho» daquela linha a dizer **não** |
| o nome de cada medida | a coluna «medida candidata» da carta, encurtada ao nome da série; onde o publicador nomeia um intervalo de idades, ele sai do nome e entra no campo `ambito`, que é a dimensão `age=` do `source_url` da linha |
| a unidade de cada medida | o campo `unit` da linha, dito em palavras da edição |
| o limiar de E3 (60 %) e de E2 (3 %) | o Eurostat, Statistics Explained, citado no inventário: «a Member State’s government deficit may not exceed 3 % of its GDP, while its debt may not exceed 60 % of GDP». O SINAL de E2 é lido e não adivinhado: a linha mede B.9, cuja dimensão do Eurostat se chama «Net lending (+)/net borrowing (−)», e por isso o limiar do saldo é um chão de −3 % |
| o limiar de E4 (5 %) | o excerto da linha `crescimento-da-despesa-liquida-2025`: «superando em 1,4 p.p. a taxa de crescimento de 5 % recomendada» |
| a ausência de limiar em T1 | a carta di-lo: a meta de 78 % é **da União no seu conjunto** e não de Portugal, e a meta nacional está `[verify]`. Um limiar que não é do país não se põe ao lado do valor do país |
| a frase da fronteira | a carta: o que o domínio mede é a lista das suas perguntas; o que não mede são as três exclusões que ela própria escreve (a produtividade, que manda para estudo; o produto abaixo das NUTS III, que a coluna «concelho» de E1 diz não existir; a disparidade salarial por concelho, que o inventário mostrou não ser publicada) |
| a razão da ausência de T4a | o inventário das fontes, linha T4: «o indicador do INE por concelho (`0012661`) é um coeficiente de variação do ganho, não a disparidade entre sexos» |
| a nota da oitava medida dos concelhos | a nota da própria linha do livro-razão: «trabalhadores por conta de outrem a tempo completo com remuneração completa» e o publicador primário, o GEP do Ministério do Trabalho |
| as três palavras de estado | `strings.mjs`, `estado.*`, decididas na etapa 0 e usadas em todo o sítio |
| «Leitura breve» / «Brief reading» | `densidade.leitura`, a cadeia da Emenda 2, já declarada no inventário desde 26.08.2026 |

**Nenhuma cadeia nova traz um algarismo.** As duas que traziam saíram antes do
fim: o nome acessível do mapa dizia «Os 308 concelhos» e passou a vir, por
`aria-labelledby`, do elemento que já escreve o nome da medida; e o nome de cada
medida dizia «dos 20 aos 64 anos» dentro do rótulo de um cartão, e o intervalo
passou a um campo próprio, debaixo do motivo declarado `ambito-da-medida`.

**Duas entradas novas em `ledger/allowlist.yml`**, cada uma com a sua razão:
`data-da-linha` (uma das três datas de uma linha, na forma da casa, com a linha e
o campo declarados e reconferidos por `check:formas`) e `ambito-da-medida` (o
intervalo que faz parte da definição publicada de um indicador). E **duas
exceções novas** em `VOZ-MARCADORES.md`, as duas da raiz «confer» e as duas com
rotas nomeadas: a ausência declarada de um domínio no índice, e o rótulo da
terceira data de uma medida.

## 6 · A régua e as plantas, vermelhas e depois verdes

`tests/dominio/pagina.mjs` **não é um portão**: é o conhecido-positivo do portão
que entra, `npm run check:formas`. Copia `dist/` com ligações duras (`cp -al`, e
a razão não é a velocidade: plantar um estrago é apagar a ligação e escrever um
ficheiro novo, e por isso nenhuma corrida da régua pode deixar `dist/`
estragado), planta um estrago de cada vez, corre o portão contra a cópia e exige
que ele saia **vermelho com a mensagem da célula que a planta nomeia**; depois
repõe e exige **verde**.

**O conhecido-negativo vem primeiro:** a cópia intacta tem de passar o portão
antes de qualquer planta. Se ele já estivesse vermelho, cada «vermelho» a seguir
não provava nada.

```
node tests/dominio/pagina.mjs
  a cópia intacta passa o portão · saída 0
  vermelho ✓ P1 · F2 · um número escrito à mão dentro do <svg> de uma forma · saída 1
  vermelho ✓ P2 · F5 · uma leitura breve sem as três datas · saída 1
  vermelho ✓ P3 · F4 · a frase da fronteira impressa duas vezes · saída 1
  vermelho ✓ P4 · F7 · uma das 308 linhas do ganho médio fora do alcance de uma página de concelho · saída 1
  vermelho ✓ P5 · F8 · o cartão de ausência com um valor do livro-razão · saída 1
  vermelho ✓ P6 · F1 · a data de uma medida trocada por outra data · saída 1
  reposto, o portão volta a verde · saída 0

  a régua do domínio ✓ 6 de 6 plantas vistas
```

**As cinco do brief, e uma sexta.** O brief §5 (B14) pede cinco: um SVG com um
número sem linha, uma leitura breve sem as três datas, a frase da fronteira
repetida, uma linha da §1.90 inalcançável, e o cartão de T4a com um valor. A
sexta é da regra 14 da casa: a marca `data-da-linha` é uma origem NOVA, e uma
origem nova sem um conhecido-positivo que a exercite é uma promessa. A P6 troca
uma data pela de outro dia e o portão vê-a.

**Uma planta que não planta nada não conta.** A régua compara o ficheiro antes e
depois de cada transformação e atira quando eles são iguais: foi assim que a P2
se apanhou a si própria na primeira corrida (o seu recorte não mordia, e ela
disse-o em vez de contar um falso vermelho).

**O portão, verde, imprime o que contou:**

```
formas ✓ 2 páginas de domínio · 6 desenhos (mapa-por-concelho 4 · barra-concelho-pais 2)
        · 60 datas de linha conferidas · 20 leituras breves · 2 ausências
        · ganho médio em 308/308 concelhos (controlo: população em 308)
```

## 7 · O que ficou diferente do brief, e porquê

**(a) O slug da edição inglesa.** O brief supôs
`/en/domains/economy-and-public-finances`. Ficou
`/en/domains/economia-e-financas-publicas`, com o mesmo `:slug` nas duas edições.
A razão é a espinha do encaminhamento: `matchPath()` tira o slug de um caminho e
`alternatesFor()` compõe com ele o caminho da outra edição, para o canonical,
para o hreflang e para o sitemap. Um slug por edição obriga a uma tabela de
tradução de slugs dentro do encaminhamento, de que dependem as 7 222 páginas
construídas, e isso é um bloco do encaminhamento e não uma escolha desta página.
A regra está escrita três vezes em `src/lib/routes.mjs` («o que se traduz é o
rótulo e nunca a chave») e vale hoje para as regiões, as áreas, os distritos, os
concelhos e os estudos. **Fica para o diretor**, com o custo dito.

**(b) O estado do domínio «Trabalho» no índice.** A medida B9 pede «os outros
dezassete sem ligação e com "ainda sem medidas conferidas"». Isso e o §0 do
brief («Economia e finanças públicas com Trabalho dentro») não podem ser
verdade ao mesmo tempo: as cinco medidas de Trabalho (T1, T2, T3, T4b, T5) estão
conferidas, estão no livro-razão desde a §1.90 e estão à vista na página do
primeiro domínio. Escrever «ainda sem medidas conferidas» debaixo do nome
«Trabalho» era a casa a desmentir a sua própria página, e a regra que não se
quebra é essa. O estado passou a ser um campo de cada domínio, com três valores;
Trabalho leva «as medidas estão em Economia e finanças públicas» e a porta para
lá. **A contagem do índice é por isso 1 com página própria, 1 com porta para a
página onde as suas medidas vivem, e 16 sem ligação com «ainda sem medidas
conferidas».** Trocar o estado de Trabalho é uma linha em `src/data/dominios.mjs`
no dia em que o diretor decidir que ele tem página própria.

**(c) A medida que o mapa de E5 pinta.** O brief pede «o mapa por concelho para
T3 e E5». A dívida total de um município e a de outro não se comparam num mapa: o
que um mapa de euros desenha é o tamanho do município, e o §3 do brief da forma
recusa por nome «qualquer forma que ponha duas medidas com bases diferentes na
mesma escala». O mapa de E5 pinta o **índice de dívida**, que é a mesma dívida
contra o limite que a lei fixa para cada município, é uma linha derivada com a
sua aritmética registada, e é a comparação que a fonte permite. Os euros ficam
onde são verdade: na peça de cada uma das 308 páginas de concelho.

**(d) As três datas de E5.** A medida não tem linha nacional. O que a leitura
mostra com selo é o **limite legal**, que é nacional, tem as suas três datas e é
a referência contra a qual o mapa pinta os 308; o rótulo diz o que o número é. As
308 linhas da dívida **não concordam** nas três datas (medido: 307 lidas a
26.08.2026 e uma a 10.08.2026), e escolher uma para representar as outras seria
afirmar sobre 307 o que só é verdade de uma.

**(e) A frase da manchete e as cinco medidas da faixa** são as suposições que o
próprio brief escreve, e ficam para o diretor as substituir: são texto dele.

## 8 · O que ficou por fazer

**O item 9 do brief §2: os cartões da faixa da primeira página a apontarem para a
página do domínio.** O brief diz que ele espera pela fusão do F1.1, que é dono de
`src/views/HomeView.astro`, dos componentes da primeira página, de
`public/js/inicio.js` e de `tests/inicio/*`, e que «se o F1.1 ainda não estiver
fundido quando o resto do bloco estiver pronto, entregas o bloco sem este item e
o relatório di-lo». Não estava. **Nenhum ficheiro do F1.1 foi tocado.** O item
faz-se numa passagem curta a seguir, com o SHA que o lugar de direção der.

**A leitura a frio e a medição cega** são de outra família e não deste
construtor: a régua deste bloco (`tests/dominio/pagina.mjs`) é o
conhecido-positivo do portão novo, e não substitui nenhuma das duas.

### O que é do diretor, e que este bloco supôs

Para os pendentes, com o que cada um destrava:

1. **O slug de cada domínio** (§7 (a)). Hoje `/dominios/<slug>` e
   `/en/domains/<slug>`, com o mesmo slug nas duas edições. Mudar um slug depois é
   um reencaminhamento; mudar a REGRA (um slug por edição) é um bloco do
   encaminhamento.
2. **A medida de cabeça e as cinco da faixa.** Hoje E3 na manchete e E3, E2, T1,
   T2, T3 na faixa. Trocar é trocar duas constantes em `src/data/dominios.mjs`.
3. **A manchete do domínio**, que é texto dele. Hoje é composta pela regra da
   manchete do país: dois valores selados, dois limiares declarados, duas
   palavras de estado calculadas, e **nenhuma subtração**.
4. **O estado do domínio «Trabalho»** no índice (§7 (b)): fica dentro do primeiro
   domínio, ou ganha página própria.
5. **A frase da fronteira**, composta das palavras da carta, à espera das dele se
   ele quiser outras.
