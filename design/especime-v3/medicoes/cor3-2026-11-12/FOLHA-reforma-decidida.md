# Folha de correções · Penalizações por Reforma Antecipada em Portugal

> **Decidida a 12.11.2026.** O lugar de direção escolheu: na C02 só os dois acontecimentos; na C07 cortar a linha; na C09 «quando existe». O Codex Astra julgou as nove correções a `xhigh` contra as cópias das fontes, com cinco estragos plantados numa cópia desta folha, e apanhou os cinco. Os reparos do juízo que entraram aqui: o alcance da declaração do Governo (C02); a nota das medidas do cartão sem generalizar além da estimativa (C04); a nota da linha do livro delimitada (C05); o parágrafo do princípio sem «não está em vigor» e com «ou proteção social» (C07); a primeira distinção da frase do Método (C09). A citação da p. 224 na C01 fica: o juiz confirmou que enuncia uma dependência geral, que a p. 229 repete para a antecipação.

Estudo `penalizacoes-por-reforma-antecipada-2026`, edição portuguesa (não há edição inglesa do estudo; o inglês abaixo é só o do cartão em `src/data/leituras.mjs`). Montada a 12.11.2026, só leitura nos dois repositórios. As linhas são do documento do motor, igual byte a byte ao `pt.html` do sítio e ao `_raw`.

Documento: `content/11 Seguranca Social/Penalizações por Reforma Antecipada em Portugal (pt-PT).html` (sha256 `6f29b97aad33b099710137c9931a905d4e9e42f9f6e49314d49c38950d0540b4`).

Relatório: `content/11 Seguranca Social/source/Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf` (sha256 `555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366`). As páginas são «p. N do PDF (p. N−39 impressa)»; o estudo cita a impressa.

Provas: 43 de 43 conferidas por guião (`conferir.py`) na folha de origem; as que entraram com as decisões dizem quem as leu.


## C01 · achado 1 da auditoria

A abertura apresenta os 8,2% como «a redução justa» e a penalização «atuarialmente correta», e mais abaixo diz que «o número neutro não é uma opinião»; o relatório chama-lhe uma estimativa preliminar, num exercício ilustrativo para um trabalhador representativo com idade pessoal de reforma aos 66 anos e carreira contributiva média, e escreve que a neutralidade depende de forma sensível da idade, da sobrevivência, da taxa de desconto, da indexação e das contribuições.


**Linhas 104-107**, antes:

```
calculou qual seria a penalização atuarialmente correta por antecipar a reforma em Portugal. O
cálculo está no capítulo 8 do relatório, ocupa dezanove páginas, e chegou a um número: para quem se
reforma um ano antes da idade pessoal de reforma, a redução justa da pensão é de
<span class="numero">8,2%</span>.</p>
```

Depois:

```
calculou qual seria a penalização atuarialmente neutra por antecipar a reforma em Portugal. O
cálculo está no capítulo 8 do relatório, ocupa dezanove páginas, e chegou a um número, que o próprio
relatório apresenta como uma estimativa preliminar, num exercício ilustrativo: para um trabalhador
representativo com idade pessoal de reforma aos 66 anos e carreira contributiva média, que se reforme
um ano antes dessa idade, a redução atuarialmente neutra da pensão é de
<span class="numero">8,2%</span>.</p>
```

«correta» passa a «neutra» pela mesma razão que «justa»: o relatório chama-lhe neutra (neutralidade actuarial individual marginal), não correta.


**Linhas 154**, antes:

```
<strong>2,75 vezes</strong> o valor justo, uma diferença
```

Depois:

```
<strong>2,75 vezes</strong> o valor neutro, uma diferença
```

**Linhas 163**, antes:

```
se afasta mais do valor justo quanto <strong>menor</strong>
```

Depois:

```
se afasta mais do valor neutro quanto <strong>menor</strong>
```

**Linhas 187-189**, antes:

```
<p>O número neutro não é uma opinião. Resulta de uma condição de equivalência: um ajustamento é
marginalmente neutro quando o trabalhador fica financeiramente indiferente, em valor atual esperado,
entre reformar-se agora ou daqui a um ano.</p>
```

Depois:

```
<p>O número neutro resulta de uma condição de equivalência: um ajustamento é
marginalmente neutro quando o trabalhador fica financeiramente indiferente, em valor atual esperado,
entre reformar-se agora ou daqui a um ano. Essa neutralidade, escreve o relatório, depende «de forma
sensível da idade, da sobrevivência esperada, da taxa de desconto, da indexação das pensões e das
contribuições adicionais».</p>
```

A citação está no sumário do capítulo 8 (p. 224 impressa), no parágrafo das bonificações por diferimento; enuncia uma propriedade geral da neutralidade actuarial, e por isso vale aqui. Se a direção a quiser só no contexto da antecipação, a alternativa é a p. 229: «consoante as hipóteses adoptadas para mortalidade, taxa de desconto, actualização das pensões, evolução salarial, carreira contributiva e tratamento das contribuições adicionais».


**Linhas 194**, antes:

```
e um trabalhador representativo com idade pessoal de reforma aos 66 anos.</p>
```

Depois:

```
e um trabalhador representativo com idade pessoal de reforma aos 66 anos e carreira contributiva
média.</p>
```

**Provas**

- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 272 do PDF (p. 233 impressa): «Nesta secção apresentamos uma estimativa preliminar dos factores de ajustamento actuarial neutrais por reforma antecipada ou diferida.» → estimativa preliminar [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 272 do PDF (p. 233 impressa): «O exercício ilustrativo considera a função de sobrevivência ditada pelas tábuas completas de mortalidade da população portuguesa» → exercício ilustrativo [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 272 do PDF (p. 233 impressa): «um trabalhador representativo com idade pessoal de reforma aos 66 anos, carreira contributiva média,» → idade pessoal de reforma aos 66 anos, carreira contributiva média [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 263 do PDF (p. 224 impressa): «apesar de a neutralidade actuarial depender de forma sensível da idade, da sobrevivência esperada, da taxa de desconto, da indexação das pensões e das contribuições adicionais.» → de forma sensível da idade, da sobrevivência esperada, da taxa de desconto, da indexação das pensões e das contribuições adicionais [conferido] Sumário executivo do capítulo 8, parágrafo da reforma diferida.
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 268 do PDF (p. 229 impressa) (prova da alternativa): «consoante as hipóteses adoptadas para mortalidade, taxa de desconto, actualização das pensões, evolução salarial, carreira contributiva e tratamento das contribuições adicionais.» → consoante as hipóteses adoptadas [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 268 do PDF (p. 229 impressa): «O conceito central é o de neutralidade actuarial individual marginal.» → neutralidade actuarial individual marginal [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273 do PDF (p. 234 impressa) (contexto): «Figura 8.4: Decrementos por reforma antecipada: caso geral» → caso geral [conferido] O valor 8,2 não muda; a figura é a da linha do livro-razão já existente.
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 303 do PDF (p. 264 impressa) (contexto): «Sem uma calibração conjunta, os dois mecanismos podem exceder a penalização actuarialmente justa.» → actuarialmente justa [conferido] O relatório usa «actuarialmente justa» uma vez (p. 264 impressa), sempre qualificada por «actuarialmente» e sem a atribuir a um número. O achado mantém-se: a abertura dava os 8,2% como «a redução justa», sem qualificação nem as ressalvas da p. 233.

**Números e livro-razão**

- 66: ch8-idade-pessoal-reforma (motor, content/11 Seguranca Social/ledger.json)
- 8,2: penalizacao-antecipacao-um-ano-neutra (sítio, ledger/claims/ (e fig84-reducao-1a no motor))

**Arrasta**

- `sítio: src/data/leituras.mjs`, linha 853. Ver C04 (a mesma frase leva as duas correções; o texto novo está lá).
  - antes: «'O valor atuarialmente neutro é o corte que pagaria exatamente o custo que a antecipação impõe ao sistema.»

## C02 · achado [5, 7] da auditoria

«Este resultado não foi noticiado» e «O capítulo 8 ficou por ler» são falsos: o ECO noticiou a 19 e a 20 de agosto o «desajuste» nas penalizações e a «recalibragem» recomendada; «a discussão pública fixou-se no défice e na privatização» é uma interpretação dita como facto. Decisão do lugar de direção: o parágrafo fica só com os dois acontecimentos, e o segundo com o alcance que a declaração teve (reparo do juiz).


**Linhas 112-114**, antes:

```
<p>Este resultado não foi noticiado. O relatório foi apresentado a 18 de agosto, o Governo declarou
o dossiê fechado a 20, e a discussão pública fixou-se no défice e na privatização. O capítulo 8
ficou por ler.</p>
```

Depois:

```
<p>O relatório foi apresentado a 18 de agosto; a 20, o Governo declarou fechado o dossiê das reformas
estruturais da Segurança Social nesta legislatura.</p>
```

**Provas**

- eco-2026-08-19-reformas-antecipadas.html, html: «apresentado publicamente esta terça-feira» → a terça-feira anterior a 19 de agosto de 2026 (quarta-feira) é 18 de agosto [conferido pelo juiz]
- eco-2026-08-19-reformas-antecipadas.html, html (metadados JSON-LD): «"datePublished":"2026-08-19T06:04:36Z"» → 2026-08-19 [conferido]
- observador-2026-08-20-leitao-amaro.json (a cópia guardada no motor, em `source/imprensa/`), campo corpo: «O dossiê está fechado. Não vai haver reformas estruturais da segurança social. Assunto fechado» → a declaração [conferido pelo juiz]
- o mesmo corpo: «afirmou, e reafirmou, que não haverá reforma estrutural nesta legislatura» → nesta legislatura [lido pelo lugar de direção]
- o mesmo corpo (metadados JSON-LD): «"datePublished":"2026-08-20T16:47:44+01:00"» → 2026-08-20 [conferido pelo juiz]

**Números e livro-razão**

- 18 (de agosto): nova (a data da apresentação pública do relatório, pela notícia do ECO de 19.08.2026)
- 20 (de agosto): sem mudança (a linha governo-posicao no motor)

## C03 · achado 4 da auditoria

«O relatório escreve a regra assim» apresenta a fórmula como a regra; o relatório (p. 234) diz que a penalização legal «pode ser representada, de forma simplificada, por» ela.


**Linhas 122-123**, antes:

```
O relatório escreve a regra assim, na
página 234:</p>
```

Depois:

```
O relatório representa a regra, «de forma
simplificada», assim, na página 234:</p>
```

**Provas**

- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273 do PDF (p. 234 impressa): «A penalização legal pode ser representada, de forma simplificada, por:» → de forma simplificada [conferido]

**Arrasta**

- `sítio: ledger/claims/penalizacao-antecipacao-um-ano-com-factor-2026.yml`, linha 32. Nota da linha do livro-razão (não é impressa na página do estudo; a direção decide se a muda no mesmo commit).
  - antes: «A regra está escrita na p. 234 como F_x^legal = FS (1 - 0,005 M_x).»
  - depois: «A regra está escrita na p. 234, «de forma simplificada», como F_x^legal = FS (1 - 0,005 M_x).»

## C04 · achado 2 da auditoria

O estudo chama aos 8,2% o «custo efetivo para as contas públicas» e diz que quem sai um ano antes paga «2,75 vezes o custo que impõe ao sistema»; o relatório nunca o diz: mede neutralidade actuarial individual marginal, e escreve que ela não garante a sustentabilidade financeira de um regime em repartição.


**Linhas 147-148**, antes:

```
<strong>a
penalização legal quase nunca coincide com o custo atuarial, e falha nos dois sentidos.</strong>
```

Depois:

```
<strong>a
penalização legal quase nunca coincide com o valor atuarialmente neutro, e falha nos dois sentidos.</strong>
```

«custo atuarial» não estava no achado, mas é a mesma leitura de custo; é a conclusão em negrito do estudo, e a origem da leitura em leituras.mjs cita-a (ver arrasta).


**Linhas 151**, antes:

```
paga 6,0% quando o custo é 8,2%, ou seja, cerca de três quartos do devido.</p>
```

Depois:

```
paga 6,0% quando a redução neutra é 8,2%, ou seja, cerca de três quartos dela.</p>
```

**Linhas 182**, antes:

```
<p>Quem sai um ano antes é penalizado em 2,75 vezes o custo que impõe ao sistema.
```

Depois:

```
<p>Quem sai um ano antes é penalizado em 2,75 vezes a redução neutra.
```

**Linhas 200-201**, antes:

```
É esta segunda versão, a que corresponde ao custo efetivo para as contas públicas, que dá os
8,2% do primeiro ano.</p>
```

Depois:

```
É esta segunda versão, a que o relatório chama caso geral, que dá os
8,2% do primeiro ano.</p>
```

**Provas**

- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 268 do PDF (p. 229 impressa): «Note-se que a condição de neutralidade individual marginal não garante a sustentabilidade financeira de um regime de pensões em repartição, mas elimina, na margem individual, o incentivo financeiro esperado para antecipar ou adiar a reforma.» → não garante a sustentabilidade financeira [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 272 do PDF (p. 233 impressa): «No caso geral, os ajustamentos incorporam adicionalmente o efeito da permanência no mercado de trabalho sobre o esforço contributivo e sobre o acréscimo de direitos de pensão» → caso geral [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273 do PDF (p. 234 impressa): «Figura 8.4: Decrementos por reforma antecipada: caso geral» → caso geral [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273 do PDF (p. 234 impressa): «a redução legal pode tornar-se superior à penalização neutral estimada» → penalização neutral estimada [conferido]

**Números e livro-razão**

- 6,0 / 8,2 / 2,75: sem mudança (penalizacao-antecipacao-um-ano-sem-factor-2026, penalizacao-antecipacao-um-ano-neutra, ch8-racio-derivado (motor); os números não mudam, só o nome do que medem.)

**Arrasta**

- `sítio: src/data/leituras.mjs`, linha 853. medidasNota pt; a segunda frase muda por C09.
  - antes: «O valor atuarialmente neutro é o corte que pagaria exatamente o custo que a antecipação impõe ao sistema. A quem cabe numa das exceções que afastam o fator de sustentabilidade, a lei corta menos do que o valor neutro. As duas medidas acima são os dois extremos da mesma decisão.»
  - depois: «O valor atuarialmente neutro é o corte que deixaria o trabalhador financeiramente indiferente, em valor atual esperado, entre reformar-se agora ou daqui a um ano, numa estimativa que o relatório chama preliminar. A quem antecipa pelo regime de flexibilização com pelo menos 60 anos e 40 de descontos nessa idade, a lei corta menos do que essa estimativa. As duas medidas acima são os dois extremos da mesma decisão.»
- `sítio: src/data/leituras.mjs`, linha 875. medidasNota en; segue a forma inglesa da leitura (ortografia britânica, «honour» na mesma lista). A segunda frase muda por C09.
  - antes: «The actuarially neutral figure is the cut that would exactly pay for the cost the early retirement imposes on the system. For those who fall within one of the exceptions that set the sustainability factor aside, the law cuts less than the neutral figure. The two measures above are the two ends of the same decision.»
  - depois: «The actuarially neutral figure is the cut that would leave the worker financially indifferent, in expected present value, between retiring now or a year later, in what the report calls a preliminary estimate. For those who retire early under the flexibilisation scheme aged at least 60 with 40 years of contributions at that age, the law cuts less than that estimate. The two measures above are the two ends of the same decision.»
- `sítio: src/data/leituras.mjs`, linha 890. frase da leitura, pt; o parêntese muda por C09.
  - antes: «, consoante a porta por onde o trabalhador entra (uma das exceções que afastam o fator de sustentabilidade, ou a regra geral), quando o valor atuarialmente neutro calculado pelo próprio relatório, o corte que pagaria exatamente o custo que a antecipação impõe ao sistema, é de »
  - depois: «, consoante a porta por onde o trabalhador entra (a flexibilização com pelo menos 60 anos e 40 de descontos nessa idade, ou as regras da flexibilização em vigor a 31 de dezembro de 2018), quando o valor atuarialmente neutro estimado pelo próprio relatório, numa estimativa que ele chama preliminar, é de »
- `sítio: src/data/leituras.mjs`, linha 899. frase da leitura, en; o parêntese muda por C09.
  - antes: «, depending on which door the worker comes through (one of the exceptions that set the sustainability factor aside, or the general rule), when the actuarially neutral figure calculated by the report itself, the cut that would exactly pay for the cost the early retirement imposes on the system, is »
  - depois: «, depending on which door the worker comes through (flexibilisation at 60 or older with 40 years of contributions at that age, or the flexibilisation rules in force on 31 December 2018), when the actuarially neutral figure estimated by the report itself, in what it calls a preliminary estimate, is »
- `sítio: src/data/leituras.mjs`, linha 906. origem.pt: cita a linha 148 do estudo, que muda; o campo onde (:110, :148, :183) mantém-se se as linhas não mudarem de número, e muda se mudarem.
  - antes: «pt: 'Consoante a porta por onde o trabalhador entra. · A penalização legal quase nunca coincide com o custo atuarial, e falha nos dois sentidos. · A regra é mais dura com quem se desvia menos.',»
  - depois: «pt: 'Consoante a porta por onde o trabalhador entra. · A penalização legal quase nunca coincide com o valor atuarialmente neutro, e falha nos dois sentidos. · A regra é mais dura com quem se desvia menos.',»
- `sítio: src/data/leituras.mjs`, linha 907
  - antes: «en: 'Depending on which door the worker comes through. · The legal penalty almost never matches the actuarial cost, and misses in both directions. · The rule is harshest on those who deviate least.',»
  - depois: «en: 'Depending on which door the worker comes through. · The legal penalty almost never matches the actuarially neutral figure, and misses in both directions. · The rule is harshest on those who deviate least.',»
- `sítio: src/data/leituras.mjs`, linha 45-46. comentário de código (linhas 44-45) que cita o estudo; não é impresso.
  - antes: ««Quem sai um ano antes é penalizado em 2,75 vezes o custo que⏎       impõe ao sistema»»
  - depois: ««Quem sai um ano antes é penalizado em 2,75 vezes a redução⏎       neutra»»

## C05 · achado 6 da auditoria

A lista de quem escapa ao fator omite o regime de antecipação por deficiência, em que o Guia Prático do ISS (C3.1) diz que não há penalizações nem fator de sustentabilidade.


**Linhas 218-219**, antes:

```
carreiras muito longas, flexibilização aos 60
anos com 40 de carreira, profissões de desgaste rápido, invalidez.
```

Depois:

```
carreiras muito longas, flexibilização aos 60
anos com 40 de carreira, profissões de desgaste rápido, invalidez, deficiência.
```

«deficiência» é a palavra que o próprio relatório usa para este regime na lista da p. 239 impressa («profissões de desgaste rápido, deficiência e regimes específicos»). O regime foi criado por lei (Lei n.º 5/2022), o que mantém certo «por diplomas sucessivos».


**Provas**

- ss-documento-cmc1zt9ae.bin, p. 10 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 10/41): «C3.1 Regime de antecipação da idade de Pensão de Velhice por deficiência» → por deficiência [conferido]
- ss-documento-cmc1zt9ae.bin, p. 10 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 10/41): «não há penalizações por antecipação da idade nem aplicação do fator de sustentabilidade.» → não há penalizações por antecipação da idade nem aplicação do fator de sustentabilidade [conferido]
- ss-documento-cmc1zt9ae.bin, p. 34 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 34/41): «Lei n.º 5/2022, de 7 de janeiro Cria o regime de antecipação da idade de pensão de velhice por deficiência.» → Lei n.º 5/2022 [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 278 do PDF (p. 239 impressa) (contexto): «profissões de desgaste rápido, deficiência e regimes específicos da Caixa Geral de Aposentações» → deficiência [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 303 do PDF (p. 264 impressa) (contexto): «A sucessão de excepções para carreiras muito longas, flexibilização aos 60 anos com 40 anos de carreira, profissões de desgaste rápido e situações de invalidez» → situações de invalidez [conferido] A lista do estudo copia a do relatório (p. 264 impressa); a omissão vem da fonte. O acrescento assenta no Guia do ISS.

**Arrasta**

- `sítio: ledger/claims/penalizacao-antecipacao-um-ano-sem-factor-2026.yml`, linha 32. Nota da linha do livro-razão (grafia antiga, como o resto do ficheiro). A primeira frase muda por C09, a lista por C05.
  - antes: «note: "Redução acumulada da pensão, um ano de antecipação, para quem se enquadra numa das excepções legais que afastam o factor de sustentabilidade. O factor não se aplica uniformemente: carreiras muito longas, flexibilização aos 60 anos com 40 de carreira, profissões de desgaste rápido e invalidez estão fora.»
  - depois: «note: "Redução acumulada da pensão por um ano de antecipação em 2026, pelas novas regras da flexibilização, sem aplicação do factor de sustentabilidade. O factor não se aplica uniformemente: carreiras muito longas, flexibilização aos 60 anos com 40 de carreira, profissões de desgaste rápido, invalidez e deficiência estão fora.»

## C06 · achado 3 da auditoria

«o relatório recomenda três coisas»: a secção 8.4 enumera de «Em primeiro lugar» a «Em sexto lugar» e depois «Finalmente»; as três do estudo são a primeira, a segunda e a quarta.


**Linhas 274-279**, antes:

```
Mantendo-se o regime atual, o relatório recomenda três coisas. Publicar uma tabela de fatores
atuariais de referência, com hipóteses explícitas sobre mortalidade, desconto, indexação e formação
de direitos. Substituir a acumulação opaca entre penalização mensal e fator de sustentabilidade por
um fator integrado, que mostre em separado a componente de neutralidade atuarial e a componente de
sustentabilidade financeira. E indexar as bonificações também à idade efetiva de diferimento, e não
só à carreira.</p>
```

Depois:

```
Mantendo-se o regime atual, o relatório recomenda, entre outras coisas, publicar uma tabela de
fatores atuariais de referência, com hipóteses explícitas sobre mortalidade, desconto, indexação e
formação de direitos; substituir a acumulação opaca entre penalização mensal e fator de
sustentabilidade por um fator integrado, que mostre em separado a componente de neutralidade
atuarial e a componente de sustentabilidade financeira; e considerar nas bonificações também a idade
efetiva de diferimento, e não só a carreira. As outras recomendações tratam dos regimes especiais de
antecipação, dos escalões de carreira, dos tetos da pensão bonificada e da harmonização entre o
regime geral, a Caixa Geral de Aposentações e os regimes especiais.</p>
```

«indexar» passa a «considerar», o verbo do relatório («passar a considerar também a idade efectiva de diferimento»); «indexar» dizia mais do que a fonte. A ordem é a do relatório (1.ª, 2.ª, 4.ª; depois 3.ª, 5.ª, 6.ª e «Finalmente»).


**Provas**

- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 277 do PDF (p. 238 impressa): «recomenda-se, em primeiro lugar, que o Governo proceda a uma reavaliação actuarial sistemática dos decrementos por reforma antecipada e dos incrementos por reforma diferida.» → em primeiro lugar [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 277 do PDF (p. 238 impressa): «Em segundo lugar, a penalização por reforma antecipada deveria ser reformulada de modo a evitar a dupla contagem entre a penalização mensal de 0,5% e o factor de sustentabilidade.» → Em segundo lugar [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 278 do PDF (p. 239 impressa): «Em terceiro lugar, recomenda-se a simplificação e consolidação dos regimes especiais de antecipação da idade de reforma.» → regimes especiais de antecipação [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 278 do PDF (p. 239 impressa): «Em quarto lugar, no domínio da reforma diferida, as bonificações legais deveriam deixar de depender apenas da carreira contributiva e passar a considerar também a idade efectiva de diferimento.» → considerar também a idade efectiva de diferimento [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 278 do PDF (p. 239 impressa): «Em quinto lugar, a diferenciação por carreira contributiva deveria ser suavizada. As actuais bonificações por escalões criam descontinuidades» → escalões [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 278 do PDF (p. 239 impressa): «Em sexto lugar, os limites máximos da pensão bonificada deveriam ser reavaliados.» → limites máximos da pensão bonificada [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 279 do PDF (p. 240 impressa): «Finalmente, recomenda-se uma arquitectura mais transparente e harmonizada entre o regime geral da Segurança Social, a Caixa Geral de Aposentações e os regimes especiais.» → harmonizada entre o regime geral da Segurança Social, a Caixa Geral de Aposentações e os regimes especiais [conferido]

## C07 · achado 7 da auditoria

«Hoje não é declarada nem reconhecida. É apenas cobrada.» não tem fonte, e é falso para a porta sem o fator: aí a penalização legal fica abaixo da neutra, e o que há a reconhecer seria subsidiação, não cobrança. Decisão do lugar de direção: a linha corta-se. O juiz achou no parágrafo que fica outra afirmação sem prova («não está em vigor»); sai também, e o princípio passa a ler-se como o relatório o escreve, com «ou proteção social».


**Linhas 282-287**, antes:

```
<p>O princípio que o relatório enuncia é simples de verificar e não está em vigor: quando a
penalização legal for mais severa do que a neutra, a diferença deve ser declarada como medida de
consolidação financeira; quando for mais favorável, deve ser reconhecida como subsidiação
implícita.</p>
<p>Hoje não é declarada nem reconhecida. É apenas cobrada.</p>
```

Depois:

```
<p>O relatório enuncia este princípio: quando a
penalização legal for mais severa do que a neutra, a diferença deve ser declarada como medida de
consolidação financeira; quando for mais favorável, deve ser reconhecida como subsidiação
implícita ou proteção social.</p>
```

**Provas**

- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 273 do PDF (p. 234 impressa) (contexto): «Quando se incorporam contribuições e acréscimos de direitos, essa penalização isolada tende a ficar abaixo do valor actuarialmente neutral.» → abaixo do valor actuarialmente neutral [conferido]
- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 264 do PDF (p. 225 impressa): «Se for mais favorável, deve ser reconhecida como subsidiação implícita ou protecção social.» → subsidiação implícita ou protecção social [conferido]

## C08 · achado 8 da auditoria

O Método diz que o ficheiro «está espelhado byte a byte» com o sha256 555936…; a cópia guardada tem esse resumo, mas o ficheiro em linha mudou (sha256 b46f0c…): o texto difere só na linha do DOI. O resumo impresso deve ficar (é o da cópia que foi lida e o que todas as linhas do livro-razão citam); «espelhado byte a byte» deixou de ser verdade.


**Linhas 295-297**, antes:

```
O ficheiro está
espelhado byte a byte, com o resumo SHA-256
<code>555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366</code>.</p>
```

Depois:

```
A cópia lida está
guardada com o resumo SHA-256
<code>555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366</code>; o ficheiro em linha a 12 de
novembro de 2026 difere dela, no texto, só na linha do DOI.</p>
```

Não se escreve a data em que a cópia foi descarregada: o livro-razão do sítio regista 2026-08-24 como data de alojamento («access_date_kind: hosted-copy»), não de um pedido HTTP.


**Provas**

- Relatorio_Final_GT_Reforma_Seg_Social_Jun_2026.pdf, p. 2 do PDF (p. -37 impressa): «DOI: aguarda atribuição» → aguarda atribuição [conferido]
- relatorio-gt-live.pdf, p. 2 do PDF (ficheiro em linha a 12.11.2026): «DOI: 10.5281/zenodo.22552965» → 10.5281/zenodo.22552965 [conferido] Ficheiro descarregado pela auditoria a 2026-11-12T20:36:09Z (pedidos.jsonl da pasta da auditoria), sha256 b46f0c546dfb4b4b9b53b59f7d35322e3241cbc5e4f919d3062b8e385a0e8227.

**Números e livro-razão**

- 555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366: sem mudança (_meta.primary_source_sha256 do ledger.json do motor e source/MANIFEST.sha256; recalculado agora: 555936bdc750f66826c4919fab5d288e0b726a76e72f224ba655c82390381366)
- 12 de novembro de 2026: nova (data em que o ficheiro em linha foi lido e comparado)

## C09 · achado 4 da auditoria

O Método diz que a comparação «vale para quem se reforma antecipadamente sem se enquadrar nas exceções legais»; é largo de mais: no desemprego de longa duração a redução de 0,5% conta-se em relação aos 62 anos e o fator aplica-se (Guia do ISS, D1.2.3 e D2.2); a coluna com o fator descreve a flexibilização pelas regras em vigor a 31.12.2018 e a coluna sem o fator a flexibilização com 40 anos de descontos aos 60.


**Linhas 316-317**, antes:

```
A comparação acima vale para quem se reforma
antecipadamente sem se enquadrar nas exceções legais.
```

Depois:

```
A comparação acima vale para a
reforma antecipada pelo regime de flexibilização: a coluna sem o fator é o cálculo pelas novas regras,
para quem completou pelo menos 40 anos de descontos aos 60 anos; a coluna com o fator é o cálculo
pelas regras da flexibilização em vigor a 31 de dezembro de 2018. Não vale para o desemprego de longa
duração, em que a redução de 0,5% por mês, quando existe, se conta em relação aos 62 anos, e o fator
também se aplica.
```

A frase seguinte («Não sabemos quantas pessoas estão nessa situação») continua a ler-se bem.


**Provas**

- ss-documento-cmc1zt9ae.bin, p. 12 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 12/41): «D1.2.1 Pensão antecipada por flexibilização (a partir dos 60 de idade, com 40 ou mais anos de descontos)» → 60 de idade, com 40 ou mais anos de descontos [conferido]
- ss-documento-cmc1zt9ae.bin, p. 14 do PDF (Pág. 14/41), quadro da D1.2.3: uma modalidade com «0,5% por cada mês de antecipação em relação aos 62 anos» e outra «Sem redução» [lido pelo lugar de direção e pelo juiz]
- ss-documento-cmc1zt9ae.bin, p. 13 do PDF (Pág. 13/41): «Se completou os 40 anos de descontos enquanto tinha 60 anos» [lido pelo juiz]
- ss-documento-cmc1zt9ae.bin, p. 12 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 12/41): «Pelas novas regras do regime de flexibilização, aplica-se uma penalização de 0,5% por cada mês antes da “idade pessoal de reforma”.» → 0,5% por cada mês [conferido]
- ss-documento-cmc1zt9ae.bin, p. 19 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 19/41): «a pensões antecipadas pelo regime de flexibilização, quando a pessoa tem pelo menos 60 anos e 40 ou mais anos de descontos nessa idade;» → pelo menos 60 anos e 40 ou mais anos de descontos nessa idade [conferido] Na lista «Não se aplica» do fator de sustentabilidade (D2.2).
- ss-documento-cmc1zt9ae.bin, p. 19 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 19/41): «a pensões antecipadas pelo regime de flexibilização, com base nas regras anteriores a 31/12/2018:» → 31/12/2018 [conferido] Na lista «Aplica-se» do fator de sustentabilidade (D2.2).
- ss-documento-cmc1zt9ae.bin, p. 13 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 13/41): «A menos que as regras da flexibilização em vigor a 31 de dezembro de 2018, antes da» → regras da flexibilização em vigor a 31 de dezembro de 2018 [conferido]
- ss-documento-cmc1zt9ae.bin, p. 13 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 13/41): «pode aceder, mas pelo regime anterior, o que significa que além dos 34,5% de penalização terá aplicação de fator de sustentabilidade.» → terá aplicação de fator de sustentabilidade [conferido] Exemplo 4 da D1.2.1: a mesma penalização contada da idade pessoal de reforma, mais o fator. É o que a coluna com o fator calcula.
- ss-documento-cmc1zt9ae.bin, p. 15 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 15/41): «são 11 meses de antecipação em relação aos 62 anos de idade.» → 62 anos [conferido] Exemplo 1 da D1.2.3 (desemprego de longa duração).
- ss-documento-cmc1zt9ae.bin, p. 19 do PDF (Guia Prático Pensão de Velhice, 7001 v4.78, Pág. 19/41): «a pensões antecipadas por desemprego de longa duração ou outros regimes especiais.» → desemprego de longa duração [conferido] Na lista «Aplica-se» do fator de sustentabilidade (D2.2).

**Números e livro-razão**

- 60: flexibilizacao-idade-minima (motor, ledger.json (relatório, p. 264 impressa, a mesma medida))
- 40: flexibilizacao-carreira-minima (motor, ledger.json)
- 0,5: penalizacao-mensal-percentagem (motor, ledger.json)
- 62: nova (idade em relação à qual se contam os meses de antecipação na pensão antecipada por desemprego de longa duração («antecipação em relação aos 62 anos»))
- 31 de dezembro de 2018: nova (data das regras da flexibilização a que se aplica o fator de sustentabilidade)

**Arrasta**

- `sítio: src/data/leituras.mjs`, linha 845. nome da medida 22,6% no cartão.
  - antes: «pt: ['é o que a lei corta a quem não cabe numa das exceções'],»
  - depois: «pt: ['é o que a lei corta quando a pensão é calculada pelas regras da flexibilização em vigor a 31 de dezembro de 2018'],»
- `sítio: src/data/leituras.mjs`, linha 846
  - antes: «en: ['is what the law cuts from those who fall outside the exceptions'],»
  - depois: «en: ['is what the law cuts when the pension is calculated under the flexibilisation rules in force on 31 December 2018'],»
- `sítio: src/data/leituras.mjs`: medidasNota (pt e en) e frase (pt e en): o texto novo já está nas entradas de arrasta da C04, que juntam as duas correções.
- `sítio: ledger/claims/penalizacao-antecipacao-um-ano-sem-factor-2026.yml`: o texto novo da nota está na arrasta da C05, que junta as duas correções.

## Ausências e comparações

- C08: o texto inteiro da cópia guardada e do ficheiro em linha só difere na linha 32: «DOI: aguarda atribuição» → «DOI: 10.5281/zenodo.22552965» [conferido]

## Mecânica para o construtor

- Editar o documento do motor e regenerar; o `pt.html` do sítio e `studies-src/_raw/penalizacoes-por-reforma-antecipada-2026.pt.html` têm de ficar iguais a ele (hoje os três têm o mesmo sha256). O registo das edições (`scripts/edicoes-conferir.mjs`, `studies.mjs` campo `updated`, `studies-src/_edicoes/`) e o registo de frases por sha256 (`ledger/frases/por-registar.json`) mudam com o texto: inferido da estrutura do repositório, não corrido.
- As linhas de C05 a C09 mudam de número depois de C01 e C02 (C01 acrescenta linhas); aplicar pelo texto `atual`, não pelo número.
