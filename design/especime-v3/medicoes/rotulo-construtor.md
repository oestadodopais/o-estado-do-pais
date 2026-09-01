# O rótulo de IA em todas as páginas · relatório do construtor

*Escrito a 01.09.2026 por Claude Opus 5, ramo `rotulo-ia-2026-09-01`, saído de
`main` `b097d20`, contra `design/observatorio/ORDEM-rotulo-2026-09-01.md` e
`design/observatorio/BRIEF-divulgacao-via-B.md`. Nada fundido, nada empurrado.
Sem travessões na prosa nova.*

*Segunda passagem, no mesmo dia e no mesmo ramo: a leitura a frio do Codex, com
três plantas e a apanhá-las às três, achou dez defeitos reais, e o mais grave era
que o oráculo do portão era o ficheiro que ele conferia. Os dez estão consertados,
e o que eles mudaram está escrito no sítio de cada número, com a §11 a dizer o
que mudou e porquê.*

## 0 · O que fica feito, em cinco linhas

* **O rótulo rende em 6 590 das 6 590 páginas construídas** das duas edições, no
  rodapé, mais **8 no topo das páginas de leitura**, que são texto longo. Os 16
  documentos de estudo alojados ficam de fora por desenho (§1.19) e levam o
  rótulo na página que os embrulha. O `gate:html` ganhou a regra que fecha a
  construção a uma página sem ele ou com ele errado, e o seu oráculo é um
  ficheiro que o sítio não importa: vinte estragos plantados, todos vermelhos.
* **A secção da política entra em `/metodo`** nas duas edições (a via, o que sai
  sem o diretor, os quatro lugares e as cinco recusas), e a frase da política
  entra no Sobre e no Método. As duas cadeias aprovadas pelo diretor são
  comparadas carácter a carácter pelo portão, como o texto do Sobre já era.
* **A primeira página de cada edição passa a dizer o nome do diretor e que a
  publicação é gratuita**, que é o artigo 15.º, n.º 1 da Lei de Imprensa. A
  leitura que se fez de «primeira página de cada edição» está escrita, e é
  desfazível numa linha.
* **Os dados estruturados dizem a geração por IA com um termo que existe**:
  `digitalSourceType` com `TrainedAlgorithmicMediaDigitalSource`, lidos na fonte
  em schema.org, em 648 páginas.
* **Contraste medido no navegador**: 6,24:1 em claro e 9,52:1 em escuro para a
  linha do rótulo, 16,39:1 e 15,38:1 para a porta da política. O mínimo é 4,5:1.
  **Nenhum número novo no sítio**: o inventário do livro-razão é o mesmo antes e
  depois, e o `ledger/` não foi tocado.

## 1 · Os commits

Quatro commits de código, mais o que traz este relatório, que não pode conter o
seu próprio resumo.

| commit | o quê |
| --- | --- |
| `fe2ab5b` | a política da casa e o rótulo de IA em todas as páginas |
| `06fb12c` | os dados estruturados dizem a geração por IA |
| `cea6167` | a régua do rótulo, com sete células e sete estragos plantados |
| `2b8e774` | os travessões saem da prosa nova deste bloco |

O quarto é uma reparação minha: escrevi vinte e um travessões contra a regra do
projeto, nos comentários e em três cadeias de saída da régua, e saem todos. O
«—» das colunas «razão» do inventário fica, porque é o marcador de «sem razão
escrita» que todas as linhas daquele ficheiro já usam.

`git add` sempre com caminhos explícitos, nunca `-A` nem `.`. Os dois trailers
em todos. **`DECISIONS.md` não foi tocado**, `ledger/` não foi tocado,
`src/data/metodo.mjs` e `src/data/sobre.mjs` não foram tocados (são os dois
textos governados pela amarra das decisões, e mexer-lhes obriga a uma entrada
nova no `DECISIONS.md`, que é do lugar de direção), `public/` não foi tocado, a
identidade não foi tocada, o motor não foi tocado.

`npm run build`, `npm run verify` e `npm run typecheck` correram a **0** no
estado de cada um dos quatro commits de código. O quinto acrescenta este
ficheiro, que nenhum passo da cadeia lê: a corrida que provou o quarto provou a
árvore em que ele entra, ficheiro a ficheiro.

## 2 · Ficheiro a ficheiro

### 2.1 · O que nasceu

| ficheiro | o que é |
| --- | --- |
| `src/data/politica-ia.mjs` | o texto governado deste bloco: o rótulo em três pedaços, a frase da política, a ficha da primeira página, a secção da política, o nome de quem responde e o termo do schema.org |
| `src/components/RotuloDeIA.astro` | o bloco, com as três marcas que as réguas leem |
| `tests/inicio/rotulo.mjs` | a régua: sete células, sete estragos plantados |

**Porque é que o texto não entra em `src/data/metodo.mjs`.** Aquele ficheiro e o
`src/data/sobre.mjs` são os dois textos governados pela amarra das decisões
(`scripts/check-ledger.mjs`): o resumo sha256 de cada um está carimbado numa
entrada do `DECISIONS.md`, e mudar um byte fecha a construção até haver uma
entrada nova. Escrever essa entrada é do lugar de direção e não do construtor,
e por isso o texto novo vive num ficheiro seu, com a mesma disciplina de
comparação. **Se a direção quiser trazê-lo para dentro da amarra, é uma linha em
`TEXTOS` e `NOMES_ACEITES` de `check-ledger.mjs` mais a entrada do
`DECISIONS.md`; fica como pergunta na §7.**

### 2.2 · O que mudou

| ficheiro | o quê |
| --- | --- |
| `src/components/SiteFooter.astro` | rende o rótulo dentro do `<footer>`, depois da navegação |
| `src/views/TextoView.astro` | o rótulo no topo da página de leitura, e `digitalSourceType` |
| `src/views/SobreView.astro` | a frase da política e a porta para a secção |
| `src/views/MetodoView.astro` | a secção da política, e a sua entrada no sumário |
| `src/views/EstudoView.astro`, `src/views/MunicipioView.astro` | `digitalSourceType` |
| `src/styles/site.css` | as regras do rótulo, da frase e da secção |
| `scripts/gate-html.mjs` | a regra nova, com quatro conferências mais três |
| `scripts/check-lingua.mjs` | L9, com o mínimo positivo |
| `design/especime-v3/INVENTARIO-FRASES.md` | as quatro cadeias novas, com a razão da classe |
| `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md` | a entrada do bloco, `por ler` |

**O que o rodapé perde e o que ganha, dito por extenso.** A §1.39 tirou do
rodapé a linha de autoria, «Escrito por IA, dirigido por uma pessoa», porque era
«uma declaração dita de passagem, no sítio onde ninguém lê». Essa continua fora e
não volta. O que entra é outra coisa: uma divulgação obrigatória, cuja lei diz
onde tem de estar. Vive **dentro** do `<footer>` e não antes dele como a porta
das correções, porque um `<footer>` é o `contentinfo` da página e a autoria é o
que um leitor de ecrã espera encontrar ao saltar para esse marco. A navegação
continua a ser navegação e mais nada: o rótulo é irmão dela, não um item da
lista. **É uma decisão de composição, e o lugar de direção pode desfazê-la numa
linha.**

## 3 · As contagens, antes e depois

Todas lidas da saída dos portões, na construção de `b097d20` e na do estado
final do ramo.

### 3.1 · O que não podia mudar, e não mudou

| | antes | depois |
| --- | ---: | ---: |
| ficheiros `.html` em `dist/` | 6 606 | 6 606 |
| páginas construídas pelo Astro | 6 590 | 6 590 |
| documentos de estudo alojados | 16 | 16 |
| afirmações citadas fora do livro-razão | 2 583 / 2 602 | 2 583 / 2 602 |
| páginas de linha | 5 204 | 5 204 |
| **números marcados nas páginas** | **13 320** | **13 320** |
| chaves da prova reconferidas | 85 | 85 |
| cartões de partilha | 580 | 580 |
| linhas do `ledger/` tocadas | | **0** |

O inventário do livro-razão é o mesmo à unidade. **Nenhum número novo entrou no
sítio, e nem sequer um algarismo declarado**: a primeira passagem escrevia os
nomes dos modelos com a versão e marcava-os `identificador-tecnico`; a segunda
tirou-lhes as versões (§11, achado 8), e por isso não há uma única marca nova de
algarismo neste ramo. As cadeias novas não trazem um algarismo.

### 3.2 · O que cresceu, e porquê

| | antes | depois | diferença |
| --- | ---: | ---: | ---: |
| rótulos no rodapé | 0 | **6 590** | +6 590 |
| rótulos no topo (páginas de leitura) | 0 | **8** | +8 |
| fichas da primeira página | 0 | **2** | +2 |
| frases da política rendidas | 0 | **4** | +4 |
| ligações internas conferidas | 278 568 | 285 170 | +6 602 |
| das quais âncoras | 45 177 | 51 779 | +6 602 |
| frases distintas da casa (`check:voz`) | 701 | **705** | +4 |
| ocorrências de frases da casa | 30 123 | 31 503 | +1 380 |
| linhas do inventário com bloco | 582 | **620** | +38 |
| das quais vivas | 506 | 544 | +38 |
| ocorrências da classe `divulgacao` | 0 | **1 388** | +1 388 |
| autorreferência, em todas as rotas medidas | 0 | **0** | 0 |
| páginas com o termo do schema.org | 0 | **648** | +648 |

As 6 602 âncoras novas são a porta da política, e a soma fecha à unidade: 6 590
no rodapé, 8 no topo das páginas de leitura, 2 no Sobre (a porta para a secção) e
2 no sumário do Método (a entrada da secção nova). As 1 380 ocorrências novas de
frases da casa são a cadeia do rótulo nas 1 378 rotas inventariadas mais as duas
fichas da primeira página; as 1 388 da classe `divulgacao` são essas mais os oito
rótulos do topo das páginas de leitura. As 38 linhas do inventário são as quatro
do rótulo e da ficha mais as trinta e quatro da política publicada (§6.3).

### 3.3 · O que L9 conta, do seu lado

**6 600 nomes de quem responde** (3 304 na edição portuguesa, 3 296 na inglesa),
todos com a marca de língua certa, e **6 598 linhas de rótulo na língua da
página**. As duas contas batem certo com a do portão: 6 590 rodapés + 8 topos =
6 598 linhas, e mais as 2 fichas dá 6 600 nomes.

## 4 · Os contrastes, medidos

Duas medições independentes, e as duas estão aqui porque medem coisas
diferentes.

**A régua das fichas** (`node scripts/medir-contraste.mjs`, sobre
`src/styles/tokens.css`) mede o par que a folha declara:

| par | uso | claro | escuro | mínimo |
| --- | --- | ---: | ---: | ---: |
| `muted` / `paper` | a linha do rótulo e a ficha | **6,24:1** | **9,52:1** | 4,5:1 |
| `ink` / `paper` | a porta da política | **16,39:1** | **15,38:1** | 4,5:1 |

**A régua do rótulo** (`node tests/inicio/rotulo.mjs`, célula M2) mede a cor
computada na página, contra o primeiro antepassado com fundo opaco, nas duas
edições e nos dois temas. É a medição que conta, porque mede o que a folha de
facto aplica e não o que ela declara:

| tema · edição | o texto do rótulo | a porta da política |
| --- | ---: | ---: |
| claro · pt | **6,24:1** | **16,39:1** |
| claro · en | **6,24:1** | **16,39:1** |
| escuro · pt | **9,52:1** | **15,38:1** |
| escuro · en | **9,52:1** | **15,38:1** |

Os dois números batem certo, o que é a prova de que o rótulo usa os pares da
casa e não uma cor sua. **O corpo não desceu abaixo do mínimo da casa**, e isso
custou uma correção medida: a primeira versão escreveu a ficha da primeira
página a 11px, e a régua A9 de `tests/inicio/correcoes-a.mjs` fechou vermelha
nas duas edições com «11px span. "Nuno dos Santos"». O chão de 12px na rota
`home` é dessa régua, e a regra escrita em B10 de `site.css` diz que toda a
classe abaixo de 12px tem de aparecer na lista das excepções de 640: em vez de
acrescentar uma excepção, a ficha passou a declarar 12px.

## 5 · As regras novas, e os estragos que as provaram

### 5.1 · A regra do portão (`scripts/gate-html.mjs`)

**O ORÁCULO É UM FICHEIRO QUE O SÍTIO NÃO IMPORTA.** A primeira passagem
comparava a página com `src/data/politica-ia.mjs`, que é o mesmo ficheiro de onde
a página sai, e uma comparação assim não compara nada: mudar a cadeia muda a
saída e a expectativa ao mesmo tempo. A leitura a frio provou-o com uma planta
que tirava o «the» de «under the house policy», e ela passava verde. O oráculo é
agora `scripts/textos-aprovados.json`, copiado da ordem de construção §3, lido só
pelo portão e que nenhum ficheiro de `src/` importa. **E a comparação é exata**:
sem colapsar espaços e sem aparar as pontas, porque um espaço a mais numa
divulgação obrigatória é uma diferença e não um detalhe de composição.

Em cada bloco de rótulo, no rodapé **e no topo** (a primeira passagem conferia o
topo só pela contagem do marcador, e uma página de leitura com o rótulo de outra
língua passava):

1. **diz o texto aprovado**, carácter a carácter, na língua da edição;
2. **a porta abre a política**, uma vez, e as palavras ligadas são exactamente
   «a política da casa» / «the house policy»: uma ligação com o texto errado é
   outra promessa;
3. **o nome de quem responde** aparece uma vez na linha e uma vez na ficha,
   nenhuma solta, com o texto certo e com `lang="pt-PT"` próprio nas páginas
   inglesas e sem marca nenhuma nas portuguesas;
4. **vê-se**: nem `hidden`, nem `aria-hidden="true"`, nem `.vh`, nem um `style`
   em linha com `display:none` ou `visibility:hidden`, nele ou num antepassado.

E, à volta deles:

5. **existe, uma vez** · exactamente um bloco de rodapé por página construída, e
   **dentro de um `<footer>` de verdade**: a conferência é de antepassado e não
   do nome da classe, porque é a pertença ao `contentinfo` que faz a linha ser
   encontrada por quem salta para esse marco;
6. **o topo** · exactamente um nas páginas de leitura, e zero em todas as outras;
7. **a ficha** · exactamente uma na primeira página de cada edição, e zero nas
   outras, com a cadeia conferida contra o oráculo;
8. **a frase da política** · uma no Sobre e uma no Método, e zero nas outras,
   comparada com o oráculo, **e com a marca da edição igual à da rota**: a
   primeira forma comparava a frase com a língua que o próprio atributo
   declarava, e uma frase inglesa numa página portuguesa passava por estar
   declarada inglesa;
9. **a língua da página é uma condição** · um `<html lang>` ausente ou que a
   tabela de rotas não conheça é vermelho. A primeira forma escrevia
   `else if (linguaPagina)`, e uma página sem língua saltava a conferência
   inteira em silêncio, que é o modo mais barato de a desligar.

E as conferências que correm uma vez, sobre os ficheiros e não sobre as páginas:
o nome de quem responde tem de ser, carácter a carácter, um dos pedaços
`{ forte: … }` das dez regras de `src/data/metodo.mjs` **e** o do oráculo; e o
rótulo composto, as palavras ligadas, a frase e a ficha de
`src/data/politica-ia.mjs` têm de ser os do oráculo. Sem este segundo braço, o
oráculo e o ficheiro que rende podiam divergir sem que nada o dissesse.

**O LIMITE, DITO E NÃO ESCONDIDO.** É um portão estático: lê o HTML e não corre
folhas de estilo. Uma regra de CSS que esconda `.rotulo-ia` numa folha passa por
aqui, e quem a apanha é a régua do navegador (`tests/inicio/rotulo.mjs`, célula
M1, com o estrago plantado que a prova). O que este portão fecha é a ocultação
escrita no próprio documento.

**Os vinte estragos plantados** (dezassete em `dist/`, três no ficheiro de dados),
com o portão verde antes, o `sha256` do ficheiro antes e depois, e o ficheiro
reposto e reconferido pelo `sha256` no fim. O portão correu verde no fim das duas
corridas, com tudo reposto.

Os oito da primeira passagem:

| estrago | onde | o que o portão disse |
| --- | --- | --- |
| o rótulo do rodapé retirado | uma página de linha | «esta página tem 0 rótulo(s) de IA no rodapé; tem de ter exactamente um» |
| uma palavra trocada no texto aprovado | a mesma | «o rótulo de IA não é o texto aprovado» |
| a porta a abrir o Método sem a âncora | a mesma | «não tem a porta para a política ("/metodo#politica-de-ia")» |
| o rótulo escondido com `aria-hidden` | a mesma | «está escondido por aria-hidden="true" […] o n.º 5 do artigo 50.º pede-o "de forma clara e percetível"» |
| o nome de quem responde trocado | a mesma | «um "data-rotulo-nome" diz "Outra Pessoa" e o responsável editorial é "Nuno dos Santos"» |
| a ficha injectada fora da primeira página | uma página de linha inglesa | «esta página tem 1 ficha(s) da primeira página e devia ter 0» |
| a frase da política reescrita | `/sobre` | «a frase da política não é o texto aprovado» |
| o nome do responsável trocado no ficheiro de dados | `src/data/politica-ia.mjs` | «o responsável editorial é "Nuno Santos" e nenhuma das dez regras do Método imprime esse nome» |

E os doze da segunda, que são os que a leitura a frio obrigou a poder existir:

| estrago | onde | o que o portão disse |
| --- | --- | --- |
| **o «the» tirado das palavras ligadas** (a planta do Codex, que passava) | uma página de linha inglesa | «o rótulo de IA (rodape) não é o texto aprovado» |
| as palavras ligadas trocadas, com a porta certa | uma página de linha | «a porta da política diz "o método da casa" e as palavras ligadas têm de ser "a política da casa"» |
| o rótulo do rodapé posto fora do `<footer>` | a mesma | «o rótulo de IA do rodapé não está dentro de um "<footer>"» |
| um `style` em linha com `display:none` | a mesma | «está escondido por style="display:none"» |
| a marca de língua tirada do nome numa página inglesa | uma página de linha inglesa | «tem de levar lang="pt-PT" e leva "(nenhum)"» |
| a marca de língua posta no nome numa página portuguesa | uma página de linha | «não leva marca de língua nenhuma e leva lang="en"» |
| o `<html lang>` apagado | a mesma | «esta página não diz a sua língua num "<html lang>" que a casa conheça» |
| a frase da política declarada da outra edição | `/sobre` | «"data-frase-da-politica=en" e a página é da edição "pt"» |
| **o texto do rótulo do TOPO mudado** | uma página de leitura | «o rótulo de IA (topo) não é o texto aprovado» |
| **a porta do rótulo do TOPO a apontar para outro sítio** | a mesma | «o rótulo de IA (topo) tem 0 porta(s) para a política» |
| **uma vírgula a menos na frase da política**, no ficheiro que rende | `src/data/politica-ia.mjs` | «a frase da política da edição "pt" não é o texto aprovado» |
| o «the» tirado das palavras ligadas, no ficheiro que rende | o mesmo | «as palavras ligadas da edição "en" são "house policy" e o oráculo diz "the house policy"» |

Os três do ficheiro de dados foram repostos com o `sha256` conferido igual ao
original antes de qualquer construção.

### 5.2 · L9 do portão da língua (`scripts/check-lingua.mjs`)

O nome de quem responde é um nome português nas duas edições, e vale-lhe a regra
da §1.82 aplicada a um nome de pessoa: **um nome não se traduz, e diz em que
língua está**. Sem marca, uma página inglesa manda um leitor de ecrã ler «Nuno
dos Santos» com fonética inglesa, e é o nome de quem responde pela publicação.
A conferência é **nos dois sentidos**, como L4d e L4e: numa página portuguesa o
nome está na língua da página e não leva marca própria; numa página inglesa leva
a sua. E a **linha** do rótulo leva a língua da página, porque o nome é a única
coisa do bloco que está noutra língua.

**Os cinco estragos plantados**, os três primeiros numa cópia de `dist/`
(`OEDP_DIST`), com o `sha256` de cada ficheiro reposto e conferido, e os dois
últimos sobre a cópia inteira, reposta e comparada com `dist/` por `diff -rq`
sem uma diferença:

| estrago | resultado |
| --- | --- |
| a marca de língua tirada de um nome numa página inglesa | «esperava lang="pt-PT" e a língua efectiva é "en"» |
| a marca de língua **posta** num nome numa página portuguesa | «marca a mais: está na língua da página e a língua efectiva é "en"» |
| um ancestral a impor `lang="fr"` à linha do rótulo | «a linha do rótulo lê-se em "fr" e a página é "pt-PT"» |
| toda a marca do nome tirada da edição inglesa da cópia (3 293 ficheiros) | o mínimo positivo: «viu 3 304 nome(s) em "pt" e 0 em "en"» |
| a classe da linha renomeada em toda a cópia (6 590 ficheiros) | o segundo mínimo positivo: «não viu uma única linha de rótulo» |

Os dois últimos são a lição da leitura cruzada de 29.08: uma conferência que
passa em vazio não prova nada, e o mínimo sai do que o sítio tem e não de um
número escrito.

### 5.3 · A régua do rótulo (`tests/inicio/rotulo.mjs`)

Sete células, medidas em Chromium sem cabeça sobre `dist/`, **7 de 7 verdes**. O
que ela mede é o que só um navegador sabe; a contagem do sítio inteiro é do
portão e não se repete aqui.

| célula | o que mede | o que mediu |
| --- | --- | --- |
| M1 | área e texto aprovado em oito páginas, quatro por edição | 8 páginas, 0 más |
| M2 | o contraste nos dois temas | a tabela da §4 |
| M3 | a porta abre a secção da política | `/metodo#politica-de-ia` e `/en/method#politica-de-ia`, as duas com área |
| M4 | o alvo de toque a 390 | 44,0px de altura, a linha acaba em 372,0 de 390 |
| M5 | a ficha do artigo 15.º só nas duas primeiras páginas | 2 fichas em 8 páginas |
| M6 | o rótulo do topo vem inteiro antes do documento, nas duas edições | 2 páginas de leitura em 2 edições (a primeira forma aceitava «pelo menos uma») |
| M7 | o rótulo está completo no HTML servido, sem script | as duas edições |

**O corredor corre a suite INTEIRA por planta** (segunda passagem). A primeira
forma corria só as células que a planta declarava, e é uma peneira furada nos
dois sentidos: um estrago que estrague uma célula que ele não declara nunca é
apanhado, porque a célula não chega a correr. A leitura a frio apanhou-o com dois
casos reais, e as duas declarações foram corrigidas para dizerem a verdade em vez
de se calarem. O corredor imprime «verde antes» antes de plantar o que quer que
seja, e exige as três coisas: cada alvo declarado casa com uma célula corrida,
todas as que a planta nomeia ficam vermelhas, e **todas as outras ficam
verdes**.

**Os sete estragos plantados**, com a declaração corrigida e medida:

| estrago | célula | o que ela disse |
| --- | --- | --- |
| o rótulo do rodapé retirado | M1, M2, M3, M4, M5, M7 | tira a linha, a porta, o nome e a ficha de uma vez; a declaração antiga dizia só M1 |
| o rótulo escondido por uma folha | M1, M4, M6 | `display:none` põe a caixa a zero, e com ela o alvo de toque e o rótulo do topo; a cor computada não muda, e M2 fica verde |
| a cor posta no fio de arrumação | M2 | 1,28:1 em claro e 1,67:1 em escuro |
| a porta a abrir o Método sem a âncora | M3 | «abre "/metodo" e devia abrir "/metodo#politica-de-ia"» |
| o alvo de toque reduzido a uma linha de texto | M4 | 20,9px de altura |
| a ficha injectada fora da primeira página | M5 | 8 fichas em 8 páginas |
| o rótulo do topo empurrado para depois do documento | M6 | «acaba em 100 031px e o documento começa em 290px» |

## 6 · As leituras que se fizeram

### 6.1 · A «primeira página de cada edição» (Lei de Imprensa, artigo 15.º, n.º 1)

O texto, tal como `design/observatorio/DILIGENCIA-LEGAL.md` §2.1 o cita da Lei
n.º 2/99 consolidada: «As publicações periódicas devem conter, na primeira
página de cada edição, o título, a data, o período de tempo a que respeitam, o
nome do director e o preço por unidade ou a menção da sua gratuitidade.»

**A leitura, escrita para poder ser desfeita:** «a primeira página de cada
edição» lê-se como a página inicial de cada uma das duas edições construídas,
`/` e `/en`. Num sítio em atualização contínua não há números de edição, e a
página inicial é a que faz o papel da primeira página de um jornal. O título e a
data já lá estavam; o que faltava eram o nome do diretor e a menção de
gratuitidade, e vão numa linha só, no rodapé, na letra do instrumento.

**O que esta leitura não decide.** A pergunta de fundo, se a casa é sequer uma
publicação periódica no sentido do artigo 9.º, é a primeira das perguntas para o
advogado (§3 da diligência) e não é desta ordem. Cumprir o artigo antes da
resposta não custa nada e não decide nada: se ele ler «primeira página» de outra
maneira, a condição está num sítio só (`RotuloDeIA.astro`) e a linha passa a
render onde ele disser.

### 6.2 · O schema.org, lido na fonte a 01.09.2026

A medida de aceitação 4 diz «só se o vocabulário do schema.org, lido na fonte,
tiver uma propriedade que diga a geração por IA sem inventar; senão nada se
acrescenta e o relatório diz que se procurou e o que se encontrou». **Procurou-se
e encontrou-se.**

O que se leu, e por que ordem:

1. **`https://schema.org/CreativeWork`**, a lista inteira das propriedades:
   nenhuma nomeia IA, geração automática ou média sintética na sua descrição.
   `creativeWorkStatus` é «the status of a creative work in terms of its stage in
   a lifecycle»; `creator`, `author` e `producer` são pessoas ou organizações;
   `sdPublisher` é de quem gera a marcação estruturada e não o texto. **Nenhuma
   delas serve, e usar uma delas seria inventar um sentido que ela não tem.**
2. **`https://schema.org/docs/full.html`**, a hierarquia inteira, à procura de
   «AI», «Artificial», «Synthetic», «Generated», «Machine» e «Digital Source».
   Devolveu uma família: `IPTCDigitalSourceEnumeration`, com dezassete membros.
3. **`https://schema.org/IPTCDigitalSourceEnumeration`**: «IPTC "Digital Source"
   codes for use with the digitalSourceType property, providing information
   about the source for a digital media object.»
4. **`https://schema.org/digitalSourceType`**: «Indicates an
   IPTCDigitalSourceEnumeration code indicating the nature of the digital
   source(s) for some CreativeWork.» Usa-se em `CreativeWork`, e por isso em
   `Article`, que dela herda; conferido na tabela «Properties from CreativeWork»
   de `https://schema.org/Article`.
5. **`https://schema.org/TrainedAlgorithmicMediaDigitalSource`**: «Content coded
   as "trained algorithmic media" using the IPTC digital source type
   vocabulary.»
6. **`http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia`**,
   o vocabulário de que aquilo é o eco, para saber o que o termo quer dizer e
   não o que ele parece: o nome é «Created using Generative AI» e a definição é
   «Digital media created algorithmically using an Artificial Intelligence model
   trained on captured content». **É exactamente o que este sítio é.**

**O que se decidiu.** Acrescentar `digitalSourceType` com
`TrainedAlgorithmicMediaDigitalSource` aos três blocos `Article` do sítio: a
página de um estudo, a página de leitura e a página de um concelho. São 648
páginas construídas. O JSON-LD `Organization` do invólucro não leva nada, porque
a propriedade é de uma obra e não de uma entidade.

**O que fica dito, e é a parte honesta.** As duas estão na área «new» do
vocabulário, na versão 30.0 de 19.03.2026, e a própria página o diz: são termos
publicados por schema.org, ainda em desenvolvimento, que podem mudar de
definição. Não são inventadas por esta casa, que era a condição.

**E o valor vai como `@id`, o que também foi medido e não suposto.** O contexto
JSON-LD de schema.org (`https://schema.org/docs/jsonldcontext.jsonld`, descarregado
e lido) declara `digitalSourceType` como `{"@id": "schema:digitalSourceType"}` e
**não** como `@type: @vocab`. Uma cadeia solta, que é a forma que se vê por aí,
seria lida como um literal de texto e não como o termo do vocabulário;
`{ "@id": "https://schema.org/TrainedAlgorithmicMediaDigitalSource" }` é a única
forma que resolve no termo.

### 6.3 · A classe das cadeias novas: `divulgacao`, e é uma classe nova

A primeira passagem pôs as quatro cadeias do rótulo em `navegacao`, com a razão
escrita, e a leitura a frio recusou-a. **Tinha razão: era a classificação a
torcer-se para caber.** As três classes do inventário respondem à pergunta da
Emenda 15 (conteúdo é o que a coisa medida é, navegação é o que leva a outro
sítio, autorreferência é o método, a verificação, a honestidade, a cobertura ou
as intenções do próprio sítio), e uma divulgação obrigatória não é nenhuma
delas: **está na página porque a lei a põe lá, e sairia no dia em que a lei
mudasse**.

A segunda passagem abre `divulgacao` em `scripts/voz.mjs` e em
`scripts/medir-defeitos.mjs`, e a razão fica escrita nos dois e no inventário.
Entram nela as duas cadeias do rótulo, as duas da ficha do artigo 15.º e as
trinta e duas da política publicada que o rótulo aponta; as duas cabeças de
secção ficam em `navegacao`, porque nomeiam um lugar da página como qualquer
outro nome de secção.

**A Emenda 15 não se enfraquece com ela, e o `check:voz` continua a ser quem o
impõe**: `autorreferencia` vai a ZERO em todas as rotas medidas, medido em cada
construção. A distinção entre as duas está escrita nos três sítios onde ela tem
de ser lida: a autorreferência existe **para mostrar diligência**, a divulgação
existe **porque alguém tem de saber quem responde**, e uma frase de divulgação
que comece a explicar porque se deve confiar na casa é autorreferência com outro
nome, que não passa por mudar de coluna.

**As trinta e quatro cadeias da secção da política também entram**, e isso pediu
uma segunda coisa. A secção vive em `/metodo` e a frase vive também no Sobre, e
nenhuma das duas rotas é medida (a Emenda 15 isenta o Método e o Sobre da
contagem). A régua usava a mesma lista para duas perguntas diferentes, e a
segunda não é a mesma: «esta linha declarada ainda se rende em algum lado?». Uma
linha declarada para uma frase que só lá vive era logo uma «viva que não rende» e
fechava a construção. `ROTAS_QUE_PROVAM_A_RENDICAO` é a lista que responde só a
essa pergunta: **não entra na contagem por classe, não entra nos blocos por
classificar, e não entra na proibição das linhas retiradas**, porque alargar-lhe
a proibição mudava uma regra que ninguém mandou mudar.

**O texto de cada uma das trinta e quatro foi extraído das páginas construídas**
com a mesma definição de bloco que a régua usa, e não datilografado: uma cadeia
copiada à mão para o inventário é a linha a divergir da página no dia em que se
escreve.

**Nenhuma delas morde num marcador da voz**, e isso foi medido e não suposto: a
construção corre `check:voz` com a lista fechada de 65 marcadores, e a contagem
de «por classificar» está a zero com as trinta e oito linhas declaradas.
`autorreferência 0` em todas as rotas, e `divulgação 1 388` ocorrências nas rotas
medidas (uma por página construída de rota inventariada, mais as oito do topo das
páginas de leitura e as duas fichas).

## 7 · O que fica para o lugar de direção

1. **A classe das cadeias novas está decidida, e é nova.** A primeira passagem
   pôs as quatro do rótulo em `navegacao`, que era a classificação a torcer-se
   para caber; a leitura a frio recusou-o e a segunda passagem abriu
   `divulgacao`, a quarta classe (§11, achado 6). Fica para a direção só uma
   coisa: **confirmar que a classe nova é dela**, porque o inventário é uma
   lista governada e eu acrescentei-lhe uma coluna de vocabulário.
   `autorreferencia` continua a ir a zero em todas as rotas medidas, e o
   `check:voz` continua a ser quem o impõe.
2. **Os nomes dos modelos saíram com as versões** (§11, achado 8). A página diz
   agora «os modelos Claude da Anthropic, em três lugares (a direção, a
   construção, a medição), e o Codex da OpenAI na leitura». Não envelhece com um
   número de versão e não põe um algarismo na página. **Se a direção quiser os
   nomes exactos de volta, é uma linha, e volta a precisar da marca.**
3. **A tradução inglesa da secção da política é minha**, fiel, sem acrescentos e
   sem omissões, e ninguém além de mim a leu. É prosa nova, e é o maior bloco de
   prosa nova deste ramo.
4. **`src/data/politica-ia.mjs` fica fora da amarra das decisões.** O texto
   aprovado pelo diretor vive num ficheiro que o `DECISIONS.md` não carimba. A
   comparação carácter a carácter existe (é o portão), mas a amarra que impede o
   texto de mudar sem uma decisão registada não. Trazê-lo para dentro é uma
   linha em `TEXTOS` e outra em `NOMES_ACEITES` de `check-ledger.mjs`, mais a
   entrada do `DECISIONS.md` que carimba o resumo.
5. **A frase «O que mudou» da política §4 não foi para a página**, porque essa
   página ainda não existe neste sítio e nomeá-la seria uma porta que não abre.
   A linha da tabela diz a condição («publica-se sem o diretor, com todos os
   portões verdes») e cala o registo. Quando a página existir, é uma linha.
6. **O rótulo vive dentro do `<footer>`**, o que aproxima a §1.39 sem a
   contradizer (a linha que saiu não voltou; o que entrou é outra coisa e tem
   uma obrigação por trás). Se a direção preferir o lugar da porta das
   correções, antes do rodapé, é um `<RotuloDeIA/>` movido de ficheiro.
7. **`tests/inicio/matriz.mjs` continua com quatro células vermelhas, e são as
   mesmas de antes deste ramo.** Não é uma inferência: construí `b097d20` numa
   worktree à parte, corri lá a matriz, e ela dá **as mesmas quatro células, com
   os mesmos nomes e a mesma prova** (a geometria do mapa e da legenda a 1024 e
   acima, o cartão localizador da página do concelho, a pesquisa aberta, e a
   língua de um título citado: «Água Não Faturada» em onze páginas inglesas, com
   as mesmas 5 328 citações e as mesmas 6 590 portas de rodapé). A worktree foi
   removida a seguir. **Nenhuma das quatro nomeia o rótulo.** A matriz não sai
   com código de erro, o que quer dizer que quem a lê tem de ler a contagem:
   fica dito para que não se confunda «0» com «verde».

## 8 · O que não fiz, e devia ficar dito

* **Não toquei em `DECISIONS.md`**, em `ledger/`, em `public/`, no cabeçalho, nos
  manifestos, nos ícones, na identidade, nem em nada do motor.
* **Não fundi nem empurrei nada.** O ramo fica com os commits feitos e verde.
* **Não escrevi um único número novo no sítio.** As cadeias novas não têm
  algarismos; os três nomes de modelo entram por um motivo já escrito na lista de
  excepções.
* **As capturas de `tests/inicio/capturas.mjs` foram repostas.** Correr as réguas
  reescreve 33 PNG em `design/especime-v3/capturas/` e cria dezasseis novos;
  nenhum deles é trabalho deste bloco, e todos foram repostos ao estado do
  `HEAD` antes do primeiro commit.
* **A leitura cruzada não está feita.** É de outra família, e faz-se antes da
  fusão: a entrada do bloco em `REVISOES-DO-INVENTARIO.md` diz `por ler`, e o
  portão da voz imprime-a em cada construção para que ninguém a esqueça.
* **A medição cega do Sonnet não foi corrida.** O brief admite-a «se a folga o
  permitir, e senão fica dito». Fica dito.

## 9 · As réguas de `tests/inicio/`, no fim

| régua | resultado |
| --- | --- |
| `app.mjs` | 39 de 39 |
| `areas.mjs` | 22 de 22 |
| `capturas.mjs` | 48 capturas escritas (código 0) |
| `correcoes-a.mjs` | 32 de 32 |
| `lista.mjs` | 94 de 94 |
| `mapa-distritos.mjs` | 43 de 43 |
| `mapa-navegacao.mjs` | 9 de 9 |
| `matriz.mjs` | 83 de 87 (as quatro da §7.7, medidas iguais em `b097d20`) |
| `regioes.mjs` | 30 de 30 |
| `rotulo.mjs` | **7 de 7**, e 7 de 7 estragos vistos vermelhos |

## 11 · Segunda passagem: os dez achados da leitura a frio, e o que mudou

A leitura do Codex correu a frio sobre o ramo, com três plantas, e apanhou as
três. Achou dez defeitos reais. **O primeiro é de classe, e é o que mais importa
do bloco inteiro.**

**1 · O oráculo do portão era o ficheiro que ele conferia.** O portão comparava o
rótulo e a frase da política com `src/data/politica-ia.mjs`, que é de onde a
página sai: mudar a cadeia mudava a saída e a expectativa ao mesmo tempo, e a
planta que tirava o «the» de «under the house policy» passava verde. É o defeito
que a casa já conhece com outro nome («uma conferência que usasse o código das
páginas confirmava-se a si própria», `check-cadeia.mjs`), e escapou-me. **O que
mudou**: os textos aprovados passam para `scripts/textos-aprovados.json`,
copiados da ordem §3, lidos só pelo portão, e que nenhum ficheiro de `src/`
importa; **a comparação passa a ser exata**, sem `normalizeWhitespace`. Provado
com uma vírgula tirada da frase em `politica-ia.mjs`, e com o «the» tirado das
palavras ligadas: as duas vermelhas, no ficheiro e na página.

**2 · O rótulo do topo era conferido só pela contagem do marcador.** Uma página
de leitura com o texto de outra edição, ou com a porta a apontar para outro
sítio, passava. **O que mudou**: as quatro conferências do bloco correm nos dois
lugares, e a célula M6 da régua exige as duas edições em vez de
`leituras.length > 0`. Duas plantas novas provam-no.

**3 · A visibilidade não olhava para onde o bloco está nem para um `style`.** **O
que mudou**: o bloco do rodapé tem de ter um `<footer>` por antepassado real (e
não a classe que diz que devia), e um `style` em linha com `display:none` ou
`visibility:hidden` é vermelho. **E o limite ficou escrito**: um portão estático
não corre folhas de estilo, e a ocultação por CSS é da régua do navegador, que
tem o estrago plantado que a prova.

**4 · As línguas tinham três buracos.** Um `<html lang>` ausente ou desconhecido
saltava a conferência inteira em silêncio (`else if (linguaPagina)`); o nome
podia levar marca a mais numa página portuguesa; e a frase da política era
comparada com a língua que o próprio atributo declarava, o que a tornava verdade
por construção. **O que mudou**: os três são vermelhos, e o nome conta-se por
sítio (um na linha, um na ficha, nenhum solto).

**5 · O corredor das plantas corria só as células declaradas.** Um estrago que
estragasse uma célula não declarada nunca era apanhado, porque a célula não
chegava a correr. **O que mudou**: corre a suite inteira por planta, imprime
«verde antes», e exige que todas as não declaradas fiquem verdes. As duas
declarações que mentiam foram corrigidas: tirar o rodapé afeta M1 a M5 e M7;
esconder `.rotulo-ia` afeta M1, M4 e M6.

**6 · O inventário tinha quatro linhas onde devia ter trinta e oito, e a classe
estava torcida.** **O que mudou**: entram as trinta e quatro cadeias da política
publicada (a frase nas duas línguas e cada frase da secção), extraídas das
páginas construídas e não datilografadas, e abre-se a quarta classe
`divulgacao`. A §6.3 escreve a razão por extenso, e a Emenda 15 não se
enfraquece: `autorreferencia` continua a ir a zero em todas as rotas medidas.

**7 · A voz da secção da política tinha quatro frases a mais do que devia.** «A
casa não finge uma revisão que não existe» é a casa a justificar-se, e sai. «Fable
decide, escreve as regras» dizia uma coisa falsa: as regras são do diretor, e a
primeira frase da secção di-lo. «Mede às cegas» e «lê a frio» são o jargão da
casa; a página passa a dizer «mede numa cópia, com código próprio, sem ver a
construção» e «lê sem contexto prévio, com erros plantados que tem de
encontrar». E «a família que construiu nunca verifica o que construiu» passa a «a
verificação é sempre de outra família de modelos», que é a regra e não a sua
consequência.

**8 · Os nomes dos modelos traziam a versão.** Um número de versão de um produto
de terceiros envelhece sozinho na página, e a marca punha algarismos novos no
sítio para dizer uma coisa que não precisa deles. **O que mudou**: a página diz
«os modelos Claude da Anthropic, em três lugares (a direção, a construção, a
medição), e o Codex da OpenAI na leitura», e **o ramo deixa de acrescentar uma
única marca de algarismo**.

**9 · A menção de gratuitidade em inglês** passa de «Free publication» a «Free of
charge».

**10 · As palavras ligadas não eram conferidas.** A porta podia abrir a política
com qualquer texto. **O que mudou**: o portão exige que as palavras ligadas sejam
exactamente «a política da casa» e «the house policy», e uma planta com «o método
da casa» fica vermelha.

**O que a segunda passagem custou em números**: doze estragos plantados novos no
portão (dez em `dist/`, dois no ficheiro de dados), todos vermelhos e todos
repostos pelo `sha256`; o inventário de 586 para 620 linhas; a régua do rótulo
nas mesmas sete células, agora com o corredor a correr sessenta e três medições
em vez de nove. Nada mudou nas contagens do sítio: 6 606 ficheiros, 13 320
números marcados, o livro-razão intacto.

**E o que ela diz sobre a primeira.** Os oito estragos da primeira passagem
provaram que a regra vê o defeito que ela nomeia; nenhum deles perguntava se o
ORÁCULO era independente do que ele confere, nem se a régua vê o defeito nos dois
sítios onde a mesma coisa se rende. As duas perguntas que faltavam são as duas
que a leitura a frio fez.

## 10 · O custo

Modelo: **Claude Opus 5**.

Cerca de **490 000 símbolos**, lidos do contador de orçamento da própria sessão:
15 000 000 quando ela abriu e cerca de 14 510 000 quando esta linha foi escrita.
É a aritmética desse contador e não uma contabilidade por chamada, e o que vier
depois desta linha fica de fora dela.

**Oito construções completas**: sete nesta worktree (a linha de base em
`b097d20`, duas a corrigir, e uma por cada um dos quatro commits de código) e
uma na worktree temporária que mediu a matriz em `b097d20`. Cada uma a **2 min
50 s a 3 min**; o `verify` a cerca de 1 min 20 s; o corredor dos oito estragos
do portão a cerca de 6 min, porque cada um corre o portão inteiro sobre as 6 606
páginas.
