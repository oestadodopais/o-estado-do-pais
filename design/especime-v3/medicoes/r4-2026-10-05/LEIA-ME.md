# R4 · as palavras correntes em cada número · o relatório do construtor

*Construtor: Claude Opus 5.5 (a definição `construtor`). Mandato: o prompt do lugar de direção para o bloco R4, sobre o brief `design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md`. Worktree própria, ramo `r4-2026-10-05`, a partir de `557844fe`. Cada número deste relatório está num ficheiro desta pasta, escrito por um guião ao lado: `medidas.json` (pelo `medir-r4.mjs`), `l1-r4.json` (pelo `medir-l1-r4.mjs`), `capturas-r4.json` (pelo `captar-r4.mjs`), `plantas-portoes-r4.json`, `planta-teto-l1-r4.json`, `series-s6.json`, `primeira-v1r4.json` e `brief-r4-reproduzido.json`. Nenhum `push`.*

## O que o bloco fez

O recibo de cada linha do livro-razão abre agora com o nome do recibo (o do projeto, ou o da família, com o concelho), o nome com que a fonte publica a medida, entre aspas e na língua dela, e a frase «O que é este número», a mesma que o cartão mostra; o valor vem a seguir. O recibo de cada série no tempo diz o que a série é e o que o último ponto quer dizer em relação ao mesmo período de há um ano. A primeira página explica, por baixo do veredicto, o que cada valor de referência mede e de que lado Portugal ficou, com os de dentro numa porta dobrada. Tudo nas duas edições, cada frase nova na auditoria, sem algarismos que não venham de uma linha ou de um ponto, e cada coisa nova com quem a confere e com plantas que provam que a conferência morde.

## O §0 do brief, reproduzido

O guião do brief, corrido de novo sobre a cabeça presa (`OEDP_MEDIDAS_JSON=… python3 design/observatorio/medidas/BRIEF-R4.py`), dá as mesmas medidas que o ficheiro do brief: 11 de 11 iguais (`brief-r4-reproduzido.json`, comparado com `design/observatorio/medidas/BRIEF-R4.json`).

## A tabela do mandato

| ponto do brief | o que ficou | a medida |
|---|---|---|
| 1 · o recibo de uma linha diz o que o número é | o título é o nome do recibo, por baixo o nome na fonte (a abrir o documento quando a linha diz onde ele está), e a frase «O que é este número»; nas linhas com cartão, as duas metades da leitura, a que diz o que o número é e a que compara | o portão de HTML conta a frase em 6 390 recibos, todos os construídos; a K17 confere-a em 6 390 de 6 390; as plantas `r4-recibo-sem-frase`, `r4-frase-de-outra-linha` e `r4-titulo-sem-nome` mordem |
| 2 · as famílias sem frase ganham uma, provada | 3 195 linhas com frase: 48 pelo cartão, 2 772 pela medida dos concelhos, 375 pela família; 181 entradas na auditoria, 293 partes, 455 apoios | 0 linhas sem frase; a K17 morde 25 de 25 plantas, entre elas «uma linha sem frase» e «uma frase com um algarismo» |
| 3 · o recibo de uma série diz o que o último ponto quer dizer | 24 séries com a frase «o que é» (14 pela linha, 10 com frase escrita e provada); a frase do último ponto em 48 recibos, todas a comparar com o mesmo período de há um ano (24; com o ponto anterior, 0) | a S6 morde as plantas do lado trocado e do período errado, e mais duas: 13 plantas da S6 (`series-s6.json`), todas a morder, 4 delas do R4 (o `check:series` tem 28 ao todo, nas seis células; a medida do R4 contava estas como se fossem da S6, e a R4-b corrigiu-a); a K17 confere a frase «o que é» em 48 de 48 recibos |
| 4 · a primeira página explica os valores de referência | por baixo do veredicto, 4 valores de fora à vista e 9 de dentro numa porta dobrada, nas duas edições (4 e 9 na inglesa), cada um com o nome, a frase do cartão e o lado, com o valor de referência pela sua marca | a V1-R4 do `check:pais` morde 6 de 6 plantas em memória (`primeira-v1r4.json`), e a planta `r4-pais-lado-trocado` morde sobre a construção |
| 5 · a edição inglesa | todas as cadeias novas nas duas edições, com as notas em `design/especime-v3/CHAVES-EN.md`, e as frases provadas nas duas línguas na auditoria | `check:lingua` a 0 na corrida dos portões |
| 6 · os registos | o mapa do repositório (a secção do R4, e as citações deslocadas pelas linhas novas que tinham um sítio só), `ISSUES.md` (I207 a I209), este relatório, `medidas.json`, as capturas | `conferir-relatorio.py` a 0; `conferir-mapa.py` a 0, com 429 citações na linha citada, 27 no ficheiro mas longe e 0 não encontradas; 52 capturas, nenhuma a rolar para o lado (52) |

Os pontos do prompt que não são do brief: a worktree e o ramo próprios, `git add` só de caminhos explícitos, nenhum `push`, nenhum `git checkout` na árvore principal (a cabeça de partida construiu-se numa worktree à parte, já removida); as plantas que escrevem em `dist/` estão em `tests/pais/portoes.mjs`, fora da cadeia do `verify`; os três portões correram pela tranca da máquina, e o último commit tem só as provas.

## As frases novas e a origem de cada termo

**As linhas.** A regra da família: a linha com cartão nacional lê a metade «o que é» do cartão; a de uma medida dos concelhos lê a nota da medida, e a família tira-se do que cada concelho declara no seu relance e na sua distância; qualquer outra lê a família do identificador sem o período, com o «-ue» guardado. As frases das famílias escrevem-se parte a parte na especificação (`familias-r4.mjs`), cada parte com o literal que a apoia, e o compositor (`compor-familias-r4.mjs`) confere-as e escreve a declaração e a auditoria. Os apoios das famílias, por espécie (a lista inteira é a chave `familias` de `tests/cartao/leituras-provadas.json`): 73 numa origem declarada, 30 no excerto da linha, 59 no título do documento, 21 no localizador, 28 no nome que a fonte imprime, 34 na unidade, 18 no publicador, 1 na edição do documento, 12 no período lido do campo da data, 10 numa explicação de um termo de `TERMOS_DOS_CARTOES`, 86 no nome do projeto, 17 em alternativas com uma da fonte (o campo que diz a coisa muda de linha para linha da família) e 5 em alternativas só da casa, e, nos campos da casa que o motor confere, 29 na conta (`derivation`) e 32 na ressalva.

**As séries.** As que têm linha leem a frase dela; as outras escrevem-se em `series-r4.mjs` e compõem-se com `compor-series-r4.mjs`. Os apoios das séries: 21 numa origem declarada, 14 no nome da série na fonte, 6 na edição, 2 na unidade, 7 e 7 na conta de uma série derivada, e 12 no nome do projeto.

**Por confirmar na fonte.** O mandato manda listar as frases com alguma parte que só a casa diz: 60 entradas (53 das famílias e 7 das séries), cada uma com a parte e a espécie do apoio em `medidas.json` (`por_confirmar_na_fonte`). Pela espécie do apoio da parte: 27 na conta de uma linha ou de uma série calculada pelo projeto e 5 na conta inglesa (a frase diz o que a conta declarada diz, e a conta confere-se no motor), 27 na ressalva da linha (as linhas do Orçamento do Estado, onde a ressalva diz o que a soma inclui), 24 no nome do projeto, 4 numa explicação de um termo que a casa leu contra a fonte, e 1 numa alternativa que só nalgumas linhas da família é da fonte. As séries do índice harmonizado das rendas, da energia em casa e dos combustíveis, e a dos preços da habitação por trimestre, estão nesta lista pela razão da I207: o rótulo do Eurostat foi lido e não pode entrar como origem sem o selo do cliente da casa.

**A primeira página** não tem frases novas sobre as medidas: lê a metade «o que é» da leitura auditada de cada cartão, e a frase do lado é uma cadeia da casa com a palavra que a conta escolhe e o valor de referência pela sua marca.

## As divergências do brief, medidas

- **A família de uma linha dos concelhos.** O §0 do brief juntou aos concelhos as linhas cujo identificador acaba num sufixo comum a vinte ou mais (dá 2 817 linhas); o bloco lê a família do que cada concelho declara (dá 2 772). A regra do sufixo junta aos concelhos 45 linhas que nenhum concelho declara: as 25 do Orçamento do Estado que acabam em «administracao-central», a dívida das empresas e o fluxo de crédito às empresas (o sufixo «empresas»), os anos anteriores das linhas de Évora e o poder de compra do Alentejo Central (a conta por sufixo está em `medidas.json`); essas linhas têm a sua família, nacional ou de Évora, com frase própria. A regra do bloco não junta nenhuma que a do sufixo deixe de fora (0).
- **O valor de referência «pela sua linha do livro».** Os valores de referência do painel não são linhas do livro-razão: estão declarados em `src/data/figuras.mjs`, com a testemunha do motor conferida pela K9. A marca de cada um leva o identificador da linha da medida (`data-referencia`), e a V1-R4 confere o texto contra a declaração.
- **As linhas com cartão mostram as duas metades da leitura no recibo**: a do que o número é e a que compara, como o cartão as mostra, porque o sinal da posição de investimento internacional e a referência vivem na segunda (a I208).
- **As classes do índice harmonizado** dizem-se pelo nome do projeto (a I207).

## As plantas, e o que cada uma morde

| onde | planta | morde |
|---|---|---|
| K17, a auditoria das famílias | uma linha sem frase · uma frase com um algarismo · uma frase mudada sem nova auditoria · um literal que a linha não tem · uma família sem auditoria · a frase do cartão numa linha onde o apoio falha · uma parte que diz sem apoio | cada uma com a sua queixa |
| K17, os recibos das linhas | um recibo sem a frase · a frase de outra medida no recibo · um algarismo escrito à mão na frase de uma família · a metade que compara trocada no recibo de um cartão · o concelho trocado no título | idem |
| K17, as séries | uma série sem frase · a frase de uma série mudada sem nova auditoria · um literal que o campo da série não tem · um recibo de série sem a frase · a frase de outra série no recibo | idem |
| S6 | a frase do último ponto com o lado trocado · com o período errado · a série sem o ponto de há um ano e a frase ainda a comparar com ele · um recibo de série sem a frase | idem |
| V1-R4, em memória, nas duas edições | o lado trocado (a marca e as palavras) · uma medida de dentro fora da porta dobrada · a frase «o que é» de outra medida | idem |
| sobre a construção (`tests/pais/portoes.mjs --prefixo r4-`) | `r4-recibo-sem-frase` e `r4-frase-de-outra-linha` e `r4-titulo-sem-nome` (portão de HTML) · `r4-voz-nome-da-familia-trocado` (voz) · `r4-pais-lado-trocado` (`check:pais`) · `r4-voz-fragmento-retirado-solto` (voz) | todas com código 1 e os ficheiros repostos byte a byte (6 em `plantas-portoes-r4.json`) |
| L1 | uma entrada tirada à lista da régua · uma contagem do registo trocada em memória | a lista deixa de reconciliar; a régua do teto recusa |

## O que mudou de forma, conservando o que protege

- **A célula do espaço no valor do recibo** lê o valor pela classe `p.linha-valor`, porque o `<h1>` passou a ser o nome; a mesma conferência, e a planta antiga continua a morder.
- **A L1** subiu no R4 e voltou na R4-b a 2 714 páginas, com os mesmos destinos e as mesmas vezes da cabeça de partida (a secção da R4-b, abaixo).
- **A lista fechada da primeira página e o arame da classe por provar** deixam sair as explicações dos valores de referência só depois de a V1-R4 as conferir na mesma corrida, como os blocos de «O que se passa»; o autoteste do arame prova as duas metades.
- **Dois fragmentos retirados** («abaixo do valor de referência», «entre os valores de referência») continuam proibidos como blocos soltos e admitem-se só dentro das frases do lado, inteiras; a planta `r4-voz-fragmento-retirado-solto` morde.
- **A K17 conta como usadas as origens das famílias e das séries**, que estão na mesma auditoria.

## Os commits

Os commits do bloco, por ordem, estão na história do ramo (`git log 557844fe..`): o recibo das linhas; a K17 das famílias e a conta do portão; as séries; a primeira página; a L1 medida; os registos; as listas das entradas por confirmar na fonte; as provas do R4; e os da R4-b (abaixo).

## Os portões, lidos dos ficheiros

Corridos por `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/r4-2026-10-05/portoes`, pela tranca da máquina, na cabeça do código do R4 (`portoes/cabeca`, igual a `portoes/cabeca.fim`): `build` 0 em 215 segundos, `verify` 0 em 1 091 segundos, `typecheck` 0. Cada código leu-se do seu ficheiro. Os três portões inteiros da cabeça da R4-b corre-os o lugar de direção depois de fundir o `main`, pela ordem da passagem.

## O custo

O modelo é o Claude Opus 5.5, no R4 e na R4-b. Do commit do brief à cabeça medida passaram 33 948 segundos (os tempos dos commits), as duas passagens juntas. O total de símbolos é o que a ferramenta reporta ao lugar de direção no fim de cada corrida: o registo da sessão guarda o uso do início de cada resposta, e por isso não o dá.

## O que ficou por fazer

- **I207**: selar no motor os rótulos do Eurostat das classes do índice harmonizado e da unidade dos preços da habitação por trimestre, e trocar na especificação das séries o apoio do nome pelo da origem, com as palavras da fonte. As leituras feitas fora do cliente da casa estão em `medidas.json` (`leituras_do_eurostat`), com a hora, o resumo e os bytes de cada uma.
- **I208** e **I209**: fechadas na R4-b (abaixo).
- **O mapa**: as 27 citações que o conferidor acha longe da linha citada e não resolvem num sítio só (várias citações do mesmo ficheiro na mesma linha) ficam como estavam; o conferidor sai a 0.
- **A leitura a frio**, com o teste dos dois minutos sobre a amostra do §2 do brief, e a leitura cruzada das linhas novas do inventário das frases (r4, por ler), que são do lugar de direção.
- **A fusão**: o RP4-c mexeu no recibo das séries noutro ramo, e `main` andou desde `557844fe`; o recibo das séries e as cadeias da casa são os sítios onde os dois ramos se tocam. Os números I207 a I209 podem colidir com os de outro ramo.

## R4-b, a passagem de correção depois da leitura

*A leitura a frio do Codex Astra (raciocínio xhigh) sobre o R4 voltou com as cinco plantas mordidas e quatro coisas para corrigir, e uma quinta opcional. Construtor: Claude Opus 5.5, na mesma worktree e no mesmo ramo. As medidas desta secção estão em `medidas.json` (as que começam por `r4b_`, pelo `medir-r4.mjs`, corrido numa cabeça que só tem provas por cima da cabeça do código, com a árvore seguida limpa), em `l1-r4b.json` e nos ficheiros de `r4b/`.*

### 1 · O estado «por confirmar na fonte» chega ao leitor (o achado 5)

Uma frase com uma parte que nem a fonte nem a conta declarada de uma linha calculada dizem leva, no recibo, o marcador da casa ao pé dela, nas duas edições, com a classe `marcador-da-frase` e a definição do marcador à primeira vez na página. A conta é a da auditoria: os compositores classificam cada parte que diz, linha a linha, e escrevem o campo `por_confirmar_na_fonte` de cada entrada e as listas que o resolvedor lê; a K17 refaz a classificação pela sua conta, confere as listas e confere, em cada recibo, que o marcador está onde ela o põe e em mais lado nenhum.

- **Quantas.** 174 linhas de 39 famílias, com o marcador em 348 recibos, e 6 séries, com o marcador em 12 recibos de série. Na família do desemprego registado, só as linhas dos concelhos da Madeira, onde a fonte (o Instituto de Emprego da Madeira) não diz o termo.
- **Uma divergência, medida.** A medida do R4 (o «por confirmar na fonte» estrito) dava 60 entradas, as que têm alguma parte sem literal da fonte; o marcador vai para as que têm uma parte que só o nome do projeto, a ressalva da casa ou a explicação de um termo apoiam. As outras 15 têm as partes sem fonte apoiadas na conta declarada de uma linha calculada (`derivation`), que é a definição desse número, selada e refeita pelos portões: pôr-lhes o marcador era dizer «não confirmado» de uma descrição que a própria conta confirma. A regra é uma linha nos compositores e na K17, e o lugar de direção pode alargá-la às 15 com uma decisão.
- **As plantas da K17** (em memória): a lista do resolvedor sem uma linha por confirmar; a auditoria a dar como confirmada uma frase por confirmar; uma marca a mais num recibo; uma marca em falta num recibo; uma marca a mais e uma em falta num recibo de série. A I207 continua aberta, e o marcador das cinco séries do IHPC e dos preços da habitação sai sozinho quando a origem selada entrar.

### 2 · A primeira página e o sinal (o achado 6; a I208, fechada)

A parte do sinal que vive na metade que compara do cartão (só a posição de investimento internacional tem uma, «Negativa quer dizer que o país deve ao exterior mais do que tem lá.») diz-se agora na explicação dos valores de referência da primeira página (1 na portuguesa, 1 na inglesa) e no recibo do ano anterior, que lê a frase do cartão (2 recibos, nas duas edições), pela mesma leitura auditada: `sinalDaLeitura()` devolve as cadeias do princípio do ramo que o valor da linha escolhe, até ao primeiro pedaço que compara. A V1-R4 reconta-a pela sua conta e confere que é o princípio da metade que compara do cartão na página do assunto; a K17 confere a do recibo. As plantas: a parte tirada e a do outro ramo, na V1-R4, nas duas edições; a parte tirada do recibo do ano anterior, na K17; e `r4b-pais-sinal-tirado`, sobre a construção.

### 3 · A L1 não sobe (o achado 10; a I209, fechada)

A medida do R4 comparava, por página, só quantos destinos se repetiam e um exemplo. Com as vezes contadas (`medir-l1-r4b.mjs`, com a cópia da regra da régua em `contar-destinos-l1.mjs`, que recusa escrever sem bater com ela), a cabeça do R4 tinha 22 páginas novas e 896 agravadas (a comparação sem as vezes contava 0): recibos com mais uma porta para o documento, e a primeira página nas duas edições. A causa estava em três sítios, e não num selo da frase do recibo, que não tem selo:

- **o título do documento** aparecia na cabeça (o nome na fonte, com a porta) e outra vez na frase de atribuição; diz-se uma vez, na cabeça, e a frase de atribuição diz quem publicou e a edição (2 826 recibos com o título na cabeça, 0 com ele repetido; o recibo do PIB tem 3 portas para o documento, as da cabeça de partida);
- **a frase de uma série** dizia o valor da linha com o selo, para o recibo que a lista das linhas da série já abre; diz-o pelo ponto da série, com o mesmo valor, cadeia a cadeia (24 recibos de série, 0 com selo na frase), e a K17 confere a porta única;
- **o selo do valor dos preços da habitação** na explicação da primeira página é uma porta obrigatória (a regra do selo), e o B2 tira-o da contagem só depois de a V1-R4 conferir a explicação inteira, com a planta de uma porta a mais dentro dela; o marcador da frase por confirmar é descontado como o de um título, só dentro da sua marca (a planta `r4b-l1-marcador-fora-da-marca`).

A régua voltou a 2 714 páginas e o teto também (`scripts/lugar-tetos-b1.json`, com a medição `l1-r4b.json`): 0 páginas novas, 0 saídas, 0 agravadas e 2 714 iguais às da cabeça de partida, destino a destino e vez a vez. Os conhecidos-positivos da medida: uma entrada tirada à lista da régua, e a omissão das vezes (um destino a repetir-se mais uma vez, em memória, que a comparação com as vezes agrava e a do R4 deixa passar). A planta do teto continua a morder (`r4b/planta-teto-l1-r4b.json`, teto 2 714).

### 4 · A medida das plantas da S6

`plantas_da_s6` conta agora só as plantas com a célula S6 (13), com o conhecido-positivo de que todas mordem e de que as do R4 estão entre elas; as 28 do `check:series` inteiro ficam numa medida à parte, e a tabela do mandato, acima, diz o número certo.

### 5 · Opcional: a receita corrente líquida cobrada

A frase do limite da dívida dos concelhos fica como está. A origem que a auditoria cita é o artigo da lei das finanças locais que fixa o limite (na origem `c1c-dgal-limites`), e diz que a dívida não pode passar de uma vez e meia a média da receita corrente líquida cobrada nos três exercícios anteriores, sem dizer o que entra nessa receita; escrever o que ela inclui seria uma parte sem apoio.

### As conferências que a passagem tocou, lidas dos ficheiros

Corridas por `conferencias-r4b.sh` na cabeça do código da R4-b, com a árvore seguida limpa (`r4b/conferencias/`, cada uma com a cabeça, o estado, as horas e o código): `check:cartao` 0 (a K17), `check:primeira` 0 (a V1-R4 em memória), `check:pais` 0, `check:lugar` 0 (a L1), `check:series` 0 e `typecheck` 0. A cadeia da construção correu inteira nessa cabeça, passo a passo, e o `conferir-relatorio.py` está a 0 sobre este relatório.

### As plantas da passagem

| onde | planta | morde |
|---|---|---|
| K17, em memória | a lista do resolvedor sem uma linha por confirmar · a auditoria a dar como confirmada uma frase por confirmar · uma marca a mais num recibo · uma marca em falta num recibo · a parte do sinal tirada do recibo do ano anterior · uma marca a mais num recibo de série · uma marca em falta num recibo de série · o selo de volta na frase de uma série, com a porta que a lista já tem | 8 plantas, todas com a sua queixa |
| V1-R4, em memória, nas duas edições | a parte do sinal tirada · a parte do sinal do outro ramo · uma porta a mais numa explicação · o selo de uma explicação sai da L1 só com a explicação conferida | 8 plantas, todas com a sua queixa |
| sobre a construção (`tests/pais/portoes.mjs`, `r4b/`) | `r4b-l1-marcador-fora-da-marca` (`check:lugar`) · `r4b-pais-sinal-tirado` (`check:pais`), e as 6 do R4 outra vez | 2 plantas novas e as do R4, todas com código 1, com a árvore seguida limpa e os ficheiros repostos |
| a L1 | a omissão das vezes · uma entrada tirada à lista · a contagem do registo trocada em memória | as três mordem |

### As capturas

62 capturas em `design/especime-v3/capturas/r4-2026-10-05/r4b/` (62 sem rolar para o lado), nas cinco larguras e nas duas edições: os cinco recibos e a primeira página do R4, regenerados, e o recibo de uma linha com o marcador (o desemprego registado do Funchal), mais a primeira página com a porta dos valores de dentro aberta a 390 px.

### Os commits da passagem

Os commits de código primeiro (o código e as conferências; a L1 com a medição; os registos), depois um commit com os guiões das provas e, por último, um commit só com as provas que eles escreveram. A lista está na história do ramo, por cima de `6ce6b927`.

### O que ficou por fazer

- A I207 (os rótulos do Eurostat selados no motor), que tira o marcador das cinco séries quando se fizer.
- A decisão sobre as 15 entradas cuja parte sem fonte é a conta declarada (o marcador fica de fora delas; acima).
- O mapa: a secção do R4 está conferida; ficam 27 citações longe da linha citada noutras secções, que a passagem não toca por regra (algumas deslocadas pelas linhas que ela acrescentou a ficheiros que essas secções citam).
- A leitura cruzada das duas linhas novas do inventário das frases (r4b, por ler), e os três portões inteiros depois da fusão do `main`, que são do lugar de direção.
