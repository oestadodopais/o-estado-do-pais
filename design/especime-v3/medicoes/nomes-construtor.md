# F1.4 · os nomes humanos, as datas, o índice do livro-razão · relatório do construtor

*Ramo `nomes-2026-09-04`, tirado de `origin/main` em `86632082` e fundido com
`8b2bbafc` (o F1.2b) antes de qualquer alteração; `1dbd1cef` (registo),
`741e4915` (o `engines.node` e a regra do Vercel) e `4624db04` (a §1.98, que
fecha o vocabulário e muda o item 5 deste bloco) fundidos antes do empurrão. Construtor Claude Opus 5, 04.09.2026. O bloco
é o F1.4 de `design/observatorio/BRIEF-F1.4-nomes-datas-indice.md`, e a origem é
a auditoria de 02.09 (`AUDITORIA-2026-09-02.md`, linhas 66, 67, 68 e 72). Sem
travessões na prosa.*

## 1 · O resultado, em cinco linhas

**As nove coisas do brief estão feitas, e três delas encostam num pendente que é
do diretor ou do motor.** Em números medidos sobre as duas construções:
**484 entradas** do índice do livro-razão e das páginas de área deixaram de se
chamar pelo nome da máquina, e **460 ganharam um nome humano**; **28 300 datas
ISO à vista** passaram a **0**; o índice ganhou uma busca e as suas duas parcelas
ganharam denominador; «peça» saiu do rótulo da contagem das áreas, pela §1.98; a
página de cada uma das 29 unidades da Carta passa a dizer o que tem.

**Nenhum número novo entrou**, e não é uma afirmação: é uma comparação. O
inventário dos valores selados e dos motivos declarados de todo o `dist/` foi
guardado antes e depois e comparado por guião (`--contra`): 2 916 linhas citadas
e 16 motivos, sem uma linha nova, sem uma linha perdida e sem um motivo novo.

**Duas coisas apareceram que o bloco não ia procurar, e as duas mudam o que se
faz a seguir.** A primeira: **a gralha da fonte que o brief mandava limpar não
existe** (§2.1). A segunda: **o G6 já estava verde** antes deste bloco (§3), e o
que o bloco fez foi tirar do gabarito uma segunda forma do marcador que ainda não
se tinha rendido.

**E uma terceira, que é uma dívida com nome:** **79 das 149 linhas** do índice
passam a chamar-se pelo TÍTULO DO DOCUMENTO de onde foram lidas, porque a escada
não tem quinto degrau. Dez chamam-se «Prestação de Contas 2025». O nome próprio
delas nasce no motor, não aqui (§5.3).

## 2 · O que cada item do brief passou a ser

### 2.1 · Os nomes humanos das medidas (item 1)

A escolha do nome passa a sair de **um sítio só**, `src/lib/nomes.mjs`, e é uma
escada de quatro degraus:

| # | de onde vem | como se marca | quem confere |
| --- | --- | --- | --- |
| 1 | `src/data/figuras.mjs` (o nome do cartão da primeira página) | `data-nome="figuras"` | `scripts/medir-defeitos.mjs` lê o ficheiro e compara carácter a carácter; `check:voz` fecha |
| 2 | `src/data/dominios.mjs` (o nome da medida de um domínio) | `data-nome="medidas"` | o mesmo |
| 3 | `name` (o rótulo que a fonte imprime) | `data-linha-campo="name"` | `gate:html`, contra a linha |
| 4 | `document.title` (o título do documento de onde a linha foi lida) | `data-linha-campo="document.title"` | `gate:html`, contra a linha |

**A escada, medida.** No índice do livro-razão (149 linhas): 21 pelo nome do
cartão de `figuras.mjs`, 6 pelo de `dominios.mjs`, 17 pelo rótulo da fonte
(`name`), 79 pelo título do documento, 26 sem nome. Nas medidas das páginas de
área (131): 15, 6, 15, 71 e 24. Os números são de `nomeDaMedida()` corrida sobre
o livro-razão, e batem com o que a régua conta nas páginas construídas.

O **identificador não saiu da página**: desceu a metadado, dentro de
`.livro-item-meta`, com a mesma classe (`livro-item-id`) e a mesma marca de
campo, composto como a unidade que lhe fica ao lado. Nada se perdeu: quem
precisava do identificador para procurar a linha continua a tê-lo, e deixou de
ser a primeira coisa que se lê.

**Onde a escada não dá nada, nada se escreve.** São **26 das 149 linhas** do
índice e **24 das 131 medidas** das áreas. Das 26: **22 são derivadas** (não têm
fonte nem documento porque a proveniência delas é a das origens, e a aritmética
está escrita na página de cada uma) e **4 têm por único título de documento o
próprio marcador** (`avisos-pt2030-abertos`,
`avisos-pt2030-pessoas-singulares`, `ciclo-substituicao-condutas`,
`saldo-natural-portugal-2025`): pôr `[a verificar]` onde o leitor espera o nome
da coisa seria dar ao marcador um trabalho que não é o dele. Compor-lhes um nome
do que parecem medir era escrever conteúdo que ninguém publicou.

**A gralha da fonte: procurou-se e não existe.** O brief pedia o
`document.title` «limpo da gralha da fonte». A busca foi exaustiva e está aqui
para que ninguém a repita: os **19 valores distintos** de `name` em todo o
livro-razão e os **31 títulos de documento distintos** que o quarto degrau usa no
índice foram lidos um a um. Nenhum tem uma gralha. O que os torna maus nomes é outra
coisa, e essa vê-se: seis deles são o título BRUTO de uma série do INE, com
cauda de metadados («… por Localização geográfica (NUTS - 2024); Anual - INE,
Sistema de contas integradas das empresas»), e três são palavras de tabela
(«Total», «TOTAL», «DESEMPREGO REGISTADO»). São o que a fonte imprime, e é isso
que o degrau 3 promete mostrar: por isso ficam como estão. **Um campo transcrito
não se edita para o embelezar**: o portão compara-o carácter a carácter, e uma
limpeza silenciosa seria a casa a reescrever a fonte.

**O que o quarto degrau custa, dito por inteiro.** Dez linhas de Évora passam a
chamar-se «Prestação de Contas 2025» e oito «Evolução endividamento total»,
porque é esse o documento de onde foram lidas. Não são nomes de medida: são
nomes de documento. O leitor distingue-as pelo valor, pela unidade e pelo
identificador no metadado, que continua lá. É o que o brief manda fazer, e fica
escrito aqui como uma dívida: **o nome próprio destas linhas só existe no dia em
que o motor lhes exportar um `name`**, e isso é trabalho do motor e não do sítio.

### 2.2 · Uma grafia de data (item 2)

A regra da §1.91 já existia e o corpo do sítio não a cumpria. A conversão não
podia viver na marca do campo, e a razão está escrita desde 03.09 em
`src/components/DataDaLinha.astro`: `data-linha-campo` obriga a uma comparação
literal com o livro-razão, que guarda as datas em ISO, e uma data convertida
nunca a passaria.

**A saída foi a que a casa já tinha, alargada.** `CampoDaLinha` passa a decidir,
pelo NOME DO CAMPO, qual das duas marcas o campo leva: um campo de data sai por
`DataDaLinha`, com `data-nonledger="data-da-linha"` mais a linha e o campo de
onde saiu, e `scripts/check-formas.mjs` (F1) vai buscar o campo à linha, recompõe
a data por conta própria e compara carácter a carácter. **Nenhum portão
enfraqueceu**: onde havia uma comparação passou a haver uma comparação e uma
recomposição.

A lista dos campos que são datas está declarada em `src/lib/datas.mjs`
(`eCampoDeData`) e não é adivinhada da forma do valor: uma regra que convertesse
tudo o que parece uma data converteria uma edição de documento («2025-12») e um
localizador que a fonte escreveu assim.

Quatro outras conferências aprenderam a mesma regra, cada uma com a sua cópia
local (nunca a função do gabarito, que confirmaria a função e não o registo):

* `gate:html`, para a data de uma entrada do registo de correções
  (`data-correcao-campo="date"` passa do modo `exacto` ao modo `data`);
* `gate:html`, para os campos do registo da agenda que SÃO uma data inteira;
* `gate:html`, para uma chave da PROVA cujo valor é uma data. Hoje há uma,
  `painel_reconferido_em`, e era a última data ISO à vista do sítio depois de as
  outras 28 300 terem convertido: saía no Método, dentro do instrumento do
  mecanismo e na linha da regra. O comentário do portão dizia «uma data é ISO», e
  passa a dizer o que a §1.91 diz;
* `gate:html`, para o mesmo valor DENTRO de um cartão de partilha, porque um
  cartão é a mesma coisa vista de fora e duas grafias da mesma data seriam duas
  casas;
* `check:formas` F1, que ganhou os dois caminhos do instantâneo do alojamento.

**O período de referência continua como a fonte o publica.** `dataDaCasa()`
deixa passar sem tocar o que não é uma data completa: um ano é um ano, um mês é
um mês. A regra é do F1.2 e não mudou.

**O que fica em ISO, e porquê.** Uma data ISO DENTRO de uma frase transcrita
(uma nota do registo da agenda, um motivo de correção, a prosa de um documento
alojado) fica como a fonte a escreveu: a casa não edita o que transcreve. E os
documentos alojados e as páginas de leitura ficam fora do âmbito por decisão do
brief (§2). As duas contagens saem separadas na régua, e não somadas ao zero.

### 2.3 · A busca no índice (item 3)

Um `<input type="search">` dentro de um `<form method="get">` cujo destino é o
próprio índice, com rótulo preso ao campo e com `role="search"`. Com guião,
`public/js/livro.js` filtra as entradas à medida que se escreve, comparando com
`data-busca` (o nome, o identificador e a fonte de cada linha, sem acentos e em
caixa baixa, calculados na construção pela mesma função da pesquisa dos
concelhos), e lê o `?q=` do endereço à chegada.

**Sem guião o formulário não filtra, e isso fica dito.** Leva ao índice inteiro
com `?q=` no endereço, e a caixa serve de marco de busca (`role="search"`) para
quem navega com um leitor de página, que é a âncora que o brief nomeia.
Filtrar do lado do servidor pediria uma página por pergunta, e este sítio é
estático. É por isso que a caixa NÃO vem escondida do servidor, ao contrário da
pesquisa dos concelhos: ali, sem guião, não há destino nenhum e a peça esconde-se
(«uma caixa de pesquisa que não pesquisa é pior do que nenhuma»); aqui há
destino e há marco, e escondê-la tirava as duas coisas a quem mais precisa delas.

**O que a busca filtra são as linhas que ESTA lista mostra**, e não as 2 916 do
livro-razão: as 2 767 dos concelhos saíram deste índice pela decisão D6 de
26.08.2026 e têm índice próprio, com busca própria, cuja porta está por cima da
lista. Uma busca que prometesse 2 916 e devolvesse as que estão no documento
seria uma promessa falsa.

### 2.4 · As contagens com denominador (item 4)

«2916 afirmações · 330 calculadas · 2767 linhas de concelhos» passa a
«2916 afirmações · 330 de 2916 calculadas · 2767 de 2916 linhas de concelhos».

**O denominador não é um número novo:** é a mesma chave da prova (`afirmacoes`),
rendida três vezes com a mesma marca e a mesma porta. O portão reconta a chave
uma vez e compara-a com cada ocorrência.

**O primeiro número não ganha denominador porque é ele.** Um total sobre um
total maior seria um conjunto que não existe, e escrevê-lo era inventar.

**`Masthead.astro` não foi tocado.** O brief mandava mexer-lhe por último,
porque «as contagens do cabeçalho» também são dele. Não são: as três contagens
que a auditoria nomeia («2916 afirmações · 330 calculadas · 2767 linhas de
concelhos», linha 72 da auditoria) são o cabeçalho da PÁGINA `/livro-razao`, e
vivem em `src/views/LivroView.astro`. As três que viviam no `Masthead`
(municípios, estudos, edições) saíram a 16.08.2026 pela §1.40, e o que lá está
hoje são as duas leituras da agenda, que têm a sua página. Um ficheiro que o
F1.2b também toca ficou por tocar, e é uma fusão a menos.

### 2.5 · «Peça» sai (item 5, com a §1.98 a decidir qual das duas saídas)

O brief dava duas saídas: definir a palavra na página onde aparece, ou tirá-la e
pôr uma que o inventário já tenha. Este bloco tinha escolhido a primeira e
escrito a definição; a **`DECISIONS.md` §1.98, de 04.09.2026, chegou a meio** e
escolhe a segunda por todo o sítio: o vocabulário fechado da casa tem «estudo»
para um trabalho de autor, «medida» para uma medida e «linha do livro-razão» para
uma linha, e «peça» e «indicador» saem.

**A contagem passa a dizer o que conta.** `areasComPecas()` soma três famílias:
os trabalhos, os estudos de dados e as medidas de cada área. As três dizem-se com
duas palavras do vocabulário, e é isso que o rótulo passa a dizer: «Saúde ·
6 estudos e medidas». No singular, «estudo ou medida», porque com uma só não se
sabe qual das duas é e escolher uma era adivinhar.

**Duas chaves mudaram de texto, e nenhuma chave nova entrou.** `areas.contaUma` e
`areas.contaMuitas` já existiam; a definição que este bloco tinha escrito
(`areas.pecaDefinicao`) saiu com a classe do CSS e com as duas linhas do
inventário. A passagem por todo o sítio (o Método, o Sobre, os documentos
alojados) é do **bloco F1.10**, e a régua deste bloco conta essas 16 ocorrências
à parte, para que não fiquem em silêncio.

### 2.6 · O marcador com um destino (item 6)

Uma ocorrência do marcador estava escrita à mão, sem classe e sem porta:
`EstudosView.astro` escrevia a cadeia `POR_VERIFICAR` dentro do badge de uma
edição. Esse ramo passa a mostrar a data quando ela existe e a não se desenhar
quando não existe, e o marcador do trabalho fica onde ele tem a porta, na fila da
data, uma vez só. (O ramo não se rende hoje: os doze trabalhos ou têm uma data só
ou não têm nenhuma.)

**A excepção fica escrita e medida.** Dentro de um selo, o marcador continua a
ser um `<span>` e não uma ligação, porque a `IDENTIDADE.md` §5.4 faz do selo
INTEIRO a porta da linha e a Emenda 2 proíbe uma âncora dentro de outra. A régua
conta essas ocorrências à parte e exige que cada uma esteja mesmo dentro de um
selo.

### 2.7 · O endereço e o título do documento (item 7)

O endereço da fonte ganha uma oportunidade de quebra depois de cada `/`
(`<wbr>`), o que põe o corte nas juntas do endereço em vez de a meio de uma
palavra do caminho. **O texto não muda um carácter**: `<wbr>` é um elemento
vazio, e o portão continua a comparar o campo carácter a carácter (junta os nós
de texto sem separador).

O título do documento passa a abrir o `document.url` da linha, quando ela o
declara (358 das 2 916). **A porta é conferida como as outras**: `gate:html`
passou a exigir que a âncora que embrulha `data-linha-campo="document.title"`
aponte, carácter a carácter, para o `document.url` daquela linha, e que uma linha
sem `document.url` não tenha âncora nenhuma à volta do título. É a mesma excepção
estreita que o endereço já tinha, e pela mesma razão: uma porta é a única coisa
da página que se segue sem se ler.

### 2.8 · A página de uma unidade da Carta (item 8)

**O agregado não existe, e foi medido e não suposto:** o livro-razão não guarda
uma única linha de unidade da Carta (nenhum dos 2 916 identificadores nomeia um
distrito ou uma ilha). Somar aqui as linhas dos concelhos seria aritmética nova
numa página, sem linha derivada e sem selo.

Fica a frase, e é a que a descrição do `<head>` desta página já escrevia desde
que ela existe: «Os concelhos de X, pela Carta Administrativa Oficial de
Portugal.» O leitor que abria a página não a via. Não há cadeia nova: duas
cadeias com o mesmo sentido eram duas coisas para manter em dia.

### 2.9 · As datas dos estudos (item 9)

**As datas não se podem confirmar, e a razão está escrita no arquivo.**
`src/data/studies.mjs` declara `date: null` com a razão ao lado: «A data de
publicação fica por decidir pela direção: o trabalho está construído e conferido,
mas não foi publicado.» O registo do motor (`registos/manifest.json`) guarda
`exported_at` e `fixado_em`, que são datas de exportação e de fixação e não de
publicação: usá-las era inventar um facto.

Fica o segundo ramo do brief, e ele já estava cumprido: o marcador rende-se **uma
vez por trabalho**, na fila da data. A régua passa a medi-lo para que não volte a
multiplicar-se. **É um pendente do diretor**, e o relatório nomeia-o: a data de
publicação de nove trabalhos é uma decisão dele.

## 3 · G1 a G12, antes e depois

**Como se mediu.** As duas colunas saem da MESMA régua, corrida sobre duas
construções: a de `origin/main` em `8b2bbafc`, construída numa worktree à parte
(`.claude/worktrees/base-nomes-antes`), e a deste ramo. As duas leram 7 238
páginas. A medição inteira de cada uma está no JSON da régua, e o «depois»
correu com `--contra` sobre o «antes», que é o que fecha o G10.

| # | medida | antes | depois |
| --- | --- | --- | --- |
| G1 | o nome de uma medida não é o identificador | **484 de 560 entradas** encabeçadas pelo identificador (129 no índice do livro-razão e 113 nas páginas de área, em cada edição); 76 com nome; 0 identificadores em metadado | **0 entradas** encabeçadas pelo identificador; **460 com nome**; 100 sem nome (26 no índice e 24 nas páginas de área, por edição: as derivadas e as que só têm o marcador por título de documento); **560 identificadores em metadado**; 0 nomes com a forma de um identificador |
| G2 | datas ISO à vista | **28 300** elementos cujo texto inteiro é uma data ISO, mais 4 em prosa por marcar | **0** e **0** |
| G3 | a busca do índice | **0** campos de busca em `/livro-razao` e `/en/ledger` | **1** em cada, dentro de um `<form method="get">` com destino, nome de campo e rótulo preso; e a filtrar no navegador: **149 → 25** com «divida», **0** com uma palavra que não existe, com o estado vazio aceso, nas duas edições |
| G4 | «peça» com definição, ou 0 ocorrências | **18** ocorrências como rótulo de contagem (nove por edição) | **0**: a palavra saiu do rótulo pela §1.98 (§2.5). As 16 ocorrências das outras páginas (o Método, o Sobre, três documentos alojados) contam-se à parte na régua e são do bloco F1.10 |
| G5 | as contagens com denominador | **0 de 2** parcelas com denominador, nas duas edições | **2 de 2** nas duas edições |
| G6 | o marcador com um destino | **já verde**: 444 ligações do marcador em «pt» (todas para `/a-verificar`), 444 em «en» (todas para `/en/to-verify`), 78 marcadores dentro de um selo e 0 escritos sem marca | igual, e a cadeia escrita à mão saiu do gabarito antes de alguma vez se render |
| G7 | sem transbordo a 390 nas páginas de linha | *(não medido: a régua nasceu com este bloco)* | **0 px** de transbordo em **60 páginas** medidas no WebKit a 390 × 664 (as 10 com o endereço mais longo, mais 50 a passo fixo sobre as restantes) |
| G8 | a página de uma unidade da Carta | **58 páginas** sem dizer o que têm; 0 linhas citadas além da Carta | **58 com a frase**; 0 linhas citadas além da Carta |
| G9 | o marcador dos estudos | 24 linhas de trabalho (doze por edição), 20 com o marcador da data, **nenhuma com mais do que um** | igual |
| G10 | nenhum número novo | 2 916 linhas citadas · 16 motivos `data-nonledger` | **iguais**, e o `--contra` não encontra uma linha nova, uma linha perdida nem um motivo novo |
| G11 | os três comandos | — | `build` 0 · `verify` 0 · `typecheck` 0 |
| G12 | a régua com plantas | — | quatro plantas, quatro vermelhas, e a construção limpa verde |

### A célula que só o navegador podia ver

**A busca escondia as entradas e elas continuavam à vista.** O guião punha
`hidden` em cada `.livro-item` que não casa, como manda a regra da casa («trocar
`hidden`, e mais nada»), e a folha desfazia-o: `.livro-item` é `display: grid`, e
uma regra de classe ganha ao `display: none` que o navegador dá ao atributo. No
HTML construído estava tudo certo, e por isso nenhuma leitura do `dist/` o podia
ver: foi a célula **I3b**, corrida no navegador, que o apanhou, com as 149
entradas ainda contadas depois de escrever «divida». A correção é uma linha
(`.livro-item[hidden] { display: none; }`), e está escrita com a razão ao lado.

**O G6 estava verde antes deste bloco, e o relatório di-lo em vez de o
reivindicar.** A auditoria escreveu «um marcador `[a verificar]` com destinos
diferentes», e a medição sobre a construção de `8b2bbafc` mostra o contrário:
todas as LIGAÇÕES do marcador de uma edição já apontavam para a mesma página. O
que existia era uma segunda FORMA do marcador escrita à mão no gabarito do
arquivo, que hoje não se rende (os doze trabalhos têm uma data só ou nenhuma) e
que se renderia no primeiro trabalho com duas edições de datas diferentes. Saiu,
e a régua passa a apanhá-la.

## 4 · A régua e as quatro plantas

A régua é `tests/livro/indice.mjs`, com uma célula por medida de aceitação, e
**entra no `npm run verify`** como `check:indice`. Corre sobre `dist/`, aceita
`OEDP_DIST` para se apontar a outra construção (é assim que se mede o antes e é
assim que se plantam os estragos), escreve a medição inteira com `--json`,
compara-a com a de antes com `--contra`, e abre o navegador com `--navegador`
para as duas células que só lá se medem (a filtragem da busca e o transbordo a
390).

**As cópias locais são cópias de propósito.** A forma da data, a cadeia do
marcador, as duas páginas do marcador e a frase que define a palavra contada
estão escritas na régua e não importadas do sítio: uma régua que leia a regra
pela mesma função que a escreve confirma a função, não o sítio.

### As quatro plantas

O brief nomeia quatro estragos, e cada um foi plantado numa CÓPIA da construção
(`OEDP_DIST` aponta a régua para lá), corrido, e revertido. A construção limpa
corre primeiro, para que o verde não seja o verde de uma régua cega.

| planta | o que se estragou, e onde | código | célula vermelha |
| --- | --- | --- | --- |
| *(sem planta)* | a construção limpa | **0** | nenhuma |
| 1 · um identificador como nome visível | o texto do primeiro `.livro-item-nome` de `dist/livro-razao/index.html` trocado por «crescimento-da-despesa-liquida-2025» | **1** | **I1** |
| 2 · uma data ISO solta | um `<p class="log-data">2026-08-12</p>` metido por cima da lista do índice | **1** | **I2** |
| 3 · a busca sem `<form>` | o `<form class="livro-busca">` do índice trocado por um `<div>`, e o `</form>` que lhe corresponde por um `</div>` | **1** | **I3** |
| 4 · o marcador com dois destinos | uma ligação `class="marcador" href="/a-verificar"` do índice apontada a `/metodo` | **1** | **I6** |

Cada planta acendeu a célula que lhe corresponde e nenhuma outra, e a construção
limpa correu primeiro para que o verde não fosse o verde de uma régua cega.

O guião das plantas está em
`design/especime-v3/medicoes/nomes-plantas.py`, para que a conferência se repita
sem o reescrever.

## 5 · O que não se fez, e porquê

1. **A ronda de leitores (F1.3) não aconteceu.** O plano faz este bloco depender
   dela, e ela é do diretor. O que ela trouxer trata-se depois; o resto está
   feito.
2. **As datas de publicação dos nove trabalhos são uma decisão do diretor**, e
   não um facto que o arquivo esconda: `src/data/studies.mjs` escreve
   `date: null` com a razão ao lado. Fica o marcador, uma vez por trabalho. É o
   pendente que este bloco levanta.
3. **Setenta e nove linhas do índice passam a chamar-se pelo TÍTULO DO DOCUMENTO
   de onde foram lidas** (31 títulos distintos), porque é o quarto degrau da
   escada e não há quinto. Dez delas
   chamam-se «Prestação de Contas 2025» e oito «Evolução endividamento total»:
   é o nome de um documento, não o de uma medida. O identificador continua na
   entrada, em metadado, e é ele que as separa. O nome próprio destas linhas
   nasce no dia em que o motor lhes exportar um campo `name`, como já exportou
   para as 1 553 que o têm. É trabalho do motor.
4. **Cinquenta entradas ficam sem nome nenhum por edição** (26 no índice, 24 nas
   páginas de área), e é o desenho: são as derivadas, que não têm fonte nem
   documento, e as quatro cujo único título de documento é o próprio marcador.
   Compor-lhes um nome era escrever conteúdo que ninguém publicou.
5. **`Masthead.astro` não foi tocado**, e a razão está na §2.4: as três contagens
   que a auditoria nomeia são o cabeçalho da página `/livro-razao`, não o do
   sítio. As do `Masthead` saíram a 16.08.2026.
6. **Sem guião, a busca do índice não filtra** (§2.3). Leva ao índice inteiro e
   serve de marco de busca; filtrar sem guião pedia uma página por pergunta num
   sítio estático.
7. **As datas ISO que ficam, e são de duas famílias.** As que estão DENTRO de uma
   frase transcrita (uma nota do registo da agenda, o motivo de uma correção)
   ficam como a fonte as escreveu, porque a casa não edita o que transcreve; e as
   dos documentos alojados e das páginas de leitura ficam porque o brief §2 as
   põe fora do âmbito. A régua conta as duas famílias à parte, e não as soma ao
   zero.
8. **`tests/linha/recibo.mjs` mudou com a forma, e não corre no `verify`.** A
   célula 3b julgava a ordem dos campos marcados da linha-espécime contra a
   cadeia `id,unit,source,access_date`; com o nome à cabeça e a data noutra
   marca, essa cadeia deixou de ser a ordem. A célula passa a aceitar um nome à
   frente (`name` ou `document.title`) e a contar a data pela marca nova. **A
   régua continua fora do `verify`**, como estava: metê-la lá é outro bloco, e
   fica dito para que a mudança não passe por esquecimento.

## 6 · O que se entrega

| o quê | onde |
| --- | --- |
| a escada dos nomes | `src/lib/nomes.mjs`, `src/components/NomeDaMedida.astro` |
| a regra da data, declarada | `src/lib/datas.mjs` (`eCampoDeData`), e as três cópias locais nos portões |
| a busca do índice | `src/views/LivroView.astro`, `public/js/livro.js`, `src/styles/linha.css` |
| o índice da busca | `src/lib/indice-da-busca.mjs`, `src/pages/dados/livro-indice.{pt,en}.json.js` (146 KB por edição) |
| a data do repositório | `src/lib/datas-do-repositorio.mjs`, o motivo `data-do-repositorio` em `ledger/allowlist.yml`, o `fetch-depth: 0` em `.github/workflows/portao.yml` |
| a régua do bloco | `tests/livro/indice.mjs`, corrida no `verify` como `check:indice --navegador` |
| as sete plantas | `design/especime-v3/medicoes/nomes-plantas.py`, que EXIGE a célula de cada uma e sai com 1 quando ela não acende |
| as capturas | `design/especime-v3/capturas/nomes-2026-09-04/`, **40 PNG** (escala 2, 390 × 664 e 1 280, as duas edições do índice, de uma área, do índice das áreas, de uma linha, de uma unidade da Carta e, desde a segunda passagem, do arquivo, que é onde a decisão das datas se vê). A linha capturada é a do endereço mais longo, `pib-pc-acores-2024`, que é onde o item 7 se vê |
| as chaves novas, PT e EN | `design/especime-v3/CHAVES-EN.md`, secção do bloco F1.4 |
| as dezasseis cadeias novas do inventário | `design/especime-v3/INVENTARIO-FRASES.md`, bloco `nomes`, com a entrada em `critica/REVISOES-DO-INVENTARIO.md`; a marca `data-voz` em `scripts/medir-defeitos.mjs` |

**A §1.98 chegou a meio do bloco e mudou uma decisão que já estava tomada.** O
item 5 tinha a definição escrita, com a chave, a classe da folha e as duas linhas
do inventário; o vocabulário fechado tirou a palavra e as quatro coisas saíram
com ela. Fica dito aqui porque quem ler o diff vai ver a definição a entrar e a
sair no mesmo ramo, e a razão não está no código: está na decisão.

## 7 · A cabeça e a corrida

**`56cf933f`, verde na corrida `portao` n.º 33825298246.** É a cabeça deste ramo
depois de fundir `0b51016d`, e os três comandos correram sobre a árvore dela
antes do empurrão, com os códigos lidos dos registos:

| comando | código |
| --- | --- |
| `npm run build` | **0** |
| `npm run verify` | **0** (inclui a `check:indice`, a régua deste bloco) |
| `npm run typecheck` | **0** |

Uma corrida anterior, a 33824217134 sobre `e0c367ed`, foi CANCELADA pela regra de
concorrência do próprio portão quando o empurrão da fusão chegou: não caiu, foi
substituída pela corrida da cabeça que se vai fundir, que é a que conta.

*Esta secção é ela própria um commit, e por isso a cabeça que ele faz não é a que
está escrita acima: é a mesma disciplina que o bloco F1.8 seguiu em `86632082`.
Os três comandos correram outra vez sobre a árvore deste commit antes do
empurrão, e a corrida dele fica no registo do ramo.*

## 8 · A leitura a frio

**A leitura a frio deste bloco ainda não correu**, e a entrada do inventário
di-lo por escrito («por ler»). É a régua que fecha o que ela fecharia sozinha, e
não a substitui.

---

# Segunda passagem · a leitura a frio do Codex (04.09.2026)

*A leitura está em `design/especime-v3/critica/2026-09-04-codex-leitura-f14-nomes.md`,
com a triagem do lugar de direção na cabeça. O leitor viu as cinco plantas das
três classes (5 de 5) e escreveu treze achados. Esta secção diz o que cada um
passou a ser. Sem travessões na prosa.*

## 9 · Os treze achados, um a um

| # | achado | o que ficou |
| --- | --- | --- |
| B1, B2, B3 | do pacote (o HTML entregue não vinha da fonte entregue; a régua com o `Z` na data) | eram as plantas: apanhadas, e é o que elas existem para fazer |
| **B4** | a régua conferia que o nome rendido está NO ficheiro, e não que é o nome DAQUELA linha | a marca do nome passa a dizer de que linha ele é (`data-de-linha`), e `scripts/medir-defeitos.mjs` compara o par; a régua tem a sua própria escada e compara entrada a entrada |
| M5 | só duas das três contagens levam denominador | fica como está: o total é o denominador de si próprio (triagem) |
| **M6** | a busca cobria 149 linhas e não 2 916 | um índice compacto por edição, gerado da construção, que o guião carrega; os resultados são portas para as páginas das linhas |
| M7 | o marcador dentro do selo | fica como está: é texto da ligação da linha, e a régua di-lo (triagem) |
| M8 | «peça» fora de `/areas` | é do bloco F1.10 (triagem) |
| **M9** | o título do documento era ligação num sítio e texto morto no outro | é ligação nos dois, e o portão EXIGE a âncora quando a linha declara `document.url` |
| **M10** | a conta dos estudos discordava de si própria; a régua contava só o marcador da data | a conta diz-se uma vez, medida; a régua conta todos os marcadores da linha de cada trabalho |
| **M11** | o inventário da voz não tinha o rótulo da busca nem os sufixos da contagem das áreas | a marca `data-voz` recolhe-os, e as catorze cadeias estão declaradas |
| **M12** | o corredor das plantas imprimia, não exigia; as células do navegador fora do `verify` | o corredor exige a célula de cada planta e sai com 1; as duas células do navegador correm no `verify` |
| **M13** | as réguas passavam os equivalentes semânticos | seis peneiras novas, e três plantas novas que as provam |
| decisão | as datas de publicação dos trabalhos | a data em que o ficheiro da edição entrou neste repositório, dita com essa origem |

## 10 · O que a segunda passagem construiu

### 10.1 · A busca cobre o livro-razão inteiro (M6)

`src/lib/indice-da-busca.mjs` escreve, na construção, um índice por edição em
`/dados/livro-indice.<edição>.json`. Por linha: o identificador, o nome (a escada
do `src/lib/nomes.mjs`), a fonte e o concelho. **Nenhum valor**: um número entra
numa página por `<Claim/>`, com o seu selo, e quem quer o número abre a linha,
que é o que o resultado abre.

**O TAMANHO, MEDIDO:** `livro-indice.pt.json` tem **150 070 bytes (146,6 KB)** e
`livro-indice.en.json` **149 824 (146,3 KB)**, com 2 916 entradas cada. As mesmas
2 916 linhas com os três textos e a cadeia de busca escritos por extenso pesam
**966 546 bytes**, seis vezes e meia: os três campos passam por dicionário e cada
linha guarda três índices. Medido: **75 nomes distintos** cobrem 2 583 linhas (o
mais repetido é o nome de 614), **19 fontes** cobrem 2 587 (o INE é a de 1 238) e
**307 concelhos** cobrem 2 766. Cada dicionário tem um gémeo já em caixa baixa e
sem acentos, porque a regra da casa é que o guião normaliza só o que o LEITOR
escreve.

**A REGRA QUE ISTO QUEBRA, DITA ONDE ELA VIVE.** `public/js/livro.js` é o único
guião deste sítio que escreve texto visível; os outros três podem trocar `hidden`
e mais nada (resposta 3 da direção, 20.08.2026). Quebra-se pela decisão do F1.10
(«uma coisa, um lugar»), e com três amarras escritas no topo do ficheiro: nada é
composto no cliente (cada cadeia vem do índice, por `textContent`), o índice não
leva um valor, e não se escreve nenhuma contagem de resultados (quando há mais do
que os que cabem, acende-se uma frase declarada). A alternativa era pôr 2 916
entradas escondidas no documento, e são cerca de 350 KB de HTML em cada visita.

**SEM GUIÃO a página é a que era:** as 149 linhas gerais, inteiras, com a porta
para a coleção dos concelhos por cima delas.

### 10.2 · As datas dos trabalhos (a decisão)

A data de publicação de uma edição passa a ser **o dia em que o ficheiro
`studies-src/<slug>/<lang>.html` entrou neste repositório**, lido na construção
com `git log --diff-filter=A --format=%ad --date=short`. A página escreve
«publicado a dd.mm.aaaa», com a preposição fora da marca (para o inventário da
voz a poder declarar) e a data dentro de
`data-nonledger="data-do-repositorio"`, cujo motivo em `ledger/allowlist.yml` diz
de onde ela vem.

| | antes | depois |
| --- | --- | --- |
| edições com data à vista | 3 de 16 | **16 de 16** |
| marcadores no índice do arquivo | 13 | **1** (a descrição que falta a «Onde está a água?») |

**UM VALOR MUDOU, E FICA DITO.** «Évora — Prometido, Pago, Auditado 2026»
mostrava 04.08.2026, que era o campo `date` do arquivo; passa a mostrar
15.08.2026, que é o dia em que o ficheiro entrou no repositório. Não é a mesma
coisa dita de outra maneira: é outro facto, e é o que a página agora nomeia. O
`date` de `src/data/studies.mjs` fica onde está e deixa de chegar à superfície,
porque o próprio ficheiro escreve no cabeçalho que **nenhuma data de publicação
está confirmada**. Se a direção quiser publicar as datas verdadeiras, elas voltam
por `date` com a sua própria origem, e esta sai.

**O `fetch-depth: 0` DO PORTÃO.** O `actions/checkout` traz um só commit por
omissão; com essa cópia o `git log` devolve vazio e as dezasseis edições voltavam
ao marcador **sem erro nenhum**. O `.github/workflows/portao.yml` passa a pedir a
história inteira, com a razão escrita ao lado. E há duas redes por baixo: o
portão de HTML fecha a construção quando um motivo declarado não se rende em
página nenhuma (foi ele que apanhou a primeira versão desta leitura, que devolvia
`null` por causa de um `import.meta.url` empacotado), e a célula I9 da régua refaz
o `git log` por conta própria e compara-o com o que a página imprimiu.

### 10.3 · G1 a G12, remedidos

| # | segunda passagem |
| --- | --- |
| G1 | **0** entradas pelo identificador; 460 com nome; 560 identificadores em metadado; e cada nome é agora conferido contra a SUA linha, nas duas contas (a marca `data-de-linha` na régua da voz, a escada refeita na régua do bloco) |
| G2 | **0** datas fora da forma da casa como valor e **0** em prosa por marcar; 918 dentro de texto transcrito e 193 em documentos alojados. A régua passou a apanhar `12/08/2026` e `2026/08/12` |
| G3 | 1 campo por edição, num `<form method="get">` cujo destino EXISTE em `dist/`; **5 832 entradas** nos dois ficheiros do índice, 2 916 por edição, cada uma com página e com o nome da sua linha |
| G3b | no navegador, nas DUAS edições: 149 entradas no documento · por nome 1 · **por concelho 9** · por fonte 46 · sem resultado 0, com o estado vazio aceso |
| G4 | **0** ocorrências no rótulo da contagem; 16 noutras páginas, que são do F1.10 |
| G5 | 2 de 2 parcelas com denominador (o total é o denominador de si próprio) |
| G6 | 421 ligações do marcador por edição, uma página cada; 78 dentro de um selo |
| G7 | **0 px** de transbordo a 390, em 60 páginas de linha (as 10 do endereço mais longo e 50 a passo fixo) |
| G8 | 58 páginas com a frase, sem uma linha que não seja a da Carta e **sem um algarismo fora de origem declarada** |
| G9 | 24 linhas de trabalho, **2 marcadores ao todo** (era 20), nenhuma com dois; **16 edições com a data do repositório conferida contra o `git`**, 0 sem história |
| G10 | 2 916 linhas citadas em **31 244 ocorrências**, 16 motivos; a comparação passou a ser de valores e de contagens, e não de presença de chaves |
| G11 | `build` 0 · `verify` 0 (com as duas células do navegador lá dentro) · `typecheck` 0 |
| G12 | **7 plantas, 7 vermelhas na célula certa**, e o corredor sai com 1 quando não acontece |

### 10.4 · As sete plantas, com a saída do corredor

```
  (sem planta)     código=0  células vermelhas=[]
  slug             código=1  células vermelhas=['I1']  esperada=I1
  data             código=1  células vermelhas=['I2']  esperada=I2
  forma            código=1  células vermelhas=['I3']  esperada=I3
  marcador         código=1  células vermelhas=['I6']  esperada=I6
  nome-trocado     código=1  células vermelhas=['I1']  esperada=I1
  data-barras      código=1  células vermelhas=['I2']  esperada=I2
  destino-morto    código=1  células vermelhas=['I3']  esperada=I3

  ✓ a construção limpa é verde e as 7 plantas acendem cada uma a sua célula.
```

As três últimas são os equivalentes semânticos que a leitura a frio disse que
passavam: o nome de OUTRA linha (as duas cadeias continuam a ser nomes legítimos
do sítio), a mesma data noutra grafia, e um destino de formulário para uma página
que não existe.

### 10.5 · A marca `data-voz`, e porque ela só alarga

O inventário da voz não tinha o rótulo da busca nem os sufixos da contagem das
áreas, e **não os podia ter**: um `<label>` não é um bloco para a régua, e um
texto todo dentro de um `<a>` é um destino e não uma frase. Declarar uma linha
que a régua não vê fecha a construção pelo outro lado («viva que não se rende»).

`data-voz` diz «este texto é prosa da casa, recolhe-o onde quer que esteja». É a
única marca deste sítio que só ALARGA a peneira: não dispensa nada, não esconde
nada, e uma marca a mais só pode pôr mais texto por classificar. Esta passagem
escreveu **catorze linhas** no inventário (doze cadeias novas e duas reescritas,
porque o alcance da busca mudou e a frase do estado vazio dizia o alcance
antigo), e o bloco `nomes` tem agora dezasseis. A régua da voz passou de 802 para
**816 frases distintas**, com «nada por classificar» e autorreferência 0.

### 10.6 · A cabeça e a corrida da segunda passagem

**`cad7dc29`, verde na corrida `portao` n.º 33833716703**, das 03:34:46 às
03:55:16 UTC de 04.09.2026. Não houve fusão a fazer: `origin/main` continua em
`0b51016d`, que já entrou neste ramo na primeira passagem (`56cf933f`).

| comando | código |
| --- | --- |
| `npm run build` | **0** |
| `npm run verify` | **0** (com a `check:indice --navegador` lá dentro, as dez células) |
| `npm run typecheck` | **0** |

Os três códigos foram lidos dos ficheiros de registo de cada comando, e não do
que o terminal disse.

**A corrida do portão é a prova de que o `fetch-depth: 0` funciona**, e não uma
formalidade: sem história o `git log` devolve vazio, as dezasseis edições voltam
ao marcador, e o portão de HTML fecha a construção porque o motivo
`data-do-repositorio` fica declarado sem se render em página nenhuma. Verde na CI
quer dizer que a data saiu do `git` lá dentro.

**A corrida leva 20m30s, contra um tecto de 30 minutos** no
`.github/workflows/portao.yml`. Não é uma regressão desta passagem (as duas
corridas anteriores deste ramo levaram 22m34s e 19m45s, já com a régua da moldura
a abrir o navegador), mas o tecto tem menos folga do que parece, e as duas
células novas do navegador correm agora lá dentro.

*Esta secção é ela própria um commit, e por isso a cabeça que ele faz não é a que
está escrita acima: é a mesma disciplina que a §7 seguiu na primeira passagem. Os
três comandos correram outra vez sobre a árvore dele antes do empurrão, e a
corrida dele fica no registo do ramo.*

### 10.7 · O que continua por fazer

1. **O «peça» das outras dezasseis ocorrências** (o Método, o Sobre, três
   documentos alojados) é do bloco F1.10, e a régua conta-as à parte para que não
   fiquem em silêncio.
2. **As datas verdadeiras de publicação dos trabalhos** continuam por confirmar:
   o que a página diz agora é o dia em que o ficheiro entrou no repositório, e
   di-lo com esse nome.
3. **A ronda de leitores (F1.3)** não aconteceu.
4. **A leitura a frio desta segunda passagem** ainda não correu.
