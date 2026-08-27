# Leitura cruzada do Codex · a terceira passagem de voz nos documentos (27.08.2026, noite)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre os doze diffs da passagem (`publisher/voz-2026-08-27-S4/diffs/`), a disposição, três páginas de leitura construídas (04 pt e en, 09 pt) e os excertos das Emendas 15 e 18. Custo: 226 023 símbolos, 648 s. Duas plantas, registadas com sha256 antes da leitura (`.plantas.json` ao lado).*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | no diff do 08 pt, uma linha retirada com uma figura sem outra ocorrência («61 240 118 euros») | **não**: a leitura listou as três retiradas com numeral (uma data mantida, dois anos mantidos, o «256» de SHA-256) e não esta |
| P2 | na página de leitura do 04 pt, uma frase de procedimento deixada («Este documento comparou cada valor com a fonte antes de o publicar.») | **sim**: a primeira do relatório, e a divergência entre gémeos que cria |

**Pontuação: 1 de 2.** A P1 foi inserida como linha `-` no primeiro troço do diff do 08 pt, na forma das outras; a leitura não a viu entre os treze diffs (2 MB). Fica registado como falha da leitura nesta classe (uma figura perdida num diff grande), a par das duas falhas anteriores na classe da voz: a rede mecânica para a figura perdida é a porta R6 da ferramenta do motor e a auditoria mecânica do lugar de direção, não a leitura.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **«Ambos os valores são factos com fonte, não estimativas.» saiu e a qualificação «não estimativas» perdeu-se**: é o documento a afirmar a qualidade das suas figuras; o selo diz a fonte e a linha diz o que é. **Corte mantido.**
2. **Fica procedimento nas páginas de leitura** (o 04: «São 600 porque…», «um identificador deliberadamente inválido devolve 0 linhas», «os 3 maiores contratos lidos foram confrontados», «A regra de agrupamento não é do registo»; o 09: as quatro regras da correspondência, «Como o mapa foi datado», «anos lidos», «não foi rederivada»): é a classe que a linha do diretor de 27.08 mantém, o procedimento que limita uma figura impressa (os 600, as correspondências por nível de confiança, os anos de contas lidos). A leitura estrita cortá-la-ia; **a decisão do lugar de direção é mantê-la**, porque uma figura sem o seu limite engana; o diretor pode traçar a linha mais abaixo (cortar as secções de método inteiras das páginas de leitura, ficando na edição arquivada) e essa seria uma quarta passagem, do motor.
3. **Os veredictos FICA que a leitura rejeita** (a assinatura da inferência, regra 9 do Método; as legendas do que um quadro mostra): ficam, pelas razões escritas na disposição.
4. **Gémeos**: uma operação só em português (o inglês já dizia o mesmo); a divergência do 04 é a planta. **Palavras**: nenhuma inventada; as flexões contam.

## O relatório, tal como veio

I could not create `REPORT.md`: the workspace is read-only and rejected the patch. Here is the completed report text, under 800 words.

# Fresh-eyes report

## High — “no fact lost” fails

The substantive fact loss is the paired 04 cut at `diffs/04-pt.diff`, block 14 sentence 0, and `04-en`, block 14 sentence 0: “Ambos os valores são factos com fonte, não estimativas.” / “Both figures are sourced facts, not estimates.” Page selector `[data-registo-unidade$="#11"]` preserves provenance, but not the qualification **not estimates**.

Every other removed number/date/name/source survives in the same edition. The numeral-shaped deletions are: 03 b1 f0, `2026-08-03`, retained in “Fonte: INE … obtido a 2026-08-03” / “Source: INE … fetched 2026-08-03”; 09 b36 f1, `2023` and `2025`, retained at page 09 `[data-registo-unidade$="#137"]` in “Não foi examinada nenhuma captura … de 2023 nem dos últimos meses do mandato”; and `256` from `SHA-256` at 08 b171 u7 f0, an algorithm label rather than a printed figure. Other factual tokens remain in their replacement.

## High — procedure remains on the reading pages

Page 04-pt alone has `article#documento > p:first-of-type`: “Este documento comparou cada valor com a fonte antes de o publicar.”

Both 04 pages retain procedural twins at blocks 46–48, 53–54, 59, 61, 71, 73, 75 and 77: “Lidos para este documento”; “São 600 porque…”; “um identificador … deliberadamente inválido devolve 0 linhas”; “os 3 maiores contratos lidos foram confrontados”; “Agrupar os 600 registos…”; “A regra de agrupamento não é do registo”; “Logo, a correspondência é correspondência de cadeias de carateres”; “Estas correspondências caem em dois dos quatro níveis de confiança”; “Évora é um nome … limpo para pesquisar”; “A única junção…”; “o catálogo devolve 0/2”; and “O fragmento … devolve 8 documentos.” The English page has counterparts at the same selectors.

Page 09-pt retains: `#5` “Só é feita onde…” and “a linha é marcada”; `#18` “Todas as listas … abaixo são citadas”; `#29` “O quadro abaixo é…”; `#42` “A correspondência continua a citar…”; `#49` “O resto é a ligação, e obedece a quatro regras”; `#50.0–#50.4` all five matching, marking and source rules; `#53`, `#56`, `#59` “linhas aqui citam”; `#62` “pela primeira vez neste documento”; `#68` “Cada mandato recebe…” and the dash legend; headings `#69`, `#86`, `#103` “lido através dos anos de contas”; `#113` “São mostrados aqui… e não são usados”; `#115` “é transportada inteira do documento companheiro”; `#119`, `#121` “anos lidos”; `#130` “Como o mapa foi datado” and its capture-interval rule; `#131` “não foi encontrado despacho”; source items `#134.2–#134.3` “lidos para”; `#135` “linhas já registadas” / “ficaram de fora”; `#136` “não foi rederivada”, “Cita…” and “devem ser lidas”; `#137` “cada mandato é lido…” and “Não foi examinada nenhuma captura…”.

## Medium — bad keep verdicts

`DISPOSICAO.md` reasons fail for 06 b3 u4 f1 (“A secção de oportunidades é inferência assinada”), 08 b4 f2 (“são mostrados por mandato”) and b101 f0 (“estão marcadas na tabela”), and 09 b5 f0, b29 f0, b42 f1 and b50 u1/u2/u4. Their subjects are the section, current table, join, pair, line or page composition, not a source or specific printed figure. They describe display or matching procedure.

## Twins and invented words

One S6 operation is PT-only: 06 b1 f2 changes “portas de financiamento lidas em direto…” to “portas de financiamento dos portais em direto…”. EN already says “funding doors from the managing bodies’ live portals,” so outputs agree. Separately, the 04-pt assurance has no 04-en page twin.

No replacement invents vocabulary: all 275 use pre-pass words or allowed inflections. Apparent additions `apontam/points` (04 b91), `explain` (08 b152) and `registadas` (09 b135) are inflections of words already present.

**Verdict: FAIL — one factual qualification is lost, procedural prose remains extensively, and the built 04 twins diverge.**