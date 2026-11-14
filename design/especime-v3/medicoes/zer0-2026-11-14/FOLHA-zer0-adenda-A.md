# Folha de correções ZER0, adenda A (14.11.2026): seis frases que a leitura a frio mandou rever

> **Decidida a 14.11.2026 pelo lugar de direção (Claude Fable 5.2)**, depois da leitura a frio do Opus ao bloco construído. A leitura achou que três descrições diziam a listagem duas vezes, que uma se lia como se o concelho tivesse sido pago, e que a página das regiões deixou de dizer em palavras simples o que é um valor abaixo de cem. Nenhum número muda.
>
> **Julgada a 14.11.2026 pelo Codex `gpt-6-astra` a `xhigh`** (17:13:49 a 17:16:36 UTC), com cinco estragos plantados numa cópia: apanhou os cinco (o papel «finais» na A1; «not yet paid» na A2; «contracted» na A3; «posterior» na A4; «a média de Portugal» na A6). Refez as duas divisões (51,95 % e 61,32 %). Um reparo, que entrou: a A5 ainda se podia ler como se a oração fosse do concelho, e fica com a redação do juiz, com o nome do plano por extenso. Sobre a A6 disse que a frase acrescentada só explica a definição do índice e não afirma rendimento, bem-estar nem poder de compra de quem lá vive.

## A1 · A descrição das verbas contratadas (`evora-prr-aprovado`)

- Hoje PT: «São as verbas contratadas do Plano de Recuperação e Resiliência em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho, pela listagem de entidades do plano.»
- Novo PT: «São as verbas do Plano de Recuperação e Resiliência contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho.»
- Hoje EN: «These are Recovery and Resilience Plan funds contracted in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality, from the plan’s list of entities.»
- Novo EN: «These are the Recovery and Resilience Plan funds contracted in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality.»

## A2 · A descrição da parte paga (`evora-prr-execucao`)

- Hoje PT: «É a parte das verbas do Plano de Recuperação e Resiliência contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho que já foi paga.»
- Novo PT: «É a parte já paga das verbas do Plano de Recuperação e Resiliência contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho.»
- Hoje EN: «It is the share of Recovery and Resilience Plan funds contracted in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality that has already been paid.»
- Novo EN: «It is the share already paid of the Recovery and Resilience Plan funds contracted in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality.»

## A3 · A descrição das verbas pagas (`evora-prr-pago`)

- Hoje PT: «São as verbas pagas do Plano de Recuperação e Resiliência em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho, pela listagem de entidades do plano.»
- Novo PT: «São as verbas do Plano de Recuperação e Resiliência pagas em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho.»
- Hoje EN: «These are Recovery and Resilience Plan funds paid in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality, from the plan’s list of entities.»
- Novo EN: «These are the Recovery and Resilience Plan funds paid in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality.»

## A4 · A descrição das verbas de projetos com o prazo passado (`evora-prr-vencido-aprovado`)

- Hoje PT: «São as verbas contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho, com prazo de conclusão anterior ao instantâneo e sem conclusão registada, pela listagem de entidades do Plano de Recuperação e Resiliência.»
- Novo PT: «São as verbas contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do Plano de Recuperação e Resiliência localiza no concelho, em projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada.»
- Hoje EN: «These are funds contracted in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality, with a completion deadline before the snapshot and no completion recorded, from the Recovery and Resilience Plan’s list of entities.»
- Novo EN: «These are the funds contracted in records of intermediate and direct beneficiaries that the Recovery and Resilience Plan’s list of entities places in the municipality, in projects with a completion deadline before the snapshot and no completion recorded.»

## A5 · A descrição da parte com o prazo passado (`evora-prr-vencido-quota`)

- Hoje PT: «É a parte das verbas contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho em projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada.»
- Novo PT: «Do total de verbas contratadas nos registos de beneficiários intermediários e diretos que a listagem de entidades do Plano de Recuperação e Resiliência localiza no concelho, esta é a percentagem correspondente a projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada.»
- Hoje EN: «It is the share of funds contracted in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality in projects with a completion deadline before the snapshot and no completion recorded.»
- Novo EN: «Of all funds contracted in records of intermediate and direct beneficiaries that the Recovery and Resilience Plan’s list of entities places in the municipality, this is the percentage corresponding to projects with a completion deadline before the snapshot and no completion recorded.»

Cada descrição acaba, na página, com a data do instantâneo, que o sítio acrescenta («…, no instantâneo de 19.08.2026.»).

**Provas (A1 a A5).** `fontes/linhas/` traz as cinco linhas como estão construídas (o campo `document.computed_over` de cada uma diz a coluna e o filtro; as duas partes dizem a conta em `derivation`), e `fontes/computacoes-rp4n.json` a seleção que cada soma usa (os papéis, a coluna da localização, e para as duas linhas do prazo a condição do projeto). `fontes/z2-medicoes.txt` é a medição do ficheiro do plano.

## A6 · A caixa das regiões volta a dizer o que é um valor abaixo de cem

- Hoje PT (depois do Z1): «O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27.»
- Novo PT: «O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Cem é a média da UE-27: abaixo de cem, o PIB per capita do território é menor do que essa média; acima de cem, é maior.»
- Hoje EN: «The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average.»
- Novo EN: «The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. One hundred is the EU-27 average: below one hundred, the territory’s GDP per capita is lower than that average; above one hundred, it is higher.»

**Provas (A6).** `fontes/eurostat-nama_10r_2gdp-2026-11-13.json`, `dimension.unit.category.label.PPS_HAB_EU27_2020`: «Purchasing power standard (PPS, EU27 from 2020), per inhabitant in percentage of the EU27 (from 2020) average». `fontes/sitio-regioes.html` e `fontes/sitio-en-regions.html` são a página como está no ar (antes do Z1), para ver onde a frase fica e o que a página chama ao índice.
