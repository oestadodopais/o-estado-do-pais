# Adenda B ao mandato DO2: as três réguas vermelhas da corrida inteira, de uma vez (30.10.2026, 11:11 UTC)

Acrescenta: nada

*A mesma sessão, a mesma worktree (ramo `do2-2026-10-30`, cabeça f257a15d7, com a tua implementação parcial por comitar). Escrita pelo lugar de direção do dia (Claude Opus 5.5). A retoma das 10:27 UTC parou pela regra certa (a `voz-pais.mjs`). Pela M99, o lugar de direção correu a lista inteira do `verify` sobre o `dist/` que a tua retoma construiu (`conferir-tudo.sh --sem-build`, 53 passos, 1 692 s, 11:08 UTC): três vermelhos e cinquenta verdes. Esta adenda nomeia os três; nenhuma outra régua está vermelha nesta árvore. `main` avançou para fb23e0a4e às 11:10 UTC (a PL1 aterrada), que é o antepassado da tua cabeça: não há nada a fundir.*

## 1 · `check:datas`: o lado dos dados aplica a regra do §2.3

A falha, nas duas edições: «/estado-e-economia: declara 2 edição(ões) de estudo e os dados dizem 3» (e o mesmo em `/en/state-and-economy`). O que a porta imprime está certo (o estudo do Orçamento é representado pelo dossiê); a régua conta os estudos da porta pelos dados sem tirar os que pertencem a um dossiê dessa porta. A contagem esperada passa a vir da mesma função que decide o que a porta lista (a pertença por `dossieDaPeca` e as `portas` do dossiê), nunca de um número escrito; a régua continua a recusar uma porta que declare menos ou mais estudos do que essa conta. A planta: um estudo de um dossiê da porta listado outra vez na secção dos estudos é recusado; um estudo fora de dossiês tirado da porta é recusado.

## 2 · `check:voz`: a lista fechada da primeira página e do Temas conhece as formas do §3

As falhas: «, a mais recente de» na primeira página; «5», «peças» e «, a mais recente de» no Temas; e as mesmas em inglês («, the most recent from», «5», «pieces»). Em `scripts/voz-pais.mjs`:

- as cadeias das formas do §3.1 e do §3.3 (as de `src/i18n/strings.mjs`, as duas edições, singular e plural) entram em `permitidos`, lidas de `strings.mjs` e nunca escritas outra vez à mão;
- os nós de uma entrada de dossiê (a da caixa das novidades e a da lista dos dossiês do Temas) só se dispensam depois de a conferência da sua superfície os ter conferido (`conferirNovidades` na primeira página, `conferirSuperficieDossies` no Temas), pela forma que a régua já usa para `[data-novidades]` e para `do1.nos`; o algarismo da contagem dispensa-se só dentro de um `[data-prova]` cuja chave seja `dossie_pecas_*` ou `dossie_itens_*`, que o portão de HTML reconta.

A planta: uma palavra fora das formas do §3 dentro de uma entrada de dossiê é recusada pela régua; um algarismo fora de um `[data-prova]` dentro da entrada é recusado.

## 3 · `check:frases-compostas`: as superfícies da discussão saíram da primeira página e a planta segue-as

A falha: «a planta não encontrou uma frase com pedaços marcados», na superfície «conclusão da discussão» (`[data-discussao-conclusao]`, rota `home`). Os três itens estão no dossiê do Orçamento, e a primeira página imprime agora só a linha do dossiê; a conclusão de cada item imprime-se na página do dossiê (medido: `data-discussao-conclusao` está em `dossies/orcamento-2027/index.html` e na edição inglesa, e já não em `index.html`). Em `tests/explicacoes/frases-compostas.mjs`, as superfícies «conclusão da discussão» e «parágrafo da discussão» correm na rota do dossiê do Orçamento, nas duas edições e nas larguras da régua, e também na primeira página quando ela imprimir um item fora de dossiês; uma superfície que não exista em nenhuma das páginas onde deve existir é um erro, nunca um salto. A planta: com a superfície tirada da página do dossiê numa cópia, a régua recusa.

## 4 · O resto da tua lista

O que o teu relatório das 10:37 UTC deixou por fazer continua mandado: o inventário das frases (bloco `do2`) e a sua revisão, o mapa dos construtores, as cinco plantas da adenda A e as plantas desta, e um `npm run build` inteiro no fim pelo escrivão, que tem de dar 0. Entre commits correm só as conferências que a mudança toca (`check:datas`, `check:voz`, `check:frases-compostas`, `check:dossies`, os testes de `tests/inicio/` e de `tests/discussao/`); o lugar de direção corre outra vez a lista inteira na cabeça antes da leitura a frio. Comita por secção.

## 5 · O orçamento e o que pára

Esta retoma: sessenta minutos e oitenta chamadas. Paras e dizes só se uma das três correções pedir enfraquecer uma régua (uma contagem escrita à mão, uma superfície saltada, uma palavra dispensada sem conferência), ou se o `npm run build` final der vermelho por uma régua que esta adenda não nomeia.
