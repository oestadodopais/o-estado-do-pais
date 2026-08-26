# Nota · o mapa da primeira página é navegação · 26.08.2026

*Construtor (Claude Opus 5, `claude-opus-5[1m]`). Ramo `mapa-navegacao-2026-08-26`, a partir de `main` em `b1e9004`. Contrato: `../briefs/BRIEF-mapa-navegacao.md`, com a Emenda 19 de `direcao.md` por trás. Sem travessões nesta prosa; o ponto médio é o separador. **Todos os números desta nota vêm de um comando que está escrito ao lado deles.***

---

## 0 · Os comandos que dão os números

```
npm run build                                       342 páginas · 41 chaves da prova
npm run verify · npm run typecheck                  verdes
node scripts/medir-defeitos.mjs                     rota home: 16 blocos, autorreferência 0
node scripts/provar-eyetext.mjs · node scripts/check-cadeia.mjs
node tests/inicio/mapa-navegacao.mjs                11 réguas, sai com 0
node tests/inicio/matriz.mjs                        86 células
node tests/inicio/correcoes-a.mjs                   32 réguas, sai com 0
node tests/inicio/capturas.mjs <dir>                5 estados × 2 larguras × 2 edições × 2 temas
```

As capturas do antes e do depois estão em `../capturas/mapa-navegacao-2026-08-26/`, em JPEG a escala 2, página inteira: `antes-` e `depois-`, cinco cada (`inicio-1280`, `inicio-390`, `ambito-municipio-1280`, `concelho-premido-1280`, `concelho-premido-390`). O «antes» saiu de uma construção de `main` guardada fora do repositório antes de qualquer alteração.

## 1 · Os commits

| commit | o quê |
|---|---|
| `698c10f` | a vista sai inteira: o esquema, o mapa, a pesquisa, as cadeias, o inventário |
| `d7df4da` | as réguas: a nova, a matriz reduzida, as capturas, a linha do C1 |
| `eb01b93` | a §1.67, esta nota, o I51 fechado, o I70 aberto, e as dez capturas |
| (o desta ficha) | o ramo morto da pesquisa, encontrado pela busca exaustiva da regra 16 |

## 2 · O que se mediu, antes e depois

Playwright, Chromium, sobre `dist/`. As duas construções são a de `main` (`b1e9004`, guardada fora do repositório) e a deste ramo.

| medida | antes | depois |
|---|---|---|
| `.mapa-tela` em `/`, a 1280 | 490 × 645,2 px | **490 × 645,2 px** |
| `.mapa-tela` em `/?ambito=municipio`, a 1280 | 1 092 × 1 437,8 px | **490 × 645,2 px** |
| o mesmo a 1512 e a 2000 | 1 092 px (o conteúdo fica a 1 092, centrado) | **490 px** |
| cinco entalhes da roda com o cursor no meio do mapa, em `?ambito=municipio` | `scrollY` na mesma, e o mapa a 1,47× | **`scrollY` 489 → 989**, e nenhum nó com `transform` |
| `/?ambito=municipio:evora` | fica em `/?ambito=municipio%3Aevora` | **abre `/municipios/evora`** |
| `/?ambito=municipio:braganca` | fica em `/?ambito=municipio%3Abraganca` | **abre `/municipios`** |
| `/en?ambito=municipio:evora` | fica no estado | **abre `/en/municipalities/evora`** |
| clique no CENTRO do ponto de Évora, em `/` | não abre nada (o evento cai no `svg`) | **abre `/municipios/evora`** |
| clique no ponto de Bragança, em `/` | não abre nada | **não abre nada** (e o âmbito fica em `pais`) |
| o alvo de um ponto com página, a 1280 | 1,2 px de traço | **7,35 × 7,35 px**, o disco inteiro |
| «Concelho» a 1280 | o mapa cresce; o foco já ia ao campo | **o mapa fica; o foco no campo**, o bloco dentro do ecrã |
| «Concelho» a 390 | a pesquisa à vista, foco no campo | **igual** (a régua A1 continua verde) |
| `dist/index.html` | 219 404 bytes | **173 613 bytes** |
| `dist/en/index.html` | 219 246 bytes | **171 769 bytes** |

## 3 · O que saiu, linha a linha

### `public/js/inicio.js` · 1 001 → 800 linhas

Foram 781 no commit da retirada; as dezanove que voltaram no commit das réguas são o comentário da correção do Enter.

| o que saiu | o que era |
|---|---|
| `amp`, `AMPLIACAO_MAXIMA`, `escreveAmpliacao()`, `prendeAmpliacao()`, `amplia()`, `repoeAmpliacao()`, `paraTela()` | a lente: uma transformação num grupo do SVG, de 1× a 4× |
| os ouvintes `wheel`, `touchstart`, `touchmove`, `touchend`, `dblclick` na caixa do mapa, e `podeAmpliar()` | os gestos da lente. O `wheel` com `preventDefault` era o que tirava a roda à página |
| `pontoEAlvo()` e `alvoDeReferencia` | a pergunta à folha sobre se um ponto era alvo naquele estado e naquela largura |
| os 308 ouvintes de clique em `[data-alvos] [data-caop]` | a escolha de um concelho pelo mapa |
| `escolhas` e o seu ciclo de ouvintes | os botões `[data-escolher]` da pesquisa, que escolhiam um âmbito |
| `trocar`, `fecharMapa`, `fechaAEscolha()`, `comandoDeMunicipio` e o `keydown` de Escape no documento | a saída da vista, por «fechar» e por Escape |
| os `data-slot`, `[data-prefixo-distrito]`, `soEvora`, `dicaEscolher`, `cartao`, `mun-escolhido` | o que o script escrevia e acendia no concelho escolhido |
| o ramo de `municipio:<slug>` em `resolveAmbito()`, `modoDe()` e `chaveDoBloco()` | o estado que saiu do esquema |

O que ENTROU: `portaDoPonto()`, `indiceDosConcelhos()` e `reencaminhaEstadoAntigo()`, doze linhas ao todo, que leem do documento os dois destinos de um endereço antigo. E uma linha no `keydown` da tela: o Enter num ponto com página faz `location.assign` do `href` daquele ponto.

**Um achado do caminho.** A primeira escrita usava `porta.click()`, que é o gesto do rato dito por outras palavras. Não funciona: um `<a>` dentro de um `svg` é um `SVGAElement`, e `SVGAElement` não tem `click()` (medido em Chromium a 26.08: `typeof a.click` dá `undefined`). A régua apanhou-o na primeira corrida, com o endereço a ficar em `/` depois do Enter.

### `src/styles/inicio.css` · 1 733 → 1 664 linhas

Saem as nove regras de `[data-inicio][data-ambito='municipio']` dentro do `@media (min-width: 641px)` (a coluna a colapsar, a tela a 100%, a legenda e o rodapé a mudar de célula, `r: 2px` nos pontos, o contorno, `.mapa-fechar` a aparecer, `touch-action: none`), as três de `.mapa-fechar`, as três de `.mun-alvo` e a de `[data-hint-escolher]` no telemóvel.

Entra uma, de duas linhas: `.mun-porta .mun { pointer-events: all }`.

### Os gabaritos

* `MapaRespira.astro`: saem «fechar», o grupo `<g data-campo>` que a lente movia, o grupo `<g data-alvos>` com os 308 rectângulos, a porta `[data-so-evora]`, a dica de escolher e o `data-slot` do nome. `rotaDaEscolha` deixa de ser `/?ambito=municipio` e passa a ser o índice dos 308. O texto do cartão passa a construir-se só na postura de localizador, que é onde ele se vê.
* `Cabeca.astro`: saem os blocos `evora` e `vazio`. Ficam seis, o país e as cinco regiões.
* `HomeView.astro`: saem os dois painéis de concelho, `pecasDeEvora`, `medidasSemLinha`, `primeiroSemPagina` e `chaveDoConcelho`. Entra `destinoDoConcelho()`, que dá à pesquisa a mesma forma que `/municipios` já lhe dá.
* `Pesquisa.astro`: o ramo do `<button data-escolher>` sai, e `destino` passa a ser obrigatória. Com as duas vistas a passarem `destino`, o botão era um segundo feitio sem quem o rendesse. Foi a busca exaustiva da regra 16 que o encontrou, depois de o resto do bloco estar feito: o `grep` por `data-escolher` deu uma linha de código a sério no meio de comentários. O documento construído não muda um byte, porque a primeira página já não tomava esse ramo.
* `MunicipiosView.astro`: a nota sobre `/?ambito=municipio` passa a contar as três respostas que a porta teve, e por que razão a âncora `/#mapa` é a certa.

### As cadeias

Nove chaves saem nas duas edições, com o registo em `CHAVES-EN.md`: `inicio.cabeca.municipioSufixo`, `municipioPalavra`, `tituloEvora`, `tituloVazioA`, `tituloVazioB`, `ledeVazioA`, `ledeVazioB`, `inicio.mapa.escolher` e `inicio.mapa.paginaInteira`. Ficam `inicio.mapa.trocar` (rende-se no cartão da página do concelho), `densidade.fechar` (a peça rende-a desde a etapa 2) e `inicio.cabeca.distritoDe` (o prefixo da leitura em voz alta do mapa).

### O inventário

`INVENTARIO-FRASES.md`, rota `home`: 65 linhas → 40. Dez deixaram de ser rendidas em rota nenhuma; quinze mudaram para a tabela de `/municipios/evora` (as notas das oito medidas, «Évora», e «sem linha ainda» / «no row yet»); duas mudaram de texto, que são a descrição acessível do mapa nas duas edições, sem a terceira frase.

`node scripts/medir-defeitos.mjs`: rota `home` com **16 blocos distintos**, conteúdo 11, navegação 5, **autorreferência 0** nas duas edições, e **zero blocos por classificar em rota nenhuma**.

«fechar» e «trocar de concelho» nunca estiveram nesta tabela, e isso é uma definição e não um esquecimento: um bloco cujo texto é todo ele uma ligação ou um botão não é uma frase da casa (`textoForaDeComandos()` em `scripts/medir-defeitos.mjs`).

## 4 · As réguas, e o estrago que cada uma apanhou

`tests/inicio/mapa-navegacao.mjs`, onze réguas, sai com 1 quando alguma falha. Cada estrago foi plantado no código do sítio, a construção correu verde com ele, a régua ficou vermelha, e depois de reposto ficou verde.

| estrago plantado | régua que ficou vermelha |
|---|---|
| `reencaminhaEstadoAntigo()` a devolver `false` à cabeça | N1 · os endereços antigos (pt e en) |
| `data-slot="nome"` de volta ao `[data-readout-nome]` | N1 · a primeira página sem marcas da vista |
| `[data-ambito='municipio'] .cabeca-grelha { grid-template-columns: minmax(0,1fr) }` de volta | N2 · o tamanho do mapa (voltou a 1 092 × 1 437,8) |
| um `wheel` com `preventDefault` na caixa do mapa | N2 · a roda do rato |
| o foco de «Concelho» de volta ao botão | N3 · a pesquisa, a 1280 e a 390 |
| o `href` do comando «Concelho» a apontar para `/` | N3 · sem script, e também N1, que lê esse `href` para o índice |
| `pointer-events: visiblePainted` no ponto da ligação | N4 · o clique no meio do ponto (pt e en) |
| o Enter de volta a `porta.click()` | N4 · o rato, as setas e o Enter |

Duas plantas da primeira tentativa não eram estragos, e ficam escritas porque o que elas ensinam vale a linha: `[data-ambito='municipio'] .mapa-tela { width: 100% }` não muda nada, porque a tela já enche a célula da grelha (o que fazia o mapa crescer era a coluna a colapsar); e um `data-slot` no texto do cartão não chega à primeira página, porque o texto do cartão deixou de se construir na postura inteira.

## 5 · O que não mudou, e foi conferido

* **`scripts/gate-html.mjs` não tem uma conferência presa aos blocos da primeira página.** Medido: `grep -n "data-cabeca\|data-painel" scripts/gate-html.mjs` não imprime nenhuma linha, e o controlo positivo no mesmo ficheiro (`grep -c "data-claim"`) imprime 12. Não havia nada para converter em conferência de ausência. As **41 chaves da prova** continuam contadas e reconferidas a cada construção.
* **`tests/inicio/correcoes-a.mjs` continua 32 de 32**, com uma linha mudada: o estado `?ambito=municipio:evora` sai da lista da célula C1, porque um reencaminhamento a meio de um `evaluate` destrói o contexto de execução.
* **`MunicipioView` não se tocou.** O cartão localizador continua lá, com o ponto de Évora em anel; o que mudou foi o destino da porta «trocar de concelho», que é uma linha de `MapaRespira.astro`.
* **Duas réguas de fora deste bloco continuam com a célula vermelha que já tinham em `main`**, e foi conferido correndo-as contra a construção de `main` guardada: `tests/linha/recibo.mjs` (3b, 12 de 13) e `tests/municipio/concelhos.mjs` (3c, 5 de 6). As duas estão escritas em `DECISIONS.md` §1.66 como pendentes.

## 6 · O que fica por fazer

* **O alvo de 7,35 px** (ISSUES I70). A Emenda 19e decide o caminho, que é a pesquisa até haver o mapa por distritos; o número fica medido a cada corrida da matriz, com a conta do lado do teste sobre os mesmos centróides.
* **As páginas dos 308** (decisão 5B). São o destino que o mapa passa a ter para cada ponto; hoje há um.
* **A disposição-padrão da Emenda 14** deixou de ter superfície: rende-se na página de um concelho sem linhas, e não há nenhuma. A célula da matriz que a media saiu com a razão escrita, e volta com a primeira dessas páginas.
