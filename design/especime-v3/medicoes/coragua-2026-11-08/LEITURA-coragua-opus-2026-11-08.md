# A leitura a frio da COR-AGUA (08.11.2026)

*Leitor: Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote de 61689dfcb (204 ficheiros, 14 corpos alojados, 46 páginas construídas), com cinco plantas só nas cópias do pacote. Duas partes: a leitura (47 chamadas) e a continuação pedida pelo lugar de direção sobre o que a leitura disse não ter coberto (o texto de «Água não faturada» nas duas edições e a Q4; 26 chamadas). O relatório do leitor vai abaixo, como o deu, em inglês.*

## As plantas: cinco em cinco

| planta | o estrago | achado |
|---|---|---|
| C1 | a citação do despacho da EDIA, «atualizar» trocado por «alterar», na edição portuguesa de «Onde está a água» | 4 |
| C2 | o mínimo da DGADR, 8 % passado a 6 %, na edição inglesa de «Água não faturada» | 17 (na continuação) |
| C3 | o excerto do Tribunal de Contas, «desde 2013» passado a «desde 2011» | 3 |
| C4 | o `sha256` da cópia da Gulbenkian mudado num algarismo | 2 |
| C5 | um valor pago do PRR no gráfico inglês diferente do português | 5 |

## A decisão do lugar de direção sobre os achados reais (cada um conferido nas cópias guardadas)

- **1 (Blocking), os corpos das linhas do motor:** real. Quatro cópias citadas pelos livros do motor não estavam no git: o boletim da APA de 8 de novembro, o resumo dos planos de bacia, as contas de 2025 da EDIA e o relatório da seca de agosto. O simulador da EDIA, de onde vêm a citação e o escalonamento, também não estava, nem era citado. Corrigido na adenda D.
- **6 (Major), o 13,48 da ERSAR:** real quanto ao excerto. O valor é o rótulo de dados da barra de 2024 do abastecimento de água, na imagem da Figura 553 (p. 410), sem camada de texto; este lugar leu-o de novo na imagem. A linha passa a dizê-lo no localizador (adenda D).
- **7 (Major), a conclusão do rácio:** real. Reescrita para dizer o que cada lado inclui (adenda D, a lista D).
- **8 (Major), o intervalo de 0,0689 a 0,0847:** retirado por este lugar. Com a disposição da página, o edital dá o vazio e super vazio a 0,0692, dentro do intervalo; a leitura usou a camada de texto sem disposição.
- **9 (Major), «eficiência da rega» no registo:** real. As duas entradas passam a «eficiência na adução e distribuição dos aproveitamentos hidroagrícolas» (adenda D).
- **11 (Minor), o escalonamento:** real quanto à forma. A EDIA escreve «Preço Base + 150%» e «+ 400%» no simulador; a página passa a dizê-lo assim. «Volume autorizado» é a palavra da EDIA e fica.
- **12 (Minor), os anos selados no registo:** o «2026» do encargo de conservação sai da frase (adenda D).
- **13 (Minor), o 75 % da circularidade:** corrigido (adenda D, a lista D).
- **18 e 19 (Major), a conferência das atribuições do motor:** reais, reproduzidos por este lugar com a versão de cf5bd5b e a de 63276ad. A fonte errada na frase anterior (iniciada por maiúscula) e numa legenda passou a passar; um ano depois de «em» atribuído a outra entidade passou a passar. Corrigido na adenda D: volta a recusar o que recusava, com os testes da adenda B.
- **20 (Minor), a exceção da voz sem prova:** a prova entra na adenda D.
- **22 (Minor), a Ipsos APEME:** real e é uma atribuição falsa. O inquérito foi conduzido pelo C-Lab (pp. 11 e 22); a Ipsos APEME adquiriu e analisou a base da amostra. Por isso não aterra assim (a regra 15), e entra na lista D.
- **23 (Minor), a nota do PRR:** corrigida na adenda D.
- **14, 21, 24 e 25 (Minor):** vão para a lista dos Minor da higiene.
- **10:** segue dos achados 4, 5, 7 e 8; os achados 4 e 5 são plantas.

---

## O relatório do leitor: a leitura

## Blocking

1. **Five engine ledger rows changed in this block (the numbers they hold reach the Portuguese page) declare `source_sha256` for four documents that are not under `motor/`.** In `ledger_onde_pt.json`:
   - `apa-pgrh3-ptcont-resumo-nao-tecnico.pdf` (bc1550e8…) holds 263, 14 804,71 and 264;
   - `apa-boletim-semanal-albufeiras-live-20261108.pdf` (c7240e9f…) holds 9 317 and 13 215;
   - `gpp-relatorio-monitorizacao-seca-agosto-2026.pdf` (5986ec77…) holds 78, 2, 40, 36, 80, 33 and 39;
   - `edia-relatorio-contas-2025.pdf` (80bdf0f5…) holds the impairment, 2 029 018 255 €.
   
   `CORPOS-ALOJADOS.md` lists only the site rows; the package script never walked the engine rows. The engine's own manifest records these files in `raw/fontes/`, outside git. Following PROMPT-COMUM, I did not check these rows' words against anything else. That leaves Q1 (PGRH, the APA bulletin of 31 October, the drought report of 31 August, the EDIA impairment) and Q2 (whether the impairment is said as fact) unanswered by this reading.
2. **The Gulbenkian row in the package declares a sha256 that matches neither the hosted copy nor the diff.** `coragua-gulbenkian-sem-contador.yml` ends its `source_sha256` in `…bd8`. The `shasum` of the hosted PDF, the diff and `EXCERTOS-medidos.txt` all end in `…bd7`. `CORPOS-ALOJADOS.md` shows only the 12-character prefix, so it reads «copiado» and hides the difference.

## Major

3. **The Tribunal de Contas row's excerpt is not the source's words.** The package copy has «…pela EDP desde 2011.» The hosted Relatório 4/2016 (PDF p. 37, §214), the diff and `EXCERTOS-medidos.txt` all say «desde 2013».
4. **The EDIA despacho quotation differs between the editions.** The Portuguese page prints «veio alterar alguns aspetos…». The list, the page source, the English page and the three engine bodies all say «veio atualizar». Its likely source, `edia-simulador-tarifarios.html`, is not hosted.
5. **One PRR chart value in the English «Água não faturada» differs from the Portuguese one and from the builder's report.** `/prr_c09/by_line/2/2` is 18993466 in Portuguese and 18939466 in English. `check:graficos` shows green on this head, so the built English page in the package is not what that check saw.
6. **The headline ratio depends on «13,48», which cannot be found in the hosted ERSAR copy.**
   - The row's whole excerpt is the bare value «13,48», with the locator p. 410, Figura 553.
   - `pdftotext` finds the Figura 553 caption but no «13,48» or «13.48» on any page.
   - In effect the excerpt is a placeholder.
7. **The ratio sentence states as fact what agriculture pays, and drops the qualifications that make the two sides different measures.**
   - The household side includes IVA, the water resources tax and the fixed charge.
   - The farm side is the variable tariff, to which «acrescem a taxa de recursos hídricos e uma componente de conservação por hectare». The edital's text does not state its IVA treatment.
   - The register repeats this as «o que as famílias e a agricultura pagam por metro cúbico».
8. **The high-pressure range «0,0689 a 0,0847 consoante o período» is not supported by the hosted edital (inferred).** The Vazio/Super vazio row has no price in the copy's text layer, and the midpoint of the range (0,0768) is above the 0,0706 average.
9. **Both register entries call DGADR's 76 % «eficiência da rega» / «irrigation efficiency».** The source measures conveyance and distribution across 33 schemes («Eficiência na Adução e Distribuição», p. 27).
10. **As a daily's editor I would not print «Onde está a água» or the English «Água não faturada» as they stand** (findings 4, 5, 7 and 8).

## Minor

11. **The penalty multipliers are credited to EDIA but are derived.** The edital publishes prices, and the rows `edital-mult-*` carry no derivation. The page writes «volume autorizado» where the edital says «volume atribuído».
12. **In the register, years are sealed with rows whose value is another number.** «ERSAR de 2024» links to the 13,48 € row, and both «2026» link to the 0,0706 €/m³ row, which does not hold the conservation charge.
13. **The circularity paragraph in «Onde está a água» still uses a 75 % hypothetical,** one paragraph after DGADR's 76 %.
14. **The chart-data ruler compares only JSON numbers, and skips silently** when a study has no payload or an edition is missing.
15. **Some report claims are not shown or overstate:** the call counts; «14 linhas com corpo verificado» holds for the site rows only.
16. **Coverage gap: Q4 was not answered** for layer 0, the parity exception, the attribution gate and the voice exception (withdrawn in the continuation, which covers them).

## What is fine

- No `SEM-CORPOS-ALOJADOS.md`. The five hosted PDFs and the two archived editions hash exactly to their declared sha256, and each PDF has its `.pedido.json`.
- **The edital:** 0,0706, 0,0382, 65,83, 23,94, 0,0689, 0,0847, «Anexo II» and «2 de junho de 2026» are all in its text.
- **The ratio arithmetic holds:** 19,09 → 19 and 35,29 → 35.
- **DGADR:** 76 %, 8 % (Alvor), 98 % (Alfândega da Fé) and 33 schemes match pp. 27 and 6.
- **The Gulbenkian 71 %** is from the quantitative telephone survey: N=335, holdings of 5 ha or more, 31 July to 13 December 2019 (p. 22). The 61 % is on p. 62.
- **The six «edição anterior» rows:** their excerpts are verbatim in the archived editions.
- **The diffs:** apart from findings 2 and 3, every changed region of both matches the copied files.
- **«Onde está a água»:** the same visible numbers in both editions, and all 4 913 numeric chart-data paths equal.
- **The «[verify]» marker:** none on any built page. Évora prints «por confirmar na fonte».
- **The PRR date:** the current «Água não faturada» says «instantâneo de 3 de agosto de 2026».
- **The Évora and Alentejo-Algarve register entries** match the mandate letter by letter.
- **The full run:** `CONFERIR-TUDO` shows 68 steps and 0 red.
- **The Tribunal's quotation** «a situação financeira da EDIA ficou comprometida» is exact.

## O relatório do leitor: a continuação

I withdraw finding 16. Finding 5 is confirmed by `PRR-graficos-2026-08-03.json` (18993466).

## Major

17. **The English «Água não faturada» prints «lows of 6% (Alvor)», where the source and every other copy say 8 %** (DGADR p. 27: «com mínimos de 8% (Alvor) e máximos de 98%»). The visible numbers of the two editions match except for this one.
18. **The rewritten attribution gate no longer sees a wrong source named in the sentence before the number, or in a caption or heading above it, and it passes such cases without even a warning.**
    - The search now stops at HTML block boundaries (including `figcaption`, `caption` and `h1`–`h6`) and at sentence boundaries, and `if not found: continue`.
    - The new tests only prove that a right source in a neighbouring sentence no longer causes a false refusal.
19. **The attribution gate now skips any year written after «em», «in», «de» or «ano».** Four year-valued engine rows with `attributed_to` (`gulb-inquerito-ano` 2019, `gulb-publicacao-ano` 2020, `tc-2016-auditoria` 2016, `dgadr-referencia-ano` 2024) are never checked in the form the pages print them. «um inquérito do INE feito em 2019» would pass.

## Minor

20. **The voice exception for the register entry (`correcao_textual`) has no test proving it still refuses.** The code is narrow.
21. **The two corrected water studies are still exempt from `check:voz`,** and `voz2a.mjs` now fixes that exemption in place.
22. **The Gulbenkian survey is credited to «Ipsos APEME», but the source says C-Lab conducted the research** (p. 11 and p. 22). Ipsos APEME acquired and analysed the sample database.
23. **The PRR data file's `limite` note still says the 29 July date was kept.**
24. **The pass-B report's VOZ-2B count «números 1→0» cannot be reproduced** from the diff.
25. **Layer 0's numbers rule skips silently when one edition of a document or page type is missing** (it cannot fire on these two studies).

## What is fine

- **«Água não faturada», Portuguese against English:** the visible numbers are identical apart from finding 17 and the «1.º trimestre» / «Q1» form.
- **The Gulbenkian sentence:** right on year, publication date, population and value.
- **The source lists** say «março de 2020; inquérito de 2019» / «March 2020; 2019 survey».
- **The Portuguese DGADR sentence** and the telemetry claim match pp. 27, 6 and 28.
- **CA41 and CA42** are applied in both editions.
- **The PRR total:** «126,8 M€ pagos» is the 3 August `total_pago`, 126 759 838,90.
- **Layer 0, the numbers rule:** its tests refuse what they should, and none passes something that failed before.
- **Layer 0, naming by inclusion:** opens no voice hole.
- **The parity guard is not weakened.** It accepts only the «A casa» difference, kept with no exit date, and only while it stays identical.
- **The «[verify]» ruler** bites on studies, in all four forms.
- **The package's archived editions** are strict.
- **The attribution gate** still refuses a swapped comparison and keeps every entity under negation.
