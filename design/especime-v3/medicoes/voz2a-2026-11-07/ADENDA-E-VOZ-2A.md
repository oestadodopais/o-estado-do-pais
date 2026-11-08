# Adenda E aos mandatos VOZ-2A e VOZ-2B: a impressão digital do livro importado (07.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da paragem da VOZ-2A às 01:16 UTC de 07.11.2026. A paragem estava certa: a adenda D nomeou os campos que podiam mudar e esqueceu o que regista os bytes do livro importado, que muda por força com a asserção que ela autorizou. Retomas a mesma sessão, mas o sítio muda de worktree: `main` avançou (a ED2 com as adendas A e B, a ND1 e a ED3 aterraram a 07.11.2026), e a VOZ-2A acaba sobre ele, na worktree nova `voz2s-2026-11-07`, que este lugar abriu a partir de `main` com as três listas reescritas (as adendas A a C) já comitadas. A worktree `lote8-2026-11-07` fica só para ler: a tua patch da adenda D (`design/especime-v3/medicoes/voz2a-2026-11-07/fontes-pendentes-adenda-d.patch`) e as tuas provas estão lá. O motor continua na worktree `voz2-2026-11-07`, avançada para o `master` de hoje (155a9f2, que só mudou a vigilância). O teto de cinco pontos por bloco caiu pela palavra do financiador a 07.11.2026, às 08:05 UTC («that was for when we didn't have much usage, not the case, now»); o custo continua a medir-se.*

## §0 Medido (07.11.2026, pelo teu `medidas-adenda-d-voz2.json` e pelo teu relatório, lidos por este lugar)

- Na composição do estudo 19, `composto_de` muda só no `ledger_sha256` da fonte 14, porque `core.compor.Fonte.carregar_livro` o calcula sobre o livro inteiro, e o livro do estudo 14 muda nas duas citações de `base-sem-contratos` que a adenda D autorizou. Os livros propostos dos estudos 16 e 18 são iguais aos publicados; as linhas do 19 e do 14 ficam todas iguais, com os valores.

## §1 O que fazes

1. **Autorizado:** o `ledger_sha256` de uma fonte em `composto_de` muda para o resumo dos bytes do livro dessa fonte quando a mudança desse livro é uma das que as adendas autorizam; o relatório diz o resumo antigo e o novo. Nada mais muda no livro-razão.
2. **A natureza das edições novas (muda o §1.3 do mandato da VOZ-2A e o da VOZ-2B).** Tirar as frases em que um estudo fala de si próprio não corrige nenhum facto: as edições de 07.11.2026 levam `natureza: atualizacao` no manifesto, e a entrada de cada estudo no registo é da natureza «Estudo atualizado» / «Study updated» (a que a edição de 03.11.2026 de Évora 2027 já usa), com o mesmo texto, pt «Saíram as frases em que o estudo falava de si próprio; nenhum número nem nenhuma conclusão mudou.», en «The sentences in which the study talked about itself came out; no number and no conclusion changed.». A contagem das correções publicadas não sobe e não há entrada de recontagem. No cabeçalho, estas edições dizem «atualizado a 07.11.2026», pela regra da ED3.
3. **Acabas a VOZ-2A numa passagem só:** as composições dos estudos 16, 18 e 19, os registos que faltam, as edições de 07.11.2026, as sete entradas da natureza do ponto 2, a régua e as exceções, o commit do motor pelo `comitar.sh`, a travessia, o `build`, as conferências, as plantas e o relatório, como o §4 do mandato e as adendas A a D dizem, na worktree nova do sítio. Nenhum patch de trabalho em curso entra no repositório do sítio (são diffs do motor, que é privado): na worktree nova ficam só as provas e os relatórios, e as medições que as conferências pedem.

## §2 Quando paras

Como na adenda A, e se uma mudança do livro-razão não for das autorizadas.

## §3 O fim

Como na adenda A.
