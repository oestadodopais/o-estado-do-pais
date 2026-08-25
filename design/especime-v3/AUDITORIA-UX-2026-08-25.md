# Auditoria de UI e UX · 25.08.2026 · a lista de uma vez, e as decisões

*Escrita pelo lugar de direção (Claude Fable 5) a 25.08.2026, juntando três leituras que não se conheceram: a do leitor-utilizador (Claude Opus 5, `medicoes/auditoria-ux-2026-08-25-opus.md`: dezassete páginas em três larguras, toque real, 116 capturas, quatro detetores provados em casos conhecidos), a do leitor de outra família (Codex `gpt-5.6-sol`, `critica/2026-08-25-codex-leitura-ux.md`: as páginas construídas e 26 capturas, sem contexto, com a pergunta «o que percebe um leitor que chega aqui pela primeira vez»), e a do lugar de direção (as capturas do diretor, as suas próprias a 390 e a 1280, e a leitura dos dois relatórios). A direção do diretor está em `PEDIDOS-DO-DIRETOR-UX-2026-08-25.md`. Cada achado diz quem o viu: **O** (Opus), **C** (Codex), **S** (o lugar de direção), **D** (o diretor). Sem travessões na prosa deste ficheiro.*

## 0 · A conclusão em quatro linhas

O sítio prova mais do que explica: quem chega vê um painel sério de indicadores com fonte em cada número, e não percebe em cinco segundos o que é o sítio, quem o faz, o que são os treze indicadores, nem como chegar ao seu concelho. No telemóvel, os dois comandos que deviam abrir o caminho ao concelho e à região falham por defeitos concretos e medidos, o mapa não serve para nada, e a régua é ilegível no único estado em que o comando a mostra. O conteúdo com mais substância (a página de Évora, as páginas de linha, os estudos) existe e a primeira página não lhe abre caminho. E os leitores das duas famílias concordam, sem se terem lido, nos cinco achados que bloqueiam.

## 1 · A lista, por gravidade

### Bloqueia (um leitor não consegue fazer ou perceber uma coisa essencial)

| # | onde | o que se vê | quem | o que fecha |
|---|---|---|---|---|
| **B1** | `/`, 390 | «Abrir um concelho →» abre a pesquisa (117 px) e rola a página 131 px para lá dela: o leitor vê o mesmo ecrã com um anel de foco e conclui que nada aconteceu. No computador o mesmo comando deixa a pesquisa à vista. | O, C, D («um não faz nada») | correção (§5) |
| **B2** | `/`, 390 | o mapa rende a 84 × 111 px, os 309 pontos com 1,26 px de diâmetro a 4,27 px uns dos outros; tocar num ponto, no meio do mapa ou em Évora não muda nada. | O, C, D | decisão 3.1 |
| **B3** | `/`, 1280 e 1024 | os pontos do mapa sabem o destino (`data-caop`, e Évora `data-pagina="sim"`) e não o oferecem: nenhuma ligação no `svg`, cursor `auto`, o clique não muda endereço nem conteúdo. | O, D (ponto 5) | correção (§5), decisão 3.5 |
| **B4** | `/`, 390, depois de «Ver uma região →» | a régua da convergência abre com os rótulos uns por cima dos outros («Madeira» sobre «Algarve» 13,9 px; «88» sobre «89» 2,1 px; «77» sobre «Portugal» 4,0 px), no único estado em que o comando a mostra; no estado de entrada está fechada numa dobra. | O, C, D (a captura dele) | decisão 3.3 |
| **B5** | `/municipios`, 390 | 19,9 ecrãs, 307 linhas «sem página ainda» contra 2 «tem página», uma única ligação, sem pesquisa e sem mapa por baixo do título «O mapa dos concelhos». Quem entra por «Municípios» percorre vinte ecrãs para descobrir que só há Évora. | O, C | decisão 3.5 |

### Confunde (percebe-se mal, ou só à segunda)

| # | onde | o que se vê | quem | o que fecha |
|---|---|---|---|---|
| **C1** | `/`, 390 e 1280 | tocar em «Ver uma região →» apaga o mapa (`#mapa` passa a `display: none`). | O | correção, com 3.2 |
| **C2** | `/municipios/evora`, 390 e 1280 | «242,6 → 105,5» parte-se em duas linhas com a seta pendurada e os dois números encostados (106 × 13 px de sobreposição a 390, 152 × 19 a 1280; a 1024 não). | O, C | correção |
| **C3** | `/`, 1280 | o nome ao passar o rato no mapa cola-se ao resto: «Évoradistrito de Évora». | O | correção |
| **C4** | `/estudos/…/documento`, 390 | a edição arquivada parece outro sítio (outra letra, outra cabeça, um filete turquesa) e o primeiro parágrafo mostra ao leitor «Research Hub», `ledger.json` e `Technical Source/make_pt.py`. | O, C | a faixa: correção; o texto: motor (I69) |
| **C5** | `/`, 390 | o telemóvel não tem o comando «País · Região · Município» que o computador tem; o mesmo mecanismo tem duas caras e nomes diferentes, e a do telemóvel esconde o terceiro estado. | O | correção, com 3.2 |
| **C6** | `/`, 390 e 1280 | não se percebe porque estão ali treze indicadores, depois um painel social de outra forma, depois mais: «Procedimento dos Desequilíbrios Macroeconómicos» nunca explicado, «limiar 60% · acima» sem dizer quem o fixou, «cumpre 9» sem se saber se é bom; a única frase de contexto está no oitavo ecrã. | O, C, D (ponto 4) | decisão 3.4 |
| **C7** | `/estudos/…`, `/estudos`, 390 | «[a verificar]» ao lado do maior número de um estudo e em «Publicação: [a verificar]», sem porta para a página que o explica; o leitor lê-o como dúvida sobre o número. | O, C | correção (a porta), e decisão sobre a forma |
| **C8** | `/`, 390 e 1280 | a primeira página não diz o que é o sítio, quem o publica nem que é feito maioritariamente por IA; isso está no Sobre. **Nota do lugar de direção:** a Emenda 11 tirou a linha de método da mobília de propósito («o sítio não se explica na mobília»), e a Emenda 15 proíbe autorreferência nas páginas do leitor; o que o leitor de fora pede é uma frase de identidade, não de método. É uma tensão entre a constituição e a leitura, e é decisão do diretor. | C | decisão 4.7 |
| **C9** | `/estudos`, 390 | as edições PT e EN de um trabalho aparecem como linhas separadas, por vezes com o mesmo destino e a mesma descrição; «Publicação: [a verificar]» na maioria; «Descrição: reformulação do título» como campo visível de uma ficha. | C | correção da forma; as datas são do arquivo |
| **C10** | `/estudos/…/texto`, 390 e 1280 | depois do artigo, «As linhas deste documento» repete cada figura em centenas de entradas técnicas (`linha do motor`, `api-viva`, `raw-sem-manifesto`), e o aparelho mostra um caminho `.record.json` e resumos de 64 hexadecimais; não se sabe onde o artigo acaba. **Nota:** foi o desenho da parte 3 (a porta de cada figura sem linha do sítio abre a sua entrada nessa secção); a leitura diz que a secção, tal como está, custa mais ao leitor do que dá. | C, S | decisão 4.8 |
| **C11** | `/agenda`, 390 | os itens misturam o que se vai medir com a língua do motor («atravessados do motor», «registo prévio selado», `SURVEY.md`); a resposta a «o que vem a seguir» está enterrada no registo. | C | correção de voz (fase da voz), sem código |
| **C12** | `/en`, HTML | «concelho» fica por traduzir na interface inglesa («Type the name of the concelho», «No concelho by that name»). | C | correção |
| **C13** | `/livro-razao`, 390 | «Proveniência completa · 128» sem unidade nem denominador; e nas páginas de linha o identificador da máquina e o endereço inteiro do Eurostat como texto. | O, C | correção |
| **C14** | `/municipios/evora`, 390 | «sem limiar» com um quadrado vazio ao lado de 58 567 pessoas lê-se como avaliação incompleta e não como «não há limiar publicado». | C | correção da palavra, com a constituição (§2: sem limiar diz-se por palavras) |

### Cansa ou está a mais

| # | onde | o que se mede | quem | o que fecha |
|---|---|---|---|---|
| **D1** | as páginas de leitura, 390 | 111 e 243 ecrãs (74 078 e 161 373 px), 343 e 698 alvos de toque abaixo de 44 px, sem índice nem barra de progresso nem subida. | O, C | correção (índice), e decisão 4.8 |
| **D2** | `/`, 390 | 9,23 ecrãs; a mesma forma de cartão treze vezes; o primeiro valor do painel a 1,42 ecrãs de rolar. | O, C | decisão 3.4 (a forma B) |
| **D3** | `/`, `/municipios/evora`, 390 | 36, 110 e 698 alvos de toque abaixo de 44 px, quase todos os selos «■ fonte» (52 × 14 px) e os algarismos da manchete (8 × 16 px): exatamente as coisas que o sítio quer que se toquem. | O | correção |
| **D4** | todas, 390 | texto de 9,5 a 11 px em toda a parte (88 ocorrências na agenda, 58 em Évora, 44 no Método). | O | correção |
| **D5** | `/`, 390 | «Leitura breve» dá uma página maior do que «Relance» (10,8 contra 9,2 ecrãs): o rótulo hesita. | O, C | decisão de nome (fase da voz) |
| **D6** | todas, 390 | a mesma mobília em cima de todas as páginas (213 px: menu, língua, marca, «Painel europeu reconferido a», a agenda, claro · escuro); o título de cada página aparece a 0,35 ecrãs; a contagem da agenda repete-se em dezassete sítios. | O, C | correção |
| **D7** | `/`, `/municipios/evora`, 390 e 1280 | o vazio que o diretor viu mede 96 px (0,14 ecrãs) entre a legenda do mapa e o painel; sente-se um ecrã porque a metade direita da linha também está vazia e o mapa é minúsculo. Na página de Évora, quatro valores cortados pela margem inferior depois de uma área vazia a 1280. | D, O, C | correção |
| **D8** | `/livro-razao`, 390 | 27 ecrãs de linhas sem pesquisa nem filtro. | O, C | um bloco próprio, depois |
| **D9** | `/municipios/evora` | no gráfico dos mandatos um rótulo fica por baixo do eixo e três por cima. | O | correção |

### O que funciona bem, nas duas leituras

A escrita («Corrigir em silêncio é a forma mais barata de mentir», o Sobre inteiro, a `/a-verificar` inteira, a abertura do livro-razão); a página de uma linha (`/livro-razao/divida-publica-2025`: um número, quem o publicou, onde, quando foi lido, o texto de onde saiu, em dois ecrãs); o comando de língua (leva à página equivalente nos dois sentidos e volta ao ponto de partida); a robustez (zero transbordo em 51 combinações, zero erros de JavaScript, contraste mínimo 6,24:1); a leitura do mapa ao passar o rato (falta-lhe um espaço e um destino); a página de erro; a dobra do Método; as unidades e as datas sempre ao pé do valor; as correções e as dúvidas ditas em vez de escondidas.

## 2 · O que as duas leituras discordam, e como o lugar de direção o lê

* **O selo «■ fonte» em todos os números.** O leitor de fora conta-o como repetição; a constituição diz que onde aparece um valor aparece o selo, e é a promessa do sítio. Fica; o que muda é o alvo de toque (D3).
* **A mobília da cabeça.** Os dois leitores dizem que pesa; a constituição (§3) diz que o cabeçalho leva duas leituras rotuladas. Uma linha mais baixa no telemóvel resolve o peso sem tirar a leitura.
* **A identidade na primeira página (C8).** O leitor de fora pede uma frase de identidade; a Emenda 11 tirou a linha de método da mobília. Não é a mesma coisa: «Portugal, medido. Cada número tem fonte.» era método; «Um observatório de Portugal, feito por inteligência artificial e dirigido por uma pessoa» é identidade. Decisão do diretor.

## 3 · Os seis pontos do diretor, com opções medidas

Cada ponto traz o que a auditoria confirmou, duas ou três formas, e um custo estimado (símbolos de construtor, **inferido** dos rácios desta casa: um bloco pequeno de sítio 100k a 200k, um bloco médio 200k a 350k, um passo do motor 60k a 150k). Nenhuma se constrói antes da palavra do diretor.

### 3.1 · O mapa no telemóvel

**Confirmado:** B2. A Emenda 3 já diz que no telemóvel os 308 pontos nunca são alvos; o que falta é o mapa ter uma função no telemóvel, ou não estar lá.

| forma | o que é | o que dá ao leitor | custo |
|---|---|---|---|
| **A · sem mapa de pontos no telemóvel** | o selo do mapa sai; a escolha de concelho é a pesquisa e a lista de proximidade, que já existem e que o botão hoje esconde (B1), postas à vista logo abaixo da manchete | o caminho mais curto até ao seu concelho; nada a olhar que não se possa usar | pequeno (sítio, 100k a 150k) |
| **B · o mapa cresce ao toque, por distritos** (a ideia do diretor) | o mapa desenha os 18 distritos e as 2 regiões autónomas em linha, à largura toda; um toque num distrito abre-o (anima a crescer) e mostra os seus concelhos como nomes tocáveis, com o ponto ■ nos que têm página | o gesto que ele descreveu; o mapa passa de decoração a seletor | médio a grande: o motor extrai as linhas dos distritos da CAOP (hoje o sítio só tem centróides), 60k a 120k; o sítio, o instrumento novo com a animação e a lista, 250k a 350k |
| **C · o mapa cresce ao toque, inteiro, com ampliação na sua caixa** | um toque abre o mapa à largura toda numa caixa que se amplia com dois dedos; os pontos continuam sem ser alvos; por baixo, a pesquisa | um mapa que se vê; não escolhe nada por si | médio (sítio, 150k a 250k), e o leitor continua a escolher pela pesquisa |

**Recomendação:** A agora, porque fecha o defeito real (o leitor não chega ao seu concelho) sem inventar; B a seguir, se o diretor quiser o mapa como seletor, porque é a única forma em que o mapa acrescenta alguma coisa no telemóvel. C dá um mapa maior que continua a não servir para nada.

### 3.2 · Os dois botões

**Confirmado, com correção ao diagnóstico:** os dois funcionam; o primeiro rola para lá do que abre (B1) e o segundo abre uma régua ilegível e apaga o mapa (B4, C1); e o telemóvel tem uma cara diferente do computador para o mesmo comando (C5).

| forma | o que é | custo |
|---|---|---|
| **A · corrigir e unificar** | o mesmo comando nas duas larguras, «País · Região · Concelho»; ao escolher «Concelho», a pesquisa aparece à vista; ao escolher «Região», o mapa não desaparece | pequeno (sítio, 60k a 120k) |
| **B · tirar o âmbito da primeira página** | a primeira página é o país; os concelhos abrem-se pela pesquisa e pelo índice, as regiões pela sua página | pequeno, e simplifica; mas retira um estado que o computador já tem |

**Recomendação:** A, dentro do bloco das correções.

### 3.3 · A régua da convergência

**Confirmado:** seis leituras (Portugal e cinco regiões: Grande Lisboa, Península de Setúbal, Algarve, Madeira, Alentejo; faltam pelo menos o Norte, o Centro e os Açores, e o número de regiões NUTS II em vigor confirma-se na fonte antes de o motor as trazer [verify]), todas «provisório», fechada numa dobra, ilegível no telemóvel no estado que o botão abre (B4). O que ela responde, «como está cada região face à média europeia» (PIB per capita em paridades de poder de compra, UE-27 = 100), é uma pergunta que interessa, e é a única leitura regional do sítio.

| forma | o que é | custo |
|---|---|---|
| **A · sai da primeira página** | passa para a página das regiões (a construir) ou para o Método como instrumento; a primeira página fica com o painel e os concelhos | pequeno (sítio, 40k a 80k) |
| **B · fica, completa e legível** | o motor traz as regiões que faltam; no telemóvel a régua rende como lista com barras (uma linha por região, o 100 marcado), sem rótulos no eixo; no computador fica o eixo | motor 40k a 80k; sítio 100k a 150k |
| **C · fica como está, só com a colisão corrigida** | os rótulos deixam de se sobrepor | pequeno (20k a 40k), e a pergunta «vale a pena?» fica por responder |

**Recomendação:** B se a régua fica; A se não. C não.

### 3.4 · Os indicadores sem contexto

**Confirmado:** C6. A Emenda 15 proíbe o sítio de se explicar; não proíbe dizer o que a coisa é.

| forma | o que é | custo |
|---|---|---|
| **A · uma frase por painel, do que ele é** | por baixo da manchete, uma linha que nomeia o painel e quem o publica (por exemplo «Os treze indicadores com que a Comissão Europeia avalia os desequilíbrios de cada país, com os limiares que ela própria publica»), e o mesmo para o Painel Social («os indicadores sociais que a União compara entre países; não têm limiares»); as frases são texto do diretor | pequeno (sítio, 30k a 60k) |
| **B · os quatro fora primeiro, os nove dentro dobrados** | no telemóvel, os quatro fora do limiar em cartões e os nove dentro numa lista curta (nome, valor, limiar) que se abre; no computador a grelha fica | pequeno a médio (sítio, 80k a 150k) |
| **C · uma página do painel** | «O painel europeu» como página própria, com o que é, os treze e a história de cada um; a primeira página fica com a manchete e os quatro fora | médio (sítio, 150k a 250k) |

**Recomendação:** A já, B com ela; C depois, quando houver conteúdo para a encher.

### 3.5 · Tocar num concelho leva à sua página

**Confirmado:** B3 e B5; o título já leva de volta ao início.

| forma | o que é | custo |
|---|---|---|
| **A · os pontos com página são ligações** | no computador, o ponto de Évora (e cada um que ganhe página) passa a ligação para a sua página, com cursor e nome ao passar; no telemóvel, a pesquisa e a lista de proximidade levam lá | pequeno (sítio, 40k a 80k) |
| **B · uma página para cada um dos 308** (a Emenda 14 já a desenha: as mesmas oito medidas, vazias onde não há linha) | os 308 pontos passam a ter destino; o índice deixa de ser 307 «sem página ainda»; e as medidas do concelho podem vir para todos: a própria página de Évora diz que seis das suas oito medidas vêm de fontes que as publicam para todos os concelhos | motor: as séries por concelho, 150k a 300k; sítio: 308 páginas geradas da mesma vista, 100k a 200k. É o passo com mais conteúdo novo de todos |
| **C · o mapa muda a página no sítio** (o gesto descrito, sem mudar de endereço) | ao tocar, o conteúdo do concelho substitui o nacional na mesma página | médio (200k a 300k), e cria uma segunda casa para o mesmo conteúdo, que a página do concelho já é |

**Recomendação:** A agora; B como o bloco de conteúdo seguinte, porque é o que faz o sítio ser «o estado do país» e não «o estado de Évora». C não: a página do concelho já é o destino, e um endereço próprio é o que se partilha e se pesquisa.

### 3.6 · A estrutura por áreas de governo, e as notícias

**Não se confirma por medição.** O que se mediu: 12 trabalhos, 16 edições, 136 linhas, uma página de concelho com substância, e uma primeira página que abre três portas e não dá caminho ao que existe.

| forma | o que é | custo |
|---|---|---|
| **A · áreas só onde há conteúdo** | uma página por área de governo, com o nome do ministério tal como o Governo o publica (verificável), só para as áreas que já têm conteúdo (as finanças públicas: dívida, PRR; a habitação: o estudo em preparação e as linhas do painel; as autarquias: Évora), com os seus indicadores, estudos e itens da agenda; uma fila de áreas por baixo do painel na primeira página | sítio médio (150k a 250k); a lista das áreas e os nomes são decisão do diretor |
| **B · a taxonomia inteira primeiro** | todas as áreas do Governo como páginas, vazias onde não há conteúdo | médio a grande, e uma dúzia de páginas a dizer «sem conteúdo ainda» |
| **Notícias** | fora do âmbito desta fase: uma notícia é uma afirmação com data, e o livro-razão não tem forma para ela; entra quando houver a forma | a estimar quando for |

**Recomendação:** A, depois de 3.5 B, porque as áreas ganham sentido quando os concelhos também lá estão.

## 4 · As decisões que são do diretor

1. **O mapa no telemóvel:** A (sem mapa de pontos; a pesquisa à vista) agora, e B (o mapa por distritos, ao toque) a seguir, ou só uma delas. Recomendação: A agora, B a seguir.
2. **Os dois botões:** A (corrigir e unificar) ou B (tirar o âmbito). Recomendação: A.
3. **A régua:** fica completa (B) ou sai da primeira página (A). Recomendação: B se ele acha que a pergunta das regiões pertence à primeira página; A se não.
4. **O contexto dos indicadores:** A (uma frase por painel, com as palavras dele) e B (os quatro fora primeiro). Recomendação: as duas.
5. **Os concelhos:** A agora (os pontos com página são ligações) e B como o bloco de conteúdo seguinte (uma página por concelho, com o que as fontes publicam para todos). Recomendação: as duas, por esta ordem.
6. **As áreas de governo:** A (só onde há conteúdo), depois dos concelhos, com a lista das áreas dele. Recomendação: sim, depois de 5.
7. **Uma frase de identidade na primeira página (C8):** «sim, uma frase que diz o que o sítio é e quem o faz, com as palavras dele», ou «não, o Sobre chega e a Emenda 11 fica como está». O lugar de direção inclina-se para uma frase de identidade, curta, dele, sem método.
8. **«As linhas deste documento» (C10, D1):** fica como está (a porta de cada figura abre a entrada na mesma página), ou passa para trás de uma porta única no fim do artigo («As linhas deste documento →», a secção dobrada ou numa página própria), com a porta de cada figura a abrir a entrada nessa forma. Recomendação: a secção dobrada no fim, fechada por defeito, para que o artigo acabe onde acaba; as portas das figuras continuam a abri-la.
9. **Os defeitos que não pedem decisão (§5):** vão num bloco de correções, com a disciplina da casa. Recomendação: sim, primeiro.

## 5 · O bloco das correções, sem decisão

B1 (rolar até à pesquisa), B3 e 3.5 A (os pontos com página como ligações), C1 e C5 (o mapa que desaparece e o comando unificado, na forma 3.2 A), C2 (o par «242,6 → 105,5»), C3 (o espaço do nome no mapa), C4 (a faixa da edição arquivada; o texto é I69, do motor), C7 (a porta do marcador para a sua página), C9 (a forma do índice dos estudos: uma linha por trabalho com as suas edições), C12 («concelho» em inglês), C13 («128» com denominador; o identificador e o endereço na página da linha), C14 («sem limiar» dito por palavras), D3 (os alvos de toque dos selos e dos algarismos da manchete), D4 (o texto abaixo de 12 px no telemóvel), D6 (a mobília da cabeça mais baixa no telemóvel; a contagem da agenda uma vez), D7 (o vazio, e os valores cortados em Évora a 1280), D9 (o rótulo do gráfico), D1 (um índice ou uma barra de progresso nas páginas de leitura longas). Um bloco de sítio, **inferido** 250k a 350k, com briefs, estragos plantados, medição cega e leitura cruzada, fusão só com a palavra do diretor. C11 (a agenda) e D5 (o nome «Leitura breve») são voz, e vão para a fase da voz.

## 6 · O custo desta auditoria, como reportado

O leitor-utilizador (Claude Opus 5): **≈269k** símbolos pelo contador do harness (o próprio estimou 1,0 a 1,2 M de entrada, contando as capturas lidas como imagem; o número do harness é o que se reporta). O leitor de outra família (Codex): **391 302** símbolos, orçamento próprio. O lugar de direção: as capturas próprias, as leituras dos dois relatórios e este documento, no contador da sessão. A estimativa do método era 150k a 250k; o Codex ficou acima por ter recebido 26 capturas e dezassete páginas.
