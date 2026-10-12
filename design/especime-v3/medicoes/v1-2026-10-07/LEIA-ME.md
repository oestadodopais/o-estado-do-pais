# Entrega do primeiro varrimento de vigilância

Relatório gerado por `python3 <medicoes>/medir_entrega.py --motor <motor> --provas`. As medidas abaixo são lidas dos ficheiros referidos; não são contagens introduzidas à mão.

**A aceitação de uma entrada de cada fonte não está cumprida.** Não se fabricou uma iniciativa de hoje. O índice e os recibos declaram a cobertura e as falhas. Esta secção documenta a entrega inicial; a leitura a frio e a passagem V1-b constam dos registos e da secção final.

## Antes da construção

Cabeça inicial do motor: `465d01e7853f2729fcaa4ba63160b6338ba5de1e`. Portão inicial: `0`, em 532.582 segundos, lido de `portoes/inicial.json` e `portoes/inicial.codigo`.

O cliente e o arquivo reutilizados estão identificados em `inicial.json`. As decisões em vigor sobre os ficheiros indicados estão em `decisoes-em-vigor.log`, com comando e código em `decisoes-em-vigor.json`. A conferência do PDF inicial está em `pdf-conferencia.json`.

## Corridas reais e segunda leitura

| Recibo no motor | Cabeça declarada | Pedidos | Bytes | Minutos | Novas | Revisões | Iguais | Falhas | Fila |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `vigilancia/corridas/2026-10-11T082941535048Z.json` | `465d01e7853f2729fcaa4ba63160b6338ba5de1e` | 18 | 10000000 | 0.576983 | 310 | 0 | 0 | 5 | 5 |
| `vigilancia/corridas/2026-10-11T083143627056Z.json` | `465d01e7853f2729fcaa4ba63160b6338ba5de1e` | 16 | 10000000 | 0.504267 | 0 | 0 | 4 | 6 | 10 |
| `vigilancia/corridas/2026-10-11T084515373549Z.json` | `26c4bbe346c6a6d0c260782f2843350b43fdeb59` | 16 | 10000000 | 0.5601 | 0 | 0 | 4 | 6 | 15 |
| `vigilancia/corridas/2026-10-11T084609882488Z.json` | `26c4bbe346c6a6d0c260782f2843350b43fdeb59` | 17 | 10000000 | 0.5349 | 0 | 306 | 4 | 5 | 18 |
| `vigilancia/corridas/2026-10-11T084739602028Z.json` | `26c4bbe346c6a6d0c260782f2843350b43fdeb59` | 16 | 10000000 | 0.565767 | 0 | 0 | 4 | 6 | 6 |
| `vigilancia/corridas/2026-10-11T085234800946Z.json` | `26c4bbe346c6a6d0c260782f2843350b43fdeb59` | 12 | 10000000 | 0.545817 | 0 | 0 | 306 | 2 | 6 |
| `vigilancia/corridas/2026-10-11T085336443850Z.json` | `26c4bbe346c6a6d0c260782f2843350b43fdeb59` | 16 | 10000000 | 0.529 | 0 | 0 | 4 | 6 | 7 |
| `vigilancia/corridas/2026-10-11T085524844046Z.json` | `26c4bbe346c6a6d0c260782f2843350b43fdeb59` | 17 | 10000000 | 0.57955 | 0 | 0 | 310 | 5 | 5 |
| `vigilancia/corridas/2026-10-11T085638711957Z.json` | `26c4bbe346c6a6d0c260782f2843350b43fdeb59` | 16 | 10000000 | 0.5232 | 0 | 0 | 4 | 6 | 6 |

Os pedidos e bytes foram recalculados a partir dos saltos de `vigilancia/pedidos/`, e conferidos contra os recibos. As contagens por fonte e tipo, as razões de falha e o estado de cada fonte em cada corrida estão em `corridas.json`.

Duas corridas com os ficheiros do código final: **True**. Hashes do código coincidentes: **True**. Segunda sem novas entradas ou revisões: **True**.

## Índice, resumo e provas

Entradas vigentes por fonte: `{"dar": 306, "iniciativas": 0, "dr": 4}`. Por tipo: `{"declaração": 306, "iniciativa": 0, "ato": 4}`. Corpos distintos das entradas: 2. Todos os excertos, autores, datas, localizadores e hashes foram relidos em `integridade.json`.

* `vigilancia/indice/2026-10-11.json`: 616 versões preservadas; `vigilancia/resumo/2026-10-11.md`: 2356 bytes UTF-8, pelo método declarado no recibo.

## Plantas, portão e fluxo

Plantas aprovadas: 5 de 5, em `plantas.json`. A suite completa está em `autotestes.log`, com o código em `autotestes.json`.

* excerto: `excerto alterado contra o arquivo`; passou: True.
* autoria: `autoria trocada contra o arquivo`; passou: True.
* data: `data errada contra o arquivo`; passou: True.
* corpo: `corpo truncado ou alterado no arquivo`; passou: True.
* vazio: `falha apresentada como vazio ou cobertura completa`; passou: True.

Portão do motor: `0`, lido de `portoes/motor.codigo`; cabeça conferida: `f8e07849f57270bd4d3256ccfffde185196f7823`. O comando, duração e registo estão em `portoes/motor.json` e `portoes/motor.log`.

O validador anterior do motor e o validador V1 correram em seco: `fluxos-motor.log` e `fluxo-v1.log`, com códigos nos JSON homónimos. Nenhuma variável foi armada, nenhum fluxo remoto foi corrido e nenhum ramo foi empurrado. A validação local não prova uma corrida no GitHub.

O estado dos caminhos protegidos está vazio em `preservacao.json`. As alterações preexistentes preservadas são 12, conferidas pelos hashes de `alteracoes-preexistentes.json`. Fugas de caminhos ou nome local nos ficheiros do bloco: 0.

## Código, limites e trabalho pendente

Cabeça do código do motor: `f8e07849f57270bd4d3256ccfffde185196f7823`. Cabeça do motor na medição: `f8e07849f57270bd4d3256ccfffde185196f7823`. As cabeças e commits anteriores ao fecho do relatório estão em `cabecas.json`; o commit final do relatório é deliberadamente posterior a esse recibo.

O `vigilancia/README.md` documenta a utilização, saídas, tetos, direitos e exclusões. A aceitação por fonte depende de uma iniciativa efetivamente publicada na janela; continuam pendentes os registos sem data, a leitura integral dos atos que exigem JavaScript e a cobertura fora das janelas suportadas. Não se alargou o âmbito para contornar estas faltas.

## Questões resolvidas e diferenças medidas

* **V1-1**: A data da retoma substitui as datas de corrida do brief, por instrução do diretor. A primeira carga das iniciativas continua limitada à data inicial efetiva; não se recua a janela para fabricar uma entrada de aceitação.
* **V1-2**: O ficheiro cumulativo das iniciativas cabe comprimido perto do teto, mas não cabe descomprimido. O orçamento conta bytes de corpo transferido, antes da descompressão. Os recibos separam essa conta dos bytes descomprimidos; o arquivo conserva a representação recebida.
* **V1-3**: O DAR corrente tem um catálogo que não demonstra cobertura histórica nem mudanças de sessão. O pacote recolhe intervenções nominais reconhecidas no PDF e declara as exclusões. O catálogo dos dados abertos é preservado como prova auxiliar; a descoberta corrente vem da página da I Série.
* **V1-4**: O RSS do Diário da República junta emissor e sumário sem fronteira identificável. O campo de autoria fica vazio, com cobertura parcial, em vez de se adivinhar um nome. As páginas dos atos observadas exigem JavaScript; os metadados continuam citáveis a partir do RSS alojado.
* **V1-5**: Os robots da Assembleia responderam como ausentes; os do Diário da República devolveram HTML sem diretivas. O cliente regista a anomalia e aplica as regras reconhecíveis. Erros de rede e de servidor fecham o anfitrião. Os termos parlamentares são conferidos na passagem registada.
* **V1-6**: Não se encontrou um contador de tokens de texto aplicável no projeto. O resumo usa bytes UTF-8 como limite superior conservador para BPE de bytes; não se apresenta essa barreira como contagem pelo tokenizador de um modelo.
* **V1-7**: O estado e a fila vivem exclusivamente na vigilância. O trabalho futuro do GitHub guarda-os no arquivo privado depois das retomas, sob o seu interruptor próprio; não depende de o corredor estar armado e não reconstrói o sítio. A exceção do validador anterior está limitada ao passo e pasta da vigilância.
* **V1-8**: As cópias brutas das sondas iniciais estavam em armazenamento temporário da sessão interrompida e já não estavam disponíveis na retoma. Conservam-se as medições e a conferência visual anteriores; as corridas desta entrega voltaram a alojar provas atuais. A reprodução da sonda antiga exige os seus corpos originais.
* **V1-9**: Os registos de iniciativas sem data ficam como falha explícita e pendência. A leitura extrai os registos datados que pertencem à janela sem transformar o restante ficheiro em ausência de novidades.
* **V1-10**: O Parlamento devolveu ligações cifradas diferentes para os mesmos bytes do PDF. O diagnóstico inicial registou revisões apenas da ligação, preservadas para auditoria. O código final exclui a ligação rotativa da identidade do conteúdo e conta entradas vigentes por identificador, separando as versões históricas. Não se reescreveram os recibos de diagnóstico.
* **V1-11**: A fila identifica cada tarefa pela fonte, ação e documento. Mudanças de data do recibo não criam tarefas novas; as fontes adiadas pelo teto ganham prioridade sobre falhas persistentes. Esta correção foi exercida em corridas reais e num teste que altera a data da prova entre execuções.
* **V1-12**: As primeiras corridas locais serviram também para descobrir limites reais dos leitores. Estão todas conservadas com hashes do código; as medidas distinguem as corridas de diagnóstico das corridas com hashes iguais aos ficheiros do código final. A cabeça Git registada durante uma corrida pode preceder o commit que fixou esses mesmos ficheiros; a igualdade é conferida por conteúdo, não inferida do nome do ramo.
* **V1-13**: Sem identificadores próprios de intervenção no PDF, a identidade da declaração combina o número do diário, a página e a posição do excerto. Uma mudança de paginação pode aparecer como entrada nova; a comparação por conteúdo conserva as versões e o PDF anterior, mas não prova uma correspondência editorial entre intervenções deslocadas.
* **V1-14**: A linha tokens used não foi exposta pelas ferramentas desta sessão. O custo acumulado, incluindo a sessão interrompida, não é verificável; não se declara que ficou dentro nem que ultrapassou o alvo do bloco.

## Proposta para o registo das melhorias

Vigilância diária das fontes parlamentares e do Diário da República: corpos selados antes da extração, índice e resumo determinísticos, revisões e fila persistente, limites de rede e tempo, plantas inscritas no portão e automação dormente com vigia. A direção regista depois da leitura a frio. A entrega não fecha a aceitação de todas as fontes enquanto faltarem entradas verificáveis na janela.

## Custo

A linha `tokens used` não foi observada. `aceitacao.json` regista custo não verificável; não é possível aferir o desvio ao alvo de símbolos do bloco.

## A passagem V1-b

Medida por `python3 <medicoes>/medir_v1b.py --motor <motor> --provas --fecho`. Os recibos de diagnóstico são preservados; as medidas desta secção substituem as conclusões anteriores sobre revisões, cobertura, segunda leitura e igualdade do código.

A segunda corrida leu as três fontes dentro dos tetos. O ficheiro das iniciativas foi lido; registos sem data de entrada: 1. Estes registos continuam nomeados como falha e ficam fora da contagem das entradas datadas. A aceitação de uma entrada de cada fonte continua por cumprir enquanto não houver uma iniciativa verificável na janela.

| Corrida | Pedidos | Bytes | Segundos | Novas | Revisões reais | Iguais | Falhas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `2026-10-12T132157219533Z` | 24 | 413423 | 43.125 | 6 | 0 | 310 | 1 |
| `2026-10-12T132240450904Z` | 19 | 332177 | 38.379 | 0 | 0 | 312 | 1 |

Bytes por fonte: `{"dar": 238311, "iniciativas": 158698, "dr": 13712, "politicas": 2702}`.
Entradas por fonte: `{"dar": 306, "iniciativas": 0, "dr": 10}`. Por tipo: `{"declaração": 306, "iniciativa": 0, "ato": 10}`.
Leitura por fonte: `{"dar": true, "iniciativas": true, "dr": true}`. Comparação: `{"dar": true, "iniciativas": true, "dr": false}`.


Bytes por fonte: `{"dar": 164658, "iniciativas": 158673, "dr": 6144, "politicas": 2702}`.
Entradas por fonte: `{"dar": 306, "iniciativas": 0, "dr": 10}`. Por tipo: `{"declaração": 306, "iniciativa": 0, "ato": 10}`.
Leitura por fonte: `{"dar": true, "iniciativas": true, "dr": true}`. Comparação: `{"dar": true, "iniciativas": true, "dr": true}`.

Os bytes foram recalculados pelos saltos de cada pedido. A parcela `politicas` contém os robots comuns. `corridas-b.json` conserva as reutilizações, as razões das falhas, as limitações e o âmbito da comparação. Os atos de JavaScript ficam como cobertura parcial, sem alimentar o alarme; os registos das iniciativas sem data, quando existem, continuam como falha.

* Resumo de 2026-10-11: 2422 bytes UTF-8; 4 atos/iniciativas listados; 1 grupos do DAR; 0 atos/iniciativas remetidos para o índice.
* Recontagem: 0 revisões reais; 306 diagnósticos de revisão só por ligação. Números do DAR: `["dar:2026-09-26:006"]`. Os recibos originais permanecem iguais aos das corridas.
* Resumo de 2026-10-12: 2415 bytes UTF-8; 6 atos/iniciativas listados; 1 grupos do DAR; 4 atos/iniciativas remetidos para o índice.

A Portaria dos combustíveis consta do resumo refeito de 11.10, verificado pela planta do resumo. As declarações mostram a sessão lida no PDF. O resumo usa a designação do ato, sem a referência repetida da edição, com autoria quando disponível, data, arquivo e ligação. As ligações cifradas do Parlamento ficam no índice.

### Plantas e portão

Plantas e controlos: 28 aprovados em 28, em `plantas-b.json`. As cinco plantas originais são exercidas sobre iniciativa sintética, declaração real e ato real.

* `Provas.excerto`: «excerto alterado contra o arquivo»; passou: True.
* `Provas.autoria`: «autoria trocada contra o arquivo»; passou: True.
* `Provas.data`: «data errada contra o arquivo»; passou: True.
* `Provas.corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `Provas.vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `PlantasDAR.excerto`: «excerto alterado contra o arquivo»; passou: True.
* `PlantasDAR.autoria`: «autoria trocada contra o arquivo»; passou: True.
* `PlantasDAR.data`: «data errada contra o arquivo»; passou: True.
* `PlantasDAR.corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `PlantasDAR.vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `PlantasDR.excerto`: «excerto alterado contra o arquivo»; passou: True.
* `PlantasDR.autoria`: «autoria trocada contra o arquivo»; passou: True.
* `PlantasDR.data`: «data errada contra o arquivo»; passou: True.
* `PlantasDR.corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `PlantasDR.vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `resumo_iniciativas_sem_ligacao_rotativa`: «ligação rotativa da iniciativa entrou no resumo»; passou: True.
* `dar_servido_com_outra_ligacao_na_segunda_corrida`: «ligação rotativa apresentada como revisão»; passou: True.
* `planta_limitacao_como_falha`: «limitação conhecida apresentada como falha»; passou: True.
* `planta_falha_como_limitacao`: «falha apresentada como limitação»; passou: True.
* `planta_data_sessao`: «data da sessão errada contra o arquivo»; passou: True.
* `planta_declaracao_deslocada`: «declaração deslocada contou duas vezes»; passou: True.
* `planta_outro_orador_na_posicao`: «outro orador apresentado como revisão da declaração anterior»; passou: True.
* `outro_orador_mesmas_palavras_tem_outro_id`: «outro orador com as mesmas palavras herdou a identidade anterior»; passou: True.
* `bytes_pdf_sem_mudar_declaracao`: «bytes do PDF apresentaram declarações intactas como revistas»; passou: True.
* `head_compara_tamanho_descomprimido`: «HEAD voltou a transferir o corpo arquivado»; passou: True.
* `documento_429_ou_5xx_fecha_anfitriao`: «HTTP {status}; anfitrião fechado para o resto da corrida»; passou: True.
* `teto_exato_impede_segundo_pedido`: «teto de bytes atingido»; passou: True.
* `hashes_comparam_todas_as_corridas`: «corrida com código diferente desapareceu da medida»; passou: True.

Portão: `0`, lido de `portoes-b/motor.codigo`; cabeça: `9dd3a96142b2692c17c97de3a73fb1cd3c620a22`. Log e metadados em `portoes-b/motor.log` e `portoes-b/motor.json`. Os dois validadores locais dos fluxos constam de `fluxo-b.json` e `fluxos-motor-b.json`.

### Aceitação do brief

| Critério | Medida |
| --- | --- |
| Corridas e segunda leitura | `{"duas_corridas_12_10_codigo_final": true, "segunda_leu_tres_fontes": true, "segunda_sem_entradas_ou_revisoes": {"dar": true, "iniciativas": true, "dr": true}}` |
| Entrada de cada fonte | False |
| Plantas | True |
| Portão na cabeça, fluxos e preservação | 0; cabeça coincidente: True; ver provas e preservação |
| README e proposta de melhoria | True; proposta abaixo |
| Medidas por guião e custo | Guião e recibos alojados; linha tokens used não observada |

Código do motor: `9dd3a96142b2692c17c97de3a73fb1cd3c620a22`. Motor na medição: `e3608ab8886486dad7bef51261907b700cf6c810`. Código dos guiões do sítio: `497d1342bbb0bc40a94a1ff7538ab2db437f40d7`. As cabeças e os commits anteriores ao fecho estão em `cabecas-b.json`; a cabeça final do sítio será posterior ao relatório que ela contém.

A comparação `hashes-b.json` inclui todas as corridas, sem as filtrar por igualdade antes de as medir. As corridas antigas com código diferente estão identificadas individualmente. Os recibos finais são selecionados pela igualdade do código e do registo, não pelo nome do ramo.

Ficheiros preexistentes preservados: 12 de 12; caminhos protegidos do motor sem alterações; fugas de caminhos ou nome local: 0. `confirmacao-b.json` confirma os achados plantados nas cópias.

### Questões novas

* **V1-15**: tamanho e validadores iguais autorizam reutilização pelo mandato, mas não provam igualdade criptográfica do conteúdo remoto. Sem validadores, uma alteração do mesmo tamanho pode não ser detetada.
* **V1-16**: registos sem data não permitem decidir a pertença à janela. Na última corrida final: 1, identificados como `[{"posicao": 1509, "IniId": "377355"}]`. Não se atribui uma data presumida nem se alarga a janela para obter uma entrada.
* **V1-17**: o catálogo consultado expõe o ficheiro corrente cumulativo. HEAD torna a comparação diária viável, pelo que não foi ativada a alternativa semanal. O resumo e o registo mantêm a cadência diária.
* **V1-18**: a reconferência inicial limita-se ao número de dias declarado no registo. Os vistos persistentes mantêm os identificadores anteriores; uma interrupção longa exige atenção à cobertura declarada.
* **V1-19**: a prova dos direitos do DR é uma extração textual identificada da página oficial, com sha256. A tentativa HTTP direta do cliente da casa recebeu JavaScript e está conservada separadamente. Não se afirma ter alojado o HTML integral dessa página.
* **V1-20**: o resumo mantém um limite conservador de bytes UTF-8 e declara as omissões. Não existe medição por tokenizador de modelo no guião.
* **V1-21**: as revisões artificiais foram retificadas no índice e na leitura do resumo, com os valores de diagnóstico conservados e sem reescrever os recibos das corridas antigas.

Proposta para o registo das melhorias: vigilância diária com reutilização verificável dos arquivos, identidade das declarações independente da ligação e da paginação, datas separadas, limitações distintas das falhas e resumo orientado para atos e iniciativas. A direção decide o registo.

Custo: a linha `tokens used` não foi exposta. O desvio ao alvo do mandato não é verificável e não é estimado.
