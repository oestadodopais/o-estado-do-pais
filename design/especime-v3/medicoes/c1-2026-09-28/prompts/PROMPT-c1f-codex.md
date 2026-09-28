A decisão do lugar de direção sobre a paragem da C1e (28.09.2026): **a guarda fica, e a história dos cinco acessos do PRR reconstitui-se pela história do Git.** Retomas a mesma sessão e fazes a passagem **C1f**, na mesma worktree e nos mesmos ramos, com as regras de sempre (caminhos explícitos, nenhum `push`, uma construção de cada vez, os trailers, a resposta curta num ficheiro teu e o `-o` fora do ramo).

## A decisão

A guarda nova disse a verdade: as cinco linhas do PRR guardam entradas de proveniência de 15.08 e 18.08 anteriores ao acesso que declaram (20.08), porque o `access_date` mudou duas vezes sem entrada tipada. A prova dessas mudanças existe no próprio repositório. Na história do Git de `ledger/claims/evora-prr-aprovado-2026.yml`, por exemplo, o acesso nasce a `2026-08-04` no commit `180f136d` (15.08), passa a `2026-08-18` no `8371e097` (18.08, «sobre o instantâneo de 2026-08-17») e a `2026-08-20` no `8b7d9157` (20.08, «com o instantâneo de 2026-08-19»).

1. **Para cada uma das cinco linhas**, uma entrada `proveniencia` sobre `access_date` por cada mudança que o Git mostra, com a data do commit que a fez, o `old_value` e o `new_value` que o diff desse commit mostra, e estas razões: «O acesso passou de <antigo> a <novo> com o instantâneo do PRR de <data do instantâneo, lida da mensagem do commit ou do documento da linha>; a entrada reconstitui pela história do Git (<commit>) a mudança que a linha não registava.» e «The access moved from <old> to <new> with the PRR snapshot of <snapshot date>; the entry rebuilds from the Git history (<commit>) the change the row had not recorded.» As datas escrevem-se como no resto das entradas.
2. **Nada se inventa.** Se numa linha o Git não mostrar uma mudança, ou mostrar outra coisa, paras nessa linha, dizes o que o Git mostra, e acabas as outras. Se uma das linhas for cruzada do motor, a entrada entra pelo caminho que o `ledger/README.md` descreve para corrigir uma linha cruzada deste lado (o registo do cruzamento posto em dia no mesmo passo), e o relatório di-lo.
3. **Uma planta** de uma entrada reconstituída que não bate com o Git (a data ou o valor antigo trocados) morde num controlo do bloco que lê o Git.

## Depois

Os três portões inteiros na cabeça final, cada um no seu comando com o código escrito num ficheiro acabado de escrever em `portoes/c1f/`; as capturas dos recibos que mudaram (os das cinco linhas do PRR, nas duas edições e nas cinco larguras); a secção C1f no `LEIA-ME.md`; o `medidas.json` com `conferir-relatorio.py` a zero faltas e o zero dos caminhos e dos nomes com conhecidos-positivos.
