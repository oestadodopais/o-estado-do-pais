# A leitura a frio da HIG-6A, 08.11.2026

*Leitor: Claude Opus 5.5 (`leitor`, a `xhigh`), 30 chamadas, 688 s, sobre o pacote `pacote-hig6a-2026-11-08` (base 96ce315c1, cabeça 0b80e965b, `dist/` de 0b80e965b). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| P1 | a camada 0 sai sempre com 0, mesmo com recusas | 1 (Blocking) |
| P2 | o teto das voltas só pede decisão à quinta retoma | 3 (Major) |
| P3 | a régua do repositório deixa de ver raw.githubusercontent.com | 5 (Major) |
| P4 | o Método português diz que uma pessoa revê cada mudança | 2 (Blocking) |
| P5 | a exceção da paridade de «Onde está a água» sem a condição de saída | 4 (Major) |

Cinco plantas em cinco. O leitor viu ainda que os ficheiros plantados tinham a hora de mudança (ctime) vinte segundos depois da de modificação; o guião das plantas passa a mudar essa hora em todos os ficheiros do pacote.

**Os achados reais e a decisão.** Quatro Major na força da camada 0, que guarda os blocos seguintes; nenhum torna nada pior do que antes, e a camada 0 falha fechada em todos os casos provados, mas a regra é zero Major na aterragem. Corrigidos antes de aterrar pela adenda C, a terceira retoma, com a decisão escrita que o teto das voltas exige:
- **7:** `check:pre-mandato` e a repetição nos casos reais fora do `verify`: nada da camada 0 corria na corrida do GitHub.
- **6:** as plantas provavam as funções auxiliares e não a ligação; tirar a voz, os números ou o código de saída deixava-as verdes.
- **8:** uma entrada cuja frase não está na página passava; o casamento por subcadeia deixava uma FICA de uma letra cobrir quase tudo.
- **9:** qualquer `assercao` com forma de identificador passava, sem a conferir nos livros do motor.
- **Minor:** 10 (o contador das voltas na pasta temporária do sistema), 11 (um `Frases:` fora do cabeçalho ignorado; corrigido na adenda C), 12 (guardas da paridade sem planta), 13 (o extrator de números da camada 0 parte «1 234,5»; corrigido na adenda C), 14 (a repetição nos casos reais trata o limite da V122 como comportamento exigido e não afirma os 28), 15 (a hora de mudança das plantas), 16 (números do relatório sem ficheiro), 17 (o Método diz 64 conferências e o `verify` tem 63 passos; a contagem do Método é a do seu próprio guião, a conferir na HIG-6B).

## O relatório do leitor (condensado)

**Blocking.** 1. No diff, a camada 0 sai sempre com 0, e nenhuma planta da cadeia o notava. 2. O Método português diz «uma pessoa revê cada mudança antes de se publicar».

**Major.** 3. No diff, o teto das voltas passa à quinta retoma. 4. No diff, a exceção da paridade perde a condição de saída. 5. No diff, a régua do repositório deixa de ver raw.githubusercontent.com. 6. As plantas da cadeia não provam a ligação da camada 0. 7. `check:pre-mandato` fora do `verify`, e a repetição nos casos reais em nenhum guião. 8. Uma entrada que não está na página passa; uma FICA curta cobre tudo. 9. A regra dos quantificadores aceita qualquer identificador; as oito declarações sem prova no pacote.

**Minor.** 10 a 17, como acima.

**O que está bem.** Nenhuma linha dos livros nem nenhuma página do leitor muda; as exceções da paridade iguais à medida deste lugar e fechadas; a paridade recusa diferenças novas, alteradas e desaparecidas, com plantas; o guião da paridade igual byte a byte ao deste lugar; as contagens dos casos reais reproduzem-se (VOZ-2B 28, 7 e 15; VOZ-2A a zero; a lista de ab948c410 com dez recusas da voz); a camada 0 falha fechada num `dist/` de outra cabeça, sem o motor, com uma lista mal formada, com `par: nenhum` sem razão e com um `Frases:` vazio; os pares com plantas para o caso da V228, um bloco reutilizado, um bloco partilhado e as FICA; o teto das voltas e a cópia dos lançadores com plantas; nada mais fraco nos ficheiros copiados; o limite da V122 dito no código e nos relatórios.
