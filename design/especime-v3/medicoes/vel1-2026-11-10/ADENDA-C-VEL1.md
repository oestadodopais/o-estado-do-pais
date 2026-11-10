# Adenda C ao mandato VEL1: três sítios onde o código ainda impõe a regra antiga (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), por palavra do financiador de 10.11.2026: as regras mudaram (a decisão 1.238) e o código tem de dizer o mesmo. São três pontos pequenos em dois guiões que este bloco já toca. Orçamento de uma construção normal: setenta e cinco minutos e cento e vinte chamadas, um commit por ponto. O teu relatório vai para `RELATORIO-VEL1-C.txt`.*

## O que mudas

1. **A fila: a maquinaria que corta um gargalo medido não espera pela sexta-feira** (`scripts/leituras/fila.py`). Hoje um bloco de maquinaria só passa à frente de um bloco de conteúdo pronto à sexta-feira, ou quando a linha desse conteúdo declara `condição: <bloco>`. Passa a haver uma terceira via: a linha do próprio bloco de maquinaria declara, na coluna da razão, `gargalo medido: <a linha ou o ficheiro da medição>`. Com essa declaração lança-se em qualquer dia; sem ela, a regra da sexta-feira fica como está. A declaração vazia (`gargalo medido:` sem nada a seguir) recusa. Plantas: maquinaria sem a declaração, numa terça-feira, com conteúdo pronto à frente, recusa como hoje; com a declaração, passa; com a declaração vazia, recusa; um bloco de conteúdo com a declaração não ganha nada com ela. A linha do VEL1 em `design/observatorio/FILA.md` ganha a declaração (a medição é `design/especime-v3/medicoes/vel1-2026-11-10/tempos-github-42897032498.json`).

2. **A guarda do custo lê o orçamento como ele é** (`scripts/leituras/aterrar.py`, `conferir_custo`). Hoje lê o primeiro inteiro de `orcamento.pontos_codex_por_bloco`; nos ficheiros de custo desde 07.11.2026 o campo diz «sem teto por bloco desde 07.11.2026 (§1.232)», e a guarda lê «07» como um teto de sete pontos. Passa a aceitar três formas, e só essas:
   - um inteiro positivo (ou uma cadeia que seja só um inteiro): é o teto, como hoje;
   - uma cadeia que comece por «sem teto» e cite uma decisão (`§` seguido do número): não há teto; o recibo regista `sem teto` e a decisão citada, e não pede `ATERRAR_DECISAO`;
   - o campo ausente: o teto por omissão, como hoje.
   Qualquer outra forma recusa com «orçamento ilegível», em vez de adivinhar um número. Os pontos continuam a medir-se e a ir para o recibo em todos os casos. Plantas: «sem teto por bloco desde 07.11.2026 (§1.232)» com vinte pontos aterra sem decisão; «sem teto» sem decisão citada recusa; «cerca de 7» recusa; o inteiro 7 com dez pontos pede a decisão, como hoje.

3. **A aterragem tira a worktree do bloco no fim** (`scripts/leituras/aterrar.py`). Depois de tudo o resto ter passado (a promoção, o `verify:deploy`, o ramo apagado e a worktree destacada), um último passo, num comando próprio, corre `git worktree remove` sobre a worktree do bloco a partir da árvore principal, sem `--force`. Só o faz se a worktree não tiver ficheiros por registar (os ignorados pelo git, como `node_modules` e `dist/`, não contam); se tiver, não a tira, e o recibo diz quais são. `ATERRAR_CONSERVA_WORKTREE=1` salta o passo e o recibo regista-o. Uma falha deste passo não muda o código da aterragem, que já aconteceu: fica no recibo como aviso. Plantas: uma worktree limpa sai e o recibo di-lo; uma com um ficheiro por registar fica e o recibo nomeia-o; com a variável, fica; a aterragem que falhou antes nunca chega a este passo.

## O que fica como está

O que conta como verde, a ordem dos passos até à promoção, e a regra de que um ramo por aterrar nunca se apaga.

## A prova

As plantas dos três pontos e as que já existem da fila e da aterragem (`tests/leituras/` com `fila`, `ferramenta_aterrar.py`, `vel1_*.py`), pelos seus comandos; `check:mortos` e `check:repositorio`. Diz os códigos.

## Quando paras

Não há paragem prevista. Deixa, diz e continua.

## O fim

Os três pontos e o relatório. Setenta e cinco minutos, cento e vinte chamadas.
