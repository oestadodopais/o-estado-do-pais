# Brief F1.9a · O índice das páginas de leitura (03.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.9 do `PLANO-fiabilidade-2026-09-02.md` §3 e da auditoria de UX de 25.08 (`AUDITORIA-UX-2026-08-25.md`, D1: «as páginas de leitura, 390: 111 e 243 ecrãs (74 078 e 161 373 px), 343 e 698 alvos de toque abaixo de 44 px, sem índice nem barra de progresso nem subida»). A segunda metade do F1.9 (os estudos alcançáveis da primeira página) depende do F1.1 e faz-se depois; esta é a primeira metade. O diretor mandou a 03.09 continuar sem perguntar. Sem travessões na prosa.*

## 0 · O que este bloco é

As oito páginas de leitura (`/estudos/<slug>/texto`, seis em português e duas em inglês, compostas no gabarito da casa a partir dos registos do motor, `src/views/TextoView.astro`) têm dezenas de ecrãs sem um índice, sem uma barra de progresso e sem uma subida. O bloco dá-lhes um índice rendido do próprio documento (os títulos que o registo já traz), uma indicação de progresso e uma porta de subida, **sem mudar um carácter do texto** (o `check:documentos` compara o texto rendido carácter a carácter com o registo, e continua a ter de passar) e sem guião para o essencial.

## 1 · O que entra

1. **Um índice** no topo da página de leitura, construído dos títulos (`h2`, `h3`) do registo: uma lista de ligações internas (`#id`), numerada só se o documento numerar as suas secções, com o nome de cada secção tal como o documento o escreve; a 390 fecha-se num `<details>` aberto por defeito ou numa lista compacta, à escolha medida (a que custar menos altura sem esconder).
2. **Uma indicação de progresso** que funcione sem guião (por exemplo a posição «secção n de N» rendida em cada título, ou uma barra `position: sticky` movida por CSS onde o navegador o permita); com guião, a barra pode ser mais fina, mas a página sem guião não pode ficar sem indicação.
3. **Uma subida** («↑ topo» ou a palavra da casa) no fim de cada secção ou fixa e discreta, com alvo ≥ 44 px, sem tapar texto.
4. **Os alvos de toque** das páginas de leitura: os selos e as ligações com menos de 44 px medidos pela auditoria (343 e 698) ganham a área de toque da casa (a mesma regra dos outros tipos de página: a Emenda 20c), sem mudar o aspeto do selo.
5. **As cadeias novas** («Índice», «Secção n de N», «topo», nas duas línguas) no inventário da voz com origem, na forma do F0.9; sem frases sobre a casa.

## 2 · O que não entra

Nenhuma mudança ao texto dos registos; nenhuma ligação nova para fora; nenhum tipo ou cor novos; nada na primeira página (F1.1) nem nos documentos alojados (F1.8). `src/views/HomeView.astro`, `src/lib/routes.mjs`, `src/views/MunicipioView.astro`, `src/lib/documentos.mjs` não se tocam.

## 3 · Onde se constrói

Ramo `indice-2026-09-03` numa worktree própria a partir de `origin/main` (confirma o SHA com `git log -1 --format=%h origin/main`). Ficheiros: `src/views/TextoView.astro`, a folha (só a secção das páginas de leitura), `src/i18n/strings.mjs` (só chaves novas de `texto`), `src/data/figuras.mjs` (só para declarar as cadeias novas), `tests/texto/*.mjs` (a pasta existe), `design/especime-v3/medicoes/indice-construtor.md`, `design/especime-v3/CHAVES-EN.md`.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| D1 | um índice rendido nas 8 páginas de leitura, com uma entrada por título do registo e cada ligação a um `id` que existe na página | HTML, script |
| D2 | a indicação de progresso presente sem guião nas 8 | HTML com o guião desligado |
| D3 | a subida com alvo ≥ 44 px, visível sem tapar texto, a 390 × 664 e a 1 280 | geometria |
| D4 | alvos de toque abaixo de 44 px nas páginas de leitura: o número de hoje (a auditoria mediu 343 e 698 nas duas maiores) e o de depois, a descer para 0 nos selos e nas ligações do texto | script de geometria |
| D5 | `check:documentos` verde (o texto carácter a carácter igual ao registo) e `gate:html` verde | os portões |
| D6 | a altura de cada página de leitura a 390 não sobe mais do que a altura do índice (medida e dita) | geometria |
| D7 | `npm run build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos; `check:voz` com as cadeias novas declaradas | os três comandos |
| D8 | uma régua nova (`tests/texto/indice.mjs`) com plantas vermelhas e depois verdes: uma ligação do índice para um `id` que não existe, um título do registo fora do índice, a subida com alvo de 20 px | a régua |

## 5 · O que se entrega

O relatório com D1 a D8 medidos antes e depois, as capturas de uma página portuguesa e uma inglesa a 390 e 1 280 em `design/especime-v3/capturas/indice-2026-09-03/`, a régua com as plantas, o SHA do ramo e a corrida `portao` verde. Empurra e espera o verde. Não fundes em `main`.

## 6 · A disciplina e o custo

Commits pequenos em português sem travessões, com os trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido. Estimativa: Opus, duas passagens, da ordem de 0,4 a 0,7 M símbolos (o plano diz M para o F1.9 inteiro).
