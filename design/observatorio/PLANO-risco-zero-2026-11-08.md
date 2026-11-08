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

## Os blocos, as faixas e o calendário estimado

Uma construção de cada vez na máquina (a faixa do construtor); o trabalho deste lugar (guiões, medidas, mandatos) e as leituras correm ao lado (a faixa da direção).

| Bloco | O que entrega | Faixa | Depende de | Estimativa | Estado |
|---|---|---|---|---|---|
| MET2 | o Método sem a porta para o GitHub; a régua de nenhuma ligação ao repositório | construtor | — | no ar a 08.11, de manhã | construída a 08.11 (05:07–05:23 UTC, 0 pontos); as dirigidas a zero; a leitura curta cinco plantas em cinco, nenhum Blocking nem Major real; a aterrar |
| AUD1-1 | o guião da paridade pt/en dos números nos estudos bilingues, com plantas | direção | — | 08.11 | feito na sessão (`paridade-numeros.mjs`, seis plantas em seis; o resultado em `paridade-numeros-2026-11-08.json`): paridade exata nos estudos de Évora, no Orçamento de 2027 e na economia; três estudos com números diferentes entre as línguas; entra no repositório e na cadeia com a COR-AGUA |
| COR-AGUA | as duas edições de «Onde está a água», de «Água não faturada» e de «A casa em Portugal e na Europa» a dizer o mesmo facto, lido na fonte, com «corrigido» no registo | construtor | AUD1-1 (feito) | 09–10.11 | confirmado a 08.11: em «Onde está a água», o português diz «27 a 53×» e o inglês «19–35×» para o mesmo rácio (o inglês foi corrigido a 29.07 e o português não), e o inglês não tem as tarifas de 2026 que o português ganhou a 01.08; 10 blocos com números diferentes; «Água não faturada» e «A casa» com diferenças menores por ler. Erro de facto no ar: o primeiro bloco depois da MET2 |
| HIG-6a | a camada 0 no `pre-mandato.py` (frases, pares, quantificadores), o teto de duas voltas, o `ledger:check` nos registos, a conferência no ar por guião, o prefixo do bloco nos commits deste lugar, as plantas sem mudar a hora | construtor | — | 09–10.11 | por mandatar |
| VOZ-2B | os onze estudos sem a autorreferência, com a lista completada (medida a 08.11: cerca de quinze entradas e os pares) | construtor | COR-AGUA, HIG-6a | 10–11.11 | medido |
| DIA1 | o correio diário «Estado do País daily content»: os feeds dos meios de referência na vigilância, a parte de cada tema medida por guião, os temas escolhidos com a razão e o ângulo crítico | direção, depois construtor | a vigilância a correr cada dia | primeiro correio 10–11.11 | por desenhar |
| HIG-6b | o caminho curto: uma frase prescrita sem número aplicada por guião, build e conferências só nas páginas tocadas, alvo de 15 minutos por correção | construtor | HIG-6a | 11–13.11 | por mandatar |
| CAM2 | a camada 2: as frases sobre fontes com proveniência e o juiz de outra família | direção, depois construtor | AUD1-1 | 12–17.11 | por desenhar |
| AUD1 | a auditoria dos 18 estudos e dos itens, lote a lote (cerca de doze), pela camada 2 | leituras | CAM2 | 13–21.11 | desenhada |
| VOZ-3 | a autorreferência sem a condição da negação, no sítio inteiro | construtor | VOZ-2B | 14–17.11 | por mandatar |
| HIG-6c | os níveis de risco por guião, o travão quando uma correção de um facto aterra, a leitura a frio em paralelo | construtor | HIG-6b | 16–19.11 | por mandatar |
| IT0, IT-ISP1 | a cadeia geral dos itens; o primeiro item diário | construtor | HIG-6a | 17–21.11 | por mandatar |
| «go» | a auditoria limpa, os Major corrigidos, a leitura do financiador | — | AUD1, VOZ-2B, VOZ-3, EV4 | cerca de 24–28.11 | — |

As datas são estimativas deste lugar, não medidas: dependem do que cada medida achar e do uso (o Codex a 52 % da semana a 08.11, repõe a 12.11 às 18:25 UTC; o Claude repõe a 09.11 às 10:00 UTC).

## Como retomar (depois de uma compactação ou numa sessão nova)

1. Este ficheiro (no repositório: `design/observatorio/PLANO-risco-zero-2026-11-08.md`; na sessão: `.claude/sessao-2026-10-27/`).
2. As §1.232 a §1.235 do `DECISIONS.md`; a `FILA.md`; a `GARGALOS.md`.
3. `.claude/sessao-2026-10-27/VOZ2B-medida-2026-11-08.md` (a VOZ-2B medida e o achado de «Onde está a água»).
4. O prompt no Desktop do financiador («depois de 08.11.2026»).
5. As worktrees vivas: `met2-2026-11-08` (a MET2), `voz2b-2026-11-08` (com o `dist/` de f87512ab1, para medir); no motor, `voz2-2026-11-07` (as fontes do estudo 14, para a AUD1 de Évora).
