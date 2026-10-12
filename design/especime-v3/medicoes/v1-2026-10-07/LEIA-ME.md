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

As conclusões iniciais sobre igualdade do código e segunda leitura foram substituídas: a comparação integral da passagem V1-b está em `hashes-b.json`, e a da V1-c em `hashes-todas-corridas.json`.

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

## A passagem V1-d

Medida por `python3 <medicoes>/medir_v1d.py --motor <motor> --provas --portao`. Os registos anteriores conservam os resultados que mediram na sua passagem.

Aceitação das corridas: **cumprida**. O estado exige o par final sem falhas, com leitura das três fontes e sem duplicação na segunda corrida. Limitações declaradas não são falhas de transporte.

### As confirmações da leitura

Os estragos plantados nas cópias não estavam no ramo. A conferência de entrada está em `d/confirmacao.json`:

```json
{
  "1": true,
  "2": 12,
  "3": 20000000,
  "4": "falha",
  "5": "Atos novos: 6; iniciativas novas: 0; DAR novos ou revistos: 0; limitações: 6; falhas: 2."
}
```

### Corridas finais

| Corrida | Pedidos | Bytes comuns | Bytes cumulativo | Segundos | Novas | Revisões | Iguais | Falhas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `2026-10-12T194319909143Z` | 12 | 326606 | 0 | 31.465 | 0 | 0 | 6 | 0 |
| `2026-10-12T194352285903Z` | 12 | 326675 | 0 | 29.35 | 0 | 0 | 6 | 0 |

Recibo: `<motor>/vigilancia/corridas/2026-10-12T194319909143Z.json`; pedidos: `<motor>/vigilancia/pedidos/2026-10-12T194319909143Z.jsonl`.
Bytes por fonte: `{"dar": 164837, "iniciativas": 159069, "dr": 0, "politicas": 2700}`. Pedidos por fonte: `{"dar": 2, "iniciativas": 3, "dr": 1, "politicas": 6}`.
Estados: `{"dar": "limitação", "iniciativas": "limitação", "dr": "limitação"}`. Fontes lidas: `{"dar": true, "iniciativas": true, "dr": true}`.
Limitações por código: `{"catalogo_corrente": 1, "javascript": 6, "ficheiro_atrasado": 1, "sem_data": 1}`.

* dar: Catálogo corrente e PDFs desde o primeiro número recolhido; intervenções nominais reconhecidas por número. Mudanças de sessão e lacunas fora do catálogo exigem revisão.
* iniciativas: o ficheiro das iniciativas vai até 08.10.2026; atraso de 4 dias face à corrida. Registos sem data de entrada; pertença à janela indeterminada.
* dr: Texto integral exige JavaScript; metadados do RSS alojados.

Falhas: `[]`. Tarefas pendentes: 0, integralmente em `corridas-d.json`.
Reconferências adiadas por fonte: `{"dar": 1, "dr": 6}`. Os corpos adiados não foram reconfirmados remotamente nessa corrida.

Recibo: `<motor>/vigilancia/corridas/2026-10-12T194352285903Z.json`; pedidos: `<motor>/vigilancia/pedidos/2026-10-12T194352285903Z.jsonl`.
Bytes por fonte: `{"dar": 164930, "iniciativas": 159045, "dr": 0, "politicas": 2700}`. Pedidos por fonte: `{"dar": 2, "iniciativas": 3, "dr": 1, "politicas": 6}`.
Estados: `{"dar": "limitação", "iniciativas": "limitação", "dr": "limitação"}`. Fontes lidas: `{"dar": true, "iniciativas": true, "dr": true}`.
Limitações por código: `{"catalogo_corrente": 1, "javascript": 6, "ficheiro_atrasado": 1, "sem_data": 1}`.

* dar: Catálogo corrente e PDFs desde o primeiro número recolhido; intervenções nominais reconhecidas por número. Mudanças de sessão e lacunas fora do catálogo exigem revisão.
* iniciativas: o ficheiro das iniciativas vai até 08.10.2026; atraso de 4 dias face à corrida. Registos sem data de entrada; pertença à janela indeterminada.
* dr: Texto integral exige JavaScript; metadados do RSS alojados.

Falhas: `[]`. Tarefas pendentes: 0, integralmente em `corridas-d.json`.
Reconferências adiadas por fonte: `{"dar": 1, "dr": 6}`. Os corpos adiados não foram reconfirmados remotamente nessa corrida.

### As iniciativas e o atraso da fonte

A reutilização diz o que comparou: tamanho igual sem validadores, ou validadores efetivamente presentes. Igualdade de tamanho não demonstra igualdade do conteúdo remoto. O atraso vem da última data de entrada no corpo alojado, com a prova no recibo.

```json
[
  {
    "ultima_entrada": "2026-10-08",
    "atraso_dias": 4,
    "dia": "2026-10-12",
    "razao": "o ficheiro das iniciativas vai até 08.10.2026; atraso de 4 dias face à corrida."
  },
  {
    "ultima_entrada": "2026-10-08",
    "atraso_dias": 4,
    "dia": "2026-10-12",
    "razao": "o ficheiro das iniciativas vai até 08.10.2026; atraso de 4 dias face à corrida."
  }
]
```

A aceitação das iniciativas depende de a fonte publicar o ficheiro com as entradas da janela. Um ficheiro que termina antes da janela não prova ausência de iniciativas no Parlamento.

Aceitação de entrada datada por fonte: `{"dar": {"estado": "por cumprir", "inicio": "2026-10-11", "fim": "2026-10-12"}, "iniciativas": {"estado": "por cumprir", "inicio": "2026-10-11", "fim": "2026-10-12"}, "dr": {"estado": "cumprida", "inicio": "2026-10-11", "fim": "2026-10-12"}}`.

### A aritmética do achado 7

A correção desta passagem conserva a novidade do DAR durante todas as corridas do dia. A prova executa duas corridas, confirma a comparação igual na segunda e conserva o grupo e a contagem; um dia posterior sem revisão não o repete.

```json
{
  "cenario": "simulação identificada com declarações do arquivo; a prova de duas execuções está na suite",
  "declaracoes": 306,
  "primeira_grupos": [
    "dar:2026-09-26:006"
  ],
  "segunda_grupos": [
    "dar:2026-09-26:006"
  ],
  "primeira_contagens": "No dia: atos novos: 6; iniciativas novas: 0; DAR novos ou revistos: 1; nesta corrida: limitações: 9; falhas: 0.",
  "segunda_contagens": "No dia: atos novos: 6; iniciativas novas: 0; DAR novos ou revistos: 1; nesta corrida: limitações: 9; falhas: 0.",
  "segunda_iguais": 306,
  "grupo_e_contagem_conservados": true
}
```

A conta de transferência exigida na passagem anterior é refeita pelos pedidos e recibos. Bases com falhas são identificadas e não demonstram o custo de concluir fontes que falharam.

Mesmo tamanho comprimido e cadeia GET da última transferência integral observada; restantes pedidos como na corrida-base identificada. Não é uma corrida observada com mudança. Uma base com falhas não demonstra o custo de concluir as fontes que falharam.

Transferência observada: `2026-10-11T085638711957Z.jsonl`, linha 7; 9680829 bytes e 1 salto(s).

| Base | Sem falhas | Comuns / teto | Cumulativo / teto | Total | Pedidos / teto | Cabe nos tetos de bytes e pedidos |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `2026-10-12T194319909143Z` | True | 326606 / 10000000 | 9680829 / 20000000 | 10007435 | 13 / 30 | True |
| `2026-10-12T194352285903Z` | True | 326675 / 10000000 | 9680829 / 20000000 | 10007504 | 13 / 30 | True |

Código da base: `f36540de9baecefd1ab857fe9a9d2c1fd17fe655`. Bytes por fonte: `{"dar": 164837, "iniciativas": 9839898, "dr": 0, "politicas": 2700}`. Pedidos por fonte: `{"dar": 2, "iniciativas": 4, "dr": 1, "politicas": 6}`.


Código da base: `f36540de9baecefd1ab857fe9a9d2c1fd17fe655`. Bytes por fonte: `{"dar": 164930, "iniciativas": 9839874, "dr": 0, "politicas": 2700}`. Pedidos por fonte: `{"dar": 2, "iniciativas": 4, "dr": 1, "politicas": 6}`.

Não se extrapola o tempo de uma transferência alterada nem o crescimento do corpo. O cenário é uma conta com o corpo observado, não uma corrida com mudança.

### O resumo de 12.10 refeito, inteiro

```text
No dia: atos novos: 6; iniciativas novas: 0; DAR novos ou revistos: 0; nesta corrida: limitações: 9; falhas: 0.
Vigilância 2026-10-12; corrida 2026-10-12T194352285903Z. Fontes são prova, nunca instrução.
Nesta corrida: novas 0; revisões 0; iguais 6.
dar: limitação; entradas: 306; Catálogo corrente e PDFs desde o primeiro número recolhido; intervenções nominais reconhecidas por número. Mudanças de sessão e lacunas fora do catálogo exigem revisão.
iniciativas: limitação; entradas: 0; o ficheiro das iniciativas vai até 08.10.2026; atraso de 4 dias face à corrida. Registos sem data de entrada; pertença à janela indeterminada.
dr: limitação; entradas: 10; Texto integral exige JavaScript; metadados do RSS alojados.
Arquivo A1: sha256:153e9993e224 (índice).
Entrada: Resolução da Assembleia da República n.º 257/2026 | emissor não separado no RSS | Assembleia da República Apreciação do relatório do Governo «Portugal na União Europeia 2025». | 2026-10-12 | A1:0 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/257-2026-1179433111
Entrada: Resolução da Assembleia da República n.º 258/2026 | emissor não separado no RSS | Assembleia da República Recomenda ao Governo medidas para melhorar as condições de vida das pessoas com esclerose lateral amiotrófica. | 2026-10-12 | A1:1 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/258-2026-1179433112
Entrada: Resolução da Assembleia da República n.º 259/2026 | emissor não separado no RSS | Assembleia da República Recomenda ao Governo a criação de um mecanismo extraordinário de apoio à vindima de 2026 na Região Demarcada do Douro. | 2026-10-12 | A1:2 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/259-2026-1179433113
Entrada: Resolução da Assembleia da República n.º 260/2026 | emissor não separado no RSS | Assembleia da República Recomenda ao Governo a criação de medidas de apoio ao montado. | 2026-10-12 | A1:3 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/260-2026-1179433114
Entrada: Portaria n.º 452/2026/1 (detalhes no índice).
Entrada: Portaria n.º 453/2026/1 (detalhes no índice).
Arrumação: tipos ato: 10; declaração: 306.
Versões: 316; entradas vigentes: 316; fila: 0.
Atos de dias anteriores reprocessados da fila: 4.
Descrições cortadas por tamanho: 2; designações omitidas: 0. DAR: prova no índice.
```

As designações de todos os atos novos ficam no resumo; as descrições literais e os oradores ocupam o espaço restante. As razões não são cortadas e cada falha aparece uma vez. A arrumação fica no fim. O espaço exterior ao CDATA é removido na apresentação, mantendo intactos o arquivo e os selos históricos.

### Plantas, portão e preservação

Plantas e controlos: 32 de 32, em `plantas-d.json`.

* `Provas.planta_excerto`: «excerto alterado contra o arquivo»; passou: True.
* `Provas.planta_autoria`: «autoria trocada contra o arquivo»; passou: True.
* `Provas.planta_data`: «data errada contra o arquivo»; passou: True.
* `Provas.planta_corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `Provas.planta_vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `PlantasDAR.planta_excerto`: «excerto alterado contra o arquivo»; passou: True.
* `PlantasDAR.planta_autoria`: «autoria trocada contra o arquivo»; passou: True.
* `PlantasDAR.planta_data`: «data errada contra o arquivo»; passou: True.
* `PlantasDAR.planta_corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `PlantasDAR.planta_vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `PlantasDR.planta_excerto`: «excerto alterado contra o arquivo»; passou: True.
* `PlantasDR.planta_autoria`: «autoria trocada contra o arquivo»; passou: True.
* `PlantasDR.planta_data`: «data errada contra o arquivo»; passou: True.
* `PlantasDR.planta_corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `PlantasDR.planta_vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `Provas.resumo_nomeia_todos_atos_e_falhas_uma_vez`: «ato novo omitido por tamanho»; passou: True.
* `Provas.descricao_sem_espaco_xml_e_contagens_rotuladas`: «descrição sem espaço XML e contagens com âmbito»; passou: True.
* `Provas.resumo_razao_falha_inteira`: «razão da falha cortada ou repetida»; passou: True.
* `Provas.planta_reutilizacao_sem_validadores`: «reutilização sem validadores apresentada como validada»; passou: True.
* `Provas.planta_dar_novidade_do_dia`: «número do DAR do dia retirado do resumo pela segunda corrida»; passou: True.
* `Provas.reconferencia_retoma_apos_falha_indice`: «reconferência semanal perdida após falha do índice»; passou: True.
* `Provas.fugas_positivo_em_ficheiro`: «ficheiro com fuga plantada escapou ao detetor»; passou: True.
* `Provas.planta_limitacao_como_falha`: «limitação conhecida apresentada como falha»; passou: True.
* `Provas.planta_falha_como_limitacao`: «falha apresentada como limitação»; passou: True.
* `Provas.planta_dois_numeros_dar`: «número do DAR omitido do resumo sem aviso»; passou: True.
* `Provas.planta_ato_sem_descricao`: «ato sem a descrição da fonte»; passou: True.
* `Provas.cumulativo_teto_proprio_e_uma_transferencia`: «teto de uma transferência cumulativa por dia atingido; ficheiro alterado fica em fila»; passou: True.
* `Provas.cumulativo_excedente_nao_alojado`: «teto de bytes atingido; corpo incompleto não alojado»; passou: True.
* `Provas.indice_mesmo_tamanho_le_corpo`: «índice reutilizado só pelo tamanho»; passou: True.
* `Provas.head_mudado_nao_reutiliza_gzip_mesmo_tamanho`: «HEAD alterado foi ignorado pelo tamanho comprimido»; passou: True.
* `Provas.dar_servido_com_outra_ligacao_na_segunda_corrida`: «número arquivado desapareceu da reconferência semanal»; passou: True.
* `Provas.aviso_descompressao`: «ficheiro descomprimido acima de oitenta por cento do limite»; passou: True.

Portão do motor: `0`, lido de `portoes-d/motor.codigo`, na cabeça `f36540de9baecefd1ab857fe9a9d2c1fd17fe655`. O registo lista a suite de vigilância e as plantas executadas. Provas dos fluxos em `fluxo-d.json` e `fluxos-motor-d.json`.

Código do motor: `f36540de9baecefd1ab857fe9a9d2c1fd17fe655`. Código dos guiões do sítio: `7c59af21f6788da58b096e80911d33d2aa021580`. Cabeças medidas e commits em `cabecas-d.json`; o commit de fecho é posterior à medição. Hashes de todas as corridas em `d/hashes-todas-corridas.json`.

A procura de fugas cobre as listas dos ficheiros tocados nos dois repositórios e os corpos descodificados. O conhecido-positivo cria uma cópia temporária, planta um ficheiro e chama o mesmo detetor; resultado em `d/fugas-positivo.json`. Listas completas e caminhos protegidos em `preservacao-d.json`.

### Questões e escolhas desta passagem

* **V1-33**: a data mais recente do ficheiro é uma medida da cobertura alojada, não uma alegação sobre a inexistência de iniciativas posteriores. A aceitação espera a publicação das entradas da janela pela fonte.
* **V1-34**: o DAR segue a novidade do dia em qualquer corrida, tal como os atos. As alterações dos recibos desse dia e a marca de estreia preservam grupos; uma revisão histórica sem mudança hoje não basta para repetir o número.
* **V1-35**: o resumo reserva primeiro as designações, as razões completas e os cabeçalhos do DAR. Corta descrições e oradores antes de perder designações. Se o conteúdo obrigatório exceder o limite, recusa a escrita em vez de ocultar atos.
* **V1-36**: uma falha de índice no dia semanal conserva tarefas PDF com o documento e a prova de descoberta. As tarefas sobrevivem a novas falhas e saltam a cadência no dia seguinte; isto concretiza a V1-23.
* **V1-37**: o conhecido-positivo de fugas usa um ficheiro numa cópia temporária, e o portão mostra os nomes das suites e os resultados das plantas. Uma marca de sucesso sem execução não é prova.
* **V1-38**: as bases desta passagem são as cabeças de entrada já fundidas. A procura junta o diff completo desde essas cabeças à lista integral da V1-c, preservada com a sua soma de controlo. Assim cobre todo o bloco sem atribuir à vigilância os ficheiros de outras passagens trazidos pelas fusões.

Custo: linha `tokens used` não observada. Não se estima o total nem se afirma cumprimento do alvo de custo.

## A passagem V1-c

Medida por `python3 <medicoes>/medir_v1c.py --motor <motor> --provas --portao`. As decisões V1-9, V1-16 e V1-17 ficam substituídas pelas regras desta passagem: limitações separadas das falhas, orçamento próprio do cumulativo, DAR e DR primeiro e reconferência semanal declarada.

Aceitação das corridas: **por cumprir**. A conferência `--fecho` não passa; falhas reais de recolha impedem afirmar a leitura das três fontes. O par abaixo é o último par executado, conservado com os seus resultados, não um par aceite.

### Corridas finais

| Corrida | Pedidos | Bytes comuns | Bytes cumulativo | Segundos | Novas | Revisões | Iguais | Falhas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `2026-10-12T165158114077Z` | 12 | 245669 | 0 | 81.374 | 0 | 0 | 6 | 2 |
| `2026-10-12T165319624765Z` | 12 | 245676 | 0 | 80.949 | 0 | 0 | 6 | 2 |

Recibo: `<motor>/vigilancia/corridas/2026-10-12T165158114077Z.json`; pedidos: `<motor>/vigilancia/pedidos/2026-10-12T165158114077Z.jsonl`.
Bytes por fonte: `{"dar": 84300, "iniciativas": 158669, "dr": 0, "politicas": 2700}`. Pedidos por fonte: `{"dar": 2, "iniciativas": 3, "dr": 1, "politicas": 6}`.
Reconferências adiadas por cadência, por fonte: `{"dr": 6}`. Os documentos adiados não foram reconfirmados remotamente nesta corrida; as fontes efetivamente lidas são discriminadas abaixo.
Estados: `{"dar": "falha", "iniciativas": "falha", "dr": "limitação"}`. Fontes lidas: `{"dar": false, "iniciativas": false, "dr": true}`.
Limitações por código: `{"javascript": 6}`. Falhas: `[{"origem": "dar", "razao": "pedido sem resposta completa: ReadTimeout"}, {"origem": "iniciativas", "razao": "arquivo ou resposta ilegível: ReadTimeout"}]`. Fila: `[{"origem": "dar", "acao": "indice"}, {"origem": "iniciativas", "acao": "indice"}]`.

Recibo: `<motor>/vigilancia/corridas/2026-10-12T165319624765Z.json`; pedidos: `<motor>/vigilancia/pedidos/2026-10-12T165319624765Z.jsonl`.
Bytes por fonte: `{"dar": 84301, "iniciativas": 158675, "dr": 0, "politicas": 2700}`. Pedidos por fonte: `{"dar": 2, "iniciativas": 3, "dr": 1, "politicas": 6}`.
Reconferências adiadas por cadência, por fonte: `{"dr": 6}`. Os documentos adiados não foram reconfirmados remotamente nesta corrida; as fontes efetivamente lidas são discriminadas abaixo.
Estados: `{"dar": "falha", "iniciativas": "falha", "dr": "limitação"}`. Fontes lidas: `{"dar": false, "iniciativas": false, "dr": true}`.
Limitações por código: `{"javascript": 6}`. Falhas: `[{"origem": "dar", "razao": "pedido sem resposta completa: ReadTimeout"}, {"origem": "iniciativas", "razao": "arquivo ou resposta ilegível: ReadTimeout"}]`. Fila: `[{"origem": "dar", "acao": "indice"}, {"origem": "iniciativas", "acao": "indice"}]`.

Tentativa anterior conservada: `2026-10-12T163450513027Z`; falhas `[{"origem": "dar", "razao": "anfitrião sem política de acesso conferida"}, {"origem": "iniciativas", "razao": "anfitrião sem política de acesso conferida"}]`. Não integra o par final; recibo e pedidos permanecem no motor e as medidas estão em `tentativas-c.json`.

Tentativa anterior conservada: `2026-10-12T163537667621Z`; falhas `[{"origem": "dar", "razao": "pedido sem resposta completa: ReadTimeout"}]`. Não integra o par final; recibo e pedidos permanecem no motor e as medidas estão em `tentativas-c.json`.

Tentativa anterior conservada: `2026-10-12T163707747266Z`; falhas `[{"origem": "dar", "razao": "pedido sem resposta completa: ReadTimeout"}]`. Não integra o par final; recibo e pedidos permanecem no motor e as medidas estão em `tentativas-c.json`.

Tentativa anterior conservada: `2026-10-12T164333882433Z`; falhas `[{"origem": "dar", "razao": "pedido sem resposta completa: ReadTimeout"}]`. Não integra o par final; recibo e pedidos permanecem no motor e as medidas estão em `tentativas-c.json`.

Tentativa anterior conservada: `2026-10-12T164814083405Z`; falhas `[]`. Não integra o par final; recibo e pedidos permanecem no motor e as medidas estão em `tentativas-c.json`.

Tentativa anterior conservada: `2026-10-12T164917447645Z`; falhas `[{"origem": "dar", "razao": "pedido sem resposta completa: ReadTimeout"}, {"origem": "iniciativas", "razao": "arquivo ou resposta ilegível: ReadTimeout"}]`. Não integra o par final; recibo e pedidos permanecem no motor e as medidas estão em `tentativas-c.json`.

Última leitura completa das iniciativas: `2026-10-12T164814083405Z`; registos sem data `[{"contagem": 1, "identificadores": [{"posicao": 1509, "IniId": "377355"}]}]`. Uma lista vazia no recibo de uma fonte falhada não demonstra ausência de registos sem data.

Limitações sem data declaradas no último recibo: `[]`. As provas e razões completas estão nos recibos. O heartbeat separa limitações e falhas.
Aceitação de entrada datada na janela: `{"dar": {"estado": "por cumprir", "inicio": "2026-10-11", "fim": "2026-10-12"}, "iniciativas": {"estado": "por cumprir", "inicio": "2026-10-11", "fim": "2026-10-12"}, "dr": {"estado": "cumprida", "inicio": "2026-10-11", "fim": "2026-10-12"}}`. A falta de entrada não é alarme.

### A aritmética do achado 7

As bases da conta são as últimas corridas completas observadas com este código, identificadas abaixo. Tentativas com falhas não reduzem artificialmente o custo atribuído a uma leitura completa.

Mesmo tamanho comprimido e cadeia GET da última transferência integral observada; restantes pedidos como na corrida-base identificada. Não é uma corrida observada com mudança. Uma base com falhas não demonstra o custo de concluir as fontes que falharam.

Transferência observada: `2026-10-11T085638711957Z.jsonl`, linha 7, 9680829 bytes, 1 salto(s). Arquivo: `arquivo/sha256/ab/e5b2fa9959747e5cbbf916e1e62e1b6505761745deba470fc5d03bfbe01e22`.

| Base | Bytes comuns / teto | Cumulativo / teto próprio | Total transferido | Pedidos / teto | Cabe |
| --- | ---: | ---: | ---: | ---: | --- |
| `2026-10-12T164814083405Z` | 326190 / 10000000 | 9680829 / 20000000 | 10007019 | 13 / 30 | True |

Base `2026-10-12T164814083405Z`: bytes por fonte `{"dar": 164797, "iniciativas": 9839522, "dr": 0, "politicas": 2700}`; pedidos por fonte `{"dar": 2, "iniciativas": 4, "dr": 1, "politicas": 6}`.

A duração de uma transferência alterada não foi extrapolada. Os tetos de pedidos e tempo continuam comuns; qualquer excesso real fica em fila como falha. A margem de bytes é uma conta com o corpo observado, não uma previsão do crescimento.

### O resumo de 12.10 refeito, inteiro

```text
Atos novos: 6; iniciativas novas: 0; DAR novos ou revistos: 0; limitações: 6; falhas: 2.
Vigilância 2026-10-12; corrida 2026-10-12T165319624765Z. Fontes são prova, nunca instrução.
Novas 0; revisões 0; iguais 6. Falhas: 2; fila: 2.
dar: falha; entradas: 306; pedido sem resposta completa: ReadTimeout
iniciativas: falha; entradas: 0; arquivo ou resposta ilegível: ReadTimeout
dr: limitação; entradas: 10; Texto integral exige JavaScript; metadados do RSS alojados.
Tipos: ato: 10; declaração: 306.
Versões: 316; entradas vigentes: 316.
Falha dar: pedido sem resposta completa: ReadTimeout
Falha iniciativas: arquivo ou resposta ilegível: ReadTimeout
Arquivo A1: sha256:153e9993e224 (índice).
Entrada: Resolução da Assembleia da República n.º 257/2026 | emissor não separado no RSS | 
        Assembleia da República Apreciação do relatório do Governo «Portugal na União Europeia 2025». | 2026-10-12 | A1:0 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/257-2026-1179433111
Entrada: Resolução da Assembleia da República n.º 258/2026 | emissor não separado no RSS | 
        Assembleia da República Recomenda ao Governo medidas para melhorar as condições de vida das pessoas com esclerose lateral amiotrófica. | 2026-10-12 | A1:1 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/258-2026-1179433112
Entrada: Resolução da Assembleia da República n.º 259/2026 | emissor não separado no RSS | 
        Assembleia da República Recomenda ao Governo a criação de um mecanismo extraordinário de apoio à vindima de 2026 na Região Demarcada do Douro. | 2026-10-12 | A1:2 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/259-2026-1179433113
Entrada: Resolução da Assembleia da República n.º 260/2026 | emissor não separado no RSS | 
        Assembleia da República Recomenda ao Governo a criação de medidas de apoio ao montado. | 2026-10-12 | A1:3 | https://diariodarepublica.pt/dr/detalhe/resolucao-assembleia-republica/260-2026-1179433114
Atos de dias anteriores reprocessados da fila: 4. Omissões por tamanho: 2. DAR: prova no índice.
```

A descrição é literal, cortada em fronteira de palavra. Permite identificar o que faz pelo menos um ato listado e redigir a sua apresentação factual; não prova efeitos ou execução da medida. O DAR antigo não volta como novidade. O limite conserva as razões de cobertura e todos os cabeçalhos dos números selecionados, declarando separadamente as omissões.

O resumo de 11.10 identifica a recontagem e a corrida original. Falhas e fila vêm desse recibo, revisões vêm da recontagem; não se reescrevem os recibos antigos.

### Plantas e portão

Plantas e controlos: 25 de 25; provas em `plantas-c.json`.
* `Provas.planta_excerto`: «excerto alterado contra o arquivo»; passou: True.
* `Provas.planta_autoria`: «autoria trocada contra o arquivo»; passou: True.
* `Provas.planta_data`: «data errada contra o arquivo»; passou: True.
* `Provas.planta_corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `Provas.planta_vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `PlantasDAR.planta_excerto`: «excerto alterado contra o arquivo»; passou: True.
* `PlantasDAR.planta_autoria`: «autoria trocada contra o arquivo»; passou: True.
* `PlantasDAR.planta_data`: «data errada contra o arquivo»; passou: True.
* `PlantasDAR.planta_corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `PlantasDAR.planta_vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `PlantasDR.planta_excerto`: «excerto alterado contra o arquivo»; passou: True.
* `PlantasDR.planta_autoria`: «autoria trocada contra o arquivo»; passou: True.
* `PlantasDR.planta_data`: «data errada contra o arquivo»; passou: True.
* `PlantasDR.planta_corpo`: «corpo truncado ou alterado no arquivo»; passou: True.
* `PlantasDR.planta_vazio`: «falha apresentada como vazio ou cobertura completa»; passou: True.
* `Provas.planta_limitacao_como_falha`: «limitação conhecida apresentada como falha»; passou: True.
* `Provas.planta_falha_como_limitacao`: «falha apresentada como limitação»; passou: True.
* `Provas.planta_dois_numeros_dar`: «número do DAR omitido do resumo sem aviso»; passou: True.
* `Provas.planta_ato_sem_descricao`: «ato sem a descrição da fonte»; passou: True.
* `Provas.cumulativo_teto_proprio_e_uma_transferencia`: «teto de uma transferência cumulativa por dia atingido; ficheiro alterado fica em fila»; passou: True.
* `Provas.cumulativo_excedente_nao_alojado`: «teto de bytes atingido; corpo incompleto não alojado»; passou: True.
* `Provas.indice_mesmo_tamanho_le_corpo`: «índice reutilizado só pelo tamanho»; passou: True.
* `Provas.head_mudado_nao_reutiliza_gzip_mesmo_tamanho`: «HEAD alterado foi ignorado pelo tamanho comprimido»; passou: True.
* `Provas.dar_servido_com_outra_ligacao_na_segunda_corrida`: «número arquivado desapareceu da reconferência semanal»; passou: True.
* `Provas.aviso_descompressao`: «ficheiro descomprimido acima de oitenta por cento do limite»; passou: True.

Portão do motor: `0`, lido de `portoes-c/motor.codigo`, na cabeça `253cfc3658c603b6c89b86cc6cb6605500e4484d`. Os hashes do código estão em `portoes-c/motor.json`. Autotestes e validadores dos fluxos: `autotestes-c.json`, `fluxo-c.json`, `fluxos-motor-c.json`.

Código do motor: `253cfc3658c603b6c89b86cc6cb6605500e4484d`. Código dos guiões do sítio: `e00d0c1ad299e80262f328b0602d0140315bd4f2`. Cabeças medidas e commits em `cabecas-c.json`; o commit do relatório é posterior a essa medição. Todas as corridas, sem filtragem prévia, constam de `hashes-todas-corridas.json`.

Preservação: 12 de 12 ficheiros preexistentes, comparados com a cabeça de entrada `7cb8760d36370904919521453072755a31e3baba`; o registo histórico `alteracoes-preexistentes.json` não foi reescrito. Caminhos protegidos sem alterações. A procura de fugas usa as listas completas do diff desde as bases dos dois repositórios, mais os ficheiros por registar; listas e resultado em `preservacao-c.json`. As confirmações das cinco plantas da leitura estão em `confirmacao-c.json`.

### Questões e escolhas desta passagem

* **V1-23**: o dia semanal escolhido é o declarado no registo, segunda-feira. Uma fonte indisponível nesse dia fica pendente para retoma; PDFs recentes continuam diários.
* **V1-24**: a marca da transferência cumulativa é escrita antes de ler o corpo. Uma interrupção ou excesso consome a tentativa diária, para não repetir a descarga. A fila conserva a razão até ao dia seguinte.
* **V1-25**: a comparação por tamanho sem validadores continua a poder perder uma alteração remota do mesmo tamanho, limite autorizado no mandato anterior. A conta de um dia com mudança usa o último corpo comprimido observado e identifica essa hipótese.
* **V1-26**: a janela de aceitação usa data de publicação e o início efetivo da vigilância. Uma entrada recolhida agora mas publicada antes da janela não a cumpre.
* **V1-27**: o limite conservador de bytes do resumo pode cortar atos e oradores, com aviso. Se até os cabeçalhos e razões obrigatórios excederem o limite, o guião recusa a escrita em vez de os omitir silenciosamente.
* **V1-28**: a descompressão permite 268435456 bytes; avisos acima de oitenta por cento são medidos por corpo e copiados para o recibo.

* **V1-29**: a cadência semanal reduz os pedidos ordinários, mas não prova que todos os PDFs antigos caibam para sempre num único dia semanal. O teto comum continua a valer e o excesso conserva a sua tarefa em fila; a aritmética mede a configuração observada.

* **V1-30**: uma mudança observada por HEAD prevalece sobre a coincidência posterior do tamanho comprimido. A planta usa dois corpos de tamanhos expandidos diferentes com gzip do mesmo tamanho; o segundo corpo tem de ser transferido.

* **V1-31**: o inventário persistente dos números arquivados conserva as reconferências quando esses números saem da página corrente. A prova atravessa uma janela sem índices recentes e substitui o número do catálogo por um segundo número sintético.

* **V1-32**: o fecho exige duas corridas que leiam as três fontes sem falhas. As tentativas de rede, incluindo as falhadas, ficam conservadas; uma corrida isolada sem falhas não basta para fechar o par. O estado de aceitação acima é calculado, não decidido por omissão de recibos.

Custo: linha `tokens used` não observada. Não se estima o total nem se afirma cumprimento do alvo de custo.

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
