/** Plantas da segunda correção. Reposição dos bytes em finally, sem editar o livro. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { chromium } from 'playwright';
import { medeComandos, aceitaComandos, avaliaExpanded } from '../../../../tests/acessibilidade/expanded.mjs';
const pasta = path.dirname(new URL(import.meta.url).pathname);
const resultados = process.argv.includes('--html') ? JSON.parse(fs.readFileSync(path.join(pasta, 'plantas-segunda-correcao.json'), 'utf8')).filter(r => r.passou) : [];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function corre(nome, args, esperado = 0, mordida = '') {
  const r = spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  fs.writeFileSync(path.join(pasta, `${nome}.log`), saida);
  const linhas = saida.replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter(l => mordida && l.includes(mordida));
  const passou = r.status === esperado && (!mordida || linhas.length > 0);
  resultados.push({ nome, comando: ['node', ...args].join(' '), codigo: r.status, mordidas: linhas, passou });
  console.log(`${passou ? 'OK' : 'FALHA'} ${nome}: código ${r.status}${linhas.length ? '; ' + linhas[0] : ''}`);
  if (!passou) throw Error(`${nome}: conferência inesperada`);
}
function planta(nome, ficheiro, altera, args, mordida) {
  const antes = fs.readFileSync(ficheiro);
  const novo = altera(antes.toString());
  if (novo === antes.toString()) throw Error(`${nome}: não mudou`);
  try {
    fs.writeFileSync(ficheiro, novo);
    corre(nome, args, 1, mordida);
  } finally {
    fs.writeFileSync(ficheiro, antes);
    resultados.push({ nome: `${nome}-reposição`, antes: sha(antes), depois: sha(fs.readFileSync(ficheiro)), passou: sha(antes) === sha(fs.readFileSync(ficheiro)) });
  }
}
const muda = (seletor, faz) => html => {
  const doc = parse(html), el = doc.querySelector(seletor);
  if (!el) throw Error(`Alvo ausente: ${seletor}`);
  faz(el);
  return doc.toString();
};
try {
  if (!process.argv.includes('--h10') && !process.argv.includes('--html')) {
    corre('segunda-pais-sao', ['scripts/check-pais.mjs']);
    corre('segunda-lugar-sao', ['scripts/check-lugar.mjs']);
    for (const [lang, home, temas, descricao] of [
      ['pt', 'dist/index.html', 'dist/temas/index.html', 'As medidas de cabeça de cada domínio, a busca e o mapa dos concelhos, e as portas para os estudos e para os números com as suas fontes.'],
      ['en', 'dist/en/index.html', 'dist/en/themes/index.html', 'The head measures of each domain, the search and the map of the municipalities, and the doors to the studies and to the numbers with their sources.'],
    ]) {
      const pais = ['scripts/check-pais.mjs'];
      planta(`segunda-D1-pais-${lang}`, home, muda('meta[name="description"]', el => el.setAttribute('content', descricao)), pais, `D1 ${lang} país`);
      planta(`segunda-D1-temas-${lang}`, temas, muda('meta[name="description"]', el => el.setAttribute('content', lang === 'pt' ? 'Temas' : 'Themes')), pais, `D1 ${lang} temas`);
      planta(`segunda-M3-indice-${lang}`, home, muda('.pais-mudou [data-correcao-entrada] s', el => el.setAttribute('data-correcao-n', String(Number(el.getAttribute('data-correcao-n')) + 1))), pais, `M3 ${lang}`);
      planta(`segunda-M3-igual-${lang}`, home, muda('.pais-mudou [data-correcao-entrada="estudos-evora-publicados"]', el => {
        el.querySelector('s').set_content('4');
        el.querySelector('[data-correcao-campo="new_value"]').set_content('4');
      }), pais, `M3 ${lang}`);
      planta(`segunda-L1-${lang}`, home, muda(`#nav-principal a[href="${lang === 'pt' ? '/lugares/' : '/en/places/'}"]`, el => el.setAttribute('href', el.getAttribute('href').slice(0, -1))), ['scripts/check-lugar.mjs'], 'porta repetida com duas grafias');
    }
  }
  if (!process.argv.includes('--h10')) {
    corre('segunda-html-sao', ['scripts/gate-html.mjs']);
    planta('segunda-descricao-contagem', 'dist/index.html', muda('meta[name="description"]', el => el.setAttribute('content', el.getAttribute('content').replace('308', '309'))), ['scripts/gate-html.mjs'], 'o token "309"');
    planta('segunda-cor-do-sistema', 'dist/index.html', muda('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]', el => el.setAttribute('content', '#ffffff')), ['scripts/gate-html.mjs'], 'theme-color de dark difere');
    for (const campo of ['edition', 'unit', 'note']) {
      const injecao = campo === 'edition' ? "alvo.document = { ...alvo.document, edition: livro.get('divida-publica-2025-ue').document.edition };"
        : campo === 'unit' ? "alvo.unit = livro.get('divida-publica-2025-ue').unit;"
        : "alvo.note = livro.get('divida-publica-2025-ue').note;";
      corre(`segunda-ue-${campo}`, ['--input-type=module', '-e', `import { loadClaims } from './src/lib/ledger.mjs'; const livro = loadClaims(); const alvo = livro.get('taxa-de-desemprego-mip-2025-ue'); ${injecao} await import('./scripts/gate-html.mjs');`], 1, '"taxa-de-desemprego-mip-2025-ue" aparece sem selo');
    }
    corre('segunda-pais-reposto', ['scripts/check-pais.mjs']);
    corre('segunda-lugar-reposto', ['scripts/check-lugar.mjs']);
  }
  const nav = await chromium.launch({ headless: true });
  try {
    const pg = await nav.newPage();
    await pg.setContent('<nav aria-expanded="true">Planta sem comando</nav>');
    const plantados = await medeComandos(pg);
    const positivo = { ocorrencias: plantados.length, aceite: aceitaComandos(plantados) };
    const vazio = { expanded: 0, paginasExpanded: [] };
    const sao = avaliaExpanded(vazio, [], positivo);
    const falsoVerde = avaliaExpanded(vazio, [], { ...positivo, aceite: true });
    resultados.push({ nome: 'segunda-H10-conhecido-positivo', positivo, sao, falsoVerde, passou: sao && !falsoVerde });
    const html = '<details><summary aria-expanded="false" aria-controls="painel">Abrir</summary><div id="painel">Conteúdo</div></details>';
    await pg.setContent(html + '<script>const d=document.querySelector("details"); d.addEventListener("toggle",()=>d.firstElementChild.setAttribute("aria-expanded",String(d.open)));</script>');
    const reais = await medeComandos(pg);
    const dist = { expanded: 1, paginasExpanded: [{ rota: '/prova/', n: 1 }] };
    const funciona = avaliaExpanded(dist, [{ rota: '/prova/', comandos: reais }], positivo);
    await pg.setContent(html);
    const parado = await medeComandos(pg);
    const passaParado = avaliaExpanded(dist, [{ rota: '/prova/', comandos: parado }], positivo);
    const passaSemMedir = avaliaExpanded(dist, [], positivo);
    resultados.push({ nome: 'segunda-H10-comando-real', reais, parado, funciona, passaParado, passaSemMedir, passou: funciona && !passaParado && !passaSemMedir });
  } finally { await nav.close(); }
  if (resultados.some(r => !r.passou)) throw Error('Há uma planta que não morde.');
} finally {
  fs.writeFileSync(path.join(pasta, process.argv.includes('--h10') ? 'plantas-segunda-H10.json' : 'plantas-segunda-correcao.json'), JSON.stringify(resultados, null, 2) + '\n');
}
