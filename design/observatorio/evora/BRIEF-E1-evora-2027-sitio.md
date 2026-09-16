# Brief · E1 · Évora 2027 (a metade do sítio)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 16.09.2026, depois da metade do motor (fundida em `master` do ResearchHub na cabeça `7b64e8e`, com duas leituras a frio filadas ao lado do estudo). É a segunda metade do bloco E1 (`BRIEF-E1-evora-2027.md`, §2 último ponto e §5). Constrói-se na worktree `.claude/worktrees/e1-2026-09-16` do sítio (ramo `e1-2026-09-16`, criado sobre `c032cbfe`, a cabeça do P3 que aterra em `main` na palavra do diretor; se o P3 mudar antes de aterrar, o lugar de direção rebaseia este ramo). O exportador do motor corre da árvore principal do motor (`~/Instruments/ResearchHub`, em `master`, limpa no que é deste estudo) e aponta ao caminho desta worktree, nunca à árvore principal do sítio. O construtor é o Claude Opus 5. Sem travessões na prosa.*

## 0 · O teste de aceitação, dito antes

Feito quer dizer: `/estudos/evora-2027-prometido-painel-dinheiro/` e `/en/estudos/evora-2027-prometido-painel-dinheiro/` existem, com a porta para `/texto`, e a página de texto compõe do registo o documento inteiro (as sete secções, as tabelas, as citações na língua da fonte), sem guião, nas cinco larguras; `/estudos/` lista o estudo novo com a data; os seis portões dos documentos (D1 a D6) e o `check:cruzamento` passam; os três portões a 0; e o exportador do motor, corrido sem `--write` e depois com `--write`, escreveu os registos e o manifesto sem tocar em mais nada.

## 1 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **A declaração do estudo** em `src/data/studies.mjs` | uma entrada em `WORKS` pelo padrão do `evora-prometido-pago-auditado-2026`: `id` e `slug` `evora-2027-prometido-painel-dinheiro`, `subject: 'evora'`, as duas edições com `title` (pt: «Évora 2027 — O Prometido, o Painel, o Dinheiro»; en: «Évora 2027 — Promised, Panel, Money», como o motor as intitula), `date: '2026-09-16'`, `updated: null`, `artifactUrl: null`; a `description` nas duas línguas escrita pela norma (uma frase, o que o estudo põe lado a lado, sem se explicar); a razão da data no comentário, como as outras entradas fazem (o commit do motor que escreveu os bytes) | a entrada; `STUDY_IDS`, `EDITIONS` e o resto a seguir por si |
| 2 | **Os bytes fixados** em `studies-src/evora-2027-prometido-painel-dinheiro/pt.html` e `en.html`, e o `studies-src/manifest.yml` com o `sha256_normalized` de cada um, pelo mesmo caminho que fixou os do 04 (lê o `README` de `studies-src/` e o `check-documentos.mjs` antes) | os dois ficheiros byte a byte como o motor os escreveu (`content/14 Évora 2027/*.html`), o manifesto com os dois resumos | D5 verde |
| 3 | **A travessia dos registos** | no motor, `python3 publisher/export_records_site.py` (o ensaio: tem de passar agora que o sítio declara o estudo) e depois `--write`; `registos/evora-2027-prometido-painel-dinheiro/{pt,en}.record.json` e `.cortes.json` e o `registos/manifest.json` com as duas entradas novas; nada mais muda em `registos/` | D1 a D4 e D6 verdes; o `git status` do motor limpo depois (o exportador só lê de lá) |
| 4 | **A página de texto** | `TextoView` compõe o registo: confere nas cinco larguras que as tabelas largas (a das obras, com cinco colunas de citações; a das fontes, com endereços) ficam dentro do seu contentor com deslocação horizontal própria e a página não desloca; se o gabarito não tiver isso para tabelas de estudo, é o único CSS que este bloco pode acrescentar, e diz-se | capturas nas cinco larguras, duas edições, `design/especime-v3/capturas/e1-2026-09-16/` (o estudo e o texto) |
| 5 | **A lista dos estudos** e a primeira página | `/estudos/` mostra o estudo novo no seu lugar, e a contagem da primeira página (a linha «Estudos») sobe por si; nenhum número escrito à mão | a captura de `/estudos/` a 390 e 1280 |
| 6 | **O relatório** | `design/especime-v3/medicoes/e1-2026-09-16/LEIA-ME.md`: a tabela deste §1 com a medida de cada item, os comandos do exportador com as linhas de saída citadas, os commits, a cabeça, os portões, o custo | completo |

## 2 · O que não se faz

Não se muda o documento (se algo no texto estiver errado, diz-se ao lugar de direção: corrige-se no motor e refixam-se os bytes); não se escreve um número à mão; nada novo em largura além do que o item 4 permitir; não se toca nas outras entradas de `studies.mjs`, em `ledger/`, no motor além de correr o exportador; não se mexe nos portões.

## 3 · As regras de sempre

Commits pequenos com os dois trailers (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_01JbpczCRGASdUGMPd5Sxzqo`); nunca `git add -A`; os três portões a 0 na cabeça final, cada comando no seu, com o código lido de um ficheiro; nunca `git checkout` na árvore principal; nunca `push`; prosa nova em português sem travessões.
