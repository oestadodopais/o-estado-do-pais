# O mandato da passagem ER1-b (escrito a 06.10.2026 pelo lugar de direção, por lançar depois da reposição do Codex de 12.10.2026)

És o construtor da passagem ER1-b do bloco ER1 do projeto O Estado do País (o recibo incorporável). És o Codex `gpt-6-astra`, com o raciocínio em `high` (a decisão da §1.177: `xhigh` só nas leituras a frio). A leitura a frio do Claude Opus 5.5 está em `design/especime-v3/critica/LEITURA-ER1-2026-10-06.md` (lê-a inteira primeiro); o lugar de direção decidiu o que se faz com cada achado, abaixo. Esta passagem fecha o bloco.

## Onde trabalhas

A worktree do ramo `er1-2026-10-06` (lança-se com `construir-codex.sh` numa worktree desse ramo, com `main` fundido antes de começar, e o `conferir-mapa.py` a 0 longe e 0 por encontrar depois da fusão). Nunca `git checkout` fora dela; nunca `git push`; nunca `git add -A` nem `git add .`, só caminhos explícitos; commits pequenos, cada um com os dois trailers: `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: <o endereço da sessão que te lançou>`.

## As decisões do lugar de direção, achado a achado

- **Os achados 1, 2, 3, 5 e 6** eram os cinco estragos plantados nas cópias do pacote; nada a corrigir por eles.
- **O achado 4 (o código levaria a marca «[a verificar]» nas linhas com um campo por confirmar).** Uma linha com a fonte ou a data de acesso por confirmar não oferece código para incorporar: o bloco «Incorporar este número» mostra, em vez do código, a frase «Este número ainda não se pode incorporar: um campo da sua proveniência está por confirmar na fonte.» / «This number cannot be embedded yet: one field of its provenance is still to be confirmed at the source.»; o portão conta essas linhas e recusa qualquer código com a marca; uma planta com a marca no código morde. O JSON de cada linha não muda.
- **O achado 7 (a frase do Método).** O lugar de direção escreveu a frase e a entrada do registo que a amarra do texto governado exige. Em `src/data/metodo.mjs`, na secção do livro-razão como conjunto de dados, nas duas línguas: «Cada número deste projeto pode ser incorporado noutra página com a sua fonte, a data em que foi lido e a porta para o recibo: o código está no recibo de cada linha, e um guião pequeno deste projeto mantém o número em dia lendo o JSON da linha. O guião lê só os seus próprios parágrafos e pede só esse JSON; como em qualquer pedido de um navegador, a origem da página que incorpora chega ao alojamento deste projeto, que não a guarda. A licença é a do conjunto de dados, Creative Commons de atribuição.» / «Any number on this site can be embedded in another page with its source, the date it was read and the door to its receipt: the code is on each row's receipt, and a small script from this project keeps the number current by reading the row's JSON. The script reads only its own paragraphs and requests only that JSON; as with any browser request, the origin of the embedding page reaches this project's host, which does not keep it. The licence is the dataset's, Creative Commons attribution.» Acrescentas a `DECISIONS.md` a entrada que o lugar de direção deixou em `design/observatorio/mandatos/ENTRADA-ER1-aterragem.md` (com o número seguinte ao último do registo), corres `npm run ledger:check`, e pões no campo `**Texto:** metodo <carimbo>` o carimbo que a conferência pedir.
- **O achado 8 (o código nunca diz que o número é de Portugal).** O lugar entra sempre no código: «Portugal» nas linhas do país, a região ou o concelho nas linhas de lugar, «União Europeia» nas linhas da União (pela mesma lógica que o recibo usa para dizer o lugar), antes do período; o portão recompõe com o lugar.
- **O achado 9** é anterior ao ER1 e fica no bloco dos recibos.
- **O achado 10 (as cadeias no inventário).** Todas as cadeias novas das duas edições entram no inventário das frases, com a leitura do lugar de direção: «Copiado» e «Código selecionado» ficam; «Calculado» passa a «calculado por este projeto»; «data de leitura não indicada» desaparece, porque pela decisão do achado 4 uma linha sem data confirmada não oferece código.
- **O achado 11.** Um separador entre a unidade e a fonte (« · »); a vírgula decimal fica, como na edição inglesa do sítio.
- **O achado 12.** A lista de palavras da conferência da privacidade ganha `postMessage`, `parent`, `top`, `innerText`, `getElementsBy` e `body`, com uma planta por palavra.
- **O achado 13.** A frase da origem está na frase do Método acima; a página «Privacidade» não muda (é do diretor).
- **O achado 14.** A célula do navegador ganha uma linha com notas (`notas`) para exercer o ramo das notas; o ramo do aviso sem data desaparece com o achado 4.
- **O achado 15.** `design/especime-v3/medicoes/er1-2026-10-06/controlo-plantas.json` sai do repositório (`git rm`): as plantas de uma leitura a frio são sempre do lugar de direção, nas cópias do pacote.

## O que fazes

Os pontos acima, um commit por ponto; o relatório com a secção «A passagem ER1-b»; as capturas de um recibo com código e de um recibo sem código (uma linha com campo por confirmar), nas duas edições, a 390 e a 1 280 px; os três portões inteiros pela tranca na cabeça do código, a 0, lidos de ficheiro; o último commit só com o relatório, as capturas e os códigos. O custo-alvo da passagem é de trezentos mil símbolos: se o passares, di-lo no relatório.

## As regras de sempre

Nenhum número à mão no relatório; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; prosa em português sem travessões, as cadeias nas duas línguas; só um portão que protege um número, uma fonte ou uma pessoa te faz parar; as ambiguidades pequenas decides e anotas. As questões novas numeram-se `ER1-5`, `ER1-6`, e assim por diante.
