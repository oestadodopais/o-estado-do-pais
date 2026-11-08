# Adenda I ao mandato COR-AGUA: o cartão da manchete, a conclusão em duas frases e os corpos do motor iguais (08.11.2026)

Acrescenta: frases
Frases: coragua/FRASES-COR-AGUA-i.json
Medidas: medidas-adenda-i-coragua.json

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da leitura curta das adendas G e H. Nona retoma, a mesma sessão. As dirigidas de eb5ac759e deram 22 passos a zero.*

## §0 Medido

- **O cartão da manchete** de «Onde está a água» (achado 6). Diz «mais por metro cúbico paga um agregado familiar do que um regante do Alqueva», e na linha da fonte «ERSAR 2024 · Despacho 3025/2017»; o mesmo na edição inglesa. Os valores do rácio vêm do Anexo II do edital de 2026, nas linhas dos blocos de rega.
- **A conclusão do rácio** (achados 7, 8, 11 e 15).
  - É uma frase de cerca de 75 palavras.
  - Não diz que a tarifa é a dos consumos até ao volume atribuído: o Anexo II põe o 0,0706 e o 0,0382 na coluna «Consumos até 100% do volume atribuído».
  - Na edição inglesa diz «the edital» sem o traduzir, e chama à taxa e à componente «water resources tax» e «conservation charge». A frase dos preços, na mesma página, diz «water-resources levy» e «conservation component».
- **Os corpos do motor** (achado 9). A adenda G chegou só a um dos três corpos do estudo no motor. `onde_body.html` (inglês) e `body_onde_pt.html` não têm a conclusão nova. O `body_onde_pt.html` diz ainda `2,5 vezes… 5 vezes` no escalonamento, onde o corpo inteiro diz `o preço base mais 150 %… mais 400 %`.
- **A ERSAR** (achado 10). A frase do estudo «com o IVA e a taxa de recursos hídricos» assenta na nota 87 da p. 410, que nenhum excerto traz: «Em 2022, há uma quebra de série na medida em que os valores apresentados passaram a incluir o IVA e a repercussão dos gastos com as taxas ambientais (Taxa de Recursos Hídricos e Taxa de Gestão de Resíduos).» O `excerpt_method` da linha nova diz «camada textual», e a camada textual tem «55387»; o excerto escreve «553⁸⁷», como a folha impressa.
- **A régua dos alvos** (achado 5). O comentário que a adenda H juntou em `tests/acessibilidade/alvos.mjs` diz `A área inteira a 390 px continua conferida`, e a régua não mede essa área: 14 dos 42 selos do registo ficam abaixo a 390 px (a questão COR-AGUA-4, que fica aberta).
- **A lista declarada acima:** duas REESCREVE (a conclusão, nas duas edições) e uma FICA. O cartão da manchete fica fora dos blocos que a camada 0 lê, e por isso as suas frases vão no §1, letra por letra.

## §1 O que fazes

1. **A lista nas páginas** e nos três corpos do estudo no motor. A lista aplicada (`--aplicada`) dá zero na camada 0. Os números não mudam.
2. **O cartão da manchete**, letra por letra, nas fontes do sítio e nos corpos do motor:
   - pt: a frase passa a «mais por metro cúbico paga um agregado familiar do que um regante dos blocos de rega do Alqueva», e a linha da fonte a «ERSAR 2024 · Edital da EDIA de 2026»;
   - en: a frase passa a «more per cubic metre paid by a household than by an irrigator in Alqueva's irrigation blocks», e a linha da fonte a «ERSAR 2024 · EDIA 2026 tariff notice».
   
   O valor que o guião do cartão escreve não muda.
3. **Os três corpos do motor** dizem o mesmo que as fontes do sítio nas frases das listas D, G e I, frase a frase, nas duas línguas. O escalonamento diz «o preço base mais 150 %… mais 400 %» em todos.
4. **As duas linhas da ERSAR**, a do motor e `coragua-ersar-encargo-mensal-2024`: o excerto junta a nota 87, como a fonte a escreve. O `excerpt_method` diz que a chamada da nota vem em expoente, como na folha impressa, e que a camada de texto a cola ao número da figura.
5. **O comentário da adenda H** em `tests/acessibilidade/alvos.mjs` diz o que a régua confere: a 390 px, a área destes selos não é conferida, e a questão COR-AGUA-4 fica aberta. Nada mais muda na régua.
6. **O fecho:**
   - o build;
   - `check:pre-mandato`, `check:frases-reais`, `check:paridade`, `check:voz`, `check:formato`, `check:lingua`, `ledger:check`, `check:selos`, `check:edicoes`, `check:alvos` e `typecheck`.
   
   O `core.gate` corre-o este lugar. Os commits levam o assunto a começar por `COR-AGUA`, com `OEDP_GATE=adiado`.

## §2 Quando paras

Como no §2 da adenda A.

## §3 O fim

O ponto 6. Quarenta e cinco minutos e sessenta chamadas, contando as dos ajudantes; sem ajudantes.
