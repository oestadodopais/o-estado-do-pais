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

### Etapa 3
*(por preencher: `linha.*`, `livro.*`, `municipios.*`, `municipio.*`)*

### Etapa 4
*(por preencher: `metodo.*`, `agenda.*`, `correcoes.*`, `estudos.*`)*

### Etapa 5
*(por preencher: `cartao.*`)*

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

- **`nav.menu` = «Menu» nas duas edições** (etapa 1e). Não é português copiado do inglês nem inglês copiado do português: «menu» entrou no português pelo francês e é a palavra corrente em Portugal para esta coisa exacta, tanto no papel como no ecrã, e nenhuma alternativa portuguesa («opções», «secções», «navegação») diz o que este comando faz sem dizer outra coisa. Escreve-se igual e lê-se igual; o que muda entre as duas edições é o nome acessível do comando, que junta a palavra visível à etiqueta da região («Menu · Navegação principal» / «Menu · Main navigation»), e essa metade é diferente. Se a revisão de voz preferir outra palavra em português, é uma cadeia.
