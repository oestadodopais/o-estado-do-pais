# Cold read of the workflow `ensaio-diario.yml` (the motor of "O Estado do País")

You are a cold reader from a different model family than the author of this workflow. You have read-only access to this package folder and nothing else: no network, no git repository. Your job is to find what is wrong, unsafe, undocumented or contradicted in this workflow, and to say precisely where.

## What the package contains

- `.github/workflows/ensaio-diario.yml`: the file under review, written on 04.09.2026 in a hurry, without a second reader.
- `.github/workflows/corredor.yml`: the workflow it dispatches; its first job (`modo`) decides what a dispatch may do, and its `workflow_dispatch` inputs are declared there.
- `contexto.md`: why the file exists, what it must guarantee, the runs it produced (with what happened in each), and what the plan requires of an "ensaio".

## What to verify

1. Does the code do what its comments say: the schedule (which days, which months, which years), the permissions, the REST call and each input it passes, the motive text, the failure behaviour?
2. Can it ever dispatch `real`, dispatch twice in a night, or dispatch outside the intended dates? Check against what `corredor.yml` actually accepts and refuses.
3. Do the inputs it passes produce the ensaio the plan requires (all addresses, no bodies, a written motive)? Compare the inputs with the declarations and defaults in `corredor.yml`.
4. Security: token scope, what a `workflow_dispatch` motive from a human could inject into the shell, what the `GITHUB_REF_NAME` reference can be when the trigger is manual on another branch.
5. The runs in `contexto.md`: what they say about the workflow's behaviour (start times against the cron, results), and whether any claim in the file's comments is contradicted by them.
6. Anything the comments promise and the code does not deliver, or the code does and the comments do not say.

## How to report

Write in English. Use exactly these four sections, in this order: `## Blocking`, `## Major`, `## Minor`, `## «What is fine»`. Number the findings consecutively. Each finding is one bold sentence with the claim, then the evidence in two to five sentences, then a comma-separated list of references in the form `path:line`, with paths relative to this package folder. A finding without a `path:line` reference does not count. Do not propose redesigns; report defects, contradictions and unproven claims. Do not pad.
