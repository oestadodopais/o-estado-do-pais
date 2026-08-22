# O Estado do País

Observatório de dados sobre Portugal. **Escrito por IA, dirigido por uma pessoa.**

> Portugal, medido. Cada número tem fonte.

Sítio estático; o JavaScript de origem é o enriquecimento progressivo de
`public/js/` (o tema, a primeira página, a régua da convergência, a caixa de
correções), servido tal como está, e a página por defeito está correcta com ele desligado. A regra da
casa é uma só e está imposta pelo build: **nenhum número chega a uma página sem uma linha no
livro-razão.** Um número sem essa linha não é um erro de estilo — é um build
que falha.

---

## Arrancar

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run build      # verifica o livro-razão, constrói, e varre o HTML construído
npm run preview    # serve dist/ como será servido em produção
npm run verify     # só as verificações, sobre um dist/ já construído
npm run verify:deploy  # confere o que está NO AR contra origin/main
```

Requer Node ≥ 22.12 (exigência do Astro 7).

`npm run build` são sete passos encadeados, e qualquer um deles pára tudo:

1. `ledger:check`: o livro-razão está completo e a aritmética bate certo, e
   toda a entrada do `DECISIONS.md` a partir da §1.38 declara que texto governa,
   com o resumo desse texto tal como ele está (a **amarra das decisões**: uma
   mudança de rumo não sai em silêncio);
2. `check:cruzamento`: cada linha **e cada ficheiro** que veio do motor de
   investigação é, byte a byte, o que atravessou, e as invariantes da agenda são
   reconferidas deste lado (ver [«Linhas cruzadas»](ledger/README.md));
3. `check:documentos` — cada documento de estudo alojado é, byte a byte, o que o
   manifesto declara;
4. `astro build` — se um gabarito citar uma afirmação que não existe, o build atira;
5. `stamp:version` — carimba em `dist/version.json` o commit de que a construção saiu;
6. `gate:html` — varre `dist/` à procura de algarismos sem proveniência, e
   ainda de mais cinco coisas: nas páginas em pt-PT, nenhuma forma anterior ao
   Acordo Ortográfico de 1990; em qualquer página das duas edições, nenhum
   travessão no texto renderizado (`IDENTIDADE.md` §9, `DECISIONS.md` §1.38);
   o texto do Sobre igual, carácter a carácter, ao que está decidido em
   `src/data/sobre.mjs`; a porta para o Sobre em todas as páginas construídas;
   cada número marcado `data-prova` reconferido contra a conta que o próprio
   portão faz da mesma coisa (`IDENTIDADE.md` §10, `DECISIONS.md` §1.39); e cada
   campo marcado `data-agenda` comparado, carácter a carácter, com o registo da
   agenda que atravessou do motor, mais a contagem do que a página rende contra
   a do registo da travessia (`DECISIONS.md` §1.40). No fim, escreve
   `dist/prova.json` e relê-o;
7. `check:dados` — os ficheiros de dados descarregáveis existem e batem certo
   com as suas origens.

`check:cruzamento` corre **sem rede e sem o motor presente** — o construtor é
remoto e o ResearchHub não existe lá. A comparação com o lado da origem é um
modo à parte, `node scripts/check-cruzamento.mjs --with-origin`, e corre na
máquina de quem exporta.

**`verify:deploy` não faz parte do build, e é de propósito.** Todos os passos
acima correm sobre `dist/`, antes de publicar; nenhum vê o que está no ar. Este
corre contra o sítio publicado e exige que o commit no ar seja `origin/main` e
que não haja nada por empurrar. É portão de lançamento, não de construção — ver
`DECISIONS.md §1.30`.

O primeiro, o quarto e o quinto são os portões da casa e não se afrouxam. Os
outros são mais recentes: `check:cruzamento` existe porque este sítio passou a
receber linhas produzidas noutro lado e um produtor não assina por si próprio
(`DECISIONS.md §1.32`); `check:dados` existe para que uma promessa do
Método não volte a ser falsa — ver [«Os dados por trás dos
gráficos»](#os-dados-por-trás-dos-gráficos) — e `check:documentos` existe para
que «alojado intacto» seja uma verificação e não uma intenção — ver [«Os
estudos: a página e o documento»](#os-estudos-a-página-e-o-documento).

---

## Domínio

O domínio canónico é **`oestadodopaís.pt`** — acentuado, em punycode
`xn--oestadodopas-2fb.pt`.

Está definido **uma vez**, em [`site.config.mjs`](site.config.mjs), e daí sai
para o `site` do Astro, para os URLs canónicos, para os pares hreflang, para o
sitemap, para o JSON-LD e para o `robots.txt`. A forma punycode não é escrita à
mão: é derivada pela `URL` do Node, que aplica IDNA.

**`oestadodopais.pt`** (sem acento) faz **301** para o canónico. Isso é
configuração de DNS/Vercel, não código — não há nada neste repositório que o
faça, e não deve haver.

## Esquema de URLs

| Página            | PT                    | EN                        |
| ----------------- | --------------------- | ------------------------- |
| Início            | `/`                   | `/en`                     |
| Sobre             | `/sobre`              | `/en/about`               |
| Método            | `/metodo`             | `/en/method`              |
| Correções         | `/correcoes`          | `/en/corrections`         |
| Arquivo           | `/estudos`            | `/en/studies`             |
| Estudo            | `/estudos/<slug>`     | `/en/studies/<slug>`      |
| Documento         | `/estudos/<slug>/documento` | `/en/studies/<slug>/document` |
| Municípios        | `/municipios`         | `/en/municipalities`      |
| Município         | `/municipios/<slug>`  | `/en/municipalities/<slug>` |
| Livro-razão       | `/livro-razao`        | `/en/ledger`              |
| Linha             | `/livro-razao/<slug>` | `/en/ledger/<slug>`       |
| Agenda            | `/agenda`             | `/en/agenda`              |
| O marcador        | `/a-verificar`        | `/en/to-verify`           |

`/prova.json` não é uma página e não está nesta tabela: é o resumo desta
construção, escrito pelo `gate:html`, servido nas duas edições e fora do mapa
do sítio. É a porta da prova da regra da construção, no Método.

`/livro-razao.csv`, `/livro-razao.json` e `/livro-razao/<id>.json` também não
são páginas e também não estão na tabela nem no mapa do sítio: são o livro-razão
como conjunto de dados, um só para as duas edições, e nenhuma página os liga
enquanto a licença for decisão da direcção. Ver [«O livro-razão inteiro, como
conjunto de dados»](#o-livro-razão-inteiro-como-conjunto-de-dados).

Sem barra final, excepto a raiz. A saída é em directório
(`/metodo/index.html`), e o canónico e o sitemap são normalizados para a mesma
forma, sem barra — para não haver duas versões do mesmo endereço.

Um `<slug>` de estudo é o **trabalho**, não a edição: um estudo publicado em PT
e em EN tem duas entradas no arquivo e uma só página. A tabela de rotas está em
[`src/lib/routes.mjs`](src/lib/routes.mjs) e é a mesma que alimenta a navegação,
os hreflang e o sitemap.

`/agenda` diz o que este observatório está a medir, o que se segue, e o critério
que pôs lá cada coisa, com o histórico inteiro de cada mudança de estado; e traz,
na mesma página, o calendário do que as fontes publicam a seguir. Os dois
registos vêm do motor e não se escrevem aqui: `DECISIONS.md` §1.40.

Um `<slug>` de município é o nome do concelho sem acentos. A lista dos que têm
página está em [`src/data/municipios.mjs`](src/data/municipios.mjs) — hoje só
`evora`. O índice `/municipios` lista os **308** concelhos pelo nome que a Carta
Administrativa lhes dá, cada um com o seu estado; não publica nenhuma medida por
concelho. Uma página de município é uma leitura das medidas que as fontes
publicam para aquele concelho; o que ela **não** sabe está escrito na coluna do
aparelho, e não em nota de rodapé.

## Línguas

PT é a língua primária, em `/`. EN espelha em `/en/`.

**Nunca duas edições mantidas à mão.** Uma página é um ficheiro em
`src/views/` que recebe `lang` e mais nada; as rotas PT e EN são duas linhas
cada. Os dados são partilhados; só as palavras mudam, e estão em
[`src/i18n/strings.mjs`](src/i18n/strings.mjs), onde as duas línguas têm de ter
exactamente as mesmas chaves — `assertKeyParity()` falha o build se divergirem.

---

## O livro-razão

`ledger/claims/` tem um ficheiro YAML por afirmação. O nome do ficheiro é o id.

Regras completas e formato: [`ledger/README.md`](ledger/README.md).

### Pôr um número numa página

```astro
---
import Claim from '../components/Claim.astro';
---
<p>Portugal está <Claim id="distancia-portugal-ue27-2024" /> pontos abaixo da média.</p>
```

E nunca assim:

```astro
<p>Portugal está 18 pontos abaixo da média.</p>   <!-- o build falha -->
```

### Um número novo, do princípio ao fim

1. `ledger/claims/<id>.yml` com valor, unidade, fonte, documento, URL, data de
   acesso e excerto. O que não se souber escreve-se `"[a verificar]"` — nunca um
   valor plausível.
2. Se for calculado: `derivation` explica a conta, `derived_from` diz de onde
   vem, e `check` põe a aritmética numa expressão que o build reavalia.
3. Cita-se com `<Claim id="<id>" />`.
4. `npm run build`.

---

## Os estudos: a página e o documento

Um estudo migrado tem **duas coisas** neste sítio, e a distinção é o centro de
todo o mecanismo:

| | O que é | Quem o escreve | Regra de algarismos |
| --- | --- | --- | --- |
| `/estudos/<slug>` | a **página do observatório** sobre o trabalho | nós, hoje | livro-razão, como qualquer página |
| `/estudos/<slug>/documento` | o **trabalho**, tal como foi publicado | o documento, no dia em que foi publicado | dispensado: obra citada, com proveniência própria |

A página do estudo diz o que se sabe do trabalho — título, descrições nas duas
línguas, tema, edições com data de publicação e de última actualização, o estado
da migração, o documento quando existe, e as descargas (hoje nenhumas, e di-lo
por palavras). **Não tem resumo nem números do estudo**: um resumo escrito sem
ler o estudo seria conteúdo inventado, e os números do estudo só entram quando
cada um tiver a sua linha no livro-razão.

Hoje estão alojados **treze documentos**: todas as treze edições do arquivo, dos
seus dez trabalhos. Não falta nenhuma.

### Pôr o documento de um estudo no sítio

```
studies-src/<slug>/pt.html      →  /estudos/<slug>/documento
studies-src/<slug>/en.html      →  /en/studies/<slug>/document
```

Pousar o ficheiro e `npm run build`. Mais nada: **a pasta é a declaração.** Não
há registo para actualizar nem rota para escrever, e a página do estudo passa a
ligar para o documento sozinha.

Se o documento vier de um artefacto `claude.ai`, há um passo antes: os bytes
servidos trazem um runtime injectado pelo anfitrião, e
[`scripts/normalize-study.mjs`](scripts/normalize-study.mjs) tira-o — uma função
pura, de bytes para bytes, que **pára** em vez de improvisar se o invólucro não
for exactamente o que ela conhece. Os bytes descarregados ficam guardados em
`studies-src/_raw/`, e cada edição instalada tem uma linha em
[`studies-src/manifest.yml`](studies-src/manifest.yml) que `check:documentos`
reconfere a cada construção. O porquê de tudo isto — e porque é que o resumo dos
bytes brutos **não** é reproduzível e o do normalizado é — está em
[`DECISIONS.md`](DECISIONS.md) §1.20.

### Conferir de fora que um documento é mesmo o do artefacto

O build prova que o repositório é consistente consigo próprio; não prova que o
documento alojado é o do artefacto. Isso só se prova descarregando outra vez:

```bash
node scripts/verify-fetch.mjs <descarga.html> <slug> <lingua>
```

Compara o resumo normalizado em três sítios — a descarga nova, o manifesto e o
ficheiro em disco — e diz **qual dos três** destoa, que é o que separa «o autor
publicou uma versão nova» de «o ficheiro foi alterado». O resumo dos bytes
brutos é impresso mas não decide nada: ver [`DECISIONS.md`](DECISIONS.md) §1.22.

O build acrescenta ao documento **uma coisa e só uma**: uma faixa no topo do
`<body>`, com a marca do observatório ligada de volta à página do estudo, CSS
embebido e nenhum pedido de rede. Abaixo dela, o documento vai byte a byte como
está no ficheiro de origem — `<head>`, estilos e scripts intactos.

O portão confere exactamente isso: reconstrói «origem + faixa» e compara,
carácter a carácter, com o que foi construído. As regras completas, e o que
falha o build, estão em [`studies-src/README.md`](studies-src/README.md); o
porquê da dispensa está em [`DECISIONS.md`](DECISIONS.md) §1.19.

## Os dados por trás dos gráficos

O Método diz: «Os dados por trás de cada gráfico são descarregáveis.» São dois
ficheiros, e os dois são **gerados na construção**, nunca escritos à mão:

| Endereço | O que traz | Gerado de |
| --- | --- | --- |
| `/dados/convergencia.csv` | uma linha por região da régua: valor tal como publicado, ano, unidade, estudo e **o id da afirmação** | do livro-razão |
| `/dados/municipios-308.csv` | uma linha por município: nome, distrito ou ilha, região e a posição normalizada | de `src/data/caop-centroids.mjs`, com a citação da CAOP e a data de acesso no cabeçalho |

A ligação de cada ficheiro está no índice que o publica: a régua da convergência
no índice do livro-razão, os 308 concelhos no índice dos municípios, nas duas
edições. Os dois ficheiros são gerados por [`src/lib/dados.mjs`](src/lib/dados.mjs)
e servidos por endpoints em `src/pages/dados/`.

`check:dados` volta a ler os ficheiros **do `dist/`** e confronta-os com as
origens — a contagem dos municípios contra as quatro afirmações que a publicam,
cada linha da convergência contra a afirmação que ela própria nomeia, e as
ligações contra os ficheiros que existem. Não compara a saída com uma segunda
chamada ao gerador: isso não provaria nada.

## O livro-razão inteiro, como conjunto de dados

Desde 18.08.2026 (`DECISIONS.md` §1.47, T4) a construção escreve mais três
coisas, também geradas de `ledger/claims/` e nunca copiadas:

| Endereço | O que traz |
| --- | --- |
| `/livro-razao.csv` | as 132 linhas, uma por registo, com cabeçalho. RFC 4180 inteiro: aspas duplicadas, fim de linha CRLF e **nenhuma linha de comentário**, ao contrário dos dois CSV acima |
| `/livro-razao.json` | as mesmas linhas, com a estrutura que o CSV achata, e um bloco `_` que diz o que o ficheiro é |
| `/livro-razao/<id>.json` | uma linha, 132 ficheiros |

Os campos são os do formato menos `note`, e a lista não está escrita duas vezes:
é `CAMPOS_PUBLICADOS` em [`src/lib/ledger.mjs`](src/lib/ledger.mjs). Todos os
campos vão em todas as linhas, `null` ou célula vazia onde a linha não os tem.
No CSV, uma coluna é um escalar ou é JSON. Gerados por
[`src/lib/conjunto.mjs`](src/lib/conjunto.mjs); as duas edições servem-se dos
mesmos ficheiros, porque isto são dados e não prosa.

**A licença é decisão da direcção, e até ela existir nada se liga.** Uma
constante, `LICENCA` em [`src/data/licenca.mjs`](src/data/licenca.mjs), a `null`
por omissão: com `null` nenhuma página oferece estes ficheiros e o índice do
livro-razão diz o estado; preenchida, o índice oferece o CSV e o JSON com a
licença ao lado e cada página de linha ganha «Esta linha em JSON». Um só campo
muda no dia da decisão. Os ficheiros são construídos nos dois estados, e o
`check:dados` confere as duas metades: que batem certo com o livro-razão, e que
**nenhuma página os liga** enquanto a licença não existir.

## Estrutura

```
site.config.mjs           domínio, nome, linha de método, edição — a fonte única
astro.config.mjs          Astro + sitemap; importa o domínio de site.config.mjs

ledger/
  claims/*.yml            uma afirmação por ficheiro
  allowlist.yml           as únicas excepções ao portão, cada uma com motivo
  README.md               o formato e as regras

ortografia/
  formas.yml              as formas e a autoridade que as sustenta; uma lista, dois usos
  restantes.yml           o que fica por converter, rota a rota, com o motivo

studies-src/
  <slug>/pt.html          o documento original de um estudo, alojado intacto
  <slug>/en.html          a edição inglesa do mesmo
  _raw/<slug>.<lg>.html   os bytes tal como foram descarregados — o rasto de auditoria
  manifest.yml            uma linha por edição: origem, data, tamanhos e resumos
  README.md               o processo de dois passos, e o que o build impõe

scripts/
  check-ledger.mjs        antes do build: completude e aritmética
  check-documentos.mjs    antes do build: os documentos alojados contra o manifesto
  normalize-study.mjs     a função pura que separa o documento do invólucro do anfitrião
  verify-fetch.mjs        para quem vem de fora: uma descarga nova contra o que está alojado
  extract-from-transcript.mjs  recurso: os bytes de uma descarga que não escreveu ficheiro
  gate-html.mjs           depois do build: varre dist/ à procura de algarismos órfãos,
                          de grafia anterior ao Acordo e de travessões; confere o
                          texto do Sobre, a porta para o Sobre em cada página, os
                          números marcados data-prova e as ligações internas; e
                          escreve dist/prova.json
  check-dados.mjs         depois do build: os CSV e o conjunto de dados existem, batem
                          certo com as origens, e o conjunto só se liga sob licença
  ortografia.mjs          a passagem da ortografia, nos dois sentidos (à mão, não no build)

src/
  lib/ledger.mjs          carrega, valida e serve o livro-razão
  lib/conjunto.mjs        o livro-razão como CSV e JSON descarregáveis
  data/licenca.mjs        a licença do conjunto: null até a direcção decidir
  lib/prova.mjs           os números do sítio sobre si próprio, calculados na construção
  lib/routes.mjs          a tabela de rotas (navegação, hreflang, sitemap)
  lib/dados.mjs           gera os CSV descarregáveis a partir das mesmas origens
  lib/documentos.mjs      descobre os documentos de estudo e põe-lhes a faixa
  i18n/strings.mjs        as palavras, nas duas línguas, com paridade imposta
  data/
    caop-centroids.mjs    as 308 posições, transcritas da CAOP 2025
    verbatim.mjs          citações que têm de ser transcritas à letra
    studies.mjs           o arquivo: trabalhos e edições
    sobre.mjs             o texto decidido do Sobre, nas duas línguas
    metodo.mjs            as dez regras do Método, com mecanismo, prova e limite
    regioes.mjs           as regiões da régua e as suas frases
    figuras.mjs           os cartões da primeira página
  components/             Claim, Provenance, Masthead, rodapé, instrumentos
  layouts/Base.astro      <head> completo: canónico, hreflang, JSON-LD
  views/                  uma página lógica, as duas línguas
  pages/                  as rotas (duas linhas cada)
  pages/dados/            os CSV descarregáveis, servidos como endpoints
  pages/livro-razao.*     o livro-razão como conjunto de dados (CSV e JSON), e
  pages/livro-razao/[slug].json.js  um ficheiro por linha
  pages/**/documento/     o documento de um estudo, servido tal como está
  styles/                 tokens.css (os @font-face, a paleta e as fichas) + site.css;
                          mais uma folha por família de página: inicio, leitura,
                          linha, municipio, importadas pela vista que as usa

public/js/                enriquecimento progressivo, vanilla, sem empacotar
```

## Identidade

A regra é [`IDENTIDADE.md`](IDENTIDADE.md), na sua v3; as Emendas de 20 e
21.08.2026 que a governam estão em
[`design/especime-v3/direcao.md`](design/especime-v3/direcao.md). Isto é o
resumo, e onde os dois discordarem ganha o `IDENTIDADE.md`.

- **Três tipos, três funções, sem sobreposição** (§1): **Spectral** na prosa e
  na marca, **Bitter** nos valores medidos, rótulos, eixos e no que é
  transcrito, **Spectral SC** nos antetítulos e rótulos de secção. Bitter em
  caixa alta só dentro dos instrumentos (Emenda 5); algarismos tabulares
  versais em todo o valor e em toda a régua.
- **Só tipos alojados aqui** (§1, `DECISIONS.md` §1.50). Nenhum anfitrião de
  terceiros: nem `fonts.googleapis.com`, nem `fonts.gstatic.com`, nem outro. Os
  oito WOFF2 estão em `public/tipos/`, com o `OFL.txt` da família ao lado (SIL
  Open Font License 1.1); a origem, o commit fixado e o resumo SHA-256 de cada
  ficheiro estão em
  [`design/especime-v3/TIPOS.md`](design/especime-v3/TIPOS.md). As pilhas de
  sistema ficam, e só como recuo declarado na folha para o caso de um ficheiro
  não chegar.
- **A cor é o estado, e só o estado** (§2, Emenda 1). Aparece só onde a fonte
  publica um limiar formal: `--amber` `#e0a21a` no marcador do valor que está
  **fora** do limiar, com contorno de tinta, e `--ochre` `#7a5300` na palavra;
  `--cobalt` `#1f4e8c` no marcador e na palavra do que está **dentro**. «Sem
  limiar» e «por confirmar» não levam cor nenhuma: dizem-se por palavras e por
  forma. Tudo o resto é `--paper`, `--ink` e os três cinzentos, e um tipo de
  página novo não ganha uma cor.
- **O contorno do marcador âmbar é uma medição, não desenho.** Âmbar sobre
  papel claro mede 2,09:1, que não chega para um objecto de interface, e a
  tinta contra o âmbar mede 7,85:1. `node scripts/medir-contraste.mjs` mede
  cada par que a folha de facto usa, nos dois temas; um par que não esteja na
  lista dessa régua é um par que ninguém mediu.
- **Claro para toda a gente** (Emenda 12, `DECISIONS.md` §1.52),
  independentemente da preferência do sistema, com um controlo «claro · escuro»
  no cabeçalho e a escolha guardada no aparelho do leitor.
  `:root[data-theme="dark"]` é hoje o único caminho para o papel escuro; o
  bloco que consultava `prefers-color-scheme` saiu de `tokens.css`.
- **O selo é a porta** (§5). Ao lado de cada medição, um quadrado mais a
  palavra «fonte», e a unidade compacta inteira é a ligação para a linha do
  livro-razão: cheio quando a proveniência está completa, a tracejado quando
  falta um campo. No registo de correcções a porta é o selo da **linha**, e não
  o de um valor.
- **Uma correcção tem forma, e não tem cor** (§2): valor antigo riscado a
  cinzento, valor novo a tinta ao lado, e a data.
- **Duas cores saíram, e não foi por gosto** (`DECISIONS.md` §1.50): o amarelo
  da medição (`--yellow`) e o oxblood do erro admitido (`--oxblood`). Com elas
  saíram `--paper-2` e `--paper-3`, porque o aparelho se separa com fios e
  molduras cinzentas e não com painéis tingidos.

O retrato desenhável desta identidade sai de
[`scripts/design-bundle.mjs`](scripts/design-bundle.mjs), que lê `dist/` e as
folhas e escreve `design-system/` (gerado, fora do git e fora do `npm run
build`).

## SEO

Canónico no domínio acentuado (punycode) · pares hreflang PT↔EN mais
`x-default` em todas as páginas emparelhadas · JSON-LD `Organization` em todo o
sítio · JSON-LD `Article` com `creativeWorkStatus: "Draft"` nas páginas de
estudo por migrar · `sitemap-index.xml` com alternates `xhtml:link` gerados da
mesma tabela de rotas · `robots.txt` gerado da mesma constante de domínio.

## Deploy

Ligado desde 12.08.2026, em [Vercel](https://vercel.com):

- saída estática — serve-se `dist/` e mais nada;
- `oestadodopais.pt`, `www.` de ambas as formas → **308** → `oestadodopaís.pt`
  (DNS/Vercel, conferido no ar);
- **indexação aberta desde 13.08.2026.** O escudo de pré-lançamento
  (`X-Robots-Tag: noindex` em todos os endereços) foi retirado do domínio
  canónico e mantido no alias `*.vercel.app`, para que o alias não concorra com
  o domínio nos motores de busca. As páginas que não se oferecem ao índice
  continuam a dizê-lo na sua própria marca `<meta name="robots">`, que é lida do
  livro-razão e conferida pelo portão — ver DECISIONS §1.24;
- os URLs não têm barra final; conferir que o alojamento serve `/metodo` e
  `/metodo/` sem redireccionamento em cadeia;
- `public/js/*.js` é servido tal como está no repositório, sem empacotamento,
  de propósito: o ficheiro que se lê é o ficheiro que corre.

## O que falta

Ver [`DECISIONS.md`](DECISIONS.md).
