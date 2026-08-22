# Nota da ronda pós-fusão · o que ficou por fazer no dia da fusão

*Ramo `pos-fusao-v3`, cortado de `origin/main` = `8440781`; o lugar de direção
abriu a ronda em `d15273f` (os quatro briefs, os pedidos ao motor e a sonda dos
tipos), que é o commit que `dist/version.json` carimba e que cada cartão nomeia.
Uma secção por construtor. **Todos os números desta nota vêm de um comando que
está escrito ao lado deles.***

---

## A1 · o pacote de desenho passa à identidade v3, e o `README.md` com ele (ISSUES I16)

*Construtor A1 (Claude Opus, `claude-opus-5[1m]`). Brief:
`../briefs/BRIEF-pos-fusao-A1.md`. Corrido sobre um `npm run build` fresco.*

### A1.0 · o que estava errado, e o que este commit faz

`scripts/design-bundle.mjs` descrevia a identidade v2 (Iowan, Avenir, SF Mono,
`--yellow`, `--oxblood`, três densidades, a camada Fundo) e parava com «não
encontrei a camada Fundo (`details.deep`) no instrumento n.º 1», porque a
primeira página da v3 já não tem `details.deep`. O gerador foi reescrito: a
disciplina da v2 fica inteira, o conteúdo passa a ser a identidade que está no
ar. `README.md` §Identidade foi reescrito com ele, mais três frases v2 espalhadas
pelo resto do ficheiro.

**A sonda dos tipos no painel não foi repetida.** O lugar de direção já a tinha
feito a 22.08 (`../capturas/pos-fusao/2026-08-22-sonda-tipos-no-painel.png`;
sonda apagada) e decidiu: **ficheiros irmãos**. Esta ronda executa a decisão, não
a reabre.

### A1.1 · os cartões, e de onde sai cada peça

Tudo o que os cartões exibem sai de `dist/`, das folhas de `src/styles/`, de
`src/i18n/strings.mjs`, de `public/tipos/` ou de uma citação procurada em
`IDENTIDADE.md` ou em `direcao.md`. Nenhuma frase foi escrita para preencher um
cartão. Os números 08, 09 e 22 a 29 ficam livres, como o brief manda.

| cartão | grupo · largura | o que extrai, e de onde |
|---|---|---|
| `01-cor.html` | Fundamentos · 720 | a paleta inteira de `tokens.css` nos dois blocos (`:root` e `:root[data-theme='dark']`), cada amostra pintada com a própria ficha e cada razão de contraste lida do comentário da ficha; o par de estados em três `.peca-topo` de `dist/index.html` (`[data-estado="fora"]`, `[data-estado="dentro"][data-limiar="sim"]`, `[data-estado="sem"]`); o comentário de `--onamber` inteiro; `#a-cor` de `dist/metodo/index.html`; cinco trechos de `IDENTIDADE.md` §2 e as Emendas 1 e 12 |
| `02-tipo.html` | Fundamentos · 720 | as três linhas da tabela de `IDENTIDADE.md` §1; `.wordmark`, `.banda-legenda-item`, `span.eyebrow` e `nav.nav-principal` de `dist/index.html`; `p.sobre-texto` de `dist/sobre/index.html`; `#a-letra` de `dist/metodo/index.html`; os oito blocos `@font-face` de `tokens.css`; a tabela dos onze ficheiros de letra com os bytes em disco e o resumo de `TIPOS.md`; Emenda 5 |
| `03-selo-e-marcador.html` | Componentes · 720 | `ul.aparelho-selos` e o primeiro `.claim-com-chip` com `.src-chip.is-unverified` de `dist/livro-razao/index.html` (a rota é procurada pela corrida numa lista de candidatas); três `.peca-topo`, `.claim-com-provisorio` e o texto oculto do primeiro `a.src-chip` de `dist/index.html`; `span.marcador` de `dist/a-verificar/index.html`; `.log-linha` de `dist/correcoes/index.html`; `livro.seloCheio`, `livro.seloTracejado` e `estado.porConfirmar` das duas edições de `strings.mjs`; `IDENTIDADE.md` §5.1, §5.4, §5.6 e §6, Emendas 10 e 15 |
| `04-regua.html` | Disposições · 1240 | três `.regua` de `dist/index.html`, escolhidas por medição e não por índice (uma `fora`, uma `dentro` com **uma** `line.regua-ref`, uma com **duas**, que é a banda de dois lados); `.banda` da mesma página; a peça com régua de `dist/municipios/evora/index.html` (o tecto legal); `.wrap { max-width }` lido de `site.css`; Emenda 4 |
| `05-mapa.html` | Disposições · 1240 | `figure#mapa`, `.mapa-linha` e `.movel-selo` de `dist/index.html`; `figure#mapa` em postura de localizador de `dist/municipios/evora/index.html`; a largura, a altura e a consulta de meios de `.movel-selo` lidas de `inicio.css`; Emendas 3, 10, 15 e 17 |
| `06-estados.html` | Componentes · 720 | `.cabeca-bloco[data-cabeca="pais"]`, três `.peca` inteiras (fora, dentro, sem limiar), `.social-titulo` e `.social-linha` de `dist/index.html`; as sete cadeias de `estado.*` e `cobertura.*` nas duas edições, de `strings.mjs`; Emenda 16 |
| `07-cartoes.html` | Componentes · 1240 | `inicio.pt.1200x630`, `en.en.1200x630` e `livro-razao-divida-publica-2025.pt.1200x630` de `dist/cartoes/`, PNG embutido em `data:` e resumo recalculado contra o registo ao lado; o registo do terceiro por inteiro; Emenda 11 |
| `10` a `21` | Páginas · 1240 | as doze rotas do brief, tal como estão construídas |
| `30-regras.html` | Fundamentos · 720 | `IDENTIDADE.md` inteiro, pelo conversor que já existia |

**Duas coisas que os cartões de página fazem e que valem a pena dizer.** As
folhas de família não são declaradas: são **medidas** na página construída. Cada
folha de família tem classes que só ela define, e a primeira delas por ordem
alfabética (`banda`, `agenda-dobra`, `linha-pagina-serie`, `concelhos-cobertura`)
é procurada na folha que a página liga ou embute. A ordem em que entram sai de
`src/views/*.astro`, que é onde as vistas as importam. O resultado bate certo,
rota a rota, com os `import` da origem:

```
index.html                                  inicio
livro-razao/divida-publica-2025/index.html  linha
livro-razao/index.html                      linha
municipios/evora/index.html                 inicio + municipio
municipios/index.html                       municipio
metodo/index.html                           leitura
agenda/index.html                           leitura
correcoes/index.html                        leitura
estudos/index.html · sobre · 404 · a-verificar   (só tokens + site)
```

`11-pagina-primeira-escuro.html` é a mesma página com `data-theme="dark"` no
`<html>`, posto pelo gerador. O comentário de cabeça do cartão diz que o sítio
serve **claro a toda a gente** e que isto é a escolha do leitor, para que ninguém
leia o cartão como se o escuro fosse o defeito.

### A1.2 · os tipos, ao lado e não dentro

Os oito WOFF2 e os três `OFL.txt` são copiados byte a byte de `public/tipos/`
para `design-system/tipos/<família>/`, e a folha embutida em cada cartão troca
`url('/tipos/…')` por `url('tipos/…')`. O resumo SHA-256 de cada ficheiro é
recalculado na corrida e comparado com `../TIPOS.md`; um ficheiro sem linha na
tabela pára a corrida.

| ficheiro | bytes |
|---|---|
| `tipos/spectral/Spectral-Regular.woff2` | 80 084 |
| `tipos/spectral/Spectral-Italic.woff2` | 83 140 |
| `tipos/spectral/Spectral-Medium.woff2` | 88 008 |
| `tipos/spectral/Spectral-SemiBold.woff2` | 88 800 |
| `tipos/spectral/Spectral-Bold.woff2` | 88 664 |
| `tipos/spectral-sc/SpectralSC-Regular.woff2` | 79 864 |
| `tipos/spectral-sc/SpectralSC-SemiBold.woff2` | 88 908 |
| `tipos/bitter/Bitter[wght].woff2` | 113 960 |
| `tipos/spectral/OFL.txt` · `tipos/spectral-sc/OFL.txt` | 4 392 cada |
| `tipos/bitter/OFL.txt` | 4 424 |
| **total** | **724 636 (707,7 KiB)** |

### A1.3 · os tamanhos, medidos

`node scripts/design-bundle.mjs`, saída da corrida:

```
  ficheiro                          grupo          bytes  ok
  01-cor.html                       Fundamentos   182623  ✓
  02-tipo.html                      Fundamentos   180626  ✓
  03-selo-e-marcador.html           Componentes   202563  ✓
  04-regua.html                     Disposições   189326  ✓
  05-mapa.html                      Disposições   354786  ✓
  06-estados.html                   Componentes   182055  ✓
  07-cartoes.html                   Componentes   330904  ✓
  10-pagina-primeira.html           Páginas       410260  ✓
  11-pagina-primeira-escuro.html    Páginas       410554  ✓
  12-pagina-linha-livro-razao.html  Páginas       135474  ✓
  13-pagina-livro-razao.html        Páginas       306249  ✓
  14-pagina-municipio.html          Páginas       335641  ✓
  15-pagina-municipios.html         Páginas       176615  ✓
  16-pagina-metodo.html             Páginas       156316  ✓
  17-pagina-agenda.html             Páginas       200166  ✓
  18-pagina-estudos.html            Páginas       126010  ✓
  19-pagina-sobre.html              Páginas       116720  ✓
  20-pagina-correcoes.html          Páginas       165083  ✓
  21-pagina-404.html                Páginas       116434  ✓
  30-regras.html                    Fundamentos   156882  ✓

  4331,3 KiB de cartões · maior cartão 400,9 KiB · tecto 512 KiB
  11 ficheiros de letra ao lado, 707,7 KiB · fora do tecto
```

`du -sk design-system` dá **5 116 KiB** na pasta inteira.

**O tecto subiu de 250 KiB para 512 KiB, e é um desvio ao brief.** O brief §1 diz
que o tecto fica; a aritmética não fecha. `dist/index.html` pesa **240,9 KiB só
de HTML**, antes de uma única regra de estilo (308 pontos do mapa, 308 itens da
pesquisa, 34 peças), e as folhas que a página usa (`tokens` + `site` + `inicio`,
com os comentários que o brief manda embutir) pesam **159,8 KiB**. Nenhum retrato
da primeira página cabe em 250 KiB, por muito que se aperte. Ou o cartão mais
importante do feixe é largado, ou o tecto muda; larguei o tecto e digo-o aqui.
512 KiB é meio megabyte, deixa o maior cartão real (400,9 KiB) com 111 KiB de
folga, e continua a ser um portão a sério, provado na planta C. A razão está
escrita no comentário da constante, com as duas medições.

### A1.4 · as conferências, e as plantas

A corrida confere seis coisas por cartão, e sai a 1 se alguma falhar:

1. a marca `@dsCard` na primeira linha;
2. nenhuma etiqueta que busque (`script`, `link`, `picture`, `source`, `iframe`,
   `object`, `embed`, `video`, `audio`, `track`, `base`, `image`, `use`);
3. **toda a imagem embutida em `data:image/`** (o `img` saiu da lista da v2
   quando os cartões de partilha entraram, e no lugar dela ficou uma regra mais
   apertada);
4. nenhum endereço em nenhum atributo que não seja um `href`;
5. a folha embutida sem `@import`, sem `url()` para fora, sem `url()` absoluto, e
   **cada `url(tipos/…)` a resolver num ficheiro que a corrida escreveu**;
6. tamanho debaixo do tecto.

Fora da tabela, a corrida pára também quando: uma ficha da paleta desapareceu;
uma das sete fichas retiradas (`--yellow`, `--oxblood`, `--paper-2`,
`--paper-3`, `--shadow`, `--dotcol`, `--onyellow`) voltou a `tokens.css`; um
comentário de ficha deixou de trazer a razão de contraste que o cartão imprime;
uma citação não é encontrada no ficheiro que a governa; um ficheiro de letra não
bate certo com `TIPOS.md`; um cartão de partilha diverge do seu registo; a
declaração de uma folha mudou de forma.

**Cinco plantas, cada uma corrida e revertida.** As três que o brief pede, mais
duas para as afirmações que o cartão do mapa faz sobre a página (uma afirmação
conferida por um comando que nunca disparou não vale nada).

| planta | o que se mudou | saída | exit |
|---|---|---|---|
| A · `url(http…)` | uma regra do andaime com `background-image: url('https://example.org/planta.png')` | `a folha embutida pede «https://example.org/planta.png» para fora` em 8 cartões | 1 |
| B · caminho de tipo que não resolve | `tiposRelativos()` a reescrever para `tipos-que-nao-existem/` | `a folha embutida pede «tipos-que-nao-existem/spectral/Spectral-Regular.woff2», que esta corrida não escreveu` (oito por cartão, em 8 cartões) | 1 |
| C · cartão acima do tecto | 400 KiB de enchimento no corpo do `01-cor.html` | `578,4 KiB acima do tecto de 512 KiB`, 1 cartão reprovado | 1 |
| D · a legenda revogada voltou | a busca apontada a uma cadeia que **está** em `dist/index.html` («concelhos»), depois de o controlo confirmar `grep -a -c 'concelhos · CAOP' dist/index.html` = 1 | `a legenda de neutralidade da Emenda 3 voltou a render em \`dist/index.html\`. A Emenda 15 revoga-a; ou sai da página, ou sai do cartão.` | 1 |
| E · pontos do mapa desiguais | a chave do feitio a incluir `cx`, que difere de ponto para ponto | `os 308 pontos do mapa de \`dist/index.html\` não são todos iguais: 290 feitios diferentes. O cartão do mapa diz que são iguais, e ou são, ou o cartão mente.` | 1 |

A primeira tentativa da planta D saiu a **0** e foi descartada como
inconclusiva: a cadeia que lhe dei («308 pontos») não existe na página, e por
isso a conferência não tinha nada que encontrar. A segunda, com um controlo
positivo confirmado antes, disparou. Fica escrito porque é o género de falso
verde que faz uma régua parecer boa.

Depois de cada planta o ficheiro foi reposto de uma cópia guardada e conferido
por resumo (`001bbf7a…`), e a corrida final está verde.

### A1.5 · o `README.md`

`grep` antes, sobre o `README.md` de `8440781`:

```
244:embebido e nenhum pedido de rede. Abaixo dela, o documento vai byte a byte como
262:Cada instrumento da primeira página tem a ligação na sua camada Fundo, nas duas
361:  styles/                 tokens.css (tema de três estados) + site.css
370:- **Tema de três estados**: `:root` nu com a paleta clara completa;
371:  `@media (prefers-color-scheme: dark)` protegido por
374:- **Três tipos, três funções, sem sobreposição**: Iowan Old Style só em marcas,
375:  Avenir Next só em prosa, SF Mono em todos os números e rótulos. Tudo pilhas
376:  de sistema — **a página não faz nenhum pedido de rede**.
377:- **O amarelo `#E8A80C` nunca é texto.** Só marca medição: barras, pontos
```

`grep` depois, sobre as mesmas palavras:

```
244:embebido e nenhum pedido de rede. Abaixo dela, o documento vai byte a byte como
386:  [`design/especime-v3/TIPOS.md`](design/especime-v3/TIPOS.md). As pilhas de
405:  bloco que consultava `prefers-color-scheme` saiu de `tokens.css`.
413:- **Duas cores saíram, e não foi por gosto** (`DECISIONS.md` §1.50): o amarelo
414:  da medição (`--yellow`) e o oxblood do erro admitido (`--oxblood`). Com elas
```

`Iowan`, `Avenir`, `SF Mono`, `E8A80C`, `tema de três estados` e `três
densidades` passam a **0**. As cinco ocorrências que ficam são verdadeiras: a
244 é a faixa dos documentos alojados (que de facto não faz pedido nenhum), e as
outras quatro são a v3 a dizer o que a v2 tinha e já não tem.

Três mudanças fora da secção §Identidade:

- **§Estrutura**, `styles/`: a linha dizia «tokens.css (tema de três estados) +
  site.css» e passa a nomear as seis folhas, com a nota de que cada família de
  página importa a sua;
- **§Os dados por trás dos gráficos**: «Cada instrumento da primeira página tem
  a ligação na sua camada Fundo» era v2 duas vezes (a camada Fundo acabou com a
  Emenda 2, e as ligações mudaram de sítio). Medido em `dist/`:
  `/dados/convergencia.csv` é ligado por `dist/livro-razao/index.html` e
  `dist/en/ledger/index.html`; `/dados/municipios-308.csv` por
  `dist/municipios/index.html` e `dist/en/municipalities/index.html`, e por mais
  nenhuma página das duas edições;
- a secção **§Identidade** inteira, reescrita da `IDENTIDADE.md` §1, §2 e §5 e
  das Emendas 1, 5 e 12.

**Grafia e travessões.** `IDENTIDADE.md` §9 diz que um documento do repositório
fica na grafia em que foi escrito; o `README.md` está na anterior ao Acordo
(«direcção», «excepto», «actualizar»), e as linhas novas seguem-na. Travessões:
30 antes, 29 depois, nenhum nas linhas novas (o que saiu estava na frase das
pilhas de sistema).

**`node scripts/ortografia.mjs --verificar` NÃO varre o `README.md`.**
`ficheirosPublicos()` (`scripts/ortografia.mjs:625`) nomeia
`src/i18n/strings.mjs`, os `src/data/*.mjs` menos o `verbatim.mjs`, todos os
`.astro` de `src/` e os `ledger/claims/*.yml`, e mais nada. A régua corre a 0 na
mesma (`exit=0`, «a superfície pública está numa grafia só»), e o `README.md`
continua fora do seu alcance, como já estava.

### A1.6 · o que fica dito, e não descoberto depois

1. **O tecto mudou** (A1.3). É o desvio maior desta ronda e está medido.
2. **A peça «sem limiar» do cartão 06 não vem do Painel Social**, e não podia
   vir. O brief pede «uma peça “sem limiar” da lista do Painel Social»; a lista
   do Painel Social rende `.social-linha`, **sem quadrado de estado e sem
   palavra de estado**, exactamente porque a Emenda 16 diz «sem cor, porque não
   tem limiares». As peças com o quadrado `sq-sem` vivem no painel (as cinco
   regiões e as medidas do concelho). O cartão mostra as duas coisas e diz o que
   cada uma é: uma `.peca[data-estado="sem"]` do painel, e uma `.social-linha`
   ao lado, com a Emenda citada.
3. **Os PNG dos cartões de partilha não pesam «≈ 41 KB»**, que era a estimativa
   do brief: pesam 61,1 KiB (primeira página PT), 59,6 KiB (EN) e 33,6 KiB (a
   linha). Embutidos em `data:` dão 205,8 KiB dos 323,1 KiB do cartão 07. A
   estimativa vinha da média dos 532 cartões (ISSUES I59), e as duas primeiras
   páginas estão acima dela.
4. **I16 fecha sem o seu próprio resumo.** Um commit não pode conter o seu
   próprio `sha`. A ficha fica fechada «no commit desta ficha», que é a forma
   que a casa já usa (I52, I56); o resumo vai no relatório da ronda.
5. **`README.md` linha 7 diz «Sítio estático, sem JavaScript de origem», e hoje
   isso é discutível.** `dist/js/` serve quatro ficheiros (`inicio.js` 46 028 B,
   `convergencia.js` 10 595 B, `tema.js` 7 154 B, `correcoes.js` 2 138 B) e a
   primeira página liga três deles, mais a guarda do tema em linha no `<head>`.
   A frase não está na lista do brief e a sua redacção é do lugar de direção:
   fica assinalada, não mexida.
6. **O gerador embute as folhas de ORIGEM, não os pacotes de `dist/_astro/`.** É
   o que o brief pede («na ordem de `Base.astro`, mais a folha de família que a
   vista importa») e é a disciplina da v2 («quem desenha tem direito a ler as
   razões»): os comentários das folhas são onde as razões desta casa estão
   escritas. Custa 159,8 KiB no cartão da primeira página; os pacotes
   minificados que essa página liga custariam 69,0 KiB. É a razão de metade do peso do feixe, e é uma escolha
   reversível numa linha.
7. **`design-system/` continua no `.gitignore`** e a corrida continua fora do
   `npm run build`. Nada aqui é um portão de construção.
8. **O empurrão para o painel é do lugar de direção.** O construtor não corre o
   DesignSync.

### A1.7 · as réguas

| comando | saída |
|---|---|
| `npm run build` | verde |
| `node scripts/design-bundle.mjs` | verde, 20 cartões, 11 ficheiros de letra, exit 0 |
| `npm run verify` | verde |
| `node scripts/ortografia.mjs --verificar` | exit 0, «a superfície pública está numa grafia só» |
| `git diff --stat` | só o gerador, o `README.md`, o `ISSUES.md`, esta nota e o brief |

---

## A2 · os selos do instrumento n.º 1 abaixo de 44px (ISSUES I13, I14)

*Construtor A2 (Claude Opus, `claude-opus-5[1m]`). Brief:
`../briefs/BRIEF-pos-fusao-A2.md`. Corrido sobre `dist/` fresco, em Chromium sem
cabeça (`playwright`, `chromium.launch({ headless: true })`), servindo `dist/`
tal e qual num servidor local, que é o mesmo andaime de `tests/inicio/matriz.mjs`.*

### A2.0 · o que este commit faz, em quatro linhas

1. A lista de excepção de `site.css` passa de **sete selectores a quatro**, e
   cada um dos sete foi conferido contra as 322 páginas construídas.
2. O selo do relance da primeira página ganha a área inteira de 44×44; o do
   relance da página do município fica como estava, e diz-se porquê.
3. A folga entre filas dos comandos das regiões passa de 8px a 12px, e com ela
   caem os oito pares de alvos sobrepostos que o instrumento tinha a 390.
4. O selo da FRASE fica com a área da unidade. **É uma excepção medida, e leva
   uma pergunta à direção** (A2.4). A matriz ganha uma célula que a prende.

Nenhuma cadeia nova, nenhuma cor nova, nenhum `clamp()` do instrumento tocado.
A folha mudou em três sítios: a lista de excepção, `.controls` e um comentário.

### A2.1 · a tabela, antes e depois

Os três selos que o instrumento mostra em cada estado, medidos com o mesmo
algoritmo que a matriz usa (a caixa do elemento contra a caixa do `::after`, e
fica a maior das duas). Antes = construção de `f242e51`; depois = construção
deste commit. Estado `pt`, que é o de defeito; os outros cinco dão as mesmas
caixas, e as duas frases que levam dois selos vão na linha seguinte.

| selo | hospedeiro | caixa pt | caixa en | área ANTES | área DEPOIS |
|---|---|---|---|---|---|
| relance | `.glance` | 52,5×14 | 61×14 | 52,5×14 · 61×14 | **52,5×44 · 61×44** |
| frase | `.brief-text` | 52,5×19 | 61×19 | 52,5×19 · 61×19 | 52,5×19 · 61×19 (excepção medida) |
| legenda | `.brief` | 52,5×14 | 61×14 | 52,5×44 · 61×44 | 52,5×44 · 61×44 |

As caixas e as áreas são as mesmas a **1280, 1024 e 390**, nas duas edições: o
selo não está na rampa fluida, e a área também não. A 390 o instrumento está
atrás de uma porta (`details.conv-porta`), e todas estas medições a 390 são com a
porta aberta, que é o que um leitor faz.

Nos estados `ps` (Península de Setúbal) e `ale` (Alentejo) a frase leva **dois**
selos em vez de um, porque a frase cita duas linhas do livro-razão. São 20 selos
no gabarito (6 no relance, 8 nas frases, 6 na legenda) e 3 ou 4 à vista de cada
vez.

### A2.2 · os pares de áreas sobrepostas

Contados como a §5 da matriz os conta para uma peça, mas para todo o
`#convergencia`: todos os pares de `a, button, summary` visíveis, com a área de
cada um, e um par conta quando os dois rectângulos se cruzam nos dois eixos.

| medição | ANTES | DEPOIS |
|---|---|---|
| 36 medições (2 edições × 3 larguras × 6 estados) | **96 pares** | **0 pares** |
| dos quais a 1280 | 0 | 0 |
| dos quais a 1024 | 0 | 0 |
| dos quais a 390, com a porta aberta | 96 (8 por medição) | 0 |
| selos abaixo de 44×44 | 84 de 120 | 48 de 120, todos em `.brief-text` |
| selos aninhados noutro alvo | 0 | 0 |

Os 96 pares eram todos entre **comandos da fila «pôr na régua»**, e nenhum entre
selos: a 390 os oito comandos (as seis regiões, «Todas as regiões» e «Repor»)
quebram em quatro filas, o comando tem 34px de altura, e com 8px de folga a fila
andava de 42 em 42, de modo que o alvo de 44px de um comando entrava 2px no do
comando de baixo. Medido antes e depois, a 390:

```
folga de fila 12px (o que fica):   altura [34]  filas [5711.9, 5757.9, 5803.9, 5849.9]  passo [46, 46, 46]
folga de fila  8px (o que estava): altura [34]  filas [5711.9, 5753.9, 5795.9, 5837.9]  passo [42, 42, 42]
```

Acima de 640 os comandos cabem numa fila e a folga de fila não faz nada: por
isso a mudança é `gap: 8px` → `gap: 12px 8px` e não uma consulta de meios.

**E a rampa inteira, e não três larguras.** Três larguras não provam uma folha
fluida. Varridas 320 a 1440 de 16 em 16, seis estados, duas edições:

```
varridas 852 medições (320 a 1440 de 16 em 16, seis estados, duas edições)
0 com par sobreposto
```

### A2.3 · a lista de excepção, conferida uma a uma

O critério não é o nome: é se o selector acerta num `a.src-chip` em alguma
página construída. Conferido com `node-html-parser` (já é dependência de
desenvolvimento) sobre **todas** as 322 páginas de `dist/`, com `a.src-chip`
como controlo positivo, para provar que a conferência sabe encontrar alguma
coisa:

```
322 páginas construídas lidas
a.src-chip                           1034 selos em  288 páginas
.figura a.src-chip                      0 selos em    0 páginas
.glance a.src-chip                     16 selos em    4 páginas
.brief-text a.src-chip                 16 selos em    2 páginas
.prov-vals a.src-chip                   0 selos em    0 páginas
.mun-campos a.src-chip                112 selos em    2 páginas
.linha-bloco .deep-v a.src-chip        32 selos em    2 páginas
.linha-verificacoes a.src-chip          0 selos em    0 páginas
```

e, para separar «a classe não existe» de «a classe existe e não tem selos»:

```
.figura                                 0 em    0 páginas
.prov-vals                              4 em    2 páginas
.linha-verificacoes                   264 em  264 páginas
.glance                                 4 em    4 páginas
```

| selector | veredicto |
|---|---|
| `.figura` | **sai.** Zero elementos em zero páginas. No código-fonte não há um único `class="figura"`; o que sobrevive é `.figura-nome`, em `MunicipioView.astro`. Uma excepção sem elemento não protege nada |
| `.prov-vals` | **sai.** A classe existe (4 elementos, em `/municipios` e na edição inglesa) e não tem selo nenhum lá dentro. É a ISSUES I14, e está fechada por remoção |
| `.linha-verificacoes` | **sai.** A classe existe em 264 páginas e não tem selo nenhum lá dentro. A regra nunca chegou a aplicar-se |
| `.glance` | **estreita-se** a `[data-instrumento='mandatos'] .glance`. Ver A2.6 |
| `.brief-text` | **fica**, como excepção medida. Ver A2.4 |
| `.mun-campos` | **fica.** 112 selos em duas páginas, e a página do município é da etapa 3 |
| `.linha-bloco .deep-v` | **fica.** 32 selos em duas páginas, e não são as que o nome sugere: `.deep-v` vive em 12 páginas, mas dentro de `.linha-bloco` só na página do município, nas duas edições. É a etapa 3 outra vez |

### A2.4 · a excepção que fica, e a pergunta que vai à direção

O brief manda tirar `.brief-text` da lista. **Não sai**, e a razão é uma medição
que só aparece quando se varre a rampa em vez de três larguras.

A frase da leitura breve não é uma fila: é prosa corrida, e duas das seis frases
citam duas linhas do livro-razão, portanto levam dois selos dentro da mesma
frase. A entrelinha da frase é de **27,65px**. Dois selos em linhas seguidas
ficam sempre a 27,6px um do outro, e duas áreas de 44px a essa distância
sobrepõem-se por **16,4** na vertical. Se as colunas também se cruzarem, o par
conta. Varrida a rampa de 320 a 1440 de 2 em 2, nas duas edições:

```
pt·ps   entrelinha da frase = 27.65px · banda de sobreposição: 434 a 512 (sobrepõe v16.4 h36.1)
pt·ale  entrelinha da frase = 27.65px · banda de sobreposição: 534 a 632 (sobrepõe v16.4 h14.6)
en·ps   entrelinha da frase = 27.65px · banda de sobreposição: 416 a 534 (sobrepõe v16.4 h23.0)
en·ale  entrelinha da frase = 27.65px · banda de sobreposição: 478 a 616 (sobrepõe v16.4 h3.8)
```

A 1280, a 1024 e a 390 os dois selos não se tocam. **Se a medição tivesse parado
nas três larguras do brief, este commit tinha enviado uma porta que abre a linha
do vizinho entre os 416 e os 632, e a matriz tinha-a declarado verde.** Fica
escrito porque é exactamente o género de falso verde que a nota da A1 já
assinalou noutra régua.

A saída da casa para uma fila é dar-lhe altura. Aqui não há fila: a saída
equivalente é levar a entrelinha da frase de 27,65px para 44px, o que num corpo
de leitura é uma entrelinha de 2,6. Isso é mudar a composição da leitura breve,
e a etapa 1d já decidiu o critério que aqui se aplica: «uma área sobreposta não é
um alvo maior, é uma porta que abre a linha do vizinho, e para este sítio isso é
pior do que um alvo pequeno». Enquanto a direção não decidir o contrário, o selo
da frase tem 52,5×19 (61×19 em inglês) e a porta abre a linha certa.

**A pergunta está no relatório da ronda.** Não foi improvisada uma terceira via
(dar a área só às quatro frases de um selo daria dois tamanhos de alvo à mesma
coisa, conforme a frase que calhou; isso é desenho, e desenho é da direção).

O que ficou medido para o dia em que a decisão vier: entre o centro do selo da
última linha da frase e o centro do selo da legenda há **34,1px**, e as duas
áreas de 44px sobrepor-se-iam por 9,9. A folga que resolve é **12px de
`padding-top` na fila da legenda** (34,1 passa a 46,1, sobram 2,1). Não foi
aplicada: enquanto a frase for excepção, essa folga não corrige nada, e uma folga
que não corrige nada é decoração. O cálculo está no comentário de `.brief-text`
em `site.css`, ao lado da regra que a levaria.

### A2.5 · a matriz: 107 células passam a 115

`node tests/inicio/matriz.mjs`. Antes: `107 de 107 células passam.` Depois:
`115 de 115 células passam.` As oito novas, com a prova que imprimem:

```
passa  I13 · o selo do instrumento n.º 1 é alvo de 44×44, fora da frase · 1280
       24 de 24 selos (relance e legenda) em 12 estados · mínimo 52.5×44 · pt:pt pt:gl pt:ps pt:alg pt:mad pt:ale en:pt en:gl en:ps en:alg en:mad en:ale
passa  I13 · nenhum selo do instrumento n.º 1 dentro de outro alvo · 1280
       0 aninhados em 40 selos medidos
passa  I13 · nenhum par de áreas de toque sobrepostas no instrumento n.º 1 · 1280
       0 pares em 136 alvos medidos, nos 12 estados
passa  I13 · a excepção medida do instrumento n.º 1 é o selo da frase, e só ele · 1280
       16 selos abaixo de 44, 16 deles em .brief-text · a frase tem 16 selos, com 19px de altura de área
passa  I13 · o selo do instrumento n.º 1 é alvo de 44×44, fora da frase · 390
       24 de 24 selos (relance e legenda) em 12 estados · mínimo 52.5×44 · pt:pt pt:gl pt:ps pt:alg pt:mad pt:ale en:pt en:gl en:ps en:alg en:mad en:ale
passa  I13 · nenhum selo do instrumento n.º 1 dentro de outro alvo · 390
       0 aninhados em 40 selos medidos
passa  I13 · nenhum par de áreas de toque sobrepostas no instrumento n.º 1 · 390
       0 pares em 148 alvos medidos, nos 12 estados
passa  I13 · a excepção medida do instrumento n.º 1 é o selo da frase, e só ele · 390
       16 selos abaixo de 44, 16 deles em .brief-text · a frase tem 16 selos, com 19px de altura de área
```

**A região do instrumento não está no esquema do endereço.** `?ambito=regiao:…`
é o âmbito da PÁGINA (troca o cabeçalho e o painel); a região lida do
instrumento vive em memória, dentro de `public/js/convergencia.js`, e não se
escreve em lado nenhum que se possa pedir por endereço. A secção nova conduz o
instrumento como um leitor o conduz: carrega em «repor» e depois no comando da
região, seis vezes, em cada edição. Está dito no comentário da secção para que
ninguém procure o parâmetro que não há.

**As células foram levadas ao vermelho antes de se acreditar no verde.** Três
plantas, cada uma corrida e revertida:

| planta | o que se mudou | resultado |
|---|---|---|
| A · `.glance` volta à lista inteira | `[data-instrumento='mandatos'] .glance` → `.glance` | **falham 4**: as duas células de 44×44 e as duas da excepção, a 1280 e a 390 |
| B · a folga de fila volta a 8px | `gap: 12px 8px` → `gap: 8px` | **falha 1**: a célula dos pares a 390. A de 1280 fica verde, que é o esperado |
| C · um selo metido num alvo | um `<button>` posto à volta de um `a.src-chip` da legenda, no navegador | o contador de aninhados vai de **0 a 1** |

A planta C não passa pela folha (o aninho é do documento, não do estilo) e por
isso foi corrida como sonda no navegador, sobre a mesma travessia de pais que a
célula usa. Sem ela, a célula do aninho seria um zero que ninguém provou ser
capaz de ser um.

### A2.6 · a página do município, e `/municipios`

**`.glance` não é só da primeira página.** A conferência de A2.3 dá 4 páginas:
`/` e `/en/`, mas também `/municipios/evora/` e `/en/municipalities/evora/`, onde
o relance do instrumento dos mandatos leva dois selos num «de → até». Tirar
`.glance` da lista dava-lhes a área inteira, e medido: a 390 os dois quebram de
linha, ficam a 33,8px um do outro e as duas áreas sobrepõem-se por **10,2**. Um
par novo numa página que a etapa 3 ainda não arrumou.

Por isso o selector estreita-se em vez de sair. Medido na página do município,
antes e depois, nas duas edições e a 1280, 1024 e 390: **57 selos, 53 abaixo de
44, 0 aninhados, e 3 pares a 390 em cada edição** (os mesmos antes e depois). Os
seis pares são todos entre portas de banda de mandato (`mun-banda-porta`) e
nenhum envolve um selo: são a outra metade do I13, que é da etapa 3.

**`/municipios` e as duas filas de `.prov-vals`**, medidas a 1280, 1024 e 390 nas
duas edições, seis medições por fila:

| fila | alvos | área | pares |
|---|---|---|---|
| `.prov-vals verbatim` | **0** | não tem | 0 |
| `.prov-vals` | **1**, e é `a.ligacao-dados` («descarregar os dados (CSV) ↓» / «download the data (CSV) ↓») | caixa 206,1×16,5 em pt e 185,3×16,5 em en | 0 |

Não há selo nenhum, não há par nenhum, e por isso **não é o mesmo defeito**: fica
como está, e a regra `.prov-vals a.src-chip::after` sai da lista por não ter
cliente. Fica assinalado que a porta de descarga tem 16,5px de altura de caixa;
não é um selo, o I13 é sobre selos, e alargá-la não é deste brief.

### A2.7 · as capturas

`tests/inicio/capturas.mjs` aceita um `recorte`, mas só dentro das listas de
rotas das etapas 3 e 4, e escreve numa pasta fixa por etapa. Acrescentar-lhe um
modo para quatro fotografias era mexer numa ferramenta partilhada por causa de
um brief; foi uma chamada de `playwright` à parte, com o mesmo andaime, e o que
ela faz cabe em cinco linhas:

```js
const ctx = await nav.newContext({ viewport: { width: w, height: 900 }, colorScheme: 'light', deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto(base + rota, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => { for (const d of document.querySelectorAll('details.conv-porta')) d.open = true; });
await p.locator('#convergencia').screenshot({ path: `…/2026-08-22-a2-instrumento-${w}-${ed}.png` });
```

Quatro ficheiros em `../capturas/pos-fusao/`: `…-1280-pt.png`, `…-1280-en.png`,
`…-390-pt.png`, `…-390-en.png`.

### A2.8 · uma coisa que não é deste commit, e que se viu ao fotografar

**O marcador da régua não pinta em Chromium sem cabeça.** Nas capturas, o nome
da região, o valor e o ponto sobre o eixo não aparecem; os rótulos do eixo, a
linha da UE-27 e a barra da distância aparecem todos.

Conferido que **não é desta ronda**: construída a folha de `f242e51` e a folha
deste commit, e fotografada a mesma régua nas duas, as duas imagens são iguais.
O documento está certo nas duas, com JavaScript e sem ele: `<text class="mk-name"
x="384.75" y="154">Portugal</text>`, `fill` calculado `rgb(23,25,27)`, `opacity`
1, `visibility` visible, `getComputedTextLength()` 47,3px e `getBBox()`
47,3×18,9 no sítio certo do `viewBox`.

Ou seja: o que se sabe é que o documento está correcto e que o motor sem cabeça
não pinta aquele grupo. **Não foi verificado num navegador com janela**, e não se
investigou mais porque está fora deste brief. Fica aqui como observação, não como
diagnóstico, e as quatro capturas de A2.7 mostram-no.

### A2.9 · as réguas

| comando | saída |
|---|---|
| `npm run build` (os cinco portões) | verde, `exit 0` |
| `node tests/inicio/matriz.mjs` | `115 de 115 células passam.` |
| `npm run typecheck` | `exit 0` |
| `node scripts/ortografia.mjs --verificar` | `exit 0` |
| `grep -c prov-vals dist/index.html` | `0` (controlo positivo no mesmo ficheiro: `grep -c src-chip dist/index.html` dá `2`) |

---

## A3 · os PNG dos cartões em paleta exacta, sem dependência nova (ISSUES I59)

*Construtor A3 (Claude Opus, `claude-opus-5[1m]`). Brief:
`../briefs/BRIEF-pos-fusao-A3.md`. Todas as medições nesta máquina, sobre um
`npm run build` fresco de `e19c1dc`, e cada uma com o comando ao lado dela.*

### A3.0 · o que este commit faz, em quatro linhas

1. Os 532 PNG dos cartões passam de RGBA (tipo de cor 6) a **paleta indexada
   exacta** (tipo de cor 3, profundidade 8), escrita por um codificador da casa
   de trinta linhas sobre `node:zlib`. **Nenhuma dependência nova, de espécie
   nenhuma.**
2. Não é quantização. Os cartões têm no máximo **118 cores** e nem um píxel
   translúcido, e por isso a paleta é a lista das cores que lá estão: os píxeis
   do ficheiro são, cor por cor, os que o rasterizador desenhou.
3. **20 064 037 → 8 874 864 bytes**, e o passo `cartoes` de **5,91 s para
   5,39 s**. Mais pequeno e mais rápido ao mesmo tempo.
4. Uma prova, fora da construção, descodifica cada PNG escrito e compara-o byte
   a byte com o RGBA da mesma passagem: **532 de 532 iguais**. Três plantas
   postas e revertidas.

O portão não mudou uma linha. A folha, as páginas e o desenho também não: o
mesmo SVG, o mesmo rasterizador, as mesmas cores das fichas.

### A3.1 · porque é que não havia dependência a trazer

A ficha I59 supunha que uma paleta indexada era «outra dependência de
construção». Não é, e a razão é o formato. Um PNG indexado são cinco coisas: a
assinatura, o `IHDR`, um `PLTE`, um `IDAT` e o `IEND`, com um CRC-32 por pedaço.
O deflate do `IDAT` é `zlib.deflateSync`, e o CRC-32 é `zlib.crc32`, ambos do
`node:zlib` (a documentação do Node dá o `crc32` como «Added in: v22.2.0,
v20.15.0»; esta máquina corre `node -v` → `v22.23.1`). Não há aqui algoritmo
nenhum a inventar. O ficheiro é
`scripts/png-paleta.mjs`, importa `node:zlib` e mais nada.

A entrada é o RGBA cru do rasterizador. Está nos tipos, e foi lido antes de ser
usado (`node_modules/@resvg/resvg-js/index.d.ts`):

```
export class RenderedImage {
  /** Write the image data to Buffer */
  asPng(): Buffer
  /** Get the RGBA pixels of the image */
  get pixels(): Buffer
  ...
}
```

E conferido à corrida, e não só na declaração, porque o nome não é o conteúdo:

```
$ node -e "const {Resvg}=require('@resvg/resvg-js');
  const i=new Resvg('<svg …width=\"4\" height=\"2\"><rect …fill=\"#123456\"/></svg>').render();
  console.log(i.width,i.height,Buffer.isBuffer(i.pixels),i.pixels.length,[...i.pixels.slice(0,8)])"
4 2 true 32 [ 18, 52, 86, 255, 18, 52, 86, 255 ]
```

`0x12 0x34 0x56` com alfa 255: são os RGBA, em ordem de leitura, quatro bytes
por píxel. O `sharp` não entra: está em `node_modules` como pacote transitivo do
Astro, não é dependência desta casa, e não é importado em lado nenhum do
repositório (`grep -rn sharp src scripts tests package.json` dá **uma** linha, e
é o comentário de `png-paleta.mjs` a dizer isto mesmo; controlo positivo, o
mesmo `grep` com `resvg`, dá três). `package.json` e `package-lock.json` não
foram tocados: `git diff --stat` nos dois é vazio.

**A recusa é parte do desenho.** O codificador não aproxima nada por sua conta.
Ao primeiro píxel com alfa abaixo de 255, ou à cor 257, devolve a razão e nenhum
byte; o rasterizador volta ao `asPng()` para esse cartão e o registo passa a
dizer `"codificacao": "rgba"`. Nesta construção não aconteceu a nenhum:

```
  paleta · 532 de 532 PNG em paleta exacta (tipo de cor 3), no máximo 118 cores
  num cartão · 0 em RGBA
```

Entre **57 e 118 cores** por cartão: **528 abaixo de 100 e quatro a 118**, que
são as duas primeiras páginas nos dois papéis (`inicio.pt` e `en.en`, a
1200×630 e a 1200×600). São exactamente os quatro cartões que levam a fila de
quadrados: os 532 registos com `quadrados` não nulo são esses quatro e mais
nenhum. O mínimo, 57, é
`livro-razao-taxa-de-emprego-2025.pt.1200x630`. É a mesma contagem que o lugar
de direção mediu por outro caminho antes de escrever o brief (118 de máximo,
528 abaixo de 100, quatro acima), com uma correcção: o máximo não é de um
cartão, é de quatro empatados.

### A3.2 · o nível do deflate, que é uma medição e não um defeito da biblioteca

Os mesmos 532 cartões, o mesmo desenho, a mesma paleta, só a mudar o que se
passa ao `deflateSync`:

| o que se passa ao deflate | passo `cartoes` | os 532 PNG |
|---|---|---|
| (RGBA, como era antes) | 5,9 s | 20 064 037 |
| `{ level: 9, strategy: Z_RLE }` | 4,4 s | 9 953 494 |
| `{ level: 6 }` | 5,2 s | 8 987 164 |
| **`{ level: 7 }`** | **5,3 s** | **8 874 864** |
| `{ level: 8 }` | 7,6 s | 8 471 596 |
| `{ level: 9, strategy: Z_FILTERED }` | 13,5 s | 8 125 109 |
| `{ level: 9 }` | 13,4 s | 8 021 832 |
| `{ level: 9, memLevel: 9 }` | 13,5 s | 8 021 832 |

O 7 é o ponto onde o passo fica mais pequeno E mais rápido do que era em RGBA.
Do 7 para o 9 poupam-se mais 853 032 bytes e paga-se o dobro do tempo do passo,
em todas as construções, por ficheiros que só se descarregam quando um sítio de
partilha os vai buscar. A tabela está escrita ao lado da opção, em
`png-paleta.mjs`, para que mudar de ideias seja mudar um número e não repetir a
medição.

Uma nota de honestidade sobre a estimativa do brief: a primeira página
re-codificada por uma biblioteca dava «cerca de 26 KB». O codificador da casa dá
**27 034** bytes no nível 7 e **24 872** no nível 9, ou seja, no nível 9 o
codificador da casa fica abaixo da estimativa feita com a biblioteca. E a
estimativa de «cerca de um quinto do peso» para o total não se confirmou: um
quinto seriam 4 012 807 bytes e o que se mede são 8 874 864, que é 44%. A conta
antiga era optimista; a poupança real é de 55,8% e chega.

### A3.3 · os tamanhos e os tempos, antes e depois

Antes = `npm run cartoes` com `scripts/cartoes.mjs` em `e19c1dc`; depois = o
mesmo comando com este commit, sobre o mesmo `dist/` de `astro build`. As
contagens de bytes são um `fs.statSync` sobre os 532 ficheiros, e não um `du`.

| | antes | depois | |
|---|---|---|---|
| os 532 PNG, total | 20 064 037 | **8 874 864** | menos 11 189 173, menos 55,8% |
| média por cartão | 37 714,4 | **16 682,1** | menos 21 032,3 |
| o maior (`inicio.pt.1200x630.png`) | 62 554 | **27 034** | menos 56,8% |
| o menor (`en-ledger-evora-pelouros-2025-total.en.1200x600.png`) | 27 476 | **11 942** | menos 56,5% |
| os 532 registos, total | 987 492 | 1 009 840 | mais 22 348, pelos dois campos novos |
| `du -sk dist/cartoes` | 22 800 KB | **11 896 KB** | menos 47,8% |
| `du -sk dist` | 37 852 KB | **26 948 KB** | menos 28,8% |
| `design-system/07-cartoes.html` | 334 847 | **215 467** | menos 35,7%, três cartões embutidos em base64 |
| tipo de cor no `IHDR` (byte 25) | 6 | 3 | profundidade 8 nos dois |

O tempo, três corridas seguidas de cada lado, com o `time` do `zsh`:

```
antes    npm run cartoes  4.22s user 1.68s system 99% cpu  5.914 total
         npm run cartoes  4.22s user 1.67s system 99% cpu  5.937 total
         npm run cartoes  4.24s user 1.69s system 100% cpu 5.925 total

depois   npm run cartoes  3.53s user 1.79s system 98% cpu  5.406 total
         npm run cartoes  3.55s user 1.77s system 99% cpu  5.353 total
         npm run cartoes  3.57s user 1.79s system 99% cpu  5.400 total
```

Média de **5,925 s para 5,386 s**, menos 0,54 s (9%). O passo faz mais trabalho
(percorre os 756 000 píxeis de um cartão de 1200×630 a construir a paleta) e
mesmo assim demora menos, porque o deflate no nível 7 sobre 756 630 bytes de
índices (630 linhas de 1201, com o byte de filtro) custa menos do que o
`asPng()` do rasterizador sobre 3 024 000 bytes de RGBA. A
construção inteira, uma corrida de cada: **13,545 s → 12,852 s**.

**O tempo na Vercel não se mede daqui.** Nenhuma construção da Vercel correu com
isto, pela mesma razão que a etapa 5 escreveu na §4: o ramo alimenta uma
pré-visualização protegida e este construtor não empurra. Lê-se depois do
próximo `deploy`, não se adivinha agora.

### A3.4 · a prova de igualdade dos píxeis, e o que ela não prova

```
$ node scripts/provar-cartoes-paleta.mjs
  cartões · 266 cartões × 2 medidas = 532 PNG e 532 registos · 8.46 MB · …
  paleta · 532 de 532 PNG em paleta exacta (tipo de cor 3), no máximo 118 cores
  num cartão · 0 em RGBA
  ✓ 532 de 532 PNG em paleta descodificados e iguais, píxel a píxel, ao RGBA que
    o rasterizador desenhou na mesma passagem.
$ echo $?
0
```

**Como corre, e porquê assim.** A comparação tem de ser com o RGBA da MESMA
passagem, e das duas hipóteses do brief tomou-se a segunda: `cartoes.mjs` ganha
a bandeira `--provar`, guarda o RGBA do cartão que acabou de desenhar, relê do
disco o PNG que acabou de escrever, e chama o descodificador de
`provar-cartoes-paleta.mjs`. A primeira hipótese (redesenhar o SVG dentro da
prova) obrigava a importar o `cartoes.mjs`, que apaga `dist/cartoes/` mal é
importado. `provar-cartoes-paleta.mjs` é as duas coisas: o descodificador, e o
comando que corre a bandeira. **Fora da construção**: o `npm run build` não o
conhece e o descodificador só é importado quando `--provar` está lá.

**O descodificador não confia em nada.** Infla o `IDAT`, confere o CRC-32 de
cada pedaço, recusa qualquer byte de filtro diferente de zero, recusa outro tipo
de cor, outra profundidade, entrelaçamento, um `tRNS`, um índice fora do `PLTE`,
e só depois mapeia índice a índice pelo `PLTE`. Uma prova que aceitasse variantes
não provava nada sobre esta.

**O que NÃO prova, e é a distinção que mantém o I58 aberto.** Isto compara os
píxeis do ficheiro com os píxeis do rasterizador. Não lê o que lá está escrito.
Quem desenhasse no cartão uma cadeia diferente da que regista teria aqui 532 de
532 iguais na mesma, porque os dois lados da comparação viriam do mesmo desenho
errado. O portão continua a conferir o registo e não os píxeis, e nada nesta
prova o muda. **I58 fica como está**, palavra por palavra.

### A3.5 · as três plantas

Cada uma foi posta, corrida e revertida, e a reversão conferida com um `diff`
contra a cópia de antes da planta (as duas primeiras) e com uma nova corrida
verde (a terceira).

**Planta 1 · um índice de paleta trocado no `IDAT` antes de escrever.**
`indices[500000] ^= 1` no cartão português da dívida pública, a 1200×630, ANTES
do deflate, para que o CRC do pedaço fique válido: é um PNG bem formado com um
píxel errado, que é exactamente o caso que a prova existe para apanhar.

```
CARTÕES — os píxeis de livro-razao-divida-publica-2025.pt.1200x630.png não são
os do rasterizador.
  o primeiro píxel diferente é o 500000 (800, 416): o rasterizador desenhou
  #f6f7f4 e o ficheiro tem #17191b
exit 1
```

**Planta 2 · um byte do `PLTE` trocado.** `paleta[7] ^= 0x20`, que é o verde da
terceira entrada da paleta, no mesmo cartão e também antes do CRC. Um só byte da
tabela de cores, e o que muda é toda a superfície pintada com aquela entrada:

```
CARTÕES — os píxeis de livro-razao-divida-publica-2025.pt.1200x630.png não são
os do rasterizador.
  o primeiro píxel diferente é o 68578 (178, 57): o rasterizador desenhou
  #b1b2b1 e o ficheiro tem #b192b1
exit 1
```

`0xb2 ^ 0x20 = 0x92`: a planta nomeia-se a si própria no valor.

**Planta 3 · o resumo de um cartão editado no seu registo**, que é uma planta do
portão que já existia, repetida para mostrar que nada se mexeu. Trocado o último
carácter do `resumo` no `.json` do mesmo cartão, e `npm run gate:html`:

```
dist/cartoes/livro-razao-divida-publica-2025.pt.1200x630.png
  ✗ o resumo do PNG não é o que o registo declara.
    registo:  sha256:fbfc7062670791f82f8e623c9f07a13810cf01ee629020ac7b5b69cf5265c3da
    ficheiro: sha256:fbfc7062670791f82f8e623c9f07a13810cf01ee629020ac7b5b69cf5265c3d8
exit 1
```

É a mesma mensagem da etapa 5 §8. **O portão não mudou uma linha**, e não
precisava: lê o `IHDR` nos bytes 16 a 24 (largura e altura), que estão no mesmo
sítio no tipo de cor 3, e o tipo de cor mora no byte 25, que ele não lê. As
dimensões, o resumo, os valores recalculados, a fila de quadrados e a regra dos
algarismos sem origem continuam todos a passar: `532 cartões de partilha (2964
valores recalculados, 532 nomeados por páginas)`, o mesmo número de antes.

### A3.6 · quem mais lê estes PNG

O cartão é um `og:image`, e por isso o formato tem de ser lido por quem não somos
nós. **O tipo de cor 3 é PNG desde a primeira versão do formato.** Conferido na
origem e não de memória, a RFC 2083 (*PNG Specification Version 1.0*, Março de
1997): «Color Type 3: Allowed Bit Depths are 1,2,4,8. Interpretation: Each pixel
is a palette index; a PLTE chunk must appear», e «Decoders must support all legal
combinations of bit depth and color type».

Três leitores independentes do nosso, a ler os ficheiros escritos:

| leitor | o que diz |
|---|---|
| `file(1)` | `PNG image data, 1200 x 630, 8-bit colormap, non-interlaced` |
| `sips` (ImageIO da macOS) | `pixelWidth 1200`, `pixelHeight 630`, `format png`, `bitsPerSample 8`, `samplesPerPixel 3`, `exit 0` |
| Chromium sem cabeça (`playwright`, que já é devDependency) | descodifica o PNG e devolve os píxeis; o RGBA que ele lê é **igual byte a byte** ao que o descodificador da casa lê, em três cartões, incluindo o de 118 cores |

A terceira é a que interessa, porque fecha o círculo: sem ela, a prova da §A3.4
seria o codificador da casa a ser conferido pelo descodificador da casa. O
guião do Chromium é de rascunho e não entrou no repositório.

**E o que não está verificado, que se diz e não se disfarça:** nenhum sítio de
partilha foi ensaiado com estes ficheiros. Não se afirma aqui que o Facebook, o
X, o LinkedIn ou o WhatsApp os leem. O que se afirma é o que está medido em
cima: é PNG 1.0 legítimo, e três descodificadores que não são nossos leem-no.

### A3.7 · o registo, e os dois campos novos

Cada `.json` ganha `"codificacao"` («paleta» ou «rgba») e `"cores"`. O registo do
cartão português da dívida pública, que a etapa 5 §6 reproduz por inteiro, muda
nestas quatro linhas e em mais nenhuma:

```json
  "resumo": "sha256:fbfc7062670791f82f8e623c9f07a13810cf01ee629020ac7b5b69cf5265c3d8",
  "bytes": 15477,
  "codificacao": "paleta",
  "cores": 87,
```

Este cartão pesava **34 433** bytes em RGBA e pesa **15 477** em paleta, menos
55,1%. O `34433` é, ao byte, o número que a etapa 5 §6 já registava: o desenho
não mudou, mudou a arrumação dos bytes. E o resumo do ficheiro repete-se
entre corridas (`sha256:…5265c3d8`, conferido em duas construções separadas
desta sessão), o que era preciso, porque o `design-bundle.mjs` embute o PNG e
confere o resumo contra o registo escrito ao lado dele.

**Nenhum portão os confere, e é de propósito.** Não são uma conferência, são a
arrumação dos bytes escrita ao lado deles, para que um cartão que caia para RGBA
se veja no registo e não só na balança. Se algum dia um cartão passar das 256
cores, o passo `cartoes` imprime a linha da recusa com o nome do cartão e o
píxel onde ela aconteceu, e o registo desse cartão diz `"rgba"`.

### A3.8 · as réguas

| comando | saída |
|---|---|
| `npm run build` (os cinco portões) | verde, `exit 0`, 12,852 s |
| `node scripts/provar-cartoes-paleta.mjs` | `532 de 532 … iguais, píxel a píxel`, `exit 0` |
| `npm run verify` | `exit 0` |
| `npm run typecheck` | `exit 0` |
| `node scripts/ortografia.mjs --verificar` | `exit 0`, «a superfície pública está numa grafia só» |
| `node scripts/design-bundle.mjs` | `exit 0`, 20 cartões, 11 ficheiros de letra (os resumos dos PNG continuam a bater certo com os registos) |
| `git diff --stat package.json package-lock.json` | vazio: nenhuma dependência entrou |
| `git status --porcelain` | cinco caminhos e mais nenhum: os dois ficheiros novos (`scripts/png-paleta.mjs`, `scripts/provar-cartoes-paleta.mjs`), `scripts/cartoes.mjs`, o `ISSUES.md` e esta nota |
| travessões (longo ou curto) na prosa deste construtor | zero. Varridas as linhas adicionadas do `git diff` do commit (790 linhas de diff, controlo positivo nas linhas de contexto, que dá 1): há **duas** ocorrências e as duas estão dentro de transcrições literais do terminal, na cadeia que o `morre()` de `cartoes.mjs` já imprimia antes desta ronda. Uma transcrição copia-se, não se reescreve |
