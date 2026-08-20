# Crítica · O Estado do País · página inicial v3

Método: li a constituição, os seis estados e o template. Onde faço uma afirmação de medida (contrastes, coordenadas, geometria dos gráficos), calculei-a a partir do ficheiro ou amostrei o pixel na captura. Onde infiro, digo que infiro.

---

## 1 · A cor de aviso é a marca mais fraca da página

**Problema.** Amostrei os contornos das peças em `d1-pais.png`: âmbar `#E0A21A` (224,162,26) a 2px, cobalto `#1F4E8C` a 2px, cinzento `#7F8681` a 2px. Contra o papel `#F6F7F4`: cobalto **7,73:1**, cinzento **3,47:1**, âmbar **2,09:1**. A ordem de peso visual dos três estados é exatamente a inversa da ordem de urgência editorial. As quatro peças que dizem «Portugal está fora do limiar» são as que menos se veem; as duas que dizem «não há referência publicada» veem-se mais.

**Porquê.** Para o leitor geral, o primeiro olhar sobre o painel é um olhar a cor, e o que ele lê é «duas coisas fortes a azul, duas cinzentas, e umas quatro apagadas». Para um leitor com baixa visão, ou num ecrã com reflexo, o âmbal desaparece de todo. O quadrado de 15px da fila de estados tem o mesmo problema. WCAG 1.4.11 pede 3:1 para objetos gráficos; 2,09 não chega.

**O que mudar.** O marcador âmbar leva contorno de tinta (o quadrado «sem limiar» já leva, e é por isso que se lê). Ou: o âmbar só preenche, e a marca é ocre `#7A5300` (6,37:1). A palavra continua a ser escrita, como já é.

**Classificação:** viola a constituição («diferença de brilho garantida entre estados») **e a constituição está errada aqui**: o §3 mediu âmbar contra cobalto (3,7) e ocre contra papel (6,4), mas nunca mediu **âmbar contra papel**, que é a única medição que interessa para um marcador que assenta no papel. A auditoria tem um buraco e a maqueta conduziu por ele um contorno de 2px que carrega o estado inteiro.

---

## 2 · O estado saiu do valor e foi para a caixa

**Problema.** `tileStyle: "border-color: " + c.edge` pinta o contorno inteiro da peça (268px de altura) com a cor do estado. A constituição diz o contrário, em texto: «O estado colore só o marcador do valor e a palavra de estado», e cor «em pequena área».

**Porquê.** Quando a moldura carrega o estado, o estado passa a ser uma propriedade do cartão e não do número. Um painel de oito cartões com molduras coloridas é um dashboard, que é precisamente o género contra o qual esta constituição se define. O §6 proíbe «cartão com borda colorida à esquerda»; pintar as quatro bordas não é cumprir a regra, é ultrapassá-la.

**O que mudar.** Tirar a cor da moldura. O estado fica no quadrado, na palavra e (ver ponto 3) na régua. Se a peça precisa de moldura, é cinzenta e igual em todas.

**Classificação:** viola a constituição.

---

## 3 · A régua-espécime não está lá, e os dados dela já existem

**Problema.** Todos os oito blocos europeus têm no ficheiro `hasRuler: true`, `limX`, `valX`, `barX`, `barW`, `minLabel`, `maxLabel`, `limLabel`. Em Relance, que é a densidade por defeito e a de quatro das seis capturas, **nenhuma régua é desenhada**. A referência é entregue como um autocolante de texto («LIMIAR 60 · ACIMA») por cima do número.

Quando a régua aparece (`d5`, poder de compra), inverte-se: barra de valor a tinta `#17191B` com 8px de altura, linha do limiar a `#7F8681` com 2px, por baixo da barra. A referência é a marca mais fina e mais clara do desenho; o valor é a mais grossa e mais escura. É a linha de Plimsoll ao contrário: no casco, a linha de carga é a marca permanente e pesada, e o que se move é a água.

Pior, a «mesma peça» tem três geometrias incompatíveis no mesmo sítio:
- **enchimento a partir do mínimo da escala**: dívida pública `barX 0 → barW 224,25` numa escala 0–120; poder de compra `barX 0 → barW 184,41` numa escala 50–150 (encher a partir de 50 num índice não significa nada);
- **enchimento do valor até ao máximo**: posição de investimento internacional `barX 84,9 → barW 215,1`;
- **barra de distância entre o valor e a referência**: a banda regional em `d1` e `d2`, `bandBarX = min(selX, 625); bandBarW = |625 − selX|`.

E há uma barra sem referência nenhuma: «Execução da receita» 61,44 tem `hasRuler: true`, `hasLimiar: false`, `limStroke: "none"` e uma barra cinzenta a encher 61,44% de uma escala 0–100. O desenho sugere uma meta de 100 que a própria peça declara não existir. É a versão gráfica do «hero metric sem referência» proibido no §6.

**Porquê.** Para o analista, uma barra que enche a partir de 50 num índice é ruído; para o leitor geral, é uma promessa falsa de proporção. E o princípio nº 2 da constituição, «a referência inscreve-se no objeto medido», fica reduzido a uma etiqueta ao lado do objeto.

**O que mudar.** A régua não é uma camada de profundidade: é a linha de base do número. Referência a tinta, altura inteira, sempre a marca mais escura. Valor: traço fino, não círculo. Distância escrita. Nenhuma barra quando não há referência.

**Classificação:** viola a constituição **e a constituição está errada aqui**. O §3 importa a regra do ONS [R137] («referência a 2px em cinzento escuro») e o §1 importa a linha de Plimsoll [R196]. As duas contradizem-se: a convenção do ONS é para anotar um gráfico de linhas, onde a referência é acessória; num instrumento, a referência é a marca dominante. A maqueta escolheu a regra errada das duas e é o §3 que tem de ceder.

---

## 4 · O vocabulário sabe dizer «bom» e não sabe dizer «pior»

**Problema.** Cobalto dispara para «acima da média»; para «abaixo da média» não dispara nada. Verificado nos dados: as cinco regiões e Portugal têm todas `hasLimiar: true` contra `UE-27 = 100`, e só Grande Lisboa (129) tem `kind: "dentro"`. Portugal 82, Alentejo 77, Madeira 88, Algarve 89, Península de Setúbal 55: todas `kind: "sem"`, isto é, renderizadas exatamente como «não há referência publicada». Em `d2-alentejo.png` a manchete diz «Alentejo, 23 pontos abaixo da média da UE-27.» e por baixo dela está um quadrado vazio com a palavra **SEM LIMIAR**. A referência está escrita na manchete e a marca diz que não há referência.

Ao mesmo tempo, o inverso: «Taxa de emprego» e «Crianças em creche» têm `hasLimiar: false`, o seu próprio texto de estado é «ACIMA DA MÉDIA UE · SEM LIMIAR» e «DESTAQUE NO PAINEL SOCIAL · SEM LIMIAR», e ambas estão pintadas de cobalto. E o rodapé do catálogo em `d6` afirma «a cor segue a mesma regra do painel: só onde a fonte publica um limiar ou uma referência», três linhas abaixo das duas linhas que a contradizem.

A aritmética também não fecha na primeira dobra de `d1`: o dek diz «quatro têm limiar da Comissão e os quatro estão fora dele» (logo, quatro não têm limiar) e a fila de estados, 60px acima, mostra **dois** quadrados em «sem limiar».

**Porquê.** É o leitor cuidadoso, o que o sítio mais quer, que apanha isto. E apanha-o na página de entrada, no primeiro minuto. Um sítio cuja mercadoria é a confiança não pode ter uma contradição verificável entre o texto e as marcas na mesma dobra.

**O que mudar.** Ou o vocabulário ganha o estado negativo simétrico («do lado mau da referência», ocre, sem âmbar, para distinguir de «fora do limiar»), ou a cor sai de todas as comparações que não sejam limiares formais e a palavra faz o trabalho sozinha. O que não pode ficar é uma regra que dispara metade das vezes.

**Classificação:** a constituição está errada aqui. Quatro estados com um só negativo, e esse só existe quando há limiar publicado, é um vocabulário que não cobre o caso mais comum em estatística pública, que é a média.

---

## 5 · A primeira dobra não tem nenhum número medido

**Problema.** Acima dos primeiros 860px de `d1` há: navegação, marca a 64px, linha de método, duas barras segmentadas, antetítulo, manchete a 40px, fila de estados, dek, sub-dek, mapa de pontos com ficha, e a pastilha «Medidas · 8 no painel». O contorno da primeira peça está em y=863; o «89,7» começa por volta de y=920. Numa janela de portátil, o primeiro valor com fonte fica fora do ecrã.

E há um fantasma no ficheiro: `ledeFig`, `ledeLabel`, `ledeCaption` e `ledeSqStyle` são calculados, devolvidos, e **nunca usados no template** (`grep` = 0 ocorrências). A manchete numérica no molde do comunicado estatístico que o §4 exige foi construída e depois retirada. Ficou o cadáver no ficheiro e uma manchete em prosa com o número por extenso.

**Porquê.** Para o leitor geral, a página promete três vezes («Cada número tem fonte», o dek, a nota) antes de mostrar uma única vez. Para o analista, a cabeça é toda navegação e nenhuma medida.

**O que mudar.** Repor a manchete numérica (o número composto como número, com período e referência ao lado). Cortar o sub-dek ou o mapa. O primeiro valor com selo tem de estar visível a 900px.

**Classificação:** viola a constituição (§4, «uma manchete numérica no molde do comunicado estatístico», «um destaque dominante por página»). A cabeça atual tem cinco destaques a competir.

---

## 6 · O mapa ocupa 40% da primeira dobra para transportar um bit

**Problema.** O SVG tem `viewBox="0 0 600 790"` desenhado a 281px, ou seja escala 0,468. Os 307 pontos apagados têm `r=3,2`, o que dá **1,5px de raio no ecrã**, com contorno de 1px reduzido a 0,47px. A instrução ao lado diz «Toque num ponto para abrir o concelho»: o alvo tem 3px. Na ficha-localizadora de `d5` e `d6` (170px, escala 0,283) fica em 2px. Não é acionável com rato e é impossível com o dedo.

Mais: os pontos são **círculos**, quando o §3 e o §4 dizem explicitamente que «o mesmo par cheio/tracejado diz cobertura no mapa (município com página / sem página ainda)», isto é, o par ■/□ do selo. As caixas dos arquipélagos não têm rótulo nenhum (nada na peça diz qual é a Madeira e qual são os Açores). E quando o mapa encolhe para ficha, **perde o selo**: em `d1`, `d3` e `d4` o bloco tem «■ FONTE · DGT, CAOP 2025»; em `d5` e `d6` a ficha diz «1/308 municípios com página» sem selo nenhum. Um número perde a fonte porque o contentor encolheu. Isto é um ensaio geral do que vai acontecer no telemóvel.

**Sobre a regra do mapa (inteiro → régua → ficha → ausente).** O instinto está certo: o mapa deve sair quando não é o instrumento do âmbito, e a banda regional em `d2` é a melhor decisão de composição do conjunto. Mas a regra está indexada à variável errada. Não é o âmbito que decide, é a pergunta: o mapa ganha o seu lugar quando a resposta é espacial. Aqui, no âmbito País, o único facto espacial é «um de 308 está aceso», que uma frase diz melhor e um ponto de 3px diz pior. O mapa não está a orientar, está a ilustrar a escassez de cobertura, que é a única coisa que a constituição não quer que se ilustre.

**O que mudar.** No âmbito País, o instrumento é a régua da convergência ou a manchete numérica, não o mapa. O mapa fica dentro do âmbito Município, a um tamanho em que um ponto seja um alvo real, com o par ■/□ em vez de círculos, com as caixas rotuladas, e com o selo agarrado à ficha em todos os tamanhos.

**Classificação:** viola a constituição (marcador errado, selo perdido) e a regra do mapa está indexada à variável errada.

---

## 7 · Três densidades: a que prova a promessa nunca foi mostrada e está quase vazia

**Problema.** Seis capturas, nenhuma em **Fundo**. E é Fundo o único nível que desenha o recibo: proveniência, «Prova · campo devolvido» com o excerto, verificações, correções. No ficheiro, `hasExcerpt` é verdadeiro em **1 dos 8** blocos europeus e em 2 dos 8 de Évora; em todas as linhas o campo «Reconferido a» diz `[a verificar]`. Dos dois excertos de Évora, um é a cadeia `"valor 58567"`, exibida por baixo da nota «Transcrito da fonte, palavra por palavra». Não é uma transcrição, e a peça afirma que é.

O modelo de interação luta contra si próprio:
- `<a class="selo">fonte</a>` está **dentro** do `<div class="tile" onClick={toggle}>`. O clique mais importante do sítio inteiro, o que abre a linha do livro-razão, está aninhado dentro de um alvo concorrente que faz outra coisa. No telemóvel isto não tem solução.
- `setDepth` faz `this.setState({ depth: d, open: {} })`: mexer no seletor global **apaga silenciosamente** todas as escolhas por bloco. Abrir três medidas para as ler e depois carregar em «Leitura breve» para comparar destrói as três.
- O controlo por bloco cicla relance → leitura → fundo → relance sem indicar onde está nem que dá a volta, e chama-se «▸ abrir», palavra que promete navegação.
- Uma peça aberta em Leitura passa a `grid-column: span 2` e em Fundo a `span 4`. O enunciado «um toque numa peça muda só a dela» é verdadeiro quanto ao conteúdo e falso quanto à posição: as outras sete saltam de sítio.

**Porquê.** O custo cognitivo de três densidades pagar-se-ia se a terceira fosse a que fecha a promessa. É, e está vazia. Neste estado, as três densidades cobram ao leitor uma decisão («que profundidade quero?») antes de lhe terem dado uma razão para a tomar.

**O que mudar.** Duas densidades, não três: a linha e o recibo. O recibo deixa de ser um nível de densidade e passa a ser o destino do selo (a página de linha já está no plano de construção). O selo deixa de estar aninhado. Abrir em Leitura não realinha os vizinhos.

**Classificação:** viola a constituição (§4: as profundidades «abrem no sítio», mas o recibo é o boletim, e um boletim quase todo em branco não é um boletim).

---

## 8 · O catálogo é a forma certa, no sítio errado

**Problema.** A lista do catálogo em `d6` é, linha a linha, exatamente o que o §4 manda pôr na página inicial: «os oito indicadores em linhas iguais (uma linha por entidade, como o boletim)». Mesma ordem de campos, comparável na vertical, densa, sem molduras. É a melhor peça do conjunto. E está escondida atrás da pastilha mais fraca da página, com um triângulo de 11px.

Entretanto o painel principal usa a grelha 4×2 de cartões, onde a pauta não se segura: na segunda fila de `d1`, «% DA POPULAÇÃO DOS 20 AOS 64 ANOS · 2025» quebra para duas linhas e o nome da medida cai a alturas diferentes nos quatro cartões. Campos iguais em posições desiguais é o contrário de «a mesma ordem de campos».

**Risco editorial do painel composto.** A frase «Um painel composto não é uma classificação: as medidas não se somam nem se ordenam» está afirmada, não está imposta. O que a peça faz é permitir juntar dívida pública nacional, PIB per capita de Grande Lisboa e prazo médio de pagamento de Évora numa grelha visualmente idêntica, com molduras coloridas, e chamar-lhe «9 medidas no painel». A defesa é uma frase em cinzento; o convite é a composição inteira. E a caixa de seleção usa `.box` / `.box.on`, isto é, **o mesmo par ■/□ do selo**, agora a significar «está no painel». Na mesma linha de `d6` há dois quadrados vazios a 900px de distância um do outro com significados diferentes.

**Interação suficiente?** Não: não há forma de guardar, nomear, partilhar ou citar um painel composto, o que significa que o leitor não pode responsabilizar-se pelo que construiu, e o sítio não pode saber o que os leitores constroem. Um painel composto sem endereço é um brinquedo.

**O que mudar.** A linha do catálogo passa a ser o painel; o cartão passa a ser o estado expandido da linha. O catálogo deixa de ser gaveta e passa a ser a página. A seleção usa uma marca que não seja o par do selo. Um painel composto ganha URL e uma linha de proveniência própria («painel montado pelo leitor a AAAA-MM-DD, N medidas, N âmbitos»).

**Classificação:** viola a constituição (§4).

---

## 9 · A pauta não segura a variável, e as duas regras tipográficas da identidade não estão implementadas

**Problema.**
- **Transbordo.** `.num` tem `font-size: 80px` e `white-space: nowrap`. Em `d4-evora-relance.png`, «58 567» encosta ao contorno, «111,47» **passa por cima da moldura cobalto**, e «54 681 562» (já com a classe de recurso `.num.long` a 52px) colide com o contorno direito. Duas das seis capturas mostram o defeito. Para uma constituição que começa em «pauta fixa, variável móvel», a pauta partir-se com a segunda variável que lá entra é o pior sítio possível para falhar.
- **Versaletes.** «Sebenta versaletes» é, no ficheiro, `text-transform: uppercase` a 11–12px com 0,04–0,08em de entreletra, em Bitter. `Spectral SC` é carregado no `<head>` e nunca é usado (uma ocorrência no ficheiro, a do link). Versaletes assentam na altura-x e são silenciosos; caixa alta a 11px com tracking é barulhenta, e é por isso que contei mais de oitenta rótulos em caixa alta em `d1`. A textura dominante da página não é a serifa: é o rótulo.
- **Algarismos antigos.** `.pg` declara `font-variant-numeric: oldstyle-nums` e não acontece nada: em `d5`, «caiu de 3 720 pessoas em 2013 para 1 596 em 2024» está em algarismos versais, que saltam da linha. A causa (o substituto não ter o conjunto, ou a build da Google não o expor) fica por apurar, mas o efeito é que a regra do §2 nunca foi testada, e a maqueta não pode testar aquilo que o próprio §2 marca como eliminatório antes da compra.
- **Percentagem.** «percentagem colada (89,7%)» é cumprida no teaser de Évora («61,44%») e ignorada nos oito cartões do painel, que separam o valor («89,7») da unidade («% DO PIB · 2025»). A mesma medida, «Execução da receita», aparece como «61,44%» em `d1` e «61,44» em `d4`.
- **Travessões.** Três dos quatro títulos de estudos usam travessão entre espaços («Évora — Quinze Anos, Cinco Mandatos»), contra a regra de casa. E estão em capitalização de título à inglesa, que não é convenção portuguesa.
- **Selo na prosa.** O §3 dá o exemplo «55 711 ■ fonte», o selo colado ao número. Na Leitura breve o selo está no fim da frase, depois do ponto final, a servir dois números de anos e fontes diferentes: «subiu de 55 711 em 2021 para 58 567 em 2025. ■ FONTE». Um censo e uma estimativa partilham um selo. Para um sítio cuja frase é «cada número tem fonte», este é o sítio onde ela deixa de ser verdade.

**O que mudar.** Correr o teste eliminatório do §2 nos substitutos antes de desenhar mais pranchas: sem versaletes e sem algarismos antigos, a maqueta não está a testar a identidade que diz estar a testar, e as decisões de ritmo tiradas destas capturas não transferem para Parnaso e Sebenta. Tamanho do valor por número de glifos, não por classe binária. Selo por número, não por frase.

**Classificação:** viola a constituição em quatro pontos verificáveis (versaletes, algarismos antigos, percentagem colada, travessões).

---

## 10 · As marcas de honestidade estão gastas onde não custam e ausentes onde custam

**Problema.**
- `[a verificar]` está em «Total 308», ao lado de «Continente 278 / Açores 19 / Madeira 11» (que somam 308) e de uma fonte que é a CAOP 2025, onde os 308 são definidos. É o marcador mais caro do sítio gasto no número mais barato. Quando o leitor o encontrar a sério, já o descontou.
- Ao mesmo tempo, «74 · pontos · calculado» e «105,5 · teto legal 150 · 2024 · calculado, DGAL» levam o mesmo **■ FONTE** de um valor lido. O selo promete abrir a linha onde o valor «foi lido»; estes não foram lidos, foram calculados. O par ■/□ precisa de uma terceira forma para «derivado», ou a promessa central dilui-se.
- O quadrado tracejado significa, na constituição, «por confirmar», isto é, existe um valor e falta confirmá-lo. Em `d3-beja.png` seis quadrados tracejados dizem «POR LER · FONTES NACIONAIS» por baixo da manchete «Ainda sem linhas para Beja.» As marcas dizem seis coisas pendentes e a manchete diz zero coisas. São dois estados diferentes com uma só marca.
- A **agenda** escreve «Cada item traz o critério que o pôs aqui, quem o propôs e quem o decidiu» por baixo de duas linhas que não trazem nenhuma das três, e um contador de cinco itens («3 em curso · 1 a seguir · 1 concluído · 0 retirados») por cima de duas linhas.
- Os **estudos** são o único bloco da página sem qualquer aparelho de proveniência: sem selo, sem data de leitura, sem fonte. E a segunda coluna leva descrição em duas linhas e data de publicação nas outras duas.
- «1/308 municípios com estudo aprofundado publicado» (mapa), «307 municípios sem página ainda» (teaser), «308 concelhos · 1 com página» (pesquisa): três nomes para a mesma coisa na mesma dobra, e «estudo» não é «página».
- **Correções** não está na navegação de topo (sete itens, como o §4 manda) e está no rodapé. Dos sete lugares, o que foi cortado foi o que mais encarna a promessa.
- Nota lateral, marcada como **inferida**: o excerto de prova de Portugal diz «2024: 82 p». Se esse «p» for a marca de provisório do Eurostat, o sítio publica como definitivo um valor que a sua própria prova marca como provisório. Independentemente disso, o desenho não tem sítio nenhum para uma marca de qualidade da fonte, e isso é um buraco real num instrumento que se apresenta como espécime.

**O que mudar.** Uma marca por significado. Terceira forma de selo para valores calculados. `[a verificar]` só onde há risco. Nenhuma frase-promessa impressa ao lado das linhas que não a cumprem: ou as linhas cumprem, ou a frase sai. Um só nome para a cobertura municipal. Correções no topo.

**Classificação:** viola a constituição (§5, «a ausência de dado publica-se como matéria», e o vocabulário fechado de marcas).

---

# Cinco ideias

**1 · O catálogo é a página inicial.** A grelha de cartões desaparece. Oito linhas iguais, uma por medida, campos na mesma ordem: nome · valor · unidade e período · régua · estado em palavra · selo. É o boletim que o §4 pede, já está construído, já funciona, e resolve de uma vez o transbordo dos números, o desalinhamento da segunda fila, a moldura colorida e a comparação vertical. O cartão passa a ser o que devia ter sido desde o início: o estado expandido de uma linha.

**2 · Uma linha de carga partilhada, em vez de oito escalas privadas.** Levar a metáfora de Plimsoll a sério: desenhar as oito medidas contra **uma** linha vertical de referência comum, a tinta, altura inteira, à mesma abcissa em todas as linhas, com cada medida a levar a sua escala escrita nas pontas. O leitor deixa de comparar comprimentos entre indicadores (que a constituição proíbe, e bem) e passa a ver de relance de que lado da linha está cada um. Isto obriga a decidir a polaridade de cada medida explicitamente, o que é exatamente o trabalho editorial que o ponto 4 mostra estar por fazer.

**3 · Duas densidades e um destino.** Relance e Leitura breve ficam na página. Fundo sai de densidade e passa a ser a página de linha, aberta pelo selo, com o recibo completo. Ganha-se: um seletor com dois estados em vez de três, o selo com um significado único em toda a parte, e um endereço citável por medida. Perde-se a leitura em cadeia de oito recibos seguidos, que é uma coisa que provavelmente ninguém quer fazer.

**4 · A prova antes da promessa.** O excerto real do Eurostat para a dívida pública já está nos dados: «General government gross debt (EDP concept), consolidated - annual data — Percentage of gross domestic product (GDP) — Portugal — 2025: 89.7». Pô-lo na primeira dobra, uma vez, em Parnaso Mono, como amostra permanente («é isto que está por trás de cada número desta página»). Nada convence um cético como ver o campo em bruto uma vez. É barata e é uma direção que a maqueta não seguiu: a página argumenta a promessa em prosa, três vezes, quando podia mostrá-la uma.

**5 · Telemóvel: o telefone é o teste, não a redução.** Concretamente:
- As duas barras segmentadas (seis botões) não cabem. O âmbito não é um interruptor, é a página: País, Região e Município passam a três endereços, e o seletor de densidade fica um só, na linha da medida.
- O mapa **não pode ser seletor** a nenhuma largura de telemóvel (a 390px, um ponto tem menos de 1px). Vira frase com número («1 de 308 concelhos tem página») mais campo de pesquisa. Se o mapa não sobrevive como instrumento no telemóvel, vale a pena perguntar se é instrumento no desktop.
- O valor a 80px com `nowrap` é insustentável: «54 681 562» já transborda a 1280. No telemóvel, o valor alinha à direita numa coluna de largura fixa e o corpo desce por número de glifos.
- O selo tem de ser o maior alvo tátil da linha, nunca aninhado dentro de outro alvo. Isto resolve-se no telemóvel e o desktop herda a solução.
- «Os números primeiro» (§4) quer dizer, na prática, que a linha começa em valor e referência e só depois traz o nome. Se isso é verdade no telemóvel, é provavelmente verdade no desktop, e a página inicial de 1280 está composta ao contrário.