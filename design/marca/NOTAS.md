# NOTAS · a marca e o ícone do telemóvel

*Escrito a 28.08.2026 pelo construtor (Claude Opus 5) a partir de `BRIEF-marca.md` e das duas adendas do gabinete. Trabalho de exploração: nada disto está no sítio. Sem elogios: o que está escrito é o que se viu nas capturas, e o que se mediu está dito com o número.*

---

## 0 · O que está aqui, e o que não está

**Está:** sete direções em `direcoes/*.svg` (o campo é 512, o sinal cabe em 360), a prancha `PRANCHA.html` com a captura `PRANCHA.png`, os PNG de cada direção em `EXPORT/`, e os dois programas que os fazem.

**Não está:** nenhum ficheiro em `public/`, nenhuma linha no `<head>` de `src/layouts/Base.astro`, nenhum manifesto, nenhuma dependência nova no `package.json`. O sítio no ar continua sem ícone, exatamente como estava. `npm run typecheck` passa, e passava antes: `tsconfig.check.json` não olha para `design/`.

**A ordem em que isto se refaz**, e importa porque a prancha embebe os PNG:

```
python3 design/marca/desenhar.py          # os sete SVG
node   design/marca/exportar.mjs          # 14 PNG por direção
python3 design/marca/desenhar.py prancha  # a prancha, com os PNG lá dentro
node   design/marca/exportar.mjs          # a captura PRANCHA.png
```

`desenhar.py` precisa do `fontTools` do Python do sistema (com `brotli`, para abrir os WOFF2), e só para a medição do «O» do Spectral e para converter o nome a contorno na prancha. Não corre na construção do sítio e não entra no `package.json`. Os SVG já trazem tudo dentro: quem só quiser os ficheiros não precisa de correr nada.

---

## 1 · A licença dos tipos, lida antes de derivar seja o que for

A adenda mandou ler a licença antes de tirar seja o que for de um contorno. Está lida. `public/tipos/spectral/OFL.txt` e `public/tipos/spectral-sc/OFL.txt` são o mesmo ficheiro (resumo MD5 igual: `b1e689237fc4ce45fa29d188bb0c3cf9`), a SIL Open Font License 1.1, com o aviso de direitos de autor `Copyright 2017 The Spectral Project Authors`. O Bitter traz a sua (`db58f5a0efcc29037e31839da245f1f5`), da mesma licença.

O que a licença permite, na letra dela:

> «Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies of the Font Software»

O que ela proíbe, e que aqui interessa:

> «3) No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written permission is granted by the corresponding Copyright Holder.»

O aviso de direitos de autor do Spectral **não declara nome reservado nenhum** (não traz a fórmula «with Reserved Font Name»), e por isso a condição 3 não tem aqui a que se prender. E a condição 5, que obriga uma versão modificada do software do tipo a ficar na mesma licença, exclui expressamente o que se faz com o tipo:

> «The requirement for fonts to remain under this license does not apply to any document created using the Font Software.»

**O que isto quer dizer para este trabalho, e o que se decidiu por causa disso.** Um SVG com contornos de letras é um documento feito com o tipo, e não um tipo modificado. Ainda assim, **nenhuma das sete direções usa contornos do Spectral no sinal**: as letras das direções A, B e G são desenhadas numa grelha própria, ponto a ponto, em `desenhar.py`, e o Spectral entra ali como **medida de referência** (mediu-se-lhe o «O», §4) e não como fonte de contornos. O único sítio onde há contorno tirado do ficheiro do tipo é **o nome «O Estado do País» na marca horizontal da prancha**, composto em Spectral Regular com o espacejamento que `src/styles/site.css` já dá ao `.wordmark` (`letter-spacing: -0.014em`). Isso é composição de um documento, é o que a licença descreve, e o ficheiro do tipo não sai daqui modificado nem renomeado.

`glifos.py` é o programa que faz essa conversão, e está no ramo para que a origem de cada contorno se possa conferir: lê o WOFF2 da casa, tira as larguras da `hmtx` e os pares de `kerning` da GPOS do próprio ficheiro, e não inventa espacejamento nenhum.

---

## 2 · O que «ajustar à cultura portuguesa» quis dizer aqui

A adenda pediu que isto ficasse dito à letra, e fica.

**O que fica de fora, e porquê.**

* **O verde e o vermelho da bandeira.** Fora. As duas cores juntas são a República, e o sítio não é o Estado; separadas, o vermelho é de três órgãos da folha (Público, Economist, Politico) e o verde é do Eco. Um observatório que se pinta com as cores do Estado está a dizer que fala pelo Estado.
* **A esfera armilar e o escudo das quinas.** Fora. São insígnias do Estado, e a 60 px são um borrão: a esfera armilar tem seis aros cruzados, e nenhum deles sobrevive. Além do mais são símbolos com dono, e usá-los seria uma reivindicação de autoridade que este sítio não tem.
* **Qualquer coisa que se pareça com um sítio do Estado.** Conferi os dois que a adenda nomeou. `transparencia.gov.pt` é um anel azul-escuro e âmbar com um sinal de mais no meio, num campo de 48 px. `ine.pt` são dois vistos finos, um azul e um vermelho, num campo branco de 16 px. Nenhuma das sete direções tem anel com sinal de mais, e **nenhuma tem visto**, o que é uma escolha e não um acaso: a direção C do brief pedia «um traço de verificação», e o visto foi trocado pelos dois quadrados do selo justamente porque o visto azul sobre branco é do INE, que por acaso é a fonte principal deste sítio (§5, direção C).

**O que fica dentro, e porquê.**

* **A paleta já é a do azulejo.** Cobalto `#1f4e8c` sobre papel `#f6f7f4` é a paleta azul e branca da faiança portuguesa, e não é uma cor nova: está em `src/styles/tokens.css` desde a v3. Cinco das sete direções usam-na, e a direção D leva-a até ao fim, como peça de cerâmica.
* **O acento agudo do «í» de «País».** É um glifo que a ortografia portuguesa obriga e que a maior parte das marcas evita porque estraga a caixa. A direção B faz dele o traço distintivo da marca, e não um enfeite pousado por cima: o acento nasce da haste do «O», tem a grossura dela, e acaba num corte a direito.
* **As três parcelas com a mesma dignidade.** A direção E não desenha o continente sozinho. O que isso custou está dito na §5.
* **As serifas da casa.** Spectral e Spectral SC são da mesma tradição de que o Público, o Expresso, o Nexo e a Piauí bebem. A letra desenhada (§4) fica dessa família, e fica **mais simples** do que qualquer uma delas, pelas razões da §3.

---

## 3 · A letra a 60 px nos órgãos de língua portuguesa

Olhado na folha do gabinete (`referencias/folha-referencias.png`, 42 ícones, a coluna da direita é 60 px). O que se vê, órgão a órgão:

| Órgão | O que é | A 60 px |
|---|---|---|
| Público | campo vermelho, «P» serifado branco a encher o campo | inteiro, e é o mais forte da folha |
| Expresso | campo azul-petróleo, «E» serifado branco a 55 % | inteiro |
| Negócios | campo branco, «n» de laje preto | o «n» inteiro; a tarja vermelha `negocios.pt` por baixo vira uma mancha |
| Observador | campo azul-claro, anel branco | inteiro |
| RTP | campo azul, «RTP» sem serifa | as três letras aguentam |
| Eco | campo verde, arcos concêntricos | aguenta como alvo, sem detalhe |
| Pordata | disco azul, buraco de fechadura branco | inteiro |
| INE | campo branco, dois vistos finos azul e vermelho | os traços fecham-se: fica um «V» azul com uma pinta vermelha |
| DN | campo branco, «DN» gótico | ilegível |
| Transparência | anel azul-escuro e âmbar com sinal de mais | inteiro |
| Nexo (BR) | campo branco, «N» em duas cores | inteiro |
| Folha (BR) | campo branco, «F» azul de traço fino | inteiro, mas fino |
| Estadão (BR) | campo azul, gravura de um cavaleiro | ilegível |
| Piauí (BR) | ilustração de um pinguim | ilegível |
| Poder360 (BR) | quadrado laranja, anel segmentado e «PODER» | o anel aguenta, a palavra morre |
| Agência Pública (BR) | disco preto, «P» amarelo com um «v» pequeno | o «P» aguenta, o «v» morre |
| Lupa (BR) | campo verde-limão, lupa preta | inteiro |

**A regra que sai daqui:** aguenta uma letra só, ou uma forma fechada só, num campo liso; morre tudo o que seja gravado, ilustrado, ou que traga uma segunda palavra por baixo. Os que aguentam têm todos **um traço só de grossura**, sem transições finas.

**E há um vizinho de nome que convém dizer.** O «Estadão» é «O Estado de S. Paulo». Para um leitor de língua portuguesa, «O Estado do País» tem esse vizinho à distância de uma palavra, e o ícone é o único sítio onde os dois se podem cruzar sem contexto. O Estadão resolve-se com uma gravura azul; a distância mais barata que temos é não usar campo azul cheio com figura branca por cima, e nenhuma das sete o usa.

**Uma consequência para a direção A.** «OE», em Portugal, lê-se **Orçamento do Estado** antes de se ler como monograma. Está dito outra vez na §5, mas é aqui que se percebe porquê: um monograma de duas letras num sítio sobre contas públicas cai dentro de uma sigla que já existe e que é do Estado.

---

## 4 · A letra desenhada da casa

A segunda adenda pediu letra desenhada e não composta, com uma ideia de construção que se repita e que um leitor reconheça sem o tipo instalado. É isto:

### A grelha

| | |
|---|---|
| altura de maiúscula | `H` (é ela que fixa tudo o resto) |
| haste | `T = 0,233 H` |
| fino | `t = 0,100 H` |
| contraste | `T/t = 2,33` |
| contraforma do «O» | rectângulo de `2(R−T)` por `2(R−t)`, cantos ao raio do fino |
| remates | cortados a direito, no horizontal ou no vertical, nunca em ângulo |
| serifas | lajes sem colo, da grossura do fino: uma serifa e um fino pesam o mesmo |

### O que é medido, e não escolhido

O «O» do **Spectral SemiBold** foi medido no ficheiro da casa (`public/tipos/spectral/Spectral-SemiBold.woff2`), com o glifo desenhado a 700 de altura de tinta e contado a píxeis na linha e na coluna do meio: **haste 139 (0,199 H), fino 53 (0,076 H), contraste 2,62**. O Bold dá 165 e 53, contraste 3,11.

A letra desenhada **engrossa a haste** (0,233 contra 0,199) e **engrossa mais o fino** (0,100 contra 0,076), e por isso **baixa o contraste** para 2,33. Não é gosto: a 16 px, um fino de 0,076 H numa maiúscula de 300 unidades, num campo de 512, dá **0,71 px**, e o anel do «O» abre. A 0,100 H dá **0,94 px**, e fecha. O preço é uma letra menos elegante do que o Spectral em corpo de leitura, o que não é problema nenhum: isto nunca aparece em corpo de leitura.

### A ideia, e o que um tipo nunca faria

**Circunferência exata por fora, rectângulo por dentro.** O contorno de fora é uma circunferência, não uma oval de letra; a contraforma é um rectângulo de cantos arredondados, não uma elipse. Nenhum tipo desenha assim um «O», e a razão de ser assim é do sítio: **a contraforma é o quadrado do selo**, que é a forma que o sítio põe ao lado de cada número (`src/components/Provenance.astro`, `.src-chip::before`). A letra fica com o instrumento lá dentro.

A geometria tem uma condição que a fixou: com haste a 0,20 H, a diagonal a 45 graus do rectângulo ficava a 22,7 unidades da circunferência, mais fina do que o fino, e a letra tinha um sítio fraco onde nenhum tipo o tem. A 0,233 H a diagonal dá 36,7, acima do fino. **A haste está a 0,233 porque a contraforma é recta**, e não ao contrário.

E há uma segunda ideia, só na direção B: **o acento agudo funde na haste**. Não é um acento pousado por cima da letra: é um traço que sai do ombro direito, com 0,72 da grossura da haste, e que acaba num corte perpendicular ao seu próprio eixo. A medida da fusão está medida: a 60 px a marca da direção B tem **uma só ilha de tinta** (contadas as componentes ligadas na captura), o que é a prova de que o acento e a letra são uma peça e não duas.

### O que sobrevive a 16 px, e o que não

**Não sobrevive.** O canto recto da contraforma não chega a um píxel a 16 (o raio do canto é 30 unidades em 512, ou seja 0,94 px), e as lajes de remate do «E» também não. A ideia distintiva **morre a 16 px**, e a 32 já está a ceder.

**A simplificação que a mantém**, e que está feita: cada direção tem **dois desenhos no mesmo ficheiro**, e `svg[data-forma="favicon"]` troca um pelo outro. No desenho de 32 e 16, a contraforma passa a oval (uma oval de 5 por 7 px lê-se melhor do que um rectângulo de cantos que já não existem) e as serifas de remate saem. É a mesma forma com menos, e nunca outra forma, como o brief pede. O que fica a 16 é a proporção, o contraste e o peso, que é o que um favicon consegue dizer.

---

## 5 · As sete direções

Os números de legibilidade abaixo estão **medidos nas capturas de `EXPORT/`**, não estimados: para cada PNG contaram-se as componentes ligadas de tinta (quantas manchas separadas o olho tem de juntar) e as corridas de píxeis de tinta em linha e em coluna (a mais curta é a peça mais frágil do desenho).

| | 60 px: ilhas | 60 px: corrida mínima | 60 px: mediana | 16 px: ilhas |
|---|---|---|---|---|
| A · ligadura OE | 1 | 2 px | 5 px | 1 |
| B · O com acento | 1 | 2 px | 7 px | 1 |
| C · selo | 13 | 2 px | 4 px | 2 |
| D · azulejo | 7 | 2 px | 2 px | 2 |
| E · mapa | 10 | 1 px | 2 px | 3 |
| F · régua | 1 | 8 px | 8 px | 1 |
| G · selo no O | 2 | 3 px | 10 px | 2 |

A mediana é o número que mais diz. Uma mediana de 2 px quer dizer que **metade do desenho é fio**, e um fio de 2 px a 60 desaparece com a primeira compressão ou com o primeiro fundo escuro.

### A · a ligadura «OE» (`direcoes/1-ligadura-oe.svg`)

**O que tenta.** As duas iniciais soldadas numa letra só: a haste do «E» é a haste direita do «O». Duas letras encostadas leem-se como sigla; soldadas leem-se como uma marca. A ligadura existe no alfabeto latino («Œ»), e o que é nosso é a construção: a contraforma recta e o corte a direito dos remates.

**O que se viu a 60 px.** Lê-se «Œ», inteira, com as três hastes do «E» separadas. A medição confirma a solda: **uma só ilha de tinta**. É a mais escura das sete depois da G (17,8 % do campo com tinta).

**O que arrisca.** Duas coisas, e a primeira é séria: **«OE» é o Orçamento do Estado**. Num sítio sobre contas públicas, isso não é uma ambiguidade, é uma leitura primeira. A segunda é a folha: o «E» serifado branco sobre campo escuro é do Expresso e do Economist, e o «Œ» tem a mesma anatomia, só que a tinta sobre papel, que é o lado contrário do contraste.

**Em escuro.** Sem problema: papel e tinta trocam e a letra fica branca sobre `#15171a`. É a que melhor aguenta a troca, porque não tem cor nenhuma para se defender.

**A 16 px.** Uma mancha só, com o vazio da contraforma ainda a ver-se. Reconhece-se como letra, não se identifica como «Œ».

### B · o «O» com o acento do «País» (`direcoes/2-o-acento.svg`)

**O que tenta.** A inicial única, com o acento agudo do «í» de «País» fundido no ombro direito, na grossura da haste, cortado a direito na ponta. É a única das sete que traz o português para dentro da forma.

**O que se viu a 60 px.** O anel lê-se inteiro, o traço azul lê-se inteiro, e **são uma peça só** (uma ilha). A corrida mediana de 7 px é a segunda melhor da série. O acento tem 5,4 px de largura a 60, e o fino do anel 3,2 px.

**Cinco variantes foram desenhadas e vistas a 60 antes de escolher esta.** Com o acento à grossura toda da haste e curto, lê-se como uma bandeira espetada; a 45 graus, lê-se como **cabo de lupa**, que é exatamente a marca da Lupa, que está na folha; a 62 graus e fino, lê-se como alfinete; solto da letra, a marca parte-se em dois objetos. A escolhida (58 graus, comprimento 0,52 H, largura 0,72 da haste) é a que lê como acento.

**O que arrisca.** O anel sozinho é do Observador, e a distância aqui é de campo (papel, e não azul) e de forma (uma letra de contraste modulado com contraforma recta, e não um anel de grossura constante). E mesmo com 58 graus, um círculo com um traço em diagonal ainda tem a lupa por vizinha.

**Em escuro.** O acento passa de cobalto `#1f4e8c` para `#7fa6dc`, que é o que `tokens.css` já manda para a palavra do estado em papel escuro (7,18:1 contra 2,16:1 do cobalto escuro). Sem esta troca o acento desaparecia no papel escuro, e isso está medido na folha de estilos do sítio, não aqui.

**A 16 px.** Uma ilha: o anel com uma pinta azul no canto. O acento continua a ver-se como cor, não como traço.

### C · o selo (`direcoes/3-selo.svg`)

**O que tenta.** Os dois estados da prova, que é a distinção que o sítio faz em cada linha: o quadrado cheio (proveniência completa) e o quadrado a tracejado (falta um campo). Não é um carimbo: são dois estados lado a lado.

**A troca que se fez ao brief, e a razão.** O brief pedia «um traço de verificação». Não há visto nenhum nesta direção, e é de propósito: **o ícone do INE são dois vistos**, e o INE é a fonte principal deste sítio. Um visto azul sobre campo claro seria, para um leitor português de dados, o ícone do INE. O selo do sítio, esse, é literalmente um quadrado (`.src-chip::before`: 7 px, cheio ou a tracejado), e é o que está desenhado.

**Também não leva âmbar**, e o brief pedia-o como estado. Na gramática do sítio o âmbar quer dizer «fora do limiar», e não «incompleto» (`tokens.css`, e a §2 da constituição). Usá-lo no quadrado a tracejado seria juntar duas coisas que o sítio separa.

**O que se viu a 60 px.** O quadrado cheio lê-se; o tracejado lê-se como tracejado, com os riscos ainda separados (**13 ilhas**: um quadrado e doze riscos). Cada risco tem 4 px de comprimento e 3 px de grossura a 60.

**O que arrisca.** Um quadrado cheio e um quadrado a tracejado, na diagonal, é o desenho de «selecionar» ou «duplicar» em qualquer aparelho de computador. E a 32 px o tracejado fecha-se numa linha cinzenta: por isso o desenho de favicon troca o tracejado por **contorno inteiro**, que continua a dizer «este está por fechar» sem fingir riscos que já não existem.

**Em escuro.** Boa: o quadrado a tracejado passa a claro sobre papel escuro e fica mais nítido do que em claro.

### D · a peça, como azulejo (`direcoes/4-azulejo.svg`)

**O que tenta.** O que a adenda pediu: quadrado, fio fino, cobalto sobre papel, a medida dentro. O fio dá a volta toda; nos quatro cantos há quadrados pequenos, que num pano de azulejo são o que faz o motivo quando as peças se juntam; no meio está a medida da peça do sítio, a linha do valor por cima e a régua fina por baixo.

**Lê como azulejo ou como célula de folha de cálculo?** **Como célula.** É a resposta honesta, e é a resposta a 60 px: o que se vê é um rectângulo com um fio à volta, quatro pontos nos cantos e uma barra lá dentro, e a leitura primeira é uma caixa de diálogo ou uma célula selecionada. Os quatro cantos ajudam, e não chegam. A medição diz porquê: **mediana de 2 px**, ou seja, metade do desenho é fio, e é dos fios que vem o ar de interface. Um azulejo verdadeiro tem pincelada, e uma pincelada a 60 px é uma mancha.

**O que arrisca**, além disso: é a direção que menos diz o nome do sítio. Não tem letra, não tem território, e o instrumento que traz (uma barra e um fio) não é reconhecível fora daqui.

**Em escuro.** Aguenta, mas o fio azul sobre papel escuro fica com menos peso do que sobre papel claro, e a peça parece mais vazia.

**A 16 px.** Ficam duas ilhas: o fio, engrossado a 1,6 vezes no desenho de favicon, e a barra do valor. Os cantos e a régua saem, porque a 16 px eram meio píxel.

### E · o mapa, as três parcelas (`direcoes/5-mapa.svg`)

**O que tenta.** Continente, Açores e Madeira com a mesma dignidade, nas silhuetas do próprio mapa do sítio (`mapa/pais.json`, o mesmo ficheiro que desenha o mapa dos distritos).

**O caminho que se fez, porque a primeira resposta estava errada.** Desenharam-se quatro versões e viram-se a 60 px. Três delas eram as três parcelas soltas, com escalas diferentes para lhes dar massa parecida: **em todas, o continente ganha e os arquipélagos leem-se como poeira**. Não é uma questão de afinar a escala, é uma questão de forma: uma mancha compacta ao lado de nove pontos dispersos nunca tem o mesmo peso. O que dá dignidade igual é a **moldura**, e não é invenção nossa: o mapa do sítio já divide o país em três molduras com escalas próprias (`pais.json`, «molduras»: a Madeira a 1,00, os Açores a 0,38). Três caixas do mesmo peso dizem «três territórios» mesmo quando o que está dentro delas já não se lê.

**O que isso custa, e fica dito:** a escala verdadeira entre as parcelas desaparece, e a 60 px o que sobrevive é a estrutura de três, não a geografia. Também se largaram os ilhéus de menos de 20 unidades de lado no campo de 6090 por 8030 do mapa: nas molduras deste ícone, 20 unidades de origem valem entre 0,09 px (moldura do continente) e 0,29 px (moldura da Madeira) a 60. **As Ilhas Selvagens saem por esse corte** (inferência: o ficheiro não lhes dá nome, e são elas pela posição, um grupo a sul e a nascente da Madeira cujo maior sub-caminho tem 19 unidades de lado), e isso é geografia que se largou, não um pormenor de desenho.

**O que se viu a 60 px.** As três molduras leem-se. Dentro delas, o continente lê-se como silhueta; a Madeira lê-se como uma mancha de 8,2 px com o Porto Santo a 1,9 px ao lado; os Açores são **poeira** (a corrida mínima do desenho inteiro é de 1 px, e São Miguel, a maior ilha do arquipélago, mede 1,6 px). A marca diz «três territórios», não diz «Portugal».

**O que arrisca.** Duas coisas. A silhueta do país é o sinal mais gasto que há, e a folha traz o precedente do lado de lá: a **USAFacts**, que é um observatório de dados como este, resolve o ícone com o contorno do país em campo magenta. E três caixas com formas dentro leem-se, a 60 px, como um esquema de disposição de página.

**Em escuro.** Boa: o cobalto claro sobre papel escuro dá mais contraste às silhuetas do que o cobalto sobre papel claro.

**A 16 px.** As molduras não existem (o fio de 12 unidades dá 0,4 px). O desenho de favicon deixa cair as molduras e sobe o corte dos ilhéus para 90 unidades: ficam São Miguel, o Pico, São Jorge, a Madeira e o Porto Santo, três manchas. É a mesma forma com menos ilhas.

### F · a régua (`direcoes/6-regua.svg`)

**O que tenta.** O instrumento de convergência com a gramática que o sítio já tem escrita em `src/components/inicio/Regua.astro`: a referência a tinta em pé, a barra a medir a distância, e o valor na ponta. O valor aqui é **o quadrado do selo**, que é o que o sítio põe ao lado de cada número.

**Uma correção que valeu a pena registar.** A primeira versão punha a referência e o valor como dois postes iguais com a barra entre eles, como a régua faz na página. A 60 px, isso **lê-se «H»** e mais nada, em todos os tamanhos. A gramática que funciona numa régua de 600 px de largura não funciona num quadrado de 60.

**O que se viu a 60 px.** Uma ilha só: quadrado, barra e referência estão encostados e formam uma peça. **É a mais robusta das sete**: corrida mínima de 8 px, contra 1 a 3 px de todas as outras. A 16 px continua a ler-se.

**Serve um sinal abstrato a um sítio que vive de números com nome?** Diria que não, e é o próprio desenho que o diz: a régua sem escala e sem algarismo é uma barra a bater numa parede, e isso é a forma de uma **barra de progresso**. Um sítio que se recusa a publicar um número sem a linha que o sustenta não devia ter por marca um instrumento sem nenhuma leitura.

**Em escuro.** Boa e sem novidade.

### G · o selo dentro do «O» (`direcoes/7-selo-no-o.svg`) · a sétima

**Porque é que existe.** Das seis do brief, duas são letra sem instrumento (A, B) e três são instrumento sem letra (C, D, F); nenhuma é as duas coisas. Esta é: o «O» de «O Estado do País», e dentro dele o quadrado cheio do selo. E há uma razão de construção que a torna quase obrigatória: **a contraforma do «O» desta casa já é um rectângulo**, pelas razões da §4. O quadrado do selo não foi metido lá dentro, estava lá o sítio à espera dele.

**O que se viu a 60 px.** Duas ilhas, o anel e o quadrado, com folga entre eles. **Corrida mediana de 10 px, a maior das sete**, e 28,9 % do campo com tinta, também a maior. O quadrado do selo mede 18,3 px a 60. É a que se lê de mais longe.

**O que arrisca.** Um anel é do Observador, e um círculo com uma forma dentro é da Pordata (que é o vizinho mais próximo, porque é um disco azul com uma forma branca no meio). A distância está no campo (papel, e não azul cheio), na forma de dentro (um quadrado cheio, e não um vazio) e no facto de o anel ser letra e não geometria. Continua a ser a colisão mais próxima das sete.

**Em escuro.** Boa: o anel passa a claro, o quadrado passa a `#7fa6dc`, e o contraste entre os dois mantém-se.

**A 16 px.** Duas ilhas, com a folga a aguentar. A contraforma passa a oval e o quadrado encolhe (de 130 para 90 unidades) para o anel não colar. É a única das três direções de letra em que a ideia distintiva **chega inteira aos 16 px**, porque a ideia não está no canto do rectângulo, está na relação entre duas formas.

---

## 6 · A ordem de preferência, e a razão de cada lugar

**1.º · G, o selo dentro do «O».** É a única que diz as duas coisas ao mesmo tempo: o nome (a letra) e o método (a prova). É a mais legível a 60 px por uma margem que está medida (mediana de 10 px contra 7 da segunda), é a única cuja ideia sobrevive aos 16 px, e é a que menos depende de cor: em cinzento continua a ser um anel com um quadrado. Contra ela pesa a distância à Pordata, que é a menor de todas as sete, e é essa a pergunta que a direção tem de responder antes de a escolher.

**2.º · B, o «O» com o acento.** É a mais portuguesa das sete sem ser nada do Estado, e é a única que faz da ortografia uma forma. Fica em segundo e não em primeiro por uma razão que não é de gosto: o traço em diagonal a sair de um círculo tem a lupa por vizinha, e a Lupa é um verificador de factos de língua portuguesa. Se a direção a escolher, o trabalho seguinte é afastá-la mais dessa leitura, e a via já se viu: encurtar o traço não chega (fica bandeira), soltá-lo parte a marca em dois. A via que falta experimentar é o acento **a atravessar** o anel em vez de sair dele.

**3.º · C, o selo.** É a que mais fielmente diz o que o sítio faz, e é a mais sóbria. Fica em terceiro porque a leitura de «selecionar» é forte e porque a 32 px já perde o tracejado, que é metade da ideia. É a melhor candidata a marca secundária: o quadrado cheio e o quadrado a tracejado servem de sinal dentro do sítio mesmo que o ícone seja outro.

**4.º · A, a ligadura «OE».** A letra está bem construída e a solda funciona (uma ilha a 60 px). Fica em quarto por uma razão que nenhum desenho resolve: **«OE» é o Orçamento do Estado**, e este é um sítio sobre contas públicas. Um monograma que colide com a sigla do documento que o sítio analisa é um problema de nome, não de forma.

**5.º · F, a régua.** É a mais robusta a todos os tamanhos, com folga. Fica em quinto porque um sinal abstrato não diz o nome de nada, e porque lida depressa é uma barra de progresso. É a melhor escolha se o critério for só «que se veja»; não é a melhor se o critério for «que diga».

**6.º · E, o mapa.** Cumpre a dignidade das três parcelas, e cumpre-a à custa da geografia e da legibilidade: a 60 px lê-se a estrutura, não o país. Além disso é o sinal com mais donos possíveis. Fica em sexto por isso, e não por estar mal desenhada.

**7.º · D, o azulejo.** Lê como célula de folha de cálculo, e a medição diz porquê: metade do desenho é fio de 2 px. A ideia é boa e a execução a este tamanho não a entrega. Se a direção a quiser, o caminho é largar o fio e a régua e ficar com **uma pincelada só** em cobalto, o que já é outra direção e não esta.

**Uma nota que não é preferência, é aviso.** As sete estão desenhadas para serem iteráveis no Claude Design: cada SVG é geométrico, com os números todos à vista e comentados, e `desenhar.py` tem cada medida numa constante com o motivo ao lado. A que for escolhida ainda precisa de: um manifesto (`display: standalone`, `start_url`, `icons` de 192 e 512 e um `maskable`), a linha `apple-touch-icon` no `<head>` de `Base.astro`, e os PNG em `public/`. Nada disso está feito, e nenhuma dessas três coisas é decisão do construtor.

---

## 7 · O que se mediu, e como

* **A legibilidade** foi medida nas capturas de `EXPORT/`, e não estimada dos SVG: cada PNG foi lido píxel a píxel, contadas as componentes ligadas de tinta e as corridas de tinta em linha e em coluna. A tabela da §5 é essa leitura. O que está escrito em prosa («lê-se», «é poeira») é o que se viu ao abrir as capturas.
* **O «O» do Spectral** foi medido no ficheiro da casa, desenhado a 700 de altura e contado a píxeis, não tirado de uma tabela.
* **O círculo seguro do `maskable`** está conferido por construção e à vista: o sinal cabe em 360, encolhe para 0,78, dá 281 de lado e 198,6 de meia-diagonal, contra os 204,8 do raio de 40 %. Na prancha, cada `maskable` está mostrado recortado em círculo.
* **Os contrastes** não foram medidos aqui: são os que `src/styles/tokens.css` já traz medidos por `scripts/medir-contraste.mjs`, e estão citados com o número que lá está.
* **As colisões** foram vistas na folha das 42 referências, à mesma escala, e a tira «A vizinhança a 60 px» da prancha põe as sete direções na mesma linha que dezasseis delas.

---

## 8 · O que não se fez, e devia ficar dito

* **Não se experimentou o âmbar como acento na direção B.** Foi descartado por medição e não por gosto: o âmbar sobre papel claro mede 2,09:1, e um traço de 6 px a 60 nessa relação é uma mancha pálida. O cobalto mede 7,73:1. Está na §5.
* **Não há versão em cinzento nem em uma cor só.** Um ícone de telemóvel não a pede; uma marca a sério acaba por pedir.
* **Não se desenhou o «E» nem o «S» do alfabeto da casa** além do que a ligadura da direção A precisou. Se a direção escolher A, o alfabeto tem de crescer.
* **A marca horizontal usa o nome composto em Spectral**, e não desenhado. Se a direção quiser o nome também desenhado, é outro trabalho, e maior do que este.

---

## 9 · O custo

Cerca de **320 mil símbolos** de contexto no total desta sessão de construção, quase todos em ida e volta entre desenhar, exportar, **olhar as capturas** e corrigir. As correções que gastaram mais foram as três que só se viram olhando: a régua que lia «H», o acento que lia como cabo de lupa, e o mapa em que os arquipélagos eram poeira. Nenhuma das três se via no SVG.
