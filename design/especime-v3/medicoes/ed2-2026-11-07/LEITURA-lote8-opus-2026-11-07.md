# A leitura a frio do lote 8 (a ED2), 07.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 31 chamadas pelo harness (29 pela contagem do leitor), 489 s, sobre o pacote `pacote-lote8-2026-11-07` (base 2cc0806c2, cabeça fbbd67ca2, `dist/` de fbbd67ca2). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| E1 | a linha das edições troca as naturezas | 3 |
| E2 | uma versão sem natureza volta a contar como atualização no cabeçalho | 3 |
| E3 | a régua das datas do cabeçalho deixa de conferir a palavra antes da data | 4 |
| E4 | o cabeçalho português de Évora 2027 chama atualização à correção de 06.11.2026 | 1 |
| E5 | a linha inglesa da versão atual perde a edição de 03.11.2026 | 2 |

Cinco em cinco. Os achados reais:

- **O 7, reclassificado como Blocking por este lugar.** O leitor viu que os estudos de uma só edição perdiam a data de atualização. Medido por guião (`medir-cabecalhos.py`, os `dist/` de 2cc0806c2 e de fbbd67ca2): oito páginas de quatro estudos perdem «atualizado a» e, pior, a porta passa de «Edição atual» a «Edição tal como foi publicada», quando a edição guardada é a atualizada. A página diria uma coisa falsa. Corrige-se antes de aterrar, na adenda B.
- **O 5 e o 12, Major:** nenhuma planta prova sozinha a palavra antes da data, e a tabela das provas da atualização saiu sem outra que prove a recusa de uma data a mais numa página de uma só edição. Na adenda B.
- **O 11, Minor que entra na adenda B:** a lista da voz da linha só admite as duas formas de hoje, e a VOZ-2 dará a Évora 2027 uma quarta edição; as palavras da linha escritas à mão ao lado das chaves que ninguém usa.
- **O 6, respondido:** o commit 157602858 (a ED2 A) tira a importação e só ela (uma linha), com `check:mortos`, `check:datas` e `typecheck` a 0 no relatório do construtor; a corrida `portão` do GitHub corre a lista inteira na cabeça que aterra.
- **O 10, Minor que vai à fila como ED3, antes da leitura do sítio inteiro de 08.11:** «não imprimia o cabeçalho português de Évora 2027 como está»: as três datas e naturezas aparecem duas vezes, a lista e as datas separam-se pelo mesmo « · », a frase da faixa repete a linha, e os separadores da linha leem-se em voz alta num leitor de ecrã. Nada disto é falso; é uma página que se lê mal, e a correção muda a forma que este lugar mandatou.
- **O 8 e o 9, Minor:** as medidas do construtor de outra cabeça, e a página inglesa de 01.10 fora do pacote; a leitura curta da adenda B lê a cabeça nova e leva essa página.

## O relatório do leitor (condensado)

**Blocking.**
1. O cabeçalho português de Évora 2027 diz «atualizado a 06.11.2026» sobre a data da correção (`data-estudo-correcao`), contra a linha logo antes e contra a página inglesa (planta E4).
2. A faixa inglesa da versão atual de Évora 2027 deixa de fora a edição de 03.11.2026 (planta E5).
3. O renderizador do diff difere da cópia nas duas linhas que decidem a natureza: uma versão sem natureza lida como atualização, e as palavras trocadas (plantas E1 e E2).

**Major.**
4. No diff, a régua do cabeçalho nunca compara a palavra antes da data (planta E3).
5. Nenhuma planta testa a palavra sozinha: a planta da correção dita como atualização troca também o atributo.
6. A cabeça lida está vermelha (`check:mortos`), e o commit que o corrige não está no pacote; os seus códigos são afirmações.

**Minor.**
7. «Os estudos de uma só edição e a FP3 ficam como estão» afirma-se sem se mostrar, e o caminho mudou: a data de atualização de um estudo de uma só edição posterior à publicação deixa de se imprimir.
8. As medidas do construtor são de outra cabeça.
9. Falta no pacote o documento inglês de 01.10.2026 de Évora 2027.
10. Como leitor: o cabeçalho e a faixa dizem cada data duas vezes e correm a lista para as datas sem separação visível; «não imprimia o cabeçalho português de Évora 2027 como está»; a frase da faixa repete a linha; os separadores da linha leem-se num leitor de ecrã.
11. A lista da voz só admite as duas formas de hoje; as chaves novas de `rotulos-b1.mjs` não são usadas.
12. A tabela das provas da atualização saiu de `check-datas.mjs` sem substituta igual.

**O que está bem:** fora das três linhas plantadas, cada pedaço do diff é igual ao da cópia, e os quinze ficheiros de medidas batem byte a byte; a régua nova lê o manifesto sem o renderizador; no resto das páginas, a linha, a ordem, as naturezas, a atual e as portas estão certas nas duas línguas; as contas dizem «corrigido a 30.10.2026»; `onde-esta-a-agua` fica como estava; os números do relatório reproduzem-se no código; uma natureza desconhecida é recusada em três lugares; a ordem é pela data; as portas do cabeçalho conferem-se contra todas as rotas; nenhuma frase nova fala do sítio.
