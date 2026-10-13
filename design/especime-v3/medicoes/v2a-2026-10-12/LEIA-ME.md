# V2-a: fontes da vigilância seladas no motor

As células e as palavras foram lidas nos documentos alojados. O memorando serviu de expectativa, não de origem dos valores. A página do painel pertence ao V2-b e não foi criada. A aceitação do §3 ficou incompleta: o verify e as capturas foram bloqueados pelo arranque do Chromium na sandbox.

## Cabeças e âmbito

Cabeça do código do sítio: `6618ddb5570a6642e7a3cc04829ab8aac0d7021a`. Cabeça do código do motor: `dfeca64d1d53d7af1c776c159c4e4c2044257cd2`. Os commits posteriores de entrega contêm apenas provas e este relatório; as cabeças finais ficam na resposta da passagem.

O guião do brief e `medir.py` contam 3211 linhas na partida e 3229 no fim, com 18 novas. A comparação dos objetos Git encontrou 0 linhas anteriores alteradas. As referências ao OE2027 passaram de 0 a 18. Os conhecidos-positivos do guião passaram.

`medidas.json` contém as linhas e os documentos medidos; `final.json` é a execução final do guião original do brief. O circuito reutiliza `HttpClient`, os leitores de células do OE1/JD1, os recortes e o exportador comum. As três afirmações levam `afirmacao: true`. As provas comprimidas do sítio ficam fora de `public/` e `dist/` não recebe as páginas integrais.

## Linhas criadas

Os valores seguintes vêm dos YAML exportados, conferidos contra as células e os excertos pelo motor. As variações são as publicadas, sem as recalcular.

| Linha | Valor | Unidade | Página ou caminho |
|---|---:|---|---|
| `afirmacao-leitao-amaro-saude-oe2027-2026-10-09` | 3 | % | Título e corpo da notícia |
| `afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09` | 1 700 | milhões de euros | Intervenção na Assembleia da República |
| `afirmacao-rtp-saude-queda-oe2027-2026-10-09` | 1,5 | % de queda | Título e corpo da notícia |
| `oe-2027-cenario-ihpc-2026` | 2,9 | % | Quadro 1, IHPC, 2026, p. 9 |
| `oe-2027-cenario-pib-real-crescimento-2027` | 2,1 | % | Quadro 1, PIB, 2027, p. 9; segundo excerto na conclusão, p. 20 |
| `oe-2027-ppp-rodoviario-encargos-brutos-2027` | 1 152 | milhões de euros | Quadro 4.25, setor rodoviário, encargos brutos, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | 889 | milhões de euros | Quadro 4.25, setor rodoviário, Rodoviário, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-ppp-rodoviario-receitas-2027` | 263 | milhões de euros | Quadro 4.25, setor rodoviário, receitas, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-ppp-total-encargos-liquidos-2027` | 1 438 | milhões de euros | Quadro 4.25, Total, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-2026` | 18 062,4 | milhões de euros | Quadro 5.37, programa Saúde (PL15), Despesa efetiva consolidada, 2026, Estimativa, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-2027` | 17 803,1 | milhões de euros | Quadro 5.37, programa Saúde (PL15), Despesa efetiva consolidada, 2027, Orçamento, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026` | 17 291,3 | milhões de euros | Quadro 5.37, programa Saúde (PL15), Despesa efetiva consolidada, 2026, Estimativa (Sem PRR), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027` | 17 803,1 | milhões de euros | Quadro 5.37, programa Saúde (PL15), Despesa efetiva consolidada, 2027, Orçamento (Sem PRR), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao` | 3,0 | % | Quadro 5.37, programa Saúde (PL15), Despesa efetiva consolidada, Variação (Sem PRR) (%), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-variacao` | −1,4 | % | Quadro 5.37, programa Saúde (PL15), Despesa efetiva consolidada, Variação (%), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-total-consolidada-2026` | 18 125,9 | milhões de euros | Quadro 5.37, programa Saúde (PL15), Despesa total consolidada, 2026, Estimativa, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-total-consolidada-2027` | 17 858,4 | milhões de euros | Quadro 5.37, programa Saúde (PL15), Despesa total consolidada, 2027, Orçamento, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-total-consolidada-variacao` | −1,5 | % | Quadro 5.37, programa Saúde (PL15), Despesa total consolidada, Variação (%), p. 303 do PDF (287 impressa) |

## Diferenças e ausências

As treze células do relatório do Orçamento confirmam os valores do memorando. O quadro da Saúde está na página 303 do ficheiro, 287 impressa; o das PPP na página 123, 107 impressa. A nota de caixa e preços constantes de 2027 ficou na nota da linha. O texto seguinte ao quadro identifica os encargos rodoviários como líquidos. A ligação do PDF foi extraída da página da iniciativa alojada, com a origem e o seu sha256 no recibo da ligação.

No CFP, 2,1% para o crescimento real do PIB de 2027 e 2,9% para o IHPC de 2026 estão no quadro 1, página 9 do PDF, não nas páginas 19 e 20 indicadas pelo memorando. A frase sobre o pendor descendente dos riscos está na página 20. Como o livro exige valor numérico, a frase ficou como segundo excerto da linha do PIB, com a página e a atribuição ao CFP na prova. Não foi criado um número para a frase nem uma quarta afirmação independente.

A RTP imprime a magnitude «1,5» e a palavra «Cai», sem sinal negativo. A linha da afirmação conserva `1,5` com a unidade `% de queda`, em vez de introduzir `−1,5`. O quadro do Orçamento conserva a sua variação publicada de `−1,5%`. A notícia não explicita a designação «despesa total consolidada»; essa identificação não foi acrescentada às palavras da RTP.

A transcrição de Leitão Amaro conserva «sobre 3%» e a frase anterior que identifica o PRR. A página do PCP atribui a intervenção a Paulo Raimundo e não lhe dá cargo; a linha credita Paulo Raimundo e o PCP, sem importar um cargo de outra notícia. O índice do DAR consultado não apresenta a sessão de 9 de outubro. A fonte da linha permanece a transcrição partidária e o DAR dessa sessão fica por alojar.

## Documentos alojados

Todos os documentos abaixo têm resposta HTTP 200 e recibo com pedido, endereço final, data, tamanho e sha256. Foram obtidos com `core.http.HttpClient.condicional`, agente `OEstadoDoPais/corredor`. Os termos e robots foram consultados antes dos documentos e estão guardados em `source/v2a/direitos`; o registo é `publisher/v2a-fontes.json`. Não se presumiu uma licença aberta para RTP, PCP ou CFP.

| Documento no motor | Bytes | SHA256 |
|---|---:|---|
| `cfp-pagina.html` | 28071 | `65591ee5aa7a87982e5d9818c6821207e4825252adbac2f6a3c34864bf2cd3bb` |
| `cfp-parecer.pdf` | 387556 | `b4ec1e5dbac4157d5ef0d111fefa135e693ee4158cf851e9623ec0314636c2cb` |
| `dar-indice.html` | 369179 | `db60716c96db133747b37ae33f52e86eccf13ba15628a39730c02eb4039b8fae` |
| `iniciativa.html` | 456564 | `244dd0fea23f77e3ef15c971f3df78b9b265f841dcb537b365de9b589068bf4e` |
| `oe-relatorio.pdf` | 25512364 | `a338bd0084cc5fe2a2fcb392f56617f19abe87f0a57bad8b61d78db2274ebc12` |
| `pcp-afirmacao.html` | 149216 | `e426f05d0446a03b252e2e8dd7bb668790fb752e5c9341fef16da35ba426ef88` |
| `rtp-amaro.html` | 88034 | `095b231ac02894caae1dd10a085b4ce8bc72a33f6e6be5e622e6b86fc1a7679f` |
| `rtp-queda.html` | 74651 | `18f342451b5b4b93e15cbcef11b6e45d3f8175844c18093c24004b97165178ca` |

Os pedidos e as datas individuais constam de `medidas.json` e dos recibos no motor, em `content/15 Orcamento do Estado 2027/source/v2a/`. A oitava peça é o índice do DAR, prova da consulta sem a sessão pretendida.

## Plantas

As cinco plantas das afirmações alteram cópias em memória e exigem a mensagem correspondente; as duas dos quadros trocam a coluna e a linha. O controlo intacto passa.

| Planta | Mensagem no sítio | Mensagem no motor |
|---|---|---|
| Excerto alterado | `V2A excerto: palavras diferentes do corpo alojado` | `V2A excerto: difere do documento alojado` |
| Atribuição trocada | `V2A atribuição: difere da autoria no documento` | `V2A atribuição: difere do documento alojado` |
| Data errada | `V2A data: difere da data do documento` | `V2A data: difere do documento alojado` |
| Porta trocada | `V2A porta: difere do pedido registado` | `V2A porta: difere do documento alojado` |
| Valor fora do excerto | `V2A valor: não aparece no excerto selado` | `V2A valor: difere do documento alojado` |
| Coluna trocada | Conferida no motor | `V2A coluna: coluna diferente da medida` |
| Linha trocada | Conferida no motor | `V2A linha: linha diferente da medida` |

## Questões V2A

- V2A-1, aberta: a ligação aos termos da RTP devolveu 404. A licença de redistribuição integral não foi estabelecida. Guardou-se a cópia de conferência no motor e nas provas privadas, sem servir o artigo integral no sítio.
- V2A-2, aberta: o DAR da sessão de 9 de outubro não consta do índice alojado. Falta alojá-lo e confrontar as palavras quando estiver acessível.
- V2A-3, resolvida pela fonte: as células do CFP ficam na página 9; a frase dos riscos fica na página 20.
- V2A-4, resolvida pela fonte: a afirmação da RTP usa a magnitude positiva e a unidade de queda, preservando a literalidade.
- V2A-5, resolvida pela alternativa expressa no brief: a frase não numérica do CFP é o segundo excerto do PIB, não uma linha com valor inventado.
- V2A-6, limite do mapa: não havia secção própria JD1 nem secção própria RP4-n no mapa consultado. Foram lidas as referências disponíveis e os ficheiros dos circuitos nomeados pelo brief.
- V2A-7, falha do instrumento: durante o hook do motor, o escrivão suspendeu o batimento porque espera pelo commit no mesmo ciclo. Os clientes deram ausência de batimento, mas os pedidos permaneceram na fila e os dois resultados posteriores confirmaram código 0. Não se repetiram esses pedidos nem se contornou o escrivão.
- V2A-8, corrigida: o primeiro build recusou a nova fonte por faltar a declaração de Portugal no circuito do lugar. A declaração foi acrescentada antes da corrida final.
- V2A-9, corrigida: o segundo build encontrou as linhas sem declaração de assunto. Foi declarada a base de fontes V2-a em `SEM_AREA`, seguindo o âmbito do brief e o precedente do OE1/JD1.
- V2A-10, aberta por sandbox: as capturas não se produziram. O Chromium foi recusado por `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.41425: Permission denied (1100)` e a alternativa de controlo visual devolveu `Browser is not available: iab`, com a lista de navegadores vazia. Não se pediu escalada. O pedido, guião e erro completo estão no pacote.
- V2A-11, corrigida: o inventário conservava as contagens anteriores do índice e não tinha entrada de revisão do V2-a. As contagens foram lidas do HTML; o registo novo declara a leitura cruzada como por ler.
- V2A-12, corrigida: faltavam as declarações de língua dos títulos, rótulos e fontes. Os nomes portugueses foram declarados como tal; o ano e a data da edição ficaram sem língua natural.
- V2A-13, corrigida por medição: a L1 passa de 2 744 páginas anteriores, já medidas na RP4-n-j, para 2 780 com os 36 recibos V2-a. Cada recibo novo repete apenas a porta do Método, duas vezes. O registo guarda os destinos e quatro plantas adicionais. A prova histórica não guardava os destinos por página; esse limite está declarado em `l1-v2a.json`.

## Portões e capturas

Os códigos seguintes foram lidos dos ficheiros, depois de os processos terminarem. A cabeça do código do sítio coincide no início e no fim da corrida, com árvore limpa. O motor conserva a sua cabeça na corrida final própria.

| Conferência | Código | Ficheiro |
|---|---:|---|
| Motor inicial | 0 | `portoes/inicial.codigo` |
| Livro inicial | 0 | `portoes/ledger-inicial.codigo` |
| Motor na cabeça do código | 0 | `portoes/primeira-corrida/motor.codigo` |
| Build final | 0 | `portoes/final/build.codigo` |
| Verify final | 1 | `portoes/final/verify.codigo` |
| Typecheck final | 0 | `portoes/final/typecheck.codigo` |
| Livro final | 0 | `portoes/ledger-final.codigo` |
| Cruzamento com a origem | 0 | `portoes/cruzamento-final.codigo` |
| Capturas | 1 | `portoes/capturas.codigo` |

O verify final tem 8 comandos recusados no arranque do Chromium: `npm run check:moldura`, `npm run check:alvos`, `npm run check:indice`, `npm run check:cabeca`, `npm run check:primeira`, `npm run check:leituras`, `npm run check:frases-compostas`, `npm run check:incorporar`. Todos os erros de arranque estão discriminados em `portoes/final/falhas.json`. O log completo permanece ao lado. Nenhum destes controlos foi dispensado ou enfraquecido.

A tentativa de captura produziu zero imagens, com código 1. `capturas/capturas.json` guarda a falha na cabeça tentada; `capturas-pedido-tentado.json` identifica esse pedido. `capturas-pedido.json` aponta a cabeça final do código para repetir as três páginas, nas duas edições e a 390 e 1 280 px. O navegador da sessão também estava indisponível. Não houve inspeção visual dos recibos nem se apresentam as capturas como concluídas. Os recortes dos PDF de origem foram renderizados e inspecionados durante a leitura das células.

As corridas anteriores, com os códigos vermelhos e as causas corrigidas, ficam em `portoes/primeira-corrida`, `segunda-corrida`, `terceira-corrida` e `quarta-corrida`. A primeira também contém o core.gate final do motor. A nova corrida é `portoes/final`.

O cruzamento mantém o aviso anterior do resumo global do livro do OE2026; os resumos de todas as linhas coincidem. O livro mantém os avisos anteriores da história de endereços. A leitura cruzada do inventário pelo Opus continua por fazer, como previsto no brief.

## Commits do código

- sitio: `fc12a4e21155f93695d553b4fd033ffd976553a9`: V2-a: receber fontes seladas e conferir afirmações literais.
- sitio: `fd62fb48b38a6bb64f07be44306bac3c57ea3c42`: V2-a: completar o tipo das afirmações e o guião das capturas.
- sitio: `a0e2d67aa82f2bb6b900fb3e5257f44742502792`: V2-a: declarar Portugal como lugar das fontes do OE2027.
- sitio: `7e13add1c2f5da1d87e7d3f1004ee449814dd9a4`: V2-a: declarar o âmbito das fontes na cobertura por área.
- sitio: `e47fed728434cfbe8e1b0d2358cd6c69ba5839af`: V2-a: declarar a língua das fontes e atualizar o inventário das frases.
- sitio: `6618ddb5570a6642e7a3cc04829ab8aac0d7021a`: V2-a: medir as portas dos recibos e atualizar o registo da L1.
- motor: `dfeca64d1d53d7af1c776c159c4e4c2044257cd2`: V2-a: selar fontes do OE2027 e afirmações públicas.

## Regeneração e custo

No motor: `python3 -m publisher.v2a --write`, `python3 -m publisher.v2a_recortes` e `python3 -m publisher.export_site_rows --manifest publisher/manifest.v2a.json --site <worktree> --write`. No sítio: `node scripts/compor-familias-v2a.mjs`. O compositor próprio acrescenta as declarações sem editar os ficheiros de outras corridas; se se regenerar o mapa das famílias pelo compositor antigo, corre-se novamente o compositor V2-a. A K17 recusa a ausência destas declarações.

A linha «tokens used» não foi exposta nesta passagem. Não se apurou aqui o custo em pontos nem uma contagem de símbolos; cabe ao lançador. Não se declara cumprimento do custo-alvo sem essa medição.
