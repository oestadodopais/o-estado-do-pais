# Adenda C ao mandato DO1: os dois vermelhos da corrida inteira do lote (29.10.2026, 16:05 UTC)

*A mesma sessão, a mesma worktree do sítio (ramo `do1-2026-10-29`), agora na cabeça do lote com a HB1-e5 fundida. A corrida inteira do lote (`conferir-tudo.sh`, 15:23 a 16:00 UTC, na cabeça 23031c528, 53 passos) deu dois vermelhos, os dois desta passagem; tudo o mais verde. Esta adenda corrige só esses dois, pela via das mudanças pequenas: nenhuma frase do leitor muda, nenhum número, nenhum portão muda de forma; correm só as duas conferências que a mudança toca; sem leitura nova. Commit «DO1-7» no sítio. A leitura a frio do bloco corre em paralelo sobre o pacote da cabeça 23031c528; o que ela apanhar vem numa adenda própria.*

## 1 · `check:mortos` (o passo 32): uma importação morta

`src/views/TemasView.astro`, linha 3: `import { dossiesDaLista } from '../lib/dossies-conteudo.mjs';` declarada e nunca usada no código (a secção «Dossiês» do Temas imprime-se pelo componente `ListaDeDossies`, que faz a sua própria leitura). Tira-se a importação. Se a secção precisar dela (não parece: o componente lê a lista), diz porquê e usa-a; não fica uma declaração sem uso.

## 2 · `check:alvos` (o passo 12), a célula H2: um alvo de toque abaixo de 44 px na faixa de 641 a 1023 px

Na página do dossiê do Orçamento, nas duas edições, a ligação do item «As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro» (`a[data-discussao-porta="parcerias-rodoviarias"]`, impressa pelo `BlocoDaDiscussao` com a propriedade `dossie`) mede 88 × 34,7 px de toque numa caixa de 941,2 × 44 px na faixa de 641 a 1023 px: a régua exige 44 px de altura de toque para uma ligação que é uma caixa (não um selo em prosa corrida). As outras duas ligações de itens passam porque o título ocupa duas linhas nessa faixa; esta cabe numa. A forma: a ligação do título de cada item no bloco, no contexto do dossiê, ganha a altura mínima de toque de 44 px em toda a faixa (a mesma regra que as outras listas de ligações da casa já usam; procura `min-height` ou a regra dos 44 px nas folhas existentes e reutiliza a forma da casa, sem inventar outra), sem mudar a aparência das páginas onde o bloco já passava (`/o-que-se-discute/` e a primeira página). A medida é a régua: `check:alvos` tem de dar 0 caixas a falhar na H2 nas duas edições, com a construção que a régua faz.

## 3 · O que corre e o relatório

`npm run check:mortos` e `npm run check:alvos` (o segundo constrói o `dist/` se precisar; são as duas únicas conferências desta passagem), os códigos lidos dos ficheiros `.codigo` numa pasta temporária. O relatório diz as duas linhas mudadas e os dois códigos. Paras e dizes se a H2 continuar vermelha depois da forma da casa (diz a medida nova), ou se `check:mortos` apanhar outra coisa.
