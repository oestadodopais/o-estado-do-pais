# B1, peça 3: o país

Três passagens: construção, primeira correção e segunda correção.\
Estado desta passagem: sete pontos corrigidos e provados, capturas refeitas.\
Cabeça final do código: `5b76753f`; o commit deste relatório acrescenta as provas e as capturas.\
Os três portões só se leem na tabela da última passagem, onde aguardam o lugar de direção.\
O primeiro parágrafo descreve a construção e é história.

A peça ainda não cumpre integralmente a aceitação. Há duas partes paradas pela regra dos portões P: a atribuição da Carta continua por baixo do mapa e os valores da leitura inglesa conservam a vírgula do livro-razão. O único `verify` completo ficou a 1 na planta I11. A I11 foi corrigida e conferida à parte; a continuação encontrou a K6, também corrigida e provada. Os cinco comandos de continuação terminaram a 0, sem repetir a cadeia completa. Não há, portanto, três códigos finais a 0.

## As cinco partes

| Parte | Resultado | Medida |
| --- | --- | --- |
| Menu | Cinco entradas nas duas edições, sem gaveta. Método, Correções, Agenda, Números e fontes e língua no rodapé e no Sobre. | `check:pais` percorre todas as páginas próprias; capturas das cinco famílias; régua da porta. |
| País | Nome, leitura aprovada, mapa, números por tema, três estudos recentes, mudanças e rodapé. | Sete linhas conferidas, seis valores rendidos e sete recibos na leitura. Dezanove cartões em nove temas, sem os três valores principais da leitura. |
| Temas | `/temas/` e `/en/themes/`, com âncoras e todos os cartões únicos da tabela. | Trinta e cinco cartões em nove temas. A tabela contém 36 entradas, duas para a mesma taxa de desemprego. A do procedimento reúne o cartão, o ano anterior e a União Europeia na régua. |
| O que mudou | Publicações, correções e atualizações do livro inteiro, reunidas por linha e dia, e a nova declaração de mudanças do projeto. | Quinze linhas de correção, treze publicações e uma mudança do projeto. A primeira entrada copia o texto ditado de 21.09.2026 e remete para §1.115. Nenhuma data ou alteração foi inventada. |
| Rodapé | Uma sequência contínua de ligações e texto, com quebra natural. O ponto final de IA fica no mesmo elemento inseparável que a ligação. | Texto aprovado intacto, conferido por `gate:html`; geometria medida nas capturas. |

A contagem dos temas segue exclusivamente `DOMINIO_DAS_MEDIDAS`, em `src/data/dominios.mjs`. Economia e finanças públicas tem 13 cartões; Trabalho, 10; Segurança social e pensões, 2; Educação, 3; Saúde, 1; Habitação, 3; Investimento, 1; Ciência, tecnologia e inteligência artificial, 1; Justiça, 1. Os outros nove temas não se rendem.

Os três estudos recentes são o de Évora 2027 (16.09.2026), o das penalizações por reforma antecipada (24.08.2026) e o de Évora prometido, pago e auditado (15.08.2026). A edição inglesa identifica a edição portuguesa do estudo das reformas. A seleção sai de `WORKS` e das datas de publicação, nunca de uma lista de títulos escrita na vista.

## As duas paragens P

1. **Atribuição da Carta.** A R6 de `check:mapa`, marcada P no mapa do repositório, exige a atribuição da DGT onde o mapa se rende. A planta tira a menção da primeira página e a R6 falha. O mandato pede que a atribuição passe ao Método; a regra de paragem impede alterar essa proteção nesta peça. Conservou-se `LegendaDoMapa` e não se duplicou a menção no Método. A transferência fica por fazer.
2. **Separador decimal inglês.** `Claim` rende o valor canónico e `gate:html` compara-o com o livro. A planta troca apenas `93,5` por `93.5` no valor inglês e o portão rejeita-o. Não se alterou o livro, `Claim` ou a comparação protegida. As cinco vírgulas decimais da leitura inglesa ficam por converter; o resto da frase é o texto ditado.

Nenhuma das sete linhas citadas mudou: dívida de 2024, `93,5`; dívida de 2025, `89,7`; dívida da União, `81,7`; desemprego, `6`; desemprego da União, `6,0`; preços das casas, `17,6`; preços na União, `5,5`. A construção para se algum destes valores deixar de coincidir com a leitura aprovada.

O arame da classe por provar do `check:voz` foi inicialmente classificado por engano como P na comunicação da sessão. O mapa classifica a célula 10 como M. Foi corrigido: só o parágrafo aprovado sai desse arame, depois de a lista fechada conferir a frase inteira, `check:pais` exigir as sete portas e `gate:html` conferir os valores. A planta de prosa solta continua a falhar.

## As células que mudaram de forma

| Célula | Antes | Agora | Planta |
| --- | --- | --- | --- |
| `tests/inicio/porta.mjs` | Faixa, gaveta e menus antigos. | Menu em linha, largura da página e primeira fila dentro dos 800 px. | Menu em coluna e cartões empurrados para baixo. |
| `check:datas` 1b | Índices de estudos e de lugares. | Inclui as três edições datadas da primeira página. | Data de publicação trocada. |
| `gate:html`, unidade e régua do cartão | A forma já usada nas páginas antigas não era admitida nas duas rotas novas. | Só a unidade da própria linha; só as referências do recibo do mesmo cartão; a auditoria dos selos continua ativa. | Unidade trocada e referência atribuída ao selo de outra linha. |
| `gate:html`, unidade das correções | A unidade entrava como texto, e a base do índice ficava sem marca. | `CampoDaLinha` confere a unidade da linha da própria entrada, com o recibo obrigatório. | Unidade de correção trocada. |
| `gate:html`, mudanças | Não conhecia as duas marcas novas. | Compara cada campo com a declaração ou com a data da edição. | Data de publicação inventada. |
| `check:voz` | Inventário e sentinela da frase de identidade antiga. | Lista fechada do país e dos temas; leitura e sinopses comparadas; sentinela da leitura. | Frase explicativa, leitura trocada e comparação europeia sem recibo. |
| `check:lugar` L1 | Contava cada marcador obrigatório `[a verificar]` como segunda porta. | Só desconta o marcador da definição conferida do cartão, para o destino exato do marcador. O teto fica em 2 271. | Duas ligações comuns iguais numa página de temas. |
| `check:lugar` L4 | Exigia uma frase de definição na primeira página. | Exige zero, por mandato do B1. | Reposição da frase de definição. |
| `check:alvos` H2 | Sinopses em prosa corrida contadas à parte. | A mesma regra I127 inclui a leitura do país; os restantes alvos continuam sujeitos ao teste de toque. | Porta de tema pequena entre 641 e 1 023 px. |
| `check:alvos` H6 | Quatro portas antigas. | Contagem do mapa, portas dos temas e endereço de correções. | Porta de tema abaixo de 32 px. |
| `check:alvos` H10 | Exigia instâncias da gaveta. | Exige o comportamento quando existe `aria-expanded`; aceita a ausência do comando retirado. | `aria-expanded` num elemento sem comando. |
| `check:indice` I11 | A planta retirava o espaço no parágrafo que deixou de conter diretamente o par número e palavra. | A mesma medida, com mínimo de 1,5 px; a planta retira também o `gap` da ligação dos Lugares. | Nas duas edições, 4,19 px antes e 0 px depois; um de um par apanhado. |
| `check:cartao` K6 | Comparava a frase inteira com a definição sem as glosas que `Frase` já acrescenta. | Compara a glosa com a declaração e a definição do marcador com `strings.mjs`, antes de comparar a frase da medida. | Frase com glosas a 0; troca da glosa inglesa e da definição do marcador recusadas. |
| `design:feixe` | Extraía o menu e os estados da primeira página; procurava a lista de nomes debaixo do mapa. | Extrai o menu de cinco, os estados da página europeia e os nomes dos Lugares; exige a porta do mapa. | Porta dos Lugares retirada; estado pintado retirado. |

`check:pais` entra nas cadeias de `build` e `verify`. Lê a tabela independentemente da função que compõe os cartões. Fecha para medida sem tema, medida no tema errado, repetição, medida publicada em falta, tema vazio, âncora ou porta em falta, estudo fora da ordem, mudança sem secção existente, correção omitida e menu fora da lista. As plantas e os resumos dos ficheiros antes e depois da reposição ficam nos JSON desta pasta.

## Cadeias e portas

O inventário perde 25 cadeias: 23 ficam retiradas com a razão e duas cadeias curtas saem do inventário porque ainda pertencem a frases maiores. Entram 18 cadeias distintas da leitura, das sinopses, dos rótulos de publicação e das marcas das correções. As unidades são campos conferidos, não prosa do inventário. O pormenor está em `cadeias-peca3.json` e em `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`.

| Família | Razão | Cadeias retiradas |
| --- | --- | ---: |
| menu e rodapé | segunda porta | 11 |
| país | leitura substituída pelo texto da direção | 2 |
| país | palavra fora do lugar | 10 |
| país | explica a página | 2 |

Saem a frase de identidade, a manchete anterior, a faixa cinzenta, a secção europeia, a lista de domínios com contagens e as portas com contadores. Os destinos sobrevivem no menu, nos temas, nos Lugares ou no rodapé. A busca de concelho fica nos Lugares. O comando manual de tema claro ou escuro sai com a mobília antiga. As páginas de domínio, de área de governo e da União não foram editadas nem redirecionadas. A anatomia do cartão e dos recibos, o livro e a geometria dos mapas não mudaram. O contador de estudos de Évora ganhou o nome declarado «Estudos publicados sobre Évora», também em inglês, a partir da sua derivação. Esse nome identifica as três linhas de mudança que antes ficavam sem título.

## Capturas e plantas

As capturas de página inteira estão em [capturas/b1-2026-09-22](../../capturas/b1-2026-09-22/). O guião e os JSON desta pasta registam a largura, o deslocamento lateral, os valores e selos partidos e os resumos SHA-256.

| Família depois | Português | Inglês |
| --- | --- | --- |
| País | 390, 768, 1 024, 1 280, 1 600 | 390, 1 280 |
| Temas | 390, 768, 1 024, 1 280, 1 600 | 390, 1 280 |
| Concelho de Évora | 390, 768, 1 024, 1 280, 1 600 | 390, 1 280 |
| Estudo de Évora 2027 | 390, 768, 1 024, 1 280, 1 600 | 390, 1 280 |
| Sobre | 390, 768, 1 024, 1 280, 1 600 | 390, 1 280 |

Antes: país e Sobre, em português, a 390 e a 1 280. A cabeça inicial só acrescentava o prompt a `main`; não havia diferença em `src/`. Há ainda vinte capturas do primeiro ecrã, nas duas edições e nas duas larguras de comparação.

As provas estão em [plantas-pais.json](plantas-pais.json), [plantas-portoes.json](plantas-portoes.json), [plantas-portoes-html.json](plantas-portoes-html.json), [porta-peca3.json](porta-peca3.json) e [alvos-peca3.json](alvos-peca3.json). A última planta de HTML acrescenta a unidade das correções à primeira passagem. A planta dos alvos exige as três células H2, H6 e H10 verdes antes e vermelhas depois. A certificação do conjunto completo de cartões fica no `verify` final.

Nas 35 capturas depois: deslocamento lateral máximo de 0 px, nenhum valor ou selo partido, cinco entradas do menu numa linha e ponto final de IA inseparável da ligação. Os 35 resumos SHA-256 foram reconferidos contra os PNG. São 59 imagens ao todo: quatro antes, 35 depois e vinte do primeiro ecrã.


| Primeira página, 1 280 × 800 | Fundo da leitura | Fundo da primeira fila | Largura do mapa |
| --- | ---: | ---: | ---: |
| pt | 418,3 px | 744,6 px | 360 px |
| en | 380,2 px | 685,3 px | 360 px |

## Commits

Saída de `git log --format='%h %s%n%(trailers)' main..HEAD`, recolhida na cabeça final das réguas, `8ad55589`. A construção e as capturas são de `45f056f8`; os dois commits seguintes só acertam as réguas I11 e K6. O commit seguinte acrescenta apenas este relatório, capturas e medições. Os corpos dos dois primeiros commits estão também em [autoria-peca3.log](autoria-peca3.log).

```text
8ad55589 B1: conferir as glosas declaradas nas definições dos cartões
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

c52483d7 B1: acertar a planta do espaço da porta dos lugares
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

45f056f8 B1: conferir a unidade de cada correção contra a sua linha
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

d5086779 B1: classificar as unidades do registo de correções
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

6fc06cb4 B1: conferir os temas, as mudanças e as cinco portas
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

913caee6 B1: reunir as correções e separar os alvos do rodapé
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

1b44de26 B1: leitura do país e medidas reunidas por tema
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

ad6c0d8f B1: cinco portas no menu e rodapé corrido
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd

977a1c13 O guião do construtor da peça 3 do B1 (o país e o menu de cinco), fechado com o que a peça 2 deixou
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd
```

## Conferência final

A construção, as 35 capturas depois e os três comandos completos pertencem a `45f056f86daf6512d1651befce6e0f8e8bd31700`. Cada comando completo correu uma vez, no seu comando, com o código e as horas guardados. Horas em UTC.

| Comando completo | Código | Início | Fim |
| --- | ---: | --- | --- |
| `npm run build` | 0 | 2026-09-21T20:50:21Z | 2026-09-21T20:55:03Z |
| `npm run verify` | 1 | 2026-09-21T20:55:45Z | 2026-09-21T21:02:09Z |
| `npm run typecheck` | 0 | 2026-09-21T20:50:09Z | 2026-09-21T20:50:10Z |

O `verify` parou em `check:indice`, na planta I11 da mobília antiga. A página tinha espaço; a planta já não o retirava. A correção ficou em `c52483d7`. A continuação isolada encontrou três diferenças K6 nas definições dos cartões dos temas: eram as glosas já declaradas, que a régua não comparava. A correção e as duas plantas ficaram em `8ad55589`. Só estes dois ficheiros de teste mudaram depois da construção. O cartão e o HTML das páginas não mudaram.

| Continuação isolada | Código | Cabeça |
| --- | ---: | --- |
| `node tests/livro/indice.mjs --navegador` | 0 | `c52483d7` |
| `npm run check:cartao` | 0 | `8ad55589` |
| `npm run check:nomes` | 0 | `c52483d7` |
| `npm run check:palavras` | 0 | `c52483d7` |
| `npm run design:feixe` | 0 | `c52483d7` |

Não se reescreveu `verify-peca3.codigo` e não se voltou a correr a cadeia completa. O resultado literal registado continua a ser **0, 1, 0**. A conferência final de tipos das duas réguas também passou. O `verify` mediu os 840 cartões de partilha; a continuação de `check:cartao` conferiu 5 272 cartões de medida, 152 períodos anteriores e as plantas. Os registos de cada continuação têm `.inicio`, `.fim`, `.cabeca` e `.codigo`.

Tempo de parede observável: **pelo menos 1 h 30 min**, desde a criação de `node_modules` pelo `npm ci`, às 2026-09-21T19:39:35.558700+00:00, até ao fecho das medições, às 2026-09-21T21:10:04.784910+00:00. A leitura anterior ao `npm ci` não foi cronometrada. O registo está em `tempo-peca3.json`.

A worktree começou limpa em `977a1c13607709ab70d5f346055898e822cf7687`, um commit de prompt sobre `a5c44893`. `npm ci` correu uma vez. Não houve checkout noutra árvore nem push. Os commits usam caminhos explícitos e contêm os dois textos de autoria pedidos. Nos dois primeiros, uma linha vazia separa os trailers, pelo que `git log --format='%(trailers)'` só reconhece o último. A guarda local bloqueou a tentativa de corrigir as mensagens por rebase interativo. Os commits seguintes usam o bloco contíguo correto; não se contornou a guarda.

O mapa do repositório identificou corretamente as duas proteções P. As cadeias de comandos que transcreve antecedem a entrada de `check:lugares`; a cadeia real do `package.json` foi preservada e ganhou `check:pais`. A necessidade de atualizar a sentinela da célula 10 e as extrações do feixe confirmou os avisos dos relatórios anteriores.

O mapa já classificava I11 e K6 como M. Ficou por antecipar, nesta construção, que a planta I11 dependia do pai do par e que K6 não tratava estas glosas declaradas. Foram falhas da preparação das conferências isoladas, não erros do mapa nesses dois casos. A próxima passagem por uma primeira página deve incluir ambas antes da corrida completa.

## A passagem de correção de 22.09.2026

As duas paragens estão decididas: a atribuição da Carta fica por baixo do mapa, com a R6 intacta; a leitura inglesa conserva a vírgula do livro-razão, sem alteração ao `Claim` ou à comparação do `gate:html`. A maqueta `design/especime-v3/maquetas/b1/pais.html` não mudou e conserva o olho antigo dos estudos.

| Ponto | Célula e planta | Medida |
| --- | --- | --- |
| Temas por baixo da cabeça, a toda a largura | `porta.mjs`: P1 exige menu, nome, leitura, mapa, porta, olho e primeiro tema dentro dos 800 px; P2 mede a largura; G1 compara com `/temas/`. O olho a 1 757,4 px e a grelha reduzida a 655,2 px são recusados nas duas línguas. | 66 células verdes, incluindo seis plantas e seis reposições. A 1 280, temas de 693,6 para 1 092 px, iguais ao conteúdo. Leitura até 418,3 px (pt) e 380,2 px (en); olho até 769,4 px; primeiro tema até 797,8 px. Grelhas iguais nas cinco larguras, nas duas línguas. |
| Nome do limite legal | K1 compara o título com `MEDIDAS_DO_DOMINIO_1`; K2 e N6 conservadas. Nome antigo reposto no cartão: código 1 nas duas línguas. | Nome novo em 12 páginas, seis por edição: país, temas, domínio antigo, estudo das contas de Évora de 2025, índice dos concelhos do livro e recibo do limite. Lista dos caminhos em `medidas-correcao-peca3.json`. |
| Olho dos estudos | Lista fechada do país aceita `estudosRecentes` e recusa `estudosDoLugar`. Repor o olho antigo: código 1 nas duas línguas. | Dois olhos novos no país. Os dois olhos rendidos nas páginas de lugar, ambos em Évora, continuam «Estudos sobre este lugar» e a forma inglesa. |
| Linhas de publicação | Lista fechada aceita `estudoPublicado`; `gate:html` mantém a comparação dos campos e das datas. Prosa solta no lugar do rótulo: código 1 nas duas línguas. | 13 linhas por edição com o rótulo novo. Os três estudos recentes de cada edição conservam `publicado` seguido da data. |

A altura portuguesa a 1 280 **aumentou de 6 470 para 6 622 px**, mais 152 px. Os temas deixaram a coluna esquerda e passaram a começar abaixo do mapa inteiro. A grelha comum tem quatro colunas mais estreitas, com mais quebras de texto. A passagem cumpre a disposição e o primeiro ecrã decididos; não encurtou a página.

O guião atribuía a K1/K2 uma comparação de títulos que o código não tinha: K1 contava as partes e K2 recusava rótulos de recibo. A prova inicial deu código 0 com o nome antigo e a declaração nova (`cartao-antes-correcao.*`). Completou-se K1, sem chamar `nomeDoCartao()`, com positivo, planta e reposição nas duas línguas em `check:cartao --prova`. A primeira conferência isolada da voz também exigiu acertar o inventário: quatro cadeias novas, duas retiradas. Nenhum portão P foi alterado.

Saída das plantas, por `node tests/inicio/porta.mjs --vermelhos` e `node design/especime-v3/medicoes/b1-2026-09-22/provar-correcao-peca3.mjs` (as saídas completas e as gémeas inglesas estão em `porta-correcao.log` e `provas-correcao.log`):

```text
OK planta-dobra.pt {"olho":1757.375,"conteudo":1092,"temas":1092,"grelha":1092}
OK planta-largura.pt {"olho":769.375,"conteudo":1092,"temas":655.1875,"grelha":655.1875}
OK planta-correcao-nome-pt: código 1; K1 · / · indice-de-divida-limite-legal: o nome do cartão difere da declaração: «Dívida da câmara contra o limite legal»; esperado «Limite legal da dívida das câmaras»; bytes repostos true
OK planta-correcao-olho-pt: código 1; B1 lista fechada país: /: «Estudos sobre este lugar».; bytes repostos true
OK planta-correcao-publicacao-pt: código 1; B1 lista fechada país: /: «Prosa solta da planta».; bytes repostos true
```

A construção ficou em `4c992fb4`, depois do nome e da K1 em `cb426ccb`. O guião `captar-peca3.mjs` refez as 35 capturas depois e as vinte janelas, com os mesmos nomes: as cinco famílias nas cinco larguras portuguesas e a 390 e 1 280 em inglês. Os 35 SHA-256 foram reconferidos contra os PNG; os vinte das janelas também ficaram registados. Zero deslocamentos laterais e nenhum valor ou selo partido. Os registos e as capturas entram antes dos três comandos completos; o último commit fica limitado aos registos desses comandos e a esta tabela. Não houve checkout noutra árvore nem push.

| Comando completo na cabeça final | Código lido do ficheiro | Início UTC | Fim UTC | Cabeça medida |
| --- | --- | --- | --- | --- |
| `npm run build` | 0 | 2026-09-22T03:52:59Z | 2026-09-22T03:57:42Z | `6e3baae0` |
| `npm run verify` | 0 | 2026-09-22T03:57:55Z | 2026-09-22T04:05:34Z | `6e3baae0` |
| `npm run typecheck` | 0 | 2026-09-22T04:05:44Z | 2026-09-22T04:05:44Z | `6e3baae0` |

Os códigos foram lidos dos três ficheiros `.codigo`; cada comando guarda também `.log`, `.inicio`, `.fim` e `.cabeca`. As três cadeias completas passaram à primeira nesta cabeça. Antes delas, as capturas foram repetidas em `6e3baae0`: 55 PNG idênticos aos arquivados e 35 SHA-256 reconferidos. O manifesto conserva a cabeça da construção dos ficheiros, `4c992fb4`. O commit seguinte só regista estas saídas e esta tabela, pela exceção expressa do guião.


## A segunda passagem de correção, 22.09.2026

Partida em `6fd5aab7`, sobre `7d323c5f`. Código final em `5b76753f`. As 2 975 linhas do livro-razão e a leitura aprovada continuam idênticas aos bytes da partida. Nenhum push.

| Ponto | Célula | Planta a morder |
| --- | --- | --- |
| 1. Descrição e título do país | D1, nas duas edições; contagem da descrição conferida contra a Carta no `gate:html`. | Descrição antiga: código 1 em pt e en. «309 concelhos»: código 1. |
| 2. Descrição e título dos temas | D1 compara título, descrição e os dois campos de partilha com `strings.mjs`. | Descrição de uma palavra reposta: código 1 nas duas edições. |
| 3. Uma entrada por correção | C1 conta cada índice; M3 confere as três marcas, os valores e a data. São 16 correções, 13 publicações e uma mudança do projeto por edição. | Índice misturado e «4 → 4»: código 1 nas duas edições. O dia 12.08 rende «4 → 3» e «3 → 4». |
| 4. H10 medida | Zero `aria-expanded` nas páginas próprias; conhecido positivo obrigatório recusado na corrida normal, sem `--planta-b1`. Todos os comandos reais encontrados têm prova no navegador. | Conhecido positivo dado como aceite: célula falsa. Comando parado e comando sem medição: célula falsa. |
| 5. Referência europeia | Mesma edição, unidade e período; nota que declara o agregado da mesma medida. | Edição de outro conjunto de dados: código 1. Unidade e nota de outra série também recusadas, em provas independentes. Só se alterou a cópia em memória. |
| 6. Tema do sistema | N3; paleta, escala e cor do navegador seguem o sistema. Moldura conserva as cores. | Guião reposto na `Base.astro` e rendido por Astro: N3 a 1. Paleta ausente e cor errada recusadas. Doze estados no navegador, sem leitura nem escrita da preferência guardada. |
| 7. Grafia das portas | `routePath()` declara a barra; L1 normaliza-a e compara menu e corpo. Teto conservado: 2 271. | Menu sem barra: L1 conta duas portas e sai a 1 em pt e en. |

As provas e reposições estão em [plantas-segunda-correcao.json](plantas-segunda-correcao.json) e [plantas-segunda-tema.json](plantas-segunda-tema.json): 34 e 16 resultados verdes. O inventário acompanha as quatro descrições; «Tema» e «Theme» saem da lista de palavras retiradas porque pertencem às frases aprovadas. A N3 protege o mecanismo retirado. Os documentos originais conservam a exclusão das páginas próprias: cinco transcrições trazem mecanismos de tema da obra publicada.

Conferências isoladas a 0: `check:pais`, `check:lugar`, `gate:html`, `check:datas`, `check:lugares`, `check:voz`, `check:css`, `check:alvos`, `check:moldura`, `ledger:check`, `check:mortos` e tipos dos módulos alterados. Houve construção Astro direta e geração dos cartões, sem as cadeias completas. Comandos, códigos e saídas em [conferencias-segunda-correcao.json](conferencias-segunda-correcao.json). Os seletores antigos da paleta e a regra de uma única cor do navegador foram acertados, com as plantas acima; nenhuma proteção de valor ou fonte foi dispensada.

`captar-peca3.mjs depois pais temas` refez 14 capturas e oito janelas, com os mesmos nomes: cinco larguras portuguesas e 390 e 1 280 em inglês. Zero deslocamentos laterais, valores ou selos partidos. Os 35 resumos do manifesto e os vinte das janelas foram conferidos. A altura do país em português a 1 280 passou de 6 622 para 6 695 px. [Medidas e resumos](medidas-segunda-correcao.json). As saídas inteiras da régua da porta, anterior e atual, estão em [porta-correcao-peca3.json](porta-correcao-peca3.json): 66 células verdes em cada passagem, com plantas e reposições.

**Dois achados sem defeito.** O 17 é a normalização admitida pela §1.47, T4: U+202F e U+00A0 representam o mesmo separador de milhares. O 20 distingue o campo por confirmar do valor: nas origens do PRR o marcador está em `excerpt`; os valores estão confirmados. As duas linhas derivadas não têm esse campo por confirmar e as expressões `check` recalculam os seus valores. O `ledger:check` desta passagem passou.

| Portão completo desta passagem | Estado | Quem o corre |
| --- | --- | --- |
| `npm run build` | Não corrido | Lugar de direção, na cabeça que integrar os registos da sessão. |
| `npm run verify` | Não corrido | Lugar de direção, na mesma cabeça. |
| `npm run typecheck` | Não corrido | Lugar de direção, na mesma cabeça. |
