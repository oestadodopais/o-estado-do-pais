# The short read of MET2, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this block does

On the Method page (`/metodo`, `/en/method`), the second door at the end of the last section, «Política de inteligência artificial» / «Artificial intelligence policy», opened the project's internal policy document on GitHub. MET2 removes that door in both languages, removes its label and the address from the two governed texts (`src/data/metodo.mjs`, `src/data/politica-ia.mjs`, stamped in decision §1.235 in `DECISIONS.md`), changes the Method page's checker so it requires only the agenda door and no repository link, and adds a rule that no built file links to the project's GitHub. No sentence, number or source changes. The mandate is `brief.md`; the diff is `diff.patch` (base `__BASE__`, head `__CABECA__`); built pages under `built/` come from the `dist/` of `__DIST__`.

## The four questions

1. **The door.** Is the repository link gone from both Method pages, with the agenda door and every sentence of the page unchanged?
2. **The rule.** Does the new rule fail on a repository address in any built file and on a link to github.com in any built page? Do its plants bite? Does it spare the font licence files, which name other projects' repositories without linking?
3. **Nothing weaker.** Did the change to the Method page's checker or to any other check weaken a rule that protects a number, a source or a person? Is the governed-text stamp in §1.235 the real fingerprint of each changed file?
4. **Reading it.** Would the editor of a Portuguese daily print the Method page as it stands, in both languages?

Budget: at most 15 tool calls.
