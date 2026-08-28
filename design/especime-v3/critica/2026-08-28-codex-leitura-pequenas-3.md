# Leitura cruzada do Codex · correções pequenas, terceira passagem (28.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre o índice dos concelhos nas duas edições, a página de Évora nas duas edições, a leitura longa de um estudo de Évora, o manifesto do mapa, o diff do inventário e as regras 14 e 15. Custo: 108 763 símbolos, 513 s. Três plantas, registadas com sha256 antes da leitura em `2026-08-28-codex-leitura-pequenas-3.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | uma porta de figura com o rótulo antigo («linha do motor: tc-year-1-2008») na leitura longa | **sim**: bloqueante, com o `href` da porta |
| P2 | a frase inglesa de Évora reposta a atribuir o índice à Direção-Geral | **sim**: bloqueante, citada |
| P3 | dois cabeçalhos de distrito trocados em `/municipios` (Évora e Faro) | **mal plantada**: a troca do lugar de direção caiu nos dois nomes da lista de pesquisa (os chips dos concelhos Évora e Faro, cada um a ligar ao endereço do outro) e não nos cabeçalhos; a leitura confirmou os 29 cabeçalhos em ordem, que era verdade, e não viu o chip com o nome trocado. Conta como falha da embalagem e como falta da leitura, porque um nome ligado ao endereço errado é um estrago que uma leitura devia ver. |

**Pontuação: 2 de 3, com a terceira mal plantada.** Lição para as plantas: conferir o alvo pelo contexto do ficheiro antes de registar o sha256, nunca pela primeira ocorrência de uma cadeia.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **Os concelhos dentro de quatro grupos de distrito continuavam na ordem antiga** (Aveiro, Lisboa, Porto, Santarém; os cabeçalhos certos, os membros não). **Real**, verificado com `Intl.Collator('pt')` sobre cada `ul.concelhos-lista`; corrigido nesta passagem antes da fusão (`df4a2a6`): 0 grupos fora da ordem em 29, nas duas edições, com a R7 a medir as listas construídas (os cabeçalhos, os membros dos 29 grupos e as listas das 58 páginas de distrito; vista vermelha com oito queixas sobre a primeira volta, verde depois; 14 estragos plantados apanhados).
2. **A frase inglesa de Évora imprime decimais portugueses** («242,6%»). **Não é um desvio**: a vírgula decimal é a convenção escrita da casa nas duas edições (`direcao.md`, «Regras de algarismos»), medida em 2 348 valores das 3 283 páginas inglesas, 0 com ponto, sem formatador por língua; fica como está e I90 fecha sem alteração; se a edição inglesa alguma vez tiver de diferir, é decisão do diretor e mexe na `direcao.md`.
3. **583 das 625 portas de figura não têm `aria-label`.** O nome acessível dessas portas é o seu conteúdo visível (o valor da figura), que é o que um leitor de ecrã deve ouvir; a I83 era sobre as 34 que tinham um rótulo a nomear a chave do motor. **Sem ação.**
4. **Regra 15**: as passagens de método dentro das leituras longas são o texto dos estudos (origem, não superfície da casa); «308 de 308 concelhos · tem página» é a contagem do filtro da pesquisa, anterior a esta passagem, classificada como conteúdo; a frase «calculado sobre os dados da Direção-Geral» qualifica o que o número é, que é o que a leitura anterior pediu. **Sem ação**, com a contagem do filtro anotada para a próxima passagem de voz se o diretor a quiser fora.
5. **Passa**: os 29 cabeçalhos e as unidades do manifesto na ordem portuguesa; os 308 `concelhos_slugs` ordenados, 308 únicos; as duas etiquetas novas `viva` e as antigas `retirada`; a frase portuguesa de Évora certa.

## O relatório, tal como veio

# REPORT

Workspace is read-only, so the report is printed here.

## Blocking

- The figure-door fix is incomplete.

  - Portuguese: 312 `href="#linha-…"` doors. 291 have no `aria-label`; 20 say `a linha desta figura`; one still exposes `linha do motor: tc-year-1-2008`, at `#linha-tc-report-16-2018`.
  - English: 313 doors. 292 have no `aria-label`; the other 21 correctly say `this figure’s row`.
  - The missing labels are consistently on anchors with class `texto-figura texto-figura-porta`. Thus 583 of 625 doors fail the literal requirement. All referenced target IDs do exist.

- The English Évora attribution is still wrong:

  > “The directorate-general’s debt index fell from 242,6% in 2014 to 105,5% in 2024.”

  This attributes the index to the directorate-general, not to the site’s calculation over its data.

## Should fix

- Rule 15 fails broadly. Clear self-method, diligence, or coverage statements include:

  - `308 de 308 concelhos · tem página` / `308 of 308 municipalities · has a page`;
  - the municipality debt-graphic explanation and the Portuguese calculated-index sentence;
  - both reading articles’ “Three limits” section and method passages at blocks 11–12, 37–39, 47–48, 53–55, 59, 61, 66–71 and 75–76. Examples include the deliberately invalid identifier test, checking the three largest contracts, the site’s grouping rule, confidence tiers, matching tests, search coverage and failed pagination recovery.

- The visible municipality members remain misordered in both language pages, despite the manifest being corrected:

  - Aveiro: Santa Maria da Feira precedes Ílhavo; it belongs after Ovar.
  - Lisboa: Amadora and Odivelas are appended; they belong after Alenquer and before Oeiras.
  - Porto: Trofa is last; it belongs before Valongo.
  - Santarém: Ourém is last; it belongs after Mação.

- `INVENTARIO.diff` is internally classified as requested: both new labels are `navegacao`/`viva`, and both old labels are `navegacao`/`retirada`. However, `linha do motor: …` is marked `retirada` while one Portuguese occurrence remains live.

## Note

- The Portuguese sentence is correctly attributed:

  > “O índice de dívida, calculado sobre os dados da Direção-Geral, desceu de 242,6% em 2014 para 105,5% em 2024.”

  It nevertheless triggers rule 15 because it explains the site’s calculation on a reader page.

- Both index pages and `manifest.json.unidades` have the same correct 29-header order:

  Aveiro, Beja, Braga, Bragança, Castelo Branco, Coimbra, Évora, Faro, Guarda, Ilha da Graciosa, Ilha da Madeira, Ilha das Flores, Ilha de Porto Santo, Ilha de Santa Maria, Ilha de São Jorge, Ilha de São Miguel, Ilha do Corvo, Ilha do Faial, Ilha do Pico, Ilha Terceira, Leiria, Lisboa, Portalegre, Porto, Santarém, Setúbal, Viana do Castelo, Vila Real, Viseu.

- All 29 manifest units have correctly name-sorted `concelhos_slugs`: 308 occurrences, 308 unique.

- The English debt sentence also retains Portuguese decimal commas; English elsewhere uses decimal points.
