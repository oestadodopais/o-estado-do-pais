# A maqueta da primeira página nova (v1) · LEIA-ME

Feita a 28.09.2026 pelo Claude Opus 5.5, pelo `PEDIDO.md` desta pasta. Não mexe em nenhum repositório: leu a worktree `c1-2026-09-28` (as folhas e a página congeladas, os tipos de `dist/`, as linhas do livro-razão) e escreveu só aqui.

## Como se abre e como se confere

- `index.html` abre sozinha no navegador, a partir do disco. Não tem guiões; as folhas e os tipos estão nesta pasta.
- `node captar.mjs` refaz as três capturas em `capturas/`. Com `--rever` junta 768, 1 024 e 1 600 px e o tema escuro, em `_rascunho/`, só para rever.
- `node verificar.mjs` confere a página (a saída da última corrida está em `verificacao.txt`). Os dois guiões usam o Playwright da worktree `c1-2026-09-28`.

## Os ficheiros

- `index.html`: a página.
- `estilos/base.css`: a cópia da folha do sítio congelada (`paginas-depois/_astro/Base.Bu8ardly.css`), com uma só alteração, os endereços dos tipos passam a relativos.
- `estilos/primeira-pagina.css`: só as regras novas, e todas leem as fichas da folha do sítio (papel, tinta, os três cinzentos, o âmbar, os três tipos, a margem).
- `tipos/`: os seis tipos que a página de facto carrega (Spectral 400, 500 e 600; Spectral SC 400 e 600; Bitter variável), com as licenças OFL ao lado.
- `captar.mjs`, `verificar.mjs`, `verificacao.txt`.
- `capturas/primeira-pagina-390-inteira.png`, `capturas/primeira-pagina-1280-inteira.png`, `capturas/primeira-pagina-390-primeiro-ecra.png` (390 × 844).

## As decisões de desenho

**Uma só forma para os cinco blocos.** O título na versalete do sítio (Spectral SC, a tinta); a frase, que é o maior texto do bloco (Spectral de 20 px no telemóvel a 25 px no ecrã largo); um desenho; e só depois a letra pequena (a linha da União, a ressalva, a caixa) e o selo. Quem lê só os títulos e as frases fica com as cinco conclusões; quem olha para os desenhos vê-as. Entre blocos há um fio cinzento e ar; acima do primeiro, o fio de tinta que separa o cabeçalho.

**A identidade é a do sítio, sem nada novo.** O cabeçalho (os cinco do menu, a marca, a linha da inteligência artificial) e o rodapé são os da `index.html` congelada, com as ligações a apontar para o sítio no ar. Cada número do livro-razão vai a Bitter semibold com algarismos versais tabulares, como o `<Claim>`; os anos e as datas ficam na letra da frase (IDENTIDADE §1). Os rótulos dos desenhos vão a Bitter; os títulos dos painéis e as legendas a Spectral.

**Portugal a tinta, a União a cinzento, em todos os desenhos**, e o nome escrito ao lado de cada barra: a comparação nunca depende de uma legenda de cores. Os valores da União também vão a cinzento, para a leitura de Portugal vir primeiro.

**A cor só num sítio.** A linha dos 60 % do bloco 4 é âmbar com contorno de tinta, o marcador do sítio (âmbar sobre papel dá 2,09:1, e é a tinta que desenha a fronteira, IDENTIDADE §2); o rótulo dela fica a tinta. A linha só atravessa o painel de Portugal: a nota da linha `divida-publica-2025-ue` escreve que o limiar se aplica a cada Estado-Membro e não ao agregado, e a regra da cor diz o estado de um valor contra o seu limiar, que a União não tem. O 60 tem `data-referencia="divida-publica-2025"` e confere-se contra `src/data/enquadramento/referencias.json` («general government sector debt in % of GDP with a threshold of 60%»).

**Sem eixos com números.** O pedido não deixa escrever outros números, e por isso cada barra leva o seu valor na ponta e a origem comum desenha-se com um fio de tinta. Cada barra mede o seu número na escala do seu desenho; o guião mede-o na página desenhada.

**Três pormenores de letra.** Algarismos versais nos títulos e legendas dos desenhos, porque em Spectral de texto os algarismos antigos a negro faziam «20 %» ler-se «2o %» (a prosa continua com os do sítio). Os milhares com espaço inseparável, como o sítio já os escreve («20 600»): nem Bitter nem Spectral têm o espaço estreito das linhas do livro-razão (U+202F), e o navegador trocava-o por um quase invisível («1746»). Onde a legenda ou o título do painel diz a unidade (blocos 2, 4 e 5) o valor vai sozinho; nos blocos 1 e 3 leva «%».

**O selo.** Cada bloco acaba no selo do sítio, o quadrado e a palavra «fonte» (IDENTIDADE §5), discreto, a cinzento; no bloco 1 com a atribuição que o pedido dá, «INE e Eurostat, agosto de 2026».

### Bloco a bloco

1. **Os preços.** Barras horizontais com a mesma origem e a mesma escala (o máximo é o dos combustíveis). A tinta só nos dois de que a frase fala, os combustíveis e os preços no seu conjunto; os outros três a cinzento, como contexto. O separador antes do conjunto, e o rótulo do conjunto a negro.
2. **A casa.** Os dois painéis com a mesma escala (o máximo dos dois é 27,2): as barras de «Todas as famílias» saem curtas e as de «Quem arrenda» longas, e é isso que a frase diz. A legenda por cima. A caixa das rendas de 2027 vem depois dos painéis no telemóvel e, a partir de 1 024 px, na coluna da frase, ao lado dos painéis. Lado a lado, os títulos dos dois painéis partilham a altura e as barras ficam na mesma linha.
3. **O trabalho e o salário.** Três pares de barras curtas. O emprego tem a sua escala; o desemprego e o de longa duração partilham outra, porque as duas linhas estão na mesma unidade (% da população ativa): as barras de longa duração saem a cerca de um terço das do desemprego, e a diferença de 2,2 para 1,9 vê-se. Os dois painéis do desemprego estão mais perto um do outro do que do emprego. O «6» e o «6,0» ficam como o livro-razão e o pedido os escrevem. A remuneração vai por baixo, depois de um fio.
4. **As contas do Estado.** Colunas, porque uma dívida contra um valor de referência lê-se na altura. Dois painéis com um fio entre eles e nenhuma linha a ligá-los, com a mesma escala, para as alturas se compararem e a linha estar nos 60 dessa escala. O ano de cada coluna vem antes do valor no documento, para um leitor de ecrã o dizer primeiro («2024, 93,0»), e desenha-se por baixo da base.
5. **Pobreza e desigualdade.** Dois painéis com escalas próprias. No segundo, cada barra está cortada em unidades (cada unidade é o rendimento dos 20 % de baixo), para se contarem quase cinco: o «quantas vezes» vê-se.

**Por baixo dos blocos.** As cinco entradas (uma lista com setas no telemóvel, cinco colunas no ecrã largo), a caixa «Procura o teu concelho» só desenhada (um campo que não faz nada, com a lupa desenhada), a linha «Explorar os temas, os estudos e os dados →» e o rodapé do sítio como está. As entradas, a caixa e a linha não têm destino (ligações sem `href`), porque as páginas ainda não existem.

## O que está em cada largura

**390 px (e até 639).** Uma coluna. No bloco 1 o rótulo de cada grupo fica por cima da sua barra; os painéis dos blocos 2, 3 e 5 empilham-se; os dois painéis do bloco 4 ficam lado a lado, estreitos. Medido a 390 × 844:
- o primeiro ecrã (até 844 px) leva o cabeçalho e o bloco 1 inteiro (a frase de 231 a 340 px, o desenho de 358 a 606), e já mostra o título e a primeira linha do bloco 2;
- o segundo ecrã (de 844 a 1 688) leva o bloco 2 inteiro (desenho de 940 a 1 161, e a caixa) e, do bloco 3, o título, a frase (de 1 437 a 1 517) e o par do emprego (de 1 562 a 1 637); o painel do desemprego começa em 1 659 e fica cortado;
- a página inteira tem 3 963 px, perto de cinco ecrãs.

**De 640 a 1 023 px.** Uma coluna ainda; no bloco 1 os rótulos passam para a esquerda, com o fio da origem; os painéis dos blocos 2 e 5 ficam lado a lado; o desenho das colunas não passa de 36rem.

**1 024 px e mais (a captura de 1 280).** Cada bloco em duas colunas: o título por cima de tudo; à esquerda a frase, a letra pequena, a caixa e o selo; à direita o desenho. Os três pares do bloco 3 continuam empilhados, porque lado a lado a barra mais longa ficaria com 27 px (medido na coluna do desenho a 1 280). As entradas em cinco colunas. A página tem 2 870 px.

## A verificação

`node verificar.mjs` abre a página no Chromium e confere, a 390 e a 1 280 px, nos temas claro e escuro:
- que as 27 linhas da lista são as do pedido (cada identificador e cada valor estão no `PEDIDO.md`, e o pedido não nomeia outra), que cada valor bate com a linha selada em `ledger/claims/<id>.yml`, e que cada palavra fixa conferida na página está escrita no pedido;
- que cada número da página está num elemento com o `data-linha` certo, que esse elemento mostra só o número, e que as 27 linhas aparecem todas (29 números, porque 23,78 e 3,30 estão na frase e no desenho);
- que não há mais nenhum número além dos anos (2024, 2025, 2026 e 2027), do 60 do valor de referência e dos que fazem parte das palavras fixas do pedido («mais de 40 % do rendimento», «dos 20 aos 64 anos», «dos 20 % de cima», «dos 20 % de baixo», «até 30 de outubro»), cada um uma só vez e no seu sítio; nem nos atributos que se leem, nem no conteúdo gerado das folhas;
- que não há travessões;
- o desenho: cada barra mede o seu número na escala do seu gráfico, as barras de cada gráfico partem da mesma origem, os dois painéis da casa têm a mesma escala desenhada, e a linha de referência está nos 60 da escala das colunas e fora do painel da União;
- a cor: só as fichas do sítio, e o âmbar só na linha de referência.

Antes de dar verde, planta catorze estragos numa cópia (um número solto, um valor trocado, o identificador de outra linha, uma linha retirada, um número das palavras fixas mudado, a unidade dentro do elemento do valor, um travessão, um painel da casa com outra escala escrita, um painel da casa mais estreito, uma barra fora da origem, a linha de referência nos 50, a linha a entrar no painel da União, uma cor numa coluna, o âmbar no rótulo) e exige que cada um dê a falha exata que lhe corresponde. A última corrida: **verde, 0 falhas, 14 de 14 plantas apanhadas** (`verificacao.txt`).

## O que não consegui, e o que fica para decidir

1. **A fonte dos blocos 2 a 5.** O pedido só dá a do bloco 1; nos outros ficou só o selo «fonte», porque as palavras são do pedido. Se o lugar de direção quiser uma linha igual à do bloco 1, as linhas do livro-razão dão: bloco 2 «Eurostat, 2025 · INE, agosto de 2026»; bloco 3 «Eurostat, 2025 · INE, segundo trimestre de 2026»; bloco 4 «INE, notificação de setembro de 2026 · Eurostat, 2025»; bloco 5 «Eurostat, 2025».
2. **O recibo de cada número.** O selo de cada bloco abre a página «Números e fontes» do sítio, e não as linhas do bloco: uma página com as linhas de um bloco ainda não existe, e os números dos desenhos não são ligações (nos pares as barras estão a 24 px umas das outras, e no bloco 1, a partir de 640 px, a 30 px; um alvo de toque de 44 px apanharia a vizinha). Na construção, cada número ou o selo tem de abrir a sua linha (IDENTIDADE §5).
3. **Três coisas em dois ecrãs, não quatro.** No telemóvel os dois primeiros ecrãs levam os preços, a casa e a frase do trabalho com o par do emprego. Para caber a quarta era preciso encolher o cabeçalho do sítio (o menu, a marca e a linha da inteligência artificial ocupam 180 px) ou tirar a caixa das rendas do bloco 2, e o pedido mandou manter o cabeçalho e dá a caixa.
4. **As escalas do bloco 3.** O emprego e o desemprego estão em escalas diferentes, e um leitor que compare os painéis vê barras do mesmo comprimento para 79,6 e 6 (é o risco de que a IDENTIDADE §11 fala: «barras normalizadas cada uma ao seu limiar convidam a uma comparação que não é válida»). Numa escala só, a diferença entre 2,2 e 1,9 ficava com um píxel. Pensei desenhar a longa duração dentro do desemprego, o desenho que melhor mostra «fica mais tempo», e não o fiz: o pedido pede três pares, e o excerto da linha da longa duração não diz a idade, por isso não confirmei que as duas contam a mesma população.
5. **A percentagem com espaço.** A IDENTIDADE §11 escreve a percentagem colada ao número («60%»); o pedido e a página no ar escrevem «23,78 %». Segui o pedido.
6. **O tema escuro.** A folha congelada ainda muda para o escuro pela preferência do sistema (a IDENTIDADE diz que, desde a Emenda 12, é o leitor que o pede). A página segue a folha; o guião confere as cores no escuro, e as capturas são no claro.
7. **Sem título para a secção dos cinco blocos.** A decisão do diretor de 28.09 (§1.133) chama-lhe «O que se passa»; o pedido não o escreve, e não o pus. Por cima das entradas também não há título.
8. **O título do painel da União no bloco 4** parte-se em três linhas a 390 px.
