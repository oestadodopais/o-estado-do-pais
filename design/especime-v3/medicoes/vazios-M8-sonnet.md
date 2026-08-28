# Medição M8 (Sonnet) · bloco «Os vazios»

Medidor cego: Claude Sonnet 5, na cópia isolada `wt-medidor-2` (worktree destacado, commit `355287c`). Li só `design/especime-v3/briefs/BRIEF-vazios-M8.md`. Nunca li `design/especime-v3/briefs/BRIEF-vazios.md` nem `design/especime-v3/medicoes/vazios-construtor.md` (o brief e o relatório do construtor deste bloco), nunca li `tests/municipio/vazios.mjs` pela mesma razão de não me contaminar com o teste que o construtor pode ter escrito para si próprio, nunca li o trabalho de outros medidores.

Li código de `src/` (inteiros: `concelhos.mjs`, `Peca.astro`, `Claim.astro`, `Provenance.astro`, `Frase.astro`; em parte, por excerto: `MunicipioView.astro`, `ledger.mjs`, `prova.mjs`, `livro-concelhos.mjs`, `routes.mjs`, `i18n/strings.mjs`) para saber os contratos do DOM e das linhas (nomes de classes, atributos `data-*`, caminhos de rota): é o que faz falta para escrever um extractor correto sem adivinhar. Nunca importei nada de lá. O instrumento (`vazios-M8-sonnet.mjs`) é código meu, do zero, com três bibliotecas de terceiros já presentes em `node_modules` (o mesmo género de escolha que a M7 fez com Playwright): `js-yaml` para as linhas do livro-razão, `node-html-parser` para o HTML construído, e `pdftotext` (poppler) para os PDFs que o motor aloja.

## Método

- **Construção:** `npm ci` (node_modules não existia) + `npm run build` na cópia, `355287c`. Correu as réguas do próprio sítio (`ledger:check`, `check:cruzamento`, `check:documentos`, `gate:html`, `check:cadeia`, `check:dados`, `check:mapa`, `check:regioes`, `check:voz`) dentro da cadeia do `build`, todas verdes: 3m09s, código de saída 0. `dist/` com 6586 ficheiros `.html`.
- **A comparação da medida 2 com `main` `35313eb`:** lida com `git show 35313eb:src/data/concelhos.mjs` (nunca fiz checkout dessa revisão); a lista de oito medidas de lá ficou escrita no instrumento como base do caso conhecido.
- **O motor:** `~/Instruments/ResearchHub`, só de leitura. Os dois PDFs da DGAL usados na medida 3 vivem em `content/12 Concelhos/source/dgal/pmp-anual-2025-12.pdf` e `.../endividamento-total-2024.pdf`; achei o caminho por leitura directa do directório (o `publisher/recortes/manifest.concelhos.json` não tinha recortes para estas onze linhas, `crops: {}`) e confirmei-o pelo `source_url` e pela `note` de cada linha do YAML, iguais nas duas colunas do endividamento.
- **Prova antes do zero:** cada detector que pode devolver um zero corre primeiro contra uma cópia alterada de propósito, nunca contra `dist/` real, sempre em `os.tmpdir()`. A corrida provou **15 casos conhecidos, os 15 vistos vermelho**. A lista está na secção final.
- **Corrida:** código de saída `0`, 45,3s no total (dos quais 37,7s são o `npm run verify` da medida 11). Reprodução: `node design/especime-v3/medicoes/vazios-M8-sonnet.mjs` a partir da raiz da cópia, com `dist/` já construído.

Nada nas tabelas abaixo é «ok» sem o número ao lado.

## Medida 1 · as duas frases de ausência em `dist/`

Caso conhecido: cópia de `municipios/agueda/index.html` com «sem linha ainda» plantada antes de `</body>`, vista vermelha (1 ficheiro, 1 ocorrência) antes de correr a régua a sério.

| frase | ficheiros com a frase | de quantos `.html` varridos |
|---|---:|---:|
| «sem linha ainda» | 0 | 6586 |
| «no row yet» | 0 | 6586 |

Cobertura por secção da árvore (nenhuma frase em nenhuma): `municipios` 309 ficheiros (308 concelhos + 1 índice), `en/municipalities` 309, `livro-razao` 2912, `en/ledger` 2912, `distritos` 30, `en/districts` 30, `estudos` 29, `en/studies` 21, `regioes` 10, `en/regions` 10, e as 14 páginas soltas (`index`, `agenda`, `correcoes`, `metodo`, `sobre`, `a-verificar`, `404` e as suas gémeas inglesas). Nenhuma discordância.

## Medida 2 · as peças por página de concelho, nas duas edições

Caso conhecido: numa cópia de `municipios/agueda/index.html`, enxertei uma 8ª peça («Execução da receita», clonada e renomeada a partir da 6ª) na posição 7. O extractor viu 8 peças, com o nome certo na posição certa, e a sequência bateu carácter a carácter com a lista de `main` `35313eb`.

| | valor |
|---|---:|
| concelhos com subpasta em `dist/municipios/` | 308 |
| concelhos com subpasta em `dist/en/municipalities/` | 308 |
| páginas avaliadas (308 × 2 edições) | 616 |
| páginas com exactamente 7 `article.peca` e os nomes na ordem certa | 616 |
| discordâncias | 0 |

A ordem das sete, nas duas línguas, confirmada em todas as 616: População residente / Resident population · Poder de compra por habitante / Purchasing power per inhabitant · Desemprego registado / Registered unemployment · Empresas não financeiras / Non-financial enterprises · Dívida total do município / Total municipal debt · Índice de dívida / Debt index · Prazo médio de pagamento / Average payment time. Nenhuma peça `vazia` (nenhum `data-medida-vazia`) em nenhuma das 616.

## Medida 3 · as onze linhas, quatro colunas

Quatro casos conhecidos, um por extractor: valor da página alterado numa cópia (leu o valor alterado, não «N.d.»), valor do recibo alterado numa cópia (idem), YAML do claim corrompido numa cópia (leu `999`, não «N.d.»), e o PDF da fonte truncado aos primeiros 3000 bytes (o `pdftotext` atirou, como se espera de uma cópia estragada). Os quatro vistos vermelho antes de medir a sério.

| id | página | recibo | YAML | fonte (PDF) | iguais | selo (página) | selo (recibo) |
|---|---|---|---|---|:---:|:---:|:---:|
| `aljezur-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `aljustrel-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `almada-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `batalha-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `evora-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `moimenta-da-beira-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `pedrogao-grande-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `penedono-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `trancoso-prazo-medio-de-pagamento-2025-12` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `penedono-divida-dgal-2024` | N.d. | N.d. | N.d. | N.d. | sim | sim | sim |
| `penedono-limite-divida-dgal-2024` | *(nota)* | N.d. | N.d. | N.d. | sim* | *(nota)* | sim |

11 linhas, **0 discordâncias**. A fonte lida em `pmp-anual-2025-12.pdf` p.7 (as nove) e `endividamento-total-2024.pdf` p.3, coluna (5) e coluna (1) (Penedono): o excerto que o `pdftotext -layout` extraiu bate, carácter a carácter, com o campo `excerpt` de cada YAML.

**Nota sobre `penedono-limite-divida-dgal-2024`:** «limite» não é uma das sete medidas do relance (não tem `chave` em `MEDIDAS_DO_CONCELHO`); a única peça onde um concelho normal a mostra é o instrumento «distância desenhada», e esse instrumento só se desenha com dívida e limite numéricos. Confirmado por leitura do código e, sobretudo, por medição directa: `grep -c "penedono-limite-divida-dgal-2024" dist/municipios/penedono/index.html` dá 0, contra 1 em `dist/municipios/agueda/index.html` para o equivalente de Águeda. Não é um vazio (a linha existe, tem selo no recibo, o valor bate nas outras três colunas): é uma peça que a página de Penedono, correctamente, não desenha, porque não há distância nenhuma para desenhar entre duas marcas. Marquei a linha como «igual» porque as três colunas que existem (recibo, YAML, fonte) batem entre si; a quarta não existe nesta página por desenho, não por defeito.

## Medida 4 · Penedono «N.d.» com selo; nenhum NaN/undefined/null/Infinity

Caso conhecido: numa cópia de `municipios/agueda/index.html`, troquei o valor da população por «NaN». A régua achou-o no corpo de texto extraído («… Relance sem limiar NaN Pessoas · 2025 População residente …»), visto vermelho antes de correr a sério.

| linha | valor (pt) | selo (pt) | valor (en) | selo (en) |
|---|---|:---:|---|:---:|
| `penedono-divida-dgal-2024` | N.d. | sim | N.d. | sim |
| `penedono-indice-de-divida-2024` | N.d. | sim | N.d. | sim |

| | valor |
|---|---:|
| páginas de concelho varridas (308 × 2 edições) | 616 |
| páginas com «NaN», «undefined», «null» ou «Infinity» no texto visível, num `title` ou num `aria-label` | **0** |

Varredura sobre o texto visível (tags `script`/`style` retiradas primeiro) mais os atributos `title` e `aria-label` de cada elemento, com fronteira de palavra (`\bNaN\b` etc., para não apanhar um «nullable» ou coisa parecida por acidente). Sem falsos alarmes: zero achados brutos, nada para triar.

## Medida 5 · os nove do prazo médio de pagamento; os outros 299

Caso conhecido: numa cópia de `municipios/agueda/index.html` (um concelho fora da lista dos nove), troquei o valor do prazo médio de pagamento por «N.d.». O classificador viu a discrepância (concelho fora da lista a mostrar a marca) antes de correr a sério.

| grupo | concelhos | valor esperado | conformes (valor + selo, pt e en) | falhas |
|---|---:|---|---:|---:|
| Aljezur, Aljustrel, Almada, Batalha, Évora, Moimenta da Beira, Pedrógão Grande, Penedono, Trancoso | 9 | «N.d.» com selo | 9 | 0 |
| os restantes | 299 | número com selo | 299 | 0 |
| **total** | **308** | | **308** | **0** |

«Número» aqui quer dizer: valor diferente de «N.d.» e legível como número português (`parsePtNumber`, reescrito por mim, sem importar o do sítio). As 9 marcas e os 299 números foram medidos nas duas edições (616 verificações no total), todas conformes.

## Medida 6 · nenhum vazio

Caso conhecido, dois: (a) numa cópia de `concelhos.gerado.json`, pus `linhas.populacao` de Águeda a `null`, achado; (b) numa cópia de `municipios/agueda/index.html`, enxertei uma peça `<article class="peca peca-vazia" data-medida-vazia>` inteira. Os dois vistos vermelho.

| | valor |
|---|---:|
| entradas em `src/data/concelhos.gerado.json` | 308 |
| valores `null` em `linhas` (de 308 × 8 chaves = 2464 posições) | **0** |
| ficheiros de `dist/` varridos por `[data-medida-vazia]` | 6586 |
| ocorrências de `data-medida-vazia` em `dist/` | **0** |

## Medida 7 · os mandatos de Évora

Dois casos conhecidos: um `<dd>` esvaziado numa cópia (achado, 1 `dd` vazio); um par «Decidiu»/«algo plantado» enxertado no mandato 2017–2021 numa cópia (achado, o mandato plantado passou a ter «Decidiu» quando não devia). Os dois vistos vermelho.

| edição | mandatos encontrados | mandatos com «Decidiu»/«Decided» | mandato sem, correcto | campos `dd` vazios |
|---|---:|---|---|---:|
| pt (`/municipios/evora`) | 5 | 2009–2013, 2013–2017, 2021–2025, 2025– | 2017–2021 | 0 |
| en (`/en/municipalities/evora`) | 5 | 2009–2013, 2013–2017, 2021–2025, 2025– | 2017–2021 | 0 |

O varrimento é sobre todos os pares `dt`/`dd` de `dl.mun-campos` em cada um dos 5 mandatos (não só «Decidiu»): Lugares, Herdou, Decidiu (condicional), Deixou, «A Direção-Geral»/«The directorate-general», e mais um campo próprio de alguns mandatos (Pelouros, e «Contas do penúltimo ano» ou «Executivo instalado», consoante o mandato). Nenhum `dd`, em nenhum campo de nenhum mandato, ficou sem texto.

## Medida 8 · as contagens do livro-razão

Caso conhecido: o comparador dos números («132» contra «133») tem de os achar diferentes, e achou, antes de comparar a sério.

| chave | a minha contagem (ficheiros de `ledger/claims/`) | a que a página mostra | onde | bate |
|---|---:|---:|---|:---:|
| afirmações | 2602 | 2602 | `/livro-razao` | sim |
| calculadas | 330 | 330 | `/livro-razao` | sim |
| linhas de concelhos | 2459 | 2459 | `/livro-razao` | sim |
| linhas de concelhos | 2459 | 2459 | `/livro-razao/concelhos` | sim |
| concelhos | 308 | 308 | `/livro-razao/concelhos` | sim |

Minhas contagens, independentes: 2602 ficheiros `.yml` em `ledger/claims/` (0 ids duplicados); 330 com `derived_from` não vazio; 2459 com `study: "concelhos-2026"`; 308 concelhos (dos 308 de `concelhos.gerado.json`) com pelo menos uma das suas linhas declaradas presente entre as 2459. **0 discordâncias.**

## Medida 9 · o inventário contra a superfície de `dist/`

Caso conhecido, o que o brief pede por nome: uma linha «viva» inventada («Esta frase foi inventada pelo medidor cego M8 e nunca existiu…») que o meu detector teve de achar ausente antes de eu confiar num zero de falhas. Achou (não achada, correctamente).

**Nota de método, porque mudou o número a meio da construção do instrumento.** A tabela `classe | texto | bloco | estado | razão` vive em 21 blocos separados pelo ficheiro inteiro (um por etapa da voz), com prosa entre eles. Um parser ancorado ao TEXTO do cabeçalho achou 484 linhas; três blocos (a partir da linha 697) têm o cabeçalho mal escrito, «`| classe | frase | bloco |`», só três palavras, mas as linhas por baixo têm as cinco células na mesma. Um parser mais solto (qualquer separador a seguir a qualquer cabeçalho) achou 500. A versão final não ancora a cabeçalho nenhum: conta qualquer linha do ficheiro que comece por `|`, tenha exactamente cinco células, e cuja quarta célula seja exactamente `viva` ou `retirada`. Essa versão achou **502**, e bate, algarismo a algarismo, com o que `npm run check:voz` imprimiu na medida 11: «502 linhas do inventário com bloco (452 vivas, todas rendidas; 50 retiradas, nenhuma rendida)». Fica como confirmação cruzada da minha própria contagem, não como algo que fui procurar.

| | valor |
|---|---:|
| linhas na tabela | 502 |
| `viva` | 452 |
| `retirada` | 50 |
| `viva` sem nenhuma ocorrência em `dist/` (falha) | **0** |
| `retirada` com pelo menos uma ocorrência em `dist/` (falha) | **13** |

A procura cobre o texto visível de cada página, os `title`, os `aria-label`, e a `<meta name="description">` do `<head>` (o próprio ficheiro do inventário diz que a régua do sítio lê a descrição do `<head>`; a minha primeira versão não a lia, e isso deu 21 falsos negativos de «viva» que desapareceram assim que corrigi o extractor, ver a nota da medida no ficheiro `.mjs`).

**Os 13 «retirada» achados, com o texto e a causa.** Achei os treze como substring literal em `dist/`; investiguei a fundo dez deles (todos os nomes de região) mais os três do «regulador», e a explicação que encontrei separa em duas causas:

| classe | texto | bloco | onde apareceu | causa que encontrei |
|---|---|---|---|---|
| conteudo | «Alentejo · region» | regioes | `<title>` de `/regioes/alentejo` (en) | o `<title>` da página é «Alentejo · region · O Estado do País»: o fragmento retirado é um PREFIXO literal de um título maior, não a mesma frase a voltar a render-se sozinha |
| conteudo | «Alentejo · região» | regioes | `<title>` de `/regioes/alentejo` (pt), «Alentejo · região · O Estado do País» | idem |
| conteudo | «Algarve · region» / «Algarve · região» | regioes | `<title>` de `/regioes/algarve`, nas duas línguas | idem |
| conteudo | «Grande Lisboa · região» / «Greater Lisbon · region» | regioes | `<title>` de `/regioes/grande-lisboa` | idem |
| conteudo | «Madeira · region» / «Madeira · região» | regioes | `<title>` de `/regioes/madeira` | idem |
| conteudo | «Península de Setúbal · região» / «Setúbal Peninsula · region» | regioes | `<title>` de `/regioes/peninsula-de-setubal` | idem |
| conteudo | «O regulador» / «O regulador publica» | grelha-2 | prosa de `/estudos/evora-quinze-anos-cinco-mandatos/documento` (a leitura longa do estudo) | frase de casa dentro do texto narrativo da leitura longa, com a formulação antiga (a razão da retirada diz que a DGAL «deixou de ser chamada "o regulador"»); a limpeza («G5 da grelha da voz») não alcançou este texto |
| conteudo | «The regulator» | grelha-2 | prosa de `/en/studies/evora-orcamentado-pago-devido-2025/document` | idem, na leitura longa inglesa |

**A minha leitura, com o que é verificado e o que é inferido.** Verificado: as treze cadeias estão, byte a byte, algures em `dist/`, nos locais acima. Inferido: para as dez de nomes de região, a régua do sítio (que eu não importei, e portanto não sei ao certo como está escrita) muito provavelmente lê cada `<title>` como UM bloco de texto inteiro e compara-o com a tabela, e «Alentejo · region · O Estado do País» nunca é igual a «Alentejo · region» sozinho; a minha busca é por substring dentro de todo o `dist/`, mais larga de propósito, e apanha-o. Para as três do «regulador», a causa é diferente: é texto de prosa dentro da leitura longa de um estudo, uma superfície que pode não estar na lista `ROTAS_DO_INVENTARIO` do sítio (não li `scripts/medir-defeitos.mjs` para o saber, por decisão de me manter às cegas do código dele) e portanto pode nunca ter sido varrida pela régua do sítio para começar. O facto de `check:voz` (medida 11) ter fechado com «50 retiradas, nenhuma rendida» é o que corrobora esta leitura: quem tem acesso à granularidade exacta dos blocos não viu nenhuma das treze. Marco as dez de região como **falso alarme do meu método** (substring dentro de um bloco maior, não a frase a renascer sozinha) e as três do «regulador» como um **achado a levar ao director**, porque é texto de prosa genuína com a formulação retirada, ainda que provavelmente fora do contrato original da tabela.

## Medida 10 · Évora intacta

Caso conhecido: um `data-r="figura-plantada-sem-recibo-m10"` enxertado numa cópia de `estudos/evora-orcamentado-pago-devido-2025/texto/index.html`, sem entrada correspondente no bloco de recibos. Achado como órfão antes de medir a sério.

| | valor |
|---|---|
| `evora-execucao-da-receita-2025`, valor pt | 61,44 |
| `evora-execucao-da-receita-2025`, valor en | 61,44 |
| selo junto ao valor, nas duas edições | sim |

**«As duas leituras longas dos estudos de Évora», identificadas por medição e não por suposição.** Os 5 estudos de Évora têm `documento/` e `texto/` em português, mas só **dois** têm também `document/` e `text/` em inglês (os outros três ficam só com `index.html` em inglês, achado por listagem directa de `dist/en/studies/`): `evora-orcamentado-pago-devido-2025` e `evora-prometido-pago-auditado-2026`. É a interpretação empírica de «as duas», e é a que usei.

| rota (2 estudos × documento/texto × 2 edições) | existe | tamanho | mecanismo de citação | recibos usados | órfãos |
|---|:---:|---:|---|---:|---:|
| `/estudos/evora-orcamentado-pago-devido-2025/documento` | sim | 963 204 B | `data-r` | 153 | 0 |
| `/estudos/evora-orcamentado-pago-devido-2025/texto` | sim | 192 223 B | nenhum | 0 | 0 |
| `/en/studies/evora-orcamentado-pago-devido-2025/document` | sim | 961 420 B | `data-r` | 153 | 0 |
| `/en/studies/evora-orcamentado-pago-devido-2025/text` | sim | 187 860 B | nenhum | 0 | 0 |
| `/estudos/evora-prometido-pago-auditado-2026/documento` | sim | 74 062 B | nenhum | 0 | 0 |
| `/estudos/evora-prometido-pago-auditado-2026/texto` | sim | 261 341 B | nenhum | 0 | 0 |
| `/en/studies/evora-prometido-pago-auditado-2026/document` | sim | 70 655 B | nenhum | 0 | 0 |
| `/en/studies/evora-prometido-pago-auditado-2026/text` | sim | 260 342 B | nenhum | 0 | 0 |

As 8 páginas constroem. **0 em falta, 0 figuras órfãs.** Achado de leitura: «cada figura tem a sua linha» não usa `data-claim`/selo nestas leituras longas, usa um mecanismo próprio (`data-r="<id>"` contra um bloco `<script type="application/json" id="rcpt-data">` embebido na própria página, com proveniência completa por recibo: fonte, documento, página, excerto, valor). Confirmei-o por leitura directa do HTML construído, não por suposição. Onde esse mecanismo existe (as duas páginas «documento» de `evora-orcamentado-pago-devido-2025`, 153 recibos cada, distintos), todos os `data-r` usados resolvem a um recibo, e nenhum recibo tem os campos essenciais vazios. As outras 6 páginas (a «texto» do mesmo estudo, e as duas páginas do outro estudo) não usam nenhum mecanismo de citação de figura a figura: é uma leitura corrida, sem números clicáveis individualmente. Não é um vazio, é uma forma diferente de leitura; fica dito para quem decidir se é a forma pretendida.

## Medida 11 · a cadeia

| comando | código de saída | duração |
|---|:---:|---:|
| `npm run verify` | 0 | 37,7 s |
| `npm run typecheck` | 0 | 0,2 s |

`npm run verify` corre `ledger:check`, `check:cruzamento`, `check:documentos`, `gate:html`, `check:cadeia`, `check:dados`, `check:mapa`, `check:regioes`, `check:voz`, sem `astro build` (usa o `dist/` que já lá estava). Todas as conferências fecharam a verde; a última linha de `check:voz` é a citada na medida 9. Não é um detector meu (é literalmente correr os scripts do sítio, como o brief autoriza), por isso não leva caso conhecido: não há lógica de comparação minha para provar antes.

## Os casos conhecidos, todos vistos vermelho (15 de 15)

| # | caso | visto vermelho |
|---:|---|:---:|
| 1 | M1 · «sem linha ainda» plantada numa cópia | sim |
| 2 | M2 · página com 8 peças, a 7ª «Execução da receita», enxertada numa cópia | sim |
| 3 | M3 · valor da página alterado numa cópia | sim |
| 4 | M3 · valor do recibo alterado numa cópia | sim |
| 5 | M3 · YAML do claim corrompido numa cópia | sim |
| 6 | M3 · PDF da fonte truncado (cópia estragada) | sim |
| 7 | M4 · «NaN» plantado numa cópia | sim |
| 8 | M5 · concelho fora da lista dos nove a mostrar «N.d.» numa cópia | sim |
| 9 | M6 · `null` plantado numa cópia de `concelhos.gerado.json` | sim |
| 10 | M6 · `data-medida-vazia` plantado numa cópia | sim |
| 11 | M7 · `dd` vazio plantado numa cópia | sim |
| 12 | M7 · «Decidiu» plantado no mandato 2017–2021 numa cópia | sim |
| 13 | M8 · comparador de contagens com dois números diferentes | sim |
| 14 | M9 · linha «viva» inventada que não rende | sim |
| 15 | M10 · figura sem recibo plantada numa cópia | sim |

## Falsos alarmes, consolidado

- **Medida 9, dez linhas de nome de região** («Alentejo · region», etc.): a minha busca por substring encontrou-as dentro do `<title>` de cada página de região, um bloco maior («Nome · região · O Estado do País») que as contém como prefixo. `check:voz` (medida 11) fecha com «50 retiradas, nenhuma rendida», o que é consistente com estas dez serem um efeito do meu método (substring dentro de um bloco) e não a frase a voltar a render-se sozinha.
- **Medida 9, durante a construção do instrumento, não no resultado final:** a primeira versão do extractor de texto não lia `<meta name="description">`, e isso deu 21 linhas «viva» falsamente ausentes (todas eram descrições do `<head>`, que o próprio ficheiro do inventário documenta como parte da superfície lida). Corrigido antes de fechar a medição; não sobra nenhuma no resultado entregue.
- **Medida 9, contagem de linhas da tabela, durante a construção:** duas versões mais cedo do parser (484 e depois 500 linhas) ficaram aquém das 502 reais, por três blocos com o cabeçalho da tabela mal escrito. Corrigido antes de fechar a medição, confirmado contra o número que `check:voz` imprime.
- Nas medidas 1, 2, 4, 5, 6, 7 e 8, os achados brutos foram sempre iguais aos achados reais: nenhum falso alarme a triar.

As três linhas do «regulador» na medida 9 não entram nesta lista como falso alarme: ficam como achado (texto de prosa genuíno, na formulação retirada, dentro de uma leitura longa que talvez nunca tenha sido varrida pela régua do sítio).

## Custo em símbolos

Aproximado, pela leitura do contador de orçamento de contexto no início e no fim da sessão (não é uma contagem exacta de tokens facturados): comecei com 15 000 000 disponíveis e fechei este relatório perto de 14 560 000, o que dá uns **440 000 símbolos** de custo para toda a corrida (exploração do repositório, escrita e depuração do instrumento em `vazios-M8-sonnet.mjs`, as corridas completas de medição, e este relatório). `[inferido]`, não `[verificado]`: é a melhor leitura que tenho do meu próprio consumo, não um número que a Anthropic me confirme à parte.

## Ficheiros entregues

- `design/especime-v3/medicoes/vazios-M8-sonnet.md` (este ficheiro)
- `design/especime-v3/medicoes/vazios-M8-sonnet.mjs` (o instrumento, 1377 linhas, corre com `node design/especime-v3/medicoes/vazios-M8-sonnet.mjs` a partir da raiz da cópia)
- `design/especime-v3/medicoes/vazios-M8-sonnet.resultados.json` (o resultado estruturado da última corrida, commit `355287c`, código de saída 0, 45,3s)

Nada foi corrigido, nada foi commitado, e nada foi tocado fora de `design/especime-v3/medicoes/` nesta cópia.
