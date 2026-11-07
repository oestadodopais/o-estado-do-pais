O §0 confundia entrada no repositório com publicação. Preservei as datas declaradas: **21.10.2026 no Orçamento** e **29.10.2026 na casa**. Nenhuma régua de datas foi enfraquecida.

Commit **`79b10ff8f`**, com os trailers pedidos. Árvore limpa; `dist/` identifica esse commit.

- **Código 0:** `build`, `check:edicoes`, `check:datas`, `check:voz`, `check:lugar`, `check:cabeca`, `check:mortos`, `typecheck` e `check:frases-compostas`.
- **Plantas ED3:** 34 controlos verdes e 104 adulterações recusadas. Cada uma das cinco plantas isoladas terminou com **código 1**.
- **Comparação com `2cc0806c2`:** código **0**; os 30 cabeçalhos de edição única ficaram iguais, incluindo os oito das atualizadas, nas duas línguas.

Textos copiados do `dist/`:

**Évora 2027, português**

```text
Cabeçalho:
publicado a 01.10.2026 · atualizado a 03.11.2026 · corrigido a 06.11.2026 (atual)

Faixa da primeira edição:
publicado a 01.10.2026 (esta edição) · atualizado a 03.11.2026 · corrigido a 06.11.2026 (atual)

Faixa da edição intermédia:
publicado a 01.10.2026 · atualizado a 03.11.2026 (esta edição) · corrigido a 06.11.2026 (atual)

Faixa da edição atual:
publicado a 01.10.2026 · atualizado a 03.11.2026 · corrigido a 06.11.2026 (atual, esta edição)
```

**Évora 2027, inglês**

```text
Cabeçalho:
published on 01.10.2026 · updated on 03.11.2026 · corrected on 06.11.2026 (current)

Faixa da primeira edição:
published on 01.10.2026 (this edition) · updated on 03.11.2026 · corrected on 06.11.2026 (current)

Faixa da edição intermédia:
published on 01.10.2026 · updated on 03.11.2026 (this edition) · corrected on 06.11.2026 (current)

Faixa da edição atual:
published on 01.10.2026 · updated on 03.11.2026 · corrected on 06.11.2026 (current, this edition)
```

**Orçamento de 2027, português**

```text
Cabeçalho:
publicado a 21.10.2026 · corrigido a 02.11.2026 (atual)

Faixa da primeira edição:
publicado a 21.10.2026 (esta edição) · corrigido a 02.11.2026 (atual)

Faixa da edição atual:
publicado a 21.10.2026 · corrigido a 02.11.2026 (atual, esta edição)
```

**Orçamento de 2027, inglês**

```text
Cabeçalho:
published on 21.10.2026 · corrected on 02.11.2026 (current)

Faixa da primeira edição:
published on 21.10.2026 (this edition) · corrected on 02.11.2026 (current)

Faixa da edição atual:
published on 21.10.2026 · corrected on 02.11.2026 (current, this edition)
```

Consumo: **85 chamadas de ferramentas**, **2 builds** (primeiro recusado, final verde) e **29 execuções dirigidas de testes e comparação**, incluindo repetições e plantas. Nenhuma corrida integral dos três portões.