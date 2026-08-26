# Medição M4 · o mapa é navegação · medidor Claude Sonnet

*Medição cega sobre a construção do ramo `mapa-navegacao-2026-08-26` (o «depois», `bfbdaf9`, servida em `http://localhost:4611` a partir da cópia congelada `.../scratchpad/dist-mapa-depois`) contra `main` (o «antes», servida em `http://localhost:4612` a partir de `.../scratchpad/dist-antes-mapa`, com verificação cruzada pontual no sítio no ar, `https://xn--oestadodopas-2fb.pt`). Código próprio, do zero (`mapa-navegacao-M4-sonnet.mjs`, ao lado deste ficheiro), Playwright do repositório, chromium para computador (1280×800 e 2000×1184) e `devices["iPhone 13"]` para telemóvel. Sem travessões.*

## 0 · Nota de método

**O que li.** A Emenda 19 (via `grep -n "Emenda 19"` em `direcao.md`) e a lista da §1 do brief. **Desvio a registar:** o comando que usei para chegar à Emenda 19 foi `grep -ni "emenda"` sobre o ficheiro inteiro, e "emenda" é substring de "emendado"; a palavra que introduz quase todas as outras emendas do documento ("§4 emendado", "§3 emendado"). Isso trouxe para o meu ecrã, sem eu pedir isso, as linhas inteiras das Emendas 1–18 (cor, densidades, o mapa RESPIRA original, régua, tipos, cabeçalho de oito itens, glifos, a linha de método fora da mobília, tema, fila de estados, a voz da página do leitor, o painel da primeira página, o mapa na primeira página, a identidade "Um observatório de Portugal"), não só a 19. Não li o resto do ficheiro (uma chamada `cat -n` do ficheiro inteiro correu, mas o resultado foi guardado num ficheiro persistido fora do meu ecrã; só vi os primeiros 2KB, que são a introdução do documento, §0–1, nada sobre o mapa). Não é o que o brief pediu ("Lês só a Emenda 19"), e registo-o em vez de o esconder. Avaliação do dano: as Emendas 1–18 são texto de direção sobre *outros* blocos (cor, tipos, painel europeu, cabeçalho), não o código nem as notas do construtor, que continuam por ler; a lista de medições da §1 já é auto-suficiente (constrói os detetores sozinha, sem precisar de mais contexto) e usei-a como guião em vez de reconstruir os testes a partir das outras emendas. Ainda assim, o facto fica registado como o que é: uma leitura maior do que a instruída.

**Antes.** Usei a cópia local congelada de `main` (`dist-antes-mapa`) como fonte primária, por reprodutibilidade (os itens 8–9 exigem comparação byte a byte de árvores `dist/`, que só faz sentido sobre ficheiros parados). Verifiquei a fidelidade dessa cópia contra o sítio no ar em dois pontos que são o cerne do item 2 (a roda do rato): naveguei a `https://xn--oestadodopas-2fb.pt/?ambito=municipio` a 1280 e correspondi ponto por ponto a `dist-antes-mapa` (mesma caixa do mapa, 1092×1438; mesmo comportamento da roda, incluindo a versão webkit do motor). O `prova.json` da árvore "antes" tem o commit `14ed70d0d…`; a árvore "depois" tem `bfbdaf9ab…`, o commit citado no brief.

**Como o programa está organizado.** Um ficheiro (`mapa-navegacao-M4-sonnet.mjs`), dez funções (`medirItem1`…`medirItem10`), duas árvores `dist/` servidas por `python3 -m http.server` que o próprio programa arranca (se as portas 4611/4612 já não estiverem a responder; confirmei as duas portas livres com `lsof`/tentativa de bind antes de cada corrida) e desliga no fim. Grava um JSON estruturado (`mapa-navegacao-M4-sonnet.resultados.json`) e um log (`mapa-navegacao-M4-sonnet.execucao.log`) ao lado deste relatório; toda a tabela abaixo vem desses ficheiros, gerados pela última corrida (código de saída 0, sem nenhum campo `"erro"` em nenhum dos dez itens).

## 1 · O mapa não cresce

Três estados (país em `/`; navegação direta a `/?ambito=municipio`; depois de um clique real em «Concelho»), duas larguras, duas construções.

### Estado A · em `/` (país)

| medida | antes 1280 | depois 1280 | antes 2000 | depois 2000 |
|---|---|---|---|---|
| caixa do `svg` do mapa | 490×645 | 490×645 | 490×645 | 490×645 |
| altura do documento | 3890 | 3890 | 3900 | 3900 |
| `transform` em nós dentro do `svg` | 0 | 0 | 0 | 0 |
| `.mapa-fechar` | 1 | 0 | 1 | 0 |
| `[data-campo]` | 1 | 0 | 1 | 0 |
| cabeça visível | "Portugal · país" | "Portugal · país" | "Portugal · país" | "Portugal · país" |
| bloco da pesquisa visível | não | não | não | não |
| foco | `BODY` (nenhum) | `BODY` (nenhum) | `BODY` (nenhum) | `BODY` (nenhum) |

**Diferença:** só `.mapa-fechar` e `[data-campo]`, que desaparecem (1→0). O resto já era igual neste estado; o `/` de "antes" também tinha um mapa pequeno (490×645); é só em estados seguintes que "antes" cresce.

### Estado B · `/?ambito=municipio` (navegação direta)

| medida | antes 1280 | depois 1280 | antes 2000 | depois 2000 |
|---|---|---|---|---|
| caixa do `svg` do mapa | **1092×1438** | 490×645 | **1092×1438** | 490×645 |
| altura do documento | 5066 | 4033 | 5077 | 4043 |
| `transform` em nós dentro do `svg` | 0 | 0 | 0 | 0 |
| `.mapa-fechar` | 1 | 0 | 1 | 0 |
| `[data-campo]` | 1 | 0 | 1 | 0 |
| cabeça visível | "Portugal · país" | "Portugal · país" | "Portugal · país" | "Portugal · país" |
| bloco da pesquisa visível | sim | sim | sim | sim |
| foco | `BODY` (nenhum) | `BODY` (nenhum) | `BODY` (nenhum) | `BODY` (nenhum) |

**Diferença:** o mapa deixa de crescer (1092×1438 → 490×645, uma redução de 602×793px na caixa) e a página fica 1033px mais baixa (1280) / 1034px mais baixa (2000). `.mapa-fechar` e `[data-campo]` desaparecem. Cabeça, pesquisa e foco já eram iguais.

### Estado C · depois de clique real em «Concelho»

| medida | antes 1280 | depois 1280 | antes 2000 | depois 2000 |
|---|---|---|---|---|
| caixa do `svg` do mapa | 1092×1438 | 490×645 | 1092×1438 | 490×645 |
| altura do documento | 5066 | 4033 | 5077 | 4043 |
| `transform` em nós dentro do `svg` | 0 | 0 | 0 | 0 |
| `.mapa-fechar` | 1 | 0 | 1 | 0 |
| `[data-campo]` | 1 | 0 | 1 | 0 |
| cabeça visível | "Portugal · país" | "Portugal · país" | "Portugal · país" | "Portugal · país" |
| bloco da pesquisa visível | sim | sim | sim | sim |
| foco | `INPUT#pesquisa-concelho` | `INPUT#pesquisa-concelho` | `INPUT#pesquisa-concelho` | `INPUT#pesquisa-concelho` |

**Diferença:** igual ao estado B, mais o foco, em ambas as construções o clique em «Concelho» já levava o foco ao campo de pesquisa (`#pesquisa-concelho`), com a mesma caixa (x:94, y:445, 340×44px) nas duas construções. O que muda é só o mapa: cresce em "antes", não cresce em "depois".

**Caso conhecido (vermelho confirmado):** `/?ambito=municipio` a 1280, antes → svg medido 1092×1438px, `.mapa-fechar` = 1. Bate certo com o valor do brief ("1 092 × 1 438 px").

## 2 · A roda é da página

Cursor sobre o mapa, no estado depois de «Concelho», 5 entalhes para baixo (`mouse.wheel(0,120)`×5) e 5 para cima (`mouse.wheel(0,-120)`×5).

| | antes 1280 | depois 1280 | antes 2000 | depois 2000 |
|---|---|---|---|---|
| `scrollY` antes de mexer | 1126 | 411 | 808 | 28 |
| `scrollY` depois de 5× para baixo | 1126 (**igual**) | 1011 (moveu) | 808 (**igual**) | 628 (moveu) |
| `scrollY` depois de 5× para cima | 1126 (**igual**) | 0 (moveu) | 808 (**igual**) | 0 (moveu) |
| a página moveu-se ao descer? | **não** | **sim** | **não** | **sim** |
| nós com `transform` dentro do `svg`, depois de subir | 1 | 0 | 1 | 0 |
| `transform` escrito (amostra) | `scale(1.4693280768…)` em `<g data-campo>` | nenhum | `scale(1.4693280768…)` em `<g data-campo>` | nenhum |

**Diferença:** em "antes" a roda do rato era do mapa (a página fica presa, `[data-campo]` ganha `scale(1,4693…)`); em "depois" a roda é da página (o `scrollY` muda livremente, nenhum nó do mapa ganha `transform`, e não há sequer `[data-campo]` para ganhar nada, porque esse grupo já não existe, item 1).

**Caso conhecido (vermelho confirmado):** antes, 1280px, depois de «Concelho» → 5× para baixo não mexem no `scrollY` (1126 antes e depois); 5× para cima escrevem `scale(1.4693280768…)` em `[data-campo]`. Bate certo com "scale(1.47…)" do brief.

## 3 · Os endereços antigos

| endereço pedido | antes: URL final / `data-ambito` / cabeça | depois: URL final / `data-ambito` / cabeça |
|---|---|---|
| `/?ambito=municipio:evora` | `/?ambito=municipio%3Aevora` / `municipio:evora` / "Évora · município · distrito de Évora" | **`/municipios/evora/`** / (sem `[data-ambito]`, página própria) / "Évora" |
| `/?ambito=municipio:braganca` | `/?ambito=municipio%3Abraganca` / `municipio:braganca` / "Bragança · município · distrito de Bragança" | **`/municipios/`** / (sem `[data-ambito]`) / "Os concelhos de Portugal" |
| `/?ambito=regiao:alentejo` | `/?ambito=regiao%3Aalentejo` / `regiao:alentejo` / "Alentejo · região" | `/?ambito=regiao%3Aalentejo` / `regiao:alentejo` / "Alentejo · região" (**idêntico**) |
| `/?ambito=lixo` | `/` / `pais` / "Portugal · país" | `/` / `pais` / "Portugal · país" (**idêntico**) |

**Diferença:** `municipio:evora` acaba em `/municipios/evora` (pedido: `/municipios/evora`; bate certo); `municipio:braganca` acaba em `/municipios` (pedido: `/municipios`; bate certo). `regiao:alentejo` e `lixo` resolvem exactamente como no ar, sem nenhuma diferença de bytes no comportamento observável.

## 4 · Os pontos

**Clique em Évora e em Bragança**, a 1280, em três arranques distintos:

| arranque | Évora (antes) | Évora (depois) | Bragança (antes) | Bragança (depois) |
|---|---|---|---|---|
| a partir de `/` (país, mapa pequeno) | nada muda (URL, `data-ambito` e cabeça iguais) | **abre `/municipios/evora/`** | nada muda | nada muda |
| a partir de `/?ambito=municipio` (mapa expandido) | `data-ambito` → `municipio:evora`, cabeça → "Évora · município · distrito de Évora" (não navega para uma página própria) | *(não testado neste arranque; já testado a partir de /)* | `data-ambito` → `municipio:braganca`, cabeça → "Bragança · município · distrito de Bragança" | *(idem)* |

**Achado sobre "antes" (não é falha do depois):** em "antes", clicar num ponto a partir de `/` simples não faz nada; nem em Évora, que tem página. O clique só reage depois de o mapa estar expandido (por «Concelho» ou por `/?ambito=municipio`). Em "depois" isto desapareceu: o ponto de Évora é uma ligação `<a>` normal, ativa em qualquer estado, porque o mapa é sempre o mesmo estado (item 1).

**Contagem de pontos:**

| | antes | depois |
|---|---|---|
| `[data-pagina="sim"]` | 1 | 1 |
| pontos dentro de `<a>` | 1 | 1 |
| total de elementos-ponto no `svg` (`circle.mun` + `rect.mun-alvo`) | 616 (308 círculos visíveis + 308 retângulos-alvo invisíveis sobrepostos) | 308 (só círculos; são o próprio alvo do clique) |

A igualdade que o item pede (pontos dentro de `<a>` = `data-pagina="sim"`) verifica-se em "depois": 1 = 1.

**Nome ao passar o rato sobre Bragança:** `[data-readout]` vai de `" · distrito de "` (vazio) para `"Bragança · distrito de Bragança"` (visível, `display:block`, `visibility:visible`, `opacity:1`), em **ambas** as construções, idêntico.

**Caso conhecido (vermelho confirmado):** antes, a partir de `/?ambito=municipio`, clicar em Bragança muda o endereço para `/?ambito=municipio%3Abraganca`. Bate certo.

**Verificação extra contra a Emenda 19(e)** (zonas densas: "44 dos 308 pontos têm um vizinho a menos de um diâmetro, 7,3px, na coluna do computador"): medindo as coordenadas `cx`/`cy` reais dos 308 `circle.mun` do mapa da primeira página (depois, 1280) e contando pares com distância ao vizinho mais próximo menor que o diâmetro (2×4,5 = 9 unidades do `viewBox`, que corresponde a ≈7,3px depois de escalado para os 490px renderizados): **44 pontos**, e os oito exemplos nomeados na emenda (Lisboa, Oeiras, Amadora, Odivelas, Aveiro, Ílhavo, Alcobaça, Nazaré) estão **todos** presentes no conjunto medido. Confirma a emenda com exatidão; não é uma discordância, é uma confirmação registada.

## 5 · O teclado

**Tab a partir do comando «Concelho» até à ligação de Évora**; duas leituras, porque a frase do brief é ambígua sobre se «Concelho» já está ativado:

| leitura | antes | depois |
|---|---|---|
| **A** · Concelho só focado (sem clicar) | 6 paragens → `<a class="mun-porta" href="/municipios/evora">` (o **ponto do mapa**), nome visível ao chegar: "Évora · distrito de Évora" | 6 paragens → mesmo ponto do mapa, mesmo nome visível |
| **B** · Concelho ativado (clicado), Tab a partir da pesquisa aberta | 6 paragens → mesmo ponto do mapa (clicar «Concelho» em "antes" não muda a ordem do Tab: não focou a pesquisa) | **1 paragem** → `<a class="chipb" href="/municipios/evora">` (o **resultado da pesquisa**), nome já visível como texto do próprio resultado ("Évoratem página") |
| Enter na ligação de Évora | vai para `/municipios/evora/` | vai para `/municipios/evora/` |

**Diferença:** o caminho por teclado até Évora encurta de 6 para 1 paragem quando se ativa «Concelho» primeiro, porque em "depois" isso abre e foca a pesquisa, e a pesquisa só lista um resultado tabulável (Évora; os outros 307 são `<span>` inertes, não `<a>`/`<button>`, e por isso saltados pelo Tab); em "antes" ativar «Concelho» não focava nenhum campo, e o Tab continuava a percorrer a página normal até ao único ponto do mapa que já era uma ligação.

**Exploração por setas no mapa:** focar o ponto de Évora (`.focus()` direto, sem Tab) e premir `ArrowRight`; o foco **não se move** (fica no mesmo elemento) em nenhuma das duas construções. Não há exploração por setas no mapa, nem em "antes" nem em "depois"; não é coisa que este bloco tenha mudado.

## 6 · O telemóvel (iPhone 13)

| | antes | depois |
|---|---|---|
| `svg.mapa-svg` no DOM (contagem) | 1 | 1 |
| `svg.mapa-svg` **renderizado** (caixa > 0×0, sem ascendente `display:none`) | **não** (0×0px, dentro de `DIV.mapa-tela` com `display:none`) | **não** (idêntico) |
| depois de tocar em «Concelho»: campo dentro do ecrã | sim (x:18, y:310, 340×44, ecrã 390×664) | sim (idêntico byte a byte nas coordenadas) |
| depois de tocar em «Concelho»: foco no campo | sim (`#pesquisa-concelho`) | sim (idêntico) |

**Diferença:** nenhuma. O nó `<svg>` existe no DOM nas duas construções (provavelmente por partilhar marcação com o computador, escondida por CSS), mas não é "renderizado" em nenhuma delas, e o comportamento de «Concelho» no telemóvel já era exactamente este antes deste bloco (Emenda 18, 25.08). Confirma a igualdade que o item pedia.

## 7 · As cadeias

Contagens em `dist/index.html` e `dist/en/index.html`, cada uma nas duas construções.

| cadeia | antes (pt) | depois (pt) | antes (en) | depois (en) |
|---|---|---|---|---|
| `class="mapa-fechar"` | 1 | **0** | 1 | **0** |
| "fechar" / "close" como rótulo de comando (fora do alternador `peca-abrir-f`) | 1 | **0** | 1 | **0** |
| "trocar de concelho" / "change municipality" | 1 | **0** | 1 | **0** |
| "Ainda sem linhas" / "Still no rows for" | 1 | **0** | 1 | **0** |
| "sem linha ainda" / "no row yet" | 8 | **0** | 8 | **0** |
| `data-cabeca="vazio"` | 1 | **0** | 1 | **0** |
| `data-painel="vazio"` | 1 | **0** | 1 | **0** |
| `data-slot` | 4 | **0** | 4 | **0** |
| `mapa-fechar` (substring, qualquer contexto) | 1 | **0** | 1 | **0** |

**Diferença:** as nove cadeias (e o par inglês) vão todas a zero em "depois", nas duas páginas.

**Caso conhecido (vermelho confirmado):** `dist-antes-mapa/index.html` tem `data-painel="vazio"` (1 ocorrência). Bate certo com o brief ("no ar, `index.html` tem `data-painel="vazio"`").

**Falso alarme evitado:** uma busca ingénua por `>fechar<` (sem excluir o contexto) encontra 18 ocorrências em "depois"; todas dentro de `<span class="peca-abrir-f">fechar</span>`, o alternador "abrir/fechar" de cada peça de medida (não tocado por este bloco). Isolei essa contagem à parte; o rótulo de comando `.mapa-fechar` está mesmo a zero.

## 8 · O que mais mudou

Comparação byte a byte de toda a árvore `dist/` (1627 ficheiros comuns às duas construções, ignorando `version.json`).

| ficheiro | antes (bytes) | depois (bytes) | Δ |
|---|---|---|---|
| `index.html` | 219 404 | 173 613 | −45 791 |
| `en/index.html` | 219 246 | 171 769 | −47 477 |
| `municipios/evora/index.html` | 166 782 | 119 721 | −47 061 |
| `en/municipalities/evora/index.html` | 165 546 | 118 490 | −47 056 |
| `js/inicio.js` | 43 360 | 36 640 | −6 720 (conteúdo não inspecionado; fora do que me é permitido ler) |
| `prova.json` | 4 060 | 4 060 | 0 (mesmo tamanho; conteúdo difere; ver abaixo) |
| `_astro/inicio.*.css` | `inicio.BqPeczyd.css` | `inicio.CYmXWYkV.css` | nome com hash de conteúdo diferente (a folha de estilos da página inicial mudou; não referenciada por nenhuma outra página, por isso não aparece como "só em antes/depois" mais nenhures) |
| `version.json` | n/d | n/d | difere sempre (ignorado, por instrução) |

Nenhum ficheiro apareceu ou desapareceu (fora do par de nomes com hash do CSS). **1619 dos 1627 ficheiros comuns são byte a byte idênticos**; o que, por si, é a prova de que não há nenhuma "marca de versão" embutida em cada página: se houvesse, apareceria em todos os 1627, não em 6.

**Achado sobre `prova.json`** (não é uma "página", mas é um ficheiro do `dist/` que muda com conteúdo real, não só o carimbo): além do `commit` e `construido_em` (que mudam sempre, como o `version.json`), dois números do inventário do próprio construtor baixam: `valores_auditados` de 428 para 408, `ligacoes_internas_conferidas` de 15114 para 15090. Coerente com a remoção de 308 botões "escolher" e dos blocos de estado do município escolhido; não é um "achado" no sentido de problema, é mais um sinal do mesmo corte.

**Páginas esperadas pelo item 8** (`/`, `/en/`, e `/municipios` + `/en/municipalities` só se a nota tiver mudado; **não mudou**, confirmado: essas duas páginas são byte a byte idênticas): `index.html`, `en/index.html`.

**Discordância registada** (ver §Discordâncias): `municipios/evora/index.html` e `en/municipalities/evora/index.html` também mudam, e não estão nessa lista; mas o item 9 já as trata como esperadas pela sua própria razão (a porta do cartão). Registo-o como uma folga entre o texto do item 8 e o do item 9, não como um problema da construção.

## 9 · A página do concelho (Évora)

| | `municipios/evora/index.html` | `en/municipalities/evora/index.html` |
|---|---|---|
| idêntico byte a byte? | não | não |
| **secção anterior ao `<aside class="aparelho">` (as oito peças de medida) idêntica, depois de normalizar só o nome do CSS com hash?** | **sim** | **sim** |
| contagem de `class="peca…"` | 8 = 8 | 8 = 8 |
| `data-postura="localizador"` existe em "depois"? | sim | sim (mesmo padrão) |
| porta do cartão em "antes" | `href="/?ambito=municipio"` | `href="/en?ambito=municipio"` |
| porta do cartão em "depois" | `href="/municipios"` | `href="/en/municipalities"` |
| Δ bytes (ficheiro inteiro) | −47 061 | −47 056 |

**A porta do cartão muda como o brief descreve** (era `/?ambito=municipio`, passa a `/municipios`; par inglês análogo) **e as oito medidas são byte a byte idênticas**; as duas afirmações centrais do item 9 confirmam-se.

**Mas a diferença não se fica pela porta.** Dentro de `<aside class="aparelho">`, além da porta:
- o grupo `<g data-campo>` desaparece (1 ocorrência em "antes", 0 em "depois"; o mesmo grupo de zoom que os itens 1 e 2 tratam na primeira página);
- os 308 `<rect class="mun-alvo" data-caop="…" data-alvo-de="…">` (retângulos-alvo invisíveis, usados para o clique) desaparecem por completo;
- em vez deles, "depois" tem 307 `<circle class="mun" data-m="…" data-caop="…">` (o mesmo tipo de ponto visível que a primeira página usa; ver item 4);
- `<span data-slot="nome">Évora</span>` passa a texto simples, "Évora" (consistente com o `data-slot` do item 7 ir a zero).

Ou seja: o cartão localizador da página do concelho não ficou só com a porta trocada; o próprio mapa lá dentro foi refeito para deixar de ter o grupo de zoom e o par duplicado círculo+retângulo, unificando com o desenho da primeira página. Isto é mais mudança do que "a única diferença esperada fora da marca de versão" (registado como discordância).

## 10 · A régua do inventário

`node scripts/medir-defeitos.mjs`, corrido sobre `dist/` do repositório (confirmado, por soma de verificação SHA-256, que `dist/index.html` do repositório é byte a byte igual a `dist-mapa-depois/index.html`; e por `mtime` inalterado antes/depois de correr o script, que este não reconstruiu nada).

Linha da rota `home` (`/`) na saída real do script:

```
frases da casa · / ... 16 distinta(s) · conteúdo 11 · navegação 5 · autorreferência 0  ✓
```

| | valor |
|---|---|
| frases distintas | 16 |
| conteúdo | 11 |
| navegação | 5 |
| **autorreferência** | **0** |
| classificadas (conteúdo+navegação+autorreferência) | 16 |
| **blocos por classificar** (distintas − classificadas) | **0** |

Não corri este script sobre "antes" (o brief só pede a corrida "na construção do ramo").

## Discordâncias

### Contra a Emenda 19

1. **Emenda 19(c)** · "[o comando «Concelho»] não muda o mapa, a cabeça nem o painel; **a página continua a ser a do país** até o leitor ir a uma página de concelho." Medido (item 1, estado C, depois, 1280 e 2000): mapa, cabeça e painel confirmam-se inalterados, **mas o endereço muda de `/` para `/?ambito=municipio` e a raiz ganha `data-ambito="municipio"` (era `"pais"`)**. Não decido aqui se um endereço e um `data-ambito` que mudam contam como "a página deixar de ser a do país" quando tudo o que se vê fica igual; fica registado com os dois valores, coordenada `/` (depois de clicar em «Concelho», computador, depois), para o lugar de direção julgar.

2. Tudo o resto que testei contra a Emenda 19 bateu certo: a extinção dos estados `?ambito=municipio:<slug>` (item 3, item 7), o redireccionamento por página existente/inexistente (item 3), a ligação real por ponto com página e a ausência de resposta em ponto sem página (item 4), o nome ao passar o rato e ao chegar pelo teclado (itens 4–5), o mapa nunca crescer nem responder à roda (itens 1–2), o cartão localizador continuar na página do concelho (item 9, ainda que mudado por dentro; ver acima), e a medida geométrica exacta de "44 dos 308 pontos com vizinho a menos de um diâmetro" incluindo os oito exemplos nomeados (item 4, verificação extra). Sem discordância nestes pontos.

### Contra a lista da §1 do brief

3. **Item 8** · "o esperado é `/`, `/en/` e, se o construtor mexeu na nota, `/municipios` e `/en/municipalities`; qualquer outra página que tenha mudado é um achado." `municipios/evora/index.html` e `en/municipalities/evora/index.html` também mudaram (a nota `/municipios` em si não mudou; confirmado byte a byte). Não creio que seja um problema da construção: é exactamente o que o item 9 pede para examinar à parte, com a sua própria razão (a porta do cartão). Registo-o como uma frase do item 8 que não previu as páginas que o item 9 já sabia que iam mudar; uma folga de redação entre os dois itens do próprio brief, não um achado sobre o sítio.

4. **Item 9** · "a porta do cartão... é a única diferença esperada fora da marca de versão." Medido: a secção do "aparelho" (mapa localizador) muda muito mais do que a porta; o grupo `[data-campo]`, os 308 `<rect class="mun-alvo">` e o `data-slot="nome"` desaparecem, substituídos por 307 `<circle class="mun">`. As oito peças de medida, essas sim, são byte a byte idênticas (confirmado). Coordenada: `municipios/evora/index.html`, dentro de `<aside class="aparelho">`.

## Falsos alarmes (meus, apanhados antes de chegarem a esta tabela)

1. **Item 2, primeira tentativa.** Usar o centro do `boundingBox()` do `svg` sem primeiro o levar para dentro do ecrã dá um ponto fora do *viewport* quando o mapa cresce para 1438px de altura num ecrã de 800px (y≈1525, quando o ecrã só tem 800px). `document.elementFromPoint` nesse ponto devolve `null`; a roda não acerta em nada; as duas metades do caso conhecido liam falso (parecia que "antes" também deixava a página mover-se, e que também não escrevia nenhum `transform`); não porque o mapa antigo não prendesse a roda, mas porque o rato nunca esteve sobre o mapa. Corrigido com `scrollIntoViewIfNeeded()` + um ponto garantidamente dentro do elemento **e** do ecrã; confirmei a correcção contra o sítio no ar e contra o motor webkit antes de a aceitar.

2. **Item 4, primeira tentativa do caso conhecido.** Clicar no ponto de Bragança a partir de `/` simples (sem passar primeiro por «Concelho» ou por `/?ambito=municipio`) não muda nada em "antes"; não porque o clique não funcione, mas porque a vista pequena de `/` não responde a nenhum clique em ponto nessa construção (nem Évora, que tem página, navegou a partir daí). A frase do caso conhecido no brief situa-se explicitamente em `/?ambito=municipio`; corrigi o arranque para esse estado, e o endereço mudou como esperado. A leitura a partir de `/` simples ficou na tabela do item 4 como um achado sobre "antes", não como falha do detetor.

3. **Item 5, primeira tentativa da exploração por setas.** O seletor `'a.mun-porta[href*="evora"], a[href*="/municipios/evora"]'` apanha também a ligação homónima da lista de pesquisa (`a.chipb[href="/municipios/evora"]`), que existe no DOM mas fica escondida até «Concelho» ser activado. Em "depois" essa ligação vem primeiro na ordem do DOM; `.first()` ficava com ela, escondida, e `scrollIntoViewIfNeeded()` esgotava os 30 segundos à espera que ficasse visível. Não aconteceu em "antes" só porque aí não há lista de pesquisa equivalente em `/`. Corrigido para o seletor específico do ponto do mapa (`a.mun-porta`), sem ambiguidade com a pesquisa.

4. **Item 7, busca ingénua por "fechar"/"close".** Já descrito acima (§7): 18 ocorrências de `>fechar<`/`>close<` em "depois" que não são o rótulo de comando do mapa, mas o alternador "abrir/fechar" de cada peça de medida (`peca-abrir-f`), invariante deste bloco. Isolei a contagem específica do rótulo de comando (0) da contagem bruta (18) para não confundir as duas.

*(Nota adicional, não um falso alarme mas uma correção de precisão: a primeira versão do detetor do item 9 comparava a secção "pré-aparelho" sem normalizar o nome do ficheiro CSS com hash de conteúdo, e por isso lia sempre "pré-aparelho diferente" mesmo quando as oito peças de medida eram idênticas; a única diferença real nessa zona era a única linha do `<head>` com o nome do CSS. Corrigido normalizando esse nome antes de comparar; as oito peças confirmam-se idênticas.)*

## Casos conhecidos, vistos vermelhos

| detetor | esperado (do brief) | observado | vermelho? |
|---|---|---|---|
| item 1; caixa do mapa em `/?ambito=municipio`, antes, 1280 | ≈1092×1438px e `.mapa-fechar` existe | 1092×1438px, `.mapa-fechar`=1 | **sim** |
| item 2; roda do rato, antes, 1280, depois de «Concelho» | 5× baixo não mexem no `scrollY`; 5× cima escrevem `scale(1.47…)` em `[data-campo]` | `scrollY` 1126→1126; `scale(1.4693280768…)` | **sim** |
| item 4; clique em Bragança, antes, a partir de `/?ambito=municipio` | endereço muda para `.../?ambito=municipio:braganca` | mudou, para exactamente esse endereço | **sim** |
| item 7; cadeias em `index.html`, antes | `data-painel="vazio"` existe | 1 ocorrência | **sim** |
| item 8; `version.json` difere sempre | diferença confirmada | commit e `construido_em` diferentes nas duas árvores | **sim** |

Todos os cinco detetores que o brief associa a um caso conhecido foram provados vermelhos antes de qualquer leitura de zero ser aceite no relatório acima.

## Custo em símbolos

Visível apenas como o indicador de contexto restante que o meu ambiente me mostra entre chamadas (não é um contador de facturação exacto; é a melhor aproximação que tenho). No início desta tarefa: 15 000 000 tokens por gastar; ao escrever esta secção: aproximadamente 14 610 000 tokens por gastar. Ou seja, esta medição consumiu **≈390 000 tokens** de contexto; a maior parte em exploração inicial (leitura de dois `dist/` de ≈1600 ficheiros cada, comparação byte a byte, e sobretudo as várias rondas de descoberta do comportamento real do "antes" antes de escrever o programa final: o mecanismo da roda do rato, a visibilidade da cabeça, a ordem do Tab). Modelo: Claude Sonnet (eu próprio, sem sub-agentes).
