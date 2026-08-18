None of the three directions completes the core promise. The printed crop and independent re-check do not exist, so tests 1 and 3 remain partial in every rationale. Test 8 is also unresolved: A reports 28 front-page values, B refuses to confirm the required 32, and C reports 35, while [acceptance-tests.md](/private/tmp/claude-501/-Users-nunosantos/ece03c34-2a58-438b-bccf-9c7ad9936a64/scratchpad/design-critique/acceptance-tests.md) requires 32 of 32. Those are not cosmetic discrepancies. They mean the designs cannot yet prove that every displayed value has its own door.

## 1. Best route to easy confirmation

A is the best base, narrowly.

Its receipt has the shortest coherent path:

1. Value and unit.
2. Attribution in a sentence.
3. Proof.
4. Returned field.
5. Exact request.
6. Verification dates.
7. Corrections.
8. Quiet provenance apparatus on the right.

It also shows one ledger row on the ledger-row page. B places a second, unrelated receipt and a prototype note beneath the first. That turns a destination for one claim into a specimen sheet. C keeps one row, but adds “Como se lê este recibo” and a long explanation inside the empty crop. The interface explains its own interface before it supplies evidence, precisely the behaviour the director rejected.

A still does not achieve confirmation. Its `fonte` links are tiny and visually close to footnotes. The headline `17,6` on the receipt has no visible seal. Its crop is an example box, not proof. But A introduces the least friction between the claim and the evidence.

B has the strongest verification components, especially the boxed source seal, exact request, provenance table and document-page button. Its central premise is weaker than it sounds, however. The yellow bars use different units and scales, each normalised to its own threshold. Their lengths invite comparison even though they are not mutually comparable. The explanatory paragraph beneath the panel is required to repair what the graphic implies. That is not easy confirmation. It is a second interpretation problem.

C makes individual sentences easiest to read, but confirmation becomes spatially expensive. The reader moves between a central column, a left gutter and a narrow apparatus margin. The national panel is also pushed far below the first instrument, so the front page stops behaving like an overview.

## 2. Legibility by depth

| Direction | Citizen, first depth | Researcher, third depth |
|---|---|---|
| A | Best overview. Eight measures are immediately available in a stable grid, although descriptions and seals are too small. | Second. The receipt has the required evidence sequence and exact request, but the apparatus is visually weak and the missing crop remains disguised as a designed block. |
| B | Weakest. Each cell asks the reader to parse a value, unit, threshold, bar, endpoint labels, explanation and source box. | Best. Provenance is fielded rather than narrated, the request is copyable, and missing evidence is structurally located. |
| C | Best sustained reading, but not the best overview. Larger type and one measure per row reduce local effort, while the long page delays comparison across measures. | Weakest. The narrow apparatus, long lateral eye movements and loosely separated proof steps slow extraction and citation. The rationale itself admits that series, `lastmod` and per-line JSON remain unresolved. |

For the audience rule, A has the soundest compromise. C optimises reading one passage. B optimises inspecting one record. A is the only one that lets a citizen scan broadly without removing the researcher’s route into the evidence.

## 3. Visible rule audit

| Rule | A | B | C |
|---|---|---|---|
| Yellow only for measurement | Clear in the ruler, map and composition bars. | Quantitative, but the independently normalised cell bars create misleading visual comparability. | The vertical yellow rule beside “Campo devolvido” is borderline. It marks a measured field, but visually behaves like generic blockquote emphasis rather than encoding a quantity. |
| Seal beside every value | Fails on the receipt headline `17,6`. | Fails on both large receipt values shown. | Fails on the receipt headline `17,6`. The rationale’s claim that the value needs no door because it is already on its own page is not an exception permitted by §5. |
| One uncertainty marker | As rendered, `EXEMPLO` exists alongside `[a verificar]`. | As rendered, `EXEMPLO` exists alongside `[a verificar]`. | `PROTÓTIPO` and `[a verificar]` appear on the same receipt. |
| Second accent | No visible breach. The altered neutral temperatures in B and C are still neutrals. | No visible breach. | No visible breach. |
| Forbidden punctuation | No unambiguous breach in house prose. The visible long separators occur in source names or returned source text, where §9 permits exact transcription. | Same. | Same. |
| Type constitution | Conforms to the three-family division. | Conforms typographically, but its 1240px wrapper departs from the prescribed 1180px layout. | Direct breach. Serif is used for headings, prose and legends despite §1 limiting it to `.wordmark`. The 1120px three-column construction also rewrites §3. |

Calling `EXEMPLO` or `PROTÓTIPO` temporary does not make the rendered states compliant. If these are design-review annotations, they should live outside the candidate interface. Inside it, they become a second public language for “this evidence is not here”.

C is not merely a visual direction under the current [IDENTIDADE.md](/private/tmp/claude-501/-Users-nunosantos/ece03c34-2a58-438b-bccf-9c7ad9936a64/scratchpad/design-critique/IDENTIDADE.md). Its [rationale](/private/tmp/claude-501/-Users-nunosantos/ece03c34-2a58-438b-bccf-9c7ad9936a64/scratchpad/design-critique/racional-c.md) explicitly proposes changing the constitution. It therefore cannot be selected as compliant without a separate identity decision.

## 4. Craft and reader cost

### A, Refinamento

The hierarchy is understandable but too even. The eight panel cells have nearly identical weight, so the eye receives a table rather than a prioritised reading. Descriptions at 1280px are small, and the repeated source footers approach the visibility of legal text.

Its masthead is the best compromise: the wordmark remains a brand, while the two labelled readings underneath make time and agenda status legible without simulating a newspaper edition.

The receipt order is the cleanest of the three. Its apparatus recedes appropriately. Its main craft failure is the seal: alignment is disciplined, but the door is too quiet for the most important interaction on the site.

Reader cost: moderate scanning, low conceptual overhead, some squinting and poor link discovery.

### B, Instrumento

The masthead is the strongest time signal. “Reconferência” and “Agenda” behave like instrument readings, with visible field boundaries and aligned values.

The panel is over-instrumented. Borders, bars, endpoint labels, seals and descriptions compete inside every cell. The mono-heavy system makes nearly everything feel equally procedural. A citizen has to decode the panel before learning from it.

The boxed seal has the strongest affordance. It visibly says `fonte`, has a boundary, and separates complete from incomplete provenance. The proposed hover and focus receipt adds useful preview information, but the acknowledged lack of Escape dismissal must be resolved before shipping.

The receipt structure is strong, but its presentation is too much like a diagnostic console. Showing two receipts and a “Nota de protótipo” on one row page is particularly damaging.

Reader cost: high scanning load, high comparison load, low ambiguity once the correct block is found.

### C, Editorial

The larger type, line-height and vertical spacing reduce sentence-level fatigue. The warm neutral palette is also calmer than the colder alternatives.

The hierarchy is editorial rather than observational. A single convergence instrument occupies most of the opening experience, while the country panel starts far down the page. This sacrifices overview for drama. Serif throughout also makes the site feel closer to a publication, contrary to both the identity rule and the request to avoid newspaper furniture.

The masthead’s time signal is weakest. The reconfirmation date and agenda counts have been compressed into faint microcopy.

The receipt’s step labels are useful, but the right margin contains instructions, provenance, related links and correction handling at nearly the same visual weight. The apparatus becomes another article to read.

Reader cost: low local fatigue, high scrolling, high working-memory cost from moving between central text and marginal apparatus.

## 5. What to graft into one design

| Component | Use | Concrete result |
|---|---|---|
| Masthead | A structure with B’s field clarity | Keep A’s wordmark scale and restrained rule. Render reconfirmation and agenda as two clearly labelled, linked readings. Do not box the whole masthead. |
| Panel cells | A grid, selective B instruments | Keep the four-by-two grid and A’s text economy. Add a bar only when it has a shared or immediately intelligible scale. Never place independently normalised bars beside one another as if comparable. |
| Seal | B’s visibility with A’s compactness | Use filled or dashed square plus visibly underlined `fonte`. Make the whole compact unit a link with a sufficient target. Show the study title on focus or in the long form, not repeated in every cell. |
| Receipt opening | A | One value, one unit, one row ID, one concise attribution sentence. Put the seal beside the headline value, even when the link targets the current row anchor. |
| Proof block | B structure, no prototype prose | Actual crop first, then “Abrir o documento na página N”, exact transcription, returned field and exact request. If the crop is absent, use only `[a verificar]` plus the typed reason. |
| Verification block | B | A compact two-row table for last read and last independent re-check. Missing re-check uses the one marker, not an example box. |
| Apparatus column | A layout with B field structure | Keep the constitutional 300px column. Include provenance fields, provenance state, data access, related appearances and correction door. Remove “how to read this” commentary. |
| Type system | A | Serif only in the wordmark, sans serif at a larger citizen-readable body size, mono for claims, labels and apparatus. Reject B’s mono dominance and C’s constitutional rewrite. |
| Rhythm | C, inside A’s grid | Increase body size and section spacing, especially in reading layers, without adopting C’s third column or excessive page length. |
| Palette | C’s warmer neutrals, cautiously | Test the warm paper and ink as neutral substitutions. Keep yellow and oxblood exactly unchanged and semantically exclusive. |
| Mobile and narrow layouts | C’s one-item rhythm | Collapse panel cells into an editorial vertical list, but retain the sans-serif type system and keep each value, title and seal in one visible group. |

All prototype commentary should be removed from the interface. Design-review explanations belong in the rationale. Public missing states belong to the data model, expressed through `[a verificar]`, a typed reason and a path to correction.

## 6. Ranked verdict

1. **A, Refinamento**
2. **B, Instrumento**
3. **C, Editorial**

A ranks first because it provides the shortest, least distracting route from claim to evidence while preserving the governing identity and a usable national overview. B ranks second because its seal and third-depth apparatus are stronger, but its incomparable bars, mono density, duplicated receipt and visible prototype commentary make the reader work too hard. C ranks third because its sentence-level legibility cannot compensate for burying the overview, weakening the time signal, expanding explanatory furniture and explicitly breaking the type and layout constitution. The right outcome is not to approve A unchanged, but to use A as the chassis, graft B’s provenance and verification mechanics onto it, and borrow only C’s larger reading scale, rhythm and warmer neutral treatment.