/* Direção B · Instrumento à frente
   Monta os protótipos: cada ficheiro sai autónomo, com os tokens e o sistema
   embebidos, sem nenhum pedido para fora e sem uma linha de JavaScript.
   Corre com `node design/direcao-b/montar.mjs` a partir da raiz do repositório
   ou de qualquer sítio: os caminhos são relativos a este ficheiro. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { podar } from './podar.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://oestadodopaís.pt';
const MARCA = '<!-- Direção B · Instrumento à frente -->';

/* O CSS embebido vai comprimido: os comentários e a pauta vivem em
   `tokens.css` e `sistema.css`, que são os ficheiros que se leem. Sem isto o
   quadro, que carrega os seis protótipos por `srcdoc`, passa o limite de
   400 KiB só com o mesmo comentário repetido oito vezes. */
function comprimir(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const tokensBrutos = comprimir(readFileSync(join(AQUI, 'tokens.css'), 'utf8'));
const sistema = comprimir(readFileSync(join(AQUI, 'sistema.css'), 'utf8'));

const NAV = [
  ['/', 'Início'],
  ['/municipios', 'Municípios'],
  ['/estudos', 'Estudos'],
  ['/livro-razao', 'Livro-razão'],
  ['/agenda', 'Agenda'],
  ['/metodo', 'Método'],
  ['/sobre', 'Sobre'],
];
const RODAPE = [
  ['/', 'Início'],
  ['/municipios', 'Municípios'],
  ['/estudos', 'Estudos'],
  ['/livro-razao', 'Livro-razão'],
  ['/agenda', 'Agenda'],
  ['/metodo', 'Método'],
  ['/correcoes', 'Correções'],
  ['/sobre', 'Sobre'],
];

function cabecalho(aqui, { compacta }) {
  const tabs = NAV.map(
    ([r, n]) =>
      `<a href="${BASE}${r}"${r === aqui ? ' aria-current="page"' : ''}>${n}</a>`
  ).join('');
  const marca = compacta
    ? `<p class="wordmark"><a href="${BASE}/">O Estado do País</a></p>`
    : `<h1 class="wordmark">O Estado do País</h1>`;
  return `<header>
<div class="topo">
<nav class="nav" aria-label="Secções">${tabs}</nav>
<nav class="nav" aria-label="English"><a href="${BASE}/en" hreflang="en" lang="en">English</a></nav>
</div>
<div class="marca${compacta ? ' marca-compacta' : ''}">
${marca}
<p class="method-line" lang="pt-PT">Portugal, medido. Cada número tem fonte.</p>
</div>
<div class="sinal">
<div class="sinal-cel"><span class="rot">Reconferência</span><a href="${BASE}/#numeros">Painel europeu reconferido a <span class="sinal-v">2026-08-12</span></a></div>
<div class="sinal-cel"><span class="rot">Agenda</span><span><a href="${BASE}/agenda"><span class="sinal-v">3</span></a> em curso · <a href="${BASE}/agenda"><span class="sinal-v">1</span></a> a seguir</span></div>
</div>
</header>`;
}

const rodape = () =>
  `<footer class="rodape">${RODAPE.map(([r, n]) => `<a href="${BASE}${r}">${n}</a>`).join('')}<a href="${BASE}/en" hreflang="en">English</a></footer>`;

const PORTA = `<div class="porta">
<span class="porta-k">Encontrou um erro</span>
<p>Escreva para <a href="mailto:correcoes@oestadodopais.pt">correcoes@oestadodopais.pt</a>. Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.</p>
<p><a class="seta" href="${BASE}/correcoes">O registo de correções →</a></p>
</div>`;

const PAGINAS = [
  ['01-primeira', 'Primeira página · O Estado do País · Direção B', '/'],
  ['02-linha', 'A linha como recibo · O Estado do País · Direção B', '/livro-razao'],
  ['03-municipio', 'Évora · O Estado do País · Direção B', '/municipios'],
  ['04-metodo', 'Método · O Estado do País · Direção B', '/metodo'],
  ['05-agenda', 'Agenda · O Estado do País · Direção B', '/agenda'],
  ['06-mobile', 'A 390px · O Estado do País · Direção B', '/'],
];

/* Os 308 pontos do mapa, copiados do `dist/index.html` construído e guardados
   em `fonte/mapa.svgfrag`. Nenhuma coordenada foi refeita aqui. */
const MAPA = readFileSync(join(AQUI, 'fonte', 'mapa.svgfrag'), 'utf8');

const escapar = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

function montar(nome, titulo, aqui) {
  let corpo = readFileSync(join(AQUI, 'fonte', `${nome}.frag`), 'utf8');
  const extraPath = join(AQUI, 'fonte', `${nome}.css`);
  const extra = existsSync(extraPath) ? comprimir(readFileSync(extraPath, 'utf8')) : '';
  corpo = corpo.replaceAll(/\{\{SRCDOC:([0-9a-z-]+)\}\}/g, (_, alvo) =>
    escapar(readFileSync(join(AQUI, `${alvo}.html`), 'utf8'))
  );
  /* Um quadro dentro de um quadro: o de dentro vai em base64, que atravessa o
     escape do de fora sem crescer. Sem isto o quadro final duplicaria o escape
     e passaria o limite de 400 KiB. */
  corpo = corpo.replaceAll(/\{\{DATAURI:([0-9a-z-]+)\}\}/g, (_, alvo) =>
    'data:text/html;charset=utf-8;base64,' +
      readFileSync(join(AQUI, `${alvo}.html`)).toString('base64')
  );
  corpo = corpo
    .replaceAll('{{MAPA}}', MAPA)
    .replace('{{CABECALHO}}', cabecalho(aqui, { compacta: nome !== '01-primeira' }))
    .replace('{{CABECALHO-COMPACTO}}', cabecalho(aqui, { compacta: true }))
    .replaceAll('{{RODAPE}}', rodape())
    .replaceAll('{{PORTA}}', PORTA)
    .replaceAll('{{BASE}}', BASE);
  /* A folha embebida é só a parte do sistema que esta página usa. */
  const abertura = `<a class="skip" href="#conteudo">Saltar para o conteúdo</a>`;
  const corpoInteiro = abertura + corpo;
  const folha = tokensBrutos + podar(sistema + extra, corpoInteiro);
  const html = `${MARCA}
<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<style>${folha}</style>
</head>
<body>
${corpoInteiro}
</body>
</html>
`;
  writeFileSync(join(AQUI, `${nome}.html`), html);
  return html.length;
}

const feitos = [];
for (const [nome, titulo, aqui] of PAGINAS) {
  feitos.push([nome, montar(nome, titulo, aqui)]);
}

/* O quadro: os seis protótipos embebidos por `srcdoc`, sem nenhum pedido. */
let quadro = readFileSync(join(AQUI, 'fonte', 'board.frag'), 'utf8');
quadro = quadro.replaceAll('{{BASE}}', BASE);
for (const [nome] of PAGINAS) {
  const html = readFileSync(join(AQUI, `${nome}.html`), 'utf8');
  quadro = quadro.replace(`{{SRCDOC:${nome}}}`, escapar(html));
}
const board = `${MARCA}
<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Direção B · Instrumento à frente</title>
<style>${tokensBrutos + podar(sistema + comprimir(readFileSync(join(AQUI, 'fonte', 'board.css'), 'utf8')), quadro)}</style>
</head>
<body>
${quadro}
</body>
</html>
`;
writeFileSync(join(AQUI, 'board.html'), board);
feitos.push(['board', board.length]);

for (const [n, l] of feitos) {
  console.log(String(n).padEnd(14), (l / 1024).toFixed(1).padStart(8), 'KiB');
}
