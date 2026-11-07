# A leitura a frio da VIG2, 07.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 22 chamadas pelo harness (18 pela contagem do leitor), 489 s, sobre o pacote `pacote-vig2-2026-11-07` (o diff do motor 983b19e..1c38c4a; o diff do sítio 72b39fa3f..238ab8afd, só o relatório e as medições). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| G1 | a verificação das partes aceita uma parte até 3 000 bytes | 3 |
| G2 | a verificação aceita qualquer numeração desde que haja uma linha «Parte» | 4 |
| G3 | a repartição deixa cair a segunda unidade (uma designação) sem aviso | 1 |
| G4 | a escrita apaga todas as partes numeradas do dia, incluindo as que acabou de escrever | 2 |
| G5 | o relatório dá à parte 3 da medida 2 516 bytes | 5 |

Cinco em cinco. Os achados reais:

- **O 6, respondido:** o `core.gate` do construtor deu 1 dentro da sandbox, em cinco suites que abrem servidores locais; o lugar de direção correu o `core.gate` fora da sandbox na cabeça 1c38c4a antes da aterragem do motor (o registo `GATE-motor-vig2.log`), e é esse o portão da aterragem (a regra 11).
- **O 8, medido:** o código anterior à VIG2 (983b19e) dá, sobre `vigilancia/indice/2026-10-12.json`, um resumo de 2 489 bytes com o sha256 `ace8d3246898…3328`, igual ao da referência congelada do teste.
- **O 7, o 9, o 10 e o 11, Minor:** as contagens 74 e 75 das provas descritas de forma que não bate; `limite_superior_simbolos` mede só a primeira parte quando há partes; `resumo_gravado` não vê uma parte a mais numerada acima da quantidade; os guiões do §0 do mandato estão no sítio (no commit base do diff, 72b39fa3f) e não no pacote.

Nenhum Blocking nem Major real: a VIG2 aterra com o gate verde.

## O relatório do leitor (condensado)

**Blocking.**
1. O diff do motor deixa a segunda designação fora de todas as partes (planta G3).
2. A `escrever_resumo` do diff apaga as partes que acabou de escrever (planta G4).
3. O diff alarga a verificação para 3 000 bytes (planta G1).
4. O diff reduz a verificação da numeração a «uma linha começa por Parte» (planta G2).

**Major.**
5. O relatório diz 2 516 bytes na parte 3; a medida é 2 486 (planta G5).
6. O `core.gate` está vermelho (código 1), e a razão dada não está no registo.

**Minor.**
7. As contagens 74 e 75 não batem com a descrição da segunda corrida.
8. Nada no pacote mostra como se produziu a referência congelada de 12.10.
9. Com partes, `limite_superior_simbolos` mede só a primeira.
10. `resumo_gravado` não vê partes a mais.
11. As medidas do §0 citam guiões que não estão no pacote.

**O que está bem:** o diff do sítio bate com as cópias; com o código copiado, o mínimo sintético tem 3 568 bytes e as partes [475, 2 480, 2 486], iguais às do pacote; as sete provas da VIG2 passam e cada uma morde; em 119 casos sintéticos de excesso, cada parte abaixo do limite e cada designação e cabeçalho exatamente uma vez; com o mínimo a caber, o resumo é byte a byte o antigo em 281 índices sintéticos; a escrita, o recibo e a limpeza das partes que sobram estão certos; uma linha sozinha acima do limite continua a recusar; nada mais da vigilância mudou.
