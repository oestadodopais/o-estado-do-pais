# Brief F1.1d · O mapa que cresce, e o nome ao lado (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da proposta do diretor de 04.09 («the names appear on the side just when we select the region, and when we keep selecting the different municipalities … if we are on the phone, once we press a region, we'll have the name of the region and then it opens the map with the municipalities, and we can keep pressing on one and the other, and the names keep appearing on the side instead of having the full list»), que é a ideia dele de 25.08 para o mapa no telemóvel (`PEDIDOS-DO-DIRETOR-UX-2026-08-25.md` §1, ponto 1 (a)). O lugar de direção concorda: a lista aberta dos 29 nomes existia porque 13 das 29 áreas da vista do país são menores do que um dedo, e com dois níveis (as regiões, e dentro de cada uma os seus concelhos) todos os alvos ficam grandes. Corre depois do F1.1c, porque toca nos mesmos ficheiros. Sem travessões na prosa.*

## 0 · O que este bloco é

O mapa da primeira página passa a dois níveis com um lugar fixo para o nome. **O nível do país** desenha as nove regiões NUTS II (o continente em sete, a Madeira e os Açores como duas), todas com área tocável de pelo menos 44 px a 390. **O nível da região** desenha os concelhos dessa região, cada um tocável. **O nome** aparece num lugar fixo (ao lado do mapa a partir de 1 024 px, por baixo dele no telemóvel) ao passar o rato, ao focar com o teclado ou ao tocar; o lugar mostra o nome da unidade e a porta para a sua página. A lista aberta dos 29 nomes sai; fica uma lista fechada como alternativa sem guião.

## 1 · O que entra

1. **O lugar do nome**: um elemento fixo (`aria-live="polite"`) com o nome da unidade apontada e a porta «Abrir →» (a página da região, do distrito ou do concelho, conforme o nível); vazio diz «Toque numa região» / «Passe o rato por uma região»; nas duas edições; declarado no inventário da voz com origem.
2. **O nível do país**: as nove regiões desenhadas da geometria que a casa já tem (a CAOP 2025 por concelho agregada por NUTS II, calculada na construção, nunca à mão); ao passar, focar ou tocar, o nome no lugar; ao tocar (telemóvel) ou clicar (desktop) a região cresce e mostra os seus concelhos; uma porta no lugar do nome abre a página da região.
3. **O nível da região**: os concelhos da região, cada um com área tocável de 44 px a 390 (medido; se um concelho for menor, a região cresce mais, ou há um segundo nível de zoom, medido também); ao passar, focar ou tocar, o nome do concelho no lugar; um segundo toque no mesmo concelho, ou a porta do lugar, abre a página do concelho; uma porta «Voltar ao país» volta ao nível de cima; o endereço regista o nível (`#regiao=alentejo`) para se poder citar e para o botão de voltar do navegador funcionar.
4. **O teclado e o leitor de ecrã**: cada área é focável (Tab), o nome vai para o lugar ao focar, Enter faz o que o toque faz; o lugar do nome é anunciado.
5. **Sem guião**: as áreas do nível do país são ligações para as páginas das regiões (a alternativa é a página da região, que já lista os concelhos), e uma lista fechada («Os nomes») com as nove regiões e as 29 unidades fica por baixo, como hoje mas fechada.
6. **As 29 unidades da Carta (distritos e ilhas)** continuam a ter página e a estar no menu (`/distritos`); o mapa da primeira página deixa de as desenhar como nível: são o nível intermédio da página da região se o construtor medir que ajuda, senão a página de distrito continua a ser alcançada pela lista e pelo menu.
7. **As páginas de distrito e de região** ganham o mesmo lugar do nome para os seus concelhos.

## 2 · O que não entra

Nenhum número novo (as contagens já existentes ficam); nenhuma cor nem tipo novos; nenhuma mudança à manchete, à faixa, às leituras ou à busca; nenhum guião de que a navegação precise para chegar a uma página (as ligações do nível do país existem sem guião).

## 3 · Onde se constrói

Ramo `mapa-2026-09-05` (ou a data do dia) numa worktree própria a partir de `origin/main` depois de o F1.1c se fundir. Ficheiros: o componente do mapa da primeira página e o gerador da sua geometria (procurar onde a CAOP entra: `src/data/concelhos.gerado.json`, o manifesto do motor, `scripts/check-mapa.mjs`), `src/components/inicio/ListaDosNomes.astro`, `public/js/inicio.js`, `src/styles/inicio.css`, as vistas de distrito e de região só no lugar do nome, `tests/inicio/lista.mjs`, `mapa-distritos.mjs`, `mapa-navegacao.mjs`, `design/especime-v3/medicoes/mapa-construtor.md`, capturas a 390 × 664 e 1 280, nos dois níveis, nas duas edições. A geometria agregada por região entra como ficheiro gerado com o seu gerador e o seu portão (`check:mapa` a conferir que a união dos concelhos de cada região é a região).

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| P1 | as nove regiões com área tocável ≥ 44 px a 390; dentro de cada região, 308 de 308 concelhos com ≥ 44 px no nível em que se tocam (medido região a região, com a lista dos que precisaram de mais zoom) | Playwright, geometria |
| P2 | o nome no lugar ao passar, ao focar e ao tocar, em 9 de 9 regiões e numa amostra de 30 concelhos, nas duas edições | Playwright |
| P3 | o primeiro toque numa região ou num concelho nunca navega; o segundo, ou a porta, abre a página certa; «Voltar ao país» volta; o botão de voltar do navegador volta | Playwright |
| P4 | sem guião: 9 ligações do nível do país para as páginas das regiões, a lista fechada com as 29 unidades, `#regiao=` ignorado sem erro | HTML |
| P5 | a altura de `/` a 390 menor do que a de partida, medida antes e depois | geometria |
| P6 | a geometria das regiões igual à união dos seus concelhos (`check:mapa`), nenhum concelho fora da sua região, os 308 uma só vez | o portão |
| P7 | contraste ≥ 4,5:1 do lugar do nome nos dois temas; o `aria-live` a anunciar (conferido com `ariaSnapshot`) | medição |
| P8 | as réguas de `tests/inicio` verdes ou reescritas com a razão; `npm run build`, `verify`, `typecheck` a 0 | os três comandos |
| P9 | plantas vermelhas e depois verdes: uma região sem nome no lugar; o primeiro toque a navegar; um concelho fora da sua região na geometria; a lista fechada aberta por defeito; uma área sem ligação sem guião | a régua |

## 5 · A disciplina e o custo

Como nos outros blocos: commits pequenos em português sem travessões, os trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`, nunca `git add -A`, nunca um número que não foi medido, o `typecheck` estrito, cada cadeia nova no inventário da voz. Estimativa: Opus, duas passagens, da ordem de 0,8 a 1,2 M símbolos (M): a geometria agregada e os dois níveis são a parte grande.
