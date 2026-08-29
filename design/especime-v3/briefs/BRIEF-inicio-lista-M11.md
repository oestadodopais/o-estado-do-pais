# BRIEF · M11, a medição cega do bloco «os nomes do mapa ao lado, e os dois painéis com nome»

*Escrito a 29.08.2026 pelo lugar de direção (Claude Fable 5) para a medidora (Claude Sonnet). A medição corre com código próprio, numa cópia congelada de `dist/` do ramo `inicio-lista-2026-08-29` (`5b4fc7f`), e nunca na árvore de nenhum construtor. Sem travessões na prosa.*

## 0 · O que se mede, e contra o quê

O bloco mudou a primeira página nas duas edições: os 29 nomes das unidades do mapa (18 distritos, 2 ilhas da Madeira, 9 dos Açores) saíram de baixo do mapa, onde eram uma ligação por linha, e passaram, acima de 1024 px, para a coluna esquerda por baixo da manchete, com um par de estado entre o nome e a área do mapa (contorno e sublinhado, rato e teclado, nos dois sentidos); abaixo de 1024 ficam por baixo do mapa em linha, separados por ponto, com 44 px de alvo. E os dois painéis levam uma linha de nome («Procedimento dos Desequilíbrios Macroeconómicos · 13 medidas com limiar»; «Painel Social Europeu · 8 medidas»; em inglês «Macroeconomic Imbalance Procedure · 13 measures with a threshold» e «European Social Scoreboard · 8 measures»). O relatório do construtor está em `RELATORIO-CONSTRUTOR.md` na tua pasta, e as afirmações dele são o que se mede; a medição não é dele, é tua, com o teu código.

**O antes** é o sítio no ar, `https://xn--oestadodopas-2fb.pt/` e `/en/` (está em `a76f829`, que é a página antes do bloco, e não muda enquanto medes; um pedido por página, nunca mais de um por segundo). **O depois** é a cópia em `m11-dist/` na tua pasta, servida por ti em `127.0.0.1` numa porta acima de 5000 (a 4173 está ocupada).

## 1 · As medições

Nas duas edições, às sete larguras 320, 360, 390, 430, 768, 1024 e 1280 (as quatro primeiras como telemóvel, `deviceScaleFactor` 3, 3, 3 e 3; as outras a 2), com o Chromium do Playwright do repositório principal (`/Users/nunosantos/Instruments/OEstadoDoPais/node_modules/playwright`, só para importar; não corras nada de lá):

1. **A altura da página**, antes e depois, e a diferença. O construtor diz, em pt: 320 8 314 → 7 697; 390 8 034 → 7 339; 1024 4 991 → 3 901; 1280 4 791 → 4 003.
2. **A grelha da cabeça a 1280** (`.cabeca-grelha`): altura antes e depois (o construtor diz 1 552,1 → 736,5 px); o papel vazio na coluna esquerda por baixo da manchete antes (ele diz 1 260,4 px) e o que a lista ocupa depois (ele diz 418,8 px); a lista fica ao lado do mapa (a caixa da lista dentro da altura do mapa, ou não; mede os dois).
3. **Uma lista só no DOM**: quantas ligações para `/distritos/<slug>/` (ou `/en/districts/…`, vê a rota) há na página, quantos slugs distintos, e se algum destino se repete fora do mapa (as áreas do mapa também são ligações; conta as duas famílias separadas).
4. **Os alvos**: a altura de cada nome visível (a caixa da ligação) em cada largura; o mínimo tem de ser ≥ 44 px em todas; diz o mínimo por largura.
5. **Os grupos visíveis por largura** (Continente, Madeira, Açores): quais se veem e quais não, em cada largura, e o atributo que a marcação traz para o decidir (o construtor chama-lhe `data-alvo-abaixo-de`; lê os valores).
6. **O quadrado inscrito de cada distrito no mapa**, a 320, 360, 390 e 430, como a I82 o define (o maior quadrado que cabe dentro da área desenhada; se a definição da casa estiver escrita em `tests/inicio/mapa-distritos.mjs` do repositório principal, lê-a e diz que a seguiste; se não, diz a tua e aplica-a): quantos dos 18 ficam abaixo de 44 px em cada largura. O construtor diz 18 a 360, 17 a 390 e 15 a 430. Este número decide uma questão de direção (I101), por isso é o mais importante da lista.
7. **O par de estado**: com o rato sobre um nome (escolhe três: um distrito, uma ilha da Madeira, uma dos Açores) e com o foco de teclado nele, que propriedades mudam na área correspondente do mapa (largura do contorno, cor) e só nela; e ao contrário, com o rato e o foco sobre a área, o que muda no nome (sublinhado, peso, cor) e só nele. O construtor diz 1 px → 3 px nos dois lados, e as outras 28 unidades ficam em 1 px. Mede com `getComputedStyle` e, para a espessura do sublinhado, com o que a folha declara (`text-decoration-thickness` ou uma borda).
8. **O contraste** da marca do par (a cor do contorno e do sublinhado contra o papel, nos dois esquemas): as razões, com a fórmula da WCAG, lidas das cores calculadas.
9. **As linhas de nome dos painéis**: o texto exacto em pt e en, e as contagens (13 e 8) contra o que a página contém (conta as peças do painel do Procedimento e as linhas do Painel Social na própria página).
10. **Os bytes da primeira página** (HTML) antes e depois, e quanto é a folha de estilos do par (o construtor diz 6 461 bytes de selectores `:has()` por página).
11. **Os documentos originais** (uma rota `documento`, a que quiseres): nada disto lá entra.

## 2 · O método, obrigatório

* Código teu, em `medir.mjs` na tua pasta; os resultados em `resultados.json`, e o relatório em `RELATORIO-M11.md`, com uma tabela por medição, o número do construtor ao lado do teu, e «concorda» ou «discorda» em cada linha, com a diferença.
* **Um positivo conhecido por detetor antes de medir**: para cada coisa que detetas (alvo abaixo de 44, ligação duplicada, propriedade que não muda no hover, contagem errada), mostra primeiro que o teu código a vê numa cópia estragada de propósito de uma página da cópia (edita uma cópia, nunca `m11-dist/` em si), e regista os casos no relatório. Um detetor sem positivo conhecido não conta.
* Nunca escrevas um número que não mediste; onde não conseguires medir, diz «não medido» e porquê.
* Não toques em nenhuma árvore do repositório (nem a principal nem os worktrees); não corras `npm` em lado nenhum; não empurres nada.
* Custo: diz os símbolos aproximados no fim.
