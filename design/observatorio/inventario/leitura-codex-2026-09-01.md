# Leitura a frio (Codex) do inventário das fontes e da carta dos conteúdos

*01.09.2026. Leitor: OpenAI Codex `gpt-5.6-sol`, esforço xhigh, 15 minutos e 54 segundos, `codex exec -s read-only --ephemeral`, sem rede, numa pasta fora dos dois repositórios com a carta, o inventário (a primeira versão, gerada às 09:01 UTC), o JSON e os quatro relatórios dos lotes. Três plantas registadas por sha256 e contexto antes e depois em `../INVENTARIO-DAS-FONTES.plantas.json`: P1 (M2: o último período trocado para 2025 contra a publicação de 2024), P2 (a educação posta na segunda vaga na tabela de §4 da carta), P3 (a data do PISA trocada para outubro na tabela-resumo do lote 4). Sem travessões na prosa desta cabeça; o relatório fica tal como veio, em inglês.*

## Triagem do lugar de direção

| achado | conferido | o que se fez |
|---|---|---|
| Major 1 (educação na segunda vaga), Blocking 16 (PISA em outubro) | **plantas** (P2, P3) | nada no repositório |
| P1 (M2, 2025 contra 2024-09-20) | **planta não apanhada** | registada como falha da classe «datas incoerentes dentro de uma linha da tabela»; passa à construção se falhar de novo |
| Blocking 1 (436 células truncadas) | **real**, do gerador `fundir.py` | o gerador deixou de truncar; §2.1 traz cada linha por inteiro |
| Blocking 2 (oito «verificada» com `[verify]`) | **real**, rótulos dos lotes copiados sem regra | o estado passa a ser calculado pela regra de §0, com o declarado ao lado |
| Blocking 3 (a frase das catorze linhas; recomendações contra a regra) | **real**, do lugar de direção | §5 reescrito com a contagem por programa (treze só com calendário ou licença) e a regra dita; A3 entra como a medida certa; S2, S5 e D5 esperam |
| Blocking 4 (uma pergunta, uma medida) | **real** | a regra passa a admitir duas medidas ditas (a) e (b) na mesma linha; §5 recomenda por medida |
| Blocking 5 (a fonte primária) | **real** | o título de §2 deixou de dizer «primária»; a coluna «lido em» diz o domínio aberto em cada linha; §4 lista as linhas lidas em redistribuidor |
| Blocking 6 a 15 (E5, T2, T4, T5, S5, A1, A4, H1, H2, H5) | **reais** | a carta corrigida célula a célula; §5 diz o que falta em cada uma |
| Major 2, 3 (três a cinco; «seis domínios») | **reais** | a carta emendada em §0 e §4 |
| Major 4 (IFR5 em falta) | **real** | a candidata acrescentada |
| Major 5 a 15 (M1/M2, M4, M6, S2, S3, A3, T1, T3, D1/D4, D2/D3, H4) | **reais** | a carta e §5 emendados |
| Major 16 (P2, P5, E2 em §5) | **real** | §5 emendado |
| Major 17, 18 (a data lida é a da atualização; D5 sem data) | **reais** | §0 diz o que a coluna é; D5 em §5 |
| Major 19 (o carimbo de geração e o «09:35 UTC») | **real** | o relatório do lote 2 errou a hora; §4 usa as durações do harness |
| Major 20 a 24 (valores sem excerto; P1; M3; «30 %»; «verbatim») | **reais**, dos lotes | assinalados linha a linha em §2.1 («números do valor recente que não estão no excerto») e em §4; não se corrigem os relatórios dos lotes, que são registo |
| Major 25 (GOV5, JUS4) | **real** | as candidatas emendadas |
| Major 26 (ficheiros fora do pacote) | por desenho | a leitura é a frio; fica dito |
| Major 27 (a licença do INE entre lotes) | **real** | §5 assume a leitura do mesmo dia |
| Major 28 (os papéis dos publicadores) | **real** | dito em §4 |
| Minor 1 a 5 | reais | «sete dias» em §5; o resto dito em §4 |

## O relatório, tal como veio

## Blocking

1. **The rendered first-wave table is unusably truncated.**  
   File: `INVENTARIO-DAS-FONTES.md`, §2, rows E1–H5.  
   Quoted examples: `"parcial (coluna 7 com [verify]; limiar confirmado pelo Euro…"` and `"verificada (com [verify] em duas células: a data exata do p…"`.  
   All 41 rows contain truncation. I counted 436 truncated cells, including 17 `estado` cells. The omitted text includes qualifications, territorial limits, licences, excerpts and reasons why rows are partial. The complete text exists in `INVENTARIO-DAS-FONTES.json`; the Markdown must render it or link to it before it can be the director’s decision table.

2. **Eight rows are labelled `verificada` while still containing `[verify]`.**  
   Files: `INVENTARIO-DAS-FONTES.md` §0 and §2; JSON rows E5, D1, D2, D3, D4, H3, H4, H5.  
   Definition quoted from §0: `"verificada (todas as colunas lidas hoje)"`. Contradictory examples include `"D1 ... verificada (com [verify] em duas células...)"` and `"H5 ... verificada (com [verify] ... e uma ressalva de unidade)"`. E5 is simply labelled `"verificada"` although its comparison cell ends with `[verify]`.  
   Under the inventory’s own definition, the maximum internally supportable count is 12 verified, 28 partial and 1 wrong, not `"verificada: 20 · parcial: 20"`.

3. **§5’s readiness calculation is false and its recommendations violate its own gate.**  
   File: `INVENTARIO-DAS-FONTES.md`, §5.  
   Quote: `"em catorze, o único [verify] é a data da próxima difusão ... essas catorze contam como prontas"`. Literal inspection finds only E3 and A5 among the 20 partial rows with `[verify]` confined to the calendar field. Other rows have unresolved publisher, definition, geography, licence, primary-source access, series or value questions.  
   The same section says partial rows enter `"só depois de fechadas"`, but recommends entry for T5, S3, S4, S5, A4, A5 and others without closing them; it even recommends A3, whose state is `errada`. These cannot be presented as ready choices.

4. **The claimed one-question/one-measure decision model is not implemented.**  
   Files: `CARTA-DOS-CONTEUDOS.md`, §0–§1; `INVENTARIO-DAS-FONTES.md`, title and §§2–3.  
   Quotes: `"cada pergunta tem uma medida"` and `"uma linha por medida candidata"`.  
   Clear bundles of distinct measures occur in T2, T4, M3, M6, S2, S3, D3, H1 and H5. Later-wave examples include HAB4, INV1, INV3, INV4, IFR1, AMB3, AMB4, AMB5 and JUS5. The recommendation invents `T4a` and `T4b`, but the actual inventory has only T4. The director therefore cannot accept one bundled measure and reject the other.

5. **The blanket claim of primary-source verification is false.**  
   Files: `INVENTARIO-DAS-FONTES.md`, heading to §2; all four lot reports, opening statements.  
   Quote: `"A primeira vaga, verificada na fonte primária"` and, for example, `lote-3.md`: `"Verificação na fonte primária"`.  
   Several current values were read only from a redistributor or compiler:

   - E1–E3, T1 and T2(a): primary labelled INE, value URL is Eurostat.
   - T3 and T4(a): primary labelled GEP, value URL is INE.
   - M4’s current value: Eurostat, not the stopped INE publication.
   - M5: AIMA attribution is inferred; the 2025 value is Eurostat’s.
   - M6: ISS produces the data, but only the Observatório das Migrações publication was read.
   - S1: IGFSS data read through Entidade Orçamental.
   - S2: IGFCSS data and CFP calculations read only from CFP.
   - S3/S4: Instituto de Informática data read through INE.
   - S5: the Diário da República was not readable; an IDiPD-hosted copy was used.
   - A5: EEA is called primary, but the value and licence are Eurostat’s.
   - D2/D3 municipal values: DGEEC data read through INE.

   These may still be usable secondary publications, but they are not what the heading claims. The rows must say which publication was actually verified.

6. **E5 is not a complete 308-municipality national value.**  
   Files: charter E5; inventory E5.  
   Quotes: charter `"sim, 308"`; inventory excerpt `"TOTAL (Universo: 307 municípios)"`; value cell `"País, 2024"`.  
   Penedono is `N.d.`. Correct wording: the table covers 308 municipalities but the published total has data for 307. The charter also promises `"a contagem nacional de municípios acima do limite"`, while E5 says that count is `[verify]`.

7. **T2 does not establish 308-municipality coverage or a country total.**  
   Files: charter T2; inventory T2.  
   Quotes: charter `"sim, 308 (dois publicadores para as ilhas, dito)"`; inventory `"sim, 278, só o Continente"` and `"Açores ... e Madeira ... ficam [verify]"`. Its comparison cell calls the Continente total `"o país"`.  
   Correct value from the files: 278 mainland municipalities; island coverage is unverified; the aggregate is Continente, not Portugal.

8. **T4’s municipal candidate is the wrong measure.**  
   Files: charter T4; inventory T4 and §5.  
   Quotes: charter `"disparidade no ganho médio mensal entre sexos por concelho"`; inventory `"é um coeficiente de variação ... não diz quem ganha mais"`.  
   Correct conclusion: no municipal gender pay-gap measure was verified. The national hourly gender pay gap is a separate Eurostat measure and requires its own row.

9. **T5 is wrongly framed as national and as read from the Diário da República.**  
   Files: charter T5; inventory T5 and §5; `lote-1.md` T5.  
   Quotes: charter `"não (é nacional)"`; inventory `"o valor não é sequer nacional ... território continental"`; recommendation `"o decreto-lei lido no DR"`.  
   Correct: €920 applies to mainland Portugal; Azores and Madeira values remain `[verify]`. The text was obtained through `dre.pt/application/...`, not the cited `diariodarepublica.pt` page.

10. **S5 does not answer the charter’s current-age question.**  
    Files: charter S5; inventory S5 and §5.  
    Quotes: charter `"a idade em vigor é o próprio limiar"`; recommendation `"entra ... 66 anos e 11 meses em 2027"`; row value `"Para 2026 ... o valor fica [verify]"`.  
    On 1 September 2026, the in-force 2026 age is the requested value, and it was not verified. The files only verify the future 2027 value. No correct 2026 value can be stated from this package.

11. **A1 does not publish the percentage by municipality.**  
    Files: charter A1; inventory A1.  
    Quotes: charter `"por entidade gestora, que o inventário liga ao concelho"`; inventory `"O valor percentual é publicado por entidade gestora, não por concelho"` and `"dá a banda de avaliação, não a percentagem"`.  
    Correct: percentages are by managing entity; the municipal matrix gives only performance bands for 278 mainland municipalities. Multiple entities may serve one municipality, so no municipal percentage can be assigned without a new editorial method.

12. **A4 has no national value, contrary to the charter’s geography.**  
    Files: charter A4; inventory A4.  
    Quotes: charter `"não (país e bacia)"`; inventory `"Não existe nesta tabela um total nacional publicado"`.  
    Correct: verified data are by reservoir and basin for mainland Portugal. A national total would be derived.

13. **H1’s promised NUTS III-to-country comparison was not found.**  
    Files: charter H1; inventory H1.  
    Quotes: charter `"a NUTS III contra o país"`; inventory `"dentro do INE não se pode fazer"` and `"dentro do Eurostat ... NUTS 2"`.  
    Correct: INE’s regional table lacks Portugal and is a different triennium; Eurostat permits a same-year NUTS II comparison, not the stated NUTS III comparison.

14. **H2’s “country” comparison is derived, mainland-only and licence-blocked.**  
    Files: charter H2; inventory H2 and §5.  
    Quotes: charter `"a ULS contra o país"`; inventory `"Portugal Continental"`, `"Não há valor nacional publicado como linha: o total tem de ser somado"`, and restrictive legal text saying content cannot be copied for commercial use or distribution.  
    Correct: ULS values can be compared with a clearly labelled derived mainland aggregate. The files do not establish permission to republish merely by deciding to `"cita-se o valor"`.

15. **H5’s unit is not verified.**  
    Files: charter H5; inventory H5; `lote-4.md` H5.  
    Quotes: charter `"por 100 000 habitantes"`; row notes `"o conjunto ... diz apenas «Rate»"` and `"marco-o como inferido e não como verbatim"`.  
    Correct value from the verified dataset is a standardized `Rate`; the per-100,000 basis remains unestablished in these files. H5 cannot be `verificada`.

16. **The PISA publication date conflicts inside `lote-4.md`.**  
    File: `lotes/lote-4.md`, D5 and summary.  
    Quotes: body `"released on 8 September 2026"`; summary `"PISA 2025 a 8 de outubro de 2026"`.  
    The inventory and source excerpt both support 8 September 2026. October is wrong.

## Major

1. **The charter’s reconciliation table assigns Education to the wrong wave.**  
   File: `CARTA-DOS-CONTEUDOS.md`, §4, Education row.  
   Quote: `"7, segunda vaga"`. Elsewhere domain 7 is consistently first wave. Correct value: `"7, primeira vaga"`.

2. **The charter violates its own three-to-five-question rule.**  
   Files: charter §§0, 3 and 4; candidate inventory.  
   Quotes: `"três a cinco perguntas"`; Housing has HAB1–HAB6, six questions; Space has only ESP1–ESP2 and the charter even proposes `"uma pergunta só"`.  
   The later-wave counts are 6, 4, 5, 2, 4, 5, 4, 3, 5 and 5, not uniformly three to five.

3. **The “six domains at a time” statement is arithmetically false.**  
   File: charter §4.  
   Quote: `"seis domínios de cada vez no ar"`.  
   The waves contain 8 first-wave domains, 6 second-wave domains and 4 third-wave domains.

4. **The charter contains an infrastructure measure with no inventory row.**  
   Files: charter domain 13; inventory IFR1–IFR4.  
   Quote: `"a pontualidade e a oferta (CP e IP, [verify] se publicam série)"`.  
   There is no IFR row for punctuality or service offer. Conversely, the first-wave M1/M2 question has two rows. The equal total row count therefore hides a failed one-to-one reconciliation.

5. **The M1/M2 municipal reconciliation is wrong.**  
   Files: charter M1/M2 and §5; inventory M1/M2.  
   Quotes: charter `"a do INE, se a série municipal continuar; senão, «parada em <ano>»"` and §5 `"população estrangeira por concelho depois de 2023"` as an expected absence.  
   Inventory M1 says AIMA publishes a 2024 adenda with all 308 municipalities. Correct: INE’s particular series stops in 2023, but a differently defined AIMA municipal series exists for 2024.

6. **M4 is presented as a live INE annual series when the inventory says it stopped.**  
   Files: charter M4; inventory M4.  
   Quote: `"emigrantes permanentes (INE, estimativas anuais)"`; inventory: `"2020 na base de dados do INE; 2024 no Eurostat"`.  
   Correct: the current route is Eurostat, with INE identified as the national source; INE’s own published database is stopped at 2020.

7. **M6 is wrongly recommended as an absence.**  
   File: inventory §4 finding 6 and §5 M6.  
   Quotes: `"não é um vazio"` versus `"entra como ausência com nota"`.  
   Correct: it is a partial, non-periodic series published in an Observatório das Migrações study using ISS data. What is absent is a periodic primary publication with a calendar, not the data or measure itself.

8. **S2 cites the wrong legal source in the charter.**  
   Files: charter S2; inventory S2.  
   Quotes: charter `"o mínimo legal da Lei de Bases"`; inventory `"não está na Lei de Bases ... [está] no ... Decreto-Lei n.º 367/2007"`.  
   Correct source within the files: article 16(2) of Decree-Law 367/2007, cited second-hand by CFP; the primary legislation was not read.

9. **S3 misstates publisher and periodicity.**  
   Files: charter S3; inventory S3.  
   Quote: `"Instituto da Segurança Social, estatísticas mensais"`.  
   The verified candidate is two annual INE indicators sourced to Instituto de Informática. The average is annual per pensioner, not a monthly pension.

10. **A3 still asks about consumption after the inventory refuted it.**  
    Files: charter A3; inventory A3.  
    Quotes: charter `"água consumida ou distribuída"`; inventory `"O nome está errado"` and state `errada`.  
    Correct measure: `Água distribuída por habitante`, INE 0013560. It does not establish municipal consumption.

11. **T1 treats an EU-wide target as though it were Portugal’s threshold.**  
    Files: charter T1; inventory T1 and §5.  
    Quotes: charter/recommendation `"a meta de 78 % em 2030"`; row note `"A meta de 78 % é da União no seu conjunto, não de cada país"` and Portugal’s national target is `[verify]`.  
    Correct: label 78% as the EU aggregate target; do not present it as Portugal’s national target.

12. **T3’s minimum-wage comparison is not source-permitted and mixes years.**  
    Files: charter T3; inventory T3.  
    Quote: `"a retribuição mínima como referência"`.  
    The inventory compares 2024 average gain with the 2026 mainland minimum and admits the mismatch. This is a house-constructed cross-source comparison, contrary to the charter’s rule that comparisons are those the source permits.

13. **D1 and D4 state one target while the inventory records two conflicting official versions.**  
    Files: charter D1/D4; inventory D1/D4 and §5.  
    Quotes: charter `"menos de 9 %"` and `"45 %"`; inventory records `9% versus 7%` and `45% versus 50%`.  
    No single current value can be selected from the files without naming the cited version and its status.

14. **D2 and D3 omit a material geographic definition.**  
    Files: charter D2/D3; inventory D2/D3.  
    Quote: charter simply says `"sim"`; inventory says geography is `"a localização do estabelecimento de ensino"`, not pupils’ residence.  
    Correct: municipal presentation must say “municipality of the school,” not imply resident children.

15. **H4 hedges a fact that the inventory resolves.**  
    Files: charter H4; inventory H4.  
    Quote: `"com a advertência da residência ou do local de trabalho"`.  
    Correct: it is the doctor’s municipality of residence, not workplace; it also includes people who practised medicine previously.

16. **The recommendation misstates calendars and sources.**  
    File: inventory §5.  
    Quotes:

    - `"P2, P3, P4 ... a próxima difusão ... 18.11.2026"`: P2 explicitly says no next calendar; only P3/P4 cite that date.
    - `"P5 ... citar demo_gind"`: the median-age measure is `demo_pjanind`; `demo_gind` is only supporting context about population revision.
    - `"E2 ... abril e outubro"`: that is Eurostat’s dissemination rhythm, while the cited INE next notification is 23 September.

17. **`publicado_em` frequently records an update timestamp, not a proven publication date.**  
    Files: JSON and lot reports, numerous Eurostat and INE rows.  
    Typical quote: `"publicado_em": "... campo updated"` or `"DataUltimaAtualizacao"`.  
    A dataset-wide last-update timestamp does not prove when the latest observation was first published. This affects, among others, E1–E3, T1, T3–T4, M2–M5, A3, A5, D1–D4, H1, H3–H5. Correct wording is “dataset last updated” unless a release or publication date is separately evidenced.

18. **D5 has no actual publication date.**  
    Files: inventory D5; `lote-4.md` D5.  
    Quote: `"publicado em: © OECD 2023"`. Copyright year is not a publication date. The files say the results were published in December 2023, but provide no exact date.

19. **The inventory was allegedly generated before one input report was finished.**  
    Files: JSON top-level `gerado_em`; inventory §4; `lote-2.md` report.  
    Quotes: JSON `"2026-09-01T09:01:52+00:00"`; inventory says lots ran until `"09:35 UTC"`; lot 2 says `"das 08:04 às 09:35 UTC"`.  
    A 09:01 merged output cannot contain a report completed at 09:35. At least one timestamp or provenance claim is wrong. The inventory’s lot-2 duration of `"57 min"` also conflicts with the report’s roughly 91-minute interval.

20. **Numerous `valor_recente` numbers are absent from their own excerpt.**  
    Files: JSON rows and rendered §2. Material examples:

    - E4: `"1639 M€"`.
    - M1: `"Évora ... 5 621"`.
    - M6: `"324 619"` and `"3 326,94 milhões"`; the latter is calculated despite the rule `"nunca calculado"`.
    - S1: `"27 632,6 M€"` and `"23 216,8 M€"`.
    - S2: growth and return figures `6 068,5`, `3,9%`, `5,9%`, `9,1%`.
    - S3: every pension-type breakdown.
    - A1: high-system `5,2%` and `34 057 068 m³`.
    - A2: `99,69%` in high systems.
    - A4: all twelve basin percentages.
    - A5: the four-year average `8,32%`.
    - H2: most extremes and the derived totals `1 672 130 / 10 811 298`.

    These values may be true, but the specified evidence contract does not support them. Add excerpts that contain them or remove them. Derived values must be labelled outside `valor_recente`.

21. **P1’s “identical in both indicators” conclusion is not supported by the excerpt.**  
    File: inventory P1.  
    Quote: `"Idênticos nos indicadores 0012918 e 0012917."`  
    The excerpt contains an extract from 0012918 and a national press-release sentence, not the corresponding 0012917 results. The lot report says both were queried, but the required excerpt is missing.

22. **M3’s unit is not shown in the excerpt.**  
    File: inventory M3.  
    Quote: `"6.2 por 1000 habitantes"`.  
    The excerpt contains `6.2` but no unit code or label. The unit must be added to the excerpt or left unverified.

23. **D5 makes an unsupported prose claim about a derived 30%.**  
    File: inventory D5.  
    Quote: `"Os 30 % que circulam"`.  
    Thirty is arithmetically the complement of the quoted 70%, but the claim that this number “circulates” has no source. The sourced value is the Commission’s 29.7%.

24. **The “verbatim” label is inaccurate.**  
    Files: inventory §0 and many `excerto` cells; lot-report preambles.  
    Quote: `"o fragmento ... verbatim"` and `"copiados carácter a carácter"`.  
    Examples such as E1’s inserted `"..."`, D1’s editorial notation `"geo PT, time 2025 -> 6.1"`, composite strings joined by `||`, and S1’s reconstructed `"v[erificam]"` are extracts or transcriptions, not character-for-character quotations. They should be labelled structured summaries unless the raw source text is preserved.

25. **The later-wave `ausente` and licence claims are unsupported by design.**  
    File: candidate table §3.  
    Quotes: GOV5 `"ausente"` and JUS4 `"Transparency International (CC BY-ND 4.0)"`.  
    These rows have no source URL, access record or excerpt and belong to the explicitly unverified waves. Correct state: `[verify]`; no different licence or absence can be derived from the package.

26. **The package omits files needed to audit its provenance claims.**  
    Files: inventory §§1 and 4; charter §7.  
    Quotes: references to `fundir.py`, `lote-N.json`, `INVENTARIO-DAS-FONTES.plantas.json`, `COVERAGE-MAP.md`, `DECISIONS.md`, costs and planted-error SHA-256 records. None is present in this folder.  
    Consequently, generation, blind-check, cost and planting claims cannot be verified from the permitted evidence.

27. **INE licence findings were not reconciled between lots.**  
    Files: inventory P1/T3/D2/H4 versus S3/S4/A2/A3.  
    Some rows quote and verify INE CC BY 4.0 from the same institutional terms page; others leave the INE licence `[verify]` because one request returned maintenance. The package itself allows the secondary INE licence for S3, S4, A2 and A3 to be filled from the successful same-day reads, although upstream producers may still need separate terms.

28. **Publisher-role columns contain category errors.**  
    Files: rows D1, D4, H3, H5 and E4.  
    INE is called a “secondary publisher” where it is actually an upstream national data supplier; OECD is placed in H5’s secondary-publisher field although it co-authored the cause lists; the Council of the EU in E4 publishes the benchmark trajectory rather than redistributing the CFP observation. These are separate roles and, in several cases, separate measures.

## Minor

1. **The recommendation’s waiting interval is off by one day.**  
   File: inventory §5, D5.  
   Quote: `"espera oito dias"` from 1 September to 8 September 2026. The elapsed interval is seven days.

2. **`lote-1.md` miscounts the ledger checks.**  
   File: `lotes/lote-1.md`, report.  
   Quote: `"Conferi hoje quatro linhas"` followed by four national claims plus two Évora lines. That is six cited ledger claims, not four.

3. **The first- and later-wave JSON schemas are inconsistent.**  
   File: `INVENTARIO-DAS-FONTES.json`.  
   Later rows carry `dominio`, `vaga` and `pergunta`; first-wave rows do not. The Markdown generator must reconstruct first-wave domains outside the row data, weakening the claim that the JSON contains “the same rows as data.”

4. **A one-day access check does not establish stable endpoints.**  
   File: `lotes/lote-3.md`, report.  
   Quote: `"dois endpoints estáveis"`. The report demonstrates that they responded on 1 September 2026, not long-term stability.

5. **Several process quantities are unsupported.**  
   Files: inventory §4 and `lote-4.md` report.  
   Quotes include `"≈270 mil"`, `"≈331 mil"` symbols and `"101 pedidos"`. No request log, token log or cost record is present in the folder.

## Notes

- I inspected all 84 JSON rows: 41 first-wave rows and 43 later-wave candidates.
- I inspected all 41 full row reports across `lote-1.md` through `lote-4.md`, all 18 charter domains, the 22-row reconciliation table, and every recommendation.
- Checks performed: row-ID reconciliation; question and measure counts; status versus `[verify]`; geography and territorial coverage; publisher versus URL domain and role; licence attribution; periodicity/calendar consistency; last-period/publication metadata; timestamp ordering; numeric containment of `valor_recente` in `excerto`; charter-to-inventory claims; and Markdown table structure.
- All rendered tables have the expected structural column counts. Escaped pipes do not break cells. The rendering defect is truncation, not malformed pipe syntax.
- The JSON parses successfully and contains 41 + 43 rows.
- No network or files outside this folder were used. Claims dependent on missing documents or external sources remain unverified; I have not invented replacement values.