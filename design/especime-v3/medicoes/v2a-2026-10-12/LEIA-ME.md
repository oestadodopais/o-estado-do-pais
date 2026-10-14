# V2-a: fontes da vigilância seladas no motor

As células e as palavras foram lidas nos documentos alojados. O memorando serviu de expectativa, não de origem dos valores. A página do painel pertence ao V2-b e não foi criada. A retoma pelo escrivão concluiu os quatro portões com código 0 e produziu as capturas dos três recibos nas duas edições. A primeira corrida com navegador revelou as falhas I1 e I2, corrigidas em V2A-15 antes da corrida final.

## Cabeças e âmbito da V2-a inicial

Cabeça do código do sítio: `847dff47db35910a8c47da10b833cf87662f9d61`. Cabeça do código do motor: `dfeca64d1d53d7af1c776c159c4e4c2044257cd2`. Os commits posteriores de entrega contêm apenas provas e este relatório; as cabeças finais ficam na resposta da passagem.

O guião do brief e `medir.py` contam 3211 linhas na partida e 3229 no fim, com 18 novas. A comparação dos objetos Git encontrou 0 linhas anteriores alteradas. As referências ao OE2027 passaram de 0 a 18. Os conhecidos-positivos do guião passaram.

`medidas.json` contém as linhas e os documentos medidos; `final.json` é a execução final do guião original do brief. O circuito reutiliza `HttpClient`, os leitores de células do OE1/JD1, os recortes e o exportador comum. As três afirmações levam `afirmacao: true`. Na V2-a-b, os corpos integrais foram retirados da árvore do sítio. As provas públicas guardam apenas excertos e referências seladas aos corpos no motor.

## Linhas criadas

Os valores seguintes vêm dos YAML exportados, conferidos contra as células e os excertos pelo motor. As variações são as publicadas, sem as recalcular.

| Linha | Valor | Unidade | Página ou caminho |
|---|---:|---|---|
| `afirmacao-leitao-amaro-saude-oe2027-2026-10-09` | 3 | % | Título e corpo da notícia |
| `afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09` | 1 700 | milhões de euros | Intervenção na Assembleia da República |
| `afirmacao-rtp-saude-queda-oe2027-2026-10-09` | 1,5 | % de queda | Título e corpo da notícia |
| `oe-2027-cenario-ihpc-2026` | 2,9 | % | Quadro 1, IHPC, 2026, p. 9; comentário, p. 19; conclusão, p. 20 |
| `oe-2027-cenario-pib-real-crescimento-2027` | 2,1 | % | Quadro 1, PIB, 2027, p. 9; comentário, p. 19; conclusão, p. 20 |
| `oe-2027-ppp-rodoviario-encargos-brutos-2027` | 1 152 | milhões de euros | Quadro 4.25, setor rodoviário, encargos brutos, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | 889 | milhões de euros | Quadro 4.25, setor rodoviário, Rodoviário, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-ppp-rodoviario-receitas-2027` | 263 | milhões de euros | Quadro 4.25, setor rodoviário, receitas, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-ppp-total-encargos-liquidos-2027` | 1 438 | milhões de euros | Quadro 4.25, Total, 2027, p. 123 do PDF (107 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-2026` | 18 062,4 | milhões de euros | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa efetiva consolidada, 2026, Estimativa, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-2027` | 17 803,1 | milhões de euros | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa efetiva consolidada, 2027, Orçamento, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026` | 17 291,3 | milhões de euros | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa efetiva consolidada, 2026, Estimativa (Sem PRR), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027` | 17 803,1 | milhões de euros | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa efetiva consolidada, 2027, Orçamento (Sem PRR), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao` | 3,0 | % | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa efetiva consolidada, Variação (Sem PRR) (%), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-efetiva-consolidada-variacao` | −1,4 | % | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa efetiva consolidada, Variação (%), p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-total-consolidada-2026` | 18 125,9 | milhões de euros | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa total consolidada, 2026, Estimativa, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-total-consolidada-2027` | 17 858,4 | milhões de euros | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa total consolidada, 2027, Orçamento, p. 303 do PDF (287 impressa) |
| `oe-2027-saude-despesa-total-consolidada-variacao` | −1,5 | % | Quadro 5.37, Saúde (PL15), Conta do Pograma Legado, Despesa total consolidada, Variação (%), p. 303 do PDF (287 impressa) |

## Diferenças e ausências

As treze células do relatório do Orçamento confirmam os valores do memorando. O quadro da Saúde está na página 303 do ficheiro, 287 impressa; o das PPP na página 123, 107 impressa. A nota de caixa e preços constantes de 2027 ficou na nota da linha. O texto seguinte ao quadro identifica os encargos rodoviários como líquidos. A ligação do PDF foi extraída da página da iniciativa alojada, com a origem e o seu sha256 no recibo da ligação.

No CFP, 2,1% para o crescimento real do PIB de 2027 e 2,9% para o IHPC de 2026 estão no quadro 1, página 9 do PDF, e voltam a aparecer na prosa da página 19. O memorando apontava para as páginas 19 e 20; só o quadro fica na página 9. A frase sobre o pendor descendente dos riscos está na página 20. Como o livro exige valor numérico, a conclusão ficou como excerto de apoio. Na V2-a-b, as duas linhas do cenário levam a conclusão inteira, a fonte MF da tabela e o comentário da página 19, com as páginas e a atribuição na prova. Não foi criado um número para a frase nem uma quarta afirmação independente.

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

As três plantas adicionais do índice também foram recusadas: «V2A: coluna da Saúde trocada», «V2A: linha das PPP trocada» e «V2A: página do CFP trocada». `plantas-indice.json` guarda, para cada uma, o localizador alterado, a queixa exata de I1 e as queixas de I3 nas duas edições.

## Questões V2A

- V2A-1, aberta: a ligação aos termos da RTP devolveu 404. A licença de redistribuição integral não foi estabelecida. A cópia integral de conferência fica só no motor depois da correção V2-a-b; no sítio ficam excertos e referências. A retirada da árvore não apaga os objetos dos commits anteriores.
- V2A-2, aberta: o DAR da sessão de 9 de outubro não consta do índice alojado. Falta alojá-lo e confrontar as palavras quando estiver acessível.
- V2A-3, resolvida pela fonte: as células do CFP ficam na página 9; a frase dos riscos fica na página 20.
- V2A-4, resolvida pela fonte: a afirmação da RTP usa a magnitude positiva e a unidade de queda, preservando a literalidade.
- V2A-5, resolvida pela alternativa expressa no brief: a frase não numérica do CFP é o segundo excerto do PIB, não uma linha com valor inventado.
- V2A-6, limite do mapa: não havia secção própria JD1 nem secção própria RP4-n no mapa consultado. Foram lidas as referências disponíveis e os ficheiros dos circuitos nomeados pelo brief.
- V2A-7, falha do instrumento: durante o hook do motor, o escrivão suspendeu o batimento porque espera pelo commit no mesmo ciclo. Os clientes deram ausência de batimento, mas os pedidos permaneceram na fila e os dois resultados posteriores confirmaram código 0. Não se repetiram esses pedidos nem se contornou o escrivão.
- V2A-8, corrigida: o primeiro build recusou a nova fonte por faltar a declaração de Portugal no circuito do lugar. A declaração foi acrescentada antes da corrida final.
- V2A-9, corrigida: o segundo build encontrou as linhas sem declaração de assunto. Foi declarada a base de fontes V2-a em `SEM_AREA`, seguindo o âmbito do brief e o precedente do OE1/JD1.
- V2A-10, resolvida na retoma: a recusa do Chromium na sandbox permanece documentada em `capturas/capturas.json`, mas as capturas finais correram pelo escrivão, como decidido em V2A-14. O recibo final está em `design/especime-v3/capturas/v2a-2026-10-12/capturas.json`.
- V2A-11, corrigida: o inventário conservava as contagens anteriores do índice e não tinha entrada de revisão do V2-a. As contagens foram lidas do HTML; o registo novo declara a leitura cruzada como por ler.
- V2A-12, corrigida: faltavam as declarações de língua dos títulos, rótulos e fontes. Os nomes portugueses foram declarados como tal; o ano e a data da edição ficaram sem língua natural.
- V2A-13, corrigida por medição: a L1 passa de 2 744 páginas anteriores, já medidas na RP4-n-j, para 2 780 com os 36 recibos V2-a. Cada recibo novo repete apenas a porta do Método, duas vezes. O registo guarda os destinos e quatro plantas adicionais. A prova histórica não guardava os destinos por página; esse limite está declarado em `l1-v2a.json`.

- V2A-14, decisão de execução: os portões passam pelo `portoes-pelo-escrivao.sh`, fora da sandbox, porque o Chromium das conferências não arranca dentro dela. As capturas seguem pelo `capturar-pelo-escrivao.sh`, usando o guião comum e a cabeça do `dist/`. Estes percursos foram fornecidos pelo lugar de direção na retoma; não se pediu escalada nem se dispensou qualquer controlo.
- V2A-15, corrigida e conferida: a primeira corrida pelo escrivão revelou que I1 desconhecia os localizadores V2-a e I2 encontrava a edição datada das três afirmações em ISO. A régua independente passa a conferir os localizadores contra a identidade, o rótulo, o período, a coluna e a página; três plantas trocam coluna, linha e página. A edição datada passa pelo formato da casa e pelo controlo da origem em `check:formas`. As linhas e os documentos selados permanecem intactos.

## Portões e capturas da V2-a inicial

Os códigos seguintes foram lidos dos ficheiros depois de os processos terminarem. A árvore estava limpa no início da corrida. As cabeças do sítio e do motor coincidem no início e no fim; o estado final do sítio lista apenas as provas criadas pela própria corrida. O `verify.json` confirma que os ficheiros da construção e da árvore conferidos não mudaram durante o verify.

| Conferência | Código | Ficheiro |
|---|---:|---|
| Motor inicial | 0 | `portoes/inicial.codigo` |
| Livro inicial | 0 | `portoes/ledger-inicial.codigo` |
| Build final | 0 | `portoes/build.codigo` |
| Verify final | 0 | `portoes/verify.codigo` |
| Typecheck final | 0 | `portoes/typecheck.codigo` |
| Motor final | 0 | `portoes/motor.codigo` |
| Livro na cabeça do código | 0 | `portoes/ledger-retoma.codigo` |
| Cruzamento com a origem | 0 | `portoes/cruzamento-retoma.codigo` |
| Capturas pelo escrivão | 0 | `portoes/capturas-retoma.codigo` |

Os portões finais correram por `sh scripts/leituras/portoes-pelo-escrivao.sh design/especime-v3/medicoes/v2a-2026-10-12/portoes motor`, depois de aguardar a tranca ocupada por outra worktree. Nenhum controlo foi dispensado ou enfraquecido. A primeira corrida pelo escrivão está em `portoes/escrivao-primeira`, com build 0, verify 1, typecheck 0 e motor 0. O único comando recusado foi `check:indice`, pelas causas de V2A-15.

As capturas finais foram produzidas por `capturar-pelo-escrivao.sh`, com `capturas-pedido.json` e o guião comum `scripts/leituras/captar.mjs`. Estão em `design/especime-v3/capturas/v2a-2026-10-12/`: 30 páginas inteiras e 60 recortes da cabeça e da ficha da fonte. Cobrem Saúde total de 2027, encargos líquidos rodoviários e afirmação do PCP, em português e inglês, a 390, 768, 1 024, 1 280 e 1 600 px. O recibo guarda a cabeça do código, os SHA256 das imagens e dos recursos, sem erros do navegador, recursos em falta ou pedidos externos. Todas as larguras medidas coincidem com a janela, sem transbordo horizontal. A inspeção visual das 12 páginas a 390 e 1 280 px consta de `capturas-inspecao.json`.

A tentativa anterior dentro da sandbox produziu zero imagens e permanece em `capturas/capturas.json`, com o pedido em `capturas-pedido-tentado.json`. As corridas anteriores, com as causas corrigidas e as recusas do Chromium, ficam em `portoes/primeira-corrida`, `segunda-corrida`, `terceira-corrida`, `quarta-corrida` e `final`. A corrida aceite fica diretamente em `portoes/`.

O cruzamento mantém o aviso anterior do resumo global do livro do OE2026; os resumos de todas as linhas coincidem. O livro mantém os avisos anteriores da história de endereços. A leitura cruzada do inventário pelo Opus continua por fazer, como previsto no brief.

## Commits do código

- sitio: `41ffc59663e62e40a5ebce1cf9346c7449edcc23`: V2-a: receber fontes seladas e conferir afirmações literais.
- sitio: `8066b1b34dd444425c05cb0d7ef0b9b5b8bfd643`: V2-a: completar o tipo das afirmações e o guião das capturas.
- sitio: `ee6ce409451f3bef744520e1f339d8b7c780352b`: V2-a: declarar Portugal como lugar das fontes do OE2027.
- sitio: `51960bcb8899dd61a05da53a65c75b3544ae76b1`: V2-a: declarar o âmbito das fontes na cobertura por área.
- sitio: `e74abc0af81cac3b0cdb679e66e1195f8e77222e`: V2-a: declarar a língua das fontes e atualizar o inventário das frases.
- sitio: `d075f6b7a5f121d52946ab1c8029c25c79898cf3`: V2-a: medir as portas dos recibos e atualizar o registo da L1.
- sitio: `b01db695f03069d9844c53e443a4971253e4fd34`: O escrivão corre os três portões do sítio fora da sandbox a pedido do construtor (portoes-pelo-escrivao.sh): o navegador das conferências não arranca dentro dela, como a segunda paragem da higiene mostrou; o prompt comum diz o caminho novo; o pontos.py conta uma sessão retomada pelos turnos dentro do intervalo.
- sitio: `47df89d6b261d9c2175ae51884bcbdb3c9cf3d8c`: O escrivão captura as páginas fora da sandbox a pedido do construtor (capturar-pelo-escrivao.sh, só o captar.mjs do repositório, sobre o dist da worktree): o navegador não arranca dentro dela, como a V2-a e a higiene mostraram.
- sitio: `847dff47db35910a8c47da10b833cf87662f9d61`: V2-a: conferir localizadores e apresentar a edição datada.
- motor: `dfeca64d1d53d7af1c776c159c4e4c2044257cd2`: V2-a: selar fontes do OE2027 e afirmações públicas.

A primeira entrega das provas ficou no commit `367f76135c64fe384a63f76d9106890af290ed1a`. O commit `847dff47db35910a8c47da10b833cf87662f9d61` também guarda as provas da primeira corrida pelo escrivão. A cabeça posterior desta entrega contém apenas o relatório, as medições e as capturas.

## Regeneração e custo

No motor: `python3 -m publisher.v2a --write`, `python3 -m publisher.v2a_export`, `python3 -m publisher.v2a_recortes` e `python3 -m publisher.export_site_rows --manifest publisher/manifest.v2a.json --site <worktree> --write`. No sítio: `node scripts/compor-familias-v2a.mjs`. O compositor próprio acrescenta as declarações sem editar os ficheiros de outras corridas; se se regenerar o mapa das famílias pelo compositor antigo, corre-se novamente o compositor V2-a. A K17 recusa a ausência destas declarações.

O lançador mediu 10 pontos na primeira passagem e 6 na retoma, com custo antigo de 551 961 e 246 648 símbolos, respetivamente. A soma é 16 pontos e 798 609 símbolos de custo antigo, acima do alvo de 300 000. Havia outra sessão em cada intervalo, pelo que a diferença de pontos da conta não é uma medida isolada deste bloco. As leituras estão em `custo-v2a.json`. A medição da V2-a-b fornecida pela direção é de 232 turnos, 518 020 de custo antigo e 8 pontos da semana, com a higiene em paralelo; a linha «tokens used» não foi exposta.


## A passagem V2-a-b

Os achados 1 a 5 eram plantas da direção em cópias do pacote e não foram tocados. A comparação com a cabeça de entrada confirma os mesmos valores e unidades nas 18 linhas. A passagem começou pelo achado 7.

| Achado | Correção e prova |
|---|---|
| 6 | Os nomes, as frases e os recortes incorporáveis identificam a previsão do Ministério das Finanças transcrita pelo CFP. O publicador continua a ser o CFP. O excerto inclui a fonte MF da página 9, o comentário da página 19 e a conclusão completa da página 20, com «endossa as previsões». Código: `familias.mjs:31` e `motor/publisher/v2a.py:207` e `tests/cartao/cartao.mjs:389`. |
| 7 | Retiradas as três páginas integrais comprimidas. `ledger/provas/v2a/` só contém `provas.json`: excertos, data, URL, SHA256 e caminho relativo no motor. A travessia não transporta PDFs integrais. O controlo público confere os excertos contra as provas seladas; com `RESEARCHHUB_DIR`, confere também os corpos privados. Código: `scripts/afirmacoes.mjs:34` e `motor/publisher/v2a_export.py:7`. |
| 8 | O motor escreve as palavras citadas em `name`; o cabeçalho usa esse campo. A proveniência das afirmações passa a dizer «Título do documento» e «Document title». Código: `motor/publisher/v2a.py:76` e `src/views/LinhaView.astro:504`. |
| 9 | Frases próprias para Amaro, PCP e RTP; comparação entre orçamento e estimativa nas variações; anos, PRR e notas de previsão visíveis em `ressalva` e `ressalva_en`; nas PPP, caixa, IVA e preços constantes. A identificação da notícia RTP como despesa total consolidada não foi confirmada no corpo alojado e não foi inventada; ver V2A-17. Código: `familias.mjs:16`, `familias.mjs:42` e `motor/publisher/v2a.py:185`. |
| 10 | Corrigida a indicação anterior: as percentagens estão também na prosa da página 19; o quadro está na página 9 e a conclusão na 20. Código: `LEIA-ME.md:42`. |
| 11 | A edição de 2026 vem do número e da data da capa, conferidos entre si. Código: `motor/publisher/v2a.py:140`. |
| 12 | A transformação de caixa só altera a primeira letra e preserva PRR e RRP. Código: `familias.mjs:2`. |
| 13 | As plantas mudam `column` e `row_index` em `table_specs` e reexecutam a extração. A assinatura «RTP / VER MAIS» substitui o rodapé; a planta retira a assinatura mantendo o rodapé. Código: `motor/publisher/v2a.py:115`, `motor/publisher/v2a.py:66` e `motor/publisher/v2a_test.py:55`. |
| 14 | A regra geral aceita uma edição com dia ISO completo e válido; não converte um mês nem um dia impossível. Não há exceção para o dia das afirmações. Código: `src/lib/datas.mjs:82` e `scripts/check-formas.mjs:359`. |
| 15 | Localizadores traduzidos na origem e transportados pelo exportador comum, tanto em `name_source_en` como em `document.locator_en`. Código: `motor/publisher/v2a.py:80`, `motor/publisher/v2a.py:180` e `motor/publisher/export_site_rows.py:706`. |
| 16 | O localizador identifica «Saúde (PL15)» e «Conta do Pograma Legado», incluindo a gralha confirmada visualmente no PDF. O nome legível refere a conta do Programa Legado Saúde. A medição do custo anterior consta de `custo-v2a.json` e da secção anterior. Código: `motor/publisher/v2a.py:159` e `custo-v2a.json:1`. |

Questões novas:

- V2A-16, corrigida na árvore atual: nenhum corpo integral fica na prova pública. Antes da V2-a-c, a direção reescreveu o ramo ainda não publicado para retirar também os corpos da história. As cabeças citadas neste relatório são as da história atual.
- V2A-17, ausência confirmada: o texto alojado da RTP não contém «despesa total consolidada». A página explica a queda noticiada e declara que a notícia não especifica total ou efetiva. O quadro do relatório mantém a linha própria; não se atribuiu a expressão à RTP.
- V2A-18, grafia conferida: o cabeçalho da página 303 imprime «Pograma Legado». A proveniência conserva a grafia; a prosa da casa usa «Programa Legado».
- V2A-19, decisão de execução: os portões e as capturas desta correção correm pelo escrivão, porque o navegador das conferências não arranca na sandbox. O hook do motor suspendeu novamente o batimento; aguardou-se o resultado do pedido existente antes de continuar, sem o duplicar.
- V2A-20, custo: os dois registos encerrados do lançador medem os pontos e o custo antigo da V2-a. O custo V2-a-b foi depois fornecido pela direção: 232 turnos, 518 020 de custo antigo e 8 pontos da semana, com a higiene em paralelo.

- V2A-21, corrigida: a primeira corrida V2-a-b encontrou o inventário de frases ainda com as formulações anteriores. As frases substituídas passaram a retiradas e as novas ganharam entradas conferidas no HTML. A planta das siglas apanhou também uma concatenação sem espaço no guião de inspeção; a correção fez a planta morder.
- V2A-22, falha de execução: a chamada dirigida a `check:leituras` tentou abrir o navegador na sandbox. O teste foi recusado com `bootstrap_check_in org.chromium.Chromium.MachPortRendezvousServer.80839: Permission denied (1100)`. Não houve escalada; a suite pertence ao verify pelo escrivão. A falha de língua contra o HTML antigo desapareceu depois da reconstrução.

A primeira corrida desta correção ficou em `portoes-b-primeira`: build 1, verify 125 (não correu porque o build falhou), typecheck 0 e motor 0, lidos dos quatro ficheiros. A causa foi o inventário de frases desatualizado, corrigido antes da nova corrida. A corrida final é a aceite e fica em `portoes-b/`.

- V2A-23, corrigida: a K8 contava «XXV Governo Constitucional» dentro da conclusão literal do CFP como prosa da casa. A régua mantém uma ocorrência da casa por edição e só retira dessa contagem um `excerpt` cuja marca identifica uma linha existente e cujo texto coincide integralmente com o livro. Cinco plantas mantêm a recusa da citação sem marca, da linha inexistente, do texto alterado e da expressão da casa nas duas línguas. A conclusão do CFP permanece inteira.

- V2A-24, decisão de entrega: o escrivão recusou o pedido único com «mais de quatrocentos ficheiros num pedido; divide-o». As provas foram divididas em dois pedidos, de 270 e 304 ficheiros. O primeiro commit de capturas é `97e6f3c64716aebfcedca57d7d0bdf7addedf9bd`; o segundo fecha o relatório e os restantes comprovativos. Nenhum dos dois altera o código verificado.

A segunda corrida ficou em `portoes-b-segunda`: build 0, verify 1, typecheck 0 e motor 0, lidos dos ficheiros. A única falha do verify foi a K8, corrigida em V2A-23 e conferida pela suite completa dos cartões com código 0.

Cabeça do código do sítio: `9aab322bcc56167511fb6c20b9033814aa27dc4a`. Cabeça do código e final do motor: `b95dc75f8cfaca58aa02c5f02564b0ae4d24259f`. Os commits desta correção são `39b814b1` (medidas, provas e direitos), `468a9de0` (inventário e conferências), `9aab322b` (K8 e citações literais) e `b95dc75f` no motor. O commit final do sítio acrescenta apenas provas e o relatório; a cabeça final fica na resposta. Nas referências da tabela, `familias.mjs` pertence a esta pasta de medições e `motor/` designa a raiz do motor.

| Portão final | Código lido | Ficheiro |
|---|---:|---|
| build | 0 | `portoes-b/build.codigo` |
| verify | 0 | `portoes-b/verify.codigo` |
| typecheck | 0 | `portoes-b/typecheck.codigo` |
| motor | 0 | `portoes-b/motor.codigo` |

O HTML conferido contém 36 páginas das 18 linhas, com os valores e unidades preservados. A conferência está em `inspecao-b.json`. As capturas em `design/especime-v3/capturas/v2a-2026-10-12/b/` contêm 180 páginas inteiras e 360 recortes, nas larguras 390, 768, 1024, 1280, 1600 px. Os SHA256 de todas as imagens foram relidos; não houve pedidos externos, erros do navegador, recursos recusados nem transbordo horizontal. A inspeção visual fica em `capturas-inspecao-b.json`.

Plantas novas e respetivas mensagens, também guardadas em `plantas-b.json`:

- `manchete como medida: V2A nome: difere do documento alojado` (`b-conferencias/motor-test.log`).
- `índice da coluna na extração: V2A coluna: índice diferente da medida` (`b-conferencias/motor-test.log`).
- `índice da linha na extração: V2A linha: índice diferente da medida` (`b-conferencias/motor-test.log`).
- `assinatura retirada com rodapé RTP intacto: V2A atribuição: autoria ausente do corpo alojado` (`b-conferencias/motor-test.log`).
- `ano do parecer trocado na capa: V2A edição: capa sem número e data concordantes` (`b-conferencias/motor-test.log`).
- `PDF integral na exportação: V2A direitos: só excertos e referências podem atravessar` (`b-conferencias/motor-test.log`).
- `corpo integral pagina.html.gz: V2A direitos: a prova pública só admite excertos e referências em provas.json` (`b-conferencias/afirmacoes-motor.log`).
- `corpo integral parecer.pdf: V2A direitos: a prova pública só admite excertos e referências em provas.json` (`b-conferencias/afirmacoes-motor.log`).
- `caminho fora do motor: V2A referência: falta o selo, a data ou o caminho relativo no motor` (`b-conferencias/afirmacoes-motor.log`).
- `edição 2026-02-29: V2A data: edição não convertida em data` (`b-conferencias/formas.log`).
- `edição 2026-04-31: V2A data: edição não convertida em data` (`b-conferencias/formas.log`).
- `edição 2025-12: V2A data: edição não convertida em data` (`b-conferencias/formas.log`).
- `V2A edição: ano do orçamento no lugar do ano do parecer` (`b-conferencias/indice.log`).
- `V2A nome: manchete no lugar das palavras ditas` (`b-conferencias/indice.log`).
- `V2AB previsão: falta a autoria MF e a transcrição CFP` (`b-conferencias/html.log`).
- `V2AB nota: ressalva não publicada` (`b-conferencias/html.log`).
- `V2AB nome: a cabeça não diz as palavras citadas` (`b-conferencias/html.log`).
- `V2AB localizador: tradução ou origem ausente` (`b-conferencias/html.log`).
- `V2AB sigla: PRR ou RRP perdeu maiúsculas` (`b-conferencias/html.log`).
- `vista anterior alterada: V2A vista: mudou mais do que o título do documento das afirmações.` (`b-conferencias/l1.log`).
- `K8 citação sem marca de origem: K8 · «Governo Constitucional» rende-se em 2 página(s) portuguesa(s) e devia render-se em 1 (o índice das áreas)` (`b-conferencias/cartao-k8.log`).
- `K8 citação com linha inexistente: K8 · «Governo Constitucional» rende-se em 2 página(s) portuguesa(s) e devia render-se em 1 (o índice das áreas)` (`b-conferencias/cartao-k8.log`).
- `K8 citação com palavras alteradas: K8 · «Governo Constitucional» rende-se em 2 página(s) portuguesa(s) e devia render-se em 1 (o índice das áreas)` (`b-conferencias/cartao-k8.log`).
- `K8 expressão da casa em português: K8 · «Governo Constitucional» rende-se em 2 página(s) portuguesa(s) e devia render-se em 1 (o índice das áreas)` (`b-conferencias/cartao-k8.log`).
- `K8 expressão da casa em inglês: K8 · «Constitutional Government» rende-se em 2 página(s) inglesa(s) e devia render-se em 1 (o índice das áreas)` (`b-conferencias/cartao-k8.log`).

Os controlos positivos aceitam outro dia de publicação e o dia bissexto válido; as plantas recusam os dias impossíveis e a edição mensal. A contagem L1 foi refeita e os destinos e multiplicidades coincidem integralmente com a fotografia anterior (`b-conferencias/l1-recontado.json`). A leitura cruzada do inventário corrigido fica por fazer pela direção.

Custo: a V2-a anterior soma 16 pontos da conta e 798 609 símbolos de custo antigo, nas duas leituras do lançador. A direção forneceu a medição encerrada da V2-a-b: 232 turnos, 518 020 de custo antigo e 8 pontos da semana, com a higiene em paralelo. A linha «tokens used» não foi exposta.


## A passagem V2-a-c

A entrada do sítio foi `96b6aaa9bc133d475929b3e03fb081f2748f5d2c`, com árvore limpa. A entrada do motor foi `b95dc75f8cfaca58aa02c5f02564b0ae4d24259f`, também limpa. A cabeça final V2-a-b na história atual é `5e694b9f4db99f127717f2fda3929db1a2a4e748`; a cabeça do seu código é `9aab322bcc56167511fb6c20b9033814aa27dc4a`. Os recibos históricos mantêm os carimbos originais; este relatório usa as cabeças reescritas. Os achados 1 a 5 eram plantas nas cópias e não foram transportados para o ramo. A direção tratou a história (6) e a inclusão dos corpos no pacote da leitura (parte do 7).

| Achado | Resultado |
|---|---|
| 7 e 16 | A âncora de Amaro é o parágrafo que nomeia o ministro; na notícia da queda, a assinatura vem de `itemprop="author"`, sem rótulo de navegação. As plantas trocam a âncora por texto ausente. A grafia «Conta do Pograma Legado» foi relida e vista no quadro; a capa do parecer foi relida e vista. |
| 8 | As seis páginas dos níveis da Saúde têm declarações próprias por ano: estimativa de 2026 ou orçamento de 2027, medida, exclusão do PRR quando aplicável e nome do quadro. A frase distingue a despesa total da efetiva pela nota da página 145 do relatório. Os anos escrevem-se por extenso no cabeçalho e na frase, mantendo a regra das famílias sem algarismos fixos. Os localizadores conservam os anos e as colunas como impressos. |
| 9 | A RTP passa a ser identificada pela notícia de 09.10.2026 sobre a queda do orçamento da Saúde para 2027. Saíram «alojada» e «hosted». A notícia não especifica total ou efetiva; essa ausência continua explícita. |
| 10 | Os nomes e as frases distinguem IHPC de 2026 e crescimento real do PIB de 2027 e dizem «Proposta de Orçamento do Estado para 2027». |
| 11 | A frase do total das PPP diz o total previsto dos encargos líquidos, o ano, a ótica de caixa e os preços constantes. |
| 12 | O SHA256 integral do corpo atravessa pelo exportador comum em `document.source_sha256` e aparece no bloco de proveniência. O sítio já mostrava resumos em recibos com `document.hosted`; os recibos JD1 consultados guardavam os selos das fontes de definição nos dados, sem os mostrar. Reutilizou-se a ficha de proveniência existente, com quebra do resumo nas colunas estreitas. |
| 13 | As cinco conferências V2AB foram transportadas para `tests/linha/v2a.mjs`, chamado por `check:cartao`. Cada uma mantém a sua planta. Acrescentaram-se conferências e plantas para os achados desta passagem. |
| 14 | Registados os custos fornecidos pela direção e a cabeça final V2-a-b na história atual. O custo final V2-a-c depende da leitura do lançador posterior ao encerramento; não é inventado nem estimado. A cabeça final desta passagem fica na resposta, pois o commit não pode conter o próprio hash. |
| 15 | Ambos os leitores do PCP reconhecem os doze nomes dos meses em português. Onze trocas de mês recusam outubro como resultado e um dia impossível é recusado em cada lado. |

A página 303 do PDF, 287 impressa, escreve «Quadro 5.37. Saúde (PL15) — Conta do Pograma Legado». A transcrição preserva a gralha. A página 145, 129 impressa, diz «A despesa total efetiva exclui ativos e passivos financeiros» e «A despesa total inclui ativos e passivos financeiros» nas notas do quadro dos projetos. A frase da Saúde usa essa distinção; o quadro 5.37 mostra as rubricas financeiras entre os dois totais.

A capa do CFP foi lida com `pdftotext -f 1 -l 1 -layout "content/15 Orcamento do Estado 2027/source/v2a/cfp-parecer.pdf" -`, no motor. As linhas da capa são «7 de outubro de 2026», «Parecer n.º» e «05/2026». O comando de extração do quadro é `pdftotext -f 303 -l 303 -layout "content/15 Orcamento do Estado 2027/source/v2a/oe-relatorio.pdf" -`. Os mesmos dois documentos foram renderizados com `pdftoppm` para inspeção visual. As linhas extraídas, as âncoras e os resumos ficam em `fontes-conferidas-c.json`.

Questões novas:

- V2A-25, história: os hashes do relatório foram reconciliados por assunto dos commits com a história reescrita; os recibos históricos não foram adulterados para lhes mudar os carimbos.
- V2A-26, definição: a distinção entre total e efetiva vem da nota da página 145 e das rubricas do quadro da Saúde, não de uma definição presumida. A grafia do nome conserva a fonte.
- V2A-27, âncora: a assinatura estruturada da notícia substitui «RTP / VER MAIS». O parágrafo com o nome do ministro continua a ser a âncora das palavras de Amaro.
- V2A-28, selo: o resumo do corpo fica na ficha de proveniência e no JSON. Não há nova cópia integral no sítio.
- V2A-29, conferência: as cinco verificações V2AB passam a correr nos portões, com as respetivas plantas, e os registos distinguem a conferência pública da leitura dos corpos no motor.
- V2A-30, custo e execução: os portões e as capturas correm pelo escrivão, porque o navegador não arranca na sandbox. A V2-a-b custou 232 turnos, 518 020 de custo antigo e 8 pontos da semana com a higiene em paralelo, segundo a direção. O custo final V2-a-c ainda não está disponível antes do encerramento do lançador.

- V2A-31, primeira conferência: o build recusou o novo campo por faltar a leitura de `document.source_sha256` no portão HTML e por o rótulo em maiúsculas não corresponder ao termo `sha256` já autorizado. Corrigiu-se o leitor e reutilizou-se o rótulo existente, sem alargar a lista de exceções. A conferência de voz isolada encontrou no inventário as contagens de 3 208 reativadas, apesar de o índice construído ter 3 226; os estados das quatro frases foram reconciliados com o HTML. O verify ficou por correr nessa tentativa, sem capturas.

- V2A-32, árvore da conferência: o escrivão recusou um pedido com código 9 antes de criar os registos dos portões, porque as provas da tentativa anterior ainda eram ficheiros sem commit. As provas foram comitadas antes da repetição; não se tomou a recusa do pedido por um resultado do build.

- V2A-33, localizador da definição: o segundo build passou, mas o verify recusou o índice porque a sua régua ainda exigia que o localizador da Saúde acabasse na página do quadro. A régua passou a exigir também a referência exata à nota da página 145, que as linhas ganharam nesta passagem. Duas plantas retiram a nota e trocam a sua página; a régua continua a recusar localizadores diferentes. Não se mudou nenhum nome nem valor para satisfazer o teste.

- V2A-34, leitura visual: a primeira série de capturas da V2-a-c revelou «na orçamento» nas três frases dos níveis de 2027. A composição passou a distinguir «na estimativa» e «no orçamento», e uma planta troca a preposição na frase publicada. Os quatro portões dessa construção tinham passado; a correção exige nova construção e novas capturas. Conserva-se a amostra que revelou a falha em `c-conferencias/captura-concordancia.png`; a entrega usa as capturas posteriores.

### Referências da correção e provas finais

| Achado | Ficheiro e linha |
|---|---|
| 7 e 16 | `scripts/afirmacoes.mjs:29`; `<motor>/publisher/v2a.py:52` e `:187`; `fontes-conferidas-c.json` guarda a capa e os selos. |
| 8 | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:16`; `src/lib/o-que-e-o-numero.mjs:93`; `<motor>/publisher/v2a.py:234`. |
| 9 | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:59` |
| 10 | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:43` |
| 11 | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:38` |
| 12 | `src/views/LinhaView.astro:503`; `src/lib/ledger.mjs:1927`; `<motor>/publisher/export_site_rows.py:720`. |
| 13 | `package.json:52`; `tests/linha/v2a.mjs:11` |
| 14 | `design/especime-v3/medicoes/v2a-2026-10-12/LEIA-ME.md:254`; `custo-b.json`; cabeças e códigos abaixo. |
| 15 | `scripts/afirmacoes.mjs:16`; `<motor>/publisher/v2a.py:67`; plantas nos dois leitores. |

Cabeça do código conferido do sítio: `d0f5241ae869e592acc26e50960785c302c4d32f`. Cabeça do código e final do motor: `559eac976f84f6b2b9cedb624565b115ed457933`. Os commits de código do sítio são `237b4a88`, `45434201`, `6b8baa7e` e `d0f5241a`; o do motor é `559eac97`. O commit `a9ff9b47` guardou as primeiras provas; o commit `6b8baa7e` completou a régua do índice e guardou a segunda tentativa. O commit `d0f5241a` corrigiu a concordância encontrada nas capturas. A resposta final regista a cabeça posterior dos comprovativos.

Os quatro códigos foram lidos dos ficheiros de `portoes-c/`: `build.codigo = 0`, `verify.codigo = 0`, `typecheck.codigo = 0`, `motor.codigo = 0`. A primeira tentativa, preservada em `portoes-c-primeira/`, foi build 1, verify 125, typecheck 0 e motor 0. A segunda tentativa, em `portoes-c-segunda/`, foi build 0, verify 1, typecheck 0 e motor 0; a recusa do índice motivou a V2A-33. A terceira tentativa, em `portoes-c-terceira/`, teve os quatro códigos a zero, mas a leitura das capturas encontrou a concordância corrigida na V2A-34. A conferência de voz isolada também conserva a recusa e a repetição verde em `c-conferencias/`.

`inspecao-c.json` confere 36 páginas e compara os 18 valores e unidades com a entrada desta passagem, sem diferença. `medidas-c.json` reconfirma 3211 linhas anteriores intactas e os resumos de 8 documentos no motor. Os oito documentos mantêm os selos da passagem V2-a-b; a história atual não contém commits com `ledger/provas/v2a/*.html.gz`, conforme a conferência com `git rev-list`. Os valores e as diferenças contra o memorando continuam na tabela inicial deste relatório. `l1-v2a-c.json` mede 2780 páginas, das quais 36 são os recibos do V2-a; o teto existente não foi alterado.

`plantas-c.json` transcreve as 63 mensagens das plantas do motor, do leitor das afirmações, do HTML e do índice desta passagem, com registo e linha. Inclui as cinco plantas V2AB agora integradas em `check:cartao`, as trocas de ano, a definição retirada, a grafia alterada, os selos corrompidos, as âncoras ausentes, os meses, a página da nota trocada e a concordância da preposição nas frases orçamentais. As quatro plantas de destinos e a planta da vista ficam em `l1-v2a-c.json` e `c-conferencias/l1.log`. As contagens das conferências não são confundidas com as contagens das plantas.

As capturas em `../../capturas/v2a-2026-10-12/c/` pertencem à mesma cabeça do código: 180 combinações de página, língua e largura, com 540 imagens conferidas pelos resumos e dimensões. Foram vistas 45 imagens, incluindo os 36 cabeçalhos móveis. Não se observaram falhas na amostra final. O recibo `capturas.json` e `capturas-inspecao-c.json` registam as dimensões, os resumos, a ausência de pedidos externos e de erros e a amostra visual efetivamente vista. A leitura cruzada das novas frases permanece marcada como «por ler» para a direção; as conferências automáticas e esta inspeção não a substituem.

Custo: a direção mediu a V2-a-b em 232 turnos, 518 020 de custo antigo e 8 pontos da semana, com a higiene em paralelo. O custo final V2-a-c ainda não foi fornecido: só o lançador o mede depois do encerramento desta passagem. Não foi exposta uma linha «tokens used».

O commit `44345599ff185beab6a1966fbf22462e9536bc3d` guarda as primeiras 270 imagens. As restantes imagens, os recibos e este relatório seguem no commit final, cuja cabeça é indicada na resposta. A divisão respeita o limite de 400 ficheiros por pedido do escrivão.

## A passagem V2-a-d

O mandato foi lido integralmente com a leitura V2-a-c. Os achados de um a cinco pertencem às cópias plantadas e não foram reproduzidos no ramo. As correções preservam os dezoito valores e unidades; a medição confere os oito documentos pelos seus sha256 e as três mil duzentas e onze linhas anteriores pelos objetos Git.

| Achado | O que ganhou | Ficheiro e linha |
|---|---|---|
| 6 e 16 | Cabeçalhos do mandato, anos por tokens e grafia do programa entre aspas na frase. | `src/lib/v2a-palavras.mjs:6` |
| 7 | A RTP passa a identificar a despesa total consolidada da Saúde; os montantes vêm das duas linhas e a subtração é explicada por palavras. | `src/lib/v2a-palavras.mjs:15` |
| 8 | As quatro páginas das PPP têm ano no cabeçalho; a conta rodoviária usa três tokens. Os excertos incluem os anos. | `src/lib/v2a-palavras.mjs:19` |
| 9 | Doze datas esperadas fixas; a troca dos meses é recusada sem motor e com ele, com a mensagem real da célula. | `scripts/afirmacoes.mjs:85` |
| 10 | A conferência exige o cabeçalho completo da Saúde; plantas trocam efetiva por total e Saúde por Educação. | `tests/linha/v2a.mjs:37` |
| 11 | A definição sai do excerto da Saúde e é citada como apoio: nota ao quadro 4.38, p. 145 do PDF. | `src/data/origens-v2a.json:4` |
| 12 | O ano da previsão é conferido antes do título da Proposta; plantas para PIB e título do documento. | `tests/linha/v2a.mjs:47` |
| 13 | A capa do CFP lê os meses portugueses e valida o dia; uma data impossível é recusada. | `<motor>/publisher/v2a.py:175` |
| 14 | Custo anterior registado; o custo desta passagem será acrescentado pela direção a partir do lançador. | `design/observatorio/mandatos/MANDATO-V2A-d-2026-10-14.md:26` |
| 15 | Os portões finais conferiram o código de `b9497c1c`, sem escritas durante a corrida; os commits seguintes guardaram capturas, medições e o relatório, sem alterar o código. Os dois estados finais ficaram vazios. | `scripts/leituras/portoes-pelo-escrivao.sh:10` |

### Decisões e questões

- **V2A-35:** os cabeçalhos da Saúde seguem o mandato. O nome fixo continua completo nos índices; a continuação do cabeçalho usa `{ periodo: id }`, resolvido para o campo `reference_date`. A K17 não foi alterada.
- **V2A-36:** os montantes da notícia da RTP identificam a despesa total consolidada. A queda é a estimativa menos o orçamento, com os dois valores por tokens; a conta medida dá 267,5 milhões de euros.
- **V2A-37:** a conta rodoviária mostra 1 152 menos 263 igual a 889 milhões, pelos tokens das três linhas. O cabeçalho dos anos acompanha as quatro linhas de excerto das PPP. As contas vivem num parágrafo complementar de «O que é este número», conferido pela célula V2AD; a frase de família continua conferida pela K17.
- **V2A-38:** as datas esperadas dos meses foram escritas individualmente. As mensagens das plantas vêm da célula, e a mutação da lista de meses é detetada mesmo sem os corpos do motor.
- **V2A-39:** a nota financeira pertence ao quadro 4.38. Foi retirada do excerto do quadro 5.37 e publicada como apoio separado, com documento, página, data de acesso e excerto literal.
- **V2A-40:** a conferência do cenário separa o ano da previsão do título da Proposta; a planta do PIB conserva o título certo e troca o ano da previsão. O título do documento ganha planta própria.
- **V2A-41:** a capa do CFP aceita os nomes dos meses portugueses e recusa um dia impossível. O número e o ano do parecer continuam concordantes com a data.
- **V2A-42:** a direção forneceu para V2-a-c 250 turnos, 511 796 de custo antigo, 5 pontos da semana sem outra sessão em paralelo e contexto médio de 132 275. O custo V2-a-d não está disponível nesta sessão; o lançador mede-o e a direção acrescenta-o. A linha «tokens used» não foi exposta.
- **V2A-43:** os portões usam o escrivão porque o navegador das conferências não arranca na sandbox. A corrida de preparação teve códigos build 0, verify 1 e typecheck 0: a planta do localizador ainda usava o texto antigo e a conta estava dentro do âmbito da K17. Ambas foram corrigidas. As provas foram comitadas antes dos portões finais e nada foi escrito durante a corrida.

### Conferências e entrega

A preparação está em `portoes-d-preparacao/`; as mensagens dirigidas em `d-conferencias/`. Os destinos e as multiplicidades da L1 coincidem com a fotografia V2-a-c: 2 780 páginas. A vista foi comparada integralmente com a entrada da passagem, admitindo apenas a importação, a continuação dos cabeçalhos e o bloco das contas; a planta recusa uma alteração alheia.

A primeira corrida completa, em `portoes-d-primeira/`, passou com códigos 0/0/0/0 na cabeça `3fb70eb74a28cc56fa58136e033953e53d82adee`, com o motor `80268af4f3ff23f6b144257bc2922a21b789daff`. O `estado.fim` contém apenas a pasta criada pelo próprio guião.

**V2A-44:** para satisfazer o ficheiro vazio pedido no achado 15, a pasta da corrida seguinte é preparada com um `.gitignore` comitado que exclui só os registos gerados dentro dela. A exclusão foi retirada depois da corrida, para comitar os registos. A primeira prova é conservada integralmente; não se editam os seus estados nem se alteram réguas. Nada foi escrito durante os portões.

Estado da entrega: correções conferidas, portões verdes, estados finais vazios e capturas finais inspecionadas. O fecho medido consta abaixo.

**V2A-45:** a inspeção visual da segunda corrida, verde com os dois estados finais vazios, encontrou nas três variações a falta da nota explícita sobre a grafia. As seis frases das duas edições passam a atribuí-la ao quadro, com planta própria. A captura do defeito fica em `d-conferencias/variacao-sem-nota.png`; os portões dessa cabeça estão em `portoes-d-segunda/`. O código corrigido foi conferido e capturado novamente; a planta da nota retirada mordeu.

### Fecho medido

Código conferido do sítio: `b9497c1cd687cc890f852ca4c81b05c4b45273c6`. Cabeça final e código do motor: `80268af4f3ff23f6b144257bc2922a21b789daff`. Os commits posteriores do sítio guardam apenas capturas, medições e este relatório; a cabeça de entrega é indicada na resposta final.

Commits de implementação e provas: `d49b1aad`, `9c35c959`, `3fb70eb7`, `505d654e`, `b9497c1c`; primeira parte das capturas: `f3161ea9`. Motor: `80268af4`.

| Ficheiro lido | Código |
|---|---|
| `portoes-d/build.codigo` | 0 |
| `portoes-d/verify.codigo` | 0 |
| `portoes-d/typecheck.codigo` | 0 |
| `portoes-d/motor.codigo` | 0 |

`portoes-d/estado.fim` e `portoes-d/motor.estado.fim`: zero bytes. As cabeças de início e fim coincidem. A última corrida foi posterior ao commit de provas e não houve escritas durante os portões.

Os nove cabeçalhos, lidos do HTML construído nas duas edições:

| Linha | Português | Inglês |
|---|---|---|
| `despesa-efetiva-consolidada-2026` | Saúde, despesa efetiva consolidada, estimativa de 2026 | Health, consolidated effective expenditure, 2026 estimate |
| `despesa-efetiva-consolidada-2027` | Saúde, despesa efetiva consolidada, orçamento para 2027 | Health, consolidated effective expenditure, budget for 2027 |
| `despesa-efetiva-consolidada-sem-prr-2026` | Saúde, despesa efetiva consolidada sem PRR, estimativa de 2026 | Health, consolidated effective expenditure excluding the RRP, 2026 estimate |
| `despesa-efetiva-consolidada-sem-prr-2027` | Saúde, despesa efetiva consolidada sem PRR, orçamento para 2027 | Health, consolidated effective expenditure excluding the RRP, budget for 2027 |
| `despesa-efetiva-consolidada-sem-prr-variacao` | Saúde, despesa efetiva consolidada sem PRR, variação publicada entre a estimativa de 2026 e o orçamento para 2027 | Health, consolidated effective expenditure excluding the RRP, published change between the estimate for 2026 and the budget for 2027 |
| `despesa-efetiva-consolidada-variacao` | Saúde, despesa efetiva consolidada, variação publicada entre a estimativa de 2026 e o orçamento para 2027 | Health, consolidated effective expenditure, published change between the estimate for 2026 and the budget for 2027 |
| `despesa-total-consolidada-2026` | Saúde, despesa total consolidada, estimativa de 2026 | Health, consolidated total expenditure, 2026 estimate |
| `despesa-total-consolidada-2027` | Saúde, despesa total consolidada, orçamento para 2027 | Health, consolidated total expenditure, budget for 2027 |
| `despesa-total-consolidada-variacao` | Saúde, despesa total consolidada, variação publicada entre a estimativa de 2026 e o orçamento para 2027 | Health, consolidated total expenditure, published change between the estimate for 2026 and the budget for 2027 |

Capturas: 150 casos de página e largura, 450 imagens e 40 imagens inspecionadas visualmente. As dimensões, os pedidos e todos os sha256 passaram. O recibo é `design/especime-v3/capturas/v2a-2026-10-12/d/capturas.json`; o método e as imagens vistas estão em `capturas-inspecao-d.json`.

`medidas-d.json` confirma os oito corpos selados e as linhas anteriores sem alterações. `inspecao-d.json` confirma os dezoito valores e unidades contra a cabeça de entrada. `origem-d.json` compara literalmente a definição publicada com a página física do PDF selado. `l1-v2a-d.json` confirma as mesmas multiplicidades da passagem anterior e a vista alterada apenas nos pontos declarados.

`plantas-d.json` conserva 79 mensagens efetivamente emitidas, com o ficheiro e a linha do registo. Inclui as plantas mantidas das passagens anteriores. As novas ou reforçadas desta passagem dizem:

- `V2AD Saúde: cabeçalho com medida, programa ou período diferente`
- `V2AD período: ano sem token da linha`
- `V2AD grafia: falta a nota sobre o nome do programa`
- `V2AD RTP: a notícia perdeu a medida identificada pelos montantes`
- `V2AD conta: faltam os valores pelas linhas da medida`
- `V2AD PPP: a conta não diz brutos menos receitas`
- `V2AD PPP: falta o ano ou o cabeçalho do excerto`
- `V2AD apoio: definição confundida com o excerto da Saúde`
- `V2AC cenário: falta o ano da previsão ou a Proposta de Orçamento`
- `V2AB título: a proveniência não distingue o documento`
- `V2A data: difere da data do documento`
- `V2A edição: dia impossível na capa`
- `V2AD L1: destinos ou multiplicidades diferentes da passagem anterior`
- `V2AD vista: alteração fora dos períodos e das contas declaradas`

A mutação da lista de meses também produz a comparação independente entre `2026-11-09` e `2026-10-09`, sem motor e com ele; a mensagem completa está no catálogo. A correção do localizador conserva as duas plantas de retirada da nota e troca da página. A nota explícita da grafia é conferida em `tests/linha/v2a.mjs:39`, com planta em `tests/linha/v2a.mjs:75`.

Custo V2-a-c: 250 turnos, 511 796 de custo antigo, 5 pontos da semana sem outra sessão em paralelo, contexto médio de 132 275, conforme o mandato. A linha «tokens used» não foi exposta.

## A passagem V2-a-e

Entrada do sítio: `c4b22a56`; entrada do motor: `80268af4`. As duas árvores estavam limpas. Não foram fundidos os ramos principais. Os achados 1 a 5 eram plantas no pacote, ausentes das worktrees.

### Decisões e questões

- **V2A-46:** o apoio aos encargos e receitas rodoviários é o texto da p. 124 do PDF (108 impressa), separado da nota do quadro 4.25. O texto enumera os fluxos financeiros; a subtração é conferida nas três linhas do quadro. Não se atribui à nota uma frase que ela não contém. O localizador das três linhas cita o apoio e a origem visível mostra o excerto selado.
- **V2A-47:** o mandato nomeia três páginas sem PRR e duas variações da despesa efetiva. A variação sem PRR pertence aos dois grupos: são quatro páginas distintas. Estas quatro recebem o nome por extenso, o apoio e as duas comparações; a afirmação de Leitão Amaro recebe também a explicação e a segunda fonte declarada com recibo. São as cinco páginas PRR conferidas nesta passagem.
- **V2A-48:** o quadro 5.37 não imprime a parcela do PRR separadamente. As frases mostram as duas comparações pelos quatro valores das linhas e identificam a diferença entre colunas como parcela do PRR, sem a cifrar. Os apoios são o parágrafo da Saúde na p. 302 (286 impressa) e a descrição do fim do ciclo extraordinário de financiamento na p. 31 (15 impressa).
- **V2A-49:** os complementos das frases são declarados na auditoria da K17. Só admitem palavras sem algarismos, valores do livro, períodos do campo `reference_date` e excertos de linhas de afirmação. A K17 recompõe o texto e confere os tokens no HTML; as plantas retiram cada tipo de marca nas duas edições.
- **V2A-50:** a conta rodoviária pertence apenas às três linhas rodoviárias. O total nomeia os cinco setores do quadro, com os nomes originais e apoio selado, sem lhe atribuir a conta de um só setor.
- **V2A-51:** a afirmação do PCP entra pelo token do excerto, atribuída a Paulo Raimundo; ao lado ficam os encargos brutos e líquidos rodoviários por tokens. A transcrição conserva o português também na edição inglesa, com a língua marcada. Não se tira uma conclusão sobre a afirmação.
- **V2A-52:** o código da passagem D conferido pelos portões finais é `b9497c1c`; os commits posteriores só guardaram capturas, medições e relatório. Foi corrigida a descrição da ordem na tabela da passagem D. O caminho do guião é `scripts/leituras/portoes-pelo-escrivao.sh`.
- **V2A-53:** os portões desta passagem correm pelo escrivão porque o navegador não arranca na sandbox. A pasta própria tem a exclusão temporária dos registos preparada antes do commit de provas. Não há escritas durante a corrida; os registos e as capturas serão comitados depois, sem tocar no código conferido.

### Custo

A direção forneceu para V2-a-d: 216 turnos, 358 882 de custo antigo, 5 pontos da semana sem outra sessão em paralelo e contexto médio de 157 686. O custo de V2-a-e foi comunicado depois desta entrega e está registado na secção da passagem F. A linha «tokens used» não foi exposta.

### Conferências

Os valores e as unidades das dezoito linhas coincidem com a entrada; as 3 211 linhas anteriores conservam os objetos Git. A prova está em `inspecao-e.json`. As conferências dirigidas estão em `e-conferencias/`. Os códigos finais, as cabeças e as capturas serão registados depois da corrida.

**V2A-54:** a preparação em `portoes-e-preparacao/` terminou em `a10230b4` com build 1, verify 125 (não executado), typecheck 0 e motor 0. O inventário ainda tinha 26 frases antigas; saíram e entraram as 30 cadeias atuais. A conferência dirigida da voz passou. Corrigiu-se também a planta que trocava primeiro um atributo, em vez do texto visível. As 64 plantas de HTML passaram nas duas edições. A K16 passou a conferir os apoios documentais contra o pacote selado e o cruzamento, com plantas de selo, SHA, hora, página, excerto e porta. Nenhuma regra antiga foi dispensada.

**V2A-55:** a tentativa isolada de `npm run check:indice` invocou o navegador por uma opção do comando e foi recusada na sandbox: `browserType.launch: Target page, context or browser has been closed`; o registo inclui `Error: kill EPERM`. A tentativa não foi repetida na sandbox; a conferência completa pertence aos portões pelo escrivão. O excerto do erro está em `e-conferencias/indice-sandbox.txt`.

### O que cada achado ganhou

| Achado | Resultado | Ficheiro e linha |
|---|---|---|
| 6 | Nome do PRR por extenso, fim do ciclo de financiamento com apoio selado e duas comparações pelos quatro valores. Sem valor calculado para a parcela. | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:9`; `<motor>/publisher/v2a.py:256` |
| 7 | Medida conferida na frase da Saúde; período das PPP exigido como token; montantes e subtração da RTP conferidos contra as linhas; plantas nas duas edições. | `tests/linha/v2a.mjs:45`, `:68`, `:83`, `:102` |
| 8 | A ordem da entrega D foi corrigida: código nos portões, provas da entrega nos commits seguintes. O guião é citado pelo caminho do repositório. | `design/especime-v3/medicoes/v2a-2026-10-12/LEIA-ME.md:307` |
| 9 | Uma ocorrência do nome do programa por frase, com atribuição da grafia ao quadro; períodos por tokens; ressalvas das variações sem repetir a comparação. | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:24`; `<motor>/publisher/v2a.py:223` |
| 10 | O total enumera os cinco setores do quadro e deixa de mostrar a conta rodoviária. | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:38`; `src/lib/v2a-palavras.mjs:19` |
| 11 | Localizador das três linhas rodoviárias cita p. 124 do PDF, 108 impressa, com o excerto textual separado e selado. | `<motor>/publisher/v2a.py:245`; questão V2A-46 |
| 12 | Afirmação literal do PCP por token do excerto, com atribuição e valores brutos e líquidos do quadro ao lado, sem conclusão da casa. | `design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:72`; `tests/linha/v2a.mjs:88` |

**V2A-56:** a conferência da coluna de 2027 do quadro 4.25 encontrou uma diferença entre as linhas setoriais e o total impresso. Decisão corrigida pelo mandato F: a página identifica a linha «Total», sem dizer que soma os setores; a ressalva declara a diferença e a ausência de explicação no quadro. O valor publicado mantém-se. A conta de conferência fica em `ppp-total-e.json`, sem passar para a frase da casa.

**V2A-57:** a L1 continua a contar 2 780 páginas com destino repetido. A comparação das multiplicidades só muda nas duas edições da afirmação de Leitão Amaro: o relatório do OE passa a figurar como destino repetido duas vezes, nos dois apoios citados. Todas as outras páginas conservam os destinos e multiplicidades anteriores. Prova: `l1-comparacao-e.json`.

### Fecho medido da passagem E

Cabeça do código do sítio, dos portões e das capturas: `9ec288fc09a23e65baf94faa6e9e2cda9d14a681`. Cabeça final e do código do motor: `d8410f793fe2f456a8897101670c09796a05fabb`. Os commits seguintes do sítio guardam capturas, medições e relatório; a cabeça final da entrega é indicada na resposta. Nenhuma página, célula dos portões ou linha do livro foi alterada depois da corrida final. No guião que extrai as frases para o relatório foi corrigida a junção da rota com `index.html`, e a extração foi executada com sucesso.

Commits de código e provas do sítio: `a10230b4`, `9ec288fc`. Primeira parte das capturas: `74dead0e`. Motor: `d8410f79`. Os portões correram por `scripts/leituras/portoes-pelo-escrivao.sh`, depois do commit `9ec288fc`, sem escritas do construtor durante a corrida.

| Ficheiro lido | Código |
|---|---|
| `portoes-e/build.codigo` | 0 |
| `portoes-e/verify.codigo` | 0 |
| `portoes-e/typecheck.codigo` | 0 |
| `portoes-e/motor.codigo` | 0 |

Os ficheiros `portoes-e/estado.fim` e `portoes-e/motor.estado.fim` têm zero bytes. As cabeças de início e fim coincidem. A primeira corrida fica preservada em `portoes-e-preparacao/`, com os códigos 1/125/0/0.

As 18 linhas mantêm os valores e unidades da entrada. Os 3 211 objetos Git das linhas anteriores permanecem iguais; o total é de 3 229 ficheiros de linhas. Os oito documentos mantêm os SHA256, conferidos por `medir.py`; os valores, selos e caminhos relativos estão em `medidas-e.json`. Os quatro novos apoios são excertos do mesmo relatório selado, não novos documentos alojados.

O catálogo `plantas-e.json` conserva 110 mensagens distintas com o registo e a linha de cada uma. As 64 plantas de HTML cobrem ambas as edições. A K17 recusa tokens retirados, complemento diferente da auditoria, algarismos fixos e tokens sem origem; a K16 recusa selo retirado e mudanças no SHA, hora, página, excerto e porta. As plantas do motor retiram os dois apoios do PRR, o apoio rodoviário e um setor do total. O catálogo inclui ainda as plantas preservadas.

Capturas: `design/especime-v3/capturas/v2a-2026-10-12/e/capturas.json`, 16 páginas, duas edições, cinco larguras, 160 casos e 480 PNG. Todos os resumos e dimensões foram conferidos; zero transbordos, pedidos externos e erros. Foram inspecionadas visualmente as 32 cabeças a 390 px e oito a 1 280 px, enumeradas em `capturas-inspecao-e.json`.

As cinco frases do PRR, nas duas edições, foram lidas do HTML e estão integralmente em `frases-prr-e.md`; a fotografia das frases das 18 linhas está em `inspecao-e.json`. O custo desta passagem está registado na secção F; não foi exposta uma linha «tokens used».


## A passagem V2-a-f

Entrada do sítio: `58ae1d64`; entrada do motor: `d8410f79`. As duas árvores estavam limpas. O achado 1 pertence ao guião do pacote, sob responsabilidade da direção. Os achados 2 a 6 eram plantas nas cópias, ausentes do ramo. Não foram fundidos os ramos principais.

### Decisões e questões

- **V2A-58, achado 7:** a variação da despesa total consolidada e a afirmação da RTP dizem que incluem a despesa do PRR. Citam a passagem da Saúde que compara a dotação com a estimativa expurgada desse efeito. O excerto selado abre à vista; a percentagem do relatório fica só dentro dele. A ressalva da variação volta a dizer «Incluindo PRR», uma vez.
- **V2A-59, achado 8:** a frase das parcerias identifica a linha «Total» tal como impressa. Lista os setores, sem declarar uma soma. A ressalva indica a divergência e que o quadro não a explica. A decisão V2A-56 foi corrigida, sem mudar qualquer valor.
- **V2A-60, achado 9:** a primeira ocorrência inglesa usa «Recovery and Resilience Plan (RRP; «PRR» in the table)». Sai a frase que dizia ser o nome completo sem antecedente. Os cabeçalhos mantêm-se.
- **V2A-61, achado 10:** o período segue imediatamente a frase da medida. A redução da parcela do PRR explica a descida da despesa com PRR apesar da subida da despesa sem PRR, sem atribuir esta subida à redução. A parcela não é cifrada e a frase não fala de colunas. Na página de Leitão Amaro, o relatório fica identificado pelo título e pelo ano da linha.
- **V2A-62, achado 11:** os quatro apoios novos são passagens, com «Passagem de» e «Passage from». A definição financeira conserva o rótulo próprio. O apoio dos setores é agora um excerto contínuo da página, com as linhas intermédias; a prova do motor recusa um corte não assinalado. O tipo e a abertura do excerto da Saúde estão declarados em `origens-v2a.json` e conferidos pela K16.
- **V2A-63, achado 12:** a página do PCP nomeia o relatório do Orçamento do Estado e o quadro quatro ponto vinte e cinco. O ano vem do token do período. A edição inglesa traduz a afirmação com atribuição a Paulo Raimundo, usando o valor da própria linha, e mantém a transcrição portuguesa pelo token do excerto. Nenhum valor novo foi criado.
- **V2A-64, achado 13:** a conferência das comparações do PRR inclui Leitão Amaro. As plantas invertem a direção da explicação nessa página e na variação sem PRR, em ambas as edições. A conferência independente do índice lê os dois localizadores de todas as linhas V2-a, com alteração plantada em cada campo.
- **V2A-65, achado 14:** saiu a linha que deixava o custo D por acrescentar. O custo D permanece uma vez na secção E. O custo E comunicado pela direção está abaixo.
- **V2A-66:** os portões finais correm pelo escrivão porque o navegador das conferências não arranca na sandbox. A exclusão temporária da pasta dos registos é preparada antes do commit de provas. Não houve escritas do construtor durante a corrida. O pedido aguardou a tranca comum, ocupada por outra worktree, e os portões correram depois de ela ser libertada. Na preparação, a primeira conferência estática do índice começou enquanto a construção ainda substituía o `dist/` e encontrou os índices ausentes; foi repetida apenas depois de a construção terminar e passou. Os dois registos ficam conservados.

### O que cada achado ganhou

| Achado | Ficheiro e linha | Resultado |
|---|---|---|
| 7 | `familias.mjs:16`; `tests/linha/v2a.mjs:58`; `<motor>/publisher/v2a.py:225` | Qualificador PRR nas duas páginas, ressalva e excerto aberto, com plantas. |
| 8 | `familias.mjs:45`; `<motor>/publisher/v2a.py:227`; `tests/linha/v2a.mjs:94` | Linha «Total» e diferença declarada; retirada da soma e planta da omissão. |
| 9 | `familias.mjs:10`, `:26`, `:77` | Nome inglês e relação entre as siglas nas duas línguas. |
| 10 | `familias.mjs:12`, `:32`, `:79` | Comparações reescritas, período antes da explicação e relatório nomeado. |
| 11 | `src/components/OrigemDaDefinicao.astro:97`; `tests/cartao/origens-v2a.mjs:11`; `<motor>/publisher/v2a.py:279` | Rótulo de passagem, declaração do tipo e excerto contínuo conferido. |
| 12 | `familias.mjs:83`; `tests/linha/v2a.mjs:96` | Relatório e quadro identificados; tradução atribuída e citação pelo token. |
| 13 | `tests/linha/v2a.mjs:50`, `:149`; `tests/livro/indice.mjs:340`, `:1911` | Amaro incluído; inversão plantada; ambos os localizadores conferidos. |
| 14 | Secções de custo das passagens D, E e F deste relatório | Custo D sem contradição e custo E comunicado pelo lançador. |

Os caminhos `familias.mjs` da tabela são relativos a esta pasta de medições; os restantes são relativos à raiz do sítio, salvo `<motor>`.

### Custo

V2-a-e, conforme o mandato: 137 turnos, 571 271 de custo antigo, 6 pontos da semana com outra sessão em paralelo (RH1), contexto médio de 160 334. O custo de V2-a-f está registado na secção G. A linha «tokens used» não foi exposta.

### Conferências e fecho

A preparação confirmou os dezoito valores e unidades inalterados e os objetos Git das 3 211 linhas anteriores. As provas do motor passaram, incluindo o corte não assinalado. As provas do HTML passaram nas duas edições. Os resultados finais, as cabeças e a inspeção das capturas estão registados abaixo.

O commit do motor `c239badfd9152633345133e5ab05dee560bd732e` passou o seu `core.gate`. A preparação do sítio passou a voz, os cartões, o índice estático, os tipos e as provas do HTML. Foram registadas 165 mensagens distintas de plantas em `plantas-f.json`, com ficheiro e linha; os portões finais confirmarão o conjunto na cabeça comitada.


### Fecho medido da passagem F

Cabeça do código do sítio, dos quatro portões e do `dist/` capturado: `a0440b562734d23344c2c6c431de826f287a6456`. Cabeça final e do código do motor: `c239badfd9152633345133e5ab05dee560bd732e`. As cabeças iniciais e finais dos portões coincidem; `estado.fim` e `motor.estado.fim` têm zero bytes. Os commits seguintes do sítio guardam apenas as provas da entrega. A cabeça final do sítio consta da resposta de entrega.

| Ficheiro lido | Código |
|---|---|
| `portoes-f/build.codigo` | 0 |
| `portoes-f/verify.codigo` | 0 |
| `portoes-f/typecheck.codigo` | 0 |
| `portoes-f/motor.codigo` | 0 |

As 86 plantas do HTML passaram nas 36 páginas. O catálogo `plantas-f.json` conserva 165 mensagens distintas do circuito V2-a, cada uma com o ficheiro e a linha onde foi emitida; usa a ocorrência final dos portões quando ela existe. As provas novas incluem:

- Retirar o qualificador do PRR na variação total e na RTP, nas duas edições: `V2AF total: falta o qualificador PRR ou o apoio`.
- Retirar a ressalva ou fechar o excerto: `V2AF total: ressalva sem PRR` e `V2AF total: excerto da Saúde fechado`.
- Inverter a explicação na variação sem PRR e em Leitão Amaro: `V2AE PRR: falta o nome, a explicação ou o apoio`. As mutações estão em `tests/linha/v2a.mjs:149`, nas duas edições; conservam-se também as plantas que retiram os apoios.
- Trocar o rótulo de passagem por definição: `V2AF apoio: passagem rotulada como definição`. Na declaração, retirar o tipo ou fechar a passagem da Saúde produz `V2AF origem: apoio sem tipo de passagem` ou `V2AF origem: passagem da Saúde fechada`.
- Voltar a atribuir a soma ao total ou omitir a ausência de explicação: `V2AF PPP: soma atribuída ao total ou diferença omitida`.
- Retirar o nome do relatório da página do PCP: `V2AF PCP: falta o relatório ou a afirmação em inglês`.
- Alterar `locator` e `locator_en` de cada uma das dezoito linhas: `V2AF localizador`, seguido do campo e do identificador, com 36 mensagens distintas.
- Cortar uma linha intermédia do excerto dos setores no motor: `V2AF apoio: excerto não contíguo`.

`inspecao-f.json` confirma os dezoito valores e unidades inalterados e as 3 211 linhas anteriores intactas. `medidas-f.json` confirma os oito documentos pelo SHA256. `frases-f.md` transcreve do HTML as frases «o que é» da variação total, da RTP e do total das parcerias nas duas edições, na cabeça conferida.

As capturas estão em `design/especime-v3/capturas/v2a-2026-10-12/f/`: dezasseis páginas, duas edições, cinco larguras, 160 casos e 480 PNG. Todos os SHA256 e dimensões foram conferidos; não houve transbordos, pedidos externos ou erros. Foram inspecionadas visualmente as 32 cabeças móveis e as 12 cabeças largas das páginas de Leitão Amaro, PCP, RTP, total das parcerias, variação sem PRR e variação total. `capturas-inspecao-f.json` lista os 44 ficheiros observados. Não foram observados cortes, sobreposição ou perda de palavras.

**V2A-67:** a L1 mantém as 2 780 páginas com destino repetido e não muda nenhuma multiplicidade contra a passagem E. A comparação integral está em `l1-comparacao-f.json`.

A passagem F fica entregue para a leitura a frio da direção. Não houve fusão de `main` ou `master`, nem publicação ou `git push`.

Commits desta passagem: código e provas do sítio em `a0440b56`; primeira parte das capturas em `0d311c37`; motor em `c239badf`. O commit final do sítio guarda as restantes capturas, os códigos e o relatório, sem mudar o código conferido.


## A passagem V2-a-g

Mandato: `design/observatorio/mandatos/MANDATO-V2A-g-2026-10-14.md`. Entrada do sítio `9a98f179`, motor `c239badf`, ambos limpos. Os achados 1 a 4 e 6 eram plantas no pacote; esta passagem trata o Major 5 e os Minor 7 a 11. As 18 linhas conservam os valores e unidades da entrada, conferidos por `conferir-g.mjs`; as 3 211 linhas anteriores conservam os objetos Git.

### Os achados e as decisões

| Achado | O que ganhou | Ficheiro e linha |
| --- | --- | --- |
| 5 | PCP: os encargos brutos são pagamentos do Estado, os líquidos descontam recebimentos; o período vem das duas linhas das parcerias; a afirmação é superior aos dois valores. Total: pagamentos previstos depois dos recebimentos, setores explicados, euros do ano. As três contas rodoviárias explicam pagamentos, receitas e saldo. | `familias.mjs:51`, `familias.mjs:88`; `src/lib/v2a-palavras.mjs:19`; `tests/linha/v2a.mjs:122` |
| 8 | O quadro aparece como 4.25, pelo campo `quadro` do apoio. A nota da definição financeira declara 4.38; as passagens corridas não recebem número de quadro. | `origens-g.py:10`; `<motor>/publisher/v2a.py:284`; `src/lib/o-que-e-o-numero.mjs:134` |
| 9 | Os documentos e publicadores dos apoios têm inglês; Amaro diz «RRP; PRR in Portuguese». Os excertos continuam na língua da fonte. | `src/data/figuras.mjs:2758`; `src/data/verbatim.mjs:55`; `familias.mjs:80` |
| 10 | PCP e Amaro citam o campo do documento do apoio, com marca de origem; o ano do relatório deixou de vir do período de uma linha. | `familias.mjs:82`, `familias.mjs:88`; `tests/linha/v2a.mjs:111` |
| 11 | A régua compara o número visível do quadro com o campo do apoio no PCP e no total; uma planta troca-o em cada página e edição. | `tests/linha/v2a.mjs:107`, `tests/linha/v2a.mjs:148` |
| 7 | As duas contagens F dizem 165, como `plantas-f.json`; saiu a declaração de custo E por medir; custo F registado abaixo. | Este relatório, secções E, F e G |

- **V2A-68:** pagamentos, recebimentos e saldo ficam explícitos nas cinco páginas das parcerias. As palavras simples antecedem o jargão no total e explicam os termos nas contas rodoviárias e no PCP. Não se atribui causa à diferença entre setores e total.
- **V2A-69:** os números dos quadros e os títulos dos documentos são campos dos apoios. O complemento só aceita `quadro`, `documento` e `documento_en` de uma origem declarada; a K17 confere a marca e o texto. Não se abriu uma dispensa para algarismos fixos.
- **V2A-70:** o documento inglês é tradução de identificação; o excerto conserva o português. Amaro diz que PRR é a sigla portuguesa, sem remeter para um quadro inexistente na página.
- **V2A-71:** a página do PCP ganhou a segunda fonte MF com recibo do relatório, na página física 124. O motor continua a guardar os corpos; o sítio recebe excertos e referências.
- **V2A-72:** a preparação detetou um tipo incompleto no registo das marcas e uma expectativa portuguesa na conferência inglesa da definição financeira; ambos foram corrigidos. A planta experimental de `check:lugar` não mordeu porque aquela régua lê os painéis, não estes recibos. A alteração e a planta saíram do código; o ensaio fica em `g-conferencias/`. A K17 e a régua V2AG conferem estes apoios com plantas próprias. O ensaio repôs o HTML; a prova regista os resumos antes e depois.
- **V2A-73:** os portões finais correm pelo escrivão porque o navegador das conferências não arranca na sandbox. A corrida começou depois do commit de provas e não houve escrita durante os quatro portões. Os códigos, cabeças de início e fim e estados foram lidos dos ficheiros no fecho.

### Plantas e preparação

O motor passou 40 conferências específicas. O HTML passou 36 páginas e 114 plantas, incluindo as novas recusas de palavras simples retiradas, comparação retirada, período de outra medida, número de quadro trocado, documento sem marca e tradução errada. A K17 recusa o token de apoio sem origem e a marca retirada; a K16 recusa campos diferentes da prova exportada. Os registos estão em `g-conferencias/`; a lista final, `plantas-g.json`, tem 194 mensagens distintas, cada uma conferida no ficheiro e linha indicados.

### Custo

V2-a-f, conforme o mandato e o lançador: 97 turnos, 291 192 de custo antigo, 4 pontos da semana com outra sessão em paralelo (RH1-c e RH1-d), contexto médio de 131 737. O custo V2-a-g consta da secção H, conforme o mandato seguinte. Não foi exposta uma linha «tokens used».

**V2A-74:** a primeira corrida completa, na cabeça `67093eba559db52595b7e1ac134d176eca3f4bba`, terminou com build 1, verify 125 (não correu por dependência), typecheck 0 e motor 0. Os estados finais estavam vazios e as cabeças não mudaram durante a corrida. Os registos ficam em `portoes-g-preparacao/`. A L10 ainda exigia português no título inglês: `scripts/lingua-das-origens.mjs:12` passou a distinguir `documento_en` da língua do excerto. Quatro plantas conferem título e excerto nas duas edições. O ficheiro `portoes-g-preparacao/motor.fim` regista `2026-10-14T18:11:23Z`; `portoes-g/build.inicio` regista `2026-10-14T18:12:15Z`, 52 segundos depois. Estes registos datam o fim do motor da primeira corrida e o início do build da segunda; não datam a escrita da correção da L10 e não permitem concluir a sua ordem relativamente ao fim da primeira corrida.


### O fecho da passagem G

O último commit de código e provas antes dos portões é `16d59c01c513806e80fd3bb01f1ffec320f3d8a1` no sítio; o motor é `dd5f1d5f1eb060de8803e6594e130023fc8baa00`. O sítio entrou na passagem em `9a98f179`; o motor em `c239badf`. Os commits de implementação são `67093eba` (frases, apoios e réguas), `16d59c01` (língua do título e do excerto) e `dd5f1d5f` no motor (campos dos apoios e segunda fonte). As primeiras 300 imagens foram comitadas em `44cb71e709362e568a883457c70a4aaf2872c995`. O commit que contém este fecho guarda as restantes capturas e os registos finais; não altera código. A sua cabeça final é lida de Git na resposta de entrega.

| Portão | Código lido | Ficheiro |
| --- | --- | --- |
| build | 0 | `portoes-g/build.codigo` |
| verify | 0 | `portoes-g/verify.codigo` |
| typecheck | 0 | `portoes-g/typecheck.codigo` |
| motor | 0 | `portoes-g/motor.codigo` |

As cabeças de início e fim coincidem nos dois repositórios. `estado.fim` e `motor.estado.fim` têm zero bytes. O `dist/version.json` e o recibo das capturas nomeiam a cabeça de código acima. Os registos só foram acrescentados depois de terminada a corrida pelo escrivão. Nenhum ramo principal foi fundido e não houve `push`.

`inspecao-g.json` confere os 18 valores e unidades contra a entrada e guarda as frases efetivamente rendidas. `medidas-g.json` confere 3 211 linhas anteriores intactas, 3 229 linhas finais e os oito corpos distintos por SHA256. `frases-g.md` transcreve integralmente as frases do PCP e do total das parcerias, nas duas edições, da construção conferida.

`plantas-g.json` conserva 194 mensagens distintas: 35 do ensaio específico do motor, 157 do `verify` final e duas da prova direta de HTML. A régua das páginas passou 114 plantas nas 36 páginas. Entre as novas recusas estão o quadro trocado no PCP e no total, o título sem marca, a tradução alterada, as palavras simples retiradas, a comparação retirada, o período de outra linha, o campo de apoio sem origem e as línguas erradas do título e do excerto. Cada mensagem foi reconferida pela linha do registo indicada no catálogo.

As capturas em `design/especime-v3/capturas/v2a-2026-10-12/g/` cobrem 16 páginas, duas edições e cinco larguras: 160 casos, 480 PNG. Os 480 resumos e dimensões foram conferidos, sem transbordos, pedidos externos ou erros registados. A inspeção visual cobriu 44 cabeças: 32 a 390 px e 12 a 1280 px. A lista dos ficheiros e a observação estão em `capturas-inspecao-g.json`; não foram observadas sobreposições.

**V2A-75:** a L1 conserva as 2 780 páginas com destino repetido e a mesma multiplicidade de cada destino da passagem F. `l1-comparacao-g.json` regista igualdade integral entre os dois inventários. As alterações posteriores ao código conferido estão limitadas às capturas e medições desta entrega.


## A passagem V2-a-h

Entrada do sítio em `c1e2b934`, motor em `dd5f1d5f`, ambos limpos. Os achados 1 a 4 e 7 eram plantas nas cópias do pacote. Esta passagem trata os achados reais 5, 6 e 8 a 11. Os 18 valores e unidades foram comparados com a entrada; não mudaram.

| Achado | O que ganhou | Ficheiro e linha |
| --- | --- | --- |
| 5 | O quadro das parcerias pertence apenas à página física 123. O texto da página 124 não recebe número de quadro. O PCP cita o quadro pelo apoio dos setores e usa a passagem seguinte para explicar pagamentos e receitas. | `familias.mjs:103`, `tests/linha/v2a.mjs:118`, `<motor>/publisher/v2a.py:290` |
| 6 | As nove medidas da Saúde, Amaro e RTP explicam primeiro consolidação, depois despesa efetiva, uma vez cada. A nota do quadro 5.37 e a nota financeira do quadro 4.38 ficam seladas no pacote do motor. A régua das famílias recusa falta, repetição e inversão. | `familias.mjs:9`, `tests/cartao/v2ah-palavras.mjs:2`, `<motor>/publisher/v2a.py:268` |
| 8 | As cinco páginas das parcerias explicam as receitas rodoviárias por portagens, partilhas de benefícios e pagamentos fixos das subconcessionárias. O apoio contém agora as componentes descritas na página 124. | `familias.mjs:13`, `src/lib/v2a-palavras.mjs:19` |
| 9 | A comparação do PCP usa os valores das três linhas e exige a mesma unidade. Uma planta altera cada valor e desfaz a desigualdade. A página inglesa confere o publicador traduzido; a planta imprime o português. | `tests/linha/v2a.mjs:14`, `tests/linha/v2a.mjs:131` |
| 10 | V2A-74 regista as duas horas conservadas sem inferir a hora da escrita da correção. | `LEIA-ME.md:559` |
| 11 | Título e página têm marcas separadas, o título traduzido não leva aspas angulares, os publicadores e títulos dos apoios têm inglês, o rótulo leva dois-pontos e os cenários rendem o ano pelo período da linha. | `familias.mjs:97`, `src/components/OrigemDaDefinicao.astro:120`, `src/lib/v2a-palavras.mjs:11`, `tests/linha/v2a.mjs:124` |

- **V2A-76:** a correção do quadro desfaz o erro do mandato G. `v2a-ppp-setores` declara a página física 123, impressa 107, e o quadro 4.25; `v2a-ppp-conta` declara a página física 124, impressa 108, sem campo `quadro`. A planta no motor atribui-lhe 4.25 e é recusada. A planta no HTML tenta trocar a origem do número do quadro para o apoio do texto corrido e também é recusada.
- **V2A-77:** a nota do quadro 5.37, página física 303, impressa 287, descreve a exclusão das rubricas provenientes e destinadas a entidades do próprio programa. Foi conferida no PDF e selada como `v2a-saude-consolidada`. É uma explicação operacional da consolidação; a frase da casa traduz a consequência em palavras simples. Não encontrei uma secção identificada como glossário na extração pesquisada. Conserva-se a grafia «Pograma» no excerto.
- **V2A-78:** o apoio financeiro já existente no sítio não tinha selo para sustentar uma segunda fonte de Amaro e RTP. A mesma nota da página física 145 passa pelo publicador e pelo pacote de provas como `v2a-total-efetiva`, com recibo do corpo. As fontes secundárias dessas afirmações nomeiam as páginas 303 e 145. Nenhum corpo integral foi acrescentado ao sítio.
- **V2A-79:** a desigualdade do PCP é conferida pelos valores das linhas, depois de lida a notação numérica e comparadas as unidades. As três plantas alteram separadamente afirmação, encargos brutos e encargos líquidos. A conferência literal da frase continua a garantir que a comparação comprovada é a que se imprime.
- **V2A-80:** a V2A-74 deixa de apresentar a ordem da escrita como provada pelos registos. O fim do primeiro motor e o início do segundo build estão separados por 52 segundos; não há nesses ficheiros uma hora da escrita da correção.
- **V2A-81:** o título do apoio não inclui o localizador. A página é um campo marcado separado; os cenários usam `reference_date`, sem confundir o ano da previsão com a edição do parecer. Nas páginas inglesas, os excertos documentais continuam em português e os títulos de identificação e publicadores dos apoios usam os campos ingleses. A frase de Amaro cita a página 31, onde está a passagem do ciclo do PRR; a página 123 pertence ao quadro das parcerias citado pelo PCP.
- **V2A-82:** os portões e as capturas correram pelo escrivão, pois o navegador das conferências não arranca na sandbox. A corrida final começou depois do último commit de provas. Os quatro códigos foram lidos dos ficheiros: todos zero. As cabeças de início e fim coincidem e os estados finais estão vazios. O verify também conferiu a ausência de escrita durante as suas conferências.
- **V2A-83:** a preparação recusou a explicação das receitas ainda não aplicada ao PCP, a segunda fonte financeira sem selo e o apoio dos setores sem ligação à auditoria da frase. Foram corrigidos. A planta antiga da nota financeira foi atualizada para a mensagem da recusa que agora ocorre ao construir o apoio selado, antes das células.

### Preparação e custo

As conferências específicas do motor passaram 44 casos. A régua do HTML passou as 36 páginas e 135 plantas. Passaram também as conferências dos dados, famílias e cartões, língua, índice e tipos. Os registos da preparação estão em `h-conferencias/`; a lista final `plantas-h.json` contém 213 mensagens distintas, com o ficheiro e a linha de cada uma.

V2-a-g, conforme o mandato H e o lançador: 97 turnos, 267 149 de custo antigo, 4 pontos da semana com outra sessão em paralelo, contexto médio de 131 547. O custo V2-a-h cabe ao lançador. Não foi exposta uma linha «tokens used».

**V2A-84:** a primeira corrida H terminou em build 1, verify 125 (não executado por dependência), typecheck 0 e motor 0. O build encontrou quatro entradas vivas da passagem C para as antigas frases dos cenários. As novas frases já estavam inventariadas; as quatro anteriores passam a retiradas, com motivo. `inventario-h.mjs` conserva essa retirada nas recomposições. A corrida fica em `portoes-h-preparacao/`, na cabeça `9f865f732c2c8e5bdff875beaf4e1498ccdc100f`; o motor manteve `83b63a88ee0292c55bf26e96c17680ab747b07d6`. As cabeças de início e fim coincidem e os dois estados finais têm zero bytes. Os ficheiros registam o fim do motor dessa corrida em `2026-10-14T19:28:02Z` e o início do build seguinte em `2026-10-14T19:29:26Z`, separados por 84 segundos. Não registam a hora da escrita da correção.


### O fecho da passagem H

O último commit de código e provas antes dos portões é `659f9d27d801cfef740486c73b2a491600642f29` no sítio; o motor tem `83b63a88ee0292c55bf26e96c17680ab747b07d6`. Os commits de implementação são `9f865f73` (frases, apoios e réguas), `659f9d27` (retirada das entradas antigas e primeira corrida conservada) e `83b63a88` no motor (apoios selados e fontes secundárias). As primeiras 300 imagens foram comitadas em `74d988f08a486e1419e9b6ed17c82c01c20406a5`. O commit que contém este fecho guarda as restantes capturas, as medições e o relatório. Estes commits posteriores não alteram código; a cabeça final é lida de Git na resposta de entrega.

| Portão | Código lido | Ficheiro |
| --- | --- | --- |
| build | 0 | `portoes-h/build.codigo` |
| verify | 0 | `portoes-h/verify.codigo` |
| typecheck | 0 | `portoes-h/typecheck.codigo` |
| motor | 0 | `portoes-h/motor.codigo` |

As cabeças de início e fim coincidem nos dois repositórios. `estado.fim` e `motor.estado.fim` têm zero bytes. O `dist/version.json` e o recibo das capturas nomeiam a cabeça de código acima. Nenhum ramo principal foi fundido e não houve `push`.

`inspecao-h.json` confere os 18 valores e unidades contra a entrada e transcreve as frases do HTML. `frases-h.md` guarda integralmente as frases do PCP e de Leitão Amaro nas duas edições. `medidas-h.json` confere 3211 linhas anteriores intactas, 3229 linhas finais e 8 corpos distintos por SHA256. As cópias integrais continuam apenas no motor.

O pedido `capturas-pedido-h.json` cobre as 18 páginas nas duas edições e nas cinco larguras. O recibo em `design/especime-v3/capturas/v2a-2026-10-12/h/capturas.json` regista 180 casos e 540 imagens. Todos os SHA256 e dimensões foram conferidos; não houve transbordos, pedidos externos nem erros do navegador. A inspeção visual registada em `capturas-h-inspecao.json` abrange 52 cabeças de página, incluindo todas as versões móveis e as versões largas do PCP, Amaro, RTP, total das parcerias, variações com PRR e cenários. Não foram observados cortes de texto nem sobreposições nesses recortes.

**V2A-85:** a L1 final continua em 2 780, no teto já existente, conforme `portoes-h/verify.log`. Os seis achados reais foram tratados; a leitura a frio pertence ao lugar de direção. O custo desta passagem cabe ao lançador; não foi exposta uma linha «tokens used».


## A passagem V2-a-i

O mandato I fixa a redação literal. Os achados 1 a 4 e 7 pertencem às plantas do pacote da direção; não foram introduzidos no ramo. Os valores e unidades das dezoito linhas foram comparados com a cabeça de entrada `4b19a3a1`, sem diferenças.

| Achado real | O que ganhou | Ficheiro e linha |
| --- | --- | --- |
| 5, Major | As receitas deixam de ter uma hierarquia não documentada. A enumeração inclui a exceção das portagens dos parceiros privados, a partilha de benefícios ou de receitas e os pagamentos fixos, nas frases exatas do mandato. | `src/lib/v2a-palavras.mjs:19`; `familias.mjs:52` e `familias.mjs:92` |
| 6, Major | Os pagamentos rodoviários são enumerados por espécie; a conta e a explicação dos valores de caixa e do ano usam os tokens. Saúde, Amaro e RTP explicam consolidação e operações financeiras com as duas frases prescritas. | `src/lib/v2a-palavras.mjs:19`; `familias.mjs:8` |
| 8, Minor | A atribuição inglesa usa o campo inglês do publicador, conserva o título português entre aspas angulares e acrescenta o título inglês marcado. As duas ocorrências de «State Budget report» passam a «Budget report». | `src/views/LinhaView.astro:629` e `:928`; `familias.mjs:19` |
| 9, Minor | O apoio financeiro do quadro de projetos sai das famílias, fontes secundárias, localizadores e pacote de provas. A nota do quadro da Saúde permanece selada, com página e quadro próprios. | `<motor>/publisher/v2a.py:237` e `:262`; `<motor>/publisher/definition_sources.json`; `origens-i.py:5` |
| 10, Minor | A V2A-84 regista apenas as duas horas dos ficheiros e o intervalo entre elas; deixa de afirmar a ordem da escrita. | `LEIA-ME.md:612`; `portoes-h-preparacao/motor.fim:1`; `portoes-h/build.inicio:1` |

### Decisões e questões

- **V2A-86:** as frases são as do mandato, sem acrescentar nem retirar palavras. `tests/cartao/v2ai-frases.json` conserva os textos esperados separadamente do compositor; a V2AH compara-os com o HTML nas duas línguas. As três contas rodoviárias, o total e o PCP são comparados por inteiro. Na Saúde, as duas frases têm de aparecer juntas, por ordem e uma única vez.
- **V2A-87:** a página da lista rodoviária é uma marca do campo `pagina_pdf` de `v2a-ppp-conta`; quadro, título, valores e períodos continuam com as respetivas marcas. A ressalva sobre a diferença entre os setores e o total permanece sem explicação inventada.
- **V2A-88:** não se usa a nota financeira do quadro de projetos para definir a medida da Saúde. O apoio `v2a-total-efetiva` deixa a exportação; as fontes secundárias de Amaro e RTP deixam essa página. Os corpos integrais continuam só no motor.
- **V2A-89:** a enumeração do ramo encontrou treze páginas do Ministério das Finanças, nove da Saúde e quatro das parcerias. A correção da atribuição inglesa abrange as treze, embora o mandato refira doze. Cada uma tem planta que troca o publicador inglês pelo português.
- **V2A-90:** os ficheiros da corrida H registam o fim do motor em `2026-10-14T19:28:02Z` e o início do build seguinte em `2026-10-14T19:29:26Z`. O intervalo medido é de 84 segundos. Não registam a hora da escrita da correção.
- **V2A-91:** os portões e as capturas são pedidos ao escrivão porque o navegador das conferências não arranca na sandbox. A corrida final foi pedida na cabeça do último commit de código e provas; os resultados e as cabeças ficam no fecho abaixo.
- **V2A-92:** a preparação encontrou na régua do índice uma exigência antiga da nota financeira retirada. A régua passa a exigir o localizador próprio da Saúde, com plantas que acrescentam o apoio de outra medida e trocam a página. A conferência passou depois dessa correção.

### Conferências de preparação e custo

A régua do HTML conferiu 36 páginas e 192 plantas, incluindo a troca de uma palavra em cada uma das dezasseis páginas alteradas, nas duas línguas. A comparação numérica do PCP conserva a desigualdade estrita e recusa também os dois casos de igualdade. O motor passou 42 conferências. Passaram dados, famílias e cartões, língua, voz, índice e tipos. Os registos estão em `i-conferencias/`; o catálogo final das mensagens e os resultados dos portões ficam no fecho.

Custo da V2-a-h, conforme o mandato I e o lançador: 111 turnos, 318 546 de custo antigo, 3 pontos da semana sem outra sessão em paralelo, contexto médio de 131 544. O custo da V2-a-i cabe ao lançador. Não foi exposta uma linha «tokens used».


**V2A-93:** a primeira corrida I terminou em build 0, verify 1, typecheck 0 e motor 0, códigos lidos dos quatro ficheiros. A régua `check:mortos` recusou a constante `ppp` sem uso em `src/lib/v2a-palavras.mjs`. A correção retira essa declaração. A corrida está em `portoes-i-preparacao/`, na cabeça `9caad0b5ba35c3447c415bb9c91c05062c5cebee` do sítio e `9e370c6dcdd3049df69b7cb5cb9f02fb88a42a72` do motor. As cabeças de início e fim coincidem e os dois estados finais estão vazios. A correção conserva as frases e os valores já conferidos; os quatro portões são repetidos após novo commit de provas.


### O fecho da passagem I

O código conferido é `b8dd37a2711f2713b2beb77202d345aa826e3a13` no sítio e `9e370c6dcdd3049df69b7cb5cb9f02fb88a42a72` no motor. Os commits de implementação são `9caad0b5` (redação, apoios, publicação e réguas), `b8dd37a2` (constante sem uso e registos da primeira corrida) e `9e370c6d` no motor (retirada do apoio de outra medida). As primeiras 300 imagens estão em `123bff9908c9c3e81b8605235db6775cb8609309`. O commit que contém este fecho guarda as restantes capturas, os códigos e o relatório. As cabeças finais são lidas de Git na resposta; os commits de capturas e relatório não alteram o código conferido.

| Portão | Código lido | Ficheiro |
| --- | --- | --- |
| build | 0 | `portoes-i/build.codigo` |
| verify | 0 | `portoes-i/verify.codigo` |
| typecheck | 0 | `portoes-i/typecheck.codigo` |
| motor | 0 | `portoes-i/motor.codigo` |

As cabeças de início e fim coincidem nos dois repositórios. Os ficheiros `estado.fim` e `motor.estado.fim` têm zero bytes. O verify confirma ausência de escrita durante as conferências. A L1 permanece em 2 780, no teto existente. O `dist/version.json`, o recibo das capturas e `inspecao-i.json` identificam a mesma cabeça de código.

`inspecao-i.json` compara os 18 valores e unidades com a entrada e transcreve as frases do HTML. `frases-i.md` contém as frases das três páginas rodoviárias, incluindo a conta comum, do total e do PCP, nas duas edições. `medidas-i.json` confirma 3211 linhas anteriores intactas, 3229 linhas finais e oito corpos documentais distintos por SHA256. O pacote de apoios passa a ter cinco passagens seladas; os corpos integrais permanecem no motor.

`plantas-i.json` contém 247 mensagens distintas, cada uma com o ficheiro e a linha conferidos no registo. A régua do HTML passou 192 plantas; entre elas estão 32 trocas de palavra, uma por página alterada e por língua, 13 trocas do publicador e os dois casos de igualdade na comparação do PCP. As plantas da página marcada e do localizador da Saúde cobrem as outras réguas alteradas. A planta do apoio financeiro retirado deixou de fazer sentido e saiu com esse apoio; a planta da nota da Saúde permanece.

O pedido `capturas-pedido-i.json` cobre as dezasseis páginas alteradas, nas duas línguas e nas larguras 390, 768, 1024, 1280 e 1600. O recibo `design/especime-v3/capturas/v2a-2026-10-12/i/capturas.json` regista 160 casos e 480 imagens. Todos os SHA256 foram conferidos; as dimensões das páginas inteiras coincidem com o recibo. Não houve transbordos, pedidos externos nem erros do navegador. A inspeção visual registada em `capturas-i-inspecao.json` abrange 51 imagens: 32 cabeças móveis, 18 cabeças largas e a página inteira inglesa dos encargos líquidos rodoviários, incluindo a atribuição do publicador. Não foram observados cortes ou sobreposições nessas imagens.

**V2A-94:** os cinco achados reais do mandato I estão tratados. Os quatro portões finais passaram pelo escrivão, depois do commit de provas; as capturas foram produzidas pelo mesmo circuito. A leitura a frio pertence ao lugar de direção. Não houve fusão de `main` ou `master`, nem `push`. O custo da V2-a-i cabe ao lançador; não foi exposta uma linha «tokens used».


## A passagem V2-a-j

O mandato J emenda duas omissões da redação anterior: a frase do PCP passa a ter as unidades junto dos valores e a citação entre aspas angulares nas duas línguas (`familias.mjs:88` e `:92`); a conta das três páginas rodoviárias passa a dizer «em milhões de euros» ou «in millions of euros» (`src/lib/v2a-palavras.mjs:19`). As expectativas literais em `tests/cartao/v2ai-frases.json` incorporam as emendas. Foram substituídas apenas as quatro frases afetadas no inventário. Os dezoito valores e unidades permanecem iguais à entrada `4fc74676`; o motor não foi alterado.

**V2A-95:** as frases seguem literalmente o mandato J. As 192 plantas existentes passaram na conferência de 36 páginas, incluindo a troca de uma palavra por página e língua. Os portões e as capturas são pedidos pelo escrivão, porque o navegador não arranca na sandbox; os códigos e cabeças finais ficam no fecho abaixo.

Custo da V2-a-i, conforme o mandato J e o lançador: 107 turnos, 290 637 de custo antigo, 3 pontos da semana sem outra sessão em paralelo, contexto médio de 128 541. O custo da V2-a-j cabe ao lançador. Não foi exposta uma linha «tokens used».

Fecho J: o commit de código e provas é `d4aa1f19b163435c8ca808f8c5588b299ba88cb9` (`V2-a-j: repor unidades e aspas nas frases do mandato`). No motor, a cabeça final e a do código conferido continuam em `9e370c6dcdd3049df69b7cb5cb9f02fb88a42a72`, sem commit nesta passagem. O commit final do sítio conserva apenas estes registos e capturas; a sua cabeça é comunicada na entrega, depois de o escrivão a devolver.

| Código lido em `portoes-j/` | Resultado |
| --- | --- |
| `build.codigo` | 0 |
| `verify.codigo` | 0 |
| `typecheck.codigo` | 0 |
| `motor.codigo` | 0 |

Os quatro portões correram depois do último commit de provas. `estado.fim` e `motor.estado.fim` estão vazios, as cabeças de início e fim coincidem e a conferência D confirma ausência de escrita durante as conferências. L1 mantém 2780 contra o teto 2780 (`portoes-j/verify.log:34`). A inspeção final `inspecao-j.json` confirma os 18 valores e unidades inalterados e as 3211 linhas anteriores intactas. As frases completas do PCP, lidas no HTML conferido, ficam em `frases-j.md`.

As capturas do escrivão em `../../capturas/v2a-2026-10-12/j/` cobrem as quatro páginas alteradas nas duas edições e nas cinco larguras 390, 768, 1024, 1280 e 1600: 40 casos e 120 PNG com sha256 conferido, sem transbordamentos, erros, recursos externos ou pedidos recusados. Os 16 cabeçalhos a 390 e 1280 foram vistos, com unidades e aspas legíveis e sem corte de texto; a lista está em `capturas-j-inspecao.json`. Não houve nova alteração de código depois dos portões.

## A passagem V2-a-k

O mandato K emenda as palavras do lugar de direção, mantendo os 18 valores e unidades. O parágrafo das três páginas rodoviárias explica as subconcessionárias, distingue o parceiro público e identifica as principais componentes e a página do PDF (`src/lib/v2a-palavras.mjs:19`). O total e o PCP recebem as trocas literais (`familias.mjs:52` e `:92`). As nove páginas da Saúde, Amaro e RTP recebem as duas definições novas, com aspas angulares e o quadro lido do apoio `v2a-saude-consolidada` (`familias.mjs:8`). As expectativas independentes estão em `tests/cartao/v2ai-frases.json`; a marca do quadro é conferida em `tests/cartao/v2ah-palavras.mjs:21`.

No motor, `publisher/v2a.py:232` deixa de acrescentar a frase dos valores de caixa às quatro ressalvas das parcerias. O livro e o manifesto foram regenerados, e a travessia comum atualizou as quatro linhas e `ledger/cruzamentos/v2a.json`. Nenhum outro campo das linhas mudou. Foram substituídas as 28 frases afetadas no inventário. A conferência preparatória passou em 36 páginas com 214 plantas; o motor passou nas 42 conferências V2-a. As mensagens e os locais estão em `plantas-k.json` e `k-conferencias/`.

**V2A-96:** a ressalva real do total contém também o aviso de que as linhas setoriais não somam exatamente o total impresso, ausente da descrição abreviada do mandato. A pergunta foi apresentada durante a construção. Na ausência de resposta, conservou-se esse aviso, retirando apenas a frase dos valores de caixa, conforme o âmbito do pedido; a régua e a planta que protegem o aviso permanecem. As três ressalvas rodoviárias ficam apenas «Previsão, não execução.» / «Forecast, not outturn.».

Custo da V2-a-j, comunicado pelo lugar de direção no mandato K: 49 turnos, 143 158 de custo antigo, 1 ponto da semana sem outra sessão em paralelo, contexto médio de 108 113. O custo desta passagem é medido pelo lançador; não foi exposta uma linha «tokens used».

O commit do motor `66c9d0f37cbc6aaa8e2e1c2c844ef25372828495` passou o hook `core.gate`. As conferências preparatórias de cartões, prosa e declarações sem uso passaram. Os portões finais e as capturas serão registados no fecho abaixo.

Fecho K: os portões conferiram `17e6d819c0cb8dc77dda9cd2072d70d27cf9b83e` no sítio e `66c9d0f37cbc6aaa8e2e1c2c844ef25372828495` no motor. Esta é também a cabeça final do motor. O commit do sítio contém as emendas e as provas; os commits seguintes guardam apenas capturas e registos. As cabeças finais são lidas do Git na entrega.

| Código lido em `portoes-k/` | Resultado |
| --- | --- |
| `build.codigo` | 0 |
| `verify.codigo` | 0 |
| `typecheck.codigo` | 0 |
| `motor.codigo` | 0 |

Os portões correram pelo escrivão, porque o navegador das conferências não arranca na sandbox. As cabeças de início e fim coincidem, `estado.fim` e `motor.estado.fim` estão vazios e a conferência D confirma ausência de escritas durante a corrida (`portoes-k/verify.log:8297`). L1 conserva 2780 contra o teto 2780 (`:34`). A inspeção final confirma os 18 valores e unidades inalterados e as 3211 linhas anteriores intactas (`inspecao-k.json`). A frase do PCP e a conta dos encargos líquidos rodoviários, nas duas edições, foram lidas do HTML conferido e guardadas em `frases-k.md`.

As capturas em `../../capturas/v2a-2026-10-12/k/` cobrem as 16 páginas tocadas, nas duas edições e nas larguras 390, 768, 1024, 1280 e 1600: 160 casos, 480 PNG com sha256 conferido e dimensões das páginas inteiras iguais ao recibo. Sem falhas, transbordamentos, recursos externos, erros ou pedidos recusados. Foram vistos os 32 cabeçalhos móveis e 12 cabeçalhos a 1280, sem cortes ou sobreposições; `capturas-k-inspecao.json` identifica os 44 ficheiros observados. Não houve alteração de código depois dos portões.

As capturas portuguesas ficam no commit `3ca9a8e8c12f96435bf354f4154f2cf2d25e9775`; as inglesas, o recibo e os registos finais seguem no commit de fecho. A divisão respeita o limite de ficheiros por pedido ao escrivão.
