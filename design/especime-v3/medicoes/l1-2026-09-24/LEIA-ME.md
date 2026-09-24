# L1 · a leitura de cada medida · o relatório do construtor

*Claude Opus 5.5 (a definição `construtor`), 24.09.2026. Ramo `l1-2026-09-24` do sítio, sobre `f672bd38`, com o brief em `f0779f37`; ramo `l1-2026-09-24` do motor, sobre `0f08171`. Os portões inteiros (`npm run build`, `npm run verify` e `npm run typecheck`) correram na cabeça `d831b453` (`cabeca_medida`), e o commit que entrega estas provas vem a seguir a ela e só acrescenta ficheiros desta pasta. As capturas do antes são da cabeça `f0779f37` (`paginas_antes_construidas_de`), a de partida, e as do depois são da cabeça dos portões (`capturas_depois_de`). Cada número deste relatório sai de `medidas.json`, escrito por `medir-l1.py`, e o nome da medição vai ao lado dele; `conferir-relatorio.py` confere-os.*

## O que ficou feito

Por baixo do número de cada cartão nacional há agora uma leitura em palavras correntes: o que o número quer dizer, como se compara com o período anterior e com a média da União onde a régua tem essas linhas, e de que lado do valor de referência está onde ele existe. A página do país rende 20 (`leituras_pais_pt_depois`) leituras na edição portuguesa e 20 (`leituras_pais_en_depois`) na inglesa, e a dos temas 36 (`leituras_temas_pt_depois`) e 36 (`leituras_temas_en_depois`); nenhum cartão fica sem leitura (`cartoes_sem_leitura_<página>_<edição>_depois`, como a dos temas em inglês: 0 (`cartoes_sem_leitura_temas_en_depois`)), nenhum tem mais de uma (`cartoes_com_mais_de_uma_leitura_<página>_<edição>_depois`), e antes do bloco não havia nenhuma: 0 (`leituras_pais_pt_antes`) na página do país em português, e o mesmo nas outras (`leituras_<página>_<edição>_antes`). As palavras são as do lugar de direção, com 17 (`acertos`) acertos em 45 (`acertos_trocas`) trocas, todos abaixo; os números e os ramos são da máquina.

## O mandato, item a item

| # | o que | a medida | estado |
|---|---|---|---|
| 0 | O mapa do repositório | as citações conferidas à volta da linha citada: 77 (`mapa_citacoes_conferidas`); longe da linha: 0 (`mapa_citacoes_longe`); não encontradas: 0 (`mapa_citacoes_nao_encontradas`). A secção nova «A leitura de cada medida», a K17, a leitura na V2 e no `auditaSelo()`, a célula 10 do `check:voz` e três armadilhas | feito |
| 1 | A declaração e o resolvedor | as leituras declaradas: 37 (`leituras_declaradas`), tantas quantas a tabela das medidas do país obriga, com o cartão das câmaras (`medidasComLeitura()`); a construção fecha sem uma (a planta «a declaração retirada fecha o resolvedor», abaixo) | feito |
| 2 | A leitura no cartão | as marcas da fonte dentro das leituras: 0 (`marcas_da_fonte_nas_leituras_pais_pt`) na página do país e 0 (`marcas_da_fonte_nas_leituras_temas_pt`) na dos temas (o mesmo nas edições inglesas); as plantas do `auditaSelo()` a morder: 3 (`plantas_portoes_l1_do_audita_selo_que_morderam`) de 3 (`plantas_portoes_l1_do_audita_selo`) | feito |
| 3 | A folha | as medições de leitura nas capturas do depois: 560 (`capturas_depois_com_leitura`); a 14 px: 560 (`capturas_depois_a_14px`); na tinta: 560 (`capturas_depois_na_tinta`); a 58ch: 560 (`capturas_depois_a_58ch`); com a medida da pergunta, onde há pergunta: 270 (`capturas_depois_com_a_medida_da_pergunta`) de 270 (`capturas_depois_com_pergunta`); cartões que transbordam: 0 (`capturas_depois_cartoes_que_transbordam`); páginas que transbordam a 390 px: 0 (`capturas_depois_paginas_que_transbordam_a_390`) | feito |
| 4 | A auditoria das origens | as medidas auditadas: 37 (`k17_auditoria_medidas`); as folhas: 791 (`k17_auditoria_folhas`); as partes: 923 (`k17_auditoria_partes`) (231 (`k17_auditoria_diz`) dizem o que a medida é, 242 (`k17_auditoria_conta`) são contas, 450 (`k17_auditoria_liga`) ligam); os apoios: 325 (`k17_auditoria_apoios`); as origens usadas: 71 (`k17_auditoria_origens_das_leituras`); os erros: 0 (`k17_erros_da_auditoria`). As origens novas: 44 (`origens_novas`), conferidas contra o motor 44 (`origens_conferidas`) | feito |
| 5 | A leitura rendida | os cartões conferidos na página do país e na dos temas, nas duas edições: 112 (`k17_paginas_cartoes`), em 4 (`k17_paginas_paginas`) páginas; os ramos recontados: 236 (`k17_paginas_ramos`); os erros: 0 (`k17_erros_nas_paginas`); as plantas da K17 a morder: 12 (`k17_plantas`) | feito |
| 6 | As idades e os algarismos | os algarismos declarados das leituras, conferidos um a um: 22 (`algarismos_das_leituras_contados`) (a lista inteira em `algarismos_das_leituras`, com o literal de cada um) | feito, com um ponto parado: ver «O que fica por fazer» |
| 7 | A voz | as linhas novas do inventário: 40 (`inventario_linhas_l1`), das quais 20 (`inventario_linhas_l1_inglesas`) inglesas; as exceções da lista dos marcadores que nomeiam o bloco: 3 (`excecoes_da_voz_com_o_l1`); «limiar» nas leituras: 0 (`palavra_limiar_nas_leituras_pais_pt`) na página do país em português (e o mesmo nas outras páginas e edições, com «threshold» nas inglesas); leituras que falam do projeto ou da página: 0 (`leituras_que_falam_do_projeto_pais_pt`); o `check:voz`, o `check:palavras` e o `check:lingua` correm dentro da verificação, ligados por `&&`, e a verificação só sai com 0 com os três a 0 (abaixo) | feito |
| 8 | As capturas, o relatório, as cópias | as capturas de página do depois: 20 (`capturas_depois_paginas`); os recortes dos cartões do diretor (o saldo e a disparidade salarial, a 390 e a 1 280 px): 8 (`capturas_depois_recortes`); as mesmas do antes: 20 (`capturas_antes_paginas`) e 8 (`capturas_antes_recortes`); as falhas de aceitação: 0 (`capturas_depois_falhas`); as cópias congeladas das quatro páginas do depois em `paginas-depois/`, presas por sha256 (`paginas_depois_sha256`) | feito |

## Os portões

Corridos por `correr-portao-l1.py`, um de cada vez, cada um no seu comando, com o `.codigo` apagado antes e escrito do código do próprio processo:

- `npm run build`: código 0 (`portao_build.codigo`), em 300,1 (`portao_build.segundos`) segundos;
- `npm run verify`: código 0 (`portao_verify.codigo`), em 491,0 (`portao_verify.segundos`) segundos;
- `npm run typecheck`: código 0 (`portao_typecheck.codigo`), em 0,2 (`portao_typecheck.segundos`) segundos.

Todos na mesma cabeça (`portoes_na_mesma_cabeca`). O verificador de tipos é rápido nesta máquina, e por isso se mediu que ele vê: um ficheiro de fora da árvore com um erro de tipo plantado, posto no mesmo programa, é apontado (`typecheck_ve_um_erro_plantado`). O registo de cada corrida está em `portoes/`, com a raiz da árvore trocada por «./» (`portao_build` diz quantas vezes, e o sha256 do registo antes e depois).

## Os acertos de palavras às leituras

O ficheiro do sítio é a cópia do do lugar de direção com estas trocas e comentários, e mais nada: `acertos-l1.py` aplica-as à cópia, tira os comentários de bloco aos dois ficheiros e exige que fiquem iguais: a conferência sai com 0 (`acertos_confere_codigo`), e a mesma conferência sobre uma cópia com uma palavra a mais sai com 1 (o conhecido-positivo da mesma medição). A1 a A15 foram pedidos pela auditoria das origens; A16 e A17 pelo portão da voz, com a palavra do literal.

**A1**, `pib-real-per-capita-2025`. A descrição do Eurostat diz «real gross domestic product» e não diz como o valor real se calcula; a oração sobre os preços de um ano fixo não estava em origem nenhuma lida. Apoio: «real gross domestic product» (`eurostat-tipsna40-descricao`, campo `excerto`).

- antes: `por habitante, medido a preços de um ano fixo para se poder comparar entre anos.'`
- depois: `por habitante, em termos reais.'`
- antes: `per inhabitant, measured at the prices of a fixed year so that years can be compared.'`
- depois: `per inhabitant, in real terms.'`

**A2**, `saldo-das-administracoes-publicas-2025`. O subsetor chama-se «Administração Local» no INE; «as autarquias» nomeia-o em palavras correntes, e «as câmaras» é o nome de um órgão, não do subsetor. Apoio: «Administração Local» (`ine-pde-subsetores`, campo `excerto`).

- antes: `(o Estado, as regiões autónomas, as câmaras e a segurança social)` (3 vezes, `acertos-l1.json`)
- depois: `(o Estado, as regiões autónomas, as autarquias e a segurança social)`
- antes: `(the State, the autonomous regions, the municipalities and social security)` (3 vezes, `acertos-l1.json`)
- depois: `(the State, the autonomous regions, local authorities and social security)`

**A3**, `crescimento-da-despesa-liquida-2025`. Nenhuma origem lida diz que o Governo controla esta despesa: o que o CFP apura é o crescimento da despesa líquida. O compromisso é «assumido por Portugal e endossado pelo Conselho da UE», e não um compromisso com o Conselho; e o valor de referência é o do ano do cartão, numa trajetória, e não um teto igual todos os anos. Apoio: «crescimento da despesa líquida» (`propria`, campo `excerpt`); «compromisso assumido por Portugal e endossado pelo Conselho da UE» (`cfp-compromisso`, campo `excerto`); «comprometeu-se com uma determinada trajetória de crescimento da despesa líquida» (`cfp-trajetoria`, campo `excerto`); «a taxa de crescimento de 5% recomendada» (`propria`, campo `excerpt`).

- antes: `'É quanto cresceu num ano a despesa pública que o Governo controla: a despesa líquida, que não conta os juros da dívida,`
- depois: `'É quanto cresceu num ano a despesa pública líquida: a que não conta os juros da dívida,`
- antes: `'It is how much the public spending the Government controls grew in a year: net expenditure, which leaves out interest on the debt,`
- depois: `'It is how much net public expenditure grew in a year: the expenditure that leaves out interest on the debt,`
- antes: `' Portugal comprometeu-se com o Conselho da União Europeia a não a deixar crescer mais de ', { referencia: 'unico' }, ' % por ano: em ', { periodo: 'proprio' }, ' ', { estado:`
- depois: `' Portugal comprometeu-se, num compromisso endossado pelo Conselho da União Europeia, a não a deixar crescer mais de ', { referencia: 'unico' }, ' % em ', { periodo: 'proprio' }, ': ', { estado:`
- antes: `' Portugal committed to the Council of the European Union not to let it grow by more than ', { referencia: 'unico' }, ' % a year: in ', { periodo: 'proprio' }, ' it ', { estado:`
- depois: `' Portugal committed, in a commitment endorsed by the Council of the European Union, not to let it grow by more than ', { referencia: 'unico' }, ' % in ', { periodo: 'proprio' }, ': it ', { estado:`

**A4**, `posicao-de-investimento-internacional-2025`. O Banco de Portugal escreve «responsabilidade» perante o exterior («net external liability» na edição inglesa), e não dívida; a frase passa a usar a palavra dele. Apoio: «representando uma responsabilidade perante o exterior» (`bdp-pii-sinal`, campo `excerto`); «there is a net external liability» (`bdp-pii-sinal`, campo `excertoEn`).

- antes: `'A dívida líquida ao exterior encolheu face a'`
- depois: `'A responsabilidade líquida perante o exterior encolheu face a'`
- antes: `'A dívida líquida ao exterior cresceu face a'`
- depois: `'A responsabilidade líquida perante o exterior cresceu face a'`
- antes: `'A dívida líquida ao exterior ficou igual à de'`
- depois: `'A responsabilidade líquida perante o exterior ficou igual à de'`
- antes: `'The net debt to the rest of the world shrank from'`
- depois: `'The net external liability shrank from'`
- antes: `'The net debt to the rest of the world grew from'`
- depois: `'The net external liability grew from'`
- antes: `'The net debt to the rest of the world was unchanged from'`
- depois: `'The net external liability was unchanged from'`

**A5**, `taxa-de-cambio-efectiva-real-2025`. Nenhuma origem lida diz que uma subida quer dizer perda de competitividade: a descrição do Eurostat e o glossário da taxa de câmbio (para onde o endereço do glossário da taxa de câmbio efetiva real redireciona) falam da competitividade de preços sem dizer o sentido de uma subida, os outros dois endereços de glossário procurados responderam 404, e a página do BCE dos indicadores harmonizados de competitividade também não o diz. A oração sai. Apoio: «price or cost competitiveness relative to its principal competitors» (`eurostat-tipser10-descricao`, campo `excerto`).

- antes: `em três anos: quando sobe, o país perde competitividade; quando desce, ganha.'`
- depois: `em três anos.'`
- antes: `over three years: when it rises, the country loses competitiveness; when it falls, it gains.'`
- depois: `over three years.'`

**A6**, `divida-das-empresas-2025`. A descrição do Eurostat conta os títulos de dívida e os empréstimos («Debt securities (F.3) and Loans (F.4)»), e não tudo o que as empresas devem. Apoio: «Debt securities (F.3) and Loans (F.4)» (`eurostat-tipspd30-descricao`, campo `excerto`).

- antes: `'É tudo o que as empresas devem, fora as financeiras, '`
- depois: `'É o que as empresas devem em empréstimos e títulos de dívida, fora as financeiras, '`
- antes: `'It is everything companies owe, excluding financial companies, '`
- depois: `'It is what companies owe in loans and debt securities, excluding financial companies, '`

**A7**, `divida-das-familias-2025`. O setor é o das famílias e das instituições sem fim lucrativo ao seu serviço, e a dívida é a de títulos e empréstimos. Apoio: «the stock of liabilities held by the sector Households and Non-Profit institutions serving households» (`eurostat-tipspd22-descricao`, campo `excerto`); «Debt securities (F.3) and Loans (F.4)» (`eurostat-tipspd22-descricao`, campo `excerto`).

- antes: `'É tudo o que as famílias devem, '`
- depois: `'É o que as famílias e as instituições sem fim lucrativo ao seu serviço devem em empréstimos e títulos de dívida, '`
- antes: `'It is everything households owe, '`
- depois: `'It is what households and non-profit institutions serving them owe in loans and debt securities, '`

**A8**, `fluxo-de-credito-as-empresas-2025`. O Eurostat mede o montante líquido dos passivos contraídos no ano, e não o crédito novo recebido. Apoio: «the net amount of liabilities incurred during the year» (`eurostat-tipspc30-descricao`, campo `excerto`).

- antes: `'É quanto crédito novo as empresas receberam num ano, fora as financeiras`
- depois: `'É quanto crédito as empresas contraíram num ano, em termos líquidos, fora as financeiras`
- antes: `'It is how much new credit companies received in a year, excluding financial companies`
- depois: `'It is how much credit companies took on in a year, net, excluding financial companies`

**A9**, `fluxo-de-credito-as-familias-2025`. O Eurostat mede o montante líquido dos passivos contraídos no ano pelas famílias e pelas instituições sem fim lucrativo ao seu serviço, e não o crédito novo recebido pelas famílias. Apoio: «the net amount of liabilities which the sectors Households and Non-Profit institutions serving households (S.14_S.15) have incurred during the year» (`eurostat-tipspc40-descricao`, campo `excerto`).

- antes: `'É quanto crédito novo as famílias receberam num ano, em percentagem`
- depois: `'É quanto crédito as famílias e as instituições sem fim lucrativo ao seu serviço contraíram num ano, em termos líquidos, em percentagem`
- antes: `'It is how much new credit households received in a year, as a percentage`
- depois: `'It is how much credit households and non-profit institutions serving them took on in a year, net, as a percentage`

**A10**, `ganho-medio-mensal-2024`. A nota do INE diz «trabalhadores por conta de outrem a tempo completo», e o conceito de ganho é o montante ilíquido pago com caráter regular pelo período normal e extraordinário; a lista de rubricas da frase anterior não estava no literal. Apoio: «trabalhadores por conta de outrem a tempo completo» (`ine-ganho-nota`, campo `excerto`); «pago ao trabalhador com caráter regular» (`ine-ganho-conceito`, campo `excerto`); «no período normal e extraordinário» (`ine-ganho-conceito`, campo `excerto`); «Montante ilíquido» (`ine-ganho-conceito`, campo `excerto`).

- antes: `'É o que um trabalhador por conta de outrem ganhou por mês, em média, em '`
- depois: `'É o que um trabalhador por conta de outrem a tempo completo ganhou por mês, em média, em '`
- antes: `', com o salário base, as horas extraordinárias e os subsídios regulares, antes de descontos.'`
- depois: `', com o que lhe é pago com caráter regular pelas horas normais e extraordinárias, antes de descontos.'`
- antes: `'It is what an employee earned per month, on average, in '`
- depois: `'It is what a full-time employee earned per month, on average, in '`
- antes: `', including base pay, overtime and regular allowances, before deductions.'`
- depois: `', including what is paid on a regular basis for normal and overtime hours, before deductions.'`

**A11**, `disparidade-salarial-entre-sexos-2024`. A cobertura do Eurostat é a das empresas com «10 employees or more» (trabalhadores, e não pessoas ao serviço). E a primeira frase só é verdadeira com o valor positivo: passa a ramo `sinal.positivo`, sem mudar palavra, e um valor de outro sinal fecha a construção em vez de a deixar sair falsa. Apoio: «10 employees or more» (`eurostat-earn-grgpg2-cobertura`, campo `excerto`); «the difference between average gross hourly earnings of male paid employees and of female paid employees» (`eurostat-earn-grgpg2-definicao`, campo `excerto`).

- antes: `' ou mais pessoas ao serviço.', DIFERENCA, DIFERENCA_UE]`
- depois: `' ou mais trabalhadores.'] } }, DIFERENCA, DIFERENCA_UE]`
- antes: `pt: ['Por cada hora de trabalho,`
- depois: `pt: [{ sinal: { positivo: ['Por cada hora de trabalho,`
- antes: `' or more employees.', GAP, GAP_EU]`
- depois: `' or more employees.'] } }, GAP, GAP_EU]`
- antes: `en: ['Per hour worked,`
- depois: `en: [{ sinal: { positivo: ['Per hour worked,`

**A12**, `criancas-em-creche-2025`. O Eurostat põe a ama profissional nos outros tipos de cuidado, e não no cuidado formal («Other types of childcare may include care that is provided by a professional child-minder»); o exemplo sai. Apoio: «Formal childcare is a formal education programme that is institutionalized, intentional and planned through public organizations and recognized private bodies» (`eurostat-cuidado-formal`, campo `excerto`).

- antes: `' anos que está numa creche ou noutro cuidado formal, como uma ama profissional.'`
- depois: `' anos que está numa creche ou noutro cuidado formal.'`
- antes: `' who are in a nursery or other formal childcare, such as a professional child-minder.'`
- depois: `' who are in a nursery or other formal childcare.'`

**A13**, `sobrecarga-do-custo-da-habitacao-2025`. O regime do Eurostat é «Tenant, rent at reduced price or free» (a renda gratuita conta), e a Comissão escreve que a taxa «should be read together with the tenure structure», e não que manda lê-la por regime. Apoio: «"OWN_L":"Owner, with mortgage or loan","OWN_NL":"Owner, no outstanding mortgage or housing loan","RENT_MKT":"Tenant, rent at market price","RENT_FR":"Tenant, rent at reduced price or free"» (`eurostat-tessi164-regimes`, campo `excerto`); «The overburden rate should be read together with the tenure structure (homeowner, tenants), that may differ across country and regions.» (`ce-swd-2026-222-habitacao`, campo `excerto`).

- antes: `arrendada a preço de mercado ou a renda reduzida)`
- depois: `arrendada a preço de mercado ou a renda reduzida ou gratuita)`
- antes: `rented at market price or at a reduced rent)`
- depois: `rented at market price or at a reduced rent or free)`
- antes: `' Este total mistura situações muito diferentes, e a Comissão Europeia manda lê-lo por regime de ocupação.'`
- depois: `' Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.'`
- antes: `' This total mixes very different situations, and the European Commission says it should be read by tenure status.'`
- depois: `' This total mixes very different situations, and the European Commission says it should be read together with the tenure structure.'`

**A14**, `competencias-digitais-2025`. O Eurostat escreve «activities related to internet or software use»: as competências contam o uso de programas, e não só a internet. Apoio: «activities related to internet or software use» (`eurostat-tepsr_sp410-descricao`, campo `excerto`).

- antes: `proteger-se e resolver problemas na internet.'`
- depois: `proteger-se e resolver problemas no uso da internet e de programas informáticos.'`
- antes: `stay safe and solve problems online.'`
- depois: `stay safe and solve problems when using the internet or software.'`

**A15**, `formacao-bruta-de-capital-fixo-2025`. O glossário do Eurostat define a formação bruta de capital fixo pelas aquisições dos produtores residentes, descontadas as cessões; nenhuma origem lida lhe chama o investimento feito no país. Apoio: «consists of resident producers’ acquisitions, less disposals, of fixed assets during a given period» (`eurostat-glossario-fbcf`, campo `excerto`).

- antes: `pt: ['É o investimento feito no país num ano em bens que duram mais de um ano,`
- depois: `pt: ['É o que os produtores residentes compraram num ano, descontado o que venderam, em bens que duram mais de um ano,`
- antes: `en: ['It is the investment made in the country in a year in assets that last more than a year,`
- depois: `en: ['It is what resident producers acquired in a year, less what they disposed of, in assets that last more than a year,`

**A16**, `crescimento-da-despesa-liquida-2025`. Pedido pelo portão da voz, com a palavra da fonte: «Despesa paga» é uma frase retirada do inventário (o cabeçalho das contas do município, que saiu com a peça 2 do B1), e a procura das retiradas morde por palavra inteira dentro de outra frase. A palavra do Conselho das Finanças Públicas é «financiada». A frase retirada fica retirada. Apoio: «Despesa financiada por fundos da UE (4)» (`cfp-despesa-liquida`, campo `excerto`).

- antes: `a despesa paga por fundos europeus nem a que sobe`
- depois: `a despesa financiada por fundos europeus nem a que sobe`
- antes: `spending paid by European funds and the spending`
- depois: `spending financed by European funds and the spending`

**A17**, `taxa-de-emprego-2025`. Pedido pelo portão da voz, com a palavra da fonte: «The share of people aged to who are in employment.» é a definição da casa que o F1.10 retirou quando a definição de cada medida passou a sair da fonte, e a leitura inglesa trazia-a de volta palavra a palavra. A palavra do glossário do Eurostat é «employed persons». A frase retirada fica retirada; a edição portuguesa não tinha a coincidência e não muda. Apoio: «percentage of employed persons» (`glossario-emprego`, campo `excerto`).

- antes: `' who are in employment.', ROSE, EU_AVERAGE]`
- depois: `' who are employed.', ROSE, EU_AVERAGE]`

## As formas que mudaram, e o que cada uma continua a proteger

- **O `auditaSelo()` do portão de HTML.** Aceita um valor dentro de `[data-cartao-leitura][data-selo-em]` só quando a leitura é do próprio cartão (`data-cartao-leitura` e `data-selo-em` iguais ao cartão), o valor é a linha do cartão, a do período anterior da mesma série ou o agregado da União da mesma medida, e o cartão tem a sua marca: a regra do item da régua. Protege a porta do recibo de cada número (**P**). Plantas: `l1-leitura-sem-selo-em`, `l1-leitura-de-outro-cartao`, `l1-leitura-com-linha-alheia`.
- **A V2 (`scripts/pais-camaras.mjs`).** A leitura das câmaras diz contagens e o período; a V2 separa as chaves da leitura das da linha do valor, confere cada contagem da leitura contra a recontagem, exige que não tenha porta própria nem cite linha nenhuma, e que o período seja o das linhas contadas. Protege as contagens (**P**). Plantas: as `l1-camaras-leitura-*` de `tests/pais/camaras.mjs` (9 (`plantas_camaras_l1_que_passaram`) de 9 (`plantas_camaras_l1`)), e as plantas antigas da linha do valor passaram a escolher o nó fora da leitura, para morderem o que sempre morderam (35 (`plantas_camaras_que_passaram`) de 35 (`plantas_camaras`) no ficheiro todo).
- **A K1 e a K10 do `check:cartao`.** A K1 admite a peça `cartao-medida-leitura` e mais nenhuma (a planta antiga de uma peça estranha continua a morder); a K10 não conta como segunda marca o valor do próprio cartão citado na leitura. Protegem a forma do cartão e a marca única (**M** e **P**).
- **A célula 10 do `check:voz`, o arame da classe por provar.** Media as leituras como prosa solta e mordia «subiu» e «média da União». Passa a tirar do arame as leituras dos cartões, e só elas, depois de a K17 as conferir na mesma corrida, porque a cadeia da construção chama o `check:voz` e não o `check:cartao`; uma leitura que a K17 recuse fica dentro do arame. Protege a regra do F0.9 (nenhuma comparação sem a linha que a prova). Plantas: `l1-leitura-que-a-k17-recusa` e `l1-leitura-fora-do-cartao` (2 (`plantas_portoes_l1_do_arame_que_morderam`) de 2 (`plantas_portoes_l1_do_arame`)), e o autoteste do arame, que prova que uma leitura num cartão sai, que a mesma marca fora de um cartão não sai e que uma leitura que a K17 recuse não sai.
- **A K17 lê o texto descodificado** quando procura algarismos soltos, com a planta «um algarismo escrito como referência de carácter».

As 5 (`plantas_portoes_l1`) plantas do portão de HTML e do arame morderam todas (5 (`plantas_portoes_l1_que_morderam`)), com os ficheiros de `dist/` repostos byte a byte.

## As plantas da K17

12 (`k17_plantas`) plantas, todas a morder (`k17_plantas_nomes` dá os nomes): as do item 4 do brief sobre a auditoria (a origem tirada, a leitura mudada sem nova leitura, um literal que o campo não tem, um pedaço sem apoio, um algarismo sem literal), a declaração retirada (um processo filho carrega o resolvedor sem a leitura do saldo e o módulo recusa carregar, e o mesmo filho sem o estrago carrega), e as do item 5 sobre a página (um algarismo escrito à mão, o mesmo escrito como referência de carácter, o ramo trocado, uma linha de outra medida citada, um cartão sem leitura, a leitura com a marca da fonte).

## As origens seladas e as que não se acharam

As origens novas das leituras são 44 (`origens_novas`): 31 (`origens_com_selo_de_pedido`) com o selo de um pedido feito pelo cliente da casa no motor e 13 (`origens_alojadas`) alojadas no estudo 13 antes deste bloco (os nomes em `origens_novas_nomes`). O motor registou 27 (`pedidos_do_bloco`) pedidos em `indicators/out/l1-2026-09-24/pedidos.jsonl`, todos com resposta 200 (27 (`pedidos_do_bloco_com_http_200`)), e alojou 29 (`ficheiros_alojados_no_estudo_13`) ficheiros no estudo 13 com o sha256 no manifesto, num commit só (`motor_commits_do_bloco`). `origens-l1.py --confere` relê cada declaração contra os bytes do motor: 0 (`origens_com_faltas`) faltas.

Não se acharam, e por isso as palavras saíram ou mudaram (os acertos dizem quais): uma origem que diga que a despesa líquida é a que o Governo controla (A3); uma que diga o sentido de uma subida da taxa de câmbio efetiva real (A5); uma que chame investimento feito no país à formação bruta de capital fixo (A15); uma que explique o valor real pelos preços de um ano fixo (A1). Os endereços de glossário procurados e que não serviram estão em `sondas-l1.json`, pedidos pelo mesmo cliente com a hora e o sha256: 9 (`sondas`) endereços, 8 (`sondas_404`) com resposta 404 e 1 (`sondas_200`) com resposta 200 (o da taxa de câmbio efetiva real, que leva ao glossário da taxa de câmbio e não diz o sentido).

## As alturas das páginas

A leitura acrescenta altura às páginas (`alturas_das_paginas_px`, em px): a do país em português, a 390 px, passou de 7 563 (`alturas_das_paginas_px.antes.pais_pt_390`) para 9 591 (`alturas_das_paginas_px.depois.pais_pt_390`), e a 1 280 px de 5 308 (`alturas_das_paginas_px.antes.pais_pt_1280`) para 6 813 (`alturas_das_paginas_px.depois.pais_pt_1280`); a dos temas em português, a 390 px, de 6 831 (`alturas_das_paginas_px.antes.temas_pt_390`) para 11 056 (`alturas_das_paginas_px.depois.temas_pt_390`). Nenhuma régua da cabeça ou do cartão mede alturas de modo que a leitura a partisse: o `check:cabeca`, o `check:alvos`, o `check:css` e o `design:feixe` correm dentro da verificação acima.

## O que fica por fazer, e porquê

1. **As idades de algumas leituras: parei nesse ponto.** O item 6 do brief manda tirar da leitura a idade que a linha não fixa. Há linhas que não a fixam nos seus campos, e a idade da leitura apoia-se então num literal selado de uma origem (`algarismos_das_leituras`): a do desemprego de longa duração («aged 15-74»), a da diferença de emprego entre sexos («aged 20-64») e a do abandono escolar precoce («a person aged 18 to 24»). As perguntas do desemprego de longa duração e do abandono já escrevem as mesmas idades, pela mesma origem, no mesmo cartão. Tirá-las fazia a leitura dizer menos do que a pergunta ao lado dela, e menos do que a fonte diz. Não as tirei; o lugar de direção decide. Se decidir tirá-las, são os algarismos dessas leituras nas duas edições, com as linhas do inventário e a auditoria.
2. **A leitura a frio de outra família** (o §6 do brief): o bloco não aterra sem ela.
3. **A leitura do inventário** pelo lugar de direção: a entrada `l1` de `REVISOES-DO-INVENTARIO.md` diz «por ler».
4. **Uma leitura com ramos muda de frase quando o valor muda de lado**, e a frase nova é uma cadeia que o inventário ainda não tem: o `check:voz` fecha a construção até ela entrar. É o preço de o inventário guardar as frases rendidas e não as declarações.
5. **Achados para o lugar de direção, que não mudei** (`achados_das_descricoes` tem os literais): a descrição do Eurostat da taxa de câmbio efetiva real diz «The formula is: [[(REER_HICP_42)t - (REER_HICP_42)t-3] / (REER_HICP_42)t-3]*100 The indicative thresholds are +/-5% for euro area and +/-11% for non-euro area countries.», e a origem da Comissão que o sítio declara diz «real effective exchange rates (3-year percentage change) based on HICP/CPI deflators, relative to 41 other industrial countries, with thresholds of -/+3% for euro area countries and -/+10% for non-euro area countries.»; a descrição do desempenho das exportações diz «The indicative threshold is +3%.», e a da Comissão «export performance against advanced economies (3-year percentage change), with a threshold of -3%.»; a resposta da taxa de atividade é da classe «From 15 to 64 years», que o excerto da linha não traz. A leitura das câmaras fixa o verbo no plural em «eram» e no singular em «não tem valor publicado», e as contagens que eles acompanham podem mudar de número: com outras contagens, uma das concordâncias sai errada. O ensaio a seco das frases do lugar de direção não está no repositório, e os ramos conferiram-se pela conta independente da K17.
6. **As páginas dos domínios e das áreas** rendem o mesmo cartão sem leitura: o brief manda a leitura na página do país e na dos temas, e só a `TemasDoPais.astro` passa a propriedade `leitura`.

## Os commits

- `d831b453 L1: a planta da declaração retirada, que prova que o resolvedor recusa carregar sem uma leitura obrigatória`
- `dd30253f L1: a sonda das origens que não se acharam, o porquê exato do A5 e os guiões das origens sem o caminho da máquina`
- `5a1667ab L1: o mapa do repositório com o que o L1 acrescentou, e as linhas que tinham andado`
- `84eedc3a L1: o arame da classe tira as leituras dos cartões só depois de a K17 as conferir, e as plantas das formas novas`
- `b63f33a4 L1: as palavras fixas no inventário das frases, os acertos A16 e A17 que o portão da voz pediu e o guião que confere os dezassete acertos`
- `c527ce12 L1: as origens das leituras seladas no motor, a auditoria folha a folha e a K17 do check:cartao`
- `383445fc L1: o portão de HTML, a V2 e a K1 e K10 do cartão aceitam a leitura pela regra da régua`
- `39d27368 L1: a leitura por baixo do número nos 36 cartões nacionais, a 14 px e na tinta`
- `607808f0 L1: as leituras das medidas declaradas em src/data e o resolvedor que as achata`
- `bc078d3b L1: o mapa do repositório com o que a peça 1 do B2 acrescentou`

No motor, `1e3b15c` (`motor_cabeca`). Os commits do sítio até à cabeça medida são 10 (`commits_do_sitio_no_bloco`); o commit que entrega estas provas vem a seguir e só acrescenta ficheiros desta pasta.

## O custo

O total cumulativo de símbolos que a ferramenta reportou até à escrita deste relatório: 1 456 342 (`simbolos_do_construtor`), declarado e não medido por guião (`sessao.json` diz de onde vem). O tempo de parede da sessão, do primeiro registo da transcrição ao fim do último portão: 10 766 (`tempo_de_parede_segundos`) segundos. Modelo: Claude Opus 5.5, em tudo.
