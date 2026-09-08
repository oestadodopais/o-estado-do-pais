# Brief F1.1e · Os distritos e as ilhas voltam ao mapa, e cada um cresce para os seus concelhos (08.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 08.09.2026 à tarde, a partir do que o diretor viu na primeira página no telemóvel depois de o F1.1d chegar ao ar, e do que disse a seguir, corrigindo a primeira leitura do lugar de direção: «the map on the first page we had before was quite alright»; o mapa de pontos de que se queixara era o localizador pequeno das páginas dos concelhos («not really useful because it doesn't work, and it's too small»); com o mapa anterior «we can select Évora and we have all the municipalities … then we can select Beja or Viseu; those ones are recognizable; the other one, a full Alentejo with all the things, it's not easy to go about». Uma primeira versão deste brief, escrita a meio da tarde sobre as sub-regiões NUTS III, ficou substituída por esta; a pergunta que o lugar de direção fez (NUTS III ou os 29 distritos e ilhas) estava mal posta, porque partia do nível das regiões como dado, e a resposta certa era a que ele deu a seguir. Corre numa worktree própria a partir de `main`; pode correr em paralelo com o que resta do F1.10, porque toca nos ficheiros do mapa que o F1.10 não toca. Constrói o Opus; lê a frio o Codex com cinco plantas; o Sonnet mede às cegas os alvos. Sem travessões na prosa.*

## 0 · O que este bloco é

O nível do país do mapa da primeira página volta a ser **as 29 unidades da Carta** (os 18 distritos, as duas ilhas da Madeira e as nove dos Açores), que são as áreas que um leitor português reconhece pelo nome, e cada unidade **cresce para os seus concelhos** com a mecânica que o F1.1d construiu para as regiões: o toque ou o clique numa unidade mostra os concelhos dela, o nome da área apontada fica num lugar fixo com a porta para a sua página, o primeiro toque nunca navega, «Voltar ao país» sobe, o endereço regista o nível, e sem guião as unidades são ligações para as suas páginas com a lista fechada dos nomes por baixo. As nove regiões NUTS II saem do desenho da primeira página; continuam a ter página (`/regioes`) e a régua, alcançáveis pelo menu. A geometria das unidades já existe (`mapa/pais.json`, as 29 áreas que o F1.1 desenhou) e a dos concelhos de cada unidade também (`mapa/distritos/<unidade>.json`); o F1.1d mediu que no nível de uma unidade 84 dos 308 concelhos chegam aos 44 px (mediana 34 px), contra 20 (mediana 16) no nível de uma região.

## 1 · O que entra

1. **O nível do país com as 29 unidades**, cada uma uma ligação para `/distritos/<slug>` (`/en/districts/<slug>`), com o lugar do nome do F1.1d (o nome ao passar, ao focar e ao tocar; a porta «Abrir →»); as unidades pequenas (as ilhas, os distritos estreitos) respondem-se pelo lugar do nome e pela lista fechada, como o F1.1 e o F1.1d já decidiram; nenhuma lista aberta volta.
2. **O nível da unidade**: ao tocar ou clicar numa unidade, os seus concelhos, lidos do ficheiro que a área nomeia (os `mapa/distritos/*.json` já existentes, servidos em `public/dados/mapa/` como o F1.1d fez para as regiões, ou lidos do que já lá está); cada concelho com o nome no lugar e a porta para a sua página; o segundo toque, ou a porta, abre o concelho; «Voltar ao país» sobe; o endereço regista `#unidade=<slug>`.
3. **As regiões saem do desenho**: o gerador das nove regiões, as regras R8 a R10 do portão e os ficheiros gerados (`src/data/mapa-regioes.gerado.json`, `public/dados/mapa/regiao-*.json`) saem do repositório se nada os ler (o construtor confere e di-lo), ou ficam se alguma página ainda os ler; a lista fechada dos nomes passa a ter só as 29 unidades; a régua `tests/inicio/mapa-regioes.mjs` reescreve-se para as unidades (o nome do ficheiro pode mudar, com a razão) e as células M1 e M2 de `mapa-distritos.mjs`, retiradas no F1.1d, voltam com a conta do quadrado do F1.1d.
4. **A página do concelho** (o 8.17 do brief do F1.10): o mapa que substituiu o cartador dos pontos passa a ser o nível da **unidade** do concelho (o seu distrito ou a sua ilha, com os concelhos dela e o da página marcado), com o mesmo componente; se o F1.10 tiver posto o nível da região, troca-se aqui.
5. **As cadeias** («Toque numa região» passa a «Toque num distrito ou numa ilha», e as gémeas), no inventário da voz com a origem; as de região passam a `retirada`.

## 2 · O que não entra

As sub-regiões NUTS III (a primeira versão deste brief; não é o que o diretor pediu); páginas novas; qualquer mudança à manchete, à faixa, às leituras ou à busca; nenhum número novo; nenhuma cor nem tipo novos; a página de uma região continua sem mapa (Emenda 21 (d)).

## 3 · As medidas de aceitação (escritas antes)

| # | medida | como se mede |
|---|---|---|
| U1 | os alvos: as 29 unidades a 390 e a 1 280 (quantas chegam aos 44 px, a mediana), e os 308 concelhos no nível da sua unidade a 390 (quantos chegam aos 44 px, a mediana, o menor), contra os 20 de 308 e a mediana de 16 px do nível das regiões (F1.1d); a medida é a subida, dita, e não os 44 px em todos: o diretor escolheu a área que se reconhece pelo nome, e isso fica escrito | a régua do F1.1d reescrita para as unidades, e o Sonnet às cegas numa cópia, com a definição do quadrado escrita (o da grelha que contém o ponto, e o centrado ao lado) |
| U2 | o nome no lugar em 29 de 29 unidades e numa amostra de 30 concelhos, ao passar, ao focar e ao tocar, nas duas edições | Playwright, nos dois motores para o toque |
| U3 | o primeiro toque numa unidade ou num concelho nunca navega; o segundo, ou a porta, abre a página certa; «Voltar ao país» e o botão de voltar do navegador sobem | Playwright |
| U4 | sem guião: 29 ligações do nível do país para as páginas das unidades, todas a responder, a lista fechada com as 29, `#unidade=` ignorado sem erro; 0 regiões desenhadas | HTML |
| U5 | a altura de `/` a 390 igual ou menor do que a de partida (`c9823939`, a medida da P5 do F1.1d) | geometria |
| U6 | o portão: cada concelho desenhado uma vez na unidade que a Carta lhe dá; os ficheiros que nada lê fora do repositório, ou a razão de ficarem | `check:mapa` |
| U7 | a página do concelho com o nível da unidade, 0 pontos, o concelho marcado, a porta a abrir o vizinho apontado | Playwright |
| U8 | as réguas de `tests/inicio` verdes ou reescritas com a razão; os três portões a 0; as cadeias no inventário com origem | os três comandos |
| U9 | plantas vermelhas e depois verdes: uma unidade sem nome; um concelho na unidade errada; o primeiro toque a navegar; a lista aberta por defeito; uma região a voltar ao desenho | a régua |

## 4 · A disciplina e o custo

Como nos outros blocos do mapa: commits pequenos em português sem travessões, os trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`, nunca `git add -A`, nunca um número que não foi medido, o `typecheck` estrito, cada cadeia nova no inventário da voz, o relatório a começar pela tabela das medidas. Estimativa: Opus, duas passagens, da ordem de 0,4 a 0,7 M símbolos (S a M): a geometria existe, e o guião já sabe crescer uma área.

## 5 · Emenda de 08.09 (segunda passagem)

*Escrita pelo lugar de direção a 08.09.2026 à noite, depois da leitura a frio do Codex sobre a primeira passagem. Emenda o brief; não o reescreve. O que está acima fica como estava, e o que esta secção decide prevalece sobre ele onde os dois se cruzam.*

**(a) Uma unidade abre-se pela porta, e não por um segundo toque.** O item 2 escreve «o segundo toque, ou a porta, abre o concelho», e a leitura a frio apanhou que o construído não dá um segundo toque numa UNIDADE. A regra fica como está construída, por decisão: o primeiro toque numa unidade cresce-a, e o segundo toque não existe porque a área deixou de estar no desenho (o grupo do nível do país esconde-se e o contorno dela sai do ecrã, de maneira que não há alvo para o receber). Quem quer a página da unidade tem a porta «Abrir →», que ficou no lugar do nome com o mesmo gesto. A regra dos dois toques vale inteira para um **concelho**, que não cresce. A U3c da régua mede a porta e diz o que mede e porquê; a U3a e a U3d medem os dois toques no concelho.

**(b) As respostas do segundo nível chegam pela ordem que a rede quiser.** Cada gesto leva um número; a resposta de um pedido só se aplica se for a do último gesto e se o fragmento ainda for o dela; o histórico escreve-se pela ordem dos gestos; limpar o fragmento com um pedido pendente descarta a resposta. Duas células novas: a **U3f** (duas respostas atrasadas por `page.route`, a ordem trocada) e a **U3g** (o fragmento limpo a meio de um pedido lento), cada uma com a sua planta.

**(c) Uma página esperada em falta é vermelho, e não silêncio.** O portão do mapa ganha a regra **R9**: as duas edições da primeira página, as 29 páginas de unidade nas duas edições (58 afirmados e não impressos), as páginas de concelho que a Carta dá nas duas edições, os dois índices dos concelhos e as duas páginas da linha da Carta. Três plantas, uma por família: apagar uma página construída e ver a célula vermelha.

**(d) As molduras da Madeira e dos Açores não se intersectam.** Vem do F1.1c e não deste bloco, e é o bloco do mapa que o corrige. A 390, a 768 e a 1280 as duas molduras não se cruzam, e cada polígono das duas unidades da Madeira (incluindo as Selvagens, que fazem a moldura alta) e das nove ilhas fica dentro da sua moldura. A disposição recomendada, e não imposta, é os Açores por cima da Madeira e os dois à esquerda do continente, que é a geográfica. A medida entra na régua (célula **U10**) e as capturas do país refazem-se.

**(e) O copiador e a R8 são donos só do padrão `unidade-*.json`.** Um `unidade-*.json` fora do conjunto das 29 sai com mensagem; qualquer outro ficheiro de `public/dados/mapa/` não se toca nem se conta. Conhecido-positivo com um ficheiro estranho na pasta que sobrevive: célula **U11**.

**(f) As três plantas de `lista.mjs` que não mordiam** (L1, L12 e L9) passam a morder, ou saem com a razão escrita na régua; `lista.mjs --vermelhos` sai a 0 e o relatório diz a conta.

**(g) O que se mede e como se conta.** Os nomes esperados da U2 leem-se da Carta e nunca do `<title>` do SVG; a U1c compara os 308 slugs como conjunto exacto, uma ligação cada; a mediana com `n` par é a média dos dois do meio, nos dois guiões. O relatório ganha a secção «O que um pacote de leitura não reproduz», e `distritos-medidas.json` guarda os resumos das quatro réguas com a data.
