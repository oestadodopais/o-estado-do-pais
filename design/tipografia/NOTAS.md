# NOTAS · o estudo tipográfico, o que se mediu e o que se viu

*Escrito a 29.08.2026 pelo construtor (Claude Opus 5), ramo `tipografia-2026-08-29`,
numa cópia própria. A régua está em `RUBRICA.md`, fixada num commit anterior ao
das fontes e ao das capturas. Nada disto está em `main` e nada disto é uma
decisão de compra: é o estudo que a constituição visual v3.1 pediu antes dela.*

## 0 · O que sai daqui em três linhas

* **A poupança maior não é trocar de letra: é cortar a que já cá está.** O sítio
  aloja hoje 694,8 KiB de tipos sem subconjunto. Os mesmos oito ficheiros
  cortados ao latim dão 405,3 KiB. São **289,5 KiB por página, sem mudar uma
  letra**, e é o único resultado deste estudo que não precisa de decisão
  nenhuma.
* **Para a prosa, a medida dos ecrãs pequenos separa as quatro candidatas, e a
  Source Serif 4 ganha-a em quatro das cinco páginas.** A tinta que cabe numa
  haste de um píxel a 1× é 0,442 de média nela contra 0,312 a 0,320 nas outras
  três. A quinta página é o concelho, e aí é a Literata que ganha, 0,430 contra
  0,400.
* **A IBM Plex Sans está fora, e a medida que a exclui é a 4:** a variável do
  `google/fonts` não declara `tnum`. Confirmado no TTF de montante, e não é
  culpa do subconjunto.

## 1 · A tabela das oito linhas

As colunas do Parnaso e da Sebenta estão vazias, e a §5 diz porquê. A leitura
cega (linha 8) é da direção e não minha: as pranchas ficam feitas.

| medida | Spectral | Newsreader | Source Serif 4 | Literata | Parnaso Standard | Parnaso Small | Bitter | Public Sans | IBM Plex Sans | Sebenta |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 · altura de x a 17 px (px) | 7.65 | 7.24 | 8.07 | 8.62 | — | — | 8.87 | 8.79 | 8.77 | — |
| 1 · altura de x a 15 px (px) | 6.75 | 6.39 | 7.13 | 7.61 | — | — | 7.83 | 7.75 | 7.74 | — |
| 1 · x/em | 0.450 | 0.426 | 0.475 | 0.507 | — | — | 0.522 | 0.517 | 0.516 | — |
| 2 · traço sólido mais fino a 1× (px) | 1 | 1 | 1 | 1 | — | — | 1 | 1 | — | — |
| 2 · tinta mediana numa corrida de 1 px | 0.316 | 0.320 | 0.442 | 0.312 | — | — | 0.320 | 0.331 | — | — |
| 2 · desaparece a 1× | sim | sim | sim | sim | — | — | sim | sim | — | — |
| 3 · abertura «e» a 17 px (px de CSS, lida a 12×) | 2.25 | 2.58 | 1.92 | 2.08 | — | — | 1.92 | 1.08 | 1.08 | — |
| 3 · abertura «a» a 17 px (px de CSS, lida a 12×) | 1.31 | 1.53 | 1.36 | 1.42 | — | — | 1.14 | 0.92 | 1.25 | — |
| 3 · abertura «s» a 17 px (px de CSS, lida a 12×) | 1.36 | 1.03 | 1.31 | 1.31 | — | — | 1.36 | 1.25 | 1.19 | — |
| 3 · abertura «c» a 17 px (px de CSS, lida a 12×) | 3.92 | 4.03 | 3.42 | 3.58 | — | — | 3.75 | 2.75 | 3.08 | — |
| 3 · a mesma abertura «e» a 1×, como a rubrica pede | — | 1 | 1 | — | — | — | — | — | — | — |
| 3 · peso a que a abertura foi medida | 400 | 400 | 400 | 400 | — | — | 600 | 600 | 600 | — |
| 4 · feature `tnum` | sim | sim | sim | sim | — | — | sim | sim | NÃO · excluída | — |
| 4 · variância de «0»–«9» a 15 px, no ficheiro, com `tnum` | 0.0000 | 0.0000 | 0.0000 | 0.0000 | — | — | 0.0000 | 0.0000 | — | — |
| 4 · a mesma, sem `tnum` (os algarismos por defeito) | 0.0000 | 0.0000 | 0.0000 | 0.4344 | — | — | 1.1446 | 0.9174 | 0.0000 | — |
| 4 · variância na página a 15 px (só o instrumento) | — | — | — | — | — | — | 0.0000 | 0.0000 | — | — |
| 4 · a mesma, tirados os tabulares (o vermelho) | — | — | — | — | — | — | 0.7425 | 0.9939 | — | — |
| 5 · versaletes `smcp` | sim | não · Spectral SC | sim | sim | — | — | sim | não · Spectral SC | não · Spectral SC | — |
| 6 · linhas por ecrã a 390 × 844 | 27 | 31 | 28 | 30 | — | — | — | — | — | — |
| 6 · caracteres por linha | 36.2 | 36.1 | 33.6 | 30.2 | — | — | — | — | — | — |
| 6 · caracteres no ecrã | 977 | 1118 | 940 | 907 | — | — | — | — | — | — |
| 7 · ficheiros que o sítio carregaria | 7 | 4 | 2 | 2 | — | — | 1 | 1 | 1 | — |
| 7 · total em KiB (WOFF2 latino) | 340.7 | 503.1 | 440.1 | 471.7 | — | — | 64.6 | 33.4 | 98.3 | — |
| 7 · o sítio inteiro, com a Bitter, em KiB | 405.3 | 567.7 | 504.8 | 536.3 | — | — | — | — | — | — |
| 8 · leitura cega | direção | direção | direção | direção | — | — | direção | direção | direção | — |

**Como ler a linha 2.** A 17 px e 1× o traço sólido mais fino é **um píxel em
todas as famílias**: o número não separa ninguém, e está na tabela por ser o que
a rubrica pede. O que separa é quanta tinta o navegador consegue pôr nesse
píxel. A Source Serif 4 põe 0,442 de cobertura mediana, contra 0,312 a 0,320 nas
outras três, e produz muito menos hastes de um píxel: na página de região, 375
corridas contra 623 da Literata e 823 da Spectral. Traços mais grossos, menos
hastes a colapsar para um píxel, e as que colapsam ficam mais escuras.

**Como ler a linha 3.** O número da rubrica é a abertura a 17 px e 1×, e a essa
resolução a régua sela em duas famílias e em mais nenhuma: a garganta de um «e»
a 17 px tem menos píxeis do que os três que o detetor exige para dizer que
fechou. A coluna que ordena é a lida a 12× de densidade **com o mesmo corpo de
17 px**, dividida por doze. Não é a 204 px: as três serifas candidatas têm eixo
`opsz`, e a 204 px o navegador pede-lhes o desenho de titulação, que tem outras
aberturas e é outra letra.

**Como ler a linha 4.** A variância na página só existe nas duas colunas de
instrumento, e a razão é do sítio: as 143 regras que pedem `tabular-nums`
compõem em `--f-instr`. Numa construção `literata+bitter` quem desenha os
algarismos é a Bitter. Pôr esse número na coluna da Literata era dar-lhe crédito
por uma letra que não é a dela.

**Onde a linha 6 varia menos do que parece.** A entrelinha é a mesma nas quatro
construções (28 px de `--t-leitura` × `--lh-leitura`), e por isso o número de
linhas num ecrã de 844 px varia pouco: entre 27 e 31. O que varia a sério é o
que cabe nelas. A Newsreader mete 1118 caracteres no ecrã e a Literata 907: 23%
de diferença, ao mesmo corpo e à mesma entrelinha, só porque uma é estreita e a
outra é larga.

## 2 · O que se viu, família a família

Vi as capturas e os recortes com os olhos, além de os medir. O que se segue é o
que a imagem mostra, com o número ao lado.

### Spectral (controlo, o sítio de hoje)

O «e» tem a segunda abertura mais larga das quatro (2,25 px de CSS a 17 px), o
«a» a mais estreita (1,31) e o «s» a mais larga (1,36). A altura de x é 7,65 px
a 17 px, a segunda mais baixa. É a letra mais barata do estudo por uma margem
larga: 405,3 KiB o sítio inteiro contra 504,8 da segunda.

Onde ela sofre é a 1×. Na página de região, 823 das suas corridas têm um píxel
de largura e a mediana da tinta nelas é 0,121: um cinzento claro com forma de
haste. É o que se espera de um desenho com contraste alto, e é exatamente o que
os ecrãs de baixa densidade não perdoam. A 2× e a 3× o problema desaparece, e a
maior parte dos leitores está lá.

### Newsreader

A abertura mais larga do estudo no «e» (2,58) e no «a» (1,53), e a mais estreita
no «s» (1,03): o «s» fecha-se onde as outras abrem. A altura de x é a mais
baixa das quatro, 7,24 px, e é isso que se vê na prancha: a linha corre mais
longe e cabe mais texto, 1118 caracteres por ecrã contra 977 da Spectral, mais
14%.

**Não tem `smcp`.** As versais do sítio (`var(--f-versal)`, 22 sítios na folha)
ficam na Spectral SC, e a página passa a ter duas letras ao mesmo tempo: a
prancha de 390
mostra-o na palavra «RELANCE», que é Spectral por cima de um parágrafo
Newsreader. E o custo em bytes vem com isso: 567,7 KiB, o mais pesado do estudo,
porque arrasta os dois ficheiros de Spectral SC (96,7 KiB em latim) que nenhuma
outra candidata precisa.

### Source Serif 4

A que aguenta o píxel. Ganha a linha 2 em **quatro das cinco** páginas: 0,351 ·
0,400 · 0,487 · 0,604 · 0,469, contra 0,280 · 0,349 · 0,121 · 0,522 · 0,409 da
Spectral. A que perde é o concelho, onde a Literata mede 0,430 contra 0,400, e
está dito porque uma vitória em cinco de cinco era o que eu tinha escrito antes
de conferir página a página. Menos hastes de um píxel e mais escuras quando as
há. Altura de x de
8,07 px, a segunda mais alta.

Paga-o na abertura: o «e» mede 1,92 px, a mais fechada das quatro, e o «c» 3,42,
também a mais fechada. Uma letra mais robusta é uma letra com contraformas mais
pequenas, e as duas coisas são a mesma decisão de desenho vista de dois lados.
Tem `smcp`, e por isso as versais saem do mesmo ficheiro sem pesar nada.

### Literata

A maior altura de x do estudo, 8,62 px a 17 px, e vê-se: na prancha de 390 é a
coluna que parece composta num corpo maior sem o estar. É também a mais larga, e
é o que lhe custa: 907 caracteres por ecrã, menos 7% do que a Spectral e menos
19% do que a Newsreader. Aberturas no meio da tabela (2,08 · 1,42 · 1,31), e a
mediana de tinta mais baixa das quatro (0,312), a par da Spectral.

### Bitter (controlo do instrumento)

Aguenta o lugar. A 600, que é o peso que o sítio usa, o «e» abre 1,92 px e o «c»
3,75, contra 1,08 e 2,75 da Public Sans. Tem `tnum` e tem `smcp`. Custa 64,6 KiB
em latim, o dobro da Public Sans.

### Public Sans

Metade do peso da Bitter (33,4 KiB contra 64,6) e os tabulares confirmados: a
variância de «0» a «9» a 15 px na página é zero, e tirados os tabulares sobe a
0,9939, que é o vermelho a ser visto. **Mas a 600 tem as aberturas mais fechadas
de todo o estudo**: 1,08 no «e», 0,92 no «a», 2,75 no «c». Num aparelho de
números pequenos, um «e» que fecha é um «e» que se lê como «c» ou como «o».

E não tem `smcp`. E é uma sem serifa numa página que é toda de serifa: a prancha
de 390 mostra a coluna cinco com «58 567» noutra voz, e isso é uma decisão de
desenho e não uma medida.

### IBM Plex Sans · excluída

**A variável `IBMPlexSans[wdth,wght].ttf` do `google/fonts` não declara `tnum`.**
Nem `pnum`. Conferido no TTF de montante e não só no subconjunto, e por isso não
é o corte que a estragou. A rubrica diz «a família tem a feature, ou não tem e
fica excluída do instrumento», e é o que se faz: não foi construída, não foi
capturada, e as suas células ficam vazias.

O que se lhe mediu antes de sair, e que a não salva: os algarismos por defeito
dela já são de largura fixa (variância zero a 15 px no ficheiro). As colunas
alinhavam. Mas alinhavam por acidente do desenho e não por uma feature que se
possa pedir, e um sítio que pede `tabular-nums` em 143 regras não pode assentar
num acidente.

## 3 · A ordem de preferência

### Para a prosa

1. **Source Serif 4.** Ganha a única medida da rubrica que é mesmo sobre ecrãs
   pequenos, em quatro das cinco páginas, e é a única que a ganha em mais de
   uma. Tem `smcp`, e por isso as versais deixam de precisar de uma segunda
   família. Custa mais 99,5 KiB do que a Spectral e fecha o «e» de 2,25 para
   1,92: é o preço, e está medido.
2. **Literata.** A maior altura de x do estudo, que é o que se quer a 17 px num
   telemóvel, e `smcp`. Perde 7% de densidade de leitura e não melhora a
   Spectral na linha 2 (0,312 contra 0,316, que é um empate).
3. **Spectral.** O controlo. 405,3 KiB contra 504,8 da primeira, e nenhuma das
   medidas a põe em último lugar exceto a 2. Trocá-la custa bytes e trabalho;
   mantê-la custa hastes pálidas a 1×.
4. **Newsreader.** Traz a maior densidade de leitura e as aberturas mais largas
   no «e» e no «a», e sai em último por uma coisa que não é gosto: **não tem
   versaletes**. Num sítio que escreve `var(--f-versal)` em 22 sítios da folha,
   isso significa duas letras na mesma página e mais 96,7 KiB de Spectral SC
   para as servir.

### Para o instrumento

1. **Bitter.** Aberturas quase duas vezes mais largas do que a alternativa ao
   peso que o sítio usa, `tnum` e `smcp`.
2. **Public Sans.** Metade dos bytes e tabulares confirmados; aberturas as mais
   fechadas do estudo, sem `smcp`, e muda a voz da página.
3. **IBM Plex Sans.** Fora, pela medida 4.

### Se a resposta for comercial

O Parnaso e a Sebenta não foram medidos, e por isso **não há aqui uma
recomendação de compra**: há uma condição para ela. Quando o pacote de teste
chegar, corre-se-lhe a mesma régua, e o teste eliminatório da constituição
(tabulares e versaletes) não chega: **acrescenta-se-lhe a linha 2**, porque foi
ela que separou as quatro candidatas livres e é ela que decide num telemóvel a
1×.

O número a bater é **0,442**, que é o da Source Serif 4. Se o Parnaso Small não
o bater, a compra paga por uma coisa que uma licença OFL já dá. Se o bater, o
que se compra é a diferença, e essa diferença passa a estar medida em vez de
declarada.

Antes de qualquer compra, e independentemente dela: **cortar os tipos de hoje ao
latim**. 289,5 KiB por leitor, sem decisão nenhuma.

## 4 · Como isto foi feito, e onde falha

### As construções: cinco, e porquê

`spectral+bitter` (o controlo, que é o sítio de hoje), `newsreader+bitter`,
`sourceserif4+bitter`, `literata+bitter`, `spectral+publicsans`. Com o
instrumento fixo na Bitter, a diferença entre duas colunas é só a prosa; com a
prosa fixa na Spectral, a diferença entre a primeira e a quinta é só o
instrumento. Vinte e cinco combinações davam vinte e cinco construções e nenhuma
comparação nova: quem quiser a Literata com a Public Sans lê as duas colunas.

### O interruptor

`programa/interruptor.mjs`, lido pelo `Base.astro` em vinte linhas. Troca
`--f-prosa`, `--f-versal`, `--f-instr` e o conjunto de `@font-face`, e nada mais:
nenhum tamanho, nenhuma entrelinha, nenhuma cor, nenhum espaço. Sem
`TIPOS_ESTUDO` no ambiente devolve a cadeia vazia, e a construção por defeito
saiu **idêntica byte a byte nos 6606 ficheiros** à de antes de o `Base.astro`
ser tocado. A cadeia inteira do `npm run build` passa nesse defeito.

Os versaletes não se trocam com uma ficha, porque o sítio usa `--f-versal` como
família e espera que os glifos por defeito já sejam versaletes. O que serve é
uma família irmã declarada no próprio `@font-face` com o descritor
`font-feature-settings: 'smcp' 1`. Isso foi medido antes de se escrever: a
Literata a 40 px passa de 191,91 px para 209,63 px com o descritor, que é o
mesmo que a regra `font-variant-caps` dá. **É o Chromium desta máquina**, que é
o motor das capturas; uma decisão que dependa deste caminho tem de o confirmar
nos outros motores, e este estudo não o fez.

### Os detetores viram os seus vermelhos, e dois deles apanharam erros meus

`programa/pixeis.mjs` corre treze casos conhecidos e pára se algum falhar; a
prova da medida 4 no ficheiro está em `MEDIDAS-tipo.json` e a da medida 4 na
página em cada `medidas/*.json`. Dois desses casos apanharam a régua errada
antes de ela medir coisa nenhuma:

* o detetor da medida 2 varria só as linhas de píxeis, e lia uma barra
  horizontal de 3 px de espessura como um traço de 36 px, porque ao longo da
  linha ela mede 36. Uma corrida horizontal mede a espessura dos traços
  verticais; para os horizontais é preciso varrer as colunas;
* o detetor da medida 3 semeava no papel mais largo dentro da caixa da tinta, e
  num «o» isso é um canto entre a pança redonda e a caixa retangular: devolvia
  uma abertura para uma letra que não tem nenhuma. A 1× o canto era pequeno e o
  erro não aparecia; foi subir a densidade que o mostrou. A abertura passou a
  ser **quanto o traço tem de engordar até a garganta selar**, que não tem
  semente e por isso não tem esse erro.

E duas coisas mudaram por eu ter aberto as imagens em vez de só as medir: o
recorte dos algarismos apanhava uma tabela inteira com as suas réguas cinzentas
e os sublinhados das fontes, e o binário «desaparece» dava verdadeiro para todas
as famílias, que é o mesmo que não medir nada.

### O que não se mediu, e não é por esquecimento

* **O Parnaso (Display, Standard, Small, Petit, Hairline) e a Sebenta.** São
  comerciais. O brief diz que as fontes de teste chegam por um formulário que só
  o diretor preenche e que não as vou buscar. Não foram buscadas, não foram
  medidas, e as colunas ficam vazias. **Sem elas este estudo não é uma decisão
  de compra**: é a régua e o que a régua diz das alternativas livres.
* **O itálico.** O sítio quase não o usa. Os ficheiros itálicos das três
  candidatas de prosa foram descarregados, cortados e contam para a linha 7, mas
  nenhuma medida os olha.
* **Os outros motores.** Tudo o que aqui está é Chromium. O descritor
  `font-feature-settings` no `@font-face`, que é o que dá os versaletes às
  candidatas, não foi confirmado no Firefox nem no WebKit.
* **A leitura cega (linha 8).** É a fase do lugar de direção. As pranchas ficam
  feitas: `PRANCHA-390.png`, `PRANCHA-1280.png`, `PRANCHA-ALGARISMOS.png`.

### Onde as capturas param

As medidas correm na grelha inteira: 5 páginas × 7 larguras × 3 densidades × 5
construções, **525 células**. As capturas são um subconjunto: as cinco páginas a
390 e a 1280 em todas as densidades, mais o varrimento das outras cinco larguras
a 2× nas duas páginas das pranchas. 53 PNG por construção, 265 ao todo. As
células que não têm retrato têm todas as medidas.

O que ficou de fora: 1280 a 3×, que não é ecrã de ninguém, e as páginas fora das
pranchas nas larguras intermédias. 525 PNG de janela cheia eram perto de cento e
quarenta megabytes.

## 5 · Os ficheiros

| ficheiro | o que é |
|---|---|
| `RUBRICA.md` | a §2 do brief, fixada antes de qualquer captura |
| `TABELA.md` | a tabela das oito linhas, gerada |
| `MEDIDAS.json` | tudo, por família, com as provas dos detetores |
| `MEDIDAS-tipo.json` | o que está dentro de cada ficheiro (features, `fvar`, OS/2) |
| `MEDIDAS-aberturas.json` | a medida 3 por família, a 1×, 3×, 6× e 12× |
| `medidas/<combinacao>.json` | as 105 células de cada construção |
| `capturas/<combinacao>/` | os PNG, e os recortes de que saíram os números da medida 2 |
| `PRANCHA-390.png` · `PRANCHA-1280.png` · `PRANCHA-ALGARISMOS.png` | as pranchas |
| `tipos/<familia>/` | os TTF de montante, os WOFF2 latinos e o `OFL.txt` de cada um |
| `tipos/ORIGEM.md` | de onde veio cada byte, e o commit fixado |
| `tipos/SUBCONJUNTOS.json` | bytes e SHA-256 de cada subconjunto |
| `programa/` | o que fez tudo isto |

### As licenças

Todas **SIL Open Font License 1.1**, com o ficheiro ao lado de cada família em
`tipos/<familia>/OFL.txt`, copiado do mesmo commit de onde veio o tipo:

* **Newsreader** · Copyright 2020 The Newsreader Project Authors (Production Type)
* **Source Serif 4** · Copyright 2014 The Source Serif 4 Project Authors (Adobe)
* **Literata** · Copyright 2017 The Literata Project Authors (TypeTogether)
* **Public Sans** · Copyright 2015 The Public Sans Project Authors (USWDS)
* **IBM Plex Sans** · Copyright © 2017 IBM Corp., nome reservado «Plex»

Os controlos não foram descarregados: Spectral, Spectral SC e Bitter entraram
dos WOFF2 que o sítio já aloja, lidos de `public/tipos` e nunca escritos, com as
licenças onde já estavam. **Nenhum tipo comercial foi buscado. Nenhum byte foi
escrito em `public/tipos`.**
