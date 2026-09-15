# Os dados oficiais sobre Évora, o Alentejo Central e o Alentejo · levantamento de 15.09.2026

*Levantamento feito pelo Claude Opus 5 (1M de contexto) a 15.09.2026, para o piloto de Évora (`VISAO.md` §5, decisão do diretor de 15.09.2026). O campo deste levantamento é **o resto do que se publica oficialmente sobre o território**: outros dois agentes inventariam, ao mesmo tempo, as fontes da Câmara Municipal de Évora no mandato corrente e as da «Évora 2027, Capital Europeia da Cultura», e este documento não as duplica. Nenhum repositório foi tocado; nenhum correio foi enviado. Sem travessões na prosa.*

**Data de leitura de tudo o que está aqui: 2026-09-15, entre as 11h55 e as 12h25 UTC.** Onde uma fonte foi lida noutro momento, diz-se na linha. Uma fonte que não foi confirmada hoje não conta e está marcada `[verify]`.

**Como ler os rótulos de confiança**, pela regra 18 do `CLAUDE.md` da conta:

- **verificado**: abri o endereço hoje e li o que está escrito na linha (código de resposta, campos, valores, datas).
- **inferido**: li a descrição do publicador ou a página que aponta ao ficheiro, mas não abri o ficheiro nem li a linha do dado.
- `[verify]`: não consegui abrir; fica o endereço e a resposta exata que recebi.

---

## 0 · O que já está na casa, para não se repetir

Lido hoje em `ledger/claims/` (contagem por `grep '^source:'` sobre os ficheiros `*.yml`) e em `design/observatorio/INVENTARIO-DAS-FONTES.md`. **Verificado.**

| Publicador já no livro-razão | Linhas |
|---|---|
| INE | 1 238 |
| Direção-Geral das Autarquias Locais (DGAL) | 930 |
| (linhas derivadas, `source: null`) | 329 |
| Instituto do Emprego e Formação Profissional (IEFP) | 280 |
| Eurostat | 46 |
| Município de Évora | 25 |
| Direção Regional de Qualificação Profissional e Emprego (DRQPE) | 19 |
| Instituto de Emprego da Madeira (IEM) | 11 |
| Secretaria-Geral do Ministério da Administração Interna (SGMAI) | 10 |
| O Estado do País (linhas próprias) | 5 |
| Estrutura de Missão Recuperar Portugal | 5 |
| Grupo de Trabalho para a Reforma da Segurança Social | 4 |
| Direção-Geral do Território (DGT) | 4 |
| `[a verificar]` | 3 |
| Marques, Cruz & Associados | 2 |
| PORDATA, ERSAR, Diário da República, Conselho das Finanças Públicas, CICF/IPCA | 1 cada |

Há 70 linhas `evora-*.yml` no livro-razão (contadas hoje). Cobrem sobretudo as contas e a dívida da câmara, os pelouros, os mandatos, o PRR do município e da universidade, a população, as empresas, o ganho médio, o desemprego registado e o poder de compra.

**Publicadores que não aparecem em nenhuma linha do livro-razão** e que este levantamento traz: Transparência do SNS, DGEEC, DGPJ, SSI (RASI), ICNF, APA, DGEG, IPMA, Turismo de Portugal, DGCP/GEP do MTSSS, Carta Social, IMPIC (Portal BASE em massa), CCDR Alentejo e Alentejo 2030, CIMAC, AIMA (o anexo por concelho), Tribunal de Contas, IGF, PCGT da DGT, Gesamb.

---

## 1 · O INE e a PORDATA ao nível do concelho e da freguesia

### 1.1 · A mecânica da API do INE, confirmada hoje

A casa já lê `json_indicador`. O que fica registado aqui, e que o livro-razão pode passar a usar para a coluna da frescura, é o **endereço gémeo dos metadados**:

```
https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=<código>&lang=PT
```

Devolve, por indicador: `IndicadorNome`, `Periodic`, `PrimeiroPeriodo`, `UltimoPeriodo`, `UnidadeMedida`, `DataUltimaAtualizacao`, `DataExtracao` e a lista completa de categorias de cada dimensão, com `categ_nivel`. **Verificado** em dois indicadores.

Duas leituras de hoje que mostram o valor disto:

- **0012918** (População residente por Local de residência, Sexo e Grupo etário; Anual): `Periodic` «Anual», `PrimeiroPeriodo` «2021», `UltimoPeriodo` «2025», `DataUltimaAtualizacao` «2026-06-22». Tem 347 categorias geográficas; Évora é `1C40705`, `categ_nivel` «5», ou seja **concelho, não freguesia**. **Verificado.**
- **0008073** (Crimes registados pelas autoridades policiais, NUTS 2013, origem DGPJ): `Periodic` «Anual», de **2011 a 2022**, `DataUltimaAtualizacao` **2023-03-31**. Évora é `1870705`, nível 5. **Verificado.** Ou seja: **a criminalidade por concelho no INE está parada em 2022**, e isto é um buraco, não uma fonte viva (ver §7).

Nota sobre a granularidade: nos indicadores da base de dados corrente do INE, o fundo da escala é o concelho (nível 5). **Para descer à freguesia é preciso ir aos produtos dos Censos 2021**, não a `json_indicador`. **Verificado** para os dois indicadores acima; **inferido** como regra geral.

### 1.2 · Os Censos 2021, os produtos que descem abaixo do concelho

Todos os endereços abaixo responderam **HTTP 200** hoje, salvo onde se diz o contrário. Página de origem: `https://censos.ine.pt/xportal/xmain?xpgid=censos21_produtos&xpid=CENSOS21&xlang=pt` (**verificado**, 49 673 bytes).

| Fonte | O que publica | Âmbito | Cadência · última data | Forma · endereço | Licença | Utilidade para o piloto |
|---|---|---|---|---|---|---|
| INE · «Indicadores - Base de dados – Censos 2021» (tabulador) | Indicadores dos Censos 2021 desagregados | Até **freguesia** | Decenal · Censos 2021 (definitivos, 23.11.2022) | Aplicação web, exporta `.tsv`, `.csv`, `.xlsx`, `.ods` e API JSON · `https://tabulador.ine.pt/censos2021/` (**verificado**, 200) | INE, `[verify]` a menção exata | **A única via oficial para pôr números nas freguesias de Évora.** Base para «a cidade contra o concelho». (Não escrevo aqui quantas freguesias tem o concelho porque não o confirmei hoje numa fonte primária; a CAOP, que a casa já lê, responde a isso) |
| INE · «Plataforma de divulgação - Censos 2021» | Os mesmos indicadores, em aplicação de consulta | Freguesia | Decenal | `https://censos.ine.pt/xportal/xmain?xpgid=censos21_dados_finais&xpid=CENSOS21&xlang=pt` (**verificado**, 200) | INE | Conferência humana do que o tabulador dá |
| INE · «GeoCensos» (aplicação geográfica) | Censos sobre BGRI 2021: secção, subsecção e GRID 1 km | Subsecção estatística | Decenal | Aplicação web · `https://geoc2021.ine.pt` (**verificado**, 200) | INE | Mapa do concelho abaixo da freguesia, para a forma do piloto |
| INE · «Geopackage» | Variáveis dos Censos ligadas à BGRI 2021, GRID e lugares | Subsecção | Decenal | Geopackage (OGC) · `https://mapas.ine.pt/download/index2021.phtml` (**verificado**, 200) | INE | Cartografia própria sem depender de uma aplicação de terceiros |
| INE · «FS secção» e «FS Subseção» (ficheiros de síntese) | Dados alfanuméricos desagregados por secção e subsecção | Subsecção | Decenal | ZIP · `https://www.ine.pt/ine_novidades/FS 2021 Secção Tot.zip` e `.../FS 2021 SubSecção Tot.zip` | `[verify]` | `[verify]`: os dois endereços devolveram **HTTP 000, 0 bytes** hoje (nome de ficheiro com espaços e acentos; provavelmente exige a codificação que o portal usa). Reler noutro contexto |
| INE · «GeoEscolas» | Escolas georreferenciadas sobre a base dos Censos | Escola | `[verify]` | Aplicação web · `https://geoescolas.ine.pt/index.html?locale=Pt-pt` (**verificado**, 200) | INE | Liga a rede escolar de Évora à população das freguesias |
| INE · «Ficheiro de Uso Público (FUP) – Censos 2021» | Microdados anonimizados | Nacional, com quebra territorial limitada | Decenal | Sob termos de utilização · `https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_pufs_termos&contexto=up` | Termos próprios, `[verify]` | Só se um estudo o exigir; tem condições de acesso |

### 1.3 · Os indicadores municipais do INE que ainda não estão no livro-razão

Todos por `json_indicador`, forma JSON, licença INE (a casa já usa «INE, CC BY 4.0» numa nota do motor). **Inferido** dos destaques e das páginas do INE lidas hoje, salvo onde digo verificado.

| Fonte | O que publica | Âmbito | Cadência · última data | Endereço | Utilidade |
|---|---|---|---|---|---|
| INE · «Estatísticas do Rendimento ao Nível Local» | Rendimento bruto declarado, IRS liquidado, rendimento líquido por agregado e por sujeito passivo; dados fiscais anonimizados da AT (Modelo 3) | **Concelho** com 2 000 ou mais sujeitos passivos, **freguesia** com 2 000 ou mais, e NUTS III | Anual · edição 2023 publicada a **25.07.2025** | Destaque: `https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=739193541&att_display=n&att_download=y`; dossiê: `https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_doc_municipios_rnl&xlang=pt` (**verificado**, 200, 141 246 bytes) | É a medida de rendimento real de Évora, ao lado do poder de compra que a casa já tem. Também **desce à freguesia**, o que quase nada mais faz |
| INE · «Estatísticas de Preços da Habitação ao Nível Local» | Preço mediano das vendas de alojamentos familiares (€/m²) e número de transações | Concelho, NUTS III, grandes cidades | **Trimestral** · 4.º trimestre de 2025 publicado; há dados até ao ano móvel terminado em março de 2026 | `https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=789055201&att_display=n&att_download=y` | A habitação é o assunto do momento e é trimestral, não anual: dá vida à página do concelho |
| INE · «GeoHab» | Preços da habitação nas cidades, em mapa | Cidade e abaixo | `[verify]` | `https://geohab.ine.pt/` (**verificado**, 200) | Évora dentro do concelho, para o «micro» do micro-observatório |
| INE · «Anuários Estatísticos Regionais» | Compêndio regional e municipal, muitos domínios de uma vez | Região e município | Anual · a edição corrente publica dados de 2023, `[verify]` a data exata da mais recente | Página da CCDR que os agrega: `https://www.ccdr-a.gov.pt/ine-anuarios-estatisticos-regionais/` | Atalho para descobrir que indicadores existem por município, antes de ir aos códigos |
| INE · «Estatísticas Territoriais» (dossiê «Municípios») | Ferramenta de perfil por unidade territorial, indicadores por tema | Município e freguesia | Contínua | `https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_doc_municipios` (**verificado**, 200, 64 663 bytes) | Descoberta de indicadores |
| INE · «Sistema de Metainformação» (SMI) | A definição oficial de cada indicador e conceito | Transversal | Contínua | `https://smi.ine.pt/` (**verificado**, 200) | **Serve diretamente a regra do `name_source`**: o rótulo oficial de cada medida, sem o inventar |

### 1.4 · A PORDATA

| Fonte | O que publica | Âmbito | Cadência | Forma · endereço | Utilidade |
|---|---|---|---|---|---|
| PORDATA · «Base de Dados dos Municípios» | Indicadores municipais de mais de sessenta entidades oficiais, com o INE em primeiro lugar | Município e NUTS | Contínua, `[verify]` a cadência declarada | `https://www.pordata.pt/municipios` (**verificado**, 200, 173 785 bytes) | **Nota de método:** a PORDATA é redisseminadora, não fonte primária. Pela `VISAO.md` §6 («a PORDATA existe; a casa é a camada de proveniência»), serve para **descobrir** que uma medida existe, e depois vai-se ao INE, ao IEFP ou à DGAL. O livro-razão tem hoje **uma** linha com `source: "PORDATA"` |
| PORDATA · «Retrato dos Municípios» | Retrato comparado por município | Município | `[verify]` | `https://retratos.pordata.pt/` | Referência de forma, não de número |

---

## 2 · A administração regional

| Fonte | O que publica | Âmbito | Cadência · última data | Forma · endereço | Licença | Utilidade |
|---|---|---|---|---|---|---|
| **Alentejo 2030 (CCDR Alentejo) · «Lista de Operações Aprovadas»** | Por operação: código, programa, objetivo específico, % de cofinanciamento, **nome do beneficiário, NIF**, nome e finalidade da operação, datas de início e conclusão prevista e efetiva, **custo total, elegível e fundo aprovado**, fundo, NUTS II, NUTS III, **concelho, freguesia**, domínio de intervenção e aviso | **Concelho e freguesia** | Reportada a **30 de junho de 2026** · cadência não declarada na página | `.xlsx` · `https://alentejo.portugal2030.pt/wp-content/uploads/sites/13/2026/07/lista_operacoes_30_junho_2026.xlsx` (**verificado**, 200, 381 334 bytes) | `[verify]` (a página diz só o propósito, «reforçar a transparência na gestão dos fundos europeus») | **A melhor fonte nova deste levantamento.** Lido e contado hoje: **1 022 linhas de dados, 24 colunas, 59 concelhos distintos; 90 operações com `Concelho` igual a «Évora»**, somando **61 843 908,20 euros de fundo aprovado** (soma feita por mim, portanto derivada, não publicada). Os seis maiores beneficiários em Évora: ACSS (17 726 524,00), CCDR Alentejo (12 259 197,69), **Gesamb** (9 864 968,94), **Município de Évora** (4 115 543,83), **ULS do Alentejo Central** (3 903 576,77), **Universidade de Évora** (2 621 044,24). **Verificado por leitura do ficheiro** |
| CCDR Alentejo · «Estratégia Regional de Especialização Inteligente EREI 2030» | A estratégia regional e a sua revisão intercalar (inclui os domínios novos, Saúde e Defesa) | Região | Plano · revisão de 2025 | PDF · `https://www.ccdr-a.gov.pt/wp-content/uploads/2025/07/EREI2030_2025.pdf` (**verificado**, 200, 3 158 617 bytes) e `https://alentejo.portugal2030.pt/wp-content/uploads/sites/13/2023/07/EREI2030.pdf` | `[verify]` | Documento que governa, não número. Serve o enquadramento, e serve para dizer o que estava prometido |
| CCDR Alentejo · sítio | Notícias, pareceres, avisos, ordenamento | Região | Contínua | `https://www.ccdr-a.gov.pt/` (**verificado**, 200, 105 993 bytes) | `[verify]` | Gatilho de vigia, não fonte de número |
| **Mais Transparência · PRR** | Projetos e beneficiários do PRR, com pesquisa e descarga em dados abertos | Beneficiário e projeto; a quebra por concelho é `[verify]` | Semanal segundo a Recuperar Portugal, `[verify]` | `https://transparencia.gov.pt/pt/fundos-europeus/prr/beneficiarios-projetos/` (**verificado**, 200, 146 982 bytes); pesquisa de projetos `.../pesquisar/projeto/` | `[verify]` | A casa **já tem** cinco linhas de PRR de Évora, mas pela via `dados.gov.pt` («dataset-estrutura-de-missao-prr-entidades-1»). Esta é a via do portal. `[verify]`: não encontrei na página o botão de descarga em dados abertos, nem um endereço de ficheiro |
| **CIMAC · Comunidade Intermunicipal do Alentejo Central** | «Documentos de Prestação de Contas» e «Documentos Previsionais» (relatórios de gestão, Grandes Opções do Plano e orçamentos) | Sub-região (14 municípios) | Anual | Páginas com PDF · `https://www.cimac.pt/cimac/informacao-de-gestao/documentos-de-prestacao-de-contas/` (**verificado**, 200, 320 050 bytes) e `.../documentos-previsionais/` | `[verify]` | **A camada intermunicipal não existe em lado nenhum do sítio.** É a escala entre o concelho e a região, e é onde estão a mobilidade, os resíduos e parte da saúde do Alentejo Central |
| **DGT · PCGT, «PDM - ÉVORA»** | Registo do Plano Diretor Municipal na Plataforma Colaborativa de Gestão Territorial | Concelho | Por alteração | `https://pcgt.dgterritorio.gov.pt/FDE9584` (**verificado**, 200) | `[verify]` | `[verify]` quanto ao conteúdo: a ficha carregou, mas veio com quase todos os campos a «-» e sem ficheiros para descarga. O registo existe; o que ele contém não pude ler |
| **Diário da República · Aviso n.º 21372/2025/2** | Publicação da **alteração do PDM de Évora**, DR 2.ª série n.º 164, de **27.08.2025** | Concelho | Ato único | PDF · `https://files.diariodarepublica.pt/2s/2025/08/164000000/0045000584.pdf` (**verificado**: HTTP 200, `application/pdf`, 2 706 937 bytes, `last-modified` «Wed, 27 Aug 2025 10:29:15 GMT») | Diário da República | **O plano em vigor tem data e número.** Isto é uma linha de livro-razão pronta a escrever, e é a âncora legal do ordenamento de Évora |
| DGT · «Carta do Regime de Uso do Solo - Évora» | O regime de uso do solo extraído da Planta de Ordenamento do PDM em vigor, classificado pelo Decreto Regulamentar n.º 15/2015 | Concelho, geometria | `frequency: unknown`; `last_modified` **2021-06-22** | WFS e WMS · `https://servicos.dgterritorio.pt/SDISNITWFSCRUS_0705_1/WFService.aspx?service=WFS&request=getcapabilities` (e o WMS gémeo) | **`cc-by`** (declarada em `dados.gov.pt`) | **Verificado** na ficha do `dados.gov.pt`. Atenção: a data de modificação é de 2021 e o PDM foi alterado em 2025; provável desfasamento entre a carta e o plano em vigor |
| DGT · Plano Estratégico de Évora 2030 | `[verify]` | Concelho | 2021 | O documento que encontrei está alojado no sítio da câmara (`cm-evora.pt`), **campo do outro agente** | | Deixo a referência para que o outro levantamento a apanhe, e não a duplico aqui |

---

## 3 · Os serviços públicos no território

### 3.1 · Saúde: o Portal da Transparência do SNS

**O achado com mais matéria deste levantamento.** O portal serve uma API Opendatasoft que responde sem chave. Catálogo lido hoje: **144 conjuntos de dados** (`total_count: 144`). **Verificado.**

```
https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets?limit=100
https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets/<id>
https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets/<id>/records?where=...&order_by=...&limit=...
```

A entidade que representa Évora é a **Unidade Local de Saúde do Alentejo Central, E.P.E.** (criada pelo Decreto-Lei n.º 102/2023, de 7 de novembro, `[verify]`: li isto em resumos de pesquisa, e o sítio oficial `https://www.ulsac.min-saude.pt/` devolveu **HTTP 403** e o `https://www.sns.gov.pt/entidades-de-saude/unidade-local-de-saude-do-alentejo-central/` devolveu **HTTP 405** às minhas leituras de hoje).

Conjuntos confirmados hoje com registos da ULS do Alentejo Central:

| Conjunto (`dataset_id`) | Campos | Registos | Última alteração | O que li da ULS do Alentejo Central |
|---|---|---|---|---|
| `utentes-inscritos-em-cuidados-de-saude-primarios` | `periodo, ars, aces, localizacao_geografica, utentes_inscritos_csp, total_utentes_com_mdf_atribuido (n.º e %), total_utentes_sem_mdf_atribuido (n.º e %), ...sem_mdf_por_opcao, taxas de utilização` | 6 450 | 2026-07-30 | Período **2026-06**, `aces` «CSP da ULS Alentejo Central»: **167 443** inscritos, **150 286** com médico de família (**89,75 %**), **15 467** sem (**9,24 %**), 1 690 sem por opção (1,01 %). **Verificado.** É o conjunto que a casa já usa no indicador H2 do inventário, mas ao nível nacional |
| `trabalhadores-por-grupo-profissional` | `periodo, regiao, instituicao, localizacao_geografica, medicos_s_internos, medicos_internos, enfermeiros, tss, farmaceuticos, tdt, at, tas, ts, informaticos, outros, total_geral` | 8 504 | 2026-09-09 | Período **2026-07**: **2 445** no total; 319 médicos sem internos, 112 internos, 872 enfermeiros. **Verificado** |
| `atendimentos-por-tipo-de-urgencia-hospitalar-link` | `tempo, regiao, instituicao, urgencias_geral, urgencias_pediatricas, urgencia_obstetricia, urgencia_psiquiatrica, total_urgencias` | 6 481 | 2026-08-31 | Período **2026-06**: **34 183** urgências no total (25 764 gerais, 8 419 pediátricas). **Verificado** |
| `divida-total-vencida-e-pagamentos` | `periodo, regiao, entidade, divida_total_fornecedores_externos, divida_vencida_fornecedores_externos, pagamentos_em_atraso` | `[verify]` | 2026-09-10 | Período **2026-05**: dívida total a fornecedores externos **20 015 446,07 €**, vencida **5 000 837,37 €**, pagamentos em atraso **207 488,64 €**. **Verificado.** **Ressalva importante:** neste conjunto os campos `regiao` e `entidade` **vêm trocados entre registos** (no de 2026-05 a ULS está em `regiao`; no de 2025-03 está em `entidade`). Quem escrever a linha tem de ler os dois campos, não um |
| `agregados-economico-financeiros` | `tempo, regiao, entidade, ebitda, gastos_operacionais, rendimentos_operacionais, resultado_liquido, resultados_operacionais` | 6 796 | 2026-09-10 | Campos confirmados; não li o registo da ULS. **Inferido** que a cobre, pela presença de `entidade` |
| `morbilidade-e-mortalidade-hospitalar` | `ano, trimestre, regiao, instituicao, cod_capitulo, desc_capitulo, taxa_internamento, dias_internamento, taxa_mortalidade` | 65 268 | 2026-09-14 | Campos confirmados; registo da ULS não lido. **Inferido** |
| `inscritos-lic-dentro-tmrg` (tempos de espera cirúrgicos) | `tempo, regiao, instituicao, no_de_doentes_inscritos_dentro_do_tmrg_sigic, ...` | 6 403 | 2026-07-26 | **`[verify]`: a consulta por `instituicao` contendo «Alentejo Central» devolveu `total_count: 0`.** Ou a ULS não está neste conjunto, ou o nome está escrito de outra forma. Tem de se enumerar os nomes antes de concluir |

Outros conjuntos do catálogo que são candidatos óbvios ao piloto, com campo `instituicao` ou `entidade` (**inferido**, não abri cada um): `tempo-medio-de-pagamento-das-instituicoes-do-sns-a-fornecedores`, `lotacao-praticada-por-tipo-de-cama` (Lotação Hospitalar para Doentes Agudos), `consultas-em-tempo-real` (Primeiras Consultas em Tempo Adequado), `atendimentos-em-urgencia-triagem-manchester`, `partos-e-cesarianas`, `evolucao-do-numero-de-unidades-funcionais`, `rastreios-oncologicos`, `certificados-de-obito-por-instituicao-de-saude`, `portal-base` (Contratos Públicos na Saúde), `conta-do-servico-nacional-de-saude`.

**Licença:** o campo `license` dos metadados vem **a `None`** em todos os conjuntos que li. `[verify]`: as condições de reutilização têm de ser lidas nas páginas do portal, não na API.

### 3.2 · Saúde: o resto

| Fonte | O que publica | Âmbito | Cadência | Endereço | Utilidade |
|---|---|---|---|---|---|
| ULS do Alentejo Central | Relatórios e contas, plano e relatório de atividades | Entidade | Anual, `[verify]` | `https://www.ulsac.min-saude.pt/` e `https://www.hevora.min-saude.pt/` | **`[verify]`: `https://www.ulsac.min-saude.pt/` devolveu HTTP 403 à minha leitura de hoje.** É o publicador primário das contas da unidade; tem de se voltar lá |
| ACSS · Hospital Central do Alentejo | O novo hospital em construção em Évora | Concelho | Por ato | Ver §2 (ACSS é o maior beneficiário do Alentejo 2030 em Évora, 17 726 524,00 €, **verificado**) | O maior investimento público em curso no concelho. O piloto pode segui-lo pelo Alentejo 2030, pelo Portal BASE e pelo PRR sem depender de imprensa |

### 3.3 · Educação

| Fonte | O que publica | Âmbito | Cadência | Forma · endereço | Licença | Utilidade |
|---|---|---|---|---|---|---|
| **DGEEC · Infoescolas** | Resultados escolares: exames nacionais, alinhamento com as classificações internas, percursos diretos de sucesso, indicadores de equidade | **Escola, agrupamento, município**, distrito, NUTS II e III | Anual | Portal + bases para descarga · `https://infoescolas.medu.pt/` (**verificado**, 200, 14 264 bytes) e `https://dados.gov.pt/pt/datasets/infoescolas/` | `[verify]` | **A medida de educação de Évora por escola.** É onde o leitor local reconhece os nomes que conhece |
| DGEEC · «Tabelas de dados do Ensino Superior» | Inscritos, diplomados, vagas, por instituição | **Instituição** (Universidade de Évora) | Anual | `https://www.dgeec.medu.pt/art/ensino-superior/bases-de-dados/todas/652ff89abd5c2b00958292d7` (**verificado**, 200, 3 298 bytes) | `[verify]` | A universidade é um dos traços próprios de Évora (§6). Atenção: é medida **da instituição**, não do concelho |
| DGEEC · «Estatísticas da Educação» | Séries do ensino não superior | Município | Anual · «2024/2025 Dados Preliminares» | `https://www.dgeec.medu.pt/artpub/65520ab1455255473193d29b` | `[verify]` | Complemento de contexto |
| INE (origem DGEEC) | Taxa de retenção e desistência (0012618), taxa bruta de pré-escolarização (0012616) | Concelho | Anual | `json_indicador` | INE | **Já estão no inventário da casa** (D2 e D3), mas ainda não como linhas de Évora |

### 3.4 · Justiça

| Fonte | O que publica | Âmbito | Cadência · última data | Forma · endereço | Licença | Utilidade |
|---|---|---|---|---|---|---|
| **DGPJ · dados abertos** | **65 conjuntos**: movimento e duração de processos nos tribunais judiciais, administrativos e fiscais, Ministério Público, injunções, insolvências, registos, ASAE, Polícia Judiciária, INMLCF, crimes registados, pessoal ao serviço | **Nacional**, sem dimensão territorial nos conjuntos que li | Anual · o de crimes registados com `last_modified` **2026-03-31**, com dados de **2025** | API própria, JSON e CSV · `https://apiestatisticas.justica.gov.pt/OpenData/api/PT/Policias/CriminalidadeRegistada/CSV/DownloadCrimesRegistadosAutoridadesPoliciais` (**verificado**, 200, 644 440 bytes) | **`cc-by`** (declarada em `dados.gov.pt`) | **Verificado, incluindo o cabeçalho do CSV**: `Ano,TipoCrimeN1,TipoCrimeN2,TipoCrimeN3,NumeroCrimes`. **Não tem território.** É bom para o país; para Évora, ver §7 |
| DGPJ · «Justiça no mapa» | Localização georreferenciada dos equipamentos do Ministério da Justiça: tribunais, registos e notariado, centros de arbitragem, estabelecimentos prisionais, INML, julgados de paz | Equipamento, com latitude e longitude | Anual · `last_modified` **2025-08-26** | JSON e CSV · `https://apiestatisticas.justica.gov.pt/OpenData/api/PT/MinisterioJustica/Equipamentos/CSV/DownloadTodosEquipamentos` | `cc-by` | **Diz que tribunais e serviços de justiça existem no concelho de Évora, com coordenadas.** Medida de presença do Estado no território |
| CSM · «Relatório Anual do Tribunal Judicial da Comarca de Évora» | Movimentação processual por juízo (JFM, JLC, JCCri e outros), pendências, recursos humanos | **Comarca de Évora** (Évora, Arraiolos, Estremoz, Montemor-o-Novo, Portel, Redondo, Reguengos de Monsaraz, Vila Viçosa, `[verify]` a lista exata) | Anual · **relatório de 2024** aprovado a 29.01.2025 | PDF · `https://comarcas.tribunais.org.pt/comarcas/pdf2/evora/pdf/Relatório_Anual_2024.pdf` (**verificado**, 200, `application/pdf`, 1 675 838 bytes) | `[verify]` | **A única série de justiça que desce ao território de Évora.** É PDF, não série; um estudo extrai, o livro-razão não automatiza |
| Tribunal da Relação de Évora | Estatísticas dos processos no TRE | Distrito judicial de Évora | `[verify]` | `https://tre.tribunais.org.pt/atividade-processual/estatisticas` (**verificado**, 200, 67 260 bytes) | `[verify]` | Traço próprio de Évora: é uma das cinco Relações do país (§6) |
| SIEJ · Estatísticas da Justiça | Portal temático da DGPJ | `[verify]` | `[verify]` | `https://estatisticas.justica.gov.pt/sites/siej/pt-pt` (**verificado**, 200, 6 673 bytes; a página `/Paginas/default.aspx` devolveu **404**) | `[verify]` | `[verify]`: o corpo do portal não me deu conteúdo legível por esta via. Quadros por município podem existir aqui; tem de se abrir num navegador |

### 3.5 · Segurança

| Fonte | O que publica | Âmbito | Cadência · última data | Forma · endereço | Utilidade |
|---|---|---|---|---|---|
| **SSI · RASI 2025** | Relatório Anual de Segurança Interna; integra dados de cerca de trinta entidades | Nacional, **distrito** e comando territorial | Anual · RASI 2025 apresentado em 2026 | PDF · `https://www.ssi.gov.pt/publicacoes/rasi/RASI2025.pdf` (**verificado**, 200, `application/pdf`, 1 302 520 bytes); índice das edições em `https://www.ssi.gov.pt/en/publicacoes/rasi` | **A única fonte viva de criminalidade que chega perto de Évora**, porque o INE parou em 2022. É por **distrito**, não por concelho: o distrito de Évora tem catorze concelhos, e o piloto tem de dizer isso em vez de fingir que é a cidade |
| INE 0008073 (origem DGPJ) | Crimes registados pelas autoridades policiais | **Concelho** (Évora, `1870705`) | Anual · **2011 a 2022**, atualizado 2023-03-31 | `json_indicador` | Série histórica por concelho, **congelada**. Serve para o passado, não para o presente |

### 3.6 · Cultura, população e proteção social

| Fonte | O que publica | Âmbito | Cadência | Endereço | Utilidade |
|---|---|---|---|---|---|
| **AIMA · «População Estrangeira Residente 2024», anexo por distrito e concelho do Relatório de Migrações e Asilo 2024** | População estrangeira residente, total por concelho | **Concelho** | Anual | PDF · `https://aima.gov.pt/media/pages/documents/65870eae21-1761164556/populacao-estrangeira-residente-2024_distrito_concelho.pdf` (**verificado**, 200, `application/pdf`, 766 646 bytes) | **Verificado por leitura da linha.** Excerto literal, página do bloco de Évora: `Évora  Évora  5 621`. Os catorze concelhos do distrito estão lá (Alandroal 207, Arraiolos 255, Borba 174, Estremoz 664, **Évora 5 621**, Montemor-o-Novo 1 330, Mora 124, Mourão 149, Portel 221, Redondo 260, Reguengos de Monsaraz 710, Vendas Novas 1 540, Viana do Alentejo 208, Vila Viçosa 291). **Responde diretamente à pergunta do diretor sobre a imigração por concelho** (`VISAO.md` §5). O total, só por si, não dá nacionalidade nem fluxo (§7) |
| AIMA · Relatório de Migrações e Asilo 2024 | O relatório completo | Nacional e distrital | Anual | `https://aima.gov.pt/media/pages/documents/fec4d6a712-1760603125/relatorio-migracoes-e-asilo-2024.pdf` | O inventário da casa já tem a medida M1 daqui, ao nível do país |
| AIMA · Observatório das Migrações | Estudos e a série «População Estrangeira» | Nacional, `[verify]` | Anual | `https://om.aima.gov.pt/` | Gatilho de vigia, não fonte |
| **DGCP (ex-GEP) do MTSSS** | Quadros de Pessoal, Relatório Único, acidentes de trabalho, doenças profissionais, Carta Social, sínteses estatísticas da Segurança Social | `[verify]` ao nível do concelho | Mensal (sínteses) e anual | `https://www.dgcp.mtsss.gov.pt/` (**verificado**, 200, 43 955 bytes) | **Achado de manutenção: `https://www.gep.mtsss.gov.pt/` responde hoje `HTTP/1.1 302 Found` com `Location: https://www.dgcp.mtsss.gov.pt/`** (lido às 12:20:52 GMT de 15.09.2026). O `INVENTARIO-DAS-FONTES.md` e os ficheiros `inventario/lote-2.*` da casa citam endereços `gep.mtsss.gov.pt`. **Nenhuma linha do livro-razão os cita** (verifiquei), portanto não há linha a corrigir, mas o inventário está desatualizado |
| **Carta Social (DGCP/MTSSS)** | Rede de Serviços e Equipamentos Sociais: respostas sociais, localização, características, entidades responsáveis | **Distrito e concelho** | Anual | `https://www.cartasocial.pt/` (**verificado**, 200, 81 337 bytes); relatórios em PDF por ano | **O equipamento social de Évora, por concelho.** Num concelho envelhecido do interior, é uma das medidas que o leitor local usa |
| Segurança Social · estatísticas | Sínteses de informação estatística | Nacional e `[verify]` | Mensal | `https://www.seg-social.pt/estatisticas` (**verificado**, 200, 14 011 bytes) | `[verify]` se desce ao concelho |
| GEPAC · estatísticas da cultura | Notas estatísticas sobre o setor cultural, a partir das «Estatísticas da Cultura» do INE | Nacional; a quebra municipal é `[verify]` | Anual | `https://www.gepac.gov.pt/estudos-e-estatisticas/estatisticas` e `https://culturaportugal.gov.pt/media/15018/nota-estatistica-022025.pdf` | Contexto. A medida de Évora terá de vir do INE (bibliotecas, espetáculos ao vivo por município) |
| DGPC · património classificado | Monumentos nacionais, imóveis de interesse público, bases SIPA e Ulysses | Imóvel, com concelho | Contínua | `[verify]`: não abri a base hoje | Évora tem uma densidade de classificação que quase nenhum concelho tem (§6) |
| **UNESCO · «Historic Centre of Évora», bem n.º 361** | Inscrição de 1986, relatórios periódicos, estado de conservação, mapas da área classificada e da zona de proteção | O centro histórico | Ciclos de relatório periódico | `https://whc.unesco.org/en/list/361/` e `https://whc.unesco.org/en/list/361/documents/` | **`[verify]`: `https://whc.unesco.org/en/list/361/documents/` devolveu HTTP 403 à minha leitura de hoje.** É uma fonte primária internacional sobre Évora, com obrigações de relato que outros concelhos não têm |

---

## 4 · O ambiente e o território

**Aviso de método, e é o mais importante desta secção.** Cinco endereços de ambiente responderam **HTTP 000, 0 bytes** (ligação recusada ou sem resposta) a todas as tentativas de hoje, por `curl` e por `WebFetch`:

- `https://apambiente.pt/residuos/dados-sobre-residuos-urbanos` (`WebFetch`: `connect ECONNREFUSED 193.136.235.19:443`)
- `https://www.ersar.pt/pt` e `https://www.ersar.pt/pt/setor/caracterizacao/abastecimento-de-agua` (`WebFetch`: `connect ECONNREFUSED 20.13.97.112:443`)
- `https://rea.apambiente.pt/`
- `https://snirh.apambiente.pt/`
- `https://sniamb.apambiente.pt/`

Não concluo daqui que os sítios estejam em baixo: concluo que **desta sessão não se chega lá**. Pela regra 14, isto é um resultado de rede, não uma ausência de fonte. Tudo o que está abaixo sobre a APA e a ERSAR é, portanto, `[verify]`, com o endereço e a resposta registados.

| Fonte | O que publica | Âmbito | Cadência · última data | Forma · endereço | Estado |
|---|---|---|---|---|---|
| **ERSAR · RASARP** | Relatório Anual dos Serviços de Águas e Resíduos em Portugal; análise comparada das entidades gestoras; a infografia do portal traz indicadores de qualidade do serviço de abastecimento **por município** | Entidade gestora e **município** | Anual · Volume 1 do RASARP 2025 divulgado em 2026, com dados de 2024 | `https://www.ersar.pt/pt/site-publicacoes/Paginas/edicoes-anuais-do-RASARP.aspx` | `[verify]`, ligação recusada hoje. A casa **já tem uma linha ERSAR** e o estudo da água não faturada em `/estudos/`. **Falta identificar e registar a entidade gestora de Évora em alta e em baixa** |
| **APA · RARU 2024 (Relatório Anual de Resíduos Urbanos)** | Produção e gestão de resíduos urbanos, capitação, recolha seletiva, e (segundo a descrição) **os primeiros dados por município sobre captura de biorresíduos** | SGRU e **município** | Anual · RARU 2024 publicado em setembro de 2025 | PDF · `https://apambiente.pt/sites/default/files/_Residuos/Producao_Gestão_Residuos/Dados%20RU/2024/raru_2024.pdf` | `[verify]`, a descarga esgotou o tempo (120 s) e o `HEAD` não respondeu |
| APA · REA (Relatório do Estado do Ambiente) | Indicadores ambientais, incluindo eficiência hídrica do setor urbano e incêndios rurais | Nacional e regional | Anual | `https://rea.apambiente.pt/` | `[verify]`, ligação recusada |
| APA · SNIAmb e SNIRH | Catálogo e geovisualizador de informação de ambiente; dados das redes de monitorização de recursos hídricos | Estação, massa de água | Contínua | `https://sniamb.apambiente.pt/`, `https://snirh.apambiente.pt/` | `[verify]`, ligação recusada. **O aquífero de Évora e a qualidade da água subterrânea vivem aqui** |
| **Gesamb · Gestão Ambiental e de Resíduos, E.I.M.** | Dois conjuntos abertos: (a) **localização de ecopontos e contentores** de papel/cartão, plástico/metal e vidro; (b) **quantidades recolhidas e entregues e níveis de enchimento dos ecopontos** | **Doze municípios nomeados na descrição**, incluindo Évora | **Diária** (`frequency: daily`) · `last_modified` **2026-03-04** | JSON · `https://gesamb.360waste.pt/manager/externalws/ama/Containerfillinglevels` e `.../Collectwaste`; cópia em `https://dados.gov.pt/s/resources/gestao-de-residuos-recolha-e-niveis-de-enchimento/20260218-161425/wasteobserved.json` | **`cc-by`**. **Verificado** nas fichas do `dados.gov.pt`. **Achado próprio de Évora**: é uma empresa intermunicipal do Alentejo Central a publicar dados abertos diários. Não vi isto em nenhum outro território. Não abri os dois endereços da Gesamb (o `dados.gov.pt` é a cópia oficial) |
| **DGEG · «Consumo por município e tipo de consumidor»** | Consumo de eletricidade desagregado por município e tipo de consumidor, com agregações por NUTS I, NUTS II e distrito | **Município** | Anual · **2024 (marcado «provisório»)**, série desde 1994 | `.xlsx` · `https://www.dgeg.gov.pt/media/p3gdvjby/dgeg-ect-2024.xlsx` (**verificado**, 200, `application/vnd.openxmlformats...sheet`, 119 418 bytes) | Página: `https://www.dgeg.gov.pt/pt/estatistica/energia/eletricidade/consumo-por-municipio-e-tipo-de-consumidor/`. Há a irmã «por município e setor de atividade» e «número de consumidores». **A energia de Évora, por município, com trinta anos de série** |
| **IPMA · «Normal Climatológica – Évora 1991-2020», estação n.º 558** | Normais climatológicas da estação de Évora: temperaturas, precipitação, dias muito quentes (T máx ≥ 35 °C), noites tropicais (T mín ≥ 20 °C) | **Estação de Évora** | Normal de trinta anos · 1991-2020 | PDF · `https://www.ipma.pt/bin/file.data/climate-normal/cn_91-20_EVORA.pdf` (**verificado**, 200, `application/pdf`, 908 294 bytes) | Índice: `https://www.ipma.pt/pt/oclima/normais.clima/1991-2020/`. Há também a normal 1981-2010 da estação **557, «Évora / Cidade»**: são **duas estações diferentes**, e quem comparar tem de dizer qual. Condição de uso: o IPMA exige referência à fonte |
| IPMA · DataClima | Monitorização climática, simulações históricas 1979-2022, normais 1981-2010 e 1991-2020 | Grelha e estação | Contínua | `https://dataclima.ipma.pt/pt/sobre-os-dados/` | `[verify]`: **HTTP 403** à minha leitura de hoje |
| **ICNF · «Áreas ardidas (desde 1975)»** | Cartografia nacional de áreas ardidas, ao abrigo do Decreto-Lei n.º 124/2006 na redação do Decreto-Lei n.º 17/2009 | Geometria (polígono do incêndio) | `frequency: unknown` · `last_modified` **2023-10-27** | **WMS e WFS** · `https://si.icnf.pt/wfs/areas_ardidas?version=2.0.0&request=GetCapabilities` e o WMS gémeo | **`cc-by`**. **Verificado** na ficha do `dados.gov.pt`. É geometria, não tabela por concelho: a área ardida em Évora sai de um cruzamento espacial com a CAOP, portanto é **linha derivada**, com a aritmética escrita |
| ICNF · «Incêndios rurais: Áreas ardidas e ocorrências» | Relatórios provisórios e definitivos da campanha | Nacional e distrital | Durante a campanha, e anual | `https://www.icnf.pt/florestas/gfr/gfrgestaoinformacao/grfrelatorios/areasardidaseocorrencias` (**verificado**, 200, 19 152 bytes) | `[verify]` quanto ao conteúdo: a página carregou mas não me deu, por esta via, a lista de ficheiros nem os anos |
| INE (origem ICNF) | «Incêndios rurais (N.º)» por localização geográfica e tipo de causa | Concelho, `[verify]` | Anual | `https://dados.gov.pt/en/datasets/incendios-rurais-n-o-1/` | Via mais simples do que o WFS, se o nível for mesmo o concelho |
| **Turismo de Portugal · TravelBI, «Indicadores por município»** | Dormidas e hóspedes no alojamento turístico, evolução mensal, a partir do inquérito do INE | **Município** | Mensal | `https://travelbi.turismodeportugal.pt/alojamento/indicadores-municipio/` (**verificado**, 200, 116 584 bytes) | **Ressalva que o próprio TravelBI publica:** a nível municipal há indicadores impossíveis de fornecer por critérios de qualidade ou por **segredo estatístico**. Quem escrever a linha tem de dizer quando o valor não existe, em vez de o deixar em branco |

---

## 5 · O que o Estado publica sobre a câmara, além da DGAL

| Fonte | O que publica | Âmbito | Cadência · última data | Forma · endereço | Estado |
|---|---|---|---|---|---|
| **Tribunal de Contas · Relatórios de Auditoria** | Auditorias e relatórios, organizados **por ano, de 1999 a 2026** | Entidade auditada | Contínua | `https://www.tcontas.pt/pt-pt/ProdutosTC/Relatorios/RelatoriosAuditoria/Pages/Anos.aspx`, com o padrão `.../Pages/detalhe.aspx?dset=<ano>` (**verificado** pela leitura da página de índice) | **Achado de forma, e é um problema: não há pesquisa por município.** Para saber o que o TC diz sobre Évora tem de se percorrer ano a ano. **A página `.../Pages/default.aspx` devolve HTTP 404**; a correta é `Anos.aspx` |
| Tribunal de Contas · relatório sobre Évora já identificado | «AUDITORIA AO MUNICÍPIO DE ÉVORA PARA O APURAMENTO DE RESPONSABILIDADES» | Município de Évora | 2016 | PDF · `https://www.tcontas.pt/pt-pt/ProdutosTC/Relatorios/RelatoriosApuramentoResponsabilidades/Documents/2016/arf-dgtc-rel001-2016-1s.pdf` | `[verify]`: apanhei-o em pesquisa, não abri o ficheiro hoje. Segundo a descrição, trata de empréstimos de curto prazo contraídos com o Millennium BCP entre 2011 e 2013 e não amortizados no ano. **Isto encaixa diretamente no estudo dos cinco mandatos que a casa já tem** |
| Tribunal de Contas · Relatório de Atividades e Contas | O que o próprio TC fez no ano | Nacional | Anual · 2024 | `https://www.tcontas.pt/pt-pt/Transparencia/PlaneamentoGestao/RelatoriosAnuaisAtividade/Documents/2024/ra2024.pdf` | Contexto, não Évora |
| Inspeção-Geral de Finanças (IGF) | Relatórios de auditoria e controlo | Entidade | `[verify]` | `https://www.igf.gov.pt/` (**verificado**, 200) | **`[verify]`: os dois caminhos que tentei devolveram HTTP 404** (`/InteronetDocs/Default.aspx` e `/pt/atividade/relatorios`). A entrada principal responde; o índice de relatórios tem de ser encontrado noutra sessão |
| **IMPIC · Portal BASE, dados em massa** | Quatro conjuntos: **Entidades**, **Contratos de 2012 a 2026**, **Anúncios de 2012 a 2026** e **Modificações Contratuais de 2012 a 2026** | Contrato, com entidade adjudicante e adjudicatária | **Semanal** (`frequency: weekly`) · `last_modified` **2026-09-13** | `.xlsx`, `.json` e `.zip`, um ficheiro por ano · em `dados.gov.pt`, organização IMPIC | **Licença `other-pd` (domínio público), declarada**. **Verificado** nas quatro fichas. **As «Modificações Contratuais» são a medida das derrapagens**, e a casa ainda não as usa. Serve tanto a câmara como a ULS, a universidade, a CIMAC e a Gesamb |
| IMPIC · API do Portal BASE | Consulta programática dos contratos | Contrato | Contínua | `https://www.base.gov.pt/Base4/pt/documentacao/formas-de-obter-dados-sobre-os-contratos-publicos/` (**verificado**, 200, 86 937 bytes) | **Requer pedido e autorização pelo helpdesk do IMPIC** (**inferido** da descrição). O caminho sem autorização é o `dados.gov.pt` acima. Há também o padrão **OCDS** |
| CICF/IPCA · Anuário Financeiro dos Municípios Portugueses | Análise financeira comparada dos 308 municípios | Município | Anual | Já está na casa (1 linha) | Fonte secundária de análise, não primária |
| CIMAC | Contas e documentos previsionais da comunidade intermunicipal | Sub-região | Anual | Ver §2 | A camada que a DGAL não cobre |

---

## 6 · O que Évora tem que outros concelhos não têm

Este é o material do «porquê Évora» do piloto. Tudo o que está aqui foi visto hoje, com o rótulo à frente.

1. **O bem n.º 361 da Lista do Património Mundial da UNESCO, «Historic Centre of Évora», inscrito em 1986.** Traz um ciclo de relatórios periódicos e de estado de conservação a uma organização internacional, ou seja, **uma fonte primária sobre o concelho que não é portuguesa e não depende da câmara**. Poucos concelhos portugueses têm isto. `[verify]` quanto ao conteúdo: a página de documentos devolveu **HTTP 403** hoje.
2. **A ULS do Alentejo Central sediada no concelho**, com a área de influência direta do distrito de Évora e indireta de todo o Alentejo. Isto significa que **as medidas de saúde publicadas para «Évora» no Portal da Transparência são de uma unidade que serve muito mais gente do que o concelho**. É uma armadilha de denominador, e o piloto tem de a dizer em vez de a esconder. (Entidade **verificada** na API; a delimitação da área de influência é `[verify]`, li-a em resumos de pesquisa e o sítio oficial devolveu 403/405.)
3. **O Hospital Central do Alentejo em construção.** A ACSS é **o maior beneficiário do Alentejo 2030 no concelho de Évora, com 17 726 524,00 € de fundo aprovado** (**verificado** por leitura do ficheiro). É o maior investimento público em curso no território, é seguível por três fontes independentes (Alentejo 2030, Portal BASE, PRR) e ainda não tem uma linha no livro-razão.
4. **A Universidade de Évora.** Beneficiário próprio no Alentejo 2030 (**2 621 044,24 €, verificado**) e no PRR (a casa já tem `evora-prr-universidade-contratado.yml`). Publica-se na DGEEC como instituição, e é organização própria no `dados.gov.pt`.
5. **O Tribunal da Relação de Évora.** Uma das Relações do país, com estatísticas próprias de processos. Um concelho de sessenta mil habitantes que aloja um tribunal superior é um facto de estrutura do Estado, não de dimensão.
6. **A Gesamb, empresa intermunicipal de resíduos, a publicar dados abertos com cadência diária** para doze municípios do Alentejo Central, Évora incluído, sob `cc-by` (**verificado** na ficha do `dados.gov.pt`). É **o único caso de dados abertos locais diários que encontrei neste levantamento**. E é, ao mesmo tempo, o terceiro maior beneficiário do Alentejo 2030 no concelho (**9 864 968,94 €, verificado**).
7. **A capital de distrito e a sede da CCDR Alentejo e da CIMAC.** A CCDR Alentejo é o **segundo** maior beneficiário do Alentejo 2030 em Évora (**12 259 197,69 €, verificado**), o que quer dizer que parte do dinheiro que aparece «em Évora» é dinheiro **regional** alojado na sede, não investimento no concelho. Outra armadilha, e outra coisa a dizer.
8. **O Parque de Indústria Aeronáutica de Évora e o polo da Embraer.** `[verify]`: os números de investimento que encontrei vêm de imprensa e do sítio da câmara, não de fonte primária. O que **é** primário e verificável são os contratos no Portal BASE e as operações no Alentejo 2030 e no PRR.
9. **A alteração do PDM publicada por Aviso n.º 21372/2025/2 no DR de 27.08.2025** (**verificado**: PDF de 2 706 937 bytes, `last-modified` de 27.08.2025). Um plano diretor alterado neste mandato é matéria viva, e está no Diário da República, não no sítio da câmara.
10. **A casa já tem 70 linhas `evora-*.yml` no livro-razão e cinco estudos publicados sobre o município** (contagem dos ficheiros feita hoje, e o valor `5` lido em `estudos-evora-publicados.yml`). Nenhum outro concelho tem isto. A vantagem do piloto é que a camada 1 já existe para a câmara; o que falta é o território à volta dela.

---

## 7 · O que falta: as perguntas sem fonte

Cada buraco com a razão pela qual é um buraco, e o que seria preciso para o tapar.

| Pergunta | O que existe | Por que não chega | O que seria preciso |
|---|---|---|---|
| **A imigração por concelho** (`VISAO.md` §5) | **Resolvido para o stock:** AIMA publica o total por concelho, Évora **5 621** em 2024 (**verificado, com excerto**) | O total não tem **nacionalidade**, **idade**, **sexo** nem **fluxo** ao nível do concelho. E o INE tem o indicador 0013220 (população estrangeira por nacionalidade) mas `[verify]` se desce ao concelho | Ler a metainformação do 0013220 e do 0013219 e ver o `categ_nivel`. Se parar na NUTS III, a nacionalidade por concelho **não existe publicamente** e isso diz-se |
| **A imigração e o voto** (`VISAO.md` §5) | AIMA por concelho, e SGMAI já no livro-razão (10 linhas) | São duas séries separadas. Cruzá-las sem método é **falácia ecológica**, exatamente o que a `VISAO.md` §5 avisa | Um estudo com método fixado antes dos dados e condição de matar, não uma linha |
| **A estrutura do trabalho** (`VISAO.md` §5: por conta de outrem, por conta própria, patrões de microempresas) | Censos 2021 publicam «situação na profissão» por concelho (**inferido** dos destaques do INE, não verifiquei o indicador) | É **decenal**: um retrato de 2021, não uma série. Os Quadros de Pessoal, via INE, dão o ganho médio por concelho mas não a estrutura | Localizar o indicador dos Censos com `categ_nivel` 5 ou 6, e aceitar que a cadência é de dez anos |
| **A criminalidade no concelho de Évora depois de 2022** | INE 0008073 (**congelado em 2022, verificado**), RASI 2025 (**por distrito**), DGPJ (**sem território, verificado**) | **Nenhuma das três dá crime por concelho com dados recentes.** É um buraco real | Abrir o SIEJ num navegador e procurar quadros por município; se não existirem, a resposta honesta é «não há número público recente para isto», que pela `VISAO.md` §2 **é conteúdo** |
| **Os utentes sem médico de família em Évora, o concelho** | Transparência do SNS: **por ACES e ULS** (**verificado**: 15 467 sem médico na ULS do Alentejo Central em 2026-06) | A ULS cobre catorze concelhos. O valor **não é de Évora**; é do Alentejo Central | Ou se aceita a escala da ULS e se diz, ou não se publica. Não há terceira via honesta |
| **Os tempos de espera cirúrgicos em Évora** | Conjunto `inscritos-lic-dentro-tmrg` no SNS | **A consulta por «Alentejo Central» devolveu zero registos** (**verificado**). Não sei se a unidade não está, ou se o nome é outro | Enumerar os valores distintos de `instituicao` no conjunto antes de concluir seja o que for |
| **A água em Évora: entidade gestora, perdas, qualidade** | ERSAR (RASARP, infografia por município) e o estudo da água não faturada que a casa já publicou | **Não cheguei à ERSAR hoje: `ECONNREFUSED 20.13.97.112:443`.** Não sei sequer quem é a entidade gestora de Évora em baixa | Voltar à ERSAR de outra rede. É a fonte, não há substituto |
| **Os resíduos de Évora, em massa e capitação** | APA RARU 2024 (por município, segundo a descrição) e Gesamb (diário, operacional) | **Não cheguei à APA hoje.** A Gesamb dá enchimento e recolha, não capitação anual comparável | RARU noutra sessão; e perceber se a Gesamb permite derivar a capitação sem inventar |
| **Os equipamentos sociais e a Segurança Social por concelho** | Carta Social (**concelho, verificado que o portal responde**); Segurança Social (`[verify]` o nível) | Não abri os dados, só o portal | Abrir um relatório da Carta Social e ler a linha de Évora |
| **A cultura em Évora, em números** | GEPAC (nacional), INE (bibliotecas e espetáculos ao vivo, `[verify]` o nível) | Os públicos, as sessões e os equipamentos de Évora não os vi hoje em nenhuma fonte ao nível do concelho | Procurar os indicadores do INE de cultura com `categ_nivel` 5. **E cuidado com a fronteira:** a «Évora 2027» é campo de outro agente |
| **As auditorias do Estado à câmara** | Tribunal de Contas, por ano; IGF | **Nenhum dos dois tem pesquisa por município** (TC **verificado**; IGF `[verify]`, dois 404) | Percorrer os anos do TC. É trabalho manual, e é finito |
| **Os planos municipais em vigor, em texto** | PCGT tem o registo; o DR tem o aviso | **A ficha do PCGT veio vazia** (**verificado**: campos a «-», sem ficheiros) | Ler o PDF do Aviso n.º 21372/2025/2, que **está acessível** |
| **A saúde financeira da ULS** | Transparência do SNS: dívida, prazo médio de pagamento, agregados económico-financeiros (**verificado** para a dívida) | Nada falta aqui, além de escrever as linhas. **Mas o conjunto da dívida tem os campos `regiao` e `entidade` trocados entre registos** (**verificado**) | Ler os dois campos, sempre |

---

## 8 · As vinte fontes por que começar, na minha ordem

A ordem é minha e é uma recomendação, não uma decisão: pela `POLITICA-DA-AUTONOMIA.md` e pela regra 13 da conta, a ordem do piloto é do diretor. Ordenei por: (a) chega ao concelho de Évora, (b) está fresca, (c) lê-se por máquina, (d) responde a uma pergunta que o piloto já faz, (e) ainda não está na casa.

| # | Fonte | Porquê primeiro |
|---|---|---|
| 1 | **Alentejo 2030, «Lista de Operações Aprovadas»** (`.xlsx`, 30.06.2026) | Chega ao concelho **e à freguesia**, tem beneficiário e montante, é um único ficheiro, e já contei 90 operações de Évora nele. É a fonte que dá mais linhas por unidade de esforço, e liga-se ao trabalho do agente da câmara sem o duplicar |
| 2 | **AIMA, anexo «População Estrangeira Residente 2024» por concelho** | **Responde a uma pergunta que o diretor pôs por escrito** e que a casa não sabia responder. Um número, uma linha, um excerto literal já lido |
| 3 | **Transparência do SNS, API, conjunto `utentes-inscritos-em-cuidados-de-saude-primarios`** | Mensal, com API sem chave, e a saúde é o assunto que o leitor de Évora vive. Obriga a casa a dizer a verdade da escala (ULS, não concelho), o que é uma virtude editorial |
| 4 | **Transparência do SNS, `divida-total-vencida-e-pagamentos` e `trabalhadores-por-grupo-profissional`** | O paralelo direto do que a casa já faz com a DGAL para a câmara, agora para o hospital. E o bug dos campos trocados é o tipo de coisa que o livro-razão apanha e mais ninguém |
| 5 | **IMPIC, Portal BASE, «Modificações Contratuais de 2012 a 2026»** | Semanal, domínio público, e mede **derrapagens**. Serve a câmara, a ULS, a universidade, a CIMAC e a Gesamb com uma só fonte |
| 6 | **INE, «Estatísticas do Rendimento ao Nível Local»** | Rendimento real de dados fiscais da AT, **por concelho e por freguesia**. É a medida que falta ao lado do poder de compra |
| 7 | **INE, «Estatísticas de Preços da Habitação ao Nível Local»** | **Trimestral**, por concelho. Numa página que é quase toda anual, uma série trimestral muda a sensação de vida |
| 8 | **INE, tabulador dos Censos 2021** | A **única** via para descer às freguesias de Évora. O «micro» do micro-observatório depende disto |
| 9 | **Diário da República, Aviso n.º 21372/2025/2 (alteração do PDM)** | Uma linha, uma data, um número de aviso, um PDF que abre. É a âncora legal do ordenamento e é do mandato corrente |
| 10 | **DGEEC, Infoescolas** | Resultados por **escola** em Évora. É onde o leitor local reconhece nomes, e é o que nenhuma estatística nacional lhe dá |
| 11 | **Gesamb, dados abertos diários** | `cc-by`, diário, doze municípios. Achado próprio do território, e nenhum outro observatório o usa |
| 12 | **DGEG, consumo de eletricidade por município (2024)** | `.xlsx` que abre, por município, com série desde 1994. Energia é um dos assuntos do §5 da visão |
| 13 | **CIMAC, prestação de contas e documentos previsionais** | A camada intermunicipal não existe no sítio. É um domínio inteiro por abrir, e é pequeno |
| 14 | **SSI, RASI 2025** | Única fonte viva de criminalidade perto de Évora. Por **distrito**, e o piloto diz isso |
| 15 | **IPMA, normal climatológica de Évora, estação 558 (1991-2020)** | PDF que abre, específico de Évora, e dá a linha de base do clima. Cuidado com as duas estações (557 e 558) |
| 16 | **CSM, Relatório Anual da Comarca de Évora 2024** | A única série de justiça que desce ao território. É PDF: material de estudo, não de automatismo |
| 17 | **Tribunal de Contas, relatórios por ano, à procura de Évora** | Não há pesquisa por município, mas há um relatório de 2016 já identificado que encaixa no estudo dos cinco mandatos |
| 18 | **Carta Social (DGCP/MTSSS)** | Equipamento social por concelho, num território envelhecido. Portal confirmado |
| 19 | **ERSAR, RASARP e indicadores por município** | Tem de vir cedo porque a casa já publicou um estudo de água e ainda não sabe quem gere a água de Évora. **Bloqueado pela rede desta sessão** |
| 20 | **APA, RARU 2024** | Resíduos por município, para dar sentido anual ao que a Gesamb dá diariamente. **Bloqueado pela rede desta sessão** |

**Nota de sequência, não de ordem:** as fontes 1 a 5 dão linhas de livro-razão quase imediatas. As 6 a 12 dão o retrato do concelho. As 13 a 18 dão o Estado no território. As 19 e 20 estão paradas por uma razão de rede, não de conteúdo, e valia a pena resolvê-las antes de mais nada, porque a casa já tem um estudo de água publicado.

---

## 9 · O custo desta sessão

Contagem feita do meu próprio registo de chamadas, não de um contador do sistema; por isso é **aproximada e pode errar por poucas unidades**.

| Grandeza | Valor |
|---|---|
| Pesquisas (`WebSearch`) | **42** |
| Leituras de página (`WebFetch`) | **16**, das quais **6 falharam** (certificado por verificar 2, ligação recusada 2, corpo vazio 2) |
| Pedidos HTTP diretos (`curl` por `Bash`) | **cerca de 112** |
| Total de pedidos à rede | **cerca de 170** |
| Ficheiros descarregados e abertos | 3 (`lista_operacoes_30_junho_2026.xlsx`, 381 334 bytes; `populacao-estrangeira-residente-2024_distrito_concelho.pdf`, 766 646 bytes; um CSV da DGPJ de 644 440 bytes) |
| Endereços distintos confirmados com HTTP 200 | **cerca de 45** |
| Endereços que falharam, com a resposta registada | **13** (APA 4, ERSAR 2, ULSAC 1, SNS entidades 1, UNESCO documentos 1, IGF 2, INE ficheiros de síntese 2) |
| Tempo de parede | **cerca de 30 minutos**, entre as 11h55 e as 12h25 UTC de 15.09.2026 |
| Repositórios tocados | **nenhum** |
| Correio enviado | **nenhum** |

**O que ficou por fazer, e é honesto dizer:** não abri as fichas individuais da maior parte dos 144 conjuntos do Portal da Transparência do SNS (abri 6); não li o RARU nem nada da ERSAR; não enumerei os indicadores do INE ao nível da freguesia no tabulador dos Censos; não abri o relatório de 2016 do Tribunal de Contas sobre Évora; e não confirmei o número de freguesias do concelho numa fonte primária, pelo que não o escrevi em lado nenhum deste documento.
