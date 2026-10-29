Commit **`b1a61d397` (`DO1-8`)** concluído. A construção dessa cabeça terminou com **código 0**, confirmado em `dist/version.json`. A worktree está limpa. A medição dos alvos no navegador fica para o lugar de direção.

Ficou apenas o dossiê do Orçamento, sem secção de correções. A data mais recente acompanha as datas impressas nos blocos. Os selos dos resumos ficam limitados ao dossiê, com o recorte da sua área de toque no próprio parágrafo.

As seis correspondências autorizadas entraram em `RETIRADAS_DENTRO_DE_FRASE`, em `scripts/medir-defeitos.mjs`.

| Elemento | Português | Inglês |
|---|---|---|
| Novidades | o que se discute · Dossiê: O Orçamento de 2027 | under discussion · Dossier: The 2027 Budget |
| Data mais recente | A peça mais recente é de 28.10.2026 | The most recent piece is from 28.10.2026 |
| Calendário | Votação final global · 24.11.2026 fonte | Final global vote · 24.11.2026 source |

A origem da data mais recente é **`escrita.declarada`**. Existem quatro entradas das novidades com dossiê por edição.

Os títulos construídos são:

- `Os dossiês · O Estado do País`
- `O Orçamento de 2027 · O Estado do País`
- `The dossiers · O Estado do País`
- `The 2027 Budget · O Estado do País`

Os resumos ficaram **byte a byte iguais** aos de `71d85e4ce`: três blocos por primeira página e sete por página de discussão, nas duas edições. A base foi construída numa cópia temporária por `git archive 71d85e4ce` e `astro build`; `provar-resumos-main.mjs` extraiu os blocos e executou `diff -u`. Os quatro resultados foram **0**, incluindo depois do commit.

| Contagem | Antes | Depois |
|---|---:|---:|
| Ligações do índice, por edição | 444 | **443** |
| Declarações do inventário | 2478 | 2484 |
| Frases ativas distintas | 1289 | 1277 |
| Rótulos B1, por edição | 41 | 38 |
| Plantas de `check:dossies` | 18 | 20 |
| Páginas com repetições na L1 | 3458 | 3458 |
| Destinos repetidos no dossiê, por edição | 4 | 3 |

A contagem do índice deu **443, não 442**: saiu uma ligação por edição. `check:indice-do-sitio` passou. A medição `l1-do1-d.json` inclui seis plantas recusadas.

Códigos finais lidos dos ficheiros `.codigo` em `<temporário>`: **0** para `build`, `check:dossies`, `check:datas`, `check:discussao`, `check:voz`, `check:indice-do-sitio`, `check:lingua`, `check:mortos`, `check:mapa`, `check:lugar`, `gate:html`, testes de início, inventário, medição L1, comparação literal, palavras e typecheck. As primeiras tentativas de voz e typecheck deram 1; foram corrigidas e repetidas com 0.

Nesta retoma G: **29 chamadas de ferramentas, 21 execuções de conferências ou medições e uma construção completa**. Ficam abertos a revisão do inventário `do1-d` e os testes no navegador a 641, 768 e 1023 px. Não corri o navegador nem os portões pelo escrivão.