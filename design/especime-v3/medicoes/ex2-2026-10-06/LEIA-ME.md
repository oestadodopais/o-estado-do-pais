# EX2 · a leitura da semana diz o que cada número é

A definição provada do recibo aparece num parágrafo próprio sob cada mudança de valor, na leitura da semana e em «O que mudou» do índice. As palavras vêm de `oQueEDaLinha`; a conferência compara-as com o recibo construído da mesma linha e edição e confirma o estado na auditoria das famílias. Quando a auditoria diz «por confirmar», aparece a ausência da cadeia da casa.

A cabeça do código é `0b456c3c7aaa0b4aa6ee753950d38e9caad6860f`. A base é `d1becbf8f167643ca8d53a4479f8f6bbee0f7183`. Construtor: Codex `gpt-6-astra`, raciocínio `xhigh`, identificação pedida no mandato e nos trailers. Não foi observada uma linha «tokens used» nesta sessão; o custo fica por apurar no registo do lançador. A leitura a frio do Claude Opus e a conferência pelo lugar de direção ficam pendentes, sem aterragem nem publicação nesta sessão.

## O que se mediu e se escolheu

O comando `node design/especime-v3/medicoes/ex2-2026-10-06/medir-base.mjs` produziu [base.json](base.json). O livro tem 3195 linhas, 3184 no âmbito, 41 unidades, 25 começadas por palavra. A semana construída vai de 2026-09-30 a 2026-10-06: 9 mudanças, 0 sem frase por confirmar. As mudanças e as frases lidas do HTML estão abaixo e em [entrega.json](entrega.json).

**Na leitura da semana, a unidade vem antes dos dois pontos, imediatamente antes dos valores.** O comando `node design/especime-v3/medicoes/ex2-2026-10-06/medir-unidades.mjs` produziu [unidades.json](unidades.json), com todas as unidades nas duas formas candidatas, nas duas edições e a 390 e 1280 px. Cada forma teve 164 medições. A forma anterior aos valores teve 0 transbordos e 183 linhas de texto; a forma entre parênteses teve 0 transbordos e 183 linhas. Decidiu o desempate a ausência de parênteses aninhados: 0 na escolhida contra 10 na alternativa. O ensaio mede o trecho unidade e valores, com valores reais do livro e a fonte da página. Quando não existe correção, repete o valor atual, explicitamente como ensaio. As capturas conferem a frase inteira da semana construída.

A régua visual lê 12 páginas em 24 passagens, incluindo os blocos da primeira página, a comparação dos cartões e as suas definições abertas. Encontrou 0 falhas na entrega. As capturas têm 40 ficheiros, página inteira e recorte das mudanças, com 0 transbordos: [manifesto das capturas](capturas.json), pasta `design/especime-v3/capturas/ex2-2026-10-06/`. Comandos: `node tests/explicacoes/frases-compostas.mjs --json design/especime-v3/medicoes/ex2-2026-10-06/frases-compostas.json` e `node design/especime-v3/medicoes/ex2-2026-10-06/captar-ex2.mjs`.

O selo da mudança continua a abrir o mesmo recibo. Uma definição que contém um valor só pode reutilizar esse selo para a própria linha, no resumo da mesma entrada e na mesma edição. As palavras, os valores, as datas e as línguas dos pedaços continuam marcados e conferidos. O inventário dispensa apenas parágrafos cujo texto completo a célula da semana confere. A primeira ampliação da régua visual selecionou também os selos dentro da caixa do valor e uma comparação sem pedaços marcados. A seleção foi corrigida para conservar a caixa do valor como peça, como a célula já fazia, e a planta passou a escolher uma frase realmente composta. A corrida inicial está em [ensaios/frases-compostas-primeira.json](ensaios/frases-compostas-primeira.json). Não foi preciso mudar contentores das páginas existentes.

O teto da L1, o recibo e as fontes das definições não foram alterados; o guião da entrega encontrou 0 alterações nos caminhos protegidos que lista.

## Portões e conferências

Comando final: `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/ex2-2026-10-06/portoes`, com `<worktree>` substituído pelo caminho absoluto na execução. A tranca foi respeitada. As variáveis `OEDP_SEMANA_JSON` e `OEDP_FRASES_JSON` guardaram os resultados estruturados das células na corrida final. Os códigos seguintes foram lidos dos ficheiros; as cabeças de início e fim são `0b456c3c7aaa0b4aa6ee753950d38e9caad6860f` e `0b456c3c7aaa0b4aa6ee753950d38e9caad6860f`.

| Portão | Código | Ficheiro |
|---|---:|---|
| build | 0 | [build.codigo](portoes/build.codigo) |
| verify | 0 | [verify.codigo](portoes/verify.codigo) |
| typecheck | 0 | [typecheck.codigo](portoes/typecheck.codigo) |

As conferências entre commits estão em [conferencias/](conferencias/), produzidas por `node design/especime-v3/medicoes/ex2-2026-10-06/conferir-ex2.mjs`. A entrega foi medida com `node design/especime-v3/medicoes/ex2-2026-10-06/medir-entrega.mjs`; este relatório foi escrito com `node design/especime-v3/medicoes/ex2-2026-10-06/escrever-relatorio.mjs`. O motor não foi usado.

## Plantas e mensagens

As plantas alteram cópias em memória ou o navegador. Cada uma exige o controlo intacto e a mensagem esperada da mesma conferência que julga a página. Os detalhes estão em [semana.json](semana.json) e [frases-compostas.json](frases-compostas.json). A conta da janela também conserva as plantas da cópia do livro, em `semana.json → w1`.

| Planta | Mordeu | Mensagem observada |
|---|---|---|
| a frase de um bloco citado com uma palavra trocada | sim | W2 · a frase do bloco «precos» na página da semana não é a que a primeira página rende.       esperada: Os preços: os combustíveis sobem mais do que o resto: Em agosto de 2026, os combustíveis estavam 23,78 % mais caros do que um ano antes. Os preços no seu conjunto subiram 3,30 %.       rendida:  Os preços: os combustíveis sobem mais do que o resto: Ontem, Em agosto de 2026, os combustíveis estavam 23,78 % mais caros do que um ano antes. Os preços no seu conjunto subiram 3,30 %. |
| uma marca das frases compostas num parágrafo que esta célula não compara | sim | W · a marca das frases compostas da semana está num sítio que esta célula não confere (leituraDaSemana): &lt;p&gt; «Uma frase que ninguém compara.» |
| o literal de agora de uma mudança só da forma trocado | sim | W2 · fluxo-de-credito-as-empresas-2025: o literal de agora não é o da última entrada da janela (3,0, entrada 0) |
| uma contagem trocada | sim | W2 · a primeira frase difere da conta desta célula.       esperada: Entre 30.09.2026 e 06.10.2026, 90 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência.       rendida:  Entre 30.09.2026 e 06.10.2026, 91 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência. |
| a janela de outro dia | sim | W2 · a janela acaba a 2026-10-05, e o carimbo da construção é de 2026-10-06 &#124; W2 · a primeira frase difere da conta desta célula.       esperada: Entre 29.09.2026 e 05.10.2026, 90 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência.       rendida:  Entre 30.09.2026 e 06.10.2026, 90 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência. |
| uma mudança a menos | sim | W2 · as mudanças da página (8) não são, pela ordem, as que esta célula conta (9): da mudança mais recente para a mais antiga |
| a unidade colada ao número | sim | W2 · custo-unitario-do-trabalho-2024: a frase da mudança ou a unidade antes dos valores difere da composição declarada |
| a palavra do lado trocada | sim | W2 · custo-unitario-do-trabalho-2024: a palavra do lado não é a da conta («subiu») |
| o valor de antes de outra entrada | sim | W2 · custo-unitario-do-trabalho-2024: o valor de antes não é o da primeira mudança da janela (17,7, entrada 1) |
| uma palavra trocada na frase, leituraDaSemana, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, leituraDaSemana, pt | sim | EX2 · custo-unitario-do-trabalho-2024: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, leituraDaSemana, pt | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, leituraDaSemana, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| uma frase por confirmar publicada, leituraDaSemana, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, leituraDaSemana, pt | sim | EX2 · oe-2026-cem-euros-funcao-01: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, leituraDaSemana, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, leituraDaSemana, pt | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| uma palavra trocada na frase, leituraDaSemana, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, leituraDaSemana, en | sim | EX2 · custo-unitario-do-trabalho-2024: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, leituraDaSemana, en | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, leituraDaSemana, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| uma frase por confirmar publicada, leituraDaSemana, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, leituraDaSemana, en | sim | EX2 · oe-2026-cem-euros-funcao-01: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, leituraDaSemana, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, leituraDaSemana, en | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| uma palavra trocada na frase, indice, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, indice, pt | sim | EX2 · custo-unitario-do-trabalho-2024: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, indice, pt | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, indice, pt | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| uma frase por confirmar publicada, indice, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, indice, pt | sim | EX2 · oe-2026-cem-euros-funcao-01: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, indice, pt | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, indice, pt | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| uma palavra trocada na frase, indice, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase mostrada não é a do recibo da mesma linha e edição |
| uma frase retirada, indice, en | sim | EX2 · custo-unitario-do-trabalho-2024: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| a frase de outra linha, indice, en | sim | EX2 · custo-unitario-do-trabalho-2024: a frase ou ausência não é um parágrafo da própria linha |
| uma ausência numa frase confirmada, indice, en | sim | W4 · custo-unitario-do-trabalho-2024: a frase confirmada tem de aparecer, sem ausência |
| uma frase por confirmar publicada, indice, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar retirada, indice, en | sim | EX2 · oe-2026-cem-euros-funcao-01: a mudança tem 0 frases ou ausências; exige uma &#124; W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| a ausência por confirmar com palavras trocadas, indice, en | sim | W4 · oe-2026-cem-euros-funcao-01: a frase está por confirmar na fonte; exige a ausência e recusa a frase |
| uma frase fora da lista, indice, en | sim | EX2 · uma frase ou ausência está fora de uma mudança de valor |
| selo retirado, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra linha, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra edição, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| definição de outra linha, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| entrada de outra linha, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo fora do resumo, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| frase fora da lista, leituraDaSemana | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo retirado, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra linha, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo de outra edição, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| definição de outra linha, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| entrada de outra linha, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| selo fora do resumo, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| frase fora da lista, indice | sim | o valor da afirmação "linha-da-planta" aparece sem selo para a sua própria linha na definição da mudança. |
| explicações, flex, pt, 390 | sim | FC1 · /explicacoes/ a 390 px: uma frase composta dentro de um contentor flex (a): «Para onde vai o dinheiro do Estado em 2026» |
| explicações, largura, pt, 390 | sim | FC2 · /explicacoes/ a 390 px: o documento tem 2018 px numa janela de 390 |
| primeira página, flex, pt, 390 | sim | FC1 · / a 390 px: uma frase composta dentro de um contentor flex (p.pp-frase): «Em agosto de 2026, os combustíveis estavam 23,78 %fonte · INE mais car» / FC2 · / a 390 px: o documento tem 545 px numa janela de 390 |
| primeira página, largura, pt, 390 | sim | FC2 · / a 390 px: o documento tem 2018 px numa janela de 390 |
| comparação dos cartões, flex, pt, 390 | sim | FC1 · /precos/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «A variação é maior do que a da média da União Europeia. O Banco Centra» |
| comparação dos cartões, largura, pt, 390 | sim | FC2 · /precos/ a 390 px: o documento tem 2018 px numa janela de 390 |
| definição dos cartões aberta, flex, pt, 390 | sim | FC1 · /precos/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «Em agosto de 2026 os preços no consumidor estavam, em média, 3,30 % ac» |
| definição dos cartões aberta, largura, pt, 390 | sim | FC2 · /precos/ a 390 px: o documento tem 2018 px numa janela de 390 |
| explicações, flex, pt, 1280 | sim | FC1 · /explicacoes/ a 1280 px: uma frase composta dentro de um contentor flex (a): «Para onde vai o dinheiro do Estado em 2026» |
| explicações, largura, pt, 1280 | sim | FC2 · /explicacoes/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| primeira página, flex, pt, 1280 | sim | FC1 · / a 1280 px: uma frase composta dentro de um contentor flex (p.pp-frase): «Em agosto de 2026, os combustíveis estavam 23,78 %fonte · INE mais car» |
| primeira página, largura, pt, 1280 | sim | FC2 · / a 1280 px: o documento tem 2094 px numa janela de 1280 |
| comparação dos cartões, flex, pt, 1280 | sim | FC1 · /precos/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «A variação é maior do que a da média da União Europeia. O Banco Centra» |
| comparação dos cartões, largura, pt, 1280 | sim | FC2 · /precos/ a 1280 px: o documento tem 2375 px numa janela de 1280 |
| definição dos cartões aberta, flex, pt, 1280 | sim | FC1 · /precos/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «Em agosto de 2026 os preços no consumidor estavam, em média, 3,30 % ac» |
| definição dos cartões aberta, largura, pt, 1280 | sim | FC2 · /precos/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| explicações, flex, en, 390 | sim | FC1 · /en/explainers/ a 390 px: uma frase composta dentro de um contentor flex (a): «Where the State’s money goes in 2026» |
| explicações, largura, en, 390 | sim | FC2 · /en/explainers/ a 390 px: o documento tem 2018 px numa janela de 390 |
| primeira página, flex, en, 390 | sim | FC1 · /en/ a 390 px: uma frase composta dentro de um contentor flex (p.pp-frase): «In August 2026, fuel was 23,78 %source · INE more expensive than a yea» / FC2 · /en/ a 390 px: o documento tem 487 px numa janela de 390 |
| primeira página, largura, en, 390 | sim | FC2 · /en/ a 390 px: o documento tem 2018 px numa janela de 390 |
| comparação dos cartões, flex, en, 390 | sim | FC1 · /en/prices/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «The change is larger than the European Union average. The European Cen» |
| comparação dos cartões, largura, en, 390 | sim | FC2 · /en/prices/ a 390 px: o documento tem 2018 px numa janela de 390 |
| definição dos cartões aberta, flex, en, 390 | sim | FC1 · /en/prices/ a 390 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «In August 2026 consumer prices were, on average, 3,30 % above a year e» |
| definição dos cartões aberta, largura, en, 390 | sim | FC2 · /en/prices/ a 390 px: o documento tem 2018 px numa janela de 390 |
| explicações, flex, en, 1280 | sim | FC1 · /en/explainers/ a 1280 px: uma frase composta dentro de um contentor flex (a): «Where the State’s money goes in 2026» |
| explicações, largura, en, 1280 | sim | FC2 · /en/explainers/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| primeira página, flex, en, 1280 | sim | FC1 · /en/ a 1280 px: uma frase composta dentro de um contentor flex (p.pp-frase): «In August 2026, fuel was 23,78 %source · INE more expensive than a yea» |
| primeira página, largura, en, 1280 | sim | FC2 · /en/ a 1280 px: o documento tem 2094 px numa janela de 1280 |
| comparação dos cartões, flex, en, 1280 | sim | FC1 · /en/prices/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura): «The change is larger than the European Union average. The European Cen» |
| comparação dos cartões, largura, en, 1280 | sim | FC2 · /en/prices/ a 1280 px: o documento tem 2375 px numa janela de 1280 |
| definição dos cartões aberta, flex, en, 1280 | sim | FC1 · /en/prices/ a 1280 px: uma frase composta dentro de um contentor flex (p.cartao-medida-leitura.cartao-medida-o-que-e): «In August 2026 consumer prices were, on average, 3,30 % above a year e» |
| definição dos cartões aberta, largura, en, 1280 | sim | FC2 · /en/prices/ a 1280 px: o documento tem 2094 px numa janela de 1280 |

## Questões abertas e ponto onde se parou

- **EX2-1. A contagem inicial de páginas da célula no brief está errada.** A medição do código inicial encontrou 10 páginas, enquanto o guião do brief conta 8: omite as rotas acrescentadas por `EXPLICACOES.map`. Parou-se na correção desse ponto do brief, que pertence ao lugar de direção. A extensão independente da célula foi construída, sem alterar o brief nem disfarçar a discrepância.
- **EX2-2. Leitura a frio e aterragem pendentes.** O Claude Opus deve ler as páginas construídas, um recibo e as capturas, com os estragos apenas nas cópias do pacote. Deve responder ao teste dos dois minutos e dizer se um editor de um diário português imprimiria as páginas. O lugar de direção confere a entrega antes de aterrar.

## Commits da construção

- `831a7fc9da041b742297d3fbb047191e993aefab EX2: medir as unidades e o âmbito antes da construção`
- `5f7549e6637bf9257b0cba5ba2557e4fa628b1d0 EX2: mostrar a definição provada sob cada mudança`
- `0b456c3c7aaa0b4aa6ee753950d38e9caad6860f EX2: conferir as frases dos blocos e dos cartões no navegador`

## A semana construída, lida do HTML

### PT

- **custo-unitario-do-trabalho-2024**. Custo do trabalho por unidade produzida (custo unitário do trabalho), 2024, variação em três anos, %: de 17,7 para 17,9, subiu, em 05.10.2026. fonte · Eurostat

  É quanto subiu em três anos o custo do trabalho por cada unidade produzida: o que se paga pelo trabalho a dividir pelo que ele produz.

- **despesa-em-id-2024-ue**. Despesa em investigação e desenvolvimento, União Europeia, 2024, % do PIB: de 2,24 para 2,26, subiu, em 05.10.2026. fonte · Eurostat

  É o que se gastou em investigação e desenvolvimento num ano, pelas empresas, pelas administrações públicas, pelo ensino superior e pelas instituições sem fins lucrativos, em percentagem do PIB, o valor de tudo o que a economia produz num ano.

- **formacao-bruta-de-capital-fixo-2024**. Investimento em bens duradouros para produzir (formação bruta de capital fixo), 2024, % do PIB: de 20,4 para 20,5, subiu, em 05.10.2026. fonte · Eurostat

  É o que as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país compraram num ano, descontado o que venderam, em bens que duram mais de um ano, como edifícios, máquinas e programas informáticos, em percentagem do PIB, o valor de tudo o que o país produz num ano.

- **formacao-bruta-de-capital-fixo-2025**. Investimento em bens duradouros para produzir (formação bruta de capital fixo), 2025, % do PIB: de 20,7 para 21,0, subiu, em 05.10.2026. fonte · Eurostat

  É o que as empresas, o Estado, as famílias e as instituições sem fim lucrativo que produzem no país compraram num ano, descontado o que venderam, em bens que duram mais de um ano, como edifícios, máquinas e programas informáticos, em percentagem do PIB, o valor de tudo o que o país produz num ano.

- **pib-real-per-capita-2024**. PIB real por habitante, 2024, euros por habitante · volumes encadeados (2015): de 20 430 para 20 520, subiu, em 05.10.2026. fonte · Eurostat

  É o valor de tudo o que o país produziu no ano, por habitante, descontada a subida dos preços, a que a fonte chama volumes encadeados.

- **pib-real-per-capita-2025**. PIB real por habitante, 2025, euros por habitante · volumes encadeados (2015): de 20 600 para 20 700, subiu, em 05.10.2026. fonte · Eurostat

  É o valor de tudo o que o país produziu no ano, por habitante, descontada a subida dos preços, a que a fonte chama volumes encadeados.

- **posicao-de-investimento-internacional-2024**. O que o país tem no exterior menos o que deve (posição de investimento internacional), 2024, % do PIB: de −58,9 para −58,3, subiu, em 05.10.2026. fonte · Eurostat

  É a diferença entre o que os residentes em Portugal têm no resto do mundo e o que lhe devem, em percentagem do PIB, o valor de tudo o que o país produz num ano.

- **posicao-de-investimento-internacional-2025**. O que o país tem no exterior menos o que deve (posição de investimento internacional), 2025, % do PIB: de −50,2 para −49,6, subiu, em 05.10.2026. fonte · Eurostat

  É a diferença entre o que os residentes em Portugal têm no resto do mundo e o que lhe devem, em percentagem do PIB, o valor de tudo o que o país produz num ano.

- **saldo-da-balanca-corrente-2024**. Saldo da balança corrente, 2024, % do PIB (média de três anos): de 0,3 para 0,4, subiu, em 05.10.2026. fonte · Eurostat

  É a diferença entre o que Portugal recebeu do resto do mundo e o que lhe pagou, em bens, serviços e rendimentos, na média dos últimos três anos e em percentagem do PIB, o valor de tudo o que o país produz num ano. Positivo quer dizer que o país recebeu mais do que pagou.

### EN

- **custo-unitario-do-trabalho-2024**. Labour cost per unit of output (unit labour cost), 2024, three-year change, %: from 17,7 to 17,9, rose, on 05.10.2026. source · Eurostat

  It is how much the cost of labour per unit produced rose over three years: what is paid for labour divided by what it produces.

- **despesa-em-id-2024-ue**. Spending on research and development, European Union, 2024, % of GDP: from 2,24 to 2,26, rose, on 05.10.2026. source · Eurostat

  It is what was spent on research and development in a year, by companies, government, higher education and non-profit institutions, as a percentage of GDP, the value of everything the economy produces in a year.

- **formacao-bruta-de-capital-fixo-2024**. Investment in durable goods used for production (gross fixed capital formation), 2024, % of GDP: from 20,4 to 20,5, rose, on 05.10.2026. source · Eurostat

  It is what companies, the State, households and non-profit institutions that produce in the country acquired in a year, less what they disposed of, in assets that last more than a year, such as buildings, machinery and software, as a percentage of GDP, the value of everything the country produces in a year.

- **formacao-bruta-de-capital-fixo-2025**. Investment in durable goods used for production (gross fixed capital formation), 2025, % of GDP: from 20,7 to 21,0, rose, on 05.10.2026. source · Eurostat

  It is what companies, the State, households and non-profit institutions that produce in the country acquired in a year, less what they disposed of, in assets that last more than a year, such as buildings, machinery and software, as a percentage of GDP, the value of everything the country produces in a year.

- **pib-real-per-capita-2024**. Real GDP per capita, 2024, euro per capita · chain linked volumes (2015): from 20 430 to 20 520, rose, on 05.10.2026. source · Eurostat

  It is the value of everything the country produced in the year, per inhabitant, excluding the rise in prices, which the source calls chain linked volumes.

- **pib-real-per-capita-2025**. Real GDP per capita, 2025, euro per capita · chain linked volumes (2015): from 20 600 to 20 700, rose, on 05.10.2026. source · Eurostat

  It is the value of everything the country produced in the year, per inhabitant, excluding the rise in prices, which the source calls chain linked volumes.

- **posicao-de-investimento-internacional-2024**. What the country owns abroad minus what it owes (net international investment position), 2024, % of GDP: from −58,9 to −58,3, rose, on 05.10.2026. source · Eurostat

  It is the difference between what residents of Portugal own in the rest of the world and what they owe to it, as a percentage of GDP, the value of everything the country produces in a year.

- **posicao-de-investimento-internacional-2025**. What the country owns abroad minus what it owes (net international investment position), 2025, % of GDP: from −50,2 to −49,6, rose, on 05.10.2026. source · Eurostat

  It is the difference between what residents of Portugal own in the rest of the world and what they owe to it, as a percentage of GDP, the value of everything the country produces in a year.

- **saldo-da-balanca-corrente-2024**. Current account balance, 2024, % of GDP (three-year average): from 0,3 to 0,4, rose, on 05.10.2026. source · Eurostat

  It is the difference between what Portugal received from the rest of the world and what it paid to it, in goods, services and income, averaged over the last three years and as a percentage of GDP, the value of everything the country produces in a year. Positive means the country received more than it paid.

## Execução e inspeção visual

A inspeção do construtor está em [inspecao-visual.json](inspecao-visual.json), distinta da leitura a frio ainda pendente. Os primeiros ficheiros de apoio foram escritos na área temporária da sessão, fora da worktree. Esse desvio foi corrigido: foram recolhidos para uma pasta ignorada dentro da worktree, os originais retirados da área temporária e os registos limpos de caminhos locais. O registo está em [temporarios.json](temporarios.json).

## Pacote para a leitura a frio

O pacote local está em `<worktree>/node_modules/.cache/ex2-leitura`, numa pasta ignorada pelo Git dentro da worktree. Contém 5 páginas construídas, as 40 capturas e 5 estragos apenas nas cópias, registados por SHA-256 em [pacote.json](pacote.json). Os originais em `dist/` foram reconferidos e permanecem intactos. Os guiões e o manifesto que revelam os estragos ficam reservados à direção, fora do pacote entregue ao leitor. O código da conferência e os comandos estão no manifesto e em `fechar-pacote.py`.
