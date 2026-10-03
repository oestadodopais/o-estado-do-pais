/** S1-c: as capturas do formulário da caixa das sugestões sem o campo do contacto e com a nota aprovada pelo diretor
 * (03.10.2026, §1.154), a 390 e a 1 280 px, nas duas edições (o ponto 4 da mensagem do lugar de direção da passagem).
 * O servidor efémero e o bloqueio dos pedidos de fora são os do captor do S1 (`captar-s1.mjs`, ao lado). As imagens
 * novas levam o prefixo `s1c-` e não substituem as do S1, que o manifesto do S1 (`capturas-s1.json`) prende pelo
 * sha256 de cada uma.
 *
 * O manifesto guarda a cabeça da construção, o resumo de cada imagem e as medidas de cada página: a altura, o
 * transbordo horizontal, a altura do botão, a caixa do campo armadilhado (que tem de estar fora do ecrã), os nomes dos
 * campos do formulário (sem o do contacto) e a nota rendida, comparada carácter a carácter com a declarada em
 * `src/data/sugestoes.mjs`. O CONHECIDO-POSITIVO corre em cada página, depois da imagem tirada: um campo do contacto
 * posto no formulário dentro do navegador tem de ser visto pela mesma leitura dos campos, senão a medida «sem contacto»
 * seria a de um leitor cego. E lê, sem imagem, a quinta recusa do Método nas duas edições.
 * Uso, da raiz da worktree:  node design/especime-v3/medicoes/s1-2026-10-02/captar-s1c.mjs
 *   (sobre `dist/`, que tem de ser uma construção da cabeça atual)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const pasta = 'design/especime-v3/medicoes/s1-2026-10-02';
const saida = 'design/especime-v3/capturas/s1-2026-10-02';
const versao = JSON.parse(await fs.readFile(path.join(dist, 'version.json'), 'utf8'));
if (versao.commit !== cabeca) throw new Error(`A construção (${versao.commit}) não é da cabeça atual (${cabeca}).`);
const { SUGESTOES } = await import(pathToFileURL(path.resolve('src/data/sugestoes.mjs')).href);
const { POLITICA } = await import(pathToFileURL(path.resolve('src/data/politica-ia.mjs')).href);
const LARGURAS = [390, 1280];
const CAMPOS = ['lingua', 'sitio', 'procurou', 'estudo', 'outro'];
const rotas = { formulario: { pt: '/sugestoes/', en: '/en/suggestions/' }, metodo: { pt: '/metodo/', en: '/en/method/' } };
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
const recusas = {};
const inicio = new Date().toISOString();

/** As medidas da página, lidas no navegador. */
const medir = () => {
  const form = document.querySelector('[data-sugestoes-formulario]');
  const botao = form?.querySelector('button[type="submit"]');
  const armadilha = document.querySelector('[data-sugestoes-armadilha] input');
  const caixa = (el) => (el ? (({ left, top, width, height }) => ({ left: Math.round(left), top: Math.round(top), largura: Math.round(width), altura: Math.round(height) }))(el.getBoundingClientRect()) : null);
  return {
    janela: innerWidth,
    documento: document.documentElement.scrollWidth,
    altura: document.documentElement.scrollHeight,
    h1: document.querySelector('main h1')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    botao: caixa(botao),
    armadilha: caixa(armadilha),
    campos: form ? [...form.querySelectorAll('[name]')].map((c) => c.getAttribute('name')) : null,
    campos_de_correio: form ? form.querySelectorAll('input[type="email"]').length : null,
    nota: document.querySelector('[data-sugestoes-nota]')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
  };
};

const contexto = async (largura) => {
  const c = await navegador.newContext({ viewport: { width: largura, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  await c.route('**/*', (rota) => (rota.request().url().startsWith(origem) ? rota.continue() : (pedidosRecusados.push(rota.request().url()), rota.abort())));
  return c;
};

try {
  for (const lang of ['pt', 'en']) for (const largura of LARGURAS) {
    const c = await contexto(largura);
    const page = await c.newPage();
    page.on('pageerror', (e) => problemas.push(`formulario/${lang}/${largura}: ${e.message}`));
    const resposta = await page.goto(origem + rotas.formulario[lang], { waitUntil: 'networkidle' });
    if (resposta.status() !== 200) problemas.push(`formulario/${lang}/${largura}: HTTP ${resposta.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const medidas = await page.evaluate(medir);
    if (medidas.documento > largura + 1) problemas.push(`formulario/${lang}/${largura}: transbordo horizontal`);
    if (!medidas.botao || medidas.botao.altura < 44) problemas.push(`formulario/${lang}/${largura}: o botão tem menos de 44 px`);
    if (!medidas.armadilha || medidas.armadilha.left + medidas.armadilha.largura > 0) problemas.push(`formulario/${lang}/${largura}: o campo armadilhado não está fora do ecrã`);
    if (JSON.stringify(medidas.campos) !== JSON.stringify(CAMPOS) || medidas.campos_de_correio !== 0) problemas.push(`formulario/${lang}/${largura}: os campos são ${JSON.stringify(medidas.campos)}, e o contacto saiu`);
    if (medidas.nota !== SUGESTOES.nota[lang]) problemas.push(`formulario/${lang}/${largura}: a nota rendida não é a aprovada`);
    const ficheiro = `${saida}/s1c-formulario-${lang}-${largura}.png`;
    const bytes = await page.screenshot({ path: ficheiro, fullPage: true });
    /* O conhecido-positivo, depois da imagem: um campo do contacto posto no formulário tem de ser visto. */
    await page.evaluate(() => document.querySelector('[data-sugestoes-nota]').insertAdjacentHTML('beforebegin', '<p class="sugestoes-campo"><label for="planta-contacto">Contacto</label><input id="planta-contacto" name="contacto" type="email"></p>'));
    const comPlanta = await page.evaluate(medir);
    const plantaVista = comPlanta.campos.includes('contacto') && comPlanta.campos_de_correio === 1;
    if (!plantaVista) problemas.push(`formulario/${lang}/${largura}: a leitura dos campos não viu o contacto plantado`);
    resultados.push({ ficheiro, tipo: 'pagina', rota: rotas.formulario[lang], lang, largura, medidas, nota_igual_a_declarada: medidas.nota === SUGESTOES.nota[lang], planta_do_contacto_vista: plantaVista, sha256: createHash('sha256').update(bytes).digest('hex') });
    await c.close();
    console.log(`S1-c: formulário, ${lang}, ${largura} px.`);
  }
  /* A QUINTA RECUSA DO MÉTODO, SEM IMAGEM: o texto rendido na lista das recusas, nas duas edições. */
  for (const lang of ['pt', 'en']) {
    const c = await contexto(1280);
    const page = await c.newPage();
    await page.goto(origem + rotas.metodo[lang], { waitUntil: 'networkidle' });
    const itens = await page.evaluate(() => [...document.querySelectorAll('.politica-recusas li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim()));
    const declarada = POLITICA.recusas.itens[4][lang];
    recusas[lang] = { rota: rotas.metodo[lang], recusas_rendidas: itens.length, quinta_igual_a_declarada: itens[4] === declarada, quinta: itens[4] ?? null };
    if (itens[4] !== declarada) problemas.push(`metodo/${lang}: a quinta recusa rendida não é a declarada`);
    await c.close();
  }
} finally {
  await navegador.close();
  servidor.close();
}
const manifesto = { bloco: 'S1-c', cabeca, construcao: { commit: versao.commit, ref: versao.ref, construido_em: versao.construido_em }, inicio, fim: new Date().toISOString(), larguras: LARGURAS, capturas: resultados.length, pedidos_recusados_para_fora: pedidosRecusados.length, problemas, resultados, recusa_do_metodo: recusas };
await fs.writeFile(`${pasta}/capturas-s1c.json`, JSON.stringify(manifesto, null, 2) + '\n');
console.log(`S1-c: ${resultados.length} capturas, ${problemas.length} problemas.`);
process.exitCode = problemas.length ? 1 : 0;
