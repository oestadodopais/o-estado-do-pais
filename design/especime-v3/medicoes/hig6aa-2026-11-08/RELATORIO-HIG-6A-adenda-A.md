# HIG-6A, adenda A: paragem no ensaio dos pares

Não concluído. O ensaio que impede reutilizar uma entrada para justificar várias entradas da outra língua recusou a VOZ-2A atual em quatro entradas:

| Entrada | Classe | Língua | Estudo |
| --- | --- | --- | --- |
| V161 | REESCREVE | pt | evora-2027-prometido-painel-dinheiro |
| V326 | REESCREVE | pt | evora-contas-da-camara-2010-2025 |
| V331 | REESCREVE | en | evora-orcamentado-pago-devido-2025 |
| V249 | REESCREVE | pt | evora-prometido-pago-auditado-2026 |

Parei pelo §2, sem acrescentar `par: nenhum` às entradas e sem alterar as listas. O guião executável foi reposto exatamente como estava em `32a7e42bb`. A proposta ficou em [ensaio-pares-por-entrada.patch](ensaio-pares-por-entrada.patch), e as entradas e os blocos recusados em [voz2a-recusada.json](voz2a-recusada.json).

## O que foi medido

A retirada da dependência da voz, com a exceção `par: nenhum` fundamentada e sem exigir pares a FICA ou a estudos sem as duas edições publicadas, passou na VOZ-2A. Na VOZ-2B encontrou seis entradas: V012, V293, V296, V093, V094 e V100. Continuaram a existir 28 quantificadores sem declaração e quinze frases sem entrada.

O diagnóstico de V122 e V124 mostrou que a procura na vizinhança podia aproveitar entradas de outros blocos: V122 encontrava V010, e V124 encontrava V013. Impedir a reutilização dos blocos, conservando a ordem e minimizando a distância, manteve a VOZ-2A verde e elevou a VOZ-2B a sete entradas, acrescentando V124.

V122 ainda podia aproveitar uma entrada inglesa porque partilha o seu bloco português com outras entradas. O ensaio seguinte fez o emparelhamento individual das entradas, incluindo as que estão no mesmo bloco. A exclusividade foi a minha interpretação de «o par de cada entrada»; não está escrita como condição separada na adenda. Esse ensaio recusou as quatro entradas da tabela. Não o dei por validado nem prossegui para dispensas automáticas. A VOZ-2B não voltou a ser medida depois dessa recusa.

Os ensaios usaram as funções da camada 0 sobre o `dist/` existente, construído em `ba1237959`. A cabeça da worktree é `32a7e42bb`, que acrescentou os registos do fecho anterior. Não foi alterado o carimbo do `dist/`, nem contornada a guarda de cabeça do pré-mandato. Estas medições não são apresentadas como uma corrida completa do pré-mandato na cabeça atual.

## Comandos, códigos e trabalho pendente

Correram quatro medições por `sh scripts/leituras/curto.sh <registo> node --input-type=module -`, importando as funções de `scripts/leituras/conferir-frases.mjs`:

| Medição | Código |
| --- | ---: |
| Regra sem dependência da voz, listas A e B | 0 |
| Diagnóstico dos candidatos de V122, V124 e V094 | 0 |
| Emparelhamento exclusivo dos blocos, listas A e B | 0 |
| Emparelhamento exclusivo das entradas, paragem na lista A | 9 |

Os resultados resumidos estão em [ensaios.log](ensaios.log). Nenhuma das propostas foi instalada. Os lançadores ficaram por alterar. Não correram `check:pre-mandato`, `typecheck`, build, portões conjuntos ou capturas nesta adenda, por causa da paragem. Ficam pendentes as plantas em memória pedidas, a proteção dos lançadores e o fecho completo.

Quatro invocações de conferência ou medição. A contagem final das chamadas de ferramentas segue na resposta, depois de guardar e conferir este relatório.
