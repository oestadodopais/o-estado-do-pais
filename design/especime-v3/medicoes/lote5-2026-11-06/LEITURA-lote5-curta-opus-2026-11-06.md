# A leitura curta da adenda D da MET1 (M48), 06.11.2026

Leitor: Claude Opus 5.5 (`leitor`, `xhigh`), sobre `pacote-lote5-curta-2026-11-06` (base cf1fbabf5, cabeça 330fd7500), de 12:3x a 12:43 UTC; 19 chamadas pela contagem do harness (18 pela do leitor; orçamento 20), 110 160 símbolos.

## As plantas (registadas por sha256 fora do pacote)

| planta | ficheiro | o estrago | sha256 antes → depois | apanhada |
|---|---|---|---|---|
| C1 | `built/metodo/index.html` | o campo onde está no documento do Método pt volta a imprimir a edição do Diário da República em vez do localizador | d5fff352ab0d → 5b5e99e1a382 | achado 1 |
| C3 | `built/metodo/index.html` | o nome do recibo de exemplo no Método pt deixa de ser o título do recibo | 5b5e99e1a382 → a3661e01cf9a | achado 3 |
| C4 | `scripts/metodo-do-portao.mjs` | a régua do Método deixa de comparar o valor do localizador com o da linha | 34f4e8fa756f → 3d48d8b3f3ee | achado 5 |
| C5 | `src/data/metodo.mjs` | a frase pt do passo 6 na fonte diz depois em vez de antes | 1f6a0cd0424e → 6ce2f798a12e | achado 4 |
| C2 | `built/en/method/index.html` | a contagem do passo 6 no Método inglês diz 61 em vez da recontagem (62) | af66df4e778b → 67ebe2d7842a | achado 2 |

**Cinco em cinco.** Nenhum achado real Blocking ou Major.

## Os achados Minor e o que este lugar fez

- **6:** o 62 e as duas conferências que a aterragem corre na máquina antes da fusão (`check:series` e `check:cruzamento --with-origin`): as duas estão na lista do `verify` que o 62 conta, e a corrida do GitHub cobre a lista inteira (a leitura a frio do lote 5, «What is fine», AT1 parts); a frase fica.
- **7:** o nome do exemplo vem do mesmo resolvedor do `h1` da página do recibo (`nomeNoRecibo`); é o título que o leitor lê no recibo, como a adenda D pede.
- **8:** o ramo `document.locator_en` sem dados que o exercitem: para a higiene.
- **9:** este lugar correu `node tests/metodo/construido.mjs` sobre o `dist/` de 330fd7500: saiu a 0. As plantas do Método correm dentro do `gate:html` (verde nas dirigidas d).
- **10 (Minor pelo leitor, real e deste lugar):** o passo 2 do percurso diz que um programa guarda uma cópia com o recibo do pedido; medido por este lugar: 781 das 4 144 linhas não calculadas declaram a cópia, nenhuma das 2 646 lidas em agosto e setembro, e a do exemplo também não. Reescrito na adenda E da MET1.
- **11:** «920,00 euros per month» na edição inglesa, anterior ao bloco: para a higiene.

## O relato do leitor, resumido

Blocking 1 a 2 e Major 3 a 5 são as cinco plantas (o localizador trocado pela edição no Método português; 61 no Método inglês; «Salário mínimo nacional (continente)»; «Depois de cada mudança» na cópia de `src/data/metodo.mjs`; a régua sem a comparação do texto do localizador). O que está bem: o diff aperta a régua do Método (tira `document.edition` e a data repetida dos `CAMPOS`, exige o localizador no seu campo, compara o texto e a posição); as três plantas novas por edição mordem com a régua do diff; o exemplo inglês com o localizador do recibo inglês, `lang="pt-PT"`, sem data nem edição; o nome inglês igual ao `h1`; a frase portuguesa do passo 6 exata, com 62 da prova; nenhuma outra frase mudou; a vista pára o `build` sem localizador; `aterrar.py` só funde depois da corrida `portão` da mesma cabeça em `success` e só promove depois da fusão; sem frases sobre o que o sítio não faz. A pergunta do editor: imprimia com os três defeitos das cópias corrigidos (que são plantas).
