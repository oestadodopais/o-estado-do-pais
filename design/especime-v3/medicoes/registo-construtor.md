# `check:registo` · o portão dos números dos documentos que governam · relatório do construtor

*Bloco F0.6 do `design/observatorio/PLANO-fiabilidade-2026-09-02.md` §2, com a parte numérica de F0.10 dobrada dentro (a régua não fica verde sem ela). Saído de `main` `e2514cbc`, no worktree `registo-2026-09-02`. Construtor: Claude Opus 5. A razão está na `AUDITORIA-2026-09-02.md` §6 («O caso dos 53 011») e na varredura de números do Desktop do diretor (`F-varredura-numeros.md`, 02.09). Cada número deste relatório traz ao lado o comando que o produziu, e nenhum foi copiado de outro documento. Sem travessões na prosa.*

**Modelo: Claude Opus 5.**

## 0 · O que ficou feito

Existe `scripts/check-registo.mjs`, no `build` (passo 2, logo a seguir ao `ledger:check`) e no `verify`. Entra na CI sem mexer no `portao.yml`, porque o fluxo corre os três comandos da casa e este passo vive dentro de dois deles. Mede oito factos de estado da casa nas suas fontes, lê os cinco documentos que governam, e recusa duas coisas: um facto de estado escrito sem data que não bate com o medido, e um valor do sítio citado sem o id da sua linha ao lado. Corre em **0,15 s** (`/usr/bin/time -p node scripts/check-registo.mjs`, três corridas: 0,15 · 0,16 · 0,16).

Seis positivos conhecidos, cada um numa cópia dos documentos apontada por `OEDP_REGISTO_DIR`: quatro vermelhos e dois verdes, códigos de saída `[1, 1, 1, 1, 0, 0]` (§5).

Doze correções na `VISAO.md` e no `README.md` (§4): **seis números envelhecidos** (2 602 → 2 916, duas vezes; oito → quinze passos; treze → dezasseis documentos; treze → dezasseis edições; dez → doze trabalhos) e **seis afirmações de prosa ou de estrutura** (a data do cabeçalho da `VISAO.md` §4; o JSON por linha, que existe e estava na coluna «espera»; o Vercel, religado a 01.09; «hoje só `evora`», que são 308; «oito edições» desambiguada para «oito edições com registo»; a lista dos passos do `README.md`, que tinha oito itens para uma cadeia de catorze). Todas na forma da casa («N a 02.09.2026; dizia «M»»), nenhuma reescrita em silêncio. Depois delas a régua fica verde sobre a árvore de hoje: **16 afirmações correntes conferidas, 3 datadas saltadas, 1 valor do sítio com o id da linha ao lado, 0 erros.**

## 1 · A gramática: o que é corrente, o que é datado

Uma **afirmação** é um número seguido da palavra de um facto. É **corrente** por omissão, e então tem de ser igual ao valor medido na fonte. É **datada**, e sai da conferência, por uma de três formas, e só por essas três. A forma é que a torna reconhecível: nada se adivinha.

| forma | como se escreve | exemplo verde | exemplo vermelho |
|---|---|---|---|
| (i) | o número seguido de « a dd.mm.aaaa » no mesmo bloco | «2 602 linhas a 30.08.2026» | «2 602 linhas» |
| (ii) | o número dentro de um parêntesis que carrega uma data | «(2 602 linhas a 30.08.2026)» | «(2 602 linhas, a contagem antiga)» |
| (iii-a) | o número dentro da citação que «dizia» (ou «eram», «era», «tinha») abre | «dizia «as 132 linhas»» | «132 linhas» |
| (iii-b) | o número logo a seguir a essa palavra, sem citação pelo meio | «eram 2 602 linhas» | «são 2 602 linhas» |

**A emenda que impede o portão de se desarmar sozinho.** Uma data que é a de **hoje** não isenta. «2 916 linhas a 02.09.2026», lido a 02.09.2026, afirma o valor de hoje e confere-se como corrente; lido a 03.09.2026 já é história e sai. Sem esta emenda bastava carimbar a data do dia em qualquer número errado para o portão o deixar passar, e a régua tornava-se um carimbo. A forma (iii) não leva emenda e é absoluta: «dizia «M»» declara-se, pela própria palavra, como o valor antigo.

**Porque é o bloco, e não a linha física.** A primeira versão lia linha a linha e não via o `README.md` a dizer «hoje oito | edições, seis portuguesas»: a frase parte-se na dobra das 78 colunas e as duas metades ficam em linhas diferentes. Uma régua que uma mudança de parágrafo desarma não é uma régua. A unidade passou a ser o **bloco**: um parágrafo com as suas dobras juntas, uma linha de tabela (que é um registo e vale sozinha), um título ou um item de lista; nada dentro de um bloco de código cercado. É também dentro do bloco que se procura o id da linha do livro-razão. Cada achado guarda a linha física onde começa, que é o que o erro imprime.

**Duas precauções, ambas medidas neste corpus e não supostas.**

1. **«um», «uma», «dois» e «duas» não são números para este portão.** Nos cinco documentos são sempre artigo («uma linha por registo», «um estudo migrado») ou as duas edições de língua («nas duas edições»). Medido: 21 ocorrências, nenhuma delas uma afirmação de estado (`node probe.mjs`, a varredura de candidatos que precedeu a construção). Uma contagem verdadeira de um ou de dois escreve-se em algarismos.
2. **«N X em M» é um subconjunto, e o que se confere é M.** O `PLANO` §0 diz «o painel semanal confere 32 linhas em 2 916»: 32 é a amostra, 2 916 é o facto, e a frase é verdadeira. O portão apanha 1 subconjunto e confere o denominador.

**A palavra ambígua que não se confere, e porquê.** «edições» quer dizer duas coisas diferentes nestes documentos, e as duas estão certas: as **16** edições do arquivo (`src/data/studies.mjs`) e as **8** edições com registo de conteúdo, que são as que têm página de leitura (`registos/manifest.json`). Um portão que conferisse a palavra nua punha vermelha uma frase verdadeira (`README.md:218`, «hoje oito edições»). Por isso a palavra do facto é o composto («edições do arquivo», «edições publicadas»; «edições com registo»), e a palavra nua sai da conferência e **diz-se no relatório do portão**, com a linha onde apareceu. Um portão que salta uma frase e não o diz é pior do que um portão que não existe. Nesta árvore a frase foi desambiguada («oito edições com registo»), e passou de saltada a conferida.

**O valor do sítio citado sem o id da linha.** Duas formas disparam a regra, e nunca mais nenhuma:

- **V1** «<Nome> tem <número> <unidade>»: um nome próprio, o verbo, o número e uma unidade do livro-razão. É a forma da manchete, e é a que falhou a 01.09.
- **V2** «<número em algarismos> <unidade>»: a unidade tal como o livro-razão a escreve, e o número em algarismos. Só algarismos, porque um valor medido escreve-se em algarismos e as unidades por extenso destes documentos («duas edições», «quinze anos») são prosa. As quatro unidades que também são palavras de facto («estudos», «edições», «correções», «municípios») ficam com a regra do facto, que já as confere, e saem do vocabulário de V2. Sobram **34 unidades** (impresso pelo próprio portão).

O número tem de ser igual ao `value` da linha citada, com a separação dos milhares normalizada antes de comparar: U+202F, U+00A0, U+2009, espaço comum ou nenhum são o mesmo número. A varredura de 02.09 mediu as três camadas da casa a escreverem-no de três maneiras (U+0020 na prosa markdown, U+00A0 no HTML servido, U+202F no CSV e no JSON), e o portão trata as três como uma. Sem id no bloco, o erro nomeia os ids mais próximos como faz o `src/lib/ledger.mjs`: primeiro os que têm aquele valor naquela unidade, depois os que partilham uma palavra com o bloco **dentro da mesma unidade**, e só por fim o livro-razão inteiro.

**O que este portão não lê.** Prosa. Duas das cinco classes da varredura de 02.09, «hoje só `evora`» e «vazio» (o arquivo), são frases e não algarismos: **estão fora do âmbito deste portão e são do `check:prosa` da fase 3** (`PLANO` §5, F3.1). O «hoje só `evora`» foi corrigido à mão neste bloco, porque F0.10 o manda; o portão não o teria apanhado e não o apanha. O «vazio» do arquivo fica como está, por ser prosa e por ser do diretor a linha onde vive.

**O que fica de fora, por escolha.** O `DECISIONS.md`: é o registo, e os seus números são históricos por natureza; uma decisão de agosto diz o que era verdade em agosto, e reescrevê-la seria falsificar o registo. Do `PLANO` leem-se só o §0 e o §1 (as garantias e as regras); do §2 em diante um número é uma medida de aceitação de um bloco por construir, e não um estado.

## 2 · Os factos, medidos na fonte

Nenhum destes números foi lido num documento. Cada um sai do comando da última coluna, corrido na raiz do worktree.

| facto | palavras que o dizem | fonte | valor | comando |
|---|---|---|---|---|
| linhas do livro-razão | «linhas do livro-razão», «linhas» | `ledger/claims/*.yml` | **2 916** | `ls ledger/claims/*.yml \| wc -l` → `2916` |
| concelhos com página | «concelhos», «municípios», «páginas de concelho», «páginas de município» | `src/data/municipios.mjs` · `MUNICIPIOS_COM_PAGINA` | **308** | `node -e "import('./src/data/municipios.mjs').then(m=>console.log(m.MUNICIPIOS_COM_PAGINA.length))"` → `308` |
| estudos (trabalhos) no arquivo | «estudos», «trabalhos» | `src/data/studies.mjs` · `WORKS` | **12** | `node -e "import('./src/data/studies.mjs').then(m=>console.log(m.WORKS.length))"` → `12` |
| edições do arquivo | «edições do arquivo», «edições publicadas» | `src/data/studies.mjs` · `EDITIONS` | **16** | `node -e "import('./src/data/studies.mjs').then(m=>console.log(m.EDITIONS.length))"` → `16` |
| documentos alojados | «documentos alojados», «documentos» | `studies-src/<slug>/<lingua>.html` | **16** | `node -e "import('./src/lib/documentos.mjs').then(m=>console.log(m.todosOsDocumentos().length))"` → `16` |
| correções publicadas | «correções publicadas», «correções» | `ledger/claims/*.yml` · `corrections[].kind == 'correcao'` | **3** | `node -e "import('./src/lib/ledger.mjs').then(m=>console.log(m.contagensDoRegisto().correcoes_publicadas))"` → `3` |
| passos da construção | «passos encadeados», «passos» | `package.json` · `scripts.build` | **15** | `node -e "console.log(require('./package.json').scripts.build.split('&&').length)"` → `15` |
| páginas de leitura | «páginas de leitura», «edições com registo» | `registos/manifest.json` | **8** | `node -e "console.log(Object.keys(require('./registos/manifest.json').registos).length)"` → `8` |

**Cada facto mede-se duas vezes, e as duas medições têm de bater.** Um facto que se mede de duas maneiras e dá dois números não é um facto, e enquanto discordarem nenhum documento pode citar nenhum dos dois. As segundas medições:

| facto | segunda medição | valor | linha do livro-razão que o publica | valor da linha |
|---|---|---|---|---|
| linhas | `loadClaims().size` | 2 916 | (não há) | |
| concelhos | `src/data/concelhos.gerado.json` | 308 | `municipios-portugal-caop-2025` | `"308"` |
| estudos | | | `estudos-publicados` | `"12"` |
| edições | | | `edicoes-publicadas` | `"16"` |
| documentos | `grep -c '^  - slug:' studies-src/manifest.yml` → `16` | 16 | (não há) | |
| correções | | | `correcoes-publicadas` | `"3"` |

Esta conferência apanhou um erro meu na primeira corrida: contei `concelhos.gerado.json` **mais** Évora e dei 309 contra 308, porque supus que o ficheiro gerado excluía Évora. Não exclui (`node -e "console.log(require('./src/data/concelhos.gerado.json').length)"` → `308`; `entradasGeradas(['evora'])` → `307`). A régua recusou-se a passar até as duas medições concordarem, que é exactamente o que ela existe para fazer.

## 3 · As afirmações encontradas, documento a documento

Estado final, com a árvore de hoje (a saída do portão, corrida limpa):

| documento | correntes conferidas | datadas saltadas | subconjuntos | valores do sítio | erros |
|---|---:|---:|---:|---:|---:|
| `VISAO.md` | 3 | 1 | 0 | 0 | 0 |
| `README.md` | 10 | 2 | 0 | 0 | 0 |
| `design/especime-v3/PENDENTES-DO-DIRETOR.md` | 2 | 0 | 0 | 1 | 0 |
| `CLAUDE.md` | 0 | 0 | 0 | 0 | 0 |
| `design/observatorio/PLANO-fiabilidade-2026-09-02.md` (§0 e §1) | 1 | 0 | 1 | 0 | 0 |
| **total** | **16** | **3** | **1** | **1** | **0** |

As datadas saltadas, com a forma por que saíram (o portão imprime-as uma a uma, e é assim que se vê o que não conferiu):

- `VISAO.md:23` «2 602 linhas», forma (iii-a): está dentro da citação que «dizia» abre.
- `README.md:42` «132 linhas», forma (iii-a): a descrição do próprio passo 2, que cita a forma datada como exemplo.
- `README.md:338` «132 linhas», forma (iii-a): «corrigido nesse dia: dizia «as 132 linhas», a contagem de 18.08».

O subconjunto: `PLANO:11`, «o painel semanal confere 32 linhas em 2 916» → confere-se 2 916, não 32.

O valor do sítio: `PENDENTES:21`, «Évora tem 58 567 pessoas.», com `evora-populacao-2025` no mesmo bloco e `value: "58 567"`. Verde pelas duas metades da regra: o id está lá, e o número é o da linha.

O `CLAUDE.md` não tem nenhuma afirmação de estado. Bate certo com a varredura de 02.09, que o varreu por completo e reteve zero números («todo o token com dígito é data, secção `§`, versão de modelo ou ficheiro/caminho»).

## 4 · As correções, uma a uma, com o antes e o depois

Todas na forma da casa. Nenhuma reescrita em silêncio.

### `VISAO.md`

| onde | antes | depois | medido com |
|---|---|---|---|
| §3, camada 1 (l. 23) | «Existe: 2 602 linhas a 30.08.2026, publicadas em JSON e CSV.» | «Existe: 2 916 linhas a 02.09.2026, publicadas em JSON e CSV; dizia «2 602 linhas a 30.08.2026».» | `ls ledger/claims/*.yml \| wc -l` |
| §4, cabeçalho (l. 30) | «(30.08.2026)» | «(02.09.2026; a leitura anterior era de 30.08.2026)» | a data da própria conferência |
| §4, camada 1 (l. 35) | «2 602 linhas; JSON e CSV; selos» | «2 916 linhas a 02.09.2026, dizia «2 602»; JSON e CSV; selos» | `ls ledger/claims/*.yml \| wc -l` |
| §4, camada 6 (l. 40) | «espera: … feeds, **dados por linha**, MCP» | «existe: … e um JSON por linha a 02.09.2026 (dizia que os dados por linha esperavam)»; sai da coluna «espera» | `find dist/livro-razao -name '*.json' \| wc -l` → `2916` |
| §5, a casa como entidade (l. 49) | «falta religar o Vercel» | «o Vercel religado a 01.09.2026 e o repositório do sítio público desde esse dia, dizia «falta religar o Vercel»» | `PENDENTES-DO-DIRETOR.md` «Feitas», linha de 01.09.2026 |

A linha 23 estava datada («a 30.08.2026») e o portão deixava-a passar pela forma (i). Corrigiu-se na mesma, porque F0.10 a nomeia e porque a frase abre com «Existe:», que é o estado presente. Fica dito aqui que **esta correção não foi imposta pela régua**: foi imposta pelo bloco.

### `README.md`

| onde | antes | depois | medido com |
|---|---|---|---|
| l. 30 | «`npm run build` são **oito passos** encadeados» | «são **quinze passos** encadeados a 02.09.2026 (dizia «oito», a cadeia de 15.08)» | `node -e "console.log(require('./package.json').scripts.build.split('&&').length)"` → `15` |
| lista dos passos | oito itens, e a cadeia tinha catorze | quinze itens, na ordem da cadeia: entram `check:registo` (o 2), `cartoes` (o 7), `check:mapa`, `check:regioes`, `check:areas`, `check:voz` e `check:lingua` (11 a 15) | a mesma cadeia do `package.json` |
| l. 233 | «alojados **treze documentos**: todas as **treze edições** do arquivo, dos seus **dez trabalhos**» | «alojados **dezasseis documentos** a 02.09.2026 (dizia «treze»): todas as dezasseis edições do arquivo, dos seus doze trabalhos» | `todosOsDocumentos().length` → `16`; `EDITIONS.length` → `16`; `WORKS.length` → `12` |
| l. 218 | «hoje **oito edições**, seis portuguesas e duas inglesas» | «hoje **oito edições com registo**, seis portuguesas e duas inglesas» | `Object.keys(registos).length` → `8`; a palavra composta tira a frase da ambiguidade e põe-na a conferir |
| l. 155 | «hoje só `evora`» | «os 308 a 02.09.2026, uma entrada escrita à mão (`evora`) e 307 geradas de `src/data/concelhos.gerado.json`; dizia «hoje só `evora`», o estado até ao bloco dos 308» | `MUNICIPIOS_COM_PAGINA.length` → `308` |

As contagens do livro-razão do `README.md` (as duas «2 916 … dizia «132»») já estavam datadas a 02.09 antes deste bloco, e ficaram como estavam.

O «hoje só `evora`» é prosa: **o portão não o vê**, e não o veria mesmo depois desta correção. Está aqui porque F0.10 o manda e porque é falso; a régua que o apanharia é a do `check:prosa` (F3.1).

### O que não se tocou

`DECISIONS.md` (é o registo). O «vazio» do arquivo nos pendentes (prosa, e a linha é do diretor). Os «662 commits e 9 776 blobs» dos pendentes: a varredura de 02.09 mediu 652 e 9 766 em `38d9166` e o plano diz que a base de contagem é a de todos os ramos; não é um facto de estado da casa, não tem palavra de facto, e o portão não o lê. Fica para o resto de F0.10.

## 5 · Os positivos conhecidos: cada um visto vermelho, e depois verde

A porta do estrago plantado é `OEDP_REGISTO_DIR`, na forma do `OEDP_DIRECAO` do portão da voz e do `OEDP_REGISTOS_DIR` do portão dos documentos: aponta para uma **cópia** dos cinco documentos. Os factos continuam a medir-se na árvore verdadeira; o que se planta é só o que se lê. O arnês (`positivos.py`) recusa-se a correr quando a troca não entra no ficheiro, para que um estrago que não chega a ser plantado nunca possa passar por um verde da régua (é a regra 14 da casa, e apanhou-se a si própria: a primeira versão do arnês usava `perl` sem `-Mutf8` e os padrões com «É» e ««»» não casavam, o que deu três verdes falsos até se conferir o `diff` das cópias).

| # | o que se plantou, e onde | comando | saída | esperado |
|---|---|---|---|---|
| a | «Évora tem **53 011** pessoas» ao lado de `evora-populacao-2025` (`PENDENTES:21`) | `OEDP_REGISTO_DIR=…/plantas/a node scripts/check-registo.mjs` | **exit 1** | 1 |
| b | «**2 602** linhas» sem data (`VISAO:35`) | `OEDP_REGISTO_DIR=…/plantas/b node scripts/check-registo.mjs` | **exit 1** | 1 |
| c | «**132** linhas» sem data (`README:338`) | `OEDP_REGISTO_DIR=…/plantas/c node scripts/check-registo.mjs` | **exit 1** | 1 |
| d | «Évora tem 58 567 pessoas» com o id tirado do bloco (`PENDENTES:21`) | `OEDP_REGISTO_DIR=…/plantas/d node scripts/check-registo.mjs` | **exit 1** | 1 |
| e | «(2 602 linhas a 30.08.2026)», a mesma afirmação de (b), datada | `OEDP_REGISTO_DIR=…/plantas/e node scripts/check-registo.mjs` | **exit 0** | 0 |
| f | os documentos de hoje, sem planta nenhuma | `OEDP_REGISTO_DIR=…/plantas/f node scripts/check-registo.mjs` | **exit 0** | 0 |

Códigos de saída, por ordem: `[1, 1, 1, 1, 0, 0]`.

O que cada vermelho disse, palavra por palavra:

```
(a) design/especime-v3/PENDENTES-DO-DIRETOR.md:21 escreve o valor «53 011 pessoas» e nenhum
    id do bloco o confirma.
    «…o teto legal?** A cabeça nova diz «Évora tem 53 011 pessoas.» (o único número sem…»
    `evora-populacao-2025` diz "58 567". Ids em "pessoas" que nomeiam o mesmo assunto:
    `condeixa-a-nova-populacao-2025`, `evora-populacao-2021`, `evora-populacao-2025`, …

(b) VISAO.md:35 diz «| 1 | 2 602 linhas; JSON e CSV; selos; correções em `/metodo` |…» e o
    facto «linhas do livro-razão» vale 2916, medido em ledger/claims/*.yml.
    A frase não traz data, e uma frase sem data é o estado de hoje. Ou o número passa a 2916,
    ou a frase datou-se: «2916 a 02.09.2026; dizia «2 602»».
    Reproduz-se com: ls ledger/claims/*.yml | wc -l

(c) README.md:338 diz «…uma linha por registo, com cabeçalho (as 132 linhas). RFC 4180…» e o
    facto «linhas do livro-razão» vale 2916, medido em ledger/claims/*.yml.

(d) design/especime-v3/PENDENTES-DO-DIRETOR.md:21 escreve o valor «58 567 pessoas» e o bloco
    não traz nenhum id do livro-razão entre plicas.
    Um valor do sítio citado num documento que governa cita a linha que o prova.
```

O caso (a) é o dos 53 011: o portão recusa-o **duas vezes**, pelo valor que não é o da linha e pela ausência de um id que o confirme, e nomeia a linha certa com o valor certo na mesma mensagem.

**Um vermelho que não estava previsto e valeu a pena.** Ao escrever a descrição do passo 2 no `README.md` citei a frase «Évora tem 53 011 pessoas» como exemplo do que o portão apanha. O portão pôs o próprio `README.md` vermelho, e tem razão: um documento que governa não escreve esse número, nem como exemplo, porque não há id que o confirme e escrevê-lo ao lado do id certo é uma segunda falsificação. A frase passou a nomear o caso sem repetir o algarismo.

## 6 · Os três portões da casa, e a CI

Corridos por inteiro em cada um dos dois commits do bloco, e os códigos de saída registados tal como saíram:

| portão | comando | `b2f15243` | `ba3396b5` |
|---|---|---|---|
| construção | `npm run build` | **0** | **0** |
| verificação | `npm run verify` | **0** | **0** |
| tipos | `npm run typecheck` | **0** | **0** |

O `check:registo` corre dentro dos dois primeiros, e vê-se no registo da construção: `> npm run ledger:check && npm run check:registo && npm run check:cruzamento && …` (linha 3 do `build.log`), com a sua saída na linha 33.

O segundo commit é só prosa: a regra da casa manda a prosa nova sem travessões, e as sete entradas novas da lista dos passos tinham-nos por imitarem as antigas. Os itens 1 e 3 da mesma lista já usavam dois pontos, de maneira que a forma existe e não se inventou nada. Fica o travessão nas duas linhas de erro impressas pelo portão, que não são prosa e seguem a forma que os outros portões da casa já imprimem («O LIVRO-RAZÃO NÃO PASSA — N erro(s)»).

**A CI.** O contexto `portao` é exigido em `main` e corre `npm run build`, `npm run verify` e `npm run typecheck`; o passo novo vive dentro dos dois primeiros e entra na CI **sem uma linha de alteração no `.github/workflows/portao.yml`**. Corrida do primeiro commit: [33677726722](https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33677726722), `conclusion=success`.

## 7 · O que este portão ainda não faz

Fica escrito, porque um portão que não diz onde acaba é uma garantia falsa.

1. **Não lê prosa.** «hoje só `evora`», «o arquivo vazio», «falta religar o Vercel»: as três eram falsas, as três se corrigiram à mão neste bloco (as duas primeiras) ou ficam por decisão do diretor (a terceira já corrigida), e nenhuma seria apanhada. É o `check:prosa` de F3.1.
2. **Não conta o que só existe depois de construir.** «7 234 páginas varridas» (`PLANO` §0, G1) é um facto do `dist/`, e este passo corre antes do `astro build`. Fica de fora, e a palavra «páginas» nua não é palavra de facto por isso mesmo.
3. **Cinco documentos, não todos.** `DECISIONS.md` é registo e fica fora por desenho. As notas de estado, os briefs, os relatórios de construtor e as ordens não entram: F4.1 («`check:registo` inteiro») é que os traz, e é lá que a regra passa a valer para todo o número de estado num documento que governa.
4. **Uma contagem nova de três, quatro ou cinco pode dar um vermelho falso.** «três linhas» a querer dizer três linhas de uma tabela seria recusado. A saída é a mesma que para tudo o resto: datar a frase ou escrever o denominador («três das 2 916 linhas»).
5. **Um documento que governa não pode desaparecer para passar a régua.** Um dos cinco em falta é uma recusa com mensagem própria, não um rastro de pilha (`OEDP_REGISTO_DIR` para uma pasta vazia → exit 1, «falta VISAO.md»). O que a régua não impede é acrescentar um documento novo que governe sem o inscrever na lista: essa é a mesma dívida do ponto 3.
6. **O vocabulário dos factos é fechado e escrito à mão.** Um facto novo da casa não é conferido até alguém o acrescentar à tabela `FACTOS`. O que a régua garante é que os oito que lá estão não envelhecem em silêncio, e que a palavra ambígua se diz em vez de se adivinhar.
