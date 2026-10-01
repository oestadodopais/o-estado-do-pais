# E1 · Os estudos de Évora, um conjunto coerente

*Relatório do construtor: Claude Opus 5.5 (a definição `construtor`), de 30.09.2026 às 21:54 a 01.10.2026, pelo brief `design/observatorio/BRIEF-E1-os-estudos-de-evora-um-conjunto-coerente.md` e pela §1.145, com a emenda do lugar de direção ao lançar o bloco: o ponto 0 não é deste bloco; a linha `estudos-evora-publicados` tem o lugar declarado em Évora e muda por uma entrada `atualizacao` selada por `scripts/selar-historia-valores.mjs`; as linhas que medem o próprio projeto são do E0, que corre em paralelo e em que este bloco não toca. Cada número deste relatório está em [medidas.json](medidas.json), escrito por [medir-e1.py](medir-e1.py) com o nome, o valor, o comando e um conhecido-positivo de cada medida, ou num ficheiro de [portoes/](portoes/) com o código escrito depois de o processo acabar.*

## Em resumo

Os quatro estudos nasceram no motor (`content/16` a `content/19`), compostos dos registos já fixados dos seis estudos de agosto e setembro por um compositor novo (`core/compor.py`), com o portão do motor a 0 na cabeça `6ed528b`. Cada um abre com «Em resumo», «O que este projeto conclui» e «O que podia funcionar melhor», nas duas línguas onde há edição inglesa (o 16, o 18 e o 19; o 17 só em português, como o «Quinze Anos» e «Os Pelouros» de onde vem). No sítio, as 69 linhas mudaram de estudo sem mudar de id, de valor nem de origem; os seis endereços antigos respondem com a nota do sucessor à cabeça nas duas línguas, fora do índice e do mapa do sítio; a lista dos estudos e a página de Évora listam os quatro, cada um com a sua pergunta; a linha dos estudos sobre Évora passou de 6 a 4 pelo mecanismo, com a história selada.

**Onde parei, e porquê.** Quando os quatro estudos entram no arquivo, as duas linhas que contam o arquivo inteiro têm de mudar: `estudos-publicados` de 13 para 17 e `edicoes-publicadas` de 18 para 25. A mudança de valor de uma linha derivada precisa de um lugar no registo das mudanças, e estas duas medem o próprio projeto; o lugar `o-estado-do-pais` é o do E0, que ainda não aterrou e que, no seu ramo, só o declara para `correcoes-publicadas`. Medi, digo e paro aí: na cabeça do E1, `npm run build` e `npm run verify` saem com 1 no `ledger:check`, com as duas contas (calculado 17 contra 13 publicado; 25 contra 18), e `npm run typecheck` sai com 0. Com o mecanismo do E0 de 30.09 e as duas linhas declaradas nesse lugar, que são os dois remendos desta pasta, os três portões saem com 0 na mesma cabeça.

**Um segundo ponto medido, que digo e não construo.** O §2 do brief manda que «cada célula de tabela que passe sem linha ganha uma ou sai». Cada número das tabelas dos quatro estudos tem a sua linha no livro do estudo (o do motor, que viaja com o registo e que a página do estudo mostra nas fontes): nenhuma quantidade sem linha no 16, no 17 e no 18, e no 19 só identificadores (endereços, carimbos de hora, o nome «Évora 27», números de artigo e de série). Mas linhas do livro-razão do sítio, das que atravessaram, as tabelas têm poucas: nos seis antigos, 1 196 figuras em células e 69 com linha do sítio; nos quatro novos, 1 107 e as mesmas 69. Dar linha do sítio às outras 1 038 seria atravessar centenas de linhas novas, com página, área, lugar e nome cada uma; tirar as tabelas seria tirar o conteúdo. Fica medido (a medida `celulas_e_linhas_do_sitio`) e para o lugar de direção decidir.

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

O compositor leva cada bloco de cada registo antigo para um estudo novo, com as emendas escritas no gabarito da pasta, ou fá-lo sair com a razão escrita; um bloco que não entra nem sai é uma falta e fecha o compositor. Em português, 673 blocos e 0 faltas; dois blocos do «Quinze Anos» (o 171 e o 172, a lista e o parágrafo das lacunas, na secção das fontes) repartidos pelo 16, pelo 17 e pelo 18, cada um com o que é seu (a medida `mapa_de_migracao`).

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

O modelo: Claude Opus 5.5, na definição `construtor`, em todo o bloco (no motor e no sítio). O relógio: 20071 segundos desde a criação dos dois ramos (2026-09-30T21:54:34+01:00) até à medida (2026-10-01T02:29:05+00:00). Os símbolos: 2502873 (o contador do orçamento que a ferramenta mostra ao agente: 15000000 no início da sessão do construtor e 12497127 na leitura antes desta medida, a 01.10.2026); é a leitura do contador que a ferramenta mostra ao agente, e o total que conta é o que a ferramenta reporta ao lugar de direção no fim do agente, que inclui este relatório e o fecho.

## 11 · O que fica por fazer

1. **Os dois contadores do arquivo, depois do E0.** Quando o E0 aterrar com o lugar `o-estado-do-pais`, o que o E1 pede é o [ensaio-2-contadores-do-arquivo.patch](ensaio-2-contadores-do-arquivo.patch), adaptado ao mecanismo que o E0 deixar: declarar `estudos-publicados` e `edicoes-publicadas` nesse lugar, a segunda leitura do `check-pais` a confirmá-lo pelas duas expressões, os nomes das duas medidas, a entrada `atualizacao` de cada uma (13 para 17, 18 para 25) selada pelo `selar-historia-valores.mjs`, e a chave `16.09.2026` a sair de `src/i18n/lingua-dos-titulos.mjs`. O [ensaio-1-mecanismo-do-e0.patch](ensaio-1-mecanismo-do-e0.patch) é a cópia do mecanismo do E0 de 30.09 com que ensaiei, e não é para aterrar.
2. **As células das tabelas sem linha do sítio** (o segundo ponto medido, no «Em resumo»): decidir se o §2 do brief quer linhas do sítio ou do estudo.
3. **A revisão do lugar de direção:** as aberturas dos quatro estudos («Em resumo», «O que este projeto conclui», «O que podia funcionar melhor») são prosa nova minha, com cada número por marcador de uma linha; as três leituras copiadas para os estudos novos (`src/data/leituras.mjs`: a das contas para o 16, a dos pelouros para o 17 e a do dinheiro público para o 18); e a edição inglesa do 17.
4. **A leitura a frio** do Codex `gpt-6.1-sol`, e a segunda leitura da `gpt-6-astra` por ser um bloco grande (§1.147), com cinco estragos plantados nas cópias do pacote.
