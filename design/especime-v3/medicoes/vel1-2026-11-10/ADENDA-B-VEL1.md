# Adenda B ao mandato VEL1: uma interrupção pára a aterragem (10.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Fable 5.2), depois da leitura curta da adenda A pelo Claude Opus 5.5 (`leitor`), que apanhou as cinco plantas do pacote e deixou um achado Major real e dois menores. Orçamento de uma correção: trinta minutos e sessenta chamadas, um commit por ponto. O teu relatório vai para `RELATORIO-VEL1-B.txt`.*

## O que corriges

1. **Uma interrupção durante a espera pelo GitHub pára a aterragem.** Em `scripts/leituras/aterrar.py`, o `except Parar: pass` à volta do vigia e o `except (Parar, ValueError): continue` do ciclo das consultas engolem também a interrupção do operador (o sinal que dá `Parar(130)`): um Ctrl-C durante o `gh run watch` ou durante uma consulta era ignorado até ao teto, e se a corrida ficasse verde a aterragem seguia para a fusão e para o `push` de `main`. A interrupção (o código 130, e qualquer `Parar` que venha de um sinal) volta a subir sempre, nos dois sítios; só a falha do comando (saída diferente de zero, teto da consulta, resposta que não é JSON) conta como «pergunta outra vez». Plantas: uma interrupção durante o vigia pára com 130 e não funde; uma interrupção durante uma consulta pára com 130 e não funde; a falha de rede continua a esperar, como hoje.

2. **As plantas do cancelamento e da outra cabeça afirmam o código e a ausência de esperas,** como a do vermelho já faz: a corrida cancelada pára com 1 na primeira resposta concluída, sem esperar; a outra cabeça pára com 9, sem esperar.

3. **Uma planta prova que cada consulta fica limitada pelo tempo que resta:** com poucos segundos até ao teto, o teto passado à consulta é esse resto, e não 120.

## A prova

`tests/leituras/vel1_vigia.py` e as outras plantas da aterragem (`ferramenta_aterrar.py`, `vel1_retoma.py`, `vel1_sobreposicao.py`), pelos seus comandos; `typecheck` não é preciso. Diz os códigos.

## Quando paras

Não há paragem prevista. Deixa, diz e continua.

## O fim

Os três pontos e o relatório. Trinta minutos, sessenta chamadas.
