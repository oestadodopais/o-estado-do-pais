# O Estado do País · as regras do projeto

*O `CLAUDE.md` do projeto, criado a 01.09.2026 por decisão do diretor de 30.08.2026 (a política da autonomia escreve-se nas regras do projeto). As regras globais do diretor (o `CLAUDE.md` da conta) prevalecem sobre tudo o que está aqui. Sem travessões na prosa.*

## O que se lê primeiro, por esta ordem

1. `design/especime-v3/PENDENTES-DO-DIRETOR.md`: o que só o diretor pode fazer e ainda não fez, e o que cada coisa destrava.
2. `VISAO.md`: o que a casa é, as regras que não mudam, a pilha de camadas, o horizonte das ideias. Uma ideia que não esteja lá não existe para a sessão.
3. `design/observatorio/POLITICA-DA-AUTONOMIA.md`: o que o lugar de direção decide sozinho com os portões verdes, o que é do diretor, a via da divulgação, os modelos e as recusas.
4. `DECISIONS.md`, as últimas secções; a nota de estado mais recente em `design/especime-v3/ESTADO-DO-MAIN-*.md`; `design/especime-v3/ISSUES.md`.

## Os lugares

O lugar de direção pensa, escreve os briefs, revê, regista e funde nos portões verdes (Claude Fable 5); o Opus constrói e verifica lotes na fonte; o Sonnet mede às cegas com código próprio numa cópia; o Codex (`gpt-5.6-sol`, xhigh) lê a frio com estragos plantados, registados por sha256 e com o contexto impresso de cada alvo conferido antes e depois. A família que construiu nunca verifica o que construiu. Cada bloco diz o modelo e os símbolos.

## As regras que não se quebram

- Nunca `git add -A` nem `git add .`: só caminhos explícitos. Cada commit verde: `npm run build`, `npm run verify`, `npm run typecheck` a 0. Trailers do sítio: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` (ou `Claude Opus 5`) e `Claude-Session: <o endereço da sessão>`. No motor (`~/Instruments/ResearchHub`) só `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate` (cerca de dois minutos e meio: dá-lhe tempo).
- Prosa nova em português (Acordo Ortográfico), sem travessões; o que se copia de uma fonte fica como a fonte o escreveu.
- Nunca escrever um número que não foi medido; para o que muda no tempo, verificar na fonte primária antes de afirmar; `[verify]` onde não der. Cada número do sítio resolve numa linha do livro-razão, e os portões falham se não resolver: nunca se enfraquecem.
- Medidores e construtores em worktrees (`git worktree add`), um por árvore; nunca `git checkout` na árvore principal enquanto alguém a tem; `git worktree remove` em comando separado do `push`.
- O estado do lançamento lê-se com `vercel ls 2>&1` e `npm run verify:deploy`, nunca mais de um pedido por minuto ao sítio. As definições do Vercel são do diretor.
- Nada de dados pessoais em formulários nem descargas sem o «sim» do diretor; nenhum correio a terceiros em nome da casa sem o «sim» dele e sempre com cópia; os ficheiros dos leitores nunca entram num repositório público.
- No motor há ficheiros de outras corridas por confirmar (`indicators/*.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`) que não se tocam.
- A identidade (nome, marca, tipos) está fechada (`DECISIONS.md` §1.86) e só reabre por decisão do diretor.

## Onde estão as coisas

O sítio: este repositório (`github.com/oestadodopais/o-estado-do-pais`, **público** desde 01.09.2026, depois da passagem a segredos e dados pessoais: nada pessoal, nada secreto, em nenhum ramo), publicado pela Vercel a cada `push` em `main`, em `https://oestadodopaís.pt` (punycode `xn--oestadodopas-2fb.pt`) e `/en/`. O motor: `~/Instruments/ResearchHub` (`github.com/oestadodopais/motor`, privado). O registo canónico de decisões: `DECISIONS.md`; o cofre do diretor: `~/Obsidian/Experiments/O Estado do País.md`. A carta dos conteúdos, o inventário das fontes, a frescura e a diligência legal: `design/observatorio/`.
