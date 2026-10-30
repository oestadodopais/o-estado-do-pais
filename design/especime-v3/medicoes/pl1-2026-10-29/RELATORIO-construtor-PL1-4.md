Commit **`bb6007108`**, «PL1-4», concluído pelo escrivão. Worktree limpa.

Mudaram apenas:

- `tests/leituras/medicoes-pl1.py`: verificação das ferramentas, salto visível e duas plantas em processos filhos.
- `design/especime-v3/medicoes/pl1-2026-10-29/pl1-4-medicoes.codigo`: código **0**, lido do ficheiro.

`python3 tests/leituras/medicoes-pl1.py`: **6 testes, resultado OK**. Saída observada nos dois casos:

```text
SALTA medicoes-pl1 · test_pdf_fitz_e_layout_reais · falta: fitz, pdftotext
CONFERE medicoes-pl1 · test_pdf_fitz_e_layout_reais · correu sem salto
```

Nenhuma planta precisou de rede ou navegador. `check:leituras` e a confirmação numa máquina sem ferramentas ficam pelo lugar de direção, após este commit.

**Contagem:** 6 chamadas de ferramentas, 1 conferência dirigida, 0 corridas inteiras.