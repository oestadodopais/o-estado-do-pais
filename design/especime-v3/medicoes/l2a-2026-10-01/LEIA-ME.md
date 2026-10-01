# L2a · o mapa primeiro: relatório do construtor

*Bloco L2a, 01.10.2026, pelo brief `design/observatorio/BRIEF-L2a-o-mapa-primeiro.md` e pela §1.149. Construtor: Claude Opus 5.5 (a definição `construtor`), na worktree do ramo `l2a-2026-10-01`, sobre `main` em `d0416b3c`. Cada número deste relatório está num ficheiro desta pasta, quase todos em `medidas.json`, escrito por `medir-l2a.py`. Sem travessões.*

## O teste de aceitação, e onde se mede

O do §2 do brief, à letra, ponto por ponto:

| o que o teste pede | onde se mede | resultado |
|---|---|---|
| em «Lugares», em todas as larguras, a pesquisa, o mapa e só depois as listas | a L2A1 do `check:navegacao` (a ordem do documento, nas duas edições) e «a ordem» da célula no navegador (o que se vê, nas cinco larguras e nas duas edições: `navegador.json`) | as peças da grelha por esta ordem: pesquisa, mapa, regiões, distritos (`ordem_em_lugares` em `medidas.json`: 1 peça antes do mapa, contra as 3 do §0 do brief) |
| as duas listas são duas linhas fechadas, um `<details>` cada, com o nome da secção e a contagem no `<summary>`, que abrem sem guião e mostram os mesmos nomes com as mesmas portas | a L2A2 (estática) e «as gavetas» no navegador, com o JavaScript desligado | 2 gavetas fechadas; 9 nomes na lista das regiões e 9 no `<summary>`; 29 nomes na dos distritos e das ilhas e 29 no `<summary>`; ao teclado, o Enter abre a lista das regiões com os 9 nomes à vista e o segundo Enter fecha-a, nas duas edições |
| nas duas colunas a partir de 1 024 px, o mapa à direita e as listas fechadas à esquerda, por baixo da pesquisa | «a ordem» no navegador, a 1024, 1280 e 1600 | o mapa à direita das gavetas e as gavetas por baixo da pesquisa, nas duas edições |
| a primeira página sem mapa inteiro nem pesquisa | a L2A3, a R4 do `check:mapa` e o cartão `05-mapa.html` do feixe | 0 pesquisas e 0 mapas inteiros na primeira página |
| a porta «Lugares» de «Por onde começar» com um mapa pequeno como sinal | a L2A4, «a porta» no navegador e a R6 do `check:mapa` | 1 sinal na primeira página e 1 nos temas, só na porta «Lugares», com o texto alternativo da edição; o toque na porta abre «Lugares» da mesma edição |
| os dois mapas de «As medidas dos concelhos» e as suas tabelas ficam como estão | a célula N1M do `check:navegacao` (`tests/inicio/concelhos-nos-lugares.mjs`), que não mudou | verde |
| as células que protegem a pesquisa, o mapa e as listas mudam de forma com uma planta cada | a tabela das réguas, abaixo | 14 plantas da célula nova, 4 da célula no navegador, 23 do `check:mapa` (quatro delas novas), 2 da voz e 1 do feixe, todas a morder |
| os três portões a 0 | `portoes/`, na cabeça `a66ab832`, e `portoes-intermedio/`, na cabeça `86635e62` | 0, 0 e 0 nas duas corridas |
| as capturas de «Lugares» e da primeira página nas cinco larguras e nas duas edições | `capturas-l2a.json` | 22 capturas e 0 problemas, em `design/especime-v3/capturas/l2a-2026-10-01/` |

## O mandato, ponto por ponto

| # | o que | como ficou | a medida |
|---|---|---|---|
| 1.º | O mapa logo a seguir à pesquisa em «Lugares» | `src/views/LugaresView.astro`: as quatro peças passam a filhas diretas da grelha, pela ordem do telemóvel; a folha (`src/styles/lugar.css`) dá-lhes áreas a partir de 1 024 px, com o mapa na coluna da direita nas quatro filas e a quarta fila a ficar com a sobra da altura dele, para a pesquisa e as gavetas ficarem juntas no topo da coluna da esquerda. A menção da fonte veio com o mapa (`LegendaDoMapa.astro`, por baixo dele) | a captura de «Lugares» a 390 mede 3762 px de altura, contra 5321 na do N1 |
| 2.º | As listas dobradas | `Gaveta.astro` (o `<details>` da casa) ganha a ranhura `nome`, e cada lista vive numa gaveta com o `<h2>` da secção e a contagem no `<summary>`. A contagem não se escreve: é a chave da prova que conta a lista (`regioes_total` e `mapa_unidades`), que o portão de HTML reconta, sem porta porque a porta de cada uma passou a ser a própria lista, nesta página | as listas contam 9 e 29, e os `<summary>` dizem 9 e 29 |
| 3.º | A primeira página sem o mapa inteiro nem a pesquisa | `src/views/HomeView.astro` perde a secção `pp-lugares`; a porta «Lugares» do índice dos assuntos (`IndiceDosAssuntos.astro`, que a primeira página e a dos temas partilham) leva o sinal, declarado na entrada em `src/data/primeira-pagina.mjs`. O sinal (`SinalDosLugares.astro`, com a conta em `src/lib/sinal-dos-lugares.mjs`) é o contorno do país tirado das 29 unidades de `mapa/pais.json`, com as duas molduras arrumadas como no mapa inteiro, sem dados, com o texto alternativo de `strings.mjs` nas duas línguas | a captura da primeira página a 390 mede 6609 px, contra 7194 na do N1 |
| 4.º | As réguas | ver a tabela das réguas e a lista das decisões em vigor | as plantas, abaixo |
| 5.º | O relatório | este ficheiro, `medidas.json` por `medir-l2a.py`, as capturas | completos |

## O ponto onde o brief encontrou uma proteção de fonte

O brief pede o sinal «sem dados nem legenda». O contorno sai do mesmo artefacto do mapa inteiro, a CAOP 2025 da Direção-Geral do Território, e a licença dessa informação tem uma obrigação só, a menção da entidade proprietária, que a Emenda 20e manda escrever onde o desenho está (`mapa/manifest.json`, campo `fonte.licenca_evidencia`; e `LegendaDoMapa.astro`: «Tirá-la é uma decisão do diretor com o advogado, e não um acerto de forma»). Na língua da casa, a «legenda do mapa» é hoje exatamente essa menção. Não parei o bloco neste ponto, porque havia uma forma de cumprir as duas coisas: o sinal saiu sem legenda de valores e sem dados, e a menção da fonte vai escrita ao lado dele, no mesmo item do índice e fora da ligação, na letra da mobília de proveniência. A R6 do `check:mapa` passou a exigi-la onde houver um sinal, com a planta «R6 (o sinal sem a menção)». Se o lugar de direção preferir um sinal que não seja desenho da Carta, ou decidir a menção com o advogado, a mudança é a linha da menção em `IndiceDosAssuntos.astro` e a metade (b') da R6.

## O que a construção encontrou e decidiu, fora da letra do brief

- **A porta «O mapa dos concelhos» das páginas de distrito** abria `/#mapa`, a âncora do mapa da primeira página, e o portão de HTML recusou-a nas 58 páginas de distrito das duas edições assim que o mapa saiu de lá (`gate-html-ancora-do-mapa-primeira-construcao.txt`, da primeira construção do bloco). Saiu: a porta de cima, «Lugares», já abre a página onde o mapa passou a estar, logo a seguir à pesquisa, e duas portas para a mesma página são uma (a regra que a peça 2 do B1 escreveu nessa mesma linha). A cadeia `mapaLink` saiu das duas edições de `strings.mjs`.
- **A menção da fonte veio com o mapa para «Lugares».** Antes, o mapa de «Lugares» não tinha menção ao pé dele (só a dos dois mapas das medidas, muito mais abaixo), e a sua `aria-describedby` apontava para um `id` que a página não tinha. A R6 exige agora a menção na legenda do mapa, e não algures na página (planta «R6 (a menção longe do mapa)»).
- **A porta da contagem do mapa para «Lugares» (`portaLugares`) saiu** de `MapaRespira.astro` e de `LugarDoNome.astro`, com as regras `.pais-mapa` e `.pais-porta-lugares` de `pais.css`: só a primeira página a pedia, e em «Lugares» seria uma porta para a página em que se está. A porta de voltar ao país, que o guião segura, passa a ter «Lugares» como destino sem guião.
- **A porta de `regioes_total` passa a ser a lista das regiões em «Lugares»** (nenhuma página a rendia), e a glosa de `mapa_unidades` muda de palavras: a antiga está retirada no inventário desde a peça 2 do B1 e dizia «unidades», que o §6 da estrutura tira do texto do leitor.
- **A lista fechada da voz da primeira página e dos temas** deixa de dispensar o mapa, a legenda e a fila da pesquisa, e deixa de permitir as três cadeias da pesquisa; dispensa a menção da fonte do sinal só quando o texto é, carácter a carácter, o do manifesto do motor, lido por leitor próprio.
- **O ar entre as duas gavetas**: cada gaveta é uma `<section>`, e `site.css` dá a cada secção um `padding-top` de secção; a primeira captura mostrou as duas linhas afastadas, e a medição no navegador deu-lhe a causa. Saiu nas duas gavetas e só nelas.

## As réguas que mudaram de forma, o que protegem, e a planta de cada uma

| régua | classe | a forma nova | o que conserva | plantas |
|---|---|---|---|---|
| `check:mapa` R4 | M | as 29 áreas contam-se na página dos lugares, e a primeira página e a dos temas não podem ter nenhuma | cada unidade uma área, cada área a sua porta; e uma coisa, um lugar | «R4» mudada para «Lugares»; «R4 (o mapa de volta à primeira página)», nova |
| `check:mapa` R5 | M | lê o mapa de «Lugares» | nenhuma ligação debaixo de `role="img"` (o sinal é imagem e não tem ligações) | «R5» mudada para «Lugares» |
| `check:mapa` R6 | P | a figura e a legenda do mapa de «Lugares», com a menção na legenda; e, nova, a menção no item de cada sinal, fora da ligação | a única obrigação da licença da Carta, escrita onde o desenho está | «R6» e «R6 (a menção)» mudadas para «Lugares»; «R6 (a menção longe do mapa)» e «R6 (o sinal sem a menção)», novas |
| `check:mapa` R8 | P | cada área do mapa de «Lugares» pede o ficheiro da sua unidade | o segundo nível servido é o artefacto | «R8 (a área a pedir outro ficheiro)» mudada para «Lugares» |
| `check:navegacao`, a célula nova `tests/inicio/mapa-primeiro.mjs` | M nas formas, P nas contagens | L2A1 a ordem da grelha; L2A2 as gavetas fechadas, o título e a contagem no `<summary>`, a contagem igual aos nomes, os nomes e as portas da carta; L2A3 a primeira página sem o mapa e a pesquisa; L2A4 o sinal só na porta «Lugares», imagem com texto alternativo, sem ligações, texto nem números, e a menção no item | a ordem decidida, a contagem dos nomes das listas (9 e 29) e as portas, uma coisa num lugar só | 14, todas a morder (`navegacao.json`) |
| `check:primeira`: `tests/inicio/pesquisa-da-primeira.mjs` passa a `tests/inicio/lugares-no-navegador.mjs` | M | no Chromium: a porta com o sinal à vista e o toque a abrir «Lugares»; a ordem visível nas cinco larguras e nas duas edições, com as gavetas fechadas; as gavetas a abrir e fechar ao teclado sem guião; o caminho sem guião da pesquisa, a partir de «Lugares» | o que é interativo prova-se a interagir (§1.124); a pesquisa com guião continua na H15 do `check:alvos` | 4, todas a morder (`navegador.json`) |
| `check:voz`, a lista fechada do país (`scripts/voz-pais.mjs`) | M | menos dispensas e menos cadeias permitidas; a menção do sinal dispensada só por comparação com o manifesto | a prosa da primeira página e dos temas | 2, todas a morder, com o original intacto por sha256 (`plantas-voz-l2a.json`) |
| `check:indice` I11 | M | o par número e palavra mede-se em «Lugares», onde o mapa passou a estar | o espaço entre «308» e «concelhos» no ecrã | a planta da própria célula apanhou 1 de 1 em cada edição |
| `design:feixe`, o cartão `05-mapa.html` | M | lê o mapa de `dist/lugares/index.html`, exige o sinal na porta da primeira página e nenhum mapa inteiro lá | o retrato do mapa por unidades | «feixe-porta» de `tests/pais/portoes.mjs`, mudada para tirar o sinal: o feixe sai com 1 e «perdeu o sinal do mapa», com a página reposta (`plantas-portoes-feixe-porta.json`) |
| `check:alvos` H6 | M | o seletor da ligação `.pais-porta-lugares`, que já não existe, sai da lista | os alvos das portas | não pede planta: tira um nome que não casava com nada |

O `check:lugares` não mudou: não lê a página dos lugares, e a sua C1 continua a contar 308 concelhos, 29 distritos e ilhas e 9 regiões nos extratos da Carta; a contagem dos nomes nas listas da página passou a ser da L2A2. A E7 do `check:navegacao`, que compara os títulos de «Lugares» com as secções do índice, não mudou e continua verde: os títulos estão dentro dos `<summary>`.

## O desenho do sinal, medido

O contorno é a fronteira da união das 29 unidades, lida pelas arestas: das 5537 arestas dos caminhos, 3781 têm a sua gémea inversa (as fronteiras interiores, partilhadas ponto a ponto pelo motor) e 1756 são a fronteira, em 90 linhas. Simplificado ao tamanho do sinal, ficam 179 pontos e 1432 bytes no atributo `d`, os mesmos na função e na página. As ilhas que ficam abaixo de três pontos distintos desenham-se como um ponto do tamanho do traço, e não desaparecem.

## Os commits

- `ec3d7671` o mapa primeiro em «Lugares», as listas dobradas e a primeira página com a porta e o sinal
- `c35686ec` o esqueleto do relatório
- `79703683` a voz das páginas do país sem o mapa e a pesquisa, e as seis cadeias novas no inventário
- `274baf31` a célula do mapa primeiro no `check:navegacao`
- `757bec23` a célula da pesquisa da primeira página muda de forma, no navegador
- `86635e62` a I11 segue o mapa, e dois seletores e uma planta deixam a porta que saiu
- `488f62c4` as duas gavetas sem o ar de secção entre elas
- `1be6d6cc` as capturas, as plantas e as medidas
- `a66ab832` o relatório do construtor, a resposta curta e as medidas com o custo e a corrida intermédia dos portões
- o commit seguinte: os códigos e os registos da corrida final dos portões, e este relatório com eles

## Os portões

Corrida final, por `scripts/leituras/portoes.sh` (a tranca da máquina), na cabeça `a66ab832`, a do commit do relatório e da resposta curta (`portoes/cabeca`, e a mesma em `portoes/cabeca.fim`, com a árvore limpa no fim em `portoes/estado.fim`): `build` 0 em 120 s, `verify` 0 em 719 s, `typecheck` 0 em 0 s, cada código lido do seu ficheiro. Os registos estão ao lado, com os caminhos da máquina tornados relativos. O commit que os traz só acrescenta ficheiros desta pasta.

Corrida intermédia, pelo mesmo guião, na cabeça `86635e62` (`portoes-intermedio/`): `build` 0 em 115 s, `verify` 0 em 702 s, `typecheck` 0 em 1 s.

## As capturas

Em `design/especime-v3/capturas/l2a-2026-10-01/`, sobre a construção da cabeça `488f62c4`: `lugares-<pt|en>-<largura>.png` e `primeira-<pt|en>-<largura>.png` nas cinco larguras, e `lugares-regioes-abertas-<pt|en>-390.png` com a gaveta das regiões aberta. O manifesto `capturas-l2a.json` guarda o resumo sha256 de cada imagem e as medidas de cada página: nenhum transbordo, nenhum pedido para fora, 0 nomes das listas à vista com as gavetas fechadas e 9 com a das regiões aberta.

## As decisões em vigor nos ficheiros tocados

`decisoes-em-vigor.txt`, de `python3 scripts/leituras/decisoes-em-vigor.py --intervalo d0416b3c..488f62c4`. As citadas perto do que mudou, e o que lhes acontece: a §1.84 (a legenda do mapa ao pé dele) fica, e a legenda foi com o mapa; a §1.124 (o que é interativo prova-se a interagir) fica, na célula no navegador; a §1.133 (o leitor comum primeiro) fica; a §1.143 (uma coisa, um lugar) fica, e ganha a L2A3 e a metade nova da R4; a §1.149 é a deste bloco; a §1.39 e a §1.140 aparecem por vizinhança de linhas e não são tocadas. O achado D7 de 21.09.2026 fica: a grelha de duas colunas conserva-se a partir de 1 024 px. A medida do D7 pedia que o primeiro ecrã de um portátil mostrasse a busca, as nove regiões e o mapa; com as listas dobradas pela §1.149, mostra a busca, as duas gavetas e o topo do mapa (as caixas medidas a 1280 estão em `navegador.json`).

## O custo

Símbolos: 653000 até à corrida final dos portões, a diferença entre o contador de símbolos restantes que a ferramenta mostra ao agente no início da sessão e depois dessa corrida; as duas leituras estão em `custo-l2a.json` desde a passagem L2a-b, e a diferença em `medidas.json`, com o comando. Segundos: os dos portões, acima. Modelo: Claude Opus 5.5 do princípio ao fim; nenhum subagente.

## O que ficou por fazer

- **Seis réguas de `tests/inicio/` que se correm à mão e liam o mapa da primeira página** (`correcoes-a.mjs`, `lista.mjs`, `mapa-distritos.mjs`, `mapa-unidades.mjs`, `matriz.mjs`, e `tests/municipio/correcoes-c.mjs`): nenhuma está no `build`, no `verify` nem na corrida «portão», e todas abrem a primeira página à procura do mapa ou da pesquisa. Precisam de mudar para «Lugares» antes de voltarem a correr; não o fiz para não gastar a semana em réguas que nenhum portão corre.
- **A menção da fonte do sinal** espera a palavra do lugar de direção (o ponto acima).
- **A leitura a frio** pelo Codex, e a entrada `l2a` em `critica/REVISOES-DO-INVENTARIO.md`, que está «por ler».
- **O mapa do repositório para construtores** não ganhou a secção do L2a: as citações que tocam neste bloco (a R4 e a R6 do `check:mapa`, o cartão `05-mapa.html` do feixe, a célula da pesquisa da primeira página) estão descritas aqui.

## L2a-b · a passagem depois da leitura a frio, 01.10.2026

*A leitura a frio do Codex gpt-6.1-sol está em `design/especime-v3/critica/LEITURA-l2a-2026-10-01.md`, com a triagem do lugar de direção no cabeçalho: os achados `1`, `2`, `3`, `10` e `11` são as plantas; o `7`, o `8` e o `9` são de outros blocos (o K2 e o L2b); esta passagem trata o `4`, o `5`, o `6`, o `13` e o `14`. Construtor: Claude Opus 5.5. Os registos da passagem estão em `l2a-b/`, e as medidas novas em `medidas.json`, com o prefixo `l2a_b_` ou junto das que corrigem.*

- **`4` · a pesquisa sem guião.** Medido: com o JavaScript desligado, «mourao» e Enter levam à página dos lugares da mesma edição, com 200 e o que se escreveu no endereço, e com 0 resultados à vista; a página é estática e não procura. A célula `tests/inicio/lugares-no-navegador.mjs` regista-o sem o dar por procura, e mede à parte o caminho sem guião para um concelho, que são as gavetas: a porta do distrito de Mourão está escondida com a gaveta dos distritos e das ilhas fechada e à vista com ela aberta, abre a página do distrito, e a porta de Mourão da lista dos concelhos abre a página dele, com 200, nas duas edições. Uma diferença do que se pediu, medida: a gaveta das regiões não leva a um concelho, porque as 9 páginas das regiões têm 0 portas para concelhos (o mesmo detetor acha 28 na página do distrito de Évora). O caminho sem guião para um concelho é, portanto, a gaveta dos distritos e das ilhas; as áreas do mapa são as mesmas portas dos distritos. Planta nova: a porta do distrito de Mourão tirada da gaveta, e o caminho deixa de chegar a Mourão.
- **`5` · a menção ao pé do mapa.** A R6 do `check:mapa` exige a legenda do mapa de «Lugares», com a menção, dentro do contentor do mapa ou logo a seguir à figura, e já não em qualquer ponto da página. A planta «R6 (a menção longe do mapa)» move a legenda inteira para o fim do `<main>` em vez de a apagar, e morde: 23 plantas em 23 (`l2a-b/check-mapa-vermelhos.txt`). A mesma planta corrida contra a R6 antiga não morde (`l2a-b/r6-antiga-com-a-planta-nova.txt`, 1 planta que não apanhou). Fica de fora a página de um distrito, onde a menção vive no bloco da proveniência, depois da lista dos concelhos: exigir-lhe a proximidade é mudar essa página, e fica para o lugar de direção.
- **`6` · as duas gavetas ao teclado.** A prova sem guião abre e fecha as duas gavetas, nas duas edições: 29 nomes à vista com a dos distritos e das ilhas aberta, e 0 fechada. Planta nova: o `<summary>` dos distritos e das ilhas trocado por um bloco qualquer. A célula tem agora 6 plantas, todas a morder (`l2a-b/navegador.json`).
- **`13` · o conhecido-positivo do contorno.** Só conta com as três contagens lidas; corrido com o módulo do contorno trocado por um que não existe, os cinco ficam por encontrar (`l2a-b/prova-do-conhecido-positivo-do-contorno.txt`).
- **`14` · a igualdade do sinal.** Compara o atributo `d` inteiro, carácter a carácter, e o conhecido-positivo é a mesma comparação a recusar uma cópia com um algarismo trocado e o mesmo comprimento. Resultado: igual («sim» em `medidas.json`, com o sha256 do desenho ao lado).

**Os commits da passagem:** `dd57abb1` (os achados `13` e `14`), `be4fe4e0` (o `5`), `7a0f963c` (o `4` e o `6`), `401d0576` (esta secção, a resposta curta e as medidas), e o seguinte, com os códigos dos portões.

**Os portões:** por `scripts/leituras/portoes.sh` (a tranca da máquina), na cabeça `401d0576`, a mesma no fim, com a árvore limpa (`portoes/l2a-b/cabeca`, `cabeca.fim` e `estado.fim`): `build` 0 em 115 s, `verify` 0 em 706 s, `typecheck` 0 em 1 s, cada código lido do seu ficheiro, com os registos ao lado e os caminhos da máquina tornados relativos. O commit que os traz só acrescenta ficheiros desta pasta.

**O custo:** 36677 símbolos nesta passagem até ao relatório, a diferença entre as duas leituras do contador de símbolos restantes guardadas em `custo-l2a-b.json` (a primeira à chegada da mensagem do lugar de direção, a segunda ao escrever esta secção); os segundos dos portões estão acima. Modelo: Claude Opus 5.5, sem subagentes.
