# Brief · M2 · O estudo de Évora 2027 entra no portão do motor

*Escrito pelo lugar de direção (Claude Fable 5.1) a 21.09.2026, a partir da I122 e da M11 do registo das melhorias. Um bloco pequeno, só no motor (`~/Instruments/ResearchHub`), numa worktree do motor; o construtor é o Claude Opus. Sem travessões na prosa.*

## 0 · O teste de aceitação, dito antes

Feito quer dizer: `python3 -m core.gate` no motor imprime linhas para o estudo 14 tal como imprime para os outros (as derivações do seu livro-razão, a reconciliação de cada uma das suas quatro edições, a paridade dos seus pares de edições, o registo prévio do método se existir), passa, e **morde**: uma planta num número de uma edição do 14 (um algarismo trocado numa cópia) faz o portão falhar, e repostos os bytes volta a passar. Nenhum valor do estudo muda. Nenhum portão se afrouxa para o 14 caber.

## 1 · O que se mediu a 21.09.2026 (só em leitura)

`core/gate_baselines.json` declara 33 entregáveis sobre dez livros-razão; nenhum é de `content/14 Évora 2027/`. O livro-razão do 14 (`ledger.json`, 124 linhas) tem a mesma forma dos outros (os mesmos dez campos por linha). `python3 -m core.derivations "content/14 Évora 2027/ledger.json"` sai a 0 e declara dívida de derivação nas 124 linhas: todas levam prosa no campo `derivation` e nenhuma leva `check`. No estudo 14 o dinheiro são linhas transcritas e nunca somadas (o método fixado no brief do E1), por isso essa prosa deve ser proveniência e não aritmética: confere-o abrindo as linhas, não pelo nome do campo. Das catorze pastas de `content/`, quatro não têm entregável no portão: a 02, a 05, a 11 e a 14.

## 2 · O mandato

| # | o que | a medida |
|---|---|---|
| 1 | Ler `USING.md`, `core/gate.py` e o registo de um estudo já declarado (o 09 serve de modelo) para saber como um entregável, um par de edições e um registo prévio se declaram e como se mede a linha de base (`python3 -m core.gate update` e o que ele escreve) | o caminho escrito no relatório, com as referências |
| 2 | Correr, só em leitura, `core.reconcile`, `core.attributions`, `core.assertions` e `core.prose` sobre cada uma das quatro edições do 14 (`.md` e `.html`, portuguesa e inglesa) contra o seu livro-razão, e `core.editions` sobre os pares | a tabela das contagens medidas por edição: números, casados, órfãos, atribuições erradas, não declarados, asserções |
| 3 | Decidir com o que se mediu, e escrever a decisão: se há órfãos ou atribuições erradas que são defeitos reais do estudo, corrigem-se no estudo pelo seu próprio caminho de construção (`build_doc.py` e os seus pares) e dizem-se no relatório, porque o estudo está publicado e uma correção de valor tem registo; se são diferenças de forma entre o gerador do 14 e o que o portão espera, a linha de base regista-as como dívida declarada, nunca como zero falso | cada contagem diferente de zero com a sua razão |
| 4 | O campo `derivation` das 124 linhas: se é proveniência e não aritmética, a saída certa é a que o motor já usar para linhas transcritas noutros estudos (vê como o 09 e o 12 escrevem uma linha transcrita); se o motor não tiver forma, propõe uma no relatório e não a inventes no livro-razão | a decisão escrita; a dívida de derivação do 14 medida antes e depois |
| 5 | Declarar o 14 em `core/gate_baselines.json` (os quatro entregáveis, os pares de edições) e, se o método do E1 tiver registo prévio em `core/prereg`, ligá-lo; se não tiver, dizê-lo: um registo escrito depois da recolha não certifica nada e não se escreve agora | `python3 -m core.gate` com as linhas do 14, a passar |
| 6 | A planta: numa cópia de uma edição do 14, trocar um algarismo de um valor com linha; o portão tem de falhar nessa edição; repor os bytes; o portão volta a passar | a saída das duas corridas no relatório |
| 7 | Conferir as outras três pastas sem entregável (02, 05, 11): têm estudo publicado no sítio (`~/Instruments/OEstadoDoPais/src/data/studies.mjs` diz a origem de cada estudo)? Para cada uma: regista-se, ou diz-se porque não (um documento alojado sem livro-razão no motor não tem o que reconciliar) | a tabela das três, com a razão |
| 8 | A regra escrita onde um construtor do motor a lê (`USING.md`): um estudo novo entra em `gate_baselines.json` no mesmo bloco em que nasce | a frase, com a data |

## 3 · O que não se faz

Não se toca em nenhum valor de nenhum livro-razão sem uma correção registada. Não se tocam os ficheiros de outras corridas por confirmar (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`). Não se muda o que as conferências do portão exigem dos outros estudos. Nenhum `push`.

## 4 · As regras de sempre

Uma worktree do motor (`git worktree add`), commits pequenos por caminhos explícitos, só o trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; o pre-commit corre `python3 -m core.gate` (cerca de dois minutos e meio) e tem de passar em cada commit. O nome não é o conteúdo: antes de afirmares o que um campo ou um script faz, abre-o. Uma busca vazia não prova ausência. O relatório em `content/14 Évora 2027/Technical Source/RELATORIO-portao-2026-09-21.md`, curto, em português, sem travessões, com a tabela do §2 e as medidas.

## 5 · Feito a 21.09.2026, e as duas correções que o construtor trouxe a este brief

O bloco fechou no mesmo dia (`f7942fb` em `master` do motor; o relatório em `content/14 Évora 2027/Technical Source/RELATORIO-portao-2026-09-21.md`). Duas coisas que este brief e o prompt do construtor davam por certas e não eram: as cópias das fontes oficiais do 14 não estão em árvore nenhuma do motor (só o `manifest.json`; as cópias vivem no Drive do diretor, como as regras mandam), e um registo prévio não vive em `core/prereg` mas ao lado do livro-razão do estudo (`preregistration.json`). O lugar de direção tinha escrito as duas sem as abrir.
