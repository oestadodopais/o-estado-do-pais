# OG1-B: aberturas e Orçamento depois do voto, com paragem na cobertura das áreas

A segunda retoma aplicou a redação e as declarações de língua autorizadas, mas a construção parou na regra A7 de `check:areas`: as vinte e quatro linhas novas não têm matéria nem exclusão declarada. O §D da segunda adenda manda parar quando uma régua pede uma declaração que não consta do mandato. Não se atribuiu uma matéria e não se alargou a lista das exclusões.

## O que mudou para o leitor

Os três itens abrem com dois parágrafos de uma frase. A primeira página mostra a primeira frase da abertura e conserva a data de publicação. A ordenação usa a data de escrita e desempata pela publicação. As aberturas da Saúde e das parcerias têm as definições e os recibos pedidos. O item do Orçamento apresenta a votação na generalidade, cinco posições novas, o Conselho das Finanças Públicas e os juros, mantendo seis secções.

A opinião inglesa usa agora «in the Government's forecasts; that surplus depends on three assumptions the UTAO calls into question:». A frase portuguesa ficou intacta. Não se criou uma exceção de voz. Entraram a unidade abreviada, os quatro títulos, o organismo CFP e a edição neutra autorizados pela segunda adenda. As duas contagens vivas do inventário passaram a 4 138. A mensagem sobre as frases da semana na retoma anterior apontava para as famílias OG1 sem auditoria; não se reescreveram frases de outros blocos.

## Cabeça e estado da construção

O commit `18ea0891b` inclui o trabalho pendente e a segunda adenda. A árvore foi conferida limpa antes e durante a construção. O HTML foi gerado com a cabeça `18ea0891b648a44121fdad4a9844e54de97cfcc7`, igual à cabeça do Git. O comando `npm run build` terminou com código 1 na A7. É uma construção de cabeça limpa, mas não uma construção aprovada.

O teste isolado `check:discussao`, iniciado antes de identificar que a A7 exigia nova declaração, terminou com código 1. A parte V2B mediu zero erros, 766 de 766 plantas com mordida e 764 portas de integração. As nove glosas passaram, com 60 plantas recusadas. O teste OG1 passou as plantas portuguesas de data e partido e falhou depois em `tests/discussao/og1.mjs:69`: `TypeError: Cannot read properties of null (reading '0')`. O ramo que verifica `entity_aliases` tenta ler `p.attributed_to[0]` sem confirmar a atribuição pessoal. Esta correção ficou por fazer após a paragem.

A tentativa de interromper a cadeia de conferências por consulta dos processos foi recusada pela sandbox: `PermissionError: [Errno 1] Operation not permitted: 'ps'`. Não se pediu escalada. A cadeia terminou por si na falha da discussão; nenhuma conferência seguinte arrancou.

## Frases e listas fechadas

`mandato-frases.json` já contém a nova redação inglesa. O confronto final não foi repetido após a paragem. `frases-construidas.json` conserva as 46 entradas verificadas na retoma anterior, carimbadas com a cabeça `71aced123d3b917af8c1d036a0d0f2dc4406e87d`; não é prova do HTML atual e ainda contém a expressão entretanto substituída. O guião de extração está pronto para repetir o confronto quando a construção ficar aprovada.

O inventário contém 30 linhas novas de parágrafos e 12 linhas reescritas dos títulos, secções e portas. A entrada de revisão `og1-b` permanece «por ler», com a razão pedida. As 57 famílias estão declaradas; as 24 novas estão também auditadas com os excertos das próprias linhas. A auditoria dos três itens voltou a gerar e conferir 751 folhas e recusou a planta do apoio falso.

## Conferências desta segunda retoma

Os códigos e registos constam de `conferencias-retoma-2.json`; cada execução tem um ficheiro `.codigo`.

| Conferência | Código | Resultado |
| --- | ---: | --- |
| Gerador da auditoria | 0 | 751 folhas escritas e conferidas. |
| Gerador com `--prova` | 0 | Apoio falso recusado e auditoria original aceite. |
| `npm run build` | 1 | HTML gerado; A7 exige declaração para as 24 linhas novas. |
| `check:discussao` | 1 | 766 plantas V2B com mordida; teste OG1 falha numa atribuição pessoal nula. |

O `build` executou os seus passos internos até à cobertura das áreas. Os resultados internos não contam como novas execuções principais. Não se correram isoladamente nesta retoma `check:voz`, `check:lingua`, `check:palavras`, `gate:html`, `check:registo`, `ledger:check`, `check:cruzamento`, `check:rotulos` ou `typecheck`. Não se deve transferir para a cabeça atual o resultado isolado de uma retoma anterior.

Não se pediu o perfil `og1-b-navegador`; `check:frases-compostas` e `check:primeira` ficaram pendentes. Nenhuma corrida inteira de portões, `verify` ou `conferir-tudo.sh`. Não há capturas nem manifesto: a paragem aconteceu antes desse passo, sem esgotar o orçamento.

## Decisões e questões

- **OG1-B-1:** sai a data de generalidade não usada e entra a votação final global em `apenasDatas`, como aceite.
- **OG1-B-2:** conservam-se os nomes e atributos FP2, com comentário; a prova aponta para `abertura[0]`.
- **OG1-B-3:** o ajudante `item()` recebe aberturas e recibos.
- **OG1-B-4:** derivados apoiados nos excertos das linhas de origem; folhas intactas conservam apoios contextuais e a prova numérica da contagem. Sem excertos inventados.
- **OG1-B-5:** glosas numéricas ligadas aos fragmentos, com as mesmas palavras e unidades antes dos selos. Nove controlos e 60 plantas passaram nesta cabeça.
- **OG1-B-6:** o portão OG1 reconhece o caminho exato do relatório selado e a página exata do CFP, mantendo as comparações de ficheiro, hash, data, valor e fonte.
- **OG1-B-7:** perfil fechado `og1-b-navegador`, apenas com as duas conferências autorizadas. Preparado e provado anteriormente, ainda não executado no sítio.
- **OG1-B-q1:** fechada pela primeira adenda: famílias declaradas e auditadas.
- **OG1-B-q2:** parcialmente fechada: cabeça limpa construída, contagens atualizadas, glosas e 766 plantas V2B aprovadas. Falta corrigir o teste OG1 e concluir a verificação.
- **OG1-B-q3:** aberta: conferências de navegador e capturas.
- **OG1-B-q4:** redação resolvida pela segunda adenda, sem exceção contextual. Falta repetir `check:voz`.
- **OG1-B-q5:** declarações autorizadas aplicadas. Falta repetir `check:lingua`.
- **OG1-B-q6:** bloqueio atual: declarar a matéria ou exclusão das 24 linhas novas. `SEM_AREA`, em `src/data/areas.mjs`, cobre expressamente as 33 linhas anteriores e diz «antes do voto na generalidade». Alargar essa declaração exige decisão do lugar de direção. A régua permanece intacta.
- **OG1-B-q7:** falha técnica pendente no teste OG1 ao ler uma atribuição pessoal nula, descrita acima.

## As passagens e a entrega

A passagem inicial parou por falta das famílias, com 23 chamadas e 15 execuções de verificação; o recibo está no histórico `d443ffd42`. A primeira retoma parou na expressão inglesa, com 35 chamadas e 22 execuções; implementação `71aced123`, recibo `44a88d568`, relatório conservado em `LEIA-ME-retoma-1.md`.

Nesta segunda retoma houve 23 chamadas antes da escrita deste recibo e quatro execuções principais de verificação. A escrita, o pedido de commit e a inspeção final acrescentam três chamadas, totalizando 26 se terminarem sem nova tentativa. Os registos anteriores ficam como histórico. O custo é escrito pelo lançador; não foi exposta uma linha «tokens used».

O último commit entrega apenas este recibo e os seus registos. Nenhuma alteração ao motor, ao registo público das correções, à identidade, à navegação, ao Método ou aos estudos. A implementação não está concluída; a leitura a frio continua por fazer.

Sem push.
