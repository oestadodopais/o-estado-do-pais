# Leitura cruzada do Codex · a segunda passagem de voz nos documentos (27.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre os doze diffs da passagem (`publisher/voz-2026-08-27/diffs/`), a disposição sentença a sentença, três páginas de leitura construídas (04 pt e en, 09 pt) e a página do estudo 04, com os excertos das Emendas 15 e 18. Custo: 275 264 símbolos, 820 s. Três plantas, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | no diff do 07 en, uma linha retirada com uma figura que não existe em mais lado nenhum («63 418 907 euros») | **sim**: bloqueante, «silently removes», e a diferença entre gémeos que ela cria |
| P2 | na página de leitura do 09, uma frase deixada («Este documento foi reconciliado contra o registo antes de ser publicado…») | **sim**: «one sentence outside the record» |
| P3 | na disposição, um veredicto FICA com a razão «facto» sobre uma frase de diligência | **não**: a linha plantada foi escrita sem a coordenada que as outras têm (empacotamento do lugar de direção), e a leitura não a considerou |

**Pontuação: 2 de 3.** A P3 falhou pela forma da planta e não pela leitura: as plantas seguem a forma exata das linhas do ficheiro, ou não medem nada.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **«270 contratos» desaparece sem outra ocorrência**: é a figura `base-ulsac-combined-contracts`, declarada caída no motor com a frase do rascunho retirado que a levava; a auditoria mecânica do lugar de direção confirma que as quatro figuras caídas são as declaradas e nenhuma outra. **Sem ação.**
2. **Duas substituições usam formas flexionadas** («limits» por «limit», «fundida» por «fundir/fundiu»): as palavras são do documento noutra flexão. **Decisão do lugar de direção: uma flexão de uma palavra do documento é uma palavra do documento**; fica registado, sem ciclo novo.
3. **As páginas de leitura do 04 e do 09 ainda descrevem o procedimento do documento** («This document read 600 of them», «established by probe rather than asserted», «refuted by the two probes above», «lidos quadro a quadro», «O que verificar a seguir», «este documento deixa os buracos à vista», e mais: doze blocos no 04, cerca de vinte no 09), mantidos pela disposição como ressalvas que qualificam figuras ou como conclusões, e a lista dos FICA cujas razões a leitura não aceita. **É a linha que o diretor traça**: a passagem cortou 386 frases e estas são as que ficam entre «ressalva de uma figura» e «o documento a contar o que fez». Vai ao diretor com os exemplos, como terceira passagem do motor se ele a quiser; não trava esta fusão.
4. **Gémeos**: além da planta, cortes só em português de frases sobre a geração da tradução (inofensivos, como a leitura diz). **Sem ação.**

## O relatório, tal como veio

I could not create `REPORT.md`: the workspace is read-only and the write was rejected. The completed report text is below.

# Fresh-eyes voice audit

**Verdict: FAIL. Two figures disappear, one silently; invented wording and substantial self-explanation remain.**

## Findings

- **[blocking] Two figures are gone.** `diffs/04-en.diff` hunk `@@ -272,3 +270,3 @@` and `04-pt` `@@ -273,3 +270,3 @@` remove “reported 270 contracts” / “reportou 270 contratos”. `270` has no other post-pass occurrence. More seriously, `diffs/07-en.diff`, `@@ -1,10 +1,8 @@`, silently removes the un-inventoried line “A receita cobrada em 2025 foi de 63 418 907 euros, lida da conta de gerência.” Neither `63 418 907` nor that fact occurs again. The unchanged reference count therefore does not prove no fact loss.

- **[note] Every other removed numeral/date survives or is non-content.** `04`’s removed `2026` survives in “spanning 1997 to 2026”; `09`’s removed error-history `4` survives in the concentration table; `03`’s `07` is only the path `evals/agua-2026-07`. All remaining factual numerals recur in their paired plus line or kept hunk. What disappears otherwise is process metadata, not study facts: `Claude`, `core.reconcile`, `core.attributions`, `Technical Source/VERIFICATION.md`, `Technical Source/fetch_base.py`, and the `SHA-256`/raw-response claims.

- **[should fix] Two replacements invent word forms.** Of 212 replacements, 176 only delete/reorder their own words; 34 introduce words found elsewhere in the edition. Exceptions: `diffs/06-en.diff` `@@ -1,10 +1,9 @@`, “What this document can and cannot say” → “The **limits**” (only singular `limit` is evidenced); and `diffs/04-pt.diff` `@@ -273,3 +270,3 @@`, “O script reporta … em vez de a fundir” → “Essa forma fica reportada em vez de **fundida**” (`fundir`, `fundiu`, `fundidas` exist, not `fundida`). The director’s two Évora sentences are authorised.

- **[should fix] The 04 reading-page twins still explain themselves.** Matching selectors in `paginas/leitura-04-en.html` and `-pt.html`: blocks `4` “It also reads 4 …”; `5` “This document read 600 of them” / “The rest were not read”; `6` “this document does not manufacture one” / “established by probe rather than asserted”; `11` “Both figures are sourced facts, not estimates” / “the structural check”; `12` “An independent route …”; `47` “The fetch stopped after 600 records because …”; `48` “a deliberately invalid concelho identifier returns 0 … [and] the 3 largest contracts read were checked”; `54` “The grouping rule is ours”; `58` “What was fetched is the catalogue”; `70` “refuted by the two probes above”; `75` “not found in the catalogue by this method”; `91` “If this document earns a sequel …”. Portuguese contains the exact translated twins.

- **[should fix] The 09 page has more, including one sentence outside the record.** In `paginas/leitura-09-pt.html`, `article#documento > p:first-of-type` says “Este documento foi reconciliado contra o registo antes de ser publicado, e cada valor abaixo tem a sua linha.” Further survivors: blocks `1` “capturada e recapturada” / “lidos quadro a quadro”; `6` “Descrição, nunca classificações. Não classifica …”; `7` “o achado estrutural mais simples deste documento”; `11` “a sua linha do ledger regista”; `22` “capturas verificadas”; `25` “recolhidas … e comparadas linha a linha” / “a primeira passagem deste vertical não leu”; `42` “O que isto não faz é rederivar”; `56` “a primeira construção deste documento leu”; `59` “Todas as linhas aqui citam”; `121` “este documento deixa os buracos à vista”; `127` “O que verificar a seguir”; `130` “o histórico foi reconstruído”; `131` “foi obtido e lido”; `132` “A leitura … para este vertical encontrou”; `135` “o seu extrator assinalou” / “nenhum foi transportado”; `136` “A correspondência não foi rederivada” / “este documento não mediu” / “devem ser lidas”.

- **[should fix] Bad `FICA` reasons.** In `DISPOSICAO.md`: `04 b13 f0,f2; b14 f0; b50 f1; b89 f3`; `06 b4 item 4 f1; b13 f2`; `07 b5 f3; b76 f2`; `08 b1 f2; b11 f0+2; b55 f0; b99 f0; b168 f3`; `09 b1 f2; b7 f0; b24 f1; b28 f0+2; b36 f0; b63 f2; b69 f2; b142 f0; b145 f0+2; b147 f2; b152 f1+2`. “False positive”, “conclusion”, “antecedent”, or a reconciler bug does not override the voice rule. No `CORTE` uniquely removes a figure-qualifying caveat: apparent cases survive elsewhere.

- **[blocking] Twins differ.** The `07-en` revenue-line deletion has no Portuguese counterpart. `03-pt` and `04-pt` also have harmless PT-only cuts of translation-generation sentences. `09`’s 97/96 totals are only sentence segmentation. No other semantic mismatch was found.