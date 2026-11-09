# O plano em vigor: o risco de um erro chegar ao ar perto de zero, depois o custo e a rapidez (08.11.2026)

*Escrito pelo lugar de direção (Claude Opus 5.5) a 08.11.2026, pela palavra do financiador (05:01 e 05:14 UTC; a §1.234). É o documento que uma sessão nova, ou a mesma depois de uma compactação, lê primeiro para saber o que se está a fazer e porquê. Atualiza-se a cada bloco que aterra (o estado de cada linha), nunca se reescreve em silêncio.*

## O objetivo, nas palavras do financiador

- «we should keep building machinery as long as it improves anything on our website, either decreases the risk of errors, which is the most important. So we should aim for a moment where we have enough machinery and capabilities on models that reduces the risk of an error go live to zero.» Sem isto o sítio não é viável.
- Depois disso, e só depois: o custo e a rapidez de publicar, sempre a melhorar.
- Camadas como o queijo suíço: guiões e modelos com buracos diferentes, para que o que passa numa camada não passe na seguinte.
- O que publicamos escolhe-se pelo peso na vida das pessoas, com pensamento crítico, não pelo que os outros cobrem.
- O «go» para partilhar com leitores (§1.232): a auditoria limpa, os Major conhecidos corrigidos, e a leitura do financiador.

## O diagnóstico (medido a 07 e 08.11.2026)

- Os erros que chegaram ao ar (as quatro correções) foram todos frases (atribuições, causas ditas como factos), nenhum número: os números têm uma camada estrutural (o livro-razão), as frases não.
- A VOZ-2A custou 19 pontos em dez passagens; as nove adendas corrigiram o mandato deste lugar, e cada volta custou 60 a 90 minutos de custos fixos (a retoma do construtor, o build de 9 838 páginas, o gate do motor, as dirigidas, a leitura curta).
- A 08.11 achou-se, por medida, uma edição inglesa possivelmente atrasada («Onde está a água»): um erro de facto entre línguas que nenhuma camada via.

## As camadas (o queijo suíço), por ordem do risco que tiram

| Camada | O que é | Estado |
|---|---|---|
| 0 | Cada frase que este lugar prescreve passa pelos guiões antes de o construtor a ver (a régua da voz, os números, os pares das duas línguas, os quantificadores e as asserções do motor) | por fazer (HIG-6a); à mão desde 08.11 |
| 1 | Guiões das propriedades formais: números no livro-razão (em uso), paridade dos números pt/en (por fazer, AUD1-1), pares das duas línguas (`conferir-pares.mjs`, só VOZ-2A), citações iguais à cópia alojada, datas, ligações, nenhuma ligação ao repositório (MET2) | em parte |
| 2 | As frases sobre fontes com proveniência como os números: cada atribuição, causa ou afirmação aponta para o excerto; um guião confere o excerto na cópia alojada; um modelo de outra família julga se a frase diz o que o excerto diz | por desenhar (CAM2); a AUD1 é a primeira passagem |
| 3 | A leitura a frio por outra família, com cinco plantas | em uso |
| 4 | Uma segunda família numa amostra (Gemini) | por ligar |
| 5 | A conferência no ar depois da aterragem (bytes iguais ao `dist/` conferido, a lista no estado prescrito) | feita à mão a 08.11; por guião (HIG-6a) |
| 6 | O registo público das correções | em uso |

Cada camada mede a sua taxa de captura com plantas; o risco residual de cada bloco reporta-se ao financiador.

**A medida de cada bloco de conteúdo, a partir da COR-AGUA** (a primeira a passar pela camada 0): as voltas do construtor, os pontos do Codex, as horas do mandato ao ar, e o que cada camada apanhou (a camada 0 antes do lançamento, as conferências, a leitura a frio, a conferência no ar), ao lado da VOZ-2A (dez passagens, 19 pontos, cerca de 28 horas, sete das nove adendas na classe que a camada 0 hoje recusa).

## Os blocos, as faixas e o calendário estimado

Uma construção de cada vez na máquina (a faixa do construtor); o trabalho deste lugar (guiões, medidas, mandatos) e as leituras correm ao lado (a faixa da direção).

| Bloco | O que entrega | Faixa | Depende de | Estimativa | Estado |
|---|---|---|---|---|---|
| MET2 | o Método sem a porta para o GitHub; a régua de nenhuma ligação ao repositório | construtor | — | no ar a 08.11, de manhã | construída a 08.11 (05:07–05:23 UTC, 0 pontos); as dirigidas a zero; a leitura curta cinco plantas em cinco, nenhum Blocking nem Major real; **no ar a 08.11.2026 às 06:52:12 UTC** (`main` em 96ce315c1; o Método e a primeira página iguais byte a byte ao `dist/` conferido, nas duas línguas) |
| AUD1-1 | o guião da paridade pt/en dos números nos estudos bilingues, com plantas | direção | — | 08.11 | feito na sessão (`paridade-numeros.mjs`, seis plantas em seis; o resultado em `paridade-numeros-2026-11-08.json`): paridade exata nos estudos de Évora, no Orçamento de 2027 e na economia; três estudos com números diferentes entre as línguas; entra no repositório e na cadeia com a COR-AGUA |
| COR-AGUA | a correção dos dois estudos da água (o rascunho do texto em `.claude/sessao-2026-10-27/COR-AGUA-texto-rascunho-2026-11-08.md`; as fontes e a sua leitura em `_fontes-agua-2026-11-08/RELATORIO-fontes.md`): «Onde está a água» nas duas edições, lida na fonte, com «corrigido» no registo; e «Água não faturada» (a eficiência da rega «83–85 %», que é uma derivação nossa, e o «40 % do volume nacional»); «A casa em Portugal e na Europa» sem erro de facto (a glosa inglesa de uma citação), exceção declarada para sempre | construtor | HIG-6A | 09–10.11 | fontes lidas a 08.11 (o agente de pesquisa Opus; conferido por este lugar nas cópias guardadas em `_fontes-agua-2026-11-08/`, fora do repositório): em «Onde está a água», o rácio da agricultura «27 a 53×» em português é o antigo (com 1,61) e o certo é 19–35× (1,348 ÷ 0,0706 e ÷ 0,0382); o inglês diz que as tarifas de 2026 não foram encontradas, e estão no edital da EDIA de 2 de junho de 2026; a auditoria do Tribunal de Contas de 2016 omitida no inglês; a tarifa de 2017 «substituída» quando a EDIA diz «complementada»; as frases «Os valores base não foram obtidos» nas duas edições; o gráfico português com 1,61; linhas do livro-razão com a fonte errada (os valores de 2026 creditados ao despacho de 2017). Um erro de facto no ar desde agosto: o primeiro bloco de conteúdo depois da HIG-6A · 08.11.2026: construída em onze passagens do Codex (a primeira e as adendas A a J; 27 pontos, dos quais 16 nas adendas A e B com três ajudantes do construtor); a corrida inteira da cabeça 61689dfcb com 68 passos a zero; a leitura a frio pelo Opus e duas leituras curtas, cinco plantas em cinco em cada uma (a frio pelo Opus a xhigh e cinco leituras curtas, cinco plantas em cinco em cada uma (com continuações); os achados reais corrigidos nas adendas D a J; os que ficam abertos nas questões COR-AGUA-1 a 4, na GARGALOS e na lista dos Minor); a aterrar · no ar a 09.11.2026 às 00:20 UTC (`main` em f362f5ccd), conferido no ar por este lugar |
| MET3 | o Método a dizer as salvaguardas novas que já correm (as duas edições com os mesmos números, conferidas por um programa em cada construção; as frases da direção conferidas por programas antes de construir), e a contagem das conferências igual à cadeia; a camada 2 só quando correr | construtor (os textos governados e a decisão por este lugar) | COR-AGUA | depois da COR-AGUA | por mandatar (a pergunta do financiador de 08.11.2026, 09:54 UTC) |
| HIG-6a | a camada 0 no `pre-mandato.py` (frases, pares, quantificadores), o teto de duas voltas, o `ledger:check` nos registos, a conferência no ar por guião, o prefixo do bloco nos commits deste lugar, as plantas sem mudar a hora | construtor | — | 09–10.11 | por mandatar |
| VOZ-2B | os onze estudos sem a autorreferência, com a lista completada (medida a 08.11: cerca de quinze entradas e os pares) | construtor | COR-AGUA, HIG-6a | 10–11.11 | medido |
| DIA1 | o correio diário «Estado do País daily content»: os feeds dos meios de referência na vigilância, a parte de cada tema medida por guião, os temas escolhidos com a razão e o ângulo crítico | direção, depois construtor | a vigilância a correr cada dia | primeiro correio 10–11.11 | por desenhar |
| HIG-6b | o caminho curto: uma frase prescrita sem número aplicada por guião, build e conferências só nas páginas tocadas, alvo de 15 minutos por correção | construtor | HIG-6a | 11–13.11 | por mandatar · acrescentado a 08.11.2026 (a COR-AGUA): o pré-mandato lista o que pede uma linha nova; o lançador conta os ajudantes do construtor; a corrida `portão` salta em `main` quando o sha já tem corrida verde no ramo; o Chromium em cache nas partes do GitHub; a medir: a corrida inteira antes da leitura a frio no GitHub; por confirmar se existe uma vigia da deriva das fontes citadas |
| CAM2 | a camada 2, permanente: um registo de proveniência por frase com afirmação (a frase pt e en, o excerto, a cópia e o sha256), exigido pela construção; um guião que confere o excerto na cópia; um juiz de outra família, com plantas; a varredura noturna | direção, depois construtor | COR-AGUA | desenho a 08.11; construção cerca de 10–12.11 | desenhado (`.claude/sessao-2026-10-27/CAM2-desenho-2026-11-08.md`) · acrescentado a 08.11.2026 (a COR-AGUA): o juiz de outra família lê as frases do mandato contra as cópias antes de o construtor as aplicar (na COR-AGUA, três dos erros que as leituras apanharam eram frases deste lugar, e cada um custou uma passagem); a régua de que cada «instantâneo de <data>» resolve num ficheiro guardado dessa data cujas somas são os valores impressos (COR-AGUA-2); a M83 no `ledger:check`, e não só no pacote · 09.11.2026: partida em três passagens, cada uma com a sua leitura a frio e a sua aterragem: a CAM2-A (o detetor das frases com afirmação, o registo no livro-razão, a cobertura por régua com uma lista que só encolhe, e a M83 no `ledger:check`; só guiões; mandato escrito a 09.11, medido no `dist/` de f362f5ccd), a CAM2-B (o juiz de outra família, com plantas, também sobre as frases de um mandato antes do construtor) e a CAM2-C (a régua dos instantâneos datados, a COR-AGUA-2). O Codex: o financiador disse a 09.11 que se usa a semana inteira e que há duas reposições gratuitas (expiram a 30.11 e a 01.12), ocasionais; o regime permanente dimensiona-se sem elas |
| AUD1 | a auditoria dos 18 estudos e dos itens, lote a lote (cerca de doze), pela camada 2 | leituras | CAM2 | 13–21.11 | desenhada |
| VOZ-3 | a autorreferência sem a condição da negação, no sítio inteiro | construtor | VOZ-2B | 14–17.11 | por mandatar |
| HIG-6c | os níveis de risco por guião, o travão quando uma correção de um facto aterra, a leitura a frio em paralelo | construtor | HIG-6b | 16–19.11 | por mandatar |
| IT0, IT-ISP1 | a cadeia geral dos itens; o primeiro item diário | construtor | HIG-6a | 17–21.11 | por mandatar |
| «go» | a auditoria limpa, os Major corrigidos, a leitura do financiador | — | AUD1, VOZ-2B, VOZ-3, EV4 | cerca de 24–28.11 | — |

As datas são estimativas deste lugar, não medidas: dependem do que cada medida achar e do uso (o Codex a 52 % da semana a 08.11, repõe a 12.11 às 18:25 UTC; o Claude repõe a 09.11 às 10:00 UTC).

**A ordem a partir de 08.11.2026, 09:56 UTC** (a pergunta do financiador sobre a camada 2): a camada 2 (CAM2) passa à frente da VOZ-2B e da HIG-6B, porque tira a classe de erro que já chegou ao leitor (as frases). A ordem: a HIG-6A aterra; a COR-AGUA; a CAM2 (desenhada por este lugar a partir de 08.11, construída a seguir, cerca de 10–12.11), permanente: um registo de proveniência por frase de atribuição, causa ou afirmação sobre uma fonte (a frase, o excerto, o sha256 da cópia), que a construção exige; um guião que confere o excerto na cópia; um juiz de outra família, com plantas, que confere o sentido (a medida, o período, a população, a atribuição, a causa); a AUD1 corre-a sobre todo o publicado, e depois uma varredura noturna sobre tudo o que está no ar; o Método ganha a frase quando correr. Depois a AUD1 (até cerca de 20.11), a HIG-6B (o caminho curto, antes do grosso das correções que a auditoria trouxer), a MET3, a VOZ-2B, a VOZ-3 e o resto; o «go» por volta de 24–28.11 (estimativas).

## Como retomar (depois de uma compactação ou numa sessão nova)

1. Este ficheiro (no repositório: `design/observatorio/PLANO-risco-zero-2026-11-08.md`; na sessão: `.claude/sessao-2026-10-27/`).
2. As §1.232 a §1.235 do `DECISIONS.md`; a `FILA.md`; a `GARGALOS.md`.
3. `.claude/sessao-2026-10-27/VOZ2B-medida-2026-11-08.md` (a VOZ-2B medida e o achado de «Onde está a água»).
4. O prompt no Desktop do financiador («depois de 08.11.2026»).
5. As worktrees vivas: `met2-2026-11-08` (a MET2), `voz2b-2026-11-08` (com o `dist/` de f87512ab1, para medir); no motor, `voz2-2026-11-07` (as fontes do estudo 14, para a AUD1 de Évora).
