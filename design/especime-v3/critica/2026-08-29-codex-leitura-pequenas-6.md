# Leitura cruzada do Codex · correções pequenas, sexta passagem (29.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre a página da Economia nas duas edições, uma página de linha nas duas edições, o índice dos concelhos do livro-razão, três linhas em YAML e as regras 14 e 15. Custo: 68 819 símbolos, 213 s. Três plantas, registadas com sha256 e o contexto impresso do alvo antes da leitura em `2026-08-29-codex-leitura-pequenas-6.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | o nome de uma medida trocado na página portuguesa da Economia («no Início do Mandato» → «no Fim do Mandato») | **sim**: bloqueante, contra a página inglesa |
| P2 | a marca de língua tirada a um nome português na página inglesa | **sim** |
| P3 | o nome de uma linha trocado para «PMP (N.º meses)» contra a unidade «dias» da própria linha | **sim**: bloqueante, pela contradição interna |

**Pontuação: 3 de 3.**

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **A legenda dos dois estados do selo e a contagem «2459 linhas · 308 concelhos» do índice**, lidas como regra 15: a legenda é a exceção registada; a contagem é conteúdo classificado. **Sem ação.**
2. **«Economy and of Territorial Cohesion»**: é o nome que o Governo publica na sua página inglesa (lido a 28.08), e a §1.80 manda usar o nome do Governo tal como está. **Sem ação**, e a estranheza fica dita.
3. **O recibo da população de Évora reconfere o indicador 0012918 com um endereço do 0012917.** **Verificado no YAML** (`evora-populacao-2025.yml`): o documento, a edição, o localizador e o `source_url` citam o indicador 0012918 (`varcd=0012918`), e o extrato alojado que a linha lista (`path`) é do indicador 0012917. São dois indicadores do INE para a população residente (um com sexo e grupo etário, outro sem), e a linha não diz de qual saiu o valor. **Real, anterior a esta passagem e do motor**: I99, para o motor dizer qual dos dois ficheiros o leitor leu e alinhar os quatro campos.
4. **Passa**: os catorze nomes repetidos nas duas páginas iguais carácter a carácter fora da planta; o nome e o localizador da população iguais no YAML e nos dois recibos; a marca de língua no recibo inglês; nenhum nome a ler como frase da casa ou tradução.

## O relatório, tal como veio

# REPORT

## Blocking

1. Exact name mismatch:

   `evora-divida-inicio-mandato-reexpressa` / “Dívida Total no Fim do Mandato” / [area-economia.html](/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/codex-pequenas6/pacote/paginas/area-economia.html)

   versus “Dívida Total no Início do Mandato” / [en-area-economia.html](/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/codex-pequenas6/pacote/paginas/en-area-economia.html).

   I could not determine from this package which string the source prints.

2. `evora-prazo-medio-de-pagamento-2025-12` names the source field “PMP (N.º meses)”, but the same YAML says the unit is `dias` and locates the value in the table “PMP (N.º dias)”. This defeats the claim that `name` is a character-for-character source label unless the source itself contains that contradiction. I could not verify that because the source file is absent.

## Should fix

1. Missing language mark on the English Economia page:

   `evora-divida-total-2017` / “DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS = (1) + (2)” lacks `lang="pt-PT"` in [en-area-economia.html](/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/96fffa41-d97f-4a27-9708-e0326fe38d18/scratchpad/codex-pequenas6/pacote/paginas/en-area-economia.html). The four English GDP names correctly have no language mark.

2. Rule 15 voice violations remain on reader pages:

   - “Os dois estados do selo”, “proveniência completa”, “um campo por confirmar” on the Portuguese Economia page and ledger index.
   - Their English equivalents on the English Economia page.
   - “2459 linhas · 308 concelhos” on the ledger index explains the site’s coverage.

3. The English area name is ungrammatical: “Economy and of Territorial Cohesion”. It occurs in the title/metadata and reader content; “of” appears stray.

4. The population receipt says it rechecked indicator `0012918` using a URL for `0012917`. That may be a legitimate independent route, but the package does not explain the equivalence.

## Note

- The population `name` and `name_source` match exactly across YAML and both receipt pages. Both fields are shown; the English receipt marks the Portuguese name `lang="pt-PT"`. `IndicadorDsg` is a concise, file-appropriate field locator.
- No other mismatch appeared among the 14 names repeated across the Portuguese and English Economia pages.
- The remaining names look structurally plausible as headers, row labels, or indicator titles. None reads like a house-written sentence or an English translation substituted for a Portuguese label.
- I could not verify any label against its original source file because no source files are included and fetching was prohibited.
