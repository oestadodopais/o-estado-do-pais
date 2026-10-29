# HB1-e: relatório das adendas B e C

A frase da secção 6 conserva agora «valor mediano». A secção 11 conserva as três linhas do calendário e fala das divulgações, sem a referência à edição ou ao projeto. As duas famílias explicam o que os números medem. A data declarada da edição continua a ser 29.10.2026.

O motor foi comitado em `571aecaf` (HB1-e3), com `core.gate` aprovado. O sítio corresponde ao pedido HB1-e4. A leitura cruzada do inventário continua por fazer. Não foram pedidos os portões completos nem capturas nesta adenda.

## Contagens e invariantes

| Medida | Antes | Depois | Prova |
| --- | ---: | ---: | --- |
| Linhas do livro do estudo | 196 | 196 | Comparação integral das linhas por identificador; nenhuma mudou |
| Linhas da travessia HB1 | 191 | 191 | Comparação integral de `ledger/cruzamentos/hb1.json`; igual |
| Ficheiros de linhas do sítio | 4143 | 4143 | SHA256 de cada YAML; nenhum mudou |
| Famílias HB1 | 194 | 194 | Leitura da declaração anterior no Git e da declaração gerada |
| Entradas da auditoria | 1127 | 1127 | Comparação por chaves; só as duas definições mudaram de conteúdo |
| Linhas classificadas do inventário | 2419 | 2419 | `leInventario`: 1231 vivas, 1186 retiradas, duas condicionais |
| L1, páginas com destinos repetidos | 3456 | 3456 | `AMOSTRA=5000 npm run check:lugar`; planta da medição aprovada |

No bloco HB1-e há agora dezasseis transcrições: oito vivas e oito retiradas. As vivas são as quatro frases do estudo e as quatro definições. As transcrições dos registos e das definições com período tipado não são linhas classificadas da prosa da casa. As antigas definições, antes não transcritas nesse bloco, ficaram também registadas como retiradas. A revisão mantém o estado «por ler».

Os gabaritos só mudaram nas linhas 43 e 63 de cada edição. O livro conservou todas as linhas, incluindo os calendários. Os nomes, os valores, as datas, a caixa e os ficheiros das fontes ficaram iguais. Nenhuma entrada foi criada no registo público das correções.

## Frases conferidas no HTML

O confronto retira apenas os rótulos de fonte intercalados (`.src-chip`) e normaliza espaços. As palavras, os valores e os períodos são comparados com a composição do motor.

### Secção 6, pt

O valor mediano da avaliação bancária das casas, a que os bancos fazem quando se pede crédito para as comprar, estava em 2 278 euros por metro quadrado em setembro de 2026, 14,2 % acima de um ano antes, pelo INE.

### Secção 11, pt

A taxa de juro implícita de setembro de 2026 e os preços locais do 2.º trimestre de 2026 saíram nas datas que o calendário do INE anunciava, 21.10.2026 e 23.10.2026; a avaliação bancária de setembro de 2026 saiu a seguir. São as leituras mais recentes do INE nas secções «Quanto custa uma casa, e quanto subiu» e «O crédito». A reforma do arrendamento segue para a especialidade; o Orçamento de 2027 teve o debate e a votação na generalidade marcados para 27 e 28 de outubro.

### Secção 6, en

The median bank appraisal of homes, the one banks make when credit is requested to buy them, stood at 2,278 euros per square metre in September 2026, 14.2 % above a year earlier, by the INE.

### Secção 11, en

The implicit interest rate for September 2026 and the local prices for Q2 2026 came out on the dates the INE calendar announced, 21.10.2026 and 23.10.2026; the bank appraisal for September 2026 came out after them. They are the INE's most recent readings in the sections «What a home costs, and how much it rose» and «Credit». The rental reform goes to the committee stage; the 2027 Budget had its first-reading debate and vote scheduled for 27 and 28 October.

## Definições impressas nas páginas das linhas

### `hab-ine-avaliacao-mediana`, pt

É o valor mediano das avaliações que os bancos fizeram às casas em setembro de 2026 quando lhes pediram crédito para as comprar: metade das avaliações ficou acima deste valor e metade abaixo. O INE publica-o em euros por metro quadrado.

### `hab-ine-avaliacao-homologa`, pt

É quanto o valor mediano da avaliação bancária das casas de setembro de 2026 subiu face ao mesmo mês do ano anterior, em percentagem.

### `hab-ine-avaliacao-mediana`, en

It is the median of the appraisals banks made of homes in September 2026 when credit was requested to buy them: half the appraisals were above this value and half below. The INE publishes it in euros per square metre.

### `hab-ine-avaliacao-homologa`, en

It is how much the median bank appraisal of homes for September 2026 rose against the same month of the previous year, in percentage.

## Conferências e códigos

Pasta de saída: `<temporario>/hb1-e-c`. Os códigos abaixo foram lidos dos ficheiros `.codigo`; os comandos com saída longa correram por `scripts/leituras/curto.sh`. As duas recusas pertencem ao auxiliar temporário escrito nesta passagem: a primeira tinha uma resolução errada do módulo HTML; a segunda incluía os rótulos de fonte na frase. Foram corrigidas sem mudar o sítio nem as réguas. A terceira execução do auxiliar passou. Nenhum portão do produto recusou a mudança.

| Ficheiro de código | Comando ou verificação | Código lido |
| --- | --- | ---: |
| `astro-build.codigo` | `astro build` | 0 |
| `auditoria-familias.codigo` | `conferirAuditoriaDasFamilias() de tests/cartao/familias.mjs` | 0 |
| `check-cartao.codigo` | `npm run check:cartao` | 0 |
| `check-cruzamento.codigo` | `npm run check:cruzamento` | 0 |
| `check-datas.codigo` | `npm run check:datas` | 0 |
| `check-documentos.codigo` | `npm run check:documentos` | 0 |
| `check-lingua.codigo` | `npm run check:lingua` | 0 |
| `check-lugar.codigo` | `AMOSTRA=5000 npm run check:lugar` | 0 |
| `check-registo.codigo` | `npm run check:registo` | 0 |
| `check-voz.codigo` | `npm run check:voz` | 0 |
| `commit-motor.codigo` | `comitar.sh HB1-e3, com o hook core.gate` | 0 |
| `compor-familias.codigo` | `node scripts/compor-familias-hb1.mjs --prova` | 0 |
| `habitacao-test.codigo` | `python3 -m publisher.habitacao_test` | 0 |
| `hb1-build.codigo` | `python3 -m publisher.hb1_build` | 0 |
| `hb1-test.codigo` | `python3 -m publisher.hb1_test` | 0 |
| `html-e-invariantes.codigo` | `Confronto do HTML com as frases compostas e das linhas exportadas com os bytes anteriores` | 0 |
| `html-e-invariantes-tentativa-1.codigo` | `Auxiliar do confronto do HTML, primeira tentativa` | 1 |
| `html-e-invariantes-tentativa-2.codigo` | `Auxiliar do confronto do HTML, segunda tentativa` | 1 |
| `invariancia-auditorias.codigo` | `Comparação por chaves de todas as auditorias, antes e depois` | 0 |
| `invariancia-motor.codigo` | `Comparação integral das linhas antes e depois da composição` | 0 |
| `l1-prova.codigo` | `node design/especime-v3/medicoes/hb1-e-2026-10-29/medir-l1.mjs <registo de check:lugar>` | 0 |
| `ledger-check.codigo` | `npm run ledger:check` | 0 |
| `preparar-versao.codigo` | `node scripts/stamp-version.mjs --preparar` | 0 |
| `stamp-version.codigo` | `npm run stamp:version` | 0 |
| `travessia.codigo` | `python3 scripts/hb1-travessia.py <motor>` | 0 |

A planta de `compor-familias-hb1.mjs --prova` começa com uma entrada de auditoria que reúne as chaves de duas famílias. Ao reconstruir as famílias separadas, a entrada antiga desaparece e a entrada alheia à HB1 conserva-se. A planta da L1 voltou a recusar os sete casos já declarados, sem reescrever a medição nem aumentar o teto.

## Decisões e limites

- **HB1-e-5:** a adenda C resolve a recusa da adenda B conservando os três calendários na secção 11. O ensaio anterior não foi entregue. A composição e a travessia atuais conservaram as contagens.
- **HB1-e-6:** as definições usam o período da linha na forma nativa `{periodo: id}` do complemento. O gerador separa a redação no token `⟦periodo: id⟧`; não escreve a data à mão. O HTML tem um token de período em cada definição. Os apoios das linhas e os trechos adicionais da página inicial do PDF foram conferidos.
- **HB1-e-7:** a limpeza retira todas as auditorias que contêm uma chave HB1 antes de reconstruir as entradas. Conserva a leitura da declaração JavaScript. A reconstrução muda a ordem do ficheiro da auditoria; por chaves, apenas as duas definições mudam de conteúdo, e as outras propriedades são iguais.
- **HB1-e-8:** o exportador dos registos atualizou também dezanove campos `origin_ref` de outras edições para a nova cabeça do motor. Nesses campos, só mudou o commit; os ficheiros e o conteúdo dessas edições não mudaram. Mantém-se a saída do exportador comum.

Fica aberta a leitura cruzada do inventário. Os portões completos e as capturas não foram executados nesta adenda. O HTML construído identifica a cabeça do sítio anterior ao commit HB1-e4, como registado por `stamp-version`; a construção de entrega cabe à passagem que a pedir.
