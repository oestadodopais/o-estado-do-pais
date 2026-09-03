# Brief F1.7 · Acessibilidade e alvos (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.7 do `PLANO-fiabilidade-2026-09-02.md` §3, da auditoria de 02.09 (`AUDITORIA-2026-09-02.md`, a linha 71 da acessibilidade) e das issues I95, I96, I104 e I105 de `design/especime-v3/ISSUES.md`. O diretor mandou a 03.09 continuar sem perguntar. Sem travessões na prosa.*

## 0 · O que este bloco é

A auditoria mediu 11 de 30 páginas sem violações do axe, a porta de correções fora de qualquer marco em 19 páginas, caixas com deslocamento horizontal sem teclado, mais de um `<h1>` por página, fichas de concelho abaixo de 44 px, um buraco de alvos entre 641 e 1 023 px, unidades em português nos cartões ingleses, leis sem marca de língua, `aria-expanded` que só existe com guião e um título vazio no Método. O bloco fecha isto tudo com medição, **sem mudar um texto governado** (o Sobre e o Método não mudam de palavras; só de estrutura onde a acessibilidade o exija) e sem um número novo.

## 1 · O que entra

1. **A porta de correções dentro de um marco** (`<footer>` ou `<nav aria-label>`), em todas as páginas construídas, nas duas edições.
2. **As caixas com deslocamento horizontal acessíveis ao teclado** fora dos documentos alojados (esses são do F1.8, já feito): `tabindex="0"`, `role="region"` e um nome, sem guião.
3. **Um só `<h1>` por página** em todo o `dist/`; os outros títulos descem de nível sem mudar o texto.
4. **As fichas dos concelhos a 44 px** em `/municipios` e nas listas de concelhos das páginas de distrito e de região.
5. **O buraco dos 44 px entre 641 e 1 023 px** (I104): os alvos que a folha reduz abaixo de 44 px nessa faixa voltam a 44 (a regra da Emenda 20c: 44 px abaixo de 1 024, 32 px nas linhas de nome a partir de 1 024).
6. **Os quatro alvos de texto abaixo de 32 px** (I105) a 32 px.
7. **Os algarismos da manchete como alvos:** cada `<ValorDaProva>` da manchete da primeira página, das regiões, dos concelhos e do domínio é um alvo de 44 px (a área de toque, não o corpo do tipo) que abre a linha, sem mudar o aspeto.
8. **As unidades em português nos 580 cartões ingleses** (I96): a unidade de cada linha traduzida na edição inglesa pela tabela de unidades da casa (`src/data/unidades.mjs` ou o que existir), com a tabela a crescer só com as unidades que as linhas usam e sem inventar unidades; o que não tiver tradução fica em português e é contado.
9. **As 315 leis sem marca de língua** (I95): os títulos de diplomas citados nas páginas inglesas levam `lang="pt-PT"`.
10. **`aria-expanded` sem guião:** nenhum `aria-expanded` no HTML servido que o guião não controle; os `<details>` nativos não o levam; os comandos que só existem com guião entram com ele.
11. **O título vazio do Método** (`<title>` ou `<h1>` vazio na página do Método, o que a auditoria mediu) preenchido com o título que a página já tem no menu, sem palavra nova.

## 2 · O que não entra

Nenhum texto novo nas páginas governadas (Sobre, Método); nenhum número novo; nada nos documentos alojados (F1.8) nem nas páginas de leitura (F1.9a) nem na primeira página além dos alvos dos algarismos da manchete (item 7, que toca `src/components/Manchete.astro` e `Claim.astro`, ambos do F1.2b, que ainda está a fundir: faz esse item por último, depois de fundires `origin/main` quando o lugar de direção o disser). Nada nas manchetes além do alvo.

## 3 · Onde se constrói

Ramo `alvos-2026-09-04` numa worktree própria a partir de `origin/main` (confirma o SHA). Ficheiros: `src/components/SiteFooter.astro`, `src/views/MunicipiosView.astro`, `src/views/DistritoView.astro` e `RegiaoView.astro` (as listas de concelhos só), `src/views/LinhaView.astro` (as unidades inglesas e as leis), `src/views/MetodoView.astro` (o título), `src/styles/site.css` (as faixas de largura), `src/data/unidades.mjs` (ou o que existir), `src/components/Manchete.astro` e `Claim.astro` (item 7, por último), `scripts/gate-html.mjs` (a regra do `<h1>` único e do `aria-expanded`), `tests/acessibilidade/*.mjs` (novo), `design/especime-v3/medicoes/alvos-construtor.md`. O F1.4 corre em paralelo e é dono de `AreaView`, `AreasView`, `LivroView`, `datas.mjs` e da parte dos nomes e datas de `LinhaView`: toca em `LinhaView` só nas unidades e nas leis, em linhas diferentes, e diz no relatório o que tocaste.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| H1 | axe a 0 violações («serious» e «critical», e depois todas, dito por classe) nas 30 páginas da auditoria, fora do CSS próprio dos documentos alojados | o guião de medição, antes e depois |
| H2 | a sonda dos alvos a 0 abaixo de 44 px em `/municipios` (as fichas) e a 0 no buraco 641 a 1 023 px (medido a 641, 768 e 1 023) | Playwright |
| H3 | `grep -c '<h1' dist/index.html` a 1, e 1 em todas as páginas do `dist/` (contagem por página) | script |
| H4 | a porta de correções dentro de um marco em 100 % das páginas construídas | script |
| H5 | 0 caixas com deslocamento horizontal sem teclado fora dos documentos alojados | script |
| H6 | I105: os quatro alvos a ≥ 32 px | Playwright |
| H7 | os algarismos das manchetes com alvo ≥ 44 px, o aspeto igual (captura antes e depois) | Playwright |
| H8 | I96: unidades em português a 0 nos cartões ingleses, ou contadas com a razão | script |
| H9 | I95: 0 títulos de diplomas sem `lang` nas páginas inglesas | script |
| H10 | `aria-expanded` no HTML servido a 0 fora dos elementos que o guião controla; o título do Método não vazio | grep |
| H11 | `npm run build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos; as réguas do sítio verdes | os três comandos |
| H12 | uma régua nova (`tests/acessibilidade/alvos.mjs`) com plantas vermelhas e depois verdes: um segundo `<h1>`; uma ficha a 30 px; a porta de correções fora do marco; uma unidade em português num cartão inglês | a régua |

## 5 · O que se entrega e a disciplina

O relatório com H1 a H12 antes e depois, as capturas a 390, 641, 768, 1 023 e 1 280 de `/municipios`, de uma linha e de uma região nas duas edições em `design/especime-v3/capturas/alvos-2026-09-04/`, a régua com as plantas, o SHA e a corrida `portao` verde. Empurra e espera o verde; não fundes em `main`. Commits pequenos em português sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido; o `typecheck` é estrito (sem `any`, sem `@ts-ignore`); cada cadeia nova no inventário da voz com origem. Estimativa: Opus, duas passagens, da ordem de 0,5 a 0,8 M símbolos (S a M).
