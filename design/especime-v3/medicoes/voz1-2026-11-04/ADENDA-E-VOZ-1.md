# Adenda E ao mandato VOZ-1: acabar a VOZ-1 E (a check:discussao nas páginas das correções) (05.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree, sobre 6677aaff4, que é a tua passagem tal como a deixaste, comitada por este lugar sem mudança.*

## §0 Medido por este lugar

- `npm run check:discussao` sobre o `dist/` que deixaste: 8 erros, 4 em cada edição, em `correcoes/index.html` e `en/corrections/index.html`: «presença ou ausência errada», «destino ou título errado», «exceção temática não autorizada» (V2B) e «falta uma origem de valor ou período» (V2D).
- A causa (`tests/discussao/itens.mjs:317-321`): no registo, um nó de uma linha dentro de `[data-mudou-registo] li[data-mudanca="correcao"][data-correcao-entrada]` é uma entrada do registo, e a porta da discussão dessa linha fica no recibo, conferida pelo percurso V2D. As linhas das revisões de proveniência (`ul.registo-proveniencia-linhas li[data-correcao-entrada]`) não casam com esse seletor; desde que nomeiam a sua linha com marcas de origem, a régua conta-as como linhas impressas na página e espera a porta na própria página. O erro V2D é consequência da porta em falta.

## §1 O que fazes

1. Uma linha de uma revisão de proveniência é uma entrada do registo, como uma correção de valor: a porta da discussão da sua linha fica no recibo, a um toque, e a régua trata-a pelo mesmo percurso V2D que já confere as correções de valor (o recibo existe, mostra a linha e tem a porta). Nenhuma porta nova na página das correções.
2. A régua muda de forma e conserva o que protege: uma planta mostra que uma linha de proveniência cujo recibo não tem a porta faz a régua falhar, e as plantas que já existem continuam a morder.
3. O resto da tua passagem fica como está (os dois motivos, o calendário, as 37 linhas distintas).

## §2 Quando paras

Se a porta só puder ficar certa enfraquecendo a V2B ou a V2D (diz porquê).

## §3 O fim

O `build` inteiro verde; `check:discussao`, `check:registo`, `check:voz` e `gate:html` com os códigos e as plantas. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `VOZ-1 E`. Vinte e cinco minutos, trinta chamadas.
