# A medição cega do bloco «a aplicação no telemóvel», M9

Medidor: Claude Sonnet. Fonte: `design/especime-v3/briefs/BRIEF-app-M9.md`. Cópia medida: worktree detached em `dff9c20` (ramo `app-2026-08-28`). Construção «antes»: worktree detached em `162df96` (`main`), criada só para esta medição e removida no fim. Programa: os ficheiros ao lado deste relatório, em `design/especime-v3/medicoes/` (`app-M9-sonnet.mjs` mais `m1` a `m9` mais `lib/`), código próprio, sem importar nada de `scripts/` nem de `src/` do sítio. Exceções, as que o brief autoriza: `npm run verify` e `npm run typecheck` como comandos externos (medição 9) e o Playwright do repositório onde o próprio brief o pede (medições 5 e 6). A medição 7 usa `@resvg/resvg-js`, que já é dependência do projeto, para renderizar SVG a partir de código próprio, sem depender do Chromium do exportador.

`npm ci` correu na cópia (`node_modules` estava ausente). `npm run build` correu nas duas cópias. `npm run verify` e `npm run typecheck` correram na cópia medida, como medição 9.

Todo detetor deste relatório viu pelo menos um caso vermelho plantado por mim antes de dar um zero: as tabelas de cada medição marcam esse caso, e a secção 11 reúne todos.

---

## 1 · Os manifestos

| Campo | `dist/manifest.webmanifest` (pt) | `dist/en/manifest.webmanifest` (en) |
|---|---|---|
| JSON interpreta | sim | sim |
| `name` | «O Estado do País» ✓ | «O Estado do País» ✓ |
| `short_name` | «O Estado» ✓ | «O Estado» ✓ |
| `display` | `standalone` ✓ | `standalone` ✓ |
| `start_url` | `/` ✓ | `/en/` ✓ |
| `id` | `/` ✓ | `/en/` ✓ |
| `lang` | `pt-PT` ✓ | `en` ✓ |
| `background_color` | `#f6f7f4` = token `--paper` claro ✓ | `#f6f7f4` ✓ |
| `theme_color` | `#f6f7f4` = token `--paper` claro ✓ | `#f6f7f4` ✓ |
| ícones declarados | 192×192, 512×512, 512×512 `maskable` ✓ | idem ✓ |
| cada ficheiro de ícone existe | sim, os 3 | sim, os 3 |
| tamanho real (bytes 16 a 24 do PNG) = `sizes` declarado | 192×192, 512×512, 512×512, os 3 batem ✓ | idem ✓ |
| **problemas encontrados** | **0** | **0** |

Caso vermelho plantado: cópia do manifesto pt com `short_name` trocado para «Nome Errado» e o ícone de 192 a declarar `sizes="999x999"` (o PNG real continua 192×192). O detetor apanhou os três defeitos: `short_name` errado, falta um ícone 192×192 conforme e a incompatibilidade de tamanho. Um segundo caso, um JSON deliberadamente mal formado (`{ "name": "O Estado do País", `), foi correctamente recusado pelo `JSON.parse`. Os dois viram vermelho.

---

## 2 · O ícone do iPhone

| Medida | Valor |
|---|---|
| Dimensões (cabeça do PNG) | 180×180 ✓ |
| Tipo de cor do PNG | 2 (RGB, sem canal alfa) |
| Píxeis com alfa abaixo de 255 | 0 de 32400 |
| Opacidade conforme (`sem alfa OU alfa todo opaco`) | sim, pela primeira condição: o PNG nem declara canal alfa (tipo de cor 2) |
| `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` presente, 1 vez, nas rotas com cabeça de aplicação | 6570 de 6570 (100%) |
| Rotas sem essa ligação, entre as que têm cabeça de aplicação | 0 |

Caso vermelho plantado: três mutações. (a) Cópia em memória do PNG real com o alfa do píxel (0,0) posto a 0: o detetor contou 1 píxel transparente e recusou. (b) Um PNG sintético de 179×180: o detetor recusou a dimensão. (c) Cópia de `dist/index.html` sem a etiqueta `apple-touch-icon`: a contagem caiu para 0. As três viram vermelho.

---

## 3 · A zona segura do `maskable`

Leitura do que «raio 40%, centrado» quer dizer: o centro tomado é o centro do quadro, (256, 256) em 512, e não o valor 204,8. A razão não é uma escolha minha: é o que o próprio SVG de origem usa, `transform-origin: 256.0px 256.0px`, na regra `svg[data-forma^="maskable"] .reducao` de `e2c-unida-28-papel-tinta.svg`. Um centro em (204,8, 204,8) desenharia um círculo encostado ao canto superior esquerdo, com 102,4 px de folga só do lado oposto, o que nenhuma máscara circular real faz. Isto fica marcado como leitura, não como facto lido byte a byte.

| Medida | Valor |
|---|---|
| Ficheiro | `dist/icon-512-maskable.png` |
| Centro do círculo seguro | (256, 256) |
| Raio | 204,8 px (40% de 512) |
| Cor do campo (canto (0,0)) | rgb(23, 25, 27) = `#17191b` |
| Píxeis de tinta (cor diferente do campo, qualquer diferença) | 36424 de 262144 |
| Margem mínima (raio − distância do píxel de tinta mais próximo do bordo) | **63,75 px** |
| Coordenada do pior píxel | (179, 374), a 141,05 px do centro, rgb(24, 26, 28): um píxel de antialiasing do bordo externo do anel |
| Dentro da zona segura | **sim** |

Caso vermelho plantado: cópia em memória do PNG real com o píxel do canto (4,4), campo puro, trocado para uma cor de tinta. Distância desse píxel ao centro: 355,67 px, muito além dos 204,8 do raio. O detetor devolveu margem mínima de −150,87 px, no próprio píxel plantado (4,4). Viu vermelho.

---

## 4 · Os favicons

| Medida | Valor |
|---|---|
| `favicon.ico`, entradas no diretório | 32×32 (4264 bytes, deslocamento 38) e 16×16 (1128 bytes, deslocamento 4302) |
| Os dois tamanhos (32 e 16) presentes | sim |
| `favicon.svg` bem formado (pilha de etiquetas, aspas respeitadas) | sim |
| `favicon.svg` tem a regra `@media (prefers-color-scheme: dark)` | sim |
| Rotas com exactamente 2 ligações `rel="icon"` na cabeça, entre as que têm cabeça de aplicação | 6570 de 6570 |
| Rotas sem a ligação ao `.ico` ou sem a ligação ao `.svg` | 0 e 0 |

Caso vermelho plantado: quatro mutações. (a) Um ICO sintético só com a entrada de 32×32: o detetor recusou, falta o 16×16. (b) Cópia de `favicon.svg` sem a etiqueta de fecho `</svg>`: o conferidor de boa formação recusou. (c) Cópia de `favicon.svg` sem o bloco `@media (prefers-color-scheme: dark)`: a regra deixou de se encontrar. (d) Cópia de `dist/index.html` sem as duas ligações `rel="icon"`: a contagem caiu para 0. As quatro viram vermelho.

---

## 5 · A cabeça em todas as rotas

### Parte estática (todas as rotas, as duas edições)

| Medida | Valor |
|---|---|
| Rotas totais construídas | 6586 (3297 pt, 3289 en) |
| Rotas com cabeça de aplicação (ver secção 10 sobre as 16 que não têm) | 6570 |
| `rel="manifest"` aponta à edição certa, 1 vez, nas 6570 | conforme, 0 problemas |
| `theme-color`, 1 etiqueta só, com o papel claro `#f6f7f4` | conforme, 0 problemas |
| `apple-mobile-web-app-title` igual ao `short_name` («O Estado») | conforme, 0 problemas |
| `apple-mobile-web-app-capable` presente nalguma rota | 0 rotas |

### Parte dinâmica (Playwright, tema escolhido na página, largura 1280)

| Rota | `theme-color` antes | `theme-color` depois de escolher escuro | `data-theme` na raiz |
|---|---|---|---|
| `/` | `#f6f7f4` | `#15171a` | `dark` |
| `/municipios/evora` | `#f6f7f4` | `#15171a` | `dark` |
| `/estudos` | `#f6f7f4` | `#15171a` | `dark` |
| `/en` | `#f6f7f4` | `#15171a` | `dark` |

As quatro trocas batem exactamente com os tokens `--paper` claro e escuro de `tokens.css`.

Casos vermelhos plantados: (a) a mesma medição em `/`, com `/js/tema.js` substituído por um ficheiro vazio antes da navegação: o botão do tema ficou sem o script que lhe tira `hidden`, o clique falhou e a etiqueta `theme-color` ficou presa em `#f6f7f4`. (b) Cópia em memória de `dist/index.html` sem a ligação `rel="manifest"`: o conferidor estático recusou. As duas viram vermelho.

---

## 6 · O cabeçalho com a marca

### Nota de método, porque mudou o que a medição olha

A primeira versão desta medição comparava o topo da caixa do SVG (`getBoundingClientRect`, já cortada à tinta pelo `viewBox`) com o topo da caixa de texto do nome, lida com `Range.getBoundingClientRect()` do DOM. Isso deu diferenças de 9 a 27 px em **todas** as 28 combinações de rota e largura, crescendo com o tamanho da letra. Antes de reportar isso como defeito, testei se seleccionar só o primeiro carácter («O») em vez do nome inteiro mudava a caixa: não mudou nada, a caixa continuou a mesma. Isso confirma que a caixa de um `Range` de texto é a caixa de LINHA da fonte (ascensor a descensor, pela métrica do ficheiro), não a caixa de TINTA do glifo, e por isso não é o que o BRIEF pede quando fala em «a mesma linha, as caixas do «e» e do nome com o mesmo topo». Refeita a medição por píxel (recorte da página, descodificado com o mesmo leitor de PNG das outras medições, à procura da primeira linha que difere do papel dentro da coluna do «e» e dentro da coluna do "O"), a diferença real ficou entre 0 e 2 px em todas as 28 combinações. Fica registado como falso alarme meu, não do sítio; ver secção 12.

### A tabela, com o método de tinta (o correcto)

| Rota | Largura | Altura do `header`, antes → depois | Diferença | Altura do `.wordmark`, antes → depois | Diferença | Alinhamento de tinta (topo do «e» − topo do "O") |
|---|---:|---|---:|---|---:|---:|
| `/` | 320 | 200,73 → 200,73 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/` | 360 | 200,73 → 200,73 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/` | 390 | 200,73 → 200,73 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/` | 430 | 177,55 → 177,55 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/` | 768 | 320,83 → 320,83 | 0 | 59,09 → 59,09 | 0 | 0 px |
| `/` | 1024 | 316,38 → 316,38 | 0 | 70,72 → 70,72 | 0 | 1 px |
| `/` | 1280 | 323,11 → 323,11 | 0 | 70,72 → 70,72 | 0 | **2 px** |
| `/municipios/evora` | 320 | 168,33 → 168,33 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/municipios/evora` | 360 | 168,33 → 168,33 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/municipios/evora` | 390 | 168,33 → 168,33 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/municipios/evora` | 430 | 145,14 → 145,14 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/municipios/evora` | 768 | 226,98 → 226,98 | 0 | 27,14 → 27,14 | 0 | 0 px |
| `/municipios/evora` | 1024 | 208,34 → 208,34 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/municipios/evora` | 1280 | 208,75 → 208,75 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/estudos` | 320 | 168,33 → 168,33 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/estudos` | 360 | 168,33 → 168,33 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/estudos` | 390 | 168,33 → 168,33 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/estudos` | 430 | 145,14 → 145,14 | 0 | 24,95 → 24,95 | 0 | 0 px |
| `/estudos` | 768 | 226,98 → 226,98 | 0 | 27,14 → 27,14 | 0 | 0 px |
| `/estudos` | 1024 | 208,34 → 208,34 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/estudos` | 1280 | 208,75 → 208,75 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/en` | 320 | 200,73 → 200,73 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/en` | 360 | 200,73 → 200,73 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/en` | 390 | 200,73 → 200,73 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/en` | 430 | 177,55 → 177,55 | 0 | 35,36 → 35,36 | 0 | 1 px |
| `/en` | 768 | 320,83 → 320,83 | 0 | 59,09 → 59,09 | 0 | 0 px |
| `/en` | 1024 | 316,38 → 316,38 | 0 | 70,72 → 70,72 | 0 | 1 px |
| `/en` | 1280 | 323,11 → 323,11 | 0 | 70,72 → 70,72 | 0 | **2 px** |

A altura do cabeçalho e a altura do bloco `.wordmark` são idênticas, byte a byte, entre `main@162df96` e `app-2026-08-28`(`dff9c20`), nas 28 combinações: a marca não fez o cabeçalho crescer, que era o ponto da âncora B descrita em `Masthead.astro`. O alinhamento de tinta fica sempre entre 0 e 2 px, dentro da tolerância de ±2 px do BRIEF; as duas leituras de 2 px exactos (`/` e `/en` a 1280px) estão no limite da tolerância e não a violam, mas ficam aqui assinaladas por estarem justamente nesse limite, sensíveis ao limiar de 30 por canal que separa antialiasing residual de tinta (ver `lib.LIMIAR_TINTA` no programa).

### O «e» claro em escuro

| Rota | Cor computada de `.wordmark` em escuro | Cor esperada (token `--ink` escuro) | Conforme |
|---|---|---|---|
| `/` | `rgb(236, 238, 234)` | `rgb(236, 238, 234)` | sim |
| `/municipios/evora` | `rgb(236, 238, 234)` | `rgb(236, 238, 234)` | sim |
| `/estudos` | `rgb(236, 238, 234)` | `rgb(236, 238, 234)` | sim |
| `/en` | `rgb(236, 238, 234)` | `rgb(236, 238, 234)` | sim |

Casos vermelhos plantados: (a) a página real de `/`, com uma folha injectada que empurra `.wordmark-e` 15 px para baixo: o mesmo detetor de tinta por píxel mediu 17 px de diferença (2 px de base mais os 15 plantados). (b) Duas fixtures isoladas com a altura do `header` forçada por CSS a 80 e a 95 px: a subtração devolveu 15 px, exactamente a diferença plantada. (c) A página real de `/`, com a cor do `.wordmark` presa a `#111111` mesmo depois de se escolher o tema escuro: a cor lida ficou `rgb(17, 17, 17)`, diferente do token escuro esperado. As três viram vermelho.

---

## 7 · A marca é a mesma forma

| Comparação | Resultado |
|---|---|
| `favicon.svg` (caminhos de `.tinta`) = `design/marca/direcoes-e2/e2-unida-28.svg` (`.sinal`, os 2 primeiros caminhos) | **iguais**, `d` normalizado |
| `«e»` do cabeçalho (`dist/index.html`) = `e2-unida-28.svg` (`.sinal`) | **iguais** |
| `favicon.svg` = `«e»` do cabeçalho | **iguais** |

Os três normalizam para a mesma cadeia: `M 404.52,277 A 150,150,0,1,0,377.28,344.27 L 343.32,319.55 A 108,108,0,1,1,362.94,271.12 Z` (o anel) e `M 107.48,235 L 404.52,235 L 404.52,277 L 107.48,277 Z` (a barra).

### O `apple-touch-icon.png` renderizado contra o ficheiro real

A «variante papel-sobre-tinta» nomeada no BRIEF foi identificada como `design/marca/direcoes-e2/e2c-unida-28-papel-tinta.svg`, e não por suposição: é o ficheiro que `design/marca/exportar.mjs` usa para os quatro PNG da aplicação (`const CELA = ... 'e2c-unida-28-papel-tinta.svg'`), e o comentário do próprio ficheiro di-lo por extenso, «o «e» de papel sobre o campo de tinta».

| Medida | Valor |
|---|---|
| Render (`@resvg/resvg-js`, viewBox 512 mantido, largura e altura postas a 180) | 180×180 |
| `dist/apple-touch-icon.png` real | 180×180 |
| Píxeis diferentes (limiar de 20 por canal) | 137 de 32400 |
| Percentagem diferente | **0,423%** |
| Dentro do limiar de 0,5% do BRIEF | **sim** |

Diagnóstico da diferença, porque 0,42% está perto do limiar de 0,5% e merece a prova: as 137 diferenças caem todas dentro da silhueta do sinal (caixa (26,26) a (153,153)), e em cada uma as duas cores são valores intermédios entre o campo e a tinta (por exemplo render `rgb(51,53,55)` contra real `rgb(23,25,27)`, os dois perto do campo `rgb(23,25,27)`). É antialiasing de bordo, não conteúdo divergente: com o limiar em 40 por canal restam 14 píxeis (0,043%), e com o limiar em 60 restam **0**. A diferença vem de o `@resvg/resvg-js` e o Chromium (que gerou o ficheiro real) suavizarem o mesmo bordo de maneira ligeiramente diferente, exactamente o que a tolerância de 0,5% do BRIEF existe para admitir.

Caso vermelho plantado: (a) um caminho do favicon com uma coordenada mudada (404,52 → 404,99): a comparação de `d` normalizado deixou de bater. (b) A mesma cela renderizada com o par de cores errado (âmbar sobre tinta em vez de papel sobre tinta): a diferença de píxeis subiu para **78,98%**, muito acima do limiar. As duas viram vermelho.

---

## 8 · Nada de mais

| Medida | Valor |
|---|---|
| Ficheiros JS conferidos (`dist/js/*.js`; não há `.js` fora dali em `dist/`) | 5 (`convergencia.js`, `correcoes.js`, `inicio.js`, `municipios.js`, `tema.js`) |
| Ficheiros JS com `serviceWorker` ou `beforeinstallprompt` | 0 |
| Rotas conferidas (cabeça e corpo, as duas edições) | 6586 |
| Rotas com `serviceWorker` no texto | 0 |
| Rotas com `beforeinstallprompt` no texto | 0 |

Caso vermelho plantado: (a) um ficheiro JS sintético com `navigator.serviceWorker.register(...)` e um listener de `beforeinstallprompt`: o detetor de texto assinalou os dois. (b) Uma página HTML sintética com o mesmo registo de service worker num `<script>` inline: assinalado. Os dois viram vermelho.

---

## 9 · A cadeia

| Comando | Código de saída | Duração |
|---|---:|---:|
| `npm run verify` | **0** | ≈ 39 a 43 s (duas corridas) |
| `npm run typecheck` | **0** | ≈ 0,2 a 0,8 s |

Caso vermelho plantado: dois comandos `node -e "process.exit(N)"`, com N=7 e N=0, pelo mesmo captador (`spawnSync`) que corre os dois comandos de cima. O de N=7 devolveu código de saída 7 (viu vermelho, confirma que o captador distingue não zero de zero); o de N=0 devolveu 0 (confirma que zero também passa, e que o detetor não está sempre vermelho por acidente).

Nota à margem, fora das nove medições mas observada directamente na saída de `npm run verify`: `check:voz` termina com `✓` (a cadeia passa) mas lista «1 bloco(s) do inventário por ler: · app · por ler». É um aviso do inventário de vozes do sítio sobre o bloco de prosa «app», não um teste desta medição, e não muda o código de saída. Fica dito por ter aparecido literalmente com o nome do bloco medido, e por a regra 14 do operador («ausência exige busca exaustiva») pedir que uma coisa vista não se esconda por não estar na lista das nove.

---

## 10 · As discordâncias, com coordenada e prova

Uma só discordância, que atravessa as medições 2, 4, 5 e 8: **16 rotas, das 6586 construídas, não têm nenhuma etiqueta da cabeça de aplicação** (nem `rel="manifest"`, nem `rel="icon"`, nem `apple-touch-icon`, nem `theme-color`, nem `apple-mobile-web-app-title`). São todas da mesma família de página, a «edição de registo» dos documentos de estudo (`/estudos/<slug>/documento/` em português, `/en/studies/<slug>/document/` em inglês), que não usa `Base.astro`: tem o seu próprio `<head>` mínimo (carácter, viewport, uma folha de estilo em linha), sem nenhuma das ligações que `Base.astro` escreve. A prova é a mesma nas quatro medições: contagem 0 para cada etiqueta, nessas 16 rotas e só nessas.

| # | Rota |
|---:|---|
| 1 | `pt:estudos/agua-nao-faturada/documento/index.html` |
| 2 | `pt:estudos/avaliacao-economica-regional-de-portugal-2026/documento/index.html` |
| 3 | `pt:estudos/evolucao-de-portugal-desde-1981/documento/index.html` |
| 4 | `pt:estudos/evora-economia-investidores-portas-abertas-2026/documento/index.html` |
| 5 | `pt:estudos/evora-orcamentado-pago-devido-2025/documento/index.html` |
| 6 | `pt:estudos/evora-os-pelouros-quem-os-teve-o-que-fizeram/documento/index.html` |
| 7 | `pt:estudos/evora-prometido-pago-auditado-2026/documento/index.html` |
| 8 | `pt:estudos/evora-quinze-anos-cinco-mandatos/documento/index.html` |
| 9 | `pt:estudos/onde-esta-a-agua/documento/index.html` |
| 10 | `pt:estudos/penalizacoes-por-reforma-antecipada-2026/documento/index.html` |
| 11 | `en:en/studies/agua-nao-faturada/document/index.html` |
| 12 | `en:en/studies/alentejo-algarve/document/index.html` |
| 13 | `en:en/studies/evora-orcamentado-pago-devido-2025/document/index.html` |
| 14 | `en:en/studies/evora-prometido-pago-auditado-2026/document/index.html` |
| 15 | `en:en/studies/onde-esta-a-agua/document/index.html` |
| 16 | `en:en/studies/which-door-is-yours/document/index.html` |

A lista é idêntica, rota a rota, nas medições 2 e 5 (conferido por comparação directa das duas listas). Não avalio aqui se isto é intencional (a «edição de registo» pode ser deliberadamente uma superfície à parte, pensada para se abrir isolada ou arquivada) ou uma lacuna: é uma medição, não um veredicto. Fica medido, com coordenada e prova, para quem decide.

Fora desta única família, as 6570 rotas restantes das duas edições conferem 100% nas quatro medições.

---

## 11 · Os casos conhecidos vistos vermelhos

| Medição | Caso plantado | Viu vermelho |
|---|---|---|
| 1 | manifesto com `short_name` errado e tamanho de ícone incompatível | sim |
| 1 | JSON mal formado | sim |
| 2 | píxel de alfa não opaco no apple-touch-icon | sim |
| 2 | PNG de dimensão errada (179×180) | sim |
| 2 | ligação `apple-touch-icon` removida de uma página | sim |
| 3 | píxel de tinta plantado fora do círculo seguro | sim |
| 4 | ICO sem a entrada de 16×16 | sim |
| 4 | `favicon.svg` sem a etiqueta de fecho | sim |
| 4 | `favicon.svg` sem a regra `prefers-color-scheme: dark` | sim |
| 4 | as duas ligações `rel="icon"` removidas de uma página | sim |
| 5 | `tema.js` bloqueado (não carrega) | sim |
| 5 | ligação `rel="manifest"` removida de uma página | sim |
| 6 | o «e» do cabeçalho empurrado 15px, medido por tinta | sim |
| 6 | duas fixtures com a altura do cabeçalho forçada (80 contra 95px) | sim |
| 6 | cor do `.wordmark` presa em escuro | sim |
| 7 | caminho do favicon com uma coordenada mudada | sim |
| 7 | render do apple-touch-icon com o par de cores errado | sim |
| 8 | ficheiro JS com `serviceWorker` e `beforeinstallprompt` | sim |
| 8 | página HTML com um registo de service worker inline | sim |
| 9 | captador de código de saída, com um comando que falha de propósito (N=7) | sim |
| 9 | o mesmo captador, com um comando que termina bem de propósito (N=0), para confirmar que zero também passa | sim |

21 casos plantados, 21 vistos vermelhos.

---

## 12 · Os meus falsos alarmes, com a causa

**(a) Medição 5, a troca de tema entre rotas.** A primeira versão corria as quatro rotas dinâmicas no mesmo contexto do Playwright. `localStorage` é por origem, e as quatro rotas vivem na mesma origem (o servidor estático local desta medição); depois da primeira rota escolher escuro e gravar `tema=dark`, as três seguintes arrancavam já com `data-theme="dark"` posto pela guarda contra o pisca do `<head>` (que lê `localStorage` independentemente de `tema.js`), e a leitura «antes» dessas três rotas saía `#15171a` em vez de `#f6f7f4`. O caso vermelho plantado (tema.js bloqueado) saiu ainda mais confuso: o script estava bloqueado mas a guarda do `<head>` continuava a pôr `data-theme="dark"` a partir do resíduo de `localStorage`, e o detetor via `dataTheme:"dark"` e concluía, incorrectamente, que a troca tinha funcionado. Corrigido dando um contexto novo do Playwright a cada rota testada (código em `m5-cabeca-em-todas-as-rotas.mjs`, função `medirTrocaDeTema`), o que isola o `localStorage` como um leitor de primeira visita o teria. Depois da correcção, as quatro rotas leram `#f6f7f4` antes e `#15171a` depois, e o caso vermelho leu `dataTheme: null`, como devia.

**(b) Medição 6, o alinhamento do «e» com o nome.** Descrito com mais espaço na secção 6: comparar `svg.getBoundingClientRect()` com `range.getBoundingClientRect()` de um `Range` de texto deu 9 a 27 px de diferença nas 28 combinações de rota e largura, um padrão demasiado uniforme e demasiado grande para ser a marca a sair do sítio. A causa: a caixa de um `Range` de texto reflecte a métrica de LINHA da fonte (o espaço para ascensores e descensores que o ficheiro da fonte reserva), não a caixa de TINTA visível do glifo; confirmei isto seleccionando só o primeiro carácter («O» sozinho) e vendo que a caixa devolvida não mudava nada em relação ao nome inteiro, o que só faz sentido se a caixa for da linha e não da letra. Sem essa segunda verificação, teria reportado um defeito de alinhamento generalizado que não existe. Substituí a comparação por uma leitura de píxeis a sério (recorte da página, descodificado pelo mesmo leitor de PNG das outras medições, à procura da primeira linha que difere do papel), e o alinhamento real ficou entre 0 e 2 px em todas as 28 combinações.

Nenhum outro falso alarme na produção deste relatório; as restantes sete medições correram como desenhadas à primeira.

---

## 13 · O custo em símbolos

Lido do próprio contador de orçamento da sessão (`total_tokens`, que a ferramenta expõe a cada resposta), não medido por um contador externo: começou em 15 000 000 e estava em aproximadamente 14 685 000 pouco antes de escrever esta secção, uma despesa de **≈ 315 000 tokens** até ali. A escrita deste relatório e a limpeza final acrescentam mais uma fatia, pelo que o custo total da tarefa fica **estimado em 330 000 a 360 000 tokens** (inferido, não uma soma exacta de tokens de entrada e saída por chamada, que este ambiente não expõe separadamente). A maior parte foi lida (o repositório, os ficheiros construídos, os JSON intermédios de cada medição enquanto eu os validava), não escrita: o código das nove medições mais as bibliotecas partilhadas soma 1990 linhas.

---

## Apêndice · Ficheiros do programa

· `app-M9-sonnet.mjs`, o orquestrador (corre as nove medições e imprime o relatório de texto e o JSON completo no stdout)
· `m1-manifestos.mjs` a `m9-a-cadeia.mjs`, uma medição por ficheiro
· `lib/png.mjs`, descodificador e codificador de PNG e leitor de ICO, escritos de raiz sobre `node:zlib`
· `lib/svg.mjs`, tokenizador e normalizador de caminhos SVG (`d`)
· `lib/xml.mjs`, conferidor de boa formação de XML por pilha de etiquetas
· `lib/tokens.mjs`, leitor dos tokens de cor de `src/styles/tokens.css`
· `lib/servidor.mjs`, servidor estático mínimo para o Playwright ler `dist/` por `http://`
· `lib/analiseRotas.mjs`, a passagem única sobre todos os `.html` construídos, partilhada pelas medições 2, 4, 5 e 8

Para correr: `node app-M9-sonnet.mjs`, com `MEDICOES_DIST_DEPOIS`, `MEDICOES_DIST_ANTES`, `MEDICOES_REPO_ROOT` e `MEDICOES_TOKENS_CSS` no ambiente (o ficheiro documenta os valores por omissão no cabeçalho).
