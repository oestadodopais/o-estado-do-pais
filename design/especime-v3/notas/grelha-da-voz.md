# Nota do construtor · A grelha da voz (26 a 27.08.2026)

*Ramo `grelha-da-voz-2026-08-27`, a partir de `main` em `cfa288b`. Construtor:
Claude Opus 5. Brief: `design/especime-v3/briefs/BRIEF-grelha-da-voz.md`, mais
três acrescentos do diretor pela mesma noite (o rótulo da camada da leitura
breve, a frase da outra edição, «regulador» e «legível», e o G6, que se tornou o
maior item do bloco).*

## 0 · As escolhas que o brief deixou em aberto

**A unidade de uma exceção é uma decisão editorial, e leva as duas edições.** O
brief manda contar as exceções e dizer se passam de vinte. Uma linha de
`VOZ-MARCADORES.md` leva a frase portuguesa e a inglesa da mesma decisão, na
mesma forma em que o `INVENTARIO-FRASES.md` já está escrito («uma frase entra uma
vez, na língua em que é rendida», e as duas edições partilham a tabela). Cada
cadeia continua escrita por extenso e cada linha continua com a sua razão; o que
não se conta duas vezes é a mesma decisão dita em duas línguas.

**Três modos de correspondência em vez de um.** As raízes que o brief nomeia
funcionam como subcadeias, menos três: «nós» apanharia «diagnóstico», e «we»,
«our» e «us» apanhariam «between», «source» e «because». Há por isso `raiz`
(subcadeia), `prefixo` (princípio de palavra, para «prova», «proof», «method»,
«check») e `palavra` (palavra inteira). O ficheiro diz qual é o modo de cada
marcador e porquê.

**«este sítio» e «esta página» entram pela raiz curta.** «ste sítio» cobre
«este», «deste» e «neste»; «sta página» cobre «esta», «desta» e «nesta». Uma
lista de formas seria uma lista por completar; a raiz é o que o brief pede
(«as raízes…») e apanha as três.

**O tripwire vive na régua, e quem fecha a construção é um portão novo.** A régua
(`medir-defeitos.mjs`) continua a não fechar nada, que é o que o seu cabeçalho
promete desde o primeiro dia: aplica os marcadores e imprime (medida 9). O passo
`check:voz` corre a régua com `--json`, como a matriz já fazia, e fecha a
construção. Uma segunda varredura seria uma segunda definição da mesma coisa.

**O portão da voz herdou a regra da autorreferência.** A célula da matriz que
exige «autorreferência 0 em todas as rotas medidas» corre fora da construção
(Playwright). Sem ela na cadeia, uma frase DECLARADA como autorreferência voltava
a passar em silêncio, que é exactamente como «É a lei que o define, não este
sítio.» viveu em 616 páginas. `check:voz` passa a exigir zero na construção, e
com ela «nada por classificar».

**O G1 e as primeiras cortes da voz entraram no mesmo commit, e não podiam não
entrar.** Um portão que fecha a construção não pode aterrar verde ao lado das
dezasseis frases que ele existe para apanhar. O primeiro commit leva o mecanismo
e as duas cortes que o punham a verde (a página de Évora e o rótulo da camada da
leitura breve); tudo o resto vem depois, um item por commit.

**A cabeça do inventário é um bloco cercado.** `lida-contra: Emenda 18` num bloco
de código, e não uma linha solta de prosa: um `campo: valor` solto apanhava meia
dúzia de frases do ficheiro que por acaso levam dois pontos.

**A constituição lê-se por uma variável de ambiente.** A regra 14 exige plantar
uma emenda da voz que não existe, e plantá-la em `direcao.md` seria escrever na
constituição. `OEDP_DIRECAO` aponta o portão a uma cópia, como `OEDP_REGISTOS_DIR`
já faz no portão de HTML.

## 1 · G1 · o tripwire lexical

`design/especime-v3/VOZ-MARCADORES.md`, `scripts/voz.mjs`, a medida 9 de
`scripts/medir-defeitos.mjs`, `scripts/check-voz.mjs` e o passo `check:voz` no
`build` e no `verify`.

**A lista fechada tem 52 marcadores**, cada um com a sua razão escrita: as onze
raízes que o brief nomeia, as suas gémeas inglesas, «prosa da casa» e «assente»
(que o diretor mandou acrescentar), «ainda não há» / «there are no» (a ausência
dita numa frase, que é o quarto caso conhecido do brief e não levava marcador
nenhum), e as dez que o G6 ensinou: «o trabalho», «este livro-razão»,
«atravessou», «mostra-o», «avaliável» e as inglesas.

**O que o tripwire varre:** todas as frases da casa das rotas inventariadas,
declaradas ou não. Na construção final são **395 frases distintas, 21 160
ocorrências, em 1 278 rotas**. Uma frase declarada como autorreferência não entra
nos achados porque a segunda conferência do portão já a fecha; não é indulgência,
é não dar duas mensagens ao mesmo defeito.

**A primeira corrida foi vermelha em dezasseis frases reais**, e não plantadas:
sete da página de Évora nas duas edições, e o rótulo da camada da leitura breve,
nas duas. É o G5.

### As plantas do G1, vistas vermelhas e depois verdes

| planta | onde | o que o portão disse |
| --- | --- | --- |
| «Todos os valores foram reconferidos pela equipa antes de serem publicados.» | `dist/municipios/evora/index.html` | marcadores `reconfer · confer · a equipa` |
| «Cada número desta página foi verificado contra a fonte oficial.» | idem | marcadores `verific · sta página` |
| «Ainda não há linhas deste estudo no livro-razão.» | idem | marcador `ainda não há` |
| «É a lei que o define, não este sítio.» | idem | marcador `ste sítio` |
| a mesma frase inteira, com o artigo 52.º, que está DECLARADA como autorreferência | idem | «autorreferência 1 na rota /municipios/evora» |
| «Uma frase da casa que nunca ninguém declarou em lado nenhum.» | idem | «bloco por classificar» |
| uma exceção sem razão, e um marcador sem razão | `VOZ-MARCADORES.md` | as duas linhas nomeadas, mais as quatro frases que a exceção dispensava |
| o parágrafo dos pelouros que o G6 retirou | `dist/estudos/evora-os-pelouros-…/index.html` | marcador `sta página`, e «bloco por classificar» |
| dois parágrafos retirados da página de Évora | `dist/municipios/evora/index.html` | marcador `independ`, e dois «por classificar» |
| três parágrafos retirados da página do 08 | `dist/estudos/evora-quinze-anos-…/index.html` | `o trabalho · este livro-razão · atravessou`, `mostra-o`, `avaliáve` |

Todas repostas a seguir, com o sha256 do ficheiro igual ao de antes, e o portão
verde.

### A lista de exceções, por inteiro (8 entradas, das quais 1 de registo)

*Duas saíram no G6a e duas no G6b, porque as frases que dispensavam deixaram de
existir. O ficheiro imprime as que não se exercem, para que a lista não engorde
em silêncio.*

| tipo | marcador | frase (pt · en) | razão |
| --- | --- | --- | --- |
| contexto | verific · verif | «a verificar» · «to verify» | é o nome do marcador de incerteza do sítio, com página própria em `/a-verificar`, e não uma afirmação da casa |
| rota | ste sítio · this site | `/correcoes` · `/en/corrections` | a política de correções é o conteúdo desta página, e é a Emenda 17 que o escreve. Só este marcador é dispensado; os outros 51 continuam a morder aqui |
| rota | o observatório · the observatory | `/estudos` · `/en/studies` | o arquivo nomeia a publicação de que é o arquivo, como o nome da publicação no cabeçalho (Emenda 18a) |
| frase | sta página · this page | «Nesta página» · «On this page» | o rótulo do sumário de uma página, já declarado navegação: leva a outro sítio da mesma página |
| frase | ste sítio · this site | «O que as fontes que este sítio cita publicam a seguir.» · «What the sources this site cites publish next.» | nomeia o âmbito do calendário. Sem a oração, lia-se como o calendário de todas as publicações estatísticas |
| frase | nós · we · us | a lede do índice do livro-razão, «Uma linha por número publicado…» · «One row per published figure…» | **à decisão do diretor, 26.08** |
| frase | ste sítio · this site | a descrição do `<head>` do índice, «Todas as afirmações publicadas neste sítio…» · «Every claim published on this site…» | **à decisão do diretor, 26.08** |
| registo | (nenhum) | as dez contagens do livro-razão | **à decisão do diretor, 26.08 · sem marcador**: nenhuma leva marcador da lista, e por isso esta linha não dispensa nada. Fica escrita para que a decisão não se perca |

**Oito é menos do que vinte, e o caminho até aqui está medido:** 13 entradas
quando o mecanismo entrou, 10 depois do G6 nas páginas de trabalho, 8 depois do
G6 na página do concelho. Nenhuma entrada foi escrita para calar um achado que se
pudesse corrigir.

## 2 · G2 · o rasto da revisão

A tabela do inventário passa a ter três colunas. **453 linhas**: 429 com `até
2026-08-26` e 24 com `grelha-da-voz`.
`design/especime-v3/critica/REVISOES-DO-INVENTARIO.md` diz, por bloco, quem leu o
diff. `check:voz` fecha a construção quando um bloco não tem entrada, quando a
entrada nomeia um ficheiro que não existe, ou quando uma linha do inventário não
tem bloco. Uma entrada que diz `por ler` é legítima enquanto o bloco está em
construção, e sai na saída do portão.

Três plantas, vermelhas e depois verdes: um bloco `bloco-que-ninguem-leu` sem
entrada; uma entrada a nomear `2026-08-26-leitura-que-nao-existe.md`; e uma linha
sem a terceira coluna.

**A entrada de «até 2026-08-26» diz o que não cobre**, e é a parte honesta desta
peça: as 429 linhas foram escritas ao longo de dezassete blocos, nenhum teve uma
leitura cruzada do seu próprio diff do inventário, e a única leitura desta forma
que existe leu o diff do bloco dos 308.

## 3 · G3 · o gatilho da regra

`lida-contra: Emenda 18` na cabeça do inventário, num bloco cercado. `check:voz`
lê `direcao.md`, procura a emenda mais alta com a cadeia «§5 «Voz» emendado» (as
Emendas 15 e 18 levam-na) e fecha a construção quando ela é maior. Fecha também
quando a cabeça não tem o campo, e quando NENHUMA emenda leva a cadeia: um
gatilho que deixou de poder disparar é pior do que uma emenda por ler.

Duas plantas, vermelhas e depois verdes: uma Emenda 99 fictícia numa cópia de
`direcao.md`, lida por `OEDP_DIRECAO` (o sha256 do ficheiro do repositório é o
mesmo antes e depois); e a cabeça sem o campo.

## 4 · G4 · o protocolo das leituras

`design/especime-v3/PROTOCOLO-DAS-LEITURAS.md`, sem código. A tabela das sete
leituras de 24 a 26.08 está preenchida, e mostra que **uma só plantou as cinco
classes e duas não plantaram nenhuma**. A classe que passou da leitura para a
construção é a voz, e o protocolo diz quando e porquê.

## 5 · G5 · a voz de Évora, e os três acrescentos do diretor

| onde | o que saiu | o que ficou |
| --- | --- | --- |
| `metodo` «Não existe PIB municipal» | «e esta página não fabrica nenhum» | a ressalva factual, com a citação do trabalho |
| `metodo` «Duas das oito medidas…» | «a sua linha no livro-razão nomeia esse documento e a página onde estão» e «e as duas estão nesta página» | de onde vêm as duas medidas e quais são as duas vozes de fora |
| `metodo` «Duas vozes de fora, não uma» | «As duas estão nesta página.» | o resto |
| `metodo` «Nenhuma fonte publica dinheiro por pelouro» | «desta página» e «e esta página não a usa para atribuir dinheiro a ninguém» | as contagens são designações, e a correspondência não é oficial |
| `municipio.contasDivergenciaV` | «e mostra-se porque é o único sítio onde…» | «A diferença é pequena.» |
| `municipio.excessoV` | «e por isso esta página para aqui» | o que a série faz depois |
| `reguladorNota` de 2009–2013 | «usada nesta página» | a série começa depois deste mandato |
| `estudos.leituraBreveRotulo` | a chave inteira, nas duas edições | o gabarito lê `leituraBreveK`, «Leitura breve» |
| `estudos.leituraOutraLingua` e o bloco que ela rotulava | a frase da outra edição, impressa por baixo da sua | a conferência passou para `gate-html.mjs`, em 24 peças |
| `municipio.tempoRelanceK`, `herdouNota`, `leituras.mjs` (2 sítios) | «legível» e «o regulador» | a série da Direção-Geral das Autarquias Locais, pelo nome |

**A frase da outra edição não se perdeu: mudou de sítio.** `gate-html.mjs` confere
que as duas edições de cada peça das páginas de leitura citam as mesmas
afirmações pela mesma ordem, e fecha a construção quando não citam. Foi vista
vermelha com as duas afirmações da frase inglesa do 04 trocadas.

**E a folga que existia por causa daquele bloco saiu com ele.** O selo de um valor
tinha de abrir a linha em qualquer uma das duas edições; passa a ter de abrir a
da própria página. Com a regra apertada e o `dist/` anterior, o portão fechou com
40 erros, todos selos do bloco retirado.

**Sobre o item E11 do bloco dos 308, e é uma correção ao que ele disse.** A §1.68
escreve que «a Direção-Geral das Autarquias Locais deixa de ser chamada "o
regulador"». A busca dele foi pelas notas das oito peças do relance e pelas
cadeias de `strings.mjs` da página do concelho, e não passou por
`src/data/leituras.mjs` nem pelo rótulo do relance da linha do tempo: **três
cadeias ficaram**, e saem neste bloco. Varrido o `dist/` construído, o que resta
está contado: doze páginas com «o regulador» e oito com «legível», das quais dez e
sete são páginas de documento e de leitura (texto transcrito de um trabalho), e
as outras duas são as duas edições da página da linha
`evora-divergencia-municipio-dgal-2024`, onde a palavra está no campo `derivation`
da própria linha, conferido carácter a carácter. O `ledger/` não se toca.

## 6 · G6 · a tabela de tudo o que foi tocado

*A regra do diretor: as secções saem; uma ressalva sobrevive só quando muda a
leitura de um número, e então é UMA frase com o facto por sujeito, na nota da
peça ou do instrumento; as descrições de porta que explicam o que uma edição é
saem; e nada de novo se escreve.*

### As dezanove ressalvas das páginas de trabalho

| trabalho | ressalva | o que se fez | razão |
| --- | --- | --- | --- |
| 04 | «O que o trabalho conclui daí» | **retirada** | é a conclusão assinada do trabalho e vive na página dele; não muda a leitura de nenhum dos dois valores do relance |
| 04 | «A parte vencida» | **uma frase, na nota das medidas** | define «vencido», que é uma palavra do dia a dia com outro sentido aqui |
| 04 | «O que o trabalho não abre» | **retirada** | são os limites do trabalho, não a leitura de um valor desta página |
| 04 | a segunda metade da nota das medidas | **retirada** | «o excerto da linha está [a verificar] e o selo aparece a tracejado» é o sítio a explicar a sua própria marca de incerteza, e ela tem página própria à distância do selo |
| 05 | «Isto não é PIB municipal» | **uma frase, na nota das medidas** | sem ela, o valor acrescentado das empresas lê-se como um PIB do concelho. A frase perde «sediadas» e «sede», que a verificação das fontes de 26.08 não confirmou |
| 05 | «A única medida que existe ao nível do concelho» | **uma frase, na nota das medidas** | a média nacional é a base do índice: sem isso, 100 não se lê |
| 05 | «A comparação com o país» | **retirada** | diz porque é que o valor nacional está ali, e não como se lê o do concelho |
| 05 | «O que é inferência, e diz que é» | **retirada** | é o método do trabalho, e vive na página dele |
| 03 | «De onde vêm as medidas, e as duas vozes de fora» | **retirada** | é proveniência, e a proveniência vive no recibo de cada linha |
| 03 | «Um ano de contas ficou sem assinatura» | **uma frase, na nota das medidas** | um ano de contas nunca certificado muda a leitura da série |
| 03 | «A dívida legal, e o limite contra o qual se lê» | **retirada** | é a página a dizer o que mostra; os dois valores continuam na frase da leitura breve |
| 03 | «O padrão nacional está atrasado» | **retirada** | o padrão não é um número desta página |
| 08 | «Um partido é dono das suas decisões, não de uma curva» | **retirada** | nomeada pelo diretor. É a política editorial da casa dita por extenso |
| 08 | «A palavra «dívida» muda de sentido ao longo da série» | **uma frase, na nota das medidas** | a quebra do sistema contabilístico dentro da série é o caso que a regra nomeia. Sai a segunda metade, «nenhum valor marcado assim atravessou para este livro-razão» |
| 08 | «O mandato mais recente não é avaliável» | **retirada** | nomeada pelo diretor. A segunda metade é a página a dizer o que mostra, e o estado do mandato já está dito em duas palavras na página do concelho, «Em funções.» |
| 06 | «Nenhuma fonte publica dinheiro por pelouro» | **retirada** | não há despesa por pelouro nesta página para ela mudar; a mesma ressalva ficou na página do concelho, onde as contagens estão |
| 06 | «Um mandato inteiro é uma lacuna declarada» | **retirada** | a mesma lacuna está declarada no campo do mandato, na página do concelho |
| 06 | «O executivo seguinte, e como se conta» | **uma frase, na nota das medidas** | define o que cada contagem é. Sai «conferida linha a linha contra o excerto da própria página», que é o cuidado da casa |
| pensões | «O fator não cai sobre todos» | **retirada** | o facto já está na nota das medidas desta página, que ficou |
| pensões | «A comparação junta duas figuras do relatório» | **retirada** | é proveniência e derivação, e as duas vivem no recibo de cada linha |

### As doze da página do concelho, e a dobra do instrumento

| onde | ressalva | o que se fez | razão |
| --- | --- | --- | --- |
| `metodo` | «Não existe PIB municipal» | **retirada** | nenhum número desta página é um valor acrescentado nem um PIB; a ressalva ficou na página do trabalho, onde o número está |
| `metodo` | «Duas das oito medidas são o município a falar de si» | **retirada** | é proveniência, e cada uma das duas medidas tem o seu selo e a sua linha |
| `metodo` | «Um ano de contas existe sem assinatura de fora» | **uma frase, na nota da camada das contas** | um ano de contas nunca certificado muda a leitura destes números |
| `metodo` | «Duas vozes de fora, não uma» | **retirada** | é proveniência. **Com ela sai a única menção ao auditor independente na superfície pública** |
| `metodo` | «Nenhuma fonte publica dinheiro por pelouro» | **uma frase, na nota do instrumento dos mandatos** | «As contagens de pelouros são designações, não despesa.» é o que impede a contagem de se ler como dinheiro |
| `metodo` | «O dinheiro do plano de recuperação é atribuído pelo registo» | **retirada** | é a conclusão assinada de um trabalho, e está na página dele |
| `naoSabe` | «Não existe medida de desempenho por pessoa.» | **retirada** | não há medida por pessoa nesta página para ela mudar |
| `naoSabe` | «A repartição de pelouros do mandato de 2009–2013 não foi estabelecida» | **retirada** | o campo do mandato di-lo, e passou a dizê-lo com o facto por sujeito |
| `naoSabe` | «O nome legal completo do presidente interino de 2013 é [a verificar]» | **retirada** | é a única das doze cuja saída tira da página uma incerteza viva sobre uma coisa que a página mostra. Vai para o diretor (I77) |
| `naoSabe` | «Não existe contrafactual para nenhum índice» | **uma frase, na nota do instrumento dos mandatos** | é a que impede a banda dos mandatos ao lado de uma curva de dívida de se ler como uma atribuição. A reclassificação de 21.08.2026 já lhe chamava limite dos dados |
| `naoSabe` | «Os valores da DGAL para 2017 e 2021 trazem ressalvas do próprio ficheiro» | **retirada** | a ressalva de cada valor está na sua linha, no campo `source_flag_note`, e a palavra do estado rende-se ao pé do valor que a fonte marca |
| `naoSabe` | «Sobre o plano de recuperação: …» | **retirada** | são os limites de um trabalho, e estão na página dele |
| instrumento | a dobra «Como esta linha do tempo é feita» e o seu parágrafo | **retirada** | o nome dizia o que ela era. O que o parágrafo dizia sobre as duas dívidas de 2013 já está escrito ao pé de cada um dos dois valores |
| instrumento | os dois valores do excesso sobre o teto legal e a sua frase | **ficam, fora da dobra** | são dois números publicados, com a frase que diz porque é que a série pára ali |
| porta | «A edição de registo, tal como foi publicada.» | **retirada** | a porta chega, e o documento diz-se a si próprio na faixa que leva no topo |
| campo | `pelourosNota` de 2009–2013 | **reescrita** | dizia «O trabalho sobre os pelouros diz que este mandato «é uma linha de um mapa, não um mapa»…»: o sujeito era o trabalho. Passa a dizer o facto |

## 7 · As medições

| medida | antes deste bloco | depois |
| --- | --- | --- |
| frases varridas pelo tripwire (texto fora das origens declaradas) | não existia | **577** |
| frases da casa distintas, contadas pela medida 8 | 435 | **395** |
| ocorrências dessas frases | 21 228 | **21 160** |
| rotas medidas | 1 278 | 1 278 |
| linhas declaradas no inventário | 506 (504 textos distintos) | **453**, todas distintas |
| autorreferência, em todas as rotas | 0 | 0 |
| blocos por classificar | 0 | 0 |
| marcadores da voz | não existiam | **62** |
| exceções da voz | não existiam | **8** (1 de registo) |
| passos na cadeia do `build` | 9 | **10** |
| conferências do portão de HTML | as que havia | mais duas: as duas edições de cada peça de leitura (24 peças) e os factos declarados por verificar (2 campos) |
| avisos do portão («afirmação que nenhuma página cita») | 19 | **19** (subiu a 20 com o G6 e voltou com o I75) |
| páginas construídas | 6 390 | 6 390 |

**A afirmação que perdeu a página que a citava** é
`factor-sustentabilidade-2026`: só vivia na ressalva da derivação do trabalho das
pensões, e essa ressalva era proveniência. A linha continua no livro-razão, com a
sua página e o seu selo, e o índice continua a listá-la.

## 8 · A leitura de fora, e o que ela mudou (I77, I75, V1 a V5 · 27.08.2026)

### O buraco que a leitura mediu

**O tripwire não via uma frase que partilhasse o bloco com um valor.** A medida 8
deixa cair um bloco inteiro que contenha uma origem declarada, e para contar
frases da casa está certa; para procurar uma casa que fala de si, não. Três das
quatro frases que a leitura apanhou na página de Évora viviam ao lado de um
`<Claim>`, e por isso nunca chegaram ao tripwire. A varredura da medida 9 passa a
ser o texto que fica FORA das origens declaradas e fora dos comandos: de **395
para 577 frases distintas**, 16 847 ocorrências, nas mesmas 1 278 rotas.

### V1 · as quatro frases de Évora, e dez marcadores novos

| frase | o que ficou |
| --- | --- |
| «A página mostra as duas: escolher uma em silêncio esconderia que a diferença existe.» | saiu; fica o facto, «€ na reexpressão de um relatório posterior, para a mesma data de início de mandato.» |
| «, nos quatro anos que esta página publica.» | saiu; os dois anos já estão na frase, ditos pelos dois `{ref}` que ela leva |
| «· a diferença é publicada arredondada ao euro; os dois valores acima diferem em cêntimos.» | «· a Direção-Geral arredonda ao euro; os dois valores diferem em cêntimos.» |
| «Fora do que foi lido: as capturas… começam no mandato seguinte.» e o rótulo nu «Fora do que foi lido.» | «As capturas da repartição de pelouros começam no mandato de 2021–2025.», nos dois mandatos. O «mandato seguinte» era o de 2017–2021, que também não tem pelouros lidos: o primeiro que os tem é o de 2021–2025 |

Marcadores novos: `a página` · `the page` · `publicamos` · `selecionámos` ·
`selecionamos` · `noss` · `este observatório` · `this observatory` ·
`do que foi lido` · `what was read`. A lista fechada passa de 52 para 62.

**Vermelho antes de verde, e o que não ficou vermelho.** Plantadas as oito
cadeias originais no `dist/`, **cada uma num bloco que também leva um valor do
livro-razão** (que é o buraco que se fechou), seis foram a vermelho e nomearam o
marcador: `a página`, `the page`, `sta página`, `this page`, `do que foi lido`,
`what was read`. **As duas da diferença arredondada não**, e diz-se: a sua classe
é a página a descrever onde pôs as coisas («é publicada», «acima»), e o marcador
que a apanharia seria `acima`/`abaixo`/`above`/`below`. **Medido antes de
decidir: essas quatro raízes mordem 40 frases da superfície**, quase todas a
posição de uma medida contra a sua referência («está acima do limiar», «pontos
abaixo da média da UE-27»), que é conteúdo. Quarenta exceções para apanhar uma
frase é a lista de marcadores a estar mal, e por isso não entram. Esta ficou para
a leitura, que foi quem a apanhou.

### V2 · a leitura do cabeçalho perde o verbo

«Painel europeu reconferido a <data>» passa a «Painel europeu · <data>», em todas
as páginas e no cartão de partilha; o estado de atraso passa a «Painel europeu em
atraso · <data>». Nome e data ficam, o verbo da diligência sai. Nenhuma régua lê
estas cadeias pelo texto: a matriz confere a chave da prova `painel_reconferido_em`
e a sua porta, e continua verde.

### V3 · cinco superfícies deixam de descrever o processo

O calendário nomeia as fontes citadas; a lede da agenda diz o que está a ser
medido em vez de quem o mede; a nota da pergunta diz que ela está registada em
inglês em vez de nomear o registo do motor; o arquivo nomeia o que tem em vez do
seu estado de migração; os dois estados vazios encolhem para a ausência em duas
palavras. **A descrição do trabalho 04 fica**: é a frase de abertura do próprio
documento, transcrita e conferida carácter a carácter, e vai para a segunda
passagem de voz do motor (I69).

**A lede da agenda foi apanhada pelo marcador `este observatório`, que é do V1.**
Foi medido: com os marcadores do V1 e sem a correção do V3, a construção fecha nas
duas edições dessa lede. É por isso que o V1 e o V3 entram no mesmo commit: um
portão que fecha a construção não pode aterrar verde ao lado da frase que ele
acabou de aprender a apanhar.

### V4 · a dispensa por rota de `/estudos` desaparece

Não passa a frase: **desaparece**. A frase que a pedia, «O arquivo do
observatório…», mudou no V3, e a rota deixou de precisar de dispensa nenhuma. As
dispensas por rota ficam em uma, a de `/correcoes`, que é a Emenda 17. E a razão
do marcador `independ` deixou de dizer que «auditor independente» está nas
exceções: esteve, e saiu com a frase no G6 (I78).

### V5 · o que a leitura de fora chamou ruído, e não se mudou

A leitura chama «demasiado ruidosos» `confer`, `garant`, `independ`, `método`,
`prova`, `nós`/`we`/`us`, `o trabalho` e outros. **O que um marcador ruidoso faz
é obrigar a escrever uma razão, e não apagar uma frase.** A medida está feita:
**oito exceções para 577 frases distintas da superfície pública**, das quais uma é
um registo sem marcador e duas são as linhas que esperam o diretor. Um marcador
que hoje não morde em lado nenhum (como `independ`, depois do G6) custa zero e
apanha a frase no dia em que ela voltar. Ficam todos.

Ficam também, sem mudança e com a razão escrita: a dispensa de `/correcoes`
(Emenda 17), as ledes e as contagens do livro-razão (à decisão do diretor), e «As
regiões publicadas na régua da convergência.» como navegação, que é o que ela é,
o nome de um destino.

### I77 e I75

**I77 · fechada.** O nome do presidente interino de 2013 leva o marcador
`[a verificar]` ao lado, nas duas edições, com a porta da página do marcador.
`quemPorVerificar` declara-o e o portão de HTML fecha a construção se o marcador
não se render ou se abrir a porta da outra edição. Vermelho antes de verde nas
duas metades.

**I75 · fechada.** `factor-sustentabilidade-2026` volta à nota das medidas do
trabalho das pensões, com o seu selo, como UMA frase com o facto por sujeito e
com as palavras da ressalva que saiu. **A conta foi conferida antes de a frase
ficar**: F = FS (1 − 0,005 M), com FS = 0,8237 e M = 12, dá 0,774278, uma redução
de 22,57 %, e a linha publica 22,6 %. Os avisos do portão voltam de 20 para 19.
Para o valor caber ali, a nota das medidas passou a ser uma lista de parágrafos e
a render com selos: a prosa da casa continua a ser contada e varrida, e a frase
que cita um valor é uma origem declarada, como qualquer outra.

## 9 · O que fica aberto

* **A leitura cruzada do diff deste bloco.** O registo diz `por ler`, e o portão
  imprime-o a cada construção. É trabalho do lugar de direção antes da fusão.
* **As duas linhas à decisão do diretor**, com as três opções escritas em
  `PROTOCOLO-DAS-LEITURAS.md`.
* **I74 e I76**, abertas neste bloco e ainda abertas. A I75, a I77 e a I78 estão tratadas: as duas primeiras fechadas a 27.08, a I78 continua para o diretor. A I74 mede o que sobra: **58 das 453
  declarações do inventário não correspondem a nenhum bloco da construção**, e
  nada impede que uma frase corrigida volte em silêncio por continuar declarada.
  Este bloco tirou 79 dessas linhas, as que lhe diziam respeito, e não mexeu no
  resto: uma parte é deliberada (o ficheiro guarda duas leituras de uma contagem
  lado a lado) e separá-las é uma decisão de forma.
