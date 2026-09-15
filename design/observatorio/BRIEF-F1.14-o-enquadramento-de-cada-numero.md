# Brief F1.14 · O enquadramento de cada número: a comparação que a fonte permite (15.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir do que o diretor disse a 15.09.2026 («Preços da habitação 2025, variação anual média em percentagem, 17,6 %, but we don't really know what to relate that with; if we don't frame the numbers, they're just abstract numbers that can't be compared with anything») e da camada 2 da visão (`VISAO.md` §3: cada pergunta com uma medida e a comparação que a fonte permite: contra um valor de referência publicado, contra os pares, contra o próprio passado; a linha do plano que esperava «a série e a posição entre pares como linhas»). Corre depois do F1.15. Sem travessões na prosa.*

## 0 · A regra

Um número sem enquadramento é abstrato. Cada medida rendida no sítio leva ao pé do número **o que a mesma fonte publica para o comparar**, e nada mais: o valor do período anterior da mesma série (a direção e a variação), a média da União ou a posição de Portugal entre os países quando o mesmo quadro os traz, e o valor de referência quando existe. Cada comparação é uma linha do livro-razão ou uma derivação registada sobre linhas (o rank sobre os 27 valores do quadro, com os 27 na derivação); nenhum número que a fonte não publique; onde a fonte não dá comparação, a ausência diz-se como conteúdo («a fonte não publica a média da União para esta medida»).

## 1 · As decisões (tomadas; o construtor aplica)

1. **No motor**, para cada medida do primeiro domínio e dos dois painéis da União (as que o sítio rende hoje): a linha do período anterior da mesma série (o mesmo quadro, o mesmo `geo`, o período anterior), a linha do agregado da União (`EU27_2020`, ou a área do euro quando for esse o agregado do quadro) para o mesmo período quando o quadro o traz, e a derivação da posição de Portugal entre os países do quadro (com as linhas de cada país ou o registo da derivação sobre o ficheiro capturado, sha256 e data); exportadas com a marca da medida a que pertencem. O corredor passa a reconferi-las como às outras.
2. **No sítio**, ao pé de cada número: uma linha de enquadramento em palavras, nas duas edições, composta só de linhas seladas: «2024: 8,7 %; média da União: 4,3 %; 3.º entre 27» (a forma exata decide-se nas capturas), no cartão (uma linha) e na página da medida (a série dos últimos anos, quando a fonte a dá, como forma gráfica 1, com cada ponto selado); a A3 continua a proibir o mesmo valor selado duas vezes na mesma página, e por isso o enquadramento do cartão é uma leitura da mesma linha e não uma segunda cópia.
3. **As formas gráficas** (o desenho da série, a barra da posição) só quando cada ponto for uma linha; sem guião, a mesma informação em texto.

## 2 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| E1 | cada medida rendida com pelo menos uma comparação da mesma fonte, ou a frase da ausência; 0 números de enquadramento sem linha ou derivação | a régua do livro-razão (o portão dos números) e uma célula nova |
| E2 | as linhas novas do motor com proveniência inteira (fonte, excerto, data, sha256) e reconferidas pelo corredor | `core.gate` a 0; a corrida de ensaio seguinte a lê-las |
| E3 | a posição entre os países com a derivação registada e reproduzível a partir do ficheiro capturado | a régua das derivações |
| E4 | o primeiro ecrã a 390 não cresce mais do que uma linha por cartão (medido); a página da medida com a série sem guião em texto | as células A1 e A11; a célula do sem guião |
| E5 | as capturas a 390, 768, 1 280 e 1 600 de `/`, da página de uma medida e de uma área, antes e depois, ao diretor antes de aterrar | as capturas |

## 3 · Onde se constrói

O motor primeiro (as linhas e as derivações; ramo próprio numa worktree, o `core.gate`), depois o sítio (ramo próprio a partir de `main` depois do F1.15). A medição às cegas do Sonnet (as comparações contra os ficheiros das fontes), a leitura a frio do Codex com plantas (uma comparação sem linha; uma média da União trocada; um rank errado), a segunda passagem, as capturas ao diretor, a aterragem com o «sim» dele. Estimativa: Opus, M no motor e M no sítio.
