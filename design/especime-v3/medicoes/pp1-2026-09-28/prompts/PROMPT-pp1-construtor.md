És o construtor do bloco PP1 do projeto O Estado do País (um sítio Astro): **a primeira página de um leitor comum**, o passo 4 da ordem que o diretor aprovou a 28.09.2026 (o leitor comum primeiro, `DECISIONS.md` §1.133), na forma que não precisa das séries. Trabalhas só na worktree do sítio `<worktree do PP1>` (o ramo `pp1-2026-09-28`, que parte da passagem C1c). Nunca `git checkout` noutra árvore, nunca `push`, nunca `git add -A` nem `git add .`: só caminhos explícitos. Não tocas no motor. Prosa nova em português (Acordo Ortográfico), sem travessões; o vocabulário do §6 de `design/observatorio/ESTRUTURA-e-vocabulario-2026-09-17.md` («casa» é habitação, «sítio» é um lugar, uma página é «página»). **Nenhum ficheiro que escrevas leva um caminho da máquina nem o nome do utilizador da máquina**: a worktree diz-se `<worktree do sítio>`.

## O teste de aceitação, dito antes

O do §1 do brief `design/observatorio/BRIEF-PP1-a-primeira-pagina-de-um-leitor-comum.md`, à letra: um leitor comum abre a primeira página num telemóvel e percebe, nos dois primeiros ecrãs, duas coisas sobre o país que não sabia, cada uma com um desenho que se lê sem esforço, e cada número com o seu recibo. Os amigos do diretor acharam a página de hoje «too much, too difficult to make sense out of»: é para eles que isto se faz.

## O que lês primeiro, por esta ordem

1. `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`, inteiro, antes de abrir código.
2. O brief, inteiro (o §0 foi medido por `design/observatorio/medidas/BRIEF-PP1.py`, que corres para o reproduzir), as declarações `design/observatorio/leituras/BLOCOS-primeira-pagina-2026-09-28.mjs`, com o cabeçalho, e o ensaio a seco do lugar de direção (`design/observatorio/leituras/ensaio-blocos-primeira-pagina.mjs`), que corres: é a testemunha contra o teu resolvedor.
3. `DECISIONS.md` §1.133; `VISAO.md` §6; `design/especime-v3/IDENTIDADE.md` (as regras da cor, dos números, do selo e das escalas).
4. A maqueta que o diretor viu, em `design/especime-v3/medicoes/pp1-2026-09-28/maqueta/` (a página, as folhas, o `LEIA-ME.md` com as decisões de desenho e as oito questões, que o §5 do brief responde, e o `verificar.mjs` com as catorze plantas): é o desenho de partida, não uma prisão.
5. As leituras dos cartões e o seu resolvedor (`src/data/leituras-rp1.mjs`, `src/lib/leitura-da-medida.mjs`, `src/data/origens-rp1.mjs`, `tests/cartao/leituras.mjs` com a K17 e `tests/cartao/leituras-provadas.json`), para a gramática, a auditoria das palavras e o ensaio a seco (`design/observatorio/leituras/ensaio-a-seco.mjs`).
6. No sítio: `src/views/HomeView.astro` e os componentes que ela usa, `src/views/TemasView.astro` e `src/components/TemasDoPais.astro`, `src/components/CartaoDaMedida.astro`, `src/components/Claim.astro`, `src/components/inicio/Pesquisa.astro` e `CampoDeBusca.astro`, `src/components/inicio/MapaRespira.astro`, `src/components/inicio/LeituraDoPais.astro`, `src/lib/routes.mjs`, `src/i18n/strings.mjs`, `src/data/enquadramento/referencias.json`, `scripts/gate-html.mjs` e as células do §2, ponto 6, do brief.

## O mandato

A tabela do §2 do brief, ponto por ponto, pela ordem. Três avisos: as palavras são do lugar de direção, e onde a auditoria recusar uma troca-la pela mais próxima que os cartões já sustentam e dizes; nenhum valor muda e nenhuma linha nova entra no livro-razão; se ao medir achares que o brief está errado num ponto, medes, dizes e paras nesse ponto, e fazes os outros.

## O que não fazes

O §3 do brief. E ainda: não tocas no texto do rótulo de inteligência artificial, nos textos dos cartões nem nas leituras do RP1.

## As regras de trabalho

- A regra de paragem: só um portão que protege um número, uma fonte ou uma pessoa te faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta que morde.
- Commits pequenos por caminhos explícitos, com os trailers contíguos `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_01B4Zx94pG7dxxQNpoEn1bjP`. Este guião, o brief, as declarações e a maqueta já estão no ramo.
- Entre commits correm só as conferências que a mudança toca; os três portões inteiros (`npm run build`, `npm run verify`, `npm run typecheck`) uma vez, na cabeça final, cada um no seu comando com o código de saída escrito num ficheiro acabado de escrever em `design/especime-v3/medicoes/pp1-2026-09-28/portoes/`. O teu último commit é o de entrega das provas, e o relatório diz de que cabeça são os códigos e lista todos os commits do ramo.
- Uma construção de cada vez na máquina: outro construtor pode estar a correr portões noutra worktree. Antes de cada corrida inteira, confirma que nenhum outro `astro build` nem `npm run verify` está a correr (`pgrep -fl "astro build|npm run verify"`), e espera se estiver.
- Escreves o relatório também quando paras a meio: o que fizeste, onde paraste, o que o portão protege. A tua resposta curta vai em `design/especime-v3/medicoes/pp1-2026-09-28/RESPOSTA-construtor-pp1.md`, sem caminhos da máquina, e entra no último commit.

## O que os blocos anteriores ensinaram, e que poupa tempo

- `parsePtNumber()` de `src/lib/ledger.mjs` lê «20 600» e «−50,2»; um `Number()` sobre a cadeia não lê nenhum dos dois.
- A K17 compara o texto rendido de uma leitura com o do resolvedor carácter a carácter; a K16 exige um literal por pedaço de pergunta; «subida» e «descida» são palavras de ramo do sinal.
- O C1 separou o valor da unidade no texto da página (a I158): um número novo escreve-se com o `<Claim>` e o sufixo, nunca à mão.
- Um guião do §0 de um brief nunca lê o motor (a M34), e o guião de medidas do bloco também não.
- Numa lista de ficheiros para `git add`, em zsh, a variável não se parte sozinha: usa `git diff --name-only -z … | xargs -0 git add --` ou uma lista escrita à mão.
- O ensaio a seco das leituras corre sobre o ficheiro do sítio com os valores selados.
- As capturas fazem-se com o Playwright que a worktree já tem, sobre `dist/` servido localmente; o `captar-c1.mjs` do C1 (`design/especime-v3/medicoes/c1-2026-09-28/`) é um ponto de partida.

## No fim

Respondes com a cabeça final, os commits, o caminho do relatório, as saídas dos três portões lidas dos ficheiros e o que ficou por fazer.
