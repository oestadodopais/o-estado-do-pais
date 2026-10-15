# EX3: relatório da retoma, 15.10.2026

Estado: em verificação; bloco ainda não concluído.

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

- `nato-defesa-portugal-eur-2026`: 6 748 milhões de euros; Table 1!N27; Excel 6748, formato `General`; PDF p. 5, «6,748». Marca `e`, «Estimativa da NATO.» / «NATO estimate.».
  Excerto: Table 1: Table 1: Core defence expenditure; Million national currency units; Current prices. Table 1!N27; Portugal (Euros); 2026e: 6748 (Excel; number_format: General). PDF, página 5: 6,748. Figures for 2025 and 2026 are estimates. Forma de apresentação portuguesa, com a marca da coluna: 6 748 e
- `nato-defesa-portugal-pib-2025`: 2,01 % do PIB; Table 3!M27; Excel 2.01, formato `0.00`; PDF p. 7, «2.01». Marca `e`, «Estimativa da NATO.» / «NATO estimate.».
  Excerto: Table 3: Table 3: Core defence expenditure as a share of GDP and annual real change; Share of real GDP (%); Based on 2021 prices. Table 3!M27; Portugal; 2025e: 2.01 (Excel; number_format: 0.00). PDF, página 7: 2.01. Figures for 2025 and 2026 are estimates. Forma de apresentação portuguesa, com a marca da coluna: 2,01 e
- `nato-defesa-portugal-pib-2026`: 2,10 % do PIB; Table 3!N27; Excel 2.1, formato `0.00`; PDF p. 7, «2.10». Marca `e`, «Estimativa da NATO.» / «NATO estimate.».
  Excerto: Table 3: Table 3: Core defence expenditure as a share of GDP and annual real change; Share of real GDP (%); Based on 2021 prices. Table 3!N27; Portugal; 2026e: 2.1 (Excel; number_format: 0.00). PDF, página 7: 2.10. Figures for 2025 and 2026 are estimates. Forma de apresentação portuguesa, com a marca da coluna: 2,10 e

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

Parágrafo novo: Os 3,25 de cada cem euros desta página são a função «Defesa» da despesa efetiva consolidada da administração central, em contabilidade pública. A despesa em defesa em percentagem do PIB que a NATO publica é outra medida, pela definição da própria NATO: os pagamentos feitos por um governo nacional, sem as administrações regionais e locais, especificamente para satisfazer as necessidades das suas forças armadas, das dos outros aliados ou da Aliança no seu todo. Para Portugal, a NATO publica, na tabela a preços constantes, estimativas de 2,01 % (Estimativa da NATO.) do PIB em 2025 e 2,10 % (Estimativa da NATO.) em 2026. Na tabela a preços correntes, publica 6 748 (Estimativa da NATO.) milhões de euros em 2026, também como estimativa. Estas percentagens têm denominadores diferentes: a despesa efetiva consolidada da administração central e o PIB. Não são diretamente comparáveis.

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

Parágrafo novo: The 3,25 of every hundred euros on this page are the «Defence» function of central administration's consolidated effective expenditure, in public accounting. Defence spending as a share of GDP, as NATO publishes it, is another measure, under NATO's own definition: payments made by an Allied national government (excluding regional, local and municipal authorities) specifically to meet the needs of its own armed forces, those of other Allies or the needs of the Alliance as a whole. For Portugal, NATO publishes, in the table at constant prices, estimates of 2.01 % (NATO estimate.) of GDP in 2025 and 2.10 % (NATO estimate.) in 2026. In the table at current prices, it publishes 6 748 (NATO estimate.) million euros in 2026, also as an estimate. These percentages have different denominators: central administration's consolidated effective expenditure and GDP. They are not directly comparable.

Parágrafo novo: In another count, that of all public administrations, with the regional and local ones, as a share of GDP and in national accounts, Eurostat publishes for 2024: general public services 5,8 % (provisional data), defence 0,9 % (provisional data), public order and safety 1,6 % (provisional data), economic affairs 3,6 % (provisional data), environmental protection 0,7 % (provisional data), housing and community amenities 0,6 % (provisional data), health 6,8 % (provisional data), recreation, culture and religion 0,8 % (provisional data), education 4,3 % (provisional data) and social protection 17,1 % (provisional data) of GDP. These Eurostat percentages refer to 2024 and use GDP as their denominator. The Budget shares by function refer to 2026 and use central administration's consolidated effective expenditure. Their coverage and accounting basis also differ.

O denominador dos ministérios foi lido em `src/data/o-que-e-das-familias.mjs`: «da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação». A frase X12 atual foi conservada. Ao contrário da descrição histórica do §0, nesta cabeça ela já só diz que a conta por função organiza a despesa por finalidade.

## EX3-6: células e plantas

A auditoria das palavras foi recomposta em `compor.mjs`; as duas famílias novas têm especificação em `familias.mjs`. O compositor R4 histórico falha em famílias anteriores já retiradas e nas famílias posteriores do V2-a, por isso ficou intacto e a composição EX3 acrescenta apenas as entradas deste bloco.

A X6 foi atualizada para ler a marca `e`, já suportada pelo componente, e as duas casas decimais em inglês. A adaptação do portão HTML conserva os mesmos algarismos, precisão e comparação exata da escrita, só trocando a vírgula pelo ponto nas duas percentagens novas da NATO na edição inglesa. Os valores e a apresentação das linhas anteriores ficaram intactos. As frases declaradas continuam cobertas pelo inventário dinâmico e pela célula das frases compostas.

As plantas em `tests/explicacoes/ex3.mjs` retiram o apoio da definição, acrescentam um token sobre uma linha inexistente, trocam o valor da NATO e retiram uma casa decimal. O teste do motor regenera as células e a definição, confere recibos e travessia e recusa quatro alterações: valor, bandeira, período e excerto.

## EX3-7: direitos e tranca HTTP

A FAQ oficial remete para a política antiga em `http://www.nato.int/cps/en/natolive/68162.htm`; o pedido HTTPS devolveu 404. A ausência e o recibo estão na pasta `direitos/`; não se declarou uma licença que não foi confirmada. Os corpos ficam no motor, sem cópia pública.

Cada comando de pedidos à NATO correu com `RESEARCHHUB_LOCK_DIR=<motor>/.http-locks`. Não existiu proteção contra pedidos simultâneos de outros processos que usem a tranca partilhada nesta passagem. A direção aceitou essa limitação no mandato. A pasta `.http-locks` não integra o commit.

## EX3-8: verificação e cabeças

Cabeça de conteúdo do sítio: `aaac76b912455ee92accfdb754f9224070c56e7b`. Cabeça do motor: `3d024fa093a23473565eab01f2d30fe92102daa0`.

| Conferência | Código |
| --- | --- |
| build | não executado |
| verify | não executado |
| typecheck | não executado |
| motor | não executado |
| series | não executado |
| cruzamento | não executado |

Capturas: por executar. Leitura a frio pelo Opus e aterragem: a cargo do lugar de direção, não executadas nesta passagem. Nenhum push.

tokens used: não disponível
