# Brief CI1 · a corrida «portão» em metade do tempo, sem uma conferência a menos

*Escrito pelo lugar de direção (Claude Fable 5.1) a 28.09.2026, depois da pergunta do diretor do mesmo dia («Is there a way to optimise CI», e logo a seguir «without jeopardise a single bit of quality»). O §0 é medido por `design/observatorio/medidas/BRIEF-CI1.py`, que lê só o repositório do sítio; os tempos, que vêm da API do GitHub, estão no §1, lidos pelo lugar de direção. Sem travessões.*

## 0 · O que se mediu (28.09.2026, pelo guião `design/observatorio/medidas/BRIEF-CI1.py`, o sítio em `a677770f`)

O `npm run build` encadeia 21 passos (`passos_do_build`) e o `npm run verify` 33 (`passos_do_verify`). Dos passos do `verify`, 17 são exatamente os mesmos comandos que o `build` já correu (`passos_repetidos`), na mesma árvore e sobre o mesmo `dist/`. A corrida «portão» tem 1 trabalho (`trabalhos_da_corrida`), que faz tudo em série.

## 1 · Os tempos, lidos na API do GitHub pelo lugar de direção

Fora do guião do §0, porque ele não lê a API: na corrida de `main` de 28.09.2026 (a 36412381787), pelos inícios e fins de cada passo e pelas marcas de cada comando no registo da corrida.

| parte | minutos |
|---|---|
| a corrida inteira | 27,7 |
| o passo do `build` | 11,7 |
| dentro dele, a construção do Astro | 8,4 |
| o passo do `verify` | 14,7 |
| dentro dele, as conferências que o `build` já correra | 3,0 |
| os alvos de toque, as palavras e a moldura, em série | 9,7 |

## 2 · O teste de aceitação, dito antes

Feito quer dizer: a corrida «portão» corre cada conferência do `verify` pelo menos uma vez, sobre o mesmo `dist/` que o `build` fez, e uma célula prova-o a partir do `package.json` (uma conferência nova no `verify` entra sozinha); a verificação obrigatória de `main` continua a chamar-se `portao` e a dizer o estado de tudo; o sítio construído na mesma cabeça, antes e depois do bloco, é igual byte a byte, ficheiro a ficheiro, provado por um guião que compara os resumos; a corrida fica perto de metade do tempo, medida em duas corridas; o `npm run verify` que se corre à mão fica igual; nenhuma conferência se enfraquece, nenhuma se retira, e nenhum resultado se guarda em cache de uma corrida para outra.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **Cada conferência uma vez** | Um guião corre as conferências do `verify` que o `build` não correu com o mesmo comando, lendo as duas cadeias do `package.json`, e a corrida «portão» usa-o depois do `build`; uma célula falha se a união das duas não for o `verify` inteiro. O `npm run verify` à mão não muda | a planta de uma conferência nova só no `verify` (corre); a planta de uma conferência tirada do guião (a célula falha) |
| 2 | **As conferências lentas lado a lado** | O construtor mede quais das conferências do `verify` abrem servidores, portas, navegadores ou ficheiros temporários partilhados, e junta-as em grupos que podem correr ao mesmo tempo sem se tocarem: em trabalhos paralelos que partilham o `dist/` do `build` por artefacto, ou em processos paralelos no mesmo trabalho, o que medir mais depressa. Um trabalho final chamado `portao` só passa se todos passarem, e é esse o nome que a proteção de `main` exige | os tempos de duas corridas; a planta de uma conferência vermelha num grupo (o `portao` fica vermelho) |
| 3 | **A construção do Astro mais depressa, com o mesmo resultado** | O construtor mede onde vão os minutos da construção (as páginas e as funções mais caras) e torna-os mais baratos sem mudar o que sai; cada mudança só entra se o `dist/` da mesma cabeça sair igual byte a byte | o guião de comparação dos resumos, antes e depois, a 0 diferenças; os tempos |
| 4 | **O relatório** | `design/especime-v3/medicoes/ci1-2026-09-28/LEIA-ME.md` com a tabela deste mandato, os tempos antes e depois, as plantas, todos os commits, os códigos dos portões lidos de ficheiro e o custo; o `medidas.json` por um guião do bloco | completos |

## 4 · O que não se faz

Nenhuma conferência retirada, enfraquecida ou saltada por caminho de ficheiros; nenhum filtro de ramos na corrida (a proteção de `main` precisa dela em cada commit); nenhuma cache de resultados de conferências nem do `dist/` entre corridas; nenhuma mudança às páginas; nenhum `push`.

## 5 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de ficheiro; a regra de paragem; o relatório escrito também quando se para a meio; uma construção de cada vez na máquina; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos.

## 6 · As decisões do lugar de direção que este brief fixa

1. **A qualidade prova-se por máquina, não por promessa.** Duas provas bastam para dizer que nada piorou: todas as conferências correm pelo menos uma vez sobre o mesmo sítio construído, e o sítio construído é o mesmo byte a byte.
2. **A segunda corrida em `main` do mesmo commit continua**, porque é barata para a casa e é a que a proteção vê; o lugar de direção deixa só de esperar por ela para dar uma aterragem por acabada, e confere-a na sessão seguinte.
