# Brief · medição cega de uma amostra do inventário das fontes (01.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5). Medidor: Claude Sonnet 5, sozinho, com código próprio. Sem travessões na prosa.*

## 0 · O que é

O sítio O Estado do País está a fazer o inventário das fontes das medidas da sua primeira vaga de domínios. Cada linha foi verificada hoje na fonte primária por outro agente. Tu não vês o trabalho dele: vês só as afirmações da linha (o que se diz do publicador, da definição, da série, da última publicação, do calendário, do nível geográfico, da licença, do endereço, do excerto e do valor mais recente) e vais **refutá-las** com código teu, na fonte, hoje. Não é uma releitura simpática: é uma tentativa de encontrar o que está errado. Uma linha só conta como confirmada se cada célula que testaste bater.

## 1 · O que fazes, por linha

1. Abre o endereço de máquina e o de leitura da linha (`curl` ou `python3`, com `User-Agent: OEstadoDoPais/medicao`); regista o estado HTTP e a hora UTC.
2. Para cada célula testável (publicador, definição, primeiro período da série, periodicidade, último período, data de publicação, nível geográfico mais fino, licença, excerto, valor mais recente), compara o que a fonte diz hoje com o que a linha afirma. Escreve `bate`, `não bate` (com os dois valores), ou `não testável daqui` (com a razão).
3. Para as linhas do INE, os pedidos são em série, com 2 segundos de intervalo, nunca em paralelo; a 429 esperas 30 segundos e tentas uma vez.
4. Não corriges nada, não escreves em nenhum repositório (podes ler os dois, `~/Instruments/OEstadoDoPais` e `~/Instruments/ResearchHub`), não acrescentas linhas. Só medes e escreves o relatório na pasta de saída.
5. Há **estragos plantados** na amostra (células deliberadamente erradas). Não sabes quantos nem onde. Uma célula que não bata é um achado, seja planta ou erro real; regista todas.

## 2 · A saída

Um ficheiro `amostra-sonnet.md` na pasta de saída com: uma tabela por linha (célula | o que a linha afirma | o que a fonte diz hoje | veredito), o código que usaste (em anexo, no fim, ou num ficheiro `amostra-sonnet.py` ao lado), a lista das células que não batem, a lista dos pedidos que falharam, o tempo gasto, e a linha «Modelo: Claude Sonnet 5». Prosa em português (Acordo), sem travessões («—»).

## 3 · A amostra

As linhas estão no ficheiro `amostra-linhas.json` na mesma pasta: um array de objetos com as afirmações e os endereços, e nada mais.
