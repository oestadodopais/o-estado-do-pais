# Referências: a forma dos outros

*Leitura de cerca de trinta sítios, feita a 15 de setembro de 2026, para o sítio O Estado do País. Escrita pelo Claude Opus 5 (`claude-opus-5[1m]`). Só pesquisa na web: nenhum repositório foi tocado, nenhum correio foi enviado, o `oestadodopaís.pt` não foi pedido. Nada aqui decide nada sobre o sítio: isso é do lugar de direção com o diretor.*

---

## 1. Como isto foi lido, e o que isso limita

Isto tem de vir antes dos achados, porque muda o peso de cada citação.

**O `curl` não teve rede nesta sessão.** Com e sem caixa de areia, a resolução de nomes falhou:

```
curl: (6) Could not resolve host: example.com
```

Logo, tudo o que foi lido em direto passou pelo `WebFetch`. O `WebFetch` não devolve a página: converte-a e corre um modelo pequeno sobre ela. Isso significa que **uma citação vinda do `WebFetch` é verbatim conforme devolvida pela extração, não verbatim conferido no HTML**. Pedi texto exato em todos os pedidos, e a maioria do que voltou tem o aspeto de texto exato, mas a distinção não é cosmética, e há prova disso aqui dentro.

**A prova.** No Público, a extração devolveu «Diretor: David Pontes» e «Sede: Lugar do Espido, Via Norte, Maia». O HTML em bruto da mesma página diz outra coisa: o rótulo é `Director` (grafia pré Acordo), e `Sede` e `Redacção` são dois campos distintos, com moradas distintas. A extração normalizou a ortografia do jornal e colou dois campos. Se a norma da casa aceitar citações de segunda mão, importa erros deste tamanho sem dar por isso.

**Ficheiros em bruto de uma corrida anterior.** No mesmo diretório de trabalho havia HTML captado hoje às 16:58 UTC por uma corrida anterior desta mesma tarefa (Guardian, Público, Expresso, Banco de Portugal, BPstat, FFMS e outros). Extraí o texto desses ficheiros eu próprio, com um removedor de etiquetas meu. **As citações marcadas «bruto» são conferidas no HTML; as outras são da extração do `WebFetch`.** É a diferença entre ler a fonte e ler quem a leu.

**Proxy de renderização.** Onde o `WebFetch` direto trouxe só a casca, tentei o `r.jina.ai`, que renderiza JavaScript. Está marcado «proxy» onde foi usado. Duas notas: o proxy recusou devolver páginas inteiras por direitos de autor («reproducing it verbatim in full would constitute substantial copyright infringement»), pelo que só se lhe podem pedir cadeias curtas; e em sítios com CAPTCHA trouxe o CAPTCHA, não a página.

**As horas.** O `WebFetch` não devolve a hora do pedido. Não posso dar hora por sítio sem a inventar, e não a invento. A janela das leituras em direto foi **17:01Z a 17:17Z**; os ficheiros em bruto são de **16:58Z**. A tabela diz a que janela cada linha pertence.

**As contagens de frases de explicação (ponto 9)** são aproximadas e foram feitas sobre o texto que a extração devolveu, não sobre a página renderizada no ecrã. Servem para comparar ordens de grandeza, não para citar.

---

## 2. Tabela dos sítios

Vivo: **sim** = a página abriu e devolveu conteúdo; **casca** = abriu mas só devolveu navegação ou o invólucro de uma aplicação JavaScript; **não** = recusou.

| # | Nome | Tipo | O que se leu | Vivo | Endereço | Hora (UTC) |
|---|------|------|--------------|------|----------|------------|
| 1 | Público | jornal diário | ficha técnica (bruto) | sim | `https://www.publico.pt/nos/ficha-tecnica` | 16:58Z |
| 2 | Público | jornal diário | estatuto editorial | casca | `https://www.publico.pt/nos/estatuto-editorial` | 17:05Z ±8m |
| 3 | Público | jornal diário | artigo de economia com gráfico (proxy) | sim | `https://www.publico.pt/2026/01/30/economia/noticia/economia-cresceu-19-2025-ligeiramente-abaixo-meta-governo-2163036` | 17:01Z a 17:17Z |
| 4 | Expresso | semanário | ficha técnica e página inicial (bruto) | **não** | `https://expresso.pt/ficha-tecnica` | 16:58Z |
| 5 | The Guardian | jornal diário | «About us» (bruto) | sim | `https://www.theguardian.com/about` | 16:58Z |
| 6 | Eurostat | estatística oficial | Statistics Explained, habitação | sim | `https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Living_conditions_in_Europe_-_housing` | 17:01Z a 17:17Z |
| 7 | Eurostat | estatística oficial | Euro indicators, desemprego | sim | `https://ec.europa.eu/eurostat/web/products-euro-indicators/w/3-01092026-bp` | 17:01Z a 17:17Z |
| 8 | Eurostat | estatística oficial | glossário, taxa de sobrecarga | sim | `https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Housing_cost_overburden_rate` | 17:01Z a 17:17Z |
| 9 | INE | estatística oficial | portal, versão pt | sim | `https://www.ine.pt/xportal/xmain?xpgid=ine_main&xpid=INE&xlang=pt` | 17:01Z a 17:17Z |
| 10 | INE | estatística oficial | destaques e páginas de indicador | **não** | `https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques...` | 17:01Z a 17:17Z |
| 11 | ONS (Reino Unido) | estatística oficial | statistical bulletin do mercado de trabalho | sim | `https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandemployeetypes/bulletins/uklabourmarket/latest` | 17:01Z a 17:17Z |
| 12 | ONS (Reino Unido) | estatística oficial | busca por área geográfica | sim | `https://www.ons.gov.uk/visualisations/areas/` | 17:01Z a 17:17Z |
| 13 | ONS (Reino Unido) | estatística oficial | métodos e conceitos | sim | `https://www.ons.gov.uk/methodology/methodologytopicsandstatisticalconcepts` | 17:01Z a 17:17Z |
| 14 | Banco de Portugal | banco central | página inicial (bruto e proxy) | **não** | `https://www.bportugal.pt/` | 16:58Z |
| 15 | BPstat | banco central, dados | página inicial (bruto e proxy) | casca | `https://bpstat.bportugal.pt/` | 16:58Z |
| 16 | PORDATA | redisseminador | página inicial (bruto) | sim | `https://www.pordata.pt/` | 16:58Z |
| 17 | PORDATA | redisseminador | «Sobre a Pordata» | sim | `https://www.pordata.pt/pt/pordata` | 17:01Z a 17:17Z |
| 18 | PORDATA | redisseminador | «Fontes/Entidades» | sim | `https://www.pordata.pt/fontes+e+entidades` | 17:01Z a 17:17Z |
| 19 | PORDATA | redisseminador | oito páginas de indicador | sim | ver §5 | 17:01Z a 17:17Z |
| 20 | PORDATA Retratos | redisseminador | município de Lisboa, população e habitação | sim | `https://retratos.pordata.pt/populacao/lisboa` | 17:01Z a 17:17Z |
| 21 | PORDATA Retratos | redisseminador | glossário de município | sim | `https://retratos.pordata.pt/glossario/emprego-e-empresas/lagoa` | 17:01Z a 17:17Z |
| 22 | FFMS | fundação | página inicial e um estudo | sim | `https://ffms.pt/pt-pt` | 17:01Z a 17:17Z |
| 23 | Instituto de Políticas Públicas | centro universitário | página inicial | sim | `https://www.ipp-jcs.org/` | 17:01Z a 17:17Z |
| 24 | Observatório das Desigualdades | observatório | página inicial e apresentação | sim | `https://www.observatorio-das-desigualdades.com/apresentacao-2/` | 17:01Z a 17:17Z |
| 25 | Observatório da Emigração | observatório | página inicial | sim | `https://observatorioemigracao.pt/` | 17:01Z a 17:17Z |
| 26 | Observatório sobre Crises e Alternativas (CES) | observatório | página inicial | sim | `https://www.ces.uc.pt/observatorios/crisalt/` | 17:01Z a 17:17Z |
| 27 | OPSS | observatório | missão (domínio novo) | sim | `https://www.opssaude.pt/missao/` | 17:01Z a 17:17Z |
| 28 | OPSS | observatório | domínio antigo | **não** | `https://opss.pt/` | 17:01Z a 17:17Z |
| 29 | Nova SBE Economics for Policy | centro universitário | «About us» | sim | `https://economicsforpolicy.novasbe.pt/about-us/` | 17:01Z a 17:17Z |
| 30 | Instituto +Liberdade | associação | página inicial | sim | `https://maisliberdade.pt/` | 17:01Z a 17:17Z |
| 31 | Institute for Fiscal Studies | instituto | página inicial e «About» (proxy) | sim | `https://ifs.org.uk/` | 17:01Z a 17:17Z |
| 32 | Resolution Foundation | think tank | página inicial | sim | `https://www.resolutionfoundation.org/` | 17:01Z a 17:17Z |
| 33 | Institute for Government | instituto | página inicial e política de IA | sim | `https://www.instituteforgovernment.org.uk/ai-use` | 17:01Z a 17:17Z |
| 34 | Bruegel | think tank | página inicial e «About» | sim | `https://www.bruegel.org/bruegel-european-think-tank-specialises-economics` | 17:01Z a 17:17Z |
| 35 | Full Fact | instituição de verificação | página inicial e «About» | sim | `https://fullfact.org/about/` | 17:01Z a 17:17Z |
| 36 | PS | partido | página inicial e uma página de política | sim | `https://ps.pt/` | 17:01Z a 17:17Z |
| 37 | PSD | partido | página inicial e «Partido» | sim | `https://www.psd.pt/partido/` | 17:01Z a 17:17Z |
| 38 | Chega | partido | página inicial (direto e proxy) | **não** | `https://partidochega.pt/` | 17:01Z a 17:17Z |
| 39 | Iniciativa Liberal | partido | página inicial e «Ideias» | sim | `https://iniciativaliberal.pt/ideias/` | 17:01Z a 17:17Z |
| 40 | Bloco de Esquerda | partido | página inicial | sim | `https://www.bloco.org/` | 17:01Z a 17:17Z |
| 41 | PCP | partido | página inicial e «Sobre o PCP» | sim | `https://www.pcp.pt/` | 17:01Z a 17:17Z |
| 42 | Livre | partido | página inicial e programa | sim | `https://programa.partidolivre.pt/` | 17:01Z a 17:17Z |

**Os que recusaram, com a resposta exata:**

- **Expresso**: HTTP 403, corpo de 771 bytes, um CAPTCHA da DataDome. Texto integral do corpo, bruto: `Please enable JS and disable any ad blocker`. Pelo proxy, o mesmo CAPTCHA. **`[verify]`: a ficha técnica do Expresso não foi lida hoje.**
- **The Guardian, em direto**: o `WebFetch` recusou o anfitrião, em `www.theguardian.com`, `theguardian.com` e `amp.theguardian.com`: `Claude Code is unable to fetch from www.theguardian.com`. **Foi lido pelo ficheiro em bruto das 16:58Z (HTTP 200), e é esse o que se cita.**
- **Banco de Portugal**: HTTP 403. O corpo, bruto, é a interstitial da Cloudflare: `A verificar se a ligação é segura / Checking if the site connection is secure`, `Estamos a rever a segurança da sua ligação antes de prosseguir / Reviewing the security of your connection before proceeding`. **`[verify]`: o `bportugal.pt` não foi lido hoje.**
- **BPstat**: responde, mas o corpo inteiro sem JavaScript são 148 bytes: `BPstat If you're seeing this message, that means JavaScript has been disabled on your browser, please enable JS to make this app work.` Pelo proxy renderizou e deu menu e números (§4.15).
- **INE, destaques e páginas de indicador**: `connect ECONNREFUSED 193.192.10.184:443`, repetido em três endereços. O portal (`xpgid=ine_main`) abriu. **`[verify]`: nenhum destaque do INE foi lido hoje.**
- **Chega**: HTTP 403 em direto; pelo proxy, um ecrã de verificação de segurança. **`[verify]`: o `partidochega.pt` não foi lido hoje.**
- **Eurostat, «Euro indicators» pelo índice**: redireciona para autenticação (`https://ecas.ec.europa.eu/cas/login?...`, 302). O comunicado individual abriu sem autenticação.
- **OPSS**: o `opss.pt` devolveu corpo vazio em direto e HTTP 422 pelo proxy. O sítio vivo está noutro domínio, `opssaude.pt`, e esse abriu.

---

## 3. Ficha por sítio

### 3.1 Público (`publico.pt`)

**1. Como se descreve.** Não há frase de autodefinição na ficha técnica. O que aparece, repetido nas páginas de conteúdo, é apelo a assinatura: «Os leitores são a força e a vida dos jornais.» e «Os leitores são a força e a vida do PÚBLICO.» A palavra que usa para o que é, na própria ficha, é **«Periodicidade Diário»** e **«Proprietário»**: define-se por registo, não por missão.

**2. A ficha e a linha legal.** Lido do HTML em bruto, com as grafias tal como estão:

> `Direcção Editorial`
> `Director` · `David Pontes`
> `Directores-adjuntos` · `Marta Moitinho Oliveira`, `Pedro Candeias`, `Sónia Sapage`, `Tiago Luz Pedro`
> `Directora de arte` · `Sónia Matos`
> `Directora de Design de Produto Digital` · `Inês Oliveira`
> `Editores executivos`
> `Registo ERC nº 114410`
> `Periodicidade Diário`
> `Proprietário Público - Comunicação Social, S.A.`
> `Número de registo de pessoa coletiva 502265094`
> `Sede Lugar do Espido, Via Norte, Maia`
> `Redacção Lisboa Edifício Diogo Cão, Doca de Alcântara Norte,1350-352 Lisboa (sede do editor e de redacção)`
> `Porto Rua Júlio Dinis nº270,Bloco A, 3º, 4050-318 Porto`

Duas coisas que só se veem no bruto. Primeira: **o Público escreve a sua própria ficha em grafia pré Acordo** («Direcção», «Director», «Redacção»), e mistura-a com grafia do Acordo no campo legal («pessoa coletiva»). Segunda: **`Sede` e `Redacção` são campos distintos**, com moradas distintas, e a extração automática colou-os.

O nome do diretor **não** aparece nas páginas de conteúdo: aparece na ficha técnica e no rodapé. Nas páginas de conteúdo o nome que aparece é o do jornalista que assina.

**3. Como um número aparece com a fonte.** No artigo de economia lido (proxy): título «Economia cresceu 1,9% em 2025, ligeiramente abaixo da meta do Governo»; entrada «Contributo positivo do consumo privado manteve ritmo estável de crescimento no final do ano passado, mas não chegou para que a economia chegasse à casa dos 2% no total de 2025.»; assinatura «Sérgio Aníbal»; data «30 de Janeiro de 2026, 11:37». A legenda do gráfico é **uma afirmação, não uma fonte**: «Economia portuguesa abrandou em 2025 face ao ano anterior». **A linha de fonte do gráfico não foi encontrada.** O INE é citado no corpo do texto, em prosa, não numa linha de fonte junto ao número. `[verify]` quanto a haver linha de fonte na versão renderizada.

**4. Nomes de indicadores.** Não aplicável.

**5. Texto de interface.** Numa página de artigo, as frases de interface que a extração devolveu são de venda e de conta, não de instrução: «Com uma assinatura PÚBLICO tem acesso ilimitado a todos os conteúdos e cancela quando quiser.», «Palavra-chave», «Esqueceu-se da sua palavra-chave?», «Lembrar-se dos meus dados?», «Não tem uma conta? Registe-se gratuitamente», «A sua conta não se encontra ativa. Clique aqui». Há ainda um aviso longo sobre PDF: «Confiamos em si: diga não à pirataria», «O seu acesso ao PDF é um acto de confiança.»

**6. Estrutura.** Menu principal, verbatim: Opinião, Política, Sociedade, Local, Mundo, Economia, Ciência e Ambiente, Cultura, Público Brasil, Desporto, Enter, Multimédia, **Jornalismo de Dados**. São 13. Vale a pena notar que «Jornalismo de Dados» é uma **secção do menu principal**, ao lado de Desporto e Cultura.

**7. Partidos.** Não aplicável.

**8. Inteligência artificial.** Nenhum rótulo nem política encontrados na ficha técnica. Existe um artigo de opinião cujo título é, ele próprio, sobre o assunto: «O travessão (não) é sinónimo de escrever com IA». É opinião, não política editorial. **`[verify]` quanto a haver política de IA no Público.**

**9. Texto de explicação numa página de conteúdo.** Aproximadamente **8 a 10** frases visíveis a explicar o jornal, a conta ou a assinatura, e não o conteúdo. É o valor mais alto de toda esta leitura, e vem quase todo de comércio, não de pedagogia.

---

### 3.2 Expresso (`expresso.pt`)

Não abriu. HTTP 403, corpo de 771 bytes, CAPTCHA da DataDome, texto integral: «Please enable JS and disable any ad blocker». Em direto o `WebFetch` recusou o anfitrião: «Claude Code is unable to fetch from www.expresso.pt». **Os nove pontos ficam `[verify]`.**

---

### 3.3 The Guardian (`theguardian.com/about`, bruto)

**1. Como se descreve.** A frase de missão está no topo, atribuída a uma pessoa com nome e cargo:

> «Since 1821 the mission of the Guardian has been to use clarity and imagination to build hope.»
> «Katharine Viner, editor-in-chief»

E logo abaixo:

> «Guardian Media Group is a global news organisation that delivers fearless, investigative journalism - giving a voice to the powerless and holding power to account.»
> «Our independent ownership structure means we are entirely free from political and commercial influence. Only our values determine the stories we choose to cover – relentlessly and courageously.»

A palavra que usa para o que é: **«a global news organisation»**.

**2. A ficha e a linha legal.** A propriedade não é uma linha de rodapé: é **uma secção da página, com três organizações nomeadas e a função de cada uma**:

> «The Guardian's agenda-setting journalism is underpinned by an independent ownership structure that is different from other global news organisations. It guarantees our journalism and our editor stay independent from any outside influence, whether financial, political or commercial.»
> «The Scott Trust, the sole shareholder of Guardian Media Group. The purpose — and privilege — of the Trust is to secure the financial and editorial independence of the Guardian in perpetuity.»
> «The Scott Trust Endowment, a fund built up following the prudent sale of assets with the core purpose of investing to provide financial returns to support Guardian journalism in perpetuity.»
> «Guardian Media Group, the owner of Guardian News & Media (GNM) and publisher of the Guardian newspaper and website.»
> «This exceptional, if not unique, form of governance for a news publisher ensures that all surplus financial returns are reinvested into our high quality journalism for a global audience rather than benefiting a proprietor or shareholders.»

Conta ainda a origem, com data e nome: «In 1936, John Russell Scott — the proprietor of the Manchester Guardian, as it was then known — transferred his family's stake in the newspaper to a group of trustees.»

Linha legal do rodapé: «© 2026 Guardian News & Media Limited or its affiliated companies. All rights reserved. (dcr)»

**3. Como um número aparece com a fonte.** Na página «About», o número que aparece é sobre o próprio jornal e traz âmbito: «The Guardian has over 1 million recurring digital supporters from more than 180 countries around the world.» Não traz linha de fonte, porque é um facto próprio. **Não consegui ler um artigo do Datablog: o anfitrião está bloqueado em direto e o ficheiro em bruto só cobre `/about` e `/uk`. `[verify]`.**

**4. Nomes de indicadores.** Não aplicável.

**5. Texto de interface.** Muito pouco. O que a extração devolveu foi «Skip to main content», «Return to the Guardian», «Read more», «Support us», «Discover». São rótulos de ação, não instruções.

**6. Estrutura.** Navegação da secção institucional, verbatim: «About us», «Guardian Media Group», «The Scott Trust», «Journalism». São 4. Repare-se no que isto significa: **a estrutura institucional tem quatro entradas e uma delas é a propriedade.**

**7. Partidos.** Não aplicável.

**8. Inteligência artificial.** Nenhuma política de IA em `/about`. Em `/uk` há muitas notícias sobre IA, o que é conteúdo, não política. **`[verify]`.**

**9. Texto de explicação numa página de conteúdo.** Em `/about`, a página é toda explicação, por definição. O que interessa é que a explicação **é sobre a instituição e o seu governo**, não sobre como usar o sítio: cerca de 12 frases sobre propriedade, independência e financiamento, e **zero** a explicar a interface.

---

### 3.4 Eurostat

**Statistics Explained, habitação** (`Living_conditions_in_Europe_-_housing`)

**1. Como se descreve.** A própria página abre a dizer o que faz: «This article explores the housing landscape within the European Union (EU) in 2024, focusing on various aspects of households' living conditions.» O Statistics Explained descreve-se, no seu «About», como «an official Eurostat website that presents statistical topics in an easily understandable way» (esta última **paráfrase**, vinda de resultado de pesquisa, não lida na página: `[verify]`).

**3. Como um número aparece com a fonte.** Este é o padrão mais limpo de toda a leitura. A legenda do gráfico traz título, âmbito, ano e **o código do conjunto de dados**:

> «Figure 1: Population distribution by tenure status at EU level, 2024 Source: Eurostat (ilc_lvho02)»

Os códigos que aparecem na página, verbatim: `ilc_lvho02`, `ilc_lvho05a`, `ilc_mdes01`, `ilc_atsd01`, `ilc_lvho07a`, `ilc_esms`.

À vista, ao lado do número, estão o período («2024»), o âmbito («at EU level») e a fonte com código. Atrás de um toque ficam: o ficheiro («Housing: maps, tables and figures», Excel), as secções «Data sources», «Source data for tables and graphs» e «Context».

E, o que nenhum sítio português desta leitura faz, **a página data-se a si própria nos dois sentidos**:

> «Data extracted: November 2025»
> «Planned article update: December 2026»

Diz quando os dados foram extraídos **e quando o texto vai ser revisto.**

**Glossário** (`Glossary:Housing_cost_overburden_rate`). O termo tem página própria, com definição operacional completa:

> «The housing cost overburden rate is the percentage of the population living in households where the total housing costs ('net' of housing allowances) represent more than 40 % of disposable income ('net' of housing allowances).»

E liga a conceitos vizinhos: «EU statistics on income and living conditions (EU-SILC)», «Overcrowding rate», «Severe housing deprivation rate».

**Euro indicators**, comunicado (`3-01092026-bp`)

> «Euro area unemployment at 6.4%»
> «In July 2026, the euro area seasonally adjusted unemployment rate was 6.4%, stable compared with June 2026 and up from 6.3% in July 2025.»

Data de divulgação «1 September 2026» e **próxima divulgação anunciada, «1 October 2026»**. A fonte é dada como conjunto de dados: «Source datasets: une_rt_m (rates) and une_rt_m (in 1 000 persons)». Há secção de método: «Eurostat publishes harmonised unemployment rates for individual EU Member States, the euro area and the EU. These unemployment rates are based on the definition recommended by the International Labour Organisation (ILO).» E contacto nomeado: «Eurostat Media Support | E-mail: eurostat-mediasupport@ec.europa.eu».

**Repare-se no título do comunicado: é o resultado, não o assunto.** «Euro area unemployment at 6.4%», não «Estatísticas do desemprego, julho de 2026».

**5. Texto de interface.** Quase nenhum. «Subscribe to receive the latest Eurostat Euro indicators releases».

**9. Texto de explicação.** Aproximadamente **1 a 2** frases, e as duas são sobre o conteúdo do artigo, não sobre o sítio.

---

### 3.5 INE (`ine.pt`)

**1. Como se descreve.** «Portal Oficial - Instituto Nacional de Estatística». É uma etiqueta, não uma frase.

**3. Como um número aparece com a fonte.** Na página inicial, os indicadores em destaque vêm **sempre com unidade e período ao lado do valor**, numa tabela:

| Indicador (verbatim) | Valor | Unidade | Período |
|---|---|---|---|
| População residente | 11 424 031 | N.º | 2025 |
| Taxa de desemprego (Série 2021) | 5,3 | % | 2.º Trimestre de 2026 |
| Índice de preços no consumidor | 3,30 | % | Agosto de 2026 |
| Saldo das Administrações Públicas | 0,5 | % do PIB | 1.º Trimestre de 2026 |
| Saldo migratório | 70 862 | N.º | 2025 |
| Produto interno bruto | 2,5 | % | 2.º Trimestre de 2026 |

Duas coisas dignas de nota. A unidade é um campo, e distingue «%» de «% do PIB». E **o nome do indicador carrega a versão da série**: «Taxa de desemprego (Série 2021)». O INE não deixa o leitor supor que a série é comparável: diz qual é.

**6. Estrutura.** Menu, verbatim: Estatísticas, Território, Produtos, WebInq, Contactos, Calendário. São 6. **Uma das seis entradas é o calendário de divulgação.** Os separadores de um tema, verbatim: «Principais indicadores», «Principais quadros», «Base de dados», «Microdados», «Estatísticas territoriais», «Pirâmides etárias».

**5. Texto de interface.** «Pesquisa avançada», «Saltar para o conteúdo principal».

**Nota de método.** Os destaques e as páginas de indicador recusaram a ligação (`ECONNREFUSED`). Os nomes oficiais do INE que aparecem no §5 vêm da tabela da página inicial, que foi lida, ou estão marcados `[verify]`.

---

### 3.6 ONS, Reino Unido (`ons.gov.uk`)

Este é o sítio com a gramática de página mais explícita de todos os que abriram.

**1. Como se descreve.** Não encontrei frase de autodefinição na página inicial. Define-se por **rótulo de qualidade** na página de cada boletim: «These are accredited official statistics. Click for information about types of official statistics.»

**3. Como um número aparece com a fonte.** O boletim lido é «Labour market overview, UK: September 2026». Traz, à cabeça, as duas datas:

> «Release date: 15 September 2026»
> «Next release: 20 October 2026»

Os pontos principais são frases completas com número, período e direção, não números soltos:

> «Estimates for payrolled employees in the UK fell by 101,000 (0.3%) between July 2025 and July 2026»
> «The UK employment rate (based on the LFS) for people aged 16 to 64 years was estimated at 75.1% for May to July 2026»

A legenda do gráfico é, outra vez, **uma afirmação**, e a fonte vem em linha separada e nomeia cada inquérito e cada organismo:

> «Employee measures show a mixed picture over the last year, with RTI continuing to fall in the three months to July 2026»
> «Labour Force Survey (LFS) and Workforce Jobs (WFJ) from the Office for National Statistics, and Pay As You Earn Real Time Information (RTI) from HM Revenue and Customs (HMRC)»

E há uma coisa que nenhum sítio português desta leitura tem: **o boletim ensina o leitor a citá-lo.**

> «Cite this statistical bulletin»
> «Office for National Statistics (ONS), released 15 September 2026, ONS website, statistical bulletin, Labour market overview, UK: September 2026»

Há também contacto com equipa nomeada: «Labour Market team | labour.market@ons.gov.uk | Telephone: +44 1633 455400».

**6. Estrutura.** As secções do boletim, verbatim e por ordem: «Other pages in this release», «Main points», «Latest indicators at a glance», «Trends and considerations around comparisons», «Data on labour market», «Glossary», «Data sources and quality», «Related links», «Cite this statistical bulletin». São 9, e **são as mesmas em todos os boletins**: o leitor que aprendeu um aprendeu todos. (Nota: o par clássico «Main points» e «Measuring the data» aparece hoje como «Main points» e «Data sources and quality».)

Do país à área: a página `/visualisations/areas/` explica-se numa frase e depois pergunta:

> «Get data about people and the communities they live in, including population, identity, housing, people in or out of work, education and health.»
> «Search by area name or postcode»
> «For example, 'Titchfield' or 'PO15 5RR'»

Os níveis, verbatim: «your area, local authority, combined authority, ward, parish or parliamentary constituency».

O método tem casa própria, com índice: «Methodology topics and statistical concepts», descrita como «The statistical methods and techniques that underpin all our surveys and statistical outputs, and information on statistical quality and revisions policies.», com as secções «How we create our outputs», «Index numbers», «Sample design and estimation», «Seasonal adjustment», «Disclosure control», «Quality in official statistics», «Revisions and Corrections», «Guide to official statistics in development», «Admin data sources», «Uncertainty and how we measure it».

**5. Texto de interface.** «Search for a keyword(s) or time series ID». Repare-se: o texto-fantasma **ensina que se pode procurar por identificador de série**, o que é informação, não instrução vazia.

**Rodapé.** «All content is available under the Open Government Licence v3.0, except where otherwise stated».

**9. Texto de explicação numa página de conteúdo.** Aproximadamente **2 a 3**, todas funcionais (acreditação, como citar, onde estão os dados).

---

### 3.7 Banco de Portugal e BPstat

**Banco de Portugal**: não abriu (§2). **`[verify]` nos nove pontos.**

**BPstat** (pelo proxy). Sem JavaScript o corpo inteiro são 148 bytes com a mensagem «please enable JS to make this app work».

**1. Como se descreve.** Não encontrei frase de autodefinição: apresenta-se só pelo nome «BPstat».

**6. Estrutura.** Menu, verbatim: «POR PERFIL», «AJUDA», «Notícias», «Principais indicadores», «Domínios», «Séries longas», «Quadros», «Pesquisa avançada», «API», «Temas», «Estatísticas experimentais», «Conceitos». São 12. Três merecem nota: **«POR PERFIL»** (a navegação organiza-se por quem é o leitor), **«API»** (o acesso por máquina é entrada de menu) e **«Estatísticas experimentais»** (o estatuto do dado é uma secção).

**3. Como um número aparece com a fonte.** Cada número traz período curto ao lado: «3,3%» com «taxa de inflação em Portugal» e «agosto de 2026»; «0,71%» com «Balanças corrente e capital (%PIB)» e «2T 2026»; «-815,00 M€» com «Emissões líquidas de títulos dívida ESG» e «jul. 2026»; «3,6%» com «Inflação (tvh)» e «ago. 2026». A unidade vai colada ao nome («%PIB», «M€», «tvh»).

**Nota.** «3,3%» e «3,6%» aparecem ambos como inflação de agosto de 2026 com rótulos diferentes («taxa de inflação» e «Inflação (tvh)»). Não investiguei a diferença; fica registado como observação, não como achado.

---

### 3.8 PORDATA (`pordata.pt`)

O sítio mais próximo do nosso problema, e o que mais tem para ensinar.

**1. Como se descreve.** Na página «Sobre a Pordata»:

> «Base de Dados de Portugal Contemporâneo, é organizada e desenvolvida pela Fundação Francisco Manuel dos Santos»
> «As estatísticas divulgadas são provenientes de fontes oficiais e certificadas, com competências de produção de informação nas áreas respetivas.»
> «Colaboram com a PORDATA mais de sessenta entidades oficiais, com especial destaque para o Instituto Nacional de Estatística.»

Data de nascimento dada: «23 de fevereiro de 2010». A palavra que usa para o que é: **«Base de Dados»**. No rodapé de todas as páginas: «A Pordata é um projeto da Fundação Francisco Manuel dos Santos.»

**2. A ficha.** Há nomes, com período de mandato: «Maria João Valente Rosa» (direção entre junho de 2009 e fevereiro de 2019), «Luísa Canto e Castro Loura» (diretora desde 2020), e a equipa nomeada. Os nomes estão na página «Sobre», **não** nas páginas de indicador.

**3. Como um número aparece com a fonte.** Este é o achado mais transportável de toda a leitura. Numa página de indicador, o padrão é fixo:

| Indicador (verbatim) | Fontes/Entidades (verbatim) | Última actualização |
|---|---|---|
| «Administrações Públicas: dívida bruta em % do PIB» | «Fontes/Entidades: DGO/MF \| BdP \| INE, PORDATA» | «Última actualização: 2026-03-26» |
| «Dívida pública: dívida das Administrações Públicas» | «Fontes/Entidades: DGO/MF \| BdP \| INE, PORDATA» | «Última actualização: 2026-03-27» |
| «Administrações Públicas: despesas, receitas e défice/excedente em % do PIB» | «Fontes/Entidades: INE, PORDATA» | «Última actualização: 2026-03-27» |
| «Taxa de emprego: total e por sexo (%)» | «Fontes/Entidades: INE, PORDATA» | «Última actualização: 2026-03-12» |
| «Taxa de desemprego: total e por sexo (%)» | «Fontes/Entidades: INE, PORDATA» | «Última actualização: 2026-03-13» |
| «Ganho médio mensal dos trabalhadores por conta de outrem: total e por sexo» | «GEP/MTSSS (até 2009) \| GEE/MEc (2010 a 2012) \| GEP/MSESS, MTSSS (a partir de 2013), PORDATA» | «2026-01-05» |
| «Taxa de abandono escolar: total e por sexo» | «Fontes/Entidades: INE, PORDATA» | «Última actualização: 2026-02-04» |
| «Taxa de jovens não empregados que não estão em educação ou formação: total e por sexo» | «Fontes/Entidades: Eurostat \| Institutos Nacionais de Estatística, PORDATA» | «Última actualização: 2026-03-13» |
| «Edifícios licenciados para habitação familiar: total e por tipo de obra» | «Fontes/Entidades: INE, PORDATA» | «Última actualização: 2026-07-17» |

Três lições nesta tabela. Primeira: **o rótulo é «Fontes/Entidades», no plural, e aguenta uma cadeia** com `|` a separar produtores e `,` antes do redisseminador. Segunda: **o ganho médio mensal mostra a fonte a mudar ao longo da série**, com os anos de cada troca dentro da própria linha de fonte. Terceira: **a PORDATA assina-se a si própria no fim de cada cadeia** («..., PORDATA»), distinguindo quem produziu de quem compilou.

E a definição do indicador **é escrita como a pergunta do leitor**, não como texto de norma:

> «Quanto é, em percentagem do PIB, a dívida pública acumulada?»
> «Qual a percentagem de homens ou mulheres, entre os 18 e os 24 anos, que deixou de estudar sem completar o secundário?»
> «Qual a percentagem de homens ou mulheres entre os 16 e os 89 anos que trabalham?»
> «Quantos homens ou mulheres desempregados existem por cada 100 ativos?»
> «Qual o ordenado médio, por mês, com horas extra, subsídios ou prémios, dos empregados, homens ou mulheres?»

Atrás de um toque ficam os botões, verbatim: «Ver Gráfico Estático», «Ver Gráfico Ranking», «Ver Gráfico Barras», «Mais opções e dados», «Exportar para Excel», «Exportar para PDF», «Percentagem», «Preços Constantes», «Euro - Milhões», «Operações», **«Simbologia»**, **«Sobre estes dados»**.

**4. Nomes de indicadores.** Ver §5.

**5. Texto de interface.** Muito pouco, e bom. O texto-fantasma da busca, lido no HTML em bruto, é **«Que dados procura?»**: uma pergunta na língua do leitor, não uma instrução. Na navegação por temas: «Clique no tema para ver os subtemas relacionados.» Nos Retratos: «Escolha o tema que pretende analisar» e «Compare com outros municípios».

**6. Estrutura.** Menu principal, lido no bruto, com a hierarquia tal como está:

- **Estatísticas**: Portugal · Municípios · Europa
- **Quadros Resumo**: Portugal · Municípios · Europa
- **Retratos**: Europa · Municípios · 5 Décadas de Democracia · Eleições Presidenciais
- **Simuladores**: Inflação
- **PUBLICAÇÕES**: Vídeos · Livros
- **Atualizações**

São **6 entradas de topo**. E aqui está a resposta à pergunta do país à região ao município: **a geografia não é um nível da árvore, é uma coluna que se repete.** «Portugal · Municípios · Europa» aparece igual sob «Estatísticas» e sob «Quadros Resumo». O leitor aprende três palavras uma vez e usa-as em todo o sítio.

**A página de município não tem a mesma forma que a do país.** É outro produto, noutro domínio (`retratos.pordata.pt`), com outro menu: População, Educação, Habitação, Emprego e Empresas, Turismo, Território e Ambiente (6 temas). E escreve de outra maneira: no país o dado é uma tabela, no município o dado é **uma frase comparativa**:

> «a população residente no município de Lisboa ascendia a 658.236 pessoas»
> «A população do município aumentou 8,7% entre 2021 e 2025»
> «Com um valor acima do valor nacional (124 habitantes por km²) e é o município português com a 4.ª maior densidade populacional»
> «o valor mediano da avaliação bancária das casas para habitação familiar atingiu 3.826€ por m²»
> «+659 novas casas do que no triénio 2018-2020»

Com fonte curta, «Fonte: INE», e uma linha de frescura: «Dados atualizados até 31 de agosto 2025». **O número do município vem sempre com a régua ao lado** (o valor nacional, a posição no ranking, o triénio anterior). Sozinho, 3.826€ por m² não diz nada a ninguém.

O município tem ainda **glossário próprio por tema**, com definições operacionais:

> «Ganho médio mensal»: «É o montante ilíquido (antes dos descontos) em dinheiro e/ou géneros pago regularmente a um trabalhador pelo tempo de trabalho efetuado»
> «Desempregados registados no IEFP»: «Pessoas registadas como desempregadas ou como estando à procura do 1.º emprego nos Centros de Emprego do Instituto do Emprego e Formação Profissional (IEFP).»

**«Fontes/Entidades»** é página própria, e lista as entidades pelo nome completo com a sigla: «Instituto Nacional de Estatística, I.P. (INE)», «Banco de Portugal (BdP)», «Direção Regional de Estatística da Madeira (DREM)», «Serviço Regional de Estatística dos Açores (SREA)», «Assembleia da República (AR)», «Procuradoria-Geral da República (PGR)», «Comissão Nacional de Eleições (CNE)», «Governo dos Açores», «Autoridade Nacional das Comunicações (ANACOM)», «Entidade Reguladora dos Serviços de Águas e Resíduos (ERSAR)», e segue.

**8. Inteligência artificial.** Nada na PORDATA. Na FFMS, que é a casa-mãe, sim: ver §3.9.

**9. Texto de explicação numa página de conteúdo.** Aproximadamente **2**: «Clique no tema para ver os subtemas relacionados.» e a linha do rodapé sobre a FFMS.

---

### 3.9 Fundação Francisco Manuel dos Santos (`ffms.pt`)

**1. Como se descreve.** «A FFMS nasceu em 2009, fundada por Alexandre Soares dos Santos e família, para estudar os grandes problemas nacionais e levá-los ao conhecimento da sociedade.» A palavra: **«Fundação»**.

**2. A ficha.** Rodapé: «Copyright © 2026 Fundação Francisco Manuel dos Santos. Todos os direitos reservados», com «Política de cookies», «Termos de Utilização», «Política de Privacidade», **«Livro de reclamações»**.

**3. Como um número aparece com a fonte.** Num estudo («Retrato da Pobreza em Portugal»), o número aparece em prosa e **sem linha de fonte**: «Quase um quinto dos portugueses estava em risco de pobreza em 2018.» Há coordenador nomeado, «Fernando Diogo», rotulado «Coordenador do Estudo», e data de publicação, «12 Abril 2021». A coleção descreve-se: «Debates sobre os grandes temas que desafiam Portugal com os principais resultados de estudos inéditos da Fundação.»

**6. Estrutura.** Menu, verbatim: A Fundação, Estudos, Livraria, Pordata, Atual_Mentes, FFMS Play, Agenda. São 7, e uma delas é a PORDATA.

**8. Inteligência artificial.** **Este é o único rótulo de IA em português que encontrei em todo o levantamento**, e é sobre imagem, não sobre texto. Verbatim, com a gralha que está na página:

> «Crédito: Shutterstock, com expansão de iamgem com recurso a IA»
> «Esta imagem foi expandida com recurso a IA.»

Aparece na legenda da imagem, junto ao crédito fotográfico. Não há política; há rótulo no sítio do crédito.

**5. Texto de interface.** «Subscrever», «Ver agenda», «Saiba mais», «Ver no mapa», «Leave this field blank».

---

### 3.10 Instituto de Políticas Públicas (`ipp-jcs.org`)

**1.** «Somos um think tank de origem académica, que atua de forma apartidária e independente de quaisquer interesses económicos, sociais, políticos, religiosos ou outros.» Palavra: **«think tank»**. Está na secção «Quem Somos».

**6.** Menu: Sobre nós, Áreas de Investigação, Projetos, Publicações, Eventos, Contactos, Apoie o IPP. São 7 mais o seletor de língua.

**5.** «Pesquisar por:».

**2.** Rodapé: «© Copyright 2025 Institute of Public Policy - Lisbon. Todos os direitos reservados.» Repare-se: **rodapé em inglês num sítio em português, e com o ano de 2025 numa leitura de setembro de 2026.**

**9.** Aproximadamente **2**.

---

### 3.11 Observatório das Desigualdades (`observatorio-das-desigualdades.com`)

**1.** «O Observatório das Desigualdades é uma estrutura independente, constituída no quadro do Centro de Investigação e Estudos de Sociologia do Instituto Universitário de Lisboa (CIES-IUL)». Palavra: **«estrutura independente»**, não «observatório», apesar do nome.

A frase de missão é a mais próxima da nossa que encontrei em português:

> «o Observatório assume como missão a disponibilização pública de informação rigorosa e atualizada sobre o tema, numa perspetiva de cidadania»

**2.** Acolhimento e parceiros nomeados: «Centro de Investigação e Estudos de Sociologia do Instituto Universitário de Lisboa (CIES-IUL)»; «Instituto de Sociologia da Faculdade de Letras da Universidade do Porto (ISFLUP) e o Centro de Estudos Sociais da Universidade dos Açores (CES-UA, hoje CICS.NOVA.UAc)». O «hoje CICS.NOVA.UAc» é uma correção feita dentro do texto, e não ao lado dele.

**6.** Menu: O Observatório, Indicadores, Publicações, Notícias e Agenda, Ligações, Newsletters, ENGLISH INFO. São 7. **Uma das sete entradas chama-se «Indicadores».**

**5.** «Pesquisar»; «Por favor deixe este campo em branco».

**2.** Rodapé: «© Observatório das Desigualdades | Powered by Slab Studio».

**3.** Não encontrei número com linha de fonte na página inicial. `[verify]`.

---

### 3.12 Observatório da Emigração (`observatorioemigracao.pt`)

**1.** Não há frase de autodescrição na página inicial. Identifica-se pela instituição, no rodapé: «Centro de Investigação e Estudos de Sociologia».

**3.** O padrão desta casa é **a fonte dentro da frase**, e não numa legenda:

> «Foram 520 os portugueses que, em 2025, entraram no Canadá, segundo os dados do Citizenship and Immigration Canada»

Número, ano, país e produtor, numa só frase legível em voz alta. Ao lado: «393,750 entradas de estrangeiros em território canadiano» e «0.1% desse total», ou seja, **o total e a proporção juntos**, que é a régua.

**6.** Menu: Países, Dados, Destaques, Publicações, Entrevistas, Multimédia, Iniciativas, Newsletter. São 8. **A primeira entrada é uma geografia** («Países»), e a segunda são os dados.

**2.** Rodapé com morada e contactos completos: «Observatório da Emigração Centro de Investigação e Estudos de Sociologia Instituto Universitário de Lisboa Av. das Forças Armadas, 1649-026 Lisboa, Portugal T. (+351) 210 464 322 F. (+351) 217 940 074 observatorioemigracao@iscte-iul.pt». **Nenhum nome de pessoa.** `[verify]` quanto a haver coordenação nomeada noutra página.

---

### 3.13 Observatório sobre Crises e Alternativas, CES (`ces.uc.pt/observatorios/crisalt`)

**1.** «O Observatório sobre Crises e Alternativas do Centro de Estudos Sociais tem como objetivos apresentar análises fundamentadas sobre a estrutura e a evolução da sociedade portuguesa...»

**2.** **Coordenação nomeada, com o órgão que a acompanha:**

> «A Coordenação do Observatório e composta por José Reis, Ana Drago e João Rodrigues, acompanhados por um Conselho constituído por quem tem participado continuadamente nas suas atividades.»

(A falta de acento em «e composta» está na página.)

**6.** Menu com **2 entradas**, e são as duas que interessam: «Quem somos» e **«Como observamos»**. É o menu mais curto de todo o levantamento, e o único em que uma das entradas é o método.

**Data.** A data mais recente que a extração encontrou foi a da criação, «O Observatório foi criado em abril de 2012». **`[verify]` quanto a haver atividade recente.**

---

### 3.14 OPSS (`opssaude.pt`)

**1.** A missão, verbatim:

> «tem como missão proporcionar a todos aqueles, que de uma maneira ou de outra, podem influenciar a saúde em Portugal, uma análise precisa, periódica e independente da evolução do sistema de saúde português»

Palavra: **«Observatório»**, e também «rede de investigadores e instituições académicas».

**Periodicidade como compromisso, com data de início:** «produz anualmente, desde 2001, um documento síntese».

**6.** Menu: «SOBRE OPSS» (com Missão, História, Coordenação) e «RELATÓRIOS DE PRIMAVERA». **Duas entradas de topo: quem somos, e o produto.**

**2.** Rodapé: «© Observatório Português dos Sistemas de Saúde», com «Politica de Privacidade» (sem acento na página) e «Termos e Condições». Instituições por logótipo: ISPUP, CEISUC, ENSP.

**Nota de estado.** O domínio antigo `opss.pt` não responde. Há aqui um sítio com dois domínios e um deles morto.

---

### 3.15 Nova SBE Economics for Policy (`economicsforpolicy.novasbe.pt`)

**1.** «Economics for Policy at Nova School of Business and Economics is a knowledge center dedicated to applying fundamental tools from economics to relevant issues in business and public policy.» Palavra: **«knowledge center»**.

**6.** Menu: ABOUT US, SUMMER SCHOOL, PUBLICATIONS, EVENTS, PEOPLE, NEWS, Sign up. São 7. **Em maiúsculas, e em inglês, num centro português.**

**5.** O único texto de instrução que a extração encontrou é de registo de conta: «The password must have a minimum of 8 characters of numbers and letters, contain at least 1 capital letter».

**2.** Rodapé: «© Economics for Policy, a Knowledge Center of novasbe.pt».

---

### 3.16 Instituto +Liberdade (`maisliberdade.pt`)

**1.** Título principal: «Em defesa da democracia liberal». Missão: «Pela promoção de conhecimento sobre os principais pilares de uma sociedade livre baseada na liberdade individual, na liberdade política e na economia de mercado.» Palavra: **«Instituto»**.

**6.** Menu: Notícias, Artigos, **+Factos**, **+Escrutínio**, Projetos, Biblioteca, Vídeos, Quem somos, About Us. São 9. Duas entradas interessam à nossa questão: **«+Factos»** e **«+Escrutínio»**, ou seja, a verificação e o escrutínio são secções nomeadas, com a marca colada ao nome.

**3.** Não encontrei afirmação com número e fonte na página inicial. `[verify]`.

**2.** Rodapé: «Instituto +Liberdade - Em defesa da democracia-liberal.» e «© Copyright 2021-2026 Instituto Mais Liberdade - Todos os direitos reservados». Nota: o rodapé escreve «democracia-liberal» com hífen e o título escreve «democracia liberal» sem. Sem nomes de direção na página inicial.

---

### 3.17 Institute for Fiscal Studies (`ifs.org.uk`)

**1.** «The Institute for Fiscal Studies (IFS) is the UK's leading independent economics research institute.» Palavra: **«institute»**, «research institute». E: «We are proud of our reputation for academic rigour, policy impact, high quality communications and absolute independence.»

**3.** Os números da página inicial são **sobre o próprio instituto**, e cada um traz o ano:

> «74 journal articles published by IFS authors in 2025»
> «7,964 attendees to IFS events in 2025»
> «44,994 mentions in the UK media in 2025»
> «224 mentions in parliamentary debates in 2025»
> «614 citations of IFS research in UK Government and Parliamentary documents»

Isto é prestação de contas na página inicial: **o instituto publica os seus próprios indicadores de atividade, datados.**

**6.** Menu: Topics, Research and analysis, Podcasts, explainers and calculators, Events, About. São **5**. É o menu mais curto dos institutos, e uma das cinco entradas chama-se «Podcasts, explainers and calculators», ou seja, os formatos de explicação têm entrada própria.

**8. Inteligência artificial.** Existe link no rodapé com o rótulo verbatim **«Use of AI tools in our work»**. Não consegui abrir a página da política: dois endereços tentados devolveram HTTP 403. **O rótulo está confirmado; o texto da política fica `[verify]`.**

**2.** Rodapé, completo: «The Institute for Fiscal Studies, 2 Marylebone Road, London NW1 4DF. Tel: 020 7291 4800. Fax: 020 7323 4780. Limited by guarantee. Registered in England: 954616. Registered charity: 258815. © 2026.»

---

### 3.18 Resolution Foundation (`resolutionfoundation.org`)

**1.** «The Resolution Foundation is an independent think-tank dedicated to lifting living standards in the UK.» Palavra: **«think-tank»**. Está sob a secção «Our mission».

**3.** Números com âmbito: «£13.45 per hour» (taxa nacional do Living Wage), «£14.80 per hour» (Londres), «1.3 million households are on local authority housing waiting lists».

**6.** Menu: Our work, Publications, Events, Comment, Media, About us, Economy 2030. São 7.

**2.** Rodapé com morada, contactos, **contacto de imprensa separado**, e os dois números legais: «2 Queen Anne's Gate, London SW1H 9AA | E:info@resolutionfoundation.org T:020 3372 2960 | To contact the press office: T:0203 372 2968 | Company Number: 5588883 | Charity Number: 1114839 | Privacy Policy | © The Resolution Foundation 2026»

**5.** «Search for:», «Sign up below», «Leave this field empty if you're human:».

---

### 3.19 Institute for Government (`instituteforgovernment.org.uk`)

**1.** A autodescrição é um lema de seis palavras, repetido no cabeçalho e no rodapé: **«Working to make government more effective»**. Não diz o que é, diz o que faz.

**6.** Menu: About us, Our work, Spotlight on, Our publications, Our podcasts, Our events, IfG Academy. São 7.

**8. Inteligência artificial.** **A política mais completa de todo o levantamento, e a única lida na íntegra.** Página «AI use at the Institute for Government», verbatim:

> «Generative AI tools are not used to draft any of the body text of Institute for Government outputs.»
> «All contributors to Institute work are accountable for the accuracy, quality and integrity of their work.»
> «AI tools support elements of our analysis and allow us to be more efficient in carrying out tasks.»
> «In any rare instance where, exceptionally, the use of generative AI tools to create body text for an Institute for Government output has been approved outside of the principles set out here, we will disclose this use in the output in question.»
> «In any rare instance where, exceptionally, the use of generative AI tools to create photographs has been approved outside the principles set out here, we will clearly label them as being created with AI.»
> «This policy was last updated in March 2026.»

A estrutura desta política merece ser vista como forma, e não só como conteúdo: **regra, responsabilidade, exceção, e a promessa de divulgar a exceção. E a política data-se.**

**5.** «Enter your question or keywords». Repare-se: não é «Pesquisar».

**2.** Rodapé: «© 2026 Institute for Government | Design and development by Soapbox. The Institute is a company limited by guarantee registered in England and Wales No. 6480524 Registered Charity No. 1123926»

---

### 3.20 Bruegel (`bruegel.org`)

**1.** O nome da própria página «About» é a frase: «Bruegel is the European think tank that specialises in economics». E: «Established in 2005, it is independent and non-doctrinal.» Palavra: **«think tank»**.

Na página inicial, o lema é de duas palavras: **«Improving economic policy»**.

**6.** Menu: Topics, Publications, Commentary, **Datasets**, Podcasts, Events, Our Researchers. São 7. Duas notas: **«Datasets» é entrada de menu principal** (os dados são um produto, ao lado das publicações), e **«Our Researchers» também** (as pessoas são uma secção).

**5.** «Search» e «Suggested keywords:». O segundo é útil: **o sítio sugere por onde começar.**

**2.** Rodapé: «© BRUEGEL. All rights reserved. Design and development by Soapbox.»

---

### 3.21 Full Fact (`fullfact.org`)

**1.** «Full Fact is the UK's independent fact checking charity. We put reliable evidence at the heart of public debate so you can make sense of what matters.» E: «Full Fact's mission is to build a better information environment to restore trust.» Palavra: **«charity»**, «independent fact checking charity».

**Sobre independência e dinheiro, explicitamente:** «We have fundraising guidelines in place to ensure neutrality, and it's thanks to the support of thousands of people and organisations that our independence is protected.»

**Sobre correções, que é o que nos interessa:** «We follow up on our fact checks by holding public figures and institutions accountable, and encouraging corrections or retractions.»

**6.** Menu: Articles, Topics, Learn, Our work, About, Search. São 6. **Uma das seis entradas chama-se «Learn».**

**8. Inteligência artificial.** «We build world-leading AI tools which allow small groups of people to fact check false or misleading claims at internet scale.» e «Full Fact AI is a set of tools developed by Full Fact and used by fact checkers around the world to monitor public debate, find misinformation, and take action.» Ou seja: **a IA é declarada como ferramenta de produção, com nome próprio.** Não encontrei política de rotulagem de texto gerado. `[verify]`.

**2.** Rodapé: «Full Fact is a registered charity (no. 1158683) and a non-profit company (no. 06975984) limited by guarantee and registered in England and Wales. © Copyright 2010-2026 Full Fact. Thanks to Hosting UK for donating our web hosting.»

**5.** «leave this field blank to prove your humanity».

---

### 3.22 a 3.28 Partidos

A pergunta era: como apresentam a realidade do país, com fontes ou sem? **A resposta curta é: sem.** Em sete partidos, encontrei **uma** afirmação com número sobre o estado do país nas páginas lidas, e **nenhuma com fonte identificada**.

**PS** (`ps.pt`). Autodescrição: «Se a solidariedade e a tolerância são para si pilares essenciais na vida de uma sociedade livre, igualitária, económica e socialmente desenvolvida, o PS é o seu Partido.» Menu: Eleições Internas 2026, A nossa história, Órgãos do PS, A Nossa Política, Notícias, Área Militante (6). Rodapé: «© Copyright 2026 - Partido Socialista. Todos os direitos reservados NIPC: 501312188» (é o único partido com NIPC no rodapé). **A única afirmação com número que encontrei em todos os partidos**, numa página de «A Nossa Política»: «em 2009, Portugal ultrapassou os 2,791 milhões de euros em investimento em investigação e desenvolvimento, atingindo 1,7 por cento do Produto Interno Bruto (PIB) nacional», atribuída apenas a «Segundo esses dados», **sem fonte identificada**. Note-se ainda que a página é de 2009 ou refere-se a 2009, num sítio consultado em 2026.

**PSD** (`psd.pt`). Autodescrição, em «Partido»: «O propósito político do PSD consiste em contribuir para o desenvolvimento de uma democracia avançada e de uma sociedade aberta, livre e solidária.» Menu: Início, Área Militante, História - 52 anos PSD, Partido, Grupo Parlamentar, Parlamento Europeu, Atualidade, Participe, Contactos (9). Texto de interface: «Faça parte do nosso dia, subscreva a nossa newsletter», «Está à procura de algo específico?», «Descarregue a nossa App». **Nenhuma afirmação com número.** Tem, porém, uma entrada chamada **«Informação Estatística»** dentro de «Partido», que é sobre o partido, não sobre o país.

**Chega** (`partidochega.pt`). Não abriu (HTTP 403; CAPTCHA pelo proxy). **`[verify]`.** Registo de que uma pesquisa devolveu, em **paráfrase**, que o sítio se apresenta como «a segunda força política de Portugal»: não foi lido na página e não se cita como tal.

**Iniciativa Liberal** (`iniciativaliberal.pt`). **Sem frase de autodescrição** na página inicial. Menu de 4 entradas, o mais curto dos partidos: Pessoas, Ideias, Partido, Doar. Em «Ideias», os documentos têm títulos-slogan: «Habitação Já», «Habitação Agora», «Sua Saúde», «Levantar Portugal», «Por um Portugal com Futuro», «Crescimento Sustentável», «O caminho para a flexisegurança». **Nenhuma afirmação com número, nenhuma linha de fonte.** Rodapé: «© Iniciativa Liberal 2026 | Política de Privacidade | Política de Cookies», com o logótipo do ALDE Party.

**Bloco de Esquerda** (`bloco.org`). **Sem frase de autodescrição.** Menu: Participa, Conhece-nos, Notícias, Distritos e regiões, Contacta-nos (5). **Nenhuma afirmação com número.** Rodapé: «Membro da: [Aliança de Esquerda Europeia] | Política de cookies | Bloco de Esquerda 2025» (ano de 2025 numa leitura de setembro de 2026).

**PCP** (`pcp.pt`). **Sem frase de autodescrição** nem na página inicial nem em «Sobre o PCP». Menu: Sobre, Posições, Organizações, Internacional, Assembleia da República, Parlamento Europeu (6). **Nenhuma afirmação com número.** Rodapé com sede e contactos: «(Sede) R. Soeiro Pereira Gomes, nº 3, 1600 - 196, Lisboa | Tel.: 217813800 | Email: pcp@pcp.pt». Texto de interface: «Procurar».

**Livre** (`partidolivre.pt`). Autodescrição: «Uma iniciativa política de pessoas livres, unidas pelos ideais da esquerda e pela prática democrática». Menu: LIVRE, Parlamento, Autarquias, Jornal Lê, Comunicados e Notícias, Eventos, Contactos, Participar (8). O programa vive em subdomínio próprio, `programa.partidolivre.pt`, com o título «Programa do LIVRE às Eleições Legislativas de 2025» e cerca de 22 secções temáticas. **Nenhuma afirmação com número, nenhuma linha de fonte.** Duas coisas dignas de registo: os botões «Ouvir o Programa» e «Descarregar o Programa» (**o programa é lido em voz alta**), e o rodapé, que é o único licenciado em aberto de todos os partidos: «Creative Commons Attribution-ShareAlike 4.0 International License. 2026 LIVRE». Há também um resto de andaime visível na página: «This is a boxed content block. Click the edit button to edit this text.»

---

## 4. O que estes sítios fazem e o nosso não

Cada ponto cita a origem. Onde digo «o nosso», refiro-me ao que o diretor disse hoje ao ler o sítio, e às regras da casa tal como estão escritas no `CLAUDE.md` do projeto: não abri o sítio, e não o avalio.

**1. Dizem quando o texto vai ser revisto, e não só quando os dados foram extraídos.** Eurostat: «Data extracted: November 2025» **e** «Planned article update: December 2026». ONS: «Release date: 15 September 2026» **e** «Next release: 20 October 2026». INE: uma das seis entradas do menu principal é «Calendário». Uma data de atualização diz que o passado foi tratado; uma data de próxima revisão é uma promessa sobre o futuro, e é o que faz um sítio parecer vivo.

**2. Ensinam o leitor a citá-los.** Só o ONS, e é uma secção fixa do boletim: «Cite this statistical bulletin», com a citação já montada, «Office for National Statistics (ONS), released 15 September 2026, ONS website, statistical bulletin, Labour market overview, UK: September 2026». Nenhum dos sítios portugueses o faz.

**3. Dão à fonte um formato que aguenta uma cadeia, e assinam o seu papel nela.** PORDATA: «Fontes/Entidades: DGO/MF | BdP | INE, PORDATA». O `|` separa produtores, a vírgula antecede quem compilou. E quando a fonte muda ao longo da série, isso cabe na mesma linha: «GEP/MTSSS (até 2009) | GEE/MEc (2010 a 2012) | GEP/MSESS, MTSSS (a partir de 2013), PORDATA».

**4. Dão ao número um código que se pode voltar a pedir.** Eurostat cita `ilc_lvho02` e `une_rt_m` na própria legenda. ONS convida a procurar por «a keyword(s) or **time series ID**». Isto é a diferença entre uma fonte que se lê e uma fonte que se verifica.

**5. Escrevem a definição do indicador como a pergunta do leitor.** PORDATA: «Quantos homens ou mulheres desempregados existem por cada 100 ativos?»; «Qual o ordenado médio, por mês, com horas extra, subsídios ou prémios, dos empregados, homens ou mulheres?». Isto não é legenda a mais: é a legenda a fazer o trabalho que a legenda deve fazer, em vez de repetir o título.

**6. Põem a régua ao lado do número local.** PORDATA Retratos: «Com um valor acima do valor nacional (124 habitantes por km²) e é o município português com a 4.ª maior densidade populacional»; «+659 novas casas do que no triénio 2018-2020». O número do município nunca vai sozinho.

**7. Fazem da propriedade e do governo uma secção, não uma linha de rodapé.** Guardian: quatro entradas na navegação institucional, e uma é «The Scott Trust», com o propósito escrito, «to secure the financial and editorial independence of the Guardian in perpetuity». CES: um menu de duas entradas, e uma é «Como observamos».

**8. Publicam uma política de IA que se data e prevê a exceção.** Institute for Government: «Generative AI tools are not used to draft any of the body text of Institute for Government outputs.»; «...we will disclose this use in the output in question.»; «This policy was last updated in March 2026.» O IFS tem o rótulo no rodapé, «Use of AI tools in our work». Em todo o levantamento português, o único rótulo de IA que encontrei é da FFMS e é sobre imagem: «Esta imagem foi expandida com recurso a IA.»

**9. Prestam contas do próprio trabalho com números datados.** IFS: «74 journal articles published by IFS authors in 2025», «614 citations of IFS research in UK Government and Parliamentary documents».

**10. Repetem a mesma coluna de geografia em vez de criar uma árvore nova.** PORDATA: «Portugal · Municípios · Europa» aparece igual sob «Estatísticas» e sob «Quadros Resumo». Três palavras, aprendidas uma vez.

---

## 5. O que o nosso faz e nenhum deles faz

Aqui tenho de ser exato sobre o que sei. Não li o sítio. O que segue são as **regras escritas da casa** (`CLAUDE.md` do projeto) postas ao lado do que estes quarenta e dois endereços mostraram, e o contraste é real e verificável na coluna dos outros.

**1. Cada número resolve numa linha de um livro-razão, e o portão falha se não resolver.** A regra da casa é «Cada número do sítio resolve numa linha do livro-razão, e os portões falham se não resolver: nunca se enfraquecem». **Nenhum dos sítios lidos mostra sinal de reconciliação automática entre o texto publicado e um registo de proveniência.** O que os melhores fazem é pôr a fonte à vista (Eurostat com `ilc_lvho02`; PORDATA com «Fontes/Entidades»), o que é disciplina de publicação, não um portão que recusa publicar. A diferença é entre mostrar a fonte e não conseguir publicar sem ela.

**2. Quem constrói não verifica o que construiu.** A regra da casa separa quem escreve, quem constrói, quem mede às cegas com código próprio numa cópia, e quem lê a frio com estragos plantados. **Nenhum destes sítios publica uma separação assim.** O mais próximo é o ONS, que separa o método numa secção com «Quality in official statistics» e «Revisions and Corrections», e o Full Fact, que verifica terceiros («encouraging corrections or retractions»), não a sua própria produção.

**3. O observatório assume-se como feito com inteligência artificial.** Dos quarenta e dois endereços, **um** tem política de IA legível (Institute for Government) e diz o contrário do nosso caso: «Generative AI tools are not used to draft any of the body text». **Um** rotula uma imagem (FFMS). **Um** declara a IA como ferramenta de verificação (Full Fact, «Full Fact AI»). **Nenhum se apresenta como um observatório cujo texto e cujas medições são produzidos por modelos, com os modelos nomeados.** Não há precedente para copiar: há um vazio, e quem o preencher primeiro define a forma.

**4. Os partidos são lidos ao lado das fontes oficiais.** Em sete partidos, uma afirmação com número e nenhuma com fonte. Nenhum dos observatórios ou institutos lidos põe o discurso partidário e o número oficial na mesma página. O Full Fact verifica afirmações públicas, mas é uma instituição de verificação, não um observatório de indicadores.

**Aviso.** Estes quatro pontos descrevem o que as regras da casa dizem, não o que o sítio publicado faz hoje. A verificação de que o sítio cumpre as suas próprias regras não é desta leitura e não foi feita aqui.

---

## 6. Os dez nomes em português

Duas colunas, porque são duas autoridades diferentes e às vezes discordam. **Marco a proveniência de cada célula**, porque o valor disto está inteiro na proveniência:

- **(pág.)** = lido na página do indicador hoje, com a linha «Fontes/Entidades» conferida;
- **(port.)** = lido na tabela de indicadores do portal do INE hoje;
- **(idx)** = título indexado por motor de busca, **não lido na página**, logo `[verify]`;
- **`[verify]`** = não confirmado hoje.

| # | Conceito | Nome na PORDATA | Nome no INE |
|---|----------|-----------------|-------------|
| 1 | Índice de preços da habitação | `[verify]` (não encontrei página de indicador com este nome na PORDATA) | **«Índice de preços da habitação»** (idx, `[verify]`); a sigla que o INE usa nos destaques é **IPHab** (idx, `[verify]`) |
| 2 | Taxa de sobrecarga das despesas em habitação | **«Taxa de sobrecarga das despesas em habitação (%)»** (idx, `[verify]`; o endereço dado pelo diretor confirma o nome no caminho: `.../pobreza/privacao-habitacional/taxa-de-sobrecarga-das-despesas-em-habitacao`) | `[verify]` |
| 3 | Licenças de construção de habitação | **«Edifícios licenciados para habitação familiar: total e por tipo de obra»** (pág.) · fonte: «Fontes/Entidades: INE, PORDATA» · atualizado 2026-07-17. Existe também «Edifícios licenciados: total e por tipo de obra» (idx) | `[verify]` |
| 4 | Dívida pública | **«Dívida pública: dívida das Administrações Públicas»** (pág.) e **«Administrações Públicas: dívida bruta em % do PIB»** (pág.) · fonte das duas: «Fontes/Entidades: DGO/MF \| BdP \| INE, PORDATA» | `[verify]` |
| 5 | Saldo das administrações públicas | **«Administrações Públicas: despesas, receitas e défice/excedente em % do PIB»** (pág.) · «Fontes/Entidades: INE, PORDATA» · atualizado 2026-03-27. Também «Défice ou excedente orçamental entre receitas e despesas públicas» (idx) | **«Saldo das Administrações Públicas»** (port.) · unidade «% do PIB» · período «1.º Trimestre de 2026» |
| 6 | Taxa de emprego | **«Taxa de emprego: total e por sexo (%)»** (pág.) · «Fontes/Entidades: INE, PORDATA» · atualizado 2026-03-12 · definição: «Qual a percentagem de homens ou mulheres entre os 16 e os 89 anos que trabalham?» | `[verify]` |
| 7 | Taxa de desemprego | **«Taxa de desemprego: total e por sexo (%)»** (pág.) · «Fontes/Entidades: INE, PORDATA» · atualizado 2026-03-13 · definição: «Quantos homens ou mulheres desempregados existem por cada 100 ativos?» | **«Taxa de desemprego (Série 2021)»** (port.) · unidade «%» · período «2.º Trimestre de 2026» |
| 8 | Ganho médio mensal | **«Ganho médio mensal dos trabalhadores por conta de outrem: total e por sexo»** (pág.) · fonte: «GEP/MTSSS (até 2009) \| GEE/MEc (2010 a 2012) \| GEP/MSESS, MTSSS (a partir de 2013), PORDATA» · atualizado 2026-01-05 | `[verify]`. Definição de glossário da PORDATA, lida hoje: «É o montante ilíquido (antes dos descontos) em dinheiro e/ou géneros pago regularmente a um trabalhador pelo tempo de trabalho efetuado» |
| 9 | Jovens que não estudam nem trabalham | **«Taxa de jovens não empregados que não estão em educação ou formação: total e por sexo»** (pág.) · fonte: «Fontes/Entidades: Eurostat \| Institutos Nacionais de Estatística, PORDATA» · atualizado 2026-03-13 | `[verify]` |
| 10 | Abandono precoce de educação e formação | **«Taxa de abandono escolar: total e por sexo»** (pág., título no topo) · «Fontes/Entidades: INE, PORDATA» · atualizado 2026-02-04 · definição: «Qual a percentagem de homens ou mulheres, entre os 18 e os 24 anos, que deixou de estudar sem completar o secundário?». **O endereço da mesma página diz outro nome**: «Taxa de abandono precoce de educação e formação: total e por sexo» (idx) | **«Taxa de abandono precoce de educação e formação»** (idx, `[verify]`; o endereço do indicador do INE é `indOcorrCod=0006268`) |

**Três avisos que valem mais do que a tabela.**

Primeiro: **a PORDATA usa dois nomes para a mesma coisa.** No topo da página está «Taxa de abandono escolar: total e por sexo»; no endereço e no índice está «Taxa de abandono precoce de educação e formação». São o mesmo indicador. Quem copiar o nome do título e quem copiar o nome do endereço vai escrever coisas diferentes.

Segundo: **o INE carrega a versão da série no nome**, «Taxa de desemprego (Série 2021)», e a PORDATA não. Se a casa adotar um nome sem a versão, perde a informação que impede uma comparação errada.

Terceiro: **quatro dos dez não foram confirmados numa página lida hoje**, e estão marcados. Não os preencho por plausibilidade. Fechar esta tabela exige abrir as páginas de indicador do INE, que hoje recusaram a ligação.

---

## 7. O que isto ensina a uma norma

Dez pontos, cada um ligado a quem o mostrou. Isto é matéria para uma decisão, não é a decisão.

**1. O nome do indicador é um campo, não uma frase escrita de novo em cada página.** A PORDATA prova o custo de não o ser: chama ao mesmo indicador «Taxa de abandono escolar» no título e «Taxa de abandono precoce de educação e formação» no endereço. E o INE prova o que se ganha em o tratar como campo com versão: «Taxa de desemprego (Série 2021)».

**2. A fonte tem forma fixa e aguenta uma cadeia.** O molde existe e está testado: «Fontes/Entidades: DGO/MF | BdP | INE, PORDATA», com o produtor à esquerda, quem compila à direita, e a troca de fonte ao longo do tempo dentro da mesma linha, «(até 2009)», «(2010 a 2012)», «(a partir de 2013)». Quem compila assina-se no fim. (PORDATA)

**3. Ao lado do número ficam quatro coisas e não mais: valor, unidade, período, fonte.** O INE separa «%» de «% do PIB» como campo. O Eurostat mete o código na legenda, «Source: Eurostat (ilc_lvho02)». Tudo o resto (descarga, metadados, método) fica atrás de um toque, com rótulos que dizem o que são: «Sobre estes dados», «Simbologia», «Mais opções e dados». (INE, Eurostat, PORDATA)

**4. Duas datas, não uma.** Quando os dados foram extraídos **e** quando a página vai ser revista. «Data extracted: November 2025» com «Planned article update: December 2026» (Eurostat); «Release date» com «Next release» (ONS). Uma casa que promete a segunda data promete estar viva.

**5. A legenda do gráfico é uma afirmação; a fonte é uma linha à parte.** ONS: a legenda diz «Employee measures show a mixed picture over the last year...» e a fonte, separada, nomeia cada inquérito e cada organismo. Público: a legenda é a afirmação, mas a linha de fonte não aparece, e é aí que a forma falha. Legenda e fonte são dois campos com duas funções, e juntá-los perde as duas.

**6. A definição escreve-se como a pergunta do leitor.** «Quantos homens ou mulheres desempregados existem por cada 100 ativos?» faz num fôlego o que uma nota metodológica não faz em cinco linhas. Isto responde diretamente ao «legendas a mais e sentido a menos»: o problema não é haver texto junto ao número, é o texto não responder a nenhuma pergunta. (PORDATA)

**7. O número local traz sempre a régua.** Valor nacional, posição no ranking, período anterior: «Com um valor acima do valor nacional (124 habitantes por km²) e é o município português com a 4.ª maior densidade populacional»; «+659 novas casas do que no triénio 2018-2020». Um número de município sem régua não é informação. (PORDATA Retratos)

**8. A geografia é uma coluna que se repete, não uma árvore que se inventa.** «Portugal · Municípios · Europa», igual sob «Estatísticas» e sob «Quadros Resumo». Três palavras aprendidas uma vez e válidas em todo o lado. Isto é o que faz uma estrutura aprender-se. Repare-se também no contrário: a PORDATA pôs o município noutro domínio, com outro menu e outra escrita, e por isso **a página de município não tem a mesma forma que a do país**. Ganhou-se legibilidade e perdeu-se a promessa de que o sítio é um só. As duas coisas são escolhas, e têm preço. (PORDATA)

**9. A página é uma gramática fixa, e a instituição é uma das secções.** ONS: as mesmas nove secções em todos os boletins, uma delas «Cite this statistical bulletin». CES: um menu de duas entradas e uma é «Como observamos». Guardian: quatro entradas institucionais e uma é a propriedade. Quem aprendeu uma página aprendeu todas, e quem quer saber quem fala encontra-o no mesmo sítio, sempre. O contrário do texto de instrução espalhado é uma forma previsível, não menos texto.

**10. O texto de interface é pouco, e o pouco que há carrega informação.** «Que dados procura?» é uma pergunta na língua do leitor (PORDATA). «Search for a keyword(s) or time series ID» ensina que existem identificadores de série (ONS). «Suggested keywords:» diz por onde começar (Bruegel). «Enter your question or keywords» convida a perguntar (Institute for Government). Nenhum deles diz «clique aqui». E o contra-exemplo está no Público, onde as frases de interface numa página de artigo são oito a dez e quase todas são de conta e de assinatura: é o que acontece quando o texto de interface deixa de servir o leitor e passa a servir o sítio.

**Uma nota final sobre a língua, que era a primeira queixa do diretor.** Não encontrei aqui nenhum modelo de português traduzido do inglês para copiar nem para evitar, porque os sítios portugueses lidos escrevem português próprio. O que encontrei foi outra coisa, e é mais útil: **as casas portuguesas que escrevem melhor escrevem em pergunta e em frase falada**. «Que dados procura?», «Quantos desempregados existem por cada 100 ativos?», «Foram 520 os portugueses que, em 2025, entraram no Canadá, segundo os dados do Citizenship and Immigration Canada». Nenhuma destas frases se podia ter escrito primeiro em inglês. E vale registar que o Público, o maior diário de referência, **escreve a sua própria ficha técnica em grafia pré Acordo**: numa casa que escreve em português, a grafia é uma decisão assumida e escrita, não um acidente de ferramenta.

---

## 8. O custo

| | |
|---|---|
| Pedidos `WebFetch` | 112 (destes, 9 através do proxy `r.jina.ai`) |
| Pesquisas `WebSearch` | 31 |
| Pedidos `curl` bem sucedidos | 0 (sem rede nesta sessão; ver §1) |
| Chamadas ao `Bash` | 9 (montagem, diagnóstico e extração de texto dos ficheiros em bruto) |
| Ficheiros em bruto reaproveitados | 17, captados às 16:58Z por uma corrida anterior |
| Endereços distintos pedidos | 42 na tabela, mais páginas de apoio |
| Endereços que não abriram | 6 sítios (Expresso, Guardian em direto, Banco de Portugal, Chega, destaques do INE, `opss.pt`) |
| Início | 2026-09-15T17:01:17Z |
| Fim | 2026-09-15T17:17:25Z |
| Duração | cerca de 16 minutos |
| Modelo | Claude Opus 5 (`claude-opus-5[1m]`), a trabalhar sozinho, sem subagentes |

**Nota sobre estas contagens.** Os números de pedidos foram contados **à mão**, bloco a bloco, sobre as chamadas desta sessão: não há contador automático, e por isso devem ler-se com uma margem de um ou dois, não como medição. As horas de início e fim **foram lidas** do relógio do sistema em UTC. As horas por sítio **não existem**, porque a ferramenta não as devolve, e não foram inventadas.
