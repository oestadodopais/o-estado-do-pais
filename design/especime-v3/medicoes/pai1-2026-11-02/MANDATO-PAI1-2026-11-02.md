# Mandato PAI1: as provas que leem linhas do livro deixam de partir com a releitura semanal, e o painel de 02.11 entra

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Opus 5.5) a 02.11.2026, para o Codex `gpt-6-astra` a `high`, na worktree do lote de 02.11 (o ramo `sel1-2026-11-02`, por cima da SEL1); não há motor. Prosa em português, sem travessões. A decisão: a SEL1 parou a 02.11 às 10:58 UTC porque o commit do painel semanal (`7b743d896`, no ramo `painel-2026-11-02`) acrescentou uma linha às `verifications` das quatro linhas de série da HB1, e a prova `ledger/provas/hb1/series.json` guarda o sha256 do ficheiro inteiro de cada uma: a releitura semanal, que nunca muda um valor, faria esta prova recusar o `build` todas as segundas-feiras.*

## §0 O que o lugar de direção mediu (02.11.2026, por guião)

1. `ledger/provas/hb1/series.json` (escrita por `scripts/hb1-provas.py`, lida por `src/lib/cruzamento.mjs` linhas 104 a 117, `scripts/gate-html.mjs` linha 1980 e `scripts/check-cadeia.mjs` linhas 174 a 180): quatro linhas, `sobrecarga-do-custo-da-habitacao-2025`, `-2025-ue`, `-inquilinos-mercado-2025` e `-inquilinos-mercado-2025-ue`, cada uma com o sha256 do ficheiro `ledger/claims/<id>.yml` inteiro.
2. O painel semanal (`scripts/aplicar-releituras.py`, às segundas-feiras na árvore principal) acrescenta a cada linha que relê uma entrada às `verifications` (`date`, `path`, `result`, `by`, e `found` quando diverge); não muda nenhum outro campo.
3. O painel de 02.11 está no commit `7b743d896` do ramo `painel-2026-11-02`: 91 linhas relidas, 88 iguais e 3 divergentes (revisões do Eurostat de 29.10.2026), e o carimbo em `src/data/verificacao.mjs`.

## §1 O orçamento

Uma passagem pelo lançador (`OEDP_BLOCO=PAI1`), quarenta e cinco minutos e sessenta chamadas. Um commit para o §2.1 a §2.3, depois o `cherry-pick` do painel (§2.4) num commit seu, depois as conferências que a mudança toca e o `npm run build` inteiro pelo escrivão no fim.

## §2 O que muda

1. **Uma só projeção da linha para as provas**, num módulo partilhado (o mesmo resultado em JavaScript e em Python, conferido por um teste sobre as quatro linhas): o texto do ficheiro da linha sem o bloco `verifications` (da chave `verifications:` até à chave seguinte do primeiro nível ou ao fim). O sha256 das provas passa a ser o desta projeção.
2. **Todas as provas que guardam o sha256 de um ficheiro de `ledger/claims/` inteiro passam a usar a projeção:** a da HB1 (`hb1-provas.py`, `cruzamento.mjs`, `gate-html.mjs`, `check-cadeia.mjs`) e qualquer outra que encontres pela mesma procura (dizes quais no relatório). `series.json` reescreve-se pelo `hb1-provas.py` com os sha256 novos, sobre os ficheiros de `main`.
3. **Plantas** (no `verify`), cada uma numa cópia: um valor mudado numa das quatro linhas tem de ser recusado; uma fonte (`source_url`) mudada tem de ser recusada; uma entrada a mais em `verifications` tem de passar. **Pela regra 4:** a prova protege o número e a fonte; continua a recusar qualquer mudança fora da história das releituras, e a planta prova-o.
4. **O painel de 02.11:** `git cherry-pick 7b743d896` por cima, num commit com a mesma mensagem; o `build` e as conferências tocadas verdes com ele.

## §3 As frases

Nenhuma.

## §4 O relatório e o que pára

O relatório diz as provas encontradas e mudadas, os sha256 antes e depois das quatro linhas, as plantas e os seus códigos, os commits e os códigos lidos dos ficheiros `.codigo`. Paras e dizes: se a projeção tiver de deixar de fora outro campo além de `verifications`; se outra conferência recusar o painel por outra razão (dizes qual, sem a mudar).
