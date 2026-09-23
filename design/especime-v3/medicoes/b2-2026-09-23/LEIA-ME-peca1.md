# O veredicto: relatório da peça 1

**Estado: aceite pelo construtor depois da segunda passagem de correção.** A leitura a frio da peça 1 está feita (`LEITURA-a-frio-2026-09-23.md`, Claude Opus 5.5, a definição `leitor`); os seus treze achados reais estão tratados, achado a achado, na secção «A segunda passagem de correção». A aterragem e os três portões na cabeça que aterra são do lugar de direção.

A peça foi construída pelo construtor do Codex (`gpt-6-astra`), que fez também a primeira passagem de correção e começou a segunda. A subscrição do Codex esgotou-se a meio da segunda passagem: o registo da corrida acaba com o erro das `21:17:30` UTC e com 143 421 símbolos usados (`correcao-2/codex-parou.json`, `hora_do_erro`, `simbolos_usados_n`). O construtor Claude Opus 5.5 (a definição `construtor`) acabou a passagem, na mesma worktree do sítio e na mesma worktree do motor. A medição regista 0 falhas (`falhas_total`) e 0 entradas por completar (`faltas_total`).

## Cabeças e reprodução

O sítio partiu de `7f65829935e838c29129be0187072c5c8d87c39f` (`antes.cabeca`), e o ramo está rebaseado sobre `main` em `97e84232`. **A cabeça testada é `7110ca608ef6addba6771a50b5c47685e4e18026`** (`depois.cabeca`): o `build`, o `verify` e o `typecheck` correram nela, cada um no seu comando, com o código lido de um ficheiro acabado de escrever, e os códigos em `portoes/` são dessa cabeça (`portoes.build.cabeca`, `portoes.verify.cabeca`, `portoes.typecheck.cabeca`). As capturas do depois, as cópias das páginas e as plantas desta passagem são da construção dessa cabeça. O commit de entrega que traz estas provas é o seguinte a ela e não mexe em nada que os portões leiam; não tem código de portão próprio, e o lugar de direção volta a correr os três portões na cabeça que aterra (achado 11).

O motor partiu de `aa35e2e72f09988a07d6706fe0a0b59feeca120d` e está em `0f081711750492991306ff87d056ab4f52dae306` (`motor.base`, `motor.cabeca`), na sua worktree sobre `master`; o diff está em `motor/diff.patch`, sem os corpos das três respostas do Eurostat desta passagem, que ficam no motor (o registo delas vem no diff). Nada foi publicado nem enviado a um remoto.

As medições reproduzem-se com `python3 design/especime-v3/medicoes/b2-2026-09-23/medir.py`, que escreve `medidas.json`; `recolher-motor.py` escreve `motor/medidas-motor.json`; `medir-perguntas.py` escreve `perguntas.json`; `correcao-2/conferir-fonte-cfp.py` escreve `correcao-2/fonte-cfp.json`; `plantar-k16.mjs` escreve `plantas-k16.json`. Salvo outro ficheiro nomeado, os nomes de medição deste relatório são de `medidas.json`.

## Mandato e medida

| Item | Resultado e prova |
| --- | --- |
| 1. O veredicto do país | A frase abre a leitura do país nas duas edições, antes da leitura de hoje, com o ano das linhas e a lista das medidas fora numa frase própria (`depois.paginas.pais_pt.veredicto_do_pais`, `depois.paginas.pais_en.veredicto_do_pais`). A V1 do `check:pais` recompõe as contagens, o ano, os nomes, a ordem e as portas, com plantas a morder (`plantas-veredicto.json`). |
| 2. O estado em palavras | Os temas têm 15 cartões com valor de referência (`depois.paginas.temas_pt.cartoes_com_valor_de_referencia`) e 0 cores sem palavra (`depois.paginas.temas_pt.cores_sem_palavra`); a faixa europeia tem 0 (`depois.paginas.europeia_pt.faixa_cores_sem_palavra`). As referências nacionais nomeiam o dono, «dentro do valor de referência do Pacto (acima de −3 %)» e «fora do valor de referência do Conselho da UE (acima de 5 %)» (`depois.paginas.temas_pt.formas_do_veredicto`), no cartão e na faixa. |
| 3. O valor, a unidade e a marca | Há 0 cartões com a marca entre o valor e a unidade nos temas, contados por um predicado que lê o invólucro novo (`depois.paginas.temas_pt.cartoes_com_a_marca_entre_o_valor_e_a_unidade`), cujo conhecido-positivo é apanhado (`conhecidos_positivos.marca_no_meio_novo`), e 0 unidades separadas do valor a 390 px (`capturas.depois.unidades_separadas_a_390`). O `seloDoValorDoCartao()` do portão de HTML tem as suas plantas: 4 no índice do cartão (`plantas.plantas-cartao-b2.json.nomes`) e a do portão inteiro (`plantas_desbloqueadas`). |
| 4. As perguntas | Os temas têm 21 definições e 21 perguntas (`depois.paginas.temas_pt.cartoes_com_definicao`, `.definicoes_com_pergunta`). A K16 do `check:cartao` confere 22 perguntas declaradas, em 72 pedaços e 85 apoios (`perguntas.k16.perguntas`, `.pedacos`, `.apoios`). A régua vem antes da pergunta e é maior do que ela nas 270 instâncias medidas (`capturas.depois.perguntas_com_regua`, `capturas.depois.reguas_maiores_que_pergunta`). |
| 5. As réguas nacionais | O saldo, a despesa líquida e a disparidade salarial têm o período anterior selado; o de 2024 da despesa líquida passou a ser provado pela frase da nota 9 do parecer do CFP (`fonte_cfp.valor`, `fonte_cfp.fonte.excerto`). Ficam 2 cartões sem régua (`depois.paginas.temas_pt.cartoes_sem_regua`, `.cartoes_sem_regua_lista`), pelas razões da fonte (`motor.reguas_ausentes`). |
| 6. As câmaras | A recontagem independente dá 10 acima, 297 dentro e 1 sem valor publicado (`camaras.depois.camaras_acima_do_limite`, `.camaras_dentro_do_limite`, `.camaras_sem_valor`), iguais às do §0 do brief. O cartão diz «em 2024», lido das linhas contadas (`depois.paginas.pais_pt.camaras_periodo`), tem uma porta para os lugares (`depois.paginas.pais_pt.camaras_portas_para_os_lugares`) e o nome num `span` (`depois.paginas.pais_pt.camaras_nome_elemento`); o cartão do limite saiu das duas páginas (`depois.paginas.temas_pt.cartao_do_limite_legal`, `depois.paginas.pais_pt.cartao_do_limite_legal`). |
| 7. A habitação | O tema abre com os inquilinos a preço de mercado, e o total vem a seguir (`depois.paginas.temas_pt.habitacao_ordem`); o total continua sem a média da União, e a K14 confere-o. |
| 8. A hierarquia dos títulos | O `check:cabeca` corre no `verify` sobre as onze famílias interiores, nas cinco larguras e nas duas edições: 110 cabeças medidas (`hierarquia_resumo.cabecas_medidas`), e a planta do título europeu no tamanho antigo morde em 4 casos (`hierarquia_resumo.mordidas`). |
| 9. O dinheiro | Há 0 cartões com o símbolo do euro nos temas (`depois.paginas.temas_pt.cartoes_com_simbolo_euro`); as unidades com euro de cada página estão em `depois.paginas`, na chave `unidades_com_euro`. |
| 10. As capturas, o relatório e os portões | Estão guardadas 80 capturas (`capturas_total`), com 0 transbordos no depois (`capturas.depois.transbordos`); os três portões saíram a 0 na cabeça testada (`portoes`). |

As frases lidas da construção:

- `depois.paginas.pais_pt.veredicto_do_pais`: «Em 2025, Portugal ficou fora de 4 dos 13 valores de referência da Comissão Europeia e dentro de 9. Fora: a dívida pública, a posição de investimento internacional, o custo unitário do trabalho e os preços da habitação.»
- `depois.paginas.pais_en.veredicto_do_pais`: «In 2025, Portugal was outside 4 of the European Commission’s 13 reference values and within 9. Outside: government debt, the international investment position, unit labour cost and house prices.»

## A segunda passagem de correção

O guião da segunda passagem (`prompts/PROMPT-b2-codex-peca1-correcao-2.md`) traz a decisão do lugar de direção sobre cada achado; o do construtor que a acabou está em `prompts/PROMPT-b2-opus-peca1-correcao-3.md`. O que o Codex deixou mediu-se antes de se decidir: no sítio, os três commits da passagem e os ficheiros por registar da tabela abaixo; no motor, que o guião desta passagem dava por limpo, os ficheiros do achado 6 e a pasta das respostas do achado 8, mudados e por commitar. O `LEIA-ME-peca1.md` que ficou no disco estava inteiro e era o da primeira passagem: o registo da corrida mostra que ela parou quando lia o escritor do relatório, antes de o mudar. Os achados 1 a 5 da leitura a frio são os estragos plantados só nas cópias do pacote e não existem no ramo: na construção medida, a palavra de cada cartão bate com o estado e a cor (`depois.paginas.temas_pt.cores_sem_palavra`, e a K15 no `verify`), os valores das linhas não mudaram (`linhas.valores_alterados`) e as contagens das câmaras são as do brief (`camaras.depois`).

**Achado 6, o crescimento da despesa líquida de 2024 lido de um gráfico.** O Codex achou, na nota 9 da p. 9 do mesmo parecer alojado, a frase que liga o valor à medida, ao ano e ao CFP, escreveu no motor um leitor próprio para ela e uma planta (a nota tirada, o gráfico intacto), e reexportou a linha; nada disso chegou a commit, e o registo do `core.gate` que ele abriu ficou vazio. O construtor Claude acabou: o `pdf_sentence()` do leitor do estudo 13 recusa agora toda a janela que abra na legenda de um gráfico, e uma segunda planta repete a leitura antiga tal como era, pelo índice do gráfico, sobre o ficheiro alojado; o localizador público da linha passou a «p. 9, nota 9», e as linhas da extração ficam na nota. O motor recebeu os commits `8a084b8`, `0f08171`, os dois com o `core.gate` a passar no pre-commit (`motor.passagem_2.commits`), e o teste do estudo vê 35 de 35 estragos com 18 provas verdes e 0 problemas (`motor.passagem_2.plantas_vistas`, `.plantas_total`, `.provas`, `.problemas`). A prova do bloco (`correcao-2/fonte-cfp.json`) confere que a extração alojada é a que o `pdftotext -layout` refaz do PDF registado (`fonte_cfp.fonte.extracao_refeita_identica`), que o controlo sai a 0 (`fonte_cfp.controlo_codigo`), que as duas plantas saem a 1 e a 1 com «um índice em rótulos de gráfico não é prova» (`fonte_cfp.plantas`), e que só a linha de 2024 mudou no motor, com 0 valores alterados (`fonte_cfp.linhas_do_motor`). **O achado 6 deu isto: o valor fica (11,9, `fonte_cfp.valor`), provado por uma frase com localizador inequívoco; nenhuma linha saiu e nenhuma régua passou a ausente.** Commit do sítio `49a63cca`.

**Achado 7, a hierarquia das cabeças que nenhum portão corria.** O Codex fez-o no commit `6151dec5`: o `check:cabeca` entra na cadeia do `verify`, o predicado vive em `tests/inicio/cabeca.mjs`, as famílias são as onze da decisão, e a planta corre dentro do próprio portão. O construtor Claude conferiu-o na corrida do `verify` da cabeça testada e mediu-o nela (`hierarquia`, `plantas-titulos-b2.json`).

**Achado 8, as perguntas com um pedaço sem origem.** O Codex começou a auditoria pedaço a pedaço e pediu a metainformação de três indicadores, mas pôs cópias das respostas no repositório público e o registo da sua corrida não guardou o pedido. O construtor Claude refez os três pedidos pelo cliente da casa, que devolveram os mesmos bytes (o `LEIA-ME.md` da pasta no motor di-lo), e selou-os no motor (`motor.passagem_2.pedidos_das_perguntas`); declarou as três origens novas na forma da casa, com o selo do pedido (o endereço, a hora, o cliente e o sha256) e sem cópia da resposta no sítio, e deu o selo às duas origens antigas que também são respostas da API. Releu a auditoria (`tests/cartao/perguntas-provadas.json`) e ligou-a ao `check:cartao` pela K16, que confere os pedaços, os literais, o uso de cada origem declarada e os selos, com plantas na `--prova` (a primeira repete o defeito que a leitura a frio achou) e outras ao nível do portão (`plantas-k16.json`: 3 de 3 mordidas, `plantas.plantas-k16.json`). O guião das perguntas relê cada selo no motor: 5 de 5 conferem (`perguntas.origens_seladas_que_conferem`, `perguntas.origens_seladas`), e os dois conhecidos-positivos são apanhados (`perguntas.conhecidos_positivos`). Mudaram de texto 2 perguntas (`perguntas.perguntas_com_texto_mudado`): a da dívida pública passa a «em percentagem do PIB», porque a origem escreve «in % of GDP» e não define o PIB; e a do desemprego de longa duração passa a dizer a população ativa e o grupo etário que a descrição do `tesem130` diz (`perguntas.mudancas`). As outras duas que ganharam origem guardam o texto (os dois sexos dos jovens, a população inteira da sobrecarga). Commit do sítio `2dea9e22`; commit do motor `0f08171`.

**Achados 9 e 10, o veredicto sem ano e a lista colada ao «dentro de».** O Codex fez-o no commit `8f7b2c27`, na forma do lugar de direção, com a V1 a exigir o ano e a forma nova e duas plantas por edição. O construtor Claude trocou o apóstrofo da frase inglesa pelo tipográfico, porque o simples saía como «&#39;» e o inventário não o reconhecia (commit `a425f9a3`), e pôs as cadeias no inventário.

**Achado 11, a cabeça commitada com os códigos vermelhos.** Os códigos em `portoes/` são da cabeça testada, `7110ca60`, nomeada acima; o commit de entrega é o seguinte a ela.

**Achado 12, o zero da marca vindo de um predicado cego.** O Codex escreveu o predicado novo no medidor; o construtor Claude commitou-o (`e774add0`). O zero, o conhecido-positivo e as plantas do `seloDoValorDoCartao()` estão no item 3 do mandato.

**Achado 13, o cartão das câmaras sem período.** O Codex fez-o no commit `a4cc0e17`: o cartão diz o período das linhas contadas, as três contagens exigem que as 308 linhas partilhem o período (`camaras.depois.concelhos`), com plantas. A V2 comparava a linha do valor inteira com uma frase com espaço, e o texto construído não o tem, porque é a folha que separa as partes, como em todos os cartões; a V2 recusava o cartão, e a isenção da porta comum no portão de HTML caía com ela. O construtor Claude mudou-lhe a forma (commit `f033b7aa`): compara a contagem com a unidade e o período cada um na sua parte, e exige que a linha não tenha mais nada, com duas plantas novas. As plantas das câmaras mordem todas (`plantas.plantas-camaras.json`: 15 de 15).

**Achado 14, os títulos das chaves.** O Codex fez-o no commit `a4cc0e17`: «calculado» e «calculated» nas três chaves das câmaras, e «municipalities» na chave `municipios_com_pagina` em inglês. O construtor Claude conferiu que os 308 índices contados são linhas calculadas (`camaras.depois.indices_calculados`), e as dicas rendidas estão em `depois.paginas.pais_en.camaras_dicas`. As chaves do painel que o veredicto põe na primeira página não são novas deste bloco, e os seus títulos foram decididos no P1; ficam como estão, com «inside» no inglês.

**Achado 15, cinco portas para a mesma página.** O Codex fez-o no commit `a4cc0e17`: as contagens deixaram de ser ligações, o cartão tem uma porta comum, e a isenção da L1 estreitou-se a essa porta. A L1 conta 2291 páginas, com 12 entradas só de recibos novos e 0 páginas antigas agravadas (`l1.final.contagens.estudos`, `.recibos_de_linhas_novas`, `.paginas_antigas_agravadas`). Os nomes das câmaras acima do limite ficam para o B3, na linha dos lugares.

**Achado 16, a referência sem dono.** O Codex fez-o no commit `8f7b2c27` para o cartão, com a K15 a conferir o dono e a planta. A faixa da página do domínio continuava a render a palavra sem ele para o saldo e para a despesa líquida, e a K15 fechou o `verify` na primeira tentativa desta passagem (`portoes-e774add0/`, `portoes_tentativas`); o construtor Claude passou o dono também à faixa (commit `7110ca60`).

**Achado 17, o nome do cartão das câmaras num título.** O Codex fez-o no commit `a4cc0e17`: o nome é um `span`, como nos outros cartões, e a V2 recusa um título, com planta. O nome deixou por isso de ser um bloco que o portão da voz recolha, como os nomes dos outros cartões, e a linha dele saiu do inventário (commit `043f7291`).

**Achado 18, a K7 com o nome errado.** A K7 é a proibição de «limiar» nos cartões; o estado e a cor conferem-se pela T9 do `check:pais` e pela K15 do `check:cartao`. Este relatório já os nomeia assim.

## O que ficou de cada ficheiro que o Codex deixou por registar

| Ficheiro | O que o Codex deixou | O que ficou |
| --- | --- | --- |
| `ledger/claims/crescimento-da-despesa-liquida-2024.yml`, `ledger/cruzamentos/dominios.json` | a linha reexportada com a frase da nota 9 e as linhas da extração no localizador | reexportada de novo depois do commit do motor, com o localizador público «p. 9, nota 9»; commit `49a63cca` |
| motor: o leitor, o construtor e o teste do estudo 13, o livro e o manifesto | o leitor da nota 9 e a planta da nota tirada, sem commit | completados com a recusa geral e a planta da leitura antiga; commit `8a084b8`, com o `core.gate` a passar |
| motor: `indicators/out/b2-2026-09-23/correcao-2-perguntas/` | três respostas com um registo cujo pedido não ficou no registo da corrida | substituída pelos mesmos três pedidos feitos de novo pelo cliente da casa, com os mesmos bytes; commit `0f08171`; a pasta dele saiu |
| `src/data/figuras.mjs` | três origens novas com cópias no sítio, e duas perguntas reescritas | completado: as origens na forma da casa com o selo do motor, e o selo nas duas origens antigas da API; commit `2dea9e22` |
| `tests/cartao/perguntas-provadas.json` | a auditoria pedaço a pedaço | relida, com o excerto dos dois sexos acertado, e ligada ao `check:cartao` pela K16; commit `2dea9e22` |
| `tests/cartao/fontes-perguntas/` | cópias das três respostas no repositório público | retirada: as respostas ficam no motor |
| `design/especime-v3/INVENTARIO-FRASES.md`, `critica/REVISOES-DO-INVENTARIO.md` | as cadeias novas, e as retiradas com uma sexta coluna | reparados e completados; commit `043f7291` |
| `medir.py` | o predicado do invólucro novo | commitado (`e774add0`); as medidas desta passagem entram no commit de entrega |
| `correcao-2/` | a prova do CFP, uma imagem da p. 9 do PDF, cópias das respostas, a auditoria e uma medida da hierarquia de outra cabeça | a prova do CFP refeita; a imagem e as cópias saíram, porque as cópias das fontes não entram num repositório público; a auditoria vive em `tests/cartao/`; a hierarquia foi medida na cabeça testada |
| o resto da pasta das medições | as provas da corrida final da primeira passagem | substituídas pela corrida final desta passagem |

## Linhas, períodos anteriores e unidades

O sítio conserva os valores das 2978 linhas anteriores, acrescenta 6 e altera 0 valores (`linhas.antes`, `linhas.novas_n`, `linhas.valores_alterados`); nenhuma linha saiu (`linhas.retiradas`). O motor conserva as 317 linhas anteriores e acrescenta 6, com 0 alterações às anteriores (`motor.linhas.antes`, `motor.linhas.novas_total`, `motor.linhas.alteradas`).

| Medida nacional | O que a fonte alojada permite |
| --- | --- |
| Saldo das administrações públicas | O período anterior da resposta do Eurostat, e a referência do Pacto. |
| Crescimento da despesa líquida | O período anterior da frase da nota 9 da p. 9 do parecer do CFP, e a referência do Conselho da UE. |
| Disparidade salarial entre sexos | O período anterior da resposta alojada do Eurostat. |
| Ganho médio mensal | Sem período anterior: o ficheiro do INE alojado só publica o período da linha (`motor.reguas_ausentes.ganho-medio-mensal-2024`). |
| Retribuição mínima mensal garantida | Sem período anterior: o diploma alojado cita um compromisso, e não a norma que fixou o valor anterior (`motor.reguas_ausentes.retribuicao-minima-mensal-garantida-continente-2026`). |

## Células, estragos e limites da prova

O `auditaSelo()` do portão de HTML conserva uma marca da própria linha ao pé do valor, e o invólucro novo só é aceite com o valor e a unidade juntos e a marca única depois deles. A K10 conserva uma marca por cartão. A K6 compara a pergunta rendida com a declaração; a K16 compara a declaração com as origens, pedaço a pedaço. A K7 continua a recusar «limiar» nos cartões. O estado e a cor conferem-se pela T9 do `check:pais` e pela K15, que exige a palavra, o dono, a direção e a cor, no cartão e na faixa. A K9 confere cada valor de referência com uma segunda testemunha, a K13 os grupos etários, a K14 o silêncio da média europeia no total da habitação. A V1 recompõe o veredicto do país e a V2 o cartão das câmaras.

Há 94 ensaios de estragos nos índices de plantas da pasta e 94 mordidas (`plantas_total`, `plantas_morderam`); são execuções, e não uma promessa de defeitos distintos. Os limites ditos: a K16 não infere que um literal quer dizer o que o pedaço diz, e essa leitura é de quem assina a auditoria; e os selos relêem-se no motor pelo guião das perguntas, porque o repositório do sítio é público e não guarda as respostas. A recusa geral do `pdf_sentence()` reconhece a camada de texto de um gráfico pela legenda com que a janela abre («Gráfico», «Figura» e as duas inglesas, seguidas de um número); uma janela que começasse depois da legenda não seria recusada por ela, e para a linha de 2024 é a leitura própria da nota 9 que exige a frase.

## Portões, diagnósticos e tempo

| Comando | Código | Cabeça | Medição e ficheiro |
| --- | --- | --- | --- |
| `npm run build` | 0 | `7110ca60` | `portoes.build.codigo`, lido de `portoes/build.codigo` |
| `npm run verify` | 0 | `7110ca60` | `portoes.verify.codigo`, lido de `portoes/verify.codigo` |
| `npm run typecheck` | 0 | `7110ca60` | `portoes.typecheck.codigo`, lido de `portoes/typecheck.codigo` |

A primeira tentativa desta passagem, na cabeça `e774add0`, está em `portoes-e774add0/`: o `build` saiu a 0 e o `verify` a 1 (`portoes_tentativas`), pela K15 na faixa do domínio (achado 16). As tentativas anteriores, da construção e da primeira passagem, estão nas pastas `portoes-*`.

Os três portões da cabeça testada levaram 782,233879 segundos (`portoes_segundos`). As tentativas concluídas de todo o bloco levaram 2391,816787 segundos (`portoes_tentativas.segundos_documentados`). A janela documentada, do início das capturas de partida ao fim do último intervalo registado, é de 16253,576 segundos (`tempo_documentado.janela_segundos`); não é o tempo total desde o pedido, que não ficou registado, [verify].

## Commits

Os commits do ramo sobre `main`, até à cabeça testada:

- `f8e82713` B2: importar períodos anteriores e habitação dos inquilinos
- `8999e903` B2: escrever a unidade monetária da linha nas leituras
- `58a0b81d` B2: declarar perguntas e referências numa tabela comum
- `b715dda6` B2: mostrar estado em palavras e unir valor à unidade
- `3283b6b5` B2: compor o veredicto e contar as câmaras contra o limite
- `353d7bb8` B2: guardar o antes nas páginas e larguras do mandato
- `ffe43c06` B2: tornar acessíveis as origens da pergunta dos inquilinos
- `8479ff91` B2: registar perguntas e estados no inventário das frases
- `ff9d5662` B2: conferir as portas obrigatórias e medir as fichas novas
- `4aa1c128` B2: tornar reproduzíveis a medição e a prova do motor
- `1920024c` B2: declarar os tipos da língua e das referências opcionais
- `bc44858a` B2: levar os estilos da origem ao recibo novo
- `57124036` B2: guardar capturas finais, plantas e medições dos pontos suspensos
- `7c381662` B2: relatar a prova e as decisões necessárias à aceitação
- `f2bd5bff` B2: reexportar a associação provada do agregado europeu
- `5d4e0c99` B2: aplicar ao título europeu a regra dos títulos interiores
- `5ffcaa94` B2: fechar as provas da correção e a reprodução do relatório
- `ed44e493` B2: guardar a prova do motor e as plantas que estavam bloqueadas
- `6151dec5` B2: integrar a hierarquia das cabeças no verify
- `a4cc0e17` B2: provar o período das câmaras e usar uma porta comum
- `8f7b2c27` B2: datar o veredicto e nomear o dono das referências
- `49a63cca` B2: o crescimento da despesa líquida de 2024 provado na nota 9 do parecer do CFP, reexportado do motor
- `2dea9e22` B2: cada pedaço de cada pergunta com a sua origem, e a K16 do check:cartao a conferi-lo
- `f033b7aa` B2: a V2 compara a linha do valor das câmaras parte a parte, a contagem e o período
- `a425f9a3` B2: o apóstrofo tipográfico na frase inglesa do veredicto
- `043f7291` B2: o inventário das frases da segunda passagem de correção
- `d1bf2c2b` B2: os guiões da segunda passagem de correção e a leitura a frio da peça 1
- `e774add0` B2: o medidor do bloco conta a marca entre o valor e a unidade no invólucro novo
- `7110ca60` B2: a faixa também nomeia o dono da referência nacional

Os desta passagem, depois de `ed44e493`: `6151dec5`, `a4cc0e17`, `8f7b2c27`, `49a63cca`, `2dea9e22`, `f033b7aa`, `a425f9a3`, `043f7291`, `d1bf2c2b`, `e774add0`, `7110ca60`. No motor: `8a084b8`, `0f08171`.

## O que ficou por fazer

- A leitura cruzada do diff do inventário desta passagem, pelo lugar de direção antes de aterrar (a entrada `b2-peca1-correcao-2` de `critica/REVISOES-DO-INVENTARIO.md` diz «por ler»).
- Os três portões na cabeça que aterra e a aterragem, pelo lugar de direção.
- Os nomes das câmaras acima do limite, na linha dos lugares, no B3.
- O período anterior da retribuição mínima, quando o motor alojar o diploma de 2025, num bloco pequeno.
