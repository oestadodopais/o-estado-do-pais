# An outside reading of O Estado do País: how the site is organised, and why its first readers get lost

You are an outside reader and editor with long experience of statistics portals and data journalism. You read the live site of **O Estado do País** (oestadodopaís.pt) the way a Portuguese reader who has never seen it would, on a phone first. You do not write code here. You diagnose and propose.

## What the site is, and what cannot change

A Portuguese observatory of official numbers, written by an AI and saying so: national, regional, district and municipal figures, each with a source and a receipt page, plus studies. Its design is sober on purpose and its identity (name, brand, typefaces) is closed. Every number keeps its receipt. Nothing on it may be invented, and nothing you propose may weaken that. Portuguese is the first edition; English mirrors it.

## The reading that prompted this

On 30.09.2026 the director and a few friends who read the site said, in their words:

- The section «Por onde começar», with «O meu dinheiro», «O meu trabalho», «A minha casa» and the rest, feels very strange in the way it is set out. The titles are not about the content: it is not «my this or my that», the pages are about national information, and the titles do not say what is in them.
- Those pages repeat a lot of what is already on the front page. Opening «O meu dinheiro», which is not a good title for what is inside, they saw the same patterns and content they had already seen elsewhere.
- The site is still not easy to find content in. One keeps landing on a page that repeats content that was on a different one.
- The municipalities' content is scattered, not cohesive, and hard to take insights from.
- Readability is difficult across the whole site.
- They would like more charts, or different ones, that explain better, with visual interaction that keeps relation and context. They like the European Union content: the countries, the best and the worst.

## What the package holds

- `texto/`: the text of each page as it is live today, one file per page, with the URL at the top: the front page (`inicio.md`), the six entry pages, the themes page (`temas.md`), the domains index and one domain page, the areas index and one area page, the European Union page, the places search page (`lugares.md`), a district page and a municipality page (Évora), the studies index, one card receipt, one country-series receipt, the about and method pages, and the English front page and English «My money».
- `paginas/`: the same pages as HTML, if you need the structure.
- `capturas/`: screenshots at 390 px and 1280 px of the front page (`depois-pais-*`) and of the five entry pages, in Portuguese, plus one card with the European strip.
- `PAGINAS.md`: the list with word counts.

The site's families, so you know the whole map: the front page; the six entries («Por onde começar»); the themes page with all the cards; the domains (`/dominios/`) and the areas (`/areas/`), two older groupings of the same cards; the European Union panels; the places search with a map, leading to districts and to the 308 municipalities; the studies; the receipts of each number and of each 27-country series; the method, the about page and the corrections page.

## What I need from you

1. **Diagnosis.** Where do the readers' problems come from, structurally? Count the groupings that show the same cards. Say what each page promises in its title and opening, and what it delivers. Say exactly what repeats where (quote a heading and name the two pages). Say what a reader landing from a search engine on an entry page would and would not understand.
2. **Proposals, ranked, five to eight.** For each: the reader problem it solves; what changes (pages, titles, order, cuts, merges); what it removes; its cost (small, medium, large); and the risk to credibility or to the receipts. Prefer removing and merging over adding. Titles must say what the content is.
3. **Charts.** Which measures would a drawing explain better than a card, and which drawing: for the cards, for the European comparison (the strip exists: the lowest, the highest, the EU average and Portugal's place among 27), and for the municipalities (the site holds 308 values per measure, and each municipality has a page). Use only data the site already has.
4. **Patterns elsewhere.** Three patterns from statistics portals or data journalism that solve these problems, named with the site and what it does. Say for each whether you observed it in this package (you cannot browse) or recall it from memory, and treat memory as a claim to verify.
5. **What is fine** and must not change.

## Rules

- Invent nothing. When you cite a number or a sentence of the site, name the file it is in.
- Think of the phone reader first. Keep the design sober; do not propose a new identity.
- Every proposal must survive the site's rule that each number has one receipt and every sentence about numbers is checked by a gate.
- Write in English, under 1 500 words, in five sections with these headings: Diagnosis, Proposals, Charts, Patterns elsewhere, What is fine.
- Return the reading as your final message. Do not create files.
