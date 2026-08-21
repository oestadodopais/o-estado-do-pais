# As chaves novas, PT → EN · redesenho v3, fase 1

*Cada etapa acrescenta aqui as chaves que criou em `src/i18n/strings.mjs`, com o português e o inglês lado a lado, no mesmo commit em que as cria. `assertKeyParity()` falha a construção se as duas línguas não tiverem as mesmas chaves; o que ela não vê, e este ficheiro mostra, é se o inglês foi pensado ou copiado. A lista inteira vai à direção para revisão de voz antes da fusão; a revisão de voz não desbloqueia nenhuma construção, e uma palavra mudada depois é uma cadeia, não uma etapa.*

## O vocabulário de estado, decidido uma vez (proposta da etapa 0, enviada à direção antes da etapa 2)

| chave | pt | en | nota |
|---|---|---|---|
| `estado.foraDoLimiar` | fora do limiar | outside the threshold | «outside» e não «above»: a posição de investimento ultrapassa o seu limiar por baixo (−35 é um chão), e «fora» cobre os dois sentidos |
| `estado.dentroDoLimiar` | dentro do limiar | within the threshold | |
| `estado.semLimiar` | sem limiar | no threshold | |
| `estado.porConfirmar` | por confirmar | unconfirmed | o marcador `[a verificar]` fica em português nas duas edições (decisão da página do marcador); esta é a palavra do estado, não o marcador |
| `cobertura.temPagina` | tem página | has a page | |
| `cobertura.semPaginaAinda` | sem página ainda | no page yet | já existe como `municipios.semPagina`; passa a ser a única cadeia de cobertura |

## Por etapa

### Etapa 1
**Uma chave nova, e só uma.** As subetapas 1a a 1d mudaram a letra, os tokens, o cabeçalho, o rodapé e o selo sem escrever uma palavra nova em nenhuma das duas edições; a 1e acrescentou `nav.menu`, e mais nada. As outras chaves de que a etapa precisou já existiam todas:

| chave | pt | en | onde foi usada |
|---|---|---|---|
| `nav.inicio` · `nav.municipios` · `nav.estudos` · `nav.livro` · `nav.agenda` · `nav.metodo` · `nav.sobre` | Início · Municípios · Estudos · Livro-razão · Agenda · Método · Sobre | Home · Municipalities · Studies · Ledger · Agenda · Method · About | a navegação do cabeçalho, agora rendida de uma lista de chaves de rota |
| `nav.correcoes` | Correções | Corrections | **já existe**, e é o oitavo item do cabeçalho no dia em que a decisão (a) chegar. Nenhuma cadeia nova é precisa para essa decisão: só uma linha de `Masthead.astro` |
| `prov.selo` | fonte | source | a palavra do selo, sem mudança |
| **`nav.menu`** | **Menu** | **Menu** | **chave nova (subetapa 1e)**: o comando que abre a navegação no telemóvel. Identidade aceite, e a razão está na lista abaixo |

Conferido: `assertKeyParity()` atira a cada `t()` e a construção está verde, o que quer dizer que as duas edições continuam com as mesmas chaves.

A ficha técnica pública da letra (a linha «A letra» do Método, plano §12) traria cadeias novas nas duas edições, e **não entra nesta etapa**: é texto governado e espera a palavra da direção.

### Etapa 1f

| chave | pt | en | nota |
|---|---|---|---|
| `prov.provisorio` | provisório | provisional | A ressalva que a fonte publica, dita por palavras ao pé do valor (decisão (d) da direção, 20.08.2026). Rende onde a linha tem `source_flag: "p"`, que hoje são seis linhas e amanhã são as que a fonte marcar. **Não é** o marcador de incerteza do sítio: `[a verificar]` diz que falta um campo à proveniência e fica em português nas duas edições; esta diz que o Eurostat marcou o valor como provisório, e traduz-se. Duas coisas diferentes, duas palavras diferentes, duas formas diferentes. A nota inteira continua a ser o campo `source_flag_note` da página da linha. |

*(A chave `nav.menu` da subetapa 1e está na secção «Etapa 1» acima, com a razão da identidade aceite.)*

### Etapa 2

**2a · o vocabulário de estado e o de cobertura.** As seis cadeias da proposta da etapa 0 entram tal como foram decididas, sem uma palavra mudada, e passam a viver no topo de `strings.mjs` (e não dentro de `home`), porque a mesma palavra tem de sair igual na primeira página, no índice dos concelhos e na página de um concelho.

| chave | pt | en | onde foi usada |
|---|---|---|---|
| `estado.foraDoLimiar` | fora do limiar | outside the threshold | a fila de estados e a palavra de estado das peças (2b, 2c) |
| `estado.dentroDoLimiar` | dentro do limiar | within the threshold | o mesmo |
| `estado.semLimiar` | sem limiar | no threshold | o mesmo |
| `estado.porConfirmar` | por confirmar | unconfirmed | a palavra do estado; o marcador `[a verificar]` continua em português nas duas edições |
| `cobertura.temPagina` | tem página | has a page | `/municipios`, a legenda do mapa, a ficha do mapa, os resultados da pesquisa |
| `cobertura.semPaginaAinda` | sem página ainda | no page yet | `/municipios`, a legenda do mapa, o estado vazio de um concelho |

**Saíram cinco chaves, nas duas edições**, e as cinco eram formulações concorrentes das duas de cima (defeito 7): `municipios.semPagina`, `municipios.comPagina`, `home.instr2.coberturaLabel`, `home.instr2.legendaAceso`, `home.instr2.legendaApagado`.

**2b e 2c · as palavras da primeira página.** O inglês foi pensado, e onde uma
escolha custou algo está dita a razão.

| chave | pt | en | nota |
|---|---|---|---|
| `ambito.rotulo` | Âmbito | Scope | |
| `ambito.pais` · `regiao` · `municipio` | País · Região · Município | Country · Region · Municipality | |
| `ambito.regioesMeta` | As seis leituras publicadas na régua da convergência. | The six readings published on the convergence rule. | seis, e não cinco: Portugal está na régua com as outras |
| `ambito.pesquisaRotulo` | Escreva o nome do concelho | Type the name of the concelho | «concelho» fica em português na edição inglesa, como já acontece em `municipios.h1` |
| `ambito.pesquisaSemResultado` | Nenhum concelho com esse nome. | No concelho by that name. | |
| `densidade.rotulo` | Densidade | Density | |
| `densidade.relance` · `leitura` | Relance · Leitura breve | At a glance · Brief reading | as mesmas palavras que os instrumentos já usavam em literal |
| `densidade.abrir` · `fechar` | abrir · fechar | open · close | as duas metades do comando da peça; as duas estão no HTML e a folha troca-as |
| `densidade.semJs` | Sem JavaScript, este comando não muda a página inteira: cada medida abre-se na sua própria linha. | Without JavaScript this control does not change the whole page: each measure opens on its own row. | |
| `inicio.cabeca.paisA` · `paisB` | Portugal · painel europeu ·  ·  medidas | Portugal · European panel ·  ·  measures | os dois pedaços à volta de `painel_total` |
| `inicio.cabeca.regiaoSufixo` · `municipioSufixo` · `municipioPalavra` | · região · · município · · município · | · region · · municipality · · municipality · | |
| `inicio.cabeca.tituloPaisUm` · `tituloPaisMuitos` | limiar europeu ultrapassado. · limiares europeus ultrapassados. | European threshold breached. · European thresholds breached. | **«breached» e não «exceeded»**: a posição de investimento internacional ultrapassa o seu limiar por baixo, e «exceeded» diria o contrário. É a mesma razão pela qual o estado é «outside» e não «above» |
| `inicio.cabeca.tituloEvora` | As medidas do concelho, cada uma com a sua linha. | The measures of the concelho, each with its own row. | |
| `inicio.cabeca.tituloVazioA` · `tituloVazioB` | Ainda sem linhas para  · . | Still no rows for  · . | |
| `inicio.cabeca.ledePais` | *(a cadeia de `home.numeros.sub`, sem uma palavra mudada)* | *(idem)* | não é texto novo: é a mesma frase, na mesma rota, noutro lugar da página |
| `inicio.cabeca.ledeRegiaoPartes` | PIB per capita em paridades de poder de compra, com a média da UE-27 fixada em 100. | GDP per capita in purchasing power standards, with the EU-27 average fixed at 100. | é a primeira metade de `home.instr1.subPartes`, sem a frase que manda seleccionar regiões |
| `inicio.cabeca.ledeVazioA` · `ledeVazioB` | O ponto marca a posição do concelho na Carta Administrativa, e não cobertura. Quando houver linhas para  · , entram aqui com a sua fonte e a sua data de leitura. | The point marks where the concelho sits on the official administrative map, and not coverage. When there are rows for  · , they will appear here with their source and their reading date. | |
| `inicio.cabeca.estadoRotulo` | Estado das medidas | State of the measures | o nome da região de grupo da fila de estados; só é ouvido |
| `inicio.mapa.coberturaA` · `coberturaB` | de  ·  concelhos ·  | of  ·  concelhos ·  | os pedaços à volta das duas contagens de cobertura |
| `inicio.mapa.escolher` | Toque num ponto para escolher o concelho. | Tap a point to choose the concelho. | a prancha escreve «para abrir o concelho», e um toque aqui escolhe o âmbito, não abre a página |
| `inicio.mapa.trocar` | trocar de concelho | change concelho | |
| `inicio.mapa.paginaInteira` | a página inteira, com quem governou | the whole page, with who governed it | |
| `inicio.mapa.naoDiz` · `contagemK` · `continente` · `acores` · `madeira` · `total` · `readoutHint` · `tecladoHint` · `svgLabel` · `naoDizK` | *(as cadeias de `home.instr2.*`, sem mudança)* | *(idem)* | relocação R3 |
| `inicio.banda.rotuloPartes` | A régua da convergência · UE-27 = 100 | The convergence rule · EU-27 = 100 | |
| `inicio.banda.naoSeDesenham` | As regiões não se desenham em pontos de concelho: a régua é o instrumento do âmbito regional. O mapa volta quando o âmbito é um município. | Regions are not drawn as concelho points: the rule is the instrument of the regional scope. The map returns when the scope is a municipality. | |
| `inicio.peca.recibo` | o recibo completo está na linha | the full receipt is on the row | |
| `inicio.peca.semReferencia` | Sem referência publicada: não há barra a desenhar. | No published reference: there is no bar to draw. | a Emenda 4 proíbe barra sem referência, e a peça di-lo em vez de deixar o lugar vazio |
| `inicio.portas.k` | As páginas · o resto vive a uma porta | The pages · the rest is one door away | |
| `inicio.portas.abrir` | a página inteira | the whole page | |
| `inicio.portas.estudosA` · `estudosB` | trabalhos ·  ·  edições | works ·  ·  editions | |
| `inicio.vazio.explicaA` · `explicaB` | Nenhuma medida foi lida para  · . As fontes que publicam para todos os concelhos do país permitem que as mesmas medidas existam aqui, com a mesma prova, no dia em que forem lidas. | No measure has been read for  · . The bodies that publish for every concelho in the country make it possible for the same measures to exist here, with the same proof, the day they are read. | |
| `sinal.agendaConcluido` · `agendaRetirado` | concluído · retirado | concluded · withdrawn | as duas em falta para completar o par que a mobília já tinha em minúsculas |

*(por preencher na subetapa 2e: `inicio.movel.*`)*

**2g · três cadeias, e nenhuma delas é texto novo de raiz.**

| chave | pt | en | nota |
|---|---|---|---|
| **`inicio.cabeca.distritoDe`** | **distrito de ** | **district of ** | **chave nova**, e é a que fecha ISSUES I18. O espaço final é parte da cadeia nos dois lados: o prefixo cola-se ao nome que a Carta escreve, e o nome não se toca. Os nomes de ilha ficam em português nas duas edições, como já acontece com «concelho» e pela mesma razão: são nomes próprios da Carta Administrativa, e «island of Faial» não é o nome de nada. Quem decide qual dos dois casos se aplica é o servidor, para os 308, e o script só troca o `hidden` do prefixo |
| **`inicio.mapa.deepTitulo`** | Método, ressalvas e proveniência | Method, caveats and provenance | **não é texto novo**: é `home.instr2.deepTitulo` da v2, relocado com a sua secção (R3) e sem uma palavra mudada. Fica igual, à letra, a `home.instr1.deepTitulo`, e ficava igual na v2 também: os dois instrumentos tinham a sua própria chave com o mesmo rótulo, porque o rótulo nomeia a camada e não o instrumento |
| **`inicio.movel.proximos`** | Um toque no mapa devolve os concelhos mais próximos, para escolher. No telemóvel os pontos não são alvos: a pesquisa é o caminho. | Tapping the map returns the nearest concelhos to choose from. On a phone the points are not targets: the search is the way. | **cadeia inteira, nas duas edições, tal como a 2e a escreveu.** A 2g aparou-lhe a primeira frase porque a lista de proximidade tinha saído, e uma frase que promete o que a página não faz é pior do que nenhuma; a **2h** repôs o gesto atrás de um toque a sério e a frase com ele. Com dois estados — sem toque, Évora e o concelho escolhido; com toque, os mais próximos —, as duas metades são verdadeiras ao mesmo tempo: os pontos continuam a não ser alvos e o selo inteiro continua a ser um. Não é texto novo: é a cadeia da 2e, restituída sem uma palavra mudada |

**2i · uma cadeia aparada, e nenhuma nova.**

| chave | pt | en | nota |
|---|---|---|---|
| **`ambito.regioesMeta`** | As regiões publicadas na régua da convergência. | The regions published on the convergence rule. | **aparada, nas duas edições no mesmo commit.** Era «As seis leituras publicadas…» / «The six readings published…», e a razão da palavra «seis» está escrita na etapa 2b: Portugal estava na fila com as outras cinco. A leitura cruzada de 20.08 mostrou que Portugal **não é uma região** (plano §13 fecha a lista em cinco), a fila passou a cinco pastilhas, e a legenda ficou a contar seis por cima de cinco. Não passou a «cinco»: uma contagem escrita à mão numa legenda volta a ficar errada na primeira mudança da lista, e a régua continua a publicar seis leituras — o que mudou foi quantas delas são um âmbito. A frase deixa de contar e nomeia. Nenhuma palavra nova entrou nesta subetapa |

*(A propriedade `rotuloId` de `Regua.astro` prometia um nome acessível às réguas e nunca era passada; saiu com o `role="img"` que a acompanhava, e as onze réguas — dez, depois de o painel de Portugal sair — passaram a `aria-hidden="true"`. Não é uma cadeia: nenhum texto entrou nem saiu por causa disto.)*

### Etapa 2j

**Quatro cadeias novas, duas retiradas.** A leitura da pré-visualização n.º 1 pela
direção (21.08.2026; `DECISIONS.md` §1.52) trouxe as Emendas 10 a 14. Três delas
não pedem uma palavra nova — os pontos do mapa, a fila de estados e as caixas das
peças são forma —, e as que pedem estão aqui.

| chave | pt | en | nota |
|---|---|---|---|
| **`tema.rotulo`** | **Tema** | **Theme** | O nome do grupo dos dois botões do tema. Só é ouvido: quem não vê o cabeçalho recebe duas palavras soltas e não sabe de que é a escolha |
| **`tema.claro`** | **claro** | **light** | Em minúsculas nas duas edições: são as duas metades de um comando de aparelho, como `densidade.abrir`/`fechar`, e não títulos. O inglês não é «clear»: o par é o par de temas, e em inglês um tema claro é «light» |
| **`tema.escuro`** | **escuro** | **dark** | O mesmo. É também, à letra, o valor que se guarda no aparelho do leitor — mas a cadeia visível e o valor guardado são duas coisas: o valor é `'dark'` nas duas edições, e a palavra segue a edição |
| **`cobertura.semLinhaAinda`** | **sem linha ainda** | **no row yet** | A terceira palavra da cobertura, e é de outra escala. «sem página ainda» é sobre o CONCELHO; esta é sobre uma MEDIDA daquele concelho: a medida existe, a página ainda não tem uma linha para ela. «row» e não «entry» ou «record», porque «linha» é a palavra que o sítio inteiro usa para uma linha do livro-razão, e é ela que o selo abre |
| **`inicio.mapa.posicao`** | Os pontos são todos iguais e marcam a posição de cada concelho na Carta Administrativa, e mais nada: não marcam cobertura, qualidade nem importância. | The points are all alike and mark where each concelho sits on the official administrative map, and nothing else: they do not mark coverage, quality or importance. | **cadeia nova, e não uma relocação.** Substitui `inicio.mapa.naoDiz`, que a Emenda 10 tornou falsa: a antiga começava por «O ponto aceso», e desde esta ronda nenhum ponto vem aceso. O inglês diz «where each concelho sits on the official administrative map» e não «its position on the CAOP», pela mesma razão que a antiga o dizia: a sigla não é um nome que se leia em inglês, e a Carta é o que ela é. «concelho» fica em português, como já acontece em `municipios.h1` e em `inicio.mapa.coberturaB` |

**Saíram duas chaves, nas duas edições:** `inicio.cabeca.estadoRotulo` («Estado das
medidas» / «State of the measures»), que era o nome do grupo da fila de estados
que a Emenda 13 retirou da cabeça; e `inicio.mapa.naoDiz`, substituída pela de
cima. Saiu também `METHOD_LINE`, que não é uma chave de `strings.mjs` mas era
texto público: vivia em `site.config.mjs`, declarada como identidade e não
traduzida, e a Emenda 11 mandou-a sair da mobília.

`node scripts/medir-invariancia.mjs --chaves` imprime **14 chaves** com o mesmo
valor nas duas edições — o mesmo número da 2f, da 2g, da 2h e da 2i, e nenhuma
nova. As quatro cadeias desta ronda têm inglês próprio.

### Etapa 3
*(por preencher: `linha.*`, `livro.*`, `municipios.*`, `municipio.*`)*

### Etapa 4
*(escrita mais abaixo, subetapa a subetapa: commit 4-0, 4a, 4b e 4c.)*

### Etapa 5 · **nenhuma chave nova, e é o resultado e não uma omissão**

A etapa 5 construiu os 532 cartões de partilha e **não acrescentou uma única
cadeia** ao `src/i18n/strings.mjs`. Não havia família `cartao.*` a preencher: um
cartão que precisasse de palavras próprias estaria a dizer, a quem o vê fora do
sítio, uma coisa que a página não diz — e a §5 do plano proíbe exactamente isso
(«nunca uma cadeia escrita à mão»).

O cartão diz-se todo com chaves que já existiam, e as duas edições saem da mesma
chamada a `t(lang)`:

| o que o cartão mostra | chave, e de onde ela já vinha |
|---|---|
| a marca | `SITE_NAME` de `site.config.mjs`, que não é traduzida (está nas «Identidades aceites») |
| a sobrancelha da primeira página | `inicio.cabeca.paisA` · «Portugal · país» / «Portugal · country» |
| a sobrancelha de uma página de linha | `livro.linha.eyebrow` · «Linha do livro-razão» / «Ledger row» |
| a manchete da primeira página | `inicio.cabeca.tituloPaisA` + `tituloPaisUm`/`tituloPaisMuitos` + `tituloPaisFim`, com as duas contagens da prova pelo meio, como `Cabeca.astro` as compõe |
| as palavras de estado | `estado.foraDoLimiar`, `estado.dentroDoLimiar`, `estado.semLimiar` · o vocabulário fechado |
| o pé de uma página de linha | `prov.fonte` («Fonte» / «Source») e `prov.lido` («Lido a» / «Read on») |
| o pé da primeira página | `sinal.reconferido` · «Painel europeu reconferido a» / «European panel re-checked on» |
| a manchete de uma página de linha | nenhuma chave: é `valorComUnidade(claim)`, o valor e a unidade da própria linha |

**O que a revisão de voz tem de ler**, e é o único ponto novo: o versalete do
cartão é desenhado em minúsculas, porque em SVG não há `text-transform` e a
Spectral SC desenha os versaletes nas minúsculas. A cópia registada é a
minúscula («linha do livro-razão», «ledger row», «outside the threshold»), e é
essa a cadeia que o portão confere. Nenhuma palavra muda; muda a caixa, como já
mudava na folha de estilos.

**A largura das duas edições não é a mesma, e isso mudou o desenho.** «outside
the threshold» e «within the threshold» são mais compridas do que «fora do
limiar» e «dentro do limiar»: na primeira rendição a fila de estados da edição
inglesa saía pela margem fora. A fila passa a quebrar em duas linhas quando não
cabe numa — o desenho é o mesmo nas duas edições, o que muda é onde ele parte.
Está medido na nota da etapa, §5.

### Etapa 2l · a segunda leitura da pré-visualização n.º 1 (Emendas 15 a 17)

**Seis cadeias novas, uma mudada e trinta e três retiradas.** A lista inteira, com o que cada retirada dizia e para onde foi o que ela dizia, está em `RELOCACOES.md`, «Etapa 2, subetapa 2l». Aqui fica o que a revisão de voz tem de ler em inglês.

| chave | pt | en | nota para a revisão de voz |
|---|---|---|---|
| `inicio.cabeca.tituloPaisA` | `Portugal ultrapassa ` | `Portugal breaches ` | a manchete da Emenda 16, verbatim do lugar de direção. **Não é tradução livre**: as duas edições foram escritas pelo diretor |
| `inicio.cabeca.tituloPaisUm` | ` limiar do Procedimento dos Desequilíbrios Macroeconómicos e cumpre ` | ` threshold of the Macroeconomic Imbalance Procedure and meets ` | o singular, escolhido na construção |
| `inicio.cabeca.tituloPaisMuitos` | ` limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre ` | ` thresholds of the Macroeconomic Imbalance Procedure and meets ` | o plural. «Macroeconomic Imbalance Procedure» é o nome oficial em inglês do Procedimento |
| `inicio.cabeca.tituloPaisFim` | `.` | `.` | pontuação. Identidade aceite |
| `inicio.cabeca.ledePaisPartes` | `Fora do limiar: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação, em ` + `{ ref: '2025' }` + `.` | `Outside the threshold: government debt, net international investment position, unit labour cost and house prices, in ` + `{ ref: '2025' }` + `.` | a lede da Emenda 16, verbatim. O ano é `data-de-referencia` e não prosa |
| `inicio.cabeca.paisA` | `Portugal · país` | `Portugal · country` | o rótulo do âmbito, na gramática dos outros três. Deixou de contar |
| `inicio.social.titulo` | `Painel Social Europeu` | `European Social Scoreboard` | o nome que a instituição dá ao painel |
| `inicio.social.porta` | `O livro-razão` | `The ledger` | a porta para o resto do livro-razão |
| `inicio.portas.rotulo` | `As páginas` | `The pages` | **só se ouve**: é o nome da região de navegação das três portas |
| `inicio.portas.concelhos` | ` concelhos` | ` concelhos` | **identidade aceite**, pela mesma razão de `coberturaB`: «concelho» fica em português na edição inglesa |
| `inicio.mapa.linha` | ` concelhos · CAOP ` | ` concelhos · CAOP ` | **identidade aceite**: «concelhos» pela mesma razão, e «CAOP» é a sigla da Carta |
| `inicio.banda.svgLabel` | `Régua da convergência: o PIB per capita de cada região contra a média europeia.` | `Convergence rule: GDP per capita of each region against the European average.` | o nome acessível do desenho. Sem algarismos, de propósito: a escala está escrita no rótulo |
| `porta.k` | `Encontrou um erro?` | `Found an error?` | **mudou**: era «Encontrou um erro» / «Found an error». A Emenda 17 escreve a porta como pergunta |
| `prov.verLinha` | *(retirada)* | *(retirada)* | o texto oculto do selo passa a «fonte · <estudo>», e a palavra que o abre é a que o selo já escreve à vista. **É a cadeia mais rendida do sítio**: muda em 322 rotas |

**As nove medidas novas do Procedimento e as cinco do Painel Social trazem nome e linha de unidade nas duas edições, e vivem em `src/data/figuras.mjs` e não em `strings.mjs`** — como as oito que já lá estavam, porque são conteúdo da medida e não moldura da casa. A revisão de voz tem de as ler na mesma:

| linha | pt | en |
|---|---|---|
| `desempenho-das-exportacoes-2025` | Quota nas exportações | Share of exports |
| `divida-das-empresas-2025` | Dívida das empresas | Corporate debt |
| `divida-das-familias-2025` | Dívida das famílias | Household debt |
| `fluxo-de-credito-as-empresas-2025` | Fluxo de crédito às empresas | Credit flow to corporations |
| `fluxo-de-credito-as-familias-2025` | Fluxo de crédito às famílias | Credit flow to households |
| `saldo-da-balanca-corrente-2025` | Saldo da balança corrente | Current account balance |
| `taxa-de-actividade-2025` | Taxa de atividade | Activity rate |
| `taxa-de-cambio-efectiva-real-2025` | Taxa de câmbio efetiva real | Real effective exchange rate |
| `taxa-de-desemprego-mip-2025` | Taxa de desemprego | Unemployment rate |
| `taxa-de-desemprego-2025` | Taxa de desemprego | Unemployment rate |
| `desemprego-de-longa-duracao-2025` | Desemprego de longa duração | Long-term unemployment |
| `jovens-nem-2025` | Jovens sem emprego, escola ou formação | Young people not in employment, education or training |
| `risco-de-pobreza-ou-exclusao-2025` | Risco de pobreza ou exclusão social | At risk of poverty or social exclusion |
| `racio-s80-s20-2025` | Desigualdade de rendimento | Income inequality |

**Duas linhas com o mesmo nome, e é de propósito**: `taxa-de-desemprego-mip-2025` e `taxa-de-desemprego-2025` são a mesma medida em dois quadros — o Procedimento publica-lhe um limiar de 10%, o Painel Social não publica nenhum —, e são duas linhas distintas do livro-razão, de dois conjuntos de dados distintos do Eurostat (`tipsun20` e `une_rt_a`). A Emenda 16 manda mostrar «os dois painéis como as instituições os publicam», e as instituições publicam-na nos dois.

### Etapa 3, commit 3-0

*Seis chaves novas, todas na família `municipios.*`, e um par mudado que não é uma chave nova.*

| chave | pt | en | nota |
|---|---|---|---|
| `municipios.parcelaContinente` | Continente | Mainland | a primeira das três parcelas da CAOP, que a Emenda 17 manda vir da primeira página para `/municipios`. A palavra é a de `inicio.mapa.continente`, retirada na 2l, sem uma letra mudada |
| `municipios.parcelaAcores` | Açores | Azores | a mesma, de `inicio.mapa.acores` |
| `municipios.parcelaMadeira` | Madeira | Madeira | a mesma, de `inicio.mapa.madeira`. **Identidade aceite**: nome próprio de um arquipélago, como já era |
| `municipios.parcelaTotal` | Total | Total | a soma das três, que é a quarta linha do livro-razão e não uma conta do gabarito. **Identidade aceite**: a mesma palavra nas duas línguas, como já era em `inicio.mapa.total` e antes dela em `home.instr2.total` |
| `municipios.dadosK` | A lista em ficheiro | The list as a file | o rótulo da porta do CSV dos 308, que sai da primeira página (ISSUES I34). Nomeia o que a coisa é, e não o que a casa fez com ela (Emenda 15) |
| `municipios.dadosLink` | descarregar os dados (CSV) | download the data (CSV) | a porta em si. As palavras são as de `home.dadosLink`, sem uma mudada: é a mesma porta noutra página |

**Um par com forma nova, e não é chave nova**: `home.metaDescription`, nas duas edições. Dizia «Observatório de dados sobre Portugal. Cada número publicado tem uma linha no livro-razão, com fonte, documento e data de acesso.» / «A data observatory on Portugal. Every published figure has a row in the ledger, with source, document and access date.» A segunda frase é o método do próprio sítio, que é a classe que a Emenda 15 tira das páginas do leitor, e o `<head>` é superfície pública como o corpo. Passa a **«Portugal nos painéis europeus: os indicadores, os limiares e as fontes.»** / **«Portugal on the European scoreboards: the indicators, the thresholds and the sources.»**, no texto exacto da decisão 1 da direção de 21.08.2026.

### Etapa 3, subetapa 3c

*Nenhuma chave nova. Duas relocadas com as mesmas palavras, quatro retiradas e uma aparada: estão em `RELOCACOES.md`.*

| chave | pt | en | nota |
|---|---|---|---|
| `municipios.coberturaA` | ` de ` | ` of ` | de `inicio.mapa.coberturaA` |
| `municipios.coberturaB` | ` concelhos · ` | ` concelhos · ` | de `inicio.mapa.coberturaB`. **Identidade aceite**, pela razão que a 2l já tinha escrito: «concelho» fica em português na edição inglesa |

### Etapa 3, subetapa 3b

*Duas chaves novas, e quatro retiradas (as retiradas estão em `RELOCACOES.md`).*

| chave | pt | en | nota |
|---|---|---|---|
| `livro.contaAfirmacoes` | afirmações | claims | a palavra ao lado da chave da prova `afirmacoes`. Não é o número: o número entra por `data-prova` e o portão reconta-o |
| `livro.contaDerivadas` | calculadas | calculated | a mesma coisa para `derivadas`. «calculadas» e não «derivadas», que é a palavra do formato e não a do leitor; é a mesma palavra que o selo de uma linha derivada já escreve («calculado ·») |

### Etapa 3, subetapa 3a

*Três chaves novas, todas em `livro.linha.*`. Nenhuma cadeia sai, e nenhuma muda de forma.*

| chave | pt | en | nota |
|---|---|---|---|
| `livro.linha.conjuntoK` | O conjunto inteiro | The whole dataset | o rótulo das duas portas do conjunto de dados, ao pé da porta do JSON da própria linha, dentro de «Acesso aos dados». São os mesmos dois ficheiros que o índice do livro-razão oferece, sob a mesma licença; o que muda é a distância |
| `livro.linha.noutroSitioK` | Esta linha noutro sítio | This row elsewhere | o rótulo do bloco que a `IDENTIDADE.md` §11 pede ao aparelho, a seguir ao acesso aos dados |
| `livro.linha.noutraEdicao` | Esta linha na edição inglesa | This row in the Portuguese edition | a porta desse bloco, e a única «noutro sítio» que a casa pode provar para todas as 132 linhas sem inventar um índice de superfícies. As duas cadeias nomeiam a edição de destino, e por isso não são a mesma frase traduzida |

### Etapa 2m

*A lede do País deixa de ser uma frase escrita e passa a ser construída. Sai
`inicio.cabeca.ledePaisPartes` (a frase inteira, nas duas edições) e entram as
cinco palavras de gramática com que ela se monta. **Nenhum nome de medida é
escrito aqui**: os nomes vêm de `figuras.mjs`, onde já estavam nas duas línguas
desde a 2l, e a construção só lhes baixa a primeira letra para os pôr no meio da
frase.*

| chave | pt | en | nota |
|---|---|---|---|
| `inicio.cabeca.ledePais.abre` | Fora do limiar:&nbsp; | Outside the threshold:&nbsp; | a abertura da lede, com o espaço final. É a primeira metade da frase que a Emenda 16 escreve, palavra por palavra |
| `inicio.cabeca.ledePais.separador` | ,&nbsp; | ,&nbsp; | a vírgula da lista. Igual nas duas edições, e por isso está em «Identidades aceites» |
| `inicio.cabeca.ledePais.ultimo` | &nbsp;e&nbsp; | &nbsp;and&nbsp; | a conjunção antes do último nome. É a gramática de lista de cada edição, e a inglesa não leva vírgula antes do «and» porque a redação da Emenda 16 não a leva |
| `inicio.cabeca.ledePais.ano` | ,&nbsp;em&nbsp; | ,&nbsp;in&nbsp; | o que liga a lista ao ano. Só se rende quando as linhas nomeadas partilham o mesmo `reference_date`; quando não partilham, a frase acaba na lista |
| `inicio.cabeca.ledePais.fecha` | . | . | o ponto final. Pontuação, como `tituloPaisFim` |

**A frase construída é, hoje, a frase escrita, carácter a carácter**, nas duas
edições, e é esse o teste de aceitação desta mudança:

```
Fora do limiar: dívida pública, posição de investimento internacional, custo
unitário do trabalho e preços da habitação, em 2025.

Outside the threshold: government debt, net international investment position,
unit labour cost and house prices, in 2025.
```

### Etapa 4, commit 4-0 · uma chave nova, duas encurtadas, dez retiradas

| chave | pt | en | onde foi usada |
|---|---|---|---|
| **`livro.convergenciaK`** | **A régua da convergência, em ficheiro** | **The convergence rule, as a file** | **chave nova**: o rótulo do ficheiro cuja porta desceu da primeira página para o índice do livro-razão (relocação R13) |
| `livro.seloCheio` · `livro.seloTracejado` | proveniência completa · um campo por confirmar | provenance complete · one field unconfirmed | **encurtadas**: a legenda do selo passa a nomear os dois estados em vez de descrever o glifo desenhado ao lado |
| `inicio.mapa.svgLabel` | Mapa de pontos dos municípios de Portugal. | Point map of the municipalities of Portugal. | **encurtada**: a instrução de teclado sai do rótulo e fica só em `tecladoHint`, dentro do bloco que só se constrói onde o script que a torna verdadeira está carregado |
| `municipio.metaDescricaoB` | : população, poder de compra, emprego, empresas, dívida e execução orçamental. | : population, purchasing power, employment, enterprises, debt and budget execution. | **encurtada**: a segunda frase era o método do sítio na descrição do `<head>` |

**Retiradas nas duas edições, e nenhuma substituída:** `livro.grupoCompletasV`,
`livro.grupoPorConfirmarV`, `municipio.ledeA`, `municipio.ledeB`,
`municipio.relanceSub`, `municipio.breveSub`, `municipio.tempoBreve`,
`municipio.tempoAtribuicaoV`, `municipio.estudosV`. A lista com o que cada uma
dizia e porque saiu está em `RELOCACOES.md`, «Texto novo · Etapa 4, commit 4-0».

### Etapa 4, subetapa 4a · duas chaves novas, as duas para quem ouve a página

| chave | pt | en | onde foi usada |
|---|---|---|---|
| **`correcoes.valorAnteriorVh`** | **valor anterior: ** | **previous value: ** | **chave nova**: o prefixo em `.vh` do valor antigo, em cada entrada do registo de correções |
| **`correcoes.valorNovoVh`** | **valor novo: ** | **new value: ** | **chave nova**: o prefixo em `.vh` do valor novo |

**Porque são duas e não uma.** O brief pede o prefixo do valor antigo, «valor
anterior» / «previous value», e o do valor novo entra com ele por uma razão
medida e não por simetria: a forma da correção é o risco, o risco não se ouve, e
os cabeçalhos de coluna do registo são um `<div>` de `<span>`s que não se associa
a célula nenhuma. Sem o segundo prefixo, quem ouve uma entrada recebe «valor
anterior: 78,3 78» — dois números seguidos e nenhuma maneira de saber onde acaba
o primeiro. Nas atualizações é pior: a seta entre os dois é `aria-hidden`, e sem
prefixo ouviam-se só os dois algarismos. As duas vão **fora** do elemento marcado
com `data-correcao-campo`, para que o portão continue a comparar só o valor com o
do livro-razão.

**Nenhuma outra cadeia da 4a é nova.** O selo escreve `prov.selo` («fonte» /
«source»), que já existia, e a etiqueta vem do registo dos trabalhos.

### Etapa 4, subetapas 4b e 4c

**Subetapa 4a** — duas chaves, e estão escritas acima, na sua própria secção.

**Subetapa 4b · uma chave, e ela chegou aqui um commit tarde.** A 4b criou
`metodo.sumarioK` («Nesta página» / «On this page»), o rótulo do sumário no cimo
do Método, e **não a escreveu neste ficheiro no commit em que a criou**, que é o
que a regra manda. Fica dito assim em vez de ser posto em silêncio na 4c. Na 4c a
chave mudou de casa (ver a linha abaixo) e é essa a forma em que vive hoje.

| chave | pt | en | nota |
|---|---|---|---|
| `leitura.sumarioK` | Nesta página | On this page | o rótulo do sumário das páginas da família da leitura. Nasceu na 4b como `metodo.sumarioK`; passou para a família `leitura` na 4c, quando a Agenda precisou das mesmas duas palavras, para que não houvesse duas cópias da mesma cadeia. «On this page» é a forma corrente de um índice interno em inglês editorial, e não uma tradução literal de «Nesta página» |

**Subetapa 4c · nenhuma cadeia nova.** A Agenda **retirou duas** chaves
(`agenda.lede`, `agenda.origemNota`), **encurtou quatro** e **fundiu duas numa**
(`agenda.perguntaNotaSelada` + `agenda.perguntaNotaPorSelar` →
`agenda.perguntaNota`). As encurtadas e a fundida vão em `RELOCACOES.md`, com o
texto de antes e o de depois nas duas edições. As duas palavras dos estados
vazios são **«Nenhum até hoje.» / «None to date.»** e **«Sem critério.» / «No
criterion.»**: nenhuma delas é uma tradução literal da outra («none to date» é a
forma corrente inglesa; «nenhum até hoje» é a portuguesa), e as duas dizem a
mesma ausência.

**Subetapas 4d e 4e · nenhuma cadeia nova.** A 4d encurtou uma (`erro404.corpo`)
e a 4e retirou seis e encurtou uma, todas em `estudos.*`; o antes e o depois de
cada uma, nas duas edições, está em `RELOCACOES.md`. **Nada de novo entrou em
`strings.mjs` na etapa 4 além de `leitura.sumarioK`.**

## Identidades aceites (PT = EN de propósito)
Nomes próprios, códigos de série, identificadores de linha, «Eurostat», «INE», «DGAL», «IEFP», «CAOP», «UE-27», «O Estado do País». A régua da invariância imprime todas as chaves cujo valor é igual nas duas línguas; as que não estiverem nesta lista são erro.

- **Etapa 2, quatro identidades novas**, imprimidas por `node scripts/medir-invariancia.mjs --chaves`:
  `inicio.mapa.madeira` = «Madeira» (nome próprio de um arquipélago) e `inicio.mapa.total` = «Total»
  (a mesma palavra nas duas línguas, como já era em `home.instr2.total`);
  `inicio.mapa.coberturaB` = « concelhos · », porque **«concelho» fica em português
  na edição inglesa** — é a mesma decisão que `municipios.h1` («The concelhos of
  Portugal») já tomou, e a razão é que «municipality» e «concelho» não são a
  mesma unidade administrativa em todo o lado; e `inicio.cabeca.tituloVazioB` = «.»,
  que é pontuação e não uma palavra.

- **Etapa 2l, três identidades novas e duas retiradas.** `node scripts/medir-invariancia.mjs --chaves` imprime **15** chaves com o mesmo valor nas duas edições, onde a 2j imprimia 14. Entram `inicio.cabeca.tituloPaisFim` = «.» (pontuação, como `tituloVazioB`), `inicio.portas.concelhos` = « concelhos» e `inicio.mapa.linha` = « concelhos · CAOP » — as duas pela mesma razão que `coberturaB` tinha, que é «concelho» ficar em português na edição inglesa, mais a sigla da Carta. Saem `inicio.mapa.coberturaB` e `inicio.mapa.total`, com as cadeias que a Emenda 15 retirou.

- **Etapa 3, commit 3-0, duas identidades novas e nenhuma retirada.** `node scripts/medir-invariancia.mjs --chaves` imprime **17** chaves com o mesmo valor nas duas edições, onde a 2l imprimia 15. Entram `municipios.parcelaMadeira` = «Madeira» e `municipios.parcelaTotal` = «Total», pelas razões que as suas antecessoras em `inicio.mapa.*` já tinham: um nome próprio de arquipélago e uma palavra que se escreve igual nas duas línguas. Nenhuma sai: as duas que a 2l retirou já tinham saído da conta.

- **Etapa 3, subetapa 3c, uma identidade nova.** `municipios.coberturaB` = « concelhos · », que é a cadeia que `inicio.mapa.coberturaB` levava antes de a Emenda 15 a retirar da primeira página. A razão é a mesma de então, e a mesma de `municipios.h1`: «concelho» não se traduz nesta casa.

- **Etapa 2m, duas identidades novas e nenhuma retirada.** `node scripts/medir-invariancia.mjs --chaves` imprime **20** chaves com o mesmo valor nas duas edições, onde a etapa 3 imprimia 18 (17 no commit 3-0, mais `municipios.coberturaB` na 3c). Entram `inicio.cabeca.ledePais.separador` = «, » e `inicio.cabeca.ledePais.fecha` = «.», que são pontuação e não palavras — a mesma razão de `tituloPaisFim` e `tituloVazioB`. A vírgula da lista é a mesma nas duas línguas; o que muda entre elas é a conjunção, e essa está declarada à parte (`ultimo`, « e » / « and ») exactamente para que não fosse preciso fingir que a pontuação difere.

- **`nav.menu` = «Menu» nas duas edições** (etapa 1e). Não é português copiado do inglês nem inglês copiado do português: «menu» entrou no português pelo francês e é a palavra corrente em Portugal para esta coisa exacta, tanto no papel como no ecrã, e nenhuma alternativa portuguesa («opções», «secções», «navegação») diz o que este comando faz sem dizer outra coisa. Escreve-se igual e lê-se igual; o que muda entre as duas edições é o nome acessível do comando, que junta a palavra visível à etiqueta da região («Menu · Navegação principal» / «Menu · Main navigation»), e essa metade é diferente. Se a revisão de voz preferir outra palavra em português, é uma cadeia.
