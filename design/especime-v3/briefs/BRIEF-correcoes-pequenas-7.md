# BRIEF · Correções pequenas, sétima passagem (I97, I98, I100)

*Escrito a 29.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus). Ramo `pequenas-7-2026-08-29` saído de `main` (o commit que trouxer este brief), num worktree e nunca na árvore principal. Sem travessões na prosa.*

## 0 · As três

1. **I97 · a língua dos nomes dos organismos e das edições na edição inglesa.** O livro-razão rende em inglês o campo `source` (17 valores, 930 linhas só na DGAL) e 12 das 62 edições de documentos em português sem marca de língua. A regra é a da §1.82: um nome fica na língua em que a fonte o escreve e leva `lang="pt-PT"` quando não é a da página; o que já é inglês (Eurostat, «European Commission», as edições escritas em inglês) não leva marca. Faz a marca em `ItemDoLivro.astro` e nos índices onde o `source` e a edição rendem, pela mesma peça que marca os títulos; a régua `scripts/check-lingua.mjs` ganha a conferência (nomes de organismo e edições portuguesas sem marca em `dist/en` → 0) com um estrago plantado; regista as contagens antes e depois. Não inventes uma tradução: o nome é o da fonte. A I95 (as leis dentro de texto transcrito) e a I99 são do motor e não entram aqui.
2. **I98 · `scripts/design-bundle.mjs` vermelho desde `58cc881`** por um seletor de `inicio.css` (`.movel-selo`) que o feixe do desenho não reconhece. Lê o que o feixe faz e decide, dizendo porquê: ou o feixe aprende o seletor (se a regra é legítima e o feixe estava atrasado), ou o seletor está a mais (se nada o usa). Corre o feixe verde; se correr em menos de trinta segundos, entra no `verify`; se não, fica fora e a razão fica escrita no próprio guião.
3. **I100 · a célula M4 de `tests/inicio/areas.mjs` vermelha desde `fc1d013`**: a régua das áreas conta os blocos por classificar com a sua própria varredura, que não conhece a marca `data-nome`; `medir-defeitos.mjs` foi ensinado e ela não. Põe a M4 a chamar `medir-defeitos.mjs` como a M7 da régua do mapa faz (uma varredura só na casa), ou ensina-lhe a marca; a régua fica 22 de 22 verde, com um estrago plantado (um bloco de prosa por classificar visto vermelho). Fecha I100 com o commit.

## 1 · O que é «feito»

* `npm run build`, `verify`, `typecheck` a 0; `tests/inicio/areas.mjs` 22 de 22; `--vermelhos` a apanhar os estragos novos; nas duas edições, os nomes de organismo e as edições portuguesas com marca em `dist/en` contados antes e depois.
* O inventário não deve mudar (nomes são origem); se mudar, diz porquê. ISSUES: I97 e I100 fechadas com o commit; I98 fechada ou reescrita com o que decidiste.
* Commits com caminhos explícitos e os dois trailers (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`, `Claude-Session: https://claude.ai/code/session_01BbaH3XteKcsmmN9VD6SGwU`); `git push origin pequenas-7-2026-08-29`, sem force; não fundes. `DECISIONS.md` é do lugar de direção. Relatório em `design/especime-v3/medicoes/pequenas-7-construtor.md` com as contagens e o custo.
