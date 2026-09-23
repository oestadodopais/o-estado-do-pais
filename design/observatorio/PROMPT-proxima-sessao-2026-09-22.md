# Prompt para a sessão seguinte · O Estado do País · depois de 22.09.2026 (a cópia da noite, do Desktop)

*Escrito pelo lugar de direção (Claude Fable 5.1) na noite de 22.09.2026, no fecho de uma sessão que começou a 21.09 de manhã. **Esta cópia substitui a da tarde:** desde ela aterraram mais dois blocos no sítio (o M5 e os registos do M4), três commits no motor (os nomes do INE, o `--help` do portão da exportação, o M4), e o mapa do repositório foi posto em dia. O estado exato de fecho está no §4, impresso por `scripts/leituras/estado.py` e não escrito de memória. A ordem de leitura é a do `CLAUDE.md` do projeto. Sem travessões na prosa.*

## 0 · O que mudou nas regras e nos hábitos a 22.09

- **Nada fica para depois** (o diretor, 22.09 de manhã: «anything that we need to do, we should do it… so nothing is left behind»). Cada bloco aterra com os seus registos, e o que um construtor deixa «para decisão» decide-se e fecha-se na mesma sessão quando fizer sentido fazê-lo. A 22.09 à tarde: o construtor do M4 deixou «para o diretor» se o estudo 11 se repara ou se se arquiva; o lugar de direção decidiu (repara-se, §1.121) e escreveu o brief do M4b no mesmo dia.
- **O §0 de um brief mede-se por guião e liga cada número ao nome da sua medição** (M5, §1.122): `design/observatorio/medidas/<chave>.py` escreve `<chave>.json`, cada medição com o valor, o comando e um conhecido-positivo; o `check:briefs` volta a correr o guião em cada `verify` e exige que cada número de uma frase do §0 seja o valor de uma medição citada nessa frase. Num §0 os números escrevem-se em algarismos. Os briefs anteriores a 22.09 estão isentos por data e presos pelo sha256; os três de 22.09 escritos antes da regra (B1c, I129, M3b) por nomeação numa lista fechada.
- **Um relatório de construtor entra no pacote de leitura com a sua conferência dentro** (`scripts/leituras/conferir-relatorio.py`, corrido pelo `pacote.sh`): cada número do relatório tem de existir num JSON da pasta das medições, e o leitor a frio sabe à partida quais não existem. O que conta como número vive num leitor só, `scripts/leituras/numeros.py`, com os seus limites escritos (numerais por extenso, código, anos isolados ficam fora).
- **O nome do diretor mora só no oráculo do portão** (`scripts/textos-aprovados.json`); a célula exige zero ocorrências em `src/` e `public/` e zero páginas construídas com ele, com o detetor a provar que vê.
- **O portão do motor vê um livro-razão que ninguém declara** (M19): `core.gate` falha com um livro sob `content/` sem entregável, lido pelo conteúdo e pelas linhas todas; as exceções escrevem-se com razão e a lista recusa as suas formas de apodrecer; um JSON que não se lê fecha o portão.
- **O estado de fecho lê-se, não se escreve** (M16, `estado.py`); **a medição de um brief prova primeiro que vê** (M18); **nenhuma fixture se diz resposta guardada sem o provar** (célula `fixtures`); **um estado de verificação declarado rende-se em todas as páginas** (§1.115, §1.120).

## 1 · O primeiro gesto

1. `python3 scripts/leituras/estado.py` (lê os dois repositórios), `npm run verify:deploy`. **O que deve estar no ar:** `main` com o M5 e os registos do dia por cima do B1c; o motor em `master` com o M4, os três nomes do INE resolvidos e o `--help` do portão da exportação (as cabeças e as horas no §4).
2. **A primeira coisa pequena: a I136.** Três marcadores `[a verificar]` em notas internas de duas linhas da primeira página (a disparidade salarial 2024: quem produz a estimativa do Eurostat nos anos sem inquérito; o salário mínimo 2026: os diplomas regionais dos Açores e da Madeira e os termos do Diário da República). Ler as fontes com os corpos guardados, fechar cada marcador na linha, e decidir a regra (um `[a verificar]` numa nota leva data e ou se fecha na semana ou sobe a campo visível). Pelo lugar de direção, sem construtor.
3. **O que o diretor disser como leitor** sobre as duas peças do B1 e a primeira página depois do B1c (as capturas foram-lhe enviadas) é a primeira coisa a tratar quando chegar.
4. **23.09.2026: a 2.ª notificação do Procedimento dos Défices Excessivos (INE).** Ler o destaque no dia ou a seguir: se o défice ou a dívida de 2025 forem revistos, a leitura do país (89,7 % do PIB, do quadro do Eurostat) fica atrás da fonte nacional; decidir a fonte de registo da dívida pública e dizê-lo em «O que mudou».
5. **O primeiro bloco do motor: o M4b** (`design/observatorio/BRIEF-M4b-o-livro-razao-do-11-reparado-e-declarado.md`, o §0 medido pelo seu guião). O livro-razão do estudo 11 reparado (sete valores, vinte classificações de fonte, dez derivações, o `entity_aliases`), as duas edições reconciliadas (89 e 328 órfãos, 40 desvios), o estudo declarado no portão, as três linhas com ressalvas fechadas ou marcadas. É um bloco inteiro: Opus a construir (ou Codex, se o diretor o lançar), a outra família a ler. Depois, o pequeno da M9 (o comentário das reconferências em dobro nas 59 linhas).
6. **O nome da PORDATA para `tipslm90`** confere-se contra a linha corrigida quando o exportador reler a linha (fica 1 por decidir no `nomes.json`).
7. **Semana de 28.09: o registo prévio do estudo do Orçamento do Estado para 2027** (o levantamento está no motor; falta a pergunta do leitor: para onde vai o dinheiro, por função e por programa, contra os anos anteriores e contra o executado).
8. **O brief do B2 (os temas)** leva: dez câmaras fora do limite legal da dívida em 2024, 297 dentro, uma sem valor; a coluna esquerda da cabeça da primeira página vazia por baixo da leitura a 1 280 px; as comparações entre pares por grupo (da revisão do Gemini). **O B3 (a linha)** leva a I133 (regiões e distritos sem «O que mudou») e os índices dos concelhos que a peça 2 deixou sem página.
9. **O estudo do médico de família** (Codex, 11.09, na pasta do Desktop do diretor): o SNS respondeu a 22.09 (o pedido dos documentos da DE-SNS precisa de formulário LADA assinado até 29.09; os indicadores estão nos portais públicos; os documentos das medidas estão nas ULS e na ACSS). O lugar de direção disse ao diretor: não é preciso para a comparação por concelho; o que o estudo precisa é a tabela mensal por concelho, pedida formalmente à ACSS/SPMS, e isso é assinatura dele. Fica com ele; o estudo só entra na fila com esses dados.

## 2 · O que fica com o diretor, e o que se lhe pergunta

O dinheiro, a exposição legal, o que sai em nome do projeto para terceiros, os limites da subscrição. Ao leitor pergunta-se o que um leitor sabe, sobre as páginas no ar. Pendentes dele: o pedido formal dos dados por concelho (assinatura); a leitura das páginas do B1 e da primeira página; a proposta de uma regra nova no registo de incidentes a partir das ocorrências de «facto escrito de memória» e «medido com um detetor que não via».

## 3 · Onde estão as coisas novas

`scripts/leituras/estado.py`; `scripts/check-briefs.py` e `design/observatorio/medidas/`; `scripts/leituras/conferir-relatorio.py` e `numeros.py`; as leituras a frio de 22.09 em `design/especime-v3/critica/` (`LEITURA-b1-peca3`, `LEITURA-m3b`, `LEITURA-i129`, `LEITURA-b1c`, `LEITURA-m4`, `LEITURA-m5`, cada uma com o seu `.plantas.json`); as medições do M4 copiadas em `design/especime-v3/medicoes/m4-2026-09-22/` e as do M5 em `m5-2026-09-22/`; no motor, `content/11 Seguranca Social/Technical Source/` (o relatório, o `medidas.json`, o `medir.py`, a planta guardada) e `indicators/out/nomes-conferidos-2026-09-21/por-outra-via-2026-09-22/` (os corpos do INE e do Eurostat com endereço, hora e sha256). Os briefs: `BRIEF-M4`, `BRIEF-M5`, `BRIEF-M4b`. O mapa do repositório conferido a 58 citações certas em 58.

## 4 · O estado de fecho, lido por `estado.py` (não escrito de memória)

## O estado, lido a 22.09.2026 às 17:29:45 UTC por `scripts/leituras/estado.py`

*Cada linha foi lida agora, do comando que ela própria diz. O que não se leu diz «NÃO LIDO». Nada aqui foi escrito de memória; o que se acrescentar à mão por baixo deste bloco diz que o foi.*

### O sítio (`/Users/nunosantos/Instruments/OEstadoDoPais`)
- `main`: d3481ba9 · 2026-09-22T17:35:01+01:00 · A §1.122 com o campo «Afecta» na forma que a amarra das decisões exige  (`git log -1 main`)
- `origin/main`: d3481ba9 · 2026-09-22T17:35:01+01:00 · A §1.122 com o campo «Afecta» na forma que a amarra das decisões exige  (`git log -1 origin/main`)
- `main` está 0 à frente e 0 atrás de `origin/main`  (`git rev-list --left-right --count`)
- árvore principal: 0 entrada(s) por registar  (`git status --short`, código 0)
- ramos locais: `main d3481ba9`  (`git branch`)
- ramos no remoto: `main`  (`git ls-remote --heads origin`)
- worktree: `/Users/nunosantos/Instruments/OEstadoDoPais d3481ba9 [main]`

### As últimas corridas da CI (`gh run list --limit 6`)
- 35759367080 · `d3481ba9` · main · portão · **completed / success** · criada 2026-09-22T17:14:20Z · atualizada 2026-09-22T17:33:54Z  (lida outra vez ao fechar)
- 35756471230 · `d3481ba9` · medidas-2026-09-22 · portão · **completed / success** · criada 2026-09-22T16:47:47Z · atualizada 2026-09-22T17:13:10Z
- 35735075345 · `b03a6efc` · main · portão · **completed / success** · criada 2026-09-22T13:40:54Z · atualizada 2026-09-22T14:05:56Z
- 35732821779 · `b03a6efc` · oquemudou-2026-09-22 · portão · **completed / success** · criada 2026-09-22T13:20:26Z · atualizada 2026-09-22T13:39:33Z
- 35726876844 · `95655124` · main · portão · **completed / success** · criada 2026-09-22T12:23:23Z · atualizada 2026-09-22T12:49:14Z
- 35725204492 · `95655124` · jovens-nem-2026-09-22 · portão · **completed / success** · criada 2026-09-22T12:06:12Z · atualizada 2026-09-22T12:22:17Z

### O que está no ar (`/version.json` do sítio publicado)
- commit no ar: `d3481ba9` · construído em 2026-09-22T17:24:02.683Z · ref `main` · production
- igual a `origin/main` (`d3481ba9`): **sim**
- isto NÃO substitui o `npm run verify:deploy`, que confere também as respostas e os cabeçalhos.

### O motor (`/Users/nunosantos/Instruments/ResearchHub`)
- `master`: e60aba6 · 2026-09-22T16:59:48+01:00 · Cada numero do relatorio tem casa, e o conferidor le as duas formas  (`git log -1 master`)
- `origin/master`: e60aba6 · 2026-09-22T16:59:48+01:00 · Cada numero do relatorio tem casa, e o conferidor le as duas formas  (`git log -1 origin/master`)
- `master` está 0 à frente e 0 atrás de `origin/master`  (`git rev-list --left-right --count`)
- árvore principal: 4 entrada(s) por registar: `M sweeps/state.json`; `?? .maintenance-locks/`; `?? publisher/recortes/manifest.regioes.json`; `?? sweeps/sweep-2026-09-01.md`  (`git status --short`, código 0)
- ramos locais: `master e60aba6`  (`git branch`)
- ramos no remoto: `master`  (`git ls-remote --heads origin`)
- worktree: `/Users/nunosantos/Instruments/ResearchHub e60aba6 [master]`

### O uso das duas subscrições (`python3 scripts/leituras/uso.py`)
    Claude (escrito pela linha de estado a 22.09.2026 17:29 UTC):
      janela de 5 horas: 4% usados, repõe a 22.09.2026 21:10 UTC
      semana: 40% usados, repõe a 28.09.2026 10:00 UTC
    Codex (última leitura: 2026-09-22T05:16:53.637Z; plano «prolite»):
      semana: 35.0% usados, repõe a 28.09.2026 12:44 UTC

### Os construtores do Codex (`.claude/codex-*.log`)
- `codex-peca3-correcao-2.log`: INICIO 04:37:40 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 05:16:55** · 76855 linhas
    - tokens used 347,577
- `codex-peca3-correcao.log`: INICIO 03:33:09 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 04:07:25** · 35608 linhas
    - tokens used 229,648
- `codex-peca3.log`: INICIO 19:38:29 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 21:13:27** · 54396 linhas
    - tokens used 955,117

## 5 · As horas e os símbolos das aterragens de 22.09 à tarde e à noite (lidos dos registos, não de memória)

- **O sítio.** O ramo `medidas-2026-09-22` (o M5 em onze commits do Opus, o mapa e o prompt comum, os registos do dia, os nomes do INE e o brief do M4b), cabeça `d3481ba9`. Os três portões a 0 nessa cabeça, cada um no seu comando com o código lido de ficheiro: `build` 16:35:01 a 16:39:43 UTC, `verify` 16:39:43 a 16:47:24 UTC, `typecheck` 16:47:24 UTC. A corrida `portão` do ramo (35756471230) verde às 17:13:10 UTC, com o `check:briefs` a correr no anfitrião da CI (38 briefs, 2 conferidos, 23 números do §0 ligados). `git merge --ff-only` e `git push origin main` às 17:14:18 UTC; a corrida `portão` de `main` (35759367080) criada às 17:14:20 UTC, com a conclusão lida ao fechar no §4; o lançamento da Vercel construído às 17:24:02 UTC e visto «Ready» pela vigia de um pedido por minuto; `npm run verify:deploy` a 0 às 17:29:12 UTC («o que está no ar é o que está no repositório»). A worktree e o ramo apagados, no local e no remoto.
- **O motor.** `e417813` (os três nomes do INE, commit 15:22:34 UTC), `8ae6b53` (o `--help` do portão da exportação, 15:27:36 UTC), e o M4 rebaseado e fundido por avanço rápido como `e60aba6` (15:59:48 UTC), cada um com o `core.gate` a 0 no pre-commit e o `core.gate_test` a 0 (18 conferências), os três publicados em `origin/master`.
- **Os símbolos.** M4: Claude Opus 245 933 na construção e 335 072 na passagem de correção (581 005); a leitura a frio do Codex 157 890 (15:15:59 a 15:32:51 UTC). M5: Claude Opus 420 838 e 544 585 (965 423); a leitura do Codex 249 603 (15:37:43 a 15:56:19 UTC). A busca das páginas do INE, Sonnet, 163 077. A reparação do mapa, Sonnet, 273 926. Os totais são os que o harness reportou ao lugar de direção no fim de cada agente; os construtores não os viram.
- **O que não aterrou hoje e fica dito:** a cópia deste prompt no repositório (`design/observatorio/PROMPT-proxima-sessao-2026-09-22.md`) é a da madrugada; esta cópia do Desktop é a que vale, e entra no repositório com a primeira aterragem da sessão seguinte, junto com os registos da I136.
