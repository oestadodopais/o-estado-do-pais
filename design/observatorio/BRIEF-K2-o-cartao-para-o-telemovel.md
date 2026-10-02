# Brief K2 · o cartão para o telemóvel: o valor e a comparação primeiro, a definição dobrada, os nomes que dizem quando um número é uma variação, um só formato de número, e as frases que um leitor sem o assunto percebe

*Escrito pelo lugar de direção (Claude Fable 5.1) a 02.10.2026, pela §1.143 (o K2 na ordem dos blocos), pela §1.144 (os cartões difíceis no telemóvel que as leituras do N1 apontaram) e pelas leituras a frio do E1, do L2a e do L2b (as frases dos estudos nos cartões e no índice, I182). O §0 é medido por `design/observatorio/medidas/BRIEF-K2.py`, que lê só o repositório (a M34). Sem travessões.*

## 0 · O que se mediu (02.10.2026, pelo guião `design/observatorio/medidas/BRIEF-K2.py`, o sítio em `a9509193`)

Os quadros declaram 21 cartões (`cartoes_declarados_nos_quadros`), e 4 deles têm um valor de variação sob um nome de nível (`cartoes_com_variacao_sob_nome_de_nivel`): a taxa de atividade, o custo unitário do trabalho, os preços da habitação e a taxa de câmbio efetiva real. A linha da disparidade de emprego entre sexos escreve a unidade «% da população» (`unidade_da_disparidade_de_emprego`), que é a etiqueta do Eurostat para uma diferença entre duas taxas. Há 2 linhas cujo valor tem menos casas decimais do que o excerto da fonte (`linhas_com_menos_decimais_do_que_a_fonte`): o fluxo de crédito às empresas e os jovens nem-nem. As leituras dos estudos no índice e nas fichas têm 11 ocorrências de três termos por explicar (`frases_das_leituras_com_termos_por_explicar`): as designações de pelouros, as localizações de projeto vencidas e «atuarialmente».

## 1 · O que os leitores viram

O diretor e os amigos (30.09): a leitura é difícil, sobretudo no telemóvel; um número sem o seu contexto não diz nada. As leituras a frio (N1, 30.09; E1, L2a e L2b, 01.10): a taxa de atividade mostra «2,6» com o nome de uma taxa, e o número é uma variação em três anos dita só na linha da unidade; o mesmo no custo unitário do trabalho; a diferença de emprego entre sexos lê-se como uma parte da população quando é uma diferença entre duas taxas; a quota nas exportações e o PIB por habitante levam termos por explicar; as linhas do desemprego escreviam «6» onde a fonte escreve «6.0» (corrigido no E0), e a dos jovens nem-nem escreve «8» onde a fonte escreve «8.0»; nos cartões dos estudos, «12 e 10 designações», «61,32 % em localizações de projeto vencidas» e «atuarialmente neutro» não dizem a um leitor comum o que são.

## 2 · O teste de aceitação, dito antes

Feito quer dizer: em cada cartão de medida das páginas de assunto, da União e dos lugares, a 390 px, a ordem visível é o nome, o valor com a unidade, a comparação (a referência e de que lado o valor está) e só depois a definição, dobrada numa linha que se abre sem guião e que diz «o que é este número»; o nome de um cartão cujo valor é uma variação diz-o no nome («Taxa de atividade, variação em três anos»), nas duas línguas; a diferença de emprego entre sexos diz, no cartão, que é uma diferença entre duas taxas, em pontos percentuais, e a etiqueta do Eurostat fica no recibo como a fonte a escreve; a quota nas exportações e o PIB por habitante levam a explicação em palavras comuns na primeira vez; todos os valores do sítio seguem um só formato (o separador de milhares, a vírgula decimal, o espaço antes do símbolo), conferido por uma célula com planta; as 2 linhas com menos casas decimais do que a fonte corrigem-se pelo mecanismo (uma entrada `correcao` cada, selada), o contador das correções sobe pelo mecanismo, e uma célula nova fecha a construção se uma linha sem derivação escrever menos casas decimais do que o seu excerto; as frases das leituras dos estudos dizem o que são as designações, as localizações vencidas e a neutralidade atuarial, em palavras comuns, sem mudar os números; os três portões a 0; as capturas de uma página de assunto, da página da União, da ficha de Évora e do índice dos estudos nas cinco larguras e nas duas edições; o relatório com o `medidas.json`.

## 3 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **A anatomia do cartão a 390 px** | `src/components/CartaoDaMedida.astro` e os cartões do lugar e da União: a ordem visível é o nome, o valor com a unidade, a comparação, a definição dobrada (`<details>` com `<summary>` «O que é este número», sem guião); a 768 px e acima a definição pode ficar à vista se couber, por decisão escrita no relatório; a identidade (tipos, cores, o selo do recibo) não muda | as capturas a 390 com a ordem; a célula que lê a ordem no documento |
| 2 | **Os nomes que dizem a variação** | Os 4 cartões do §0 ganham o nome com a variação e o período («variação em três anos»), nas duas línguas, lidos das declarações em `src/data/figuras.mjs`; o veredicto e as frases que os citam acompanham | 0 cartões com variação sob nome de nível |
| 3 | **A diferença de emprego entre sexos** | O cartão diz «diferença entre a taxa de emprego dos homens e a das mulheres, em pontos percentuais»; a unidade da linha fica como a fonte a escreve; a definição declarada (`DEFINICOES_DAS_MEDIDAS` ou onde viva) diz as duas coisas | a frase no cartão e no recibo |
| 4 | **Os termos por explicar** | A quota nas exportações e o PIB por habitante (e os outros que a célula de linguagem simples apontar): a definição dobrada diz o que são em palavras comuns | as frases |
| 5 | **Um só formato de número** | Uma célula nova (`tests/inicio/formato-dos-numeros.mjs`) lê todos os valores rendidos das páginas construídas e exige o formato da casa: milhares com espaço fino, vírgula decimal, o espaço antes de «%» e do símbolo; os desvios corrigem-se na formatação, nunca nos valores das linhas; com planta | a célula a 0 com a planta a morder |
| 6 | **As casas decimais** | As 2 linhas do §0 corrigem-se pelo mecanismo do E0 (a entrada `correcao`, a história selada, o contador pela `atualizacao`); a célula nova fecha a construção se uma linha sem derivação escrever menos casas decimais do que o seu excerto, com planta | as duas linhas corrigidas; a célula |
| 7 | **As leituras dos estudos** | `src/data/leituras.mjs`: as frases com os três termos ganham a explicação (o que é uma designação de pelouro; o que é uma localização vencida, o prazo que passou; o que quer dizer neutro do ponto de vista atuarial), sem mudar os números nem a origem registada de cada frase | 0 ocorrências sem explicação |
| 8 | **O relatório** | `design/especime-v3/medicoes/k2-2026-10-02/LEIA-ME.md` com a tabela deste mandato, as decisões em vigor nos ficheiros tocados (`decisoes-em-vigor.py`; a §1.127 e a T10 da ordem da habitação ficam em vigor; a §1.124 e a §1.140 sobre a União; a §1.130 sobre «melhor» e «pior»), as plantas, os commits, os portões, o custo com a origem dita; o `medidas.json`; as capturas em `design/especime-v3/capturas/k2-2026-10-02/` | completos |

## 4 · O que não se faz

Nenhum valor de linha muda fora do mecanismo. Nenhuma mudança na identidade (§1.86). Nenhuma mudança na ordem dos blocos da primeira página nem nos cartões que vivem nela (§1.143). Nenhum `push`.

## 5 · As decisões do lugar de direção que este brief fixa

1. A definição dobra-se com `<details>`, como as listas de «Lugares»: funciona sem guião e não custa a quem não a quer.
2. O nome do cartão diz a variação; a linha da unidade continua a dizer o período.
3. A etiqueta de uma fonte fica como a fonte a escreve no recibo; o que o leitor vê no cartão é a frase da casa que diz o que o número é.

## 6 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos; os três portões a 0 na cabeça final pela tranca (`sh scripts/leituras/portoes.sh`); a regra de paragem; o relatório escrito também quando se para a meio; nenhum caminho da máquina nem o nome do utilizador em ficheiro nenhum; o custo em símbolos e segundos.
