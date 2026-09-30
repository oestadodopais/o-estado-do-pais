# N1 · Uma porta por assunto

Construção de 30.09.2026, no ramo `n1-2026-09-30`, por Codex `gpt-6-astra`. Base: `2cbc5cc46327697469347b98a2445494027861f4`.

**Estado atual: ver a secção N1d no fim. A nota do §5 resolveu a contagem dos preços.** O teste de aceitação continua incompleto pelo requisito adicional do contador medido na N1b.

**No fecho anterior do N1**, o ponto 5 ficou parado: as duas linhas portuguesas do desemprego continuam em `6`. A organização das portas, a eliminação das cópias, a transferência dos dados municipais e as capturas estão construídas. O brief ainda chamava cinco aos seis cartões de preços existentes; preservaram-se os seis para conservar os 47 cartões nacionais.

## Mandato e medidas

As medidas saem de `node design/especime-v3/medicoes/n1-2026-09-30/medir-n1.mjs`, em [medidas.json](medidas.json). Cada medida atual tem um conhecido-positivo e a sua evidência; a ausência de qualquer um fecha o medidor. O código do medidor diz se a medição e as plantas correram; não declara cumprido o ponto 5.

O §0 do brief foi reproduzido pelo seu guião antes da mudança. As quinze medidas e os quinze conhecidos-positivos do estado anterior estão em [brief-antes.json](brief-antes.json), na cabeça histórica que o próprio guião lê.

| # | Mandato | Resultado medido | Estado |
| --- | --- | --- | --- |
| 1 | Blocos só na primeira página | Cinco blocos por edição, dez portas finais; zero blocos e zero títulos de bloco noutras páginas. `ENTRADAS` já não tem `blocos`. A cópia de um bloco e a cópia apenas do título são recusadas. | Construído |
| 2 | Oito portas e cartões únicos | Sete assuntos com 47 cartões por edição, sem repetição entre assuntos; Lugares é a oitava porta. Dezasseis destinos no mapa do sítio, treze regras 301, zero ligações internas antigas. | Construído; os seis preços estão confirmados no §5 do brief |
| 3 | Temas como índice | Oito portas nos dois índices, com os mesmos nomes, âmbitos e ordem. Temas acrescenta as secções e tem zero cartões inteiros. Um cartão das câmaras em Lugares por edição. | Construído |
| 4 | Retirar os domínios sem perder conteúdo | Dois mapas e duas tabelas de 308 linhas por edição e a ausência T4a em Lugares. No N1, os seis elementos transferidos conservaram o HTML; na N1c, as tabelas e legendas ganham unidades e a barra isolada de Évora sai pelo mandato. | Construído |
| 5 | As duas linhas do desemprego em `6,0` | Os dois excertos dizem `6.0`; os valores continuam `6`. A recontagem para cinco está autorizada; a sua história exige um lugar que esta medida do projeto não tem. | Parado no requisito adicional da N1b |
| 6 | Documentos, provas, custo e capturas | Estrutura e mapa atualizados; mapa com 140 citações conferidas; 90 imagens, nas duas edições e cinco larguras, sem transbordo; relatório, guiões e medidas nesta pasta. | Ver portões e fecho abaixo |

### Repartição dos cartões

| Porta | Cartões por edição | Destinos PT e EN |
| --- | ---: | --- |
| Preços | 6 | `/precos/`, `/en/prices/` |
| Salários, pensões e apoios | 7 | `/salarios-pensoes-e-apoios/`, `/en/pay-pensions-and-benefits/` |
| Pobreza e desigualdade | 4 | `/pobreza-e-desigualdade/`, `/en/poverty-and-inequality/` |
| Emprego | 7 | `/emprego/`, `/en/employment/` |
| Habitação | 6 | `/habitacao/`, `/en/housing/` |
| Educação e saúde | 4 | `/educacao-e-saude/`, `/en/education-and-health/` |
| Estado e economia | 13 | `/estado-e-economia/`, `/en/state-and-economy/` |
| Lugares | 0 nacionais, 1 das câmaras | `/lugares/`, `/en/places/` |

Cada página começa com o âmbito dos números de Portugal; Estado e economia nomeia a justiça. As secções conservam a ordem anterior, com a exceção corrigida na N1c: a habitação abre pelos inquilinos e põe o total a seguir. O «pela mesma ordem» do brief cede à decisão 5 da §1.127. A secção «As contas do Estado» passou a «Contas públicas» para não repetir o título do bloco da primeira página. O componente do cartão não mudou. As áreas de governo são a exceção expressamente preservada pelo ponto 4 do mandato, fora das oito portas e do rodapé.

### Rotas antigas

As nove rotas antigas das entradas e as quatro dos domínios têm regras 301 em `vercel.json`, com e sem barra final, antes de `filesystem`. O dinheiro abre Temas; as outras entradas abrem o assunto correspondente; os domínios abrem Temas. O endereço inglês de Estado e economia já era o atual e não ganha uma regra para si próprio. A célula compara cada origem e destino com uma lista independente, exige o destino construído e recusa a origem construída ou no mapa do sítio. Esta é uma conferência local da configuração e do resultado construído; não houve publicação nem ensaio num lançamento da Vercel.

Os destinos do veredicto e as ligações internas da página da União foram atualizados. O conteúdo e a disposição da União permanecem os anteriores. O valor do salário mínimo na base de doze meses e as atribuições dos valores de referência acompanham as medidas, sem criar cartões inteiros adicionais. A N1c retira as faixas etárias soltas, porque já estavam no texto dos cartões; a formulação anterior de que só o domínio as apresentava estava errada.

## O ponto 5 e a regra de paragem no fecho N1

O ensaio leu a casa decimal dos excertos, acrescentou uma entrada datada com `old_value`, `new_value`, razão nas duas línguas e `kind: correcao`, e passou pelo selador da história dos valores. A razão diz que se repõe a precisão já presente no excerto, sem mudar a quantidade nem alegar uma revisão da fonte.

`ledger:check` recusou o resultado: `correcoes-publicadas.yml`, calculado `5`, publicado `3`. A saída e o código estão em [ensaios/desemprego-correcao.log](ensaios/desemprego-correcao.log) e no ficheiro `.codigo` ao lado. Como esse contador é outro número fora do ponto 5, as duas linhas e a história selada foram repostas. Nesse fecho, o Git confirmou que nenhum ficheiro de `ledger/` diferia da base.

[atualizar-desemprego.mjs](atualizar-desemprego.mjs) conserva o procedimento, mas por omissão só mede e diz que está parado. Não se trocou o tipo para `atualizacao` apenas para fazer o contador passar. Faltava decidir a classificação deste ajuste de apresentação ou autorizar a atualização derivada do contador. A decisão da N1b resolve essa questão; o requisito adicional encontrado está documentado no fim. A primeira página conserva a diferença de precisão entre os dois lados do desemprego.

## Portões que mudaram de forma e plantas

`npm run check:navegacao` corre no `build` e no `verify`. Lê o HTML construído e um catálogo nacional independente da lista usada para renderizar os assuntos. A varredura abrange também páginas fora das portas: um bloco copiado para qualquer outra página é erro, e um cartão nacional fora dos assuntos é erro, salvo as áreas preservadas pelo mandato. As condições declaradas dos blocos mantêm-se.

As 18 plantas desta célula estão individualizadas em [medidas.json](medidas.json): duas de blocos e títulos, dez de cartões, índices, âmbito, câmaras, mapa e redirecionamentos, e seis dos elementos municipais. Incluem o cartão inteiro repetido noutra página, uma linha retirada da tabela e um valor municipal trocado. Todas têm de produzir a queixa da condição estragada.

As seis provas adicionais em [plantas-portoes.json](plantas-portoes.json) exercitam os portões existentes: régua da convergência copiada sem marca, vocabulário indevido do trabalho, data de verificação retirada de um recibo, selo retirado ao cartão das câmaras e destino errado no veredicto nas duas edições. As alterações em disco são repostas e os resumos antes e depois conferidos.

A régua das frases passou com as suas cinco plantas. A geometria e a pesquisa da primeira página passaram com as plantas existentes. A H13 separa agora as 308 portas da pesquisa das 308 portas de cada uma das duas tabelas municipais; a prova da segunda lista usou a planta existente `lista-a-dobrar` e mordeu, com código global 0; a saída está em [ensaios/planta-h13.log](ensaios/planta-h13.log).

A V1 e as células dos cartões leem uma agregação do HTML dos sete assuntos. A V2 lê o cartão das câmaras em Lugares. O F5 mantém as 29 linhas que já protegia e as três datas dos seus 58 recibos nas duas línguas. O teto L1 desceu de 2 349 para 2 337, com a composição em [l1-n1.json](l1-n1.json). A guarda da convergência reconhece agora as nove linhas regionais concretas, para não tomar os valores municipais junto de nove ligações regionais por uma régua da convergência. Nenhuma alteração ao livro-razão, às fontes ou aos valores ficou no ramo.

O primeiro ensaio completo revelou ainda o campo `Afecta` da §1.143 fora do formato admitido pelo livro-razão. O commit separado `f76c5898` repôs o formato do campo e conservou o texto anterior em `Revê`, sem mudar a decisão.

O primeiro `verify` completo chegou ao feixe de desenho e recusou o retrato integral de Lugares: 1 220,3 KiB e 616 elementos SVG `use`. O feixe passou a mostrar um recorte explicitamente identificado, até às portas geográficas; a página real continua inteira. O teto de 596,75 KiB e a proibição de dependências mantêm-se. Três plantas pela função real recusam tamanho excessivo, dependência SVG e imagem externa, e correm agora em cada `design:feixe`. A conferência dirigida passou, com código 0 em [ensaios/feixe.log](ensaios/feixe.log).

## Capturas e inspeção

O guião [captar-n1.mjs](captar-n1.mjs) segue os captores do UE1: servidor local, fontes carregadas, pedidos externos recusados, movimento reduzido e captura integral. São nove páginas, duas edições e as larguras 390, 768, 1 024, 1 280 e 1 600 px.

As 90 imagens estão em `design/especime-v3/capturas/n1-2026-09-30/`. O [manifesto](capturas-n1.json) regista a cabeça construída, o SHA-256 de cada imagem, as caixas, a largura do documento e os cartões. A medição recalcula os 90 resumos. Não encontrou transbordo horizontal, cartões que transbordam nem erros de página.

A inspeção visual incluiu Preços e a primeira página a 390 px em português, Emprego a 390 px em inglês e Lugares a 1 280 px em português. Não se alterou a anatomia do cartão nem a identidade gráfica. As capturas documentam também o ponto 5 ainda por cumprir.

## Portões e cabeça final

Os códigos são lidos dos ficheiros escritos por [correr.mjs](correr.mjs). O guião guarda saída, código, cabeça, início, fim e segundos, retirando os caminhos e o nome da conta local. Cada portão corre no seu comando. Antes das corridas completas, a lista de processos é consultada e não se inicia outra construção concorrente.

<!-- PORTOES-INICIO -->
Corridas completas na cabeça final `70ebf9b64ba9f0a7340f69848cd09146f4d7555b`. Códigos e cabeças lidos dos ficheiros acabados de escrever.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](portoes/build.codigo) | `70ebf9b64ba9f0a7340f69848cd09146f4d7555b` | 85.5 |
| `npm run verify` | [0](portoes/verify.codigo) | `70ebf9b64ba9f0a7340f69848cd09146f4d7555b` | 599.3 |
| `npm run typecheck` | [0](portoes/typecheck.codigo) | `70ebf9b64ba9f0a7340f69848cd09146f4d7555b` | 0.3 |
<!-- PORTOES-FIM -->

Os primeiros resultados estão conservados em `ensaios/primeiro-*`, incluindo a falha do feixe. Depois do commit de fecho, os três comandos correram na cabeça final e os ficheiros de `portoes/` foram escritos de novo. Este relatório, `medidas.json`, `custo.json` e esses comprovativos finais ficam atualizados na árvore de trabalho, fora do último commit: um commit não pode conter um ficheiro que já conheça o seu próprio identificador. A resposta final da sessão lê estes ficheiros e dá a cabeça efetivamente conferida. Não se confunde a cabeça das capturas com a cabeça posterior que só acrescenta documentação e provas.

## Commits

- `f76c5898`: Corrige o campo governado da decisão N1.
- `c22c21e8`: Dá uma página própria a cada assunto.
- `e5143eaa`: Recorta o retrato dos lugares no feixe de desenho.
- `dc5944ae`: Regista as medidas e as noventa capturas do N1.
- `70ebf9b6`: Fecha o relatório parcial e a resposta do construtor N1.

O último commit acrescenta este relatório e `RESPOSTA-construtor-n1.md`. O identificador desse commit lê-se em `git rev-parse HEAD` e nos três ficheiros `.cabeca` da conferência final. Não houve `push`.

## Custo medido

Amostra do construtor a `2026-09-30T10:29:35.535Z`: **25 445 981 símbolos** cumulativos, dos quais 25 333 195 de entrada (24 587 008 em cache) e 112 786 de saída. Entrada sem cache: 746 187. Tempo decorrido até à medição: **5142.4 segundos**.

[medir-custo.py](medir-custo.py) lê apenas os metadados e os contadores das sessões desta árvore. [custo.json](custo.json) distingue o construtor dos revisores automáticos de aprovações. Os símbolos são os tokens cumulativos reportados, incluindo a entrada servida por cache; não são caracteres nem um preço em euros. A amostra é anterior ao fecho da sessão, explicitamente datada, e não finge ser o contador da última mensagem.

## O que faltava no fecho N1

Aplicar o ponto 5 depois de resolver o tipo de atualização ou o contador derivado; reconciliar a menção a cinco preços no brief com os seis existentes; fazer a leitura a frio prevista antes da aterragem. O inventário marca a revisão editorial nova como por ler. Os portões locais verdes não substituem estes pontos nem uma publicação, que não foi pedida a este construtor.


## N1b · Registos anteriores e requisito adicional do contador

A nota do §5 do brief, em `c0cbc79b`, resolve a contagem dos preços: são os seis cartões já construídos. O mandato desta passagem está em `prompts/PROMPT-n1b-construtor.md`, acrescentado por `59e19d22`.

### 1 · Registos anteriores conservados

O commit `dfc86083` regista, tal como estavam na árvore de trabalho, os doze ficheiros pendentes: o relatório, `medidas.json`, `custo.json` e os comprovativos finais da cabeça `70ebf9b6`. Os três códigos lidos desses ficheiros eram zero. Não se repetiram comandos para substituir esses comprovativos históricos.

### 2 · Ponto 5 parado no requisito adicional

A decisão permite as duas entradas `correcao` do desemprego e a recontagem `3` → `5`. O ensaio pela função real `mudancasDoRegisto` confirmou o requisito seguinte:

> mudancas: a linha "correcoes-publicadas" mudou e nenhuma declaração diz de que lugar é. Escreva-o em src/data/lugar-das-linhas.mjs, com a razão.

O erro ocorre nas duas edições. O registo exige um lugar para qualquer entrada `correcao` ou `atualizacao`. A linha derivada conta correções do próprio projeto; não está declarada como medida de Portugal, de uma região ou de um concelho. A história do contador precisa de `atualizacao`, porque a contagem anterior estava certa antes das duas publicações novas; classificá-la como `correcao` acrescentaria uma sexta correção.

A [prova reproduzível](provar-contador-n1b.mjs), executada na cabeça `dfc86083`, trabalha apenas em memória e repõe os objetos no fim. O [resultado](prova-contador-n1b.json) e a [saída](ensaios/n1b-contador.log) mostram:

| Passo do ensaio | Português | Inglês |
| --- | ---: | ---: |
| Registo original, conhecido-positivo | 3 correções | 3 correções |
| Com as duas correções do desemprego, antes da história derivada | 5 correções | 5 correções |
| Com a história 3 → 5 do contador | Recusado: falta lugar | Recusado: falta lugar |

A cadeia proposta do contador passa pelo validador da história, com zero erros. O impedimento está no registo das mudanças. O código zero do ensaio significa que o impedimento foi reproduzido, não que a alteração foi publicada.

O ponto 5 para aqui, pela instrução específica da N1b de parar se o mecanismo da linha derivada exigir algo que o brief não previu. Nenhum ficheiro do livro-razão foi alterado. Não se atribuiu uma contagem do projeto a Portugal para fazer passar o registo. É necessária uma decisão sobre a recontagem: ficar apenas no recibo e na história selada, ou ganhar um âmbito próprio do projeto no registo geral.

### 3 · Medidas, portões e fecho da passagem

`node design/especime-v3/medicoes/n1-2026-09-30/medir-n1.mjs --n1b` escreve o `medidas.json` atualizado. São agora vinte medidas com conhecido-positivo, incluindo três novas: os dois lados do desemprego na primeira página, a contagem com a história selada e as duas correções na página do registo em cada língua. A divergência antiga dos preços deixa de estar aberta.

No estado conservado, as duas linhas portuguesas continuam em `6`, o contador continua em `3` e a primeira página mostra `6 %` para Portugal e `6,0 %` para a União, nas duas edições. A medida `ponto5_cumprido` é falsa. O medidor e os portões não são apresentados como aceitação integral do N1.

Os três portões desta passagem correm depois do commit que contém `RESPOSTA-construtor-n1b.md`, cada um no seu comando. Os ficheiros novos ficam em `portoes/n1b/`, com cabeça, código, saída e duração. A tabela seguinte é atualizada só depois de ler esses ficheiros; os comprovativos da cabeça final e essa atualização do relatório ficam na árvore de trabalho, depois do último commit.

<!-- N1B-PORTOES-INICIO -->
Corridas completas na cabeça final `53938d130cbb668579510094b7f22434bc44a0a9`. Códigos e cabeças lidos dos ficheiros acabados de escrever.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](portoes/n1b/build.codigo) | `53938d130cbb668579510094b7f22434bc44a0a9` | 85.1 |
| `npm run verify` | [0](portoes/n1b/verify.codigo) | `53938d130cbb668579510094b7f22434bc44a0a9` | 598.1 |
| `npm run typecheck` | [0](portoes/n1b/typecheck.codigo) | `53938d130cbb668579510094b7f22434bc44a0a9` | 0.3 |
<!-- N1B-PORTOES-FIM -->

Commits da passagem: `dfc86083` (registos anteriores), `3890bbe3` (prova e medidas) e `53938d13` (relatório da paragem e resposta N1b). A cabeça final completa lê-se nos ficheiros `.cabeca` dos portões finais. Não houve `push`.

Amostra do construtor a `2026-09-30T10:57:20.991Z`: **31 778 394 símbolos** cumulativos, dos quais 31 637 335 de entrada (30 692 864 em cache) e 141 059 de saída. Entrada sem cache: 944 471. Tempo decorrido desde o início desta sessão N1 e N1b até à medição: **6766.8 segundos**. São contadores cumulativos da sessão, não o custo isolado desta passagem. A amostra e os revisores automáticos estão separados em [custo.json](custo.json).


## N1c · acertos da leitura a frio

A leitura `design/especime-v3/critica/LEITURA-n1-2026-09-30.md`, com a triagem no cabeçalho, orientou esta passagem. As cinco plantas da leitura não eram defeitos do ramo. Os achados reais indicados no mandato foram tratados; o ponto 5 do brief conserva a paragem da N1b. Os problemas da anatomia e dos títulos dos cartões do achado 8 pertencem ao K2, conforme a triagem.

### Mandato e prova

| # | Achado ou decisão | Construção e medida |
| --- | --- | --- |
| 1 | 3, salário irmão | Nome pela própria linha, unidade «euros por mês» pelo livro e base de doze meses explícita. A explicação cita o sentido da ficha Eurostat já transcrita na nota, sem inventar a conta de catorze pagamentos. A célula recusa a perda da unidade mensal. |
| 2 | 4, medidas municipais | A legenda e o cabeçalho de cada tabela leem a unidade comum das 308 linhas. A definição existente do índice explica a média da receita corrente líquida dos três anos anteriores. A barra isolada de Évora sai, como o mandato permite; a linha municipal continua na tabela e na página do concelho. |
| 3 | 6, habitação | Inquilinos a preço de mercado antes do total nas duas edições. A T10 volta a ler Habitação e duas plantas invertem a ordem. O «pela mesma ordem» do brief cede à decisão 5 da §1.127. |
| 4 | 7, União | As três portas dizem «Ver em Emprego» ou «Ver em Estado e economia», com o nome equivalente em inglês. A célula confere os três destinos e rótulos; a planta repõe o nome antigo. |
| 5 | 11, câmaras | Sai a porta para a própria página. A V2 continua a recontar as parcelas, a conferir o período, o limite e o selo; recusa a porta reposta. A porta deixa também de ser obrigatória na contagem B2. |
| 6 | 12, secções dos lugares | Os quatro títulos são lidos da mesma declaração que o índice. A célula E7 compara os títulos rendidos com as secções; uma planta troca o primeiro título. |
| 7 | 13, notas soltas | As idades repetidas saem. Cada atribuição e a linha irmã ficam na mesma caixa visual do respetivo cartão, dentro de uma só célula da grelha. As capturas medem a caixa da nota e a do cartão, também a 1 280 px. |
| 8 | 16, frases de bloco | O filtro do texto cru e a conferência do corpo incluem a primeira frase dos cinco blocos. Duas plantas copiam apenas a frase, sem título nem marcas, nas duas edições. |
| 9 | 17, contador das formas | O contador chama-se `paginas_dos_lugares` e espera uma página por edição, sem depender do número de domínios. A mensagem nomeia os lugares. |
| 10 | 18, conhecidos-positivos | Quatro plantas de ligações antigas, relativas e absolutas, e um ficheiro temporário com caminho fictício exercitam os mesmos detetores. A marca municipal ausente produz erro, com planta. |
| 11 | 19, custo | O `custo.json` conserva as amostras N1 e N1b lidas do Git e os dois fechos «tokens used», confrontados com os eventos reais. Cada revisor declara a base sem cache e a soma com cache, com totais por amostra. |
| 12 | 20, voz | O título do bloco fica autorizado só na primeira página; a leitura da justiça em Estado e economia. As razões do ganho médio e do salário mínimo apontam agora a Salários, pensões e apoios. |
| 13 | 21, estrutura | O §2 fecha a divergência dos preços pela nota do §5 do brief em `c0cbc79b`: seis medidas. |
| 14 | 15 e 14, limites | A diferença de precisão continua na primeira página e no cartão do desemprego em `/emprego/` e `/en/employment/`: valor principal `6 %`, régua da União e faixa com `6,0`. As ligações antigas com fragmento não encontram os cartões no índice novo. |
| 15 | Linhas dos índices | Primeira página e Temas mostram o assunto, sem o prefixo de âmbito. As portas conservam a linha completa. A célula conhece as duas formas; recusa a linha longa no índice e a declaração que perde Portugal. |

A guarda nova do portão de HTML admite apenas a unidade de uma linha presente na tabela, no cabeçalho ou na legenda do mapa dos lugares. A comparação literal contra o livro e a auditoria do selo mantêm-se. Três plantas pela função real recusam uma unidade trocada, um campo fora do mapa e uma linha alheia à tabela, depois de um controlo limpo; o HTML é reposto por resumo. O resultado está em `plantas-n1c-portao.json`.

A exceção `ambito-da-medida` saiu de `ledger/allowlist.yml` porque já não dispensava texto nenhum: as idades vivem nas definições conferidas dos cartões. Nenhum valor, fonte ou história do livro-razão foi alterado nesta passagem.

### Limites conhecidos

O achado 14 fica registado: um redirecionamento do servidor não recebe o fragmento do endereço. Uma ligação antiga como `/o-meu-dinheiro/#m-…` abre Temas, onde o cartão deixou de viver; o fragmento não é convertido para a nova porta. O mesmo acontece a `/temas/#m-…`, que já é um índice. As ligações internas atuais usam os novos destinos e âncoras; não se declara restaurada a navegação por fragmentos antigos.

O ponto 5 continua parado no requisito adicional do contador, sem aplicar as duas correções do desemprego. A N1c não transforma os portões verdes em aceitação desse ponto.

### Capturas e medidas

<!-- N1C-MEDIDAS-INICIO -->
O [medidor](medir-n1.mjs), com `--n1c`, produziu **25 medidas**, todas com conhecido-positivo, **41 plantas que mordem** e **zero erros de navegação**. Os quatro conjuntos de 308 pares de identificador e valor dos mapas coincidem com os guardados antes do N1. O ponto 5 permanece falso.

O [captor](captar-n1c.mjs) registou **44 imagens**: primeira página, Temas, União e as oito portas, a 390 e a 1 280 px, nas duas edições. O [manifesto](capturas-n1c.json) prende cada imagem ao seu SHA-256 e à cabeça `ffd62670acdeb441c4a035edf93c2dd8c036101f`. As tabelas municipais e as três leituras da União ficam abertas para mostrar os cabeçalhos e as portas.

As dezasseis ocorrências das notas medidas ficam dentro da caixa do respetivo cartão, oito delas a 1 280 px. Não houve transbordo horizontal, cartões a transbordar ou erro de página. A inspeção visual incluiu Salários, pensões e apoios em português a 1 280 px e em inglês a 390 px, e Estado e economia em inglês a 1 280 px.

A primeira inspeção encontrou uma quebra indevida do nome do salário irmão e o espaço colapsado entre valor e unidade. A verificação em curso foi interrompida, com código 1 conservado em `ensaios/n1c-verify-interrompido.codigo`; não foi uma corrida completa. A correção `ffd62670` retira a classe de lista do nome e preserva o espaço. As capturas foram repetidas: a separação medida é de 2,8125 px nas quatro combinações de língua e largura, e a planta que retira esse espaço é detetada nas quatro. A nova inspeção confirmou o nome a correr na frase.

<!-- N1C-MEDIDAS-FIM -->

### Portões e commits

<!-- N1C-PORTOES-INICIO -->
Corridas completas na cabeça do código `ffd62670acdeb441c4a035edf93c2dd8c036101f`. Códigos, cabeças e durações lidos dos ficheiros acabados de escrever.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](portoes/n1c/build.codigo) | `ffd62670acdeb441c4a035edf93c2dd8c036101f` | 88.7 |
| `npm run verify` | [0](portoes/n1c/verify.codigo) | `ffd62670acdeb441c4a035edf93c2dd8c036101f` | 600.5 |
| `npm run typecheck` | [0](portoes/n1c/typecheck.codigo) | `ffd62670acdeb441c4a035edf93c2dd8c036101f` | 0.3 |
<!-- N1C-PORTOES-FIM -->

Os commits de código são `b3f0fdf9` (vistas, ordem, guardas, plantas e documentos), `a10ceb40` (medidor, captura, provas do portão e custo), `62d28810` (contrato de tipos da linha curta) e `ffd62670` (correção visual do salário irmão e prova do espaço). O último commit regista apenas os comprovativos, as capturas, este relatório e a resposta curta; o seu identificador lê-se em `git rev-parse HEAD`. Uma cabeça não pode ser escrita em ficheiros que façam parte do próprio commit; por isso, para deixar a árvore limpa, o relatório distingue a cabeça testada da cabeça posterior que regista as provas. Não houve `push`.

### Custo e base de contagem

<!-- N1C-CUSTO-INICIO -->
Amostra do construtor a `2026-09-30T12:23:50.442Z`: **1 416 057 símbolos cobrados**, na base do contador «tokens used», e **51 416 057 símbolos com cache**. A entrada em cache é 50 000 000. Tempo decorrido desde o início desta sessão até à medição: **11959.6 segundos**, incluindo as passagens anteriores e as esperas. A amostra antecede o fecho da sessão, cuja linha final ainda não existe.

Os **7 revisores automáticos** somam **340 980 símbolos cobrados** e **2 472 948 com cache**, separados do construtor. As bases e os contadores de cada sessão estão em [custo.json](custo.json).

| Fecho lido do CLI | Símbolos «tokens used» | Total com cache no mesmo evento | Revisores na amostra histórica, cobrados / com cache |
| --- | ---: | ---: | ---: |
| N1 | 865 861 | 25 911 237 | 204 433 / 1 388 433 |
| N1b | 1 096 982 | 32 087 574 | 243 206 / 1 576 198 |
<!-- N1C-CUSTO-FIM -->

Os dois fechos do construtor são cumulativos da mesma sessão e não se somam. As linhas literais «tokens used» ficam em `custo-contadores-cli.json`, com nome do registo, linha e resumo SHA-256, sem caminho local. Nos revisores automáticos não existe uma linha individual de terminal disponível: a base equivalente é calculada dos respetivos eventos `token_count`, como o ficheiro declara. Os valores não são preços em euros. As amostras N1 e N1b anteriores ficam conservadas, em vez de serem substituídas pela N1c.


## N1d · contexto municipal e provas que leem o texto rendido

A releitura `design/especime-v3/critica/LEITURA-n1c-2026-09-30.md` distingue cinco plantas do pacote dos defeitos reais. Esta passagem trata os achados 3, 5, 9, 11, 12, 14 e 17, conforme a triagem. O ponto 5 do brief permanece parado no requisito adicional do contador. Nenhum valor, fonte ou história do livro-razão foi alterado.

### Mandato e medida

| # | Pedido | Alteração e prova |
| --- | --- | --- |
| 1 | Ano, definição e referência municipal | Por baixo de «Quanto se ganha?», a definição é a de `LEITURAS_DAS_MEDIDAS`: trabalhador por conta de outrem a tempo completo, média mensal, pagamentos regulares por horas normais e extraordinárias, antes de descontos. O período é lido das 308 linhas do mapa e conferido como comum. Portugal aparece pela linha `ganho-medio-mensal-2024`, com unidade e selo; período e unidade têm de coincidir com os municipais. A dívida mostra o período e a definição já declarada em `MEDIDAS_DO_CONCELHO`. As plantas retiram ou trocam ano, definição, referência e selo. |
| 2 | Frase copiada com selo | Filtro e corpo usam a mesma normalização, que tira as pastilhas, os scripts e os estilos. As dez primeiras frases declaradas são comparadas às rendidas. As duas plantas copiam o HTML da primeira frase de Preços, com número e selo, sem título ou marcas de bloco, para Temas e União. A prova escreve `primeiraFrase`, `frase_rendida`, a igualdade e a presença do selo. |
| 3 | Sentido da nota Eurostat | «O Eurostat ajusta os pagamentos» passa a «O Eurostat ajusta o valor para contar com esses pagamentos»; o inglês espelha. A célula compara o texto de `[data-base-doze-meses]` e recusa a sua ausência e a frase anterior. O comentário do componente declara a dependência da cadeia inglesa exata da nota. |
| 4 | Contadores, portas e guiões | O contador de Lugares e os controlos F1 a F3 saem da condição de existência de domínios. Um controlo com a declaração de domínios vazia passa; três plantas retiram a contagem de Lugares, as datas e as formas. A V2 recusa ligações relativas e absolutas para a própria porta, sem depender de classes; conserva a possibilidade de uma âncora para a pesquisa dos concelhos. O medidor situa o salário irmão na caixa do seu cartão e o seu próprio detetor é exercitado antes e depois de retirar o valor. |
| 5 | Provas, custo e fecho | A amostra desta passagem, as capturas pedidas, os três portões e a resposta curta ficam na pasta do bloco. O commit final das provas só toca medições e capturas. |

O primeiro ensaio de construção recusou uma suposição do construtor: 307 linhas do índice guardam `reference_date`, mas a de Évora é derivada e lê o período nas suas origens. O resolvedor existente `periodoDasCamaras()` já confere essa cadeia e o período comum; passou a alimentar também o contexto do mapa. O período é 2024 nos dois mapas. O valor nacional dos ganhos é 1 576,0 euros por mês. Não se mudou a linha de Évora para satisfazer a vista.

O segundo ensaio chegou à voz e pediu a classificação dos quatro contextos municipais. Foram classificados como conteúdo, e a exceção existente de «tempo completo» passou a incluir Lugares, pela mesma definição. A classificação foi conferida pelo portão da voz. A revisão editorial nova continua marcada como por ler antes de aterrar.

### Registos históricos e provas na cabeça do código

Os sete ensaios N1c `formas`, `navegacao`, `plantas-portao`, `primeiro-build`, `segundo-build`, `tipos` e `voz` conservam as saídas, os códigos e as cabeças que tinham. Os seus metadados dizem agora «árvore por registar», com `codigo_por_registar: true` e uma nota que distingue esse código da cabeça isolada. Os resultados históricos `navegacao-n1c.json` e `plantas-n1c-portao.json` dizem o mesmo. A marca acrescentada é retrospetiva e identificada como tal; não se inventou um resumo da árvore antiga.

O ensaio de preparação `navegacao-n1d.json` também identifica a cabeça de base e o código por registar; as medidas finais estão em `medidas.json` e nos portões N1d.

O corredor novo regista o estado da árvore no início e separa código por registar dos comprovativos pendentes. Um estado «árvore por registar» durante os portões finais pode corresponder apenas aos comprovativos que estão a ser escritos; `codigo_por_registar: false` explicita esse caso. Os guiões da própria pasta das medições contam como código.

<!-- N1D-PROVAS-INICIO -->
As duas provas foram repetidas na cabeça final do código `926e625bf5b704a9eac9c294d8e3491a528142d3`. Em [plantas-n1d-portao.json](plantas-n1d-portao.json), os quatro códigos são `0, 1, 1, 1`: o controlo limpo passa e cada alteração é recusada. O resumo confirma que o HTML foi reposto. Em [prova-formas-n1d.json](prova-formas-n1d.json), os quatro códigos também são `0, 1, 1, 1`; a declaração vazia de domínios não impede os três detetores de morder. O ficheiro original das formas permanece intacto.
<!-- N1D-PROVAS-FIM -->

### Capturas e medidas

<!-- N1D-MEDIDAS-INICIO -->
O [medidor](medir-n1.mjs), com `--n1d`, produziu **27 medidas com conhecido-positivo**, **51 plantas que mordem** e **zero erros de navegação**. O ponto 5 continua falso. As dez primeiras frases declaradas coincidem com as rendidas; quatro contextos mostram o período comum das linhas, e as duas edições mostram a referência nacional selada. Os quatro conjuntos municipais de 308 pares de identificador e valor mantêm-se iguais aos guardados antes do N1.

O [manifesto das capturas](capturas-n1d.json) regista **8 páginas inteiras**: Lugares e Salários, pensões e apoios, a 390 e 1 280 px, nas duas edições. Junta **4 recortes do contexto dos ganhos**, nas mesmas combinações. Os doze resumos SHA-256 foram recalculados e conferidos. Não houve transbordo horizontal, cartão a transbordar ou erro de página. As tabelas ficam abertas nas capturas.

A inspeção visual incluiu o contexto dos ganhos em português a 1 280 px e em inglês a 390 px, e a página dos salários nas mesmas combinações. A frase ajusta o valor, o nome e a unidade continuam legíveis, e a nota conserva a caixa do respetivo cartão. As quatro ocorrências do salário irmão mantêm a separação entre número e unidade, também conferida pela planta do espaço. A cabeça do manifesto é `926e625bf5b704a9eac9c294d8e3491a528142d3`.
<!-- N1D-MEDIDAS-FIM -->

### Portões e commits

<!-- N1D-PORTOES-INICIO -->
Os três comandos correram separadamente na cabeça final do código `926e625bf5b704a9eac9c294d8e3491a528142d3`. Todos os códigos, cabeças e durações abaixo foram lidos dos ficheiros; os três metadados dizem `codigo_por_registar: false`.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](portoes/n1d/build.codigo) | `926e625bf5b704a9eac9c294d8e3491a528142d3` | 90.5 |
| `npm run verify` | [0](portoes/n1d/verify.codigo) | `926e625bf5b704a9eac9c294d8e3491a528142d3` | 604.3 |
| `npm run typecheck` | [0](portoes/n1d/typecheck.codigo) | `926e625bf5b704a9eac9c294d8e3491a528142d3` | 0.3 |
<!-- N1D-PORTOES-FIM -->

Commits de construção: `4eaf0905` (contexto municipal, frase Eurostat e células) e `926e625b` (guiões, conhecidos-positivos e identificação dos ensaios históricos). O commit seguinte contém apenas medições, capturas, este relatório e `RESPOSTA-construtor-n1d.md`. A cabeça final do ramo lê-se em `git rev-parse HEAD`; a cabeça final do código é a que acompanha os portões. Não houve `push`.

### Custo

<!-- N1D-CUSTO-INICIO -->
Amostra N1d do construtor a `2026-09-30T13:24:22.023Z`: **1 635 872 símbolos cobrados**, na base «tokens used» (entrada sem cache mais saída), e **61 114 656 símbolos com cache**. A entrada em cache é **59 478 784**. Tempo decorrido desde o início desta sessão até à medição: **15596.8 segundos**.

Os **8 revisores automáticos** somam **428 310 símbolos cobrados** e **3 502 358 com cache**. Os contadores individuais e as duas bases estão em [custo.json](custo.json), separados do construtor. A base dos revisores é calculada dos eventos `token_count`, sem alegar uma linha individual de terminal que não está disponível.
<!-- N1D-CUSTO-FIM -->

Os contadores são cumulativos da mesma sessão, com as passagens anteriores e as esperas. Não representam só o incremento N1d nem um preço em euros. As amostras N1 e N1b mantêm-se dentro do `custo.json`; a amostra N1c permanece no commit `471c88d5` e na secção histórica acima. O contador final do CLI desta passagem ainda não existe antes do fecho da sessão, e não foi inventado.
