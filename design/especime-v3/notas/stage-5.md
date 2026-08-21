# Nota da etapa 5 · os cartões de partilha

*Construtor E (Claude Opus, `claude-opus-5[1m]`). Ramo `redesenho-v3`, a partir de
`d9c19d5`. Brief: `../briefs/BRIEF-etapa-5.md`, com a §5 do
`../PLANO-redesenho-v3.md` como contrato da direção, palavra por palavra. Escrita
a cada checkpoint, antes da auditoria. **Todos os números desta nota vêm de um
comando que está escrito ao lado deles.***

## 0. Os commits

| commit | subetapa | o quê |
|---|---|---|
| `a90576e` | 5-0 | as pontas soltas da etapa 4: a régua da ortografia fecha, e a casa fica com um só sinal de dobra |
| `b403576` | o rasterizador | os 532 cartões, o modelo, os tipos derivados, o passo de construção e as quatro linhas do `Base.astro` |
| `4257a1f` | o portão | a extensão que confere a imagem que cada página oferece a quem a partilha |
| (este) | as plantas e as medições | as quatro plantas provadas e revertidas, as capturas, esta nota, `CHAVES-EN.md` e `ISSUES.md` |

---

## 1. Commit 5-0 · as quatro pontas soltas da etapa 4

### 1.1 · A régua da ortografia: o brief nomeou uma coisa e o que estava lá era outra

O brief diz: «a classe `mun-tecto-rot` passa a `mun-teto-rot` (e a sua folha),
para que `node scripts/ortografia.mjs --verificar` saia 0». **Não era isso.**

O que a régua assinalava, e é uma ocorrência só:

```
$ node scripts/ortografia.mjs --verificar   →  exit 1
  1 forma(s) fora da grafia da casa:
    src/components/inicio/Peca.astro:216:32  tecto → teto
        … )} {regua.rotulo === 'tecto' && ( <Fragment slot="refer…
```

É a comparação de cadeias que o pedido 9 da nota da etapa 4 já tinha nomeado
(«`tecto` numa comparação de cadeias em `src/components/inicio/Peca.astro`»). A
outra ponta da comparação é `rotulo: 'tecto'`, em `src/lib/inicio.mjs:188`, que
**a régua não vê** (`ficheirosPublicos()` varre `src/i18n/strings.mjs`,
`src/data/*.mjs`, todos os `.astro` de `src/` e `ledger/claims/*.yml`; `src/lib/`
não está lá). As duas mudam juntas ou a régua do concelho fica sem rótulo, e por
isso o commit abre um ficheiro fora da lista do brief, para trocar uma palavra.

**E a `mun-tecto-rot` fica como está**, por duas razões medidas:

1. **a régua não a apanha**, e por isso mudá-la não mudava o código de saída.
   Os valores de atributo SÃO varridos (`regioesDeAtributos()`, chamada na linha
   540 de `scripts/ortografia.mjs`); o que não acontece é o comparador
   reconhecer a palavra dentro de um nome com hífenes:

   ```
   $ node -e "…comparador(carregaFormas(),'acordo')…"
     "mun-tecto-rot"           -> 0 achados
     "tecto"                   -> 1 achado
     "o tecto legal"           -> 1 achado
     "class=\"mun-tecto-rot\"" -> 0 achados
   ```

2. **ela vive numa vista** (`src/views/MunicipioView.astro:372`) e em
   `src/styles/site.css` (2717 e 2724), e as vistas estão na lista do «nunca»
   deste brief.

Fica em `ISSUES.md` (**I55**): não é um defeito de ortografia publicada, é um
nome de classe que a régua não consegue ler, e há mais como ele.

**Depois do commit:**

```
$ node scripts/ortografia.mjs --verificar   →  exit 0
  ✓ a superfície pública está numa grafia só; 5 no restante, 45 aviso(s), 16 em citação.
```

### 1.2 · Um só sinal de dobra no sítio inteiro (I54)

A casa tinha **três** sinais para o mesmo gesto, e não dois como o I54 dizia:

| sinal | onde | fechado → aberto |
|---|---|---|
| triângulo de bordos que roda | `.deep` (`site.css`), `.aparelho` (`inicio.css`), `.nav-menu` (`site.css`) | roda 90° |
| `▸` / `▴` do tipo | `.peca-seta`, na peça da primeira página | troca de glifo, e o aberto aponta para CIMA |
| `+` / `−` | `.regra-dobra` (Método) e `.agenda-dobra` (Agenda), das subetapas 4b e 4c | troca de glifo |
| `▸` / `▾` do tipo | `.conv-porta-seta`, a porta da convergência no telemóvel | troca de glifo |

O brief manda converter o `+`/`−`. A medição que ele pede — «que todo o
`<summary>` de `/`, `/metodo`, `/agenda` e `/livro-razao/divida-publica-2025`
mostre a mesma marca» — obriga a converter também os dois do tipo, porque os
dois vivem em `/`. Os quatro passam a ser a declaração do `.deep`, copiada à
letra. **Só folha**: nenhum elemento novo, nenhuma classe nova, nenhum valor
mudado.

**A medição** (régua de sessão, com Chromium sobre `dist/`, lendo o estilo
COMPUTADO de cada pseudo-elemento de cada `<summary>` — não a folha, o que o
navegador pinta):

| rota | `<summary>` |
|---|---|
| `/` | **28** (1 `.nav-menu`, 26 `.peca-mais`, 1 `.conv-porta`) |
| `/metodo` | **11** (1 `.nav-menu`, 10 `.regra-dobra`) |
| `/agenda` | **6** (1 `.nav-menu`, 5 `.agenda-dobra`) |
| `/livro-razao/divida-publica-2025` | **1** (`.nav-menu`) |
| total | **46** |

A 390px, onde todos os sinais rendem, **as 46 dobras dão a mesma forma**:

```
content="" · bl=5px solid · bt=4px solid transparente · bb=4px solid transparente
· br=0px · box=border-box  ||  aberto: transform=matrix(0, 1, -1, 0, 0, 0)
```

A 1280 a leitura é a mesma para tudo o que rende; o que aparece como
`transform=none` são as marcas que a disposição esconde àquela largura (a
`.conv-porta` acima de 640, o comando de densidade da peça abaixo de 640), e foi
por isso que a medição se fez às duas larguras em vez de a uma.

**A única variação que fica** é a cor de repouso: tinta (`#17191b`) na mobília e
na peça, `--g1` (`#585d5b`) no Método e na Agenda, com a tinta ao apontar. É a
decisão de ênfase que a 4b tomou, não é um segundo glifo, e o cinzento não é cor
no sentido da `IDENTIDADE.md` §2. Se a cadeira quiser as sete iguais também na
cor, é uma ficha.

### 1.3 · I53, a edição inglesa sem página de erro: **fica como está**

O brief manda deixá-la e escrever porquê. A razão não é preguiça: **é uma
decisão de encaminhamento que não é deste ramo.** A Vercel serve UM
`404.html` para tudo o que não existe, e um 404 por edição não é um ficheiro de
página — é uma regra de encaminhamento em `vercel.json`, que está na lista do
«nunca» deste brief, mais uma rota nova declarada em `routes.mjs`, que é do
construtor A. As cadeias já existem nas duas edições (`erro404.*`), e por isso o
que falta é a decisão, não o texto. Continua aberto em `ISSUES.md` como I53.

### 1.4 · `IDENTIDADE.md` §2 a citar «A cor»: **não entrou, e a razão está medida**

O brief manda a §2 citar «A cor» com a marca (`metodo`) «para que a amarra a
guarde». Escrevi a citação, palavra por palavra, e o `ledger:check` fechou:

```
  A AMARRA DAS DECISÕES NÃO FECHA · 1 erro(s):
    ✗ IDENTIDADE.md cita, como sendo do "metodo":
        «A cor aparece só onde a fonte publica um limiar: âmbar quando o valor
         está fora dele, cobalto quando está dentro. Tudo o resto é tinta e
         cinzento, e uma correção diz-se pela forma, com o valor antigo riscado
         e o novo ao lado, nunca por uma cor.»
        e essa frase não existe em src/data/metodo.mjs.
```

**A frase está lá**, e conta-se:

```
$ grep -c "A cor aparece só onde a fonte publica um limiar: âmbar" src/data/metodo.mjs
1
```

O erro não é da citação: é da amarra. `cadeiasDoTexto()`, em
`scripts/check-ledger.mjs:437`, lê `[REGRAS, ABERTURA, LEITURA_BREVE]` de
`src/data/metodo.mjs` — e **não lê `FECHO`**, que é onde a direção pôs «A cor» e
«A letra». As duas frases governadas mais recentes do Método são, hoje,
impossíveis de citar com garantia pela constituição.

Reverti a citação. O brief é explícito: um conflito com um portão escreve-se na
nota e o item fica com a razão, não se improvisa à volta. Escrever a citação sem
a marca passaria em silêncio (a amarra só recusa uma citação não marcada que
esteja num texto que ela LEIA, e esta não está) e seria exactamente o improviso
proibido. O remendo é um identificador em `scripts/check-ledger.mjs`, que não é
desta etapa. Fica em `ISSUES.md` (**I56**), e é uma correcção que vale mais do
que a citação: enquanto ela não entrar, **nenhuma** frase do `FECHO` pode ser
citada com garantia.

---

## 2. O cartão: o que ele diz, e de onde vem cada coisa

Um cartão de partilha é a única superfície da casa que viaja **sem** a página.
Quem o vê não tem o livro-razão ao lado, não pode clicar num selo, não vai
conferir nada. É por isso que o contrato da direção é mais apertado aqui do que
em qualquer outro lado, e é essa a forma que o código tem.

**`src/lib/cartoes.mjs` chama; não reimplementa.**

| o que o cartão mostra | a função ou a chave que o produz | quem mais a chama |
|---|---|---|
| o valor com a unidade, numa página de linha | `valorComUnidade(claim)` (`src/lib/livro.mjs`) | o `<title>` e o `og:title` da própria página, por `tituloDaLinha()` |
| o estado de uma medida | `estadoDaMedida(claim, limiar)` (`src/lib/estado.mjs`) | a peça da primeira página |
| as duas contagens da manchete | `prova(lang).painel_fora_do_limiar` e `.painel_dentro_do_limiar` | a cabeça da primeira página (`Cabeca.astro`), com as mesmas chaves |
| as palavras de estado | `s.estado.{foraDoLimiar,dentroDoLimiar,semLimiar}` | todo o sítio; é o vocabulário fechado |
| a manchete da primeira página | `s.inicio.cabeca.tituloPaisA` + a cauda de singular ou plural + `tituloPaisFim` | `Cabeca.astro`, e a escolha do singular é feita da mesma maneira |
| o pé | `s.prov.fonte`, `s.prov.lido`, `s.sinal.reconferido` | a página da linha e a mobília do cabeçalho |

**Nenhuma chave nova nasceu para o cartão** (§ `CHAVES-EN.md`, «Etapa 5»). Um
cartão que precisasse de palavras próprias estaria a dizer, fora do sítio, uma
coisa que a página não diz.

**O que o cartão não leva**, e são proibições e não gostos: nenhuma linha de
método (Emenda 11 — a prancha tinha «cada número tem fonte» no pé, e a frase
saiu com ela), nenhuma frase sobre o sítio (Emenda 15), nenhum ponto de mapa
(Emenda 10), nenhuma cor fora do par de estado, e nenhum valor que a própria
página não leve. O selo é o **quadrado**, sozinho, no canto do pé: é a marca de
prova que a constituição fixa, e é o que resta da linha da prancha depois de a
Emenda 11 lhe tirar a frase.

**O estado diz-se por palavras E desenha-se na fila**, que é o pedido literal do
contrato («the state is written in words on the card as well as shown in the
strip»).

**O âmbito da fase 1** é o do contrato: a primeira página das duas edições e as
132 páginas de linha das duas edições, **266 cartões**. Todas as outras rotas
levam o cartão da primeira página da sua edição, e isso não se adivinha: o
registo de cada cartão traz `cobre`, a lista das rotas que ele serve. O cartão
`inicio.pt.*` cobre 168 rotas; o `en.en.*`, 167.

---

## 3. Os tipos: porque há uma segunda cópia deles no repositório

**Duas medições decidiram isto, e nenhuma é uma suposição.**

**1. O rasterizador não lê WOFF2.** Dando-lhe os ficheiros que o sítio serve:

```
WARN fontdb] Failed to load a font face 0 from 'public/tipos/spectral/Spectral-Regular.woff2' cause malformed font.
WARN fontdb] Failed to load a font face 0 from 'public/tipos/bitter/Bitter[wght].woff2' cause malformed font.
WARN usvg_text_layout] No match for 'Spectral' font-family.
```

**2. O Bitter que o sítio serve é variável, e o rasterizador não move o eixo.**
O `fvar` do Bitter tem `wght` de 100 a 900 com **defeito 100** (`TIPOS.md` §4);
com `font-weight="600"` no SVG, o desenho saiu todo no Thin. Todo o aparelho do
cartão — o valor, a unidade, o id, o pé — é Bitter, e a página rende-o a 600
(medido no navegador: `.linha-valor-num` computa
`font-family: Bitter…, font-weight: 600, font-size: 62px`).

**A derivação, e a cadeia de bytes.** Antes de derivar, os quatro WOFF2 de
origem foram conferidos contra os resumos da `TIPOS.md` §4, e os quatro batem
certo:

```
$ shasum -a 256 public/tipos/spectral/Spectral-Regular.woff2 …
994c8d7c7c15a5edef827e7cc5d1d6d08d14a0928842fec7cd00739226e0b4cf  Spectral-Regular.woff2
44bdee379860288f245d59ab231ff16cd1b1094487c79a7e3ba23432485afc19  Spectral-Medium.woff2
ad7d0f1a6c127080a7da4d311c8c3545e4ff035791ce01e33962d2c2feda09f6  SpectralSC-SemiBold.woff2
07de7b470557e91e03408c6dbc7b29e3add83c9413229dfb917aa0d73e460897  Bitter[wght].woff2
```

Três são **só troca de contentor** (`f.flavor = None; f.save()`, fontTools
4.61.1, a operação inversa da que a etapa 1b fez); dois são **instância
estática** do eixo (`instancer.instantiateVariableFont(f, {'wght': p},
updateFontNames=True)`), que é a única maneira de o rasterizador escolher o peso.

| ficheiro | bytes | SHA-256 | conferência |
|---|---|---|---|
| `tipos-cartao/Spectral-Regular.ttf` | 259 572 | `6a93133e7948d8182de6239b93d3a24cb9392b2f63ef4e70bb27ddab8c1e12bf` | glifos 1480 → 1480 · cmap 878 → 878 · upem 1000 · registos de `name` 26 → 26 |
| `tipos-cartao/Spectral-Medium.ttf` | 271 420 | `1d8cf716cf605e2eb832ec40c354a3a9ed06f041ca4e489d8cb146def7fd9e34` | glifos 1480 → 1480 · cmap 878 → 878 · upem 1000 · `name` 28 → 28 |
| `tipos-cartao/SpectralSC-SemiBold.ttf` | 271 344 | `4ad936d41b3208ce11dbf939f97f5c60829ef1fd87efe6347e5efd67cccd912b` | glifos 1480 → 1480 · cmap 878 → 878 · upem 1000 · `name` 22 → 22 |
| `tipos-cartao/Bitter-400.ttf` | 201 964 | `61f124b586a7a1170e5b79147bab356517f1196e7b9084dfa5109306aea31370` | glifos 1542 · cmap 977 · upem 1000 · `usWeightClass` 400 · família «Bitter» |
| `tipos-cartao/Bitter-600.ttf` | 202 236 | `fdb635397ea4ca2b5d05278031f84ce6fae51b0cea99ae4b12d572d7bb9c6696` | glifos 1542 · cmap 977 · upem 1000 · `usWeightClass` 600 · família tipográfica (`name` ID 16) «Bitter» |

**A troca de contentor não é byte a byte reversível**, e isso está dito em vez de
escondido: o fontTools volta a serializar, e o `Spectral-Regular.ttf` derivado
(259 572 bytes) não é o TTF de montante (261 088 bytes). O que se conserva é o
que a `TIPOS.md` §4 já tinha conferido e que aqui se volta a conferir: número de
glifos, pontos de `cmap`, `unitsPerEm` e número de registos da tabela `name`.

**As duas instâncias do Bitter têm família «Bitter» as duas**, e é isso que faz
`font-family="Bitter"` com `font-weight="400"` e `600` encontrar cada uma:
`updateFontNames=True` escreve, na SemiBold, o `name` ID 16 = «Bitter» e o ID 17
= «SemiBold», e o `fontdb` lê a família tipográfica quando ela existe. Sem esse
argumento as duas ficavam com família «Bitter Thin» e nenhuma era encontrada.

**A licença viaja com os bytes**: `tipos-cartao/OFL-spectral.txt` e
`OFL-bitter.txt` são cópias com os mesmos resumos que a `TIPOS.md` §4 regista
(`6df9374c…` e `152a1e28…`).

**Ficam fora de `public/`**, e é deliberado: são entrada de construção e não
bytes servidos. Custam **1,2 MB** ao repositório e **zero** ao leitor. Está em
`ISSUES.md` (**I57**) com o que os faria desaparecer.

---

## 4. O rasterizador: a escolha, uma medição que mudou o desenho, e a Vercel

**`@resvg/resvg-js` 2.6.2**, que é o que o plano §5 nomeia, fixado sem `^` como
as outras dependências de produção da casa.

**A medição que mudou o código.** A primeira versão passava os tipos como
buffers, e cada cartão custava 77 ms. Isolado:

```
construtor sem tipos              0,1 ms
construtor com 5 tipos (buffers) 76,9 ms
construtor com 1 tipo   (buffers) 68,4 ms
construtor com fontBuffers: []   66,5 ms      ← vazio, e custa na mesma
construtor com 1 tipo (fontFiles) 0,1 ms
```

O custo **não é proporcional aos tipos**: é um custo fixo que o caminho dos
buffers arrasta (um varrimento que o `loadSystemFonts: false` não trava) e que o
caminho dos ficheiros não tem. Com `fontFiles`:

```
40 cartões completos (construtor + render + PNG)   6,8 ms cada
40 medições de largura de texto                    0,6 ms cada
```

São 532 cartões: a diferença é entre **41 s** e **4 s** de construção. A razão
está escrita no ficheiro, ao lado da opção, para que ninguém a «arrume» de volta.

**A largura de um texto é medida pelo próprio rasterizador que o vai desenhar**
(`new Resvg(<svg só com o texto>).getBBox().width`), e não estimada por número de
caracteres. É a única medida honesta, porque é a que o desenho vai ter. Foram
**700 medições** nesta construção, memorizadas.

**A Vercel: `[verify]`, e o que está verificado.** Verificado:
`@resvg/resvg-js-linux-x64-gnu@2.6.2` existe no registo, declara
`os: linux, cpu: x64, libc: glibc` e traz o `.node` pré-compilado
(`resvgjs.linux-x64-gnu.node`); e está no `package-lock.json` (linha 1656), com o
`musl` ao lado, por isso um `npm ci` na imagem de construção resolve-o sem
compilar nada. **Não verificado**, e não se finge que está: nenhuma construção da
Vercel correu com isto — o ramo alimenta uma pré-visualização protegida e este
construtor não empurra. A versão da glibc da imagem contra a do binário
pré-compilado é a única coisa que uma construção real diria.

**O que acontece se falhar**, e é a resposta do brief a esse `[verify]`: o passo
`npm run cartoes` **pára a construção** com uma mensagem que nomeia a
dependência (não salta em silêncio), e o portão de HTML fecha a construção
outra vez se faltar um cartão que uma página nomeia. Uma página com `og:image` a
apontar para um ficheiro que não existe só se vê no dia em que alguém a
partilha, e é por isso que nenhum dos dois é tolerante.

---

## 5. O desenho, e as duas edições

A prancha `../maquetas/CartaoPartilha.dc.html` manda: papel `--paper`, moldura de
tinta a 2px, a marca em cima à esquerda em Spectral 500, a sobrancelha em cima à
direita em Spectral SC, o bloco do meio encostado ao fio do pé, e o pé com o
quadrado do selo à esquerda e o aparelho à direita em Bitter.

**As cores vêm de `src/styles/tokens.css`**, lidas do ficheiro na construção e
com o `var()` resolvido (`--onamber` é `var(--ink)`). Nenhum literal de cor no
rasterizador: a `IDENTIDADE.md` §2 proíbe-o, e uma paleta em dois sítios é duas
paletas.

O quadrado e a palavra seguem a mesma regra que qualquer peça do sítio: fora =
`--amber` com contorno `--onamber` e a palavra em `--ochre`; dentro = `--cobalt`
com contorno `--ink` e a palavra em `--cobalt-palavra`; sem limiar = sem
enchimento, contorno de tinta, palavra em `--g1`.

**Duas medidas, um desenho.** 1200×630 (Open Graph) e 1200×600
(`summary_large_image`). O que muda é a altura da folha e as folgas, que são
derivadas dela; não há um segundo desenho.

**A edição inglesa mudou o desenho, e foi medida a mudar.** «outside the
threshold» e «within the threshold» são mais compridas do que «fora do limiar» e
«dentro do limiar»: na primeira rendição a fila de estados da edição inglesa
saía pela margem direita fora. **A fila passa a quebrar em duas linhas quando
não cabe numa** — um grupo por linha —, em vez de encolher a letra só numa das
edições. O desenho é o mesmo nas duas; o que muda é onde ele parte. Está nas
capturas: `cartao-inicio-pt-1200x630.png` tem a fila numa linha,
`cartao-inicio-en-1200x630.png` tem-na em duas.

**Duas guardas duras**, porque um cartão cortado mente por omissão: se uma fila
não couber na folha, a construção pára com o nome da rota; se o bloco do meio
crescer por cima da linha da marca, a construção pára com a coordenada. Nenhuma
disparou nesta construção.

---

## 6. O registo, e um deles por inteiro

Cada cartão escreve, ao lado do PNG,
`dist/cartoes/<rota>.<lingua>.<largura>x<altura>.json`. **Os cartões vivem em
`dist/` e mais lado nenhum**, que já está excluído pelo `.gitignore`.

O registo do cartão português da dívida pública, palavra por palavra:

```json
{
  "rota": "/livro-razao/divida-publica-2025",
  "edicao": "pt",
  "tipo": "linha",
  "linha": "divida-publica-2025",
  "dimensoes": { "largura": 1200, "altura": 630, "papel": "og" },
  "ficheiro": "/cartoes/livro-razao-divida-publica-2025.pt.1200x630.png",
  "resumo": "sha256:2334de3c54400148dc99cd49e05424a44f2ccc20bdc0d4f830a93a239640bbfd",
  "bytes": 34433,
  "copia": [
    "O Estado do País",
    "linha do livro-razão",
    "89,7% do PIB",
    "fora do limiar",
    "divida-publica-2025 · 2025",
    "oestadodopaís.pt · Fonte: Eurostat · Lido a 2026-08-12"
  ],
  "valores": [
    { "texto": "89,7", "origem": "linha", "linha": "divida-publica-2025",
      "campo": "value", "unidade": "% do PIB", "periodo": "2025" },
    { "texto": "% do PIB", "origem": "linha", "linha": "divida-publica-2025",
      "campo": "unit", "unidade": "% do PIB", "periodo": "2025" },
    { "texto": "divida-publica-2025", "origem": "linha", "linha": "divida-publica-2025",
      "campo": "id", "unidade": "% do PIB", "periodo": "2025" },
    { "texto": "2025", "origem": "linha", "linha": "divida-publica-2025",
      "campo": "reference_date", "unidade": "% do PIB", "periodo": "2025" },
    { "texto": "Eurostat", "origem": "linha", "linha": "divida-publica-2025",
      "campo": "source", "unidade": "% do PIB", "periodo": "2025" },
    { "texto": "2026-08-12", "origem": "linha", "linha": "divida-publica-2025",
      "campo": "access_date", "unidade": "% do PIB", "periodo": "2025" }
  ],
  "quadrados": null,
  "cobre": [ "/livro-razao/divida-publica-2025" ]
}
```

A cópia visível é a MINÚSCULA onde o desenho a pôs em minúscula («linha do
livro-razão»): em SVG não há `text-transform`, e a Spectral SC desenha os
versaletes nas minúsculas, como a folha do sítio já fazia com
`text-transform: lowercase`. O registo diz o que se vê, não o que estava na
chave.

Uma linha derivada, sem fonte e sem período, degrada-se sem inventar nada
(`distancia-alentejo-ue27-2000`): a cópia é
`["O Estado do País", "linha do livro-razão", "22 pontos de índice", "sem limiar",
"distancia-alentejo-ue27-2000", "oestadodopaís.pt"]`, com três valores em vez de
seis. Um campo que não existe não rende uma etiqueta vazia.

---

## 7. A extensão do portão: o que prova, e o que não prova

**Não é um portão novo** (a moratória de 2026-08-15 continua de pé): é o mesmo
varrimento a olhar para uma superfície que ainda não olhava. Entra como a nona
origem legítima de um algarismo, escrita no cabeçalho do ficheiro ao lado das
outras oito.

**Por página**, no bloco do `<head>`: `og:image` e `twitter:image` têm de nomear
o cartão da rota e da edição desta página; o ficheiro tem de existir; e o
REGISTO desse ficheiro tem de declarar a rota e a edição desta página e listá-la
entre as que cobre.

**Por cartão**, no fim: o PNG existe e o seu SHA-256 é o do registo; as
dimensões são lidas do cabeçalho IHDR do próprio ficheiro e comparadas com o
registo E com o nome; cada valor é recalculado da sua origem — a linha relida do
livro-razão, ou a chave recontada por `contasDoPortao()` — e comparado **como
cadeia** por `formaDoValor()`, a mesma regra do `data-claim`, com a unidade e o
período a viajar com ele; a fila de quadrados é recontada com a leitura de
limiares que o portão já escreve por conta própria; e, a conferência mais dura,
**tira-se da cópia visível cada valor declarado, do mais comprido para o mais
curto, e o que sobra não pode ter um algarismo**.

```
prova · … · 532 cartões de partilha (2964 valores recalculados, 532 nomeados por páginas) · …
```

**Os dois limites, escritos:**

1. **O endereço esperado é composto pela mesma função que o `Base.astro`
   chama.** Essa metade não prova que a regra de escolha esteja certa — é o
   mesmo limite honesto que o `tituloDaLinha()` já tinha, e está escrito no
   bloco. O que a fecha é o registo: um cartão da edição errada traz a edição
   errada escrita no seu próprio registo, e é aí que a planta 3 cai.
2. **O portão lê o registo, não os píxeis.** Não há OCR: se alguém desenhar uma
   cadeia diferente da que regista, o portão não vê. O que reduz isso a um gesto
   deliberado é o desenho ter uma origem só — o mesmo `modelo` que produz o
   registo é o que a função de desenho escreve —, e não haver no rasterizador
   uma única cadeia legível pelo leitor. Fica em `ISSUES.md` (**I58**).

---

## 8. As quatro plantas

Cada uma fechou a construção (`npm run build` → exit 1) e foi revertida a
seguir, com a construção a voltar a exit 0 antes da planta seguinte.

### Planta 1 · um número errado no cartão

A manchete passa a somar 1 à contagem que declara (`src/lib/cartoes.mjs`,
`modeloDoInicio`). **4 erros**, nos quatro cartões da primeira página:

```
dist/cartoes/inicio.pt.1200x630.png
  ✗ a cópia visível do cartão tem algarismos sem origem ("5").
    o que sobra depois de tirar os valores declarados: «O Estado do País · portugal ·
    país · Portugal ultrapassa 5 limiares do Procedimento dos Desequilíbrios
    Macroeconómicos e cumpre . · fora do limiar · dentro do l»
    Um algarismo num cartão tem de vir de uma linha ou de uma chave da prova.
```

### Planta 2 · um valor velho contra a sua linha

O valor da dívida pública fica em `89,6` no modelo. **8 erros** em 4 cartões: a
reconferência apanha-o, e a regra dos algarismos apanha-o outra vez, porque o
`89,7` que a cópia mostra deixou de ser um valor declarado.

```
dist/cartoes/livro-razao-divida-publica-2025.pt.1200x630.png
  ✗ um valor do cartão não é o da sua linha.
    cartão:      "89,6"
    divida-publica-2025.value: "89,7"
    Um cartão viaja sem a página: um número velho nele fica velho para sempre.
  ✗ a cópia visível do cartão tem algarismos sem origem ("897").
```

### Planta 3 · um cartão da rota ou da língua errada

`cartaoDaPagina()` passa a devolver sempre a primeira página **portuguesa**.
**44 erros**: 42 nas páginas inglesas que levam o cartão da casa, e 2 no cartão
inglês que ficou sem ninguém.

```
en/index.html
  ✗ o <meta og:image> desta página, que é da edição "en", nomeia um cartão cujo
    registo diz ser da edição "pt".
  ✗ o <meta twitter:image> desta página, que é da edição "en", nomeia um cartão
    cujo registo diz ser da edição "pt".

dist/cartoes/en.en.1200x630.png
  ✗ este cartão não cobre rota nenhuma: foi desenhado para ninguém.
```

### Planta 4 · uma dimensão errada

Os dois papéis desenham-se com a medida do primeiro. **266 erros**, um por cada
cartão de 1200×600:

```
dist/cartoes/en-ledger-abandono-escolar-precoce-2025.en.1200x600.png
  ✗ as dimensões do PNG não são as do registo.
    registo:  1200×600
    ficheiro: 1200×630
```

---

## 9. As réguas e os tempos

```
npm run build                            exit 0
npm run verify                           exit 0
npm run ledger:check                     exit 0
node scripts/ortografia.mjs --verificar   exit 0   (era exit 1 antes da 5-0)
node scripts/medir-defeitos.mjs           exit 0
node scripts/medir-contraste.mjs          exit 0
node scripts/medir-invariancia.mjs --chaves → 20 chaves iguais nas duas edições
```

**O tempo de construção**, `/usr/bin/time -p npm run build`, três corridas de
cada lado:

| | antes dos cartões | com os cartões |
|---|---|---|
| construção inteira | 7,32 s · 7,18 s | 13,40 s · 13,62 s · 13,89 s · 14,22 s |
| só o passo dos cartões | — | 5,5 s a 5,6 s |

**O que sai**: 266 cartões × 2 medidas = **532 PNG e 532 registos**, **19,1 MB**
de PNG (`dist/cartoes` mede 22 MB com os registos, de um `dist/` de 37 MB).

**O inventário**, `medir-defeitos.mjs`: **36 rotas, as 36 a zero de
autorreferência**, onde a etapa 4 as deixou. 86 frases de moldura distintas em
2 441 ocorrências (307 são a porta de correcções). Os cartões não entram no
inventário e não podiam: não são HTML, e a régua mede páginas construídas.

**O contraste**, `medir-contraste.mjs`: **0 falhas de texto**, 4 objectos de
interface abaixo de 3:1, os mesmos da etapa 1 e nenhum desta. **Nenhuma cor nova
entrou**: o cartão usa `--paper`, `--ink`, `--g1`, `--amber`, `--onamber`,
`--ochre`, `--cobalt` e `--cobalt-palavra`, e os pares que ele desenha já estavam
todos na lista da régua.

**A invariância**, `medir-invariancia.mjs --chaves`: **20**, o mesmo número da
etapa 4. A etapa não criou nenhuma identidade nova porque não criou nenhuma
chave.

---

## 10. O que fica pedido

| # | pedido | a quem |
|---|---|---|
| 1 | **A amarra não lê o `FECHO` do Método** (§1.4, `ISSUES.md` I56). Um identificador em `scripts/check-ledger.mjs:437`. Enquanto não entrar, «A cor» e «A letra» não podem ser citadas com garantia pela constituição | cadeira |
| 2 | **A cor de repouso do sinal de dobra** (§1.2): sete dobras com a mesma forma, duas em cinzento e cinco em tinta. Se a direção quiser as sete iguais, é uma ficha | direção |
| 3 | **I53, o 404 inglês** (§1.3): decisão de encaminhamento, `vercel.json` mais uma rota | cadeira |
| 4 | **`og:image:alt`**: os cartões não levam texto alternativo. A cópia visível já está escrita no registo e daria o `alt` inteiro; o que custa é uma chamada ao modelo por página construída, e não a escrevi porque não está no contrato | cadeira |
| 5 | **O peso dos PNG** (`ISSUES.md` I59): 41 KB de média, em RGBA sem quantização, para um desenho de seis cores. Uma paleta indexada dava-lhes cerca de um quinto. É outra dependência, e não a trouxe sem pedir | cadeira |
| 6 | **A segunda cópia dos tipos** (`ISSUES.md` I57): 1,2 MB no repositório, zero para o leitor. Desaparece no dia em que o rasterizador leia WOFF2 e mova eixos, ou se a casa comprar a Sebenta e a Parnaso, que são estáticas | cadeira |

---

## 11. Modelo e gasto

| | |
|---|---|
| modelo | Claude Opus, `claude-opus-5[1m]`, do princípio ao fim; nenhum sub-agente |
| commits | `a90576e` (5-0), `b403576` (o rasterizador), `4257a1f` (o portão), e o desta nota |
| ficheiros abertos fora da lista do brief, e porquê | `src/lib/inicio.mjs` (uma palavra, a outra ponta da comparação da §1.1), `src/styles/inicio.css` e `src/styles/leitura.css` (a folha do sinal de dobra, que o brief dá como «a folha do glifo de divulgação»), `tipos-cartao/` (novo; os cinco tipos derivados e as duas licenças) |
| plantas provadas e revertidas | quatro, §8 |
| o que ficou por fazer, e é do brief | a citação de «A cor» na `IDENTIDADE.md` §2 (§1.4), com a mensagem do portão que a impede |

---

## 6 · I56 · a amarra passa a ler o `FECHO`, e a citação de «A cor» entra na §2

*Construtor F (Claude Opus, `claude-opus-5[1m]`). Ramo `redesenho-v3`, a partir de
`41161d6`. Fecha o pedido n.º 1 da §10, que é a ponta que a §1.4 deixou medida e
não improvisada. A §1.4 e a §10 ficam como foram escritas: são o registo do
checkpoint, e reescrevê-las apagaria a razão pela qual isto existe.*

**O remendo é um identificador, e é a MESMA conferência a alcançar mais texto.**
`cadeiasDoTexto()`, em `scripts/check-ledger.mjs`, andava
`[REGRAS, ABERTURA, LEITURA_BREVE]` e passa a andar
`[REGRAS, ABERTURA, LEITURA_BREVE, FECHO]`. O `FECHO` entra **inteiro e nas duas
línguas**, pelo mesmo `anda()` recursivo que já percorria os outros três: quem
acrescentar uma entrada à entrada de fecho do Método não tem de voltar a este
ficheiro. **Nenhum portão novo** (moratória de 2026-08-15), nenhuma marca nova,
nenhum vocabulário novo, nenhuma mensagem nova — a que recusa as duas plantas
abaixo é a que já lá estava, palavra por palavra.

**A citação entrou.** A `IDENTIDADE.md` §2 fecha agora com a frase «A cor» do
Método, entre «…» e com a marca (`metodo`) logo a seguir, pela convenção da §8.
Está no fim da §2 e não no princípio: a secção é a forma da regra, e a frase
citada é a mesma regra dita ao leitor — as duas metades, o limiar e a correção
pela forma, que é exactamente o que os dois parágrafos anteriores explicam.

### Planta 1 · uma palavra trocada dentro da citação

«âmbar» → «ocre», dentro das aspas, e mais nada. É a classe de defeito para que
a amarra existe: a citação que estava certa e deixou de estar.

```
$ npm run ledger:check                                                  exit 1

  amarra das decisões · 24 entrada(s) a partir da §1.38 · 2 texto(s)
  governado(s) · 2 citação(ões) da constituição conferida(s), de 43 entre «…»

  A AMARRA DAS DECISÕES NÃO FECHA · 1 erro(s):

    ✗ IDENTIDADE.md cita, como sendo do "metodo":
        «A cor aparece só onde a fonte publica um limiar: ocre quando o valor
         está fora dele, cobalto quando está dentro. Tudo o resto é tinta e
         cinzento, e uma correção diz-se pela forma, com o valor antigo riscado
         e o novo ao lado, nunca por uma cor.»
        e essa frase não existe em src/data/metodo.mjs.
        Ou o texto governado mudou e a citação ficou para trás, ou a citação
        nunca foi essa. A constituição cita palavra por palavra, ou não cita.

  Uma mudança de rumo não sai em silêncio (direção, 2026-08-15).
```

Revertida a palavra, o portão volta a exit 0 — e a citação da §2 é, achatada,
**carácter a carácter** a cadeia do módulo:

```
$ node -e "import('./src/data/metodo.mjs').then(m=>{const a=m.FECHO.entradas
  .find(e=>e.id==='a-cor').texto.pt[0];const t=require('fs')
  .readFileSync('IDENTIDADE.md','utf8');const c=t.match(/«A cor aparece[^»]*»/)[0]
  .slice(1,-1).replace(/\s+/g,' ').trim();
  console.log('idêntica:',c===a,'·',a.length,'caracteres')})"

idêntica: true · 244 caracteres
```

### Planta 2 · uma frase que não existe em lado nenhum do Método

Uma frase plausível, com a marca (`metodo`), a dizer uma coisa que o Método
nunca disse. `grep -c "A cor de um mapa nunca diz o estado de um valor"
src/data/metodo.mjs` dá **0**.

```
$ npm run ledger:check                                                  exit 1

  A AMARRA DAS DECISÕES NÃO FECHA · 1 erro(s):

    ✗ IDENTIDADE.md cita, como sendo do "metodo":
        «A cor de um mapa nunca diz o estado de um valor, e uma legenda não é
         uma medição.»
        e essa frase não existe em src/data/metodo.mjs.
        Ou o texto governado mudou e a citação ficou para trás, ou a citação
        nunca foi essa. A constituição cita palavra por palavra, ou não cita.
```

Revertida — a frase saiu inteira da §2 —, o portão volta a exit 0.

**O que as duas plantas provam, e o que não provam.** Provam que uma citação
**marcada** tem de existir no texto que nomeia, e que o `FECHO` é agora um desses
textos. Não provam nada sobre uma frase que nasça já diferente e **sem** marca:
esse é o limite que a cabeça do bloco escreve, e continua a ser de quem escreve.

### As réguas, com a árvore final

```
npm run build                             exit 0
npm run verify                            exit 0
npm run ledger:check                      exit 0
node scripts/ortografia.mjs --verificar   exit 0
```

```
  amarra das decisões · 24 entrada(s) a partir da §1.38 · 2 texto(s)
  governado(s) · 2 citação(ões) da constituição conferida(s), de 43 entre «…»
  ✓ cada texto no ar tem uma decisão registada que o governa, e cada frase que
    a constituição lhe cita está lá.
```

**As citações conferidas passam de 1 para 2**, de 43 entre «…» — a §5 (a regra 5
do Método) e a §2 (a entrada «A cor» do fecho). As restantes 41 não trazem
marca, e o que a amarra confirma delas é o que ela pode confirmar: nenhuma, das
que têm 40 caracteres ou mais, bate contra uma cadeia do Método ou do Sobre —
agora que o `FECHO` também é lido. Abaixo desse limite não são conferidas, por
serem termos entre aspas e não frases (`CITACAO_MINIMA`).

**Modelo e gasto**: Claude Opus, `claude-opus-5[1m]`, do princípio ao fim; nenhum
sub-agente. Ficheiros tocados: `scripts/check-ledger.mjs` (o identificador e o
comentário que diz porquê), `IDENTIDADE.md` (a §2), `design/especime-v3/ISSUES.md`
(I56) e esta nota. Nenhum ficheiro de texto governado, nenhuma vista, nenhuma
linha do livro-razão, nenhum número novo.
