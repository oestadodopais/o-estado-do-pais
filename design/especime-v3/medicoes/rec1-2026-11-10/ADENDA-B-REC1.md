# Adenda B ao mandato REC1: as correções da leitura a frio e o que ficou aberto (10.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Fable 5.2), depois da leitura a frio do bloco pelo Claude Opus 5.5 (`leitor`), que apanhou as cinco plantas do pacote e deixou os achados reais abaixo, e depois de ler o teu relatório (`RELATORIO-REC1-A.txt`). Um erro é deste lugar e corrige-se aqui (o ponto 1). Lê primeiro o mandato, a adenda A e o teu relatório. É a última passagem de construção do bloco: a corrida inteira, as capturas e a aterragem fá-las o lugar de direção por guião, depois de uma leitura curta deste diff.*

## O que corriges

1. **O `robots.txt` volta a ser o de antes do bloco, nos dois modos.** O mandato pedia `Disallow: /` em ensaio, e estava errado: um motor de busca que não pode ler uma página nunca vê o `noindex` dela, e o endereço pode continuar nos resultados. Em ensaio fica só a meta `noindex, follow` em todas as páginas, com o `robots.txt` a deixar ler. As réguas e os testes que esperavam o `Disallow` passam a esperar isto.

2. **As legendas das contagens em `src/lib/prova.mjs`,** que saem em `/prova.json`. Em ensaio, quatro chaves valem zero debaixo de legendas que deixam de ser verdade. As legendas passam a dizer o que as chaves contam, nos dois modos:
   - `indexaveis`: «páginas de linha sem `noindex`» (em inglês «row pages without `noindex`»);
   - `correcoes`: «entradas de natureza correção mostradas no registo» («entries of kind correction shown in the register»);
   - `atualizacoes`: «entradas de natureza atualização mostradas no registo» («entries of kind update shown in the register»);
   - `revisoes_de_proveniencia`: «entradas de natureza revisão de proveniência mostradas no registo» («entries of kind provenance revision shown in the register»).

3. **Duas frases fixas ganham a forma de ensaio,** como a política:
   - na página que explica o processo, em ensaio: «A partir do lançamento, cada mudança fica no registo das correções, com a data, o que estava e o que ficou.» («From launch onward, each change is recorded in the corrections register, with the date, what was there and what replaced it.»); com uma data, a de hoje;
   - na página do registo, em ensaio: «A partir do lançamento, um erro confirmado entra no registo com crédito a quem o encontrou, se o desejar.» («From launch onward, a confirmed error enters the register with credit to whoever found it, if they wish.»); com uma data, a de hoje.

4. **A segunda frase da política volta,** nas duas línguas, como estava antes do bloco (a que diz que uma atualização não é um erro). O mandato só trocava a primeira.

5. **A frase de ensaio na página que explica o processo** fica num parágrafo seu, antes da lista das duas marcas dos estudos, e não dentro do último item.

6. **A marca de ensaio lê-se por todos.** O texto «Edição de ensaio» fica visível; a frase que a explica vai dentro do mesmo elemento como texto para leitores de ecrã (a classe que a casa já usa para isso) e no `title`, e não num `aria-label` posto num parágrafo ou num `span`. A marca leva o estilo da etiqueta de inteligência artificial que já existe, sem cor nova. O mesmo na faixa dos documentos.

7. **As listas de mudanças fora do registo** (a página inicial, as páginas dos lugares, o índice) seguem a mesma regra do registo: uma entrada que regista uma mudança ao que já estava publicado (uma correção, uma atualização, uma revisão de proveniência, um estudo atualizado ou corrigido) só se mostra do lançamento em diante; uma entrada que regista uma publicação (um estudo, um item ou uma página novos) mostra-se como antes. Os recibos das linhas continuam a mostrar a história de cada valor. As células M1 e M2 do `check:pais` conferem o que se mostra, nos dois modos, e não ficam caladas sobre o que a página ainda imprime.

8. **`LANCAMENTO` só aceita `null` ou uma data ISO de dez carateres.** Outro valor (uma data noutro formato, uma cadeia vazia) falha a construção, com planta.

9. **O estado `condicional-rec1` do inventário das frases depende do modo.** Em ensaio, as frases de ensaio têm de se mostrar e as do registo histórico não; com uma data, o contrário. Hoje as 69 linhas ficam dispensadas de se mostrar nos dois modos.

10. **As frases novas conferem-se contra a lista fechada, e não contra o ficheiro de onde se mostram.** Um teste compara, letra por letra e nas duas línguas, as frases de `src/data/ensaio.mjs`, as duas políticas, os dois títulos e as frases dos pontos 3 e 5 com a lista fechada (`scripts/voz-rec1.json`); a lista fechada ganha as frases desta adenda. Planta: uma frase mudada só no ficheiro de dados recusa.

11. **A célula do índice** volta a ler a página do registo construída quando há data de lançamento; em ensaio confere que ela está vazia.

12. **A cobertura das frases com afirmação fica verde sem dispensa.** As entradas de `ledger/frases/por-registar.json` cujas frases deixaram de se mostrar saem da lista (a lista só encolhe, e encolhe); as frases novas que o detetor marca registam-se como o README de `ledger/frases/` manda para uma frase escrita por um mandato. Se o registo não tiver forma para uma frase que não afirma um número nem cita ninguém, não inventes uma dispensa: diz qual é a frase, o que o detetor viu nela, e pára nesse ponto.

13. **A §1.237 do `DECISIONS.md`** passa a ter, no lugar do que lá puseste, o texto do ficheiro `TEXTO-da-decisao-1.237.md` desta pasta, letra por letra (o pino do ficheiro fica como a régua o pede).

## O relatório

Curto, em `RELATORIO-REC1-B.txt`, ponto a ponto: o que mudou, a planta e o que deu nos dois modos. Cada código de uma conferência citado com a linha do registo, na forma que o pacote das leituras lê (`<!-- portao: … -->`), para que o leitor seguinte os possa conferir. O que o leitor vê diferente, incluindo o que mudou sem ser pedido (por exemplo uma contagem de linhas que desce). Os commits com o assunto a começar por `REC1`.

## Quando paras

Só no ponto 12, se for o caso que ele diz, e numa régua que proteja um número, uma fonte ou uma pessoa e só passe enfraquecida. Para tudo o resto: deixa, diz e continua. O teto da passagem, num commit são.

## O fim

As conferências que a mudança toca, nos dois modos, e o relatório. Sem a corrida inteira nem as capturas. Setenta e cinco minutos, cento e vinte chamadas.
