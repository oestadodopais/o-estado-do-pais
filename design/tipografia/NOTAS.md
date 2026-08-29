> **Aviso do lugar de direção (29.08.2026, depois da leitura cruzada).** Esta é a primeira ronda do estudo e não é de decisão: a leitura cruzada (`LEITURA-CODEX-2026-08-29.md`) mostrou que a rubrica não foi aplicada à letra (a medida 3 a 12× e não a 1×, a medida 2 só a duas larguras, a medida 1 das unidades do tipo, a medida 8 por fazer) e que a ordem de preferência foi decidida depois de medir. As eliminatórias e os números ficam; a ordem não. A segunda ronda corre com as fontes de teste comerciais, a rubrica à letra e a ponderação fixada antes.
>
> **A segunda ronda está feita e está na §6 deste ficheiro** (29.08.2026, `ADENDA-2-segunda-ronda.md`). O que se segue até à §5 é a primeira ronda, guardada tal como a leitura cruzada a leu, e a §3 dela (a ordem de preferência) foi **substituída** pela §6.4. Os números da primeira ronda que a segunda voltou a medir estão corrigidos lá, e onde diferem manda a segunda.
>
> **O estudo fechou a 29.08.2026 sem mudança, por decisão do diretor (`DECISIONS.md` §1.85).** A segunda leitura cruzada (`LEITURA-CODEX-2-2026-08-29.md`) mostrou que a ordem da §6.4 não serve para decidir: o peso 5 ordenou por uma estatística que a adenda não fixou, e a Ledger e a Newsreader só estão na tabela por duas decisões do lugar de direção posteriores à adenda. Lida à letra, a adenda deixa Source Serif 4, Literata e Spectral, com o traço mais fino empatado a 1 px. A Spectral e a Bitter ficam; o Parnaso e a Sebenta esperam o pacote de teste do diretor. As capturas brutas das células (`capturas/` e `capturas-2/`, 76 MB) saíram do repositório e estão em `~/Desktop/tipografia-estudo/capturas-brutas/` na máquina do diretor; as pranchas, os JSON das medidas e os programas ficam.

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

---

# 6 · SEGUNDA RONDA (29.08.2026)

*Escrita pelo construtor (Claude Opus 5), no mesmo ramo e na mesma cópia, depois
da leitura cruzada (`LEITURA-CODEX-2026-08-29.md`) e contra a
`ADENDA-2-segunda-ronda.md`, que fixou a ponderação por escrito antes de esta
ronda medir seja o que for. A §3 da primeira ronda (a ordem de preferência) fica
substituída pela §6.4. Continua a não ser uma decisão de compra: o Parnaso e a
Sebenta não existem em ficheiro, e as suas colunas estão vazias e ditas vazias.*

## 6.0 · O que esta ronda corrige, ponto por ponto

A leitura cruzada fez seis reparos e apanhou as duas plantas. Esta ronda responde
a cada um, e o que responde está no programa e não numa frase:

| o reparo | o que esta ronda faz | onde se confere |
|---|---|---|
| a medida 3 foi lida a 12× e ordenada por aí, quando a rubrica pede 1× | a medida 3 é lida a 17 px e 1×, e é essa que ordena, ou não ordena. As leituras de 3×, 6× e 12× ficam no ficheiro, ditas como contexto e fora da conta | `MEDIDAS-2-aberturas.json`, `programa/aberturas.mjs` |
| a medida 2 só correu a 390 e a 1280 | a medida 2 corre a 1× nas sete larguras e nas cinco páginas: 35 células por família, cada uma com o seu recorte no disco. 378 recortes de píxeis ao todo | `MEDIDAS-2-celulas.json`, `capturas-2/*/recorte-*` |
| o JSON declarava 525 células e não trazia nenhuma | `MEDIDAS-2-celulas.json` traz uma linha por combinação × página × largura × densidade: 630 células, seis construções | `MEDIDAS-2-celulas.json` |
| a medida 6 ficava vazia para o instrumento sem exclusão dita | a medida 6 do instrumento mede a ficha do aparelho da linha do livro-razão, que é a tabela dessa página composta em `--f-instr`, e o resultado está na tabela (e é ele que a põe a pesar zero) | linha «6 · altura da ficha do aparelho» |
| a medida 1 vinha das unidades do tipo | a medida 1 é lida no navegador, e o detetor recusa dar número quando o tipo pedido não pesou na composição | `programa/provas.mjs`, linha «1 · o ficheiro menos o ecrã» |
| as pranchas traziam duas páginas | as pranchas trazem as cinco, em seis colunas, e as capturas são feitas com a página no topo, para que as colunas mostrem o mesmo pedaço | `PRANCHA-2-390.png`, `PRANCHA-2-1280.png` |
| a ordem foi decidida depois de medir | a ponderação está na adenda, escrita antes; a conta está num programa que só a aplica | `ADENDA-2-segunda-ronda.md` §1.2, `programa/ordem.mjs`, `ORDEM-2.md` |
| o motor e a versão não estavam declarados | Chromium do Playwright 148.0.7778.96, em `darwin`, escrito em cada ficheiro de medidas | campo `motor` de todos os JSON |
| a comparação de bytes misturava pacotes e itálicos por examinar | a medida 7 conta os estilos que a folha do sítio compõe hoje, no mesmo subconjunto, e diz o que cada pacote carrega a mais | §6.7 |
| a prancha dos algarismos estava a 15 px | a prancha nova compõe a 13,5 px e a 12 px, com a razão medida ao lado | `PRANCHA-2-ALGARISMOS.png`, §6.6 |

E acrescenta uma coisa que a leitura cruzada não pediu e a regra do brief exigia:
**todos os detetores desta ronda veem um vermelho plantado antes de escreverem um
número**, e não só os das medidas 2, 3 e 4. Está em `programa/provas.mjs`, corre
antes da régua e pára a corrida se algum falhar.

## 6.1 · A ponderação, e o que ela não fixou

A adenda fixou os pesos antes de qualquer captura desta ronda:

> a ordem final é a soma ponderada 5·(a) + 3·(b) + 3·(c) + 2·(d) + 1·(e)

com (a) a solidez do traço mais fino a 1× (medida 2), (b) as aberturas a 17 px e
1× (medida 3), (c) a densidade a 390 × 844 (medida 6), (d) a altura de x a 17 px
no navegador (medida 1) e (e) os bytes normalizados (medida 7). Cada medida dá
uma classificação de 1 a n; a soma mais baixa é o primeiro lugar; um empate
diz-se empate; e uma medida que não distinga as famílias pesa zero.

**O que a adenda não fixou foi o sentido de cada medida**, isto é, qual dos
extremos é o primeiro lugar, e sem isso não há classificação nenhuma. Três não
têm discussão: mais tinta na haste de um píxel é melhor, uma abertura maior é
melhor, menos bytes é melhor. Dois são uma escolha, e ficam escritos como
escolha, no cabeçalho de `programa/ordem.mjs` e aqui:

* **(c) a densidade**, ordenada por mais caracteres no ecrã na prosa e por uma
  ficha mais baixa no instrumento. A folha do sítio fixa o corpo e a entrelinha;
  o que a família muda é o que cabe. A objeção é conhecida e este número não a
  resolve: uma linha mais longa também é mais difícil de ler.
* **(d) a altura de x**, ordenada por maior, porque a 17 px num telemóvel o que
  se lê é a altura de x e não o em. Vale a mesma objeção.

Para as duas, o `ORDEM-2.md` traz a soma com o sentido invertido ao lado. **Nos
dois lugares a ordem invertida é a mesma que a direita**, o que quer dizer que
esta escolha não decidiu nada nesta ronda. Se um dia decidir, fica visto.

A classificação é de competição: valores iguais recebem o mesmo lugar e o lugar
seguinte salta (1, 2, 2, 4). E uma medida só pesa se **ler todas as candidatas**:
se classificasse só as que lhe deram número, as outras não somavam essa parcela e
apareciam na frente por lhes faltar uma medida. Esta regra está escrita no
programa antes de a conta correr, e vale para as cinco medidas por igual.

## 6.2 · As eliminatórias, e uma regra que mudou depois da adenda

A adenda escreveu duas eliminatórias: **algarismos tabulares (`tnum`) para o
instrumento** e **versaletes (`smcp` ou família irmã alojada) para a prosa**.

A primeira aplica-se e tira a IBM Plex Sans, como na primeira ronda: a variável
de montante não declara `tnum`, e não é o subconjunto que a estragou.

A segunda mudou. Lida à letra, deixava a Newsreader e a Ledger fora da ordem por
não terem `smcp`. **O lugar de direção decidiu, depois da adenda, que uma
candidata sem versaletes próprios entra com o tratamento da Spectral SC e com a
penalização correspondente na ponderação.** É o que se fez: entram, a linha 5 diz
«não · Spectral SC», e a penalização é medida e não declarada, porque o custo
desse tratamento são os dois ficheiros de Spectral SC que a família arrasta, 96,7
KiB em latim, e esses aparecem na medida (e). Quem preferir a leitura literal da
adenda risca a Newsreader e a Ledger da tabela da §6.4 e fica com a ordem das
outras três, que não muda entre si.

## 6.3 · A tabela, aplicada à letra

| medida | Spectral | Newsreader | Source Serif 4 | Literata | Ledger | Parnaso Standard | Parnaso Small | Bitter | Public Sans | IBM Plex Sans | Sebenta |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 · altura de x a 17 px, no navegador (px) | 7.65 | 7.36 | 8.22 | 8.63 | 8.24 | — | — | 9.04 | 8.79 | — | — |
| 1 · altura de x a 15 px, no navegador (px) | 6.75 | 6.71 | 7.33 | 7.61 | 7.28 | — | — | 7.98 | 7.75 | — | — |
| 1 · altura de x a 13,5 px, no navegador (px) | 6.08 | 6.19 | 6.65 | 6.85 | 6.55 | — | — | 7.18 | 6.98 | — | — |
| 1 · x/em no ecrã a 17 px | 0.450 | 0.433 | 0.483 | 0.507 | 0.485 | — | — | 0.532 | 0.517 | — | — |
| 1 · x/em do ficheiro (para contraste) | 0.450 | 0.426 | 0.475 | 0.507 | 0.487 | — | — | 0.522 | 0.517 | 0.516 | — |
| 1 · o ficheiro menos o ecrã, a 17 px (px) | 0.000 | -0.122 | -0.140 | -0.007 | 0.034 | — | — | -0.164 | 0.000 | — | — |
| 2 · traço sólido mais fino a 1× (px) | 1 | 1 | 1 | 1 | 1 | — | — | 1 | 1 | — | — |
| 2 · tinta mediana numa corrida de 1 px (35 células) | 0.317 | 0.323 | 0.421 | 0.358 | 0.540 | — | — | 0.183 | 0.123 | — | — |
| 2 · a pior célula das 35 | 0.121 | 0.242 | 0.235 | 0.121 | 0.344 | — | — | 0.076 | 0.087 | — | — |
| 2 · a melhor célula das 35 | 0.522 | 0.391 | 0.630 | 0.460 | 0.630 | — | — | 0.698 | 0.698 | — | — |
| 2 · células em que desaparece | 32 de 35 | 35 de 35 | 27 de 35 | 35 de 35 | 10 de 35 | — | — | 21 de 28 | 19 de 28 | — | — |
| 3 · abertura «e» a 17 px e 1× (px) | — | 1 | 1 | — | 1 | — | — | — | — | — | — |
| 3 · abertura «a» a 17 px e 1× (px) | — | — | — | — | — | — | — | — | — | — | — |
| 3 · abertura «s» a 17 px e 1× (px) | — | — | — | — | — | — | — | — | — | — | — |
| 3 · a mesma «e» a 12×, ÷ 12 (contexto, fora da ordem) | 2.25 | 2.58 | 1.92 | 2.08 | 1.58 | — | — | 1.92 | 1.08 | 1.08 | — |
| 3 · peso a que a abertura foi medida | 400 | 400 | 400 | 400 | 400 | — | — | 600 | 600 | 600 | — |
| 4 · feature `tnum` | sim | sim | sim | sim | NÃO | — | — | sim | sim | NÃO | — |
| 4 · variância de «0»–«9» a 15 px, no ficheiro, com `tnum` | 0.0000 | 0.0000 | 0.0000 | 0.0000 | — | — | — | 0.0000 | 0.0000 | — | — |
| 4 · a mesma, sem `tnum` (os algarismos por defeito) | 0.0000 | 0.0000 | 0.0000 | 0.4344 | 0.2535 | — | — | 1.1446 | 0.9174 | 0.0000 | — |
| 4 · variância na página a 13,5 px (só o instrumento) | — | — | — | — | — | — | — | 0.0000 | 0.0000 | — | — |
| 4 · a mesma, tirados os tabulares (o vermelho) | — | — | — | — | — | — | — | 0.6014 | 0.8043 | — | — |
| 5 · versaletes `smcp` | sim | não · Spectral SC | sim | sim | não · Spectral SC | — | — | sim | não · Spectral SC | não · Spectral SC | — |
| 6 · linhas por ecrã a 390 × 844 (prosa) | 26 | 27 | 28 | 30 | 30 | — | — | — | — | — | — |
| 6 · caracteres por linha | 36.2 | 36.2 | 33.6 | 30.2 | 30.2 | — | — | — | — | — | — |
| 6 · caracteres no ecrã | 942 | 977 | 940 | 907 | 907 | — | — | — | — | — | — |
| 6 · altura da ficha do aparelho a 390 px (instrumento) | — | — | — | — | — | — | — | 416.8 | 416.8 | — | — |
| 6 · pares dela que cabem no ecrã | — | — | — | — | — | — | — | 7 de 7 | 7 de 7 | — | — |
| 7 · ficheiros que o sítio carregaria | 7 | 4 | 2 | 2 | 3 | — | — | 1 | 1 | 1 | — |
| 7 · total em KiB (WOFF2 latino) | 340.7 | 503.1 | 440.1 | 471.7 | 111.0 | — | — | 64.6 | 33.4 | 98.3 | — |
| 7 · o sítio inteiro, com a Bitter, em KiB | 405.3 | 567.7 | 504.8 | 536.3 | 175.6 | — | — | — | — | — | — |
| 8 · leitura cega | direção | direção | direção | direção | direção | — | — | direção | direção | direção | — |

**Como ler a linha 1.** É a única linha desta ronda que se pode comparar
diretamente com a da primeira, e diferem: a primeira ronda pôs na tabela
`sxHeight / unitsPerEm` do ficheiro, esta lê `canvas.measureText` com o tipo
carregado. A diferença não é ruído e não é igual para toda a gente: é 0,000 px na
Spectral e na Public Sans, que não têm eixo ótico, e 0,122 na Newsreader, 0,140
na Source Serif 4 e 0,164 na Bitter, que têm. A razão x/em de um ficheiro é uma
só; a do ecrã muda com o corpo, porque a 17 px o navegador pede ao tipo o desenho
de 17. Está plantado como caso conhecido em `provas.mjs`: num tipo sem `opsz` a
altura de x a 15 px é 15/17 da de 17 px; num tipo com `opsz` não é.

**Como ler a linha 2.** A 17 px e 1× o traço sólido mais fino é **um píxel em
todas as famílias**: esse número não separa ninguém e está na tabela por ser o
que a rubrica pede. O que separa é quanta tinta o navegador põe nesse píxel, e
esta ronda mede-o em 35 células por família em vez de 10. A Ledger põe 0,540 de
mediana, a Source Serif 4 0,421, a Literata 0,358, a Newsreader 0,323 e a
Spectral 0,317. A linha «células em que desaparece» diz o mesmo de outro modo: a
mediana das corridas de um píxel fica abaixo de meio em 10 das 35 células da
Ledger, em 27 das 35 da Source Serif 4, em 32 das 35 da Spectral e em **todas as
35** da Newsreader e da Literata.

**Como ler a linha 3, que é a linha que não mede nada.** A rubrica pede a
abertura a 17 px e **1×**, e a 1× a régua devolve `null` para «a» e «s» em todas
as oito famílias, e devolve 1 px no «e» de três delas. Pior: devolve **1 px no
«o» da Newsreader e da Ledger**, e um «o» não tem abertura nenhuma. O número que
aparece a 1× é a franja de suavização a mudar de lado, e não uma garganta. As
sete larguras dão exatamente a mesma leitura em todas as famílias, o que
confirma que a largura da janela não é uma variável desta medida. A conclusão
está na §6.5 e é a que a adenda previu: a medida pesa zero.

**Como ler a linha 4.** A variância na página só existe nas duas colunas de
instrumento, e a razão é do sítio: as 143 regras que pedem `tabular-nums` (contadas
em `src/styles/*.css`) compõem em `--f-instr`. Numa construção `literata+bitter`
quem desenha os algarismos é a Bitter. O vermelho está ao lado: tirados os
tabulares, a variância a 13,5 px sobe de 0,0000 para 0,6014 na Bitter e para
0,8043 na Public Sans. A Ledger não tem `tnum` e os seus algarismos por defeito
são proporcionais (variância 0,2535 a 15 px no ficheiro); não é eliminatória para
a prosa, porque as tabelas do sítio não se compõem em prosa, e vê-se na prancha.

**Como ler a linha 6.** As cinco prosas ficam entre 26 e 30 linhas por ecrã e
entre 907 e 977 caracteres, ao mesmo corpo e à mesma entrelinha. A diferença
entre a primeira e a última é de 7,7%, e não dos 23% que a primeira ronda
escreveu: aquele número saía de uma medição feita numa posição de rolamento
herdada da largura anterior, e esta mede sempre com o parágrafo de prosa no meio
do ecrã (ver §6.10). No lugar do instrumento a medida dá **416,8 px de altura de
ficha nas duas famílias**, o mesmo número, e por isso não ordena.

## 6.4 · A classificação e a soma ponderada

Isto substitui a §3 da primeira ronda. As tabelas são as de `ORDEM-2.md`,
geradas por `programa/ordem.mjs` a partir de `MEDIDAS-2.json`.

### O lugar da prosa

| família | (a) medida 2, peso 5 | (b) medida 3, peso 0 | (c) medida 6, peso 3 | (d) medida 1, peso 2 | (e) medida 7, peso 1 | soma ponderada |
|---|---|---|---|---|---|---|
| Ledger | 1.º · 0.540 | — · — | 4.º · 907 | 2.º · 8.245 | 1.º · 179852 | **22** (5·1 + 3·4 + 2·2 + 1·1) |
| Source Serif 4 | 2.º · 0.421 | — · — | 3.º · 940 | 3.º · 8.215 | 3.º · 516872 | **28** (5·2 + 3·3 + 2·3 + 1·3) |
| Literata | 3.º · 0.358 | — · — | 4.º · 907 | 1.º · 8.626 | 4.º · 549200 | **33** (5·3 + 3·4 + 2·1 + 1·4) |
| Newsreader | 4.º · 0.323 | — · — | 1.º · 977 | 5.º · 7.364 | 5.º · 581340 | **38** (5·4 + 3·1 + 2·5 + 1·5) |
| Spectral | 5.º · 0.317 | — · — | 2.º · 942 | 4.º · 7.650 | 2.º · 415008 | **41** (5·5 + 3·2 + 2·4 + 1·2) |
| Parnaso Standard | — | — | — | — | — | — |
| Parnaso Small | — | — | — | — | — | — |

**As medidas que pesaram zero.**

* **(b) medida 3**, as aberturas de «e», «a» e «s» a 17 px e 1×: peso 3 na adenda, **peso 0** aqui. nenhuma família deu valor a esta medida.

O peso total que de facto ordenou foi 11 dos 14 da adenda.

**Empates dentro de uma medida:** (c) medida 6: Literata e Ledger no 4.º lugar. Um empate é um empate.

**Sem empates na soma final.**

**Com os sentidos de (c) e (d) invertidos** a ordem seria Ledger > Source Serif 4 > Literata > Newsreader > Spectral, que é a mesma: a escolha do sentido não decidiu nada.

**Os números a bater**, para o Parnaso e a Sebenta quando o pacote de teste existir:

| medida | o que é | o número a bater | de quem | sentido | peso |
|---|---|---|---|---|---|
| (a) medida 2 | a solidez do traço mais fino a 1× (tinta mediana numa corrida de 1 px) · cobertura de 0 a 1, mediana das células de 1× (cinco páginas × sete larguras) | **0.5399** | Ledger | maior é melhor | 5 |
| (b) | — | — | — | — | — |
| (c) medida 6 | a densidade de leitura a 390 × 844 (caracteres no ecrã) · caracteres estimados num ecrã de 390 × 844, na página de leitura | **977** | Newsreader | maior é melhor | 3 |
| (d) medida 1 | a altura de x a 17 px, medida no navegador · píxeis de altura de x | **8.6262** | Literata | maior é melhor | 2 |
| (e) medida 7 | os bytes do sítio, normalizados · bytes do sítio inteiro, com a Bitter | **179852** | Ledger | menor é melhor | 1 |

### O lugar do instrumento

| família | (a) medida 2, peso 5 | (b) medida 3, peso 0 | (c) medida 6, peso 0 | (d) medida 1, peso 2 | (e) medida 7, peso 1 | soma ponderada |
|---|---|---|---|---|---|---|
| Bitter | 1.º · 0.183 | — · — | — · 416.800 | 1.º · 9.038 | 2.º · 66164 | **9** (5·1 + 2·1 + 1·2) |
| Public Sans | 2.º · 0.123 | — · — | — · 416.800 | 2.º · 8.789 | 1.º · 34244 | **15** (5·2 + 2·2 + 1·1) |
| Sebenta | — | — | — | — | — | — |
| IBM Plex Sans | — | — | — | — | — | fora |

**As medidas que pesaram zero.**

* **(b) medida 3**, as aberturas de «e», «a» e «s» a 17 px e 1×: peso 3 na adenda, **peso 0** aqui. nenhuma família deu valor a esta medida.
* **(c) medida 6**, a densidade do aparelho a 390 × 844 (a altura da ficha da linha do livro-razão): peso 3 na adenda, **peso 0** aqui. todas as famílias leem o mesmo valor (416.8).

O peso total que de facto ordenou foi 8 dos 14 da adenda.

**Sem empates na soma final.**

**Com os sentidos de (c) e (d) invertidos** a ordem seria Bitter > Public Sans, que é a mesma: a escolha do sentido não decidiu nada.

**Os números a bater**, para o Parnaso e a Sebenta quando o pacote de teste existir:

| medida | o que é | o número a bater | de quem | sentido | peso |
|---|---|---|---|---|---|
| (a) medida 2 | a solidez do traço mais fino a 1× (tinta mediana numa corrida de 1 px) · cobertura de 0 a 1, mediana das células de 1× (cinco páginas × sete larguras) | **0.1835** | Bitter | maior é melhor | 5 |
| (b) | — | — | — | — | — |
| (c) medida 6 | a densidade do aparelho a 390 × 844 (a altura da ficha da linha do livro-razão) · píxeis de altura da ficha do aparelho | **416.8** | Bitter | menor é melhor | 0 · não ordenou nesta ronda |
| (d) medida 1 | a altura de x a 17 px, medida no navegador · píxeis de altura de x | **9.0384** | Bitter | maior é melhor | 2 |
| (e) medida 7 | os bytes do sítio, normalizados · bytes da família | **34244** | Public Sans | menor é melhor | 1 |

**O que esta ordem não diz.** Diz o que a ponderação da adenda dá com as medidas
que esta ronda conseguiu ler, e mais nada. Quatro coisas ficam claras ao lado
dela:

1. **Três dos catorze pesos não ordenaram.** No lugar da prosa ordenaram 11 dos
   14; no do instrumento, 8 dos 14. Uma soma feita com 8 dos 14 pesos é uma
   ordem com menos matéria do que a adenda contava.
2. **A Ledger ganha dois dos quatro pesos que contaram, e ganha os dois pela
   mesma razão.** É um desenho pesado, de contraste baixo e um só ficheiro
   estático: o traço grosso é o que lhe dá a medida 2, e o ficheiro pequeno é o
   que lhe dá a medida 7. O ficheiro é pequeno porque não tem os pesos 500, 600 e
   700 nem o itálico que o sítio compõe: os 111,0 KiB dela contra os 471,7 KiB da
   Literata não são o mesmo produto mais barato, são um produto com menos coisa
   dentro. O que o navegador põe no lugar do que falta está na prancha.
3. **A Ledger e a Newsreader só estão nesta tabela por uma decisão posterior à
   adenda** (§6.2). Pela adenda à letra, ambas ficavam fora por não terem
   versaletes.
4. **A medida que mais pesa é a que a primeira ronda também considerou decisiva**,
   e continua a ser uma medida de um caso: ecrãs de 1×. A 2× e a 3× o problema
   que ela mede não existe, e a maior parte dos leitores está lá. A adenda deu-lhe
   5 de 14, e é o que está feito; quem quiser outra ponderação escreve-a antes de
   olhar, como esta foi escrita.

## 6.5 · As medidas que pesaram zero, e porquê

**(b) A medida 3, as aberturas a 17 px e 1×, nos dois lugares. Peso 3 na adenda,
peso 0 aqui.** A adenda previu-o com estas palavras: «se a 1× a medida não
distingue as famílias, di-lo e a medida pesa zero». Não distingue. A 17 px e 1×
uma garganta de «e» tem menos píxeis do que os três que o detetor exige para
dizer que fechou, e o que a régua devolve é `null` em quase toda a linha. Onde
devolve número, o número não é de fiar: a Newsreader e a Ledger dão **1 px de
abertura no «o»**, que é uma letra sem abertura. A leitura de 12×, que a primeira
ronda usou para ordenar, fica no ficheiro e fora da conta, porque medir a 12× e
chamar-lhe a medida de 1× foi exatamente o reparo da leitura cruzada.

**(c) A medida 6 no lugar do instrumento. Peso 3 na adenda, peso 0 aqui.** A
ficha do aparelho da linha do livro-razão mede **416,8 px de altura com a Bitter
e 416,8 px com a Public Sans**, e os sete pares cabem no ecrã nas duas. O mesmo
número para as duas famílias não ordena nenhuma. A razão é de composição e não de
desenho: os rótulos da ficha são `--f-versal` e os valores são `--f-instr`, e os
valores que lá estão são curtos que chegue para não mudarem de número de linhas
quando a letra muda. Fica dito, e não se substitui por outra medida: substituir
era o que a primeira ronda fez com a medida 3.

**Nenhuma outra pesou zero.** As medidas 2, 6 (prosa), 1 e 7 leram todas as
candidatas e deram valores diferentes.

## 6.6 · O que se viu nas pranchas

Vi as três pranchas com os olhos, recortando-as em pedaços à escala de um para
um, e não só os números que saíram delas. O que se segue é o que a imagem
mostra, e onde há número ele vai ao lado.

**A primeira página, a 390 e 3× (`PRANCHA-2-390.png`, primeira fila).** As seis
colunas mostram a mesma faixa: o título «Portugal ultrapassa 4 limiares...» e a
frase de entrada. O título ocupa cinco linhas nas duas primeiras colunas, e o
que muda é onde ele parte: a Spectral leva o «4» na primeira linha, a Newsreader
empurra-o para a segunda. A frase de entrada ocupa três linhas nas duas.

**A página de leitura, a 390 e 3× (quinta fila).** É a fila onde as cinco prosas
se separam melhor, porque é texto corrido e nada mais.

* **A Ledger é a mais escura e a mais larga.** Onde a Spectral mete «A Prestação
  de Contas é o relato da gestão» numa linha, a Ledger mete «A Prestação de
  Contas é o relato da» e passa «gestão» para a seguinte. O traço é visivelmente
  mais gordo do que o das outras quatro, e é isso que a medida 2 conta.
* **O entretítulo «Quatro limites» da Ledger é um negro fabricado pelo
  navegador**, e vê-se: ao lado do da Literata, que é um peso desenhado, o da
  Ledger é mais rombo e as hastes engrossam por igual em vez de engrossarem onde
  o desenho manda. É o preço de um ficheiro com um só peso, e está na imagem e
  não só na linha 7 da tabela.
* **A Newsreader é a mais estreita e a mais clara.** A mesma faixa mostra mais
  texto do que qualquer outra coluna, o que é o número 1118 da medida 6 visto de
  outra maneira, e a mancha é mais leve.
* **A Source Serif 4 e a Literata ficam no meio**, com a Literata a parecer
  composta num corpo maior sem o estar (é a maior altura de x do estudo, 8,63 px
  a 17 px).

**A linha do livro-razão, a 390 e 3× (quarta fila).** Aqui o que muda é o
instrumento, e há uma consequência de composição que nenhuma medida da rubrica
apanha: **com a Public Sans o valor grande fica mais largo e a palavra «euros»
cai para a linha seguinte**; com a Bitter cabe ao lado do número. O mesmo valor,
o mesmo corpo, e uma linha a mais na cabeça da página.

**O concelho, a 1280 e 2× (`PRANCHA-2-1280.png`, segunda fila).** Os quatro
cartões de figura lado a lado. Os títulos dos cartões («Poder de compra por
habitante», «Desemprego registado») são a 600, e na coluna da Ledger são outra
vez o negro fabricado: mais escuro e mais fechado do que o da Literata ao lado.

**Os algarismos (`PRANCHA-2-ALGARISMOS.png`).** A prancha tem duas partes.

* **O instrumento**, a 13,5 px e a 12 px: a Bitter e a Public Sans alinham as
  colunas nos dois corpos, e a variância medida é zero nos dois. O que a imagem
  acrescenta ao número é a voz: a Public Sans é uma sem serifa numa página que é
  toda de serifa, e isso não é uma medida, é uma decisão.
* **A prosa, ao corpo da prosa**: quatro das cinco candidatas alinham a coluna
  quando se lhes pede `tabular-nums`. **A Ledger não**, porque não tem a feature,
  e a imagem mostra-o sem precisar da tabela: as linhas «2019» e «2020» começam
  em sítios diferentes, e pedir `tabular-nums` não muda nada porque não há nada
  para pedir. Não é eliminatória para a prosa, porque as tabelas do sítio
  compõem-se em `--f-instr`; é um facto sobre a família, e está visto.

## 6.7 · Os bytes, normalizados

A leitura cruzada apontou que a comparação da primeira ronda «mistura sete
ficheiros estáticos de Spectral com pacotes de fonte variável e inclui itálicos
por examinar». A normalização desta ronda é esta, e está medida no sítio
construído e não suposta:

* **Os estilos são os que a folha compõe hoje.** No CSS construído há
  `font-weight` 400 (5 regras), 500 (7), 600 (116) e 700 (4). O itálico usa-se:
  os 6606 ficheiros HTML do sítio trazem **209 `<em>`**, e não há nenhuma regra
  `font-style: normal` fora dos `@font-face` que o desligue. Os 156 `<i>` do sítio
  não contam para o itálico: são pontos de legenda (`.legend-dot i` põe-lhes
  `display: block` e `border-radius: 50%`). As versais pedem-se em `--f-versal`
  em 22 regras, a 400 e a 600, e por isso os dois ficheiros de Spectral SC contam
  quando a família não tem `smcp`.
* **O subconjunto é o mesmo para todos**: latino mais latino estendido, do mesmo
  `pyftsubset` 4.61.1 com as mesmas bandeiras, incluindo `--layout-features='*'`
  para não perder o `tnum` e o `smcp`. Os bytes e o SHA-256 de cada saída estão
  em `tipos/SUBCONJUNTOS.json`, e o subconjunto é reprodutível: refeito nesta
  ronda, os catorze ficheiros anteriores saíram byte a byte iguais.
* **Um ficheiro variável que sirva os quatro pesos conta uma vez**, porque é uma
  transferência só, e leva escrito o que carrega a mais.

| família | ficheiros | KiB (latim) | o sítio inteiro, com a Bitter | o que carrega a mais, ou a menos |
|---|---|---|---|---|
| Spectral (controlo) | 7 | 340,7 | **405,3** | nada: cada ficheiro serve um estilo que o sítio pede |
| Newsreader | 4 | 503,1 | 567,7 | os pesos 200 a 800 e o eixo `opsz`; e arrasta os dois ficheiros de Spectral SC |
| Source Serif 4 | 2 | 440,1 | 504,8 | os pesos 200 a 900 e o eixo `opsz` |
| Literata | 2 | 471,7 | 536,3 | os pesos 200 a 900 e o eixo `opsz` |
| Ledger | 3 | 111,0 | **175,6** | falta-lhe: os pesos 500, 600 e 700 e o itálico não existem no ficheiro e ficam por conta do navegador; arrasta os dois de Spectral SC |
| Bitter (controlo) | 1 | 64,6 | — | os pesos 100 a 900 |
| Public Sans | 1 | 33,4 | — | os pesos 100 a 900 |

**E o resultado que não precisa de decisão nenhuma continua o mesmo.** O sítio
aloja hoje 711 428 bytes de tipos sem subconjunto, que são 694,8 KiB. Os mesmos
oito ficheiros cortados ao latim dão 415 008 bytes, 405,3 KiB. São **289,5 KiB
por leitor, sem mudar uma letra**.

## 6.8 · A frase de compra condicional

Não há aqui uma recomendação de compra, porque o Parnaso e a Sebenta não foram
medidos: são comerciais, as fontes de teste chegam por um formulário que só o
diretor preenche, e as suas colunas na tabela estão vazias e ditas vazias. O que
há é a condição, medida:

**Para a prosa**, quando o pacote de teste do **Parnaso Standard** e do **Parnaso
Small** existir, corre-se-lhes esta mesma régua e comparam-se estes números:

| medida | peso | o número a bater | de quem é hoje | sentido |
|---|---|---|---|---|
| (a) medida 2 · tinta mediana numa corrida de 1 px, mediana de 35 células | 5 | **0,540** | Ledger | maior |
| (b) medida 3 · aberturas a 17 px e 1× | 0 | não há: a medida não ordenou (§6.5) | — | — |
| (c) medida 6 · caracteres no ecrã a 390 × 844 | 3 | **977** | Newsreader | maior |
| (d) medida 1 · altura de x a 17 px no navegador | 2 | **8,63 px** | Literata | maior |
| (e) medida 7 · o sítio inteiro em bytes, com a Bitter | 1 | **179 852** (175,6 KiB) | Ledger | menor |

E antes de qualquer número: **as eliminatórias**. Um Parnaso sem `tnum` fica fora
do instrumento; um Parnaso sem versaletes entra com a Spectral SC e com os 96,7
KiB dela na medida (e), como a Newsreader e a Ledger.

**Para o instrumento**, quando a **Sebenta** existir:

| medida | peso | o número a bater | de quem é hoje | sentido |
|---|---|---|---|---|
| (a) medida 2 · tinta mediana numa corrida de 1 px, nos algarismos | 5 | **0,184** | Bitter | maior |
| (b) medida 3 · aberturas a 17 px e 1× | 0 | não há: a medida não ordenou | — | — |
| (c) medida 6 · altura da ficha do aparelho a 390 px | 0 | 416,8 px, igual nas duas: a medida não ordenou | — | menor |
| (d) medida 1 · altura de x a 17 px no navegador | 2 | **9,04 px** | Bitter | maior |
| (e) medida 7 · a família em bytes | 1 | **34 244** (33,4 KiB) | Public Sans | menor |

**A frase, em uma linha.** Se o Parnaso Small não puser mais de 0,540 de tinta
numa haste de um píxel a 1×, a compra paga por uma coisa que uma licença OFL já
dá; se puser, o que se compra é a diferença, e a diferença passa a estar medida
em vez de declarada. O mesmo para a Sebenta contra os 0,184 da Bitter. E em
qualquer dos casos, **cortar os tipos de hoje ao latim vale 289,5 KiB e não
depende de compra nenhuma**.

## 6.9 · A Ledger, e porque entrou depois da adenda

A Ledger **não estava na rubrica nem na adenda**. Foi acrescentada pelo lugar de
direção depois de a adenda estar escrita e antes de esta ronda medir, com esta
razão: de entre as famílias livres, é a que declara o propósito mais próximo do
que se procura no Parnaso. A descrição que o `google/fonts` publica com ela diz,
no mesmo commit de onde o ficheiro veio:

> The letter forms are distinguished by a large x-height, sufficient stroke
> contrast, robust but elegant wedge-like serifs and terminals. These features
> have been specially designed to reach maximum of quality and readability when
> used in unfavorable print and display processes, such as in newspapers, laser
> printed documents and on low resolution screens.

Serifas em cunha e ecrãs de baixa resolução são a pergunta deste estudo escrita
por outra pessoa. Entrou pelo mesmo caminho das outras: descarregada do mesmo
commit de `google/fonts` (`ade3d1533e06b2b1462ffcde8e08b129627ca360`, pasta
`ofl/ledger/`), com o seu `OFL.txt` e o seu `METADATA.pb` ao lado, cortada pelo
mesmo `pyftsubset` com as mesmas bandeiras e o mesmo intervalo, medida em todas
as medidas, nas três pranchas e na soma ponderada. Licença SIL OFL 1.1,
Copyright (c) 2012 Denis Masharov, com o nome reservado «Ledger».

**O que ela não traz, e não se emenda no interruptor:** um só peso (400), sem
itálico e sem versaletes, e sem `tnum`. O sítio compõe a prosa a 400, 500, 600 e
700 e usa itálico em 209 sítios. Com a Ledger, os outros três pesos e o itálico
ficam por conta do navegador, que os fabrica engordando e inclinando o regular.
Isso não é uma opinião sobre a letra: é o que a construção `ledger+bitter` faz, e
está nas pranchas, nos entretítulos e nas primeiras frases em negro.

## 6.10 · O método, o motor e a reprodutibilidade

**O motor.** Chromium do Playwright **148.0.7778.96**, em `darwin` (macOS,
arm64). A versão está escrita em `MEDIDAS-2.json`, `MEDIDAS-2-celulas.json` e
`MEDIDAS-2-aberturas.json`, e não numa nota de rodapé. Nada aqui foi visto no
Firefox nem no WebKit, e o descritor `font-feature-settings` no `@font-face`, que
é o que dá os versaletes às candidatas que os têm, continua por confirmar fora
deste motor.

**As provas dos detetores.** `programa/provas.mjs` planta um vermelho a cada
detetor e é corrido pela régua antes da primeira medição e pelo `correr.sh` antes
de tudo. São os treze casos do `pixeis.mjs` (medidas 2 e 3) mais estes:

* **medida 1**: uma família que não existe não dá número nenhum (a régua compara
  a leitura da pilha real com a da mesma pilha sem o primeiro nome, e se derem o
  mesmo recusa); num tipo sem eixo ótico a altura de x a 15 px é 15/17 da de 17
  px; num tipo com eixo ótico não é, e é por isso que a medida se lê no navegador;
* **medida 4**: os mesmos dez algarismos, no mesmo tipo, com e sem
  `tabular-nums`, têm de dar variância zero e variância maior do que zero;
* **medida 6**: um parágrafo plantado com 117 linhas num ecrã de 844 px tem de
  contar 30 e não 117, e a fronteira tem de cair onde a geometria diz; uma tabela
  plantada de sete pares de 200 px tem de contar quatro num ecrã de 844, e uma
  tabela curta tem de contar todos os seus;
* **medida 7**: um nome que não está em `SUBCONJUNTOS.json` **pára** a soma em vez
  de contar zero.

**A posição em que se mede, e uma correção que ela obrigou.** A régua percorre as
sete larguras sem voltar a navegar, e na primeira versão cada largura era medida
onde a anterior tinha deixado a página rolada. A medida 6 contava por isso as
linhas visíveis numa posição herdada, e duas corridas do mesmo programa davam
contagens diferentes. Agora cada célula começa por pôr o parágrafo de prosa no
meio do ecrã e mede aí, e a captura de retrato é tirada com a página no topo.
Isto mudou os números da medida 6 em relação à primeira ronda, e o da §6.3 é o
desta.

**A reprodutibilidade, medida e não afirmada.** Nenhum ficheiro gerado leva
carimbo de relógio. Correndo os programas duas vezes seguidas sobre as mesmas
construções:

* **os derivados saem byte a byte iguais**: `MEDIDAS-2.json`,
  `MEDIDAS-2-celulas.json`, `TABELA-2.md`, `ORDEM-2.json`, `ORDEM-2.md` e as três
  pranchas;
* **o subconjunto sai byte a byte igual**: refeito com a Ledger acrescentada, os
  catorze ficheiros anteriores não mudaram um byte;
* **a régua não sai igual em dois pontos, e são estes.** A construção
  `spectral+publicsans` foi corrida sete vezes seguidas com o programa final,
  sobre a mesma pasta `dist/`. O único campo do JSON que oscilou foi
  `linhas_totais` da primeira página a 1280 (11 ou 13, sobre três parágrafos),
  que nenhuma medida usa, porque o que conta é `linhas_no_ecra`. E em todas as
  comparações de todos os PNG da construção, o único que oscilou foi o retrato da
  página de região a 1280: **468 píxeis de 1 152 000**, todos dentro da figura da
  régua da convergência, que é desenhada por `public/js/convergencia.js` e não
  pela letra. Os recortes de píxeis de onde saem os números da medida 2 nunca
  mudaram. **Regenerar dá os mesmos ficheiros exceto neste retrato e neste
  campo**, e isso diz-se em vez de se arredondar.

## 6.11 · O que continua por medir, e não é por esquecimento

* **O Parnaso e a Sebenta.** São comerciais, não foram buscados, não foram
  medidos, e as quatro colunas ficam vazias e ditas vazias. **Esta ronda não é
  uma decisão de compra**: é a régua aplicada às alternativas livres e o número
  que uma comercial teria de bater em cada medida.
* **Os outros motores.** Tudo isto é o Chromium desta máquina.
* **O aparelho real.** Nenhuma destas capturas foi vista num telemóvel. A 1× de
  um monitor não é a 1× de todos os painéis.
* **O itálico.** Conta para os bytes, porque o sítio o compõe, e nenhuma medida
  lhe toca: nem a 2, nem a 3, nem a 6.
* **O que o navegador fabrica.** A Ledger obriga o Chromium a inventar três pesos
  e um itálico. Isso vê-se nas pranchas e não está medido: não há na rubrica
  nenhuma medida de negro sintético, e não se inventou uma a meio.
* **A leitura cega (medida 8).** É a fase do lugar de direção. As três pranchas
  ficam feitas; a leitura não é minha.

## 6.12 · Os ficheiros da segunda ronda

| ficheiro | o que é |
|---|---|
| `ADENDA-2-segunda-ronda.md` | a ponderação, fixada antes de medir |
| `TABELA-2.md` | a tabela das oito linhas, gerada |
| `ORDEM-2.md` · `ORDEM-2.json` | as classificações, a soma ponderada e os números a bater |
| `MEDIDAS-2.json` | tudo, por família, com as provas dos detetores |
| `MEDIDAS-2-celulas.json` | as 630 células, uma a uma |
| `MEDIDAS-2-tipo.json` | o que está dentro de cada ficheiro (features, `fvar`, OS/2) |
| `MEDIDAS-2-aberturas.json` | a medida 3 por família, a 1× nas sete larguras e a 3×, 6× e 12× |
| `medidas-2/<combinacao>.json` | as 105 células de cada construção, com o motor declarado |
| `capturas-2/<combinacao>/` | os 589 PNG, e os recortes de que saíram os números da medida 2 |
| `PRANCHA-2-390.png` · `PRANCHA-2-1280.png` · `PRANCHA-2-ALGARISMOS.png` | as pranchas, cinco páginas e seis colunas |
| `tipos/ledger/` | a família acrescentada pelo lugar de direção, com o `OFL.txt` e o `METADATA.pb` |
| `programa/provas.mjs` | os vermelhos plantados de todos os detetores |
| `programa/ordem.mjs` | a ponderação da adenda aplicada, e nada mais |

Os ficheiros da primeira ronda (`TABELA.md`, `MEDIDAS*.json`, `medidas/`,
`capturas/`, `PRANCHA-*.png`) ficam onde estão, intactos: foram o que a leitura
cruzada leu, e apagá-los era apagar a prova de que a segunda ronda foi precisa.
Os programas de `programa/` são os da primeira ronda corrigidos, e produzem a
segunda; quem quiser refazer a primeira volta ao commit `a5becee`.
