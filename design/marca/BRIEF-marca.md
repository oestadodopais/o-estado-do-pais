# BRIEF · A marca: o ícone do sítio no telemóvel, e as direções para o diretor escolher

*Escrito a 28.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus). Trabalho de exploração, não de fusão: nada disto entra em `main`; fica em `design/marca/` num ramo `marca-2026-08-28` para o diretor ver e escolher. Sem travessões na prosa.*

## 0 · O que o diretor pediu (28.08.2026)

Uma forma de ter o sítio no telemóvel como uma aplicação (tocar num ícone e abrir), e para isso uma marca e um ícone a sério; várias direções, com referência a como os órgãos conhecidos o fazem, para ele escolher e depois iterar no Claude Design.

## 1 · O que está verificado

**O sítio hoje não tem ícone nenhum:** nem `favicon`, nem `apple-touch-icon`, nem manifesto (`public/` só tem `dados`, `js`, `recortes`, `tipos`; o `<head>` de `src/layouts/Base.astro` não liga nenhum). No telemóvel, «adicionar ao ecrã principal» dá hoje uma captura da página como ícone.

**O que os telemóveis exigem** (WebKit, 2023, iOS 15.4 e seguintes; Chrome desde a versão 108 no telemóvel): um manifesto com `display: standalone` faz do sítio uma aplicação de ecrã principal no iPhone; os ícones podem vir do manifesto, e um `apple-touch-icon` no `<head>` tem precedência sobre eles; o Chrome instala sem service worker, com `name` ou `short_name`, `icons` (192 e 512, e um `maskable` de 512 com a forma dentro de um círculo de raio 40 % centrado), `start_url` e `display`. O ícone do iPhone é um PNG quadrado de 180 px, sem transparência, a que o sistema arredonda os cantos; o Android recorta a forma que quiser dentro da zona segura.

**A identidade que já existe** (`src/styles/tokens.css`): papel `#f6f7f4`, tinta `#17191b` (escuro: `#15171a` e `#eceeea`); cobalto `#1f4e8c` (dentro do limiar), âmbar `#e0a21a` e ocre `#7a5300` (fora do limiar); cinzentos `#585d5b`, `#7f8681`, `#d9ddd8`. Tipos alojados em `public/tipos`: Spectral (prosa), Spectral SC (versais), Bitter (instrumento). O nome: «O Estado do País»; o domínio `oestadodopaís.pt`. O vocabulário próprio do sítio: o selo (a prova ao lado de cada número), a linha do livro-razão, a peça (o quadrado com uma medida), a régua, o mapa dos concelhos como navegação.

**As referências** (`design/marca/referencias/`, os ícones reais de 24 órgãos, descarregados dos sítios deles, e a folha `folha-referencias.png` a 120 e a 60 px). O que se vê nelas, e que a exploração respeita:

* Quase todos são **uma letra ou um monograma curto num campo liso**: AP, B (Bloomberg), E (Expresso), n (Negócios), M (Le Monde), T (NYT), NZZ, P (Politico, ProPublica, Pudding), S (Semafor), Z (Zeit), RTP. Símbolos são a minoria: os pontos da Reuters, o anel do Observador, a fechadura da Pordata, a onda do Eco, os três blocos da BBC, o anel da Transparência.
* **A forma ocupa 55 a 70 % do campo**, uma cor de fundo, uma de forma, no máximo um acento (a faixa vermelha da AP e do Our World in Data).
* **O detalhe fino morre a 60 px**: o gótico do DN e o ícone do INE ficam ilegíveis; os que sobrevivem têm um traço só.
* **O espaço português já ocupado**: o anel «O» azul é do Observador; o «E» serifado azul é do Expresso; o «P» está cheio (Público, Politico, Pordata, ProPublica, Pudding); o «n» em preto é dos Negócios; o azul RTP. Uma marca nossa não pode ser confundida com nenhuma destas.

## 2 · O que constróis

Seis direções, cada uma um ficheiro SVG fonte em `design/marca/direcoes/<n>-<nome>.svg` (quadrado 512, formas vetoriais, sem texto convertido a caminhos a não ser o que vem dos tipos da casa, que estão em `public/tipos`), e para cada uma:

1. o ícone em claro e em escuro (papel e tinta trocados, o acento igual);
2. a versão `maskable` (a forma dentro do círculo seguro, o fundo a preencher o quadrado inteiro);
3. o favicon a 32 e a 16 (pode ser uma simplificação da forma, nunca outra forma);
4. a marca horizontal para o cabeçalho do sítio (o ícone com o nome «O Estado do País» em Spectral ou Spectral SC), que hoje é só texto e pode continuar a sê-lo se a direção o pedir.

As direções a explorar, e o que cada uma tenta (podes acrescentar uma sétima se vires uma melhor, dizendo porquê):

* **A · O monograma «OE»**: as duas iniciais em Spectral, ligadas ou justapostas, em tinta sobre papel; a pergunta é se um «OE» serifado lê como marca e não como sigla.
* **B · O «O» com o acento do «País»**: a inicial única, com o traço agudo do «í» como acento gráfico (um risco em âmbar ou cobalto que a distingue do anel do Observador); a pergunta é a distância suficiente ao Observador.
* **C · O selo**: a marca de prova do sítio como símbolo, um círculo ou quadrado com um traço de verificação, em cobalto, com o âmbar como estado; a pergunta é se lê como «prova» e não como «carimbo de correios» ou «feito».
* **D · A peça**: o quadrado com uma medida, o ícone como uma peça do sítio (uma linha de valor, uma linha de selo), tinta sobre papel; a pergunta é a legibilidade a 60 px.
* **E · O mapa**: a silhueta dos concelhos reduzida a um sinal (o contorno do país, ou só três manchas: continente, Açores, Madeira) em cobalto; a pergunta é a distância aos ícones do Estado e das aplicações públicas que usam a mesma silhueta.
* **F · A régua**: o instrumento de convergência (uma barra com o 100 marcado) como sinal abstrato; a pergunta é se um sinal abstrato serve a um sítio que vive de números com nome.

## 3 · O que é «feito»

* `design/marca/PRANCHA.html`: uma prancha estática (sem rede, tudo embebido) com as seis direções lado a lado, cada uma renderizada a 180, 120 e 60 px em claro e em escuro, o `maskable` dentro de um círculo e de um quadrado arredondado, o favicon a 32 e a 16, a marca horizontal; ao lado, a folha de referências para comparar à mesma escala. Uma captura de página inteira em `design/marca/PRANCHA.png` (Playwright, 1280 de largura).
* `design/marca/EXPORT/` com os PNG de cada direção (180, 192, 512, `maskable` 512, 32, 16), gerados por um programa `design/marca/exportar.mjs` a partir dos SVG (Playwright ou `sharp`, o que houver; sem dependências novas no `package.json`).
* `design/marca/NOTAS.md`: por direção, o que tenta, o que arrisca (a colisão com marcas existentes, a legibilidade a 60 px medida na captura, o comportamento em escuro), e a tua ordem de preferência com a razão; o custo em símbolos. Sem elogios: só o que se vê.
* Nada fora de `design/marca/`; nada em `public/`, nada no `<head>`; nenhuma dependência nova. Commits com caminhos explícitos, os dois trailers (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_01BbaH3XteKcsmmN9VD6SGwU`), cada um verde (`npm run typecheck` chega, porque a construção não muda).
