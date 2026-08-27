# As revisões do inventário · quem leu o diff de cada bloco

*G2 do bloco «A grelha da voz», 26.08.2026. Cada linha do
`design/especime-v3/INVENTARIO-FRASES.md` leva agora a coluna «bloco»: o
identificador do bloco de trabalho que a acrescentou ou a reclassificou. Este
ficheiro diz, por bloco, quem leu o diff daquelas linhas com olhos frescos.*

*`npm run check:voz` lê os dois ficheiros e fecha a construção quando um bloco do
inventário não tem entrada aqui, ou quando a entrada nomeia um ficheiro que não
existe. Uma entrada com a leitura `por ler` é legítima enquanto o bloco está em
construção, e sai na saída do portão para que ninguém a esqueça: a leitura
cruzada faz-se antes da fusão, não antes do commit.*

## Porque é que este rasto existe

A régua do inventário não julga: a classe de cada frase era uma declaração à mão,
feita por quem escreveu a frase. «É a lei que o define, não este sítio.» esteve
declarada como conteúdo em 616 páginas até 26.08.2026. E um leitor de olhos
frescos de um pacote de páginas não repara numa frase só: a leitura do Codex
falhou a planta da classe «o sítio a explicar-se» duas vezes seguidas, na segunda
leitura da parte 3 e na leitura dos concelhos, e apanhou as duas plantas quando
leu **só o diff do inventário**. É essa a leitura que esta tabela regista.

## A tabela

| bloco | linhas | leitura | quem, quando |
| --- | --- | --- | --- |
| até 2026-08-26 | 429 | `design/especime-v3/critica/2026-08-26-codex-leitura-voz-inventario.md` | Codex `gpt-5.6-sol`, 26.08.2026, sobre o diff do bloco dos 308 |
| grelha-da-voz | 36 | `design/especime-v3/critica/2026-08-27-codex-leitura-grelha-da-voz.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre o diff do bloco, os marcadores, as exceções e a página de Évora, com duas plantas (2 de 2); a segunda passagem V1 a V4 saiu dela |
| voz-do-livro-razao | 6 | por ler | a leitura cruzada do diff faz-se antes da fusão |

## O que a entrada de «até 2026-08-26» cobre, e o que não cobre

**É um estado herdado, e diz-se como tal.** As 429 linhas anteriores a este bloco
foram escritas ao longo de dezassete blocos de trabalho, e nenhum deles teve uma
leitura cruzada do seu próprio diff do inventário: a forma foi inventada a
26.08.2026, e a primeira leitura assim, a que esta linha nomeia, leu o diff do
bloco dos 308 e mais nada. Três leituras de 26.08 tocaram partes destas linhas
por outro caminho, o das páginas construídas, e ficam nomeadas aqui para que o
rasto não se perca:

* `design/especime-v3/critica/2026-08-26-codex-leitura-voz-inventario.md` · o diff
  do inventário do bloco dos 308, 2 plantas em 2;
* `design/especime-v3/critica/2026-08-26-codex-leitura-concelhos.md` · dez
  concelhos ao acaso, 4 plantas em 5, e a falha foi na planta desta classe;
* `design/especime-v3/critica/2026-08-26-codex-leitura-mapa.md` · a primeira
  página, 4 plantas em 4.

**O que fecha a lacuna não é uma leitura, é a máquina.** O G1 deste bloco passou
as 429 linhas, e todas as outras frases da superfície pública, por uma lista
fechada de marcadores; o que sobrou está na lista de exceções de
`design/especime-v3/VOZ-MARCADORES.md`, cada entrada com a razão escrita. Uma
releitura humana do inventário inteiro contra a Emenda 18 continua a ser trabalho
de outra família, e o campo `lida-contra` da cabeça do inventário só muda com uma
entrada nova aqui.

## O gatilho da regra

A cabeça do `INVENTARIO-FRASES.md` diz `lida-contra: Emenda 18`, e
`npm run check:voz` procura em `design/especime-v3/direcao.md` a emenda mais alta
com a cadeia «§5 «Voz» emendado» (hoje as Emendas 15 e 18 levam-na). Quando
aparecer uma emenda da voz acima da que está escrita, a construção fecha com «o
inventário foi lido contra a Emenda N e a Emenda M mudou a regra da voz: relê e
atualiza».

**O campo não sobe sozinho.** Subir o número é dizer que alguém releu o
inventário inteiro contra a regra nova, e isso é trabalho de outra família: a
entrada dessa releitura escreve-se na tabela acima, com o ficheiro do registo, e
só então o número muda. Foi a falta deste gatilho que deixou a Emenda 18, de
25.08.2026, apertar a regra da voz sem que o inventário fosse relido contra ela.
