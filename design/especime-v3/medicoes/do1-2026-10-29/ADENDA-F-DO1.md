# Adenda F ao mandato DO1: a família do dossiê na régua dos alvos, e a causa medida do vermelho H2 (29.10.2026, 17:10 UTC)

*A mesma sessão, a mesma worktree do sítio (ramo `do1-2026-10-29`, cabeça 02dc6db39), nada comitado. Paraste bem: a lista `FAMILIAS` de `tests/acessibilidade/alvos.mjs` tem as duas páginas dos dossiês (o DO1 pô-las lá), e a adenda D dizia o contrário; o lugar de direção corrigiu-se e mediu a causa do vermelho H2 com um guião próprio sobre o HTML construído, a 641, 768 e 1023 px, nas três páginas. Tudo o mais das adendas D e E faz-se como lá está, com o commit «DO1-8».*

## 1 · A régua dos alvos

Em `FAMILIAS`, a entrada do dossiê da casa sai com o dossiê; a do dossiê do Orçamento fica (`['dossie', { slug: 'orcamento-2027' }]`, ou a forma que lá está). A régua continua a medir a página do dossiê do Orçamento nas cinco larguras.

## 2 · A causa do vermelho H2, medida (o que o §4 da adenda D tem de curar)

Na primeira página, a 1023 px, a ligação do item das parcerias (`a[data-discussao-porta="parcerias-rodoviarias"]`) tem a caixa de 941,2 × 44 px (uma linha de título, com `padding` de 8 px em cima e em baixo), e nas duas filas de baixo da caixa (a 38 e a 42 px do topo) o dedo encontra `a.src-chip`, um selo do parágrafo do resumo que vem a seguir (`p.explicacao-p` com os selos que a DO1-2 pôs): o selo entra uns 9 px dentro da caixa da ligação, e a régua mede 34,7 px de toque. A 641 e a 768 px o título ocupa duas linhas e a caixa sobra. Na página do dossiê o mesmo selo entra na caixa da ligação pelo canto inferior direito (a 98 e a 102 px do topo numa caixa de 104 px); como ali o título ocupa duas linhas, a régua passa, mas a causa é a mesma e cura-se na origem. Decisão: (a) na primeira página e em `/o-que-se-discute/`, a forma de antes do DO1 (o §4 da adenda D), que não tem o parágrafo com selos; (b) no contexto do dossiê, o parágrafo do resumo com selos fica inteiro dentro da sua própria caixa, sem entrar na da ligação do título que o precede (procura a margem negativa, o `vertical-align` ou a altura de linha dos selos em `src/styles/`, e corrige na folha, sem alterar o aspeto do selo noutras páginas); a prova: a 641, 768 e 1023 px, nenhum ponto da caixa da ligação do título devolve um elemento que não seja a própria ligação (o lugar de direção mede-o com o seu guião sobre o teu `dist/`, porque o navegador não corre na tua sandbox: não corras `check:alvos`; constrói o `dist/` na cabeça do commit e diz no relatório que o fizeste).

## 3 · O resto

Como as adendas D e E: os §§1 a 6 e 7b da D, os §§1 e 2 da E, as conferências do §8 da D mais `check:lugar`, o relatório com o que lá se pede, e as mesmas condições de paragem. Se aparecer ainda outra lista fechada que nenhuma adenda nomeia, pára e diz, como até aqui.
