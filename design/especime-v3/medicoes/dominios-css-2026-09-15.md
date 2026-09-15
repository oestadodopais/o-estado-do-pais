# A lista dos domínios, a linha da busca, e as duas células novas · 15.09.2026

*Ramo `dominios-css-2026-09-15`, de `main` em `44f0d838`. Construtor: Claude Opus 5. Tudo o que está aqui foi medido em Chromium sem cabeça sobre o `dist/` de cada uma das duas cabeças, com `design/especime-v3/medicoes/dominios-css-2026-09-15.mjs`, que é o ficheiro ao lado deste. As capturas estão em `design/especime-v3/capturas/dominios-css-2026-09-15/`.*

## As medidas

### O índice dos domínios

O «antes» é a cabeça `44f0d838`; o «depois» é a cabeça final deste ramo. A primeira e a segunda coluna são a primeira página, que é onde o defeito estava; a terceira e a quarta são `/dominios`, que é onde ele não estava e onde nada podia mudar.

| medida (a 390 e a 1 280, iguais nas duas larguras) | `/` antes | `/` depois | `/dominios` antes | `/dominios` depois |
| --- | --- | --- | --- | --- |
| `display` do `.dominios-item` | `list-item` | `flex` | `flex` | `flex` |
| `gap`, coluna / linha | `normal` | 14 px / 6 px | 14 px / 6 px | 14 px / 6 px |
| marcador do `<ol>` | `decimal` | `none` | `none` | `none` |
| corpo do `.dominios-estado` | 16 px | 14 px | 14 px | 14 px |
| tipo do `.dominios-estado` | Spectral (a prosa) | Bitter (o instrumento) | Bitter | Bitter |
| folga entre a caixa do nome e a do estado | 0 px | 14 px | 14 px | 14 px |

O texto de cada linha, lido do `textContent` a 390:

| | antes | depois |
| --- | --- | --- |
| 1.ª linha, `/` | «Economia e finanças públicas10 medidas» | «Economia e finanças públicas 10 medidas» |
| 2.ª linha, `/` | «Trabalhoas medidas estão em Economia e finanças públicas» | «Trabalho incluído em Economia e finanças públicas» |
| 1.ª linha, `/en/` | «Economy and public finances10 measures» | «Economy and public finances 10 measures» |
| 2.ª linha, `/en/` | «Labourthe measures are in Economy and public finances» | «Labour included in Economy and public finances» |

A segunda linha de `/` é, carácter a carácter, o que o diretor leu no telemóvel.

### A altura da página, e o primeiro ecrã

| página | 390 antes | 390 depois | 1 280 antes | 1 280 depois |
| --- | --- | --- | --- | --- |
| `/` | 2 695 px | 2 753 px | 1 921 px | 2 002 px |
| `/en/` | 2 701 px | 2 758 px | 1 921 px | 2 002 px |
| `/dominios` | 1 014 px | 1 014 px | 1 038 px | 1 038 px |
| `/en/domains` | 1 077 px | 1 077 px | 1 038 px | 1 038 px |

`/dominios` e `/en/domains` não mudam um píxel, nas duas larguras: é a prova de que a folha saiu de sítio e não de forma.

A primeira página cresce 58 px a 390 e 81 px a 1 280, e são duas coisas somadas: a lista passou a ter as suas linhas de fio e a sua goma, e a linha da busca passou a ser tão alta quanto era mas com o campo a ocupar a linha (o que a faz quebrar noutro sítio a 1 280). O primeiro ecrã não mexe: o topo da secção dos domínios a 390 mede **1 436,8 px em `/` e 1 432,1 px em `/en/`, antes e depois, o mesmo número**, e o primeiro ecrã acaba aos 664.

### A linha da busca

Largura da caixa, do campo e do botão, e o transbordo horizontal (`scrollWidth − clientWidth`) em cada largura. O botão mede 111,5 px em todas as células, antes e depois.

| rota | largura | linha antes | linha depois | campo antes | campo depois | transbordo antes / depois |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 320 | 220,1 | 284,0 | 100,6 | 164,5 | 0 / 0 |
| `/` | 390 | 220,1 | 354,0 | 100,6 | 234,5 | 0 / 0 |
| `/` | 768 | 220,1 | 706,6 | 100,6 | 587,1 | 0 / 0 |
| `/` | 1 280 | 220,1 | 550,0 | 100,6 | 430,5 | 0 / 0 |
| `/municipios` | 320 | 220,1 | 284,0 | 100,6 | 164,5 | 0 / 0 |
| `/municipios` | 390 | 220,1 | 354,0 | 100,6 | 234,5 | 0 / 0 |
| `/municipios` | 768 | 220,1 | 706,6 | 100,6 | 587,1 | 0 / 0 |
| `/municipios` | 1 280 | 220,1 | 1 092,0 | 100,6 | 972,5 | 0 / 0 |
| `/livro-razao` | 320 | 284,0 | 284,0 | 164,5 | 164,5 | 0 / 0 |
| `/livro-razao` | 390 | 354,0 | 354,0 | 234,5 | 234,5 | 0 / 0 |
| `/livro-razao` | 768 | 544,0 | 544,0 | 424,5 | 424,5 | 0 / 0 |
| `/livro-razao` | 1 280 | 544,0 | 544,0 | 424,5 | 424,5 | 0 / 0 |
| `/livro-razao/concelhos` (sem botão) | 320 | — | — | 220,1 | 284,0 | 0 / 0 |
| `/livro-razao/concelhos` | 390 | — | — | 220,1 | 340,0 | 0 / 0 |
| `/livro-razao/concelhos` | 768 | — | — | 220,1 | 340,0 | 0 / 0 |
| `/livro-razao/concelhos` | 1 280 | — | — | 220,1 | 340,0 | 0 / 0 |

`/livro-razao` não muda em largura nenhuma, e as duas capturas dessa rota são o mesmo ficheiro byte a byte: lá a caixa já ocupava a linha, porque o pai dela não é `.pesquisa`.

**O número que o lugar de direção tem de olhar: `/municipios` a 1 280 dá um campo de 972,5 px.** É o que a decisão pede à letra («o campo ocupa a linha inteira menos o botão») e é a coluna daquela página que é larga; se um campo de quase um metro não for o que se quer, o que falta é um tecto (`max-width`) e isso é decisão do lugar de direção, não desta fatia.

### As duas células novas

Sobre o `dist/` de cada cabeça, com `node scripts/check-css.mjs`:

| | `44f0d838` | cabeça final |
| --- | --- | --- |
| páginas lidas | 7 224 | 7 224 |
| documentos de estudo alojados, fora das células | 16 | 16 |
| **C1 · vermelhos** | **8** | **0** |
| C1 · em quarentena escrita | 5 104 | 5 104 |
| C2 · fronteiras sem espaço no HTML | 60 526 | 60 486 |
| C2 · entre duas caixas (não contam) | 29 119 | 29 119 |
| C2 · entre duas peças de texto | 31 407 | 31 367 |
| C2 · dessas, as que a folha da página separa | 31 403 | 31 367 |
| **C2 · vermelhos** | **4** | **0** |

Os 12 vermelhos de `44f0d838` são, um a um, o defeito desta fatia e mais nada:

```
C1 · /index.html     rende «dominios-lista», «dominios-item», «dominios-estado»
C1 · /en/index.html  idem
C1 · /metodo/index.html e /en/method/index.html  rendem «dominios-vaga»
C2 · /index.html     «anças públicas»+«10 medidas» e «Trabalho»+«as medidas est»
C2 · /en/index.html  «ublic finances»+«10 measures» e «Labour»+«the measures a»
```

O positivo conhecido (`--prova`, que o `verify` corre sempre) monta um `dist/` de mentira fora da árvore do sítio com um defeito de cada espécie e exige que cada célula veja o seu e não veja: a classe com regra na folha ligada, a regra embutida em `<style>`, a regra dentro de um `@media`, a classe sem regra em folha nenhuma, um par com espaço, uma marca dentro de uma palavra, um expoente, e os dois pares que a folha ligada separa (um por `gap`, um por margem).

## A causa

**A lista dos domínios.** Estava escrita duas vezes, com o mesmo filtro e a mesma decisão de porta copiados: uma em `HomeView.astro`, outra em `DominiosView.astro`. As regras dela viviam em `src/styles/dominio.css`, que `DominiosView` importa e `HomeView` não. Em `/dominios` chegavam; em `/` não chegava nenhuma. Sem regras, o `<ol>` numera (daí o «2.»), o estado sai no serif do corpo a 16 px em vez do tipo de instrumento a 14, e o nome cola-se ao estado, porque o espaço entre eles era o `gap` do flex e o HTML não tinha ali espaço nenhum. A classe `dominios-secao` não tem regra em folha nenhuma, e continua a não ter: o que desenha aquele título é `.dominios-secao-k`, em `inicio.css`.

**A linha da busca.** As regras que a decisão pede já existiam em `site.css` desde 09.09 (`.busca-linha .busca-campo { flex: 1 1 auto; min-width: 0 }` e `.busca-submeter { flex: 0 0 auto }`) e não tinham onde acontecer: o pai da caixa na primeira página é `.pesquisa`, uma coluna flexível com `align-items: flex-start`, e um item assim mede o seu conteúdo. A linha media 220,1 px em todas as larguras porque a largura vinha do `size="4"` do `<input>` e não da folha.

## O que mudou, e onde

| ficheiro | o quê |
| --- | --- |
| `src/components/DominiosLista.astro` | **novo.** A lista, uma vez só, com a sua conta e com a sua folha importada por ela. Um `{' '}` entre o nome e o estado. |
| `src/styles/dominios-lista.css` | **novo.** As regras da lista, tiradas de `dominio.css` sem uma linha mudada. |
| `src/styles/dominio.css` | menos as regras da lista; fica a cabeça e o rodapé de `/dominios`. |
| `src/styles/leitura.css` | recebe `.dominios-vaga`, que vinha de `dominio.css` e só o Método rende. |
| `src/views/HomeView.astro` | rende o componente; perde a conta copiada e duas importações que só ela usava. |
| `src/views/DominiosView.astro` | rende o componente; perde a conta e as quatro importações de dados. |
| `src/views/MetodoView.astro` | um `{' '}` entre o nome do domínio e a sua vaga. |
| `src/i18n/strings.mjs` | `estadoDentroDe`: «as medidas estão em» → «incluído em»; «the measures are in» → «included in». |
| `design/especime-v3/INVENTARIO-FRASES.md` | as duas linhas antigas passam a `retirada` com a razão; as duas novas entram como `navegacao`, vivas. |
| `src/components/inicio/CampoDeBusca.astro` | `size="4"` → `size="24"`, e a razão reescrita com a medição. |
| `src/styles/site.css` | `.busca` leva `align-self: stretch`. |
| `scripts/check-css.mjs` | **novo.** As duas células, com o positivo conhecido. |
| `package.json` | `check:css` na cadeia do `verify`, a seguir ao `gate:html`. |

O `{' '}` não é uma cadeia nova: um nó de texto só de espaço entre dois itens de um contentor flex não se rende (CSS Flexbox §4), e por isso `/dominios` não muda um píxel; numa página sem a folha a linha lê-se na mesma. O `check:voz` continua a 0, com 1 003 linhas no inventário (782 vivas, todas rendidas; 221 retiradas, nenhuma rendida).

## O que as células acharam no resto do sítio

### C1 · três rotas com o MESMO defeito, 5 104 vermelhos, por decidir

Não são exceções. São a mesma coisa que o diretor leu, noutras páginas, e estão escritas em `C1_EM_QUARENTENA` com a rota, a classe e a contagem:

| rota | páginas | classes | a regra vive em | a vista importa |
| --- | --- | --- | --- | --- |
| `/municipios/<slug>` e `/en/municipalities/<slug>` | 616 | `forma`, `forma-svg`, `forma-barra-c`, `forma-barra-num`, `forma-barra-p`, `forma-frase`, `forma-frase-num`, `forma-selo-rot` | `src/styles/dominio.css` | `inicio.css`, `municipio.css` |
| `/distritos/<slug>` e `/en/districts/<slug>` | 58 | `lig`, `mapa-svg`, `mapa-svg-areas` | `src/styles/inicio.css` | `distrito.css` |
| `/livro-razao/concelhos` e a gémea inglesa | 2 | `pesquisa-distrito` | `src/styles/inicio.css` | `linha.css`, `municipio.css` |

Não se fecharam aqui, e a razão é uma: fechar cada um é escolher que folha passa a chegar a que página, e a mais pequena das três leva 5,5 KB de regras a 616 páginas que hoje não as têm. O que se vê nessas páginas muda, e quanto muda tem de ser medido antes e depois. É uma decisão do lugar de direção com uma medição ao lado, e não uma correção do mesmo dia. A quarentena é por rota e por classe: uma classe nova na mesma rota, ou a mesma classe noutra rota, fecha a construção.

### C2 · a primeira redação acusava a composição inteira da casa

A célula escrita à letra do brief («dois elementos vizinhos sem espaço entre eles») deu, na cabeça `44f0d838`, **60 526 vermelhos em 146 padrões**. Não eram 60 526 defeitos. Tirando as fronteiras entre duas caixas (`<p>`+`<p>`, `<dt>`+`<dd>`, `<tr>`+`<tr>`: duas caixas nunca fazem uma palavra) ficavam **31 407 em 60 padrões**, e esses são o retrato da composição desta casa: o selo da fonte encostado ao seu número (`.claim-value` + `.src-chip`, umas onze mil vezes), o valor e a sua unidade, o nome e a posição de um cartão, duas portas numa fila de rodapé. Em todos, o espaço é um `gap` escrito de propósito.

Escrever sessenta exceções para pôr a célula a verde seria a régua a servir o portão. O que separa o defeito do idioma é uma coisa só, e é a que o diretor leu: em `/dominios` a folha chegava e o `gap` estava lá; em `/` a folha não chegava e não estava nada. A pergunta passou a ser essa, medida com as folhas que chegam **àquela** página e com mais nenhumas, e os mesmos 60 526 dão 4 vermelhos, que são a linha do domínio nas duas edições.

**O que esta célula não vê, e fica escrito.** Ela lê as declarações por classe e não resolve a cascata, e sobe até à raiz à procura de um `gap`. É conservadora de propósito — entre deixar passar uma colagem e inventar uma que não existe, deixa passar —, e o preço mediu-se: o «Populaçãoprimeiro» de `/metodo`, que é uma colagem verdadeira, fica invisível a C2 porque `.metodo-secao`, lá acima, é uma grelha com `gap`. Foi C1 que o apanhou (`dominios-vaga`), e está corrigido nesta fatia; mas uma colagem dentro de um antepassado com goma continua a passar.

### Fora das células, lido de passagem

`.dominios-item[data-dominio-estado='sem'] .dominios-nome` não casa com nada no sítio construído, por duas razões ao mesmo tempo: `data-dominio-estado` é atributo do `<span>` do estado e não do `<li>`, e desde o §9.1 a lista só tem domínios com página, que nunca estão em «sem». A regra veio para `dominios-lista.css` como estava, com o aviso escrito ao lado, para que a mudança de 15.09 seja uma mudança de sítio e não de regras. Apagá-la é do lugar de direção.
