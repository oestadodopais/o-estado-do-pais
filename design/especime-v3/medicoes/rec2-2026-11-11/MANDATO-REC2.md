# Mandato REC2: os seis estudos de Évora a que os quatro sucederam saem do que se constrói (11.11.2026)

Acrescenta: frases
Medidas: medidas-rec2.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), na worktree do sítio `rec2-2026-11-11`, sobre o `main` de 11.11.2026 (`740595bbb`, com o estudo das contas da Câmara já na edição de lançamento). O motor não muda. A medição em que assenta é a de `retirada-seis.py` (nesta pasta, só leitura), corrida sobre o `dist/` da cabeça de partida; a saída é `RETIRADA-dos-seis.json`. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas, um commit no fim de cada ponto numerado. As tuas medidas, se as guardares, vão para `medidas-do-construtor-rec2.json`, nunca para o ficheiro das medidas deste mandato.*

## Porquê

Évora tem dez estudos no arquivo, e seis deles foram substituídos a 01.10.2026 por quatro que contam o mesmo com mais fontes. Os seis continuam publicados como edições datadas, com erros que os quatro já não têm, e um leitor que chegue a um deles lê uma versão que este projeto já não sustenta. A decisão do lugar de direção, com a palavra do financiador como leitor: em ensaio, o que foi substituído não se mostra. Os seis deixam de ter páginas; quem tiver um endereço antigo vai parar ao estudo que lhes sucedeu.

Nada se apaga do repositório: os documentos, os registos e as listas dos seis ficam onde estão, e o motor não muda. Muda o que se constrói e o que as réguas esperam encontrar construído.

## §0 O que se mediu

Medido por guião na cabeça `740595bbb`, com o `dist/` dessa cabeça:

1. **Os trabalhos.** `src/data/studies.mjs` tem 19 trabalhos, e seis têm `sucedidoPor`. Os sucessores, lidos de lá: `evora-orcamentado-pago-devido-2025` e `evora-quinze-anos-cinco-mandatos` (este com três sucessores) para `evora-contas-da-camara-2010-2025`; `evora-os-pelouros-quem-os-teve-o-que-fizeram` para `evora-quem-governou-a-camara-2009-2025`; `evora-economia-investidores-portas-abertas-2026` e `evora-prometido-pago-auditado-2026` para `evora-economia-e-dinheiro-publico-de-fora-da-camara`; `evora-2027-prometido-painel-dinheiro` para `evora-2027-capital-europeia-da-cultura`. O de quinze anos tem ainda por sucessores o de quem governou e o da economia. Três dos seis só têm edição portuguesa, e o sucessor `evora-quem-governou-a-camara-2009-2025` também.
2. **As páginas.** Os seis têm 29 rotas próprias construídas (a página, o documento e as edições datadas, por língua; a lista por estudo está em `RETIRADA-dos-seis.json`), e 20 ficheiros construídos fora delas têm uma ligação para um dos seis (o índice dos estudos nas duas línguas, as páginas dos sucessores e a página inicial).
3. **As listas.** `ledger/frases/por-registar.json` tem 2202 entradas, e 582 são dos seis; `scripts/voz-excecoes.json` tem 27 exceções em rotas dos seis; `src/data/datas-de-publicacao.json` tem 9 entradas dos seis; a isenção da VOZ-2 nomeia dois dos seis; `vercel.json` nomeia os seis em 18 linhas. Nenhuma linha do livro tem um dos seis no campo `study`.
4. **As contagens.** A linha `estudos-publicados` vale 19 e a `estudos-evora-publicados` vale 4. O teto da L1 é 3508.
5. **Um erro conhecido que sai com as páginas:** a página e o documento de `evora-orcamentado-pago-devido-2025` dizem que a taxa de execução da receita caiu de `96%` para `61,44%` em quatro anos, comparando duas medidas diferentes; a linha do livro foi corrigida a 11.11.2026 e o estudo que lhe sucedeu já não o diz.

Outras medidas da mesma coisa: a contagem do arquivo que o próprio sítio publica (as linhas `estudos-publicados` e `estudos-evora-publicados`, conferidas na construção contra `src/data/studies.mjs`). Não há outra medição publicada.

## O que fazes

1. **Um estado novo para um trabalho: retirado.** Os seis trabalhos com `sucedidoPor` em `src/data/studies.mjs` passam a ter esse estado. Um trabalho retirado não está nos trabalhos nem nas edições publicadas, não conta em nenhuma contagem do arquivo, e nenhuma rota se gera para ele: a página do estudo, os documentos, as edições datadas e os registos. Os quatro `getStaticPaths` que hoje percorrem todos os trabalhos passam a saltar os retirados. Planta: um trabalho retirado com uma página construída recusa; um trabalho publicado sem página continua a recusar como hoje.

2. **Os endereços antigos vão para o sucessor.** Cada rota própria dos seis (a página, o documento, as edições datadas, nas duas línguas, e as rotas `/texto` e `/text` que já redirecionam) passa a responder com um redirecionamento permanente em `vercel.json`: para a página do estudo que lhe sucedeu, na mesma língua; o estudo com três sucessores vai para a página de Évora (`/municipios/evora/` e a inglesa). O destino lê-se de `sucedidoPor`, não se escreve à mão: um guião gera as entradas e uma régua confere que cada rota que os seis tinham na cabeça de partida (a lista fica guardada nesta pasta) tem um redirecionamento, que o destino existe construído e que a origem já não existe. A célula dos redirecionamentos do `gate:html` passa a aceitar, para um trabalho retirado, o destino no sucessor. Plantas: uma rota antiga sem redirecionamento; um destino que não existe; um destino escrito à mão diferente do de `sucedidoPor`.

3. **As páginas dos quatro deixam de apontar para os seis.** A nota que começa por `Sucede a` sai das páginas dos sucessores, e a nota do sucessor deixa de ter onde aparecer; os componentes e os rótulos que só serviam para isso saem, com as réguas e as plantas que os conferiam a passarem a conferir a ausência (nenhuma página construída tem uma ligação para uma rota dos seis). Essa régua corre sobre o sítio inteiro: a página inicial, as páginas dos lugares, o índice, o mapa do sítio, as novidades, a agenda, as leituras.

4. **As listas que repetem frases dos seis saltam os retirados, e só esses.** As repetições das listas VOZ-2A, VOZ-2B e COR-AGUA pedem as páginas no `dist/`: para um estudo retirado, a entrada salta-se e conta-se; para um estudo publicado sem páginas, continua a recusar. A conta das entradas saltadas confere com a das entradas dos seis em cada lista. Plantas dos dois lados.

5. **As listas que só encolhem, encolhem.** Saem as entradas dos seis de `ledger/frases/por-registar.json`, de `scripts/voz-excecoes.json`, da isenção da VOZ-2 e de `src/data/datas-de-publicacao.json`; as leituras, as citações e as entradas da agenda que só existiam para os seis saem ou deixam de se mostrar. Para cada uma, o relatório diz quantas saíram e a conta contra a medição.

6. **As páginas de amostra dos testes passam para um estudo vivo.** Os testes e as réguas que usam um dos seis como página de amostra passam a usar um dos quatro (o das contas, salvo onde a forma medida só existir noutro), e cada planta prova que ainda morde na amostra nova. O teto da L1 desce para o valor medido.

7. **As duas linhas do livro que contam estudos.**
   - `estudos-publicados` passa ao valor que a construção contar, com uma entrada nova na sua história, de natureza atualização e com a data `2026-11-11`. A razão, letra por letra: «Os seis estudos de Évora de agosto e setembro de 2026, a que sucederam os quatro de outubro, saíram do arquivo.» Em inglês: «The six Évora studies of August and September 2026, succeeded by the four of October, left the archive.»
   - `estudos-evora-publicados` mantém o valor. Na `derivation`, a frase sobre os seis passa a: «Os seis estudos de Évora de agosto e setembro de 2026 a que estes quatro sucederam saíram do arquivo.» Em inglês: «The six Évora studies of August and September 2026 that these four succeeded have left the archive.» As entradas antigas da história ficam como foram escritas.
   - A contagem de Évora deixa de depender de `sucedidoPor` para excluir os seis: conta os trabalhos publicados cujo objeto é Évora.

8. **O que não muda.** `studies-src/`, `registos/`, as listas VOZ e COR-AGUA, as entradas antigas de `src/data/correcoes.mjs` e os ficheiros de `design/` ficam. O motor e a sua tabela das edições ficam. As linhas do livro que os estudos vivos usam e que nasceram nos seis continuam a atravessar pelo mesmo caminho.

## A prova

O `build` da cabeça e as conferências que cada ponto toca, com as plantas, incluindo as que só correm com o navegador (`check:indice`, `check:leituras`, `check:sobreposicao`, `check:largura`), pelo escrivão. A lista inteira do `verify` corre-a o lugar de direção por guião depois da tua passagem: não a corras; este bloco mexe no que muitas réguas esperam encontrar, e os vermelhos que ela der voltam-te numa adenda só. As frases do ponto 7 conferem-se no HTML construído das páginas das duas linhas, nas duas línguas.

## O relatório

Curto, em `RELATORIO-REC2-1.txt` nesta pasta, ponto a ponto: o que mudou, a planta e o que deu; as contas do ponto 5 contra a medição; a lista dos redirecionamentos gerados; o que o leitor vê diferente; as testemunhas novas; as listas que mexeram e que este mandato não nomeou; os códigos, cada um lido do seu ficheiro. Os commits com o assunto a começar por `REC2`.

## Quando paras

Só numa régua que proteja um número, uma fonte ou uma pessoa e só passe enfraquecida: páras nesse ponto, dizes qual e porquê, e fazes os outros. Para tudo o resto: deixa, diz e continua. O teto da passagem, num commit são.

## O fim

A prova acima e o relatório. Se o tempo não chegar, a ordem é a dos números: os pontos 1 a 5 inteiros antes dos outros.
