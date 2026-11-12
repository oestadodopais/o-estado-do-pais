# Adenda A do CR3: a conferência do molde que não se prova a si própria, e três testes que não passam em vazio (12.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `cr3-2026-11-12`; a outra pasta com escrita é a worktree do motor `cr3-2026-11-12`, onde não tens nada a mudar. Uma correção: trinta minutos e sessenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `CR3`. O teu relatório vai para `RELATORIO-CR3-A.txt`, nesta pasta, com dez linhas; as medidas e os registos para esta pasta (`medidas-do-construtor-cr3-a.json`, `cr3-a-conferencias/`), só os códigos e as últimas vinte linhas, sem caminhos da máquina.*

## Porquê

O Opus leu o bloco a frio e apanhou as cinco plantas. O que as páginas imprimem está certo contra a fonte. Fora das plantas, achou que a conferência nova do molde da razão do acesso é circular, e este lugar confirmou-o no código: não apanhava o próprio defeito que este bloco corrigiu. Achou também três testes que deixam de provar seja o que for quando não houver nenhuma revisão por aplicar, e uma asserção alargada a todas as rotas.

## §0 O que se mediu (na cabeça `839b2529a`, lido no código por este lugar)

1. `conferir_razao_acesso` (em `scripts/aplicar-releituras.py`) calcula a frase esperada chamando a mesma função `razoes` que escreveu a frase a conferir; as plantas de `plantas_acesso` só trocam as duas saídas dessa função. Se a escolha entre os dois moldes se invertesse, a conferência passava e as plantas continuavam a morder.
2. A escolha do molde novo depende só de os dois dias serem diferentes; nada recusa uma leitura feita antes do dia da comparação.
3. `tests/quadro/plantas.mjs`, `tests/cartao/revisao.mjs` e `tests/livro/indice.mjs` escolhem agora os avisos pelos dados; com zero revisões por aplicar, as plantas principais deixam de correr sem aviso.
4. Em `tests/quadro/disposicao.mjs`, a asserção de que cada rota fixa tem alvos passou a aceitar zero alvos em todas as rotas, desde que o navegador concorde.

## O que fazes

1. **A conferência do molde, independente da função que o escreve.** O dia da leitura depois do dia da comparação: a frase tem de ser a do molde novo, conferida contra o texto escrito no próprio teste, campo a campo, nas duas línguas. Os dois dias iguais: a do molde antigo, do mesmo modo. O dia da leitura antes do dia da comparação: a aplicação pára com a razão. Plantas: a escolha invertida no guião recusa; uma data trocada dentro da frase recusa; a leitura anterior à comparação recusa.

2. **Os três testes com zero revisões por aplicar.** Cada um passa a correr as suas plantas também sobre um caso fixo guardado com o teste (uma linha com uma revisão por aplicar), de modo que as plantas correm sempre, haja ou não avisos nos dados; e afirma um mínimo de plantas corridas.

3. **A asserção dos alvos** volta a exigir alvos em cada rota fixa, salvo na rota que perdeu o seu aviso com este bloco, nomeada com a razão.

4. **A prova.** Os testes que tocares e as conferências que os correm (`check:quadro`, `check:cartao`, `check:indice`, e a do guião das releituras), cada código lido de um ficheiro. Nenhuma página muda: confere que `ledger/claims` e `src/data` ficam byte a byte.

## O que fica como está, por decisão

As duas linhas aplicadas, as suas frases e os dois moldes. As outras questões menores da leitura vão para o bloco de higiene.

## Quando paras

Se uma conferência só passar mudando uma linha aplicada ou uma frase. Para tudo o resto: decide, anota e continua.

## O fim

O relatório em dez linhas: os quatro pontos, as plantas, os códigos.
