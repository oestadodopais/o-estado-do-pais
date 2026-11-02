A SEL1 ficou bloqueada na construção de partida, antes de qualquer alteração.

O commit do painel `7b743d896` acrescentou verificações a duas linhas da habitação, mas a prova `ledger/provas/hb1/series.json` conserva os hashes anteriores. Confirmei que ambos correspondem a `46ee13d18` e já não correspondem à cabeça atual.

O build parou em `check:registo`:

```text
Error: HB1: recompor a série alterada sobrecarga-do-custo-da-habitacao-2025
```

É necessário recompor a prova HB1 para os recibos atuais. Não alterei essa proteção nem o livro-razão.

- `build.codigo`: **1**, lido do ficheiro.
- `dist/`: ausente; contagens de partida e chegada indisponíveis.
- Rotas, réguas e plantas alteradas: nenhuma.
- Commits: nenhum; worktree limpa.
- Consumo: **10 chamadas de ferramentas**, com **12 operações internas**; **1 corrida de construção**, perfil `build`, nenhuma corrida completa dos três portões.