# Ordem de construção · o rótulo de IA em todas as páginas (01.09.2026)

*Escrita pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). A especificação é `BRIEF-divulgacao-via-B.md`; esta ordem diz o que o brief não diz: onde trabalhar, o que ler, os textos aprovados, as réguas, o relatório. Decisões do diretor de 01.09.2026: a via B, os textos abaixo tal como estão. Sem travessões na prosa.*

## 1 · Onde

Na worktree `/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/rotulo-ia-2026-09-01` (ramo `rotulo-ia-2026-09-01`, saído de `main` em `b097d20`). Só lá: nunca `git checkout` na árvore principal, nunca `push`, nunca fusão. Antes de construir: `npm ci` na worktree (o `package-lock.json` está lá). Commits com caminhos explícitos, prosa em português (Acordo) sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_01RfmmTfG3C9xPwSngA5DDbr`.

## 2 · O que ler antes (na worktree)

`CLAUDE.md`; `design/observatorio/BRIEF-divulgacao-via-B.md` (a especificação); `design/observatorio/POLITICA-DA-AUTONOMIA.md` §2 a §4 e §6 (o texto de que a secção da política se faz); `design/observatorio/DILIGENCIA-LEGAL.md` §2.1 (o artigo 15.º, n.º 1 da Lei de Imprensa: o nome do diretor e a menção de gratuitidade na primeira página) e §4 (o artigo 50.º); `IDENTIDADE.md` (a regra visual); `DECISIONS.md` §1.86 (a identidade fechada: nada de sinais no cabeçalho), §1.82 e §1.87 (a língua dos títulos e dos rótulos); `src/layouts/Base.astro`, `src/components/SiteFooter.astro`, `src/components/Masthead.astro`, `src/i18n/strings.mjs`, `src/pages/sobre.astro`, `src/pages/metodo.astro`, `src/pages/en/about.astro`, `src/pages/en/method.astro`, `src/views/HomeView.astro` e `src/components/inicio/Cabeca.astro`; `scripts/gate-html.mjs`, `scripts/check-voz.mjs` e `scripts/check-lingua.mjs` (as réguas que vão ganhar células); `tests/inicio/*.mjs` (a forma das réguas com estragos plantados); `design/especime-v3/medicoes/pequenas-7-construtor.md` (um relatório de construtor recente, como modelo).

## 3 · Os textos aprovados (copiar carácter a carácter)

- O rótulo, em cada página, à primeira exposição, no rodapé (e no topo das páginas de leitura dos estudos, que são texto longo):
  - pt: «Texto gerado por IA sob a política da casa · responsável editorial: Nuno dos Santos»
  - en: «AI-generated text under the house policy · editorial responsibility: Nuno dos Santos»
  - «a política da casa» / «the house policy» é uma ligação à secção da política em `/metodo` e `/en/method`.
- A frase da política, em «Sobre» e em `/metodo` (e nas edições inglesas):
  - pt: «Escrito, conferido e atualizado por sistemas de IA sob uma política publicada; nenhum humano revê cada peça antes de sair; uma pessoa com nome detém a responsabilidade editorial, define as regras e as recusas, e responde.»
  - en: «Written, checked and updated by AI systems under a published policy; no human reviews each piece before it goes out; a named person holds editorial responsibility, sets the rules and the refusals, and answers for it.»
- A secção da política em `/metodo` (nova, nas duas edições): a via B, a tabela do que se publica sem humano e o que pára (§4 da política), os lugares e os modelos (§5) e as recusas (§6), na voz do sítio: a página diz o que a coisa é, nunca porque confiar (Emenda 18); sem adjetivos; sem explicar a maquinaria além do que a política diz. A tradução inglesa é tua, fiel, e o lugar de direção lê-a antes da fusão.
- A primeira página: o nome do diretor («Nuno dos Santos», tal como o `/metodo` já o imprime; confirma a forma exata no código) e a menção de gratuitidade, em duas cadeias curtas, na forma que menos pese na cabeça (uma linha no rodapé da primeira página chega, se a lei se cumprir com «primeira página de cada edição» lida como a página inicial; regista a leitura que fizeres). Nenhum sinal, nenhum lema, nada que toque na identidade fechada.

## 4 · As medidas de aceitação (as do brief, com a régua)

1. O rótulo rende em todas as páginas construídas das duas edições (mede o número antes e depois: hoje 6 606 ficheiros em `dist/`), e `gate-html.mjs` ganha uma regra que fecha a construção a uma página sem ele, provada num estrago plantado (uma página sem o rótulo, vista vermelha). Os documentos originais dos estudos (as rotas `documento`) levam o rótulo na página que os embrulha, não dentro do documento (§1.19).
2. Cada cadeia nova entra no inventário da voz (`check:voz`), com o bloco e a origem, e na tabela da língua (`check:lingua`): «Nuno dos Santos» é um nome e leva a marca certa nas duas edições; as frases levam a língua da página.
3. Contraste do rótulo a 4,5:1 no mínimo nos dois temas (mede com `scripts/medir-contraste.mjs` ou equivalente, e imprime os valores); o corpo não desce abaixo do mínimo da casa para texto.
4. Os dados estruturados: só se o vocabulário do schema.org, lido na fonte (`https://schema.org/`), tiver uma propriedade que diga a geração por IA sem inventar; senão nada se acrescenta e o relatório diz que se procurou e o que se encontrou.
5. `npm run build`, `npm run verify`, `npm run typecheck` a 0; todas as réguas de `tests/inicio/*.mjs` verdes; os estragos plantados novos vistos vermelhos com as três exigências (verde antes, o HTML mudou, vermelho depois).
6. Nenhum número novo no sítio: o inventário do livro-razão igual antes e depois; nenhuma linha do `ledger/` tocada.

## 5 · O relatório

`design/especime-v3/medicoes/rotulo-construtor.md` na worktree: o que se construiu, ficheiro a ficheiro; as contagens antes e depois; os contrastes medidos; as cadeias novas e os seus blocos; as regras novas e os estragos vistos; as leituras que fizeste (a «primeira página»; o schema.org); os símbolos gastos, se o harness os der; e uma linha «Modelo: Claude Opus 5». Deixa o ramo com os commits feitos e verde; o lugar de direção lê, manda a leitura cruzada do Codex, e funde.
