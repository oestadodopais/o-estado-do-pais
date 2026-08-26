# Leitura cruzada do Codex · o mapa da primeira página é navegação (26.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, em modo só de leitura e sem repositório, sobre um pacote com as páginas construídas antes (`main`, `b1e9004`) e depois (`bfbdaf9`), o script e a folha das duas construções, catorze capturas (390 e 1280, antes e depois), a Emenda 19 e a nota do construtor. Prompt em `PROMPT.md` do pacote (`scratchpad/codex-mapa/`). Custo: 192 985 símbolos. Quatro estragos plantados nas cópias do «depois», registados com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | ficheiro | o estrago | apanhado? | como o classificou |
|---|---|---|---|---|
| P1 | `depois/index.html` | um `<div data-painel="vazio" hidden>` deixado antes de `</main>` | **sim** | should fix (§1a, §2) |
| P2 | `depois/js/inicio.js` | um ouvinte `wheel` no contentor do mapa com `preventDefault` | **sim** | blocking (§1b, §2) |
| P3 | `depois/_astro/inicio.*.css` | as regras de crescimento da vista de escolha repostas no `@media (min-width: 641px)` | **sim** | blocking (§1b, §1c, §2) |
| P4 | `depois/en/index.html` | «Escreva o nome do concelho» no rótulo inglês da pesquisa | **sim** | should fix (§3) |

**Pontuação: 4 de 4.** O veredicto «No» da leitura é o das plantas: as quatro coisas que ela diz que contradizem a Emenda 19 são as quatro plantas, e ela própria notou (§3) que as capturas não as mostram e que a nota do construtor as descreve como estragos de teste.

## O que a leitura achou fora das plantas, e o que se faz

1. **A página do concelho mudou além da marca de versão** (§3): o grupo `[data-campo]`, as 308 áreas de toque `[data-alvos]` e o `data-slot` saíram, e a porta do cartão localizador passou de `/?ambito=municipio` para `/municipios`. São as decisões 4, 5 e 7 do construtor, tomadas de propósito e escritas na nota; o brief da medição cega foi emendado para as esperar. **Sem ação.**
2. **«tem página» / «sem página ainda» na pesquisa** (§5): a leitura chama-lhes estado de produção e não dado público. É a linguagem de cobertura que a Emenda 3 fixou e que `/municipios` já usa; sai por si com as páginas dos 308 (decisão 5B). **Sem ação; fica registado.**
3. **O campo de pesquisa sem script não faz nada** (§5): abaixo de 640 o campo está à vista e, sem JavaScript, não tem formulário nem destino; o comando «Concelho» continua a ser a ligação a `/municipios`. Vem do bloco A de 25.08, não deste. **Fica como defeito conhecido em `ISSUES.md` (I71), para o bloco dos 308, em que `/municipios` passa a ter os 308 e a pesquisa pode ganhar um `<form>` com destino.**
4. **Restos mortos** (§2): a consulta a `[data-sem-js]` em `inicio.js` sem elemento na página, e o atributo `data-mapa-cartao` que nada lê. `[data-sem-js]` só tem elemento na régua da convergência, que está fora da primeira página: a consulta sai no commit de fecho. `data-mapa-cartao` pareceu morto a um `grep` a `src/`, `public/` e `scripts/`, mas a matriz (`tests/inicio/matriz.mjs`, linhas 751 e 754) lê-o, e retirá-lo fê-la cair: **fica, como gancho de régua**; o erro foi do lugar de direção (regra 16: a busca tem de cobrir `tests/`).
5. **Os endereços antigos** (§4) e a **acessibilidade do mapa** (§3) lidas do código batem com o que a Emenda 19 pede e com o que o construtor mediu.

## O relatório, tal como veio

`REPORT.md` could not be created because the workspace is enforced read-only; the write was rejected and no partial file exists. Here is the completed report.

# Fresh-eyes audit of Emenda 19

## 1. Clauses (a) to (e)

- **[should fix] (a) Not verified literally.** Redirect logic exists: `depois/js/inicio.js:187-195` detects the exact prefix `"municipio:"`, chooses `pt.comPagina ? portaDoPonto(pt.slug) : indiceDosConcelhos()`, then calls `location.replace(destino)`. The old head, eight cards, `data-slot`, `data-escolher`, `data-fechar-mapa`, and `"Ainda sem linhas para"` are gone. However, Portuguese `depois/index.html:1` retains the unreachable `<div class="painel" data-painel="vazio" hidden></div>`; English does not.

- **[blocking] (b) Not verified.** Navigation is implemented: `depois/index.html:1` contains `<a class="mun-porta" href="/municipios/evora" data-mun-porta="evora"><title>Évora</title>...data-pagina="sim"...`; the other 307 dots are unwrapped circles. Hover reading is at `depois/js/inicio.js:696-705`, and keyboard reading/navigation at `:707-775`, ending in `location.assign(destinoDoPonto)` at `:740`. But `:802` installs a `wheel` listener on `[data-mapa-wrap]` that unconditionally calls `ev.preventDefault()` with `{passive:false}`. CSS line 3 also restores the old desktop rules:
  `[data-inicio][data-ambito='municipio'] .mapa-tela{width:100%...}` and `.cabeca-grelha{grid-template-columns:minmax(0,1fr)}`. These contradict “never grows” and “never captures the wheel.”

- **[blocking] (c) Not verified.** The command opens search and focuses the field: `depois/js/inicio.js:446-474` creates `{ambito: AMBITO_PESQUISA,...}` and passes `campo` to `vai()`; `:420` calls `focus()`. Without script, `depois/index.html:1` retains `<a href="/municipios" data-modo="municipio">Concelho</a>`. The 390 before/after captures are byte-identical. Nevertheless, CSS line 3 changes the map/head layout after the command writes `data-ambito="municipio"`, so “changes nothing else” is false.

- **[note] (d) Verified.** Both municipality pages retain `.mapa-cartao[data-mapa-cartao]`, `"Évora"`, and `[data-trocar]` with `"trocar de concelho →"` / `"change municipality →"`.

- **[note] (e) Cannot tell fully from a static package.** Search contains 308 names; one result is a link and 307 are inert spans labelled `"sem página ainda"` / `"no page yet"`. This proves the search path exists, but not its usability in each dense cluster. No district map is present; `NOTAS.md:125-126` calls the dense target and 308 pages future work.

Therefore the change is not “only that.”

## 2. Remnants of choosing view and lens

- **[blocking] Executable wheel capture:** `depois/js/inicio.js:802`, exact fragment:
  `t.addEventListener('wheel',function(ev){ev.preventDefault();},{passive:false})`.

- **[blocking] Executable old layout:** `depois/_astro/inicio.CYmXWYkV.css:3`, the two municipality-state rules quoted above. They are reachable because `AMBITO_PESQUISA` is exactly `"municipio"` (`depois/js/inicio.js:76`) and `aplica()` writes it to `data-ambito` (`:338`).

- **[note] Removed cleanly:** no executable `touchstart`, `touchmove`, `touchend`, or `dblclick`; no JS `transform`/`scale` write; no `touch-action`, `.mapa-fechar`, or `[data-alvos]` stylesheet rule. Their occurrences at JS `:127-148`, `:549-574`, and `:777-789` are comments only.

- **[note] Intentionally retained:** `.mun-porta .mun{pointer-events:all}` makes the linked dot clickable. `.mapa-svg .cursor-ring{...pointer-events:none}` prevents the exploration ring blocking dots. Keyboard exploration at `depois/js/inicio.js:604-775` is documented and not a defect. `"municipio:"` at `:189-192` exists solely for compatibility redirects. `[data-trocar]` remains only on municipality locator cards. The 18 `"fechar"` / `"close"` strings on each front page are `.peca-abrir-f` detail toggles, not the removed map-close command.

- **[should fix] Dead remnants:** Portuguese `depois/index.html:1` has the empty `[data-painel="vazio"]`, although `chaveDoBloco()` cannot return `"vazio"` (`depois/js/inicio.js:329-331`). `[data-mapa-cartao]` remains on both front pages, but no JS or CSS selector uses that data attribute. JS `:79-81` queries `[data-sem-js]`, while neither front page contains one.

## 3. Regressions and unchanged surfaces

- **[blocking] Captures do not represent the two trailing mutations.** Five pairs are byte-identical: `inicio-390`, `concelho-premido-390`, `inicio-1280`, `en-inicio-1280`, and `evora-1280`. Only the two desktop municipality-command captures differ. Yet the delivered JS blocks the wheel and the CSS contains the old layout rules. `NOTAS.md:107-108` identifies these exact snippets as deliberately planted test failures, while `:40,61,75` claims they were removed.

- **[should fix] Municipality pages changed beyond a version stamp.** In both Évora editions, `[data-campo]` changed from one node to zero; `[data-alvos]` and its 308 `.mun-alvo` rectangles changed from 1/308 to 0/0; `<span data-slot="nome">Évora</span>` became bare `"Évora"`. The locator link changed from `href="/?ambito=municipio"` to `href="/municipios"`; English changed to `/en/municipalities`. These are markup and destination changes in addition to the stylesheet filename. Their captures remain identical because these changes are visually silent in that state.

- **[should fix] English leakage:** `antes/en/index.html:1` used `"Type the name of the municipality"`. In `depois/en/index.html:1`, selector `label[for="pesquisa-concelho"]`, it became `"Escreva o nome do concelho"`.

- **[note] No detected regression elsewhere:** `municipios/index.html` and `en/municipalities/index.html` are byte-identical. The five `[data-cabeca^="regiao:"]`, five `[data-painel^="regiao:"]`, country head/panel, and `[data-grupo="densidade"]` serialize identically in both languages. Density strings remain `"Relance"` / `"Leitura breve"` and `"At a glance"` / `"Brief reading"`.

- **[note] Map accessibility markup is unchanged:** the SVG link already existed before and retains `<title>Évora</title>`. The SVG retains `role="img"`, its language-specific `aria-label`, and `aria-describedby="mapa-descricao"`. JS continues to add a wrapper Tab stop and `role="application"` at `depois/js/inicio.js:707-711`.

## 4. Old addresses

- **[note] `/?ambito=municipio:evora` → `/municipios/evora`.** Évora has `comPagina=true`; `portaDoPonto()` reads the link’s `href` (`depois/js/inicio.js:177-195`).

- **[note] `/?ambito=municipio:braganca` → `/municipios`.** Bragança exists in `porSlug` but lacks `data-pagina="sim"`; the false branch reads the Concelho command’s `href` through `indiceDosConcelhos()` (`:182-194`).

- **[note] `/?ambito=municipio` remains on that front-page query and opens search.** It does not match `"municipio:"`; `resolveAmbito()` accepts exact `AMBITO_PESQUISA` (`:187-205`).

- **[note] `/?ambito=regiao:alentejo` remains on the front page in the Alentejo state.** `resolveAmbito()` accepts it because `[data-cabeca="regiao:alentejo"]` exists (`:205`); `aplica()` selects the matching head and panel (`:363-365`).

## 5. Other flags

- **[should fix] Reader-facing implementation prose:** `.pesquisa-cobertura[data-cobertura]` renders `"tem página"` once and `"sem página ainda"` 307 times; English renders `"has a page"` once and `"no page yet"` 307 times. These describe page-production status, not public data.

- **[note] Inert no-script control:** under `@media (width<=640px)`, CSS line 1 forces `[data-inicio] .pesquisa-bloco{...display:flex}`. Its `<input type="search" data-pesquisa>` has no form, name, submit control, or non-script results, so typing does nothing without JavaScript. The separate Concelho link still works.

**Verdict: No; most navigation/state removal is present, but the package restores wheel capture and old desktop layout, leaks Portuguese into English, leaves dead remnants, and changes the municipality page beyond its version stamp.**