# Brief UE2 · a página da União como a página dos países: as dez faixas empilhadas e ordenadas, os 27 nomeados ao toque, e as definições dos dois quadros em palavras comuns

*Escrito pelo lugar de direção (Claude Fable 5.1) a 02.10.2026, pela §1.143 (o UE2 na ordem dos blocos: a página da União como a página dos países) e pela leitura a frio do K2 (os cartões da União com valores sem unidade, já corrigidos, e definições com termos técnicos, deixadas para aqui). O §0 é medido por `design/observatorio/medidas/BRIEF-UE2.py`, que lê só o repositório (a M34). Sem travessões.*

## 0 · O que se mediu (02.10.2026, pelo guião `design/observatorio/medidas/BRIEF-UE2.py`, o sítio em `636cb657`)

O livro tem 10 séries de países (`series_de_paises_no_livro`), uma por medida com um valor por país da União; os dois quadros declaram 21 cartões (`cartoes_dos_dois_quadros`). Em cada faixa da União só 2 países levam nome hoje (`paises_nomeados_em_cada_faixa_hoje`), o mais baixo e o mais alto; os outros são marcas sem nome. As definições dos quadros usam termos técnicos 44 vezes (`termos_tecnicos_nas_definicoes_dos_quadros`): «nominal unit labour cost», «deflat», «economias avançadas» e «consolidado», nas duas línguas. A captura da página da União na largura do telemóvel, depois do K2, mede 1205 pixels de altura (`altura_da_pagina_da_uniao_a_390_depois_do_k2`), porque a fila dos cartões mostra um de cada vez.

## 1 · O que os leitores viram

O diretor (30.09): gostou da comparação com a União, os países, o melhor e o pior; é o que quer mais. A §1.143 fixou: a página da União como a página dos países, com as dez faixas ordenadas e empilhadas, os 27 nomeados ao toque e as definições dobradas. A leitura a frio do K2 (02.10): na página da União, as definições usam «nominal unit labour cost index», «deflators», «advanced economies», «consolidated credit flow», que um leitor comum não conhece.

## 2 · O teste de aceitação, dito antes

Feito quer dizer: a página da União (`/uniao-europeia/` e `/en/european-union/`) tem, depois da manchete dos dois quadros, uma secção dos países com as dez medidas que têm série, cada uma como uma faixa à largura inteira, empilhadas uma por baixo da outra, cada faixa ordenada do valor mais baixo ao mais alto com as 27 marcas, Portugal destacado e a média da União marcada, como a faixa da União de cada cartão já faz; em cada faixa, uma lista dobrada («Os 27 por ordem») que abre sem guião e lista os 27 países pela ordem da série com o nome e o valor, Portugal marcado, e, com guião, o toque numa marca mostra o nome e o valor desse país; os 21 cartões dos dois quadros ficam na página com a anatomia do K2, e as definições dobradas de cada um dizem em palavras comuns o que o número é (0 ocorrências dos quatro termos sem a explicação ao lado), nas duas línguas, sem mudar nenhum valor nem nenhuma etiqueta de fonte; cada nome de país vem da tabela de autoridade, cada valor de um ponto da série, cada lugar recontado pelo portão como hoje; a página a 390 px lê-se de cima a baixo sem fila horizontal; os três portões a 0; as capturas da página nas cinco larguras e nas duas edições; o relatório com o `medidas.json`.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **A secção dos países** | `src/views/UniaoEuropeiaView.astro`: depois da manchete, a secção «Os 27 países» com as dez medidas que têm série em `ledger/series/`, cada uma com o nome da medida, a faixa à largura inteira (o componente da faixa da União, ou um irmão dele para a largura inteira, com o mesmo modelo `src/lib/faixa-da-uniao.mjs` a fazer as contas) e a lista dobrada dos 27 por ordem (`<details>`, com o nome e o valor de cada país, Portugal marcado, a média da União na sua posição); a ordem das dez medidas é a dos quadros | a secção nas duas edições; dez faixas; dez listas de 27 |
| 2 | **O toque numa marca** | Com guião, tocar ou pousar numa marca mostra o nome e o valor do país (um só mecanismo, pequeno, em `public/js/`, que só liga o que já está no documento: o nome e o valor de cada marca vão no documento, escondidos até ao toque); sem guião, a lista dobrada é o caminho | a prova do toque numa página construída, com e sem guião |
| 3 | **As definições em palavras comuns** | As definições dobradas dos 21 cartões (`src/data/figuras.mjs` e as definições declaradas) explicam cada termo técnico na primeira vez que aparece, nas duas línguas, sem mudar os valores nem as etiquetas de fonte; a lista dos quatro termos do §0 e os outros que a leitura em palavras comuns apontar | 0 termos sem explicação; a célula de linguagem simples, se existir, a 0 |
| 4 | **A fila dos cartões no telemóvel** | A 390 px a página lê-se de cima a baixo: a fila horizontal dos cartões passa a empilhada (como as páginas de assunto), ou fica com um controlo honesto que diga quantos são e onde se está; decisão escrita no relatório pela captura | a captura a 390 e a 768 |
| 5 | **As réguas** | A faixa inteira e a lista dobrada recontam-se pelo portão como a faixa do cartão (as marcas, os pontos, os nomes da tabela de autoridade, o lugar); uma célula nova prova as dez faixas e as dez listas nas duas edições, com plantas (um país a menos, um nome fora da tabela, uma ordem trocada, um valor diferente do ponto); `decisoes-em-vigor.py` sobre os ficheiros tocados antes de mexer (a §1.124 e a §1.140 ficam em vigor: a média da União na sobrecarga só com a ressalva; a §1.130: sem «melhor» nem «pior») | a célula a 0 com as plantas a morder |
| 6 | **O relatório** | `design/especime-v3/medicoes/ue2-2026-10-02/LEIA-ME.md` com a tabela deste mandato, as plantas, os commits, os portões, o custo com a origem dita; o `medidas.json`; as capturas em `design/especime-v3/capturas/ue2-2026-10-02/` | completos |

## 4 · O que não se faz

Nenhuma série nova nem linha nova. Nenhuma cor nas faixas (a identidade §2: uma posição não é um limiar). Nenhum «melhor» nem «pior» (§1.130). Nenhuma mudança nas páginas de assunto. Nenhum `push`.

## 5 · As decisões do lugar de direção que este brief fixa

1. As dez faixas empilhadas são a página dos países: o leitor que pergunta «onde fica Portugal entre os 27» vê as dez respostas uma por baixo da outra, à mesma largura, e lê a posição relativa de uma para a outra.
2. A lista dobrada dos 27 é o caminho sem guião e o caminho de quem quer os números; o toque é um atalho.
3. As definições explicam-se em palavras comuns na primeira vez, e o termo técnico fica ao lado entre parênteses onde a fonte o usa, para quem o procura.

## 6 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos; os três portões a 0 na cabeça final pela tranca (`sh scripts/leituras/portoes.sh`); a regra de paragem; o relatório escrito também quando se para a meio; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos.
