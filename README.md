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
npm run check:cadeia   # a cadeia de cada algarismo das páginas de leitura
npm run verify:deploy  # confere o que está NO AR contra origin/main
```

Requer Node ≥ 22.12 (exigência do Astro 7).

`npm run build` são quinze passos encadeados a 02.09.2026 (dizia «oito», a
cadeia de 15.08), e qualquer um deles pára tudo:

1. `ledger:check`: o livro-razão está completo e a aritmética bate certo, e
   toda a entrada do `DECISIONS.md` a partir da §1.38 declara que texto governa,
   com o resumo desse texto tal como ele está (a **amarra das decisões**: uma
   mudança de rumo não sai em silêncio);
2. `check:registo` — os números de estado dos documentos que governam contra o
   que se mede na fonte: as linhas do livro-razão, os concelhos com página, os
   estudos e as edições do arquivo, os documentos alojados, as correções
   publicadas, os passos desta cadeia e as páginas de leitura. Uma afirmação sem
   data é o estado de hoje e tem de bater certo; uma afirmação datada sai da
   conferência pela forma («2 916 linhas a 02.09.2026», «dizia «132 linhas»»). E
   um valor do sítio citado num desses documentos traz o id da sua linha ao
   lado, ou a construção pára. Foi por aqui que uma população de Évora que nunca
   foi medida entrou no ficheiro que cada sessão lê primeiro, e este passo
   recusa-a duas vezes: pelo valor, que não é o da linha, e pela falta do id
   (`AUDITORIA-2026-09-02.md` §6, «O caso dos 53 011»);
3. `check:cruzamento`: cada linha **e cada ficheiro** que veio do motor de
   investigação é, byte a byte, o que atravessou, e as invariantes da agenda são
   reconferidas deste lado (ver [«Linhas cruzadas»](ledger/README.md));
4. `check:documentos` — cada documento de estudo alojado é, byte a byte, o que o
   manifesto declara, **e cada registo de conteúdo que atravessou do motor** é,
   byte a byte, o que o registo de travessia declara (ver
   [`registos/README.md`](registos/README.md));
5. `astro build` — se um gabarito citar uma afirmação que não existe, o build atira;
6. `stamp:version` — carimba em `dist/version.json` o commit de que a construção saiu;
7. `cartoes` — os cartões de partilha, desenhados e rasterizados depois de a
   construção resolver os dados e antes de o portão os conferir;
8. `gate:html` — varre `dist/` à procura de algarismos sem proveniência, e
   ainda de mais cinco coisas: nas páginas em pt-PT, nenhuma forma anterior ao
   Acordo Ortográfico de 1990; em qualquer página das duas edições, nenhum
   travessão no texto renderizado (`IDENTIDADE.md` §9, `DECISIONS.md` §1.38);
   o texto do Sobre igual, carácter a carácter, ao que está decidido em
   `src/data/sobre.mjs`; a porta para o Sobre em todas as páginas construídas;
   cada número marcado `data-prova` reconferido contra a conta que o próprio
   portão faz da mesma coisa (`IDENTIDADE.md` §10, `DECISIONS.md` §1.39); e cada
   campo marcado `data-agenda` comparado, carácter a carácter, com o registo da
   agenda que atravessou do motor, mais a contagem do que a página rende contra
   a do registo da travessia (`DECISIONS.md` §1.40). Nas páginas de leitura
   (`/estudos/<slug>/texto`) corre ainda um ramo próprio com sete conferências,
   L1 a L7: a sequência de blocos, o texto de cada unidade pela leitura do olho,
   os intervalos de ênfase e as ligações, o `printed` de cada figura — nunca o
   `value` —, as contagens, o selo de quem tem linha e a porta de quem não tem, e
   os `<th>` (`DECISIONS.md` §1.64 e §2.2 item 9). No fim, escreve
   `dist/prova.json` e relê-o;
9. `check:cadeia` — por edição com registo de conteúdo, percorre a cadeia de
   cada algarismo da página de leitura até onde ela chega: o resumo de origem do
   documento, a linha do motor, a linha do livro-razão deste sítio quando
   existe, a posição no registo, a marca `data-registo` na página construída e a
   saída (o selo, ou a porta para a entrada em «As linhas deste documento»). Diz
   qual das duas formas cada algarismo tem, completa ou do motor, recusa a
   construção quando não tem nenhuma, e escreve `dist/cadeia.json` com as oito
   contagens e as contagens por edição (`DECISIONS.md` §1.64, P3);
10. `check:dados` — os ficheiros de dados descarregáveis existem e batem certo
    com as suas origens;
11. `check:mapa` — as sete regras do mapa dos distritos: os resumos dos
    ficheiros que o motor atravessou, os 308 concelhos uma vez cada um na
    junção conferida no sítio, e as ilhas dentro da sua caixa;
12. `check:regioes` — cada região com linhas tem página nas duas edições, cada
    página cita as afirmações que a sua entrada declara, e nenhuma região sem
    linhas tem página nenhuma;
13. `check:areas` — o mesmo para as áreas de governo: cada área com peças tem
    página nas duas edições, e cada peça do mapa tem a sua página construída;
14. `check:voz` — a autorreferência a zero fora do Método, do Sobre e do recibo
    (Emendas 15 e 18), medida no `dist/` e não numa régua à parte;
15. `check:lingua` — cada unidade, título, rótulo de fonte e nome de organismo
    que aparece na língua contrária traz a marca que o diz, nas duas edições.

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

**`oestadodopais.pt`** (sem acento) e as duas formas com `www.` fazem **308**
para o canónico. As três rotas estão declaradas no `vercel.json` e são
conferidas no ar por `verify:deploy` (ver [Deploy](#deploy)). O DNS aponta os
domínios à Vercel; o nome continua escrito uma só vez, em `site.config.mjs`, e é
de lá que a conferência deriva os três anfitriões.

## Esquema de URLs

| Página            | PT                    | EN                        |
| ----------------- | --------------------- | ------------------------- |
| Início            | `/`                   | `/en`                     |
| Sobre             | `/sobre`              | `/en/about`               |
| Método            | `/metodo`             | `/en/method`              |
| Correções         | `/correcoes`          | `/en/corrections`         |
| Arquivo           | `/estudos`            | `/en/studies`             |
| Estudo            | `/estudos/<slug>`     | `/en/studies/<slug>`      |
| Texto             | `/estudos/<slug>/texto` | `/en/studies/<slug>/text` |
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
página está em [`src/data/municipios.mjs`](src/data/municipios.mjs) — os 308 a
02.09.2026, uma entrada escrita à mão (`evora`) e 307 geradas de
`src/data/concelhos.gerado.json`; dizia «hoje só `evora`», o estado até ao bloco
dos 308. O índice `/municipios` lista os **308** concelhos pelo nome que a Carta
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
| `/estudos/<slug>/texto` | o **documento**, composto no gabarito da casa a partir do registo de conteúdo do motor | o documento, e o gabarito compõe-o | a nona origem: cada algarismo comparado com o `printed` da sua figura no registo, carácter a carácter |
| `/estudos/<slug>/documento` | o **trabalho**, tal como foi publicado | o documento, no dia em que foi publicado | dispensado: obra citada, com proveniência própria |

A página de leitura existe **só onde há registo de conteúdo** — hoje oito
edições com registo, seis portuguesas e duas inglesas — e a diferença diz-se pela porta que
falta na página do estudo, não por uma frase. É uma **transcrição de um
documento fixado**: nada é reformatado, nem números, nem espaços, nem
travessões, e o portão compara-a com o registo unidade a unidade. Nesta sessão
leva `noindex` e fica fora do mapa do sítio; a decisão de a indexar é da sessão
de UX.

A página do estudo diz o que se sabe do trabalho — título, descrições nas duas
línguas, tema, edições com data de publicação e de última actualização, o estado
da migração, o documento quando existe, e as descargas (hoje nenhumas, e di-lo
por palavras). **Não tem resumo nem números do estudo**: um resumo escrito sem
ler o estudo seria conteúdo inventado, e os números do estudo só entram quando
cada um tiver a sua linha no livro-razão.

Hoje estão alojados **dezasseis documentos** a 02.09.2026 (dizia «treze»): todas
as dezasseis edições do arquivo, dos seus doze trabalhos. Não falta nenhuma.

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
| `/livro-razao.csv` | uma linha por registo, com cabeçalho (2 916 linhas a 02.09.2026; corrigido nesse dia: dizia «as 132 linhas», a contagem de 18.08). RFC 4180 inteiro: aspas duplicadas, fim de linha CRLF e **nenhuma linha de comentário**, ao contrário dos dois CSV acima |
| `/livro-razao.json` | as mesmas linhas, com a estrutura que o CSV achata, e um bloco `_` que diz o que o ficheiro é |
| `/livro-razao/<id>.json` | uma linha, um ficheiro por registo (2 916 a 02.09.2026; corrigido nesse dia: dizia «132 ficheiros») |

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

registos/
  <slug>/<lg>.record.json o registo de conteúdo de uma edição, tal como o motor o escreveu
  <slug>/<lg>.cortes.json as operações da passagem de voz que o fizeram
  manifest.json           o registo de travessia: o que atravessou, de que ficheiro e commit,
                          com os dois resumos de cada ficheiro
  README.md               ficheiro gerado, quem o escreve e as seis conferências

studies-src/
  <slug>/pt.html          o documento original de um estudo, alojado intacto
  <slug>/en.html          a edição inglesa do mesmo
  _raw/<slug>.<lg>.html   os bytes tal como foram descarregados — o rasto de auditoria
  manifest.yml            uma linha por edição: origem, data, tamanhos e resumos
  README.md               o processo de dois passos, e o que o build impõe

scripts/
  check-ledger.mjs        antes do build: completude e aritmética
  check-documentos.mjs    antes do build: os documentos alojados contra o manifesto, e os
                          registos de conteúdo contra o registo de travessia (D1 a D6: o
                          resumo de cada registo e de cada ficheiro de operações, nenhum
                          ficheiro sem entrada, o slug e a língua contra o arquivo, o
                          registo contra os bytes do documento alojado, e as contagens de
                          blocos e de referências recontadas)
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
  provar-eyetext.mjs      as duas provas da leitura do olho do lado do sítio: contra os
                          registos do motor, e o conhecido-positivo (fora do build)

src/
  lib/ledger.mjs          carrega, valida e serve o livro-razão
  lib/conjunto.mjs        o livro-razão como CSV e JSON descarregáveis
  data/licenca.mjs        a licença do conjunto: null até a direcção decidir
  lib/prova.mjs           os números do sítio sobre si próprio, calculados na construção
  lib/routes.mjs          a tabela de rotas (navegação, hreflang, sitemap)
  lib/dados.mjs           gera os CSV descarregáveis a partir das mesmas origens
  lib/documentos.mjs      descobre os documentos de estudo e põe-lhes a faixa
  lib/registos.mjs        lê os registos de conteúdo que atravessaram do motor
  lib/registo-html.mjs    o renderizador: do registo para as peças da página de leitura
  lib/eyetext.mjs         a leitura do olho, portada do motor: o texto bloco a bloco
  lib/cruzamento.mjs      da linha do motor para a linha deste livro-razão, ao contrário
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
  pages/**/texto/         o documento de um estudo, composto do seu registo de conteúdo
  styles/                 tokens.css (os @font-face, a paleta e as fichas) + site.css;
                          mais uma folha por família de página: inicio, leitura,
                          linha, municipio, texto, importadas pela vista que as usa

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

Ligado desde 12.08.2026, em [Vercel](https://vercel.com). Saída estática:
serve-se `dist/` e mais nada.

### O `vercel.json` é um só sistema de encaminhamento

Desde 22.08.2026 o ficheiro tem duas chaves, `$schema` e `routes`, e mais nada.
Não é gosto, é uma medição. A pré-visualização n.º 3 desse dia levou um bloco
`routes` (a regra do 404 inglês) ao lado do bloco `headers` que já lá estava, e
a Vercel deixou de aplicar o `headers`: os cinco cabeçalhos de segurança
desapareceram das respostas, com a pré-visualização anterior, sem `routes`, a
trazê-los todos como controlo. A referência do `vercel.json` diz que os blocos
coexistem; a 22.08 o serviço não fazia isso. Um bloco ignorado em silêncio é
pior do que um bloco que não existe, por isso tudo passou para `routes` e nada
ficou em `headers`, `redirects` ou `rewrites` (ISSUES I53, DECISIONS §1.62).

As rotas são processadas por ordem, e a ordem é o programa:

1. **os cinco cabeçalhos de segurança**, em todas as respostas:
   `X-Content-Type-Options: nosniff`, `Referrer-Policy:
   strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`,
   `Strict-Transport-Security: max-age=15552000` e `Permissions-Policy:
   camera=(), microphone=(), geolocation=()`. Leva `continue: true`, por isso
   acrescenta e não termina;
2. **o escudo do alias**: `X-Robots-Tag: noindex` quando o anfitrião é
   `o-estado-do-pais.vercel.app`, também com `continue`. **Indexação aberta
   desde 13.08.2026**: o escudo foi retirado do domínio canónico e mantido no
   alias, para que o alias não concorra com o domínio nos motores de busca. As
   páginas que não se oferecem ao índice continuam a dizê-lo na sua própria
   marca `<meta name="robots">`, lida do livro-razão e conferida pelo portão
   (DECISIONS §1.24);
3. **os três 308 de anfitrião**, uma rota cada: `www.xn--oestadodopas-2fb.pt`,
   `oestadodopais.pt` e `www.oestadodopais.pt` respondem `308` com
   `Location: https://xn--oestadodopas-2fb.pt/$1`. A resposta termina aí;
4. *(a 22.08.2026 houve aqui duas sondas temporárias, presas ao anfitrião da
   pré-visualização do ramo `pos-fusao-v3`: `/sonda-308` e um `X-Sonda: host`
   com `continue`, para provar numa pré-visualização o que só produção
   exercitaria: que `has` de anfitrião selecciona, que `status` mais `Location`
   redirecciona, e que um cabeçalho condicionado ao anfitrião com `continue` é
   mesmo aplicado. Provaram-no e saíram no commit `a3b9d1d`; a leitura está em
   `design/especime-v3/notas/pos-fusao.md`, §I53);*
5. `{ "handle": "filesystem" }`, a fase que serve o que existe em `dist/`. Está
   marcado como deprecated na referência e continua suportado: é a forma da
   própria base de conhecimento da Vercel para um 404 à medida;
6. **o 404 da edição inglesa**: um `/en/(.*)` que não bateu em nada responde
   `404` com `dist/en/404/index.html`. É a razão de tudo isto (ISSUES I53).

O 404 português não precisa de rota nenhuma: a Vercel serve o `404.html` da raiz
a tudo o que não bate em mais nada. É isso que leva `/nao-existe` e
`/estudos/nao-existe` à página portuguesa, e é isso que faz `/404` responder 404
ao seu próprio endereço, enquanto `/en/404` responde 200 por ser uma página como
as outras.

Duas coisas que não mudaram: os URLs não têm barra final, e convém conferir que
o alojamento serve `/metodo` e `/metodo/` sem redireccionamento em cadeia;
`public/js/*.js` é servido tal como está no repositório, sem empacotamento, de
propósito, para que o ficheiro que se lê seja o ficheiro que corre.

### O que confere isto depois de cada publicação

`npm run verify:deploy` deixou de perguntar só pelo commit que está no ar.
Pergunta também, contra o sítio publicado:

- os cinco cabeçalhos, com o valor exacto, em `/` e em `/en/ledger`;
- `X-Robots-Tag: noindex` presente no alias e **ausente** no domínio canónico;
- os três 308, com o `Location` exacto;
- um endereço inexistente a receber a página de erro da **sua** edição:
  `/en/nao-existe` em `en`, `/nao-existe` em `pt-PT`;
- as duas páginas de erro no sítio: `/en/404` a 200 em inglês, `/404` a 404 em
  português.

Cada pergunta imprime o observado ao lado do esperado, e uma falha qualquer sai
com código != 0. **Nenhuma segue um redireccionamento** (`redirect: 'manual'`):
um 308 conferido pelo seu destino não prova o 308, prova o destino. Para ver a
conferência falhar, aponte-se-lhe uma pré-visualização protegida,
`npm run verify:deploy -- --host <alias>.vercel.app`: ela responde 302 à entrada
da Vercel e reprova tudo o que depende do anfitrião, deixando passar só os três
308, que são de anfitriões fixos.

## O que falta

Ver [`DECISIONS.md`](DECISIONS.md).
