# O Estado do País

Observatório de dados sobre Portugal. **Escrito por IA, dirigido por uma pessoa.**

> Portugal, medido. Cada número tem fonte.

Sítio estático, sem JavaScript de origem. A regra da casa é uma só e está
imposta pelo build: **nenhum número chega a uma página sem uma linha no
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
```

Requer Node ≥ 22.12 (exigência do Astro 7).

`npm run build` são cinco passos encadeados, e qualquer um deles pára tudo:

1. `ledger:check` — o livro-razão está completo e a aritmética bate certo;
2. `check:documentos` — cada documento de estudo alojado é, byte a byte, o que o
   manifesto declara;
3. `astro build` — se um gabarito citar uma afirmação que não existe, o build atira;
4. `gate:html` — varre `dist/` à procura de algarismos sem proveniência;
5. `check:dados` — os ficheiros de dados descarregáveis existem e batem certo
   com as suas origens.

O primeiro, o terceiro e o quarto são os portões da casa e não se afrouxam. Os
outros dois são mais recentes: `check:dados` existe para que uma promessa do
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
| Método            | `/metodo`             | `/en/method`              |
| Arquivo           | `/estudos`            | `/en/studies`             |
| Estudo            | `/estudos/<slug>`     | `/en/studies/<slug>`      |
| Documento         | `/estudos/<slug>/documento` | `/en/studies/<slug>/document` |
| _Reservado_       | `/municipios/<slug>`  | `/en/municipalities/<slug>` |

Sem barra final, excepto a raiz. A saída é em directório
(`/metodo/index.html`), e o canónico e o sitemap são normalizados para a mesma
forma, sem barra — para não haver duas versões do mesmo endereço.

Um `<slug>` de estudo é o **trabalho**, não a edição: um estudo publicado em PT
e em EN tem duas entradas no arquivo e uma só página. A tabela de rotas está em
[`src/lib/routes.mjs`](src/lib/routes.mjs) e é a mesma que alimenta a navegação,
os hreflang e o sitemap.

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

Cada instrumento da primeira página tem a ligação na sua camada Fundo, nas duas
edições. Os dois ficheiros são gerados por [`src/lib/dados.mjs`](src/lib/dados.mjs)
e servidos por endpoints em `src/pages/dados/`.

`check:dados` volta a ler os ficheiros **do `dist/`** e confronta-os com as
origens — a contagem dos municípios contra as quatro afirmações que a publicam,
cada linha da convergência contra a afirmação que ela própria nomeia, e as
ligações contra os ficheiros que existem. Não compara a saída com uma segunda
chamada ao gerador: isso não provaria nada.

## Estrutura

```
site.config.mjs           domínio, nome, linha de método, edição — a fonte única
astro.config.mjs          Astro + sitemap; importa o domínio de site.config.mjs

ledger/
  claims/*.yml            uma afirmação por ficheiro
  allowlist.yml           as únicas excepções ao portão, cada uma com motivo
  README.md               o formato e as regras

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
  gate-html.mjs           depois do build: varre dist/ à procura de algarismos órfãos
  check-dados.mjs         depois do build: os CSV existem e batem certo com as origens

src/
  lib/ledger.mjs          carrega, valida e serve o livro-razão
  lib/routes.mjs          a tabela de rotas (navegação, hreflang, sitemap)
  lib/dados.mjs           gera os CSV descarregáveis a partir das mesmas origens
  lib/documentos.mjs      descobre os documentos de estudo e põe-lhes a faixa
  i18n/strings.mjs        as palavras, nas duas línguas, com paridade imposta
  data/
    caop-centroids.mjs    as 308 posições, transcritas da CAOP 2025
    verbatim.mjs          citações que têm de ser transcritas à letra
    studies.mjs           o arquivo: trabalhos e edições
    regioes.mjs           as regiões da régua e as suas frases
    figuras.mjs           os cartões da primeira página
  components/             Claim, Provenance, Masthead, rodapé, instrumentos
  layouts/Base.astro      <head> completo: canónico, hreflang, JSON-LD
  views/                  uma página lógica, as duas línguas
  pages/                  as rotas (duas linhas cada)
  pages/dados/            os CSV descarregáveis, servidos como endpoints
  pages/**/documento/     o documento de um estudo, servido tal como está
  styles/                 tokens.css (tema de três estados) + site.css

public/js/                enriquecimento progressivo, vanilla, sem empacotar
```

## Identidade

Portada do estudo de identidade v2 aprovado, sem alterar valores.

- **Tema de três estados**: `:root` nu com a paleta clara completa;
  `@media (prefers-color-scheme: dark)` protegido por
  `:root:not([data-theme="light"])`; `:root[data-theme="dark"]` explícito, para
  que uma escolha ganhe nos dois sentidos.
- **Três tipos, três funções, sem sobreposição**: Iowan Old Style só em marcas,
  Avenir Next só em prosa, SF Mono em todos os números e rótulos. Tudo pilhas
  de sistema — **a página não faz nenhum pedido de rede**.
- **O amarelo `#E8A80C` nunca é texto.** Só marca medição: barras, pontos
  acesos, o chip da região que está a ser lida.

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
