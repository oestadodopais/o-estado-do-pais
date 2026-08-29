# A passagem de higiene do registo dos defeitos · 29.08.2026

*Corrida pelo revisor (Claude Opus) numa cópia do repositório em `main` `98fd779`, ramo `higiene-issues-2026-08-29`, contra o brief `design/especime-v3/briefs/BRIEF-higiene-issues.md`. Nenhuma linha de código foi alterada; os dois ficheiros tocados são o `ISSUES.md` e este relatório. Sem travessões na prosa.*

## 1 · A construção que serve de prova

`npm ci` e `npm run build` na cópia, verdes, saída 0. A construção dá **6 605 ficheiros `index.html`** (6 606 HTML ao todo, com a página de erro; a régua do inventário conta 6 590, que é sem os documentos de estudo) e a cadeia inteira fecha: `ledger:check`, `check:cruzamento`, `check:documentos`, `astro build`, `stamp:version`, `cartoes` (580 PNG, 580 de 580 em paleta exacta), `gate:html`, `check:cadeia`, `check:dados`, `check:mapa` (7 regras), `check:regioes` (5 regras), `check:areas` (7 regras) e `check:voz` (65 marcadores, 7 excepções, 695 frases distintas, autorreferência 0). É este `dist/` que todas as medições abaixo leem.

**Uma nota de método, porque mudou medições.** O `grep` desta máquina não conta cadeias com acentos de forma fiável: medido, `grep -o 'livro-razão'` deu 0 numa página que a tem, com «Évora» a dar 104 no mesmo ficheiro. Todas as contagens de texto foram por isso refeitas em Node, sobre o texto extraído com `node-html-parser`, e cada uma leva o seu controlo positivo ao lado. Pela mesma razão, as contagens por `grep -c` sobre HTML minificado foram descartadas: contam linhas e não ocorrências.

**Três medições próprias falharam o seu próprio controlo e foram refeitas antes de virar número:** a minha aritmética do `::after` discordou da régua da casa (dizia 21 de 22 selos abaixo de 44 onde a casa mede um mínimo de 61,0×44,0), e passou a usar-se a sonda `SONDA_ALVOS` de `tests/inicio/correcoes-a.mjs` à letra; a `procura()` da ortografia foi chamada sem o comparador e deu 0 no controlo positivo; e o detector do I66 tinha um `\b` a seguir a `%`, que nunca podia casar. Os números que ficam são os das versões corrigidas.

## 2 · As contagens

| | |
|---|---|
| linhas do registo | **92** (inalteradas: nenhuma acrescentada, nenhuma perdida) |
| **abertas antes** | **29** (28 com o estado a começar por «aberto», mais a I91, com metade aberta) |
| **fechadas agora com prova** | **1** (I30) |
| **sem objeto** | **2** (I17, I28) |
| **ainda abertas** | **26**, das quais **3** parcialmente resolvidas com o estado reescrito (I13, I62, I78) |
| linhas tocadas | **15** |
| linhas já fechadas tocadas | **0** |
| linhas cuja coluna «o quê» mudou | **0** |

Das 26 que continuam abertas, **12** ficaram com o estado reescrito porque a medição de hoje mudou o que um leitor concluiria (I2, I13, I15, I19, I23, I36, I37, I49, I62, I64, I71, I78) e **14** ficaram intactas porque a medição confirmou o que a linha já dizia (I31, I41, I43, I47, I48, I50, I55, I57, I58, I66, I68, I87, I91, I92).

## 3 · A tabela

| # | estado antes | estado depois | a prova (medição própria) | commit ou entrada |
|---|---|---|---|---|
| I2 | aberto | aberto, estado reescrito | `nota-v3` e «postura de SELO» continuam em `maquetas/canvas-export.html` e `canvas.json`; controlo: 17 de 32 ficheiros da pasta levam «mapa». A postura descrita caiu com a Emenda 20: `dist/index.html` tem 0 `circle.mun` e 29 `a.uni-porta` | §1.72 (para o facto novo); a decisão é da direção |
| I13 | aberto (duas metades) | parcialmente resolvido | Évora: `SONDA_ALVOS` da casa corrida à letra dá **0 pares sobrepostos** a 390 nas duas edições, onde tinha 6. Frase: a excepção continua em `site.css:847`; `.brief-text` rende em 20 páginas (18 de região, 2 do Método), 2 com dois selos numa frase nas duas edições; entrelinha 27,65px, área do selo 52,5×19 (pt) e 61×19 (en); rampa 320 a 1440 de 16 em 16, 71 larguras × 4 rotas, 0 pares, e zero **porque** a área é 19 e não 44 | §1.66 B10 fecha a metade do município; a outra depende da §1.66 A3 e da Emenda 21 (§1.75) só para a mudança de superfície |
| I15 | aberto | aberto, estado reescrito | Estilo computado em Chromium, técnica da célula «3a · a letra» de `tests/linha/recibo.mjs`, fora de instrumento: `/agenda` 223, `/estudos` 69, `/metodo` 48, `/municipios/evora` 26, e 1 em cada de `/`, `/en/`, `/regioes`, `/livro-razao`, `/areas`. A página de linha lê **0** | a metade da página de linha continua fechada pela subetapa 3a |
| I17 | aberto por desenho | **sem objeto desde a Emenda 20** | Primeira página: 0 `circle.mun`, 29 `a.uni-porta`; célula A6 de `correcoes-a.mjs` diz «0 leituras e 0 pontos». Cartão localizador em `/municipios/evora` e `/municipios/beja`: 308 pontos, **0 dentro de uma âncora**, 2,55×2,55 px cada. Nenhum ponto é porta, logo não há alvo por ponto | Emenda 20, DECISIONS §1.72 |
| I19 | aberto | aberto, estado reescrito | `node scripts/medir-defeitos.mjs`: **113 distintas, 54 143 ocorrências** (6 590 são a porta de correcções). Eram 77, depois 94. O sítio passou de 344 para 6 590 páginas medidas, e a medida conta ocorrência | a fase da voz correu (§1.69, §1.70, §1.73, §1.74) e não fez descer este número |
| I23 | aberto | aberto, estado reescrito | `PLANO-redesenho-v3.md:59` continua a dizer «the `82 p` claim» como uma linha só. Hoje **10** ficheiros de `ledger/claims/` levam `source_flag: "p"`; controlo: 12 levam `source_flag`, 2 levam `"a)"`. Eram seis | o plano continua por corrigir; é do lugar de direção |
| I28 | aberto, de propósito | **sem objeto desde `1cac621`** | `naoDiz` dá 0 em `src/i18n/strings.mjs` (controlo: «mapa» dá 22) e 0 em `src/ public/ scripts/ tests/`. A cadeia «O que o mapa não diz» está em `1cac621^` e sai em `1cac621`; nenhum commit posterior a repôs | `1cac621` (21.08.2026) |
| I30 | aberto | **FECHADO com prova** | `desenhaLeitura` e «todas» dão **0** em `public/js/convergencia.js` (147 linhas); `/` não cita o ficheiro, `/regioes` cita. A régua completa, construída no servidor, dá **10 marcas, 10 selos, 10 leituras**: uma entrada de legenda por cópia desenhada. O estado de execução do defeito não é alcançável | `a96482b`, Emenda 21, DECISIONS §1.75 |
| I31 | aberto | aberto, intacto | `public/js/tema.js` com 181 linhas, cabeçalho a declarar «PARTE 1» e «PARTE 2» e mais nenhuma, 3 `aria-expanded`; o `theme-color` da §1.79 vive dentro da parte do tema e não é uma terceira parte. A linha continua exacta | nenhum |
| I36 | aberto (3 chaves) | aberto, estado reescrito | `prova('pt')` declara **85** chaves, que é o número que o portão imprime; varridas as 6 606 páginas por `data-prova="<chave>"`: 45 rendem-se, **40 não se rendem em nenhuma**. As três da linha continuam lá; 29 das 40 são as `mapa_concelhos_<unidade>` que a Emenda 20 criou | §1.66 A3 e §1.70 mantêm a regra do portão; a Emenda 20 (§1.72) trouxe as 29 chaves |
| I37 | aberto, não corrigido de propósito | aberto, estado reescrito | Um varrimento de bytes dá **1** NUL, hoje no deslocamento **85 259** (eram 79 478); `grep -c "eDerivada"` sai a 1 sem imprimir, `grep -ac "const chave"` dá 1. A condição da linha cumpriu-se: o bloco dos vazios editou o ficheiro e não fez a correção | DECISIONS §1.77 abriu o ficheiro sem corrigir |
| I41 | aberto, não corrigido de propósito | aberto, intacto | `ORIGEM_DECLARADA` (`medir-defeitos.mjs:181`) continua com nove atributos e **sem** `[data-prova]`; o comentário da medida 8 (linha 262) e a nota da linha 607 continuam a dizer que o deixa cair | nenhum |
| I43 | aberto como registo | aberto, intacto | `COBERTURA_DECLARADA` continua fora de `ORIGEM_DECLARADA` de propósito (linhas 159 e 383), unido só dentro de `frasesDaCasa()` e `frasesDaVoz()` | nenhum |
| I47 | aberto | aberto, intacto | `nomeEmFrase()` em `src/lib/inicio.mjs:325` continua a baixar a primeira letra sem campo declarado, e o comentário do módulo continua a remeter para ISSUES | nenhum |
| I48 | aberto | aberto, intacto | `ledeDoPainel()` em `src/lib/inicio.mjs:336` continua a devolver `null` com a lista vazia; `HomeView.astro:128` é o único chamador | nenhum |
| I49 | aberto | aberto, estado reescrito | As duas de `figuras.mjs` continuam a render-se em `/`, uma vez cada (cadeia exacta no texto construído). As seis das regiões saíram: **0** blocos `[data-regiao]` na primeira página; `regioes.mjs` declara hoje 10 frases e `/regioes` desenha 10 leituras. Na primeira página são duas e não dez | Emenda 21, DECISIONS §1.75 |
| I50 | aberto como observação | aberto, intacto | `[data-claim="municipios-portugal-caop-2025"]` em `/municipios/evora` rende exactamente «308», com selo e sem substantivo | nenhum |
| I55 | aberto como observação | aberto, intacto | `procura('mun-tecto-rot', comparador(carregaFormas()))` dá **0**; `procura('tecto', …)` dá **1**, que é o controlo positivo. A classe sobrevive: 1 em `MunicipioView.astro:536`, 2 em `site.css:2925` e `:2932` | nenhum |
| I57 | aberto como dívida declarada | aberto, intacto | `tipos-cartao/` com 5 TTF e 2 licenças, **1,2 MB**, fora de `public/` | nenhum |
| I58 | aberto e escrito | aberto, intacto | O portão continua a ler o registo do mesmo `modelo` que desenha; não há leitura de píxeis | nenhum |
| I62 | aberto (duas coisas) | parcialmente resolvido | O corte está feito: as três frases dão **0, 0 e 0** no texto de `dist/municipios/evora/index.html`, com «Évora» a dar 104 como controlo. A régua fica: `<summary>` continua a cair como rótulo de comando e `[data-nonledger]` continua em `ORIGEM_DECLARADA`, e a página ainda tem 8 `<summary>` e 45 `[data-nonledger="data-de-referencia"]` | o corte é o item G6, DECISIONS §1.69 |
| I64 | aberto | aberto, estado reescrito | Plantado o estrago (um `studies-src/alentejo-algarve/pt.html` numa edição que `studies.mjs` não declara), `check:documentos` morre com `Error:` e rasto de pilha em `documentos.mjs:131` (era 130) chamado de `check-documentos.mjs:218` (era 207). Controlo: sem a planta sai a 0. Planta criada e apagada; árvore limpa | nenhum |
| I66 | aberto como observação | aberto, intacto | Em `/estudos/evora-prometido-pago-auditado-2026/texto/`: 12 selos, **6 não fecham a sua unidade**, **3** caem entre o algarismo e o símbolo (« %»), que é exactamente a contagem estrita da P4 que a linha regista | nenhum |
| I68 | aberto como observação | aberto, intacto | A página de leitura continua com 13 tabelas e 312 portas dentro do artigo, e a porta continua a ser a caixa de 24px de `src/styles/texto.css` | nenhum |
| I71 | aberto | aberto, estado reescrito | O bloco dos 308 correu e o `<form>` não foi escrito: **0** `<form` e **0** `action=` em `Pesquisa.astro`, com 1 `input` como controlo positivo. A condição que a linha pôs cumpriu-se | DECISIONS §1.68 cumpriu a condição sem fechar a linha |
| I78 | aberto, para o diretor | parcialmente resolvido | «Duas vozes de fora» dá **0** em `municipios.mjs`, mas «auditor» rende **uma vez** em `/municipios/evora`, na nota do mandato, como uma das nove ressalvas que o G6 deixou. O que saiu foi a frase geral, não toda a menção | o corte é o item G6, DECISIONS §1.69 |
| I87 | aberto | aberto, intacto | 19 linhas do livro-razão nomeiam a DRQPE e 30 levam a nota das «medidas ativas». A confirmação por escrito é externa ao sítio | nenhum |
| I91 | metade aberta | metade aberta, intacto | Escrita a 29.08 pela §1.81 e ainda corrente: a primeira metade fechou (18 referências com `lang="pt-PT"`), a segunda é um bloco do livro-razão inteiro | DECISIONS §1.81 |
| I92 | aberto | aberto, intacto | Decide-se com a segunda metade da I91; nada mudou desde que foi escrita | DECISIONS §1.81 |

## 4 · O que esta passagem NÃO fez

Não tocou uma linha de código, nem `dist/`, nem o livro-razão, nem o inventário das frases, nem a constituição. Não tocou nenhuma das **54** linhas já fechadas nem a coluna «o quê» de nenhuma linha, e isso está conferido por programa contra `98fd779`. Não mexeu nas **9** linhas cujo estado nunca foi nem «aberto» nem um fecho (I3 a I10, da etapa 0, e a I46): três delas continuam à espera de uma decisão da direção («à espera da decisão (b)», «à espera da decisão (f)», «à espera do sim») e ficam fora do âmbito que o brief §2 fixa, que são as linhas marcadas «aberto». Fica registado para quem decidir se elas devem entrar numa passagem seguinte, porque pelo menos uma parece resolvida de facto: a I10 pede ao Método uma frase de cor e uma de letra, e o `FECHO` de `src/data/metodo.mjs` tem hoje «A cor» e «A letra», que a I56 cita. Não foi fechada aqui por estar fora do âmbito, e não por falta de prova.

## 5 · Duas coisas que a passagem encontrou e não são de nenhuma linha

1. **A I37 mostra que a regra «fica para a etapa que abrir o ficheiro» não tem quem a faça cumprir.** O ficheiro foi aberto pelo bloco dos vazios e o byte ficou, porque nada liga o defeito ao ficheiro que ele nomeia. Uma linha que espera por uma etapa futura precisa ou de uma régua, ou de um dono.
2. **As contagens que crescem com a cobertura deixam de medir o que foram escritas para medir.** É o caso da I19 (113 frases de moldura para 6 590 páginas) e, por outro caminho, da I36 (40 chaves sem página, 29 delas criadas por um bloco que nunca precisou de as render). Nos dois casos o número subiu sem que nada piorasse, e um número assim, lido sozinho, engana.

## 6 · O custo

Revisor (Claude Opus), esta passagem inteira, da leitura do brief ao commit: **≈340 mil símbolos**, uma construção completa (≈4 min) e cerca de 25 corridas de medição, entre as réguas da casa (`correcoes-a`, `correcoes-c` de município e de texto, `medir-defeitos`, `check:documentos`) e sondas próprias em Chromium sem cabeça.
