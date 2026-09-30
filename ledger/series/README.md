# As linhas de série

Um ficheiro YAML por série, nesta pasta. **O nome do ficheiro é o id.** Nasceram no bloco UE1 (29.09.2026) com o corte entre países, `eixo: pais`, e servem, na mesma forma, a série no tempo do RP3, `eixo: periodo`.

Uma linha de série é uma linha do livro-razão com vários pontos dentro. **É gerada pelo motor e atravessa como as linhas cruzadas**: `ResearchHub/publisher/series_paises.py` gera-a dos corpos que o estudo 13 aloja, `ResearchHub/publisher/export_series.py` confere-a e escreve-a aqui, e o registo da travessia é `ledger/cruzamentos/series.json`, com os dois resumos de cada série. **O sítio nunca a escreve à mão**, e o `check:cruzamento` fecha a construção se os bytes não forem os que atravessaram.

## A forma de uma série de países

```yaml
id: "divida-publica-2025-paises"        # a linha portuguesa, com -paises
eixo: "pais"
name: "General government gross debt (EDP concept), consolidated - annual data"
name_source: "label"                    # onde a resposta escreve o nome
unit: "% do PIB"                        # a unidade das duas gémeas
periodo: "2025"                         # o período de todos os pontos
source: "Eurostat"
document:
  title: "General government gross debt (EDP concept), consolidated - annual data"
  edition: "tipsgo10, freq=A, na_item=GD, sector=S13, unit=PC_GDP"   # o conjunto e as coordenadas seladas
  kind: "serie"
  url: "https://ec.europa.eu/eurostat/databrowser/view/tipsgo10/default/table?lang=en"
source_url: "<o pedido da linha da União com os 27 países no lugar da União>"
access_date: "2026-09-29"
published_at: "2026-04-22"              # a última atualização do conjunto, que a API publica
excerpt: "<as etiquetas do conjunto e das coordenadas> — 2025"
linha_da_uniao: "divida-publica-2025-ue"
linha_de_portugal: "divida-publica-2025"
bandeiras: {}                           # as marcas que os pontos levam, com a etiqueta da resposta
pontos:
  - geo: "BE"                           # o código do Eurostat
    valor: "107,9"                      # como a fonte o escreve, na forma da casa
    excerto: "<o literal da série> — Belgium — 2025: 107.9"
    bandeira: null
  # … os 27 pela ordem protocolar da tabela dos nomes, e a União no fim
attributed_to: ["Eurostat"]
study: "dominios-2026"
note: "…"                               # nota interna, não é publicada
corrections: []                         # [{ geo, date, kind, old_value, new_value, reason, reason_en }]
```

A identidade da série é explícita: as duas gémeas nomeiam-se nos campos `linha_da_uniao` e `linha_de_portugal`, e nunca se inferem do identificador (a decisão 2 do RP3).

## Os nomes dos países

Os nomes vêm de `src/data/paises-da-uniao.json`, que atravessa inteiro no mesmo registo: o nome curto em português e em inglês e o código que o Eurostat e o Código de Redação Interinstitucional usam (`ISG_COU`), lidos na tabela de autoridade dos países do Serviço das Publicações da União Europeia, um documento RDF por país (`http://publications.europa.eu/resource/authority/country/<código de três letras>`), com o endereço, a hora da leitura, o resumo do corpo e a linha do corpo que prova cada campo. Um país da tabela traz o contexto `EU_COU`, que é a marca de Estado-membro. **Nenhum nome de país se escreve à mão**: uma página pede o nome a `nomeDoPais()`, e o portão de HTML confere-o contra a tabela.

## As regras que o `ledger:check` impõe

O `ledger:check` confere cada série por `validateSeries()`, de `src/lib/series.mjs`, e fecha a construção se:

1. **S1** o nome do ficheiro não for o id, o id não for minúsculas-com-hífenes ou se repetir, faltar um campo, ou houver uma chave que não pertence à forma;
2. **S2** o eixo não for um dos eixos (`pais`), a série não nomear as duas gémeas, uma série de países não se chamar `<linha portuguesa>-paises`, a linha da União não for `<linha portuguesa>-ue`, ou uma das duas não existir no livro-razão;
3. **S3** os pontos não forem os 27 países da tabela, cada um uma vez e pela ordem protocolar dela, e a União no fim: um país em falta, um repetido ou uma geografia a mais fecham a construção;
4. **S4** o valor de um ponto não for uma cadeia com um número da casa, ou não estiver dentro do seu excerto (o excerto acaba em `<período>: <o valor na forma da fonte>`, e na marca quando a há), o excerto de um ponto não começar pelo literal da série, ou uma marca não estiver em `bandeiras` com a etiqueta da fonte;
5. **S5** o período ou a unidade da série não forem os das duas gémeas;
6. **S6** o ponto da União não for, como número, o valor da linha `-ue`, ou o de Portugal o da linha portuguesa;
7. **S7** faltar a proveniência que as linhas do livro trazem (`source`, `source_url`, `access_date`, `published_at`, `document` com `kind: serie` e a página humana em https, `attributed_to`), uma data for posterior ao dia da construção, ou o estudo não constar de `src/data/studies.mjs`;
8. **S8** `corrections` não for uma lista de entradas com a geografia, a data, a natureza, o valor antigo, o novo e o motivo nas duas línguas.

Cada regra tem uma planta no `ledger:check`, plantada numa cópia em memória, e a regra tem de a morder com a sua própria queixa. «Como números» quer dizer pelo `parsePtNumber()`: a linha portuguesa da taxa de desemprego publica «6» e o ponto de Portugal é «6,0», como a fonte o escreve, e os dois são o mesmo número.

## Cada série tem uma página

Uma série publica-se em `/livro-razao/series/<id>` e `/en/ledger/series/<id>`, nas duas edições: os 28 pontos numa tabela, com o país, o valor e a marca da fonte, e a fonte e a proveniência como os recibos das linhas. Cada valor da tabela vai num `[data-ponto="<id>#<geo>"]`, que o portão de HTML admite como origem de algarismos só quando o texto é, carácter a carácter, o valor do ponto. Não há página por ponto, nem cartão de partilha por série.
