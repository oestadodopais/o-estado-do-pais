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
| 2 · as famílias sem frase ganham uma, provada | 3 195 linhas com frase: 48 pelo cartão, 2 772 pela medida dos concelhos, 375 pela família; 181 entradas na auditoria, 293 partes, 455 apoios | 0 linhas sem frase; a K17 morde 17 de 17 plantas, entre elas «uma linha sem frase» e «uma frase com um algarismo» |
| 3 · o recibo de uma série diz o que o último ponto quer dizer | 24 séries com a frase «o que é» (14 pela linha, 10 com frase escrita e provada); a frase do último ponto em 48 recibos, todas a comparar com o mesmo período de há um ano (24; com o ponto anterior, 0) | a S6 morde as plantas do lado trocado e do período errado, e mais duas (`series-s6.json`: 4 plantas do R4, 28 ao todo, todas a morder); a K17 confere a frase «o que é» em 48 de 48 recibos |
| 4 · a primeira página explica os valores de referência | por baixo do veredicto, 4 valores de fora à vista e 9 de dentro numa porta dobrada, nas duas edições (4 e 9 na inglesa), cada um com o nome, a frase do cartão e o lado, com o valor de referência pela sua marca | a V1-R4 do `check:pais` morde 6 de 6 plantas em memória (`primeira-v1r4.json`), e a planta `r4-pais-lado-trocado` morde sobre a construção |
| 5 · a edição inglesa | todas as cadeias novas nas duas edições, com as notas em `design/especime-v3/CHAVES-EN.md`, e as frases provadas nas duas línguas na auditoria | `check:lingua` a 0 na corrida dos portões |
| 6 · os registos | o mapa do repositório (a secção do R4, e as citações deslocadas pelas linhas novas que tinham um sítio só), `ISSUES.md` (I207 a I209), este relatório, `medidas.json`, as capturas | `conferir-relatorio.py` a 0; `conferir-mapa.py` a 0, com 420 citações na linha citada, 24 no ficheiro mas longe e 0 não encontradas; 52 capturas, nenhuma a rolar para o lado (52) |

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
- **A L1 sobe** de 2 714 para 2 736, com a razão ao pé do teto: 22 páginas novas, todas recibos de série com dois destinos para o recibo da linha da frase (o selo do valor e a lista das linhas da série), nenhuma antiga agravada (0), nenhuma saída (0). A dívida é a I209.
- **A lista fechada da primeira página e o arame da classe por provar** deixam sair as explicações dos valores de referência só depois de a V1-R4 as conferir na mesma corrida, como os blocos de «O que se passa»; o autoteste do arame prova as duas metades.
- **Dois fragmentos retirados** («abaixo do valor de referência», «entre os valores de referência») continuam proibidos como blocos soltos e admitem-se só dentro das frases do lado, inteiras; a planta `r4-voz-fragmento-retirado-solto` morde.
- **A K17 conta como usadas as origens das famílias e das séries**, que estão na mesma auditoria.

## Os commits

Os commits do bloco, por ordem, estão na história do ramo (`git log 557844fe..`): o recibo das linhas; a K17 das famílias e a conta do portão; as séries; a primeira página; a L1 medida; os registos; as listas das entradas por confirmar na fonte; e, por último, as provas.

## Os portões, lidos dos ficheiros

Corridos por `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/r4-2026-10-05/portoes`, pela tranca da máquina, na cabeça do código (`portoes/cabeca`, igual a `portoes/cabeca.fim`): `build` 0 em 215 segundos, `verify` 0 em 1 091 segundos, `typecheck` 0. Cada código leu-se do seu ficheiro.

## O custo

O modelo é o Claude Opus 5.5. Do commit do brief à cabeça medida passaram 27 526 segundos (os tempos dos commits). O total de símbolos é o que a ferramenta reporta ao lugar de direção no fim desta corrida: o registo da sessão guarda o uso do início de cada resposta, e por isso não o dá.

## O que ficou por fazer

- **I207**: selar no motor os rótulos do Eurostat das classes do índice harmonizado e da unidade dos preços da habitação por trimestre, e trocar na especificação das séries o apoio do nome pelo da origem, com as palavras da fonte. As leituras feitas fora do cliente da casa estão em `medidas.json` (`leituras_do_eurostat`), com a hora, o resumo e os bytes de cada uma.
- **I208**: o que o sinal quer dizer, onde só se lê a metade «o que é» (a primeira página e os recibos das séries com essa linha).
- **I209**: uma porta só para o selo da frase e a lista das linhas nos recibos de série, que leva a L1 de volta.
- **O mapa**: as 24 citações que o conferidor acha longe da linha citada e não resolvem num sítio só (várias citações do mesmo ficheiro na mesma linha) ficam como estavam; o conferidor sai a 0.
- **A leitura a frio**, com o teste dos dois minutos sobre a amostra do §2 do brief, e a leitura cruzada das linhas novas do inventário das frases (r4, por ler), que são do lugar de direção.
- **A fusão**: o RP4-c mexeu no recibo das séries noutro ramo, e `main` andou desde `557844fe`; o recibo das séries e as cadeias da casa são os sítios onde os dois ramos se tocam. Os números I207 a I209 podem colidir com os de outro ramo.
