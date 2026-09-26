# Memorando das fontes do RP2 (26.09.2026): as seis medidas dos rendimentos e dos preços fora das APIs do INE e do Eurostat já em uso

*Reconhecimento das fontes feito por um agente do Claude Opus 5.5 a pedido do lugar de direção, a 26.09.2026 entre as 16:22 e as 16:45 UTC, com cada página ou documento lido nesse momento (curl e WebFetch) e cada afirmação rotulada VERIFIED, INFERRED ou NOT VERIFIED (`[verify]`). Nenhum número daqui entra no sítio sem o pedido do cliente da casa: o construtor do RP2 volta a ler cada fonte e sela o que ela disser nesse dia. Os ficheiros em bruto ficaram no scratchpad da sessão e não entram no repositório. O lugar de direção usou-o para o brief do RP2. Sem travessões acrescentados; o texto do agente fica como ele o escreveu, em inglês.*

# RP2 source reconnaissance: six measures outside the INE/Eurostat APIs in use

For the editorial seat, 2026-09-26, by a research subagent (Claude Opus 5.5). All fetches ran today, 16:22 to 16:45 UTC, with curl unless marked WebFetch; raw files are in the scratchpad `rp2/`. Labels: VERIFIED (fetched today, excerpt quoted), INFERRED (deduced from fetched material), NOT VERIFIED (`[verify]`).

## 1. Minimum wage (RMMG), 2015 to 2026

**Publisher.** Diário da República (INCM). DGERT keeps a cross-index, "Evolução da Remuneração Mínima Mensal Garantida (RMMG)": https://www.dgert.gov.pt/evolucao-da-remuneracao-minima-mensal-garantida-rmmg (16:24Z, "Atualizado 26 Maio, 2026"). VERIFIED.

**2026, mainland.** VERIFIED. Decreto-Lei n.º 139/2025, de 29 de dezembro (1.ª série, N.º 249), PDF https://files.diariodarepublica.pt/1s/2025/12/24900/0001400016.pdf (16:24Z). Art. 2.º: "O presente decreto-lei é aplicável a todo o território continental." Art. 3.º: "é de € 920,00". Art. 7.º: "produz efeitos no dia 1 de janeiro de 2026." This matches the 920 € card already on the site.

**2015 to 2025.** VERIFIED: I fetched each PDF through its ELI (16:25Z) and found the value in the text.

| In force | Diploma | Value as written |
|---|---|---|
| 2015 | DL 144/2014, 30.09 (from 1.10.2014) | "€ 505"; preamble: "entre 1 de outubro de 2014 e 31 de dezembro de 2015" |
| 2016 | DL 254-A/2015, 31.12 | € 530 |
| 2017 | DL 86-B/2016, 29.12 | € 557 |
| 2018 | DL 156/2017, 28.12 | € 580 |
| 2019 | DL 117/2018, 27.12 | € 600 |
| 2020 | DL 167/2019, 21.11 | € 635 |
| 2021 | DL 109-A/2020, 31.12 | € 665 |
| 2022 | DL 109-B/2021, 07.12 | € 705 |
| 2023 | DL 85-A/2022, 22.12 | € 760 |
| 2024 | DL 107/2023, 17.11 | € 820 |
| 2025 | DL 112/2024, 19.12 | € 870,00 |

**Machine route.** VERIFIED (16:24 to 16:26Z).
- ELI resolves. `https://data.dre.pt/eli/dec-lei/139/2025/12/29/p/dre/pt/html` redirects to `https://diariodarepublica.pt/dr/detalhe/decreto-lei/139-2025-992879809`. The same path ending in `/pt/pdf` redirects to the official PDF. Pattern: `dec-lei/{n}/{yyyy}/{mm}/{dd}/p/dre/pt/{html|pdf}`, with letters in lower case (`254-a`).
- The detail page is a JavaScript shell (2 346 bytes, no "920"): read the PDF.
- `/pt/xml`, and any malformed ELI, redirect to `https://diariodarepublica.pt/dr/error` with HTTP 200. A scraper must check the final URL or the content type, not the status code.
- No documented DRE API found (one web search showed only third-party scrapers). NOT VERIFIED that none exists.

**Regions.**
- Madeira has its own diploma each year. VERIFIED: Decreto Legislativo Regional n.º 1/2026/M, 3.02.2026, ELI `declegreg/1/2026/02/03/m/dre/pt/pdf`, PDF https://files.diariodarepublica.pt/1s/2026/02/02300/0001400015.pdf (16:26Z). It says "é de € 980,00" and "produz efeitos a 1 de janeiro de 2026", and it revokes the earlier diploma: "É revogado o Decreto Legislativo Regional n.º 20/2024/M". I did not fetch Madeira's values for 2015 to 2025 `[verify]`.
- The Azores have no yearly diploma. VERIFIED: art. 3.º of DLR 8/2002/A, as republished by DLR 37/2023/A (https://files.diariodarepublica.pt/1s/2023/10/20400/0001400020.pdf, 16:26Z), says the RMMG "tem, na Região Autónoma dos Açores, o acréscimo de 5 %." That makes 2026 920 × 1,05 = 966 € (INFERRED: the regional portal returned HTTP 403). I did not check for amendments after 20.10.2023 `[verify]`.

**Terms.** VERIFIED. DL 83/2016, art. 3.º (ELI PDF, 16:27Z): "O acesso universal e gratuito compreende a possibilidade de impressão, arquivo, pesquisa e livre acesso ao conteúdo dos atos publicados nas 1.ª e 2.ª séries".

**Blockers.** None if sealed from the PDF. The "Âmbito territorial" article (mainland) appears from DL 109-B/2021 onwards; a text search did not find it in the 2014 to 2020 texts (INFERRED: the two-column layout could hide it).

## 2. Share of workers paid the RMMG

**Publisher.** DGCP (Direção-Geral de Coordenação e Planeamento, MTSSS). `https://www.gep.mtsss.gov.pt/trabalho` now redirects to `https://www.dgcp.mtsss.gov.pt/inicio` (16:27Z). VERIFIED at https://www.dgcp.mtsss.gov.pt/o-sen (16:31Z): "O ex-GEP, antecessor da DGCP, era uma entidade com delegação de competências do Instituto Nacional de Estatística (INE)".

**Table.** VERIFIED. "Série Quadros de Pessoal 2014-2024", posted 14/05/2026, as XLSX https://www.dgcp.mtsss.gov.pt/documents/10182/10928/seriesqp_2014_2024.xlsx/d0805880-6aef-4eb1-8602-56c1b8a989a1 and PDF (16:29Z).
- The table is "Quadro 21 - Trabalhadores por conta de outrem (1) ao serviço nos estabelecimentos por escalão de remuneração mensal base", Continente.
- Row "= RMMG" for 2024: 511.554 workers, "20,4" % in the PDF. Earlier years: 2023 20,6; 2022 23,3; 2020 23,9; 2014 20,4.
- Note (1) defines the workers as "trabalhadores por conta de outrem a tempo completo, que auferiram remuneração completa no período de referência."
- Reference month, from "Quadros de Pessoal 2024 - Síntese" (19/12/2025): "é relativa ao Continente e tem como referência o mês de outubro." The series is annual; the latest point is October 2024.

**Traps.**
- **Base pay or earnings.** Quadro 32 counts by remuneração ganho and gives "= RMMG" at 4,0 % for 2024. The seat must pick base pay equal to the RMMG and say so on the page.
- **Mainland only, and not all employers.** The Introdução sheet says services whose workers are all under the "Regime do Contrato de Trabalho em Funções Públicas" "ficam, portanto, excluídos."
- **Dead series.** The monthly "Boletim Estatístico" (latest "Agosto 2026", XLSX) lists "Percentagem dos TCO a tempo completo abrangidos pela RMMG", but that figure comes from the Inquérito aos Ganhos, whose "Último período de referência" is "1.º sem. 2019". The survey's last edition is "Ganhos Abril 2019". The dedicated monitoring reports stop at the "10º Relatório" (novembro 2018) and a "Síntese" dated 12 de novembro de 2019. INFERRED: all of these series have stopped.
- **Official status.** The SEN page speaks of the GEP's INE delegation in the past tense; whether the DGCP still holds it is open `[verify]`.

**Terms.** None stated; the footer reads "© Instituto de Informática, IP. Todos os direitos reservados." (VERIFIED).

**Blockers.** No login. File URLs carry a UUID; one UUID-less path also answered HTTP 200, so a stable pattern is INFERRED.

## 3. Eurostat minimum-wage comparison

All VERIFIED (16:22 to 16:23Z, HTTP 200 for both datasets).
- **`earn_mw_cur`**, "Monthly minimum wages - bi-annual data". Dimensions `freq, currency, geo, time`; the series starts 1999-S1; updated "2026-07-31T11:00:00+0200". Portugal, 2026-S2: EUR 1073, PPS 1240 (flag "e", estimated), NAC 1073.
- **The conversion.** Eurostat's metadata (https://ec.europa.eu/eurostat/cache/metadata/en/earn_minw_esms.htm, WebFetch 16:23Z) gives the formula "(monthly rate x 14) / 12", with reference dates "1 January (S1) and 1 July (S2)". So 920 × 14 / 12 = 1 073,3. INFERRED: the same arithmetic reproduces every year from 2015 to 2026 in item 1.
- **`earn_mw_avgr2`**, "Monthly minimum wage as a proportion of average monthly earnings (%) - NACE Rev. 2 (from 2008 onwards)". Dimensions `freq, unit, nace_r2, indic_se, geo, time`. Portugal, 2026 (annual, every value flagged "p", provisional): B-S `MMW_MEAN_ME_PP` 55.65 and `MMW_MED_ME_PP` 71.23; B-N 55.28 and 71.48.
- **Terms.** https://ec.europa.eu/eurostat/web/main/help/copyright-notice (WebFetch, about 16:24Z): "Reuse of statistical data, metadata, publications, and other dissemination tools published on this website for commercial or non-commercial purposes is authorised provided the source is acknowledged."
- **Blocker.** The EUR figure is the RMMG spread over 12 months; never show it beside 920 € without saying so.

## 4. Household electricity and gas bills

**ERSE "typical bill" in the regulated market.** VERIFIED. These come from press-release PDFs, for mainland Portugal; the electricity bills "incluem taxas e impostos (exceto taxa DGEG)".
- **Electricity from January 2026** (https://www.erse.pt/media/5dypdjby/comunicado-tarifas-ele_2026.pdf, 16:31Z): "Casal sem filhos (potência 3,45 kVA, consumo 1900 kWh/ano) 36,82 €" and "Casal com dois filhos (potência 6,9 kVA, consumo 5000 kWh/ano) 95,03 €".
- **Electricity from 1 October 2026**, release dated "Lisboa, 15 de setembro de 2026" (https://www.erse.pt/media/4fkf3okn/comunicado_atualiza%C3%A7%C3%A3o-tenergia-ele-2026-t4.pdf, 16:32Z): 37,77 € and 97,73 €. The mechanism behind the change: "A ERSE monitoriza, em base trimestral, a adequação da tarifa de Energia", which here meant a rise of "+0,005 euros por kWh".
- **Gas for the "ano gás 2026-2027"** (1.10.2026 to 30.09.2027), release dated 1 de junho de 2026 (https://www.erse.pt/media/aipj3ub0/comunicado-decis%C3%A3o-tarifas-g%C3%A1s-2026-2027.pdf, 16:32Z): "Casal sem filhos (1.º escalão de consumo, consumo 1 610 kWh/ano) 17,38 €" and "Casal com dois filhos (2.º escalão de consumo, consumo 3 407 kWh/ano) 32,53 €". Whether gas has a quarterly review like electricity is open `[verify]`.

**Machine route.** VERIFIED.
- The tariff tables are XLSX files, for example https://www.erse.pt/media/wbxljhas/s_tarifas_net_outubro-2026.xlsx ("atualizado em: 15/setembro/2026"). It has sheets for the mainland, "TVCF_RAA" and "TVCF_RAM". From 1.10.2026, BTN ≤20,7 kVA: "Tarifa simples" 0.1711 EUR/kWh, and 6,9 kVA 0.3659 EUR/dia. Whether these tables include taxes is open `[verify]`.
- The typical bills exist only inside the PDFs. File URLs sit in random folders, found from https://www.erse.pt/atividade/regulacao/tarifas-e-precos-eletricidade/.

**Offers and simulator.**
- VERIFIED: the quarterly "Boletim das Ofertas Comerciais de Eletricidade - 3.º trimestre de 2026" and its full offer lists are PDFs.
- VERIFIED: the simulator page links "Metadata da informação das ofertas comerciais (xlsx)", which describes two tables, "Precos_ELEGN" and "CondComerciais". The simulator's JavaScript also tracks clicks on a `.csvPath` element.
- INFERRED: a CSV export of the offers probably exists. I did not find its URL `[verify]`, which needs a browser.

**Representativeness.** VERIFIED (Q4 release): the regulated market has "779 mil clientes, em junho de 2026, que representam cerca de 4,6% do consumo total de eletricidade", so its typical bill is a reference, not what most households pay.

**Terms.** The electricity tariffs page links only to a privacy policy (VERIFIED). No reuse licence found `[verify]`.

**Eurostat.** VERIFIED (16:23Z).
- **`nrg_pc_204`**, "Electricity prices for household consumers - bi-annual data (from 2007 onwards)". Dimensions `freq, siec, nrg_cons, unit, tax, currency, geo, time`. Portugal 2025-S2, `KWH2500-4999` (band DC), `I_TAX`, EUR/kWh: 0.2435 (2025-S1: 0.239).
- **`nrg_pc_202`**, "Gas prices for household consumers - bi-annual data (from 2007 onwards)". Same dimensions; the unit is KWH or GJ_GCV. Portugal 2025-S2, `GJ20-199` (band D2), `I_TAX`, EUR/kWh: 0.1405.
- Latest period for both: 2025-S2 (updated 2026-09-24); 2026-S1 is not out.

## 5. Fuel prices at the pump (DGEG)

**Weekly statistics.** VERIFIED. The page https://www.dgeg.gov.pt/pt/estatistica/energia/precos-de-energia/precos-de-combustiveis-em-portugal-continental/ (16:35Z) says "Semanais - atualizado todas as terças-feiras às 17h00 (salvo exceções)".
- Today's XLSX: https://www.dgeg.gov.pt/media/dpshdwmw/dgeg-pcr-2004-2026_39_pt.xlsx ("Última atualização: 22 de Setembro de 2026").
- Its sheet "Histórico UE" is a flat weekly table from 2015-04-20 onwards, labelled "Informação enviada à Comissão Europeia (Weekly oil bulletin)". It gives Monday prices for mainland Portugal in €/litro, split into PST, ISP+Out., IVA and PVP.
- Week of 2026-09-21: Gasolina 95 PVP 2.107; Gasóleo rodoviário 2.21.
- **Blocker:** the file URL changes every week (random folder plus week number), so the page must be read each time to find the link.

**The portal.** VERIFIED. https://precoscombustiveis.dgeg.gov.pt/ runs its own pages on an undocumented JSON API: `urlGlobal = 'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb'`.
- `GET /api/PrecoComb/PMD?idsTiposComb=3201,2101&dataIni=2026-09-19&dataFim=2026-09-26` (16:39Z) returned daily averages.
- For 2026-09-25: "Gasóleo simples" "PrecoMedio":"2,220 €", "PrecoMedioSDesc":"2,278 €", "DescPadrao":"0,071 €", from 1864 stations; "Gasolina simples 95" "PrecoMedio":"2,115 €".
- INFERRED from one date: the weekly PVP matches `PrecoMedio`, not `PrecoMedioSDesc`. What the discount is remains open `[verify]`.

**Terms.** VERIFIED at https://precoscombustiveis.dgeg.gov.pt/apresentacao/ (16:36Z): "A informação disponível neste sítio é gratuita, podendo ser utilizada livremente. É proibida a sua utilização para fins comerciais."
- A structured feed per station requires a signed "Partilha de Informação" sent to the Director-General; DGEG then sends "as credenciais de acesso ao Portal".
- The statistics site's footer says "Copyright 2026. All Rights Reserved.", and its "Termos e condições" page contains no text.

**dados.gov.pt.** VERIFIED (16:40Z). DGEG's 19 datasets there (all cc-by, last modified 2023-11-02) include no prices, only "Postos de Abastecimento de Combustíveis para Veículos Rodoviários"; a search for "combustiveis" (16 results) found no pump prices.

**Blockers.** The non-commercial clause and the credentials (a request in the project's name) are the director's call. The weekly XLSX needs no login.

## 6. Mortgage instalment and interest rate

**BPstat (Banco de Portugal).** VERIFIED.
- The API documentation is at https://bpstat.bportugal.pt/data/docs ("BPstat Data API"), with the OpenAPI file at `https://bpstat.bportugal.pt/data/docs/?format=openapi`. Base URL: `https://bpstat.bportugal.pt/data/v1/`.
- Observations come from `/data/v1/domains/{domain_id}/datasets/{dataset_id}/?series_ids=..&obs_last_n=..` as JSON-stat; series metadata from `/data/v1/series/?series_ids=..`.
- The API is rate-limited: requests over the limit "are guaranteed to be answered with HTTP status `429`".
- **Instalment.** Series 12710797, "Average monthly repayment of the stock of loans for permanent residential property" (domain 186, dataset d45bb68e792a6b1b2fc36d6a90da4f20), in euros, monthly, Portugal: 2026-05 432.0; 2026-06 436.0; 2026-07 441.0. The median is series 12710744: 355.0 in 2026-07.
- **Interest rate.** Series 12519762, "Interest Rate-Loans-Individuals MU-House purchase (Stocks)", metric "Annualized agreed rate", in % (domain 21, dataset 851facff504532e95cf096ca9c6a8b9a): 3.17 in 2026-07. The rate on new business (series 12533735) is 2.96.
- Updated "2026-09-02T09:30:00Z"; latest month July 2026.
- **Terms.** Not read. The "Avisos legais" page (https://bpstat.bportugal.pt/avisos-legais) renders only with JavaScript, and bportugal.pt returned 403. The licence needs a browser `[verify]`.

**INE alternative.** VERIFIED (JSON API, 16:44Z; "DataUltimaAtualizacao" 2026-09-18).
- Indicator 0006342, "Prestação média vencida (Série 2012 - €) nos contratos de crédito à habitação ...". Total for August 2026: "418" (July: 414).
- Indicator 0006340, "Taxa de juro implícita (Série 2012 - %)": August 3,162 (July: 3,135).

**Trap.** For July 2026 there are two official "average instalments": 441 € from the BdP and 414 € from the INE. The rates also differ: 3.17 % and 3,135 %. INFERRED: they measure different populations with different definitions. The seat must choose one and label it.

## Summary

| # | Item | Source | Route | Latest period | Licence | Blockers | Label |
|---|---|---|---|---|---|---|---|
| 1 | RMMG, mainland, 2015 to 2026 | DRE via ELI; DGERT index | PDF (ELI `/pt/pdf`) | 2026: 920 € (DL 139/2025) | DL 83/2016, free access | HTML is JS-only; a bad ELI returns 200 | VERIFIED |
| 1b | RMMG, Azores and Madeira | DLR 8/2002/A (+5 %); DLR 1/2026/M | PDF | 2026: 966 € (derived), 980 € | as row 1 | Azores value is derived; Madeira history not read | Madeira VERIFIED; Azores INFERRED |
| 2 | Share of workers at the RMMG | DGCP (ex-GEP), Quadros de Pessoal, Quadro 21 | XLSX/PDF download | October 2024: 20,4 % | none stated ("Todos os direitos reservados") | mainland, October; base pay vs earnings; INE delegation `[verify]` | VERIFIED |
| 3 | Eurostat minimum wage | `earn_mw_cur`, `earn_mw_avgr2` | JSON API | 2026-S2; 2026 (provisional) | reuse allowed with the source named | 14/12 conversion; provisional ratio | VERIFIED |
| 4a | ERSE typical bills | ERSE releases; tariff XLSX | PDF + XLSX | electricity from 1.10.2026; gas 2026-2027 | not found `[verify]` | bills only in PDF; regulated market is 4,6 % of consumption; CSV of offers `[verify]` | VERIFIED (CSV NOT VERIFIED) |
| 4b | Eurostat energy prices | `nrg_pc_204`, `nrg_pc_202` | JSON API | 2025-S2 | as row 3 | none | VERIFIED |
| 5 | Fuel prices | DGEG weekly XLSX; portal JSON | download; undocumented API | week of 21.09.2026; day 25.09.2026 | portal: "proibida a sua utilização para fins comerciais" | weekly URL changes; API undocumented; station feed needs credentials | VERIFIED |
| 6a | Mortgage (BdP) | BPstat 12710797, 12519762 | JSON API | July 2026 | `[verify]` | 429 rate limit; licence not read | VERIFIED (licence NOT VERIFIED) |
| 6b | Mortgage (INE) | 0006342, 0006340 | JSON API | August 2026 | INE terms (already in use) | differs from the BdP figure | VERIFIED |
