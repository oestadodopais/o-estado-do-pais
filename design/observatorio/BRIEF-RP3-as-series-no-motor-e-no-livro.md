# Brief RP3 · as séries no motor e no livro-razão (a terceira peça do tracker dos rendimentos e dos preços)

*Escrito pelo lugar de direção (Claude Fable 5.1) a 26.09.2026 à tarde, com o mapa do que existe lido por um agente do Claude Opus 5.5 nos dois repositórios (só leitura) e os dois memorandos do brainstorm do mesmo dia (`BRAINSTORM-rendimentos-e-precos-2026-09-26-{opus,astra}.md`). O §0 é medido por `design/observatorio/medidas/BRIEF-RP3.py` sobre cabeças presas. Sem travessões.*

## 0 · O que se mediu (26.09.2026, pelo guião `design/observatorio/medidas/BRIEF-RP3.py`, o sítio em `334cc740`)

O livro-razão do sítio tem 2 984 linhas (`linhas_do_livro`), cada uma com um valor e um excerto. A construção inteira do L1 nessa cabeça demorou 303,7 segundos (`segundos_do_build`) para 7 354 páginas (`paginas_construidas`), e a cadeia `verify` demorou 486,9 segundos (`segundos_do_verify`). Agrupadas pela edição e pela unidade, 45 famílias de linhas têm mais de um período (`grupos_com_varios_periodos`), e 28 dessas famílias misturam linhas de Portugal com linhas da União (`grupos_que_misturam_uniao`), lidas em 2 655 linhas com os quatro campos (`linhas_lidas_para_os_grupos`): a forma adormecida `serieDoPais()` de `src/lib/dominios.mjs`, que agrupa por edição e unidade, poria pontos da União na linha de Portugal se fosse ligada como está. No motor, o estudo dos domínios (o estudo treze) aloja dezenas de ficheiros de fonte, entre eles os corpos JSON do Eurostat, cada um com todos os períodos publicados (o do salário mínimo traz mais de cinquenta semestres), e a casa lê uma célula de cada; estes factos leem-se do motor, que não está na máquina do portão dos briefs, e por isso não são medições deste guião.

O que o mapa achou e que este brief toma por dado: nenhum identificador de série existe no motor nem no sítio; o leitor `eurostat_series()` devolve todos os períodos em `sobre["periods"]` mas nada os transforma em linhas; `ine_indicator()` recusa uma resposta com mais de um período e os pedidos ao INE prendem `Dim1` a um período; o exportador escreve um `value` e um `reference_date` por ficheiro; o portão de HTML não lê atributos, pelo que a geometria de um desenho (`d`, `points`) é invisível a todos os portões; o `Claim.astro` é a única maneira de imprimir um número, e dentro de um SVG precisa da legenda de selos do seu instrumento; a única série desenhada no sítio é o índice da dívida de Évora, quatro pontos, uma linha e um selo por ponto; os cartões de partilha rebentaram a Vercel uma vez a meio das linhas, e os estudos «de dados» (com `conjunto`) partilham um cartão por estudo.

## 1 · O teste de aceitação, dito antes

Feito quer dizer: nove séries do INE e do Eurostat seladas em `ledger/series/`, uma por ficheiro, cada ponto com o seu período, o seu valor tal como a fonte o escreve, o seu excerto literal e a sua bandeira, cada série com o pedido do cliente da casa registado e alojado e com o nome que a fonte lhe dá; uma série derivada, com a conta escrita e recomputada na construção ponto a ponto; a página do recibo de cada série nas duas edições, com todos os pontos numa tabela e nenhum algarismo fora de `[data-ponto]` ou de uma origem já admitida; os cartões de identificador estável do RP1 a declarar a sua série, e uma célula que prende o valor e o período do cartão ao último ponto da série; os portões novos (as células S) a morder nas suas plantas; os três portões a 0 na cabeça final; nenhuma página do leitor além dos recibos novos muda; nenhum gráfico ainda (o gráfico é o RP4, e lê estas séries).

## 2 · O mandato

| # | o que | como | a medida |
|---|---|---|---|
| 1 | **Os pedidos das séries no motor** | Cada série do §3 é um pedido do cliente da casa (`core/http.py`, o `User-Agent` da casa, o intervalo e o recuo por anfitrião) à API do INE (`pindica.jsp?op=2&varcd=…&Dim1=<todos os períodos pedidos>&Dim2=PT&lang=PT`, mais a metainformação) ou do Eurostat (a API de disseminação com `sinceTimePeriod=` para o primeiro período do §3), registado em `indicators/out/rp3-<data>/pedidos.jsonl` (endereço, hora, cliente, estado, sha256, bytes) e alojado em `content/13 Dominios/source/` com o sha256 no `MANIFEST.sha256` e a entrada no `FETCH.json`; `buscar()` de `publisher/dominios_fetch.py` ganha um teto `max_bytes` (a planta: um corpo acima do teto é recusado e registado); se a API do INE não aceitar a lista inteira de períodos num `Dim1`, o construtor pede por anos, regista cada pedido e diz no relatório o que a API aceitou | `pedidos.jsonl` e `FETCH.json` com um pedido por corpo; o teto com a planta |
| 2 | **Os leitores de série** | Um leitor novo por fonte em `publisher/dominios_readers.py` (`serie_ine()`, `serie_eurostat()`), que lê TODOS os períodos de uma coordenada num só passo pelo índice do cubo (não reconstruindo o índice por célula), devolvendo por ponto o período na forma da casa (`AAAA`, `AAAA-MM`, `AAAA-Tn`, `AAAA-Sn`), o valor como a fonte o escreve, o objeto literal da resposta como excerto e a bandeira; os leitores de célula existentes não mudam | os testes dos leitores com um corpo alojado, e uma planta por forma de período |
| 3 | **As linhas de série no livro do motor e no exportador** | Um construtor novo `publisher/dominios_series.py` declara as séries do §3 (código ou conjunto, identificador, coordenadas, periodicidade, unidade, primeiro período), confirma na metainformação o nome, a frequência, a unidade e a escala, e gera uma linha de série por declaração; `export_site_rows.py` escreve-as em `ledger/series/<id>.yml` na forma do §4, com o registo de cruzamento em `ledger/cruzamentos/series.json` (id, sha256, estudo); a regra V11 (uma linha cruzada nunca sai) e a V16 (um valor mudado exige uma entrada tipada) valem por ponto: um ponto acrescentado no fim é crescimento e regista-se pelo sha256; um ponto existente mudado exige uma entrada em `corrections` com o período; o `core.gate` a 0 em cada commit | as nove séries exportadas; as plantas da V11 e da V16 por ponto |
| 4 | **O livro-razão do sítio: as séries** | `ledger/series/README.md` com as regras da linha de série (o §4 deste brief é o rascunho; as regras numeram-se como as do `ledger/README.md`); `src/lib/series.mjs` com `loadSeries()` e `validateSeries()`; o `typecheck` a conhecer a forma; `scripts/check-cruzamento.mjs` a conferir também `series.json` (o ficheiro existe, os bytes batem com o sha256, o estudo é válido) | `validateSeries()` a 0 com as plantas |
| 5 | **A série derivada** | Uma série com `derivation` (a conta em palavras, nas duas edições), `derived_from` (as séries de origem) e `check` (a expressão recomputada na construção ponto a ponto, como o `check` das linhas escalares); a primeira é «o que cem euros de janeiro de 2015 compram», ponto a ponto, `100 × I(2015-01) ÷ I(t)` sobre a série do índice do IPC total (a S3 do §3), arredondada como a fonte arredonda o índice; uma planta com um ponto trocado a morder; a base do gráfico decide-se no RP4 pela regra do §3.3 do memorando do Opus, não aqui | a série derivada exportada e recomputada; a planta |
| 6 | **O recibo de uma série** | Uma página por série e por edição em `/livro-razao/<id>/` e `/en/ledger/<id>/`, pelo caminho das páginas de linha com uma vista de série: o nome do projeto e o da fonte, a fonte com o endereço do pedido, a hora, o cliente e o sha256, a unidade, as coordenadas, a periodicidade, o primeiro e o último período, a tabela de todos os pontos (período, valor com a bandeira onde a fonte a põe), a derivação onde exista, as correções; cada valor da tabela num `[data-ponto="<id>#<periodo>"]`, que o portão de HTML admite como origem de algarismos só quando o texto é igual ao valor do ponto na série; a data de cada ponto pela `DataDaLinha`; nada de cartões de partilha por série (a série entra no estudo «de dados» `dominios-2026`, como as linhas dos concelhos) | as dezoito páginas construídas; a planta do `data-ponto` com um valor trocado |
| 7 | **O cartão preso à série** | As linhas escalares de identificador estável do RP1 (`ipc-variacao-homologa`, `ipc-variacao-media-12-meses`, `ipc-alimentacao-variacao-homologa`, `ipc-sem-habitacao-variacao-media-12-meses`, `remuneracao-bruta-mensal-media`, e as do RP1b) ganham o campo `serie: <id da série>` (um campo novo em `CAMPOS`, opcional, só para linhas de identificador estável), e a célula S5 exige que o valor e o `reference_date` do cartão sejam os do ponto da série com o mesmo período, e que esse seja o último ponto; a mesma célula para as anuais que tenham série (a pensão, o RSI, a linha de pobreza), pelo ano | a S5 a 0, a planta com um cartão desfasado a morder |
| 8 | **As células S** | `tests/series/*.mjs` na cadeia `verify` (`check:series`): S1 a forma (os campos fechados, cada ponto com período, valor e excerto); S2 os períodos crescentes, sem repetição, na cadência declarada, e cada falha de cadência declarada em `lacunas` com a razão da fonte; S3 o valor de cada ponto literalmente dentro do seu excerto, e o excerto da série dentro do corpo alojado quando o pacote o traz (a metade do motor confere-o sempre); S4 a série derivada recomputada; S5 o cartão preso à série; S6 os recibos (todos os pontos na página, nenhum algarismo fora das origens admitidas, as duas edições iguais ponto a ponto); cada célula com a sua planta registada em `plantas-rp3.json` | as seis células a 0 e as plantas a morder |
| 9 | **O mapa do repositório, as capturas, o relatório e o pacote** | O mapa reposto com `ledger/series/`, `series.mjs`, `dominios_series.py`, as células S; as capturas dos recibos de duas séries (uma mensal, uma anual) nas cinco larguras e nas duas edições, antes e depois (o antes é a página de linha existente mais próxima); o relatório `LEIA-ME.md` em `design/especime-v3/medicoes/rp3-<data>/` com a tabela deste mandato e a medida de cada item, cada série do §3 com o número de pontos, o primeiro e o último período, as lacunas declaradas, o tamanho do corpo e do ficheiro, os segundos do `build` e do `verify` antes e depois (o custo das séries mede-se, não se estima), as plantas, os commits, os códigos dos três portões lidos de ficheiro, o custo; o `medidas.json` por um guião do bloco com `conferir-relatorio.py` a zero faltas | completos |

## 3 · As nove séries, e de onde vêm

Os códigos do INE são os que a metainformação da API confirmou a 26.09.2026 (os do RP1 e do RP1b); o construtor confirma cada um na metainformação antes de selar e para num código que não seja o que a tabela diz. O primeiro período de cada série é o primeiro que a fonte publica na base em vigor, salvo onde a tabela fixa outro; a série sela-se inteira, e o gráfico do RP4 escolhe a janela.

| # | série (o identificador) | fonte e coordenadas | periodicidade e unidade | primeiro período |
|---|---|---|---|---|
| S1 | `serie-ipc-variacao-homologa` | INE `0014663`, `geocod=PT`, `dim_3=T` | mensal, % | o primeiro da metainformação (janeiro de 1992, a confirmar) |
| S2 | `serie-ipc-alimentacao-variacao-homologa` | INE `0014663`, `geocod=PT`, `dim_3=01` | mensal, % | o mesmo |
| S3 | `serie-ipc-indice` | INE, o indicador do nível do índice «Índice de preços no consumidor (IPC, Base - 2025)» por localização geográfica e consumo individual por objetivo, `geocod=PT`, o total; o código escolhe-se entre `0014639`, `0014640`, `0014641`, `0014642`, `0014659`, `0014660`, `0014667` e `0014668` pela metainformação (o nome, a geografia com `PT` e a dimensão do consumo com o total), e o relatório diz qual e porquê | mensal, índice (base 2025 = 100) | o primeiro da metainformação |
| S4 | `serie-ihpc-variacao-homologa` | Eurostat `prc_hicp_minr`, `unit=RCH_A`, `coicop18=TOTAL`, `geo=PT` | mensal, % | o primeiro do conjunto para Portugal |
| S5 | `serie-ihpc-variacao-homologa-ue` | Eurostat `prc_hicp_minr`, `unit=RCH_A`, `coicop18=TOTAL`, `geo=EU27_2020` | mensal, % | o primeiro do conjunto para a União |
| S6 | `serie-remuneracao-bruta-mensal-media` | INE `0014751`, `geocod=PT`, `dim_3=T`, `dim_4=T` | trimestral, € por mês | o primeiro da metainformação |
| S7 | `serie-pensao-media-anual` | INE `0014532`, `geocod=PT`, `dim_3=T` | anual, € por pensionista por ano | o primeiro da série de 2017 |
| S8 | `serie-beneficiarios-do-rsi-por-mil` | INE `0013420`, `geocod=PT` | anual, por mil pessoas em idade ativa | o primeiro da metainformação |
| S9 | `serie-linha-de-risco-de-pobreza` | Eurostat `ilc_li01`, `statinfo=MED_EI`, `hhcomp=A1`, `rskpovth=B_60`, `unit=EUR`, `geo=PT` | anual (o ano do inquérito), € por ano | o primeiro do conjunto para Portugal |
| D1 | `serie-cem-euros-de-2015-01` | derivada da S3: `100 × I(2015-01) ÷ I(t)` para cada `t` de janeiro de 2015 em diante | mensal, euros | 2015-01 |

O que fica de fora deste bloco e para onde vai: as séries por concelho (o ganho médio, o IRS local, os beneficiários por concelho) para o L2 e para um bloco próprio; os valores legais por ano (o salário mínimo, o IAS, o RSI, as percentagens de atualização das pensões, cada um selado no Diário da República) para o RP2, que é um bloco de documentos e não de APIs; a variação real da remuneração média, como derivação escrita sobre a S6 e a S3, para o RP4 ou para um estudo com pré-registo, porque exige uma regra de deflação trimestral que se fixa antes de ver os números.

## 4 · A linha de série, o rascunho da forma

```yaml
# ledger/series/<id>.yml · uma série por ficheiro; o nome do ficheiro é o id. GERADO pelo motor, nunca à mão.
id: "serie-ipc-variacao-homologa"
name: "<o rótulo com que a fonte publica a série, copiado do corpo alojado>"
name_source: "IndicadorDsg"
unit: "%"
periodicidade: "mensal"            # mensal | trimestral | anual | semestral
source: "INE"
document:
  title: "<o mesmo rótulo>"
  edition: "0014663, geocod=PT, dim_3=T"
  kind: "serie"
  url: "https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0014663&lingua=PT"
source_url: "<o endereço do pedido registado>"
access_date: "2026-09-27"
published_at: "2026-09-10"
excerpt: "<o literal da série: o rótulo e as coordenadas como a resposta os escreve>"
primeiro_periodo: "1992-01"
ultimo_periodo: "2026-08"
lacunas: []                        # [{ periodo, razao }] onde a fonte não publica um ponto na cadência
pontos:
  - { periodo: "1992-01", valor: "…", excerto: "{ … o objeto literal da resposta … }", bandeira: null }
  - { periodo: "2026-08", valor: "3,30", excerto: "{ \"geocod\" : \"PT\", … \"ind_string\" : \"3,30\", \"valor\" : \"3.3\" }", bandeira: null }
derivation: null                   # a conta em palavras, numa série derivada
derivation_en: null
derived_from: []                   # os ids das séries de origem
check: null                        # a expressão recomputada ponto a ponto, numa série derivada
attributed_to: ["INE"]
study: "dominios-2026"
note: "[note do motor] …"
corrections: []                    # [{ periodo, antes, depois, data, razao, fonte }] por ponto mudado
```

As regras que o README fixa a partir daqui: o `valor` é uma cadeia com um algarismo, na forma da fonte, nunca um número; o `periodo` na forma da casa (`AAAA`, `AAAA-MM`, `AAAA-Tn`, `AAAA-Sn`), crescente e sem repetição; cada `excerto` contém o `valor` literalmente; uma série derivada tem `derivation`, `derived_from` e `check` os três, e nenhum `excerto` por ponto (os seus pontos provam-se pela conta); a `bandeira` é a da fonte (`&` com a nota «Dado provisório» no INE; as bandeiras do Eurostat pelo seu vocabulário) e rende-se com a palavra que o `Claim` já rende; o campo `serie` de uma linha escalar nomeia uma série existente com a mesma edição e unidade.

## 5 · O que não se faz

Nenhum gráfico neste bloco. Nenhuma página do leitor além dos recibos das séries. Nenhuma série por concelho. Nenhum valor de documento, comunicado ou portal sem API. Nenhuma estimativa própria a preencher um ponto que a fonte não publica: uma lacuna declara-se. Nenhuma base de gráfico decidida aqui. Nenhuma mudança às linhas escalares além do campo `serie`. Nenhuma linha escalar apagada. Nada nos ficheiros do motor que não se tocam (`indicators/availability.json`, `indicators/vintages.json`, `.maintenance-locks/`, `sweeps/`, `publisher/recortes/manifest.regioes.json`). Nenhum `push`.

## 6 · As regras de sempre

As do `CLAUDE.md` do projeto e do mapa do repositório: caminhos explícitos nos commits; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de ficheiro; entre commits só as conferências que a mudança toca; a regra de paragem (só um portão que protege um número, uma fonte ou uma pessoa faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta); o relatório escrito também quando se para a meio; uma construção de cada vez na máquina; a leitura a frio de outra família, com cinco estragos plantados só nas cópias do pacote; o custo dito em símbolos e em segundos, e nunca em euros estimados.

## 7 · As decisões do lugar de direção que este brief fixa, e porquê

1. **Uma linha por série, com os pontos dentro, e não uma linha por ponto.** Uma linha por ponto seguia o idioma da casa, mas custava duas páginas de recibo por ponto (perto de mil linhas só para as nove séries, e as células e os cartões a lerem cada uma), e dava ao leitor um recibo por «o IPC de agosto de 2016» que ninguém quer ler; o recibo que serve é o da série inteira, com a tabela dos pontos e um pedido. O preço é a máquina nova (`ledger/series/`, `series.mjs`, as células S, o exportador), que fica isolada das vinte e uma regras das linhas escalares: nada nelas muda.
2. **A identidade da série é explícita** (o id, as coordenadas na edição), e nunca inferida do padrão do identificador nem da edição e unidade, porque o §0 mediu que a inferência mistura a União com Portugal em 28 famílias.
3. **Os pontos vivem no YAML da série**, não num CSV nem num JSON servido à parte: a série é uma linha do livro, cruzada por sha256 como as outras, e o recibo lê-a como lê as outras.
4. **Nenhuma página por ponto.** As séries entram no estudo de dados, sem cartões de partilha, pela mesma razão pela qual as 308 linhas dos concelhos entraram.
5. **A geometria de um desenho conferida por um portão que a recompõe** fica para o RP4, com a sua planta; este bloco dá-lhe as séries e os recibos, e o `data-ponto` como origem de algarismos.
6. **As revisões por ponto**, com a entrada tipada da V16 a nomear o período, e o `vintages.json` do corredor diário intacto.
7. **A gramática dos períodos ganha o trimestre e o semestre nas séries**, e a lógica do período anterior das linhas escalares fica como o RP1 a deixou (a tabela declarada).
8. **Leitores novos, ao lado dos existentes**, para que as linhas escalares do RP1 continuem a ser lidas pelos leitores que o RP1 provou.
9. **O corpo grande fica em git simples abaixo de um teto medido**; o teto entra em `buscar()` com a planta, e um corpo acima dele é um caso para o arquivo de versões do corredor, não para este bloco.
10. **O excerto por ponto é o objeto literal da resposta**, como o RP1 já faz por célula, e o excerto da série é o rótulo com as coordenadas: assim cada ponto se prova sozinho.
11. **A derivação de prova é «cem euros de janeiro de 2015»**, porque tem um só ponto de base e uma conta que um leitor faz de cabeça; a base do gráfico e a série real da remuneração decidem-se com a regra escrita antes de ver os números.
