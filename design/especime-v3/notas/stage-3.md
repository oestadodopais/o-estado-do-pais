# Nota da etapa 3 · a família do livro-razão e a página do concelho

*Construtor C (Claude Opus). Ramo `redesenho-v3`, a partir de `df76a5f`. Brief:
`../briefs/BRIEF-etapa-3.md`, com as doze decisões da direção de 21.08.2026 na
sua §2b. Escrita a cada checkpoint, antes da auditoria, para que um corte de
sessão custe uma subetapa. Sem travessões, por escolha deste documento.*

## 0. Os commits

| commit | subetapa | o quê |
|---|---|---|
| (abaixo) | 3-0 | as seis primeiras decisões da direção de 21.08: a descrição da primeira página, as peças sem anel, a porta do CSV, a contagem por parcelas, a nota da medida calculada, I26 e I27 |

---

## 1. Commit 3-0 · as seis decisões da direção, antes de qualquer subetapa

O brief manda fazer as seis primeiras das doze decisões de 21.08 **antes** da 3a,
num commit só. Nenhuma delas é a página de linha, o índice, `/municipios` ou
`/municipios/evora` reconstruídos: são seis correções de rumo que as subetapas
seguintes herdam. Cinco delas fecham entradas do ISSUES.

### 1.1 · A descrição da primeira página, e a régua que passa a ler o `<head>`

**A decisão 1.** `home.metaDescription`, nas duas edições:

| | antes | depois |
|---|---|---|
| pt | Observatório de dados sobre Portugal. Cada número publicado tem uma linha no livro-razão, com fonte, documento e data de acesso. | **Portugal nos painéis europeus: os indicadores, os limiares e as fontes.** |
| en | A data observatory on Portugal. Every published figure has a row in the ledger, with source, document and access date. | **Portugal on the European scoreboards: the indicators, the thresholds and the sources.** |

A segunda frase da antiga é o método do próprio sítio, que é exactamente a classe
que a Emenda 15 tira das páginas do leitor. A régua não a via porque varre o
`<body>`: a primeira página tinha **autorreferência 0** com uma frase de
autorreferência no `<head>`, que é onde um motor de busca e um cartão de partilha
a vão buscar.

**A medida 8 de `scripts/medir-defeitos.mjs` passa a recolher a descrição.** Duas
alterações, as duas escritas no ficheiro:

- a `<meta name="description">` de uma rota inventariada entra na conta como um
  bloco de texto da casa, e é classificada na mesma lista
  (`INVENTARIO-FRASES.md`);
- as rotas medidas passam a ser uma **lista declarada**,
  `ROTAS_DO_INVENTARIO`, que hoje tem `home` e cresce com as subetapas: uma rota
  entra no commit em que a sua página é reconstruída e as suas frases são
  classificadas. Numa página de linha o `<head>` é **composto da linha**
  (`src/lib/livro.mjs`, e o portão recompõe-o e compara) e não é prosa da casa;
  uma rota que não esteja na lista não é medida, e isso está escrito em vez de
  parecer um zero.

**Medido, antes e depois:**

```
node scripts/medir-defeitos.mjs
  antes:   frases da casa · /   ... 32 distinta(s) · conteúdo 40 · navegação 7 · autorreferência 0 ✓
           frases da casa · /en ... 32 distinta(s) · conteúdo 40 · navegação 7 · autorreferência 0 ✓
  depois:  frases da casa · /   ... 33 distinta(s) · conteúdo 41 · navegação 7 · autorreferência 0 ✓
           frases da casa · /en ... 33 distinta(s) · conteúdo 41 · navegação 7 · autorreferência 0 ✓
```

Uma cadeia a mais por edição (a descrição), classificada `conteudo`, **zero por
classificar**, e a autorreferência da primeira página continua em **0 nas duas
edições** com o `<head>` incluído.

**Controlo positivo, porque um zero que não se sabe medir não é um zero.** Posta
uma descrição que não está no inventário («Uma cadeia que não está no
inventário.»), a régua imprimiu:

```
  frases da casa · / ... 33 distinta(s) · conteúdo 40 · navegação 7 · autorreferência 0 ✓
      1 bloco(s) por classificar:
      · «Uma cadeia que não está no inventário.»
```

Revertido; `grep -c "não está no inventário" src/i18n/strings.mjs` → 0 (saída 1).

A célula «2l · Emenda 15 · zero frases de autorreferência na primeira página» da
matriz de aceitação passa com a régua nova: `/: conteúdo 41 · navegação 7 ·
autorreferência 0 · por classificar 0`, o mesmo em `/en`.

### 1.2 · As peças sem anel, e os fios da grelha

**A decisão 2**, e a leitura cruzada de 21.08 tinha razão: a sombra de 1px à volta
de cada peça desenha os quatro lados, e quatro lados são uma caixa. O que a
direção pediu são **fios entre células, e nenhuma moldura por peça**.

**A técnica, e porque não é a óbvia.** A grelha do painel tem buracos (13 peças em
quatro colunas, e uma peça aberta ocupa duas), por isso o fundo cinzento debaixo
de um `gap: 1px` desenharia um rectângulo onde não há célula. E uma conta por
índice (`nth-child(4n)` para a última coluna) engana-se assim que uma peça aberta
reflui a grelha. A regra que ficou não pergunta «esta peça é a quarta?», pergunta
**onde a peça está**:

```css
.peca {
  box-shadow:
    1px 0 0 0 var(--g3),   /* o fio à direita */
    0 1px 0 0 var(--g3),   /* o fio por baixo */
    1px 1px 0 0 var(--g3); /* o píxel do cruzamento */
}
.painel { overflow: clip; }  /* corta os fios que caem fora da grelha */
```

Nenhuma peça leva fio em cima nem à esquerda, e por isso nenhuma peça tem os
quatro lados. Um fio entre duas células é desenhado uma vez, pela que está acima
ou à esquerda. Os fios da última coluna e da última fila caem fora da caixa do
painel, que não tem preenchimento à direita nem em baixo, e o `overflow: clip`
corta-os. `clip` e não `hidden`: não cria caixa de deslocamento, e por isso não
pode esconder um transbordo em vez de o mostrar.

**Saiu com o anel**: o realce ao passar o cursor (era o anel a engrossar por
dentro) e, com ele, a `@media (prefers-reduced-motion: reduce)` que o desligava.
A regra global de `site.css` continua onde está. Está escrito na folha.

**Medido** (guião de rascunho em Chromium sem cabeça, sobre a construção real;
detecta uma moldura de quatro lados como «`border` nos quatro lados» **ou**
«sombra sem deslocamento e com espalhamento positivo», que é a forma do anel):

```
/     320 · 34 peças · 0 com moldura de 4 lados · 0 com anel · intervalo 0px/0px · recorte clip · transbordo 0px (320/320)
/     390 · 34 peças · 0 com moldura de 4 lados · 0 com anel · intervalo 0px/0px · recorte clip · transbordo 0px (390/390)
/     768 · 34 peças · 0 com moldura de 4 lados · 0 com anel · intervalo 1px/1px · recorte clip · transbordo 0px (768/768)
/    1024 · 34 peças · 0 com moldura de 4 lados · 0 com anel · intervalo 1px/1px · recorte clip · transbordo 0px (1024/1024)
/    1280 · 34 peças · 0 com moldura de 4 lados · 0 com anel · intervalo 1px/1px · recorte clip · transbordo 0px (1280/1280)
/en  (as mesmas cinco larguras, os mesmos números)
sombra: «rgb(217, 221, 216) 1px 0px 0px 0px, rgb(217, 221, 216) 0px 1px 0px 0px, rgb(217, 221, 216) 1px 1px 0px 0px»
```

**Controlo positivo do detector**, sobre a construção de referência `df76a5f`,
onde o anel existe: `34 com anel` a 768, 1024 e 1280, `0` a 320 e 390 (onde a
peça já era uma fila com fio de baixo). O detector encontra o que existe.

As 34 peças são as do documento inteiro: 13 do painel do Procedimento, 5 dos
painéis regionais, 8 de Évora e 8 do concelho sem página.

A matriz de aceitação da etapa 2 continua verde: **97 de 97 células passam**,
incluindo «2j · as peças sem caixas, separadas por fios de 1px», que agora
imprime `13 peças · 0 com moldura · intervalo 1px/1px · fio «…1px 0px 0px 0px…»`.

### 1.3 · A porta do CSV muda de página, e a conferência muda com ela

**A decisão 3**, e o ISSUES **I34** dizia que ela não podia ser feita sem tocar na
conferência: `scripts/check-dados.mjs` exigia, com mensagem própria, que **as duas
edições da primeira página** ligassem os dois ficheiros de dados.

A conferência não afrouxou: mudou de objecto. A rota deixa de estar escrita dentro
do laço e passa a ser uma **declaração**, ficheiro a ficheiro:

```js
const PORTA_DOS_DADOS = {
  convergencia: 'home',
  municipios: 'municipios',
};
```

A promessa continua a ser «nas duas edições, ou não são». O que muda é que a porta
segue a lista que o ficheiro publica: quem quer os 308 em ficheiro está na página
dos 308. **Um ficheiro sem rota declarada fecha a construção**, em vez de deixar
de ser conferido, e essa mensagem também está escrita.

**A planta**, e a mensagem que ela deu:

```
a página "/en/municipalities" (edição "en") não liga para "/dados/municipios-308.csv".
Os dados por trás de cada instrumento são descarregáveis nas duas edições, ou não são.
```

A porta rendida só na edição portuguesa; `astro build` verde e `check:dados` a sair
com 1, o que fecha o `npm run build`, que corre `check:dados` no fim. Revertida.

**A porta entrou em `/municipios`** (relocação **R10**, escrita antes do
movimento), ao pé da fonte da lista, como ligação e sem a frase que a explicava.
**A porta da primeira página continua lá**, e é um pedido: `MapaRespira.astro` é
do construtor B. Medido que já pode sair: retirada a linha à mão do componente,
`astro build` e `check:dados` saíram os dois com 0; reposta, `git diff --stat
src/components/inicio/MapaRespira.astro` vazio.

### 1.4 · A contagem por parcelas, em `/municipios` e em mais lado nenhum

**A decisão 4**, e o ISSUES **I33**. Uma linha por baixo da cabeça da lista:

> Continente **278** ■ fonte · Açores **19** ■ fonte · Madeira **11** ■ fonte · Total **308** ■ fonte

Quatro pares rótulo + `<Claim … chip>`: cada contagem é uma linha do livro-razão
com o selo que a abre, e **nada é somado no gabarito** — a soma é a quarta linha, e
é do livro-razão como as outras três. Relocação **R9**, escrita antes do
movimento; o rótulo «Contagem verificada nos ficheiros» **não** viaja, porque é a
casa a dizer o que fez (Emenda 15).

As regras de folha entram numa folha nova, **`src/styles/municipio.css`**,
importada pelas vistas dos concelhos e por mais lado nenhum, que as subetapas 3c e
3d enchem. Uma correção pelo caminho, encontrada na captura e não no código: num
contentor flexível um nó de texto só com espaço é descartado, e o ponto médio
dentro do grupo colava-se ao rótulo («Continente278 ■ fonte·Açores19»); o
separador passou a irmão da parcela e o espaçamento a ser do contentor.

**Medido**, nas duas edições: 1 rendição por parcela por edição
(`grep -o 'data-claim="municipios-continente-caop-2025"' dist/municipios/index.html | wc -l`
→ 1, o mesmo para as outras duas e o mesmo em `dist/en/municipalities/index.html`).

**Uma coisa que fica dita, e não descoberta depois** (ISSUES **I38**): a soma rende
**duas vezes** nesta página, porque a frase da contagem, três linhas acima, já
publicava «São 308 ■ fonte concelhos…». A linha das parcelas é o texto exacto da
decisão 4 e por isso fica como está; a saída está marcada para a **3c**, que compõe
a frase da contagem com as duas chaves da prova que o brief lhe pede.

### 1.5 · A nota da medida calculada sai da página do concelho

**A decisão 5**, e o ISSUES **I35** — que nomeia a linha errada. A cadeia
«Calculado sobre duas colunas do mesmo ficheiro do regulador. A aritmética está na
linha.» é a `nota` de **`evora-indice-de-divida-2024`**, e não de
`evora-execucao-da-receita-2025` como a entrada dizia. A decisão da direção diz o
mesmo que o ficheiro de dados diz («a sentence explaining that the índice de dívida
is computed from two DGAL columns»).

Fechada como a primeira página a fechou na 2l, e **não** retirando a cadeia de
`src/data/municipios.mjs`: a condição lê-se da linha, com `eDerivada()`, e não de
uma lista escrita à mão. `MunicipioView.astro` deixa de render a `nota` de uma
medida derivada. Amanhã uma medida deixa de ser calculada, e a nota volta sozinha.

**Medido**: das oito medidas do relance de Évora **uma** é derivada
(`evora-indice-de-divida-2024`); a página passou de **8 para 7** `.figura-frase`;
a cadeia não rende em nenhuma das duas edições, com controlo positivo (a nota da
DGAL, que não é derivada, continua lá: 1 ocorrência).

### 1.6 · I26 e I27

**I26**, `IDENTIDADE.md` §2. Uma frase, a nomear a Emenda 12: as duas condições da
direção continuam de pé, o escuro deixa de se ler da preferência do sistema e
passa a ser um pedido do leitor guardado no aparelho dele, e o bloco que
consultava essa preferência saiu de `src/styles/tokens.css`. **Conferido antes de
escrever, e não pelo nome do ficheiro**: `grep -c "prefers-color-scheme"
src/styles/tokens.css` → **0** (saída 1), com controlo positivo `grep -c
"data-theme"` → **3**. Nenhuma citação entre «…» entra na frase, e por isso a
amarra das decisões não ganha nada de novo para conferir; `ledger:check` verde.

**I27**, `Provenance.astro`. `lang` deixou de ter defeito e a construção atira
quando falta, com o `id` da linha na mensagem, como em `Claim.astro`. **Nenhuma
chamada precisou de correção**: as doze chamadas a `<Provenance>` do repositório
já passavam `lang={lang}`, e a construção passou verde à primeira. Provado que a
guarda dispara, plantando a falta numa chamada de `LivroView.astro`:

```
[ERROR] Error: <Provenance id="abandono-escolar-precoce-2025"> sem "lang". A língua é
obrigatória: sem ela, o selo escreveria a palavra «fonte» e o texto oculto em português
na edição inglesa (ISSUES I27). Passe lang={lang} na chamada.
[build] Caught error rendering /en/ledger
```

Revertido; `git diff --stat src/views/LivroView.astro` vazio.

### 1.7 · As réguas do commit 3-0

| régua | antes (`df76a5f`) | depois (3-0) |
|---|---|---|
| páginas construídas | 307 | 307 |
| porta de correções | 307/307 | 307/307 |
| primeira página, valores sem selo | 0 · 0 selos para outra linha | 0 · 0 |
| frases de moldura | 89 distintas · 2091 ocorrências | 89 · 2091 |
| `[descrição em preparação]` | 0 | 0 |
| linhas com `#page=` · com recorte | 23 · 22 de 132 | 23 · 22 |
| localizadores internos | 0 | 0 |
| frases de cobertura | 1 por estado por edição (6 leituras) | 1 por estado por edição |
| frases da casa · `/` | 32 distintas · 40 · 7 · **0** | 33 · 41 · 7 · **0** |
| frases da casa · `/en` | 32 distintas · 40 · 7 · **0** | 33 · 41 · 7 · **0** |
| contraste | 0 falhas de texto · 4 objetos de interface abaixo de 3:1 | igual, byte a byte |
| chaves com PT = EN | 15 | **17** (as duas novas em «Identidades aceites») |

As frases de moldura não mexeram, e é o esperado: a linha das parcelas leva
rótulos de menos de 30 carácteres, e a frase que saiu de Évora aparecia numa
página só.

**A régua da invariância**, contra a construção de referência de `df76a5f`
(`git worktree add --detach`, `node_modules` por ligação simbólica, `npm run
build` verde):

```
322 rotas · 318 idênticas em texto · 4 com diferenças
  /en/municipalities/       +21 −0    (as três parcelas, a soma e a porta do CSV)
  /municipios/              +21 −0    (o mesmo)
  /en/municipalities/evora/ +0 −1     (− Computed from two columns of the same regulator file. …)
  /municipios/evora/        +0 −1     (− Calculado sobre duas colunas do mesmo ficheiro do regulador. …)
```

**A primeira página não aparece, e é honesto dizer porquê**: a régua compara blocos
de texto do corpo, e as duas alterações que a primeira página levou são a descrição
do `<head>` (que a régua não lê) e a folha de estilos (que não é texto). As duas
estão medidas acima, cada uma pelo seu instrumento.

### 1.8 · Pedidos

**Ao construtor B** (a primeira página e os seus componentes):

1. **`src/components/inicio/MapaRespira.astro`, linha 279: retirar a porta do CSV
   dos 308.** É a linha
   `<a class="ligacao-dados" href={DADOS.municipios} download>{s.home.dadosLink} ↓</a>`,
   dentro da camada de aparelho por baixo do mapa. A Emenda 15 tirou dessa camada
   tudo o resto; a porta ficou porque `check:dados` a exigia, e **essa conferência
   já não a exige** (ISSUES I34, fechado neste commit). Medido: com a linha
   retirada à mão, `astro build` e `check:dados` saem os dois com 0. Não a retirei
   porque o ficheiro é do construtor B durante toda a fase. Se a porta sair,
   `s.home.dadosLink` continua a ser precisa pela régua da convergência, que fica
   na primeira página.
2. **Nenhum outro pedido**, e vai escrito para que se saiba que foi conferido: o
   commit 3-0 não precisou de uma linha de `tokens.css`, `site.css`, `Base.astro`,
   `Masthead.astro`, `SiteFooter.astro`, `Claim.astro`, `Frase.astro` nem
   `PortaDeCorreccoes.astro`. `Provenance.astro` é a excepção que o brief da etapa
   3 §2b dá por escrito (I27).

### 1.9 · O que fica dito, e não descoberto depois

- **O byte NUL de `src/lib/ledger.mjs` não foi corrigido** (ISSUES **I37**, novo).
  O plano §8 e o brief §2 autorizam a correção de uma linha **só se a etapa editar
  aquele ficheiro por outra razão**, e o commit 3-0 não editou. Medido, e não pelo
  nome: `grep -n "eDerivada" src/lib/ledger.mjs` não imprime nada e `grep -an` dá
  duas linhas; uma varredura de bytes de controlo dá **um** byte, `\x00` no
  deslocamento 79478, linha 1737.
- **O brief §2b oferece o número I37 para registar que «Crianças em creche» fica
  fora da primeira página, «se for preciso». Não foi preciso**: a relocação **R8**
  já regista a saída com a sua razão (nenhum ficheiro do livro-razão nomeia o
  Painel Social para aquela linha), e criar uma entrada para uma coisa que já está
  registada seria ruído. Os números I37 e I38 ficam com os dois achados deste
  commit, e o brief não fica com um número reservado a meio da lista.
- **A soma rende duas vezes em `/municipios`** (I38), com saída marcada para a 3c.
- **`Regua.astro` e `Peca.astro` só têm folha em `src/styles/inicio.css`**, que
  hoje é importada por `HomeView.astro` e por mais ninguém, e as três fichas
  `--peca-corpo-*` são declaradas em `.painel`. Uma subetapa que consuma esses
  componentes fora da primeira página tem de resolver isso, e não por cópia. Fica
  escrito aqui antes de a 3d chegar lá.
