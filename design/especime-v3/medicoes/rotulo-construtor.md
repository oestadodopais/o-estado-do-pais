# O rótulo de IA em todas as páginas · relatório do construtor

*Escrito a 01.09.2026 por Claude Opus 5, ramo `rotulo-ia-2026-09-01`, saído de
`main` `b097d20`, contra `design/observatorio/ORDEM-rotulo-2026-09-01.md` e
`design/observatorio/BRIEF-divulgacao-via-B.md`. Nada fundido, nada empurrado.
Sem travessões na prosa nova.*

## 0 · O que fica feito, em cinco linhas

* **O rótulo rende em 6 590 das 6 590 páginas construídas** das duas edições, no
  rodapé, mais **8 no topo das páginas de leitura**, que são texto longo. Os 16
  documentos de estudo alojados ficam de fora por desenho (§1.19) e levam o
  rótulo na página que os embrulha. O `gate:html` ganhou a regra que fecha a
  construção a uma página sem ele, provada em oito estragos plantados.
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
sítio**: as cadeias novas não trazem um único algarismo, e os três nomes de
modelo da secção da política vão dentro de
`data-nonledger="identificador-tecnico"`, que é o motivo já escrito em
`ledger/allowlist.yml` para versões e identificadores de máquina.

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
| linhas do inventário com bloco | 582 | **586** | +4 |
| das quais vivas | 506 | 510 | +4 |
| autorreferência, em todas as rotas medidas | 0 | **0** | 0 |
| páginas com o termo do schema.org | 0 | **648** | +648 |

As 6 602 âncoras novas são a porta da política, e a soma fecha à unidade: 6 590
no rodapé, 8 no topo das páginas de leitura, 2 no Sobre (a porta para a secção) e
2 no sumário do Método (a entrada da secção nova). As 1 380 ocorrências novas de
frases da casa são a cadeia do rótulo nas 1 378 rotas inventariadas mais as duas
fichas da primeira página.

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

Sete conferências, e cada uma fecha um modo diferente de falhar:

1. **existe, uma vez** · exactamente um bloco de rodapé por página construída;
2. **diz o texto aprovado** · carácter a carácter, na língua da edição;
3. **a porta abre a política** · a ligação vai para a secção e não para a página
   do Método em geral;
4. **vê-se** · nem `hidden`, nem `aria-hidden="true"`, nem `.vh`, nele ou num
   antepassado;
5. **o topo** · exactamente um nas páginas de leitura, e zero em todas as outras;
6. **a ficha** · exactamente uma na primeira página de cada edição, e zero nas
   outras, com as duas cadeias conferidas;
7. **a frase da política** · uma no Sobre e uma no Método, e zero nas outras,
   comparada com o texto aprovado.

E uma conferência que corre uma vez, sobre os ficheiros e não sobre as páginas:
o nome de quem responde tem de ser, carácter a carácter, um dos pedaços
`{ forte: … }` das dez regras de `src/data/metodo.mjs`. Duas grafias do nome são
duas pessoas para quem lê, e a divulgação do artigo 50.º deixa de identificar
ninguém.

**Os oito estragos plantados** (os sete primeiros em `dist/`, o oitavo no
ficheiro de dados), com o portão verde antes, o `sha256` do ficheiro antes e
depois, e o ficheiro reposto e reconferido pelo `sha256` no fim. O portão correu
verde no fim, com tudo reposto.

| estrago | onde | o que o portão disse |
| --- | --- | --- |
| o rótulo do rodapé retirado | uma página de linha | «esta página tem 0 rótulo(s) de IA no rodapé; tem de ter exactamente um» |
| uma palavra trocada no texto aprovado | a mesma | «o rótulo de IA não é o texto aprovado» |
| a porta a abrir o Método sem a âncora | a mesma | «não tem a porta para a política ("/metodo#politica-de-ia")» |
| o rótulo escondido com `aria-hidden` | a mesma | «está escondido por aria-hidden="true" […] O n.º 5 do artigo 50.º pede-o "de forma clara e percetível"» |
| o nome de quem responde trocado | a mesma | «um "data-rotulo-nome" diz "Outra Pessoa" e o responsável editorial é "Nuno dos Santos"» |
| a ficha injectada fora da primeira página | uma página de linha inglesa | «esta página tem 1 ficha(s) da primeira página e devia ter 0» |
| a frase da política reescrita | `/sobre` | «a frase da política não é o texto aprovado» |
| o nome do responsável trocado no ficheiro de dados | `src/data/politica-ia.mjs` | «o responsável editorial é "Nuno Santos" e nenhuma das dez regras do Método imprime esse nome» |

O oitavo é o único plantado fora de `dist/`, e foi reposto com o `sha256` do
ficheiro conferido igual ao original antes de qualquer construção.

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
| M6 | o rótulo do topo vem inteiro antes do documento | 2 páginas de leitura |
| M7 | o rótulo está completo no HTML servido, sem script | as duas edições |

**Os sete estragos plantados**, cada um a pôr vermelhas exactamente as células
que declara e nenhuma outra (o corredor exige as três coisas, que é a lição da
I100):

| estrago | célula | o que ela disse |
| --- | --- | --- |
| o rótulo do rodapé retirado | M1 | «sem rótulo no rodapé» em 8 de 8 |
| o rótulo escondido por uma folha | M1 | «o rótulo mede 0×0px» em 8 de 8 |
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

### 6.3 · A classe das quatro cadeias no inventário da voz

As quatro entram como **navegação**, e a razão está escrita no
`INVENTARIO-FRASES.md` para que a leitura seguinte saiba que a pergunta foi
feita. Em resumo: a classe da autorreferência é «o método, a verificação, a
honestidade, a cobertura ou as intenções do próprio sítio» e vai a zero em todas
as rotas medidas; estas frases não são nenhuma dessas coisas, não têm um
adjetivo, dizem o que o texto é e quem responde por ele, e levam a porta para
onde isso se lê por extenso. A irmã mais próxima é a porta das correções, que é
navegação desde o princípio e também é uma linha de todas as páginas.

**O teste da Emenda 15 não decide esta classe, e isso fica dito.** «Uma frase
sobrevive numa página do leitor se a sua remoção fizesse um leitor ler mal um
número»: nenhuma das quatro sobrevive a esse teste, e a porta das correções e a
navegação do rodapé também não. O teste governa o que é autorreferência e o que
é conteúdo; não governa o que a lei obriga a página a dizer.

**Nenhuma delas morde num marcador da voz**, e isso foi medido e não suposto: a
construção corre `check:voz` com a lista fechada de 65 marcadores sobre todas as
frases das 1 378 rotas inventariadas, e a contagem de «por classificar» ficou a
zero com as quatro linhas novas declaradas. `autorreferência 0` em todas as
rotas, como antes.

## 7 · O que fica para o lugar de direção

1. **A classe das quatro cadeias.** Ficam navegação, com a razão escrita. Se a
   direção as ler como uma quarta classe («divulgação obrigatória»), é uma
   coluna nova no inventário e uma linha em `check-voz.mjs`; se as ler como
   autorreferência, a regra da Emenda 15 tem de ganhar a excepção da lei, porque
   a contagem tem de continuar a poder ir a zero.
2. **Os nomes dos modelos na secção da política.** A ordem manda dizer «os
   lugares e os modelos (§5)», e a página nomeia `Claude Fable 5`,
   `Claude Opus 5`, `Claude Sonnet 5` e `gpt-5.6-sol`, marcados
   `identificador-tecnico`. São nomes de produto de terceiros que envelhecem, e
   tirá-los é uma linha. **A decisão é da direção.**
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
