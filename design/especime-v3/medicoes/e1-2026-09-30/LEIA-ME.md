# E1 · Os estudos de Évora, um conjunto coerente

*Relatório do construtor: Claude Opus 5.5 (a definição `construtor`), de 30.09.2026 às 21:54 a 01.10.2026, pelo brief `design/observatorio/BRIEF-E1-os-estudos-de-evora-um-conjunto-coerente.md` e pela §1.145, com a emenda do lugar de direção ao lançar o bloco: o ponto 0 não é deste bloco; a linha `estudos-evora-publicados` tem o lugar declarado em Évora e muda por uma entrada `atualizacao` selada por `scripts/selar-historia-valores.mjs`; as linhas que medem o próprio projeto são do E0, que corre em paralelo e em que este bloco não toca. Cada número deste relatório está em [medidas.json](medidas.json), escrito por [medir-e1.py](medir-e1.py) com o nome, o valor, o comando e um conhecido-positivo de cada medida, ou num ficheiro de [portoes/](portoes/) com o código escrito depois de o processo acabar.*

## Em resumo

Os quatro estudos nasceram no motor (`content/16` a `content/19`), compostos dos registos já fixados dos seis estudos de agosto e setembro por um compositor novo (`core/compor.py`), com o portão do motor a 0 na cabeça `6ed528b`. Cada um abre com «Em resumo», «O que este projeto conclui» e «O que podia funcionar melhor», nas duas línguas onde há edição inglesa (o 16, o 18 e o 19; o 17 só em português, como o «Quinze Anos» e «Os Pelouros» de onde vem). No sítio, as 69 linhas mudaram de estudo sem mudar de id, de valor nem de origem; os seis endereços antigos respondem com a nota do sucessor à cabeça nas duas línguas, fora do índice e do mapa do sítio; a lista dos estudos e a página de Évora listam os quatro, cada um com a sua pergunta; a linha dos estudos sobre Évora passou de 6 a 4 pelo mecanismo, com a história selada.

**Onde parei, e porquê.** Quando os quatro estudos entram no arquivo, as duas linhas que contam o arquivo inteiro têm de mudar: `estudos-publicados` de 13 para 17 e `edicoes-publicadas` de 18 para 25. A mudança de valor de uma linha derivada precisa de um lugar no registo das mudanças, e estas duas medem o próprio projeto; o lugar `o-estado-do-pais` é o do E0, que ainda não aterrou e que, no seu ramo, só o declara para `correcoes-publicadas`. Medi, digo e paro aí: na cabeça do E1, `npm run build` e `npm run verify` saem com 1 no `ledger:check`, com as duas contas (calculado 17 contra 13 publicado; 25 contra 18), e `npm run typecheck` sai com 0. Com o mecanismo do E0 de 30.09 e as duas linhas declaradas nesse lugar, que são os dois remendos desta pasta, os três portões saem com 0 na mesma cabeça.

**Um segundo ponto medido, que digo e não construo.** O §2 do brief manda que «cada célula de tabela que passe sem linha ganha uma ou sai». Cada número das tabelas dos quatro estudos tem a sua linha no livro do estudo (o do motor, que viaja com o registo de conteúdo; a página do estudo lista em «Fontes e verificação» só as linhas que têm id no livro-razão do sítio, e as outras não se listam: corrigido na E1c): nenhuma quantidade sem linha no 16, no 17 e no 18, e no 19 só identificadores (endereços, carimbos de hora, o nome «Évora 27», números de artigo e de série). Mas linhas do livro-razão do sítio, das que atravessaram, as tabelas têm poucas: nos seis antigos, 1 196 figuras em células e 69 com linha do sítio; nos quatro novos, 1 107, das quais 69 pela medida dos registos e 75 com a marca da fonte do sítio nas páginas construídas, que é o que o leitor vê (corrigido na E1c: a medida dos registos perdia seis figuras, e a secção E1c diz porquê). Dar linha do sítio às outras seria atravessar centenas de linhas novas, com página, área, lugar e nome cada uma; tirar as tabelas seria tirar o conteúdo. Fica medido (a medida `celulas_e_linhas_do_sitio`) e para o lugar de direção decidir.

## 1 · O mandato, ponto a ponto

| # | O que | O que ficou | A medida |
|---|---|---|---|
| 0 | O pré-requisito | Não é deste bloco (é do E0). A linha `estudos-evora-publicados` muda pelo mecanismo: valor 4, a conta do arquivo 4, cinco entradas seladas, as quatro anteriores conservadas | `contador_dos_estudos_de_evora` |
| 1 | As contas da Câmara de Évora, 2010 a 2025 | No motor (16) e no sítio, nas duas línguas. A série do regulador impressa uma vez; a votação das contas de 2024 e o auditor contados uma vez, com as duas leituras ditas como leituras; as tabelas dos 69 e 64 dias de 2022, da direção da dívida e das duas séries que divergem de 2020 a 2023, com o que fica por saber | `contradicoes_i180` (pontos 6 e 7, e as cinco repetições) |
| 2 | Quem governou a Câmara de Évora, 2009 a 2025 | No motor (17) e no sítio, em português. A frase do mandato de 2009 a 2013 diz que as fontes dos pelouros não registam o presidente desse mandato nem os outros membros; a ficha da página de Évora diz uma só coisa; a correção envelhecida saiu | `contradicoes_i180` (pontos 5 e 8), `frases_envelhecidas`, a captura `concelho-mandatos` |
| 3 | A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara | No motor (18) e no sítio, nas duas línguas. Um só instantâneo do PRR, o de 2026-08-19, com a tabela das duas leituras do registo; a frase do equipamento do hospital saiu; o anexo das portas de financiamento leva a data e diz que os prazos passaram | `contradicoes_i180` (pontos 1 e 2), `frases_envelhecidas` |
| 4 | Évora 2027, Capital Europeia da Cultura | No motor (19) e no sítio, nas duas línguas, com ligações para o 16 e para o 18 e a tabela de São Bento de Cástris (3 000 000 e 6 750 000 euros no 19; o valor do registo do PRR, 6 000 000, vive no 18 e a tabela liga-lhe) | `contradicoes_i180` (`castris_no_19`) |
| 5 | Os seis estudos antigos | Alojados como estavam, a responder 200 (no `dist/` local), com a nota do sucessor à cabeça nas duas línguas, fora do índice dos estudos, da página do concelho e do mapa do sítio | `paginas` |
| 6 | Os documentos e o relatório | A estrutura (§8), o plano da fiabilidade (§12), o mapa do repositório e o README dizem os quatro estudos; este relatório, o `medidas.json`, as capturas | os commits do §7 |

## 2 · O mapa de migração

### 2.1 Os blocos

O compositor leva cada bloco de cada registo antigo para um estudo novo, com as emendas escritas no gabarito da pasta, ou fá-lo sair com a razão escrita; um bloco que não entra nem sai é uma falta e fecha o compositor. Em português, 673 blocos e 0 faltas; dois blocos do «Quinze Anos» (o 171 e o 172, a lista e o parágrafo das lacunas, na secção das fontes) repartidos pelo 16, pelo 17 e pelo 18, cada um com o que é seu (a medida `mapa_de_migracao`). O mapa bloco a bloco, com o destino de cada bloco ou a razão do corte, está em [mapa-de-migracao.json](mapa-de-migracao.json), e a tabela abaixo soma 678 destinos e não 677 porque um bloco do «Quinze Anos», o 64, entra no 16 e sai do 17 com a razão escrita (corrigido na E1c; as contas estão na medida `mapa_de_migracao_e1c`).

| Do estudo antigo | Para | Blocos que entram | Blocos que saem, com a razão escrita |
|---|---|---:|---:|
| «Prometido, Pago, Auditado» (04) | a economia e o dinheiro de fora (18) | 82 | 13 |
| «Economia, Investidores, Portas Abertas» (06) | a economia e o dinheiro de fora (18) | 44 | 5 |
| «Orçamentado, Pago, Devido» (07) | as contas da câmara (16) | 64 | 24 |
| «Quinze Anos, Cinco Mandatos» (08) | as contas da câmara (16) | 67 | 8 |
| «Quinze Anos, Cinco Mandatos» (08) | quem governou (17) | 65 | 25 |
| «Quinze Anos, Cinco Mandatos» (08) | a economia e o dinheiro de fora (18) | 12 | 1 |
| «Os Pelouros» (09) | quem governou (17) | 124 | 14 |
| «Évora 2027: o prometido» (14) | o Évora 2027 (19) | 129 | 1 |

Em inglês, 534 blocos: os mesmos destinos, e 87 blocos da edição inglesa do «Quinze Anos» que o motor tem e o sítio nunca alojou ficam sem destino, porque são os que vão para o 17, que não tem edição inglesa (o sítio só aloja o «Quinze Anos» e «Os Pelouros» em português). Se o 17 deve ganhar uma edição inglesa composta das edições inglesas do motor é uma decisão que deixo ao lugar de direção.

### 2.2 As linhas

As 69 linhas do livro-razão do sítio mudaram de estudo pelo exportador do motor (`publisher/export_site_rows.py`, com o `publisher/manifest.evora.json` a dizer o estudo novo de cada uma): muda o campo `study`, e o id, o valor e os outros campos ficam (0 linhas com outro campo mudado; o `rh_study` e o resumo da linha de origem iguais nas 69). Em 60 dessas linhas a diferença inclui também o comentário das reconferências, que o motor escreve com um texto só desde 23.09 (`core/reconferencias.py`, o commit `1253605` do motor) e que elas ainda tinham na forma antiga; a linha `indice-de-divida-limite-legal`, que atravessa com elas e fica no estudo dos concelhos, muda só nesse comentário. O registo do cruzamento confere os bytes, e o comentário fica como o motor o escreve (os dois números estão na medida `linhas_que_mudam_de_estudo`).

| Do estudo antigo | Para | Linhas |
|---|---|---:|
| «Economia, Investidores, Portas Abertas» | a economia e o dinheiro de fora (18) | 8 |
| «Orçamentado, Pago, Devido» | as contas da câmara (16) | 27 |
| «Os Pelouros» | quem governou (17) | 7 |
| «Prometido, Pago, Auditado» | a economia e o dinheiro de fora (18) | 7 |
| «Quinze Anos, Cinco Mandatos» | as contas da câmara (16) | 6 |
| «Quinze Anos, Cinco Mandatos» | a economia e o dinheiro de fora (18) | 2 |
| «Quinze Anos, Cinco Mandatos» | quem governou (17) | 12 |
| **total** | | **69** |

## 3 · As reconciliações (a I180)

Cada contradição das leituras de fora fica numa tabela, num estudo só, com a fonte de cada valor e o que fica por saber; a frase que saiu foi vista nos antigos e não está nos novos (a medida `contradicoes_i180`, com o conhecido-positivo de cada frase lida nos seis antigos).

1. **Os totais do PRR com três datas.** Fica um instantâneo, o de 2026-08-19, no 18 («O que foi prometido e o que foi pago»): €167 372 756 aprovados e €86 944 669 pagos, e uma tabela das duas leituras do registo (2026-08-07, com 167 337 246 euros aprovados, e 2026-08-19). A data de 2026-08-04 do estudo das contas era a da primeira versão do estudo do plano de recuperação e não a do instantâneo; o endereço do ficheiro lido tem 2026-08-19. Fica por saber o que o registo dizia nos dias sem leitura, porque o ficheiro do dia anterior desaparece da fonte. O 16 e o 17 não imprimem nenhum total do PRR.
2. **O equipamento do hospital.** Saiu a frase «a comprar-lhe agora»; o 18 diz que o equipamento tem dinheiro do plano de recuperação aprovado e, no instantâneo de 2026-08-19, nada pago.
3. **O Évora 2027 no orçamento de 2026.** O 16 («O que o plano de 2026 diz») tem a tabela dos três valores: €3 984 060, a parte de 2026 das obras do «Évora 2027» financiadas pelo plano de recuperação, na revisão do orçamento (Prestação de Contas 2025); €7 470 000, a aquisição de bens de capital que o texto das Grandes Opções do Plano e Orçamento 2026 aloca à iniciativa; €14 798 219†, o objetivo do anexo de investimentos que carrega a iniciativa, no anexo digitalizado. Fica por saber o valor do Évora 2027 no anexo digitalizado de 2026 linha a linha, que o brief manda dizer como por saber.
4. **Os ganhos que «param em 2022».** A frase saiu; a série socioeconómica do «Quinze Anos» veio para o 18, que chega a 2024.
5. **O mandato de 2009 a 2013.** O 17 diz que as fontes dos pelouros não registam o presidente desse mandato nem os outros membros, e que só sobrevive a biografia retrospetiva de uma vereadora; quem presidiu (José Ernesto d'Oliveira, e Manuel Melgão a partir de 2013-05-01) vem das eleições e dos documentos do município. A ficha da página de Évora deixou de dizer as duas coisas: os nomes, e a nota de que as fontes dos pelouros só têm, desse mandato, a biografia de uma vereadora. As notas dos mandatos de 2013 a 2017 e de 2017 a 2021 deixaram de dizer que as capturas «começam no mandato de 2021».
6. **A direção da dívida.** O 16 («A direção da dívida, lida de três maneiras») põe as três leituras numa tabela, cada uma com o que mede: o total legal desce com um degrau em 2024; o índice do regulador desce em cada ano de 2014 a 2024; a composição piora (a dívida a fornecedores e o prazo médio de pagamento). As duas séries da dívida (os relatórios e o ficheiro do regulador) ficam lado a lado de 2015 a 2024, com a diferença; nenhum documento lido explica os quatro a cinco milhões de euros de 2020 a 2023, e o estudo diz que fica por saber.
7. **Os 69 e os 64 dias de 2022.** A tabela no 16: 69 dias na série da Prestação de Contas 2025; 64 dias no relatório de gestão de 2022, que cita o regulador; o mesmo indicador, no mesmo ano.
8. **A correção envelhecida.** Saiu a nota dos «Pelouros» que corrigia o «Quinze Anos» por uma linha de cultura que este já tinha.

**As repetições.** A série da dívida do regulador, a votação das contas de 2024, a declaração de impossibilidade do auditor, os 137 dias e os €4 976 172 em atraso estavam cada uma em dois estudos antigos e estão agora num só, o 16. A mesma obra de São Bento de Cástris tem a tabela dos três documentos no 19. E nenhuma linha de origem é impressa em dois estudos novos (a medida `numeros_em_dois_estudos_novos`: 0 nos seis pares, com o conhecido-positivo de uma linha plantada); os valores iguais que aparecem em dois estudos são de medidas diferentes (contagens pequenas, anos de mandato e o mesmo 3 000 000 e 500 000 em obras diferentes), listados na medida.

## 4 · Os portões que mudaram de forma, e as plantas

Nenhum destes protege um número, uma fonte ou uma pessoa de outra maneira do que protegia; cada um mudou de forma porque a página mudou, e cada um tem a planta que prova que ainda morde.

- **A lista dos estudos (`scripts/check-lugar.mjs`, §7.4 e 8.6).** As «linhas» da lista passam a ser os estudos sem sucessor nas duas línguas (22, e não 34). A planta é a própria falha da primeira corrida do ensaio: 22 vistas contra 34 esperadas.
- **A cobertura B1 (o mesmo guião).** Um estudo com sucessor alcança-se da página de cada estudo que lhe sucede, e já não da lista nem da página do lugar. A planta foi a falha das 26 coberturas na corrida anterior à nota dos antecessores, e a das duas coberturas da página inglesa do 17, que ainda não tinha a nota (corrigida: a página de uma língua sem edição própria passou a ter as duas notas).
- **A catraca L1 (`scripts/lugar-tetos-b1.json`).** Sobe de 2 337 para 2 342 pela regra escrita no próprio guião: o sítio ganhou as sete páginas dos documentos alojados dos quatro estudos, e cada uma traz a mobília de todas as páginas de documento (a porta para o estudo duas vezes). As páginas que já existiam contam 2 335; nenhuma página antiga ganhou um destino repetido para uma rota de um estudo de Évora (a medida `l1_paginas_antigas`, com a agenda, que já ligava duas vezes ao documento do «Quinze Anos», à parte). A medição está em [l1-e1.json](l1-e1.json) e [l1-check-lugar.log](l1-check-lugar.log); a planta é a falha 2 342 contra 2 337.
- **O âmbito da prova do olho (`scripts/provar-eyetext.mjs`).** Sobe de 7 para 14 edições, relida sobre as sete novas: 1 141 blocos lidos contra 1 141 no registo, 5 980 unidades iguais carácter a carácter. A planta é a falha da corrida anterior (7 declaradas, 14 provadas).
- **A cadeia do marcador num documento alojado (`tests/livro/indice.mjs`, I6).** O 17 é o primeiro documento alojado a escrever «[a verificar]» (a edição portuguesa do «Quinze Anos» escrevia «[verify]»); dentro da moldura (`data-oedp-moldura`), a cadeia é texto do documento e conta-se à parte, como nas I2 e I4; fora dela, a regra fica igual. A planta, [provar-i6-e1.mjs](provar-i6-e1.mjs), monta um `dist/` de duas páginas e acusa as duas cadeias da página sem moldura e nenhuma do documento alojado ([prova-i6-e1.json](prova-i6-e1.json)).
- **O resto aprendeu a sucessão sem mudar o que confere:** a contagem dos estudos do lugar (`check-datas`, `check-pais` E2, `lib/prova.mjs`), as datas da nota do sucessor (`check-datas`), a voz da nota (`voz-b1`), as áreas das 69 linhas (`src/data/areas.mjs`, 69 de 69 cobertas uma vez), as origens das linhas de um estudo composto (`check-cadeia`, `gate-html`, `lib/cruzamento.mjs`) e os redirecionamentos das rotas de leitura das sete edições novas (`vercel.json`, uma entrada por registo).

## 5 · As medidas e os conhecidos-positivos

| Medida | O valor | O conhecido-positivo | Mordeu |
|---|---|---|---|
| `cabecas` | sítio `441c2eb8` sobre `07549ee1`; motor `6ed528b` sobre `4b46bef` | git cat-file -t de cada cabeça diz «commit» | sim |
| `motor_estudos_novos_ficheiros` | 7 edições, 0 ficheiros em falta | uma edição plantada que não existe é dada em falta | sim |
| `motor_medidas_das_entregas` | 14 de 14 entregas iguais ao registo do portão; a dívida declarada é de atribuições no 17 e no 18 | uma cópia do 16 com «€987 654 321» sem linha dá um órfão a mais | sim |
| `motor_portao` | código 0 em `6ed528b` | o código lido do ficheiro concorda com a última linha do registo (PASS com 0, FAIL sem 0) | sim |
| `linhas_que_mudam_de_estudo` | 69 linhas, 69 para um estudo novo, 0 com outro campo mudado, 69 com a origem igual | uma cópia de uma linha com o valor mudado aparece como diferença no campo value | sim |
| `numeros_em_dois_estudos_novos` | 0 linhas de origem impressas em dois estudos | uma linha de origem do 16 plantada no conjunto do 17 dá uma repetição | sim |
| `celulas_de_tabela_sem_linha` | 0 quantidades sem linha no 16, no 17 e no 18; no 19, só identificadores (0 por classificar) | uma tabela plantada no fim do 16 com «123 456» dá uma célula sem linha a mais | sim |
| `celulas_e_linhas_do_sitio` | antigos 1196 figuras em células, 69 com linha do sítio; novos 1107 e 69 | o detetor vê figuras com linha do sítio (a tabela do regulador no 16) e sem ela (nos antigos) | sim |
| `selos_das_figuras` | 83 correções de selo aplicadas e 57 não-números sem selo, nas edições portuguesas | o compositor recusa uma correção que não cai em nenhuma figura: a planta está no core/compor_test.py, que o portão do motor corre (a contagem de PASS no registo do portão) | sim |
| `mapa_de_migracao` | 673 blocos em português, 0 faltas, 2 repartidos; 534 em inglês, 87 sem destino | o mesmo mapa sem o gabarito do 17 dá faltas: os blocos do «Quinze Anos» que entram no 17 ficam sem destino | sim |
| `contradicoes_i180` | as oito, cada uma vista e resolvida (§3) | cada frase que sai foi vista em pelo menos um dos seis antigos, e cada repetição em pelo menos dois | sim |
| `frases_envelhecidas` | 0 nos novos, 0 na ficha de Évora | as frases são vistas nos antigos (a soma nos antigos é maior do que zero) | sim |
| `achados` | os seis achados que têm algarismo (§6) | cada detetor encontra o defeito no estudo antigo onde ele estava | sim |
| `paginas` | a lista com 4 estudos de Évora e 0 antigos, 4 perguntas; 12 páginas antigas com a nota e fora do índice; 0 endereços antigos no mapa do sítio | os detetores de data-estudo e de data-sucessor-edicao veem-nos numa página plantada | sim |
| `l1_paginas_antigas` | 2342 páginas = 2335 que já existiam + 7 novas | uma página plantada com duas ligações no corpo para o estudo das contas (e uma no cabeçalho) dá um destino repetido | sim |
| `contador_dos_estudos_de_evora` | linha 4, conta 4, 5 entradas seladas | a mesma conta sobre o studies.mjs da base dá o valor que a linha tinha na base | sim |
| `contadores_do_arquivo_a_paragem` | estudos: linha 13, conta 17; edições: linha 18, conta 25 | na base, a mesma comparação concorda (a linha e a conta dão o mesmo número) | sim |
| `capturas` | 32 de 32 sha256 conferidos, 0 problemas | dois corpos que diferem num byte dão sha256 diferentes | sim |
| `portoes_do_sitio` | real 1/1/0; ensaio 0/0/0 | o leitor dos ficheiros de código lê 1 num ficheiro plantado com 1 | sim |
| `custo` | 20071 segundos de relógio desde a criação dos ramos | a criação do ramo é a última linha do reflog e diz «branch: Created from» | sim |

## 6 · Achados

1. **Os selos errados dos registos antigos.** Nos registos de agosto e setembro, um algarismo que empatava em valor com outra linha ficava, às vezes, com a linha de outra eleição ou de outra lista: no «Quinze Anos», a linha dos lugares da CDU em 2013 selava também o 4 dos mandatos de 2001 a 2005 e de 2017 a 2021 e o de uma linha do PS; no 17, a mesma linha sela só o mandato de 2013 a 2017 e a linha da CDU nas eleições de 2013 (a medida `achados`). Os estudos novos levam as correções escritas em `ajustes.json` (`decisoes_corrigidas`): 83 aplicadas nas edições portuguesas, e os 57 algarismos que o registo antigo selava e que não são números (os de um código, de um ordinal, de uma etiqueta ou de uma página) ficam sem selo pela regra automática do compositor. As páginas antigas perdem os selos porque o cruzamento passou a nomear os estudos novos, e os selos errados saem com elas.
2. **O «Orçamentado» dizia que o orçamento de 2026 tinha €3 984 060 para as obras do «Évora 2027».** O valor vem da Prestação de Contas 2025 (a linha `evora2027-gop-2026`, p. 109), que o dá como a parte de 2026 do projeto Évora 2027 financiado pelo PRR, nas alterações ao orçamento. O 16 diz de onde vem; ainda escreve «as obras», onde a fonte diz «projeto», e a troca da palavra fica para uma passagem do motor.
3. **O par do PRR com a data trocada:** o «Orçamentado» imprimia os valores de 2026-08-19 com a data de 2026-08-04 (a linha `prr-approved-evora-0804`, com o endereço de 20260819). O 18 diz isso na tabela das duas leituras.
4. **Frases em inglês na edição portuguesa dos «Pelouros»** (o bloco 39): o 17 tem-nas em português.
5. **O «Évora 2027» de setembro mostrava os asteriscos do itálico** no bloco 11; o renderizador novo (`core/documento_md.py`) não os mostra.
6. **A edição portuguesa do «Quinze Anos» escreve «[verify]»** duas vezes, no lugar do marcador da casa; fica como edição datada, e o 17 escreve «[a verificar]».
7. **A agenda liga duas vezes ao documento do «Quinze Anos»,** que passou a ser uma edição datada. Os acontecimentos vêm do `content/08/Technical Source/watch_next_events.py` do motor, que `sweeps/` corre, e `sweeps/` não se toca; a página datada tem a nota do sucessor.
8. **O `content/README.md` do motor manda mover o superado para `archive/`;** não se pode sem partir `sweeps/monthly.sh` e `indicators/varrimento.py`, que correm o guião do 08. As pastas ficam onde estão e o README diz a sucessão.
9. **O Évora 2027 continua fora do índice dos motores de busca,** como o estudo de setembro de onde vem, porque não tem leitura em `src/data/leituras.mjs`. Dar-lha é uma decisão editorial.
10. **A data da edição do 18.** O anexo das portas de financiamento diz «À data desta edição, 2026-09-30» (o dia em que o registo foi fixado), e a página diz que a edição foi publicada a 01.10.2026 (a data do commit do motor que escreveu os bytes, pela regra das datas do sítio).
11. **Os caches dos recortes.** O `export_site_rows.py` precisa dos `snippets.json` das verticais 07, 08 e 09, que o Git ignora; copiei-os da árvore principal do motor para a worktree do bloco, sem os acrescentar a nenhum commit.

## 7 · Os commits

No motor, ramo `e1-2026-09-30` sobre `4b46bef`, só com o `Co-Authored-By`, cada um com o `python3 -m core.gate` do pre-commit verde:

- `6ed528b` E1: o 17 deixa de nomear o «documento companheiro» que envelheceu
- `bba572e` E1: uma ligação cujo texto é o próprio endereço dá uma ligação só
- `b3adf46` E1: a pergunta do 19, a data de fixação de cada estudo, e as origens das linhas no sítio
- `343ba70` E1: o content/README.md diz a sucessão dos seis estudos de Évora
- `7b1f063` E1: as 69 linhas de Évora mudam de estudo no sítio, e as edições novas atravessam
- `cb89bde` E1: os registos de conteúdo dos quatro estudos novos
- `2ff34de` E1: os quatro estudos de Évora compostos dos registos dos seis antigos

No sítio, ramo `e1-2026-09-30` sobre `07549ee1`, com o `Co-Authored-By` e o `Claude-Session`:

- `441c2eb8` E1: a nota do sucessor diz «a 01.10.2026 sucedeu-lhe», e não «sucedido por»
- `3cab1215` E1: a nota dos pelouros do mandato de 2009 a 2013 diz o que o estudo de quem governou a câmara diz
- `b84039d0` E1: a estrutura, o plano da fiabilidade, o mapa do repositório e o README dizem os quatro estudos de Évora
- `822b93b3` E1: a linha dos estudos publicados sobre Évora passa de 6 a 4 pelo mecanismo das linhas derivadas
- `0abba32c` E1: os quatro estudos entram no arquivo, e os seis antigos ficam como edições datadas com a nota do sucessor
- `1c811075` E1: as 69 linhas de Évora mudam de estudo, e o cruzamento conhece as origens
- `fcc2ad44` E1: os registos dos quatro estudos de Évora e os documentos realojados
- `8e2fe1d6` E1: os documentos dos quatro estudos de Évora, alojados como vieram do motor
- e o commit deste relatório, que não pode trazer o seu próprio identificador

## 8 · Os portões

| Corrida | Cabeça | `npm run build` | `npm run verify` | `npm run typecheck` |
|---|---|---:|---:|---:|
| o estado real do E1 | `441c2eb8` | 1 | 1 | 0 |
| o ensaio, com os dois remendos | `441c2eb8` | 0 | 0 | 0 |

O portão do motor, `python3 -m core.gate`, em `6ed528b`: código 0 ([portoes/motor/](portoes/motor/)), de 2026-10-01T02:18:58Z a 2026-10-01T02:22:45Z. No estado real, o `build` e o `verify` param no `ledger:check` com as duas contas do arquivo (as linhas que o registo traz estão em [portoes/real/](portoes/real/)); no ensaio, os três passam inteiros ([portoes/ensaio/](portoes/ensaio/)).

As corridas em cabeças anteriores estão em [portoes/corridas-intermedias.json](portoes/corridas-intermedias.json). Os registos dos portões trazem o caminho da árvore trocado por `[repositorio]` e o do motor por `[motor]`; os códigos são os que os processos escreveram. A corrida «portão» do GitHub corre quando o lugar de direção publicar o ramo; este bloco não faz `push`.

## 9 · As decisões em vigor

`python3 scripts/leituras/decisoes-em-vigor.py` correu sobre os ficheiros que o bloco ia tocar, antes de construir ([sítio](decisoes-em-vigor-sitio-antes.log), [motor](decisoes-em-vigor-motor-antes.log)), e de novo sobre os dois intervalos do bloco ([sítio](decisoes-em-vigor-sitio-intervalo.log), [motor](decisoes-em-vigor-motor-intervalo.log)): nenhuma citação de uma decisão saiu num diff. As que estão perto das mudanças e que conferi: a §1.24 (a nota interna de cada linha, que não se publica), a §1.40 (uma descrição que diga ser a frase de abertura tem de o ser: as descrições dos estudos novos não o dizem, e a frase de abertura de cada um entra transcrita como pergunta, por `src/data/verbatim.mjs`), a §1.49 (o instantâneo do PRR de 2026-08-19), a §1.111 (a abertura de cada estudo) e a §1.124 (as áreas). Nenhum ficheiro foi apagado.

## 10 · O custo

O modelo: Claude Opus 5.5, na definição `construtor`, em todo o bloco (no motor e no sítio). O relógio: 20071 segundos desde a criação dos dois ramos (2026-09-30T21:54:34+01:00) até à medida (2026-10-01T02:29:05+00:00). Os símbolos: 2502873, uma transcrição e não uma medida (corrigido na E1c): o construtor leu o contador do orçamento que a ferramenta lhe mostra, 15000000 no início da sessão e 12497127 na leitura antes da medida das 02:29 UTC de 01.10.2026, e passou a diferença ao guião por uma variável de ambiente; o guião não lê contador nenhum, e o conhecido-positivo da medida `custo` é o do relógio, não o dos símbolos. O total que conta é o que a ferramenta reporta ao lugar de direção no fim do agente, que inclui este relatório e o fecho.

## 11 · O que fica por fazer

1. **Os dois contadores do arquivo, depois do E0.** Quando o E0 aterrar com o lugar `o-estado-do-pais`, o que o E1 pede é o [ensaio-2-contadores-do-arquivo.patch](ensaio-2-contadores-do-arquivo.patch), adaptado ao mecanismo que o E0 deixar: declarar `estudos-publicados` e `edicoes-publicadas` nesse lugar, a segunda leitura do `check-pais` a confirmá-lo pelas duas expressões, os nomes das duas medidas, a entrada `atualizacao` de cada uma (13 para 17, 18 para 25) selada pelo `selar-historia-valores.mjs`, e a chave `16.09.2026` a sair de `src/i18n/lingua-dos-titulos.mjs`. O [ensaio-1-mecanismo-do-e0.patch](ensaio-1-mecanismo-do-e0.patch) é a cópia do mecanismo do E0 de 30.09 com que ensaiei, e não é para aterrar.
2. **As células das tabelas sem linha do sítio** (o segundo ponto medido, no «Em resumo»): decidir se o §2 do brief quer linhas do sítio ou do estudo.
3. **A revisão do lugar de direção:** as aberturas dos quatro estudos («Em resumo», «O que este projeto conclui», «O que podia funcionar melhor») são prosa nova minha, com cada número por marcador de uma linha; as três leituras copiadas para os estudos novos (`src/data/leituras.mjs`: a das contas para o 16, a dos pelouros para o 17 e a do dinheiro público para o 18); e a edição inglesa do 17.
4. **A leitura a frio** do Codex `gpt-6.1-sol`, e a segunda leitura da `gpt-6-astra` por ser um bloco grande (§1.147), com cinco estragos plantados nas cópias do pacote.

## E1b · a passagem de 01.10.2026

*Relatório do construtor da passagem E1b: Claude Opus 5.5 (a definição `construtor`), a 01.10.2026, pelo mandato [prompts/PROMPT-e1b-construtor.md](prompts/PROMPT-e1b-construtor.md), com as quatro decisões do lugar de direção sobre os pontos de paragem do E1 e as emendas às quatro aberturas. Cada número desta secção está em [medidas.json](medidas.json), na chave `e1b`, escrito por [e1b/medir-e1b.py](e1b/medir-e1b.py) com o nome, o valor, o comando e um conhecido-positivo de cada medida, ou num ficheiro de [e1b/](e1b/) e de [portoes/](portoes/) com o código escrito depois de o processo acabar. As secções 1 a 11, acima, são do construtor anterior e ficam como ele as escreveu: os identificadores dos commits do sítio que elas citam são os de antes do rebase, e a correspondência está em E1b.5.*

### E1b.0 · Em resumo

O mandato fez-se pela ordem que ele diz. O ramo do sítio está rebaseado sobre `main`, com o mecanismo do E0. Os dois contadores do arquivo mudaram por esse mecanismo, `estudos-publicados` de 13 para 17 e `edicoes-publicadas` de 18 para 25, cada um com o lugar `o-estado-do-pais`, a razão escrita, uma entrada de atualização selada e a derivação a bater com o `check`. As emendas às aberturas fizeram-se no motor, no 16, no 18 e no 19, nas duas línguas onde há edição inglesa, com o portão do motor a 0, e atravessaram para o sítio com o `check:documentos` a 0, também com a origem conferida contra o motor. O Évora 2027 tem a sua leitura e entrou no índice dos motores de busca e no mapa do sítio. A conferência das cópias das leituras achou a origem da leitura do 18 fora da letra do documento, e ela foi refeita. A edição inglesa do 17 fica como dívida (E1b.10).

Um ponto medido e dito, que não fiz: o 19 escreve o sinal do euro depois do número, na abertura e no corpo, como o estudo de setembro de onde vem (E1b.3).

### E1b.1 · O mandato, ponto a ponto

| # | O que | O que ficou | A medida |
|---|---|---|---|
| 1 | O rebase do ramo do sítio sobre `main` | Rebaseado sobre a cabeça em que o E0 aterrou: 11 commits reposicionados, 1 conflito (`src/i18n/lingua-dos-titulos.mjs`, as chaves das datas), resolvido guardando as duas pela ordem das datas. As 7 datas de publicação dos documentos novos passaram ao commit novo, e batem com o `git` | `rebase_sobre_main`, `datas_de_publicacao` |
| 1 | Os dois contadores do arquivo, pelo mecanismo | `estudos-publicados` de 13 para 17 e `edicoes-publicadas` de 18 para 25, cada um com o lugar `o-estado-do-pais`, a razão escrita, uma entrada de atualização selada e a derivação a bater com o `check`; 14 plantas, todas a morder | `contadores_do_arquivo`, `plantas_dos_contadores` |
| 2 | As emendas às quatro aberturas, no motor | As 9 trocas, cada uma 0 vezes a frase velha e 1 a nova, no motor e no documento alojado, nas duas línguas onde há edição inglesa; os negritos das frases de abertura de «O que este projeto conclui» no 19, 5 por edição, passam a 0. O 17 não tinha emenda | `emendas_das_aberturas`, `sinal_do_euro` |
| 2 | Os `.md` e os `.html` pelo mesmo caminho, os registos e os `.cortes.json` refeitos | Os gabaritos de cada pasta, o `core/compor.py`, o `make_html.py` da pasta e o `publisher/export_records.py`, o caminho com que os estudos foram compostos; 6 registos refeitos e 6 `.cortes.json` relidos, iguais e sem operações | `cortes_inalterados`, `travessia_e1b` |
| 2 | O portão do motor a 0 | 0 na cabeça do motor, e o pre-commit a passar nos dois commits | `portoes_e1b` |
| 2 | A travessia, com o `check:documentos` a 0 | Os 6 registos e os 6 documentos do 16, do 18 e do 19 com os resumos a bater no sítio e no motor; o `check:documentos` com 0, e com 0 com a origem conferida contra o motor | `travessia_e1b` |
| 2 | As cópias das leituras refeitas, e a conferência | Antes, 3 cópias por bater (a do 18 nas duas línguas, e o 19 sem leitura); depois, 0 | `leituras_conferidas` |
| 3 | A leitura do 19 | No índice e no mapa do sítio, nas duas línguas (antes da passagem, as duas páginas tinham noindex, como a captura do E1 regista); a lista dos estudos rende a frase como resumo | `leitura_do_19_e_pagina_inglesa_do_17` |
| 3 | A nota de dívida da edição inglesa do 17 | A página inglesa mostra o título português, a nota dos estudos que sucede e a porta para o documento português, como as dos dois estudos antigos; a dívida em E1b.10 | `divida_da_edicao_inglesa_do_17` |
| 4 | Os portões, as capturas, o relatório | Os três portões do sítio pela tranca na cabeça de código e a corrida final na cabeça do relatório; 34 capturas, nas larguras de 390 e de 1280 px, com 0 problemas; esta secção e a resposta curta | `portoes_e1b`, `capturas_e1b`, `custo_e1b` |

### E1b.2 · As decisões do lugar de direção, e o que se fez com cada uma

1. **Os dois contadores do arquivo mudam pelo mecanismo.** O ramo rebaseou-se sobre `main` (`git rebase main`, no ramo ainda não publicado), e as duas linhas ganharam o lugar `o-estado-do-pais` em `src/data/lugar-das-linhas.mjs`, com a razão escrita ao lado (medem o próprio projeto, não Portugal, uma região nem um concelho), e uma entrada `atualizacao` cada, com a razão do mandato: os quatro estudos e as sete edições publicados a 01.10.2026, e as edições antigas que continuam alojadas e contam. As duas entradas estão seladas em `ledger/historias-valores.json` pelo `scripts/selar-historia-valores.mjs`. O `ensaio-2-contadores-do-arquivo.patch` foi o ponto de partida, adaptado ao mecanismo que aterrou: a segunda leitura do `check-pais` deixa de ser um bloco à parte e passa a ser a lista das expressões verificadas das contagens do projeto (`CONTAGENS_DO_PROJETO`: a das correções, que o E0 já tinha, e as duas do arquivo), a mesma porta estreita, de onde a dos estudos sobre Évora fica de fora, porque mede Évora; os nomes das duas medidas entram nas linhas derivadas, e a chave `16.09.2026` sai da língua das edições, porque nenhuma linha a traz. O `ensaio-1` não aterrou: o mecanismo é o de `main`.
2. **As células das tabelas ficam com a linha do próprio estudo.** Nenhuma linha atravessou. A medida `celulas_e_linhas_do_sitio` do E1 fica como está (§5, acima): nos quatro estudos novos, 1107 figuras em células, 69 com linha do sítio e 1038 sem ela, todas com a linha do livro do estudo no motor. (Corrigido na E1c: nas páginas construídas, que é o que o leitor vê, as figuras com a marca da fonte do sítio são 75; a medida dos registos perdia seis, como a secção E1c diz.)
3. **O 17 fica só em português.** A página inglesa do sítio mostra o título português, a nota dos estudos que sucede e a porta para o documento português, como as dos dois estudos antigos de onde vem; a edição inglesa do «Quinze Anos» (e a de «Os Pelouros») que o motor tem e o sítio nunca alojou fica como dívida em E1b.10.
4. **O Évora 2027 ganha a sua leitura.** Em `src/data/leituras.mjs`, como as outras três: a frase assenta nas duas frases impressas na abertura do estudo que a origem cita, letra a letra, com a linha; não tem números, porque o estudo não tem linhas no livro-razão do sítio, e por isso também não tem medidas. Entrou no índice e no mapa do sítio nas duas línguas.

### E1b.3 · O que medi e digo, e o que não fiz

- **O sinal do euro no 19.** O mandato pede, no «Em resumo» do 18, os valores em prosa com o mesmo sinal nos quatro estudos, na forma «€576 491 544», «como as outras frases do mesmo estudo e os outros estudos». Medi as três formas (o sinal antes, o sinal depois, a palavra «euros») na leitura de abertura e no corpo das sete edições, antes e depois da passagem (`sinal_do_euro`). O 18 escrevia a palavra duas vezes na abertura, nas duas línguas, e passa a zero; o 16 e o 17 escrevem o sinal antes. O 19 escreve o sinal depois do número, na abertura (5 vezes em cada edição) e no corpo (127 em cada edição), que é a forma do estudo de setembro de onde vem. Pôr o sinal à frente só na abertura do 19 partia o estudo em duas formas, e pô-lo também no corpo era mexer no texto copiado, fora das aberturas, que o mandato deixa como está. Fiz o 18, que é o caso que o mandato nomeia, e deixei o 19: a premissa «como os outros estudos» não vale para ele, e a decisão é do lugar de direção.
- **As edições inglesas.** O mandato escreve as emendas em português. As aberturas do 16, do 18 e do 19 existem nas duas línguas e dizem o mesmo, e por isso a mesma emenda entrou na edição inglesa de cada um: «a relatively prosperous municipality in a region below the national average» e o sinal à frente no 18, as frases de abertura sem negrito no 19, «project» no 16. A medida conta as duas línguas.
- **As outras «obras» do 16.** A palavra mudou onde o achado 2 do §6 a pôs: a tabela do Évora 2027 no orçamento de 2026, onde a Prestação de Contas 2025 escreve «intervenções estruturantes no âmbito do projeto Évora 2027, financiado pelo PRR» (o excerto da linha `om-2025-saldo-integrado` no livro do estudo). Ficam duas: a da abertura («como as obras do plano de recuperação», a síntese do mecanismo da execução, que não cita essa frase da fonte) e a do bloco copiado do «Orçamentado» («as obras do projeto «Évora 2027» financiado pelo PRR»), que já diz «projeto» onde a fonte o diz.
- **As palavras da leitura do 19.** A frase da leitura diz «o da câmara é o que falta» onde o estudo diz «o do município é o que falta»: «município» fica fora do vocabulário fechado do sítio quando é a voz do projeto (§1.98), e a L3 do `check:lugar` mediu-a na segunda corrida dos portões. A edição inglesa diz «the council's», como a leitura do 18. A origem continua a citar a frase do estudo letra a letra.

### E1b.4 · Achados

1. **A origem da leitura do 18 não era a frase impressa.** Citava «As localizações de projeto vencidas levam 61,32% do valor aprovado para o concelho.», com ponto final, e o documento continua com uma vírgula («…para o concelho, e as datas de conclusão…»); a conferência das cópias apanhou-a nas duas línguas (antes da correção, 3 falhas: o 18 nas duas línguas e o 19 sem leitura). E o «paga» da frase não assentava em nenhuma das duas linhas citadas. A origem passou a citar a frase inteira e a da abertura com o dinheiro pago; a frase da leitura não mudou. As origens do 16 e do 17 batiam.
2. **Um rebase muda o commit que acrescentou cada documento.** O `src/data/datas-de-publicacao.json` guarda a data e o commit de cada edição, e o `check-datas`, com a história completa, compara os dois (`scripts/check-datas.mjs`, «declarada.commit !== commit»). Depois do rebase, as 7 edições novas apontavam para o commit de antes; o `node scripts/datas-de-publicacao.mjs` reescreveu-as, e as datas ficaram. Um ramo rebaseado que traga documentos novos tem de correr esse guião.
3. **As leituras dos estudos já só rendem as duas primeiras frases.** Desde o B1 a página do estudo rende o documento, e a lista dos estudos, a página de Évora e a primeira página leem só as duas primeiras frases da leitura; as medidas e a nota das leituras ficam no ficheiro e o portão de HTML confere as duas línguas delas, mas nenhuma página as mostra. A do 19 não tem medidas nem nota.
4. **Dois portões pediram a forma da frase nova**, e as duas paragens ficam nas corridas intermédias, com a razão no commit seguinte: o portão da voz pediu-a no inventário das frases (primeira corrida, 4 blocos por classificar: as duas línguas, na lista e na página de Évora), e a L3 do `check:lugar` pediu «a câmara» (segunda corrida, 2 ocorrências de «município»).
5. **Os ficheiros de operações de voz não mudam com o texto.** Os `.cortes.json` dos estudos compostos estão vazios por decisão escrita, e o exportador de registos relê-os em cada corrida: os 6 do 16, do 18 e do 19 ficaram iguais, sem operações.

### E1b.5 · Os commits

No motor, ramo `e1-2026-09-30` sobre `master`, só com o `Co-Authored-By`, cada um com o `python3 -m core.gate` do pre-commit a passar (os registos em [e1b/motor-travessia/](e1b/motor-travessia/)):

- `8c8f227` E1b: as emendas do lugar de direção às aberturas do 16, do 18 e do 19
- `79ab4d5` E1b: os registos de conteúdo do 16, do 18 e do 19 refeitos depois das emendas

No sítio, ramo `e1-2026-09-30`, rebaseado sobre `main` (`dd7f6208`), com o `Co-Authored-By` e o `Claude-Session`:

- `90b1ba0a` E1: a corrida final dos portões do construtor anterior na cabeça c6bdf941, deixada na árvore depois do último commit (o primeiro commit desta passagem, feito antes do rebase como `3741a05b`)
- `992241f5` E1b: as datas de publicação apontam para os commits do ramo rebaseado sobre main
- `8ffcf085` E1b: as duas contagens do arquivo passam a 17 estudos e a 25 edições pelo mecanismo das linhas do projeto
- `df9a3f73` E1b: os documentos e os registos do 16, do 18 e do 19 voltam do motor depois das emendas às aberturas
- `335e0ef0` E1b: o Évora 2027 ganha a sua leitura, e as cópias das leituras dos quatro estudos conferem com o texto do motor
- `634aea12` E1b: a leitura do Évora 2027 entra no inventário das frases, e a primeira corrida dos portões fica com a razão
- `64ff4b4a` E1b: a leitura do Évora 2027 diz «a câmara», a palavra do sítio para quem governa o concelho, e a segunda corrida dos portões fica com a razão (a cabeça de código)
- o commit deste relatório, com as provas da passagem, que não pode trazer o seu próprio identificador
- e o commit seguinte, com os códigos da corrida final dos portões na cabeça do relatório

O rebase deu identificadores novos aos commits do E1 e aos dois primeiros desta passagem; a correspondência, lida do `git` e emparelhada pelo assunto (a medida `rebase_sobre_main`):

| antes do rebase | depois | assunto |
|---|---|---|
| `8e2fe1d6` | `779bb7b6` | E1: os documentos dos quatro estudos de Évora, alojados como vieram do motor |
| `fcc2ad44` | `0f39d121` | E1: os registos dos quatro estudos de Évora e os documentos realojados |
| `1c811075` | `a0bdcdeb` | E1: as 69 linhas de Évora mudam de estudo, e o cruzamento conhece as origens |
| `0abba32c` | `8a4941a0` | E1: os quatro estudos entram no arquivo, e os seis antigos ficam como edições datadas com a nota do sucessor |
| `822b93b3` | `43d9f3eb` | E1: a linha dos estudos publicados sobre Évora passa de 6 a 4 pelo mecanismo das linhas derivadas |
| `b84039d0` | `76157bc8` | E1: a estrutura, o plano da fiabilidade, o mapa do repositório e o README dizem os quatro estudos de Évora |
| `3cab1215` | `ecef4c56` | E1: a nota dos pelouros do mandato de 2009 a 2013 diz o que o estudo de quem governou a câmara diz |
| `441c2eb8` | `cbf489b8` | E1: a nota do sucessor diz «a 01.10.2026 sucedeu-lhe», e não «sucedido por» |
| `c6bdf941` | `1f4cc320` | E1: o relatório do construtor, as medidas, as capturas e os portões |
| `413505a4` | `634cfae0` | E1b: o mandato da passagem E1b, com as decisões do lugar de direção sobre os pontos de paragem e as emendas às quatro aberturas |
| `3741a05b` | `90b1ba0a` | E1: a corrida final dos portões do construtor anterior na cabeça c6bdf941, deixada na árvore depois do último commit |

### E1b.6 · Os portões

Os três portões do sítio correram sempre pela tranca da máquina (`sh scripts/leituras/portoes.sh`), cada um no seu comando, com o código escrito num ficheiro depois de o processo acabar e a cabeça ao lado ([portoes/e1b-intermedias/](portoes/e1b-intermedias/)). Os registos levam o caminho da árvore trocado por `[repositorio]` e o do motor por `[motor]` ([e1b/redigir.py](e1b/redigir.py)).

| Corrida | Cabeça | `npm run build` | `npm run verify` | `npm run typecheck` | O que parou |
|---|---|---:|---:|---:|---|
| 1 | `335e0ef0` | 1 | 1 | 0 | o portão da voz: 4 blocos por classificar, a frase da leitura do 19 |
| 2 | `634aea12` | 0 | 1 | 0 | a L3 do `check:lugar`: 2 ocorrências de «município», na mesma frase |
| 3, a cabeça de código | `64ff4b4a` | 0 | 0 | 0 | nada: os três a 0, com a árvore limpa no fim |

A corrida final, na cabeça do commit deste relatório, faz-se depois dele, e os seus códigos entram no commit seguinte, em [portoes/e1b/](portoes/e1b/). O portão do motor, `python3 -m core.gate`, na cabeça final do motor: código 0 em `79ab4d5` ([e1b/motor/](e1b/motor/)), de 2026-10-01T03:52:17Z a 2026-10-01T03:56:05Z, com a árvore do motor limpa; e o pre-commit passou nos dois commits do motor. A corrida «portão» do GitHub corre quando o lugar de direção publicar o ramo; esta passagem não faz `push`.

### E1b.7 · As medidas e os conhecidos-positivos

| Medida | O valor | O conhecido-positivo | Mordeu |
|---|---|---|---|
| `cabecas_e1b` | sítio: a cabeça de código `64ff4b4a` sobre `dd7f6208`; motor: `79ab4d5` sobre `4b46bef`, depois de `6ed528b` | `git cat-file -t` de cada cabeça diz «commit» | sim |
| `rebase_sobre_main` | rebaseado (a base de fusão é a cabeça de `main`), 11 de 11 commits reposicionados, 1 conflito | a cabeça de antes do rebase tem a base antiga por base de fusão | sim |
| `datas_de_publicacao` | 7 edições novas, 7 a bater com o `git`, 0 com o commit antigo, todas de 01.10.2026 | o ficheiro de antes da passagem não batia em nenhuma das 7 | sim |
| `contadores_do_arquivo` | 17 contra a conta 17 e 25 contra a conta 25, cada uma com 1 entrada selada e o lugar `o-estado-do-pais` | as mesmas linhas antes da passagem (13 e 18) contra a conta de hoje | sim |
| `plantas_dos_contadores` | 14 de 14 a morder | os dois portões sem estrago saem com 0 | sim |
| `emendas_das_aberturas` | as 9 trocas feitas no motor e no documento alojado; os negritos do 19 de 5 para 0 em cada edição | cada frase velha está no motor antes da passagem, e os negritos antes são 5 | sim |
| `sinal_do_euro` | a abertura do 18 de 2 para 0 na palavra, nas duas línguas; o 19 com o sinal depois, 5 na abertura e 127 no corpo, em cada edição | uma cadeia plantada com uma forma de cada dá 1, 1 e 1 | sim |
| `cortes_inalterados` | 6 de 6 iguais, 0 operações | o leitor da lista conta 1 numa lista plantada com uma operação | sim |
| `travessia_e1b` | 6 registos e 6 documentos com os resumos a bater; `check:documentos` 0, e 0 com a origem | o resumo que o manifesto de antes dava ao documento do 16 já não é o dos bytes alojados | sim |
| `leituras_conferidas` | 3 falhas antes, 0 depois | o detetor diz «não está» a duas frases que as emendas tiraram e a uma cópia com uma palavra trocada | sim |
| `leitura_do_19_e_pagina_inglesa_do_17` | as duas páginas do 19 sem noindex e no mapa do sítio; a lista rende a frase; a página inglesa do 17 aponta o documento português | a edição datada do Évora 2027 de setembro tem noindex e não está no mapa, e a página inglesa do 16 rende o documento inglês | sim |
| `divida_da_edicao_inglesa_do_17` | os registos ingleses do 08 e do 09 no motor (173 e 138 blocos), nenhum alojado; sem gabarito inglês no 17 | o mesmo detetor vê o gabarito inglês do 16 | sim |
| `portoes_e1b` | as três corridas do sítio (E1b.6) e o portão do motor a 0 | o código do portão do motor concorda com a última linha do seu registo | sim |
| `capturas_e1b` | 34 de 34 sha256 conferidos, 0 problemas, 0 pedidos para fora | dois corpos que diferem num byte dão resumos diferentes | sim |
| `custo_e1b` | E1b.9 | o reflog do ramo tem a linha do primeiro commit da passagem | sim |

O `python3 scripts/leituras/conferir-relatorio.py` corre sobre este relatório inteiro e lê os JSON da pasta ([e1b/conferir-relatorio-e1b.json](e1b/conferir-relatorio-e1b.json)): os números sem ficheiro que aponta são todos das secções 1 a 11, do E1, e nesta secção não aponta nenhum.

### E1b.8 · As decisões em vigor

O `python3 scripts/leituras/decisoes-em-vigor.py` correu sobre os ficheiros que a passagem ia tocar, antes de mexer ([sítio](decisoes-em-vigor-sitio-e1b-antes.log), [motor](decisoes-em-vigor-motor-e1b-antes.log)), e de novo sobre os dois intervalos da passagem ([sítio](e1b/decisoes-em-vigor-sitio-e1b-intervalo.log), [motor](e1b/decisoes-em-vigor-motor-e1b-intervalo.log)): nenhuma citação de uma decisão saiu num diff, e nenhum ficheiro foi apagado. As que estão perto das mudanças de código e que conferi: a §1.146 (a porta estreita do lugar do projeto, que a segunda leitura do `check-pais` alarga às duas contagens do arquivo sem dispensar a tabela), a §1.98 (o vocabulário fechado, que a frase da leitura do 19 passou a seguir), a §1.111 (a abertura de cada estudo, que as emendas tocam) e a §1.145 (os quatro estudos).

### E1b.9 · O custo

O modelo: Claude Opus 5.5, na definição `construtor`, em toda a passagem, no motor e no sítio. O relógio: 4723 segundos desde o primeiro commit da passagem (2026-10-01T03:38:12+01:00, o reflog do ramo do sítio) até à medida (2026-10-01T03:56:55+00:00); a leitura dos documentos antes desse commit não está contada. Os símbolos: 772242, uma transcrição e não uma medida (corrigido na E1c): a diferença entre o contador do orçamento que a ferramenta mostrava ao construtor no início da sessão e o que mostrava antes da medida das 03:56 UTC, lidos por ele e passados ao guião por uma variável de ambiente; o guião não lê contador nenhum. O total que conta é o que a ferramenta reporta ao lugar de direção no fim do agente, que inclui este relatório, a corrida final dos portões e o fecho.

### E1b.10 · O que fica por fazer

1. **A edição inglesa do 17** (decisão 3), como dívida: o motor tem as edições inglesas do «Quinze Anos» e de «Os Pelouros», com os registos de conteúdo (173 e 138 blocos), e o sítio nunca as alojou; o 17 não tem gabarito inglês, e no mapa de migração do E1 os blocos ingleses que iam para o 17 ficaram sem destino (87 dos 534). Compor o 17 em inglês é um gabarito novo no motor, pelo mesmo `core/compor.py`, com as atribuições e a leitura de abertura em inglês. O lugar de direção abre a issue.
2. **O sinal do euro no 19**, se o lugar de direção o quiser à frente: é uma emenda à abertura e ao corpo copiado do estudo de setembro, e não só à abertura (E1b.3).
3. **A leitura a frio** do E1 e da E1b, pelo Codex `gpt-6.1-sol` e, por ser um bloco grande, pela segunda leitura da `gpt-6-astra` (§1.147), com cinco estragos plantados nas cópias do pacote.
4. **As revisões do inventário** dos blocos e1 e e1b ficam «por ler pelo lugar de direção antes de aterrar», como o portão da voz deixa enquanto o bloco está em construção.
5. **As secções 1 a 11 deste relatório** citam os commits do sítio de antes do rebase; a correspondência está em E1b.5, e os ficheiros de medição do E1 (`medidas.json` fora da chave `e1b`, `capturas-e1.json`, `l1-e1.json`) ficam como o construtor anterior os escreveu, com as cabeças de então.

## E1c · a passagem de 01.10.2026, depois das duas leituras a frio

*Relatório do construtor da passagem E1c: Claude Opus 5.5 (a definição `construtor`), a 01.10.2026, pelo mandato [prompts/PROMPT-e1c-construtor.md](prompts/PROMPT-e1c-construtor.md), depois das duas leituras a frio do Codex (`design/especime-v3/critica/LEITURA-e1-2026-10-01.md`, o gpt-6.1-sol, e `LEITURA-e1-astra-2026-10-01.md`, o gpt-6-astra) e da triagem comum do lugar de direção. Os achados que a triagem nomeia como plantas não são defeitos do ramo e ficaram como estavam. Cada número desta secção está em [medidas.json](medidas.json), na chave `e1c`, escrito por [e1c/medir-e1c.py](e1c/medir-e1c.py) com o nome, o valor, o comando e um conhecido-positivo de cada medida, ou num ficheiro de [e1c/](e1c/), de [portoes/](portoes/) ou em [mapa-de-migracao.json](mapa-de-migracao.json). As secções 1 a 11 e a E1b ficam como os construtores anteriores as escreveram, salvo as frases que o ponto 11 do mandato manda corrigir, que levam a marca «corrigido na E1c».*

### E1c.0 · Em resumo

O mandato fez-se pela ordem que ele diz. No motor, as emendas aos quatro estudos fizeram-se nos gabaritos e saíram pelo caminho dos estudos compostos (o `core/compor.py`, o `make_html.py` de cada pasta e o `publisher/export_records.py`), com o portão do motor a 0 nos dois commits e na cabeça final do motor; no sítio, os sete documentos e os sete registos voltaram do motor, com o `check:documentos` a 0, também com a origem conferida contra o motor. A linha «Total da tabela» saiu da tabela das obras do Évora 2027, que a herdara do estudo de setembro, onde o mesmo erro está nas duas edições; a ficha de Évora diz a data da dívida de 2025 e de onde vem; as aberturas do 17, do 18 e do 19, a nota do resultado de 2016 no 16 e a secção da margem por explorar no 18 dizem só o que os documentos sustentam; a leitura do estudo da economia diz que o vencido e o pago se sobrepõem; as tabelas dos pelouros dizem a moeda e o que é cada coluna, e o valor acrescentado está explicado na primeira vez. As réguas do bloco passaram a ver o que as duas leituras viram: a das células confere a linha que cada célula cita, a das reconciliações falha com os estudos novos vazios, e a das repetições apanha os votos escritos por extenso.

Três coisas medidas e ditas, que mudam o que o mandato pedia ou como o fiz. A régua das células confere agora que o número de cada célula é o da linha que ela cita, mas essa conferência sozinha não vê o caso do total, porque a célula citava a linha cujo valor imprimia e a página que escrevia era a dessa linha: quem o vê é uma terceira conferência, que exige que uma linha que se diz o total da tabela seja a soma de linhas da sua coluna (E1c.2). A mesma régua achou no 19 seis selos herdados do estudo de setembro que davam a um valor a linha de outra página com o mesmo valor, e eles foram corrigidos (E1c.3). E a lista das decisões em vigor no motor correu depois das emendas e não antes (E1c.7).

### E1c.1 · O mandato, ponto a ponto

| # | O que | O que ficou | A medida |
|---|---|---|---|
| 1 | O total das obras no Évora 2027 | A linha «Total da tabela» («Table total» em inglês) saiu da tabela das obras pelo `@@  sem-linha: 9` nos dois gabaritos do 19; imprimia 39 336 001,42 €, a linha `bbs-cap-total` (o total da receita do setor público para despesas de capital, p. 88), e a soma das oito obras da p. 108 é 23 008 223,21 €. A soma não se imprime: o estudo não a tinha, e um valor calculado precisava de uma linha nova no livro do 19, que o compositor não escreve (E1c.2). O estudo de setembro tem o mesmo erro, nas duas edições e nos dois documentos alojados, que ficam como edições datadas. A régua das células passou a conferir a linha que cada célula cita, e a planta deste caso morde | `total_das_obras_e1c`, `celulas_e_linha_citada` |
| 2 | A ficha de Évora | Nas fichas do mandato de 2021 a 2025 («Deixou») e do mandato que começou em 2025 («Herdou»), uma frase antes dos valores diz que as contas do ano da mudança só existem como ano inteiro e não se repartem pelos dois executivos, a data dos valores (31.12.2025, com a marca de data de referência), quantos meses depois da saída ou da posse, e que vêm da prestação de contas da câmara, nas duas edições. Os valores ficam com o seu selo | `ficha_de_evora_e1c` |
| 3 | A abertura do estudo da economia | «produz menos do que consome» e «Évora consome melhor do que produz» saíram da abertura: o parágrafo diz que o índice de poder de compra põe o concelho acima da média do país e o valor acrescentado por pessoa ao serviço abaixo dela, que são medidas diferentes de populações diferentes, e que não dizem quanto o concelho consome. A frase do corpo que dava a diferença aos salários públicos e às pensões saiu, porque o estudo não mede nem uns nem outras, e no seu lugar fica que as duas medidas são de populações diferentes e que o estudo não mede o que explica a distância. Nas duas edições | `emendas_e1c` (ponto 3) |
| 4 | A abertura de quem governou | O parágrafo diz que o executivo com dois mandatos em sete viu as contas de 2024 rejeitadas pela câmara, e remete para o estudo das contas, onde a votação vive; a aritmética deixou de «decidir» e os «cinco votos» saíram do 17 (E1c.2 diz a leitura que fiz do mandato). O detetor das repetições apanha os votos com algarismos e por extenso | `emendas_e1c` (ponto 4), `contradicoes_i180` |
| 5 | A abertura do Évora 2027 | «A três meses de 2027», a distância da data da edição a 1 de janeiro; e, no lugar da «origem só», as duas receitas das contas de 2025 da associação (1 841 566,89 € do gabinete do Ministério da Cultura e 31 949,23 € do apoio do IEFP à contratação) e, à parte, o dinheiro pago que o plano de 2026 regista (3.920.000 € do Turismo de Portugal no fim de 2025), cada valor pela sua linha. Nas duas edições | `emendas_e1c` (ponto 5) |
| 6 | A subtração de 2016 | A nota diz que o relatório escreve a subtração e um valor corrigido que a subtração impressa não dá, que os dois resultados são do município, e que a tabela usa o resultado líquido do exercício, porque é o das contas e a mesma medida dos outros anos. Nas duas edições | `emendas_e1c` (ponto 6) |
| 7 | As portas fechadas | A secção da margem por explorar abre com a data a que a lista das portas foi lida e diz que os prazos até 2026-09-09 passaram, como o anexo; os seis concursos florestais dizem-se as janelas abertas a 2026-08-10, com prazos que já passaram. Nas duas edições | `emendas_e1c` (ponto 7) |
| 8 | O vencido e o pago | A frase da leitura do estudo da economia (a lista dos estudos, a página de Évora e a primeira página) diz que a parte vencida está em localizações vencidas, que a outra já foi paga e que as duas se sobrepõem, nas duas línguas, e a origem cita a frase do estudo onde isso está. O próprio estudo não punha os dois números lado a lado (E1c.2) | `leitura_da_economia_e1c`, `travessia_e1c` |
| 9 | O que um leitor sem o assunto não percebe | As dez tabelas dos pelouros dizem «(€)» em cada coluna «Plano» e «Custo», e uma frase antes delas diz o que é cada coluna; o valor acrescentado do 18 tem a explicação na primeira vez que aparece, nas duas edições, sem mudar o valor | `emendas_e1c` (ponto 9) |
| 10 | A régua das reconciliações | O conhecido-positivo exige cada âncora nova nos estudos novos, nenhuma frase que sai ainda lá e nenhuma repetição em dois estudos novos; com os estudos novos vazios falha, e falha também com os «cinco votos» plantados no 17 | `contradicoes_i180` |
| 11 | O relatório | A frase do livro do motor nos recibos diz o que o componente faz; os dois custos dizem-se transcrições do contador; o mapa de migração está bloco a bloco em [mapa-de-migracao.json](mapa-de-migracao.json), com a soma explicada; a repartição das células é a das páginas construídas | `celulas_nas_paginas_construidas`, `celulas_registos_contra_paginas`, `mapa_de_migracao_e1c`, `custo_e1c` |
| 12 | Os portões, as capturas, o relatório | O portão do motor a 0 na cabeça final do motor; os três do sítio pela tranca na cabeça de código e na cabeça desta secção; as capturas; esta secção e a resposta curta | `motor_e1c`, `portoes_e1c`, `capturas_e1c` |

### E1c.2 · O que medi e digo

- **A régua das células, e o que vê cada uma das suas três conferências.** O mandato pede que a régua confira «que o número de uma célula é o da linha que a célula cita». É a C1 da régua nova (`celulas_e_linha_citada`): o número impresso é uma das formas da linha que o registo dá à figura, e não de outra linha qualquer do livro. Medida neste caso, a C1 não morde: a célula do total citava `bbs-cap-total`, que é a linha do número que imprimia, e escrevia «p. 88», que é a página dessa linha. O que estava errado era o objeto, o total de outra tabela posto como o total desta, e para o ver a régua ganhou a C3: uma linha que se diz o total da tabela («Total», «Total da tabela», «Table total») tem de ser a soma de linhas da sua coluna, de um subconjunto delas, porque há tabelas com subtotais, dentro do arredondamento que os números impressos trazem. A C2 confere que a linha citada é da página ou da folha que a linha da tabela escreve. A planta deste caso, a linha do total de volta à tabela das obras numa cópia em memória do registo do 19, morde só na C3; uma obra a citar uma linha de outro valor morde na C1; o total da receita operacional a citar a despesa total da p. 87, com o mesmo valor, morde na C2. Nas 1 820 figuras das células dos sete registos, nenhuma falha, com 242 figuras em linhas de tabela que escrevem uma página ou uma folha e 6 linhas de total da tabela conferidas.
- **A soma das oito obras não se imprime.** O mandato deixa-a ao estudo («se o estudo quiser dizer a soma das oito obras, é um valor calculado, com a derivação escrita e a sua linha no livro do estudo como calculado»). O livro de um estudo composto é a cópia das linhas das suas fontes, e o compositor não escreve uma linha calculada nova; fazê-lo era um mecanismo novo no motor, para um número que o estudo não tinha. A linha sai, a soma está medida neste relatório e não no estudo, e fica no que falta fazer.
- **O ponto 8 no próprio estudo.** O estudo da economia não põe 61,32 % ao lado de 51,95 % em frase nenhuma: a abertura diz a parte vencida sem o pago, a tabela do instantâneo diz a execução sem o vencido, e a secção do que está vencido já diz que, das localizações vencidas, €41 693 864 foram pagos. Só a leitura do sítio os punha lado a lado, e foi ela que mudou.
- **As fichas eram duas e não três.** O mandato fala das «três fichas dos mandatos»; os valores de 31.12.2025 estão em duas, a de 2021 a 2025 («Deixou», com a dívida, o prazo médio de pagamento e os pagamentos em atraso) e a do mandato que começou em 2025 («Herdou», com a dívida), e as duas mudaram nas duas edições. As fichas dos mandatos da CDU põem também os valores do fim de 2017 e de 2021 em «Deixou» e «Herdou», com a instalação em outubro; aí o mesmo presidente e a mesma lista continuaram, e o mandato não os nomeia. Ficam como estavam, e estão no que falta fazer.
- **Os cinco votos.** O mandato diz que a frase do 17 diz que o executivo «viu as contas de 2024 rejeitadas por cinco votos contra dois», e logo a seguir que os «cinco votos» deixam de estar impressos nos dois estudos, uma coisa num lugar. Li a segunda parte como a regra: a votação fica no estudo das contas, onde já estava com as duas leituras dela, e o 17 diz que as contas foram rejeitadas e remete para lá, sem a contagem. Com a contagem no 17, o detetor das repetições que o mesmo ponto pede dava a votação em dois estudos.
- **A lista das decisões em vigor no motor** correu depois das emendas e não antes, contra o que o mandato pede; correu sobre os ficheiros do motor que a passagem tocou e sobre o intervalo da passagem (E1c.7), e nenhuma citação saiu.

### E1c.3 · Achados

1. **Seis selos do 19 com a linha de outra página.** A C2 da régua nova achou, nos registos do 19, figuras cuja linha era de outra página com o mesmo valor, todas herdadas do registo do estudo de setembro: a receita operacional total da folha 43 (45 784 603,10 €) selada com a despesa operacional total da p. 87, numa célula e num parágrafo da comparação com o painel e numa célula da tabela da receita, e, só na edição inglesa, a receita prevista do gabinete do Ministério da Cultura selada com o teto de 2026 da resolução, a intervenção do Arquivo Fotográfico com a obra da candidatura, e a parte da economia no protocolo com uma candidatura ao programa regional do Alentejo. São seis correções escritas no `ajustes.json` do 19, com a razão de cada uma, oito figuras ao todo nas duas edições (`selos_corrigidos_e1c`); o compositor recusa uma correção que não caia numa figura, e o teste dele passou a conferir isso edição a edição. O estudo de setembro fica com os selos antigos, como edição datada. Nenhuma destas linhas atravessa para o sítio, e por isso nenhum selo visível de uma página estava errado: o erro estava no registo de conteúdo.
2. **A medida das células pelos registos perdia seis figuras.** A medida `celulas_e_linhas_do_sitio` do E1 contava 69 figuras de células com linha do sítio, e as páginas construídas mostram 75. As seis são as três linhas da dívida do regulador de 2017, 2021 e 2024, impressas em duas tabelas do 16, que vieram do 07 e do 08 com os mesmos bytes: o registo de proveniência do 16 guarda-as como do 08, e o cruzamento do sítio regista-as pelo 07, por isso a medida dos registos não as achava e a página, que procura a linha pela vertical de cada linha, acha (`celulas_registos_contra_paginas`). A repartição que conta é a das páginas: 75 com a marca da fonte do sítio e 1 031 sem ela, em 1 106 figuras, uma a menos do que antes da passagem, que é a linha do total que saiu do 19.
3. **O registo do portão do motor tinha uma conta desatualizada fora deste bloco.** O `python3 -m core.gate update`, que refaz as contas de todas as entregas, achou `dominios-d1` com 25 figuras batidas contra as 24 registadas. É uma conta que o portão não tranca e não é deste bloco: a entrada ficou como estava, e o diff do `core/gate_baselines.json` só toca as contas dos quatro estudos.
4. **Os três testes do motor que contam as edições pararam o primeiro commit.** O `core/compor_test.py` conferia que todas as correções do 19 caíam na edição portuguesa, e três das novas só valem para a inglesa; o `publisher/export_records_test.py` e o `publisher/voz_test.py` têm as contagens das edições escritas. A primeira tentativa do commit parou nas três suítes (o registo está em `e1c/motor-travessia/`); as contagens acertaram-se com a aritmética escrita ao lado, e a conferência das correções passou a ser feita edição a edição.
5. **A conferência das leituras da E1b deixou de poder correr.** Os seus conhecidos-positivos exigiam frases que a E1c tirou do motor («A um ano e meio de 2027»), e um conhecido-positivo falso para a conferência sem conferir nada. A da E1c ([e1c/conferir-leituras-e1c.mjs](e1c/conferir-leituras-e1c.mjs)) é o mesmo detetor com conhecidos-positivos tirados destas emendas, contra a cabeça do motor da E1b.
6. **O corpo do 18 ainda diz «uma cidade relativamente próspera dentro de uma região pobre»**, na secção do enquadramento, num bloco copiado do estudo da economia de setembro; a emenda da E1b mudou só a abertura. Não é deste mandato, e fica dito.
7. **O anexo das portas do 18 continua a dizer «À data desta edição, 2026-09-30»**, e a edição é de 01.10.2026 (o achado 10 do E1). A frase nova da secção da margem não diz a data da edição: diz a data da leitura da lista e remete para o anexo.

### E1c.4 · Os commits

No motor, ramo `e1-2026-09-30` sobre `master`, só com o `Co-Authored-By`, cada um com o `python3 -m core.gate` do pre-commit a passar (os registos em [e1c/motor-travessia/](e1c/motor-travessia/)):

- `a8febe0` E1c: as emendas do mandato às edições do 16, do 17, do 18 e do 19
- `932eaee` E1c: os registos de conteúdo do 16, do 17, do 18 e do 19 refeitos depois das emendas

No sítio, ramo `e1-2026-09-30` sobre `main` (`dd7f6208`), com o `Co-Authored-By` e o `Claude-Session`:

- `f78a6ead` E1c: os documentos e os registos do 16, do 17, do 18 e do 19 voltam do motor depois das emendas
- `bdf5c212` E1c: as fichas dos mandatos de Évora dizem a data da dívida de 2025 e de onde vem, e não que foi deixada ou herdada
- `d91db6c0` E1c: a leitura do estudo da economia diz que o vencido e o pago se sobrepõem
- `ca24ea9b` E1c: as réguas do bloco conferem a linha que cada célula cita, exigem as âncoras das reconciliações e apanham a votação por extenso (a cabeça de código)
- o commit desta secção, com as provas, as capturas, o mapa de migração e a resposta curta, que não pode trazer o seu próprio identificador
- e o commit seguinte, com os códigos da corrida final dos portões na cabeça desta secção

### E1c.5 · Os portões

O portão do motor, `python3 -m core.gate`, na cabeça final do motor: código 0 em `932eaee` ([e1c/motor/](e1c/motor/)), de 2026-10-01T06:00:53Z a 2026-10-01T06:04:40Z, com a árvore do motor limpa; e o pre-commit passou nos dois commits do motor. A primeira tentativa do primeiro commit parou em três suítes (`export_records_test`, `voz_test`, `compor_test`), que contam as edições (E1c.3).

Os três portões do sítio correram sempre pela tranca da máquina: os inteiros por `sh scripts/leituras/portoes.sh`, cada um no seu comando, com o código escrito num ficheiro depois de o processo acabar e a cabeça ao lado; as corridas parciais (uma construção sozinha, o portão da voz sozinho, as capturas) por [e1c/com-tranca.sh](e1c/com-tranca.sh), que toma a mesma tranca. Os registos levam o caminho da árvore trocado por `[repositorio]` e o do motor por `[motor]` ([e1b/redigir.py](e1b/redigir.py)).

| Corrida | Cabeça | `npm run build` | `npm run verify` | `npm run typecheck` | O que parou |
|---|---|---:|---:|---:|---|
| construção sozinha | `e7a9e908`, com as mudanças do sítio ainda sem commit | 1 | | | o portão da voz: as duas frases novas da leitura do estudo da economia por classificar e as duas antigas vivas sem página ([e1c/intermedias/](e1c/intermedias/)) |
| portão da voz sozinho, depois do inventário | a mesma construção | | | | código 0: nada por classificar |
| a cabeça de código | `ca24ea9b` | 0 | 0 | 0 | nada: os três a 0 ([portoes/e1c-codigo/](portoes/e1c-codigo/)) |

A corrida final, na cabeça do commit desta secção, faz-se depois dele, e os seus códigos entram no commit seguinte, em [portoes/e1c/](portoes/e1c/). A corrida «portão» do GitHub corre quando o lugar de direção publicar o ramo; esta passagem não faz `push`.

### E1c.6 · As medidas e os conhecidos-positivos

| Medida | O valor | O conhecido-positivo | Mordeu |
|---|---|---|---|
| `cabecas_e1c` | sítio: a cabeça de código `ca24ea9b` sobre `dd7f6208`; motor: `932eaee` sobre `4b46bef`, depois de `79ab4d5` | `git cat-file -t` de cada cabeça diz «commit» | sim |
| `celulas_e_linha_citada` | 1820 figuras nas células dos sete registos, 242 em linhas que escrevem a página ou a folha, 6 linhas de total da tabela; 0 falhas | três plantas numa cópia do registo do 19: o total de volta à tabela das obras morde na C3, uma obra com a linha de outro valor na C1, o total da folha 43 com a linha da p. 87 na C2 | sim |
| `celulas_de_tabela_sem_linha` | 0 quantidades sem linha no 16, no 17 e no 18; no 19, 0 por classificar | uma tabela plantada no fim do 16 com «123 456» dá uma célula sem linha a mais | sim |
| `contradicoes_i180` | as 6 âncoras de 6 nos novos, nenhuma frase que sai fora do seu lugar, nenhuma repetição em dois estudos novos | com os estudos novos vazios, 0 âncoras e a régua falha; com os «cinco votos» plantados no 17, a votação fica em dois estudos e a régua falha | sim |
| `celulas_e_linhas_do_sitio` | pelos registos, 1106 figuras em células nos novos e 69 com linha do sítio | o detetor vê figuras com linha do sítio e sem ela | sim |
| `celulas_nas_paginas_construidas` | nas páginas construídas, 1106 figuras em células, 75 com a marca da fonte do sítio e 1031 sem ela | uma página plantada com marcas cheia e tracejada e uma figura de parágrafo dá 3 e 2 | sim |
| `celulas_registos_contra_paginas` | 6 figuras que só a página vê: as três linhas da dívida do regulador, em duas tabelas do 16 | o detetor encontra as diferenças | sim |
| `emendas_e1c` | 14 pares de estudo e língua, cada cadeia que sai a 0 e cada uma que entra presente, no motor e no documento alojado; 0 falhas | cada cadeia que sai estava no motor e no documento alojado na E1b | sim |
| `total_das_obras_e1c` | a soma das oito obras, 23 008 223,21 €, contra os 39 336 001,42 € da linha que saiu; a linha está nas duas edições do 14 e nos seus documentos alojados | a mesma procura encontra a linha nas duas edições do 14 | sim |
| `selos_corrigidos_e1c` | 9 correções no `ajustes.json` do 19 (as três do E1 e as seis desta passagem), aplicadas 6 na edição portuguesa e 8 na inglesa; as 8 figuras desta passagem com a linha certa no 19 | o mesmo leitor encontra as linhas antigas nas oito figuras do 14 | sim |
| `ficha_de_evora_e1c` | as quatro fichas (duas por edição) abrem com a frase, têm 31.12.2025 na marca de data de referência e a linha da dívida | a ficha como estava é dada como sem a frase | sim |
| `leitura_da_economia_e1c` | a frase nova nas seis páginas (a lista dos estudos, a página de Évora e a primeira página, nas duas línguas), e a antiga em nenhuma | a frase antiga numa página plantada conta-se uma vez | sim |
| `travessia_e1c` | 7 documentos realojados dos bytes de `a8febe0`; registos: 7 alterados e 10 inalterados; `check:documentos` 0, e 0 com a origem (17 registos conferidos contra o motor); a conferência das leituras com 0 falhas | os quatro conhecidos-positivos da conferência das leituras morderam | sim |
| `motor_e1c` | o portão do motor a 0; os dois commits a 0 e 0, e a primeira tentativa a 1; a conta de `dominios-d1` ficou com 24, que o `update` media 25 | o código lido do ficheiro concorda com a última linha do registo, e a primeira tentativa deu código diferente de zero | sim |
| `portoes_e1c` | a cabeça de código `ca24ea9b`: 0, 0, 0 | o leitor lê o 1 da construção intermédia | sim |
| `capturas_e1c` | 42 de 42 resumos conferidos, 0 problemas, 0 pedidos para fora, cabeça limpa | dois corpos que diferem num byte dão resumos diferentes | sim |
| `mapa_de_migracao_e1c` | em português, 673 blocos e 678 destinos, a soma a bater; em inglês, 534 blocos, 87 sem destino com a razão | cada bloco tem destino ou a razão de não ter | sim |
| `custo_e1c` | 3162 segundos desde o primeiro commit da passagem (E1c.8) | o primeiro commit da passagem no motor é o das emendas | sim |

O `python3 scripts/leituras/conferir-relatorio.py` corre sobre este relatório inteiro e lê os JSON da pasta ([e1c/conferir-relatorio-e1c.json](e1c/conferir-relatorio-e1c.json)): não aponta nenhum número sem ficheiro, em nenhuma secção (as frases que o ponto 11 corrigiu nas secções do E1 e da E1b incluídas).

### E1c.7 · As decisões em vigor

No sítio, o `python3 scripts/leituras/decisoes-em-vigor.py` correu sobre os ficheiros que a passagem ia tocar antes de mexer ([e1c/decisoes-em-vigor-sitio-e1c-antes.log](e1c/decisoes-em-vigor-sitio-e1c-antes.log)), e de novo sobre o intervalo da passagem, da cabeça do mandato à cabeça de código ([e1c/decisoes-em-vigor-sitio-e1c-intervalo.log](e1c/decisoes-em-vigor-sitio-e1c-intervalo.log)): nenhuma citação saiu num diff. No motor correu tarde, depois das emendas, sobre os ficheiros que a passagem tocou ([e1c/decisoes-em-vigor-motor-e1c-tardia.log](e1c/decisoes-em-vigor-motor-e1c-tardia.log)) e sobre o intervalo da passagem ([e1c/decisoes-em-vigor-motor-e1c-intervalo.log](e1c/decisoes-em-vigor-motor-e1c-intervalo.log)): perto do diff só a §1.111 e a §1.145, e nenhuma citação saiu. As que conferi: a §1.34, que fixa os campos de cada ficha de mandato (herdou, decidiu, deixou, o regulador, os pelouros), manda dizer o que a fonte não estabelece em vez de deixar o campo em branco, e põe as datas na marca `data-de-referencia` (as fichas mudaram o que dizem, não os campos, e a data nova vai nessa marca); a §1.111, a abertura de cada estudo, «sem motivos nem valores» nas conclusões (as emendas tiram dela duas causas que os documentos não sustentam); a §1.98, o vocabulário fechado (as frases novas das fichas e da leitura dizem «a câmara» e não «o município»); e a §1.145, os quatro estudos. Nenhum ficheiro foi apagado.

### E1c.8 · O custo

O modelo: Claude Opus 5.5, na definição `construtor`, em toda a passagem, no motor e no sítio. O relógio: 3162 segundos desde o primeiro commit da passagem (o `a8febe0` do motor, 2026-10-01T05:32:06Z) até à medida (2026-10-01T06:24:48+00:00), lidos do `git log` pelo guião; a leitura dos documentos e das duas leituras antes desse commit não está contada. Os símbolos: 784233, uma transcrição e não uma medida: o contador do orçamento de símbolos que a ferramenta mostra ao construtor dizia 15000000 no início da sessão e 14215767 na leitura das 06:21 UTC, e o construtor escreveu os dois valores em [e1c/custo-simbolos-transcrito.json](e1c/custo-simbolos-transcrito.json); nenhum guião lê esse contador. O total que conta é o que a ferramenta reporta ao lugar de direção no fim do agente, que inclui esta secção, a corrida final dos portões e o fecho.

### E1c.9 · O que fica por fazer

1. **A soma das oito obras como valor calculado**, se o lugar de direção a quiser no 19: precisa de que o compositor escreva uma linha calculada no livro de um estudo composto, com a derivação, o que hoje ele não faz (E1c.2).
2. **O estudo de setembro (o 14)** fica com a linha «Total da tabela» e com os seis selos antigos, nas duas edições, porque é edição datada e os seus bytes estão presos pelo resumo; se a sua página deve dizer o erro, é uma decisão do lugar de direção.
3. **Os valores do fim de 2017 e de 2021 nas fichas dos mandatos da CDU**, que estão em «Deixou» e «Herdou» com a instalação em outubro, como os de 2025 estavam; aí o executivo continuou com o mesmo presidente e a mesma lista (E1c.2).
4. **O corpo do 18** ainda diz «região pobre» onde a abertura diz «região abaixo da média do país» (E1c.3).
5. **As dívidas da E1b continuam:** a edição inglesa do 17 e o sinal do euro no 19.
6. **A leitura a frio da E1c**, pela outra família, e as revisões do inventário dos blocos e1, e1b e e1c, que ficam «por ler pelo lugar de direção antes de aterrar».
