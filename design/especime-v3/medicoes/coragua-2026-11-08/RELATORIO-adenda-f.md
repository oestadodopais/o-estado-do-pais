# COR-AGUA: fecho da adenda F

Motor conferido e comitado: `f9073daf20775f5c949d8a7bcc60a0db6fc5bedb`. `core/attributions.py` e `core/attributions_test.py` são iguais a `cf5bd5b`, byte a byte. A suíte emite a linha da casa com `PASS — 6 checks`, aceite pelo leitor do gate. O `core.gate` fica para o lugar de direção; o commit usou `OEDP_GATE=adiado`.

Foram retiradas doze ocorrências de `attributed_to`, correspondentes às sete linhas indicadas nos dois livros. As fontes e os restantes campos ficaram iguais; as vinte e uma outras linhas novas conservam a atribuição. Não houve alteração do texto das páginas nem dos recibos.

| Documento | Atribuições: antes → agora | Avisos: antes → agora |
| --- | --- | --- |
| `onde-esta-a-agua-pt` | 4 → 6 | 7 → 28 |
| `agua-nao-faturada-pt` | 0 → 0 | 0 → 5 |
| `agua-nao-faturada-en` | 0 → 0 | 0 → 5 |

Só estes dois campos dos três documentos foram alterados nos tetos. Os cinco documentos de Évora voltaram aos tetos anteriores: zero atribuições erradas nas três formas da economia e no documento dos pelouros; dezanove no documento de quem governou, sem alteração desses tetos.

| Conferência | Código |
| --- | --- |
| `medição das atribuições` | 0 |
| `classificação e tetos` | 0 |
| `core.attributions_test` | 0 |
| `verificação dos tetos, restauração e formato` | 0 |
| `ledger:check` | 0 |
| `check:cruzamento -- --with-origin` | 0 |
| `check:series com motor` | 0 |

O cruzamento correu com `--with-origin`; as séries leram os corpos do motor. A medição direta de `core.attributions` dá código 1 em Onde está a água e 0 nas duas edições de Água não faturada. O primeiro código exprime as seis recusas classificadas abaixo, que ficam no teto autorizado; a conferência dos tetos exatos dá 0.

A medição integral, com cada linha `ATTRIB` e `UNDECLARED`, contexto e classificação, está em `core/medidas-adenda-f-coragua.json`, ao lado dos tetos no motor. Não se encontrou uma atribuição errada real no texto. As duas recusas do 70 são uma colisão entre grandezas, não entidades noutra frase: o investimento em rega da auditoria do Tribunal de Contas e o armazenamento da APA têm o mesmo literal. A passagem do relatório de auditoria foi conferida na cópia guardada e fica identificada pelo seu SHA256 na medição.

`UNDECLARED` continua a ser um aviso correto de campo ausente. «Falsa» significa que não há atribuição errada no texto: há anos, códigos, rótulos, quantidades homónimas ou a ausência de atribuição por proximidade deliberada no §1.2.

| Documento | Tipo e ocorrência | Valor | Entidade encontrada | Classificação e motivo |
| --- | --- | --- | --- | --- |
| Onde, pt | ATTRIB 1 | 0,0706 | ERSAR | Falsa: entidade certa na frase anterior. A ERSAR pertence à frase anterior sobre o encargo doméstico; o 0,0706 é a tarifa da EDIA. |
| Onde, pt | ATTRIB 2 | 0,0382 | ERSAR | Falsa: entidade certa na frase anterior. A ERSAR pertence à frase anterior sobre o encargo doméstico; o 0,0382 é a tarifa da EDIA. |
| Onde, pt | ATTRIB 3 | 70 | EDIA | Falsa: número homónimo de outra grandeza. O 70 do texto é investimento em sistemas de rega, na auditoria do Tribunal de Contas à EDIA. A linha bul-oct24-pct trata de armazenamento da APA. A EDIA é a entidade auditada, não a autora do valor do boletim. |
| Onde, pt | ATTRIB 4 | 70 | Tribunal de Contas | Falsa: número homónimo de outra grandeza. O Tribunal de Contas é a fonte correta do 70 relativo ao investimento em rega. A régua associa o mesmo literal à linha bul-oct24-pct, relativa ao armazenamento da APA. |
| Onde, pt | ATTRIB 5 | 1,348 | EDIA | Falsa: entidade certa na frase seguinte. A EDIA pertence à frase seguinte sobre as contas auditadas; o 1,348 é o encargo doméstico calculado a partir da ERSAR. |
| Onde, pt | ATTRIB 6 | 2 029 018 255 | Gulbenkian | Falsa: entidade certa na frase seguinte. A Gulbenkian pertence à frase seguinte sobre o inquérito; o 2 029 018 255 vem das contas da EDIA. |
| Onde, pt | UNDECLARED 1 | 2024 | APA, ERSAR | Falsa: ano. 2024 identifica a edição dos dados da ERSAR, não atribui o ano de referência da DGADR à APA ou à ERSAR. |
| Onde, pt | UNDECLARED 2 | 02 | ERSAR | Falsa: rótulo. 02 é uma entrada do índice das secções. |
| Onde, pt | UNDECLARED 3 | 05 | ERSAR | Falsa: rótulo. 05 é uma entrada do índice das secções. |
| Onde, pt | UNDECLARED 4 | 02 | APA | Falsa: rótulo. 02 é o rótulo da secção De onde vem. |
| Onde, pt | UNDECLARED 5 | 2024 | CADC | Falsa: ano. 2024/25 é um ano hidrológico dos relatórios da CADC. |
| Onde, pt | UNDECLARED 6 | 2024 | CADC | Falsa: ano. 2024/25 é um ano hidrológico da grelha conferida na CADC. |
| Onde, pt | UNDECLARED 7 | 2 | APA | Falsa: rótulo de parte. Parte 2 identifica uma parte dos planos de bacia, não duas albufeiras. |
| Onde, pt | UNDECLARED 8 | 2024 | APA | Falsa: ano. A data 2024 é mencionada numa crítica a um cartão; a frase diz que não existe esse balanço setorial. |
| Onde, pt | UNDECLARED 9 | 2024 | APA | Falsa: ano. 2024 integra o título do cartão que o estudo critica, distinguindo-o dos dados de 2018. |
| Onde, pt | UNDECLARED 10 | 5 | APA | Falsa: número homónimo de outra grandeza. O 5% industrial aparece no cartão transcrito e criticado; não são os cinco hectares do universo do inquérito da Gulbenkian. |
| Onde, pt | UNDECLARED 11 | 2024 | APA | Falsa: ano. 2024/25 identifica o período hidrológico dos dados da APA. |
| Onde, pt | UNDECLARED 12 | 2019 | Gulbenkian | Falsa: ano. 2019 é o ano do inquérito, com a Gulbenkian corretamente identificada no texto e na fonte da linha. |
| Onde, pt | UNDECLARED 13 | 5 | Gulbenkian | Falsa: quantidade de um algarismo. Os cinco hectares são corretamente ligados ao inquérito da Gulbenkian. A ausência de attributed_to é a decisão do §1.2, não falta de fonte. |
| Onde, pt | UNDECLARED 14 | 8 | APA | Falsa: código. O 8 faz parte do código RH8 dos planos de bacia. |
| Onde, pt | UNDECLARED 15 | 05 | APA | Falsa: rótulo. 05 é o rótulo da secção O que se perde. |
| Onde, pt | UNDECLARED 16 | 2024 | ERSAR | Falsa: ano. 2024 é o período da decomposição publicada pela ERSAR. |
| Onde, pt | UNDECLARED 17 | 2024 | DGADR | Falsa: ano. 2024 é o período da eficiência publicada pela DGADR; a fonte permanece na linha. |
| Onde, pt | UNDECLARED 18 | 8 | DGADR | Falsa: quantidade de um algarismo. O mínimo de 8% de Alvor é corretamente apresentado como valor da DGADR. A atribuição por proximidade foi retirada pelo §1.2. |
| Onde, pt | UNDECLARED 19 | 2024 | ERSAR | Falsa: ano. 2024 é o período do encargo doméstico da ERSAR. |
| Onde, pt | UNDECLARED 20 | 2024 | EDIA, ERSAR | Falsa: ano. 2024 refere-se aos dados da ERSAR; a EDIA aparece no contexto das tarifas da campanha seguinte. |
| Onde, pt | UNDECLARED 21 | 35 | EDIA | Falsa: número homónimo de outra grandeza. O 35 é receita estimada em milhões de euros na auditoria à EDIA, não o rácio calculado da linha ratio-hi. A fonte da auditoria está identificada na frase anterior. |
| Onde, pt | UNDECLARED 22 | 2016 | EDIA | Falsa: ano em referência documental. 2016 integra o número do Relatório 4/2016; a EDIA é o objeto da auditoria. |
| Onde, pt | UNDECLARED 23 | 2 | EDIA | Falsa: rótulo ordinal. 2.ª Secção identifica a secção do Tribunal de Contas, não duas albufeiras. |
| Onde, pt | UNDECLARED 24 | 2 | IPMA | Falsa: código no endereço. O 2 faz parte do nome público cs2.ipma.pt, não é uma quantidade atribuída ao IPMA. |
| Onde, pt | UNDECLARED 25 | 08 | IPMA | Falsa: rótulo. 08 é o rótulo da secção Autonomia. |
| Onde, pt | UNDECLARED 26 | 2019 | Gulbenkian | Falsa: ano. 2019 é o ano do inquérito corretamente atribuído à Gulbenkian. |
| Onde, pt | UNDECLARED 27 | 5 | Gulbenkian | Falsa: quantidade de um algarismo. Os cinco hectares delimitam o universo do inquérito da Gulbenkian; a fonte permanece na linha e no texto. |
| Onde, pt | UNDECLARED 28 | 2024 | CADC | Falsa: ano. 2024/25 identifica o último período hidrológico referido nos relatórios da CADC. |
| ANF, pt | UNDECLARED 1 | 2019 | C-Lab, Gulbenkian | Falsa: ano. 2019 identifica o ano do inquérito da Gulbenkian e do C-Lab. |
| ANF, pt | UNDECLARED 2 | 2020 | C-Lab, Gulbenkian | Falsa: ano. 2020 identifica a data de publicação do estudo da Gulbenkian. |
| ANF, pt | UNDECLARED 3 | 5 | C-Lab, Gulbenkian | Falsa: quantidade de um algarismo. Os cinco hectares delimitam o universo do inquérito corretamente identificado como da Gulbenkian e do C-Lab; attributed_to saiu pela decisão do §1.2. |
| ANF, pt | UNDECLARED 4 | 2024 | DGADR | Falsa: ano. 2024 identifica o período da eficiência publicada pela DGADR. |
| ANF, pt | UNDECLARED 5 | 2024 | DGADR | Falsa: ano em referência documental. 2024 integra RCM 23/2024 numa lista de documentos; a DGADR aparece nessa lista, não como autora da resolução. |
| ANF, en | UNDECLARED 1 | 2019 | C-Lab, Gulbenkian | Falsa: ano. 2019 identifica o ano do inquérito da Gulbenkian e do C-Lab. |
| ANF, en | UNDECLARED 2 | 2020 | C-Lab, Gulbenkian | Falsa: ano. 2020 identifica a data de publicação do estudo da Gulbenkian. |
| ANF, en | UNDECLARED 3 | 5 | C-Lab, Gulbenkian | Falsa: quantidade de um algarismo. Os cinco hectares delimitam o universo do inquérito corretamente identificado como da Gulbenkian e do C-Lab; attributed_to saiu pela decisão do §1.2. |
| ANF, en | UNDECLARED 4 | 2024 | DGADR | Falsa: ano. 2024 identifica o período da eficiência publicada pela DGADR. |
| ANF, en | UNDECLARED 5 | 2024 | DGADR | Falsa: ano em referência documental. 2024 integra RCM 23/2024 numa lista de documentos; a DGADR aparece nessa lista, não como autora da resolução. |

Medição do custo até à escrita: 13 chamadas e 7 corridas, sem ajudantes. A resposta final inclui o commit e a verificação final.
