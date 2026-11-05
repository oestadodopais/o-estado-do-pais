# MET1, adenda A: correções verificadas, build por fechar

O build inteiro terminou com código 1 na integração da discussão. As três conferências dirigidas pedidas terminaram com código 0. O publicador do recibo de exemplo usa `linguaDaFonte`, a mesma função do recibo de cada linha. O HTML construído declara Eurostat em inglês nas duas edições. Nenhuma régua foi alterada.

A frase inglesa do passo quatro foi substituída pela redação literal da adenda, tanto nos dados da página como no oráculo independente. A amarra do Método foi atualizada na decisão da adenda.

| Conferência | Código |
| --- | --- |
| `npm run build`, inteiro | 1 |
| `npm run check:lingua`, corrida dirigida após o build | 0 |
| `node tests/metodo/plantas.mjs` | 0 |
| `node tests/metodo/construido.mjs` | 0 |
| `npm run check:discussao`, reprodução dirigida | 1 |

## Bloqueio do build

A integração da discussão encontrou oito erros, quatro em cada edição do Método: presença ou ausência errada; falta de uma origem de valor ou período no título; destino ou título errado; exceção temática não autorizada. A reprodução dirigida confirmou os mesmos erros. O recibo de exemplo usa `divida-publica-2025`, uma linha que esta conferência exige ligar ao item de discussão correspondente. O Método não inclui essa ligação.

A correção do publicador passou sem tocar na régua dos organismos. Resolver a integração exige compatibilizar o recibo de exemplo com a obrigação da discussão e com a prosa fechada do Método. Não foi acrescentada uma exceção à conferência nem prosa fora da lista: a adenda determina que nenhuma régua muda. Este bloqueio fica para o lugar de direção.

## Passo quatro copiado do dist

Português:

> A direção escreve o que muda e as frases que o leitor vai ler, conferidas na fonte.

Inglês:

> The directing model writes what changes and the sentences the reader will read, checked against the source.

## Medições e âmbito

As 44 plantas do Método passaram. O teste da construção confirmou quatro secções e dez passos por edição, e encontrou zero ocorrências do marcador antigo nas 4914 páginas portuguesas e 4909 inglesas.

Cabeça de base registada no dist: `e66dcbb860fc91dbc4e1e83b6730187b9183d85d`. O commit desta adenda é posterior à construção.

Uma corrida de build e quatro conferências dirigidas, cinco execuções de verificação no total. Sem nova corrida dos três portões, sem verify completo e sem capturas nesta adenda.

19 chamadas exteriores de ferramentas até à preparação do pedido de commit, contadas nesta sessão. O resultado do escrivão e a inspeção final da cabeça são posteriores ao relatório. A linha «tokens used» não foi exposta.

A passagem continua incompleta: falta obter o build inteiro verde. As cópias e as capturas guardadas na pasta superior documentam a versão anterior à adenda; o passo quatro atual é o transcrito acima.
