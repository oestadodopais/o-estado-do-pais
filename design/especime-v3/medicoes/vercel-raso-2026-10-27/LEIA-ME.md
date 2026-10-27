# VR1 · a régua I9 de integração lê o ficheiro comitado, não o `git` vivo (terça-feira 27.10.2026)

*O relatório do bloco, escrito pelo lugar de direção (Claude Fable 5.1), que fez a correção dirigida (§1.202 (1)); a leitura curta (M48) é de outra família. O mandato está ao lado, no pacote da leitura. Os números deste relatório estão em `medidas.json`, escritos por guião a partir dos registos da máquina.*

## O que mudou para o leitor

Nada numa página. O que muda é que a cabeça que já está em `main` (0995e02c1: a caixa «O que há de novo» da primeira página, a FP1, e a recomendação, a opinião e a frase da Saúde do item do Orçamento reescritas, a OG1-B0) passa a conseguir chegar ao ar: a construção de produção da Vercel dessa cabeça parou na régua I9 de integração, e o sítio no ar ficou na cabeça da madrugada (6c6ae4313) enquanto `main` esteve à frente.

## O que falhou, medido

A régua de integração de `tests/hb1/publicacao.mjs` (o troço `--html-construido`, dentro de `npm run check:datas`, na cadeia do `build`) lia a data de entrada de cada edição declarada por `git log --diff-filter=A` vivo. A Vercel constrói de uma cópia rasa; numa cópia rasa o `git` responde o commit mais antigo que a cópia tem. O estudo do Orçamento declara `date: '2026-10-21'` desde a FP1-e; o ficheiro comitado `src/data/datas-de-publicacao.json` diz que as duas edições entraram a 2026-10-20 (commit 940685162), e o `git` numa árvore com história completa diz o mesmo; numa cópia feita com `git clone --depth 10` deste repositório (`is-shallow-repository` = `true`, 17 commits visíveis) o `git` responde 2026-10-26, e a régua recusou a data declarada por ser «anterior ao commit de entrada». O registo da Vercel (`vercel inspect --logs`, o excerto em `vercel.excerto.log`) tem a asserção na linha 9981 e o erro final na linha 10002, com a hora 17:14:29 UTC e o lugar `tests/hb1/publicacao.mjs:61`. O recibo da aterragem parada diz o resto do tempo: o ramo publicado às 16:20:25 UTC, o portão do GitHub verde às 17:03:36 UTC (43 minutos), `main` publicado às 17:03:44 UTC, a paragem às 17:14:58 UTC com o código 1.

Porque não se viu antes: com `date: null` a régua não compara datas, e a primeira data declarada chegou hoje; nenhuma corrida da casa construía numa cópia rasa. A casa já tinha a lição escrita no F1.4b (04.09.2026, o cabeçalho de `src/lib/datas-do-repositorio.mjs`), para a página; a régua, acrescentada depois, não a seguiu.

## A correção (1 ficheiro, 18 linhas acrescentadas e 6 retiradas)

Em `tests/hb1/publicacao.mjs`, a data de entrada de cada edição declarada lê-se agora por `dataDaEdicaoNoRepositorio(slug, lang)`, do ficheiro comitado, e o `import` de `execFileSync` saiu; uma edição sem data no ficheiro falha com a frase que nomeia o ficheiro, em vez de passar; o comentário diz a razão e cita o F1.4b e a I272. O que mantém o ficheiro honesto onde a história existe é `scripts/check-datas.mjs`, na mesma cadeia: só compara o ficheiro com o `git` quando a árvore tem história completa, e compara sempre o ficheiro com o que as páginas construídas imprimem. Não se pôs a Vercel a clonar fundo: um facto do repositório mede-se uma vez, onde a história está, e viaja escrito.

## As provas, com o comando e o código

- A régua e as duas plantas, na árvore com história completa, contra o `dist/` da cabeça (`plantas.log`): `node tests/hb1/publicacao.mjs` código 0; `node tests/hb1/publicacao.mjs --html-construido` código 0, «I9 integração: 4 edições reais verdes; 4 páginas sem scripts recusadas»; `node tests/hb1/publicacao.mjs --planta-data` código 1 (a planta antiga, recusada); `node tests/hb1/publicacao.mjs --html-construido --planta-entrada` código 1 (a planta nova: a mesma página com uma entrada um dia depois da data declarada, recusada nas 4 edições; o código 2 ficaria reservado a uma planta não recusada, para um guião distinguir as duas coisas).
- A construção inteira (`npm run build`) numa cópia `git clone --depth 10` da cabeça ec391c323, fora das árvores, como a Vercel a faz: código 0 em 379 segundos, com a mesma linha «I9 integração: 4 edições reais verdes» (`raso-build.excerto.log`); antes da correção, a mesma cópia dava ao `git` a entrada 2026-10-26.
- A corrida inteira do `verify` na árvore completa, com um código por passo (`resumo-verify.md`): 52 passos, 0 vermelhos; o `build` com o código 0 e o `typecheck` com o código 0; 2061 segundos somados.
- A leitura curta (M48) por outra família, com cinco estragos plantados só nas cópias do pacote: por fazer: esta leitura (o resultado entra neste relatório antes de aterrar).

## Onde parou e o que ficou aberto

- A aterragem desta cabeça por `aterrar.sh`, e a conferência do sítio no ar (`version.json` com a cabeça nova, a caixa da primeira página e o item do Orçamento nas duas edições): por fazer, depois da leitura.
- Para a higiene (não neste bloco): `tests/cartao/rp4nh.mjs` lê a história (`git log --follow`) no `check:cartao`, só no `verify`, que corre no GitHub com `fetch-depth: 0`; se entrar na cadeia do `build`, falha do mesmo modo numa cópia rasa.
- Para a sexta-feira (a linha da GARGALOS sobre o portão do GitHub e a Vercel): a cadeia do `build` corre três vezes por aterragem (a máquina, o GitHub, a Vercel) e só a terceira corre numa cópia rasa; a corrida da máquina pode construir uma vez numa cópia `--depth 10` quando a cadeia do `build` mudar, por guião, ao custo medido aqui.
