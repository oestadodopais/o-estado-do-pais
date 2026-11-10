# Mandato VEL1: a corrida `portão` em metade do tempo, sem tirar uma conferência (10.11.2026)

Acrescenta: nada
Medidas: medidas-vel1.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), sem rede, na worktree do sítio `vel1-2026-11-10`, sobre o `main` que tem o REC1. O motor não muda. Outro construtor está a trabalhar no motor ao mesmo tempo, noutra worktree: a tranca da máquina é uma só, e uma construção tua pode ter de esperar por um portão dele; espera, não contornes. A medição em que assenta é a do caminho até ao ar (10.11.2026, um leitor Opus, só em leitura, sobre quatro aterragens e três corridas do GitHub), de que esta pasta guarda os tempos: `tempos-github-42678039181.json` (as conferências das seis partes) e `tempos-github-build-42678039181.json` (os passos do `build`, de marca a marca no registo do trabalho `construir`).*

## Porquê

Do último commit ao ar passam hoje quarenta e seis a cinquenta e cinco minutos quando nada falha, e mais de nove décimos desse tempo é a corrida `portão` do ramo. Uma correção de uma frase espera o mesmo que um estudo novo. A corrida é lenta por três razões que não protegem nada: a cadeia do `build` corre em série num só executor, com vinte conferências que só leem o `dist/`; a conferência mais longa fica sozinha numa parte e é sempre a última a acabar; e a mesma cabeça corre a corrida inteira outra vez em `main`, depois de já estar no ar.

Este bloco não tira nenhuma conferência do caminho, não muda o que nenhuma mede e não muda o que bloqueia. Muda onde e quando cada uma corre.

## §0 O que se mediu

Na corrida do ramo da última aterragem (o número da corrida está no nome dos dois ficheiros de tempos), a conferência `check:alvos` levou 941 segundos e ficou sozinha na parte 0; o `check:voz` levou 603 segundos dentro do `build`, em série; o `check:voz-retiradas` levou 598. Os tempos de `scripts/verify-partes-tempos.json`, por onde o plano das partes se faz, são os da máquina de 03.11 e não os do executor do GitHub, que é mais de duas vezes mais lento.

Outras medidas da mesma coisa: os recibos das aterragens (`aterragem.json`) medem o caminho inteiro na máquina e a API do GitHub mede cada trabalho; as duas batem ao segundo nas quatro aterragens lidas. Não há outra medição publicada.

## Parte I: a corrida do GitHub (`.github/workflows/portao.yml`, `scripts/verify-partes.mjs`, `scripts/verify-depois-do-build.mjs`, `package.json`)

1. **No GitHub, o trabalho `construir` corre só os passos que escrevem.** Uma cadeia nova no `package.json`, `build:escrever`, com os passos de `build:conteudo` que escrevem o `dist/` ou as provas, pela mesma ordem: `mapa:unidades`, `ledger:check`, `check:registo`, `check:cruzamento`, `check:documentos`, a preparação do carimbo, o `astro build`, o calendário, o carimbo, os `cartoes`, o `gate:html` e o `check:cadeia`. O `construir` passa a correr `build:escrever` (com a tranca, como o `build`), o `typecheck` e o plano. O `npm run build` da máquina fica como está, inteiro e a parar no primeiro vermelho.
   - Antes de fixar a lista, mede: corre cada um dos outros passos de `build:conteudo` sobre um `dist/` construído e compara o inventário do `dist/` antes e depois (a função `inventario` já existe). Um passo que escreva no `dist/` ou num ficheiro que outro passo leia fica em `build:escrever`, e dizes qual e porquê.
   - Os passos de `build:conteudo` que não ficam em `build:escrever` passam para as partes. O conjunto das partes passa a ser: os passos do `verify` e os de `build:conteudo` que não estão em `build:escrever` nem em `verify:com-motor`, cada um uma só vez. A célula U continua a exigir cada passo do `verify`, e passa a exigir também cada passo de `build:conteudo`: os de `build:escrever` pelo registo do `construir`, os outros pelas provas das partes.
   - Plantas, cada uma a recusar pelo seu motivo: um passo de `build:conteudo` que não está em `build:escrever` nem em parte nenhuma; um passo em `build:escrever` que não existe em `build:conteudo`; os passos de `build:escrever` por outra ordem que a de `build:conteudo`; um passo que só lê posto em `build:escrever` não é erro (corre mais cedo, e pára a corrida mais cedo).

2. **Oito partes, planeadas com os tempos do GitHub.** `scripts/verify-partes-tempos.json` passa a ter os segundos dos dois ficheiros desta pasta (a fonte dita no campo `fonte`), e `partes` passa a oito. A matriz do `conferir` e o ciclo do `portao` leem o número de partes do plano (`at1-build.json`), e não de uma lista escrita à mão em dois sítios; se o `portao.yml` não o puder ler, uma conferência recusa quando os dois números diferem, com planta.

3. **O `check:alvos` em três passos.** A régua ganha um argumento que escolhe uma de três fatias disjuntas (por edição e família de página, como a régua já as percorre), e o `verify` passa a ter os três passos no lugar do passo único. A união das três fatias é exatamente o que o passo único mede hoje: prova-o com a lista do que cada fatia mede contra a lista do passo inteiro, e com uma planta (uma fatia que salte uma família recusa). As plantas da própria régua correm em cada fatia ou numa só, à tua escolha, desde que corram.

4. **O trabalho `portao` deixa de descarregar a árvore inteira.** Só precisa do `package.json`, do `.nvmrc`, do `package-lock.json` e da pasta `scripts/`: uma árvore esparsa e rasa. Mede primeiro o que o `juntar` importa.

5. **O Chromium em cache.** `actions/cache` sobre a pasta do Playwright, com a versão do Playwright do `package-lock.json` na chave; o passo de instalação com um teto de cinco minutos e uma repetição. A ação fixa-se pelo resumo do commit, como as outras do ficheiro; sem rede não o podes ler: deixa o resumo como um campo por preencher com o nome exato da versão, e di-lo no relatório. Este lugar preenche-o antes de publicar o ramo.

6. **A corrida de `main` deixa de repetir a do ramo.** Num `push` para `main`, um primeiro trabalho pergunta à API se já há uma corrida `portão` concluída com sucesso para o mesmo resumo de commit, por um `push` para outro ramo deste mesmo repositório. Se houver, o `construir` e o `conferir` não correm, e o `portao` fica verde dizendo o endereço dessa corrida. Se não houver (um `push` direto para `main`), a corrida inteira corre como hoje. Uma corrida agendada, uma vez por dia em `main`, corre sempre inteira (apanha as réguas que dependem da data). O nome do trabalho `portao` não muda: é o contexto obrigatório da proteção de `main`.
   - A decisão fica num guião pequeno (`scripts/portao-dispensa.mjs`) que recebe a resposta da API como ficheiro e devolve sim ou não, para se poder provar sem rede. Plantas: o mesmo resumo verde num ramo dá sim; o mesmo resumo verde só em `main` dá não; outro resumo dá não; uma corrida falhada, cancelada ou por acabar dá não; outro fluxo com outro nome dá não; um pedido de integração ou uma corrida de outro repositório dá não.
   - O `portao` continua a recusar quando o `construir` ou o `conferir` não correram e não houve dispensa: com planta sobre a expressão, ou, se a expressão do YAML não se puder provar sem o GitHub, dizes isso no relatório e este lugar prova-o no ramo publicado.

## Parte II: a aterragem (`scripts/leituras/aterrar.py`)

Só depois de a Parte I estar comitada.

7. **O vigia não desiste à primeira falha de rede.** Quando o `gh run watch` sai com erro, a aterragem pergunta o estado da corrida (`gh run view`) até seis vezes, com trinta segundos entre elas, antes de parar. O intervalo do vigia passa de sessenta para dez segundos. Planta com um `gh` falso que falha duas vezes e depois responde.

8. **Uma retoma não refaz o que a tentativa anterior já fez para a mesma cabeça.** Se o recibo de uma tentativa anterior tiver um envio preparado para a mesma cabeça e o mesmo inventário do `dist/` (o sha256 de cada ficheiro), a retoma usa esse envio. Plantas: outra cabeça refaz; um ficheiro do `dist/` diferente refaz.

9. **As conferências com o motor correm enquanto o GitHub corre.** `series`, `ledger-corpos`, `frases-afirmacao`, `cruzamento --with-origin` e a camada 0 passam para antes da espera pelo GitHub, dentro da tranca que a preparação já tem; a conferência das árvores (a cabeça do sítio e a do motor) continua a correr outra vez imediatamente antes de fundir. Uma vermelha pára a aterragem antes de fundir, como hoje. Planta: uma destas vermelha, com o GitHub verde, não funde.

## O que fica como está, por decisão

- O `npm run build` da máquina, o `conferir-tudo.sh` e o pre-commit.
- O que cada conferência mede e o que bloqueia. Pôr a mobília a avisar sem travar é outra decisão, que este lugar toma depois de medir este bloco.
- Publicar o `dist/` que o GitHub conferiu em vez de o reconstruir na máquina, e encolher as plantas que correm o sítio inteiro: ficam para o bloco seguinte.

## A prova

Sem rede não corres o GitHub. Prova na máquina o que se pode provar: constrói uma vez (`npm run build`), corre `verify-partes.mjs planear`, as duas partes mais curtas do plano e a que tem uma fatia do `check:alvos`, e o `juntar` com provas feitas para as outras; todas as plantas dos pontos 1 a 3 e 6 a 9; as conferências que leem estes ficheiros (`check:leituras`, `check:projecao-portoes`, `check:repositorio`, `check:mortos`, `check:briefs`) e as irmãs que encontrares a procurar pelos nomes dos ficheiros que mudas em `scripts/` e `tests/`. A corrida inteira corre-a este lugar no ramo publicado, e mede-a contra a de antes.

## O relatório

Curto, em `RELATORIO-VEL1-1.txt` nesta pasta (o lançador escreve o seu resumo noutro ficheiro, e não lhe toques), sem caminhos da máquina, ponto a ponto: o que mudou, a planta e o que deu; a lista final de `build:escrever` e de cada passo que ficou lá por escrever no `dist/`; o plano das oito partes com as cargas; o que não pudeste provar sem rede. Cada código de uma conferência citado com a linha do registo, na forma que o pacote das leituras lê (`<!-- portao: … -->`). Os commits com o assunto a começar por `VEL1`.

## Quando paras

Só se um ponto não se cumprir sem que uma conferência deixe de correr ou passe a medir menos: páras nesse ponto, dizes qual e porquê, e fazes os outros. Para tudo o resto: deixa, diz e continua. O teto da passagem, num commit são; o que faltar fica para uma adenda.

## O fim

A prova acima e o relatório. O orçamento é o de uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas, com um commit no fim de cada ponto numerado, para um corte não perder nada.
