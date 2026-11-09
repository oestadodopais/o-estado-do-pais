# Adenda G ao mandato CAM2-A: o catálogo dos modelos só com as linhas que o painel relê, e a base do histórico de volta (09.11.2026)

Acrescenta: nada
Medidas: medidas-direcao-adenda-g-cam2a.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta da adenda F (cinco plantas em cinco). Sétima retoma, a mesma sessão, por decisão escrita. O financiador, 09.11.2026: «never land anything with mistakes».*

## §0 Medido (por este lugar, no livro-razão da cabeça cd60473fd, com os módulos do bloco; `medir-catalogo-g-1.mjs` e `medir-catalogo-g-2.mjs`)

- **O catálogo de hoje.** `catalogoDosModelos` lê todas as linhas do livro-razão: 1 091 nomes de indicador em português e 1 094 em inglês, entre eles linhas de afirmações e nomes de feridos «segundo …, pela imprensa». A leitura curta pôs na página da leitura da semana, em memória, uma linha com a forma do modelo e o nome «Feridos segundo o movimento, pela imprensa»: `modeloDaFrase` deu `revisao-pt`, o detetor tipou-a como `atribuicao`, e a cobertura passou sem recusas. Das alternativas de hoje, 42 nomes são tipados pelo detetor.
- **As linhas que uma linha de revisão pode nomear.** Uma revisão da leitura da semana só nasce de uma releitura com `result: diverge` (`leituraDaSemana`, em `src/lib/leitura-da-semana.mjs`). As linhas no âmbito da leitura com pelo menos uma releitura são 2 632, e nenhuma é uma afirmação (`afirmacao: true` ou a unidade `afirmação`). O catálogo só com elas tem 128 nomes de indicador, 28 unidades e 21 períodos em cada língua, e o detetor não tipa nenhum.
- **A base do histórico.** A adenda F pediu «os pinos novos», e o construtor moveu a base da conferência do histórico de `d21c48f0b` para `d9a6489a9` e prendeu a semente à lista nova. A lista só encolheu (6 chaves a menos, nenhuma nova), e a base antiga com a semente antiga aceitava-a. Com a base nova, a primeira lista depois da base só se confere contra um pino que é ela própria. O erro é desta frase da adenda F.

## §1 O que fazes

1. **O catálogo.** As alternativas de `{indicador}`, `{unidade}` e `{periodo}` vêm só das linhas no âmbito da leitura da semana (`linhaDoAmbito`) que têm pelo menos uma releitura e não são afirmações. Uma alternativa que o detetor tipe (`tiposDaFrase` não vazio) recusa a conferência dos modelos e nomeia a linha; hoje não há nenhuma. Dizes as contagens do catálogo por língua.
   - **Plantas:**
     - a linha da leitura curta, «Feridos segundo o movimento, pela imprensa, 2025: publicado 7,7 %; a fonte escreve agora 7,6, na releitura de 09.11.2026.», não casa com nenhum modelo e pede registo; o mesmo para a linha inglesa com o nome «Pensions and income tax: the 2026 measures (the extraordinary supplement and the rate reduction), according to the CFP»;
     - uma linha relida cujo nome o detetor tipa recusa a conferência dos modelos;
     - a linha de revisão de um indicador relido que hoje não está revisto continua a casar.
2. **A base do histórico volta a `d21c48f0b`, e a semente a `a00ced4b9eac3c54c57567cdb8824249fcec22dff7c9cc08ed918cd267cef1fd`.** A conferência do histórico volta a percorrer as listas da adenda E e da adenda F. O README diz que a base só se move quando uma mudança da lista não é só um encolhimento, com a razão escrita no commit, e nunca por um encolhimento.
3. **A simulação do painel seguinte** corre de novo sobre o `dist/` da cabeça, com outro indicador relido. Dizes o comando e as contagens.
4. **O fecho:**
   - o `build`;
   - `check:frases-afirmacao` com e sem o motor, `check:mortos`, `ledger:check` com e sem o motor, `check:pre-mandato` e `typecheck`, com os códigos.

   Os commits vão pelo `comitar.sh`, com o assunto a começar por `CAM2-A`.

## §2 Quando paras

Como no §2 do mandato, com o teto de 4 000. Pára também se o catálogo restrito deixar de casar com uma linha de revisão que o painel de hoje imprime.

## §3 O fim

O ponto 4. Trinta minutos e quarenta chamadas, sem ajudantes.
