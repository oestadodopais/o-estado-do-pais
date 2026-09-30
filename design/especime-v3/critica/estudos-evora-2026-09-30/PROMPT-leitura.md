# An outside reading of the six Évora studies: what overlaps, what contradicts, and what the coherent set should be

You are an outside editor with long experience of research publishing and data journalism. You read the six studies about the municipality of Évora that O Estado do País has published, as a reader who wants to understand the town's public money and government would, and you propose how they should be reorganised. You do not write the studies here; you diagnose and propose.

## What the site is, and what cannot change

O Estado do País is a Portuguese observatory of official numbers, written by an AI and saying so. A study is a piece of research with the project's conclusions at its head, every number sealed in a ledger row with a receipt page, and a method statement. Its design is sober and its identity is closed. Nothing may be invented, every number keeps its receipt, and a study that lands stays citable. Portuguese first; English mirrors.

## The reading that prompted this

On 30.09.2026 the director said, in his words: there are a lot of Évora studies, and many talk about the same thing, or about things that should be together in one study; they were built block by block, separately; now that the content exists it should be organised, into one, two, three or four studies, putting together what belongs together and giving an independent study to what should stand alone; the titles and the content mix the same things in different ways, and reading them is confusing.

## What the package holds

- `texto/`: the text of each of the six studies as published today, one file each, with headings; the studies index (`index.md`) with each study's dated summary; and the Évora municipality page, which lists the six and shows the town's current numbers and its mandates.
- `linhas-por-estudo.json`: the ledger rows each study seals (id, value, unit, source, reference date, source address). The 2027 study has no rows under its own name; its numbers live in its hosted documents.
- `PAGINAS.md`: the list with word counts and section counts.

## What I need from you

1. **Diagnosis.** For each study: its question in one line, what it concludes, and its period. Then, concretely, what repeats where (the same number, the same source document, the same story told twice, with the study names and the headings), and where two studies contradict each other or give different values for what looks like the same thing (quote both, with study and heading). Say which studies a reader confuses by title, and why.
2. **The coherent set.** Propose how many studies there should be, and for each: its title (saying what it holds, not a slogan), its question, its sections in order, which existing studies and sections feed it, and what would be cut as repetition. Say what should stand alone and why. Give the reader's path: from the municipality page, which study answers which question.
3. **What is lost and what is risked.** For each merge: numbers that would change home, conclusions that no longer fit, and anything that cannot be merged without new research. Say what the merged studies would need that the existing ones do not have.
4. **What is fine** and must stay as it is.

## Rules

- Invent nothing. When you cite a number or a sentence, name the file and the heading.
- Titles must say what the content is. Keep the design sober; do not propose new research beyond what the existing studies hold, except to name it as missing.
- Write in English, under 1 500 words, in four sections with these headings: Diagnosis, The coherent set, What is lost and what is risked, What is fine.
- Return the reading as your final message. Do not create files.
