# Registo de relocações · redesenho v3, fase 1

*Regra (resposta 2 da direção à crítica cruzada, 20.08.2026): texto e números só se movem por uma relocação autorizada, escrita antes do movimento. Cada entrada diz a rota de origem, a rota de destino, o componente, o âmbito, a língua, a contagem de ocorrências (origem → destino, por edição) e a linha ou a chave da prova. O rótulo de âmbito visível e o valor movem-se como uma unidade. Não existe a exceção «já existia algures no sítio antigo». Uma frase de maqueta sem rota de origem e sem linha não é relocação: é texto novo, entra pelas cadeias com o seu inglês e fica listada em «Texto novo», para a revisão de voz.*

Estados: **autorizada** (escrita aqui antes da etapa), **feita** (a etapa confirmou as contagens na construção), **recusada** (com o motivo).

## Relocações

| id | origem (rota) | destino (rota) | componente | âmbito | língua | ocorrências (origem → destino) | linha ou chave | etapa | estado |
|---|---|---|---|---|---|---|---|---|---|
| R1 | `/` e `/en`, secção `#numeros`, células `.figura` | `/` e `/en`, o painel (`#painel`), peças Relance e Leitura breve | `figuras.mjs` → `Peca.astro` | País | pt, en | 8 nomes, 8 linhas de medida, 8 frases → 8 + 8 + 8 por edição (a peça aberta repete a frase da peça fechada; sem corte) | `divida-publica-2025`, `posicao-de-investimento-internacional-2025`, `custo-unitario-do-trabalho-2025`, `precos-da-habitacao-2025`, `taxa-de-emprego-2025`, `criancas-em-creche-2025`, `abandono-escolar-precoce-2025`, `sobrecarga-do-custo-da-habitacao-2025` | 2 | feita · 8 + 8 + 8 por edição, conferido na construção (as oito peças rendem nome, linha de medida e a frase INTEIRA; as frases curtas da prancha não entram) |
| R2 | `/municipios/evora` e `/en/municipalities/evora`, o relance (as oito medidas de `municipios.mjs`) | `/` e `/en`, o painel no âmbito Município = Évora, com o rótulo de âmbito «Évora · município» na mesma unidade | `municipios.mjs` → `Peca.astro` | Município (Évora) | pt, en | 8 → 8 + 8 (duplicação autorizada; a página do município mantém as suas) | `evora-populacao-2025`, `evora-poder-de-compra-2023`, `evora-desemprego-registado-2024`, `evora-empresas-2024`, `evora-divida-dgal-2024`, `evora-indice-de-divida-2024`, `evora-execucao-da-receita-2025`, `evora-prazo-medio-de-pagamento-2025` | 2 | feita · 8 → 8 + 8, conferido; a frase de cada peça é a `nota` do mosaico do relance, e não a frase da leitura breve, que o registo não autoriza mover |
| R3 | `/` e `/en`, secção `#mapa` (Instrumento n.º 2): a contagem da CAOP, as contagens por parcela, a legenda de cobertura, a frase «O que o mapa não diz», a fonte e a data de leitura | `/` e `/en`, a ficha do mapa na cabeça (âmbito País e escolha de concelho) | `InstrumentoMapa.astro` → `MapaRespira.astro` | País | pt, en | **a citação da CAOP 1 → 2 por edição; a frase de neutralidade 1 → 2 por edição; a linha de fonte compacta 1 por edição** (contagens medidas na etapa 2i; ver a nota) | `municipios-portugal-caop-2025`, `municipios-continente-caop-2025`, `municipios-acores-caop-2025`, `municipios-madeira-caop-2025`; chaves `municipios_com_pagina`, `municipios_total` | 2 | feita · 1 → 1 por edição; a secção `#mapa` saiu e a ficha entrou na cabeça, com a contagem por parcela, a legenda de neutralidade palavra por palavra e a fonte da CAOP. **Revista na 2g, mesma rota e mesmo âmbito**: a ficha ficou compacta (cobertura, neutralidade, contagens por parcela, e uma linha de fonte montada dos campos da própria linha da CAOP com o selo de sempre) e o resto do que a v2 publicava desceu para uma camada de fundo `<details>` por baixo do mapa — a citação inteira (`data-verbatim="caop-fonte"`, sem uma palavra mudada), a porta do CSV e as duas dicas de uso. O rótulo dessa camada é `inicio.mapa.deepTitulo`, que é `home.instr2.deepTitulo` relocado com a secção, e entra na contagem desta relocação: **13 chaves relocadas, e não 12**. **Contada na 2i, contra a construção, porque a contagem «1 → 1» não era verdade**: (a) a CITAÇÃO da CAOP aparece **duas vezes por edição** — na camada do aparelho por baixo do mapa e no estado vazio de um concelho sem página, as duas com `data-verbatim="caop-fonte"`, as duas conferidas carácter a carácter, e a segunda vem da mesma rota e do mesmo âmbito (`grep -o 'data-verbatim="caop-fonte"' dist/index.html \| wc -l` → 2, o mesmo em `dist/en/index.html`); (b) a LINHA DE FONTE COMPACTA da ficha é 1 por edição e **não é a citação**: são os campos `source`, `document.title` e `reference_date` da própria linha, com o selo de sempre (`grep -o 'mapa-fonte-curta' dist/index.html \| wc -l` → 1); (c) a FRASE DE NEUTRALIDADE passou a **2 por edição** na 2i — ficha e cartão localizador —, porque a ficha esconde-se na postura de localizador e a frase não pode desaparecer com o mapa que ela explica; é a mesma cadeia, palavra por palavra, e conta como a mesma relocação (achado 8 da leitura cruzada; célula «2i·3c» da matriz: 1 visível em cada uma das cinco posturas medidas). **Recontada na 2j, e a citação desceu de duas para uma por edição**: a Emenda 14 mandou o estado vazio de um concelho sem página render as oito medidas municipais como peças vazias «em vez de uma só caixa de estado vazio», e a caixa encolheu para a frase que explica o estado. Com ela saíram do estado vazio a contagem da CAOP com o seu selo e a segunda cópia da citação transcrita; as duas continuam na página, na camada de aparelho por baixo do mapa, que se lê em qualquer âmbito. Medido depois: `grep -o 'data-verbatim="caop-fonte"' dist/index.html \| wc -l` → **1**, o mesmo em `dist/en/index.html`; a linha de fonte compacta continua em 1 por edição; a frase que acompanha o mapa continua em 2 por edição, agora com a redação nova da Emenda 10 (ver «Texto novo · 2j») |
| R4 | `/` e `/en`, secção `#convergencia` (Instrumento n.º 1): a frase de cada região e as distâncias | `/` e `/en`, a banda da região (âmbito Região) e o Instrumento n.º 1 no âmbito País | `regioes.mjs` → `BandaDaRegiao.astro`, `InstrumentoConvergencia.astro` | País, Região | pt, en | **2 por região por edição** (a manchete do âmbito Região e o instrumento n.º 1); a de Portugal, 1 | `pib-pc-portugal-2024`, `pib-pc-grande-lisboa-2024`, `pib-pc-peninsula-de-setubal-2024`, `pib-pc-algarve-2024`, `pib-pc-madeira-2024`, `pib-pc-alentejo-2024`, **`pib-pc-alentejo-2000`**; `distancia-portugal-ue27-2024`, `distancia-grande-lisboa-ue27-2024`, `distancia-peninsula-de-setubal-ue27-2024`, `distancia-algarve-ue27-2024`, `distancia-madeira-ue27-2024`, `distancia-alentejo-ue27-2024`, **`distancia-alentejo-ue27-2000`**, `distancia-setubal-grande-lisboa-2024` | 2 | feita · **recontada na 2i, e a contagem antiga estava errada em dois sítios.** Estava «6 → 6 + 1 por região»; a construção dava **três** ocorrências por região e por edição — a manchete do âmbito, a PEÇA do painel regional (que recebia a mesma frase) e o instrumento n.º 1. A duplicação da peça foi **removida** e não autorizada: a frase da região é a manchete daquele âmbito, e a peça repetia-a logo por baixo, com o mesmo valor e o mesmo selo, no mesmo ecrã. É chamada de forma, e está escrita na nota. Medido depois: `grep -o 'O Alentejo está' dist/index.html \| wc -l` → **2** (era 3), e o mesmo para as outras quatro regiões; `grep -o 'Portugal está' dist/index.html \| wc -l` → **1**, porque Portugal deixou de ter âmbito e de ter manchete (achado 5). **Duas linhas que faltavam à lista**, e que o instrumento rende: `distancia-alentejo-ue27-2000` (2 por edição, na manchete do Alentejo e na frase do instrumento) e `pib-pc-alentejo-2000` (1, na proveniência por estudo do aparelho do instrumento) |
| R5 | `/` e `/en`: os textos das secções Municípios, Estudos e Agenda da página v2 | cortados: as portas de uma linha levam só contagens com porta; os textos vivem nas páginas próprias | `HomeView.astro` → `Portas.astro` | País | pt, en | 1 → 0 por edição | chaves `municipios_com_pagina`, `municipios_total`, `estudos`, `edicoes`, `agenda_em_curso`, `agenda_a_seguir`, `agenda_concluido`, `agenda_retirado` | 2 | feita · 1 → 0 por edição; as três portas levam só contagens com porta |
| R6 | `/municipios/evora`: a frase de abertura («Esta página mede o município de Évora e mostra de onde vem cada medida. Não interpreta: …») | `/` no âmbito Município = Évora, como lede | `municipios.mjs` → `Cabeca.astro` | Município (Évora) | pt, en | 1 → 1 + 1 (duplicação autorizada) | sem número | 2 | feita · 1 → 1 + 1; a frase passa a aparecer na primeira página e na página do município, e a régua dos defeitos conta-a como frase de moldura em 2 páginas |
| R7 | `/livro-razao/<id>` e `/en/ledger/<id>`: as nove linhas do Procedimento dos Desequilíbrios Macroeconómicos que a primeira página não mostrava | `/` e `/en`, o painel (`#painel`), como peças com marcador, palavra de estado, linha de limiar, valor, unidade e selo | `figuras.mjs` (`FIGURAS_PDM`) → `Peca.astro` | País | pt, en | **1 → 1 + 1 por linha e por edição** (a linha do livro-razão continua a existir; a primeira página passa a ser uma segunda superfície do mesmo valor) | `desempenho-das-exportacoes-2025`, `divida-das-empresas-2025`, `divida-das-familias-2025`, `fluxo-de-credito-as-empresas-2025`, `fluxo-de-credito-as-familias-2025`, `saldo-da-balanca-corrente-2025`, `taxa-de-actividade-2025`, `taxa-de-cambio-efectiva-real-2025`, `taxa-de-desemprego-mip-2025` | 2l | feita · **1 → 1 + 1**, conferido linha a linha na construção (`grep -o 'data-claim="<id>"' dist/index.html \| wc -l` → 1 para cada uma das nove, o mesmo em `dist/en/index.html`). **Nenhuma frase se move**: as nove peças levam nome, valor, unidade, estado e selo, e mais nada — a Emenda 16 não lhes dá frase, e escrever uma seria texto novo sem origem. As quatro que já lá estavam continuam sob R1, com as suas frases |
| R8 | `/livro-razao/<id>` e `/en/ledger/<id>`: as cinco linhas do Painel Social Europeu que a primeira página não mostrava | `/` e `/en`, a lista compacta do Painel Social Europeu (`#painel-social`): nome, valor, unidade, fonte e selo | `figuras.mjs` (`FIGURAS_SOCIAL`) → `ListaSocial.astro` | País | pt, en | **1 → 1 + 1 por linha e por edição** | `taxa-de-desemprego-2025`, `desemprego-de-longa-duracao-2025`, `jovens-nem-2025`, `risco-de-pobreza-ou-exclusao-2025`, `racio-s80-s20-2025` | 2l | feita · **1 → 1 + 1**, conferido com o mesmo comando. A lista sai do registo do motor (`ResearchHub/indicators/convergence.md`, quadro da §2, coluna «Social SB»), linha a linha, e cada entrada de `figuras.mjs` declara a LINHA do documento que a coloca. **`criancas-em-creche-2025` sai da primeira página** e não entra em nenhuma das duas listas: o documento não a coloca em painel nenhum e o livro-razão não nomeia o Painel Social em ficheiro nenhum (`grep -rin "social scoreboard\|painel social" ledger/claims/` → sem saída, exit 1, com controlo positivo). A sua frase é retirada; a linha continua a ter página e selo, atrás da porta do livro-razão. As três que já lá estavam (`taxa-de-emprego-2025`, `abandono-escolar-precoce-2025`, `sobrecarga-do-custo-da-habitacao-2025`) continuam sob R1, com as suas frases |
| R9 | `/` e `/en`, a ficha do mapa na cabeça: as três contagens por parcela da CAOP e os seus rótulos | `/municipios` e `/en/municipalities`, uma linha por baixo da cabeça da lista | `MapaRespira.astro` → `MunicipiosView.astro` | País → (a lista dos 308) | pt, en | **1 → 1 por edição** (saiu da primeira página na 2l; entra aqui na 3-0) | `municipios-continente-caop-2025`, `municipios-acores-caop-2025`, `municipios-madeira-caop-2025`, `municipios-portugal-caop-2025` | 3, commit 3-0 | **feita** · 1 → 1 por edição, conferido na construção: `grep -o 'data-claim="municipios-continente-caop-2025"' dist/municipios/index.html \| wc -l` → **1**, o mesmo para as outras duas parcelas e o mesmo em `dist/en/municipalities/index.html`. O rótulo «Contagem verificada nos ficheiros» **não** viaja: é autorreferência e a Emenda 15 tirou-a. A soma (`municipios-portugal-caop-2025`) rende **2 vezes** por edição nesta página, porque a frase da contagem, por cima, já a publicava; a 3c compõe essa frase com as duas chaves da prova e a segunda rendição fica só aqui |
| R10 | `/` e `/en`, a porta do CSV dos 308 concelhos, na camada por baixo do mapa | `/municipios` e `/en/municipalities`, ao pé da fonte da lista | `MapaRespira.astro` → `MunicipiosView.astro` | País → (a lista dos 308) | pt, en | **1 → 1 + 1 por edição enquanto a porta da primeira página não sair** (ISSUES I34; a saída é de `MapaRespira.astro`, que é do construtor B) | ficheiro `/dados/municipios-308.csv`; sem linha | 3, commit 3-0 | **feita, metade** · a porta entrou em `/municipios` e em `/en/municipalities` (1 por edição, conferido) e a conferência mudou de rota com ela (`PORTA_DOS_DADOS` em `scripts/check-dados.mjs`). A porta da primeira página **continua lá** (1 por edição): `MapaRespira.astro` é do construtor B e o pedido está na nota. Medido que já pode sair: com a linha retirada à mão do componente, construção e `check:dados` verdes (exit 0); reposta, `git diff --stat` do ficheiro vazio |

## Recusadas, ou não relocadas de propósito

| o quê | porquê |
|---|---|
| A nota do lede de Évora da maqueta («Oito medidas. Seis vêm de organismos…») | contagens por extenso, estado escrito (`DECISIONS.md` §4, item das contagens em palavras); fica na página do município, onde já está registada como dívida da fase da voz |
| As frases curtas das peças Relance da maqueta (`SHORT_REL`: «Acima do limiar do painel europeu, e a descer.», etc.) | são cortes das frases existentes, isto é, frases novas; a peça leva a frase existente por inteiro (R1). Se a direção quiser as curtas, é chamada editorial e entra por «Texto novo» |
| As distâncias «+29,7 · −15,2 · +12,3 · +8,6», «+11,47», «−44,5» e a «+29,7» do telemóvel | não têm linha; decisão (e) do plano |
| «Total 308 · [a verificar]» da ficha do mapa | o marcador saiu das linhas da CAOP a 18.08; a contagem rende com o selo cheio |
| «Publicação: 2026-08-12» nas linhas de estudo cuja data é `null` | rende `[a verificar]`, nunca a data `updated` (etapa 4e) |
| «61,44%» com o símbolo dentro do valor | o símbolo fica fora do elemento (regra do `data-claim`) |
| A paráfrase do Sobre e «A direção é de Nuno dos Santos» no rodapé; o colofão «Maqueta v3 · protótipo · tipos substitutos»; «Protótipo: um toque num bloco muda só a densidade dele» | rodapé só navegação (15.08); estados de protótipo são recusados pelo portão |
| O quadrado de cobalto do sinal de tempo no cabeçalho | Emenda 1: cor só para limiares publicados |

## Texto novo (sem rota de origem; entra pelas cadeias, PT e EN no mesmo commit; revisão de voz antes da fusão)

### Etapa 3, subetapa 3b · duas cadeias novas, quatro retiradas

*Nenhuma relocação. As duas novas nomeiam o que as contagens deste índice contam; as quatro retiradas saem pela Emenda 15, que é regra da direção e não chamada de quem constrói.*

**Cadeias novas** (duas, nas duas edições):

| chave | pt | en | onde |
|---|---|---|---|
| `livro.contaAfirmacoes` | afirmações | claims | ao lado da chave da prova `afirmacoes`, na cabeça do índice |
| `livro.contaDerivadas` | calculadas | calculated | ao lado da chave da prova `derivadas`, na mesma linha |

**Cadeias retiradas** (quatro chaves, nas duas edições, no mesmo commit):

| chave | o que dizia | para onde foi |
|---|---|---|
| `livro.lede2` | «O selo de proveniência junto a cada número é a porta para a sua linha. É este o índice dessas portas.» | o selo, que é a porta. É o sítio a explicar ao leitor o que o seu próprio selo faz (Emenda 15) |
| `livro.marcadorV` | «É o único marcador de incerteza deste sítio. Aparece onde um campo não foi confirmado contra a fonte…» | `/a-verificar`, que é a página do marcador. A marca e a porta ficam no índice, e o rótulo «O marcador» também |
| `livro.naoDizK`, `livro.naoDizV` | «O que este índice não diz» · «Só estão aqui os números que este sítio publica…» | retiradas: é a classe que a Emenda 15 nomeia por extenso, «nunca o que não afirmamos» |

**As duas legendas dos grupos ficam, e o conflito está escrito.** «Todos os campos
preenchidos e conferidos contra a fonte…» e «Falta pelo menos um campo de
proveniência…» são as duas cadeias que a `DECISIONS.md` §4 item AB manda preservar
palavra por palavra até à fase da voz, e cada uma tem uma metade que é a casa a
falar da sua verificação. A régua classifica-as em autorreferência, e a contagem
de `/livro-razao` fica em **2 por edição** em vez de 0. Ver `INVENTARIO-FRASES.md`,
«As quatro que ficam em autorreferência, e porquê».

### Etapa 3, subetapa 3a · três cadeias novas, nenhuma retirada

*Nenhuma relocação: as três cadeias não têm rota de origem, e por isso são texto novo, com o seu inglês no mesmo commit e a revisão de voz pela frente.*

| chave | pt | en | onde |
|---|---|---|---|
| `livro.linha.conjuntoK` | O conjunto inteiro | The whole dataset | o rótulo das duas portas do conjunto, dentro de «Acesso aos dados» no aparelho do recibo (`IDENTIDADE.md` §11, «o acesso aos dados») |
| `livro.linha.noutroSitioK` | Esta linha noutro sítio | This row elsewhere | o rótulo do bloco que a §11 pede a seguir ao acesso aos dados |
| `livro.linha.noutraEdicao` | Esta linha na edição inglesa | This row in the Portuguese edition | a porta desse bloco |

**Uma chamada editorial, assinalada em vez de decidida.** A §11 e o `design/DECISAO.md` escrevem «esta linha noutro sítio» e não dizem que sítio é. As superfícies onde um valor rende não estão indexadas em lado nenhum deste repositório, e escrever essa lista à mão seria inventá-la; o que existe, para todas as 132 linhas, é a mesma linha na outra edição, e é isso que a subetapa 3a rende. O cabeçalho faz a mesma viagem para a página inteira, e é mobília; a §11 pede-a ao aparelho. **Se o lugar de direção quiser em vez disso o índice das páginas que citam a linha, é um pedido ao motor e não uma cadeia.**

### Etapa 2, subetapa 2l · duas cadeias novas, trinta e três retiradas, e uma que muda de forma

*A Emenda 15 é uma subtração, e por isso esta secção é sobretudo uma lista do que saiu. Cada cadeia retirada tem escrito para onde foi o que ela dizia; a lista inteira, com a classe de cada frase que FICOU, está em `INVENTARIO-FRASES.md`.*

**Cadeias novas** (duas, as duas nomes):

| chave | pt | en | onde |
|---|---|---|---|
| `inicio.social.titulo` | Painel Social Europeu | European Social Scoreboard | o título da lista compacta (Emenda 16). É o nome que a instituição lhe dá |
| `inicio.social.porta` | O livro-razão | The ledger | a porta para o resto do livro-razão, por baixo da lista |
| `inicio.portas.concelhos` | ` concelhos` | ` concelhos` | a contagem da porta dos Municípios, que passa de cobertura a tamanho. Identidade aceite |
| `inicio.portas.rotulo` | As páginas | The pages | o nome da região de navegação das três portas. **Só se ouve**: a legenda visível saiu |
| `inicio.mapa.linha` | ` concelhos · CAOP ` | ` concelhos · CAOP ` | a linha da Emenda 17, por baixo do mapa. Identidade aceite |
| `inicio.banda.svgLabel` | Régua da convergência: o PIB per capita de cada região contra a média europeia. | Convergence rule: GDP per capita of each region against the European average. | o nome acessível do desenho da banda, no lugar da frase que a Emenda 15 retirou |

*(São seis e não duas: quatro delas são substituições de cadeias retiradas, e entram na coluna da esquerda da tabela seguinte.)*

**Cadeias com forma nova** (uma):

| chave | antes | depois | porquê |
|---|---|---|---|
| `porta.k` | Encontrou um erro / Found an error | Encontrou um erro? / Found an error? | a Emenda 17 escreve a porta como uma pergunta, e a pergunta é a porta inteira |

**Cadeias retiradas** (as chaves saíram de `strings.mjs`, nas duas edições, no mesmo commit):

| chave | o que dizia | para onde foi |
|---|---|---|
| `prov.verLinha` | «Linha do livro-razão» | o texto oculto do selo passa a abrir pela palavra que ele já escreve à vista: «fonte · <estudo>» |
| `porta.v`, `porta.w` | «Escreva para …» / «Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.» | `/correcoes`, que diz a política inteira com as três naturezas |
| `densidade.semJs` | «Sem JavaScript, este comando não muda a página inteira…» | retirada: sem script os comandos continuam a ser ligações que abrem, e cada peça continua a abrir-se sozinha |
| `inicio.cabeca.paisB`, `ledePais` | « medidas» / a lede antiga do painel | a manchete e a lede da Emenda 16 |
| `inicio.movel.proximos` | «Um toque no mapa devolve os concelhos mais próximos…» | o nome acessível do selo do país, que já diz o que ele faz |
| `inicio.peca.recibo` | «o recibo completo está na linha» | o selo, que é a porta |
| `inicio.peca.semReferencia` | «Sem referência publicada: não há barra a desenhar.» | a peça diz «sem limiar», em duas palavras |
| `inicio.portas.k` | «As páginas · o resto vive a uma porta» | `inicio.portas.rotulo`, que só se ouve |
| `inicio.vazio.explicaA`, `explicaB` | «Nenhuma medida foi lida para <nome>. As fontes que publicam…» | as oito peças vazias, cada uma com «sem linha ainda» |
| `inicio.mapa.coberturaA`, `coberturaB` | « de » / « concelhos · » | a linha de cobertura saiu das quatro superfícies onde rendia |
| `inicio.mapa.contagemK`, `continente`, `total` | «Contagem verificada nos ficheiros», «Continente», «Total» | a contagem por parcelas vive em `/municipios` (pedido para a etapa 3) |
| `inicio.mapa.naoDizK` | «O que o mapa não diz» | **fecha o ISSUES I28**: não era rendida por ninguém desde a R3 |
| `inicio.mapa.posicao` | a frase de neutralidade dos pontos | retirada: diz o que não afirmamos |
| `inicio.mapa.deepTitulo` | «Método, ressalvas e proveniência» | o Método, e o recibo de cada linha |
| `inicio.banda.naoSeDesenham` | «As regiões não se desenham em pontos de concelho…» | `inicio.banda.svgLabel`, que nomeia o desenho em vez de o justificar |
| `home.instr1.deepTitulo`, `dadosK`, `dadosV`, `significadoK`, `ressalvaK`, `ressalvaPartes`, `distanciasK`, `distanciasV`, `provenienciaK`, `semJs` | a camada de aparelho do Instrumento n.º 1, inteira | o Método; a ressalva do provisório viaja com o valor desde a 2k; os selos dos valores desenhados vivem em `.brief` |

**A frase de Évora e a do concelho sem página não saem de `strings.mjs`**, e a razão está escrita nos componentes: `municipio.ledeA`/`ledeB` é a lede da PÁGINA de Évora (`MunicipioView`, etapa 3) e `inicio.cabeca.ledeVazioA`/`ledeVazioB` continua a ser cadeia validada da casa. O que saiu foi a rendição das duas na primeira página.

### Etapa 2, subetapa 2j · quatro cadeias novas, duas retiradas, e uma frase da mobília que sai do sítio

*A leitura da pré-visualização n.º 1 pela direção, 21.08.2026: Emendas 10 a 14 e quatro decisões de forma (`DECISIONS.md` §1.52; `direcao.md`).*

| chave | o que é |
| --- | --- |
| `tema.rotulo` · `tema.claro` · `tema.escuro` | **novas**, nas duas edições. «Tema» / «Theme», «claro» / «light», «escuro» / «dark». São o controlo que a **Emenda 12** manda pôr no cabeçalho, e o nome do grupo, que só é ouvido: duas palavras soltas não dizem de que é a escolha. As duas palavras visíveis vão em minúsculas porque são as duas metades de um comando de aparelho, como «abrir»/«fechar», e não títulos. Medido no `dist`: 2 ocorrências por página (`grep -o '>claro<\|>escuro<' dist/index.html \| wc -l` → 2) |
| `cobertura.semLinhaAinda` | **nova**, nas duas edições: «sem linha ainda» / «no row yet». É a terceira palavra da cobertura e é de outra escala: «sem página ainda» é sobre o CONCELHO, esta é sobre uma MEDIDA daquele concelho. É o que cada uma das oito peças vazias da **Emenda 14** diz de si, no lugar onde uma peça com linha diz o valor. Medido: 8 ocorrências por edição, 1 cadeia distinta por edição na régua dos defeitos |
| `inicio.mapa.posicao` | **nova**, nas duas edições, e **substitui `inicio.mapa.naoDiz`**, que fica retirada. A antiga dizia «O ponto aceso marca cobertura editorial, não qualidade nem importância. Os restantes pontos marcam a posição do município e mais nada.»; a **Emenda 10** tira o enchimento a todos os 308 pontos, e uma frase que começa por nomear «o ponto aceso» passa a descrever um desenho que a página não faz. A nova diz o que o ponto marca — uma posição — e continua a dizer o que não marca, que era o trabalho da antiga. Não é relocação: é texto novo, e vai à revisão de voz. Medido: 2 ocorrências por edição, uma na ficha e outra no cartão localizador, como a 2i deixou |
| `inicio.cabeca.estadoRotulo` | **retirada**, nas duas edições («Estado das medidas» / «State of the measures»). Era o nome do grupo da fila de estados, e a fila saiu da cabeça com a **Emenda 13**. Uma cadeia que nada rende é uma promessa de desenho que já não existe |
| `inicio.mapa.naoDiz` | **retirada**, nas duas edições. Ver `inicio.mapa.posicao`, acima |
| *(a linha de método)* | **retirada do sítio**, e não é uma chave de `strings.mjs`: era `METHOD_LINE` em `site.config.mjs`, declarada como identidade e não traduzida. A **Emenda 11** manda-a sair do cabeçalho e do rodapé do cartão de partilha; saiu das duas superfícies onde rendia — por baixo da marca, em todas as páginas, e no preâmbulo dos dois CSV — e a constante saiu com elas. Medido: `grep -r "Cada número tem fonte" dist/ \| wc -l` → **0**, com um controlo positivo a provar que o `grep` encontra o que existe |

### Etapa 2, subetapa 2i · uma cadeia aparada, e nenhuma nova

| chave | o que é |
| --- | --- |
| `ambito.regioesMeta` | **aparada**, nas duas edições. Dizia «As seis leituras publicadas na régua da convergência.» / «The six readings published on the convergence rule.», e a fila que ela legenda passou de seis pastilhas a cinco quando Portugal deixou de ser uma região (achado 5 da leitura cruzada, plano §13). Uma legenda que conta seis por cima de cinco é falsa; trocar «seis» por «cinco» seria escrever uma contagem à mão que volta a ficar errada na primeira mudança da lista. Ficou **«As regiões publicadas na régua da convergência.» / «The regions published on the convergence rule.»**, sem contagem: as leituras que a régua publica continuam a ser seis, e as regiões da fila são as que a fila mostra. **É a única mudança de texto desta subetapa, e vai assinalada em vez de decidida** |

### Etapa 2, subetapa 2g · uma cadeia nova, uma relocada, uma aparada

| chave | o que é |
| --- | --- |
| `inicio.cabeca.distritoDe` | **nova**, nas duas edições («distrito de » / «district of »). É o prefixo que fecha ISSUES I18: uma regra para os 308, com o servidor a dizer em `data-ilha` a qual dos dois casos cada concelho pertence e o script a trocar só o `hidden` |
| `inicio.mapa.deepTitulo` | **relocada** (R3), de `home.instr2.deepTitulo`, sem uma palavra mudada |
| `inicio.movel.proximos` | **aparada**: a primeira metade («Um toque no mapa devolve os concelhos mais próximos, para escolher.») descrevia o que a página deixou de fazer quando a regra da caixa vazia passou a ser a da prancha, e saiu. Ficou a segunda, que continua verdadeira. **É a única chamada editorial desta subetapa, e vai assinalada em vez de decidida** |

### Etapa 2 (subetapas 2a a 2c) · 32 cadeias novas, todas nas duas edições

Estão em `CHAVES-EN.md` com o inglês ao lado. Por família:

| família | chaves | o que é |
|---|---|---|
| `estado.*` | 4 | o vocabulário de estado decidido na etapa 0, sem uma palavra mudada |
| `cobertura.*` | 2 | o vocabulário de cobertura, o mesmo |
| `ambito.*` | 7 | os rótulos dos três âmbitos, a meta das regiões, e as duas cadeias da pesquisa |
| `densidade.*` | 6 | os rótulos das duas densidades, «abrir»/«fechar», e a nota do que não funciona sem script |
| `inicio.cabeca.*` | 12 | os rótulos de âmbito, as duas frases da manchete do País, a de Évora, a do estado vazio, e a lede da região |
| `inicio.mapa.*` | 3 novas + 13 relocadas | «Toque num ponto para escolher o concelho.», «trocar de concelho», «a página inteira, com quem governou»; as outras treze são `home.instr2.*` movidas sem mudar uma palavra (a décima terceira, `deepTitulo`, entrou na 2g com a camada de fundo do mapa) |
| `inicio.banda.*` | 2 | o rótulo da régua e a frase «As regiões não se desenham em pontos de concelho…» |
| `inicio.peca.*` | 2 | «o recibo completo está na linha» e a frase de quando não há referência publicada |
| `inicio.portas.*` | 4 | o rótulo das portas, «a página inteira», e os dois pedaços da contagem dos estudos |
| `inicio.vazio.*` | 2 | os dois pedaços da frase do concelho sem página |
| `sinal.agenda*` | 2 | «concluído» e «retirado», em minúsculas, para completar o par que a mobília já tinha |

**Uma frase da prancha que NÃO entra como texto novo**: «Toque num ponto para
abrir o concelho» passa a «Toque num ponto para ESCOLHER o concelho», porque na
primeira página um toque escolhe o âmbito e não abre a página do concelho — a
frase da prancha prometia uma coisa que o desenho não faz.

Preenchido por cada etapa, chave a chave, em `CHAVES-EN.md`. Na etapa 0 sabe-se já que entram: a frase-título por âmbito com a contagem por chave da prova; os rótulos de âmbito e densidade; as palavras de estado e de cobertura; a frase de neutralidade do mapa («O ponto aceso marca cobertura editorial, não qualidade nem importância», que já existe como `instr2.coberturaV` e pode ser relocada em vez de reescrita, R3); o estado vazio de um concelho sem página; os rótulos das portas de uma linha; a marca de água do recibo (as palavras do marcador); a linha constante do cartão de partilha.
