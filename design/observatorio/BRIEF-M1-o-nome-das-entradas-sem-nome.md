# Brief M1 · O `name` das entradas do índice sem nome (04.09.2026)

*Escrito pelo lugar de direção (Claude Fable 5.1) para um construtor Claude Opus 5 no motor (`~/Instruments/ResearchHub`), a partir do achado do bloco F1.4 do sítio (`design/especime-v3/medicoes/nomes-construtor.md` §3: 79 entradas do índice do livro-razão chamam-se pelo título do documento porque a linha não traz `name`; dez são «Prestação de Contas 2025») e da linha correspondente dos pendentes. Sem travessões na prosa.*

## 0 · O que este bloco é

O exportador do motor (`publisher/export_site_rows.py`) escreve `name` nas linhas do livro-razão quando a fonte ou o registo lho dão; 79 linhas primárias saem sem `name`, e o sítio, que desde o F1.4 chama cada medida pelo nome humano, cai para o título do documento nessas. O bloco dá a cada uma dessas linhas um `name` **derivado de um campo que já existe** (o rótulo da série na fonte, o `document.title` com a medida, o nome que a mesma medida já tem noutra linha do mesmo quadro), nunca inventado, e reexporta-as para o sítio.

## 1 · O que entra

1. **A lista das 79**: o construtor mede-a no sítio (`ledger/claims/*.yml` sem `name`, com `source_url` ou `document.url`, não derivadas) e imprime-a no relatório com a origem que cada uma tem hoje.
2. **A regra do nome**, escrita uma vez no exportador e não à mão linha a linha: (a) se a mesma medida (o mesmo `document.edition` ou o mesmo indicador da fonte) tem `name` noutra linha, o nome é esse, com o ano ou o concelho a seguir se a linha os tiver; (b) senão, o rótulo da série tal como a fonte o publica (o `excerpt` já traz o rótulo em muitas; o `document.title` noutras), cortado do que não é o nome da medida (a geografia, o período), com a regra de corte escrita e conferida por um conhecido-positivo; (c) o que não couber em (a) nem em (b) fica sem `name` e conta-se, com a razão.
3. **A reexportação** só das linhas que mudaram, com o `export_site_rows_test.py` verde nas duas passagens (a cópia versionada e o sítio vivo) e a paridade das derivações intacta (`core/derivacoes-paridade.json`).
4. **No sítio**: as linhas mudadas entram por um ramo do sítio (`nomes-motor-2026-09-04`), com `npm run ledger:check`, `check:cruzamento --with-origin`, `build`, `verify` e `typecheck` a 0, e a régua do F1.4 (`check:indice`) a contar quantas entradas ainda se chamam pelo título do documento (a medida de aceitação é o número a descer de 79 para o que (c) deixar, dito).

## 2 · O que não entra

Nenhum nome inventado; nenhuma mudança de valor, de unidade, de fonte ou de data em linha nenhuma; nenhum pedido à rede (os rótulos já estão nas linhas e nos ficheiros descarregados); nada nos ficheiros do motor que não se tocam (`indicators/*.json` das outras corridas, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`).

## 3 · Onde se constrói

No motor: ramo `nomes-2026-09-04` numa worktree própria (`git worktree add ~/Instruments/ResearchHub-worktrees/nomes-2026-09-04 -b nomes-2026-09-04 master`). Ficheiros: `publisher/export_site_rows.py`, `publisher/export_site_rows_test.py`, `publisher/RELATORIO-nomes-2026-09-04.md`. O pre-commit corre `python3 -m core.gate` (cerca de dois minutos e meio). No sítio: uma worktree própria a partir de `origin/main` para o ramo `nomes-motor-2026-09-04`, só com os `ledger/claims/*.yml` reexportados e o que o `check:cruzamento` exigir. Dois construtores do sítio correm em paralelo (F1.6 e o F1.10 pausado): não tocam no `ledger/`.

## 4 · As medidas de aceitação

| # | medida | como se mede |
|---|---|---|
| N1 | a lista das 79 no relatório, cada uma com a regra que lhe deu o nome ((a), (b) ou (c)) | o relatório |
| N2 | 0 nomes que não resolvam num campo existente da própria linha ou de uma linha irmã (o relatório cita o campo) | script |
| N3 | `python3 -m publisher.export_site_rows_test` verde nas duas passagens; `python3 -m core.gate` a 0 | os portões |
| N4 | no sítio, `check:indice` a contar as entradas pelo título do documento: de 79 para n, com n dito e as razões de (c) | a régua |
| N5 | nenhum valor, unidade, fonte ou data mudou: `git diff` das linhas só em `name` | diff |
| N6 | um conhecido-positivo do exportador: uma linha plantada sem rótulo utilizável fica sem `name` e conta-se, em vez de ganhar um nome inventado | o teste |
| N7 | no sítio, `npm run build`, `verify`, `typecheck` a 0 e a corrida `portao` verde | os três comandos |

## 5 · O que se entrega e a disciplina

O relatório no motor com N1 a N7, o ramo do motor empurrado com o gate verde, o ramo do sítio empurrado com o `portao` verde; nenhum fundido. Commits pequenos em português sem travessões; no motor só `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; no sítio também `Claude-Session: <o endereço da sessão>`; nunca `git add -A`; nunca um número que não foi medido. Estimativa: Opus, uma passagem e uma segunda depois da leitura a frio, da ordem de 0,3 a 0,5 M símbolos (S).
