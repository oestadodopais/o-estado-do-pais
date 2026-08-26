# O estado de `main` depois do bloco do mapa como navegação (26.08.2026)

*Escrito pelo lugar de direção (Claude Fable 5). O ramo `mapa-navegacao-2026-08-26` saiu de `main` `b1e9004` e está verde: construção, `verify`, `typecheck`, `provar-eyetext`, `check-cadeia`, a régua nova (11 de 11), a matriz (86 de 86), `correcoes-a` (32 de 32), o inventário (`home` a autorreferência 0). Medido às cegas (Sonnet, M4) e lido de olhos frescos (Codex, 4 de 4 plantas). A Emenda 19 é a regra; a §1.67 do `DECISIONS.md` é o registo.*

## O que muda no ar

* **A primeira página:** o mapa nunca cresce, nunca amplia e nunca toma a roda do rato à página; «Concelho» abre a pesquisa por baixo do comando nas duas larguras, com o foco no campo, e não muda o mapa, a cabeça nem o painel; o ponto de Évora é ligação para a sua página (e o centro do ponto passou a ser alvo; era só o contorno); os outros 307 pontos não fazem nada; os estados `?ambito=municipio:<slug>` deixam de existir e os endereços antigos levam à página do concelho, quando existe, ou ao índice dos 308; o bloco «Ainda sem linhas para …», as oito peças vazias, a cópia do bloco de Évora, «fechar» e «trocar de concelho» saem da primeira página; a pesquisa da primeira página passa a ter a forma de `/municipios` (ligação onde há página, «sem página ainda» onde não há).
* **`/municipios/evora`:** o cartão localizador perde a lente e as 308 áreas de toque; a sua porta vai para `/municipios`.
* **Nada mais:** `/municipios`, as regiões, a densidade, a interface inglesa, os estudos e o livro-razão iguais byte a byte (M4, item 8: seis ficheiros mudados além de `version.json`, todos da primeira página e de Évora).

## O que fica

1. **I70:** as zonas densas (44 dos 308 pontos com vizinho a menos de um diâmetro) esperam o mapa por distritos (decisão 1B); até lá o caminho é a pesquisa.
2. **I71:** o campo de pesquisa sem script.
3. **As páginas dos 308:** `PLANO-CONCELHOS-2026-08-26.md`, com as decisões D1 a D7 do diretor por tomar.
4. **Do bloco anterior, ainda:** os textos dentro dos desenhos, as leituras do cabeçalho a 390, as frases dos painéis (decisão 4), o inglês da identidade, as áreas de governo (decisão 6), a página das regiões com a régua completa, a pesquisa do livro-razão (D8), o motor (I65, I67, I69), a indexação quando o diretor disser que o sítio está pronto.
