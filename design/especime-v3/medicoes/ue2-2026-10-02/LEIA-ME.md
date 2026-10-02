# UE2 · a página da União como a página dos países: relatório do construtor

*Bloco UE2, 02.10.2026, pelo brief `design/observatorio/BRIEF-UE2-a-pagina-dos-paises.md`, pela §1.143 (o UE2 na ordem dos blocos) e pela leitura a frio do K2 (o achado 6, os termos técnicos dos cartões da União). Construtor: Claude Opus 5.5 (a definição `construtor`), na worktree do ramo `ue2-2026-10-02`, sobre a cabeça de partida `ec1a00db`, sem subagentes. Cada número deste relatório está num ficheiro desta pasta, quase todos em `medidas.json`, escrito por `medir-ue2.mjs`, com o comando e um conhecido-positivo em cada medida. As medidas do `dist/` e as capturas são da construção da cabeça `8abc7bd1`; depois dela, o que a construção lê só mudou num comentário de `src/components/inicio/Faixa.astro` (um travessão que saiu), e a corrida final dos portões constrói a cabeça deste relatório. A construção de base é a da cabeça de partida, guardada fora do repositório, e o manifesto só lhe guarda o commit. Sem travessões.*

## O teste de aceitação, e onde se mede

O do §2 do brief, frase a frase:

| o que o teste pede | onde se mede | resultado |
|---|---|---|
| depois da manchete, uma secção dos países com as 10 medidas que têm série, cada uma como uma faixa à largura inteira, empilhadas, ordenadas do valor mais baixo ao mais alto com as 27 marcas, Portugal destacado e a média da União marcada, como a faixa do cartão | a F20 nova do `check:formas` (`tests/uniao/paises.mjs`), na construção e no `verify`; `faixas_dos_paises_por_edicao`, `f20_sobre_a_construcao_final` | 10 faixas em cada edição (0 antes), cada uma pela ordem da regra; 280 marcas por edição refeitas do valor pela mesma função que reconta a faixa do cartão; a F20 a 0, com 27 plantas a morder |
| em cada faixa, uma lista dobrada «Os 27 por ordem» que abre sem guião, com os 27 países pela ordem, o nome e o valor, Portugal marcado | `listas_dos_27_por_edicao`, `paises_nomeados_em_cada_faixa`, `prova_do_toque` (sem guião) | 10 listas por edição, todas fechadas no documento, com 28 itens cada (os 27 países e a média da União na sua posição); 27 países com nome em cada faixa, onde a faixa do cartão nomeia 2; sem guião, as 10 abrem ao toque no resumo, com os 28 itens à vista |
| com guião, o toque numa marca mostra o nome e o valor desse país | `toque-ue2.mjs`, `toque.json`, `prova_do_toque`; `etiquetas_do_toque_por_edicao` | 30 toques ao dedo por edição (o país mais alto, Portugal e a média da União em cada uma das 10 faixas), 30 certos; ao rato, a etiqueta aparece ao pousar e sai ao tirar; um toque fora das faixas deixa 0 etiquetas à vista; sem guião, 0 à vista das 280 que o documento traz por edição, todas escondidas |
| os 21 cartões dos dois quadros ficam na página com a anatomia do K2 | a K19 do `check:cartao`, no `verify` da corrida final; `fila_dos_cartoes_a_390` | os 21 cartões, com a ordem do K2 (a secção «Os portões», abaixo) |
| as definições dobradas de cada um dizem em palavras comuns o que o número é: 0 ocorrências dos 4 termos sem a explicação ao lado, nas duas línguas, sem mudar nenhum valor nem nenhuma etiqueta de fonte | `termos_tecnicos_nas_definicoes_da_pagina`, `definicoes_na_forma_da_uniao_rendidas`, `k16_com_as_formas` | nas 21 definições de cada edição, 7 ocorrências dos 4 termos, todas fora de parênteses antes e 0 fora de parênteses depois; 7 definições na forma em palavras comuns por edição; a K16 a 0 com 42 perguntas, 124 pedaços e 169 apoios, e as 4 plantas das formas a morder; nenhum valor nem etiqueta de fonte mudou (o portão de HTML a 0) |
| cada nome de país vem da tabela de autoridade, cada valor de um ponto da série, cada lugar recontado pelo portão como hoje | o portão de HTML (`data-pais`, `data-ponto`, `data-ponto-conta`, `data-ponto-lugar` e, nova, a contagem da tabela no título); `plantas_do_portao_de_html` | o portão a 0; 4 plantas a morder, entre elas um valor trocado numa etiqueta do toque escondida e um nome escrito à mão na lista |
| a página a 390 px lê-se de cima a baixo sem fila horizontal | `fila_dos_cartoes_a_390`, `altura_da_pagina_a_390` | antes, a fila corria de lado (uma `flex` que se desloca); depois, uma grelha de 1 coluna que não se desloca; a página passa de 1205 para 8541 px de altura em português (1198 para 8538 em inglês) |
| os três portões a 0 | `portoes/`, a corrida final | na secção «Os portões», abaixo |
| as capturas da página nas cinco larguras e nas duas edições | `capturas-antes.json`, `capturas-depois.json`, `capturas` | 10 antes e 20 depois (as 10 páginas, 4 listas abertas, 4 toques e 2 definições abertas), 0 problemas, 0 pedidos para fora, 0 páginas com transbordo horizontal |
| o relatório com o `medidas.json` | esta pasta | completos |

## O mandato, ponto por ponto

| # | o que | como ficou | a medida |
|---|---|---|---|
| 1 | A secção dos países | Em `src/views/UniaoEuropeiaView.astro`, logo a seguir à manchete, a secção «Os 27 países» («The 27 countries»), com o «27» contado da tabela de autoridade e recontado pelo portão. Uma faixa por série, pelo componente irmão da faixa do cartão, `src/components/FaixaDosPaises.astro`, com as mesmas peças e marcas: o desenho, os rótulos de Portugal e da União, as pontas, a frase do lugar de Portugal e a porta do recibo da série; e, a mais, o nome do cartão da medida, a unidade e o período da série, as etiquetas do toque escondidas, a lista dobrada e, na sobrecarga do custo da habitação, a ressalva da Comissão (a §1.140). As contas são do modelo (`faixaDaMedida()` com `ordem`, `toques` e `conta`; `faixasDaPaginaDaUniao()` para a ordem das faixas), e a vista só rende | 10 faixas e 10 listas de 28 itens por edição |
| 2 | O toque numa marca | `public/js/paises.js`: ao toque ou ao pousar do rato, mostra a etiqueta da marca mais perto do ponteiro e esconde as outras; troca `hidden` e escreve marcas de estado, e mais nada. As etiquetas vivem no documento, escondidas, e o portão lê-as como lê o resto. Uma marca empatada está no mesmo sítio das outras do seu valor, e a sua etiqueta diz o grupo inteiro («Áustria 18,6, Portugal 18,6 e Suécia 18,6») | 30 toques certos em 30 por edição; 62 etiquetas por edição dizem um empate |
| 3 | As definições em palavras comuns | 7 perguntas com os 4 termos ganham a forma `uniao` em `src/data/figuras.mjs`, que só a página da União rende: as palavras comuns primeiro e o termo da fonte entre parênteses, com as origens da pergunta do cartão e as que explicam os termos, todas já seladas no motor. As palavras são, onde as há, as das leituras dos cartões nacionais que a K17 já audita. Cada pedaço tem o seu literal na auditoria da K16, escrita e conferida por `auditoria-das-formas.mjs`. Exemplo: «Quanto crédito contraíram num ano as empresas que não são financeiras, descontado o que reembolsaram e sem contar as operações entre elas (o fluxo de crédito consolidado das sociedades não financeiras), em percentagem da dívida que tinham no fim do ano anterior, excluindo o investimento direto estrangeiro das duas parcelas?» | 0 termos fora de parênteses, nas duas edições; a K16 a 0 |
| 4 | A fila dos cartões no telemóvel | A pilha, e não um controlo: a forma `pilha` de `<Faixa>` dobra os 21 cartões numa grelha em todas as larguras, com uma coluna a 390 px, como as páginas de assunto; e a fila ganha um título («As medidas dos dois quadros da União Europeia»), porque a secção dos países passou a ficar entre ela e a manchete que a explicava. A decisão está nas capturas `depois-uniao-pt-390.png` e `depois-uniao-pt-768.png` e nas inglesas | a 390 px, 1 coluna e nenhuma deslocação lateral; a 768 px, 3 colunas, como antes |
| 5 | As réguas | A F20 nova, com 27 plantas; a função das peças de uma faixa partilhada com a F19; a contagem da tabela no portão de HTML; a K16 e a 8.4 do `check:lugar` com as formas; as decisões em vigor lidas antes de mexer | a F20 a 0, e cada planta a morder (a tabela das plantas, abaixo) |
| 6 | O relatório | este ficheiro, `medidas.json` por `medir-ue2.mjs`, as capturas em `design/especime-v3/capturas/ue2-2026-10-02/`, a resposta curta `RESPOSTA-construtor-ue2.md` e a secção do UE2 no mapa do repositório | completos |

## Onde o brief não bate com o que se mediu, e o que fiz

**A ordem das 10 medidas não pode ser a dos quadros em 2 delas.** O brief manda as faixas «pela ordem dos quadros»; das 10 séries, 8 são de medidas dos dois quadros e 2 não são (`series_de_fora_dos_quadros`: a variação homóloga do índice harmonizado e a sobrecarga do custo da habitação dos inquilinos a preço de mercado). Não parei a secção por isto: é mobília, e uma regra declarada em dois sítios que têm de bater resolve-a sem a esconder. As 8 seguem a ordem dos quadros; a dos inquilinos entra logo a seguir à sobrecarga no total, porque a Comissão diz que o total só se lê com o regime de ocupação (a ressalva da §1.140), e assim as duas faixas leem-se uma por baixo da outra; a do índice harmonizado vai para o fim. A tabela é `MEDIDAS_FORA_DOS_QUADROS` (`src/data/faixa-da-uniao.mjs`), com a razão de cada entrada, e a F20 tem a sua cópia: uma série nova fora dos quadros e fora da tabela fecha a construção, e uma tabela mudada só de um lado também. **O lugar destas duas é uma decisão do lugar de direção**, que muda numa linha de cada lado.

**As definições declaradas dos 21 cartões são as mesmas que as páginas de assunto rendem.** O brief manda explicar os termos nas definições declaradas (`src/data/figuras.mjs`) e, no §4, não mexer nas páginas de assunto. As 21 medidas são também cartões nacionais, e a dobra «O que é este número» de cada um rende a mesma pergunta: mudá-la mudava as páginas de assunto. Fiz o que as duas frases deixam fazer juntas: a forma `uniao`, como a forma `serie` da passagem UE1e, que só a página da União rende. Medido nas duas construções: 0 das 14 páginas de assunto (as sete, nas duas edições) com o `<main>` mudado (`paginas_de_assunto_com_o_main_mudado`), e o mesmo detetor vê a página da União mudada. **Se o lugar de direção quiser as palavras comuns também nos cartões das páginas de assunto, é uma mudança só**: a forma passa a ser a pergunta, e as entradas da auditoria já estão escritas.

**A medida do §0 dos termos técnicos não mede o que o teste de aceitação pede.** O guião do brief conta as seis raízes em todo o `src/data/figuras.mjs`, com os comentários e os excertos citados das fontes (que ficam como a fonte os escreve), e não apanha «consolidada»: dava 44, e dá hoje 58, porque as formas escrevem o termo entre parênteses (`termos_do_brief_no_ficheiro_das_figuras_hoje`). Medi o que o teste diz, nas definições que a página rende, com a raiz do consolidado alargada às duas formas do português e com a forma portuguesa do primeiro termo: 7 ocorrências por edição, 7 fora de parênteses antes e 0 depois. O §0 reproduz-se igual (`secao_0_do_brief_reproduzida`).

**«A célula de linguagem simples» não existe**, como o K2 já tinha medido; medi os termos antes e depois, como o prompt manda.

## As decisões do construtor, e porquê

- **A secção vem logo a seguir à manchete**, como o item 1 do brief escreve, e não depois dos 21 cartões: é o que o diretor disse que quer mais, e o leitor que pergunta onde fica Portugal entre os 27 encontra as 10 respostas sem passar pelos cartões. A fila dos cartões perdeu a manchete por cima, e por isso ganhou um título, com as palavras do conjunto que o contador de cada cartão já diz a quem o ouve.
- **A lista vai do valor mais alto para o mais baixo**, que é o sentido em que a frase conta o lugar de Portugal («6.º lugar, do mais alto para o mais baixo»): Portugal aparece na lista no lugar que a frase diz, salvo quando a média da União lhe fica acima ou quando um país com o mesmo valor vem antes dele na ordem da série. Os valores iguais seguem a ordem da série, e o resumo diz o sentido («Os 27 por ordem, do mais alto para o mais baixo»), porque uma lista ordenada que não diz por onde começa lê-se das duas maneiras. **Sem números de posição**: contariam a média da União como um país e discordariam do lugar que a frase diz.
- **O toque escolhe a marca mais perto do ponteiro**, na horizontal, porque um dedo não acerta num ponto de 7 px; a etiqueta aparece num andar próprio por baixo do desenho, sem tapar o nome de Portugal. O desenho continua `aria-hidden` e fora do caminho do teclado: a lista dobrada é o caminho de quem não tem ponteiro (a decisão 2 do §5). Não há frase de instrução (a norma, §1.4): com guião, o cursor diz que o desenho responde.
- **Uma marca empatada mostra o grupo**: duas marcas com o mesmo valor estão no mesmo sítio, e um toque ali não pode escolher entre elas. A primeira corrida da prova do toque apanhou-o (num empate, o toque mostrava a etiqueta do outro país do mesmo valor), e a etiqueta passou a dizer os pontos com esse valor, pela ordem da série, com uma planta na F20h.
- **A fila em pilha de uma coluna a 390 px**: colunas mais estreitas foram tentadas numa construção intermédia e recusadas pela captura (o «(dado provisório)» pisava o valor, e a palavra do estado partia-se em quatro linhas). A partir de 768 px a grelha é a de antes.
- **As palavras das definições** vêm das leituras dos cartões nacionais que a K17 já audita (o que se paga pelo trabalho a dividir pelo que ele produz; descontado o que reembolsaram; a parte das exportações dos países da OCDE e dos da União que não são da OCDE), e o termo da fonte fica entre parênteses. «Consolidado» diz-se pelo que as descrições do Eurostat dos mesmos setores dizem dos dados consolidados («excluding intra-sector transactions»; «transactions within the same sector are not taken into account»), que é uma leitura escrita na auditoria e que a leitura a frio pode reler.
- **A seta de uma leitura aberta**: a regra que a rodava apanhava também as setas dos excertos fechados lá dentro, e a captura da definição aberta mostrou-o; passou a rodar só a da própria dobra.
- **Nenhuma cor nas faixas e nenhum «melhor» nem «pior»** (a identidade §2 e a §1.130): a ordem é a dos valores, e a frase diz um lugar.

## Os portões que mudaram de forma, e a planta que prova que ainda mordem

| portão ou célula | o que mudou | classe | a planta |
|---|---|---|---|
| `gate:html`, a tabela dos nomes | uma comparação nova: `data-tabela-dos-paises="conta"`, o «27» do título, recontado da tabela de autoridade | **P** | `ue2-portao-conta-da-tabela-errada` morde; e `ue2-portao-valor-escondido-trocado` e `ue2-portao-nome-da-lista-a-mao` provam que o portão lê as etiquetas escondidas e a lista como o resto (`plantas-portoes-ue2.json`, os bytes repostos) |
| F19 do `check:formas` e K18 do `check:cartao` | o corpo do laço de `conferirFaixas()` passou a função, `conferirPecasDaFaixa()`, sem mudar uma comparação, para a F20 recontar a faixa à largura inteira pelo mesmo código | **P** | as plantas da F19 continuam a morder na construção (o registo do `build` da corrida final) |
| F20 do `check:formas`, nova | a secção, a ordem, as peças, o cabeçalho, as etiquetas do toque, a lista e a ressalva | **P** nos valores, nos nomes, na ordem e na ressalva · **M** na forma da secção | 27 plantas a morder, entre elas as quatro do brief (um país a menos, um nome fora da tabela, uma ordem trocada, um valor diferente do ponto) |
| K16 do `check:cartao` | as formas auditam-se numa entrada própria da auditoria, com as regras da pergunta | **P** | 4 plantas das formas a morder (`k16_com_as_formas`) |
| a guarda das origens (`conferirOrigensDeclaradas`) | uma forma cita todas as origens da pergunta do cartão | **P** | 2 plantas a morder, com o controlo a passar (`guarda_das_origens_da_forma`) |
| 8.4 do `check:lugar` | escolhe a forma pela rota, e conta as origens da forma | **P** | `ue2-lugar-pergunta-do-cartao-na-pagina-da-uniao` morde |
| `check:voz` | 14 linhas novas no inventário; a palavra da fonte «low reliability» (a marca «u») como exceção de contexto, só na página da União | **M** | o portão a 0 com as linhas declaradas; antes delas e da exceção, uma corrida intermédia fechou nas perguntas por classificar e na palavra da fonte (`voz-intermedio.log`, código em `voz-intermedio.codigo`) |

## As plantas

- **F20**, em memória, sobre as duas edições da página construída, e a da tabela uma vez: 27 em 27 a morder (`f20_sobre_a_construcao_final`).
- **K16 das formas**, em memória: 4 em 4 (`k16_com_as_formas`).
- **A guarda das origens das formas**, em memória: 2 em 2 (`guarda_das_origens_da_forma`).
- **O portão de HTML e a 8.4**, sobre `dist/`, cada uma com o código 1, as mordidas previstas e os bytes repostos: 4 em 4 (`plantas_do_portao_de_html`, `plantas-portoes-ue2.json`, um registo por planta nesta pasta).

## Os commits

```
3db55605 UE2: a secção «Os 27 países» na página da União, a fila dos cartões em pilha e o toque numa marca
c2f3baaa UE2: a F20, a secção dos países refeita dos pontos pela função da faixa do cartão
f066ebfb UE2: as definições dos cartões da União em palavras comuns, com o termo da fonte entre parênteses
f47c37b7 UE2: o inventário das frases, a revisão do bloco e a exceção da palavra da fonte
c2d2abc6 UE2: a etiqueta do toque de uma marca empatada diz o grupo inteiro
3bd7020b UE2: as plantas do portão de HTML, a prova do toque, a primeira leitura do contador e as decisões em vigor
bf58887c UE2: o captor e o medidor do bloco, e as capturas de antes nas cinco larguras
443671c5 UE2: o título da fila dos 21 cartões, e só a seta da própria dobra roda
8abc7bd1 UE2: o mapa do repositório com a secção do bloco, e a captura de uma definição aberta
04b5a2f2 UE2: as capturas de depois, a prova do toque, as plantas, as medidas e as decisões em vigor
```

e o commit deste relatório, com a resposta curta; e o commit seguinte, com os códigos da corrida final dos portões, os registos dela sem o caminho da máquina e a secção «Os portões» a dizê-los.

## As capturas

Em `design/especime-v3/capturas/ue2-2026-10-02/`: `antes-uniao-<língua>-<largura>.png` (10, da construção de base) e `depois-uniao-<língua>-<largura>.png` (10), nas larguras 390, 768, 1 024, 1 280 e 1 600 px; `depois-lista-aberta-<língua>-<390|1280>.png`, a lista dos preços da habitação aberta, com os pontos com marca da fonte; `depois-toque-<língua>-390-<el|pt>.png`, o toque na Grécia da dívida pública e o toque em Portugal na pobreza ou exclusão, onde a etiqueta diz o empate; `depois-definicao-<língua>-390.png`, a definição do fluxo de crédito às empresas aberta, em palavras comuns. Os resumos sha256 e as medidas de cada página estão nos dois manifestos.

## As decisões em vigor nos ficheiros tocados

Lidas antes de mexer (`decisoes-em-vigor-antes.txt`) e outra vez sobre os ficheiros de texto que o bloco tocou (`decisoes-em-vigor-depois.txt`): 48 decisões citadas em 24 ficheiros, quase todas pelo mapa do repositório e pelo inventário das frases. As que o bloco tocou de perto ficam em vigor: a §1.140 e a §1.124 (a média da União na sobrecarga só com a ressalva da Comissão: a faixa da sobrecarga na secção dos países leva-a, e a F20j exige-a nela e em mais nenhuma); a §1.130 (sem «melhor» nem «pior»); a §1.143 (a ordem dos blocos e uma coisa, um lugar: as faixas são da página da União e a F20a recusa-as noutra página); a §1.86 (a identidade: os tipos, as cores e a marca da fonte são os da faixa do cartão); e a §1.151 (a anatomia do K2 e o espaço antes de «%»). O modo `--intervalo` do guião falhou neste bloco, porque o intervalo tem PNG e o guião tenta lê-los como texto (`decisoes-em-vigor-intervalo-falhou.txt`); correu-se sobre a lista dos ficheiros de texto (`ficheiros-tocados.txt`).

## O custo

Duas leituras do contador de símbolos restantes que a ferramenta mostra ao agente, em `custo-inicio.json` e `custo-fim.json`: 904 094 símbolos e 5483 segundos até à escrita deste relatório (`medidas.json`, `simbolos_gastos_ate_ao_relatorio` e `segundos_ate_ao_relatorio`). A sessão foi uma só, sem resumo a meio. O modelo foi o Claude Opus 5.5 em todo o bloco, sem subagentes. A semana da subscrição do Claude estava a 16 por cento no início (`custo-inicio.json`).

## Os portões

A corrida final corre por `sh scripts/leituras/portoes.sh`, com a tranca da máquina, na cabeça do commit deste relatório, para `portoes/`; os códigos entram no commit seguinte, com esta secção a dizê-los.

## O que ficou por fazer, e porquê

- **As palavras comuns só na página da União.** As perguntas dos mesmos cartões nas páginas de assunto continuam com os termos da fonte sem explicação ao lado, porque o §4 do brief não deixa mexer nelas; é uma decisão do lugar de direção, e a mudança é pequena (acima).
- **Outros termos das 21 definições.** Fiz os 4 termos do §0 e o que a leitura do K2 apontou com eles (o fluxo de crédito, as economias avançadas e a OCDE). Uma leitura em palavras comuns das 21 aponta mais: «população ativa» (as três taxas de desemprego), «balança corrente» e «média móvel de três anos para trás», «privação material e social grave» e «intensidade de trabalho muito baixa», «rendimento disponível» e «líquido de subsídios à habitação». Há literais já selados para quase todos (o glossário da taxa de atividade, a descrição do Eurostat da balança corrente, o glossário do risco de pobreza ou exclusão, o do rendimento disponível); ficam como proposta para um bloco pequeno, pela mesma forma.
- **A descrição da página no `<head>`** continua a dizer só os dois quadros; dizer também os países mexe no inventário e no cartão de partilha, e fica como proposta.
- **A régua das frases não lê os blocos com marca de origem nesta rota**, que não está em `ROTAS_COM_ORIGEM_LIDA`: o título da secção, os resumos das listas, os itens e as etiquetas não passam pelo inventário. Pôr a rota na lista é um bloco de classificação à parte.
- **A página a 390 px é longa**: 8541 px, das quais a fila dos 21 cartões ocupa 3724. É o custo de ler tudo de cima a baixo, que o teste de aceitação pede; um cartão mais baixo na pilha de uma coluna é uma passagem de forma à parte.
- **O guião das decisões em vigor** podia saltar os ficheiros binários do intervalo em vez de falhar; é uma ferramenta do lugar de direção, e não lhe toquei.
- **A leitura a frio** por outra família, e a releitura do diff do inventário (o bloco `ue2` está «por ler» em `critica/REVISOES-DO-INVENTARIO.md`), fazem-se antes da fusão.
