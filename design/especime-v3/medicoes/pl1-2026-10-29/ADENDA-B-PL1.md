# Adenda B ao mandato PL1: as correções da leitura a frio (29.10.2026, 21:10 UTC)

*A mesma sessão, a mesma worktree do sítio (ramo `pl1-2026-10-29`, cabeça 4ead33a8d). A leitura a frio do Opus (20:58 a 21:06 UTC) apanhou as cinco plantas e deixou achados reais sobre o que o bloco existe para fazer; o lugar de direção decidiu cada um como abaixo. Uma passagem, commit «PL1-2». Correm as conferências de `tests/leituras/` e o que mais a mudança toca, com os códigos lidos dos ficheiros `.codigo`; `check:leituras` corre no lugar de direção (a sandbox recusa o servidor), como na adenda A. Nenhuma página do leitor muda. O `CLAUDE.md` não se toca nesta passagem: a linha que o `ARRANQUE.md` estreitou (o achado 8) acerta-se no `CLAUDE.md` pelo lugar de direção nos registos.*

## 1 · A aterragem recusa um bloco acima do orçamento (o achado 5)

`conferir_custo` em `aterrar.py` passa a ler, em cada `custo-<data>.json` dos blocos declarados, o campo `pontos_do_bloco` e o campo `orcamento.pontos_codex_por_bloco` (a escada da §1.202: hoje «menos de 10»; o número inteiro lê-se do texto do campo, o primeiro inteiro que lá estiver); recusa quando `pontos_do_bloco` é `null` (um bloco aterra com o custo medido) ou quando é igual ou superior ao orçamento, salvo `ATERRAR_DECISAO="<a decisão escrita do financiador, com a data>"`, que fica no recibo (`decisao_do_financiador`). `ATERRAR_SEM_CUSTO` passa a valer só para uma aterragem só de registos (o primeiro commit do ramo com o prefixo `-r` e nenhum bloco declarado), nunca para um bloco de conteúdo ou de maquinaria. Plantas em `tests/leituras/pl1.py`: um custo com 12 pontos recusado; o mesmo com `ATERRAR_DECISAO` aceite e o recibo com a decisão; um custo com `pontos_do_bloco` nulo recusado; `ATERRAR_SEM_CUSTO` com um bloco de conteúdo declarado recusado. O custo da própria PL1 (`design/especime-v3/medicoes/pl1-2026-10-29/custo-2026-10-29.json`) ganha os pontos medidos das passagens (0,0 na primeira e na retoma A, pelo contador; lê os ficheiros `.pontos.json` do lançador em `_aterragens/lancador-pl1/` e soma) para poder aterrar.

## 2 · O guião antes do mandato não depende da declaração do próprio lançador (o achado 6)

`pre-mandato.py`: o cabeçalho `Acrescenta:` passa a ser obrigatório em todo o mandato (`linhas`, `frases`, `linhas e frases` ou `nada`); sem cabeçalho, recusa; `OEDP_ACRESCENTA` só pode apertar (de `nada` para `linhas`), nunca afrouxar, e um valor vazio não vale como declaração (`os.environ.get` com cadeia vazia é ausência). Com `linhas`, `listas-de-uma-linha.sh` corre com a linha irmã (`OEDP_LINHA_IRMA`, obrigatória) e os seus argumentos pela ordem real do guião (o sítio, a irmã, o título, o ficheiro); com `frases` ou `linhas e frases`, `voz-do-mandato.py` corre (o sítio, o mandato); um código diferente de 0 em qualquer dos dois recusa o lançamento. Plantas: um mandato sem cabeçalho recusado; `OEDP_ACRESCENTA=''` com cabeçalho válido recusado como ausência; um `listas-de-uma-linha.sh` falso que devolve 1 (sem `mock` do `subprocess`: um guião de ensaio numa pasta temporária posto no caminho) recusa o lançamento, e o mesmo para `voz-do-mandato.py`; o caminho verde do lançador passa a usar um mandato com `Acrescenta: nada`. O mandato da PL1 ganha a linha `Acrescenta: nada` no cabeçalho (acrescenta-a ao `brief.md` copiado na pasta das medições, não ao da sessão).

## 3 · A cabeça da fila é a cabeça da fila (o achado 9)

`fila.py`: um bloco lança-se se for a cabeça da fila, ou se todos os blocos à sua frente estiverem «à espera» de uma fonte (o estado começa por «à espera») ou o nomearem como condição; um bloco de conteúdo não passa à frente de outro bloco de conteúdo pronto; a regra da maquinaria (só à sexta-feira ou como condição declarada) mantém-se. `fila.py` sem argumentos imprime a cabeça (o primeiro bloco que se pode lançar) e, com `--toda`, a fila inteira; `ler_fila` lê só a primeira tabela com os quatro cabeçalhos (a tabela ativa), nunca as tabelas dos blocos que saíram. Plantas: o C2 à frente do C1 pronto recusado; o C2 com o C1 «à espera do Parlamento» aceite; a segunda tabela ignorada.

## 4 · A saída dos guiões fica no registo do lançamento (o achado 10)

`construir-codex.sh` e `retomar-codex.sh` escrevem a saída de `fila.py` e de `pre-mandato.py` em `$base.pre-mandato.log`, ao lado de `$base.escrivao.log`, e o lançamento falha com o código do guião que recusou; uma planta a nível do lançador com um `pre-mandato.py` que recusa.

## 5 · As aterragens só de registos e a retoma (o achado 11)

Um ramo cujo primeiro commit tem o prefixo `-r` e nenhum bloco declarado aterra como registos mesmo que carregue ficheiros `custo-*.json` de outros blocos (como o «Lote-r» de 29.10); o prefixo dos registos passa a exigir o nome de um bloco conhecido da fila ou da pasta das medições antes do `-r`, sem `re.I` (o achado 12); um recibo retomado leva `custos_por_bloco`; uma aterragem só de registos pode ser retomada. Plantas para as três.

## 6 · O que fica para a higiene

Os achados 13 (os nomes das pastas das corridas e a mensagem genérica de uma corrida interrompida), 14 (a guarda da fusão contra a base da fusão e com a planta da segunda verificação), 15 (os medidores contra o motor real) e 16 (os números do relatório sem ficheiro: o relatório cita só o que está em ficheiros). O `ARRANQUE.md` diz, na linha 5, que o lançador lê a fila e exige os dois guiões antes do mandato (dentro dos 2 500 bytes; conta-os).

## 7 · O relatório e o que pára

O relatório diz: cada correção com o ficheiro e a planta; os códigos de `tests/leituras/` lidos dos `.codigo`; a nota de que `check:leituras` corre no lugar de direção; os bytes do `ARRANQUE.md`; o commit. Paras e dizes se uma planta não puder correr sem rede ou navegador (nomeia-a), ou se a leitura do custo pedir um campo que os custos existentes não têm.
