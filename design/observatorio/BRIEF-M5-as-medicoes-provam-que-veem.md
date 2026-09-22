# Brief · M5 · As medições de um brief e de um relatório provam que veem, e o nome do diretor sai do código

*Escrito pelo lugar de direção (Claude Fable 5.1) a 22.09.2026 à tarde, a partir da conversa com o diretor desse dia («how can we have the certainty… deterministic… to detect them if they happen») e das §1.117 a §1.120. Um bloco do sítio, sobre o processo: dois guiões e um portão, mais uma limpeza. O construtor é o Claude Opus; a leitura a frio é do Codex. Sem travessões na prosa.*

*O que está atrás deste bloco, medido à mão pelo lugar de direção a 22.09.2026 e escrito na §1.120, e que este bloco não volta a medir: dois §0 desse dia afirmaram factos errados, e foram os construtores a apanhá-los ao medir antes de construir. A peça 3 do B1 errou a atribuição da Carta. O B1c escreveu que a página das correções tinha zero linhas datadas, quando tinha dezasseis, contadas com um detetor que procurava `<time>` onde a data era um `<span>`, e falou de uma definição do marcador repetida quando havia uma só. O modelo do que se quer já existia para o mapa do repositório, em `scripts/leituras/conferir-mapa.py`, que reconfere as citações do mapa contra os ficheiros. Os construtores já escreviam ficheiros de medição ao lado dos relatórios (`capturas-*.json`, `plantas-*.json`, `medidas.json`, `nomes-no-dist.json`), e os relatórios citavam números que nem sempre estavam neles, como a leitura a frio do B1c apontou. E o nome do diretor, que não se rendia em página nenhuma, estava no código-fonte público: uma constante exportada e não usada em `src/data/politica-ia.mjs`, três menções nos comentários dela, e uma no comentário de `src/styles/site.css`.*

## 0 · O que se mediu (22.09.2026; o primeiro §0 medido por guião)

*Medido por `design/observatorio/medidas/BRIEF-M5.py`, que escreve `design/observatorio/medidas/BRIEF-M5.json`. Cada número deste §0 está em algarismos e traz na sua frase, entre crases, o nome da medição que o mede; o `check:briefs` volta a correr o guião em cada `verify`, compara cada valor, exige o conhecido-positivo de cada medição e refaz a ligação frase a frase. A partir deste bloco, é assim que um §0 se escreve.*

Em `design/observatorio/` há 37 briefs datados até hoje (`briefs_ate_22_09_2026`). Desses, 34 trazem uma secção de medições (`briefs_com_seccao_de_medicoes`). Só 1 traz o guião que a mede e diz o comando de cada número (`briefs_com_guiao_de_medicoes`), e é este.

O portão confere 1 brief (`briefs_conferidos_pelo_portao`), isenta 33 por data (`briefs_isentos_por_data`) e isenta 3 por nomeação (`briefs_isentos_por_nomeacao`).

O nome de quem responde ocorre 0 vezes nos ficheiros de `src/` e de `public/` (`ocorrencias_do_nome_de_quem_responde_em_src_e_public`). As constantes exportadas de `src/data/politica-ia.mjs` que o escrevem são 0 (`exportacoes_de_politica_ia_com_o_nome_de_quem_responde`).

## 1 · O teste de aceitação, dito antes

Feito quer dizer: (1) um brief novo declara as suas medições num bloco `medidas` (um ficheiro `design/observatorio/medidas/<brief>.json` escrito por um guião `design/observatorio/medidas/<brief>.py`, ou `.mjs`, que corre sem argumentos na raiz do repositório), cada medição com o nome, o valor, o comando e um conhecido-positivo (algo que o mesmo detetor tem de encontrar para provar que vê); o §0 do brief cita as medições pelo nome; (2) o portão `check:briefs`, na cadeia `verify`, para cada brief com data igual ou posterior a 22.09.2026 (lida do nome ou do cabeçalho): corre o guião, compara cada valor com o ficheiro, exige o conhecido-positivo encontrado, e exige que cada número escrito no §0 exista no ficheiro; os briefs anteriores ficam isentos por data, e a isenção diz-se no cabeçalho do guião; (3) `scripts/leituras/conferir-relatorio.py <relatório.md> <pasta das medições>`: cada número de um relatório de construtor (os inteiros e decimais fora de código de identificadores e datas) tem de existir num ficheiro JSON da pasta das medições ao lado, e o guião diz quais não existem; `pacote.sh` passa a correr este guião ao montar um pacote de leitura e a incluir a sua saída no pacote, para que o leitor a frio saiba à partida que números são medidos; (4) plantas: um valor do `medidas.json` trocado; um conhecido-positivo que não se encontra; um número no §0 sem medição; um número num relatório sem ficheiro; (5) este próprio brief é o primeiro a cumprir a regra: o seu §0 passa a citar um `medidas/BRIEF-M5.json` escrito pelo guião, e o `check:briefs` passa sobre ele; (6) o nome do diretor sai do código: a constante `RESPONSAVEL_EDITORIAL` e as três menções nos comentários de `politica-ia.mjs` e a do `site.css` (os comentários passam a dizer «o diretor» ou «o responsável editorial»), com uma célula do `check:voz` ou do `gate:html`, a que couber, a recusar o nome em qualquer ficheiro de `src/` e `public/` (planta: o nome numa cadeia); (7) o mapa do repositório ganha as linhas dos dois guiões e do portão; (8) os três portões a 0 na cabeça final.

## 2 · O mandato

| # | o que | a medida |
|---|---|---|
| 1 | O formato do bloco `medidas` e o guião deste brief, com o conhecido-positivo de cada medição | o `check:briefs` a 0 sobre este brief |
| 2 | `check:briefs` na cadeia `verify`, com a isenção por data dita | a saída com a contagem de briefs conferidos e isentos |
| 3 | `conferir-relatorio.py`, corrido sobre os quatro relatórios de 22.09 (`b1-2026-09-22`, `m3b-2026-09-22`, `i129-2026-09-22`, `b1c-2026-09-22`) como medida do que já falha | a lista do que cada relatório cita sem ficheiro, no relatório deste bloco |
| 4 | `pacote.sh` a correr o guião e a incluir a saída | um pacote de ensaio com a saída dentro |
| 5 | As quatro plantas a morder | a saída do `--prova` |
| 6 | O nome fora do código, com a célula | `grep` a zero em `src/` e `public/`, e a planta a fechar |
| 7 | O mapa posto em dia; relatório em `design/especime-v3/medicoes/m5-2026-09-22/LEIA-ME.md` com o seu `medidas.json`; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de um ficheiro acabado de escrever | os ficheiros `.codigo` ao lado |

## 3 · O que não se faz

Nenhum brief antigo se reescreve (a isenção é por data). Nenhum relatório antigo se emenda: mede-se o que falha e diz-se. Nenhuma página do sítio muda. Nenhum `push`.

## 4 · As regras de sempre

Worktree própria, `npm ci` uma vez, commits pequenos por caminhos explícitos com os dois trailers contíguos (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd`), prosa nova em português sem travessões. Se o brief contradisser o código ou os dados, o construtor mede, diz e pára nesse ponto.
