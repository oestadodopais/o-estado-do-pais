És o construtor do bloco N1 do projeto O Estado do País (um sítio Astro): **uma porta por assunto**. Trabalhas na worktree do sítio `<worktree do sítio>` (o ramo `n1-2026-09-30` sobre `main`), e em nenhuma outra árvore. Nunca `git checkout` noutra árvore, nunca `push`, nunca `git add -A` nem `git add .`: só caminhos explícitos. Prosa nova em português (Acordo Ortográfico), sem travessões; a edição inglesa espelha. **Nenhum ficheiro que escrevas leva um caminho da máquina nem o nome do utilizador da máquina.**

## O teste de aceitação, dito antes

O do §2 do brief `design/observatorio/BRIEF-N1-uma-porta-por-assunto.md`, à letra.

## O que lês primeiro, por esta ordem

1. `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`.
2. O brief, inteiro; o §0 foi medido por `design/observatorio/medidas/BRIEF-N1.py`, que corres para o reproduzir (precisa de `node_modules`, que a worktree já tem).
3. `DECISIONS.md` §1.136 e §1.143 (a leitura dos leitores comuns de 30.09 e as decisões), e as quatro leituras de fora em `design/especime-v3/critica/navegacao-2026-09-30/`: dizem, com contas, o que os leitores tropeçam.
4. `design/observatorio/ESTRUTURA-e-vocabulario-2026-09-17.md` (a estrutura em vigor, que o ponto 6 põe em dia).
5. No código: `src/data/primeira-pagina.mjs` (`ENTRADAS`, `BLOCOS_DA_PRIMEIRA_PAGINA`, `CARTOES_FORA_DAS_ENTRADAS`), as páginas das entradas em `src/pages/` e as vistas que elas usam, `src/views/TemasView.astro` e `src/components/TemasDoPais.astro`, `src/lib/pais.mjs`, `src/pages/dominios/` e `src/data/dominios.mjs`, `src/pages/lugares.astro`, `src/pages/temas.astro`, a navegação e o rodapé em `src/layouts/`, o mapa do sítio, e as células que leem as entradas (`tests/inicio/entradas.mjs`) e os temas; como o sítio faz redirecionamentos hoje (procura `redirects` na configuração do Astro e da Vercel).
6. Antes de mexer: `python3 scripts/leituras/decisoes-em-vigor.py <os ficheiros que vais tocar>`; as decisões citadas ficam em vigor, salvo a decisão 2 da §1.136, que a §1.143 supera.

## O mandato

A tabela do §3 do brief, ponto por ponto, com as decisões do §5 (os nomes e as rotas das portas, e a linha de âmbito). Três avisos:
- as rotas antigas redirecionam para as novas nas duas edições, e o mapa do sítio, a navegação, as migalhas e as ligações internas dizem as novas; `check:mortos` a 0;
- cada cartão nacional inteiro fica numa página de assunto e em mais nenhuma; a célula nova (a do ponto 1 e 2 da tabela) fecha a construção se um bloco da primeira página aparecer noutra página ou um cartão inteiro em duas páginas de assunto, com uma planta de cada;
- o ponto 5 (as duas linhas do desemprego) faz-se pelo mecanismo da atualização de uma linha, com a razão, e não a editar o valor à mão: lê como o C1 fez a primeira (`DECISIONS.md` §1.135 e a linha `divida-das-familias-2025-ue`).

## As regras de trabalho

- A regra de paragem: só um portão que protege um número, uma fonte ou uma pessoa te faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta que morde. Se ao medir achares que o brief está errado num ponto, medes, dizes e paras nesse ponto, e fazes os outros.
- Commits pequenos por caminhos explícitos, com os trailers contíguos `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g`. Entre commits correm só as conferências que a mudança toca.
- Uma construção de cada vez na máquina: antes de cada corrida inteira, `pgrep -fl "astro build|npm run verify|npm run build"`, e esperas se houver outra.
- No fim, os três portões (`npm run build`, `npm run verify`, `npm run typecheck`) na cabeça final, cada um no seu comando, com o código escrito num ficheiro acabado de escrever em `design/especime-v3/medicoes/n1-2026-09-30/portoes/` e a cabeça ao lado; os registos dos portões sem caminhos da máquina.
- As capturas das oito portas e da primeira página, nas cinco larguras (390, 768, 1 024, 1 280 e 1 600 px) e nas duas edições, com os guiões de captura que os blocos anteriores deixaram (`design/especime-v3/medicoes/ue1-2026-09-29/captar-*.mjs` como modelo), em `design/especime-v3/capturas/n1-2026-09-30/`.
- O relatório `design/especime-v3/medicoes/n1-2026-09-30/LEIA-ME.md`, também quando paras a meio: a tabela do mandato e a medida de cada item, as plantas, os commits, os códigos dos portões lidos de ficheiro, o custo em símbolos e segundos; o `medidas.json` por um guião do bloco, com um conhecido-positivo por medida. A tua resposta curta vai em `design/especime-v3/medicoes/n1-2026-09-30/RESPOSTA-construtor-n1.md`, no último commit. A tua última mensagem desta sessão vai para fora do ramo. Um relatório nunca afirma comunicações com o diretor.

## No fim

Respondes com a cabeça final do ramo, os commits, o caminho do relatório, as saídas dos portões lidas dos ficheiros e o que ficou por fazer.
