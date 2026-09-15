# A fatia `dominios-css-2026-09-15` · o mandato e as medidas (15.09.2026)

*Escrito pelo lugar de direção a 15.09.2026 para o construtor Claude Opus 5, pela regra de 09.09 (as correções visíveis que o diretor aponta aterram em fatias no próprio dia: um ramo pequeno, uma leitura a frio curta, um portão). Sem travessões na prosa.*

## 0 · O defeito, medido no sítio no ar (44f0d838)

Na primeira página, a secção dos domínios (o índice do 8.13) usa classes cujas regras vivem só em `src/styles/dominio.css`, importada por `DominiosView.astro` e `DominioView.astro` e não por `HomeView.astro`: a lista rende sem regras (a numeração do `<ol>`, o estado no serif do corpo, sem o `gap` do flex), e como o HTML não tem espaço entre o `<a>` do nome e o `<span>` do estado, o leitor vê «Trabalhoas medidas estão em Economia e finanças públicas» e «públicas10 medidas», nas duas edições. O campo da busca leva `size="4"` (posto a 09.09 para parar um transbordo a 320 px) e rende com quatro caracteres de largura ao lado do botão. «as medidas estão em» não se entende («I don't even know what that means»).

## 1 · As decisões

1. A lista dos domínios passa a um componente com folha própria, usado pela primeira página e por `/dominios`; as regras da lista saem de `dominio.css` para essa folha.
2. Um espaço no HTML entre o nome e o estado, para a linha se ler mesmo sem folhas.
3. «as medidas estão em» / «the measures are in» passa a «incluído em» / «included in», com o inventário a dizer a razão.
4. O campo da busca ocupa a linha menos o botão (`flex: 1 1 auto; min-width: 0`), com o `size` só como recurso sem folha; sem transbordo a 320 px.
5. Duas células novas no `verify`: (a) «as regras chegam à página»: uma classe usada no HTML de uma página com regra numa folha construída que a página não liga fica vermelha; (b) «palavras coladas»: dois elementos vizinhos no mesmo bloco, com letra ou algarismo de cada lado da fronteira e sem espaço, ficam vermelhos, com as exceções escritas e justificadas. Cada célula com um positivo conhecido, e a prova de que apanham o defeito na cabeça `44f0d838`.

## 2 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| D1 | na primeira página, a lista com o `gap` de 14 px entre o nome e o estado, o estado na fonte de instrumento a 14 px, a numeração escondida, igual ao índice de `/dominios`, nas duas edições | medido no navegador a 390 e a 1 280, antes e depois |
| D2 | «Trabalhoas» e «públicas10» a 0 no `dist/` inteiro; a célula (b) a 0 no sítio, ou o que ela achou listado e decidido | a célula (b) |
| D3 | a célula (a) a 0 no sítio, ou o que ela achou listado e decidido; vermelha sobre um `dist/` da cabeça `44f0d838` | a célula (a) |
| D4 | o campo da busca à largura da linha menos o botão a 320, 390, 768 e 1 280, nas duas rotas, sem transbordo | medido no navegador; a célula do transbordo da matriz a 0 |
| D5 | «incluído em» / «included in» rendidos, as cadeias antigas a 0, o inventário com a razão | `check:voz` a 0 |
| D6 | o primeiro ecrã a 390 × 664 igual | A1, A11 |
| D7 | `build`, `verify` e `typecheck` a 0 com os códigos lidos dos ficheiros; o `portão` verde | os três comandos; a CI |
| D8 | as capturas da secção dos domínios e da linha da busca a 390 e a 1 280, antes e depois | `capturas/dominios-css-2026-09-15/` |
