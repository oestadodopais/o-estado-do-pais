# A leitura curta da adenda C da HIG-5 (M48), 06.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 16 chamadas pelo harness, 410 s, sobre o pacote `pacote-lote7-curta-c-2026-11-06` (base 777d906a1, cabeça 089af27e5, `dist/` de 2cc0806c2). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| C1 | «half-yearly» fora do grupo dos 182 dias | 3 |
| C2 | o hífen inquebrável (U+2011) sem normalizar | 4 |
| C3 | a pontuação no fim da frase a colar outra vez a contagem | 1 |
| C4 | o espaço inquebrável fora dos separadores do candidato | 2 |
| C5 | o teste a esperar só «123.4» | 5 |

Cinco em cinco. O achado real Major, o 6 («12.34» com ponto lê-se como a data dd.mm e não conta), é uma ambiguidade que não se resolve na forma: «12.10» é uma data e um decimal com ponto. Decisão deste lugar: a data ganha; os mandatos da casa escrevem os decimais com vírgula («12,34»), e essa forma conta. O construtor devia ter parado e dito a colisão, como a adenda pedia; fica dito aqui. Os achados 7 (a pontuação seguida de um parêntese, de um negrito ou de uma aspa), 8 (três formas que agora dão um número a mais e recusam o lançamento) e 9 (mais formas de frequência) vão para a lista da higiene: nenhum deixa uma contagem errada chegar a um leitor. A HIG-5 aterra.

## O relatório do leitor (condensado)

**Blocking.** 1. No diff, a conferência da pontuação deita fora toda a contagem seguida de `.`, `,`, `;` ou `:`, e a régua fica mais fraca do que antes (planta C3).

**Major.**
2. No diff, o padrão do candidato não tem o U+00A0, e «1 234» com espaço inquebrável continua a dar «234» (planta C4).
3. No diff, «half-yearly» falta no grupo dos 182 dias e liga a 365 (planta C1).
4. No diff, a normalização dos hífenes só trata o U+2010 (planta C2).
5. O teste do diff espera só `123.4` (planta C5).
6. Um decimal com ponto da forma `NN.NN` (`12.34`, `99.99`) continua a perder-se, porque a máscara das datas dd.mm o engole; a condição de paragem do mandato disparou e não foi dita.

**Minor.**
7. Uma contagem cuja pontuação final é seguida de um parêntese, de um sinal de ênfase do Markdown ou de uma aspa de fecho continua a passar sem medida («(são 4321.)», «São **4321.**», «4321.» x»).
8. Três formas que antes não davam número agora dão um falso: «§ 1 234» devolve «234», «6.11» e «05.2026» devolvem-se a si próprias; falham alto (o lançamento é recusado), não em silêncio.
9. Grafias comuns fora da lista da adenda ainda não ligam, ou ligam mal: «semiannual», «semiannually», «bi-annual» e «half yearly» (365), «bi–weekly» com meia-risca (7), «todos os dias» com espaços estreitos, «every quarter» e «cada trimestre».
10. Os números do relatório do construtor sem comando.
11. A corrida dirigida e as páginas construídas são de 2cc0806c2 e não da cabeça lida (089af27e5); os sete passos não incluem o `gate:html` nem o teste das frequências à vista no pacote.
12. A página pedida diz «Cópia alojada a 24.08.2026» e o pacote diz que a linha não tem documento alojado, montado sem a cabeça do motor.

**O que está bem:** no ficheiro copiado, as oito linhas do §0 devolvem o que a tabela diz, e as duas primeiras são recusadas sem `Medidas:`; as exceções do mandato não dão número, mesmo com pontuação a seguir, e uma data, uma hora ou uma regra não engolem a contagem que vem depois; a régua das frequências liga todas as formas da adenda ao seu período, e as 31 formas que já apanhava continuam a dar o mesmo período; o diff só toca as duas réguas e os seus testes, nenhuma linha do livro-razão, nenhuma página, nenhuma frase do leitor.
