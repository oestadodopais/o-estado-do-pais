# Nota · as páginas dos 308 concelhos · 26.08.2026

*Construtor do sítio (Claude Opus 5, `claude-opus-5[1m]`). Ramo `concelhos-2026-08-26`, a partir de `main` em `992a3c9`. Contrato: `../briefs/BRIEF-concelhos-P2-estrutura.md`, com o `PLANO-CONCELHOS-2026-08-26.md` e as Emendas 14, 15, 18 e 19 de `direcao.md` por trás. Sem travessões nesta prosa; o ponto médio é o separador. **Todos os números desta nota vêm de um comando que está escrito ao lado deles.***

---

## P2 · a estrutura

### 0 · Os comandos que dão os números

O sítio constrói-se em duas coberturas, e as duas são medidas: **a do repositório**, com o concelho que tem entrada escrita à mão, e **a dos 308**, com o ficheiro de teste que vive fora do repositório.

```
node tests/municipio/gerar-teste-308.mjs <ficheiro>     308 concelhos, 0 slugs repetidos, 8 medidas a null
npm run build                                            cobertura 1
CONCELHOS_GERADO=<ficheiro> npm run build                cobertura 308
npm run verify · npm run typecheck
node tests/municipio/concelhos.mjs
node tests/municipio/correcoes-c.mjs
node tests/inicio/matriz.mjs
node tests/inicio/mapa-navegacao.mjs
node tests/inicio/correcoes-a.mjs
node tests/linha/recibo.mjs · node tests/linha/correcoes-b.mjs
node tests/texto/correcoes-b.mjs · node tests/texto/correcoes-c.mjs · node tests/texto/leitura.mjs
node scripts/medir-defeitos.mjs
node scripts/check-cruzamento.mjs
```

### 1 · A escala, medida

As duas construções correram do zero (`rm -rf dist`), na mesma máquina, uma a seguir à outra.

| | cobertura 1 | cobertura 308 |
|---|---|---|
| `npm run build`, do zero | **14,55 s** | **22,92 s** |
| páginas construídas | 344 | **958** |
| `dist/` | 29 MB | **83 MB** |
| ficheiros em `dist/` | 1 630 | 2 244 |
| chaves da prova reconferidas pelo portão | 44 | 44 |
| ligações internas conferidas | 15 154 | **225 756** |
| âncoras, dessas | 4 657 | 7 727 |
| números marcados nas páginas | 780 | 2 008 |
| cartões de partilha | 548 | 548 |
| `dist/municipios` + `dist/en/municipalities` | 0,5 MB | **55 MB** |
| `dist/cartoes` | 12 MB | 12 MB |

As 616 páginas de concelho custam **8,4 s** e **54 MB**. O que cresce não é a prosa da página: é o cartão localizador, que rende os 308 pontos do mapa em cada uma delas, e com os pontos com página a serem ligações passa a haver uma âncora por ponto. Daí as 225 756 ligações internas, que o portão percorre uma a uma. Os cartões de partilha não mexem (274 × 2 medidas): uma página de concelho sem valores não gera cartão.

**O que isto diz sobre o passo seguinte.** As ≈2 433 linhas do motor acrescentam ≈4 870 páginas de linha às 958. Uma página de linha é pequena: as 272 de hoje ocupam 5,5 MB nas duas edições, o que dá **≈11 kB cada** e uma estimativa de **≈54 MB** para as novas, mais o que as 308 páginas de concelho ganham ao passar a citar linhas. O total fica na ordem dos **150 MB** e das **5 800 páginas**, e o passo a vigiar é o `gate:html`, que percorre as ligações: com os 308 pontos a serem âncoras em cada página de concelho, as ligações internas passam de 15 mil para 226 mil sem uma linha de dados, e é essa conta, e não os bytes, que decide o tempo. Nada aqui chega perto do que a Vercel dá, e a medição com dados vem no P2 (dados).

### 2 · Item a item

**E1 · a vista rende só o que existe.** `MunicipioView.astro` deixa de ler `m.leitura`, `m.contas`, `m.tempo`, `m.metodo`, `m.naoSabe` e `m.estudos` sem os proteger: cada secção rende-se se tiver corpo, e nenhuma delas rende título nem caixa vazia. A distância desenhada só com as duas linhas (dívida e limite); a frase do índice só com o índice e o teto legal; a região só onde ela existe, porque a Carta dá o distrito ou a ilha e não a NUTS III. As oito peças rendem **sempre as oito e pela ordem da Emenda 14**: `pecasDoConcelho()` devolvia só as cheias e a vista punha as vazias no fim, o que fazia a ordem depender da cobertura; passa a devolver as oito, cada uma a dizer se tem linha.

**A disposição B não desenha uma coluna vazia.** Num concelho sem corpo, a grelha «corpo e aparelho» ficava com 68ch de nada ao lado do cartão de 300px. A vista deixa de render a coluna do corpo e a grelha passa a uma pista de 340px: o cartão localizador e as saídas seguem as oito peças. É uma célula vazia numa grelha, que a `IDENTIDADE.md` §7 recusa.

**E2 · as 308 entradas geradas.** Os rótulos, as unidades, os prefixos de período e as notas das oito medidas passam a estar escritos **uma vez**, em `src/data/concelhos.mjs`, e valem para os 308 e para Évora: a entrada de Évora compõe o seu relance com a mesma declaração, dando só os ids das suas linhas e a data de referência do desemprego, que a linha dela mede em dezembro de 2024 e o ficheiro do motor mede em dezembro de 2025. `MUNICIPIOS_COM_PAGINA` passa a ser `[Évora, ...entradasGeradas()]`. O ficheiro do motor lê-se do disco e a sua ausência é um estado normal: sem ele a lista tem uma entrada, e **o repositório não leva um ficheiro gerado sem dados**.

`slugsDaCarta()` passa a ser exportada de `src/lib/inicio.mjs`, porque o motor reproduz a função e a régua tem de comparar os 308 slugs do ficheiro contra os que ela dá. `eIlha()` desce para `src/data/caop-centroids.mjs`, e `inicio.mjs` reexporta-a: a entrada de um concelho gerado precisa da regra para escrever a etiqueta, e `data/concelhos.mjs` não pode importar de `lib/inicio.mjs`, que importa `data/municipios.mjs`, que importa `data/concelhos.mjs`.

**O ficheiro de teste** escreve-se com `tests/municipio/gerar-teste-308.mjs`, que recusa escrever dentro de `src/data/`. Tem os 308 da Carta com o slug, o nome, o distrito ou ilha, o `caopIndex`, e **todas as `linhas` a `null`**; o `dico` fica a `null`, porque o código do INE é um facto que este repositório não guarda e escrevê-lo aqui seria inventá-lo. Medido: 308 entradas, 0 slugs repetidos, as duas Lagoas desambiguadas em `lagoa-faro` e `lagoa-ilha-de-sao-miguel`.

**E3 · o índice e o mapa.** A secção «Com página» sai de `/municipios`: existia porque um concelho em 308 tinha página e chegar a ele era varrer a lista; com os 308, era a lista inteira repetida por cima da lista inteira. O que fica é o índice: a pesquisa em cima, a linha de cobertura com as duas chaves da prova, a contagem por parcelas e a lista por distrito, **29 grupos**, que são os da Carta. A chave `municipios.comPaginaK` sai das duas edições e a regra `.concelhos-primeiro` sai da folha. O mapa não precisou de nada: os pontos com página já eram ligações (regra N4 de 26.08), e com 308 medem-se **308 de 308 pontos dentro de uma ligação, 0 sem página dentro de uma**.

**E4 · o livro-razão do conjunto.** `/livro-razao/concelhos` · `/en/ledger/municipalities`, com a pesquisa da casa (a mesma peça, com outro destino: a âncora do grupo daquele concelho), a lista por concelho, e três contagens que são chaves da prova, recontadas pelo portão: `concelhos_linhas`, `concelhos_no_livro` e `concelhos_linhas_completas`. As duas primeiras contam-se de pontos de observação diferentes de propósito (as linhas no livro-razão que o portão lê, os grupos na página construída), e é a comparação entre elas que apanha uma linha que exista e não seja agrupada. Sem linhas, as três são zero e a página rende o estado vazio desenhado.

O índice principal deixa de listar as linhas deste estudo, e o porquê está escrito na vista: não saem do livro-razão, saem da lista. As páginas de linha continuam a ser geradas para todas, o CSV e o JSON continuam a incluir todas, e as contagens do cabeçalho continuam a contar todas. A linha das contagens ganha a terceira parcela («136 afirmações · 19 calculadas · 0 linhas de concelhos») e a porta fica sozinha na sua fila, por duas razões medidas: um `<ValorDaProva>` é uma ligação, e metê-lo dentro do `<a>` da porta punha uma âncora dentro de outra (Emenda 2); e mesmo irmãs, as duas ligações tinham as áreas de toque sobrepostas, que a régua B10 apanhou.

O estudo `concelhos-2026` entra em `INTERNAL_SOURCES` de `src/data/studies.mjs`, e não em `WORKS`: `WORKS` é o arquivo, com documento, edições e página em `/estudos`, e este não tem documento nenhum. Metê-lo lá punha no arquivo um trabalho sem texto e mudava `estudos_no_arquivo` e `edicoes_no_arquivo`, que são a aritmética de outras linhas do livro-razão. **O título perdeu a contagem**, e foi o portão que o decidiu: «Concelhos: as medidas centrais dos 308» fechava a construção nas duas edições, porque o «308» é um algarismo do próprio sítio numa cadeia sem porta (`IDENTIDADE.md` §10). Fica «Concelhos: as medidas centrais»; a contagem vive onde tem porta.

**E5 · as correções de Évora.** (a) A peça 4 passa a «Empresas não financeiras» / «Non-financial enterprises». (b) As peças 7 e 8 passam a ler a fonte central e ficam as duas vazias: a execução da receita não tem fonte central desde 2019, e a lista do regulador diz «N.d.» para Évora a 31.12.2025. As duas linhas municipais (`evora-execucao-da-receita-2025` e `evora-prazo-medio-de-pagamento-2025`) descem para a camada das contas, num par de campos rotulados, com os seus selos e sem um valor mudado. (c) A nota da dívida passa a dizer a coluna: «Exclui dívidas não orçamentais e exceções legais.»

**O registo de correções não recebeu as três entradas, e a razão foi medida.** O mecanismo da casa é o campo `corrections[]` da própria linha, e as oito linhas de Évora são **linhas cruzadas**: o registo da travessia prende os seus bytes. Plantada a entrada em `ledger/claims/evora-empresas-2024.yml`, `check-cruzamento` fecha a construção («os bytes em disco já não são os que atravessaram»), e a porta que existe para isso, `--accept-correction`, recusa por escrito:

```
✗ evora-empresas-2024: o valor publicado é "7 907" e a correcção mais recente
  diz new_value "Empresas não financeiras". A correcção tem de descrever a
  alteração que foi feita.
```

A porta é estreita de propósito: exige que o `value` publicado seja o `new_value` da correção. Uma correção de **rótulo de página** não muda valor nenhum, e por isso não cabe em nenhuma das três naturezas: `correcao` e `atualizacao` movem o número, `proveniencia` move um dos sete campos de proveniência, e nenhum deles é o rótulo que a página dá à medida. O §4 do brief pede «nenhum byte de `ledger/claims/`» e o E5 pede três entradas; as duas coisas não se podem ter ao mesmo tempo com o mecanismo que existe. Fica para a direção, e é decisão de forma, não de construção.

**E6 · os portões e a escala.** `check-cruzamento` **já** validava todos os ficheiros de `ledger/cruzamentos/`: `registos()` lê o directório inteiro e filtra por `.json`. Provado, e não lido: com um terceiro registo plantado (`planta.json`, com um resumo que não é o dos bytes em disco) o portão fecha a nomeá-lo; retirado o ficheiro, volta a verde. O `gate-html` ganha as três chaves novas, contadas por conta própria.

### 3 · Os estragos plantados, vistos vermelhos

Uma régua só conta depois de apanhar um estrago. Cada linha foi vista vermelha com o estrago posto e verde depois de reposto, com a construção verde nos dois estados.

| estrago | onde | célula que o apanhou |
|---|---|---|
| as peças vazias passam para a frente da lista | `src/lib/inicio.mjs` | `P2 · as oito peças pela ordem da Emenda 14` |
| a coluna do corpo e a camada da leitura breve rendem-se sempre | `MunicipioView.astro` | `P2 · um concelho sem estudos rende só o que existe` |
| o prazo médio sai da camada das contas | `MunicipioView.astro` | `P2 · as duas linhas municipais descem para as contas` |
| o estado vazio desenhado desaparece | `LivroConcelhosView.astro` | `P2 · a página do conjunto` |
| um distrito inteiro sai do índice | `MunicipiosView.astro` | `3c · os 308 concelhos, uma cadeia por estado de cobertura` |
| um terceiro registo de cruzamento com o resumo errado | `ledger/cruzamentos/planta.json` | `check-cruzamento` |
| a entrada de correção numa linha cruzada | `ledger/claims/evora-empresas-2024.yml` | `check-cruzamento` e `--accept-correction` |

Duas plantações não apanharam nada e foram substituídas, e isso também é medição: ordenar as peças vazias **para o fim** não mexe em Évora, porque as duas vazias já são as duas últimas; e forçar a camada da leitura breve num concelho sem corpo não se vê, porque ela vive dentro da coluna do corpo, que já não se rende. As duas segundas versões apanharam.

### 4 · As réguas que assumiam a cobertura de uma tarde

Nove células mediam «um concelho com página e 307 sem», que era o estado do dia em que nasceram e não uma regra. Com os 308 construídos ficavam vermelhas por o sítio ter crescido. Todas passam a **ler a cobertura do `dist/`** e a julgar a regra:

| régua | célula | o que passou a medir |
|---|---|---|
| `mapa-navegacao` | N1 pt · N1 en | um endereço antigo abre a página quando ela existe, e o índice quando não existe |
| `mapa-navegacao` | N4 pt · N4 en | um ponto com página abre-a; um sem página não faz nada, quando ainda há algum |
| `mapa-navegacao` | N4 teclado | o foco arranca num ponto com página, `Home` volta a ele, `Enter` abre o que tem página |
| `matriz` | 2j·a | um só raio e um só enchimento para os 308, e pelo menos um declarado com página |
| `matriz` | o anel do escolhido | o ponto de comparação é outro ponto, e não «um sem página» |
| `matriz` | a pesquisa com a caixa vazia | os resultados à vista são os que têm página, e um resultado é porta se e só se a tem |
| `correcoes-a` | A5 · A5 teclado · A6 | a regra do ponto-ligação, o destino pela forma da rota, o separador da casa |
| `correcoes-c` | C4 · a pesquisa | porta se e só se «com-pagina» |
| `concelhos` | 3c | 308 concelhos em 29 grupos, uma porta por concelho com página |

**Duas células retiradas, com a razão no lugar delas:** a de `correcoes-c` que media a secção «Com página» antes da lista (a secção saiu) passa a medir que a lista é a dos 29 distritos da Carta sem secção repetida por cima.

**Duas falhas anteriores corrigidas de passagem** (a §5 do brief manda dizer): a `3b` de `recibo.mjs` pedia `m.n === 132` e o livro-razão tem 136 linhas, e passa a ler a contagem e a julgar o que o seu nome diz (cada linha listada tem o selo da sua própria linha e o seu estado); e a `3c` de `concelhos.mjs`, que pedia «1 com página».

### 5 · O que se mediu de novo, e não estava pedido

**Uma âncora dentro de outra**, no índice do livro-razão: a primeira redação da porta punha o valor da prova dentro do `<a>`. Apanhada pela régua nova, ao contar duas portas onde devia haver uma. A célula passa a exigir **duas ligações irmãs e zero aninhadas**.

**Um par de alvos sobrepostos** na primeira página a 390, com a cobertura dos 308: a fila da pesquisa passa de um resultado a oito, e a área de toque do último cruzava por **1,0 px** o selo da secção seguinte. A saída é a da etapa 1d: dar espaço à fila (`.pesquisa-res { margin-bottom: 10px }` abaixo de 640) em vez de encolher o alvo. Medido a zero depois.

**O inventário de frases não vira a lista dos 308 escrita outra vez.** Com as 616 páginas de concelho, cada uma trazia três blocos por classificar: o nome, a etiqueta da Carta e a descrição do `<head>`. O nome e a etiqueta passam a ir declarados com `data-lugar` (são o nome da coisa, transcritos de um registo, e não a casa a escrever), e a descrição, que é composta com o nome, conta-se **uma vez** com o nome substituído pela marca: «O que as fontes publicam sobre o município de \<lugar\>: …». É a mesma razão, e a mesma forma, da exclusão de `data-cobertura`. Medido: **0 blocos por classificar** nas duas coberturas.

**A medição em JSON estava a ser cortada.** `medir-defeitos.mjs --json` escrevia com `console.log` e saía com `process.exit()`: com os 308, a saída passou de dezenas de kB para 180 kB e a matriz, que a lê por `execFileSync`, recebia-a cortada ao byte 65 534, o tamanho do cano, e fechava com «Unterminated string in JSON». Passa a escrever com `fs.writeSync`.

### 6 · As capturas

`../capturas/concelhos-2026-08-26/`, em JPEG, página inteira, a 390 e a 1280:

| ficheiro | o quê |
|---|---|
| `antes-evora-*` | Évora antes, de uma construção de `main` guardada fora do repositório |
| `depois-evora-*` | Évora depois: peça 4 com o nome do INE, peças 7 e 8 vazias, as duas linhas municipais nas contas |
| `depois-braganca-*` | um concelho gerado, com as oito peças vazias e sem coluna de corpo |
| `depois-municipios-*` | o índice dos 308, com os 29 grupos e sem a secção repetida |
| `depois-livro-concelhos-*` | a página do conjunto, no seu estado vazio |
| `depois-livro-indice-*` | o índice do livro-razão, com a terceira contagem e a porta |

O «antes» de Évora mede 7 603 px de altura a 1280 e o «depois» 7 692 px: os 89 px são o par de campos que desceu para a camada das contas.

### 7 · O que fica

* **As três entradas do registo de correções** (E5), que o mecanismo da casa não pode escrever para uma linha cruzada. Decisão de forma, para a direção.
* **A célula «concelho sem estudos» da matriz**, que o plano §3.5 nomeia. Vive em `tests/municipio/concelhos.mjs`, que é a régua que o brief manda crescer; se a direção a quiser também na matriz, é uma cópia.
* **A régua do concelho sem estudos salta** quando só há uma página de concelho construída, e diz o comando que lhe dá objecto. Não passa nem falha: uma célula que passasse sem medir era pior.
* **A leitura do Codex** sobre um pacote de dez páginas de concelho e a página do conjunto, que o plano §3.5 põe neste passo.
* **O I70** (44 dos 308 pontos com vizinho a menos de um diâmetro) continua aberto, e o caminho das zonas densas continua a ser a pesquisa.

---

## P2 · os dados

*Escrito a 26.08.2026, depois de o exportador do motor ter escrito na árvore de trabalho deste ramo: 2 416 ficheiros novos em `ledger/claims/`, `ledger/cruzamentos/concelhos.json` e `src/data/concelhos.gerado.json` (308 objetos, 2 422 ids, 42 a `null`). Os três ficam por indexar; quem os comete é o lugar de direção. Os números desta secção vêm de uma construção do zero com os dados presentes.*

### 8 · O defeito que só os dados mostraram

A construção do lugar de direção fechou com **4 846 erros**, e por baixo deles havia **um** defeito.

`src/data/concelhos.mjs` procurava `concelhos.gerado.json` por um caminho relativo ao próprio módulo, `new URL('./concelhos.gerado.json', import.meta.url)`. **Na construção o módulo é empacotado**, e um caminho relativo ao módulo passa a apontar para o pacote: o ficheiro existia e o Astro não o via. `entradasGeradas()` devolvia lista vazia, o `getStaticPaths` escrevia UMA página de concelho, e nada do lado do Astro fechava a construção. A regra estava escrita, com todas as letras, no cabeçalho de `src/lib/prova.mjs` desde a primeira corrida dele, e eu não a segui.

**Porque não foi apanhado no P2 (estrutura):** a cobertura dos 308 foi sempre construída com `CONCELHOS_GERADO=<ficheiro>`, que é um caminho absoluto e não passa por ali. O caminho por omissão nunca foi exercido com um ficheiro a existir.

Quem o apanhou foi o portão, com as duas contas de uma chave da prova: a prova, que corre em Node e via o ficheiro, dizia 308 concelhos com página e 307 no livro-razão; a vista `dist`, que conta o que foi construído, dizia 1 e 0. É exactamente para isso que uma chave tem duas contas. Os outros 4 832 erros eram consequência: com um concelho declarado, as 2 416 linhas do estudo caíam todas no grupo dos não declarados da página do conjunto, e o portão recusava-lhes a marca.

O caminho passa a ser procurado a subir, como `encontraLivroRazao()` e `prova.mjs` já faziam. E a régua ganha a célula que faltava: **as entradas que o módulo dá e as páginas que a construção escreveu, contadas dos dois lados.**

### 9 · Os outros três, e o que foi decidido em cada um

**(a) A página do conjunto é uma página do livro-razão, e o portão não o sabia.** `data-linha-*` é a marca de um campo do livro-razão, e o portão aceitava-a em duas rotas: `linha` e `livro`. A página do conjunto lista as linhas do estudo com a mesma linha-espécime, os mesmos campos e o selo da própria linha em cada uma: é um índice do livro-razão, e é para lá que essas linhas saíram do índice principal. **A rota entra na lista.** A alternativa (a página renderizar as linhas noutra forma) não existe: a forma já é a do índice; o que faltava era o portão saber que aquela rota é do livro-razão. O que a guarda protege continua protegido: `data-linha-*` continua proibido em qualquer página que não seja do livro-razão.

**(b) A prosa da agenda deixou de distinguir coisa nenhuma.** A regra recusa um número da prosa da agenda cuja sequência de algarismos seja a de um valor do livro-razão, e existe para apanhar «uma medição sem selo». Comparada com o livro-razão INTEIRO, e com 2 552 linhas, o espaço dos valores passou a cobrir quase todos os inteiros pequenos: a agenda fechou a construção doze vezes, e as doze foram lidas uma a uma e nenhuma era uma medição.

| o que a prosa diz | com que linha colidia |
|---|---|
| `9`, o limiar de preços da habitação que a Comissão publica, com excerto e endereço | o prazo médio de pagamento de Alijó |
| `222`, o número do documento SWD(2026) 222 | o índice de dívida de Salvaterra de Magos |
| `2022`, um ano numa lista de datas de publicação | as empresas de Coruche |
| `76`, o artigo 76.º da lei | o desemprego registado de Barrancos |
| `20`, um dia numa data | o prazo médio de pagamento de Cascais |

A regra escrita no próprio portão é sobre a MESMA página: «um valor que tem linha e selo noutro sítio da mesma página». A implementação era mais larga do que a regra que serve. **Passa a comparar com as linhas que a própria página cita com `<Claim/>`.** O que a regra existe para apanhar continua apanhado, e foi medido: metido na prosa da agenda o valor de uma linha que a agenda rende com selo, o portão fecha a construção com a mesma mensagem, sobre a mesma linha que o comentário do portão dá como exemplo desde que foi escrito.

**(c) Évora passa a ler a linha do desemprego que o motor escreveu.** O exportador escreveu `evora-desemprego-registado-2025-12` com os outros 277 do continente. A entrada à mão continuava a apontar para `evora-desemprego-registado-2024`, e isso punha a mesma peça a medir dezembro de 2024 em Évora e dezembro de 2025 nos outros, que é o que a decisão D2 recusa, e deixava a linha nova sem concelho que a declarasse. A linha de 2024 não desaparece: continua citada na leitura breve, que é a frase que mede a queda de 2013 para 2024. Com isto, `concelhos_no_livro` passa de 307 para **308** e as linhas sem concelho declarado passam a **zero**.

### 10 · A escala, com os dados

Construção do zero, na mesma máquina. A coluna «com os dados» é a da forma final, com o índice dos concelhos e as 308 páginas de livro-razão por baixo dele.

| | com o ficheiro de teste | **com os dados** |
|---|---|---|
| `npm run build` | 22,92 s | **269,84 s** |
| páginas | 958 | **6 406** |
| `dist/` | 83 MB | **406 MB** |
| ficheiros em `dist/` | 2 244 | **29 436** |
| linhas no livro-razão | 136 | **2 552** |
| páginas de linha | 272 | **5 104** |
| ligações internas conferidas | 225 756 | **427 298** |
| números marcados nas páginas | 2 008 | **12 904** |
| cartões de partilha | 548 | **10 212** |

**Onde vai o tempo:** `astro build` ~130 s, `cartoes` 102,6 s, e os seis portões repartem os restantes ~37 s. **Onde vai o tamanho:** `dist/cartoes` **224 MB dos 406**, com 10 212 PNG (o passo diz 165,29 MB de imagem; o resto é o registo JSON de cada cartão e o arredondamento do disco).

**Os cartões ficam, e a decisão está tomada** (diretor, 26.08.2026, contra a página de limites da Vercel lida no dia): o passo de construção pode levar 45 minutos em qualquer plano, e não há limite superior para os ficheiros de saída criados durante uma construção; os limites de 100 MB / 1 GB e de 15 000 ficheiros são das cargas de código pela linha de comandos, e não de uma construção disparada pelo Git. **224 MB e 102,6 s são, portanto, o custo medido da regra**, e não um problema: cada página de linha tem o seu cartão de partilha, como todas as outras.

### 11 · A página do conjunto passou a ser um índice, e cada concelho ganhou a sua

Medido antes: `/livro-razao/concelhos` tinha 2 416 linhas, **227 008 px de altura a 1280** e 352 735 px a 390, e o motor de captura não a fotografava inteira. A decisão D6 tinha tirado essas linhas do índice principal porque 2 500 numa página não se leem, e o problema reapareceu dentro da página que existia para o resolver.

**Decisão do diretor a 26.08.2026:** uma página de livro-razão por concelho, `/livro-razao/concelhos/<slug>` · `/en/ledger/municipalities/<slug>`, com as linhas desse concelho na linha-espécime da casa, cada uma com o seu selo e a porta para a sua página de linha, o nome do concelho como título e sem mapa. `/livro-razao/concelhos` passa a ser o índice dos 308: a pesquisa (destino: a página de livro-razão do concelho), as três contagens do conjunto, e a lista por distrito com uma linha por concelho. A porta da página do concelho para o livro-razão aponta para a página de livro-razão dele.

Medido depois: o índice mede **10 751 px a 1280** e a página de Bragança **1 449 px**, com as suas oito linhas.

**A linha de um concelho não leva a sua contagem, e a razão é a regra da casa.** «Bragança · 8 linhas» é um número do próprio sítio, e a `IDENTIDADE.md` §10 exige que um número do próprio sítio entre por `data-prova`, com a sua porta e com o portão a recontá-lo. Seriam 308 números na lista: ou 308 chaves na tabela da prova, ou 308 algarismos sem porta, que é o que o portão fecha (fechou, com um só «308» dentro do título deste estudo). Nenhum dos motivos de `data-nonledger` descreve uma contagem. O que a lista dá é o nome, a porta e o estado em duas palavras; quantas linhas cada concelho tem lê-se na página dele, contando-as. As três contagens do conjunto ficam onde têm porta, no topo do índice.

### 11b · O registo de correções fica sem entradas, e é decisão

**Decisão do diretor a 26.08.2026: nenhuma das três.** O registo de correções é dos VALORES e da PROVENIÊNCIA de uma linha, e é isso que o mecanismo da casa sabe escrever: a natureza `correcao` e a `atualizacao` movem o número, a `proveniencia` move um dos sete campos de proveniência. Nas três correções de Évora, o valor e a proveniência das linhas estavam certos e não mudaram: o que mudou foi o RÓTULO que o sítio dá à medida e a DISPOSIÇÃO da página. Não são entradas do registo, e a `DECISIONS.md` §1.68 é onde ficam registadas. A medição que mostrava que o mecanismo as recusava fica escrita acima, e passa a ser a razão pela qual não se forçou: a porta estreita estava certa.

### 12 · O que ficou verde, com os códigos de saída

Com os dados presentes, tudo do zero, na forma final:

| comando | saída | o que diz |
|---|---|---|
| `npm run build` | 0 | 269,84 s · 6 406 páginas · 406 MB · 29 436 ficheiros |
| `npm run verify` | 0 | |
| `npm run typecheck` | 0 | |
| `node scripts/provar-eyetext.mjs` | 0 | 157 conferências |
| `node scripts/check-cadeia.mjs` | 0 | 196 até ao selo, 2 405 até à entrada do motor |
| `node scripts/medir-defeitos.mjs` | 0 | **0 blocos por classificar** |
| `tests/municipio/concelhos.mjs` | 0 | 11 de 11 |
| `tests/municipio/correcoes-c.mjs` | 0 | 12 de 12 |
| `tests/inicio/matriz.mjs` | 0 | 87 de 87 |
| `tests/inicio/mapa-navegacao.mjs` | 0 | 11 de 11 |
| `tests/inicio/correcoes-a.mjs` | 0 | 32 de 32 |
| `tests/linha/recibo.mjs` | 0 | 13 de 13 |
| `tests/linha/correcoes-b.mjs` | 0 | 32 de 32 |
| `tests/texto/correcoes-b.mjs` | 0 | 19 de 19 |
| `tests/texto/correcoes-c.mjs` | 0 | 9 de 9 |
| `tests/texto/leitura.mjs` | 0 | 51/51 |

**`tests/inicio/capturas.mjs` corre com um argumento, e sem ele reescreve as capturas da etapa 2.** Corrido sem argumento, escreveu por cima de 56 ficheiros indexados e criou 16 novos; foram repostos com `git checkout` e apagados. Fica dito para não se repetir.

**A célula que «não tinha objecto» tem-no agora.** Era a do concelho sem estudos: com uma página de concelho construída não havia segunda para medir. Com os dados há 307, e ela corre. Estava escrita contra o ficheiro de teste (oito peças vazias, nenhum algarismo, nenhuma secção) e foi reescrita para medir a REGRA, que vale nas duas coberturas, e a varrer as 307.

### 13 · Os estragos plantados, vistos vermelhos

| estrago | onde | o que o apanhou |
|---|---|---|
| o caminho volta a ser relativo ao módulo, e reconstrói-se | `src/data/concelhos.mjs` | `P2 · as entradas do módulo e as páginas construídas` · «o módulo dá 308 entrada(s), a construção escreveu 1 página(s)» |
| a página do conjunto deixa de ser uma página do livro-razão | `scripts/gate-html.mjs` | o portão · 18 104 erros de `data-linha-claim` |
| a prosa da agenda volta a comparar com o livro-razão inteiro | `scripts/gate-html.mjs` | o portão · os 12 falsos positivos voltam |
| o valor de uma linha que a agenda rende, metido na prosa da agenda | `dist/agenda/index.html` | o portão · «"17,6" é o valor da linha "precos-da-habitacao-2025"» |
| a camada das contas rende-se num concelho sem contas | `dist/municipios/agueda/index.html` | a régua dos concelhos e a célula nova da matriz |
| uma linha do estudo apagada de dentro do seu grupo | `dist/livro-razao/concelhos/index.html` | a célula do conjunto · 2 415 linhas para 2 416 declaradas |
| uma das oito linhas de Bragança apagada da página dela | `dist/livro-razao/concelhos/braganca/index.html` | `P2 · o índice dos concelhos` · a soma das 308 páginas dá 2 415 para 2 416 declaradas |
| a linha de Bragança no índice a apontar para uma página que não existe | `dist/livro-razao/concelhos/index.html` | `P2 · o índice dos concelhos` · «1 porta(s) sem página» |

Os quatro últimos são plantados no `dist/`, que é o que o portão e as réguas medem, e repostos a seguir; os dois primeiros no código, com o ficheiro reposto de uma cópia.

### 14 · As capturas com dados

`../capturas/concelhos-2026-08-26/dados/`, a 390 e a 1280:

| ficheiro | o quê |
|---|---|
| `lisboa-*` · `braganca-*` | um concelho grande e um do interior, sete peças cheias e a execução vazia |
| `corvo-*` | uma ilha: sem desemprego registado, que o IEFP não publica fora do continente |
| `penedono-*` | o concelho que a DGAL dá como «N.d.»: população, poder de compra, desemprego e empresas cheios, e quatro peças vazias, sem a dívida desenhada |
| `evora-*` | Évora, com as suas camadas e o desemprego agora em dezembro de 2025 |
| `livro-indice-*` | o índice do livro-razão, que continua a listar 136 linhas |
| `livro-concelhos-indice-*` | o índice dos concelhos no livro-razão, 10 751 px a 1280 |
| `livro-concelho-braganca-*` | a página de livro-razão de um concelho, 1 449 px a 1280, com as suas oito linhas |
| `linha-braganca-divida-*` | o recibo de uma linha da DGAL, com a sua proveniência |
