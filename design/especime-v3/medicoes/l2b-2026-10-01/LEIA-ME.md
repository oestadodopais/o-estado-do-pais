# L2b · o concelho entre os 308: relatório do construtor

*Bloco L2b, 01.10.2026, pelo brief `design/observatorio/BRIEF-L2b-o-concelho-entre-os-308.md`, pela §1.143 e pela §1.149, com a §1.140 como modelo. Construtor: Claude Opus 5.5 (a definição `construtor`), na worktree do ramo `l2b-2026-10-01`, sobre o commit do brief, `9b41123a`. Cada número deste relatório está num ficheiro desta pasta, quase todos em `medidas.json`, escrito por `medir-l2b.mjs`, com o comando e um conhecido-positivo em cada medida. Sem travessões.*

*A passagem L2b-b, no fim, tirou a faixa às quatro contagens, pela decisão do lugar de direção sobre a §1.143(4); as secções até lá descrevem o bloco na cabeça do seu relatório, `cc067e56`, com as oito faixas por página.*

## O teste de aceitação, e onde se mede

O do §2 do brief, ponto por ponto:

| o que o teste pede | onde se mede | resultado |
|---|---|---|
| na página de cada um dos 308 concelhos, nas duas edições, cada cartão de uma medida com linhas para os 308 leva uma faixa | a FC0 e a FC1 da célula nova (`tests/municipio/faixa-do-concelho.mjs`, no `check:navegacao`, que corre no `build` e no `verify`) e `medir-l2b.mjs`, que lê o `dist/` por conta própria | 616 páginas e 4928 faixas, oito por página; a nona medida com linhas para os 308, o limite legal da dívida, não tem cartão na página (ver abaixo) |
| o valor do concelho | a FC3 (a marca e o rótulo do concelho na posição do valor) e a FC4 (o valor na frase é a linha do cartão) | 4906 faixas com o valor e o lugar; 22 sem valor publicado (a dívida, o índice e o prazo de Penedono, e o prazo de outros oito concelhos, nas duas edições), que dizem que não têm lugar |
| o valor de Portugal como referência, a linha nacional da mesma medida e do mesmo período, e, quando não existe, a faixa di-lo e não inventa uma | a FC5, com a linha de Portugal achada pelo leitor dos portões (a mesma edição do documento, a mesma unidade e o mesmo período, com Portugal no localizador); o portão de HTML só aceita na faixa essa linha | 616 faixas com a linha nacional (o ganho médio, 1 576,0 euros por mês em 2024), 616 com a base do índice (o poder de compra) e 3696 que dizem «Sem comparação com Portugal no mesmo período.» |
| o lugar entre os 308, contado na vista como a faixa da União conta, com a direção dita no cartão | o portão de HTML reconta cada `data-concelho-lugar`, `data-concelho-conta` e `data-concelho-a-par` das linhas; a FC4 recompõe a frase; `medir-l2b.mjs` reconta tudo outra vez, com um terceiro leitor | 0 lugares diferentes da recontagem independente, em 4906; Évora em 35.º no ganho médio, Penedono em 308.º |
| as 308 marcas na régua e a do concelho destacada | a FC2 (uma marca por concelho com valor, cada uma na posição que o valor dá, com quatro casas) e a FC3 | 1511048 marcas refeitas dos valores pela célula, em 4928 faixas |
| cada número da faixa resolve numa linha | o portão de HTML (as três origens novas e a regra do selo da faixa) e a K10 do `check:cartao` (a linha de Portugal listada no recibo da linha do concelho) | os três portões, abaixo; 616 recibos do ganho com Portugal em «O enquadramento» |
| a leitura breve diz, para o ganho médio, se está acima ou abaixo de Portugal, lido das linhas | a P1 do `check:lugares` reconta a palavra e exige as duas linhas na leitura, nas 616 páginas | Évora e Penedono, nas duas edições: «abaixo de Portugal» com as duas linhas seladas |
| as duas réguas à mão procuram o mapa em «Lugares» | a secção do ponto 4, abaixo | a `correcoes-c.mjs` sim, e corre a 0; a `matriz.mjs` não: parei nesse ponto, e digo porquê |
| uma célula prova a faixa, com plantas (um lugar errado, uma referência de outro período, uma marca a menos) | `navegacao.json` | 14 plantas da célula, as três do brief entre elas, todas a morder; e 5 do portão de HTML, todas a morder com os bytes repostos |
| os três portões a 0 | `portoes/` (a corrida final, na cabeça do commit deste relatório, `cc067e56`) e `portoes-intermedio/` | `build` 0, `verify` 0 e `typecheck` 0 na corrida final; ver a secção dos portões |
| as capturas de Évora e de um concelho pequeno nas cinco larguras e nas duas edições | `capturas-depois.json` e `capturas-antes.json` | 20 capturas depois e 8 antes, 0 problemas |

## O mandato, ponto por ponto

| # | o que | como ficou | a medida |
|---|---|---|---|
| 1 | A faixa do concelho | `src/components/lugar/FaixaDoConcelho.astro`, rendido por `CartaoDoLugar.astro` depois da régua e antes da frase; o resolvedor `src/lib/faixa-do-concelho.mjs` conta o lugar na vista a partir das 308 linhas, uma vez por medida e por construção (a conta feita por cartão eram quase cinco mil leituras das linhas); as marcas dos concelhos com valor num só caminho de SVG, o concelho como ponto a tinta com o nome por cima, Portugal como traço a tinta com o nome por baixo, sem cor; duas frases, a do lugar e a da comparação, pelas cadeias de `strings.mjs` (`municipio.faixaDoConcelho`) nas duas línguas; `linhasPorConcelho()` passa a servir as oito chaves | 4928 faixas; 0 lugares diferentes da recontagem independente |
| 2 | Que medidas | as oito que têm cartão: a população, o poder de compra, o desemprego registado, as empresas, a dívida, o índice de dívida, o prazo médio de pagamento e o ganho médio; a ordem e a comparação de cada uma numa tabela com a razão escrita (`src/data/faixa-do-concelho.mjs`), e não no componente | a tabela abaixo: 8 medidas, 2 contadas do mais baixo, 1 com linha nacional, 1 com a base do índice, 6 sem comparação |
| 3 | A referência na leitura breve | `src/lib/lugar.mjs` acaba a leitura, nos 308 e na de Évora, com «O ganho médio mensal é de 1 484,5 euros por mês, abaixo de Portugal, onde é de 1 576,0 euros por mês.» (os dois valores selados, a palavra do lado escolhida pelos dois, nas duas línguas); a P1 do `check:lugares` reconta-a | as leituras de Évora e de Penedono, nas duas edições, dizem «abaixo de Portugal» com as duas linhas (4 medidas a 1 em `medidas.json`) |
| 4 | As réguas à mão | a `correcoes-c.mjs` mudou para «Lugares» e corre a 0 (12 réguas em 12); as outras cinco rebentam antes e depois do bloco, nas mesmas linhas | ver a secção do ponto 4 |
| 5 | As células | a célula FC no `check:navegacao`, a K1 e a K10 do `check:cartao`, a P1 do `check:lugares`, as três origens novas do portão de HTML e a H2 do `check:alvos`, cada uma com a sua planta | 14 plantas da célula, 5 do portão, 1 da K1 e 1 da H2, todas a morder |
| 6 | O relatório | este ficheiro, `medidas.json` por `medir-l2b.mjs`, as capturas em `design/especime-v3/capturas/l2b-2026-10-01/` | completos, com os códigos da corrida final dos portões |

## A tabela das ordens e das comparações (as direções)

Lida de `src/data/faixa-do-concelho.mjs`. Nenhuma frase diz «melhor» ou «pior»: a faixa diz a ordem por palavras («do mais alto para o mais baixo» ou «do mais baixo para o mais alto»), porque a casa não julga o que nenhuma fonte julgou (§1.130).

| medida | conta-se | porquê | compara-se com | porquê |
|---|---|---|---|---|
| população residente | do mais alto | é uma contagem de pessoas: o lugar diz o tamanho do concelho e não um juízo | nada | não há linha de Portugal do mesmo indicador do INE em 2025; e a população do país é a soma dos 308, que não se compara com a de um concelho |
| poder de compra por habitante | do mais alto | um índice maior é mais poder de compra por pessoa, face à média do país | a base do índice | a unidade de cada uma das 308 linhas escreve «índice (Portugal = 100)»: o valor de Portugal na mesma medida e no mesmo período é a base, e não há linha nacional à parte |
| desemprego registado | do mais alto | é uma contagem de pessoas inscritas, que cresce com o tamanho do concelho | nada | não há linha de Portugal do mesmo ficheiro do IEFP em dezembro de 2025; e um total do país não se compara com o de um concelho |
| empresas não financeiras | do mais alto | é uma contagem de empresas, que cresce com o tamanho do concelho | nada | não há linha de Portugal do mesmo indicador do INE em 2024; e um total não se compara |
| dívida total da câmara | do mais alto | é um total em euros, que cresce com o tamanho da câmara | nada | não há linha de Portugal da série da Direção-Geral das Autarquias Locais de 2024; e a dívida das câmaras do país não se compara com a de uma |
| índice de dívida | do mais baixo | um índice maior é uma dívida mais perto do limite que a lei fixa, ou acima dele | nada | o índice mede cada câmara contra o seu próprio limite, e não há linha de Portugal deste índice |
| prazo médio de pagamento | do mais baixo | mais dias é pagar mais tarde aos fornecedores | nada | não há linha de Portugal da lista da Direção-Geral de dezembro de 2025 |
| ganho médio mensal | do mais alto | um ganho maior é mais dinheiro por mês para quem trabalha por conta de outrem a tempo completo | a linha nacional `ganho-medio-mensal-2024` | o mesmo indicador do INE (`0012656`), a mesma unidade e o mesmo ano das 308 linhas, conferidos na construção e pelos portões |
| limite legal da dívida | sem faixa | não tem cartão na página do concelho: entra no cálculo do índice e no cartão das câmaras em «Lugares», e o brief manda a faixa «nos cartões que já existem» | | |

## Os pontos onde parei ou decidi, e porquê

**O ponto 4 está errado no brief, medido, e parei nele.** O §0 diz que, das seis réguas à mão, duas procuram o mapa ou a pesquisa na primeira página, e a medida pedida é «as seis a correr a 0 à mão». Medido na construção de base (`reguas-antes/`) e depois do bloco (`reguas-depois/`), com os códigos escritos depois de cada processo acabar:

- as seis falham na base: `correcoes-a.mjs` rebenta na linha 536, `lista.mjs` na 560, `mapa-distritos.mjs` na 501 e `mapa-unidades.mjs` na 439, todas na primeira vez que procuram o mapa da primeira página, que saiu de lá no L2a; o guião do §0 procurava só `pp-lugares`, `/#mapa` e `pesquisa-bloco`, e não as viu;
- a `matriz.mjs` dá 31 células verdes e 20 vermelhas e rebenta na linha 1090, na ficha do mapa da primeira página; as 20 vermelhas medem coisas que a primeira página perdeu antes do L2a (os estados `?ambito=` e `?densidade=`, a faixa do relance, a ordem do teclado pela faixa, as leituras dos painéis), e não o mapa;
- a `correcoes-c.mjs` rebentava na linha 130, a ler o índice dos concelhos, que deixou de ser construído.

A `correcoes-c.mjs` mudou para «Lugares», na forma que a página tem (o formulário vem do servidor e, sem guião, não procura; os 308 resultados vêm numa lista escondida, cada um com a porta da sua página; a lista por distritos é a gaveta dos 29; no navegador, escrever «evora» e «beja» acende o concelho e abre a página dele), e corre a 0, com 12 réguas em 12. Levar as outras cinco a 0 é retirar ou repor, uma a uma e com a razão escrita, dezenas de células de réguas que medem uma primeira página que já não existe; é um bloco à parte, e nenhuma destas réguas está num portão (a decisão 3 da §1.150 di-lo). Não mexi na `matriz.mjs`: uma mudança nas células do mapa e da pesquisa ficava por provar, porque a régua rebenta antes de lá chegar. Depois do bloco, as cinco rebentam exatamente nas mesmas linhas, com as mesmas 31 e 20 células na matriz.

**As contagens e a §1.143(4).** A decisão 4 da §1.143 diz do L2 que «as posições calculadas são linhas «calculado» do livro-razão, e nunca sobre contagens». O brief revê a primeira metade (§5, decisão 1: o lugar conta-se na vista) e enumera as nove medidas, contagens incluídas (a população, o desemprego registado, as empresas, a dívida e o limite). Segui o brief, porque a enumeração é o centro do mandato e não uma frase solta, mas com a ordem das contagens e dos totais dita como ordem, do mais alto, sem juízo e com a razão na tabela; contadas do mais baixo, as câmaras mais pequenas ficavam à frente por serem pequenas. Fica para o lugar de direção: se a segunda metade da §1.143(4) vale, tirar a faixa das contagens é tirar cinco entradas da tabela (a K1 e a FC leem a tabela, e acompanham).

**O poder de compra compara-se com a base do índice.** Não há linha nacional do poder de compra, e a regra do brief daria «Sem comparação com Portugal» por baixo de uma unidade que diz «índice (Portugal = 100)» e de uma leitura do lugar que já o compara com a média do país pela mesma base (`baseDoIndice`, que a C4 do `check:lugares` confere nas 308 linhas). A base não é outro período nem um valor inventado: é o valor de Portugal da mesma medida e do mesmo período, escrito pela fonte na unidade de cada linha. A faixa marca o traço de Portugal na base e diz «Está acima de Portugal, que é a base do índice.», sem escrever o número, que a unidade do cartão já escreve. Se o lugar de direção ler a regra à letra, é uma entrada da tabela (`comparacao: null`).

**O valor de Portugal sem uma segunda marca no cartão.** A decisão de 15.09.2026 dá a cada cartão uma marca da fonte, e a K10 exige que o recibo da linha do cartão liste em «O enquadramento» cada linha que o cartão cita sem marca própria. A faixa escreve o valor de Portugal assim, dentro do invólucro `data-selo-em` do cartão, e o recibo de cada linha do ganho médio passou a listar «Portugal, no mesmo período» com o valor, a marca e o período (616 recibos, nas duas edições). O portão de HTML aceita na faixa só a linha do cartão e a linha de Portugal que ele próprio acha para ela.

**A H2 do `check:alvos` na corrida intermédia.** O `verify` intermédio saiu com 1 numa célula só, a H2: 4 selos em caixa perderam os 44 px de toque entre 641 e 1023 px (o menor com 26.8 px de altura). Eram os da leitura de Évora: a frase do ganho pôs quatro selos em linhas vizinhas do mesmo parágrafo, e a área de um cruzava a do seguinte. É o caso que a H2 já conta à parte para a leitura do país e para as sinopses (prosa corrida, I127), e a leitura do lugar entrou na mesma classe, com um estrago que tira a classe à leitura de Évora, com a mesma folha, e faz a H2 cair, sozinha (`alvos-estrago-leitura-do-lugar.json`). Antes de achar a causa pus `pointer-events: none` no desenho da faixa; a sonda (`sonda-toque.mjs`) mediu depois as 16 marcas dos cartões de Évora a 390 e a 768 px, com a regra e sem ela, e as 16 respondem nos dois casos: a regra ficou como precaução, e o comentário da folha di-lo assim.

**Évora vem de outra tabela do INE na população e nas empresas.** As outras 307 linhas da população são do indicador `0012917` e a de Évora do `0012918`; nas empresas, `0014061` e `0014063`. As duas tabelas cruzam a mesma estimativa por variáveis diferentes, e o total é o mesmo número da mesma estatística: inferido dos títulos, e não verificado na fonte neste bloco. A faixa ordena-as juntas, pela chave do cartão.

**O concelho pequeno é Penedono**: 2 506 pessoas, o ganho médio mais baixo dos 308 (308.º), e três cartões sem valor publicado (a dívida, o índice e o prazo, e por isso sem lugar; dizia «quatro», corrigido na passagem L2b-c), que é onde a faixa mostra os ramos que Évora não mostra.

**O peso.** A página de Abrantes passou de 21206 para 58530 bytes, a de Évora de 78684 para 115366 e a de Penedono de 19956 para 56051; a construção inteira, de 161265223 para 184717904 bytes, com as mesmas 7467 páginas. As marcas vão num só caminho de SVG por faixa: em elementos soltos, eram 1511048 elementos.

## As réguas e os portões que mudaram de forma, o que protegem, e a planta de cada uma

| régua | classe | a forma nova | o que conserva | plantas |
|---|---|---|---|---|
| `gate:html`, as origens da faixa do concelho | P | `data-concelho-conta`, `data-concelho-lugar` e `data-concelho-a-par` aceitam-se pelo caminho do `data-ponto-lugar` da faixa da União: o texto tem de ser a recontagem das linhas pelo leitor próprio dos portões (`scripts/concelhos-do-portao.mjs`), que lê o ficheiro do motor, o YAML e a tabela declarada, e liga o ganho pelo código do INE do localizador | nenhum algarismo sem origem conferida; o conhecido-positivo fecha a construção se as páginas não renderem lugares, contagens e valores de Portugal | 3: um lugar errado, uma contagem errada, um empate errado (`plantas-portoes-l2b.json`) |
| `gate:html`, `auditaSelo()` | P | um valor na faixa passa sem marca própria só se for a linha do cartão ou a linha de Portugal que o portão acha para ela, e só com a marca do cartão para a sua linha | cada valor com a porta para a sua linha | 2: uma linha que não é a de Portugal, e a faixa sem a porta do cartão |
| `check:cartao`, K1 | M | a faixa do concelho é a sexta coisa só num cartão de concelho de uma medida da tabela, e uma vez | as cinco coisas e só elas nos outros cartões | 1: a faixa num cartão nacional (a prova do `check:cartao` viu 15 estragos em 15) |
| `check:cartao`, K10 | P | o valor do próprio cartão dentro da faixa não entra nas linhas de enquadramento; a linha de Portugal entra, e o recibo tem de a listar | a porta que a marca única paga | a FC6 da célula nova (o recibo sem Portugal) |
| `check:lugares`, P1 | P | reconta também a palavra do ganho médio contra Portugal, com a linha nacional pelo leitor dos portões, e exige as duas linhas, nas duas formas da leitura | uma palavra trocada sobre uma câmara é uma afirmação falsa | o conhecido-positivo: 616 leituras com o ganho recontado |
| `check:navegacao`, a célula nova `tests/municipio/faixa-do-concelho.mjs` | P nos lugares, nas contagens, nas posições e na linha de Portugal; M na forma | FC0 a FC7: as faixas em cada cartão das oito medidas, as marcas, o concelho, a frase, a comparação, o recibo e o ordinal inglês contra uma tabela escrita à mão | o lugar entre os 308, contado das linhas, e a referência do mesmo período | 14, todas a morder (`navegacao.json`) |
| `check:alvos`, H2 | M | os selos da leitura do lugar contam como prosa corrida | os alvos em caixa continuam a precisar dos 44 px na faixa dos 641 aos 1023 | 1, a morder (`alvos-estrago-leitura-do-lugar.json`) |
| `check:voz`, o inventário | M | 10 cadeias novas, com a revisão do bloco «por ler» em `critica/REVISOES-DO-INVENTARIO.md` | cada frase do projeto declarada | as do portão, sem mudança |
| `tests/municipio/correcoes-c.mjs` | M | o C4 mede a pesquisa dos 308 em «Lugares» | a pesquisa à vista no primeiro ecrã a 390, a lista dos 308 com as portas, e a busca viva | corre a 0; não é portão |

As plantas da célula, pelo nome: um lugar errado, uma referência de outro período (a linha de Portugal passa a ser de outro ano nas linhas que a célula lê, e a página continua a compará-la), uma marca a menos, a marca do concelho fora do sítio, a palavra do lado trocada, o traço de Portugal fora do sítio, a faixa tirada de um cartão, a ordem trocada, a contagem trocada, um empate inventado, o recibo sem Portugal, um lugar a quem não tem valor, o empate tirado da frase, e o ordinal inglês sem a exceção dos 11 a 13. Cada uma corre sobre uma cópia em memória, com o controlo das mesmas páginas intactas a passar.

## Os commits

- `aec74dd5` a tabela das ordens e das comparações com Portugal, e o resolvedor da faixa do concelho
- `50aed5dd` a faixa do concelho em cada cartão das oito medidas, e os portões que a recontam
- `71de60e0` a leitura do concelho diz o ganho médio acima ou abaixo de Portugal, com as duas linhas
- `1e0279ca` as dez cadeias novas da faixa e da leitura no inventário da voz, com a revisão por ler
- `06032c8e` as cinco plantas do portão de HTML nas origens da faixa, com os bytes repostos
- `9fe85b64` a régua `correcoes-c` procura a pesquisa dos 308 em «Lugares», e corre a 0
- `68afe391` o desenho da faixa deixa passar o toque, e um pouco mais de ar por cima dele
- `e93f387b` a H2 do `check:alvos` conta os selos da leitura do lugar como prosa corrida, com o estrago
- `7bf04171` a secção do L2b no mapa do repositório, e as citações que as linhas novas empurraram
- `7de721c7` a frase do ganho diz o valor de Portugal depois de «onde é de», sem parêntese órfão
- o commit deste relatório, da resposta curta, das medidas e das provas; e o seguinte, com os códigos e os registos da corrida final dos portões

## Os portões

A corrida intermédia, por `scripts/leituras/portoes.sh` (a tranca da máquina), na cabeça `9fe85b64` (`portoes-intermedio/`): `build` 0 em 126 s, `verify` 1 em 477 s (a H2, acima, e o `verify` para no primeiro vermelho), `typecheck` 0. Depois dela, cada conferência que a mudança tocou correu sozinha, com os códigos em ficheiro: a `check:alvos` a 0 com a H2 nova, o estrago dela a morder, e o `build` inteiro a 0 na cabeça `7de721c7`, a do código final.

A corrida final, pelo mesmo guião, na cabeça `cc067e56`, a do commit deste relatório e da resposta curta (`portoes/cabeca`, e a mesma em `portoes/cabeca.fim`, com a árvore limpa no fim em `portoes/estado.fim`): `build` 0 em 125 s, `verify` 0 em 724 s, `typecheck` 0 em 0 s, cada código lido do seu ficheiro. Os registos estão ao lado, com os caminhos da máquina trocados por marcas. O commit que os traz só acrescenta ficheiros desta pasta: os de `portoes/`, `medidas.json` reescrito por `medir-l2b.mjs` a lê-los (só as seis medidas dos portões mudam) e esta secção.

## As capturas

Em `design/especime-v3/capturas/l2b-2026-10-01/`: `depois-<evora|penedono>-<pt|en>-<largura>.png` nas cinco larguras, sobre a construção da cabeça `7de721c7`, e `antes-<evora|penedono>-<pt|en>-<390|1280>.png`, sobre a construção da cabeça de base `9b41123a`, guardada fora do repositório. Os manifestos guardam o resumo sha256 de cada imagem e as medidas de cada página: nenhum transbordo, nenhum pedido para fora, e as oito faixas dentro do cartão em todas as larguras. A 390 px, a página de Évora passa de 8806 para 9959 px de altura e a de Penedono de 2016 para 3189.

## As decisões em vigor nos ficheiros tocados

Antes de mexer, `decisoes-em-vigor-antes.txt` (41 decisões citadas em 19 ficheiros); no fim, `decisoes-em-vigor.txt`, pelo intervalo do bloco, e `decisoes-em-vigor-perto-do-codigo.txt`, só as citações perto do que mudou fora desta pasta. Nenhuma saiu do diff. As que tocam o que o bloco fez ficam todas em vigor: a §1.140 (a faixa da União é o modelo, e nada nela mudou; a K14 e a ressalva da comparação com a União ficam como estavam); a §1.124 (a média da União no cartão da sobrecarga, com a ressalva, intacta); a §1.130 (nenhuma palavra de juízo onde nenhuma fonte julgou: a ordem diz-se e não se julga); a §1.3 (o período de uma linha calculada lê-se das origens, como no índice de Évora); a §1.138 (nenhum nome em página nenhuma); a §1.149 (o mapa de «Lugares», onde a régua `correcoes-c.mjs` passou a medir a pesquisa); a §1.143 (uma coisa, um lugar: a faixa não leva porta nenhuma, e o ponto da segunda metade da decisão 4 está acima). A §1.150, que este ramo cita na régua `correcoes-c.mjs` (as decisões 3 e 4), está no ramo `registos-2026-10-01c` e ainda não neste `DECISIONS.md`; o guião di-la «sem título» por isso.

## O custo

Símbolos: 764496 até ao início deste relatório, a diferença entre as duas leituras do contador de símbolos restantes que a ferramenta mostra ao agente, guardadas em `custo-inicio.json` (na primeira mensagem da sessão) e `custo-fim.json` (ao começar a escrever este relatório, antes da corrida final dos portões). Segundos de parede no mesmo intervalo: 5696, das duas horas guardadas nos mesmos ficheiros. Os segundos dos portões estão acima. Modelo: Claude Opus 5.5 do princípio ao fim, sem subagentes.

## O que ficou por fazer

- **As cinco réguas à mão** que medem a primeira página antiga (o ponto 4, acima): um bloco à parte, para retirar ou repor as células com a razão escrita.
- **A decisão do lugar de direção** sobre as contagens (a §1.143(4)) e sobre a base do índice no poder de compra: cada uma é uma entrada da tabela.
- **A leitura a frio** pelo Codex, e a entrada `l2b` em `critica/REVISOES-DO-INVENTARIO.md`, que está «por ler».
- **Uma citação do mapa do repositório**, na secção do PP1, aponta para `tests/inicio/pesquisa-da-primeira.mjs`, que o L2a mudou de nome; não lhe mexi, porque descreve outro bloco. As outras 154 citações conferem à linha (`conferir-mapa.txt`), com as que as linhas novas do L2b empurraram já acertadas.
- **A região e o distrito** como referência ficam para depois, como o brief decide (§5, decisão 2).

## L2b-b · só as taxas e os rácios têm faixa, 01.10.2026

*As decisões do lugar de direção sobre os dois pontos deixados pelo L2b: a §1.143(4) manda, e o brief estava errado ao enumerar as contagens; o poder de compra compara-se com a base do índice, e fica. Construtor: Claude Opus 5.5, na mesma worktree e no mesmo ramo, sobre `fd85903a`. Os registos da passagem estão em `l2b-b/`, e as medidas em `l2b-b/medidas.json`, escrito por `l2b-b/medir-l2b-b.mjs`; as do L2b ficam em `medidas.json`, como estavam.*

- **A tabela diz, por medida, se o cartão leva a faixa e porquê** (`src/data/faixa-do-concelho.mjs`: `faixa` e `porqueAFaixa`). Têm faixa as quatro taxas e rácios, o índice de dívida, o ganho médio mensal, o poder de compra e o prazo médio de pagamento; não a têm as quatro contagens, a população, o desemprego registado, as empresas e a dívida em euros, porque uma contagem não se ordena e o lugar só diria o tamanho do concelho (§1.143, decisão 4, agora citada na tabela). O resolvedor devolve `null` para uma medida sem faixa, e esses cartões ficam como estavam antes do L2b.
- **Os portões e a célula, com uma planta de cada lado.** O leitor dos portões só faz a conta das medidas com faixa, e o portão de HTML recusa uma marca de lugar numa contagem, com a razão (planta `l2b-b-portao-lugar-numa-contagem`); a regra do selo da faixa só vale numa medida com faixa. A K1 recusa a faixa no cartão de uma contagem (planta 14 da prova do `check:cartao`). A célula FC exige a faixa nas quatro taxas e rácios e a ausência dela nas quatro contagens: a planta `l2b-faixa-tirada-de-um-cartao` tira a do ganho, e a planta `l2b-b-faixa-numa-contagem` põe uma no cartão da população; as duas mordem na FC1.
- **O que a construção da cabeça `1a747a32` rende:** 2464 faixas, 616 em cada uma das quatro medidas; 2464 cartões de contagem, com 0 faixas; 2444 lugares, com 0 diferentes da recontagem independente; 20 faixas sem valor publicado, que dizem que não têm lugar; 1232 que dizem «Sem comparação com Portugal no mesmo período.» (o índice e o prazo); 752752 marcas refeitas dos valores pela célula.
- **As plantas:** 15 da célula, todas a morder, e 78 do `check:navegacao`, todas a morder; 16 estragos plantados na prova do `check:cartao` e 16 vistos; 6 do portão de HTML, todas a sair com 1 e a mordida esperada, com os bytes repostos.
- **O mapa do repositório:** a citação da secção do PP1 aponta para `tests/inicio/lugares-no-navegador.mjs`, o nome que o L2a deu ao ficheiro, e a secção do L2b diz a regra das contagens; 156 citações conferidas à linha, 0 longe e 0 perdidas (`l2b-b/conferir-mapa.txt`).
- **O peso, antes e depois desta passagem:** a página de Abrantes passa de 58530 para 39023 bytes, a de Évora de 115366 para 95923 e a de Penedono de 56051 para 36837; a construção inteira, de 184717904 para 172657105 bytes, com as mesmas 7467 páginas (`l2b-b/bytes-antes.json`, medido na construção de `cc067e56` antes de mexer).
- **As capturas**, refeitas nas cinco larguras e nas duas edições sobre a construção de `1a747a32`, como `l2b-b-<evora|penedono>-<pt|en>-<largura>.png` na mesma pasta das capturas, com o manifesto em `l2b-b/capturas.json`: 20 capturas, 0 problemas e 0 faixas nas contagens; a 390 px, a página de Évora mede 9435 px de altura e a de Penedono 2645. As capturas do L2b ficam como estavam.
- **As decisões em vigor** nos ficheiros que a passagem tocou: 27 decisões citadas em 8 ficheiros, lidas antes de mexer (`l2b-b/decisoes-em-vigor-antes.txt`). A §1.130 (nenhuma palavra de juízo) e a §1.140 (a faixa da União como modelo) ficam; a §1.143(4) é a que esta passagem aplica.

**Os commits da passagem:** `6ede3c92` (a tabela e o resolvedor), `c45d0f5a` (os portões, a K1, a célula e as plantas), `a74049c4` (o mapa do repositório), `1a747a32` (o captor com a fase da passagem), o commit desta secção, das medidas, das provas e da resposta curta, e o seguinte, com os códigos dos portões.

**Os portões:** por `scripts/leituras/portoes.sh` (a tranca da máquina), na cabeça `bfa7c3b2`, a do commit desta secção e da resposta curta (`portoes/l2b-b/cabeca`, e a mesma em `portoes/l2b-b/cabeca.fim`, com a árvore limpa no fim em `portoes/l2b-b/estado.fim`): `build` 0 em 121 s, `verify` 0 em 714 s, `typecheck` 0 em 1 s, cada código lido do seu ficheiro, com os registos ao lado e os caminhos da máquina trocados por marcas. As medidas da passagem, relidas na construção desta corrida, só mudam nos códigos e nos tempos dos portões e na cabeça da construção (as páginas são as mesmas: o peso de cada uma e o da construção inteira não mudaram). O commit que os traz só acrescenta ficheiros da pasta do bloco.

**O custo:** os símbolos desta passagem ficam por medir aqui. O contador que a ferramenta mostra ao agente ficou em 14177781 em todas as chamadas da passagem, desde a chegada da mensagem do lugar de direção, e a diferença entre as duas leituras não é o custo (`l2b-b/custo-inicio.json` e `l2b-b/custo-fim.json` dizem-no); o lugar de direção tem o total que a ferramenta reporta para o agente. Os segundos de parede, da chegada da mensagem ao começo desta secção: 807, das duas horas guardadas nos mesmos ficheiros. Modelo: Claude Opus 5.5, sem subagentes.

**O que fica:** as cinco réguas à mão que rebentam desde o L2a, para um bloco à parte; a leitura a frio.

