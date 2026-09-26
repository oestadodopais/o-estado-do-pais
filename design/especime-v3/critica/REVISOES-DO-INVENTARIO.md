# As revisões do inventário · quem leu o diff de cada bloco

*G2 do bloco «A grelha da voz», 26.08.2026. Cada linha do
`design/especime-v3/INVENTARIO-FRASES.md` leva agora a coluna «bloco»: o
identificador do bloco de trabalho que a acrescentou ou a reclassificou. Este
ficheiro diz, por bloco, quem leu o diff daquelas linhas com olhos frescos.*

*`npm run check:voz` lê os dois ficheiros e fecha a construção quando um bloco do
inventário não tem entrada aqui, ou quando a entrada nomeia um ficheiro que não
existe. Uma entrada com a leitura `por ler` é legítima enquanto o bloco está em
construção, e sai na saída do portão para que ninguém a esqueça: a leitura
cruzada faz-se antes da fusão, não antes do commit.*

## Porque é que este rasto existe

A régua do inventário não julga: a classe de cada frase era uma declaração à mão,
feita por quem escreveu a frase. «É a lei que o define, não este sítio.» esteve
declarada como conteúdo em 616 páginas até 26.08.2026. E um leitor de olhos
frescos de um pacote de páginas não repara numa frase só: a leitura do Codex
falhou a planta da classe «o sítio a explicar-se» duas vezes seguidas, na segunda
leitura da parte 3 e na leitura dos concelhos, e apanhou as duas plantas quando
leu **só o diff do inventário**. É essa a leitura que esta tabela regista.

## A tabela

| bloco | linhas | leitura | quem, quando |
| --- | --- | --- | --- |
| b1c | 4 novas; 4 retiradas; 2 saem do ficheiro | por ler | Claude Opus 5, 22.09.2026: o registo de `/correcoes` passou a ser uma lista só, por data, com as três classes de mudança e o lugar de cada linha. Entram o título e a nota da lista, nas duas edições; saem os dois títulos de grupo («Atualizações», «Updates») e as duas notas de grupo, nas duas edições, com a razão escrita. Os quatro cabeçalhos de coluna e os dois prefixos de leitor de ecrã saíram do `strings.mjs` com a tabela que os pedia e não tinham linha no inventário. |
| b1-peca3-correcao | 4 novas; 2 retiradas | por ler | Codex gpt-6-astra, 22.09.2026: os dois rótulos ditados, nas duas línguas; o olho dos lugares continua vivo nas páginas de lugar. |
| até 2026-08-26 | 429 | `design/especime-v3/critica/2026-08-26-codex-leitura-voz-inventario.md` | Codex `gpt-5.6-sol`, 26.08.2026, sobre o diff do bloco dos 308 |
| grelha-da-voz | 36 | `design/especime-v3/critica/2026-08-27-codex-leitura-grelha-da-voz.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre o diff do bloco, os marcadores, as exceções e a página de Évora, com duas plantas (2 de 2); a segunda passagem V1 a V4 saiu dela |
| voz-do-livro-razao | 10 | `design/especime-v3/critica/2026-08-27-codex-leitura-voz-livro.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre o diff do bloco, os marcadores e as duas páginas de índice do livro-razão, com duas plantas (2 de 2); a última passagem L1 a L5 saiu dela |
| voz-dos-documentos | 2 | `design/especime-v3/critica/2026-08-27-codex-leitura-voz-documentos.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre os doze diffs da passagem, a disposição e três páginas de leitura construídas, com três plantas (2 de 3; a terceira mal empacotada) |
| mapa-distritos | 16 | `design/especime-v3/critica/2026-08-27-codex-leitura-mapa-distritos.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre a primeira página, quatro páginas de distrito, os JSON do mapa e o diff do inventário, com quatro plantas (4 de 4) |
| grelha-2 | 87 | `design/especime-v3/critica/2026-08-27-codex-leitura-grelha-2.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre o diff do inventário (estados, dicas), os marcadores e as primeiras páginas, com três plantas (2 de 3); X1 a X3 saíram dela |
| voz-3 | 0 | `design/especime-v3/critica/2026-08-27-codex-leitura-voz-3.md` | Codex `gpt-5.6-sol`, 27.08.2026, sobre os doze diffs da terceira passagem e três páginas construídas, com duas plantas (1 de 2); o inventário não mudou (o texto dos registos é origem declarada), a linha fica pelo rasto |
| regioes | 36 | `design/especime-v3/critica/2026-08-28-codex-leitura-regioes.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre o índice, três páginas de região, a primeira página, as linhas da régua e o diff do inventário, com três plantas (3 de 3); Q3 saiu dela |
| ilhas | 4 | `design/especime-v3/critica/2026-08-28-codex-leitura-ilhas.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre oito páginas de concelho e de linha das ilhas e das colisões de nome, as linhas, o texto das fontes e o diff do inventário, com duas plantas (2 de 2); a nota «duas palavras» corrigida para três |
| vazios | 6 | `design/especime-v3/critica/2026-08-28-codex-leitura-vazios.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre cinco páginas de concelho nas duas edições, doze linhas e recibos, os dois ficheiros da DGAL e o diff do inventário, com três plantas (3 de 3); I88 saiu dela |
| pequenas-3 | 4 | `design/especime-v3/critica/2026-08-28-codex-leitura-pequenas-3.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre o índice dos concelhos, a página de Évora, uma leitura longa, o manifesto e o diff do inventário, com três plantas (2 de 3; a terceira mal plantada); a ordem dos membros dos grupos saiu dela |
| app | 2 | `design/especime-v3/critica/2026-08-28-codex-leitura-app.md` | Codex `gpt-5.6-sol`, 28.08.2026, sobre os manifestos, os ícones, cinco páginas nas duas edições e o diff do inventário, com três plantas (3 de 3); a classe do nome curto corrigida para navegação no fecho |
| areas | 75 | `design/especime-v3/critica/2026-08-29-codex-releitura-areas.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre o índice e as páginas de área nas duas edições, o mapa, a lei e o diff do inventário, com três plantas (2 de 3); a primeira leitura, de 28.08 (`2026-08-28-codex-leitura-areas.md`, 2 de 3), fez sair a terceira passagem; I91 saiu desta |
| pequenas-6 | 0 | `design/especime-v3/critica/2026-08-29-codex-leitura-pequenas-6.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre a página da Economia e uma linha nas duas edições, o índice dos concelhos e três linhas YAML, com três plantas (3 de 3); o inventário não mudou (os nomes são origem) |
| marca-k | 0 | `design/especime-v3/critica/2026-08-29-codex-leitura-marca-k.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre o exportador, a célula do ecrã principal, os SVG do diretor, os seis ficheiros de public, o relatório do construtor e a §6 quinquies das notas, com três plantas (3 de 3); cinco achados reais, consertados em be3f368 e nas notas; o inventário não mudou (os ícones não têm prosa) |
| inicio-lista | 8 | `design/especime-v3/critica/2026-08-29-codex-leitura-inicio-lista.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre os doze ficheiros do ramo, as duas primeiras páginas construídas, a folha e duas capturas, com três plantas (3 de 3); seis achados reais consertados antes da fusão; as oito cadeias novas do inventário são as quatro linhas de nome dos painéis e as quatro glosas dos títulos da prova |
| tipografia | 0 | `design/tipografia/LEITURA-CODEX-2-2026-08-29.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre a segunda ronda do estudo tipográfico (adenda, tabela, ordem, medidas, programas, pranchas, notas), com três plantas (3 de 3); veredicto: a ordem não serve para decidir; o estudo fecha sem mudança (§1.85); a primeira leitura está em `design/tipografia/LEITURA-CODEX-2026-08-29.md`; o inventário não mudou (o estudo não toca em página do leitor) |
| pequenas-7 | 0 | `design/especime-v3/critica/2026-08-29-codex-leitura-pequenas-7.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre os dez ficheiros do ramo, os dois índices do livro-razão, três páginas de linha e uma de área, com três plantas (3 de 3); quatro achados reais na régua e nas afirmações, consertados antes da fusão; o inventário não mudou (701 frases; nomes são origem) |
| inicio-alinhamento | 0 | `design/especime-v3/critica/2026-08-29-codex-leitura-inicio-alinhamento.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre os sete ficheiros do ramo e o diff, o brief, o relatório, as duas primeiras páginas construídas e quatro capturas, com três plantas na fonte (3 de 3); cinco achados reais consertados numa segunda construção antes da fusão; o construtor foi o lugar de direção; o inventário não mudou (nenhuma frase nova) |
| pequenas-4 | 14 | `design/especime-v3/critica/2026-08-29-codex-leitura-pequenas-4.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre a página de Évora, uma página de área inglesa, o índice das áreas, a agenda e os diffs, com três plantas (2 de 3; a primeira mal plantada); I92 saiu dela |
| pequenas-5 | 2 | `design/especime-v3/critica/2026-08-29-codex-leitura-pequenas-5.md` | Codex `gpt-5.6-sol`, 29.08.2026, sobre sete páginas construídas, o dicionário das unidades e o diff do inventário, com três plantas (3 de 3); o texto oculto dos selos e a letra da fonte no dicionário saíram dela |
| inicio-lista | 8 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); Blocking 4: as quatro contagens dos cabeçalhos dos painéis são cobertura do sítio e não conteúdo, e as duas glosas do Painel Social dizem o que «o livro-razão guarda»; decisão do lugar de direção: as contagens passam a `navegacao` e as glosas mudam com o 8.4 e o 8.16 do F1.10 (§9 do brief). Esta linha estava «por ler» em duplicado da entrada de 29.08 acima, que cobre a leitura do bloco (Major 10). **A história do bloco:** o bloco «Os nomes do mapa ao lado, e os dois painéis com nome», 29.08.2026; a leitura cruzada faz-se antes da fusão |
| cabeca | 11 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); as onze linhas confirmadas (achado 16); Minor 11: a segunda secção do bloco diz «sete» linhas e a tabela tem nove (a prosa corrige-se no F1.10, §9 do brief). **A história do bloco:** o bloco «A cabeça nova como contentor», 01.09.2026, ramo `cabeca-2026-09-01` (construtor Claude Opus 5); duas linhas são o nome da faixa nas duas edições, e nove são os `<summary>` que a régua da voz passou a ler na segunda passagem, das quais só quatro são frases novas no sítio; a leitura cruzada faz-se antes da fusão |
| lugar | 26 (12 novas, 10 reclassificadas para `retirada`, 4 mudadas de texto) | `design/especime-v3/critica/2026-09-14-codex-leitura-inventario-lugar.md` | a **sétima sessão** do bloco F1.10, 09.09.2026, ramo `lugar-2026-09-04` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. **Dezoito linhas, e todas do mesmo item: os estudos (§7.4 e 8.6).** As oito novas são: as duas descrições das páginas de índice sem a palavra «arquivo»; as quatro glosas das duas contagens do livro-razão («estudos publicados», «edições publicadas» e as inglesas), que passam a `navegacao` porque dizem o que a contagem conta; e as duas frases que dizem o que cada porta de uma edição abre (item 8.6: «com uma frase que diga o que cada porta abre»), também `navegacao`. As dez retiradas são de três famílias, cada uma com a razão na sua linha: seis levam a palavra «arquivo», que o §7.4 tira do vocabulário («um só nome para os estudos, "estudo", nunca "trabalho" nem "arquivo" como nome de coisa»); duas são o bloco «O documento original», que era a primeira das DUAS apresentações das mesmas portas na página de um estudo; e duas são o «Sem ficheiros.» do bloco «Descarregar», que o §7.4 manda não imprimir quando está vazio e que estava vazio sempre. **Nenhuma linha saiu do ficheiro.** As portas novas não entram, pela razão de sempre: o texto delas vive todo dentro de um `<a>`, e as medidas 8 e 9 da régua excluem esses blocos nos dois sentidos; é o caso da porta da leitura na linha do índice dos estudos e da porta «Ver os estudos» do Método, que passou a chamar a página pelo nome dela. **E uma cadeia nova não é dos estudos:** «Como ler» / «How to read», o nome da dobra da página do domínio para onde a frase da fronteira foi (item 8.11), entra nas oito. O relatório da sessão está em `design/especime-v3/medicoes/lugar-construtor.md`. **A oitava sessão, 14.09.2026, acrescentou oito linhas ao mesmo bloco**, e todas do último dos cinco pequenos do §7.10: «`[a verificar]` com a sua definição ao pé da primeira ocorrência em cada página». Quatro são NOVAS (a definição em português e em inglês, e as duas formas em que o marcador e a definição ficam no mesmo bloco), classificadas `conteudo` pela razão escrita em cada linha; quatro MUDARAM DE TEXTO sem mudar de palavras próprias, e são as duas ressalvas de T1 e de T5 nas duas edições: nas quatro páginas de linha em que a ressalva é o primeiro marcador do documento, a definição entra a seguir a ele e passa a fazer parte do bloco. Nenhuma cadeia daquelas ressalvas foi tocada. As outras quatro linhas que a sessão tinha de mexer eram as do `<noscript>` da busca, e já estavam declaradas desde 09.09 · **lida a 14.09.2026** pelo Codex `gpt-5.6-sol`, xhigh, na leitura cruzada que a coluna ao lado nomeia; a conta das linhas está reconciliada na secção «A conta do bloco `lugar`», abaixo |
| rotulo-ia | 38 | na árvore principal, fora deste ramo | Codex `gpt-5.6-sol`, 01.09.2026, leitura a frio (design/especime-v3/critica/2026-09-01-codex-leitura-rotulo.md, que o lugar de direção guarda na árvore principal e não neste ramo, e por isso esta coluna não o nomeia entre plicas: a conferência do portão exige que um ficheiro nomeado exista aqui) sobre o ramo `rotulo-ia-2026-09-01` (construtor Claude Opus 5), com três plantas (3 de 3); dez achados reais, todos consertados na segunda passagem do mesmo dia; o oráculo do portão, a quarta classe `divulgacao` e as trinta e quatro cadeias da secção da política saíram dela. A leitura vive na árvore principal e não neste ramo |
| frases | 26 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); Blocking 5: catorze linhas vivas da primeira página afirmam limiares e comparações sem marca de origem no bloco da medida (os limiares 60, −3 e 5 são `data-nonledger`, a dívida conhecida da linha F1.2 do plano, para o F3.3); a contagem passa de 30 para 26, que é o que o inventário tem (Major 9). **A história do bloco:** o bloco F0.9 «As sete frases de 18.08», 03.09.2026, ramo `frases-2026-09-03` (construtor Claude Opus 5), em duas passagens; a leitura cruzada da segunda faz-se antes da fusão. A primeira passagem declarou 8 linhas: as três frases aparadas do painel do Procedimento nas duas edições e as duas gémeas retiradas da dívida, que não podem voltar. A segunda passagem, depois da leitura a frio do Codex (`design/especime-v3/critica/2026-09-03-codex-leitura-f09-frases.md`, cinco plantas de três classes, 5 de 5, dez achados), acrescentou 22: fechou na régua o ponto cego que a primeira contornava no arame, e com ele a primeira página passou a ser lida por inteiro. `frasesDaCasa` deitava fora o BLOCO todo por causa de uma marca de origem lá dentro, e a célula do Painel Social é uma folha com um `data-claim`: as três frases daquele painel nunca tinham sido lidas, e não por causa da classe do `<span>`, que tem um `<li>` por cima. As 22 são essas três, a lede do painel, a legenda do mapa e as seis formas da linha do limiar, nas duas edições. A régua lê agora o bloco com as marcas retiradas, rota a rota, como `ROTAS_DO_INVENTARIO` já fazia; as outras rotas escondem 190 cadeias em 2 118 ocorrências, contadas no relatório para o F3.1. O relatório do bloco está em `design/especime-v3/medicoes/frases-construtor.md` |
| corredor | 0 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); o bloco não tem linhas no inventário, e a leitura confirma que não há nada a ler (achado 17); a razão medida está no relatório do construtor, `design/especime-v3/medicoes/corredor-construtor.md`, e a rota `linha` continua fora de `ROTAS_DO_INVENTARIO`. **A história do bloco:** Construtor Claude Opus 5, 01.09.2026, o piloto do corredor diário; por ler. O inventário não mudou, e a razão está medida: a leitura nova do cabeçalho («Fontes · <data>») vive dentro da sua porta, como as outras duas da mobília, e a régua não recolhe texto que esteja todo dentro de um `<a>`; e os dois rótulos novos do recibo («Publicado pela fonte a», «Sem resposta desde») estão na rota `linha`, que não é uma rota inventariada. `check:voz` passa com 706 frases distintas e nada por classificar. A proposta de pôr a rota `linha` em `ROTAS_DO_INVENTARIO` está na §5 do relatório do bloco |
| dominio | 76 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); Blocking 2: vinte e quatro linhas declaradas `conteudo` são a casa a falar da sua cobertura, das vagas, da sua diligência e da sua maquinaria (as linhas do índice «vaga», «no ar», «publicado», «conferido»; na página do domínio «o que esta página tem», «onde a casa procurou», «quando leu ou conferiu», a ressalva do decreto «não lido», a legenda da escala a explicar as classes); decisão do lugar de direção: as linhas do índice saem com o 8.13 e o §7.8 do F1.10, a prosa de diligência vai para a página da linha ou para o Método com o 8.11, e a frase da fronteira («o que este domínio mede e o que não mede») fica conteúdo pela carta; Major 6: cinco rótulos («Por domínio», «Concelho», «Valor», «Value», «By domain») são navegação; Major 7: a frase da ausência fica pela carta (§1, regra 6, que é do diretor) e a prosa que a explica sai com o 8.11; Minor 12: as gémeas da descrição («a data de cada uma» contra «the dates of each one») alinham-se; tudo no §9 do brief do F1.10. **A história do bloco:** o bloco F1.2 «A página do primeiro domínio», 03.09.2026, ramo `dominio-2026-09-03` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. As duas rotas novas (`dominios` e `dominio`) entram em `ROTAS_DO_INVENTARIO` **e** em `ROTAS_COM_ORIGEM_LIDA` no mesmo commit em que as páginas nascem, que é a única altura em que classificar as frases de uma rota não é uma migração: as linhas declaradas são todas do bloco, e nenhuma é uma cadeia que já se rendia noutro lado. Entram também duas exceções da raiz «confer» em `VOZ-MARCADORES.md`, as duas com rotas nomeadas: a ausência declarada de um domínio no índice («ainda sem medidas conferidas», que é a cadeia do `BRIEF-forma-dos-dominios.md` §2) e o rótulo da terceira data de uma medida («conferido», que a carta §1 regra 3 obriga). O relatório do bloco está em `design/especime-v3/medicoes/dominio-construtor.md` |
| dominio | 12 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); as doze linhas da segunda passagem relidas na mesma leitura, com as mesmas decisões. **A história do bloco:** a segunda passagem do bloco F1.2, Claude Sonnet 5, 03.09.2026, sobre a leitura a frio do Codex (`design/especime-v3/critica/2026-09-03-codex-leitura-f12-dominio.md`, Blocking 2, 3, 4, Major 6, 7, 8, 9, 11, 13, Minor 14); a leitura cruzada faz-se antes da fusão. As doze linhas são a ressalva visível de T1 e de T5 (o marcador da casa por extenso, porque o parágrafo que o leva não tem nenhuma outra marca de origem lá dentro), o molde de pontuação da frase da barra do ganho contra o país sem os seus nomes e valores, a nota da escala do mapa do ganho, e os três rótulos da tabela dos 308 valores dentro da própria página (a alternativa em texto do mapa, Major 7) com o rótulo do `<details>` que a abre. O relatório está na secção «Segunda passagem» de `design/especime-v3/medicoes/dominio-construtor.md` |
| indice-sonnet | 0 | leitura a frio (design/especime-v3/critica/2026-09-03-codex-leitura-f19-indice.md, que o lugar de direção guarda na árvore principal e não neste ramo, e por isso esta coluna não o nomeia entre plicas: a conferência do portão exige que um ficheiro nomeado assim exista aqui) sobre o ramo `indice-2026-09-03` (segunda passagem, Claude Sonnet 5, 03.09.2026), Major 7: a leitura apanhou a nota de 25.08 sobre «Subir ↑» lida como dispensa de o declarar, quando ela só explica porque é que a régua automática não o lê. Esta passagem NÃO acrescenta linha nenhuma à tabela: «Subir» / «Back to top» não pode ser `viva` (o seu texto vive todo dentro de `<a>`, que as medidas 8 e 9 excluem nos dois sentidos, e uma linha `viva` assim falha `check:voz`) e «Secção {n} de {total}» / «Section {n} of {total}» é origem declarada (`data-registo-posicao`), como o `{ref}` da grelha da voz. As duas ficam nomeadas em prosa, na nova secção do inventário, com a razão de cada uma escrita por extenso |
| porta | 8 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); Blocking 3: as oito linhas (duas vivas, seis retiradas) dizem que os valores foram conferidos contra a Comissão, que é a casa a falar da sua diligência, declarada como conteúdo; decisão: as duas vivas saem com o 8.4 do F1.10 (a definição citada da Comissão, sem a casa); a secção dizia «quatro novas e quatro retiradas» e a tabela tem duas vivas e seis retiradas, e a contagem passa de 4 para 8 (Major 9). **A história do bloco:** o bloco F1.1 «A porta da frente», 03.09.2026, ramo `porta-2026-09-03` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. Quatro cadeias: as frases de contexto dos dois painéis, nas duas edições (achado C6 e decisão 3.4 da auditoria de UX de 25.08). Quatro linhas passaram a «retirada» nas secções onde viviam: o rótulo «Portugal · país» e a gémea inglesa, e o nome da gaveta da busca nas duas edições. O relatório do bloco está em `design/especime-v3/medicoes/porta-construtor.md` |
| leitura | 4 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); o inventário tem quatro linhas deste bloco (as definições da dívida e da taxa de emprego que a segunda passagem repôs a «viva») e não zero (Major 9); as gémeas certas (achado 16). **A história do bloco:** o bloco F1.1b «A leitura breve no cartão, e o que vem a seguir ao mapa», 04.09.2026, ramo `leitura-2026-09-04` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. **Nenhuma linha nova**, e a razão está medida na secção nova do inventário: o nome e a unidade de cada medida têm marca de origem, a linha do limiar e a das três datas já estavam classificadas, e a única cadeia nova do bloco («Ver no domínio →» / «See it in the domain →») vive toda dentro de um `<a>`, que as medidas 8 e 9 da régua excluem nos dois sentidos: uma linha `viva` assim falharia o portão, como a leitura do índice de 03.09 escreveu sobre «Subir». **Nenhuma linha saiu.** A primeira passagem passou quatro a «retirada» (a definição da dívida pública e a da taxa de emprego, nas duas edições), porque a leitura dessas medidas tinha sido reduzida a uma linha com a porta; a leitura a frio do Codex mediu o custo (Blocking 3), o lugar de direção corrigiu a decisão no mesmo dia e as quatro voltaram a «viva» na segunda passagem. **Uma exceção ganhou uma rota** em `VOZ-MARCADORES.md`: a raiz «confer» no rótulo da terceira data passa a valer também em `home`, pela mesma razão que já valia em `dominio`. O relatório do bloco está em `design/especime-v3/medicoes/leitura-construtor.md` |
| nomes | 16 | `design/especime-v3/critica/2026-09-04-codex-leitura-f14-nomes.md` · Codex `gpt-5.6-sol`, 04.09.2026, sobre o pacote da primeira passagem, com cinco plantas de três classes (5 de 5 vistas); treze achados, dos quais o Major 11 é o do inventário: as cadeias visíveis da busca e os sufixos da contagem das áreas não estavam aqui, e não podiam estar (um `<label>` não é bloco para a régua, e um texto todo dentro de um `<a>` é um destino). A segunda passagem acrescenta a marca `data-voz`, que só alarga a peneira, e declara-os. As dezasseis linhas: as duas contagens do índice com o denominador, o estado vazio da busca, o rótulo do campo, o título da fila de resultados, a frase de «há mais», os dois sufixos da contagem das áreas e o «publicado a» dos trabalhos, cada um nas duas edições | Claude Opus 5, 04.09.2026, bloco F1.4 (os nomes, as datas, o índice), duas passagens |
| toque | 2 | `design/especime-v3/critica/2026-09-08-codex-leitura-inventario-oito-blocos.md` | Codex `gpt-5.6-sol`, 08.09.2026, a leitura cruzada dos oito blocos por ler, sobre as suas 147 linhas, o inventário inteiro, a regra da voz e oito páginas construídas, com três plantas (3 de 3); as duas linhas confirmadas: o Blocking 1 é feito das três plantas do lugar de direção (a classe, a gémea inglesa e a frase da página construída), e sem elas a linha rende-se como declarada. **A história do bloco:** o bloco F1.1c «Uma leitura de cada vez, e nenhuma em repouso», 04.09.2026, ramo `toque-2026-09-04` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. Duas linhas, que são a mesma cadeia nas duas edições: a linha que a área de leitura mostra quando não há nenhuma leitura aberta («Toque num cartão para ler a medida.» / «Tap a card to read the measure.»). Nenhuma linha saiu, e nenhuma mudou de estado: as vinte e uma leituras continuam a render-se no documento entregue, e o que este bloco muda é o que a folha mostra delas com guião. O relatório do bloco está em `design/especime-v3/medicoes/toque-construtor.md` |
| mapa | 14 | leitura a frio (design/especime-v3/critica/2026-09-08-codex-leitura-f11d-mapa.md, que o lugar de direção guarda na árvore principal e não neste ramo, e por isso esta coluna não o nomeia entre plicas: a conferência do portão exige que um ficheiro nomeado assim exista aqui) | Codex `gpt-5.6-sol`, 08.09.2026, cinco plantas de três classes (5 de 5), a segunda passagem no mesmo dia. O achado 27 dela confirma a mudança do inventário como exacta: doze linhas vivas novas, seis por edição, e duas retiradas. O bloco F1.1d «O mapa que cresce, e o nome ao lado», 07.09.2026, ramo `mapa-2026-09-07` (construtor Claude Opus 5). **A segunda passagem acrescentou a décima terceira e a décima quarta linhas**, que são a sétima frase nas duas edições («O mapa desta região não abriu. A porta leva à página dela.» e a irmã inglesa): o guião pede o ficheiro dos concelhos ao tocar numa região, e um pedido que não volta deixava a área sem destino nenhum e o leitor sem explicação (achado 9). As primeiras doze são seis frases nas duas edições: as quatro frases vazias do lugar do nome (duas por nível, uma para o dedo e outra para o rato, porque as duas rendem-se e é a folha que mostra a que serve), o rótulo «As regiões» do grupo novo da lista dos nomes, e o nome acessível do lugar do nome. **Duas linhas saíram para «retirada»:** o nome acessível do desenho da primeira página («Mapa dos distritos e das ilhas de Portugal, com uma área por unidade.» e a sua irmã inglesa), porque o nível do país passou a ser as nove regiões NUTS II e as 29 unidades da Carta deixaram de ter área no mapa. **Nenhuma linha mudou de estado por outra razão.** As duas portas novas («Abrir →» e «← Voltar ao país») não entram, porque vivem inteiras dentro de um `<a>` e as medidas 8 e 9 da régua excluem esses blocos nos dois sentidos. O relatório do bloco, com a tabela das medidas e a secção da segunda passagem, está em `design/especime-v3/medicoes/mapa-construtor.md` |
| mapa | 16 | leitura a frio (design/especime-v3/critica/2026-09-08-codex-leitura-f11e-distritos.md, que o lugar de direção guarda na árvore principal e não neste ramo, e por isso esta coluna não o nomeia entre plicas: a conferência do portão exige que um ficheiro nomeado assim exista aqui) | Claude Opus 5, 08.09.2026, bloco F1.1e «Os distritos e as ilhas voltam ao mapa, e cada um cresce para os seus concelhos», ramo `distritos-2026-09-08`. A decisão é do diretor, a 08.09 à tarde, a corrigir a primeira leitura do lugar de direção: «the map on the first page we had before was quite alright … we can select Évora and we have all the municipalities … the other one, a full Alentejo with all the things, it's not easy to go about». O nível do país volta a ser as 29 unidades da Carta e as nove regiões NUTS II saem do desenho e da lista dos nomes. **Seis linhas vivas novas**, três frases nas duas edições: as duas frases vazias do nível de cima («Toque num distrito ou numa ilha», «Passe o rato por um distrito ou por uma ilha») e o aviso do pedido que não volta com a palavra corrigida («O mapa desta área não abriu», porque as 29 são 18 distritos e 11 ilhas). **Seis linhas passaram a `retirada`** com a razão: as quatro frases que diziam «região» nas duas edições e as duas do aviso do pedido que não volta. (A primeira passagem escreveu «oito», por ter contado as duas linhas do nome do mapa que já estavam `retirada` desde o F1.1d; a leitura a frio do Codex de 08.09.2026 apanhou-o, achado 13.) **Duas linhas saíram do ficheiro** («As regiões» e «The regions»), e não passaram a `retirada`: a frase deixou de se render na primeira página, que é a rota deste bloco, e continua a render-se em `/regioes`, que é outra superfície; `viva` falharia por não render na rota do bloco e `retirada` falharia por render fora dela. **As duas linhas `retirada` do F1.1d VOLTARAM A `viva`** (o nome acessível do desenho da primeira página): a cadeia voltou a render-se como `aria-label` do `<svg>` com o desenho das 29, e a primeira passagem deixou-as `retirada` com a razão de a régua da voz não recolher aquele atributo. A razão era falsa, e a leitura a frio do Codex apanhou-a (achado 14): a régua lê os `aria-label` desde a I79, e o que ela deitava fora era a dica igual a um `data-` do próprio elemento, porque essa é composta do livro-razão. O `<svg>` levava um `data-rotulo-pais` com a mesma cadeia; a segunda passagem tirou a cópia (o guião lê o `aria-label` que o servidor desenhou), a régua vê a frase, e as duas linhas voltaram a `viva`. As duas portas continuam de fora, pela mesma razão de sempre. **A conta das dezasseis:** seis vivas novas, seis passadas a `retirada`, duas saídas do ficheiro e duas de volta a `viva`. O relatório do bloco, com a tabela das medidas e a secção da segunda passagem, está em `design/especime-v3/medicoes/distritos-construtor.md` |
| frescura | 14 | leitura a frio (design/especime-v3/critica/2026-09-04-codex-leitura-f16-frescura.md, que o lugar de direção guarda na árvore principal e não neste ramo, e por isso esta coluna não o nomeia entre plicas: a conferência do portão exige que um ficheiro nomeado assim exista aqui), Codex `gpt-5.6-sol`, 04.09.2026, cinco plantas de três classes (5 de 5 vistas), doze achados | o bloco F1.6 «O atraso do IEFP e as duas frases», 04.09.2026, ramo `frescura-2026-09-04` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. Doze das catorze são os rótulos de duas frases novas, nas duas edições: o contador das séries atrasadas no cabeçalho (o rótulo e as dicas das suas duas chaves da prova) e a frase do atraso de uma série, que se rende na página de cada linha atrasada e no cartão dela na página do concelho. As outras duas são a frase de contexto do Painel Social reescrita, que passou a abrir pela seleção; a redação anterior passou a «retirada» nas duas edições, com a razão na linha. Seis das doze só puderam ser declaradas por levarem a marca `data-voz`: a régua salta um bloco com marca de origem lá dentro em rotas fora de `ROTAS_COM_ORIGEM_LIDA`, e o rótulo do contador vive dentro de uma âncora. O relatório do bloco está em `design/especime-v3/medicoes/frescura-construtor.md`. **A segunda passagem (04.09.2026) reescreveu sete das catorze cadeias e nenhuma delas saiu deste ramo:** seis por falarem da casa, que a Emenda 15 proíbe na página do leitor e que a leitura a frio apanhou no Major 8 (a frase do atraso passou à forma deíctica, «nesta linha: … lido a …», e a dica do contador deixou de dizer quem publica), e a sétima por dizer «headline indicators» em inglês, que a §1.98 tira do vocabulário (Major 9): fica «headline measures», com o termo da Comissão citado uma vez |
| lugar | 39 (19 reclassificadas para `retirada`, 20 novas) e 1 apagada | `design/especime-v3/critica/2026-09-14-codex-leitura-inventario-lugar.md` | bloco F1.10 («uma coisa, um lugar»), 04.09.2026: o vocabulário fechado da §1.98 aplicado às cadeias do sítio e a frase de definição da primeira página. A leitura cruzada faz-se antes da fusão · **lida a 14.09.2026** pelo Codex `gpt-5.6-sol`, xhigh, na leitura cruzada que a coluna ao lado nomeia; a conta das linhas está reconciliada na secção «A conta do bloco `lugar`», abaixo |
| lugar | 10 | `design/especime-v3/critica/2026-09-14-codex-leitura-inventario-lugar.md` | a segunda sessão do bloco F1.10, 08.09.2026, ramo `lugar-2026-09-04` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. Dez linhas, todas `viva` e nenhuma retirada: quatro são a página nova «Portugal na União Europeia» (o nome dela nas duas edições, que é a mesma cadeia no título, no menu, no rodapé e na porta da faixa, e a descrição nas duas edições), e seis são as três palavras de estado do índice dos domínios que passou a render-se na primeira página, nas duas edições. As vinte e uma leituras dos dois quadros da União, os dois nomes de painel e as duas frases de contexto NÃO entram: já estavam declaradas, e o que mudou foi a página que as rende. Duas exceções de `VOZ-MARCADORES.md` ganharam uma rota cada, nenhuma nova. O relatório do bloco está em `design/especime-v3/medicoes/lugar-construtor.md` · **lida a 14.09.2026** pelo Codex `gpt-5.6-sol`, xhigh, na leitura cruzada que a coluna ao lado nomeia; a conta das linhas está reconciliada na secção «A conta do bloco `lugar`», abaixo |
| lugar | 4 | `design/especime-v3/critica/2026-09-14-codex-leitura-inventario-lugar.md` | a **quarta, quinta e sexta sessões** do bloco F1.10, 08 e 09.09.2026, ramo `lugar-2026-09-04` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. **Quatro linhas, todas `viva` e nenhuma retirada.** Duas são o nome da região de navegação do CAMINHO do cabeçalho («Onde está» / «Where you are», item 5 do encargo, §2.5 do brief): só se ouve, e os degraus do caminho não acrescentam linha nenhuma, porque são âncoras com as etiquetas que o menu já declara e a folha é um nome com marca de origem (`data-lugar`, `data-nome`, o título de um estudo por `TituloDeTrabalho`, ou o nome de uma linha pela escada de `nomes.mjs`). As outras duas são a frase que diz de quem é a marca «provisório», uma vez, no índice das regiões (§7.6): a primeira redação dizia também onde ler a nota da fonte e o portão da voz apanhou-a («a página», o marcador da casa a falar de si). **Nenhuma linha saiu, e nenhuma mudou de estado.** As portas novas do bloco («Comparar as regiões →», «Ver estes estudos no índice», «Os estudos», o nome de cada estudo na página do concelho) não entram, pela razão de sempre: o texto delas vive todo dentro de um `<a>`, e as medidas 8 e 9 da régua excluem esses blocos nos dois sentidos. **Uma cadeia SAIU do ficheiro sem passar a `retirada`** («Os valores concelho a concelho →» e a gémea inglesa): nunca esteve no inventário, pela mesma razão, e o §7.7 fundiu-a com o comando que abre a tabela do mapa. **E uma cadeia mudou de palavra sem mudar de linha**: o rótulo do campo `source` passou de «Fonte» a «Publicado por» (§7.2) e a data da última verificação de «Reconferido a» a «Verificado a» (§7.3); as duas vivem em rotas que não estão em `ROTAS_DO_INVENTARIO`, e por isso não têm linha aqui. O relatório das três sessões está em `design/especime-v3/medicoes/lugar-construtor.md` · **lida a 14.09.2026** pelo Codex `gpt-5.6-sol`, xhigh, na leitura cruzada que a coluna ao lado nomeia; a conta das linhas está reconciliada na secção «A conta do bloco `lugar`», abaixo |
| lugar | 33 novas e 25 passadas a `retirada` | por ler | a **oitava sessão** do bloco F1.10, 14.09.2026, ramo `lugar-2026-09-04` (construtor Claude Opus 5), a aplicar a triagem das duas leituras do Codex de 14.09.2026. As 33 novas são 15 definições e rótulos da página europeia e da página do domínio, 8 descrições ocultas dos contadores que se rendiam sem estar declaradas, 6 descrições públicas de `<head>`, 2 frases de fronteira do domínio e 2 da fração do Painel Social; nenhuma é uma frase nova por gosto, cada uma substitui uma que dizia mais do que a fonte ou entra porque já se rendia. As 25 que saíram levam a razão na sua própria coluna. A leitura cruzada DESTAS faz-se antes da fusão, e é a única entrada deste bloco que fica `por ler` |

## A conta do bloco `lugar`, reconciliada (14.09.2026)

*O achado 9 da leitura cruzada do Codex de 14.09.2026: «The four review-register
counts account for only 79 of the 179 current `lugar` rows.» Tinha razão na
aritmética e a conta fecha-se assim, medida e não estimada.*

**O inventário tem 179 linhas com `bloco` = `lugar` na cabeça `2da5212d`**, e o
número é o mesmo que a leitura contou. Mediu-se de duas maneiras independentes:
`grep -c '| lugar |'` dá 175, e as outras quatro estão escritas `lugar|` sem o
espaço (linhas 237 a 240 dessa cabeça, as quatro do «no ar» e do «ainda sem
medidas conferidas»); uma expressão que aceite as duas formas dá 179.

**As quatro entradas diziam 39, 10, 4 e 26, e somavam 79 porque cobriam quatro
dos dezassete commits deste ramo que mexeram no inventário.** Não havia linhas
perdidas nem por explicar: havia treze commits sem entrada. A conta por commit,
lida do próprio ramo com
`git show -U0 <sha> -- design/especime-v3/INVENTARIO-FRASES.md` e a contar as
linhas acrescentadas e tiradas que declaram `bloco` = `lugar`:

| commit | dia | linhas `lugar` acrescentadas | tiradas |
|---|---|---:|---:|
| `bce30e79` | 04.09 | 39 | 0 |
| `3139099f` | 08.09 | 10 | 0 |
| `0effbd28` | 08.09 | 8 | 0 |
| `7eeb1daf` | 08.09 | 6 | 0 |
| `d2b1a6d3` | 08.09 | 8 | 4 |
| `d2deb968` | 08.09 | 4 | 0 |
| `ffdf7556` | 08.09 | 4 | 1 |
| `f739ad03` | 08.09 | 50 | 0 |
| `25f49a75` | 08.09 | 2 | 2 |
| `a6ae388e` | 09.09 | 4 | 2 |
| `eaa08a13` | 09.09 | 4 | 0 |
| `6d364182` | 09.09 | 2 | 4 |
| `6d578c34` | 09.09 | 2 | 0 |
| `87b71288` | 09.09 | 2 | 0 |
| `1c29d1c1` | 09.09 | 12 | 2 |
| `150f64dc` | 09.09 | 40 | 9 |
| `ca642d64` | 14.09 | 4 | 0 |
| **soma** | | **201** | **24** |
| palavras-da-porta | 26 (14 novas, 9 reclassificadas para `retirada`, 3 saídas do ficheiro) | `design/especime-v3/critica/2026-09-15-codex-leitura-f113-porta.md` | o bloco F1.13 «As palavras da porta e o índice dos domínios», 15.09.2026, ramo `porta-2026-09-15` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. **As dezoito linhas saem dos itens 1, 3, 4 e 5 do brief, e todos eles saem da leitura que o diretor fez da primeira página no ar a 15.09 de manhã.** As oito novas são: a frase de definição nova nas duas edições (item 1); o rótulo da busca da primeira página nas duas edições, que nomeia os dois caminhos que ficam no primeiro ecrã depois de a gaveta dos nomes sair da vista (item 3); a linha do domínio com os nomes das suas medidas de cabeça nas duas edições (item 4); e a linha da legenda da marca da fonte nas duas edições (item 5). As sete retiradas são de duas famílias: a frase de definição antiga, nas duas edições, e a legenda do selo com os nomes dos seus dois estados, cinco linhas (as duas do título, as duas de «proveniência completa» e a inglesa «one field unconfirmed», que mudou mesmo de palavras). **E TRÊS LINHAS SAÍRAM DO FICHEIRO**, o que neste registo é raro e está explicado no inventário: «medidas», «measures» e «um campo por confirmar» eram blocos que se rendiam sozinhos, os blocos deixaram de existir, e as três ficavam num estado impossível: a régua casa uma linha `retirada` por CONTENÇÃO («medidas» está dentro de «As medidas», «um campo por confirmar» é a cauda da linha nova da legenda) e uma linha `viva` por IGUALDADE. O portão da voz diz o que se faz nesse caso, e é a primeira das duas coisas que ele nomeia: «a linha sai do ficheiro, ou passa a "retirada" com a razão escrita». **E as oito linhas das portas entraram na segunda passagem do mesmo dia**, depois da leitura a frio do Codex (achado 7): as seis etiquetas novas `viva` e as duas antigas `retirada`. A primeira passagem deixou-as de fora com a razão de sempre (o texto de uma etiqueta vive todo dentro de um `<a>`, e a régua não lê esses blocos), e a leitura mostrou o custo com uma planta que passou: uma cadeia trocada no ficheiro das cadeias não cai em régua nenhuma quando o inventário não tem a linha. As seis ganharam `data-voz`, que é a marca que a casa já usa desde 04.09.2026 para a prosa que vive onde a régua não olha. **A leitura a frio está em `design/especime-v3/critica/2026-09-15-codex-leitura-f113-porta.md`, com o registo das plantas ao lado** (três plantas de três classes, 3 de 3 vistas; sete achados reais, todos fechados na mesma worktree antes de aterrar). O relatório do bloco está em `design/especime-v3/medicoes/porta-construtor.md` |
| palavras-do-rodape | 108 (36 novas, 72 reclassificadas para `retirada`) | `design/especime-v3/medicoes/p1-2026-09-15/LEIA-ME.md` | o bloco P1 «O rodapé e a primeira página», 15.09.2026, ramo `porta-2026-09-15` (construtor Claude Opus 5). **O ficheiro nomeado é o relatório do bloco, com as saídas das réguas ao lado, e não uma leitura a frio:** a leitura a frio do Codex e a leitura de língua fazem-se antes da fusão, e a linha passa a nomeá-las quando existirem. **As cento e seis linhas saem dos dez itens do brief, e todos eles saem da leitura que o diretor fez do rodapé, da primeira página e de uma página de área no ar, ao fim da tarde de 15.09.2026, mais a emenda que ele escreveu às 16:35 UTC.** As setenta retiradas são de sete famílias: o rótulo de IA e a ficha da primeira página com o nome do diretor (item 1 e 2, oito linhas); o rótulo da busca em três superfícies (item 4, quatro linhas); as quatro frases vazias do lugar do nome do mapa, nas duas edições (item 5, oito linhas); o «incluído em» e os nomes das medidas de cabeça do índice dos domínios (item 6, quatro linhas); as três etiquetas das portas e a contagem das edições (item 7, oito linhas); e a família do «limiar» (item 8, trinta e oito linhas), que é a maior e a que menos muda de sentido: a mesma frase com uma palavra trocada. As trinta e seis novas são o rótulo novo e a ficha nova (quatro), a abertura da secção dos domínios e o rótulo da contagem no singular e no plural (seis), a legenda de repouso do lugar do nome (duas), e as vinte e quatro gémeas das cadeias do «limiar». **Este bloco acaba com menos texto visível do que começou**, e a conta está no relatório: as três cadeias de instrução do primeiro ecrã saíram, a linha de um domínio encolheu de sete pedaços para dois, e as três portas perderam seis cadeias e ganharam zero. **As duas últimas retiradas são da leitura do lugar de direção às capturas, ao fim da tarde de 15.09**: a linha «308 concelhos · CAOP 2025 · selo» saiu de baixo do mapa, porque dizia a contagem uma segunda vez e a norma §2.1 diz onde ela se diz. **O relatório do bloco e as medidas estão em `design/especime-v3/medicoes/p1-2026-09-15/`**, com a tabela das cadeias antes e depois em `cadeias-antes-depois.md` e as saídas das réguas ao lado |
| cartao | 15 (11 novas, 2 reclassificadas para `retirada`, 2 mudadas de texto) | por ler | o bloco P2 «O número e o seu sentido: o cartão de uma medida», 15.09.2026, ramo `cartao-2026-09-15` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. **O que sai antes do que entra, que é a regra deste bloco:** o cartão de uma medida tinha dez pedaços de texto à vista e passa a ter cinco, e o que sai não se apaga, muda de lugar para o recibo, que é a página da linha. **As nove novas** são quatro famílias: a preposição «em» e «in», que liga o valor ao período no lugar do rótulo «Dados de» (item 1b); as três palavras da régua nas duas edições, seis linhas («acima do valor de referência», «abaixo do valor de referência», «entre os valores de referência» e as inglesas), que dizem de que lado do valor de referência o número está (item 1d); e a frase da orgânica no índice das áreas, nas duas edições, que diz uma vez o que nove páginas diziam cada uma (item 3). **As duas retiradas** são a linha do tipo de uma área nas duas edições («área do XXV Governo Constitucional»), que estava debaixo do título de cada uma das nove e que o diretor leu a 15.09 de manhã como uma explicação que não é conteúdo. **As três palavras da régua são as mesmas chaves que o bloco P1 escreve** (`s.estado.acima`, `.abaixo`, `.entre`) para as cadeias da primeira página: as duas metades da troca de «limiar» por «valor de referência» correm em ramos separados por decisão do lugar de direção, e escrever chaves diferentes para a mesma palavra era garantir duas palavras para a mesma coisa no dia da fusão. **Nenhuma linha saiu do ficheiro.** **E uma cadeia nova não entra:** «União Europeia» / «European Union», o nome do agregado com que a régua compara o número, existe em `strings.mjs` e não se rende em rota nenhuma, porque nenhuma linha `<slug>-<período>-ue` está selada; entra no commit em que a primeira chegar do motor, que é a regra escrita na cabeça do inventário. **E duas linhas mudaram de texto sem mudar de sentido:** a contagem do livro-razão no índice, nas duas edições, passou de «2916 afirmações · 330 de 2916 calculadas · 2767 de 2916 linhas de concelhos» para 2975, porque as 59 linhas do enquadramento entraram no livro-razão; o número é `data-prova` e o portão reconta-o a cada construção, e a linha do inventário carrega o texto inteiro, e por isso muda com ele. **E duas entraram com as linhas do motor:** «União Europeia» e «European Union», que de manhã não se rendiam em rota nenhuma e à tarde passaram a render-se em sete páginas de área por edição. **Duas marcas `data-voz` novas**, pela mesma razão de 04.09.2026 e de 15.09 (achado 7 da leitura a frio do F1.13): a peneira da régua salta um bloco inteiro quando ele contém uma marca de origem declarada, e os dois blocos novos têm uma lá dentro (a linha do valor tem o `data-claim`, a frase da orgânica tem o `data-nonledger` do diploma). Sem a marca, as duas cadeias eram prosa da casa que nenhum inventário podia declarar. O relatório do bloco está em `design/especime-v3/medicoes/p2-2026-09-15/LEIA-ME.md` | Claude Opus 5, 15.09.2026; a leitura a frio do Codex faz-se antes da fusão |
| correcao-p1p2 | 28 (13 novas, 15 reclassificadas para `retirada`) | `design/especime-v3/critica/2026-09-15-codex-leitura-p1-p2.md`, a leitura a frio do Codex (`gpt-5.6-sol`, xhigh) aos blocos P1 e P2 fundidos, com a triagem do lugar de direção na cabeça do ficheiro | a passagem de correção dos blocos P1 e P2, 15 e 16.09.2026, ramo `porta-2026-09-15` (construtor Claude Opus 5), sobre a cabeça fundida `79df7102`. **As linhas saem de cinco achados da leitura, e todos eles são frases que o leitor vê.** As quinze retiradas são de cinco famílias: a frase de instrução da área de leitura em repouso, nas duas edições (achado 4; a norma §1.4 não admite uma frase de instrução numa página de conteúdo, e o nó saiu com ela das duas vistas que o rendiam); a linha de abertura da secção dos domínios, nas duas edições (achados 9 e 10; era prosa sobre o projeto numa página de conteúdo e prometia todos os números publicados, quando a contagem é a das medidas que se leem nas páginas); a manchete da União com «ultrapassa» e a frase da orgânica decalcada do inglês, três linhas (achados 7 e 17); e **oito linhas da página do domínio que o cartão levou consigo** (achado 2): as seis do valor de referência com o rótulo de quem o fixou, que a régua do cartão passou a dizer, e as duas do rótulo da origem de uma definição, que era «Publicado por». **As treze novas são de três famílias**: a manchete com «falha», que é a palavra que não diz o lado (uma das quatro medidas fora do valor de referência está ABAIXO do seu); a frase da orgânica reescrita em português de jornal, nas duas edições; e **dez blocos do cartão de uma medida**, que entram no inventário porque o cartão passou a render-se na página do domínio, que é rota inventariada (a régua, as duas datas que o cartão não escreve, a linha do valor com a bandeira do provisório, e o rótulo novo da origem de uma definição). **Este bloco acaba com menos texto visível do que começou**, e as três cadeias que ele escreve de novo entram no lugar de três que saíram. **Duas cadeias mudaram sem entrar no inventário**, e a razão é a mesma nas duas: «Próxima verificação» (era «Próxima conferência», achado 17) e «Excerto composto a partir da resposta da fonte» (achado 5) rendem-se na página de uma linha, que é rota que prova a rendição e não rota inventariada, o mesmo estatuto que `sobre` e `metodo` têm em `ROTAS_QUE_PROVAM_A_RENDICAO`. Os relatórios da passagem são o §8 de `design/especime-v3/medicoes/p1-2026-09-15/LEIA-ME.md` e o §10 de `design/especime-v3/medicoes/p2-2026-09-15/LEIA-ME.md`, com as duas tabelas das cadeias ao lado |
| p3 | 41 (15 novas, 31 reclassificadas para `retirada`) | `design/especime-v3/critica/2026-09-16-codex-leitura-p3.md` | o bloco P3 «Os nomes das medidas, e a revisão de língua de tudo», 16.09.2026, ramo `p3-2026-09-16` (construtor e editor de língua Claude Opus 5); a leitura cruzada faz-se antes da fusão. **O que sai antes do que entra, e sai mais do que entra.** As vinte e seis retiradas são de quatro famílias, e nenhuma é uma frase nova a substituir outra por gosto: **as três datas** (quatro linhas, duas por edição) saem da dobra da leitura breve da primeira página e da página do domínio e vivem no recibo, por decisão do diretor de 16.09.2026, com a regra 3 da carta dos conteúdos emendada e o `check:formas` (F5) a medi-las lá; **«a casa»** (dezasseis linhas, oito por edição) sai do texto do leitor por decisão do diretor de 15.09.2026 às 16:35 UTC, e as gémeas novas dizem «este projeto» com a mesma frase; **«sem guião»** (quatro linhas) passa a «sem JavaScript», que é o nome da tecnologia que falta, pelo §4 do plano das palavras; e **«limiar»** (duas linhas) sai da definição do painel do Procedimento, que era a última página fora do Método a escrevê-lo, pela decisão de 15.09.2026 de manhã. As dez novas são as gémeas dessas quatro famílias (oito) mais **as duas frases da regra dos nomes** (item 8, o diretor a 16.09.2026 às 08:25 UTC): a norma no Sobre, que é texto governado e entra pela `data-sobre-nomes` com o carimbo da §1.110, e o direito de resposta na página das correções, que é a única das duas que passa pelo inventário. **A conta das frases visíveis:** a primeira página e a página do domínio perdem as três datas de cada leitura breve e não ganham nada; o Método perde três frases com «a casa» e ganha as mesmas três sem ela; o Sobre ganha uma frase; a página das correções ganha uma; o índice do livro-razão e a lista dos estudos trocam uma palavra dentro da mesma frase. **Os 81 nomes de medida que este bloco escreveu não entram no inventário**, e é de propósito: levam `data-nome="projeto"`, que é a marca que tira um nome do inventário e traz a sua própria conferência, carácter a carácter contra `src/data/nomes-das-medidas.mjs` (`scripts/medir-defeitos.mjs`, `NOMES_POR_LINHA`). **A passagem de correção do fim do dia, depois da leitura a frio do Codex, acrescenta três linhas e retira três** (achado 9): o direito de resposta nas duas edições, que troca «pelo mesmo endereço» por «para o mesmo endereço» e «through the same address» por «to the same address», e a definição do painel do Procedimento, que troca «apanha os aspetos» por «abrange os aspetos» e deixa a gémea inglesa como está, porque o verbo dela é o do excerto selado da Comissão. As outras quatro frases que a triagem mandou corrigir vivem no Método, no Sobre e na política de inteligência artificial, que a Emenda 15 isenta da contagem, e ficam escritas na §1.110 do `DECISIONS.md`; as duas de texto governado levam carimbo novo. **A conta desta passagem:** 36 linhas do bloco mais 3 novas e 3 reclassificadas para `retirada`, e nenhuma frase nova a substituir outra por gosto. **E uma segunda passagem, ao fim do dia**, por decisão do lugar de direção depois de ler a frase do direito de resposta: a preposição «para» prendia-se ao verbo errado («a resposta publica-se … para o mesmo endereço»), e a frase reordena-se nas duas edições para «Quem for nomeado pode responder para o mesmo endereço das correções: a resposta publica-se ao lado da peça, sem edição.» / «Anyone named may reply to the same address as the corrections: the reply is published beside the piece, unedited.» Mais 2 novas e mais 2 reclassificadas para `retirada`, que dá 41 linhas do bloco. |
| e1-evora-2027 | 4 (4 novas) | por ler | o bloco E1 «Évora 2027: o prometido, o painel, o dinheiro», 16.09.2026, ramo `e1-2026-09-16` (construtor Claude Opus 5); a leitura cruzada faz-se antes da fusão. **As quatro linhas são uma frase por edição, e o seu prefixo de língua.** O bloco põe no arquivo o décimo terceiro trabalho, e a única prosa deste projeto que ele acrescenta à superfície é a descrição do estudo em português e em inglês: uma frase que diz o que o estudo põe lado a lado, sem se explicar (norma §1.4). Não é transcrição, e por isso não leva `data-verbatim` nem sai do inventário pela marca, ao contrário das descrições do «Prometido, Pago, Auditado» e dos «Pelouros». As outras duas linhas são a mesma frase com o prefixo «PT » e «EN », que é como a página de um estudo rende a fila das descrições das duas edições. **Nenhuma linha saiu e nenhuma mudou de estado.** O corpo do documento não passa pelo inventário: a página de texto compõe-o do registo do motor, e a régua tira da superfície a região `data-registo`. O relatório do bloco está em `design/especime-v3/medicoes/e1-2026-09-16/LEIA-ME.md` |

**E as 179 estão todas explicadas.** Os 201 acrescentos são 183 textos distintos
(alguns foram reescritos e voltaram a entrar), e dos 183 saíram 4: ficam 179, que
são exactamente as 179 da cabeça. O conjunto dos textos da cabeça menos o
conjunto dos textos alguma vez acrescentados por um commit deste ramo é **vazio**:
não há uma única linha `lugar` que não tenha entrado por aqui.

**Vinte e uma dessas 179 já existiam em `origin/main` com outro bloco**, e
passaram a `lugar` porque foi este bloco que as reclassificou, que é o que a
coluna «bloco» quer dizer desde 26.08.2026 («o bloco de trabalho que a
acrescentou OU A RECLASSIFICOU»). As outras 158 são texto que não existia em
`main`. A linha apagada não conta, como o encargo manda: saiu do ficheiro e não
está nas 179.

**Depois da oitava sessão (14.09.2026) são 213**, com 63 `retirada` e 150 `viva`:
as 179 mais as 33 novas, e a que mudou de bloco (a gémea inglesa da frase da
fronteira do domínio, que estava em `dominio` e passa a `lugar` porque foi este
bloco que a retirou).


## As duas colunas novas de 27.08.2026 (I74)

A tabela do inventário passou de três colunas a cinco: **estado** e **razão**.
Uma linha declara-se `viva`, e então rende-se em pelo menos uma rota
inventariada, ou `retirada`, e então a casa tirou aquela frase de propósito, ela
não pode voltar a render-se, e a razão da coluna a seguir diz que bloco a tirou. `npm run
check:voz` fecha a construção nos dois sentidos: uma linha `viva` que não se
rende em rota nenhuma, e uma linha `retirada` que voltou.

**O que isto fecha.** A I74 contou 58 declarações que já não se rendiam em página
nenhuma, e a razão de elas ficarem era boa: o ficheiro escreve, desde o bloco dos
308, que «uma frase corrigida sai desta lista», porque repô-la passaria em
silêncio. O que faltava era a régua. Uma linha que ficava sem se render não era
uma sentinela: era uma linha morta, e a lista engordava.

**O que saiu em vez de ficar.** Dezoito das 57 que este bloco encontrou não
podiam ser sentinelas, e saíram do ficheiro: catorze levam uma contagem por
dentro («132 afirmações · 19 calculadas», «128 de 136 linhas com proveniência
completa»), e uma frase com um número que se move volta com outro número, pelo
que a linha nunca voltaria a morder; e quatro deixaram de ser frases da casa
porque o nome do lugar passou a declarar-se (`data-lugar`) ou a compor-se
(`<lugar>`), e a régua deixou de as ler como prosa. As duas famílias estão
contadas na nota do bloco, com o que as substitui: quando uma contagem voltar,
volta como bloco **por classificar**, que é o portão que a apanha.

## O que a entrada de «até 2026-08-26» cobre, e o que não cobre

**É um estado herdado, e diz-se como tal.** As 429 linhas anteriores a este bloco
foram escritas ao longo de dezassete blocos de trabalho, e nenhum deles teve uma
leitura cruzada do seu próprio diff do inventário: a forma foi inventada a
26.08.2026, e a primeira leitura assim, a que esta linha nomeia, leu o diff do
bloco dos 308 e mais nada. Três leituras de 26.08 tocaram partes destas linhas
por outro caminho, o das páginas construídas, e ficam nomeadas aqui para que o
rasto não se perca:

* `design/especime-v3/critica/2026-08-26-codex-leitura-voz-inventario.md` · o diff
  do inventário do bloco dos 308, 2 plantas em 2;
* `design/especime-v3/critica/2026-08-26-codex-leitura-concelhos.md` · dez
  concelhos ao acaso, 4 plantas em 5, e a falha foi na planta desta classe;
* `design/especime-v3/critica/2026-08-26-codex-leitura-mapa.md` · a primeira
  página, 4 plantas em 4.

**O que fecha a lacuna não é uma leitura, é a máquina.** O G1 deste bloco passou
as 429 linhas, e todas as outras frases da superfície pública, por uma lista
fechada de marcadores; o que sobrou está na lista de exceções de
`design/especime-v3/VOZ-MARCADORES.md`, cada entrada com a razão escrita. Uma
releitura humana do inventário inteiro contra a Emenda 18 continua a ser trabalho
de outra família, e o campo `lida-contra` da cabeça do inventário só muda com uma
entrada nova aqui.

## O gatilho da regra

A cabeça do `INVENTARIO-FRASES.md` diz `lida-contra: Emenda 18`, e
`npm run check:voz` procura em `design/especime-v3/direcao.md` a emenda mais alta
com a cadeia «§5 «Voz» emendado» (hoje as Emendas 15 e 18 levam-na). Quando
aparecer uma emenda da voz acima da que está escrita, a construção fecha com «o
inventário foi lido contra a Emenda N e a Emenda M mudou a regra da voz: relê e
atualiza».

**O campo não sobe sozinho.** Subir o número é dizer que alguém releu o
inventário inteiro contra a regra nova, e isso é trabalho de outra família: a
entrada dessa releitura escreve-se na tabela acima, com o ficheiro do registo, e
só então o número muda. Foi a falta deste gatilho que deixou a Emenda 18, de
25.08.2026, apertar a regra da voz sem que o inventário fosse relido contra ela.

| B1-peca1 | 17.09.2026 | por ler pelo lugar de direção antes de aterrar | Página e lista de estudos: lista fechada, abertura transcrita e retiradas em `design/especime-v3/medicoes/b1-2026-09-17/cadeias-retiradas-peca1.json`. |
| b1-peca2 | 21.09.2026 | por ler antes de aterrar, por outra família que não a que construiu | Página do lugar e página dos lugares, com a passagem de correção do mesmo dia: 71 linhas retiradas com a razão, 14 apagadas por não se renderem em lado nenhum, e 20 novas, com a razão de cada classe em `design/especime-v3/medicoes/b1-2026-09-21/LEIA-ME-peca2.md`. |

### B1, primeira peça, 17.09.2026

As cadeias que saíram da superfície estão enumeradas abaixo. A retirada da segunda apresentação conserva o corpo transcrito e a edição fixada. As frases explicativas saem da página. Os rótulos das fontes mudam para o nome decidido.

| Família | Cadeia retirada | Razão |
|---|---|---|
| estudo | [a verificar] | palavra fora do lugar |
| estudo | % desse valor está nas quatro maiores empresas | segunda porta |
| estudo | % dez anos depois | segunda porta |
| estudo | % do orçamento foi de facto cobrado no último ano de contas | segunda porta |
| estudo | % four years earlier | segunda porta |
| estudo | % of that value sits with the four largest enterprises | segunda porta |
| estudo | % of the budget was actually collected in the latest year of accounts | segunda porta |
| estudo | % quatro anos antes | segunda porta |
| estudo | % ten years later | segunda porta |
| estudo | A ligação sai deste domínio. | segunda porta |
| estudo | designations, over three people, in the next executive | segunda porta |
| estudo | designações, por três pessoas, no executivo seguinte | segunda porta |
| estudo | EN [a verificar] | segunda porta |
| estudo | EN Economic assessment of Portugal’s regions. | segunda porta |
| estudo | EN Economy, investors and open doors in the municipality of Évora. | segunda porta |
| estudo | EN Economy, society and strategy in the Alentejo and the Algarve. | segunda porta |
| estudo | EN Fifteen years of municipal government in Évora, across five terms. | segunda porta |
| estudo | EN Long series on the country’s evolution. | segunda porta |
| estudo | EN Non-revenue water in Portugal’s public supply systems. | segunda porta |
| estudo | EN Public funding in Portugal. | segunda porta |
| estudo | EN What was budgeted, what was paid and what was left owing in the municipality of Évora. | segunda porta |
| estudo | EN Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did. | segunda porta |
| estudo | No subject assigned | palavra fora do lugar |
| estudo | PT [a verificar] | segunda porta |
| estudo | PT Avaliação económica das regiões de Portugal. | segunda porta |
| estudo | PT Economia, sociedade e estratégia no Alentejo e no Algarve. | segunda porta |
| estudo | PT Financiamento público em Portugal. | segunda porta |
| estudo | PT Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. | segunda porta |
| estudo | PT Séries longas sobre a evolução do país. | segunda porta |
| estudo | PT Água não faturada nos sistemas de abastecimento em Portugal. | segunda porta |
| estudo | Sem tema atribuído | palavra fora do lugar |
| estudo | The link leaves this domain. | segunda porta |
| estudo | € actually paid | segunda porta |
| estudo | € aprovados e atribuídos ao concelho pelo registo do plano de recuperação | segunda porta |
| estudo | € de valor acrescentado bruto das empresas do concelho | segunda porta |
| estudo | € efetivamente pagos | segunda porta |
| estudo | As linhas deste documento | palavra fora do lugar |
| estudo | O que cada porta abre: «Ler no sítio», o texto composto aqui; «Ler o documento», a edição tal como foi publicada. | explica a página |
| estudo | What each door opens: “Read on the site”, the text composed here; “Read the document”, the edition as it was published. | explica a página |
| estudo | The rows of this document | palavra fora do lugar |
| estudo | PT O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro. | segunda porta |
| estudo | EN What the law charges for retiring early, and what would be actuarially neutral. | segunda porta |
| estudo | A quem cabe numa das exceções que afastam o fator de sustentabilidade, a lei corta menos do que o valor neutro. As duas medidas acima são os dois extremos da mesma decisão. | explica a página |
| estudo | For those who fall within one of the exceptions that set the sustainability factor aside, the law cuts less than the neutral figure. The two measures above are the two ends of the same decision. | explica a página |
| estudo | é o que a lei corta a quem não cabe numa das exceções | segunda porta |
| estudo | is what the law cuts from those who fall outside the exceptions | segunda porta |
| estudo | de redução da pensão seria atuarialmente neutro, por um ano de antecipação | segunda porta |
| estudo | pension reduction would be actuarially neutral, for one year of anticipation | segunda porta |
| estudo | € approved and attributed to the municipality by the recovery-plan register | segunda porta |
| estudo | € of gross value added by enterprises in the municipality | segunda porta |
| estudo | % de índice de dívida no primeiro ano da série da Direção-Geral das Autarquias Locais | segunda porta |
| estudo | % debt index in the first year of the local-government directorate’s series | segunda porta |
| estudo | As contas das empresas do concelho creditam toda a atividade de uma empresa a um único concelho, e não são um produto interno bruto municipal. A média nacional é a base do índice de poder de compra. | segunda porta |
| estudo | The accounts of the municipality’s enterprises credit a firm’s whole activity to a single municipality, and are not a municipal gross domestic product. The national average is the base of the purchasing-power index. | segunda porta |
| estudo | Cada contagem é a lista de pelouros que a página da câmara atribui a essa pessoa. | explica a página |
| estudo | Each count is the list of portfolios the council’s page attributes to that person. | explica a página |
| estudo | Estes dois valores são somas sobre o registo público inteiro do plano de recuperação, e não uma linha de um documento. Vencido é o valor aprovado em localizações cuja data prevista de conclusão já passou sem conclusão registada. | explica a página |
| estudo | These two values are sums over the whole public register of the recovery plan, and not a line in a document. Overdue is the value approved at locations whose planned completion date has passed with no completion recorded. | explica a página |
| estudo | O sistema contabilístico mudou por baixo da série, um ano de contas foi publicado em digitalizações e outro não foi publicado de todo. | segunda porta |
| estudo | The accounting system changed underneath the series, one year of accounts was published as scans and another was not published at all. | segunda porta |
| lista | Cada estudo publicado, com as suas edições e datas. Os que estão alojados noutro sítio levam a ligação para lá. | explica a página |
| lista | Every published study, with its editions and dates. Those hosted elsewhere carry the link to it. | explica a página |
| estudo | Documento alojado | palavra fora do lugar |
| estudo | Document hosted | palavra fora do lugar |
| estudo | Documento do estudo · texto | palavra fora do lugar |
| estudo | Study document · text | palavra fora do lugar |
| estudo | As linhas deste documento → | palavra fora do lugar |
| estudo | The rows of this document → | palavra fora do lugar |
| estudo | PT Economia, investidores e portas abertas no concelho de Évora. | segunda porta |
| estudo | PT O que foi orçamentado, o que foi pago e o que ficou em dívida no concelho de Évora. | segunda porta |
| estudo | [a verificar] · um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado | segunda porta |
| estudo | [a verificar] · a field not confirmed against the source, not a doubt about what is published | segunda porta |
| lista | Os estudos, com as suas edições em português e em inglês. | explica a página |
| lista | The studies, with their Portuguese and English editions. | explica a página |
| lista | Sem JavaScript, a lista mostra todos os estudos. | explica a página |
| lista | Without JavaScript, the list shows every study. | explica a página |
| estudo | PT O que a candidatura de Évora a Capital Europeia da Cultura prometeu, o que o painel de peritos da Comissão Europeia escreveu sobre isso, e o dinheiro escrito em atos públicos. | segunda porta |
| estudo | EN What Évora’s bid for European Capital of Culture promised, what the European Commission’s expert panel wrote about it, and the money written into public acts. | segunda porta |
| estudo | Edições | segunda porta |
| estudo | Editions | segunda porta |
| estudo | Ler no sítio | palavra fora do lugar |
| estudo | Read on the site | palavra fora do lugar |
| estudo | Ler o documento | segunda porta |
| estudo | Read the document | segunda porta |

As duas declarações isoladas «[a verificar]» e a sua definição portuguesa saem do inventário, em vez de serem proibidas globalmente: as mesmas cadeias ainda pertencem a formulações maiores legítimas. Saem as ocorrências das capas; o marcador continua nos dados incompletos. A lista fechada B1 impede que a descrição por preencher volte. Nenhuma célula foi relaxada para este caso.

Na passagem de correção B1, achado 7, entram os nomes dos campos «Medida», «Fonte» e «Verificado a» e os ingleses. Saem as doze cadeias do aparato técnico e das portas sem recibo, identificadas no inventário. A secção passa a depender de um recibo com valor, nome da medida, fonte e data da verificação, conferidos por L6 contra o livro-razão. A revisão pelo lugar de direção continua pendente.

Os nomes dos recibos seguem os nomes que o livro-razão já apresenta: figuras, medidas do domínio e nomes aprovados do projeto, antes do rótulo da fonte. A L6 refaz essa escolha a partir das declarações de origem. O campo `name` não é a única origem de um nome existente; nenhum nome foi criado nesta correção.

### B1, segunda peça, 21.09.2026 · os lugares

As 79 cadeias que saíram são de três famílias, e a razão é a mesma para todas:
a superfície que as rendia deixou de existir.

| razão | quantas | o que era |
|---|---|---|
| explica a página | 31 | as contas do município e as suas ressalvas, a legenda da distância desenhada, a nota da lei do limite de dívida, a frase da divergência entre as duas contas da mesma dívida, e a nota do mapa localizador. Cada uma dizia como um número foi feito, e isso vive no recibo da linha |
| segunda porta | 30 | os rótulos do índice dos concelhos e do índice dos distritos, que passaram a redirecionamentos para a página dos lugares, e as duas entradas de menu que eles tinham |
| palavra fora do lugar | 18 | «região NUTS II», «distrito», «ilha da Região Autónoma» e as frases de abertura das duas páginas: o nome da gaveta da classificação não é o que a página tem |

As 20 cadeias novas são, na construção: os quatro rótulos de secção da lista
fechada («Temas» e «Estudos sobre este lugar», e os ingleses), a primeira frase da
nota da dívida total nas duas edições, e as quatro palavras da comparação do
poder de compra com a média do país, que são a leitura de um lugar e entram
marcadas. Na passagem de correção do mesmo dia entram mais dez: as duas frases de
definição do diretor (o prazo médio de pagamento e a dívida total) nas duas
edições, o rótulo da porta para as linhas de um lugar nas duas edições, e as
quatro descrições de `<head>` dos concelhos cujo nome a régua dos nomes só
reconhece em parte («Ferreira do …», «Viana do …»).

A passagem de correção retirou seis linhas: as duas frases que descreviam a fonte
em vez da medida, as duas que anunciavam o que a busca faz sem guião (deixaram de
ser verdade quando o índice dos concelhos passou a redirecionamento), e a frase
da dívida total nas duas edições.

Os nomes dos dezoito temas e os nomes das oito medidas de um concelho NÃO entram
no inventário: são nomes de entradas de ficheiros de dados declarados
(`src/data/dominios.mjs` e `src/data/concelhos.mjs`), e vão com a marca
`data-nome` que a régua confere carácter a carácter contra o ficheiro de onde
dizem vir. Sem essa marca seriam 52 linhas a repetir duas listas.

### B1, terceira peça, 22.09.2026: o país

| bloco | data | leitura cruzada | âmbito |
| --- | --- | --- | --- |
| b1-peca3 | 22.09.2026 | por ler pelo lugar de direção antes de aterrar | País, temas e menu; `design/especime-v3/medicoes/b1-2026-09-22/cadeias-peca3.json`. |

Saem 25 cadeias e entram 18 cadeias distintas. As novas são a leitura aprovada, as sinopses dos estudos e os rótulos de publicação compostos dos dados. Nenhuma explica a página. A mudança de 21.09.2026 vem da declaração própria e é comparada com ela antes de sair do inventário.

| Família | Cadeia retirada | Razão |
| --- | --- | --- |
| menu e rodapé | Encontrou um erro? correcoes@oestadodopais.pt · O registo de correções → | segunda porta |
| país | A dívida pública é % do PIB e a taxa de desemprego é % da população ativa. | leitura substituída pelo texto da direção |
| país | Government debt is % of GDP and the unemployment rate is % of the labour force. | leitura substituída pelo texto da direção |
| menu e rodapé | Found an error? correcoes@oestadodopais.pt · The corrections log → | segunda porta |
| menu e rodapé | As páginas | segunda porta |
| menu e rodapé | Idioma | segunda porta |
| menu e rodapé | Language | segunda porta |
| menu e rodapé | Menu · Main navigation | segunda porta |
| menu e rodapé | Menu · Navegação principal | segunda porta |
| menu e rodapé | Tema | segunda porta |
| menu e rodapé | The pages | segunda porta |
| menu e rodapé | Theme | segunda porta |
| país | concelhos in the coordinates file of the official administrative map | palavra fora do lugar |
| país | concelhos no ficheiro de coordenadas da Carta Administrativa | palavra fora do lugar |
| país | estudos publicados | palavra fora do lugar |
| país | published studies | palavra fora do lugar |
| menu e rodapé | Menu | segunda porta |
| país | Os nomes no mapa | palavra fora do lugar |
| país | The names on the map | palavra fora do lugar |
| país | das medidas de cabeça dos domínios | palavra fora do lugar |
| país | of the head measures of the domains | palavra fora do lugar |
| país | Os números oficiais de Portugal, do país ao seu concelho, cada um com a fonte. | explica a página |
| país | Portugal’s official numbers, from the country to your municipality, each with its source. | explica a página |
| país | · concelhos | palavra fora do lugar |
| país | · municipalities | palavra fora do lugar |

Duas das 25 cadeias, «· concelhos» e «· municipalities», saem do inventário em vez de ficarem proibidas: são fragmentos que continuam dentro de outras frases legítimas. Ficam 23 entradas retiradas.

As unidades das correções passaram a campos conferidos da própria linha, incluindo as bases numéricas dos índices. Saem assim da prosa do inventário e entram na comparação literal do livro-razão.

Ficam três cadeias do registo: a seta de mudança e a marca de incerteza que acompanha as duas edições. As unidades são conferidas como campos, não como prosa.


## B1, peça 3, segunda correção, 22.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| b1-peca3-correcao2 | 4 descrições novas; 2 retiradas; 2 palavras retiradas saem do inventário | por ler pelo lugar de direção antes de aterrar | Descrições ditadas e retirada do mecanismo do tema; plantas D1 e N3 em `design/especime-v3/medicoes/b1-2026-09-22/plantas-segunda-correcao.json` e `design/especime-v3/medicoes/b1-2026-09-22/plantas-segunda-tema.json`. |


Entram as quatro descrições ditadas para o país e os temas, na classe de navegação. As duas descrições antigas do país ficam retiradas com a razão. «Tema» e «Theme» deixam a lista de frases retiradas: eram os nomes do comando antigo e são também palavras das descrições agora aprovadas. Não se pode proibir uma frase inteira por conter uma dessas palavras. A N3 do `check:pais` protege a retirada do mecanismo: recusa o guião do tema e o atributo nas páginas próprias; a planta repõe o guião na `Base.astro`.


## I129, o grupo etário dos jovens que não estudam nem trabalham, 22.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| i129 | 6 frases novas; 6 retiradas (2 e 2 na primeira passagem, 4 e 4 na segunda) | por ler pelo lugar de direção antes de aterrar | As definições das quatro medidas cuja linha fixa um grupo de idades passam a escrever os dois limites nas duas edições: `jovens-nem-2025` (15-29) na primeira passagem, e as duas do desemprego (15-74) e a do emprego (20-64) na segunda. A planta da célula K13 do `check:cartao` troca o segundo limite por «24» na declaração e exige um vermelho por edição; a catraca ficou vazia e as duas metades dela exercem-se com uma lista passada por argumento. Medições em `design/especime-v3/medicoes/i129-2026-09-22/LEIA-ME.md`. |

As duas frases antigas falavam de «um grupo de idades e sexo» sem dizer qual, e a condição que a fonte põe é dupla: o achado 7 de 14.09.2026 trouxe o sexo de volta e deixou a idade por dizer. As duas novas preenchem as duas metades, com os limites lidos da etiqueta `Age class: From 15 to 29 years` da resposta do Eurostat e o sexo total que a mesma resposta declara. Os algarismos levam marca de origem própria e por isso saem do texto recolhido, como já acontecia na definição do abandono escolar precoce.

Na segunda passagem do mesmo dia entram mais quatro, pelas três medidas que a célula K13 apanhou com o mesmo defeito. As duas do desemprego partilham a frase, porque partilham a definição e a origem. O glossário do Eurostat define a taxa de desemprego e a taxa de emprego sem idade nenhuma, e define-as bem: são taxas de qualquer grupo. Quem fixa o grupo é o pedido de cada linha, e é de lá que os limites vêm, pela etiqueta que o excerto passou a trazer. Nenhuma palavra do glossário se perdeu: o que a frase ganhou foi a idade, e a ordem das palavras da inglesa mudou para a acomodar sem a repetir.
## B1c · «O que mudou» no seu lugar, 22.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| b1c | 4 novas; 4 retiradas; 2 saem do ficheiro | por ler pelo lugar de direção antes de aterrar | O título e a nota da lista única do registo, nas duas edições; os dois títulos e as duas notas dos grupos antigos ficam retirados com a razão. Plantas A1, A2, A3, C1 e M3 em `design/especime-v3/medicoes/b1c-2026-09-22/plantas-b1c.json`. |

Entram «As mudanças, por data» e «The changes, by date», com a nota que diz o que a lista tem. Saem «Atualizações» e «Updates» e as duas notas dos grupos: a política, no topo da mesma página, continua a definir as três naturezas, e cada linha da lista continua a dizer a sua. «Correções» e «Corrections» ficam vivas porque o rodapé as rende. «Atualizações» e «Updates» SAEM do ficheiro em vez de ficarem proibidas, pela mesma regra que tirou «· concelhos» e «Tema»: deixaram de ser um bloco seu, mas continuam dentro da nota das revisões de proveniência, que está viva na mesma página («Não são erros nem atualizações…», «They are neither errors nor updates…»), e uma palavra não se proíbe por causa da frase que a contém. A seta entre os dois valores e a definição do marcador que a acompanha continuam a render-se: a lista única dá-lhes a mesma forma que a primeira página lhes dava.

## R1 · o lado do leitor depois da leitura de fora, 23.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| r1 | 8 novas; 1 de volta a viva; 8 retiradas; 2 com a contagem do livro-razão posta em dia | por ler pelo lugar de direção antes de aterrar | A leitura do país com as duas leituras da dívida, a frescura dos cartões de concelho, as duas definições das empresas com o setor por extenso e o molde da régua da habitação sem a média da União. Plantas do `check:pais` em `design/especime-v3/medicoes/r1-2026-09-23/plantas-pais.json`; as dos outros portões em `design/especime-v3/medicoes/r1-2026-09-23/plantas-portoes-r1.json`. |

Entram as duas edições da leitura do país na frase do lugar de direção (§1.124), com a data da notificação e o ano entre parênteses fora da contagem, porque são campos conferidos das linhas do INE; a leitura antiga fica retirada com a razão. Entram «a fonte já publicou» e «the source has already published», a frescura ao pé do período nos cartões de concelho cuja fonte já tem um período mais recente; «lido a» e «read on» já estavam vivos, do bloco da frescura de 04.09.2026. As duas definições das empresas escrevem o setor por extenso, provado pela resposta do Eurostat ao pedido da linha (`tipspd30`): a da dívida em português é exatamente a frase que o achado 6 de 14.09.2026 tinha retirado por falta de fonte, e volta a viva no seu lugar com a razão nova, em vez de entrar duplicada; as quatro com a sigla e o marcador ficam retiradas. «Por lugar» e «By place» ficam retiradas com a secção que as rendia. O molde «:» é a régua do cartão da sobrecarga sem o agregado europeu, e sai quando o B2 trouxer a média com a medida por regime de ocupação. As duas linhas das contagens do livro-razão mudam de número e não de sentido, como o P2 fez a 15.09.2026: subiram de 2975 para 2978 com as três linhas do INE.

A lista dos estudos passou a conferir cada sinopse inteira, pela mesma conta da primeira página (`sinopseEsperada` em `scripts/voz-pais.mjs`), porque as leituras dos estudos de Évora trazem sufixos da leitura e referências que a conferência por unidade não conhecia; a planta `r1-sinopse-da-lista-trocada` troca uma palavra de uma sinopse de Évora e exige o vermelho.


## B2, peça 1: o veredicto e a pergunta do leitor, 23.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| b2-peca1 | As definições como perguntas, os estados em palavras, as contagens do país e das câmaras, e a unidade monetária por extenso | por ler pelo lugar de direção antes de aterrar | As origens das definições conservam-se; K6 e K13 conferem as perguntas e as idades. K15 confere a palavra e a cor, incluindo as formas de banda nas plantas. V1 e V2 conferem as frases e as contagens. As plantas e as medidas ficam em `design/especime-v3/medicoes/b2-2026-09-23/`. |

As afirmações antigas das definições ficam retiradas com a razão, e as perguntas entram na mesma classe de conteúdo. A pergunta dos inquilinos a preço de mercado e a ressalva de todos os regimes no total pertencem a medidas distintas. Os valores e os limites com origem não fazem parte da cadeia do inventário; continuam conferidos como valores. A pergunta da taxa de câmbio efetiva real conserva a conferência da K6 sem uma declaração viva que o leitor do inventário não recolhe.

As formas de estado estão declaradas no inventário e em `s.estado`. Só entram na tabela como vivas as que a construção rende: a forma de fora de uma banda fica descrita e exercida pela planta da K15, sem fingir uma ocorrência publicada. «acima do valor de referência», «above the reference value» e «below the reference value» saem da tabela porque deixaram de ser blocos próprios, mas continuam dentro de frases legítimas. As outras cadeias de direção que a construção deixou de render ficam retiradas. O molde da régua só com período anterior mantém-se. As duas cadeias do índice do livro-razão acompanham os contadores provados da construção; as anteriores ficam retiradas.

O veredicto do país e o cartão das câmaras não congelam contagens no inventário. As marcas da prova saem da recolha apenas nessas superfícies, cuja frase inteira é conferida pela V1 e pela V2; o portão de HTML reconta as chaves. As palavras que rodeiam os valores e as dicas da prova entram na tabela. A leitura do país anterior mantém-se inteira, e nas leituras com dinheiro muda apenas o símbolo para a unidade por extenso que a linha declara.

## B2, peça 1, segunda passagem de correção, 23.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| b2-peca1-correcao-2 | 23 novas; 2 com a razão corrigida; 12 retiradas; 6 saem do ficheiro | por ler pelo lugar de direção antes de aterrar | Codex gpt-6-astra começou a passagem e Claude Opus 5.5 acabou-a, 23.09.2026. O veredicto do país diz o ano das linhas e separa a lista das medidas fora (achados 9 e 10); as referências nacionais nomeiam o Pacto e o Conselho da UE (achado 16); as dicas das contagens das câmaras dizem «calculado» e a de 308 diz «municipalities» em inglês (achado 14); o cartão das câmaras diz o período das linhas (achado 13); duas perguntas mudam de texto para dizerem só o que as origens dizem, a da dívida pública e a do desemprego de longa duração (achado 8). As cadeias substituídas ficam retiradas, cada uma com a razão própria. Duas formas da régua com chão negativo continuam vivas pela referência da Comissão do desempenho das exportações, com a razão corrigida. Seis linhas saem do ficheiro, pela regra das cadeias curtas: o nome do cartão das câmaras nas duas edições, que passou a `span` como os nomes dos outros cartões e deixou de ser um bloco que a voz recolha (a V2 confere-o carácter a carácter contra o nome aprovado); a unidade «câmaras» e «councils», que deixou de ser bloco próprio e vive dentro de «câmaras em» e da régua; e a forma de fora sem dono nas duas edições, que só vive dentro da frase da União Europeia. Plantas e medidas em `design/especime-v3/medicoes/b2-2026-09-23/`. |

O veredicto e as contagens continuam conferidos pela V1 e pela V2, e a palavra com o dono pela K15. As perguntas passam a ser conferidas pedaço a pedaço pela K16 do `check:cartao`, contra as origens declaradas e os campos selados da linha, e cinco origens que são respostas da API do Eurostat trazem o selo do pedido no motor.

## L1 · a leitura de cada medida, 24.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| l1 | 40 novas | por ler pelo lugar de direção antes de aterrar | Claude Opus 5.5, 24.09.2026: as vinte leituras que a primeira página rende por baixo do número dos cartões nacionais, nas duas edições, na forma em que a régua da voz as recolhe. As palavras são do lugar de direção (`design/observatorio/leituras/LEITURAS-das-medidas-2026-09-24.mjs`), levadas para `src/data/leituras-das-medidas.mjs` com os acertos A1 a A15 da auditoria das origens e os acertos A16 e A17 deste portão, cada um dito no relatório do bloco e conferido por `acertos-l1.py`; a K17 do `check:cartao` confere o texto, os ramos e a auditoria. A16 e A17 trocam uma palavra que fazia voltar uma frase retirada dentro de uma leitura («Despesa paga», o cabeçalho das contas do município, e «The share of people aged to who are in employment.», a definição da casa que o F1.10 trocou pela da fonte), e a palavra que entra é a do literal que sustenta a leitura; as duas frases retiradas ficam retiradas e a procura das retiradas não muda. Duas exceções novas em `VOZ-MARCADORES.md`, das raízes «garant» e «independ», e as rotas da página do país e da dos temas acrescentadas à do «tempo completo», cada uma com a razão. O arame da classe da primeira página (F0.9) passa a tirar as leituras dos cartões, e só elas, depois de a K17 as conferir na mesma corrida; uma leitura que a K17 recuse fica dentro do arame. Plantas e medidas em `design/especime-v3/medicoes/l1-2026-09-24/`. Na passagem de correção de 26.09.2026, 16 destas linhas mudaram, com entrada própria (o bloco «l1-correcao», abaixo). |
| l1-correcao | 16 mudadas | por ler pelo lugar de direção antes de aterrar | Claude Opus 5.5, 26.09.2026: a passagem de correção do L1 depois da leitura a frio do Codex (`design/especime-v3/critica/LEITURA-l1-2026-09-26.md`). Oito das vinte leituras da primeira página mudaram, nas duas edições: seis ganharam a palavra corrente que explica um termo que a leitura a frio achou por explicar (o valor real do PIB por habitante, o rendimento mediano, o cuidado formal, o rendimento disponível das duas sobrecargas e os produtores residentes), cada uma com o literal de origem selada que a sustenta (os acertos A18 e A21 a A25, conferidos por `acertos-l1.py`), e duas foram reescritas pelo lugar de direção no seu ficheiro (a disparidade salarial e as câmaras), trazidas para o sítio sem mudar uma palavra. As linhas antigas saíram do ficheiro em vez de passarem a «retirada»: nunca estiveram no ar, porque o bloco ainda não aterrou. Os dois fluxos de crédito e a taxa de atividade também mudaram, mas só se rendem na página dos temas, que o inventário não lê. |


## RP1 · rendimentos e preços, 26.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| rp1 | Perguntas e leituras novas; contagens do livro atualizadas | por ler pelo lugar de direção antes de aterrar | Entram apenas as cadeias recolhidas nos cartões construídos. As perguntas são conferidas pela K16 e as leituras pela K17. Os contadores do índice continuam provados no HTML. A expressão inglesa «to live on» sai da leitura da linha de pobreza porque fazia reaparecer «live», uma cadeia retirada; o acerto consta de `acertos-rp1.json` e não muda a procura das retiradas. |

## RP1b · preços e ressalva do provisório, 26.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| rp1b | 10 cadeias novas, 2 contagens atualizadas e 2 leituras que saem do inventário | por ler pelo lugar de direção antes de aterrar | As perguntas novas entram nas duas edições. A regra existente da primeira página escolhe agora as rendas no tema da habitação; entram as leituras rendidas desse cartão. As duas cadeias antigas da média sem habitação saem do inventário porque deixaram de se render na primeira página e a segunda redação mudou os seus verbos; esta peça ainda não foi publicada. K16 e K17 conservam a conferência das palavras e das origens. Os contadores vêm do HTML do livro. |

## RP1c · passagem de correção, 26.09.2026

| bloco | mudança | estado | nota |
| --- | --- | --- | --- |
| rp1c | Doze cadeias antigas saem e doze cadeias rendidas entram | por ler pelo lugar de direção antes de aterrar | A terceira redação muda o RSI e as pensões; a nota da fonte passa a render-se entre parênteses, também na leitura da disparidade salarial; a preposição dos trimestres acompanha a forma do período. Só se substituem as declarações que deixaram de se render, sem alargar a procura nem as classes. As palavras e as origens continuam conferidas pela K17, e a preposição pela F1. |
