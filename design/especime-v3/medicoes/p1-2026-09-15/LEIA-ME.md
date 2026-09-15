# O relatório do bloco P1 · «O rodapé e a primeira página»

*15.09.2026, ramo `porta-2026-09-15`, sobre a cabeça `2ab86986`. A cabeça final é
a última do ramo.
Construtor: Claude Opus 5. Na forma do §3 do brief: a tabela do §1 com a medida
de cada item preenchida, a tabela das cadeias, o mapeamento dos domínios, os
commits, os portões, e o que fica para o lugar de direção. Sem travessões.*

**Este relatório tem duas datas.** A primeira redação fechou o bloco na cabeça
`feba0d69`; o lugar de direção leu as capturas e pediu **seis acertos de forma**,
que estão no §7 com o que cada um mediu. As palavras não mudaram com eles: a
tabela das cadeias é a mesma.

**O brief mudou a meio, às 16:35 UTC, por emenda do diretor**, e três coisas com
ele: o rótulo passa a dizer «segundo o Método» e não «segundo as regras da
casa»; o Sobre deixa de dizer de quem o sítio é e passa a dizer o que ele é; e
«a casa» deixa de ser o nome que o sítio se dá, em cadeia nenhuma escrita neste
bloco, porque em português casa é a habitação, que o sítio também mede. As
cadeias escritas antes da emenda foram corrigidas antes do primeiro commit.

## 1 · O mandato, item a item, com a medida

| # | a medida de aceitação | medido | onde está a saída |
|---|---|---|---|
| 1 | o rótulo novo em 100 % das páginas construídas das duas edições e o antigo em 0; «política da casa» e «regras da casa» a 0 em todo o `dist/`; «Nuno dos Santos» a 0 em todo o `dist/` | **7 240 de 7 240 páginas com o rótulo novo** (3 624 pt, 3 616 en; o antigo a 0 dos dois lados, contra 7 240 páginas com o antigo antes). «política da casa» **3 632 → 0**; «the house policy» **3 618 → 0**. «Nuno dos Santos» **7 251 → 2**, e as duas são a regra 9 do Método (`/metodo` e `/en/method`), que é texto governado: **a medida não se cumpre inteira, e a razão está no §5**. «regras da casa» **1 → 1**, e a que fica é do Método e não deste bloco («são regras da casa, como a primeira», na regra 5) | `contagens-antes.txt`, `contagens-depois.txt`; `rotulo.txt` (7 de 7 células) |
| 2 | «Diretor:» a 0 no `dist/`; «Publicação gratuita» a 1 na primeira página de cada edição | «Diretor:» **1 → 0**, «Director:» **1 → 0**; «Publicação gratuita» **1 em `/`** e «Free of charge» **1 em `/en`**, e em mais lado nenhum | `contagens-*.txt`; `rotulo.txt`, célula M5 |
| 3 | a frase a 1 em `/sobre` e `/en/about`; «Nuno dos Santos» a 0 em todo o `dist/`; nenhum rótulo «Diretor», «responsável editorial», «Director», «editorial responsibility» no `dist/` | a frase **0 → 1** em `/sobre` e **0 → 1** em `/en/about`. «responsável editorial» **3 629 → 0**; «editorial responsibility» **3 620 → 0**. O nome: ver o item 1 | `contagens-*.txt`; o portão de HTML compara a frase com o oráculo, carácter a carácter, em todas as páginas |
| 4 | nenhuma frase à vista acima ou abaixo do campo, medida a 390 e a 1 280; o axe a 0; o campo com nome acessível | **0 superfícies com uma frase à vista**, nas três superfícies × duas edições × duas larguras (12 medições): à volta do campo não há nada com mais de 1 px². O texto-fantasma é «Concelho» / «Municipality» e o nome acessível é o mesmo, num `<label>` de 1 px² (o que a classe `.vh` da casa dá). O **axe a 0** em todas as rotas e graus | `busca.txt` (saída 0); `alvos.txt`, célula H1; `porta.txt`, célula A21 |
| 5 | as quatro cadeias a 0 no `dist/`; o lugar do nome nunca vazio, medido nos três estados do mapa | as quatro a **0** («Toque num distrito ou numa ilha», «Passe o rato…», e as duas do concelho; as três ocorrências de «Passe o rato» que ficam são de um documento de estudo, que o §2 do brief não toca). O lugar diz **«Portugal · 308 concelhos»** nos três estados (com guião e mapa, com guião e sem mapa, e sem guião), e o 308 é a chave da prova `municipios_total`, com a sua porta | `porta.txt`, célula A22; `mapa-unidades.txt`, células U4 e U8a |
| 6 | dezoito linhas nas duas edições; cada contagem igual ao número de `hasClaim` verdadeiros das medidas mapeadas; «incluído em» e «e mais» a 0 | **18 linhas** em `/`, `/en`, `/dominios` e `/en/domains`; **0 em desacordo** com a declaração, nas duas edições, com a soma da declaração a **36**. «incluído em» **→ 0**, «included in» **→ 0**, «e mais» e «more» **0** no índice | `porta.txt`, células A23, A26 e A20; `leitura.txt`, célula J5 |
| 7 | três `<a>` que envolvem o cartão inteiro; «Todos os», «Toda a», «em curso», «edições» a 0 nesta secção; alvos a 44 px | **3 cartões, os três `<a>`, com 0 ligações lá dentro**, a 161, 161 e 111 px de altura a 390 (o teto é 44). As quatro palavras a **0** dentro de `<nav class="portas">`, nas duas edições | `porta.txt`, células A24 e A19; `alvos.txt` |
| 8 | «limiar» a 0 no texto visível do `dist/`; a régua `leitura.mjs` e as células do estado verdes | **0** nas seis rotas onde a palavra vivia (a primeira página, os dois quadros, o domínio, um concelho, uma área e uma linha), com uma exceção declarada: **1** em `/uniao-europeia` e **1** em `/en/european-union`, que é a definição do painel escrita pela própria Comissão («cada uma com o seu limiar indicativo»), citada com o documento e o excerto. No `dist/` inteiro ficam **18 ocorrências em 7 páginas** (pt) e **15 em 7** (en), todas em quatro famílias declaradas: o Método, as notas da agenda, os documentos de estudo e a definição do painel. «valor de referência» rende-se **2 240 vezes em 320 páginas** | `porta.txt`, célula A25; `contagens-depois.txt`; `leitura.txt` |
| 9 | as plantas a morder, com a saída no relatório | a régua da primeira página passa de **40 para 52 células**, todas verdes, com **25 estragos plantados**: **22 mordem**, e os 3 que não são os três que o F1.13 já registou como dívida da fatia `css-alcance-2026-09-16` (A15, A17 e A11). As cinco plantas novas mordem as suas células: A21, A22, A26, A19+A24 e A25 | `porta.txt`, a lista dos estragos no fim |
| 10 | as capturas em `design/especime-v3/capturas/p1-2026-09-15/`; a tabela completa | **60 capturas**: três páginas (a primeira, uma área e o Sobre) × duas edições × cinco larguras × dois momentos. A tabela tem **50 linhas**, todas as cadeias mudadas ou retiradas | `capturas-p1.mjs`; `cadeias-antes-depois.md` |

## 2 · O que saiu e o que entrou

**Este bloco acaba com menos texto visível do que começou, e a conta é esta:**

| onde | antes | depois |
|---|---|---|
| o rótulo de todas as páginas | 11 palavras e um nome | 8 palavras |
| a ficha da primeira página | 4 palavras e um nome | 2 palavras |
| o Sobre | as duas frases do diretor + a frase da política (37 palavras) | as duas frases do diretor + a frase do projeto (21 palavras) |
| a busca, no primeiro ecrã | um rótulo de 8 palavras + um botão | um botão (o nome do campo está dentro dele e em `.vh`) |
| o lugar do nome do mapa | uma instrução de 6 palavras | uma legenda de 3 palavras e um número |
| a linha de um domínio | nome + contagem + dois-pontos + cinco nomes de medida + «e mais cinco» | nome + contagem |
| cada porta | nome + contagem com substantivo + etiqueta com o nome da página | nome + número + seta |

**O que entrou, e a razão:** a frase do Sobre (item 3, no lugar de uma mais
longa), a linha de abertura da secção dos domínios (item 6, uma vez, a dizer o
que a lista é) e a legenda de repouso do mapa (item 5, no lugar de quatro
instruções). **E dezasseis linhas de domínio**, que são o item 6 inteiro: a
página cresceu 810 px a 390 por causa delas, e isso mede-se em
`blocos-a-390.txt`.

## 3 · O mapeamento dos domínios

36 medidas mapeadas, todas com `hasClaim` verdadeiro. A tabela inteira está em
`src/data/dominios.mjs` (`DOMINIO_DAS_MEDIDAS`), com a citação da carta ao lado
de cada grupo; aqui fica a soma e a porta de cada domínio.

**As contagens da Economia e do Trabalho mudaram com o acerto 6** (a decisão do
lugar de direção sobre as duas contradições da carta): o custo unitário do
trabalho passou de um para o outro, e a soma continua 36.

| # | domínio | medidas | a porta |
|---|---|---|---|
| 1 | Economia e finanças públicas | 13 | `/dominios/economia-e-financas-publicas` |
| 2 | Trabalho | 11 | `/dominios/economia-e-financas-publicas#m-t1` |
| 3 | População | 0 | (sem porta) |
| 4 | Migração | 0 | (sem porta) |
| 5 | Segurança social e pensões | 2 | `/uniao-europeia` |
| 6 | Água | 0 | (sem porta) |
| 7 | Educação | 3 | `/areas/educacao-ciencia-e-inovacao` |
| 8 | Saúde | 1 | `/areas/saude` |
| 9 | Habitação | 3 | `/areas/infraestruturas-e-habitacao` |
| 10 | Investimento | 1 | `/areas/economia-e-coesao-territorial` |
| 11 | Ciência, tecnologia e inteligência artificial | 1 | `/areas/educacao-ciencia-e-inovacao` |
| 12 | Espaço | 0 | (sem porta) |
| 13 | Infraestruturas e ferrovia | 0 | (sem porta) |
| 14 | Ambiente e sustentabilidade | 0 | (sem porta) |
| 15 | Cultura | 0 | (sem porta) |
| 16 | Segurança | 0 | (sem porta) |
| 17 | Justiça | 1 | `/areas/justica` |
| 18 | Governo e democracia | 0 | (sem porta) |

## 4 · Os commits e os portões

Vinte commits sobre `2ab86986`: doze da primeira redação (a fonte fechava em
`feba0d69`, e os últimos três traziam os documentos, as capturas e o registo dos
portões) e oito dos seis acertos e das três réguas que foram atrás deles.

Os três portões, cada comando no seu, com o código de saída escrito num ficheiro
por `echo $? > …` e lido de lá, e nunca de memória:

| portão | código |
|---|---|
| `npm run build` | **0** |
| `npm run verify` | **0** |
| `npm run typecheck` | **0** |

Corridos sobre `c97ae565`, que é a cabeça com tudo o que este bloco construiu;
o commit seguinte acrescenta só o registo dos portões, que nenhum deles lê. O
`portoes.txt` traz a cabeça da corrida, o caminho de cada ficheiro de código e
as últimas linhas de cada uma. E depois do último commit correu-se
`npm run build` outra vez, para o carimbo do `dist/` levar a cabeça final.

## 5 · O que fica vermelho, e porquê

Uma coisa, e não é um portão.

1. **«Nuno dos Santos» fica em duas páginas** (`/metodo` e `/en/method`), na
   regra 9 do Método. O `src/data/metodo.mjs` é um dos dois textos governados
   pela amarra das decisões, com o resumo carimbado numa entrada do
   `DECISIONS.md`, e as dez regras são a lista fechada do diretor: mudá-las é uma
   entrada nova em `DECISIONS.md` e uma emenda à constituição, que se escrevem do
   lugar de direção. O construtor não lhe tocou, e o `sha256` dele não mudou
   (`metodo 92b0fbdbc5fb`, como na cabeça de partida). **A medida do item 1 e a
   do item 3 não se cumprem inteiras por isto**, e é a primeira coisa para o
   lugar de direção decidir.
**A U5 e a J5 estavam vermelhas na primeira redação e ficaram verdes com os
acertos**, e nenhuma das duas por lhe terem mexido no tecto:

* a **U5** («a altura de `/` a 390 é igual ou menor do que a de partida»)
  passou porque o acerto 2 encolheu a página: 3 597 → **3 006 px**, abaixo dos
  3 263 px da árvore de partida. **O tecto não subiu.** A instrução do lugar de
  direção previa levantá-lo se as dezoito linhas não coubessem; couberam;
* a **J5** passou com o acerto 5, que é a própria emenda da célula.

**E ficam três estragos plantados que não mordem**, os mesmos que o F1.13
registou na I118 como dívida das réguas para a fatia `css-alcance-2026-09-16`:
a A15, a A17 e a A11. E duas células vermelhas em `tests/inicio/lista.mjs`, as
duas L8, que medem os dois painéis na primeira página, de onde eles saíram com
o item 8.16 do F1.10: também são dessa dívida, e são as mesmas duas que já
estavam vermelhas antes deste bloco.

## 6 · O que fica para o lugar de direção

1. **O nome na regra 9 do Método** (o §5): o item 1 e o item 3 pedem o nome a 0
   em todo o `dist/`, e ele fica em duas páginas. O lugar de direção disse que
   trata dela a seguir, com a entrada em `DECISIONS.md`.
2. **A menção da licença da Carta não saiu da superfície**, e é o único ponto do
   pedido dos seis acertos que não se fez. O acerto 4 mandava tirar as duas
   linhas de baixo do mapa; a primeira saiu, a segunda («Direção-Geral do
   Território · Carta Administrativa Oficial de Portugal (CAOP) 2025 · CC BY
   4.0») fica. É a única obrigação da licença CC BY 4.0 da Carta, a Emenda 20e
   decidiu-a com estas palavras («uma obrigação de licença não se cumpre por
   hiperligação») e `scripts/check-mapa.mjs`, regra r6(b), fecha a construção sem
   ela em todas as páginas que desenham um mapa. Tirá-la é uma decisão do
   diretor com o advogado.
3. **As duas contradições da carta foram decididas** pelo lugar de direção a
   15.09, e estão escritas em `src/data/dominios.mjs` com o critério (a
   atribuição mais específica ganha): o custo unitário do trabalho fica no
   Trabalho e as competências digitais na Educação. **A carta fica por emendar
   do lado que sobra.**
4. **Duas linhas do `quadro-institucional` que não são declaradas como medida em
   lado nenhum** (`credito-malparado-2025` e `indice-de-percepcao-da-corrupcao-2025`):
   existem no livro-razão, não estão nos dois quadros, não estão em
   `MEDIDAS_DO_DOMINIO_1` e nenhuma matéria de área as cobre. Não entram na
   contagem porque a porta do domínio não teria para onde abrir. A carta espera
   as duas (o §2 do domínio 17 nomeia o índice de perceção da corrupção).
5. **A altura da primeira página**: dezoito linhas de domínio custam 644 px a
   390 depois do acerto 2 (eram 939 antes dele), e a página fica 219 px acima da
   cabeça de partida. O diretor vê-o nas capturas.
6. **A frase de abertura dos domínios diz «este projeto»** e não «a casa», pela
   emenda das 16:35 UTC; o item 6 do brief escrevia «que a casa já publica». A
   regra 1 do brief é mais recente do que a linha do item, e foi ela que valeu.
7. **A palavra «casa» continua no Método e na secção da política** («A casa não
   aceita dinheiro de nenhuma entidade que mede», e mais quatro recusas): são
   cadeias que este bloco não escreveu, e a varredura delas é do P3.
8. **A leitura a frio e a leitura de língua** ainda não foram feitas: a entrada
   do `REVISOES-DO-INVENTARIO.md` nomeia o relatório e diz que elas se fazem
   antes da fusão.

## 7 · Os seis acertos da leitura das capturas

*Pedidos pelo lugar de direção depois de ler as capturas da cabeça `9a363dbb`.
Um commit cada. Nenhum mudou uma cadeia.*

| # | o que era | o que é, medido |
|---|---|---|
| 1 | a frase do projeto entrava por baixo do parágrafo do diretor e em cinzento, porque herdou a forma da frase da política que substituiu | é o **primeiro parágrafo** da página, com a classe `.lede` que o parágrafo seguinte já tem. O parágrafo do diretor não muda uma palavra nem muda de forma |
| 2 | a contagem encostada à direita (`flex: 1 1 18ch` no nome), a fila com 12 px de `padding` sobre um `min-height` de 44, e uma coluna em todas as larguras | o vão nome→contagem é de **10 px nas cinco larguras**; a fila tem a altura das listas da casa; a secção passou de **1 274,8 para 979,4 px** a 390 e a página de **3 597 para 3 006**; a partir de **768 px são duas colunas**, nove e nove, pela ordem da carta. Das dezoito linhas há **uma** que não cabe numa só a 390 e a 768, «Ciência, tecnologia e inteligência artificial», que tem 44 caracteres; a 1 024, 1 280 e 1 600 cabem as dezoito |
| 3 | a porta era uma grelha de três colunas que abaixo de 900 px virava uma coluna só, e o cartão media 161 px no telemóvel | os três cartões numa **fila só nas cinco larguras**, a **53 px** de altura (o alvo é 44) |
| 4 | duas linhas por baixo do mapa: a contagem dos concelhos e a menção da licença | a contagem passou para o lugar do nome («**Portugal · 308 concelhos ■ fonte**»), com a linha do livro-razão e a marca da fonte; a linha de baixo saiu. **A menção da licença fica**, e a razão está no §6 |
| 5 | a J5 exigia porta e estado a todos os dezoito domínios, e dois não têm medidas | exige-os a quem tem contagem, e exige o contrário a quem não tem; as portas são pedidas ao servidor. **26 de 26 células**, com uma planta nova para a metade nova |
| 6 | duas contradições da carta ditas e não decididas | decididas pelo critério da atribuição mais específica: o custo unitário do trabalho no **Trabalho**, as competências digitais na **Educação**. Economia 14 → **13**, Trabalho 10 → **11**, soma **36** |

**E três réguas foram atrás do que mudou**, porque mediam coisas que deixaram de
existir: a sonda da L12 de `lista.mjs` procurava a linha que saiu de baixo do
mapa e devolvia `null` (seis células caíam por não encontrar nada); a peneira da
I11 de `indice.mjs` só via `data-prova` e `data-nonledger`, e a contagem dos
concelhos passou a ser uma linha do livro-razão; e a planta do valor selado da
J5 procurava `<ol class="dominios-lista">` à letra, que ganhou um `style`.

---

# As medições, como saíram das réguas

*15.09.2026, ramo `porta-2026-09-15`. Estes ficheiros são as SAÍDAS das réguas e
dos portões, tal como elas as escreveram, e entram no ramo pela mesma razão que
os do F1.13: um relatório que cita um número sem a saída ao lado pede confiança
em vez de a merecer.*

**Nada aqui foi editado à mão.** O que se lê é o que o comando imprimiu, com as
sequências de cor do terminal tiradas (`sed 's/\x1b\[[0-9;]*m//g'`), que é o que
as torna legíveis num diff.

| ficheiro | o que é, e o comando que o escreveu |
|---|---|
| `contagens.mjs` e `contagens-antes.txt` / `contagens-depois.txt` | as medidas de aceitação que são contagens sobre o `dist/` inteiro, nas duas construções. `OEDP_DIST=<antes> node …/contagens.mjs` |
| `busca.mjs` e `busca.txt` | a busca a 390 e a 1 280 nas três superfícies e nas duas edições: o que está à vista à volta do campo, o texto-fantasma e o nome acessível (item 4). `node …/busca.mjs` |
| `blocos-a-390.mjs` e `blocos-a-390.txt` | a altura da primeira página a 390, bloco a bloco, antes e depois. `node …/blocos-a-390.mjs <dist-antes> <dist-depois>` |
| `capturas-p1.mjs` | o guião das 60 capturas, com a rota de cada nome declarada. `node …/capturas-p1.mjs --momento=antes\|depois` |
| `porta.txt` e `porta.json` | as 52 células da régua da primeira página e os 25 estragos plantados. `node tests/inicio/porta.mjs --vermelhos` |
| `mapa-unidades.txt` | as 34 células do mapa das unidades. `node tests/inicio/mapa-unidades.mjs` |
| `lista.txt` | as 94 células da lista dos nomes. `node tests/inicio/lista.mjs` |
| `leitura.txt` | as 26 células da leitura breve. `node tests/inicio/leitura.mjs` |
| `faixa.txt` | as 80 células da faixa. `node tests/inicio/faixa.mjs` |
| `rotulo.txt` | as 7 células do rótulo de IA. `node tests/inicio/rotulo.mjs` |
| `indice.txt` | as células do índice do livro-razão, com a I11 refeita. `node tests/livro/indice.mjs --navegador` |
| `alvos.txt` | os alvos de toque e o axe. `node tests/acessibilidade/alvos.mjs` |
| `check-lugar.txt` | os tetos do `check:lugar`. `npm run check:lugar` |
| `portoes.txt` | os três portões e os códigos de saída lidos dos ficheiros |
| `cadeias-antes-depois.md` | a tabela do item 10: toda a cadeia mudada ou retirada, com o antes e o depois nas duas edições |

**O «antes» é a construção da cabeça `2ab86986`**, que é a cabeça de que este
bloco partiu, e não uma memória: onde há um antes e um depois, os dois lados
foram medidos pela mesma régua sobre as duas construções, e o comando está na
linha do ficheiro.

**As células vermelhas que ficam, e a razão de cada uma**, estão no §5 do
relatório. Nenhuma delas é um portão: os três portões estão a 0 na cabeça final,
com os códigos de saída lidos de ficheiros em `portoes.txt`.
