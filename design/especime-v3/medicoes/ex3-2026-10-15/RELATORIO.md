# EX3: relatório da retoma, 15.10.2026

Estado da primeira retoma: concluído no âmbito do construtor. A passagem de correção e a limitação das fusões estão em EX3-11.

## EX3-1: a retoma

Os dois impedimentos da primeira passagem foram resolvidos pelo mandato emendado: P2 usa rótulos literais nas duas edições, e os nomes ingleses foram conferidos contra os campos `name`. A auditoria X1/X2 aceita as frases novas. Não se mudou nenhum valor do Orçamento nem nenhuma linha anterior.

## EX3-2: documentos e pedidos

Os corpos estão em `content/13 Dominios/source/ex3/` do motor; cada recibo tem o nome do corpo seguido de `.pedido.json`. Todos os pedidos da tabela deram HTTP 200.

| Corpo | Data e hora UTC | SHA256 | Endereço |
| --- | --- | --- | --- |
| robots.txt | 2026-10-15T18:46:35.608749+00:00 | c43a3893ed5ebdae4bb03ad426aa858da61b9e8c1a092c36e05bc43f5f6bd072 | https://www.nato.int/robots.txt |
| definicao.html | 2026-10-15T18:46:35.850631+00:00 | d42b32910ffc936925c25cb7a34b1e48b88078d578c5bc3760160e2908f5287c | https://www.nato.int/en/what-we-do/introduction-to-nato/defence-expenditures-and-natos-5-commitment |
| def-exp-2026-en.xlsx | 2026-10-15T18:46:37.646269+00:00 | 11e302d3f556b6df87b05413654714b0fcbb9a47ebfadfc92caed76e6a4e0988 | https://www.nato.int/content/dam/nato/webready/documents/finance/def-exp-2026-en.xlsx |
| def-exp-2026-en.pdf | 2026-10-15T18:46:39.806294+00:00 | efd05e4a7e715b361617390016356df04af83ea6febecb9475ce173bf2cffb75 | https://www.nato.int/content/dam/nato/webready/documents/finance/def-exp-2026-en.pdf |
| publicacao.html | 2026-10-15T18:49:31.999031+00:00 | 6780fcc7ae8ea3ef390d0f77e351cf6e690d63c744845e7d841271af91cab1cd | https://www.nato.int/en/news-and-events/articles/news/2026/07/07/defence-investment-update-record-spending-in-europe-and-canada |
| faq.html | 2026-10-15T18:49:31.095053+00:00 | 726f193dba040f32b95404b3cf5b3a884fddfcb6932f892acfac303dec48f0e9 | https://www.nato.int/en/news-and-events/articles/news/2014/07/25/frequently-asked-questions |

O HTML da definição tem um resumo diferente do indicado no mandato (`884a966ce2945fd485c69d236116392b92e2b7e412d0e3b0ac5453c9065ab7e4`) e do recebido na primeira passagem (`456780ee9c0ed644d00871495cba09a54584f03d22957e476dd85a1e895ca566`). As três frases mantêm-se. Os resumos do Excel e do PDF coincidem com os do mandato. O título lido na capa do PDF é «Defence Investment of NATO Countries (2014-2026)», e é esse que os recibos usam.

## EX3-3: as células e a definição

- `nato-defesa-portugal-eur-2026`: 6 748 milhões de euros; Table 1!N27; Excel 6748, formato `General`; PDF p. 5, «6,748». Marca `e`, «estimativa da NATO» / «NATO estimate».
  Excerto: Table 1: Core defence expenditure; Million national currency units; Current prices. Table 1!N27; Portugal (Euros); 2026e: 6748 (Excel; number_format: General). PDF, página 5: 6,748. Figures for 2025 and 2026 are estimates. Forma de apresentação portuguesa, com a marca da coluna: 6 748 e
- `nato-defesa-portugal-pib-2025`: 2,01 % do PIB; Table 3!M27; Excel 2.01, formato `0.00`; PDF p. 7, «2.01». Marca `e`, «estimativa da NATO» / «NATO estimate».
  Excerto: Table 3: Core defence expenditure as a share of GDP and annual real change; Share of real GDP (%); Based on 2021 prices. Table 3!M27; Portugal; 2025e: 2.01 (Excel; number_format: 0.00). PDF, página 7: 2.01. Figures for 2025 and 2026 are estimates. Forma de apresentação portuguesa, com a marca da coluna: 2,01 e
- `nato-defesa-portugal-pib-2026`: 2,10 % do PIB; Table 3!N27; Excel 2.1, formato `0.00`; PDF p. 7, «2.10». Marca `e`, «estimativa da NATO» / «NATO estimate».
  Excerto: Table 3: Core defence expenditure as a share of GDP and annual real change; Share of real GDP (%); Based on 2021 prices. Table 3!N27; Portugal; 2026e: 2.1 (Excel; number_format: 0.00). PDF, página 7: 2.10. Figures for 2025 and 2026 are estimates. Forma de apresentação portuguesa, com a marca da coluna: 2,10 e

A origem `nato-definicao-despesa-defesa`, exportada em `src/data/origens-ex3.json`, contém em `excertoEn` as três frases literais do mandato. A primeira apoia a definição em P1; a segunda liga as despesas essenciais das tabelas à definição. A terceira conserva a inclusão das pensões, sem acrescentar uma comparação não pedida à página. A auditoria usa o mecanismo existente de origens das definições, com o corpo, data, cliente e sha256 em `alojada`, sem campos novos. As ressalvas das linhas distinguem o governo nacional aliado das administrações regionais, locais e municipais, e os preços constantes das percentagens dos preços correntes dos milhões. Não equiparam este perímetro ao S13.

## EX3-4: mapa dos rótulos de P2

| Código | Português, nome da função do Orçamento | Inglês, campo `name` do Eurostat em minúsculas | Marca |
| --- | --- | --- | --- |
| 01 | serviços gerais das administrações públicas | general public services | p |
| 02 | defesa | defence | p |
| 03 | segurança e ordem pública | public order and safety | p |
| 04 | assuntos económicos | economic affairs | p |
| 05 | proteção do ambiente | environmental protection | p |
| 06 | habitação e infraestruturas coletivas | housing and community amenities | p |
| 07 | saúde | health | p |
| 08 | desporto, recreação, cultura e religião | recreation, culture and religion | p |
| 09 | educação | education | p |
| 10 | proteção social | social protection | p |

Nenhum rótulo inglês precisou de correção face ao mandato emendado. Conservam-se as dez marcas de provisório.

## EX3-5: frases antes e depois

### PT

Antes: O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o dinheiro. De cada cem euros, 17,07 vão para a saúde, 13,73 para a proteção social, 10,91 para a educação e 11,77 para os assuntos económicos. A maior fatia, 33,18, é a dos serviços gerais das administrações públicas, onde a classificação das funções conta as transferências entre administrações.

Depois: O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o dinheiro. De cada cem euros da despesa efetiva consolidada da administração central, 17,07 vão para a saúde, 13,73 para a proteção social, 10,91 para a educação e 11,77 para os assuntos económicos. A maior fatia, 33,18, é a dos serviços gerais das administrações públicas, onde a classificação das funções conta as transferências entre administrações.

Antes: Visto pelos ministérios, o maior é o Ministério das Finanças, com 60,12 de cada cem euros, 211 891 565 579 euros; seguem-se o Ministério da Saúde (13,28), o Ministério do Trabalho, Solidariedade e Segurança Social (10,69) e o Ministério da Educação, Ciência e Inovação (4,16).

Depois: Visto pelos ministérios, o maior é o Ministério das Finanças, com 60,12 de cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação, 211 891 565 579 euros; seguem-se o Ministério da Saúde (13,28), o Ministério do Trabalho, Solidariedade e Segurança Social (10,69) e o Ministério da Educação, Ciência e Inovação (4,16).

Título antes: As dez funções, de cada cem euros

Título depois: As dez funções, de cada cem euros da despesa efetiva consolidada da administração central

Título antes: Os dezasseis ministérios, de cada cem euros

Título depois: Os dezasseis ministérios, de cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação

Parágrafo novo: Os 3,25 de cada cem euros desta página são a função «Defesa» da despesa efetiva consolidada da administração central, em contabilidade pública. A despesa em defesa em percentagem do PIB que a NATO publica é outra medida, pela definição da própria NATO: os pagamentos feitos por um governo nacional, sem as administrações regionais e locais, especificamente para satisfazer as necessidades das suas forças armadas, das dos outros aliados ou da Aliança no seu todo. Para Portugal, a NATO publica, na tabela a preços constantes, estimativas de 2,01 % (estimativa da NATO) do PIB em 2025 e 2,10 % (estimativa da NATO) em 2026. Na tabela a preços correntes, publica 6 748 (estimativa da NATO) milhões de euros em 2026, também como estimativa. Estas percentagens têm denominadores diferentes: a despesa efetiva consolidada da administração central e o PIB. Não são diretamente comparáveis.

Parágrafo novo: Noutra conta, a de todas as administrações públicas, com as regionais e as locais, em percentagem do PIB e em contabilidade nacional, o Eurostat publica para 2024: serviços gerais das administrações públicas 5,8 % (dado provisório), defesa 0,9 % (dado provisório), segurança e ordem pública 1,6 % (dado provisório), assuntos económicos 3,6 % (dado provisório), proteção do ambiente 0,7 % (dado provisório), habitação e infraestruturas coletivas 0,6 % (dado provisório), saúde 6,8 % (dado provisório), desporto, recreação, cultura e religião 0,8 % (dado provisório), educação 4,3 % (dado provisório) e proteção social 17,1 % (dado provisório) do PIB. Estas percentagens do Eurostat referem-se a 2024 e usam o PIB como denominador. As fatias por função do Orçamento referem-se a 2026 e usam a despesa efetiva consolidada da administração central. Também diferem o perímetro e a contabilidade.

### EN

Antes: The State Budget for 2026 says, euro by euro, where the money goes. Of every hundred euros, 17,07 go to health, 13,73 to social protection, 10,91 to education and 11,77 to economic affairs. The largest share, 33,18, is general public services, where the classification of functions counts the transfers between levels of government.

Depois: The State Budget for 2026 says, euro by euro, where the money goes. Of every hundred euros of central administration's consolidated effective expenditure, 17,07 go to health, 13,73 to social protection, 10,91 to education and 11,77 to economic affairs. The largest share, 33,18, is general public services, where the classification of functions counts the transfers between levels of government.

Antes: Seen by ministry, the largest is the Ministry of Finance, with 60,12 of every hundred euros, 211 891 565 579 euros; then come the Ministry of Health (13,28), the Ministry of Labour, Solidarity and Social Security (10,69) and the Ministry of Education, Science and Innovation (4,16).

Depois: Seen by ministry, the largest is the Ministry of Finance, with 60,12 of every hundred euros of “DESPESA TOTAL” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation, 211 891 565 579 euros; then come the Ministry of Health (13,28), the Ministry of Labour, Solidarity and Social Security (10,69) and the Ministry of Education, Science and Innovation (4,16).

Título antes: The ten functions, of every hundred euros

Título depois: The ten functions, of every hundred euros of central administration's consolidated effective expenditure

Título antes: The sixteen ministries, of every hundred euros

Título depois: The sixteen ministries, of every hundred euros of “DESPESA TOTAL” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation

Parágrafo novo: The 3,25 of every hundred euros on this page are the «Defence» function of central administration's consolidated effective expenditure, in public accounting. Defence spending as a share of GDP, as NATO publishes it, is another measure, under NATO's own definition: payments made by an Allied national government (excluding regional, local and municipal authorities) specifically to meet the needs of its own armed forces, those of other Allies or the needs of the Alliance as a whole. For Portugal, NATO publishes, in the table at constant prices, estimates of 2,01 % (NATO estimate) of GDP in 2025 and 2,10 % (NATO estimate) in 2026. In the table at current prices, it publishes 6 748 (NATO estimate) million euros in 2026, also as an estimate. These percentages have different denominators: central administration's consolidated effective expenditure and GDP. They are not directly comparable.

Parágrafo novo: In another count, that of all public administrations, with the regional and local ones, as a share of GDP and in national accounts, Eurostat publishes for 2024: general public services 5,8 % (provisional data), defence 0,9 % (provisional data), public order and safety 1,6 % (provisional data), economic affairs 3,6 % (provisional data), environmental protection 0,7 % (provisional data), housing and community amenities 0,6 % (provisional data), health 6,8 % (provisional data), recreation, culture and religion 0,8 % (provisional data), education 4,3 % (provisional data) and social protection 17,1 % (provisional data) of GDP. These Eurostat percentages refer to 2024 and use GDP as their denominator. The Budget shares by function refer to 2026 and use central administration's consolidated effective expenditure. Their coverage and accounting basis also differ.

O denominador dos ministérios foi lido em `src/data/o-que-e-das-familias.mjs`: «da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação». A frase X12 atual foi conservada. Ao contrário da descrição histórica do §0, nesta cabeça ela já só diz que a conta por função organiza a despesa por finalidade.

## EX3-6: células e plantas

A auditoria das palavras foi recomposta em `compor.mjs`; as duas famílias novas têm especificação em `familias.mjs`. O compositor R4 histórico falha em famílias anteriores já retiradas e nas famílias posteriores do V2-a, por isso ficou intacto e a composição EX3 acrescenta apenas as entradas deste bloco.

A X6 lê a marca `e`, já suportada pelo componente, e conserva as duas casas decimais. A exceção de ponto decimal introduzida na primeira passagem foi retirada em EX3-11: as duas edições usam a vírgula decimal. Os valores e a apresentação das linhas anteriores ficaram intactos. As frases declaradas continuam cobertas pelo inventário dinâmico e pela célula das frases compostas.

As plantas em `tests/explicacoes/ex3.mjs` retiram o apoio da definição, acrescentam um token sobre uma linha inexistente, trocam o valor da NATO e retiram uma casa decimal. O teste do motor regenera as células e a definição, confere recibos e travessia e recusa quatro alterações: valor, bandeira, período e excerto.

## EX3-7: direitos e tranca HTTP

A FAQ oficial remete para a política antiga em `http://www.nato.int/cps/en/natolive/68162.htm`; o pedido HTTPS devolveu 404. A ausência e o recibo estão na pasta `direitos/`; não se declarou uma licença que não foi confirmada. Os corpos ficam no motor, sem cópia pública.

Cada comando de pedidos à NATO correu com `RESEARCHHUB_LOCK_DIR=<motor>/.http-locks`. Não existiu proteção contra pedidos simultâneos de outros processos que usem a tranca partilhada nesta passagem. A direção aceitou essa limitação no mandato. A pasta `.http-locks` não integra o commit.

## EX3-8: verificação e cabeças

Cabeça de conteúdo conferida do sítio: `e20b9d6298424d6459e2774e65084f0a077a9288`. Cabeça do motor: `e558cd93b3a8cdcbab169bd694c391bcdcdeeffb`.

| Conferência | Código |
| --- | --- |
| build | 0 |
| verify | 0 |
| typecheck | 0 |
| motor, core.gate no pre-commit | 0 |
| series | 0 |
| cruzamento | 0 |

Os códigos do sítio foram lidos de `<temporario>/ex3-portoes-5/build.codigo`, `verify.codigo` e `typecheck.codigo`; a cabeça dessa pasta coincide com a cabeça final do sítio. O código do motor e o resultado `GATE: PASS` foram lidos do pedido de commit aceite; a prova resumida fica em `<temporario>/ex3-motor-portao.json`. O `check:series` foi corrido depois da construção. O `check:cruzamento --with-origin` usou esta worktree do motor: passou, com o aviso anterior sobre o `built_at` do livro do Orçamento, sem divergência em nenhuma linha.

O primeiro commit do motor foi recusado. Faltava declarar o livro novo entre os livros sem entregável narrativo; passou a ser protegido por `publisher.ex3_test`. Três falhas anteriores também impediam o portão: a planta de ausência de recortes perdia as raízes de reserva ao repor a configuração; a prova da pensão consultava um identificador anterior à reescrita; dois identificadores Git numéricos no relatório P4 eram contados como valores. A configuração passou a ser reposta por inteiro; a primeira retoma fez a consulta histórica pelo mapa de commits; em EX3-11 essa adaptação foi retirada e os três registos traduzidos foram repostos de `master`, mantendo o resumo, a introdução no manifesto e a data conferidos; os dois identificadores passaram a ligações para os mesmos commits. A contagem do P4 voltou de 39 a 37, sem aumentar nenhum limite e sem alterar linhas existentes. Os testes dirigidos passaram antes do novo pedido de commit.

O primeiro build do sítio parou na A7: faltava a cobertura das três linhas novas. Foram declaradas em `SEM_AREA`, como a comparação EX3, sem atribuição do agregado da NATO a ministérios. A conferência das áreas passou, e os portões foram repetidos. As plantas sobre o HTML construído passaram nas duas edições; o `check:series` passou com 40 de 40 plantas a detetar os estragos.

## EX3-9: pacote e capturas

`ledger/provas/ex3/provas.json`, exportado com registo de travessia, liga cada linha ao Excel alojado pelo caminho e sha256. Declara também o PDF e o HTML da definição. O resolvedor M83 foi exercitado contra as cabeças: encontrou o Excel pelos recibos, e os resumos do PDF e do HTML foram conferidos nos objetos Git do motor. Os documentos, recibos e direitos integram os ficheiros novos do motor para o pacote M83. Nenhum PNG foi acrescentado ao Git.

O portão da voz pediu a reconciliação dos dois contadores do índice e a declaração de dois contextos das frases prescritas: a identificação do número «desta página» em P1 e o perímetro «coverage» em P2. A X2 já aceitava os apoios. As exceções são as cadeias exatas, só na rota da explicação; as plantas provam que os marcadores continuam a morder noutras frases e noutras rotas. O inventário e o registo de revisão acompanham os contadores lidos no HTML.

Foram declaradas as línguas do título, dos dois rótulos, do organismo e dos três localizadores ingleses da NATO. A L7 continua a recusar localizadores de documentos ingleses sem declaração, e a L4b confere a língua efetiva dos novos localizadores nas duas edições. A F2 foi reposta ao estado de `main` em EX3-11 e recusa o ponto decimal também nas duas percentagens da NATO na edição inglesa; a X6 recusa ainda a precisão reduzida. A adaptação não muda o livro-razão nem o seu esquema.

O primeiro verify completo detetou ainda três integrações em falta. A régua do índice passou a reconhecer os cabeçalhos A1 da NATO, conferindo folha, coluna, ano e rótulo, com plantas de troca. A régua das unidades ganhou o conjunto EX3 fechado em três linhas, lido do cruzamento, com as unidades e as entradas do índice conferidas nas duas edições e quatro plantas novas. Os seis recibos novos tinham duas portas para o Método: a da regra da releitura e a saída genérica do aparelho. A segunda deixou de se render nestes recibos enquanto a primeira está presente. Conservou-se o teto da L1, sem o aumentar.

A inspeção visual encontrou uma legenda incorreta nos três recibos: o excerto reúne células e cabeçalhos do Excel, a forma impressa do PDF e a nota de apresentação, mas a página dizia que era uma transcrição palavra por palavra. A nota das linhas passou a declarar «Excerto composto a partir», pelo mecanismo existente, sem campo novo. O prefixo duplicado do cabeçalho foi retirado. A travessia foi refeita; os valores, períodos, estimativas e documentos mantiveram-se. O teste EX3 confere a legenda de excerto composto nas seis páginas e recusa a legenda de transcrição literal. Os portões e as capturas foram repetidos depois desta correção.

Auditoria das palavras: {"explicacoes":1,"folhas":152,"partes":197,"diz":102,"conta":25,"liga":63,"aponta":2,"leitura":5,"apoios":199,"origens":9}.

Capturas em `<temporario>/ex3-capturas-2/`, com `capturas.json`: 40 páginas, nas duas edições, às larguras 390, 768, 1024, 1280, 1600 px; 0 falhas; cabeça `e20b9d6298424d6459e2774e65084f0a077a9288`. A abertura, os dois parágrafos, as figuras e os três recibos foram inspecionados a 390 e 1280 px nas duas edições, com a conferência das capturas repetida na cabeça final. Leitura a frio pelo Opus e aterragem: a cargo do lugar de direção, não executadas nesta passagem. Nenhum push.

As capturas finais incluem 180 PNG. Conferiram-se os resumos de todos os ficheiros; os 80 recortes comuns às capturas anteriores são idênticos. Nenhuma das 40 páginas excede a largura da janela. Os excertos e as legendas corrigidas dos três recibos foram inspecionados nas duas edições a 390 e 1280 px.

## EX3-10: entrega

A entrega da primeira retoma ficou nas cabeças acima. O relatório final dessa retoma estava por comitar e é incluído na passagem EX3-11. As medições históricas em `medicoes.json` correspondem à primeira retoma.

## EX3-11: correção antes da leitura a frio

As três legendas `e` passaram a «estimativa da NATO» / «NATO estimate», sem ponto final, no gerador, no livro e no manifesto do motor, e foram reexportadas. As duas percentagens usam «2,01» e «2,10» nas duas edições. Os valores e excertos das linhas não mudaram. A régua `tests/inicio/formato-dos-numeros.mjs` foi reposta byte a byte de `main`; as exceções inglesas foram retiradas do formatador, da X6 e do portão HTML. As plantas recusam o ponto decimal nas duas edições, a alteração do valor e a perda de precisão.

As duas fusões pedidas foram tentadas e recusadas pela sandbox: `git merge master` no motor e `git merge main` no sítio deram código 128, com `fatal: update_ref failed for ref 'ORIG_HEAD': cannot lock ref 'ORIG_HEAD'` e `Operation not permitted` ao criar `ORIG_HEAD.lock`. Não foi pedida escalada. O escrivão desta sessão não dispõe de operação de fusão. A integração da história de `master` e de `main`, incluindo o ME1, fica por fazer pelo lançador; esta passagem não declara o bloco concluído.

No motor, `publisher/rp4n_pensao.py` e os três registos traduzidos foram copiados dos objetos Git de `master`, sem consulta do mapa em tempo de execução. O `RELATORIO-P4.md` já coincide com `master`. Conservam-se o teste EX3, a reposição inteira da configuração dos recortes e o livro declarado no portão. Os testes dirigidos EX3 e das origens passaram; a declaração EX3 do sítio passou.

A reposição dos registos históricos exigiu reexportar a pensão para o sítio por `python3 -m publisher.rp4n_pensao <worktree>`. O primeiro `check:cruzamento --with-origin` deu código 1 pelos resumos antigos de dois ficheiros; depois da reexportação deu 0. Mudaram apenas as referências ao commit traduzido e os seus resumos, sem alteração de valores. O aviso anterior sobre o `built_at` do livro do Orçamento mantém-se, sem divergência de linhas.

Cabeça de conteúdo conferida do sítio: `aa7ecdb502d89f456af4e091077c9b16c8f2cb85`. Cabeça do motor: `b262f0c7` (commit aceite com `GATE: PASS`). O relatório é comitado depois desta conferência; a corrida na cabeça desse commit fica em `<temporario>/ex3-correcao-portoes-final/`, com o identificador em `cabeca` e `cabeca.fim`.

| Conferência da correção | Código lido |
| --- | --- |
| build | 0 |
| verify | 0 |
| typecheck | 0 |
| core.gate no pre-commit do motor | 0 |
| check:series com esta worktree do motor | 0 |
| check:cruzamento --with-origin depois da reexportação | 0 |
| EX3 sobre o HTML construído, com plantas | 0 |

Os três códigos e as duas cabeças coincidentes foram lidos de `<temporario>/ex3-correcao-portoes-1/`. O código do pre-commit veio do resultado do pedido ao escrivão e ficou em `<temporario>/ex3-correcao/motor.codigo`. Os restantes foram lidos de `ex3-correcao-series.codigo`, `ex3-correcao-cruzamento-2.codigo` e `ex3-correcao-html.codigo`, na pasta temporária. O HTML construído confirma «2,01 % (estimativa da NATO) do PIB em 2025» e «2,10 % (estimativa da NATO) em 2026»; em inglês, «2,01 % (NATO estimate) of GDP in 2025» e «2,10 % (NATO estimate) in 2026». As dez marcas de provisório do Eurostat mantêm-se nas duas edições.

As capturas em `<temporario>/ex3-correcao-capturas-1/`, com `capturas.json`, deram 40 páginas e 0 falhas nas duas edições e nas cinco larguras. Os resumos dos 180 PNG foram conferidos. Inspecionaram-se P1 e os valores dos três recibos a 390 e 1280 px nas duas edições: legendas e vírgulas corretas, sem corte nos recortes. As capturas depois do commit do relatório ficam em `<temporario>/ex3-correcao-capturas-final/`, com a cabeça no manifesto.

O `RELATORIO.pontos.json` e o registo do escrivão foram preservados em `<temporario>/ex3-correcao-lancador/`, fora dos commits e da worktree durante os portões. Nenhum PNG entrou no Git. Nenhum push. As fusões recusadas continuam pendentes; a leitura a frio e a aterragem ficam a cargo da direção.

tokens used: não disponível

## A segunda passagem de correção de 19.10.2026

Esta secção substitui o estado da primeira correção: as fusões já chegaram pelo lugar de direção. Nesta passagem não se executou merge nem push. As secções anteriores conservam o registo histórico e as suas medições, incluindo as formas entretanto corrigidas.

- Achado 5: P1 diz que a definição da NATO inclui pensões e P2 compara NATO e Eurostat no mesmo ano. A frase das pensões é a terceira frase literal da origem selada `nato-definicao-despesa-defesa`; o setor e a contabilidade do Eurostat são os da linha `despesa-por-funcao-2024-gf02-pt`. A linha nova vem de `Table 3!L27`, com o mesmo documento, recibo e direitos.
- Achado 6: o montante das Finanças volta a seguir à sua parcela por cem euros. O total antes da consolidação é extraído do excerto de `rp4n-total-ministerios` pelo token `verbatim`, com comparação independente da página e planta de valor trocado. Conserva-se a enumeração dos ministérios seguintes como frase separada.
- Achado 7: a abertura, a figura das funções e P1 recebem a glosa da família nas duas edições, apoiada em `rp4n-despesa-efetiva` e `rp4n-consolidacao`.
- Achado 8: o compositor deixa de atribuir apoios genéricos de `pib-2026` a P1. A X13 exige que a parte imediatamente junto de cada valor e o seu sufixo citem a linha desse token. As plantas trocam os apoios dos euros, da percentagem e do sufixo. Os preços constantes, os preços correntes, os períodos e as estimativas têm apoios próprios.
- Achado 13: as percentagens usam o cabeçalho literal `Share of real GDP (%)`, lido em `Table 3!A3`, em vez do título de duas medidas. A navegação, as línguas e a régua dos localizadores acompanham-no. O recibo de 2024 tem uma definição sem a palavra estimativa.
- Achado 15: cada valor estimado conserva uma só marca entre parênteses, em minúscula e sem ponto. A prosa usa apenas as expressões fixadas no mandato. A célula de 2024 não recebe marca.
- Achado 18: `printed_cell` lê o valor e o `number_format`. O formato `General` dos euros dá os algarismos da célula; a apresentação agrupada do PDF deriva desses mesmos algarismos. A forma impressa do montante não está escrita à mão no gerador. As plantas alteram a célula e o formato.
- Achado 11, parte incluída: `DESPESA TOTAL` tem `lang="pt-PT"` na frase dos ministérios, incluindo a edição inglesa.
- Achados 20 e 21, parte incluída: os códigos, os registos das plantas e o manifesto das capturas estão em `segunda-correcao/`; `medicoes.json` e este relatório são escritos por `medir.mjs`, a partir da construção e das provas. As imagens ficam fora do repositório.

### As células lidas pelo motor

| Linha | Célula | Valor | Formato | Cabeçalho do ano | Forma da célula | Forma do PDF |
| --- | --- | --- | --- | --- | --- | --- |
| nato-defesa-portugal-pib-2024 | Table 3!L27 | 1.55 | 0.00 | 2024 | 1.55 | 1.55 |
| nato-defesa-portugal-pib-2025 | Table 3!M27 | 2.01 | 0.00 | 2025e | 2.01 | 2.01 |
| nato-defesa-portugal-pib-2026 | Table 3!N27 | 2.1 | 0.00 | 2026e | 2.10 | 2.10 |
| nato-defesa-portugal-eur-2026 | Table 1!N27 | 6748 | General | 2026e | 6748 | 6,748 |

Comandos: `python3 -m publisher.ex3 --site <worktree>`; `python3 -m publisher.export_site_rows --manifest publisher/manifest.ex3.json --site <worktree> --write`; `node design/especime-v3/medicoes/ex3-2026-10-15/compor.mjs`. A extração de 2024 lê o ano sem sufixo, por isso não o classifica como estimativa. As páginas do PDF indicadas na tabela foram renderizadas por `pdftoppm` e inspecionadas nesta passagem; a linha de Portugal confirma as formas do Excel e o agrupamento dos euros no PDF. A definição já continha as três frases na cópia alojada; não foi necessário outro pedido HTTP.

### As frases construídas

#### PT

abertura: O Orçamento do Estado para 2026 diz, euro a euro, para onde vai o dinheiro. De cada cem euros da despesa efetiva consolidada da administração central (a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços), 17,07 vão para a saúde, 13,73 para a proteção social, 10,91 para a educação e 11,77 para os assuntos económicos. A maior fatia, 33,18, é a dos serviços gerais das administrações públicas, onde a classificação das funções conta as transferências entre administrações.

figuraFuncoes: As dez funções, de cada cem euros da despesa efetiva consolidada da administração central (a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços)

p1: 3,25 de cada cem euros desta página são a função «Defesa» da despesa efetiva consolidada da administração central (a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços), em contabilidade pública. A despesa em defesa em percentagem do PIB que a NATO publica é outra medida, pela definição da própria NATO: os pagamentos feitos por um governo nacional, sem as administrações regionais, locais e municipais, especificamente para satisfazer as necessidades das suas forças armadas, das dos outros aliados ou da Aliança no seu todo; a definição da NATO inclui as pensões de reforma pagas diretamente pelo governo aos militares na reforma e aos funcionários civis dos departamentos militares. Para Portugal, a NATO publica 1,55 % do PIB em 2024 e, como estimativas, 2,01 % (estimativa da NATO) em 2025 e 2,10 % (estimativa da NATO) em 2026 (a tabela a preços constantes), e 6 748 (estimativa da NATO) milhões de euros em 2026 (a tabela a preços correntes, também uma estimativa).

p2: Noutra conta, a de todas as administrações públicas, com as regionais e as locais, em percentagem do PIB e em contabilidade nacional, o Eurostat publica para 2024: serviços gerais das administrações públicas 5,8 % (dado provisório), defesa 0,9 % (dado provisório), segurança e ordem pública 1,6 % (dado provisório), assuntos económicos 3,6 % (dado provisório), proteção do ambiente 0,7 % (dado provisório), habitação e infraestruturas coletivas 0,6 % (dado provisório), saúde 6,8 % (dado provisório), desporto, recreação, cultura e religião 0,8 % (dado provisório), educação 4,3 % (dado provisório) e proteção social 17,1 % (dado provisório) do PIB. Estas percentagens do Eurostat referem-se a 2024 e usam o PIB como denominador. As fatias por função do Orçamento referem-se a 2026 e usam a despesa efetiva consolidada da administração central. Também diferem o perímetro e a contabilidade. As duas percentagens do PIB não medem a mesma despesa: a do Eurostat é a função «Defesa» de todas as administrações públicas, em contabilidade nacional, e a da NATO é a definição acima, que inclui as pensões. No mesmo ano de 2024, a NATO publica 1,55 % do PIB para Portugal e o Eurostat conta 0,9 % (dado provisório). Esta página mostra as duas medidas, cada uma com a sua definição, e não as soma nem corrige nenhuma.

ministerios: Visto pelos ministérios, o maior é o Ministério das Finanças, com 60,12 de cada cem euros, 211 891 565 579 euros, da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central (o total antes da consolidação, 352 472 389 960 euros). Seguem-se o Ministério da Saúde (13,28), o Ministério do Trabalho, Solidariedade e Segurança Social (10,69) e o Ministério da Educação, Ciência e Inovação (4,16).

#### EN

abertura: The State Budget for 2026 says, euro by euro, where the money goes. Of every hundred euros of central administration's consolidated effective expenditure (spending without transactions in financial assets and liabilities or transfers between its own services), 17,07 go to health, 13,73 to social protection, 10,91 to education and 11,77 to economic affairs. The largest share, 33,18, is general public services, where the classification of functions counts the transfers between levels of government.

figuraFuncoes: The ten functions, of every hundred euros of central administration's consolidated effective expenditure (spending without transactions in financial assets and liabilities or transfers between its own services)

p1: 3,25 of every hundred euros on this page are the «Defence» function of central administration's consolidated effective expenditure (spending without transactions in financial assets and liabilities or transfers between its own services), in public accounting. Defence spending as a share of GDP, as NATO publishes it, is another measure, under NATO's own definition: payments made by an Allied national government (excluding regional, local and municipal authorities) specifically to meet the needs of its own armed forces, those of other Allies or the needs of the Alliance as a whole; NATO's definition includes retirement pensions paid directly by the government to retired military and civilian employees of military departments. For Portugal, NATO publishes 1,55 % of GDP in 2024 and, as estimates, 2,01 % (NATO estimate) in 2025 and 2,10 % (NATO estimate) in 2026 (the table at constant prices), and 6 748 (NATO estimate) million euros in 2026 (the table at current prices, also an estimate).

p2: In another count, that of all public administrations, with the regional and local ones, as a share of GDP and in national accounts, Eurostat publishes for 2024: general public services 5,8 % (provisional data), defence 0,9 % (provisional data), public order and safety 1,6 % (provisional data), economic affairs 3,6 % (provisional data), environmental protection 0,7 % (provisional data), housing and community amenities 0,6 % (provisional data), health 6,8 % (provisional data), recreation, culture and religion 0,8 % (provisional data), education 4,3 % (provisional data) and social protection 17,1 % (provisional data) of GDP. These Eurostat percentages refer to 2024 and use GDP as their denominator. The Budget shares by function refer to 2026 and use central administration's consolidated effective expenditure. Their coverage and accounting basis also differ. The two shares of GDP do not measure the same expenditure: Eurostat's is the «Defence» function of all public administrations, in national accounting, and NATO's is the definition above, which includes pensions. In the same year, 2024, NATO publishes 1,55 % of GDP for Portugal and Eurostat counts 0,9 % (provisional data). This page shows both measures, each with its definition, and neither adds them up nor corrects either.

ministerios: Seen by ministry, the largest is the Ministry of Finance, with 60,12 of every hundred euros, 211 891 565 579 euros, of the “DESPESA TOTAL” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector (the total before consolidation, 352 472 389 960 euros). Then come the Ministry of Health (13,28), the Ministry of Labour, Solidarity and Social Security (10,69) and the Ministry of Education, Science and Innovation (4,16).

A primeira corrida desta passagem recusou o inventário das contagens do livro, que ainda tinha o total anterior, e uma indexação sem tipo no novo token de origem. As contagens foram relidas do HTML, o inventário e o registo foram atualizados e a indexação ficou restrita à chave autorizada. A vírgula depois do montante das Finanças foi reposta nas duas edições, tal como no mandato. As páginas foram reconstruídas e os portões repetidos.

### As provas e as cabeças

Cabeça da construção, dos portões e das capturas: `96c315ffa40f8ff90b5fcf0e62ccd438aa83aa68`. Motor: `e457f74cfc069e2dc783bcb21a31a84a7ecc4a44`.

| Conferência | Código lido |
| --- | --- |
| build | 0 |
| verify | 0 |
| typecheck | 0 |
| motor | 0 |
| series | 0 |
| cruzamento | 0 |
| plantas-sitio | 0 |
| plantas-motor | 0 |

Capturas: 50 páginas, larguras 390, 768, 1024, 1280, 1600 px, 0 falhas. Pasta: `<temporario>/ex3-segunda-capturas-1`. Os resumos de todas as imagens e recortes foram conferidos. P1, P2, a abertura e a frase dos ministérios foram inspecionados nas duas edições a 390 e 1280 px.

O código do motor foi lido de `<temporario>/ex3-segunda-portoes-1/motor.codigo`, com a cabeça conferida contra `motor.cabeca`. O registo do lançador foi preservado em `<temporario>/ex3-segunda-lancador/`, fora da worktree e dos commits.

A corrida depois do commit do relatório fica em `<temporario>/ex3-segunda-portoes-final/`, com as cabeças e os códigos próprios; não altera o conteúdo. As capturas finais ficam em `<temporario>/ex3-segunda-capturas-final/`.

### O que fica para a higiene

Os achados 10, 12, 14, 16, 17 e 19, e as partes dos achados 11 e 20 que não cabem nesta correção, ficam para a higiene como o mandato determina. Não foram corrigidos nesta passagem. A leitura curta do diff pelo Opus e a aterragem pertencem ao lugar de direção.

Estado: concluído no âmbito do construtor, sujeito à leitura curta do diff.

tokens used: não disponível
