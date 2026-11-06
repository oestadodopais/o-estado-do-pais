# A quarta leitura curta do lote 4 (as adendas G, H e I da VOZ-1), 06.11.2026

*Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote `pacote-lote4-curta-g-2026-11-06` (base c0e2a3d4c, cabeça e `dist/` 5959498cf, com os recibos das nove linhas da União nas duas edições), lançada às 06:43 UTC e entregue às 06:49 UTC; 16 chamadas contra um orçamento de 16. **Cinco plantas em cinco**, registadas por sha256 em `pacote-lote4-curta-g-2026-11-06.plantas.json`: G2 é o achado 1, G1 o 2, G3 o 3, G4 o 4, G5 o 5. **Nenhum achado real Blocking ou Major.** Os Minor 6 (números do relatório sem ficheiro) e 7 (as cópias do relatório no pacote com caminhos temporários; as que entram no repositório saem sem eles) vão à higiene.*

Os achados:

1. (Blocking, planta G2) A linha inglesa de `divida-das-familias-2025-ue` sem a União, igual à de `divida-das-familias-2025`.
2. (Major, planta G1) A linha portuguesa de `divida-publica-2025-ue` com a União duas vezes.
3. (Major, planta G3) O diff de `scripts/marca-novo.mjs` com a janela de 0 a 8 dias contra os 0 a 7 da cópia e do `estudoNovo`.
4. (Major, planta G4) O diff de `scripts/medir-defeitos.mjs` a inventar a data pelo relógio quando falta o `version.json`.
5. (Major, planta G5) O diff da planta da marca nova com a forma do dia sem estudo novo atrás de `else if(false)`.
6. (Minor) Os números do relatório do construtor e as plantas dadas como passadas sem ficheiro no pacote.
7. (Minor) As cópias em maiúsculas dos relatórios G, H e I com caminhos temporários.

O que está bem, segundo o leitor: as 37 linhas de cada edição na sua língua, sem identificador repetido nem data repetida, e cada linha da União com o nome do recibo e a União uma vez, fora dos achados 1 e 2; a régua conta a União por linha, à parte da regra da composição; as duas plantas da União mordem; o `estudoNovo` intocado, e o teste das duas datas fixa a janela nos dias −1, 0, 7 e 8; a primeira página de 06.11 sem marca nas duas edições, que é o certo (29.10 + 8 dias); a régua da voz pede «novo» só quando há um estudo de 0 a 7 dias; nenhuma régua que protege um número, uma fonte ou uma pessoa tocada.

A pergunta do editor: «no, not as the pages stand in this package», pelos achados 1 e 2; «the other 35 lines in each edition read cleanly».
