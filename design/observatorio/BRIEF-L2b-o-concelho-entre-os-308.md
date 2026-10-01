# Brief L2b · o concelho entre os 308: na página de cada concelho, cada medida com linhas para os 308 diz o valor do concelho, o de Portugal e o lugar entre os 308, numa faixa como a da União

*Escrito pelo lugar de direção (Claude Fable 5.1) a 01.10.2026 à noite, pela §1.143 (o L2: cada concelho ao lado de Portugal e o seu lugar entre os 308) e pela §1.149 (o L2a, o mapa primeiro, já no ar). É a segunda metade do L2. O §0 é medido por `design/observatorio/medidas/BRIEF-L2b.py`, que lê só o repositório (a M34). Sem travessões.*

## 0 · O que se mediu (01.10.2026, pelo guião `design/observatorio/medidas/BRIEF-L2b.py`, o sítio em `a9509193`)

Há 308 concelhos com linha de população (`concelhos_com_linha_de_populacao`) e 9 medidas com uma linha por concelho para todos eles (`medidas_com_linhas_por_concelho`); o ganho médio mensal de 2024 tem 308 linhas (`linhas_do_ganho_medio_por_concelho`). Na faixa da União, o lugar de Portugal conta-se na vista a partir da linha de série, numa só linha de código (`linhas_da_faixa_da_uniao_que_contam_o_lugar`). A página do concelho tem 0 faixas (`faixas_na_pagina_do_concelho`) e a leitura do lugar cita 0 vezes a linha nacional do ganho médio (`referencias_nacionais_na_leitura_do_lugar`). Das seis réguas que só se correm à mão, 2 ainda procuram o mapa ou a pesquisa na primeira página (`reguas_a_mao_que_procuram_o_mapa_na_primeira_pagina`).

## 1 · O que o leitor viu, e o que as leituras acharam

O diretor (30.09): ao ir aos concelhos, o conteúdo está espalhado e um número sem contexto não diz nada; gostou da comparação da União (o melhor, o pior, onde Portugal fica). As leituras a frio do L2a e do E1 (01.10): o ganho médio mensal de Évora, 1 484,50 euros, aparece sem referência que diga se é alto ou baixo; a referência nacional está noutra página (I182). A faixa da União (UE1, §1.140) resolveu o mesmo problema para o país: o valor, a média da União, o lugar entre os 27 contado na vista a partir da linha de série, e as 27 marcas na régua.

## 2 · O teste de aceitação, dito antes

Feito quer dizer: na página de cada um dos 308 concelhos, nas duas edições, cada cartão de uma medida com linhas para os 308 leva uma faixa: o valor do concelho, o valor de Portugal como referência (a linha nacional da mesma medida e do mesmo período, quando existe; quando não existe, a faixa diz-o e não inventa uma), e o lugar do concelho entre os 308, contado na vista como a faixa da União conta (1 mais o número de concelhos com valor maior, ou menor onde menor é melhor, e a direção dita no cartão), com as 308 marcas na régua e a do concelho destacada; cada número da faixa resolve numa linha (o valor na linha do concelho, a referência na linha nacional, o lugar na derivação declarada da vista com as 308 linhas como recibo, como a faixa da União faz com a série); a leitura breve do concelho diz, para o ganho médio, se está acima ou abaixo de Portugal, lido das linhas; as duas réguas à mão que procuram o mapa na primeira página passam a procurá-lo em «Lugares»; uma célula prova a faixa nas 308 páginas e nas duas edições, com plantas (um lugar errado, uma referência de outro período, uma marca a menos); os três portões a 0; as capturas da página de Évora e de um concelho pequeno nas cinco larguras e nas duas edições; o relatório com o `medidas.json`.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **A faixa do concelho** | Um componente `FaixaDoConcelho` à imagem de `FaixaDaUniao` e de `src/lib/faixa-da-uniao.mjs`: recebe a chave da medida, a linha do concelho, a linha nacional (se houver) e as 308 linhas (`linhasPorConcelho` em `src/lib/dominios.mjs`); conta o lugar na vista; rende a régua com as 308 marcas, Portugal marcado e o concelho destacado; as palavras (o lugar, «de 308», «acima de Portugal», «abaixo de Portugal») vêm das cadeias da casa nas duas línguas | a faixa nos 308 × 2 páginas; o lugar bate com uma recontagem independente nas 308 linhas |
| 2 | **Que medidas** | As 9 que têm linha para os 308 (a população, a dívida e o limite, o índice de dívida, o ganho médio, o desemprego registado, as empresas, o poder de compra, o prazo médio de pagamento), nos cartões que já existem na página do concelho; uma medida sem linha nacional do mesmo período fica sem a referência e a faixa di-lo; a direção (onde um valor maior é pior) declara-se por medida numa tabela, e não no código do componente | a tabela das direções no relatório, com a razão de cada uma |
| 3 | **A referência na leitura breve** | A leitura do lugar (`src/lib/lugar.mjs`) diz, para o ganho médio, «acima de Portugal» ou «abaixo de Portugal» com os dois valores, lidos das linhas; nada escrito à mão | a frase na página de Évora e na de um concelho abaixo da média |
| 4 | **As réguas à mão** | `tests/inicio/matriz.mjs` e `tests/municipio/correcoes-c.mjs` passam a procurar o mapa e a pesquisa em «Lugares»; as outras quatro conferem-se e dizem-se no relatório | as seis a correr a 0 à mão |
| 5 | **As células** | Uma célula nova em `tests/inicio/` (ou `tests/municipio/`) no `check:lugar` ou no `check:navegacao`: a faixa existe em cada cartão das 9 medidas nas 308 páginas e nas duas edições; o lugar de cada concelho bate com a recontagem; a referência é a linha nacional do mesmo período; as 308 marcas estão na régua; com as plantas; `python3 scripts/leituras/decisoes-em-vigor.py` sobre os ficheiros tocados antes de mexer (a §1.124 e a §1.140 sobre a faixa da União ficam em vigor; a §1.143) | a célula a 0 com as plantas a morder |
| 6 | **O relatório** | `design/especime-v3/medicoes/l2b-2026-10-01/LEIA-ME.md` com a tabela deste mandato, as plantas, os commits, os portões, o custo com a origem dita; o `medidas.json` por um guião do bloco; as capturas em `design/especime-v3/capturas/l2b-2026-10-01/` | completos |

## 4 · O que não se faz

Nenhuma linha nova no livro: o lugar conta-se na vista como na faixa da União, e os valores são os das linhas que existem. Nenhuma mudança na anatomia do cartão (K2). Nenhuma mudança em «Lugares» nem na primeira página além das duas réguas. Nenhum `push`.

## 5 · As decisões do lugar de direção que este brief fixa

1. O lugar entre os 308 conta-se na vista a partir das 308 linhas, como o lugar entre os 27 se conta a partir da série (§1.140): a derivação declarada e as linhas como recibo, sem 308 × 9 linhas novas.
2. A referência é Portugal, não a região nem o distrito: é a comparação que o leitor pediu («onde fica o meu concelho no país»); a região e o distrito podem vir depois.
3. Uma medida sem linha nacional do mesmo período fica sem referência e di-lo; não se escolhe outro período para ter uma.

## 6 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos; os três portões a 0 na cabeça final pela tranca (`sh scripts/leituras/portoes.sh`); a regra de paragem; o relatório escrito também quando se para a meio; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos.
