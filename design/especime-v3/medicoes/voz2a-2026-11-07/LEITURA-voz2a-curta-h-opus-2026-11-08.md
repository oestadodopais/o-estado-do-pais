# A leitura curta da adenda H da VOZ-2A, 08.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 27 chamadas pelo harness (26 pela contagem do leitor, uma acima do orçamento de 25), 468 s, sobre o pacote `pacote-voz2a-curta-h-2026-11-08` (base e28270820, cabeça bae686fed, `dist/` de bae686fed; o motor de ce0cf75 a e64065a). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| H1 | o documento inglês do orçamentado volta a dizer a frase que o português tirou (o par da V192) | 2 (Blocking) |
| H2 | no bloco do Turismo de Portugal reposto, a linha da qualificação da oferta passa de 80% para 60% | 1 (Blocking) |
| H3 | a conferência dos pares deixa de falhar por uma mudança fora da lista | 4 (Major) |
| H4 | o gerador do livro do estudo 14 cita «conta de gerência» em vez da frase publicada | 5 (Major) |
| H5 | o cabeçalho português de Évora 2027 mostra a edição nova como 07.11.2026 | 3 (Major) |

Cinco plantas em cinco. O leitor notou que os cinco ficheiros plantados tinham uma hora de modificação posterior à dos outros: as plantas deste lugar mudavam a data dos ficheiros; a partir da leitura seguinte, cada planta repõe a hora do ficheiro.

**Os achados reais e a decisão.**
- **6 (Major, confirmado):** o documento inglês do orçamentado ainda diz «the connection is ours», que o português perdeu pela V195. Medida a classe por guião (as orações com nossa, nosso, ours, nos seis estudos com as duas línguas): é a única que existe numa língua só. E, comparada a página do estudo com a página no ar, a etiqueta portuguesa do mesmo parágrafo tinha ganho a oração da fonte da tabela por substituição, fora da lista (o achado 10, que o leitor dava como anterior à adenda H: é da VOZ-2A). Corrigidos antes de aterrar pela adenda I: a V331 e a etiqueta reposta.
- **7 (Major, sobre a conferência dos pares):** emparelhava pela posição e não via os blocos novos; o ramo das mudanças fora da lista não tinha planta (é por isso que a planta H3 passava na planta interna). A conferência passou a ver os blocos novos das duas línguas, e o ramo fora da lista, o do bloco novo e o código de saída ganharam seis plantas, seis em seis (44fb32cfe). O emparelhamento pelo conteúdo e as páginas dos estudos ficam na HIG-6 (a GARGALOS.md).
- **8 (Minor):** a planta da isenção lê a lista da VOZ-2B; a lista é escrita por este lugar, e uma entrada nova nela é uma decisão registada.
- **9 (Minor, para a VOZ-3):** a régua alargada ainda não apanha outras contrações inglesas, «neste sítio», os plurais, nem a recusa dita por um verbo («this document declines to print»).
- **10:** ver o 6.
- **11 (Minor):** a `review` da `so-previsionais` diz como se confere a afirmação, não que se releram os documentos; a AUD1 relê-os.
- **12 (Minor):** os números do relatório reproduzem-se só pelos ficheiros do construtor; seis sem ficheiro.
- O bloco 614 da economia, que o leitor não resolveu: os números do documento são os mesmos nas duas línguas, antes e depois (medido por este lugar).

## O relatório do leitor (condensado)

**Blocking.** 1. A página portuguesa da economia diz «até 60% do investimento elegível»; o inglês, a fonte e a lista dizem 80% (`built/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara/documento/index.html:209`). 2. O documento inglês do orçamentado ainda imprime a frase que a V318 tira (`built/en/studies/evora-orcamentado-pago-devido-2025/document/index.html:244`).

**Major.** 3. A página portuguesa de Évora 2027 mostra 07.11.2026 com o `datetime` 2026-11-08 (`built/estudos/evora-2027-capital-europeia-da-cultura/index.html:4`). 4. O `diff.patch` e o guião copiado discordam no código de saída, e a planta interna não distingue as duas versões (`diff.patch:382`). 5. O `motor/diff.patch` dá a citação «conta de gerência»; os ficheiros copiados e as páginas dizem «conta de execução» (`motor/diff.patch:1424`). 6. O inglês do orçamentado ainda diz «the connection is ours» (`built/en/studies/evora-orcamentado-pago-devido-2025/document/index.html:295`). 7. A conferência dos pares só apanha em parte: não vê blocos novos, emparelha pela posição, só lê documentos, e tem duas isenções silenciosas.

**Minor.** 8. A planta da isenção depende da lista da VOZ-2B. 9. A régua alargada ainda falha formas vizinhas. 10. A etiqueta da página do orçamentado diz mais em português do que em inglês. 11. A `review` diz como se confere, não que se releu. 12. Os números do relatório só pelos ficheiros do construtor.

**O que está bem.** A lista com 181 entradas; 68 exceções, as quatro novas nas páginas certas; o guião dos pares no `check:voz`; as asserções do motor nos livros 14, 19, 04 e 18, impressas uma vez, com os `composto_de` iguais; as treze datas e as sete entradas a 2026-11-08, nenhum 07.11.2026 no registo; no documento de Évora 2027, 21 blocos mudados em cada língua nos mesmos lugares e com os mesmos factos; no orçamentado, três pares iguais; na economia, os pontos cegos e o bloco do Turismo nas duas línguas; o ensaio da edição só portuguesa lê a data do manifesto.
