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
| voz-do-livro-razao | 10 | `design/especime-v3/critica/2026-08-27-codex-leitura-voz-livro.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre o diff do bloco, os marcadores e as duas páginas de índice do livro-razão, com duas plantas (2 de 2); a última passagem L1 a L5 saiu dela |
| voz-dos-documentos | 2 | `design/especime-v3/critica/2026-08-27-codex-leitura-voz-documentos.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre os doze diffs da passagem, a disposição e três páginas de leitura construídas, com três plantas (2 de 3; a terceira mal empacotada) |
| mapa-distritos | 16 | `design/especime-v3/critica/2026-08-27-codex-leitura-mapa-distritos.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre a primeira página, quatro páginas de distrito, os JSON do mapa e o diff do inventário, com quatro plantas (4 de 4) |
| grelha-2 | 87 | `design/especime-v3/critica/2026-08-27-codex-leitura-grelha-2.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre o diff do inventário (estados, dicas), os marcadores e as primeiras páginas, com três plantas (2 de 3); X1 a X3 saíram dela |
| voz-3 | 0 | `design/especime-v3/critica/2026-08-27-codex-leitura-voz-3.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre os doze diffs da terceira passagem e três páginas construídas, com duas plantas (1 de 2); o inventário não mudou (o texto dos registos é origem declarada), a linha fica pelo rasto |
| regioes | 36 | `design/especime-v3/critica/2026-08-28-codex-leitura-regioes.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre o índice, três páginas de região, a primeira página, as linhas da régua e o diff do inventário, com três plantas (3 de 3); Q3 saiu dela |
| ilhas | 4 | `design/especime-v3/critica/2026-08-28-codex-leitura-ilhas.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre oito páginas de concelho e de linha das ilhas e das colisões de nome, as linhas, o texto das fontes e o diff do inventário, com duas plantas (2 de 2); a nota «duas palavras» corrigida para três |
| vazios | 6 | `design/especime-v3/critica/2026-08-28-codex-leitura-vazios.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre cinco páginas de concelho nas duas edições, doze linhas e recibos, os dois ficheiros da DGAL e o diff do inventário, com três plantas (3 de 3); I88 saiu dela |
| pequenas-3 | 4 | `design/especime-v3/critica/2026-08-28-codex-leitura-pequenas-3.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre o índice dos concelhos, a página de Évora, uma leitura longa, o manifesto e o diff do inventário, com três plantas (2 de 3; a terceira mal plantada); a ordem dos membros dos grupos saiu dela |
| app | 2 | `design/especime-v3/critica/2026-08-28-codex-leitura-app.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre os manifestos, os ícones, cinco páginas nas duas edições e o diff do inventário, com três plantas (3 de 3); a classe do nome curto corrigida para navegação no fecho |
| areas | 75 | `design/especime-v3/critica/2026-08-29-codex-releitura-areas.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre o índice e as páginas de área nas duas edições, o mapa, a lei e o diff do inventário, com três plantas (2 de 3); a primeira leitura, de 28.08 (`2026-08-28-codex-leitura-areas.md`, 2 de 3), fez sair a terceira passagem; I91 saiu desta |
| pequenas-6 | 0 | por ler | Codex, sobre o diff do bloco do rótulo da fonte: as 1553 linhas, a página de uma área e o recibo nas duas edições, e as réguas. O inventário não muda, e a razão está medida: o rótulo é origem declarada (`data-linha-campo="name"`) e os dois rótulos de campo novos do recibo vivem dentro da ficha, que já leva origem declarada, como «Onde no documento». A régua viu-o vermelho: com o mesmo texto num bloco de prosa sem marca, `npm run check:voz` sai a 1 com um «bloco por classificar» por rótulo distinto |
| pequenas-4 | 14 | `design/especime-v3/critica/2026-08-29-codex-leitura-pequenas-4.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre a página de Évora, uma página de área inglesa, o índice das áreas, a agenda e os diffs, com três plantas (2 de 3; a primeira mal plantada); I92 saiu dela |
| pequenas-5 | 2 | `design/especime-v3/critica/2026-08-29-codex-leitura-pequenas-5.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre sete páginas construídas, o dicionário das unidades e o diff do inventário, com três plantas (3 de 3); o texto oculto dos selos e a letra da fonte no dicionário saíram dela |

## As duas colunas novas de 27.08.2026 (I74)

A tabela do inventário passou de três colunas a cinco: **estado** e **razão**.
Uma linha declara-se `viva`, e então rende-se em pelo menos uma rota
inventariada, ou `retirada`, e então a casa tirou aquela frase de propósito, ela
não pode voltar a render-se, e a razão da coluna a seguir diz que bloco a tirou. `npm run
check:voz` fecha a construção nos dois sentidos: uma linha `viva` que não se
rende em rota nenhuma, e uma linha `retirada` que voltou.

**O que isto fecha.** A I74 contou 58 declarações que já não se rendiam em página
nenhuma, e a razão de elas ficarem era boa: o ficheiro escreve, desde o bloco dos
308, que «uma frase corrigida sai desta lista», porque repô-la passaria em
silêncio. O que faltava era a régua. Uma linha que ficava sem se render não era
uma sentinela: era uma linha morta, e a lista engordava.

**O que saiu em vez de ficar.** Dezoito das 57 que este bloco encontrou não
podiam ser sentinelas, e saíram do ficheiro: catorze levam uma contagem por
dentro («132 afirmações · 19 calculadas», «128 de 136 linhas com proveniência
completa»), e uma frase com um número que se move volta com outro número, pelo
que a linha nunca voltaria a morder; e quatro deixaram de ser frases da casa
porque o nome do lugar passou a declarar-se (`data-lugar`) ou a compor-se
(`<lugar>`), e a régua deixou de as ler como prosa. As duas famílias estão
contadas na nota do bloco, com o que as substitui: quando uma contagem voltar,
volta como bloco **por classificar**, que é o portão que a apanha.

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
