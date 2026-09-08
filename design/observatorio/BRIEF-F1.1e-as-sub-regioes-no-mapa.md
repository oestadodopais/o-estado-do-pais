# Brief F1.1e · As sub-regiões no mapa: o nível entre a região e os concelhos (08.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 08.09.2026 à tarde, a partir do que o diretor viu na primeira página no telemóvel depois de o F1.1d chegar ao ar («it has a big massive region, Alentejo, with all the municipalities inside … all those that were already there before, now they're gone») e da resposta dele à pergunta do lugar de direção sobre qual é o nível do meio: **as sub-regiões NUTS III** (Alentejo Litoral, Alto Alentejo, Alentejo Central, Baixo Alentejo, Beira Baixa e as outras, 24 no continente), e não os 29 distritos e ilhas. Corre numa worktree própria a partir de `main` depois do F1.1d (já no ar); pode correr em paralelo com o que resta do F1.10, porque toca nos ficheiros do mapa que o F1.10 não toca. Constrói o Opus; lê a frio o Codex com cinco plantas; o Sonnet mede às cegas os alvos, porque o bloco existe por um número. Sem travessões na prosa.*

## 0 · O que este bloco é

O mapa da primeira página passa a três níveis no continente: **o país** (as nove regiões NUTS II, como hoje), **a região** (as suas sub-regiões NUTS III, desenhadas como áreas com o nome no lugar), e **a sub-região** (os seus concelhos, cada um tocável, como o nível da região faz hoje). Nas duas regiões autónomas a região é a sua própria NUTS III e não há nível do meio: a região abre logo os concelhos. O F1.1d mediu que, à escala da região, só 20 dos 308 concelhos chegam aos 44 px (mediana 16 px); a razão deste bloco é subir esse número e devolver ao leitor as áreas mais pequenas a que ele apontava antes, com os nomes que o sítio já usa (a página de cada concelho diz a sua sub-região: «Alentejo Central» em Évora).

## 1 · O que entra

1. **A geometria das 24 sub-regiões do continente**, gerada na construção pelo mesmo gerador do F1.1d (`scripts/mapa-regioes.mjs`, ou um irmão seu): a coluna `nuts3` dos três ficheiros `public/dados/caop-2025-municipios-*.csv` dá a sub-região de cada concelho, e a união faz-se pela mesma conta das regiões (as unidades da Carta cortadas pelas fronteiras entre concelhos de sub-regiões diferentes), num ficheiro gerado com o sha256 das fontes e num ficheiro por sub-região em `public/dados/mapa/` para o guião carregar quando ela abre; o portão do mapa ganha as regras (a união dos concelhos de cada sub-região é a sub-região, os 278 concelhos do continente uma vez cada e na sub-região que a Carta lhes dá, cada sub-região dentro da sua região), com estragos que mordem.
2. **Os três níveis no guião** (`public/js/mapa-regioes.js`): ao tocar ou clicar numa região do continente crescem as suas sub-regiões; ao tocar numa sub-região crescem os seus concelhos; o lugar do nome diz o nome da área apontada em cada nível; «Voltar» sobe um nível de cada vez; o endereço regista o nível (`#regiao=alentejo`, `#sub=alentejo-central`); o primeiro toque nunca navega em nível nenhum; a porta do lugar do nome abre a página da região no nível do país, não aparece no nível da sub-região (a sub-região não tem página) e abre a página do concelho no nível dos concelhos; com rato ou teclado, como hoje.
3. **Sem guião** nada muda: as nove regiões são ligações para as suas páginas e a lista fechada dos nomes fica como está (as sub-regiões não entram nela, porque não têm página; di-lo no relatório).
4. **A página do concelho** (o item 8.17 do brief do F1.10): o mapa que substitui o cartador dos pontos passa a ser o nível da sub-região do concelho (os seus vizinhos de sub-região, o concelho da página marcado), com o mesmo componente; se o F1.10 já tiver posto o nível da região, troca-se aqui.
5. **A página de uma região** ganha o nível das suas sub-regiões como mapa? Não neste bloco: a Emenda 21 (d) diz que uma região não tem mapa; fica escrito como pergunta para o diretor.

## 2 · O que não entra

Páginas para as sub-regiões (não existem, e a hierarquia do sítio continua a ser país, região, distrito ou ilha, concelho: a sub-região é um nível do mapa, dito no inventário da voz com a razão); nenhuma mudança à manchete, à faixa, às leituras ou à busca; nenhum número novo; nenhuma cor nem tipo novos; nada nas ilhas além de dizer que não têm nível do meio.

## 3 · As medidas de aceitação (escritas antes)

| # | medida | como se mede |
|---|---|---|
| S1 | os alvos: as 24 sub-regiões a 390 no nível da região (quantas chegam aos 44 px, a mediana), e os 308 concelhos no nível em que se tocam (a 390, quantos chegam aos 44 px, a mediana, o menor), contra os 20 de 308 e a mediana de 16 px do F1.1d; a medida é a subida, dita, e não os 44 px em todos (o F1.1d mediu que isso é impossível) | a régua do F1.1d alargada, e o Sonnet às cegas numa cópia, com a definição do quadrado escrita (o da grelha que contém o ponto, e o centrado ao lado) |
| S2 | o nome no lugar em 24 de 24 sub-regiões e numa amostra de 30 concelhos no terceiro nível, ao passar, ao focar e ao tocar, nas duas edições | Playwright, nos dois motores para o toque |
| S3 | o primeiro toque nunca navega em nenhum dos três níveis; «Voltar» sobe um nível; o botão de voltar do navegador desfaz um nível; a porta do lugar do nome abre a página certa onde existe e não aparece onde não há página | Playwright |
| S4 | sem guião: 9 ligações do nível do país, a lista fechada igual, `#sub=` ignorado sem erro | HTML |
| S5 | a altura de `/` a 390 igual à de partida | geometria |
| S6 | o portão: a união de cada sub-região é a sub-região, os 278 uma só vez, cada sub-região na sua região; estragos que mordem | `check:mapa` |
| S7 | a página do concelho com o nível da sub-região, 0 pontos, o concelho marcado, a porta a abrir o vizinho apontado | Playwright |
| S8 | as réguas de `tests/inicio` verdes ou reescritas com a razão; os três portões a 0; as cadeias novas (o nome da sub-região no lugar, «Voltar à região») no inventário com origem | os três comandos |
| S9 | plantas vermelhas e depois verdes: uma sub-região sem nome; um concelho na sub-região errada; a porta a aparecer numa sub-região; o primeiro toque a navegar no terceiro nível; a lista aberta por defeito | a régua |

## 4 · A disciplina e o custo

Como nos outros blocos do mapa: commits pequenos em português sem travessões, os trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`, nunca `git add -A`, nunca um número que não foi medido, o `typecheck` estrito, cada cadeia nova no inventário da voz, o relatório a começar pela tabela das medidas. Estimativa: Opus, duas passagens, da ordem de 0,5 a 0,8 M símbolos (M): a geometria das sub-regiões é a parte grande, e o guião já sabe crescer uma área.
