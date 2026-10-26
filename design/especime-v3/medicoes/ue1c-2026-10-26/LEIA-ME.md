# UE1-c: releitura das séries por país, 26.10.2026

**UE1-c-c (o lugar de direção, 26.10.2026, 18:2x UTC), depois de ler as razões regeneradas pela UE1-c-b:** o molde do mandato («O Eurostat reviu o valor de {país} de … para …») pedia o artigo que cada país tem ou não tem em português («da Bélgica», «de Espanha», «dos Países Baixos») e saiu «o valor de Bélgica». O erro do molde é do lugar de direção. A forma passa a ter o nome do país à frente, como rótulo, nas duas línguas: «Bélgica: o Eurostat reviu o valor de 107,9 para 108,1 na atualização do conjunto de dados de 21.10.2026 (a versão anterior era de 22.04.2026); este projeto releu a fonte a 26.10.2026.» / «Belgium: Eurostat revised the value from 107.9 to 108.1 in the dataset update of 21.10.2026 (the previous version was of 22.04.2026); this project re-read the source on 26.10.2026.» O molde do corredor mudou no motor e as 29 razões já escritas foram reescritas por guião no motor (`series.json`, `series-paises-revisoes.json`, `primeira-releitura.json`) e nas quatro séries do sítio com revisões, só nas linhas `reason` e `reason_en` (conferido linha a linha); os valores, as datas e as chaves são os mesmos; a prova de que a forma escrita é a que o gerador escreve agora: `comparar()` sobre o ponto da Bélgica dá a mesma frase. O exportador passou sem escrever as séries (VS6 conservada) e reescreveu `ledger/cruzamentos/series.json`; `ledger:check` 0 e `check:series` 0 com o motor ao lado.

## UE1-c-b: correção depois da leitura a frio, 26.10.2026

### O leitor e a prova no HTML

As duas linhas da dívida de 2025 dizem agora quando o Eurostat atualizou o conjunto, qual era a versão anterior e quando este projeto releu a fonte. Só mudaram `reason` e `reason_en` das entradas `atualizacao` e `access_date` de 26.10; os valores, as datas, a natureza e os motivos do `excerpt` ficaram intactos. O guião leu os valores e os carimbos das duas linhas ALARM transcritas do §0.3 do mandato em `b/alarmes.txt` e recusa outra forma ou conteúdo. Não é uma nova corrida do painel.

Transcrições dos quatro recibos construídos, com os resumos do HTML em `b/recibos.json`. A medição leu as 12 razões, incluindo os quatro motivos dos excertos preservados:

- `/livro-razao/divida-publica-2025/`:

  > O Eurostat reviu o valor de 89,7 para 89,2 na atualização do conjunto de dados de 21.10.2026 (a versão anterior era de 22.04.2026). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.

  > O valor novo foi lido a 26.10.2026, o dia em que este projeto releu a fonte; a leitura anterior, de 12.08.2026, é a do valor 89,7.
- `/livro-razao/divida-publica-2025-ue/`:

  > O Eurostat reviu o valor de 81,7 para 81,5 na atualização do conjunto de dados de 21.10.2026 (a versão anterior era de 22.04.2026). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.

  > O valor novo foi lido a 26.10.2026, o dia em que este projeto releu a fonte; a leitura anterior, de 15.09.2026, é a do valor 81,7.
- `/en/ledger/divida-publica-2025/`:

  > Eurostat revised the value from 89.7 to 89.2 in the dataset update of 21.10.2026 (the previous version was of 22.04.2026). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published.

  > The new value was read on 26.10.2026, the day this project re-read the source; the earlier reading, of 12.08.2026, is that of the value 89,7.
- `/en/ledger/divida-publica-2025-ue/`:

  > Eurostat revised the value from 81.7 to 81.5 in the dataset update of 21.10.2026 (the previous version was of 22.04.2026). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published.

  > The new value was read on 26.10.2026, the day this project re-read the source; the earlier reading, of 15.09.2026, is that of the value 81,7.

### O motor, o manifesto e a história das séries

`copia_da_fonte` copia agora a árvore de `corredor-series-paises/`, em vez de ligar as pastas de dia. A conferência do manifesto recusa sobras, faltas e corpos com outro sha256. Só o passo final publica corpos das séries que mudaram. O comentário «Só os corpos realmente publicados entram no inventário canónico» era falso na entrega anterior, porque as escritas podiam atravessar as ligações; passa a corresponder ao caminho conferido.

Saíram os quatro corpos sem registo: 001, desemprego de longa duração; 003, IHPC; 009, desemprego MIP; 010, emprego. A correspondência foi lida de `pedidos.jsonl`. Os dez corpos e recibos da corrida continuam intactos. `FETCH.json` e `MANIFEST.sha256` estão byte a byte como na cabeça de partida. A auditoria em `b/auditoria.json` contou **6 ficheiros e 6 entradas do manifesto no corredor, zero sobras, zero faltas**, todos com o sha256 correto. A lista dos seis caminhos e resumos fica nesse ficheiro.

O ensaio do corredor deu **código 0, 14 plantas**: as 11 anteriores, a repetição de dois corpos no mesmo dia (uma medida revista e outra igual), o ficheiro não registado plantado durante a corrida, e o país sem nome. O intruso foi recusado com «ficheiro não registado no manifesto do corredor». O módulo continua em `TEST_MODULES` do `core.gate`; correu individualmente nesta passagem. O `core.gate` inteiro fica para a aterragem, conforme o §1.5. O construtor e exportador passaram 27 conferências e 12 plantas. A repetição adicional dos dez recibos deu zero recusas, zero séries mudadas e zero ficheiros canónicos alterados.

As **29 revisões** foram regeneradas por `comparar` a partir dos corpos anteriores e novos, com os nomes de `publisher.series_paises.tabela_dos_paises`, lidos dos RDF da autoridade dos países do Serviço das Publicações da União Europeia. O guião confirmou a igualdade dos 27 pares de nomes com `src/data/paises-da-uniao.json`, a tabela de `nomeDoPais`. A União usa «União Europeia» e «European Union». Datas e decimais seguem os moldes do mandato. Todas as 29 formas foram conferidas nas duas línguas. Exemplos:

> O Eurostat reviu o valor de Portugal de 89,7 para 89,2 na atualização do conjunto de dados de 21.10.2026 (a versão anterior era de 22.04.2026); este projeto releu a fonte a 26.10.2026.

> Eurostat revised the value for European Union from 81.7 to 81.5 in the dataset update of 21.10.2026 (the previous version was of 22.04.2026); this project re-read the source on 26.10.2026.

As seis séries da entrega foram renderizadas pelo exportador habitual; duas não tinham revisões de valores e conservaram os mesmos bytes. Quatro YAML mudaram. A travessia integral habitual passou depois, com as 35 séries, e atualizou os resumos de `ledger/cruzamentos/series.json`. A VS6 permanece intacta. A emenda autorizada foi precedida pela comparação que só permite mudar as razões. Nenhum ponto, marca, `geo`, `date`, `kind`, `old_value` ou `new_value` mudou. A auditoria confirmou ainda que `indicators/reler_linhas.py` é igual ao de `master`.

### Conferências e limites

| Operação ou conferência | Código | Prova em `b/` |
|---|---|---|
| `auditoria` | 0 | [`auditoria.log`](b/auditoria.log), [`auditoria.codigo`](b/auditoria.codigo) |
| `build` | 0 | [`build.log`](b/build.log), [`build.codigo`](b/build.codigo) |
| `construtor` | 0 | [`construtor.log`](b/construtor.log), [`construtor.codigo`](b/construtor.codigo) |
| `corredor` | 0 | [`corredor.log`](b/corredor.log), [`corredor.codigo`](b/corredor.codigo) |
| `exportar` | 0 | [`exportar.log`](b/exportar.log), [`exportar.codigo`](b/exportar.codigo) |
| `ledger` | 0 | [`ledger.log`](b/ledger.log), [`ledger.codigo`](b/ledger.codigo) |
| `palavras` | 0 | [`palavras.log`](b/palavras.log), [`palavras.codigo`](b/palavras.codigo) |
| `recibos` | 0 | [`recibos.log`](b/recibos.log), [`recibos.codigo`](b/recibos.codigo) |
| `regenerar` | 0 | [`regenerar.log`](b/regenerar.log), [`regenerar.codigo`](b/regenerar.codigo) |
| `registo` | 0 | [`registo.log`](b/registo.log), [`registo.codigo`](b/registo.codigo) |
| `repeticao-corrigida` | 0 | [`repeticao-corrigida.log`](b/repeticao-corrigida.log), [`repeticao-corrigida.codigo`](b/repeticao-corrigida.codigo) |
| `repeticao` | 1 | [`repeticao.log`](b/repeticao.log), [`repeticao.codigo`](b/repeticao.codigo) |
| `series` | 0 | [`series.log`](b/series.log), [`series.codigo`](b/series.codigo) |
| `typecheck` | 0 | [`typecheck.log`](b/typecheck.log), [`typecheck.codigo`](b/typecheck.codigo) |

Cada ficheiro `*.execucao.json` guarda o comando real e a duração medida. `build` corresponde a `npm run build`, `series` a `npm run check:series`, `ledger` a `npm run ledger:check`, `palavras` a `npm run check:palavras`, `registo` a `npm run check:registo` e `typecheck` a `npm run typecheck`. O build correu uma vez e ficou a zero, incluindo a voz. O livro mantém os dez avisos que o comando imprime; não são falhas.

O código 1 de `repeticao` conserva-se: a primeira medição exigia que o relatório antigo mantivesse os resumos das duas linhas cujo texto foi corrigido. Só esses dois resumos diferiam; a igualdade de todos os ficheiros canónicos já passara. A medição foi corrigida para usar uma pasta temporária com os mesmos corpos, sem substituir o relatório histórico. `repeticao-corrigida` ficou a zero. Não houve corrida inteira dos portões, `verify`, `core.gate`, capturas, fusões nem escritas avulsas em `dist/`. Só `npm run build` o construiu. A regra 11 ficou preservada.

### O que fica declarado, sem correção nesta passagem

1. A primeira página e o recibo de Portugal ainda juntam o 2025 revisto (89,2) ao 2024 a 93,5. O mandato identifica 93,0 na publicação de 21.10; a linha de 2024 pertence ao CR2 do sítio. A fusão posterior traz essa correção e o lugar de direção confere a primeira página.
2. O estudo do Orçamento de 2027 conserva as leituras de abril (89,7; 81,7; 8,0; EE 24,1; EL 146,1; ES 100,7) e a referência à notificação do INE de setembro com 89,2. É um documento datado. A nota datada entra com o item do voto depois de 28.10, I263.
3. A entrada da dívida da União em «O que mudou» ainda tem o rótulo inglês. A correção dos nomes em `src/lib/mudancas.mjs` chega com o CR2-h.
4. A alteração anterior da N1B, em `tests/inicio/blocos-unicos.mjs`, admite que a leitura da semana cite a frase do bloco que mudou, com seis plantas. O lugar de direção aceitou-a porque conserva a proteção: texto recomposto, uma ocorrência por bloco, só na lista das duas rotas, recusando outras rotas, repetições e citações fora da lista. A W2 confere os blocos mudados. O inventário da voz passou de 72 para 76 pelas quatro entradas de proveniência, mantendo a classificação C2. Esta passagem não altera essas réguas.
5. A medição das frases em `medir.mjs` é desigual entre edições. A medição desta correção limita-se aos quatro recibos e não pretende corrigir essa cobertura.
6. «Próxima verificação 21.10.2026» no recibo de Portugal já passou. Fica para a higiene, I-por-abrir.
7. O corredor anterior tinha onze plantas, não dez: a décima primeira admite meses extra sem perder o período selado. A contagem desta passagem é catorze.

A afirmação «Repetição sem escrita canónica» da entrega anterior foi corrigida no texto abaixo e em `RELATORIO.md`. O «28» plantado no pacote pelo lugar de direção não foi tocado.

### Entrega e custo

Cabeças de partida conferidas: sítio `07233897d`, motor `6c44edf`. O sítio é entregue pelo escrivão com os trailers do mandato; a cabeça final é indicada na resposta. O motor fica por comitar, pela alternativa expressa do §1.5: `comitar.sh` não transmite `OEDP_GATE`, `escrivao.py` não lê esse campo, e a variável não está definida nesta sessão. Não se pediu um commit que pudesse correr o portão adiado. `b/commit-motor.json` regista a limitação e `ficheiros-motor.json` lista os nove ficheiros explícitos. O lugar de direção comita o motor e corre o portão na aterragem.

Até à escrita deste relatório: **32 chamadas de ferramentas**, **14 invocações registadas**, das quais **12 conferências, ensaios ou medições** e duas operações de regeneração e exportação. Os subcomandos internos do build não são contados outra vez. `custo.json` guarda esta medição, as durações e a ausência de medida de pontos; o lançador acrescenta os pontos. A resposta final dá o total de chamadas depois do commit e da inspeção. **tokens used: não exposto.**

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

A primeira consulta obteve as dez respostas. A reconstrução inicial recusou o IHPC por terem surgido mais meses na resposta; a regra foi corrigida para conferir o período selado e recusar a sua perda, admitindo meses adicionais. A segunda reconstrução reutilizou os mesmos dez recibos, sem nova consulta à rede. Depois da travessia, repetir os recibos deu zero recusas. A afirmação original de que não houve escrita canónica estava errada: as ligações das pastas de dia deixaram quatro corpos sem registo na fonte. A correção UE1-c-b, descrita acima, substitui as ligações por cópias e prova a repetição sem alterações canónicas. Os dez corpos anteriores conservaram os seus sha256.

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
