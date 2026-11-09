# The short read of CAM2-A, addendum E, 09.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

GitHub's `portão` run on head d21c48f0b (CAM2-A plus the weekly panel of 09.11.2026) went red twice. First, the coverage check refused sentences on the weekly reading and Método pages whose only change was the panel's date: the sentence key was the whole text. Second, `check:mortos` found four dead imports. Addendum E (`brief.md`) makes the key mask every number and date, and removes the imports. The diff is `diff.patch` (d21c48f0b..d9a6489a9); the implementation is commit 5314456eb. The builder's report is `relatorio-construtor.md`. The site worktree <instrumentos>/OEstadoDoPais-worktrees/cam2a-2026-11-09, with `dist/` built at 5314456eb, may be read and its scripts run without network. Write only to a temporary folder outside it, and do not build.

## The questions

1. **The mask.**
   - Does the key replace each number and date, and only those?
   - Does a sentence that changes only a date or a value keep its key?
   - Does a sentence that changes a word get a new key, including a word right after a number (who or what a figure counts)?
   - Do two sentences that differ only in their numbers count once?
2. **Where the mask applies.** Is the masked form used consistently in coverage, the register's presence check (both languages), the list and the seed? Do quotations, excerpts and provenance keep their real numbers?
3. **The weekly panel.** On the head's `dist/`, does `check:frases-afirmacao` pass with the panel's dates, and would next week's panel pass too?
4. **The dead imports.** Are they gone, and does `check:mortos` pass?
5. **The report.** Are its counts true?

Budget: at most 15 tool calls.
