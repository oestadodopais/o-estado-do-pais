# Ordem de construção · as linhas do primeiro domínio: economia e finanças públicas com trabalho (01.09.2026)

*Escrita pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). É o lado do motor da primeira vaga: as medidas que o diretor escolheu a 01.09 (a recomendação de `INVENTARIO-DAS-FONTES.md` §5, adotada tal como está) passam a linhas do livro-razão, com a disciplina inteira, e atravessam para um ramo do sítio. As páginas dos domínios são outro bloco (`BRIEF-forma-dos-dominios.md`), depois da cabeça nova. Sem travessões na prosa.*

## 1 · O que se constrói, e o que não

**As medidas** (as linhas do inventário, com os endereços, as definições, os excertos e as advertências que o inventário registou; lê cada uma por inteiro em `design/observatorio/INVENTARIO-DAS-FONTES.md` §2.1 e no JSON `design/observatorio/inventario/INVENTARIO-DAS-FONTES.json`, no repositório do sítio):

| linha | medida | publicador lido | o que entra | já no sítio |
|---|---|---|---|---|
| E2 | saldo das administrações públicas (B.9), % do PIB, 2025 | Eurostat `gov_10dd_edpt1` (INE notifica) | uma linha nacional, com o limiar de 3 % citado pelo Eurostat | não |
| E4 | crescimento da despesa líquida contra a taxa máxima, 2025 | CFP, parecer ao Relatório Anual de Progresso (PDF) | uma linha nacional com a observação do CFP e o teto tal como o CFP o cita; o documento espelhado com sha256 | não |
| T3 | ganho médio mensal dos trabalhadores por conta de outrem, 2024 | INE `0012656` (GEP/MTSSS, Quadros de Pessoal) | uma linha nacional e 308 linhas por concelho, com o rótulo da fonte (`name`, `name_source`) | não |
| T4b | disparidade salarial não ajustada entre homens e mulheres, 2024 | Eurostat `earn_gr_gpgr2` (agregado B-S_X_O) | uma linha nacional, provisória se a fonte a marcar | não |
| T5 | retribuição mínima mensal garantida, 2026 | o decreto-lei (o texto servido por `dre.pt`, espelhado) e Eurostat `earn_mw_cur` | duas linhas nacionais: a do diploma (continente, 920,00 €) e a do Eurostat (a base de doze meses), cada uma com a sua fonte | não |
| E1, E3, E5, T1, T2 | já no sítio | | nada: não se tocam | sim |

**Não entram**: T4a (sai, por decisão de 01.09: o INE `0012661` é um coeficiente de variação); nada de outros domínios; nenhuma página do sítio; nenhuma comparação construída pela casa (a retribuição mínima não se compara com o ganho médio; o inventário di-lo).

## 2 · Onde

No motor, numa worktree fora da árvore principal: `/Users/nunosantos/Instruments/ResearchHub-worktrees/dominio-1-2-2026-09-01` (ramo `dominio-1-2-2026-09-01`, saído de `master` em `3d4a302`). A árvore principal do motor tem ficheiros de outras corridas por confirmar que nunca se tocam. O estudo novo é `content/13 Dominios/` (o nome e a forma seguem `content/12 Concelhos/`: `preregistration.json` antes de qualquer leitura, `ledger.json`, `source/` com os ficheiros espelhados e `MANIFEST.sha256`, `Technical Source/` com os extratos alojados, um `RELATORIO-*.md`, e o brief que se seguiu). Um manifesto de cruzamento novo em `publisher/manifest.dominios.json`.

No sítio, as linhas atravessam para uma worktree própria, `/Users/nunosantos/Instruments/OEstadoDoPais/.claude/worktrees/dominio-1-2-linhas-2026-09-01` (ramo `dominio-1-2-linhas-2026-09-01`, saído de `main`), nunca para a árvore principal. Se `publisher/export_site_rows.py` só souber escrever no caminho fixo `~/Instruments/OEstadoDoPais`, o bloco ensina-o a receber o caminho do sítio por parâmetro ou por variável de ambiente (o corredor diário vai precisar do mesmo em `indicators/refresh.py`, mas isso é outro bloco: não lhe toques). O `study` novo tem de constar de `src/data/studies.mjs` no sítio para `check:cruzamento` aceitar as linhas: essa é a única mudança de código do sítio neste bloco, e faz-se no ramo do sítio.

Commits com caminhos explícitos; no motor só `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`, e o pre-commit corre `python3 -m core.gate` (uns dois minutos e meio: dá-lhe tempo); no sítio também `Claude-Session: https://claude.ai/code/session_01RfmmTfG3C9xPwSngA5DDbr`. Nunca `push`, nunca fusão, nunca `git checkout` nas árvores principais. Prosa nova em português (Acordo), sem travessões.

## 3 · O que ler antes

No motor: `content/12 Concelhos/BRIEF-P1-linhas-dos-308.md` e `RELATORIO-P1.md` (o modelo deste bloco: a pré-registo, os leitores, os 16 estragos, a exportação), `BRIEF-P4-nomes.md` e `RELATORIO-P4.md` (o rótulo da fonte por linha), `preregistration.json` e `ledger.json` de `12 Concelhos`, `publisher/export_site_rows.py` (as validações V1 a V16, inteiras), `publisher/concelhos_readers.py` (como se lê a API do INE em série), `indicators/generate_claims.py` (a convenção do excerto para uma API: montado das etiquetas da própria resposta), `core/` (os portões: `reconcile`, `prose`, `assertions`, `prereg`, `excerpts`), `content/README.md`. No sítio: `ledger/README.md` inteiro (as regras que o build impõe; `document.kind`, `document.hosted`, `document.url`, `name`), `design/observatorio/CARTA-DOS-CONTEUDOS.md` §1 (as regras de uma medida) e §3 (o domínio 1 e o 2), o inventário (as linhas E2, E4, T3, T4b, T5 por inteiro), `DECISIONS.md` §1.83 (o nome vindo do rótulo da fonte), `design/especime-v3/PLANO-CONCELHOS-2026-08-26.md` (como as fontes por concelho se leram e provaram).

## 4 · A disciplina, linha a linha

1. **Pré-registo antes de ler**: o que se vai ler, de onde, com que leitor, e que valores de controlo se esperam (o inventário traz os valores lidos a 01.09: Portugal 1 576,0 € e Évora 1 484,5 € em T3, por exemplo; são controlos, não respostas).
2. **A fonte espelhada**: cada ficheiro lido (a resposta JSON do Eurostat e do INE guardada tal como veio; o PDF do CFP; o texto do decreto-lei) fica em `source/` ou em `Technical Source/` com sha256 no manifesto, e é o `document.hosted` ou o `path` da linha; o excerto sai desse ficheiro, verbatim (para uma API, montado das etiquetas da resposta, como `generate_claims.py` faz, e o relatório diz que assim é).
3. **O INE em série**, dois segundos entre pedidos, nunca em paralelo; Évora é `1C40705` na nomenclatura NUTS 2024; os 308 concelhos são as 308 categorias de nível 5 da dimensão geográfica (o inventário conferiu a estrutura em T3); a ausência de valor num concelho publica-se como o INE a imprime, nunca como zero.
4. **O rótulo da fonte** (`name`, `name_source`) em todas as linhas em que a fonte o imprime, provado palavra a palavra no ficheiro alojado (`printed_label()` e `prove_label()` em `core`).
5. **As três datas** por linha: `reference_date`, a data de publicação ou de última atualização que a fonte imprime (no campo que o esquema do sítio tiver para isso; se não tiver, na `note`, e o relatório diz que o esquema não tem campo: é um pedido ao bloco da frescura), `access_date`.
6. **Estragos plantados** no leitor e no exportador, vistos vermelhos (um valor alterado no ficheiro espelhado; um excerto que não é substring; um concelho a menos; um `check` que não bate), como o P1 fez com dezasseis.
7. **A exportação**: primeiro a corrida a seco (`export_site_rows.py` sem `--write`), depois a escrita no ramo do sítio, e no sítio `npm run build`, `verify`, `typecheck` a 0 com as linhas novas, e `check:cruzamento --with-origin` verde onde o motor está em disco.
8. **Nenhum número inventado**: um valor que não se leia hoje na fonte não entra; `[a verificar]` é a porta estreita do `ledger/README.md`, e diz-se no relatório.

## 5 · O relatório e a entrega

`content/13 Dominios/RELATORIO-D1.md` no motor: a pré-registo e o que se leu contra ela; as contagens (linhas escritas, por medida; 308 de 308 em T3, ou quantas e porquê); os estragos vistos; as validações do exportador; o que ficou `[a verificar]` e porquê; os símbolos gastos, se o harness os der; a linha «Modelo: Claude Opus 5». Os dois ramos verdes, com os commits feitos, e nada fundido nem empurrado: o lugar de direção lê, manda a medição cega do Sonnet e a leitura do Codex, e funde. Estimativa do lugar de direção: 0,5 a 0,8 M símbolos, pela experiência do P1 (≈494 mil para 2 427 linhas de três leitores).
