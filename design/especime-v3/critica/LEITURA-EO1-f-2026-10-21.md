Counts: Blocking 0; Major 3; Minor 3; «What is fine» 3.

## Blocking

None established within this pass’s restricted scope. Neither diff changes a source ledger row; this package does not support independent verification against hosted sources.

## Major

1. **The English site HTML restores the rejected sentence inside the paragraph that should remain unchanged.**  
The copied file begins that paragraph with “The UTAO describes that scenario below.” Neither the engine HTML nor the diff’s corresponding context contains this addition, so the package carries the disproof. Its SHA-256 is `718e20d647544c907cc9b5823e22229c9f83d1c57685fe9864f6601f5d566ebb`, contradicting the manifest’s declared `eb77d5f73016b45c939a17f0502dd074ffc5740f8a3173ef0debe36d32093979`; the supplied built English page does not contain this restored sentence.  
References: studies-src/orcamento-2027-o-que-muda-e-para-quem/en.html:74, studies-src/manifest.yml:409, diff.patch:717, motor/content/27 Orcamento 2027 O que muda/The 2027 Budget, what changes, and for whom.html:74

2. **The copied Portuguese template still contains the sentence its diff says was removed.**  
Line 69 retains “A UTAO descreve esse cenário abaixo.” The engine diff removes exactly that sentence, and the composed Portuguese Markdown already omits it: the package therefore carries direct disproof of the template’s claimed final state. The delivered template and its purported composed output are inconsistent.  
References: motor/content/27 Orcamento 2027 O que muda/Technical Source/documento.pt.md.tmpl:69, motor/diff.patch:292, motor/content/27 Orcamento 2027 O que muda/O Orçamento de 2027, o que muda e para quem (pt-PT).md:55

3. **The claimed green EO1-f checks have no execution evidence in this package.**  
The brief declares `check:eo1`, `typecheck` and `build` green, but supplies no invocation, output or execution record for those runs. The gate-line inventory is empty, and the companion gate record supplies no results. The separate numerical-check summary refers to 61 JSON files outside this package; it cannot substantiate these EO1-f checks or independently reproduce its own claimed 3,474 verified numbers here.  
References: brief.md:3, linhas-dos-portoes.json:1, registos-dos-portoes.json:1, numeros-do-relatorio.txt:2, numeros-do-relatorio.txt:3, numeros-do-relatorio.txt:5

## Minor

4. **The built English edition adds “about” before −263 million euros, beyond the authorized deletion.**  
The built paragraph says “worth about −263 million euros”; the engine HTML and site record say “worth −263 million euros.” The package carries the disproof, and the addition changes the stated precision despite leaving the digits unchanged. I would not print the English edition as delivered until this unexplained qualification and the conflicting site copy are reconciled with its record.  
References: built/en/studies/orcamento-2027-o-que-muda-e-para-quem/document/index.html:90, motor/content/27 Orcamento 2027 O que muda/The 2027 Budget, what changes, and for whom.html:72, registos/orcamento-2027-o-que-muda-e-para-quem/en.record.json:4013

5. **The built Portuguese edition adds “dez” to the summation sentence, beyond the authorized deletion.**  
It prints “Somadas, as dez linhas marcadas”, whereas the engine HTML and site record print “Somadas, as linhas marcadas”. The package carries direct disproof; this is an extra textual change, although the preceding sentence already establishes the count of ten. I would not print the Portuguese edition as the verified edition of record until this addition is reconciled with the recorded wording.  
References: built/estudos/orcamento-2027-o-que-muda-e-para-quem/documento/index.html:90, motor/content/27 Orcamento 2027 O que muda/O Orçamento de 2027, o que muda e para quem (pt-PT).html:72, registos/orcamento-2027-o-que-muda-e-para-quem/pt.record.json:4012

6. **The English HTML declares a different origin revision from the Portuguese HTML and English record, without evidence explaining that provenance.**  
Its manifest names `b7da85cc843d3ce00f69ff43bd666fda100992ce`; the Portuguese HTML and English record name `56628b4193ad04db434581e69ced564c3fa3aa0e`. The site diff contains the same divergent revision, so this is not a copied-file mismatch. The package proves the divergence but carries no repository history that could disprove or authenticate the English revision; matching content hashes cannot establish which commit supplied it.  
References: studies-src/manifest.yml:403, studies-src/manifest.yml:392, registos/manifest.json:476, diff.patch:694

## «What is fine»

7. **Both template diffs remove exactly the requested sentence, and the composed engine Markdown, HTML and record diffs contain that deletion with the corresponding proof-offset adjustments.** References: motor/diff.patch:278, motor/diff.patch:291, motor/diff.patch:19, motor/diff.patch:563, motor/diff.patch:32, motor/diff.patch:576

8. **Both site records, both raw HTML copies and the Portuguese normalized HTML match their engine counterparts byte for byte and match their declared SHA-256 values.** References: registos/manifest.json:470, registos/manifest.json:749, studies-src/manifest.yml:397, studies-src/manifest.yml:398, studies-src/manifest.yml:408, motor/content/27 Orcamento 2027 O que muda/records.manifest.json:18, motor/content/27 Orcamento 2027 O que muda/records.manifest.json:61

9. **Both built documents omit the targeted sentence and preserve the complete later “A UTAO usa a palavra…” / “The UTAO uses the word…” paragraph exactly as in the engine HTML.** References: built/estudos/orcamento-2027-o-que-muda-e-para-quem/documento/index.html:90, built/estudos/orcamento-2027-o-que-muda-e-para-quem/documento/index.html:92, built/en/studies/orcamento-2027-o-que-muda-e-para-quem/document/index.html:90, built/en/studies/orcamento-2027-o-que-muda-e-para-quem/document/index.html:92, motor/content/27 Orcamento 2027 O que muda/O Orçamento de 2027, o que muda e para quem (pt-PT).html:74, motor/content/27 Orcamento 2027 O que muda/The 2027 Budget, what changes, and for whom.html:74