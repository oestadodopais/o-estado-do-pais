# A leitura curta da adenda G da HIG-6A, 08.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), sobre o pacote `pacote-hig6a-curta-g-2026-11-08` (base 621dca255, cabeça 769eaea83; `dist/` de 769eaea83). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| G1 | a camada 0 da aterragem corre na árvore principal (a cabeça antiga) | 1 (Blocking) |
| G2 | as partes aceitam uma reserva com um passo fora do `verify` | 3 (Major) |
| G3 | o GitHub tira em silêncio um terceiro passo (`check:repositorio`) | 2 (Blocking) |
| G4 | a prova da aterragem vermelha deixa de provar que não há push para `main` | 5 (Major) |
| G5 | a guarda da cadeia só procura a chave | 4 (Major) |

Cinco plantas em cinco. O leitor conferiu também, por guião, que o `diff.patch` e as cópias diferem exatamente nessas cinco linhas.

**Os achados reais e a decisão.** Nenhum Blocking nem Major real. Aterra-se sem correção; os Minor vão para a higiene:
- **6:** a planta da camada 0 vermelha só exercita o fluxo antigo; no fluxo novo, a Vercel recebe o `dist/` sem domínio antes da camada 0, e a ordem partilhada impede a promoção (inferido do código, sem planta).
- **7:** a guarda da cadeia corre dentro do passo reservado, e o GitHub deixa de a correr; a recusa acontece na aterragem ou na corrida inteira local, antes de `main` mudar (pedido pela adenda; perde-se o sinal cedo, não se abre nada).
- **8:** nenhuma corrida mostra as 40 partes do GitHub verdes sem o motor; a corrida do GitHub na aterragem é essa prova, e a aterragem espera por ela (falha fechada).
- **9:** as «30 chamadas» do relatório curto não têm ficheiro (o longo diz 28).
- **10:** a revisão do motor da aterragem é a cabeça local do motor, não conferida contra o `master` pela aterragem; o lançador deste lugar já recusa um motor fora do `master`.

## O relatório do leitor (condensado)

**Blocking.** 1. No diff, `verify:com-motor` corre com `cwd=self.principal`. 2. No diff, `restantesDoVerify` tira também `check:repositorio`, por substring.

**Major.** 3. No diff, `conferirPartes` só exige passos não vazios. 4. No diff, a guarda procura só `RESEARCHHUB_READ_TOKEN`. 5. No diff, a planta da aterragem proíbe um push forçado que a aterragem nunca faz.

**Minor.** 6 a 10, como acima.

**O que está bem.** O pacote completo para este bloco (nenhum livro-razão nem conteúdo tocado); nas cópias, a aterragem falha fechada (sem `RESEARCHHUB_DIR` recusa no início; a camada 0 depois de `preparar`, `series` e `cruzamento` e antes de `fundir-main`; um código diferente de zero relido do ficheiro pára); a reserva recusada nos três leitores (fora do `verify`, vazia, repetida); as contagens reproduzidas do `package.json` (66, 24, 40, 2); as doze plantas da guarda; o `portao.yml` sem o motor nem `RESEARCHHUB_*`; a corrida local na cabeça 769eaea83 com os dois passos verdes; nenhuma página do leitor muda.
