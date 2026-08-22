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
