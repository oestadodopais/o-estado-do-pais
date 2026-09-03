# F1.1 · a porta da frente · relatório do construtor

*Ramo `porta-2026-09-03`, tirado de `origin/main` em `d8b14a88`. Construtor Claude
Opus 5, 03.09.2026. O bloco é o F1.1 do
`design/observatorio/PLANO-fiabilidade-2026-09-02.md` §3, com o brief
`design/observatorio/BRIEF-F1.1-porta-da-frente.md`. Sem travessões na prosa.*

## 1 · O resultado, em cinco linhas

*Segunda passagem, 03.09.2026, depois da leitura a frio do Codex
(`design/especime-v3/critica/2026-09-03-codex-leitura-f11-porta.md`: cinco plantas
de três classes, **5 de 5 vistas**, dez achados distintos). Quatro dos dez eram as
plantas e não estão neste ramo; conferido antes de mexer em nada, e a §16 imprime
o comando de cada um. Os outros seis são reais e estão consertados abaixo.*

As doze medidas de aceitação de A1 a A12 estão verdes nas duas edições, medidas
por uma régua nova (`tests/inicio/porta.mjs`) que corre sobre o `dist/` servido em
local. **Os sete estragos plantados de A17** foram vistos vermelhos e depois
verdes; eram cinco na primeira passagem, e os dois novos são os que a leitura a
frio mostrou que nenhuma célula recusava.

**A 390 × 664 o primeiro cartão acabava a 726,7 px e acaba a 653,7 px**, com a
porta do concelho pelo meio, que antes não existia. A primeira página encolheu
32 px no telemóvel (6 941 → 6 909) e os 21 valores dos dois quadros da União
passaram a aparecer **uma vez** em vez de duas. A mobília por baixo do nome
passou de **três filas físicas** a uma.

**Nenhum número novo do livro-razão entrou no sítio, e os que entraram são de
outras duas classes, cada um com a sua origem declarada.** A prova conta agora as
quatro maneiras que a casa tem de pôr um algarismo numa página, e não só uma: nas
duas páginas deste bloco, os identificadores de linha ficam nos mesmos 22, as
chaves da prova nas mesmas 11, e entram `data-nonledger="numeracao"` (a posição de
cada cartão) e duas transcrições conferidas (a designação e o identificador do
documento da Comissão). A §6 imprime as quatro colunas.

**Onze réguas da casa foram reescritas para a forma decidida**, nenhuma
desligada, e a §7 diz célula a célula o que cada uma media e o que passa a medir.

**Duas coisas ficaram por fazer**, e a §9 escreve-as com a razão: as duas frases
de contexto são um rascunho da casa e esperam as palavras do diretor; e a posição
«1 de 21» não se rende nas faixas da região e do concelho. A terceira da primeira
passagem, a lista dos 29 nomes por baixo do mapa, é decisão do diretor pelo
`BRIEF-forma-dos-dominios.md` §4 e fica com a medição que a forçou.

## 2 · As medidas de aceitação, de partida e de chegada

Tudo medido com a mesma régua, `tests/inicio/porta.mjs`, sobre duas construções: a
da árvore de partida (`d8b14a88`, guardada à parte e lida com `OEDP_DIST`) e a
desta. O comando é o mesmo nas duas leituras, e **as duas saídas estão no
repositório**, para que ninguém tenha de acreditar na tabela:

```
OEDP_DIST=<a construção de partida> node tests/inicio/porta.mjs \
  --json design/especime-v3/medicoes/porta-medidas-antes.json     → saída 1 · 4 de 24
node tests/inicio/porta.mjs \
  --json design/especime-v3/medicoes/porta-medidas-depois.json    → saída 0 · 24 de 24
```

| # | medida | antes (`d8b14a88`) | depois | estado |
| --- | --- | --- | --- | --- |
| A1 pt | 390 × 664: nome, manchete, cartão, selo e porta do concelho sem gesto, **e o selo nos 21 cartões** | cartão até 726,7 px, selo até 714,3 px, **porta não existe**; 21 cartões, 0 sem selo | tudo dentro: nome 97,4 · manchete 328,3 · **porta 477,7** · cartão 653,7 · selo 641,3; 21 cartões, 0 sem selo | ✓ |
| A1 en | o mesmo | cartão 710,9 · selo 698,5 · porta não existe | nome 97,4 · manchete 297,0 · porta 446,3 · cartão 641,1 · selo 628,7 | ✓ |
| A2 pt | altura de `/` a 390, **contra o teto medido na partida** | **6 941 px** (o teto) | **6 909 px** (menos 32) | ✓ |
| A2 en | altura de `/en` a 390 | 6 890 px | 6 861 px (menos 29) | ✓ |
| A3 pt | os 21 valores selados uma só vez | **21 de 21 a duplicar** | 0 fora da conta | ✓ |
| A3 en | o mesmo | 21 de 21 a duplicar | 0 fora da conta | ✓ |
| A4 | «Comissão Europeia» / «European Commission» **em cada uma das duas frases** | **0 frases de contexto** na página | 2 frases, 0 sem a Comissão, nas duas edições | ✓ |
| A5 pt/en | as 29 unidades com nome visível e alvo ≥ 44 px **a 390 e a 768** | a 390: 29 com caixa e **29 invisíveis** (dentro da gaveta fechada) | a 390 e a 768: 29 visíveis, 0 invisíveis, 0 fora do alvo | ✓ |
| A6 | «Âmbito» e «Densidade» (e «Scope» e «Density») em `/` | 1 + 1 · 1 + 1 | **0 · 0** | ✓ |
| A7 | as duas fichas de «Lagoa», **uma com «Faro» e a outra com «São Miguel»** | «Lagoa» e «Lagoa», **um texto só**, 0 com Faro, 0 com São Miguel | 2 textos distintos, 1 com «Faro», 1 com «São Miguel» | ✓ |
| A8 | `<form>` em `/` com destino que existe | **0 formulários** | 1, `action="/municipios"` (200), `method="get"`; `/en` → `/en/municipalities` | ✓ |
| A9 | encontrar o concelho em ≤ 2 toques e ≤ 1 ecrã, **com guião e sem ele** | **impossível** nos dois: o campo não é alcançável | **2 toques**, sem rolar, chega a `/municipios/evora`; **sem guião**, o Enter no campo submete para `/municipios?concelho=Évora` | ✓ |
| A10 | «sem limiar» nos cartões e nas peças de `/` | 0 · 0 | 0 · 0 | ✓ (já estava) |
| A11 | a mobília acima do nome ≤ 64 px **e em uma fila física**, e as leituras por baixo do nome em uma fila | **68 px**; a barra em 1 fila; **as leituras em 3 filas, 73 px** | **62 px**; a barra em 1 fila, 54 px; **as leituras em 1 fila, 26,2 px** | ✓ |
| A12 | Regiões, Distritos e Áreas no menu | **faltam as três**, nas duas edições | as três nas duas edições | ✓ |

**A2, A5, A11, A4, A7, A9 e A1 apertaram na segunda passagem**, e cada uma pelo
que a leitura a frio mostrou que ela deixava passar. A tabela acima já é a medida
apertada, medida nos dois lados; a §16 diz, uma a uma, o que cada célula media
antes e o que passou a exigir. Em duas delas a medida de partida MUDOU de leitura
com a célula nova, e as duas ficam ditas: A11 media 68 px de papel acima do nome e
não dizia que a mobília por baixo dele ocupava três filas; A4 contava a cadeia no
documento inteiro, e na árvore de partida não havia frase de contexto nenhuma para
contar.

**A altura ganhou 102 px entre as duas passagens** (6 807 → 6 909), e a razão está
escrita: as frases de contexto passaram a nomear o documento contra o qual os
valores foram confirmados (Blocking 6), e o cabeçalho do painel recebeu de volta o
comando da leitura breve (Minor 10), com o ar que a régua dos alvos exigiu por
cima dele. O teto continua a ser o «hoje» da árvore de partida, 6 941 px, e a
régua recusa acima dele.

**A5 estava a dar um verde falso na régua da primeira redação, e o achado fica
escrito porque ele vale para toda a casa.** Num Chromium 148 o conteúdo de um
`<details>` FECHADO continua a ter caixa: os 29 nomes davam 54,1 × 44 px com a
gaveta fechada, porque a implementação nova esconde o conteúdo por
`content-visibility` e não por `display`. Uma célula que medisse caixas dizia «29
nomes com alvo» sobre uma lista que o leitor não vê. A régua passou a perguntar
`checkVisibility({ contentVisibilityAuto: true })`, e a leitura de partida ficou
vermelha, que é o que ela devia ter estado desde o princípio. A mesma correção
entrou na `F10b` de `tests/inicio/faixa.mjs`, que media o mesmo estado da mesma
maneira.

## 3 · O que se construiu, item a item do brief §1

**1 · A frase de contexto por painel.** Duas frases, uma por painel, impressas
uma vez antes dos cartões, declaradas em `CONTEXTO_DOS_PAINEIS`
(`src/data/figuras.mjs`) na forma que o F0.9 fixou. O cabeçalho da constante
escreve, afirmação a afirmação, a origem de cada uma com o comando que a
confirma; a §5 deste relatório repete-a. Nenhuma fala da casa nem de confiança, e
nenhuma traz um algarismo.

**2 · A faixa impressa uma vez.** O valor de cada medida saiu da peça do painel
(`Peca.astro`, propriedade `valor`) e da linha do Painel Social
(`ListaSocial.astro`), e fica no cartão da faixa, que é a porta que leva o leitor
à leitura. O painel de baixo continua a ser a leitura breve: a palavra do estado,
o limiar publicado e de que lado dele o valor está, o nome, a unidade, a
definição, a régua e o recibo. `Peca.astro` recebe a propriedade e não a regra:
`MunicipioView` e `RegiaoView` não a passam e ficam como estavam, porque as suas
faixas são do F1.2.

**3 · A porta para o concelho no primeiro ecrã.** A busca dos 308 saiu da gaveta
ao lado do mapa e subiu para debaixo da manchete, por uma ranhura nova de
`Cabeca.astro` (`porta`). É o campo e não uma ligação, por uma razão medida: a
tarefa (a) da ronda tem de caber em dois toques, e uma ligação que leva ao campo
gasta o primeiro deles a chegar ao sítio onde a tarefa começa.

**4 · O mapa com os nomes ao lado, abertos.** A gaveta dos nomes chega aberta
(`Gaveta.astro`, propriedade `aberta`), com os 29 visíveis e cada um com o seu
alvo de 44 px abaixo de 1024. Continua a ser uma gaveta e continua a fechar sem
guião. **Onde ela ficou não é onde o brief a pedia**, e a §9 escreve a medição que
o obrigou.

**5 · «1 de 21» e o separador.** A posição vai em CADA cartão, na fila que a
palavra de estado já ocupava, e por isso não custa uma fila ao cartão. Vai em cada
cartão e não numa linha por cima da faixa porque uma linha única teria de mudar de
algarismo enquanto o leitor rola, e o guião desta página não compõe números:
escrita em cada cartão é sempre verdadeira, e é verdadeira sem guião nenhum. Os
dois algarismos são `data-nonledger="numeracao"`, que é o motivo do registo para a
numeração de secções e de instrumentos; o total é o comprimento da lista que a
faixa rende, contado uma vez na vista. O separador entre os dois painéis é um
`<hr class="paineis-separador">`, porque é uma separação estrutural e não
decoração.

**6 · «Âmbito» e «Densidade» fora da página.** A linha de comando saiu inteira. O
âmbito vive no menu (item 11); a densidade vive no cabeçalho do painel, que é onde
o `BRIEF-forma-dos-dominios.md` §4 a manda estar, com as duas palavras que a casa
já tem («Relance» e «Leitura breve») e sem a palavra que nomeava o comando. **Na
primeira passagem ela não voltou**, e o Minor 10 da leitura a frio apanhou-o: o
comando global desaparecera e com ele a maneira de abrir as treze de uma vez. A
§11a diz o que ele faz e o que acontece sem guião. O estado `?densidade=leitura` continua a resolver, que é o que a
Emenda 7 exige de um endereço partilhável; o que desapareceu foi a maneira de o
escrever a partir da página. Os dois campos do reencaminhamento das regiões
desceram do comando para a raiz do estado, `[data-inicio]`, e
`public/js/inicio.js` lê-os de lá quando o comando não existe.

**7 · O distrito na ficha das duas Lagoas.** `Pesquisa.astro` escreve o distrito
só onde o nome se repete, que é a mesma regra de `coberturaDistingue()`: uma
etiqueta desenha-se quando há outra de que se distinga. A palavra é a da Carta,
pela regra da I18 que a casa já tinha (`eIlha()`), e vai marcada `data-lugar`.

**8 · «sem limiar» fora dos cartões dos concelhos.** Já estava a zero na árvore de
partida, e continua: os oito cartões do Painel Social não levam palavra de estado
porque o quadro não publica limiar nenhum, e as treze peças do Procedimento têm
todas limiar.

**9 · O selo fora da frase da manchete dos concelhos.** Nada a fazer neste bloco:
a manchete dos concelhos é da `MunicipioView`, que é do F1.2 e não se toca. **A
conferência que o brief pede está feita**: a manchete dos 308 diz a população, e o
número dela resolve numa linha do livro-razão. O portão de HTML confere as 7 234
páginas e passa a 0, e a contagem de identificadores da §6 mostra que nenhum
identificador entrou nem saiu.

**10 · A mobília reduzida a uma linha no telemóvel.** Abaixo de 641 px a mobília
mostra uma das três leituras, a data em que o painel europeu foi reconferido, que
é a que governa os números desta página. A agenda sai porque o próprio achado D6 o
pede («a contagem da agenda repete-se em dezassete sítios») e a sua página está no
menu; o sinal das fontes sai porque a regra dele vive em `/metodo#releitura`, que
o menu alcança. **Saem do telemóvel e não do sítio**: a partir de 641 px as três
voltam, com as mesmas cadeias e as mesmas portas, e nenhuma sai do documento em
largura nenhuma.

**11 · Regiões, Distritos e Áreas no menu.** A fila do menu passa de oito a onze
posições, e a §1.51 fica emendada com a razão escrita no `Masthead.astro`: a fila
era de oito porque o sítio tinha oito índices, e passou a ter onze.

**12 · A busca como `<form>` com destino.** `<form action="/municipios"
method="get">`, com um botão de submissão a sério. Sem guião, escrever e submeter
leva ao índice dos 308, que existe e é a página que responde à mesma pergunta. Com
guião, a fila de resultados acende-se e filtra, como sempre fez.

**13 · «308 ■ fonte» com substantivo.** Já estava: a legenda do mapa lê-se «308
concelhos · CAOP 2025 ■ fonte» desde a Emenda 17, e o substantivo está na cadeia
`inicio.mapa.linha`. Conferido no HTML construído e não presumido.

**14 · A coluna direita vazia a 1 280 antes do mapa.** Fechada, e medida por
`tests/inicio/lista.mjs` L11 e L13: o mapa vai do topo da manchete ao fundo da
legenda, com 0,0 px de ar vertical dentro da caixa, e a folga da grelha contra a
coluna do mapa está dentro do limite de 60 px que a régua fixa.

**15 · A régua da casa a medir também 390 × 664.** A régua nova mede A1, A9 e A11
a 390 × 664, que é o telemóvel pequeno, e as capturas incluem essa altura nas duas
edições.

## 4 · As cadeias novas, com a chave e a origem de cada facto

Quatro cadeias visíveis novas em `src/i18n/strings.mjs`, todas nas duas edições, e
duas frases em `src/data/figuras.mjs`.

| chave | pt | en | classe | origem |
| --- | --- | --- | --- | --- |
| `nav.regioes` | Regiões | Regions | navegação | o nome da família de páginas que existe desde 28.08.2026 |
| `nav.distritos` | Distritos | Districts | navegação | o mesmo, para os distritos e ilhas da Carta |
| `ambito.pesquisaSubmeter` | Procurar | Search | navegação | o comando do formulário novo |
| `inicio.faixa.de` | « de » | « of » | (não é frase) | o separador de «1 de 21», dentro do `<div class="cartao-topo">`, que a régua da voz não recolhe, como já não recolhia a palavra de estado ao lado |
| `CONTEXTO_DOS_PAINEIS.pdm` | frase do painel do Procedimento | idem | conteúdo | ver abaixo |
| `CONTEXTO_DOS_PAINEIS.social` | frase do Painel Social | idem | conteúdo | ver abaixo |

**As três primeiras entram no inventário da voz?** Não: `nav.regioes` e
`nav.distritos` são texto de âncoras (a régua não recolhe um bloco cujo texto está
todo dentro de um `<a>`), e `pesquisaSubmeter` é o texto de um `<button>`, pela
mesma regra. As quatro cadeias das frases de contexto entram, e entraram: a secção
«Bloco `porta`» do `INVENTARIO-FRASES.md`, com a entrada correspondente em
`critica/REVISOES-DO-INVENTARIO.md`. **Oito linhas passaram a `retirada`** com a
razão escrita: «Portugal · país» e «Portugal · country» (o rótulo saiu da cabeça
do país), «Um concelho pelo nome» e «A municipality by name» (a gaveta da busca
deixou de existir), e as quatro frases de contexto da primeira passagem, que a
segunda reescreveu (Blocking 6). As quatro retiradas novas são sentinelas a sério:
se um verbo que as linhas não sustentam voltar, a construção fecha e diz o nome
dele.

**O comando da leitura breve não traz cadeia nova**: «Relance» e «Leitura breve»
(«At a glance» e «Brief reading») estão declaradas em `strings.mjs` desde a etapa
2 e no inventário da voz desde então, e o texto de um `<button>` não é recolhido
pela régua, pela mesma regra do botão da busca.

### As duas frases, e de onde vem cada afirmação

**Reescritas na segunda passagem** (Blocking 6). A primeira redação dizia «com os
limiares que o Procedimento publica» e «que não publica limiares»: dois verbos que
as linhas não sustentam. Uma nota do livro-razão diz que o limiar É do
Procedimento, não que ele o publica; e a Emenda 16 diz que o Painel Social «não
tem limiares», que é outra coisa de «não publica limiares». E as duas deixavam por
dizer contra o QUÊ os valores foram confirmados, quando a nota o nomeia.

> **pt, painel do Procedimento** · «Os indicadores do painel do Procedimento
> relativo aos Desequilíbrios Macroeconómicos, cada um com o limiar do
> Procedimento. Os valores são do Eurostat, confirmados contra o Relatório por
> País 2026 da Comissão Europeia, SWD(2026) 222.»
>
> **pt, Painel Social** · «Os indicadores que o livro-razão guarda e cujo registo
> nomeia o Painel Social Europeu, sem cor porque não tem limiares. Os valores são
> do Eurostat, confirmados contra o Relatório por País 2026 da Comissão Europeia,
> SWD(2026) 222.»
>
> **en, painel do Procedimento** · «The indicators of the Macroeconomic Imbalance
> Procedure scoreboard, each with the threshold of the Procedure. The values are
> from Eurostat, confirmed against the European Commission's country report,
> SWD(2026) 222.»
>
> **en, Painel Social** · «The indicators the ledger holds whose record names the
> European Social Scoreboard, with no colour because it has no thresholds. The
> values are from Eurostat, confirmed against the European Commission's country
> report, SWD(2026) 222.»

| afirmação | onde está escrita | como se confere |
| --- | --- | --- |
| «do painel do Procedimento relativo aos Desequilíbrios Macroeconómicos» | o campo `note` das treze linhas | `grep -l "Limiar do Procedimento" ledger/claims/*.yml` → 13 ficheiros, que são os treze `claim` de `FIGURAS_PDM` |
| «cada um com o limiar do Procedimento» | o mesmo campo `note`, que escreve o limiar e diz de quem ele é: «Limiar do Procedimento relativo aos Desequilíbrios Macroeconómicos: 60%» | a frase diz o que a nota diz, e nada sobre quem o publica |
| «Os valores são do Eurostat» | o campo `source` das 21 linhas | medido: as 21 dizem `Eurostat`, e nenhuma diz outra coisa |
| «confirmados contra o Relatório por País 2026 da Comissão Europeia, SWD(2026) 222» | o campo `note` das 21 linhas: «Valor confirmado contra a Comissão Europeia, SWD(2026) 222 (Relatório por País 2026 — Portugal): \<o valor\>» | as 21 trazem-no; as duas designações entram como transcrições conferidas |
| «os indicadores que o livro-razão guarda e cujo registo nomeia o Painel Social Europeu» | a **Emenda 16, palavra por palavra** (`direcao.md`, 21.08.2026): «com os indicadores que o livro-razão guarda e cujo registo nomeia esse painel» | o registo é `convergence.md` §2, coluna «Social SB», escrito no cabeçalho de `FIGURAS_SOCIAL` |
| «sem cor porque não tem limiares» | a **Emenda 16, palavra por palavra**, como a `DECISIONS.md` a regista (linha 8360): «O Painel Social Europeu entra como lista compacta por baixo, sem cor porque não tem limiares» | é a razão pela qual os oito cartões não levam palavra de estado nem quadrado |

**O QUE SAIU NA SEGUNDA PASSAGEM, E PORQUÊ.** «os limiares que o Procedimento
publica»: quem PUBLICA o limiar não está em linha nenhuma. A explicação do motivo
`limiar-do-quadro` em `ledger/allowlist.yml` diz «fixado no Regulamento (UE)
n.º 1176/2011 e revisto pela Comissão», que não é «o Procedimento publica» — e a
explicação de um motivo do registo não é uma linha nem uma decisão. Quem fixa e
quem revê fica por dizer até haver linha ou decisão que o diga. «que não publica
limiares»: a Emenda 16 diz «não tem limiares», e o `convergence.md` §5 diz «None
fixed anywhere»; nenhum dos dois diz «não publica».

**A POSIÇÃO FACE À MÉDIA DA UNIÃO NÃO ENTROU, e a segunda passagem procurou-a
antes de a recusar.** O brief sugeria-a e mandava-a citar da Emenda 16. A emenda
foi lida por inteiro nos dois sítios onde vive, `DECISIONS.md` (a entrada 16 da
tabela das emendas) e `design/especime-v3/direcao.md` (o texto por extenso), e
**não tem cláusula nenhuma sobre a posição face à média da União**: o que ela diz
do Painel Social é «sem cor porque não tem limiares» e «os indicadores que o
livro-razão guarda e cujo registo nomeia esse painel». O comando da busca, com o
positivo conhecido ao lado:

```
grep -n 'posição na distribuição\|média da União\|posição face' DECISIONS.md design/especime-v3/direcao.md
  → nenhuma ocorrência dentro da Emenda 16 (as três de DECISIONS.md são a tabela
    das frases que o F0.9 retirou, e duas notas de outros blocos)
grep -c 'Painel Social' DECISIONS.md → 3        (o positivo conhecido do comando)
```

E a razão do F0.9 continua de pé por cima dela: nenhuma média da União existe como
linha do livro-razão, e uma comparação contra um valor que a página não tem é a
classe de afirmação que aquele bloco veio tirar. **Uma frase que não está numa
linha nem numa decisão não entra, mesmo quando um brief a sugere.**

**AS DUAS DESIGNAÇÕES DO DOCUMENTO SÃO TRANSCRIÇÕES CONFERIDAS.** «Relatório por
País 2026» e «SWD(2026) 222» são a designação e o identificador de um documento, e
trazem algarismos; nenhum é uma medição. Entram por `data-verbatim`, que é o
mecanismo n.º 2 do cabeçalho de `ledger/allowlist.yml`, e o portão compara o que a
página rende com o que `src/data/verbatim.mjs` regista, carácter a carácter. **Não
se acrescentou um motivo novo à lista de exceções e nenhum motivo existente foi
alargado.** Na edição inglesa a designação não se traduz: a nota do livro-razão é
portuguesa, e escrever um título inglês seria escrever um facto que este bloco não
leu em lado nenhum. A edição inglesa diz o que o documento É, em minúsculas
(«the European Commission's country report»), que é uma descrição e não um título,
com o mesmo identificador ao lado. A assimetria fica dita e não escondida.

## 5 · A tarefa (a) da ronda, toque a toque, com guião e sem ele

Medida a 390 × 664, nas duas edições, pela célula A9 da régua, que faz cliques a
sério e confere que o alvo estava dentro do primeiro ecrã quando o toque
aconteceu. As capturas de cada passo estão em `capturas/porta-2026-09-03/`.

| passo | o que acontece | captura |
| --- | --- | --- |
| 0 | a página chega: o campo da busca está no primeiro ecrã, a 477,7 px do topo | `pt-tarefa-0-chegada.png` |
| 1 | **toque 1** no campo | `pt-tarefa-1-toque-no-campo.png` |
| — | escreve-se «Évora»; a fila de resultados acende-se por baixo do campo | `pt-tarefa-2-escrito.png` |
| 2 | **toque 2** no resultado, que é uma ligação | `pt-tarefa-3-chegou.png` |
| — | chega a `/municipios/evora` (e a `/en/municipalities/evora` na edição inglesa) | |

**E O MESMO SEM GUIÃO NENHUM** (Major 9). A leitura a frio apanhou que a célula
exercitava só o caminho do guião: «A9 exercises the JavaScript autocomplete, not
native form submission». A célula passa a correr também com
`javaScriptEnabled: false`, escreve no campo e carrega em Enter, que é a submissão
que o navegador faz sozinho:

| edição | escreve-se | o navegador leva a | captura |
| --- | --- | --- | --- |
| pt | «Évora» no campo, Enter | `/municipios?concelho=Évora` | `pt-sem-guiao-0-chegada.png`, `pt-sem-guiao-1-submetido.png` |
| en | o mesmo | `/en/municipalities?concelho=Évora` | `en-sem-guiao-0-chegada.png`, `en-sem-guiao-1-submetido.png` |

Na árvore de partida a tarefa não tinha percurso nenhum, nem com guião nem sem
ele: o campo vivia numa gaveta fechada ao lado do mapa, a 1 428 px do topo, e não
havia formulário nenhum na página.

**O que o índice dos 308 faz com `?concelho=` ainda não é nada**, e isso fica dito:
a página que chega é a lista dos 308 por distritos, inteira, que é a resposta à
pergunta «onde está o meu concelho»; o parâmetro viaja e a página ainda não o lê
para pré-preencher a sua própria busca. É trabalho de quem for dono de
`/municipios`, e está aqui escrito e não fingido feito.

## 6 · A prova de que não entrou um número novo (A13), pelas quatro classes

**A primeira passagem contou uma classe só, e a leitura a frio apanhou o buraco**
(Blocking 4): a prova percorria os `data-claim`, que são os valores do
livro-razão, e este bloco acrescentou algarismos visíveis de outras duas classes —
a posição de cada cartão na faixa e as duas designações do documento da Comissão.
São legítimos, cada um com a origem declarada, mas uma prova que não os vê não os
teria apanhado se fossem ilegítimos.

A casa tem quatro maneiras de um algarismo entrar numa página, e a régua nova
(`tests/inicio/numeros-novos.mjs`) conta as quatro. **As duas páginas deste
bloco**, que é onde a comparação é limpa:

```
OEDP_DIST=<a construção de partida> node tests/inicio/numeros-novos.mjs \
  --so index.html,en/index.html --json design/especime-v3/medicoes/porta-numeros-antes.json
node tests/inicio/numeros-novos.mjs \
  --so index.html,en/index.html --json design/especime-v3/medicoes/porta-numeros-depois.json
```

| classe | o que é | antes | depois | o que mudou |
| --- | --- | --- | --- | --- |
| `data-claim` | o valor de uma linha do livro-razão | 22 distintos · 86 ocorrências | **22 distintos** · 44 | **nenhum id entrou nem saiu**; as 42 ocorrências a menos são os 21 valores deixados de render uma segunda vez, nas duas edições |
| `data-prova` | uma contagem do próprio sítio, que o portão reconta | 11 distintas · 26 | **11 distintas** · 26 | nenhuma |
| `data-nonledger` | contexto estrutural, com o motivo em `ledger/allowlist.yml` | 7 motivos · 302 | **8 motivos** · 386 | entra **`numeracao`**, com 84 ocorrências: o ordinal e o total de cada um dos 21 cartões, nas duas edições |
| `data-verbatim` | uma citação transcrita, conferida carácter a carácter | 0 · 0 | **2 chaves** · 6 | entram `relatorio-por-pais-2026` e `swd-2026-222`: quatro spans na edição portuguesa e dois na inglesa |

**Os dois algarismos novos, ditos por extenso.** O ordinal e o total de «1 de 21»
levam `data-nonledger="numeracao"`, que é o motivo do registo para «numeração de
secções e de instrumentos»; nenhum é uma medição de Portugal, e nenhum é escrito à
mão (os dois saem do comprimento da lista que a faixa rende). As duas designações
do documento levam `data-verbatim`, e o portão compara-as com o registo.

**O sítio inteiro, e porque é que essa leitura já não é limpa.** Na árvore fundida
a construção tem 7 238 páginas contra as 7 234 da partida, e a diferença é do
F1.2, que entrou no `main` no mesmo dia com as páginas de domínio: a contagem do
sítio inteiro passa a misturar dois blocos. Fica dita para o registo, com os dois
motivos que aparecem e que **são do F1.2 e não deste bloco** (`ambito-da-medida` e
`data-da-linha`, ausentes das duas páginas deste bloco):

| classe | sítio inteiro, partida | sítio inteiro, fundido |
| --- | --- | --- |
| `data-claim` | 2 916 distintos · 26 314 | 2 916 distintos · 31 244 |
| `data-prova` | 47 · 14 576 | 47 · 14 584 |
| `data-nonledger` | 14 motivos · 59 572 | 16 motivos · 64 742 |
| `data-verbatim` | 4 chaves · 17 | 6 chaves · 23 |

**Nem no sítio inteiro entrou um identificador de linha novo**: 2 916 antes, 2 916
depois, nenhum só de um lado. E o livro-razão está intacto:

```
git diff --stat -- ledger/                    → sem saída
```

## 7 · As réguas da casa: o que cada uma media e o que passa a medir

Nove réguas mudaram. **Nenhuma foi desligada e nenhuma foi enfraquecida sem razão
escrita ao lado da célula**; cada uma leva no código o parágrafo que diz o que
media, porque é que a coisa medida mudou, e o que fica a ser exigido no lugar.

| régua · célula | media antes | passa a medir |
| --- | --- | --- |
| `correcoes-a` A2 | um comando com «País», «Região» e «Concelho» | as quatro camadas do território no menu, um só caminho, e nenhum comando de estado na página |
| `correcoes-a` A1 | «Concelho» revela a pesquisa dentro do ecrã | a busca inteira no primeiro ecrã **sem gesto**, com o campo a receber o foco e o formulário com destino |
| `correcoes-a` A7 | a mobília com **duas** leituras | três leituras no documento e **uma à vista** a 390 (a célula estava vermelha desde 01.09, quando o corredor acrescentou a terceira; a leitura de partida mediu-a vermelha) |
| `faixa` F10a | **duas** gavetas do mapa, **fechadas** | uma gaveta, **aberta**, com os 29 e o alvo da largura, e a busca fora dela |
| `faixa` F10b | a gaveta abre com o guião desligado | chega **aberta**, fecha e volta a abrir sem guião (duas voltas), e a visibilidade pergunta-se ao navegador |
| `faixa` F12 | as três camadas com rótulo declarado | o mesmo, com o rótulo exigido só onde ele separa alguma coisa (região e concelho) |
| `lista` L1 | a lista **antes** do mapa no documento | a lista **depois** dele, com a ordem do documento igual à do ecrã |
| `lista` L2 | a coluna das duas gavetas ao lado do mapa | a legenda do mapa na banda da cabeça (a exigência «ao lado» fica a 1280 e a 1440, onde ela vale) |
| `lista` L9 | duas formas: rede em linha abaixo de 1024, coluna acima | uma forma só, a rede em linha, em todas as larguras |
| `lista` L12 | a legenda **por baixo** dos nomes | a legenda **por cima** da banda dos nomes, alinhada com ela |
| `mapa-navegacao` N3 (com guião) | «Concelho» abre a pesquisa | a busca à vista sem gesto, campo alcançável, formulário com destino |
| `mapa-navegacao` N3 (sem guião) | os comandos são ligações para páginas que existem | a busca é um formulário com destino, e o destino responde 200 |
| `areas` M6 | «Áreas» no comando e no rodapé | «Áreas» no **menu** e no rodapé |
| `matriz` ordem do teclado | comando → painel → portas | porta do concelho → painel → portas |
| `matriz` mudanças de estado | dois cliques em comandos | os estados resolvem-se pelo **endereço**, e a página não tem comando de estado nenhum |
| `matriz` densidade global | o comando global abre as treze | o endereço `?densidade=leitura` abre as treze |
| `matriz` caixa vazia | a caixa vazia mostra os concelhos com página | a caixa vazia **não mostra nada** |
| `matriz` 2i·5 | o espaço activa os comandos de âmbito e de densidade | o espaço abre a peça e não rola, e o que activa é um comando a sério (`<button>`, `<summary>`), com zero ligações a fingir de botão |
| `matriz` 2i·1 | o `href` do comando «Região» | o índice das regiões na raiz do estado e no menu |
| `matriz` 2l lista social | oito linhas com oito valores | oito linhas **sem o valor repetido**, com o selo de 44 px |
| `matriz` 2m | a gaveta da busca abre por baixo do mapa | a busca está à vista e o mapa fica onde estava |
| `ListaDosNomes` (folha) | o par de estado enraizado em `.cabeca-grelha` | enraizado em `:root`, porque a lista saiu da grelha |
| `porta` A1, A2, A4, A5, A7, A9, A11 | ver a §16: sete células apertadas na segunda passagem | ver a §16 |
| `numeros-novos` (régua nova) | — | o inventário dos algarismos de uma construção, pelas quatro classes (§6) |

**A caixa vazia, e porque é que isto é uma correção e não uma perda.** A regra de
2026-08 era «com a caixa vazia mostram-se os concelhos que têm página, hoje um,
Évora», e a nota ao lado dela, em `public/js/inicio.js`, dizia porquê: «uma
pesquisa que abre com oito nomes que ninguém pediu diz que aqueles oito são
especiais, e não são: são os primeiros da Carta». Com os 308 construídos a
condição «tem página» deixou de separar seja o que for, e a caixa vazia passou a
mostrar exactamente esses oito primeiros, que é o que a nota proibia. Com a busca
no primeiro ecrã custava também 168 px a quem não pediu nada. `/municipios` e
`/livro-razao/concelhos` ficam como estavam, e a razão está no guião: lá a fila
abre por baixo de uma lista dos 308 que já está na página.

## 8 · Os estragos plantados (A17), vermelhos e depois verdes

`node tests/inicio/porta.mjs --vermelhos`, saída **0**. Cada planta exige três
coisas, como as réguas da casa: **verde antes** (as células que ela nomeia passam
sem ela), **o HTML mudou** (a transformação dá bytes diferentes) e **vermelho
depois** (TODAS as células nomeadas caem, e não só uma).

**Eram cinco na primeira passagem e são sete**, e os dois novos são exactamente os
casos que a leitura a frio mostrou que nenhuma célula recusava (Major 8 e 9). Duas
das cinco antigas mudaram de alvo pela mesma razão.

| planta | células | verde antes | html mudou | vermelho depois |
| --- | --- | --- | --- | --- |
| um cartão sem selo · **o ÚLTIMO, e não o primeiro** | A1.pt | sim | sim | A1.pt vermelho |
| um segundo cartão com o mesmo valor (a cópia) | A3.pt | sim | sim | A3.pt vermelho |
| **a frase do Procedimento** sem «Comissão Europeia», deixando-a na outra frase | A4.pt, A4.en | sim | sim | as duas vermelhas |
| a busca sem `action` | A8.pt, A8.en, **A9.pt, A9.en** | sim | sim | as quatro vermelhas |
| uma unidade do mapa sem nome | A5.pt, A5.en | sim | sim | as duas vermelhas |
| **a página mais alta do que a árvore de partida** (mil píxeis no fim do corpo) | A2.pt, A2.en | sim | sim | as duas vermelhas |
| **a mobília do menu em duas filas**, sem lhe mudar a altura acima do nome | A11.pt, A11.en | sim | sim | as duas vermelhas |

**O que cada mudança prova.** O selo do ÚLTIMO cartão: a primeira redação media o
primeiro, e a leitura a frio mostrou que tirar o selo de um cartão de trás
passava. A Comissão só na frase do Procedimento: a célula contava a cadeia no
documento inteiro, e a planta P1 da própria leitura provou-o — a frase perdeu a
Comissão na fonte e a célula ficou verde, porque a outra frase ainda a tinha. A
busca sem `action` a nomear também a A9: sem `action` a submissão nativa volta
para a própria página e o percurso sem guião morre, e só a A8 o via. A página mais
alta: a A2 só exigia um número, e a planta P3 mostrou que o relatório e a régua
podiam dizer valores diferentes sem nada cair. A mobília em duas filas: a A11 media
píxeis acima do nome e não dizia se a barra é uma linha.

Reposta a construção, as 24 células voltam a verde:
`porta ✓ 24 de 24 célula(s) · plantas ✓`.

## 9 · O que ficou por fazer, e porquê

**1 · As duas frases de contexto são um rascunho da casa.** O plano §7 dá-as como
texto do diretor; ele não as escreveu e mandou não perguntar. Ficam escritas só
com factos que uma linha do livro-razão ou uma decisão registada já contém (§4). O
«porquê estes oito» não entra em nenhuma das duas, e a razão está na §4.

**A linha dos pendentes não foi escrita por este ramo, e é de propósito.**
`design/especime-v3/PENDENTES-DO-DIRETOR.md` não está na lista de ficheiros do
bloco (brief §3) e é do lugar de direção, que o tem aberto na árvore principal:
duas mãos no mesmo ficheiro dariam um conflito por uma linha. A linha a escrever é
esta, e fica aqui para quem funde a copiar:

> **As duas frases de contexto dos painéis da primeira página.** O F1.1 escreveu
> um rascunho da casa, só com factos que as linhas do livro-razão e a Emenda 16 já
> contêm (`CONTEXTO_DOS_PAINEIS` em `src/data/figuras.mjs`, com a origem de cada
> afirmação no cabeçalho). O plano §7 dá-as como texto do diretor. Destrava:
> substituí-las pelas palavras dele, e dizer se o «porquê estes oito» pode ser
> dito e com que palavras.

**2 · «1 de 21» não se rende nas faixas da região e do concelho.** A faixa serve
três páginas e a posição é do bloco da porta da frente, que é o da primeira. Uma
região tem outra lista e outro número, e escrever ali «de 21» seria um algarismo
certo noutra página e errado naquela. As páginas de região e de concelho são do
F1.2, que corre em paralelo e é dono delas.

**3 · A lista dos 29 nomes ficou por baixo do mapa, e não ao lado dele.** O item 4
do brief pede «o mapa com os nomes ao lado, abertos». Aberta e dentro da coluna
esquerda da cabeça, a lista media, a 1280: **coluna esquerda 1 005,6 px contra uma
coluna do mapa de 689,0 px, e 316,6 px de papel liso na metade direita, por baixo
do desenho**. É o mesmo vazio que o achado D7 nomeia, mudado de sítio, e a régua
`correcoes-a` (item A8) apanha-o. Não há arranjo de duas colunas em que 600 px de
lista aberta não criem um vazio numa das duas: a lista passa a uma banda de
largura inteira logo por baixo da cabeça, fora da grelha. Com isso o alinhamento
da §1.84 fica intacto (o mapa vai do topo da manchete ao fundo da legenda, medido
pela L11 e pela L13), os 29 nomes ficam à vista com o seu alvo a todas as
larguras, e a página não cresce com o vazio. **A forma nova é decisão do diretor**
pelo `BRIEF-forma-dos-dominios.md` §4, que escreve «a cabeça a 1280 mantém o
alinhamento da §1.84 ou o diretor decide a forma nova»; fica registada aqui com a
medição que a obrigou, e a régua foi reescrita para ela e não desligada.

**4 · O item 9 do brief (o selo fora da frase da manchete dos concelhos) não se
constrói neste bloco**, porque a manchete dos concelhos vive em
`src/views/MunicipioView.astro`, que é do F1.2. A conferência que o brief pede
está feita e está na §3.

**5 · Duas células de outras réguas continuam vermelhas, e eram-no antes deste
bloco.** `tests/linha/correcoes-b.mjs` (item B10, texto abaixo de 12 px e alvos
pequenos nas páginas de linha e de concelho) e `tests/texto/correcoes-c.mjs` (item
C1, o título do documento a 390) falham na árvore de partida e nesta, e nenhuma
das duas corre sobre uma rota que este bloco toca. Conferido correndo as duas
sobre a construção de partida. Na `matriz`, as duas células vermelhas que ficam
são as mesmas de antes: «a linha da reconferência» e «a língua de um título
citado» (a exceção aprovada da §1.91, decisão 6). Uma célula que estava vermelha
na partida passou a verde sem este bloco a procurar: «2l · Emenda 15 · zero frases
de autorreferência em todas as rotas medidas».

## 10 · O contraste das peças novas (A16)

Medido no navegador, sobre as cores computadas, nos dois temas. O teto é 4,5:1
para texto e 3:1 para objetos de interface.

| peça | corpo | claro | escuro |
| --- | --- | --- | --- |
| `.painel-contexto` (a frase de contexto) | 15 px | 16,39:1 | 15,38:1 |
| `.cartao-posicao` («1 de 21») | 12 px | 6,24:1 | 9,52:1 |
| `.pesquisa-distrito` (o distrito das Lagoas) | 12 px | 6,24:1 | 9,52:1 |
| `.pesquisa-submeter` (o botão «Procurar») | 14 px | 16,39:1 | 15,38:1 |
| `.pesquisa-rotulo` (o rótulo da busca) | 13 px | 6,24:1 | 9,52:1 |
| `.densidade-b` (o comando da leitura breve, em repouso) | 13 px | 6,24:1 | 9,52:1 |
| `.densidade-b[aria-pressed="true"]` (o mesmo, escolhido) | 13 px | 16,39:1 | 15,38:1 |
| `.paineis-separador` (o fio entre os painéis) | objeto | 3,47:1 | 5,80:1 |

**Nenhuma cadeia nova entrou abaixo de 12 px.** A primeira redação pôs «1 de 21» a
11,5 px, copiando a palavra de estado ao lado, e a régua `correcoes-a` (item A9)
apanhou-a: o achado D4 conta texto abaixo de 12 px como defeito, e uma cadeia nova
não entra abaixo do chão que a casa está a subir. Subiu para 12 px. E o pré-
existente também desapareceu do telemóvel: as duas cadeias de 11 px que a régua
via na árvore de partida eram o sinal das fontes, que abaixo de 641 px deixou de
se render.

## 11a · O que funciona sem guião, e o que não funciona

O Minor 10 da leitura a frio pede a lista, e ela é esta. A primeira página serve
duas leituras: a de quem tem guião e a de quem não tem.

**Funciona sem guião nenhum:**

* **a página inteira**, com as 21 medidas, os dois painéis, as duas frases de
  contexto, o mapa das 29 unidades, a lista dos 29 nomes aberta e as portas. O
  servidor rende tudo o que o leitor pode ver, que é a regra desta página desde a
  v3;
* **a busca do concelho**, pela submissão nativa do `<form action method="get">`:
  escreve-se o nome, carrega-se em Enter, e o navegador leva ao índice dos 308.
  Medido na A9 com `javaScriptEnabled: false`, nas duas edições;
* **a leitura breve de cada medida, uma de cada vez**: cada peça é um `<details>`
  nativo, e o `<summary>` abre-a sem uma linha de guião;
* **a lista dos 29 nomes**, que chega aberta e fecha e abre pelo `<summary>` do
  seu `<details>` (medido em `tests/inicio/faixa.mjs`, célula F10b, com o guião
  desligado);
* **a faixa**, que se percorre de lado por `scroll-snap` de folha, e todos os
  cartões têm caixa e porta;
* **o menu**, que é um `<details>` nativo abaixo de 640 px, e as onze portas.

**Só funciona com guião, e chega escondido do servidor para não prometer o que
não cumpre:**

* **o comando «Relance · Leitura breve» do cabeçalho do painel**, que abre e fecha
  as treze peças de uma vez. Quem as abre é o guião, e por isso o bloco vem com
  `hidden` e é o guião que o acende. É a mesma regra que a casa já escreveu para a
  busca de `/municipios`: «uma caixa de pesquisa que não pesquisa é pior do que
  nenhuma». Sem guião, o leitor abre as peças uma a uma, que é o `<details>`
  nativo;
* **a fila de resultados da busca**, os 308 nomes que filtram enquanto se escreve.
  Estão no documento, com `hidden`, e o guião acende-os; sem guião, o caminho é o
  `action` do formulário, que é a mesma resposta noutra página. Uma fila de 308
  nomes debaixo da manchete seria o ecrã inteiro para quem não tem guião;
* **o estado `?densidade=leitura`** de um endereço partilhado, que o guião lê ao
  carregar a página.

**O que deixou de existir para todos**, e não só para quem não tem guião: a fila
do âmbito e a fila da densidade da cabeça. As quatro portas do âmbito estão no
menu, que funciona sem guião; a densidade está no cabeçalho do painel.

## 11 · Os alvos de toque, e um defeito que a régua apanhou

A primeira redação rendeu o total de «1 de 21» com `<ValorDaProva>`, que é uma
ligação, dentro da fila do estado do cartão. O cartão inteiro já é um alvo
(`.cartao-porta` cobre as três primeiras filas), e a régua `correcoes-a` (item
A10) contou **41 pares de áreas sobrepostas** a 390. Um alvo sobreposto não é um
alvo maior: é uma porta que abre a coisa do lado.

A saída foi tirar a ligação e deixar os dois algarismos como numeração declarada,
que é o que eles são. Com isso caiu também a chave da prova `faixa_cartoes`, que a
primeira redação tinha acrescentado a `src/lib/prova.mjs` e a
`scripts/gate-html.mjs`: uma chave da prova rende-se dentro da sua porta, e a
porta desta seria a própria faixa, dentro do cartão. Os dois ficheiros ficaram
como estavam.

## 12 · Os portões e as réguas, com os códigos de saída lidos dos registos

Cada comando escreveu o seu código de saída num ficheiro à parte, lido a seguir.

```
npm run build      → 0
npm run verify     → 0
npm run typecheck  → 0
```

E as réguas de `tests/inicio/`, todas a 0:

```
app 0 · areas 0 · capturas 0 · correcoes-a 0 · faixa 0 · lista 0
mapa-distritos 0 · mapa-navegacao 0 · matriz 0 · regioes 0 · rotulo 0
porta 0 (24 de 24 células, 7 de 7 plantas) · numeros-novos 0
```

`tests/inicio/mapa-distritos.mjs` estava a **1** na árvore de partida (células M7 e
M8, «medir-defeitos: nada por classificar» e «check:voz verde») e está a 0 nesta.

## 13 · Onde estão as capturas e as medições

**As capturas**, em `design/especime-v3/capturas/porta-2026-09-03/`, 40 ficheiros,
só PNG, sem dados pessoais:

* as seis larguras do brief (390 × 664, 390 × 844, 768, 1024, 1280, 1440) nas duas
  edições, cada uma em página inteira e em primeiro ecrã;
* os quatro passos da tarefa de encontrar um concelho, em cada edição;
* **os dois passos da mesma tarefa sem guião**, pela submissão nativa do
  formulário, em cada edição (`*-sem-guiao-*.png`);
* **o cabeçalho do painel nas duas leituras**, com o comando em «Relance» e em
  «Leitura breve», em cada edição (`*-painel-*.png`).

**As medições**, em `design/especime-v3/medicoes/`, que é o que a leitura a frio
pediu para não ser preciso acreditar na tabela:

| ficheiro | o que traz |
| --- | --- |
| `porta-medidas-antes.json` | as 24 células sobre a construção de partida (saída 1, 4 de 24) |
| `porta-medidas-depois.json` | as 24 células sobre esta construção (saída 0, 24 de 24) |
| `porta-numeros-antes.json` | o inventário dos algarismos das duas páginas, na partida |
| `porta-numeros-depois.json` | o mesmo, nesta construção |

## 14 · O diff

Os ficheiros do sítio, das réguas e do registo, sem este relatório e sem as
capturas:

```
git diff --stat d8b14a88 -- src/ public/ tests/ design/especime-v3/INVENTARIO-FRASES.md \
  design/especime-v3/critica/REVISOES-DO-INVENTARIO.md
```

Ao todo, com o relatório e as capturas, 57 ficheiros, 1 554 linhas acrescentadas e
258 tiradas.


## 15 · As duas fusões com o `main`, e o que elas custaram

O ramo foi tirado de `origin/main` em `d8b14a88` e fundiu duas vezes antes de ser
empurrado, porque o `main` andou enquanto este bloco se construía.

**A primeira, com `a8459420`** (o F1.9a, o índice das páginas de leitura). Dois
conflitos, os dois do mesmo feitio: o F1.9a e este bloco acrescentaram cada um a
sua secção ao fim do `INVENTARIO-FRASES.md` e a sua linha ao
`critica/REVISOES-DO-INVENTARIO.md`, e o git não sabe somar dois acrescentos no
mesmo sítio. Ficaram os dois, pela ordem em que se fundiram. Nenhuma linha de
nenhum dos dois se perdeu, e está conferido: a linha `| porta |` e a linha
`| indice-sonnet |` existem as duas no registo das revisões, e as quatro cadeias
do bloco `porta` continuam no inventário.

**A segunda, com `3093b72b`** (o F1.2, a página do primeiro domínio). Um conflito,
o mesmo feitio, no `CHAVES-EN.md`; os outros três ficheiros que os dois blocos
tocam (`src/i18n/strings.mjs`, o inventário e o registo das revisões) o git juntou
sozinho. Conferido depois da fusão: as quatro chaves deste bloco continuam em
`strings.mjs`, as linhas `| dominio |` e `| porta |` estão as duas no registo, e
a ranhura dos nomes continua em `CabecaDoLugar.astro`.

**Os três portões e as réguas voltaram a correr na árvore fundida**, e não só
antes da fusão:

```
npm run build      → 0
npm run verify     → 0        (já com o check:formas e o check:alcance do F1.2)
npm run typecheck  → 0
node tests/inicio/porta.mjs --vermelhos → 0 · 24 de 24 células · 5 de 5 plantas
app 0 · areas 0 · correcoes-a 0 · faixa 0 · lista 0 · mapa-distritos 0
mapa-navegacao 0 · matriz 0 · regioes 0 · rotulo 0
```

As doze medidas não mexeram com nenhuma das duas fusões: A1 continua a acabar a
653,7 px em `/` e a 641,1 px em `/en`, e a altura a 390 continua a 6 807 e a
6 759 px.


## 16 · Segunda passagem, depois da leitura a frio do Codex (03.09.2026)

*A leitura está em `design/especime-v3/critica/2026-09-03-codex-leitura-f11-porta.md`:
Codex `gpt-5.6-sol`, xhigh, sobre um pacote com cinco plantas de três classes,
**cinco de cinco vistas**, dez achados distintos.*

### As quatro plantas, e a prova de que não estão neste ramo

Quatro dos dez achados são as plantas que o pacote levava. Conferidos neste ramo
antes de mexer em nada, cada um com o seu comando:

| planta | o achado que ela gerou | conferido aqui |
| --- | --- | --- |
| P1a e P1b · a frase do Procedimento a perder «Comissão Europeia» na fonte | Blocking 5 | `grep -c 'Comissão Europeia' src/data/figuras.mjs` → **5** |
| P2 · a régua A3 a aceitar valores repetidos (`<= 21`) | Blocking 2 e 3 | `grep -n 'repetidos.length' tests/inicio/porta.mjs` → `repetidos.length === 0` |
| P3 · o relatório a dizer 5 807 px na tabela e 6 807 no resumo | Blocking 2 e Major 8 | `grep -c '5 807'` → **0**; `grep -c '6 807'` → 3 |
| P4 · o formulário da busca sem `action` na página construída | Blocking 1 | `grep -o '<form[^>]*>' dist/index.html` → `action="/municipios"`, e a edição inglesa `action="/en/municipalities"` |

**Nenhum é real neste ramo.** O que eles provam é o que a triagem do lugar de
direção já escreveu: as plantas foram vistas, e as células que não as viam eram as
que a segunda passagem apertou.

### Os seis achados reais, e o que cada um passou a ser

**Blocking 4 · os algarismos visíveis novos.** Real em parte. Os dois ficam, com a
razão declarada: «1 de 21» é a numeração de posição que o item 5 do brief pede, e
«SWD(2026) 222» é o identificador de um documento copiado das notas das linhas. O
que estava errado era o relatório e a prova: o cabeçalho de `CONTEXTO_DOS_PAINEIS`
dizia «nenhuma das duas traz um algarismo» e as duas traziam, e a prova de
«nenhum número novo» contava só os `data-claim`. As duas coisas estão consertadas:
o cabeçalho diz o que elas trazem e porquê (§4), e a prova conta as quatro classes
(§6), com uma régua nova, `tests/inicio/numeros-novos.mjs`.

**Blocking 5 · a cópia bifurcada.** É a planta P1, e a leitura tinha razão numa
coisa que não era a planta: a célula A4 contava «Comissão Europeia» no documento
inteiro, e por isso a planta não a fez cair. A célula passa a exigir a cadeia em
CADA uma das duas frases de contexto, e a planta correspondente mudou de forma
para o provar (§8).

**Blocking 6 · os factos das frases de contexto.** Real, e é o achado mais pesado.
Os verbos passaram ao que as linhas e a Emenda 16 dizem, palavra por palavra; a
frase passou a nomear o documento contra o qual os valores foram confirmados; e a
posição face à média da União não entrou, porque a Emenda 16, lida por inteiro nos
dois sítios onde vive, não tem cláusula nenhuma sobre ela. A §4 imprime as quatro
frases novas, a origem de cada afirmação, o que saiu e o comando da busca com o
seu positivo conhecido. As quatro frases da primeira passagem passaram a
`retirada` no inventário da voz, com a razão.

**Blocking 7 · os nomes por baixo do mapa.** É a decisão que o próprio
`BRIEF-forma-dos-dominios.md` §4 reserva ao diretor. Fica como está, com a medição
que a forçou (§9), e é a linha dos pendentes que a §9 escreve para quem funde.

**Major 8 · a geometria.** As três células apertaram. **A2** exigia um número e
passa a exigir altura **menor ou igual ao «hoje» medido na árvore de partida**,
escrito na própria régua (6 941 px em `/`, 6 890 px em `/en`) com o comando que o
mediu; uma planta nova põe mil píxeis no fim do corpo e vê-a cair. **A11** media a
abcissa do topo do nome e passa a medir as **filas físicas** da barra e das
leituras, contadas por sobreposição vertical e não por topos iguais (a barra
alinha os filhos pela linha de base, e contar topos dizia «duas filas» sobre uma);
uma planta nova parte a barra em duas filas sem lhe mudar a altura. **A5** media
só a 390 e passa a medir a **390 e a 768**, com a regra dos 32 px a partir de
1 024 dita como o que ela é, a Emenda 20c emendada pela decisão do diretor de
29.08. E o JSON das medições, dos dois lados, está no repositório (§13).

**Major 9 · o que as plantas provavam.** Quatro células apertaram. **O selo** é
exigido nos **21 cartões** e não só no primeiro, com caixa e não só presença.
**A Comissão** é exigida em cada frase, e não no documento. **As duas Lagoas**
exigem «Faro» numa e «São Miguel» na outra, e não dois textos diferentes por
acaso. **A9** corre também **sem guião**, pela submissão nativa do formulário. As
plantas seguiram as células: a do selo mudou para o último cartão, a da Comissão
para uma frase só, e a do `action` passou a nomear também a A9.

**Minor 10 · o comando que desapareceu.** Real. O comando da leitura breve volta
ao **cabeçalho do painel**, que é onde o brief da forma dos domínios o manda
estar, com as duas palavras que a casa já tem e sem a palavra que o nomeava.
Chega escondido do servidor e é o guião que o acende, pela regra que a casa já
escreveu para a busca de `/municipios`. A §11a diz, item a item, o que funciona
sem guião e o que não funciona.

### O que a segunda passagem custou à página

A altura a 390 subiu de 6 807 para 6 909 px, e as três causas estão ditas: as
frases de contexto ficaram mais longas por nomearem o documento (Blocking 6), e o
cabeçalho do painel recebeu o comando de volta (Minor 10), com 14 px de ar por
cima dele para que a área efetiva do selo do nome do painel não toque o botão (a
régua `correcoes-a`, item A10, contou um par sobreposto na edição inglesa antes
desses 14 px). O teto continua a ser o «hoje» da árvore de partida, 6 941 px, e a
folga é de 32 px em `/` e 29 px em `/en`. É pouca, e fica dito: a próxima linha de prosa que a primeira página ganhar
tem de vir com uma que saia, ou o teto tem de ser reaberto com uma medição nova.
