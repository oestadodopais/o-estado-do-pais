# Brief F1.8 · A moldura dos documentos alojados (03.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.8 do `PLANO-fiabilidade-2026-09-02.md` §3 e da auditoria de 02.09 (`AUDITORIA-2026-09-02.md`, a linha da acessibilidade: «contraste 2,13:1 em 13 nós dos documentos alojados; três caixas com deslocamento horizontal sem teclado»). O diretor mandou a 03.09 continuar sem perguntar. Sem travessões na prosa.*

## 0 · O que este bloco é

Os 16 documentos alojados (`/estudos/<slug>/documento` e `/en/studies/<slug>/document`) são os estudos originais servidos tal como foram publicados, com a faixa da casa em cima (o rótulo de IA, a marca `noindex`, a língua, tudo posto pelo F0.7 e provado por fatias contra a origem). O que falta é a **moldura**: o documento não tem `<main>`, os filetes das tabelas têm contraste de 2,13:1, as tabelas largas deslocam-se sem teclado, e há um filete de cor fora da paleta da casa. O bloco conserta a moldura **sem tocar num carácter do texto transcrito** (a I69, a voz dos documentos, é do motor e não deste bloco).

## 1 · O que entra

1. **`<main>`** à volta do documento, com a faixa fora dele, para que um leitor de ecrã salte para o conteúdo; um só `<h1>` visível por página (se o documento já trouxer o seu, a faixa não acrescenta outro).
2. **O contraste dos filetes das tabelas** a pelo menos 3:1 contra o fundo (objetos de interface), nos dois temas; o texto das tabelas a 4,5:1.
3. **As tabelas acessíveis ao teclado**: cada caixa com deslocamento horizontal foca-se (`tabindex="0"`, um `role="region"` com `aria-label` que diga o que é) e desloca-se com as setas; sem guião novo para o essencial.
4. **O filete fora da paleta** (a auditoria chama-lhe turquesa) passa à cor da casa que a folha define para filetes (`--g3`, o cinza dos filetes, conforme `IDENTIDADE.md` e `site.css`); nenhuma cor nova, nenhuma cor de fora da paleta em nenhum dos 16.
5. **A prova de que o texto não mudou**: o F0.7 deixou um provador que compara os bytes do documento abaixo da faixa contra a origem por fatias (`src/lib/documentos.mjs`); ele tem de continuar verde. Se a moldura exigir envolver o documento num elemento, faz-se pela construção (a mesma técnica da faixa) e o provador aprende a nova geometria com um conhecido-positivo (um carácter mudado no corpo é apanhado).

## 2 · O que não entra

Nenhuma mudança ao texto dos documentos; nenhuma mudança à faixa, ao rótulo, à marca `noindex` ou ao `lang` (F0.7); nenhum tipo ou cor novos; nenhum guião que a página precise para ser lida. `src/views/HomeView.astro`, `src/lib/routes.mjs`, `src/views/MunicipioView.astro`, `src/views/TextoView.astro` e os componentes da primeira página não se tocam (outros construtores).

## 3 · Onde se constrói

Ramo `moldura-2026-09-03` numa worktree própria a partir de `origin/main` (confirma o SHA com `git log -1 --format=%h origin/main`). Ficheiros: `src/lib/documentos.mjs`, a folha dos documentos (onde a faixa é estilizada; se for `public/site.css`, só a secção dos documentos), o gabarito que serve os documentos (`src/pages/estudos/[slug]/documento.astro` e o par inglês, ou o que existir), `scripts/gate-html.mjs` só se um portão novo for necessário, `tests/documentos/*.mjs` (novo), `design/especime-v3/medicoes/moldura-construtor.md`.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| C1 | axe a 0 violações graves («serious» e «critical») nos 16 documentos, nas duas edições onde existam, medido no `dist/` servido localmente com `axe-core` (já nas dependências? se não, só como dependência de desenvolvimento e dito no relatório) | o guião de medição no relatório, com o antes e o depois |
| C2 | contraste ≥ 3:1 nos filetes e ≥ 4,5:1 no texto das tabelas, nos dois temas, nos 16 | `medir-contraste.mjs` ou o equivalente |
| C3 | cada caixa com deslocamento horizontal focável e rotulada; 0 caixas sem teclado | HTML |
| C4 | `<main>` a 1 e `<h1>` visível a 1 em cada um dos 16 | HTML |
| C5 | 0 cores fora da paleta da casa nos 16 (a lista de cores da folha da casa contra as cores usadas) | script |
| C6 | o provador dos bytes do F0.7 verde e a planta (um carácter mudado no corpo) vermelha | o provador |
| C7 | `npm run build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos; `gate:html` e `check:documentos` verdes | os três comandos |

## 5 · O que se entrega

O relatório com C1 a C7 medidos antes e depois, as capturas de dois documentos (um português, um inglês) a 390 e 1 280 em `design/especime-v3/capturas/moldura-2026-09-03/`, a régua nova com as plantas vermelhas e depois verdes, o SHA do ramo e o número da corrida `portao` verde. Empurra e espera o verde. Não fundes em `main`.

## 6 · A disciplina e o custo

Commits pequenos em português sem travessões, com os trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido. Estimativa: Opus, uma passagem e uma segunda depois da leitura a frio, da ordem de 0,3 a 0,5 M símbolos (o plano diz S).
