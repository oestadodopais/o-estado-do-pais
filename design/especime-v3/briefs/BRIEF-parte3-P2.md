# BRIEF · Parte 3, P2 · o renderizador, a rota `texto` e a nona origem

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5). Sítio: ramo `parte3-2026-08-24`, depois da P1 (a travessia em `registos/`, as seis conferências D1 a D6, o leitor `src/lib/registos.mjs`). O plano é a `design/especime-v3/ESTIMATIVA-PARTE3-2026-08-24.md` §2, §3 e §5; as onze decisões estão em `ESTADO-DO-MAIN-2026-08-24.md` e nenhuma se reabre. Sem travessões na prosa deste ficheiro; os nomes e os títulos citados levam os caracteres que têm.*

## 0 · Numa frase

Uma rota nova, `/estudos/<slug>/texto` e `/en/studies/<slug>/text`, compõe no gabarito v3 o documento inteiro de cada edição com registo, a partir do registo fixado e de mais nada: a página de leitura é uma **transcrição de um documento fixado**, não uma composição da casa (§0.3 do plano). Cada algarismo do documento entra pela nona origem, `data-registo`, que o portão compara carácter a carácter com o registo; as figuras com linha no livro-razão do sítio levam o selo, as outras levam a porta para «As linhas deste documento» na própria página; a edição arquivada em `/documento` não muda um byte. Sete conferências L1 a L7, dez estragos plantados e três controlos negativos, e a régua do inventário de frases aprende a origem antes de contar a página.

## 1 · Ler primeiro, por esta ordem

1. O plano: §0.3 (a restrição), §2 inteira, §3 inteira, §4.2 (só a nota da granularidade), §5.2 e §5.3, §7 (o que a leitura cruzada vai receber, para saberes o que vai ser lido), §8 (os três riscos).
2. `ESTADO-DO-MAIN-2026-08-24.md`: as decisões 1, 2, 3, 6, 9, 10 e 11 são desta etapa.
3. `IDENTIDADE.md` inteira (é a régua contra que a página se mede: §1 a letra, §3 a disposição B, §5 o selo, §6 o marcador, §9 a ortografia, §10 os números do sítio); `design/especime-v3/direcao.md` §4 e as Emendas 2, 5, 11, 15 (com a nota do teste) e 17.
4. `DECISIONS.md` §2.2 (as oito origens; a oitava é o precedente exato da nona) e §1.40 (a oitava origem, como entrou); `DECISIONS.md` §1.64 (a P1, escrita pelo construtor da P1).
5. Motor, em leitura: `publisher/REGISTOS.md` (o formato; as quatro regras da leitura do olho); `core/eyetext.py` (359 linhas: é o que se porta); `core/eyetext_test.py` (o que se prova).
6. Sítio: `src/lib/registos.mjs` (o leitor da P1); `src/lib/documentos.mjs`; `src/views/EstudoView.astro` e `src/views/LinhaView.astro` (a disposição B em uso, com `src/styles/linha.css`); `src/components/Provenance.astro` (o selo; a regra de nunca aninhar dentro de outro alvo); `src/components/Claim.astro` (para NÃO o usar aqui, e saber porquê); `src/layouts/Base.astro`; `src/lib/routes.mjs`; `src/lib/cartoes.mjs` (uma rota nova tem de dizer que cartão de partilha a cobre); `src/i18n/strings.mjs` (`assertKeyParity`); `design/especime-v3/CHAVES-EN.md` (a convenção das chaves novas); `scripts/gate-html.mjs` (o ramo `documento` em `verificaDocumento`, a origem 8 em `campoDaAgenda` e no varrimento de `[data-agenda]`, `eCitado`, `auditaSelo`, `LINHA_POR_PORTA`, o varrimento de ligações internas e âncoras); `scripts/medir-defeitos.mjs` (`ORIGEM_DECLARADA`, `ROTAS_DO_INVENTARIO`, medida 8) e `design/especime-v3/INVENTARIO-FRASES.md` (a cabeça e a forma da tabela); `astro.config.mjs` (o filtro do mapa do sítio); `ledger/cruzamentos/evora.json` (o registo de travessia das linhas: é por ele que uma figura do motor se liga a uma linha do sítio).

## 2 · O que já está medido (24.08, pelo lugar de direção; conferir se quiser, não re-derivar)

* **Intervalos:** nas oito edições do âmbito há **zero** cruzamentos parciais entre intervalos de ênfase, de ligação e de figura. O que existe é aninhamento: 116 figuras dentro de uma ênfase, 42 dentro de uma ligação, nenhuma figura sobreposta a outra. O máximo de figuras numa unidade é 14. **Consequência:** a partição única sobre a união das fronteiras (§2.1 do plano) produz sempre uma árvore bem aninhada; a figura é o elemento mais interior e **nunca se parte**. Um cruzamento parcial que apareça num registo futuro **pára a construção** com a coordenada, em vez de partir a figura em dois elementos com a mesma marca.
* **Espaço em branco:** o `text` das unidades e o `printed` das figuras só têm U+0020 como espaço; não há U+00A0 nem U+202F nos registos. O que o documento imprime é o que a página imprime: **nenhuma conversão para espaço fino**, nenhuma reformatação de número.
* **Identificadores de linha do motor:** 1 515 distintos no âmbito, caracteres `[-0-9A-Za-z_]`; servem como fragmento de âncora com um prefixo (`linha-<row>`).
* **A etiqueta mais longa de uma ligação:** 283 caracteres (as 7 ligações do 03 pt têm o próprio URL como etiqueta). É o que o documento imprime; a composição resolve-o com `overflow-wrap: anywhere` nas ligações dentro do corpo transcrito, e não com um corte do texto.
* **Os selos:** a figura tem linha do sítio quando `(rh_study, figures[].row)` casa com uma entrada de `ledger/cruzamentos/evora.json` (`rows[<site_id>].rh_study` e `.rh_id`); é o `row` escolhido, e não `others[]`, que decide. Medido no plano: 196 figuras do âmbito (12 no 04 pt).
* **O marcador `(inferência)`** aparece 53 vezes nas oito edições e o Método já o explica (regra 9, §1.63). Nada a fazer aqui.
* **A tabela contra os gráficos:** a edição arquivada do 04 tem quatro gráficos onde o registo tem a tabela de cabeçalho (bloco 12). A página de leitura mostra a tabela. **É o desenho, não um defeito** (controlo negativo 8 do plano), e fica escrito no registo e na nota da etapa.

## 3 · O contrato de marcação (fixado aqui, porque o portão, a medição cega e a leitura cruzada dependem dele)

A nona origem é **o registo, na página de leitura**. Tem quatro marcas, todas comparadas com o registo fixado (que o D1 já prendeu por resumo), nenhuma é dispensa, e **todas só valem na rota `texto`** (noutra página, erro, pela disciplina das origens 6 e 8).

| marca | onde | o que o portão compara |
|---|---|---|
| `data-registo-edicao="<slug>/<lang>"` | no `<article>` que contém o corpo transcrito, uma vez por página | é o localizador da página; o `slug/lang` tem de ser uma entrada de `registos/manifest.json` e a da própria rota |
| `data-registo-bloco="<b>"` | em cada elemento de bloco do corpo, na ordem do registo: `h1`…`h4`, `p`, `ul`/`ol`, `table`, `hr` | a sequência (índice, género, nível, `ordered`) é a do registo, sem bloco a mais nem a menos (L1) |
| `data-registo-unidade="<slug>/<lang>#<b>[.<i>\|.<r>.<c>]"` | em cada unidade com texto: o próprio `h*`/`p`, cada `li`, cada `td`/`th` | o texto pela leitura do olho é, carácter a carácter, o `text` da unidade (L2); e a unidade é transcrição: dispensa o varrimento de algarismos e o da ortografia **da mesma maneira que `data-verbatim`**, porque é comparada |
| `data-registo="<slug>/<lang>#<b>[.<i>\|.<r>.<c>].<f>"` | no elemento que embrulha **só** os caracteres de uma figura | o texto é o `printed` da figura, carácter a carácter (nunca o `value`), e as posições batem com o texto da unidade (L4); é a forma que o diretor decidiu (decisão 1) |
| `data-registo-linha="<slug>/<lang>@<row>.<campo>"` | nos campos de cada entrada de «As linhas deste documento», `campo` em `valor`, `impresso`, `origem` | `valor` é o `value` das figuras dessa linha; `impresso` são as formas `printed` distintas dessa linha, na ordem do documento, juntas por ` · `; `origem` é o `source_sha256` (64 hexadecimais) ou o `source_digest_kind`; o portão tem a sua própria cópia do separador |
| `data-registo-conta="<slug>/<lang>=<conta>"` | na faixa do aparelho, `conta` em `blocos`, `algarismos`, `com_linha_do_sitio` | o portão reconta do registo em disco e do registo de travessia das linhas; a marca leva porta (âncora na própria página), como um `data-prova` |

Regras da marcação, sem exceção:

* **Dentro de uma unidade só entra texto do registo e a mobília do selo.** O único elemento com texto próprio permitido dentro de uma unidade é o selo (`.src-chip`, posto por `<Provenance>`); a leitura do olho do sítio salta-o por regra declarada. Nenhum outro texto nosso entra numa unidade: nem rótulos, nem glifos em texto (um glifo por CSS `::after` não é texto e é permitido), nem espaços. **O selo entra sem nós de texto em branco de nenhum dos lados**; o afastamento é da folha.
* **A figura com linha do sítio:** `<span data-registo="…">printed</span>` seguido, colado, do selo `<Provenance id={site_id} lang={lang}/>`, cuja porta é `/livro-razao/<site_id>` (a linha guarda o valor exato; a página imprime o do documento; a porta basta, decisão 3). O selo nunca fica dentro de uma ligação nem de outro alvo (Emenda 2); numa figura que está dentro de uma ligação do documento, o selo vai imediatamente **depois** da ligação.
* **A figura sem linha do sítio:** `<a class="…" href="#linha-<row>" data-registo="…">printed</a>`, a porta para a sua entrada em «As linhas deste documento» (decisões 2 e 9). Sem selo, sem glifo ■/□. Uma figura dentro de uma ligação do documento não pode levar uma segunda âncora: nesse caso a porta vai na entrada da linha, e a figura fica `<span data-registo>` dentro da ligação do documento; o L6 aceita as duas formas e conta-as.
* **A letra:** toda a figura (com ou sem linha do sítio) vai em Bitter tabular, porque é um valor com linha, a do motor (§1 da `IDENTIDADE.md`, lida para este caso: o plano §2.6). Uma data, um ano ou um código que o registo não marca como figura fica na letra da frase. Nenhuma cor.
* **Ênfase e ligações:** `<strong>`, `<em>`, `<code>`, `<a href rel="noopener">`; a partição única sobre a união das fronteiras de todos os intervalos da unidade, com aninhamento por contenção (o intervalo que contém é o elemento exterior); um cruzamento parcial pára a construção com a coordenada.
* **As tabelas:** `<th>` exatamente onde `header: true`; a tabela é conteúdo e não instrumento; rola dentro da sua caixa no móvel (uma `<div>` à volta é permitida: não é bloco para a leitura do olho).
* **Nada é reformatado.** Nem números, nem espaços, nem travessões, nem aspas: o registo manda, e o portão da ortografia não vê dentro de `data-registo-unidade` (é transcrição), pela mesma regra que já isenta `data-verbatim`.

## 4 · A página, medida contra a `IDENTIDADE.md`

Sem prancha nova (decisão 11): compõe-se das peças fixadas e mede-se contra a constituição.

* **Disposição B** (§3): corpo a 68ch, coluna do aparelho a 300px; a cabeça interior compacta e o rodapé das outras páginas interiores. A folha nova é `src/styles/texto.css`, importada só pela vista, com as fichas de `tokens.css` e nenhum literal de cor.
* **A cabeça da página:** o antetítulo (Spectral SC) diz o que a coisa é e nada mais, chave nova `estudos.textoEyebrow` = «Documento do estudo · texto» / «Study document · text» (a forma paralela ao rótulo da faixa dos documentos, «Documento do estudo · edição de registo»); por baixo, o `<h1>` que é o bloco 0 do registo (o título de nível 1), dentro do `<article>`.
* **O corpo** é o `<article data-registo-edicao>` com **exatamente** os blocos do registo, na ordem do registo, e mais nada. Spectral 19px/1,6 na prosa, Bitter nas figuras. O bloco `heading` de nível 1 é o `<h1>`; os níveis 2 a 4 são `h2` a `h4`; `rule` é `<hr>`.
* **«As linhas deste documento»** (chave nova, `estudos.textoLinhasK` / «The rows of this document»), depois do `<article>`, como secção da página com `id="linhas-do-documento"`: uma entrada por linha do motor citada, na ordem da primeira citação, com `id="linha-<row>"`, e quatro campos e mais nenhum, com rótulos curtos nas duas línguas (chaves novas): a linha do motor (`<code>row</code>`, Bitter), o valor como a linha o guarda, como este documento o imprime, e o resumo de origem (os 64 hexadecimais, ou o motivo da lista fechada como o registo o escreve: `derivado`, `api-viva`, `raw-sem-manifesto`, `pdf-sem-resumo`, `portal-estatico`, **sem tradução**, porque é um valor do formato e não prosa). Sem glifo de selo (plano §2.4), sem frase sobre a casa. Uma linha do motor que TAMBÉM tem linha do sítio leva na entrada a porta para `/livro-razao/<site_id>` (uma ligação, com a palavra da chave nova «linha do livro-razão →»); é a mesma porta que o selo já abre, aqui na forma longa.
* **O aparelho** (300px), nesta ordem: «O documento original» com «Ler o documento →» para `/documento` (chaves existentes); a faixa das contagens, uma linha, «102 blocos · 326 algarismos · 12 com linha do livro-razão» com as três marcas `data-registo-conta` e as portas (blocos → `#documento`, a âncora do `<article>`; as outras duas → `#linhas-do-documento`); «O registo de conteúdo» (chave nova) com o `origin_ref` do manifesto (ficheiro do motor e commit) e o resumo do registo, em Bitter e marcados `data-nonledger="identificador-tecnico"`; a porta de volta à página do estudo (chave existente); a porta das correções (`<PortaDeCorreccoes>`, `portaNoRodape={false}`).
* **Emenda 15:** nenhuma frase sobre o método, a verificação, a honestidade ou a cobertura na página. Os rótulos nomeiam o que a coisa é. O inventário da rota vai a zero de autorreferência.
* **Móvel** (§11): uma coisa por linha; a coluna do aparelho passa para baixo do corpo; a 390px nenhuma página rola de lado (as tabelas rolam na sua caixa; as ligações do 03 quebram por `overflow-wrap: anywhere`). Medir com o `tests/` que existir para largura ou com uma captura do Playwright que já está nas dependências.
* **`noindex` e fora do mapa do sítio, nesta sessão** (o contrato da sessão): `Base noindex={true}`, e o filtro do `astro.config.mjs` exclui `hit?.key === 'texto'` com o comentário de que a decisão de indexar é da sessão de UX. As páginas ficam visíveis nos seus endereços.
* **A página do estudo** (`EstudoView.astro`) ganha a porta «Ler no sítio →» / «Read on the site →» (chave nova `estudos.textoLink`) ao lado de «Ler o documento →», **só** quando `temRegisto(slug, lang)`; a de uma edição sem registo não ganha nada, e a ausência diz-se assim (decisão 9). Na lista das edições, a porta do texto ao lado da do documento, quando existe.
* **Os cartões de partilha:** a rota `texto` não tem cartão próprio; leva o da primeira página da sua edição, e `src/lib/cartoes.mjs` (e o que `scripts/cartoes.mjs` regista) tem de dizer que a cobre, ou o portão fecha.
* **Ligações internas:** todas as âncoras `#linha-<row>` existem no destino (o portão já confere isso em todas as páginas); a porta da faixa também.

## 5 · A leitura do olho do lado do sítio: `src/lib/eyetext.mjs`

Um porte do `core/eyetext.py` sobre `node-html-parser` (que o sítio já tem), com as quatro regras e o mesmo passeio de blocos (`h1`…`h6`, `p`, `figcaption`, `blockquote`, `hr`, `ul`/`ol` com `li`, `table` com `tr` e `td`/`th`; texto solto forma parágrafo; os elementos de linha da lista `INLINE` não abrem bloco; `<title>` saltado; entidades descodificadas; uma corrida de espaço em branco vale um espaço; nada à cabeça nem à cauda). Devolve blocos com `{kind, level?, ordered?, items?/rows?, text, header?}`, na forma do registo. **Uma extensão declarada e uma só:** os elementos `.src-chip` (o selo) são saltados inteiros, porque são a única mobília com texto que entra numa unidade da página de leitura. Uma estrutura impossível (um `li` fora de lista, uma célula fora de linha) atira, como no Python.

**Provas, as duas, antes de o usar no portão:**

1. **Contra o motor:** nas cinco edições cujos bytes alojados são os do motor e cuja prova é `edicao-html` (06 pt, 07 pt, 07 en, 08 pt, 09 pt), a leitura de `studies-src/<slug>/<lang>.html` dá, unidade a unidade, exatamente os `text` do registo, com os géneros, os níveis e os `header` a bater. É a prova de que o porte lê como o motor. (O 04 não serve para isto, porque os seus bytes alojados têm gráficos no lugar da tabela; o 03 pt não serve porque os bytes alojados são um artefacto.) Escreve esta prova como script em `scripts/provar-eyetext.mjs`, corre-o, e regista os números na nota.
2. **Conhecido-positivo:** um bloco deitado fora e um espaço fantasma plantados numa cópia em memória fazem a comparação falhar, na forma do `core/eyetext_test.py`.

## 6 · O renderizador

* `src/lib/registo-html.mjs`: funções puras, do registo para HTML por bloco (uma cadeia por bloco, com escape de HTML), com a partição única e o contrato da §3; recebe o mapa `(row) → site_id` para decidir selo ou porta. O selo é markup de `<Provenance>`, e como a função é pura, ou o componente é rendido pelo `.astro` no lugar certo, ou a função devolve um marcador que a vista substitui pelo componente; escolhe o que mantiver o selo a ser SEMPRE o `<Provenance>` (nunca uma cópia do seu markup).
* `src/views/TextoView.astro`, `src/pages/estudos/[slug]/texto.astro`, `src/pages/en/studies/[slug]/text.astro`, com `getStaticPaths` a sair de `todosOsRegistos()` filtrado pela língua, **e não de `WORKS`**: só existem as páginas que têm registo.
* `ROUTES.texto = { pt: '/estudos/:slug/texto', en: '/en/studies/:slug/text' }` (decisão 6), com o comentário na forma dos vizinhos.
* O `<title>` é o texto do bloco 0 mais o nome do sítio; a descrição é a do trabalho (`work.description[lang]`), que já é prosa aprovada.

## 7 · O portão: L1 a L7 dentro do `gate:html`, na rota `texto`

Um ramo próprio, `verificaTexto(...)`, chamado quando `rota?.key === 'texto'`, **antes** da conferência geral e sem a dispensar: a página continua a ser varrida como qualquer outra (a porta para o Sobre, a porta das correções, as ligações, os cartões, o `data-nonledger`), e o corpo transcrito passa no varrimento de algarismos porque está dentro de `data-registo-unidade`. O portão lê `registos/manifest.json` e o `.record.json` **com o seu próprio leitor** (não importa `src/lib/registos.mjs` nem `registo-html.mjs`; importa `src/lib/eyetext.mjs`, que é a leitura e não o gabarito, provada à parte na §5). Lê `ledger/cruzamentos/evora.json` com o seu próprio leitor para saber que linha do motor tem linha do sítio.

| | O que é provado | O estrago que o fecha |
|---|---|---|
| L1 | a sequência de blocos do `<article>` (índice, género, nível, `ordered`, contagem de itens e de linhas e células) é a do registo | apagar um `<hr>`; trocar um `<h3>` por `<h2>` |
| L2 | o texto de cada unidade pela leitura do olho é, carácter a carácter, o `text` do registo | um carácter mudado; um espaço antes de um ponto final (a junta apertada); um espaço a menos dentro de um número |
| L3 | cada intervalo de `emphasis[]` e de `links[]` cobre exatamente os caracteres que declara (o elemento `strong`/`em`/`code`/`a` com esse texto, na posição certa; a ligação com o `href` do registo) | negrito a começar um carácter antes; um `href` trocado |
| L4 | cada figura tem a sua marca, o texto dentro dela é o `printed`, a marca resolve numa figura do registo, e `start`/`end` batem com o texto da unidade; nenhuma marca `data-registo*` fora da rota `texto` | imprimir o `value` em vez do `printed`; uma figura sem marca; uma marca numa página de estudo |
| L5 | as figuras da página são tantas quantas `referencias` no manifesto, e os blocos tantos quantos `blocos`; as três `data-registo-conta` batem com a recontagem do portão | uma figura a mais; a faixa escrita à mão com um número desfasado |
| L6 | cada figura com linha do sítio (pelo registo de travessia) tem selo colado, e o selo abre essa linha; cada figura sem linha tem a porta para a sua entrada (ou, dentro de uma ligação do documento, a entrada existe); nenhuma figura sem linha tem selo; cada entrada de «As linhas» bate com as figuras dessa linha (`data-registo-linha`) | um valor sem porta nenhuma; um selo ao lado de uma figura sem linha do sítio; um selo a abrir outra linha |
| L7 | `<th>` exatamente onde o registo tem `header: true` | uma célula de cabeçalho rendida como corpo |

**Os dez estragos plantados e os três controlos**, na forma da casa (a cópia alterada em `dist/`, o resumo registado antes, a conferência a fechar com o seu próprio nome e código 1, o ficheiro reposto e conferido):

1. um carácter mudado num parágrafo do 08 pt (L2);
2. um espaço acrescentado antes de um ponto final, na junta apertada de um `<em>` do 04 pt (L2);
3. um bloco `rule` deitado fora (L1);
4. um intervalo `strong` deslocado um carácter (L3);
5. uma figura a imprimir o `value` (`51.95`) em vez do `printed` (`51,95`), no 04 pt (L4);
6. uma figura sem `data-registo` (L4);
7. uma célula `header` rendida como célula de corpo (L7);
8. uma figura sem linha do sítio com um selo ao lado (L6);
9. a faixa com «102 blocos» trocado por «103 blocos» (L5);
10. uma marca `data-registo` numa página de estudo (L4);
11. **controlo negativo:** o 04 rendido com a tabela onde a edição arquivada tem gráficos: zero queixas, porque a comparação é contra o registo;
12. **controlo negativo:** uma figura cujo `printed` é igual ao `value` passa;
13. **controlo negativo:** os oito registos intactos dão zero queixas nas oito páginas (a construção inteira verde).

## 8 · A régua do inventário de frases aprende a origem ANTES de contar a página

Em `scripts/medir-defeitos.mjs`: `ORIGEM_DECLARADA` ganha `[data-registo]`, `[data-registo-unidade]`, `[data-registo-linha]` e `[data-registo-conta]` (nas duas listas onde a origem declarada é lida, medida 3 e medida 8), com o comentário que diz porquê (um documento transcrito não é a casa a falar); `ROTAS_DO_INVENTARIO` ganha `texto`. Em `INVENTARIO-FRASES.md`, a rota `texto` entra com todas as frases da casa que a página rende (o antetítulo, os rótulos do aparelho, as palavras da faixa, o título e os rótulos de «As linhas deste documento», as portas), classificadas em conteúdo ou navegação; **autorreferência a zero**. Corre a régua antes e depois e regista as duas contagens na nota: a rota tem de ler `autorreferência 0` e as outras rotas não podem ter mexido.

## 9 · O registo

* `DECISIONS.md` §1.64: a subsecção `#### P2 · o renderizador, a rota e a nona origem` (a página e a sua medida contra a constituição; o contrato de marcação; a leitura do olho e as duas provas; as sete conferências; os dez estragos com a frase de cada um e os três controlos; a régua; o que fica). **E a §2.2 passa de «oito» a «nove origens»:** o item 9, na forma do item 8, escrito por ti e revisto pelo lugar de direção (as quatro marcas, «não é uma dispensa», «só vale na página de leitura», o precedente da oitava).
* `IDENTIDADE.md`: duas frases, e só duas, na grafia do ficheiro (Acordo): em §1, depois do caso do número no meio de uma frase, o caso da página de leitura (os algarismos são os que o documento imprime, em Bitter quando são figura do registo, na letra da frase quando não são; nenhuma reformatação); em §5, ponto 3, a leitura para este caso (uma figura com linha do sítio leva o selo; uma figura só com linha do motor leva a porta para as linhas do documento, e nunca o selo, pela regra de §10). Cada uma cita a decisão do diretor de 24.08 pela entrada §1.64. Não citar nenhum texto governado.
* `design/especime-v3/CHAVES-EN.md`: a secção «Parte 3 · P2» com todas as chaves novas, pt e en lado a lado, e a nota de cada escolha.
* `design/especime-v3/notas/parte3.md`: a secção «P2» (as provas da leitura do olho com os números, os estragos, a régua antes e depois, as medidas a 1280 e a 390).
* `README.md` do sítio: a rota nova na lista das rotas e a nona origem onde as origens são listadas, em poucas linhas.
* `design/especime-v3/ISSUES.md`: defeitos fora do âmbito, registados e não corrigidos.

## 10 · Aceitação

1. `npm run build` verde com as oito páginas de leitura construídas (`dist/estudos/<slug>/texto/index.html` e as duas inglesas), `npm run typecheck` verde, `node scripts/medir-defeitos.mjs` com a rota `texto` a zero de autorreferência.
2. As duas provas da leitura do olho, com números.
3. Os dez estragos fechados com exit 1 e a frase da sua conferência, repostos; os três controlos verdes.
4. A página do 04 pt lida por ti, de alto a baixo, contra a edição arquivada ao lado, e a nota diz o que viste (a tabela no lugar dos gráficos, as dezasseis ligações do Tribunal de Contas vivas, os doze selos, as portas das outras figuras).
5. Commits no ramo, cada um com a construção verde; não fundir, não empurrar.
6. O relatório: **«judgement calls for the seat» primeiro**, depois o resto, com os caminhos, as contagens, os commits e o custo, e o que ficou por fazer dito por extenso; cada afirmação rotulada verificado ou inferido.

## 11 · Regras desta etapa

* As onze decisões não se reabrem; se algo as contradiz, pára e diz.
* Nenhum texto governado se toca (`sobre.mjs`, `metodo.mjs`).
* Nenhum byte de `studies-src/` nem de `registos/` muda.
* Prosa nova em português: Acordo de 1990, sem travessões, ponto médio como separador. As cadeias transcritas do registo não se convertem: são do documento.
* Nunca `git add -A`; nunca `dist/`; mensagens de commit na forma da casa, com os dois trailers do sítio.
* Regra 14: uma conferência só conta depois de fechar sobre um estrago; uma saída vazia não prova nada.
* Onde o plano deixa uma forma em aberto, segue o padrão mais próximo da casa, constrói, e põe a escolha à cabeça do relatório. Não pares por isso.
