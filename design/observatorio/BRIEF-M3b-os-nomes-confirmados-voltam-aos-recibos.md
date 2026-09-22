# Brief · M3b · Os nomes oficiais confirmados voltam aos recibos, pela marca por fonte

*Escrito pelo lugar de direção (Claude Fable 5.1) a 22.09.2026, a partir do item 7 do `BRIEF-M3` e da §1.117. É a parte do sítio do bloco M3, que o motor fechou a 22.09 (`master` `3cf1ccb`). O construtor é o Claude Opus, numa worktree; a leitura a frio é do Codex. Sem travessões na prosa.*

## 0 · O teste de aceitação, dito antes

Feito quer dizer: (1) `src/data/enquadramento/nomes.json` é, byte a byte, o `nomes.json` que o motor exportou em `indicators/out/nomes-conferidos-2026-09-21/` (o `sha256` no relatório), com 18 nomes `mesma_medida: true` (4 do INE, 14 da PORDATA), 19 recusados e 4 por decidir; (2) os três leitores do sítio (`nomeOficial()` em `src/lib/enquadramento.mjs`, `NOMES_OFICIAIS` em `scripts/medir-defeitos.mjs`, `lerNomes()` em `scripts/check-nomes-oficiais.mjs`) leem a marca POR FONTE: um nome da fonte X rende-se só quando `correspondencia[X] === 'exata'`, `nome_X.estado === 'lido'`, `nome_X.mesma_medida === true`, sem a chave `aviso`, com `endereco` e `lido_em`; um ficheiro com a marca antiga por medida (uma cadeia de texto) rende zero nomes e o portão diz porquê; (3) o `check:nomes` conserva as suas 21 plantas passadas à forma nova e ganha três (a marca «exata» da fonte com o `mesma_medida` a `null`; a forma antiga do ficheiro; um nome `mesma_medida: true` cujo `estado` não é «lido»), todas a morder; (4) as páginas com nomes que voltam são medidas: os recibos (`/livro-razao/<id>` e `/en/ledger/<id>`) das 18 linhas, e os títulos de cartão do degrau 2 (só onde não há nome do projeto); (5) o motivo `nome-oficial-da-medida` volta a `ledger/allowlist.yml` com o texto de 21.09 e uma frase nova a dizer que desde 22.09 a confirmação são duas leituras registadas no motor, derivada e nunca escrita; (6) os três portões a 0 na cabeça final.

## 1 · O que se mediu a 22.09.2026

O ficheiro do motor tem `correspondencia: {"ine": …, "pordata": …}` por medida (os valores «exata», «proxima» ou `null`), e cada `nome_ine` e `nome_pordata` existe sempre, com `estado` («lido», «sem_indicador», «sem_pagina», «sem_resposta»), `mesma_medida` (`true`, `false` ou `null`), `proposta`, `prova`, `conferencia` e, em dois, `resolucao`; sem a chave `aviso` em lado nenhum. O ficheiro que o sítio guarda desde 15.09 tem `correspondencia` como texto por medida, e é por isso que `nomeOficial()` (linha 330), `medir-defeitos.mjs` (linha 644) e `check-nomes-oficiais.mjs` (linha 169) devolveriam zero nomes com o ficheiro novo sem lhe tocar. Não há guião que copie o ficheiro: a 15.09 foi copiado à mão, e é assim outra vez, com o `sha256` registado. `referencias.json` não muda. Os 18 confirmados: `posicao-de-investimento-internacional-2025` (PORDATA), `divida-publica-2025` (PORDATA), `taxa-de-desemprego-mip-2025` (PORDATA), `despesa-em-id-2024` (INE e PORDATA), `risco-de-pobreza-ou-exclusao-2025` (INE e PORDATA), e os restantes lidos do ficheiro pelo construtor, contados e não copiados.

## 2 · O mandato

| # | o que | a medida |
|---|---|---|
| 1 | O ficheiro novo copiado byte a byte do motor (só leitura no motor) | `sha256` igual nos dois lados, no relatório |
| 2 | Os três leitores pela marca por fonte, com a forma antiga recusada e dita | o `check:nomes` a contar 18 confirmados no ficheiro; a forma antiga plantada a dar 0 e a razão |
| 3 | As 21 plantas na forma nova, mais as três novas | 24 plantas a morder na saída do `check:nomes --prova` |
| 4 | Os cabeçalhos dos três ficheiros dizem a regra de 22.09 (duas leituras registadas, derivada no motor, a marca por fonte) e mantêm a história de 21.09 | lido no diff |
| 5 | O motivo `nome-oficial-da-medida` de volta à allowlist, com o texto de 21.09 (no `git show a500a709 -- ledger/allowlist.yml`) e a frase de 22.09 | o `gate:html` a 0 com o motivo em uso |
| 6 | As páginas medidas: quantos recibos rendem um nome (por fonte), quantos títulos de cartão vêm do degrau 2, e uma captura do recibo de `despesa-em-id-2024` nas duas edições a 390 e a 1 280 | os números no relatório, lidos do `dist` |
| 7 | Relatório curto em `design/especime-v3/medicoes/m3b-2026-09-22/LEIA-ME.md`; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de um ficheiro | os ficheiros `.codigo` ao lado do relatório |

## 3 · O que não se faz

Nenhum nome escrito à mão nem traduzido; nenhuma alteração ao motor nem ao seu ficheiro; nenhum valor do livro-razão muda; nenhum portão se enfraquece no que protege (o `check:nomes` continua a exigir que cada nome rendido seja, carácter a carácter, um nome confirmado daquela linha, e que fora dos elementos marcados nenhum nome nem endereço do ficheiro apareça). Nenhum `push`.

## 4 · As regras de sempre

Worktree própria, `npm ci` uma vez, commits pequenos por caminhos explícitos com os dois trailers num bloco contíguo (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd`), prosa nova em português sem travessões, o vocabulário do §6 da estrutura. A regra de paragem: só um portão que proteja um número, uma fonte ou uma pessoa faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta.
