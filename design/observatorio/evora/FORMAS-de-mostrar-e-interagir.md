# FORMAS de mostrar e de interagir · conteúdo de responsabilidade pública · para o piloto de Évora

*Pesquisa feita a 15.09.2026 pelo Claude Opus 5 (1M), a pedido do lugar de direção. Todas as leituras são de 15.09.2026, entre as 11:58 e as 12:15 UTC, e cada uma diz a sua hora na ficha da forma. Nenhum repositório foi tocado; nenhum correio saiu. Prosa em português, Acordo Ortográfico, sem travessões; o que se cita de uma fonte fica como a fonte o escreveu, em inglês ou na sua língua. Documento de pesquisa, não de decisão: a escolha das formas é do lugar de direção com o diretor.*

---

## 0 · Como isto foi medido, e o que a medição vale

Duas coisas foram feitas antes de olhar para o desenho de qualquer sítio.

**Primeiro, o regulamento da casa foi lido, não recordado.** `VISAO.md` §1 a §3 e §6; `design/observatorio/POLITICA-DA-AUTONOMIA.md` §3 e §6; e, porque as formas visuais batem nele antes de baterem na visão, `design/especime-v3/direcao.md` §3, §4 e §6, que é onde a identidade fechada (§1.86 de `DECISIONS.md`) tem o seu corpo: a régua-espécime, o âmbar e o ocre para «fora do limiar», o cobalto para «dentro», a tinta e o cinzento para «sem limiar publicado», e a lista do que fica proibido, que inclui **mostrador com ponteiro, bandas de qualidade por matiz, índice compósito e cores partidárias como base**. Três das sete famílias de formas abaixo esbarram nesta lista, e isso está dito em cada ficha.

**Segundo, a regra do «sem guião» foi transformada em instrumento de medida.** Cada sítio candidato foi pedido com `curl`, que nunca executa JavaScript. O que volta é, aproximadamente, o que um leitor sem guião vê. A seguir os `<script>` e os `<style>` foram retirados, as etiquetas removidas, e ficaram duas contagens: caracteres de texto visível e algarismos nesse texto. Um sítio que serve a sua informação em HTML tem milhares de caracteres e centenas de algarismos; um sítio que a monta no navegador tem uma casca.

Esta medida apanhou coisas que a leitura de uma página não apanharia:

- O **soldipubblici.gov.it**, que eu ia citar de cabeça como o explorador italiano da despesa pública, devolveu a 15.09.2026 12:03 UTC uma «AgID Maintenance Page» de 21 caracteres de texto útil. Não é um exemplo vivo hoje, e não entra como tal.
- O **transparencia.gov.pt**, o portal do próprio Estado português, devolveu na página «Indicadores por municípios / Gestão Financeira» (15.09.2026 12:06 UTC) exatamente isto, e nada mais: «Às vezes a transparência também tem destas coisas... Pedimos desculpa, ocorreu um erro inesperado no carregamento dos dados que pediu.» e «Às vezes a transparência leva o seu tempo... Estamos a reunir a informação, por favor aguarde.» São os estados de carregamento e de erro da aplicação. Sem guião, o portal da transparência do Estado pede desculpa e não mostra um número.
- O **base.gov.pt**, o portal dos contratos públicos, serve o formulário de pesquisa e a lista das medidas especiais em HTML, mas a pesquisa e o detalhe do contrato vêm do guião: o pedido a `/Base4/pt/detalhe/` devolveu outra vez o formulário.
- A minha primeira contagem de algarismos deu falsos positivos, porque contava o JSON embutido dentro de `<script>`. O `data.ofgl.fr` parecia servido com 262 000 caracteres e tinha 310. A contagem foi refeita a tirar os `<script>` primeiro, e é a segunda que está nas fichas.

Isto é o que a régua mede e o que não mede. Mede o que chega no HTML. **Não** mede se o sítio é utilizável sem guião: o Full Fact serve a tabela inteira das promessas em HTML e os seus dois filtros são `<select id="category-filter">` e `<select id="status-filter">` dentro de um `<form>` sem `action`, ou seja, filtram por guião e mais nada. Sem guião tem-se a tabela toda e nenhuma maneira de a estreitar. Isso é uma escolha defensável (a informação está lá; o conforto é que não está), e é a escolha que a casa vai ter de fazer forma a forma.

**O achado técnico que vale mais do que todos os exemplos**, e que aparece em quatro das sete fichas: o Our World in Data rende os seus gráficos **do lado do servidor, em SVG, com o estado da interação no endereço**. Medido a 15.09.2026 12:04 e 12:07 UTC:

| pedido | resposta | o que vem dentro |
|---|---|---|
| `…/gdp-per-capita-worldbank.svg` | 200, `image/svg+xml`, 163 706 bytes | o mapa coroplético: 210 `<path>`, a escala escrita («$0», «$1,000», … «$50,000»), a classe «No data», a linha da fonte («Data source: Eurostat, OECD, IMF, and World Bank (2026)»), a nota dos preços constantes e a licença («OurWorldinData.org/economic-growth \| CC BY») |
| `…svg?tab=chart&country=PRT~ESP&time=2005..2025` | 200, 18 727 bytes | a série dos dois países, com «Portugal», «Spain», o eixo 2005 a 2025 e a mesma linha de fonte e licença |
| `…svg?tab=chart&country=PRT~ESP~ITA~GRC&facet=entity` | 200, 26 054 bytes | **pequenos múltiplos**, um painel por país, os quatro nomes presentes, 55 rótulos de texto |
| `…svg?…&facet=entity&uniformYAxis=0` | 200, 26 814 bytes | os mesmos múltiplos com eixo por painel, 62 rótulos |
| `…worldbank.csv` | 200, `text/csv`, 276 698 bytes | a tabela completa, `Entity,Code,Year,valor,região` |
| `…worldbank.metadata.json` | 200, `application/json`, 3 400 bytes | a proveniência da medida |

O `?country=` filtra o SVG mas **não** filtra o CSV, que vem sempre inteiro. Fica dito porque é o tipo de pormenor que estraga uma implementação feita de memória.

O que isto significa para a casa: **a interatividade pode viver no endereço e não no navegador**. Cada estado de um gráfico (que entidades, que anos, facetado ou não) é um URL; o servidor rende o SVG desse estado; a página sem guião é uma lista de ligações e uma tabela; a página com guião troca o `<img>` sem recarregar. É a mesma arquitetura que a casa já usa nos `<details>` e nas âncoras `#m-<id>`, levada ao gráfico. Não precisa de biblioteca de cliente nenhuma.

---

## 1 · A tabela das formas

Legenda do «cabe»: **sim** cabe com o que a casa já decidiu; **sim, com corte** cabe depois de se tirar alguma coisa que a identidade proíbe; **não** colide com uma regra que não se dobra.

| # | forma | exemplos vivos (lidos a 15.09.2026) | cabe nas regras? | custo em dados | custo em construção | onde entra primeiro no piloto |
|---|---|---|---|---|---|---|
| 1 | **Prometido contra cumprido** | Full Fact Government Tracker `fullfact.org/government-tracker/` · PolitiFact Trump-O-Meter `politifact.com/truth-o-meter/promises/trumpometer/` · (contra-exemplo: Polimeter `polimeter.org`, 56 caracteres sem guião) | **sim, com corte**: só promessas que **contenham um número**, para o estado sair de uma linha selada e não de um juízo; sem cores de estado próprias (o par âmbar/cobalto já existe e diz «fora/dentro do limiar», não «cumprida/quebrada»); sem contagem agregada na porta, que é um índice compósito por outro nome | uma linha por promessa (texto citado, documento, página, data), uma linha por medida do cumprimento (valor, período, fonte), e a regra do que conta como cumprido escrita antes de se ver o valor | baixo: tabela HTML e uma página por promessa; a filtragem por ligações, não por guião | **o Évora 2027**: o compromisso da candidatura contra o relatório do painel da Comissão, que já é público e datado |
| 2 | **O dinheiro** (orçamentado, executado, dívida, contratos) | gov.uk «Spending over £25,000» `gov.uk/government/collections/spending-over-25-000` · OBR data `obr.uk/data/` · (contra-exemplos medidos: `usaspending.gov` 15 caracteres, `transparencia.gov.pt` a pedir desculpa, `base.gov.pt` detalhe por guião, `dondevanmisimpuestos.es` 1 016 caracteres e zero algarismos) | **sim** para o orçamentado contra o executado por ano e por área, e para a dívida no tempo, na régua-espécime que já existe; **não** para o explorador «onde vai o dinheiro» de árvore clicável, que sem guião não tem equivalente em texto que um leitor percorra | a série por ano e por rubrica, orçamentado e executado, com a mudança de classificação (POCAL para SNC-AP) dita como quebra de comparabilidade; para contratos, uma linha por contrato | médio para as séries (SVG estático, já há `BarraConcelhoPais.astro`); alto e mal resolvido para o explorador | **a dívida de Évora no tempo**, que a casa já mediu (a fila de pagamento de 22 dias em 2023 para 137 em 2025, e €4 976 172 em atraso, no registo de `DECISIONS.md`) |
| 3 | **Votações e deliberações** | Chicago Councilmatic `chicago.councilmatic.org` (a página `/divided-votes/`, a `/compare-council-members/`, a de cada reunião) · TheyWorkForYou `theyworkforyou.com/mp/10001/…/votes` e `votes.theyworkforyou.com` · (contra-exemplos: `abgeordnetenwatch.de` 4 630 caracteres e 242 algarismos, `howtheyvote.eu` 388 caracteres) | **sim** para o registo por ponto e por resultado; **não** para o resumo «votou consistentemente a favor de X», que é uma conclusão calculada por uma régua da casa e por isso é matéria de estudo, não de página de leitor; **não** para cores partidárias como base | uma linha por reunião, uma por ponto da ordem do dia, uma por sentido de voto; em Évora as atas são digitalizações e custam leitura, não análise sintática | baixo na forma (tabelas), **alto na entrada** por causa do OCR | **as ordens do dia da Câmara de Évora**, que têm camada de texto, antes das atas, que não têm |
| 4 | **O tempo** (dez ou vinte anos, antes e depois de um mandato, pequenos múltiplos) | Our World in Data `ourworldindata.org/grapher/<medida>.svg?…` (SVG do lado do servidor, com facetas) · PORDATA `pordata.pt/Municipios` | **sim**, e é a forma que menos atrito tem: o SVG estático com a escala escrita e a distância dita em palavras é literalmente a régua-espécime esticada no tempo | a série inteira como linhas seladas, uma por ano; as fronteiras de mandato como datas, não como sombreado decorativo | **baixo**, e já parcialmente feito | **quinze anos de contas de Évora**, com os cinco mandatos marcados por linha vertical e nomeados em texto |
| 5 | **O território** (mapa por freguesia, com escala e valor por unidade) | Our World in Data mapa em SVG servido (210 `<path>`, escala e «No data» escritos) · a casa já tem `MapaPorConcelho.astro` e `GeometriaDosConcelhos.astro` · (contra-exemplos: ONS Census maps 58 caracteres sem guião, `observatoire-des-territoires.gouv.fr` 6 922 caracteres e 64 algarismos) | **sim** para o mapa estático com tabela ao lado; **não** para o mapa como instrumento de exploração (passar o rato, ampliar, escolher a medida), que sem guião não tem equivalente | a geometria das 19 freguesias do concelho e uma linha por freguesia por medida; a fonte da geometria (CAOP) com a sua versão e data | médio: a geometria existe para 308 concelhos, não para freguesias | **só depois das formas 1 a 4**: o mapa por freguesia é a forma que mais dados novos exige por unidade de leitura |
| 6 | **A comparação** (a câmara contra pares, região, país) | SSB Kommunefakta `ssb.no/kommunefakta/oslo` (valor com «Kilde» e tabela ao lado) · Chicago Councilmatic `/compare-council-members/` (uma tabela, uma linha por membro) · (contra-exemplos: `lginform.local.gov.uk` 302 sem corpo, `waarstaatjegemeente.nl` 5 766 caracteres e 54 algarismos, `kolada.se/verktyg/…` 517 caracteres) | **sim, com corte**: a comparação diz-se pela palavra de estado e pela posição escrita, nunca por barras normalizadas entre indicadores diferentes (proibido em `direcao.md` §4) e nunca por um índice único (proibido em §6); o grupo de pares tem de ser declarado e defensável, e a sua regra é matéria de estudo | o valor da mesma medida, no mesmo período, para o concelho, para os pares, para a região e para o país; e a definição do grupo de pares como linha | médio: a comparação é fácil de desenhar e difícil de justificar | **a seguir à forma 4**, com pares nomeados um a um e não por um agrupamento automático |
| 7 | **A leitura de um evento** (uma capital europeia da cultura ao longo do tempo) | os relatórios do painel da Comissão sobre Évora 2027, todos vivos e com camada de texto: pré-seleção 2022, primeiro relatório de acompanhamento de setembro de 2023, o relatório de progresso da própria cidade · (achado nulo: **nenhum sítio de capital europeia da cultura acompanha o seu próprio dinheiro e cumprimento**; Oulu2026, Timisoara2023 e Évora2027 são sítios de programa) | **sim**, e é a forma que melhor serve a casa, porque o árbitro do prometido contra o cumprido já existe e não é a casa nem a cidade | uma linha por compromisso da candidatura, uma por juízo do painel com a data e a página, uma por parcela de financiamento | baixo: é uma linha do tempo em HTML com uma tabela | **é por aqui que o piloto deve começar a parte do conteúdo**, porque a proveniência já está feita por terceiros |

---

## 2 · Ficha por forma

### Forma 1 · Prometido contra cumprido

**Full Fact Government Tracker**, `https://fullfact.org/government-tracker/`, lido a 15.09.2026 12:01 UTC.
Servido sem guião: 18 830 caracteres de texto, 497 algarismos, uma `<table>`. O topo traz a contagem: 94 compromissos repartidos por sete estados, com estas palavras exatas e estes números: «Achieved» 23, «Appears on track» 18, «In progress» 21, «Appears off track» 8, «Not kept» 6, «Unclear or disputed» 4, «Wait and see» 14. A tabela tem quatro colunas, «Policy area», «Pledge», «Status», «Updated», e o texto da promessa é a citação do manifesto. Os dois filtros (`<select id="category-filter">` e `<select id="status-filter">`, 23 `<option>`) são de guião e não têm `action`: sem guião, a tabela inteira, sem filtro.

A página de um compromisso, `https://fullfact.org/government-tracker/40000-nhs-appointments-per-week/`, lida a 15.09.2026 12:13 UTC, 9 867 caracteres servidos. Quatro coisas que interessam à casa. Primeira, o título é uma pergunta: «Is the government on course to deliver an extra two million NHS appointments a year?». Segunda, a promessa é citada com a página do documento: «(Labour manifesto, page 95)». Terceira, a definição do que conta como cumprido está escrita antes da prova. Quarta, a prova traz os dois valores brutos, 75 435 185 contra 70 223 535, e diz que os dados históricos foram obtidos por um pedido de acesso à informação e só depois publicados como estatística oficial. Cabeçalho: «Updated 23 June 2026».

E repare-se no endereço: `40000-nhs-appointments-per-week`. Os outros são `13000-neighbourhood-police`, `1-5-million-homes`, `150-major-infrastructure-projects`. **A promessa está nomeada pelo seu número.**

**PolitiFact Trump-O-Meter**, `https://www.politifact.com/truth-o-meter/promises/trumpometer/`, lido a 15.09.2026 11:59 UTC. Servido: 18 069 caracteres, 898 algarismos. 102 promessas, seis estados nomeados na própria página («Promise Kept, Promise Broken, Compromise, Stalled, In the Works or Not Yet Rated»), um marcador com a contagem (Kept 24, Compromise 23, Broken 55, …), e uma frase de método que vale mais do que o desenho todo: «We rate the promise not on the president's intentions or effort, but on verifiable outcomes.» A página de uma promessa (lida a 15.09.2026 12:05 UTC) traz a citação textual do que foi prometido, o estado, a categoria, e um **registo datado de atualizações** com autor e data, o mais antigo em baixo.

**Contra-exemplo medido**: o Polimeter, `https://www.polimeter.org/en/trudeau`, devolveu 56 caracteres de texto e zero algarismos. É uma aplicação de cliente inteira. Sem guião não existe.

**A minha leitura, para um leitor de primeira vez.** O que funciona: a contagem no topo dá a um leitor que chega de fora uma resposta em cinco segundos, e a tabela dá-lhe a segunda leitura sem mudar de página. O que funciona melhor ainda é a nomeação pelo número: «40 000 consultas por semana» é verificável, «melhorar o SNS» não é. O que não funciona: sete estados são demasiados. Um leitor de primeira vez não distingue «Appears on track» de «In progress» nem de «Wait and see» sem ir ler a definição, e ir ler a definição é sair da página. O PolitiFact tem seis e sofre do mesmo, com o agravante de «Compromise» ser um juízo puro.

**A pergunta da casa.** Cabe, com um corte que não é pequeno. O estado de uma promessa é uma conclusão, e a casa tem duas regras que apertam aqui: «nunca se escreve um número que não foi medido» e «as conclusões vêm da evidência, com a regra que as produziu». A saída é a do Full Fact levada ao fim: **a casa só acompanha promessas que carreguem um número**, e então o estado deixa de ser um juízo e passa a ser uma comparação entre duas linhas seladas, a do prometido e a do medido, com a regra escrita antes. Uma promessa sem número não entra como promessa; entra como ausência dita («este compromisso não tem valor nem prazo públicos», que é conteúdo). Três avisos mais: nada de cores novas de estado, porque o âmbar/ocre e o cobalto já estão atribuídos a «fora» e «dentro do limiar» e reutilizá-los para «quebrada» e «cumprida» dá dois significados ao mesmo matiz; nada de contagem agregada em destaque, porque «23 de 94 cumpridas» é um índice compósito com outro nome, e o §6 da direção proíbe índices compósitos; e nada de linha do tempo com marcas partidárias coloridas, pelo mesmo §6.
*Custo em dados*: por promessa, uma linha com o texto citado, o documento, a página e a data; uma linha com o valor prometido; uma linha por medição do cumprido, com período e fonte; e a regra do cumprimento escrita e datada. *Custo em construção*: baixo. Uma tabela e uma página por promessa. A filtragem faz-se por ligações (`/promessas/?estado=cumprida`) com o servidor a render cada estado, e não por `<select>`.
*Onde entra primeiro*: no Évora 2027, pela razão que está na ficha 7.

---

### Forma 2 · O dinheiro

Esta é a família em que a distância entre o que se vê nos sítios e o que sobrevive sem guião é maior. Das nove candidatas medidas, **sete não servem um único algarismo sem JavaScript**.

Medido a 15.09.2026, entre as 11:59 e as 12:03 UTC, texto e algarismos depois de retirados os `<script>`:

| sítio | endereço | texto | algarismos | veredito |
|---|---|---|---|---|
| gov.uk, «Spending over £25,000» | `gov.uk/government/collections/spending-over-25-000` | 30 473 | 5 403 | servido |
| OBR, dados | `obr.uk/data/` | 11 660 | 366 | servido, 4 tabelas |
| OpenCoesione (página inicial) | `opencoesione.gov.it/it/` | 39 040 | 414 | servido; as páginas de projeto, 293 caracteres |
| base.gov.pt | `base.gov.pt/Base4/pt/` | 17 456 | 2 462 | o formulário, não os contratos |
| transparencia.gov.pt, gestão financeira | `transparencia.gov.pt/pt/municipios/indicadores-por-municipio/gestao-financeira/` | 10 136 | 416 | uma mensagem de erro e uma de espera |
| Civio, «¿Dónde van mis impuestos?» | `dondevanmisimpuestos.es` | 1 016 | 0 | casca |
| USAspending | `usaspending.gov` e `/agency/department-of-education` | 15 | 0 | casca |
| Where Your Money Goes (Irlanda) | `whereyourmoneygoes.gov.ie/en/` | 921 | 109 | casca |
| soldipubblici.gov.it | `soldipubblici.gov.it/it/ricerca` | 21 | 0 | página de manutenção da AgID |

**A minha leitura.** O padrão é claro e é uma lição, não um acidente: **quanto mais o sítio se apresenta como «explorador», menos sobrevive**. O que sobrevive é o que publica o dinheiro como documento, não como aplicação. O modelo do gov.uk («cada organismo publica todos os meses um ficheiro com cada pagamento acima de £25 000») não tem desenho nenhum e é o mais robusto de todos: é uma lista de ficheiros datados. Para um leitor de primeira vez é péssimo, porque não responde a nenhuma pergunta sem ele fazer a conta; para um investigador é o melhor.

O explorador «onde vai o dinheiro», a árvore que se clica para descer de «Educação» para «Educação pré-escolar» para uma rubrica, é a forma mais atraente desta família e é a que eu recomendo **não** fazer. Não por ser difícil: por não ter equivalente em texto. A versão sem guião de uma árvore de despesa com seis níveis é ou uma lista de 2 000 linhas ou 2 000 páginas. Nenhuma das duas é «a mesma informação em texto» num sentido honesto, e a casa fica com uma regra formalmente cumprida e materialmente falsa.

O que funciona e cabe: **o orçamentado contra o executado, um ano por linha, uma área por bloco, e a diferença dita em palavras**. É a régua-espécime com dois valores em vez de um valor e um limiar. E **a dívida no tempo com o teto legal marcado a 2 px**, que é literalmente o que `direcao.md` §4 já descreve («barras da dívida contra o teto a tinta, o teto a 2px»): essa forma não precisa de ser inventada, precisa de ser alimentada.

**A pergunta da casa.** O orçamentado contra o executado e a dívida no tempo cabem. Os contratos por adjudicatário e objeto cabem como tabela e como página por contrato, com a nota de que o BASE não serve o detalhe sem guião e portanto a casa terá de guardar a sua própria cópia de cada contrato que citar, com data e sha256, o que é o que o motor já faz com os ficheiros de fonte. O explorador não cabe.
*Custo em dados*: alto e chato. A série por ano e por rubrica de Évora atravessa uma mudança de sistema de contabilidade pública, e a quebra de comparabilidade tem de ser dita, não alisada. Por contrato: adjudicante, adjudicatário, objeto, valor, data, procedimento, e o número do contrato no BASE.
*Custo em construção*: médio para as séries, e boa parte já está feita (`BarraConcelhoPais.astro`). Alto e mal resolvido para o explorador, que é razão para o não fazer.
*Onde entra primeiro*: a dívida de Évora no tempo contra o limite legal. A casa já tem o material medido, incluindo o prazo médio de pagamento a passar de 22 dias em 2023 para 137 em 2025 e €4 976 172 em atraso (registo de `DECISIONS.md`); falta-lhe a forma.

---

### Forma 3 · Votações e deliberações

**Chicago Councilmatic**, `https://chicago.councilmatic.org/`, lido a 15.09.2026 11:58 UTC. É o exemplo mais completo que encontrei e serve **tudo** sem guião: 109 002 caracteres de texto e 17 966 algarismos na página inicial, zero `<svg>`, zero `<canvas>`.

A página `/divided-votes/` (15.09.2026 12:02 UTC, 41 784 caracteres, 5 176 algarismos, uma `<table>`) abre com uma frase que é uma aula de como dizer uma ausência: «For the 2023 Regular Session of Chicago City Council under Mayor Brandon Johnson, there have been 171 votes with any dissenting "No" votes (sometimes referred to as a divided roll call). Everything else has either been held in committee with no vote or is considered noncontroversial and has passed unanimously.» A tabela tem «Legislation», «Primary sponsor», «Date of last action», «Votes for», «Votes against», e cada linha é uma deliberação real («Resolution R2026-0025438 … Nugent, Samantha … 7/22/2026 … 24 … 23»). O filtro por mandato é uma lista de períodos (2011-2015, 2015-2019, 2019-2023, 2023-2027), não um `<select>`.

A página de uma reunião, `/event/city-council-06326268fdb5/` (15.09.2026 12:08 UTC), traz a data e a hora, a morada da sala, a ligação ao vídeo, a ordem do dia numerada como tabela («Agenda: 7 items», colunas «#», «Description», «ID», «Sponsor(s)») e a presença nominal («Alder Attendance: 49 Present, 3 Absent») com uma linha por membro. Dos sete pontos daquela reunião, seis eram felicitações de aniversário e reconhecimentos e o sétimo era marcar a reunião seguinte. Isso não é uma crítica ao Councilmatic: é o que a forma revela, e revelá-lo é o valor dela.

A página `/compare-council-members/` (15.09.2026 12:08 UTC, 8 207 caracteres, 416 algarismos, uma `<table>`) é uma tabela só, uma linha por membro, colunas «Ward», «Years in office», «Non-routine bills sponsored», «Attendance (this session)», «Caucus».

**TheyWorkForYou**, `https://www.theyworkforyou.com/mp/10001/…/votes`, lido a 15.09.2026 12:00 UTC (a ficha que respondeu ao identificador 10001 é a de Diane Abbott, e não a que eu esperava: fica dito). Servido: 35 303 caracteres, 1 901 algarismos. As frases-resumo são do género «Almost always voted for measures that increased LGBT+ rights and social equality» e «Generally voted against a stricter asylum system», agrupadas em 14 áreas, com contagens («3 votes against, in 2025») e **sem** as datas de cada votação. Cada resumo tem um «Show votes» que leva a um sítio separado, `votes.theyworkforyou.com`.

Esse sítio separado (15.09.2026 12:08 UTC, 3 305 caracteres, 2 tabelas) é onde está o método: a descrição da política, a frase de análise («Diane Abbott voted a mixture of for and against (50% aligned)»), **a comparação com os pares do próprio partido** («Comparable Labour MPs voted a mixture of for and against (57% aligned)»), um guia coluna a coluna («person vote», «party alignment», «policy direction», «policy alignment», «annotation»), a tabela de cada votação com o seu nome e a sua data («National Referendum on the United Kingdom's Membership of the European Union, 2011-10-24, no, 92%, agree, not aligned»), um aviso de que o sítio está «in experimental release», e um formulário para propor emendas ao que conta para o cálculo.

**A minha leitura.** O Councilmatic e o TheyWorkForYou resolvem o mesmo problema de duas maneiras opostas, e a casa deve copiar a arquitetura de um e recusar a métrica do outro.

O que o TheyWorkForYou faz de exemplar é **a separação**: o resumo na página do leitor, o método inteiro e a votação a votação noutro sítio. Isto é exatamente a regra «a página do leitor não se explica; a análise vai para estudos». Que eles ponham num subdomínio o que a casa põe num estudo é um detalhe; a divisão é a mesma, e é uma confirmação independente de que a divisão funciona.

O que o TheyWorkForYou faz que a casa não deve fazer é **a frase-resumo**. «Almost always voted for» é o produto de uma régua construída por quem publica: que votações contam, como se pesa uma ausência, o que é «almost always». Eles sabem-no, e é por isso que puseram um formulário a pedir emendas à lista. Numa página de leitor da casa, essa frase seria uma conclusão sem a regra ao lado, o que é opinião com fato de dado. E há um segundo problema, mais duro: a casa fez uma recusa escrita de não publicar peça nenhuma que nomeie uma pessoa sem o diretor (§4 da política da autonomia, «Nunca sem o diretor»). Um resumo de voto por vereador **é** uma peça que nomeia uma pessoa. Essa porta abre-se com o diretor ou não se abre.

Para o leitor de primeira vez, o Councilmatic ganha de longe: «esta reunião teve estes sete pontos, votou-se assim, faltaram estes três» é compreensível sem manual. O agregado do TheyWorkForYou é mais curto de ler e mais difícil de confiar.

**A pergunta da casa.** O registo por reunião, por ponto e por resultado cabe inteiro, e cabe numa tabela HTML sem uma linha de guião. O resumo por membro não cabe na página do leitor.
*Custo em dados*: e aqui está o achado que muda o plano do piloto. **As atas da Câmara de Évora são digitalizações sem camada de texto.** A «Ata n.º 7 de 16-04-2025» (`cm-evora.pt/wp-content/uploads/2025/07/Ata-no-7-de-16-04-2025.pdf`, verificada a 15.09.2026 12:07 UTC) tem **42 957 692 bytes**, e nos primeiros 300 KB traz `/Subtype/Image` e `/DCTDecode` e **nenhum objeto `/Font`**: são fotografias de páginas. A ordem do dia da reunião de 22.01.2026 (`CME_2026_01_22_-_Ordem_do_dia.pdf`, 1 778 783 bytes, verificada à mesma hora) **tem** camada de texto (`CIDFontType2`, `Type0`), seis páginas. A assimetria é decisiva: **o que foi proposto é legível por máquina; o que foi decidido não é.** Quarenta e três megabytes por reunião, vinte e tal reuniões por ano, cinco mandatos.
*Custo em construção*: baixo na página, alto na entrada dos dados. O OCR de uma ata não é uma leitura de fonte no sentido do motor: é uma transcrição que pode errar, e cada número que de lá saia precisa de um humano ou de um modelo a conferir contra a imagem, com a página citada.
*Onde entra primeiro*: **as ordens do dia**, que dão o calendário das reuniões e o que foi proposto, com custo baixo. As atas entram a seguir, uma de cada vez, e cada número que delas sair leva a página e a ligação à imagem. Começar pelas atas é começar pelo caro.

---

### Forma 4 · O tempo

**Our World in Data**, `https://ourworldindata.org/grapher/gdp-per-capita-worldbank`, lido a 15.09.2026 12:00 UTC, e os pontos `.svg`, `.csv` e `.metadata.json` medidos às 12:04 e 12:07 UTC (o quadro está no §0). A página em si **não** serve o gráfico sem guião: 30 113 caracteres de texto, 280 algarismos, 28 `<svg>` que são ícones, zero `<table>`, zero `<noscript>`. Mas o mesmo servidor rende o gráfico inteiro em SVG noutro endereço, com a fonte, a nota e a licença lá dentro, e obedece a `country=`, `time=`, `tab=` e `facet=`.

**PORDATA**, `https://www.pordata.pt/Municipios`, lido a 15.09.2026 12:06 UTC: 10 740 caracteres, 959 algarismos, uma `<table>`. Serve a mobília e parte do conteúdo; o quadro de dados vem por guião. O `retratos.pordata.pt` (mesma hora) serve 1 363 caracteres e usa uma forma editorial que vale registar: frases de superlativo com o período («Amadora é o município com mais residentes por km²», «Vila Velha de Ródão é o município onde a percentagem de alunos mais cresceu, entre 2021 e 2024»).

**A minha leitura.** Esta é a forma que a casa já sabe fazer e que menos lhe custa, e é onde o achado do SVG servido rende mais. Para um leitor de primeira vez, uma série de quinze anos com a escala escrita nas pontas e a frase «subiu de X em 2010 para Y em 2025» por baixo é mais legível do que qualquer gráfico interativo, porque não exige uma ação para revelar o número.

Os pequenos múltiplos merecem uma nota. Funcionam quando os painéis partilham o eixo e falham quando não partilham: com `uniformYAxis=0` cada painel tem a sua escala e quatro países com rendimentos diferentes parecem ter a mesma trajetória, o que é precisamente a leitura errada. O `direcao.md` §4 já proíbe «barras normalizadas entre indicadores diferentes» pela mesma razão. Se a casa fizer múltiplos, **eixo partilhado, sempre**, e a escala escrita uma vez.

O antes e o depois de um mandato é a variante que mais interessa ao piloto e a que mais cuidado exige. Marcar as fronteiras dos mandatos numa série de quinze anos é honesto; **atribuir o que a série faz ao mandato não é**, e a casa tem uma regra sobre isso («a caça a correlações é a forma mais rápida de fabricar falsos achados»). A forma pode marcar a data. A conclusão é de um estudo com método fixado antes dos dados.

**A pergunta da casa.** Cabe, e é a que cabe melhor.
*Custo em dados*: a série inteira como linhas seladas, uma por ano, com as quebras de comparabilidade ditas; as datas dos mandatos como factos com fonte.
*Custo em construção*: baixo, e a arquitetura está provada por terceiros: um SVG por estado, gerado no `build`, e o estado no endereço. Nada de bibliotecas de cliente.
*Onde entra primeiro*: os quinze anos de contas de Évora, com os cinco mandatos marcados por uma linha vertical fina e nomeados em texto por baixo, sem cor de partido.

---

### Forma 5 · O território

O mapa interativo é, de toda a pesquisa, a forma que pior sobrevive. Medições de 15.09.2026, entre as 11:59 e as 12:02 UTC: ONS Census maps (`ons.gov.uk/census/maps`) **58 caracteres** de texto sem guião; Observatoire des territoires (`observatoire-des-territoires.gouv.fr`) 6 922 caracteres e 64 algarismos, que é a mobília; `cohesiondata.ec.europa.eu` 911 caracteres. A página de área do ONS (`explore-local-statistics/areas/E07000178-oxford`, lida às 12:11 UTC) confirmou-se, por leitura, como um índice de navegação: lista as 25 freguesias eleitorais e as 4 paróquias de Oxford como ligações e **não mostra um único valor, fonte ou período**.

A exceção é outra vez o Our World in Data: `…/gdp-per-capita-worldbank.svg?tab=map` devolve 163 706 bytes de SVG com 210 `<path>`, a escala escrita em degraus («$0», «$1,000», «$2,000», «$5,000», «$10,000», «$20,000», «$50,000»), uma classe «No data» nomeada, e a linha da fonte e da licença dentro da imagem. É um mapa coroplético completo, feito no servidor, que um leitor sem guião vê.

E a casa já tem o seu: `src/components/formas/MapaPorConcelho.astro` e `GeometriaDosConcelhos.astro` existem no repositório, com `LegendaDoMapa.astro` e `MapaRespira.astro`, e o conceito do mapa como navegação entre país, região e concelho está registado na `VISAO.md` §5 como decisão do diretor de 31.08.

**A minha leitura.** Para um leitor de primeira vez, um mapa é a melhor porta e a pior resposta. Ele encontra o seu lugar num mapa em dois segundos e depois não sabe se a cor que vê é boa ou má, porque ler uma escala coroplética exige um esforço que a maioria não faz. O que o Our World in Data faz bem é escrever a escala em degraus com valores reais em vez de um gradiente contínuo, e nomear o «No data» como classe em vez de o deixar cinzento e mudo. Isso resolve metade do problema. A outra metade resolve-se com a tabela ao lado, ordenada, que é onde o leitor confirma o que julgou ver.

A nota de escala para o piloto: o concelho de Évora tem 19 freguesias depois da reorganização de 2013, e as freguesias rurais do Alentejo são enormes e quase vazias. **Um coroplético por freguesia em Évora vai mostrar a área, não a medida.** Quem não conhece o concelho lê a mancha grande como «muito», e a mancha grande é a freguesia com menos gente. A forma honesta aqui é o valor por unidade escrito na tabela e o mapa como navegação, que é aliás exatamente o que o conceito registado na visão diz («mapa como navegação entre país, região e concelho»), e não o mapa como medida.

**A pergunta da casa.** O mapa estático em SVG com tabela ao lado cabe. O mapa como instrumento de exploração não cabe, porque sem guião não tem equivalente.
*Custo em dados*: a geometria das 19 freguesias com a versão da CAOP e a sua data; uma linha por freguesia por medida; e, se a medida for um rácio, o denominador como linha própria.
*Custo em construção*: médio. A geometria dos 308 concelhos existe; a das freguesias de um concelho é trabalho novo, ainda que pequeno para um só concelho.
*Onde entra primeiro*: **não entra primeiro.** É a forma com pior razão entre dados novos exigidos e leitura entregue, e a armadilha da área torna-a a mais fácil de fazer mal. Depois das formas 1 a 4.

---

### Forma 6 · A comparação

**SSB Kommunefakta**, `https://www.ssb.no/kommunefakta/oslo`, lido a 15.09.2026 11:59 UTC. Serve sem guião 10 590 caracteres e 540 algarismos, e serve-os com a proveniência colada ao valor: «Folketallet 2. kvartal 2026 · 729 437 personer · Kilde Statistisk sentralbyrå, tabell 01222». Ao lado de cada bloco há «Sammenlign folketallet med annen kommune», que é a comparação com outro município, e o índice do topo lista as secções («Befolkning \| Arbeid og utdanning \| Bolig \| Kultur \| Bebyggelse og transport \| Kommunens økonomi»).

Um pormenor importante, e é uma correção a uma leitura minha apressada: a página mostra os botões «Vis som figur \| Vis som tabell» (ver como figura, ver como tabela), que pareciam ser exatamente a regra da casa cumprida por um organismo oficial. Não são. A cadeia «Vis som tabell» aparece no HTML **dentro do dicionário de tradução em JavaScript**, e os 135 `<svg>` da página são ícones: os gráficos são Highcharts, feitos no navegador. Sem guião ficam os números de cabeça com a sua fonte, e nem gráfico nem tabela. A forma certa está desenhada; a implementação não a serve.

**Chicago Councilmatic, `/compare-council-members/`** (já descrita na ficha 3): uma tabela, uma linha por membro, quatro medidas e uma etiqueta de grupo. Serve sem guião.

**Contra-exemplos medidos a 15.09.2026, 11:59 a 12:02 UTC**: `lginform.local.gov.uk`, o instrumento de comparação entre autarquias da Local Government Association, devolveu 302 sem corpo nas duas tentativas; `waarstaatjegemeente.nl` 5 766 caracteres e 54 algarismos; `kolada.se/verktyg/jamforaren/` 517 caracteres. A página inicial do Kolada serve 26 861 caracteres e 1 026 algarismos, mas a ferramenta de comparação, que é o que interessa, não serve nada.

**A minha leitura.** Para um leitor de primeira vez, a comparação é o que ele quer («a minha câmara é boa ou má?») e é o que mais facilmente o engana. Três coisas correm mal, e vi as três.

Primeira, o grupo de pares. Toda a gente compara com «municípios semelhantes» e quase ninguém diz na página o que torna um município semelhante. Quando a regra do grupo não está à vista, a posição é um número que o publicador escolheu.

Segunda, a normalização. Barras de comprimento comparável entre indicadores com unidades diferentes fazem um leitor somar o que não se soma. O `direcao.md` §4 já proibiu isto, e a proibição é boa.

Terceira, a posição única. «17.º de 308» é a forma mais lida e a mais frágil: com 308 unidades e diferenças de centésimas, a posição salta dez lugares por ruído. A casa proíbe índices compósitos pela mesma razão, e a posição ordinal é um índice compósito de uma variável só.

O que o Kommunefakta faz bem, e que cabe, é comparar **uma medida de cada vez**, com a fonte e a tabela ao lado, e com a comparação a ser uma escolha do leitor entre dois municípios nomeados em vez de um agrupamento automático.

**A pergunta da casa.** Cabe, com corte: sem barras normalizadas entre indicadores, sem índice, e com a posição dita por palavras contra uma referência gravada (é isso a linha de carga do §3 da direção) em vez de por número ordinal. A regra do grupo de pares é matéria de estudo com método fixado antes dos dados, não uma caixa na página.
*Custo em dados*: o valor da mesma medida, no mesmo período e com a mesma definição, para o concelho, para cada par, para a região e para o país; e a definição do grupo de pares como linha selada com a sua justificação. É o custo mais alto de todas as formas, porque multiplica cada medida pelo número de unidades comparadas.
*Custo em construção*: médio. Uma tabela e uma régua por medida; nada de novo depois da forma 4.
*Onde entra primeiro*: a seguir à forma 4, e com os pares nomeados um a um e a razão de cada um escrita. Évora contra o país e contra o seu próprio passado é comparação barata e defensável; Évora contra «os seus pares» é cara e discutível, e é a que precisa do estudo primeiro.

---

### Forma 7 · A leitura de um evento

Comecei por procurar um sítio vivo que acompanhasse uma capital europeia da cultura ao longo do tempo, com o programa, o dinheiro e o cumprido. **Não encontrei nenhum, e o resultado nulo é o achado.**

Medido a 15.09.2026, 12:02 e 12:07 UTC: Oulu2026 (`oulu2026.eu/en/programme/`) serve 11 916 caracteres e 328 algarismos, e é um sítio de programa e bilhética; Timisoara2023 (`timisoara2023.eu/en/`) 3 898 caracteres e 201 algarismos, idem; Chemnitz2025 2 918 caracteres; Kaunas2022 3 303 caracteres; Évora2027 (`evora2027.com`) 1 844 caracteres e 76 algarismos. Nenhum destes sítios publica o seu orçamento contra o executado, nem o número de atividades prometidas contra as realizadas. Não é negligência: **uma capital da cultura não é construída para se auditar a si própria.**

O que existe, e existe bem, é a corrente de documentos datados de um terceiro. Verifiquei os três de Évora a 15.09.2026 12:14 UTC, por pedido com intervalo de bytes, e os três são PDF vivos **com camada de texto** (`/Font` presente):

| documento | endereço | verificado |
|---|---|---|
| relatório de pré-seleção da capital 2027 em Portugal | `culture.ec.europa.eu/sites/default/files/2022-04/ecoc-2027-portugual-preselection-report_v1.pdf` | 200, PDF, com texto |
| primeiro relatório de acompanhamento do painel, setembro de 2023 | `culture.ec.europa.eu/sites/default/files/2023-10/%C3%89vora-first-monitoring-report-September-2023_en.pdf` | 200, PDF, com texto |
| primeiro relatório de progresso da própria cidade ao painel | `cm-evora.pt/wp-content/uploads/2025/06/FirstMR_Evora_2027.pdf` | 200, PDF, com texto |

Há ainda a avaliação intercalar da ação das capitais europeias da cultura 2020-2033, COM(2025) 587 final, de 02.10.2025, referida como publicada em pesquisa a 15.09.2026 12:10 UTC e **não aberta por mim na fonte**: fica `[verify]` até alguém a ler no EUR-Lex. Do mesmo modo, o valor «74 milhões de euros» para o orçamento de Évora 2027, e a sua repartição (15 do Orçamento do Estado, 10 de fundos europeus, 4 do Turismo, 5 para os territórios envolventes, 15 do município e parceiros, mais 25 de uma reprogramação do PRR), aparece em notícias e não numa fonte primária que eu tenha aberto: **`[verify]`, e não se escreve no sítio até sair de um documento.**

**A minha leitura.** Esta é a forma que melhor serve a casa e a que menos trabalho novo de proveniência exige, por uma razão estrutural: **o árbitro já existe e não é a casa.** Um painel nomeado, com um mandato publicado, escreve de dois em dois anos um relatório datado sobre o que a cidade prometeu na candidatura e onde está. A casa não tem de julgar o cumprimento; tem de pôr lado a lado o que a candidatura prometeu, o que o painel escreveu e quando, e o que a cidade respondeu. Cada um desses é uma citação com documento, página e data. É a forma 1 com a parte difícil já feita por outro.

Para um leitor de primeira vez de Évora, é também a pergunta que ele já tem. Falta ano e meio para 2027; o que está feito, o que não está, e quanto custou é a pergunta que se faz num café da praça do Giraldo. E é a pergunta que nenhum dos sítios acima responde.

Um aviso, que é do §6 da política da autonomia: a Associação Évora 27 e a Câmara de Évora são entidades que a casa mede, e portanto entidades de quem a casa não aceita dinheiro. Isso não impede a leitura; obriga a que a leitura se faça só de documentos publicados, sem relação de parte nenhuma.

**A pergunta da casa.** Cabe inteira. Uma linha do tempo em HTML, uma tabela de compromissos contra juízos datados, cada célula com a sua citação.
*Custo em dados*: uma linha por compromisso da candidatura (com a página do documento), uma por juízo do painel (com a data e a página), uma por parcela de financiamento anunciada (com o ato que a autoriza, não com a notícia que a repete). Nenhuma exige OCR.
*Custo em construção*: baixo. Sem gráfico nenhum na primeira versão.
*Onde entra primeiro*: **é por aqui que o conteúdo do piloto deve começar.**

---

## 3 · As cinco formas com que o piloto devia começar, por esta ordem

Ordenadas por uma razão só: **quanto se entrega ao leitor por cada linha nova que é preciso selar**. Não por quanto impressionam.

**1.ª · A leitura do evento (forma 7): Évora 2027, o prometido contra o que o painel escreveu.**
Porque a proveniência já está feita por um terceiro independente, em documentos datados, com camada de texto, e com um árbitro que não é a casa nem a cidade. Porque é a pergunta que um leitor de Évora já tem na cabeça a ano e meio do evento. Porque não precisa de gráfico nenhum, de OCR nenhum, e de nenhuma conclusão da casa: é citação, data e página. E porque é o ensaio mais barato da forma 1, na qual a casa vai ter de ganhar disciplina antes de a aplicar ao que é mais difícil.

**2.ª · O tempo (forma 4): quinze anos de contas de Évora, com os cinco mandatos marcados.**
Porque a casa já mediu esta série, e porque é a forma que menos atrito tem contra a identidade: a régua-espécime esticada no tempo é a régua que a direção já descreveu. E porque prova, de uma vez, a arquitetura que o resto do piloto vai reutilizar: um SVG por estado, gerado no `build`, com o estado no endereço, a escala escrita, a fonte e a data lá dentro, e a tabela por baixo. Depois disto, a forma 2 e a 6 são variações, não construções.

**3.ª · O dinheiro (forma 2), só na parte da dívida e do orçamentado contra o executado.**
Porque a dívida contra o teto legal é o número que define o caso de Évora e porque a casa já tem o material bruto, incluindo o que custou baixá-la. A parte dos contratos espera: o BASE não serve o detalhe sem guião, e cada contrato citado obriga a casa a guardar a sua própria cópia com data e sha256. O explorador «onde vai o dinheiro» não entra nunca, e a razão está no §4.

**4.ª · As deliberações (forma 3), pelas ordens do dia e não pelas atas.**
Porque as ordens do dia têm camada de texto e as atas são fotografias de 43 MB, e porque o calendário das reuniões com o que foi proposto já responde a uma pergunta real (o que é que esta câmara trata, e com que frequência) por um custo pequeno. As atas entram a seguir, uma de cada vez, com o número a citar a página e a ligar à imagem. E a forma pára onde a política da autonomia manda parar: o registo por ponto e por resultado é da casa; o resumo por vereador nomeado é do diretor.

**5.ª · A comparação (forma 6), e só Évora contra o país e contra o seu próprio passado.**
Porque esta é a comparação barata e defensável, e é quase de graça depois da forma 4: os mesmos valores, uma referência gravada, a distância dita em palavras. A comparação contra pares fica para quando existir um estudo que defina o grupo com método fixado antes dos dados, porque o grupo de pares é a decisão que faz a resposta, e escolhê-lo depois de ver os valores é escolher a resposta.

A forma 5 (o território por freguesia) fica de fora das cinco, deliberadamente. Não porque seja má: porque em Évora, com 19 freguesias e uma geografia alentejana, o coroplético mostra a área antes de mostrar a medida, e porque é a forma que exige mais dados novos por unidade de leitura entregue. O mapa como navegação, que a casa já tem, continua a servir.

---

## 4 · As formas que a casa não deve fazer

**O explorador «onde vai o dinheiro».** A árvore de rubricas que se clica para descer níveis, ou o seu primo, o retângulo aninhado. Razão: não tem equivalente em texto. Sem guião, a versão honesta é uma lista de milhares de linhas ou milhares de páginas, e nenhuma das duas é «a mesma informação» num sentido que um leitor reconheça. A regra ficaria formalmente cumprida e materialmente falsa, que é pior do que não a ter. E foi a categoria com pior sobrevivência de toda a pesquisa: das nove candidatas do dinheiro, sete não serviram um algarismo sem JavaScript, incluindo o portal do próprio Estado português, que sem guião pede desculpa.

**O resumo de voto por pessoa na página do leitor.** «Votou consistentemente a favor de X» é o produto de uma régua construída por quem publica (que votações contam, como se pesa uma ausência, o que é «consistentemente»), e o TheyWorkForYou sabe-o tão bem que pôs um formulário a pedir emendas à lista. Numa página da casa seria uma conclusão sem a regra ao lado. Acresce que é uma peça que nomeia uma pessoa, e a política da autonomia reserva isso ao diretor. O voto por ponto, com a data e o resultado, é outra coisa e cabe.

**A contagem agregada de promessas como destaque.** «23 de 94 cumpridas» é um índice compósito, que o §6 da direção proíbe, com o agravante de somar promessas de tamanhos incomparáveis como se fossem unidades. A contagem pode existir numa tabela; não pode ser a manchete, e a manchete não pode ser uma percentagem de cumprimento.

**Cores de estado novas para «cumprido» e «quebrado».** O âmbar e o ocre já significam «fora do limiar» e o cobalto «dentro», por decisão medida. Dar-lhes um segundo significado destrói o primeiro, e inventar um terceiro par reabre a identidade, que está fechada por decisão do diretor (§1.86). O estado de uma promessa diz-se por palavra, como tudo o resto.

**O mostrador, o ponteiro e as bandas de qualidade por matiz.** Já estão na lista do §6 da direção. Registo-os aqui porque são precisamente o vocabulário que os seguidores de promessas usam (o «meter» está no nome do Trump-O-Meter e do Polimeter), e a tentação de os copiar vem com a forma.

**O mapa coroplético por freguesia como medida, em Évora.** Não como proibição permanente: como recusa para este piloto. Dezanove freguesias de áreas muito desiguais fazem a mancha grande parecer o valor grande. Se a casa quiser o território em Évora, o valor por unidade na tabela e o mapa a navegar.

**A posição ordinal («17.º de 308») como forma principal.** É um índice de uma variável só, e salta com o ruído. A casa já diz a distância a uma referência em palavras e em número; isso é mais estável e mais honesto.

**E uma recusa metodológica, que não é uma forma mas mata formas.** Nenhuma destas formas pode atribuir o que a série faz a quem estava no mandato. A forma pode marcar a data da eleição. A conclusão é de um estudo com método fixado antes dos dados e com condição de matar. Isto vale sobretudo para a forma 4 aplicada a Évora, onde a tentação é máxima e o material já existe.

---

## 5 · O que isto custou

**Pedidos.** 132 pedidos por `curl`, contados e não estimados: 107 sondagens da lista (uma por nome de alvo, ficando 107 ficheiros em bruto guardados como prova, alguns dos quais são o mesmo endereço sondado duas vezes sob nomes diferentes, para confirmar ou para corrigir um endereço errado meu) mais 25 pedidos dirigidos. Destes 25, 6 são pedidos de cabeçalho apenas e 4 são pedidos com intervalo de bytes a ficheiros PDF, para não descarregar 43 MB de uma ata só para saber se tem letras. 6 pesquisas (`WebSearch`). 5 leituras assistidas (`WebFetch`), uma das quais devolveu 403 no Councilmatic, que eu já tinha em bruto e li do ficheiro guardado. Nenhum pedido a um anfitrião passou de uma dezena, e o sítio da casa não foi tocado.

*(A primeira versão desta linha dizia «125 pedidos a 77 endereços distintos». Era uma contagem de cabeça e estava errada nas duas metades. A contagem acima vem de `ls raw_*.html | wc -l` e da soma dos pedidos dirigidos. Fica dito, porque um número estimado num documento que existe para defender números medidos é exatamente o erro que o documento diz para não cometer.)*

**Tempo.** Da primeira leitura das regras às 11:58:06 UTC de 15.09.2026 ao último pedido verificado às 12:14 UTC: cerca de 16 minutos de relógio para a medição e a leitura, mais a redação.

**O que ficou por verificar, e está marcado no corpo.** O orçamento de Évora 2027 e a sua repartição, que só vi em notícias (`[verify]`). A avaliação intercalar COM(2025) 587 final, referida em pesquisa e não aberta por mim no EUR-Lex (`[verify]`). O conteúdo dos três relatórios do painel sobre Évora, cuja existência, tipo e camada de texto verifiquei, mas cujo texto não li. E uma correção ao meu próprio trabalho, que fica dita porque a régua a apanhou: a minha primeira contagem de algarismos incluía o JSON dentro dos `<script>` e deu três falsos positivos (`data.ofgl.fr`, `base.gov.pt` no detalhe, `soldipubblici.gov.it`); as contagens deste documento são as da segunda medição, feita depois de retirar os `<script>` e os `<style>`.

**O que eu não decidi.** Nada. A ordem do §3 é uma recomendação com a razão de cada posição escrita, e a lista do §4 é uma leitura das regras que já estão escritas em `VISAO.md`, na `POLITICA-DA-AUTONOMIA.md` e no `direcao.md`. A escolha é do lugar de direção com o diretor.
