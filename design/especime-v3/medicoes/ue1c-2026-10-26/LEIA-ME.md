# UE1-c: releitura das séries por país, 26.10.2026

## Resultado e limite da entrega

A ferramenta relê as dez medidas pelo cliente da casa e reconstrói os 280 pontos com os recibos. Foram aplicadas 29 revisões de valor em quatro séries, com história nas duas línguas; quatro séries mudaram a marca da Eslováquia para `b`. Os dois valores da dívida pública de 2025 passaram a 89,2 % do PIB em Portugal e 81,5 % na União. Os quatro recibos construídos incluem a `atualizacao` e `published_at: 2026-10-21`.

As oito conferências específicas pedidas estão a zero. A única execução de `npm run build` terminou com código 1 em A1: a revisão da União estava classificada como Portugal. A declaração do lugar foi corrigida, o HTML foi recomposto por `npx astro build`, os cartões foram refeitos e a conferência dirigida do país deu zero. Os passos seguintes da construção revelaram dois conflitos que também foram corrigidos e conferidos isoladamente: a contagem de proveniência no inventário da voz e a citação legítima da primeira página na leitura semanal. O código original do build conserva-se como 1; não houve uma segunda corrida do comando inteiro.

Os commits não foram pedidos: falta o endereço `Claude-Session` no mandato e o escrivão ativo não tem um mecanismo para receber `OEDP_GATE=adiado` no pedido. A variável não foi recebida nesta sessão. A tentativa de inspecionar o ambiente do processo foi recusada pela sandbox: `PermissionError: [Errno 1] Operation not permitted: 'ps'`. Não se pediu escalada nem se correu o portão inteiro para contornar a instrução de o adiar. As duas informações foram pedidas durante o trabalho e continuam pendentes.

## Cabeças e dependências

| Repositório | Cabeça lida | Commit desta passagem |
|---|---|---|
| sitio | `442b284e229408018e8c97c59dadd285a526bf3c` | não criado |
| motor | `8c0493f64ef689f57e16a4c401888b233f2a7678` | não criado |

As worktrees partiram de main e master sem a maquinaria do CR2. Transportaram-se, por leitura do ramo `cr2-2026-10-26`, `indicators/reler_linhas.py`, o seu ensaio e os recibos da releitura de 26.10 no motor, e `scripts/aplicar-releituras.py` no sítio. Nenhuma das quinze outras linhas do CR2 foi aplicada. A origem do motor é `d8f0513b0713bedbd73f0c510bed875659a2f04f`; o guião do sítio recebeu apenas a seleção `--linhas`, com ensaio próprio. Nenhum `indicators/*.json`, `sweeps/` ou `.maintenance-locks/` foi alterado.

## Ferramenta e ensaios

Escolheu-se `publisher/series_paises_corredor.py`, separado do construtor. Reutiliza `series_pedidos.pedir` e `series_paises.construir_serie`; o modo de comparação suspende apenas a igualdade de valores com as gémeas, que o exportador continua a exigir. Os rótulos, coordenadas, unidade e países continuam conferidos. O corpo anterior é recomposto e confrontado com a série publicada antes de se usar o seu carimbo.

Os corpos novos publicados vivem em `content/13 Dominios/source/corredor-series-paises/<dia>/<sha256>/`, com FETCH e manifesto. O índice `series-paises-leituras.json` seleciona o corpo vigente e `series-paises-revisoes.json` guarda a história. A comparação exige a conservação das entradas anteriores e a continuidade dos valores. Duas revisões no mesmo dia podem acrescentar-se pela ordem da cadeia, sem apagar a primeira. A VS6 recusa um ponto mudado sem revisão e a reescrita da história publicada.

A primeira consulta obteve as dez respostas. A reconstrução inicial recusou o IHPC por terem surgido mais meses na resposta; a regra foi corrigida para conferir o período selado e recusar a sua perda, admitindo meses adicionais. A segunda reconstrução reutilizou os mesmos dez recibos, sem nova consulta à rede. Depois da travessia, repetir os recibos deu zero recusas e nenhuma escrita canónica. Os dez corpos anteriores conservaram os seus sha256.

| Ensaio final | Resultado |
|---|---|
| Corredor de países, integrado em TEST_MODULES | 11 plantas, código 0 |
| Construtor e exportador de países | 27 conferências, 12 plantas, código 0 |
| Séries no tempo, travessia conjunta | 66 conferências, 33 plantas, código 0 |
| Rótulos das séries | 5 plantas, código 0 |
| Releitura das linhas do CR2 | 5 testes, código 0 |
| Seleção de linhas | seleção isolada e 3 recusas, código 0 |
| Aplicação das duas linhas | 16 plantas, código 0 |
| Published-at das duas linhas | 12 plantas, código 0 |
| Blocos únicos da navegação | 16 plantas, incluindo 6 novas, código 0 |

A alteração da N1B é restrita à lista marcada das duas rotas da leitura semanal: o texto tem de coincidir com a frase recomposta, uma vez por bloco. As plantas recusam a citação fora da lista, noutra rota ou repetida. A W2 continua a conferir quais os blocos que realmente mudaram. O inventário da voz conserva a classificação C2 e passa à contagem 76, lida no HTML.

## Pontos revistos, por série

| Série | Revisões de valores | Marcas |
|---|---|
| `desemprego-de-longa-duracao-2025-paises` | nenhuma | nenhuma |
| `divida-publica-2025-paises` | BE: 107,9 → 108,1; CZ: 44,3 → 44,2; DK: 27,9 → 27,2; DE: 63,5 → 62,8; EE: 24,1 → 24,0; IE: 32,9 → 34,8; EL: 146,1 → 145,4; ES: 100,7 → 100,5; FR: 115,6 → 115,7; HR: 56,3 → 55,7; IT: 137,1 → 136,7; CY: 55,0 → 52,3; LV: 46,9 → 46,2; LT: 39,5 → 39,3; LU: 26,5 → 26,0; HU: 74,6 → 74,4; MT: 46,4 → 46,3; NL: 44,4 → 44,7; AT: 81,5 → 80,7; PL: 59,7 → 59,6; PT: 89,7 → 89,2; RO: 59,3 → 58,9; SI: 65,7 → 65,1; SK: 61,4 → 60,5; FI: 88,5 → 88,4; EU27_2020: 81,7 → 81,5 | nenhuma |
| `ihpc-variacao-homologa-paises` | nenhuma | nenhuma |
| `precos-da-habitacao-2025-paises` | AT: 2,6 → 2,5 | nenhuma |
| `racio-s80-s20-2025-paises` | nenhuma | SK: sem marca → b |
| `risco-de-pobreza-ou-exclusao-2025-paises` | nenhuma | SK: sem marca → b |
| `sobrecarga-do-custo-da-habitacao-2025-paises` | DK: 23,4 → 14,7 | SK: sem marca → b |
| `sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-paises` | DK: 23,6 → 23,0 | SK: sem marca → b |
| `taxa-de-desemprego-mip-2025-paises` | nenhuma | nenhuma |
| `taxa-de-emprego-2025-paises` | nenhuma | nenhuma |

Cada revisão leva o país, os valores antigo e novo, a data da releitura e os dois carimbos completos do conjunto nos motivos em português e inglês. Os carimbos e sha256 por série estão em `medidas.json`; os pedidos da rede estão no motor em `indicators/out/series-paises/2026-10-26/pedidos.jsonl`. `primeira-releitura.json` conserva a comparação inicial e `corredor.json` a repetição sem mudanças.

## As duas linhas e os recibos construídos

As linhas foram preparadas antes da travessia, porque a VS3 não permite atravessar a série nova contra linhas ainda antigas. Depois atravessaram as séries pelo exportador da casa. A exportação completa reordenou também as chaves do objeto `definition_sources` da série de rendibilidade das obrigações, sem mudar o conteúdo; os resumos do cruzamento correspondem aos bytes exportados.

- `/livro-razao/divida-publica-2025/`: 26.10.2026atualização89,7 → 89,2O Eurostat reviu o valor de Portugal a 21.10.2026 (o carimbo do conjunto passou de 22.04.2026 a 21.10.2026); a reconferência semanal de 26.10.2026 viu a revisão.
- `/livro-razao/divida-publica-2025-ue/`: 26.10.2026atualização81,7 → 81,5O Eurostat reviu o valor da União a 21.10.2026 (o carimbo do conjunto passou de 22.04.2026 a 21.10.2026); a reconferência semanal de 26.10.2026 viu a revisão.
- `/en/ledger/divida-publica-2025/`: 26.10.2026update89,7 → 89,2Eurostat revised Portugal's value on 21.10.2026 (the dataset stamp moved from 22.04.2026 to 21.10.2026); the weekly check of 26.10.2026 caught the revision.
- `/en/ledger/divida-publica-2025-ue/`: 26.10.2026update81,7 → 81,5Eurostat revised the EU value on 21.10.2026 (the dataset stamp moved from 22.04.2026 to 21.10.2026); the weekly check of 26.10.2026 caught the revision.

## Frases lidas do dist

O guião `medir.mjs` encontrou 68 frases nas páginas que referem a dívida, guardadas em `medidas.json` com a rota e o sha256 do HTML. Remove apenas as pastilhas da fonte na transcrição. Exemplos das duas edições:

- `/`: A dívida pública desceu de 2024 para 2025 e está acima da média da União. Para a Comissão Europeia, uma dívida acima de 60 % do PIB é sinal de possível desequilíbrio, e a de Portugal está acima.
- `/en/`: Public debt fell from 2024 to 2025 and is above the Union average. For the European Commission, debt above 60 % of GDP is a sign of a possible imbalance, and Portugal’s is above it.
- `/explicacoes/dinheiro-do-estado-2026/`: No fim de 2025, a dívida pública valia 89,2 % do que o país produz num ano, acima dos 81,5 % da média da União Europeia, e as contas públicas fecharam o ano com um saldo de 0,7 % do produto, um excedente (recebeu mais do que gastou).
- `/en/explainers/dinheiro-do-estado-2026/`: At the end of 2025, public debt was worth 89,2 % of what the country produces in a year, above the 81,5 % average of the European Union, and the public accounts closed the year with a balance of 0,7 % of output, a surplus (it took in more than it spent).

## Códigos

| Conferência ou operação | Código |
|---|---|
| `aplicar` | 0 |
| `blocos-unicos` | 0 |
| `build` | 1 |
| `cartao` | 0 |
| `cartoes-corrigidos` | 0 |
| `construtor-plantas` | 0 |
| `corredor-plantas` | 0 |
| `cruzamento` | 0 |
| `discussao` | 0 |
| `explicacoes` | 0 |
| `exportar` | 0 |
| `formato` | 0 |
| `ledger` | 0 |
| `lingua` | 0 |
| `navegacao-corrigida` | 1 |
| `navegacao-final` | 0 |
| `navegacao` | 1 |
| `nomes` | 0 |
| `pais-corrigido` | 0 |
| `published-at` | 0 |
| `registo` | 0 |
| `reler-plantas` | 0 |
| `render-corrigido` | 0 |
| `rotulos-plantas` | 0 |
| `selecao-plantas` | 0 |
| `series-tempo-plantas` | 0 |
| `series` | 0 |
| `sinais` | 0 |
| `stamp` | 0 |
| `typecheck` | 0 |
| `voz-corrigida` | 1 |
| `voz-final` | 0 |
| `voz` | 1 |

Os códigos intermédios vermelhos permanecem nos ficheiros. `voz-final` e `navegacao-final` são as conferências das correções; `pais-corrigido` confere a declaração do lugar. Não houve `verify`, corrida inteira de portões, core.gate nem capturas. A leitura a frio, a corrida inteira antes de publicar, o core.gate na cabeça do motor e a aterragem continuam no lugar de direção, como o §3 manda.

## Custo e reprodução

As chamadas e os tokens medidos do registo da sessão ficam em `sessao.json`. `corridas.json` lista as 34 invocações de conferências e ensaios, sem contar de novo os subcomandos internos do build; regista separadamente a única renderização Astro dirigida. O custo em pontos é medido pelo lançador e não está disponível nesta passagem. O alvo abaixo de cinco pontos não foi confirmado.

Para repetir a medição: `RESEARCHHUB_DIR=<motor> node design/especime-v3/medicoes/ue1c-2026-10-26/medir.mjs`. Uma pasta nova no corredor pede a rede; repetir a mesma pasta relê os recibos. Os ficheiros por comitar estão listados em `ficheiros-motor.json` e `ficheiros-sitio.json`. A retoma precisa de resolver os dois dados do commit acima, comitar pelo escrivão e reler as cabeças e o estado das árvores.
