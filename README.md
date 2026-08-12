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

`npm run build` são quatro passos encadeados, e qualquer um deles pára tudo:

1. `ledger:check` — o livro-razão está completo e a aritmética bate certo;
2. `astro build` — se um gabarito citar uma afirmação que não existe, o build atira;
3. `gate:html` — varre `dist/` à procura de algarismos sem proveniência;
4. `check:dados` — os ficheiros de dados descarregáveis existem e batem certo
   com as suas origens.

Os três primeiros são os portões da casa e não se afrouxam. O quarto é mais
recente e existe para que uma promessa do Método não volte a ser falsa — ver
[«Os dados por trás dos gráficos»](#os-dados-por-trás-dos-gráficos).

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

scripts/
  check-ledger.mjs        antes do build: completude e aritmética
  gate-html.mjs           depois do build: varre dist/ à procura de algarismos órfãos
  check-dados.mjs         depois do build: os CSV existem e batem certo com as origens

src/
  lib/ledger.mjs          carrega, valida e serve o livro-razão
  lib/routes.mjs          a tabela de rotas (navegação, hreflang, sitemap)
  lib/dados.mjs           gera os CSV descarregáveis a partir das mesmas origens
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

Ainda por ligar. Quando for:

- saída estática — serve-se `dist/` e mais nada;
- `oestadodopais.pt` → **301** → `oestadodopaís.pt` (DNS/Vercel);
- os URLs não têm barra final; conferir que o alojamento serve `/metodo` e
  `/metodo/` sem redireccionamento em cadeia;
- `public/js/*.js` é servido tal como está no repositório, sem empacotamento,
  de propósito: o ficheiro que se lê é o ficheiro que corre.

## O que falta

Ver [`DECISIONS.md`](DECISIONS.md).
