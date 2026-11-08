# A leitura curta da adenda F da HIG-6A, 08.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 15 chamadas, sobre o pacote `pacote-hig6a-curta-f-2026-11-08` (base 4ec3181e4, cabeça e1818b22d, `dist/` de e1818b22d). Condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão

| Planta | O que plantou | Achado |
|---|---|---|
| F1 | uma FICA volta a nomear por fragmento | 1 (Blocking) |
| F2 | a presença volta a procurar só no texto sem as etiquetas | 3 (Blocking) |
| F3 | o ciclo dos pares volta a procurar a frase sem as etiquetas | 2 (Blocking) |
| F4 | a repetição nos casos reais aceita qualquer número de quantificadores | 4 (Major) |
| F5 | o relatório diz cinco pares em falta na VOZ-2B | 5 (Major) |

Cinco plantas em cinco. **Nenhum Blocking nem Major real: a HIG-6A aterra.** Os Minor: 6 (uma `frase` com etiquetas de fonte mede doze carateres com as etiquetas e pode nomear pela projeção sem elas, mais curta; inferido do código, não corrido; para a HIG-6B), 7 (as contagens fixadas da VOZ-2B não distinguem a procura com etiquetas da antiga; só a planta sintética o faz), 8 (números dos relatórios sem ficheiro), 9 (na lista aplicada, uma `nova` em fragmento nomeia a frase que a contém, e a voz confere só o fragmento; o `check:voz` da página cobre-o), 10 (as citações das páginas carregadas no pacote não se conferem sem as fontes; as notas antigas de «Onde está a água» falam do próprio estudo: a COR-AGUA tira-as).

**O que está bem:** as quatro procuras usam a mesma função com e sem etiquetas; a planta da REESCREVE com etiqueta num estudo bilingue recusa sem o gémeo e passa com ele; a FICA «nesta página» não nomeia a frase maior; o limite dos doze carateres provado nos dois sentidos; a VOZ-2B fixada (voz 0, números 0, 28, presença 0, os sete pares, as quinze); os caminhos de saída inalterados; o `verify` intacto.
