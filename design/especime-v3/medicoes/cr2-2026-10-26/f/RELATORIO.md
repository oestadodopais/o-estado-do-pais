# CR2-f: lugares declarados e continuação do CR2-d

A construção única `f/build-f.log`, com código em `f/build-f.code`, deu 1. Os quinze lugares foram conferidos no HTML. Acrescentaram-se onze declarações em `src/data/lugar-das-linhas.mjs`: seis agregados da União, pela coordenada selada `EU27_2020`, seguindo a dívida das famílias da União; cinco valores de Portugal de 2024, pela única coordenada `PT`, seguindo as cinco declarações de 2024 do C2. Quatro linhas de 2025 já tinham lugar pela tabela `DOMINIO_DAS_MEDIDAS`. A mesma construção chegou depois a `check:voz` e recusou o inventário das frases: 102 revisões de proveniência no HTML contra 72 ainda declaradas. As duas frases antigas foram marcadas como retiradas, com a razão, e as duas novas classificadas como conteúdo, seguindo a forma do C2. Não se alteraram números, fontes, pessoas ou guardas. Não se repetiu a construção; o seu código 1 fica conservado. A voz e as cinco conferências seguintes que ficaram por executar na cadeia foram corridas isoladamente, com códigos próprios.

## As cinco paragens

1. Painel delimitado contra bases de 28.09: código 1; direção repetiu com bases vivas de 26.10, código 0 (91 reconferências, zero alarmes e avisos). Prova histórica em `painel-raiz.resumo.txt`.
2. CR2-b: série S6, código 1 na construção e no livro, porque as duas dívidas de 2025 diferiam dos pontos da série. A reposição de `3a8932b67` conservou os valores publicados; ambas esperam pela UE1-c.
3. CR2-c: gerador sem releitura e sem história VS6/S8. Ensaio válido 1; invocação anterior com caminho incorreto 2. Não se alterou o motor.
4. CR2-d: selos das atualizações retiradas, códigos 1 na construção e livro. A direção repôs os selos em `c63fa86e7`; CR2-e confirmou o livro com 0.
5. CR2-e: falta de lugar declarado, código 1 na construção. CR2-f acrescenta as onze entradas em falta, sem duplicar as quatro declarações existentes. `check:pais`, incluído na construção, valida a derivação independente das coordenadas e o lugar das mudanças.

## Os lugares e as páginas medidos

`f/lugares.mjs` lê as coordenadas do livro, as réguas e entradas do `src/` e exige valores `[data-claim]` nas páginas temáticas das duas edições. `f/lugares.json` guarda por linha os ficheiros de origem, cartões, páginas, painéis da primeira página e textos encontrados no HTML. A declaração da dívida pública de 2024 também se confirma no painel `estado` da primeira página. As ausências dos outros painéis são registadas, sem atribuir a uma linha uma presença que não tem. Não houve capturas.

| Linha | Lugar | Declaração | Página temática PT |
|---|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/emprego/index.html` |
| `divida-das-empresas-2024` | portugal | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `divida-das-empresas-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/estado-e-economia/index.html` |
| `divida-das-empresas-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `divida-das-familias-2024` | portugal | lugar-das-linhas | `dist/pobreza-e-desigualdade/index.html` |
| `divida-das-familias-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/pobreza-e-desigualdade/index.html` |
| `divida-publica-2024` | portugal | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `fluxo-de-credito-as-empresas-2024` | portugal | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `fluxo-de-credito-as-empresas-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/estado-e-economia/index.html` |
| `fluxo-de-credito-as-familias-2024` | portugal | lugar-das-linhas | `dist/pobreza-e-desigualdade/index.html` |
| `fluxo-de-credito-as-familias-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/pobreza-e-desigualdade/index.html` |
| `fluxo-de-credito-as-familias-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/pobreza-e-desigualdade/index.html` |
| `formacao-bruta-de-capital-fixo-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `licencas-de-construcao-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/habitacao/index.html` |
| `pib-real-per-capita-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/estado-e-economia/index.html` |

## Recibos, frases e comparações

`f/partida.json`: 15 linhas atualizadas, 45 entradas de 26.10 (uma atualização e duas proveniências por linha), duas pendentes; as 17 conservam «diverge» de 26.10. `recibos-cr2.mjs` leu 34 recibos: 34 certos, 30 atualizados e 4 pendentes. A planta do recibo adulterado foi detetada. Os quatro recibos das duas dívidas conservam 89,7 e 81,7 e a divergência, sem atualização de 26.10; mostram o aviso do valor em uso e não mostram data de publicação, porque as linhas pendentes não a declaram. A primeira medição procurava o valor em h1, mas a página põe o nome no título e o valor em .linha-valor; o guião foi corrigido, com uma planta adicional que adultera o valor. As falhas intermédias e os códigos ficam preservados.

`frases-cr2.mjs depois`: 50 frases, 50 iguais à partida, 0 alteradas; todas conferidas no HTML: sim. Inventário de 84 páginas que citam uma das 17 linhas, em `f/frases-depois.json` (inclui recibos e registos, não é uma comparação de páginas antes/depois). `leituras-cr2.mjs`: 18 leituras de 9 cartões, 0 textos alterados e 0 inversões em 50 ramos. A planta do comparador foi detetada. Os guiões de leituras passaram a aceitar uma pasta de saída, preservando os resultados anteriores. O comparador de frases foi corrigido para ler o parágrafo das caixas sem incluir o título e comparar o texto sem notas de estatuto nas duas representações; guarda as notas de estimativa e de provisório separadamente, verificadas pelas conferências de explicações e cartões. As três recusas intermédias do guião ficam nos registos. A entrada cr2 no registo de revisões do inventário fica por ler, para a leitura cruzada antes da fusão. O comando sinais deu 0 e registou uma frase de naoDiz da explicação dinheiro-do-estado-2026 guardada fora da página; não é uma frase nova nem foi alterada nesta passagem.

## Códigos lidos dos ficheiros

| Corrida | Código |
|---|---|
| `build-f` | 1 |
| `check-cartao` | 0 |
| `check-cruzamento` | 0 |
| `check-discussao` | 0 |
| `check-explicacoes` | 0 |
| `check-formato` | 0 |
| `check-lingua` | 0 |
| `check-navegacao` | 0 |
| `check-nomes` | 0 |
| `check-registo` | 0 |
| `check-voz-final` | 0 |
| `check-voz` | 1 |
| `frases-conferidas` | 1 |
| `frases-final` | 1 |
| `frases-html` | 0 |
| `frases` | 1 |
| `ledger-check` | 0 |
| `leituras-comparadas` | 0 |
| `leituras-depois` | 0 |
| `lugares` | 0 |
| `partida` | 0 |
| `recibos-conferidos` | 0 |
| `recibos-final` | 1 |
| `recibos` | 1 |
| `sinais` | 0 |
| `typecheck` | 0 |

Uma construção e sete conferências pedidas, uma vez cada, por `curto.sh`; sete corridas adicionais em seis conferências (voz duas vezes; nomes, língua, formato, navegação e sinais uma vez cada), para completar a cadeia interrompida; onze corridas em seis medições auxiliares (partida e lugares uma vez cada, recibos três vezes, frases quatro vezes, leituras e comparação uma vez cada). Os registos estão em `f/`, com caminhos locais substituídos por marcas. A construção inclui as suas próprias conferências encadeadas, identificadas no registo; não se executou a corrida inteira dos três portões. Não houve navegador, capturas, publicação ou gate do motor. O motor ficou em `d8f0513b0713bedbd73f0c510bed875659a2f04f`, sem alterações. `medidas.json` mantém as continuações anteriores e acrescenta `continuacao_cr2f`.

## O que continua aberto

A UE1-c deve reler as séries por país e conservar os recibos e a história de cada ponto para aplicar as duas revisões de dívida pública de 2025. A leitura a frio, corrida inteira, capturas e aterragem ficam com a direção. `src/data/verificacao.mjs` conserva os 17 alarmes semanais; esta passagem não corre o painel nem reescreve esse sinal.

Custo medido antes do commit: 47 chamadas de ferramentas. tokens used: 3413645 (total acumulado observado no registo, incluindo entrada em cache). O custo desta passagem está em `f/custo.json` e na continuação CR2-f de `custo.json`, com o momento da medição. A configuração declarada no mandato é Sol 6.1 medium; não se inventa identificador interno. Os valores antigos e novos das quinze linhas e as provas das passagens anteriores seguem no histórico do LEIA-ME.md.

