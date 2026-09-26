# Prompt para a sessão seguinte · O Estado do País (depois de 26.09.2026, à noite)

*Escrito pelo lugar de direção (Claude Fable 5.1) no fecho de 26.09.2026 às 19:53 UTC, com o estado lido por `scripts/leituras/estado.py` (M16) e nada de memória. Cola-se inteiro como primeira mensagem da sessão seguinte. Sem travessões.*

## 1 · O que a sessão lê primeiro, por esta ordem

1. `CLAUDE.md` do projeto (as regras; o §1.112), `design/especime-v3/PENDENTES-DO-DIRETOR.md` (três linhas novas de 26.09: os caminhos da máquina na história pública, as licenças por afirmar e as credenciais do portal dos combustíveis, o aviso legal do BPstat), `VISAO.md` (§5, a linha do tracker), `design/observatorio/POLITICA-DA-AUTONOMIA.md`.
2. `DECISIONS.md` da §1.131 em diante: a §1.132 é o dia inteiro do RP1 (as três peças do Codex, as duas leituras a frio do Opus, a aterragem, as decisões do diretor nas palavras dele, o custo).
3. `design/especime-v3/ISSUES.md`: a I153 fechada; as I154 a I160 abertas a 26.09 (a I158, o espaço entre o número e a unidade no texto acessível dos cartões, e a I159, a frase fixa «É a subida geral dos preços», são as primeiras linhas da passagem de correção seguinte; a I157 é do diretor).
4. `design/observatorio/REGISTO-DE-MELHORIAS.md`: as M32 (a vigia da Vercel só da árvore principal), M33 (nenhum `cd` em comandos paralelos) e M34 (a metainformação lida antes de escrever um código num brief; um guião do §0 nunca lê o motor).
5. As duas leituras a frio de 26.09, `design/especime-v3/critica/LEITURA-rp1-2026-09-26.md` e `LEITURA-rp1bc-2026-09-26.md`, e o relatório do bloco, `design/especime-v3/medicoes/rp1-2026-09-26/LEIA-ME.md` (as três secções).
6. Os briefs em vigor: `design/observatorio/BRIEF-RP2-rendimentos-e-precos-os-documentos-e-as-outras-apis.md` (com `MEMO-fontes-rp2-2026-09-26.md`) e `BRIEF-RP3-as-series-no-motor-e-no-livro.md`; o brief do RP1 com o §8 (a forma de uma correção de códigos).
7. `python3 scripts/leituras/uso.py` antes de qualquer bloco pesado (a semana do Claude repõe a 28.09 às 10:00 UTC).

## 2 · O que se faz a seguir, por esta ordem

1. **A passagem de correção do RP1** (uma peça pequena, o Codex `gpt-6-astra` a construir e o Opus `leitor` a ler): a I158 (o espaço entre o valor e a unidade no texto de todos os cartões, com a célula da I143 alargada aos cartões e uma planta), a I159 (a frase da inflação dentro do ramo do sinal; o IHPC a comparar «a variação»), a I160 (as rendas «das de há um ano»; a pensão em inglês; «drinks»/«beverages»), e as notas menores da segunda leitura (o literal das idades 15 a 64; a régua declarada a ler a geografia da linha da União; a preposição do trimestre em `strings.mjs`; o resumo do registo por recalcular; a saída de `relatorio-rp1.py --verifica` no pacote). As palavras das leituras são do lugar de direção: escrevem-se na quarta redação de `design/observatorio/leituras/LEITURAS-rp1-2026-09-26.mjs` antes de lançar o construtor, ensaiadas a seco.
2. **A peça RP2a** (as APIs novas do brief do RP2: o salário mínimo do Eurostat na página da União e em percentagem do salário médio e mediano, os preços da eletricidade e do gás para as famílias, a prestação e a taxa de juro do crédito à habitação do INE), pela máquina do RP1; as leituras escritas antes; o brief já tem as coordenadas confirmadas pelo memorando, mas o lugar de direção confirma cada código na metainformação antes de o mandar (M34).
3. **O RP3** (as séries no motor e no livro-razão), pelo brief; depois **o RP4** (o gráfico), cujo brief está por escrever (a forma 4.1 do memorando do Opus, a base pela regra do §3.3, a entrada do tracker na primeira página para fechar a I154).
4. **A peça RP2b** (os documentos e portais) só depois das decisões do diretor sobre as licenças e as credenciais (PENDENTES).
5. Depois: o L2 (as leituras municipais), a peça 2 do B2, a I152, os recibos (B3), o pré-registo do estudo do OE 2027.

## 3 · As regras de processo que este dia fixou

- A leitura a frio de um bloco do Codex é do Opus (`leitor`); a do Opus é do Codex (`ler.sh`); cinco plantas só nas cópias do pacote, com o registo fora da vista do leitor (`scratchpad/plantas/`); o pacote leva o `motor/` com os corpos alojados (sem PDF), o `MANIFEST.sha256` e os recibos construídos das linhas novas.
- Um guião do §0 de um brief só mede o que a máquina do portão consegue ler (o repositório do sítio numa cabeça presa); nunca o motor (M34): a corrida «portão» de um ramo fecha se o fizer.
- Nenhum ficheiro novo leva o caminho da máquina nem o nome do utilizador (I157); os prompts dos construtores dizem a worktree pelo `-C` da linha de comando; o `medir-*.mjs` de cada bloco mede o zero com conhecido-positivo.
- A Vercel vigia-se só da árvore principal, com `vercel ls --yes > ficheiro 2>&1`, um pedido por minuto, até ver o lançamento novo «Ready» e o `version.json` com a cabeça (M32); `git -C` e caminhos absolutos em tudo o que corre em paralelo (M33).
- Os três portões correm na cabeça que aterra, cada um no seu comando, com o código lido de ficheiro, e a corrida «portão» do ramo publicado tem de estar verde nessa mesma cabeça; a aterragem pelo guião `aterrar-<bloco>.sh` (a fusão por avanço rápido, o push no seu comando, o motor, a vigia, o `verify:deploy`, a corrida de main).

## 4 · O estado, lido no fecho

## O estado, lido a 26.09.2026 às 19:53:41 UTC por `scripts/leituras/estado.py`

*Cada linha foi lida agora, do comando que ela própria diz. O que não se leu diz «NÃO LIDO». Nada aqui foi escrito de memória; o que se acrescentar à mão por baixo deste bloco diz que o foi.*

### O sítio (`<a árvore principal do sítio>`)
- `main`: e71682f4 · 2026-09-26T19:26:31+01:00 · RP1: o guião do §0 do brief deixa de ler o motor, porque a corrida «portão» do ramo fechou nas duas medições que só a máquina do lu  (`git log -1 main`)
- `origin/main`: e71682f4 · 2026-09-26T19:26:31+01:00 · RP1: o guião do §0 do brief deixa de ler o motor, porque a corrida «portão» do ramo fechou nas duas medições que só a máquina do lu  (`git log -1 origin/main`)
- `main` está 0 à frente e 0 atrás de `origin/main`  (`git rev-list --left-right --count`)
- árvore principal: 14 entrada(s) por registar: `M DECISIONS.md`; `M VISAO.md`; `M design/especime-v3/ISSUES.md`; `M design/especime-v3/PENDENTES-DO-DIRETOR.md`; `M design/observatorio/REGISTO-DE-MELHORIAS.md`; `?? design/especime-v3/critica/LEITURA-rp1bc-2026-09-26.md`; `?? design/especime-v3/critica/LEITURA-rp1bc-2026-09-26.plantas.json`; `?? design/observatorio/BRIEF-RP2-rendimentos-e-precos-os-documentos-e-as-outras-apis.md`  (`git status --short`, código 0)
- ramos locais: `main e71682f4`  (`git branch`)
- ramos no remoto: `main`  (`git ls-remote --heads origin`)
- worktree: `<a árvore principal do sítio> e71682f4 [main]`

### As últimas corridas da CI (`gh run list --limit 6`)
- 36265880639 · `e71682f4` · main · portão · **completed / success** · criada 2026-09-26T19:23:21Z · atualizada 2026-09-26T19:50:51Z
- 36262554131 · `e71682f4` · rp1-2026-09-26 · portão · **completed / success** · criada 2026-09-26T18:26:35Z · atualizada 2026-09-26T18:54:27Z
- 36261614642 · `4af5ef88` · rp1-2026-09-26 · portão · **completed / failure** · criada 2026-09-26T18:10:39Z · atualizada 2026-09-26T18:23:24Z
- 36237004781 · `334cc740` · main · portão · **completed / success** · criada 2026-09-26T10:50:40Z · atualizada 2026-09-26T11:17:51Z
- 36235901329 · `334cc740` · registos-2026-09-26 · portão · **completed / success** · criada 2026-09-26T10:28:39Z · atualizada 2026-09-26T10:50:30Z
- 36235148201 · `66b65906` · main · portão · **completed / success** · criada 2026-09-26T10:13:46Z · atualizada 2026-09-26T10:41:05Z

### O que está no ar (`/version.json` do sítio publicado)
- commit no ar: `e71682f4` · construído em 2026-09-26T19:34:15.034Z · ref `main` · production
- igual a `origin/main` (`e71682f4`): **sim**
- isto NÃO substitui o `npm run verify:deploy`, que confere também as respostas e os cabeçalhos.

### O motor (`~/Instruments/ResearchHub`)
- `master`: 4eb2867 · 2026-09-26T18:23:04+01:00 · RP1c: conservar os excertos completos e selar as origens das leituras  (`git log -1 master`)
- `origin/master`: 4eb2867 · 2026-09-26T18:23:04+01:00 · RP1c: conservar os excertos completos e selar as origens das leituras  (`git log -1 origin/master`)
- `master` está 0 à frente e 0 atrás de `origin/master`  (`git rev-list --left-right --count`)
- árvore principal: 5 entrada(s) por registar: `M sweeps/state.json`; `?? .maintenance-locks/`; `?? indicators/out/pde-2026-09-23/`; `?? publisher/recortes/manifest.regioes.json`; `?? sweeps/sweep-2026-09-01.md`  (`git status --short`, código 0)
- ramos locais: `master 4eb2867`  (`git branch`)
- ramos no remoto: `master`  (`git ls-remote --heads origin`)
- worktree: `~/Instruments/ResearchHub 4eb2867 [master]`

### O uso das duas subscrições (`python3 scripts/leituras/uso.py`)
    Claude (escrito pela linha de estado a 26.09.2026 19:53 UTC):
      janela de 5 horas: 4% usados, repõe a 26.09.2026 23:40 UTC
      semana: 94% usados, repõe a 28.09.2026 10:00 UTC
    Codex (última leitura: 2026-09-26T18:04:01.404Z; plano «prolite»):
      semana: 8.0% usados, repõe a 03.10.2026 17:10 UTC

### Os construtores do Codex (`.claude/codex-*.log`)
- `codex-b2-peca1-correcao-2.log`: INICIO 21:07:38 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=1 21:17:31** · 17379 linhas
    - tokens used 143,421
- `codex-b2-peca1-correcao.log`: INICIO 19:45:15 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 20:23:21** · 20365 linhas
    - tokens used 269,330
- `codex-b2-peca1.log`: INICIO 17:58:00 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 19:41:33** · 106767 linhas
    - tokens used 890,275
- `codex-peca3-correcao-2.log`: INICIO 04:37:40 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 05:16:55** · 76855 linhas
    - tokens used 347,577
- `codex-peca3-correcao.log`: INICIO 03:33:09 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 04:07:25** · 35608 linhas
    - tokens used 229,648
- `codex-peca3.log`: INICIO 19:38:29 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 21:13:27** · 54396 linhas
    - tokens used 955,117
- `codex-rp1.log`: INICIO 13:50:18 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 15:37:58** · 68345 linhas
    - tokens used 896,659
- `codex-rp1b.log`: INICIO 16:01:48 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 17:07:06** · 41073 linhas
    - tokens used 493,377
- `codex-rp1c.log`: INICIO 17:08:33 modelo=gpt-6-astra raciocínio=xhigh · **FIM exit=0 18:04:04** · 31423 linhas
    - tokens used 457,106

## 5 · As horas do dia (UTC)

O RP1 pelo Codex das 13:50 às 15:38; a correção do brief e o RP1b das 16:01 às 17:07, com a primeira leitura a frio do Opus a correr ao mesmo tempo (41 minutos, entregue antes das 17:00); o RP1c das 17:08 às 18:04; a segunda leitura a frio, 73 minutos, entregue às 19:21; os portões na cabeça final das 18:26 às 18:40; a aterragem das 19:23 às 19:51 (a Vercel «Ready» às 19:38, o `verify:deploy` a 0, a corrida de main verde). Os registos e este prompt no fecho.
