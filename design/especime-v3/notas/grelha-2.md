# Nota do construtor · A grelha, segunda passagem (27.08.2026)

*Ramo `grelha-2-2026-08-27`, a partir de `main` em `3d65716`. Construtor: Claude
Opus 5. Decisão do diretor a 27.08, «go, follow your recommendation on all of
them», sobre quatro entradas de `ISSUES.md`: I81 e I82 (o mapa), I74 (as
declarações mortas do inventário) e I79 (as dicas fora da varredura).*

## 0 · As escolhas que o brief deixou em aberto, e a medição que as decidiu

**A régua da I82 mede o quadrado inscrito QUE CONTÉM o ponto, e não o quadrado
centrado nele.** O brief escreve as duas formas, e a medição separou-as: pelo
quadrado centrado no ponto representativo, **nenhuma das 29 unidades chega aos
44 px a nenhuma largura**, nem a 1280. Uma medida que nunca separa nada não
separa um alvo de um não-alvo, e por isso o alvo passou a ser o maior quadrado
que cabe dentro da área e contém o ponto onde a régua clica. O número do quadrado
centrado fica na saída da régua ao lado do outro, porque é a leitura estrita e
quem ler estes números tem de ver as duas.

**A rede da Emenda 20c passa da moldura para a parcela.** A emenda escreve a
rede na forma em que ela primeiro fez falta, «onde uma ilha não chegar aos 44 px
na moldura, os nomes das ilhas dessa moldura ficam por baixo dela», e o
continente não tem moldura, pelo que não tinha rede nenhuma. A I81 pergunta se o
mapa do telemóvel deve tomar a janela **ou** se os distritos do continente devem
ter lista; a resposta medida é **as duas**, e não uma: à largura da janela numa
janela de 320, Viana do Castelo mede 40,2 px de caixa e continua a não ser alvo.
A forma é a que a emenda já usa: os nomes da parcela por baixo do mapa, como
ligações, uma por linha, e a lista é de todas as unidades da parcela e não só das
que não chegam, pela razão que já estava escrita para as ilhas.

**Dezoito declarações do inventário saíram em vez de virarem sentinelas.** O
brief dá dois estados, `viva` e `retirada`. Catorze das 57 linhas mortas levam
uma contagem por dentro («132 afirmações · 19 calculadas») e nenhum dos dois
estados lhes serve: uma frase com um número que se move volta com outro número, e
a sentinela nunca morderia. Quatro deixaram de ser frases da casa porque o nome
do lugar passou a declarar-se (`data-lugar`) ou a compor-se (`<lugar>`). As duas
famílias saem do ficheiro; quando uma contagem voltar, volta como bloco **por
classificar**, que é o portão que a apanha.

**A varredura das dicas leva duas normalizações, escritas na régua.** Sem elas o
inventário passava a crescer com os dados: o `title` de um selo repete o
`data-selo-etiqueta` do mesmo elemento (o estado da linha e o nome do trabalho
que a publica, e seriam trinta cadeias a crescer com o arquivo), e o `aria-label` da
porta de uma figura leva a chave da linha do motor que ela aponta (uma por figura
de cada documento). Uma dica que repete um `data-*` do próprio elemento não
entra; o identificador que o elemento aponta sai da dica e deixa `<linha>`.

## 1 · G1 · o mapa do telemóvel à largura da janela (I81)

A folha dava ao mapa a coluna, que é a janela menos duas goteiras. A técnica é a
goteira devolvida, `margin-inline: calc(-1 * var(--gutter))` sobre a tela, e
não `100vw`, que conta a barra de deslocamento onde ela ocupa lugar e deixa a
primeira página a deslocar-se de lado. A margem é da tela e não da figura: a
linha da fonte, a lista dos nomes e a descrição são texto, e um texto encostado à
borda do ecrã não se lê.

| janela | tela antes | tela depois | caixa ≥ 44 px | quadrado inscrito ≥ 44 px |
|---|---|---|---|---|
| 320 | 284 | **320** | 17 de 29 | 0 de 29 |
| 360 | 324 | **360** | 19 de 29 | 0 de 29 |
| 390 | 354 | **390** | 19 de 29 | 1 de 29 (Beja, 46) |
| 430 | 394 | **430** | 19 de 29 | 3 de 29 (Beja 52, Castelo Branco 46, Évora 46) |
| 1280 | 490 | 490 | 19 de 29 | 5 de 29 (Beja 58, Castelo Branco 52, Évora 52, Bragança 48, Portalegre 44) |

`LARGURAS_DO_MAPA` eram duas e são quatro, e as duas que faltavam são as mais
estreitas de todas, que é onde a pergunta dos 44 px se decide: 320 (a janela mais
estreita que a casa serve, abaixo de 640), 281 (a largura fixa que a folha dá ao
mapa entre 640 e 1024, e que nenhuma linha do sítio conhecia), 340 (a coluna a
1024, medida) e 490 (a coluna a 1280). A mais pequena é a que manda, e é ela que
põe as três parcelas a precisar da sua lista.

## 2 · G4 · o alvo medido pela área inscrita (I82)

A medição cega M3 achou que o centro da caixa da Ilha da Madeira cai fora do
polígono da Ilha da Madeira. Não era um caso isolado: era a medida. Uma caixa é o
rectângulo que envolve a forma, e numa costa quase nada da caixa é a forma.

A régua rasteriza cada área a 2 px com `isPointInFill`, faz a programação
dinâmica do quadrado máximo sobre essa grelha, e devolve o maior quadrado que
cabe dentro da área e contém o ponto representativo. O lado sai múltiplo do
passo, e a régua arredonda para baixo: um alvo de 44 px medido assim tem pelo
menos 44 px.

**A Ilha da Madeira, a 1280: caixa 257,5 px, quadrado inscrito 12 px.** Pela
caixa era um alvo com quase seis vezes a folga; pela área inscrita não é alvo
nenhum. É o estrago plantado desta régua: tirar-lhe o nome da lista era
invisível para a régua antiga e é vermelho para esta.

**A consequência, dita sem arredondar: à escala do país, um distrito não é um
alvo de 44 px.** Nas quatro larguras de telemóvel chegam entre zero e três das
29; a 1280 chegam cinco. O que faz o mapa tocável é a lista dos 29 nomes por
baixo dele, cada um com 44 px de altura, e o mapa é a navegação do rato e do
teclado. É a Emenda 20c aplicada à medida certa, e é matéria para a direção ver:
a §1.72 escreveu «19 das 29 chegam aos 44 px» e esse número era da caixa.

## 3 · G2 · as declarações mortas passam a sentinelas (I74)

O inventário tinha 452 linhas e 57 não se rendiam em página nenhuma (58 na
construção de 26.08, que é o número da issue; a diferença é o que os blocos da
voz do livro-razão e dos documentos mexeram pelo meio). A tabela ganha duas
colunas, `estado` e `razão`, e o portão fecha a construção em quatro casos: uma
linha sem estado, uma `retirada` sem razão escrita, uma `viva` que não se rende, e
uma `retirada` que voltou.

As 39 sentinelas, por família e com o bloco que tirou a frase:

| n.º | família | bloco que a tirou |
|---|---|---|
| 6 | a régua da convergência (o rótulo, a lede e a definição do índice, nas duas edições) | saiu da primeira página até haver a página das regiões (Emenda 18; bloco A da auditoria de UI e UX, `696b51a`) |
| 2 | a leitura em voz alta do mapa | saiu com os pontos da primeira página (Emenda 20a e 20c) |
| 4 | a legenda dos dois estados do selo de proveniência | `46608f4` e a decisão do diretor de 27.08 (`ef8a78e`) |
| 8 | «o regulador» como nome da Direção-Geral das Autarquias Locais | item E11 do bloco dos 308 (`8b55bd3`) e o G5 da grelha da voz (`e470212`) |
| 13 | as ressalvas e os rótulos da página do concelho e das páginas de leitura | G6 da grelha da voz (`14a339d`) |
| 2 | o rótulo de cobertura «Com página» | bloco dos 308 (`44ef280`) |
| 2 | o grupo «Linhas sem concelho declarado» | bloco dos 308 (`44ef280`) |
| 2 | a forma longa da ausência, «Sem linhas ainda.» | item E4 do bloco dos 308 (`8b2a260`) |

**Uma frase `retirada` sai do mapa das classes.** Não está declarada: está
proibida. Se voltar, a régua vê-a como bloco **por classificar** e o portão diz
além disso o nome dela e a razão da retirada, as duas mensagens, porque são dois
factos.

## 4 · G3 · as dicas e os rótulos entram na varredura (I79)

Cinquenta cadeias distintas nas treze rotas inventariadas, 24 de navegação (os
comandos do cabeçalho e do rodapé, a descrição acessível dos quatro instrumentos,
a porta que salta para a linha de uma figura) e 26 de conteúdo (as dicas dos
valores da prova, cada uma a nomear o que se conta). A varredura passa de 582
para 632 frases distintas e de 16 523 para 25 263 ocorrências. **Nenhuma das 50
leva marcador**: as cinco dicas que diziam a maquinaria foram corrigidas à mão a
27.08, e o que este bloco acrescenta é a régua que impede que voltem.

## 5 · Os estragos plantados, e o que cada um provou

| estrago | régua | vermelho em |
|---|---|---|
| o mapa do telemóvel de volta à largura da coluna | `mapa-distritos.mjs` | M2·320e · tela 284 px numa janela de 320 |
| o nome da Ilha da Madeira retirado da lista da sua parcela | `mapa-distritos.mjs` | M1b e M2·390b · «sem rede: Ilha da Madeira 12px» (a caixa mede 257,5) |
| o mapa encolhido para 200 px | `mapa-distritos.mjs` | M1b e M2·320e |
| os nomes retirados das listas | `mapa-distritos.mjs` | M1b e M2·320b · 24 unidades sem rede a 1280, 29 a 320 |
| uma área com a cor de um estatuto | `mapa-distritos.mjs` | M5a e M5c |
| o `class` e o `viewBox` repetidos no cartão localizador | `mapa-distritos.mjs` | M9 |
| o destino de uma área trocado pelo de outra | `mapa-distritos.mjs` | M6a |
| uma linha morta deixada como `viva` | `check:voz` | INVENTARIO:121, «linha "viva" que não se rende em rota nenhuma» |
| uma frase `retirada` reposta na página de Évora | `check:voz` | duas vezes: «bloco por classificar» e «FRASE RETIRADA QUE VOLTOU A RENDER-SE», com a razão |
| a dica «itens da agenda atravessados do motor» reposta | `check:voz` | pelo nome e pelo marcador «atravess»; a gémea inglesa por «crossed into» |

## 6 · O que fica

* **A leitura cruzada do diff deste bloco está por fazer**, e o portão di-lo a
  cada construção: o registo das revisões marca `grelha-2` como `por ler`.
* **I83** (aberta por este bloco): o `aria-label` da porta de uma figura de uma
  página de leitura nomeia a chave interna da linha do motor
  («linha do motor: tc-year-1-2008»), que é o que a medida 6 da régua chama um
  localizador que nomeia um artefacto interno. A varredura das dicas expôs 34
  cadeias distintas desta forma, nas duas edições.
* **A §1.72 diz «19 das 29 chegam aos 44 px», e esse número é da caixa.** Fica
  corrigido aqui e na §1.73; o texto da §1.72 não se reescreve, porque é o registo
  do que se soube naquele dia.
