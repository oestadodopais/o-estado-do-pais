# A maqueta da primeira página nova (v1) · o pedido do lugar de direção, 28.09.2026

Fazes uma maqueta estática da primeira página nova de O Estado do País, para o diretor e os amigos dele reagirem antes de qualquer construção. Não é o sítio: é uma página HTML de ensaio, feita nesta pasta, com capturas. **Não mudas nenhum ficheiro de nenhum repositório.**

## O que a página tem de conseguir

Um leitor comum abre a página no telemóvel e, nos primeiros dois ecrãs, percebe três ou quatro coisas sobre o país que não sabia, cada uma com um desenho que se lê sem esforço. Hoje a página é uma parede de cartões iguais e os leitores acharam-na «too much, too difficult to make sense out of». O desenho tem de fazer o contrário: pouco texto, hierarquia clara, um desenho por bloco, a fonte discreta.

## A identidade (fechada, não se reinventa)

Usa as folhas de estilo do sítio como base: as de `~/Instruments/OEstadoDoPais/.claude/worktrees/c1-2026-09-28/design/especime-v3/medicoes/c1-2026-09-28/paginas-depois/_astro/` (e, se precisares dos tipos, os ficheiros de letra em `~/Instruments/OEstadoDoPais/.claude/worktrees/c1-2026-09-28/dist/`; copia o que usares para esta pasta; lê as variáveis de cor, os tipos Spectral e Bitter e os espaçamentos) e a página congelada `index.html` da mesma pasta como referência do cabeçalho, do menu e do rodapé. A cor só onde há valor de referência publicado (a dívida pública tem o de 60 %; os preços das casas o de 9 %); o resto em preto, cinzentos e a cor de texto do sítio. Sem travessões no texto.

## Os cinco blocos, por esta ordem, com as palavras e os números exatos

Os números são estes e só estes (cada um é o valor de uma linha selada do livro-razão; põe o identificador da linha num atributo `data-linha` do elemento que mostra o número). Não escrevas nenhum outro número além destes, dos anos e dos meses.

**1 · Os preços: o que está a encarecer mais**
Frase: «Em agosto, os combustíveis estavam 23,78 % mais caros do que um ano antes, muito acima dos preços no seu conjunto, que subiram 3,30 %.»
Desenho: barras horizontais com a mesma origem e a mesma escala, por esta ordem: combustíveis e lubrificantes 23,78 (`ipc-combustiveis-variacao-homologa`), rendas 5,22 (`ipc-rendas-variacao-homologa`), alimentos 2,14 (`ipc-alimentacao-variacao-homologa`), energia em casa 1,36 (`ipc-energia-em-casa-variacao-homologa`); um separador; os preços no seu conjunto 3,30 (`ipc-variacao-homologa`).
Linha pequena por baixo: «Na medida que compara os países da União: Portugal 3,6 %, a União 3,2 %.» (`ihpc-variacao-homologa`, `ihpc-variacao-homologa-ue`).
Ressalva: «Um grupo que sobe muito não é o que mais pesa no total.»
Fonte: «INE e Eurostat, agosto de 2026».

**2 · A casa: a média engana quem arrenda**
Frase: «No conjunto do país, a casa pesa menos do que na União. Para quem arrenda a preço de mercado, pesa muito mais.»
Desenho: dois painéis lado a lado (no telemóvel, um por cima do outro), com a mesma escala: «Todas as famílias»: Portugal 6,3 (`sobrecarga-do-custo-da-habitacao-2025`), União 7,7 (`sobrecarga-do-custo-da-habitacao-2025-ue`); «Quem arrenda a preço de mercado»: Portugal 27,2 (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025`), União 18,6 (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue`). A legenda: «% de pessoas cuja casa custa mais de 40 % do rendimento, 2025».
Caixa pequena ao lado: «As rendas em 2027. A referência para a atualização das rendas antigas é a média de doze meses dos preços sem a habitação, que ficou em 2,56 % em agosto (`ipc-sem-habitacao-variacao-media-12-meses`). O valor oficial sai no Diário da República até 30 de outubro.»

**3 · O trabalho e o salário**
Frase: «Trabalha-se mais do que na média da União, e o desemprego é o mesmo, mas quem fica sem trabalho fica mais tempo.»
Desenho: três pares de pontos ou barras curtas, Portugal e União: emprego dos 20 aos 64 anos 79,6 e 76,1 (`taxa-de-emprego-2025`, `taxa-de-emprego-2025-ue`); desemprego 6 e 6,0 (`taxa-de-desemprego-2025`, `taxa-de-desemprego-2025-ue`); desemprego de longa duração 2,2 e 1,9 (`desemprego-de-longa-duracao-2025`, `desemprego-de-longa-duracao-2025-ue`), 2025.
Por baixo, separado: «A remuneração média antes de descontos passou de 1 746 para 1 835 euros por mês (o segundo trimestre de 2025 e o de 2026, este provisório). Se compra mais, ainda não se sabe: os preços que temos são de agosto, não do trimestre.» (`remuneracao-bruta-mensal-media-periodo-anterior`, `remuneracao-bruta-mensal-media`).

**4 · As contas do Estado**
Frase: «A dívida pública desceu, mas continua acima da média da União e do valor de referência europeu.»
Desenho: dois painéis que não se ligam: «Portugal, notificação do INE de setembro»: 93,0 em 2024 e 89,2 em 2025 (`divida-publica-2024-notificacao-ine-2026-09`, `divida-publica-2025-notificacao-ine-2026-09`); «A União, edição do Eurostat»: 81,7 em 2025 (`divida-publica-2025-ue`); uma linha de referência nos 60 % com o seu nome («o valor de referência europeu, 60 % do PIB»), a única cor deste bloco. Legenda: «% do PIB».

**5 · Pobreza e desigualdade não são a mesma coisa**
Frase: «Há menos pessoas em risco de pobreza do que na média da União, mas a distância entre os rendimentos de cima e de baixo é maior.»
Desenho: dois painéis com escalas próprias: «Em risco de pobreza ou exclusão, % das pessoas»: Portugal 18,6, União 20,9 (`risco-de-pobreza-ou-exclusao-2025`, `risco-de-pobreza-ou-exclusao-2025-ue`); «Quantas vezes o rendimento dos 20 % de cima é o dos 20 % de baixo»: Portugal 4,86, União 4,62 (`racio-s80-s20-2025`, `racio-s80-s20-2025-ue`), 2025.

## Por baixo dos cinco blocos

As entradas por pergunta da vida, como cinco blocos pequenos com uma linha cada e sem números: «O meu dinheiro» (salários, preços, pensões, apoios), «A minha casa» (rendas, preços, o peso da casa), «A minha saúde» (o acesso aos cuidados), «A minha terra» (o teu concelho), «O Estado» (a dívida, o défice, onde vai o dinheiro). Depois: uma caixa de pesquisa «Procura o teu concelho» (só desenhada), e uma linha «Explorar os temas, os estudos e os dados». O rodapé do sítio como está.

## O que entregas

- `index.html` (e as folhas de estilo que precisares) nesta pasta, que abra sozinho no navegador, sem guiões de fora;
- as capturas: a página inteira a 390 px e a 1 280 px, e o primeiro ecrã a 390 px (390 × 844), em PNG, feitas com o Playwright que existe em `~/Instruments/OEstadoDoPais/.claude/worktrees/c1-2026-09-28/node_modules` (um guião `captar.mjs` nesta pasta);
- `LEIA-ME.md` com as decisões de desenho que tomaste, o que puseste em cada largura e o que não conseguiste;
- a verificação: um guião que confirma que cada número da página é um dos da lista acima, com o `data-linha` certo, e que não há outros números além dos anos e dos meses.

Escreve só nesta pasta. A tua última mensagem diz o que fizeste e onde estão as capturas.
