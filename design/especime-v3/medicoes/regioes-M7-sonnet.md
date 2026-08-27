# Medição M7 (Sonnet) — bloco «As regiões» — relatório de duas corridas

Medidor cego: Claude Sonnet 5, numa cópia isolada do repositório (`wt-medidor`, worktree destacado). Leu apenas a Emenda 21 (`design/especime-v3/direcao.md`, §131–133 — **inalterada** entre as duas corridas, confirmado por diff de linha), as linhas `ledger/claims/pib-pc-*.yml` e `ledger/claims/distancia-*.yml`, e a lista de tarefas recebida em cada corrida. Nunca leu `src/`, nunca leu `scripts/` (correu um script de lá — não o leu), nunca leu `DECISIONS.md` nem outras notas ou briefings dos construtores, nunca leu o trabalho de outros medidores.

- **Corrida 1** — commit `9ccfcd9`, 5 regiões (Alentejo, Algarve, Grande Lisboa, Madeira, Península de Setúbal) + Portugal.
- **Corrida 2** — commits `63aba22` → `a2573b4` → `451d0c6`, 9 regiões (+ Norte, Centro, Oeste e Vale do Tejo, Açores) + Portugal. Recreada pelo coordenador com o `dist/` novo já congelado e o instrumento da corrida 1 já copiado para dentro.

## Método

- **Sítio:** o `dist/` congelado de cada corrida, servido por `python3 -m http.server 4791 --bind 127.0.0.1` a partir de dentro de `dist/` (porta confirmada livre antes de cada arranque; a corrida 2 usou de novo a 4791, depois de a 1 ter sido fechada).
- **Instrumento:** `design/especime-v3/medicoes/regioes-M7-sonnet.mjs`, escrito de raiz na corrida 1, **o mesmo ficheiro**, ajustado para a corrida 2 (ver secção seguinte) — não um segundo ficheiro. Node + Playwright, `NODE_PATH` apontado ao `node_modules` do repositório principal.
- **Motor real:** computador = Chromium 148.0.7778.96 em 1280×800; telemóvel = WebKit 26.4 com o perfil oficial do Playwright «iPhone 13» (390×664 CSS, DPR 3, táctil, UA Safari/iOS 15).
- **Prova antes do zero:** cada comparador usado a sério é primeiro corrido contra um caso avariado de propósito, com `must()` a abortar a medição inteira (código de saída 2) se não acender a vermelho. Corrido nas duas corridas, não só na primeira.
- **Corrida 1:** código de saída `0`, 49,0 s, 186 medições — 172 OK, 8 vermelhos-de-prova, 6 informativas, **0 FAIL**.
- **Corrida 2:** código de saída `0`, 69,8 s, 279 medições — 265 OK, 8 vermelhos-de-prova, 6 informativas, **0 FAIL**.

Reprodução: `NODE_PATH=<repo-principal>/node_modules node design/especime-v3/medicoes/regioes-M7-sonnet.mjs`, com `BASE_URL` a apontar ao `dist/` servido (default `http://127.0.0.1:4791`).

## O que mudou no instrumento entre as duas corridas

A instrução era "não ajustar nada nos detectores excepto o que o novo conjunto exige". Quatro ajustes, todos de dados/parâmetros, nenhum de lógica de comparação:

1. **`ROUTES_1`** (a lista de rotas a medir na secção 1) deixou de ser uma lista de nomes escrita à mão e passou a gerar-se a partir de `EXPECTED_REGION_SLUGS` — o mesmo conjunto, lido do livro-razão, que já alimentava os comparadores. Sem isto, a corrida 2 mediria só as 5 regiões antigas e ignoraria as 4 novas por completo — não um ajuste cosmético, uma correcção necessária.
2. **`REDIRECTS`** (secção 4) ganhou um quinto caso, `/?ambito=regiao:norte`, para além dos 4 originais (que se mantiveram intocados, para comparação directa entre corridas). Razão: os 4 originais só provam que o mecanismo funciona para uma região que já existia antes; sem um caso novo, uma lista-permissão (`data-regioes`) que tivesse ficado presa às 5 antigas passaria sem ser apanhada.
3. **Grupo A dos cliques** (secção 6) já lia `EXPECTED_REGION_SLUGS` dinamicamente desde a corrida 1 (não foi preciso mudar código) — por isso cresceu de 5 para 9 cliques sozinho. Decisão tomada: manter "uma porta por região, todas elas", não uma amostra de 5 das 9 — porque as portas novas são exactamente a parte que mudou, e amostrar arriscava nunca as testar.
4. O título da secção 6 e um comentário deixaram de dizer "cinco"/"dez" a fixo e passaram a contar `EXPECTED_REGION_SLUGS.length`.

Os comparadores em si — `compareClaimTexts`, `compareSlugSets`, a geometria da régua e da barra, `diffByRole`, `isRendered()` — **não mudaram uma linha**.

## O livro-razão lido — corrida 2 (10 linhas `pib-pc-*-2024`, 9 regiões + Portugal)

| id | value | unit | corrida |
|---|---:|---|---|
| `pib-pc-portugal-2024` | 82 | índice (UE-27=100) | 1 e 2 |
| `pib-pc-alentejo-2024` | 77 | índice (UE-27=100) | 1 e 2 |
| `pib-pc-algarve-2024` | 89 | índice (UE-27=100) | 1 e 2 |
| `pib-pc-grande-lisboa-2024` | 129 | índice (UE-27=100) | 1 e 2 |
| `pib-pc-madeira-2024` | 88 | índice (UE-27=100) | 1 e 2 |
| `pib-pc-peninsula-de-setubal-2024` | 55 | índice (UE-27=100) | 1 e 2 |
| `pib-pc-norte-2024` | 71 | índice (UE-27=100) | **nova na 2** |
| `pib-pc-centro-2024` | 71 | índice (UE-27=100) | **nova na 2** |
| `pib-pc-oeste-e-vale-do-tejo-2024` | 65 | índice (UE-27=100) | **nova na 2** |
| `pib-pc-acores-2024` | 73 | índice (UE-27=100) | **nova na 2** |
| `distancia-norte-ue27-2024` | 29 | pontos de índice | **nova na 2** |
| `distancia-centro-ue27-2024` | 29 | pontos de índice | **nova na 2** |
| `distancia-oeste-e-vale-do-tejo-ue27-2024` | 35 | pontos de índice | **nova na 2** |
| `distancia-acores-ue27-2024` | 27 | pontos de índice | **nova na 2** |

(mais as linhas já conhecidas da corrida 1 — `distancia-{portugal,alentejo,algarve,grande-lisboa,madeira,peninsula-de-setubal}-ue27-2024`, `pib-pc-alentejo-2000`=78, `distancia-alentejo-ue27-2000`=22, `distancia-setubal-grande-lisboa-2024`=74 — inalteradas.)

`dist/regioes/` e `dist/en/regions/` têm exactamente 9 subpáginas na corrida 2 — nenhuma a mais, nenhuma a menos, igual ao conjunto `pib-pc-*-2024` menos Portugal.

## Autoteste — igual nas duas corridas (o mesmo comparador, provado outra vez em cada uma)

| comparador | caso vermelho injectado | corrida 1 | corrida 2 |
|---|---|---|---|
| `compareClaimTexts` | cópia do valor de `pib-pc-alentejo-2024` alterada para `"999"` | apanhado (999≠77) | apanhado (999≠77) |
| `compareSlugSets` (órfã) | região fictícia `faroeste-fictício` injectada | apanhada | apanhada |
| `compareSlugSets` (em falta) | 1ª região do conjunto omitida | apanhado (`alentejo`) | apanhado (`acores` — a lista mudou de ordem alfabética com as novas regiões, o comparador seguiu-a sem intervenção) |
| `assertEqual` | `"algarve"` vs `"alentejo"` | `ok=false` | `ok=false` |
| `assertGE` | `43.9 ≥ 44` | `ok=false` | `ok=false` |
| geometria (`withinEps`) | marca deslocada 20px | rejeitado (>0,5px) | rejeitado (>0,5px) |
| `diffByRole` | uma cor trocada num conjunto sintético | 2 valores vistos | 2 valores vistos |
| `isRendered()` | um `.tk` real dentro do eixo oculto no telemóvel | `false` | `false` |

Nenhum comparador precisou de ser tocado para continuar a acender a vermelho correctamente com o conjunto maior — inclusive o de "em falta", que mudou sozinho de apanhar "alentejo" para apanhar "acores" só porque `EXPECTED_REGION_SLUGS[0]` mudou com a ordenação alfabética do conjunto maior.

## Resultados por secção — corrida 1 vs. corrida 2

### 1 · Conjunto de regiões, valores e distâncias

| | corrida 1 (5 regiões) | corrida 2 (9 regiões) |
|---|---|---|
| rotas medidas (índice + subpáginas, PT+EN) | 12 | 20 |
| combinações rota×viewport | 24 | 40 |
| claims no índice (`/regioes`) | 12 | 20 |
| claims numa subpágina com 1 `distancia-*` | 16 | 24 |
| claims numa subpágina com 2 `distancia-*` (Alentejo, Península de Setúbal) | 17 | 25 |
| **1.valores** — todo `[data-claim]` == livro-razão | 0 divergências | 0 divergências |
| **1.conjunto-régua / 1.conjunto-lista** — desenhadas == linhas existentes, nos dois sentidos | 0 em falta, 0 órfãs | 0 em falta, 0 órfãs |
| **1.geometria-régua** — `cx` de cada marca == posição(valor) | 0 fora de ±0,5px (6 marcas/rota) | 0 fora de ±0,5px (10 marcas/rota) |
| **1.distância-geom** — largura da barra == \|100−valor\|×escala | 0 fora de ±0,5px (6 barras/rota) | 0 fora de ±0,5px (10 barras/rota) |

Exemplos medidos (corrida 2, regiões novas — `min=50,max=135,RL=64,RR=916`, escala régua=10,0235294, escala barra=7,0588235):

| região | valor | `cx` esperado | `cx` real | distância | largura esperada | largura real |
|---|---:|---:|---:|---:|---:|---:|
| Norte | 71 | 274,494 | **274,494** | 29 | 204,706 | **204,706** |
| Açores | 73 | 294,541 | **294,541** | 27 | 190,588 | **190,588** |
| Centro | 71 | 274,494 | **274,494** | 29 | 204,706 | **204,706** |

Nota: Norte e Centro têm o mesmo valor (71) e por isso a mesma posição `cx` — a régua resolve a coincidência empilhando as placas por níveis (`patamares` no JSON embutido da página), não deslocando a posição; os dois foram medidos independentemente e batem os dois, o que confirma que a régua não "empurra" marcas para evitar sobreposição visual — só empilha o rótulo.

**Cobertura das linhas `distancia-*`** (informativo): corrida 2 imprime `distancia-{acores,alentejo-2000,alentejo,algarve,centro,grande-lisboa,madeira,norte,oeste-e-vale-do-tejo,peninsula-de-setubal,setubal-grande-lisboa}` nalguma página de região — 11 linhas, acima das 7 da corrida 1. Continua **sem imprimir** `distancia-portugal-ue27-2024` em nenhuma página de região, nas duas corridas — não é um desacordo (a Emenda 21 nunca promete que toda linha apareça nas páginas de região).

### 2 · Neutralidade

| | corrida 1 | corrida 2 |
|---|---|---|
| elementos medidos em `/regioes` (entidades × 8 papéis) | 48 (6×8) | 80 (10×8) |
| divergências em fill/stroke/colour/font-weight no índice | 0 | 0 |
| `/regioes/alentejo` — fill/colour/font-weight, incl. a própria | idênticos | idênticos |
| única propriedade que isola "ale" na régua SVG | `stroke`: `none` → outras / `rgb(23,25,27)` → ale | igual, agora com 8 outras regiões no grupo `none` |
| única propriedade que isola "ale" na lista | `outline`: `3px none ...` → outras / `1px solid rgb(23,25,27)` → ale | igual, agora com 8 outras no grupo `3px none` |

A resposta a "o que difere para a Alentejo" não mudou de corrida para corrida: o contorno, e só ele — `stroke` na placa da régua SVG, `outline` na linha da lista. Confirmado de novo com 8 regiões neutras ao lado, não só 4.

### 3 · Forma de telemóvel (iPhone 13)

| verificação | corrida 1 | corrida 2 |
|---|---|---|
| régua com eixo oculta / lista visível | PASS | PASS |
| rótulos do eixo nenhum visível | 0/9 `.tk` | 0/9 `.tk` (mesmo número — o eixo não cresce com as regiões, só a lista) |
| "100" marcado em cada linha | 6/6 | 10/10 |
| linhas sem sobreposição, altura uniforme | 6 linhas, 84,6px | 10 linhas, 84,6px (mesma altura — não comprime com mais regiões) |
| porta ≥44px, uma por região | 5/5 a exactamente 44,00px | 9/9 a exactamente 44,00px |
| porta mais estreita (largura, informativo — não gated) | Algarve, 57,30px | **Norte, 43,02px** — nome curto, ainda bem acima do mínimo de altura, que é o que conta |
| overflow horizontal | 0px | 0px |

### 4 · Endereços antigos

| endereço | esperado | corrida 1 | corrida 2 |
|---|---|---|---|
| `/?ambito=regiao:alentejo` | `/regioes/alentejo/` | PASS | PASS |
| `/?ambito=regiao:portugal` | `/regioes/` | PASS | PASS |
| `/?ambito=regiao:nao-existe-xyz` | `/regioes/` | PASS | PASS |
| `/en/?ambito=regiao:alentejo` | `/en/regions/alentejo/` | PASS | PASS |
| `/?ambito=regiao:norte` (só corrida 2 — região nova) | `/regioes/norte/` | — | **PASS** |

A lista-permissão do redireccionamento (`data-regioes` no comando «Região» da primeira página) cresceu com a régua: continha as 5 regiões na corrida 1, contém as 9 na corrida 2, confirmado empiricamente pelo próprio redireccionamento de "norte" a funcionar.

### 5 · Primeira página

Sem mudanças entre corridas: `[data-cabeca]` só `"pais"`, comando País·Região·Concelho / Country·Region·Municipality na ordem certa, «Região»/«Region» a ligar a `/regioes` e `/en/regions`. PASS nas duas corridas, PT e EN.

### 6 · Cliques reais

| | corrida 1 | corrida 2 |
|---|---|---|
| portas do índice (uma por região) | 5 | **9** |
| «Região» ⇄ voltar | 5 | 5 |
| **total** | **10** | **14** |
| resultado | 10/10 PASS | 14/14 PASS |

As 4 portas novas (Açores, Centro, Norte, Oeste e Vale do Tejo) clicadas e confirmadas a chegar a `/regioes/acores/`, `/regioes/centro/`, `/regioes/norte/`, `/regioes/oeste-e-vale-do-tejo/`, respectivamente.

### 7 · `node scripts/medir-defeitos.mjs`

| | corrida 1 | corrida 2 |
|---|---|---|
| páginas medidas no sítio inteiro | 6462 | (não recontado — o próprio relatório do script não repete o número na secção lida; autorreferência e falhas confirmadas de qualquer forma) |
| rotas de regiões encontradas | 12 (6 PT + 6 EN) | 20 (10 PT + 10 EN) |
| autorreferência 0 nessas rotas | confirmado em todas | confirmado em todas |
| marcas de falha (✗/FALHA/ERRO) no sítio inteiro | 0 | 0 |
| tripwire da voz | 65 marcadores · 7 excepções · 641 frases · 25455 ocorrências · 1350 rotas · **0 achados** | 65 marcadores · 7 excepções · 649 frases · 25599 ocorrências · 1358 rotas · **0 achados** |

## As duas notas de contexto do coordenador

**"A frase de cobertura saiu":** procurei "cobertura"/"coverage" no lede do índice (inalterado nas duas corridas: *"O índice de PIB per capita de cada região, em paridades de poder de compra, contra a média da UE-27."*) e em todas as páginas de região guardadas da corrida 1 (5 subpáginas PT+EN) e da corrida 2 (9 PT+EN) — **não encontrei essa frase em nenhuma das duas corridas**, nos ficheiros que guardei. Não é uma confirmação independente de "estava lá e saiu": é a confissão de que não tenho prova arquivada do "antes" para esta frase específica — pode ter vivido numa página ou nota que não guardei da corrida 1, ou fora do que uma medição cega às notas dos construtores consegue ver. Registo isto por transparência, não como facto verificado.

**"Os cartões de distância perderam o separador pendente":** este apanhei com prova concreta, antes/depois, nos meus próprios ficheiros:
- **Corrida 1** (`pt-alentejo.html` guardado): `<p class="peca-unidade" data-medida-unidade>pontos do índice · <span></span></p>` — um "·" a seguir a "pontos do índice", com um `<span>` vazio depois, sem nada a fechar a frase.
- **Corrida 2** (a mesma página, ao vivo): `<p class="peca-unidade" data-medida-unidade>pontos do índice</p>` — sem separador, sem `<span>` vazio.

Confirmado: o separador pendente existia na corrida 1 e não existe na corrida 2, no mesmo cartão da mesma região.

## Observação para o diretor — mantida das duas corridas

A Emenda 21(a) descreve a régua como "no computador com o eixo e no telemóvel como lista com barras", o que pode ler-se como as duas formas sendo mutuamente exclusivas. Medido nas duas corridas, em 1280×800: **as duas formas continuam ambas no DOM e visíveis** — a régua SVG com eixo, e por baixo dela a lista ("Leitura breve"), uma abaixo da outra, sem sobreposição. Só no telemóvel a régua desaparece (`display:none`).

| | corrida 1 | corrida 2 |
|---|---|---|
| altura da régua com eixo (`.conv-eixo`) | 324,5px | 324,5px (não muda — mesma escala, mesmo número de traços do eixo) |
| altura da lista (`.conv-lista-caixa`) | 560,5px | 898,9px (cresce com as 4 linhas novas) |

O facto não mudou de corrida para corrida, só o tamanho da lista. Continua a não ser pontuado como desacordo — nenhum dos sete pontos da tarefa pede a ausência da lista no computador, e a leitura alternativa (lista como resumo sempre presente, "no computador com o eixo" a descrever qual é a forma gráfica principal) continua pelo menos tão plausível quanto a leitura de exclusividade. Registo o facto, com o número, para o diretor decidir.

## Casos conhecidos vistos a vermelho (consolidado, as duas corridas)

Os 8 do Autoteste (tabela acima, provados nas duas corridas) mais um nono, real e não sintético, em cada corrida: a diferença de `stroke`/`outline` em `/regioes/alentejo` (secção 2) — sabia-se, antes de correr, pela estrutura do HTML (`data-contorno="sim"` só em "ale"), que o comparador de neutralidade tinha de acender aqui; acendeu nas duas corridas, isolando exactamente "ale" e mais nada, com 4 e depois 8 regiões neutras ao lado.

## Falsos alarmes

**Um, apanhado na corrida 1, corrigido antes de o relatório da corrida 1 sair, e confirmado que continua corrigido na corrida 2 (não voltou).** A primeira versão do detector de "100 marcado"/"rótulos do eixo ocultos" usava `Locator.isVisible()` do Playwright, que exige uma caixa delimitadora com largura e altura não-nulas. A linha de referência `.conv-ref` é uma linha SVG **vertical** (`x1===x2`): largura geométrica 0 por definição, mesmo perfeitamente pintada. Resultado da primeira tentativa (corrida 1): 0/6 falso-FAIL. Causa confirmada por `getComputedStyle`/`getBoundingClientRect` antes de mexer no código. Corrigido com um `isRendered()` próprio (sobe a cadeia de antepassados, olha só a `display`/`visibility`/`opacity` computados, nunca ao tamanho da caixa), provado num caso vermelho real antes de se confiar nele outra vez. A corrida 2 usa o mesmo `isRendered()`, provado de novo (linha do autoteste dentro da secção 3), e deu 10/10 — o defeito nunca existiu no sítio; o detector é que estava errado, e ficou corrigido no ficheiro que se copiou para a corrida 2.

Nenhum falso alarme novo na corrida 2 — a expansão de 5 para 9 regiões não abriu nenhum caso que o instrumento medisse mal.

## Desacordos

**Nenhum, nas duas corridas.** Corrida 1: 0 em 186 medições. Corrida 2: 0 em 279 medições, incluindo os casos novos exigidos pelo conjunto maior (a região Norte no redireccionamento, as 4 portas novas nos cliques, as 4 regiões novas em todas as sub-verificações da secção 1). Um "zero" limpo depois de nove comparadores provados a vermelho, duas vezes, é a resposta honesta aqui.

## Custo em tokens

Não visível a partir desta sessão, nas duas corridas — nenhuma ferramenta disponível reporta a contagem de tokens consumidos. Não inventado.

## Ficheiros

- Instrumento (um só ficheiro, usado nas duas corridas): `design/especime-v3/medicoes/regioes-M7-sonnet.mjs`
- Este relatório: `design/especime-v3/medicoes/regioes-M7-sonnet.md`
- Servidor usado nas duas corridas: `python3 -m http.server 4791 --bind 127.0.0.1`, a partir de `dist/` na cópia
