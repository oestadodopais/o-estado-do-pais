# Folha de correções: «A casa em Portugal e na Europa» (12.11.2026)

> **Decidida a 12.11.2026.** O lugar de direção escolheu: o rácio preço-rendimento passa a 2025, o ano que o estudo já usa nos preços reais (a correção datada di-lo); o crédito fica em agosto; a frase da sobrecarga não leva data de leitura; a conclusão 2 perde a última frase; o título da notícia nos recibos passa ao que a página declara. O Codex Astra julgou as vinte correções a `xhigh` contra os corpos das fontes, com cinco estragos plantados numa cópia desta folha, e apanhou os cinco. Os reparos do juízo que entraram aqui: quem tem a maior subida (C02); «em média» na idade de saída de casa, no cartão (C06); a ausência de avaliação afirmada só dos dois documentos lidos (C07); «outro conjunto do Eurostat» (C12); o stock «dos particulares», a palavra da série (C16); a frase do primeiro-ministro, que os números do estudo não confirmam nem desmentem, com o trimestre do índice (C19). O juiz não pôde conferir, por não estarem no seu pacote, partes de frases que não mudam e têm linha no livro do estudo (os preços do Porto, as partes da população, as contagens de feridos); ficam como estão.

Estudo `a-casa-em-portugal-e-na-europa`. O texto publicado compõe-se dos gabaritos `content/28 Habitacao Estudo/Technical Source/documento.pt.md.tmpl` e `documento.en.md.tmpl` do motor (as linhas abaixo são desses ficheiros; o Markdown composto e o HTML de `studies-src/` repetem o mesmo texto). As provas são os corpos relidos pela auditoria desta noite em `_fontes/auditoria-a-casa-em-portugal-e-na-europa-2026-11-12/`, um corpo novo em `corpos/` (tessi164, que não estava na auditoria) e as cópias alojadas no motor. Cada excerto foi reconferido por `conferir.py`.

**Parte A** são os números que o Eurostat (29.10.2026 e 03.11.2026) e o Banco de Portugal (02.11.2026) reviram depois da escrita; **Parte B** são as frases. Onde o gabarito não muda, o número muda sozinho quando a linha do livro for relida (`scripts/aplicar-releituras.py`); o texto renderizado novo mostra o resultado.

## Os números revistos, de relance

| Medida | Célula | Impresso | Revisto | Linha do livro do sítio |
|---|---|---|---|---|
| Índice real dos preços (tipsho10) | I15_A_AVG, PT, 2025 | 206,41 | 205,75 | hab-tipsho10-a-i15-a-avg-pt-2025 |
| Índice real dos preços (tipsho10) | I15_A_AVG, EU27_2020, 2025 | 124,75 | 124,97 | hab-tipsho10-a-i15-a-avg-eu27_2020-2025 |
| Diferença Portugal − União | derivada | 81,7 | 80,8 (205,75 − 124,97 = 80,78) | der-hab-precos-reais-pt-vs-eu-2025 |
| Variação anual real (tipsho10) | RCH_A_AVG, PT, 2025 | 14,7 | 14,6 | hab-tipsho10-a-rch-a-avg-pt-2025 |
| Variação anual real (tipsho10) | RCH_A_AVG, EU27_2020, 2025 | 2,9 | 3,0 | hab-tipsho10-a-rch-a-avg-eu27_2020-2025 |
| Rácio preço-rendimento (tipsho60) | PTIR_I15 deixou de existir; PTIR_I25 (2025=100) | 144,34 / 105,72 / 55,88 / 121,65; 44,3 % e 5,7 % | subida 2015-2025: PT 60,8 % (100/62,17), UE 6,8 % (100/93,65), RO −42,8 % (100/174,92); 2015-2019 PT 21,7 % (75,64/62,17) | linhas I15 retiram-se; linhas novas (ver C02, C10) |
| Rácio face à média de longo prazo | PTIR_LT_AVG, PT, 2024 / 2025 | 122,92 (2024) | 122,22 (2024); 136,97 (2025, novo) | hab-tipsho60-a-ptir-lt-avg-pt-2024 (relê) ou nova 2025 |
| Rácio face à média de longo prazo | PTIR_LT_AVG, EU27_2020, 2024 / 2025 | 98,94 (2024) | 98,15 (2024); 100,03 (2025) | hab-tipsho60-a-ptir-lt-avg-eu27_2020-2024 ou nova 2025 |
| Rácio face à média de longo prazo | PTIR_LT_AVG, RO, 2024 / 2025 | 48,23 (2024) | 47,13 (2024); 47,01 (2025) | hab-tipsho60-a-ptir-lt-avg-ro-2024 ou nova 2025 |
| Sobrecarga, total (ilc_lvho07c) | TOTAL, EU27_2020, 2025 | 7,7 | 7,6 | hab-ilc-lvho07c-a-pc-total-eu27_2020-2025 |
| Sobrecarga (tespm140) | EU27_2020, 2025 | 7,7 | 7,6 | hab-tespm140-a-pc-eu27_2020-2025; sobrecarga-do-custo-da-habitacao-2025-ue |
| Sobrecarga, inquilinos a preço de mercado | RENT_MKT, EU27_2020, 2025 (tessi164 e ilc_lvho07c) | 18,6 | 18,5 | sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue; hab-ilc-lvho07c-a-pc-rent-mkt-eu27_2020-2025 |
| Diferença inquilinos Portugal − União | derivada | 8,6 | 8,7 (27,2 − 18,5) | der-hab-sobrecarga-inquilinos-pt-vs-eu-2025 |
| Sobrecarga, proprietários com empréstimo | OWN_L, EU27_2020, 2025 | 5,0 | 4,6 | hab-ilc-lvho07c-a-pc-own-l-eu27_2020-2025 |
| Sobrecarga, proprietários sem empréstimo | OWN_NL, EU27_2020, 2025 | 3,8 | 3,7 | hab-ilc-lvho07c-a-pc-own-nl-eu27_2020-2025 |
| Sobrecarga, jovens 16-29 (ilc_lvho07a) | Y16-29, EU27_2020, 2025 | 9,3 | 9,2 | hab-ilc-lvho07a-a-pc-total-y16-29-t-eu27_2020-2025 |
| Jovens 16-29: países com dados | contagem | vinte e seis | vinte e sete (a Dinamarca tem 23,6, marca b) | texto do gabarito |
| Novas operações de crédito à habitação, renegociações incluídas (BdP 12533724) | agosto de 2026 | 2 553,0 | 2 643,0 | hab-bpstat-12533724 |
| Taxa dessas operações (BdP 12533735) | agosto de 2026 | 3,0 | 3,01 | hab-bpstat-12533735 |

**Confirmado sem mudança** (corpos da auditoria): Portugal 6,2 % (ilc_lvho07c) e 6,3 % (tespm140); inquilinos a preço de mercado em Portugal 27,2 % (tessi164 e ilc_lvho07c); proprietários em Portugal 3,0 % e 1,3 %; renda reduzida 2,8 % e 9,2 %; jovens em Portugal 7,5 % e Grécia 25,5 %; tipsho10 Finlândia 81,90 e Portugal 2020 145,91; stock de crédito de agosto 119 061,6; índice nominal de Portugal 301,43. As ordens que o texto afirma (Portugal o mais alto no índice real e na subida do rácio; Finlândia o mais baixo; Roménia a maior descida e a mais longe da média; Grécia a mais alta entre os jovens; Finlândia e Roménia nos inquilinos; Chipre e Grécia no total) recalculam-se em `conferir.py` sobre os 27.

**Setembro já publicado no Banco de Portugal** (fica como opção em C16): 2 759,0 milhões a 3,06 %; stock 120 179,0.

## C01 · parte A

Resumo: o índice real dos preços (tipsho10) foi revisto pelo Eurostat a 03.11.2026: Portugal 2025 206,41 passa a 205,75 e a União 124,75 a 124,97; Portugal continua o mais alto dos vinte e sete.

**Português**, `documento.pt.md.tmpl` linha 9 (Markdown composto, linha 7).

Atual:
> Descontada a inflação, os preços das casas em Portugal subiram desde 2015 mais do que em qualquer outro país da União Europeia: o índice real está em 206,41 em 2025, com 2015 igual a cem, contra 124,75 na União, o valor mais alto dos vinte e sete.

Novo:
> Descontada a inflação, os preços das casas em Portugal subiram desde 2015 mais do que em qualquer outro país da União Europeia: o índice real está em 205,75 em 2025, com 2015 igual a cem, contra 124,97 na União, o valor mais alto dos vinte e sete.

No gabarito: sem alteração (os valores mudam pela releitura das linhas).

**English**, `documento.en.md.tmpl` linha 9 (Markdown composto, linha 7).

Atual:
> Net of inflation, house prices in Portugal have risen since 2015 more than in any other country of the European Union: the real index stands at 206.41 in 2025, with 2015 equal to one hundred, against 124.75 in the Union, the highest value of the twenty-seven.

Novo:
> Net of inflation, house prices in Portugal have risen since 2015 more than in any other country of the European Union: the real index stands at 205.75 in 2025, with 2015 equal to one hundred, against 124.97 in the Union, the highest value of the twenty-seven.

No gabarito: unchanged (values change by re-reading the rows).

**Provas:**
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[252]; freq=A; unit=I15_A_AVG; geo=PT; time=2025: «"252":205.75,» → valor na fonte **205.75** (unit: Annual average index, 2015=100; geo: Portugal; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[10]; freq=A; unit=I15_A_AVG; geo=EU27_2020; time=2025: «"10":124.97,» → valor na fonte **124.97** (unit: Annual average index, 2015=100; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[197]; freq=A; unit=I15_A_AVG; geo=HU; time=2025: «"197":202.32,» → valor na fonte **202.32** (unit: Annual average index, 2015=100; geo: Hungary; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100. segundo mais alto em 2025; Portugal continua o primeiro (ordem conferida por conferir.py sobre os 27) [conferido]

**Linhas do livro:**
- `ledger/claims/hab-tipsho10-a-i15-a-avg-pt-2025.yml`: 206,41 → 205,75 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/hab-tipsho10-a-i15-a-avg-eu27_2020-2025.yml`: 124,75 → 124,97 (releitura da mesma célula (scripts/aplicar-releituras.py))

**Arrasta:**
- secção 1, linha 28 do gabarito → C09
- src/data/leituras.mjs, frase do cartão («Descontada a inflação, os preços das casas em Portugal subiram desde 2015 mais do que em qualquer outro país da União»): «Descontada a inflação, os preços das casas em Portugal subiram desde ». nenhuma: continua verdadeira (205,75 contra 202,32 da Hungria, a segunda)
- conclusão 1, gabarito linha 14: «Nos dois índices do Eurostat que comparam os vinte e sete desde 2015, os preços reais e os preços face ao rendimento, Portugal está no primeiro lugar». nenhuma: conferido, Portugal continua primeiro nos dois (ver C10 para o rácio preço-rendimento, agora pela subida desde 2015)

## C02 · parte A

Resumo: o Eurostat mudou a base do rácio preço-rendimento (tipsho60) de 2015=100 para 2025=100 e juntou 2025 (03.11.2026); 144,34, 105,72, 44,3 % e 5,7 % já não se leem na fonte e o nível já não compara países (todos valem 100 em 2025). Diz-se a subida desde 2015, calculada de dois valores publicados.

**Português**, `documento.pt.md.tmpl` linha 9 (Markdown composto, linha 7).

Atual:
> Em relação ao rendimento das famílias, o rácio preço-rendimento do Eurostat está em 144,34 (2015 igual a cem) contra 105,72 na União, também o valor mais alto: o rácio subiu 44,3 % desde 2015 em Portugal e 5,7 % na União.

Novo:
> Em relação ao rendimento das famílias, o rácio preço-rendimento do Eurostat subiu 60,8 % de 2015 a 2025 em Portugal, a maior subida dos vinte e sete, e 6,8 % na União.

No gabarito:
> Em relação ao rendimento das famílias, o rácio preço-rendimento do Eurostat subiu ⟦HB:der-hab-preco-rendimento-2015-2025-pt⟧ % de 2015 a 2025 em Portugal, a maior subida dos vinte e sete, e ⟦HB:der-hab-preco-rendimento-2015-2025-eu⟧ % na União.

**English**, `documento.en.md.tmpl` linha 9 (Markdown composto, linha 7).

Atual:
> Against household income, Eurostat's price-to-income ratio stands at 144.34 (2015 equal to one hundred) against 105.72 in the Union, also the highest value: the ratio has risen 44.3 % since 2015 in Portugal and 5.7 % in the Union.

Novo:
> Against household income, Eurostat's price-to-income ratio rose 60.8 % from 2015 to 2025 in Portugal, the largest rise of the twenty-seven, and 6.8 % in the Union.

No gabarito:
> Against household income, Eurostat's price-to-income ratio rose ⟦HB:der-hab-preco-rendimento-2015-2025-pt⟧ % from 2015 to 2025 in Portugal, the largest rise of the twenty-seven, and ⟦HB:der-hab-preco-rendimento-2015-2025-eu⟧ % in the Union.

**O que o estudo já não pode dizer:** Que o rácio «está em 144,34 (2015 igual a cem)» ou em qualquer nível com 2015 igual a cem: o Eurostat deixou de publicar essa base (a unidade PTIR_I15 não existe no corpo vivo; existe PTIR_I25, «Price-to-income ratio, index 2025=100»). Que Portugal tem «o valor mais alto» no nível: na base nova todos os países valem 100 em 2025, e só a subida entre dois anos, calculada de dois valores publicados, ordena os países. Os 44,3 % e 5,7 % de 2015 a 2024 também já não se reproduzem: pela série nova são 43,5 % e 4,8 % (89,23/62,17 e 98,12/93,65).

**Aritmética:**
- 100.00 / 62.17 × 100 − 100 = 60.849284220 → 60.8
- 100.00 / 93.65 × 100 − 100 = 6.7805659369 → 6.8

**Provas:**
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[550]; freq=A; unit=PTIR_I25; geo=PT; time=2015: «"550":62.17,» → valor na fonte **62.17** (unit: Price-to-income ratio, index 2025=100; geo: Portugal; time: 2015); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[560]; freq=A; unit=PTIR_I25; geo=PT; time=2025: «"560":100.00,» → valor na fonte **100.00** (unit: Price-to-income ratio, index 2025=100; geo: Portugal; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[308]; freq=A; unit=PTIR_I25; geo=EU27_2020; time=2015: «"308":93.65,» → valor na fonte **93.65** (unit: Price-to-income ratio, index 2025=100; geo: European Union - 27 countries (from 2020); time: 2015); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[318]; freq=A; unit=PTIR_I25; geo=EU27_2020; time=2025: «"318":100.00,» → valor na fonte **100.00** (unit: Price-to-income ratio, index 2025=100; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]

**Linhas do livro:**
- nova `hab-tipsho60-a-ptir-i25-pt-2015`: 62,17 (Price-to-income ratio, index 2025=100; «Standardised house price-to-income ratio; Price-to-income ratio, index 2025=100; Portugal»; 2015); prova i25_PT_2015
- nova `hab-tipsho60-a-ptir-i25-pt-2025`: 100,00 (Price-to-income ratio, index 2025=100; «Standardised house price-to-income ratio; Price-to-income ratio, index 2025=100; Portugal»; 2025); prova i25_PT_2025
- nova `hab-tipsho60-a-ptir-i25-eu27_2020-2015`: 93,65 (Price-to-income ratio, index 2025=100; «Standardised house price-to-income ratio; Price-to-income ratio, index 2025=100; European Union - 27 countries (from 2020)»; 2015); prova i25_EU27_2020_2015
- nova `hab-tipsho60-a-ptir-i25-eu27_2020-2025`: 100,00 (Price-to-income ratio, index 2025=100; «Standardised house price-to-income ratio; Price-to-income ratio, index 2025=100; European Union - 27 countries (from 2020)»; 2025); prova i25_EU27_2020_2025
- nova `der-hab-preco-rendimento-2015-2025-pt`: 60,8 (%; «Subida do rácio preço-rendimento de 2015 a 2025, Portugal»; 2015-2025); derivação round ( hab-tipsho60-a-ptir-i25-pt-2025 / hab-tipsho60-a-ptir-i25-pt-2015 * 100 - 100 , 1 ) = 60,8
- nova `der-hab-preco-rendimento-2015-2025-eu`: 6,8 (%; «Subida do rácio preço-rendimento de 2015 a 2025, União Europeia»; 2015-2025); derivação round ( hab-tipsho60-a-ptir-i25-eu27_2020-2025 / hab-tipsho60-a-ptir-i25-eu27_2020-2015 * 100 - 100 , 1 ) = 6,8

**Saem do texto:** hab-tipsho60-a-ptir-i15-pt-2024 (144,34); hab-tipsho60-a-ptir-i15-eu27_2020-2024 (105,72); der-hab-preco-rendimento-acima-2015-pt-2024 (44,3); der-hab-preco-rendimento-acima-2015-eu-2024 (5,7)


**Arrasta:**
- secção 1, gabarito linha 29 → C10
- src/data/leituras.mjs, medida do cartão → C20
- src/data/nomes-hb1.mjs, linhas 27-42 e 299-310 (nomes das linhas retiradas). dar nome às linhas novas; os nomes das retiradas ficam sem uso

## C03 · parte B5

Resumo: o preço de 2 445 €/m² e a renda de 10,17 €/m² são medianas (o INE escreve-o), e o resumo diz «custava» e «uma renda nova» sem o dizer.

**Português**, `documento.pt.md.tmpl` linha 9 (Markdown composto, linha 7).

Atual:
> Uma casa vendida em Portugal custava 2 445 euros por metro quadrado no 2.º trimestre de 2026, em Lisboa 5 299 e no Porto 3 846; uma renda nova, no 2.º trimestre de 2026, 10,17 euros por metro quadrado no país, 17,79 em Lisboa, 14,66 no Porto.

Novo:
> O preço mediano de uma casa vendida em Portugal foi de 2 445 euros por metro quadrado no 2.º trimestre de 2026, em Lisboa 5 299 e no Porto 3 846; a renda mediana de um contrato novo, no 2.º trimestre de 2026, 10,17 euros por metro quadrado no país, 17,79 em Lisboa, 14,66 no Porto.

No gabarito:
> O preço mediano de uma casa vendida em Portugal foi de ⟦HB:hab-ine-preco-mediano⟧ euros por metro quadrado no ⟦HB:hab-ine-preco-mediano|periodo⟧, em Lisboa ⟦HB:hab-ine-preco-lisboa⟧ e no Porto ⟦HB:hab-ine-preco-porto⟧; a renda mediana de um contrato novo, no ⟦HB:hab-ine-renda-portugal|periodo⟧, ⟦HB:hab-ine-renda-portugal⟧ euros por metro quadrado no país, ⟦HB:hab-ine-renda-lisboa⟧ em Lisboa, ⟦HB:hab-ine-renda-porto⟧ no Porto.

**English**, `documento.en.md.tmpl` linha 9 (Markdown composto, linha 7).

Atual:
> A home sold in Portugal cost 2,445 euros per square metre in Q2 2026, in Lisbon 5,299 and in Porto 3,846; a new rent, in Q2 2026, 10.17 euros per square metre in the country, 17.79 in Lisbon, 14.66 in Porto.

Novo:
> The median price of a home sold in Portugal was 2,445 euros per square metre in Q2 2026, in Lisbon 5,299 and in Porto 3,846; the median rent of a new contract, in Q2 2026, 10.17 euros per square metre in the country, 17.79 in Lisbon, 14.66 in Porto.

No gabarito:
> The median price of a home sold in Portugal was ⟦HB:hab-ine-preco-mediano⟧ euros per square metre in ⟦HB:hab-ine-preco-mediano|periodo⟧, in Lisbon ⟦HB:hab-ine-preco-lisboa⟧ and in Porto ⟦HB:hab-ine-preco-porto⟧; the median rent of a new contract, in ⟦HB:hab-ine-renda-portugal|periodo⟧, ⟦HB:hab-ine-renda-portugal⟧ euros per square metre in the country, ⟦HB:hab-ine-renda-lisboa⟧ in Lisbon, ⟦HB:hab-ine-renda-porto⟧ in Porto.

**Provas:**
- `hb1d-ine-precos-q2.pdf` (sha256 `9f3176072c9399b6…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «Os valores publicados referem-se à mediana (valor que separa em duas partes iguais o conjunto ordenado de preços por metro quadrado) dos preços de alojamentos familiares (€/m2) transacionados.» [conferido]
- `hb1d-ine-precos-q2.pdf` (sha256 `9f3176072c9399b6…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «o preço mediano dos 37 854 alojamentos familiares transacionados em Portugal foi 2 445 €/m2» → valor na fonte **2 445** [conferido]
- `ine-retoma-pt-30-2.pdf` (sha256 `8be6b068ef8c95a5…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «os valores publicados, salvo indicação em contrário, referem-se à mediana» [conferido]
- `ine-retoma-pt-30-2.pdf` (sha256 `8be6b068ef8c95a5…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «a renda mediana dos 35 407 novos contratos de arrendamento em Portugal atingiu 10,17 €/m2» → valor na fonte **10,17** [conferido]
- `ine-retoma-pt-30-2.pdf` (sha256 `8be6b068ef8c95a5…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «Lisboa com a maior renda mediana (17,79 €/m2)» → valor na fonte **17,79** [conferido]
- `ine-retoma-pt-30-6.zip` (sha256 `0d0f452c8fadef57…`), zip; Trimestral1.csv; codificação latin1: «Designação;Valor mediano das rendas por m2 de novos contratos de arrendamento de alojamentos familiares» [conferido]
- `ine-retoma-pt-30-6.zip` (sha256 `0d0f452c8fadef57…`), zip; Trimestral1.csv; codificação latin1: «11A1312;Porto;14,66;» → valor na fonte **14,66** [conferido]

**Linhas do livro:**
- hab-ine-preco-mediano: nenhuma: valor inalterado; só a palavra «mediano/mediana», que é a do nome da linha
- hab-ine-preco-lisboa: nenhuma: valor inalterado; só a palavra «mediano/mediana», que é a do nome da linha
- hab-ine-preco-porto: nenhuma: valor inalterado; só a palavra «mediano/mediana», que é a do nome da linha
- hab-ine-renda-portugal: nenhuma: valor inalterado; só a palavra «mediano/mediana», que é a do nome da linha
- hab-ine-renda-lisboa: nenhuma: valor inalterado; só a palavra «mediano/mediana», que é a do nome da linha
- hab-ine-renda-porto: nenhuma: valor inalterado; só a palavra «mediano/mediana», que é a do nome da linha

**Arrasta:**
- secção 1, gabarito linha 30, as rendas → C11 (o achado dizia que o corpo tem «mediano/mediana»; tem-no para os preços, não para as rendas)

## C04 · parte A

Resumo: a sobrecarga da União em 2025 (ilc_lvho07c, total) foi revista pelo Eurostat a 29.10.2026 de 7,7 % para 7,6 %; a de Portugal fica 6,2 %.

**Português**, `documento.pt.md.tmpl` linha 10 (Markdown composto, linha 9).

Atual:
> E no entanto a família média portuguesa gasta na casa uma parte do rendimento menor do que a média da União (16,3 % contra 18,9 %) e a parte da população em sobrecarga, mais de quarenta por cento do rendimento na casa, é menor (6,2 % contra 7,7 %).

Novo:
> E no entanto a família média portuguesa gasta na casa uma parte do rendimento menor do que a média da União (16,3 % contra 18,9 %) e a parte da população em sobrecarga, mais de quarenta por cento do rendimento na casa, é menor (6,2 % contra 7,6 %).

No gabarito: sem alteração (o valor muda pela releitura da linha).

**English**, `documento.en.md.tmpl` linha 10 (Markdown composto, linha 9).

Atual:
> And yet the average Portuguese household spends on housing a smaller share of its income than the Union average (16.3 % against 18.9 %) and the share of the population overburdened, more than forty percent of income on housing, is smaller (6.2 % against 7.7 %).

Novo:
> And yet the average Portuguese household spends on housing a smaller share of its income than the Union average (16.3 % against 18.9 %) and the share of the population overburdened, more than forty percent of income on housing, is smaller (6.2 % against 7.6 %).

No gabarito: unchanged.

**Provas:**
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[10]; freq=A; unit=PC; tenure=TOTAL; geo=EU27_2020; time=2025: «"10":7.6,» → valor na fonte **7.6** (unit: Percentage; tenure: Total; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[252]; freq=A; unit=PC; tenure=TOTAL; geo=PT; time=2025: «"252":6.2,» → valor na fonte **6.2** (unit: Percentage; tenure: Total; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. Portugal inalterado (6,2) [conferido]

**Linhas do livro:**
- `ledger/claims/hab-ilc-lvho07c-a-pc-total-eu27_2020-2025.yml`: 7,7 → 7,6 (releitura da mesma célula (scripts/aplicar-releituras.py))

**Arrasta:**
- secção 2, gabarito linha 34 → C12
- src/data/leituras.mjs, frase do cartão: «da população gasta na casa mais de quarenta por cento do rendimento, contra ⟨sobrecarga-do-custo-da-habitacao-2025-ue⟩ %». nenhuma no texto: a linha do sítio sobrecarga-do-custo-da-habitacao-2025-ue (tespm140, 7,7) passa a 7,6 pela releitura; o cartão imprime 6,3 contra 7,6
- fora do estudo: src/data/primeira-pagina.mjs, linhas 128-136 (painel «A habitação: a média engana quem arrenda»). nenhuma no texto: as condições (6,3 < 7,6; 27,2 > 18,5) continuam verdadeiras; o desenho muda com as linhas

## C05 · parte A

Resumo: a sobrecarga dos inquilinos a preços de mercado na União em 2025 foi revista de 18,6 % para 18,5 % (tessi164, de que vem a linha do sítio impressa aqui, e ilc_lvho07c); Portugal fica 27,2 %.

**Português**, `documento.pt.md.tmpl` linha 10 (Markdown composto, linha 9).

Atual:
> A diferença está em quem arrenda a preços de mercado: são 16,3 % da população em Portugal (20,8 % na União), e entre eles 27,2 % estão em sobrecarga, contra 18,6 % na União e 19,7 % em 2020; entre os proprietários sem empréstimo, 39,7 % da população, a sobrecarga é de 1,3 %.

Novo:
> A diferença está em quem arrenda a preços de mercado: são 16,3 % da população em Portugal (20,8 % na União), e entre eles 27,2 % estão em sobrecarga, contra 18,5 % na União e 19,7 % em 2020; entre os proprietários sem empréstimo, 39,7 % da população, a sobrecarga é de 1,3 %.

No gabarito: sem alteração (o valor muda pela releitura da linha do sítio e pela cópia em series-do-sitio).

**English**, `documento.en.md.tmpl` linha 10 (Markdown composto, linha 9).

Atual:
> The difference lies with those who rent at market prices: they are 16.3 % of the population in Portugal (20.8 % in the Union), and among them 27.2 % are overburdened, against 18.6 % in the Union and 19.7 % in 2020; among owners with no loan, 39.7 % of the population, the overburden is 1.3 %.

Novo:
> The difference lies with those who rent at market prices: they are 16.3 % of the population in Portugal (20.8 % in the Union), and among them 27.2 % are overburdened, against 18.5 % in the Union and 19.7 % in 2020; among owners with no loan, 39.7 % of the population, the overburden is 1.3 %.

No gabarito: unchanged.

**Provas:**
- `tessi164-vivo.json` (sha256 `518a9928315f9fe4…`), json; value[59]; freq=A; unit=PC; tenure=RENT_MKT; geo=EU27_2020; time=2025: «"59":18.5,» → valor na fonte **18.5** (unit: Percentage; tenure: Tenant, rent at market price; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `tessi164-vivo.json` (sha256 `518a9928315f9fe4…`), json; value[71]; freq=A; unit=PC; tenure=RENT_MKT; geo=PT; time=2025: «"71":27.2}» → valor na fonte **27.2** (unit: Percentage; tenure: Tenant, rent at market price; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. Portugal inalterado (27,2) [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[934]; freq=A; unit=PC; tenure=RENT_MKT; geo=EU27_2020; time=2025: «"934":18.5,» → valor na fonte **18.5** (unit: Percentage; tenure: Tenant, rent at market price; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. o mesmo valor no conjunto por regime de ocupação [conferido]

**Linhas do livro:**
- `ledger/claims/sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue.yml`: 18,6 → 18,5 (releitura da mesma célula (scripts/aplicar-releituras.py); linha do estudo dominios-2026; a cópia em content/28 Habitacao Estudo/Technical Source/series-do-sitio/ledger.json refaz-se depois)
- `ledger/claims/hab-ilc-lvho07c-a-pc-rent-mkt-eu27_2020-2025.yml`: 18,6 → 18,5 (releitura da mesma célula (scripts/aplicar-releituras.py); não é impressa, entra na derivação de C14)

**Arrasta:**
- secção 2, gabarito linha 35 → C14
- fora do estudo: primeira página e o estudo dominios-2026, que imprimem a mesma linha do sítio. mudam com a linha

## C06 · parte B1

Conclusão 2: «quem muda de cidade, quem chega» não é medido por nenhuma linha do estudo (nenhuma das 2 277 linhas do livro HB mede mudanças de residência ou chegadas), e a sobrecarga dos jovens de 16 a 29 anos é menor em Portugal do que na União (7,5 % contra 9,2 %). A frase anterior já diz o que os números mostram; corta-se a última.

**Português**, `documento.pt.md.tmpl` linha 15 (Markdown composto, linha 17).

Atual:
>  O problema da habitação em Portugal é o de quem entra no mercado agora: os jovens, quem muda de cidade, quem chega.

Novo:
> (frase cortada; a conclusão acaba em «… e entre os proprietários com empréstimo de 3,0 %.»)

No gabarito:
> (corta-se a frase, com o espaço que a precede; a conclusão acaba em «… de ⟦HB:hab-ilc-lvho07c-a-pc-own-l-pt-2025⟧ %.»)

**English**, `documento.en.md.tmpl` linha 15 (Markdown composto, linha 17).

Atual:
>  Portugal's housing problem is that of those entering the market now: the young, those who change city, those who arrive.

Novo:
> (sentence cut; the conclusion ends «… and among owners with a loan 3.0 %.»)

No gabarito:
> (sentence cut, with its preceding space; the conclusion ends «… and among owners with a loan ⟦HB:hab-ilc-lvho07c-a-pc-own-l-pt-2025⟧ %.»)

**Provas:**
- `ilc_lvho07a-vivo.json` (sha256 `d9a6b98030755c8a…`), json; value[252]; freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=PT; time=2025: «"252":7.5,» → valor na fonte **7.5** (unit: Percentage; rskpovth: Total; age: From 16 to 29 years; sex: Total; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `ilc_lvho07a-vivo.json` (sha256 `d9a6b98030755c8a…`), json; value[10]; freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=EU27_2020; time=2025: «"10":9.2,» → valor na fonte **9.2** (unit: Percentage; rskpovth: Total; age: From 16 to 29 years; sex: Total; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[560]; freq=A; unit=PC; tenure=OWN_L; geo=PT; time=2025: «"560":3.0,» → valor na fonte **3.0** (unit: Percentage; tenure: Owner, with mortgage or loan; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. o valor com que a conclusão passa a acabar, inalterado [conferido]


**Arrasta:**
- src/data/leituras.mjs, frase do cartão. Decisão do lugar de direção, com o reparo do juiz («em média»): a frase deixa de dizer que o peso cai sobre os jovens, e a idade diz-se como a fonte a mede (a linha `hab-yth-demo-030-a-avg-t-pt-2025` é a «Idade média estimada de saída de casa dos pais»).
  - antes (pt): «… dos quais estão em sobrecarga, e sobre os jovens, que saem de casa dos pais aos 28,8 anos.»
  - depois (pt): «… dos quais estão em sobrecarga; os jovens saem de casa dos pais, em média, aos 28,8 anos.»
  - antes (en): «… of whom are overburdened, and on the young, who leave their parents' home at 28.8 years.»
  - depois (en): «… of whom are overburdened; the young leave their parents' home, on average, at 28.8 years.»
  - no ficheiro: o pedaço `" dos quais estão em sobrecarga, e sobre os jovens, que saem de casa dos pais aos "` passa a `" dos quais estão em sobrecarga; os jovens saem de casa dos pais, em média, aos "`, e `" of whom are overburdened, and on the young, who leave their parents' home at "` passa a `" of whom are overburdened; the young leave their parents' home, on average, at "`.

## C07 · parte B2

Conclusão 5: o título diz que nenhum documento do Estado «mede o que faz», mas o relatório do Orçamento conta beneficiários («quase 120 mil jovens») e casas («mais de 30 mil casas») e o Quadro 5.24 chama-se «Objetivos e indicadores»; «pequeno ao pé do problema» não tem medida. Só a frase final se sustenta.

**Português**, `documento.pt.md.tmpl` linha 18 (Markdown composto, linha 23).

Atual:
> **O que o Estado faz é pequeno ao pé do problema, e nenhum dos seus documentos mede o que faz.**

Novo:
> **O relatório do Orçamento conta casas e beneficiários, mas nem ele nem o comunicado do Conselho de Ministros avaliam o efeito nos preços ou nas rendas.**

No gabarito:
> **O relatório do Orçamento conta casas e beneficiários, mas nem ele nem o comunicado do Conselho de Ministros avaliam o efeito nos preços ou nas rendas.**

**English**, `documento.en.md.tmpl` linha 18 (Markdown composto, linha 23).

Atual:
> **What the State does is small next to the problem, and none of its documents measures what it does.**

Novo:
> **The Budget report counts homes and beneficiaries, but neither it nor the Council of Ministers communiqué assesses the effect on prices or rents.**

No gabarito:
> **The Budget report counts homes and beneficiaries, but neither it nor the Council of Ministers communiqué assesses the effect on prices or rents.**

**Provas:**
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 23 (pdftotext -layout -f 23 -l 23): «que já beneficiaram quase 120 mil jovens» → valor na fonte **quase 120 mil jovens** [conferido]
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 23 (pdftotext -layout -f 23 -l 23): «o Governo já concluiu mais de 30 mil casas» → valor na fonte **mais de 30 mil casas** [conferido]
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 243 (pdftotext -layout -f 243 -l 243): «Quadro 5.24. Objetivos e indicadores da Missão de Base Orgânica Infraestruturas e Habitação» [conferido]
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 243 (pdftotext -layout -f 243 -l 243): «Fogos habitacionais disponibilizados por intervenção pública no período» [conferido]

**Linhas do livro:**
- hab-oe-apoios-jovens: nenhuma: já guarda o excerto dos 120 mil jovens
- hab-oe-oferta: nenhuma: já guarda o excerto das 30 mil casas

**Arrasta:**
- a frase final da mesma conclusão muda com o título (reparo do juiz: a ausência só se afirma dos dois documentos que a conclusão cita, e o juiz procurou-a neles: o relatório do Orçamento, onde a p. 246 do PDF põe «reduzir a pressão sobre os preços» como objetivo sem calcular o efeito, e o comunicado do Conselho de Ministros):
  - pt, antes: «Nenhum dos documentos avalia o efeito nos preços ou nas rendas.» depois: «Nenhum dos dois documentos avalia o efeito nos preços ou nas rendas.»
  - en, antes: «None of the documents assesses the effect on prices or rents.» depois: «Neither document assesses the effect on prices or rents.»

## C08 · parte B6

Conclusão 6: Pedro Duarte aparece só dentro do título citado da notícia do Diário de Notícias, sem ato seu nem cargo. A notícia identifica-se pelo jornal e pela data, sem o título.

**Português**, `documento.pt.md.tmpl` linha 20 (Markdown composto, linha 25).

Atual:
> Os feridos da intervenção policial no Porto são pelo menos «37 feridos, dois em estado grave» segundo o movimento, «35 feridos, pelo menos» segundo José Soeiro, dirigente nacional do BE (o BE é o Bloco de Esquerda) e, pela notícia «Manifestantes pela habitação voltam à Praça D. João I e atiram a Pedro Duarte», «39 feridos, dois deles graves» segundo as contas da organização, com «um polícia ficou ferido» segundo a Polícia de Segurança Pública (a PSP), tudo pela imprensa; a Inspeção-Geral da Administração Interna (a IGAI) abriu um processo.

Novo:
> Os feridos da intervenção policial no Porto são pelo menos «37 feridos, dois em estado grave» segundo o movimento, «35 feridos, pelo menos» segundo José Soeiro, dirigente nacional do BE (o BE é o Bloco de Esquerda) e, pela notícia do Diário de Notícias de 15 de outubro, «39 feridos, dois deles graves» segundo as contas da organização, com «um polícia ficou ferido» segundo a Polícia de Segurança Pública (a PSP), tudo pela imprensa; a Inspeção-Geral da Administração Interna (a IGAI) abriu um processo.

No gabarito:
> Os feridos da intervenção policial no Porto são pelo menos «⟦HB:hab-imprensa-feridos37|excerto⟧» segundo o movimento, «⟦HB:hab-imprensa-feridos35|excerto⟧» segundo ⟦HB:hab-imprensa-feridos35|atribuicao⟧ (o BE é o Bloco de Esquerda) e, pela notícia do Diário de Notícias de ⟦lit:15 de outubro@hab-imprensa-feridos39⟧, «⟦HB:hab-imprensa-feridos39|excerto⟧» segundo as contas da organização, com «⟦HB:hab-imprensa-psp-ferido|excerto⟧» segundo a Polícia de Segurança Pública (a PSP), tudo pela imprensa; a Inspeção-Geral da Administração Interna (a IGAI) abriu um processo.

**English**, `documento.en.md.tmpl` linha 20 (Markdown composto, linha 25).

Atual:
> The injured of the police intervention in Porto are at least «37 feridos, dois em estado grave» according to the movement, «35 feridos, pelo menos» according to José Soeiro, of the national leadership of the Left Bloc (BE) and, by the report «Manifestantes pela habitação voltam à Praça D. João I e atiram a Pedro Duarte», «39 feridos, dois deles graves» by the organisers' count, with «um polícia ficou ferido» according to the Public Security Police (PSP), all through the press; the Inspectorate-General of Home Affairs (IGAI) opened a case.

Novo:
> The injured of the police intervention in Porto are at least «37 feridos, dois em estado grave» according to the movement, «35 feridos, pelo menos» according to José Soeiro, of the national leadership of the Left Bloc (BE) and, by the Diário de Notícias report of 15 October, «39 feridos, dois deles graves» by the organisers' count, with «um polícia ficou ferido» according to the Public Security Police (PSP), all through the press; the Inspectorate-General of Home Affairs (IGAI) opened a case.

No gabarito:
> The injured of the police intervention in Porto are at least «⟦HB:hab-imprensa-feridos37|excerto⟧» according to the movement, «⟦HB:hab-imprensa-feridos35|excerto⟧» according to ⟦HB:hab-imprensa-feridos35|atribuicao⟧ (BE) and, by the Diário de Notícias report of ⟦lit:15 October@hab-imprensa-feridos39⟧, «⟦HB:hab-imprensa-feridos39|excerto⟧» by the organisers' count, with «⟦HB:hab-imprensa-psp-ferido|excerto⟧» according to the Public Security Police (PSP), all through the press; the Inspectorate-General of Home Affairs (IGAI) opened a case.

**Provas:**
- `imprensa-9.html` (sha256 `ee80288a4412a61c…`), html: «"publisher":{"name":"Diário de Notícias"» → valor na fonte **Diário de Notícias** [conferido]
- `imprensa-9.html` (sha256 `ee80288a4412a61c…`), html: «"datePublished":"2026-10-15T21:24:24+01:00"» → valor na fonte **2026-10-15T21:24:24+01:00**. publicada às 21:24 de 15.10.2026, hora de Lisboa (+01:00); a linha hab-imprensa-feridos39 já tem published_at 2026-10-15, que é o campo a que o literal se prende (core/compor_livros.py, literal_supported) [conferido]

**Linhas do livro:**
- hab-imprensa-feridos39: nenhuma no valor; a data 15 de outubro prende-se ao seu published_at


**Arrasta:**
- secção 9, gabarito linha 59 → C18
- ledger/claims/hab-imprensa-feridos39.yml e hab-imprensa-psp-ferido.yml, document.title (o recibo da linha mostra o título). Decisão do lugar de direção: passa de «Manifestantes pela habitação voltam à Praça D. João I e atiram a Pedro Duarte» para o título que a própria página declara no seu <meta name="title">, «Manifestantes levam protesto até à porta da Câmara do Porto» (o juiz conferiu-o no corpo `imprensa-9.html`). Uma linha gerada pelo motor muda-se no motor, nunca à mão.

## C09 · parte A

Secção 1: tipsho10 revisto a 03.11.2026: Portugal 2025 205,75, União 124,97, diferença 80,8 pontos (era 81,7); variação de 2025 14,6 % e 3,0 % (eram 14,7 e 2,9). Finlândia (81,90) e Portugal 2020 (145,91) inalterados; Portugal continua o mais alto e a Finlândia o mais baixo.

**Português**, `documento.pt.md.tmpl` linha 28 (Markdown composto, linha 37).

Atual:
> Descontada a inflação, o índice dos preços de 2025 está em 206,41 contra 124,75 na União, 81,7 pontos acima, com a Finlândia no mais baixo (81,90) e Portugal no mais alto; em 2020 estava em 145,91. Só em 2025, os preços reais subiram 14,7 % em Portugal e 2,9 % na União.

Novo:
> Descontada a inflação, o índice dos preços de 2025 está em 205,75 contra 124,97 na União, 80,8 pontos acima, com a Finlândia no mais baixo (81,90) e Portugal no mais alto; em 2020 estava em 145,91. Só em 2025, os preços reais subiram 14,6 % em Portugal e 3,0 % na União.

No gabarito: sem alteração (os valores mudam pela releitura das linhas e da derivada).

**English**, `documento.en.md.tmpl` linha 28 (Markdown composto, linha 37).

Atual:
> Net of inflation, the 2025 price index stands at 206.41 against 124.75 in the Union, 81.7 points above, with Finland at the lowest (81.90) and Portugal at the highest; in 2020 it stood at 145.91. In 2025 alone, real prices rose 14.7 % in Portugal and 2.9 % in the Union.

Novo:
> Net of inflation, the 2025 price index stands at 205.75 against 124.97 in the Union, 80.8 points above, with Finland at the lowest (81.90) and Portugal at the highest; in 2020 it stood at 145.91. In 2025 alone, real prices rose 14.6 % in Portugal and 3.0 % in the Union.

No gabarito: unchanged.

**Aritmética:**
- 205.75 − 124.97 = 80.78 → 80.8

**Provas:**
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[252]; freq=A; unit=I15_A_AVG; geo=PT; time=2025: «"252":205.75,» → valor na fonte **205.75** (unit: Annual average index, 2015=100; geo: Portugal; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[10]; freq=A; unit=I15_A_AVG; geo=EU27_2020; time=2025: «"10":124.97,» → valor na fonte **124.97** (unit: Annual average index, 2015=100; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[560]; freq=A; unit=RCH_A_AVG; geo=PT; time=2025: «"560":14.6,» → valor na fonte **14.6** (unit: Annual average rate of change; geo: Portugal; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[318]; freq=A; unit=RCH_A_AVG; geo=EU27_2020; time=2025: «"318":3.0,» → valor na fonte **3.0** (unit: Annual average rate of change; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[296]; freq=A; unit=I15_A_AVG; geo=FI; time=2025: «"296":81.90,» → valor na fonte **81.90** (unit: Annual average index, 2015=100; geo: Finland; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100. inalterado [conferido]
- `tipsho10-vivo.json` (sha256 `41335a1e712889be…`), json; value[247]; freq=A; unit=I15_A_AVG; geo=PT; time=2020: «"247":145.91,» → valor na fonte **145.91** (unit: Annual average index, 2015=100; geo: Portugal; time: 2020); conjunto atualizado 2026-11-03T11:00:00+0100. inalterado [conferido]

**Linhas do livro:**
- `ledger/claims/hab-tipsho10-a-i15-a-avg-pt-2025.yml`: 206,41 → 205,75 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/hab-tipsho10-a-i15-a-avg-eu27_2020-2025.yml`: 124,75 → 124,97 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/der-hab-precos-reais-pt-vs-eu-2025.yml`: 81,7 → 80,8 (recalcula-se: round(205,75 − 124,97, 1) = round(80,78, 1) = 80,8)
- `ledger/claims/hab-tipsho10-a-rch-a-avg-pt-2025.yml`: 14,7 → 14,6 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/hab-tipsho10-a-rch-a-avg-eu27_2020-2025.yml`: 2,9 → 3,0 (releitura da mesma célula (scripts/aplicar-releituras.py))

**Arrasta:**
- resumo → C01

## C10 · parte A

Secção 1: o rácio preço-rendimento (tipsho60) passou a 2025=100 e ganhou 2025 (03.11.2026); 144,34, 105,72, 38,6, 55,88 e 121,65 já não existem na fonte. Face à média de longo prazo, Portugal 2024 foi revisto (122,92 → 122,22), a União 2024 também (98,94 → 98,15, não estava na lista da auditoria), a Roménia 2024 também (48,23 → 47,13, não estava na lista); 2025 publicado: Portugal 136,97, União 100,03, Roménia 47,01. Usa-se 2025, o ano que o estudo já usa para os preços reais.

**Português**, `documento.pt.md.tmpl` linha 29 (Markdown composto, linha 39).

Atual:
> Face ao rendimento das famílias, o rácio preço-rendimento do Eurostat (2015 igual a cem) estava em 144,34 em Portugal em 2024 e em 105,72 na União, 38,6 pontos acima; a Roménia tem o mais baixo (55,88) e Portugal o mais alto. Em 2019 Portugal estava em 121,65. Face à média de longo prazo de cada país, que o Eurostat põe igual a cem, Portugal está em 122,92, ou seja, 22,9 % acima da sua, o valor mais alto dos vinte e sete, e a União em 98,94, 1,1 % abaixo; a Roménia é o país mais longe da sua média, mas para baixo (48,23).

Novo:
> Face ao rendimento das famílias, o rácio preço-rendimento do Eurostat (2025 igual a cem) subiu 60,8 % em Portugal de 2015 a 2025 e 6,8 % na União; a Roménia tem a maior descida (−42,8 %) e Portugal a maior subida. Em 2019 o rácio de Portugal estava 21,7 % acima do de 2015. Face à média de longo prazo de cada país, que o Eurostat põe igual a cem, Portugal está em 136,97 em 2025, ou seja, 37,0 % acima da sua, o valor mais alto dos vinte e sete, e a União em 100,03, praticamente igual à sua; a Roménia é o país mais longe da sua média, mas para baixo (47,01).

No gabarito:
> Face ao rendimento das famílias, o rácio preço-rendimento do Eurostat (2025 igual a cem) subiu ⟦HB:der-hab-preco-rendimento-2015-2025-pt⟧ % em Portugal de 2015 a 2025 e ⟦HB:der-hab-preco-rendimento-2015-2025-eu⟧ % na União; a Roménia tem a maior descida (⟦HB:der-hab-preco-rendimento-2015-2025-ro⟧ %) e Portugal a maior subida. Em 2019 o rácio de Portugal estava ⟦HB:der-hab-preco-rendimento-2015-2019-pt⟧ % acima do de 2015. Face à média de longo prazo de cada país, que o Eurostat põe igual a cem, Portugal está em ⟦HB:hab-tipsho60-a-ptir-lt-avg-pt-2025⟧ em 2025, ou seja, ⟦HB:der-hab-preco-rendimento-lt-pt-2025⟧ % acima da sua, o valor mais alto dos vinte e sete, e a União em ⟦HB:hab-tipsho60-a-ptir-lt-avg-eu27_2020-2025⟧, praticamente igual à sua; a Roménia é o país mais longe da sua média, mas para baixo (⟦HB:hab-tipsho60-a-ptir-lt-avg-ro-2025⟧).

**English**, `documento.en.md.tmpl` linha 29 (Markdown composto, linha 39).

Atual:
> Against household income, Eurostat's price-to-income ratio (2015 equal to one hundred) stood at 144.34 in Portugal in 2024 and at 105.72 in the Union, 38.6 points above; Romania has the lowest (55.88) and Portugal the highest. In 2019 Portugal stood at 121.65. Against each country's own long-term average, which Eurostat sets equal to one hundred, Portugal stands at 122.92, that is, 22.9 % above its own, the highest value of the twenty-seven, and the Union at 98.94, 1.1 % below; Romania is the country furthest from its average, but downwards (48.23).

Novo:
> Against household income, Eurostat's price-to-income ratio (2025 equal to one hundred) rose 60.8 % in Portugal from 2015 to 2025 and 6.8 % in the Union; Romania has the largest fall (−42.8 %) and Portugal the largest rise. In 2019 Portugal's ratio stood 21.7 % above its 2015 level. Against each country's own long-term average, which Eurostat sets equal to one hundred, Portugal stands at 136.97 in 2025, that is, 37.0 % above its own, the highest value of the twenty-seven, and the Union at 100.03, practically level with its own; Romania is the country furthest from its average, but downwards (47.01).

No gabarito:
> Against household income, Eurostat's price-to-income ratio (2025 equal to one hundred) rose ⟦HB:der-hab-preco-rendimento-2015-2025-pt⟧ % in Portugal from 2015 to 2025 and ⟦HB:der-hab-preco-rendimento-2015-2025-eu⟧ % in the Union; Romania has the largest fall (⟦HB:der-hab-preco-rendimento-2015-2025-ro⟧ %) and Portugal the largest rise. In 2019 Portugal's ratio stood ⟦HB:der-hab-preco-rendimento-2015-2019-pt⟧ % above its 2015 level. Against each country's own long-term average, which Eurostat sets equal to one hundred, Portugal stands at ⟦HB:hab-tipsho60-a-ptir-lt-avg-pt-2025⟧ in 2025, that is, ⟦HB:der-hab-preco-rendimento-lt-pt-2025⟧ % above its own, the highest value of the twenty-seven, and the Union at ⟦HB:hab-tipsho60-a-ptir-lt-avg-eu27_2020-2025⟧, practically level with its own; Romania is the country furthest from its average, but downwards (⟦HB:hab-tipsho60-a-ptir-lt-avg-ro-2025⟧).

**Ordens:** conferir.py recalcula sobre os 27: maior subida 2015-2025 Portugal (60,85), segunda Países Baixos (34,28); maior descida Roménia (−42,83); face à média de longo prazo 2025 o mais alto Portugal (136,97, o segundo Chéquia 118,08) e o mais longe Roménia (47,01: 52,99 abaixo, contra 36,97 acima de Portugal).

**Aritmética:**
- 100.00 / 62.17 × 100 − 100 = 60.849284220 → 60.8
- 100.00 / 93.65 × 100 − 100 = 6.7805659369 → 6.8
- 100.00 / 174.92 × 100 − 100 = -42.83100846 → -42.8
- 75.64 / 62.17 × 100 − 100 = 21.666398584 → 21.7
- 136.97 − 100 = 36.97 → 37.0

**Provas:**
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[550]; freq=A; unit=PTIR_I25; geo=PT; time=2015: «"550":62.17,» → valor na fonte **62.17** (unit: Price-to-income ratio, index 2025=100; geo: Portugal; time: 2015); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[560]; freq=A; unit=PTIR_I25; geo=PT; time=2025: «"560":100.00,» → valor na fonte **100.00** (unit: Price-to-income ratio, index 2025=100; geo: Portugal; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[308]; freq=A; unit=PTIR_I25; geo=EU27_2020; time=2015: «"308":93.65,» → valor na fonte **93.65** (unit: Price-to-income ratio, index 2025=100; geo: European Union - 27 countries (from 2020); time: 2015); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[318]; freq=A; unit=PTIR_I25; geo=EU27_2020; time=2025: «"318":100.00,» → valor na fonte **100.00** (unit: Price-to-income ratio, index 2025=100; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[561]; freq=A; unit=PTIR_I25; geo=RO; time=2015: «"561":174.92,» → valor na fonte **174.92** (unit: Price-to-income ratio, index 2025=100; geo: Romania; time: 2015); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[571]; freq=A; unit=PTIR_I25; geo=RO; time=2025: «"571":100.00,» → valor na fonte **100.00** (unit: Price-to-income ratio, index 2025=100; geo: Romania; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[554]; freq=A; unit=PTIR_I25; geo=PT; time=2019: «"554":75.64,» → valor na fonte **75.64** (unit: Price-to-income ratio, index 2025=100; geo: Portugal; time: 2019); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[868]; freq=A; unit=PTIR_LT_AVG; geo=PT; time=2025: «"868":136.97,» → valor na fonte **136.97** (unit: Price-to-income ratio relative to long-term average; geo: Portugal; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[626]; freq=A; unit=PTIR_LT_AVG; geo=EU27_2020; time=2025: «"626":100.03,» → valor na fonte **100.03** (unit: Price-to-income ratio relative to long-term average; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[879]; freq=A; unit=PTIR_LT_AVG; geo=RO; time=2025: «"879":47.01,» → valor na fonte **47.01** (unit: Price-to-income ratio relative to long-term average; geo: Romania; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]

**Linhas do livro:**
- nova `hab-tipsho60-a-ptir-i25-ro-2015`: 174,92 (Price-to-income ratio, index 2025=100; «Standardised house price-to-income ratio; Price-to-income ratio, index 2025=100; Romania»; 2015); prova i25_RO_2015
- nova `hab-tipsho60-a-ptir-i25-ro-2025`: 100,00 (Price-to-income ratio, index 2025=100; «Standardised house price-to-income ratio; Price-to-income ratio, index 2025=100; Romania»; 2025); prova i25_RO_2025
- nova `hab-tipsho60-a-ptir-i25-pt-2019`: 75,64 (Price-to-income ratio, index 2025=100; «Standardised house price-to-income ratio; Price-to-income ratio, index 2025=100; Portugal»; 2019); prova i25_PT_2019
- nova `der-hab-preco-rendimento-2015-2025-ro`: −42,8 (%; «Variação do rácio preço-rendimento de 2015 a 2025, Roménia»; 2015-2025); derivação round ( hab-tipsho60-a-ptir-i25-ro-2025 / hab-tipsho60-a-ptir-i25-ro-2015 * 100 - 100 , 1 ) = −42,8
- nova `der-hab-preco-rendimento-2015-2019-pt`: 21,7 (%; «Subida do rácio preço-rendimento de 2015 a 2019, Portugal»; 2015-2019); derivação round ( hab-tipsho60-a-ptir-i25-pt-2019 / hab-tipsho60-a-ptir-i25-pt-2015 * 100 - 100 , 1 ) = 21,7
- nova `hab-tipsho60-a-ptir-lt-avg-pt-2025`: 136,97 (Price-to-income ratio relative to long-term average; «Standardised house price-to-income ratio; Price-to-income ratio relative to long-term average; Portugal»; 2025); prova lt_PT_2025
- nova `hab-tipsho60-a-ptir-lt-avg-eu27_2020-2025`: 100,03 (Price-to-income ratio relative to long-term average; «Standardised house price-to-income ratio; Price-to-income ratio relative to long-term average; European Union - 27 countries (from 2020)»; 2025); prova lt_EU27_2020_2025
- nova `hab-tipsho60-a-ptir-lt-avg-ro-2025`: 47,01 (Price-to-income ratio relative to long-term average; «Standardised house price-to-income ratio; Price-to-income ratio relative to long-term average; Romania»; 2025); prova lt_RO_2025
- nova `der-hab-preco-rendimento-lt-pt-2025`: 37,0 (%; «Distância do rácio preço-rendimento à média de longo prazo, Portugal»; 2025); derivação round ( hab-tipsho60-a-ptir-lt-avg-pt-2025 - 100 , 1 ) = round(36,97, 1) = 37,0
- mais as quatro linhas novas de C02 (Portugal e União, 2015 e 2025) e as duas derivadas de C02

**Saem do texto:** hab-tipsho60-a-ptir-i15-pt-2024; hab-tipsho60-a-ptir-i15-eu27_2020-2024; hab-tipsho60-a-ptir-i15-ro-2024; hab-tipsho60-a-ptir-i15-pt-2019; der-hab-preco-rendimento-pt-vs-eu-2024 (38,6: a diferença de níveis deixa de ter sentido na base nova; corta-se, sem substituta); hab-tipsho60-a-ptir-lt-avg-pt-2024; hab-tipsho60-a-ptir-lt-avg-eu27_2020-2024; hab-tipsho60-a-ptir-lt-avg-ro-2024; der-hab-preco-rendimento-lt-pt-2024; der-hab-preco-rendimento-lt-eu-2024


**Arrasta:**
- resumo → C02
- cartão → C20

## C11 · parte B5 (arrasto)

Secção 1: as rendas de 10,17, 17,79 e 14,66 €/m² são medianas e o corpo também não o diz («E as rendas dos contratos novos»); o achado B5 supunha que o corpo o dizia, e só o diz para os preços.

**Português**, `documento.pt.md.tmpl` linha 30 (Markdown composto, linha 41).

Atual:
> E as rendas dos contratos novos: 10,17 euros por metro quadrado no 2.º trimestre de 2026, 17,79 em Lisboa, 14,66 no Porto; Lisboa custa 1,7 vezes o país.

Novo:
> E a renda mediana dos contratos novos: 10,17 euros por metro quadrado no 2.º trimestre de 2026, 17,79 em Lisboa, 14,66 no Porto; Lisboa custa 1,7 vezes o país.

No gabarito:
> E a renda mediana dos contratos novos: ⟦HB:hab-ine-renda-portugal⟧ euros por metro quadrado no ⟦HB:hab-ine-renda-portugal|periodo⟧, ⟦HB:hab-ine-renda-lisboa⟧ em Lisboa, ⟦HB:hab-ine-renda-porto⟧ no Porto; Lisboa custa ⟦HB:der-hab-renda-lisboa-vs-portugal⟧ vezes o país.

**English**, `documento.en.md.tmpl` linha 30 (Markdown composto, linha 41).

Atual:
> And the rents of new contracts: 10.17 euros per square metre in Q2 2026, 17.79 in Lisbon, 14.66 in Porto; Lisbon costs 1.7 times the country.

Novo:
> And the median rent of new contracts: 10.17 euros per square metre in Q2 2026, 17.79 in Lisbon, 14.66 in Porto; Lisbon costs 1.7 times the country.

No gabarito:
> And the median rent of new contracts: ⟦HB:hab-ine-renda-portugal⟧ euros per square metre in ⟦HB:hab-ine-renda-portugal|periodo⟧, ⟦HB:hab-ine-renda-lisboa⟧ in Lisbon, ⟦HB:hab-ine-renda-porto⟧ in Porto; Lisbon costs ⟦HB:der-hab-renda-lisboa-vs-portugal⟧ times the country.

**Provas:**
- `ine-retoma-pt-30-2.pdf` (sha256 `8be6b068ef8c95a5…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «os valores publicados, salvo indicação em contrário, referem-se à mediana» [conferido]
- `ine-retoma-pt-30-2.pdf` (sha256 `8be6b068ef8c95a5…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «a renda mediana dos 35 407 novos contratos de arrendamento em Portugal atingiu 10,17 €/m2» → valor na fonte **10,17** [conferido]
- `ine-retoma-pt-30-2.pdf` (sha256 `8be6b068ef8c95a5…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «Lisboa com a maior renda mediana (17,79 €/m2)» → valor na fonte **17,79** [conferido]
- `ine-retoma-pt-30-6.zip` (sha256 `0d0f452c8fadef57…`), zip; Trimestral1.csv; codificação latin1: «Designação;Valor mediano das rendas por m2 de novos contratos de arrendamento de alojamentos familiares» [conferido]

**Arrasta:**
- resumo → C03

## C12 · parte A

Secção 2: a União passou de 7,7 % para 7,6 % nos dois conjuntos (ilc_lvho07c e tespm140, ambos atualizados pelo Eurostat a 29.10.2026); Portugal fica 6,2 % e 6,3 %. A frase «as duas foram atualizadas no mesmo dia, 20 de outubro de 2026 … os números desta página são os da atualização mais recente» é falsa desde 29.10; diz-se de que conjunto são os números, sem data e sem dizer que são os mais recentes.

**Português**, `documento.pt.md.tmpl` linha 34 (Markdown composto, linha 47).

Atual:
> A sobrecarga, a parte da população que gasta na casa mais de quarenta por cento do rendimento, é de 6,2 % em Portugal e de 7,7 % na União, pelo conjunto do Eurostat por regime de ocupação; a publicação principal do Eurostat da mesma medida, de que vem a série deste sítio, dá 6,3 % para Portugal e 7,7 % para a União: as duas foram atualizadas no mesmo dia, 20 de outubro de 2026, a horas diferentes, e os números desta página são os da atualização mais recente, a do conjunto por regime de ocupação.

Novo:
> A sobrecarga, a parte da população que gasta na casa mais de quarenta por cento do rendimento, é de 6,2 % em Portugal e de 7,6 % na União, pelo conjunto do Eurostat por regime de ocupação; outro conjunto do Eurostat com a mesma medida, de que vem a série deste sítio, dá 6,3 % para Portugal e 7,6 % para a União; os números da sobrecarga total desta página são os do conjunto por regime de ocupação.

No gabarito:
> A sobrecarga, a parte da população que gasta na casa mais de quarenta por cento do rendimento, é de ⟦HB:hab-ilc-lvho07c-a-pc-total-pt-2025⟧ % em Portugal e de ⟦HB:hab-ilc-lvho07c-a-pc-total-eu27_2020-2025⟧ % na União, pelo conjunto do Eurostat por regime de ocupação; outro conjunto do Eurostat com a mesma medida, de que vem a série deste sítio, dá ⟦HB:hab-tespm140-a-pc-pt-2025⟧ % para Portugal e ⟦HB:hab-tespm140-a-pc-eu27_2020-2025⟧ % para a União; os números da sobrecarga total desta página são os do conjunto por regime de ocupação.

**English**, `documento.en.md.tmpl` linha 34 (Markdown composto, linha 47).

Atual:
> Overburden, the share of the population spending more than forty percent of its income on housing, is 6.2 % in Portugal and 7.7 % in the Union, by Eurostat's dataset by tenure; Eurostat's main publication of the same measure, from which this site's series comes, gives 6.3 % for Portugal and 7.7 % for the Union: the two were updated on the same day, 20 October 2026, at different hours, and the numbers on this page are those of the more recent update, the dataset by tenure.

Novo:
> Overburden, the share of the population spending more than forty percent of its income on housing, is 6.2 % in Portugal and 7.6 % in the Union, by Eurostat's dataset by tenure; another Eurostat dataset with the same measure, from which this site's series comes, gives 6.3 % for Portugal and 7.6 % for the Union; the total overburden figures on this page are those of the dataset by tenure.

No gabarito:
> Overburden, the share of the population spending more than forty percent of its income on housing, is ⟦HB:hab-ilc-lvho07c-a-pc-total-pt-2025⟧ % in Portugal and ⟦HB:hab-ilc-lvho07c-a-pc-total-eu27_2020-2025⟧ % in the Union, by Eurostat's dataset by tenure; another Eurostat dataset with the same measure, from which this site's series comes, gives ⟦HB:hab-tespm140-a-pc-pt-2025⟧ % for Portugal and ⟦HB:hab-tespm140-a-pc-eu27_2020-2025⟧ % for the Union; the total overburden figures on this page are those of the dataset by tenure.

**Provas:**
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[252]; freq=A; unit=PC; tenure=TOTAL; geo=PT; time=2025: «"252":6.2,» → valor na fonte **6.2** (unit: Percentage; tenure: Total; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. inalterado [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[10]; freq=A; unit=PC; tenure=TOTAL; geo=EU27_2020; time=2025: «"10":7.6,» → valor na fonte **7.6** (unit: Percentage; tenure: Total; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `hb1b-tespm140-vivo.json` (sha256 `fe7b955ed07839cd…`), json; value[252]; freq=A; unit=PC; rskpovth=TOTAL; age=TOTAL; sex=T; geo=PT; time=2025: «"252":6.3,» → valor na fonte **6.3** (unit: Percentage; rskpovth: Total; age: Total; sex: Total; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. inalterado [conferido]
- `hb1b-tespm140-vivo.json` (sha256 `fe7b955ed07839cd…`), json; value[10]; freq=A; unit=PC; rskpovth=TOTAL; age=TOTAL; sex=T; geo=EU27_2020; time=2025: «"10":7.6,» → valor na fonte **7.6** (unit: Percentage; rskpovth: Total; age: Total; sex: Total; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `pedidos.jsonl` (sha256 `0a22067294ad70a2…`), jsonl; linha de hb1b-ilc_lvho07c-vivo.json: «"sha256": "af29ab2dbdd8d4975f5bb8f6e438a5af4557cc4f5cab4fa5fa4f885a504079da", "utc": "2026-11-12T20:30:28Z"» → valor na fonte **2026-11-12T20:30:28Z (UTC; em Lisboa, WET = UTC+0, 12.11.2026)** [conferido]
- `pedidos.jsonl` (sha256 `0a22067294ad70a2…`), jsonl; linha de hb1b-tespm140-vivo.json: «"sha256": "fe7b955ed07839cd7560a9a749872ecafcae298a5544bf0f74673949e1f772f5", "utc": "2026-11-12T20:30:24Z"» → valor na fonte **2026-11-12T20:30:24Z** [conferido]

**Linhas do livro:**
- `ledger/claims/hab-ilc-lvho07c-a-pc-total-eu27_2020-2025.yml`: 7,7 → 7,6 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/hab-tespm140-a-pc-eu27_2020-2025.yml`: 7,7 → 7,6 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/sobrecarga-do-custo-da-habitacao-2025-ue.yml`: 7,7 → 7,6 (releitura da mesma célula (scripts/aplicar-releituras.py); linha do sítio (estudo quadro-institucional), lida do tespm140; o cartão do estudo imprime-a)

**Arrasta:**
- resumo → C04
- cartão (leituras.mjs), frase com sobrecarga-do-custo-da-habitacao-2025-ue. muda com a linha (7,6)

## C13 · parte A

Secção 2: na União, a sobrecarga dos proprietários com empréstimo passou de 5,0 % para 4,6 % e a dos sem empréstimo de 3,8 % para 3,7 % (29.10.2026); Portugal (3,0 e 1,3) e os inquilinos a renda reduzida (2,8 e 9,2) não mudaram.

**Português**, `documento.pt.md.tmpl` linha 35 (Markdown composto, linha 49).

Atual:
> Entre os proprietários com empréstimo a sobrecarga é de 3,0 % (5,0 % na União); entre os proprietários sem empréstimo, 1,3 % (3,8 %); entre os inquilinos a renda reduzida ou gratuita, 2,8 % (9,2 %).

Novo:
> Entre os proprietários com empréstimo a sobrecarga é de 3,0 % (4,6 % na União); entre os proprietários sem empréstimo, 1,3 % (3,7 %); entre os inquilinos a renda reduzida ou gratuita, 2,8 % (9,2 %).

No gabarito: sem alteração.

**English**, `documento.en.md.tmpl` linha 35 (Markdown composto, linha 49).

Atual:
> Among owners with a loan the overburden is 3.0 % (5.0 % in the Union); among owners with no loan, 1.3 % (3.8 %); among tenants at reduced or free rent, 2.8 % (9.2 %).

Novo:
> Among owners with a loan the overburden is 3.0 % (4.6 % in the Union); among owners with no loan, 1.3 % (3.7 %); among tenants at reduced or free rent, 2.8 % (9.2 %).

No gabarito: unchanged.

**Provas:**
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[318]; freq=A; unit=PC; tenure=OWN_L; geo=EU27_2020; time=2025: «"318":4.6,» → valor na fonte **4.6** (unit: Percentage; tenure: Owner, with mortgage or loan; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[626]; freq=A; unit=PC; tenure=OWN_NL; geo=EU27_2020; time=2025: «"626":3.7,» → valor na fonte **3.7** (unit: Percentage; tenure: Owner, no outstanding mortgage or housing loan; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[560]; freq=A; unit=PC; tenure=OWN_L; geo=PT; time=2025: «"560":3.0,» → valor na fonte **3.0** (unit: Percentage; tenure: Owner, with mortgage or loan; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. inalterado [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[868]; freq=A; unit=PC; tenure=OWN_NL; geo=PT; time=2025: «"868":1.3,» → valor na fonte **1.3** (unit: Percentage; tenure: Owner, no outstanding mortgage or housing loan; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. inalterado [conferido]

**Linhas do livro:**
- `ledger/claims/hab-ilc-lvho07c-a-pc-own-l-eu27_2020-2025.yml`: 5,0 → 4,6 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/hab-ilc-lvho07c-a-pc-own-nl-eu27_2020-2025.yml`: 3,8 → 3,7 (releitura da mesma célula (scripts/aplicar-releituras.py))

## C14 · parte A

Secção 2: inquilinos a preços de mercado, União 18,6 % → 18,5 %; a diferença para Portugal (27,2 %) passa de 8,6 a 8,7 pontos. Finlândia (12,3) e Roménia (56,0) inalteradas, ainda a mais baixa e a mais alta.

**Português**, `documento.pt.md.tmpl` linha 35 (Markdown composto, linha 49).

Atual:
> Entre os inquilinos a preços de mercado é de 27,2 %, contra 18,6 % na União, 8,6 pontos acima; era 19,7 % em 2020 e 35,4 % em 2015 (a Finlândia tem a mais baixa, 12,3 %, e a Roménia a mais alta, 56,0 %).

Novo:
> Entre os inquilinos a preços de mercado é de 27,2 %, contra 18,5 % na União, 8,7 pontos acima; era 19,7 % em 2020 e 35,4 % em 2015 (a Finlândia tem a mais baixa, 12,3 %, e a Roménia a mais alta, 56,0 %).

No gabarito: sem alteração.

**English**, `documento.en.md.tmpl` linha 35 (Markdown composto, linha 49).

Atual:
> Among tenants at market rents it is 27.2 %, against 18.6 % in the Union, 8.6 points above; it was 19.7 % in 2020 and 35.4 % in 2015 (Finland has the lowest, 12.3 %, and Romania the highest, 56.0 %).

Novo:
> Among tenants at market rents it is 27.2 %, against 18.5 % in the Union, 8.7 points above; it was 19.7 % in 2020 and 35.4 % in 2015 (Finland has the lowest, 12.3 %, and Romania the highest, 56.0 %).

No gabarito: unchanged.

**Aritmética:**
- 27.2 − 18.5 = 8.7 → 8.7

**Provas:**
- `tessi164-vivo.json` (sha256 `518a9928315f9fe4…`), json; value[59]; freq=A; unit=PC; tenure=RENT_MKT; geo=EU27_2020; time=2025: «"59":18.5,» → valor na fonte **18.5** (unit: Percentage; tenure: Tenant, rent at market price; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `tessi164-vivo.json` (sha256 `518a9928315f9fe4…`), json; value[71]; freq=A; unit=PC; tenure=RENT_MKT; geo=PT; time=2025: «"71":27.2}» → valor na fonte **27.2** (unit: Percentage; tenure: Tenant, rent at market price; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. inalterado [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[934]; freq=A; unit=PC; tenure=RENT_MKT; geo=EU27_2020; time=2025: «"934":18.5,» → valor na fonte **18.5** (unit: Percentage; tenure: Tenant, rent at market price; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `hb1b-ilc_lvho07c-vivo.json` (sha256 `af29ab2dbdd8d497…`), json; value[1176]; freq=A; unit=PC; tenure=RENT_MKT; geo=PT; time=2025: «"1176":27.2,» → valor na fonte **27.2** (unit: Percentage; tenure: Tenant, rent at market price; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. inalterado [conferido]

**Linhas do livro:**
- `ledger/claims/sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue.yml`: 18,6 → 18,5 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/hab-ilc-lvho07c-a-pc-rent-mkt-eu27_2020-2025.yml`: 18,6 → 18,5 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/der-hab-sobrecarga-inquilinos-pt-vs-eu-2025.yml`: 8,6 → 8,7 (recalcula-se: round(27,2 − 18,5, 1) = 8,7)

**Arrasta:**
- resumo → C05

## C15 · parte A

Secção 2: sobrecarga dos jovens de 16 a 29 anos na União 9,3 % → 9,2 % (29.10.2026); a Dinamarca passou a ter valor de 2025 (23,6, marca b), e os países com dados são agora os vinte e sete; a Grécia (25,5) continua a mais alta; Portugal fica 7,5 %.

**Português**, `documento.pt.md.tmpl` linha 35 (Markdown composto, linha 49).

Atual:
> Entre os jovens de dezasseis a vinte e nove anos, a sobrecarga é de 7,5 % (9,3 % na União; a Grécia 25,5 %, a mais alta dos vinte e seis com dados).

Novo:
> Entre os jovens de dezasseis a vinte e nove anos, a sobrecarga é de 7,5 % (9,2 % na União; a Grécia 25,5 %, a mais alta dos vinte e sete).

No gabarito:
> Entre os jovens de dezasseis a vinte e nove anos, a sobrecarga é de ⟦HB:hab-ilc-lvho07a-a-pc-total-y16-29-t-pt-2025⟧ % (⟦HB:hab-ilc-lvho07a-a-pc-total-y16-29-t-eu27_2020-2025⟧ % na União; a Grécia ⟦HB:hab-ilc-lvho07a-a-pc-total-y16-29-t-el-2025⟧ %, a mais alta dos vinte e sete).

**English**, `documento.en.md.tmpl` linha 35 (Markdown composto, linha 49).

Atual:
> Among the young aged sixteen to twenty-nine, the overburden is 7.5 % (9.3 % in the Union; Greece 25.5 %, the highest of the twenty-six with data).

Novo:
> Among the young aged sixteen to twenty-nine, the overburden is 7.5 % (9.2 % in the Union; Greece 25.5 %, the highest of the twenty-seven).

No gabarito:
> Among the young aged sixteen to twenty-nine, the overburden is ⟦HB:hab-ilc-lvho07a-a-pc-total-y16-29-t-pt-2025⟧ % (⟦HB:hab-ilc-lvho07a-a-pc-total-y16-29-t-eu27_2020-2025⟧ % in the Union; Greece ⟦HB:hab-ilc-lvho07a-a-pc-total-y16-29-t-el-2025⟧ %, the highest of the twenty-seven).

**Nota:** «dos vinte e sete com dados» também serve; com todos os países com valor, «com dados» deixa de distinguir e corta-se.

**Provas:**
- `ilc_lvho07a-vivo.json` (sha256 `d9a6b98030755c8a…`), json; value[10]; freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=EU27_2020; time=2025: «"10":9.2,» → valor na fonte **9.2** (unit: Percentage; rskpovth: Total; age: From 16 to 29 years; sex: Total; geo: European Union - 27 countries (from 2020); time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100 [conferido]
- `ilc_lvho07a-vivo.json` (sha256 `d9a6b98030755c8a…`), json; value[252]; freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=PT; time=2025: «"252":7.5,» → valor na fonte **7.5** (unit: Percentage; rskpovth: Total; age: From 16 to 29 years; sex: Total; geo: Portugal; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. inalterado [conferido]
- `ilc_lvho07a-vivo.json` (sha256 `d9a6b98030755c8a…`), json; value[98]; freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=EL; time=2025: «"98":25.5,» → valor na fonte **25.5** (unit: Percentage; rskpovth: Total; age: From 16 to 29 years; sex: Total; geo: Greece; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. a mais alta; conferir.py conta 27 países com valor de 2025 [conferido]
- `ilc_lvho07a-vivo.json` (sha256 `d9a6b98030755c8a…`), json; value[54]; freq=A; unit=PC; rskpovth=TOTAL; age=Y16-29; sex=T; geo=DK; time=2025: «"54":23.6,» → valor na fonte **23.6** (unit: Percentage; rskpovth: Total; age: From 16 to 29 years; sex: Total; geo: Denmark; time: 2025); conjunto atualizado 2026-10-29T23:00:00+0100. agora com valor; no corpo alojado de 16.10.2026 estava vazio [conferido]

**Linhas do livro:**
- `ledger/claims/hab-ilc-lvho07a-a-pc-total-y16-29-t-eu27_2020-2025.yml`: 9,3 → 9,2 (releitura da mesma célula (scripts/aplicar-releituras.py))

**Arrasta:**
- conclusão 2 → C06 (o valor revisto (9,2) é o que C06 usa para justificar o corte)

## C16 · parte A

Secção 6: o Banco de Portugal reviu a 02.11.2026 o montante de agosto de 2 553,0 para 2 643,0 milhões e a taxa de 3,0 para 3,01 %; a série inclui renegociações («Novas operações de empréstimos (inclui renegociações) à habitação») e «os bancos emprestaram» não o diz. O stock de agosto (119 061,6) não mudou. Mantém-se agosto, o mês das linhas; setembro fica como opção.

**Português**, `documento.pt.md.tmpl` linha 43 (Markdown composto, linha 65).

Atual:
> Em agosto de 2026 os bancos emprestaram 2 553,0 milhões de euros em novas operações de crédito à habitação, a uma taxa de 3,0 %, segundo o Banco de Portugal; o stock de crédito à habitação das famílias era de 119 061,6 milhões.

Novo:
> Em agosto de 2026 as novas operações de crédito à habitação dos bancos, renegociações incluídas, somaram 2 643,0 milhões de euros, a uma taxa de 3,01 %, segundo o Banco de Portugal; o stock de crédito à habitação dos particulares era de 119 061,6 milhões.

No gabarito:
> Em agosto de 2026 as novas operações de crédito à habitação dos bancos, renegociações incluídas, somaram ⟦HB:hab-bpstat-12533724⟧ milhões de euros, a uma taxa de ⟦HB:hab-bpstat-12533735⟧ %, segundo o Banco de Portugal; o stock de crédito à habitação dos particulares era de ⟦HB:hab-bpstat-12557378⟧ milhões.

**English**, `documento.en.md.tmpl` linha 43 (Markdown composto, linha 65).

Atual:
> In August 2026 the banks lent 2,553.0 million euros in new housing loans, at a rate of 3.0 %, according to the Bank of Portugal; the stock of households' housing credit was 119,061.6 million.

Novo:
> In August 2026 the banks' new housing loan operations, renegotiations included, came to 2,643.0 million euros, at a rate of 3.01 %, according to the Bank of Portugal; the stock of housing credit to private individuals was 119,061.6 million.

No gabarito:
> In August 2026 the banks' new housing loan operations, renegotiations included, came to ⟦HB:hab-bpstat-12533724⟧ million euros, at a rate of ⟦HB:hab-bpstat-12533735⟧ %, according to the Bank of Portugal; the stock of housing credit to private individuals was ⟦HB:hab-bpstat-12557378⟧ million.

**Provas:**
- `bpstat-bportugal-pt-39-vivo.json` (sha256 `d1203b53423903c5…`), json; value[283]; reference_date=2026-08-31; obs_updated_at=2026-11-02T10:30:00Z: «2902.0,2643.0,2759.0]» → valor na fonte **2643.0** [conferido]
- `bpstat-bportugal-pt-38-vivo.json` (sha256 `59d0046a14b798d0…`), json; value[283]; reference_date=2026-08-31; obs_updated_at=2026-11-02T10:30:00Z: «2.97,3.01,3.06]» → valor na fonte **3.01** [conferido]
- `bpstat-bportugal-pt-40-vivo.json` (sha256 `0afcc520b53684c2…`), json; value[560]; reference_date=2026-08-31; obs_updated_at=2026-10-27T10:30:00Z: «118023.4,119061.6,120179.0]» → valor na fonte **119061.6**. inalterado [conferido]
- `hb1e-bpstat-serie-12533724.json` (sha256 `0f1846f7aa0e16bc…`), json; [0].description (metainformação da série, lida a 2026-10-22): «Novas operações de empréstimos (inclui renegociações) à habitação» [conferido]

**Linhas do livro:**
- `ledger/claims/hab-bpstat-12533724.yml`: 2 553,0 → 2 643,0 (releitura da mesma célula (scripts/aplicar-releituras.py))
- `ledger/claims/hab-bpstat-12533735.yml`: 3,0 → 3,01 (releitura da mesma célula (scripts/aplicar-releituras.py))


## C17 · parte B3

Secção 7: «o relatório não define a palavra além dessa nota» é falso: logo antes do Quadro 3.2 (PDF p. 58, «No quadro seguinte…») o relatório descreve as medidas em políticas invariantes como as que, «embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027».

**Português**, `documento.pt.md.tmpl` linha 47 (Markdown composto, linha 73).

Atual:
> (a marca «(i)» é a do quadro do relatório para as medidas que ele classifica como «invariante»; o relatório não define a palavra além dessa nota)

Novo:
> (a marca «(i)» é a do quadro do relatório para as medidas que ele classifica como «invariante», e que descreve, logo antes do quadro, como medidas que, «embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027»)

No gabarito:
> (a marca «(i)» é a do quadro do relatório para as medidas que ele classifica como «invariante», e que descreve, logo antes do quadro, como medidas que, «⟦lit:embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027@hab-oe-invariantes-definicao⟧»)

**English**, `documento.en.md.tmpl` linha 47 (Markdown composto, linha 73).

Atual:
> (the mark «(i)» is the one the report's table gives to the measures it classes as «invariante», unchanged; the report does not define the word beyond that note)

Novo:
> (the mark «(i)» is the one the report's table gives to the measures it classes as «invariante», unchanged, and which it describes, just before the table, as measures that, «embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027», though decided in previous years, still produce additional effects in 2027)

No gabarito:
> (the mark «(i)» is the one the report's table gives to the measures it classes as «invariante», unchanged, and which it describes, just before the table, as measures that, «⟦lit:embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027@hab-oe-invariantes-definicao⟧», though decided in previous years, still produce additional effects in 2027)

**Instalação:** Substitui-se só o parêntese; o ⟦HB:hab-oe-legenda-invariante|cita⟧ que se lhe segue fica, e junta-se ⟦HB:hab-oe-invariantes-definicao|cita⟧. O literal contém «2027»: confirmar que o compositor o aceita dentro de um literal preso (o guia do motor recusa algarismos soltos).

**Provas:**
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 58 (pdftotext -layout -f 58 -l 58): «No quadro seguinte são elencadas as principais medidas de política orçamental a implementar no ano de 2027, bem como as medidas em políticas invariantes que, embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027.» [conferido]
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 58 (pdftotext -layout -f 58 -l 58): «embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027» [conferido]
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 59 (pdftotext -layout -f 59 -l 59): «Quadro 3.2. Principais medidas de política orçamental com impacto em 2027». o quadro começa na página seguinte, PDF p. 59 [conferido]
- `oe-relatorio.pdf` (sha256 `a338bd0084cc5fe2…`), PDF p. 59 (pdftotext -layout -f 59 -l 59): «Nota: (i) invariante.» [conferido]

**Linhas do livro:**
- nova `hab-oe-invariantes-definicao`: as medidas em políticas invariantes que, embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027. (texto; «Relatório do Orçamento do Estado para 2027, texto que antecede o Quadro 3.2»; 2027); prova oe_inv

## C18 · parte B6

Secção 9: o mesmo título com o nome de Pedro Duarte; identifica-se a notícia pelo jornal e pela data.

**Português**, `documento.pt.md.tmpl` linha 59 (Markdown composto, linha 95).

Atual:
> e pela notícia «Manifestantes pela habitação voltam à Praça D. João I e atiram a Pedro Duarte» do Diário de Notícias, «39 feridos, dois deles graves» segundo as contas da organização, e «um polícia ficou ferido» segundo a PSP.

Novo:
> e pela notícia do Diário de Notícias de 15 de outubro, «39 feridos, dois deles graves» segundo as contas da organização, e «um polícia ficou ferido» segundo a PSP.

No gabarito:
> e pela notícia do Diário de Notícias de ⟦lit:15 de outubro@hab-imprensa-feridos39⟧, «⟦HB:hab-imprensa-feridos39|excerto⟧» segundo as contas da organização, e «⟦HB:hab-imprensa-psp-ferido|excerto⟧» segundo a PSP.

**English**, `documento.en.md.tmpl` linha 59 (Markdown composto, linha 95).

Atual:
> and by the Diário de Notícias report «Manifestantes pela habitação voltam à Praça D. João I e atiram a Pedro Duarte», «39 feridos, dois deles graves» by the organisers' count, and «um polícia ficou ferido» according to the PSP.

Novo:
> and by the Diário de Notícias report of 15 October, «39 feridos, dois deles graves» by the organisers' count, and «um polícia ficou ferido» according to the PSP.

No gabarito:
> and by the Diário de Notícias report of ⟦lit:15 October@hab-imprensa-feridos39⟧, «⟦HB:hab-imprensa-feridos39|excerto⟧» by the organisers' count, and «⟦HB:hab-imprensa-psp-ferido|excerto⟧» according to the PSP.

**Instalação:** É uma oração dentro da frase longa que começa em «No Porto, a acampada»; substitui-se só o trecho citado.

**Provas:**
- `imprensa-9.html` (sha256 `ee80288a4412a61c…`), html: «"publisher":{"name":"Diário de Notícias"» → valor na fonte **Diário de Notícias** [conferido]
- `imprensa-9.html` (sha256 `ee80288a4412a61c…`), html: «"datePublished":"2026-10-15T21:24:24+01:00"» → valor na fonte **2026-10-15T21:24:24+01:00** [conferido]

**Linhas do livro:**
- hab-imprensa-feridos39: a data prende-se ao published_at 2026-10-15

**Arrasta:**
- conclusão 6 → C08

## C19 · parte B4

Secção 10: a frase do primeiro-ministro (custos, por cidade, sem período) está posta ao lado do índice nacional dos preços (301,43, 2015=100), que não é a mesma medida, e «mais do que o dobro» diminui um índice que mais do que triplicou. A oração «nenhuma fonte deste estudo dá a subida por cidade» também não se sustenta: o comunicado do INE guardado dá a variação homóloga dos preços por município, e o ficheiro que o acompanha tem a série por município desde o 1.º trimestre de 2019. Diz-se o que difere.

**Português**, `documento.pt.md.tmpl` linha 61 (Markdown composto, linha 99).

Atual:
> «Os aumentos com os custos na habitação foram superiores a 100 por cento na esmagadora maioria das cidades»: o índice nacional dos preços está em 301,43 com 2015 igual a cem, o que é mais do que o dobro; a frase não diz o período, e nenhuma fonte deste estudo dá a subida por cidade.

Novo:
> «Os aumentos com os custos na habitação foram superiores a 100 por cento na esmagadora maioria das cidades»: a frase não diz o período nem que custos mede, e por isso os números deste estudo não a confirmam nem a desmentem; o índice dos preços da habitação do Eurostat, que é do país inteiro e não de cada cidade, estava no segundo trimestre de 2026 em 301,43 com 2015 igual a cem, mais do que o triplo de 2015.

No gabarito:
> «⟦HB:hab-imprensa-debate-custos|excerto⟧»: a frase não diz o período nem que custos mede, e por isso os números deste estudo não a confirmam nem a desmentem; o índice dos preços da habitação do Eurostat, que é do país inteiro e não de cada cidade, estava no segundo trimestre de 2026 em ⟦HB:hab-prc-hpi-q-q-total-i15-q-pt-2026-q2⟧ com 2015 igual a cem, mais do que o triplo de 2015.

**English**, `documento.en.md.tmpl` linha 61 (Markdown composto, linha 99).

Atual:
> «Os aumentos com os custos na habitação foram superiores a 100 por cento na esmagadora maioria das cidades»: the national price index stands at 301.43 with 2015 equal to one hundred, which is more than double; the sentence does not say the period, and no source in this study gives the rise by city.

Novo:
> «Os aumentos com os custos na habitação foram superiores a 100 por cento na esmagadora maioria das cidades»: the sentence does not say the period or which costs it measures, so the numbers in this study neither confirm nor refute it; Eurostat's house price index, which is for the whole country and not for each city, stood in the second quarter of 2026 at 301.43 with 2015 equal to one hundred, more than three times its 2015 level.

No gabarito:
> «⟦HB:hab-imprensa-debate-custos|excerto⟧»: the sentence does not say the period or which costs it measures, so the numbers in this study neither confirm nor refute it; Eurostat's house price index, which is for the whole country and not for each city, stood in the second quarter of 2026 at ⟦HB:hab-prc-hpi-q-q-total-i15-q-pt-2026-q2⟧ with 2015 equal to one hundred, more than three times its 2015 level.

**Aritmética:**
- 301.43 / 100 = 3.0143 → 3.0143

**Provas:**
- `prc_hpi_q-vivo.json` (sha256 `139967be9abc6524…`), json; value[1011]; freq=Q; purchase=TOTAL; unit=I15_Q; geo=PT; time=2026-Q2: «"1011":301.43,» → valor na fonte **301.43** (purchase: Total; unit: Quarterly index, 2015=100; geo: Portugal; time: 2026-Q2); conjunto atualizado 2026-10-01T11:00:00+0200. inalterado na auditoria [conferido]
- `hb1d-ine-precos-q2.pdf` (sha256 `9f3176072c9399b6…`), PDF p. 1 (pdftotext -layout -f 1 -l 1): «os preços da habitação aceleraram (isto é, registaram aumentos nas taxas de variação homóloga) em 10 dos 24 municípios com mais de 100 mil habitantes». o INE dá a variação por município: a oração antiga não se sustenta [conferido]

**Linhas do livro:**
- hab-prc-hpi-q-q-total-i15-q-pt-2026-q2: nenhuma; «mais do que o triplo» é 301,43 / 100 = 3,0143 > 3, como o «mais do que o dobro» antigo, sem linha própria. Se a casa quiser a razão como linha: nova derivada round(301,43 / 100, 2) = 3,01.

**Arrasta:**
- secção 9, a frase citada. nenhuma: só a cita

## C20 · parte A

Cartão do estudo (src/data/leituras.mjs): a medida imprime hab-tipsho60-a-ptir-i15-pt-2024 (144,34) «com 2015 igual a cem, o mais alto da União»; a base deixou de existir. Imprime-se a subida de 2015 a 2025 (60,8 %), a maior da União.

**Onde:** `src/data/leituras.mjs`, linhas 118-136.

**Atual:**
```js
      {
        "claim": "hab-tipsho60-a-ptir-i15-pt-2024",
        "nome": {
          "pt": [
            "é o rácio entre os preços das casas e o rendimento em Portugal, com ",
            {
              "ref": "2015"
            },
            " igual a cem, o mais alto da União"
          ],
          "en": [
            "is the ratio of house prices to income in Portugal, ",
            {
              "ref": "2015"
            },
            " equal to one hundred, the highest in the Union"
          ]
        }
      },
```

**Novo:**
```js
      {
        "claim": "der-hab-preco-rendimento-2015-2025-pt",
        "nome": {
          "pt": [
            "é quanto subiu em Portugal, de ",
            {
              "ref": "2015"
            },
            " a ",
            {
              "ref": "2025"
            },
            ", o rácio entre os preços das casas e o rendimento, a maior subida da União"
          ],
          "en": [
            "is how much the ratio of house prices to income rose in Portugal from ",
            {
              "ref": "2015"
            },
            " to ",
            {
              "ref": "2025"
            },
            ", the largest rise in the Union"
          ]
        }
      },
```

Mostra: PT «60,8 % é quanto subiu em Portugal, de 2015 a 2025, o rácio entre os preços das casas e o rendimento, a maior subida da União»; EN «60.8 % is how much the ratio of house prices to income rose in Portugal from 2015 to 2025, the largest rise in the Union». inferido: o cartão imprime o valor com a unidade da linha (como 6,3 % nas outras medidas); a linha derivada nova tem de ter unidade «%». Se o cartão não aceitar uma linha derivada como medida, a alternativa é mostrar o rácio de 2025 face à média de longo prazo (136,97, o mais alto dos vinte e sete).

**Aritmética:**
- 100.00 / 62.17 × 100 − 100 = 60.849284220 → 60.8

**Provas:**
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[550]; freq=A; unit=PTIR_I25; geo=PT; time=2015: «"550":62.17,» → valor na fonte **62.17** (unit: Price-to-income ratio, index 2025=100; geo: Portugal; time: 2015); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]
- `tipsho60-vivo.json` (sha256 `d927257f2556a0bb…`), json; value[560]; freq=A; unit=PTIR_I25; geo=PT; time=2025: «"560":100.00,» → valor na fonte **100.00** (unit: Price-to-income ratio, index 2025=100; geo: Portugal; time: 2025); conjunto atualizado 2026-11-03T11:00:00+0100 [conferido]

**Linhas do livro:**
- der-hab-preco-rendimento-2015-2025-pt: nova, a mesma de C02

**Arrasta:**
- leituras.mjs, frase do cartão → C04 (valor da União pela releitura) e C06 (decisão sobre «e sobre os jovens»)
