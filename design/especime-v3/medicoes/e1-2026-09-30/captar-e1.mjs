/** E1: as cabeças dos quatro estudos de Évora, a lista dos estudos, a página do concelho
 * e duas edições datadas com a nota do sucessor, a 390 e a 1 280 px, nas edições que há.
 * O servidor efémero e o bloqueio de pedidos para fora seguem o captor do N1. O manifesto
 * conserva a cabeça do ramo, a construção, o estado da árvore e o resumo de cada captura.
 *
 * Na passagem E1b (01.10.2026): `OEDP_E1_BLOCO` dá o nome do manifesto, o rótulo do
 * bloco e o prefixo das imagens (por omissão, o E1 sem prefixo, como antes, para as
 * capturas do E1 continuarem a bater com o seu manifesto), e a página inglesa do estudo
 * de quem governou entra na lista, porque mostra o documento português com a nota
 * (decisão 3).
 *
 * Na passagem E1c (01.10.2026): com `OEDP_E1_BLOCO=E1c` entram também as duas fichas de mandato
 * que o ponto 2 do mandato mudou, a de 2021 a 2025 e a do mandato que começou em 2025, onde a dívida
 * de 31.12.2025 deixou de se dizer deixada e herdada.
 *
 * Na passagem E1d (01.10.2026): com `OEDP_E1_BLOCO=E1d` a lista é só a da passagem, as quatro fichas de
 * mandato com valores de fim de ano (2013 a 2017, 2017 a 2021, 2021 a 2025 e o mandato que começou em
 * 2025) e o estudo da economia, a cabeça e a secção do enquadramento, onde a frase da região mudou; o
 * modo `ancora` leva o título da secção ao alto da janela e fotografa a janela.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const pasta = 'design/especime-v3/medicoes/e1-2026-09-30';
const saida = 'design/especime-v3/capturas/e1-2026-09-30';
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const arvoreLimpa = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }).trim() === '';
const versao = JSON.parse(await fs.readFile('dist/version.json', 'utf8'));
if (versao.commit !== cabeca) throw new Error('A construção não é da cabeça atual.');
const estado = process.env.OEDP_E1_ESTADO ?? (arvoreLimpa ? 'cabeca-limpa' : 'arvore-com-alteracoes');
const bloco = process.env.OEDP_E1_BLOCO ?? 'E1';
const larguras = [390, 1280];
/* cada página: o id, a rota por língua, e o que se captura (a cabeça da janela, a página
   inteira, ou um elemento) */
const paginasDoE1 = [
  { id: 'contas', rota: { pt: '/estudos/evora-contas-da-camara-2010-2025', en: '/en/studies/evora-contas-da-camara-2010-2025' }, modo: 'cabeca' },
  { id: 'quem-governou', rota: { pt: '/estudos/evora-quem-governou-a-camara-2009-2025', ...(bloco === 'E1' ? {} : { en: '/en/studies/evora-quem-governou-a-camara-2009-2025' }) }, modo: 'cabeca' },
  { id: 'economia', rota: { pt: '/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara', en: '/en/studies/evora-economia-e-dinheiro-publico-de-fora-da-camara' }, modo: 'cabeca' },
  { id: 'evora-2027', rota: { pt: '/estudos/evora-2027-capital-europeia-da-cultura', en: '/en/studies/evora-2027-capital-europeia-da-cultura' }, modo: 'cabeca' },
  { id: 'lista', rota: { pt: '/estudos', en: '/en/studies' }, modo: 'inteira' },
  { id: 'concelho-estudos', rota: { pt: '/municipios/evora', en: '/en/municipalities/evora' }, modo: 'elemento', seletor: '#trabalhos' },
  { id: 'concelho-mandatos', rota: { pt: '/municipios/evora', en: '/en/municipalities/evora' }, modo: 'elemento', seletor: '#mandato-2009-2013' },
  { id: 'datada-orcamentado', rota: { pt: '/estudos/evora-orcamentado-pago-devido-2025', en: '/en/studies/evora-orcamentado-pago-devido-2025' }, modo: 'cabeca' },
  { id: 'datada-quinze-anos', rota: { pt: '/estudos/evora-quinze-anos-cinco-mandatos' }, modo: 'cabeca' },
  ...(bloco === 'E1c' ? [
    { id: 'concelho-mandato-2021', rota: { pt: '/municipios/evora', en: '/en/municipalities/evora' }, modo: 'elemento', seletor: '#mandato-2021-2025' },
    { id: 'concelho-mandato-2025', rota: { pt: '/municipios/evora', en: '/en/municipalities/evora' }, modo: 'elemento', seletor: '#mandato-2025' },
  ] : []),
];
const evora = { pt: '/municipios/evora', en: '/en/municipalities/evora' };
const economia = { pt: '/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara', en: '/en/studies/evora-economia-e-dinheiro-publico-de-fora-da-camara' };
const paginas = bloco === 'E1d' ? [
  { id: 'concelho-mandato-2013', rota: evora, modo: 'elemento', seletor: '#mandato-2013-2017' },
  { id: 'concelho-mandato-2017', rota: evora, modo: 'elemento', seletor: '#mandato-2017-2021' },
  { id: 'concelho-mandato-2021', rota: evora, modo: 'elemento', seletor: '#mandato-2021-2025' },
  { id: 'concelho-mandato-2025', rota: evora, modo: 'elemento', seletor: '#mandato-2025' },
  { id: 'economia', rota: economia, modo: 'cabeca' },
  { id: 'economia-enquadramento', rota: economia, modo: 'ancora', seletor: '#bloco-20' },
] : paginasDoE1;
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
const servidor = http.createServer(async (pedido, resposta) => {
  try {
    let ficheiro = path.resolve(dist, '.' + decodeURIComponent(new URL(pedido.url, 'http://localhost').pathname));
    if (!ficheiro.startsWith(dist + path.sep) && ficheiro !== dist) throw new Error('Caminho inválido.');
    if ((await fs.stat(ficheiro)).isDirectory()) ficheiro = path.join(ficheiro, 'index.html');
    resposta.setHeader('Content-Type', tipos[path.extname(ficheiro)] ?? 'application/octet-stream');
    resposta.end(await fs.readFile(ficheiro));
  } catch { resposta.writeHead(404).end(); }
});
await fs.mkdir(saida, { recursive: true });
await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
const origem = `http://127.0.0.1:${servidor.address().port}`;
const navegador = await chromium.launch();
const resultados = [];
const problemas = [];
const pedidosRecusados = [];
const inicio = new Date().toISOString();
try {
  for (const largura of larguras) for (const lang of ['pt', 'en']) {
    const contexto = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
    await contexto.route('**/*', (rota) => rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort()));
    const page = await contexto.newPage();
    page.on('pageerror', (e) => problemas.push(`${lang}/${largura}: ${e.message}`));
    for (const p of paginas) {
      const rota = p.rota[lang];
      if (!rota) continue;
      const resposta = await page.goto(origem + rota, { waitUntil: 'networkidle' });
      if (resposta.status() !== 200) problemas.push(`${p.id}/${lang}/${largura}: HTTP ${resposta.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const medidas = await page.evaluate(() => ({
        janela: innerWidth, documento: document.documentElement.scrollWidth, altura: document.documentElement.scrollHeight,
        h1: document.querySelector('main h1')?.textContent.trim() ?? null,
        nota_do_sucessor: document.querySelector('[data-sucessor-edicao]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
        antecessores: document.querySelector('[data-antecessores]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
        perguntas: [...document.querySelectorAll('.estudo-pergunta')].map((e) => e.textContent.trim()),
        estudos_na_lista: [...document.querySelectorAll('main [data-estudo]')].map((e) => e.getAttribute('data-estudo')),
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
      }));
      if (medidas.documento > largura + 1) problemas.push(`${p.id}/${lang}/${largura}: transbordo horizontal`);
      const ficheiro = `${saida}/${bloco === 'E1' ? '' : bloco.toLowerCase() + '-'}${p.id}-${lang}-${largura}.png`;
      let bytes;
      if (p.modo === 'inteira') bytes = await page.screenshot({ path: ficheiro, fullPage: true });
      else if (p.modo === 'elemento') {
        const el = page.locator(p.seletor).first();
        if (await el.count() === 0) { problemas.push(`${p.id}/${lang}/${largura}: sem ${p.seletor}`); continue; }
        await el.scrollIntoViewIfNeeded();
        bytes = await el.screenshot({ path: ficheiro });
      } else if (p.modo === 'ancora') {
        if (await page.locator(p.seletor).count() === 0) { problemas.push(`${p.id}/${lang}/${largura}: sem ${p.seletor}`); continue; }
        await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), p.seletor);
        bytes = await page.screenshot({ path: ficheiro, fullPage: false });
      } else bytes = await page.screenshot({ path: ficheiro, fullPage: false });
      resultados.push({ ficheiro, pagina: p.id, rota, lang, largura, modo: p.modo, sha256: createHash('sha256').update(bytes).digest('hex'), medidas });
    }
    await contexto.close();
    console.log(`${bloco}: ${lang}, ${largura} px.`);
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco, cabeca, arvore_limpa: arvoreLimpa, estado, construcao: versao, inicio, fim: new Date().toISOString(), larguras,
  capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados };
await fs.writeFile(`${pasta}/capturas-${bloco.toLowerCase()}.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`${bloco}: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
