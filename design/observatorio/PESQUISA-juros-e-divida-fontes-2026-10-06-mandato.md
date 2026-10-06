You are doing source research for O Estado do País, a Portuguese public-data observatory where every number on the site must trace to an official primary source with a verbatim excerpt, a date and a stable address. You have network access through the shell (curl, python3). You change nothing anywhere; you only read and write one report file, `relatorio.md`, in the folder you were started in. Write the report in Portuguese (European, Acordo Ortográfico, no dashes «—» in prose). Every URL you cite must be one you actually fetched in this session, with the HTTP status you got and the date; if you could not fetch something, say so instead of describing it from memory.

## The question

The site will publish an explainer titled «Porque é que o Estado se endivida e quanto custa» (why the State borrows and what it costs). For that it needs ledger rows, with full provenance, for Portugal on these things:

1. **What the State pays in interest each year** (despesa com juros das administrações públicas): the annual amount in euros and as a share of GDP, the latest years available, and the monthly or year-to-date execution figure for 2026 if published (DGO's execution bulletins, «Síntese de Execução Orçamental», the line for juros e outros encargos; INE's national accounts; Eurostat `gov_10a_main` item D41 for Portugal; Banco de Portugal).
2. **The average cost of the debt** (custo médio da dívida direta do Estado, taxa de juro implícita) and the stock of direct State debt, as IGCP publishes them (the monthly bulletin «Boletim Mensal», the «Dívida Direta do Estado» tables, the «Custo da Dívida» indicators), with the exact table and field names.
3. **The yield on the 10-year bond** (taxa de rendibilidade das obrigações do Tesouro a 10 anos): Banco de Portugal's BPstat series and Eurostat `irt_lt_mcby_m` for Portugal, monthly, with the series codes.
4. **How much the State borrowed in the year** (necessidades de financiamento, emissões de dívida) as IGCP and DGO publish it.

For each: the publisher, the exact address of the document or the API call, the format (CSV, JSON, XLSX, PDF), the periodicity, the latest period available and its value as printed (copy the number exactly as the source writes it, with the unit), the licence or reuse terms if stated, and whether a machine-readable, stable address exists that a script could re-read every week. Prefer machine-readable sources (Eurostat JSON-stat API, BPstat API, dados.gov.pt datasets, DGO's XLSX) over PDFs, but report the PDFs too when they are the only source. Also say which of these the Eurostat API already serves for Portugal with the dataset code and the dimension codes, because the engine already has a sealed client for Eurostat's JSON-stat API.

## How to report

Under 2 000 words. A table per item (publisher, address, format, periodicity, latest period, value as printed, fetched on, HTTP status). Then one section «O que a explicação pode dizer com estes números» with the sentences the data would support, each tied to a row above, and one section «O que não se encontrou» for what you could not fetch or confirm. Do not estimate or recall numbers: a number without a fetched source is not written.
