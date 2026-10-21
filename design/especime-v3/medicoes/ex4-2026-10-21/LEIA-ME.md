# EX4 · a explicação «Para onde vai o dinheiro do Estado em 2027, pela proposta de Orçamento» (21.10.2026)

*Construtor: Claude Opus 5.5 (`construtor`), ramo `ex4-2026-10-21`, cortado de `main` em `2fe7cc24c`; motor em `pf1-2026-10-21`, cabeça `1777833`. Por ler a frio.*

## Onde parou, e porquê

O bloco parou num portão que protege as datas dos números, e encontrou um segundo do mesmo género. Nenhum dos dois se enfraqueceu.

1. **O `ledger:check` recusa as 83 linhas exportadas pelo manifesto `publisher/manifest.pf1.json`.** A regra 7 de `src/lib/ledger.mjs` («datas») só aceita o campo `period` num trimestre com o último dia ou num acumulado selado com o mês final (`acumuladoConferido`, `src/lib/prova-efeitos.mjs`); as 83 linhas do PF1 trazem todas `period`, com os valores contados em `medidas.json` (`valores_de_period_do_pf1`). Um ficheiro gerado não se edita no sítio (o `check:cruzamento --with-origin` confere-o contra o motor), e o mandato manda não comitar nada no motor: a correção é do motor (exportar sem `period` nas linhas anuais, ou noutra forma que a regra aceite) ou uma decisão do lugar de direção sobre a regra. Como o `ledger:check` é o segundo passo do `npm run build`, a página da explicação não se constrói e as frases não se leem de `dist/`.
2. **O `check:cartao` recusa as mesmas 83 linhas**: cada uma precisa da frase de «o que é cada número» da sua família em `src/data/o-que-e-das-familias.mjs` (o bloco R4), nas duas edições, com a auditoria das origens. O mandato não o previa; são declarações com apoios na fonte, e não couberam neste orçamento.

O que se fez, e está pronto para a passagem seguinte: a declaração com o texto do §2 à letra, a gramática que ela pede, os nomes, a auditoria, os acertos, as plantas e as conferências que não precisam da página.

## Os commits

1. A gramática e a célula X (verde por si; medido na cabeça desse commit, sem a explicação nova, com os códigos `codigos/a-*.code`): o título de uma secção em pedaços (os anos por `{ periodo }`); o número do mapa e o código da subfunção por `{ verbatim }`, relidos em cada construção nos campos selados (`IDENTIFICADORES_SELADOS` em `src/lib/explicacoes.mjs`, o `document.locator` das linhas dos totais e o `excerpt` da linha da subfunção; o texto registado em `src/data/verbatim.mjs`); as portas `{ rota: 'estudo', slug }` e `{ rota: 'explicacao', slug }`, com o título do destino na edição; os nomes do projeto das linhas do Mapa 2 em `src/data/medidas-pf1.mjs`; e, na célula X, a leitura própria de tudo isto, com as plantas da primeira explicação presas pelo slug (a mais recente passa a ser outra).
2. A explicação, as linhas e as provas (vermelho, por aterrar, pelas duas razões acima): as 83 linhas e `ledger/cruzamentos/pf1.json`, o registo do estudo interno `oe-2027-funcoes` em `src/data/studies.mjs` (o `check:cruzamento` pedia-o), a declaração `src/data/explicacoes/dinheiro-do-estado-2027.mjs` registada em `index.mjs`, a auditoria na secção `explicacoes` de `tests/cartao/leituras-provadas.json` (escrita por `auditoria-ex4.mjs`), e os guiões desta pasta.

## Decisões pequenas do construtor

- **Os nomes declarados não estão em `src/data/medidas-oe1.mjs`**, como o mandato (§1.2) dizia: esse módulo é gerado pelo motor (`publisher/oe1_nomes.py`) e selado pelo sha256 em `ledger/cruzamentos/oe1-nomes.json`, e um nome escrito lá à mão partia o `check:cruzamento`. Estão em `src/data/medidas-pf1.mjs`, na mesma forma (o nome declarado é o que vem depois de « que vai para » / « going to »), gerados a partir dos nomes das funções de 2026; a função 01 sem a dívida leva o nome que o mandato escreve. São 27: as dez `F27`, as dez `S27` e as sete `V` que uma frase nomeia.
- **O programa Saúde** é `oe-2027-saude-despesa-total-consolidada-2027` (a secção «A Saúde» a seguir à tabela dos gémeos no LEIA-ME do PF1, que nomeia o Quadro 5.37 e o total consolidado); a unidade da linha é «milhões de euros», e o sufixo é ' milhões de euros' / ' million euros'.
- **O ramo do `compara` da abertura é «menos de metade desse total»**: a subfunção 01.7 (`oe-2027-despesa-subfuncao-01-7-mapa`) é menor do que o resto (`oe-2027-despesa-sem-divida-mapa`), pelos valores das duas linhas. O mandato escreveu os três ramos; o lugar de direção deve saber que é este o que se rende.
- **A data da entrega** rende-se na forma da casa para um dia (`dataDaCasa`), a mesma nas duas edições.

## Os acertos (a lista `ACERTOS` da declaração, provada por `acertos-ex4.mjs`)

- **EX4-A1** (secção 1 e secção 2, fora): as duas figuras `barras-do-livro` (as dez `F27` e as dez `S27`) não se rendem, com os seus títulos. Razão: os dois títulos do mandato levam o ano por `{ periodo }` e o número do mapa («Mapa 2») ou o código da subfunção («01.7»), e o título de uma figura, na gramática (`resolverExplicacao`, `modeloDasBarrasDoLivro`, a F22 e a X1), é uma cadeia sem algarismos nem pedaços; mudar a forma da figura (o modelo, o componente, a F22, a X1 e a X4) não coube no orçamento do bloco, e o mandato manda que uma frase que não se escreve como está fique fora.
- **EX4-A2** (o que isto não diz, fora): a frase «O mapa é só o subsetor da Administração Central: a Segurança Social, com as pensões, tem o seu mapa, o Mapa 7, que não está aqui.» não se rende (nas duas edições). Razão: o número «7» do Mapa 7 não está em nenhum campo selado de nenhuma linha do livro (procurado em `ledger/claims/*.yml`), e nenhum algarismo se escreve à mão numa palavra fixa.
- **EX4-A3** (título, abertura, secção 3, secção 4, o que isto não diz, igual): os anos e a data da entrega entram por `{ periodo }` das linhas nomeadas; «Mapa 2» e «01.7» entram por `{ verbatim }`, relidos em cada construção no `document.locator` das linhas dos totais e no `excerpt` da linha da subfunção. Razão: nenhum algarismo escrito à mão (o mandato, cabeçalho); o texto rendido é o mesmo.
- **EX4-A4** (o que isto não diz, igual): a frase «Os valores não são consolidados, […] é maior do que a despesa total consolidada, […]» fica guardada pela condição de a despesa total do mapa ser maior do que a consolidada. Razão: é uma frase que compara («maior do que»), e as frases que comparam levam a guarda que os números decidem (o mandato, §1.3); o texto rendido é o mesmo.
- **EX4-A5** (títulos das secções, edição inglesa, igual): os quatro títulos ingleses das secções são a tradução do construtor («By function, as the map writes it», «Without the operations related to public debt», «What changes from the [periodo] law to the [periodo] proposal», «Health: the function and the programme»). Razão: o §2 do mandato dá os títulos das secções só em português; o guião compara a edição portuguesa.

## As frases como o resolvedor as rende, nas duas edições

Não vêm de `dist/` (a construção não corre com estas linhas no livro); vêm de `frases-ex4.json`, escrito por `frases-ex4.mjs`, com os identificadores das linhas que cada bloco cita.

### pt

- `titulo`: Para onde vai o dinheiro do Estado em 2027, pela proposta de Orçamento *(linhas: oe-2027-cem-euros-funcao-01-mapa)*
- `abertura[0]`: A proposta de Orçamento do Estado para 2027, entregue ao Parlamento a 08.10.2026, traz um mapa da despesa da Administração Central por função, o Mapa 2. Esse mapa soma 372 293 363 352 euros, e menos de metade desse total, 176 530 309 000 euros, é a subfunção a que o mapa chama «operações relacionadas com a dívida pública». Tirando essa subfunção, sobram 195 763 054 352 euros. De cada cem euros desses, 25,16 vão para a saúde, 24,58 para os assuntos económicos, 20,44 para os serviços gerais das administrações públicas, sem as operações relacionadas com a dívida pública, 12,54 para a proteção social e 7,17 para a educação. A maior fatia é a da saúde. *(linhas: oe-2027-cem-euros-funcao-01-mapa, oe-2027-calendario-entrega, verbatim:pf1-mapa-2027-numero, oe-2027-despesa-total-mapa, oe-2027-despesa-subfuncao-01-7-mapa, oe-2027-despesa-sem-divida-mapa, oe-2027-cem-euros-funcao-07-sem-divida-mapa, oe-2027-cem-euros-funcao-04-sem-divida-mapa, oe-2027-cem-euros-funcao-01-sem-divida-mapa, oe-2027-cem-euros-funcao-10-sem-divida-mapa, oe-2027-cem-euros-funcao-09-sem-divida-mapa)*
- `secao:como-o-mapa-a-escreve`: Por função, como o mapa a escreve
- `seccoes[0].conteudo[0].paragrafo`: Lido como o mapa o escreve, 58,17 de cada cem euros vão para os serviços gerais das administrações públicas, porque a subfunção das operações relacionadas com a dívida pública está dentro dessa função; a saúde leva 13,23, os assuntos económicos 12,93, a proteção social 6,59 e a educação 3,77. A segurança e ordem pública leva 1,73, a defesa 1,24, a habitação e infraestruturas coletivas 1,18, a proteção do ambiente 0,76 e o desporto, recreação, cultura e religião 0,41. *(linhas: oe-2027-cem-euros-funcao-01-mapa, oe-2027-cem-euros-funcao-07-mapa, oe-2027-cem-euros-funcao-04-mapa, oe-2027-cem-euros-funcao-10-mapa, oe-2027-cem-euros-funcao-09-mapa, oe-2027-cem-euros-funcao-03-mapa, oe-2027-cem-euros-funcao-02-mapa, oe-2027-cem-euros-funcao-06-mapa, oe-2027-cem-euros-funcao-05-mapa, oe-2027-cem-euros-funcao-08-mapa)*
- `secao:sem-a-divida`: Sem as operações relacionadas com a dívida pública
- `seccoes[1].conteudo[0].paragrafo`: Esta conta é deste projeto: a despesa total do mapa menos a subfunção 01.7, e cada função a dividir por esse resto; o recibo de cada linha mostra a conta. A segurança e ordem pública leva 3,30 de cada cem euros, a defesa 2,35, a habitação e infraestruturas coletivas 2,24, a proteção do ambiente 1,45 e o desporto, recreação, cultura e religião 0,77. *(linhas: verbatim:pf1-subfuncao-01-7-codigo, oe-2027-cem-euros-funcao-03-sem-divida-mapa, oe-2027-cem-euros-funcao-02-sem-divida-mapa, oe-2027-cem-euros-funcao-06-sem-divida-mapa, oe-2027-cem-euros-funcao-05-sem-divida-mapa, oe-2027-cem-euros-funcao-08-sem-divida-mapa)*
- `secao:o-que-muda`: O que muda da lei de 2026 para a proposta de 2027 *(linhas: oe-2026-cem-euros-funcao-01-mapa, oe-2027-cem-euros-funcao-01-mapa)*
- `seccoes[2].conteudo[0].paragrafo`: A comparação certa é o Mapa 2 da Lei do Orçamento para 2026: o mesmo mapa, o mesmo perímetro, a mesma unidade. A despesa total do mapa passa de 352 472 389 960 euros para 372 293 363 352 euros, uma variação de 5,6 %; sem as operações relacionadas com a dívida pública, passa de 177 454 923 960 euros para 195 763 054 352 euros, 10,3 %. Por função, em euros: os assuntos económicos variam 32,2 %, a saúde 3,6 %, a proteção social 4,7 %, a educação −0,2 %, a defesa −8,0 %, a proteção do ambiente −10,2 % e o desporto, recreação, cultura e religião −6,4 %. A função que mais cresce é a dos assuntos económicos. O que está dentro de cada função, medida a medida, lê-se no estudo do Orçamento. *(linhas: verbatim:pf1-mapa-2026-numero, oe-2026-cem-euros-funcao-01-mapa, oe-2026-despesa-total-mapa, oe-2027-despesa-total-mapa, der-oe2027-despesa-total-mapa-variacao-pct, oe-2026-despesa-sem-divida-mapa, oe-2027-despesa-sem-divida-mapa, der-oe2027-despesa-sem-divida-variacao-pct, der-oe2027-funcao-04-variacao-pct, der-oe2027-funcao-07-variacao-pct, der-oe2027-funcao-10-variacao-pct, der-oe2027-funcao-09-variacao-pct, der-oe2027-funcao-02-variacao-pct, der-oe2027-funcao-05-variacao-pct, der-oe2027-funcao-08-variacao-pct)*
- `secao:saude`: A Saúde: a função e o programa
- `seccoes[3].conteudo[0].paragrafo`: A função saúde do mapa, 49 259 868 205 euros, não é o programa Saúde do Orçamento, 17 858,4 milhões de euros em 2027: o programa é consolidado e é um programa orçamental; a função é uma classificação da despesa, não consolidada, que conta as transferências entre serviços. As duas contas medem coisas diferentes, e nenhuma está errada. *(linhas: oe-2027-cem-euros-funcao-07-mapa, oe-2027-despesa-funcao-07-mapa, oe-2027-saude-despesa-total-consolidada-2027)*
- `naoDiz[0]`: Esta explicação lê o Mapa 2 de uma proposta: o que o Parlamento aprovar pode ser diferente, e o que se gasta de facto lê-se depois, na execução. Os valores não são consolidados, contam as transferências entre serviços, e por isso a despesa total do mapa é maior do que a despesa total consolidada, 259 633 860 562 euros em 2027. A conta «sem as operações relacionadas com a dívida pública» é deste projeto, declarada no recibo de cada linha; o mapa só dá o nome a essa subfunção, e esta explicação não diz o que entra nela. A base da explicação de 2026, a despesa efetiva consolidada por função dos dados abertos, ainda não existe para 2027; quando existir, esta explicação passa a essa base. *(linhas: verbatim:pf1-mapa-2027-numero, oe-2027-despesa-total-consolidada-mapa, oe-2026-cem-euros-funcao-01, oe-2027-cem-euros-funcao-01-mapa)*
- `porta:livro`: Números e fontes → /livro-razao
- `porta:estudo`: O Orçamento de 2027: o que muda e para quem → /estudos/orcamento-2027-o-que-muda-e-para-quem
- `porta:explicacao`: Para onde vai o dinheiro do Estado em 2026 → /explicacoes/dinheiro-do-estado-2026

Sinais: nenhum.

### en

- `titulo`: Where the State’s money goes in 2027, by the Budget proposal *(linhas: oe-2027-cem-euros-funcao-01-mapa)*
- `abertura[0]`: The State Budget proposal for 2027, delivered to Parliament on 08.10.2026, carries a map of central administration expenditure by function, Map 2. That map adds up to 372 293 363 352 euros, and less than half of that total, 176 530 309 000 euros, is the subfunction the map calls «operations related to public debt». Taking that subfunction out, 195 763 054 352 euros remain. Of every hundred euros of those, 25,16 go to health, 24,58 to economic affairs, 20,44 to general public services, without the operations related to public debt, 12,54 to social protection and 7,17 to education. The largest share is health. *(linhas: oe-2027-cem-euros-funcao-01-mapa, oe-2027-calendario-entrega, verbatim:pf1-mapa-2027-numero, oe-2027-despesa-total-mapa, oe-2027-despesa-subfuncao-01-7-mapa, oe-2027-despesa-sem-divida-mapa, oe-2027-cem-euros-funcao-07-sem-divida-mapa, oe-2027-cem-euros-funcao-04-sem-divida-mapa, oe-2027-cem-euros-funcao-01-sem-divida-mapa, oe-2027-cem-euros-funcao-10-sem-divida-mapa, oe-2027-cem-euros-funcao-09-sem-divida-mapa)*
- `secao:como-o-mapa-a-escreve`: By function, as the map writes it
- `seccoes[0].conteudo[0].paragrafo`: Read as the map writes it, 58,17 of every hundred euros go to general public services, because the subfunction of the operations related to public debt sits inside that function; Health takes 13,23, economic affairs 12,93, social protection 6,59 and education 3,77. Public order and safety takes 1,73, defence 1,24, housing and community amenities 1,18, environmental protection 0,76 and recreation, culture and religion 0,41. *(linhas: oe-2027-cem-euros-funcao-01-mapa, oe-2027-cem-euros-funcao-07-mapa, oe-2027-cem-euros-funcao-04-mapa, oe-2027-cem-euros-funcao-10-mapa, oe-2027-cem-euros-funcao-09-mapa, oe-2027-cem-euros-funcao-03-mapa, oe-2027-cem-euros-funcao-02-mapa, oe-2027-cem-euros-funcao-06-mapa, oe-2027-cem-euros-funcao-05-mapa, oe-2027-cem-euros-funcao-08-mapa)*
- `secao:sem-a-divida`: Without the operations related to public debt
- `seccoes[1].conteudo[0].paragrafo`: This calculation is this project’s: the map’s total expenditure minus subfunction 01.7, and each function divided by that remainder; each row’s receipt shows the calculation. Public order and safety takes 3,30 of every hundred euros, defence 2,35, housing and community amenities 2,24, environmental protection 1,45 and recreation, culture and religion 0,77. *(linhas: verbatim:pf1-subfuncao-01-7-codigo, oe-2027-cem-euros-funcao-03-sem-divida-mapa, oe-2027-cem-euros-funcao-02-sem-divida-mapa, oe-2027-cem-euros-funcao-06-sem-divida-mapa, oe-2027-cem-euros-funcao-05-sem-divida-mapa, oe-2027-cem-euros-funcao-08-sem-divida-mapa)*
- `secao:o-que-muda`: What changes from the 2026 law to the 2027 proposal *(linhas: oe-2026-cem-euros-funcao-01-mapa, oe-2027-cem-euros-funcao-01-mapa)*
- `seccoes[2].conteudo[0].paragrafo`: The right comparison is Map 2 of the Budget Law for 2026: the same map, the same perimeter, the same unit. The map’s total expenditure goes from 352 472 389 960 euros to 372 293 363 352 euros, a change of 5,6 %; without the operations related to public debt, it goes from 177 454 923 960 euros to 195 763 054 352 euros, 10,3 %. By function, in euros: Economic affairs change by 32,2 %, health by 3,6 %, social protection by 4,7 %, education by −0,2 %, defence by −8,0 %, environmental protection by −10,2 % and recreation, culture and religion by −6,4 %. The function that grows most is economic affairs. What sits inside each function, measure by measure, is read in the Budget study. *(linhas: verbatim:pf1-mapa-2026-numero, oe-2026-cem-euros-funcao-01-mapa, oe-2026-despesa-total-mapa, oe-2027-despesa-total-mapa, der-oe2027-despesa-total-mapa-variacao-pct, oe-2026-despesa-sem-divida-mapa, oe-2027-despesa-sem-divida-mapa, der-oe2027-despesa-sem-divida-variacao-pct, der-oe2027-funcao-04-variacao-pct, der-oe2027-funcao-07-variacao-pct, der-oe2027-funcao-10-variacao-pct, der-oe2027-funcao-09-variacao-pct, der-oe2027-funcao-02-variacao-pct, der-oe2027-funcao-05-variacao-pct, der-oe2027-funcao-08-variacao-pct)*
- `secao:saude`: Health: the function and the programme
- `seccoes[3].conteudo[0].paragrafo`: The map’s health function, 49 259 868 205 euros, is not the Budget’s Health programme, 17 858,4 million euros in 2027: the programme is consolidated and is a budget programme; the function is a classification of expenditure, unconsolidated, which counts the transfers between services. The two accounts measure different things, and neither is wrong. *(linhas: oe-2027-cem-euros-funcao-07-mapa, oe-2027-despesa-funcao-07-mapa, oe-2027-saude-despesa-total-consolidada-2027)*
- `naoDiz[0]`: This explainer reads Map 2 of a proposal: what Parliament approves may differ, and what is actually spent is read afterwards, in the budget execution. The values are unconsolidated, they count the transfers between services, and so the map’s total expenditure is larger than the consolidated total expenditure, 259 633 860 562 euros in 2027. The calculation «without the operations related to public debt» is this project’s, declared in each row’s receipt; the map only names that subfunction, and this explainer does not say what goes into it. The basis of the 2026 explainer, consolidated effective expenditure by function from the open data, does not yet exist for 2027; when it does, this explainer moves to that basis. *(linhas: verbatim:pf1-mapa-2027-numero, oe-2027-despesa-total-consolidada-mapa, oe-2026-cem-euros-funcao-01, oe-2027-cem-euros-funcao-01-mapa)*
- `porta:livro`: Numbers and sources → /en/ledger
- `porta:estudo`: The 2027 Budget: what changes, and for whom → /en/studies/orcamento-2027-o-que-muda-e-para-quem
- `porta:explicacao`: Where the State’s money goes in 2026 → /en/explainers/dinheiro-do-estado-2026

Sinais: nenhum.

## Os códigos (lidos de `codigos/*.code`)

- `a-build`: 1
- `a-check-cartao`: 0
- `a-check-cruzamento`: 0
- `a-check-explicacoes`: 0
- `a-check-graficos`: 0
- `a-explicacao`: 0
- `a-ledger-check`: 0
- `a-typecheck`: 0
- `acertos-ex4`: 0
- `check-cartao`: 1
- `check-cruzamento`: 0
- `explicacao`: 1
- `frases-ex4`: 0
- `ledger-check`: 1
- `plantas-ex4`: 0
- `typecheck`: 0

Os `a-*` são da cabeça do primeiro commit (a gramática, sem a explicação nova). O `a-build` saiu com 1 no `gate:html`: vinte recusas, todas no `<head>` de páginas de regiões e distritos («o token "7" tem algarismos», no contexto «contra a média da UE- 7»), em páginas que o diff desse commit não toca (cinco ficheiros: o resolvedor, o registo das transcrições, os nomes do PF1, a vista da explicação e a célula X). Se a cabeça de `main` reproduz a recusa não se mediu; é a primeira coisa a conferir. Os outros, sem prefixo, são da árvore com a explicação: `ledger-check` 1 e `check-cartao` 1 pelas razões de cima, `explicacao` 1 só porque as páginas não foram construídas (a primeira metade, a auditoria, as origens, os `maiores` e os ramos, sai limpa), e `acertos-ex4`, `plantas-ex4`, `typecheck` e `check-cruzamento` a zero. O `check:graficos` e o `check:voz` não correram sobre a explicação nova (precisam da página); o `check:graficos` correu a zero na cabeça do primeiro commit.

## O que fica

1. O motor exporta as linhas do PF1 numa forma que a regra 7 aceita (ou o lugar de direção decide sobre a regra), e as famílias de «o que é cada número» das 83 linhas entram em `src/data/o-que-e-das-familias.mjs`.
2. Depois disso: a construção, as frases lidas de `dist/`, o `check:voz` com os blocos novos no `INVENTARIO-FRASES.md` e a linha `ex4` em `REVISOES-DO-INVENTARIO.md` (não escritos: o que falta só o `check:voz` diz, sobre a página), a lista das explicações e o bloco «Para perceber» conferidos na página (a ordem vem de `escrita`, e a de 2026 continua na lista).
3. As duas figuras e a frase do Mapa 7 (os acertos EX4-A1 e EX4-A2), que o lugar de direção reescreve ou para as quais a gramática das figuras ganha títulos em pedaços.
4. O exportador deixou no motor um ficheiro por seguir, `publisher/recortes/manifest.pf1.json` (zero recortes); não se tocou nem se comitou.
5. A leitura a frio, pelo Codex.

## O custo

Setenta chamadas de ferramentas até este commit, contadas pelo construtor no seu registo (o orçamento era cem); uma construção do sítio, de 16:05:01 a 16:07:17 UTC, pela hora escrita antes e depois dela.
