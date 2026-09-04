# Brief F1.10 · Uma coisa, um lugar (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.10 do plano, da leitura de um leitor de primeira vez (`design/especime-v3/critica/2026-09-04-codex-leitor-de-primeira-vez.md`, seis repetições distintas e um vocabulário com quatro nomes para a mesma coisa) e das decisões do lugar de direção pela delegação do diretor de 04.09 (`DECISIONS.md` §1.98 e a sua segunda emenda). Corre depois de F1.1b, F1.4 e F1.7 se fundirem, porque toca nos mesmos ficheiros. Sem travessões na prosa.*

## 0 · A regra

Cada conteúdo tem **um lugar de apresentação inteira**; em todo o outro sítio aparece como **uma porta** (um nome e uma ligação) ou não aparece. Um nome por coisa em todo o sítio. Uma busca. O caminho de cada página dito no cabeçalho. Um bloco que acrescente uma segunda forma de chegar ao mesmo sítio não se funde.

## 1 · As decisões, uma por repetição (tomadas; o construtor aplica)

| conteúdo | o lugar inteiro | o que as outras aparições passam a ser |
|---|---|---|
| os 308 concelhos | `/municipios`, a lista agrupada pelas 29 unidades, filtrada pela busca (F1.7 fá-lo) | na primeira página, a busca (submete para `/municipios`) e o mapa com os 29 nomes; nas tabelas dos mapas do domínio, a lista fica fechada como alternativa em texto do mapa e cada nome passa a ser porta para a página do concelho; a página do concelho tem «trocar de concelho» |
| as 21 medidas do país | a faixa da primeira página com a leitura breve a abrir do cartão (F1.1b) | os painéis de baixo saem (F1.1b); no domínio, as três medidas partilhadas (dívida pública, taxa de emprego, taxa de desemprego) são do domínio, e na primeira página o cartão delas abre só uma linha com o valor e a porta «Ver no domínio →», sem reler |
| as linhas do livro-razão | `/livro-razao`, um só índice com busca sobre as 2 916 linhas (as gerais e as dos concelhos juntas; F1.4 põe a busca) | nas páginas de consumo, o valor com o selo e as três datas (regra da casa); o título do documento, o histórico das conferências e os outros campos só na página da linha |
| as 29 unidades | `/distritos` | na primeira página, a lista dos nomes fica, porque é o texto do mapa (uma fonte, duas formas); em `/municipios`, só como cabeçalhos de grupo |
| as 9 regiões | `/regioes`, a régua inteira | a página de uma região mostra o seu valor selado e uma porta «Comparar as regiões →» em vez de copiar a régua e a lista inteiras |
| os estudos | `/estudos` | a página do concelho lista os títulos dos estudos sobre ele (só títulos, com ligação) e uma porta «Os n estudos sobre este concelho →» para `/estudos` filtrado por concelho (`?concelho=`); as sinopses saem |
| os domínios e as áreas | `/dominios` e `/areas` (já são um só lugar cada) | «Trabalho» no índice dos domínios aparece dentro de «Economia e finanças públicas» (indentado, «incluído em»), não como par; cada índice ganha uma frase de hierarquia |

## 2 · O que entra além da tabela

1. **A frase de definição na primeira página**, uma vez, abaixo do nome: «Um observatório de Portugal: cada número com a sua fonte, lido por território, por domínio e em estudos.» (sem adjetivos, sem falar de confiança; declarada no inventário da voz com origem: esta decisão).
2. **A frase de hierarquia em cada índice:** em `/dominios` («Um domínio é um assunto da carta dos conteúdos; uma área de governo é um ministério»), em `/areas` (a mesma, invertida), em `/municipios`, `/distritos` e `/regioes` («O país lê-se em quatro níveis: país, região NUTS II, distrito ou ilha, concelho; as regiões não contêm distritos inteiros»; a última afirmação só se for verdadeira na CAOP, e o construtor confere-a nos dados do sítio antes de a escrever).
3. **O vocabulário fechado**, aplicado a todo o sítio nas duas edições: «medida» para o número interpretado, «linha do livro-razão» (ou «linha») para a evidência, «estudo» para o trabalho de autor (não «trabalho»), «domínio», «área de governo», e para o território «país, região, distrito, concelho» (a palavra visível é «concelho»; o menu diz «Concelhos»; os endereços `/municipios` não mudam). «Relance» e «Leitura breve» ficam só como os nomes das duas densidades de um cartão, nunca como títulos de secção; «painel» só para os dois quadros da União; «indicador» e «peça» saem. Cada cadeia mudada entra no inventário da voz.
4. **«fonte» diz sempre o publicador** da linha (o `source` da linha), nunca um estudo intermediário nem «Quadro institucional»; onde a linha vem de um estudo da casa, o selo diz «linha» e a página da linha diz a proveniência.
5. **O caminho no cabeçalho**: cada página abaixo da primeira mostra o seu caminho («Início › Concelhos › Évora»; «Início › Domínios › Economia e finanças públicas»), como texto com ligações, sem guião.
6. **A busca é uma**: o campo da primeira página e o de `/municipios` são o mesmo componente; o índice do livro-razão tem o seu (F1.4), com o mesmo aspeto.

## 3 · O que não entra

Nenhum número novo; nenhuma mudança à identidade; nenhuma frase sobre a casa além das duas frases de definição e de hierarquia; nenhum guião de que a página precise; nada nos documentos alojados nem nas páginas de leitura.

## 4 · Onde se constrói

Ramo `lugar-2026-09-04` numa worktree própria a partir de `origin/main` **depois de F1.1b, F1.4 e F1.7 fundidos** (o lugar de direção diz o SHA). Ficheiros: as vistas dos índices e das páginas de território e de domínio, o `Masthead`, o `SiteFooter`, os componentes da primeira página, `src/i18n/strings.mjs`, `src/data/figuras.mjs`, as réguas, `design/especime-v3/medicoes/lugar-construtor.md`, `CHAVES-EN.md`.

## 5 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| L1 | as três tarefas do leitor em ≤ 2 toques a partir de `/` (o meu concelho e os seus números; o que é uma medida e de onde vem; que estudos existem), sem bifurcação: nenhum ecrã com duas ligações para o mesmo destino fora do cabeçalho e do rodapé | o percurso escrito e uma régua que conta, por página, destinos repetidos fora do cabeçalho e do rodapé |
| L2 | cada conteúdo da tabela §1 com um só lugar de apresentação inteira: os 308 nomes ligados só em `/municipios` (fora das listas fechadas dos mapas); a régua inteira só em `/regioes`; as sinopses dos estudos só em `/estudos`; os painéis de baixo a 0 na primeira página | scripts sobre o `dist/` |
| L3 | 0 nomes diferentes para a mesma coisa: «município(s)» visível a 0 fora dos endereços; «indicador(es)» a 0; «peça(s)» a 0; «trabalho(s)» a 0 como nome de estudo; «Relance» e «Leitura breve» só dentro de cartões | grep sobre o `dist/` nas duas edições, com as exceções listadas |
| L4 | a frase de definição a 1 em `/` e `/en`; a frase de hierarquia a 1 em cada um dos cinco índices | grep |
| L5 | o caminho no cabeçalho em 100 % das páginas abaixo da primeira, com ligações que existem | script |
| L6 | «fonte» a dizer o publicador em 100 % dos selos (comparado com o `source` da linha) | script |
| L7 | o Codex a reler as mesmas treze páginas depois e a contar as repetições que ficaram (o lugar de direção corre a leitura; a régua do bloco é a contagem a descer de 6 para 0 fora do que a §1 decide manter) | a leitura |
| L8 | `npm run build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos; todas as réguas verdes ou reescritas com a razão; `check:voz` com as cadeias novas e mudadas declaradas | os três comandos |
| L9 | plantas vermelhas e depois verdes: uma segunda lista dos 308 de volta; «município» visível; a régua das regiões copiada numa região; uma sinopse na página do concelho; o caminho a faltar numa página | a régua |

## 6 · O que se entrega e a disciplina

O relatório com L1 a L9 antes e depois, capturas de `/`, `/municipios`, uma região e um concelho a 390 × 664 e 1 280 nas duas edições em `design/especime-v3/capturas/lugar-2026-09-04/`, a régua com as plantas, o SHA e a corrida `portao` verde. Empurra e espera o verde; não fundes em `main`. Commits pequenos em português sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido; o `typecheck` é estrito. Estimativa: Opus, duas passagens, da ordem de 0,8 a 1,2 M símbolos (M a L).
