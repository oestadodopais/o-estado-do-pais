# As linhas de série

Um ficheiro YAML por série, nesta pasta. **O nome do ficheiro é o id.** Nasceram no bloco UE1 (29.09.2026) com o corte entre países, `eixo: pais`, e servem desde o bloco RP3 (04.10.2026) a série no tempo, `eixo: periodo`, com a forma e as regras dela mais abaixo.

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

## As séries no tempo (`eixo: periodo`, bloco RP3, 04.10.2026)

Uma série no tempo é uma medida período a período: os pontos de uma coordenada de uma fonte, do primeiro período que a fonte publica ao último, cada um com o seu período, o seu valor como a fonte o escreve, o seu excerto literal e a sua marca. É gerada por `ResearchHub/publisher/dominios_series.py` dos corpos que o estudo 13 aloja (os pedidos do cliente da casa em `indicators/out/rp3-2026-10-04/`), confirmada na metainformação da fonte (o nome, a frequência, a unidade, a escala e a etiqueta de cada categoria), e atravessa pelo mesmo exportador e para o mesmo registo das séries de países (`ResearchHub/publisher/export_series.py`, as conferências VP1 a VP6, e `ledger/cruzamentos/series.json`). O id é `serie-<medida>`. A identidade é explícita: as coordenadas na edição, a geografia incluída, e nunca o padrão do identificador nem a edição e a unidade de uma linha (a decisão 2 do brief RP3).

```yaml
id: "serie-ipc-variacao-homologa"
eixo: "periodo"
name: "<o rótulo com que a fonte publica a série>"   # null numa série derivada
name_source: "IndicadorDsg"                         # «label» no Eurostat
unit: "%"
periodicidade: "mensal"                             # mensal | trimestral | semestral | anual
source: "INE"
document:
  title: "<o mesmo rótulo>"
  edition: "0014663, geocod=PT, dim_3=T"            # o código e as coordenadas, a geografia incluída
  kind: "serie"
  url: "<a página humana do indicador, provada por um pedido que respondeu 200>"
source_url: "<o pedido do último ponto>"
access_date: "2026-10-04"                           # o dia do pedido mais recente
published_at: "2026-09-10"                          # a atualização que a fonte publica
pedidos:                                            # cada pedido de onde os pontos saíram
  - url: "<o endereço>"
    lido_em: "2026-10-04T03:46:17Z"
    cliente: "publisher.dominios_fetch.buscar → core.http.HttpClient.condicional"
    user_agent: "OEstadoDoPais/corredor"
    sha256: "<o resumo dos bytes>"
    bytes: 2845
    primeiro: "1992-01"                             # o primeiro e o último ponto que o pedido deu
    ultimo: "1992-12"
excerpt: "<o literal da série: o rótulo e as coordenadas como os bytes os escrevem>"
primeiro_periodo: "1992-01"
ultimo_periodo: "2026-08"
lacunas: []                                         # [{ periodo, razao }]: a razão da fonte, ou null
bandeiras: {}                                       # as marcas que os pontos levam, com a etiqueta da fonte
pontos:
  - periodo: "2026-08"
    valor: "3,30"                                   # na forma da casa, com as casas da fonte
    excerto: "{ \"geocod\" : \"PT\", … \"ind_string\" : \"3,30\", \"valor\" : \"3.3\" }"
    bandeira: null
derivation: null                                    # numa série derivada: a conta em palavras
derivation_en: null
derived_from: []
check: null                                         # e a expressão refeita ponto a ponto
attributed_to: ["INE"]                              # null numa série derivada
study: "dominios-2026"
note: "…"                                           # nota interna, não é publicada
corrections: []                                     # [{ periodo, date, kind, old_value, new_value, reason, reason_en }]
```

**O excerto de um ponto é sempre um literal da resposta.** No INE, o objeto da linha recortado dos bytes do bloco do seu período, com os espaços colapsados (como as linhas do RP1). No Eurostat, os fragmentos dos bytes, o período com o seu índice no cubo e o valor com o mesmo índice, e a marca quando a há: `"2026-08":367 · "367":3.6`; é aqui que a I155 fecha para as séries (a §1.132). O literal da série são as etiquetas da resposta, cada uma como os bytes a escrevem.

**Uma série derivada** tem `derivation`, `derivation_en`, `derived_from` e `check`, os quatro, e a proveniência a null (é a das origens): nenhum pedido, nenhuma marca, nenhum excerto por ponto, porque cada ponto se prova pela conta. A expressão escreve-se com referências a pontos de uma série de origem, `<id>[AAAA-MM]` para um período fixo e `<id>[t]` para o período do ponto, e a gramática e o avaliador são os das linhas escalares, em decimais exatos dos dois lados (`round ( x , n )` meio para longe do zero). A primeira é «o que cem euros compram», `round ( 100 * serie-ipc-indice[2015-01] / serie-ipc-indice[t] , 3 )`, com as casas do índice que a fonte publica.

**O campo `serie` de uma linha escalar** (`ledger/README.md`) nomeia a série no tempo de que a linha é o ponto do seu período. É escrito pelo motor (o manifesto declara-o e o exportador prova-o, a V18), e só nas linhas cuja série é a delas.

### As regras que o `ledger:check` impõe às séries no tempo

9. **S9** a forma e a cadência: os campos de uma série no tempo, e mais nenhum; o id `serie-…`; a periodicidade, uma das quatro; cada ponto com os quatro campos e o período na forma da periodicidade, crescentes e sem repetição; o primeiro e o último período nos campos que os dizem; e cada período da cadência que falta entre eles declarado em `lacunas`, com a razão da fonte ou `null`, e nenhuma lacuna que seja ponto;
10. **S10** o valor de cada ponto no seu excerto, e as marcas: o valor é uma cadeia com um número da casa; no INE, o excerto traz `"ind_string" : "<o valor como o INE o escreve>[ <marca>]"`; no Eurostat, o fragmento do período tem o período e um índice, o do valor o mesmo índice e o valor como a fonte o escreve, e o da marca o mesmo índice; cada marca está em `bandeiras` com a etiqueta da fonte, e cada etiqueta é de uma marca que um ponto leva;
11. **S11** a série derivada: a proveniência a null, sem pedidos nem marcas, a conta nas duas línguas, as origens séries no tempo, e cada ponto refeito pela expressão, igual ao publicado e com as casas que o `round` manda;
12. **S12** a proveniência de uma série lida: o nome, a fonte, o documento com a página humana em https, as datas, e os pedidos, cada um com os oito campos, a hora não posterior à construção, o resumo de 64 hexadecimais, os bytes, e o primeiro e o último ponto que deu; os pedidos cobrem os pontos uma vez cada, pela ordem; o `source_url` é o pedido do último ponto, e o `access_date` o dia do pedido mais recente;
13. **S13** as correções, por ponto: cada uma com o período, a data, a natureza (`correcao` ou `atualizacao`), o valor antigo e o novo e o motivo nas duas línguas, e o ponto vale o `new_value` da sua correção mais recente;
14. **S14** o campo `serie` de uma linha escalar: a série existe e é no tempo; a unidade é a mesma; as coordenadas da linha são as da série (a série pode acrescentar a geografia, e então o excerto da linha nomeia-a como a resposta a etiqueta); e o ponto do período da linha tem o valor da linha, cadeia a cadeia, e a mesma marca.

Cada regra tem uma planta no `ledger:check`, numa cópia em memória.

### As células S do `check:series`

`tests/series/series.mjs`, `npm run check:series`, na cadeia `verify`: uma segunda leitura das séries no tempo, com leitor próprio (não importa `src/lib/series.mjs`). S1 a forma; S2 a cadência e as lacunas; S3 o valor de cada ponto no seu excerto, e, com o motor ao lado (`RESEARCHHUB_DIR`), o excerto de cada ponto e o literal da série dentro do corpo alojado do seu pedido; S4 a série derivada refeita por uma conta própria em inteiros exatos; **S5 o cartão preso à série**: cada linha com `serie` é o ponto do seu período, e uma linha que é um cartão nacional é o último ponto da série (um cartão atrás da série fecha o `verify`); S6 os recibos construídos, nas duas edições, com todos os pontos pela ordem, o período pela regra da casa, nenhum algarismo fora das origens admitidas e as duas edições iguais ponto a ponto. Cada célula tem plantas numa cópia em memória, e o registo delas escreve-se com `--json`.

## Cada série tem uma página

Uma série publica-se em `/livro-razao/series/<id>` e `/en/ledger/series/<id>`, nas duas edições: os 28 pontos numa tabela, com o país, o valor e a marca da fonte, e a fonte e a proveniência como os recibos das linhas. Cada valor da tabela vai num `[data-ponto="<id>#<geo>"]`, que o portão de HTML admite como origem de algarismos só quando o texto é, carácter a carácter, o valor do ponto. Não há página por ponto, nem cartão de partilha por série.

O recibo de uma série no tempo (`src/views/SerieNoTempoView.astro`, na mesma rota) mostra o nome do projeto (o do cartão da medida, ou o declarado em `src/data/series-no-tempo.mjs`) e o da fonte, os períodos, a periodicidade e a unidade, a tabela de todos os pontos (o período pela regra da casa, o valor num `[data-ponto="<id>#<período>"]` e a marca), o que quer dizer cada marca, as lacunas, a conta de uma série derivada, a prova (a página da série na fonte, o pedido, o literal, as datas, e a lista dobrada dos pedidos com a hora, o cliente, o nome com que o projeto se apresenta, o resumo e os bytes), as correções, e as linhas que são pontos da série.
