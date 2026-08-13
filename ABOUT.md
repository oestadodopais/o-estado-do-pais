# O Estado do País — what this is, and why

*Plain-language explanation of the project. Written for anyone, not for engineers.
Last updated 13 August 2026. If something below stops being true, change it here —
this file is the source, and the shared link is generated from it.*

---

## In one sentence

**A website that measures Portugal, where every single number tells you exactly
where it came from.**

Not a news site, not a blog, not a think tank. A standing record of the
country's condition — the economy, housing, water, employment, local government —
where you can take any figure and see the source document, the exact sentence it
came from, the date it was read, and, if it was calculated, the arithmetic.

---

## Why it exists

In the director's words:

> We can only do better and improve with reliable information and measurable
> outcomes and assessments. If we can see what's happening, where and with whom
> it works, we can do more of that and less of what doesn't. Supported by facts,
> not feelings or vibes. But real facts.

That is the whole purpose, and it is worth being precise about what kind of
purpose it is. This is **not** a watchdog project. The point is not to catch
people out. The point is that improvement is impossible without measurement you
can rely on — and that most public argument runs on numbers nobody can check,
which means it is really running on feeling.

If you can see clearly what is working, and where, and under whom, you can do
more of it. That is the entire ambition.

### The shape of the failure

Four ways this goes wrong, none of which requires anybody to be dishonest:

- **Decisions taken on impression.** Money committed to what feels urgent, rather
  than to what measurement would have identified.
- **Problems left alone because nobody counted them.** A loss that never appears
  in a figure never appears on an agenda either.
- **Responsibility that moves on before the result arrives.** Whoever decided is
  rarely still in the job by the time the outcome is legible, so the decision and
  its consequence are never put side by side.
- **Good work going unrecognised.** This is the one people forget. Where nothing
  was measured, someone who genuinely improved things gets no credit for it — and
  what actually worked is lost along with the recognition.

That last one is why this project is not adversarial by design. A record that can
only catch failure is half a record, and the less useful half: knowing what went
wrong tells you what to stop, but only knowing what went right tells you what to
do instead.

---

## The problem it addresses

Numbers about a country circulate without their origins. A figure appears in a
headline, gets repeated, gets rounded, loses its date, and eventually nobody can
say where it started or what it actually measured.

A real example from this project's own research: Portuguese government debt is
published as **89,7%** *and* **93,6%** *and* **94,9%** *and* **99,3%** of GDP for
roughly the same moment — two of those inside a single OECD document. None of
them is wrong. They measure different things using the same words.

Most publications resolve that by picking one and sounding confident. This one
resolves it by showing its work.

There is also a specific gap. Before anything was built, we checked whether this
already existed. It doesn't: nobody combines rigorous per-number sourcing with
coverage of all 308 municipalities and an honest account of who governed what,
when. The nearest Portuguese equivalent publishes snapshots with no methodology,
and its published "dataset" turns out to contain screenshots.

---

## What actually makes it different

One idea, and it is mechanical rather than a promise:

> **The site cannot publish a number that has no source.**

Not "we try not to". The site literally fails to build. If a figure is written
into a page without a recorded source, the whole thing stops and nothing gets
published. That is the spine of the project, and everything else hangs off it.

Then a set of habits that follow from it:

- **Corrections are public, dated and permanent.** The old value stays visible
  with a line through it. Nothing is quietly edited. Correcting in silence is the
  cheapest way to lie.
- **"We don't know" is an acceptable answer.** Where the data doesn't exist, the
  site says so instead of reaching for something plausible.
- **Uncertainty is marked, not smoothed.** A figure that hasn't been confirmed
  yet is visibly flagged as unconfirmed rather than presented as settled.
- **The choice of what to measure isn't ours.** The front page carries the
  indicators the European institutions actually use to assess Portugal, with
  their own published thresholds — so we aren't picking the numbers that suit an
  argument.
- **No rankings of political parties.** Averaging outcomes by party, ignoring
  which places each party actually governs, produces arithmetic that misleads. It
  would also be the wrong tool for the job: the aim is to find what works so it
  can be repeated, not to score teams.
- **No money from anyone the site measures.** Self-funded, and stated on the page.

---

## The harder thing it is attempting

**It is written by AI, and it says so on every page, with a named person
accountable for it.**

This is the genuinely risky part, and it is deliberate. Roughly 20% of people
trust AI-produced answers about news, against 37% for news generally. The easy
path would be to keep quiet about the authorship. The bet here is the opposite:

> If an AI writes the publication, it has to be **more** checkable than a human
> one, not less. So make every claim traceable, publish every correction, disclose
> the authorship openly, and let people verify instead of asking them to trust.

Which sets up the question the project is really testing:

**Can a publication that openly admits it is written by AI earn credibility
through machinery, rather than borrowing it from an institution?**

Nobody has an answer, because as far as we could establish, no disclosed
AI-authored data observatory exists anywhere. This is the experiment.

---

## Where it stands

Live but not launched — it works, it is online, and it is deliberately hidden
from search engines while the last pieces are finished.

**Built so far**

- A front page carrying the indicators the European institutions use to judge
  Portugal, against their own official thresholds.
- Two instruments you can use rather than just look at: where Portugal sits
  against the European average, and all 308 municipalities plotted at their real
  geographic positions.
- An archive of ten studies, preserved exactly as they were published.
- A public corrections log, live from day one.

**Before launch**

Publishing the source record itself, so that traceability is something a reader
can actually click through to, rather than something the site claims about
itself.

**After that**

The long project: a page for each of the 308 municipalities, and an honest
account of who governed each one — what they inherited, what they chose, and what
they left behind. Judged against standards published *before* the verdict, with
the things outside a mayor's control stated plainly. About a third of councils
changed president in 2025 because of term limits rather than votes, and any
reading that ignores that is a bad reading.

---

## What we don't know yet

The director's own caveat, and it belongs in this document rather than being
tidied away:

> I don't know if we will achieve it.

The open questions are real ones. Whether a disclosed AI-authored publication can
be trusted at all. Whether the sourcing discipline survives contact with the
volume of work that 308 municipalities implies. Whether anyone comes.

The project's answer to all three is the same as its answer to everything else:
publish the method, publish the corrections, and let the record be checked.

---

*Keep this page current. It should change when: the launch happens; the scope
changes; the funding position changes; or any commitment above stops being true.
It is intended for a general reader — if a paragraph here needs technical
knowledge to follow, that paragraph is wrong.*

*Written by AI, directed by a person. The technical record lives alongside this
file in `README.md`, `DECISIONS.md` and `IDENTIDADE.md`.*
