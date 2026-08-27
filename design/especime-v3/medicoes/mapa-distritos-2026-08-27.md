# O mapa por distritos — os factos que o desenho pede

Medição de 27.08.2026. Nada foi construído. Cada afirmação leva a sua etiqueta:
**[V]** verificado (descarregado, aberto ou medido hoje) · **[I]** inferido (dito de
onde vem). Nenhum URL, licença ou número aqui é lembrado: todos foram obtidos nesta corrida.

Scripts e dados ao lado (`*.py`, `medicoes.json`, `por-distrito-0.25-2000.json`,
`artefactos/`, `artefactos-distrito/`, `ver-*.png`).

## 1 · As fontes

**[V]** Três conjuntos em dados.gov.pt, os três da Direção-Geral do Território, os três
com `license: cc-by` (lido na API de dados.gov.pt hoje, HTTP 200):

| Conjunto | Página | Ficheiro (HTTP 200 hoje) | Bytes | sha256 | Last-Modified |
|---|---|---|---|---|---|
| CAOP2025 Continente | `dados.gov.pt/datasets/carta-administrativa-oficial-de-portugal-caop2025-continente` | `geo2.dgterritorio.gov.pt/caop/CAOP_Continente_2025-gpkg.zip` | 111 647 845 | `87cd67f4…be3ecd1d` | Mon, 02 Feb 2026 14:26:40 GMT |
| CAOP2025 RAA | `…-caop2025-raa` | `…/CAOP_RAA_2025-gpkg.zip` | 15 909 724 | `b0e3b4fe…c4df9dcf` | Mon, 02 Feb 2026 14:29:12 GMT |
| CAOP2025 RAM | `…-caop2025-ram` | `…/CAOP_RAM_2025-gpkg.zip` | 15 235 290 | `ae568ca2…9a17e5d6` | Mon, 02 Feb 2026 14:27:46 GMT |

**[V]** Os três resumos batem, byte a byte, com os de `ResearchHub/publisher/dados/manifest.json`
de 18.08.2026: **a edição não mudou**.
**[V]** Licença: a frase da DGT relida hoje em `www.dgterritorio.gov.pt/dados-abertos` (HTTP 200),
igual à que o motor transcreveu — «licença de utilização CC-BY 4.0 … tendo apenas como obrigação
a menção de que a entidade proprietária da informação é a Direção-Geral do Território». Sem
partilha-igual, sem cláusula não-comercial.
**[V]** Cada conjunto oferece **três** recursos — o zip (GeoPackage), um WMS e a raiz do OGC API.
Sem Shapefile nem GeoJSON listado. O OGC API tem `municipios` e `distritos` da CAOP2025, mas
**só do Continente** (`numberMatched` 278 e 18).

## 2 · O que os ficheiros têm

**[V]** 308 municípios: 278 (`cont_municipios`) + 11 (`ram_municipios`) + 16
(`raa_cen_ori_municipios`) + 3 (`raa_oci_municipios`).
**[V] Os distritos são uma camada, não é preciso dissolver**: `cont_distritos` (18),
`ram_distritos` (2), `raa_cen_ori_distritos` (7), `raa_oci_distritos` (2) = 29 — os mesmos 29
de `DISTRITOS`. O `n_municipios` que cada uma declara bate com a contagem nos 29, e soma 308.
**[V]** E dissolver dá o mesmo desenho: diferença simétrica entre a camada e os municípios
dissolvidos = **0,000000 u²** sobre 113 320,91 u², nos 29.
**[V]** SRS: EPSG:3763 (Continente), 5016 (Madeira), 5015 (Açores centro+oriental), 5014 (ocidental).

## 3 · A projecção que os centróides implicam

**[V]** Web Mercator (EPSG:3857), semelhança sem rotação, y invertido, **três blocos**.
Ajustada por mínimos quadrados sobre os 308 pontos publicados:

| Parcela | escala (u/m de Mercator) | tx | ty | resíduo mediano | máx |
|---|---|---|---|---|---|
| Continente | 8,6218865780e-04 | 1202,2888 | 4520,1008 | 0,0395 | 0,0743 |
| Madeira | 8,6340692451e-04 | 1812,2126 | 3830,4531 | 0,0814 | 0,5894 |
| Açores | 3,2615311052e-04 | 1161,2995 | 2183,7032 | 0,0368 | 0,0664 |

**[V]** As coordenadas publicadas têm uma casa decimal: o arredondamento sozinho dá até
0,0707 u de erro. O Continente e os Açores estão **no piso do arredondamento** — o cabeçalho
de `caop-centroids.mjs` está confirmado. Razões medidas: Madeira/Continente = **1,001413**
(o cabeçalho diz «à mesma escala»), Açores/Continente = **0,378285** (o cabeçalho diz 0,38×).
**[V]** Os centróides são os do multipolígono INTEIRO: o de Funchal publicado (189,7 · 514,4)
bate com o de tudo (189,43 · 513,87) e não com o das Selvagens de fora (186,0 · 503,96).

**[V] O campo 600×790 guarda os 308 pontos e NÃO guarda os 308 polígonos.**
Continente: x até **608,3** (Miranda do Douro, 8,3 para lá de 600). Funchal: y até **802,3**
(12,3 para lá de 790 — as Selvagens). A moldura da Madeira declara y 433,6–526,5 e os
polígonos vão de 452,5 a 802,3. Os Açores cabem: x 26,0–253,1 ⊂ 14–264, y 609,6–739,2 ⊂ 584,9–749,2.

## 4 · O orçamento

Uma topologia sobre os 308 (1717 arcos), arcos simplificados **uma vez** — dois vizinhos nunca se
afastam. Douglas-Peucker por `topojson` 1.10 sobre `shapely` 2.1.2 e `pyproj` 3.7.2. Sobreposição
entre vizinhos: **0,0000 %** em todas as tolerâncias. `abs2` = absoluto, 2 casas; `int10` = ×10
inteiro, `l` relativo, viewBox 6000×7900.

| tol (u) | px a 490 | vértices | abs2 | gzip | int10 | gzip | 29 distritos int10 | gzip | junção |
|---|---|---|---|---|---|---|---|---|---|
| Carta | — | 1 602 464 | 22 016 869 | 3 627 152 | 1 398 519 | 161 116 | — | — | 304/308 |
| 0,02 | 0,016 | 137 526 | 1 889 373 | 587 131 | 560 329 | 134 736 | 185 954 | 45 020 | 304/308 |
| **0,05** | 0,041 | 76 047 | 1 045 208 | 324 641 | 332 440 | 99 735 | 109 306 | 33 329 | 304/308 |
| **0,15** | 0,122 | 35 187 | 484 292 | 148 910 | 161 366 | 58 058 | 53 025 | 19 669 | 304/308 |
| **0,40** | 0,327 | 17 262 | 238 168 | 73 762 | 84 402 | 33 094 | 28 612 | 11 462 | 304/308 |
| 1,00 | 0,817 | 9 612 | 133 190 | 39 818 | 44 733 | 19 086 | 16 853 | 7 065 | 303/308 |

Área guardada 100,001 % a 100,055 %. A 1,00 um município parte-se em GeometryCollection e a
junção perde um: **1,00 é a parede**.

**Sob ~150 KB, país inteiro** — ficheiros reais de `gerar.py` (SVG completo, com `<path>` e
atributos de dados): a **tol 0,30** o mapa dos 308 concelhos em `int10` mede **117 646 B**
(gzip 43 426) e o dos 29 distritos **34 914 B** (gzip 13 854). A 0,15 os 308 sobem a 177 057 B,
acima dos 150 KB. **A resposta é 0,30 em `int10`** — 0,25 px de erro a 490 px.

## 5 · Uma tolerância só não serve o distrito aberto

**[V]** Ampliação para encher a folha: de **1,75 px/u** (Ilha da Madeira) a **208,4 px/u** (Ilha do
Corvo) — factor 119. Com a tolerância única de 0,15 o erro no ecrã vai de 0,26 px a **31,3 px**:
a medição recusa um ficheiro só.
**[V]** Fixando o erro no ecrã (0,25 px) e derivando a tolerância de cada distrito
(`por_distrito.py`, grelha local inteira 0..2000): **29 ficheiros, 376 491 B, gzip 145 000 B**;
maior **Lisboa 22 841 B**; mediana ≈13,7 KB. O leitor traz o mapa do país mais **um** distrito.

## 6 · Legibilidade

**[V]** Mapa do país, 490 px (0,8167 px/u) e 360 px (0,6): **nenhum concelho é alvo** — 305/308 com
caixa menor que 44 px a 490, 307/308 a 360. Nada colapsa: 0 concelhos abaixo de 1 px² até à tol
0,40 a 490 px (a 360 px e tol 0,40, um: Corvo, 0,82 px²). Menores a 490 px: Corvo 1,38 × 2,19 px
(2,08 px²), Lagoa/São Miguel 3,64 × 2,74, São João da Madeira 3,01 × 3,92.
**[V]** Como alvos, os distritos: 10 dos 29 abaixo de 24 px a 490 px — as nove ilhas dos Açores e
Porto Santo. Cada ilha precisa de 4,2 a 26,0 px/u para ser alvo de 44 px, contra os 0,82 do mapa
do país: **5,2× a 31,8×**.
**[V]** Distrito aberto: os 308 passam a áreas (129 a 1707 px² o menor de cada distrito). Ficam
23/308 com caixa abaixo de 44 px no computador e 44/308 no telemóvel — Entroncamento 17,2 px,
São João da Madeira 20,4, Porto 33,9, Ponta do Sol 15,8.
**[V] As larguras do enunciado não são as da folha.** `src/styles/inicio.css`: `.mapa-tela` tem
281 px, e 100 % da coluna a partir de 1024 (o comentário mede 1092 px a 1280); **abaixo de 640 px
o mapa não se rende** (Emenda 18). A 281 px, 307/308 e 18/29 ficam abaixo de 44 px.

## 7 · Prova de junção e prova de nomes

**[V] 304/308** contêm o seu próprio centróide publicado — **e os mesmos quatro falham sobre a
Carta por simplificar**. A simplificação **não acrescenta uma falha** de 0,02 a 0,40 (a 1,00
acrescenta Mourão, 0,034 u). Os quatro: **Funchal 6,33 u** fora (as Selvagens puxam o centróide
ponderado pela área para o mar), **Santa Cruz 2,21 u** (as Desertas), **Peso da Régua 0,83 u** e
**Vila Real de Santo António 0,42 u** (formas côncavas). **[V]** `representative_point()` cai
dentro em **308/308**; deslocação mediana ao centróide 1,33 u (1,09 px a 490).

**[V] Nomes: zero divergências.** Os pares (`municipio`, `distrito_ilha`) dos quatro GeoPackages,
os de `caop-centroids.mjs` e os dos três CSV alojados em `public/dados/` são **as mesmas 308
cadeias Unicode**, sem normalizar. Os 29 `DISTRITOS` são iguais ao campo `distrito` da camada e ao
`distrito_ilha` dos municípios. Só «Lagoa» se repete. **[V]** Os aliases de
`publisher/concelhos_join.py` (cinco CAOP↔INE, cinco DGAL↔INE, dois IEFP↔INE) são do eixo da
junção com o INE e **não** são precisos na geometria.

## 8 · O caminho recomendado

**Motor.** Nada de novo para descarregar: `publisher/caop_municipios.py` já traz e guarda os três
zips. Um irmão (`publisher/caop_geometria.py`) lê os mesmos GeoPackages da cache, constrói a
topologia uma vez e escreve os artefactos, com a mesma disciplina de manifesto (asset, sha256,
bytes, licença, atribuição, `extracted_from` com o sha256 do zip).

**Sítio: SVG de caminhos com atributos de dados, não JSON.** (a) Um distrito abre sem JavaScript,
e um `<path>` dentro de um `<a href>` é navegação sem script; (b) **medido**, o JSON não é menor —
`concelhos.int100.json` 166 124 B contra `mapa-concelhos.int100.svg` 166 834 B (0,4 %), e ainda
precisa de script para virar caminho; (c) `MapaRespira.astro` já escreve `data-m`/`data-d`/`data-caop`
em cada `<circle>`: os mesmos atributos num `<path>` mantêm um vocabulário só.

**Dois ficheiros, duas tolerâncias:** `mapa-distritos.svg` — 29 caminhos, tol 0,30, `int10`,
**34 914 B** (gzip 13 854) — na primeira página; `distrito-<slug>.svg` — 29 ficheiros, tolerância
própria de cada um, grelha local 0..2000, **376 491 B** no total, **22 841 B** o maior — um em
cada página de distrito.

**[V] Verificação a olho**: os SVG escritos foram relidos, o `d` reinterpretado e desenhado
(`ver.py` → `ver-distritos-030.png`, `ver-concelhos.png`, `ver-lisboa-final.png`,
`ver-madeira-final.png`). É Portugal, e o codificador fecha o ciclo.

## 9 · Perguntas em aberto para o desenho

1. **Como abre um distrito sem JavaScript.** A medição aponta a uma página por distrito (`<a href>`
   em cada caminho): 34,9 KB na primeira página, 22,8 KB no pior caso. `:target` com os 29 SVG no
   mesmo documento custaria 376 KB em todas as páginas.
2. **A moldura das ilhas com um distrito aberto.** Os Açores não podem manter uma escala geográfica
   só e ser alvos: cada ilha precisa de 5,2× a 31,8× a escala do país. A quebra dos `FRAMES`
   (0,378×) já existe e é declarada; falta uma segunda, por ilha.
3. **O campo.** 600×790 não guarda os polígonos (+8,3 a este, +12,3 a sul). Ou o `viewBox` cresce,
   ou a transformação se reajusta ao contorno — e reajustar move os 308 pontos, que
   `caop-centroids.mjs` manda não editar à mão.
4. **As Selvagens e as Desertas** são Funchal e Santa Cruz na Carta. Guardadas, a folha da Madeira
   fica 85 % oceano e desenha a 1,75 px/u em vez de 8,35 — os outros dez concelhos perdem 4,8× de
   detalhe. Custo de largar: Selvagens 2,77 u² de 801,19 (0,35 %); com as Desertas, 17,26 u² (2,15 %).
5. **O ponto e a área discordam em quatro dos 308.** Se o mapa por distritos guardar os pontos, o de
   Funchal fica 6,33 unidades fora da sua própria área.

## 10 · O que não foi possível verificar

- **Se a DGT publica Shapefile ou GeoJSON da CAOP 2025.** dados.gov.pt lista só zip(GeoPackage),
  WMS e OGC API **[V]**; a listagem de `geo2.dgterritorio.gov.pt/caop/` devolve **403** e não se
  pode enumerar **[V]**; um URL `-shp.zip` que tentei devolveu **404** **[V]**. Não prova ausência.
- **Se o OGC API tem colecções das ilhas.** Das 75 colecções, as oito da CAOP2025 são as que
  encontrei, e `municipios` devolve 278 **[V]**. Não abri as 75 descrições uma a uma.
- **As larguras 490/360 são as do enunciado**, não as da folha (281 px e 100 % da coluna; nada
  abaixo de 640) **[V]**. As contas estão feitas para as quatro.
- **A altura de um distrito aberto** (560 px no computador, 520 no telemóvel) é pressuposto meu
  para derivar a ampliação; nada no sítio a fixa ainda.
