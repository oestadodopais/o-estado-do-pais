# Leitura a frio do Codex ao bloco F1.8 (a moldura dos documentos alojados), 03.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 13:48 a 14:01 UTC, sobre um pacote com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, as tabelas a deixar de ganhar `tabindex` (o essencial do teclado perdido), na cópia e no diff, apanhada no Blocking 2 e no Blocking 3; P2, a régua a aceitar texto de células a 1,5:1, apanhada no Blocking 2 e no Major 5; P3, o relatório a dizer 0 violações graves onde o §C1 diz 1 111, apanhada no Blocking 2; P4, um carácter do corpo do documento mudado depois da moldura, apanhada no Blocking 1 (o leitor subtraiu a moldura e comparou os corpos byte a byte: 63 830 contra 63 831). Triagem do lugar de direção: o Blocking 4 é real e é a decisão deste bloco (as 1 111 violações que ficam são cores do texto das próprias obras; a segunda passagem escurece cada cor de texto abaixo de 4,5:1 dentro da moldura para o tom mais próximo que passe, mantendo a distinção de matiz que as obras usam, em vez de achatar tudo para a tinta; o que não passar diz-se com o número); os Major 6 a 9 e o Minor 11 são reais e consertam-se na segunda passagem (a paleta: a moldura e os filetes só com cores da casa, as cores interiores das obras ficam delas exceto onde o contraste falha, e o C5 fica escrito assim; o contraste dos filetes medido contra os dois fundos adjacentes; a régua a 390 e a 1 280 e dentro do `verify`; uma planta que não fica vermelha é uma falha da corrida; o `<h1>` visível, o `role` a valer `region`, o alvo do `aria-labelledby` a existir); o Major 10 é em parte do pacote (as vinte capturas existem no ramo e não foram no pacote; o SHA e a corrida faltavam porque o construtor foi interrompido por uma falha do fornecedor antes de os escrever). O texto do leitor fica como veio.*

---

## Blocking

1. **A document byte changed.** After subtracting only the new frame, the Portuguese payload grows from 63,830 to 63,831 bytes. The sole difference is `registo de projetos` → `registro de projetos`, an inserted `r`. `antes/documento-pt.html:161`, `depois/documento-pt.html:168`. Therefore the claimed “16 de 16 verdes” cannot describe the supplied artifact. `relatorio-construtor.md:41`

2. **The diff, copies, and build are not one coherent revision.**

   - The patch says serious violations fall to **1,111**; the report copy says **0** while later saying **1,111**. `diff.patch:22`, `relatorio-construtor.md:16`, `relatorio-construtor.md:36`
   - The patch tests cell text at **4.5**; the test copy uses **1.5**. `diff.patch:1339`, `tests/moldura.mjs:492`
   - The patch and source copy write `data-oedp-teclado="0"`; both built documents write `tabindex="0"`. `diff.patch:673`, `src/lib/documentos.mjs:1166`, `depois/documento-pt.html:166`, `depois/documento-en.html:19`
   - The advertised postimage hashes consequently do not match the report, test, or source copies. `diff.patch:3`, `diff.patch:377`, `diff.patch:844`

3. **The supplied implementation does not make scrolling containers keyboard-focusable.** `data-oedp-teclado` has no focus semantics, while the CSS focus rule explicitly requires `[tabindex="0"]`; role and label alone do not fix this. `src/lib/documentos.mjs:1080`, `src/lib/documentos.mjs:1166-1168`. Given the reported 92 previously unfocusable containers, a build from this source should still have 92, not zero. `relatorio-construtor.md:38`

4. **Two acceptance criteria are knowingly unmet.** C1 requires zero serious/critical axe violations, but 1,111 remain. C2 requires all table text at 4.5:1, but 50 table descendants remain between 2.83:1 and 4.30:1. Calling either a later “director decision” does not satisfy the brief. `brief.md:29-30`, `relatorio-construtor.md:54-60`, `relatorio-construtor.md:91-105`

## Major

5. **The contrast ruler can falsely pass text at 2:1.** It filters at `r < 1.5` but prints “below 4.5:1”. Removing the cell-colour override returns content whose reported minimum was 2.63:1, so the planted `texto-da-celula` defect need not fail C2. `tests/moldura.mjs:182-188`, `tests/moldura.mjs:492-503`, `relatorio-construtor.md:37`

6. **The palette claim was narrowed after the brief.** The brief requires no outside-palette colour in the documents; C5 checks only selected table and heading rules. The two explicitly identified outside-palette colours, `#16556e` and `#6fb3cc`, remain in the Portuguese CSS and are still used outside the overridden rules. `brief.md:14`, `brief.md:33`, `src/lib/documentos.mjs:951-953`, `tests/moldura.mjs:50-56`, `tests/moldura.mjs:334-370`, `depois/documento-pt.html:10-20`, `depois/documento-pt.html:63-64`

   Every distinct colour literal inside the supplied post-change `<style>` blocks, normalized to lowercase, is:

   - House banner/frame: `#585d5b`, `#17191b`, `#f6f7f4`, `#7f8681`, `#8e948f`, `#eceeea`. `depois/documento-pt.html:150-160`
   - Portuguese document: `#fafbf9`, `#1b2126`, `#5a6b72`, `#16556e`, `#d8dfdc`, `#f1f4f2`, `#edf1ef`, `#2a78d6`, `#86b6ef`, `#eb6834`, `#d7dedb`, `#93a3a9`, `#7a8a91`, `#8a5a00`, `#fbf3e2`, `#12181b`, `#e6ecea`, `#8fa1a8`, `#6fb3cc`, `#243036`, `#182024`, `#1c262b`, `#3987e5`, `#184f95`, `#d95926`, `#263238`, `#52646c`, `#7e9099`, `#e7b65c`, `#241c0c`, `currentcolor`. `depois/documento-pt.html:9-36`, `depois/documento-pt.html:70`, `depois/documento-pt.html:93`
   - English document, light: `#faf9f5`, `#141413`, `#f7f8f9`, `#ffffff`, `#f1f3f5`, `#16202a`, `#48586a`, `#7a8895`, `#dce2e7`, `#c3ccd4`, `#009aa6`, `#c85c15`, `#3f62b0`, `#6e9e1f`, `#9c4585`, `#98761b`, `#a8323a`, `#2f7d4f`, `#fbeee4`, `#f2cbaa`, `#e5a272`, `#d07a3e`, `#a85614`, `#b4bec6`, `rgba(22,32,42,.06)`, `rgba(22,32,42,.05)`. `depois/documento-en.html:1`, `depois/documento-en.html:24-31`
   - English document, dark/additional: `#0f1519`, `#161e24`, `#1c262d`, `#dde5ea`, `#9fb0bc`, `#6e808d`, `#26333c`, `#35454f`, `#189ca8`, `#de7433`, `#6486ce`, `#7ba332`, `#ba66a3`, `#a8822c`, `#d4636b`, `#4fa873`, `#38281b`, `#5a3921`, `#84512a`, `#b47137`, `#e39653`, `#3b4952`, `rgba(0,0,0,.4)`, `rgba(0,0,0,.3)`, `transparent`, `rgba(0,0,0,.1)`, `rgba(128,128,128,.28)`. `depois/documento-en.html:38-56`, `depois/documento-en.html:85`, `depois/documento-en.html:126-162`

7. **Border contrast is not reliably calculated against the actual adjacent colours.** Both themes are exercised, but border contrast is calculated against `el.parentElement`’s composed `backgroundColor`; it ignores the element’s own background, the other side of a boundary, gradients, and images. A border can therefore be 2:1 against an unmeasured adjacent colour and still pass. `tests/moldura.mjs:250`, `tests/moldura.mjs:285-297`, `tests/moldura.mjs:338-347`, `tests/moldura.mjs:425-429`

8. **The accessibility ruler is neither a gate nor responsive coverage.** It runs only at 1,280 px and is absent from both `build` and `verify`. Thus an unfocusable table that overflows only at 390 px can pass both official commands; an unfocusable container visible at 1,280 would be caught by C3. `tests/moldura.mjs:7-11`, `tests/moldura.mjs:250-251`, `tests/moldura.mjs:393-405`, `package.json:12`, `package.json:34`

9. **The planted defects are demonstrations, not enforced tests.** A failed plant only changes `bom` and printed output; final exit status is based solely on the clean baseline. `--vermelhos` can therefore display a failed mutation and still exit normally. The report supplies no mutation output, only an invocation. `tests/moldura.mjs:639-653`, `tests/moldura.mjs:681-688`, `relatorio-construtor.md:22-26`

10. **The numerical evidence is not reproducible from this package.** The report asserts 32 browser passes and exit codes but supplies only two built pages and shell commands annotated `# 0`, not the logs or result JSON. The required commit SHA and CI run remain placeholders, and the claimed captures are not included. `relatorio-construtor.md:20-28`, `relatorio-construtor.md:44-52`, `relatorio-construtor.md:164-171`, `relatorio-construtor.md:187-193`, `brief.md:39`

## Minor

11. **Several semantic checks are weaker than their labels.** The HTML gate counts `<h1>` tags without testing visibility; C3 accepts any nonempty `role` and treats any `aria-labelledby` attribute as a name without verifying its target. A hidden H1, `role="presentation"`, or dangling label reference can pass those checks. `scripts/gate-html.mjs:1290-1296`, `tests/moldura.mjs:321-324`, `tests/moldura.mjs:402-405`, `tests/moldura.mjs:508-523`

## «What is fine»

- The new prover’s geometry does cover the complete original payload from immediately after `<body>` through the first real `</body>`, then separately verifies the tail; the frame has not opened a body-byte blind spot, and a one-character payload change is caught. `src/lib/documentos.mjs:1227-1274`, `scripts/gate-html.mjs:1129-1136`
- The English payload is byte-identical after subtracting the frame: 460,763 bytes on both sides, SHA-256 `fbac892d046936d698a295d196f7a195de41646699d9217574779882fe43b2c4`. `antes/documento-en.html:13-1283`, `depois/documento-en.html:20-1290`
- Each supplied post-change page has one `<main>` and one apparently visible `<h1>`; this proves the two samples, not all sixteen. `depois/documento-pt.html:166-167`, `depois/documento-pt.html:684`, `depois/documento-en.html:19`, `depois/documento-en.html:204`, `depois/documento-en.html:1289`
- `lang`, `noindex, follow`, and the AI-label banner are byte-identical through the banner’s closing `</div>` in both supplied pairs; the new style, script, and frame begin afterward. `antes/documento-pt.html:2-159`, `depois/documento-pt.html:2-159`, `antes/documento-en.html:1-12`, `depois/documento-en.html:1-12`

**Distinct findings: 11.**