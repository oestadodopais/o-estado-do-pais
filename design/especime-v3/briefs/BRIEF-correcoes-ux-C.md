# BRIEF · Correções de UX, passo C · o que a leitura cruzada dos blocos A e B apanhou

*Escrito a 25.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus 5), depois da leitura do Codex sobre os blocos A e B (`critica/2026-08-25-codex-leitura-correcoes.md`). Ramo `correcoes-ux-2026-08-25`, a seguir ao bloco B. Quatro itens, pequenos, cada um com a sua prova. Sem travessões na prosa deste ficheiro.*

## 1 · Os itens

**C1 · O índice das páginas de leitura não pode esconder o título (Codex M1).** Hoje «Nesta página» vem antes do `<h1>` do documento, e no telemóvel o primeiro ecrã não diz que documento se abriu. O `<article>` só pode conter os blocos do registo, na ordem, e o índice é mobília, logo não entra nele. Forma: no computador, o índice vai para o topo da coluna do aparelho (antes de «O documento original»); no telemóvel, fica por baixo do `<article>`? Não: fica **acima do artigo mas dobrado** (`<details>` fechado por defeito, com o rótulo «Nesta página ▸», o mesmo padrão da dobra das linhas), para que o título e a lede sejam a primeira coisa a seguir ao antetítulo. Prova: a 390, o `h1` do artigo começa antes de 45% do ecrã; a 1280, o índice está no aparelho e o `h1` no topo do corpo; a régua de B4 (`tests/texto/correcoes-b.mjs`) continua verde com a forma nova; `verificaTexto` L8 continua a conferir as entradas.

**C2 · As listas do Método e da agenda ficaram mais compridas no telemóvel (Codex M2).** A técnica do bloco B deu `min-height: 44px` às filas de ligação e as filas já tinham intervalo próprio: o índice do Método passou de dez entradas por ecrã a sete. Forma: a área de toque de 44 px por pseudo-elemento posicionado (a técnica de `a.src-chip` e `a.prova-valor`), sem altura de fila; ou a altura de 44 px **sem** o intervalo que se soma a ela. Prova: a 390, o índice do Método volta a caber dez entradas onde cabiam dez (medir antes do bloco B na construção de `main`, e depois), a agenda idem, e a régua de B10 continua a dar zero alvos efetivos abaixo de 44 px.

**C3 · Os milhares num valor de cabeça (Codex L1).** O livro-razão guarda os milhares com o espaço fino U+202F e a página imprime-o tal qual; em Bitter, a 52 px, o espaço fino quase não se vê e «167 372 755,84» lê-se como uma corrida de algarismos. O portão compara a cadeia de um `data-claim` com a normalização que a §1.47 (T4) escreve, em que os quatro espaços de milhares são o mesmo separador. Forma: `Claim.astro` rende o separador de milhares como espaço inseparável U+00A0 (que a letra desenha à largura de um espaço) em vez de U+202F, e mais nada muda na cadeia; a página da linha idem. Prova: a cadeia rendida em `dist/` traz U+00A0 nos milhares; o portão verde nas 342 páginas (é a prova de que a normalização aceita); uma captura a 390 e a 1280 do 04 com os dois valores de cabeça legíveis. **Se o portão recusar, pára este item e diz**: a normalização é a regra e não se alarga aqui.

**C4 · A pesquisa de concelho no topo de `/municipios` (Codex M3, decisão 5 aplicada ao índice).** O índice dos 308 abre com a pesquisa que a primeira página já tem (o mesmo componente, a mesma lista de resultados com «tem página»), antes da lista por distritos; e os concelhos com página listam-se primeiro, em «Com página» (hoje um), com a lista inteira por baixo como está. Prova: a 390, o campo de pesquisa dentro do primeiro ecrã; a régua do inventário sem blocos por classificar; o portão verde.

## 2 · O que não se faz

* A rota «Região» e a régua não voltam (Codex H1 é dissenso contra a decisão 3 do diretor; fica registado na §1.66).
* O 404 no ar é o da Vercel (`404.html`, provado pelo `verify:deploy`); o que o Codex viu foi o servidor de captura do lugar de direção.
* A frase de identidade não muda (Emenda 18); a ambiguidade do inglês «of Portugal» vai ao diretor.
* O texto do documento arquivado é I69 (motor); a pesquisa do livro-razão é bloco próprio (D8).

## 3 · Aceitação

`npm run build`, `verify`, `typecheck` verdes; as réguas de A e B verdes; cada item com a sua prova vermelha e verde; `notas/correcoes-ux.md` §C; a §1.66 subsecção C; commits no ramo com os dois trailers; não fundir, não empurrar; o relatório curto com os «judgement calls for the seat» primeiro.
