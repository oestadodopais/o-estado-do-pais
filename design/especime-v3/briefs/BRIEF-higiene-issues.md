# BRIEF · A passagem de higiene do registo dos defeitos (ISSUES.md)

*Escrito a 29.08.2026 pelo lugar de direção (Claude Fable 5) para o revisor (Claude Opus), numa cópia do repositório em `main` `98fd779`. Decisão do diretor de 29.08. Sem travessões na prosa.*

## 0 · O que é

`design/especime-v3/ISSUES.md` tem linhas ainda marcadas «aberto» que blocos posteriores resolveram, e outras que continuam abertas de verdade. A passagem confere cada linha aberta contra o sítio construído hoje e contra o `DECISIONS.md`, e fecha só o que prova; não muda uma linha de código.

## 1 · O método

1. Constrói o sítio na cópia (`npm ci` se faltar, `npm run build`); o `dist/` é a prova.
2. Para cada linha `| I… | … | **aberto** … |` (lista-as primeiro, com a contagem): lê o que a linha afirma; procura no `dist/`, nas réguas (`scripts/`, `tests/`) e no `DECISIONS.md` (as entradas §1.66 a §1.81 e as Emendas 19 a 23) a prova de que foi resolvida, com uma medição tua (um `grep` com positivo conhecido, uma célula de teste corrida, uma medida no DOM com o Playwright do repositório) e o commit ou a entrada que a resolveu (`git log -S` ajuda).
3. Fecha a linha só com prova: «**fechada a 29.08.2026** (`<commit>` ou §x.yy): <a medição que o prova>». Se a linha está parcialmente resolvida, reescreve o estado com o que falta, exatamente. Se continua aberta, deixa «aberto» e acrescenta, se souber, o que a resolveria. Se a linha já não faz sentido (a coisa que descreve deixou de existir), fecha-a como «**sem objeto desde** <bloco>», com a prova de que a coisa saiu.
4. Nunca fechas por inferência de nome ou de data; nunca alteras o texto da coluna «o quê» (é a história); nunca tocas em linhas já fechadas.

## 2 · O que é «feito»

* `ISSUES.md` com cada linha tocada a citar a sua prova; um relatório `design/especime-v3/medicoes/higiene-issues-2026-08-29.md` com a tabela (número · estado antes · estado depois · prova · commit ou entrada) e as contagens (abertas antes, fechadas agora, sem objeto, ainda abertas), e o custo em símbolos.
* Um commit só, com caminhos explícitos (`design/especime-v3/ISSUES.md` e o relatório), os dois trailers (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`, `Claude-Session: https://claude.ai/code/session_01BbaH3XteKcsmmN9VD6SGwU`), num ramo `higiene-issues-2026-08-29` criado na cópia; sem fusão nem envio.
