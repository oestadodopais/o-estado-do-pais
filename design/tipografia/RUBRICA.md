# RUBRICA · a régua do estudo tipográfico

*Escrita a 29.08.2026, ANTES de qualquer captura e antes de qualquer tipo
descarregado. É a §2 do `BRIEF-tipografia.md`, copiada palavra por palavra, para
que a régua fique fixada por um commit anterior ao das medidas e não possa ser
ajustada depois de se ver o resultado. Ramo `tipografia-2026-08-29`.*

## O que esta cópia é

O commit desta ficha é o primeiro do estudo. O que vier a seguir (as fontes, o
interruptor, as construções, as capturas, as medidas) é medido contra o que está
aqui escrito, e não contra uma régua reescrita à luz do que se viu. Se alguma
medida se revelar impossível de fazer, isso diz-se em `NOTAS.md` com a razão, e a
linha da rubrica fica com o lugar vazio e dito vazio; a rubrica não se emenda
para caber no resultado.

## §2 do brief, copiada

Cada família candidata à prosa e ao instrumento é medida, nas páginas reais do
sítio, a 320, 360, 390, 430, 768, 1024 e 1280 de largura e a 1×, 2× e 3× de
densidade (Playwright, `deviceScaleFactor`), em cinco tipos de página: a primeira
página, um concelho (`/municipios/evora`), uma região, uma linha do livro-razão,
uma página de leitura de estudo. As medidas, por família:

1. **Altura de x** em píxeis a 17 px de corpo (a prosa) e a 15 px (as tabelas),
   lida do tipo carregado (`canvas.measureText` de um «x»).
2. **O traço mais fino** a 1× no corpo da prosa e nos números (medido nos píxeis
   da captura: a corrida mínima de tinta), e se desaparece.
3. **Aberturas e contraformas**: a distância mínima entre o traço e a contraforma
   de «e», «a», «s» a 17 px e 1× (píxeis).
4. **Algarismos tabulares**: numa tabela do livro-razão, as colunas de algarismos
   alinham (a variância das larguras de «0» a «9» a 15 px); a família tem a
   feature, ou não tem e fica excluída do instrumento.
5. **Versaletes**: existem como feature (`smcp`) ou como família irmã; senão, as
   versais ficam na Spectral SC e diz-se.
6. **Linhas por ecrã** a 390 × 844 numa página de leitura, ao mesmo corpo e
   entrelinha (a densidade de leitura).
7. **Peso dos ficheiros** (WOFF2 subconjunto latino) por estilo, e o total que o
   sítio carregaria.
8. **A leitura cega** (fase do lugar de direção): as capturas das cinco páginas
   nas famílias finalistas, a 390 e 1280, lidas pelo Codex contra esta rubrica
   com duas plantas.

Nenhuma medida é «boa» sem o número; a preferência escreve-se no fim, com as
medidas ao lado.

## As candidatas, também copiadas (§3 do brief)

**Prosa** (com tamanhos óticos ou desenhadas para texto pequeno; licença OFL,
alojáveis): Newsreader (Production Type), Source Serif 4 (Adobe), Literata
(TypeTogether); a Spectral atual como controlo; Parnaso Standard e Small quando o
pacote de teste existir (fica o lugar na tabela, vazio e dito vazio).
**Instrumento** (algarismos tabulares obrigatórios): Bitter (controlo), uma sem
serifa com tabulares como contraste (Public Sans ou IBM Plex Sans; escolhe uma e
diz porquê); Sebenta quando o pacote existir.

## A regra do detetor, também escrita antes (§5 do brief)

As medidas 1 a 7 para cada família, com o caso conhecido de cada detetor visto
vermelho: um tipo sem tabulares tem de falhar a 4; um hairline plantado tem de
aparecer na 2. Um detetor que nunca viu um vermelho não mediu nada.
