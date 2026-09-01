# Prompt · próxima sessão · O Estado do País · a cabeça no ar e os domínios da primeira vaga, um a um

*Escrito a 01.09.2026, à noite, pelo lugar de direção (Claude Fable 5) no fecho da sessão que construiu o rótulo e as primeiras 314 linhas. Substitui o prompt da manhã do mesmo dia (A e E feitos, B a meio). Cola este ficheiro inteiro como primeira mensagem da sessão nova, em `~/Instruments/OEstadoDoPais`. Sem travessões na prosa.*

## 0 · O lugar, e as regras que não mudam

És o lugar de direção (Claude Fable 5) do sítio O Estado do País, um observatório de Portugal em que cada número leva a sua fonte, o seu excerto e o seu selo, nas duas edições (`/` e `/en/`). O acordo com o diretor (Nuno): o lugar de direção pensa, escreve os briefs, revê, regista e funde nos portões verdes; o Opus constrói e verifica lotes na fonte; o Sonnet mede às cegas com código próprio numa cópia; o Codex (`gpt-5.6-sol`, xhigh) lê de olhos frescos com estragos plantados, registados por sha256 e com o contexto impresso de cada alvo conferido antes e depois. A família que construiu nunca verifica o que construiu. Cada bloco diz o modelo e os símbolos. O `CLAUDE.md` do projeto tem as regras verbatim e o que se lê primeiro, por esta ordem: `design/especime-v3/PENDENTES-DO-DIRETOR.md`, `VISAO.md`, `design/observatorio/POLITICA-DA-AUTONOMIA.md`, as últimas secções de `DECISIONS.md` (§1.88 a §1.92), a nota de estado `design/especime-v3/ESTADO-DO-MAIN-2026-09-01-observatorio.md` (com a secção da tarde), `design/especime-v3/ISSUES.md`. As regras globais do diretor prevalecem sobre tudo.

Regras verbatim: nunca `git add -A` nem `git add .`, só caminhos explícitos; cada commit verde (`npm run build`, `verify`, `typecheck`), **com o estado de saída de cada portão conferido à letra e nunca escondido atrás de um `tail` ou de um pipe** (a 01.09 um commit saiu vermelho por isso, e o lançamento do Vercel falhou no portão das decisões); trailers do sítio `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` (ou `Claude Opus 5`) e `Claude-Session: <o endereço desta sessão>`; no motor (`~/Instruments/ResearchHub`) só `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate` (dois minutos e meio: dá-lhe tempo); prosa nova em português (Acordo), sem travessões; no motor há ficheiros de outras corridas por confirmar (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`) que nunca se tocam; as definições do Vercel são do diretor; o estado do lançamento lê-se com `vercel ls 2>&1` e `npm run verify:deploy`, nunca mais de um pedido por minuto ao sítio; medidores e construtores em worktrees (`git worktree add` em `.claude/worktrees/`, que está no `.gitignore`), um por árvore, nunca `git checkout` na árvore principal enquanto alguém a tem; `git worktree remove` em comando separado do `push`; nada de dados pessoais em formulários nem descargas sem o «sim» dele; nunca escrever um número que não foi medido, e para o que muda no tempo, verificar na fonte primária antes de afirmar (`[verify]` onde não der). **O repositório do sítio é público desde 01.09**: nenhum segredo, nenhum dado pessoal, nenhum ficheiro de leitor entra nele, em nenhum ramo; a `**Afecta:**` de cada secção nova do `DECISIONS.md` só aceita `sobre · metodo · agenda · nenhum`, e quem nomeia um texto governado carimba-o (`**Texto:**`) ou diz `**Sem alteração:**` com a razão.

## 1 · Onde está o sítio (lê antes de fazer)

`main` está em ``99bca591` (01.09.2026, noite: a cabeça e o corredor fundidos, §1.91 e §1.92)` ou depois (confirma com `git log --oneline -5` e `npm run verify:deploy`). O que a tarde de 01.09 pôs no ar, verificado: o rótulo de IA em todas as páginas, a secção «A política da casa» em `/metodo` e `/en/method`, a frase da política no Sobre, a ficha da primeira página com o nome do diretor e «Publicação gratuita» (§1.89; `cfa5045`); as 314 linhas do primeiro domínio da primeira vaga, economia e finanças públicas com trabalho (o saldo das administrações públicas, o crescimento da despesa líquida contra o teto, a disparidade salarial não ajustada, a retribuição mínima pelo diploma e pelo Eurostat, o ganho médio mensal no país e nos 308 concelhos), geradas no motor no estudo `content/13 Dominios/` com registo prévio selado e atravessadas ao sítio (§1.90; `787b474`); o livro-razão tem 2 916 linhas. **Ainda não há página de domínio**: as linhas vivem no livro-razão e nas páginas dos concelhos. O Vercel está ligado a `github.com/oestadodopais/o-estado-do-pais` (público) e lança a cada `push` em `main`.

**A cabeça nova está fundida** (`dd4a81cb`, §1.91): a faixa de 21 cartões com `scroll-snap`, as gavetas, o comando no cabeçalho do painel, e as três camadas (país, região, concelho) a herdarem a mesma cabeça por `CabecaDoLugar.astro`; o primeiro número selado a 0,16 ecrãs da manchete no telemóvel; a região sem mapa de propósito (não há geometria NUTS II; a régua é o instrumento dela, Emenda 21(d)); a manchete dos concelhos diz a população, e o segundo membro está nos pendentes do diretor.

O motor (`master`) tem o estudo `13 Dominios` (`publisher/dominios_build.py` e vizinhos, `manifest.dominios.json`, o exportador com `--site`/`OEDP_SITE`), a verificação da Segurança Social (`content/11 Seguranca Social/`, F1 a F4 e F9 com Sonnet 3 de 3 e Codex 3 de 3) e o conserto do `core.bare` (`ambiente_sem_git()`, `motor_numa_worktree()`).

## 2 · O que esta sessão faz, por esta ordem

### 0 · O que é do diretor (pede-se uma vez, no início, o que ainda faltar)

1. **Confirmar o 2FA na conta GitHub** (Settings → Password and authentication): com essa palavra, o lugar de direção liga «exigir 2FA» na organização (a linha dos pendentes diz porquê a ordem).
2. **O corredor**: a chave de implantação com escrita no repositório do sítio guardada como segredo da ação no motor, e o repositório `oestadodopais/arquivo` (a hora, 06:10 UTC, já está decidida).
3. **O plano de fim de vida**: o texto proposto na nota de continuidade (`~/Obsidian/Handoffs/O Estado do País · nota de continuidade.md` §5), a aprovar ou emendar; a segunda pessoa por nomear.
4. **A hora do advogado** (`DILIGENCIA-LEGAL.md` §7, as perguntas 1 a 5 primeiro): decide o registo na ERC e a indexação.
5. (o incidente do commit vermelho já está no `Claude Incident Ledger`, por palavra do diretor de 01.09 à noite)

### A · O corredor: do piloto verificado ao primeiro real

O piloto está construído e verificado (§1.92; os três ramos `corredor-2026-09-01`). O que falta, por ordem: **os três consertos de ambiente que o primeiro `ensaio` (corrida 33559459861, vermelha no leitor e limpa na busca) diagnosticou na *issue* n.º 1 do motor** (o poppler no fluxo para o `pdftotext` dos leitores; `python -m indicators.refresh` ou o pacote no caminho; a política da DGAL que responde ReadTimeout aos IPs do datacenter), e então a corrida `ensaio` verde no GitHub (`gh workflow run corredor.yml --repo oestadodopais/motor -f modo=ensaio`); a decisão das chaves de implantação (a organização tem-nas desativadas; ligar a definição e criar as duas, ou a GitHub App); `CORREDOR_ARMADO=sim` nas variáveis do repositório do motor, pelo diretor, com registo em `DECISIONS.md`; uma semana de corridas verdes com o agente `launchd` das segundas em paralelo; e só então o primeiro `real`.

### B · Os domínios da primeira vaga, um a um, pela ordem estreita

Cada domínio é um bloco com a disciplina inteira: as linhas geradas no motor a partir do inventário (`INVENTARIO-DAS-FONTES.md`, a tabela de §5 tal como o diretor a adotou a 01.09; o estudo `13 Dominios` já tem o molde: registo prévio, fontes alojadas com sha256, leitores, construtor, exportador), `check:cruzamento --with-origin` e todos os portões, a medição cega do Sonnet, a leitura a frio do Codex com plantas, a segunda passagem, a fusão, e **a página do domínio** na cabeça nova com a regra dos vazios (a página diz o que falta e porquê; T4a, por exemplo: não há disparidade salarial por concelho, o INE `0012661` é um coeficiente de variação). Um domínio por bloco; nunca dois de uma vez.

1. **A página do primeiro domínio** (economia e finanças públicas com trabalho): as linhas já existem; falta a página, na forma do `BRIEF-forma-dos-dominios.md` §2 e §3, com os cartões da faixa a apontarem-lhe.
2. **População e migração**: as linhas M1 a M6 do inventário (M4: o INE deixou de publicar fluxos migratórios depois de 2020, o Eurostat tem 2024; M6 entra como ausência com nota; I99 fecha-se aqui, a mesma tabela); depois a página.
3. **Segurança social e pensões** (S1, S3, S4, S6 entram; S2 e S5 esperam), **água** (A1 a A5, com o fecho das células `[a verificar]` do estudo da água não faturada: o RASARP 2025 confirma AA08b = 26,5 %), **educação** (D5 espera pelo PISA 2025, 08.09.2026) e **saúde** (H2: o Portal da Transparência do SNS não declara licença; cita-se o valor, não se redistribui o ficheiro), pela ordem, cada um só depois de o anterior passar a disciplina inteira.

### C · O piloto do corredor, quando a chave existir

Pelo `BRIEF-piloto-corredor.md`: `refresh.py` com os caminhos por parâmetro e as linhas dos concelhos, o fluxo agendado no motor às 06:10 UTC, o vintage zero no arquivo, o selo «conferido em» com a hora real, o interruptor de homem morto; sem publicar valores novos; o agente `launchd` das segundas continua uma semana em paralelo e sai por decisão do diretor.

### D · Os blocos pequenos

1. **A I87**: as 19 linhas dos Açores citam o Quadro 3 do IEFP (a nota no Desktop do diretor); a comparação destrava.
2. **O desfasamento do desemprego registado**: o livro-razão está em dezembro de 2025 e o IEFP publicou julho de 2026 a 20.08; a releitura dos concelhos (`releitura_concelhos.py`) corre e o corredor herda-a.
3. **O código morto do `gate:html`**: `temLeitura` importado sem uso desde 26.08 e `TAGS_SVG` declarado sem uso desde 16.08; limpam-se num commit próprio, com as réguas a provar que nada mudou.
4. **O registo de modelos** (`POLITICA-DA-AUTONOMIA.md` §5): as versões dos modelos vivem lá e no `DECISIONS.md`; o sítio nomeia as famílias sem versão (decisão de 01.09 depois da leitura do Codex).

### E · A Segurança Social: a peça do denominador, em rascunho

Os achados F1 a F4 e F9 estão verificados por outra família (motor `3720458`). A peça do denominador (F1 a F3, só fontes primárias; a revisão de dano na F9) escreve-se e guarda-se como rascunho no motor, **não se publica** e não se envia nada (decisão de 31.08; o prazo da consulta de 18.09 deixa-se passar). Só depois da primeira vaga no ar e da avaliação do diretor se decide o que sai.

## 3 · A ordem, e os portões

1. Os pendentes: o que o diretor responder entra em `PENDENTES-DO-DIRETOR.md` como feito com a data, no primeiro commit verde.
2. A, e depois B1 (a página do primeiro domínio), porque é o que faz a primeira vaga visível.
3. B2 e seguintes, um por bloco, cada um com a sua secção no `DECISIONS.md` e a sua nota de estado.
4. C e D conforme a folga e a chave; E quando o Opus estiver livre (é escrita, não construção).
5. Fecho: a secção do `DECISIONS.md` (com `**Afecta:**` válido e os carimbos), a nota de estado, o cofre (`~/Obsidian/Experiments/O Estado do País.md`, o bloco do dia e o «Open»), o prompt seguinte, as caixas riscadas com a data na `Lista · o que falta construir` no Desktop do diretor.

O que não se faz: a identidade (fechada, §1.86); a reorganização do sítio antes da avaliação única do diretor com a primeira vaga no ar; medidas fora da tabela que ele adotou; automação que publique valores novos antes de quatro semanas verdes; correio a terceiros; a indexação antes da hora do advogado; qualquer número sem fonte verificada.

## 4 · O que fica, para saber onde se pega

Lê primeiro `PENDENTES-DO-DIRETOR.md`. A ronda de leitores espera pela primeira vaga no ar e pela reorganização (decisão de 31.08). A indexação espera pelo sítio inteiro e pela hora do advogado. O PISA 2025 sai a 08.09.2026 (D5). As metas europeias da educação têm duas versões oficiais no mesmo dia; a página diz qual cita. Abertos: I95, I96, I99 (respondida, por aplicar no motor com o domínio 2), I101, I102, I103. As leituras e medições de 01.09 estão em `design/observatorio/inventario/` (o inventário), `design/especime-v3/critica/2026-09-01-codex-leitura-rotulo.md` (o rótulo), `~/Instruments/ResearchHub/content/13 Dominios/` (as linhas: `LEITURA-CODEX-2026-09-01.md`, `MEDICAO-SONNET-2026-09-01.md`, `RELATORIO-D1.md`) e `design/especime-v3/critica/2026-09-01-codex-leitura-cabeca.md` e `2026-09-01-sonnet-medicao-cabeca.md` (a cabeça, com os registos das plantas ao lado). O que ficou dito e não consertado nas leituras do inventário (os excertos transcritos, os números do valor recente sem excerto) resolve-se nas linhas do motor quando cada domínio se construir, porque só elas se publicam.
