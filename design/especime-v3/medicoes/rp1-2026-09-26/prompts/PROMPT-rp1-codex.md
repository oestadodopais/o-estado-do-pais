És o construtor da primeira peça do bloco RP1 do projeto O Estado do País (um sítio Astro em `~/Instruments/OEstadoDoPais` e um motor em Python em `~/Instruments/ResearchHub`): **os cartões dos rendimentos e dos preços que as APIs do INE e do Eurostat já permitem**, treze medidas nacionais novas com a leitura em palavras correntes do L1. Trabalhas na worktree do sítio que te foi dada na linha de comando (`/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/rp1-2026-09-26`, o ramo `rp1-2026-09-26` sobre `main` em `334cc740`, com `npm ci` feito) e na worktree do motor `/Users/nunosantos/Instruments/ResearchHub/.worktrees/rp1-2026-09-26` (o ramo `rp1-2026-09-26` sobre `master` em `1d10b3f`). Nunca `git checkout` noutra árvore, nunca `push`, nunca `git add -A` nem `git add .`: só caminhos explícitos. Se `main` avançar enquanto constróis, o rebase é teu. Prosa nova em português (Acordo Ortográfico), sem travessões; o vocabulário do §6 de `design/observatorio/ESTRUTURA-e-vocabulario-2026-09-17.md`.

## O teste de aceitação, dito antes

Feito quer dizer: um leitor abre a página dos temas e encontra, nos temas que já existem, treze cartões novos com o número, a unidade e o período da fonte, a leitura em palavras correntes por baixo do número, a régua com o período anterior e, onde a fonte a publica, a média da União, e a pergunta do leitor com as origens seladas; cada linha nova veio de um pedido do cliente da casa registado com endereço, hora, cliente e sha256, com o corpo alojado no estudo 13 e o excerto literal da resposta; nenhum algarismo entrou fora de uma linha selada ou de um `nl` com literal; as linhas mensais e trimestrais têm identificador estável e a sua régua é declarada; os três portões a 0 na cabeça final; as capturas nas cinco larguras e nas duas edições; o relatório com o `medidas.json` do bloco.

## O que lês primeiro, por esta ordem

1. `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`, inteiro, antes de abrir código.
2. `design/observatorio/BRIEF-RP1-rendimentos-e-precos-os-cartoes.md`, inteiro: o §0 (medido pelo guião `design/observatorio/medidas/BRIEF-RP1.py`, que corres para o reproduzir), o §1, o §2 (o teu mandato), o §3 (as treze medidas, com as fontes e as réguas), o §4, o §5 e o §6.
3. `design/observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs` (as leituras do lugar de direção, com o cabeçalho) e `design/observatorio/leituras/LEITURAS-das-medidas-2026-09-24.mjs` (a gramática, no cabeçalho); `src/data/leituras-das-medidas.mjs` e `src/lib/leitura-da-medida.mjs` (o resolvedor); `tests/cartao/leituras.mjs` e `leituras-provadas.json` (a K17); `tests/cartao/perguntas.mjs` e `perguntas-provadas.json` (a K16).
4. `src/lib/enquadramento.mjs` (a régua e a regra do sufixo do ano que vais estender com a tabela declarada), `src/data/dominios.mjs` (`DOMINIO_DAS_MEDIDAS`), `src/data/figuras.mjs` (as definições e as origens), `src/data/nomes-das-medidas.mjs`, `src/i18n/unidades.mjs`, `src/lib/pais.mjs` (`temasDoPais()`).
5. No motor: `publisher/dominios_fetch.py` (os pedidos e o manifesto), `publisher/dominios_readers.py` (`ine_indicator()`, `eurostat_series()`), `publisher/dominios_build.py` (as linhas do livro do estudo 13), `publisher/export_site_rows.py`, e `indicators/out/l1-2026-09-26/` (a forma de um registo de pedidos).
6. O relatório do L1 (`design/especime-v3/medicoes/l1-2026-09-24/LEIA-ME.md`) e o seu guião das capturas (`captar-l1.mjs`), para a forma das plantas, das capturas, do relatório e do `medidas.json`.

## O mandato (a tabela do §2 do brief diz a medida de cada item; a tabela do §3 diz cada medida)

1. Os pedidos ao INE e ao Eurostat pelo cliente da casa, registados e alojados; as linhas geradas pelo livro do estudo 13; o `core.gate` a 0 em cada commit do motor. A API do INE responde por vezes com uma página em vez do JSON: o cliente da casa insiste; se ao fim das tentativas um indicador não responder, essa medida para e o relatório diz a hora e a resposta. Confirmas cada código na metainformação antes de o selar; um código que não seja o que a tabela diz para, e diz.
2. Os identificadores estáveis das medidas mensais e trimestrais, com o período no `reference_date`, a segunda linha do período anterior e a tabela `REGUAS_DECLARADAS` em `enquadramento.mjs`, com a planta; `linhasDeEnquadramento()` a incluir as linhas declaradas.
3. As medidas declaradas no sítio: `DOMINIO_DAS_MEDIDAS`, os nomes, as perguntas com origens seladas (a K16), as leituras (a K17), as unidades nas duas edições, as datas mensais e trimestrais pela `DataDaLinha` e pelo `check:formas`.
4. As leituras do lugar de direção sem uma palavra fixa mudada, salvo os acertos que a auditoria pedir, cada um dito com o literal; `acertos-rp1.json` e um guião que prove a igualdade, como `acertos-l1.py`.
5. O mapa do repositório reposto com o que o bloco acrescenta; `conferir-mapa.py` a passar.
6. As capturas (390, 768, 1 024, 1 280 e 1 600 px; as duas edições; a página do país e a dos temas; antes e depois) em `design/especime-v3/medicoes/rp1-2026-09-26/capturas/`; o relatório em `design/especime-v3/medicoes/rp1-2026-09-26/LEIA-ME.md` (a tabela do mandato com a medida de cada item; cada medida do §3 com o seu estado; os acertos; as células que mudaram de forma e o que protegem; as plantas; os commits e a cabeça; os códigos dos três portões lidos de ficheiro; o custo; o que ficou por fazer e porquê); o `medidas.json` por um guião do bloco, com cada número do relatório a citar o nome da medição na mesma frase, e `python3 scripts/leituras/conferir-relatorio.py` a zero faltas; as cópias congeladas das duas páginas do depois nas duas edições, presas por sha256.

## O que não fazes

Nenhum valor existente muda. Nenhuma medida por concelho. Nenhum gráfico. Nenhuma medida de PDF, comunicado, boletim ou portal sem API. Nenhum «cabaz» composto. Nenhuma cor nem valor de referência inventado. Nenhuma mudança à leitura do país nem às leituras existentes. O texto do rótulo de IA não se toca. Nenhuma fixture se diz resposta guardada sem endereço, hora, cliente e sha256. Nenhum `push`. Não tocas em `indicators/availability.json`, em `indicators/vintages.json`, em `.maintenance-locks/`, em `sweeps/` nem em `publisher/recortes/manifest.regioes.json` no motor.

## As regras de trabalho

- A regra de paragem: só um portão que protege um número, uma fonte ou uma pessoa te faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta que morde. Uma API que não publica o que a tabela diz é isso: paras nessa medida, registas, e continuas nas outras. Se ao medir achares que o brief ou o ficheiro das leituras está errado num ponto, medes, dizes e paras nesse ponto.
- Commits pequenos por caminhos explícitos, com os trailers contíguos `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e `Claude-Session: https://claude.ai/code/session_01B4Zx94pG7dxxQNpoEn1bjP`; no motor só o `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate` (cerca de dois minutos e meio). Este guião entra num dos teus commits.
- Entre commits correm só as conferências que a mudança toca; os três portões inteiros (`npm run build`, `npm run verify`, `npm run typecheck`) uma vez, na cabeça final, cada um no seu comando com o código de saída escrito num ficheiro acabado de escrever em `design/especime-v3/medicoes/rp1-2026-09-26/portoes/` (apaga os `.codigo` antes de correr). O teu último commit é o de entrega das provas, e o relatório diz de que cabeça são os códigos.
- Uma construção de cada vez na máquina: não corras portões enquanto outro processo os corre.
- Escreves o relatório também quando paras a meio: o que fizeste, onde paraste, o que o portão protege.

## O que os blocos anteriores ensinaram, e que poupa tempo

- `parsePtNumber()` de `src/lib/ledger.mjs` lê «20 600» e «−50,2»; um `Number()` sobre a cadeia não lê nenhum dos dois.
- Um valor selado leva a unidade consigo antes da marca (o `sufixo` do `Claim`), e o `data-claim` contém só o valor da linha; a palavra «provisório» rende-se sozinha onde a linha traz a bandeira.
- A K17 compara o texto rendido da leitura com o do resolvedor carácter a carácter; a K16 exige um literal por pedaço de pergunta; as duas leem as declarações, não o `dist/`, na metade da auditoria.
- As chaves da prova recusam qualquer marca fora da lista de `prova.mjs`; um cartão de linha não precisa de chaves da prova.
- O `check:briefs` volta a correr o guião do §0 do brief na cadeia `verify`: as cópias congeladas do L1 e o guião não são teus.
- O `PACOTE_EXTRA` do `pacote.sh` leva as cópias congeladas para a leitura a frio; o teu relatório diz de que cabeça são as capturas do «antes».
