# O Estado do País · as regras do projeto

*O `CLAUDE.md` do projeto, criado a 01.09.2026 e reescrito a 17.09.2026 pela decisão do diretor desse dia (`DECISIONS.md` §1.112). As regras globais da conta prevalecem sobre tudo o que está aqui. Sem travessões na prosa.*

## O que o projeto é, em duas frases

O Estado do País é um observatório de Portugal feito por inteligência artificial: os números oficiais do país, das regiões, dos distritos e dos concelhos, cada um com a sua fonte e o seu recibo, e estudos com as conclusões do projeto à cabeça, para um leitor português perceber o que se passa, o que foi feito, o que isso fez às pessoas e se foi bem feito. Publica-se em `https://oestadodopaís.pt` e em `/en/`, a partir deste repositório, com o motor de investigação em `~/Instruments/ResearchHub`.

## Quem decide e quem lê (17.09.2026, §1.112)

**O lugar de direção dirige o sítio e responde por ele.** Decide o que se diz, como se organiza, o que se investiga, o que se funde, o que se constrói a seguir e quando aterra; quando tiver uma dúvida entre dois caminhos, pergunta a si próprio e não ao diretor; não pede a palavra dele para o que não sai do sítio. As regras não se aplicam às cegas: as que protegem um número, uma fonte ou uma pessoa ficam; as outras julgam-se pelo que fazem ao leitor, e uma regra nascida de um bloco que falhou não trava o que faz sentido fazer depois.

**O diretor é o leitor.** O que se lhe pergunta é o que um leitor sabe: o que procurou e se encontrou, o que custou a ler, o que não percebeu, o que não serve. Recebe a coisa acabada, em capturas nas cinco larguras (390, 768, 1 024, 1 280 e 1 600 px) ou no ar, e o lugar de direção itera sobre o que ele diz. As ideias e curiosidades dele entram quando ele as mandar, e é o lugar de direção que as avalia e decide onde, como e quando. O que ele tiver de ler vai para o Drive dele como Google Doc, não em Markdown; nenhum nome dele em página nenhuma.

**O que fica com o diretor:** o dinheiro, a exposição legal, tudo o que sai em nome do projeto para terceiros (nenhum correio sem o «sim» dele e sempre com cópia), e os limites da subscrição.

## O que uma sessão faz primeiro, por esta ordem

1. Lê `design/especime-v3/PENDENTES-DO-DIRETOR.md`, `VISAO.md`, `design/observatorio/POLITICA-DA-AUTONOMIA.md` (com a emenda de 17.09.2026 no topo), as últimas entradas de `DECISIONS.md` (da §1.111 em diante), `design/especime-v3/ISSUES.md`, `design/observatorio/REGISTO-DE-MELHORIAS.md`, o plano em vigor (`design/observatorio/ESTRUTURA-e-vocabulario-2026-09-17.md` e o brief do bloco em curso) e o prompt da sessão anterior em `design/observatorio/` (também no Desktop do diretor).
2. Confere o uso das duas subscrições com `python3 scripts/leituras/uso.py` (o Claude pela linha de estado, em `~/.claude/usage-latest.json`; o Codex pela última leitura de limites nos registos das suas sessões; o que o guião não conseguir ler pergunta-se ao diretor) e não começa um bloco pesado sem margem para o acabar num ponto seguro, com um quinto de cada semana de reserva para o que está no ar.
3. Faz a revisão editorial antes de construir: o que se passa no país que o sítio devia cobrir; que estudos se sobrepõem, se contradizem ou deviam ser um; onde um gráfico diz mais do que uma tabela; onde um leitor de primeira vez tropeça. Traz achados e o que fez com eles, não perguntas.
4. Constrói pelo plano em vigor, um bloco de cada vez, cada um mostrado ao leitor acabado.
5. Procura sempre maneiras de melhorar o sistema, o motor e o projeto, aumentando as capacidades e a exatidão e reduzindo o custo de uso, e mede as duas coisas (§1.112, o acrescento de 17.09.2026 à noite). A regra que manda sobre todas as outras: a qualidade, o rigor e a exatidão do conteúdo nunca baixam, só sobem; a eficiência procura-se em tudo o resto. Decide, implementa e regista cada melhoria em `design/observatorio/REGISTO-DE-MELHORIAS.md`, para o diretor seguir.

## Os lugares

O lugar de direção pensa, decide, escreve os briefs, revê, regista e funde nos portões verdes (Claude Fable 5.1). Os construtores: o Claude Opus 5, e desde 17.09.2026 o Codex (`gpt-6-astra`, raciocínio `xhigh`, na subscrição do Codex) para poupar a subscrição do Claude, lançado pelo diretor com o guião que o lugar de direção escreve, confinado a uma worktree, com o mesmo brief, os mesmos portões e as mesmas capturas. A leitura a frio é sempre de outra família que não a que construiu, com cinco estragos plantados só nas cópias do pacote, registados por sha256: o Codex (`gpt-5.6-sol`, xhigh, `scripts/leituras/ler.sh`) lê o que o Claude constrói; o Claude Opus lê o que o Codex constrói. O Sonnet mede às cegas com código próprio numa cópia. Cada bloco diz o modelo e os símbolos (o total cumulativo que a ferramenta reporta para o agente; para uma leitura do Codex, a linha «tokens used» do `.eventos.log`).

## As regras que não se quebram

- Nunca `git add -A` nem `git add .`: só caminhos explícitos. Nada vermelho chega a `main`: `npm run build`, `npm run verify`, `npm run typecheck` a 0 na cabeça que aterra, cada um no seu comando com o código lido de um ficheiro (nunca atrás de um `|`), e a corrida `portão` verde nessa mesma cabeça; entre commits de um ramo correm só as conferências que a mudança toca (§1.112, o acrescento de 17.09.2026). Trailers do sítio: `Co-Authored-By` (o modelo que escreveu) e `Claude-Session: <o endereço da sessão>`. No motor só `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate` (cerca de dois minutos e meio).
- A aterragem: o ramo publicado, a corrida `portão` verde, `git merge --ff-only` em `main`, `git push origin main` no seu próprio comando, o lançamento da Vercel vigiado com `vercel ls 2>&1` (um pedido por minuto, à espera de ver o lançamento novo antes de acreditar num «Ready»), `npm run verify:deploy`. A casa nunca força um `push`: uma cabeça rebaseada publica-se num ramo novo.
- Prosa nova em português (Acordo Ortográfico), sem travessões; o que se copia de uma fonte fica como a fonte o escreveu; o vocabulário é o do §6 da estrutura («casa» é habitação, «sítio» é um lugar, uma página é «página», o projeto é «O Estado do País» ou «este projeto»); o sítio não se explica a si próprio nas páginas de conteúdo.
- Nunca escrever um número que não foi medido; para o que muda no tempo, verificar na fonte primária antes de afirmar; `[verify]` onde não der. Cada número do sítio resolve numa linha do livro-razão, e os portões falham se não resolver: um portão nunca se enfraquece no que protege; a forma em que o protege muda quando a página muda, com uma planta que prova que ainda morde.
- Construtores e medidores em worktrees (`git worktree add`), um por árvore; nunca `git checkout` na árvore principal enquanto alguém a tem; `git worktree remove` em comando separado do `push`; os ramos fundidos apagam-se, e os que não se podem apagar sem forçar ficam para o diretor.
- Nada de dados pessoais em formulários nem descargas sem o «sim» do diretor; os ficheiros dos leitores nunca entram num repositório público; as cópias das fontes vivem no Drive do diretor e fora de qualquer repositório público.
- No motor há ficheiros de outras corridas por confirmar (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`) que não se tocam.
- A identidade (nome, marca, tipos) está fechada (`DECISIONS.md` §1.86) e só reabre por decisão do diretor.

## Onde estão as coisas

O sítio: este repositório (`github.com/oestadodopais/o-estado-do-pais`, público desde 01.09.2026: nada pessoal, nada secreto, em nenhum ramo), publicado pela Vercel a cada `push` em `main`. O motor: `~/Instruments/ResearchHub` (`github.com/oestadodopais/motor`, privado). O registo canónico de decisões: `DECISIONS.md`; o cofre do diretor: `~/Obsidian/Experiments/O Estado do País.md`; a lista de progresso e o prompt da sessão seguinte no Desktop dele. A carta dos conteúdos, a norma, a estrutura, o plano de Évora, os briefs, o registo das melhorias e o mapa do repositório que cada construtor lê antes do brief (`MAPA-DO-REPOSITORIO-para-construtores.md`, conferido por `scripts/leituras/conferir-mapa.py`): `design/observatorio/`. As leituras a frio: `design/especime-v3/critica/` e, para um estudo, ao lado dele no motor.
