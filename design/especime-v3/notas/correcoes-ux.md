# Nota das correções de UX · 25.08.2026

*Construtor (Claude Opus 5, `claude-opus-5[1m]`). Ramo `correcoes-ux-2026-08-25`, a partir de `main` em `cb133d5`. Contrato: `../briefs/BRIEF-correcoes-ux-A.md`, com a `AUDITORIA-UX-2026-08-25.md` por trás, e a Emenda 18 de `direcao.md` para o item A11. Sem travessões nesta prosa; o ponto médio é o separador. **Todos os números desta nota vêm de um comando que está escrito ao lado deles.***

---

## A · A primeira página e a navegação

### A.0 · Os comandos que dão os números

```
npm run build                                         (342 páginas, 41 chaves da prova)
npm run verify · npm run typecheck
node scripts/medir-defeitos.mjs
node tests/inicio/matriz.mjs
node tests/inicio/correcoes-a.mjs                     (32 réguas, sai com 0)
node tests/inicio/correcoes-a.mjs --json <ficheiro>   (as medidas desta nota)
```

As capturas estão em `../capturas/ux-2026-08-25/correcoes-a/`, em JPEG a escala 2, quatro por largura e edição (`antes-` e `depois-`, `cima` e `inteira`), mais `antes-evora-1280-pt-cima.jpg` e `depois-evora-1280-pt-cima.jpg`.

### A.1 · Os commits

| commit | o quê |
|---|---|
| `696b51a` | os dez itens e a frase de identidade, no código do sítio |
| `c6e8f03` | as réguas do bloco, a matriz sem as células cujo objecto saiu, o inventário |
| `bfcb8d1` | as três medições que rebentavam em vez de falhar com o estrago plantado |

### A.2 · O que se mediu, antes e depois

Todos os números são de `dist/`, medidos com Playwright: telemóvel em WebKit com `devices['iPhone 13']` (390 × 664) e toque a sério; computador em Chromium a 1280 × 800. As medições de pixéis correm com `deviceScaleFactor: 1`, para que um pixel da imagem seja um pixel de CSS.

| medida | antes | depois |
|---|---|---|
| altura do `<header>`, 390 | 258,7 px (39,0% do ecrã) | **200,9 px** (30,3%) |
| topo da manchete, 390 | 415,9 px (62,6%) | **249,7 px** (37,6%; o alvo é 40%, 265,6 px) |
| primeiro cartão do painel, 390 | 942,2 px | 849,9 px |
| altura da página, 390 | 6 131 px | 6 124 px |
| altura da página, 1280 | 4 900 px | 3 890 px |
| mapa a 390 | 84 × 110,6 px, 308 pontos com caixa | **0 × 0, zero pontos com caixa** |
| pesquisa a 390 | escondida (0 × 0, `hidden`) | **354 × 126,2 px, à vista, depois da lede** |
| comando de âmbito a 390 | nenhum segmento à vista | **«País · Concelho», com papel de botão** |
| destinos do telemóvel («Abrir um concelho →», «Ver uma região →») | 3 elementos | 0 |
| `#pesquisa` depois de tocar em «Concelho», 390 | topo a −130,9 px do ecrã, `visivel: false`, foco em `A.movel-destino` | **topo a 537,7 px de 664, dentro, foco em `#pesquisa-concelho`** |
| ligações dentro do `svg` do mapa, 1280 | 0 | **1**, para `/municipios/evora`, com `<title>` «Évora» e cursor `pointer` |
| raio e enchimento dos 308 pontos | um só raio, um só enchimento | **um só raio (4.5), um só enchimento (`none`)** |
| leitura do mapa ao passar o rato, 1280 | «Évoradistrito de Évora» | **«Évora · distrito de Évora»** |
| `#mapa` no âmbito região | `display: none`, `hidden=true` | **`grid`, `hidden=false`, em todos os estados** |
| `#convergencia` e a banda da região em `/` | presentes | ausentes |
| chaves da prova reconferidas pelo portão | 41 | **41** |
| texto abaixo de 12 px na rota `home`, 390 | 51 elementos (10 a 11,5 px) | **0** |
| alvos efetivos abaixo de 44 px, 390, fora da mobília | 10 | **0** |
| áreas de toque sobrepostas, 390 | 1 par (pt) · 2 pares (en), com a hipótese dos 44 px | **0** |
| maior banda de cor uniforme dentro do `<main>`, 390 | **97 px** em y = 824 | **43 px** em y = 830 |
| maior banda de cor uniforme dentro do `<main>`, 1280 | **125 px** em y = 1043 | **42 px** em y = 1067 |
| maior banda dentro do `<main>` de `/municipios/evora`, 1280 | 86 px (o ar da secção) | **45 px** |
| primeiro cartão de `/municipios/evora`, 1280 | 545..908 px (cortado a 800) | **499..846 px** (os quatro valores da primeira fila dentro do primeiro ecrã) |
| frases da casa na rota `home` | 32 distintas · conteúdo 33 · navegação 7 · autorreferência 0 | 28 distintas · conteúdo 31 · **navegação 5** · **autorreferência 0** · 0 por classificar |
| frase de identidade | não existia | **uma ocorrência em `/` e em `/en`**, Spectral 12 px, uma linha, sem porta e sem algarismo |

### A.3 · A prova de cada item, vista vermelha e verde

`node tests/inicio/correcoes-a.mjs` sai com 0 quando as 32 réguas passam e com 1 quando alguma falha. Cada item foi visto **vermelho** com um estrago plantado no código, reconstruído e medido, e **verde** depois de reposto. A tabela diz o estrago e o que a régua imprimiu com ele.

| item | o estrago plantado | o que a régua disse (saída 1) |
|---|---|---|
| A1 | o foco volta ao botão premido, em vez de ir ao campo | `foco «A»`, nas duas edições |
| A2 | `.cmd-grupo:first-child { display: none }` volta ao telemóvel | `0 modos à vista` e, a seguir, `sem toque: page.tap: Timeout` |
| A3 | a secção `#convergencia` volta a ser rendida em `/` | `#convergencia true · porta do telemóvel true`, e a banda de 79 px volta ao `<main>` a 1280 |
| A4 | a tela do mapa volta a render-se abaixo de 640 | `svg 84px · 308 pontos com caixa` |
| A5 | o ponto com página deixa de ser embrulhado em `<a>` | `0 dentro de <a> · title null · cursor null`, e o teclado deixa de lá chegar |
| A6 | o separador da leitura não se acende | `lê «Évoradistrito de Évora»` |
| A7 | as goteiras da marca voltam a 34/26 px no telemóvel | `cabeça 232,9px · manchete a 281,7px · 40% = 265,6px` |
| A8 | `section { padding-top }` volta a `clamp(52px, 7vw, 86px)` | `maior banda no main: 53px` a 390, `87px` a 1280, `90px` no concelho |
| A9 | `.regua-escala` sai do chão de 12 px | `11px span.regua-fim «0» · 11px span. «60» …` |
| A10 | `a.prova-valor::after` perde o `content` | `6 alvos abaixo de 44 fora da mobília` |
| A11 | a frase de identidade sai da marca | `0 ocorrências` |
| C1 | `figura.hidden = mo === 'regiao'` volta | `?ambito=regiao:algarve: none, hidden=true` |

Dois estragos apanharam mais do que o seu item, e é o que se espera de réguas que medem a mesma página: o de A4 acendeu também A10 (os 308 pontos voltam a ser alvos), e o de A3 acendeu A8 (a secção que volta traz o ar da secção com ela).

### A.4 · O detetor de bandas, provado antes de valer

Regra 14. O detetor mede corridas de linhas horizontais de cor uniforme na captura de página inteira, e uma corrida acaba quando a cor muda: um filete de 1 px parte a banda em duas, como parte no ecrã. Conta-se a corrida que tem tinta acima **e** abaixo, que é o «entre dois blocos de conteúdo» do brief.

Corrido sobre a construção anterior a este bloco, o detetor devolveu **97 px em y = 824 a 390** e **125 px em y = 1043 a 1280**. São o vazio que o diretor fotografou e os dois números que a auditoria publicou (96 e 125). É esse o caso conhecido em que ele fechou antes de as suas leituras contarem para alguma coisa.

A guarda do leitor-utilizador ficou escrita: acima de cerca de 50 000 px de altura a tela aceita a imagem e desenha-a vazia, e a página inteira lê-se como uma banda só. A régua devolve `telaVazia` e a célula falha em vez de dizer zero.

### A.5 · O que fica medido e não fechado

Três bandas de cor uniforme acima de 48 px ficam **fora do `<main>`**, e ficam por escrito em vez de fechadas:

| onde | 390 | 1280 |
|---|---|---|
| por cima da marca (goteira do cabeçalho) | dentro dos 48 | 68 px |
| entre a mobília e o conteúdo | dentro dos 48 | 76 px |
| entre a porta das correções e o rodapé | 69 px | 94 px |

São a composição da mobília e a separação do pé, e não bandas entre dois blocos de conteúdo: fechá-las é mudar as goteiras da marca e a distância do rodapé em todas as 342 páginas, que é uma decisão de desenho do diretor e não um efeito colateral de um bloco de correções. Ficam impressas ao lado do juízo, em cada corrida da régua.

Quatro alvos ficam com a área da sua própria linha, na **mobília do cabeçalho**: as duas leituras (`a.mob-leitura-porta`, `a.mob-leitura-k`) e as duas contagens da agenda (`a.prova-valor`). A razão está medida: as duas leituras vivem em duas linhas de 19 px a 25 px uma da outra (porque as duas cadeias medem 460 px de texto numa coluna de 354), e áreas de 44 px cruzam-se ali por 19 px na vertical; dar altura de fila às duas devolveria à cabeça os 50 px que o item A7 acabou de lhe tirar. É a mesma forma de exceção medida que `site.css` já escreve para o selo do `.brief-text`.
