# Adenda C ao mandato AT1: o projeto certo e o limite dos ficheiros (04.11.2026)

Acrescenta: nada

*A mesma sessão e a mesma worktree. O ensaio real da tua adenda B passou na cabeça 0d6436c8b: 47 regras, 1 função, regiões `dub1`, 25 098 ficheiros iguais ao `dist/` por sha256. Depois, este lugar mediu duas coisas que o ensaio não via.*

## §0 Medido por este lugar

1. **O projeto errado.**
   - O `vercel pull --yes` do guião correu numa worktree sem ligação à Vercel. Com `--yes`, a Vercel criou um projeto novo com o nome da pasta, `lote5-2026-11-04`, a 04.11.2026 às 01:30:43 UTC (lido por `vercel project inspect`).
   - O `.vercel/project.json` da worktree aponta esse projeto. O da árvore principal aponta `o-estado-do-pais`.
   - O ensaio construiu, por isso, com as definições e o ambiente de um projeto vazio, e não com os do sítio.
   - O projeto a mais vai ser apagado pelo financiador.
2. **O limite dos ficheiros.** O envio `vercel deploy --prebuilt --prod --skip-domain` recusou antes de enviar: "`files` should NOT have more than 15000 items, received 25106. Try using `--archive=tgz`".

## §1 O que fazes

1. **A ligação ao projeto do sítio.** Antes de qualquer chamada à rede, o `vercel-prebuilt.py`:
   - escreve na worktree o `.vercel/project.json` da árvore principal, encontrada pelo `git rev-parse --git-common-dir`;
   - apaga o `.vercel/.env.production.local` que lá estiver.
2. **As recusas, antes da rede.** O guião falha sem rede:
   - se a árvore principal não tiver ligação;
   - se, depois do `vercel pull`, o `projectId` ou o `projectName` da worktree diferirem dos da árvore principal.

   Nenhum comando da Vercel corre com `--yes` numa pasta sem ligação. Nenhum identificador de projeto entra no repositório: lêem-se ao correr.
3. **O envio comprimido.** O envio da aterragem (`aterrar.py`) leva `--archive=tgz`, e o guião de ensaio também.
4. **As plantas:**
   - uma worktree sem ligação recusa, sem rede;
   - uma worktree ligada a outro projeto recusa;
   - um comando de envio sem `--archive=tgz` faz falhar o teste dos argumentos.
5. Corres o ensaio local (sem rede) e a suite dos guiões que a sandbox deixa; o ensaio real volta a ser deste lugar.

## §2 O fim

Um commit com o assunto a começar por `AT1` e os trailers da casa (`Co-Authored-By` e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`). O commit `AT1 §1.1b` (o do `"main": false`) fica o último do ramo, como na adenda B: refaz-se por cima, e o anterior desfaz-se num commit próprio. Vinte minutos, vinte e cinco chamadas.
