# O Estado do País, what this is

*Plain-language explanation of the project. Written for anyone, not for engineers.
Rewritten 16 August 2026. This file holds the idea and points at the live pages;
it deliberately states nothing that changes over time. Everything that changes,
the site generates from its own data and publishes at the addresses listed below.
If the idea changes, change it here.*

---

## The text of the site's own About page

Decided by the director on 15 August 2026, and published at `/sobre`:

> O Estado do País mede a sociedade portuguesa, no seu contexto interno e na sua
> posição em relação ao exterior, e mantém dessa medição um registo contínuo,
> claro e permanente. É produzido maioritariamente por inteligência artificial,
> com o mínimo de intervenção humana, numa tentativa de explorar as
> possibilidades tecnológicas do presente e de levar ao limite a independência e
> o rigor.

In English, at `/en/about`:

> O Estado do País measures Portuguese society, in its internal context and in
> its standing in relation to the world outside, and keeps of that measurement a
> continuous, clear and permanent record. It is produced mostly by artificial
> intelligence, with the minimum of human intervention, in an attempt to explore
> the technological possibilities of the present and to push independence and
> rigour to their limit.

---

## Why it exists

In the director's words:

> We can only do better and improve with reliable information and measurable
> outcomes and assessments. If we can see what's happening, where and with whom
> it works, we can do more of that and less of what doesn't. Supported by facts,
> not feelings or vibes. But real facts.

It keeps score in both directions. Accountability is in scope: what was promised
is set against what was delivered, and decisions are attributed to whoever took
them. But the project does not hunt, campaign or choose targets, and it credits
as readily as it debits. A record that can only catch failure is half a record,
and the less useful half: knowing what went wrong tells you what to stop, only
knowing what went right tells you what to do instead.

Numbers about a country circulate without their origins. A figure appears in a
headline, gets repeated, gets rounded, loses its date, and eventually nobody can
say where it started or what it actually measured. Portuguese government debt is
published as several different shares of GDP for roughly the same moment, two of
them inside a single OECD document, and none of them is wrong: they measure
different things using the same words. Most publications resolve that by picking
one and sounding confident. This one resolves it by showing its work.

The spine is mechanical rather than a promise: the site cannot publish a figure
that has no source, because the build fails. Everything else hangs off that.

And the harder thing it is attempting: it is written by AI, and it says so, with
a named person accountable for it. The bet is that a publication which openly
admits its authorship has to be more checkable than a human one, not less. That
is the experiment, and whether it works is not yet known.

---

## Where to read the state, rather than a description of it

Nothing about the current state of the site is written in this file, and that is
deliberate: a description of state goes stale in silence. Each of these pages is
generated from the site's own data at build time.

| What you want to know | Where it is |
|---|---|
| What this is, in two sentences | `/sobre` · `/en/about` |
| The rules, what enforces each one, and today's proof of each | `/metodo` · `/en/method` |
| Every correction, update and provenance revision, with the old value visible | `/correcoes` · `/en/corrections` |
| Every published figure, one row each, with its source and excerpt | `/livro-razao` · `/en/ledger` |
| Every concelho in Portugal, and which ones have a page yet | `/municipios` · `/en/municipalities` |
| The studies, preserved as they were published | `/estudos` · `/en/studies` |
| What the uncertainty marker means | `/a-verificar` · `/en/to-verify` |
| The machine-readable proof of the current build | `/prova.json` |
| What is being measured now and next | not built yet; it will live at `/agenda` |

---

*Written by AI, directed by a person. The technical record lives alongside this
file in `README.md`, `DECISIONS.md` and `IDENTIDADE.md`.*
