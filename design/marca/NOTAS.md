# NOTAS · a marca e o ícone do telemóvel

*Escrito a 28.08.2026 pelo construtor (Claude Opus 5) a partir de `BRIEF-marca.md` e das três adendas do gabinete (a terceira está no ramo, em `ADENDA-3-estado.md`). Trabalho de exploração: nada disto está no sítio. Sem elogios: o que está escrito é o que se viu nas capturas, e o que se mediu está dito com o número.*

---

## 0 · O que está aqui, e o que não está

**Está:** onze direções em `direcoes/*.svg` (o campo é 512, o sinal cabe em 360), a prancha `PRANCHA.html` com a captura `PRANCHA.png`, os PNG de cada direção em `EXPORT/`, as três maquetas do ecrã principal em `ECRA-*.png`, e os dois programas que os fazem. As sete primeiras são de 28.08 de manhã; a H, a I e a J são a resposta à terceira adenda, que pediu a palavra «Estado»; a J2 é a quarta adenda, depois de o diretor ter escolhido a palavra.

**Não está:** nenhum ficheiro em `public/`, nenhuma linha no `<head>` de `src/layouts/Base.astro`, nenhum manifesto, nenhuma dependência nova no `package.json`. O sítio no ar continua sem ícone, exatamente como estava. `npm run typecheck` passa, e passava antes: `tsconfig.check.json` não olha para `design/`.

**A ordem em que isto se refaz**, e importa porque a prancha embebe os PNG:

```
python3 design/marca/desenhar.py          # os onze SVG
node   design/marca/exportar.mjs          # 14 PNG por direção (16 nas duas da palavra)
python3 design/marca/desenhar.py ecras    # as três maquetas do ecrã principal
python3 design/marca/desenhar.py prancha  # a prancha, com os PNG e as maquetas lá dentro
node   design/marca/exportar.mjs          # a captura PRANCHA.png
```

As maquetas precisam do `Pillow` e de um tipo do sistema para o rótulo (o Helvetica); como o resto de `desenhar.py`, não correm na construção do sítio.

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

**O que isto quer dizer para este trabalho, e o que se decidiu por causa disso.** Um SVG com contornos de letras é um documento feito com o tipo, e não um tipo modificado. Ainda assim, **nenhuma das sete direções usa contornos do Spectral no sinal**: as letras das direções A, B e G são desenhadas numa grelha própria, ponto a ponto, em `desenhar.py`, e o Spectral entra ali como **medida de referência** (mediu-se-lhe o «O», §4) e não como fonte de contornos. Nessas sete, o único sítio onde há contorno tirado do ficheiro do tipo é **o nome «O Estado do País» na marca horizontal da prancha**, composto em Spectral Regular com o espacejamento que `src/styles/site.css` já dá ao `.wordmark` (`letter-spacing: -0.014em`). Isso é composição de um documento, é o que a licença descreve, e o ficheiro do tipo não sai daqui modificado nem renomeado.

`glifos.py` é o programa que faz essa conversão, e está no ramo para que a origem de cada contorno se possa conferir: lê o WOFF2 da casa, tira as larguras da `hmtx` e os pares de `kerning` da GPOS do próprio ficheiro, e não inventa espacejamento nenhum.

**O que a terceira adenda mudou aqui, e fica dito no mesmo sítio.** A direção J leva «stado» em contorno do Spectral SemiBold **dentro do sinal**, e não só na marca horizontal. É o único sítio de todo este trabalho onde isso acontece, e não é um descuido: a adenda autoriza-o à letra («a palavra inteira desenhada, ou o «E» desenhado mais a serifada da casa para "stado"»), e a razão de se ter ido por aí está na §4, no fim. Pela licença é a mesma coisa que o nome: um documento feito com o tipo, e não um tipo modificado. Pela regra deste trabalho não é: um sinal da casa devia ser desenhado inteiro, e este não é. Desfaz-se de uma maneira só, e ela já está construída: tirar a palavra do ícone e ficar com o «E», que é desenhado. A 60, a 32 e a 16 px é isso que a J faz.

---

## 2 · O que «ajustar à cultura portuguesa» quis dizer aqui

A adenda pediu que isto ficasse dito à letra, e fica.

**O que fica de fora, e porquê.**

* **O verde e o vermelho da bandeira.** Fora. As duas cores juntas são a República, e o sítio não é o Estado; separadas, o vermelho é de três órgãos da folha (Público, Economist, Politico) e o verde é do Eco. Um observatório que se pinta com as cores do Estado está a dizer que fala pelo Estado.
* **A esfera armilar e o escudo das quinas.** Fora. São insígnias do Estado, e a 60 px são um borrão: a esfera armilar tem seis aros cruzados, e nenhum deles sobrevive. Além do mais são símbolos com dono, e usá-los seria uma reivindicação de autoridade que este sítio não tem.
* **Qualquer coisa que se pareça com um sítio do Estado.** Conferi os dois que a adenda nomeou. `transparencia.gov.pt` é um anel azul-escuro e âmbar com um sinal de mais no meio, num campo de 48 px. `ine.pt` são dois vistos finos, um azul e um vermelho, num campo branco de 16 px. Nenhuma das onze direções tem anel com sinal de mais, e **nenhuma tem visto**, o que é uma escolha e não um acaso: a direção C do brief pedia «um traço de verificação», e o visto foi trocado pelos dois quadrados do selo justamente porque o visto azul sobre branco é do INE, que por acaso é a fonte principal deste sítio (§5, direção C).

**O que fica dentro, e porquê.**

* **A paleta já é a do azulejo.** Cobalto `#1f4e8c` sobre papel `#f6f7f4` é a paleta azul e branca da faiança portuguesa, e não é uma cor nova: está em `src/styles/tokens.css` desde a v3. Nove das onze direções usam-na (todas menos a A e a J, contadas as ocorrências da classe `acento` nos SVG), e a direção D leva-a até ao fim, como peça de cerâmica.
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

**E há um vizinho de nome que convém dizer.** O «Estadão» é «O Estado de S. Paulo». Para um leitor de língua portuguesa, «O Estado do País» tem esse vizinho à distância de uma palavra, e o ícone é o único sítio onde os dois se podem cruzar sem contexto. O Estadão resolve-se com uma gravura azul; a distância mais barata que temos é não usar campo azul cheio com figura branca por cima, e nenhuma das onze o usa.

**As três referências que a terceira adenda nomeou, vistas na folha.** O **Marshall Project** é um quadrado preto com barras brancas verticais que formam um «M»: é o precedente mais próximo da direção H, e a distância é de eixo e de campo (as barras dele são verticais e brancas sobre preto; as nossas são horizontais, de tinta e cobalto sobre papel). O **Expresso** é um campo azul-petróleo com um «E» serifado branco a 55 % do campo, e o **Economist** é um campo vermelho com um «E» serifado branco: os dois são a mesma coisa, a anatomia de sempre (haste grossa, três braços finos, serifas com colo) em branco sobre caixa de cor. É essa a forma que as três novas não podem repetir, e cada uma responde de maneira diferente: a H inverte o contraste, a I mete o selo no vão, e a J não responde, porque o «E» dela é um «E» serifado normal. Está dito na §5, e é o que a faz descer na ordem.

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

### A segunda letra da casa: o «E» do livro-razão (direção H)

A terceira adenda pediu um «E» de três barras, e o que saiu é uma letra com **o contraste ao contrário**:

| | |
|---|---|
| barra (cada braço) | `b = 0,24 H` |
| vão (entre braços) | `g = 0,14 H` |
| a conta que fecha | `3 b + 2 g = H` |
| haste | `0,100 H`, que é o **fino** da casa, e não a haste |
| braços | `0,80 H` / `0,55 H` / `0,80 H` |

Num tipo, a haste de um «E» é o traço grosso e os braços são os finos, sempre. Aqui é ao contrário: a haste é o fio do livro-razão e os braços são as linhas. Nenhum tipo faz isto, e é por isso que esta letra é desenhada e não composta. Os três braços não são um enfeite de tabela: **são os três campos que uma linha do livro-razão nunca tem em falta**, e isso é verificável no ficheiro (`ledger/claims/*.yml`: `value`, `source`, `access_date`, por esta ordem, de cima para baixo). O do meio, o da fonte, é o que leva o cobalto, e leva-o por duas razões: é a promessa do sítio (o selo é a porta para a linha que justifica o número), e é o **braço curto**, que é o único sítio de um «E» onde uma segunda cor não desmancha a letra.

### A linha do valor dentro do «E» serifado (direção J2)

A quarta adenda pediu a ideia da H metida dentro da letra serifada: o braço do meio do «E» deixa de ser um braço e passa a ser a **linha do valor**, em cobalto. A pergunta era a grossura, e a resposta veio de olhar três, à mesma escala:

| grossura do braço do meio | o que se lê a 180 e a 60 px |
|---|---|
| `0,086 H` (a grossura própria do braço nesta grelha) | **enfeite.** O azul é uma cor pousada num traço que já lá estava. Na palavra, a 180 px, lê-se como uma falha de impressão. |
| `0,14 H` | um traço azul mais grosso. Lê-se como barra, mas não se percebe se é a letra ou um sublinhado. |
| `0,20 H` | **linha do valor.** É mais grossa do que os braços de tinta (0,100 H), e por isso lê-se como **outro objeto**, metido dentro da letra, e não como uma parte da letra pintada. |

É a de 0,20 H. A regra que sai daqui é a mesma da §4 do «O»: uma segunda cor só diz alguma coisa quando a forma que a leva **também** é diferente. Pintar de azul um traço que já lá estava é enfeite; meter lá dentro um traço que a letra não tinha é uma linha.

No desenho de 32 e 16 px a linha sobe a `0,22 H` e os braços de tinta sobem de `0,100` para `0,130 H`. Sem isso, a 16 px o braço dá 1,12 px e a linha 2,25 px, e a letra fica um borrão com uma mancha; com isso, o braço dá 1,46 px e a linha 2,48 px, que é a mesma grossura de barra que a H já tinha mostrado aguentar.

### As minúsculas que se tentaram, e o «s» que não sai desta grelha

A direção J começou por ser a palavra inteira desenhada, com uma ideia só: **todas as redondas são o mesmo bojo, e o que muda é onde está a haste e até onde ela sobe** (o «o» é o bojo; o «a» é o bojo com haste à direita, à altura de x; o «d» é a mesma haste subida à altura de maiúscula; o «t» é haste, travessão e um pé cortado a direito). A altura de x veio medida do ficheiro da casa e não escolhida: `Spectral-SemiBold.woff2` declara `sxHeight` 454 e `sCapHeight` 660, ou seja **0,688**. Os quatro saíram e leem-se a 180 px.

**O «s» não sai, e a razão é a regra da casa.** «Remates cortados a direito, no horizontal ou no vertical, nunca em ângulo» (é a linha da grelha, lá em cima). Um «s» são duas curvas cujos remates não são horizontais nem verticais: cortados no raio dão um bico, e cortados na horizontal fecham a abertura e o «s» vira dois discos encostados. **Doze construções foram desenhadas e vistas a 180 px**: bandas de arco com a elipse de dentro rodada de 0 a 55 graus (o que move o eixo grosso para a diagonal, que é onde um «s» o tem), lobos de 0,30 a 0,36 da altura de x, uma versão de grossura fixa, e dois anéis fechados cortados a direito. Nenhuma se lê como «s». Também se mediu porque é que o «a» é de um andar e não de dois, como o Spectral: um «a» de dois andares precisa de um bojo pequeno com contraforma, e o bojo da casa a 0,66 da altura de x deixa uma contraforma de 0,19 dessa altura, que a 180 px é meio píxel.

**O que ficou, por isso.** O «E» desenhado e «stado» em Spectral SemiBold, que é a segunda porta que a adenda deixou aberta. SemiBold e não Regular por medição: a haste do «d» mede 98,3 no SemiBold e 68,9 no Regular (contadas no contorno do ficheiro, à mesma escala), e ao lado de um «E» de haste 0,233 H o Regular lê-se como duas letras de pesos diferentes coladas uma à outra. O que isto custa está na §1.

---

## 5 · As onze direções

Os números de legibilidade abaixo estão **medidos nas capturas de `EXPORT/`**, não estimados: para cada PNG contaram-se as componentes ligadas de tinta (quantas manchas separadas o olho tem de juntar) e as corridas de píxeis de tinta em linha e em coluna (a mais curta é a peça mais frágil do desenho).

| | 60 px: ilhas | 60 px: corrida mínima | 60 px: mediana | 16 px: ilhas | 60 px: tinta |
|---|---|---|---|---|---|
| A · ligadura OE | 1 | 1 px | 5 px | 1 | 17,6 % |
| B · O com acento | 1 | 1 px | 6 px | 1 | 14,0 % |
| C · selo | 13 | 2 px | 4 px | 2 | 17,5 % |
| D · azulejo | 7 | 2 px | 2 px | 2 | 19,8 % |
| E · mapa | 8 | 1 px | 2 px | 2 | 20,9 % |
| F · régua | 1 | 8 px | 8 px | 1 | 15,6 % |
| G · selo no O | 2 | 3 px | 10 px | 2 | 28,5 % |
| H · E do livro-razão | 1 | 5 px | 10 px | 1 | 27,2 % |
| I · selo no E | 1 | 2 px | 10 px | 1 | 24,2 % |
| J · palavra «Estado» | 1 | 4 px | 10 px | 1 | 18,7 % |
| J2 · «Estado» com a linha | 1 | 6 px | 10 px | 1 | 19,8 % |

A mediana é o número que mais diz. Uma mediana de 2 px quer dizer que **metade do desenho é fio**, e um fio de 2 px a 60 desaparece com a primeira compressão ou com o primeiro fundo escuro.

**A tabela foi refeita para as onze com o mesmo programa**, e por isso quatro números das sete primeiras mexeram: a corrida mínima da A e da B (de 2 para 1 px), as ilhas da E a 60 (de 10 para 8) e a 16 (de 3 para 2). O método está escrito na §7 e é agora um só para as onze; a leitura em prosa não muda com um píxel de corrida mínima. A coluna da tinta é nova e mede quanto do campo de 60 por 60 está pintado.

As linhas da J e da J2 são as do **«E» sozinho**, e não as da palavra: a 60 px as duas já mostram a letra. A palavra, a 60 px, dá 9,6 px de altura de maiúscula e não tem número que valha a pena medir.

### A · a ligadura «OE» (`direcoes/1-ligadura-oe.svg`)

**O que tenta.** As duas iniciais soldadas numa letra só: a haste do «E» é a haste direita do «O». Duas letras encostadas leem-se como sigla; soldadas leem-se como uma marca. A ligadura existe no alfabeto latino («Œ»), e o que é nosso é a construção: a contraforma recta e o corte a direito dos remates.

**O que se viu a 60 px.** Lê-se «Œ», inteira, com as três hastes do «E» separadas. A medição confirma a solda: **uma só ilha de tinta**. Tem 17,6 % do campo com tinta (a medição de 28.08, refeita para as onze; a primeira leitura dizia 17,8 %), o que a põe em oitavo lugar das onze em peso de tinta, e não em segundo como se escreveu antes de as três novas existirem.

**O que arrisca.** Duas coisas, e a primeira é séria: **«OE» é o Orçamento do Estado**. Num sítio sobre contas públicas, isso não é uma ambiguidade, é uma leitura primeira. A segunda é a folha: o «E» serifado branco sobre campo escuro é do Expresso e do Economist, e o «Œ» tem a mesma anatomia, só que a tinta sobre papel, que é o lado contrário do contraste.

**Em escuro.** Sem problema: papel e tinta trocam e a letra fica branca sobre `#15171a`. É a que melhor aguenta a troca, porque não tem cor nenhuma para se defender.

**A 16 px.** Uma mancha só, com o vazio da contraforma ainda a ver-se. Reconhece-se como letra, não se identifica como «Œ».

### B · o «O» com o acento do «País» (`direcoes/2-o-acento.svg`)

**O que tenta.** A inicial única, com o acento agudo do «í» de «País» fundido no ombro direito, na grossura da haste, cortado a direito na ponta. É a única das onze que traz o português para dentro da forma.

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

**O que se viu a 60 px.** Uma ilha só: quadrado, barra e referência estão encostados e formam uma peça. **É a mais robusta das onze**: corrida mínima de 8 px, contra 6 px da segunda (a J2), 5 px da terceira (a H) e 1 a 4 px das outras. A 16 px continua a ler-se.

**Serve um sinal abstrato a um sítio que vive de números com nome?** Diria que não, e é o próprio desenho que o diz: a régua sem escala e sem algarismo é uma barra a bater numa parede, e isso é a forma de uma **barra de progresso**. Um sítio que se recusa a publicar um número sem a linha que o sustenta não devia ter por marca um instrumento sem nenhuma leitura.

**Em escuro.** Boa e sem novidade.

### G · o selo dentro do «O» (`direcoes/7-selo-no-o.svg`) · a sétima

**Porque é que existe.** Das seis do brief, duas são letra sem instrumento (A, B) e três são instrumento sem letra (C, D, F); nenhuma é as duas coisas. Esta é: o «O» de «O Estado do País», e dentro dele o quadrado cheio do selo. E há uma razão de construção que a torna quase obrigatória: **a contraforma do «O» desta casa já é um rectângulo**, pelas razões da §4. O quadrado do selo não foi metido lá dentro, estava lá o sítio à espera dele.

**O que se viu a 60 px.** Duas ilhas, o anel e o quadrado, com folga entre eles. **Corrida mediana de 10 px, a maior**, agora empatada com a H, a I, a J e a J2, e 28,5 % do campo com tinta, que continua a ser a maior das onze. O quadrado do selo mede 18,3 px a 60. É a que se lê de mais longe.

**O que arrisca.** Um anel é do Observador, e um círculo com uma forma dentro é da Pordata (que é o vizinho mais próximo, porque é um disco azul com uma forma branca no meio). A distância está no campo (papel, e não azul cheio), na forma de dentro (um quadrado cheio, e não um vazio) e no facto de o anel ser letra e não geometria. Continua a ser a colisão mais próxima das onze.

**Em escuro.** Boa: o anel passa a claro, o quadrado passa a `#7fa6dc`, e o contraste entre os dois mantém-se.

**A 16 px.** Duas ilhas, com a folga a aguentar. A contraforma passa a oval e o quadrado encolhe (de 130 para 90 unidades) para o anel não colar. É a única das três direções de letra em que a ideia distintiva **chega inteira aos 16 px**, porque a ideia não está no canto do rectângulo, está na relação entre duas formas.

### H · o «E» do livro-razão (`direcoes/8-e-livro-razao.svg`) · a primeira das três

**O que tenta.** A palavra que conta no nome do sítio é «Estado», e a letra dela é o «E». Este «E» é feito das três linhas de um registo: o valor, a fonte e a data. A grelha e a origem dos três campos estão na §4.

**O que se viu a 60 px.** Lê-se «E», inteiro, à primeira, e só depois se lê a tabela. É a ordem que a adenda pediu. **Uma só ilha** (a haste solda as três barras), **corrida mediana de 10 px** e **corrida mínima de 5 px**, que é a terceira melhor das onze, atrás da régua (8 px) e da J2 (6 px). As barras medem 10,1 px, os vãos 5,9 px e a haste 4,2 px.

**Cinco variantes foram desenhadas e vistas a 60 px antes de escolher esta**, e cada uma ensinou uma coisa. **Sem haste**, as três barras leem-se como o botão de menu de uma aplicação e a letra desaparece (três ilhas, e nenhuma delas é uma letra). **Com os braços a decrescer** (0,80 / 0,62 / 0,44), que era a maneira óbvia de dizer «estes são valores», lê-se **«F»** e não «E»: um braço de baixo mais curto do que o de cima mata a letra, e nenhuma quantidade de significado a ressuscita. **Com o cobalto no braço de cima** em vez do meio, lê-se um cabeçalho de tabela e a letra perde a frente. **Com a haste grossa da casa** (0,233 H) e barras de 0,20, lê-se um «E» pesado normal e a tabela some-se. A escolhida é a única que lê as duas coisas, e por esta ordem.

**O que arrisca.** Duas coisas. **Três barras horizontais são o botão de menu de qualquer aplicação**, e a haste é a única coisa que separa uma coisa da outra: a 16 px a haste tem 1,5 px, e essa distância é fina. E o «E» é a letra do Expresso e do Economist. A distância aí é de construção (o contraste invertido, §4) e de campo (tinta e cobalto sobre papel, e não branco sobre caixa de cor); não é de forma, porque continua a ser um «E».

**Em escuro.** Boa. As barras passam a claro sobre papel escuro e o cobalto passa a `#7fa6dc`, como em todas as outras direções com acento.

**A 16 px.** Uma ilha. O desenho de favicon dá ar ao vão à custa da barra (0,22 e 0,17 em vez de 0,24 e 0,14) e engrossa a haste para 0,130 H: o vão passa de 1,58 px para 1,91 px e a haste de 1,12 px para 1,46 px. O que se lê é um «E» com uma faixa azul no meio. A leitura de tabela morre; a de letra fica.

### I · o selo dentro do «E» (`direcoes/9-selo-no-e.svg`)

**O que tenta.** A ideia da direção G levada do «O» para o «E»: a prova dentro da letra. No «O» o selo morava na contraforma, que já era um rectângulo; no «E» mora no vão de cima, que é a contraforma que um «E» tem.

**A medida que decidia, porque a adenda condicionou a direção a ela.** O vão de cima mede **0,377 H** com o braço a 0,086 H (o braço afinou de propósito: é ele que rouba altura ao vão). Enquadrado, dá um selo de **12,1 px a 60 px, com 1,9 px de ar em cima e em baixo**, contra os 18,3 px do selo da G. **O vão segura o selo a 60 px**, e é essa a resposta à pergunta da adenda. Abaixo disso não segura: a 32 px o ar cai para 0,67 px e a 16 px para 0,34 px, e o que lá está deixa de ser um selo dentro de um vão e passa a ser um vão cheio de cor. Está assim na captura, e não se corrige com desenho nenhum.

**O que se viu a 60 px.** Uma ilha, mediana de 10 px, e o quadrado azul lê-se como quadrado, com ar à volta. O «E» é largo (braço de 0,80 H) para encher o campo quadrado e para o selo caber sem ficar espremido.

**Três sítios foram experimentados para o selo, e vistos a 60 px.** No **vão de baixo** lê-se igual, mas o peso da letra vai todo para baixo e o quadrado parece que cai. **No lugar do braço do meio** é o mais legível dos três (12,7 px de quadrado, com 10,5 px de ar em cima e em baixo, contra 1,9 px) e foi posto de lado por uma razão que não é de tamanho: **sem o quadrado, essa letra deixa de ser um «E»**, e uma marca que precisa da segunda cor para ser uma letra não sobrevive a um fax, a um carimbo, nem a um favicon a uma cor. Na I, tirando o selo, fica um «E».

**O que arrisca.** O «E» dela é um «E» serifado normal, e essa é a anatomia do Expresso e do Economist. A I compra distância com o selo e com o campo, e a 16 px, quando o selo se fecha, fica sem a primeira e só com a segunda.

**Em escuro.** Boa: o «E» passa a claro, o selo passa a `#7fa6dc`, e o contraste entre os dois mantém-se.

**A 16 px.** Uma ilha. O braço engrossa para 0,110 H (1,24 px) e as lajes de remate saem; o selo fica a 3,18 px com 0,34 px de ar. Lê-se um «E» com uma mancha azul em cima.

### J · a palavra «Estado» (`direcoes/10-palavra-estado.svg`)

**O que tenta.** A palavra como sinal grande (512, 192, 180 e 120 px) e o «E» dela sozinho quando a palavra deixa de caber (60, 32 e 16 px). Não é outra forma: é a primeira letra da que lá estava. `exportar.mjs` sabe que esta direção troca de desenho mais cedo do que as outras, e diz porquê.

**A pergunta da adenda, respondida com o que se vê a 180 px.** «Estado» sozinho **lê-se como a instituição**. Não é uma dúvida: em português, «Estado» com maiúscula, sem artigo à frente e sem nada atrás, é o Estado que governa, e a maiúscula é justamente a marca disso na ortografia portuguesa. O desenho faz o que pode para não ajudar (não há heráldica, não há verde nem vermelho, não há tipografia oficial: é tinta sobre papel e uma serifada de livro), e não chega, porque **o que decide não é a forma, é a palavra e a maiúscula**. O que trouxe o leitor de volta à condição é a marca horizontal: «O Estado do País», com o artigo à frente e o «do País» atrás, compostos a 0,66 da altura da palavra. O artigo é o que faz a diferença toda, e o ícone é justamente o sítio onde ele não cabe.

**O que a palavra custa em tamanho, medido.** A palavra tem **4,39 de largura por 1 de altura** e o campo do ícone é quadrado. Enquadrada a 360, dá **28,8 px de altura de maiúscula a 180 px** e 19,2 px a 120. No mesmo campo, uma letra sozinha dá **126,6 px a 180**. A palavra lê-se a 180 e a 120; é quatro vezes e meia mais pequena do que a letra, e a 60 px (9,6 px de maiúscula) é uma mancha.

**O «E» que fica a 60, a 32 e a 16 px.** É o «E» da casa, sem selo e sem barras: haste grossa, três braços finos, lajes de remate. Uma ilha, mediana de 10 px, mínima de 4 px. Lê-se em todos os tamanhos, **e é o sinal mais parecido com o que já existe de todos os dez**: um «E» serifado de tinta sobre papel a 60 px, ao lado do «E» do Expresso e do «E» do Economist na tira da vizinhança, distingue-se pelo campo e por mais nada.

**O que arrisca**, além disso: é uma das duas (com a J2) cujo sinal grande **não é desenhado inteiro** (§1), e precisa da marca horizontal para dizer o que quer dizer.

**Em escuro.** Boa, e sem novidade: a palavra passa a clara sobre papel escuro.

### J2 · «Estado» com a linha do valor (`direcoes/11-estado-linha.svg`) · a que o diretor mandou trabalhar

**O que tenta.** A J com o defeito corrigido. O que a §5 apontava à J era o sinal pequeno: um «E» serifado como o de tantos outros. Aqui o «E» leva a linha do valor (§4), e passa a ser uma letra com uma coisa lá dentro. A palavra continua a ser o sinal grande e continua a levar «stado» em Spectral SemiBold, como a J.

**O que se viu a 180 px (a palavra).** «Estado» lê-se, com a linha azul dentro do «E». A caixa de tinta mede **124 por 34 px**, com **28,8 px de altura de maiúscula** e a linha do valor a **5,8 px**. A 512 px a maiúscula dá 82 px e a linha 16,4. Em escuro a palavra passa a clara sobre papel escuro e a linha passa a `#7fa6dc`, e o contraste entre as duas mantém-se.

**O que se viu a 60 px (a letra).** O «E» com a linha, inteiro. **Uma ilha, corrida mediana de 10 px e mínima de 6 px, que é a segunda melhor das onze**, atrás só da régua (8 px). A maiúscula tem 42,2 px, a linha do valor 9,3 px e os braços de tinta 5,5 px. A linha lê-se como linha e não como sombra.

**O que se viu a 16 px.** Uma ilha. A maiúscula tem 11,2 px, **a linha do valor 2,48 px** e os braços 1,46 px. O que se lê é um «E» com uma barra azul a meio: os braços de tinta ficam cinzentos e moles, a barra azul não. É a mesma leitura que a H já tinha a este tamanho, e por isso a barra a 0,22 H foi mantida em vez de afinada.

**O `maskable`, e a pergunta se a palavra cabe no círculo.** Cabe, e com folga. A caixa de tinta da palavra reduzida a 0,78 mede **274 por 73 px** num campo de 512, o que dá uma **meia diagonal de 141,8 px contra os 204,8 px do raio seguro**: sobram 63 px. Não é preciso recuar para o «E». Mais: como a palavra é baixa, podia ser **maior** e continuar dentro do círculo (a 360 de largura, sem redução nenhuma, a meia diagonal daria 184,6). Ficou nos 0,78 das outras dez, porque uma marca com onze `maskable` de escalas diferentes é onze marcas. O que **não** cabe é a leitura: a maiúscula da palavra no `maskable` de 512 fica a 64 px, e no tamanho a que o Android costuma desenhar um ícone adaptável (108 px) fica a **13,5 px**. Cabe no círculo e não se lê lá dentro.

**O que arrisca.** «Estado» sozinho continua a ler-se como a instituição, e é o artigo que traz o leitor de volta à condição: a linha do valor não muda isso, muda a letra. E uma linha azul dentro de um «E», se fosse fina, lia-se como texto sublinhado ou como defeito; a §4 diz a que grossura deixa de o ser.

### O ecrã principal, e o que ele disse (a maqueta da quarta adenda)

Três maquetas, à escala verdadeira (`ECRA-J2.png`, `ECRA-J2-letra.png`, `ECRA-H.png`): cela de 180 px, que é 60 pt a 3×, entre oito dos ícones da folha, em ecrã claro e em ecrã escuro. O que se vê é uma coisa só, e é a mais útil desta sessão:

**A palavra não segura uma cela; a letra segura.** A 180 px, entre o «E» branco em azul-petróleo do Expresso, o «P» vermelho do Público, o «E» branco em vermelho do Economist e o «T» gótico do NYT, a palavra «Estado» é o único sinal do ecrã que obriga a aproximar os olhos. Não é a cor do campo: o NYT e o Público também têm campo claro e leem-se de longe. **É a tinta.** A palavra pinta **4,7 %** da cela; o «E» sozinho pinta 19,8 % e o da H 27,2 %. Um ecrã principal é uma grelha de manchas, e quem chega lá com 4,7 % de mancha desaparece.

**A letra da J2 segura, e distingue-se.** Na maqueta com o «E» na cela grande, a letra lê-se à mesma distância que os vizinhos, e a linha azul faz o trabalho que o campo faria: ao lado do «E» do Expresso e do «E» do Economist, que são a mesma letra, o nosso é o que tem uma linha dentro. Em ecrã escuro aguenta igual, com a letra clara e a linha em `#7fa6dc`.

**O que isto quer dizer para o `apple-touch-icon`.** A adenda pediu a palavra a 180 px, e é o que os ficheiros trazem. A maqueta diz que a 180 px devia estar a letra, e a troca é uma linha em `exportar.mjs` (a entrada `180` da J2 em `TROCA_CEDO`). Os dois ficheiros já existem lado a lado (`-180.png` e `-180-letra.png`), justamente para a direção poder decidir a olhar e não a imaginar. **A palavra ganha o seu lugar aos 512 px e no cabeçalho; a cela do telemóvel é da letra.**

**E uma coisa que a maqueta mostrou sem ser pedida:** o rótulo por baixo do ícone corta. «Estado do País» não cabe numa cela de 60 pt e sai «Estado do …». Quem escolher o `short_name` do manifesto escolhe o que fica visível, e a escolha é entre «Estado do País» cortado e uma palavra que caiba inteira.

### A marca no cabeçalho, e as duas âncoras

O cabeçalho do sítio é texto composto: `.wordmark` em `src/styles/site.css`, Spectral 400, `font-size: clamp(34px, 7.4vw, 68px)`, `letter-spacing: -0.014em`; a versão compacta, `clamp(24px, 3.4vw, 34px)`. A altura de maiúscula do Spectral é 0,660 da em, e por isso o cabeçalho grande tem **44,9 px de maiúscula** e o pequeno **22,4 px**.

Pôr lá a marca da J2, em que «Estado» é desenhado e maior do que o resto, dá duas coisas diferentes, e as duas estão na prancha a 1:1:

* **Âncora A**, o artigo e o «do País» ao corpo do cabeçalho: «Estado» fica a 34 px de maiúscula num cabeçalho de 34 px de corpo, e a caixa de tinta passa de 26 px para **39 px de alto**. A marca cresce metade, e o cabeçalho tem de crescer com ela.
* **Âncora B**, «Estado» à altura de maiúscula do cabeçalho: a caixa de tinta dá **26 px**, que é exatamente a de hoje. O nome inteiro fica mais pequeno do que o de hoje, e a linha do valor no «E», a 22,4 px de maiúscula, mede 4,5 px e ainda se lê.

**A âncora B é a que não obriga a mexer no cabeçalho**, e é a que a prancha recomenda. A âncora A é a que faz da marca a primeira coisa da página, e é uma decisão de direção, não de construção.

### O duplo sentido, se for a marca a carregá-lo e não a palavra

A adenda pergunta como é que o duplo sentido podia estar na marca em vez de estar na palavra, e dá o exemplo dos níveis da régua dentro do «E». Experimentou-se: uma sexta variante da H, com os braços a decrescer como três leituras e um risco de cobalto em pé, à direita, onde o limiar estaria. **A 60 px lê-se um «E» seguido de um traço**, como um cursor de texto ou uma segunda letra, e a relação entre as barras e o risco não se lê de todo (duas ilhas, corrida mínima de 3 px). O que mata a ideia não é o desenho, é a escala: para uma barra dizer que fica **aquém** de uma marca, o olho tem de ver a distância entre as duas, e a 60 px a marca inteira tem 42 px de lado, dos quais a distância seria uma fração. **Nenhuma das sete primeiras carrega o duplo sentido**, e vale a pena dizer porquê: a F traz o instrumento mas sem escala e sem leitura, e é por isso que lê como barra de progresso; a G traz o nome e o método, que é outra coisa; a C traz os dois estados da prova, que é sobre a fonte e não sobre o país. A que chega mais perto é a H, e chega por um caminho diferente do limiar: as três barras não medem nada, mas dizem que aquilo que a letra afirma tem valor, tem fonte e tem data. Isso é o método, não é a condição. **A este tamanho, o duplo sentido é da palavra, e a marca só pode não o estragar.**

---

## 6 · A ordem de preferência, refeita para as onze

*Os critérios são os mesmos de sempre, e valem por esta ordem: **diz o nome do sítio, diz o método, lê-se a 60 px, sobrevive a 16, aguenta sem cor, e não está em cima de ninguém**. O que mudou no primeiro critério foi o gabinete a dizer qual é a palavra que conta: «Estado», e não o artigo. A esta lista juntou-se agora um critério que a maqueta do ecrã principal trouxe e que não se via em campo branco: **segura uma cela de 180 px entre os outros?***

**1.º · J2, «Estado» com a linha do valor.** Passa a primeira, e a razão não é o diretor ter escolhido a palavra: é ser **a única das onze que serve os três tamanhos com uma peça só**. O «E» com a linha é o ícone a 60 e a 16 px, é a primeira letra da palavra a 512, e é a mesma letra dentro do nome no cabeçalho: uma letra, três sítios. A H não pode fazer isso, e está medido na §5 (o «E» de barras tem o contraste ao contrário, e ao lado de minúsculas lê-se como um objeto colado à palavra e não como a sua inicial). Mede quase tão bem como a H (mediana de 10 px, mínima de 6 px, a segunda melhor das onze) e segura a cela do telemóvel, o que a maqueta mostra. Contra ela pesa uma coisa, e é de fora do desenho: **«Estado» sozinho lê-se como a instituição**, e o que corrige isso é o artigo, que só cabe no cabeçalho.

**2.º · H, o «E» do livro-razão.** Diz **a palavra que conta e o método na mesma forma**, e é a que o diz com mais força: não é uma linha metida numa letra, é uma letra feita de linhas, com o valor, a fonte e a data. É a mais pesada das onze depois da G (27,2 % de tinta) e das mais robustas: uma ilha a 60 e a 16, mediana de 10 px (a maior, empatada com a G, a I, a J e a J2), corrida mínima de 5 px (só a F, com 8, e a J2, com 6, têm mais). Aguenta sem cor: em cinzento continua a ser um «E» de três barras. E é a única cuja **construção** não existe em tipo nenhum, porque tem o contraste ao contrário. Contra ela pesa o botão de menu, e é essa a pergunta que a direção tem de responder antes de a escolher: um leitor que veja três barras num quadrado abre o menu ou lê uma letra?

**3.º · G, o selo dentro do «O».** Era a primeira e desce dois lugares, não por ter piorado, mas porque a régua mudou: o gabinete disse que a palavra a construir é «Estado», e a G constrói o artigo. Continua a ser a mais completa das sete primeiras (o nome e o método, a maior mediana, a única das três de letra dessa leva cuja ideia chega inteira aos 16 px) e continua a ter a colisão mais próxima das onze, que é a Pordata.

**4.º · I, o selo dentro do «E».** Diz o mesmo que a H com a letra da casa em vez da letra nova, e mede quase tão bem (uma ilha, mediana de 10 px). Fica em terceiro por duas medidas: **o selo fecha-se abaixo dos 32 px** (0,67 px de ar a 32, 0,34 a 16), o que quer dizer que metade da ideia não chega ao favicon; e o «E» dela é um «E» serifado normal, que é a anatomia do Expresso e do Economist. É a melhor escolha para quem quiser a letra da casa e não uma letra nova.

**5.º · B, o «O» com o acento.** Continua a ser a mais portuguesa sem ser nada do Estado, e a única que faz da ortografia uma forma. Desce de segundo para quarto pela mesma razão que a G: constrói o artigo. A lupa continua por vizinha, e a via que falta experimentar continua a ser o acento a atravessar o anel em vez de sair dele.

**6.º · C, o selo.** É a que mais fielmente diz o que o sítio faz e a mais sóbria, e continua a ser a melhor candidata a **marca secundária**: o quadrado cheio e o quadrado a tracejado servem de sinal dentro do sítio seja qual for o ícone. Não sobe porque a leitura de «selecionar» é forte e porque a 32 px perde o tracejado, que é metade da ideia.

**7.º · J, a palavra «Estado».** Fica no ramo como o degrau anterior à J2, e não como candidata: a J2 é a J com o «E» corrigido, e não há nada que a J faça melhor. A 60 px o que resta dela é um «E» serifado sem nada dentro, que é o sinal mais genérico das onze. Guarda-se porque é ela que mostra o que a linha do valor acrescenta: as duas estão lado a lado na prancha, à mesma escala.

**8.º · A, a ligadura «OE».** A letra está bem construída e a solda funciona. Fica aqui por uma razão que nenhum desenho resolve: **«OE» é o Orçamento do Estado**, e este é um sítio sobre contas públicas.

**9.º · F, a régua.** A mais robusta a todos os tamanhos, com folga (corrida mínima de 8 px, o dobro da segunda). Fica em oitavo porque um sinal abstrato não diz o nome de nada e porque, lido depressa, é uma barra de progresso. É a melhor escolha se o critério for só «que se veja»; não é, se for «que diga».

**10.º · E, o mapa.** Cumpre a dignidade das três parcelas à custa da geografia e da legibilidade: a 60 px lê-se a estrutura, não o país. E é o sinal com mais donos possíveis.

**11.º · D, o azulejo.** Lê como célula de folha de cálculo, e a medição diz porquê: metade do desenho é fio de 2 px. Se a direção a quiser, o caminho é largar o fio e a régua e ficar com uma pincelada só, o que já é outra direção.

**Uma nota que não é preferência, é aviso.** As onze estão desenhadas para serem iteráveis no Claude Design: cada SVG é geométrico, com os números todos à vista e comentados, e `desenhar.py` tem cada medida numa constante com o motivo ao lado. A que for escolhida ainda precisa de: um manifesto (`display: standalone`, `start_url`, `icons` de 192 e 512 e um `maskable`), a linha `apple-touch-icon` no `<head>` de `Base.astro`, e os PNG em `public/`. Nada disso está feito, e nenhuma dessas três coisas é decisão do construtor. E há uma quarta, que a maqueta acrescentou: o `short_name` do manifesto, porque é ele que fica escrito por baixo do ícone e é ele que corta.

---

## 7 · O que se mediu, e como

* **A legibilidade** foi medida nas capturas de `EXPORT/`, e não estimada dos SVG: cada PNG foi lido píxel a píxel, contadas as componentes ligadas de tinta (vizinhança de 4, tinta é cinzento abaixo de 200) e as corridas de tinta em linha e em coluna. A tabela da §5 é essa leitura, refeita a 28.08 para as onze com o mesmo programa. O que está escrito em prosa («lê-se», «é poeira», «lê-se F e não E») é o que se viu ao abrir as capturas, ampliadas quatro e oito vezes, e não o que os números sugeriam.
* **O «O» do Spectral** foi medido no ficheiro da casa, desenhado a 700 de altura e contado a píxeis, não tirado de uma tabela.
* **O círculo seguro do `maskable`** está agora conferido **no PNG**, e não só por construção, e foi essa medição que apanhou um erro que estava lá desde o princípio. `transform` de CSS e `transform` de atributo são a mesma propriedade, e o CSS ganha: enquanto a regra do `maskable` apanhava `.sinal` directamente, o `scale(0,78)` **substituía** o enquadramento de `enquadra()` em vez de se compor com ele. As direções enquadradas saíam erradas e ninguém tinha medido: a G dava 233 px de lado em 512 em vez de 281, e a I saía cortada em cima. A redução passou a um grupo de fora, que não tem atributo nenhum. Medido nos dez PNG de 512: **282 px de lado (a J, 274, porque a palavra tem folga à direita), centro em 255,5 e meia-diagonal entre 141 e 199, todas abaixo dos 204,8** do raio de 40 %. As direções C, D, F e E nunca estiveram erradas, porque nunca tiveram transformação de atributo.
* **Os contrastes** não foram medidos aqui: são os que `src/styles/tokens.css` já traz medidos por `scripts/medir-contraste.mjs`, e estão citados com o número que lá está.
* **As colisões** foram vistas na folha das 42 referências, à mesma escala, e a tira «A vizinhança a 60 px» da prancha põe as onze direções na mesma linha que dezasseis delas. É lá que se vê o «E» da J ao lado do «E» do Expresso e do «E» do Economist, e é lá que se vê o que a linha do valor da J2 lhe acrescenta.
* **A maqueta do ecrã principal** é composta em `desenhar.py ecras`, e o que nela é medido é a geometria: cela de 180 px (60 pt a 3×), largura de 1170 px (390 pt a 3×), arredondamento de 22,37 %. O que **não** é medido, e fica dito como inferência, é o rótulo: 33 px são 11 pt a 3×, e esse valor não foi conferido contra a documentação da Apple, que não se pode consultar sem rede; o tipo do rótulo é o Helvetica do sistema e não o do telemóvel. O fundo liso e cinzento médio é escolha, e a razão está na §5: um fundo claro de mais fabricava o problema em vez de o medir. Dois dos oito ícones de referência (Pordata, 48 px; Poder360, 57 px) foram ampliados para 180 e por isso saem moles, o que num telemóvel a sério não aconteceria.
* **O cabeçalho** foi medido em `src/styles/site.css` (`.wordmark`: `clamp(34px, 7.4vw, 68px)`, e a compacta `clamp(24px, 3.4vw, 34px)`) e a altura de maiúscula do Spectral na tabela `OS/2` do ficheiro (660 em 1000). As três linhas da prancha estão a 1:1: a altura de cada SVG em píxeis é a altura da caixa de tinta nas mesmas unidades.
* **A altura de x e as hastes do Spectral** foram medidas no ficheiro da casa: `sxHeight` 454 e `sCapHeight` 660 vêm da tabela `OS/2` do `Spectral-SemiBold.woff2`; a haste do «d» (98,3 no SemiBold, 68,9 no Regular) foi contada no contorno, com as curvas achatadas em segmentos e a linha do meio do glifo cruzada. Nenhum destes números veio de uma tabela de fora.

---

## 8 · O que não se fez, e devia ficar dito

* **Não se experimentou o âmbar como acento na direção B.** Foi descartado por medição e não por gosto: o âmbar sobre papel claro mede 2,09:1, e um traço de 6 px a 60 nessa relação é uma mancha pálida. O cobalto mede 7,73:1. Está na §5.
* **Não há versão em cinzento nem em uma cor só.** Um ícone de telemóvel não a pede; uma marca a sério acaba por pedir.
* **O alfabeto da casa tem agora dois «E»** (o serifado da A, da I e da J, e o de três barras da H) e não tem «s». Se a direção escolher a J e quiser a palavra desenhada inteira, é o «s» que falta, e a §4 diz porque é que ele não sai desta grelha: a regra do remate cortado a direito. Um «s» obriga a mudar essa regra, e mudar essa regra muda todas as letras.
* **A marca horizontal das nove primeiras usa o nome composto em Spectral**, e não desenhado. A da J e a da J2 têm «Estado» desenhado e o resto composto, que é o mais longe que este trabalho foi. E havia lá um erro que só se viu ao medir a caixa: o topo do `viewBox` estava na altura de maiúscula e não na tinta, e por isso a ascendente do «d» de «Estado» saía cortada em 13,6 unidades de 113,6. Está corrigido, e a caixa passou a ser medida nos contornos. Se a direção quiser o nome inteiro desenhado, é outro trabalho, e maior do que este.
* **Não se experimentou a linha do valor noutra cor que não o cobalto**, nem em cinzento. O sítio tem o âmbar para «fora do limiar», e uma linha de valor âmbar diria uma coisa que a marca não pode prometer.
* **A maqueta não tem fotografia por baixo.** Um ecrã principal a sério tem, e há fotografias que engolem um campo de papel. Quem quiser essa prova tem de a fazer com a fotografia do próprio telefone.
* **Não se experimentou o «E» de três barras com quatro linhas nem com duas.** Três é o número de campos que uma linha do livro-razão nunca tem em falta, e é também o número de braços de um «E». As duas coisas coincidirem é a razão de a H existir; se o livro-razão tivesse quatro campos obrigatórios, esta direção não existia.

---

## 9 · O custo

Cerca de **320 mil símbolos** na primeira sessão (as sete direções), cerca de **300 mil** na segunda (as três da terceira adenda) e cerca de **90 mil** na terceira (a J2, as maquetas e o cabeçalho), quase todos em ida e volta entre desenhar, exportar, **olhar as capturas** e corrigir.

As correções que gastaram mais foram sempre as que só se viram olhando. Na segunda sessão foram três: o «E» com os braços a decrescer, que lia «F»; o «s» desenhado, que ao fim de doze construções continuava a ler-se como dois discos; e o `maskable`, que estava errado desde a primeira sessão em três direções e que nenhum SVG denunciava, porque o erro só existe depois de o navegador aplicar o CSS.

Na terceira foram duas, e a segunda mudou uma recomendação: a caixa do lockup, que cortava a ascendente do «d»; e **a maqueta do ecrã principal, que mostrou que a palavra não segura uma cela de 180 px**. Essa não se via em campo branco, não se via na prancha, e não se via em número nenhum que estivesse a ser contado até aqui: só se viu ao pôr o ícone entre os outros, ao tamanho a que a mão o vê. É a razão de a maqueta existir, e o argumento para a fazer antes e não depois.
