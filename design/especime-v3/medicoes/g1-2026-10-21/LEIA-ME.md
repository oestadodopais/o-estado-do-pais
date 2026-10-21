# G1 · todos os gráficos com a interação do gráfico da inflação, ao rato, ao toque e ao teclado (21.10.2026)

*Construtor: Claude Opus 5.5 (a definição `construtor`), na worktree `g1-2026-10-21`, de `main` a39afdc3b. Mandato: `.claude/sessao-2026-10-19/MANDATO-GRAFICOS-opus-2026-10-21.md`. Nada no motor; nenhum número muda. Fecha a I230 para os desenhos que escondem valores; o resto fica declarado abaixo.*

## O que mudou para o leitor

- O gráfico da inflação da primeira página e as séries dos recibos (os desenhos com leitura, 50 nas duas edições) acendem o ponto ao toque, ao arrastar do dedo (o ponto mais próximo) e ao teclado (um só ponto na ordem do tabulador, o último; as setas, Início e Fim andam pelos outros; Escape fecha), além do rato, como antes. Um toque fora fecha a leitura.
- Na primeira página, o desenho da inflação saiu de dentro da ligação ao recibo: a ligação fica no nome e na unidade, e um toque no desenho lê o ponto em vez de abrir o recibo (G1-4).
- A faixa dos países de cada cartão (20 nas duas edições) mostra, ao toque, ao arrastar, ao rato e ao teclado, uma etiqueta com o nome, o período e o valor da marca mais próxima, posta junto à marca e confinada à janela nos dois eixos (desde a correção G1-b; antes só na horizontal). Antes só havia o `title` ao rato.
- Sem guião, cada ponto continua a dizer o período e o valor pelo `aria-label` (e, na série, pela etiqueta desenhada e pelo `<title>` do desenho).

## §0 · A medida de partida e a de chegada

Por `scripts/graficos-inventario.mjs` (comitado), sobre o `dist/` construído; os números estão em `medidas.json`, escrito por `medir.mjs` ao lado, com o comando e o conhecido-positivo de cada um. `inventario-antes.json` é o `dist/` de a39afdc3b; `inventario-depois.json` e `medidas.json` são o `dist/` de a743d51be.

| Medida | Antes | Depois |
|---|---|---|
| Desenhos no `dist/` | 2 863 | 2 863 |
| Desenhos que escondem valores e não os mostram ao toque (a I230) | 70 | 0 |
| Contagem estrita: desenhos sem leitura ao toque e sem valores escritos | 2 705 | 2 635 |

Por categoria (iguais antes e depois): 138 com os valores escritos no desenho, 90 com valores escondidos (50 séries com leitura, 20 faixas dos cartões, 20 faixas da página dos países), 2 510 escondidos aos leitores de ecrã (`aria-hidden`, os tapetes dos concelhos, as réguas e as barras da convergência), 68 sem algarismos (os mapas pintados, o sinal do país), 57 dentro do corpo de documentos de estudo (obra publicada).

A lista dos gráficos, por componente, está em `inventario-depois.json` (`componentes`, com as categorias, as páginas e as edições). Os que ficam na contagem estrita, com a razão:

- `svg.fc-tapete` (2 464, a faixa do concelho): escondido aos leitores de ecrã; os valores estão escritos no texto ao lado.
- `svg.mapa-svg` (60, os mapas dos distritos e da primeira página): cada área é uma ligação com o nome no `title`; não há valor no desenho, a legenda diz os cortes. Uma leitura ao toque pede um valor por área, que hoje não está no desenho: dívida G1-a.
- `svg.regua-svg` (26) e `svg.conv-barra` (20): escondidos; os valores estão no texto do cartão.
- `svg.pp-sinal` (4) e `svg.forma-mapa-svg` (4): o sinal do país e o mapa por concelho com a legenda fora; sem valores no desenho.
- Os 57 dos documentos de estudo: obra publicada, fora do sítio.

## §1 · A camada comum

- `public/js/interacao-dos-graficos.js` (sem dependências) e `src/styles/graficos.css`, carregados pelo `Base.astro` em todas as páginas, uma vez.
- Cada gráfico leva `data-grafico` (`serie`, `faixa`); cada ponto leva `data-grafico-ponto`, `data-grafico-periodo`, `data-grafico-valor`, `data-grafico-unidade`, `data-grafico-nome`, `data-grafico-leitura`, `role="img"`, `aria-label` e `tabindex`.
- Os componentes tocados: `SerieDoPais.astro` (os grupos da leitura), `FaixaDaUniao.astro` (as marcas; `faixa-da-uniao.mjs` passa a devolver os nomes, o valor e o período que a etiqueta já compunha), `BlocoDaPrimeiraPagina.astro` (G1-4).

## §2 · A régua e as plantas

`tests/graficos/interacao.mjs` (`npm run check:graficos`, no fim da cadeia do `verify`): G1 um desenho que esconde valores sem `data-grafico` é erro com o caminho; G2 os atributos, o papel, o `tabindex` e um só ponto na ordem do tabulador; G3 o valor e o período de cada ponto são o texto que o portão de HTML confere (o `[data-ponto]` e o `[data-ponto-periodo]` da série, o `title` da marca), e o `aria-label` e a `data-grafico-leitura` dizem essa mesma cadeia; G4 a página com gráficos carrega o guião uma vez. Na cabeça a743d51be: 9 143 páginas, 70 gráficos marcados, 10 612 pontos, código 0.

| Planta (`--plantar`) | Código | A queixa |
|---|---|---|
| `sem-marca` (o gráfico da inflação sem `data-grafico`) | 1 | G1 /index.html: um desenho de «SerieDoPais (com leitura)» esconde valores e não tem data-grafico |
| `aria-label` (o último algarismo trocado) | 1 | G3 /index.html: o aria-label diz «janeiro de 1992: 9,42 %» e o ponto diz «janeiro de 1992: 9,41 %» |
| `sem-guiao` (a página sem o guião) | 1 | G4 /index.html: a página tem 1 gráficos marcados e carrega o guião 0 vezes |

Portões que mudaram de forma, conservando o que protegem: o `check:formas` (F21, `tests/formas/serie-do-pais.mjs`) aceita os atributos do ponto e o papel `group` só no desenho marcado `data-grafico="serie"`; qualquer outro atributo continua a falhar, e as suas plantas deram 21 de 21 e 20 de 20 na corrida. O teste do bloco dos preços (`tests/inicio/serie-do-bloco.mjs`) lê a porta do recibo dentro da caixa `[data-bloco-serie]`, já não como antepassado do desenho; as plantas dele continuam a mover a caixa.

## §3 · Os portões, lidos dos ficheiros

| Corrida | Cabeça | build | verify | typecheck |
|---|---|---|---|---|
| `portoes.sh` 1 | 6ca4b2566 | 1 (o `check:voz`: mais de mil `aria-label` dos pontos por classificar; o portão listou uma parte e disse «e mais 1033») | 125 (não correu) | 0 |
| `portoes.sh` 2 | b853edb2f | 0 | 0 | 0 |
| `portoes.sh` 3 | a743d51be | 0 | 0 | 0 |
| `portoes.sh` G1-b 1 | 1abbd0745 | 1 (o F21 do `check:formas`: o `id` do título e a marca decorativa fora da lista dos atributos, 38 linhas no registo) | 125 (não correu) | 0 |
| `portoes.sh` G1-b 2 | b65ff8927 | 0 | 0 | 0 |

Os códigos e o `tempos.json` de cada corrida, sem os registos grandes: a terceira em `portoes/` (`cabeca`, `build.codigo`, `verify.codigo`, `typecheck.codigo`, `portoes.sh.codigo`, `tempos.json`), e as duas da correção G1-b em `portoes-b/corrida-1/` e `portoes-b/corrida-2/`, com os mesmos ficheiros. As corridas 1 e 2 do bloco não guardaram os seus ficheiros no repositório; os seus códigos acima ficam como relatados.

Na corrida 3, `check:graficos` deu código 0 dentro do `verify`. Antes das corridas inteiras: `npm run build` duas vezes (a de antes, para o inventário, código 0; a segunda parou no F21 do `check:formas`, código 1), `typecheck` duas vezes (0 e 0), `check:formas` e `check:graficos` uma vez à mão, e `medir.mjs` cinco vezes (cada uma corre a régua e as três plantas).

## §4 · As capturas

Duas páginas a 390 px nas duas edições pelo `captar.mjs`, que ganhou o campo `toque` (um `pointerdown` e um `pointerup` de tipo `touch` no centro do gráfico antes da captura; recusa se nenhum ponto acender). O manifesto (nomes, medidas, sha256, o ponto aceso e a etiqueta aberta) está em `capturas-390.json`; as imagens não entram no repositório e ficam para a pasta do bloco no Drive.

- Primeira página: aceso «janeiro de 2022: 3,34 %» (pt) e «January 2022: 3,34 %» (en), a etiqueta desenhada dentro do `<svg>`; documento de 390 px.
- `/emprego/` e `/en/employment/`, a faixa da taxa de emprego: aceso e aberto «França (definição diferente), 2025: 75,4» e «France (definition differs), 2025: 75,4», a etiqueta dentro do ecrã; documento de 390 px.

## §5 · As decisões

- **G1-1.** Os nomes do mandato (`data-ponto`, `data-periodo`, `data-valor`, `data-unidade`, `data-nome`) levam o prefixo `data-grafico-`: `[data-ponto]` já é a marca que o portão de HTML lê como origem de um valor de série (`scripts/gate-html.mjs`, a conferência do RP4-c) e `[data-nome]` é lido pelo mesmo portão; reutilizá-los punha um grupo inteiro a passar por valor.
- **G1-2.** A série mantém a sua etiqueta desenhada dentro do `<svg>` (o valor e o período que o portão de HTML confere ali); a camada comum acende um grupo de cada vez. A etiqueta comum, uma por gráfico, serve os desenhos sem etiqueta própria (as faixas).
- **G1-3.** Um só ponto por gráfico na ordem do tabulador, e as setas andam pelos outros, em vez de `tabindex="0"` em cada ponto: uma série mensal desde 1992 dava centenas de paragens do tabulador. O desenho com leitura passa de `role="img"` a `role="group"`, porque os filhos de uma imagem são apresentacionais e um ponto focável lá dentro é um erro de acessibilidade.
- **G1-4.** O desenho da inflação sai da ligação ao recibo (ver acima); sem isto, o toque que o mandato pede abria o recibo.
- **G1-5.** O guião vive em `public/js/` e carrega-se por `<script src defer is:inline>` no `Base.astro`, como os outros guiões do sítio, e não em `src/scripts/` como o mandato dizia.
- **G1-6.** A régua exige a marca nos desenhos que escondem valores, e não em todo o `<svg>` com dados: um desenho com os valores escritos, ou escondido aos leitores de ecrã com os valores no texto ao lado, não tem leitura nova a mostrar. A dívida declarada na régua é só a da página dos países (`FaixaDosPaises`, 20), que já tem os seus toques (`paises.js`) ao rato e ao toque e a lista dobrada para o teclado.
- **G1-7.** A leitura de cada ponto vai também em `data-grafico-leitura`, a cadeia que o guião mostra: o `check:voz` trata uma dica que repete um `data-*` do próprio elemento como dado e não como frase da casa (`scripts/medir-defeitos.mjs`, `dicasDaCasa`), e a régua confere que essa cadeia é o período e o valor do ponto.
- **G1-8.** A unidade vai vazia na faixa do cartão (o cartão di-la por cima) e o nome vai vazio na série (é o título do desenho).

## §6 · O que ficou aberto

- **G1-a.** Os mapas (`svg.mapa-svg`, 60): leitura do valor de cada área ao toque. Pede um valor por área no desenho, que hoje não existe.
- **G1-b.** A página dos países (`FaixaDosPaises`, 20) passar à camada comum, com teclado, retirando os toques próprios de `paises.js`.
- **G1-c.** Na edição inglesa, os valores dos pontos saem com a vírgula decimal («3,34 %»); vem do `PontoDaSerie` e já era assim antes deste bloco. Por decidir pelo lugar de direção.
- **G1-d.** O toque simulado das capturas é um evento sintético; um toque num telefone verdadeiro e o arrastar do dedo não foram provados num aparelho.
- **G1-e.** A mensagem do commit b853edb2f diz «1 051» blocos por classificar; o número não foi medido (o registo dá «e mais 1033» depois de uma lista parcial). O valor certo é «mais de mil».

## A correção G1-b (21.10.2026, a leitura do Codex, os achados 3, 4, 5 e 8)

Mandato: `.claude/sessao-2026-10-19/CORRECAO-G1-b-2026-10-21.md`. Os achados 1, 2, 6 e 7 da leitura eram as plantas nas cópias do pacote.

- **O ponto mais próximo (o achado 3).** `maisProximo` mede ao ponto desenhado de cada grupo (o círculo; sem ele, a zona estreita; sem nenhum, a marca da faixa) e não ao retângulo do grupo, que incluía a etiqueta deslocada; o x do dedo decide e o y só desempata. O registo `capturas-390-b.json` guarda, para o toque no centro do gráfico da inflação da primeira página, o x do toque no `viewBox` (180), o círculo mais próximo pelo `cx` (179,769, julho de 2007) e o ponto aceso (julho de 2007, nas duas edições, `bate: true`); o `captar.mjs` recusa a captura quando não batem. Antes, o mesmo toque acendia janeiro de 2022.
- **A etiqueta dentro da janela (o achado 4).** `poe` confina também o rebordo inferior contra a altura da janela, ao abrir e ao redimensionar. O `captar.mjs` regista `etiquetaDentro` nos dois eixos, para a etiqueta comum e para a do `<svg>` (o retângulo do `text` contra a janela), e recusa a captura quando um eixo falha. A captura a 390 px com o toque no último ponto da série (agosto de 2026): a etiqueta do `<svg>` de 71,11 a 155,17 px na horizontal (pt; 71,11 a 142,31 em inglês) e de 362,59 a 390,35 px na vertical (pt; 362,01 a 389,77 em inglês), numa janela de 390 por 900; os dois eixos dentro. As imagens ficam fora do repositório; o manifesto (nomes, medidas e sha256) é `capturas-390-b.json`.
- **A isenção dos valores escritos (o achado 5).** Das 34 séries que a primeira classificação punha em «valores escritos» por terem algarismos no eixo, 32 são as séries dos cartões e 2 o índice de duas séries do recibo da remuneração (pt e en). As 32 dos cartões levam a camada comum (G1-9); as 2 do índice ficam decorativas pela marca explícita (G1-10). O inventário e a régua classificam pelos valores escritos como valores (`[data-claim]`, `[data-ponto]` fora de uma zona) e pela marca decorativa, nunca pelos algarismos de um `text`; toda a série no tempo conta como desenho que esconde valores. O conhecido-positivo: a classificação corrigida sobre o `dist/` de a743d51be (`inventario-a743d51be-corrigido.json`) dá 34 desenhos que escondem valores sem toque, e a régua nova sobre esse `dist/` sai com 1; depois (b65ff8927), 0 e 0. Pelo `medidas.json`: 50 séries de página com leitura, 32 de cartão com leitura, 2 decorativas; 102 gráficos marcados; as cinco plantas da régua a 1. A contagem estrita passa de 2 635 a 2 645 pela classificação corrigida (menos 42 desenhos em «valores escritos»: as 34 séries e 8 com algarismos só na escala; menos 32 sem toque, os cartões).
- **Os registos dos portões (o achado 8).** Na secção §3: os ficheiros de cada corrida, comitados.

Portões que mudaram de forma, conservando o que protegem: a F21 (`tests/formas/serie-do-pais.mjs`) passa a exigir as zonas em todo o desenho que não seja decorativo, aceita `aria-hidden`, `data-grafico-decorativo` e o `id` do título, e as plantas do `tests/pais/portoes.mjs` mudam com ela (`rp4cb-zonas-num-decorativo`, `rp4cb-cartao-sem-zonas`, `rp4cb-recibo-sem-zonas`); a K20 (`tests/cartao/series.mjs`) confere a porta como a caixa do desenho com a ligação filha `a[data-grafico-porta]` para o recibo certo, e as duas plantas do `href` passam para essa ligação. A régua dos gráficos ganha as plantas `serie-sem-camada` e `decorativo-sem-aria`, as duas a 1.

### As decisões

- **G1-9.** No cartão, o desenho sai de dentro do `a` (um ponto focável dentro de uma ligação não é HTML válido) e a ligação fica irmã dele na mesma caixa (`div.cartao-medida-serie`), com o nome dado pelo título do desenho (`aria-labelledby`, sem frase nova) e um `::after` que cobre a caixa por baixo do desenho; o desenho deixa passar o toque, menos nas zonas de leitura. Um toque no campo lê o ponto da coluna; um toque fora do campo (o eixo, as margens, a legenda) segue para o recibo. Ao rato, o clique num ponto segue a ligação (a passagem já mostra a leitura); ao teclado, Enter num ponto também.
- **G1-10.** O índice de duas séries do recibo da remuneração fica decorativo: os seus valores indexados não são linhas do livro-razão (a regra 1 impede escrevê-los numa etiqueta), e os valores das séries estão escritos na tabela «Os pontos» da mesma página.
- **G1-11.** O ponto mais próximo decide-se pelo x do dedo; o y só desempata dois pontos no mesmo x. Com o peso de um quarto no y, dois pontos vizinhos de uma série mensal (a menos de um píxel no x) podiam trocar pelo y.

### O que ficou aberto

- **G1-f.** Oito desenhos (2 em cada edição de `svg.agenda-eixo-svg`, `svg.mun-serie-svg`, `svg.mun-banda-svg` e `svg.rule-svg`) têm algarismos só na escala e nenhum valor escrito; a classificação corrigida põe-nos em `algarismos-de-escala`, fora da régua. Não provei que não escondem valores.
- **G1-g.** O peso que as zonas de leitura acrescentam às dez páginas com cartões (a razão da I208) não foi medido nesta passagem.
- **G1-h.** A porta do cartão (o toque no ponto contra o toque fora dele) não foi capturada nem provada num aparelho; o mandato pediu só a captura da primeira página.
- **G1-i.** A orçamentação: o mandato pediu uma corrida inteira; foram duas, porque a primeira parou no F21 (acima).

## O custo

Na correção G1-b: 32 chamadas de ferramentas até à escrita desta linha, contadas pelas linhas `tool_use` do registo da sessão do construtor (`grep -c '"type":"tool_use"'` sobre o ficheiro do agente), mais o commit deste relatório e a entrega. Corridas: duas `portoes.sh`, uma `check:formas`, três `check:graficos` à mão e três das suas plantas, uma `tests/cartao/series.mjs`, uma do inventário sobre o `dist/` antigo, uma `captar.mjs` (quatro capturas) e uma `medir.mjs`.

No bloco G1: Chamadas de ferramentas: cerca de noventa e cinco nesta passagem, contadas por mim e não por guião. Corridas: três `portoes.sh`, duas `npm run build`, duas `typecheck`, uma de `check:formas` e `check:graficos` à mão, cinco de `medir.mjs` e quatro do `captar.mjs` (duas recusadas pelo recorte repetido, uma com a etiqueta escondida, que levou à correção a743d51be). Os símbolos lê-os o lugar de direção da ferramenta.

## A correção G1-c (21.10.2026, a leitura do Codex da G1-b, os achados 2, 3, 4, 8 e 9)

*Os achados 1, 5, 6 e 7 dessa leitura eram as plantas das cópias do pacote. A cabeça do código é `a556d3d6c`; os números abaixo leem-se dos ficheiros desta pasta (`inventario-c.json`, `plantas-c.txt`, `capturas-390-c.json`, `portoes-c/`).*

- **Achado 2 (o y como peso).** `maisProximo` escolhe pelo |dx| estrito; o y só decide entre os pontos com o mesmo centro que o vencedor, com a tolerância de um milésimo da largura do desenho no ecrã (um milésimo do viewBox). O caso plantado está no registo da captura (o `desempate`, abaixo), e o `captar.mjs` recusa se o segundo ponto não acender.
- **Achado 3 (a etiqueta do svg).** O guião confina a etiqueta própria de um ponto ao viewBox nos dois eixos (`confina`, um `translate` no `text`), ao acender e ao mudar a largura. O `captar.mjs` mede a caixa do `text` contra a do `<svg>` e contra a janela e recusa quando um eixo sai; toca agora o primeiro ponto (`toqueNoPrimeiro`) e o último.
- **Achado 4 (a isenção decorativa).** Os dois desenhos indexados do recibo da remuneração (as duas edições) deixaram a marca decorativa e levam a camada comum (`data-grafico="indice"`), um ponto por linha e por período, com a leitura «nome, período: valor (índice, base cem em <base>)», e na edição inglesa «(index, base one hundred in <base>)»; o valor tem uma casa decimal e é o que o desenho traça. A régua (G3 do índice) refaz cada valor das duas linhas do livro (o ponto e a base) e confere o nome, o período e a unidade; a F21 confere o sítio de cada ponto contra a recomposição. A marca decorativa só vale agora com cada valor do desenho escrito fora dele na mesma página (G5); nesta cabeça nenhum desenho a leva.
- **Achado 8 (os oito desenhos dos algarismos de escala).** A categoria saiu: o inventário diz `com-camada`, `decorativo-confirmado` ou `erro`, e a régua recusa um desenho com algarismos sem camada nem marca confirmada (G1), salvo a dívida declarada. A série municipal (`mun-serie-svg`, Évora, as duas edições) leva a camada, com o valor de cada ponto conferido contra o texto do `Claim` e o ano contra o texto marcado. Os outros três (o eixo da agenda, a banda dos mandatos e a régua da convergência) foram marcados decorativos e a G5 recusou-os, cada um com valores que a página não escreve fora do desenho (no registo desta passagem: uma data de janela da agenda, «em funções» na banda, os nomes das regiões na régua; as contagens no ficheiro construído: em-funcoes-evora=       2 grande-lisboa-regioes=       2 data-agenda-04.11.2026=       3). O mandato pressupunha os valores escritos ao lado; a medida mostrou que não estão, e parei nesse ponto: os três ficam como estavam (papel de imagem e nome), na dívida declarada da régua com a razão, até o lugar de direção escrever as frases que faltam ou decidir a camada.
- **Achado 9 (a K20 e os cartões).** A K20 confere que o `aria-labelledby` da ligação irmã resolve para o `id` do `<title>` do desenho, com duas plantas (o atributo retirado; apontado a outro título). A página com cartões de série para o pacote da próxima leitura é `dist/precos/index.html` (e `dist/en/prices/index.html`), o cartão `[data-cartao-serie="serie-ipc-variacao-homologa"]`. A captura toca, com o toque do navegador, num ponto do cartão e fora dos pontos do mesmo cartão (registo abaixo).

### As contagens por classe (o inventário, cabeça `a556d3d6c`)

{"erro": 6, "valores-escondidos": 124, "sem-algarismos": 68, "escondido": 2510, "valores-escritos": 96, "com-camada": 2, "documento": 57}; desenhos ao todo 2863; que escondem valores sem toque 0. Dos oito antigos: `com-camada` 2 (a série municipal), `erro` 6 (os três na dívida declarada da régua), `decorativo-confirmado` 0.

### As plantas da régua dos gráficos (`plantas-c.txt`, o nome e o código)

- sem-marca 1 planta «sem-marca»: mordeu (1 erros).
- aria-label 1 planta «aria-label»: mordeu (1 erros).
- sem-guiao 1 planta «sem-guiao»: mordeu (1 erros).
- serie-sem-camada 1 planta «serie-sem-camada»: mordeu (1 erros).
- decorativo-sem-aria 1 planta «decorativo-sem-aria»: mordeu (1 erros).
- decorativo-sem-valores 1 planta «decorativo-sem-valores»: mordeu (1 erros).
- escala-sem-classe 1 planta «escala-sem-classe»: mordeu (1 erros).
- indice-trocado 1 planta «indice-trocado»: mordeu (3 erros).
- claim-trocado 1 planta «claim-trocado»: mordeu (3 erros).

As da F21 pelo `tests/pais/portoes.mjs --prefixo rp4cb`: código 0 (as quatro, duas novas: o ponto do índice retirado, a zona da unidade no desenho indexado).

### As capturas a 390 px (`capturas-390-c.json`; as imagens ficam fora do repositório)

- `inflacao-primeiro-pt-390.png`: desempate: março de 2023 (cx 312.954) e maio de 2023 (cx 314.371), toque no x 313.713 e no y do primeiro, aceso maio de 2023; toque: aceso «janeiro de 1992: 9,41 %», etiqueta svg, janela True/True, svg True/True, transform None
- `inflacao-primeiro-en-390.png`: desempate: March 2023 (cx 312.954) e May 2023 (cx 314.371), toque no x 313.713 e no y do primeiro, aceso May 2023; toque: aceso «January 1992: 9,41 %», etiqueta svg, janela True/True, svg True/True, transform None
- `inflacao-ultimo-pt-390.png`: toque: aceso «agosto de 2026: 3,30 %», etiqueta svg, janela True/True, svg True/True, transform None
- `inflacao-ultimo-en-390.png`: toque: aceso «August 2026: 3,30 %», etiqueta svg, janela True/True, svg True/True, transform None
- `cartoes-pt-390.png`: cartão: toque num ponto, aceso «agosto de 2026: 3,30 %», navegou False; toque fora dos pontos, alvo a.cartao-medida-serie-porta, navegou True, destino /livro-razao/series/serie-ipc-variacao-homologa
- `cartoes-en-390.png`: cartão: toque num ponto, aceso «August 2026: 3,30 %», navegou False; toque fora dos pontos, alvo a.cartao-medida-serie-porta, navegou True, destino /en/ledger/series/serie-ipc-variacao-homologa

### Os portões, lidos dos ficheiros

A construção desta cabeça: 0; `check:graficos`: 0; o captar: 0; a corrida inteira por `portoes.sh` (o código do guião): 9; os códigos e o `tempos.json` da corrida em `portoes-c/`: {}.

### As decisões

- **G1-13.** A tolerância do mesmo x é um milésimo da largura do desenho no ecrã, medida no `getBoundingClientRect` do gráfico.
- **G1-14.** A unidade da leitura do índice escreve «cem» por extenso, como a frase da figura indexada; uma casa decimal; a ordem do teclado no desenho indexado vai linha a linha.
- **G1-15.** Os três desenhos sem valores escritos ao lado ficam na dívida declarada e não decorativos (o achado da G5, acima), em vez de os esconder do leitor de ecrã.
- **G1-16.** O ponto da série municipal confere-se contra o texto do `Claim` e do ano marcado `data-grafico-periodo-texto`.

### O que ficou aberto

- **G1-j.** As frases que faltam para o eixo da agenda, a banda dos mandatos e a régua da convergência (ou a camada nelas): decisão do lugar de direção.
- **G1-k.** O desenho indexado tem a etiqueta comum e não a própria; ao rato acende o ponto mais próximo do cursor.

### O custo

Quarenta chamadas de ferramenta pela minha contagem (duas gastas a esperar a cadeia em fundo); o total de símbolos é o que a ferramenta reporta para o agente.
