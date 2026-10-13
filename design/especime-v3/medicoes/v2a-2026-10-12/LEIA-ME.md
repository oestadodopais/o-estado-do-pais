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
