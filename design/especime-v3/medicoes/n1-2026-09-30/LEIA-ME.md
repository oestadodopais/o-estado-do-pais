# N1 · Uma porta por assunto

Construção de 30.09.2026, no ramo `n1-2026-09-30`, por Codex `gpt-6-astra`. Base: `2cbc5cc46327697469347b98a2445494027861f4`.

**O teste de aceitação do §2 não está inteiramente cumprido.** O ponto 5 fica parado: as duas linhas portuguesas do desemprego continuam em `6`. A organização das portas, a eliminação das cópias, a transferência dos dados municipais e as capturas estão construídas. O brief também chama cinco aos seis cartões de preços existentes; preservaram-se os seis para conservar os 47 cartões nacionais.

## Mandato e medidas

As medidas saem de `node design/especime-v3/medicoes/n1-2026-09-30/medir-n1.mjs`, em [medidas.json](medidas.json). Cada uma das 17 medidas tem um conhecido-positivo e a sua evidência; a ausência de qualquer um fecha o medidor. O código do medidor diz se a medição e as plantas correram; não declara cumprido o ponto 5.

O §0 do brief foi reproduzido pelo seu guião antes da mudança. As quinze medidas e os quinze conhecidos-positivos do estado anterior estão em [brief-antes.json](brief-antes.json), na cabeça histórica que o próprio guião lê.

| # | Mandato | Resultado medido | Estado |
| --- | --- | --- | --- |
| 1 | Blocos só na primeira página | Cinco blocos por edição, dez portas finais; zero blocos e zero títulos de bloco noutras páginas. `ENTRADAS` já não tem `blocos`. A cópia de um bloco e a cópia apenas do título são recusadas. | Construído |
| 2 | Oito portas e cartões únicos | Sete assuntos com 47 cartões por edição, sem repetição entre assuntos; Lugares é a oitava porta. Dezasseis destinos no mapa do sítio, treze regras 301, zero ligações internas antigas. | Construído, com a divergência dos seis preços registada |
| 3 | Temas como índice | Oito portas nos dois índices, com os mesmos nomes, âmbitos e ordem. Temas acrescenta as secções e tem zero cartões inteiros. Um cartão das câmaras em Lugares por edição. | Construído |
| 4 | Retirar os domínios sem perder conteúdo | Dois mapas e duas tabelas de 308 linhas por edição, uma barra Évora/Portugal e a ausência T4a em Lugares. Os seis elementos gráficos transferidos têm o mesmo SHA-256 do HTML anterior. | Construído |
| 5 | As duas linhas do desemprego em `6,0` | Os dois excertos dizem `6.0`; os valores continuam `6`. O ensaio tipado como `correcao` fez o contador calculado de correções passar a cinco, contra três publicados. | Parado no portão do número |
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

Cada página começa com o âmbito dos números de Portugal; Estado e economia nomeia a justiça. A ordem das secções e dos cartões anteriores mantém-se. A secção «As contas do Estado» passou a «Contas públicas» para não repetir o título do bloco da primeira página. O componente do cartão não mudou. As áreas de governo são a exceção expressamente preservada pelo ponto 4 do mandato, fora das oito portas e do rodapé.

### Rotas antigas

As nove rotas antigas das entradas e as quatro dos domínios têm regras 301 em `vercel.json`, com e sem barra final, antes de `filesystem`. O dinheiro abre Temas; as outras entradas abrem o assunto correspondente; os domínios abrem Temas. O endereço inglês de Estado e economia já era o atual e não ganha uma regra para si próprio. A célula compara cada origem e destino com uma lista independente, exige o destino construído e recusa a origem construída ou no mapa do sítio. Esta é uma conferência local da configuração e do resultado construído; não houve publicação nem ensaio num lançamento da Vercel.

Os destinos do veredicto e as ligações internas da página da União foram atualizados. O conteúdo e a disposição da União permanecem os anteriores. O valor do salário mínimo na base de doze meses, os âmbitos etários do emprego e as atribuições dos valores de referência que só o domínio apresentava acompanham agora as medidas, sem criar cartões inteiros adicionais.

## O ponto 5 e a regra de paragem

O ensaio leu a casa decimal dos excertos, acrescentou uma entrada datada com `old_value`, `new_value`, razão nas duas línguas e `kind: correcao`, e passou pelo selador da história dos valores. A razão diz que se repõe a precisão já presente no excerto, sem mudar a quantidade nem alegar uma revisão da fonte.

`ledger:check` recusou o resultado: `correcoes-publicadas.yml`, calculado `5`, publicado `3`. A saída e o código estão em [ensaios/desemprego-correcao.log](ensaios/desemprego-correcao.log) e no ficheiro `.codigo` ao lado. Como esse contador é outro número fora do ponto 5, as duas linhas e a história selada foram repostas. O Git confirma que nenhum ficheiro de `ledger/` difere da base.

[atualizar-desemprego.mjs](atualizar-desemprego.mjs) conserva o procedimento, mas por omissão só mede e diz que está parado. Não se trocou o tipo para `atualizacao` apenas para fazer o contador passar. Falta decidir a classificação deste ajuste de apresentação ou autorizar a atualização derivada do contador. Até lá, a primeira página conserva a diferença de precisão entre os dois lados do desemprego.

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
Primeira corrida completa, antes do ajuste do feixe. Os três comprovativos finais serão escritos de novo depois do commit de fecho.

| Comando | Código lido | Cabeça | Segundos |
| --- | ---: | --- | ---: |
| `npm run build` | [0](ensaios/primeiro-build.codigo) | `c22c21e881696897294e292c0ed63ab5b78cf6b6` | 86.0 |
| `npm run verify` | [1](ensaios/primeiro-verify.codigo) | `c22c21e881696897294e292c0ed63ab5b78cf6b6` | 601.5 |
| `npm run typecheck` | [0](ensaios/primeiro-typecheck.codigo) | `c22c21e881696897294e292c0ed63ab5b78cf6b6` | 0.3 |
<!-- PORTOES-FIM -->

Os primeiros resultados ficam registados antes do commit de fecho. Depois desse commit, os três comandos voltam a correr na cabeça final e os ficheiros de `portoes/` são escritos de novo, juntamente com `medidas.json`. Esses comprovativos finais ficam na árvore de trabalho, fora do último commit: um commit não pode conter um ficheiro que já conheça o seu próprio identificador. A resposta final da sessão lê estes ficheiros e dá a cabeça efetivamente conferida. Não se confunde a cabeça das capturas com a cabeça posterior que só acrescenta documentação e provas.

## Commits

- `f76c5898`: Corrige o campo governado da decisão N1.
- `c22c21e8`: Dá uma página própria a cada assunto.
- `e5143eaa`: Recorta o retrato dos lugares no feixe de desenho.
- `dc5944ae`: Regista as medidas e as noventa capturas do N1.

O último commit acrescenta este relatório e `RESPOSTA-construtor-n1.md`. O identificador desse commit lê-se em `git rev-parse HEAD` e nos três ficheiros `.cabeca` da conferência final. Não houve `push`.

## Custo medido

Amostra do construtor a `2026-09-30T10:14:57.584Z`: **21 849 250 símbolos** cumulativos, dos quais 21 750 757 de entrada (21 030 016 em cache) e 98 493 de saída. Entrada sem cache: 720 741. Tempo decorrido até à medição: **4255.8 segundos**.

[medir-custo.py](medir-custo.py) lê apenas os metadados e os contadores das sessões desta árvore. [custo.json](custo.json) distingue o construtor dos revisores automáticos de aprovações. Os símbolos são os tokens cumulativos reportados, incluindo a entrada servida por cache; não são caracteres nem um preço em euros. A amostra é anterior ao fecho da sessão, explicitamente datada, e não finge ser o contador da última mensagem.

## O que falta

Aplicar o ponto 5 depois de resolver o tipo de atualização ou o contador derivado; reconciliar a menção a cinco preços no brief com os seis existentes; fazer a leitura a frio prevista antes da aterragem. O inventário marca a revisão editorial nova como por ler. Os portões locais verdes não substituem estes pontos nem uma publicação, que não foi pedida a este construtor.
