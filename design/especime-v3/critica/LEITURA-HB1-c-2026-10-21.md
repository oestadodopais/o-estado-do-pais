# Leitura a frio da correção HB1-c (as cinco passagens), 21.10.2026

*Leitor: o Codex `gpt-6-astra`, raciocínio `medium`, por `scripts/leituras/ler.sh`, das 14:39 às 14:52 UTC (treze minutos), com o orçamento de sessenta chamadas, sobre o pacote montado por `scripts/leituras/pacote.sh` da cabeça `1a41fe73a` do sítio (a partir de `db023e4b0`) e da cabeça `ccd45ba` do motor (a partir de `f07b75e`): 225 ficheiros mudados, 44 ficheiros do motor, 104 corpos alojados (0 em falta), 236 páginas construídas, o mandato das cinco passagens como `brief.md` e o relatório do construtor. Cinco estragos plantados nas cópias do pacote por `scripts/leituras/plantar.py`, registados por sha256 (o registo em `<pacotes>/pacote-hb1-c-2026-10-21.plantas.json`, fora do repositório). O prompt é `PROMPT-leitura-hb1-c-bloco.md` da sessão, sobre o prompt comum das leituras.*

## As plantas

| Planta | Ficheiro (cópia do pacote) | O estrago | sha256 antes → depois | Alcance |
|---|---|---|---|---|
| Y1 | `built/estudos/a-casa-em-portugal-e-na-europa/index.html` | o ordinal da conclusão 3 na edição portuguesa construída passa de nono a oitavo; a referência é o corpo ilc_lvps08 e o registo | `29c2f4dfab01` → `1442d199c6c4` | fora do diff da passagem (a referência é outra) |
| Y2 | `built/livro-razao/hab-arrendamento-exposicao-vagos/index.html` | o período dos dados no recibo português da estimativa do Governo passa de 2021 a 2020; a linha, o excerto («Censos 2021») e o motor dizem 2021 | `f0becf762ac7` → `faa5c3f80671` | fora do diff da passagem (a referência é outra) |
| Y3 | `src/data/figuras.mjs` | o sha256 do selo da origem hb1c-eurostat-sobrelotacao (o glossário da sobrelotação) muda na última letra; o corpo alojado em motor/ e o recibo do pedido dizem o verdadeiro | `2ce4ade48c57` → `dc86b4608a0b` | na linha de um hunk do diff |
| Y4 | `motor/content/23 Habitacao/source/eurostat/hb1c-glossario-housing-cost-overburden-rate.html` | o limiar da definição da sobrecarga no corpo alojado passa de 40 a 50 por cento; o excerto selado em figuras.mjs, as frases das famílias e o sha256 do selo dizem o verdadeiro | `bc7a042469b8` → `63453afce26e` | na linha de um hunk do diff |
| Y5 | `scripts/hb1-familias.py` | o limiar da frase portuguesa da família da sobrecarga passa de quarenta a cinquenta por cento; a definição do Eurostat alojada diz quarenta | `305a9cc131e4` → `19f14634057c` | na linha de um hunk do diff |

**Resultado: cinco em cinco.** Os cinco Blocking da leitura são as cinco plantas, cada uma com a referência que a desmente (o corpo `ilc_lvps08`; a linha e o excerto «Censos 2021»; a definição alojada do Eurostat com quarenta por cento; o excerto selado, as frases das famílias e o sha256 do selo; o corpo alojado e o recibo do pedido).

## A resposta do leitor, como a entregou

Blocking: 5 · Major: 2 · Minor: 3 · What is fine: 7

Blocking, all planted:

1. Portuguese conclusion 3 says eighth; the measured rank is ninth.
2. The Government-estimate receipt prints 2020 instead of Census 2021.
3. The Portuguese family generator changes the overburden threshold to fifty percent.
4. The hosted overburden glossary changes forty to fifty, breaking both seals.
5. The overcrowding origin’s SHA-256 is altered.

Major:

6. Both overburden translations omit the housing-allowance adjustment to disposable income.
7. INE, Banco de Portugal and Budget definitions remain label repetitions.

`LEITURA.md` could not be saved: automatic approval rejected the write because this session’s filesystem sandbox is read-only.

## O que a direção fez com ela

- **Major 6 (as duas traduções da sobrecarga omitem que o rendimento disponível também é líquido dos subsídios à habitação):** real. O excerto selado do Eurostat diz «where the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances)», e a frase da casa dizia «descontados os subsídios» só da despesa. Corrigido na HB1-c6 nas duas edições, com o literal de apoio a cobrir a frase inteira.
- **Major 7 (as definições do INE, do Banco de Portugal e do Orçamento continuam a repetir o rótulo):** real e declarado desde a HB1-c2 (23 famílias, a lista em `correcao-hb1c/frases-hb1c2.json`); é a forma da casa para uma linha sem definição selada («A medida mostra …»), verdadeira e conferível, e não trava a publicação; um bloco próprio de definições a partir dos destaques alojados está na lista da higiene e na decisão §1.203.
- **Os três Minor e os sete «fine»:** o leitor não os entregou por extenso. O prompt pedia a leitura inteira em `LEITURA.md` na raiz do pacote e só os totais na resposta, e a caixa do Codex nas leituras é só de leitura (`ler.sh`): a escrita foi recusada e o texto perdeu-se. A lição entra no prompt comum das leituras do Codex: a leitura inteira vai na resposta final, nunca num ficheiro. Os Minor que a leitura curta de sexta-feira (HB1-d) voltar a ver entram na higiene.
