És o construtor do bloco CI1 do projeto O Estado do País (um sítio Astro): **a corrida «portão» em metade do tempo, sem uma conferência a menos**, pedida pelo diretor a 28.09.2026 com estas palavras: «Is there a way to optimise CI», e «without jeopardise a single bit of quality». Trabalhas só na worktree do sítio `<worktree do CI1>` (o ramo `ci1-2026-09-28` sobre `main`). Nunca `git checkout` noutra árvore, nunca `push`, nunca `git add -A` nem `git add .`: só caminhos explícitos. Não tocas no motor. Prosa nova em português, sem travessões. **Nenhum ficheiro que escrevas leva um caminho da máquina nem o nome do utilizador da máquina.** Usa `git -C <worktree>` e caminhos absolutos, sem `cd` para outras árvores.

## O teste de aceitação, dito antes

O do §2 do brief `design/observatorio/BRIEF-CI1-o-portao-em-metade-do-tempo.md`, à letra. As duas provas que o diretor pediu sem o dizer assim: cada conferência do `verify` corre pelo menos uma vez sobre o mesmo `dist/`, e o sítio construído na mesma cabeça sai igual byte a byte antes e depois.

## O que lês primeiro, por esta ordem

1. `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`; o brief, inteiro (o §0 foi medido por `design/observatorio/medidas/BRIEF-CI1.py`, que corres para o reproduzir; o §1 tem os tempos lidos na API do GitHub).
2. `.github/workflows/portao.yml`, inteiro, com os comentários; `package.json` (as cadeias do `build` e do `verify`); os guiões das conferências mais lentas (`check:alvos`, `check:palavras`, `check:moldura`, `gate:html`, `check:voz`, `check:lugar`) e o que cada uma abre (servidores, portas, navegadores, ficheiros temporários).
3. `astro.config.mjs` e as páginas e bibliotecas que a construção mais usa, para medir onde vão os minutos.

## O mandato

A tabela do §3 do brief, ponto por ponto. Três avisos: a verificação obrigatória de `main` chama-se `portao` e tem de continuar a ser o estado de tudo (se partires a corrida em trabalhos, o último chama-se `portao` e só passa com todos); nenhuma conferência se retira, enfraquece ou salta; e nenhuma cache guarda resultados de conferências ou o `dist/` de uma corrida para outra. A prova do byte a byte corre-se construindo a mesma cabeça antes e depois de cada mudança da construção; as datas e horas que a construção escreve de propósito (o carimbo da versão) comparam-se à parte e dizem-se.

## As regras de trabalho

- A regra de paragem: só um portão que protege um número, uma fonte ou uma pessoa te faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta que morde. Se ao medir achares que o brief está errado num ponto, medes, dizes e paras nesse ponto, e fazes os outros.
- Commits pequenos por caminhos explícitos, com os trailers contíguos `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_01B4Zx94pG7dxxQNpoEn1bjP`.
- Os três portões inteiros (`npm run build`, `npm run verify`, `npm run typecheck`) na cabeça final, cada um no seu comando com o código de saída escrito num ficheiro acabado de escrever em `design/especime-v3/medicoes/ci1-2026-09-28/portoes/`.
- Uma construção de cada vez na máquina: outros construtores correm portões noutras worktrees. Antes de cada construção ou corrida inteira, confirma com `pgrep -fl "astro build|npm run verify"` e espera se estiver outra a correr; as medições de tempo fazem-se só com a máquina sem outra construção, e o relatório diz em que condições foi cada uma.
- As provas no GitHub (as duas corridas medidas) são do lugar de direção, que publica o ramo: tu deixas o guião que as mede e o que esperar delas.
- Escreves o relatório também quando paras a meio. A tua resposta curta vai em `design/especime-v3/medicoes/ci1-2026-09-28/RESPOSTA-construtor-ci1.md`, sem caminhos da máquina, e entra no último commit. Um relatório nunca afirma comunicações com o diretor.

## No fim

Respondes com a cabeça final, os commits, o caminho do relatório, as saídas dos três portões lidas dos ficheiros e o que ficou por fazer.
