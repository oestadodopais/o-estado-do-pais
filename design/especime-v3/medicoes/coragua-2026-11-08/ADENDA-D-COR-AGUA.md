# Adenda D ao mandato COR-AGUA: as correções da leitura a frio (08.11.2026)

Acrescenta: frases
Frases: coragua/FRASES-COR-AGUA-d.json
Medidas: medidas-adenda-d-coragua.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura a frio do Opus sobre 61689dfcb (a corrida inteira com 68 passos a zero). Quarta retoma, a mesma sessão e as mesmas worktrees. Os achados reais estão no §0, cada um conferido por este lugar nas cópias guardadas. Duas das frases que a leitura apanhou são deste lugar: a conclusão do rácio e o nome da eficiência no registo.*

## §0 Medido

- **Os corpos das linhas do motor.** As linhas dos dois livros da água no motor citam nove cópias pelo `sha256`. Cinco estão no git desde a adenda C. Quatro não estão, e os números delas chegam à página:
  - o boletim semanal das albufeiras da APA de 8 de novembro de 2026;
  - o resumo não técnico dos planos de bacia do terceiro ciclo;
  - o relatório e contas de 2025 da EDIA;
  - o relatório de monitorização da seca de agosto de 2026 do GPP.
  
  A citação da EDIA na secção dos preços e o escalonamento dos consumos acima da dotação vêm do simulador de tarifários da EDIA (`edia-simulador-tarifarios.html`, na pasta das cópias), que nenhuma linha cita e que não está alojado.
- **A ERSAR.** Na p. 410 do RASARP de 2025 (volume 1), o 13,48 é o rótulo de dados da barra de 2024 do abastecimento de água, na imagem da Figura 553. O valor não está na camada de texto do PDF; este lugar leu-o na imagem. O texto dessa folha diz o que a figura mede: «o nível médio de encargos tarifários mensais suportado pelo utilizador final para um consumo de 10 metros cúbicos». A nota 87 diz que, desde 2022, os valores incluem o IVA e as taxas ambientais. O anexo XII (por concelho) não traz a média do Continente.
- **O edital** (Anexo II, p. 5, lido com a disposição da página): alta pressão, valor médio 0,0706, vazio e super vazio 0,0692, cheia 0,0689, ponta 0,0847. O intervalo «0,0689 a 0,0847 consoante o período» está certo e fica.
- **O simulador da EDIA:** «De 100% até 110% do volume autorizado – aplicação de Preço Base + 150%; De 110% até 125% do volume autorizado – aplicação de Preço Base + 400%». O estudo publicado dava a conversão, 2,5 e 5 vezes, atribuída à EDIA. «Volume autorizado» é a palavra da EDIA e fica.
- **A Gulbenkian.** O estudo diz que pediu «ao C-Lab para que conduzisse esta investigação» (p. 11), e dá o inquérito como «Investigação C-Lab (2019) · Inquérito telefónico» (p. 22). A Ipsos APEME adquiriu e analisou a base de dados da amostra (p. 22). As duas edições de «Água não faturada» davam o inquérito à Ipsos APEME.
- **A conferência das atribuições do motor**, reproduzida por este lugar com a versão de cf5bd5b e a da cabeça 63276ad, sobre um livro com o 71 atribuído à Gulbenkian e o 2019 atribuído à Gulbenkian:
  - «O recenseamento do INE mostra a falta de contadores. Hoje, 71% dos agricultores não têm contador.»: antes recusava, agora passa;
  - uma legenda «Fonte: INE» acima de um parágrafo cujo único número é o 71%: antes recusava, agora passa;
  - «Um inquérito do INE feito em 2019 mostrou a falta de contadores.»: antes recusava, agora passa;
  - «Segundo o INE, 71% dos agricultores não têm contador.»: recusa nas duas;
  - «Segundo a Gulbenkian, 71% …» e «Um inquérito da Gulbenkian feito em 2019 …»: passam nas duas.
  
  A reescrita da adenda B enfraqueceu uma conferência que protege uma fonte, e o mandato não a pedia.
- **A exceção da voz da entrada do registo** (`correcao_textual`) não tem prova de que ainda recusa.
- **A lista declarada acima** tem treze entradas. São oito REESCREVE: seis em «Onde está a água» e duas em «Água não faturada», nas duas edições. As outras cinco são FICA que repetem as da lista da COR-AGUA, porque a camada 0 as pede. As seis REESCREVE de «Onde está a água» são:
  - a conclusão do rácio, que juntava duas medidas sem dizer o que cada uma inclui;
  - o exemplo da circularidade, que usava 75 %;
  - o escalonamento.
  
  A camada 0 deu zero sobre o `dist/` da cabeça.

## §1 O que fazes

1. **A lista nas páginas.** Cada REESCREVE fica com a `nova` como está escrita, nas duas edições. Nas linhas do livro que citam o estudo da Gulbenkian, o `attributed_to` diz Gulbenkian e C-Lab, e não Ipsos. A lista aplicada (`--aplicada`) dá zero na camada 0. Os números que a lista muda ou acrescenta resolvem nas linhas do livro do motor, como os outros números do estudo: o 76 do exemplo da circularidade, e o 150 e o 400 do escalonamento. As linhas do escalonamento passam a ter esses valores, com o excerto do simulador.
2. **Os corpos.** As quatro cópias e o simulador entram no git do motor em `content/01 Energy Water and Climate/source/agua-2026-11-08/`, como na adenda C, cada um com o seu `.pedido.json` feito do `fetch-log.tsv`. Só os campos que o registo tem; os outros a `null`.
3. **A linha da ERSAR**, a do motor e `coragua-ersar-encargo-mensal-2024`, nas duas formas:
   - **o excerto:** o texto da p. 410 como a fonte o escreve, isto é, a frase que diz o que a Figura 553 mede e o título da figura;
   - **o localizador:** diz que o 13,48 é o rótulo de dados da barra de 2024 do abastecimento de água, na imagem da figura, sem camada de texto.
   
   Se uma conferência exigir o valor dentro do excerto, segue a forma que a casa já usa para um valor lido numa imagem; se não houver forma da casa, paras e dizes.
4. **O registo das correções**, letra por letra:
   - `onde-esta-a-agua` pt «O rácio entre o encargo médio de um utilizador doméstico por metro cúbico e a tarifa do Alqueva para a rega passou de 27 a 53 vezes para 19 a 35 vezes, com o nível médio de encargos da ERSAR de 2024 e as tarifas do Alqueva de 2026, que a edição inglesa dizia não encontradas e estão no edital da EDIA; o encargo de conservação passou aos valores do mesmo edital; a auditoria do Tribunal de Contas de 2016 entrou na edição inglesa; o total nacional de barragens do resumo dos planos de bacia entrou na edição portuguesa; os valores de um boletim semanal da APA que já não se consegue ler saíram, com as marcas de valor por confirmar; a eficiência na adução e distribuição dos aproveitamentos hidroagrícolas passou ao valor da DGADR, 76 %, sem a média ponderada de cerca de 95 %; e os 71 % de agricultores sem contador passaram a dizer de que inquérito são e a quem se aplicam.»
   - `onde-esta-a-agua` en «The ratio between a household's average charge per cubic metre and Alqueva's irrigation tariff went from 27 to 53 times to 19 to 35 times, using ERSAR's 2024 average charge level and the 2026 Alqueva tariffs, which the English edition said had not been found and are in EDIA's edital; the conservation charge moved to the values in the same edital; the Tribunal de Contas' 2016 audit entered the English edition; the national dam total from the river basin plans' summary entered the Portuguese edition; the values from an APA weekly bulletin that can no longer be read came out, with the markers of values still to be confirmed; conveyance and distribution efficiency in the irrigation schemes moved to DGADR's figure, 76 %, without the weighted average of about 95 %; and the 71 % of farmers without a meter now say which survey they come from and whom they cover.»
   - `agua-nao-faturada` pt «A eficiência na adução e distribuição dos aproveitamentos hidroagrícolas passou ao valor que a DGADR publica, 76 %, sem a média ponderada de 83 a 85 % que era uma conta deste estudo; os 71 % de agricultores sem contador passaram a dizer que vêm de um inquérito da Gulbenkian feito em 2019 a quem rega explorações de 5 hectares ou mais, e não de 2021; e os valores do PRR passaram a ter a data do instantâneo de onde vêm, com os dados da edição inglesa iguais aos da portuguesa.»
   - `agua-nao-faturada` en «Conveyance and distribution efficiency in the irrigation schemes moved to the figure DGADR publishes, 76 %, without the 83 to 85 % weighted average that was this study's own calculation; the 71 % of farmers without a meter now say they come from a Gulbenkian survey carried out in 2019 among those who irrigate holdings of 5 hectares or more, not from 2021; and the PRR values now carry the date of the snapshot they come from, with the English edition's data the same as the Portuguese edition's.»
   
   A exceção da voz da entrada `agua-nao-faturada` segue a frase nova, com o mesmo âmbito. As frases do registo não trazem números novos; o «2026» do encargo de conservação saiu, porque o seu selo ia para a linha da tarifa.
5. **A conferência das atribuições** (`core/attributions.py`) volta a recusar o que recusava em cf5bd5b, sem perder o que a adenda B lhe ensinou de certo:
   - quando a frase e o bloco do número não nomeiam nenhuma entidade, procura na janela antiga (160 caracteres de cada lado, através dos blocos) e recusa uma entidade conhecida diferente da declarada;
   - a leitura de um ano como data (depois de `em`, `in`, `de` e as outras palavras da regra) vale só para as linhas cujo valor é um ano. Uma linha cujo valor é uma quantidade de quatro algarismos continua conferida;
   - as linhas de ano com `attributed_to` que a proximidade não pode conferir saem escritas na saída, linha a linha, como não conferidas, e nunca em silêncio.
   
   Os casos de teste são os sete do §0, com os resultados de cf5bd5b, e mais um que recusa pelo 71: `Um inquérito do INE feito em 2019, em que 71% dos agricultores não tinham contador.` Os doze testes da adenda B continuam a passar. Se um caso de cf5bd5b e um teste da adenda B não couberem juntos, paras e dizes quais. O `core.gate` corre-o este lugar.
6. **A exceção da voz do registo:** uma prova de que recusa a frase com a entrada mudada, a frase fora da entrada e a frase noutra rota.
7. **A nota `limite`** de `design/observatorio/agua/PRR-graficos-2026-08-03.json` diz a data de agora (3 de agosto), e não a de 29 de julho conservada pela adenda B.
8. **O fecho:**
   - o build integral;
   - os testes do motor que a conferência das atribuições toca (`core.attributions_test`), e `check:pre-mandato`, `check:frases-reais`, `check:paridade`, `check:voz`, `check:formato`, `check:lugar`, `check:lingua`, `ledger:check`, `check:selos`, `check:edicoes`, `check:graficos`, `provar:eyetext` e `typecheck`;
   - a montagem do pacote com `PACOTE_ESTUDOS` e `PACOTE_MOTOR`, sem corpos em falta.
   
   O `core.gate` e a corrida inteira corre-os este lugar depois. Os commits levam o assunto a começar por `COR-AGUA`, no sítio e no motor, com `OEDP_GATE=adiado`. O relatório curto diz o que mudou para o leitor e cada código.

## §2 Quando paras

Como no §2 da adenda A, e no ponto 3 acima.

## §3 O fim

O ponto 8. Setenta e cinco minutos e cento e vinte chamadas, contando as dos ajudantes; sem ajudantes, salvo se um trabalho independente o justificar. Se não chegar, paras num commit limpo e dizes onde ficou.
