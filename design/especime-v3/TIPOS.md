# TIPOS · o que está alojado aqui, de onde veio, e o que foi medido

*Etapa 1b do redesenho v3, 20.08.2026, construída por Claude Opus. `IDENTIDADE.md`
§1 e `DECISIONS.md` §1.50: só tipos alojados aqui, nenhum anfitrião de terceiros;
uma família entra por decisão registada e fica no repositório com a sua licença.
Este ficheiro é o registo dessa entrada. Todos os números abaixo vêm de um
comando que está escrito ao lado deles.*

## 1. A política, e o que ela obriga

Nenhum `fonts.googleapis.com`, nenhum `fonts.gstatic.com`, nenhum outro
anfitrião. Os ficheiros estão em `public/tipos/<familia>/`, com o `OFL.txt` da
família ao lado, e são servidos por este sítio a partir da mesma origem.

**`vercel.json` foi lido nesta etapa, e não só herdado da etapa 0.** Não tem
nenhum cabeçalho `Content-Security-Policy` e nenhuma política de tipos. Os seis
cabeçalhos que declara são `X-Robots-Tag` (só no anfitrião da pré-visualização),
`X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security` e
`Permissions-Policy`. Nenhum deles restringe a origem de um tipo, e por isso os
tipos da mesma origem carregam sem mudança nenhuma ao ficheiro. **`vercel.json`
não foi tocado.**

## 2. As famílias, a origem e o commit

Os bytes vieram dos repositórios das **próprias famílias**, e não de uma
compilação de terceiros. Os `google/fonts` não foram precisos.

| Família | Repositório de montante | Commit fixado | Licença |
| --- | --- | --- | --- |
| Spectral · Spectral SC | `https://github.com/productiontype/Spectral` | `dbc06862d7030eedb1b01b60cdad8f6102f4ddfa` | SIL Open Font License 1.1 |
| Bitter | `https://github.com/solmatas/BitterPro` | `de749c69b5ffdb4b109c10d8fc331c3ecc4e39c5` | SIL Open Font License 1.1 |

Comandos, e é assim que o commit se confere:

```
git ls-remote https://github.com/productiontype/Spectral.git HEAD
  → dbc06862d7030eedb1b01b60cdad8f6102f4ddfa  HEAD
git ls-remote https://github.com/solmatas/BitterPro.git HEAD
  → de749c69b5ffdb4b109c10d8fc331c3ecc4e39c5  HEAD
```

Cada ficheiro foi descarregado pelo endereço fixado ao commit, e não pelo ramo:

```
https://raw.githubusercontent.com/productiontype/Spectral/dbc0686…/fonts/ttf/<Estilo>.ttf
https://raw.githubusercontent.com/productiontype/Spectral/dbc0686…/fonts/ttf/SC/<Estilo>.ttf
https://raw.githubusercontent.com/productiontype/Spectral/dbc0686…/ofl.txt
https://raw.githubusercontent.com/solmatas/BitterPro/de749c6…/fonts/variable/Bitter%5Bwght%5D.ttf
https://raw.githubusercontent.com/solmatas/BitterPro/de749c6…/OFL.txt
```

**O autor e a licença, lidos na tabela `name` do próprio ficheiro** e não numa
página de catálogo (`python3 -c "from fontTools.ttLib import TTFont; …"`,
nameID 8, 9, 13 e 14):

| Família | `designer` (ID 9) | `manufacturer` (ID 8) | `licence` (ID 13) | `licence_url` (ID 14) |
| --- | --- | --- | --- | --- |
| Spectral, Spectral SC | `Jean-Baptiste Levee` | `Production Type` | «This Font Software is licensed under the SIL Open Font License, Version 1.1.» | `https://openfontlicense.org` |
| Bitter | `Sol Matas, and Bitter project Authors` | `Sol Matas` | a mesma frase | `https://openfontlicense.org` |

**Uma correção ao que o brief supunha, e fica escrita.** O brief dava o Bitter
como sendo «de Huerta Tipográfica / Sol Matas». A tabela `name` do ficheiro não
nomeia a Huerta Tipográfica em lado nenhum, e a organização `huertatipografica`
no GitHub não tem repositório do Bitter (22 repositórios, nenhum deles). O que
está verificado é: desenho de **Sol Matas**, repositório de montante
`solmatas/BitterPro`, direitos de «The Bitter Project Authors». A ligação
histórica à Huerta Tipográfica fica `[verify]` e não é escrita em lado nenhum
do sítio.

**Nomes reservados da OFL.** O `OFL.txt` do Bitter declara «with Reserved Font
Name "Bitter Pro"»; o do Spectral não declara nenhum nome reservado. Nenhum
ficheiro foi renomeado por dentro: a tabela `name` do WOFF2 é, byte a byte, a do
TTF de montante (conferência na §4).

## 3. O que foi convertido, e como

**Sem subconjunto, sem tirar um glifo, sem tocar em nome nenhum.** A conversão é
só de contentor: `fontTools` lê o TTF, marca `flavor = 'woff2'` e grava.

```python
from fontTools.ttLib import TTFont
f = TTFont(origem); f.flavor = 'woff2'; f.save(destino)
```

Ferramenta: **fontTools 4.61.1**, **brotli 1.2.0**, Python 3 desta máquina.
(`python3 -c "import fontTools, brotli; print(fontTools.version, brotli.__version__)"`.)
O `woff2_compress` da Google não está instalado nesta máquina e não foi usado.

**Os estilos que entram, e porquê.** Os que a constituição pede e as regras da
folha de facto usam, e mais nenhum:

| Ficheiro | Papel | Quem o pede |
| --- | --- | --- |
| `Spectral-Regular.woff2` | a prosa | corpo, ledes, descrições |
| `Spectral-Italic.woff2` | a prosa em itálico | **nenhuma regra da folha o pede hoje**, e entra na mesma: `grep -c "font-style: *italic" src/styles/site.css` dá **0**, e os únicos 135 `<em>` de `dist/` estão nas páginas de documento de estudo, que trazem a sua própria pilha de estilos (§7). Entra porque uma prosa editorial sem itálico é uma prosa que se ilude com a falsa inclinação do navegador, e porque as etapas 2 a 4 escrevem prosa |
| `Spectral-Medium.woff2` | títulos | `h1`, `h2` das maquetas a 500 |
| `Spectral-SemiBold.woff2` | ênfase da prosa | as regras a `font-weight: 600` |
| `Spectral-Bold.woff2` | `<strong>` | o `<strong>` sem regra própria, que o navegador rende a 700 |
| `SpectralSC-Regular.woff2` | versaletes editoriais | antetítulos e rótulos de secção |
| `SpectralSC-SemiBold.woff2` | os mesmos, a 600 | a regra dos rótulos das maquetas |
| `Bitter[wght].woff2` | todo o aparelho | valores, rótulos, eixos, selo, recibo |

**O que não entra**: o itálico do Bitter (nenhuma regra da folha o pede), os
onze outros pesos estáticos do Spectral, e o Bitter SC (o Spectral SC faz os
versaletes). Um ficheiro que não se usa é peso que o leitor paga por nada.

O nome de ficheiro `Bitter[wght].woff2` é o nome de montante e não se muda; o
endereço escreve os parênteses retos codificados (`%5B`, `%5D`) em `tokens.css`
e no `<link rel="preload">` do `Base.astro`, com a mesma cadeia dos dois lados
para que a pré-carga sirva mesmo para alguma coisa.

## 4. Os resumos, e a conferência de que a conversão não perdeu nada

`shasum -a 256` sobre os bytes de montante e sobre os bytes entregues.

| Ficheiro de montante | SHA-256 do TTF de montante | Ficheiro entregue | SHA-256 do WOFF2 |
| --- | --- | --- | --- |
| `Spectral-Regular.ttf` | `c89021dc20720c8d0dcf40b0b2f6e00c13665fa8041717f581396f51b8c78f5d` | `public/tipos/spectral/Spectral-Regular.woff2` | `994c8d7c7c15a5edef827e7cc5d1d6d08d14a0928842fec7cd00739226e0b4cf` |
| `Spectral-Italic.ttf` | `7ec97244259db4008c4b1224c7914e5371c797c0044af9d85c2d761ba0e5f787` | `public/tipos/spectral/Spectral-Italic.woff2` | `4fc59570ee6c296ea6468a218197b875fc4667f7b498387b3a29a429218d749c` |
| `Spectral-Medium.ttf` | `f385bc588599c879112272711d4acecc126674009d747a27284f59e93a240e83` | `public/tipos/spectral/Spectral-Medium.woff2` | `44bdee379860288f245d59ab231ff16cd1b1094487c79a7e3ba23432485afc19` |
| `Spectral-SemiBold.ttf` | `5f86915a744832ecf6e4a17ab04bea091b9fa992ef5164ff65ae34c1da2fe94b` | `public/tipos/spectral/Spectral-SemiBold.woff2` | `4e8996392d880649ca243899d4d4dec6f9ee321133dd945719cfea147bb1d17f` |
| `Spectral-Bold.ttf` | `70ddb1ec6ae3b0b8d0c79231f670de786978f19baeba2130757526e407aebf9b` | `public/tipos/spectral/Spectral-Bold.woff2` | `99245fd228b5ae29295078e02af334b6627f82e38aaaa4d98665002e30ab444b` |
| `SpectralSC-Regular.ttf` | `11b89ee8eff243c4068a9fc105650f8d90005b288f90c98c6d40fecd85a0306d` | `public/tipos/spectral-sc/SpectralSC-Regular.woff2` | `a9f58449ba2dd0955a44d72e3464b7f0948a261dc0e221278f6742438e77e822` |
| `SpectralSC-SemiBold.ttf` | `7b907d97835d68c84abe35c6a3294aeedf7ac271ced70292502019b667034477` | `public/tipos/spectral-sc/SpectralSC-SemiBold.woff2` | `ad7d0f1a6c127080a7da4d311c8c3545e4ff035791ce01e33962d2c2feda09f6` |
| `Bitter[wght].ttf` | `ef2b9a711fb02f1e5823b34da1b7450e0fc76793b7d733a8b41006e24916d4a7` | `public/tipos/bitter/Bitter[wght].woff2` | `07de7b470557e91e03408c6dbc7b29e3add83c9413229dfb917aa0d73e460897` |

**Os ficheiros de licença:**

| Ficheiro | Origem | SHA-256 |
| --- | --- | --- |
| `public/tipos/spectral/OFL.txt` | `productiontype/Spectral@dbc0686:/ofl.txt` | `6df9374cc60c5b64f15280ff4cc43596f0dbcafb46d3bbfd48385f5f78da60f2` |
| `public/tipos/spectral-sc/OFL.txt` | o mesmo ficheiro, copiado ao lado da segunda família | `6df9374cc60c5b64f15280ff4cc43596f0dbcafb46d3bbfd48385f5f78da60f2` |
| `public/tipos/bitter/OFL.txt` | `solmatas/BitterPro@de749c6:/OFL.txt` | `152a1e283e23b42c4940da4c72f2f5bebaa17969cb77c76d7af05903846006f1` |

**A conferência da conversão**, feita com `fontTools` sobre os dois ficheiros e
comparando seis coisas: número de glifos, resumo da ordem de glifos, resumo da
tabela `name` inteira (todos os registos, com plataforma, codificação e língua),
número de pontos no `cmap`, `unitsPerEm` e a lista de tabelas. **As seis batem
certo nos oito ficheiros.**

| Ficheiro | glifos TTF → WOFF2 | registos de `name` | pontos de `cmap` | bytes TTF → WOFF2 |
| --- | --- | --- | --- | --- |
| `Spectral-Regular` | 1480 → 1480 | 26 → 26 | 878 → 878 | 261 088 → 80 084 |
| `Spectral-Italic` | 1480 → 1480 | 26 → 26 | 878 → 878 | 270 468 → 83 140 |
| `Spectral-Medium` | 1480 → 1480 | 28 → 28 | 878 → 878 | 272 920 → 88 008 |
| `Spectral-SemiBold` | 1480 → 1480 | 28 → 28 | 878 → 878 | 273 068 → 88 800 |
| `Spectral-Bold` | 1480 → 1480 | 26 → 26 | 878 → 878 | 273 220 → 88 664 |
| `SpectralSC-Regular` | 1480 → 1480 | 20 → 20 | 878 → 878 | 260 936 → 79 864 |
| `SpectralSC-SemiBold` | 1480 → 1480 | 22 → 22 | 878 → 878 | 272 916 → 88 908 |
| `Bitter[wght]` | 1542 → 1542 | 61 → 61 | 977 → 977 | 328 636 → 113 960 |

Tabelas presentes, iguais dos dois lados: no Spectral `GDEF GPOS GSUB GlyphOrder
OS/2 cmap cvt fpgm gasp glyf head hhea hmtx loca maxp meta name post prep`; no
Bitter, além dessas, as da variação: `HVAR MVAR STAT avar fvar gvar`.

**O eixo do Bitter**: `wght` de 100 a 900, defeito 100 (`fvar`). O `@font-face`
declara `font-weight: 100 900`, e é o navegador que mapeia o peso pedido no eixo.
Um só ficheiro serve os nove pesos do aparelho.

Total entregue: **8 ficheiros WOFF2, 711 428 bytes**, mais três `OFL.txt`.

## 5. O que foi medido no navegador, e não lido numa tabela de features

`node scripts/medir-tipos.mjs` (Chromium sem cabeça, Playwright 1.60.0 como
dependência de desenvolvimento, fora do `npm run build`). Cadeias de sete glifos
com algarismos diferentes, «1111111» e «0000000», a 100px, medidas com
`getBoundingClientRect()` depois de `document.fonts.load()` da ficha exata. A
página de prova é servida de `dist/` e liga a folha real do sítio: os
`@font-face` medidos são os que o sítio serve. Medição inteira guardada em
`design/especime-v3/medicoes/2026-08-20-etapa-1b-tipos.json`.

### Os tabulares do Bitter: reais

| Família | cadeia | `normal` | `tabular-nums` |
| --- | --- | --- | --- |
| Bitter 400 | «1111111» | **284,438 px** | **441 px** |
| Bitter 400 | «0000000» | **448,938 px** | **441 px** |
| Bitter 600 | «1111111» | **296,266 px** | **441 px** |
| Bitter 600 | «0000000» | **445,828 px** | **441 px** |

Sem a feature, as duas cadeias diferem em 164,5 px no peso 400: os algarismos do
Bitter são proporcionais por defeito. Com `tabular-nums`, as duas medem
exatamente **441 px** nos dois pesos, ou seja 63 px por algarismo, 0,63 em. A
Emenda 5 dizia «tabulares reais confirmados»; está confirmado aqui, com números.

### Os tabulares do Spectral: já é tabular por defeito

| Família | cadeia | `normal` | `tabular-nums` |
| --- | --- | --- | --- |
| Spectral 400 | «1111111» | **350 px** | **350 px** |
| Spectral 400 | «0000000» | **350 px** | **350 px** |

Quatro larguras iguais. Não é a feature a falhar: os algarismos de defeito do
Spectral já têm todos a mesma marcha (500 unidades em 1000, lidas no `hmtx`), e
pedir `tabular-nums` não tem o que trocar.

### Os antigos do Spectral: **existem e entram**, e a medição de largura sozinha é cega

Este é o achado da etapa, e contraria o que a sessão de desenho tinha concluído.

O Spectral tem **quatro** conjuntos de algarismos, e o `hmtx` mostra-o:

- o defeito, versais **tabulares**, marcha 500 em todos os dez;
- `.LP`, versais **proporcionais**;
- `.OP`, antigos **proporcionais**;
- `.OT`, antigos **tabulares**, marcha 500 em todos os dez.

O `onum` mapeia o defeito para `.OT` e o `.LP` para `.OP` (44 substituições,
lidas na `GSUB`). Por isso:

| Comparação | «1111111» | «0000000» | O que prova |
| --- | --- | --- | --- |
| `normal` contra `oldstyle-nums` | 350 px → **350 px** | 350 px → **350 px** | **nada.** Troca tabulares versais por tabulares antigos: os glifos mudam, a marcha não |
| `lining-nums proportional-nums` contra `oldstyle-nums proportional-nums` | 297,5 px → **285,5 px** | 387,813 px → **398 px** | **os antigos entram.** As duas cadeias mudam de largura, em sentidos contrários |

A conclusão de que o `onum` do Spectral estava «inerte» vinha de comparar o
primeiro par, que não podia dizer nada. **O `onum` funciona.** O mesmo se
verifica no Spectral SC, com os mesmos quatro números.

O Bitter também tem antigos e também entram (`lining-nums proportional-nums`
284,438 e 448,938 px contra `oldstyle-nums proportional-nums` **291,672** e
**461,078 px**), e não são pedidos em lado nenhum: o aparelho quer versais
tabulares.

**O que isto decide para a folha.** A prosa em Spectral pode pedir
`oldstyle-nums` e recebe algarismos antigos a sério, como a constituição visual
§2 manda («prosa em algarismos antigos»). O aparelho em Bitter pede
`tabular-nums lining-nums` e recebe tabulares a sério. As duas regras entram na
etapa 1c.

## 6. Nenhum anfitrião de terceiros no que é construído

```
npm run build && grep -r "fonts.googleapis.com\|fonts.gstatic.com" dist/
```

não imprimiu nada, e o código de saída do `grep` foi **1**. Que o comando não
está partido prova-se com um positivo conhecido: o mesmo `grep` sobre
`design/especime-v3/maquetas/` imprime os ficheiros das maquetas, que carregam
as duas famílias do Google. As maquetas não são construídas e não entram em
`dist/`.

## 7. O que fica por resolver, e não é desta etapa

**As páginas de documento de estudo não usam estes tipos.** `src/lib/documentos.mjs`
escreve a sua própria folha, com as pilhas de sistema da v2 (`Iowan Old Style,
Palatino, …` e `ui-monospace, SF Mono, …`) em literal, e não lê ficha nenhuma
de `tokens.css`. Depois desta etapa, `/estudos/<id>/documento/` fica a ser a
única superfície do sítio que não está na letra da constituição. O ficheiro não
é desta etapa e não foi tocado; fica em `ISSUES.md` como I11.

**A ficha técnica pública da letra não existe.** A constituição visual §2 pede
que o Método diga, numa linha, de onde vem a letra. A frase está rascunhada no
plano §12 («A letra») e espera a palavra da direção; nenhum byte de
`src/data/metodo.mjs` mexeu nesta etapa. Até lá, este ficheiro é o único sítio
onde a origem está escrita, e não é público.

## 8. O subconjunto (29.08.2026) — e a §3 deixou de valer

A §3 deste ficheiro diz «Sem subconjunto, sem tirar um glifo». **Isso foi verdade
de 20.08.2026 a 29.08.2026 e deixou de ser.** Os oito ficheiros estão cortados, e
esta secção é o registo do corte: o que entrou, o que saiu, e a prova de que
nada que o sítio use se perdeu. A §3 fica onde está porque descreve a conversão
que trouxe os bytes para cá, e essa conversão continua a ser a que foi; o que
mudou depois dela está aqui.

**A razão.** O estudo tipográfico de 29.08.2026 (`design/tipografia/NOTAS.md`,
ramo `tipografia-2026-08-29`) mediu que estes oito ficheiros pesam 694,8 KiB
inteiros e 405,3 KiB cortados ao latim com as features todas, e escreveu que é o
único resultado do estudo que não precisa de decisão nenhuma: **289,5 KiB por
leitor, sem mudar uma letra.**

**A ferramenta e a entrada.** `scripts/subconjunto-tipos.py`, que corre o
`fontTools.subset` (`pyftsubset`) 4.61.1 com `brotli` para o WOFF2. A entrada são
os próprios WOFF2 de `public/tipos/`, que é o que este repositório tem: não há
TTF de montante aqui e nenhum foi buscado à rede. É a mesma entrada que o estudo
usou para estas três famílias. Os três `OFL.txt` não foram tocados: cortar um
tipo não muda a licença dele.

**O intervalo, e porque não é «o latim».** `latin` + `latin-ext` do Google Fonts,
mais **todos os caracteres que o sítio construído põe à frente de alguém** — 160
distintos, lidos das 6606 páginas de `dist/` e dos 580 cartões de partilha. A
segunda metade não é zelo, e foi medida: **cortar ao latim e mais nada tirava
nove glifos que este sítio usa**, entre eles a seta «→», que ele rende **30 505
vezes** em todas as suas portas. O corte «só latim» foi feito numa pasta à parte
e passado pela mesma célula de prova, que o recusou com os nove nomeados:
U+0394 «Δ», U+2153 «⅓», U+2154 «⅔», U+215B «⅛», U+2192 «→», U+2197 «↗»,
U+2248 «≈», U+2260 «≠», U+2264 «≤». Custa 2,8 KiB no total dos oito ficheiros
tê-los, e é o preço de nenhum leitor ver uma caixa.

`--layout-features='*'` guarda todas as features OpenType. Sem essa bandeira o
`pyftsubset` deixa cair o `tnum` e o `smcp`, que são as duas coisas que este
sítio pede à letra em 143 regras e em 22.

### Os bytes, por ficheiro

| Ficheiro | Antes | Depois | SHA-256 depois |
| --- | ---: | ---: | --- |
| `public/tipos/spectral/Spectral-Regular.woff2` | 80 084 | 48 328 | `3c846b032ad614e02ebc439087bbcbb7371cfbdea6c8a4b568efa859537e9c43` |
| `public/tipos/spectral/Spectral-Italic.woff2` | 83 140 | 50 156 | `4ba15b4bda78df3e8b755f0f12168c23c562707c921f74944e8ce638ee5ac7f1` |
| `public/tipos/spectral/Spectral-Medium.woff2` | 88 008 | 50 808 | `34f0ba222c28bc0ea816c693d05c528be4a5ee10c4b1765cdea774c6fb2502c2` |
| `public/tipos/spectral/Spectral-SemiBold.woff2` | 88 800 | 51 192 | `91eef1143e31196ec762c00b566b9f628a851db348eb524cbfb36bfba9b22f2d` |
| `public/tipos/spectral/Spectral-Bold.woff2` | 88 664 | 51 252 | `8710bb6e834a4ec2aa7a7b24a76e63ead0ba6649c81881aedf615cf37724664f` |
| `public/tipos/spectral-sc/SpectralSC-Regular.woff2` | 79 864 | 48 316 | `afa69dd2e7aaca2733883133745fd84c18dfac6a08d5999e69705ea7277240b8` |
| `public/tipos/spectral-sc/SpectralSC-SemiBold.woff2` | 88 908 | 51 108 | `b847fe8f1fe1a862ce15e288958d132940a8204951ef0dbe2c9ad8fd997f29e2` |
| `public/tipos/bitter/Bitter[wght].woff2` | 113 960 | 66 732 | `b4ad17520d0ce8bd1aa98af06e07ca94145522f868b5a010732eb5eee3ba2ea0` |
| **total** | **711 428** | **417 892** | 286,7 KiB a menos |

694,8 KiB passam a 408,1 KiB. O corte «só latim» do estudo daria 405,3 KiB —
reproduzido aqui ao décimo, e é a prova de que a régua é a mesma — e perderia a
seta.

Os `OFL.txt` não mudaram e os seus resumos são os da §4.

### A prova de que nada se perdeu

`tests/tipos/subconjunto.mjs`, uma célula como as de `tests/inicio/`: lê `dist/`
inteiro (as duas edições, o `<title>`, a descrição do `<head>`, o corpo, os
atributos que se rendem com letra, e a cópia de cada cartão de partilha, que é
texto desenhado nos píxeis) e compara a `cmap` de cada ficheiro cortado com a do
mesmo ficheiro inteiro, guardada em `tests/tipos/COBERTURA-DE-REFERENCIA.json`
antes do corte.

**O que se exige não é «tem glifo»**, e a diferença importa: oito dos 160
caracteres já não tinham glifo em nenhuma destas famílias antes do corte — o
espaço fino de milhares (U+202F) e sete sinais dos documentos alojados (U+21C4,
U+2208, U+2318, U+23CE, U+2534, U+26A0, U+2715) — e o navegador já os ia buscar
a uma letra do sistema. Exigir-lhes glifo era exigir ao corte que acrescentasse
o que a letra nunca teve. O que se exige é que **nada que havia antes falte
depois**, ficheiro a ficheiro.

Resultado: 152 dos 160 nas sete famílias de Spectral e Spectral SC, 151 nos 160
na Bitter, **exactamente os mesmos números de antes do corte**, com 544 e 566
glifos nos ficheiros contra 878 e 977.

A célula viu dois vermelhos antes de dar este verde:

* `node tests/tipos/subconjunto.mjs --plantar U+2192` finge que a seta perdeu o
  glifo e sai a **1**, nomeando-a nos oito ficheiros;
* o corte «só latim», feito a sério numa pasta à parte, sai a **1** com os nove
  glifos perdidos nomeados por ficheiro. Este é o vermelho que interessa: não é
  uma planta, é o corte que o estudo recomendava.

### As features, medidas depois do corte

Lidas nos ficheiros (`GSUB`/`GPOS`): `tnum`, `smcp`, `onum`, `kern` e `liga`
presentes nos oito, 28 features nas sete de Spectral e 26 na Bitter, e o eixo
`wght` da Bitter intacto (100 · 100 · 900, nove instâncias, `usWeightClass` 100,
idênticos aos de antes).

E medidas num navegador com a régua da casa, `node scripts/medir-tipos.mjs`,
sobre a construção com os ficheiros cortados: a Bitter a 400 e a 600 continua a
alinhar «1111111» e «0000000» em 441 px com `tabular-nums` (contra 284,4 e 448,9
sem a feature), e os algarismos antigos continuam a mudar a largura nos três
pares proporcionais. As features não sobreviveram só na tabela: sobreviveram no
ecrã.
