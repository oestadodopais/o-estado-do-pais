# O livro-razão

Um ficheiro YAML por afirmação, em `claims/`. **O nome do ficheiro é o id.**

Uma afirmação é um número que já foi publicado — pela casa ou por outrem — mais
tudo o que é preciso para o encontrar outra vez.

## Formato

```yaml
id: "pib-pc-portugal-2024"

# O valor tal como é publicado, com formatação portuguesa. String, nunca número.
value: "82"
unit: "índice (UE-27 = 100)"

# Proveniência. Em linhas derivadas fica a null: a proveniência é a das origens.
source: "[a verificar]"          # o organismo que publica
document:
  title: "[a verificar]"
  edition: "[a verificar]"
  locator: null                  # onde no documento — "p. 108", "Quadro 4, p. 108"
  page: null                     # inteiro ≥ 1 — a página onde está a frase do excerto (ver abaixo)
  kind: null                     # pdf | html | serie | ficheiro | registo — o que o endereço serve (ver abaixo)
source_url: "[a verificar]"
access_date: "[a verificar]"     # AAAA-MM-DD — quando foi lido
reference_date: "2024"           # AAAA / AAAA-MM / AAAA-MM-DD — a que se refere

# Excerto textual da fonte, palavra por palavra. Nunca uma paráfrase.
excerpt: "[a verificar]"

# null quando o valor é publicado; a aritmética explicada quando é calculado.
# Quando existe, tem de existir nas duas línguas — a página da linha publica-a.
derivation: null
derivation_en: null
derived_from: []
# Expressão verificada no build: tem de dar exactamente o valor acima.
check: null

# A quem o valor é creditado. Lista de entidades, ou campo nenhum.
attributed_to: null

study: "avaliacao-economica-regional-de-portugal-2026"
# Nota interna. NÃO é publicada: ver DECISIONS §1.24.
note: null

# Correcções datadas. Nunca apagar um valor: acrescentar aqui.
corrections: []
```

## Regras que o build impõe

`npm run ledger:check` falha — e nada é construído — se:

1. o nome do ficheiro não for o id, ou o id não for `minusculas-com-hifenes`;
2. houver um id repetido, ou uma chave que não pertence ao formato (apanha erros
   de escrita nas chaves);
3. faltar `value`, `unit`, `study` ou `corrections`;
4. `value` não tiver nenhum algarismo;
5. faltar qualquer campo de proveniência numa linha **não derivada** — com uma
   excepção, a *linha da casa* (ver abaixo);
6. `study` não constar de `src/data/studies.mjs`;
7. `derived_from` apontar para uma afirmação que não existe;
8. uma linha derivada não explicar a aritmética em `derivation`;
9. uma correcção não trouxer `date` (AAAA-MM-DD), `kind`, `old_value`,
   `new_value`, `reason` **e `reason_en`** — ou trouxer uma chave que não é
   nenhuma destas;
10. uma expressão `check` não der exactamente o valor publicado;
11. houver `derivation` sem `derivation_en`, ou o contrário;
12. o bloco `document` trouxer uma chave que não seja `title`, `edition`,
    `locator`, `page` ou `kind` — ou um `locator` que não seja uma cadeia não
    vazia;
13. `attributed_to` não for uma lista de nomes de entidades não vazios, for uma
    lista vazia, ou algum nome contiver o separador ` · ` com que a página
    escreve a lista;
14. `document.page` não for um inteiro ≥ 1; estiver numa linha derivada ou da
    casa; discordar do `#page=N` do endereço; faltar quando o endereço traz
    `#page=N` ou quando o localizador diz `p. N`; ou faltar no endereço, quando
    a linha declara a página e o endereço é um PDF.

## `document.kind` — o que o endereço serve

Opcional. Um de `pdf`, `html`, `serie`, `ficheiro`, `registo`; qualquer outro
valor falha o `ledger:check`. Diz ao leitor — e à página da linha — que tipo de
coisa está do outro lado do endereço, porque a forma do URL não o diz de
maneira fiável (um endereço com `/api/` pode servir um ficheiro, e serviu). A
página da linha rotula a proveniência conforme o tipo: uma `serie` (um pedido a
uma API que devolve um campo, não uma frase impressa) mostra «Série», «Pedido»
e «Campo devolvido» onde as outras mostram «Documento», «Endereço» e «Excerto».
Ausente, valem os rótulos genéricos. Acrescentado a 2026-08-15 (DECISIONS §1.36,
revisão cruzada F3) depois de uma heurística sobre o URL ter rotulado a listagem
do PRR como série.

## `document.locator` — onde no documento

Opcional. Onde, dentro do documento citado, está a frase que o `excerpt`
transcreve: `"p. 108"`, `"Quadro 4, p. 108"`, `"mapafluxoscaixa2010.pdf, p. 1"`.
Uma cadeia livre, escrita como quem manda outra pessoa lá — não há sintaxe a
cumprir, porque as fontes não a cumprem: umas têm páginas, outras têm quadros,
outras são um ficheiro dentro de um lote.

**Escrito para quem tem o endereço, e mais nada.** Um localizador que nomeie um
ficheiro do repositório de quem escreveu a linha, ou uma chave de uma estrutura
de dados — `raw/ine_data_populacao_evora.json → Dados["2025"]`,
`cm_lists, list='PCP-PEV'` — manda o leitor a uma coisa que ele não tem. Trinta
e cinco linhas faziam isso até 15.08.2026. O que se escreve é o que a fonte
publica: «INE, indicador 0012918, Évora (código 1C40705), dados de 2025».

**Quando o localizador diz uma página, essa página é também um campo**:
`document.page`, a seguir. Até 18.08.2026 o número era lido do localizador e de
mais lado nenhum, e o fragmento `#page=N` do endereço saía daí; hoje é o campo
que manda, e o localizador não pode dizer outra coisa. O localizador continua a
ser prosa — o quadro, o ficheiro dentro do lote — e a página é o número.

Existe porque o documento e a página não são a mesma prova. Uma linha que cite
um relatório de 400 páginas com `document.title` e mais nada manda o leitor
para o relatório; a mesma linha com `locator` manda-o para a frase. O campo
entrou com o material de Évora (DECISIONS §1.31), onde o registo de origem
guardava o ficheiro e a página e o formato deste sítio não tinha onde os pôr —
e o que não tem campo perde-se na travessia.

**`null` ou ausente é legítimo**, e é o caso normal: a maior parte das fontes é
uma página só e não há para onde apontar. `"[a verificar]"` não é o mesmo: é a
linha a declarar que o excerto está nalgum sítio daquele documento e que ainda
não se sabe onde — conta para a dívida de proveniência, como qualquer outro
campo declarado por confirmar. A página da linha publica-o sob «Onde no
documento», e o portão confere-o carácter a carácter.

## `document.page` — a página onde está a frase

Opcional. Um inteiro ≥ 1: **a página do documento onde está a frase que o
`excerpt` transcreve**. Existe desde 18.08.2026 (DECISIONS §1.47) e é a **única
origem da página**. O fragmento `#page=N` do `source_url` deriva dela; até aqui
derivava do localizador, e a página vivia como prosa dentro de um campo de prosa
e como fragmento dentro de um endereço, sem nenhum sítio onde uma conferência a
pudesse comparar.

O que o `ledger:check` impõe, e cada regra fecha um caminho por onde uma página
errada entrava:

- o endereço acaba em `#page=N` → a linha declara `document.page` e é N;
- a linha declara `document.page` e o endereço, sem fragmento, acaba em `.pdf`
  (sem distinguir maiúsculas) → o endereço traz `#page=<document.page>`;
- o `document.locator` diz `p. N` → N é o `document.page`;
- numa linha derivada ou da casa é recusado: não têm documento onde uma página
  exista.

A página da linha escreve «Abrir na página N» a partir deste campo, marcada
`data-linha-campo="document.page"`, e o portão compara-a com o campo. A frase de
atribuição continua a escrever «p. N» a partir do endereço
(`data-linha-campo="source_url.page"`, que é a leitura do `#page=` feita pelo
portão com a sua própria cópia da regra): as duas batem por construção, porque o
validador as obriga a bater, e renderizar as duas é o que torna essa obrigação
visível na página em vez de ficar só no validador.

**Do lado do motor**, o manifesto declara `page` por linha e o exportador
compõe o fragmento a partir dele. Um `page` declarado é provado como o
localizador é (V7): os seus algarismos existem no texto da linha do motor, ou no
ficheiro que o manifesto nomeia em `locator_from`. Um localizador com `p. N` sem
`page` declarado é recusado. Uma página é lida, nunca recordada — e nunca de
duas maneiras.

## `attributed_to` — a quem o valor é creditado

Opcional. Uma **lista** de entidades: `["Município de Évora"]`,
`["Município de Évora", "PS"]`. Nunca uma cadeia solta — o validador recusa-a,
porque a página escreve a lista numa linha só e uma forma única é o que torna a
comparação do portão possível.

A maior parte das afirmações não credita ninguém: uma taxa de desemprego é uma
medição de um organismo de estatística, não é «de» alguém. O campo existe para
as afirmações em que o crédito **faz parte do facto** — uma promessa de um
executivo, uma verba pedida por uma entidade, um compromisso assumido num
programa. Vem do registo de origem, onde a atribuição já era um campo com
verificação própria.

**Um rótulo partidário aqui é registo do que consta, não juízo nem ordenação.**
É a mesma regra que a direção fixou para a camada de mandatos: *sem viés não é
o mesmo que sem atribuição*. Este sítio não faz tabelas classificativas por
partido: territórios que não têm nada em comum não se ordenam, e a regra está
escrita no Método. **Nenhuma linha credita hoje um partido** (DECISIONS §1.31,
«Nenhum rótulo partidário atravessou»), e o formato não tem campo que marque um
elemento da lista como partido. Até 18.08.2026 a página da linha escrevia a
frase ao lado do campo em todas as linhas com atribuição, inclusive nas que só
creditam um organismo: dizia-o de uma coisa que não estava lá. A nota da página
passa a dizer só «Como consta do documento.», e a frase do partido volta quando
o formato souber marcá-lo (DECISIONS §1.44).

**Como é escrito na página:** os elementos da lista, pela ordem em que estão no
livro-razão, separados por ` · `. A escolha é de rendição e é deliberadamente
uma só: o portão compara o texto renderizado carácter a carácter, e uma lista
só pode ser comparada assim se houver uma maneira única de a escrever. O ponto
médio já é o separador da casa entre partes de uma mesma linha, não introduz
pontuação nova, e não colide com vírgulas dentro do nome de uma entidade. Um
nome que contenha `·` é recusado pelo validador, pela mesma razão.

## A linha da casa

Algumas linhas contam o próprio registo: quantas correções foram publicadas,
quantos estudos estão no arquivo, quantos municípios têm estudo aprofundado.
`source` é **O Estado do País**, porque a casa é mesmo a fonte, e nenhum
documento externo publica estes números — não há URL para citar nem frase para
transcrever.

Nessas linhas, `source_url`, `excerpt` e `document` ficam a **null**. Não é um
buraco: é a mesma regra que já valia para as linhas derivadas — `null` significa
que a proveniência está noutro lado, e aqui esse outro lado é o próprio
livro-razão. Antes de 2026-08-13 estes campos traziam «a verificar», que era
falso em dois sentidos: prometia uma confirmação que nunca poderia acontecer, e
punha cinco páginas fora do índice por uma incompletude inexistente.

**Não é um segundo marcador.** `[a verificar]` continua a ser o único marcador de
incerteza do sítio, como o Método promete.

A porta é estreita de propósito. `null` só é aceite numa linha que traga o nome
da casa em `source` **e** uma `derivation` que explique a contagem. Sem as duas,
o build falha — de outro modo isto seria uma maneira de branquear proveniência em
falta, que é exactamente o que o marcador existe para impedir.

## Cada linha tem uma página

Uma linha do livro-razão é publicada em `/livro-razao/<id>` e `/en/ledger/<id>`,
nas duas edições, da mesma construção. É para lá que aponta o selo de
proveniência junto a cada número — o Método promete que o selo é a porta, e a
porta é esta.

Daí uma consequência a ter presente ao escrever uma linha: **os campos são
publicados como estão**. O portão de HTML confere cada campo renderizado contra
o campo da linha, carácter a carácter, e não deixa passar nem uma paráfrase nem
um espaço a mais. Escrever no `excerpt` uma frase «parecida» com a da fonte não
passa a ser verdade por ficar bonita na página.

**`note` não é publicada.** É a única parte do formato que fica para dentro:
mistura detalhe de proveniência com recado para quem trabalha na linha
(«preencher antes de qualquer republicação»), e existe numa só língua. Ver
DECISIONS §1.24.

## `[a verificar]`

Um campo que não se conhece escreve-se `"[a verificar]"`. **Nunca um valor
plausível.** É aceite pelo validador e contado no fim de cada verificação, para
que a dívida de proveniência esteja sempre à vista em vez de desaparecer.

É o **único** marcador de incerteza do sítio (IDENTIDADE.md §6), e aparece com a
mesma cara em todo o lado: no campo da página da linha, e dentro do selo de
proveniência quando falta alguma coisa.

Uma linha com um campo por confirmar aparece com o selo a tracejado, diz na sua
página que campos lhe faltam, leva `noindex` e fica fora do sitemap — não porque
o valor seja duvidoso, mas porque a prova documental ainda não está lá. Volta ao
índice no dia em que o campo for preenchido, sem mais ninguém decidir nada.

## Valores derivados

Quando um número é aritmética sobre outros, não deixa de ser uma afirmação —
passa a ser uma afirmação com pais:

```yaml
id: "distancia-portugal-ue27-2024"
value: "18"
unit: "pontos de índice"
source: null            # a proveniência é a das origens
document: null
source_url: null
access_date: null
excerpt: null
derivation: "100 − 82 = 18. A média da UE-27 está fixada em 100; a distância é a diferença, em pontos de índice."
derivation_en: "100 − 82 = 18. The EU-27 average is fixed at 100; the distance is the difference, in index points."
derived_from:
  - "pib-pc-portugal-2024"
check: "100 - pib-pc-portugal-2024"
study: "avaliacao-economica-regional-de-portugal-2026"
```

`check` é reavaliado a cada build. Se alguém corrigir o valor de origem e se
esquecer do derivado, o build pára. É a re-derivação cega, feita por máquina.

**`derivation_en` é obrigatório sempre que houver `derivation`**, e pela mesma
razão que `reason_en` (§1.17): a aritmética é prosa da casa, a página da linha
publica-a nas duas edições, e não há recurso à outra língua — uma edição
inglesa a mostrar a conta em português falha o portão.

**Sintaxe de `check`:** números, ids de afirmações, `+ - * /`, parênteses,
`round ( x , n )`, e as contagens `estudos_no_arquivo` e `edicoes_no_arquivo`
(tiradas de `src/data/studies.mjs`). Os operadores, os parênteses e a vírgula do
`round` **têm de estar separados por espaços** — os ids levam hífenes, e sem essa
regra `a - b` seria ambíguo.

### `round ( x , n )` — o arredondamento diz-se, não se presume

`x` é uma expressão qualquer e `n` é um número inteiro de casas decimais.
Arredonda **meio para longe do zero**, simétrico: `round ( 0.5 , 0 )` dá `1` e
`round ( -0.5 , 0 )` dá `−1`. O `Math.round()` do JavaScript sozinho trata os
dois de maneiras diferentes, e um livro-razão não pode ter uma regra que muda
com o sinal.

```yaml
value: "105,5"
derived_from: ["evora-divida-dgal-2024", "evora-limite-divida-dgal-2024", "indice-de-divida-limite-legal"]
check: "round ( evora-divida-dgal-2024 / evora-limite-divida-dgal-2024 * indice-de-divida-limite-legal , 1 )"
```

Existe desde 2026-08-13 e **não estava escrito aqui** — foi documentado a
2026-08-15, quando as linhas de Évora passaram a depender dele. Existe porque
sem ele uma linha derivada publicada com menos casas do que a divisão produz não
podia ser verificada de todo: 54 681 562 ÷ 77 764 656 × 150 = 105,4750…, e o
valor publicado é 105,5. A alternativa seria uma tolerância na comparação, que é
pior — esconderia precisamente a classe de erro que o `check` existe para
apanhar. **Escreve-se o arredondamento na expressão, e a comparação continua a
ser por igualdade exacta.**

Uma consequência que vale a pena dizer: `round` é para **exprimir** o que a
linha publica, não para a fazer passar. Se a conta não bate, acrescentar casas
ao `round` até bater é falsificar a verificação. O caminho é descobrir porque não
bate.

## Linhas cruzadas — as que vieram do motor de investigação

Algumas linhas não foram escritas aqui. Foram **produzidas no motor de
investigação** ([ResearchHub](../../ResearchHub)) — onde vive o acesso às fontes,
a aquisição, a verificação e a produção dos estudos — e atravessaram para cá.
Hoje são as 70 linhas de Évora. Reconhecem-se pelo cabeçalho do ficheiro, que diz
que foi gerado e por quem.

**O que atravessa é conteúdo estruturado: linhas, recursos e um manifesto. Nunca
saída renderizada.** Uma página construída lá e servida aqui seria este sítio a
garantir uma coisa que nunca conferiu. Ver `DECISIONS.md` §1.31 e §1.32.

**Este sítio mantém os seus portões, e isso não é duplicação.** Um produtor mais
uma conferência de aceitação independente é como se recebe trabalho de outrem.
Uma linha cruzada passa por tudo o que uma linha escrita à mão passa —
`ledger:check`, `astro build`, `gate:html` — e ainda por mais uma coisa.

### `cruzamentos/` — o registo da travessia

Um ficheiro JSON por origem (hoje `cruzamentos/evora.json`), escrito pelo
exportador e nunca à mão. Por cada linha:

| Campo | O que é |
| --- | --- |
| `rh_study` · `rh_id` | de que estudo e de que linha do motor veio |
| `rh_ledger_sha256` | o resumo do `ledger.json` de origem, como registo |
| `origin_row_sha256` | o resumo da **linha** de origem, em forma canónica — é este que prende |
| `exported_row_sha256` | o resumo dos bytes deste ficheiro, tal como foram escritos |
| `corrections_at_export` | quantas correcções a linha tinha quando atravessou |
| `exported_at` | quando estes bytes mudaram pela última vez |
| `site_corrections` | as correcções feitas deste lado e aceites, com o resumo antes e depois |

`scripts/check-cruzamento.mjs` corre em cada build, **sem rede e sem o motor
presente** — o construtor é remoto e o motor não existe lá — e exige três coisas:
o ficheiro da linha existe, o resumo dos seus bytes é ainda o do registo, e o
`study` é um trabalho do arquivo. A conferência contra a origem viva é o modo
`--with-origin`, que só corre onde o motor está em disco.

#### Ficheiros inteiros, e não linhas (16.08.2026)

Nem tudo o que atravessa é uma linha. A agenda e o calendário das fontes
atravessam **inteiros**, e o seu registo é `cruzamentos/agenda.json`, escrito por
`ResearchHub/publisher/export_agenda.py`. Em vez de um mapa `rows` traz um mapa
`files`, uma entrada por ficheiro:

| Campo | O que é |
| --- | --- |
| `origin_path` | o ficheiro do motor de onde veio |
| `origin_sha256` | o resumo desse ficheiro, do lado do motor |
| `exported_sha256` | o resumo dos bytes escritos aqui, em `src/data/` |
| `exporter` | quem os escreveu |

O registo traz ainda `counts`, e essas contagens **não são a fonte de nada**:
estão lá para serem comparadas com o que a página conta, e é o `gate:html` que as
compara. O `check-cruzamento.mjs` lê o tipo de registo **da sua forma** e não do
nome do ficheiro, e sobre os ficheiros faz o mesmo que faz sobre as linhas: os
bytes em disco contra o resumo declarado, e com `--with-origin` contra o ficheiro
do motor. Confere ainda, deste lado, as invariantes que a página precisa para
renderizar: o estado é o fim do histórico, todo o item tem histórico, quem sai
traz motivo, as duas edições existem, as linhas e os acontecimentos citados
existem. Ver `DECISIONS.md` §1.40.

### Corrigir uma linha cruzada

Uma linha cruzada **não se edita à mão**: o resumo prende os bytes, e uma edição
pára o build. Há dois caminhos, e nenhum é silencioso:

1. **Voltar a cruzar** — o valor mudou no motor. Corrige-se lá, corre-se o
   exportador, o registo actualiza-se sozinho.
2. **Corrigir deste lado** — é este sítio que admite um erro. Escreve-se a
   entrada em `corrections[]` como em qualquer outra linha, e depois corre-se:

   ```bash
   node scripts/check-cruzamento.mjs --accept-correction <id>
   ```

   A porta é estreita de propósito: exige que a lista de correcções tenha
   **crescido** e que o `value` publicado seja o `new_value` da correcção mais
   recente. Sem as duas, recusa — de outro modo seria uma maneira de fazer passar
   qualquer edição por correcção. O registo guarda o resumo antigo e o novo, e
   nada é apagado.

**Uma correcção continua sempre possível.** O que deixa de ser possível é uma
alteração sem rasto.

**E uma reexportação não apaga uma correcção deste lado.** Até 15.08.2026
apagava: o exportador escrevia `corrections: []` em todas as corridas, e o
registo da travessia era reescrito a dizer que a linha tinha zero correcções, de
modo que esta conferência não dava por nada. Hoje o exportador **lê o que este
sítio publica e carrega-o verbatim**; o manifesto do motor pode acrescentar uma
entrada, nunca remover uma. Ver `ResearchHub/publisher/README.md` e
`DECISIONS.md` §1.36.

## Correcções

Um valor errado não se apaga. Corrige-se o `value` e acrescenta-se a linha:

```yaml
value: "27,1%"
corrections:
  - date: "2026-09-01"
    kind: "correcao"
    old_value: "26,5%"
    new_value: "27,1%"
    reason: "O RASARP 2025 foi revisto; a versão de Setembro corrige o valor nacional."
    reason_en: "The 2025 RASARP was revised; the September version corrects the national value."
```

### `reason` e `reason_en`: o motivo nas duas línguas

O motivo é a única parte do registo que é prosa da casa, e o sítio publica-se
em duas línguas. **Os dois campos são obrigatórios.** Não há tradução
automática nem recurso à outra língua: a edição inglesa mostra `reason_en`, e o
portão de HTML confere, em cada edição, o motivo daquela língua. Uma página
inglesa a mostrar o motivo português falha o build.

Tudo o resto de uma entrada — data, natureza, valor antigo, valor novo — é
igual nas duas edições, porque não é prosa: é o registo.

### `kind`: as três naturezas

Campo obrigatório. Três valores, e a diferença não é cosmética:

| `kind` | o que aconteceu | onde aparece |
| --- | --- | --- |
| `correcao` | o valor publicado estava **errado** | grupo «Correções», com peso, e conta para «N correções publicadas» |
| `atualizacao` | o valor estava **certo** e deixou de estar, porque o que mede mudou | grupo «Atualizações», em surdina, e não conta |
| `proveniencia` | **o valor não mudou**; mudou a maneira de lá chegar | na história da própria linha, por extenso; no registo do Método, só como caminho para a linha |

#### `proveniencia` — a revisão do caminho, não do número

Uma fonte que muda de endereço não altera o que foi publicado. Até 15.08.2026 o
formato não tinha como o dizer, e a única saída era escrever uma `atualizacao`
com `old_value` igual a `new_value` — uma entrada que declara «o valor mudou de
X para X», que é falso e diz ao leitor exactamente o contrário do que aconteceu.

Uma entrada `proveniencia` traz **um campo a mais, `field`**, e é o único sítio
do formato onde ele existe:

```yaml
corrections:
  - date: "2026-08-15"
    kind: "proveniencia"
    field: "source_url"
    old_value: "https://geo2.dgterritorio.gov.pt/caop/"
    new_value: "https://geo2.dgterritorio.gov.pt/caop/CAOP_Continente_2025-gpkg.zip"
    reason: "O endereço antigo é a pasta onde os ficheiros estão alojados e devolve HTTP 403 …"
    reason_en: "The old address is the directory the files sit in and returns HTTP 403 …"
```

`old_value` e `new_value` são os valores **desse campo** — os dois endereços —
e não os do número publicado. `field` só pode ser um campo de proveniência:
`source`, `source_url`, `document.title`, `document.edition`,
`document.locator`, `access_date` ou `excerpt`.

**Onde aparece, e porque não aparece no registo geral.** Na história da linha,
por extenso, como qualquer outra entrada. No registo do Método, **não**: são
muitas de cada vez — nove no dia em que duas fontes mudaram de sítio — e postas
a par das confissões afogavam-nas. O registo mostra as linhas que as trazem,
cada uma com o caminho para a sua história. É a mesma regra em cascata que já
vale para as recontagens derivadas, um nível acima.

#### O que **não** se regista: as afinações do ponteiro

Nem toda a alteração a um campo de proveniência é um acontecimento. Uma
alteração que deixa **o documento, o valor, a data de acesso e a base do
endereço** exactamente onde estavam não muda a resposta a «onde está isto» —
afina-a. São estas, e a lista é fechada:

- acrescentar `#page=N` a um endereço de PDF, quando a página já estava no
  localizador;
- reescrever um `document.locator` para dizer, por outras palavras, o mesmo
  sítio (de `raw/…json → Dados["2025"]` para «INE, indicador 0012918, Évora
  (código 1C40705), dados de 2025»);
- aparar um `excerpt` no fim de uma frase completa, quando o que sai é texto que
  o extractor tinha cortado a meio de uma palavra.

**Estas ficam registadas no git e no `DECISIONS.md`, e não na história da
linha** — e isto é uma regra escrita, não uma omissão. A razão: a história de
uma linha é para quem quer saber se o que leu mudou. Encher-lhe 58 entradas
porque um localizador ficou mais claro é enterrar as três correções a sério que
lá estão. O critério é esse, e não a dimensão da alteração: se a resposta a
«onde está isto» passa a apontar para outro sítio, é `proveniencia`; se aponta
para o mesmo sítio por palavras melhores, é git.

Misturar as duas faz do registo um diário de alterações, e uma confissão
diluída vale menos. **Na dúvida, pergunte: o valor antigo estava errado quando
foi publicado?** Se sim, é `correcao`. Se não, é `atualizacao`.

**Uma actualização regista-se quando muda o valor de uma afirmação por razões
que não são erro.** As recontagens derivadas que se seguem — as contagens do
arquivo que mudam por arrastamento — não se registam em separado: já são
reavaliadas pelo build a cada corrida, e enchê-las no registo abafaria as
correções, que é o que o registo existe para mostrar.

O registo de correções vive em dois sítios, lido do livro-razão e nunca escrito
à mão: em `/metodo`, todas as entradas agrupadas por natureza; e na página de
cada linha, a história daquela linha.

## O que NÃO é uma afirmação

- **A escala de um instrumento.** Os números do eixo, ou o `100` que define a
  média da UE-27, são a régua — não a medição. Vão em markup, marcados
  `data-nonledger="escala-de-instrumento"`.
- **Uma data de cabeçalho.** A data da edição é editorial.
- **Um título de estudo.** «Orçamentado, Pago, Devido 2025» é uma citação.
- **As coordenadas da CAOP.** São geometria. A proveniência delas é a citação
  transcrita em `src/data/verbatim.mjs`, que o portão confere carácter a
  carácter.

Cada uma destas excepções tem de justificar-se em `allowlist.yml`. Se a lista
começar a crescer, quase de certeza está lá alguma coisa que devia ser uma
afirmação.
