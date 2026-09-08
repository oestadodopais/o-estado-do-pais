# Medição às cegas do Sonnet ao bloco F1.1e (os distritos e as ilhas voltam ao mapa), 08.09.2026

*Claude Sonnet, código próprio (Playwright, guardado em `medicao-f11e-sonnet/` ao lado), numa worktree própria sobre a cabeça `635e6d7f` do ramo `distritos-2026-09-08`, sem ler as réguas nem o relatório do construtor; 437 149 símbolos, 48 minutos. Confronto do lugar de direção com o relatório do construtor (`medicoes/distritos-construtor.md`): a U2 (29 de 29 e 14 de 14, nos três gestos, nas duas edições), a U3 (o primeiro toque nunca navega; o rato abre um concelho ao primeiro clique, como o brief permite), a U4 (29 ligações, 29 a responder 200, a gaveta fechada com 29, 0 regiões, `#unidade=evora` sem efeito sem guião), a U5 (3 263 px, as fontes carregadas) e a U7 (a página do concelho por mudar, com os 308 pontos) batem certo com o construtor. A U1 dá números mais baixos (a 390: 29 de 29 abaixo dos 44 px, mediana 16 px, contra 28 de 29 e 20 px do construtor; a 1280: 26 de 29, mediana 24 px, contra 23 de 29 e 26 px; Évora crescida a 390: 12 de 14, mediana 29 px) porque o método é outro: o quadrado do Sonnet tem o ponto numa de nove âncoras e valida-se por amostragem do perímetro, o do construtor é o maior quadrado da grelha de 2 px que contém o ponto em qualquer posição; os dois medem, nenhum exige, e a diferença é a mesma que se viu no F1.1d. Duas coisas que o construtor não tinha: as molduras da Madeira e dos Açores sobrepõem-se 64 por 83 px a 390 e 85 por 110 px a 1280 (o Major 9 da leitura a frio, confirmado à parte), e o centro da caixa da Madeira cai fora do preenchimento por causa das Selvagens, o que faz falhar um `hover` do Playwright ao centro. As colisões de processo do medidor (dois `npm run build` em simultâneo) estão descritas no relatório e não são defeito do bloco.*

---

# Medição cega do F1.1e — Sonnet, código próprio

Bloco medido: F1.1e («os distritos e as ilhas voltam ao mapa, e cada um cresce para os seus concelhos»).
Ramo: `distritos-2026-09-08`. Cabeça medida: `635e6d7f384cead1cfed14db92464f643a470e68` (confirmada com `git rev-parse HEAD` na worktree de medição).

Esta medição não leu nem correu as réguas do construtor (`tests/inicio/mapa-unidades.mjs`, `tests/inicio/mapa-distritos.mjs`, `tests/inicio/lista.mjs`, `scripts/check-mapa.mjs`) nem o relatório dele (`design/especime-v3/medicoes/distritos-construtor.md`). O código lido foi o código-fonte do bloco (o componente, o guião, os dados do artefacto) — necessário para saber o que medir — e não os testes nem o relatório do construtor.

## Condições

- Worktree de medição: `~/Instruments/OEstadoDoPais/.claude/worktrees/medicao-distritos`, criada com `git worktree add ... 635e6d7f`, `npm ci`, `npm run build`.
- Servidor: `npx astro preview --port 4390 --host 127.0.0.1` sobre o `dist/` dessa worktree (saída estática, `trailingSlash: 'ignore'`).
- Chromium: o do Playwright já instalado no repositório — `npx playwright --version` → 1.60.0; o navegador reportou-se como Chromium 148.0.7778.96 (`browser.version()`).
- Fontes: `document.fonts.status` = `loaded`, `document.fonts.check()` verdadeiro para as três famílias declaradas em `src/styles/tokens.css` (`Spectral`, `Bitter`, `Spectral SC`) — ver U5.
- Código da medição: `/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/03b60307-0dde-431e-a47a-48f0a93dfe6c/scratchpad/medicao-f11e/` (`lib.mjs` e um ficheiro por medida); os resultados brutos ficaram ao lado, em `*-resultado.json`.

## Método do alvo (U1): o ponto usado e o quadrado

Usei o ponto declarado no artefacto (`ponto` em `mapa/pais.json` e em `mapa/distritos/<slug>.json`) como "o ponto que o SVG marca" — não o centróide do bounding-box, que pode cair fora do preenchimento em formas côncavas (medido: foi exactamente o que aconteceu ao tentar `hover`/`click` pelo centro do bbox da Madeira no U2, ver abaixo).

Para cada área, o lado do maior quadrado que cabe dentro do preenchimento e contém o ponto foi calculado assim, em `lib.mjs` (`medirAlvosNoNavegador`), correndo dentro do navegador via `page.evaluate`:

1. o tecto do lado é `min(bbox.width, bbox.height)` do `getBoundingClientRect()` do próprio caminho SVG (um quadrado maior do que a caixa não pode caber dentro da forma que ela contém);
2. para cada lado candidato `S` (múltiplo de 2px, por busca binária), testam-se 9 posições-âncora do quadrado relativas ao ponto (os 4 cantos, os 4 meios-de-lado e o centro) — o ponto pode estar em qualquer uma destas 9 posições dentro do quadrado, e não só no centro, para não subestimar o alvo quando o ponto está perto de uma aresta da forma;
3. cada posição candidata é validada amostrando o perímetro do quadrado (entre 3 e 10 pontos por lado, conforme o tamanho) e testando `SVGGeometryElement#isPointInFill()` em cada amostra, depois de transformar o ponto de ecrã para o espaço local do caminho pela inversa da `getScreenCTM()`;
4. o maior `S` com pelo menos uma posição válida é o lado devolvido.

É uma aproximação por amostragem do perímetro (não um teste exacto do interior inteiro do quadrado), documentada aqui porque muda o número: uma concavidade estreita que não tocasse o perímetro amostrado passaria por dentro. Para as áreas medidas (distritos, ilhas, concelhos), a resolução (até 10 amostras por lado) pareceu suficiente nos casos verificados à mão (Beja, Évora, Corvo — ver sanidade abaixo).

Sanidade do método (`teste-sanidade.mjs`): Beja (grande) → 48px a 1280; Évora (média) → 46px a 1280; Corvo (minúsculo, bbox 1,4×2,3px) → 0px. Plausível e consistente com a ordem de grandeza das áreas.

---

## As medidas

| # | Medida | Resultado | Comando / ficheiro |
|---|---|---|---|
| U1 | País, 390px: quadrados abaixo de 44px | **29 / 29** (mediana 16px) | `node u1-alvo.mjs` |
| U1 | País, 1280px: quadrados abaixo de 44px | **26 / 29** (mediana 24px) | `node u1-alvo.mjs` |
| U1 | Évora crescida, 390px: quadrados abaixo de 44px | **12 / 14** (mediana 29px) | `node u1-alvo.mjs` |
| U1b | Braga crescida, 390px (bónus) | **12 / 14** abaixo de 44px (mediana 36px) | `node u1b-braga-porto.mjs` |
| U1b | Porto crescido, 390px (bónus) | **17 / 18** abaixo de 44px (mediana 26px) | `node u1b-braga-porto.mjs` |
| U2 | Nome ao rato — país (29) / Évora (14) | **29/29 e 14/14 correctos** | `node u2-nome.mjs` |
| U2 | Nome ao teclado (foco) — país (29) / Évora (14) | **29/29 e 14/14 correctos** | `node u2-nome.mjs` |
| U2 | Nome ao teclado — Tab real (amostra 3) | **3/3 correctos** | `node u2-nome.mjs` |
| U2 | Nome ao toque — país (29) / Évora (14) | **29/29 e 14/14 correctos** | `node u2-nome.mjs` |
| U3 | Toque numa unidade não muda `pathname` | **confirmado** (`/` → `/`, só o hash muda) | `node u3-toque.mjs` |
| U3 | Primeiro toque num concelho: nome, sem navegar | **confirmado** | `node u3-toque.mjs` |
| U3 | Segundo toque no mesmo concelho: navega | **confirmado** (`/municipios/evora`) | `node u3-toque.mjs` |
| U3 | Porta «Abrir →» navega para a unidade | **confirmado** (`/distritos/evora`) | `node u3-toque.mjs` |
| U4 | Ligações dentro do mapa (`a[data-uni-porta]`) | **29** (mais 2 ligações ocultas do lugar do nome, ambas para `/`) | `node u4-sem-guiao.mjs` |
| U4 | Destinos pedidos ao servidor local, 200 | **29 / 29** | `node u4-sem-guiao.mjs` |
| U4 | Gaveta dos nomes: ligações listadas | **29**, dentro de um `<details>` fechado | `node u4-sem-guiao.mjs` |
| U4 | Elementos do mapa/gaveta correspondentes às 9 regiões NUTS II | **0** (procurados: `grande-lisboa`, `peninsula-de-setubal`, `algarve`, `madeira`, `alentejo`, `norte`, `centro`, `oeste-e-vale-do-tejo`, `acores`) | `node u4-sem-guiao.mjs` |
| U4 | `/#unidade=evora` sem guião | **sem efeito** — nível fica `pais`, grupo dos concelhos existe mas vazio e oculto | `node u4-sem-guiao.mjs` |
| U5 | Altura de `/` a 390px, em repouso | **3263px** (`document.documentElement.scrollHeight`) | `node u5-altura.mjs` |
| U7 | Cartão do mapa em `/municipios/evora/` | **308 pontos** (postura `localizador`, nível ausente) — a página do concelho **não mudou** | `node u7-pagina-concelho.mjs` |
| — | Molduras da Madeira e dos Açores, 390px | **sobrepõem-se**: 64×83px | `node u-molduras.mjs` |
| — | Molduras da Madeira e dos Açores, 1280px | **sobrepõem-se**: 85×110px | `node u-molduras.mjs` |
| — | Paridade em `/en/` (U2 completo + amostra do resto) | **conforme** — ver secção própria | `node en-paridade.mjs` |
| U8 | `npm run build` | **código de saída 0** | `npm run build`, lido de `portoes/build.exit` |
| U8 | `npm run verify` | **código de saída 0** | `npm run verify`, lido de `portoes/verify.exit` |
| U8 | `npm run typecheck` | **código de saída 0** | `npm run typecheck`, lido de `portoes/typecheck.exit` |
| U2 (en) | Nome ao rato/teclado/toque, país (29) e Évora (14), em `/en/` | **29/29 e 14/14 em cada um dos três modos** | `node u2-nome-en.mjs` |
| U3 (bónus) | Clique de rato num concelho: navega logo ao primeiro clique | **confirmado** (`/` → `/municipios/evora`) | `node u3b-rato-concelho.mjs` |

**Nota sobre U8:** a primeira tentativa de correr os três portões colidiu com o meu próprio servidor de medição (o `npm run build` reescreve `dist/` a partir do zero, e o `astro preview` estava a servi-lo ao vivo a partir do disco — 404 transitórios, sem consequência para os números já medidos, todos gravados antes). A SEGUNDA tentativa falhou por um erro meu de orquestração e não do bloco: lancei dois `npm run build` em simultâneo na mesma worktree (um standalone e outro dentro do runner dos três portões), e os dois escreveram ao mesmo tempo em `dist/.prerender/`, partindo um módulo (`Cannot find module '.../chunks/index_q9GV1SEV.mjs'`) — um `ERR_MODULE_NOT_FOUND` de corrida de escrita, não um defeito do código do bloco. Matei os processos a mais e relancei os três portões um de cada vez, sozinhos na worktree; a TERCEIRA corrida (a única sem interferência minha) deu os três a zero: `build.exit=0`, `verify.exit=0`, `typecheck.exit=0`. `npm run build` demorou 5m29s (7222 páginas), a cadeia completa (build + verify + typecheck) cerca de 14 minutos — a máquina estava sob carga de outras sessões concorrentes (`uptime` chegou a mostrar carga média 3,2 com 4 utilizadores ligados), e não é uma medida do bloco.

---

## U1, por área (lado do quadrado inscrito, px de ecrã, grelha de 2px)

### País, 390px de largura (29 unidades; 29 abaixo de 44px; mediana 16px)

| unidade | lado | bbox (px) |
|---|---:|---|
| ilha-do-corvo | 0 | 1,1 × 1,7 |
| ilha-da-graciosa | 0 | 2,9 × 2,5 |
| ilha-das-flores | 0 | 3,4 × 4,5 |
| ilha-de-santa-maria | 0 | 4,0 × 2,6 |
| ilha-de-porto-santo | 0 | 8,2 × 9,6 |
| ilha-de-sao-jorge | 0 | 13,1 × 6,6 |
| ilha-do-faial | 2 | 5,5 × 3,8 |
| ilha-terceira | 2 | 7,8 × 4,8 |
| ilha-do-pico | 2 | 11,9 × 5,3 |
| ilha-de-sao-miguel | 2 | 16,7 × 6,0 |
| ilha-da-madeira | 10 | 86,8 × 205,0 |
| leiria | 14 | 86,6 × 70,1 |
| aveiro | 16 | 42,7 × 64,9 |
| faro | 16 | 98,6 × 43,8 |
| porto | 16 | 56,2 × 38,4 |
| setubal | 18 | 69,7 × 85,8 |
| viana-do-castelo | 20 | 49,0 × 45,2 |
| viseu | 20 | 64,8 × 72,4 |
| coimbra | 22 | 72,4 × 48,0 |
| braga | 24 | 61,5 × 41,1 |
| lisboa | 24 | 44,2 × 50,8 |
| santarem | 28 | 73,3 × 87,9 |
| guarda | 30 | 65,6 × 77,0 |
| braganca | 32 | 76,4 × 79,4 |
| castelo-branco | 32 | 87,9 × 70,5 |
| portalegre | 32 | 85,6 × 72,4 |
| vila-real | 32 | 58,3 × 66,3 |
| evora | 34 | 95,3 × 68,6 |
| beja | 36 | 116,0 × 78,6 |

### País, 1280px de largura (29 unidades; 26 abaixo de 44px; mediana 24px)

| unidade | lado | bbox (px) |
|---|---:|---|
| ilha-do-corvo | 0 | 1,4 × 2,3 |
| ilha-de-santa-maria | 0 | 5,3 × 3,5 |
| ilha-da-graciosa | 0 | 3,8 × 3,3 |
| ilha-de-sao-jorge | 0 | 17,4 × 8,8 |
| ilha-das-flores | 2 | 4,5 × 6,0 |
| ilha-de-porto-santo | 2 | 10,9 × 12,8 |
| ilha-do-faial | 2 | 7,3 × 5,0 |
| ilha-de-sao-miguel | 2 | 22,2 × 8,0 |
| ilha-do-pico | 2 | 15,8 × 7,1 |
| ilha-terceira | 4 | 10,4 × 6,4 |
| ilha-da-madeira | 12 | 115,3 × 272,3 |
| leiria | 18 | 115,0 × 93,1 |
| faro | 20 | 130,9 × 58,2 |
| aveiro | 22 | 56,7 × 86,2 |
| coimbra | 24 | 96,1 × 63,8 |
| viana-do-castelo | 24 | 65,1 × 60,0 |
| porto | 26 | 74,6 × 51,0 |
| setubal | 26 | 92,5 × 114,0 |
| viseu | 28 | 86,1 × 96,1 |
| lisboa | 30 | 58,7 × 67,5 |
| vila-real | 32 | 77,5 × 88,0 |
| braga | 34 | 81,7 × 54,6 |
| guarda | 38 | 87,1 × 102,2 |
| santarem | 38 | 97,4 × 116,8 |
| braganca | 42 | 101,5 × 105,5 |
| portalegre | 42 | 113,6 × 96,1 |
| **castelo-branco** | **44** | 116,7 × 93,6 |
| evora | 46 | 126,6 × 91,1 |
| beja | 48 | 154,1 × 104,4 |

(castelo-branco fica exactamente nos 44px, contado como "não abaixo de 44": daí 26 e não 27 abaixo do alvo)

### Évora crescida, 390px (14 concelhos; 12 abaixo de 44px; mediana 29px)

| concelho | lado | bbox (px) |
|---|---:|---|
| borba | 14 | 43,5 × 69,0 |
| vila-vicosa | 14 | 73,5 × 57,1 |
| vendas-novas | 18 | 70,4 × 68,4 |
| mourao | 20 | 81,3 × 91,6 |
| viana-do-alentejo | 24 | 104,1 × 58,5 |
| estremoz | 28 | 87,2 × 104,3 |
| redondo | 28 | 59,5 × 89,9 |
| mora | 30 | 96,1 × 71,8 |
| reguengos-de-monsaraz | 30 | 69,0 × 95,9 |
| alandroal | 38 | 90,5 × 110,6 |
| arraiolos | 38 | 120,5 × 96,9 |
| portel | 38 | 120,5 × 80,1 |
| montemor-o-novo | 46 | 139,0 × 139,0 |
| evora | 62 | 153,5 × 137,1 |

---

## U2 — o nome no lugar fixo (detalhe)

Rato e toque apontaram exactamente ao ponto representativo do artefacto (transformado para px de ecrã pela CTM do caminho), não ao centro do bounding-box: a primeira tentativa usou `locator.hover()`/`locator.tap()` do Playwright (que miram o centro do bbox) e falhou por timeout na Madeira — o centro geométrico da caixa da Madeira (alta por causa das Selvagens) cai fora do preenchimento do caminho, e é o próprio `<svg>` que intercepta o ponteiro nesse ponto. Corrigido apontando ao `ponto` do artefacto em todos os gestos.

- **Rato** (`page.mouse.move` ao ponto, depois lê `[data-mapa-nome-texto]`): 29/29 unidades do país correctas, 14/14 concelhos de Évora correctos.
- **Teclado, foco por guião** (`locator.focus()`): 29/29 e 14/14 correctos.
- **Teclado, Tab real** (sequência `page.keyboard.press('Tab')` desde o topo do documento, sem atalhos): a primeira área do mapa só é alcançada ao fim de mais de 60 tabs (a busca subiu o orçamento para 250); confirmados os 3 primeiros nomes em ordem de documento (Aveiro, Beja, Braga), todos correctos — o que confirma que o foco por guião usado no varrimento completo é um proxy fiel do Tab real.
- **Toque** (`page.touchscreen.tap` ao ponto, contexto `hasTouch:true`): 29/29 e 14/14 correctos. Entre toques em unidades diferentes foi preciso recarregar a página (um toque numa unidade cresce-a, escondendo as outras 28 com `hidden`); entre toques em concelhos diferentes de Évora crescida não foi preciso — o primeiro toque num concelho diferente do último tocado mostra o nome sem navegar (ver U3), o que permitiu o varrimento sequencial sem reset.

## U3 — o primeiro toque nunca navega (detalhe)

Quatro gestos, com `hasTouch:true` e `page.touchscreen.tap`, `location.pathname` lido antes e depois de cada um:

1. Toque numa unidade (Aveiro): `pathname` fica em `/` (só o fragmento muda, para `#unidade=aveiro`).
2. Primeiro toque num concelho de Évora crescida (o concelho de Évora): `pathname` fica em `/`, o lugar do nome passa a dizer «Évora».
3. Segundo toque no mesmo concelho: `pathname` passa a `/municipios/evora`.
4. Porta «Abrir →», depois de crescer Évora: `href` era `/distritos/evora`; o toque levou `pathname` a `/distritos/evora`.

**Bónus, rato em vez de toque:** um clique de RATO (não toque) no mesmo concelho de Évora, depois de o rato já ter passado por cima dele (o que já mostra o nome), navega logo ao primeiro clique — `/` → `/municipios/evora` num só gesto, sem o passo intermédio que o toque tem. Não é uma das medidas pedidas, mas confirma a leitura do código-fonte (`public/js/mapa-unidades.js:395-400`): o `preventDefault` do "primeiro toque" só corre quando o gesto é reconhecidamente `touch`.

## U4 — sem guião (detalhe)

Com `javaScriptEnabled:false`:

- Dentro de `#mapa[data-mapa-raiz]` há **31** `a[href]`, não 29: as 29 portas de unidade (`data-uni-porta`, para `/distritos/<slug>`) mais **2 ligações ocultas** do lugar do nome (`data-mapa-porta` e `data-mapa-voltar`, herdadas de `LugarDoNome.astro`, ambas com `href="/"` por defeito e ambas com o atributo `hidden` presente no HTML entregue — nunca visíveis, e presentes no DOM independentemente de JavaScript). Contando só as portas de unidade: **29**.
- Os 29 destinos das portas de unidade, pedidos ao servidor local (`fetch`, `redirect:'manual'`): **29 de 29 com 200**.
- A gaveta dos nomes (`[data-mapa-ilhas]`, dentro de um `<details data-gaveta="nomes">`): **29** ligações (`a[data-lista-porta]`), uma por unidade, com os nomes e destinos correctos; o `<details>` chega **fechado** (`open` ausente) — as ligações estão no HTML entregue mas não visíveis até o leitor abrir a gaveta, o que é coerente com um `<details>` nativo (funciona sem guião).
- Procurados os 9 slugs de região que a lista de regiões do sítio usa (`src/data/regioes.mjs`, excluindo `portugal`, que é só a referência): `grande-lisboa`, `peninsula-de-setubal`, `algarve`, `madeira`, `alentejo`, `norte`, `centro`, `oeste-e-vale-do-tejo`, `acores`. **Nenhum** aparece como `data-uni-porta` no mapa nem como `data-lista-porta` na gaveta; **nenhuma** ligação do mapa ou da gaveta aponta para `/regioes/...`.
- `/#unidade=evora` sem guião: `data-nivel` do `<figure>` fica em `pais`; as 29 áreas do país continuam no DOM; o grupo dos concelhos (`[data-areas-concelhos]`) existe mas continua com o atributo `hidden` e **0** filhos — o fragmento não tem efeito nenhum sem o guião que o lê (`public/js/mapa-unidades.js` nunca corre).

## U5 — a altura da página

`document.documentElement.scrollHeight` de `/` a 390px, depois de `networkidle` e de `document.fonts.ready`: **3263px**. `document.fonts.status` = `loaded` antes e depois da espera explícita; `document.fonts.check('16px "<família>"')` verdadeiro para as três famílias declaradas em `src/styles/tokens.css` (`--f-prosa: Spectral`, `--f-instr: Bitter`, `--f-versal: Spectral SC`) — `document.fonts.size` = 8 (oito entradas de fonte carregadas).

## U7 — a página do concelho (`/municipios/evora/`)

Confirma-se o que o bloco afirma: a página do concelho **não foi alterada** por este bloco. O cartão do mapa (`postura="localizador"`) continua a renderizar o SVG dos **308 pontos** (`g.mapa-pontos[data-pontos] circle.mun`, 308 encontrados), com o círculo de Évora marcado (`circle.mun-escolhido`, `data-m="Évora"`), e não os 14 concelhos como áreas: `data-mapa-areas`/`data-mapa-concelhos` estão ausentes desse SVG, e não há um único `path.uni` de concelho na página. O atributo `data-nivel` no `<figure>` está ausente (o componente só o escreve quando `nivel !== 'pontos'`; a chamada em `src/views/MunicipioView.astro:579-586` não passa `nivel`, e o valor por omissão para `postura="localizador"` é `pontos`). Isto é consistente com o comentário do próprio componente (`MapaRespira.astro:90-107`): o nível da unidade existe no componente mas a página do concelho ainda não o pede.

## U1b — Braga e Porto crescidos, 390px (bónus)

| unidade | concelhos | abaixo de 44px | mediana | mín | máx |
|---|---:|---:|---:|---:|---:|
| Braga | 14 | 12 | 36px | 10px | 58px |
| Porto | 18 | 17 | 26px | 14px | 52px |

Mesma técnica do U1 (ponto do artefacto, 9 âncoras, grelha de 2px). Confirma o mesmo padrão de Évora: mesmo com um distrito de muitos concelhos pequenos (Porto, 18 concelhos numa área relativamente reduzida), a esmagadora maioria dos alvos fica abaixo dos 44px a 390px de largura — só 1 de 18 no Porto e 2 de 14 em Braga chegam ao alvo.

## Paridade em `/en/`

O brief do U2 pede a contagem "nas duas edições": `node u2-nome-en.mjs` repetiu o varrimento completo do U2 em `/en/` (rato, teclado por foco e toque, país e Évora crescida) e deu **29/29 e 14/14 em cada um dos três modos**, igual à edição portuguesa. As restantes medidas (U1, U3, U4, U5, U7) foram feitas só em português; esta secção acrescenta um confronto por amostragem da inglesa para elas, para confirmar que o bloco cobre as duas edições como afirma.

- `/en/` com guião: **29** áreas em `svg[data-mapa-areas]`, `aria-label="Map of the districts and islands of Portugal, one area per unit."`. Nomes das unidades (amostra de 5) idênticos aos da Carta em português (Aveiro, Beja, Braga, Bragança, Castelo Branco) — os nomes de lugar não se traduzem, como o código documenta.
- Évora crescida em `/en/`: 14 concelhos desenhados, nomes iguais aos da versão portuguesa (`nomesBatemComPt: true`), porta «Open →» com `href="/en/districts/evora"`.
- Sem guião em `/en/`: 29 ligações, 29/29 destinos a 200, 29 na gaveta.
- `/en/municipalities/evora/`: mesmo estado que a versão portuguesa — cartão com 308 pontos, `postura="localizador"`.

Não encontrei nenhuma divergência entre as duas edições.

## As molduras das ilhas (bounding boxes em px de ecrã, nível do país)

| largura | Madeira (x,y,w,h) | Açores (x,y,w,h) | sobreposição |
|---|---|---|---|
| 390px | 97,8 / 1008,5 / 87,0 × 223,9 | 16,7 / 1109,1 / 145,4 × 83,0 | **sim**, 64,3 × 83,0px (5336px²) |
| 1280px | 797,9 / 776,5 / 115,5 × 297,4 | 690,1 / 910,0 / 193,2 × 110,2 | **sim**, 85,4 × 110,2px (9413px²) |

As duas caixas sobrepõem-se de facto, nas duas larguras. Não é um artefacto de amostragem: confirma-se nos dados brutos do artefacto (`mapa/pais.json`) — a caixa da Madeira é `[1527, 4526, 1358, 3496]` (alta porque contém as Selvagens, até y=8022) e a dos Açores é `[260, 6096, 2271, 1296]` (até y=7392); em y, o intervalo dos Açores (6096–7392) cai inteiramente dentro do da Madeira (4526–8022), e em x os dois intervalos cruzam-se (1527–2885 vs 260–2531). A sobreposição medida em px de ecrã bate certo com esta conta (1004×1296 unidades de campo, à escala de cada largura). Isto é sobre os **rectângulos da moldura**, não necessariamente sobre os desenhos das ilhas lá dentro: a Madeira propriamente dita fica bem a norte do cruzamento, e o que se sobrepõe é a parte da caixa que existe só para enquadrar as Selvagens.

## O que não medi

- **Enter pelo teclado** a activar o crescimento de uma unidade ou a navegação de um concelho: testei o foco (que mostra o nome, "o primeiro toque") nas 29+14 áreas em ambos os níveis, e testei a navegação por RATO e por TOQUE (U3), mas não testei explicitamente o `Enter` a seguir ao foco. O código-fonte (`public/js/mapa-unidades.js:403-406`) documenta que o Enter dispara um `click` nativo do browser sobre a ligação com foco, e que esse `click` corre exactamente o mesmo caminho que já testei para o rato; não corri esse gesto específico pelo teclado.
- **Resolução exacta do quadrado inscrito do U1** nas concavidades mais estreitas: o método amostra o perímetro do quadrado candidato a uma resolução de 3 a 10 pontos por lado (não um teste do interior contínuo); uma concavidade suficientemente estreita para passar entre duas amostras consecutivas sem as tocar não seria detectada. Não tentei quantificar o erro que isto introduz.
- **Todos os 29 distritos/ilhas crescidos** para o U1: medi Évora (pedida), Braga e Porto (bónus, "se der tempo"); não medi os restantes 26.

