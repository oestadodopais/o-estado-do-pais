# Medição cega do Sonnet à cabeça nova (01.09.2026)

*Claude Sonnet 5, duas cópias construídas servidas em local, quatro estragos plantados na cópia «depois» (4 de 4 vistos; o registo no `.plantas.json` ao lado). Os achados reais foram consertados na segunda passagem ou decididos na §1.91. O relatório segue tal como veio.*

---

# Medição cega da cabeça nova

Modelo: Claude Sonnet 5. Data: 01.09.2026. Tempo gasto: cerca de 45 minutos de sessão (leitura dos briefs, arranque dos dois portos, escrita do programa, duas corridas completas e seis verificações dirigidas de seguimento). O programa completo (24 combinações de página × edição × viewport, quatro capturas de ecrã, os testes sem JavaScript, de teclado e de gaveta, e a medição de contraste em escuro) correu em 29 segundos. Símbolos gastos: não disponíveis nesta sessão (o harness não os deu a este medidor).

## 0 · Como medi

Servi `antes/` em `127.0.0.1:4381` e `depois/` em `127.0.0.1:4382` com `python3 -m http.server`, cada um a partir da sua pasta. Medi com Playwright (Chromium 148.0.7778.96, instalado em `/Users/nunosantos/Instruments/OEstadoDoPais/node_modules`) a 390×844 e 1280×800, nas seis páginas do brief, nas duas edições. Sem rede fora de `localhost`: o programa só abre `http://127.0.0.1:4381` e `http://127.0.0.1:4382`.

**A marca do selo que usei.** Segui IDENTIDADE.md §5 e §8: "Todo o `.src-chip` é uma âncora, ao pé do valor e com o `href` da linha daquele valor." Usei `.src-chip` como o selo e `[data-claim]` como o número que ele sela (a etiqueta do selo é `data-selo-etiqueta`, não a li). Para a célula 3, o primeiro `.src-chip` em ordem do DOM inclui um caso que não é o selo de uma medida do "Relance" (a legenda do mapa, ver célula 3); reporto os dois números com o método de cada um.

O ficheiro `_resultados.json`, nesta pasta, é a saída bruta do programa e sustenta todos os números abaixo (não é um dos dois ficheiros pedidos pelo brief, mas fica para conferência).

## Achados principais

Cinco factos concretos, à frente da tabela célula a célula porque pesam mais do que qualquer célula isolada:

1. **Um cartão da faixa nasceu sem selo.** Na página do país, o primeiro cartão ("Dívida pública", 89,7% do PIB) tem `data-claim` mas nenhum `.src-chip`. É a mesma medida que no `antes` (na grelha antiga `#painel`) tem o selo completo. Os outros 20 cartões da faixa do país têm selo. Bate exactamente na categoria "um cartão sem selo" que o próprio `BRIEF-forma-dos-dominios.md` §4 nomeia como estrago a plantar em `tests/inicio/faixa.mjs`.
2. **Um cartão da faixa nasceu sem alvo inteiro.** O segundo cartão do país ("Posição de investimento internacional") tem a âncora `.cartao-porta` medida a 20×20 px, no canto do cartão, contra 205×109 a 205×125 px em todos os outros 20 cartões do país (e em todos os 9 cartões de região e concelho). Bate na categoria "um cartão sem alvo" do mesmo parágrafo.
3. **A data do "Painel europeu" ficou por converter numa única página das seis.** `/` (país, português) mostra "2026-08-31" (ISO); as outras cinco páginas (país inglês, região nas duas edições, concelho nas duas edições) mostram "31.08.2026". No `antes`, as seis mostravam ISO.
4. **A etiqueta acessível da faixa ficou por traduzir numa única página das seis.** `/en/` (país, inglês) tem `aria-label="As medidas, uma por cartão"` (português); as páginas de região e concelho em inglês têm correctamente `"The measures, one per card"`.
5. **A cabeça não é o mesmo componente nas três camadas.** No país é uma grelha com rótulo, h1, manchete, a faixa e um bloco lateral com a gaveta dos nomes, a busca e o mapa, tudo dentro de `.cabeca-grelha`. Em região e concelho não há manchete, não há gaveta, não há busca e não há mapa de navegação junto da cabeça: só um `eyebrow` + `h1` + subtítulo, com a faixa a seguir como irmã solta. A região nem sequer tem mapa nenhum na página.

## Célula 1 · Altura do documento (país, 390 e 1280, duas edições)

Método: `document.documentElement.scrollHeight` depois de `networkidle`.

| Edição · viewport | antes | depois | veredito |
|---|---|---|---|
| pt · 390×844 | 7529 px | 7055 px | bate (mais baixa, não mais alta) |
| pt · 1280×800 | 4030 px | 4025 px | bate (5 px mais baixa) |
| en · 390×844 | 7484 px | 7025 px | bate |
| en · 1280×800 | 4014 px | 4009 px | bate (5 px mais baixa) |

A régua (`BRIEF-forma-dos-dominios.md` §4) pede que a página não fique mais alta do que hoje, medido de novo nesta construção (não o valor arquivado de 29.08, 7383/4003 px, que já não bate com o "antes" fresco por o conteúdo ter mudado entretanto). Pelas quatro medidas, a régua está cumprida com folga: `depois` é sempre mais baixa ou igual.

## Célula 2 · O primeiro ecrã a 390×844 (país)

Método: `getBoundingClientRect()` do rótulo, do h1, da manchete (`.cabeca-lede`), do primeiro `li.cartao` e de `figure.mapa`, comparados com `window.innerHeight` (844). Capturas em `capturas/pais-{pt,en}-{antes,depois}-390.png`.

| Elemento | antes pt | depois pt | veredito |
|---|---|---|---|
| Nome (rótulo) cabe | sim (236 px) | sim (236 px) | bate nos dois |
| Manchete inteira, sem corte | sim (bottom 408/494) | sim (idêntico) | bate nos dois |
| Primeiro cartão da faixa inteiro | não existe faixa | sim (bottom 705 ≤ 844) | só `depois` tem a peça a medir; bate em `depois` |
| Topo do mapa visível | não (top 899 > 844) | sim (top 726 ≤ 844) | não bate em `antes`; bate em `depois` |

A edição inglesa repete o mesmo padrão (h1 bottom 377, lede bottom 463, cartão bottom 689, mapa top 710, todos dentro de 844 em `depois`). **Veredito da célula: `depois` cumpre a régua às quatro partes; `antes` falha na parte do mapa, e não tinha faixa para falhar ou cumprir.** Confirmado pelas capturas: em `antes` o ecrã acaba a meio da parede de nomes de concelho, sem mapa nem cartão à vista; em `depois` o ecrã acaba com o primeiro cartão completo e o topo do contorno do mapa a aparecer.

## Célula 3 · Distância da manchete ao primeiro número selado (país, 390)

Método: `rect(.src-chip).top − rect(.cabeca-lede).bottom`, em px e em ecrãs de 844. Dois candidatos a "primeiro selo", porque o resultado muda muito consoante o escolhido (digo os dois, como o brief pede):

| Candidato a "primeiro selo" | antes pt | depois pt |
|---|---|---|
| (a) primeiro `.src-chip` em qualquer parte do documento | 933 px = 1,11 ecrãs (é o selo da legenda do mapa, "calculado · O Estado do País, apuramento próprio", não o selo de uma medida do Relance) | 180 px = 0,21 ecrãs (é o selo do 2.º cartão, porque o 1.º não tem selo, ver achado 1) |
| (b) primeiro `.src-chip` dentro do painel de medidas (`#painel` em antes, `ol.faixa` em depois) | 1873 px = 2,22 ecrãs (selo da própria "Dívida pública", a 1.ª medida nomeada na manchete) | 180 px = 0,21 ecrãs (idêntico a (a), porque a faixa vem antes do mapa e da legenda) |

Em inglês os valores são muito próximos (195 px = 0,23 ecrãs em depois, pelo mesmo motivo). **Veredito: bate a favor de `depois` por qualquer dos dois métodos** (de 1,11 ou 2,22 ecrãs para 0,21), mas note se que o número de `depois` está inflacionado pela ausência do selo no 1.º cartão: se esse selo existisse, o primeiro selo do `depois` seria ainda mais cedo (dentro do próprio 1.º cartão, hoje sem essa marca para medir). Não consigo confirmar nem desmentir com este método o "cerca de quatro ecrãs" que o `BRIEF-forma-dos-dominios.md` §4 atribui à leitura do lugar de direção de 31.08: a medida mais próxima que obtive para o "antes" fresco de hoje é 2,22 ecrãs (método b), não quatro. Não sei se a diferença é de conteúdo (a página mudou desde 31.08) ou de método (o que o lugar de direção olhou pode não ter sido o `.src-chip` da própria peça).

## Célula 4 · Alvos tocáveis

Método: `getBoundingClientRect()` de todos os `a, button, summary, input, [role="button"], [tabindex]` visíveis (excluí `aria-hidden="true"` e `hidden`).

**Abaixo de 1024 (390×844), contagem de alvos com menos de 44×44 px:**

| Página | antes | depois | veredito |
|---|---|---|---|
| País | 59 de 141 (42%) | 80 de 184 (43%) | não bate em nenhuma das duas; proporção quase igual |
| Região Alentejo | 36 de 48 (75%) | 36 de 52 (69%) | não bate em nenhuma das duas; `depois` ligeiramente melhor em proporção |
| Concelho Évora | 124 de 136 (91%) | 131 de 151 (87%) | não bate em nenhuma das duas; `depois` ligeiramente melhor em proporção |

A maioria dos alvos pequenos é **partilhada pelas duas versões**, não nova: os 24 nomes de distrito da lista (42,71×64,94 px, falha só na largura, por 1,3 px), todos os `.src-chip` (52,5 px de largura mas 14 a 19,19 px de altura, falham na altura), e os dois `a.prova-valor` no h1 (7,81×16 px). O único alvo pequeno **novo e exclusivo de `depois`** é o `a.cartao-porta` de 20×20 px do 2.º cartão do país (achado 2 acima); todos os outros `a.cartao-porta` medem 205 px de largura por 91 a 125 px de altura, acima do mínimo.

**A 1280, linhas de nome da lista do mapa (`.mapa-ilhas-lista`) com menos de 32 px:** 0 de 58 linhas em `antes`, 0 de 58 em `depois`. Bate nas duas.

## Célula 5 · A faixa

Método: existência e `role` implícito de `ol.faixa`, `aria-label`, contagem de `li`, `getComputedStyle(...).scrollSnapType`, comparação da caixa de `.cartao-porta` com a caixa do `li.cartao` pai, recarregamento com `javaScriptEnabled: false`, e uma sequência real de `Tab`/`Enter` com o teclado.

| Verificação | antes | depois | veredito |
|---|---|---|---|
| Existe uma faixa (país/região/concelho) | não, em nenhuma das três | sim, nas três | `depois` introduz a peça que o brief descreve |
| É lista no documento (`ol`) | n/a | sim, `ol.faixa` nas três camadas | bate |
| `scroll-snap-type` calculado | n/a | `x mandatory` nas três camadas, 390 e 1280 | bate |
| Nome acessível da lista | n/a | pt: "As medidas, uma por cartão" nas três; en: "The measures, one per card" em região e concelho, **mas "As medidas, uma por cartão" (português) no país** | não bate no país inglês (achado 4) |
| Nº de cartões | n/a | país 21, região 2, concelho 7 | informativo |
| Cartões com JavaScript desligado | n/a (sem faixa) | 21/2/7, os mesmos números, cartões presentes e percorríveis | bate |
| Cada cartão é alvo inteiro (caixa do `a` = caixa do `li`) | n/a | 0 de 30 cartões tem a caixa do `a` idêntica à do `li` até 2 px; a maioria cobre a largura toda e cerca de 55 a 65% da altura (falta a linha `.cartao-unidade` no fundo); um cartão (achado 2) cobre só 20×20 px | não bate à letra em nenhum cartão; ver nota abaixo |
| Cada cartão tem selo | n/a | 29 de 30 (falta no 1.º cartão do país, achado 1) | não bate no país |
| Tab chega a cada cartão, Enter abre um endereço | n/a | confirmado: Tab focou sucessivamente `a.cartao-porta`, outro `a.cartao-porta`, depois um `a.src-chip` (a ordem inclui os selos como paragens próprias); Enter no primeiro cartão focado mudou `location.hash` de "" para "#m-divida-publica-2025" | bate |
| Leitor de ecrã anuncia "lista de N cartões" | não testei com leitor de ecrã real; a lista tem semântica nativa de `ol` (papel de lista implícito) e nome acessível, o que basta para um leitor de ecrã anunciar a contagem de itens por si | não verificado por leitor de ecrã, só por semântica |

**Nota sobre "cada cartão é um alvo inteiro".** Fiz o teste geométrico (caixas iguais) e falhou em todos os 30 cartões, por pouco na maioria (falta só a faixa do fundo do cartão, a linha da unidade/ano). Fiz também um teste empírico com clique real: num cartão comum (1.º do país, o mesmo que não tem selo), clicar no nome ("Dívida pública", fora da caixa geométrica do `a` mas dentro da grelha CSS que ele ocupa) mudou o hash com JavaScript desligado; clicar na linha da unidade (fora da grelha do `a`) não mudou nada. Ou seja: o alvo cobre o topo, o estado e o valor e o nome do cartão, mas não a última linha (unidade e ano de referência), excepto no cartão de 20×20 px, onde só o canto responde.

## Célula 6 · O mapa

Método: `details.gaveta` e o seu atributo `open`; clique real em `summary` com `javaScriptEnabled: false`; posição do `input[type=search]` face a `figure.mapa`; contagem de elementos com `href`/`data-regiao`/`data-distrito`/`data-concelho` dentro do `svg` do mapa.

| Verificação | antes | depois | veredito |
|---|---|---|---|
| Lista de nomes existe fechada (`details` sem `open`) | não existe a peça | sim, duas gavetas ("Os nomes no mapa", "Um concelho pelo nome"), ambas `open=false` | bate |
| Abre sem guião | n/a | testado a sério: com `javaScriptEnabled: false`, um clique real no `summary` mudou `open` de `false` para `true` | bate |
| Busca existe "dentro do mapa" | busca existe, mas fora da cabeça (`div.pesquisa-bloco` solto) | busca existe dentro de `.cabeca-lado`, que é **irmã** de `.cabeca-inst` (onde vive `figure.mapa`), não descendente de `figure.mapa` | não bate à letra: a busca está ao lado do mapa no mesmo bloco da cabeça, não dentro do elemento `<figure>` do mapa |
| A 390, concelhos não aparecem como alvos no mapa (só regiões) | 0 elementos com `href`/`data-regiao`/`data-distrito`/`data-concelho` dentro do `svg` (93 elementos, nenhum reconhecido pelo meu selector) | idêntico: 0 de 93 | não verificado por este método; ver limitação abaixo |

**Limitação desta célula.** O `svg` do mapa é feito de `rect`/`text`/`g` sem `href` nem os atributos de dados que eu procurei; a navegação parece ser por evento de clique em JavaScript sobre coordenadas, não por âncoras semânticas. Não consegui confirmar por análise estática se os concelhos estão excluídos como alvo a 390: só confirmei que a **lista fechada** (a via alternativa para quem não usa o mapa visualmente) lista distritos e ilhas, não concelhos, o que é consistente com a regra mas não a prova.

## Célula 7 · A mesma cabeça nas três camadas

Método: percorri os descendentes do contentor da cabeça de cada camada (`.cabeca-grelha` no país; procurei o mesmo padrão em região e concelho) e escrevi o esqueleto tag+classe, saltando o conteúdo de `ol.faixa` (só contei os itens).

**País** (`.cabeca-grelha`): rótulo, h1, manchete, depois um bloco com a faixa (`faixa-bloco > ol.faixa[21]`), depois um bloco lateral com a gaveta dos nomes (com a lista de distritos e ilhas), a busca (dentro doutra gaveta) e o mapa.

**Região** (`.regiao-cabeca`): só `span.eyebrow` + `h1` + `p.regiao-tipo`. Sem manchete, sem gaveta, sem busca, sem mapa dentro ou junto da cabeça (a região não tem mapa nenhum na página, ver achado 5). A faixa (`ol.faixa[2]`) vem depois, como irmã solta de `.regiao-cabeca`, não dentro dela.

**Concelho** (`.municipio-cabeca`): só `span.eyebrow` + `h1` + `p.municipio-sub`. Sem manchete, sem gaveta, sem busca. A faixa (`ol.faixa[7]`) vem a seguir, também solta. Há um mapa mais abaixo na página (`aside.aparelho > figure.mapa`), mas é um mapa de pontos dos 308 municípios, idêntico byte a byte entre `antes` e `depois`: não é o mapa de navegação da cabeça nova, é uma peça que já existia.

| Verificação | veredito |
|---|---|
| Mesmo componente nas três camadas | não bate: país tem cinco peças (rótulo, h1, manchete, faixa integrada, bloco lateral com gaveta+busca+mapa); região e concelho têm três (eyebrow, h1, subtítulo) mais uma faixa solta ao lado |
| Cada camada ganhou pelo menos a faixa | bate: as três têm `ol.faixa` nova, ausente em `antes` nas três |

## Célula 8 · Contraste (texto dos cartões e números, claro e escuro)

Método: função própria de contraste WCAG (luminância relativa e razão) sobre `getComputedStyle(...).color` contra o fundo efectivo (percorre os antepassados até achar um `background-color` opaco), em `.cartao-valor`, `.cartao-nome`, `.cartao-unidade`, `.cartao-palavra`, `.claim-value`. Tema escuro forçado por `document.documentElement.setAttribute('data-theme','dark')`, como manda IDENTIDADE.md §2 (o escuro já não segue `prefers-color-scheme`).

| Tema | Página | Pior par medido | Razão | Veredito (mínimo 4,5:1 texto) |
|---|---|---|---|---|
| Claro | País | `.cartao-unidade`, "Percentagem do PIB · 2025" | 6,24:1 | bate |
| Claro | Região | `.cartao-unidade`, "Índice · UE-27 = 100 · 2024" | 6,24:1 | bate |
| Claro | Concelho | `.cartao-unidade`, "Pessoas · 2025" | 6,24:1 | bate |
| Escuro | País | `.cartao-palavra`, "dentro do limiar" | 7,18:1 | bate |
| Escuro | Região | `.cartao-unidade`, "Índice · UE-27 = 100 · 2024" | 9,52:1 | bate |
| Escuro | Concelho | `.cartao-palavra`, "dentro do limiar" | 7,18:1 | bate |

Os valores mais fortes (`.cartao-valor`, `.claim-value`) medem 16,39:1 em claro, igual ao valor arquivado da casa para os nomes (16,39:1). No `antes`, sem cartões, medi só `.claim-value` do painel antigo: 15,38:1 em escuro, também igual ao valor arquivado. **Veredito: bate em todos os pares medidos, nos dois temas**, embora o pior caso de `depois` em escuro (7,18:1) fique bem abaixo do padrão habitual da casa em escuro (15,38:1); ainda acima do mínimo de 4,5:1 exigido pela régua.

## Célula 9 · O corpo dos números

Método: `getComputedStyle(...).fontSize` de `.cartao-valor` a 390 e a 1280, e o menor corpo entre todos os `[data-claim]` visíveis de cada página.

| Página | 390 (faixa) | 1280 (faixa) | Veredito |
|---|---|---|---|
| País | 30px | 40px | bate (menor no telemóvel) |
| Região | 30px | 40px | bate |
| Concelho | 30px e 12px (há um cartão com um segundo valor menor) | 40px e 11,5px | bate na comparação principal |

**Menor corpo entre qualquer número selado da página, a 390:**

| Página | antes | depois |
|---|---|---|
| País | 12px | 12px (sem mudança) |
| Região | 16px | 16px (sem mudança) |
| Concelho | 10px | 10px (sem mudança) |

Não tenho, nesta medição cega, o valor exacto do "corpo mínimo da casa para números com selo" citado na régua, para dar veredito contra ele; o que posso dizer é que **o mínimo não desceu**: é idêntico entre `antes` e `depois` nas três páginas.

## Célula 10 · Datas

Método: li os seis pares de ficheiros `index.html` directamente (sem browser), retirei `<meta ...>` inteiros e os valores de `datetime="..."`, e contei ocorrências de `dd.mm.aaaa` e `aaaa-mm-dd` no que sobrou.

| Página | antes (dd.mm.aaaa / ISO) | depois (dd.mm.aaaa / ISO) | Veredito |
|---|---|---|---|
| País pt | 0 / 1 | 0 / 1 | **não bate**: continua ISO ("2026-08-31", no campo `data-de-atualizacao` do "Painel europeu", visível, fora de `datetime=`) |
| País en | 0 / 1 | 1 / 0 | bate: passou a "31.08.2026" |
| Região pt | 0 / 1 | 1 / 0 | bate |
| Região en | 0 / 1 | 1 / 0 | bate |
| Concelho pt | 1 / 6 | 1 / 5 | bate parcialmente: o campo do "Painel europeu" passou a dd.mm.aaaa; ficam 5 datas ISO nas referências de mandato ("a partir de 2013-05-01", etc.), idênticas em `antes` e `depois`, portanto não é regressão desta construção |
| Concelho en | 1 / 6 | 1 / 5 | idêntico ao pt |

**Veredito da célula: não bate numa das seis páginas** (país português, achado 3), a única onde o campo "Painel europeu ·" ficou por converter; as outras cinco convertem correctamente. As datas de mandato (município) ficam em ISO nas duas versões, sem mudança: um resíduo antigo, não introduzido por esta construção.

## Célula 11 · "Âmbito" e "Densidade" na cabeça a 390

Método: procurei as palavras no texto visível dentro do contentor da cabeça (`.cabeca-grelha`/`.regiao-cabeca`/`.municipio-cabeca`) e, à parte, dentro do painel `.cmd` (o selector de âmbito/densidade que já existia).

| Página | Aparecem dentro da cabeça? | Aparecem no painel `.cmd`? | Posição do `.cmd` a 390 (antes / depois) |
|---|---|---|---|
| País | não, em nenhuma das duas versões | sim, nas duas versões, idêntico texto | topo 510px (antes, dentro do 1.º ecrã) → topo 1468px (depois, fora do 1.º ecrã) |
| Região | não existe a peça `.cmd` | não existe | n/a |
| Concelho | não existe a peça `.cmd` | não existe | n/a |

**Veredito: as palavras não saíram do sítio** (continuam no painel `.cmd` do país, letra por letra iguais a `antes`); a régua completa do `BRIEF-forma-dos-dominios.md` §4 ("«Âmbito» e «Densidade» saem da cabeça do telemóvel") não está cumprida. O que mudou é a posição: em `antes` o painel `.cmd` cabia no primeiro ecrã (510 px, visível sem tocar); em `depois` ficou a 1468 px, empurrado pela faixa e pelo mapa, e deixa de aparecer ao carregar a página a 390. Isto reduz a exposição imediata à palavra, mas não a remove do sítio.

## Célula 12 · Números com selo e sem selo

Método: `[data-claim]` visíveis para "com selo"; para "sem selo", percorri os nós de texto visíveis fora de `nav`/`header`/`footer` e de qualquer elemento com `data-claim` ou dentro de `.src-chip`, tirei as datas (os dois formatos da célula 10) e contei o que ficou por uma expressão regular de dígitos.

| Página | Selados antes | Selados depois | Diferença | Sem selo (bruto) antes | Sem selo (bruto) depois |
|---|---|---|---|---|---|
| País | 22 | 43 | +21 | 84 | 109 |
| Região | 15 | 17 | +2 | 12 | 16 |
| Concelho | 93 | 101 | +8 | 52 | 59 |

A diferença de selados bate quase exactamente com o número de cartões novos na faixa (21 no país, 2 na região; 7 cartões no concelho contra uma diferença de 8, um a mais que não apurei a razão exacta no tempo disponível: pode ser um segundo `data-claim` dentro de um único cartão, por exemplo o concelho com "N.d." mais um valor). Nenhum destes números é uma medida nova do livro-razão (a régua exige isso, e a diferença bate com cartões que **repetem** valores já servidos noutra parte da página, não com dados novos, mas não confirmei o inventário do livro-razão inteiro contra as duas construções, que sai do âmbito desta medição de 13 células).

**Nota sobre "sem selo".** A contagem bruta por expressão regular é ruidosa: apanha anos de referência soltos como "2025" nas linhas de unidade dos cartões (que não são datas completas, por isso a célula 10 não os retira, mas também não são medições), e qualquer dígito solto no texto visível. Não é uma contagem manual conferida; uso a para mostrar a direcção (subiu nas três páginas) e não o valor exacto.

## Célula 13 · Língua nas duas edições

Método: por amostragem, comparei cadeias da cabeça entre `pt` e `en` do mesmo par de páginas: o rótulo do país, `cartao-palavra` (estado do limiar), o texto do selo, o `aria-label` da faixa e o nome das gavetas.

| Cadeia | pt | en | Veredito |
|---|---|---|---|
| Rótulo do país | "Portugal · país" | "Portugal · country" | bate |
| Estado do limiar no cartão | "fora do limiar" / "dentro do limiar" | "outside the threshold" / "within the threshold" | bate |
| Texto do selo | "fonte" | "source" | bate |
| Nome das gavetas | "Os nomes no mapa" / "Um concelho pelo nome" | "The names on the map" / "A municipality by name" | bate |
| `aria-label` da faixa, região e concelho | "As medidas, uma por cartão" | "The measures, one per card" | bate |
| `aria-label` da faixa, **país** | "As medidas, uma por cartão" | **"As medidas, uma por cartão" (não traduzido)** | **não bate** (achado 4) |

**Veredito: não bate numa cadeia, numa página**: o nome acessível da faixa do país em inglês ficou em português. Todas as outras cadeias amostradas, nas três camadas, respeitam a língua da edição.

## Lista consolidada do que não bate

1. **País pt, `ol.faixa` do 1.º cartão ("Dívida pública")**: `data-claim` sem `.src-chip` correspondente (célula 5, 12; achado 1). A mesma medida tem selo em `antes`.
2. **País pt/en, `ol.faixa` do 2.º cartão ("Posição de investimento internacional")**: `a.cartao-porta` mede 20×20 px em vez de cobrir o cartão (205×109 nos outros) (célula 4, 5; achado 2).
3. **País pt (`/`)**: o campo "Painel europeu · [data]" mostra "2026-08-31" (ISO); as outras cinco páginas mostram "31.08.2026" (célula 10; achado 3).
4. **País en (`/en/`)**: `aria-label` da faixa fica em português, "As medidas, uma por cartão", em vez de "The measures, one per card" (célula 5, 13; achado 4).
5. **Nenhum cartão da faixa (nas 3 camadas) tem a caixa do `a` idêntica à caixa do `li`**: falta sempre a última linha do cartão (a unidade/ano de referência), confirmado por geometria e por um clique real que não activa o link nessa faixa (célula 5).
6. **A cabeça não é o mesmo componente em país, região e concelho**: região e concelho não têm manchete, gaveta, busca nem mapa de navegação junto da cabeça; só um nome e um subtítulo, com a faixa como peça solta ao lado (célula 7; achado 5).
7. **A busca do concelho não está dentro do elemento do mapa** (`figure.mapa`): está ao lado dele, dentro do mesmo bloco lateral da cabeça (célula 6).
8. **"Âmbito" e "Densidade" continuam na página**, no painel `.cmd` do país, sem mudança de texto entre `antes` e `depois`; só a posição mudou, para fora do primeiro ecrã (célula 11).
9. Alvos abaixo de 44×44 px continuam em cerca de 42 a 91% dos alvos tocáveis das seis páginas, quase todos partilhados por `antes` e `depois` (não introduzidos por esta construção), à excepção do ponto 2 acima (célula 4).
10. **A régua de "quatro ecrãs" até ao primeiro número selado**, citada em `BRIEF-forma-dos-dominios.md` §4 para o `antes`, não bateu com a minha medição fresca (2,22 ecrãs pelo método mais próximo); não sei se a diferença é de conteúdo ou de método (célula 3).

## O que bate, sem reservas

Altura do documento (célula 1), o encaixe do primeiro ecrã em `depois` (célula 2), a existência e o `scroll-snap-type` da faixa, a persistência dos cartões sem JavaScript, a navegação por teclado até um `Enter` que muda o endereço (célula 5), a gaveta a abrir sem guião com um clique real testado (célula 6), o contraste em claro e em escuro em todos os pares medidos (célula 8), o corpo menor dos números no telemóvel do que no ecrã largo (célula 9), e a língua de quase todas as cadeias amostradas (célula 13).

## Capturas de ecrã

Em `capturas/`, primeiro ecrã a 390×844: `pais-pt-antes-390.png`, `pais-pt-depois-390.png`, `pais-en-antes-390.png`, `pais-en-depois-390.png`. Confirmam visualmente: a data ISO em `pais-pt-depois-390.png`; a ausência do link "FONTE" no 1.º cartão contra a presença no 2.º, nas duas capturas de `depois`; o painel Âmbito/Densidade visível em `antes` e ausente (por estar mais abaixo) em `depois`; o topo do mapa a aparecer no fundo da captura de `depois` e a não aparecer na de `antes`.

## Limitações desta medição

Não usei um leitor de ecrã real: a leitura de "lista de N cartões" (célula 5) e a navegabilidade dos nomes por leitor de ecrã (célula 6) apoiam se em semântica HTML/ARIA, não numa gravação de voz. Não consegui confirmar por análise estática se os concelhos aparecem ou não como alvos dentro do `svg` do mapa a 390 (célula 6): o mapa parece depender de JavaScript para o clique, sem âncoras nem atributos de dados que eu tenha reconhecido. A contagem de "números sem selo" (célula 12) é uma contagem bruta por expressão regular, não uma revisão manual linha a linha. Não tenho o valor de referência do "corpo mínimo da casa para números com selo" (célula 9) para dar veredito absoluto, só a comparação antes/depois. Não confirmei o inventário completo do livro-razão antes e depois de construir (a régua "nenhum número novo no sítio"): fica fora do âmbito das 13 células que o brief pede.
