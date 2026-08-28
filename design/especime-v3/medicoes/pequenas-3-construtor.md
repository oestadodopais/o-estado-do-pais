# Relatório · correções pequenas, terceira passagem (I83, I84, I88)

*Escrito pelo construtor (Claude Opus 5) a 28.08.2026, contra
`briefs/BRIEF-correcoes-pequenas-3.md`. Ramo `pequenas-3-2026-08-28`, saído de
`main` em `3be579a`. Três commits, cada um com `npm run build` (a cadeia inteira
das réguas), `npm run verify` e `npm run typecheck` verdes antes de ser escrito.
Sem fusão e sem envio: o ramo fica para o lugar de direção.*

| commit | o quê |
| --- | --- |
| `a5d15b6` | I83 · a porta de uma figura diz o que abre, e a chave fica no `href` |
| `9ddef92` | I84 · a colação portuguesa no artefacto, no índice dos concelhos e numa régua |
| `68d1409` | I88 · o índice é da casa, e os dados é que são da Direção-Geral |
| `9c7fce5` | as fichas de `ISSUES.md` e a primeira forma deste relatório |
| `df4a2a6` | I84, segunda volta · os concelhos dentro de cada grupo, e a R7 a medir as listas construídas |

Os três primeiros fecham as fichas, o quarto traz este relatório, e o quinto é a
segunda volta da I84, depois da leitura do Codex: ver a §2.4 e a §2-A.

---

## 1 · I83 · o rótulo de acessibilidade da porta de uma figura

### O que mudou

`estudos.textoPortaDaLinha` passa de «linha do motor» a «a linha desta figura», e
de «engine row» a «this figure’s row». `src/lib/registo-html.mjs` deixa de compor
o `aria-label` com o identificador a seguir: a porta rende-se
`<a class="texto-figura-porta-apos" href="#linha-tc-year-16-2018"
aria-label="a linha desta figura"></a>`, e a chave fica só no `href`, onde ela é
um endereço.

A normalização da régua saiu com as cadeias, como o brief manda.
`scripts/medir-defeitos.mjs` tirava de cada dica o fragmento que o próprio
elemento aponta e deixava `<linha>` no lugar dele. Antes de a tirar, contei quem
a exercia: varridas as páginas construídas com `node-html-parser`, à procura de
um elemento com `href="#…"` e um `title` ou `aria-label` que contenha esse
fragmento, dá **42 elementos, e os 42 são estas portas** (21 por edição, nas duas
páginas de leitura). Nenhuma outra dica do sítio a exercia, e por isso ela sai
sem esconder nada. Se uma dica composta com um identificador voltar, volta ao
inventário como bloco **por classificar**, que é o portão que a apanha.

### As contagens, antes e depois

Medidas sobre `dist/` construído, com `command grep -roh` sobre a árvore inteira.

| | antes (`3be579a`) | depois (`a5d15b6`) |
| --- | --- | --- |
| `aria-label` distintos com «linha do motor: …» | 17 | 0 |
| `aria-label` distintos com «engine row: …» | 17 | 0 |
| cadeias distintas, as duas edições | **34** | **2** («a linha desta figura», «this figure’s row») |
| ocorrências, edição pt | 21 | 21 |
| ocorrências, edição en | 21 | 21 |
| ficheiros de `dist/` com estas portas | 2 | 2 |
| qualquer `aria-label` que contenha «linha do motor» | 21 | **0** |

O critério do brief («nenhuma `aria-label` com “linha do motor” em `dist/`»)
cumpre-se. O `grep` que dá zero foi provado com um positivo conhecido na mesma
corrida: o mesmo padrão sobre a cadeia nova dá 21 e 21.

### O inventário, visto vermelho pelos dois lados antes de ficar verde

A construção com as cadeias novas e o inventário por tocar fechou com quatro
problemas, e são exactamente os dois sentidos que a I74 escreveu:

```
bloco por classificar em /en/studies/…/text: «this figure’s row»
bloco por classificar em /estudos/…/texto: «a linha desta figura»
INVENTARIO-FRASES.md:1127: linha «viva» que não se rende em rota nenhuma  «engine row: <linha>»
INVENTARIO-FRASES.md:1128: linha «viva» que não se rende em rota nenhuma  «linha do motor: <linha>»
```

As duas linhas antigas passam a `retirada`, com a razão escrita e o bloco
`pequenas-3`; entram duas linhas `navegacao` numa secção nova do inventário; e
`critica/REVISOES-DO-INVENTARIO.md` ganha `| pequenas-3 | 4 | por ler | … |`, que
é a forma legítima enquanto o bloco está em construção. O portão imprime-a, como
está escrito que faz.

| `check:voz` | antes | depois |
| --- | --- | --- |
| frases distintas varridas | 647 | 647 |
| ocorrências varridas | 25 677 | 25 677 |
| linhas do inventário com bloco | 502 | 504 |
| vivas, todas rendidas | 452 | 452 |
| retiradas, nenhuma rendida | 50 | 52 |

`CHAVES-EN.md` foi corrigido na mesma passagem: a linha de
`estudos.textoPortaDaLinha` descrevia a forma antiga («O valor rende-se com o
identificador da linha do motor a seguir, separado por dois pontos»), que deixou
de ser verdade.

---

## 2 · I84 · a ordem por pontos de código, os dois lados

### O lado do motor, atravessado

Corrido a partir de `~/Instruments/ResearchHub`, e foi o único comando que corri
lá:

```
python3 publisher/mapa_distritos.py --write
```

O motor estava em `ae0f297`, com a colação já escrita em `087fbcc`. O validador
saiu verde (29 unidades, 308 concelhos, junção 308/308, os 308 slugs iguais aos
de `slugsDaCarta()`), e escreveu 31 ficheiros: **0 novos, 6 alterados, 25
inalterados**. São os seis que o brief previu, e nenhum outro.

**Os bytes de cada um, antes e depois. Não muda nenhum: só a ordem mudou, e a
geometria é igual byte a byte.**

| ficheiro | bytes antes | bytes depois | sha256 (12) antes | sha256 (12) depois |
| --- | --- | --- | --- | --- |
| `mapa/pais.json` | 34 806 | 34 806 | `6287ed971fcb` | `9ed61a53f542` |
| `mapa/distritos/aveiro.json` | 16 749 | 16 749 | `00ed55b1bf95` | `bbb840bf2db9` |
| `mapa/distritos/lisboa.json` | 23 659 | 23 659 | `e2e9456c2c76` | `8d6a43f97fed` |
| `mapa/distritos/porto.json` | 18 380 | 18 380 | `8527e68bdff4` | `ba9006a9d1ad` |
| `mapa/distritos/santarem.json` | 22 145 | 22 145 | `fd24998e4c0f` | `9df609358197` |
| `mapa/manifest.json` | 38 120 | 38 120 | `c64789e9c803` | `967773924e57` |

Os outros 25 ficheiros de `mapa/` ficaram com o mesmo resumo, conferido ficheiro
a ficheiro contra uma fotografia tirada antes da corrida. `git status` do
repositório do motor tem, depois da corrida, exactamente as mesmas cinco
modificações e as mesmas cinco entradas por seguir que tinha antes: as de outra
sessão (`content/11 Seguranca Social/*`, `indicators/*`, `.maintenance-locks/`,
e mais duas). Não toquei em nenhuma.

### A R7, vista vermelha antes e verde depois

`check:mapa` passa de seis regras a sete. A R7 compara a ordem dos caminhos de
cada `svg` (as unidades de `pais.json` e os concelhos de cada um dos 29
distritos) e a ordem das unidades do manifesto com a do `Intl.Collator('pt')`
sobre os nomes.

Escrita e corrida **sobre os artefactos de `main`, antes do `--write`**, saiu
vermelha com seis queixas, que são a ordem por pontos de código a ver-se:

```
R7: mapa/pais.json: «Ilha Terceira» na posição 9 e «Ilha da Graciosa» na 10
R7: mapa/distritos/aveiro.json: «Santa Maria da Feira» na 9 e «Ílhavo» na 10
R7: mapa/distritos/lisboa.json: «Vila Franca de Xira» na 14 e «Amadora» na 15
R7: mapa/distritos/porto.json: «Vila Nova de Gaia» na 17 e «Trofa» na 18
R7: mapa/distritos/santarem.json: «Vila Nova da Barquinha» na 20 e «Ourém» na 21
R7: mapa/manifest.json: «Ilha Terceira» na posição 9 e «Ilha da Graciosa» na 10
```

Depois do `--write`, verde. As sete regras verdes, e `--vermelhos` apanha os
**onze** estragos plantados, três deles novos: um a trocar duas unidades nos
caminhos do país, um a trocar dois concelhos nos caminhos de um distrito, e um a
trocar duas unidades do manifesto. São três e não um porque a regra lê três
sítios, e um estrago só deixaria duas metades por provar.

Não conferi a ordem de `concelhos_slugs` dentro de cada unidade do manifesto: o
brief nomeia «a ordem dos caminhos de cada `svg` e a das unidades do manifesto»,
e é o que a R7 mede. Fica dito, porque é a única lista ordenada de `mapa/` que
nenhuma regra compara com nada.

### O lado do sítio

`src/views/MunicipiosView.astro` ordena os grupos com `Intl.Collator('pt')`. O
que se ordena é a lista já montada (`comEntradas`), e não `DISTRITOS`: o índice
de cada grupo nessa lista é o que liga cada um dos 308 concelhos ao seu distrito
(`m[1]`), e mexer-lhe trocava os 308 de sítio.

| | antes | depois |
| --- | --- | --- |
| posição de «Évora» | 29 de 29, depois de «Viseu» | 7 de 29, entre «Coimbra» e «Faro» |
| posição de «Ilha Terceira» | 9, antes de «Ilha da Graciosa» | 20, depois de «Ilha do Pico» |
| cabeçalhos na ordem do `Intl.Collator('pt')` | não, nas duas edições | sim, nas duas edições |

**Visto vermelho com um caso plantado.** O detector lê os 29 cabeçalhos de
`/municipios` e `/en/municipalities` das páginas construídas e compara-os com a
colação; com `--plantar` troca dois deles numa cópia em memória antes de medir.
Com o estrago, sai a 1 e nomeia a posição («na posição 4 está “Castelo Branco” e
a colação põe “Bragança”»), nas duas edições; sem o estrago, sai a 0 com os 29 na
ordem.

### 2.4 · A segunda volta: os concelhos dentro de cada grupo

**A primeira volta corrigiu os cabeçalhos e deixou os membros como estavam**, e
foi a leitura do Codex que o apanhou. Os 308 nomes por baixo dos cabeçalhos
continuavam na ordem do ficheiro de coordenadas, que é a ordem do código oficial
de cada concelho. Quatro dos 29 grupos mostravam-no, nas duas edições:

| grupo | índice | estava | a colação põe |
| --- | --- | --- | --- |
| Aveiro | 8 | Santa Maria da Feira | Ílhavo |
| Lisboa | 1 | Arruda dos Vinhos | Amadora |
| Porto | 14 | Valongo | Trofa |
| Santarém | 13 | Rio Maior | Ourém |

Os outros 25 estavam em ordem **por acaso**, porque nesses distritos o código
oficial e o alfabeto coincidem. É o pior estado possível: a lista parecia
alfabética em 25 casos de 29, e o detector que corri na primeira volta só olhava
para os cabeçalhos, pelo que não tinha nada a dizer sobre isto.

**A correção.** `MunicipiosView.astro` ordena também as entradas de cada grupo,
com o mesmo `Intl.Collator('pt')`. A chave é o nome que a página IMPRIME, e não o
da Carta: um concelho com página mostra o nome da sua página na língua da edição.
Conferido que hoje os dois coincidem nos 308 (nenhuma página declara um nome
inglês diferente do português), e por isso a ordem é a mesma nas duas edições.

**A R7 passa a medir as listas construídas, e não só os ficheiros.** Era este o
buraco: o artefacto ficou certo, e a página compõe a sua lista de outra fonte. A
regra ganha `/municipios` e `/en/municipalities` ao mundo que lê, e confere três
coisas mais: os cabeçalhos dos grupos, os concelhos de cada um dos 29 grupos, e a
lista `#concelhos` de cada uma das 58 páginas de distrito. Esta última vai além
do que a direção pediu, e digo-o: as páginas de distrito estavam todas em ordem
hoje (0 de 58 fora), porque compõem a lista do artefacto, mas era a mesma classe
de defeito sem régua nenhuma a guardá-la, e esta passagem mostrou o que vale «hoje
está certo». Se a direção a quiser fora, sai numa linha.

Corrida contra o `dist/` da primeira volta, a R7 alargada saiu **vermelha com
oito queixas**, quatro por edição, com os nomes da tabela acima; depois da
correção, verde.

**Os estragos plantados passam de onze a catorze, e os três novos não
funcionaram à primeira.** A primeira forma copiava o segundo irmão por cima do
primeiro, e a R7 não os apanhava: duas entradas iguais estão em ordem, porque a
colação as compara a zero. Corrigidos para uma troca a sério, os catorze são
apanhados. Um estrago que não fica vermelho é uma régua a declarar-se verde sem
ter olhado, e é por isso que se corre `--vermelhos` em vez de se confiar nele.

**Medido no `dist/` final, com um detector à parte do `check:mapa`:** 29 grupos
nas duas edições, cabeçalhos na ordem da colação, **0 grupos com membros fora da
ordem**, 308 concelhos contados por edição. O zero foi lido com um positivo
conhecido: uma troca plantada nos dois primeiros concelhos do primeiro grupo põe
o primeiro desvio no índice 0.

---

## 2-A · A vírgula decimal da edição inglesa: fica

A leitura do Codex assinalou que a frase inglesa de Évora imprime «242,6%» e
«105,5%», com vírgula. Fui ver qual é a convenção da edição inglesa, e a resposta
é que a vírgula É a convenção, em toda a parte.

**A medição.** Varridas as 3 283 páginas da edição inglesa que têm valores, e
lidos todos os elementos com `data-claim` ou `data-prova`:

| na edição inglesa inteira | conta |
| --- | --- |
| valores com decimal por **vírgula** | **2 348** |
| valores com decimal por **ponto** | **0** |

O zero foi lido com um positivo conhecido: trocada uma vírgula por um ponto numa
cópia em memória da página inglesa de Évora, o mesmo varrimento passa a contar
1 ponto e 39 vírgulas, em vez de 0 e 40.

**A razão é estrutural, e não um esquecimento nesta frase.** Não há formatador de
números por língua em `src/` nem em `scripts/`: `grep` de `toLocaleString` e de
`Intl.NumberFormat` não dá nada em nenhum dos dois, com controlo positivo na
mesma corrida. `Claim.astro` imprime `String(claim.value)` tal como o livro-razão
o guarda, e o livro-razão guarda-o na composição da casa. A frase de Évora não
desvia de nada: usa o mesmo caminho que os outros 2 347 valores.

**E é uma regra escrita**, não um acidente. `design/especime-v3/direcao.md`, nas
«Regras de algarismos», fixa «espaço fino como separador de milhares
(54 681 562), vírgula decimal, percentagem colada (89,7%)», sem distinguir
edições. A única excepção documentada é a página de leitura, onde os algarismos
são os que o DOCUMENTO imprime e não os que a casa formataria.

**Veredicto: não mudo nada**, e não é por não conseguir. Pôr ponto decimal em
inglês é uma regra nova de composição que muda 2 348 valores em 3 283 páginas, e
não uma correção a uma frase: é decisão da direção, e mexe na `direcao.md`.

---

## 3 · I88 · a frase de Évora

`municipio.tempoSerieA` passa a «O índice de dívida, calculado sobre os dados da
Direção-Geral, desceu de » e a «The debt index, computed on the
directorate-general’s data, fell from ». `CHAVES-EN.md` acompanha.

| em `dist/` | antes | depois |
| --- | --- | --- |
| páginas com «O índice de dívida da Direção-Geral desceu de » | 1 | **0** |
| páginas com «The directorate-general’s debt index fell from » | 1 | **0** |
| páginas com a redação nova, pt | 0 | 1 (`/municipios/evora`) |
| páginas com a redação nova, en | 0 | 1 (`/en/municipalities/evora`) |

O zero foi lido com o positivo conhecido na mesma corrida: o mesmo `grep` sobre a
cadeia nova dá 1 e 1.

**O inventário não muda com esta frase, e a razão é mecânica.** O bloco que a leva
tem `data-claim` lá dentro (os dois valores são linhas do livro-razão), e a
medida 8 da régua deixa cair um bloco com origem declarada. Procurei a frase no
inventário antes e depois: não está lá, nem antes nem depois, e a construção não
a dá como «por classificar». Não há cadeias do inventário a reclassificar por
causa da I88, e a nota do bloco `pequenas-3` di-lo por extenso para que ninguém
volte a procurá-las.

---

## 4 · O que não pude fazer honestamente

**Não há frase de subida para tratar, e o que existe é pior do que uma frase por
tratar.** O brief pede que confirme que «a frase de subida (`tempoSerieB` ou o
que exista)» leva o mesmo tratamento. Fui ver: `tempoSerieB` a `tempoSerieE` são
os pedaços entre os valores (« em », « para », « em », «.»), e **o verbo está
fixo dentro de `tempoSerieA`**. O sítio não escolhe entre «desceu» e «subiu»:
escreve sempre «desceu» e «fell from». Hoje a frase rende-se numa página por
edição, Évora, e ali a série desce mesmo (242,6% em 2014 para 105,5% em 2025,
lidos da página construída), pelo que o que está escrito é verdadeiro. Um
concelho cuja série suba escreveria uma falsidade, e nenhuma régua a apanharia.
Não inventei a segunda chave: escolher entre duas frases, ou escrever uma que não
traga o verbo, é redação, e a redação é do lugar de direção. Fica em `ISSUES.md`
como **I89**, aberta, com a medição.

**A leitura cruzada do diff do inventário está por fazer, e diz-se.** A entrada
do bloco `pequenas-3` em `critica/REVISOES-DO-INVENTARIO.md` diz `por ler`, que é
a forma que o portão aceita enquanto o bloco está em construção e imprime para
que ninguém a esqueça. A leitura faz-se antes da fusão, e não é trabalho do
construtor.

**Não conferi nada no sítio publicado.** Tudo o que está medido aqui é do `dist/`
construído nesta máquina, ficheiro a ficheiro.

**E o que fiz mal, dito por extenso.** A primeira volta da I84 corrigiu os
cabeçalhos de `/municipios` e não os nomes por baixo deles, e o detector que
escrevi para a provar mediu exactamente aquilo que eu tinha corrigido. É a falha
que a régua 14 da casa existe para apanhar, e não a apanhou porque o detector foi
desenhado a partir da correção e não a partir do defeito: a pergunta certa não
era «os cabeçalhos estão em ordem?», era «alguma lista desta página está fora da
ordem da língua?». A segunda volta responde à segunda pergunta, e responde-a
dentro do `check:mapa`, para que a resposta valha depois de esta sessão fechar.
Custou uma leitura de fora, que é o recurso mais caro que a casa tem.

---

## 5 · O custo

Aproximadamente **215 mil símbolos** na primeira volta e **mais 40 mil** na
segunda, num total de cerca de **255 mil**, nesta sessão do construtor (Claude
Opus 5). A esmagadora maioria é leitura: os ficheiros que o brief manda ler antes
de tocar em nada, as réguas, e a saída de sete corridas completas de
`npm run build` mais quatro de `verify` e quatro de `typecheck`. O número sai do
contador da sessão e não de uma factura, e por isso é aproximado.
