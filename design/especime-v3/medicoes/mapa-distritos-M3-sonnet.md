# MEDIÇÃO · O mapa por distritos, M3 · Claude Sonnet (o medidor)

Medição cega, código próprio, escrito do zero em `mapa-distritos-M3-sonnet.mjs`, ao lado deste
ficheiro. Li apenas a Emenda 20 de `design/especime-v3/direcao.md`, `mapa/manifest.json`,
`mapa/pais.json`, `mapa/distritos/*.json` e `BRIEF-mapa-distritos-M3.md`. Não abri `src/`, `scripts/`
(excepto a corrida autorizada de `scripts/medir-defeitos.mjs`, medição 9), notas de construtores
nem os briefs deles. O "depois" é a construção congelada em `dist/`, servida localmente em
`http://127.0.0.1:4771`. O "antes" é `https://xn--oestadodopas-2fb.pt`, com um punhado de pedidos
espaçados por 1,2 segundos ou mais (nunca em ciclo). Playwright da árvore principal
(`NODE_PATH=/Users/nunosantos/Instruments/OEstadoDoPais/node_modules`), `devices["iPhone 13"]`
(390×664) e 1280×800. Não corrigi nada, não commitei, não usei `git checkout`, `git stash` nem
qualquer comando que mudasse a árvore de trabalho.

O programa corre de fio a pavio e escreve `mapa-distritos-M3-sonnet.resultados.json` ao lado. Fê-lo
quatro vezes ao longo deste trabalho: as duas primeiras apanharam falhas nos meus próprios
detetores (falsos alarmes meus, corrigidos, ver secção 12); a terceira apanhou um achado real do
sítio que rebentou o programa por eu não o ter previsto (secção 11, D4); a quarta correu inteira,
sem um só auto-teste vermelho por resolver e sem uma só medição por completar. É essa quarta corrida
que sustenta este relatório; o registo se chama `run4.log` na minha pasta de trabalho e cada número
abaixo vem de lá ou do JSON ao lado.

---

## 1 · Sumário

Nas nove medições pedidas, a construção congelada faz o que a Emenda 20 diz: 29 áreas na primeira
página (18 distritos, 2 ilhas da Madeira, 9 dos Açores), cada uma um `<a>` com nome acessível para
`/distritos/<slug>`; páginas de distrito com uma área por concelho, cada uma um `<a>` para
`/municipios/<slug>`; nenhuma cor de estado; a régua do inventário sem autorreferência e sem blocos
por classificar nas rotas novas. Seis discordâncias contra a letra da Emenda 20 e do brief, todas com
coordenada e prova (secção 11): um atributo HTML duplicado em todas as 616 páginas de concelho
(308 × 2 edições); um atributo novo (`data-caop`) em `/municipios` não descrito em lado nenhum que
li; a lista da moldura da Madeira a listar uma ilha que já chega aos 44 px; o centro geométrico da
caixa delimitadora da Ilha da Madeira a cair fora da sua própria forma (achado ao vivo, não hipótese);
o `text-decoration` do `<a>` a mudar ao passar o rato, fora do "só o contorno"; e uma mudança de bytes
de origem indeterminada (não encontrei marca de versão nenhuma depois de procurar).

---

## 2 · Medição 1 · A junção

Código próprio: liga os 29 ficheiros `mapa/distritos/*.json` (308 concelhos) às 308 pastas
`dist/municipios/<slug>/` e `dist/en/municipalities/<slug>/`; descodifica o campo `d` (parser de
`M x y l dx dy,… Z` escrito de raiz, com múltiplos sub-caminhos); testa o ponto representativo contra
o caminho por winding number (regra nonzero, com buracos).

| Verificação | Resultado |
|---|---|
| 308 concelhos, uma vez cada, nas 29 unidades | 308 total, 0 duplicados |
| Slugs do JSON com página construída (PT) | 308/308, 0 em falta, 0 a mais |
| Páginas construídas PT vs EN (mesmo conjunto de 308) | 0 só em PT, 0 só em EN |
| `manifest.concelhos.slugs` vs a minha soma directa dos 29 ficheiros | 0 diferenças (mas não confiei nele: é conferência, não fonte) |
| Nomes do JSON vs `<h1>` da página construída | 0 discrepâncias em 308 |
| Ray casting (nonzero) dos 308 pontos representativos | 0 fora do próprio caminho |
| Os 4 concelhos do Emenda 20e (Funchal, Santa Cruz, Peso da Régua, Vila Real de Santo António) | os 4 dentro da própria área |
| Ray casting dos 29 pontos de `pais.json` | 0 fora do próprio caminho |

Zero em cada linha. Ver secção 13 para a prova de que cada detetor aqui usado dá vermelho quando devia.

---

## 3 · Medição 2 · A primeira página, a 1280 e a 390

Caso conhecido primeiro: no ar, a primeira página mostra 309 `<circle>` (308 pontos + 1 sobreposto,
por confirmar geometricamente, não interessa à contagem de áreas) dentro de `svg.mapa-svg`, 0
`<path>` (nenhuma área poligonal) e 0 ligações a `/distritos/` na página inteira, apesar de ter 308
`<a>` dentro do próprio SVG (cada ponto já é ligação directa a `/municipios/<slug>`, Emenda 19b). A
minha primeira versão do auto-teste exigia também 0 `<a>`, o que deu vermelho por engano meu, não do
sítio (falso alarme, secção 12, FA1); corrigido, o sinal certo (`<path>`=0 e ligações a
`/distritos/`=0, com círculos>0) confirma o caso conhecido.

| Medida (`dist/`, depois) | 1280 | 390 |
|---|---|---|
| `svg` do mapa existe | sim | sim |
| `role` do `svg` | `group` (nunca `img`) | `group` (nunca `img`) |
| Áreas dentro de `<a>` | 29/29 | 29/29 |
| Nome acessível (Chromium `ariaSnapshot`, não a minha suposição) | 29/29 com nome, 0 sem, 0 com role≠`link` | 29/29, 0, 0 |
| Áreas abaixo de 44×44 px | 10 de 29 | 17 de 29 |
| Centro da caixa fora da forma real (`isPointInFill`) | 1 de 29 (Ilha da Madeira) | 1 de 29 (Ilha da Madeira) |
| `fill` computado, valores distintos entre as 29 áreas | 1 (`none`) | 1 (`none`) |
| `stroke` computado, valores distintos entre as 29 áreas | 1 (`rgb(23, 25, 27)`) | 1 (`rgb(23, 25, 27)`) |

**As 10 áreas abaixo de 44×44 px a 1280** (todas ilhas excepto a Madeira maior): Ilha de Porto Santo,
e as 9 unidades dos Açores (Ilha Terceira, Ilha da Graciosa, Ilha das Flores, Ilha de Santa Maria,
Ilha de São Jorge, Ilha de São Miguel, Ilha do Corvo, Ilha do Faial, Ilha do Pico). A 390 juntam-se
mais 7 distritos do continente (a lista completa está no JSON ao lado, chave
`m2_primeiraPagina.porViewport.390.abaixo44`).

**As listas por baixo das molduras de ilhas** (ambas as larguras, valores iguais):

| Moldura | Ilhas na moldura | Abaixo de 44 px | Ilhas na lista por baixo | Uma por linha, cada uma ligação |
|---|---|---|---|---|
| Madeira | Ilha da Madeira, Ilha de Porto Santo | só Ilha de Porto Santo | **as duas** | sim, 2/2 |
| Açores | as 9 unidades açorianas | as 9 (todas) | as 9 (todas) | sim, 9/9 |

A moldura da Madeira lista uma ilha (Ilha da Madeira) que já chega aos 44×44 px; ver discordância D3
(secção 11). Na moldura dos Açores não há como distinguir "lista tudo" de "lista as que não chegam",
porque coincidem (nenhuma das 9 chega a 44 px a nenhuma largura).

---

## 4 · Medição 3 · Dez cliques reais na primeira página

Dez cliques reais (`locator.click()`, não `getAttribute('href')`), em áreas escolhidas ao acaso, a
1280 e a 390, com o resultado a comparar `page.url()` depois da navegação:

| Largura | Cliques | Falhas | Exemplos |
|---|---|---|---|
| 1280 | 10 | 0 | Porto, Portalegre, Ilha das Flores, Setúbal, Castelo Branco, Lisboa, Évora, Leiria, Ilha da Graciosa, Porto |
| 390 | 10 | 0 | Faro, Aveiro, Viseu (×3), Ilha de Porto Santo, Porto, Viana do Castelo, Vila Real, Beja |

Os 20 cliques desta corrida abriram todos a `/distritos/<slug>` certa. Numa corrida anterior do
mesmo programa, um clique ao acaso caiu em "Ilha da Madeira" a 1280 e nunca chegou a registar-se
(Playwright: "svg … intercepts pointer events", 5000 ms esgotados, o meu programa nem apanhava a
excepção e rebentava). Não descartei este resultado só porque o script inicial não sabia lidar com
ele: é um achado real, investigado a fundo na discordância D4 (secção 11), e o programa ficou mais
robusto por causa dele (regista a falha e continua, em vez de rebentar).

---

## 5 · Medição 4 · Lisboa e Ilha de São Miguel, as duas edições

| | Lisboa PT | Lisboa EN | Ilha de S. Miguel PT | Ilha de S. Miguel EN |
|---|---|---|---|---|
| Áreas no mapa (esperado 16 / 6) | 16/16 | 16/16 | 6/6 | 6/6 |
| Cada área `<a>` para `/municipios/<slug>` (ou `/en/municipalities/`) | sim | sim | sim | sim |
| Nome acessível em todas as áreas | 16/16 | 16/16 | 6/6 | 6/6 |
| Itens na lista textual | 16 | 16 | 6 | 6 |
| Lista = mesmo conjunto que o mapa | sim | sim | sim | sim |
| Lista na mesma ordem que o JSON de origem | sim | sim | sim | sim |
| Lista na mesma ordem que as áreas no SVG | sim | sim | sim | sim |
| `role` do `svg` | `group` | `group` | `group` | `group` |
| Abaixo de 44×44 px, a 1280 | 0 | 0 | 0 | 0 |
| Abaixo de 44×44 px, a 390 | 1 (Amadora, 33,1×47,4 px, falha só na largura) | 1 (Amadora, igual) | 0 | 0 |
| Centro da caixa fora da forma real | 0 | 0 | 0 | 0 |

A ordem da lista de Lisboa (Alenquer, Arruda dos Vinhos, Azambuja, Cadaval, Cascais, Lisboa, Loures,
Lourinhã, Mafra, Oeiras, Sintra, Sobral de Monte Agraço, Torres Vedras, Vila Franca de Xira, Amadora,
Odivelas) bate certo, item a item, com a ordem de `mapa/distritos/lisboa.json`; o mesmo para São
Miguel (Lagoa, Nordeste, Ponta Delgada, Povoação, Ribeira Grande, Vila Franca do Campo).

Nenhuma área de concelho, em nenhum dos quatro casos, tem o centro da caixa fora da própria forma
(ao contrário da Ilha da Madeira na medição 2); a estas duas páginas de distrito, a medição não
apanhou o mesmo problema.

**Dez cliques reais**, distribuídos pelas duas páginas de distrito e pelas duas larguras: 10/10
abriram `/municipios/<slug>` do concelho clicado, incluindo casos difíceis como
`lagoa-ilha-de-sao-miguel` (slug composto, não o nome simples "Lagoa").

---

## 6 · Medição 5 · Os pesos

| Página | Antes (ar) | Depois (`dist/`) | Diferença |
|---|---:|---:|---:|
| Primeira página (bytes HTML) | 193 014 | 161 460 | **−31 554** |
| Página de distrito, Lisboa (bytes HTML) | rota não existe (404) | 34 654 | sem antes para comparar |
| `/municipios` (bytes HTML) | 98 241 | 106 634 | **+8 393** |
| `/municipios/evora` (bytes HTML) | 119 151 | 119 190 | **+39** |

A primeira página ficou **mais leve** apesar de ganhar uma funcionalidade nova: os 308 `<circle>` e
os seus atributos por ponto pesavam mais do que 29 caminhos poligonais, mesmo com o `d` de cada um
a ser bem mais comprido do que um `cx`/`cy`.

| JSON de dados | bytes |
|---|---:|
| `mapa/pais.json` (o país) | 34 806 |
| `mapa/distritos/viseu.json` (o maior distrito, por bytes **e** por concelhos) | 24 245 |

"O maior distrito" não é ambíguo aqui: Viseu é o maior pelas duas réguas (24 concelhos e 24 245
bytes, o maior ficheiro dos 29). Os 29 ficheiros, do maior ao menor, estão no JSON ao lado
(`m5_pesos.todos`); o menor é `ilha-de-sao-jorge.json`, com 3 691 bytes e 2 concelhos.

---

## 7 · Medição 6 · Neutralidade a passar o rato e a focar

`getComputedStyle` completo (956 propriedades, `<a>` e o seu `path.uni`), antes/depois de `hover()` e
antes/depois de `focus()`, em três áreas independentes (Aveiro, Ilha de São Jorge, Évora), com o rato
devolvido a `(0,0)` entre um teste e outro. As três áreas deram exactamente o mesmo padrão:

| Interacção | No `<a>` | No `path.uni` |
|---|---|---|
| `hover` | `text-decoration`: `rgb(127,134,129)`→`none`; `text-decoration-color`: `rgb(127,134,129)`→`rgb(23,25,27)` | `stroke-width`: `1px`→`3px` |
| `focus` | as 8 variantes de `border-*-radius`: `0px`→`2px`; `outline-offset`: `0px`→`3px` | `stroke-width`: `1px`→`3px` |

De 956 propriedades computadas, `hover` muda 3 (2 no `<a>`, 1 no `path`) e `focus` muda 10 (9 no
`<a>`, 1 no `path`). No `focus`, as 9 mudanças são todas do mesmo mecanismo (contorno arredondado:
raio do canto + afastamento do `outline`); a "própria" propriedade `outline` (cor, estilo, largura)
não muda nunca (fica sempre `outline-style: none`, ou seja, nunca chega a desenhar-se). No `hover`,
2 das 3 mudanças são `text-decoration`, que não é contorno nem cor de estado; ver discordância D5.

Confirmado por análise estática em todo o `dist/`: os 29×2 (PT+EN) ficheiros de página de distrito
usam uma única classe `path class="uni"`, 616 ocorrências, 0 com `fill=` ou `style=` inline; a única
regra CSS que define `fill`/`stroke` para `.uni` é global e única. A neutralidade de cor (nenhuma
área destacada por estatuto) vale para todas as áreas de todas as páginas de distrito, não só para
as 3 amostradas ao vivo.

---

## 8 · Medição 7 · `/municipios`

Diff verdadeiro (algoritmo de Myers, via `diff` do sistema, sobre HTML com uma tag por linha), não
um aparo ingénuo de prefixo/sufixo comum (ver falso alarme FA2, secção 12).

| | Antes | Depois | Diferença |
|---|---:|---:|---:|
| Bytes | 98 241 | 106 634 | +8 393 |
| Hunks do diff | — | — | 337 |
| Padrões distintos (depois de generalizar nomes/slugs) | — | — | **2** |

| Padrão | Ocorrências | Antes → Depois |
|---|---:|---|
| Cabeçalho do grupo por distrito ganha ligação | 29 | `<h2 class="concelhos-grupo-k">Aveiro</h2>` → `<h2 class="concelhos-grupo-k"><a href="/distritos/aveiro">Aveiro →</a></h2>` |
| Item da pesquisa ganha atributo novo | 308 | `<li class="pesquisa-item" data-normal="agueda" data-tem-pagina="sim">` → `<li … data-normal="agueda" data-caop="agueda" data-tem-pagina="sim">` |

Fora destes dois padrões: **0** padrões, **0** ocorrências. O primeiro padrão é exactamente o que a
Emenda 20a e o brief descrevem (cabeçalhos viram ligação para `/distritos/<slug>`, um por unidade,
29 no total). O segundo (`data-caop`, um por concelho, 308 no total) não está descrito em nada que li;
é a discordância D2 (secção 11).

---

## 9 · Medição 8 · O cartão localizador (página de concelho)

Mesmo método de diff, sobre `/municipios/evora`:

| | Antes | Depois | Diferença |
|---|---:|---:|---:|
| Bytes | 119 151 | 119 190 | +39 |
| Hunks do diff | — | — | 2 |

| Hunk | Antes | Depois |
|---|---|---|
| 1 (folha de estilo) | `<link rel="stylesheet" href="/_astro/inicio.CYmXWYkV.css">` | `<link rel="stylesheet" href="/_astro/inicio.8F06KnSY.css">` |
| 2 (o `svg` do cartão) | `<svg class="mapa-svg" viewBox="0 0 600 790" role="img" …>` | `<svg class="mapa-svg" viewBox="0 0 600 790" class="mapa-svg" viewBox="0 0 600 790" role="img" …>` |

**Não encontrei nenhuma "marca de versão"** em `/municipios/evora` nem na primeira página, depois de
procurar por: `<meta name="generator">`, o texto do rodapé, as palavras "commit"/"build"/"versão" em
todo o HTML, datas ISO, `?v=` em `src=` de scripts, atributos `data-*ver*`. O único campo datado que
encontrei (`data-nonledger="data-de-atualizacao"`, na primeira página) tem o mesmo valor
(`2026-08-24`) antes e depois; não é isto que muda entre os dois hunks acima.

O hunk 1 é a folha `inicio.css`, partilhada pela primeira página e pelo cartão localizador; confirmei
por diff do próprio CSS que o que lhe foi acrescentado são regras novas do mapa por distritos
(`.uni`, `.mapa-ilhas*`) e uma mudança num `@media` restrito a `[data-inicio]` (só a primeira
página); nenhuma delas tem selector que bata com o que existe em `/municipios/evora` (confirmei:
`data-dica-cursor` e `mapa-hint` não aparecem nesta página, nem antes nem depois). Byte-a-byte é uma
diferença real; funcionalmente, é inerte aqui.

O hunk 2 é o atributo duplicado (`class`/`viewBox` repetidos) no `<svg>` do cartão; ver discordância
D1. Confirmei a extensão exacta em todo o `dist/`:

```
grep -rl 'class="mapa-svg" viewBox="0 0 600 790" class="mapa-svg" viewBox="0 0 600 790"' dist/
→ 616 ficheiros: os 308 de dist/municipios/*/index.html + os 308 de dist/en/municipalities/*/index.html
```

616 de 616 páginas de concelho possíveis (as duas edições, os 308 concelhos), sem uma só excepção.

---

## 10 · Medição 9 · A régua do inventário

`node scripts/medir-defeitos.mjs`, corrido na cópia, exit code 0.

| Verificação | Resultado |
|---|---|
| Linhas "frases da casa" para `/distritos*` e `/en/districts*` (30+30) | 60 |
| Com blocos por classificar (conteúdo+navegação+autorreferência ≠ distinta) | **0** |
| Com autorreferência ≠ 0 | **0** |
| Marcadores de falha (✗/FALHA) em toda a saída | nenhum |

Autorreferência 0 e zero blocos por classificar nas 60 linhas das rotas novas, nas duas edições.

---

## 11 · Discordâncias (com coordenada e prova)

**D1 · Atributo HTML duplicado no cartão localizador, 616/616 páginas de concelho.**
Coordenada: `dist/municipios/<slug>/index.html` e `dist/en/municipalities/<slug>/index.html`, todos
os 308 slugs; o `<svg>` dentro de `[data-mapa-cartao] .mapa-tela`. Prova: diff exacto contra o ar
(secção 9, hunk 2) e a contagem `grep -rl` acima, 616 de 616. `class="mapa-svg" viewBox="0 0 600 790"`
aparece duas vezes seguidas no mesmo elemento; HTML inválido (atributo repetido). Efeito prático:
provavelmente nenhum, porque o parser HTML fica com a primeira ocorrência e ignora a segunda (confirmei
`getAttribute('class')` e `getAttribute('viewBox')` ao vivo: os dois vêm certos). Não contradiz a
Emenda 20d na substância (o cartão continua a ser o dos pontos, com o campo próprio, nada disso
mudou); contradiz sim, à letra, a medição 8 do brief ("não mudou … bytes iguais fora da marca de
versão"), porque o `<svg>` do cartão não ficou byte a byte igual ao que estava no ar.

**D2 · `data-caop="<slug>"` novo em `/municipios`, 308 ocorrências, não descrito no que li.**
Coordenada: `/municipios`, cada `<li class="pesquisa-item">` da lista de pesquisa. Prova: diff exacto
contra o ar (secção 8), padrão ×308. Não é um defeito óbvio (parece um gancho de dados para o
JavaScript de pesquisa), mas cai fora do que a medição 7 do brief descreve como a única mudança
permitida ("os cabeçalhos dos grupos … nada mais mudou").

**D3 · A lista da moldura da Madeira lista uma ilha que já chega aos 44 px, mas isto bate certo com
a letra exacta da Emenda 20c; só destoa da paráfrase do brief.** Coordenada: `/` e `/en`,
`.mapa-ilhas-grupo[data-moldura-lista="Madeira"] ul.mapa-ilhas-lista`. Prova: "Ilha da Madeira" mede
109,1×257,5 px a 1280 e 78,8×186,1 px a 390 (ambos ≥44×44, medidos por `getBoundingClientRect`), e
ainda assim aparece na lista por baixo, ao lado de "Ilha de Porto Santo" (10,3×12,1 px a 1280, essa
sim abaixo de 44 px). Reli a Emenda 20c com cuidado antes de escrever isto como discordância, porque
a primeira leitura enganou-me: o texto exacto é "onde uma ilha não chegar aos 44 px na moldura, **os
nomes das ilhas dessa moldura** ficam por baixo dela como ligações, uma por linha": plural, "dessa
moldura", não "dessa ilha". Lido à letra, é um gatilho por moldura (se alguma ilha da moldura falhar,
listam-se todas as ilhas dessa moldura), e é exactamente isto que a construção faz. A tensão está só
na medição 2 do próprio brief, que resume a regra como "os nomes das ilhas que não chegam a 44 px"
(uma leitura por ilha, não por moldura). A moldura dos Açores não ajuda a desfazer a dúvida (as 9
ilhas estão todas abaixo de 44 px nas duas larguras, por isso "moldura inteira" e "só as que falham"
dão a mesma lista); só a moldura da Madeira separa as duas leituras, e o que está construído seguiu a
Emenda 20 à letra, não a paráfrase do brief. Não é uma discordância contra a Emenda 20; é uma
discordância contra o resumo que o brief fez dela, e fico a dever a direcção dizer qual das duas
frases é a régua.

**D4 · O centro geométrico da caixa da Ilha da Madeira cai fora da sua própria forma.**
Coordenada: `/` (primeira página), a 1280 e a 390, área `Ilha da Madeira` (`href="/distritos/ilha-da-madeira"`).
Prova, em três camadas independentes: (a) `path.isPointInFill(centro da bbox de path.getBBox())` dá
`false` (a 1280: bbox `{x:1527, y:4821, largura:1356, altura:3201}` no espaço próprio do `path`,
centro em `(2205, 6421.5)`, fora do preenchimento; `Aveiro`, no mesmo teste, dá `true`, controlo
positivo); (b) `document.elementFromPoint` no centro em pixels do ecrã, depois de rolar o elemento
para a vista, devolve o próprio `<svg class="mapa-svg mapa-svg-areas">`, não o `<a>` nem o `<path>`;
(c) um clique real do Playwright nesse mesmo ponto, numa corrida anterior deste programa, nunca se
registou ("svg … intercepts pointer events", 5000 ms esgotados). Interpretação: a Ilha da Madeira é
uma forma comprida e na diagonal; a caixa delimitadora (rectangular, alinhada aos eixos) é bem maior
do que a ilha, e o seu centro cai em "mar vazio" dentro da caixa mas fora do polígono real. Isto
importa para a métrica de 44×44 px em si: a caixa ser ≥44×44 (o que esta área cumpre, com folga) não
garante 44×44 px de alvo real em qualquer ponto dentro dela, para uma forma côncava ou alongada; um
utilizador real, guiado pelo contorno visível (o `stroke`), provavelmente não sofre este problema
tão facilmente como um clique programático no centro geométrico, mas um utilizador de teclado que
confirme a área por outro meio, ou qualquer ferramenta automática que clique "no meio da caixa", sofre.
Nenhuma outra das 29 áreas da primeira página, nem nenhuma das 22 áreas de concelho medidas em Lisboa
e São Miguel (16+6, duas larguras), tem este problema.

**D5 · `text-decoration` muda ao passar o rato, fora de "só o contorno".**
Coordenada: qualquer área da primeira página, o elemento `<a class="uni-porta">`. Prova: secção 7,
3 amostras independentes (Aveiro, Ilha de São Jorge, Évora), o mesmo padrão exacto nas três:
`text-decoration` de `rgb(127, 134, 129)` para `none`, e `text-decoration-color` de
`rgb(127, 134, 129)` para `rgb(23, 25, 27)`. A Emenda 20b diz "o que muda ao passar o rato ou ao
chegar pelo teclado é o contorno, e só ele"; no `hover`, muda também isto. Como o `<a>` não tem texto
próprio (o nome vive num `<title>` do SVG, não pintado) e o `path` tem `fill:none`, é muito provável
que isto seja visualmente inerte (não há sublinhado nenhum para se ver), mas é uma diferença real e
mensurável em `getComputedStyle`, fora do contorno.

**D6 · Mudança de bytes de origem indeterminada (a folha `inicio.css`), sem marca de versão
identificável para a justificar.** Já descrita em pormenor na secção 9. Não a repito aqui como
achado novo, só a listo para ficar completa a lista de discordâncias byte-a-byte contra "nada mais
mudou fora da marca de versão": procurei por uma marca de versão em toda a página (meta generator,
rodapé, palavras-chave, datas, `?v=`, atributos `data-*ver*`) e não encontrei nenhuma nestas duas
páginas; assim, não tenho onde encostar esta diferença de bytes para a excluir da letra da medição 8.

---

## 12 · Falsos alarmes (meus, não do sítio)

**FA1 · Caso conhecido da medição 2, primeira tentativa.** Exigi `0` ligações `<a>` dentro do
`svg.mapa-svg` ao vivo, como sinal de "não há áreas"; o sítio ao vivo tem 308 (cada ponto já é
ligação directa a `/municipios/<slug>`, Emenda 19b, que não é a mesma coisa que uma área de
distrito). Causa: confundi "qualquer `<a>`" com "uma ligação de área". Corrigido: o sinal certo é
`<path>`=0 (nenhuma área poligonal) e ligações a `/distritos/`=0, com os 308 círculos presentes;
com este sinal, o caso conhecido dá vermelho como devia antes da correcção, e verde depois.

**FA2 · Diff ingénuo nas medições 7 e 8, primeira versão do programa.** A minha primeira
implementação do diff aparava só o prefixo e o sufixo comuns entre o HTML de antes e de depois,
tratando tudo o que sobra no meio como "diferente". Para documentos longos e muito repetitivos, com
as diferenças reais espalhadas (308 `<li>` em `/municipios`, por exemplo), isto infla imenso a
região "diferente" mesmo quando quase tudo lá dentro é, linha a linha, idêntico: cheguei a ver
"1199 linhas diferentes" num diff que, com um algoritmo a sério, são 2 hunks; e "84 padrões" em
`/municipios` que são, na realidade, 2. Não cheguei a tirar nenhuma conclusão errada disto (não
tinha nenhum auto-teste ligado a este número ainda), mas troquei o método antes de confiar nele:
o programa final chama o `diff` do sistema (Myers) sobre HTML com uma etiqueta por linha, e os
números da secção 8 e 9 vêm desse diff a sério.

---

## 13 · Casos conhecidos vistos vermelhos

Cada detetor teve de falhar num caso sintético ou ao vivo antes de eu confiar em qualquer zero que
desse depois. Os oito, todos provados nesta ordem, na corrida final:

| # | Detetor | Caso vermelho | Prova (vermelho → verde) |
|---|---|---|---|
| 1 | Descodificador do caminho + ray casting | Quadrado sintético `M0 0l10 0,0 10,-10 0Z` | dentro(5,5)=true, fora(100,100)=false, quase-borda(0.001,5)=true |
| 2 | Regra `nonzero` com buraco | Quadrado com um anel interior invertido | ponto no buraco=false, ponto na área=true |
| 3 | Junção: nome↔slug↔página | Troca do `slug` entre dois concelhos, numa cópia do JSON (o caso pedido no brief) | as duas entradas trocadas dão discrepância de nome (`"agueda"`↔`"vale-de-cambra"`) |
| 4 | Junção: duplicados | Um concelho injectado numa segunda unidade | duplicado detectado, total=309 |
| 5 | Junção: páginas em falta | Um slug inventado, sem página construída | `emJSONnaoConstruidas` acusa-o, `construidasNaoEmJSON` acusa o órfão |
| 6 | Ray casting: controlo negativo | Ponto de "Vagos" contra o caminho de "Arouca" (mesma grelha local, caixas sem sobreposição) | dentro=false |
| 7 | "Há áreas na primeira página" | O sítio ao vivo (main), mapa de pontos | `<path>`=0, ligações a `/distritos/`=0, com 309 círculos presentes |
| 8 | Centro da caixa dentro da forma | Ilha da Madeira, achado ao vivo (não fabricado): centro fora da forma; Aveiro como controlo positivo | Madeira=false (esperado), Aveiro=true (esperado) |

---

## 14 · Custo em símbolos

Não tenho, de dentro desta sessão, acesso a uma contagem exacta e facturável de tokens; não a invento.
O único proxy que vejo é o orçamento de contexto restante que o próprio invólucro me mostra entre
chamadas (`<total_tokens>`): começou em 15 000 000 no início desta tarefa e estava em 14 664 293 antes
de eu escrever este relatório, uma queda de **≈ 335 700** unidades desse contador. Não é uma factura
de tokens de entrada/saída da API, é um orçamento de janela de contexto que também inclui as saídas
de ferramentas (o `grep`, os JSON completos, os logs); trato-o como uma ordem de grandeza, não como
um número exacto, e marco-o `(inferência)`.

---

## Ficheiros

- Programa: `design/especime-v3/medicoes/mapa-distritos-M3-sonnet.mjs`
- Resultados em bruto: `design/especime-v3/medicoes/mapa-distritos-M3-sonnet.resultados.json`
- Este relatório: `design/especime-v3/medicoes/mapa-distritos-M3-sonnet.md`
