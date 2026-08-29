# Leitura cruzada do Codex · correções pequenas, quarta passagem (29.08.2026)

*Leitura de olhos frescos, `gpt-5.6-sol` com `model_reasoning_effort="xhigh"`, só de leitura, sobre a página de Évora nas duas edições, a página inglesa das Finanças, o índice das áreas nas duas edições, a agenda, `areas.mjs`, a lista dos ministérios, os diffs do inventário e das cadeias, e as regras 14 e 15. Custo: 73 379 símbolos, 271 s. Três plantas, registadas com sha256 antes da leitura em `2026-08-29-codex-leitura-pequenas-4.plantas.json`.*

## O que se plantou, e o que a leitura apanhou

| planta | o estrago | apanhado? |
|---|---|---|
| P1 | os dois valores da frase da série de Évora trocados, para que «desceu» os contradissesse | **mal plantada**: a troca do lugar de direção caiu na primeira ocorrência dos identificadores na página, que é o bloco dos mandatos e não a frase; a frase ficou intacta e a leitura leu-a certa; o estrago que ficou (dois valores trocados no bloco dos mandatos) não foi visto. Conta como falha da embalagem e como falta da leitura. |
| P2 | a marca de língua retirada da referência legal na página inglesa das Finanças | **sim**: bloqueante, com o elemento |
| P3 | o nome «Saúde» trocado por «Saúde Pública» no índice das áreas | **sim**: bloqueante, contra a lista do Governo e o mapa |

**Pontuação: 2 de 3, com a primeira mal plantada.** Segunda vez que uma planta do lugar de direção cai na primeira ocorrência de uma cadeia e não no alvo: a regra passa a ser conferir o contexto impresso do alvo antes de registar o sha256, e o registo das plantas guarda esse contexto.

## O que a leitura achou fora das plantas, e a triagem do lugar de direção

1. **«Lei n.º 73/2013» sem `lang` na página inglesa de Évora.** É a segunda metade de I91 (os títulos portugueses de leis e documentos nas páginas inglesas), aberta e nomeada. **Sem ação nesta passagem.**
2. **A prosa da agenda** («nenhuma linha do sítio publica hoje …», «A direção leu a pergunta …», «os documentos foram buscados e fixados por sha256 …») lida como violação da regra 15. A agenda é o registo das decisões e do trabalho da casa, item a item, e é isso que a Emenda 18 a manda ser (o Método di-lo); as suas frases estão classificadas desde a grelha da voz. **Sem ação.** A legenda dos dois estados do selo é a exceção registada. **Sem ação.**
3. **As unidades das linhas do livro-razão em português nas páginas inglesas** («% do PIB»). **Real, anterior a esta passagem e de todo o livro-razão**: a unidade rende como a linha a guarda; I92, para decidir com a segunda metade de I91 (a vírgula decimal é regra escrita das duas edições, I90). 
4. **Passa**: a frase da série certa nas duas edições; os nomes das áreas certos fora da planta; os rótulos pequenos amostrados todos no inventário (no diff ou nas linhas anteriores).

## O relatório, tal como veio

# REPORT

## Blocking

1. **Portuguese area name is wrong.** In `paginas/areas.html`, the list renders **“Saúde Pública”**. The supplied Government list and `dados/areas.mjs` say **“Saúde”**. The other eight Portuguese names and all nine English names agree with the supplied files character-for-character. I could not independently verify the Government website because fetching was forbidden.

2. **Portuguese legal citations lack language markup on English pages.**

   - `paginas/en-area-financas.html`:  
     “Decreto-Lei n.º 87-A/2025 · Artigo 12.º, n.º 1”  
     The `<a>` has no `lang="pt-PT"`.

   - `paginas/en-municipality-evora.html`:  
     “The limit is set by article 52.º of Lei n.º 73/2013…”  
     The embedded Portuguese title “Lei n.º 73/2013” is also unmarked.

   Legal references on `paginas/agenda.html` and `paginas/municipio-evora.html` inherit `lang="pt-PT"` from their pages. Citations in `dados/areas.mjs` are source data, not rendered elements, so an HTML `lang` check does not apply there.

3. **Rule 15 is extensively violated on reader pages.**

   `paginas/en-area-financas.html` contains an apparatus explaining verification: “The two states of the seal”, “provenance complete”, and “one field unconfirmed”.

   `paginas/agenda.html` repeatedly explains the site’s coverage, process and diligence. Examples include:

   - “nenhuma linha do sítio publica hoje…”
   - “O registo de disponibilidade do motor marca…”
   - “O quadro fica registado sem linhas em vez de ser omitido…”
   - “A direção leu a pergunta…”
   - “os documentos foram buscados e fixados por sha256…”
   - “O sítio não tinha página para nenhum concelho…”
   - “Alterações posteriores a 2018 não foram conferidas…”
   - “Nada foi lido: ersar.pt não respondeu hoje…”
   - descriptions of `curl`, `WebFetch`, stored engine data, checks, inferences and which site lines depend on an event.

   These are precisely method, diligence or coverage statements that rule 15 confines to Method, About or a receipt. The agenda violation is pervasive, not isolated.

## Should fix

4. **English localization is incomplete.** English pages retain Portuguese decimal formatting (`242,6`, `105,5`, `89,7`) and the Finance page displays `% do PIB`. Language markup does not make that unit understandable to an English-only reader.

## Passes and limits

5. **Series sentence passes for the rendered Évora case.**

   - Portuguese: “O índice de dívida, calculado sobre os dados da Direção-Geral, desceu de 242,6% em 2014 para 105,5% em 2024.” Values: **242,6 → 105,5**.
   - English: “The debt index, computed on the directorate-general’s data, fell from 242,6% in 2014 to 105,5% in 2024.” Values: **242,6 → 105,5**.

   Both editions agree, and “desceu”/“fell” matches the decrease. I could not exercise the unseen rise/equality branches from these rendered samples.

6. **Eyebrows:** seven unique sampled labels were found: “Agenda”, “Áreas de governo”, “Government areas”, “Município”, “Municipality”, “Relance”, and “At a glance”. None is absent from `INVENTARIO.diff`: three have added navigation rows; the diff says the remaining four already had rows. The base inventory is unavailable, so I could not verify those claimed existing rows.

7. **Rule 14:** no empty municipality page is present, so its required eight-piece empty layout could not be checked.

`REPORT.md` could not be written because the workspace is read-only.
