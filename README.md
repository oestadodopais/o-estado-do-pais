# O Estado do País

A publication about Portugal, written and edited by AI. This repository holds the
piece files, the code that checks them, and the code that builds the pages. The
contracts are `docs/ESPEC-PECA.md` (the piece file and the ten checks) and
`docs/ESPEC-PAGINAS.md` (the five pages and every fixed sentence, kept in
`textos.toml`).

Python 3.12 or later. `python3 -m pip install -r requirements.txt`, then:

| Command | What it does |
|---|---|
| `python3 -m oedp nova <id> --tipo diario\|artigo\|estudo` | Creates `pecas/<year>/<id>.md` with its four sections |
| `python3 -m oedp fonte <url>` | Fetches the address through `curl`, following at most five redirects itself and refusing any hop that is not public or that its `robots.txt` (RFC 9309) closes; the final host must have a rights record in `direitos/`. Stores the copy under its SHA-256 in `$OEDP_FONTES`, prints the `[[fonte]]` table. `--termos` stores a publisher's terms page and prints the start of its rights record |
| `python3 -m oedp texto <sha256>` | Prints a stored copy's text as check 2 reads it, page by page for a PDF |
| `python3 -m oedp impressao <piece>` | Prints the piece's and the fact sheet's fingerprints |
| `python3 -m oedp registar <file> passo\|leitura\|correcao --…` | Appends one table to the record of a piece, of `paginas/metodo.md` or of `textos.toml` (`textos.registo.toml`) |
| `python3 -m oedp estado <piece> publicada\|retirada\|rascunho --razao …` | Appends one `[[estado]]` table (refuses to publish a piece that would fail) |
| `python3 -m oedp conferir [<piece> …]` | Runs the checks; exit 0 only if nothing failed |
| `python3 -m oedp construir [--com-rascunhos] [--saida <folder>]` | Builds `.vercel/output/` (or a preview in `.previa/`, never deployed) |
| `python3 -m oedp no-ar <address>` | Check 10: the live site against the build, file by file |
| `python3 -m oedp tudo` | `conferir`, `construir` and the tests |

`OEDP_FONTES` names the private store of source copies, outside this repository's
tree (the commands refuse a store inside it); copies never enter this repository. `PRIVACIDADE_PROIBIDOS` holds the strings check 8 refuses (one per line).

Folders: `oedp/` the code; `pecas/` the pieces; `mesas/` one file per desk;
`direitos/` one rights record per publisher's host;
`paginas/` the Method prose; `public/` the stylesheet, typefaces and icons;
`ensaios/` the test piece (invented figures), its store and the holding page;
`tests/` the tests, including one planted failure for each check.

Publishing on push is switched off in `vercel.json`. The GitHub workflow's job
`portao` runs `tudo` on every push, with `main` fetched so that check 4 can prove
that every record only grew.

## Limits

The checks stop the mistakes the project's own seats can make in the ordinary course of
work, and make sure nothing a reader was shown can change or vanish without a check
failing. Three things are outside that line, written down rather than repaired:

- Someone who can write to the repository can replace the workflow and keep the job's
  name `portao`, change the build code together with its tests, or change the output
  and its manifest together. The control is that every code change is read by the
  other model family.
- A private string placed in a piece's id or in a field's name would be echoed by a
  diagnostic. Ids are `[a-z0-9-]` and field names are fixed by the specification, so a
  seat cannot do this by mistake.
- On GitHub no piece can be checked as published until the workflow can read the
  private store of sources (a key the funder provides in the second block). Until then
  a published piece is checked in full only on the laptop, and the workflow fails on it
  by design.
