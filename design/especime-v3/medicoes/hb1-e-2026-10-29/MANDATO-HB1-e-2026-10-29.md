# Mandato HB1-e: a avaliação bancária de setembro de 2026 no estudo da habitação (uma atualização datada, o motor e o sítio numa passagem)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 29.10.2026, 11:56 UTC, para o Codex `gpt-6-astra` a `high`. A worktree de arranque é a do sítio (ramo `hb1e-2026-10-29`, a partir de `main` 71d85e4ce); a outra pasta com escrita é a worktree do motor (ramo `hb1e-2026-10-29`, a partir de `master` 91636ca), onde o lugar de direção já alojou as duas fontes com recibos (o commit HB1-e0). A `Claude-Session` dos commits do sítio: `https://claude.ai/code/session_0136XaqAJ49YQE82SFe5Viwy`. Prosa em português, sem travessões.*

## §0 O que o lugar de direção mediu antes de escrever (29.10.2026, 07:16 a 07:30 UTC)

1. **A fonte.** O INE publicou a 27 de outubro de 2026 o destaque «Avaliação da habitação aumentou 14,2%», do Inquérito à Avaliação Bancária na Habitação, referente a setembro de 2026 (a página do destaque `DESTAQUESdest_boui=770296408`; o PDF do destaque `look_parentBoui=824195206`, 440 550 bytes, 7 páginas, sha256 `666bcd2f371e6312f49d92d1034e8bbdd73a9294893bcfd85ed8883905932560` na cópia lida pelo lugar de direção; a cópia alojada no motor tem o seu recibo e o seu sha256 no `pedido.json`, que é o que vale). A página do destaque tem quatro anexos: uma imagem JPEG, o PDF, um Excel de quadros (2 794 446 bytes) e um ZIP; só a página e o PDF se alojam, como na HB1-d para a taxa de juro.
2. **O que a página 1 do PDF diz, por `pdftotext -layout`:** «O valor mediano de avaliação bancária na habitação foi 2 278 euros por metro quadrado em setembro, mais 24 euros que o observado no mês precedente. Em termos homólogos, a taxa de variação fixou-se em 14,2% (14,7% no mês anterior). Refira-se que o número de avaliações bancárias considerado foi cerca de 32,6 mil, o que representa uma descida de 0,2% face ao mês anterior e de 1,2% face ao período homólogo.» E, no corpo: «Em setembro, o valor mediano de avaliação bancária, realizada no âmbito de pedidos de crédito para a aquisição de habitação, fixou-se em 2 278 euros por metro quadrado (euros/m2), tendo aumentado 24 euros (1,1%) relativamente a agosto.» As caixas na página 1, pelo PyMuPDF (`fitz`), em pontos, na página de 595,32 por 841,92: o parágrafo do resumo `[43, 244, 555, 303]`; o título «AVALIAÇÃO DA HABITAÇÃO AUMENTOU 14,2%» `[184, 214, 414, 226]`; a data «27 de outubro de 2026» no bloco `[341, 162, 555, 185]`, que diz também «INQUÉRITO À AVALIAÇÃO BANCÁRIA NA HABITACÃO» (assim, sem cedilha, como o INE o imprimiu nesse bloco); «Setembro de 2026» em `[478, 187, 555, 197]`; o rodapé «INQUÉRITO À AVALIAÇÃO BANCÁRIA NA HABITAÇÃO – setembro 2026» em `[298, 798, 555, 807]`, com cedilha.
3. **O que o estudo já tem.** A edição de 26.10.2026 (HB1-d) tem a taxa de juro implícita de setembro (`hab-ine-juro-implicito`, 3,194 %, destaque de 21.10) e os preços locais do 2.º trimestre (`hab-ine-preco-mediano` e as outras, destaque de 23.10), e a secção 11 diz que estão nesta edição. Não tem nenhuma linha da avaliação bancária (as quatro linhas com «avalia» no livro do estudo são «mais-valias» e votações). O calendário do INE alojado (`ine-retoma-pt-36.html`) não lista o Inquérito à Avaliação Bancária: não há linha de calendário para esta divulgação.
4. **O caminho de uma linha do INE neste estudo, pela HB1-d:** o pedido em `pedidos-hb1d.json`, as cópias e os recibos em `source/`, a especificação em `extracoes.json` na lista `rows` (`file`, `page`, `box`, `columns`, `method` «fitz», `reference_method` «layout», `name`, `title`, `attributed_to` «INE», `source_type` «government», `period`, `published_at`, `afirmacao` false, `locator`, `start`, `end`, `document_binding` com o título e a data, `expected`, `pattern`, `unit`, `unit_binding`, `source_url`), e `python3 -m publisher.hb1_build`, que regenera o livro, o inventário das fontes, os direitos e o `MANIFEST.sha256`, compõe as duas edições pelos gabaritos (`documento.pt.md.tmpl`, `documento.en.md.tmpl`), faz o HTML, os registos e o `manifest.hb1.json`. Depois, para o sítio, `export_site_rows` com `publisher/manifest.hb1.json` e `export_records_site.py --write`. No sítio, as listas que uma linha nova arrasta: as famílias (`scripts/hb1-familias.py`, os pares `id|pt|en`, que gera `src/data/nomes-hb1.mjs` e o que dele depende), as unidades (`scripts/hb1-unidades.py`), `src/data/lugares-hb1.mjs`, `src/data/o-que-e-das-familias.mjs`, o inventário das frases, a L1, `tests/cartao/leituras-provadas.json`, e a página do estudo com a data declarada da edição (HB1-30: a edição de 26.10 declara «publicado a 26.10.2026»).
5. **O uso antes do lançamento** (`uso.py`): o Claude: semana: 45% usados, repõe a 02.11.2026 10:00 UTC; o Codex: semana: 9.0% usados, repõe a 04.11.2026 18:48 UTC.

## §1 O orçamento desta passagem

Uma passagem, setenta e cinco minutos e cento e vinte chamadas, pelo lançador. Correm só as conferências que a mudança toca: no motor, `python3 -m publisher.habitacao_test` e `python3 -m publisher.hb1_test` (por `curto.sh`) e o `core.gate` uma vez no fim pelo escrivão com `motor`; no sítio, `npm run ledger:check`, `npm run check:cartao`, `npm run check:lugar` e o que a página do estudo toca (por `curto.sh`), e os três portões pelo escrivão uma vez, depois dos commits. A corrida inteira do `verify` e as capturas são do lugar de direção.

## §2 O que muda

### 2.1 O motor: duas linhas novas da mesma fonte

As cópias já estão em `content/23 Habitacao/source/` com os recibos (HB1-e0): `hb1e-ine-avaliacao-2026-09.html` (a página do destaque) e `hb1e-ine-avaliacao-2026-09.pdf` (o PDF), pedidas por `pedidos-hb1e.json`. Confere o `sha256` do PDF no recibo contra o ficheiro antes de o usares.

Em `extracoes.json`, na lista `rows`, duas especificações novas, pela forma da `hab-ine-juro-implicito`, com o `method` «fitz», `page` 1 e a caixa `[43, 244, 555, 303]` (ajusta só se o teu `fitz` der uma caixa diferente para o mesmo parágrafo, e diz qual):

- `hab-ine-avaliacao-mediana`: `name` «valor mediano de avaliação bancária na habitação»; `title` «INQUÉRITO À AVALIAÇÃO BANCÁRIA NA HABITAÇÃO»; `period` «2026-09»; `published_at` «2026-10-27»; `start` «O valor mediano de avaliação bancária»; `end` «face ao período homólogo.»; `expected` «2 278»; `pattern` `(?<![\d.,])(2 278)(?![\d.,])`; `unit` «€/m2» (a unidade das linhas `hab-ine-preco-*`); `unit_binding` com o texto «euros por metro quadrado»; `document_binding` com o título no rodapé da página 1 («INQUÉRITO À AVALIAÇÃO BANCÁRIA NA HABITAÇÃO», com cedilha, no bloco do rodapé) e a data «27 de outubro de 2026» na página 1; `note` «Destaque de 27 de outubro de 2026 (setembro de 2026). O bloco do cabeçalho do PDF imprime o nome do inquérito sem cedilha («HABITACÃO»); a ligação do título faz-se pelo rodapé, que o imprime com cedilha.»
- `hab-ine-avaliacao-homologa`: o mesmo ficheiro, página, caixa, `start`, `end`, `title`, `period`, `published_at` e `document_binding`; `name` «taxa de variação homóloga do valor mediano de avaliação bancária na habitação»; `expected` «14,2»; `pattern` `(?<![\d.,])(14,2)(?![\d.,])%`; `unit` «%»; `unit_binding` com o texto «%».

Se a régua do motor exigir que o `title` da ligação seja o título do destaque («AVALIAÇÃO DA HABITAÇÃO AUMENTOU 14,2%») e não o nome do inquérito, segue a régua e diz no relatório; o que não se faz é ligar ao bloco sem cedilha.

`python3 -m publisher.hb1_build` regenera tudo. O teu relatório diz quantas linhas o livro do estudo tem antes e depois (194 antes, pela contagem do lugar de direção) e prova que nenhuma linha existente mudou de valor.

### 2.2 As frases dos gabaritos (palavra por palavra; os tokens são os do ficheiro)

Na secção 6 («O crédito» / «Credit»), uma frase nova no fim do parágrafo:

- pt: «A avaliação bancária das casas, feita quando se pede crédito para as comprar, estava em ⟦HB:hab-ine-avaliacao-mediana⟧ euros por metro quadrado em ⟦HB:hab-ine-avaliacao-mediana|periodo⟧, ⟦HB:hab-ine-avaliacao-homologa⟧ % acima de um ano antes, pelo INE.»
- en: «The bank appraisal of homes, made when credit is requested to buy them, stood at ⟦HB:hab-ine-avaliacao-mediana⟧ euros per square metre in ⟦HB:hab-ine-avaliacao-mediana|periodo⟧, ⟦HB:hab-ine-avaliacao-homologa⟧ % above a year earlier, by the INE.»

Na secção 11 («O calendário» / «The calendar»), o parágrafo inteiro passa a:

- pt: «A taxa de juro implícita de ⟦HB:hab-ine-juro-implicito|periodo⟧ e os preços locais do ⟦HB:hab-ine-preco-mediano|periodo⟧, que o calendário do INE anunciava para ⟦HB:hab-ine-calendario-juro⟧ e para ⟦HB:hab-ine-calendario-precos-locais⟧, e a avaliação bancária de ⟦HB:hab-ine-avaliacao-mediana|periodo⟧ já estão nesta edição (a secção «Quanto custa uma casa, e quanto subiu» e a secção «O crédito»). A reforma do arrendamento segue para a especialidade; o Orçamento de 2027 teve o debate e a votação na generalidade marcados para ⟦AN:oe-2027-calendario-generalidade⟧ (o estudo «O Orçamento de 2027: o que muda e para quem» deste projeto tem a conta inteira, e o item do Orçamento em «O que se discute» tem o resultado da votação).»
- en: «The implicit interest rate for ⟦HB:hab-ine-juro-implicito|periodo⟧ and the local prices for ⟦HB:hab-ine-preco-mediano|periodo⟧, which the INE calendar announced for ⟦HB:hab-ine-calendario-juro⟧ and for ⟦HB:hab-ine-calendario-precos-locais⟧, and the bank appraisal for ⟦HB:hab-ine-avaliacao-mediana|periodo⟧ are already in this edition (the section «What a home costs, and how much it rose» and the section «Credit»). The rental reform goes to the committee stage; the 2027 Budget had its first-reading debate and vote scheduled for ⟦lit:27 and 28 October⟧ (this project's study «O Orçamento de 2027: o que muda e para quem» has the whole account, and the Budget item under «Under discussion» has the result of the vote).⟦AN:oe-2027-calendario-generalidade|cita⟧»

Nada mais muda nos gabaritos. A data declarada da edição passa a 29.10.2026 pelo mecanismo da HB1-30 (onde a edição de 26.10 declara a sua); a página do estudo passa a dizer «publicado a 29.10.2026» nas duas edições, e o que a casa guarda da edição anterior conserva-se como o mecanismo manda.

### 2.3 O sítio

A exportação das linhas (`export_site_rows` com `publisher/manifest.hb1.json`, `--write`) e dos registos (`export_records_site.py --write`) para a worktree do sítio. Esperado: duas linhas novas em `ledger/claims/` (`hab-ine-avaliacao-mediana.yml`, `hab-ine-avaliacao-homologa.yml`), o cruzamento `ledger/cruzamentos/hb1.json`, os dois registos da edição e o `registos/manifest.json`; nenhuma linha existente muda de valor (o exportador recusaria sem `correcao` ou `atualizacao`; se pedir uma, para e diz).

As listas: os dois pares novos em `scripts/hb1-familias.py`, exatamente

- `hab-ine-avaliacao-mediana|Valor mediano da avaliação bancária na habitação|Median bank appraisal value of housing`
- `hab-ine-avaliacao-homologa|Variação homóloga da avaliação bancária na habitação|Year-on-year change in the bank appraisal of housing`

e os geradores corridos (`hb1-familias.py`, `hb1-unidades.py`); `lugares-hb1.mjs` com as duas linhas em «Portugal» nas duas edições; o inventário das frases com as frases novas das secções 6 e 11 nas duas edições (bloco `hb1-e`) e `critica/REVISOES-DO-INVENTARIO.md` (`hb1-e` por ler); a L1 remedida se o teto parar (duas linhas novas), com a planta; `tests/cartao/leituras-provadas.json` se a régua o pedir; o mapa dos construtores com uma linha para a HB1-e. O que outra lista exigir, acrescenta-se e anota-se.

## §3 Os commits

No motor, um commit «HB1-e1» com `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>`; no sítio, um ou dois commits «HB1-e2» com o mesmo trailer e a linha `Claude-Session` do cabeçalho. Só ficheiros, por caminho explícito; nunca os ficheiros das outras corridas do motor (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`).

## §4 O relatório

O que mudou para o leitor (a frase nova da secção 6 e o parágrafo da secção 11, nas duas edições; a data da edição; as duas páginas de linha novas); os comandos com os códigos e as contagens antes e depois (as linhas do livro do estudo, as linhas exportadas, as famílias, as frases do inventário, a L1); as ambiguidades decididas, numeradas «HB1-e-1», …; o que ficou aberto. Nenhum número que não venha de um comando que mostras.

## §5 O que não se faz e o que pára

Não se muda nenhuma outra frase do estudo nem nenhum valor existente; não se cria nenhuma entrada no registo público das correções; não se alojam o Excel nem o ZIP; não se escreve nenhum caminho de máquina nem nome de utilizador. Paras e dizes: se a caixa não contiver o parágrafo inteiro de `start` a `end`; se o `sha256` do PDF alojado não bater com o recibo; se o exportador pedir uma `correcao` ou `atualizacao`; se qualquer portão que proteja um número, uma fonte ou uma pessoa der vermelho por uma causa que não seja um erro teu que corriges.
