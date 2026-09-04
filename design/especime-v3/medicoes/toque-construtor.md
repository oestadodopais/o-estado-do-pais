# F1.1c · uma leitura de cada vez, e nenhuma em repouso

*Construtor: Claude Opus 5, 04.09.2026, ramo `toque-2026-09-04`, a partir de
`origin/main` em `69ba3abf`. Medido com `tests/inicio/*.mjs` sobre a construção
deste ramo e sobre a construção de `69ba3abf`, feita na mesma árvore antes de uma
linha mudar. Todos os números deste relatório saíram de uma corrida; nenhum foi
escrito de cabeça.*

## 0 · O que se construiu, em três frases

O F1.1b tinha posto por baixo da faixa as 21 leituras breves em `<details>`
fechados, e o diretor viu no ar o que elas eram: «the cards that we can scroll on
top of the website … then are double just under the map. Now they don't have the
numbers, but the names are still there and the cards are still there». Vinte e um
nomes por baixo dos vinte e um cartões que já os dizem.

**Com guião, a área de leitura passa a mostrar uma leitura de cada vez, e nenhuma
antes de um toque**: a folha esconde as dobras fechadas e no lugar delas fica uma
linha, «Toque num cartão para ler a medida.». Um toque num cartão abre a leitura
daquele cartão e fecha a que estava aberta; o botão «voltar» do navegador, ou o
próprio `<summary>` da leitura aberta, devolvem a área ao estado vazio.

**Sem guião não muda um píxel**: as 21 leituras continuam à vista, fechadas, com
o seu `id`, e `#m-<id>` continua a abrir a certa. A altura de `/` sem guião é a
mesma antes e depois, ao píxel, nos dois motores e nas duas edições.

## 1 · A altura, antes e depois (390 × 664)

Medido com `\.claude/medir-toque.mjs` (a régua deste bloco, fora do repositório)
sobre as duas construções, em Chromium e em WebKit sem cabeça, depois de
`document.fonts.ready`.

| estado | antes (69ba3abf) | depois | diferença |
| --- | --- | --- | --- |
| `/` com guião · chromium | 4638 px | 3700 px | −938 px |
| `/` com guião · webkit | 4639 px | 3701 px | −938 px |
| `/` sem guião · chromium | 4578 px | 4578 px | 0 |
| `/` sem guião · webkit | 4579 px | 4579 px | 0 |
| `/en` com guião · chromium | 4596 px | 3649 px | −947 px |
| `/en` com guião · webkit | 4597 px | 3650 px | −947 px |
| `/en` sem guião · chromium | 4536 px | 4536 px | 0 |
| `/en` sem guião · webkit | 4537 px | 4537 px | 0 |

A célula A2 de `tests/inicio/porta.mjs`, que mede a mesma coisa por outro
caminho, diz o mesmo: `/` a 3700 px e `/en` a 3649 px, com o tecto a 6991 e 6940.
A J6 de `tests/inicio/leitura.mjs` compara com a árvore de partida do F1.1b
(6959 e 6911 px) e dá −3259 e −3262.

## 2 · Os nomes de medida à vista por baixo da faixa

A contagem é de NOMES VISÍVEIS (`[data-leitura] [data-medida-nome]` dentro da
área de leitura, com `checkVisibility()`), e não de `<details>` abertos: o que o
diretor viu foi uma lista de nomes.

| estado | antes | depois |
| --- | --- | --- |
| com guião, em repouso | 21 | **0** |
| com guião, depois de um toque num cartão | 21 | **1** (a do cartão tocado) |
| com guião, depois de Enter no mesmo cartão | 21 | **1** |
| com guião, depois do botão «voltar» | 21 | **0** |
| sem guião | 21 | 21 |

Nos dois motores e nas duas edições. A linha do estado vazio está à vista
exactamente nos dois estados em que a área não tem nada dentro, e escondida nos
outros; sem guião não se vê nunca.

## 3 · O que se construiu, ficheiro a ficheiro

### 3.1 · `src/views/HomeView.astro` (só a área de leitura)

Duas coisas. A secção `#painel` ganha `data-area-leitura`, que é a marca que o
guião acende; e, a seguir ao comando da densidade, entra a linha do estado vazio,
`<p class="dobras-nada" data-leituras-vazio hidden>`, que chega escondida do
servidor. É a mesma regra do comando da densidade logo acima: quem a acende é o
guião, porque sem guião ela seria uma instrução falsa (ali as 21 leituras estão à
vista, e mandar tocar num cartão para ver o que já está no ecrã não é uma
instrução, é ruído).

**Uma só para as duas metades da área.** O quadro do Procedimento e o Painel
Social têm as suas leituras, mas o que está vazio quando nada está aberto é a
área inteira: duas linhas iguais seriam a mesma frase duas vezes na mesma página,
que é o defeito que este bloco veio tirar. Fica no cabeçalho da área, ao pé do
comando que também governa as 21.

### 3.2 · `src/styles/inicio.css` · três regras

```
[data-area-leitura][data-toque='sim'] .dobra:not([open])            { display: none }
[data-area-leitura][data-toque='sim'] .dobras:not(:has(.dobra[open])) { border-top: 0 }
.dobras-nada { ... }
```

A primeira é o bloco todo. A segunda existe porque `.dobras` abre com o fio da
casa, e um quadro sem nenhuma leitura aberta ficava com um fio solto a meio da
área; `:has()` é o único selector que responde a «este bloco tem alguma dobra
aberta», e o lado seguro de falhar está escolhido, como a folha já faz noutros
dois sítios: num motor sem `:has()` o fio fica onde sempre esteve. A terceira
veste a linha do estado vazio com as fichas que a folha já declara (`--f-instr`,
`--muted`), na forma da linha vazia da busca (`.pesquisa-vazio`).

**Nenhuma cor nova, nenhum tipo novo, nenhuma medida nova.** As duas primeiras
regras só mudam visibilidade.

### 3.3 · `public/js/inicio.js`

Três acrescentos, os três dentro da regra do ficheiro (trocar `hidden`, `open`,
`aria-pressed`, `aria-current`, e escrever marcas de estado como o `data-ambito`
e o `data-densidade` que ele já escrevia na raiz da cabeça):

* escreve `data-toque="sim"` na área de leitura, e é a folha que esconde as
  dobras fechadas. **A marca entra DEPOIS de a leitura do fragmento estar
  aberta**, e a ordem é medida: assim que ela entra, a página encolhe, e pô-la
  antes fazia o navegador rolar para o sítio certo de uma página que ia mudar de
  altura no instante seguinte. Pela mesma razão, um endereço que chega com
  `#m-<id>` refaz o rolamento depois de a página ter a altura que vai ter;
* troca o `hidden` da linha do estado vazio, e segue as DOBRAS e não os cliques:
  um ouvinte de `toggle` em cada uma das 21. Assim a linha está certa venha a
  mudança de onde vier, incluindo do próprio `<summary>` da leitura aberta, que é
  o comando de fechar que a página já tinha;
* no `hashchange`, um fragmento que não é uma leitura desta área devolve a área ao
  estado da DENSIDADE (`repoeDensidade()`), e não «fecha tudo». É isso que faz o
  botão «voltar» devolver o ecrã vazio depois de um toque, e é isso que não
  desmente o comando «Leitura breve» quando ele está premido.

**Não escreve texto nenhum**, e a linha do estado vazio prova-o: o texto dela vem
do servidor.

### 3.4 · `src/i18n/strings.mjs` · uma cadeia nova, nas duas edições

`inicio.painel.semLeituraAberta`: «Toque num cartão para ler a medida.» e «Tap a
card to read the measure.», que são as palavras do brief do lugar de direção. Não
leva algarismo, não fala da casa, e não traz vocabulário novo.

### 3.5 · Os ficheiros da voz

Duas linhas novas no `INVENTARIO-FRASES.md`, classe `navegacao`, bloco `toque`,
estado `viva` (a cadeia nas duas edições), com a secção que diz de onde vem e
porque é `navegacao` e não `conteudo`; e a entrada do bloco em
`critica/REVISOES-DO-INVENTARIO.md`, por ler, como os outros blocos deste dia.
`npm run check:voz` fecha com **818 frases distintas, autorreferência 0, nada por
classificar**.

### 3.6 · As réguas

`tests/inicio/leitura.mjs` ganha **duas células e duas plantas**:

* **J13** · com guião, quantos nomes estão à vista por baixo da faixa: zero em
  repouso (com a linha do estado vazio à vista), um depois de um toque no cartão
  (o daquele cartão, com a linha fora e `#m-<id>` na barra), zero depois do botão
  «voltar» (`history.back()` dentro do documento, que é a travessia que dispara o
  `hashchange`), e um depois de Enter no mesmo cartão. Nas duas edições e nos dois
  motores;
* **J14** · sem guião, as 21 leituras no documento, os 21 nomes à vista, nenhuma
  aberta e a linha do estado vazio escondida;
* **planta** · «uma leitura fechada deixada à vista com guião»: um estilo em linha
  na primeira dobra ganha à folha e deixa aquela leitura à vista, fechada, por
  baixo do cartão que já diz o nome dela;
* **planta** · «a área de leitura sem a linha do estado vazio»: tira do documento
  a linha, e a área fica sem nada dentro e sem uma palavra a dizer o gesto que a
  enche.

`tests/inicio/matriz.mjs` mudou em duas células, e não por gosto: as duas tocavam
ou punham o foco no `<summary>` de uma leitura FECHADA, que com guião deixou de
estar na página. Está na §5.

## 4 · O que fica por fazer, e o que não se fez

**A leitura fechada deixa de ser alcançável com guião, e isso é a decisão.** Quem
lê com teclado ou com leitor de ecrã chega às leituras pelos cartões, que são
ligações para `#m-<id>` e que abrem a leitura ao serem activados (medido: Enter
num cartão faz o que o dedo faz). O que se perde é percorrer as 21 linhas
fechadas sem tocar em nada; o que a substitui é a faixa dos 21 cartões, que é a
mesma lista com o valor de cada medida. Sem guião nada disto muda.

**O endereço não se limpa quando a leitura se fecha pelo `<summary>`.** Fechar
pelo `<summary>` devolve o ecrã vazio e deixa `#m-<id>` na barra: o endereço
continua citável e uma recarga reabre a mesma leitura. Limpá-lo obrigaria a
escrever no histórico uma entrada que ninguém pediu.

**A linha do estado vazio não conta nada.** Não diz quantas medidas há por baixo
dela: essa contagem está no nome de cada painel, ao lado, com a marca que o
portão reconta.

## 5 · As réguas, antes e depois

As catorze de `tests/inicio`, corridas sobre a construção de `69ba3abf` e sobre a
deste ramo, na mesma árvore. `capturas.mjs` não é uma régua: fotografa, e por
isso não tem células.

| régua | antes | depois |
| --- | --- | --- |
| `app.mjs` | 39 de 39 | 39 de 39 |
| `areas.mjs` | 22 de 22 | 22 de 22 |
| `correcoes-a.mjs` | 32 de 32 | 32 de 32 |
| `faixa.mjs` | 80 de 80 | 80 de 80 |
| `leitura.mjs` | 18 de 18 | **26 de 26** (as duas células novas, nos dois motores e nas duas edições) |
| `lista.mjs` | 94 de 94 | 94 de 94 |
| `mapa-distritos.mjs` | 43 de 43 | 43 de 43 |
| `mapa-navegacao.mjs` | 9 de 9 | 9 de 9 |
| `matriz.mjs` | 81 de 84 | 81 de 84 (as mesmas três vermelhas) |
| `numeros-novos.mjs` | inventário | inventário |
| `porta.mjs` | 34 de 34 | 34 de 34 |
| `regioes.mjs` | 30 de 30 | 30 de 30 |
| `rotulo.mjs` | 7 de 7 | 7 de 7 |

**As três vermelhas da matriz são as mesmas antes e depois**, e nenhuma é deste
bloco: «2l · a linha da reconferência saiu da primeira página, e a porta abre o
painel», «Emenda 14 · um concelho sem estudos rende as sete peças e mais nada» e
«a língua de um título citado, e a porta da outra edição no rodapé». Estão
registadas desde o F1.1b.

**As três células da matriz que este bloco reescreveu.** A primeira corrida
depois da mudança não deu uma célula vermelha: deu um ERRO, e a régua parou com
código 1. `page.click('[data-leituras] .dobra:first-child .dobra-abrir')` esperou
30 segundos por um elemento que a folha tinha tirado da página. Duas células
mediam o gesto no `<summary>` de uma leitura fechada, e esse gesto deixou de
existir com guião; a terceira caiu na corrida seguinte, por ser a mesma coisa
vista pela ordem do teclado:

* «uma leitura abre só a sua» passa a dar o gesto que o leitor dá hoje: um toque
  no CARTÃO da primeira medida que abre aqui (três dos 21 levam à página do
  domínio), e exige o mesmo que sempre exigiu — uma leitura aberta, e uma só;
* «2i·5 · o espaço age na leitura e não rola a página» abre as 21 pelo endereço
  `?densidade=leitura`, que é o que o comando «Leitura breve» faz e a porta que a
  célula do selo já usava desde o F1.1b, põe o foco no `<summary>` da primeira e
  exige que o espaço a FECHE (20 de 21 abertas) sem rolar a página. A promessa
  medida é a mesma: a tecla age no comando nativo, e a página não se mexe;
* «ordem do teclado · porta do concelho → painel → portas» procurava a primeira
  paragem dentro de `[data-leituras]`, e em repouso deixou de haver nenhuma:
  `findIndex` devolvia −1 e a célula ficava vermelha. O marco passa a ser a ÁREA
  de leitura (`[data-area-leitura]`), cuja primeira paragem é o comando da
  densidade, no mesmo sítio da página; quando uma leitura abre, o `<summary>`
  dela entra na ordem dentro da área. A célula mede o que sempre mediu: a ordem
  desce a página, sem saltos para trás.

`tests/inicio/matriz.mjs` não estava na lista de ficheiros do brief deste bloco.
Fica dito: sem estas três células a régua não corria, ou corria a acusar o
desenho novo de um defeito que ele não tem, e uma régua que rebenta não mede
nada.

## 6 · As capturas

Duas, a 390 × 664, em português e no tema claro, em
`design/especime-v3/capturas/toque-2026-09-04/`:

* `inicio-390x664-repouso-pt.png` · a página em repouso: os cartões, o mapa, os
  domínios, e a área de leitura com o nome de cada painel, o comando da
  densidade, a linha «Toque num cartão para ler a medida.» e mais nada;
* `inicio-390x664-uma-leitura-pt.png` · a mesma página depois de um toque no
  cartão da posição de investimento internacional: uma leitura aberta, com a
  unidade, o limiar, a definição, as três datas, a régua e o selo.

## 7 · Os três comandos

Sobre a construção deste ramo, com os códigos de saída lidos de ficheiro:

| comando | código |
| --- | --- |
| `npm run build` | 0 |
| `npm run verify` | 0 |
| `npm run typecheck` | 0 |

`npm run verify` falhou uma vez com código 2 antes de qualquer medição, e a
razão não era do bloco: `node_modules/axe-core` não existia nesta árvore (nem na
árvore principal), e `check:moldura` fecha sem ele. Instalou-se a versão que o
`package.json` fixa (4.13.0) e a corrida seguinte foi verde. **Fica dito para a
direção**: uma árvore acabada de criar não tem `axe-core` sem `npm ci`, e o
`verify` depende dele.
