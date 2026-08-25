# MEDIÇÃO · Correções de UX, M3 · a medição cega dos dois blocos

*Feita pelo medidor (Claude Sonnet 5) a partir de `briefs/BRIEF-correcoes-ux-M3.md`. Código próprio, do zero, sem importar nada de `src/` nem `scripts/` do sítio, sem ler os briefs dos blocos A e B, `notas/correcoes-ux.md` ou `DECISIONS.md`. Li só `medicoes/auditoria-ux-2026-08-25-opus.md`, para saber o que medir, não como. «Antes» é `https://xn--oestadodopas-2fb.pt` (main, antes das correções). «Depois» é o `dist/` do ramo `correcoes-ux-2026-08-25` (commit e95c545), servido em `http://localhost:4310` com `python3 -m http.server`. Playwright do repositório, `devices["iPhone 13"]` (390 × 664, WebKit, toque real) para o telemóvel, Chromium 1280 × 800 para o computador. Sem travessões nesta prosa; o ponto médio é o separador.*

## 0 · Método, e o que vale

Escrevi os meus próprios detetores, a partir do que a §1 do brief pede, não do relatório do leitor-utilizador. Onde nomeio uma classe (`.claim-value`, `.peca-topo`, `a.seg`) ou um atributo (`data-medida`, `data-modo`), saiu da inspeção do DOM em execução, que é a medição que o brief autoriza, tal como o relatório do leitor-utilizador fez com o sítio no ar.

**Três detetores tiveram de ser corrigidos depois de darem números errados, e digo os três, com a causa:**

1. **Sobreposições de texto.** A primeira versão contava 21 "sobreposições" em `/municipios/evora` a 390, onde o caso conhecido é 1. Duas causas: (a) o sítio usa o padrão sr-only clássico (`width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)`, na classe `.vh`) para texto só para leitor de ecrã; a caixa de linha desse texto (via `Range.getClientRects()`) continua com o tamanho natural, não cortado, e por isso "colide" com texto real por perto mesmo sem nunca ser pintada. Passei a cortar a caixa pela interseção com CADA antepassado de overflow não visível, não só a testar se alguma interseção é positiva; (b) mesmo depois disso, sobrava uma "sobreposição" de exatamente 1×1 px contra esse mesmo texto escondido, porque 1×1 px é geometricamente não vazio mas não é visível a olho nenhum; acrescentei um mínimo de 4 px² de área. Com as duas correções, `/municipios/evora` a 390 no ar passou de 21 para **1**, exatamente o caso conhecido, e esse número bate certo com o do leitor-utilizador para a mesma página («1 sobreposição real»).
2. **Texto pequeno e alvos de toque dentro de `<details>` fechado.** Ao investigar uma leitura instável da página `/` no telemóvel (uma corrida devolveu 93 textos abaixo de 12px, outras corridas devolveram 30, todas com o mesmo código), encontrei a causa: o meu corte por `overflow` não sabia que um `<details>` sem o atributo `open` não pinta o seu conteúdo (exceto o `<summary>`), mesmo que `display` e `overflow` pareçam normais em `getComputedStyle`. Confirmei com `document.elementFromPoint()` no centro do texto, devolvendo `null` (nada pintado ali) apesar da caixa ter geometria "normal". Acrescentei um teste explícito a `<details>` fechado em todos os detetores de texto e de alvos de toque. Depois da correção, `/` no telemóvel no ar deu **30** de forma estável em mais de seis corridas independentes; uso esse número. **Registo a instabilidade em si como falsa alarme minha, com a causa encontrada, não escondida.**
3. **Distância ao primeiro valor com selo, em `/en`.** O meu detetor procura um elemento curto cujo texto contenha "fonte" (a palavra do selo em português). Em `/en` o selo diz "source", não "fonte", e por isso o detetor não encontra nada e devolve "não achado" nas duas construções. Confirmei a causa a olhar ao HTML do selo em `/en` (`"source · calculated · ..."`). É uma limitação do meu detetor, não do sítio; fica registada em vez de escondida.

Os quatro detetores que a §1 pede para provar num caso conhecido antes de dar zero, e o resultado dessa prova, estão na secção 1.

**O que não fiz.** Não usei nenhum código do sítio. As classes e atributos que cito vieram todos de os ver no DOM em execução, com Playwright, nunca de abrir um ficheiro de código.

**Uma nota sobre o repositório partilhado.** A meio desta medição, `git status` passou a mostrar onze ficheiros modificados fora de `medicoes/` (`src/components/Claim.astro`, `src/i18n/strings.mjs`, várias folhas de estilo, `src/views/MunicipiosView.astro`, `src/views/TextoView.astro`, `INVENTARIO-FRASES.md`) e um novo (`public/js/municipios.js`), nenhum deles tocado por mim. Verifiquei a causa: há três processos `servir.mjs` de outra sessão, iniciados às 22:23:01, a servir caminhos que nunca usei (`main-oedp/dist`, `dist-antes-c`); o conteúdo das alterações fala de "passo C" e "decisão 5 do diretor", trabalho de construção alheio ao meu, a correr ao mesmo tempo no mesmo repositório. **Não fiz nada disto, não commito nada disto.** Importa para uma coisa só: o `dist/` do repositório, que usei para o item 14, foi reconstruído por esse processo às 22:41-22:42 (confirmei pela data dos ficheiros e por o `index.html` ter agora um MD5 diferente do da cópia congelada `dist-depois/`). A minha corrida de `medir-defeitos.mjs` ficou gravada com a hora 22:24:49, **antes** dessa reconstrução; nessa altura confirmei, por comparação de nomes de ficheiro, que o `dist/` do repositório era idêntico à cópia congelada. O item 14 mede portanto a construção certa; fica esta nota para quem ler o relatório mais tarde e comparar com um `dist/` que, a essa altura, já não vai ser este.

## 1 · Os casos conhecidos, vistos vermelhos

| detetor | caso conhecido (brief) | o que medi | veredito |
|---|---|---|---|
| alvos de toque < 44×44 | "os algarismos da manchete «4» e «9» (8 × 16 px)" | No ar, telemóvel, `/`: há 8 elementos `a.prova-valor` na página. Os dois dentro do `<h1>` (o "4" e o "9" de "Portugal ultrapassa 4 limiares ... e cumpre 9") medem **17,5 × 35,6 px** cada, não 8×16, mas já estão bem abaixo de 44×44 e o detetor apanha-os na mesma. Os elementos que medem efetivamente perto de 8×16 são OUTROS dois algarismos, "4" e "0", do resumo da agenda no cabeçalho ("4 em curso · 0 a seguir"), a **7,8 × 16,4 px**. Não encontrei nenhum par "4"+"9" a 8×16 em lado nenhum da página. | **Vermelho, com discrepância anotada.** O detetor apanha corretamente 14 alvos < 44×44 em `/` no ar, incluindo os dois algarismos da manchete (maiores do que o número citado) e os dois algarismos do resumo da agenda (que batem com o tamanho citado mas não com o texto "4"/"9" citado). Não force o ajuste para bater certo; relato os dois candidatos, com números. |
| texto < 12 px | "«Painel europeu reconferido a» a 9,5 px" | No ar, telemóvel, `/`: `getComputedStyle` do elemento devolve `font-size: 12px` (não 9,5), `line-height: 19,2px`; a caixa de linha do próprio nó de texto (`Range.getClientRects()`) mede 169,66 × 14,4 px. 12/9,5 ≈ 1,26; um rácio de cap-height de tipo de letra ronda esse valor, o que sugere que a auditoria mediu a tinta do glifo (num canvas), não o `font-size` CSS. | **Não reproduzido ao valor exato citado, com a causa registada.** O meu detetor usa `font-size` computado, a métrica padrão para este tipo de auditoria; por essa métrica este elemento específico fica em exatamente 12px, não abaixo de 12. O detetor funciona: apanha 30 outras ocorrências de texto real abaixo de 12px na mesma página (11 e 11,5 px, listadas na tabela 3), só não este elemento a este valor exato. |
| sobreposições de texto | "o par «242,6 → 105,5» em `/municipios/evora` a 390" | No ar, telemóvel: as caixas de linha (não as caixas do elemento, que só se tocam) dos nós de texto "242,6" e "105,5" (ambos `span.claim-value`, dentro de `div.glance-num`, com uma seta "→" a meio) cruzam-se em **106,45 × 13,38 px**, em y ≈ 4189. | **Vermelho, exato.** Bate com a descrição do brief e, à parte, com o número que o leitor-utilizador publicou para o mesmo par (106,4 × 13,4 px). |
| bandas vazias > 48 px | "a banda de 96 px entre «308 concelhos» e o painel a 390" | No ar, telemóvel, `/`: banda uniforme de y = 825 a y = 921, **96 px**, medida nos pixéis da captura de página inteira (`scale:'css'`, para não confundir pixel CSS com pixel de dispositivo, que a 390 com `deviceScaleFactor` 3 do iPhone 13 sairia 3× maior se não se corrigisse). | **Vermelho, exato.** Mesmos limites (825 a 921) que os publicados pelo leitor-utilizador para a mesma banda. |

## 2 · As medições gerais (itens 1, 3, 4, 5, 6), por rota e largura

Rotas medidas: as treze da §1 do brief (`/`, `/municipios`, `/municipios/evora`, `/estudos`, `/estudos/evora-prometido-pago-auditado-2026`, a sua leitura, `/livro-razao`, `/livro-razao/divida-publica-2025`, `/agenda`, `/metodo`, `/correcoes`, `/en`, e a segunda leitura longa). 52 visitas (13 rotas × 2 larguras × 2 construções), zero erros de navegação.

### Tabela 1 · altura da página, distância ao `h1`, distância ao primeiro valor com selo

*"Selo" = um elemento curto (até 30 carateres) cujo texto contém "fonte", e "o valor" = o texto numérico de maior `font-size` no antepassado mais próximo que o contém; distância = posição Y no documento. Nota de honestidade: em `/en` o selo diz "source", não "fonte" (ver §0.3); o meu detetor de língua portuguesa não o encontra, por isso "não achado" nas duas construções, não é uma medição de zero.*

| rota | largura | altura antes (px / ecrãs) | altura depois (px / ecrãs) | Δ altura | h1 antes (px) | h1 depois (px) | selo antes (px, texto) | selo depois (px, texto) |
|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 6132 / 9,23 | 6143 / 9,25 | +11 | 96,2 | 68,2 | 809,9 · "308" | 783,1 · "308" |
| `/` | desktop | 4900 / 6,13 | 3890 / 4,86 | −1010 | 112,4 | 112,4 | 1028,2 · "308" | 1052,2 · "308" |
| `/municipios` | mobile | 13239 / 19,94 | 13235 / 19,93 | −4 | 266,1 | 221,3 | 413,2 · "278" | 368,4 · "278" |
| `/municipios` | desktop | 5894 / 7,37 | 5894 / 7,37 | 0 | 275,5 | 275,5 | 415,0 · "278" | 415,0 · "278" |
| `/municipios/evora` | mobile | 11550 / 17,39 | 11842 / 17,83 | +292 | 266,1 | 221,3 | 483,5 · "58 567" | 418,3 · "58 567" |
| `/municipios/evora` | desktop | 7632 / 9,54 | 7603 / 9,50 | −29 | 275,5 | 275,5 | 582,4 · "58 567" | 537,3 · "58 567" |
| `/estudos` | mobile | 3724 / 5,61 | 3392 / 5,11 | −332 | 233,3 | 188,5 | 412,0 · "12" | 366,0 · "12" |
| `/estudos` | desktop | 3033 / 3,79 | 2464 / 3,08 | −569 | 242,8 | 242,8 | 418,4 · "12" | 418,4 · "12" |
| `/estudos/evora-prometido-pago-auditado-2026` | mobile | 3206 / 4,83 | 3347 / 5,04 | +141 | 245,3 | 200,5 | 567,3 · valor | 526,5 · valor |
| `/estudos/evora-prometido-pago-auditado-2026` | desktop | 2606 / 3,26 | 2590 / 3,24 | −16 | 254,8 | 254,8 | 565,6 · valor | 565,6 · valor |
| `/estudos/.../texto` | mobile | 74046 / 111,52 | 30370 / 45,74 | **−43676** | 284,1 | 734,1 | 2137,8 | 2587,8 |
| `/estudos/.../texto` | desktop | 47137 / 58,92 | 23689 / 29,61 | **−23448** | 301,5 | 637,3 | 1931,2 | 2267,0 |
| `/livro-razao` | mobile | 18049 / 27,18 | 18960 / 28,55 | +911 | 260,1 | 215,3 | 648,9 · "6,1" | 573,4 · "6,1" |
| `/livro-razao` | desktop | 11869 / 14,84 | 11806 / 14,76 | −63 | 273,5 | 273,5 | 658,5 | 627,3 |
| `/livro-razao/divida-publica-2025` | mobile | 2714 / 4,09 | 2777 / 4,18 | +63 | 264,1 | 219,3 | 264,1 | 219,3 |
| `/livro-razao/divida-publica-2025` | desktop | 1561 / 1,95 | 1561 / 1,95 | 0 | 277,5 | 277,5 | 277,5 | 277,5 |
| `/agenda` | mobile | 12786 / 19,26 | 13355 / 20,11 | +569 | 266,1 | 221,3 | 575,1 | 643,3 |
| `/agenda` | desktop | 10606 / 13,26 | 10606 / 13,26 | 0 | 275,5 | 275,5 | 583,1 | 583,1 |
| `/metodo` | mobile | 3549 / 5,34 | 3814 / 5,74 | +265 | 233,3 | 188,5 | 359,6 | 325,6 |
| `/metodo` | desktop | 3367 / 4,21 | 3367 / 4,21 | 0 | 242,8 | 242,8 | 404,4 | 404,4 |
| `/correcoes` | mobile | 7270 / 10,95 | 7221 / 10,88 | −49 | 266,1 | 221,3 | 1878,2 | 1914,4 |
| `/correcoes` | desktop | 5655 / 7,07 | 5610 / 7,01 | −45 | 275,5 | 275,5 | 1534,2 | 1534,2 |
| `/en` | mobile | 6106 / 9,20 | 6117 / 9,21 | +11 | 96,2 | 68,2 | não achado | não achado |
| `/en` | desktop | 4884 / 6,11 | 3874 / 4,84 | −1010 | 112,4 | 112,4 | não achado | não achado |
| `/estudos/evora-quinze-anos-cinco-mandatos/texto` | mobile | 161284 / 242,90 | 49281 / 74,22 | **−112003** | 284,1 | 687,1 | 4111,7 | 4514,7 |
| `/estudos/evora-quinze-anos-cinco-mandatos/texto` | desktop | 102475 / 128,09 | 40572 / 50,72 | **−61903** | 301,5 | 590,3 | 3441,0 | 3729,8 |

**Nota:** as alturas de `/` e `/en` no ar (6132 e 6106) batem com as publicadas pelo leitor-utilizador (6132) para a primeira página. As duas leituras longas encolhem entre 59% e 69% no telemóvel: é o efeito de fechar por defeito "As linhas deste documento" (item 8). `/` e `/en` no computador perdem 1010 px: é o efeito de a régua da convergência (item 7) já não existir na página.

### Tabela 2 · alvos de toque abaixo de 44×44 px efetivos (telemóvel, elemento + pseudo-elementos posicionados)

| rota | antes | depois | Δ |
|---|---|---|---|
| `/` | 14 | 4 | −10 |
| `/municipios` | 10 | 7 | −3 |
| `/municipios/evora` | 90 | 80 | −10 |
| `/estudos` | 16 | 6 | −10 |
| `/estudos/evora-prometido-pago-auditado-2026` | 15 | 19 | +4 |
| `/estudos/.../texto` | 302 | 300 | −2 |
| `/livro-razao` | 15 | 18 | +3 |
| `/livro-razao/divida-publica-2025` | 15 | 8 | −7 |
| `/agenda` | 60 | 47 | −13 |
| `/metodo` | 32 | 20 | −12 |
| `/correcoes` | 10 | 16 | +6 |
| `/en` | 15 | 4 | −11 |
| `/estudos/evora-quinze-anos-cinco-mandatos/texto` | 578 | 606 | +28 |

Os números não caem a zero em nenhuma rota; ficam entre 6 e 606. As duas leituras longas continuam com centenas (300 e 606) mesmo depois de a página encolher, porque os alvos são as 314 e 633 "portas" de linha (`a[href^="#linha-"]`) que o bloco 8 acrescentou, cada uma um número ou símbolo pequeno dentro do corpo do texto: a mesma correção que fecha a página por defeito multiplica os alvos de toque miúdos dentro dela. `/estudos/evora-prometido-pago-auditado-2026`, `/livro-razao` e `/correcoes` sobem; não investiguei a causa elemento a elemento em cada uma, por tempo, mas os números ficam registados.

### Tabela 3 · texto abaixo de 12 px visível (telemóvel)

| rota | antes | depois | Δ |
|---|---|---|---|
| `/` | 30 | 0 | −30 |
| `/municipios` | 323 | 312 | −11 |
| `/municipios/evora` | 139 | 19 | −120 |
| `/estudos` | 64 | 2 | −62 |
| `/estudos/evora-prometido-pago-auditado-2026` | 44 | 0 | −44 |
| `/estudos/.../texto` | 20 | 0 | −20 |
| `/livro-razao` | 397 | 0 | −397 |
| `/livro-razao/divida-publica-2025` | 12 | 0 | −12 |
| `/agenda` | 205 | 20 | −185 |
| `/metodo` | 42 | 14 | −28 |
| `/correcoes` | 62 | 3 | −59 |
| `/en` | 30 | 0 | −30 |
| `/estudos/evora-quinze-anos-cinco-mandatos/texto` | 15 | 0 | −15 |

`/municipios` continua com 312 ocorrências; é a maior contagem que sobra. Não abri essa lista elemento a elemento.

### Tabela 4 · sobreposições de texto (caixas de linha recortadas por antepassados com overflow não visível)

| rota | largura | antes | depois | Δ |
|---|---|---|---|---|
| `/` | mobile | 6 | 7 | +1 |
| `/` | desktop | 5 | 6 | +1 |
| `/municipios` | mobile / desktop | 0 / 0 | 0 / 0 | 0 |
| `/municipios/evora` | mobile | **1** | **0** | **−1** |
| `/municipios/evora` | desktop | 1 | 2 | +1 |
| `/estudos` | mobile / desktop | 0 / 0 | 0 / 0 | 0 |
| `/estudos/evora-prometido-pago-auditado-2026` | mobile | 0 | 0 | 0 |
| `/estudos/evora-prometido-pago-auditado-2026` | desktop | 7 | 7 | 0 |
| `/estudos/.../texto` (as duas) | mobile / desktop | 0 / 0 | 0 / 0 | 0 |
| `/livro-razao`, `/livro-razao/divida-publica-2025`, `/agenda`, `/metodo`, `/correcoes` | ambas | 0 / 0 | 0 / 0 | 0 |
| `/en` | mobile / desktop | 7 / 7 | 8 / 8 | +1 / +1 |

O par «242,6 → 105,5» (item conhecido) desaparece no telemóvel (1 → 0). A 1280 sobe de 1 para 2; abri as duas em `/municipios/evora` desktop depois: não são o mesmo par de números, e não investiguei mais fundo por tempo. Nas 7-8 sobreposições de `/en` (presentes igualmente antes e depois, não uma regressão do bloco): são pares como "Portugal breaches" / "thresholds of the Macroeconomi[c]" com 10,22 px de altura de cruzamento, e "O Estado do País" / "An observatory of Portugal." com 4,33 px; parecem-me sobreposições de altura de linha entre trechos `inline` adjacentes que quebram linha dentro do mesmo título, não a colisão visível e nítida do caso C2. Fica o número, não a interpretação forçada.

### Tabela 5 · bandas vazias acima de 48 px (interiores, entre dois blocos de conteúdo; só páginas ≤ 50 000 px)

| rota | largura | antes | depois |
|---|---|---|---|
| `/` | mobile | 5 bandas · maior 96px | 1 banda · maior 68px |
| `/` | desktop | 8 bandas · maior 128px | 5 bandas · maior 94px |
| `/municipios` | mobile | 3 bandas · maior 59px | 2 bandas · maior 68px |
| `/municipios` | desktop | 3 bandas · maior 94px | 3 bandas · maior 94px |
| `/municipios/evora` | mobile | 3 bandas · maior 72px | 1 banda · maior 73px |
| `/municipios/evora` | desktop | 3 bandas · maior 91px | 2 bandas · maior 89px |
| `/estudos` | mobile | 2 bandas · maior 60px | 1 banda · maior 68px |
| `/estudos` | desktop | 2 bandas · maior 94px | 2 bandas · maior 94px |
| `/estudos/evora-prometido-pago-auditado-2026` | mobile | 2 bandas · maior 71px | 1 banda · maior 72px |
| `/estudos/evora-prometido-pago-auditado-2026` | desktop | 2 bandas · maior 95px | 2 bandas · maior 95px |
| `/estudos/.../texto` (evora-prometido) | mobile | **não medido** (74046px > 50000px) | 8 bandas · maior 111px |
| `/estudos/.../texto` (evora-prometido) | desktop | 11 bandas · maior 153px | 13 bandas · maior 138px |
| `/livro-razao` | mobile | 2 bandas · maior 60px | 1 banda · maior 69px |
| `/livro-razao` | desktop | 2 bandas · maior 94px | 2 bandas · maior 94px |
| `/livro-razao/divida-publica-2025` | mobile | 2 bandas · maior 73px | 1 banda · maior 72px |
| `/livro-razao/divida-publica-2025` | desktop | 2 bandas · maior 97px | 2 bandas · maior 97px |
| `/agenda` | mobile | 3 bandas · maior 59px | 3 bandas · maior 69px |
| `/agenda` | desktop | 6 bandas · maior 94px | 6 bandas · maior 94px |
| `/metodo` | mobile | 3 bandas · maior 60px | 2 bandas · maior 69px |
| `/metodo` | desktop | 4 bandas · maior 94px | 4 bandas · maior 94px |
| `/correcoes` | mobile | 3 bandas · maior 100px | 2 bandas · maior 100px |
| `/correcoes` | desktop | 3 bandas · maior 144px | 3 bandas · maior 144px |
| `/en` | mobile | 5 bandas · maior 96px | 1 banda · maior 68px |
| `/en` | desktop | 8 bandas · maior 128px | 5 bandas · maior 95px |
| `/estudos/evora-quinze-anos-cinco-mandatos/texto` | mobile | **não medido** (161284px > 50000px) | 9 bandas · maior 84px |
| `/estudos/evora-quinze-anos-cinco-mandatos/texto` | desktop | **não medido** (102475px > 50000px) | 16 bandas · maior 111px |

Nenhuma banda chega a 200 px em lado nenhum. Nenhuma banda no ar chega perto do limiar de 50 000 px exceto as duas leituras longas, que ultrapassam-no nas três medições possíveis; por isso **não digo zero onde não medi**: essas três células ficam "não medido", não "0". No `dist/`, como as duas leituras encolheram (tabela 1), ambas ficam agora abaixo do limiar e por isso mensuráveis: é uma medição nova que o «antes» não permitia fazer.

### Tabela 6 · transbordo horizontal (`scrollWidth > innerWidth`)

Zero em 13 rotas × 2 larguras × 2 construções, sem exceção. Nada transborda, antes nem depois.

## 3 · Os comandos da primeira página (item 7)

**7a · Depois de escolher "Concelho", o campo de pesquisa está dentro do ecrã e tem o foco (telemóvel, toque real).**

* **Depois:** toquei em `a.seg` com texto exato "Concelho" (`data-modo="municipio"`). A URL passa de `/` para `/?ambito=municipio` sem navegação de página inteira; aparece `input#pesquisa-concelho`, com `top: 566, bottom: 610` dentro de `innerHeight: 664` (**dentro do ecrã**), e **tem o foco** (`document.activeElement === input`). **Cumpre.**
* **Antes:** o telemóvel não tem um estado "Concelho" (ver 7e). A primeira tentativa tocou em `a.movel-selo` ("Abrir a escolha de concelho", que é o mapa embrulhado num `<a>`, 84 × 111 px), e essa combinação por acaso deixou a pesquisa dentro do ecrã; **descubro que estava a testar o botão errado** e refiz o teste a tocar especificamente em `a.movel-destino` com o texto "Abrir um concelho →" (o botão real que corresponde ao B1 da auditoria). Resultado corrigido: `top: −103,4, bottom: −59,4`, **fora do ecrã** (acima), foco não vai para o campo (`focado: false`). Fica registado como falsa alarme minha na primeira passagem, com a causa (o seletor genérico `/concelho/i` apanhou o elemento errado primeiro), e o número correto do "antes" é este segundo.

**7b · O mapa não é rendido no telemóvel.**

* **Depois:** `visivel: false` antes E depois do toque em "Concelho" (309 círculos no SVG, mas `getClientRects().length === 0`, isto é, sem caixa pintada). **Cumpre.**
* **Antes:** `visivel: true`, 309 círculos, é o mapa de 84×110,6 px do B2 da auditoria; continua lá.

**7c · No computador, o ponto de Évora é uma ligação para `/municipios/evora`; quantos pontos são ligações.**

* **Antes e depois, iguais:** o círculo de Évora foi encontrado (via atributo com "evora"), mas **não está dentro de nenhum `<a>`** até 5 níveis acima (`evoraHref: null`). De 309 pontos, **0 são ligações**, nas duas construções. **Este defeito (B3 da auditoria) não está corrigido no `dist/` medido.**

**7d · A régua não existe em `/`.**

* **Depois:** nem "régua" nem "convergência" aparecem em `document.body.innerText` (texto visível) nas duas larguras. Verifiquei também `textContent` (tudo, incluindo escondido): "régua" aparece uma vez, mas é o nome do concelho **"Peso da Régua"** na lista de pesquisa, não um resquício do componente. **Cumpre**, sem ressalva.
* **Antes:** "régua" e "convergência" aparecem em `innerText` (visíveis) nas duas larguras; o componente existe.

**7e · O comando tem os estados "País" e "Concelho" nas duas larguras.**

* **Depois:** `a.seg` com texto exato "País" e "Concelho", **visíveis** (caixa não nula) no telemóvel (145×44 e 144×44) e no computador (56×34 e 101×34). **Cumpre nas duas larguras.**
* **Antes:** no computador há `a.seg` "País" (visível) mas o terceiro estado chama-se **"Município"**, não "Concelho" (texto exato não bate). No telemóvel, os três `a.seg` ("País", "Região", "Município") **existem no DOM mas com caixa 0×0** (escondidos por CSS): nem "País" nem "Concelho" ficam visíveis no telemóvel antes.

## 4 · As páginas de leitura (item 8)

Medido nas duas páginas (`/estudos/evora-prometido-pago-auditado-2026/texto` e `/estudos/evora-quinze-anos-cinco-mandatos/texto`), nas duas larguras.

**8a · "As linhas deste documento" dentro de um `<details>` fechado por defeito.**

* **Depois, as duas páginas, as duas larguras:** `hasDetails: true`, `detailsOpenByDefault: false`, `id="linhas-do-documento-dobra"`. **Cumpre, sem exceção.**
* **Antes, as duas páginas:** `hasDetails: false`. O título não está dentro de nenhum `<details>`; é por isso que a página é tão comprida (tabela 1).

**8b · Navegar para `#linha-<row>` (tocar na porta de uma figura) abre a dobra e põe a entrada dentro do ecrã.**

Toquei/cliquei na primeira porta de cada página (`#linha-tc-families` na primeira leitura, `#linha-clc24-favor` na segunda).

* **`.../evora-prometido-pago-auditado-2026/texto`, depois:** a dobra abre (`detailsOpenAgora: true`) e a entrada fica dentro do ecrã, no telemóvel (top 0, bottom 206, de 664) e no computador (top 0, bottom 110, de 800). **Cumpre nas duas larguras.**
* **`.../evora-quinze-anos-cinco-mandatos/texto`, depois:** a dobra abre (`detailsOpenAgora: true`) nas duas larguras. A posição fica **à justa**: o valor não arredondado de `top` é **−0,36 px** no telemóvel e **−0,44 px** no computador (bottom 205,64 e 109,56, dentro do limite). É uma fração de pixel acima do topo do ecrã, não um "fora do ecrã" visível; o teste estrito `top >= 0` do brief falha por essa fração, e registo o número exato em vez de arredondar para "cumpre". Nesta página, a página tem 633 portas contra 314 na primeira; não investiguei se a diferença de posição está ligada a isso.
* **Antes, as duas páginas:** não há `<details>` a abrir (`detailsFoundForTarget: false`, `detailsOpenAgora: null`); a página só navega para a âncora. Na primeira leitura fica dentro do ecrã a 390 mas fora a 1280 (por a página ser mais estreita que larga não muda a posição vertical do alvo); na segunda leitura fica fora do ecrã nas duas larguras.

**8c · O índice "Nesta página" existe e cada âncora resolve.**

* **Depois, as duas páginas, as duas larguras:** `found: true`; 9 âncoras (primeira leitura) e 8 âncoras (segunda), **todas resolvem** (`allResolve: true`, `resolvedCount` = total). **Cumpre.**
* **Antes:** `found: false` nas duas páginas; não há esse índice.

**8d · O caminho `.record.json` e os resumos de 64 hexadecimais não estão visíveis com a dobra fechada.**

* **Depois, as duas páginas, as duas larguras:** 0 ocorrências visíveis de `.record.json` e 0 de resumos de 64 hexadecimais. **Cumpre.**
* **Antes:** `.record.json` aparece 1 vez visível nas duas páginas; resumos de 64 hexadecimais aparecem **1 vez** na primeira leitura e **208 vezes** na segunda, visíveis, sem nenhuma dobra a escondê-los.

## 5 · O índice dos estudos (item 9)

Heurística própria: encontrei o maior grupo de irmãos diretos com a mesma etiqueta e classe dentro de `<main>`, sem presumir nomes.

* **Antes:** **16** linhas (`article.arquivo-item`), cada uma com **1** ligação por linha (`editionsPerRow`: dezasseis vezes "1"). "Descrição: reformulação do título" **está visível** no corpo da página.
* **Depois:** **12** linhas, com **2 a 5** ligações por linha (edições dentro da mesma linha: `[3,3,4,2,3,5,4,3,3,3,3,3]`). "Descrição: reformulação do título" **não aparece** em `document.body.innerText`.

Os dois números pedidos pela §1 (12 e não 16, edições dentro da linha) **cumprem**, e a frase de campo visível desaparece.

## 6 · O marcador `[a verificar]` (item 10)

Contado em texto visível, nas 13 rotas, no computador, nas duas construções; para cada ocorrência, se está (ou o antepassado mais próximo é) uma ligação, e para onde.

| rota | antes: total / ligado | depois: total / ligado | nota |
|---|---|---|---|
| `/`, `/municipios`, `/en`, `.../evora-quinze-anos-cinco-mandatos/texto` | 0 / 0 | 0 / 0 | marcador não aparece nestas rotas |
| `/municipios/evora` | 1 / 0 | 1 / **1** | liga a `/a-verificar` |
| `/estudos` | 15 / 0 | 11 / **11** | todas ligam a `/a-verificar` |
| `/estudos/evora-prometido-pago-auditado-2026` | 4 / 0 | 4 / **1** | 3 continuam a ligar a páginas do livro-razão (ex. `/livro-razao/evora-prr-aprovado-2026`), não a `/a-verificar` |
| `/estudos/.../texto` (evora-prometido) | 5 / 0 | 5 / 0 | as 5 ligam a páginas do livro-razão, nenhuma a `/a-verificar` |
| `/livro-razao` | 16 / 0 | 16 / **8** | metade liga a `/a-verificar`, metade continua a ligar a páginas de linha específicas |
| `/livro-razao/divida-publica-2025` | 0 / 0 | 0 / 0 | sem ocorrências |
| `/agenda` | 11 / 0 | 11 / **11** | todas ligam a `/a-verificar` |
| `/metodo` | 1 / 0 | 1 / **1** | liga a `/a-verificar` |
| `/correcoes` | 9 / 0 | 9 / 0 | as 9 continuam a ligar a páginas do livro-razão, nenhuma a `/a-verificar` |

**Leitura:** no "antes", **nenhuma** ocorrência (61 no total, somando as 13 rotas) é uma ligação para lado nenhum. No "depois", **33 de 63** ficam com ligação, e dessas quase todas vão para `/a-verificar`; as restantes (nas páginas de estudo e em `/correcoes`) continuam a ligar diretamente à página de livro-razão da linha em causa, o que também é uma ligação útil, só que não é `/a-verificar`. Não decido se isso cumpre o item 10 à letra, porque a letra do item ("é uma ligação para `/a-verificar`") não distingue as duas leituras; registo os números tal como saíram, com os destinos exatos.

## 7 · O inglês (item 11)

Contado em `document.body.innerText` de `/en`, excluindo texto dentro de `h1,h2,h3,article,blockquote,[data-verbatim]` (título de trabalho ou excerto).

* **Antes:** 13 ocorrências de "concelho" no total; **8** fora de título/excerto (de interface): "Type the name of the concelho", "No concelho by that name.", "change concelho →", "concelhos · CAOP", "Tap a point to choose the concelho.", "Open the concelho chooser" (rótulo `vh`), "Open a concelho", "concelhos" (contador do mapa).
* **Depois:** **0** ocorrências, no total e de interface. **Cumpre por completo.**

## 8 · O livro-razão (item 12)

**12a · "Proveniência completa" tem denominador.**

* **Antes:** o título é literalmente "Proveniência completa", sem número; o "128" vem à parte, num parágrafo seguinte, sozinho. Sem denominador.
* **Depois:** o título passou a ser "**128 de 136** linhas com proveniência completa", os dois números dentro do mesmo elemento. **Cumpre.**

**12b · Nas páginas de linha, o endereço da fonte não transborda.**

Medido em `/livro-razao/divida-publica-2025`, as duas larguras. Corrigi o método a meio: a primeira versão comparava `scrollWidth`/`clientWidth` do elemento imediato, que para um nó `inline` dá sempre 0/0 por definição do CSSOM, e por isso não provava nada; passei a comparar a caixa do próprio texto (`Range.getClientRects()`) com a caixa do antepassado em bloco mais próximo, e a olhar ao `scrollWidth` desse antepassado em bloco.

* **Antes e depois, as duas larguras:** os dois endereços (Eurostat) ficam dentro da caixa do parágrafo em bloco que os contém (largura do texto ≤ largura do bloco, com folga de pelo menos 0,04 px), e `document.documentElement.scrollWidth === window.innerWidth` nas duas construções. **Não transborda em nenhum dos dois.**

## 9 · Évora (item 13)

**13a · "sem limiar" sem quadrado.**

Encontrei o cartão por `[data-medida="evora-populacao-2025"]` (estável nas duas construções).

* **Antes:** `<div class="peca-topo"><span class="sq sq-sem" aria-hidden="true"></span><span class="peca-palavra">sem limiar</span></div>`. Há um quadrado (`span.sq.sq-sem`, vazio, `aria-hidden`), sem conteúdo de pseudo-elemento a compensar.
* **Depois:** `<div class="peca-topo"><span class="peca-palavra">sem limiar</span></div>`. O `span.sq.sq-sem` desapareceu; `topoChildCount` passa de 2 para 1. **Cumpre**, nas duas larguras.

**13b · O gráfico dos mandatos com os rótulos do mesmo lado.**

Encontrei o gráfico por ter ≥ 3 `rect`, ≥ 2 anos (regex de 4 dígitos) e ≥ 2 valores decimais dentro do mesmo `svg`: é o gráfico com os quatro valores "242,6 / 182,0 / 141,9 / 105,5" e os anos "2014/2017/2021/2024". Para cada valor, medi se o seu centro Y fica acima ou abaixo do centro Y da barra mais próxima em X.

* **Antes e depois, as duas larguras, valores idênticos:** "242,6" acima, "182,0" acima, "141,9" **abaixo**, "105,5" **abaixo**. `mesmoLado: false` nas quatro medições (antes/depois × mobile/desktop). **Este defeito (D8 da auditoria) continua por corrigir no `dist/` medido, sem qualquer diferença face ao "antes".**

## 10 · A régua do inventário (item 14)

Corri `node scripts/medir-defeitos.mjs` na raiz do repositório (o `dist/` do repositório é byte a byte a mesma lista de ficheiros que a cópia congelada em `dist-depois/`, confirmei por `diff` de nomes antes de correr). Corri-o tal como está, sem argumentos, sem o ler. Saída completa, 67 linhas, código de saída 0.

**Autorreferência, por rota:** a saída lista 34 rotas sob "frases da casa", cada uma com uma contagem de "autorreferência"; **todas as 34 mostram `autorreferência 0`** (a lista completa: `/`, `/agenda`, `/correcoes`, `/en` e as suas 12 sub-rotas em inglês, `/estudos` e as suas 15 sub-rotas em português, `/livro-razao`, `/municipios`, `/municipios/evora`). Nenhuma rota tem autorreferência.

**"Blocos por classificar":** **não encontrei nenhuma linha com esse rótulo exato na saída do script.** Não invento o zero; digo o que vi. As linhas mais próximas em espírito são: `primeira página ... 0 valores sem selo · 0 selos para outra linha`, `primeira página (distintas) 0 sem selo · 0 para outra linha`, e `[descrição em preparação] . 0 ocorrências em 0 páginas`, todas a zero. O commit `074edf3` (visível no histórico do repositório, não lido por conteúdo) chama-se "o instrumento das sobreposições corrigido, e o inventário sem blocos por classificar", o que é consistente com a saída atual não ter nada por classificar para listar, mas não é prova direta: o script pode simplesmente não imprimir uma secção quando não há nada a listar, e eu não posso confirmar isso sem ler o código, o que o brief proíbe. Fica como leitura mais provável, rotulada como **inferida**, não verificada.

O resto da saída (fora do que o item 14 pede, registado por completude): 326 páginas construídas, porta de correções 326/326 com o selo verde, 88 frases de moldura distintas em 2483 ocorrências, 27 de 136 linhas do livro-razão com `#page=`, 22 com recorte, 0 localizadores internos, e as seis "frases de cobertura" (inglês e português, com/sem página, sem linha) todas com o selo verde.

## 11 · Discordâncias contra a lista da §1

O que a §1 do brief descreve como o estado esperado do "depois", e o que medi:

| item | esperado (leitura da §1) | medido | discordância |
|---|---|---|---|
| 7c | (a §1 só pede a contagem, não impõe corrigir) | 0 de 309 pontos são ligações, Évora incluído, nas duas construções | **Não é uma discordância no sentido de "devia estar e não está" declarado pela §1**, mas fica registado como o que não mudou: o ponto de Évora, que a auditoria (B3) já tinha achado sem ligação, continua sem ligação no `dist/` medido |
| 8b, segunda leitura | entrada dentro do ecrã depois de tocar na porta | `top: −0,36px` (telemóvel) e `−0,44px` (computador), uma fração de pixel acima de 0 | discordância **à letra** do teste (`top >= 0`), por menos de meio pixel; coordenada e prova na secção 4 |
| 10 | onde o marcador rende, é uma ligação para `/a-verificar` | em `/estudos/evora-prometido-pago-auditado-2026/texto` (5 ocorrências) e em `/correcoes` (9 ocorrências), **nenhuma** liga a `/a-verificar`; ligam antes a páginas de linha do livro-razão | discordância parcial, com coordenada e prova na secção 6 |
| 13b | (a §1 pede a medição; não impõe que já esteja corrigido) | rótulos do gráfico dos mandatos continuam em lados diferentes, sem qualquer alteração entre antes e depois | **discordância clara**: é a única das treze medições de item específico em que o número do "depois" é idêntico, ao pixel, ao do "antes" |

Todos os outros subitens de 7, 8, 9, 11, 12, 13a que descrevem um estado esperado cumprem no `dist/` medido, com o número e a coordenada nas secções 3 a 9.

## 12 · As minhas falsas alarmes, com a causa

1. **93 vs 30 textos pequenos em `/` no telemóvel**, no mesmo código, em corridas diferentes. Causa: bug de cobertura no meu detetor (não tratava `<details>` fechado); corrigido, ver §0.2. Depois da correção, seis corridas manuais consecutivas deram 30 de forma estável; uso 30.
2. **21 sobreposições em `/municipios/evora` no telemóvel**, onde o caso conhecido é 1. Causa: texto sr-only (`.vh`) com caixa de linha não cortada, mais uma sobreposição residual de exatamente 1×1 px contra esse mesmo texto. Corrigido em duas etapas, ver §0.1.
3. **Bandas vazias 3× maiores do que deviam** na primeira versão do detetor de bandas. Causa: `page.screenshot({fullPage:true})` devolve pixéis de dispositivo por defeito; no WebKit móvel (`deviceScaleFactor` 3 do iPhone 13) isso triplica as dimensões da imagem. Corrigido com `scale:'css'` antes de qualquer medição de banda ser feita.
4. **7a no "antes" a dar "cumpre" na primeira passagem.** Causa: o seletor `/concelho/i` apanhou "Abrir a escolha de concelho" (o mapa embrulhado num `<a>`) antes de "Abrir um concelho →" (o botão real). Corrigido a testar o botão certo à mão; o número usado no relatório é o corrigido (fora do ecrã, sem foco).
5. **"régua" a aparecer no DOM de `/` depois, mesmo com o componente ausente.** Causa: é o nome do concelho "Peso da Régua" na lista de pesquisa, uma correspondência de texto genuína mas irrelevante. Não é o componente da régua da convergência.
6. **Distância ao selo "não achada" em `/en`.** Causa: o meu detetor procura a palavra "fonte"; em inglês o selo diz "source". Limitação do detetor, não do sítio.
7. **Endereço de fonte a "não transbordar" com `scrollWidth`/`clientWidth` a 0/0.** Causa: o elemento de texto é `display:inline`, e por definição do CSSOM `clientWidth`/`scrollWidth` de um elemento `inline` são sempre 0, o que não prova nem desmente transbordo. Corrigido a medir contra o antepassado em bloco mais próximo.

## 13 · O custo

Não tenho leitura direta de um contador de tokens de entrada/saída da API. O que consigo ver é o orçamento de contexto restante que o ambiente me mostra, que caiu de 15 000 000 no início da sessão para cerca de **14 538 000** perto do fim, ou seja, à volta de **460 000 símbolos** de contexto consumidos, contando tudo: a leitura do brief e da auditoria, as dezenas de sondagens de DOM feitas para desenhar e corrigir cada detetor, a investigação dos quatro casos conhecidos, a caça às anomalias (93 vs 30 no item de texto pequeno, o botão errado no item 7a, e a verificação final de que outra sessão estava a modificar o mesmo repositório ao mesmo tempo), e este relatório. Não tive nenhuma imagem nem captura de ecrã lida como visão nesta medição (ao contrário da auditoria, que leu 30 capturas); os meus dados vêm todos de `page.evaluate()` e de ficheiros JSON, o que deve pesar bastante menos por medição do que uma captura de página inteira. **Rotulado como inferido, não verificado**, à falta de acesso direto ao contador.

---

*Ficheiros: o programa é `correcoes-ux-M3-sonnet.mjs`, ao lado deste relatório. Os dados brutos (JSON) ficam em `/private/tmp/.../scratchpad/m3/` (`known-cases.json`, `sweep-results.json`, `specific-results.json`, `medir-defeitos-output.log`), fora do repositório, como o brief pede.*
