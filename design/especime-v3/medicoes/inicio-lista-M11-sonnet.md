# M11 e M11b · a medição cega do bloco «os nomes do mapa ao lado, e os dois painéis com nome» (Sonnet, 29.08.2026)

*Duas rondas da mesma medidora, com código próprio (`inicio-lista-M11-sonnet.mjs`, `inicio-lista-M11b-sonnet.mjs`, `inicio-lista-M11-nucleo.mjs`), numa cópia congelada de cada construção (`5b4fc7f` e `d8c3ae3`) e nunca na árvore do construtor; os resultados em `inicio-lista-M11-sonnet.resultados.json` e `inicio-lista-M11b-sonnet.resultados.json`. Os briefs: `briefs/BRIEF-inicio-lista-M11.md` e `briefs/BRIEF-inicio-lista-M11b.md`.*

## Primeira ronda (M11)

# RELATÓRIO M11 · a medição cega do bloco «os nomes do mapa ao lado, e os dois painéis com nome»

*Medidora: Claude Sonnet. Código próprio em `medir.mjs` (o ponto de entrada), `nucleo.mjs` (as funções partilhadas), `servidor.mjs` (o servidor estático) e `gera-estragos.mjs` (as cópias estragadas de propósito), todos na minha pasta. As afirmações medidas são as de `RELATORIO-CONSTRUTOR.md`; esta medição é minha, correu com o meu código, e não toca em nenhuma árvore do repositório nem em nenhum worktree. Os resultados brutos completos estão em `resultados.json`, ao lado deste ficheiro.*

## 0 · Contra o quê, e como

O antes é o sítio no ar, `https://xn--oestadodopas-2fb.pt/` e `/en/`, pedido exactamente quatro vezes ao vivo (duas por edição, uma por grupo de largura), sempre com pelo menos 1,1 segundos entre pedidos. O depois é `m11-dist/`, servido por mim em `127.0.0.1:5057`. As sete larguras e os dois esquemas de escala de dispositivo (3 nas quatro primeiras, 2 nas outras) seguem o brief.

**Uma nota de método que muda o número, medida antes de confiar em qualquer altura de página:** testei a receita do Playwright com `isMobile:true` e `hasTouch:true` (o que a palavra «telemóvel» sugeriria) contra a receita só com a largura e o `deviceScaleFactor`. Com `isMobile`, a altura da página pt a 320 depois sai 7787 px; sem `isMobile`, sai 7697 px, que é o número do construtor. A causa está confirmada, não suposta: `grep` à folha `_astro/Base.*.css` mostra três regras `@media (pointer:coarse)`, que é exactamente o que `hasTouch` liga, e que mudam algo alheio a este bloco. Toda esta medição usa por isso `deviceScaleFactor` conforme o brief, sem `isMobile` nem `hasTouch`.

**Uma segunda nota, encontrada a fazer o par de estado:** `page.hover()` do Playwright mira o centro da caixa delimitadora do elemento, e a I82 já regista, no código que copiei, que esse centro cai fora do polígono para uma unidade côncava (a Ilha da Madeira é o próprio exemplo escrito lá). Medido ao vivo aqui: `page.hover('a[data-uni-porta="ilha-da-madeira"]')` esgota o tempo, porque é o `<svg>` que recebe o ponteiro nesse pixel, não a área. A correcção foi mover o rato com `page.mouse.move()` para o ponto representativo real (o mesmo `ponto` do `mapa/pais.json`, levado a pixels de ecrã pela mesma matriz que a I82 usa), não para o centro da caixa.

**O algoritmo do quadrado inscrito (medição 6) é uma cópia literal de `QUADRADO_INSCRITO` em `tests/inicio/mapa-distritos.mjs`** do repositório principal, lida em HEAD (`a76f829`, que é exactamente o commit «antes» do brief) e conferida por `diff` contra a mesma função no commit `5b4fc7f` (a ponta do ramo do construtor): zero linhas de diferença. Os pontos representativos vêm de `mapa/pais.json`, também conferido por `diff` entre os dois commits: zero linhas de diferença. As duas leituras foram feitas com `git show` e a ferramenta de leitura, nunca com `npm`, nunca a escrever, nunca a mudar de ramo.

## 1 · Os positivos conhecidos

Nove detectores, cada um confirmado numa cópia estragada de propósito antes de ser aplicado a uma página verdadeira (`estragos/`, nunca `m11-dist/`). Os quatro primeiros são os exemplos do próprio brief; os cinco seguintes são extensões minhas às medições que também fiz.

| detector | o que estraguei | esperado | obtido | resultado |
|---|---|---|---|---|
| KP1 alvo abaixo de 44 px | forcei a caixa de «Lisboa» na lista a 20 px (`height`, `min-height` e `max-height`) | altura de Lisboa < 44, mínimo da largura < 44 | 20 e 20 | passou |
| KP2 ligação duplicada | dupliquei o `<li>` de Lisboa na lista | 30 ligações, 29 distintas, «lisboa» 2 vezes | exactamente isso | passou |
| KP3 propriedade que não muda no hover | esvaziei o `<style>` do par | nenhuma área muda com o nome, nenhum nome muda com a área | zero mudanças nos quatro sentidos | passou |
| KP4 contagem errada | troquei 13→14 e 8→9 nos títulos dos painéis, sem tocar nas peças reais | os dois títulos com `bate:false` | exactamente isso | passou |
| KP5 grupo escondido | `display:none` forçado no grupo do continente | continente invisível, os outros dois visíveis | exactamente isso | passou |
| KP6 documento contaminado | injectei `data-lista-porta` e `.painel-nome` numa página de documento | contaminado:true | exactamente isso | passou |
| KP7 quadrado inscrito | uma página sintética com um quadrado de 400×400 unidades e outro de 20×20, à escala 0,5 px/unidade, na mesma marcação que a régua espera | grande ≥ 44 px, pequeno < 44 px | 200 px e 8 px | passou |
| KP8 fórmula de contraste | nenhuma página; valores de manual da WCAG | preto/branco 21,00:1; #767676/branco ≈ 4,54:1 | 21,00 e 4,5422 | passou |
| KP9 contador de bytes | acrescentei 500 bytes exactos a uma cópia | diferença de 500 bytes | 500 | passou |

**A primeira tentativa do KP1 falhou** (com só `height:20px!important` a altura computada saía 44px na mesma) e é a razão por que este processo existe: a folha do sítio usa `min-height:44px` (e, na forma em coluna, também `line-height:44px`), e `min-height` vence `height` na resolução da caixa, seja qual for a especificidade. Corrigido no ficheiro, medido outra vez, agora passa. Fica registado porque é o próprio método a funcionar, não um tropeço escondido.

## 2 · Medição 1 · a altura da página

Todas as 28 células (7 larguras × 2 edições × antes/depois) batem certo com o construtor, incluindo as diferenças.

**pt**

| largura | antes (meu) | depois (meu) | diferença (minha) | depois (construtor) | concorda |
|---|---|---|---|---|---|
| 320 | 8314 | 7697 | 617 | 7697 | concorda |
| 360 | 8062 | 7411 | 651 | 7411 | concorda |
| 390 | 8034 | 7339 | 695 | 7339 | concorda |
| 430 | 7930 | 7173 | 757 | 7173 | concorda |
| 768 | 5665 | 5188 | 477 | 5188 | concorda |
| 1024 | 4991 | 3901 | 1090 | 3901 | concorda |
| 1280 | 4791 | 4003 | 788 | 4003 | concorda |

**en**

| largura | antes (meu) | depois (meu) | diferença (minha) | depois (construtor) | concorda |
|---|---|---|---|---|---|
| 320 | 8295 | 7661 | 634 | 7661 | concorda |
| 360 | 8142 | 7508 | 634 | 7508 | concorda |
| 390 | 8008 | 7313 | 695 | 7313 | concorda |
| 430 | 7933 | 7176 | 757 | 7176 | concorda |
| 768 | 5758 | 5281 | 477 | 5281 | concorda |
| 1024 | 4950 | 3860 | 1090 | 3860 | concorda |
| 1280 | 4775 | 3987 | 788 | 3987 | concorda |

Os meus valores «antes» também batem certo, número a número, com os que o construtor citou como ponto de partida (§1.1 do relatório dele), medidos de novo ao vivo e não copiados do relatório.

## 3 · Medição 2 · a grelha da cabeça a 1280

| métrica | construtor antes | construtor depois | eu antes | eu depois | concorda |
|---|---|---|---|---|---|
| altura da grelha | 1552,1 px | 736,5 px | 1552,06 px | 736,53 px | concorda |
| papel vazio na coluna esquerda | 1260,4 px | (não se aplica, a coluna deixa de estar vazia) | 1260,33 px | | concorda |
| altura da lista | (a lista não estava aqui) | 418,8 px | | 418,80 px | concorda |
| lista é filha directa de `.cabeca-grelha` | não | sim | não (descendente de `MapaRespira`, dentro de `.cabeca-inst`) | sim | concorda |
| lista e mapa, mesma coluna x ou colunas diferentes | mesma coluna (x=696 os dois, lista por baixo) | colunas diferentes (lista x=94, mapa x=696) | mesma coluna, x=696 os dois | colunas diferentes, x=94 e x=696 | concorda |
| caixa da lista dentro da altura do mapa | dentro (a lista vive dentro da figura do mapa) | excede em 17,2 px | dentro, 0 px de excesso | excede em 17,27 px | concorda |

Os dois lados desta medição (a caixa por si, e a comparação com a altura do mapa, «mede os dois» como o brief pede) foram medidos nas duas versões.

## 4 · Medição 3 · uma lista só no DOM

29 ligações no mapa, 29 na lista, 29 destinos distintos em cada família, zero duplicados, nas duas versões, nas duas edições, nas sete larguras. Tabela para pt a 1280 (as outras larguras e o en são iguais, ver `resultados.json`):

| versão | família | total | distintos | duplicados |
|---|---|---|---|---|
| depois | mapa | 29 | 29 | nenhum |
| depois | lista | 29 | 29 | nenhum |
| antes | mapa | 29 | 29 | nenhum |
| antes | lista | 29 | 29 | nenhum |

O construtor não dá um número para esta célula fora do que já está no L1 dele («29 nomes, 29 slugs, 29 destinos»); concorda.

## 5 · Medição 4 · os alvos (altura mínima por largura)

| largura | mínimo (meu, depois) | construtor | concorda |
|---|---|---|---|
| 320 | 44,0 px | 44,0 px | concorda |
| 360 | 44,0 px | 44,0 px | concorda |
| 390 | 44,0 px | 44,0 px | concorda |
| 430 | 44,0 px | 44,0 px | concorda |
| 768 | 44,0 px | 44,0 px | concorda |
| 1024 | 44,0 px | 44,0 px | concorda |
| 1280 | 44,0 px | 44,0 px | concorda |

As 29 ligações ficam visíveis nas sete larguras, nas duas edições, nas duas versões (antes e depois). O mínimo de 44,0 px também se verifica no antes, nas sete larguras: o `min-height:44px` da folha já existia antes deste bloco (confirmado a ler `MapaRespira.astro` em HEAD), o que mudou foi a posição e a forma da lista, não esta garantia.

## 6 · Medição 5 · os grupos visíveis por largura

Os três grupos (continente, Madeira, Açores) estão visíveis nas sete larguras, nas duas edições, nas duas versões (antes e depois). Nenhum grupo se esconde em largura nenhuma, hoje.

| parcela | `data-alvo-abaixo-de` (depois) | presente no antes |
|---|---|---|
| continente | 351 | não (o atributo é novo deste bloco) |
| madeira | 1787 | não |
| acores | 9925 | não |

Concorda com o construtor («Os três grupos estão à vista nas sete larguras e nas duas edições») e com os valores do atributo que ele cita. Este resultado é o que sustenta a §5 do relatório dele: o interruptor que esconderia um grupo não está ligado, e por isso todos os grupos continuam sempre visíveis, mesmo tendo o número calculado já escrito na marcação.

## 7 · Medição 6 · o quadrado inscrito (a mais importante desta lista)

Segui a definição da casa (I82, `tests/inicio/mapa-distritos.mjs`): o maior quadrado que cabe dentro da área e contém o ponto representativo, rasterizado a 2 px de passo de ecrã. Contagem de distritos do continente (18 no total) cujo quadrado inscrito fica abaixo de 44 px:

| largura | abaixo de 44 (meu, depois, pt) | abaixo de 44 (meu, depois, en) | construtor | concorda | igual no antes? |
|---|---|---|---|---|---|
| 320 | 18/18 | 18/18 | (18, implícito) | concorda | sim, 18/18 |
| 360 | 18/18 | 18/18 | 18 | concorda | sim, 18/18 |
| 390 | 17/18 | 17/18 | 17 | concorda | sim, 17/18 |
| 430 | 15/18 | 15/18 | 15 | concorda | sim, 15/18 |

O brief só cita 18 (360), 17 (390) e 15 (430) por extenso; a 320 não dá número em prosa, mas a tabela do próprio construtor (§5 do relatório dele, coluna «pelo quadrado inscrito») mostra 0 de 18 a chegar aos 44 px também a 320, que é o mesmo que os meus 18 de 18 a ficar abaixo. Por isso «implícito», e não medido a mais por mim.

**A igualdade entre antes e depois, que o construtor afirma («medido a 29.08 sobre a76f829, e igual na construção deste ramo»), fica confirmada de forma independente**: medi eu própria o quadrado inscrito no sítio ao vivo (antes) e na cópia construída (depois), nas quatro larguras, nas duas edições, e os oito pares batem certo. Faz sentido: `mapa/pais.json` (a geometria e os pontos representativos) é byte a byte idêntico nos dois commits, confirmado por `diff`.

Como bónus (não pedido pelo brief, que só pede os 18 do continente, mas calculado pelo mesmo código): pela mesma medida, as 2 unidades da Madeira e as 9 dos Açores ficam sempre abaixo de 44 px, nas quatro larguras, nas duas versões. Nenhuma das 29 unidades passa dos 44 px de quadrado inscrito abaixo de 430 px de largura de mapa.

**Nota sobre o que a minha cópia do algoritmo NÃO reproduz:** a função original também calcula um «quadrado centrado no ponto», que o próprio ficheiro fonte diz não decidir nada («nenhuma das 29 o cumpre a nenhuma largura»). Não portei essa parte, por ser explicitamente irrelevante para a pergunta que o brief faz; fica dito para que a cópia não pareça mais completa do que é.

## 8 · Medição 7 · o par de estado

Testado com três unidades (uma de cada parcela: Lisboa, Ilha da Madeira, Ilha de São Miguel), a 1280, nos quatro sentidos: rato no nome, foco de teclado no nome, rato na área, foco de teclado na área. Medido com `getComputedStyle`, contra as 29 unidades de cada vez, para confirmar «e só nela» / «e só nele» sobre o conjunto inteiro e não por amostragem.

| unidade | sentido | contorno/sublinhado antes | depois | só esta unidade mudou | cor do contorno mudou |
|---|---|---|---|---|---|
| lisboa | rato no nome → área | 1px | 3px | sim | não (fica ink nos dois estados) |
| lisboa | foco no nome → área | 1px | 3px | sim | não |
| lisboa | rato na área → nome | 1px | 3px | sim | (sublinhado: cor muda de rule-strong para ink, ver medição 8) |
| lisboa | foco na área → nome | 1px | 3px | sim | |
| ilha-da-madeira | rato no nome → área | 1px | 3px | sim | não |
| ilha-da-madeira | foco no nome → área | 1px | 3px | sim | não |
| ilha-da-madeira | rato na área → nome | 1px | 3px | sim | |
| ilha-da-madeira | foco na área → nome | 1px | 3px | sim | |
| ilha-de-sao-miguel | rato no nome → área | 1px | 3px | sim | não |
| ilha-de-sao-miguel | foco no nome → área | 1px | 3px | sim | não |
| ilha-de-sao-miguel | rato na área → nome | 1px | 3px | sim | |
| ilha-de-sao-miguel | foco na área → nome | 1px | 3px | sim | |

Concorda com o construtor nos doze casos: 1px → 3px, nos dois sentidos, só na unidade certa, cor do contorno inalterada (confirmado explicitamente, não só por omissão: `areasCorQueMudaram` fica vazio nos doze casos). O construtor testou uma unidade e uma testemunha (Faro); eu testei três unidades contra as 29, o que é uma verificação mais larga do «e só nela» do que a dele, e concorda com a dele onde se sobrepõem.

**Uma simplificação de método, dita:** o foco de teclado foi accionado por `elemento.focus()` programático, não por pressões reais de Tab, para as três unidades. Validei uma vez, à parte, que isto produz o mesmo estado que um Tab real neste Chromium: cheguei a «Lisboa» com 141 pressões de Tab a partir do topo da página, e o `:focus-visible` ficou verdadeiro nos dois métodos (`focus()` e Tab real). Não repeti as 141 pressões para as outras duas unidades; fica como «não medido por Tab real, medido por foco programático validado uma vez contra Tab real».

## 9 · Medição 8 · o contraste

Lido por uma sonda (um elemento temporário com `color:var(--token)`, cuja `getComputedStyle().color` o navegador tem de resolver por inteiro), não pelo texto do custom property. Testei as duas formas e dão o mesmo valor.

| par | esquema | eu | construtor | concorda |
|---|---|---|---|---|
| ink / paper | claro | 16,39:1 | 16,39:1 | concorda |
| rule-strong / paper | claro | 3,47:1 | 3,47:1 | concorda |
| ink / paper | escuro | 15,38:1 | 15,38:1 | concorda |
| rule-strong / paper | escuro | 5,80:1 | 5,80:1 | concorda |

A fórmula usada é a da WCAG 2.x (luminância relativa, depois a razão `(L1+0,05)/(L2+0,05)`), validada contra os valores de manual no positivo KP8.

## 10 · Medição 9 · as linhas de nome dos painéis

| edição | painel | texto (meu, depois) | bate com a contagem real |
|---|---|---|---|
| pt | Procedimento | «Procedimento dos Desequilíbrios Macroeconómicos · 13 medidas com limiar» | sim, 13 peças (`article.peca`) contadas na página |
| pt | Social | «Painel Social Europeu · 8 medidas» | sim, 8 linhas (`.social-linha`) contadas na página |
| en | Procedimento | «Macroeconomic Imbalance Procedure · 13 measures with a threshold» | sim, 13 |
| en | Social | «European Social Scoreboard · 8 measures» | sim, 8 |

Os quatro textos batem, carácter a carácter, com os que o brief cita. As duas contagens (13 e 8) batem com o número de peças e linhas que a própria página contém, nas duas edições; concorda.

**No antes:** `.painel-nome` não existe (confirmado no DOM ao vivo, e na leitura de `HomeView.astro`/`ListaSocial.astro` em HEAD, onde essa classe não existe). `.social-titulo` existe mas só com o texto simples («Painel Social Europeu» / «European Social Scoreboard»), sem contagem nem `data-prova`. Concorda com a descrição do construtor («duas linhas saíram, que eram o nome do Painel Social sozinho»).

## 11 · Medição 10 · os bytes da primeira página

| edição | HTML antes (meu) | HTML depois (meu) | diferença | `<style>` do par (meu, depois) | construtor |
|---|---|---|---|---|---|
| pt | 148 671 bytes (145,19 KB) | 155 608 bytes (151,96 KB) | +6937 bytes | 6461 bytes | 6461 (concorda); 145,2→152,0 KB (concorda) |
| en | 150 888 bytes (147,35 KB) | 157 821 bytes (154,12 KB) | +6933 bytes | 6461 bytes | 6461 (concorda) |

O construtor só dá o par de KB para pt («145,2 KB» → «152,0 KB»), sem número para en. Os meus 145,19 KB e 151,96 KB batem com os dele quando arredondados à mesma casa decimal (151,96 arredonda a 152,0). Os 6461 bytes do bloco `<style>` batem exactamente, nas duas edições (medi o elemento inteiro, marcas incluídas, que é a mesma base que reproduz o número dele). No antes, o bloco `<style>` do par não existe em nenhuma das duas edições, como esperado (é marcação nova deste bloco).

## 12 · Medição 11 · os documentos originais

Rota escolhida: `/estudos/agua-nao-faturada/documento/`. Nenhuma das cinco marcas do bloco aparece: sem `data-lista-porta`, sem `.painel-nome`, sem `data-alvo-abaixo-de`, sem `.social-titulo` com `data-prova`, sem o `<style>` do par. Concorda com «nada disto lá entra».

## 13 · O que não medi, e porquê

* **A composição exacta de `@media (pointer:coarse)`** (que regra, sobre que elemento) não foi diagnosticada até ao selector; confirmei só que existe (três ocorrências em `_astro/Base.*.css`) e testei o efeito do `isMobile` numa só largura (320, pt, depois: 90 px de diferença). Não medi se a diferença é a mesma nas outras larguras, porque a decisão de método (não usar `isMobile`) já ficou tomada com esse único teste, e usei sempre a mesma receita nas sete larguras a partir daí.
* **O foco de teclado por Tab real**, unidade a unidade: só confirmei uma vez, para Lisboa (141 pressões), que `elemento.focus()` programático dá o mesmo `:focus-visible` que um Tab real neste Chromium. Para a Ilha da Madeira e a Ilha de São Miguel usei `focus()`, não Tab real; não medido por Tab real nessas duas, por eficiência, com a validação de método já feita a dizer que as duas formas coincidem.
* **O «quadrado centrado no ponto»**, uma segunda medida que existe no código original ao lado do quadrado inscrito: não portei essa parte, porque o próprio ficheiro fonte diz que ela não separa nada («nenhuma das 29 o cumpre a nenhuma largura»), e o brief não a pede.
* **Bytes comprimidos (gzip/brotli) de transferência**: medi bytes do documento HTML tal como servido, sem compressão, que é a mesma base que o «145,2 KB → 152,0 KB» do construtor usa. Não medi o tamanho depois de comprimido, porque não foi pedido e o construtor também não o dá.
* **Páginas de distrito ou de região individuais**: o brief pede a primeira página (mapa, lista, painéis); não medi nenhuma página de distrito, porque nenhuma das onze medições a pede.
* **Um quinto ou sexto pedido ao sítio no ar** para confirmar alguma coisa por segunda vez: não fiz. Cada uma das quatro páginas (pt telemóvel, pt ecrã, en telemóvel, en ecrã) foi pedida exactamente uma vez; onde uma segunda medição parecia útil (por exemplo, repetir a 1280 sozinha), usei antes os dados já colhidos nesse mesmo pedido, por `setViewportSize`, que não gera pedido novo.

## 14 · O custo em símbolos

Medido pela diferença do orçamento de símbolos da sessão, lido nos avisos de sistema: 15 000 000 no início da conversa, 14 692 071 símbolos restantes depois de escrever este relatório (antes da mensagem final). **Consumo aproximado: 308 mil símbolos.** É o mesmo método que o construtor usou (diferença do orçamento da sessão), e tem a mesma reserva: conta tudo o que li e escrevi, incluindo a exploração do repositório principal para encontrar e confirmar a definição do quadrado inscrito, não é uma factura.

## Segunda ronda (M11b), depois dos seis consertos

# RELATÓRIO M11b · a segunda medição do mesmo bloco, depois dos seis consertos

*Medidora: Claude Sonnet. Código próprio em `medir-b.mjs`, que reaproveita `nucleo.mjs` (as mesmas funções partilhadas da M11: `novaPagina`, `vaiA`, `medePar`, `pontoDeEcra`, `arrancaServidor`). Esta ronda não pede nada ao sítio no ar: compara duas cópias locais, `m11-dist/` (a cópia antiga, a mesma da M11) em `127.0.0.1:5057` e `m11b-dist/` (a cópia nova, ramo `d8c3ae3`) em `127.0.0.1:5058`, cada uma na sua porta porque cada cópia tem os seus próprios ficheiros `_astro/` com nomes diferentes, e servir as duas da mesma origem faria uma pisar os caminhos absolutos da outra. Resultados brutos completos em `resultados-b.json`.*

## 0 · Os positivos conhecidos desta ronda

Cinco detectores novos, cada um confirmado numa cópia estragada de propósito (`estragos-b/`, nunca `m11b-dist/`) antes de medir a página verdadeira.

| detector | o que estraguei | esperado | obtido | resultado |
|---|---|---|---|---|
| B-KP1a alvo estreito | forcei a largura de «Beja» a 16 px, mantendo a altura boa | largura de Beja < 44, mínimo da largura da janela < 44 | 16 e 16 | passou |
| B-KP1b alvos sobrepostos | Beja e Braga ancorados ao mesmo `top`/`left` fixo do ecrã | o par [beja,braga] aparece nas sobreposições | exactamente isso | passou |
| B-KP2 pontuação | `::after{content:"."}` injectado nos itens | pelo menos um item com conteúdo real no `::before`/`::after` | 3 itens marcados | passou |
| B-KP4 atributo velho presente | `data-alvo-abaixo-de="123"` injectado num grupo | a régua conta 1 ocorrência, não 0 | 1 | passou |
| B-KP5 ordem do documento | duas páginas sintéticas, lista antes e depois do mapa | `compareDocumentPosition` acerta nos dois sentidos | acertou nos dois | passou |

**A primeira tentativa do B-KP1b falhou** (deslocar as duas com `left:-999px` relativo não as fazia coincidir, porque um deslocamento relativo igual preserva a distância que já existia entre elas no fluxo normal). Corrigido para `position:fixed` com o mesmo `top`/`left` nas duas, que ancora ao ecrã e não ao fluxo. Fica registado pela mesma razão que o tropeço do KP1 da M11: é o método a funcionar.

## 1 · Alvos em duas dimensões

| largura | mínimo L×A (meu, pt) | mínimo L×A (meu, en) | construtor | concorda |
|---|---|---|---|---|
| 320 | 44,0 × 44,0 | 44,0 × 44,0 | 44,0 × 44,0 | concorda |
| 360 | 44,0 × 44,0 | 44,0 × 44,0 | 44,0 × 44,0 | concorda |
| 390 | 44,0 × 44,0 | 44,0 × 44,0 | 44,0 × 44,0 | concorda |
| 430 | 44,0 × 44,0 | 44,0 × 44,0 | 44,0 × 44,0 | concorda |
| 768 | 44,0 × 44,0 | 44,0 × 44,0 | 44,0 × 44,0 | concorda |
| 1024 | 99,3 × 44,0 | 99,3 × 44,0 | 99,3 × 44,0 | concorda |
| 1280 | 99,3 × 44,0 | 99,3 × 44,0 | 99,3 × 44,0 | concorda |

Zero pares de rectângulos que se intersectam, nas sete larguras, nas duas edições (testados todos os pares entre nomes visíveis, não só os vizinhos).

**Beja e Faro na cópia antiga (`m11-dist`), confirmado como o brief pede:**

| unidade | eu (320 a 768, todas iguais) | construtor |
|---|---|---|
| Beja | 27,75 × 44 | 27,8 × 44 |
| Faro | 29,03 × 44 | 29,0 × 44 |

Concorda (27,75 arredonda a 27,8; 29,03 arredonda a 29,0). Medido nas cinco larguras onde a forma em linha da M11 se aplicava (320 a 768); o valor não muda com a largura, porque nessa forma antiga a largura de cada nome vinha só do texto, nunca do contentor.

## 2 · Sem pontuação

Zero itens com `::before` ou `::after` de conteúdo real, nas sete larguras, nas duas edições. O `column-gap` computado da `ul` de cada grupo (bónus, o brief só pede para o ler, sem número para comparar):

| largura | continente | madeira | açores |
|---|---|---|---|
| 320 | 12px | 12px | 12px |
| 1280 | 25,6px | normal | normal |

Os 25,6px a 1280 batem com a fórmula que a folha declara para o continente (`clamp(18px,2vw,30px)`: 2% de 1280px são exactamente 25,6px, dentro do intervalo). Madeira e Açores não entram na regra de duas colunas do continente, e por isso ficam em `normal` (não é `column-gap` que decide o espaço deles nesta forma).

## 3 · A ordem do documento

| | construtor | eu | concorda |
|---|---|---|---|
| lista antes do mapa no DOM | sim | sim, nas sete larguras, nas duas edições (`compareDocumentPosition`) | concorda |
| acima de 1024, lista à esquerda do mapa no ecrã | sim | sim: a 1280, lista em x=94 a 676, mapa em x=696 a 1186 (colunas diferentes, sem sobreposição) | concorda |
| abaixo de 1024, mapa acima da lista no ecrã | sim | sim: a 320, `order` de `.cabeca-inst` (mapa) é 4 e o de `.mapa-ilhas` (lista) é 5; a 768 são 1 e 2; em ambos os casos o mapa vem primeiro na ordem visual | concorda |

Valores de `order` lidos (não citados pelo brief com números, só a direcção; ficam aqui para quem quiser conferir): a 320 a 430, `.cabeca-col`=1, `.cabeca-inst`=4, `.mapa-ilhas`=5; a 768, `.cabeca-col`=0, `.cabeca-inst`=1, `.mapa-ilhas`=2 (uma escala de números diferente, mesma ordem relativa); a 1024 e 1280 os três lêem 0, porque deixa de ser um `order` de flexbox a decidir e passa a ser posição de grelha (`grid-area`).

## 4 · A regra das duas formas

| | construtor | eu | concorda |
|---|---|---|---|
| `data-alvo-abaixo-de` na página | 0 ocorrências | 0, nas sete larguras, nas duas edições | concorda |
| uma só `ul` por grupo, disposição diferente por largura | é a mesma `ul` | confirmado: sempre 3 elementos `.mapa-ilhas-lista` na página (um por grupo), em todas as larguras; não há uma segunda estrutura paralela que apareça e desapareça | concorda |

## 5 · O par, nos 29 pares

| | construtor | eu |
|---|---|---|
| unidades testadas | pede «todos» | as 29 |
| casos por unidade | 2 sentidos × 2 modos | hoverNome, focoNome, hoverArea, focoArea = 4 |
| total de casos | 29 × 2 × 2 = 116 | 116 |
| casos correctos («só na unidade apontada») | (não dá número, pede para eu dizer) | 116 de 116 |

As 116 combinações (29 unidades × rato/teclado × nome→área/área→nome) mudam a propriedade certa (1px→3px) e só na unidade apontada, nenhuma vez a mais nem a menos. O mecanismo é o mesmo `:has()` da M11 (confirmado: o bloco `<style>` inline continua a ter 6461 bytes, igual), só a chamada ao meu `medePar()` (já usado e validado na M11, positivo KP3) passou a correr para as 29 em vez de 3.

## 6 · As alturas da página, a 390 e a 1280

| largura | edição | eu | construtor | concorda |
|---|---|---|---|---|
| 390 | pt | 7383 | 7383 | concorda |
| 390 | en | 7357 | 7357 | concorda |
| 1280 | pt | 4003 | 4003 | concorda |
| 1280 | en | 3987 | 3987 | concorda |

As alturas a 1280 são as mesmas da M11 (o construtor não mudou nada acima de 1024 nesta ronda de consertos); a 390 baixam de 7339/7313 (M11) para 7383/7357, ligeiramente mais alto, o que é coerente com a rede a duas dimensões ter espaço extra por causa do `min-width` e do `column-gap`, ao contrário da forma anterior que só media altura.

## 7 · O que não medi, e porquê

* **As restantes cinco larguras da medição 6**: o brief só pede 390 e 1280; as outras seis (320,360,390,430,768,1024) já saem de qualquer forma da colheita geral da secção 1 a 5, por isso estão em `resultados-b.json` mesmo sem tabela própria aqui.
* **O mecanismo exacto por trás do `order` mudar de escala numérica entre 320 a 430 (1,4,5) e 768 (0,1,2)**: medido e citado, não investiguei a folha para explicar a diferença de escala, porque a pergunta do brief é a direcção (mapa antes da lista), não o número em si, e a direcção bate nos dois casos.
* **Um quinto ou sexto positivo conhecido para o detector do «par nos 29 pares»**: não fiz um novo, porque é o mesmo detector `medePar()` já confirmado no positivo KP3 da M11 (que prova que ele vê correctamente a ausência de mudança quando a folha do par está vazia); rodá-lo 29 vezes em vez de 3 não muda o que o detector é.

## 8 · O custo em símbolos

A M11b corre na mesma sessão que a M11, medida pelo mesmo método (diferença do orçamento de símbolos, lido nos avisos de sistema): 15 000 000 no início da conversa, 14 582 284 no fim desta segunda ronda. **Consumo aproximado das duas rondas juntas: 418 mil símbolos.** A M11 sozinha, até à escrita do primeiro relatório, tinha gasto uns 308 mil (secção 14 do `RELATORIO-M11.md`); a M11b, incluindo o desvio de código para `nucleo.mjs` para partilhar `medePar` e `pontoDeEcra` entre as duas rondas, gastou uns 110 mil.
