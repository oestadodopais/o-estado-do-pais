# O Estado do País — Brief for Counsel

**Prepared:** 2026-08-12 · **Status:** DRAFT — facts require confirmation by the client before sending (see §7)

---

## 1. Purpose

This brief seeks advice on thirteen questions, grouped in four clusters, before a
publication launches. Each question is annotated with **what we currently
believe, at what level of confidence, and what work it blocks** — so the
engagement can correct our position rather than build one from nothing.

We have deliberately scoped this. §6 states what we are **not** asking.

**Ideal form of answer:** short written positions per question, flagging where
the answer is genuinely uncertain rather than resolving it artificially. We would
rather have "this is unsettled and here is the risk" than a clean answer that
does not survive contact with a regulator.

---

## 2. The publication

**What it is.** A public-interest observatory of Portugal: statistical indices,
long-form studies, and "stewardship accounting" of municipal government —
recording what an administration inherited, decided, and left. Every published
figure resolves to a source record; the site build fails if a number lacks one.

**How it is made.** The text is **written by AI (Claude) and directed by a named
human**, who sets scope, approves method, can reject or alter any study, and
holds editorial responsibility. AI authorship is disclosed on every page. This is
central to several questions below.

**Who runs it.** Nuno Paulo dos Santos — Portuguese national, resident in the
United Kingdom. Sole operator and named director. `[CONFIRM: how much personal
detail you want disclosed in this brief]`

**Technical.** Static site (Astro) hosted on Vercel; canonical domain
`oestadodopaís.pt` (punycode `xn--oestadodopas-2fb.pt`), registered in Portugal
at PTServidor on 2026-08-12. Private source repository. Currently live but
shielded from indexing; **not yet launched**.

**Funding.** None. No sponsorship, grant, advertising, or reader revenue. No
funding model has been declared. `[CONFIRM: still accurate]`

**Scale planned.** ~308 per-municipality pages, plus a "governance spine" —
a structured record of who held municipal office, when, and under which party.
No such open structured dataset presently exists in Portugal.

**Archive.** Ten studies across thirteen editions, hosted byte-for-byte with a
SHA-256 manifest, published in Portuguese and English from a single build.

---

## 3. The jurisdictional question, up front

The publication has a **split character** and we would like this addressed
explicitly, since it may affect every answer below:

- The **operator** is resident in the United Kingdom
- The **domain** is Portuguese (`.pt`), registered with a Portuguese registrar
- The **subject matter** is Portuguese public administration
- The **hosting** is on a US-headquartered platform with EU regions
- The **regulatory frame** invoked (AI Act, GDPR, database rights) is EU

**Q0. Which law governs, for each of the clusters below — and does the operator's
UK residence create exposure, protection, or merely complication?** If the answer
differs by cluster, we need to know which.

---

## 4. The questions

### Cluster A — Extraction and re-use of public data
*Gates: the municipal fan-out, and the project to liberate DGAL accounts data.*

**A1.** Several intended sources are Portuguese public statistical databases —
DGAL *Contas de Gerência*, INE series, PORDATA, DGT cartography (CAOP), APA/SNIRH
water data (see Annex A). **Does systematic extraction of substantial parts of
these engage the *sui generis* database right (Directive 96/9/EC), and does the
volume extracted or the attribution given change the answer?**

*Our position, revised 2026-08-12 after checking the actual licences (Annex A):*
this question is **narrower than we first thought**. Two of the five sources —
INE and DGT/CAOP — publish under **CC BY 4.0**, and clause 4 of that licence
expressly grants "the right to extract, reuse, reproduce, and Share all or a
substantial portion of the contents of the database" where the licensor holds
sui generis database rights, conditioned on attribution in the specified form.
On its face that licenses the exact act we were concerned about.

**So the residual question is about the other sources, not about public data
generally.** Specifically:

- **A1(a)** Do we read CC BY 4.0 clause 4 correctly — does it dispose of the
  database-right question for INE and CAOP, given the licensor grants only rights
  it actually holds?
- **A1(b)** **PORDATA is the real exposure.** It is a private foundation (FFMS)
  compiling public data — the textbook sui generis scenario — and **we could not
  locate its data-reuse terms at all**: the terms URL returns 404 and the
  foundation's general terms do not address data reuse. What is our position
  extracting from a source whose terms we cannot find?
- **A1(c)** DGAL and APA/SNIRH terms not yet retrieved (Annex A).

*Confidence: medium on A1(a); none on A1(b).*

**A2.** **Does publishing derived analysis and recomputed indicators — rather
than republishing the source series — alter the position under A1?**

*Our position:* we assume it helps but does not resolve it. Confidence: low.

**A3.** The archive hosts **byte-exact copies of documents**, currently our own.
We may wish to mirror third-party official documents so that citations remain
resolvable when the issuing body withdraws them. **On what basis, if any, may we
do that — and does an official-documents exception apply in Portuguese law?**

*Our position:* our own documents are unproblematic; third-party mirroring needs
a basis we have not identified. Confidence: low.

**A4.** Studies quote from official reports at length. **What is the scope of the
citation exception under Portuguese copyright law — by purpose, proportion, and
attribution requirement?**

*Our position:* narrower than US fair use; long extracts are the risk, short
quotes are not. Confidence: low.

**A5.** *(added 2026-08-20)* We compute sums for one municipality over the
**PRR beneficiaries dataset** published by the Estrutura de Missão Recuperar
Portugal on dados.gov.pt (`dataset-estrutura-de-missao-prr-entidades-1`). The
dataset's own licence field reads **«Licença não especificada»**
(`notspecified`, re-checked 2026-08-20), while the platform's terms of use state
that data uploaded by State bodies are published under **CC BY 4.0 «exceto se
houver uma especificação em contrário»**, and the Recuperar Portugal website's
terms claim all its content as its property with no reuse terms. The publisher
replaces the single resource every day under a new dated name, so no snapshot
is archived by the source. **May we host a copy of a dated snapshot (about 110
MB of XLSX) or an extract of it, so that readers can reproduce our sums, on the
strength of the platform default? Or does «não especificada» displace the
default, leaving us with no licence at all?** Until answered, we host nothing
from it: the three sums stay marked as not reproducible from our site, and the
rows record only the files' names, dates and SHA-256 digests.

*Our position:* the platform default probably applies to a State body's upload
with an unfilled field, but «não especificada» is a specification of sorts, and
the website's property claim points the other way. We will also ask the
publisher to state the licence in writing, which would moot this. Confidence:
low.

### Cluster B — Named individuals and personal data
*Gates: the governance spine and all stewardship accounting. **The highest-risk cluster.***

**B1.** The governance spine will record **named officeholders and their party
affiliation** over time. **Is publishing party affiliation of named individuals
processing of special-category data under Article 9 GDPR? If so, what lawful
basis is available to us?**

*Our position:* we believe political opinions are special-category data and that
this may apply to recorded party affiliation of officeholders, but we do not know
whether the manifestly-made-public or public-interest routes cover us.
**Confidence: very low. This gates a substantial piece of work we have not yet
started, which is why we are asking now.**

**B2.** **Does the journalistic / public-interest expression exemption in
Portuguese law extend to a publication whose text is AI-written under human
editorial direction?** We are not a registered media outlet and the operator is
not a credentialed journalist.

*Our position:* unknown, and we consider this genuinely uncertain rather than
merely unresearched. Confidence: none.

**B3.** The publication promises **permanence**: stable URLs, a preserved
archive, and a correction log that is never erased. **How do rights of erasure
and rectification interact with that promise, particularly for a named official
who later objects to a historical record?**

*Our position:* we expect the exemption to help but have no view on its limits.
Confidence: none.

**B4.** Municipal records name **non-political officials** — technical staff,
department heads. **Does our position differ for individuals who hold public
office without having sought public life?**

*Our position:* we assume a higher bar and intend to withhold such names by
default. We would like to know whether that instinct is legally required, merely
prudent, or insufficient.

### Cluster C — Our own rights: authorship, licensing, marks
*Gates: the rights page, the licence declaration, and trademark filing.*

**C1.** The prose is machine-written under human direction. **What, if anything,
attracts copyright protection — and does the selection, arrangement and
verification structure of our source ledger attract protection separately from
its contents?**

*Our position:* purely AI-generated text likely attracts thin or no protection in
the EU; the arrangement of a database may be protected separately. We have
planned on the assumption that our defensible assets are the trade mark and the
domain, not copyright. **We would like that assumption tested.** Confidence:
medium on the direction, low on the detail.

**C2.** **What outbound licence should apply, per output type** — prose, datasets,
charts, the method statement — **and how do we correctly carve out (a) archived
third-party documents we do not own and (b) our own trade mark**, so a site-wide
licence does not purport to grant what we cannot grant?

*Our position:* permissive (CC-BY) on prose and data, because citation is the
goal; all rights reserved on the mark. Confidence: medium.

**C3.** The name is descriptive of the publication's subject. **Is it registrable
as a word mark, which classes should we file in, and is a figurative mark the
appropriate fallback?**

*Our position:* word-mark registrability is doubtful on descriptiveness grounds;
a figurative mark protecting the logotype is the likely route. Confidence: medium
on the problem, none on class selection.

### Cluster D — Compliance posture
*Gates: launch.*

**D1.** **EU AI Act Article 50(4)** requires labelling of AI-generated text
published to inform the public on matters of public interest — which describes
this publication precisely. The exemption is **conjunctive**: the obligation does
not apply where the content "has undergone a process of human review or editorial
control **and** where a natural or legal person holds editorial responsibility for
the publication of the content."

The Commission's guidance of 2026-07-20 defines the limbs. **Human review** means
"deliberate examination of the substance of the content by one or more natural
persons possessing relevant knowledge and professional judgement pertaining to
the subject matter under scrutiny (e.g. academic peer review or professional
validation chains)". **Editorial control** means authority to "approve, alter or
reject the substance of the text based on substantive grounds (incl. factchecking
of information and ensuring the trustworthiness of sources)".

**Three questions:**
- **D1(a)** Does our director satisfy the editorial-responsibility limb? (We
  believe clearly yes.)
- **D1(b)** Does our process satisfy the review/control limb, given that the
  substantive grounds named — fact-checking and source trustworthiness — are what
  our provenance ledger and independent verification pass are built to do, but the
  reviewer is a sole non-specialist director rather than a subject-matter expert
  or an editorial team?
- **D1(c)** **What evidence must we create and retain** to rely on the exemption?
  This is the question we most want answered.

*Our position:* we believe we qualify and intend to **disclose fully regardless**.
We are asking in order to know what record to keep, not to avoid labelling.
Confidence: high on D1(a), medium on D1(b), none on D1(c).

**D2.** **Which digital accessibility regime, if any, binds a free,
privately-operated publication** — the European Accessibility Act, the Web
Accessibility Directive, both, or neither? **And would adopting a funding model
later change that answer?**

*Our position:* possibly neither, since we are neither public sector nor selling
a service. We intend to meet WCAG 2.2 AA regardless. Confidence: low.

**D3.** **Are there Portuguese media-law obligations we have not identified** —
registration, a statute of editorial responsibility, right-of-reply obligations,
or ERC oversight — **that attach to a publication of this kind?**

*Our position:* unknown. We note that the ERC opened proceedings against another
Portuguese publication on 2026-07-28 concerning unidentified municipal
sponsorships. We take no funding and intend to take none from any body we
measure, but we would like to understand what regime we sit in.

---

## 5. Priority

**Launch-blocking:** D1, D3, C2, and B2.
**Blocks the next build phase:** A1, A2, A5, B1.
**Can follow:** A3, A4, B3, B4, C1, C3, D2.

---

## 6. What we are NOT asking

To keep the engagement contained, we do not need advice on: company formation or
corporate structure; tax; employment; contracts with third parties; defamation
strategy in the abstract (we will return with specific findings if needed); or
platform terms with our hosting provider.

---

## 7. Before this is sent — client checklist

- [ ] Confirm the personal details in §2 you are content to disclose
- [ ] Confirm funding position is still "none declared"
- [ ] Confirm the source list in Annex A is complete and accurate
- [ ] Confirm the domain and registration facts
- [ ] Decide whether to name the AI system used, or describe it generically
- [ ] Confirm you want C3 (trade mark) in scope, or whether that goes to an IP
      attorney separately

> **Note on accuracy.** Facts in this brief were assembled from project records.
> Advice is only as good as the facts it rests on — please read §2 and Annex A
> line by line before sending, and correct anything that is wrong or stale.

---

## Annex A — Intended data sources

`[CONFIRM AND COMPLETE — this list drives Cluster A and must be accurate]`

Terms retrieved 2026-08-12 where marked. **Client to confirm the source list is
complete** — advice on sources we failed to list is advice we did not buy.

| Source | Holder | Licence / terms | Status |
|---|---|---|---|
| Municipal series | **INE** | **CC BY 4.0.** Commercial use expressly permitted. Required attribution: *"Fonte: Instituto Nacional de Estatística, IP – Portugal (identificação da informação estatística referida, período de referência da informação)"*. Silent on bulk/automated access; does not itself mention database rights. | ✅ Verified from INE's own terms page |
| **CAOP** administrative boundaries | **DGT** | **CC BY 4.0.** Required credit: *"Informação geográfica cedida pela Direção-Geral do Território"*. Distributed via dados.gov.pt and a public GitHub repository. | ✅ Verified (via dados.gov.pt / DGT pages) |
| Various indicators | **PORDATA** (Fundação Francisco Manuel dos Santos) | **UNRESOLVED.** `pordata.pt/pt/termos-e-condicoes-de-utilizacao` returns **404**; the foundation's general terms and conditions cover its online store and website, not data reuse. No licence located. | ⚠️ **Highest risk — see A1(b)** |
| *Contas de Gerência* 2003–2024 | **DGAL** | Not yet retrieved. Data exists as XLS/ODS; the analysis is trapped in a Calaméo flipbook. | ⬜ Outstanding |
| Water storage / reservoir data | **APA / SNIRH** | Not yet retrieved. | ⬜ Outstanding |
| PRR beneficiaries and project locations (daily XLSX, resource replaced every day) | **Estrutura de Missão Recuperar Portugal**, via dados.gov.pt | Dataset field **«Licença não especificada»** (`notspecified`; re-checked 2026-08-20 on the platform's API, no contact point listed). Platform terms: State bodies' uploads are CC BY 4.0 «exceto se houver uma especificação em contrário». recuperarportugal.gov.pt terms: all content the property of Recuperar Portugal, no reuse terms. | ⚠️ **Unresolved — see A5**; nothing hosted until answered |

**Why the CC BY 4.0 finding matters.** Clause 4 of the 4.0 licence
([legal code](https://creativecommons.org/licenses/by/4.0/legalcode.en)) states
that where the licensed rights include sui generis database rights, the licence
grants "the right to extract, reuse, reproduce, and Share all or a substantial
portion of the contents of the database", subject to the attribution conditions.
This appears to license precisely the systematic extraction we were concerned
about — for INE and CAOP only, and only to the extent those bodies hold the
rights they purport to license. **This is our reading, not advice; A1(a) asks
counsel to confirm or correct it.**

**Outstanding actions (ours, not counsel's):**
1. Locate PORDATA's actual data-reuse terms, or record that none is published
2. Retrieve DGAL and APA/SNIRH terms
3. Archive a dated copy of every terms page retrieved — terms change, and the
   licence that applied when we extracted is the one that matters
4. Ask the Estrutura de Missão Recuperar Portugal, in writing, to state the
   licence of the PRR dataset (A5); a written answer moots the question
