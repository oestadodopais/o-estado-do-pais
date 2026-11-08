# A leitura curta da adenda I da VOZ-2A, 08.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 16 chamadas pelo harness (uma acima do orçamento de 15), 376 s, sobre o pacote `pacote-voz2a-curta-i-2026-11-08` (base bae686fed, cabeça 661665bd8, `dist/` de 661665bd8; o motor de e64065a a cf5bd5b). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| I1 | a etiqueta inglesa do documento do orçamentado volta a dizer que a ligação é do projeto | 1 (Blocking) |
| I2 | a etiqueta portuguesa da página do orçamentado volta a ter a oração da fonte da tabela | 2 (Blocking) |
| I3 | as transferências de capital cofinanciadas de 2025 passam de 1 087 287 para 1 078 287 euros numa frase do documento português | 3 (Blocking) |
| I4 | o código de saída da conferência dos pares deixa de contar as mudanças fora da lista | 4 (Major) |
| I5 | a página inglesa do orçamentado diz que o ano por assinar é «o único» facto de governação a reter | não achada |

**Quatro plantas em cinco.** A planta falhada é uma palavra mudada numa frase de uma página construída, sem número. Este lugar cobriu a classe por guião sobre o `dist/` real, que não tinha plantas: o texto das quatro páginas do orçamentado (os dois documentos e as duas páginas), bloco a bloco, da cabeça da adenda H à da adenda I, tem exatamente duas diferenças, as duas etiquetas que a adenda manda mudar; e o leitor conferiu cada pedaço do diff contra os ficheiros copiados (77 de 78 no sítio, o 78.º é a planta I4; 16 de 16 no motor). A falha conta na medida da qualidade da leitura.

**Os achados reais e a decisão.** Nenhum Blocking nem Major real numa página. A VOZ-2A aterra.
- **5 e 6 (Major, sobre a conferência dos pares):** emparelha pela posição e não pelo conteúdo, e não confere com a lista um bloco acrescentado nas duas línguas. A conferência é uma rede por baixo das leituras, não a única prova; as duas falhas ficam na HIG-6 (o Minor 101 e a GARGALOS.md), com o conteúdo de cada par.
- **7 (Minor):** as plantas novas provam as funções e não a ligação ao resultado final; a HIG-6.
- **8 (Minor):** números do relatório sem ficheiro.
- **9 (para a VOZ-3):** a oração da leitura «é nossa» / «is ours», nas duas línguas por igual.

## O relatório do leitor (condensado)

**Blocking.** 1. O documento inglês do orçamentado imprime «the connection is ours»; as fontes copiadas não o têm (`built/en/studies/evora-orcamentado-pago-devido-2025/document/index.html:295`). 2. A página portuguesa do orçamentado imprime «(inferência; a tabela é da fonte)»; o registo copiado diz «(inferência)» (`built/estudos/evora-orcamentado-pago-devido-2025/index.html:4`). 3. O documento português imprime «€1 078 287» na linha `cofinanciados-capital-2025`; todos os outros lugares dizem €1 087 287 (`built/estudos/evora-orcamentado-pago-devido-2025/documento/index.html:254`).

**Major.** 4. O `diff.patch` e o guião copiado discordam no código de saída: o diff tira `fora` (`diff.patch:60`). 5. A conferência dos pares não apanha uma oração deixada numa língua dentro de um bloco que mudou nas duas por outra razão. 6. Um bloco acrescentado nas duas línguas sem entrada na lista passa.

**Minor.** 7. As plantas provam as funções auxiliares, não a ligação ao resultado. 8. Números do relatório sem ficheiro. 9. «a leitura é nossa» / «the reading is ours» nas duas línguas.

**O que está bem.** Nenhuma linha dos livros muda; 77 de 78 pedaços do sítio e 16 de 16 do motor batem com os ficheiros copiados; a V331 é a única mudança da lista; a fonte inglesa encolhe exatamente o comprimento da oração; os resumos dos cortes e dos registos batem com os manifestos; as contagens batem entre si; os números da etiqueta iguais nas quatro páginas; as datas de 08.11.2026; os arquivos de 20.08 conservam a oração antiga; as plantas da conferência dos pares comportam-se como descrito; os códigos dos ficheiros a zero.
