# NOTAS · a marca e o ícone do telemóvel

*Escrito a 28.08.2026 pelo construtor (Claude Opus 5) a partir de `BRIEF-marca.md` e das três adendas do gabinete (a terceira está no ramo, em `ADENDA-3-estado.md`). Trabalho de exploração: nada disto está no sítio. Sem elogios: o que está escrito é o que se viu nas capturas, e o que se mediu está dito com o número.*

---

## 0 · O que está aqui, e o que não está

**Está:** dezanove desenhos em `direcoes/*.svg` (o campo é 512, o sinal cabe em 360), a prancha `PRANCHA.html` com a captura `PRANCHA.png`, os PNG de cada um em `EXPORT/`, as maquetas do ecrã principal em `ECRA-*.png`, e os dois programas que os fazem. As sete primeiras são de 28.08 de manhã; a H, a I e a J são a resposta à terceira adenda, que pediu a palavra «Estado»; a J2 é a quarta adenda, depois de o diretor ter escolhido a palavra; e as **sete vozes** (`12` a `18`, mais a `14b`, que é um campo alternativo e não uma voz) são a resposta à quinta, depois de o diretor ter dito que a palavra ao tamanho de um ícone pode não funcionar e que não encontrou nenhum desenho de que gostasse. As vozes estão na §6; as onze primeiras na §5. **E está a direção K**, que é do diretor e não desta casa: sete SVG em `direcoes-k/` tal como vieram, as variantes K2 a K5 em `direcoes-k/derivadas/`, os marcadores de `derivados-k/`, as quatro folhas `FOLHA-K.png`, `ECRA-SEPARADORES-K.png`, `ECRA-K.png` e `CABECALHO-K.png`, e os dois programas que as fazem (`render-k.mjs` e `marca-k.py`). Está na §6 quinquies.

**E está, ao lado e não no meio, uma exploração:** cinquenta e cinco desenhos em `direcoes-e2/*.svg`, os PNG deles em `EXPORT-E2/`, e as três folhas `FOLHA-E2.png`, `FOLHA-E2-cores.png` e `ECRA-E2.png`. É a resposta à sexta adenda, que não pede uma variante mas uma grelha: oito comprimentos de barra contra cinco cortes, e seis pares de cor. **Não são direções**, e por isso não estão em `direcoes/`, não entram na prancha e não entram na ordem da §7: são células de uma tabela, e uma célula de tabela não é uma proposta de marca. Estão na §6 ter.

**Não está:** nenhum ficheiro em `public/`, nenhuma linha no `<head>` de `src/layouts/Base.astro`, nenhum manifesto, nenhuma dependência nova no `package.json`. O sítio no ar continua sem ícone, exatamente como estava. `npm run typecheck` passa, e passava antes: `tsconfig.check.json` não olha para `design/`.

**A ordem em que isto se refaz**, e importa porque a prancha embebe os PNG:

```
python3 design/marca/desenhar.py          # os dezanove SVG
node   design/marca/exportar.mjs          # 14 PNG por direção (16 nas que têm palavra)
python3 design/marca/desenhar.py ecras    # as três maquetas da quarta adenda
python3 design/marca/desenhar.py vozes    # ECRA-VOZES.png, a folha das sete vozes
python3 design/marca/desenhar.py prancha  # a prancha, com os PNG e as maquetas lá dentro
node   design/marca/exportar.mjs          # a captura PRANCHA.png
```

E a ronda da SÉTIMA adenda, que é a palavra «estado» em minúsculas, e que tem
programas próprios porque não desenha ícones nem passa pela prancha: as letras
saem de `estado.py`, os cabeçalhos e as celas saem do navegador com
`render-estado.mjs`, e as folhas voltam a `estado.py`:

```
python3 design/marca/estado.py                    os SVG das duas construções
node   design/marca/render-estado.mjs             os cabeçalhos, as celas, os alfabetos
python3 design/marca/estado.py medir              a régua, lida dos PNG
python3 design/marca/estado.py ecras              as maquetas do ecrã principal
python3 design/marca/estado.py separadores        ECRA-SEPARADORES.png
python3 design/marca/estado.py folhas             as quatro FOLHA-ESTADO*.png
```

E a ronda de exploração da sexta adenda, que é outra corrente e não passa por
`direcoes/` nem pela prancha:

```
python3 design/marca/desenhar.py e2               # os 55 SVG de direcoes-e2/
node   design/marca/exportar.mjs e2               # 3 PNG por célula, para EXPORT-E2/
python3 design/marca/desenhar.py folha-e2         # FOLHA-E2.png, a barra contra o corte
python3 design/marca/desenhar.py folha-e2-cores   # FOLHA-E2-cores.png
python3 design/marca/desenhar.py ecra-e2          # ECRA-E2.png
```

E dois comandos que não escrevem desenho nenhum, e que existem para os números
desta nota se poderem conferir: `desenhar.py medir [tamanhos]`, que lê os PNG de
`EXPORT/` e conta a tinta, o sinal, as ilhas e as corridas; e
`desenhar.py contrastes`, que calcula os pares de cor da sétima voz pela fórmula
da WCAG. A estes juntou-se `desenhar.py medir-e` (a régua do «e» refinado, §6 bis) e
`desenhar.py medir-e2` (a da grelha, §6 ter), que lê `EXPORT-E2/` e conta também as
ilhas do sinal, a folga da barra e a abertura procurada no sector do corte.

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

**A tabela foi refeita para as onze com o mesmo programa**, e por isso quatro números das sete primeiras mexeram: a corrida mínima da A e da B (de 2 para 1 px), as ilhas da E a 60 (de 10 para 8) e a 16 (de 3 para 2). O método está escrito na §8 e é agora um só para as onze; a leitura em prosa não muda com um píxel de corrida mínima. A coluna da tinta é nova e mede quanto do campo de 60 por 60 está pintado.

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

## 6 · As seis vozes, e a sétima que o diretor pediu

*Uma nota de arrumação antes de tudo, porque os números colidem: o ficheiro desta adenda chama-se `ADENDA-4-vozes.md` e intitula-se «adenda 4», mas nas secções anteriores desta nota «a quarta adenda» é a que pediu a J2 e as maquetas do ecrã principal. Para não haver dúvida, daqui para baixo esta chama-se **a adenda das vozes**, e é a quinta pela ordem em que chegaram ao ramo.*

*O diretor viu as onze e as maquetas, e disse duas coisas: a palavra ao tamanho de um ícone «pode não funcionar, por causa do tamanho», e não encontrou nenhum desenho de que gostasse. O conceito não mudou (a palavra «Estado», com os dois sentidos, e o «E» como sinal pequeno); mudou a voz. As onze anteriores partilhavam uma grelha só, uma serifada só e um campo só, e por isso não eram onze respostas: eram uma resposta com onze recortes. Estas sete são sete anatomias e sete decisões de campo. A adenda e o aditamento que trouxe a sétima voz estão no ramo, em `ADENDA-4-vozes.md`.*

### O que é novo na ferramenta, e porque foi preciso

As onze primeiras são feitas de rectângulos, circunferências e arcos, porque a regra da casa é o remate cortado a direito (§4). Um «s», um «a» de dois andares e um «E» de escrita não saem dessa gramática, e é por isso que a J e a J2 acabaram a compor «stado» em Spectral: o «s» não saía da grelha, ao fim de doze construções.

O que estas sete trazem é **uma pena**, ou melhor, duas: um esqueleto amostrado ponto a ponto, e duas maneiras de lhe dar corpo.

* **A pena de bico** (`pena_ponteada`): a grossura varia ao longo do traço, medida na normal ao esqueleto. É ela que dá a espinha de um «s», o arco de um «a» de dois andares e o remate em bico de uma Didone.
* **A pena de aparo largo** (`pena_larga`, `pena_larga_fechada`): a grossura é fixa e o bico tem um ângulo fixo, e o traço fica grosso onde é perpendicular ao bico e fino onde lhe é paralelo. O contraste da sexta voz não é desenhado: é a consequência de um aparo a 32 graus.

**Com isto, «Estado» está desenhado inteiro em todas as sete**, o «s» incluído, e nenhuma delas põe contorno de um tipo dentro do sinal. O que continua composto em Spectral é o artigo e o «do País» na marca horizontal, que é o que a §1 já cobre; a voz do cinzel usa Spectral SC nessas duas partes, porque a palavra dela é versal.

**E há uma segunda coisa que o espacejamento obrigou a mudar.** As letras eram postas umas a seguir às outras pelo avanço de cada uma, e isso chega quando a letra cabe no avanço. Não chega quando uma serifa sai, quando o travessão de um «t» passa da haste ou quando o arco de um «a» começa à esquerda do bojo: na voz condensada, o «t» tinha um avanço de 86,8 e uma haste que acabava aos 93,5, e entrava no «a». Agora **cada letra é desenhada duas vezes**, a primeira na origem só para se lhe medir a caixa de tinta, e a segunda no sítio em que essa caixa fica à distância pedida da tinta da letra anterior. O espaço é medido na tinta, e não no avanço.

### Três desenhos, e não dois, e o erro que obrigou a isso

Nas onze primeiras havia dois desenhos por direção: o sinal, até aos 60 px, e a simplificação, dos 32 para baixo. Nas sete vozes o sinal grande é a **palavra** e o sinal do telemóvel é a **letra**, e são objetos diferentes. Com dois grupos só, a cela de 180 px acabava a mostrar a letra **engrossada** do favicon: a Didone chegava ao tamanho a que o diretor a julga com contraste 1,9, quando o desenho dela é 6,55. Isto não se via em número nenhum e não se via no SVG; viu-se ao pôr as capturas lado a lado.

São agora três: a **palavra** aos 512, a **letra** da voz (com os números da voz) dos 192 aos 60, e a **simplificação** aos 32 e 16. O `maskable` leva a letra nos dois tamanhos, porque um ícone adaptável do Android desenha-se a 108 px.

### O que é novo na medição, e é preciso dizê-lo antes dos números

Até aqui, campo de papel em todas as direções, e por isso «tinta da cela» e «mancha do sinal» eram a mesma coisa. Deixaram de ser. Numa direção de campo de tinta com letra de papel, a cela está toda escura e o sinal é o que está claro lá dentro. São por isso duas colunas:

* **tinta**: quanto da cela está abaixo do cinzento 200. É o número que diz se o ícone é uma mancha no ecrã principal ou um vazio, e é ele que compara com os **4,7 % da palavra da J2** e os **19,8 % da letra da J2**, que foi a medição que fez esta ronda existir.
* **sinal**: quanto da cela é diferente do campo. É a letra.

**Uma ressalva que o número exige:** o âmbar `#e0a21a` tem luminância 165 e cai abaixo do limiar de 200. Por isso a terceira e a sétima vozes aparecem com «tinta 100 %», e isso não quer dizer que a cela seja escura: quer dizer que é um bloco de cor cheio, sem papel nenhum à vista. Quem ler a coluna sem ler esta linha lê mal.

### A régua das sete

Tudo medido nas capturas de `EXPORT/`, com o programa da §8 (`desenhar.py medir`), e não estimado.

| voz | campo | letra | contraste | tinta a 60 | sinal a 60 | ilhas a 60 | corrida min/med a 60 | sinal a 16 | min a 16 |
|---|---|---|---|---|---|---|---|---|---|
| 1 · Didone | tinta | papel | 16,39:1 | 86,6 % | 18,6 % | 1 | 2 / 12 | 27,3 % | 2 |
| 2 · cinzel | ocre | papel | 6,37:1 | 88,3 % | 14,3 % | 1 | 2 / 4 | 27,0 % | 1 |
| 3 · geométrica | âmbar | tinta | 7,85:1 | 100 % | 31,0 % | 1 | **12 / 12** | 35,9 % | **4** |
| 3b · a mesma | cobalto | papel | 7,73:1 | 71,0 % | 31,9 % | 1 | 12 / 13 | 38,3 % | 2 |
| 4 · laje | papel | tinta | 16,39:1 | 24,8 % | 27,3 % | 1 | 6 / 12 | 38,3 % | 3 |
| 5 · condensada | tinta | papel | 16,39:1 | 88,0 % | 19,8 % | 1 | 9 / 16 | 25,0 % | 3 |
| 6 · caligráfica | papel | tinta | 16,39:1 | **8,0 %** | 8,8 % | **2** | 1 / 4 | 17,2 % | 1 |
| 7 · o «e» | tinta | âmbar | 7,85:1 | 100 % | 17,4 % | 1 | 1 / 6 | 23,8 % | 1 |

A maiúscula da letra na cela de 180 px é **126,6 px** em quatro das sete (a régua do enquadramento é a mesma), **118,4 px** na do cinzel e **115,4 px** na caligráfica, que são as duas cujo desenho é mais largo do que alto. A da sétima voz não tem maiúscula: o «e» dá **97,6 px de diâmetro** a 180.

**E a coluna que responde ao diretor à letra.** A palavra na mesma cela de 180 px, medida no ficheiro `-180-palavra.png` de cada voz:

| voz | palavra L:A | maiúsc. da palavra a 180 | sinal a 180 (a palavra) | sinal a 180 (a letra) |
|---|---|---|---|---|
| 1 · Didone | 3,81 | 30,7 px | 4,7 % | 16,2 % |
| 2 · cinzel | 4,35 | 25,1 px | 3,9 % | 13,1 % |
| 3 · geométrica | 4,55 | 24,9 px | 6,4 % | 30,4 % |
| 4 · laje | 4,78 | 24,0 px | 5,2 % | 24,7 % |
| 5 · condensada | **3,07** | **36,3 px** | **9,1 %** | 18,4 % |
| 6 · caligráfica | 3,16 | 33,4 px | 4,4 % | 7,5 % |

A palavra da J2 pintava 4,7 %, e foi por isso que a maqueta a reprovou. **Cinco das seis vozes com palavra estão no mesmo sítio ou pior. Uma não está**, e é a condensada, que pinta o dobro, porque a palavra dela mede 3,07 de largura por 1 de altura e as outras medem até 4,78. Num campo quadrado, quem é mais estreito é maior. **Mesmo assim, em todas as seis a letra pinta mais do que a palavra**, e na condensada pinta o dobro dela: a objeção do diretor está confirmada por medição, e o que a atenua não a anula.

---

### Voz 1 · editorial de contraste alto (`direcoes/12-didone-estado.svg`)

**A 180 px.** Um «E» de papel em campo de tinta, com a maiúscula a 126,6 px, a haste a 33,2 px e o fino a 5,1 px: contraste 6,55, que é o maior das sete e quase o triplo do 2,33 da grelha da casa. A cela é uma mancha escura com uma letra clara e nada mais.

**A 60 px.** Uma ilha, mediana de 12 px, **mínima de 2 px**, que é o fino do braço. O fino ainda se lê como fino, e é aos 60 px que esta voz ainda é ela própria.

**A 16 px.** Aqui deixa de ser. O fino do desenho grande daria **0,45 px**, e por isso a simplificação sobe-o de 0,040 para 0,128 H, ou seja de 0,45 para 1,44 px, e tira as serifas. **O contraste cai de 6,55 para 1,9**: o que fica no favicon é um «E» pesado sem contraste, que é o contrário do que esta voz é. Uma voz que só existe acima dos 32 px não é uma voz de ícone.

**A tinta da cela.** 86,6 % a 60 px; sinal 18,6 %.

**A colisão mais próxima.** Duas, ambas na folha. Pela letra: o **Expresso** (campo azul-petróleo, «E» serifado branco) e o **Economist** (campo vermelho, «E» serifado branco). Este é a terceira ocorrência do mesmo objeto no mesmo ecrã, e a única distância é o campo ser preto. Pelo campo: o **Le Monde** (campo preto, letra clara desenhada).

**O que a voz diz do sítio.** Editorial: diz «isto é um jornal». É a leitura mais confortável e a menos própria, porque o sítio não é um jornal, é um observatório com um livro-razão.

### Voz 2 · inscricional (`direcoes/13-inscricional-estado.svg`)

**A 180 px.** «ESTADO» em versais no ícone de 512; na cela, o «E» do cinzel, com a maiúscula a 118,4 px, a haste a 0,125 H e o fino a 9,7 px (contraste 1,52, o mais baixo depois da condensada) e remates em cunha que alargam para fora. O braço do meio é a **faixa incisa**: passa de 0,082 para 0,215 H (25,5 px) e leva um sulco de 7,3 px do próprio campo cortado a meio. É a única das sete em que a segunda leitura não gasta uma segunda cor: a linha do livro-razão está gravada, não pintada.

**A 60 px.** Uma ilha, mediana de 4 px, mínima de 2 px. O sulco mede **2,45 px** e ainda se vê como cavidade.

**A 16 px.** Uma ilha, mínima de 1 px. O sulco mede **0,63 px** e **fecha-se**: o que fica é um braço do meio mais grosso do que os outros, sem cavidade nenhuma. Metade da ideia não chega ao favicon, exatamente como aconteceu ao selo da direção I (§5).

**A tinta da cela.** 88,3 % a 60 px; sinal **14,3 %**, que é o menor das cinco que se leem, porque uma versal romana é leve por definição.

**A colisão mais próxima.** Pela cor, nenhuma: **ninguém nas 42 referências tem campo ocre nem castanho**. O mais próximo em matiz é o laranja do Poder360, que é outra família e é brasileiro. Pela letra, o Expresso e o Economist outra vez, com a distância a ser a construção (contraste 1,52 contra o deles) e o remate em cunha.

**O que a voz diz do sítio.** Institucional: diz «isto está cortado em pedra». E é aí que está o problema, e não é de desenho: as versais romanas são a língua das fachadas do Estado tanto quanto a das escolas e dos pelourinhos, e num sítio chamado «O Estado do País» empurram a leitura para a instituição, que é o lado onde a terceira adenda pediu para o leitor **não** ficar. Não há aqui heráldica nenhuma, nem verde, nem vermelho, nem tipografia de nenhum órgão do Estado: o problema é o que a forma diz, e não o que ela cita.

### Voz 3 · geométrica pesada, campo âmbar (`direcoes/14-geometrica-ambar.svg`) e a alternativa (`14b-geometrica-cobalto.svg`)

**A 180 px.** Uma grossura só (0,275 H, ou 34,8 px), sem serifa, sem contraste, o braço a 0,70 H. O sinal ocupa 30,4 % da cela, o maior das sete.

**A 60 px.** Uma ilha, **corrida mínima de 12 px e mediana de 12**, que são os melhores números destas sete e de todas as dezanove direções do ramo: a régua, que era a mais robusta das onze, tinha mínima de 8. Uma letra sem finos não tem onde partir.

**A 16 px.** Uma ilha, **mínima de 4 px**, também a melhor das dezanove. É a única em que a simplificação quase não muda o desenho (a grossura sobe de 0,275 para 0,285 H), pela mesma razão: não há nada que morra.

**A tinta da cela.** 100 % (o campo é um bloco de cor cheio, ver a ressalva acima); sinal 31,0 % a 60 px.

**A resposta à pergunta da adenda: qual dos dois campos é ownable.** A maqueta responde sem margem.

* **O cobalto não é.** Campo azul-escuro com letra branca **é o Expresso**, e a letra é a mesma. Na folha há ainda o azul da RTP, o disco azul da Pordata e o anel azul-claro do Observador. Na maqueta do ecrã principal a cela 3b e a do Expresso ficam a três celas de distância e leem-se como do mesmo dono.
* **O âmbar é.** Nas 42 referências ninguém tem campo âmbar nem ocre. Os vizinhos de matiz são o laranja saturado do Poder360 e o disco preto com «P» amarelo da Agência Pública, que é letra amarela em campo escuro, ou seja o contrário deste. Entre os portugueses da folha não há nenhum.

E a cor da letra não é escolha, está medida: **papel sobre âmbar dá 2,09:1** e não serve para objeto nenhum; **tinta sobre âmbar dá 7,85:1**. Por isso em campo âmbar a letra é de tinta, e a versão de letra de papel é a de campo cobalto.

**O que a voz diz do sítio.** Instrumento de mercado: é o registo do «B» da Bloomberg, e diz «isto é uma marca de dados». **O que pesa contra, e é sério:** no sítio, o âmbar quer dizer **fora do limiar** (`tokens.css`, `--amber`; é a cor da palavra do estado quando o país está aquém). Uma marca âmbar diz ao leitor, antes de ele ler número nenhum, que o país está fora do limiar. Não é uma colisão de marca, é uma colisão de semântica com o próprio instrumento, e não se resolve com desenho.

### Voz 4 · laje de instrumento (`direcoes/15-laje-instrumento.svg`)

**A 180 px.** Um «E» de tinta em campo de papel, com a laje da Bitter engrossada (haste 0,255 H, fino 18,7 px, contraste 1,61) e o braço do meio trocado pela **linha do valor em cobalto a 0,21 H (26,6 px)**, que é a ideia da J2 nesta anatomia. A laje é um remate que desce para dentro da letra: pô-la a passar a linha de maiúscula foi o primeiro erro desta voz e fazia a letra crescer para fora do quadrado do sinal.

**A 60 px.** Uma ilha, mediana de 12 px, mínima de 6 px. A linha do valor mede **8,9 px** e os braços de tinta 6,2 px: a linha é mais grossa do que os braços, e por isso lê-se como outro objeto dentro da letra e não como um braço pintado, que é a regra da §4.

**A 16 px.** Uma ilha, mínima de 3 px. A linha do valor mede 2,4 px e os braços 1,9 px. **A linha sobrevive**, como já sobrevivia na H e na J2.

**A tinta da cela.** 24,8 % a 60 px; sinal 27,3 %. É **mais pesada do que a letra da J2** (19,8 %) e é a única das sete com campo de papel e letra de tinta, ou seja a única que repete a receita que a maqueta anterior reprovou. Na folha do ecrã principal vê-se o que os 24,8 % compram: lê-se, e é, com a caligráfica, uma das duas celas mais claras do ecrã.

**A colisão mais próxima.** O **Negócios** (campo branco, «n» de laje preto) é a mais próxima em construção e em campo. Na maqueta a mais próxima é o **NYTimes** (campo claro, letra desenhada preta), a uma cela de distância. A **Folha** (campo branco, «F») é a terceira.

**O que a voz diz do sítio.** Instrumento: é a única das sete que fala a língua que o sítio já fala nos gráficos, porque a Bitter está lá dentro. Diz «isto é um aparelho de medida», que é a coisa mais verdadeira que qualquer uma destas sete diz.

### Voz 5 · grotesca condensada (`direcoes/16-condensada-estado.svg`)

**A 180 px.** Um «E» de papel em campo de tinta, estreito (braço a 0,45 H contra os 0,70 da geométrica), com o âmbar no braço do meio a 0,24 H (30,4 px). E é aqui que esta voz se separa das outras: a **palavra** na mesma cela dá 36,3 px de maiúscula contra 24 a 31 nas outras, e pinta 9,1 % contra 3,9 a 6,4 %.

**A 60 px.** Uma ilha, mediana de 16 px (a segunda maior), mínima de 9 px. O braço mede 8,7 px e a barra âmbar 10,1 px.

**A 16 px.** Uma ilha, mínima de 3 px, e a barra âmbar continua a ler-se a 2,7 px.

**A tinta da cela.** 88,0 % a 60 px; sinal 19,8 %, que por acaso é o mesmo número da letra da J2, com a diferença de o campo aqui ser cheio.

**A colisão mais próxima.** Pelo campo: **Le Monde** e **De Correspondent**, os dois com campo preto e letra clara, os dois estrangeiros. Entre os portugueses da folha, campo de tinta com letra de papel não é de ninguém. Pela letra, nenhuma: não há na folha uma grotesca condensada.

**O que a voz diz do sítio.** Popular: é a voz do cartaz à porta do quiosque. Diz «isto é para ser lido de longe e depressa», que é verdade do ícone e é falso do conteúdo.

### Voz 6 · caligráfica (`direcoes/17-caligrafica-estado.svg`)

**A 180 px.** Um aparo largo a 32 graus, meia largura 0,062 H (7,2 px a 180), passado por cima de um esqueleto. O «E» é **um traço só**, sem levantar o aparo: entra em cima à direita, dá a volta por cima, desce, faz a cintura para a direita e volta, e sai em baixo à direita. **Já a 180 px são duas ilhas**: o fino do aparo, no sítio em que o traço corre paralelo ao bico, abre a letra.

**A 60 px.** Duas ilhas outra vez, corrida mínima de 1 px, mediana de 4 px. É a única das sete que se parte, e parte-se nos dois tamanhos que contam.

**A 16 px.** Uma ilha (a esta escala o suavizado volta a colar o que estava aberto), mínima de 1 px, mediana de 2 px. O que se lê é um risco.

**A tinta da cela.** **8,0 % a 60 px**; sinal 8,8 %. Para comparar: a letra da J2 pintava 19,8 %, e a palavra da J2, que a maqueta reprovou por desaparecer, pintava 4,7 %. **Esta voz está entre as duas, e mais perto da que foi reprovada.**

**A colisão mais próxima.** **De Correspondent** (campo preto, letra cursiva clara) é a mais próxima em anatomia, com o contraste de campo invertido. Na maqueta, a cela que se lê de maneira mais parecida é a do NYTimes, porque as duas são letra desenhada escura em campo claro.

**O que a voz diz do sítio.** Pessoal: diz «isto foi escrito à mão por alguém». E há uma leitura pior, que é a primeira que aparece: **o «E» de escrita lê-se como «épsilon» antes de se ler como «E»**. Está assim nas capturas de 180, de 60 e de 16 px, e não é o desenho que falha, é a letra: um «E» de mão inglesa não tem haste vertical, e sem haste vertical, fora do contexto de uma palavra, é uma letra grega. Dentro da palavra «Estado» lê-se «E» sem esforço; sozinho, não.

### Voz 7 · o «e» minúsculo (`direcoes/18-e-minuscula.svg`), a ideia do diretor

**A 180 px.** Uma circunferência de grossura igual (banda de 15,0 px num diâmetro de 97,6 px, ou seja 0,31 do raio), com 52 graus cortados em baixo à direita, e uma barra de 13,7 px que atravessa e sai 0,30 raios para fora de cada lado. Nada mais. É a única das sete que não tem palavra: o sinal é o mesmo em todos os tamanhos.

**A 60 px.** Uma ilha, mediana de 6 px, mínima de 1 px, e a mínima é a ponta da banda no corte, que acaba num canto agudo. A banda mede 5,0 px e a barra 4,6 px.

**A 16 px.** Uma ilha, mediana de 3 px. A simplificação engrossa a banda e a barra 15 % e fecha a abertura de 52 para 42 graus, porque a 52 graus a abertura dá 1,4 px e some-se contra o campo. O que se lê continua a ser um «e».

**A tinta da cela.** 100 % (campo de tinta cheio); sinal 17,4 % a 60 px.

**«É o "O" de "O Estado" e o "E" de "Estado" na mesma forma?»** É, por construção: tirando a barra fica um anel, que é um «O»; pondo a barra fica um «e». Nenhuma das outras seis tem isto, porque em todas elas o «O» e o «E» são duas letras diferentes. **O leitor vê isso?** Não, e não é razoável esperar que veja: o que ele vê é um «e» minúsculo. A dupla leitura é uma razão de desenho, e serve para justificar a forma a quem a escolher, não para a explicar a quem a vir. O que o leitor pode ver, se lhe disserem, é a **barra a sair para fora do anel**, que já não é a travessa de nenhum «e» de tipo: essa é a linha da régua, e é o único sítio desta forma em que o sítio se declara.

**As quatro cores, medidas** (fórmula da WCAG, contada em `desenhar.py contrastes`, não copiada; 3:1 para objeto gráfico, 4,5:1 para texto):

| par | contraste | 3:1 | 4,5:1 |
|---|---|---|---|
| (a) «e» âmbar em campo de tinta | 7,85:1 | passa | passa |
| (b) «e» de tinta em campo âmbar | 7,85:1 | passa | passa |
| (c) «e» âmbar em papel | **2,09:1** | **falha** | **falha** |
| (d) «e» ocre em papel | 6,37:1 | passa | passa |

Só o (c) falha, e falha nos dois limiares. É por isso que `tokens.css` obriga o marcador âmbar a levar contorno de tinta sobre papel claro, e a amostra (c) da prancha traz esse contorno: o que segura a forma ali não é o âmbar, é o contorno, que mede 16,39:1. **O ícone leva o par (a)**, âmbar em campo de tinta, que passa e que dá mancha cheia na cela.

**As três aberturas e as três barras estão desenhadas e vistas na prancha.** Com 100 graus cortados o anel abre e lê-se um «c» com uma barra; com 24 graus fecha e lê-se um «o» atravessado, que é a leitura de um símbolo de moeda. Os 52 graus são os que dão «e». Quanto à barra: dentro do anel dá a travessa de um «e» de tipo, e é a leitura mais neutra; a atravessar dá a linha de uma régua, e é a única que diz alguma coisa do sítio. **Ficou a que atravessa**, e a razão é essa.

**As colisões, e uma que não se desenhou de propósito.**

* **O «e» do navegador da Microsoft.** A adenda deixava desenhá-lo de memória, rotulado como tal. Não está desenhado, e é uma escolha: um desenho de memória de uma marca de outrem não é prova de nada, e sem rede não se confere no ficheiro deles. O que se pode dizer sem inventar é a diferença de construção: aquela marca é um «e» **inclinado**, com um anel ou faixa em órbita à volta, em azul; este é um «e» a prumo, de grossura igual, **sem órbita nenhuma**, com a abertura em baixo à direita e uma barra recta que atravessa. Pelo mesmo critério não se desenhou a marca da **Ecosia**: não se conferiu, e sem rede não se confere. Fica como pergunta em aberto, e não como resposta inventada.
* **O Eco (SAPO)** está na folha e está visto, e está na prancha ao lado do nosso a 120 e a 60 px: é um «e» feito de **arcos concêntricos** num campo verde-vivo, e a 60 px lê-se como um alvo. O nosso é uma banda só num campo de tinta. A distância é de construção e de cor.
* **A Agência Pública** (Brasil) é a colisão de cor mais próxima da folha: disco preto com «P» amarelo, ou seja letra amarela em campo escuro, que é a mesma receita. A distância é a letra e a forma do campo.
* **O âmbar e a semântica da régua.** No sítio, âmbar quer dizer «fora do limiar». **Uma marca em âmbar mistura-se com isso, e a resposta honesta é que sim, mistura.** Não como na terceira voz, onde o âmbar é o campo inteiro e a afirmação é grande; aqui é a letra, e a letra vive dentro de um campo de tinta, o que a lê como marca e não como marcador. Mas a mistura existe, e quem escolher esta voz escolhe também: ou muda o que o âmbar quer dizer nos instrumentos, ou aceita que a marca use a cor do alarme.

**A marca horizontal, nas duas leituras.** As duas estão na prancha. Com as maiúsculas da casa («O Estado do País») o sinal fica ao lado do nome como uma inicial que o nome não tem, e segura. Toda em minúsculas («o estado do país») a marca fica coerente com a forma do sinal, e **a escolha deixa de ser de desenho**: a maiúscula de «Estado» é justamente a marca ortográfica que faz a palavra ler-se como a instituição (§5, direção J). Escrever o nome em minúsculas é escolher a condição contra a instituição com ortografia, e é uma decisão de direção. **Na marca horizontal o «e» não é âmbar em papel claro**: é ocre `#7a5300` (6,37:1), e em papel escuro é o âmbar (8,00:1). Não é regra nova: é a que `tokens.css` já aplica à palavra do estado.

---

### O que a folha do ecrã principal respondeu

`ECRA-VOZES.png` põe as sete vozes (mais o campo alternativo da terceira) no mesmo ecrã claro, na mesma cela de 180 px, entre os mesmos oito ícones. Só ecrã claro, e de propósito: a pergunta desta ronda é a do campo, e um ecrã escuro daria vantagem a quem já tem campo escuro. O que se vê, e que os números sozinhos não diziam:

1. **O campo resolveu o problema que a ronda foi chamada a resolver.** Seis das oito celas são blocos de cor cheios e nenhuma delas obriga a aproximar os olhos. As duas de campo de papel (a laje e a caligráfica) são as mais claras do ecrã, e a caligráfica é a única que ainda obriga o leitor a chegar-se.
2. **O ecrã já tem três «E» claros em campo de cor.** Expresso, Economist e o nosso, seja qual for a voz serifada que se escolha. A geométrica e a condensada saem dessa família pela anatomia; a Didone e o cinzel não saem.
3. **O cobalto perde-se e o âmbar não.** A cela 3b e a do Expresso são a mesma coisa a três celas de distância. A cela âmbar é a única daquela cor no ecrã inteiro.
4. **A palavra continua a não segurar a cela**, em seis vozes de seis, e por isso o `apple-touch-icon` de qualquer uma delas leva a letra. A condensada é a que chega mais perto, e mesmo essa pinta 9,1 % contra os 18,4 % da sua própria letra.

---

### A ordem de preferência, só sobre estas sete

*Os critérios são os das rondas anteriores, e valem por esta ordem: diz o nome do sítio, diz o método, segura uma cela de 180 px entre os outros, lê-se a 60, sobrevive a 16, e não está em cima de ninguém. A adenda das vozes acrescentou um que não existia: **o que a voz diz do sítio antes de o leitor ler uma palavra**.*

**1.º · Voz 5, a grotesca condensada.** É a única das sete que responde à objeção do diretor com desenho, e não com uma troca de sinal: a palavra na cela de 180 px dá 36,3 px de maiúscula e pinta 9,1 %, contra 24 a 31 px e 3,9 a 6,4 % em todas as outras, porque a palavra dela mede 3,07 por 1. A letra segura a cela (19,8 %, mediana de 16 px, mínima de 9), a barra âmbar sobrevive aos 16 px, e entre os portugueses da folha nem o campo de tinta com letra de papel nem uma condensada são de alguém. Contra ela pesa o que a voz diz: cartaz de quiosque, e o sítio não é um cartaz; e o âmbar volta a dizer «fora do limiar», ainda que só num traço.

**2.º · Voz 3, a geométrica pesada em campo âmbar.** Mede melhor do que qualquer uma das dezanove direções deste ramo: mínima de 12 px a 60 e de 4 px a 16, contra os 8 e os 2 da régua, que era a mais robusta das onze. É a única cuja simplificação quase não muda o desenho, porque não tem finos que morram. E o âmbar é a única cor de campo que ninguém na folha ocupa, o que a maqueta confirma. Fica em segundo por uma razão que não é de desenho: **o âmbar, neste sítio, quer dizer «fora do limiar»**, e um campo inteiro dessa cor é a maior afirmação que qualquer destas sete faz sem pedir licença. Quem a escolher decide primeiro o que faz à semântica da régua.

**3.º · Voz 7, o «e» minúsculo.** É a mais distinta das sete: a única minúscula, a única redonda, a única em que as duas letras do nome são a mesma forma, e a única em que a barra que atravessa é, sem esforço, a linha de uma régua. Segura a cela (campo cheio, sinal 17,4 %) e chega inteira aos 16 px. Fica em terceiro por três medidas: a corrida mínima é de 1 px a 60 e a 16, o que a torna a mais frágil das cinco que se leem; **larga a palavra**, e com ela o conceito que o diretor confirmou, que fica a viver só na marca horizontal; e tem os donos mais gastos de todas, com o navegador da Microsoft à cabeça e o Eco na própria folha.

**4.º · Voz 4, a laje de instrumento.** É a que diz a coisa mais verdadeira sobre o sítio, e diz-a com o tipo que o sítio já usa nos gráficos: um aparelho de medida, com a linha do valor por dentro da letra e não pintada por cima. Mede bem (mediana de 12 px, mínima de 6) e a linha de cobalto é a última coisa a morrer aos 16 px. Fica em quarto porque é a única das sete que repete a receita que esta ronda foi chamada a corrigir: campo de papel com letra de tinta. Os 24,8 % de tinta são mais do que os 19,8 % da J2 e continuam a fazer dela uma das duas celas mais claras do ecrã.

**5.º · Voz 1, a Didone.** Lê-se a 180 e a 60 px, a cela é uma mancha cheia, e o contraste de 6,55 é o maior das sete. Fica em quinto por duas coisas medidas: é o terceiro «E» serifado claro em campo de cor do mesmo ecrã, ao lado do Expresso e do Economist, e a única distância é o campo ser preto; e aos 16 px o contraste, que é a voz inteira, cai para 1,9. Uma marca que perde a sua ideia no favicon perde-a no sítio onde ela mais se repete.

**6.º · Voz 2, o cinzel.** Tem a única cor de campo que ninguém ocupa, e o único sítio destas sete em que a segunda leitura não gasta uma segunda cor, que é a faixa incisa. Fica em sexto por duas razões: o sulco fecha-se abaixo dos 32 px (0,63 px aos 16), e por isso metade da ideia não chega ao favicon; e a voz empurra a leitura para a instituição, que é o lado do duplo sentido onde a terceira adenda pediu para o leitor não ficar. Some-se a isto o sinal mais leve das cinco que se leem, 14,3 %.

**7.º · Voz 6, a caligráfica.** Sai por medição e não por opinião: 8,0 % de tinta na cela de 60 px, **duas ilhas a 180 e a 60 px** (é a única das sete que se parte, e parte-se nos dois tamanhos que contam), corrida mínima de 1 px, e um «E» que se lê como «épsilon» antes de se ler como «E». É a cela mais fraca do ecrã principal desta folha, e a única que ainda obriga um leitor a aproximar-se, que era exatamente o defeito que esta ronda foi chamada a corrigir.

**E uma nota que não é preferência.** A **3b**, a geométrica em campo cobalto, não entra na ordem porque não é uma oitava voz: é a resposta desenhada à pergunta da adenda sobre qual dos dois campos é ownable. A resposta é que não é o cobalto, e a 3b fica no ramo para se poder ver que não é.

---

## 6 bis · O «e», refinado

*A quinta adenda (`ADENDA-5-e.md`) pôs o «e» do diretor à frente das sete vozes e mandou afinar três coisas antes de ele decidir: a barra, o corte e a cor. A meio da ronda chegou um aditamento com as palavras dele, o sinal «devia ser muito mais limpo, muito mais minimalista», e é ele que manda no fim, porque tira do desenho o objeto sobre o qual a primeira pergunta era feita. Esta secção traz as duas coisas por essa ordem. Tudo o que aqui tem número foi lido dos PNG de `EXPORT/` com `desenhar.py medir-e`, e não estimado.*

### O que a medição passou a dizer, e que não dizia

A adenda parte de uma observação: «a ponta do corte afina para 1 px» a 60 px. A corrida mínima é mesmo de 1 px e o sítio dela é mesmo o corte, mas **o que esse 1 px mede não é a matéria da ponta**. A face do corte é radial e encontra o arco de dentro num canto vivo; a linha de píxeis que passa rente a esse canto apanha um píxel, e apanharia um píxel em qualquer canto que não esteja alinhado com os eixos. É por isso que a geométrica da terceira voz mede 12: não é mais grossa, é mais quadrada.

A `medir_e` acrescentou por isso quatro números que a `medir` não tinha:

* **onde** está a corrida mínima, dito em relógio;
* a **matéria na ponta**, contada ao longo da face do corte, que é o que a adenda quer acima de 2 px;
* a **corda da abertura**, medida sobre a circunferência do meio da banda, que é o buraco que separa um «e» de um «o»;
* as **ilhas do fundo**: com o bojo aberto o vazio de dentro comunica com o campo, e o fundo tem duas ilhas (o campo, mais o olho fechado por cima da barra); com o bojo fechado tem três. É um inteiro, e não uma impressão.

Medida assim, **a ponta do corte do desenho de 28.08 de manhã tem 3,9 px a 60**, e não 1. Nenhuma das variantes desta ronda a tem abaixo de 3,1 px a 60. **A observação da adenda estava certa no número e errada no que ele media**, e a diferença muda o que há a corrigir: não era preciso engrossar a ponta.

### 1 · A barra, e a pergunta do «€»

Três versões, e a terceira nasceu de olhar para as duas primeiras.

| | anel a 180 | sinal a 60 | ponta a 60 | corda a 60 | corda a 16 |
|---|---|---|---|---|---|
| a barra atravessa dos dois lados (`18`) | 99 px | 17,4 % | 3,9 | 10,7 | 2,2 |
| a barra sai só à esquerda (`18i`) | **111 px** | 20,2 % | 6,1 | 10,1 | 3,0 |
| a barra acaba no bojo (`18b`) | **128 px** | 24,2 % | 6,1 | 14,2 | 3,8 |

**A barra que atravessa custa 23 % do diâmetro do anel**, e o motivo é a régua da casa: o sinal cabe num quadrado de 360 em 512, e a saliência tem de caber lá dentro com ele. Metade da saliência custa 13 %.

**O veredito do «€», visto e não argumentado.** A prancha tem a construção do sinal do euro desenhada ao lado das três, à mesma escala e com as mesmas proporções (bojo aberto, um «C» com 100 graus cortados, e duas barras que saem dos dois lados). Não é o glifo oficial nem o de tipo nenhum: é a anatomia, para se poder comparar. Ao olhar as quatro a 60 px, ampliadas oito vezes: **o que faz a leitura de moeda não é uma barra a sair, é uma barra a sair dos dois lados de um bojo redondo**, e a simetria horizontal é o que o olho apanha antes de contar quantas barras são. Das três, **só a `18` tem essa simetria**, e é ela a que um leitor de um sítio de contas públicas pode tomar por um sinal de moeda. A `18i` quebra a simetria e a `18b` não tem saliência nenhuma; nenhuma das duas se parece com aquilo.

**E a linha da régua.** É o contrário: só a barra que sai é que a diz. Com ela dentro do bojo o sinal é um «e» e mais nada, e o método do sítio deixa de estar no sinal. Era esta a troca que a adenda punha em cima da mesa, e é ela que o aditamento resolve por decreto, ao mandar que nada saia da forma. **Fica dito que a decisão de largar a linha da régua não foi de desenho: foi instrução.**

### 2 · O corte, contado da barra

O corte conta-se **da barra** e não do ângulo do ficheiro. No desenho antigo a banda acabava a menos 6 graus e a barra, com 42 de grossura num raio de 150, tapava-lhe **8,05 graus** da ponta de cima: dizer «50 graus cortados» era dizer o número do ficheiro e não o número que se vê. Três frações, com as duas barras:

| abertura à vista | corda a 60 | ponta a 60 | corda a 16 | ponta a 16 |
|---|---|---|---|---|
| 32 graus (`18c`, `18e`) | 6,6 · 9,5 | 4,8 · 5,4 | 2,2 · 2,5 | 1,5 · 2,1 |
| 48 graus (`18`, `18b`) | 10,7 · 14,2 | 3,9 · 6,1 | 2,2 · 3,8 | 1,4 · 1,4 |
| 62 graus (`18d`, `18f`) | 14,2 · 18,1 | 3,8 · 3,2 | 4,2 · 5,6 | 0,1 · 1,0 |

**Fica o de 48 graus**, que é o clássico e o que já lá estava. A 32 graus a abertura dá 6,6 px de corda a 60 e o sinal lê-se como um «o» atravessado, que é a leitura de um símbolo de moeda pela outra via. A 62 graus abre demais: a ponta de baixo vem para junto do fundo do anel, a matéria na ponta cai para 0,1 px a 16 px, e a abertura medida a 16 px sobe a 74 graus, ou seja o corte alarga sozinho com o suavizado e a forma escorrega para um «c».

### 3 · A regra do favicon, corrigida, com par de controlo

A sétima voz **fechava** o corte no desenho de 32 e 16 px, de menos 56 para menos 52 graus, e engrossava a banda 16 %. Engrossar a banda já fecha a abertura por dentro, porque o raio de dentro cresce; fechar também o ângulo fecha-a duas vezes, e o que morre a 16 px é justamente o buraco que distingue um «e» de um «o». A regra passou a ser a contrária: banda 16 % e barra 14 % mais grossas, e o corte **alargado** 6 graus.

Para a comparação ser de uma coisa só, a `18k` existe: tem a geometria da `18i` e a regra velha. Mesma forma, mesma cor, mesmo tamanho.

| a 16 px | corda | matéria na ponta | corrida mínima |
|---|---|---|---|
| corte alargado 6 graus (`18i`) | **3,0 px** | **2,1 px** | 2 px |
| corte fechado 4 graus (`18k`) | 2,2 px | 1,5 px | 1 px |

É o mesmo papel que a `14b` teve na ronda das vozes: não é uma variante, é a resposta desenhada a uma pergunta.

### 4 · O «e» mínimo, que é o aditamento

O aditamento manda uma coisa só, dita de quatro maneiras: a circunferência, o corte e a barra, com **uma grossura só**, a barra a acabar no anel e não a sair dele, os remates cortados a direito, sem contorno, sem segunda cor e sem moldura. Isso mudou a construção em quatro sítios, e convém dizê-los, porque nenhum deles é cosmético:

1. **A barra passou a ter exatamente a grossura do anel.** Tinha 42 num anel de 46, ou seja 0,91 dele.
2. **As quatro pontas da barra pousam na circunferência**: os remates são cordas do círculo, e a silhueta fica sem saliência nenhuma, nem sequer a de meio ponto que a versão anterior tinha nos cantos.
3. **O corte de cima deixou de ser um ângulo escolhido.** É agora aquele onde a face de baixo da barra encontra a circunferência de fora. Antes a barra tapava a ponta da banda, o que é uma junta escondida; agora as duas peças acabam na mesma linha e não há junta.
4. **Não há segundo desenho para 32 e 16 px.** As outras direções têm um, com a banda engrossada; estas não, e é isso que «nada acrescentado» quer dizer. É também o que faz a medição a 16 px responder à pergunta do aditamento em vez de a mascarar.

**Uma correção de facto, antes das grossuras.** O aditamento pede «12 a 16 % do diâmetro» e acrescenta que «a atual é mais pesada». Medida, a banda da sétima voz tem 46 num diâmetro de 300, ou seja **15,3 % do diâmetro**: já estava dentro do intervalo pedido, no topo dele. Para o desenho ser de facto mais leve, as grossuras desenhadas vão de 16 % a **10 %**, e a de 10 % está abaixo do pedido de propósito, para que o limite se veja em vez de se supor.

| grossura | banda a 180 | banda a 60 | sinal a 60 | ponta a 60 | corda a 60 | ponta a 16 | corda a 16 | bojo a 16 |
|---|---|---|---|---|---|---|---|---|
| 16 % (`18m`) | 21 px | 7 px | 26,2 % | 5,0 | 13,2 | 1,4 | 3,8 | aberto |
| **14 % (`18n`)** | 19 px | 6 px | 23,1 % | 5,1 | 14,2 | 0,5 | 4,6 | aberto |
| 12 % (`18o`) | 16 px | 5 px | 21,4 % | 4,1 | 14,9 | 0,5 | 4,6 | aberto |
| 10 % (`18p`) | 14 px | 4 px | 17,6 % | 3,1 | 16,1 | 0,2 | 4,6 | aberto |

**Qual é a mais fina que sobrevive, e é preciso dizer como se soube.** O teste topológico não separa as quatro: nenhuma fecha o bojo a 16 px. O que as separa é a matéria, e o que a decide é olhar. Nas capturas de 16 px ampliadas vinte e duas vezes:

* a **16 %** o anel é cheio e da mesma cor em toda a volta, o contorno de dentro lê-se e a abertura também;
* a **14 %** o anel é mais fino e continua cheio em toda a volta, com a abertura à vista. É aqui que acaba a leitura sem reservas;
* a **12 %** o anel vem **manchado**: os píxeis do arco de cima e do lado esquerdo ficam a meia luz, porque 1,4 px de banda desenhada não enchem um píxel e o suavizado reparte-a por dois. Lê-se «e», mas o anel já não é uma linha, é uma sequência de manchas;
* a **10 %** só a barra fica cheia. O anel é um halo mosqueado à volta dela, e o que se lê primeiro é uma barra, não uma letra.

Os números acompanham o que se vê: a matéria na ponta do corte cai de 1,4 px a 16 % para 0,5 px a 14 % e a 12 %, e para 0,2 px a 10 %.

**A resposta é 14 %.** É a mais fina cujo anel chega cheio aos 16 px, e é visivelmente mais leve do que os 15,3 % de hoje. A de 16 % é a que sobra se a direção quiser folga; a de 12 % serve o cabeçalho e o ícone grande, e não serve o favicon.

### 5 · As cores, ao fim

| par | contraste | 3:1 | 4,5:1 |
|---|---|---|---|
| «e» âmbar em campo de tinta (o ícone) | 7,85:1 | passa | passa |
| «e» ocre em papel (o campo claro) | 6,37:1 | passa | passa |
| «e» âmbar em papel claro | 2,09:1 | falha | falha |
| «e» ocre em papel escuro | 2,62:1 | falha | falha |
| «e» âmbar em papel escuro | 8,00:1 | passa | passa |

Duas linhas falham, e são as duas que a marca não usa: em papel claro o sinal é ocre, em papel escuro é âmbar. Não é regra nova, é a que `tokens.css` já aplica à palavra do estado.

**E há um terceiro ficheiro, sem campo nenhum** (`18r`). Um ícone de telemóvel tem sempre campo, porque o sistema lhe recorta um quadrado; um cabeçalho não tem, e ali o campo seria a moldura que o aditamento manda tirar. O `maskable` desse ficheiro não quer dizer nada, e fica dito aqui em vez de se descobrir depois.

### 6 · O cabeçalho a 1:1

A prancha põe a marca horizontal ao tamanho a que o cabeçalho vive, com o aperto de letras do sítio (`.wordmark`, Spectral 400, `clamp(34px, 7.4vw, 68px)`, `letter-spacing: -0.014em`). Uma linha, um peso, sem filete e sem frase por baixo, que é o que o aditamento pede da marca.

Duas coisas mudaram no lockup, e as duas por se ter olhado a 1:1:

* **O «e» assenta na linha de base.** Estava centrado a meia altura de maiúscula com raio 0,62 dessa altura, o que o fazia descer 0,12 abaixo da base: ao lado de um nome sem descendentes, o sinal ficava pendurado.
* **O espaço entre o sinal e o nome subiu de 0,30 para 0,42** da altura de maiúscula. Com 0,30, o anel e o «O» de «O Estado» ficavam quase encostados, e duas formas redondas encostadas leem-se como uma só.

**«Uma espessura só» tem um número.** A haste do Spectral Regular mede 68,9 em 1000 de em, com a maiúscula a 660, ou seja **10,4 % da altura de maiúscula** (medido no ficheiro da casa, §8). A prancha tem a linha desenhada a essa grossura, e o que ela mostra é que um «e» com a haste do nome **desaparece dentro do nome**: deixa de se ler como sinal e passa a ler-se como uma letra da mesma palavra, e a 34 px de corpo fica frágil. Com o anel à altura de maiúscula e a grossura do ícone (14 %), o sinal lê-se ao lado da palavra e não dentro dela. **Fica a âncora B, com o «e» à altura de maiúscula do cabeçalho.**

### 7 · O que o ecrã principal respondeu

`ECRA-E.png` põe as quatro grossuras na cela de 180 px entre os mesmos oito ícones, em ecrã claro e escuro, mais o par de campo claro. O que se vê e os números não diziam:

1. **As celas de 16 % e de 14 % seguram o lugar** ao lado do Expresso e do Economist; a de 12 % é a coisa mais leve do ecrã inteiro, e lê-se, mas por pouco.
2. **O campo claro recua num ecrã claro**, que era exatamente o defeito que a ronda das vozes foi chamada a corrigir. Num ecrã escuro passa ao contrário: fica um quadrado branco, o mais claro dos nove. O ícone do telemóvel é o de campo de tinta; o de campo claro serve o cabeçalho e os sítios onde o papel já lá está.
3. **A forma mínima ganhou presença sem ganhar peso.** O anel passou de 99 px para 128 px na mesma cela de 180, porque a barra deixou de precisar de espaço fora do círculo, e isso vale mais do que qualquer engrossamento: a cela de 14 % pinta 23,1 % contra os 17,4 % da versão de hoje, com a banda mais fina.

### 8 · A recomendação

**`18n-e-minimo-14`**, ou seja: o «e» mínimo, uma grossura só a **14 % do diâmetro**, a barra com a grossura do anel e a acabar nele, o corte de **48 graus** contado da barra, âmbar `#e0a21a` em campo de tinta `#17191b` no ícone, ocre `#7a5300` em papel no campo claro (`18q`), e o mesmo desenho sem campo (`18r`) no cabeçalho, com o anel à altura de maiúscula do nome.

A razão, por ordem dos critérios da casa:

* É a mais fina cujo anel **chega cheio aos 16 px**, e portanto a mais leve que o aditamento permite sem perder o favicon.
* Segura a cela de 180 px: 23,1 %, mais do que os 17,4 % da versão de hoje, com menos banda.
* O bojo abre a todos os tamanhos, e a corda a 16 px é de 4,6 px, o dobro dos 2,2 px de hoje.
* **Não tem a construção do «€»**, porque não tem barra a sair.
* Um par de cores só, um campo só, uma grossura só, e nenhum segundo desenho.

**A segunda, se a direção quiser folga: `18m`, a de 16 %.** Mede melhor a 16 px (1,4 px de matéria na ponta contra 0,5), e o que perde é a leveza que o aditamento pediu.

**E o que esta escolha custa, dito sem rodeios.** Larga a linha da régua, e com ela a única coisa que este sinal dizia sobre o método do sítio. O que sobra é um «e» minúsculo, que diz o nome («o» e «e» na mesma forma) e não diz o que lá se faz. A `18i`, a barra só à esquerda, é a versão que ainda dizia as duas coisas, e sai por instrução e não por medição: mede 20,2 % de sinal a 60 px e 111 px de anel, entre as duas mínimas de 16 % e de 12 %. Fica no ramo para que a decisão possa ser revista sem se desenhar outra vez.

**E uma colisão que continua por conferir.** O «e» minúsculo redondo tem donos, e o mais gasto deles é o navegador da Microsoft. Não está desenhado aqui, e é a mesma escolha da ronda anterior: um desenho de memória de uma marca de outrem não é medição nenhuma, e sem rede não se confere no ficheiro deles. O que se pode dizer sem inventar continua a ser a diferença de construção: aquela marca é um «e» inclinado com um anel em órbita, em azul; este é um «e» a prumo, de grossura igual, sem órbita, com uma barra recta que não sai do anel. **Fica como pergunta em aberto, e é a primeira coisa a conferir quando houver rede.**

---

## 6 ter · O «e», explorado

*A sexta adenda (`ADENDA-6-e-explorar.md`) não pede uma variante, pede uma grelha. O diretor viu o «e» refinado e disse que não está lá, que as cores não são agradáveis, e que preto e branco talvez fossem melhores; e deixou duas pistas, ditas como pistas e não como regras: a barra podia parar antes de chegar ao círculo, a dois terços do caminho, a flutuar dentro do bojo; e o corte podia ser menor. Esta secção mede os dois eixos e a cor, e diz de cada célula o que ela ganha e o que ela perde. Tudo o que aqui tem número foi lido dos PNG de `EXPORT-E2/` com `desenhar.py medir-e2`, ou contado do desenho e dito como tal. As folhas são `FOLHA-E2.png` (a barra contra o corte), `FOLHA-E2-cores.png` (as cores) e `ECRA-E2.png` (o ecrã principal).*

**A grelha é toda de uma grossura só, 14 % do diâmetro, que é a `18n`,** e todas as células têm o corte contado da barra, como na §6 bis. É por isso que a tabela é cruzada e não uma tira: com o corte contado do ângulo do ficheiro, encurtar a barra mudava a abertura à vista, e as duas colunas de cada linha não seriam comparáveis.

### O que a régua passou a separar, e porquê

A `medir-e` conta as ilhas do **fundo**, porque a pergunta da ronda anterior era se o bojo abre. A desta é outra, e obriga a três números novos.

* **As ilhas do sinal.** Uma barra solta das duas pontas faz do sinal duas peças. Isso conta-se, não se acha, e os dois inteiros juntos dizem qual das três coisas se está a ver: `sinal 1, fundo 2` é um «e» de olho fechado; `sinal 1, fundo 1` é a mesma letra com o olho aberto; `sinal 2, fundo 1` é um anel com um traço solto lá dentro.
* **A folga da barra**, medida na linha do meio do ficheiro: os vazios entre a primeira e a última tinta dessa linha. É a distância que o olho tem de saltar para juntar o traço ao anel, em píxeis do ficheiro e não em unidades do desenho.
* **A abertura procurada no sector do corte** e não na volta toda. **E isto é uma correção que a própria grelha obrigou a fazer.** A `medir-e` procura o maior arco sem tinta sobre a circunferência do meio da banda, e isso chegava enquanto a barra ia de parede a parede, porque o único buraco sobre essa circunferência era o corte. Com uma barra que para há um segundo buraco, o entalhe da ponta livre, e à primeira a régua devolveu **2,0 px de «corda» para um anel fechado**: o que ela mediu foi o entalhe. O corte está num sítio conhecido, entre a face da barra e a ponta de baixo da banda, e é ali que se procura.

**E a corda passou a ter dois números, o medido e o desenhado.** Aos 16 px a banda tem 3 px contando o suavizado, e a medida diz o que sobrevive no ficheiro enquanto a desenhada diz o que lá foi posto. A diferença entre as duas é quanto o suavizado comeu, e nenhuma delas sozinha diz isso.

### 1 · A barra, e o que ela deixa de ser quando para

O comprimento conta-se em **vão**, que é a distância de parede a parede por dentro do anel, medida sobre o eixo da barra: `2 (r − g)`, ou 216 unidades num anel de raio 150. A barra unida não cabe nesta conta, porque as pontas dela são cordas do círculo de **fora**, e fica como o topo do eixo.

| a barra | folga desenhada | sinal a 60 | folga a 60 | folga a 16 | ilhas a 60 | ilhas a 16 | o que se vê a 60 |
|---|---|---|---|---|---|---|---|
| unida ao anel (a de hoje) | 0 | **23,4 %** | 0 px | 0 px | sinal 1, fundo 2 | sinal 1, fundo 2 | um «e» |
| livre, 3/4 do vão | 27 u (9 % do diâmetro) | 22,5 % | 3 px | 1 px | sinal 2, fundo 1 | sinal 2, fundo 3 | anel com traço solto |
| livre, 2/3 do vão | 36 u (12 %) | 22,1 % | 4 px | 1 px | sinal 2, fundo 1 | sinal 2, fundo 3 | anel com traço solto |
| livre, 1/2 do vão | 54 u (18 %) | 21,1 % | 7 px | 2 px | sinal 2, fundo 1 | sinal 2, fundo 1 | um sinal de menos num anel |
| presa à esquerda, 3/4 | 54 u (18 %) | 22,3 % | 7 px | 2 px | sinal 1, fundo 1 | sinal 1, fundo 1 | um «e» com o olho aberto |
| presa à esquerda, 2/3 | 72 u (24 %) | 21,9 % | 9 px | 2 px | sinal 1, fundo 1 | sinal 1, fundo 1 | um «e» com o olho aberto |
| presa à esquerda, 1/2 | 108 u (36 %) | 20,9 % | 15 px | 4 px | sinal 1, fundo 1 | sinal 1, fundo 1 | um «e» com a travessa curta |
| **presa à direita, 2/3** (sonda) | 72 u (24 %) | 22,0 % | 9 px | 2 px | sinal 1, fundo 1 | sinal 1, fundo 1 | um «e» de estêncil |

A corrida mínima não separa nenhuma delas: é 1 px a 180 e a 60 px em todas as oito, e 2 px a 16 em todas as oito. Quem quiser separar este eixo tem de o fazer pelas ilhas e pela folga, que é o que a tabela faz.

**O que muda quando a barra para, dito de uma vez.** O olho fechado é a assinatura topológica do «e». Enquanto a barra vai de parede a parede, o vazio de cima está fechado e o de baixo abre para o campo pelo corte: fundo em duas ilhas. Assim que uma ponta se solta, os dois vazios passam a comunicar pela folga e o fundo fica com uma ilha só. **Nenhuma das sete variantes de barra encurtada tem o olho fechado, e isso não é uma questão de grau: é um inteiro que muda.** O que fica em jogo depois disso é se a letra ainda se lê apesar do olho aberto, e aí as duas famílias separam-se.

E uma coisa que só a medição a 16 px mostra: nas duas livres mais compridas, o fundo passa de **1 ilha a 60 px para 3 ilhas a 16 px**. O suavizado cola a ponta da barra à parede nos cantos e deixa o meio da folga por encher, e o que fica são dois bolsos de luz de um píxel de cada lado. Aos 16 px essas duas leem-se melhor do que a 60, o que é o contrário do que este trabalho encontra em todo o resto.

**Uma linha por variante.**

* **Unida ao anel.** Melhor: é a única com o olho fechado, e portanto a única que é um «e» sem discussão; é também a que mais pinta a cela, 23,4 % a 60 px contra 20,9 % da mais curta. Pior: é a de hoje, e é exatamente aquilo de que o diretor disse não gostar.
* **Livre, 3/4.** Melhor: das três livres é a que menos se afasta da letra, com 3 px de folga a 60. Pior: o sinal são duas peças, e a 60 px o que se vê é um anel com um traço lá dentro; a folga de 3 px é pequena de mais para se ler como decisão e grande de mais para se ler como junta.
* **Livre, 2/3.** É a ideia do diretor à letra. Melhor: a barra fica claramente separada, o desenho é limpo e a folga é igual dos dois lados. Pior: **não é um «e»**, é um sinal de menos dentro de um anel, e num sítio de contas públicas essa leitura tem dono, porque um traço horizontal dentro de um círculo é o que se usa para «negativo» e para «proibido». Troca a colisão com o «€», que a ronda anterior resolveu, por outra do mesmo tipo.
* **Livre, 1/2.** Melhor: é a mais limpa das oito, e a que menos matéria tem. Pior: é a que mais claramente não é uma letra, e é a mais leve da grelha, 21,1 % a 60 px.
* **Presa à esquerda, 3/4.** Melhor: o sinal é uma peça só, a barra continua a ser parte da letra, e a folga de 7 px a 60 lê-se como corte deliberado. Pior: o entalhe fica do lado direito, que é o lado que o corte do anel já come, e o lado direito da letra fica interrompido duas vezes.
* **Presa à esquerda, 2/3.** O mesmo, com 9 px de folga a 60. Melhor: a dupla interrupção é a mais visível das três, e portanto a mais legível como intenção. Pior: pela mesma razão, é a que mais desequilibra a letra para a esquerda.
* **Presa à esquerda, 1/2.** Melhor: a travessa curta lê-se como estêncil e não como defeito. Pior: com 15 px de folga a 60 px, a letra começa a ler-se como «ɛ» com uma haste, e é a mais leve das presas, 20,9 %.
* **Presa à direita, 2/3 (a sonda).** Não foi pedida, e nasceu de olhar para as três de cima. Melhor: com o entalhe à esquerda, o corte e o entalhe ficam em lados opostos, o remate de baixo do anel fica intacto, e a letra lê-se como um «e» de estêncil aos três tamanhos. E o peso não é o argumento: 22,0 % a 60 px contra 21,9 % da presa à esquerda do mesmo comprimento é a mesma mancha, e o que muda entre as duas é o sítio do entalhe e mais nada. Pior: o olho continua aberto, e a folga fica no lado por onde o olho entra na letra.

### 2 · O corte, e onde é que ele deixa de existir

| abertura | corda a 180 | corda a 60 | corda a 16, desenhada | corda a 16, medida | sinal a 60 | matéria na ponta a 60 | fundo a 16 (unida) |
|---|---|---|---|---|---|---|---|
| 48 graus (o de hoje) | 43,5 px | 14,2 px | 3,94 px | **3,8 px** | 23,4 % | 5,2 px | 2 ilhas |
| 36 graus | 32,4 px | 10,3 px | 2,99 px | **2,5 px** | 24,2 % | 5,2 px | 2 ilhas |
| **28 graus** | 24,9 px | 8,6 px | 2,34 px | **2,1 px** | 24,6 % | 5,1 px | 2 ilhas |
| 20 graus | 17,2 px | 5,2 px | 1,68 px | **1,0 px** | 25,0 % | 6,0 px | 2 ilhas |
| 6 graus (fio de cabelo) | 4,0 px | 1,0 px | 0,51 px | **0,0 px** | 26,1 % | 6,1 px | **3 ilhas** |

**A que abertura é que o «e» passa a ser um «o» com uma barra aos 16 px.** A resposta tem duas partes, porque o desenho e o ficheiro não morrem ao mesmo tempo.

1. **O ficheiro fecha aos 6 graus.** A corda medida cai a 0,0 px contra 0,51 px desenhados, o fundo passa de 2 para 3 ilhas, e o vazio do bojo deixa de comunicar com o campo. Já não é um «e»: é um «θ», e olhando a captura ampliada é isso mesmo que se vê.
2. **A leitura fica em dúvida aos 20 graus**, antes de o ficheiro fechar. A corda desenhada é de 1,68 px e sobra 1,0 px: um píxel a meia luz. O fundo ainda tem 2 ilhas, ou seja tecnicamente o bojo abre, mas um píxel cinzento não é uma abertura para quem olha.
3. **A menor que ainda se lê sem reservas aos 16 px é a de 28 graus**, com 2,1 px medidos de 2,34 desenhados, ou seja dois píxeis acesos. É o menor corte que o segundo eixo permite.

E há um ganho no corte que fecha, que convém não esconder: **o sinal engorda**. De 48 para 28 graus a cela de 60 px passa de 23,4 % para 24,6 % de sinal, e a matéria na ponta do corte não piora (5,2 px contra 5,1 px). Um corte menor dá mais anel e mais peso pelo mesmo desenho, o que é o contrário do que se costuma pagar por fechar uma abertura.

**Uma linha por abertura.**

* **48 graus.** Melhor: a maior margem aos 16 px, 3,8 px de corda, e o remate de baixo fica longe do fundo do anel. Pior: é o de hoje, e a 180 px o rabo do «e» fica curto, o que faz a letra parecer um «c» com uma barra antes de parecer um «e».
* **36 graus.** Melhor: o rabo desce e a forma fecha-se sobre si; ainda sobram 2,5 px aos 16 px. Pior: nada que se meça; é a escolha conservadora deste eixo.
* **28 graus.** Melhor: é onde a letra fica mais resolvida a 180 e a 60 px, o rabo enrola e a abertura ainda acende dois píxeis aos 16; e pinta mais cela, 24,6 %. Pior: a margem aos 16 px passou a ser de dois píxeis, e qualquer engrossamento futuro do anel come um deles.
* **20 graus.** Melhor: a 180 px é a mais fechada que ainda se lê, e a mais cheia. Pior: aos 16 px sobra um píxel a meia luz, e a abertura medida cai para 13 graus, ou seja o suavizado fecha o corte sozinho.
* **6 graus.** Melhor: nada, para este uso. Pior: aos 16 px o anel fecha e o sinal passa a ser um «θ», que é a leitura que a adenda quer evitar. Fica na grelha porque um limite que se vê vale mais do que um limite que se supõe.

### 3 · A cor

Os seis pares, com o contraste contado pela fórmula da WCAG e a mancha lida na cela de 180 px da geometria de 28 graus. **A tinta da cela** é quanto dela está escuro, e é o número que diz se o ícone é uma mancha ou um vazio no ecrã principal; **o sinal** é quanto dela é diferente do campo, e é a letra.

| par | contraste | tinta da cela a 180 | sinal a 180 |
|---|---|---|---|
| tinta `#17191b` em papel `#f6f7f4` | 16,39:1 | 22,8 % | 23,1 % |
| papel `#f6f7f4` em tinta `#17191b` | 16,39:1 | **78,7 %** | 23,1 % |
| branco `#ffffff` em preto `#000000` | **21,00:1** | 78,7 % | 23,2 % |
| cobalto `#1f4e8c` em papel | 7,73:1 | 22,7 % | 23,1 % |
| cinzento `#585d5b` (`--g1`) em papel | 6,24:1 | 22,6 % | 23,1 % |
| âmbar `#e0a21a` em tinta (o de hoje) | 7,85:1 | 100 % | 23,0 % |

**Uma linha por par.**

* **Tinta em papel.** Melhor: 16,39:1, o segundo maior contraste da tabela, e a única cor da casa que não tem de ser escolhida, porque é a do texto. A cela clara põe o ícone ao lado do NYTimes e do Público, que também têm campo claro. Pior: num ecrã escuro é a coisa mais clara do ecrã, um quadrado branco entre nove; e 22,8 % de tinta faz dela uma das celas mais leves.
* **Papel em tinta.** Melhor: o mesmo 16,39:1 com a cela cheia, 78,7 % de tinta, e é o par que melhor se lê aos 16 px de toda a folha. O sinal medido é o mesmo dos outros pares claros, 23,1 %, e o que muda é o que se vê: a banda branca sobre escuro parece mais grossa do que a preta sobre claro, com os mesmos píxeis. Pior: num ecrã escuro a moldura da cela desaparece contra o fundo e o sinal fica a flutuar sem quadrado; é uma leitura, não um defeito, mas é uma decisão que a direção tem de tomar de olhos abertos.
* **Branco puro em preto puro.** Melhor: 21,00:1, o máximo possível, e a cela mais escura de todo o ecrã. Pior: o preto puro não existe em `tokens.css` e o sítio inteiro está construído sobre `#17191b`; a diferença medida na cela é nenhuma no sinal (23,2 % contra 23,1 %) e toda no campo, e ao pé do papel do NYTimes o preto puro lê-se mais duro do que a tinta da casa.
* **Cobalto em papel.** Melhor: 7,73:1, passa os dois limiares, e é a única cor viva da tabela que não é quente; é a cor que o sítio já usa para «dentro do limiar». Pior: **o ecrã principal já tem quatro ícones azuis em oito** (Expresso, Observador, Our World in Data e Pordata), e um quinto azul entre nove é a definição de não se distinguir; e aos 16 px a diferença para o par de 16,39:1 vê-se, porque a letra amolece.
* **Cinzento `--g1` em papel.** Melhor: 6,24:1, passa os dois limiares, e é o par mais calado dos seis, o que responde ao «as cores não são agradáveis» de forma literal. Pior: aos 16 px é o mais fraco da folha; e o cinzento no sítio quer dizer «texto secundário», ou seja um ícone cinzento diz que a coisa é secundária.
* **Âmbar em tinta, o de hoje.** Melhor: 7,85:1 e a cela cheia, 100 % de tinta. Pior, e é a pergunta que a adenda faz: **o âmbar `#e0a21a` sobre tinta lê-se como ouro velho sobre preto**, latão, mostarda. É o par de um aviso e o par de uma aplicação financeira de gama alta, e é isso que ele diz antes de dizer o nome do sítio. Aos 16 px escurece para um borrão castanho esverdeado: a luminância simples que a régua usa para contar tinta dá-lhe 165 em 255, e é pouco recorte contra um campo escuro. E no ecrã principal fica na mesma fila do laranja do Poder360. **Isto é o que se vê; não é uma explicação do que o diretor sentiu, é a descrição do que está na imagem.**

**E há uma coisa que a folha das cores mostra e que nenhum dos números diz:** a geometria não muda nada nesta tabela. O sinal fica em 23,0 a 23,2 % em todos os seis pares, porque é o mesmo desenho. Quem escolher a cor está a escolher só a cor, e pode fazê-lo depois de escolher a forma.

### 4 · O que o ecrã principal respondeu

`ECRA-E2.png` põe quatro variantes na cela de 180 px entre os mesmos oito ícones, em ecrã claro e escuro. Três são a mesma geometria (unida, corte de 28) em três pares, e a quarta é a sonda da direita no par que melhor mede.

1. **A cela de tinta é a que segura o lugar no ecrã claro.** 78,7 % de tinta contra 22,8 % da cela clara. E a cela clara fica encostada ao NYTimes, que também tem campo claro e também tem uma letra escura lá dentro: na mesma fila, o que separa as duas passa a ser só o desenho.
2. **No ecrã escuro trocam.** A cela clara passa a ser a coisa mais clara do ecrã, e a de tinta perde a borda contra o fundo `#101214`: o «e» branco fica a flutuar sem quadrado. Nenhuma das duas é neutra nos dois temas, e o par de cor não pode ser escolhido sem escolher também qual dos dois casos importa mais.
3. **O cobalto lê-se, e é o quinto azul.** A cela é limpa e a letra é nítida a 180 px, mas na fila de cima já estão o Expresso e o Observador, e na de baixo o Our World in Data e o Pordata.
4. **A sonda da direita aguenta a cela.** A 180 px o entalhe da barra lê-se como corte de estêncil e não como erro, e a letra continua a ser um «e». É a prova de que a ideia do diretor cabe num ícone, desde que a barra fique presa a uma ponta e essa ponta seja a direita.

### 5 · A recomendação, e são duas

**Primeira, e é a que este trabalho recomenda: `e2-unida-28`, em papel sobre tinta.** A barra como está, de parede a parede, e o corte fechado de 48 para 28 graus.

* É a única geometria da grelha com **o olho fechado aos três tamanhos** (sinal 1 ilha, fundo 2), ou seja a única que é um «e» sem depender de o leitor completar a forma.
* 28 graus é **a menor abertura que o segundo eixo permite**: 2,1 px de corda medidos aos 16 px, dois píxeis acesos, contra 1,0 px aos 20 graus e 0,0 px aos 6.
* Fechar o corte **dá peso em vez de o tirar**: 24,6 % de sinal a 60 px contra 23,4 % aos 48 graus, com a matéria na ponta na mesma (5,1 px contra 5,2 px).
* Responde à segunda pista do diretor até ao limite que a medição permite, e não sacrifica nada de medido para lá chegar.
* O par de cor é preto e branco, que é o que ele pediu: 16,39:1, a cela cheia a 78,7 %, e a melhor leitura aos 16 px da folha inteira. Para o caso de campo claro, o mesmo desenho em tinta sobre papel, com o mesmo contraste.

**Segunda, se a direção quiser a barra a parar: `e2-dir66-28`, no mesmo par.** A barra a dois terços do vão, presa ao anel **à direita** e livre à esquerda.

* É a versão da primeira pista do diretor **que continua a ser um «e»**: o sinal é uma peça só (1 ilha), a barra continua a ser parte da letra, e o entalhe de 9 px a 60 px lê-se como corte de estêncil.
* Presa à direita e não à esquerda, porque o corte do anel também está à direita: presa à esquerda, o entalhe e o corte comem o mesmo lado da letra e o lado direito fica interrompido duas vezes. Isto vê-se na `FOLHA-E2.png`, ao comparar as três linhas de «presa à esquerda» com a de baixo.
* Custa 1,5 pontos de sinal a 60 px (23,1 % contra 24,6 %) e o olho fechado, que é o inteiro que a primeira tem e esta não.

**E o que fica dito sobre a pista tal como o diretor a formulou.** A barra a flutuar dentro do bojo, solta das duas pontas, a dois terços do vão, **não dá um «e»**: dá um traço horizontal dentro de um anel, que é o sinal de menos e o de proibido. Está desenhada, medida e na folha (`e2-livre66-48` e a linha inteira), e sai por leitura e não por gosto: sinal em 2 ilhas a 180 e a 60 px, e a 60 px o que se vê não tem travessa, tem um traço. A parte da pista que sobrevive é a de a barra parar, e o que a salva é prendê-la a uma ponta.

### 6 · O que esta ronda não fez

* **Não mexeu na grossura.** Tudo o que aqui está tem 14 % do diâmetro, que é a recomendação da §6 bis, para que a grelha meça uma coisa de cada vez. Um corte de 28 graus com uma banda de 16 % fecha mais depressa aos 16 px do que este, e isso não está medido.
* **Não desenhou a barra fora do meio.** Continua por fazer desde a §6 bis, e a sonda da direita torna a pergunta mais interessante, não menos: uma travessa acima do meio com o entalhe à esquerda é a construção de vários «e» de tipo.
* **Não desenhou o corte não radial.** As faces do corte continuam a apontar ao centro. Um corte horizontal muda a leitura da abertura e não está na grelha.
* **Não pôs a exploração no cabeçalho nem na prancha.** Estas cinquenta e cinco células vivem em `direcoes-e2/` e em `EXPORT-E2/`, e não entram em `direcoes/`, na `PRANCHA.html` nem na ordem da §7. Se a direção escolher uma, ela passa a direção e ganha lá um lugar; até lá é uma célula de grelha.
* **Não mediu com fotografia por baixo**, como nas rondas anteriores. O ecrã continua a ter fundo liso.
* **A colisão com o navegador da Microsoft continua por conferir**, e continua a ser a primeira coisa a fazer quando houver rede. O corte de 28 graus fecha mais o anel do que o de 48, o que aproxima a silhueta de um «o», e isso pode aproximar ou afastar; sem o ficheiro deles não se diz qual.
* **O par de cor não foi visto na marca horizontal.** A §6 bis mediu o cabeçalho com o âmbar e o ocre; se a direção ficar com preto e branco, o cabeçalho tem de ser refeito, e a âncora B (o «e» à altura de maiúscula) não muda mas o par muda.

---

## 6 quater · A palavra «estado», em minúsculas

*A sétima adenda (`ADENDA-7-estado-minusculo.md`, 29.08.2026) pergunta uma coisa de nome e uma de desenho ao mesmo tempo: se o título do sítio passar a ser a palavra «estado» em minúsculas, com uma linha de descritor por baixo, com que letras é que ela se escreve. No mesmo dia chegaram duas correções, e as duas estão em `ADENDA-7b.md`, porque as duas mudam o que havia a desenhar. Tudo o que aqui leva número foi lido dos PNG de `EXPORT-ESTADO/` com `estado.py medir`, ou medido no navegador por `render-estado.mjs` sobre a folha de estilos do sítio, e não estimado. As folhas são `FOLHA-ESTADO-1.png`, `-2` e `-3`, uma por construção; `FOLHA-ESTADO.png`, os três cabeçalhos lado a lado; e `ECRA-SEPARADORES.png`, a barra do navegador.*

### As palavras do diretor, e as datas

Três, e ficam escritas porque cada uma tirou um caminho de cima da mesa.

**29.08.2026, de manhã** (a 7b, ponto 1), depois de ver o cabeçalho no ar com o «e» ao lado do nome: «having that e behind the name is just not right; better not having it; and don't use it for the phone icon.» O que isto fecha é a resposta mais barata à sétima adenda, que era compor a palavra e pôr o sinal de hoje ao lado dela. **Nenhuma das três construções tem o «e» ao lado da palavra**, e a terceira, que era «Spectral com o sinal como inicial», passou a ser «Spectral sozinho».

**29.08.2026, de manhã** (a 7b, ponto 2): as candidaturas a ícone passam a ser **a letra da construção**, e não o `e2-unida-28` que está no ar. O ficheiro que o sítio serve hoje deixa de ser candidato nesta ronda.

**29.08.2026, 07:25** (a continuação da 7b), com a captura da barra de separadores dele, onde o nosso favicon está entre a Guardian, o Público, o New York Times, a Anthropic e a Google: «our icon letter is a lot weaker when compared.» Daí saíram três exigências com número: campo cheio em todas as candidaturas, uma alternativa de cor dos tokens da casa, e **a grossura da letra a pelo menos 22 % do diâmetro do círculo da altura de x**, contra os 14 % que a §6 bis recomendou para o sinal do cabeçalho.

### A régua comum, e porque é que ela é 760

As três construções partilham uma régua, e ela não é escolhida: é medida no cabeçalho que já existe.

| | milésimos de em |
|---|---|
| ascendente | 750 (o topo da tinta do «d» do Spectral Regular, contado no contorno do ficheiro da casa) |
| saliência das redondas | 10 (o quanto o «o» passa da linha de base) |
| caixa de tinta | 760, ou seja 0,76 em |

«O Estado do País» leva um «d» e um «o», e por isso a marca de hoje mede 0,76 em de alto: a 34 px de corpo dá 25,8 px, que são os 26 px que a §5 mediu. **A palavra «estado» leva o mesmo «d» e o mesmo «o».** Se as letras desenhadas respeitarem esta caixa, a caixa de tinta do cabeçalho não muda com o nome, e é isso que permite responder à pergunta do diretor sem mexer no cabeçalho. É por aqui que as duas construções desenhadas começam, e não por uma altura de x escolhida.

### O que muda no cabeçalho, medido antes e depois

O `.masthead` foi rendido com `src/styles/tokens.css` e `src/styles/site.css` tal como estão, na marcação de `Masthead.astro` (`.wrap`, `.masthead`, `.wordmark`, `.masthead-identidade`), com a janela às quatro larguras da adenda. Nenhuma medida da folha foi reescrita: o `clamp()` resolveu-se sozinho.

| janela | corpo do `.wordmark` | altura do `.masthead`, hoje | com «estado», nas três |
|---|---|---|---|
| 320 px | 34 px | 85,36 px | **85,36 px** |
| 390 px | 34 px | 85,36 px | **85,36 px** |
| 768 px | 56,83 px | 156,05 px | **156,05 px** |
| 1280 px | 68 px | 198,72 px | **198,72 px** |

**A altura do cabeçalho não muda, e não muda em nenhuma das três.** Isto é medido, com `getBoundingClientRect()` sobre o `.masthead`, e não deduzido. A razão de ser assim é (INFERÊNCIA, calculada e não medida): a caixa de linha do `.wordmark` é `line-height: 1.04`, e com a ascendente de 1059 e a descendente de 463 que a tabela `hhea` do Spectral declara, o traço da linha sobe 0,818 em acima da linha de base. Uma palavra desenhada com 0,75 em acima da base cabe lá dentro sem empurrar a linha, e por isso o desenho entra no cabeçalho onde o texto entrava.

O que muda é a **caixa de tinta**, e muda em largura e não em altura:

| | 320 e 390 | 768 | 1280 |
|---|---|---|---|
| hoje, «O Estado do País» com o sinal | 25 × 278 px | 44 × 465 | 52 × 556 |
| 1 · geométrica | 25 × 100 | 43 × 167 | 51 × 200 |
| 2 · humanista | 25 × 87 | 44 × 146 | 52 × 175 |
| 3 · Spectral | 25 × 91 | 43 × 152 | 52 × 183 |

Em altura são as mesmas, com um píxel de diferença a 768 e a 1280 na primeira e na terceira, que é o suavizado a arredondar 0,75 em contra 0,76 (a geométrica não tem saliência abaixo da base; o Spectral tem, e a 43 contra 44 a diferença é de leitura do píxel e não de desenho). **Em largura a marca passa a ocupar entre 31 % e 36 % do que ocupava.** A 320 px isso é o número que mais muda o cabeçalho: hoje o nome ocupa 278 px de uma coluna de 284, ou seja a linha inteira menos seis píxeis; «estado» ocupa 87 a 100.

### Construção 1 · a geométrica, do círculo da marca

| | |
|---|---|
| altura de x | 470 (0,618 da caixa de tinta) |
| grossura | 65,8, uma só, 14 % do diâmetro do círculo |
| topo do «t» | 620 |
| ascendente do «d» | 750 |
| entalhe do «e» | 103, ou 22 % da altura de x |
| ar entre letras | 0,125 da altura de x, medido na tinta e não no avanço |

**Onde ela se afasta do sinal que está no ar, e é de propósito.** A 7b diz que a candidatura a ícone tem de ser uma letra da tipografia nova e não o `e2-unida-28`. Duas coisas mudaram, e nenhuma é cosmética. A **barra não está no meio**: está a 0,54 da altura de x, e com isso o olho de cima fecha e o vão de baixo abre, que é o que um «e» faz e um símbolo simétrico não faz. E o **remate corta na horizontal**, e não no raio: a regra da casa (§4) diz «remates cortados a direito, no horizontal ou no vertical, nunca em ângulo», e o corte do sinal é radial, ou seja em ângulo. Um sinal pode dar-se a essa exceção; uma letra de um alfabeto da casa não. Com o corte horizontal, a face de baixo do remate fica paralela à face de baixo da barra, e a abertura passa a ser um entalhe de lados paralelos em vez de um sector.

**O «s», que era a pergunta.** A §4 conta doze construções falhadas na grelha das onze primeiras. Aquela grelha tinha contraste; esta não, o que tira uma variável e acrescenta outra: com grossura constante não há sítio fraco, mas também não há espinha, e é a espinha que separa um «s» de dois discos encostados. Três construções, todas desenhadas, medidas e na `FOLHA-ESTADO-1.png`, sozinhas a 60 px e dentro da palavra a 34 e a 68 px de corpo:

| | o que é | a 60 px, sozinho | o que se vê |
|---|---|---|---|
| s(a) | dois semicírculos do mesmo raio, tangentes, remates onde a tangente é horizontal | 1 ilha, mín. 3 px, med. 7, sinal 9,3 % | Lê-se «s». Os braços têm 180 graus e acabam a meio do topo e a meio do fundo, o que fecha a letra: dentro da palavra ela é a mais estreita e a mais escura das seis, e abre um buraco no ritmo. |
| **s(b)** | dois arcos de um círculo mais pequeno, desencontrados na horizontal, com um troço recto entre eles | 1 ilha, mín. 2 px, med. 7, sinal 8,8 % | **Lê-se «s», e é a única das três com diagonal.** O troço recto a 60 graus é a espinha, e é ele que faz a letra parecer um «s» e não dois arcos empilhados. Dentro da palavra é a que menos se nota, que é o que se quer de um «s». |
| s(c) | o traço do «e», com remate radial, usado duas vezes e invertido; braços de 210 graus | 1 ilha, mín. 1 px, med. 7, sinal 10,8 % | Os remates enrolam para dentro e a letra fecha-se mais do que a s(a). Ao lado do «e» da mesma construção o parentesco vê-se; dentro da palavra lê-se antes um «5» do que um «s», e as duas peças encontram-se num ponto só, o que deixa uma junta à vista no ponto de tangência. |

**Fica a s(b)**, e a razão é a que a tabela mostra: é a única em que a letra tem eixo diagonal, e é a única que não muda o peso da palavra à volta dela. As três estão no ramo para a comparação se poder refazer.

**O ritmo das seis letras.** O «a», o «d» e o «o» são o mesmo círculo de 470, e por isso a palavra tem três círculos iguais seguidos: é a assinatura de uma geométrica e não um defeito, mas é preciso dizê-lo, porque é a coisa que mais separa esta construção das outras duas. O «e» é o mesmo círculo com barra e entalhe, o que faz quatro redondas em seis letras. O «t» e o «s» são as duas únicas letras que quebram a fila, e o «s», mesmo na versão b, é 0,86 da altura de x em largura contra 1,0 dos círculos.

### Construção 2 · a humanista

| | |
|---|---|
| altura de x | 450, e a saliência 10, que são as do Spectral da casa |
| haste | 72 |
| fino | 44 |
| contraste | 1,64 (o «O» do Spectral SemiBold dá 2,62) |
| eixo | inclinado 8 graus |
| topo do «t» | 560, que é o do «t» do Spectral |
| ar entre letras | 0,130 da altura de x |

A haste é 72 e não 68,9, que é a do «d» do Spectral Regular: uma serifada tira peso das serifas e uma sem serifas tem de o ter no traço. Com o fino a 44, a grossura média é 58, ou seja **a mancha desta é mais leve do que a da geométrica** apesar de a haste ser mais grossa, e isso vê-se nos números do ícone mais abaixo.

**O «e» e o sinal são da mesma família por anatomia, e não por semelhança.** O sinal do cabeçalho é um anel de grossura constante com uma barra a atravessar e um corte em baixo à direita; este «e» é um anel **modulado** com uma barra a atravessar e um corte em baixo à direita, com o remate a afinar no último sétimo do arco para a abertura abrir. O que os separa é a modulação; o que os junta é o resto da construção. A barra acaba na elipse de fora, como no sinal: os remates dela são cordas, e a silhueta não ganha saliência nenhuma.

O «a» é de dois andares e o «s» sai da pena de bico, que é a ferramenta que a §6 criou para as sete vozes. As duas escolhas são a mesma: numa letra modulada, um «a» de um andar lê-se como itálico, e um «s» sem espinha não se lê.

**O ritmo.** É a mais próxima de uma palavra de texto das três: seis letras de larguras diferentes, com o «t» estreito e o «s» a 0,68 da altura de x. A palavra mede 175 px de tinta a 1280 contra 200 da geométrica, ou seja **é a mais compacta das três**.

### Construção 3 · o controlo, Spectral em minúsculas

Sem desenho novo: «estado» composto em Spectral Regular no `.wordmark`, com o aperto de letras que a folha já dá, e sem sinal ao lado (a 7b tirou-o). As medidas são as do ficheiro da casa: altura de x 450, ascendente do «d» 750, haste do «e» 79,4 contada no contorno a meia altura de x.

O que este controlo mostra, e é o mais útil dele: **a caixa de tinta do cabeçalho é exactamente a mesma que hoje**, porque o «d» e o «o» são os mesmos glifos que hoje já lá estão. A troca de «O Estado do País» por «estado» não é, do lado da composição, uma troca de desenho: é uma troca de cadeia.

### A linha do descritor, a 320 px

O `.masthead-identidade` é 12 px de Spectral na cor `--muted`, com 4 px de folga acima dele abaixo dos 640 px de janela e 6 px acima dessa largura. As três linhas foram rendidas nas quatro larguras, nos dois temas, com as três construções. A 320 px de janela a coluna do `.wrap` tem 284 px, porque o `--gutter` é `clamp(18px, 4vw, 44px)` e a 320 resolve-se em 18. Medido:

| linha | largura do texto a 320 px | linhas |
|---|---|---|
| «observatório de Portugal» | 133,1 px | 1 |
| «observatório do estado do país» | 164,1 px | 1 |
| «observatório do estado de Portugal» | 187,6 px | 1 |

**As três cabem numa linha a 320 px**, com 96 px de folga na mais longa. O que as separa não é o espaço, é o que dizem: a primeira é a frase de identidade que já existe (`src/i18n/strings.mjs`, sem o ponto final, porque deixa de ser frase e passa a descritor); a segunda repete a palavra do título e diz «país» sem o nomear; a terceira repete a palavra do título e nomeia Portugal. **A segunda é a única que devolve ao leitor a leitura que a minúscula quer**, porque põe «estado» outra vez, agora dentro de uma frase onde ele só pode ser a condição. Isto é observação de leitura, não medição.

Uma coisa que a medição mostra e que não é do descritor: a 1280 px o corpo da marca é 68 px e o do descritor 12, ou seja **um para 5,7**. Com o nome comprido essa distância lia-se como hierarquia; com uma palavra de seis letras, o descritor fica pequeno ao lado de um bloco de tinta curto. Não se mexeu nele, porque a regra é da folha do sítio e não desta ronda.

### O ícone, depois da tira de separadores

A continuação da 7b fechou duas perguntas por instrução, e a medição confirma as duas.

**O peso.** A grossura pedida é 22 % do diâmetro do círculo da altura de x. As três chegam lá, e uma delas sem desenho novo:

| construção | peso de ícone | grossura | como se lá chegou |
|---|---|---|---|
| 1 · geométrica | 103,4 num círculo de 470 | **22,0 %** | o mesmo desenho com outro número; a barra sobe para 0,515 e o corte fecha para 33 graus, que é o máximo que uma banda desta grossura deixa atravessar na horizontal |
| 2 · humanista | haste 106 num círculo de 470 | **22,6 %** | o mesmo desenho, com a haste a 106 e o fino a 64, o mesmo contraste |
| 3 · Spectral | haste do «e» 135,9 num círculo de 476 | **28,6 %** | `Spectral-Bold.woff2`, que a casa já serve. O SemiBold dá 112,7 em 474, ou seja 23,8 %, e também passa. |

A barra da primeira sobe para o meio no peso de ícone, e é uma troca declarada: com a banda a 22 % sobram 159,8 unidades de contraforma para repartir entre o olho e o vão, e com a barra a 0,54 o olho ficava com 61, que numa cela de 16 px são 1,5 px e o suavizado fecha. A 0,515 fica com 73, ou seja 1,75 px. **A letra perde no ícone a assimetria que tem no cabeçalho, e ganha o olho aberto onde é julgada.**

**Os 16 px, cela a cela.** É a pergunta que a 7b faz à letra («podia ser ícone a 16 px: corrida mínima, olho fechado»). «Ilhas de fundo 2» quer dizer que o olho do «e» é uma ilha separada do campo, ou seja **fechado**; «ilhas de sinal 2» quer dizer que a letra se partiu.

| cela de 16 px | tinta da cela | ilhas de sinal | ilhas de fundo | corrida mín. | corrida med. |
|---|---|---|---|---|---|
| 1 · peso do cabeçalho (14 %) | 22,7 % | 1 | 2 | 1 | 2 |
| 2 · peso do cabeçalho | 18,4 % | **2** | 2 | 1 | 2 |
| 3 · Spectral Regular | 21,9 % | **2** | 2 | 1 | 3 |
| **1 · peso de ícone (22 %)** | **30,1 %** | 1 | 2 | 1 | 3 |
| **2 · peso de ícone (22,6 %)** | **25,8 %** | 1 | 2 | **2** | 3 |
| **3 · Spectral Bold (28,6 %)** | **29,7 %** | 1 | 2 | 1 | **4** |

Duas leituras saem daqui, e nenhuma era óbvia antes de se medir. A primeira: **ao peso do cabeçalho, duas das três letras partem-se aos 16 px**, e a que não parte é a monolinear, porque não tem finos para morrer. A segunda: **ao peso de ícone as três aguentam, com o olho fechado**, o que responde à pergunta da 7b com um sim para as três. Entre elas, a humanista tem a melhor corrida mínima (2 px contra 1) e a do Spectral Bold a melhor mediana (4 px contra 3).

O campo não muda a topologia: as mesmas três leem-se igual em campo de tinta, de papel e de cobalto, com meio ponto de diferença na percentagem. **O que o campo muda é a presença**, e isso vê-se e não se conta aqui.

**A palavra como ícone: não.** Medida na mesma cela, ao peso de ícone e em campo de tinta:

| | a 512 px | a 180 px | a 60 px |
|---|---|---|---|
| 1 · geométrica | 3,9 % de sinal, 6 ilhas | 4,0 %, 6 ilhas, altura de x 20,0 px | 4,0 %, 6 ilhas |
| 2 · humanista | 4,6 %, 6 ilhas | 4,5 %, 6 ilhas, altura de x 21,7 px | 4,6 %, 7 ilhas |
| 3 · Spectral Bold | 5,2 %, 6 ilhas | 5,3 %, 6 ilhas, altura de x 20,2 px | 5,6 %, 6 ilhas |

A maqueta da quarta adenda reprovou a palavra «Estado» da J2 com **4,7 %** de mancha numa cela de 180 px. As três palavras em minúsculas estão nesse número ou abaixo dele, e as seis letras contam-se como seis ilhas separadas em todas: a palavra não é uma mancha, é seis manchas. Aos 180 px a altura de x fica entre 20 e 22 px, contra 121 a 127 px da letra sozinha na mesma cela. **A palavra tem lugar aos 512 px e no cabeçalho; a cela do telemóvel e o separador do navegador são da letra**, e isto é agora a segunda medição independente a dizer o mesmo.

**A tira de separadores, e quem se aguenta lá.** `ECRA-SEPARADORES.png` põe cada candidatura entre a Guardian, o Público e o New York Times, com dois quadrados marcadores no lugar da Anthropic e da Google (os ficheiros delas não estão em `referencias/` e não se vai à rede, que é a regra deste ramo desde a primeira sessão). A 16 px e a 2×, em moldura escura como a da captura do diretor. O que se vê:

1. **O ficheiro de hoje é o mais fraco da fila, e a queixa está confirmada a olhar.** O «e» de fio sem campo, sobre o cinzento da barra, é a única cela do separador que não tem forma própria: os vizinhos são todos um quadrado de cor com uma letra pesada dentro, e o nosso é um traço. A diferença não é de desenho, é de campo e de peso ao mesmo tempo.
2. **O peso do cabeçalho não chega, mesmo com campo.** A cela de 14 % com campo de tinta já se distingue da barra, e a letra dentro dela continua mais fina do que o «G» da Guardian e o «P» do Público. A 16 px, 22,7 % de tinta contra os 30,1 % da mesma letra ao peso de ícone.
3. **As três candidaturas ao peso de ícone aguentam a fila.** A do Spectral Bold é a que mais se parece com os vizinhos, e por uma razão que não é vantagem: são todos letras serifadas pesadas em campo de cor, e o «G» da Guardian e o «P» do Público são exactamente isso. A geométrica é a que mais se afasta da fila, porque é a única redonda e monolinear. A humanista fica no meio das duas, e é a que tem a corrida mínima maior.
4. **O campo de cobalto encosta na Guardian.** É o vizinho imediato e é um campo escuro azulado; a §6 já tinha medido o mesmo com o Expresso («o cobalto perde-se e o âmbar não»). O campo de tinta não tem esse problema nesta fila, porque nenhum dos cinco é preto. O âmbar não entrou nesta ronda, e a razão está dita: é uma das duas cores que o diretor reprovou na §6 ter, e carrega a semântica da régua do sítio, onde quer dizer «fora do limiar».

**Fica dito qual aguenta melhor**, e é a única frase de preferência desta secção que se apoia em olhar e não em contar: **a geométrica ao peso de ícone em campo de tinta**. Não porque seja mais legível do que as outras duas, que não é (a mediana dela a 16 px é 3 px contra os 4 do Spectral Bold), mas porque é a única cela daquela fila que não é uma letra serifada de imprensa dentro de um quadrado de cor, e numa fila em que três dos cinco vizinhos são exactamente isso, a diferença de família vale mais do que um píxel de mediana.

### O ecrã principal

A maqueta é a mesma máquina de `desenhar.py` (cela de 180 px, que é 60 pt a 3×, entre oito ícones de referência), com duas coisas mudadas pela 7b: a cela leva a letra da construção ao peso de ícone, e **o rótulo por baixo diz «estado»**. O rótulo é a segunda razão de esta ronda existir: a maqueta da quarta adenda mediu que «O Estado do País» não cabe numa cela de 60 pt e sai «Estado do …», e foi por isso que o `short_name` do manifesto ficou «O Estado». **«estado» cabe inteiro, com folga, e é o primeiro nome candidato de que isso se pode dizer sem cortar nada.**

Na cela, e em campo de tinta: a geométrica pinta 29,9 % de sinal, o Spectral Bold 23,6 % e a humanista 24,7 %, contra os 19,8 % da letra da J2 e os 23,4 % do sinal que está no ar. As três seguram o lugar ao lado do Expresso, do Público e do Economist. Em campo de papel as três são a cela mais clara do ecrã, que é o defeito que a ronda das vozes foi chamada a corrigir, e continua a sê-lo.

### A ordem de preferência, e é sobre a palavra e não sobre o ícone

*Os critérios são os da casa, por esta ordem: diz o nome, entra no cabeçalho sem o obrigar a mexer, lê-se às quatro larguras, dá uma letra que sobrevive a 16 px, e não está em cima de ninguém. A adenda acrescentou um: o que a construção diz do sítio antes de o leitor ler uma palavra.*

**1.º · Construção 2, a humanista.** É a que tem menos coisas a explicar. As seis letras têm larguras diferentes e por isso a palavra tem ritmo de palavra e não de fila de círculos; é a mais compacta das três (175 px de tinta a 1280 contra 200 e 183); o «e» dela é o sinal da casa com modulação, o que resolve o pedido da adenda («a marca e a palavra leem-se como uma família») sem repetir o sinal; e ao peso de ícone tem a melhor corrida mínima das três a 16 px. Contra ela pesa uma coisa medida e uma dita: é a mais leve das três na cela do telemóvel em peso de cabeçalho (18,4 % contra 21,9 e 22,7), e é a construção que exige mais desenho por fazer, porque um sem serifas humanista com seis letras não é um alfabeto.

**2.º · Construção 1, a geométrica.** É a que responde melhor à tira do diretor, e é a única das três cuja letra não se parte aos 16 px nem ao peso do cabeçalho. O «e» dela é a letra mais distinta das três em qualquer fila de ícones, porque é a única redonda monolinear. Contra ela pesam duas coisas, e as duas se vêem na palavra: quatro das seis letras são o mesmo círculo, o que dá à palavra uma fila de redondas iguais; e o «s», mesmo na melhor das três construções, é a letra que menos pertence à grelha, e continua a ser o sítio onde esta gramática se vê a forçar.

**3.º · Construção 3, o controlo.** Não é uma construção, é a medição do que se ganha e do que se perde sem desenhar nada, e essa medição é útil: a caixa de tinta do cabeçalho não muda, a palavra lê-se, e o custo é zero. Fica em terceiro por duas coisas: o «e» dela parte-se aos 16 px em peso de leitura, o que obriga a que o ícone seja outro peso do mesmo tipo (o Bold, que a casa serve); e na tira de separadores é a terceira letra serifada pesada em campo de cor de uma fila que já tem duas. **É a escolha certa se a decisão for renomear sem abrir um trabalho de tipografia; não é, se a adenda quiser letras desenhadas para o nome.**

### O que esta ronda não fez

* **Não desenhou o alfabeto, desenhou seis letras.** «estado» precisa de seis; o sítio precisa de um alfabeto se alguma destas construções passar a marca. Faltam, no mínimo, as maiúsculas, os algarismos e os acentos, e o acento é o caso que a §2 já apontou como o mais português de todos.
* **Não experimentou a palavra com o «e» destacado**, nem em cor nem em peso, o que era a maneira óbvia de ligar a palavra ao ícone sem pôr o sinal ao lado. Não se fez porque a 7b tirou o sinal de ao lado do nome e não disse o que fazer com a ligação.
* **Não mexeu no descritor.** As três linhas são as que a adenda deu, compostas na regra que a folha já tem. Não se experimentou o descritor em versaletes, nem em Bitter, nem alinhado à direita.
* **Não mediu o cabeçalho com a navegação e a mobília por cima e por baixo.** O que aqui se mede é o `.masthead`, e a página inteira tem uma barra em cima e um fio em baixo que mudam a leitura do conjunto.
* **Não experimentou a palavra em caixa alta nem em versaletes**, que são as duas maneiras de escrever «estado» sem a maiúscula inicial que faz a palavra ler-se como a instituição.
* **A colisão do «e» minúsculo redondo com o navegador da Microsoft continua por conferir**, como está desde a §6 bis, e agora vale para a construção 1 ao peso de ícone, que é um «e» redondo monolinear pesado. Sem rede não se confere no ficheiro deles.
* **A Anthropic e a Google são quadrados marcadores** na tira dos separadores, e não desenhos de memória. Fica dito na folha e aqui.
* **Não se viu nada sobre fotografia**, como em todas as rondas anteriores.

### A pegada do nome no código, contada e não mexida

*A adenda pede este parágrafo como pegada para um bloco de mudança de nome que ainda não existe. **Nada disto foi mexido nesta ronda**, e nenhum ficheiro fora de `design/marca/` foi tocado. Os números são de 29.08.2026 e contam-se com `grep` sobre o ramo.*

| onde | quanto | o que é |
|---|---|---|
| `site.config.mjs` | 1 declaração | `export const SITE_NAME = 'O Estado do País'`, na linha 21. É a fonte única, e o ficheiro diz que é. |
| `SITE_NAME`, leituras | **36 ocorrências em 13 ficheiros** | `scripts/design-bundle.mjs`, `scripts/gate-html.mjs`, `site.config.mjs`, `src/components/Masthead.astro`, `src/layouts/Base.astro`, `src/lib/cartoes.mjs`, `src/lib/conjunto.mjs`, `src/lib/dados.mjs`, `src/lib/documentos.mjs`, `src/lib/livro.mjs`, `src/views/EstudoView.astro`, `src/views/MunicipioView.astro`, `src/views/TextoView.astro` |
| o sufixo do `<title>` | **44 cadeias escritas à mão** em `src/i18n/strings.mjs` (22 na edição portuguesa, 22 na inglesa) | `metaTitle` e `metaCauda` levam «· O Estado do País» escrito por extenso, rota a rota, e não composto de `SITE_NAME` |
| o sufixo do `<title>`, composto | **5 composições** `${SITE_NAME}` | `src/lib/conjunto.mjs`, `src/lib/dados.mjs`, `src/lib/livro.mjs`, `src/views/EstudoView.astro`, `src/views/TextoView.astro` |
| `SITE_SHORT_NAME` | 1 declaração e **7 ocorrências em 3 ficheiros** | `site.config.mjs`, `scripts/gate-html.mjs`, `src/layouts/Base.astro`. É o nome que cabe por baixo do ícone, e é «O Estado». |
| os manifestos | **2 ficheiros, 4 campos** | `public/manifest.webmanifest` e `public/en/manifest.webmanifest`, cada um com `name` e `short_name`, mais uma linha de explicação no inglês. O portão (`scripts/gate-html.mjs`, linhas 5551 e 5552) confere os dois campos contra `SITE_NAME` e `SITE_SHORT_NAME`. |
| a frase de identidade | **2 cadeias** | `src/i18n/strings.mjs`, `identidade`, na linha 33 («Um observatório de Portugal.») e na 1500 («An observatory of Portugal.»). Rende num sítio só: `Masthead.astro`, e só na primeira página. |
| as linhas do inventário | **5 com o nome, 2 com a frase**, em 672 linhas de tabela | `design/especime-v3/INVENTARIO-FRASES.md`: a linha 176 é o nome sozinho, classificado `navegacao`; as 1002, 1003, 1026 e 1027 são títulos de livro-razão com o nome no fim; as 155 e 216 são a frase de identidade nas duas edições |
| o favicon | **2 ocorrências** | `public/favicon.svg`, no `aria-label` e no `<title>`. É ficheiro gerado por `design/marca/exportar.mjs app`, e não se edita à mão. |
| o resto | **13 ocorrências em 8 ficheiros** | `src/data/sobre.mjs` (2, o texto do Sobre nas duas edições), `src/data/licenca.mjs` (2, a forma da atribuição que a licença obriga), `src/data/studies.mjs` (1, o rótulo de apuramento próprio), `src/data/agenda.json` (4, dentro de citações de fonte, que são transcrições e não se traduzem), `tests/inicio/app.mjs` (1, a asserção do manifesto), `public/dados/*.csv` (1 em cada um dos três, na primeira linha, que é o cabeçalho de comentários do descarregável) |

**O que a contagem diz sobre o custo, sem propor nada.** Uma mudança de nome não é uma cadeia: é uma declaração, 44 cadeias escritas à mão nos títulos, 4 campos de manifesto conferidos pelo portão, 2 frases de identidade, 7 linhas de inventário que o portão da voz lê, uma asserção de teste e três cabeçalhos de CSV. E há duas decisões que a contagem não resolve e que são de direção: se `SITE_SHORT_NAME` continua a existir (com «estado» o nome cabe inteiro na cela, e o nome curto deixa de ter razão de ser), e se a edição inglesa passa a ter o mesmo nome (hoje o nome não se traduz, e é isso que o comentário do manifesto inglês declara).

---

## 6 quinquies · A direção K, do diretor

*A ADENDA 8 pede esta secção com o número 7. O 7 está ocupado pela ordem de preferência das onze, e renumerá-la partia uma referência que vive em `src/lib/marca.mjs` («NOTAS §8»), que é fora de `design/marca/` e este ramo não lhe toca. Fica na família do 6, que é onde as rondas anteriores foram sendo acrescentadas, e com o título que a adenda deu.*

### As palavras do diretor, e a data

**29.08.2026.** Seis ficheiros SVG e um `LEIA-ME.txt` (sete ficheiros; a primeira versão desta frase dizia sete SVG, corrigido a 29.08 pelo lugar de direção depois da leitura cruzada), em `direcoes-k/`, tal como vieram: uma marca de três linhas horizontais alinhadas à esquerda, a do meio mais curta e em cobalto («registo, valor, registo»), em peso cheio e em peso fino, o ícone do telemóvel e o favicon. E, depois, uma frase sobre a mesma marca: «lembra o E de estado». Essa frase mudou a ronda, porque transformou a leitura de letra de acidente em qualidade a medir, e trouxe um vizinho novo para a cela da colisão: a letra.

Os sete ficheiros dele não se editam. O que esta ronda desenhou está em `derivados-k/` (a regra do esquema escuro e os dois glifos de interface, que são marcadores) e em `direcoes-k/derivadas/` (as variantes K2 a K5, e o controlo monocromático da K1), e cada ficheiro diz no cabeçalho que é derivado, de onde saiu e o que mudou.

### A geometria, conferida contra o LEIA-ME

Lida dos ficheiros com `marca-k.py geometria`, atributo a atributo. **O LEIA-ME está certo em tudo, com um arredondamento a corrigir.**

| o que o LEIA-ME diz | o que os ficheiros têm | |
|---|---|---|
| linhas 340 × 72 | 340 × 72 nas duas de fora | confirma |
| intervalo 48 | 48 e 48 | confirma |
| valor 197 | 197 | confirma |
| valor a 58 % | 197 em 340 dá **57,9 %** | 58 % é arredondamento |
| fio da fina 7 | 7 nos quatro lados dos dois contornos | confirma |
| grelha 512 | margens 86 e 86 na horizontal, 100 e 100 na vertical | confirma |

**E três medidas que o LEIA-ME não dá e que decidem coisas.** A caixa de tinta da marca é **340 × 312**, ou seja mais larga do que alta (razão 1,090), e ocupa 66,4 % da largura da grelha e 60,9 % da altura. O ícone do telemóvel tem o canto a `rx 114`, que é **22,27 %** do lado, contra os 22,37 % da máscara do iOS que a casa já usa: são a mesma coisa a menos de um décimo. E o grupo do ícone leva `translate(97 97) scale(0.62)`, o que põe a marca a ocupar **41,2 % da largura** do campo e 37,8 % da altura, centrada a menos de 0,3 unidades de 512 do centro exacto. Este último número é o que decide o ecrã principal, e volta abaixo.

### 1 · A tira de separadores, e o que se viu a 16 px

`ECRA-SEPARADORES-K.png`, com a fila de sempre: Guardian, Público, New York Times, o nosso, e dois quadrados marcadores no lugar da Anthropic e da Google. A 16 px e a 2×, em separador escuro e em separador claro.

**Primeiro, um limite da régua, porque ele muda a leitura de tudo o resto.** A contagem de píxeis dá **20,3 % de sinal, 3 ilhas e corrida mínima de 2 px** para o mesmo favicon num separador escuro e num claro. São o mesmo número e não são a mesma coisa: `_mascara` separa o sinal por distância à cor do canto, e conta igual uma barra que difere do campo por uma sombra e uma que difere por tudo. Foi preciso acrescentar uma segunda medida, a **presença**, que é o contraste entre a cor do campo e a cor mais afastada dela, as duas lidas no PNG. A percentagem diz que a marca está lá; a presença diz se ela se vê.

| a 16 px, no separador | sinal | ilhas s/f | corrida mín. | presença |
|---|---|---|---|---|
| **como veio, separador escuro** | 20,3 % | 3 / 1 | 2 px | **1,45:1** |
| como veio, separador claro | 20,3 % | 3 / 1 | 2 px | 17,63:1 |
| com a regra do escuro, separador escuro | 20,3 % | 3 / 1 | 2 px | 10,34:1 |
| sobre o campo de tinta do ícone, separador escuro | 4,7 % | 2 / 1 | 1 px | 10,49:1 |
| sobre o campo de tinta do ícone, separador claro | 92,2 % | 1 / 6 | 4 px | 17,48:1 |

**O que se vê, e é a coisa mais dura desta secção: o favicon tal como veio desaparece num separador escuro.** As barras são de tinta `#17191b` e o separador ativo do Chromium escuro é `#35363a`; a relação é de **1,46:1** para a tinta e **1,45:1** para o cobalto. Ampliada doze vezes vê-se uma mancha; ao tamanho a que o navegador a desenha, a nossa cela é a única da fila sem forma. É a mesma família de queixa que o diretor fez na sétima ronda («our icon letter is a lot weaker when compared», §6 quater), e não é o mesmo defeito: o ficheiro que está no ar é fraco porque é um fio sem campo, mas TEM a regra do esquema escuro e por isso vê-se; este é forte de traço e não tem a regra, e por isso não se vê.

**Uma nota sobre o que a razão de contraste não mede.** O cobalto e a tinta medem quase o mesmo contra o separador escuro (1,45 e 1,46), e no entanto, ao ampliar, a barra do meio vê-se um bocado mais do que as de fora. A razão de contraste da WCAG é de luminância e não conta matiz; o que sobra ali é matiz. Fica dito como observação de quem olhou, não como medida: a régua da casa não tem número para isto.

**A regra do esquema escuro resolve, e é uma linha.** Com `prefers-color-scheme: dark` a trocar as barras para papel-claro `#eceeea` e o valor para cobalto-claro `#7fa6dc`, a presença passa de 1,45:1 para **10,34:1**, que é mais do dobro do limiar de 4,5 e mais do triplo dos 3:1 que `scripts/medir-contraste.mjs` exige a um objeto de interface. É a regra que `public/favicon.svg` já tem hoje e que `exportar.mjs` escreve; o ficheiro do diretor não a traz. Num separador claro a regra não faz nada, e é isso que se quer.

**O campo de tinta do ícone resolve de outra maneira, e cobra outro preço.** No separador escuro dá 10,49:1 e uma cela com forma própria. No separador claro dá uma cela que pinta **92,2 % de tinta**: um quadrado preto entre um «G» da Guardian e um «P» do Público em campo claro. Não é ilegível, é o contrário: é a cela mais pesada da fila. A escolha entre as duas saídas não é de legibilidade, é de que fila se quer estar.

**E há um número que não muda com nenhuma delas: três ilhas.** Em todas as celas do separador sem campo a marca conta **três** componentes ligadas (sobre o campo de tinta do ícone a régua conta o campo e não a marca: 2 e 1 na tabela; a primeira versão desta frase dizia «em todas as celas», corrigido a 29.08 pelo lugar de direção depois da leitura cruzada). As candidaturas que este trabalho pôs à frente contam **uma**: a H e a J2 dão uma ilha a 60 e a 16 px (§5), e as três construções ao peso de ícone dão uma ilha a 16 px (§6 quater). Isto volta na colisão, que é onde importa.

### 2 · O ecrã principal

`ECRA-K.png`, com `icone-telemovel.svg` na cela de 180 px (60 pt a 3×) entre os oito de referência, em ecrã claro e escuro.

**A cela segura o lugar, e a marca dentro dela não.** O campo de tinta faz o trabalho que a §6 ter já tinha medido: entre o Expresso, o Público, o Economist e o NYT, um quadrado quase preto lê-se de longe nos dois ecrãs. O que não se lê é a marca: as três barras pintam **9,4 % da cela**.

| na cela de 180 px, campo de tinta | sinal |
|---|---|
| a palavra «Estado» da J2, que a quarta adenda reprovou | 4,7 % |
| **a marca K, no enquadramento do ficheiro dele** | **9,4 %** |
| o «E» da J2 sozinho | 19,8 % |
| o sinal que está no ar (`e2-unida-28`) | 23,4 % |
| a construção 3, Spectral Bold ao peso de ícone | 23,6 % |
| a construção 2, humanista ao peso de ícone | 24,7 % |
| o «E» da direção H | 27,2 % |
| a construção 1, geométrica ao peso de ícone | 29,9 % |

**A causa está medida e tem conserto sem redesenhar nada: é o `scale(0.62)`.** O mesmo desenho, enquadrado como o `favicon.svg` do próprio diretor o enquadra (sem redução nenhuma), pinta **23,6 %** de uma cela de 180 px, que é o número da construção 3 e está dentro da faixa de tudo o que a casa aceitou. A área das barras não depende da cor do campo, só do enquadramento, e as duas medições batem certo com a geometria (24,1 % da grelha, e 24,1 % × 0,62² = 9,3 %). **A redução para 0,62 deita fora seis décimos da mancha da marca.** Se a direção quiser esta cela, o que falta é encher o campo, e não engrossar as barras.

### 3 · A colisão: o menu, o alinhar à esquerda, e o «E»

`FOLHA-K.png`, secção final. Cada glifo na sua cela a 16 e a 24 px, nos dois campos, ampliados doze vezes. Os dois glifos de interface são **marcadores desenhados na grelha da própria marca** (mesma margem 86, mesma altura de linha 72, mesmo intervalo 48, mesmo comprimento 340), de propósito: assim a única diferença entre a marca e o botão é a que a marca reivindica como sua. O «E» **não** é marcador: é Spectral Bold, o tipo da casa, à mesma altura de maiúscula que a marca tem de caixa (312 unidades em 512), com a haste na mesma margem esquerda e a base na mesma linha.

**As duas diferenças que separam a marca do botão de menu, medidas nas capturas:**

| | a 16 px | a 24 px |
|---|---|---|
| barra de fora, no menu e na marca | 10 px | 16 px |
| barra do meio, no menu | 10 px | 16 px |
| barra do meio, na marca K1 | **6 px** | **9 px** |
| a diferença de comprimento | 4 px | 7 px |
| a cor do valor contra a cor do registo | 2,12:1 | 2,12:1 |

**O veredicto, a olhar.** A cores, a 24 px, a marca não se lê como botão: uma barra azul, mais curta, no meio de duas pretas, é um objeto com uma linha assinalada lá dentro, e um botão de menu não tem isso. A 16 px a distinção aguenta, com menos folga: os 4 px de diferença de comprimento sobrevivem ao suavizado, e a barra azul continua azul.

**Em monocromia não aguenta.** Tirada a cor, a K1 a 16 px fica com barras de 10, 6 e 10 px e três ilhas, contra as três barras de 10 px e três ilhas do menu: o que resta é um botão de menu com a barra do meio encurtada, e o vizinho mais parecido deixa de ser o menu e passa a ser o **alinhar à esquerda**, que também é uma pilha de barras alternadas na mesma margem. Isto importa porque há sítios onde a cor não vai: impressão a uma cor, alto contraste do sistema, e um favicon que um cliente pinte de uma cor só.

**E o número que a cor não salva: 2,12:1.** O cobalto contra a tinta mede 2,12:1 em campo claro e o cobalto-claro contra o papel-claro mede 2,14:1 em campo escuro. `scripts/medir-contraste.mjs` avisa a partir de 3:1 para objetos de interface. **A cor que carrega a ideia inteira da marca (isto é um valor, aquilo é um registo) está abaixo do limiar que a casa aplica a qualquer outro objeto de interface.** Não é um aviso sobre a marca ser vista: é sobre a distinção interna dela ser vista.

**O «E», e a distância que falta.** Medido na captura de 512 px, e não citado: o braço do meio do «E» do Spectral Bold alcança **80,4 %** do maior dos outros dois, contra os 57,9 % da K1. Mas a proporção dos braços não é o que separa as duas coisas. O que separa é isto:

| a 16 px, campo claro | ilhas de sinal |
|---|---|
| o «E» do Spectral Bold | **1** |
| o botão de menu | 3 |
| o alinhar à esquerda | 4 |
| a K1, a K2, a K4 e a K5 | **3** |
| a K3, a cores | 2, porque a régua perde a barra fina |
| a K3, em monocromia | **3** |

**Uma letra é uma peça; esta marca são três.** A haste do «E» ocupa 43,2 % do alcance do braço de cima e é ela que solda os três braços num objeto só. Nenhuma das cinco tem haste. Isto não é uma opinião sobre o desenho: é a mesma medição que a §5 já tinha feito à direção H, onde a variante **sem haste** foi desenhada, vista e recusada com esta frase: «as três barras leem-se como o botão de menu de uma aplicação e a letra desaparece (três ilhas, e nenhuma delas é uma letra)». A K é essa variante, com duas coisas acrescentadas que a H não tinha: a barra do meio mais curta e o cobalto. **As duas acrescentam distinção contra o botão; nenhuma acrescenta a letra.**

### 4 · O cabeçalho

`CABECALHO-K.png`. Marcação e folha de estilos do sítio (`.wrap`, `.masthead`, `.wordmark`, `.masthead-identidade`), com o `clamp()` a resolver-se contra a janela. A marca entra pela **âncora B** (§5): à altura de maiúscula do cabeçalho, 0,660 em, com a largura tirada da proporção 340 por 312 e 0,42 dessa altura de espaço até ao nome. O 0,42 é **herdado** da §6 bis e não medido aqui: aquele número saiu de duas formas redondas quase encostadas, e esta marca é uma pilha de rectângulos.

**A altura do cabeçalho não muda, e é medido.**

| janela | corpo do `.wordmark` | `.masthead` sem marca | `.masthead` com marca |
|---|---|---|---|
| 320 px | 34 px | 85,36 px | **85,36 px** |
| 390 px | 34 px | 85,36 px | **85,36 px** |
| 768 px | 56,83 px | 156,05 px | **156,05 px** |
| 1280 px | 68 px | 198,72 px | **198,72 px** |

São os mesmos números da §6 quater, o que é uma confirmação e não uma coincidência: a caixa de linha do `.wordmark` é `line-height: 1.04` e o traço sobe 0,818 em acima da base (INFERÊNCIA, calculada da tabela `hhea` do Spectral e registada como tal na §6 quater), e uma marca de 0,660 em cabe lá dentro sem empurrar a linha. Vale para os dois nomes e para as cinco variantes, porque a caixa de tinta das cinco é a mesma.

**O que muda é a largura da caixa de tinta, e a 320 px é onde ela decide.** Contada nos PNG, que é o método da §8:

| | sem marca | com marca | coluna | folga |
|---|---|---|---|---|
| «O Estado do País» a 320 | 244 × 25 px | **280 × 25 px** | 284 px | **4 px** |
| «O Estado do País» a 390 | 244 × 25 | 280 × 25 | 354 px | 74 px |
| «O Estado do País» a 768 | 407 × 44 | 468 × 43 | 708 px | 240 px |
| «O Estado do País» a 1280 | 488 × 52 | 560 × 52 | 1092 px | 532 px |
| «estado» a 320 | 91 × 25 | 127 × 25 | 284 px | 157 px |
| «estado» a 1280 | 183 × 52 | 253 × 52 | 1092 px | 839 px |

**A marca custa 36 px de largura a 34 px de corpo, e a 320 px sobram 4 px.** Cabe, numa linha, sem partir nada, e não sobra mais nada: com o nome de hoje e esta marca, a linha do cabeçalho a 320 px está cheia. Qualquer coisa que cresça (um nome mais longo, um espaço maior entre a marca e o nome, uma marca menos larga do que alta) obriga a decidir outra vez. Com «estado» o problema não existe.

**E uma coisa que só se vê a 1:1.** Ao lado de «O Estado do País», a marca com a barra do meio em cobalto lê-se como um sinal separado, e não como uma inicial do nome. Não é o defeito que a §5 apontou à H («um objeto colado à palavra»), porque as três barras não se parecem com nenhuma letra do nome; é o contrário: fica ao lado do nome sem conversar com ele. É a leitura honesta do que ali está, e é uma decisão de direção se se quer isso ou uma inicial.

### 5 · A marca fina, e onde é que ela deixa de servir

O LEIA-ME diz «nunca abaixo de 60 px» e dá «fio da fina 7» numa grelha de 512. **Não diz de que 60 px fala**, e as duas leituras possíveis dão números diferentes, por isso deram-se as duas, rendidas e contadas.

| | fio na GRELHA (7/512 × n) | fio na CAIXA (7/340 × n) | o que a captura da grelha mostra |
|---|---|---|---|
| 512 px | 7,00 px | 10,56 px | cheio |
| 120 px | 1,64 px | 2,47 px | 3 ilhas, corrida 1/2, tinta cheia `#17191b` |
| **60 px** | **0,82 px** | **1,24 px** | 3 ilhas, corrida 1/1, e a tinta mais escura da imagem é `#2d3031`, **cinzento e não tinta** |
| 32 px | 0,44 px | 0,66 px | 3 ilhas, corrida 1/1, e o mais escuro passa a ser o cobalto |
| 16 px | 0,22 px | 0,33 px | **1 ilha**: os dois contornos desaparecem e sobra o valor cheio |

**A prova do LEIA-ME confirma-se, e é generosa consigo própria.** Aos 60 px da grelha o fio já não chega a tinta: mede 0,82 px e o navegador desenha-o em cinzento médio. A regra devia ser mais dura do que a que ele escreveu, ou então ele fala da caixa de tinta, e aí a 60 px o fio dá 1,24 px, que é uma linha fina mas cheia. **Fica dito qual é a leitura que a medição sustenta: a da caixa.** À grelha, o limite honesto anda nos 120 px, onde o fio dá 1,64 px e chega a tinta cheia.

**E aos 16 px a marca fina inverte-se.** Os dois contornos somem-se e o que fica na imagem é a barra do valor, que é a única cheia: um traço de cobalto sozinho. Não é ilegibilidade, é outra marca. É o mesmo tipo de acidente que a §6 ter apanhou na exploração do «e» («um traço horizontal dentro de um anel, ou seja o sinal de menos»), e apanha-se pela mesma via, que é olhar.

### 6 · As cinco, uma linha cada

As quatro variantes saem da geometria dele, cada uma com **uma** coisa mudada. A razão do valor é o comprimento da barra do meio sobre o das de fora.

**K1, o ficheiro do diretor. Razão 57,9 % (197 de 340), à esquerda, altura 72.** No «E»: é a razão mais baixa das cinco e a mais longe dos 80,4 % do braço do meio do Spectral Bold, e por isso é a que menos se lê como letra; sem haste, não se lê como letra de todo. Na colisão: 4 px de diferença de comprimento a 16 px e 7 px a 24, mais a cor, que a 2,12:1 fica abaixo do limiar da casa.

**K2, o valor encostado à direita. Razão 57,9 %, x 229.** No «E»: **desiste da letra por construção**, e é o que a torna útil. Um «E» tem os três braços na mesma haste esquerda; com o do meio encostado à direita não há leitura de «E» nenhuma para discutir. Na colisão: é a que mais se afasta do botão de menu, porque nenhum glifo de menu tem uma barra a flutuar à direita; em contrapartida encosta no glifo de **alinhar à direita**, que existe na mesma barra de ferramentas onde o de alinhar à esquerda existe, e a leitura de livro-razão (a coluna do valor alinha à direita) é verdadeira mas é uma convenção de tabela, não de marca.

**K3, o valor mais fino. Razão 57,9 % em comprimento, 55,6 % em altura (40 de 72).** No «E»: piora, porque um braço de «E» mais fino do que os outros não existe em tipo nenhum desta família; lê-se um sublinhado entre duas barras. Na colisão: é a única das cinco em que a régua **perde a barra do meio** a 16 px em campo claro (2 ilhas em vez de 3, sinal 15,6 %, contra as 3 ilhas de todas as outras), e ao olhar confirma-se: o cobalto fino sobre papel a 1,25 px de altura fica um véu. Em monocromia distingue-se do menu por peso, que era o que se pretendia; a 16 px o peso é que não sobrevive.

**K4, o valor mais pesado. Razão 57,9 % em comprimento, 138,9 % em altura (100 de 72).** No «E»: piora por outro lado; um braço do meio mais grosso do que a haste que não existe lê-se como um erro de composição, não como letra. Na colisão: é a que mais se afasta do menu **em monocromia**, que era o objetivo, e paga-o na geometria: os intervalos caem de 48 para 34 unidades, o que a 16 px dá **1 px de folga** medido (contra 2 px nas outras), e ao olhar as três barras começam a soldar-se. É a variante que ganha à distância e perde ao tamanho onde a pergunta se põe.

**K5, o valor a 70 %. Razão 70,0 % (238 de 340), à esquerda, altura 72.** No «E»: é a que chega mais perto, e a distância que fica é medível: 70,0 % contra os 80,4 % do Spectral Bold, ou seja dez pontos. Na colisão: perde-se distância contra o menu (a diferença de comprimento cai de 4 px para 3 px a 16, e de 7 px para 5 px a 24), o que é o mesmo movimento visto do outro lado. **É a variante que mostra que as duas qualidades são a mesma escala vista dos dois topos: quanto mais a marca se aproxima da letra, mais se aproxima do botão.**

### 7 · A comparação com as direções anteriores, pelas mesmas medidas

**Nas colunas da §5**, que são as das onze direções, com a K1 rendida no enquadramento do ficheiro dele (66,4 % da grelha em largura) contra os 70,3 % das onze, o que é uma diferença de quatro pontos e fica dita:

| | 60 px: ilhas | 60 px: corrida mín. | 60 px: mediana | 16 px: ilhas | 60 px: tinta |
|---|---|---|---|---|---|
| F, a régua (a melhor corrida das onze) | 1 | 8 px | 8 px | 1 | 15,6 % |
| H, o «E» do livro-razão | 1 | 5 px | 10 px | 1 | 27,2 % |
| J2, «Estado» com a linha do valor | 1 | 6 px | 10 px | 1 | 19,8 % |
| **K1, a marca do diretor** | **3** | **8 px** | **8 px** | **3** | **22,9 %** |

**Nas colunas da §6 quater**, que são as das candidaturas a ícone a 16 px, todas com campo cheio:

| a 16 px, campo cheio | sinal | ilhas de sinal | corrida mín. | corrida med. |
|---|---|---|---|---|
| construção 1, geométrica, peso de ícone | 30,1 % | 1 | 1 px | 3 px |
| construção 2, humanista, peso de ícone | 25,8 % | 1 | 2 px | 3 px |
| construção 3, Spectral Bold | 29,7 % | 1 | 1 px | 4 px |
| **K1, o favicon do diretor** | **20,3 %** | **3** | **2 px** | **2 px** |

E na cela do telemóvel, que é a medida que reprovou a palavra da J2, a tabela está na §2 acima: 9,4 % no enquadramento do ficheiro, contra 19,8 % a 29,9 % de tudo o que a casa aceitou, e 4,7 % da palavra que reprovou.

**Duas leituras, e as duas são novas.** A primeira: **em robustez a K1 empata com a melhor das onze.** A 60 px dá corrida mínima de 8 px, que é o número da régua (a direção F), o melhor da tabela das onze; a 16 px dá 2 px, que empata com a humanista e bate a geométrica e o Spectral Bold. Não é surpresa: uma barra horizontal de 2,25 px de altura é a forma mais robusta que se pode pôr numa cela de 16 px. Nada nesta marca é frágil. A segunda: **é a única destas com três ilhas**, aos dois tamanhos, e é a primeira candidatura desde a palavra reprovada da J2 que não é uma peça só. (Entre as onze há outras com mais de uma ilha, a C, a D, a E e a G, e nenhuma delas subiu na ordem da §7 por causa disso.) As duas coisas convivem, e é preciso dizê-lo assim: cada peça é robusta, e não é uma peça.

### 8 · A ordem entre as cinco, e a razão

*Os critérios são os da casa, por esta ordem: diz o nome, entra no cabeçalho sem o obrigar a mexer, lê-se às quatro larguras, sobrevive a 16 px, e não está em cima de ninguém. Ao último foi acrescentado, por instrução, um segundo sentido: e a que distância fica da letra.*

**1.º · K5, o valor a 70 %.** Fica em primeiro porque é a única cuja mudança melhora a leitura que o diretor diz querer sem estragar nenhuma medida: a razão sobe de 57,9 % para 70,0 % e aproxima-se dos 80,4 % do «E» do tipo, os intervalos ficam nos 48, a folga a 16 px fica nos 2 px, e a corrida mínima não muda. O que ela custa está medido e é pequeno: um píxel de diferença de comprimento contra o botão de menu a 16 px.

**2.º · K1, a marca do diretor.** É a que tem a maior distância medida contra o botão de menu (4 px a 16, 7 px a 24) e a razão mais baixa, e as duas coisas são a mesma. Fica em segundo e não em primeiro por uma razão de propósito e não de desenho: se a leitura de «E» é uma qualidade, a K1 é a que menos a tem das quatro que a podem ter (as quatro alinhadas à esquerda).

**3.º · K2, o valor à direita.** É a mais distinta de todas contra os glifos de menu, e é a única que não tem de defender a leitura de letra porque não a reivindica. Desce ao terceiro por duas coisas: encosta no glifo de alinhar à direita em vez do de alinhar à esquerda, o que troca um vizinho por outro, e é a única que perde uma qualidade que o diretor nomeou.

**4.º · K4, o valor pesado.** Ganha em monocromia, que é uma prova real, e perde onde a pergunta se põe: a 16 px a folga entre barras cai para 1 px medido e as três começam a soldar-se. Uma variante que se degrada precisamente ao tamanho do separador não pode subir.

**5.º · K3, o valor fino.** É a única em que uma barra da marca **desaparece à medição e ao olhar** a 16 px. A ideia (distinguir por peso e não só por comprimento) é boa e a execução a 40 unidades não sobrevive ao tamanho onde é julgada. Se a direção quiser esta ideia, o número a experimentar é entre 40 e 72, e não está desenhado.

### 9 · A opinião, e a razão

**A direção K resolve o problema que o diretor levantou na sétima ronda, e resolve-o pelo campo e não pelo desenho.** A queixa era «our icon letter is a lot weaker when compared», e uma barra horizontal de 2,25 px é, medida, a forma mais robusta que qualquer ronda deste trabalho pôs numa cela de 16 px: corrida mínima 2 px, melhor do que a geométrica e do que o Spectral Bold. Nada nesta marca se parte.

**E não é uma letra, e isso está medido três vezes.** Três ilhas onde o «E» do tipo tem uma. A haste, que é 43,2 % do alcance do «E» e é o que solda os braços, não existe. E a variante sem haste da direção H foi desenhada, vista e recusada na §5 com a frase exacta que descreve esta forma. Chamar-lhe «o E de estado» é uma leitura que o autor faz do próprio desenho, e é uma leitura que a régua não confirma: sem cor, a 16 px e a 24 px, o vizinho mais próximo da K1 não é o «E», é o botão de menu com a barra do meio encurtada.

**A minha recomendação é em três partes, e a primeira é a única urgente.** Primeira: **o `favicon.svg` como veio não pode ir ao ar.** A 1,45:1 num separador escuro não é uma marca fraca, é uma marca ausente, e o conserto é a regra `prefers-color-scheme` que a casa já escreve, uma linha em `exportar.mjs`. Segunda: **se esta cela for para o telemóvel, o `scale(0.62)` sobe.** O mesmo desenho enquadrado como o próprio favicon dele o enquadra passa de 9,4 % para 23,6 % de mancha na cela de 180, o que é a diferença entre a palavra reprovada e as construções aprovadas, e não custa um traço novo. Terceira: **se a leitura de «E» for para ser defendida, o número é o da K5 e não o da K1**, e mesmo lá continua a faltar a haste, que é o que a §5 já tinha medido em 28 de agosto.

**E fica uma pergunta que não é minha para responder.** Esta marca vale como marca de casa (é robusta, é da paleta certa, entra no cabeçalho sem mexer nele, e a 24 px a cores não se confunde com um botão) e não vale como letra. Se o sítio quiser um sinal que não seja letra nenhuma, esta serve e as onze primeiras direções passam a ter concorrência a sério. Se quiser a inicial do nome, esta não é, e nenhuma das quatro variantes a torna. **A decisão é entre um sinal e uma inicial, e é de direção.**

### 10 · O que esta ronda não fez

* **Não desenhou a marca com haste.** É a mudança óbvia que faria a K ler-se como «E», e é exactamente a direção H, que já existe em `direcoes/8-e-livro-razao.svg` e já está medida. Não se redesenhou porque duplicava uma direção que a §5 já ordenou.
* **Não experimentou o valor entre 40 e 72 de altura**, que é o intervalo que a K3 abre e não fecha. Nem o valor entre 197 e 238 de comprimento, entre a K1 e a K5.
* **Não experimentou outra cor no valor.** O cobalto contra a tinta mede 2,12:1, abaixo dos 3:1 da casa, e a pergunta «que cor dos tokens é que passa os 3:1 contra a tinta» não está respondida. Pela §6 ter o âmbar e o ocre estão reprovados pelo diretor, o que deixa o problema em aberto e não resolvido.
* **Não viu a marca sobre fotografia**, como já acontecia às onze, às sete e ao «e».
* **A colisão com barras de aplicação a sério não foi conferida.** Os dois glifos são marcadores desenhados por esta ronda, na grelha da própria marca, que é a comparação mais severa possível e não é a real: um botão de menu de um sistema tem outra grelha, outras proporções e outro peso. Sem rede não se confere no ficheiro de ninguém.
* **O cinzento do separador claro é escolhido e não conferido.** O escuro veio da captura do diretor; do claro não há captura. O que a medição usa é o contraste contra o campo, e essa relação não muda com dois pontos de cinzento, mas o número exacto do Chromium não está aqui.
* **O 0,42 de espaço entre a marca e o nome é herdado da §6 bis e não foi medido nesta forma.** Saiu de duas formas redondas quase encostadas; esta é uma pilha de rectângulos, e o problema de espaço é outro.
* **As quatro variantes não têm ficheiro de cores escuras.** Trazem as cores claras do diretor, e por isso a prova de cor delas é em campo claro. A regra do escuro troca cores e não mexe na silhueta, que é o que elas mudam, mas isso é dedução e não medição.

---


## 7 · A ordem de preferência, refeita para as onze

*Esta é a ordem das ONZE primeiras direções, e ficou como estava. A ordem das sete vozes é outra lista e está no fim da §6, porque a adenda das vozes a pediu «só sobre estas», e porque comparar um campo de papel com um campo de cor a partir de números medidos em réguas diferentes daria uma ordem que não queria dizer nada. Quem quiser uma ordem só sobre as dezanove tem de decidir primeiro se o campo entra no critério, e essa é uma decisão de direção.*

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

## 8 · O que se mediu, e como

* **A legibilidade** foi medida nas capturas de `EXPORT/`, e não estimada dos SVG: cada PNG foi lido píxel a píxel, contadas as componentes ligadas de tinta (vizinhança de 4, tinta é cinzento abaixo de 200) e as corridas de tinta em linha e em coluna. A tabela da §5 é essa leitura, refeita a 28.08 para as onze com o mesmo programa. O que está escrito em prosa («lê-se», «é poeira», «lê-se F e não E») é o que se viu ao abrir as capturas, ampliadas quatro e oito vezes, e não o que os números sugeriam.
* **O «O» do Spectral** foi medido no ficheiro da casa, desenhado a 700 de altura e contado a píxeis, não tirado de uma tabela.
* **O círculo seguro do `maskable`** está agora conferido **no PNG**, e não só por construção, e foi essa medição que apanhou um erro que estava lá desde o princípio. `transform` de CSS e `transform` de atributo são a mesma propriedade, e o CSS ganha: enquanto a regra do `maskable` apanhava `.sinal` directamente, o `scale(0,78)` **substituía** o enquadramento de `enquadra()` em vez de se compor com ele. As direções enquadradas saíam erradas e ninguém tinha medido: a G dava 233 px de lado em 512 em vez de 281, e a I saía cortada em cima. A redução passou a um grupo de fora, que não tem atributo nenhum. Medido nos dez PNG de 512: **282 px de lado (a J, 274, porque a palavra tem folga à direita), centro em 255,5 e meia-diagonal entre 141 e 199, todas abaixo dos 204,8** do raio de 40 %. As direções C, D, F e E nunca estiveram erradas, porque nunca tiveram transformação de atributo.
* **Os contrastes** não foram medidos aqui: são os que `src/styles/tokens.css` já traz medidos por `scripts/medir-contraste.mjs`, e estão citados com o número que lá está.
* **As colisões** foram vistas na folha das 42 referências, à mesma escala, e a tira «A vizinhança a 60 px» da prancha põe as onze direções na mesma linha que dezasseis delas. É lá que se vê o «E» da J ao lado do «E» do Expresso e do «E» do Economist, e é lá que se vê o que a linha do valor da J2 lhe acrescenta.
* **A maqueta do ecrã principal** é composta em `desenhar.py ecras`, e o que nela é medido é a geometria: cela de 180 px (60 pt a 3×), largura de 1170 px (390 pt a 3×), arredondamento de 22,37 %. O que **não** é medido, e fica dito como inferência, é o rótulo: 33 px são 11 pt a 3×, e esse valor não foi conferido contra a documentação da Apple, que não se pode consultar sem rede; o tipo do rótulo é o Helvetica do sistema e não o do telemóvel. O fundo liso e cinzento médio é escolha, e a razão está na §5: um fundo claro de mais fabricava o problema em vez de o medir. Dois dos oito ícones de referência (Pordata, 48 px; Poder360, 57 px) foram ampliados para 180 e por isso saem moles, o que num telemóvel a sério não aconteceria.
* **O cabeçalho** foi medido em `src/styles/site.css` (`.wordmark`: `clamp(34px, 7.4vw, 68px)`, e a compacta `clamp(24px, 3.4vw, 34px)`) e a altura de maiúscula do Spectral na tabela `OS/2` do ficheiro (660 em 1000). As três linhas da prancha estão a 1:1: a altura de cada SVG em píxeis é a altura da caixa de tinta nas mesmas unidades.
* **A PRESENÇA de uma cela** (§6 quinquies) é medida nova, e existe por causa de um limite da contagem: `_mascara` separa o sinal por distância à cor do canto, e por isso conta igual uma barra que difere do campo por uma sombra e uma que difere por tudo. A mesma marca dá 20,3 % de sinal num separador escuro e num claro, e num deles não se vê. A presença é o contraste entre a cor do campo e a cor mais afastada dela, as duas **lidas no PNG** e não declaradas, passadas pela mesma régua de `desenhar.py contraste`. Nas celas de canto transparente não se mede, porque ali o canto não é campo nenhum.
* **O «E» versal do Spectral Bold** que serve de vizinho na cela de colisão (§6 quinquies) é **medido na captura de 512 px**, e não citado: a proporção dos braços dele é a premissa da comparação, e uma premissa citada de cor não é medição. Conta-se, linha a linha, o alcance da tinta a partir da margem esquerda. E o programa **pára** se `document.fonts.check()` não confirmar que o ficheiro da casa está carregado, porque um «E» em Georgia mediria outra letra.
* **A altura de x e as hastes do Spectral** foram medidas no ficheiro da casa: `sxHeight` 454 e `sCapHeight` 660 vêm da tabela `OS/2` do `Spectral-SemiBold.woff2`; a haste do «d» (98,3 no SemiBold, 68,9 no Regular) foi contada no contorno, com as curvas achatadas em segmentos e a linha do meio do glifo cruzada. Nenhum destes números veio de uma tabela de fora.

---

## 9 · O que não se fez, e devia ficar dito

* **Não se experimentou o âmbar como acento na direção B.** Foi descartado por medição e não por gosto: o âmbar sobre papel claro mede 2,09:1, e um traço de 6 px a 60 nessa relação é uma mancha pálida. O cobalto mede 7,73:1. Está na §5.
* **Não há versão em cinzento nem em uma cor só.** Um ícone de telemóvel não a pede; uma marca a sério acaba por pedir.
* **O alfabeto da casa tem agora dois «E»** (o serifado da A, da I e da J, e o de três barras da H) e não tem «s». Se a direção escolher a J e quiser a palavra desenhada inteira, é o «s» que falta, e a §4 diz porque é que ele não sai desta grelha: a regra do remate cortado a direito. Um «s» obriga a mudar essa regra, e mudar essa regra muda todas as letras.
* **A marca horizontal das nove primeiras usa o nome composto em Spectral**, e não desenhado. A da J e a da J2 têm «Estado» desenhado e o resto composto, que é o mais longe que este trabalho foi. E havia lá um erro que só se viu ao medir a caixa: o topo do `viewBox` estava na altura de maiúscula e não na tinta, e por isso a ascendente do «d» de «Estado» saía cortada em 13,6 unidades de 113,6. Está corrigido, e a caixa passou a ser medida nos contornos. Se a direção quiser o nome inteiro desenhado, é outro trabalho, e maior do que este.
* **Não se experimentou a linha do valor noutra cor que não o cobalto**, nem em cinzento. O sítio tem o âmbar para «fora do limiar», e uma linha de valor âmbar diria uma coisa que a marca não pode prometer.
* **A maqueta não tem fotografia por baixo.** Um ecrã principal a sério tem, e há fotografias que engolem um campo de papel. Quem quiser essa prova tem de a fazer com a fotografia do próprio telefone.
* **Não se experimentou o «E» de três barras com quatro linhas nem com duas.** Três é o número de campos que uma linha do livro-razão nunca tem em falta, e é também o número de braços de um «E». As duas coisas coincidirem é a razão de a H existir; se o livro-razão tivesse quatro campos obrigatórios, esta direção não existia.

E o que ficou por fazer na ronda do «e» refinado (§6 bis):

* **Não se experimentou a barra fora do meio.** Num «e» de tipo a travessa costuma estar acima do meio da altura de x, e aqui está no meio, que é a posição da linha do livro-razão. Com a linha da régua largada, a razão para ela estar no meio deixou de existir, e a hipótese não está desenhada.
* **Não se experimentou um corte que não seja radial.** As faces do corte apontam ao centro, que é a construção de uma geométrica monolinear. Um corte horizontal, paralelo à barra, é o que várias geométricas fazem, e mudaria a leitura da abertura; não se desenhou.
* **A colisão com o navegador da Microsoft continua por conferir**, e é agora a primeira coisa a fazer quando houver rede, porque o desenho recomendado é um «e» minúsculo redondo e monolinear, que é a família daquela marca. A diferença de construção está dita na §6 bis e é real; o que não se pode dizer sem rede é o quanto ela chega.
* **Não se viu a marca sobre fotografia**, como já acontecia às onze e às sete. Um campo de tinta aguenta o que um campo de papel não aguenta, e essa medição, se for feita, só pode piorar a posição do par de campo claro.
* **Não se desenhou o nome inteiro em contorno.** A marca horizontal leva o «e» desenhado e «O Estado do País» composto em Spectral, que é o que a §1 cobre. Continua a faltar o «P», o «í» e o «s» para o nome poder ser desenhado.
* **O ficheiro sem campo (`18r`) tem `maskable` e não devia.** Sai do mesmo `exportar.mjs` que os outros, e um `maskable` sem campo não quer dizer nada. Fica assinalado em vez de corrigido, porque a exceção só vale a pena depois de a direção escolher.

E o que ficou por fazer na ronda do «e» explorado (§6 ter) está escrito no fim dessa
secção, e não se repete aqui: a grossura não se mexeu, a barra fora do meio e o corte
não radial continuam por desenhar desde a §6 bis, e a colisão com o navegador da
Microsoft continua a ser a primeira coisa a conferir quando houver rede.

E o que ficou por fazer na ronda da direção K (§6 quinquies) está escrito no fim dessa
secção, e não se repete aqui: a marca com haste não se desenhou porque isso é a direção
H, que já existe e já está ordenada; o valor entre 40 e 72 de altura e entre 197 e 238 de
comprimento não está experimentado; a cor do valor continua a 2,12:1 contra a tinta, que
é abaixo dos 3:1 que a casa exige a um objeto de interface, e não se procurou outra; e os
dois glifos da colisão são marcadores desta ronda e não barras de aplicação a sério, que
sem rede não se conferem.

E o que ficou por fazer na ronda das vozes (§6):

* **«do País» não está desenhado em voz nenhuma.** A marca horizontal das sete leva «Estado» desenhado e o artigo e o «do País» compostos em Spectral (ou em Spectral SC, no cinzel). Faltam o «P», o «í» com acento e um segundo «s» para que uma delas possa ter o nome inteiro desenhado, e isso é outro trabalho.
* **Não se desenhou de memória a marca do navegador da Microsoft nem a da Ecosia.** A adenda deixava fazê-lo, rotulado como tal; não se fez, porque um desenho de memória de uma marca de outrem não é medição nenhuma, e sem rede não se confere no ficheiro deles. A comparação com o Eco, essa, está feita, porque o ficheiro dele está na folha. Fica como pergunta em aberto.
* **Não se experimentou a sétima voz com a barra em cobalto.** O cobalto quer dizer «dentro do limiar» e o âmbar «fora»; a barra da sétima voz é a linha da régua, e uma linha de régua não devia estar de nenhum dos dois lados. Um cinzento seria a hipótese honesta, e não está desenhada.
* **Não se experimentou campo ocre com letra de tinta**, nem campo cinzento em voz nenhuma. O ocre entrou só como campo escuro com letra de papel.
* **A voz caligráfica não teve segunda construção.** O «E» de mão inglesa lê-se como «épsilon», e a saída óbvia seria um «E» uncial, com haste vertical e três braços de aparo. Não se desenhou porque a adenda pede **um traço só**, e uma haste vertical com três braços obriga a levantar o aparo pelo menos duas vezes. A escolha entre a legibilidade e a regra é de direção, e fica dita em vez de resolvida.
* **A 14b não tem maqueta de ecrã escuro própria**, porque não é uma voz: é a resposta desenhada a uma pergunta sobre campo, e a pergunta era sobre o ecrã claro.
* **Nenhuma das sete foi vista com fotografia por baixo**, como já acontecia às onze. Um ecrã principal a sério tem fotografia, e há fotografias que engolem um campo de papel e nenhuma que engula um campo de tinta ou de âmbar: essa medição, se for feita, só pode piorar a posição das duas vozes de campo claro.

---

## 10 · O custo

Cerca de **320 mil símbolos** na primeira sessão (as sete direções), cerca de **300 mil** na segunda (as três da terceira adenda) e cerca de **90 mil** na terceira (a J2, as maquetas e o cabeçalho), quase todos em ida e volta entre desenhar, exportar, **olhar as capturas** e corrigir.

As correções que gastaram mais foram sempre as que só se viram olhando. Na segunda sessão foram três: o «E» com os braços a decrescer, que lia «F»; o «s» desenhado, que ao fim de doze construções continuava a ler-se como dois discos; e o `maskable`, que estava errado desde a primeira sessão em três direções e que nenhum SVG denunciava, porque o erro só existe depois de o navegador aplicar o CSS.

Na terceira foram duas, e a segunda mudou uma recomendação: a caixa do lockup, que cortava a ascendente do «d»; e **a maqueta do ecrã principal, que mostrou que a palavra não segura uma cela de 180 px**. Essa não se via em campo branco, não se via na prancha, e não se via em número nenhum que estivesse a ser contado até aqui: só se viu ao pôr o ícone entre os outros, ao tamanho a que a mão o vê. É a razão de a maqueta existir, e o argumento para a fazer antes e não depois.

Cerca de **340 mil símbolos** na quarta sessão, a das sete vozes. As correções que gastaram mais foram, outra vez, as que só se viram a olhar, e foram quatro:

1. **Os `<style>` dos SVG numa folha de pré-visualização são todos do documento**, e o último ganha. A primeira folha saiu com as sete vozes todas em âmbar sobre tinta, e o desenho não tinha nada. Corrigiu-se a folha (cada SVG passou a ir por `data:`), e o que se aprendeu ficou dentro do programa: as amostras de cor da prancha levam as cores no atributo e não em classe.
2. **A serifa em cunha e a laje saíram do tamanho errado à primeira**, e as duas pelo mesmo motivo: a medida estava presa ao fino em vez de estar presa à haste. A cunha dava um pé com 2,4 vezes a haste (numa versal romana é 1,84) e a letra lia-se como um laço; a laje descia 0,216 H numa barra de 0,148 H e a letra ficava com blocos soltos.
3. **O espacejamento por avanço não chega**, e viu-se na voz condensada: o «t» tinha avanço de 86,8 e haste a acabar aos 93,5, e entrava no «a». Foi preciso passar a medir o espaço na caixa de tinta, com cada letra desenhada duas vezes.
4. **A cela de 180 px estava a mostrar a letra do favicon**, e não a letra da voz. A Didone chegava ao tamanho a que é julgada com contraste 1,9 em vez de 6,55, e nenhum número o denunciava, porque todos os números estavam certos para o desenho errado. Obrigou a um terceiro grupo dentro de cada SVG.

As quatro têm a mesma forma: **o programa estava certo e o que ele desenhava não era o que se pensava.** É o argumento para olhar as capturas a cada passo, e não no fim.

Cerca de **250 mil símbolos** na quinta sessão, a do «e» refinado. As correções que gastaram mais foram três, e as três vieram de olhar:

1. **A premissa da adenda estava errada, e só a medição com sítio o mostrou.** «A ponta do corte afina para 1 px» é verdade quanto ao número e falso quanto ao que ele mede: é uma linha de píxeis a rasar um canto vivo. Sem saber o sítio da corrida mínima, a ronda teria começado por engrossar uma ponta que tem 3,9 px.
2. **A janela da primeira medição da ponta era um rectângulo fixo**, e o corte anda com o ângulo: a variante de corte largo ficava com a ponta fora da janela e a medição dizia «15 px» onde devia dizer 5. Passou a ser um disco centrado na ponta, calculado a partir do raio e do ângulo lidos na própria imagem.
3. **O lockup só se viu quando se rendeu a 1:1.** O «e» descia 0,12 da altura de maiúscula abaixo da linha de base e ficava pendurado, e o espaço entre o sinal e o nome deixava duas formas redondas quase encostadas. Nenhuma das duas coisas aparecia em número nenhum.

Cerca de **270 mil símbolos** na sexta sessão, a do «e» explorado. Foram três correções, e as três vieram de olhar, mas de maneiras diferentes:

1. **A régua mediu o entalhe e chamou-lhe corte.** A `medir-e` procura o maior arco sem tinta em toda a circunferência do meio da banda, e com uma barra que para há dois buracos em vez de um. Devolveu 2,0 px de «corda» a 16 px para um anel **fechado**, o que é uma impossibilidade, e foi essa impossibilidade que a denunciou: o número só se percebeu por estar ao lado da corda **desenhada**, que dava 0,51 px. Duas réguas independentes sobre a mesma coisa apanham o que uma sozinha não apanha, e é por isso que as duas ficaram no programa.
2. **A ideia do diretor, desenhada à letra, não dá um «e».** Isso não se vê em números: as ilhas dizem «sinal em duas peças», e uma peça a mais podia ser só uma peça a mais. O que a captura de 60 px mostra é o que essas duas peças fazem juntas, que é um traço horizontal dentro de um anel, ou seja o sinal de menos. A medição diz o que mudou; olhar diz o que passou a estar lá.
3. **A oitava linha da grelha não foi pedida, e é a melhor resposta à primeira pista.** Ao ver as três linhas de barra presa à esquerda ao lado das de barra unida, o que salta é que o entalhe e o corte comem o mesmo lado. A correção é uma linha de código e mudou a recomendação; sem a folha cruzada, as sete linhas pedidas tinham sido entregues e a oitava não existia.

Cerca de **460 mil símbolos** na sétima sessão, a da palavra «estado» em
minúsculas, e o número é maior do que o das anteriores por uma razão que não é
de desenho: a adenda mudou duas vezes com a ronda a meio, e cada mudança obrigou
a refazer o que já estava rendido. Foram quatro correções, e as quatro vieram de olhar:

1. **A régua do texto composto media a caixa de LINHA e não a de tinta.** O «e» do
   Spectral, enquadrado por `Range.getBoundingClientRect()`, saía com metade do
   tamanho dos «e» desenhados na mesma cela, porque o que essa régua devolve para
   uma letra é a altura do corpo. Só se viu ao pôr as seis celas lado a lado: os
   números todos estavam certos para a caixa errada. Passou a `measureText` com
   `actualBoundingBox*`, que devolve a tinta.
2. **A pena de um polígono só não aguenta o peso de ícone.** O «s» com a banda a
   22 % saía com uma mancha no meio da espinha: os dois lados do traço cruzam-se
   e um polígono que se atravessa a si mesmo, cheio por `nonzero`, enche o
   cruzamento. A pena passou a emitir um quadrilátero por troço, e a união deles
   é o traço, cruze-se ele ou não. Nenhum número denunciava isto.
3. **O anel modulado tinha uma costura.** O «o» e o «d» da humanista saíam com um
   fio de papel a sair do lado direito, que é onde o esqueleto fecha. Um anel são
   dois contornos e não um polígono dobrado.
4. **A adenda mudou duas vezes a meio da ronda, e a segunda mudou o desenho.** A
   7b tirou o sinal de ao lado do nome antes de haver composição; a continuação
   das 07:25 acrescentou um número (22 % de grossura) que obrigou a redesenhar a
   barra e o corte do «e» geométrico, porque à grossura de ícone o corte
   horizontal deixa de caber: com a banda a 22 % o raio de dentro é 131,6 num raio
   de 235, e o corte não passa dos 34 graus.

E uma medição que mudou a leitura de tudo o resto: **ao peso do cabeçalho, duas
das três letras partem-se aos 16 px**, e ao peso de ícone as três aguentam com o
olho fechado. A queixa do diretor sobre a tira de separadores tinha razão, e o
que a corrige não é o desenho: é o peso e o campo.

Cerca de **380 mil símbolos** na oitava sessão, a da direção K, e o número é
aproximado: conta a leitura das rondas anteriores, que é o que permite comparar,
e não só o que esta escreveu. A adenda cresceu duas vezes com a ronda a meio (as
variantes K2 a K4, e depois a K5 mais o «E» como terceiro vizinho), e cada
crescimento obrigou a refazer as capturas, que é o mesmo padrão da sétima.

Três correções vieram de olhar, e as três têm a mesma forma das anteriores: o
programa estava certo e o que ele media não era o que se pensava.

1. **A régua conta igual uma marca que se vê e uma que não se vê.** `_mascara`
   separa o sinal por distância à cor do canto, e por isso o favicon do diretor
   dá **20,3 % de sinal num separador escuro e num claro**, com as mesmas três
   ilhas e a mesma corrida mínima. Num deles não há marca nenhuma. Não foi um
   número que o denunciou, foi a folha ampliada doze vezes; e o que saiu daí foi
   a medida da **presença**, que passou a acompanhar todas as celas.
2. **Um PNG transparente convertido para RGB fica com o campo preto.** Os cantos
   arredondados do ícone saíam brancos na folha de conferência, porque a captura
   estava a ser composta sobre branco em vez de guardar o alfa. Corrigiu-se onde
   a composição tem de acontecer, que é sobre o separador, e passou a haver celas
   compostas pelo navegador para a régua não ter de adivinhar o campo.
3. **A cela da marca fina media ao contrário, e foi um número impossível que a
   apanhou.** Sem margem, o canto da imagem cai em cima do contorno da marca, a
   régua lê tinta como campo e devolve **76,8 % de sinal** para um desenho que é
   um fio de dois píxeis e meio. Uma marca de fio com três quartos da cela pintados não
   existe, e é essa impossibilidade que denuncia a medição, como já tinha
   acontecido à corda do «e» na §6 ter.
