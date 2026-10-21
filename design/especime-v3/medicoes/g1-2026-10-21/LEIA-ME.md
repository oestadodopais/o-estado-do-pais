# G1 · todos os gráficos com a interação do gráfico da inflação, ao rato, ao toque e ao teclado (21.10.2026)

*Construtor: Claude Opus 5.5 (a definição `construtor`), na worktree `g1-2026-10-21`, de `main` a39afdc3b. Mandato: `.claude/sessao-2026-10-19/MANDATO-GRAFICOS-opus-2026-10-21.md`. Nada no motor; nenhum número muda. Fecha a I230 para os desenhos que escondem valores; o resto fica declarado abaixo.*

## O que mudou para o leitor

- O gráfico da inflação da primeira página e as séries dos recibos (os desenhos com leitura, 50 nas duas edições) acendem o ponto ao toque, ao arrastar do dedo (o ponto mais próximo) e ao teclado (um só ponto na ordem do tabulador, o último; as setas, Início e Fim andam pelos outros; Escape fecha), além do rato, como antes. Um toque fora fecha a leitura.
- Na primeira página, o desenho da inflação saiu de dentro da ligação ao recibo: a ligação fica no nome e na unidade, e um toque no desenho lê o ponto em vez de abrir o recibo (G1-4).
- A faixa dos países de cada cartão (20 nas duas edições) mostra, ao toque, ao arrastar, ao rato e ao teclado, uma etiqueta com o nome, o período e o valor da marca mais próxima, posta junto à marca e sempre dentro do ecrã. Antes só havia o `title` ao rato.
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

## O custo

Chamadas de ferramentas: cerca de noventa e cinco nesta passagem, contadas por mim e não por guião. Corridas: três `portoes.sh`, duas `npm run build`, duas `typecheck`, uma de `check:formas` e `check:graficos` à mão, cinco de `medir.mjs` e quatro do `captar.mjs` (duas recusadas pelo recorte repetido, uma com a etiqueta escondida, que levou à correção a743d51be). Os símbolos lê-os o lugar de direção da ferramenta.
