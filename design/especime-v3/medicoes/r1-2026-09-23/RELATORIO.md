# R1 · O lado do leitor depois da leitura de fora

Construtor: Claude Opus 5.5, 23.09.2026, na worktree `r1-2026-09-23` do sítio, sobre `main` em `cbe87016`, e na worktree `r1-2026-09-23` do motor, sobre `master` em `1253605`.\
Brief: `design/observatorio/BRIEF-R1-o-lado-do-leitor-depois-da-leitura-de-fora.md` e o prompt do lugar de direção de 23.09.2026, com as notas que chegaram a meio (o nome do modelo, e a secção da amarra do Método, que é a §1.126).\
Nenhum número deste relatório se escreve de cabeça: sai de `medir.py`, que corre sem argumentos na raiz do sítio, escreve `medidas.json` ao lado e sai com código diferente de 0 se uma entrada faltar, um resumo não bater ou uma conferência falhar. O `conferir-relatorio.py` sobre este ficheiro e esta pasta está a zero faltas, e a saída é `conferir-relatorio.txt`.\
**O nome do modelo.** Os commits do motor `59c8621`, `6427f4d` e `c257f67` levam no trailer «Claude Opus 5», o nome que o prompt dava; o modelo foi o mesmo em todos os commits dos dois ramos, o Claude Opus 5.5, e o nome certo está no trailer de `abac640` e de todos os commits do sítio. Os símbolos desta corrida são os que a ferramenta reporta ao lugar de direção no fim dela; o construtor não os lê de dentro.\
**A passagem de correção.** Depois da leitura a frio do mesmo dia, uma passagem de correção fechou os achados que o lugar de direção aceitou, no sítio e no motor: está na secção 21, com a tabela das plantas da secção 14 posta em dia. Desde essa passagem o `medir.py` lê o sítio na cabeça do R1, `bc68892b`, e não em `HEAD`: o lugar de direção acrescentou commits por cima, e ler `HEAD` mudava em silêncio números que descrevem essa cabeça.

**O que se repete a partir do ramo, e o que não** (`dependencias_externas` e `pacote` no `medidas.json`, com as chaves que dependem de cada coisa e onde se repetem). Cada número deste relatório depende de uma destas coisas:

- **O `dist/` inteiro**, construído a partir da cabeça do R1 (o código é o de `68b7944c`): os ficheiros HTML e os rótulos contados, os títulos de linha, a frescura dos cartões, as células dos portões e as plantas que correm sobre páginas construídas. Repetem-se numa árvore do sítio nessa cabeça, com `npm ci`, `npm run build` e o `medir.py`; sem construir, os registos dos três portões dessa cabeça estão guardados em `portoes/`, no ramo.
- **O git do sítio, com o histórico**: a cabeça, os commits, e os ficheiros lidos na cabeça do R1 e na de partida (a lista fechada, o livro-razão antes e depois, as mudanças declaradas, o calendário, o inventário). Repetem-se num clone com o histórico inteiro, por `git show <cabeça>:<ficheiro>`, como o guião do brief.
- **As cópias congeladas**: o antes do brief (as páginas de `paginas/` e o `BRIEF-R1.json`) e o depois do bloco (as 16 páginas de `paginas-depois/`, presas pelo sha256 do `INDICE.json`). Estão no ramo, nesta pasta. As de `paginas/` e o `BRIEF-R1.json` entraram no commit `cbe87016`, que é a base do ramo, e o `pacote.sh` copia só os ficheiros mudados entre a base e a cabeça: com a base do ramo, o pacote leva 0 dos 6 ficheiros de `paginas/` e não leva o `BRIEF-R1.json`; com a base `d4d4dcae`, o pai do commit do brief, leva os 6 e o `BRIEF-R1.json`. Foi por isso que a leitura a frio não os teve (secção 21, achado 8).
- **O git do motor**, que é privado: os commits, os trailers, as suites de saúde, o `core.gate` e a exportação, recolhidos por `recolher-motor.py` e `recolher-motor-correcao.py`, com as saídas em `motor/` e nesta pasta.
- **Um navegador sobre o `dist/`**: as capturas e a pesquisa, que se repetem numa árvore com o `dist/` e o Playwright, por `captar-r1.mjs` e `tests/acessibilidade/pesquisa.mjs`.

Quem tiver só o pacote não repete os números do `dist/`, do git nem do motor: lê as saídas guardadas.

## O que ficou feito

| # | O mandato | A medida, lida da construção nova (antes → depois) |
|---|---|---|
| `1` | A pesquisa dos lugares (I137) | o guião da pesquisa: 0 → 4 passagens verdes em 4; «mour» mostra 0 → 2 concelhos, Mourão entre eles; H15 verde, e vermelha com a planta |
| `2` | A habitação sem a média europeia, e a agenda (I138) | `cartao_da_habitacao_com_media_europeia` 1 → 0; as 2 frases falsas da agenda 1 → 0 e 1 → 0 |
| `3` | «O que mudou» na língua do leitor (I141) | mudanças com palavras do código: 1 em 2 pelo predicado do brief, 2 em 2 pelo da M4 → 0 em 3 pelos dois; M4 vermelha com a planta |
| `4` | A lista dos estudos (I144) | 13 entradas em cada edição, da mais recente para a mais antiga, 13 com lugar e tema; secção «Por lugar» 1 → 0 |
| `5` | O rótulo no topo (I145) | 7342 páginas com um `topo` e nenhuma com dois; 0 com `rodape`; 2 fichas da primeira página |
| `6` | As definições das empresas (I142) | sigla por verificar 2 → 0; o excerto da origem igual ao rótulo da resposta do Eurostat, byte a byte |
| `7` | O espaço no título do recibo (I143) | pares colados 1 → 0 no recibo de Mourão; 0 em 5956 títulos de linha |
| `8` | A cor de estado (I139) | temas 0 → 26 classes; primeira página 0 → 0, porque não tem cartão nenhum com valor de referência: **o brief engana-se aqui, e parei neste ponto** (§8) |
| `9` | A frescura nos cartões de concelho (I146) | 278 páginas de concelho com a frase em cada edição; Mourão: «(a fonte já publicou julho de 2026; lido a 01.09.2026)» |
| `10` | O Portal BASE caído (I140) | `core.gate` PASS no motor; 0 pedidos ao Portal BASE; a frase nova 1 e 1 nas duas páginas do Método |
| `11` | A notificação do INE no estudo 13 (I147) | 3 linhas; `dominios_test` 35 de 35 defeitos vistos; 6 recibos no sítio |
| `12` | A leitura do país com as duas leituras (§1.124) | as 2 linhas do INE seladas em cada edição, com a data 23.09.2026 selada ao `published_at` |
| `13` | Este relatório | `conferir-relatorio.py` a zero faltas |
| `14` | As capturas | 34 antes e 34 depois, nas cinco larguras, com o manifesto escrito depois das asserções |

## 1 · A pesquisa dos lugares

No ramo da fila de `public/js/municipios.js` (a página dos lugares, `/lugares`), a lista dos resultados abre-se quando há texto no campo e fecha-se quando não há; o envio do formulário deixa de recarregar a página, e com um só resultado visível abre a página desse concelho. Sem guião a página continua a ter as duas listas.

O guião de medida é um só, `tests/acessibilidade/pesquisa.mjs`, e correu igual antes e depois, nas duas edições, a 390 e a 1280 px (`pesquisa-antes.json`, `pesquisa-depois.json`, e as saídas `.txt`). Antes: 0 passagens verdes em 4, «mour» com 0 resultados à vista, e o `Enter` a sair da página com vários, com nenhum e com um. Depois: 4 em 4, «mour» com 2 à vista e Mourão entre eles, o `Enter` fica com vários e com nenhum, e «mourao» mostra 1 e o `Enter` abre Mourão. O contador do brief (`pesquisa_enter_recarrega`) passa de 0 a 1 `preventDefault(` no ramo da fila.

A célula H15 do `check:alvos` corre o mesmo guião dentro da régua e exige a ligação visível para Mourão com «mour» escrito. O estrago `lista-escondida` tira do guião servido a linha que abre a lista (um terceiro canal de estrago, o guião, ao lado do HTML e do disco): a H15 cai, e é a única que cai (`alvos-plantas-r1.json`).

**Uma coisa que a leitura de fora disse e que a medida não confirma.** O seu §3 dizia que a frase «Nenhum concelho» também ficava escondida; no antes ela via-se em 4 passagens de 4. O que estava partido era a lista e o `Enter`.

## 2 · A habitação e a agenda

O corte mais estreito que a medição encontrou é a régua do cartão (`ReguaDoCartao.astro`): a média da União chega ao cartão por ela e por mais nenhuma porta, e a declaração da medida em `figuras.mjs` passa a dizer `semMediaEuropeia`, com a decisão e a razão. Medido nas cópias congeladas da construção nova com o predicado do brief: 0 cartões da sobrecarga com a média na primeira página e 0 nos temas; os outros 13 cartões da primeira página continuam com a média. A K14 do `check:cartao` viu 6 cartões da medida calados e fecha se a média voltar; a prova do cartão plantou 12 estragos e viu 12.

As duas frases falsas da nota da agenda corrigiram-se na fonte, no motor (commit `c257f67`), e reexportaram-se com `python3 publisher/export_agenda.py --destino <a worktree do sítio>/src/data`: «a primeira página já diz» e «não publica hoje a média europeia» passam de 1 a 0 em `src/data/agenda.json`, e a frase nova da ressalva está 1 vez no ficheiro e 1 vez na página da agenda. A exportação é de uma peça e trouxe o calendário do motor tal como estava: 16 → 17 eventos, 1 novo, 4 com campos mudados, 0 saídos, e a chave `saidas` nova. O evento novo (`ine-estatisticas-do-emprego-t3-2026`, do commit `283aca9` de 04.09.2026 no motor) tem um excerto que começa pela marca «[verify]» do próprio motor, e a página da agenda rende-a 1 vez como se fosse texto da fonte. O ficheiro de origem é `indicators/calendar.json`, que é de outras corridas e que este bloco não toca: fica na dívida.

## 3 · «O que mudou» na língua do leitor

As 2 mudanças declaradas deixam de dizer «recibos» e «cartões», nas duas edições. A de 21.09 diz «Sete nomes de indicadores do INE deixaram de aparecer ao lado dos valores». A de 22.09 guarda a primeira frase que já tinha (o título do quadro do Eurostat e a série que ele publica) e troca a frase sobre o excerto e o pedido das linhas, que era a máquina a falar, por «As definições de quatro medidas passam a dizer o grupo etário que medem, nas duas edições». A célula M4 do `check:pais` recusa «recibo», «cartão», «livro-razão», «excerto» e «linha» (e as inglesas) nos textos declarados, com um conhecido-positivo em cada corrida; medido com o mesmo detetor, as mudanças com palavras do código eram 2 em 2 no antes e são 0 em 3 hoje; com o predicado mais estreito do brief («recibos» ou «cartões»), 1 em 2 e 0 em 3. A planta escreve «saíram dos recibos e dos cartões» num texto e a M4 fica vermelha.

## 4 · A lista dos estudos

Uma lista só, dos 13 estudos, pela data de `datas-de-publicacao.json` e, num empate, pela ordem do arquivo; cada entrada diz o lugar e o tema, e 6 são de Évora. Medido nas páginas construídas das duas edições: 13 entradas, as datas sempre a descer, 13 com lugar e tema, 0 secções «Por lugar» e 0 contagens por lugar. As chaves `estudos_lugar_*` continuam na prova e o `gate:html` continua a recontá-las contra a secção dos trabalhos de cada lugar, mas já não se rendem em página nenhuma (dívida).

As células que conheciam a forma antiga mudaram de forma, cada uma com planta: a E2 do `check:pais` (a ordem trocada; a secção de volta); a lista fechada do `voz-b1`, que passa a conferir cada sinopse inteira pela conta da primeira página, porque as leituras de Évora trazem sufixos da leitura («€») e referências («2021–2025») que a conferência por unidade não conhecia (uma palavra trocada numa sinopse de Évora); o `check:lugar`, que passa a contar todas as entradas da lista e a exigir cada estudo alcançável da lista (uma entrada a menos); e a H2 do `check:alvos`, que conta os selos das sinopses da lista à parte, como os das páginas de lugar (o estrago tira a classe da sinopse, e a H2 cai).

## 5 · O rótulo de IA no topo

`Base.astro` rende o rótulo como a primeira coisa do `<main>` de todas as páginas construídas, e a página de estudo deixa de o render por conta própria. O rodapé guarda a ficha da primeira página e perde o rótulo; o texto do rótulo não muda. Medido no `dist/`: 7360 ficheiros HTML, 7342 com exatamente um `topo`, 0 com mais de um, 0 com `rodape`, e 2 fichas; os 18 sem rótulo são, todos, os documentos alojados, que se servem byte a byte e não passam pela `Base.astro`.

**A regra que a primeira página obrigou a escrever.** A primeira página de cada edição tem o seu `<h1>` no cabeçalho, antes do `<main>`: «antes do título» não se podia exigir ali. A célula do `gate:html` exige um `topo` em cada página, 0 `rodape`, o rótulo dentro do `<main>`, como primeiro elemento dele e antes do `<h1>` que ele tenha; a H14 do `check:alvos` mede o mesmo em todas as famílias e larguras. Plantas: o rótulo de volta ao rodapé numa página de tema; o rótulo depois do título numa página de concelho. A L1 do `check:lugar` dispensa a porta do rótulo pelo destino exato e só dentro dele, como já dispensava a do marcador; a planta põe duas portas para a política fora do rótulo e a catraca sobe acima do teto. Capturas do topo a 390 px, antes e depois, da primeira página e de Mourão.

## 6 · As definições das empresas

A dívida das empresas e o fluxo de crédito às empresas escrevem «sociedades não financeiras» e «non-financial corporations», sem a sigla e sem o marcador. A prova é uma origem nova em `figuras.mjs`, `eurostat-tipspd30`: a resposta do Eurostat ao pedido da linha `divida-das-empresas-2024`, lida pelo cliente da casa no motor (`core.http.for_source` da fonte `eurostat`), com HTTP 200, 6440 bytes e o sha256 `dcfb381f…` iguais no registo do pedido e na cópia guardada em `motor/`. O rótulo da resposta é «Non-financial corporations debt, consolidated - % of GDP», e o excerto da origem é-lhe igual, byte a byte; o setor da resposta é S11, «Non-financial corporations». Nenhum valor muda. A planta das glosas da K6 usava o marcador desta definição, que já não existe, e passou a pôr um marcador na declaração em memória, só durante a prova.

## 7 · O título do recibo

Um espaço entre o valor e a unidade no texto do `<h1>` de `LinhaView.astro`; o desenho não muda. Com o padrão do brief: 1 → 0 pares colados no recibo de Mourão, e 0 em 5956 títulos de linha das duas edições. A célula nova do `gate:html` exige o espaço em todas as páginas de linha e fecha se não conferir título nenhum; a planta tira o espaço do título do recibo de Mourão.

## 8 · A cor de estado, e o ponto em que o brief se engana

O item da referência da régua do cartão ganhou o quadrado do estado e a palavra pintada, com as classes da página europeia e o estado de `estadoDaMedida()`; nenhuma palavra mudou. As regras das classes passaram de `inicio.css` para `site.css`, iguais. Com o predicado do brief nas cópias da construção nova: temas 0 → 26 classes (13 referências pintadas, 13 quadrados e 13 palavras), página europeia 39 → 39.

**A primeira página continua a 0, e não é defeito.** Medido nas cópias do antes e do depois: a primeira página tem 19 cartões, e nenhum é de uma das 13 medidas que declaram um valor de referência (essas vivem nos temas, onde são 13 de 35); a primeira página tem 0 itens de referência e 0 vezes «valor de referência». A medida 8 do brief pedia `cor_de_estado_na_primeira_pagina` acima de 0 e o mandato pedia a cor nos cartões com referência da primeira página; como não há nenhum, a primeira metade não se pode cumprir sem pôr cartões novos na primeira página, que o brief não manda e que mudava palavras de cartões. Parei nesse ponto. A célula T9 do `check:pais` confere as duas páginas: cada cartão com referência com a cor certa, calculada pela célula a partir da linha e do limiar declarado, e nenhum cartão sem referência com cor; se um cartão com referência aparecer na primeira página, a T9 exige-lhe a cor. Planta: um cartão fora pintado de dentro, nos temas. A régua do contraste (`contraste-depois.txt`) diz o que dizia, porque a paleta não mudou: 0 falhas de texto e 4 objetos de interface abaixo de 3:1, os que a nota do quadrado explica.

## 9 · A frescura nos cartões de concelho

Quando o período que a fonte já publicou (`src/data/frescura.mjs`, pela mesma conta que o recibo faz) é mais recente do que o da linha, o cartão diz, ao pé do período, «(a fonte já publicou julho de 2026; lido a 01.09.2026)», e na edição inglesa «(the source has already published July 2026; read on 01.09.2026)». O período e a data levam marca própria. Medido no `dist/`: 278 páginas de concelho com a frase e 30 sem, em cada edição. A F17 do `check:formas` refaz a conta com a sua própria regra de pertença à série e exige a frase quando há atraso e nenhuma quando não há. Plantas: a frase num cartão sem atraso; a frase que falta num cartão atrasado.

## 10 · O Portal BASE

No motor (commit `59c8621`): o registo marca `portal_base` caído a 2026-09-16, com a razão e sem identidade de navegador; `core/http.py` recusa uma fonte caída antes de haver cliente; as conferências de saúde dizem a queda sem pedido nenhum; e o cruzamento dos concelhos passou a ler a Carta dos 308 do estudo 12 e o PRR, sem o Portal BASE. As suites de saúde na cabeça final do motor: o núcleo 5 de 5, e o `pt_public_money` 17 de 17. Nas corridas anteriores, o núcleo deu uma vez 4 de 5 por um tempo de espera na CORDIS, que não é do Portal BASE, e o `pt_public_money` deu 16 de 17 na primeira corrida numa worktree nova, por falta do índice que o modo rápido pede; as saídas estão todas nesta pasta. 4 plantas no motor, e as 4 morderam com os bytes repostos: a identidade de navegador de volta, a queda apagada do registo, o cliente sem recusa, e a saúde do núcleo com a identidade de volta.

No sítio, a frase do limite da regra 1 do Método passa a dizer que nenhuma fonte é lida com a identidade de um navegador e que o Portal BASE deixou de ser fonte a 16.09.2026: 1 vez em cada edição da página do Método, e a frase antiga 1 → 0 no ficheiro. A amarra entra em `DECISIONS.md` como §1.126, com `**Afecta:** metodo` e `**Texto:** metodo 5af8e4efe6a0`; a prosa da entrada é do lugar de direção.

## 11 · A notificação do INE no livro do estudo 13

3 linhas no motor (commit `abac640`), pelo construtor dos domínios, com os controlos declarados antes da leitura: a dívida de 2025 (89,2), a de 2024 (93,0) e o saldo de 2025 (0,7), em % do PIB, publicadas a 2026-09-23. **O excerto é o da página do destaque, e não o do PDF**: a camada de texto do PDF não traz as letras maiúsculas A e U, em todos os extratores tentados, e a frase ficava ilegível; o PDF fica alojado com o sha256 no `MANIFEST.sha256` e é o controlo das mesmas frases. A nota de cada linha diz que a notificação é a segunda de 2026 e provisória, e que o quadro do Eurostat só muda a 21.10.2026. O `dominios_test` viu 35 de 35 defeitos, com os novos desta página entre eles; o ensaio do construtor tem 17 controlos que batem. O PREREG do motor recusou as 3 no nível A, porque os critérios selados dele nomeiam as linhas nacionais desse nível; ficaram no nível B.

A travessia para o sítio: o ensaio da exportação deu 3 novas, 0 alteradas e 314 inalteradas; a escrita registada, depois da mudança de nível, deu 0, 0 e 317, porque as 3 já estavam escritas e o nível não atravessa. O registo do cruzamento passa de 314 a 317 linhas, e nas outras 314 muda só o `rh_ledger_sha256`. O exportador ganhou o campo `published_at`, com a regra V19 e os seus casos no teste. As 3 linhas têm 6 recibos no sítio.

## 12 · A leitura do país e a mudança declarada

A frase do lugar de direção, nas duas edições, com as 8 linhas que cita seladas pela ordem da frase, 2 delas do INE. **2 decisões sobre o texto dado.** A data «23 de setembro de 2026» escreve-se na forma da casa, 23.09.2026, e sai do campo `published_at` da linha do INE, porque a regra das datas é uma só (§1.91) e um algarismo do sítio tem de ter origem; o ano entre parênteses sai do `reference_date` da linha de 2024 do INE. A lista fechada `LINHAS_DA_LEITURA_DO_PAIS` e a guarda da leitura passam de 7 a 9 linhas, e a construção pára se as duas se separarem. A L2 do `check:pais` exige as linhas pela ordem e a data tal como a linha a publica (planta: outra data); o `voz-pais` confere a frase inteira.

A mudança declarada de hoje diz que o INE reviu a dívida de 2025 para o valor selado à sua linha (89,2 na primeira página), que a leitura passou a dizer as duas leituras oficiais e que o valor do Eurostat muda a 21.10.2026; está 1 vez em cada edição da primeira página e 1 vez no registo. O `gate:html` compara o texto declarado com o texto rendido sem os selos (planta: o valor trocado).

## 13 · As capturas

`captar-r1.mjs`, o mesmo antes e depois, nas cinco larguras (390, 768, 1024, 1280 e 1600 px) das páginas tocadas: a primeira página, os temas, os lugares com «mour» escrito, um concelho (Mourão), um recibo (o desemprego registado de Mourão) e a lista dos estudos, mais o topo a 390 px da primeira página e de Mourão. São 34 antes e 34 depois, em `capturas/`, com o manifesto (`capturas-antes.json`, `capturas-depois.json`) escrito só depois das asserções: nenhuma página com deslocamento lateral; na página dos lugares, «mour» com 2 resultados à vista em todas as larguras (eram 0); e o rótulo no topo 1 vez em todas as capturas do depois (eram 0). A asserção do topo do depois passou a ser a do `gate:html` (primeiro do `<main>` e antes do título do `<main>`), por causa da primeira página; a medida do documento inteiro fica no manifesto com o nome que tinha no antes.

## 14 · As plantas, todas

| Onde | Plantas | Morderam |
|---|---:|---:|
| `tests/pais/pais.mjs` (o `check:pais`; 5 delas deste bloco: M4, T9, E2 duas vezes, L2) | 31 | 31 |
| `tests/pais/portoes.mjs --prefixo r1-` (o `gate:html`, o `check:formas`, o `check:lugar` e o `check:voz`) | 9 | 9 |
| `tests/acessibilidade/alvos.mjs --vermelhos` (H15 e H2), com 13 células verdes antes de cada uma | 2 | 2 |
| `tests/cartao/cartao.mjs --prova` (a K14 entre elas) | 12 | 12 |
| `plantar-motor.py` (o motor) | 4 | 4 |
| `plantar-motor-correcao.py` (o motor, passagem de correção, achado 4) | 7 | 7 |
| `plantar-medir.py` (o `medir.py`, passagem de correção, achado 3) | 2 | 2 |
| `tests/pais/portoes.mjs --only r1-rotulo-dobrado` (o `gate:html`, passagem de correção, achado 6) | 1 | 1 |

Cada planta dos portões repõe os bytes e guarda os dois sha256 (9 ficheiros, 9 repostos; e 1 reposto na planta do rótulo dobrado); as saídas estão em `planta-r1-*.log`, `plantas-pais.json`, `plantas-portoes-r1.json`, `plantas-portoes-r1-rotulo-dobrado.json`, `alvos-plantas-r1.json`, `cartao-prova.txt`, `plantas-motor.json`, `plantas-motor-correcao.json` com `planta-motor-correcao-*.txt`, e `plantas-medir.json` com `planta-medir-*.txt`. Os 2 ficheiros brutos das corridas do `check:alvos` não entram no repositório, porque trazem o caminho da máquina; `alvos-plantas-r1.json` guarda o que deles se lê.

## 15 · A catraca L1

A L1 do `check:lugar` subiu de 2271 para 2279 páginas, e a razão é medida e inteira (`medir-l1-r1.mjs`, `l1-r1.json`): entraram 8 páginas e não saiu nenhuma. 6 são as páginas das 3 linhas do INE, nas duas edições, com o par que a família `linha` já tinha (a porta da regra da releitura ao lado da porta do Método no rodapé do aparelho); 2 são as listas dos estudos, onde as sinopses de 2 estudos de Évora citam a mesma linha (`evora-prazo-medio-de-pagamento-2025`, ×2), como já acontece na página de Évora. O teto está no registo dos tetos, com a razão escrita ao lado.

## 16 · O inventário das frases

A secção nova do bloco tem 8 cadeias vivas, e uma frase retirada a 14.09.2026 voltou a viva no seu lugar (a definição portuguesa da dívida das empresas, agora com fonte): 9 linhas vivas com o bloco `r1`. Ficam 8 retiradas com a razão (as 4 definições com a sigla, «Por lugar» e «By place», e a leitura antiga nas duas edições), e as 2 linhas das contagens do livro-razão mudam de número, de 2975 para 2978, como o P2 fez. A entrada `r1` da revisão do inventário está por ler pelo lugar de direção.

## 17 · Dívida declarada

- **O recibo da sobrecarga continua a mostrar a média da União no enquadramento** («União Europeia 7,7» ao lado do período anterior), porque o brief cortou o cartão e deixou a linha da União no livro-razão e no seu recibo. Se o enquadramento do recibo português também a deve calar até ao B2, é decisão do lugar de direção.
- **O evento do calendário com a marca «[verify]» no excerto**, trazido pela exportação da agenda e rendido na página da agenda (§2). Fecha-se no `indicators/calendar.json` do motor, que este bloco não toca. *Fechada depois pelo lugar de direção (secção 21, achado 1).*
- **`tests/inicio/rotulo.mjs` mede ainda o rótulo do rodapé.** É uma régua de navegador que não está em cadeia nenhuma do `package.json`; o `gate:html` nomeia-a nos seus comentários como quem apanha um rótulo escondido por folha de estilos, e quem o apanha agora é a H14, em todas as famílias. As regras `.rotulo-ia-rodape` de `site.css` ficaram sem uso. *Fechada depois pelo lugar de direção, no commit `fb05b52e`: a régua e as regras saíram, e os comentários do `gate:html` que as nomeavam passaram a nomear a H14.*
- **As chaves `estudos_lugar_*` da prova** não se rendem em página nenhuma desde que a secção «Por lugar» saiu.
- **Uma data de leitura no cartão e outra no recibo, para a mesma linha de Mourão**: o cartão diz «lido a 01.09.2026» (quando se leu o período da fonte) e o recibo diz «lido a 26.08.2026» (quando se leu a linha). Estão as duas certas, e um leitor pode confundi-las; o B3 (o recibo para pessoas) é o sítio para as alinhar.
- **O mapa do repositório**: 8 das citações dele andaram com este bloco, e `conferir-mapa.txt` diz para onde; o mapa é do lugar de direção. *Posto em dia depois pelo lugar de direção, no commit `fb05b52e`.*
- **A mensagem do commit da cor de estado** diz que a primeira página e os temas não tinham cor nenhuma, o que é verdade, sem dizer que a primeira página não tem cartões com referência; o §8 diz-o.

## 18 · O motor: o ramo, os commits, e o que o lugar de direção aterra

*Nota da passagem de correção: estes commits já aterraram em `master`, rebaseados, e a secção 21 diz com que resumos.*

Ramo `r1-2026-09-23`, sobre `master` em `1253605`, cabeça `abac640`, 4 commits e 28 ficheiros (2759 linhas acrescentadas, 309 tiradas); `python3 -m core.gate` PASS, código 0, na cabeça (`motor/core-gate-final.txt`), e em cada commit pelo pre-commit.

- `59c8621` O Portal BASE cai no motor: a fonte marcada caída a 16.09.2026, e nenhum pedido sai (9 ficheiros)
- `6427f4d` A resposta do Eurostat ao pedido da dívida das empresas, guardada com endereço, hora, cliente e sha256 (2 ficheiros)
- `c257f67` A nota da habitação na agenda diz o que é verdade (1 ficheiro)
- `abac640` A 2.ª notificação de 2026 do INE entra no livro do estudo 13: três linhas datadas, e a data de publicação que atravessa (16 ficheiros)

**Para aterrar o motor:** `git merge --ff-only r1-2026-09-23` em `master`, se `master` ainda estiver em `1253605`. Se o M4b aterrar primeiro, o ramo rebaseia-se sobre o `master` novo, o `core.gate` corre-se na cabeça rebaseada, e publica-se num ramo novo. Numa worktree nova do motor, o `export_site_rows_test` do pre-commit pede as caches `snippets.json` dos verticais, que o `.gitignore` manda copiar da árvore principal. Os ficheiros que este ramo muda estão no `git diff --stat` de `1253605..abac640`; nenhum é dos de outras corridas.

**Para aterrar o sítio:** completar a prosa da §1.126 (as linhas `**Afecta:**` e `**Texto:**` ficam como estão); aterrar primeiro a mudança ao Sobre da §1.125, rebasear este ramo sobre o `main` novo (em `DECISIONS.md` as duas entradas ficam pela ordem, antes do «### 4.1»), correr os três portões e a corrida `portão` na cabeça rebaseada e publicá-la num ramo novo, e só então `git merge --ff-only`, o `push`, a Vercel vigiada e o `verify:deploy`. O motor aterra antes do sítio, para que as origens que os registos do cruzamento apontam existam no `master`. A entrada `r1` da revisão do inventário está por ler.

## 19 · Os commits do sítio

Do mais antigo para o mais recente, sobre `cbe87016`:

- `8982a767` R1 (I137): a pesquisa dos lugares mostra a lista ao escrever, e o Enter só abre com um resultado
- `3cb9ede5` R1 (I138): o cartão da sobrecarga da habitação deixa de mostrar a média europeia, e a nota da agenda diz o que é verdade
- `fc057d1e` R1 (I141): as mudanças declaradas do projeto na língua do leitor, e a célula M4 que recusa a do código
- `5d7d57b6` R1 (I144): a lista dos estudos é uma só, do mais recente para o mais antigo, com o lugar e o tema em cada entrada
- `47e9f952` R1 (I145): o rótulo de IA no topo de todas as páginas, uma vez, e fora do rodapé
- `cdbc914a` R1 (I142): as duas definições das empresas escrevem «sociedades não financeiras», provadas pela resposta do Eurostat
- `4b7a5faa` R1 (I143): no título do recibo, o valor e a unidade com um espaço entre si no texto da página
- `fc830a07` R1 (I139): os cartões com valor de referência rendem a cor de estado que o Método promete
- `e5e60b8c` R1 (I146): o cartão de um concelho diz, ao pé do período, que a fonte já publicou um mais recente
- `d7a39ffe` R1 (I140): o Portal BASE deixa de ser fonte no Método, pela decisão de 16.09.2026 que o motor executou
- `4ee0d9ef` R1 (I147): as três linhas da 2.ª notificação de 2026 do INE atravessam do livro do estudo 13
- `a1f90a17` R1 (§1.124): a leitura do país diz as duas leituras oficiais da dívida, e «O que mudou» regista-o
- `34e46d71` R1: a catraca L1 sobe de 2 271 para 2 279 páginas, medida página a página
- `68b7944c` R1: o inventário das frases e a sua entrada na revisão, para os mandatos 2, 4, 6, 9, 11 e 12
- o commit das medições, deste relatório e das capturas, que é a cabeça onde os três portões correm

Os ficheiros partilhados por vários mandatos (`check-pais.mjs`, `gate-html.mjs`, `alvos.mjs`, os dois ficheiros de plantas e outros) foram encenados pedaço a pedaço, cada pedaço no commit do seu mandato; um pedaço que servia dois mandatos entrou no primeiro que dele precisou (os auxiliares do texto declarado no commit da I141, que o diz; a importação de `FIGURAS` do `check:pais` no da I144; e os comentários de cabeça das plantas, que nomeiam todas as células do bloco). Os commits intermédios não foram construídos um a um: a construção inteira correu na cabeça com o código todo (`68b7944c`, código 0), e as plantas, as capturas e as medidas correram sobre essa construção. As saídas dos três portões na cabeça final, e a tabela delas, entraram no commit seguinte (§20).

## 20 · Os três portões na cabeça final

A cabeça sobre a qual os três portões correram: `717da1d6e3ae0acee63ec6aea9d74ab69fc89a9e`, no ramo `r1-2026-09-23`, sobre `main` em `cbe87016`; é o commit das medições e deste relatório, e o commit seguinte só acrescenta as saídas destes portões, a tabela e o `medidas.json` refeito. Cada portão correu no seu comando, com o código de saída lido de um ficheiro acabado de escrever e não de um `echo` atrás de um `|`, e os ficheiros `.codigo` apagados antes da corrida; ao lado de cada um ficam em `portoes/` o `.inicio`, o `.fim`, o `.cabeca` e o `.log`, este com o caminho da máquina tirado.

| Comando | Início | Fim | Tempo de parede | Código |
|---|---|---|---:|---:|
| `npm run build` | 2026-09-23T12:38:30Z | 2026-09-23T12:43:18Z | **4 m 48 s** | **0** |
| `npm run verify` | 2026-09-23T12:43:18Z | 2026-09-23T12:51:20Z | **8 m 2 s** | **0** |
| `npm run typecheck` | 2026-09-23T12:51:20Z | 2026-09-23T12:51:20Z | **0 s** | **0** |

O que as células deste bloco disseram nessa corrida: o `gate:html` contou 7342 rótulos no topo em 7342 páginas fora dos documentos alojados, 0 no rodapé e 2 fichas, e 5956 títulos de linha separados em 5956 páginas de linha; a T9 viu 26 cartões com referência nas duas edições, 8 fora e 18 dentro, cada um com a cor do seu estado; a F17 viu a frase em 278 cartões portugueses e 278 ingleses, de 278 e 278 atrasados; o `check:voz` leu 1158 linhas do inventário com bloco, 599 vivas e todas rendidas, 559 retiradas e nenhuma rendida; a H14 mediu 230 passagens com 0 partidas, e a H15 viu «mour» com 2 resultados à vista; a L1 está em 2279, com o teto em 2279; e a K14 viu 6 cartões com a média calada. No motor, o `core.gate` na cabeça `abac640` deu PASS, código 0 (§18).


## 21 · A passagem de correção, 23.09.2026

A leitura a frio do Codex (`gpt-5.6-sol`), com plantas só nas cópias do pacote, apanhou-as todas. Nos achados 2, 3, 5, 6 e 7, o que dizem do valor da dívida, do «% of GNP», do estado do cartão da dívida, da condição da célula do rótulo e do «288» eram as plantas das cópias, e nada disso está no ramo. O que sobrava, com a decisão do lugar de direção:

- **Achado 4 (bloqueante): o motor ainda podia mandar a identidade de um navegador.** Aceite. O Método diz que nenhuma fonte é lida com a identidade de um navegador, e o cliente da casa ainda tinha a constante do Chrome e as portas por onde ela saía. Medi primeiro quem as chamava, na base `1031258` (`motor/motor-correcao.json`, `portas.antes`): 5 chamadas `HttpClient(browser_ua=True)`, em 4 buscas do estudo `10`; 26 linhas de código com `for_source(`, das quais 14 passam `sources.get(...)` escrito ali, 7 passam uma variável lida do registo ou uma fixture posta nele, e 5 só nomeiam a função numa docstring; 8 chamadas com `user_agent=`, todas com um nome da casa; e 10 entradas do registo com a chave `browser_ua`, todas a `False`. No commit `ba016a4` a constante sai; `HttpClient(browser_ua=True)` levanta `IdentidadeDeNavegadorRecusada` com a decisão e onde ela está escrita (a do diretor de 16.09.2026, na §1.108 do registo do sítio, «Emenda de 16.09 de manhã», a decisão `(2)`, e a amarra do Método na §1.126); `for_source()` só aceita entradas do registo e recusa qualquer dicionário com a chave `browser_ua`, seja qual for o valor; a porta `user_agent=`, que aceitava qualquer cadeia, passa a aceitar só um nome da casa; e a exceção do registo para um `User-Agent` de quem chama sai. As buscas do estudo `10` passam ao nome da casa, com uma nota a dizer que os ficheiros que escreveram foram lidos com a identidade de um navegador. O `core/http_nome_test.py` ganha as provas: um cliente pedido com a identidade de um navegador, por `browser_ua=` e por `user_agent=`, e um `for_source()` com um dicionário de fora e com a chave, todos recusados sem pedido nenhum, e a mesma fonte, posta no registo, a chegar ao servidor local.

  **O que a medida encontrou além do achado, e o que decidi.** Havia 10 ficheiros de código do motor com o nome de um navegador, e 8 deles eram buscas dos estudos `03`, `04`, `05` e `06` que o mandavam pelo `requests` ou pelo `curl` por conta própria, sem passar pelo cliente: as portas fechadas não os viam, e a frase do Método continuava falsa enquanto eles existissem. Decidi fechá-los na mesma passagem, num commit separado (`b66c0fd`), para que o lugar de direção o possa desfazer sozinho se decidir outra coisa: passam ao nome da casa, importado de `core/http.py`, com a mesma nota; e a prova 12 do teste do nome varre os ficheiros de código que o git conhece, sem exceção nenhuma, com um conhecido-positivo para o detetor e outro para a lista dos ficheiros lidos. Na cabeça `b66c0fd`: 0 chamadas com `browser_ua=True`, 0 ficheiros de código com o nome de um navegador em 221 varridos, 0 entradas do registo com a chave; o teste do nome com 12 conferências, o `core.gate` a PASS com o código 0, e as suites de saúde a 5 de 5 e a 17 de 17. Não medi que anfitriões respondem ao nome da casa nas buscas que passaram a ele: nenhum pedido saiu, e as notas dizem-no. As 7 plantas do motor (`plantar-motor-correcao.py`) estragam uma linha cada (a recusa do cliente, a da porta `user_agent=`, as de `for_source()`, a dos cabeçalhos, a chave de volta ao registo, e o nome de um navegador de volta a uma busca do estudo `06`), e as 7 mordem, com os bytes repostos. A frase do Método fica como está.

- **Achado 3, a segunda metade: o `medir.py` registava a comparação da origem do Eurostat e não a usava.** Aceite. Passa a falhar quando o excerto da origem `eurostat-tipspd30` não é, byte a byte, o rótulo da resposta guardada, e quando o endereço da origem não é o do pedido cuja resposta está guardada. As 2 plantas (`plantar-medir.py`: o excerto a dizer «% of GNP», e o endereço de outro pedido) dão código 1 com a falha dita, e o `medidas.json` do bloco fica com o mesmo sha256; sem planta, o `medir.py` dá 0 falhas (`medir-saida.txt`). Para o poder correr outra vez sem mudar os números deste relatório, o `medir.py` passou a ler o sítio na cabeça do R1: em `HEAD` as mudanças declaradas já são 4, e não 3, pela do M4b. Com a cabeça presa, todos os valores do R1 saíram iguais aos que estavam.

- **Achado 6, a segunda metade: nenhuma planta punha dois rótulos numa página.** Aceite. A planta `r1-rotulo-dobrado` repete o rótulo da página dos temas ao lado dele, e o `gate:html` dá código 1 a dizer que a página tem 2 rótulos no topo e que tem de ter exatamente um, com os bytes repostos. Correu sobre uma construção da cabeça `697df9af`, com o `gate:html` a 0 antes dela, e está na tabela da secção 14.

- **Achado 8: os números que o pacote não deixa repetir.** Aceite como clarificação: a abertura deste relatório diz agora de que depende cada número e onde se repete. **E um ponto em que o pedido e a medida não batem.** O lugar de direção pediu que eu confirmasse que o pacote levaria as páginas congeladas de `paginas/`, e com a base do ramo não leva: os 6 ficheiros e o `BRIEF-R1.json` estão no ramo, mas entraram no commit `cbe87016`, que é a própria base, e o `pacote.sh` copia só os ficheiros mudados entre a base e a cabeça. Com a base `cbe87016` leva 0 dos 6 e não leva o `BRIEF-R1.json`; com a base `d4d4dcae`, o pai do commit do brief, leva os 6 e o `BRIEF-R1.json` (`pacote`, no `medidas.json`). Parei aqui e não mudei o `pacote.sh`: montar o pacote com essa base, ou copiar o antes à mão como o cabeçalho do guião já prevê, é do lugar de direção.

- **Achado 1: a marca «[verify]» no excerto de um evento da agenda.** A leitura apontou que a agenda publicava como prova um apontamento que o motor tinha escrito no lugar do excerto, sem o marcador da casa; é a dívida da secção 17. Fechou-o o lugar de direção depois do bloco: o excerto do evento das Estatísticas do Emprego do 3.º trimestre passou a ser o que o calendário do INE imprime, e a agenda foi reexportada sem a marca (commit `fb05b52e` no sítio; `d93af32` no motor, em `master` como `1031258`). Não refiz nada.

- **Achado 7, a segunda metade: o conferidor dos números vê a presença e não o sentido.** Fica dito, e não se corrige neste bloco. O `conferir-relatorio.py` confere que cada número do relatório está num ficheiro das medições, e não que mede o que a frase diz; a leitura provou-o com o «288», que encontrou o tempo de uma construção. O lugar de direção regista-o como melhoria a fazer: ligar cada número do relatório ao nome de uma medição citada na mesma frase, como o `check:briefs` já faz. O conferidor não mudou. Nesta passagem dei medição própria aos números novos que o podiam ter: o 8 das buscas dos estudos e o 4 das mudanças declaradas na cabeça saem de contas feitas para eles, e não de o número aparecer noutro sítio do ficheiro.

**Os commits desta passagem.** No motor, `ba016a4` e `b66c0fd`, no ramo `r1c-2026-09-23`, sobre `master` em `1031258`. No sítio, `715a364e` (as saídas e as plantas do motor), `748f2c2d` (o `medir.py` e as suas plantas), `661ccce0` (a planta do rótulo dobrado) e o commit deste texto, por cima de `fb05b52e` e `697df9af`, que são do lugar de direção. Os commits do R1 no motor aterraram em `master` rebaseados: `59c8621` como `79c745c`, `6427f4d` como `7dd57d1`, `c257f67` como `37e9691`, e `abac640` como `8b57c55`.

**Os portões.** Os três portões inteiros do sítio não os corri: corre-os o lugar de direção na cabeça final, depois de acrescentar os registos. Corri só as conferências que cada mudança toca: o pre-commit do motor em cada commit (o `core.gate`, e o `core.gate` outra vez na cabeça `b66c0fd`, guardado em `motor/core-gate-correcao.txt`); o `gate:html` sobre uma construção da cabeça `697df9af` (código 0), para a planta do rótulo dobrado; e o `medir.py`, com as suas plantas.
