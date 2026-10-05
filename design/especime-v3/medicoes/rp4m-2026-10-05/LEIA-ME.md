# RP4-m · as séries que faltavam, o corredor das séries e o salário real

Construído pelo Claude Opus 5.5 (a definição `construtor`) a 05.10.2026, em 2 worktrees com o ramo `rp4m-2026-10-05`, a do sítio e a do motor, pelo brief `design/observatorio/BRIEF-RP4M-as-series-que-faltam-e-o-corredor-das-series.md` e pelo prompt do lugar de direção. Sem `push`. Cada número deste relatório está num ficheiro JSON desta pasta: `medidas.json` (escrito por `medir.py`, com o comando e o conhecido-positivo de cada medida), e os registos que ele lê, `brief-reproduzido.json`, `item2.json`, `i199.json`, `portao-do-motor.json`, `formas-rp4.json`, `series.json`, `plantas-da-lingua.json`, `capturas.json` e `custo.json`.

## O ponto de partida

O `main` andou depois de o ramo nascer, e o ramo fundiu-o 2 vezes antes de mexer no sítio, sem conflitos: `14ba0aaf` (sobre `6fb0d773`) e `ee6e4113` (sobre `3a253f73`). Voltou a andar durante o bloco, e o ramo fundiu-o outra vez antes dos portões finais, também sem conflitos (`6c223e0c`, sobre `40f0cb58`); essa fusão tirou 62 linhas do portão de HTML, e as citações do mapa que apontavam para depois delas andaram com elas (`711d3802`). O §0 do brief, reproduzido pelo seu guião, é igual ao ficheiro selado, medida a medida (`paragrafo_0_reproduzido_igual` em `medidas.json`): 16 séries no tempo, 7 linhas presas a uma série, 10 linhas do IPC com as coordenadas do `0014666` ou do `0014647`, das quais 5 principais e 0 presas, e 13 séries com ponto no período de base de 2015 da regra do RP4.

## O mandato, ponto a ponto

| Ponto | Resultado | Medida e prova |
|---|---|---|
| 1 · as cinco séries do IPC | **Feito.** As 2 médias de doze meses do `0014666` (o total e o total sem habitação) e as 3 classes do `0014647` (os combustíveis, as rendas, a energia em casa) entraram no construtor das séries do motor com as coordenadas das linhas, o primeiro período e a identidade copiados da metainformação; a travessia selou-as em `ledger/series/`, e as 5 linhas ganharam `serie:`, cada uma no último ponto da sua série. Os cartões desenham a sua série pela regra do RP4: o código dos cartões e da forma não mudou; no sítio mudaram a declaração dos nomes das séries e a metade do motor do `check:series`. | Pontos: 405 e 405 nas médias (desde 1992-12), 932, 932 e 932 nas classes (desde 1949-01), todas até 2026-08. 12 linhas presas no livro (eram 7). O bloco registou 322 pedidos (os dos pontos 1 e 4): 319 lidos e alojados em `source/rp4m/`, e 3 recusados com 414 (a lista inteira dos períodos num só endereço; a série pediu-se então ano a ano). `check:series` a 0 nos portões. |
| 2 · a linha do índice harmonizado de Portugal | **Parado pela regra de paragem**, com a medida feita. Posta no último ponto da série (setembro de 2026: «3,6» com a marca «e») numa cópia do livro, a linha parte 3 regras que protegem números: a série de países `ihpc-variacao-homologa-paises` (a faixa dos 27, que o brief manda ficar com a sua regra) tem de ter o período das duas gémeas, e a União continua em agosto; a régua declarada recusa «União de outro período»; a regra da marca no excerto de uma linha do Eurostat só aceita um ano e um país. A forma das correções também não diz uma mudança de período com o mesmo valor. A decisão é do lugar de direção (I202). | Na cópia intacta as 4 medições dão 0; com a linha movida: `ledger:check` dá 1, a S5 das séries 1 erro na série da faixa, a travessia do motor (VS3) 1 e a régua 1 (`item2.json`, escrito por `medir-item2.mjs`). |
| 3 · o corredor diário das séries | **Feito no motor, sem entrar no trabalho diário** (ver «O que fica»). `publisher/dominios_series_corredor.py`, ao lado do corredor das linhas: pede cada série pelo cliente da casa (no INE só quando a metainformação diz uma atualização nova), aloja os corpos numa cópia da fonte, constrói pelo construtor das séries e compara com as publicadas; um ponto publicado que a fonte muda é uma revisão por ponto tipada (a V16 com o período), guardada em `series-revisoes.json`, que só cresce, e nunca um valor escrito por cima; um ponto que desaparece, um cartão que ficaria atrás da sua série e uma revisão reescrita recusam a escrita. O módulo dos pedidos passou a ser partilhado (`publisher/series_pedidos.py`), e cada série lê-se da pasta mais recente que a tem inteira. | 2 corridas de ensaio contra as fontes vivas, com o relatório escrito: 21 séries, 16 pedidos, 0 pontos novos e 0 revisões; depois do ponto 4, 24 séries, 18 pedidos, 0 e 0. A suíte do corredor no portão do motor: 25 conferências e 5 plantas, com a do mandato (um ponto passado alterado numa cópia, no INE e no Eurostat, sai como uma revisão). Ficheiros por confirmar do motor mexidos: 0. |
| 4 · o salário real | **Feito, decidido pela fonte.** A metainformação do INE de 05.10.2026 tem 4 indicadores de salários desde 2014: `0011131` e `0011132` (Trimestral · Março de 2014 a Junho de 2026), `0011137` e `0011138` (Anual · 2014 a 2025). Entraram como séries a remuneração bruta mensal média por trabalhador anual (`0011138`) e o índice de preços no consumidor em média anual (`0014641`, Anual · 1948 a 2025), e a derivada do salário real em euros de 2015 (com a conta em palavras e o `check` ponto a ponto). O recibo da derivada tem a primeira figura indexada do sítio: as duas linhas a cem em 2015 (a da série do recibo a tracejado) e a legenda fora do desenho. | Pontos: 12 na nominal, 78 no índice anual (desde 1948), 12 na derivada; no ponto de 2025 a derivada vale 1 375 euros de 2015 e a nominal 1 696 euros correntes; o ponto de 2015 da derivada é o da nominal. A S4 do `check:series` refaz cada ponto em inteiros exatos, com 2 plantas. |
| 5 (a) · o que um índice quer dizer | **Feito.** O recibo de uma série cuja unidade é um índice com base diz, numa frase das cadeias da casa e nas duas edições, o que o último ponto quer dizer em relação à base: o período e o valor pelos seus componentes, e a palavra do lado escolhida pela comparação com cem. A unidade inglesa é «index (base 2025 = 100)»; a do salário real é «2015 euros per month». | A S6 confere a frase em cada recibo de índice (o mensal e o anual, que diz «igual à base»), com a planta do lado trocado. Capturas dos recibos nas duas edições. |
| 5 (b) · a marca do último ano | **Feito.** A marca do último ano ancora-se em janeiro, centrada, como as intermédias; a do primeiro ano continua no primeiro ponto. | Uma prova independente na célula do módulo (12 provas), com o conhecido-positivo: a forma antiga é recusada pela mesma leitura nas 2 séries da prova. A F21 recompôs 82 desenhos. |
| 5 (c) | Já decidido na RP4-b; nada a fazer. | |
| 6 · os registos | O mapa do repositório, o `README.md` das séries e o do publicador do motor, `ISSUES.md` (a I199 fechada, a I198 medida e aberta, e as I200 a I202), este relatório, `medidas.json` e as capturas. | O conferidor do mapa: 397 citações na linha citada, 0 longe, 0 por encontrar e 0 para lá do fim do ficheiro, com o conhecido-positivo de uma citação deslocada num mapa de prova. |

## O que o brief não previa, e o que se fez

**O §4 e o ponto 4.** O §4 diz «nenhuma mudança na forma `serie-do-pais` nem no portão da geometria», e o ponto 4 e o teste de aceitação pedem a primeira figura indexada do sítio no recibo da derivada. A F21 tinha 2 regras de página do RP4 que a recusavam: «nenhuma página usa o modo indexado neste bloco» e «o gráfico do recibo não é da sua série». A primeira guardava o âmbito do RP4 e não protegia nenhum número; a segunda protege que um recibo mostre a sua série. Mudaram de forma numa função só (`regraDaPagina`, em `tests/formas/serie-do-pais.mjs`), que conserva o que protegiam: o modo indexado só no recibo de uma série com figura declarada em `FIGURAS_INDEXADAS`, com as séries da declaração pela ordem dela (a última é a série do recibo), e o gráfico de qualquer outro recibo só a sua série, no modo da unidade. A recomposição da geometria (`conferirSerie`) não mudou. 5 plantas em memória provam que a regra ainda morde: o desenho indexado no recibo de uma série sem figura declarada, o desenho indexado numa página que não é um recibo, a figura com as séries por outra ordem, o recibo declarado só com a sua série, e o recibo com o gráfico de outra série. Desfazer a decisão é tirar uma entrada de `FIGURAS_INDEXADAS`: a F21 volta a recusar o desenho. A forma mudou só na marca do último ano, que o ponto 5 (b) pede.

**O índice do deflator.** O ponto 4 diz «deflacionada pelo índice de preços no consumidor, `serie-ipc-indice`», que é mensal. A série de salários que a fonte publica desde antes de 2015 é anual, e uma média anual deflaciona-se pela média anual do índice do mesmo ano: dividir pelo índice de um mês escolhido seria uma conta errada com ar de certa. Por isso entrou o índice em média anual que o INE publica (`0014641`, a mesma base 2025), e a S4 exige as origens na mesma cadência.

**A L1 do `check:lingua`.** As unidades inglesas do ponto 5 (a) entraram no dicionário das unidades, que os recibos das séries usam como os cartões, e a regra das entradas mortas da L1 chamou-lhes mortas, porque contava só as unidades das linhas: «índice (base 2025 = 100)» e «euros de 2015 por mês» só as séries as usam. A regra protege que o dicionário não engorde com entradas que não se rendem; mudou de forma e conta também as unidades das séries, e passou a exigir uma entrada para cada unidade de série, como já exigia para as das linhas. As 2 plantas, numa cópia do livro-razão pela porta `OEDP_LEDGER_DIR` do portão, morderam 2, com o controlo íntegro (`plantas-da-lingua.json`): a entrada do índice sem nenhuma série que a use é chamada morta, e a série do salário real com uma unidade inventada é recusada por não ter entrada.

## As plantas, e o que cada uma morde

| Onde | Estrago | O que morde |
|---|---|---|
| motor · corredor das séries | um ponto passado alterado numa cópia de um corpo, no INE e no Eurostat (a planta do mandato) | sai como uma revisão por ponto, com o período, a data, a natureza, o valor antigo e o novo; a travessia aceita-a contra um sítio com o valor antigo |
| motor · corredor das séries | o mesmo ponto revisto em silêncio, sem a revisão | a VP6: «sem uma entrada em corrections» |
| motor · corredor das séries | uma metainformação com outra atualização que as respostas não dizem; uma segunda escrita no mesmo dia; as revisões escritas por cima; a revisão mais recente que já não diz o ponto | a data de atualização; «uma escrita por dia»; «as revisões só crescem»; a revisão mais recente |
| motor · construtor das séries | 31 plantas, entre elas um ponto trocado no salário real e um corpo acima do teto registado pelo guião partilhado dos pedidos | a VP4 e o teto do corpo (a lista inteira na saída da suíte) |
| motor · o painel semanal solto (I199) | o guião sem o conserto, corrido de dentro de `indicators/` numa pasta temporária | falha com o defeito de 05.10, `No module named 'core'` |
| motor · o painel semanal solto (I199) | a `planta 17` do corredor, o guião solto com `--do-arquivo` | continua a falhar com `No module named 'indicators'` |
| motor · `core.reconcile` (I201) | «1 696» escrito com o espaço fino dos milhares | a conferência 29 lê 1696, e não 1 |
| sítio · F21, a regra da página | as 5 da secção anterior | as queixas da regra da página |
| sítio · `check:lingua`, a L1 | a entrada do índice sem série que a use; a série do salário real com uma unidade inventada | «que nenhuma linha nem série do livro-razão usa»; «não tem entrada» |
| sítio · célula do módulo | a marca do último ano no último ponto, encostada à direita (a forma antiga) | a leitura própria da marca, nas 2 séries da prova |
| sítio · `check:series` | um pedido com um resumo que nenhum corpo alojado dá; um ponto trocado no salário real; o índice anual mexido por baixo; a frase do índice com o lado da base trocado; a legenda da figura com as séries trocadas | S3, S4, S4, S6, S6 |
| sítio · capturas | o traço da série do recibo sem tracejado; um cartão mais largo do que o ecrã | a figura sem os dois traços distintos; a página a transbordar |

No sítio, as plantas da F21 morderam 21 de 21 (`formas-rp4.json`), as do `check:series` 28 de 28 (`series.json`, das quais 5 deste bloco) e as das capturas 4 de 4. Nenhuma planta escreve no `dist/`: as da F21 e do `check:series` mexem em cadeias em memória, e as das capturas numa folha de estilo posta e tirada no navegador.

## As questões do painel semanal e da agenda

**A I199 fechou** no commit `078211a` do motor. O pacote `core` regista-se pela sua pasta quando o guião corre solto, sem tocar no `sys.path` (a `planta 17` continua a morder), e um erro de importação pára a corrida em vez de se escrever «inacessível». A prova de dentro de `indicators/`, sem `PYTHONPATH`, numa corrida delimitada a uma linha (`i199.json`): 2 pedidos pelo cliente da casa, nenhum «No module named», e o código 1, que quer dizer um alarme do vigia dos limiares (a página do painel da Comissão mudou o conteúdo numérico), e não uma falha da corrida. A suíte `indicators.refresh_guiao_solto_test` entrou no portão do motor com 9 conferências.

**A I198 ficou aberta, medida.** As 5 frases inglesas com «the director», mudadas na origem (`agenda/agenda.json` do motor) e exportadas para uma cópia temporária do destino, fazem o exportador da agenda recusar a corrida em 4 itens pela H4 («A past entry was rewritten. Correct it with a new entry, not by editing the old one»), e a corrida de controlo sem a mudança dá 0. A H4 protege a história da agenda, o que atravessou não se reescreve, e o mandato não decidiu reescrevê-la; a origem ficou reposta, conferida pelo sha256. O caminho fica para o lugar de direção.

## Os portões e os commits

**O motor.** O portão do pre-commit (`python3 -m core.gate`) na cabeça final do motor, `a64ff623c40ec023c3cd25506da7e40c35ddb261`, com a árvore limpa: código 0 lido do ficheiro, 46 suítes a passar (`portao-do-motor.json`). As 4 suítes do bloco, corridas outra vez na mesma cabeça: 64 conferências no construtor das séries, 25 no corredor, 9 no painel solto e 29 no `core.reconcile`.

Commits do motor, no ramo `rp4m-2026-10-05`, todos com o portão do pre-commit:

- `8af3d78` · o ponto 1: as 5 séries do IPC, o módulo partilhado dos pedidos, as pastas das séries e as revisões por ponto no construtor
- `078211a` · a I199
- `653772f` · o ponto 3: o corredor das séries, a primeira corrida de ensaio e a suíte
- `5693e4a` · o ponto 4: as séries do salário real e a derivada, a I201 no `core.reconcile`, a medida da I198 e o README do publicador
- `d2f6e44` · a segunda corrida de ensaio do corredor, com as 24 séries
- `a64ff62` · o README do publicador: o corredor das séries corre à mão e ainda não no trabalho diário

**O sítio.** A corrida `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4m-2026-10-05/portoes`, pela tranca da máquina e com o motor ao lado (`RESEARCHHUB_DIR`, para a metade do motor da S3), na cabeça do código `711d38027e1caa88b54169a43eb5496e86459308`; `portoes/cabeca` e `portoes/cabeca.fim` são iguais, e no fim só estavam por juntar a pasta das medições (as capturas vieram depois dos portões) e a ligação da worktree às dependências, nenhum ficheiro seguido mudado (0). Os códigos foram lidos dos ficheiros, depois de cada processo acabar:

| Portão | Código lido | Segundos |
|---|---|---|
| `build` | 0 | 196 |
| `verify` | 0 | 1 029 |
| `typecheck` | 0 | 0 |

O cruzamento contra o motor (`check:cruzamento --with-origin`), que a cadeia do `verify` não corre, deu 0 na cabeça do código. Na mesma construção: a F21 recompôs 82 desenhos e leu 48 recibos com gráfico; o `check:series` leu 24 séries no tempo com 7 839 pontos, refez 152 pontos de 2 derivadas, prendeu 12 linhas e conferiu 7 687 pontos no corpo alojado do seu pedido.

Commits do sítio, no ramo `rp4m-2026-10-05`:

- `14ba0aaf` · fusão com main em `6fb0d773`, sem conflitos
- `ee6e4113` · fusão com main em `3a253f73`, sem conflitos
- `9f457ac7` · o ponto 1: as séries do IPC atravessadas do motor, com as linhas presas; a metade do motor do `check:series` nas pastas das séries, com a planta do resumo que nenhum corpo dá
- `34d6b8c3` · os pontos 4 e 5: as séries do salário real e a figura indexada, a frase do índice e as unidades inglesas, a marca do último ano; a regra da página da F21 e a L1 do `check:lingua` mudadas de forma, com as suas plantas; a segunda forma da S4 e as conferências novas da S6
- `af2f75b5` · os registos: o mapa do repositório, o `README.md` das séries e o `ISSUES.md`
- `6c223e0c` · fusão com main em `40f0cb58`, sem conflitos
- `711d3802` · as citações do portão de HTML no mapa, depois da fusão

O commit seguinte guarda só esta pasta e a das capturas; a sua cabeça vai na resposta de entrega.

## As capturas

70 capturas em `design/especime-v3/capturas/rp4m-2026-10-05/`, nas duas edições e nas larguras 390, 768, 1 024, 1 280 e 1 600 px, da construção da cabeça do código: a página dos preços inteira e o cartão da comparação europeia recortado, a página da habitação (onde estão os cartões das rendas e da média sem habitação), o recibo do índice mensal (a frase e a unidade inglesa), o do salário real (a figura indexada), o da remuneração (a marca do último ano) e o dos combustíveis (uma das 5 séries do IPC). Erros do guião: 0; páginas a transbordar: 0; plantas visuais mordidas: 4 de 4; letras dos eixos entre 11,799375 e 12 px no ecrã. `capturas.json` guarda o resumo, os bytes e as medidas de cada uma.

## Custo e modelo

Modelo: Claude Opus 5.5 em todas as respostas do registo da sessão (`custo.json`, escrito por `custo.py` sobre o registo da sessão do construtor, com o sha256 dos bytes lidos). 17 418 segundos da primeira entrada do registo até à leitura, 515 respostas do modelo, 247 899 449 símbolos de entrada (a nova, a escrita na cache e a lida da cache). A saída registada, 65 673 símbolos, é um mínimo e não a saída: em 364 respostas o registo guardou a saída de um momento do fluxo e não a final. O total cumulativo que a ferramenta reporta ao lugar de direção quando o agente acaba lê-se do lado de quem lançou.

## O que fica

- **O ponto 2** (I202): a regra da faixa dos 27 e a forma de uma linha que muda de período com o mesmo valor são decisões do lugar de direção; até lá a linha do índice harmonizado de Portugal fica em agosto e sem `serie:`.
- **A I198**: a forma de corrigir uma entrada da agenda que já atravessou (uma emenda registada com o texto antigo, que a H4 aprenda a aceitar, ou uma entrada nova ao lado da antiga).
- **O corredor das séries no trabalho diário do motor** (`.github/workflows/corredor.yml`): o corredor corre à mão, em ensaio ou com escrita. Não entrou no trabalho diário porque um mês novo numa série presa a um cartão só se escreve depois de a linha andar (a S5 recusa um cartão atrás da sua série), e a forma de uma linha mudar de período é a questão aberta da I202: a ordem das duas escritas no trabalho diário decide-se com ela, e uma mudança num trabalho do GitHub não se prova daqui.
- **A I200**: o `requirements.lock.txt` do motor sem o `xlrd`, resolvido num ambiente limpo.
- A leitura a frio do pacote, por outra família.
