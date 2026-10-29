**Implementado e comitado. A corrida completa registou `verify = 1`; as duas omissões encontradas foram corrigidas e passaram nas conferências dirigidas.** Falta validar a cabeça final na corrida completa da direção.

Commits: motor `d0091808`; sítio `1d2f5e5c` e `5e34c1c9`. Ambas as árvores estão limpas.

Nas duas línguas, a secção 6 inclui a avaliação bancária de setembro, **2 278 €/m² e variação homóloga de 14,2%**. A secção 11 inclui essa divulgação e a redação pedida sobre o Orçamento. A edição declara **29.10.2026**, com os recibos das duas linhas novas.

| Contagem | Antes | Depois |
|---|---:|---:|
| Livro do estudo | 194 | 196 |
| Linhas no cruzamento HB1 | 189 | 191 |
| Famílias HB1 | 192 | 194 |
| Entradas classificadas do inventário | 2417 | 2419 |
| L1 | 3452 | 3456 |
| Provas de rótulos HB1 | 170 | 172 |
| Chaves do inventário de rótulos | 756 | 760 |

O inventário inclui ainda quatro transcrições das alterações do estudo. **Todas as linhas anteriores do motor e os bytes das 4141 linhas anteriores do sítio ficaram intactos.**

Códigos lidos dos ficheiros finais: `build=0`, `verify=1`, `typecheck=0`, `motor=0`. Passaram com código 0 as suites `habitacao_test` e `hb1_test`, e as conferências de livro, cartões, lugar, voz, língua e datas. Após corrigir as omissões, passaram também `check:rotulos` e `tests/livro/indice.mjs --prova`, este sem navegador.

Decisões:

- **HB1-e-1:** nome literal «taxa de variação», conforme a adenda.
- **HB1-e-2:** caixa `[42, 243, 556, 304]`; título ligado ao rodapé com cedilha.
- **HB1-e-3:** compositor de famílias corrigido para ler a declaração JavaScript, preservando as famílias anteriores.
- **HB1-e-4:** acrescentadas as declarações de língua, provas e entradas de rótulos exigidas pelas réguas.

Ficam para a direção a corrida completa da cabeça final, as capturas e a leitura cruzada `hb1-e`.

Desde a adenda: **109 chamadas**, **21 execuções de conferências dirigidas**, **2 builds locais com conferências** e **1 corrida completa dos portões**. A sessão inteira soma 122 chamadas.