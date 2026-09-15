# As cadeias mudadas ou retiradas · bloco P2 (15.09.2026)

*A tabela que o §1, item 8, do brief pede, e que a regra do dia manda enviar ao
diretor com as capturas: cada cadeia mudada ou retirada, nas duas edições, com a
razão. Escrita pelo construtor (Claude Opus 5) na worktree `cartao-2026-09-15`,
sobre `2ab86986`. Prosa em português, sem travessões.*

---

## 1 · O que entra

Sete chaves novas, onze linhas de inventário, todas declaradas em
`design/especime-v3/INVENTARIO-FRASES.md` com a razão de cada uma e com a entrada
deste bloco em `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`. As duas
chaves do recibo não pedem linha de inventário: a rota `linha` não está em
`ROTAS_DO_INVENTARIO`, e a razão está escrita no registo do bloco `corredor`.

| chave | antes | depois (pt) | depois (en) | razão |
| --- | --- | --- | --- | --- |
| `cartao.em` | (não existia; o cartão escrevia o rótulo `prov.referencia`, «Dados de» / «Data for») | em | in | item 1b. A preposição liga o valor ao período numa linha só («17,6 variação anual média, % em 2025»). O rótulo do campo é do recibo e continua lá |
| `cartao.uniaoEuropeia` | (não existia) | União Europeia | European Union | item 1d. O nome do agregado com que a régua compara o número. Rende-se em 23 cartões por edição, que são as medidas cujo agregado o motor selou; cinco não o têm porque o conjunto do Eurostat não traz valor no agregado naquele período |
| `estado.acima` | (não existia; o cartão da faixa dizia `estado.<fixador>.fora` ou `.dentro`, com «limiar» lá dentro) | acima do valor de referência | above the reference value | item 1d e item 5, pela decisão do diretor de 15.09 de manhã. **A mesma chave que o bloco P1 escreve** para as cadeias da primeira página |
| `estado.abaixo` | (não existia) | abaixo do valor de referência | below the reference value | idem |
| `estado.entre` | (não existia) | entre os valores de referência | between the reference values | idem, para as duas medidas do Procedimento que publicam uma banda: um valor lá dentro não está acima nem abaixo de nada |
| `areas.organica` | (não existia) | As áreas seguem a orgânica do Governo em funções, o XXV Governo Constitucional. | The areas follow the structure of the Government in office, the XXV Constitutional Government. | item 3. Dita uma vez no índice das áreas, com o diploma ao lado como porta, no lugar da linha do tipo em nove páginas |
| `livro.linha.proximaConferenciaK` | (não existia) | Próxima conferência | Next check | item 2 e a norma §2.5 («Duas datas, não uma»). Rende-se nos cinco recibos com entrada datada no calendário das fontes, nas duas edições |
| `livro.linha.nomeNoIneK` | (não existia) | Nome no INE | Name at Statistics Portugal | item 2 e a norma §1.5. O rótulo nomeia QUEM PUBLICA O NOME, e não «o nome oficial»: dois organismos portugueses publicam nomes diferentes para a mesma medida. Rende-se em 9 recibos por edição |
| `livro.linha.nomeNaPordataK` | (não existia) | Nome na PORDATA | Name at PORDATA | idem. Rende-se em 17 recibos por edição |
| (a contagem do índice do livro-razão) | 2916 afirmações · 330 de 2916 calculadas · 2767 de 2916 linhas de concelhos | 2975 afirmações · 330 de 2975 calculadas · 2767 de 2975 linhas de concelhos | 2975 claims · 330 of 2975 calculated · 2767 of 2975 municipality rows | não é uma cadeia nova nem uma cadeia mudada pela casa: é a contagem que o portão reconta a cada construção, e subiu porque as 59 linhas do enquadramento entraram no livro-razão. A linha do inventário carrega o texto inteiro, e por isso muda com ele |

## 2 · O que sai

| chave | texto (pt) | texto (en) | o que muda | razão |
| --- | --- | --- | --- | --- |
| `areas.tipo` | área do XXV Governo Constitucional | area of the XXV Constitutional Government | **retirada** da rendição. Estava debaixo do título das nove páginas de área, nas duas edições; passa a 0 | item 3, pela leitura do diretor de 15.09 de manhã: é uma explicação da estrutura e não conteúdo daquela página. A chave fica declarada em `strings.mjs` e a linha do inventário passa a `retirada` com a razão escrita |

## 3 · O que não muda de texto e muda de lugar

Nenhuma destas cadeias foi tocada: o que mudou foi **onde** elas se rendem. As
sete continuam `vivas` no inventário porque continuam a render-se, e é por isso
que nenhuma entra na tabela do §2.

| chave | texto (pt) | antes | depois | razão |
| --- | --- | --- | --- | --- |
| `prov.fonte` | Publicado por | no cartão de cada medida das nove páginas de área, e no recibo | só no recibo e nos índices do livro-razão | item 1. O recibo fica inteiro onde ele vive, e a marca da fonte é a porta para lá (a norma §2.1) |
| `prov.documento` | Documento | idem | idem | idem |
| `prov.lido` | Lido na fonte a | idem | idem | idem. É também um dos decalques proibidos à vista (o plano, §4) |
| `prov.referencia` | Dados de | idem | idem | idem. No cartão, o lugar dele é a preposição `cartao.em` |
| `livro.marcaAbre` | Ao pé de cada número, a marca da fonte: | em 319 rotas por edição (as nove áreas, o índice dos números e fontes, a lista dos concelhos do livro-razão e as 308 páginas de linhas de um concelho) | numa rota por edição (o índice do livro-razão, `/livro-razao`) | item 3. O que explica a estrutura diz-se uma vez, e não em cada página que a usa (regra 5 do plano). O Método explica a marca na secção «O selo» |
| `livro.marcaCheia` | fonte, excerto e data conferidos | idem | idem | idem |
| `livro.marcaPorConfirmar` | um campo por confirmar. | idem | idem | idem |

**Porque é que a legenda fica numa rota e não em zero.** A medida escrita no
brief é «a legenda a 0 fora do Método», e ela **não está cumprida à letra**: fica
uma rota por edição. Duas razões, as duas medidas e nenhuma delas de gosto.
Primeira: o Método **é um texto governado** (a §1.106 carimba o sha de
`src/data/metodo.mjs` e a `IDENTIDADE.md` §5 cita-o palavra por palavra), a
decisão 1 da emenda de 15.09 à §1.108 diz que ele continua a chamar «selo» à
marca e que a frase nova entra «quando ele for tocado a seguir, com a entrada
própria em `DECISIONS.md` e a emenda à constituição», e este bloco não tem essa
entrada. Segunda: `scripts/design-bundle.mjs` compõe o cartão «Selo e marcador»
do sistema de desenho lendo `p.marca-legenda` de `livro-razao/index.html`; com a
legenda em rota nenhuma, o `design:feixe` do `verify` fecha a construção, e o
sistema de desenho fica sem o espécime da coisa que documenta. A rota que fica é
a do índice do livro-razão, que é a página da proveniência, e a escolha cumpre a
regra 5 do plano («uma vez por sítio, não uma vez por página») mesmo não cumprindo
a letra do item.

## 4 · O que o cartão deixou de escrever, medido

A contagem é de **nós de texto à vista** (depois de tirar o que só um leitor de
ecrã ouve: `.vh` e `aria-hidden`), por cartão, na mesma cabeça antes e depois.

| família de página | edição | cartões | antes | depois, sem a régua | depois, com a régua |
| --- | --- | --- | --- | --- | --- |
| área da habitação | pt | 3 | 12,3 (13, 13, 11) | 8,3 (11, 9, 5) | **16,3** (19, 17, 13) |
| área da habitação | en | 3 | 12,3 (13, 13, 11) | 8,7 (11, 9, 6) | **16,7** (19, 17, 14) |
| área da economia | pt | 88 | 9,9 | 5,6 | **6,6** |
| área da economia | en | 88 | 10,0 | 5,1 | **6,2** |

**A coluna do meio é a construção das 19:30 UTC**, antes de as linhas do motor
chegarem: o cartão tinha perdido o recibo e ainda não tinha ganhado a régua. A
coluna da direita é a cabeça final. **O cartão da habitação acabou com mais nós de
texto do que começou (13 para 19), e o §5.1 da norma manda justificá-lo linha a
linha**, que é o que esta tabela faz: os sete nós que saíram são o recibo (a
chave, «Publicado por», o publicador, «Documento», o título do documento, «Lido na
fonte a», a data), e os treze que entraram são a frase do que a medida mede e a
resposta à pergunta do diretor («2024: 9,1 · União Europeia: 5,5 · acima do valor
de referência, 9 %»). Onde não há régua nem frase, que é a maior parte dos cartões
da página da economia, a contagem desceu de 9,9 para 6,6.

**A régua traz duas marcas da fonte a mais por cartão**, uma por cada linha que
ela cita, e não há alternativa: um número numa página deste sítio leva sempre a
porta para a linha dele. Como isso se lê é decisão do diretor, nas capturas.

O cartão que o diretor leu a 15.09 («Preços da habitação»), pedaço a pedaço:

* **antes:** `17,6` · `fonte` · `Preços da habitação` · `precos-da-habitacao-2025`
  · `variação anual média, %` · `Dados de` · `2025` · `Publicado por` ·
  `Eurostat` · `Documento` · `House price index, nominal - annual data` ·
  `Lido na fonte a` · `12.08.2026` (treze);
* **depois:** `Preços da habitação` · `17,6` · `fonte` ·
  `variação anual média, %` · `em` · `2025` · `O índice que mede a variação dos
  preços de transação das casas compradas pelas famílias.` · `2024` · `:` · `9,1`
  · `fonte` · `União Europeia` · `:` · `5,5` · `fonte` ·
  `acima do valor de referência` · `,` · `9` · `%` (dezanove nós, **cinco
  coisas**: o nome, a linha do valor com a marca da fonte, a frase, e a régua).

## 5 · As cadeias que este bloco não tocou, e ficam ditas

* **As palavras de estado por fixador** (`estado.comissao.fora`,
  `estado.comissao.dentro`, `estado.pacto.*`, `estado.conselho.*`,
  `estado.lei.*`, `estado.semLimiar`, `home.numeros.limiar`,
  `home.numeros.noLimiar`, `livro.limiarK`, `home.painel.abre`,
  `home.painel.tituloPais*`, `uniaoEuropeia.nomeFim`) continuam a dizer «limiar»
  nesta cabeça. **São a metade da troca que o bloco P1 faz**, no ramo
  `porta-2026-09-15`, e duplicá-las aqui era garantir um conflito de fusão entre
  dois lados com o mesmo texto. A medida do item 5 («limiar» a 0 no texto visível
  do `dist/` fora do Método) **não está cumprida nesta cabeça** e cumpre-se na
  fusão dos dois ramos; nos cartões deste bloco a palavra está a 0, e a régua
  nova mede-o (célula K7).
* **Os textos governados não foram tocados**, e os shas dizem-no: `metodo.mjs`
  `92b0fbdb…`, `sobre.mjs` `0507f5f3…`, `politica-ia.mjs` `821d62c2…`, os mesmos
  antes e depois (nenhum dos três aparece no `git status` do ramo).
* **Um documento que governa foi tocado, e fica dito com o sha antes e depois.**
  `design/observatorio/PLANO-fiabilidade-2026-09-02.md`, de `60f30422…` para
  `97d304b5…`: a linha da garantia G3 dizia «o painel semanal confere 32 linhas em
  2 916» como afirmação corrente sobre o livro-razão de hoje, e o denominador
  deixou de ser o de hoje quando as 59 linhas entraram. `check:registo` fechou a
  construção, que é o trabalho dele. A afirmação passa a estar datada, na forma da
  casa: **o valor não se reescreve em silêncio**, e por isso continua a dizer
  2 916, agora com «a 02.09.2026» ao lado.

---

## 6 · Os acertos de 15.09 à noite, e as cadeias que eles mexeram

O lugar de direção leu as capturas da cabeça `2dceb7b9` e mandou três acertos.

| chave | antes | depois (pt) | depois (en) | razão |
| --- | --- | --- | --- | --- |
| `livro.linha.enquadramentoK` | (não existia) | O enquadramento | The comparisons | acerto 2. O título da secção do recibo que lista as linhas da régua, cada uma com a sua porta. É o que paga a marca única do cartão: sem ela, os valores da régua ficavam sem porta nenhuma |
| `livro.linha.enquadramentoAnterior` | (não existia) | Período anterior | Previous period | acerto 2. O rótulo da linha do período anterior, nessa secção |
| `livro.linha.enquadramentoUe` | (não existia) | União Europeia | European Union | acerto 2. O rótulo da linha do agregado, nessa secção |
| a linha do estado do cartão | acima do valor de referência, 9% | acima do valor de referência (9%) | above the reference value (9%) | acerto 3. A vírgula punha uma pausa onde não há oração a seguir, e o que vem depois dela não é uma segunda coisa: é o valor de que a primeira fala. **Não é uma cadeia nova**: as três palavras não mudaram uma letra, mudou a pontuação que as liga ao algarismo, e por isso nenhuma linha do inventário muda |

As três chaves do recibo não pedem linha de inventário: a rota `linha` não está em
`ROTAS_DO_INVENTARIO`, pela mesma razão escrita no registo do bloco `corredor`.

**O acerto 1 não mexeu em cadeia nenhuma**: nenhum texto novo foi escrito, e o que
mudou foi qual dos textos que já existem encabeça o cartão. Os nomes que entraram
são campos do livro-razão (`name`, `document.title`) e nomes do ficheiro do motor,
todos conferidos carácter a carácter contra a sua origem, e nenhum deles é prosa
da casa.

## 7 · Os 81 cartões que ficaram com o nome que a fonte dá à medida

O acerto 1 diz que nenhum cartão fica sem nome, e diz também de onde vem o nome
enquanto não houver melhor: o da fonte, na língua dela e com a marca `lang`. Estes
são os 81, por edição, para o **bloco P3 lhes dar o nome do projeto**. A coluna do
degrau diz se o nome é o rótulo com que a fonte imprime a figura (`name`) ou o
título do documento de onde a linha foi lida (`document.title`).

| linha | degrau | o nome que o cartão mostra hoje |
| --- | --- | --- |
| `agua-nao-faturada-portugal-2024` | document.title | RASARP — Relatório Anual dos Serviços de Águas e Resíduos em |
| `alentejo-central-poder-de-compra-2023` | name | Poder de compra per capita por Localização geográfica (NUTS  |
| `criancas-em-creche-2025` | document.title | Children aged less than 3 years in formal childcare |
| `disparidade-de-emprego-entre-sexos-2025` | document.title | Gender employment gap |
| `evora-camara-lugares` | document.title | Autárquicas 2025 — resultados oficiais por território |
| `evora-camara-mandatos-cdu-2013` | document.title | Autárquicas 2013 — resultados oficiais por território |
| `evora-camara-mandatos-cdu-2017` | document.title | Autárquicas 2017 — resultados oficiais por território |
| `evora-camara-mandatos-cdu-2021` | document.title | Autárquicas 2021 — resultados oficiais por território |
| `evora-camara-mandatos-ps-2009` | document.title | Autárquicas 2009 — resultados oficiais por território |
| `evora-camara-mandatos-ps-2025` | document.title | Autárquicas 2025 — resultados oficiais por território |
| `evora-concentracao-vab4-2024` | name | Indicador de concentração do valor acrescentado bruto das qu |
| `evora-contas-2024-votos-contra` | document.title | Certificação Legal das Contas |
| `evora-contas-2024-votos-favor` | document.title | Certificação Legal das Contas |
| `evora-desemprego-registado-2013` | document.title | SIE - Desemprego registado por concelhos |
| `evora-desemprego-registado-2024` | document.title | SIE - Desemprego registado por concelhos |
| `evora-despesa-paga-2025` | document.title | Prestação de Contas 2025 |
| `evora-divida-31-10-2013` | document.title | Relatório de Gestão 2015 |
| `evora-divida-dgal-2014` | document.title | Evolução endividamento total |
| `evora-divida-dgal-2017` | document.title | Evolução endividamento total |
| `evora-divida-dgal-2021` | document.title | Evolução endividamento total |
| `evora-divida-dgal-2024` | document.title | Evolução endividamento total |
| `evora-divida-inicio-mandato-reexpressa` | name | Dívida Total no Início do Mandato |
| `evora-divida-total-2017` | name | DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS = (1) + (2) |
| `evora-divida-total-2021` | name | DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS = (1) + (2) |
| `evora-divida-total-2024` | document.title | Prestação de Contas 2025 |
| `evora-divida-total-2025` | name | DÍVIDA TOTAL DE OPERAÇÕES ORÇAMENTAIS = (1) + (2) |
| `evora-excesso-endividamento-2014` | document.title | Relatório de Gestão 2021 |
| `evora-excesso-endividamento-2019` | document.title | Relatório de Gestão 2021 |
| `evora-execucao-da-receita-2021` | document.title | Prestação de Contas 2025 |
| `evora-execucao-da-receita-2025` | document.title | Prestação de Contas 2025 |
| `evora-executivo-2025-ad` | document.title | Autárquicas 2025 — resultados oficiais por território |
| `evora-executivo-2025-cdu` | document.title | Autárquicas 2025 — resultados oficiais por território |
| `evora-executivo-2025-chega` | document.title | Autárquicas 2025 — resultados oficiais por território |
| `evora-executivo-2025-ps` | document.title | Autárquicas 2025 — resultados oficiais por território |
| `evora-limite-divida-2025` | name | LIMITE = Média dos Últimos 3 Exercícios * 1,5 |
| `evora-limite-divida-dgal-2014` | document.title | Evolução endividamento total |
| `evora-limite-divida-dgal-2017` | document.title | Evolução endividamento total |
| `evora-limite-divida-dgal-2021` | document.title | Evolução endividamento total |
| `evora-limite-divida-dgal-2024` | document.title | Evolução endividamento total |
| `evora-margem-endividamento-2025` | document.title | Prestação de Contas 2025 |
| `evora-orcamento-2025` | document.title | Prestação de Contas 2025 |
| `evora-pael-emprestimo` | document.title | Relatório de Gestão 2016 |
| `evora-pagamentos-em-atraso-2025` | document.title | Prestação de Contas 2025 |
| `evora-pelouros-2021-presidente` | document.title | Executivo — Câmara Municipal de Évora |
| `evora-pelouros-2021-vice-presidente` | document.title | Executivo — Câmara Municipal de Évora |
| `evora-pelouros-2025-presidente` | document.title | Executivo — Câmara Municipal de Évora |
| `evora-pelouros-2025-vereadora` | document.title | Executivo — Câmara Municipal de Évora |
| `evora-pelouros-2025-vice-presidente` | document.title | Executivo — Câmara Municipal de Évora |
| `evora-poder-de-compra-2023` | name | Poder de compra per capita por Localização geográfica (NUTS  |
| `evora-prazo-medio-de-pagamento-2023` | document.title | Prestação de Contas 2025 |
| `evora-prazo-medio-de-pagamento-2025` | document.title | Prestação de Contas 2025 |
| `evora-prr-aprovado-2026` | document.title | Listagem de entidades PRR |
| `evora-prr-municipio-contratado` | document.title | Listagem de entidades PRR |
| `evora-prr-pago-2026` | document.title | Listagem de entidades PRR |
| `evora-prr-universidade-contratado` | document.title | Listagem de entidades PRR |
| `evora-prr-vencido-aprovado-2026` | document.title | Listagem de entidades PRR |
| `evora-receita-cobrada-2025` | document.title | Prestação de Contas 2025 |
| `evora-saneamento-financeiro-2016` | document.title | Relatório de Gestão 2016 |
| `evora-vab-empresarial-2024` | name | Valor acrescentado bruto (€) das Empresas por Localização ge |
| `factor-sustentabilidade-2026` | document.title | Reformar as Pensões em Portugal: Por um Sistema Sustentável, |
| `licencas-de-construcao-2025` | document.title | Residential building permits - annual data |
| `municipios-acores-caop-2025` | document.title | Carta Administrativa Oficial de Portugal (CAOP) |
| `municipios-continente-caop-2025` | document.title | Carta Administrativa Oficial de Portugal (CAOP) |
| `municipios-madeira-caop-2025` | document.title | Carta Administrativa Oficial de Portugal (CAOP) |
| `municipios-portugal-caop-2025` | document.title | Carta Administrativa Oficial de Portugal (CAOP) |
| `penalizacao-antecipacao-um-ano-com-factor-2026` | document.title | Reformar as Pensões em Portugal: Por um Sistema Sustentável, |
| `penalizacao-antecipacao-um-ano-neutra` | document.title | Reformar as Pensões em Portugal: Por um Sistema Sustentável, |
| `penalizacao-antecipacao-um-ano-sem-factor-2026` | document.title | Reformar as Pensões em Portugal: Por um Sistema Sustentável, |
| `pib-pc-acores-2024` | name | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-alentejo-2000` | document.title | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-alentejo-2024` | document.title | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-algarve-2024` | document.title | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-centro-2024` | name | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-grande-lisboa-2024` | document.title | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-madeira-2024` | document.title | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-norte-2024` | name | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-oeste-e-vale-do-tejo-2024` | name | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-peninsula-de-setubal-2024` | document.title | Gross domestic product (GDP) at current market prices by NUT |
| `pib-pc-portugal-2024` | document.title | Gross domestic product (GDP) at current market prices by NUT |
| `portugal-concentracao-vab4-2024` | name | Indicador de concentração do valor acrescentado bruto das qu |
| `retribuicao-minima-mensal-doze-meses-2026` | name | Monthly minimum wages - bi-annual data |

## 8 · Os 24 que continuam sem nome, e porquê

Não há nome nenhum para lhes dar: são as linhas DERIVADAS, que não têm fonte nem
documento porque a proveniência delas é a das origens, e as quatro cujo único
título de documento é o próprio marcador. O bloco P3 tem de lhes dar um nome do
projeto, ou deixá-las sem ele com a razão escrita.

`avisos-pt2030-abertos`, `avisos-pt2030-pessoas-singulares`, `ciclo-substituicao-condutas`, `distancia-acores-ue27-2024`, `distancia-alentejo-ue27-2000`, `distancia-alentejo-ue27-2024`, `distancia-algarve-ue27-2024`, `distancia-centro-ue27-2024`, `distancia-grande-lisboa-ue27-2024`, `distancia-madeira-ue27-2024`, `distancia-norte-ue27-2024`, `distancia-oeste-e-vale-do-tejo-ue27-2024`, `distancia-peninsula-de-setubal-ue27-2024`, `distancia-portugal-ue27-2024`, `distancia-setubal-grande-lisboa-2024`, `evora-divergencia-municipio-dgal-2024`, `evora-indice-de-divida-2014`, `evora-indice-de-divida-2017`, `evora-indice-de-divida-2021`, `evora-indice-de-divida-2024`, `evora-pelouros-2021-total`, `evora-pelouros-2025-total`, `evora-prr-execucao-2026`, `evora-prr-vencido-quota-2026`
