# Brief F1.6 · O atraso do IEFP dito, a identidade do Portal BASE declarada, e a seleção do Painel Social (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5, a partir da linha F1.6 do `PLANO-fiabilidade-2026-09-02.md` §3 e das decisões (2), (3) e (5) da §1.98 de `DECISIONS.md`, tomadas pela delegação do diretor de 04.09. Sem travessões na prosa.*

## 0 · O que este bloco é

Três frases que a casa deve ao leitor e que exigem o carimbo dos textos governados ou a régua da voz. **O IEFP**: o desemprego registado por concelho que o sítio publica é o de 2025-12 e a fonte já publicou 2026-07 (o alarme honesto do corredor desde 01.09); a página tem de o dizer, com o contador público das séries atrasadas. **O Portal BASE**: a única fonte declarada que recusa o nome da casa e é lida com uma identidade de navegador (`core/sources.py` no motor, exceção escrita no F0.8); o Método tem de o declarar. **O Painel Social**: a frase de contexto da primeira página passa a dizer a seleção («oito das dezassete medidas principais») **só se** o número das medidas principais estiver conferido na fonte (a página do Eurostat ou da Comissão que o publique, lida e citada no relatório com o excerto); se não estiver, a frase fica como está e o relatório di-lo.

## 1 · O que entra

1. **O atraso do IEFP, dito na linha e no concelho:** nas páginas de linha do desemprego registado por concelho (as 278 do continente, ids `*-desemprego-registado-*`) e no cartão correspondente das páginas de concelho, uma frase da forma «Último período publicado pela fonte: 2026-07; a casa publica 2025-12 desde dd.mm.aaaa» em que os três valores são lidos (o período da fonte do relatório do corredor ou do `refresh_report.json` do motor, atravessado ao sítio por um ficheiro de dados com origem; a data «desde» é a `access_date` da linha), nunca escritos à mão; um contador público «séries atrasadas: n» no cabeçalho do painel de frescura (o `n` contado das linhas com esse estado, e 0 quando não houver), nas duas edições, declarado no inventário da voz com origem.
2. **O Portal BASE no Método:** um parágrafo curto na secção do Método sobre as fontes ou a verificação: «Uma fonte, o Portal BASE, recusa pedidos que se identifiquem com o nome da casa; a casa lê-a com a identidade de um navegador comum, e di-lo aqui em vez de a deixar cair.» (a redação pode ser afinada, sem adjetivos e sem falar de confiança). O texto governado do Método vive em `src/data/metodo.mjs` e o `check:ledger` exige que a entrada de `DECISIONS.md` que o muda diga `**Afecta:** metodo` com o carimbo `**Texto:** metodo <12 hex>` do resumo novo (lê `scripts/check-ledger.mjs` a partir da linha 440 para a regra exata); escreve a entrada §1.99 com a forma que a regra pede e o parágrafo em ambas as edições (`REGRAS`, `ABERTURA`, `LEITURA_BREVE` ou `FECHO`, onde couber).
3. **A seleção do Painel Social:** se a fonte confirmar o número das medidas principais (o relatório cita o endereço, a data e o excerto), a frase de contexto do Painel Social em `src/data/figuras.mjs` (`CONTEXTO_DOS_PAINEIS`) passa a começar por «Oito das dezassete medidas principais do Painel Social Europeu …» nas duas edições, com a origem do número no cabeçalho da declaração; a régua A4 do F1.1 continua verde. Se não confirmar, nada muda e o relatório diz o que se leu.

## 2 · O que não entra

Nenhum número escrito à mão (o 2026-07, o 2025-12, o «desde» e o «n» vêm de ficheiros com origem); nenhuma mudança ao Sobre; nenhuma outra frase no Método; nenhum pedido à rede a partir do portátil além da leitura da página da fonte para o item 3 (uma página, uma vez).

## 3 · Onde se constrói

Ramo `frescura-2026-09-04` numa worktree própria a partir de `origin/main` (confirma o SHA). Ficheiros: `src/views/LinhaView.astro` (só o bloco do atraso; o F1.4 toca as datas e o endereço, o F1.7 as unidades e as leis: linhas diferentes, e diz o que tocaste), `src/views/MunicipioView.astro` (só o cartão do desemprego registado), `src/data/frescura.mjs` ou o ficheiro de dados da frescura que existir, `src/data/metodo.mjs`, `src/data/figuras.mjs`, `src/i18n/strings.mjs` (chaves novas só), `DECISIONS.md` (só a §1.99 com o carimbo), `tests/linha/*.mjs`, `design/especime-v3/medicoes/frescura-construtor.md`. No motor (`~/Instruments/ResearchHub`, só leitura) o `indicators/refresh_report.json` e o relatório do corredor dizem o período que a fonte publica.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| K1 | a frase do atraso nas 278 páginas de linha do desemprego registado e nos 278 cartões de concelho, nas duas edições, com os três valores a resolverem em ficheiros com origem (nunca literais no gabarito) | script sobre o `dist/` e leitura do código |
| K2 | «séries atrasadas: n» no painel de frescura, com o `n` igual à contagem das linhas nesse estado | HTML e script |
| K3 | o parágrafo do Portal BASE no Método nas duas edições, com a §1.99 a carimbar `metodo` e `npm run ledger:check` verde | o portão |
| K4 | a frase do Painel Social mudada só com a fonte citada, ou inalterada com a razão | o relatório |
| K5 | nenhum número novo fora dos que os ficheiros com origem trazem; `check:voz` com as cadeias novas declaradas | `numeros-novos.mjs`, `check:voz` |
| K6 | `npm run build`, `verify`, `typecheck` a 0, com os códigos lidos dos registos | os três comandos |
| K7 | plantas vermelhas e depois verdes: um período escrito à mão no gabarito; o contador a 0 com linhas atrasadas; a §1.99 sem o carimbo | a régua |

## 5 · O que se entrega e a disciplina

O relatório com K1 a K7, as capturas de uma linha do IEFP e do Método a 390 e 1 280 nas duas edições em `design/especime-v3/capturas/frescura-2026-09-04/`, a régua com as plantas, o SHA e a corrida `portao` verde. Empurra e espera o verde; não fundes em `main`. Commits pequenos em português sem travessões, trailers `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido; o `typecheck` é estrito. Estimativa: Opus, duas passagens, da ordem de 0,4 a 0,7 M símbolos (S a M).
