# Entrega do primeiro varrimento de vigilância

Relatório gerado por `python3 <medicoes>/medir_entrega.py --motor <motor> --provas`. As medidas abaixo são lidas dos ficheiros referidos; não são contagens introduzidas à mão.

**A aceitação de uma entrada de cada fonte não está cumprida.** Não se fabricou uma iniciativa de hoje. O índice e os recibos declaram a cobertura e as falhas. A leitura a frio do Opus e a conferência da direção continuam por fazer.

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
