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

### Ronda pós-fusão, construtor B1 · nenhuma chave nova, uma reescrita nas duas edições

A faixa dos documentos alojados passou à mobília v3 (ISSUES I11) sem criar uma
única chave: `estudos.documentoFaixa` muda de texto, `estudos.documentoVoltar`
fica como está, e a linha de autoria da faixa saiu do código e não era uma chave
(era a constante `AUTHORSHIP_LINE` de `src/lib/documentos.mjs`).

| chave | pt (antes) | pt (agora) | en (antes) | en (agora) |
|---|---|---|---|---|
| `estudos.documentoFaixa` | Documento do estudo, tal como foi publicado | **Documento do estudo · edição de registo** | Study document, exactly as published | **Study document · edition of record** |

**A razão, e o que fica à revisão de voz.** O par é proposta do lugar de direção
para o «edition of record» do diretor, e está escrito no brief da B1. O que ele
troca é uma frase por um rótulo: «tal como foi publicado» descreve o cuidado com
que a casa alojou a obra, e é autorreferência de mobília no sentido da Emenda 15;
«edição de registo» nomeia o que a coisa é, que é o que uma legenda faz. A forma
com ponto meio é a da sobrancelha da casa, e o texto entra em caixa normal porque
o Spectral SC desenha as versaletes (`text-transform: lowercase`, como `.eyebrow`).
O `aria-label` da faixa é esta mesma cadeia, na caixa em que está escrita, para
que quem ouve a página ouça a faixa nomeada uma vez.

O inglês foi pensado e não copiado: «edition of record» é a expressão do diretor,
e «study document» mantém-se do par anterior. **Se a revisão de voz mudar uma
palavra, é uma cadeia e não uma etapa** (`assertKeyParity()` não vê valores, e por
isso esta linha existe).

## Parte 3 · P2 · a página de leitura (`/estudos/<slug>/texto`)

*Treze chaves novas, todas em `estudos.*`, no commit que constrói a rota. A voz
é a mesma da faixa do documento arquivado: **os rótulos nomeiam o que a coisa é,
e mais nada** (Emenda 15). Nenhuma delas fala do método, da verificação ou da
casa, e a rota lê autorreferência **0** nas oito páginas e nas duas edições.*

| chave | pt | en | nota |
|---|---|---|---|
| `estudos.textoEyebrow` | Documento do estudo · texto | Study document · text | A forma paralela ao rótulo da faixa do documento arquivado, `documentoFaixa` («Documento do estudo · edição de registo» / «Study document · edition of record»): as duas superfícies servem o mesmo documento, uma composta aqui e a outra byte a byte, e o antetítulo diz qual é qual. O separador é o ponto médio da casa |
| `estudos.textoLink` | Ler no sítio | Read on the site | A porta, na página do estudo, ao lado de «Ler o documento →» / «Read the document →». **«no sítio» e não «aqui»**: o par que a distingue é o documento alojado, e o que muda entre os dois é onde o documento é composto, não onde o leitor está. A seta é do gabarito, como em `documentoLink` |
| `estudos.textoLinhasK` | As linhas deste documento | The rows of this document | O nome da secção. «linha» é a palavra da casa para uma entrada do livro-razão, e aqui são as linhas do **motor** que o documento cita; o rótulo do campo, uma linha abaixo, di-lo por extenso |
| `estudos.textoLinhaK` | linha do motor | engine row | O rótulo do campo. «motor» é como esta casa chama ao ResearchHub em português, e «engine» é a palavra que o inglês do repositório já usa |
| `estudos.textoValorK` | o valor como a linha o guarda | the value as the row keeps it | Longo de propósito: o par com o rótulo seguinte é a única coisa que explica, sem uma frase, porque é que dois campos mostram números diferentes para a mesma linha |
| `estudos.textoImpressoK` | como este documento o imprime | as this document prints it | O outro lado do par. «este documento» e não «a página»: quem imprime é o documento, e a página transcreve-o |
| `estudos.textoOrigemK` | resumo de origem | source digest | «resumo» é a palavra da casa para um `sha256` (o `linha-alojado-resumo` da página de linha já a usa); «digest» é a palavra do formato do motor. O VALOR deste campo **não se traduz**: os 64 hexadecimais são um resumo, e `derivado`, `api-viva`, `raw-sem-manifesto`, `pdf-sem-resumo` e `portal-estatico` são valores de uma lista fechada do formato, não prosa |
| `estudos.textoLinhaDoLivro` | linha do livro-razão | ledger row | A porta longa, na entrada de uma linha que também atravessou para este livro-razão. É a mesma porta que o selo abre; a diferença é que aqui ela leva a palavra |
| `estudos.textoRegistoK` | O registo de conteúdo | The content record | O rótulo do bloco do aparelho que mostra o `origin_ref` e o resumo do registo. É o nome que o `publisher/REGISTOS.md` do motor dá à coisa, e o que a `DECISIONS.md` §1.64 já usa |
| `estudos.textoContaBlocos` | blocos | blocks | A palavra da faixa, a seguir ao número. Singular e plural não se distinguem: as oito edições têm 53 blocos ou mais |
| `estudos.textoContaAlgarismos` | algarismos | figures | **«figures» e não «digits»**: o que se conta são as referências do registo (`figures[]`), que são valores e não dígitos. Em português «algarismos» é a palavra que a `IDENTIDADE.md` §10 já usa para a mesma coisa |
| `estudos.textoContaComLinha` | com linha do livro-razão | with a ledger row | O terceiro troço da faixa. Diz quantas das figuras têm linha NESTE livro-razão, que é o que decide se levam selo |

**Identidades: nenhuma.** As treze cadeias diferem entre as duas edições.

**As palavras da faixa não entram no inventário de frases**, e a razão é a mesma
das outras origens declaradas: os três números vão marcados
`data-registo-conta`, que o portão reconta do registo em disco, e a régua exclui
um bloco que contenha uma origem declarada. Está escrito na secção da rota, no
`INVENTARIO-FRASES.md`.

O inglês foi pensado e não copiado, e as duas escolhas que mais o mostram são
«figures» (contra «digits») e «the value as the row keeps it» (contra «the
row's value»): a primeira nomeia o que o formato conta, a segunda mantém o par
com «as this document prints it», que é onde a divergência se lê. **Se a revisão
de voz mudar uma palavra, é uma cadeia e não uma etapa** (`assertKeyParity()`
não vê valores, e por isso esta linha existe).

## Parte 3 · correções 1 · a porta que vai a seguir a uma ligação do documento

*Uma chave nova, em `estudos.*`, na ronda de correções da parte 3. É o nome
acessível da porta que a `DECISIONS.md` §1.64 descreve: onde uma figura está
dentro de uma ligação do próprio documento, a porta vai imediatamente depois da
ligação e não tem texto nenhum (o glifo é da folha), e por isso o nome dela é um
`aria-label`.*

| chave | pt | en | nota |
|---|---|---|---|
| `estudos.textoPortaDaLinha` | linha do motor | engine row | As mesmas palavras de `estudos.textoLinhaK`, e é chave própria de propósito: aquela é o **rótulo de um campo** na secção «As linhas deste documento», e esta é o **nome de uma porta** que só quem ouve a página encontra. Uma revisão de voz pode querer mudar uma sem mudar a outra, e com uma chave só isso deixava de ser possível. O valor rende-se com o identificador da linha do motor a seguir, separado por dois pontos: `aria-label="linha do motor: tc-report-16-2018"` / `aria-label="engine row: tc-report-16-2018"`. O identificador **não se traduz**, pela mesma razão do valor do campo «resumo de origem»: é um identificador do formato do motor, e não prosa |

**Identidades: nenhuma.** As duas cadeias diferem entre as duas edições.

**A porta não entra no inventário de frases**, e não é por dispensa: a régua
conta blocos de texto, e a âncora não tem texto nenhum. Medido depois da ronda:
**91 frases distintas e 2 542 ocorrências** em todo o sítio, os mesmos números de
antes dela, e autorreferência **0** nas oito rotas `texto`.

### Correções de UX de 25.08.2026, bloco A · uma chave nova e um rótulo mudado

| chave | pt | en | nota |
|---|---|---|---|
| **`identidade`** | **Um observatório de Portugal.** | **An observatory of Portugal.** | **Chave nova (Emenda 18, item A11).** As palavras são do diretor, nas duas edições, e entram tal como ele as escreveu: não se compõem, não se encurtam e não se traduzem uma da outra. Rende-se por baixo da marca **na primeira página e em mais lado nenhum**, na letra da prosa e no corpo da mobília. É o nome da publicação dito por extenso, e é por isso que o inventário a classifica em navegação: não fala do método, da verificação nem das intenções da casa. A chave vive na raiz de `strings.mjs`, ao lado de `outraLingua`, e não dentro de `inicio`, porque é do sítio e não da primeira página, mesmo que hoje só ela a renda |
| `ambito.municipio` | **Concelho** (era «Município») | Municipality (sem mudança) | **Rótulo mudado, item A2.** É a palavra que o resto da primeira página já usa: a pesquisa diz «Escreva o nome do concelho» e a legenda do mapa diz «308 concelhos». Um comando que chama à mesma coisa outro nome faz o leitor procurar duas coisas. **A edição inglesa fica como está**, e é uma escolha e não um esquecimento: «concelho» por traduzir na interface inglesa é o achado C12 da auditoria, que é do bloco B e tem de ser decidido de uma vez para todas as superfícies (a pesquisa, o índice dos 308, a página do concelho), e não meia decisão neste comando |

**Duas chaves ficaram sem superfície, e ficam escritas.** `ambito.regiao` («Região» / «Region») e `ambito.regioesMeta` saíram do comando com a terceira posição (item A2), e as três de `inicio.movel` («Abrir um concelho», «Ver uma região», «Abrir a escolha de concelho») saíram com os destinos do telemóvel e com o selo do mapa (itens A2 e A4). Nenhuma se apaga: a primeira volta ao comando com a página das regiões, e as outras voltam com o mapa por distritos que a Emenda 3 desenha para o telemóvel. A razão está escrita ao lado de cada uma em `src/i18n/strings.mjs`.

**Identidades: nenhuma nova.** As duas cadeias de `identidade` diferem entre as duas edições, como devem.

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

### Correções de UX · bloco B (25.08.2026)

**Chaves novas.**

| chave | pt | en | nota |
|---|---|---|---|
| `estudos.documentoNota` | A edição de registo, tal como foi publicada. | The record edition, as it was published. | item B2. Nomeia o que a coisa é, e não porque se deve confiar nela: a Emenda 15 permite uma legenda que nomeia e proíbe uma que se justifica |
| `estudos.textoSubir` | Subir | Back to top | item B4. O comando fixo do telemóvel. Em inglês a forma corrente é a longa, e não «Up»: um comando de uma palavra que não diz para onde não é o mesmo comando |
| `livro.contaDe` | de | of | item B7. A preposição do denominador, «128 **de** 136 linhas» |
| `livro.grupoCompletasFrase` | linhas com proveniência completa | rows with complete provenance | item B7 |
| `livro.grupoPorConfirmarFrase` | linhas com campos por confirmar | rows with fields to confirm | item B7 |
| `livro.linha.identificadorK` | identificador | identifier | item B7. O rótulo do id da linha, na letra dos rótulos do aparelho |

**Chaves retiradas, nas duas edições.**

| chave | porquê |
|---|---|
| `estudos.descricaoRotulo` · `estudos.descricaoDoDocumentoRotulo` · `estudos.descricaoTraduzidaRotulo` | item B1. Diziam ao leitor o que a descrição era («reformulação do título», «frase de abertura do documento», «tradução da casa»), que é o sítio a descrever a sua própria descrição. A transcrição continua conferida por `data-verbatim` |
| `livro.grupoCompletasK` · `livro.grupoPorConfirmarK` | item B7. O nome do estado por cima de um número solto era a mesma coisa em duas metades que não se liam sozinhas; o título do grupo passa a ser a frase inteira |

**«Concelho» sai da interface inglesa (item B6, achado C12).** Dezoito chaves de
`strings.mjs` e vinte e cinco ocorrências da prosa da casa em
`src/data/municipios.mjs` e `src/data/leituras.mjs`. A regra é a do brief:
«municipality» na interface, e «concelho» só onde é o nome de uma coisa
portuguesa citada.

| chave | en, antes | en, agora |
|---|---|---|
| `ambito.pesquisaRotulo` | Type the name of the concelho | Type the name of the municipality |
| `ambito.pesquisaSemResultado` | No concelho by that name. | No municipality by that name. |
| `inicio.cabeca.tituloEvora` | The measures of the concelho, each with its own row. | The measures of the municipality, each with its own row. |
| `inicio.cabeca.ledeVazioA` | …where the concelho sits… | …where the municipality sits… |
| `inicio.movel.abrirConcelho` | Open a concelho | Open a municipality |
| `inicio.movel.seloDaEscolha` | Open the concelho chooser | Open the municipality chooser |
| `inicio.portas.concelhos` | ` concelhos` | ` municipalities` |
| `inicio.mapa.linha` | ` concelhos · CAOP ` | ` municipalities · CAOP ` |
| `inicio.mapa.escolher` | Tap a point to choose the concelho. | Tap a point to choose the municipality. |
| `inicio.mapa.trocar` | change concelho | change municipality |
| `municipios.metaDescription` | Every concelho in Portugal… | Every municipality in Portugal… |
| `municipios.h1` | The concelhos of Portugal | The municipalities of Portugal |
| `municipios.lede` | Every concelho, from the Carta Administrativa… | Every municipality, from the Carta Administrativa… |
| `municipios.coberturaB` | ` concelhos · ` | ` municipalities · ` |
| `municipios.mapaLink` | The map of concelhos | The map of municipalities |
| `municipio.distanciaLegenda` | …the regulator publishes for the concelho… | …the regulator publishes for the municipality… |
| `municipio.estudosK` | The works about this concelho | The works about this municipality |
| `estudos.municipioK` | The concelho it is about | The municipality it is about |

**O que fica em «concelho», e é uma leitura e não um esquecimento:** o título de
um trabalho; o nome próprio «Carta Administrativa Oficial de Portugal»; o título
de um documento da fonte, como «SIE · Desemprego registado por concelhos», que é
um campo do livro-razão; o corpo de uma edição arquivada, que é obra citada
alojada byte a byte; e a prosa das correções que o motor escreve com a linha
(`reason_en`), que reescrever deste lado era o sítio a escrever o que o motor
declara (`DECISIONS.md` §1.31).

**Uma ambiguidade que a tradução criou, e que foi desfeita.** O inglês já usava
«municipality» para o município como INSTITUIÇÃO; com «concelho» a passar a
«municipality» para o TERRITÓRIO, duas frases ficaram a dizer «the university
holds more contracted money in this municipality than the municipality». As duas
passam a dizer «council» onde falam da câmara, que é a palavra que o mesmo
ficheiro já usava («Recovery-plan money is attributed by the register, not by the
council»).

## Emenda 19 · o mapa da primeira página é navegação (26.08.2026)

**Nenhuma chave nova, nas duas edições. Nove chaves retiradas, e uma porta com
outro destino.** A vista de escolha da primeira página saiu inteira e com ela os
estados `?ambito=municipio:<slug>`; as cadeias que saem são as dos dois blocos de
concelho da cabeça, a dica de escolher um ponto no mapa e a segunda porta do
cartão localizador. Nenhuma delas tinha superfície depois da emenda, e uma cadeia
sem superfície é uma promessa que ninguém pode ler.

| chave | pt | en | porquê sai |
|---|---|---|---|
| `inicio.cabeca.municipioSufixo` | ` · município` | ` · municipality` | era o âmbito das peças do painel de Évora na primeira página; esse painel saiu (Emenda 19a) e a página do concelho não o usa |
| `inicio.cabeca.municipioPalavra` | ` · município · ` | ` · municipality · ` | o rótulo dos dois blocos de concelho da cabeça |
| `inicio.cabeca.tituloEvora` | As medidas do concelho, cada uma com a sua linha. | The measures of the municipality, each with its own row. | a manchete do bloco de Évora, que era a cabeça de `/municipios/evora` rendida outra vez na primeira página |
| `inicio.cabeca.tituloVazioA` · `inicio.cabeca.tituloVazioB` | «Ainda sem linhas para » · «.» | «Still no rows for » · «.» | a manchete do bloco do concelho sem linhas |
| `inicio.cabeca.ledeVazioA` · `inicio.cabeca.ledeVazioB` | «O ponto marca a posição do concelho na Carta Administrativa, e não cobertura. Quando houver linhas para » · «, entram aqui com a sua fonte e a sua data de leitura.» | «The point marks where the municipality sits on the official administrative map, and not coverage. When there are rows for » · «, they will appear here with their source and their reading date.» | a lede do mesmo bloco. Já não se rendia desde a Emenda 15, que a tirou da página; sai agora com o bloco, porque é dele |
| `inicio.mapa.escolher` | Toque num ponto para escolher o concelho. | Tap a point to choose the municipality. | a terceira frase da descrição acessível do mapa. Descrevia a escolha, que saiu: um ponto com página é uma ligação, e um destino diz-se na ligação e no seu `<title>` |
| `inicio.mapa.paginaInteira` | a página inteira, com quem governou | the whole page, with who governed it | a segunda porta do cartão localizador, escondida do servidor e acesa pelo script quando o concelho escolhido tinha página. Sem concelho escolhido nunca acendia; e onde o cartão se rende, na página do concelho, ela apontava para a página em que já se está |

**As que ficam, e onde.** `inicio.mapa.trocar` («trocar de concelho» /
«change municipality») fica: rende-se no cartão localizador, que vive na página
do concelho, e o seu destino passa de `/?ambito=municipio` para o índice dos 308
(`/municipios` · `/en/municipalities`). `densidade.fechar` («fechar» / «close»)
fica: era o rótulo do comando de sair da vista, que saiu, mas a peça do painel
rende-a desde a etapa 2. `inicio.cabeca.distritoDe` fica: é o prefixo do distrito
na leitura em voz alta do mapa.


## Bloco dos 308 concelhos · P2 (a estrutura), 26.08.2026

**As chaves novas.** Duas famílias: os dois rótulos das medidas que desceram das
peças para a camada das contas de Évora (decisão D2 do diretor), e a página do
conjunto do livro-razão (decisão D6), que é uma página nova e traz o seu bloco.

| chave | pt | en | nota |
|---|---|---|---|
| `municipio.contasExecucao` | Execução da receita | Revenue execution | o nome da medida, sem uma palavra nova: o que muda é o sítio onde se lê |
| `municipio.contasPrazoMedio` | Prazo médio de pagamento | Average payment time | idem |
| `municipio.contasPrazoMedioUnidade` | dias | days | a unidade ao pé do valor, como o «€» dos campos de cima |
| `livro.contaConcelhos` | linhas de concelhos | municipality rows | a terceira parcela da linha de contagens do índice do livro-razão |
| `livro.concelhosPorta` | Concelhos | Municipalities | a porta da página do conjunto, no índice. «Municipalities» e não «Concelhos»: a interface inglesa não usa a palavra portuguesa (item B6 de 25.08) |
| `livroConcelhos.metaTitle` | Concelhos · Livro-razão · O Estado do País | Municipalities · Ledger · O Estado do País | |
| `livroConcelhos.metaDescription` | As linhas do livro-razão com as medidas que as fontes centrais publicam para cada concelho, uma linha cada. | The ledger rows with the measures central sources publish for each municipality, one row each. | |
| `livroConcelhos.lede` | Uma linha por medida e por concelho, com o valor tal como a fonte o publicou, a unidade, quem o produziu e a data em que foi lido. | One row per measure and per municipality, with the value as the source published it, the unit, who produced it and the date it was read. | a lede nomeia o que uma linha guarda, como a do índice |
| `livroConcelhos.contaLinhas` | linhas | rows | |
| `livroConcelhos.contaConcelhos` | concelhos | municipalities | |
| `livroConcelhos.contaCompletas` | com proveniência completa | with complete provenance | as mesmas palavras do índice, sem uma mudada |
| `livroConcelhos.vazioV` | Ainda não há linhas deste estudo no livro-razão. | There are no rows of this study in the ledger yet. | o estado vazio desenhado (IDENTIDADE §7): diz o que não há, e não pede desculpa |
| `livroConcelhos.naoDeclaradasK` | Linhas sem concelho declarado | Rows with no municipality declared | o grupo das linhas do estudo que nenhuma entrada de concelho declara |
| `livroConcelhos.voltarLivro` | O livro-razão inteiro | The whole ledger | |
| `livroConcelhos.indiceLink` | O índice dos concelhos | The index of municipalities | |

**O título da página não é uma chave**, e é decisão: é o nome do estudo, e vem de
`src/data/studies.mjs` («Concelhos: as medidas centrais» / «Municipalities: the
central measures»). Escrevê-lo aqui outra vez seriam dois nomes para a mesma
coisa, e o mesmo nome já rende dentro de cada selo das linhas deste estudo.

**Uma chave sai, nas duas edições.**

| chave | pt | en | porquê sai |
|---|---|---|---|
| `municipios.comPaginaK` | Com página | With a page | era o título da secção que listava os concelhos com página antes da lista por distritos, e existia porque um em 308 a tinha. Com os 308, a secção era a lista inteira repetida por cima da lista inteira |

**As que ficam, e a razão.** «sem linha ainda» / «no row yet» (`cobertura.semLinhaAinda`)
passa a render-se muito mais: era o estado de uma medida sem linha e passa a ser
o de 2 464 peças com o ficheiro de teste. Nem uma palavra muda: é a mesma
ausência dita nas mesmas duas palavras. E a prosa nova de `src/data/` (a nota da
dívida com a coluna que usa, e a do prazo médio lido do regulador) vai nas duas
línguas ao lado dos ids, como o resto daquele ficheiro:

| onde | pt | en |
|---|---|---|
| nota da medida 5 | Série anual da Direção-Geral das Autarquias Locais, o regulador das contas municipais. Exclui dívidas não orçamentais e exceções legais. | The annual series of the local-government directorate, the regulator of municipal accounts. Excludes non-budgetary debt and legal exceptions. |
| nota da medida 8 | Lista anual da Direção-Geral das Autarquias Locais, o regulador das contas municipais. | The annual list of the local-government directorate, the regulator of municipal accounts. |
| nome da medida 4 | Empresas não financeiras | Non-financial enterprises |
| etiqueta de um concelho gerado | distrito de \<nome\> | district of \<nome\> |

## Bloco dos 308 concelhos · a leitura de fora (E7 a E12), 26.08.2026

**Nenhuma chave nova.** Os seis itens mudaram o TEXTO de cadeias que já existiam,
nas duas edições, e uma delas encurtou. Ficam aqui as duas edições de cada uma,
lado a lado, que é para o que este ficheiro serve.

| onde | pt | en |
|---|---|---|
| nota da medida 4 (E7) | Sistema de contas integradas das empresas; cada empresa conta num único concelho. | Integrated business accounts; each enterprise counts in a single municipality. |
| leitura breve de Évora (E7) | O concelho tem N empresas não financeiras. | The municipality has N non-financial enterprises. |
| ressalva do método (E7) | …as contas das empresas do concelho, que creditam toda a atividade de uma empresa a um único concelho. | …the accounts of the municipality’s enterprises, which credit a firm’s whole activity to a single municipality. |
| `municipio.distanciaLei` (E10) | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. |
| nota da medida 5 (E11) | Série anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. Exclui dívidas não orçamentais e exceções legais. | The annual series of the local-government directorate, which publishes the municipalities’ accounts data. Excludes non-budgetary debt and legal exceptions. |
| nota da medida 6 (E11) | Calculado sobre duas colunas do mesmo ficheiro da Direção-Geral das Autarquias Locais. A aritmética está na linha. | Computed from two columns of the same local-government directorate file. The arithmetic is on the row. |
| nota da medida 8 (E11) | Lista anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. | The annual list of the local-government directorate, which publishes the municipalities’ accounts data. |
| `municipio.distanciaLegenda` (E11) | O traço fino é a dívida total que a Direção-Geral das Autarquias Locais publica para o concelho… | The thin line is the total debt the local-government directorate publishes for the municipality… |
| `municipio.contasDivergenciaRegulador` (E11) | A Direção-Geral publica | The directorate-general publishes |
| `municipio.tempoRegulador` (E11) | A Direção-Geral | The directorate-general |
| `municipio.tempoSerieA` (E11) | O índice de dívida da Direção-Geral desceu de | The directorate-general’s debt index fell from |

**A que saiu**, e fica declarada como autorreferência no `INVENTARIO-FRASES.md`
para que repô-la feche a construção: «É a lei que o define, não este sítio.» /
«The law defines it, not this site.»
