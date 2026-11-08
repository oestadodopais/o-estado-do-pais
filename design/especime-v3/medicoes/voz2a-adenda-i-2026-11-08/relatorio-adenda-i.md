# VOZ-2A, adenda I, 08.11.2026

A V331 passou a «(inference; the table is the source's)» no documento inglês do orçamentado. A página portuguesa voltou a «(inferência)», como a página inglesa «(inference)». O documento português conserva «(inferência; a tabela é da fonte)», byte a byte igual à cabeça e64065a. As quatro formas foram copiadas e conferidas no dist, em `etiquetas-do-dist.json`.

A reancoragem da troca do estudo 16 conserva todos os seus ficheiros publicados. A V331 é a única mudança nos documentos; só um bloco da página portuguesa muda. Os 27 livros-razão e as 8382 referências dos 25 registos ficam iguais. As restantes edições e os arquivos mantêm os bytes. A data continua a ser 08.11.2026; não se acrescenta edição, entrada ou correção.

A prova da voz muda apenas nas contagens correspondentes à substituição reposta: operações 874 → 875, substituições 412 → 413, operações S6 296 → 297 e intervalos conferidos 9758 → 9757. A diminuição de um intervalo corresponde à etiqueta que volta à forma simples da página. Blocos, frases e referências não mudam. O ensaio conserva todas as proteções e passou com as contagens medidas.

| Conferência | Código |
|---|---:|
| build inteiro | 0 |
| check:voz, incluindo pares | 0 |
| check:voz-retiradas | 0 |
| check:edicoes | 0 |
| check:registo | 0 |
| typecheck | 0 |
| guião das frases novas | 0 |
| core.gate fora da sandbox | 0 |

O guião dos pares mede seis estudos: zero blocos sem par e zero mudanças fora da lista. A planta unilateral dá dois blocos, o antigo e o novo, e o controlo dá zero; as seis plantas dos ramos mordem. Os 176 campos nova dão zero recusas e zero diferenças de números entre línguas. O check:voz-retiradas confere 1391 retiradas em memória e duas execuções reais: controlo a 0 e quatro adulterações recusadas a 1. Os ensaios isolados do motor passaram: voz, 26 verificações; composição, 23.

O fecho dirigido pelo escrivão também cobriu lugar, datas, discussão, alvos, moldura, primeira página e dossiês, todos a 0. Cinco comandos foram cobertos pelo build e cinco corridos pelo executor; a união, a cabeça e a imutabilidade do dist ficaram verdes. Não houve corrida integral de verify nem capturas.

Motor: `cf5bd5b28b26d814315a5440d0b7dc1038e7ca1e`. Sítio conferido: `a1b2ffb41df2f2b4e1746cbc916681a3c76ee503`. O origin_ref do documento inglês aponta ao commit do motor que contém os bytes. A travessia final conferiu o D5 nas vinte edições aplicáveis. Os commits foram feitos pelo escrivão, com os trailers pedidos; o commit final acrescenta só o relatório e as provas.

Reprodução da integridade: `python3 design/especime-v3/medicoes/voz2a-adenda-i-2026-11-08/conferir-integridade.py <motor>`. Reprodução das etiquetas: `node design/especime-v3/medicoes/voz2a-adenda-i-2026-11-08/conferir-dist.mjs`.

31 chamadas de ferramentas de orquestração, medidas no registo desta passagem ({'exec': 17, 'wait': 14}); 15 corridas por curto.sh, incluindo gerações, conferências isoladas e medições. Um fecho dirigido pelo escrivão e um core.gate fora da sandbox, sem repetição. A conferência adicional de privacidade deu 0. tokens used: não observado.
