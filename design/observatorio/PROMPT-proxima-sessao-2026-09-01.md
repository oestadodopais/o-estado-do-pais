# Prompt · próxima sessão · O Estado do País · a escolha do diretor, o rótulo, a cabeça nova e a primeira vaga

*Escrito a 01.09.2026 pelo lugar de direção (Claude Fable 5) no fecho da sessão do observatório a sério. Cola este ficheiro inteiro como primeira mensagem da sessão nova, em `~/Instruments/OEstadoDoPais`. Sem travessões na prosa.*

## 0 · O lugar, e as regras que não mudam

És o lugar de direção (Claude Fable 5) do sítio O Estado do País, um observatório de Portugal em que cada número leva a sua fonte, o seu excerto e o seu selo, nas duas edições (`/` e `/en/`). O acordo com o diretor (Nuno): o lugar de direção pensa, escreve os briefs, revê, regista e funde nos portões verdes; o Opus constrói e verifica lotes na fonte; o Sonnet mede às cegas com código próprio numa cópia; o Codex (`gpt-5.6-sol`, xhigh) lê de olhos frescos com estragos plantados, registados por sha256 e com o contexto impresso de cada alvo conferido antes e depois. Cada bloco diz o modelo e os símbolos. O `CLAUDE.md` do projeto (criado a 01.09) tem as regras verbatim e o que se lê primeiro, por esta ordem: `design/especime-v3/PENDENTES-DO-DIRETOR.md`, `VISAO.md`, `design/observatorio/POLITICA-DA-AUTONOMIA.md`, as últimas secções de `DECISIONS.md` (§1.88), a nota de estado `design/especime-v3/ESTADO-DO-MAIN-2026-09-01-observatorio.md`, `design/especime-v3/ISSUES.md`. As regras globais do diretor prevalecem sobre tudo.

Regras verbatim: nunca `git add -A` nem `git add .`, só caminhos explícitos; cada commit verde (`npm run build`, `verify`, `typecheck`); trailers do sítio `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` (ou `Claude Opus 5`) e `Claude-Session: <o endereço desta sessão>`; no motor (`~/Instruments/ResearchHub`) só `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate` (dois minutos e meio); prosa nova em português (Acordo), sem travessões; no motor há ficheiros de outras corridas por confirmar (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`) que nunca se tocam; as definições do Vercel são do diretor; o estado do lançamento lê-se com `vercel ls 2>&1` e `npm run verify:deploy`, nunca mais de um pedido por minuto ao sítio; medidores e construtores em worktrees (`git worktree add`), um por árvore, nunca `git checkout` na árvore principal enquanto alguém a tem; `git worktree remove` em comando separado do `push`; nada de dados pessoais em formulários nem descargas sem o «sim» dele; nunca escrever um número que não foi medido, e para o que muda no tempo, verificar na fonte primária antes de afirmar (`[verify]` onde não der).

## 1 · Onde está o sítio (lê antes de fazer)

`main` está em o último commit da sessão de 01.09 (o que trouxe o inventário e a §1.88) ou depois (01.09.2026; confirma com `git log --oneline -5` e `npm run verify:deploy`). A sessão de 01.09 não construiu nada no sítio: escreveu a carta dos conteúdos (`design/observatorio/CARTA-DOS-CONTEUDOS.md`, dezoito domínios em três vagas), o inventário das fontes (`INVENTARIO-DAS-FONTES.md`: 41 linhas da primeira vaga verificadas na fonte primária a 01.09, 43 candidatas das vagas seguintes, o registo da verificação em §4 e a recomendação linha a linha em §5), a frescura e a automação (`FRESCURA-E-AUTOMACAO.md`, com o piloto desenhado em `BRIEF-piloto-corredor.md`), o brief da forma dos domínios (`BRIEF-forma-dos-dominios.md`), a diligência legal lida na fonte (`DILIGENCIA-LEGAL.md`), a política da autonomia (`POLITICA-DA-AUTONOMIA.md`) e o brief pequeno da divulgação (`BRIEF-divulgacao-via-B.md`). Lê a carta e o inventário (§4 e §5) por inteiro antes de qualquer construção: onze linhas da carta mudaram com o que os lotes leram na fonte, e o que o inventário diz prevalece sobre a carta.

## 2 · O que esta sessão faz, por esta ordem

### 0 · As escolhas do diretor (chegam com este prompt ou pedem-se no início, uma vez)

1. **A tabela do inventário**: para cada uma das 41 linhas da primeira vaga, entra, espera ou sai (a recomendação está em §5: as verificadas entram; E4, S2 e D5 esperam; T4a sai com a ausência dita; M6 entra como ausência com nota; A3 entra com o nome certo). O que ele escolher regista-se em `DECISIONS.md` como emenda à §1.88 e passa a ser a lista de construção.
2. **As quatro perguntas da carta** (§6): a pobreza e a desigualdade dentro de «segurança social e pensões» ou um domínio próprio; o espaço como domínio de uma pergunta com a regra dos vazios ou à espera de um estudo; as medidas partilhadas entre domínios (uma linha, duas páginas); e se a ordem estreita da primeira vaga fica (economia e finanças públicas com trabalho; população e migração; segurança social e pensões; água; educação e saúde).
3. **As três afinações do brief da forma** (`BRIEF-forma-dos-dominios.md` §1) e a frase que substitui «Âmbito» e «Densidade» na cabeça do telemóvel.
4. **O corredor**: a hora (06:10 UTC proposta), a chave de implantação com escrita no repositório do sítio guardada como segredo da ação no motor, o repositório `oestadodopais/arquivo`.
5. **A divulgação**: a tradução inglesa do texto aprovado e a frase do rótulo (`BRIEF-divulgacao-via-B.md` §2).
6. **O plano de fim de vida**: o texto proposto na nota de continuidade (`~/Obsidian/Handoffs/O Estado do País · nota de continuidade.md` §5), a aprovar ou emendar; e o nome da segunda pessoa, se o quiser escrever lá.

Nada da construção começa antes da escolha 1. Se as escolhas não vierem, a sessão faz só o que não depende delas (o rótulo, §2 A; a verificação da Segurança Social, §2 E; os blocos pequenos, §2 D) e pára.

### A · O rótulo de IA em todas as páginas (pequeno, e o mais urgente)

O artigo 50.º, n.º 4, do Regulamento (UE) 2024/1689 está em vigor desde 2 de agosto de 2026 e a casa escolheu rotular tudo (a via B). Constrói-se pelo brief `BRIEF-divulgacao-via-B.md` (Opus, da ordem de 150 a 250 mil símbolos; leitura do Codex antes da fusão; medição do Sonnet se a folga o permitir), com a tradução e a frase aprovadas pelo diretor. Junta-se, porque são duas cadeias e não fazem mal em nenhuma leitura, o nome do diretor e a menção de gratuitidade na primeira página (`DILIGENCIA-LEGAL.md` §2.1, artigo 15.º, n.º 1 da Lei de Imprensa). Fica no ar no mesmo dia se os portões estiverem verdes.

### B · A cabeça nova como contentor, e depois os domínios da primeira vaga, um a um

Pela decisão de 31.08: primeiro a cabeça nova do telemóvel e do ecrã largo como contentor, com o conteúdo de hoje (os dois quadros da União viram os primeiros cartões), pelo `BRIEF-forma-dos-dominios.md` inteiro (as medidas de aceitação já estão escritas; o construtor mede o «hoje» antes de mudar); depois os domínios da primeira vaga a encherem-na, pela ordem estreita, cada um com a disciplina inteira (as linhas do livro-razão geradas no motor a partir do inventário, como `indicators/generate_claims.py` fez para o macro núcleo e o cruzamento dos concelhos fez para os 308; `check:cruzamento` e os portões todos; medição cega; leitura cruzada; a página do domínio com a regra dos vazios). Um domínio por bloco; nunca dois de uma vez. Cada domínio no ar ganha a sua emenda à §1.88 e uma nota de estado.

### C · O piloto do corredor, quando a chave existir

Pelo `BRIEF-piloto-corredor.md`: `refresh.py` com os caminhos por parâmetro e as linhas dos concelhos, o fluxo agendado no motor, o vintage zero no arquivo, o selo «conferido em» com a hora real, o interruptor de homem morto; sem publicar valores novos; o agente `launchd` das segundas continua uma semana em paralelo e sai por decisão do diretor.

### D · Os blocos pequenos que o inventário destravou

1. **A I87**: as 19 linhas dos Açores citam o Quadro 3 do IEFP (a nota no Desktop do diretor); a comparação destrava; a linha do correio nos pendentes passa a «Feitas» como dispensada, ou fica se ele quiser a palavra da DRQPE.
2. **As células `[a verificar]` do estudo da água não faturada**: o RASARP 2025 confirma AA08b = 26,5 % (2024, continente); fecham-se com o endereço, o sha256 e o excerto que o lote 3 registou (`inventario/lote-3.md`, A1).
3. **A I99**: o motor diz qual dos dois indicadores leu (são a mesma tabela; o total é igual) e alinha os quatro campos.
4. **O desfasamento do desemprego registado**: o livro-razão está em dezembro de 2025 e o IEFP publicou julho de 2026 a 20.08; a releitura dos concelhos (`releitura_concelhos.py`) corre e o corredor herda-a.

### E · A Segurança Social: a verificação por outra família

Os achados F1 a F4 e F9 do relatório de governo (`~/Instruments/ResearchHub/content/11 Seguranca Social/RELATORIO-seguranca-social.md`, commit `3d4a302`) medidos às cegas pelo Sonnet e lidos a frio pelo Codex, antes de qualquer peça ou carta (decisão de 31.08: nada se envia; o prazo da consulta de 18.09 deixa-se passar). O lote 3 do inventário já leu a Síntese de Execução Orçamental (o perímetro: consolidado, em caixa, inclui FSE, exclui CGA, sem FEAC) e o CFP sobre o FEFSS (o limiar no Decreto-Lei n.º 367/2007): usa-se.

## 3 · A ordem, e os portões

1. Os pendentes: as escolhas do diretor entram em `PENDENTES-DO-DIRETOR.md` como feitas com a data, no primeiro commit verde.
2. A, sem esperar por mais nada além da tradução e da frase.
3. E, em paralelo (Sonnet e Codex não gastam Opus).
4. B, a cabeça, e depois o primeiro domínio (economia e finanças públicas com trabalho); os seguintes só depois de cada um passar a disciplina inteira.
5. C e D conforme a folga e a chave.
6. Fecho: a emenda à §1.88 (ou a §1.89 se o bloco for grande), a nota de estado, o cofre, o prompt seguinte, as caixas riscadas com a data na `Lista · o que falta construir` no Desktop do diretor.

O que não se faz: a identidade (fechada, §1.86); a reorganização do sítio antes da avaliação única do diretor com a primeira vaga no ar; medidas fora da escolha dele; automação que publique valores novos antes de quatro semanas verdes; correio a terceiros; qualquer número sem fonte verificada.

## 4 · O que fica desta semana, para saber onde se pega

Lê primeiro `PENDENTES-DO-DIRETOR.md`. A ronda de leitores espera pela primeira vaga no ar e pela reorganização (decisão de 31.08). A indexação espera pelo sítio inteiro e pela hora do advogado (`DILIGENCIA-LEGAL.md` §7: as perguntas 1 a 5 decidem se o registo na ERC se aplica; se se aplicar, regista-se antes de abrir a indexação). O PISA 2025 sai a 8 de setembro de 2026: a linha D5 espera por ele. As metas europeias da educação têm duas versões oficiais; a página diz qual cita. O Portal da Transparência do SNS não declara licença: cita-se o valor, não se redistribui o ficheiro. Abertos: I95, I96, I99 (respondida), I101, I102, I103. A leitura do Codex ao inventário está em `design/observatorio/inventario/leitura-codex-2026-09-01.md` com a triagem, e a medição cega do Sonnet em `inventario/amostra-sonnet.md`; o que ficou dito e não consertado (os excertos transcritos, os números do valor recente sem excerto) resolve-se nas linhas do motor quando cada domínio se construir, porque só elas se publicam.
