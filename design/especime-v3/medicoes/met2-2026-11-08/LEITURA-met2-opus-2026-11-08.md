# A leitura curta da MET2, 08.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 15 chamadas, sobre o pacote `pacote-met2-2026-11-08` (base f87512ab1, cabeça 319d5a6cd, `dist/` de 319d5a6cd). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| M1 | a porta do repositório volta ao Método português | 2 (Blocking) |
| M2 | o Método inglês diz que uma pessoa revê cada mudança antes de se publicar | 1 (Blocking) |
| M3 | a régua nova procura um endereço da organização que nunca existe (um hífen a mais) | 4 (Blocking) |
| M4 | a §1.235 carimba um resumo do Método que não é o do ficheiro | 5 (Major) |
| M5 | a primeira página ganha uma ligação ao repositório no rodapé | 3 (Blocking) |

Cinco plantas em cinco (com a hora dos ficheiros reposta pelas plantas). O achado 6 é a consequência das plantas no pacote.

**Os achados reais e a decisão.** Nenhum Blocking nem Major real. A MET2 aterra.
- **9 (Minor, para a HIG-6A):** a régua do repositório não vê as formas escapadas em JSON nem codificadas, `oestadodopais.github.io`, `raw.githubusercontent.com/oestadodopais`, nem os atributos `src`, `action` e o refresh de meta; a HIG-6A alarga-a, com plantas.
- **11 (Minor, editor):** a porta «A agenda» fica sozinha no fim da secção «Quando um número muda»; arrumar o Método numa passagem pequena.
- **12 (Minor, anterior a este bloco):** o recibo do Método inglês mostra «(o valor)» e «920,00 euros per month»; para a LANG1.
- **7, 8, 10, 13 (Minor):** números do relatório sem ficheiro; a razão da exceção de `check-lugar` não se lê no pacote; a linha da MET2 na fila desatualizada (sai nestes registos); as citações do recibo sem a cópia alojada (a AUD1).

## O relatório do leitor (condensado)

**Blocking.** 1. O Método inglês diz «a person reviews each change before publication» (`built/en/method/index.html:2`). 2. O Método português ainda abre o documento interno no GitHub (`built/metodo/index.html:2`). 3. O rodapé da primeira página portuguesa liga ao repositório (`built/index.html:8`). 4. No diff, a constante da régua nova tem um hífen a mais e não apanha o endereço real (`diff.patch:149`).

**Major.** 5. No diff, o carimbo da §1.235 não é o resumo verdadeiro de `src/data/metodo.mjs` (`diff.patch:30`). 6. Os códigos verdes não batem com as páginas construídas do pacote.

**Minor.** 7. Números do relatório sem ficheiro. 8. A razão da exceção de `check-lugar` não se confere no pacote. 9. Lacunas da régua fora do âmbito literal do mandato. 10. A linha da MET2 na fila desatualizada. 11. A porta «A agenda» sozinha no fim da secção. 12. O recibo do Método inglês com a glosa portuguesa e a vírgula decimal. 13. As citações do recibo sem a cópia alojada.

**O que está bem.** 17 de 19 pedaços do diff batem com os ficheiros copiados (os dois que não batem são as plantas 4 e 5); o Método inglês só com a agenda; a constante e a importação saíram; o carimbo da política é o resumo verdadeiro; o oráculo do Método ficou mais estrito, com plantas que mordem; os ficheiros de licença das letras poupados por construção; a régua entra na saída vermelha do `gate:html`; as frases do Método português iguais à lista fechada.
