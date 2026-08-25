# Auditoria de UI e UX · primeira leitura · 25.08.2026

*Feita pelo leitor-utilizador (Claude Opus 5) a partir de `briefs/BRIEF-auditoria-ux-2026-08-25.md`. Sítio percorrido no ar em `https://xn--oestadodopaís.pt` (domínio acentuado `oestadodopaís.pt`), a 25.08.2026, entre as 10h50 e as 13h. Sem travessões nesta prosa; o ponto meio é o separador.*

## 0 · Como isto foi feito, e o que vale

**Aparelhos.** Telemóvel: Playwright `devices["iPhone 13"]` em WebKit, 390 × 664, com toque real (`page.tap` e `page.touchscreen.tap`), nunca clique de rato. Capturas a `deviceScaleFactor` 2 e JPEG de qualidade 70, como a §1 do brief pede (o descritor traz 3; baixei para 2 só para as capturas não pesarem). Computador: Chromium, 1280 × 800, rato e teclado. Passagem final a 1024 × 768 na primeira página e na de Évora.

**O que li e o que não li.** Não abri um único ficheiro do código do sítio, nem antes nem depois. Onde a seguir nomeio um atributo (`data-caop`, `data-pagina`), uma classe (`.claim-value`) ou um estilo calculado (`display: none`), isso saiu do DOM da página no ar, que é a medição que a §2 do brief autoriza. Por isso a etiqueta **li no código** não aparece neste relatório: não há nada que a mereça. Fica só **vi** (na captura ou no toque) e **medi** (com o número).

**Os detetores, e o que lhes corrigi.** Escrevi os meus. Três deram vazio à primeira e nenhum desses vazios era um achado:

* a **sobreposição de textos** deu zero exatamente onde o diretor a fotografou. Duas causas, ambas minhas: eu recolhia caixas por elemento, e um nó de texto solto dentro de um elemento que tem filhos nunca era recolhido (a régua tem `Portugal ` e `<tspan>82</tspan>` no mesmo `<text>`); e eu usava a caixa-união do inline em vez da caixa de cada linha. Passei a medir cada nó de texto com `Range.getClientRects()`. **Prova do detetor:** no estado que «Ver uma região →» abre, apanha «Madeira» sobre «Algarve» com 13,9 px, «88» sobre «Algarve» com 3,6 px e «88» sobre «89» com 2,1 px, todos em `div.banda-tela > svg > g > text`. É o caso que o diretor fotografou;
* depois dessa correção o detetor passou a dar **685 sobreposições em `/metodo`** e 302 na `/agenda`. Fui ver as capturas: nada colide no ecrã. As dobras fechadas usam o padrão `grid-template-rows: 0fr` com `overflow: hidden`, e o texto lá dentro continua a ter caixas de linha embora esteja recortado. Acrescentei a regra que faltava (um texto que cai fora de um antepassado com `overflow` diferente de `visible` não está no ecrã). `/metodo` passou de 685 para 0, a `/agenda` de 302 para 0, e o caso conhecido da régua continua apanhado. É esse detetor que dá os números da §2;
* os **vazios verticais** deram zero por eu contar como tinta um aviso de teclado invisível. Deitei fora a contagem por DOM e passei a medi-los nos pixéis da própria captura: procuro bandas horizontais de cor uniforme na imagem de página inteira. **Prova do detetor:** com o limiar a 50 px encontra oito bandas na primeira página do telemóvel, a maior de 96 px em y = 825..921, que é a que o diretor viu, e reproduz a altura do documento (6132 px) de forma independente. Com o limiar do brief, 200 px, não encontra nenhuma em nenhuma página.

**Uma medição que não fiz.** O detetor de vazios por pixéis não é válido acima de cerca de 50 000 px de altura: o canvas aceita a imagem mas desenha-a vazia, e a página inteira lê-se como uma única banda. Confirmei-o (`primeiroPixel: [0,0,0]` numa página cujo fundo é `rgb(246, 247, 244)`). Por isso os vazios **não estão medidos** em três casos: `/estudos/evora-quinze-anos-cinco-mandatos/texto` a 390 e a 1280, e `/estudos/evora-prometido-pago-auditado-2026/texto` a 390. Não digo zero onde não medi.

**As capturas** estão em `…/scratchpad/ux-auditoria/`, 116 ficheiros, e cada achado cita a sua pelo nome.

---

## 1 · A lista, por gravidade

### Bloqueia

**B1 · No telemóvel, «Abrir um concelho →» faz aparecer a pesquisa 131 px acima do topo do ecrã, e o leitor não vê nada acontecer.** Telemóvel, primeira página. **Vi** (`inicio-390-apos-abrir-concelho-cima.jpg`): depois do toque real, o ecrã mostra a mesma manchete e os mesmos dois botões, com um anel de foco no primeiro. Nada de novo aparece. **Medi:** o toque revela o bloco `#pesquisa`, com 117 px de altura, no ponto y = 376 do documento; a seguir a página rola para y = 507. A pesquisa fica em y = −131 relativamente ao topo do ecrã, `visivel: false`, e o foco vai para `A.movel-destino`, não para o campo. Ou seja: o comando abre a coisa certa e depois rola para lá dela. **É esta a leitura do «um dos dois botões não faz nada»:** ele faz, e o resultado sai de vista no mesmo gesto. No computador o mesmo comando põe a pesquisa em y = 393, à vista (`inicio-1280-apos-municipio-cima.jpg`); o defeito é só do telemóvel.

**B2 · O mapa no telemóvel tem 84 px de largura e os pontos 1,26 px; tocar num deles não faz nada.** Telemóvel, primeira página. **Vi** (`inicio-390-ecra2.jpg`, `mapa-390-apos-toque.jpg`): o mapa é um selo à esquerda dos dois botões, e nem os arquipélagos se distinguem. **Medi:** o `svg` rende a 84 × 110,6 px com `viewBox="0 0 600 790"`, o que dá uma escala de 0,14; os 309 círculos têm `r=4.5` e saem com **1,26 px de diâmetro**, com **4,27 px de distância média ao vizinho mais próximo**. Toquei no ponto de Évora e no meio do mapa: o endereço, o texto da página e a altura ficam iguais nos dois casos. Não há ampliação própria do mapa; o `meta viewport` é `width=device-width, initial-scale=1`, sem `maximum-scale`, portanto a página deixa-se ampliar com dois dedos, mas a ampliação da página não é um comando do mapa e não muda a densidade de 308 pontos em 84 px.

**B3 · No computador, clicar num ponto do mapa não leva a lado nenhum, nem sequer em Évora, que o mapa sabe ter página.** 1280 e 1024, primeira página. **Vi** (`mapa-1280-apos-tocar-ponto.jpg`, igual a `mapa-1280-rato-sobre-ponto.jpg`): a captura antes e depois do clique é a mesma. **Medi:** os círculos trazem `data-m`, `data-d` e `data-caop`, e o de Évora traz ainda `data-pagina="sim"`; o `svg` não tem uma única ligação (`<a>`) nem um `<title>`, o `cursor` calculado sobre o ponto de Évora é `auto` e não `pointer`, e depois do clique o endereço, o `h1`, a altura e o texto não mudam. O mapa conhece o destino e não o oferece. É o ponto 5 do diretor, confirmado com o atributo à vista.

**B4 · A régua da convergência é ilegível no estado que o botão «Ver uma região →» abre.** Telemóvel. **Vi** (`inicio-390-apos-ver-regiao-cima.jpg`): «Alentejo 77» e «Algarve 89» numa linha, «Portugal 82» e «Madeira 88» na de baixo, os dois últimos encostados sem espaço nenhum entre si. **Medi:** «Madeira» sobre «Algarve» com 13,9 × 0,6 px, «88» sobre «Algarve» com 3,6 px, «88» sobre «89» com 2,1 px, «77» sobre «Portugal» com 4,0 px, todos em `div.banda-tela > svg > g > text`. Duas notas que mudam a leitura: primeiro, **no estado de entrada isto não existe**, porque a régua entra fechada numa dobra («▸ A RÉGUA DA CONVERGÊNCIA · abrir», `inicio-390-ecra9.jpg`); a colisão nasce exatamente onde o comando promete levar. Segundo, a régua tem seis leituras e nenhuma delas é a de um concelho, num comando que se chama «Ver uma região».

**B5 · A página que promete os concelhos tem 19,9 ecrãs, 307 linhas que dizem «sem página ainda» e uma única ligação.** `/municipios`, telemóvel. **Vi** (`municipios-390-cima.jpg`, `municipios-390-inteira.jpg`): a seguir a «1 de 308 concelhos · tem página» vem um título «O MAPA DOS CONCELHOS» sem mapa por baixo, e depois a lista, distrito a distrito, quase toda com o mesmo carimbo cinzento à direita. **Medi:** altura 13 239 px = 19,94 ecrãs; 307 ocorrências de «sem página ainda» contra 2 de «tem página»; **1** ligação `a[href^="/municipios/"]` em todo o `main`; nenhum campo de pesquisa e nenhum `svg` na página. A 1280 são 5894 px, o mesmo conteúdo. Um leitor que chega aqui para abrir o seu concelho percorre vinte ecrãs para descobrir que só há Évora.

### Confunde

**C1 · Tocar num botão ao lado do mapa faz o mapa desaparecer.** Telemóvel e computador. **Vi** (`inicio-390-apos-ver-regiao-cima.jpg`, `inicio-1280-ambito-regiao.jpg`): depois de «Ver uma região →», o selo do mapa deixa de estar lá e ficam os dois botões sozinhos. **Medi:** `#mapa` sai da lista de secções visíveis no telemóvel, e a 1280 o seu `display` calculado passa de `grid` a `none`; a altura da página desce de 4900 para 4833 px. As duas leituras possíveis, e digo-as ambas porque o brief manda: ou o mapa é dispensável no âmbito «região» e então a sua saída é deliberada, ou é a referência que o leitor acabou de usar para se orientar e retirá-la no mesmo gesto do toque é o contrário do que ele pediu. A segunda é a que se sente ao usar.

**C2 · O par «242,6 → 105,5» parte-se em duas linhas com a seta pendurada no fim da primeira, e os dois números encostam.** `/municipios/evora`, telemóvel e 1280. **Vi** (`evora-390-sobreposicao-glance.jpg`, `evora-1280-sobreposicao-glance.jpg`): lê-se «242,6 ■ FONTE →» e por baixo «105,5 ■ FONTE», com a seta a apontar para o vazio à direita. **Medi:** as duas caixas `span.claim-value` cruzam-se 106,4 × 13,4 px no telemóvel (y = 4189) e 151,6 × 18,8 px a 1280 (y = 2863). A 1024 o par não colide (zero sobreposições na página inteira), o que mostra que não é falta de espaço: a 1280 sobram mais de trezentos pixéis à direita da seta. É a única colisão real de texto que encontrei fora da régua, nas três larguras e nas dezassete páginas.

**C3 · O nome que o mapa mostra ao passar o rato cola-se à palavra seguinte.** 1280. **Vi** (`mapa-1280-rato-sobre-evora.jpg`): por baixo do mapa aparece «**Évora**distrito de Évora», sem espaço nem separador entre o nome a negro e o resto. **Medi:** os três `span` do readout (`readout-name`, `readout-pre`, `readout-sub`) ficam `display: inline` e o texto concatenado é `"Évoradistrito de Évora"`. A leitura em si funciona bem e é uma boa ideia; o que falha é um espaço.

**C4 · A edição arquivada de um estudo parece outro sítio, e mostra a canalização ao leitor.** `/estudos/evora-prometido-pago-auditado-2026/documento`, telemóvel e 1280. **Vi** (`estudo-evora-documento-390-cima.jpg`): outra letra, outra cabeça («DOCUMENTO DO ESTUDO · EDIÇÃO DE REGISTO», «Sobre», «Voltar à página do estudo ↑»), um filete turquesa que não existe em mais lado nenhum, e o corpo em itálico acinzentado. No primeiro parágrafo aparecem, à vista do leitor, «Research Hub.», «`ledger.json`» e «`Technical Source/make_pt.py`». O título usa «–» onde as outras páginas usam «—». Um leitor que chegue aqui por uma ligação não reconhece o sítio de onde veio.

**C5 · O telemóvel não tem o comando de âmbito que o computador tem.** **Vi:** a 1280 e a 1024 há uma barra «ÂMBITO · País · Região · Município» ao lado de «DENSIDADE · Relance · Leitura breve» (`inicio-1280-cima.jpg`, `inicio-1024-cima.jpg`); no telemóvel só há «DENSIDADE», e o âmbito vive nos dois botões ao lado do mapa (`inicio-390-ecra1.jpg`, `inicio-390-ecra2.jpg`). **Medi:** os três `a.seg` do computador levam a `/`, `/#convergencia` e `/municipios` com `data-modo` `pais`, `regiao` e `municipio`; os dois botões do telemóvel levam a `/municipios` e `/#convergencia` com os mesmos `data-modo`. É o mesmo mecanismo com duas caras e nomes diferentes, e a do telemóvel esconde que existe um terceiro estado.

**C6 · Não se percebe porque estão ali treze indicadores, depois um painel europeu, depois mais indicadores.** Telemóvel e computador, primeira página. **Vi** (`inicio-390-ecra2.jpg` a `ecra8.jpg`): treze cartões com a mesma forma (número grande, «limiar X% · acima», unidade, nome, «▸ ABRIR», «■ FONTE»), depois «Painel Social Europeu» com onze linhas de outra forma, e no fim uma única ligação «O livro-razão →». Em lado nenhum da primeira página se diz o que é o Procedimento dos Desequilíbrios Macroeconómicos, quem publica estes limiares, ou porque é que a seguir vem um painel diferente. A única frase que dá contexto está enterrada no oitavo ecrã, dentro do painel social («Indicador principal do Painel Social Europeu. Está acima da média da União, que é uma posição relativa, não um limiar»). É o ponto 4 do diretor, e confirma-se: da primeira página não se percebe.

**C7 · O marcador `[a verificar]` aparece ao leitor sem que a página onde aparece explique o que é.** **Vi:** «FONTE [A VERIFICAR]» num selo de contorno tracejado ao lado do maior número de `/estudos/evora-prometido-pago-auditado-2026` (`estudo-evora-390-cima.jpg`), e «PUBLICAÇÃO: [A VERIFICAR]» em `/estudos` (`estudos-390-cima.jpg`). **Medi:** o marcador rende a 10,5 px na página de Évora. A `/a-verificar` explica-o muito bem, e explica-o inteiro (`a-verificar-390-inteira.jpg`), mas nada nas páginas onde o marcador aparece leva lá. As duas leituras: ou é o marcador a fazer o seu trabalho, que é ser visível, ou é uma etiqueta de obra à vista numa página publicada. Inclino-me para a primeira, com a ressalva de que sem ligação para a explicação ela lê-se como a segunda.

**C8 · «PROVENIÊNCIA COMPLETA · 128» é um número sem unidade.** `/livro-razao`. **Vi** (`livro-razao-390-cima.jpg`): depois de «136 afirmações · 19 calculadas» vem uma linha «PROVENIÊNCIA COMPLETA» e por baixo, sozinho, «128». Não diz 128 de quê, nem em quantos, nem se é bom.

**C9 · A página da linha do livro-razão mostra o identificador da máquina como se fosse texto.** `/livro-razao/divida-publica-2025`. **Vi** (`linha-divida-390-cima.jpg`): por baixo do selo aparece «divida-publica-2025», sem acento e sem explicação, e mais abaixo o endereço completo do Eurostat impresso e partido em duas linhas. É a página mais limpa do sítio e mesmo assim traz duas coisas que só o motor precisa de ver.

### Cansa ou está a mais

**D1 · A página de leitura de um estudo tem 243 ecrãs no telemóvel.** **Medi:** `/estudos/evora-quinze-anos-cinco-mandatos/texto` mede 161 373 px = **243,03 ecrãs** a 390, e 102 475 px = 128,09 ecrãs a 1280; `/estudos/evora-prometido-pago-auditado-2026/texto` mede 74 078 px = 111,56 ecrãs a 390. Nas mesmas páginas contei **698** e **343** alvos de toque com menos de 44 px. Não há índice fixo, nem barra de progresso, nem botão de subida. **Vi** (`estudo-quinze-texto-390-cima.jpg`, `estudo-evora-texto-390-cima.jpg`) que a tipografia é boa; o problema é só a distância.

**D2 · A primeira página tem 9,23 ecrãs no telemóvel e o painel é a mesma forma treze vezes.** **Medi:** 6132 px a 390 (9,23 ecrãs), 4900 px a 1280 (6,13), 4644 px a 1024 (6,05). Os cartões do painel repetem-se de 238 em 238 px. A primeira coisa com número e selo aparece a **808 px** (1,22 ecrãs) no telemóvel, e é a legenda do mapa, «308 concelhos · CAOP 2025 ■ fonte»; o primeiro cartão do painel («89,7») começa a **943 px**, ou seja **1,42 ecrãs** de rolagem, e a sua tinta só aparece a 966 px.

**D3 · Vinte e dois selos «■ FONTE» de 52 × 14 px, e oito números de 8 × 16 px, só na primeira página.** Telemóvel. **Medi:** 36 alvos abaixo de 44 × 44 px na primeira página, agrupados assim: 22 × `a.src-chip` a 52 × 14 px (o «■ fonte» de cada cartão), 8 × `a.prova-valor` com o **menor a 8 × 16 px** (os algarismos sublinhados «4» e «9» dentro da manchete), 1 × `a.ligacao-email` a 217 × 19, 2 × `a.lig` a 93 × 14, e mais três. Na página de Évora são **110** e na de leitura do estudo **698**. Nenhum destes está errado como texto; estão errados como alvo de dedo, e são precisamente os que provam os números, que é o que o sítio quer que se toque.

**D4 · Texto abaixo de 12 px em toda a parte, e o mais pequeno tem 9,5 px.** Telemóvel. **Medi**, agregando nove páginas: 9,5 px na linha da cabeça («Painel europeu reconferido a», «2026-08-24»), 10 px em `linha-campo-k` («Encontrou um erro?»), `badge` («PT»), `agenda-k`, `regra-k`, `mecanismo-legenda-k`; 10,5 px em «sem página ainda», «[a verificar]», `glance-unit`, `mono` (datas); 11 px em toda a escala das réguas dos cartões e em «descarregar os dados (CSV) ↓»; 11,5 px na legenda do mapa e nas unidades do painel. Contagens por página: 88 em `/agenda`, 58 em `/municipios/evora`, 44 em `/metodo`, 24 em `/estudos/evora-prometido-pago-auditado-2026`.

**D5 · «Leitura breve» dá uma página maior do que «Relance».** Telemóvel. **Medi:** `/` mede 6132 px (9,23 ecrãs) com 0 dobras abertas de 28; `/?densidade=leitura` mede **7160 px (10,78 ecrãs)** com 26 das 28 dobras abertas. O comando funciona e é coerente com os nomes (o relance é o curto), mas o rótulo «breve» sobre o estado mais longo dos dois faz hesitar antes de tocar.

**D6 · A mesma mobília em cima de todas as páginas.** **Medi:** a cabeça mede 213 px em todas as páginas e 259 px na primeira, e o primeiro título de conteúdo aparece entre 233 e 266 px (0,35 a 0,40 ecrãs) no telemóvel. Repete «MENU», «ENGLISH», «O Estado do País», «Painel europeu reconferido a 2026-08-24», «Agenda: 4 em curso · 0 a seguir» e «claro · escuro». No pé repete-se de novo a mesma navegação e outra vez «ENGLISH» (`inicio-390-ecra10.jpg`). A contagem da agenda no topo de todas as páginas é a mesma informação em dezassete sítios.

**D7 · O vazio que o diretor viu existe, mas mede 96 px e não um ecrã.** Telemóvel, primeira página. **Vi** (`inicio-390-ecra2.jpg`): entre «308 concelhos · CAOP 2025 ■ FONTE» e o filete que abre o painel há uma faixa branca larga. **Medi** nos pixéis: a linha da legenda acaba em y = 826, a banda vazia vai de **y = 825 a y = 921 e tem 96 px** (0,14 ecrãs), há um filete a 921 e o primeiro cartão começa em 943. Do fim da legenda ao primeiro cartão são 117 px ao todo. Nenhuma banda vazia em nenhuma página, em nenhuma das três larguras, chega aos 200 px do brief; a maior de todas é de **125 px** na primeira página a 1280 (y = 1043..1168). Fica registada a diferença entre o que se sente e o que mede: sente-se um ecrã porque a metade direita da linha «308 concelhos» também está vazia e o mapa é minúsculo, mas o vazio em si é de um sétimo de ecrã.

**D8 · O eixo do gráfico dos mandatos põe um rótulo por baixo da linha e três por cima.** `/municipios/evora`. **Vi** (`evora-1280-sobreposicao-glance.jpg`): «242,6», «182,0» e «105,5» ficam por cima das barras e «141,9» fica por baixo do eixo, porque a barra é curta demais. Lê-se como se 141,9 fosse de outra natureza.

---

## 2 · Página a página

As seis perguntas do brief, e as medidas, nas duas larguras. Onde não digo nada de uma largura, ela comporta-se como a outra.

### `/` a primeira página

| | 390 | 1280 | 1024 |
|---|---|---|---|
| altura | 6132 px · 9,23 ecrãs | 4900 px · 6,13 | 4644 px · 6,05 |
| até à legenda do mapa («308 concelhos ■ fonte») | 808 px · 1,22 ecrãs | 1026 px · 1,28 | 797 px · 1,04 |
| até ao primeiro cartão do painel («89,7») | 943 px · 1,42 ecrãs | 1189 px · 1,49 | 964 px · 1,26 |
| alvos < 44 px | 36 | (não se aplica) | |
| texto < 12 px | 10 | 18 | 18 |
| sobreposições reais | 0 no estado de entrada · 4 depois de «Ver uma região →» | 0 | 0 |
| maior vazio | 96 px | 125 px | 111 px |
| transbordo horizontal | não | não | não |

*Nota de honestidade sobre esta linha: o meu detetor automático do «primeiro valor com selo» devolve y = 0 na primeira página, porque apanha um bloco fora de vista com o texto «fonte · calculado · Avaliação Económica Regional de Portugal 2026». Não uso esse número. Os dois valores acima são medições diretas de `.mapa-linha` e do primeiro `#painel article`, que vi nas capturas. Nas outras páginas, onde não há esse bloco, o detetor concorda com o que se vê e é o que dá os números da §2.*

**O que é esta página?** Percebe-se em cinco segundos que é um sítio que mede Portugal, e a manchete diz uma coisa concreta. O que não se percebe em cinco segundos é o que fazer a seguir. **O que posso fazer aqui?** Trocar a densidade, abrir os dois botões do âmbito, abrir cada cartão, tocar em cada selo, ir ao livro-razão, e no computador passar o rato pelo mapa. **O que não percebi:** «Procedimento dos Desequilíbrios Macroeconómicos» (nunca explicado); «limiar 60% · acima» (acima de quê, quem o fixou); porque é que o painel social vem a seguir aos treze cartões e tem outra forma; o quadrado ■ antes de «fonte»; «Painel europeu reconferido a». **O que não funcionou:** B1 e B2 acima. **O que está a mais:** a repetição de treze cartões idênticos, e o selo «■ fonte» vinte e duas vezes na mesma página. **Rolagem até à primeira coisa que interessa:** 1,42 ecrãs no telemóvel até «89,7», que é o primeiro valor que o sítio quer mesmo mostrar.

Estados: `Relance` 9,23 ecrãs, `Leitura breve` 10,78 (abre 26 dobras, `inicio-390-leitura-breve-inteira.jpg`); `?ambito=municipio` +133 px no telemóvel e +1176 px no computador; `?ambito=regiao` abre a régua e apaga o mapa. `claro`/`escuro` funciona: o fundo passa de `rgb(246, 247, 244)` a `rgb(21, 23, 26)` (`inicio-390-escuro-cima.jpg`). O `MENU` do telemóvel abre com as oito ligações (`inicio-390-menu-aberto.jpg`); registo que a minha primeira medição disse que abria vazio e estava errada, porque procurei as ligações no `<details>` errado. Fui ver a captura antes de o escrever.

### `/municipios`

390: 13 239 px · 19,94 ecrãs · 14 alvos < 44 px · 13 textos < 12 px · 0 sobreposições. 1280: 5894 px · 7,37 ecrãs. **O que é:** a lista dos 308 concelhos. **O que posso fazer:** rolar, e abrir Évora. **O que não percebi:** «1 de 308 concelhos · tem página» (é uma contagem ou um filtro?); o título «O MAPA DOS CONCELHOS» sem mapa por baixo. **O que não funcionou:** nada quebra; falta é que exista. **O que está a mais:** 307 linhas com um estado em vez de um destino. **Rolagem:** 0,62 ecrãs até ao primeiro valor.

### `/municipios/evora`

390: 11 550 px · 17,39 ecrãs · **110** alvos < 44 px · **58** textos < 12 px · 1 sobreposição real. 1280: 7632 px · 9,54 ecrãs · 131 alvos · 1 sobreposição. 1024: 7520 px · 0 sobreposições. **O que é:** percebe-se logo, «MUNICÍPIO · Évora · distrito de Évora · Alentejo Central» (`evora-390-cima.jpg`). É a melhor página do sítio em substância. **O que posso fazer:** ler os indicadores do concelho, abrir cada mandato, seguir cada fonte. **O que não percebi:** «sem limiar» com um quadrado vazio ao lado de 58 567 pessoas; a seta entre 242,6 e 105,5 depois de o par se partir; «2025– em funções» com o traço pendurado. **O que não funcionou:** C2. **O que está a mais:** quatro selos «FONTE» seguidos por baixo do mesmo gráfico. **Rolagem:** 0,98 ecrãs no telemóvel.

### `/estudos` e as páginas de estudo

`/estudos`: 390 3724 px · 5,61 ecrãs; 1280 3033 px. **O que não percebi:** «DESCRIÇÃO: REFORMULAÇÃO DO TÍTULO» e «PUBLICAÇÃO: [A VERIFICAR]» como campos visíveis de uma ficha; «12 ■ FONTE trabalhos no arquivo · 16 ■ FONTE edições» com o selo entre o número e a palavra que o explica.

`/estudos/evora-prometido-pago-auditado-2026`: 390 3206 px · 4,83 ecrãs · 28 alvos < 44 px · 24 textos < 12 px. **Vi** o número 167 372 755,84 antes de qualquer palavra que diga do que é (a unidade vem por baixo). Boa página, curta, com a ligação para o concelho.

`…/texto`: 390 **74 078 px · 111,56 ecrãs** · 343 alvos < 44 px; 1280 47 137 px · 58,92 ecrãs. Tipografia excelente, distância impossível. Vazios não medidos a 390 (limitação declarada na §0).

`…/documento`: 390 28 568 px · 43,02 ecrãs · 0 textos < 12 px. C4 acima.

`…/evora-quinze-anos-cinco-mandatos/texto`: 390 **161 373 px · 243,03 ecrãs** · **698** alvos < 44 px; 1280 102 475 px · 128,09 ecrãs. Primeiro valor com selo a 8,24 ecrãs no telemóvel. Vazios não medidos.

### `/livro-razao` e as linhas

`/livro-razao`: 390 18 050 px · 27,18 ecrãs · 151 alvos < 44 px; 1280 11 869 px. **O que é:** percebe-se, e o parágrafo de abertura é dos melhores textos do sítio. **O que está a mais:** 27 ecrãs de linhas sem filtro nem pesquisa.

`/livro-razao/divida-publica-2025`: 390 2715 px · 4,09 ecrãs, primeiro valor a 0,32 ecrãs; 1280 1561 px · 1,95 ecrãs, 0,26 ecrãs. É a página exemplar do sítio: uma afirmação, o número, a fonte, a data de leitura, o endereço. Única reserva, C9.

`/livro-razao/evora-prr-aprovado-2026`: 390 5190 px · 7,82 ecrãs; 1280 3143 px. Igual em forma.

### `/agenda`, `/metodo`, `/sobre`, `/correcoes`, `/a-verificar`

`/agenda`: 390 12 786 px · 19,26 ecrãs · **88** textos < 12 px · 66 alvos < 44 px; 1280 10 606 px. Tem índice próprio («NESTA PÁGINA»), o que ajuda. É a página com mais texto miúdo do sítio.

`/metodo`: 390 3549 px · 5,34 ecrãs · 74 alvos · 44 textos < 12 px. Dez regras em dobras numeradas (`metodo-390-ecra4.jpg`), a primeira aberta e as outras fechadas. Funciona bem. A secção final «A forma» explica a cor e a letra (`metodo-390-ecra5.jpg`).

`/sobre`: 390 1047 px · 1,58 ecrãs. A página mais curta e uma das mais claras (`sobre-390-inteira.jpg`). Diz em quatro linhas o que o sítio é e que é feito maioritariamente por inteligência artificial.

`/correcoes`: 390 7270 px · 10,95 ecrãs · 36 alvos · 22 textos < 12 px. Abre com «Corrigir em silêncio é a forma mais barata de mentir», que é a melhor frase do sítio. Primeiro valor a 2,83 ecrãs.

`/a-verificar`: 390 2333 px · 3,51 ecrãs · 6 alvos · 8 textos < 12 px. Explica o marcador inteiro e bem (`a-verificar-390-inteira.jpg`). Devia estar ligada a partir de onde o marcador aparece.

### A página de erro e o comando de língua

Um endereço que não existe devolve **404** com uma página própria: «404 · Não existe nada neste endereço. · A ligação pode estar errada, ou a página pode ter mudado de sítio» e três saídas, «IR PARA O INÍCIO», «VER OS ESTUDOS», «LER O MÉTODO» (`erro-404-1280-cima.jpg`). Mantém a cabeça e o pé do sítio. Nada a apontar.

O comando de língua **funciona bem nos dois sentidos, e leva à página equivalente e não à raiz.** Medi a partir de quatro páginas: `/livro-razao/divida-publica-2025` → `/en/ledger/divida-publica-2025`, `/municipios/evora` → `/en/municipalities/evora`, `/metodo` → `/en/method`, `/` → `/en`; e a volta devolve exatamente a página de partida, com `lang` a passar de `en` a `pt-PT`. Os segmentos do endereço estão traduzidos. Registo que uma pergunta minha anterior deu 404 porque **eu** inventei o endereço `/en/livro-razao/…`: o defeito era da minha suposição, não do sítio.

### A passagem a 1024

Nada parte entre 1024 e 1280. Primeira página: 4644 px, sem transbordo horizontal, com a barra de âmbito e densidade inteira numa linha (`inicio-1024-cima.jpg`). Évora: 7520 px, sem transbordo, e **sem** a colisão C2, que só aparece a 390 e a 1280.

### Medidas que deram zero em todo o lado

**Transbordo horizontal:** zero em 17 páginas × 3 larguras. `scrollWidth` igual a `innerWidth` em todos os casos. **Erros de JavaScript e recursos em falha:** zero, tirando os dois 404 que eu próprio pedi. **Contraste:** o par mais fraco que encontrei foi **6,24:1** (`rgb(88, 93, 91)` sobre `rgb(246, 247, 244)`), acima de 4,5:1 mesmo no texto de 9,5 px. A paleta não impede ler nada.

---

## 3 · Os seis pontos do diretor

**1 · «O mapa de pontos é tão pequeno que não serve.»** **Confirmado e medido.** 84 × 110,6 px, escala 0,14, pontos de 1,26 px a 4,27 px de distância média. **Medi ainda** que não há ampliação própria do mapa, e que a página se deixa ampliar com dois dedos porque o `meta viewport` não trava a escala, o que não resolve nada de útil. **Não confirmei** nenhuma reação ao toque: nem no ponto, nem no meio do mapa, nem em Évora, o endereço ou o conteúdo mudam.

**2 · «Um não faz nada, e o outro abre uma coisa que não é muito útil.»** **Confirmado, com uma correção ao diagnóstico.** Os dois botões fazem alguma coisa. «Abrir um concelho →» faz aparecer a pesquisa e depois rola 131 px para lá dela, e é por isso que parece não fazer nada (B1); a prova é o toque real, não o clique de rato. «Ver uma região →» abre a régua, e a régua é ilegível (B4) e apaga o mapa (C1). Portanto: o primeiro **parece** não fazer nada por um erro de rolagem, e o segundo abre de facto uma coisa pouco útil, e ainda tira uma que era útil.

**3 · «A escala (a régua) por baixo: avaliar se vale a pena.»** **Medi o que ela é hoje:** seis leituras (Portugal 82, Grande Lisboa 129, Península de Setúbal 55, Algarve 89, Madeira 88, Alentejo 77), todas «provisório», numa banda de 354 × 97 px; entra fechada numa dobra; e no estado em que o comando a abre os rótulos colidem em quatro pares medidos. **Não confirmei** que ela responda à pergunta do comando que lhe chama: chama-se «Ver uma região» e nenhuma das seis leituras é de um concelho, e três das seis regiões de Portugal não estão lá. Não proponho aqui o que fazer, como o brief manda.

**4 · «Não percebo o que significam os treze indicadores, o painel social e mais indicadores.»** **Confirmado.** C6 acima. **Medi** que a única frase de contexto da primeira página está no oitavo ecrã do telemóvel, dentro do painel social, e que nem o Procedimento dos Desequilíbrios Macroeconómicos nem a origem dos limiares são explicados em lado nenhum da primeira página. Há uma ligação para `/metodo`, mas só no menu e no pé.

**5 · «Ao tocar em Évora ou Lisboa no mapa, devia passar ao conteúdo desse concelho.»** **Confirmado, e com a prova de que falta pouco.** O mapa já sabe: cada ponto tem `data-caop` (o identificador da página) e o de Évora tem `data-pagina="sim"`. Ao passar o rato o sítio já mostra o nome («Évora · distrito de Évora»). O que não existe é o destino: nenhum `<a>` dentro do `svg`, `cursor: auto`, e o clique não muda endereço nem conteúdo. **Confirmei também a outra metade do ponto:** tocar no título «O Estado do País» leva de volta à primeira página, em todas as páginas e nas duas larguras.

**6 · «A estrutura por ministérios; hoje as coisas não estão aproveitadas para o conteúdo que já existe.»** **Não é um ponto que se confirme ou desminta com uma medição**, e não invento uma. O que **medi** e que o sustenta: existem 12 trabalhos e 16 edições no arquivo, 136 afirmações no livro-razão e uma página de concelho com substância real, e a primeira página oferece três portas («Municípios», «Estudos», «Agenda») e uma ligação solta para o livro-razão; a de Évora, que é onde o conteúdo está, só se alcança em 20 ecrãs de lista ou escrevendo o endereço. O conteúdo existe e a primeira página não lhe abre caminho.

---

## 4 · O que funciona bem

* **A escrita.** «Corrigir em silêncio é a forma mais barata de mentir», o parágrafo de abertura do livro-razão, a página `/sobre` inteira e a `/a-verificar` inteira são texto que respeita o leitor e não se explica a si próprio.
* **A página de uma linha do livro-razão.** `/livro-razao/divida-publica-2025` é o sítio a fazer exatamente o que promete: um número, quem o publicou, onde, quando foi lido, e o texto de onde saiu, em 1,95 ecrãs no computador.
* **O comando de língua.** Leva à página equivalente nos dois sentidos, com os segmentos do endereço traduzidos, e volta ao ponto de partida. Poucos sítios bilingues fazem isto.
* **A robustez.** Zero transbordo horizontal em 17 páginas × 3 larguras, zero erros de JavaScript, zero recursos em falha, e nada que parta entre 1024 e 1280.
* **A leitura do mapa ao passar o rato.** A ideia está certa e já lá está; falta-lhe um espaço e um destino.
* **O contraste.** 6,24:1 no pior par. A constituição da casa não impede ler nada, nem no texto de 9,5 px.
* **A página de erro.** Devolve mesmo 404, tem uma frase honesta e três saídas.
* **A dobra do `/metodo`.** Dez regras numeradas, a primeira aberta, as outras fechadas: é a melhor solução de densidade do sítio, e está numa página secundária.
* **O `claro`/`escuro` e o `MENU` do telemóvel.** Funcionam, e o menu tem alvos de toque de tamanho certo.

---

## 5 · O custo

Não tenho leitura direta do contador. Pelo que vejo do que passou por mim: cerca de **1,0 a 1,2 milhões de símbolos de entrada** (dominados por 30 capturas lidas como imagem, que são a maior parte do custo, mais os resultados das medições) e cerca de **35 a 40 mil de saída** (os detetores, os guiões de percurso e este relatório). Foram 17 páginas × 3 larguras, 116 capturas guardadas, 4 detetores escritos e 3 corrigidos depois de darem vazio, e cerca de 40 execuções do Playwright.
