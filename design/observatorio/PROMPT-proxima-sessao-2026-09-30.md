# Prompt para a sessão seguinte · O Estado do País (depois de 30.09.2026, de manhã)

*Escrito pelo lugar de direção (Claude Fable 5.1) no fecho da sessão de 29 e 30.09.2026. O §4 foi lido por `scripts/leituras/estado.py` e não se escreve de memória. Sem travessões.*

## 1 · O que a sessão lê primeiro, por esta ordem

1. As regras de sempre do `CLAUDE.md` do projeto (a lista de leitura do começo de sessão), com o passo novo: `python3 scripts/leituras/uso.py` e `sh scripts/leituras/sondar-modelo.sh gpt-6.1-sol`.
2. `DECISIONS.md` §1.139 a §1.142: o guião da aterragem no repositório e a primeira aterragem do lugar de direção com a regra do diretor; o UE1 (onde Portugal fica entre os 27, a §1.124 que cumpriu a sua condição e mudou de forma, as definições declaradas nos recibos das séries); o F2.2b (as corridas prontas a armar, dormentes, lidas a frio quatro vezes, com as decisões das triagens); e o modelo do Codex, o revisor automático das aprovações e a aterragem do F2.2b.
3. `design/especime-v3/PENDENTES-DO-DIRETOR.md`: as chaves e os três interruptores das corridas (`CORREDOR_ARMADO`, `PAINEL_ARMADO`, `VARRIMENTO_ARMADO`; o Google Doc no Drive dele ainda só nomeia o primeiro), o teto e a pausa do ciclo, a primeira página para ver com os amigos, e o que fica do nome dele no repositório público.
4. As issues abertas do repositório do motor (`gh issue list -R oestadodopais/motor`), onde os alarmes das corridas chegam; com o F2.2b no `master`, o vigia ganhou um trabalho para o painel e o varrimento, dormente enquanto os interruptores não existirem.
5. As questões novas: a I178 (o guião dos acertos do L1 já não descreve o ficheiro das leituras desde o RP1), e as que ficaram de 29.09 (a I174 a I177).
6. `design/observatorio/REGISTO-DE-MELHORIAS.md`, da M41 à M44: o F2.2b, as decisões em vigor nos ficheiros de um bloco (`decisoes-em-vigor.py`), o revisor automático das aprovações e o `--add-dir`, e a sonda do modelo mais recente.

## 2 · O que se faz a seguir, por esta ordem

1. **A sonda do modelo.** `sh scripts/leituras/sondar-modelo.sh gpt-6.1-sol` no arranque. Se a conta o aceitar, o leitor passa a ele (`CODEX_MODELO` em `ler.sh`, mudado de propósito e registado) e a primeira leitura com ele diz as plantas que achou; o construtor experimenta-se num bloco, contra a história da Astra (o F2.2b: três passagens e quatro leituras), como a §1.142 diz. Enquanto a conta o recusar, ficam o `gpt-6-astra` e o `gpt-5.6-sol`, a xhigh.
2. **O que o diretor disser da primeira página**, com os amigos, antes de tudo o resto.
3. **O primeiro bloco do Codex mede a M43**: lança-se com as outras pastas com escrita depois do relatório (`construir-codex.sh <worktree> <prompt> <relatorio> <outra worktree>`), e contam-se as sessões do revisor automático (esperam-se 0) e os símbolos cobrados, contra os 29 % da noite de 29 para 30.09.
4. **As corridas no GitHub, quando o diretor puser as chaves e os interruptores**: primeiro os ensaios despachados à mão (o painel e o varrimento em `ensaio`, que não publicam nada), depois o corredor armado; a reforma dos agentes do portátil só depois de duas corridas reais verdes de cada uma (a decisão 3 do brief do F2.2b). O agente do portátil corre o `sweeps/monthly.sh` de `master` a 01.10 às 09:00 na hora da máquina, igual ao de antes (conferido contra a cópia fixa).
5. **As séries (o RP3)**: o brief passa à forma das séries do UE1 (`ledger/series/`, com o motor a gerar e a cruzar), e leva a proposta das leituras a frio do UE1: o recibo de uma série repete a frase da faixa, a mesma e da mesma fonte, para dizer em palavras onde Portugal fica.
6. **A página de uma pergunta** («Os salários acompanharam os preços?»), depois das séries.
7. **Os pequenos**: a I178; as I174 a I177; `tests/` no typecheck e no `check:mortos`; a espera do `check:alvos`, que é o chão da corrida «portão».

## 3 · As regras de processo que estes dois dias fixaram

- Antes de um brief, `python3 scripts/leituras/decisoes-em-vigor.py <ficheiros>` sobre os ficheiros que o bloco vai tocar, e o brief diz as decisões que ficam em vigor; antes de uma leitura a frio, o mesmo sobre o intervalo do bloco (a M42). Dois choques no mesmo dia nasceram desta falta: a §1.124 no brief do UE1 e a §1.92(2) no F2.2b.
- Uma proteção cuja condição se cumpriu muda de forma, não desaparece: a média da União voltou ao cartão da sobrecarga com a ressalva da Comissão, e a K14 passou de exigir o silêncio a exigir a ressalva (§1.140).
- Um bloco não aterra com uma guarda sem uma planta que morda na linha guardada, mesmo que o código esteja certo: o F2.2b esperou pela F2.2e por isso.
- O Codex cobra a entrada fora da cache mais a saída (a linha «tokens used»); o revisor automático das aprovações gasta a mesma quota; as pastas com escrita entram em `--add-dir`, e o leitor devolve a leitura na última mensagem (a M43).
- O modelo de cada lugar do Codex é o mais recente que a conta aceita, a xhigh, mudado de propósito e registado depois da sonda (a M44, decisão do diretor de 30.09).
- O que a guarda de uma corrida recusa nunca sai para o repositório público; um candidato recusado fica como artefacto privado da corrida do motor (§1.141).
- Num runner do GitHub, uma ligação recusada ou um erro de TLS contam como «sem resposta» e repetem-se noutro runner (a I116), ao contrário do portátil (a C1e), de propósito (§1.141).
- Uma cópia fixa de um ficheiro antigo que leve um nome de utilizador ou um caminho do portátil entra com essas linhas trocadas por marcas e os dois sha256 registados (§1.141).
- A aterragem corre pelo guião, pelo lugar de direção, com a regra do diretor: o ensaio primeiro, depois a corrida real, com o ramo do motor publicado antes para a sua corrida «portao» correr.
- O prompt do lugar de direção não se muda; um problema com ele diz-se (a F2.2c mudou uma linha do mandato para passar no seu próprio detetor, e a F2.2d repô-la).

## 4 · O estado, lido no fecho

## O estado, lido a 30.09.2026 às 06:24:48 UTC por `scripts/leituras/estado.py`

*Cada linha foi lida agora, do comando que ela própria diz. O que não se leu diz «NÃO LIDO». Nada aqui foi escrito de memória; o que se acrescentar à mão por baixo deste bloco diz que o foi.*

### O sítio (`<a worktree dos registos>`)
- `main`: bcec17de · 2026-09-30T06:48:08+01:00 · §1.141: as corridas prontas a armar (o F2.2b, construído pelo Codex e lido a frio quatro vezes pelo Opus, aterra dormente), com as   (`git log -1 main`)
- `origin/main`: bcec17de · 2026-09-30T06:48:08+01:00 · §1.141: as corridas prontas a armar (o F2.2b, construído pelo Codex e lido a frio quatro vezes pelo Opus, aterra dormente), com as   (`git log -1 origin/main`)
- `main` está 0 à frente e 0 atrás de `origin/main`  (`git rev-list --left-right --count`)
- árvore principal: 0 entrada(s) por registar  (`git status --short`, código 0)
- ramos locais: `main bcec17de`, `registos-2026-09-30 bcec17de`  (`git branch`)
- ramos no remoto: `main`  (`git ls-remote --heads origin`)
- worktree: `<a árvore principal do sítio> bcec17de [main]`
- worktree: `<a worktree dos registos> bcec17de [registos-2026-09-30]`

### As últimas corridas da CI (`gh run list --limit 6`)
- 36677013114 · `bcec17de` · main · portão · **completed / success** · criada 2026-09-30T06:11:55Z · atualizada 2026-09-30T06:22:30Z
- 36676035692 · `bcec17de` · f22b-2026-09-28 · portão · **completed / success** · criada 2026-09-30T06:00:15Z · atualizada 2026-09-30T06:10:41Z
- 36649673316 · `3a37b809` · main · portão · **completed / success** · criada 2026-09-30T00:18:24Z · atualizada 2026-09-30T00:29:14Z
- 36648848845 · `3a37b809` · ue1-2026-09-29 · portão · **completed / success** · criada 2026-09-30T00:08:46Z · atualizada 2026-09-30T00:17:47Z
- 36571535172 · `8e66b601` · main · portão · **completed / success** · criada 2026-09-29T12:56:35Z · atualizada 2026-09-29T13:07:21Z
- 36570279731 · `8e66b601` · aterragem-2026-09-29 · portão · **completed / success** · criada 2026-09-29T12:45:38Z · atualizada 2026-09-29T12:54:22Z

### O que está no ar (`/version.json` do sítio publicado)
- commit no ar: `bcec17de` · construído em 2026-09-30T06:14:07.583Z · ref `main` · production
- igual a `origin/main` (`bcec17de`): **sim**
- isto NÃO substitui o `npm run verify:deploy`, que confere também as respostas e os cabeçalhos.

### O motor (`~/Instruments/ResearchHub`)
- `master`: 4b46bef · 2026-09-30T01:44:15+01:00 · F2.2e: provar as duas guardas do painel e os números do relatório  (`git log -1 master`)
- `origin/master`: 4b46bef · 2026-09-30T01:44:15+01:00 · F2.2e: provar as duas guardas do painel e os números do relatório  (`git log -1 origin/master`)
- `master` está 0 à frente e 0 atrás de `origin/master`  (`git rev-list --left-right --count`)
- árvore principal: 5 entrada(s) por registar: `M sweeps/state.json`; `?? .maintenance-locks/`; `?? indicators/out/pde-2026-09-23/`; `?? publisher/recortes/manifest.regioes.json`; `?? sweeps/sweep-2026-09-01.md`  (`git status --short`, código 0)
- ramos locais: `master 4b46bef`  (`git branch`)
- ramos no remoto: `master`  (`git ls-remote --heads origin`)
- worktree: `~/Instruments/ResearchHub 4b46bef [master]`

### O uso das duas subscrições (`python3 scripts/leituras/uso.py`)
    Claude (escrito pela linha de estado a 30.09.2026 06:24 UTC):
      janela de 5 horas: 8% usados, repõe a 30.09.2026 10:20 UTC
      semana: 59% usados, repõe a 05.10.2026 10:00 UTC
    Codex (última leitura: 2026-09-30T06:19:21.741Z; plano «prolite»):
      semana: 25.0% usados, repõe a 06.10.2026 19:45 UTC

### Os construtores do Codex (`.claude/codex-*.log`)
- nenhum registo de construtor nesta árvore (a pasta foi lida; não há ficheiros `codex-*.log`)

## 5 · As horas dos dois dias (UTC)

- **29.09, o UE1.** Construído pelo Opus das 13:50 às 17:18; a UE1b até às 18:26; a leitura do Codex das 19:45 às 20:06; a UE1c das 20:07 às 20:58; a UE1d até às 22:37; a releitura do Codex das 22:51 às 23:10; a UE1e até às 23:43; a terceira leitura das 23:45 às 23:56.
- **29.09, o F2.2b.** Retomado às 19:46 e acabado às 20:17; a primeira leitura do Opus acabou às 20:47; a F2.2c do Codex das 21:08 às 22:07; a segunda leitura das 22:12 às 22:44; a F2.2d das 22:48 às 23:34 e, com a decisão da cópia fixa, até às 23:58; a terceira leitura acabou às 00:31 de 30.09; a F2.2e das 00:35 às 00:56; a quarta leitura começou perto das 00:59 e acabou às 05:45, depois de o portátil acordar.
- **30.09, as aterragens.** O UE1: os portões das 23:58 às 00:08, a corrida do ramo verde às 00:17, `main` e o motor às 00:18, a Vercel às 00:25, a corrida de `main` verde às 00:29. O relógio saltou da 01:00 para as 05:48 com o portátil suspenso. O F2.2b: os portões das 05:48 às 05:59, a corrida do ramo verde às 06:11, `main` e o motor às 06:12, a Vercel às 06:20, a corrida de `main` verde às 06:22.
