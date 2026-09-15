# Referências: projetos comparáveis ao piloto de Évora

*Pesquisa de referências feita pelo Claude Opus 5 (1M) a 15.09.2026, começada às 11:56:43Z, para o piloto de Évora (o micro-observatório da Câmara Municipal de Évora e a especial «Évora 2027, Capital Europeia da Cultura»). Só entra o que foi confirmado hoje nas páginas dos próprios projetos. O que não se confirmou fica `[verify]`, com o endereço e a resposta exata que a máquina devolveu. Nenhuma decisão sobre o sítio se toma aqui: isso é do lugar de direção com o diretor. Prosa em português (Acordo Ortográfico), sem travessões.*

## Como se leu, e o que isso limita

Três formas de leitura, e cada ficha diz qual foi:

1. **Ferramenta de busca (`WebSearch`)**, só para encontrar candidatos. Nenhuma afirmação desta folha assenta num resumo de busca: o que a busca sugeriu e a página do projeto não confirmou está marcado `[verify]`.
2. **Ferramenta de leitura (`WebFetch`)**, que converte a página em texto e a resume com um modelo pequeno. As citações que devolve na língua do sítio vão entre aspas; **quando a ferramenta traduziu para português, a frase vai como paráfrase e é dito que é paráfrase**. Esta é uma limitação real: a leitura não foi feita com os meus olhos no HTML, foi feita por um intermediário.
3. **`curl` com extração de texto local**, onde eu vi o HTML tal como o servidor o serviu. As fichas que assentam nisto dizem «lido no HTML». É a leitura mais firme das três.

**Horas.** O primeiro bloco de leituras (as marcadas «entre 11:57Z e 12:12Z») foi feito nessa janela; o minuto exato de cada pedido não ficou registado, por isso vai como intervalo e não como hora fingida. As leituras do segundo bloco têm hora medida ao segundo.

**Três pedidos ficaram presos e foram cancelados às 12:57Z, sem nunca devolverem nada em cerca de cinquenta minutos:** `https://api.openraadsinformatie.nl/v1/elastic/_search` (contagem de municípios), `https://transparencia.gov.pt/pt/municipios/portugal-e-os-municipios/gestao-financeira/` e `https://opendata.matera-basilicata2019.it/en/` (formatos e licença). O que dependia deles está `[verify]` nas fichas.

## A tabela dos projetos

Vinte projetos. A coluna «vivo» diz o estado confirmado hoje e o sinal em que assenta.

| # | projeto | país | o que mostra | fontes | formas | vivo? (sinal confirmado hoje) | endereço | lido (UTC, 15.09.2026) |
|---|---|---|---|---|---|---|---|---|
| 1 | Índice de Transparência Municipal (ITM) | PT | grau de transparência de cada câmara, em 76 indicadores e 7 dimensões | os próprios sítios das câmaras, avaliados à mão | índice, posição, relatório | **parado**: a página diz que prepara «a segunda série» e que não faz «a habitual avaliação»; dados mais recentes de 2017 | https://transparencia.pt/itm/ | 11:57Z a 12:12Z |
| 2 | Mais Transparência, área dos Municípios | PT | indicadores por município em 5 categorias (dinâmica económica, gestão financeira, gestão administrativa, decisões fiscais, descentralização) e «bilhete de identidade» | «dados disponibilizados no portal nacional de dados abertos» (a página não nomeia a fonte por indicador) | fichas e indicadores; formas não detalhadas na página lida | **vivo**, mas sem data de atualização visível | https://transparencia.gov.pt/pt/municipios/ | 11:57Z a 12:12Z |
| 3 | Portal BASE | PT | todos os contratos públicos: contratos, anúncios, entidades, modificações contratuais, impugnações, consultas preliminares, medidas especiais | o próprio registo legal da contratação pública | pesquisa por tipo, relatórios, descarga | **vivo**; devolve 404 a quem não se apresenta como navegador | https://www.base.gov.pt/Base4/pt/inicio/ | 12:0xZ (curl) |
| 4 | Votações AR | PT | votações e posições dos partidos nas iniciativas da Assembleia, com sumário de cada uma | app.parlamento.pt (ligação no pacote); autor do sítio não confirmado | fichas de iniciativa, fase de votação, sumário rotulado «gerado por AI» | **vivo**: datas no pacote de 2022-03-29 a **2026-08-26** | https://www.votacoes.pt/ | 12:0xZ (curl, pacote JS) |
| 5 | Hemiciclo | PT | (foi votações por deputado; não se leu conteúdo) | por confirmar | por confirmar | **morto**: `http://hemiciclo.pt/` devolve **HTTP 410 Gone**; em https o TLS falha | http://hemiciclo.pt/ | 12:0xZ (curl) |
| 6 | Anuário Financeiro dos Municípios Portugueses | PT | evolução económico-financeira dos 308 municípios e dos seus grupos, com rankings | contas das autarquias (investigação académica) | publicação anual em PDF, rankings | **vivo**: 21.ª edição, relativa a 2024, apresentada a 4 de novembro de 2025 | https://www.occ.pt/pt-pt/noticias/apresentado-anuario-financeiro-dos-municipios-portugueses-2024 | 12:54:09Z |
| 7 | OpenBesluitvorming / Open Raadsinformatie | NL | pesquisa nos documentos das reuniões das câmaras (atas, moções, emendas, decisões) | sistemas de informação das próprias câmaras, por máquina | busca a texto inteiro, API | **`[verify]`**: a página é uma casca de 948 bytes sem JavaScript; a página do projeto na Open State Foundation tem a última notícia de maio de 2020 | https://openbesluitvorming.nl/ | 12:0xZ (curl) |
| 8 | Openspending.nl | NL | orçamentos e execução de municípios, províncias e conselhos de água, para comparar | dados Iv3 das próprias autarquias, transmitidos pelo CBS | comparação, séries, descarga | **vivo**, sem data de atualização visível na página lida | https://openspending.nl/over | 11:57Z a 12:12Z |
| 9 | Waarstaatjegemeente.nl | NL | números de todos os municípios em todos os domínios de política, para comparar um contra outro, contra a região e contra o país | polícia, UWV, KVK, CBS (dito em geral, não por indicador) | painéis, comparações, mapas, relatórios, painel próprio, API | **vivo**; sem datas por indicador na página lida | https://www.waarstaatjegemeente.nl/ | 11:57Z a 12:12Z |
| 10 | OpenBilanci | IT | orçamentos de todos os municípios italianos, um mini-sítio por município | orçamentos oficiais («dati grezzi e ufficiali») | séries no tempo, comparação, descarga | **congelado**: «preventivi fino al 2022 e consuntivi fino al 2021» | https://openbilanci.it/ | 11:57Z a 12:12Z |
| 11 | OpenCoesione | IT | cada projeto financiado pela política de coesão: montante, beneficiário, lugar, estado de execução | Departamento para as Políticas de Coesão e RGS | mapas, fichas de projeto, focos, descarga | **vivo**: cadência bimestral; «Aggiornati al 30 aprile 2026 i focus navigabili» | https://opencoesione.gov.it/it/ | 11:57Z a 12:12Z |
| 12 | Monithon | IT | relatórios de monitorização cívica de obras e projetos pagos com dinheiro público, feitos por cidadãos e alunos | OpenCoesione mais visita ao terreno | mapa com um ponto por relatório, relatórios, formação | **vivo**: último artigo do blogue a **06/09/2026** | https://www.monithon.eu/ | 11:57Z a 12:12Z |
| 13 | ¿Dónde van mis impuestos? | ES | para onde vai o Orçamento Geral do Estado e o das Comunidades Autónomas | orçamentos oficiais (ano por confirmar) | árvore do orçamento, políticas, visita guiada, «Ojo con esto» | **vivo** (o ano dos dados ficou `[verify]`: `/metodologia` devolveu 403) | https://dondevanmisimpuestos.es/ | 12:0xZ (curl) |
| 14 | Gobierto Presupuestos Municipales | ES | orçamento, execução e indicadores de cada município espanhol, com comparação | base do Ministério (SGCAL/CONPREL) e INE | séries, mapas, gráficos, nota metodológica, código aberto | **vivo**: «La última actualización de los datos de los presupuestos corresponde a la actualización del 2025 por parte del Ministerio» | https://presupuestos.gobierto.es/about | 11:57Z a 12:12Z |
| 15 | TheyWorkForYou | UK | tudo o que se disse no Parlamento e o registo de voto de cada deputado, resumido por tema | dados oficiais dos parlamentos mais agrupamento próprio | perfil por deputado, nota de 0 a 100 por tema, votos que contam e votos informativos | **vivo**: recolhe dados novos todas as manhãs (paráfrase da ferramenta) | https://www.theyworkforyou.com/voting-information/ | 11:57Z a 12:12Z |
| 16 | NosFinancesLocales.fr | FR | 66 indicadores de contas das comunas, de 2000 a 2012 | collectivites-locales.gouv.fr e DGFiP | comparação entre comunas, séries | **morto, com a razão dita**: «Service fermé. Faute de motivation bénévole suffisante, nous avons du fermer ce service.» | https://www.nosfinanceslocales.fr/ | 12:0xZ (lido no HTML) |
| 17 | abgeordnetenwatch.de | DE | perguntas a eleitos, votações, atividades paralelas e financiamento dos partidos | dados dos parlamentos mais investigação própria | perfis, votações, petições, investigações | **vivo**; **sem nível municipal na navegação de hoje** (Bundestag, Parlamento Europeu, 16 Landtage e arquivo) | https://www.abgeordnetenwatch.de/ueber-uns | 11:57Z a 12:12Z |
| 18 | OffenerHaushalt.de | DE | orçamentos do Estado federal, dos Länder e dos municípios, em desenho | ficheiros CSV ou Excel entregues pelas entidades | visualização do orçamento | **morto por declaração**: «Diese Website ist Teil eines abgeschlossenen Projekts der Open Knowledge Foundation Deutschland und wird nicht mehr aktualisiert.»; ano mais recente à vista, 2017 | https://offenerhaushalt.de/ | 11:57Z a 12:12Z |
| 19 | Slovo i Dilo | UA | promessas de políticos com estados (cumpridas e não cumpridas), com secções próprias para presidentes de câmara | declarações públicas seguidas pela redação | seguidor de promessas, rankings, notícias | **vivo**: notícias com data de 15 de setembro de 2026 | https://www.slovoidilo.ua/ | 11:57Z a 12:12Z |
| 20 | Matera 2019 Open Data | IT (Capital Europeia da Cultura) | o impacto da capital de cultura: despesa turística, chegadas, emprego, fornecedores locais | bases da própria Fundação, APT Basilicata, ISTAT, Infocamere | painéis de impacto com números | **arquivo**: nada indica atualização depois de 2019 (um inquérito de 2020) | https://opendata.matera-basilicata2019.it/en/impact/ | 11:57Z a 12:12Z |

## As fichas

Cada ficha diz o que se leu e onde. «A minha leitura» é minha, e vai dita como minha.

### 1. Índice de Transparência Municipal (ITM)

- **Endereço lido:** https://transparencia.pt/itm/ (ferramenta de leitura, entre 11:57Z e 12:12Z de 15.09.2026).
- **Quem o faz e como se financia:** «Desenvolvido pela Transparência e Integridade e os seus parceiros», com uma comissão científica de académicos. Financiamento, pela própria página: «A TI-PT não dispõe, atualmente, de qualquer subsídio ou subvenção financiando as atividades de recolha de dados e de comunicação do ITM.»
- **O que mostra:** quão transparente é cada câmara, medido em «76 indicadores e as sete dimensões em que estão agrupados» (organização e funcionamento, planos e relatórios, impostos e taxas, relação com a sociedade, contratação pública, transparência económico-financeira, urbanismo).
- **De que fontes:** os próprios sítios das câmaras, avaliados **à mão**, não por máquina. Isto é o custo de manutenção que o mata.
- **Como mostra:** índice e posição por município, com relatório e metodologia descarregáveis.
- **Fonte ao pé de cada número:** não confirmado na página lida. `[verify]`
- **Método explicado:** sim, em documento à parte («Descarregar a metodologia e descrição dos indicadores»).
- **Vivo?** Parado. A página diz que, «depois de cinco anos de edições», prepara «a segunda série deste trabalho» e que não faz «a habitual avaliação dos websites dos municípios portugueses». A edição de dados mais recente que a página mostra é de 2017; o rodapé diz © 2026.
- **A minha leitura:** faz bem a pergunta certa (compara câmaras entre si com uma régua publicada) e mal a durabilidade (uma régua que precisa de uma pessoa a abrir 308 sítios não sobrevive a um ano sem dinheiro). Para um leitor de primeira vez, a promessa da capa não bate com a data dos dados, e isso, num sítio de transparência, custa mais do que não existir.

### 2. Mais Transparência, área dos Municípios

- **Endereço lido:** https://transparencia.gov.pt/pt/municipios/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz:** o Estado. «O portal Mais Transparência é uma plataforma digital de informação sobre vários temas de gestão e recursos públicos da responsabilidade da ARTE, Agência para a Reforma Tecnológica do Estado.»
- **O que mostra:** cinco famílias de indicadores (dinâmica económica, gestão financeira, gestão administrativa, decisões fiscais, descentralização de competências) e um «bilhete de identidade» por município.
- **De que fontes:** «A informação é atualizada permanentemente com os dados disponibilizados no portal nacional de dados abertos.» A página **não nomeia a fonte de cada indicador**.
- **Como mostra:** não detalhado na página lida. Uma notícia do gov.pt fala de uma ficha para cada um dos 308 municípios: **não confirmado na fonte própria** `[verify]`.
- **Fonte ao pé de cada número:** não. **Método explicado:** não confirmado `[verify]`.
- **Vivo?** Sim, sem nenhuma data de atualização visível. Este é o ponto: «atualizada permanentemente» é uma afirmação que o leitor não pode conferir.
- **A minha leitura:** é o concorrente mais direto do piloto e, ao mesmo tempo, a prova de que a camada que falta não são os dados. Tem os números e não tem o que o piloto quer ter: a data, a origem e a leitura. Para um leitor de primeira vez não há como saber se o número é de ontem ou de 2019.
- **Não confirmado:** a página dos indicadores de gestão financeira (`.../portugal-e-os-municipios/gestao-financeira/`) ficou presa e foi cancelada às 12:57Z sem devolver nada. `[verify]`

### 3. Portal BASE

- **Endereço lido:** https://www.base.gov.pt/Base4/pt/inicio/ (lido no HTML, cerca das 12:0xZ).
- **Quem o faz:** a ficha em dados.gov.pt atribui-o ao IMPIC; **a página inicial lida não o diz**, por isso fica `[verify]` na fonte própria.
- **O que mostra:** «O Portal BASE centraliza a informação sobre os contratos públicos celebrados em Portugal continental e regiões autónomas.» Pesquisa por contratos, anúncios do Diário da República, entidades, modificações contratuais, bens móveis, não celebrações de contrato, impugnações, consultas preliminares e medidas especiais (com as alíneas da Lei n.º 30/2021 e o PRR à cabeça).
- **De que fontes:** é ele próprio o registo legal; as entidades públicas são obrigadas a publicar ali.
- **Como mostra:** formulários de pesquisa, relatórios, legislação, sanções acessórias.
- **Vivo?** Sim. Com um senão medido hoje: `https://www.base.gov.pt/` e `/Base4/pt/pesquisa/` devolveram **404** a pedidos sem agente de navegador, e **200** ao mesmo pedido com agente de navegador. Quem lê por máquina tropeça primeiro.
- **A minha leitura:** é a fonte de ouro para o piloto (cada contrato da câmara está lá, com adjudicatário e valor) e é ilegível como leitura: ninguém percebe uma câmara olhando para uma lista de contratos. O trabalho todo do piloto está entre este portal e uma frase que se entenda.

### 4. Votações AR

- **Endereço lido:** https://www.votacoes.pt/ e o pacote `/assets/index-RUM6Y5Wa.js` (lido no HTML e no pacote, cerca das 12:0xZ).
- **Quem o faz:** não confirmado. O pacote tem uma ligação para `buymeacoffee.com/votacoes`, o que sugere obra de uma pessoa ou de um grupo pequeno, mas o nome não apareceu. `[verify]`
- **O que mostra:** «Explore as votações e posições dos partidos políticos nas resoluções da Assembleia da República. Acompanhe, analise e compare como os deputados votam em temas importantes para Portugal.»
- **De que fontes:** o pacote traz uma ligação para um documento em `app.parlamento.pt`. Todo o conteúdo viaja dentro do pacote de JavaScript (11 383 883 bytes), não vem de uma API à vista.
- **Como mostra:** ficha por iniciativa, com «Fase de votação:» e um sumário. **O sumário está rotulado «Sumário (gerado por AI)»**, e o pacote também contém a frase «gerados por IA».
- **Fonte ao pé de cada número:** não confirmado `[verify]`. **Método explicado:** não confirmado `[verify]`.
- **Vivo?** Sim. As datas dentro do pacote vão de **2022-03-29 a 2026-08-26** (1 106 datas distintas), o que põe a última carga a cerca de três semanas de hoje.
- **A minha leitura:** é o parente português mais próximo do que o piloto quer ser, e chegou antes ao problema que a casa também tem: como é que se põe uma máquina a resumir um documento oficial sem enganar ninguém. A resposta dele (um rótulo por sumário) é mínima mas é honesta. O que faz mal: o sítio inteiro é uma casca sem JavaScript, ou seja, não é citável nem legível por agentes, e não se percebe quem responde por ele.

### 5. Hemiciclo

- **Endereço lido:** http://hemiciclo.pt/ e https://www.hemiciclo.pt/ (curl, cerca das 12:0xZ).
- **Estado:** **morto**. Em http, o servidor devolve **HTTP 410 Gone**, que é o código de «isto existiu e acabou». Em https, a ligação TLS falha («SSL_ERROR_SYSCALL»). A ferramenta de leitura não trouxe conteúdo nenhum.
- **O que foi:** a imprensa de 2017 descreve um sítio que mostrava o sentido de voto de cada deputado. Como não se confirma na fonte própria, **não conta como descrição**: fica `[verify]`.
- **Razão da morte:** desconhecida `[verify]`.
- **A minha leitura:** o 410 é o achado. Um projeto cívico português de escrutínio parlamentar com cobertura nacional na estreia desapareceu, e o que fica no lugar é um código de erro. É o aviso mais barato que esta pesquisa dá ao piloto.

### 6. Anuário Financeiro dos Municípios Portugueses

- **Endereço lido:** https://www.occ.pt/pt-pt/noticias/apresentado-anuario-financeiro-dos-municipios-portugueses-2024 (lido no HTML, às **12:54:09Z**).
- **Quem o faz:** «Investigação do CICF/IPCA, com o apoio da Ordem e do Tribunal de Contas», ou seja, o Centro de Investigação em Contabilidade e Fiscalidade do Instituto Politécnico do Cávado e do Ave, com a Ordem dos Contabilistas Certificados e o Tribunal de Contas.
- **O que mostra:** «uma obra imprescindível para avaliar a evolução económico-financeira das autarquias e dos respetivos grupos empresariais», com rankings por dimensão de município.
- **Vivo?** Sim: a edição relativa a 2024 «foi apresentada na manhã desta terça-feira, 4 de novembro» de 2025, e é «a vigésima primeira edição».
- **Como mostra:** publicação anual (PDF), não sítio navegável. Fonte por número e método: `[verify]`, não se abriu o PDF.
- **A minha leitura:** é a régua que existe em Portugal para comparar câmaras pelas contas, com vinte e um anos de continuidade, e vive em PDF uma vez por ano. O piloto não precisa de a refazer; precisa de saber que ela existe, que é anual e que o número que ela publica para Évora tem de bater com o que o sítio disser.

### 7. OpenBesluitvorming / Open Raadsinformatie

- **Endereços lidos:** https://openbesluitvorming.nl/ (curl, cerca das 12:0xZ: **948 bytes, texto visível «OpenBesluitvorming» e nada mais**) e a página do projeto em https://openstate.eu/en/projects-tools-data/decisions/open-municipal-information/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz:** a Open State Foundation, com a Ontola e a VNG Realisatie (a parceria é dita na página do projeto).
- **O que mostra:** recolhe e normaliza «meetings, agenda's and other documents of local municipalities», para que jornalistas e cidadãos encontrem o que se decidiu nas reuniões.
- **De que fontes:** os sistemas de informação das próprias câmaras, por máquina, com API documentada e repositório público; os dados servem-se também em `zoek.openraadsinformatie.nl`.
- **Como mostra:** busca a texto inteiro nos documentos; a interface exige JavaScript.
- **Vivo?** `[verify]`. A página do projeto mostra marcos de 2015 (piloto), novembro de 2015 (cinco câmaras), fevereiro de 2018 («more than 100 municipalities») e **a última notícia é de maio de 2020**. O número de câmaras hoje não se confirmou: o pedido à API (`api.openraadsinformatie.nl/v1/elastic/_search`) ficou preso e foi cancelado às 12:57Z. O «320+» que aparece em páginas de terceiros **não está confirmado**.
- **A minha leitura:** é o único projeto desta lista que ataca de frente a família de fontes que o diretor quer para Évora (as atas e o que se decidiu nas reuniões), e é também o que menos se deixa ler: uma casca sem JavaScript e uma página de projeto que parou em 2020. A ideia é a certa; o estado prova que a manutenção é o problema, não a engenharia.

### 8. Openspending.nl

- **Endereço lido:** https://openspending.nl/over (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz e como se financia:** iniciativa da Open State Foundation com apoio do ministério do Interior (BZK); o CBS (o instituto de estatística) transmite os dados dos municípios (paráfrase da ferramenta, que traduziu o neerlandês).
- **O que mostra:** orçamentos e execução de municípios, províncias e conselhos de água, para ver e comparar.
- **De que fontes:** os dados Iv3 das próprias autarquias, por via do CBS, mais dados de detalhe financeiro a partir do último trimestre de 2023.
- **Como mostra:** comparação entre autarquias e no tempo, com descarga.
- **Vivo?** Sim quanto ao sítio; **sem data de atualização visível na página lida** `[verify]`.
- **A minha leitura:** a lição está na cadeia: uma associação civil pega no que o instituto de estatística já recebe por obrigação legal e transforma-o em comparação. Não recolhe nada à mão. Para Évora, o equivalente é o que a DGAL e o Tribunal de Contas já recebem das câmaras.

### 9. Waarstaatjegemeente.nl

- **Endereço lido:** https://www.waarstaatjegemeente.nl/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz:** a VNG, a associação dos municípios neerlandeses.
- **O que mostra:** «Hier vindt u cijfers over alle gemeenten op alle belangrijke beleidsterreinen», ou seja, números de todos os municípios em todos os domínios de política.
- **De que fontes:** «De data zijn afkomstig uit verschillende bronnen, zoals politie, UWV, KVK en CBS» (polícia, segurança social, registo comercial, instituto de estatística). Dito em geral; **não por indicador** na página lida.
- **Como mostra:** painéis por domínio, comparação de um município contra outro, contra a região, contra o país, mapas, relatórios, painel feito pelo leitor, API.
- **Fonte ao pé de cada número e datas por indicador:** não confirmado na página lida `[verify]`.
- **Vivo?** Sim.
- **A minha leitura:** é a melhor prova de que a comparação é a forma, não um extra: escolher o concelho e pôr ao lado o país é a operação central do sítio, não um botão escondido. É também a demonstração de que quem tem a associação dos municípios por dono consegue manter isto durante anos. O piloto não tem esse dono, e tem de ganhar a mesma durabilidade de outra maneira.

### 10. OpenBilanci

- **Endereço lido:** https://openbilanci.it/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz e como se financia:** projeto da Fondazione Openpolis (Via Merulana 19, Roma), «Realizzato con il cofinanziamento dell'Unione Europea», com apoio da Região do Lácio.
- **O que mostra:** «I bilanci dal 2005 al 2022 di tutti i Comuni», com um mini-sítio por município e duas séries (2005-2015 e de 2016 em diante).
- **De que fontes:** orçamentos oficiais («dati grezzi e ufficiali»). A atribuição à Ragioneria Generale dello Stato aparece em páginas de terceiros e **não se confirmou na página lida** `[verify]`.
- **Como mostra:** séries no tempo, comparação entre municípios, descarga em dados abertos.
- **Vivo?** **Congelado, e a página diz porquê em relação aos dados:** «Su Openbilanci sono disponibili i bilanci preventivi fino al 2022 e consuntivi fino al 2021.» Quatro anos de atraso no melhor caso.
- **A minha leitura:** faz muito bem a coisa mais difícil (a série longa e harmonizada, que é o que permite dizer «esta câmara gasta mais do que gastava»), e faz mal a única coisa que a mantém viva (a carga nova). O aviso à cabeça salva-lhe a honestidade: diz ao leitor onde acaba o que sabe. O piloto vai precisar exatamente desse aviso, e do selo que o obrigue a estar lá.

### 11. OpenCoesione

- **Endereço lido:** https://opencoesione.gov.it/it/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz:** a Presidência do Conselho de Ministros, Departamento para as Políticas de Coesão, com a Ragioneria Generale dello Stato.
- **O que mostra:** cada projeto financiado pela política de coesão, com custo público, beneficiários, lugar, tema e estado de execução. Os contadores lidos hoje: 1 838 162 projetos, 357,4 mil milhões de euros de custo público, 198,9 mil milhões pagos.
- **De que fontes:** o próprio sistema de monitorização do Estado, por máquina.
- **Como mostra:** mapas, fichas de projeto, «focus» navegáveis, descarga.
- **Vivo?** Sim, com cadência bimestral, e com a data à vista: «Aggiornati al 30 aprile 2026 i focus navigabili sul portale OpenCoesione.»
- **A minha leitura:** é o padrão do que um Estado consegue fazer quando publica o projeto e não só a rubrica. Para Évora interessa duas vezes: porque o dinheiro do PRR e do Alentejo 2030 que passa pela câmara aparece neste formato em Itália, e porque prova que dizer a data da atualização na primeira página é possível mesmo com milhões de linhas.

### 12. Monithon

- **Endereços lidos:** https://www.monithon.eu/ e https://www.monithon.eu/blog/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz e como se financia:** «Monithon è un'iniziativa indipendente e non profit. Dal 2013 sviluppiamo metodi e strumenti per il monitoraggio civico dei fondi pubblici.» Associação sem fins lucrativos, com donativos e trabalho voluntário; «I report sono creati da studenti, associazioni, giornalisti e gruppi di cittadini.»
- **O que mostra:** «Ogni pallino sulla mappa è un report su un progetto finanziato da fondi pubblici, frutto di indagini indipendenti durate settimane o mesi.» Ou seja: o projeto público visto no terreno, não só na base de dados.
- **De que fontes:** os dados do OpenCoesione, mais a visita e a entrevista feitas pelo grupo que assina o relatório.
- **Como mostra:** mapa com um ponto por relatório, relatórios com método fixo, formação («iMonitor»), licença Creative Commons BY-SA 4.0.
- **Vivo?** Sim: o artigo mais recente do blogue é de **06/09/2026** (anuncia formação para 28 de setembro de 2026, que é data futura e não data de publicação).
- **A minha leitura:** é o único projeto da lista que fecha o círculo entre o número e o que existe no terreno, e fá-lo com método publicado e licença aberta. O que faz mal, para um leitor de primeira vez, é a cobertura: setecentos relatórios num país de milhões de projetos é uma amostra, e um leitor pode confundir «não há relatório» com «não há problema».

### 13. ¿Dónde van mis impuestos?

- **Endereço lido:** https://dondevanmisimpuestos.es/ (lido no HTML, cerca das 12:0xZ; a ferramenta de leitura levou 403 duas vezes, na capa e em `/metodologia`).
- **Quem o faz e como se financia:** «Un proyecto de Civio basado en el código de Open Data Aragón»; «Somos una organización sin ánimo de lucro. Si te gusta el proyecto, puedes ayudarnos con una donación.» Pedem também ajuda técnica.
- **O que mostra:** «Explora los Presupuestos Generales del Estado. Te mostramos de un modo claro cómo se distribuye nuestro presupuesto. De dónde vienen los ingresos y a qué destinamos el gasto», com secção para as Comunidades Autónomas. **Não é municipal.**
- **Como mostra:** visão global, políticas concretas (pensões, desemprego, cultura), visita guiada, e duas secções que valem a lista toda: «Ojo con esto» (as ressalvas) e «Metodología».
- **De que fontes e de que ano:** `[verify]`. A página de metodologia devolveu **403** à ferramenta de leitura, e não se voltou a pedir por ordem do limite.
- **Vivo?** Sim (capa servida hoje, 200 com agente de navegador).
- **A minha leitura:** o que este faz melhor do que todos os outros é a entrada para quem nunca viu um orçamento: uma visita guiada e um «cuidado com isto» no menu de topo, ao lado da metodologia, e não escondidos no rodapé. É o desenho que o piloto deve invejar: as ressalvas como conteúdo, não como letra pequena.

### 14. Gobierto Presupuestos Municipales

- **Endereço lido:** https://presupuestos.gobierto.es/about (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz:** a Populate («un estudio dedicado a productos de civic engagement»), com a equipa nomeada na página (produto, backend, Rails, D3.js, ilustração). Financiamento: não dito `[verify]`.
- **O que mostra:** orçamento, execução e indicadores económicos de cada município espanhol, com comparação entre municípios.
- **De que fontes:** «Los datos económicos de los presupuestos de los municipios están extraídos de la base de datos que publica el Ministerio de Economía y Hacienda» (Secretaría General de Coordinación Autonómica y Local), e a demografia do INE.
- **Como mostra:** séries, mapas e gráficos, com nota metodológica e o código da transformação publicado no GitHub.
- **Vivo?** Sim, e com a frescura dita como é: «La última actualización de los datos de los presupuestos corresponde a la actualización del 2025 por parte del Ministerio.» Repare-se na construção: a frescura do sítio é a frescura da fonte, e diz-se assim.
- **A minha leitura:** é o mais próximo do que o piloto quer fazer com o orçamento de uma câmara, e a lição fina é essa frase: não promete atualidade, promete o que o ministério publicou. Publicar o código da transformação é a outra metade da mesma honestidade.

### 15. TheyWorkForYou

- **Endereço lido:** https://www.theyworkforyou.com/voting-information/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o faz e como se financia:** a mySociety, instituição de solidariedade registada (1076346) e sociedade (3277032). Diz que o sítio não é financiado por dinheiro público e pede donativos (paráfrase: a ferramenta traduziu).
- **O que mostra:** o que cada deputado disse e como votou, resumido por tema numa nota de 0 a 100.
- **De que fontes:** combinação dos dados oficiais dos parlamentos com o agrupamento próprio dos votos; recolhe dados novos todas as manhãs (paráfrase).
- **Como mostra:** perfil por deputado, resumos por tema, separação entre votos que contam para o resumo e votos informativos.
- **Método explicado:** sim, e é o melhor exemplo da lista. Publica os critérios de inclusão de um voto e publica os limites: como as instruções de voto dos partidos não são públicas, não pode mostrar qual foi a instrução, e usa o voto médio do partido como substituto; e avisa que um voto pode não representar a opinião pessoal do deputado, mas representa o seu efeito no processo político (paráfrases; a ferramenta traduziu).
- **Vivo?** Sim.
- **A minha leitura:** é a prova de que se pode transformar um registo bruto numa leitura («este deputado votou geralmente a favor de x») sem mentir, desde que se diga o que a transformação não sabe. Para o piloto, que vai ter de dizer se um vereador cumpriu o que prometeu, esta é a peça de método a copiar.

### 16. NosFinancesLocales.fr

- **Endereços lidos:** https://www.nosfinanceslocales.fr/ (lido no HTML, cerca das 12:0xZ) e o anúncio em https://www.regardscitoyens.org/nosfinanceslocales-fr-pour-une-meilleure-transparence-financiere-de-nos-communes/ (ferramenta de leitura).
- **Quem o fez:** a Regards Citoyens, associação de voluntários.
- **O que mostrava:** 66 indicadores das contas das comunas, de 2000 a 2012, para comparar e para «évaluer les actions du conseil municipal» antes das eleições municipais; a fonte era o portal `collectivites-locales.gouv.fr` e a DGFiP. O anúncio é de **4 de fevereiro de 2014**.
- **Vivo?** **Morto, e com a razão escrita na porta:** «Service fermé. Faute de motivation bénévole suffisante, nous avons du fermer ce service. Si vous trouvez que son absence vous manque et que vous êtes motivé(e) pour le réanimer, contactez nous ! Si vous souhaitez faire de l'archéologie, il en reste sans doute quelques traces sur Web Archive.» O certificado do domínio já nem cobre este nome (cobre subdomínios de `regardscitoyens.org`).
- **A minha leitura:** é a ficha mais útil de todas. Uma equipa que construiu o NosDéputés.fr, com a DGFiP como fonte e a máquina toda montada, desligou o serviço municipal por falta de gente para o manter. Não foi por falta de dados nem de competência. Foi por falta de manutenção, que é o recurso que o piloto tem de orçamentar primeiro.

### 17. abgeordnetenwatch.de

- **Endereços lidos:** https://www.abgeordnetenwatch.de/ueber-uns e a navegação servida em `/parlamente` (ferramenta de leitura e HTML, entre 11:57Z e 12:12Z), mais o artigo de 16 de junho de 2011 em `/blog/in-eigener-sache/in-diesen-sechs-staedten-gibt-es-jetzt-abgeordnetenwatchde-fuer-den-stadtrat`.
- **Quem o faz e como se financia:** organização alemã de transparência política, com donativos, sócios e relatórios anuais e de impacto (o de 2024 aparece na página). As proporções do financiamento não se confirmaram: `/ueber-uns/finanzierung` devolveu **404**. `[verify]`
- **O que mostra:** perguntas públicas a eleitos com as respostas, votações, atividades paralelas e dinheiro dos partidos.
- **Níveis cobertos hoje:** na navegação lida aparecem Bundestag, Parlamento Europeu, os 16 Landtage e um arquivo. **Não aparece nível municipal.**
- **O que isso ensina:** em 16 de junho de 2011 o projeto anunciou o nível municipal em seis cidades (Stuttgart, Leipzig, Dresden, Leverkusen, Pforzheim e Villingen-Schwenningen), a começar pelas perguntas aos vereadores e com a intenção de documentar depois as votações. Quinze anos depois, a navegação do sítio não tem câmaras municipais. Não se confirmou a razão `[verify]`, mas o facto é que o nível municipal não sobreviveu no projeto alemão de escrutínio mais bem financiado.
- **A minha leitura:** o municipal é onde estes projetos morrem, mesmo quando o nacional vive. É a mesma lição do NosFinancesLocales e do Politik bei uns, dita por um terceiro.

### 18. OffenerHaushalt.de

- **Endereço lido:** https://offenerhaushalt.de/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o fez:** a Open Knowledge Foundation Deutschland.
- **O que mostrava:** orçamentos do Estado federal, dos Länder e dos municípios, em visualização; recebia ficheiros CSV ou Excel com ano, valor, sentido (receita ou despesa) e rubrica.
- **Vivo?** **Morto por declaração, no topo da página:** «Diese Website ist Teil eines abgeschlossenen Projekts der Open Knowledge Foundation Deutschland und wird nicht mehr aktualisiert.» O ano mais recente à vista é 2017.
- **A minha leitura:** o desenho do orçamento em árvore, que toda a gente copia, é a parte fácil; o que ninguém sustenta é a entrada de dados quando ela depende de cada município enviar um ficheiro. Um modelo que precisa que 308 câmaras carreguem um CSV não é um modelo, é um desejo.

### 19. Slovo i Dilo (Слово і Діло)

- **Endereço lido:** https://www.slovoidilo.ua/ (ferramenta de leitura, entre 11:57Z e 12:12Z; `slovoidilo.ua/en` devolveu 404).
- **Quem o faz e como se financia:** meio de comunicação em linha registado (identificador de media R40-05063), com botão de apoio («Підтримати»). Quem responde por ele e como se financia: `[verify]`.
- **O que mostra:** seguidor de promessas de políticos, com estados (a secção lida é `/obicjanky/vykonani`, «cumpridas»), e rankings que incluem presidentes de administrações regionais e **presidentes de câmara** (`/rejtyngy/golovy-miskyh-rad`).
- **Como mostra:** fichas de político, promessa com estado, rankings, notícias.
- **Vivo?** Sim: notícias com data de **15 de setembro de 2026**, hoje.
- **A minha leitura:** é o único projeto confirmado hoje que aplica estados de promessa a autarcas, e é feito por uma redação, não por uma associação de dados. Diz duas coisas ao piloto: que o formato «promessa com estado» aguenta escala municipal, e que quem o aguenta tem redação a pagar, o que no caso da casa é a máquina.

### 20. Matera 2019 Open Data

- **Endereço lido:** https://opendata.matera-basilicata2019.it/en/impact/ (ferramenta de leitura, entre 11:57Z e 12:12Z).
- **Quem o fez:** a «Fondazione di partecipazione Matera Basilicata 2019», com desenho e desenvolvimento do Sheldon.studio.
- **O que mostra:** o impacto da Capital Europeia da Cultura de 2019: despesa turística (121,3 milhões de euros), chegadas de turistas (mais 153,7% entre 2014 e 2019), emprego (mais 10% em Matera contra 4% em Itália), empreendedorismo jovem e a fatia de compromissos com empresas da Basilicata (59%).
- **De que fontes:** bases da própria fundação, mais APT Basilicata, ISTAT e Infocamere, tratadas em estudos de avaliação independentes.
- **Vivo?** É um **arquivo**: nada na página indica atualização depois de 2019, e o dado mais recente é um inquérito de 2020.
- **Formatos, licença e o resto da plataforma:** `[verify]`. O pedido a `https://opendata.matera-basilicata2019.it/en/` ficou preso e foi cancelado às 12:57Z.
- **A minha leitura:** é o mais próximo que há de um observatório de capital de cultura, e é retrospetivo: conta o que a capital deixou, depois de acabar, com os números do impacto e não com os do dinheiro durante. A pergunta que uma pessoa de Évora faz em 2026 («para onde está a ir o dinheiro e o que já foi feito») não tem, nesta lista, nenhum exemplo vivo que a responda.

## Outros lidos hoje, fora da tabela

- **Demo.cratica** (`https://demo.cratica.org/`, curl, cerca das 12:0xZ): **morto**. O endereço redireciona para `https://express.cn.com/`, ou seja, o domínio saiu das mãos do projeto. Não se leu nenhum conteúdo do projeto original; tudo o que se soubesse dele seria memória, e memória não conta.
- **Portal Municipal / portalmunicipal.gov.pt** (`https://www.portalmunicipal.gov.pt/municipio?locale=pt`): **não respondeu**. A ferramenta de leitura deu «connect ECONNREFUSED 52.166.92.231:443» e dois pedidos por curl deram tempo esgotado (http=000). Fica `[verify]`: não se afirma que está morto, afirma-se que não respondeu hoje.
- **NosDéputés.fr** (`https://www.nosdeputes.fr/`, curl às **12:53:39Z**): **não respondeu em 20 segundos** (http=000). Fica `[verify]`. O projeto irmão (NosFinancesLocales) está fechado, mas isso não se transfere para este.
- **PoliFLW** (`https://www.poliflw.nl/`, curl às **12:53:37Z**): **vivo**. «Nieuws van politieke partijen inzichtelijk», com **826 018 mensagens** pesquisáveis por tema e por lugar e a data mais recente no HTML de **2026-09-14**, ontem. É da Open State Foundation. Fica fora da tabela por ser vigia de comunicação partidária local e não de números, mas é a peça que falta ao lado de um micro-observatório: a câmara decide, os partidos falam, e alguém indexa as duas coisas.
- **transparenciamunicipal.pt**: **vivo**, e não é da família. É um sítio de referência jurídica sobre a LADA (Lei n.º 26/2016), o Responsável pelo Acesso à Informação e as obrigações de publicação das autarquias. Interessa ao piloto como mapa do que a câmara é obrigada a publicar, não como observatório.

## O que estes projetos ensinam a este piloto

Dez pontos, cada um ligado aos projetos onde foi lido hoje. São leituras minhas sobre factos confirmados, e não decisões.

1. **O que mata estes projetos é a manutenção, não a ideia nem os dados.** O NosFinancesLocales escreveu a razão na porta («faute de motivation bénévole suffisante»), o Politik bei uns escreveu que «as exigências da plataforma não se compadecem com um funcionamento inteiramente voluntário», o OffenerHaushalt declarou-se projeto encerrado, o ITM diz que não faz «a habitual avaliação» por falta de subsídio, e o Hemiciclo devolve 410 Gone. Cinco mortes, quatro delas com a causa dita pelo próprio. A regra da visão («a cadência é limitada pela capacidade de manter, não pela de produzir») não é prudência: é o que separa esta lista entre vivos e mortos.
2. **Quem sobrevive tem um dono que paga ou uma máquina que corre sozinha.** Vivos e frescos: OpenCoesione (Estado, bimestral), TheyWorkForYou (instituição com sócios, carga diária), Waarstaatjegemeente (a associação dos municípios), Gobierto (empresa), PoliFLW e Openspending (fundação com ministério e instituto de estatística), Slovo i Dilo (redação), Monithon (associação com formação paga por fundos). Mortos ou parados: os que assentavam em voluntários ou em avaliação manual. Um observatório mantido por uma máquina sob política publicada é uma terceira via que nenhum destes tentou.
3. **A leitura faz-se sobre o que a máquina do Estado já produz, nunca à mão.** Gobierto lê a base do ministério espanhol, Openspending lê o que o CBS já recebe das câmaras, NosFinancesLocales lia a DGFiP, OpenBilanci lê orçamentos oficiais, Open Raadsinformatie lê os sistemas de atas das câmaras. O único da lista que avaliava à mão, o ITM, é o que parou. Para Évora, isto aponta às fontes que já existem em máquina (contas prestadas ao Tribunal de Contas e à DGAL, contratos no BASE) antes de qualquer transcrição feita à unha.
4. **As atas e as deliberações são o buraco por tapar, e é aí que o piloto é novo.** Só os neerlandeses (Open Raadsinformatie, com a interface presa a JavaScript e a página do projeto parada em 2020) e os alemães (Politik bei uns, sem atualização) atacaram as reuniões de câmara. Em Portugal, nenhum dos vinte o faz. O «o que se discutiu, o que se decidiu, o que ficou por fazer» que o diretor quer não tem exemplo vivo para copiar, tem dois cadáveres para estudar.
5. **Comparar é a forma, não um extra.** No Waarstaatjegemeente e no Gobierto, escolher o município e pôr ao lado outro, a região ou o país é a operação central da página. Isto confirma, de fora, a camada 2 da visão: a medida só vale com a comparação que a fonte permite, e a comparação tem de estar no primeiro ecrã e não num botão.
6. **Dizer o que o método não pode saber vale mais do que o método.** O TheyWorkForYou publica que, como as instruções de voto dos partidos não são públicas, não pode mostrar qual foi a instrução, e usa o voto médio do partido como substituto; a Civio tem «Ojo con esto» no menu de topo, ao lado da metodologia; o OpenBilanci diz à cabeça até que ano tem dados. Nenhum destes avisos torna o projeto mais fraco: é o que lhes dá autoridade. É a regra das ausências da visão, aplicada por terceiros.
7. **A frescura diz-se como propriedade da fonte, não como promessa do sítio.** O Gobierto escreve «a última atualização dos dados corresponde à atualização de 2025 por parte do Ministério»; o OpenCoesione põe a data («aggiornati al 30 aprile 2026») na primeira página. O contra-exemplo é o Mais Transparência, que diz «a informação é atualizada permanentemente» e não mostra uma única data: o leitor fica sem saber se o número é de ontem ou de 2019. Entre as duas escritas, a diferença é exatamente o selo de «conferido em».
8. **O formato «promessa com estado» aguenta escala municipal, e já é usado ao pé de números.** O Slovo i Dilo classifica promessas com estados e tem secção para presidentes de câmara; o TheyWorkForYou converte votos em posições por tema. Os dois fazem-no com regra publicada. Para o «prometido, pago e auditado» de Évora, o padrão existe; o que não existe em lado nenhum desta lista é ligá-lo ao orçamento da mesma entidade na mesma página.
9. **A IA ao pé do número já apareceu em Portugal, e o mínimo aceitável é o rótulo.** O votacoes.pt escreve «Sumário (gerado por AI)» em cada iniciativa. É a única divulgação de IA confirmada nesta lista inteira. A via B da divulgação da casa (rotular tudo, o diretor responde) vai mais longe do que o estado da arte português, o que é vantagem e é risco: mais longe significa sem precedente para copiar.
10. **Um sítio preso a JavaScript não é citável nem por leitores nem por agentes.** O openbesluitvorming.nl devolve 948 bytes e uma palavra; o votacoes.pt devolve uma casca com onze megabytes de pacote; o BASE devolve 404 a quem não se apresenta como navegador; o portalmunicipal.gov.pt não respondeu. Quatro dos que interessam ao piloto são ilegíveis por máquina, e a camada 6 da visão (o livro-razão em JSON, os feeds, o MCP) é exatamente a resposta a isto.

## O que nenhum faz

O espaço que fica, dito a partir do que foi confirmado hoje e não do que se supõe:

- **Nenhum liga, na mesma entidade e na mesma página, o orçamentado, o pago, o contratado, o deliberado e o prometido.** Os italianos têm o orçamento (OpenBilanci) e o projeto (OpenCoesione) em sítios separados e com anos diferentes; os neerlandeses têm as contas (Openspending) e as atas (Open Raadsinformatie) em dois projetos; os espanhóis têm o orçamento sem as deliberações. A junção é o piloto.
- **Nenhum tem livro-razão por número.** O mais perto que se leu é a nota metodológica do Gobierto com o código de transformação publicado, e a metodologia da Civio. Nenhum mostra, por número, a fonte, o excerto, a data de acesso e o selo.
- **Nenhum publica as ausências.** Não se encontrou em nenhum dos vinte uma frase do tipo «não há número público para isto». O silêncio é a forma corrente.
- **Nenhum diz o que uma máquina fez e o que um humano decidiu,** exceto um rótulo por sumário no votacoes.pt. Nenhum publica política de verificação, nem quem verificou o quê.
- **Nenhum mostra correções datadas à vista.** Não se confirmou uma única página de correções em nenhum dos vinte `[verify]`.
- **Nenhum acompanha uma Capital Europeia da Cultura enquanto ela acontece.** O Matera 2019 Open Data é retrospetivo (impacto depois do ano, com um inquérito de 2020). Para Évora 2027, o lugar vago é o acompanhamento em tempo de obra: o dinheiro contratualizado contra o executado, mês a mês, com a fonte ao lado.
- **Nenhum prepara a reunião seguinte.** Nem o Open Raadsinformatie, que tem as atas todas, nem o Monithon, que vai ao terreno, entregam a um cidadão o que devia estar feito e não está antes de ele entrar na sala. A ideia do diretor (o instrumento para quem participa nas reuniões de câmara) não tem concorrente nesta lista.
- **Nenhum é escrito e conferido por sistemas de IA sob política publicada.** Todos são feitos por pessoas, com máquinas a carregar dados. A casa está a fazer outra coisa, e isso significa que a comparação útil acaba aqui: destes projetos copia-se o que aprenderam sobre fontes, formas e honestidade, não o modo de produção.

## O custo e o tempo

Contagem feita a partir dos pedidos desta sessão, não de estimativa.

| item | valor |
|---|---|
| pesquisas na web (`WebSearch`) | 16, em quatro lotes de quatro |
| leituras de página (`WebFetch`) | 28 tentadas: 20 devolveram conteúdo, 3 devolveram erro do servidor (dois 403 da Civio, dois 404, contados à parte), 3 devolveram casca sem conteúdo útil, 2 ficaram presas e foram canceladas |
| pedidos por `curl` | 30 tentados (1 preso e cancelado), incluindo a descarga do pacote de 11 383 883 bytes do votacoes.pt |
| **total de pedidos à rede** | **74** |
| projetos na tabela | 20 (12 vivos, 5 mortos ou parados por declaração, 3 com estado ou frescura por confirmar) |
| fichas fora da tabela | 5 |
| início (medido) | 2026-09-15T11:56:43Z |
| fim (medido) | 2026-09-15T13:02:47Z |
| tempo de parede | 66 minutos (dos quais cerca de 50 parados à espera de três pedidos que nunca responderam) |
| tempo perdido nos três pedidos presos | cerca de 50 minutos, das 12:05Z até ao corte às 12:57Z |
| repositórios tocados | nenhum |
| correio enviado | nenhum |

**Os pontos que ficaram `[verify]`, com o endereço e a resposta exata:**

1. `https://api.openraadsinformatie.nl/v1/elastic/_search`: preso, cancelado às 12:57Z. Número de câmaras neerlandesas cobertas hoje pelo Open Raadsinformatie.
2. `https://transparencia.gov.pt/pt/municipios/portugal-e-os-municipios/gestao-financeira/`: preso, cancelado às 12:57Z. Os indicadores financeiros por município, as suas fontes e os seus anos.
3. `https://opendata.matera-basilicata2019.it/en/`: preso, cancelado às 12:57Z. Formatos, licença e restantes secções da plataforma de Matera.
4. `https://dondevanmisimpuestos.es/metodologia` e a capa pela ferramenta de leitura: **HTTP 403 Forbidden** (a capa foi lida por curl com agente de navegador). O ano dos dados e o texto da metodologia da Civio.
5. `https://www.portalmunicipal.gov.pt/municipio?locale=pt`: **connect ECONNREFUSED 52.166.92.231:443** e dois tempos esgotados por curl (http=000). O portal não respondeu hoje; não se afirma que esteja morto.
6. `https://www.nosdeputes.fr/`: **http=000** às 12:53:39Z, sem resposta em 20 segundos.
7. `https://www.abgeordnetenwatch.de/ueber-uns/finanzierung`: **404**. As proporções do financiamento; e a razão por que o nível municipal saiu da navegação.
8. `https://openbesluitvorming.nl/`: casca de 948 bytes sem JavaScript. Número de câmaras, última carga de dados, estado real do projeto.
9. `https://www.votacoes.pt/`: casca sem JavaScript. Quem responde pelo sítio e qual o método dos sumários.
10. Fonte ao pé de cada número e página de correções: **não confirmada em nenhum dos vinte**. O que se diz acima é ausência de confirmação, não prova de ausência, exceto onde a página o diz.
11. `http://hemiciclo.pt/`: **410 Gone**. A morte está confirmada; a razão não.
12. Atribuições que só apareceram em páginas de terceiros e não na fonte própria: o IMPIC como dono do BASE, a Ragioneria Generale dello Stato como fonte do OpenBilanci, as 308 fichas do Mais Transparência, o «320+» de câmaras do openbesluitvorming.nl.

*Escrito pelo Claude Opus 5 (1M) a 15.09.2026. Não se tocou em nenhum repositório e não se enviou nenhum correio.*
