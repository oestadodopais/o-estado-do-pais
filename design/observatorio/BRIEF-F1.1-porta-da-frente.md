# Brief F1.1 · A porta da frente (03.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.1 do `PLANO-fiabilidade-2026-09-02.md` §3, da auditoria de 02.09 (§ «a porta da frente»), da auditoria de UX de 25.08 (C6, D2, D3, D6, D7) e do `BRIEF-forma-dos-dominios.md` §1 e §4. O diretor mandou a 03.09: «go ahead with F1.1 and F1.2 and keep going until all is done no need to ask me». Onde o plano pedia uma palavra dele, este brief diz qual é a suposição e ela fica escrita nos pendentes. Sem travessões na prosa.*

## 0 · O que este bloco é

A primeira página é a porta do sítio e hoje falha a primeira tarefa de um leitor: a 390 px de largura o primeiro número selado está a mais de um ecrã da manchete, os vinte e um valores da faixa repetem-se nos dois painéis de baixo, os treze indicadores não dizem quem os publica nem porque estão ali, o concelho do leitor não tem porta no primeiro ecrã, e a mobília come três linhas antes do nome. O bloco corrige isto **sem um número novo** e **sem mudar a identidade** (nome, marca, tipos, §1.86 fechada).

## 1 · O que entra (a linha F1.1 do plano, item a item)

1. **A frase de contexto por painel.** Uma frase impressa uma vez por painel, antes dos cartões, que diz o que o painel é, quem publica as medidas e os limiares, e porquê estas. As duas frases são **texto do diretor** pelo plano (§7, fase 1); ele não as escreveu e mandou não perguntar. A regra passa a ser: as frases são um **rascunho da casa escrito só com factos que as linhas do livro-razão e o registo já contêm**, e ficam nos pendentes como frase a substituir pelas palavras dele. Os factos disponíveis, lidos nas linhas (`ledger/claims/custo-unitario-do-trabalho-2025.yml`, `criancas-em-creche-2025.yml` e irmãs): `source: Eurostat`; a nota «Limiar do Procedimento relativo aos Desequilíbrios Macroeconómicos: … Valor confirmado contra a Comissão Europeia, SWD(2026) 222 (Relatório por País 2026 — Portugal)»; e, para o painel social, «Indicador principal do Painel Social Europeu» com a posição face à média da União (`src/data/figuras.mjs`, Emenda 16). O «porquê estes» está registado em `~/Instruments/ResearchHub/indicators/convergence.md` (os treze são o quadro de cabeça do Procedimento, com limiar publicado; os oito são medidas principais do Painel Social; a razão da casa é que a escolha e os limiares são de instituições e não da casa) e na Emenda 16 de `DECISIONS.md`. **Regra dura:** nada entra na frase que não esteja numa linha ou numa decisão registada; se a razão de «porquê estes oito» não estiver escrita em lado nenhum, a frase diz só o que é verdade (o que são e quem os publica) e o relatório di-lo. A frase não fala da casa nem de confiança (Emenda 15 e 18: a página diz o que a coisa é, nunca porque confiar). «Comissão Europeia» tem de aparecer em `/` e «European Commission» em `/en`. Cada frase nova entra no inventário da voz (`check:voz`, com a forma que o F0.9 acabou de fixar: as frases declaradas em `src/data/figuras.mjs` ou onde o F0.9 as pôs, com a origem de cada afirmação).
2. **A faixa impressa uma vez.** Os vinte e um valores da faixa (13 do Procedimento, 8 do Painel Social) aparecem uma vez fora das páginas de linha: o cartão da faixa abre a leitura breve da medida; o painel de baixo deixa de ser uma segunda cópia da faixa (fica a leitura breve, ou desaparece se a leitura breve passar a viver no cartão aberto). A prova é uma contagem no `dist/index.html` e no `dist/en/index.html`: cada um dos 21 valores selados uma só vez.
3. **A porta para o concelho no primeiro ecrã.** Debaixo da manchete, o campo de busca do concelho ou uma ligação «o teu concelho →» que leva ao campo; a 390 × 664 visível sem gesto.
4. **O mapa com os nomes ao lado, abertos.** As 29 unidades da Carta com nome visível e alvo de pelo menos 44 px (ou uma ligação de lista com 44 px), a lista das ilhas aberta, não fechada por defeito.
5. **«1 de 21» na faixa** e um separador visível entre os dois painéis.
6. **«Âmbito» e «Densidade» fora da página** (`grep -c 'Âmbito\|Densidade' dist/index.html` a 0): o âmbito vive no menu, a densidade no cabeçalho do painel, e a frase que os substitui é a que o `BRIEF-forma-dos-dominios.md` §4 deixou por aprovar; sem palavra do diretor, não se escreve frase nova nenhuma: os dois comandos saem e o que fica é o menu e o cabeçalho.
7. **O distrito na ficha das duas Lagoas** (Lagoa do Algarve e Lagoa dos Açores, fichas com distritos distintos).
8. **«sem limiar» fora dos cartões dos concelhos** (C14 de 25.08: a ausência de limiar diz-se por palavras na leitura breve, não como estado no cartão).
9. **O selo fora da frase da manchete dos concelhos**: a manchete é uma frase; o selo vai ao pé do número, na linha de baixo, como o `BRIEF-forma-dos-dominios.md` §1 desenha. A manchete dos 308 concelhos «sobre o número certo» é do diretor (§7): **não se muda o texto dela neste bloco**; muda-se só a posição do selo. Se a manchete de hoje contiver um número que não resolva numa linha, o portão já o teria apanhado; conferir e dizer.
10. **A mobília reduzida a uma linha no telemóvel** (D6 de 25.08: hoje 213 px de menu, língua, marca, «Painel europeu reconferido a», agenda, claro · escuro).
11. **Regiões, Distritos e Áreas no menu** (as três famílias de páginas que existem sem porta no menu).
12. **A busca como `<form>` com destino** (funciona sem guião: `<form action="/municipios" method="get">` ou o equivalente que o índice dos concelhos já saiba ler; `<form` a 1 em `/`).
13. **«308 ■ fonte» com substantivo** («308 concelhos ■ fonte», ou a forma que a régua de voz aceite).
14. **A coluna direita vazia a 1 280 antes do mapa** (D7: o vazio que o diretor viu) fechada: a 1 280 nenhuma linha da cabeça tem a metade direita vazia acima do mapa.
15. **A régua da casa a medir também 390 × 664** (o telemóvel pequeno) além de 390 × 844 e das larguras de hoje.

## 2 · O que não entra

Nenhum número novo; nenhuma medida nova; nenhuma página nova (a página do domínio é o F1.2); nenhuma mudança de tipos, cores ou marca; nenhuma frase que explique a casa; nenhum guião novo que a página precise para funcionar (tudo funciona sem JavaScript; o guião só melhora). O texto da manchete do país e a manchete dos concelhos ficam como estão. `src/lib/routes.mjs` não se toca (é do F1.2, que corre em paralelo e acrescenta as rotas do domínio). `src/views/MunicipioView.astro` não se toca (F1.2 põe lá o ganho médio).

## 3 · Onde se constrói, e a fronteira com o F1.2

- Ramo `porta-2026-09-03` numa worktree própria (`git worktree add .claude/worktrees/porta-2026-09-03 -b porta-2026-09-03 origin/main`), a partir de `origin/main` **depois da fusão do F0.9** (o lugar de direção diz-te o SHA de partida; confirma com `git log -1 --format=%h origin/main` antes de começar). Nunca `git checkout` na árvore principal; nunca `git add -A` nem `git add .`.
- **Ficheiros deste bloco** (só estes, salvo razão escrita no relatório): `src/views/HomeView.astro`, os componentes que a primeira página usa (cabeçalho, menu, busca, faixa, mapa) em `src/components/`, `public/js/inicio.js`, `src/i18n/strings.mjs` (só chaves de `inicio`, `home`, `menu`, `busca`; acrescentar, não renomear), `src/data/figuras.mjs` (só para declarar as duas frases novas na forma do F0.9), `tests/inicio/*.mjs`, `scripts/` só se uma régua nova precisar, `design/especime-v3/medicoes/porta-construtor.md` (o teu relatório), `design/especime-v3/CHAVES-EN.md` se acrescentares chaves.
- O F1.2 corre ao mesmo tempo noutro ramo e é dono de `src/lib/routes.mjs`, `src/pages/dominios/**`, `src/pages/en/domains/**`, `src/views/DominioView.astro`, `src/views/MunicipioView.astro`, `src/data/dominios.mjs`, `src/components/formas/**`. Quando o F1.2 se fundir depois de ti, ele reaponta os cartões da faixa para a página do domínio; tu deixas os cartões a abrir a leitura breve como hoje, com o destino de cada cartão num só sítio (uma função ou uma tabela) para ele poder trocar sem tocar no resto.

## 4 · As medidas de aceitação (escritas antes; o bloco só se funde com todas verdes)

Medidas pelo construtor no `dist/` e nas capturas, depois às cegas pelo Sonnet numa cópia, e lidas a frio pelo Codex com plantas. **Primeiro medem-se os valores de hoje** (antes de mudar nada) e o relatório imprime os dois.

| # | medida | como se mede |
|---|---|---|
| A1 | a 390 × 664: o nome, a manchete inteira, o primeiro cartão inteiro, o seu selo e a porta do concelho visíveis sem gesto | captura e geometria (`getBoundingClientRect`) no `dist/` servido localmente |
| A2 | a altura de `/` a 390 menor do que hoje; o plano diz 7 140 px, o brief da forma 7 383 px a 29.08; mede-se o «hoje» na tua árvore de partida e é esse o teto | `document.documentElement.scrollHeight` |
| A3 | os 21 valores da faixa uma só vez em `dist/index.html` e em `dist/en/index.html` fora das páginas de linha | contagem dos valores selados por `data-linha` ou pelo texto do valor com a unidade |
| A4 | «Comissão Europeia» ≥ 1 em `/` e «European Commission» ≥ 1 em `/en` | `grep -c` no HTML |
| A5 | as 29 unidades com nome visível e alvo ≥ 44 × 44 px, ou ligação de lista ≥ 44 px, abaixo de 1 024 | geometria |
| A6 | `grep -c 'Âmbito\|Densidade' dist/index.html` a 0 | grep |
| A7 | «Lagoa» duas fichas com distritos distintos | HTML |
| A8 | `<form` a 1 em `/` e a busca a funcionar sem guião (o `action` leva a uma página que existe) | HTML e um pedido ao `dist/` |
| A9 | a tarefa (a) da ronda («encontrar o meu concelho») em ≤ 2 toques e ≤ 1 ecrã a 390 × 664 | percurso escrito, toque a toque, e a captura de cada passo |
| A10 | «sem limiar» a 0 nos cartões dos concelhos de `/` (e na página de um concelho, se o cartão for partilhado) | grep |
| A11 | a mobília a 390 com uma linha (≤ 64 px de altura acima do nome) | geometria |
| A12 | Regiões, Distritos e Áreas no menu, nas duas edições | HTML |
| A13 | nenhum número novo: o inventário de valores selados do sítio (`dist/` inteiro) antes e depois, igual em conjunto; o livro-razão intacto (`git diff --stat -- ledger/` vazio) | script no relatório |
| A14 | as réguas existentes verdes (`tests/inicio/*.mjs`, `check:voz`, `check:lingua`, `gate:html`, `check:fontes`, `provar:guardas`) e `npm run build`, `verify`, `typecheck` a 0, com os códigos de saída lidos dos registos (nunca `cmd > log; echo $?` em fundo) | os três comandos |
| A15 | as frases novas declaradas no inventário da voz com origem, e o tripwire do F0.9 verde | `check:voz` |
| A16 | contraste ≥ 4,5:1 no texto e ≥ 3:1 nos objetos de interface, nos dois temas, nas peças novas | `medir-contraste.mjs` ou o equivalente que a casa tem |
| A17 | uma régua nova ou a `tests/inicio/faixa.mjs` alargada, com estragos plantados vistos vermelhos: um cartão sem selo, um segundo cartão com o mesmo valor (a cópia), a frase de contexto sem «Comissão Europeia», a busca sem `action`, uma unidade do mapa sem nome | a régua, com cada planta vermelha e depois verde no relatório |

## 5 · O que se entrega

`design/especime-v3/medicoes/porta-construtor.md` com: os valores de partida e de chegada de A1 a A12 (números medidos, com o comando), as capturas a 390 × 664, 390 × 844, 768, 1 024, 1 280 e 1 440 nas duas edições (na pasta `design/especime-v3/capturas/porta-2026-09-03/`, só PNG, sem dados pessoais), a lista de cadeias novas com a chave e a origem de cada facto das frases, as plantas de A17 vermelhas e verdes, os três códigos de saída, o SHA do ramo e o número da corrida `portao` verde no GitHub. Empurra o ramo e espera o `portao` verde. **Não fundes em `main`.** O relatório diz o que ficou por fazer e porquê, sem o fingir feito.

## 6 · A disciplina

Commits pequenos com mensagens em português sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`. Nunca escrever um número que não foi medido. Um estado de saída lê-se do registo. Se algo do brief não puder ser feito sem uma decisão que não é tua (uma frase nova que exija palavra do diretor, uma colisão com o F1.2), faz tudo o resto e escreve a lacuna no relatório com a razão.

## 7 · Estimativa e modelo

Construtor Claude Opus 5, um bloco em duas passagens (a segunda depois da leitura a frio), da ordem de 0,6 a 0,9 M símbolos (o plano diz M a L). Leitura: Codex `gpt-5.6-sol` xhigh com cinco plantas de três classes; medição cega: Sonnet, alturas e alvos numa cópia.
