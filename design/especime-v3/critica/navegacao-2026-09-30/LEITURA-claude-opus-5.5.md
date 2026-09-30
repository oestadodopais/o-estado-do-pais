## Diagnosis

The counts are mine.

**One set of cards, six groupings.** /temas/ holds 48 national cards (temas.md). Five other groupings show them again, each named and bounded differently:
- the front page's five story blocks (inicio.md);
- the five entries, 47 cards, every one also on /temas/;
- /dominios/, 18 domains, 9 of them empty (dominios.md);
- /areas/, nine ministries (areas.md);
- /uniao-europeia/, 21 tiles, with unemployment twice (uniao-europeia.md).

The English edition doubles all six.

- «Dívida pública» 89,7 % appears on six pages: inicio.md, o-estado-e-a-economia.md (twice), temas.md, the domain page, areas_financas.md and uniao-europeia.md.
- «Ganho médio mensal» sits under three different headings: «Trabalho» (temas.md), «O salário» in «O meu dinheiro» (o-meu-dinheiro.md), and «Economia e finanças públicas» (domain page).
- One heading holds three different sets. «Economia e finanças públicas» is 19 cards on /temas/, «13 medidas» on /dominios/, and «10 de 10» on its own page, five of them labour measures.
- Every Portuguese page links /temas/, /dominios/ and /areas/. The five entries are linked only from the front page.

**The titles promise the reader; the pages deliver the country.**
- «O meu dinheiro» holds national prices, poverty and household debt as % of GDP: nothing on it is personal. It opens with two front-page blocks copied word for word, «Os preços: os combustíveis sobem mais do que o resto» and «Pobreza e desigualdade não são a mesma coisa» (inicio.md, o-meu-dinheiro.md). It then repeats their measures as cards: poverty is covered twice on one page, and 23,78 % appears four times.
- «O meu trabalho» and «A minha casa» open the same way. The wage cards are in «O meu dinheiro», not in «O meu trabalho».
- «O Estado e a economia» prints «As contas do Estado» twice in a row, with the debt in both. It then adds «A justiça», which its title and subtitle never promised (o-estado-e-a-economia.md).
- «A escola e a saúde» is 368 words (PAGINAS.md), and «A saúde» is a single survey figure, 2,5 % (a-escola-e-a-saude.md).
- «A minha terra» goes to /lugares/, the same place as the nav item and the search box just below it (inicio.html).

**From a search engine,** the reader sees «O meu dinheiro · O Estado do País» and «Os preços, os salários, as pensões e os apoios.» (o-meu-dinheiro.html). Neither mentions Portugal or official figures. On landing they would grasp national prices, with sources and EU comparisons. They would not learn:
- that «meu» is not personal;
- that the same cards are on /temas/;
- why there are three wage figures (1 835 €, 1 576,0 euros, 920,00 euros: o-meu-dinheiro.md);
- how to reach their own municipality.

**The municipalities are spread over six places:**
1. the front-page search and map;
2. /lugares/ (names, regions, districts, two CSV files);
3. the district page, 14 names and no values (distritos_evora.md);
4. the municipality page;
5. the domain page, the only page here listing every municipality's value, as tables and binned maps («Évora : 1 484,5 … Portugal : 1 576,0»);
6. «Todas as medidas de Évora», which opens the ledger.

None of Évora's eight values has a district value or a rank beside it. Only purchasing power (an index with Portugal = 100) relates to the country (municipios_evora.md). The same page says «Prazo médio de pagamento sem valor publicado» and, further down, 137 days. «O que mudou» lists eight changes, four of them marked «[a verificar]».

**The EU page has no countries on it.** «Portugal na União Europeia» has no 27-country strip and no «Todos os países» link (uniao-europeia.html). All ten strips are on /temas/ and the entries. The EU page instead gives thresholds and 33 definition excerpts, 32 of them in English (uniao-europeia.md).

**Readability.**
- A card opens with nine lines of definition before any comparison, restates its numbers in prose, and ends with its plainest line, the question, in small type (cartao-sobrecarga-casa-pt-390.png).
- At 390 px, the front page is 6 803 px tall and «O meu dinheiro» 7 331 px: eight or nine screens on a 390×844 phone (inferred).
- Some labels mislead:
  - «Taxa de atividade» 2,6 and «Quota nas exportações» 8,2 are three-year changes, not levels (temas.md).
  - «Procedimento dos Défices Excessivos 2ª Notificação» is the source's own label shown as is (inicio.md; left untranslated in en.md).
  - Unemployment reads «6 %» next to the Union's «6,0 %» (inicio.md).

The entry-page captures lack the strips that the live text and the card capture show, so they look older than the text (inferred).

## Proposals

1. **Stop copying the front-page blocks (small).**
   - Solves: «I saw this already».
   - Change: cut the five front-page blocks copied onto the entries, which also ends the double «As contas do Estado». Each front-page block ends with a link to its cards instead.
   - Removes: 9 to 23 % of the words on four entry pages.
   - Risk: none. There are fewer copies of checked sentences.

2. **One home per card (medium).**
   - Solves: finding content, and titles that don't say what is inside.
   - Change: replace the five «O meu…» pages, and the full copy of the cards on /temas/, with subject pages named for their content. The names come from the entries' own sub-headings: «Preços», «Salários e pensões», «Pobreza e desigualdade», «Emprego», «Habitação e rendas», «Escola e saúde», «Contas públicas», «Economia e contas externas». Each card appears in full once. The old URLs redirect.
   - Removes: /temas/ shrinks from 5 159 words (PAGINAS.md) to an index of the subject pages. That index replaces «Por onde começar» and sits after the first front-page block.
   - Risk: the receipts don't move, and the gate checks the same cards on fewer pages.

3. **Take /dominios/ and /areas/ out of the reader's path (small to medium).**
   - Solves: the contradictory counts.
   - Change: first move what only they hold (the 308-value tables and maps go to the municipal pages). Then drop both from the footer and redirect them. The ministry can become a label on each card.
   - Risk: domains may still organise the content plan; keep them internal.

4. **Give each municipality its comparisons (medium to large).**
   - Solves: municipal content that is scattered and yields no insight.
   - Change: beside each comparable value (ganho médio, poder de compra, índice de dívida), show Portugal's value and the municipality's place among 308 and within its district. The district page lists values, not just names. «O que mudou» moves behind a link, and the empty payment card points to the 137 days.
   - Risk: ranks are calculated, so each needs its own «calculado» ledger row, as «308 concelhos» already has. Never rank counts such as 1 409 registered unemployed or 7 907 firms (municipios_evora.md), because municipalities differ in size.

5. **Make the EU page the countries page (medium).**
   - Solves: the content readers like best lives elsewhere.
   - Change: for each measure with a 27-country series, show the strip sorted, with all 27 countries named on tap, grouped by the two scoreboards. Definitions fold away (they stay on the receipts). Keep one unemployment tile, not two.
   - Risk: nothing new. The series receipts exist, and the rank sentences are already checked.

6. **Rebuild the card for the phone (small to medium).**
   - Solves: readability.
   - Change: order the card as:
     - a title saying what the value is (with «variação em três anos» where it is one);
     - the value;
     - one comparison line;
     - the strip;
     - «O que mede», folded.

     Cut prose that repeats the numbers row, and make the question the subtitle. Replace the raw source label and use one format instead of «6 %»/«6,0 %». Check the unit «5,4 % da população» on the gender employment gap, which is a difference between two percentages (o-meu-trabalho.md).
   - Risk: no number changes.

## Charts

- **Cards.** Most cards hold the current and previous values, and many hold the Union's. A dumbbell (previous to current, with the Union as a tick) can replace sentences like «Desceu face a 2024. Está abaixo da média da União Europeia» (a-minha-casa.md). For prices, one dumbbell from July to August 2026 shows both the outlier and the direction: fuel 16,58 to 23,78, overall 3,04 to 3,30 (o-meu-dinheiro.md).
- **Reference values.** Keep the EU page's threshold scale and add a tick for Portugal's previous year («2024 : 93,5» for debt, o-estado-e-a-economia.md). The reader then sees whether Portugal is moving toward or away from 60 %. Amber and cobalt stay reserved for reference values (metodo.md).
- **European comparison.** The strip is the right drawing. Sort it, name all 27 countries in rank order on tap, and stack the strips on the EU page. The best, the worst and Portugal's place can then be read across measures at once.
- **Municipalities.**
  - Use the same strip with 308 dots: Portugal as a line, the district's municipalities darker, the municipality itself in ink. This works for ganho médio, and for índice de dívida against its 150 % limit (both on the domain page).
  - Draw Évora's debt index as a line under the limit: 242,6 in 2014, 182,0, 141,9, and 105,5 in 2024 (municipios_evora.md), with the mandates as bands behind it.
  - The binned map suits desktop; on a phone, 308 polygons are too small to read (inferred).

## Patterns elsewhere

I recalled all three from memory; none is observed in the package, so each needs checking.

1. **Our World in Data:** each indicator has one page with chart, map and table views and its sources, and topic pages link to that page. It gives each measure one home (proposal 2).
2. **INSEE, «Comparateur de territoires»:** shows a commune's indicators next to its département, its region and France in one table. Comparison is the default (proposal 4).
3. **The European Commission's Social Scoreboard, in the Joint Employment Report:** places each country by both its level and its change against the Union average, from «best performers» to «critical situations». It gives the best and the worst with context. It would need the 27 countries' previous values, which the package does not show the site holding.

## What is fine

- One receipt per number, showing the request, the returned field and the re-reading dates (livro-razao_taxa-de-desemprego-2025.md), and country series with the source's marks («d»).
- The strip and its sentence: lowest, highest, EU average, Portugal's place (cartao-sobrecarga-casa-pt-390.png).
- The front page's five blocks: headings that state a finding («A habitação: a média engana quem arrenda») and plain Portugal-versus-Union bars.
- The colour rule, «dado provisório», «[a verificar]», «Não há número público para isto», and the AI label.
- Évora's section on its mandates, with «Não existe contrafactual».
