És o construtor do bloco C1 do projeto O Estado do País (um sítio Astro em `~/Instruments/OEstadoDoPais` e um motor em Python em `~/Instruments/ResearchHub`): **as correções de confiança**, o primeiro passo da ordem que o diretor aprovou a 28.09.2026 (o leitor comum primeiro, `DECISIONS.md` §1.133). Trabalhas na worktree do sítio em que foste lançado (o `-C` da linha de comando: o ramo `c1-2026-09-28` sobre `main`) e na worktree do motor `~/Instruments/ResearchHub/.worktrees/c1-2026-09-28` (o ramo `c1-2026-09-28` sobre `master` em `4eb2867`). Nunca `git checkout` noutra árvore, nunca `push`, nunca `git add -A` nem `git add .`: só caminhos explícitos. Prosa nova em português (Acordo Ortográfico), sem travessões; o vocabulário do §6 de `design/observatorio/ESTRUTURA-e-vocabulario-2026-09-17.md`. **Nenhum ficheiro que escrevas leva um caminho da máquina nem o nome do utilizador da máquina**: a worktree diz-se `<worktree do sítio>` e o motor `~/Instruments/ResearchHub`.

## O teste de aceitação, dito antes

O do §1 do brief `design/observatorio/BRIEF-C1-as-correcoes-de-confianca.md`, à letra: cada um dos oito pontos do mandato feito, com a planta que ele pede a morder; os três portões a 0 na cabeça final; as capturas antes e depois nas cinco larguras (390, 768, 1 024, 1 280 e 1 600 px) e nas duas edições; o relatório com o `medidas.json` e o zero dos caminhos da máquina medido com conhecido-positivo.

## O que lês primeiro, por esta ordem

1. `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`, inteiro, antes de abrir código.
2. O brief `design/observatorio/BRIEF-C1-as-correcoes-de-confianca.md`, inteiro (o §0 foi medido por `design/observatorio/medidas/BRIEF-C1.py`, que corres para o reproduzir).
3. `DECISIONS.md` §1.132 e §1.133; `design/especime-v3/ISSUES.md` (as I158 a I162); as duas leituras a frio do RP1 em `design/especime-v3/critica/LEITURA-rp1-2026-09-26.md` e `LEITURA-rp1bc-2026-09-26.md` (os achados que este bloco fecha).
4. `design/observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs` (a quarta redação do lugar de direção, com o cabeçalho) e o relatório do RP1 (`design/especime-v3/medicoes/rp1-2026-09-26/LEIA-ME.md`, as três secções), para a forma das leituras, dos acertos, das capturas e do relatório.
5. `ledger/README.md`, as secções das linhas cruzadas, da V16 e da tipologia «correção» e «atualização» (a primeira `atualizacao` de uma linha cruzada é a deste bloco).
6. No sítio: `src/components/Claim.astro`, `CartaoDaMedida.astro`, `src/components/lugar/InstrumentoDosMandatos.astro`, a vista do recibo, `src/lib/dados.mjs` e `src/pages/dados/*.csv.js`, `src/i18n/strings.mjs`, `scripts/gate-html.mjs` (a célula da I143), `tests/cartao/leituras.mjs` (a K17).
7. No motor: `publisher/dominios_fetch.py`, `publisher/dominios_build.py`, `publisher/export_site_rows.py` (a V16), e `indicators/refresh.py` (a canária da existência e a resolução das dimensões).

## O mandato

A tabela do §2 do brief, ponto por ponto. Três avisos: no ponto 3, se o corpo novo do Eurostat mudar também outra linha da família da dívida das famílias, paras nessa linha e dizes; no ponto 4, se uma releitura com a unidade fixa der um valor diferente do selado, paras e dizes antes de fazer uma `atualizacao`; e em nenhum ponto mudas um `source_url` já selado.

## O que não fazes

O §3 do brief. E ainda: não tocas em `indicators/availability.json`, em `indicators/vintages.json` nem nos outros `indicators/*.json`, em `.maintenance-locks/`, em `sweeps/` nem em `publisher/recortes/manifest.regioes.json` no motor. O texto do rótulo de IA não se toca.

## As regras de trabalho

- A regra de paragem: só um portão que protege um número, uma fonte ou uma pessoa te faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta que morde. Se ao medir achares que o brief está errado num ponto, medes, dizes e paras nesse ponto, e fazes os outros.
- Commits pequenos por caminhos explícitos, com os trailers contíguos `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_01B4Zx94pG7dxxQNpoEn1bjP`; no motor só o `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate` (cerca de dois minutos e meio). Este guião já está no ramo.
- Entre commits correm só as conferências que a mudança toca; os três portões inteiros (`npm run build`, `npm run verify`, `npm run typecheck`) uma vez, na cabeça final, cada um no seu comando com o código de saída escrito num ficheiro acabado de escrever em `design/especime-v3/medicoes/c1-2026-09-28/portoes/`. O teu último commit é o de entrega das provas, e o relatório diz de que cabeça são os códigos e lista todos os commits do ramo.
- Uma construção de cada vez na máquina: não corras portões enquanto outro processo os corre.
- Escreves o relatório também quando paras a meio: o que fizeste, onde paraste, o que o portão protege. A tua resposta curta vai em `design/especime-v3/medicoes/c1-2026-09-28/RESPOSTA-codex-c1.md`, sem caminhos da máquina.

## O que os blocos anteriores ensinaram, e que poupa tempo

- `parsePtNumber()` de `src/lib/ledger.mjs` lê «20 600» e «−50,2»; um `Number()` sobre a cadeia não lê nenhum dos dois.
- A K17 compara o texto rendido da leitura com o do resolvedor carácter a carácter; a K16 exige um literal por pedaço de pergunta; «subida» e «descida» são palavras de ramo do sinal, como «Subiu face a».
- Um guião do §0 de um brief nunca lê o motor (a M34): a corrida «portão» do ramo corre numa máquina sem ele.
- Numa lista de ficheiros para `git add`, em zsh, a variável não se parte sozinha: usa `git diff --name-only -z … | xargs -0 git add --` ou uma lista escrita à mão.
- O ensaio a seco das leituras (`design/observatorio/leituras/ensaio-a-seco.mjs`) corre sobre o ficheiro do sítio com os valores selados.
