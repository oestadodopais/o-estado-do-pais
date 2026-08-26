# O estado de `main` depois do bloco das páginas dos 308 concelhos (noite de 26.08.2026)

*Escrito pelo lugar de direção (Claude Fable 5). O ramo `concelhos-2026-08-26` saiu de `main` `992a3c9` e está verde com os dados: construção (6 406 páginas, 386 MB, 267 s; 44 chaves da prova), `verify`, `typecheck`, `provar-eyetext`, `check-cadeia`, o inventário (0 blocos por classificar, autorreferência 0 em 1 278 rotas), e todas as réguas de `tests/` a sair com 0. Medido às cegas (Sonnet, M5: 320 comparações fonte, linha e página, zero discordâncias) e lido de olhos frescos (Codex, 4 de 5 plantas; e uma leitura focada do inventário deste bloco). O plano é `PLANO-CONCELHOS-2026-08-26.md`; o registo é a §1.68 do `DECISIONS.md`; o motor tem o estudo `12 Concelhos`.*

## O que muda no ar

* **308 páginas de concelho**, `/municipios/<slug>` nas duas edições, com a mesma estrutura em todas e só os dados a mudar: as oito peças da Emenda 14 (população residente 2025, poder de compra 2023, desemprego registado em dezembro de 2025, empresas não financeiras 2024, dívida total 2024, índice de dívida 2024, execução da receita, prazo médio de pagamentos em dezembro de 2025), «sem linha ainda» onde a fonte central não publica (a execução da receita em todas, o desemprego nos 30 concelhos das ilhas, a dívida e o índice em Penedono, o PMP em 9), a barra da dívida contra o limite, o cartão localizador (que localiza e não navega) e as portas.
* **2 417 linhas novas no livro-razão**, cada uma com o ficheiro da fonte alojado, a célula transcrita, o localizador e a data de leitura; 307 índices de dívida calculados com a fórmula à vista; a linha do limite legal (150) passa ao estudo dos concelhos.
* **O livro-razão do conjunto:** `/livro-razao/concelhos` é o índice dos 308 com a pesquisa, e cada concelho tem a sua página de linhas, `/livro-razao/concelhos/<slug>`; o índice principal continua com as 136 linhas dos estudos e uma linha para o conjunto.
* **`/municipios`:** os 308 com página; sem fichas de cobertura repetidas; a pesquisa em cima.
* **A primeira página:** os 308 pontos do mapa são ligações (regra N4 de 26.08), e o `svg` expõe-as (`role="group"`).
* **Évora:** a peça 4 diz «Empresas não financeiras» e a sua nota diz só o que está provado; as peças 7 e 8 leem a fonte central («sem linha ainda»), e os dois valores das contas do município desceram para a camada das contas com os seus selos; a legenda da barra diz a lei e mais nada; a dívida diz a coluna.
* **Em todas as 616 páginas de concelho:** «É a lei que o define, não este sítio.» saiu; a DGAL deixou de ser chamada «regulador».

## O que fica

1. **I70:** as zonas densas do mapa (44 pontos) esperam o mapa por distritos (decisão 1B); a pesquisa é o caminho.
2. **I71:** a pesquisa sem script.
3. **Os 30 concelhos das ilhas sem desemprego registado** (as fontes regionais DRQPE e IEM por ler) e **a execução da receita sem fonte central**.
4. **A releitura periódica** das fontes (INE em junho e dezembro, DGAL em dezembro e abril, IEFP mensal): ciclo próprio, por desenhar, com a disciplina das canárias do motor.
5. **Do bloco anterior, ainda:** as áreas de governo (decisão 6), a página das regiões com a régua, a pesquisa do livro-razão (D8), as frases dos painéis (decisão 4), o inglês da identidade, o motor (I65, I67, I69), a indexação quando o diretor disser que o sítio está pronto.
