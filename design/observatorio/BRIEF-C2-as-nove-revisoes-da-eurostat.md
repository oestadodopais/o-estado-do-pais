# Brief C2 · as nove revisões da Eurostat de 02.10.2026, relidas: as linhas postas em dia pelo caminho da V16, com a correção datada, o recibo a dizê-lo e as frases que as usam conferidas

*Escrito pelo lugar de direção (Claude Fable 5.1) a 05.10.2026 de manhã, depois de o painel semanal, corrido à mão às 09:23 UTC (a §1.162), ter visto que a Eurostat reviu nove números que o sítio publica. O §0 é medido por `design/observatorio/medidas/BRIEF-C2.py`, que lê só o repositório na cabeça presa (a M34, a §1.153). O construtor é o Claude Opus 5.5 (a definição `construtor`); a leitura a frio é do Codex Astra `xhigh` (a §1.161). O modelo deste bloco é o C1 e as suas passagens (`BRIEF-C1-as-correcoes-de-confianca.md`, os pontos 3 e 4; a §1.14x do C1c que validou as releituras pela proveniência em vigor), e as regras do `ledger/README.md` sobre as correções (a V16). Sem travessões.*

## 0 · O que se mediu (05.10.2026, pelo guião `design/observatorio/medidas/BRIEF-C2.py`, o sítio em `3a253f73`)

O painel de 05.10.2026 escreveu 82 verificações iguais (`linhas_com_uma_verificacao_igual_de_05_10_2026`), 9 divergentes (`linhas_com_uma_verificacao_divergente_de_05_10_2026`) e 0 inacessíveis (`linhas_com_uma_verificacao_inacessivel_de_05_10_2026`); as 9 divergentes são todas lidas na Eurostat (`dessas_as_lidas_na_eurostat`), e 3 delas são citadas pelo id na primeira página (`linhas_divergentes_usadas_na_primeira_pagina`). O livro tem 1 correção do tipo atualização (`correcoes_do_tipo_atualizacao_no_livro`), a da dívida das famílias da União de 28.09 (o C1c), que é o modelo; o `ledger/README.md` nomeia a V16 2 vezes (`mencoes_da_v16_no_readme_do_livro`).

## 1 · De onde vem o ponto

Pela política da casa, uma revisão da fonte não se publica como valor novo em silêncio: não se publica, e uma pessoa é avisada. O painel viu nove revisões, todas carimbadas pela Eurostat a 02.10 (os carimbos dos conjuntos passaram de setembro, ou de março e julho, a 02.10), e deixou em cada linha a verificação «diverge» com o valor que encontrou; o diretor foi avisado nesta sessão. O que falta é o que o C1c fez à dívida das famílias: reler pelo cliente da casa, registar a correção datada com o valor antigo e o novo e a razão (os dois carimbos), pôr o valor novo na linha, e deixar o recibo a dizer tudo isto em palavras.

## 2 · O teste de aceitação, dito antes

Feito quer dizer: as nove linhas (`custo-unitario-do-trabalho-2024`, `despesa-em-id-2024-ue`, `formacao-bruta-de-capital-fixo-2024`, `formacao-bruta-de-capital-fixo-2025`, `pib-real-per-capita-2024`, `pib-real-per-capita-2025`, `posicao-de-investimento-internacional-2024`, `posicao-de-investimento-internacional-2025`, `saldo-da-balanca-corrente-2024`) relidas na Eurostat pelo cliente da casa pelo caminho da V16, cada uma com uma correção datada de `kind: atualizacao` (o valor antigo, o novo, a razão nas duas línguas com os dois carimbos do conjunto e a data em que o painel viu a revisão), o valor, o excerto e o acesso postos em dia, e a verificação «diverge» de 05.10 conservada na história; o recibo de cada uma a dizer em palavras correntes que a fonte reviu o número e quando; as frases, as comparações e as condições que usam as nove linhas conferidas (as três da primeira página, as leituras dos cartões, os valores de referência da Comissão onde entram), e o que mudar de sentido pela revisão dito no relatório; o `check:ledger` e a célula da história da proveniência a 0; as capturas das páginas tocadas; o painel corrido outra vez no fim, com a raiz do motor no caminho, a dar 91 iguais e 0 divergentes; os três portões a 0.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **As nove releituras** | no motor, pelo caminho que o C1c abriu (o cliente da casa, `core.http`, pede o corpo de cada conjunto da Eurostat pelo pedido selado na linha; a coordenada e a bandeira lidas como o C1c lê); para cada linha, a correção datada (`date` o dia da releitura, `kind: atualizacao`, `old_value`, `new_value`, `reason` e `reason_en` com os dois carimbos e a data do painel), o valor e o excerto novos, o `access_date` e o `published_at` postos em dia pelo corpo; a exportação para o sítio pelo exportador; nenhum valor escrito à mão: o que o corpo não der fica como está e o relatório di-lo | 9 linhas com correção; `check:ledger` a 0 |
| 2 | **Os recibos** | o recibo de cada linha diz em palavras correntes que a fonte reviu o número a 02.10 e que a casa o releu nesse dia, como o do C1 (o ponto 6 do C1, a F02); a história das verificações fica inteira (a «diverge» de 05.10 e a releitura depois) | os 9 recibos nas duas edições |
| 3 | **As frases que usam as linhas** | as três citações da primeira página e todas as leituras, comparações, condições de blocos e valores de referência que usam as nove linhas conferidas com os valores novos; o que mudar de sentido (uma comparação que inverte, uma condição que deixa de valer, uma referência que passa ou deixa de passar) fica dito no relatório e, se mudar uma frase, a frase muda pelas regras das leituras | a lista no relatório; as células a 0 |
| 4 | **O painel no fim** | `indicators/refresh.py` corrido com a raiz do motor no caminho depois das releituras: 91 iguais, 0 divergentes, 0 inacessíveis; as verificações desse dia entram no livro com o bloco | o registo do painel |
| 5 | **Os registos** | o mapa do repositório; `ISSUES.md` só com o que o bloco achar; o relatório `design/especime-v3/medicoes/c2-2026-10-05/LEIA-ME.md` com a tabela do mandato (as nove linhas, os valores antigos e novos, os carimbos), as plantas, os commits dos dois repositórios, os portões lidos de ficheiro, o custo e o modelo; o `medidas.json`; as capturas dos recibos de duas linhas e da primeira página nas cinco larguras e nas duas edições em `design/especime-v3/capturas/c2-2026-10-05/` | completos |

## 4 · O que não se faz, e para onde vai

Nenhum valor escrito à mão; nenhuma releitura das 82 linhas iguais; nenhuma mudança no painel além da corrida com a raiz no caminho (a I199 é do RP4-m); nenhuma mudança nas séries (o RP4-m); nenhum `push`; no motor, os ficheiros por confirmar não se tocam, exceto os que a própria corrida do painel escreve por si.

## 5 · As decisões do lugar de direção que este brief fixa, e porquê

1. **Uma revisão da fonte é uma correção datada, nunca uma substituição silenciosa**: o leitor vê o valor antigo, o novo e a razão, como a política e a V16 exigem.
2. **As nove relidas pelo cliente da casa, e não copiadas do painel**: o painel viu; o livro só muda pelo que o corpo da fonte diz, lido pelo caminho selado.
3. **As frases conferem-se todas**: um número que muda pode mudar uma comparação, e uma frase que ficou a dizer o contrário do número é pior do que o número antigo.

## 6 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos nos dois repositórios; no motor só o `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate`; os três portões do sítio a 0 na cabeça final pela tranca (`sh scripts/leituras/portoes.sh`); a regra de paragem; o relatório escrito também quando se para a meio; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos; cada registo de trabalho com a cabeça e a árvore limpa em que correu (a M50).
