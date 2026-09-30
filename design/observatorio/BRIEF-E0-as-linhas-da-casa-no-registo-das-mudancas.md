# Brief E0 · as linhas da casa no registo das mudanças, e a correção do desemprego: a linha que mede o próprio projeto ganha o seu lugar, e as duas linhas que escrevem «6» onde a fonte escreve «6.0» corrigem-se

*Escrito pelo lugar de direção (Claude Fable 5.1) a 30.09.2026 à tarde, com a decisão do diretor desse dia (o orçamento das duas subscrições gasta-se até ao fim, §1.146). É o pré-requisito comum à I179 e ao E1 (§1.144 e §1.145): o mecanismo que deixa uma linha derivada da casa mudar de valor com a história selada. É também o bloco de ensaio do GPT-6.1 Sol como construtor (§1.142 e §1.146): constrói-se com ele, lê-se a frio pelo Claude Opus 5.5 com cinco plantas, e conta-se o que a leitura acha e quantas passagens precisa, contra a história da Astra. O §0 é medido por `design/observatorio/medidas/BRIEF-E0.py`. Sem travessões.*

## 0 · O que se mediu (30.09.2026, pelo guião `design/observatorio/medidas/BRIEF-E0.py`, o sítio em `2273d725`)

Há 2 linhas do desemprego que escrevem o inteiro onde o excerto da fonte escreve o decimal (`linhas_do_desemprego_com_o_inteiro_onde_a_fonte_escreve_o_decimal`). O livro conta 3 correções publicadas (`correcoes_publicadas_contadas_no_livro`), e o contador derivado vale 3 (`valor_do_contador_das_correcoes`). A história selada dos valores cobre 9 linhas (`linhas_com_historia_selada`) e tem 0 entradas para o contador das correções (`entradas_seladas_do_contador_das_correcoes`). A tabela dos lugares declarados à mão tem 2 linhas (`linhas_com_lugar_declarado_a_mao`); o registo das mudanças aceita 1 lugar fora do país, das regiões e dos concelhos (`lugares_fora_do_pais_que_o_registo_aceita`); e o contador das correções não tem lugar declarado (`o_contador_das_correcoes_tem_lugar_declarado`, falso).

## 1 · O que se passa

O N1 parou duas vezes no ponto 5 do seu brief (§1.144): publicar as duas correções do desemprego muda o contador derivado das correções de três para cinco, e o registo das mudanças (`src/lib/mudancas.mjs`, a célula A3 do `check:pais`) fecha a construção quando uma linha muda sem declarar de que lugar é. O contador mede o próprio projeto: não é de Portugal, nem de uma região, nem de um concelho, e a tabela `src/data/lugar-das-linhas.mjs` só conhece esses lugares e a União Europeia. A prova reproduzível do construtor está em `design/especime-v3/medicoes/n1-2026-09-30/provar-contador-n1b.mjs`. O mesmo mecanismo trava o E1, cujo contador `estudos-evora-publicados` (já declarado a Évora) muda de seis para quatro.

## 2 · O teste de aceitação, dito antes

Feito quer dizer: as duas linhas do desemprego escrevem «6,0», cada uma com a sua entrada `correcao` datada (a fonte escreve «6.0»; a casa escreve o decimal), e a primeira página e o cartão do desemprego mostram «6,0 %» nas duas línguas; o contador das correções vale «5», com uma entrada `atualizacao` (a contagem anterior estava certa) e a história selada pelo `selar-historia-valores.mjs`; o registo das mudanças aceita o lugar «o projeto» para as linhas da casa, com a porta para a página das correções, e a página «O que mudou» lista as três mudanças (as duas correções e a recontagem), cada uma com o seu lugar; uma planta prova que uma linha derivada que mude sem lugar declarado continua a fechar a construção, e outra que uma correção sem entrada na história continua a fechar; os três portões a 0; as capturas da primeira página, do cartão do desemprego e de «O que mudou» a 390 e a 1 280 px nas duas línguas; o relatório com o `medidas.json`.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **O lugar «o projeto»** | `src/lib/mudancas.mjs` aceita a chave `o-estado-do-pais` como aceita `uniao-europeia`: o nome é «O Estado do País» (em inglês o mesmo nome), a porta é a página das correções (`routePath('correcoes', lang)`); `src/data/lugar-das-linhas.mjs` declara `correcoes-publicadas` com essa chave e a razão escrita (a linha conta as confissões da casa; o seu lugar é a casa) | a construção passa com o contador declarado; a planta A (retirar a declaração) fecha-a |
| 2 | **As duas correções do desemprego** | `taxa-de-desemprego-2025` e `taxa-de-desemprego-mip-2025`: `value` passa de «6» a «6,0», com uma entrada `corrections` de `kind: correcao`, `old_value` «6», `new_value` «6,0», a data do dia e a razão (a fonte escreve «6.0»); as linhas selam-se pelo `selar-historia-valores.mjs`; a planta B (uma correção sem entrada selada) fecha a construção | as duas linhas a «6,0»; «6,0 %» na primeira página e no cartão, pt e en |
| 3 | **A recontagem** | `correcoes-publicadas` passa a «5» com uma entrada `kind: atualizacao` («3» para «5», a data do dia, a razão: duas correções publicadas nesse dia), selada; o `check` da linha continua a bater | `ledger:check` a 0; «O que mudou» com a recontagem no lugar «O Estado do País» |
| 4 | **O que o leitor vê** | «O que mudou» (a secção do componente `RegistoCorrecoes.astro`, na página das correções e onde mais ele entra) lista as três mudanças com o lugar de cada uma; nada mais muda na página | as capturas |
| 5 | **A célula** | `tests/inicio/` ganha uma célula que prova o lugar «o projeto» (aceite com a declaração, recusado sem ela) e a história das duas correções; o `decisoes-em-vigor.py` corre sobre os ficheiros tocados e o relatório lista as decisões citadas neles (a §1.144 diz que a lista se lê antes de cada ficheiro que se apaga) | a célula passa; a lista no relatório |
| 6 | **O relatório** | `design/especime-v3/medicoes/e0-<data>/LEIA-ME.md` com a tabela deste mandato, as plantas, as medidas (`medidas.json`), os commits, os portões, o custo em símbolos e segundos, e o modelo que construiu | completo |

## 4 · O que não se faz

Nenhuma outra linha muda de valor. A anatomia do cartão e os formatos dos números ficam para o K2. Nenhum `push`. Nenhum ficheiro apagado sem ler a lista das decisões em vigor. Nada de dados pessoais, nenhum caminho da máquina nem nome de utilizador em ficheiro nenhum.

## 5 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório (`design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md`): caminhos explícitos; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de um ficheiro; a regra de paragem (parar e relatar quando o mecanismo exigir o que o brief não previu); o relatório escrito também quando se para a meio; uma construção de cada vez na máquina (`sh` do guião de espera antes de cada portão); o custo em símbolos e segundos.
