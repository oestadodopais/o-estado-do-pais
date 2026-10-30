# Adenda E ao mandato PL1: os medidores sem as ferramentas do PDF no portão do GitHub (30.10.2026, 09:59 UTC)

Acrescenta: nada

*A mesma sessão, a mesma worktree (ramo `pl1-2026-10-29`, cabeça cf18da863, limpa e já publicada pelo guião da aterragem). Escrita pelo lugar de direção do dia (Claude Opus 5.5), pela decisão do lugar de direção (Fable), recebida às 09:59 UTC. A aterragem da PL1 parou às 09:57 UTC no portão do GitHub (a corrida 41032613914): `npm run check:leituras` saiu com 1 em `tests/leituras/medicoes-pl1.py`, no teste `test_pdf_fitz_e_layout_reais` (a linha 48, `import fitz`: `ModuleNotFoundError: No module named 'fitz'`), porque a máquina do GitHub não tem o PyMuPDF (`fitz`) nem o `pdftotext`; na máquina do lugar de direção, onde os dois existem, a mesma conferência dá 0. Uma passagem, commit «PL1-4». Nenhuma página do leitor muda; nenhum outro ficheiro além dos que esta adenda nomeia.*

## 1 · O teste que precisa de uma ferramenta salta com uma linha visível

Os testes dos medidores em `tests/leituras/medicoes-pl1.py` que precisam do `fitz` ou do `pdftotext` (hoje `test_pdf_fitz_e_layout_reais`; confere por `grep` se há outro) conferem as duas ferramentas antes de correr. Quando uma falta, o teste salta e imprime uma linha visível na saída do `check:leituras` que nomeia a ferramenta em falta e o teste, na forma `SALTA medicoes-pl1 · test_pdf_fitz_e_layout_reais · falta: fitz` (ou `pdftotext`, ou as duas), além da razão do `skipTest`. Nunca um salto calado: um salto sem a linha é um erro. Quando as duas existem, o teste corre inteiro como hoje. O medidor `scripts/leituras/medir-pdf.py` não muda.

## 2 · A planta

Uma planta no mesmo ficheiro de testes (ou num ficheiro novo em `tests/leituras/` que o `check:leituras` descubra): (a) corre o teste num processo filho com as duas ferramentas escondidas (um `PATH` sem `pdftotext` e um módulo `fitz` que recusa a importação, posto à frente pelo `PYTHONPATH` do filho), e confere que o filho sai com 0, que o teste aparece como saltado e que a linha `SALTA … falta: …` está na saída com o nome da ferramenta; (b) quando as duas ferramentas existem na máquina, confere que o teste corre e não salta (quando não existem, esta metade salta com a sua própria linha visível). As duas metades provam que a linha morde e que o teste continua a medir onde pode.

## 3 · As conferências e o relatório

`python3 tests/leituras/medicoes-pl1.py` e o ficheiro da planta, com os códigos em `.codigo` na pasta das medições `design/especime-v3/medicoes/pl1-2026-10-29/` (`pl1-4-*.codigo`); `check:leituras` e o caso sem ferramentas na máquina correm pelo lugar de direção depois do commit. O relatório diz os ficheiros mudados, a linha impressa nos dois casos (copiada da saída), os códigos lidos dos `.codigo` e o commit. Para e diz se a planta precisar de rede ou de mudar outro ficheiro.
