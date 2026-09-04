# Brief F1.1b · A leitura breve no cartão, e o que vem a seguir ao mapa (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, depois de o diretor ver o sítio no ar a 04.09 («the cards that we can scroll on top of the website … then are double just under the map. Now they don't have the numbers, but the names are still there and the cards are still there … what is the content that will go in there, if any»). O F1.1 tirou os números aos dois painéis de baixo (os 21 valores uma só vez) e deixou os painéis com os 21 nomes como o lugar onde a leitura breve de cada cartão abre: lido como página, é a mesma lista duas vezes. O `BRIEF-forma-dos-dominios.md` §2 diz o que vai a seguir ao mapa na página do país: «os domínios por ordem, cada um com a sua faixa». Sem travessões na prosa.*

## 0 · O que este bloco é

Duas coisas. **A leitura breve abre do cartão**, numa só área de leitura por baixo da faixa (uma de cada vez com guião; sem guião, cada leitura é um `<details>` nativo fechado, com o nome do cartão como `<summary>`, numa lista compacta que não repete a faixa). **Os dois painéis de baixo saem** e, a seguir ao mapa, entram **os domínios por ordem** (hoje um: «Economia e finanças públicas», com a sua faixa de cinco cartões já existente em `src/data/dominios.mjs` e a porta para a página do domínio) e a fila dos estudos que o F1.2b pôs. As medidas dos dois quadros da União que ainda não têm domínio não ganham secção nenhuma: vivem na faixa e na sua leitura breve, e o índice `/dominios` diz o que falta.

## 1 · O que entra

1. **A área de leitura breve** debaixo da faixa: com guião, o toque num cartão abre a leitura desse cartão nessa área (o valor com selo, o limiar ou a posição, a frase de contexto do painel a que pertence, as três datas, a porta para a linha), fecha a anterior, e o endereço ganha `#<id>` para se poder citar; sem guião, a área é a lista dos 21 `<details>` fechados, cada um com o `id` do cartão, para que `#<id>` continue a abrir o certo (o navegador abre o `<details>` alvo de um fragmento nos motores que o suportam; onde não, o `<summary>` está a um toque).
2. **Os painéis do Procedimento e do Painel Social saem** da página do país. As duas frases de contexto que o F1.1 escreveu ficam: uma vez cada, na área de leitura, antes das leituras do respetivo quadro (a régua A4 continua a exigir «Comissão Europeia» em cada uma, nas duas edições).
3. **A secção dos domínios** a seguir ao mapa: um título («Domínios», a cadeia que o menu já usa), e por cada domínio com página (hoje um) o nome, a manchete do domínio (a mesma do `DominioView`, com os selos fora da frase como o F1.2b fez), a faixa das cinco medidas de cabeça do domínio (o mesmo componente `Faixa` com «n de 5») e a porta «Ver o domínio →» (a cadeia que o F1.2b já declarou); os domínios sem página não aparecem aqui (o índice `/dominios` já os diz).
4. **A fila dos estudos** fica onde o F1.2b a pôs, depois da secção dos domínios.
5. **Nada de números novos**: os 21 valores da faixa continuam a aparecer uma só vez fora das páginas de linha (a régua A3), e os cinco da faixa do domínio já estavam na página (a dívida pública, o saldo e as taxas de emprego e desemprego são também cartões do Procedimento: a régua A3 conta `data-claim` por id e não pode contar dois; decide-se assim: **na faixa do domínio da primeira página esses cartões repetidos não levam o valor selado, só o nome e a porta**, e o relatório di-lo; se a régua ou a régua de voz o recusarem, a faixa do domínio na primeira página leva só as medidas que não estão no Procedimento, e o relatório mede as duas formas).

## 2 · O que não entra

Nenhum número novo; nenhuma frase nova sobre a casa; nenhuma mudança à cabeça (nome, manchete, porta do concelho, mapa, nomes) nem ao menu; nada nas páginas de domínio, de região ou de concelho além do que o componente partilhado exigir; nenhum guião de que a página precise para ser lida.

## 3 · Onde se constrói

Ramo `leitura-2026-09-04` numa worktree própria a partir de `origin/main` (confirma o SHA). Ficheiros: `src/views/HomeView.astro`, `src/components/inicio/Faixa.astro`, `Peca.astro`, `ListaSocial.astro` (a sair ou a virar a área de leitura), um componente novo `src/components/inicio/LeituraBreve.astro`, `public/js/inicio.js` (a abertura de uma leitura por toque), `src/styles/inicio.css`, `src/i18n/strings.mjs` (chaves novas só), `src/data/figuras.mjs` (declarações), `tests/inicio/*.mjs`, `design/especime-v3/medicoes/leitura-construtor.md`. Dois construtores correm em paralelo noutros ficheiros (F1.4: áreas, livro-razão, `LinhaView`, `datas.mjs`, `Masthead` no fim; F1.7: `SiteFooter`, `MunicipiosView`, as listas de distrito e região, `MetodoView`, `site.css` nas faixas de largura, `Manchete`/`Claim` só na área de toque): não lhes toques; se o `site.css` for preciso, só na secção da primeira página.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| J1 | os 21 nomes das medidas aparecem no `dist/index.html` fora das páginas de linha em exatamente dois lugares: o cartão da faixa e o `<summary>` da sua leitura (antes: cartão, painel e leitura, três); contagem por id nas duas edições | script |
| J2 | os 21 valores selados uma só vez (A3 verde) e «Comissão Europeia» em cada uma das duas frases (A4 verde) | as réguas do F1.1 |
| J3 | sem guião: os 21 `<details>` presentes, fechados, com `id`; `#<id>` na barra de endereço abre o certo (medido no Chromium e no WebKit) | Playwright com o guião desligado |
| J4 | com guião: um toque num cartão abre a sua leitura e fecha a anterior; o endereço passa a `#<id>` | Playwright |
| J5 | a secção dos domínios a seguir ao mapa com o domínio 1, a sua manchete sem texto de selo no nome acessível, a faixa de cinco com «n de 5» e a porta para `/dominios/economia-e-financas-publicas` (e o par inglês) | HTML e a régua A17 do F1.2b |
| J6 | a altura de `/` a 390 menor do que hoje (6 959 px; mede-se de novo na árvore de partida) | geometria |
| J7 | a 390 × 664 o primeiro ecrã igual ao do F1.1 (nome, manchete, primeiro cartão, selo, porta do concelho) | geometria |
| J8 | `/estudos` continua a ≤ 1 toque e ≤ 1,5 ecrãs (E3 do F1.2b) | a régua do F1.2b |
| J9 | nenhum número novo: o inventário das classes de algarismos antes e depois, com as diferenças ditas (os valores que saem dos painéis, os que a faixa do domínio não leva) | o guião `numeros-novos.mjs` |
| J10 | `npm run build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos; as treze réguas de `tests/inicio` verdes ou reescritas com a razão, nunca desligadas; `check:voz` com as cadeias novas declaradas | os três comandos |
| J11 | plantas vermelhas e depois verdes: um painel de baixo de volta; um `<details>` sem `id`; a secção dos domínios sem a porta; a faixa do domínio com um valor selado repetido | a régua |

## 5 · O que se entrega e a disciplina

O relatório com J1 a J11 antes e depois, as capturas a 390 × 664, 768 e 1 280 nas duas edições em `design/especime-v3/capturas/leitura-2026-09-04/`, a régua com as plantas, o SHA e a corrida `portao` verde. Empurra e espera o verde; não fundes em `main`. Commits pequenos em português sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido; o `typecheck` é estrito. Estimativa: Opus, duas passagens, da ordem de 0,5 a 0,8 M símbolos (M).
