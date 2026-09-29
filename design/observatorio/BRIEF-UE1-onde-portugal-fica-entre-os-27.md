# Brief UE1 · onde Portugal fica entre os 27: a faixa da União nos cartões

*Escrito pelo lugar de direção (Claude Fable 5.1) a 29.09.2026, a partir do pedido do diretor de 28.09.2026: a média da União, o país melhor e o pior, e onde Portugal fica. Sem travessões.*

## 0 · O que se mediu (29.09.2026, pelo guião `design/observatorio/medidas/BRIEF-UE1.py`, o sítio em `8e66b601`)

Os blocos da primeira página comparam Portugal com a União em 10 linhas da União (`linhas_da_uniao_nos_blocos`), e as 10 vêm da API de disseminação do Eurostat (`linhas_da_uniao_do_eurostat`). Estas têm todas a gémea portuguesa no livro-razão, 10 (`gemeas_portuguesas`), e as 10 gémeas vêm também do Eurostat (`gemeas_do_eurostat`). O livro-razão tem 3 009 linhas (`linhas_do_livro`) e 0 linhas de série (`linhas_de_serie_no_livro`).

## 1 · Os 27 países, lidos na API do Eurostat pelo lugar de direção a 29.09.2026

Cada pedido é o da linha da União com os 27 países no lugar da União, e as mesmas dimensões fixas (na sobrecarga dos inquilinos a preço de mercado, `tenure=RENT_MKT`). O ficheiro `design/observatorio/medidas/BRIEF-UE1-eurostat-2026-09-29.json` guarda os 28 pontos de cada medida, com a marca da fonte de cada um, e o endereço de cada pedido. As dez medidas têm valor para os 27 países no período do valor da União, e o ponto da União e o de Portugal são iguais às linhas que o sítio já publica.

| a linha portuguesa | período | países com valor | União | Portugal | o lugar de Portugal, do mais alto para o mais baixo | o mais baixo | o mais alto | pontos com marca da fonte |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `desemprego-de-longa-duracao-2025` | 2025 | 27 | 1,9 | 2,2 | 8.º | NL, 0,5 | EL, 5,0 | 3 |
| `divida-publica-2025` | 2025 | 27 | 81,7 | 89,7 | 6.º | EE, 24,1 | EL, 146,1 | 0 |
| `ihpc-variacao-homologa` | 2026-08 | 27 | 3,2 | 3,6 | 10.º | SE, 0,3 | RO, 6,3 | 0 |
| `precos-da-habitacao-2025` | 2025 | 27 | 5,5 | 17,6 | 2.º | FI, -2,3 | HU, 18,3 | 3 |
| `racio-s80-s20-2025` | 2025 | 27 | 4,62 | 4,86 | 8.º | BE, 3,25 | BG, 6,94 | 2 |
| `risco-de-pobreza-ou-exclusao-2025` | 2025 | 27 | 20,9 | 18,6 | 16.º | CZ, 11,5 | BG, 29,0 | 2 |
| `sobrecarga-do-custo-da-habitacao-2025` | 2025 | 27 | 7,7 | 6,3 | 13.º | CY, 2,4 | EL, 26,4 | 3 |
| `sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025` | 2025 | 27 | 18,6 | 27,2 | 7.º | FI, 12,3 | RO, 56,0 | 3 |
| `taxa-de-desemprego-mip-2025` | 2025 | 27 | 6,0 | 6,0 | 14.º | CZ, 2,8 | ES, 10,5 | 2 |
| `taxa-de-emprego-2025` | 2025 | 27 | 76,1 | 79,6 | 12.º | IT, 67,6 | MT, 83,6 | 2 |

## 2 · O teste de aceitação, dito antes

Feito quer dizer: no cartão de cada uma das dez medidas, nas duas edições e nas cinco larguras, o leitor vê, por baixo do número de Portugal, uma faixa com os 27 países da União no mesmo período: o país mais baixo e o mais alto, com o nome e o valor, a média da União, e Portugal marcado, com a frase do seu lugar. Cada algarismo da faixa resolve num ponto de uma linha de série do livro-razão, gerada pelo motor e com o seu recibo; o ponto da União e o de Portugal são, como números, as linhas que o cartão já mostra; um ponto com marca da fonte mostra-a; e os portões falham se um algarismo da faixa não resolver, se faltar um país, se uma posição não sair do valor ou se o ponto da União ou o de Portugal divergir da linha do cartão, cada caso com uma planta que morde.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **A linha de série, gerada pelo motor** | Para cada uma das dez linhas da União, o motor gera `ledger/series/<id da gémea portuguesa>-paises.yml` a partir da mesma consulta e das mesmas coordenadas seladas da linha da União (o conjunto, as dimensões fixas e o período), com `eixo: pais` e 28 pontos, os 27 países e a União; cada ponto com o código do Eurostat, o valor como a fonte o publica, o excerto da resposta e a marca da fonte; e os campos de proveniência das linhas do livro (o endereço, o dia do acesso, o documento). A travessia regista estas linhas como regista as linhas cruzadas, e o sítio nunca as escreve à mão | 10 linhas de 28 pontos; a planta de um ponto trocado numa cópia faz falhar a travessia |
| 2 | **O livro-razão lê as séries** | O `ledger:check` confere cada linha de série: a forma; os 28 pontos, sem país repetido nem em falta; o valor de cada ponto dentro do seu excerto; o período igual ao das duas gémeas; e o ponto da União igual à linha `-ue` e o de Portugal igual à gémea portuguesa, comparados como números | uma planta por regra, e cada uma morde |
| 3 | **O recibo da série** | Uma página por linha de série, nas duas edições, com os 28 pontos numa tabela (o país, o valor, a marca da fonte), a fonte e a proveniência, como os recibos das linhas. O nome de cada país vem de uma tabela declarada, com a fonte e o dia do acesso: a tabela de autoridade dos países do Serviço das Publicações da União (`http://publications.europa.eu/resource/authority/country/<código de três letras>`, pedida em RDF), que dá o nome curto em português e em inglês e traz o código do Eurostat (o lugar de direção conferiu a 29.09.2026 que a da Grécia dá «Grécia», «Greece» e o código `EL`); nenhum nome de país se escreve à mão | as vinte páginas; a tabela dos nomes com a fonte |
| 4 | **A faixa nos cartões** | Onde o cartão de cada uma das dez medidas aparece (a página dos temas e as das entradas), por baixo do número de Portugal: uma linha do valor mais baixo ao mais alto dos 27, com o país mais baixo e o mais alto nomeados e com o valor, a média da União e Portugal marcados, e a frase do ponto 5. Cada algarismo leva a origem num ponto da série (`data-ponto`), e um portão refaz a posição de cada marca a partir do valor | os cartões nas duas edições; as plantas de um algarismo sem origem, de um país em falta, de uma posição trocada e de um ponto da União que diverge |
| 5 | **As palavras, do lugar de direção** | Em português: «Entre os 27 países da União, em {período}, o valor mais baixo é o de {país} ({valor}) e o mais alto o de {país} ({valor}); a média da União é {valor}. Portugal ({valor}) está em {n}.º lugar, do mais alto para o mais baixo.» Em inglês: «Among the 27 EU countries in {período}, the lowest value is {país}'s ({valor}) and the highest is {país}'s ({valor}); the EU average is {valor}. Portugal ({valor}) ranks {n} from the highest.» O lugar é 1 mais o número de países com valor maior; quando outro país tem o mesmo valor de Portugal, a frase acrescenta «a par de {país}» / «level with {país}». Os algarismos e os nomes vêm dos pontos; as palavras entram no inventário das frases como palavras declaradas, com os seus ramos | as frases nas duas edições; a planta de um empate |
| 6 | **As capturas e o relatório** | As capturas nas cinco larguras e nas duas edições de dois cartões com a faixa e de dois recibos de série; o relatório em `design/especime-v3/medicoes/ue1-2026-09-29/LEIA-ME.md` com a tabela deste mandato, as plantas, todos os commits, os códigos dos portões lidos de ficheiro e o custo; o `medidas.json` por um guião do bloco | completos |

## 4 · O que não se faz

Nenhuma mudança à primeira página. Nenhuma medida além das dez. Nenhuma série no tempo: é o RP3, que herda esta forma. Nenhum juízo de melhor ou pior na faixa, porque a leitura do cartão já diz o sentido de cada medida. Nenhum nome de país escrito à mão. Nenhuma linha de série escrita do lado do sítio. Nenhum `push`.

## 5 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de ficheiro; a regra de paragem; o relatório escrito também quando se para a meio; uma construção de cada vez na máquina; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos. No motor, o `pre-commit` corre o `python3 -m core.gate`, e os ficheiros de outras corridas que o `CLAUDE.md` nomeia não se tocam.

## 6 · As decisões do lugar de direção que este brief fixa

1. **Uma linha de série com o eixo declarado.** Serve agora o corte entre países (`eixo: pais`) e servirá a série no tempo no RP3 (`eixo: periodo`), com a mesma forma; o brief do RP3 põe-se em dia quando este bloco aterrar.
2. **A faixa fica nos cartões, não na primeira página**, até o diretor e os amigos dele lerem a primeira página nova.
3. **A faixa diz o lugar, não o juízo.** «Do mais alto para o mais baixo» é uma ordem; o que é melhor ou pior continua na leitura de cada cartão.
4. **Os nomes dos países vêm de uma fonte legível por máquina**, a tabela de autoridade dos países do Serviço das Publicações, com o dia do acesso, nas duas línguas; é a mesma casa que publica o Código de Redação Interinstitucional, cuja página dos países só se lê num navegador.
5. **Constrói o Claude Opus 5.5 e lê a frio o Codex**, com cinco plantas; se a semana do Codex não chegar para a leitura, a aterragem espera pela reposição.
