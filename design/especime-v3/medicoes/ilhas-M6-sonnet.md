# M6 · As ilhas · medição cega (Claude Sonnet)

Corrido na cópia `scratchpad/wt-medidor` (um `git worktree` fora do checkout principal,
ao commit do bloco), contra o build congelado do próprio `dist/` dessa cópia, servido por
`python3 -m http.server 4801 --bind 127.0.0.1`, e contra os ficheiros da fonte alojados em
`~/Instruments/ResearchHub/content/12 Concelhos/source/` (só leitura). Código próprio, do
zero: `ilhas-M6-sonnet.mjs` (Node 22, `fetch` nativo, sem dependências de `node_modules`) e
dois extractores Python ao lado, `extrai_acores.py` e `extrai_madeira.py` (`pdftotext
-layout` por `subprocess`, sem `pdfplumber` nem outra biblioteca de PDF: o texto em bruto
chegou para as duas tabelas). Os três ficheiros estão em `design/especime-v3/medicoes/`, tal
como este relatório e o `ilhas-M6-sonnet.resultados.json` com os números completos.

Não li `src/`, `scripts/`, nem os briefs dos construtores. Li uma excepção, registada aqui
por inteiro: `design/especime-v3/medicoes/concelhos-M5-sonnet.md`, o relatório (não o
código, não o brief) de uma medição irmã anterior (M5, concelhos em geral), só para resolver
o termo "régua do inventário" da medida 6, que o meu próprio brief não define. Encontrei-o
por `grep -rl "autorrefer"` sobre a cópia inteira (excluindo `.git`), que devolveu dezenas de
ficheiros; abri só este, por ser um relatório de medição (não uma nota nem um brief de
construtor) e por trazer, ele próprio, uma descoberta de segurança relevante para esta
tarefa (ver §6). Não abri `BRIEF-concelhos-M5.md`, `direcao.md`, `ISSUES.md`, nenhum ficheiro
em `critica/` nem `concelhos-M5-sonnet.mjs`. Não corrigi nada, não fiz commit, não corri
`git checkout`, `git stash`, `git reset` nem nada que mudasse a árvore de trabalho: o `git
status` no fim desta tarefa mostra só os cinco ficheiros que eu próprio escrevi em
`design/especime-v3/`.

## 0 · O que cada detetor teve de provar antes de poder dizer "zero"

Cinco provas, todas correm no arranque do programa (`ilhas-M6-sonnet.mjs`), antes de
qualquer medição real:

1. **Extractor do Açores, caso sintético vermelho.** Tabela CONCELHOS sintética com
   `LAGOA` a `999` (devia ser `302`): o extractor lê `999`, e o meu próprio verificador
   interno (homens + mulheres == total) acusa a inconsistência. Corrigido para `302`: passa,
   e homens+mulheres bate.
2. **Extractor da Madeira, caso sintético vermelho, com a armadilha da freguesia
   homónima.** O QUADRO III do IEM lista concelhos *e* freguesias na mesma tabela, e a
   freguesia-sede de "Calheta" chama-se, ela própria, "Calheta" — igual ao concelho. Um
   bloco sintético com `CALHETA` (concelho) a `300` (devia ser `261`) e uma freguesia
   "CALHETA" a seguir (85, valor real e diferente): o extractor acusa o `300`, e confirma
   que apanhou só 1 linha "CALHETA" (a do concelho, com 12 campos incluindo a taxa de
   desemprego), não 2 (a freguesia tem só 11 campos, sem essa taxa). É essa contagem de
   campos, não a posição no texto, que desfaz a ambiguidade.
3. **Comparador de valores, caso conhecido em vivo (não só sintético).** Copiei, em
   memória, a linha de `corvo-desemprego-registado-2025-12.yml` e mudei `value: "5"` para
   `value: "999"`; comparei a cópia com a página construída real (`/municipios/corvo/`, que
   mostra 5). O comparador acusou a cópia alterada e aceitou o original. Repeti o mesmo
   exercício, exactamente como o brief pede ("altera um valor numa cópia de uma linha e vê o
   comparador acusá-lo"), com `lagoa-ilha-de-sao-miguel` (302 → 111): acusado (ver medida 1b).
4. **Detector de ausência, contradição sintética.** HTML sintético com
   `data-cobertura="sem-linha"` **e** um `claim-value` de `1234` ao mesmo tempo: apanhado
   como contraditório. O caso limpo (só "sem linha ainda", sem valor escondido) não dispara
   a contradição.
5. **Régua de autorreferência, caso sintético.** HTML sintético com um `href` de "fonte" a
   apontar para a própria rota da página (`/municipios/corvo` a citar `/municipios/corvo`
   como se fosse a sua fonte): apanhado. O `href` legítimo, para `/livro-razao/...`, não
   dispara.

Só depois destas cinco provas correu a medição real, abaixo.

## 1 · As três colunas: fonte, linha, página (medida 1)

Para os 30 concelhos das ilhas: o valor tal como sai do meu próprio `pdftotext -layout`
sobre o PDF original (**fonte**), o campo `value` de `ledger/claims/<slug>-desemprego-
registado-2025-12.yml` (**linha**), e o número mostrado na peça "Desemprego registado" da
página `/municipios/<slug>/` construída, lida por HTTP do servidor local (**página**). Uma
quarta coluna, **recibo**, não pedida pelo brief mas barata de conferir: o valor mostrado em
`/livro-razao/<id>/`.

| concelho (slug) | nome no PDF | fonte (PDF) | linha (ledger) | página (construída) | recibo | pág. | bate |
|---|---|---:|---:|---:|---:|---|---|
| vila-do-porto | VILA DO PORTO | 83 | 83 | 83 | 83 | p.1 | OK |
| lagoa-ilha-de-sao-miguel | LAGOA | 302 | 302 | 302 | 302 | p.1 | OK |
| nordeste | NORDESTE | 170 | 170 | 170 | 170 | p.1 | OK |
| ponta-delgada | PONTA DELGADA | 1 114 | 1 114 | 1 114 | 1 114 | p.1 | OK |
| povoacao | POVOAÇÃO | 275 | 275 | 275 | 275 | p.1 | OK |
| ribeira-grande | RIBEIRA GRANDE | 791 | 791 | 791 | 791 | p.1 | OK |
| vila-franca-do-campo | VILA FRANCA DO CAMPO | 222 | 222 | 222 | 222 | p.1 | OK |
| angra-do-heroismo | ANGRA DO HEROÍSMO | 387 | 387 | 387 | 387 | p.1 | OK |
| praia-da-vitoria | PRAIA DA VITÓRIA | 188 | 188 | 188 | 188 | p.1 | OK |
| santa-cruz-da-graciosa | SANTA CRUZ DA GRACIOSA | 89 | 89 | 89 | 89 | p.1 | OK |
| calheta-de-sao-jorge | CALHETA | 41 | 41 | 41 | 41 | p.1 | OK |
| velas | VELAS | 91 | 91 | 91 | 91 | p.1 | OK |
| lajes-do-pico | LAJES DO PICO | 101 | 101 | 101 | 101 | p.1 | OK |
| madalena | MADALENA | 73 | 73 | 73 | 73 | p.1 | OK |
| sao-roque-do-pico | SÃO ROQUE DO PICO | 74 | 74 | 74 | 74 | p.2 | OK |
| horta | HORTA | 100 | 100 | 100 | 100 | p.2 | OK |
| lajes-das-flores | LAJES DAS FLORES | 20 | 20 | 20 | 20 | p.2 | OK |
| santa-cruz-das-flores | SANTA CRUZ DAS FLORES | 20 | 20 | 20 | 20 | p.2 | OK |
| corvo | VILA DO CORVO | 5 | 5 | 5 | 5 | p.2 | OK |
| calheta | CALHETA | 261 | 261 | 261 | 261 | p.3 | OK |
| camara-de-lobos | CÂMARA DE LOBOS | 652 | 652 | 652 | 652 | p.3 | OK |
| funchal | FUNCHAL | 2 242 | 2 242 | 2 242 | 2 242 | p.3 | OK |
| machico | MACHICO | 583 | 583 | 583 | 583 | p.3 | OK |
| ponta-do-sol | PONTA DO SOL | 256 | 256 | 256 | 256 | p.3 | OK |
| porto-moniz | PORTO MONIZ | 57 | 57 | 57 | 57 | p.3 | OK |
| ribeira-brava | RIBEIRA BRAVA | 329 | 329 | 329 | 329 | p.3 | OK |
| santa-cruz | SANTA CRUZ | 893 | 893 | 893 | 893 | p.3 | OK |
| santana | SANTANA | 189 | 189 | 189 | 189 | p.3 | OK |
| sao-vicente | SÃO VICENTE | 106 | 106 | 106 | 106 | p.3 | OK |
| porto-santo | PORTO SANTO | 170 | 170 | 170 | 170 | p.3 | OK |

**30/30, zero discordâncias**, nas quatro colunas. A página `pagina` (`document.page` do
ledger) bate com a página onde o meu próprio extractor achou a linha, para os 30. O `excerpt`
do ledger bate, byte a byte depois de normalizar espaços, com a linha bruta que o meu
`pdftotext -layout` extraiu, para os 30 (ver §8, onde esta conferência começou por dar um
falso alarme do meu próprio código, não da fonte).

**Medida 1b, o caso conhecido pedido pelo brief** ("altera um valor numa cópia de uma linha
e vê o comparador acusá-lo"): copiei `lagoa-ilha-de-sao-miguel-desemprego-registado-2025-
12.yml` em memória, mudei `value: "302"` para `value: "111"`, e comparei com a página real
(que mostra 302). Resultado: `valor_pagina_real=302`, `valor_copia_alterada=111`,
`acusado=true`. O ficheiro no disco nunca foi tocado.

## 2 · As somas (medida 2)

| região | n | soma (código próprio, sobre o PDF) | total impresso no PDF | soma do `value` do ledger | bate PDF | bate ledger |
|---|---:|---:|---:|---:|---|---|
| Açores (19) | 19 | **4 146** | 4 146 (linha `TOTAL`, tabela CONCELHOS, p.2) | 4 146 | sim | sim |
| Madeira (11) | 11 | **5 738** | 5 738 (linha `TOTAL DA REGIÃO AUTÓNOMA DA MADEIRA`, QUADRO III, p.3) | 5 738 | sim | sim |

Os 19 concelhos açorianos somam exactamente o total impresso no próprio documento da DRQPE
(a tabela ILHAS, mais acima no mesmo PDF, tem a mesma soma, 4 146, por outra via: oito ilhas
mais o Corvo). Os 11 concelhos da Madeira somam exactamente a linha "TOTAL DA REGIÃO
AUTÓNOMA DA MADEIRA" do QUADRO III do IEM. Nenhuma das duas somas precisou de tolerância a
arredondamento (ao contrário do caso da dívida da DGAL, visto no relatório de M5): estas são
contagens de pessoas, publicadas já como inteiros, e os inteiros fecham ao dígito.

## 3 · A junção (medida 3)

**As duas Lagoas.** `lagoa-ilha-de-sao-miguel` (Açores): fonte DRQPE, valor 302. `lagoa-faro`
(Algarve): fonte IEFP, valor "1 270", **inalterado** pela página construída (a página mostra
1 270, igual ao ledger, diferente dos 302 dos Açores). As duas linhas têm fontes distintas
(DRQPE vs. IEFP) e valores distintos: nenhum sinal de que a linha do Algarve tenha sido
tocada por este bloco.

**As duas Calhetas.** `calheta-de-sao-jorge` (Açores, PDF imprime só "CALHETA"): fonte DRQPE,
valor 41. `calheta` (Madeira, PDF também imprime só "CALHETA", mas no QUADRO III do IEM):
fonte IEM, valor 261. Fontes distintas, valores distintos, slugs distintos: o sítio já
desambigua os dois "CALHETA" da fonte com sufixos de slug diferentes (`calheta-de-sao-jorge`
vs. `calheta`) que não vêm literalmente do texto do PDF açoriano (que nunca escreve "de São
Jorge").

**Praia da Vitória.** `praia-da-vitoria`: fonte DRQPE, valor 188, excerto `"PRAIA DA VITÓRIA
80 108 188 4,53%"`. Sem ambiguidade de nome (não há outra "Praia da Vitória" nos 308).

**Vila do Corvo = Corvo.** O PDF da DRQPE escreve sempre "VILA DO CORVO" (nunca "CORVO"), nas
duas tabelas (ILHAS: "CORVO"; CONCELHOS: "VILA DO CORVO") — na tabela CONCELHOS especificamente,
o nome impresso é "VILA DO CORVO". O `id` do ledger é `corvo-desemprego-registado-2025-12`
(nunca "vila-do-corvo"), e o `excerpt`/`locator` preservam "VILA DO CORVO" tal como a fonte o
escreveu. Confirmado: `id_e_so_corvo=true`, `excerto_diz_vila_do_corvo=true`,
`locator_diz_vila_do_corvo=true`.

**Os códigos DICO/dtmn, conferidos de forma independente.** Para cada uma das 30 linhas, li o
número "DICO NNNN" da nota interna do ledger (campo `note`, não publicado) e o cruzei contra o
`dtmn` da Carta Administrativa Oficial de Portugal 2025 (`dist/dados/caop-2025-municipios-
{acores,madeira}.csv`, lido por nome oficial de concelho, não pelo nome que o PDF usa — por
exemplo `dtmn=4501` para "Calheta de São Jorge", `dtmn=4901` para "Corvo"). **30/30 batem,
zero discordâncias.** Esta é uma conferência que não depende de nenhum número que eu próprio
tenha inferido do PDF: cruza duas fontes independentes da minha extração da tabela CONCELHOS
(a nota do ledger e a Carta).

## 4 · As ausências (medida 4)

Varrimento das **308** páginas `/municipios/<slug>/`, servidas por HTTP, contando peças
cheias vs. `peca-vazia` ("sem linha ainda") por medida:

| medida | vazio(s) | esperado (brief) | bate |
|---|---:|---|---|
| População residente (controlo, nunca deve faltar) | 0 | 0 | sim |
| Desemprego registado | **0** | nenhum | **sim** |
| Dívida total do município | 1 (penedono) | Penedono | sim |
| Índice de dívida | 1 (penedono) | Penedono | sim |
| Execução da receita | 308 (todos) | todos | sim |
| Prazo médio de pagamento | 9 | 9 | sim |

Os 9 concelhos sem PMP: **aljezur, aljustrel, almada, batalha, evora, moimenta-da-beira,
pedrogao-grande, penedono, trancoso.**

Nenhum dos 308 mostra "sem linha ainda" em Desemprego registado: a lacuna que existia antes
deste bloco (as 30 linhas das ilhas) está fechada nas 308. Nenhuma contradição encontrada
(nenhuma peça com `data-cobertura="sem-linha"` **e** um `claim-value` ao mesmo tempo, nas
308). Verificação estrutural extra: as 308 páginas têm todas exactamente 8 `<article
class="peca...">` (cheias mais vazias), a mesma forma para todas — nenhuma página ficou com
uma medida a faltar por inteiro (nem cheia nem vazia).

## 5 · A nota da definição não rende (medida 5)

Para os 19 concelhos açorianos: a peça "Desemprego registado" da página do concelho (o corpo
inteiro do `<article>`, não só o `claim-value`) e a página inteira do recibo
(`/livro-razao/<slug>-desemprego-registado-2025-12/`) foram varridas por seis marcadores que
só existem no campo interno `note` do ledger (nunca publicado, por desenho — ver o comentário
`"O campo \"note\" do formato não é publicado, e por isso não está aqui"` no próprio JSON do
livro-razão): `efiniç` (Definição/definição), `comparáv`, `harmonizad`, `critérios que
enuncia`, `medidas ativas`, `IEFP em todos`. **Zero ocorrências, nos 19×2 = 38 documentos
varridos.**

Ao mesmo tempo, confirmado por concelho (exemplo citado, Corvo, mas repetido para os 19):

- a página do concelho mostra o "selo" (`class="src-chip"`, rótulo "fonte") a apontar para
  `/livro-razao/corvo-desemprego-registado-2025-12`, sem nenhum texto sobre comparabilidade
  no corpo da peça;
- o recibo mostra, em campos estruturados e legíveis (`data-linha-campo="..."`), a fonte
  ("Direção Regional de Qualificação Profissional e Emprego (DRQPE)"), o documento ("Resumo -
  Desemprego registado nos Açores", "dezembro de 2025"), e o excerto verbatim ("VILA DO CORVO
  2 3 5 0,12%") — mas nunca o texto da nota que discute se o critério da DRQPE coincide com o
  do IEFP.

19/19 sem falhas.

## 6 · A régua do inventário (medida 6)

O meu brief diz só "autorreferência 0 nas rotas dos concelhos", sem explicar o que é a régua.
Encontrei o termo, por `grep`, num relatório de medição irmão anterior
(`concelhos-M5-sonnet.md`, M5, sobre os 308 concelhos em geral): lá, "a régua do inventário"
é `node scripts/medir-defeitos.mjs`, o único script que aquele brief autorizava a medidora a
correr.

**Porque não o corri.** Esse mesmo relatório de M5 regista um achado (§10, e depois uma nota
do lugar de direção que o corrige): na primeira corrida da medidora de M5, o script pareceu
mudar 12 ficheiros fora de `medicoes/` (`src/`, `tests/`, e o `INVENTARIO-FRASES.md`), e a
medidora reverteu com `git checkout` — a única excepção que o brief dela autorizava. Uma nota
posterior do lugar de direção, escrita directamente nesse relatório, corrige a leitura: os 12
ficheiros eram trabalho por commitar de um construtor a operar na mesma árvore ao mesmo
tempo, e foi o `git checkout` da medidora que os apagou; a régua em si "não escreve ficheiros
de código". Ou seja: mesmo a explicação mais recente não garante que a régua seja
inofensiva **numa árvore partilhada** — só que não foi ela a culpada daquela vez.

O meu brief para M6, ao contrário do de M5, **não** lista `scripts/medir-defeitos.mjs` como
excepção à proibição de ler `scripts/`, e **não** abre nenhuma excepção à proibição de correr
`git checkout`/`git stash`/`git reset` ou qualquer comando que mude a árvore. Duas restrições
sem válvula de escape, onde a de M5 tinha uma para cada. Não estendi a mim próprio uma
permissão que o meu brief não me deu: **não corri `scripts/medir-defeitos.mjs`**.

**O que fiz em vez disso.** Construí, do zero, um detector mais estreito para o mesmo alvo
("autorreferência nas rotas dos concelhos"), provado num caso sintético antes de correr
(§0.5): para cada uma das 308 páginas `/municipios/<slug>/`, extraí todos os `href` dentro de
cada `<article class="peca...">`, e contei quantos apontam para a própria rota da página
(`/municipios/<slug>`, sem barra final nem fragmento). Adicionalmente, para as 30 linhas das
ilhas, verifiquei se `source` ou `source_url` do ledger citam o próprio sítio
(`oestadodopais`/`xn--oestadodopas`) como se fosse uma fonte externa.

| verificação | páginas/linhas lidas | achados |
|---|---:|---:|
| `href` de uma peça a apontar para a própria página (308 rotas de concelho) | 308 | **0** |
| `source`/`source_url` das 30 linhas das ilhas a citar o próprio sítio | 30 | **0** |

**Zero autorreferências**, com o meu próprio detector, provado antes de correr. Não é a
mesma régua da M5 (que classifica "formas de linha" por figura, não só por `href` de peça), e
não posso, com o que li, confirmar que dá exactamente os mesmos números que ela daria — só
que, pela definição mais literal e directamente verificável do termo ("uma rota a citar-se a
si própria como fonte"), o resultado é zero nas 308 rotas de concelho e nas 30 linhas
medidas.

## 7 · Discordâncias com coordenada

**Zero**, nos dados publicados. As 30 linhas, as duas somas, os quatro casos de junção, os 30
códigos DICO, as 308 estruturas e as 38 páginas da medida 5 bateram todos.

Uma curiosidade da fonte, sem consequência no sítio: as propriedades internas do PDF da DRQPE
(`pdfinfo`) dizem `Title: Resumo Desemprego Registado na RAA - Dezembro 2020` — um metadado
de modelo do Word desactualizado (o conteúdo visível da página, e o `document.title` do
ledger, dizem correctamente "dezembro de 2025"). Não é uma discordância do ledger (que usa o
título tal como impresso na página, não o metadado invisível do ficheiro), só uma nota de que
a fonte tem um metadado errado que ninguém publica.

## 8 · Os meus falsos alarmes, com a causa

Um, no meu próprio código, corrigido antes do número final da medida 1:

1. **"O excerto do PDF não contém o excerto do ledger", em 12 das 30 linhas.** Causa: a
   minha primeira versão do comparador de excertos reconstruía uma substring `"NOME HOMENS
   MULHERES TOTAL"` e testava se a linha bruta do PDF a continha. Isso funciona no formato do
   Açores (onde TOTAL vem logo a seguir a MULHERES), mas não no do IEM (QUADRO III tem seis
   colunas entre MULHERES e TOTAL — grupo etário e tempo de inscrição), nem em qualquer linha
   açoriana com milhar (`PONTA DELGADA`, cujo TOTAL "1.114" no PDF não bate com o "1114"
   reconstruído sem separador). Corrigido: comparar directamente a linha bruta do PDF com o
   campo `excerpt` do ledger, os dois normalizados só no espaço em branco, sem reconstrução
   nenhuma. Com essa correcção: 30/30 batem, byte a byte.

Nenhum outro falso alarme a registar: ao contrário de M5 (cinco falsos alarmes, por causa das
oito medidas e do índice de dívida calculado), esta medição cobre uma medida só, publicada
directamente (nunca derivada), o que deixa muito menos margem para os enganos com U+202F ou
com `derivation`/`excerpt: null` que M5 documentou.

## 9 · Casos conhecidos vistos vermelhos

Cinco sintéticos (prova dos detectores antes de confiar num zero, §0) e três sobre dados
reais:

- Extractor do Açores, LAGOA=999 sintético (H+M≠TOTAL): detectado (sintético).
- Extractor da Madeira, CALHETA=300 sintético com freguesia homónima a seguir: detectado, sem
  confundir a freguesia com o concelho (sintético).
- Comparador de valores, corvo copiado com value="999": detectado contra a página real
  (5≠999) (semi-sintético: ficheiro sintético, página real).
- Comparador de valores, `lagoa-ilha-de-sao-miguel` copiado com value="111", o caso pedido
  literalmente pelo brief: detectado contra a página real (302≠111) (semi-sintético).
- Peça sintética com `sem-linha` e `claim-value` ao mesmo tempo: detectada como contraditória
  (sintético).
- Régua de autorreferência, `href` sintético a apontar para a própria rota: detectado;
  `href` legítimo não disparou (sintético).
- **Penedono, real**: 4 peças vazias (dívida, índice, execução da receita, PMP), nunca um
  número — inalterado por este bloco, como esperado.
- **Corvo, real, e o mais interessante desta tarefa**: o relatório de M5 (corrido antes deste
  bloco de ilhas) tinha visto Corvo com "Desemprego registado: sem linha ainda", vermelho —
  era exactamente a lacuna que este bloco (as 30 linhas das ilhas) veio fechar. Medido agora,
  a mesma peça mostra 5, com fonte, excerto e recibo todos a baterem: o caso que era vermelho
  em M5 está verde em M6, e é essa mudança de cor, não uma tautologia, que confirma que a
  actualização chegou à página construída.

## 10 · O custo em símbolos

Não tenho uma ferramenta que meça directamente "tokens gastos nesta tarefa". O que o
ambiente me mostra é um orçamento a descer: **15 000 000** disponíveis no início da sessão,
**14 720 726** pouco antes de escrever esta secção. Isso dá uma ordem de grandeza de
**~280 mil símbolos** para a tarefa inteira: ler o brief, explorar a estrutura do repositório
e dos PDF, escrever e provar os dois extractores Python, escrever e depurar o programa Node
(incluindo um falso alarme meu, corrigido), correr a medição três vezes (308 páginas + 30×3
de cada vez), e escrever este relatório. É uma leitura do orçamento visível, não uma contagem
fina por chamada.

## 11 · Ficheiros

- `design/especime-v3/medicoes/ilhas-M6-sonnet.mjs` — o programa principal (Node 22, `fetch`
  nativo, parser YAML próprio, sem dependências externas).
- `design/especime-v3/medicoes/extrai_acores.py` — extractor da tabela CONCELHOS do PDF da
  DRQPE, com autoteste próprio (`--selftest`, prova o caso sintético e, se o PDF for passado,
  os números reais).
- `design/especime-v3/medicoes/extrai_madeira.py` — extractor do QUADRO III do boletim do
  IEM, com o mesmo autoteste, incluindo a prova da desambiguação concelho/freguesia.
- `design/especime-v3/medicoes/ilhas-M6-sonnet.resultados.json` — todos os números desta
  medição, por inteiro (as 30 linhas com todos os campos, as somas, a junção, as 308
  estruturas, as provas).
- Nada foi tocado fora de `design/especime-v3/` e do scratchpad: `git status` no fim mostra
  só os quatro ficheiros acima mais este relatório, todos por adicionar (`??`), nada
  modificado.
