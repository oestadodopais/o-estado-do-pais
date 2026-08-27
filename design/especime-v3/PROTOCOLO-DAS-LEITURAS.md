# O protocolo das leituras cruzadas

*G4 do bloco «A grelha da voz», 26.08.2026. É a regra escrita, e mais nada: não
tem código, não corre, e não fecha construção nenhuma. O que ela governa é como
se pede uma leitura de olhos frescos e como se regista o que ela deu.*

## A regra, em cinco linhas

1. **Toda a leitura cruzada leva pelo menos uma planta por classe.** As classes
   são cinco: **número** (um valor que não bate com a sua linha), **proveniência**
   (um campo da linha que deixou de bater com a fonte, ou um selo que abre a linha
   errada), **ausência** (um número inventado onde a página dizia que não havia),
   **língua** (uma cadeia de uma edição na outra) e **voz** (o sítio a explicar-se).
2. **As plantas registam-se antes da leitura, com o sha256 de cada ficheiro
   alterado**, num `.plantas.json` ao lado do registo. Sem esse ficheiro escrito
   antes, uma leitura não prova nada: prova-se sempre o que já se sabe.
3. **A planta da voz vai no diff do inventário, e não numa página.** É a única
   das cinco que muda de superfície, e a razão está medida: a classe procurada
   numa página falhou duas vezes seguidas, e no diff do inventário foi apanhada
   duas em duas.
4. **O registo de cada leitura leva a tabela por classe**: que planta cobriu cada
   classe, e se foi apanhada. Uma classe sem planta escreve-se como tal, em vez
   de não aparecer.
5. **Uma classe falhada duas vezes seguidas passa da leitura para a construção.**
   Deixa de ser trabalho de quem lê e passa a ser uma régua que fecha a
   construção. Aconteceu uma vez: **a voz, a 26.08.2026.**

## A classe que passou para a construção, e quando

**A voz.** A frase da casa sobre o seu próprio cuidado foi plantada três vezes e
falhou duas seguidas:

* **24.08.2026, segunda leitura da parte 3, P5** · «Todos os números deste
  documento foram reconferidos pela casa antes de o publicar.», no aparelho do
  03 pt. Não apanhada. A mesma classe fora apanhada na primeira leitura do mesmo
  dia, no aparelho do 08 pt.
* **26.08.2026, leitura dos concelhos, P5** · «Todos os valores desta página
  foram verificados pela equipa contra as fontes oficiais.», numa das dez páginas
  de concelho. Não apanhada. A leitura procurou a classe por cadeias repetidas em
  todos os ficheiros e não leu cada página à procura de uma frase só dela.
* **26.08.2026, leitura do diff do inventário** · duas plantas, duas apanhadas.
  A forma funciona quando o que se lê é o diff e não as páginas.

A consequência está construída e é o G1 deste bloco: uma lista fechada de
marcadores em `VOZ-MARCADORES.md`, aplicada pela régua a todas as frases da
superfície pública e imposta por `npm run check:voz`, que fecha a construção.
**A partir de agora a planta da voz continua a fazer-se, no diff do inventário,
porque uma régua nova não dispensa a leitura: dispensa a leitura de ser a única
rede.**

## A tabela das leituras, de 24 a 26.08.2026

*Uma linha por leitura, com as classes que ela plantou. `—` quer dizer que não
houve planta dessa classe, e não que a leitura a tenha ignorado.*

| leitura | plantas | número | proveniência | ausência | língua | voz |
| --- | --- | --- | --- | --- | --- | --- |
| `2026-08-24-codex-leitura-parte3-1` | 6 (5 reais, 1 controlo negativo) | P2, P4 · apanhadas | P3 · apanhada | — | — | P5 · apanhada |
| `2026-08-24-codex-leitura-parte3-2` | 7 (6 reais, 1 controlo negativo) | P2, P4 · apanhadas | P3 · apanhada | — | — | **P5 · falhada** |
| `2026-08-25-codex-leitura-ux` | nenhuma | — | — | — | — | — |
| `2026-08-25-codex-leitura-correcoes` | nenhuma | — | — | — | — | — |
| `2026-08-26-codex-leitura-concelhos` | 5 | P1 · apanhada | P2 · apanhada | P3 · apanhada | P4 · apanhada | **P5 · falhada** |
| `2026-08-26-codex-leitura-mapa` | 4 | — | — | — | P4 · apanhada | — |
| `2026-08-26-codex-leitura-voz-inventario` | 2 | — | — | — | — | P1, P2 · apanhadas |

**O que a tabela mostra, e é o motivo de a regra 1 existir:** de sete leituras,
**uma só** plantou as cinco classes, e duas não plantaram nenhuma. As duas
leituras da parte 3 plantaram sempre número, proveniência e voz, e nunca ausência
nem língua; a leitura do mapa plantou só língua. A regra 1 não descreve o que se
fazia: descreve o que passa a fazer-se.

## As duas linhas que ficam à decisão do diretor

*O G5 deste bloco decidiu a voz da página de Évora. Duas linhas ficaram por
decidir, e ficam escritas aqui com as três opções, porque uma decisão adiada sem
opções escritas volta como uma discussão do princípio.*

**(b) As ledes do livro-razão.** «Uma linha por número publicado. Cada linha
guarda o valor tal como a fonte o publicou…» e a descrição do `<head>` do índice,
«Todas as afirmações publicadas neste sítio, uma linha cada…». A leitura estrita
chama-lhes o método do sítio explicado numa página do leitor; a casa chama-lhes o
conteúdo do índice, pela mesma leitura com que a Emenda 17 pôs a política de
correções em `/correcoes`.

**(c) As contagens do livro-razão.** «2 552 afirmações · 325 calculadas · 2 417
linhas de concelhos», «2 544 de 2 552 linhas com proveniência completa», «2 417
linhas · 308 concelhos · 2 417 com proveniência completa». São chaves da prova,
recontadas pelo portão nas duas vistas, e a `IDENTIDADE.md` §10 obriga-as a
entrar por `data-prova` com porta. A leitura estrita chamou-lhes «contagens de
diligência».

As três opções, iguais para as duas:

1. **Ficam como conteúdo**, com a razão escrita no inventário: numa página cujo
   objecto é o livro-razão, dizer o que o livro-razão contém é conteúdo, como a
   política de correções é o conteúdo de `/correcoes`.
2. **Saem.** O índice fica com o título, a lista e as portas; quem quiser saber o
   que uma linha guarda abre uma linha.
3. **Vão para o Método ou para o recibo da linha**, que são os dois sítios que a
   Emenda 15 isenta. O índice fica com uma porta para lá.

Até haver decisão, as duas linhas estão na lista de exceções de
`VOZ-MARCADORES.md` com a razão «à decisão do diretor, 26.08». As ledes levam
marcador e por isso a exceção dispensa-as; as contagens **não levam marcador
nenhum**, e a sua entrada é um registo e não uma dispensa: fica escrita para que
a decisão não se perca, e o portão imprime quantas entradas de registo existem.
