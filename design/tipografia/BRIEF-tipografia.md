# BRIEF · O estudo tipográfico: a letra do sítio nos ecrãs pequenos

*Escrito a 29.08.2026 pelo lugar de direção (Claude Fable 5) para o construtor (Claude Opus). Ramo `tipografia-2026-08-29`, numa cópia própria. É o estudo que a constituição visual v3.1 (18.08) pediu antes da compra e que nunca se fez. Sem travessões na prosa.*

## 0 · O que o diretor pediu (29.08.2026)

Explorar a tipografia do sítio a sério e melhorá-la «bastante»: a letra da prosa e a letra dos números, julgadas nos formatos pequenos (telemóvel, tablet, portátil pequeno), onde a diferença entre uma letra boa e uma medíocre se vê; com opções para além do Parnaso e do Sebenta (Feliciano Type, a escolha da constituição), que entram na ronda quando o pacote de teste chegar; com a decisão de compra a seguir, e não antes.

## 1 · O que está verificado

* O sítio aloja hoje Spectral (400, 500, 600, 700 e um itálico 400), Spectral SC (400, 600) e Bitter (variável, usada a 500, 600 e 700), em `public/tipos`; a prosa usa Spectral 400/500/600, as versais Spectral SC em 20 regras, o instrumento Bitter 600 em 77 regras; `font-variant-numeric: tabular-nums` é pedido em 143 sítios; itálico quase não se usa. Tokens em `src/styles/tokens.css` (`--f-prosa`, `--f-instr`, `--f-versal`).
* A constituição (vault, «Constituição visual v3.1») escolheu Parnaso (editorial; Display, Standard, Small, Petit, Hairline, seis pesos cada) e Sebenta (egípcia, os números), com um teste eliminatório antes da compra: algarismos tabulares e versaletes nas fontes de teste. As fontes de teste (OTF, conjunto de caracteres limitado, sem features OpenType) chegam por um formulário que só o diretor preenche; não as buscas tu.
* Regras da casa: nenhum tipo de terceiros no ar (só alojados em `public/tipos`, com a licença ao lado); as licenças OFL permitem alojar; nada disto entra em `main` sem Emenda.

## 2 · A rubrica, escrita antes de olhar

Cada família candidata à prosa e ao instrumento é medida, nas páginas reais do sítio, a 320, 360, 390, 430, 768, 1024 e 1280 de largura e a 1×, 2× e 3× de densidade (Playwright, `deviceScaleFactor`), em cinco tipos de página: a primeira página, um concelho (`/municipios/evora`), uma região, uma linha do livro-razão, uma página de leitura de estudo. As medidas, por família:

1. **Altura de x** em píxeis a 17 px de corpo (a prosa) e a 15 px (as tabelas), lida do tipo carregado (`canvas.measureText` de um «x»).
2. **O traço mais fino** a 1× no corpo da prosa e nos números (medido nos píxeis da captura: a corrida mínima de tinta), e se desaparece.
3. **Aberturas e contraformas**: a distância mínima entre o traço e a contraforma de «e», «a», «s» a 17 px e 1× (píxeis).
4. **Algarismos tabulares**: numa tabela do livro-razão, as colunas de algarismos alinham (a variância das larguras de «0» a «9» a 15 px); a família tem a feature, ou não tem e fica excluída do instrumento.
5. **Versaletes**: existem como feature (`smcp`) ou como família irmã; senão, as versais ficam na Spectral SC e diz-se.
6. **Linhas por ecrã** a 390 × 844 numa página de leitura, ao mesmo corpo e entrelinha (a densidade de leitura).
7. **Peso dos ficheiros** (WOFF2 subconjunto latino) por estilo, e o total que o sítio carregaria.
8. **A leitura cega** (fase do lugar de direção): as capturas das cinco páginas nas famílias finalistas, a 390 e 1280, lidas pelo Codex contra esta rubrica com duas plantas.

Nenhuma medida é «boa» sem o número; a preferência escreve-se no fim, com as medidas ao lado.

## 3 · As candidatas

**Prosa** (com tamanhos óticos ou desenhadas para texto pequeno; licença OFL, alojáveis): Newsreader (Production Type), Source Serif 4 (Adobe), Literata (TypeTogether); a Spectral atual como controlo; Parnaso Standard e Small quando o pacote de teste existir (fica o lugar na tabela, vazio e dito vazio). **Instrumento** (algarismos tabulares obrigatórios): Bitter (controlo), uma sem serifa com tabulares como contraste (Public Sans ou IBM Plex Sans; escolhe uma e diz porquê); Sebenta quando o pacote existir. Vais buscar as OFL às fontes do próprio autor ou ao repositório `google/fonts` (as variáveis com eixo `opsz` quando existem), com o ficheiro de licença ao lado, para `design/tipografia/tipos/<familia>/`; nunca para `public/tipos`.

## 4 · O que constróis

1. `design/tipografia/RUBRICA.md`: a §2 copiada, com a data, antes de qualquer captura (commit próprio).
2. Um interruptor de família só na cópia (uma variável de ambiente ou um ficheiro de tokens alternativo lido pela construção) que troca `--f-prosa`, `--f-versal` e `--f-instr` e as `@font-face` sem tocar em mais nada; uma construção por combinação (prosa × instrumento) que faça sentido: pelo menos as quatro famílias de prosa com a Bitter, e a Bitter contra a sem serifa com a Spectral; diz quantas construções fizeste e porquê.
3. As capturas (`design/tipografia/capturas/<combinacao>/<pagina>-<largura>-<densidade>.png`) e as medidas (`design/tipografia/MEDIDAS.json` e uma tabela em `NOTAS.md`), com o programa que as fez ao lado.
4. As pranchas: `design/tipografia/PRANCHA-390.png` (a mesma página de concelho e a mesma página de leitura em cada família, lado a lado, a 390 e 3×) e `PRANCHA-1280.png`; os recortes de uma tabela de algarismos por família a 15 px e 1×, ampliados 4×.
5. `design/tipografia/NOTAS.md`: por família, o que se viu (o «e», o «a», o «s», os algarismos, a densidade), as medidas, os ficheiros e as licenças, e a ordem de preferência para a prosa e para o instrumento, com a razão e com o que se recomenda comprar se a resposta for comercial; sem elogios.

## 5 · O que é «feito»

* As medidas 1 a 7 para cada família, com o caso conhecido de cada detetor visto vermelho (um tipo sem tabulares tem de falhar a 4; um hairline plantado tem de aparecer na 2).
* Nada alterado fora de `design/tipografia/` e do interruptor da cópia; `main` intocado; commits com caminhos explícitos e os dois trailers (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`, `Claude-Session: https://claude.ai/code/session_01BbaH3XteKcsmmN9VD6SGwU`), cada um com `npm run typecheck` verde; as fontes descarregadas com a licença ao lado e a origem escrita; nenhum tipo comercial buscado.
* O relatório com o custo em símbolos.
