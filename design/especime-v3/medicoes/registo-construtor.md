# `check:registo` · o portão dos números dos documentos que governam · relatório do construtor

*Bloco F0.6 do `design/observatorio/PLANO-fiabilidade-2026-09-02.md` §2, com a parte numérica de F0.10 dobrada dentro (a régua não fica verde sem ela). Saído de `main` `e2514cbc`, no worktree `registo-2026-09-02`. Construtor: Claude Opus 5. A razão está na `AUDITORIA-2026-09-02.md` §6 («O caso dos 53 011») e na varredura de números do Desktop do diretor (`F-varredura-numeros.md`, 02.09). **Segunda passagem a 02.09.2026**, depois da leitura a frio do Codex (`critica/2026-09-02-codex-leitura-f06-registo.md`, 13 achados, 4 de 4 plantas vistas): a §8 diz o que cada achado mudou. Cada número deste relatório traz ao lado o comando que o produziu, e nenhum foi copiado de outro documento. Sem travessões na prosa.*

**Modelo: Claude Opus 5.**

## 0 · O que ficou feito

Existe `scripts/check-registo.mjs`, no `build` (passo 2, logo a seguir ao `ledger:check`) e no `verify`. Entra na CI sem mexer no `portao.yml`, porque o fluxo corre os três comandos da casa e este passo vive dentro de dois deles. Mede oito factos de estado da casa nas suas fontes, lê os cinco documentos que governam, e recusa três coisas: um facto de estado escrito sem data atracada que não bate com o medido, um valor do sítio citado sem o id da sua linha imediatamente ao lado, e uma corrida que leia menos afirmações do que o chão de cada documento. Corre em **0,18 s** (`/usr/bin/time -p node scripts/check-registo.mjs`, três corridas: 0,18 · 0,18 · 0,18).

Dezasseis positivos conhecidos, cada um numa cópia dos documentos apontada por `OEDP_REGISTO_DIR` com a bandeira `--prova`: catorze vermelhos e dois verdes, códigos de saída `[1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0]` (§5). Cada um exige, além do código, o **texto** do erro que mede: sair 1 por outro motivo qualquer não prova regra nenhuma.

Dezasseis correções na `VISAO.md` e no `README.md` (§4), todas na forma da casa e com o texto antigo **citado**, nunca parafraseado. Depois delas a régua fica verde sobre a árvore de hoje: **15 afirmações correntes conferidas, 6 datadas saltadas, 1 subconjunto com numerador e denominador conferidos, 1 valor do sítio com o id ao lado, 23 avaliadas contra um chão de 23, 0 erros.**

## 1 · A gramática: o que é corrente, o que é datado

Uma **afirmação** é um número junto da palavra de um facto, **nas duas ordens**: «2 916 linhas» e «as linhas são 2 916». É **corrente** por omissão, e então tem de ser igual ao valor medido na fonte. É **datada**, e sai da conferência, por uma de três formas, e só por essas três. Todas exigem **encosto**: uma isenção com janela é uma isenção injetável, e foi assim que a leitura a frio partiu a primeira versão.

| forma | o que exige | verde | vermelho |
|---|---|---|---|
| (i) | o número, a palavra do facto e « a dd.mm.aaaa » atracados: pelo meio só marcação e, no máximo, um qualificador curto sem pontuação de frase | «2 916 linhas a 02.09.2026» · «**dezasseis documentos** a 02.09.2026» | «2 602 linhas, e muita outra coisa pelo meio, a 02.09.2026» |
| (ii) | um parêntesis **equilibrado** do mesmo bloco que contém o número e uma data inteira | «(2 602 linhas, a contagem de 30.08.2026)» | «(2 602 linhas, a contagem de 30.08.2026» sem fechar: é erro, não isenção |
| (iii-a) | o número dentro da citação que a palavra histórica abre, e a palavra encostada à aspa | «corrigido nesse dia: dizia «as 132 linhas»» | «dizia o que se segue: 2 602 linhas» |
| (iii-b) | o número logo a seguir à palavra histórica, sem nada pelo meio | «eram 2 602 linhas» | «dizia, quinze símbolos antes, 2 602 linhas» |

As palavras históricas são «dizia», «diziam», «era», «eram», «tinha» e «tinham».

**A emenda que impede o portão de se desarmar sozinho.** Uma data que é a de **hoje** não isenta. «2 916 linhas a 02.09.2026», lido a 02.09.2026, afirma o valor de hoje e confere-se como corrente; lido a 03.09.2026 já é história e sai. Sem esta emenda bastava carimbar a data do dia em qualquer número errado. A forma (iii) é absoluta e não leva emenda: «dizia «M»» declara-se, pela própria palavra, como o valor antigo.

**A forma da correção**, que é a da casa: nunca se reescreve um número em silêncio. Escreve-se «N a 02.09.2026; dizia «M»»: o valor novo, a data em que se mediu, e o texto antigo **citado**. Uma paráfrase do estado antigo não é uma citação, e a segunda passagem corrigiu as quatro que o eram (§4).

**O subconjunto, «N X em M».** M confere-se contra o facto, N tem de ser menor ou igual a M, e N confere-se também quando o facto declara um subconjunto medido. «o painel semanal confere 32 linhas em 2 916» é verdadeiro e verde nas três contas: 2 916 é o facto, 32 é o subconjunto medido em `src/data/verificacao.mjs`, e 32 ≤ 2 916. Um subconjunto sem medida não se aceita em silêncio: conta-se, imprime-se, e diz-se que o numerador não foi conferido.

**A afirmação distributiva, «N X cada» e «N X por Y»**, não é um total: «as rotas PT e EN são duas linhas cada» fala de duas linhas por rota. Conta-se, imprime-se, e não se confere contra o total. É o que impede a régua de pôr vermelha uma frase verdadeira depois de «um», «uma», «dois» e «duas» passarem a ser números.

**Os números.** Por extenso de «um» a «noventa e nove», compostos incluídos («vinte e um»). Em algarismos com os separadores de milhar da casa, com ponto de milhar («2.916») ou nenhum, e com vírgula decimal para os valores do sítio («4,86»). Uma data nunca é um número: o ponto de milhar exige grupos de três.

**O que se lê de cada vez é um bloco**, e não uma linha física: um parágrafo com as suas dobras juntas, **um item de lista com as suas continuações indentadas**, uma linha de tabela, um título. Nada dentro de um bloco de código cercado, e **uma cerca que não fecha é um erro**, porque calaria o resto do documento em silêncio. O erro imprime sempre a linha física.

**A palavra ambígua que não se confere.** «edições» nua quer dizer duas coisas verdadeiras nestes documentos: as **16** do arquivo (`src/data/studies.mjs`) e as **8** com registo de conteúdo (`registos/manifest.json`). A palavra do facto é o composto; a nua sai da conferência e **diz-se no relatório**, com a linha. Hoje aparece 11 vezes, todas legítimas («nas duas edições» de língua).

**O chão de afirmações por documento.** Um verde só conta se a régua tiver lido alguma coisa. Cada documento declara o mínimo que hoje produz, e uma corrida que avalie menos falha, ainda que não encontre erro nenhum. Sem este chão, uma gramática partida por um acidente de escrita daria verde por não ver nada.

**O valor do sítio citado sem o id.** Duas formas disparam a regra: V1 «<Nome> tem <número> <unidade>» e V2 «<número> <unidade>». O id que vale é **o mais próximo depois do número, na mesma frase**, e o seu valor e a sua unidade têm de ser os do número escrito. Não é «algum id do bloco»: com dois valores e dois ids no mesmo bloco, cada valor emparelha com o seu, e um valor cujo id mais próximo diz outro número é recusado **mesmo que outro id do bloco calhe bater certo**. Uma frase acaba num ponto seguido de espaço fora de aspas e de parêntesis, ou no fim do bloco.

A separação dos milhares normaliza-se antes de comparar: U+202F, U+00A0, U+2009, espaço comum, ponto de milhar ou nada são o mesmo número, e a vírgula decimal fica. A varredura de 02.09 mediu as três camadas da casa a escreverem-no de três maneiras (U+0020 na prosa, U+00A0 no HTML servido, U+202F no CSV e no JSON).

**O que este portão não lê: prosa.** Duas das cinco classes da varredura de 02.09, «hoje só `evora`» e «vazio» (o arquivo), são frases e não algarismos: **estão fora do âmbito deste portão e são do `check:prosa` da fase 3** (`PLANO` §5, F3.1). O «hoje só `evora`» foi corrigido à mão neste bloco porque F0.10 o manda; o portão não o teria apanhado e não o apanha.

**O que fica de fora, por escolha.** O `DECISIONS.md`: é o registo, e os seus números são históricos por natureza. Do plano leem-se só o §0 e o §1; o corte é o título do §2, e **se ele não aparecer o portão para**, porque ler o plano inteiro poria vermelhas as medidas de aceitação dos blocos por construir, que não são estados.

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

**Nem todos os factos se medem duas vezes, e isso diz-se.** A primeira versão deste relatório escrevia «cada facto mede-se duas vezes», e era falso (leitura a frio, Major 10). O que há é isto, e o próprio portão o imprime:

| facto | segunda medição independente | linha do livro-razão que o publica | subconjunto medido |
|---|---|---|---|
| linhas | `loadClaims().size` → 2 916 | (não há) | «as que o painel semanal reconfere» = **32**, de `src/data/verificacao.mjs` · `VERIFICACAO.afirmacoes` |
| concelhos | `src/data/concelhos.gerado.json` → 308 | `municipios-portugal-caop-2025` = `"308"` | (não há) |
| documentos | `grep -c '^  - slug:' studies-src/manifest.yml` → 16 | (não há) | (não há) |
| estudos | **uma só fonte** | `estudos-publicados` = `"12"` | (não há) |
| edições | **uma só fonte** | `edicoes-publicadas` = `"16"` | (não há) |
| correções | **uma só fonte** | `correcoes-publicadas` = `"3"` | (não há) |
| passos | **uma só fonte** | (não há) | (não há) |
| páginas de leitura | **uma só fonte** | (não há) | (não há) |

São **três** com segunda medição e **quatro** reconciliados com a linha que os publica; os passos da construção e as páginas de leitura têm uma só fonte e mais nenhuma, porque contar a mesma cadeia ou o mesmo manifesto outra vez não é uma segunda medição, é a mesma coisa contada duas vezes.

Esta conferência apanhou um erro meu na primeira passagem: contei `concelhos.gerado.json` **mais** Évora e dei 309 contra 308, porque supus que o ficheiro gerado excluía Évora. Não exclui (`node -e "console.log(require('./src/data/concelhos.gerado.json').length)"` → `308`). A régua recusou-se a passar até as duas medições concordarem.

## 3 · As afirmações encontradas, documento a documento

Estado final, tal como o portão o imprime:

| documento | correntes | datadas | subconjuntos | valores do sítio | avaliadas | chão |
|---|---:|---:|---:|---:|---:|---:|
| `VISAO.md` | 3 | 1 | 0 | 0 | 4 | 4 |
| `README.md` | 10 | 5 | 0 | 0 | 15 | 15 |
| `design/especime-v3/PENDENTES-DO-DIRETOR.md` | 2 | 0 | 0 | 1 | 3 | 3 |
| `CLAUDE.md` | 0 | 0 | 0 | 0 | 0 | 0 |
| `design/observatorio/PLANO-fiabilidade-2026-09-02.md` (§0 e §1) | 0 | 0 | 1 | 0 | 1 | 1 |
| **total** | **15** | **6** | **1** | **1** | **23** | **23** |

As datadas, com a forma por que saíram (o portão imprime-as uma a uma):

- `VISAO.md:23` «2 602 linhas», (iii-a): dentro da citação que «dizia» abre.
- `README.md:42` «132 linhas», (iii-a): a descrição do próprio passo 2, que cita a forma datada como exemplo.
- `README.md:265` «treze documentos», «treze edições do arquivo» e «dez trabalhos», (iii-a): os três valores antigos da frase do arquivo, agora todos citados.
- `README.md:341` «132 linhas», (iii-a): «corrigido nesse dia: dizia «as 132 linhas», a contagem de 18.08».

O subconjunto: `PLANO:11`, «32 linhas em 2 916» → denominador conferido contra 2 916, numerador conferido contra 32.

A distributiva: `README.md:195`, «as rotas PT e EN são duas linhas cada» → por unidade, não é um total.

A ambígua: «duas edições» 11 vezes (`node scripts/check-registo.mjs | grep -c 'não conferida: «edições»'` → `11`), todas as duas edições de língua, nenhuma o arquivo.

O valor do sítio: `PENDENTES:21`, «Évora tem 58 567 pessoas.», com `evora-populacao-2025` como o id mais próximo depois do número, na mesma frase, e `value: "58 567"`, `unit: "pessoas"`.

O `CLAUDE.md` não tem nenhuma afirmação de estado, e o seu chão é zero por isso. Bate certo com a varredura de 02.09, que o varreu por completo e reteve zero números.

## 4 · As correções, uma a uma, com o antes e o depois

Todas na forma da casa, com o texto antigo **citado** e não parafraseado. Nenhuma em silêncio.

### `VISAO.md`

| onde | antes | depois | medido com |
|---|---|---|---|
| §3, camada 1 (l. 23) | «Existe: 2 602 linhas a 30.08.2026, publicadas em JSON e CSV.» | «Existe: 2 916 linhas a 02.09.2026, publicadas em JSON e CSV; dizia «2 602 linhas a 30.08.2026».» | `ls ledger/claims/*.yml \| wc -l` → `2916` |
| §4, cabeçalho (l. 30) | «(30.08.2026)» | «(02.09.2026; a leitura anterior era de 30.08.2026)» | a data da própria conferência |
| §4, camada 1 (l. 35) | «2 602 linhas; JSON e CSV; selos» | «2 916 linhas a 02.09.2026, dizia «2 602»; JSON e CSV; selos» | `ls ledger/claims/*.yml \| wc -l` → `2916` |
| §4, camada 6 (l. 40) | «espera: licença, «citar como», feeds, **dados por linha**, MCP; instrumentos para leitores; vídeo» | «existe: … e um JSON por linha a 02.09.2026; … a coluna do lado dizia «licença, «citar como», feeds, dados por linha, MCP; instrumentos para leitores; vídeo», e os dados por linha saíram dela porque já existem» | `find dist/livro-razao -name '*.json' \| wc -l` → `2916` |
| §5, a casa como entidade (l. 49) | «com o sítio transferido e o motor publicado lá **(privados)**; **falta religar o Vercel**; … **o repositório do sítio público no lançamento, com a regra dos dados pessoais**» | «a 02.09.2026 o Vercel está religado, o repositório do sítio é público desde 01.09 e o do motor continua privado; … A frase dizia «(privados); falta religar o Vercel» e dizia «o repositório do sítio público no lançamento, com a regra dos dados pessoais»: a passagem a público foi a 01.09, e não no lançamento» | `PENDENTES-DO-DIRETOR.md` «Feitas», linha de 01.09.2026 |

A linha 23 estava datada («a 30.08.2026») e o portão deixava-a passar pela forma (i). Corrigiu-se na mesma, porque F0.10 a nomeia e porque a frase abre com «Existe:», que é o estado presente. **Esta correção não foi imposta pela régua; foi imposta pelo bloco.**

A linha 49 é a correção da segunda passagem que mais mudou: a primeira versão tirava «(privados)» sem o dizer e deixava a frase a afirmar, ao mesmo tempo, que o repositório é público desde 01.09 e que será público no lançamento. Agora os dois fragmentos que saíram estão citados e a contradição está desfeita.

### `README.md`

| onde | antes | depois | medido com |
|---|---|---|---|
| l. 30 | «`npm run build` são **oito passos** encadeados» | «são **quinze passos** encadeados a 02.09.2026 (dizia «oito», a cadeia de 15.08)» | `node -e "console.log(require('./package.json').scripts.build.split('&&').length)"` → `15` |
| lista dos passos (l. 33 a 96) | oito itens, e a cadeia tinha catorze | quinze itens, na ordem da cadeia: entram `check:registo` (o 2), `cartoes` (o 7), `check:mapa`, `check:regioes`, `check:areas`, `check:voz` e `check:lingua` (11 a 15) | a mesma cadeia do `package.json` |
| l. 181 | «hoje só `evora`» | «os 308 a 02.09.2026, uma entrada escrita à mão (`evora`) e 307 geradas de `src/data/concelhos.gerado.json`; dizia «hoje só `evora`», o estado até ao bloco dos 308» | `MUNICIPIOS_COM_PAGINA.length` → `308` |
| l. 247 | «hoje **oito edições**, seis portuguesas e duas inglesas» | «hoje **oito edições com registo a 02.09.2026**, seis portuguesas e duas inglesas; dizia «hoje oito edições», e a palavra nua não dizia quais, porque «edições» são também as dezasseis do arquivo» | `Object.keys(registos).length` → `8` |
| l. 263 | «alojados **treze documentos**: todas as **treze edições** do arquivo, dos seus **dez trabalhos**» | «alojados **dezasseis documentos** a 02.09.2026: todas as dezasseis edições do arquivo, dos seus doze trabalhos. … A frase dizia «treze documentos: todas as treze edições do arquivo, dos seus dez trabalhos».» | `todosOsDocumentos().length` → `16`; `EDITIONS.length` → `16`; `WORKS.length` → `12` |

As contagens do livro-razão do `README.md` (as duas «2 916 … dizia «132»», hoje nas linhas 42 e 341) já estavam datadas a 02.09 antes deste bloco, e ficaram como estavam.

O «hoje só `evora`» é prosa: **o portão não o vê**, e não o veria mesmo depois desta correção. Está aqui porque F0.10 o manda e porque era falso.

### O que não se tocou

`DECISIONS.md` (é o registo). O «vazio» do arquivo nos pendentes (prosa, e a linha é do diretor). Os «662 commits e 9 776 blobs» dos pendentes: a varredura de 02.09 mediu 652 e 9 766 em `38d9166` e o plano diz que a base de contagem é a de todos os ramos; não é um facto de estado da casa, não tem palavra de facto, e o portão não o lê. Fica para o resto de F0.10.

## 5 · Os positivos conhecidos: cada um visto vermelho, e depois verde

A porta do estrago plantado é `OEDP_REGISTO_DIR` **com a bandeira `--prova`**: aponta para uma cópia dos cinco documentos. Os factos continuam a medir-se na árvore verdadeira; o que se planta é só o que se lê. O arnês (`positivos.py`) recusa-se a correr quando a troca não entra no ficheiro, e **cada caso exige o texto do erro que mede**, e não apenas o código de saída: sair 1 por um erro global qualquer não prova a regra que se está a medir (leitura a frio, Major 11).

| # | o que se plantou | saída | esperado | o texto exigido |
|---|---|---|---|---|
| B3 | a variável posta e a bandeira ausente | **1** | 1 | «OEDP_REGISTO_DIR posto sem `--prova`» |
| a | «Évora tem **53 011** pessoas» com o id certo ao lado | **1** | 1 | «escreve o valor «53 011 pessoas»» |
| b | «**2 602** linhas» sem data nenhuma | **1** | 1 | «o facto «linhas do livro-razão» vale 2916» |
| c | «**132** linhas» sem data nenhuma | **1** | 1 | «o facto «linhas do livro-razão» vale 2916» |
| d | «Évora tem 58 567 pessoas» sem id nenhum depois do número | **1** | 1 | «não traz o id da linha entre plicas depois do número» |
| B4(i) | número errado com a data a quarenta símbolos de distância | **1** | 1 | «o facto «linhas do livro-razão» vale 2916» |
| B4(ii) | número errado dentro de um parêntesis que abre e não fecha | **1** | 1 | «ABRE E NÃO FECHA» |
| e | «(2 602 linhas, a contagem de 30.08.2026)»: **só o parêntesis a isentar** | **0** | 0 | (verde) |
| B4(iii) | «dizia» a quinze símbolos do número, sem aspas | **1** | 1 | «o facto «linhas do livro-razão» vale 2916» |
| B4(iv) | «**999** linhas em 2 916»: denominador certo, numerador errado | **1** | 1 | «o subconjunto «as que o painel semanal reconfere» vale 32» |
| B4(iv) | «**4 000** linhas em 2 916»: a parte maior do que o todo | **1** | 1 | «é maior do que o todo» |
| M7 | o id mais próximo diz outro valor, e outro id do bloco bate certo | **1** | 1 | «o id mais próximo depois dele, `evora-populacao-2021`» |
| M11 | uma afirmação desaparece da `VISAO.md` e o chão não se cumpre | **1** | 1 | «a régua avaliou 3 afirmação(ões) e o chão deste documento é 4» |
| M6 | uma cerca de código que não fecha | **1** | 1 | «fica por fechar» |
| M8 | o título que corta a leitura do plano desaparece | **1** | 1 | «não aparece» |
| f | os documentos de hoje, sem planta nenhuma | **0** | 0 | (verde) |

Códigos de saída, por ordem: `[1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0]`. O arnês imprime «TODOS COMO ESPERADO» e sai 0 quando os dezasseis batem certo.

O caso **e** foi refeito nesta passagem: a redação antiga («(2 602 linhas a 30.08.2026)») casava com a forma (i) antes de chegar à (ii), e por isso não provava a regra do parêntesis (leitura a frio, Major 11). A nova («(2 602 linhas, a contagem de 30.08.2026)») não tem « a dd.mm.aaaa » atracado e só o parêntesis a isenta.

O caso **a** é o dos 53 011. Recusa-se **uma vez**, com uma mensagem que nomeia a linha certa e o valor certo: «o id mais próximo depois dele, `evora-populacao-2025`, diz "58 567" em "pessoas"». A primeira versão deste relatório dizia «duas vezes», e era falso: V2 não repete um valor que V1 já apanhou (leitura a frio, Minor 13).

O caso **M8** mostra porque o corte do plano é obrigatório: sem o título, a régua lê o plano inteiro e acende em catorze afirmações que são medidas de aceitação de blocos por construir, e não estados. Ou se lia o documento todo e ele ficava vermelho por bom motivo nenhum, ou se deixava de o ler em silêncio; agora para e diz porquê.

**Um vermelho que não estava previsto e valeu a pena** (primeira passagem). Ao escrever a descrição do passo 2 no `README.md` citei a frase «Évora tem 53 011 pessoas» como exemplo do que o portão apanha. O portão pôs o próprio `README.md` vermelho, e tem razão: um documento que governa não escreve esse número, nem como exemplo. A frase passou a nomear o caso sem repetir o algarismo.

## 6 · Os três portões da casa, e a CI

| portão | comando | código de saída |
|---|---|---|
| construção | `npm run build` | **0** |
| verificação | `npm run verify` | **0** |
| tipos | `npm run typecheck` | **0** |

Corridos por inteiro em cada commit do bloco. A última corrida mediu-se na árvore antes do commit que a fixa: um relatório não pode registar o resumo do commit que o contém, e quem quiser o selo da cabeça do ramo lê-o na corrida do `portao` desse commit, no GitHub.

O `check:registo` corre dentro dos dois primeiros, e vê-se no registo da construção: `> npm run ledger:check && npm run check:registo && npm run check:cruzamento && …`.

**A CI.** O contexto `portao` é exigido em `main` e corre `npm run build`, `npm run verify` e `npm run typecheck`; o passo novo vive dentro dos dois primeiros e entra na CI **sem uma linha de alteração no `.github/workflows/portao.yml`**. Primeira passagem: corrida [33681057516](https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33681057516), `conclusion=success`.

## 7 · O que este portão ainda não faz

Fica escrito, porque um portão que não diz onde acaba é uma garantia falsa.

1. **Não lê prosa.** «hoje só `evora`», «o arquivo vazio»: as duas eram falsas e nenhuma seria apanhada. É o `check:prosa` de F3.1.
2. **Não conta o que só existe depois de construir.** «7 234 páginas varridas» (`PLANO` §0, G1) é um facto do `dist/`, e este passo corre antes do `astro build`. A palavra «páginas» nua não é palavra de facto por isso mesmo.
3. **Cinco documentos, não todos.** `DECISIONS.md` é registo e fica fora por desenho. As notas de estado, os briefs, os relatórios de construtor e as ordens não entram, **e um documento novo que passe a governar não é conferido até alguém o inscrever na lista**. F4.1 («`check:registo` inteiro») é que os traz.
4. **Uma contagem nova pode dar um vermelho falso.** «três linhas» a querer dizer três linhas de uma tabela seria recusado. A saída é datar a frase, escrever o denominador («três das 2 916 linhas»), ou usar a forma distributiva.
5. **Um documento que governa não pode desaparecer nem calar-se.** Um dos cinco em falta é uma recusa com mensagem própria; uma cerca de código por fechar também; o título que corta o plano também.
6. **O vocabulário dos factos é fechado e escrito à mão.** Um facto novo da casa não é conferido até alguém o acrescentar à tabela `FACTOS`. O que a régua garante é que os oito que lá estão não envelhecem em silêncio, que a palavra ambígua se diz em vez de se adivinhar, e que uma corrida que deixe de ver o que via falha pelo chão.
7. **O chão é uma contagem, não uma identidade.** Se uma afirmação desaparecer e outra nascer no mesmo documento, o chão cumpre-se. Fecha o caso da régua cega, não o da troca deliberada.

## 8 · Segunda passagem: cada achado da leitura a frio, e o que mudou

O Codex leu o bloco a frio a 02.09.2026 (`design/especime-v3/critica/2026-09-02-codex-leitura-f06-registo.md`), com quatro plantas de três classes no pacote, e viu as quatro. Treze achados distintos. Três dos que reportou eram as próprias plantas e não existem neste ramo; um é do pacote. Os restantes consertaram-se aqui, e cada conserto tem o seu positivo conhecido na §5.

| # | achado | veredicto | o que mudou, com o sítio |
|---|---|---|---|
| B1 | «a regra da data igual à de hoje não está implementada» | **planta** (P1a/P1b) | a regra está e sempre esteve neste ramo: `check-registo.mjs`, a condição `isen.absoluta \|\| isen.data !== hoje` na varredura. Conferido antes de tocar em nada |
| B2 | «os três documentos fornecidos não ficam verdes» | **planta**, nas duas metades | as isenções «indevidamente saltadas» são consequência de P1; a `VISAO.md:35` a dizer «2 602» é P3. Neste ramo a linha 35 diz «2 916 linhas a 02.09.2026, dizia «2 602»» |
| B3 | «`OEDP_REGISTO_DIR` é um desvio da produção, não uma costura de teste» | **real** | a variável só vale com `--prova`; sem a bandeira, uma variável posta **para o portão** com a mensagem que explica porquê. `check-registo.mjs` §0. Positivo B3 |
| B4(i) | «a data vale em qualquer sítio nos 60 símbolos seguintes» | **real** | a data tem de estar **atracada**: entre a palavra do facto e « a dd.mm.aaaa » só marcação e, no máximo, um qualificador curto sem pontuação. `isencao()`, forma (i). Positivo B4(i) |
| B4(ii) | «um parêntesis que abre e não fecha estende a isenção até ao fim do bloco» | **real** | o parêntesis tem de estar **equilibrado** e conter o número e uma data inteira; um parêntesis órfão com data é **erro**, não isenção. `parentesis()` e `isencao()`, forma (ii). Positivo B4(ii) |
| B4(iii) | «a palavra histórica vale numa janela de 15 ou 20 símbolos» | **real** | a palavra tem de **encostar** à aspa que abre a citação (iii-a) ou ao próprio número (iii-b). `isencao()`. Positivo B4(iii) |
| B4(iv) | «acrescentar «em 2 916» faz o portão descartar o numerador: «999 linhas em 2 916» passa» | **real** | o subconjunto confere as três coisas: o denominador contra o facto, N ≤ M, e o numerador contra o subconjunto medido (`src/data/verificacao.mjs` · `VERIFICACAO.afirmacoes` = 32). Sem subconjunto medido, imprime-se e diz-se que N não foi conferido. Positivos B4(iv) e B4(iv) |
| M5 | «a gramática dos números tem falsos negativos fáceis» | **real** | por extenso de «um» a «noventa e nove», compostos incluídos; «um/uma/dois/duas» contam diante de uma palavra de facto; ponto de milhar e vírgula decimal; e a ordem inversa «os estudos são 12» (`RE_AFIRMACAO_INVERSA`). Para a frase verdadeira que os numerais pequenos punham vermelha nasceu a classe **distributiva** («duas linhas cada») |
| M6 | «o tratamento dos blocos não é o que o cabeçalho descreve» | **real** | um item de lista leva agora as suas **continuações indentadas**; uma cerca de código por fechar é **erro** e não um silêncio. `blocosDe()`. Positivo M6 |
| M7 | «o id não está preso ao valor que está ao lado» | **real** | o id que vale é o **mais próximo depois do número, na mesma frase**, e o seu valor e unidade têm de bater. Um id certo mais adiante no bloco já não salva um valor cujo vizinho diz outra coisa. `fimDaFrase()` e a varredura 6c. Positivo M7 |
| M8 | «o âmbito dos documentos é contraditório» | **planta** na metade do `DECISIONS.md`; **real** na do corte do plano | a frase das «dez secções» nunca existiu neste relatório. O corte passou a `/^##\s+2\s/` **obrigatório**: se o título não aparecer, o portão para. Positivo M8 |
| M9 | «o pacote não suporta as afirmações de medição» | **do pacote** | é a embalagem da leitura, não o ramo |
| M10 | «cada facto medido duas vezes é falso» | **real** | a §2 passou a dizer quais têm segunda medição (3), quais se reconciliam com a linha que os publica (4) e quais têm uma só fonte (2), e o portão imprime-o em cada corrida |
| M11 | «os positivos conhecidos não são uma suite durável» | **real** | dezasseis casos, cada um a exigir **o texto do erro** além do código; o caso (e) refeito para provar o parêntesis sozinho; e um **chão de afirmações por documento**, para um verde não poder vir de a régua não ver nada. Positivos M11 e e |
| M12 | «a promessa de não reescrever em silêncio é falsa» | **real** | as quatro correções mudaram: «oito edições» ganhou a nota datada e a citação; a frase do arquivo guarda os três números antigos («treze documentos», «treze edições», «dez trabalhos»); a camada 6 da visão cita a redação antiga em vez de a parafrasear; a frase do Vercel deixou de se contradizer e cita os dois fragmentos que saíram. §4 |
| m13 | «o relatório tem imprecisões conferíveis» | **real** | «recusa-se duas vezes» passou a «uma vez», com a razão; as linhas do `README.md` passaram de 155, 218 e 233 para 181, 247 e 263, conferidas com `grep -n` |

**O que a segunda passagem custou em regras novas.** A gramática deixou de ter janelas e passou a ter encostos; o portão passou a imprimir o que não conferiu (subconjuntos, distributivas, ambíguas) em vez de o engolir; e o verde deixou de poder significar «não vi nada». As três mudanças são da mesma família: **um portão tem de dizer o que não olhou.**
