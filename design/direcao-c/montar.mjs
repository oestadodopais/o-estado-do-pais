/**
 * direção C · Editorial generoso · montagem dos protótipos.
 *
 * Não gera desenho nenhum. Faz três coisas, todas mecânicas:
 *
 *  1. cola `tokens.css` + `_estilo.css` dentro do <style> de cada
 *     protótipo, para que cada ficheiro se baste a si próprio;
 *  2. substitui `<!-- @svg:nome -->` pelo desenho copiado de `dist/`,
 *     carácter a carácter, com as ligações internas passadas ao domínio
 *     no ar. Os instrumentos desta direção são os do sítio: a geometria
 *     e os algarismos vêm de lá, não daqui;
 *  3. escreve `06-mobile.html` e `board.html`, que embebem os
 *     protótipos em `srcdoc` (sem pedidos para fora).
 *
 * Correr: node design/direcao-c/montar.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..');
const DIST = path.join(RAIZ, 'dist');
const VIVO = 'https://oestadodopaís.pt';

const PROTOTIPOS = [
  '01-primeira.html',
  '02-linha.html',
  '03-municipio.html',
  '04-metodo.html',
  '05-agenda.html',
];

const LEGENDAS = {
  '01-primeira.html': 'A primeira página: a régua abre, o painel das oito medidas vem a seguir, o mapa fecha.',
  '02-linha.html': 'A linha do livro-razão como recibo: o valor, a frase em palavras, e a prova degrau a degrau.',
  '03-municipio.html': 'Évora: oito medidas em lista editorial, a leitura breve, quem administrou, e o aparelho na margem.',
  '04-metodo.html': 'O Método: o mecanismo desenhado, e dez regras com mecanismo e prova.',
  '05-agenda.html': 'A agenda: quatro estados, os critérios de cada item, o que mudou, e o calendário das fontes.',
  '06-mobile.html': 'A 390px: as notas de margem passam a notas de rodapé do bloco, e a calha dos rótulos fecha para cima do texto.',
};

/* ------------------------------------------------------------ desenhos */

const FONTES_SVG = {
  mapa: ['index.html', 'map-svg'],
  regua: ['index.html', 'rule-svg'],
  mecanismo: ['metodo/index.html', 'mecanismo-svg'],
  'mun-distancia': ['municipios/evora/index.html', 'mun-distancia-svg'],
  'mun-serie': ['municipios/evora/index.html', 'mun-serie-svg'],
};

function extrairSvg(nome) {
  const [ficheiro, classe] = FONTES_SVG[nome];
  const html = fs.readFileSync(path.join(DIST, ficheiro), 'utf8');
  const i = html.indexOf(`<svg class="${classe}`);
  if (i < 0) throw new Error(`desenho ${classe} não encontrado em ${ficheiro}`);
  const j = html.indexOf('</svg>', i) + 6;
  let svg = html.slice(i, j).replace(/href="\/([^"]*)"/g, `href="${VIVO}/$1"`);
  /* Os trezentos e oito pontos do mapa trazem o nome e o distrito em
     atributos, que servem a leitura do rato e do teclado do sítio vivo.
     Aqui não há JavaScript, e por isso não pintam pixel nenhum nem
     dizem nada a um leitor de ecrã: saem, e o desenho fica com menos de
     metade do peso. É a única coisa que a montagem tira a um desenho. */
  if (nome === 'mapa') svg = svg.replace(/ data-[md]="[^"]*"/g, '');
  return svg;
}

/* Aperto do que vai dentro de um `srcdoc`: tira comentários e corta o
   avanço das linhas. Não mexe em texto: as quebras de linha ficam,
   porque há blocos que as rendem (`white-space: pre-line`). */
function apertar(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^[ \t]+/gm, '')
    .replace(/\n{2,}/g, '\n');
}

/* A folha vai apertada para dentro dos protótipos: os comentários, que
   são o que ela tem de mais útil, vivem em `tokens.css` e `_estilo.css`,
   que são a fonte e estão ao lado. */
function apertarFolha(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/* -------------------------------------------------------------- folha */

const folhaLegivel = [
  fs.readFileSync(path.join(AQUI, 'tokens.css'), 'utf8'),
  fs.readFileSync(path.join(AQUI, '_estilo.css'), 'utf8'),
].join('\n');
const folha = apertarFolha(folhaLegivel);
const CABECA_FOLHA = '/* direção C · Editorial generoso · a folha, apertada. Fonte legível e comentada: tokens.css + _estilo.css, ao lado deste ficheiro. */';

function montar(ficheiro) {
  const p = path.join(AQUI, ficheiro);
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/<style>[\s\S]*?<\/style>/, () => `<style>${CABECA_FOLHA}\n${folha}</style>`);
  html = html.replace(/(<div class="svg-scroll" data-svg="([a-z-]+)">)[\s\S]*?(<\/div>)/g,
    (_, abre, nome, fecha) => abre + extrairSvg(nome) + fecha);
  fs.writeFileSync(p, html);
  return html;
}

/* ------------------------------------------------------- srcdoc, board */

/* Dentro de um valor de atributo só `&` e a aspa que o delimita têm de
   ser escapados: `<` e `>` são legais aí, e escapá-los custava trinta
   mil bytes ao quadro sem mudar um pixel. */
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const escaparTexto = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Nas cópias que vão para dentro do quadro, os atributos passam a ser
   delimitados por plicas: cada aspa que sobrevive custa seis bytes
   escapada, e uma plica custa um. Não muda o que se rende. */
function plicas(html) {
  return html.replace(/<[a-zA-Z!/][^>]*>/g, (tag) =>
    tag.replace(/(\s[\w:.-]+)="([^"']*)"/g, "$1='$2'")
  );
}

function moldura(html, altura, titulo) {
  return `<iframe class="moldura" style="height:${altura}" title="${escaparTexto(titulo)}" srcdoc="${escapar(plicas(apertar(html)))}"></iframe>`;
}

/* -------------------------------------------------------------- corrida */

const montados = new Map();
for (const f of PROTOTIPOS) montados.set(f, montar(f));

/* 06-mobile.html: os dois protótipos a 390px, lado a lado. As molduras
   têm 390px de largura, e por isso as consultas de meios da folha veem
   390px, que é o que se quer demonstrar. */
const movel = `<!-- direção C · Editorial generoso · protótipo 06 · a 390px -->
<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>A 390px · direção C · Editorial generoso</title>
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; background: #e9e4d9; color: #1b1a17;
         font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: 12px; }
  @media (prefers-color-scheme: dark) { body { background: #24211b; color: #ece7dc; } }
  .barra { padding: 20px 24px; border-bottom: 1px solid currentColor; letter-spacing: 0.1em; text-transform: uppercase; }
  .fila { display: flex; gap: 32px; padding: 32px 24px; align-items: flex-start; overflow-x: auto; }
  .aparelho { flex: none; width: 390px; }
  .aparelho p { margin: 0 0 10px; letter-spacing: 0.08em; text-transform: uppercase; }
  .moldura { width: 390px; height: 3400px; border: 1px solid currentColor; background: #fbfaf7; display: block; }
  @media (prefers-color-scheme: dark) { .moldura { background: #14130f; } }
</style>
</head>
<body>
<div class="barra">Direção C · Editorial generoso · a 390px de largura</div>
<div class="fila">
  <div class="aparelho">
    <p>A linha do livro-razão</p>
    ${moldura(montados.get('02-linha.html'), '2950px', 'A linha do livro-razão a 390px')}
  </div>
  <div class="aparelho">
    <p>A primeira página</p>
    ${moldura(montados.get('01-primeira.html'), '7550px', 'A primeira página a 390px')}
  </div>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(AQUI, '06-mobile.html'), movel);
montados.set('06-mobile.html', movel);

/* board.html: o que o diretor abre. */
/* Alturas medidas: cada protótipo foi rendido em Chrome sem cabeça à
   largura que a moldura lhe dá, e a altura é a última linha com tinta,
   mais uma margem. Uma moldura curta cortava a página; uma comprida
   punha um vazio no fundo. */
const alturas = {
  '01-primeira.html': '6700px',
  '02-linha.html': '2000px',
  '03-municipio.html': '11650px',
  '04-metodo.html': '8550px',
  '05-agenda.html': '10850px',
};
const racional = fs.readFileSync(path.join(AQUI, '_board-racional.html'), 'utf8');

const board = `<!-- direção C · Editorial generoso · o quadro -->
<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Direção C · Editorial generoso</title>
<style>
${folha}
/* ---- o quadro. Não é uma página do sítio: é a moldura à volta dela. ---- */
.quadro { max-width: 1240px; margin: 0 auto; padding: 0 24px 120px; }
.quadro-cabeca { padding: 72px 0 40px; border-bottom: 1px solid var(--rule-strong); }
.quadro-titulo { font-size: clamp(40px, 5vw, 64px); line-height: 1.05; }
.quadro-sub { font-family: var(--f-mono); font-size: 12px; font-size-adjust: none;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.quadro-racional { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 40px; padding: 48px 0 64px; border-bottom: 1px solid var(--rule); }
.quadro-racional h2 { font-size: 19px; margin-bottom: 12px; }
.quadro-racional p { font-size: 16px; line-height: 1.55; color: var(--muted); }
.quadro-racional strong { color: var(--ink); font-weight: 400; }
.peca { padding: 64px 0 0; }
.peca-cabeca { display: flex; flex-wrap: wrap; gap: 8px 24px; align-items: baseline;
  padding-bottom: 12px; }
.peca-n { font-family: var(--f-mono); font-size: 12px; font-size-adjust: none; font-weight: 600;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.peca-cap { font-size: 17px; color: var(--muted); }
.moldura { width: 100%; border: 1px solid var(--rule-strong); background: var(--paper);
  display: block; }
.fila-movel { display: flex; gap: 24px; overflow-x: auto; align-items: flex-start; }
.fila-movel .moldura { flex: none; width: 390px; }
.peca-cap-nota { max-width: 30rem; }
.amostras { display: flex; flex-wrap: wrap; gap: 1px; margin-top: 16px; }
.amostra { flex: 1 1 84px; min-height: 64px; display: flex; align-items: flex-end; padding: 6px;
  font-family: var(--f-mono); font-size: 9.5px; font-size-adjust: none; letter-spacing: 0.06em;
  color: var(--ink); border: 1px solid var(--rule); }
.amostra[data-am="paper"] { background: var(--paper); }
.amostra[data-am="paper-2"] { background: var(--paper-2); }
.amostra[data-am="paper-3"] { background: var(--paper-3); }
.amostra[data-am="rule"] { background: var(--rule); }
.amostra[data-am="rule-strong"] { background: var(--rule-strong); }
.amostra[data-am="muted"] { background: var(--muted); color: var(--paper); }
.amostra[data-am="ink"] { background: var(--ink); color: var(--paper); }
.amostra[data-am="yellow"] { background: var(--yellow); color: var(--onyellow); }
.amostra[data-am="oxblood"] { background: var(--oxblood); color: var(--paper); }
</style>
</head>
<body>
<div class="quadro">
  <div class="quadro-cabeca">
    <p class="quadro-sub">Exploração de desenho · fase 2 · direção C</p>
    <h1 class="quadro-titulo">Editorial generoso</h1>
  </div>
  ${racional}
${PROTOTIPOS.map(
  (f, i) => `  <section class="peca">
    <div class="peca-cabeca">
      <span class="peca-n">${String(i + 1).padStart(2, '0')} · ${f}</span>
      <span class="peca-cap">${LEGENDAS[f]}</span>
    </div>
    ${moldura(montados.get(f), alturas[f], LEGENDAS[f])}
  </section>`
).join('\n')}
  <section class="peca">
    <div class="peca-cabeca">
      <span class="peca-n">06 · 06-mobile.html</span>
      <span class="peca-cap">${LEGENDAS['06-mobile.html']}</span>
    </div>
    <div class="fila-movel">
      ${moldura(montados.get('02-linha.html'), '2950px', 'A linha do livro-razão a 390px')}
      <p class="peca-cap peca-cap-nota">A primeira página a 390px está em <a href="06-mobile.html">06-mobile.html</a>, que traz as duas lado a lado. Aqui vai só a linha do livro-razão: com as duas, este ficheiro passava o tecto de 400 KiB que a conferência impõe a todos.</p>
    </div>
  </section>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(AQUI, 'board.html'), board);

const tam = (f) => (fs.statSync(path.join(AQUI, f)).size / 1024).toFixed(1) + ' KiB';
for (const f of [...PROTOTIPOS, '06-mobile.html', 'board.html']) {
  console.log(f.padEnd(20), tam(f));
}
