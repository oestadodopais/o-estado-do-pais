#!/usr/bin/env node
/** Captura páginas nas duas edições e nas cinco larguras, presas à construção.
 * Uso: node scripts/leituras/captar.mjs <pedido.json> <pasta nova> [dist]
 * Pedido: {cabeca: "sha completo", paginas: [{nome: "pais", pt: "/", en: "/en/",
 *           recortes: [{nome: "cartao", seletor: "article"}]}]}.
 * Espera load, fontes e um quadro. Guarda PNG, medidas, erros e sha256 das
 * capturas e dos recursos servidos. Recusa outra cabeça, pedidos externos,
 * erros do navegador, rotas em falta e recortes ausentes ou duplicados.
 * Tema claro, movimento reduzido, escala 1; 390, 768, 1024, 1280 e 1600 px por omissão.
 * `larguras` permite a régua dos telefones; `medirMenu` acrescenta as caixas da H4 e do bloco inicial.
 * `toque` (G1, 21.10.2026), por página: o seletor de um gráfico em que se simula um toque (`pointerdown` e
 *   `pointerup` de tipo `touch` no centro dele) antes da captura; recusa a captura se nenhum ponto acender, e guarda
 *   nas medidas o `aria-label` do ponto aceso e o texto da etiqueta aberta.
 * Não altera dist/. Cada bloco acrescenta as suas réguas de conteúdo; estas
 * capturas comuns não substituem as células nem a leitura visual do bloco.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { medirMenu } from '../../design/especime-v3/medicoes/v2c-2026-10-19/medir-menu.mjs';

const [pedido, pastaDada, distDado = 'dist'] = process.argv.slice(2);
if (!pedido || !pastaDada) throw new Error('captar: faltam o pedido e a pasta de saída');
const dist = await fs.realpath(distDado), pasta = path.resolve(pastaDada);
const dentro = (p) => p === dist || p.startsWith(dist + path.sep);
if (dentro(pasta)) throw new Error('captar: a saída não pode ficar dentro da construção');
const config = JSON.parse(await fs.readFile(pedido, 'utf8'));
const sha = b => createHash('sha256').update(b).digest('hex');
const versao = await fs.readFile(path.join(dist, 'version.json'));
if (!/^[0-9a-f]{40}$/.test(config.cabeca ?? '') || JSON.parse(versao).commit !== config.cabeca) {
  throw new Error('captar: a cabeça pedida não é a de dist/version.json');
}
if (!Array.isArray(config.paginas) || !config.paginas.length) throw new Error('captar: faltam páginas');
const larguras = config.larguras ?? [390,768,1024,1280,1600];
if (!Array.isArray(larguras) || !larguras.length || new Set(larguras).size !== larguras.length || larguras.some(w => !Number.isInteger(w) || w < 320 || w > 1600)) throw new Error('captar: larguras inválidas');
const nomes = new Set();
for (const p of config.paginas) {
  if (!/^[a-z0-9-]+$/.test(p.nome) || nomes.has(p.nome)) throw new Error('captar: nome inválido ou repetido');
  nomes.add(p.nome);
  for (const l of ['pt','en']) if (typeof p[l] !== 'string' || !p[l].startsWith('/') || p[l].startsWith('//')) throw new Error('captar: cada página exige as duas rotas locais');
  const recortes = new Set();
  for (const r of p.recortes ?? []) {
    if (!/^[a-z0-9-]+$/.test(r.nome) || recortes.has(r.nome) || !r.seletor) throw new Error('captar: recorte inválido ou repetido');
    recortes.add(r.nome);
  }
}
await fs.mkdir(pasta); // Uma pasta anterior não se mistura com a prova nova.
const recursos = new Map([['version.json', sha(versao)]]), falhas = [], resultados = [];
const tipos = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webp':'image/webp'};
const servidor = http.createServer(async (req,res) => {
  try {
    let f = path.resolve(dist, '.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (!dentro(f)) throw new Error('fora da construção');
    if ((await fs.stat(f)).isDirectory()) f = path.join(f,'index.html');
    f = await fs.realpath(f);
    if (!dentro(f)) throw new Error('ligação fora da construção');
    const bytes = await fs.readFile(f), relativo = path.relative(dist,f);
    const atual = sha(bytes);
    if (recursos.has(relativo) && recursos.get(relativo) !== atual) falhas.push(`recurso alterado: ${relativo}`);
    recursos.set(relativo,atual);
    res.setHeader('Content-Type',tipos[path.extname(f)] ?? 'application/octet-stream'); res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
await new Promise((resolve,reject) => { servidor.once('error',reject); servidor.listen(0,'127.0.0.1',resolve); });
const origem = `http://127.0.0.1:${servidor.address().port}`;
let navegador;
try {
  navegador = await chromium.launch({headless:true});
  for (const p of config.paginas) for (const lingua of ['pt','en']) for (const largura of larguras) {
    const contexto = await navegador.newContext({viewport:{width:largura,height:900},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce'});
    const externos = [], erros = [], recusados = [];
    await contexto.route('**/*', r => {
      if (new URL(r.request().url()).origin === origem) return r.continue();
      externos.push(r.request().url()); return r.abort();
    });
    const pagina = await contexto.newPage();
    pagina.on('pageerror',e => erros.push(e.message.replaceAll(origem,'<origem-local>')));
    pagina.on('response',r => { if(r.status() >= 400) recusados.push(r.url().replaceAll(origem,'')); });
    const rota = p[lingua], prefixo = `${p.nome}-${lingua}-${largura}`;
    try {
      const resposta = await pagina.goto(origem+rota,{waitUntil:'load'});
      if (resposta?.status() !== 200) throw new Error(`${prefixo}: a página não respondeu a 200`);
      await pagina.evaluate(async () => { await document.fonts.ready; await new Promise(r => requestAnimationFrame(r)); });
      const medidas = await pagina.evaluate(() => ({janela:innerWidth,documento:document.documentElement.scrollWidth,corpo:document.body.scrollWidth,altura:document.documentElement.scrollHeight}));
      if (p.toque) {
        medidas.toque = await pagina.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return { encontrado: false };
          el.scrollIntoView({ block: 'center' });
          const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
          for (const tipo of ['pointerdown', 'pointerup']) el.dispatchEvent(new PointerEvent(tipo, { bubbles: true, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y }));
          const ativo = document.querySelector('[data-grafico-ponto][data-ativo]');
          const etiqueta = [...document.querySelectorAll('.grafico-etiqueta')].find((e) => !e.hidden);
          const caixa = etiqueta?.getBoundingClientRect();
          return { encontrado: true, ativo: ativo?.getAttribute('aria-label') ?? null, etiqueta: etiqueta?.textContent ?? null, etiquetaDentro: caixa ? caixa.left >= 0 && caixa.right <= document.documentElement.clientWidth : null };
        }, p.toque);
        if (!medidas.toque.ativo) throw new Error(`${prefixo}: o toque em ${p.toque} não acendeu ponto nenhum`);
      }
      if (config.medirMenu) {
        medidas.menu = await pagina.evaluate(medirMenu);
        medidas.discussao = await pagina.locator('[data-discussao-inicio]').boundingBox();
      }
      const ficheiro = prefixo+'.png';
      const bytes = await pagina.screenshot({path:path.join(pasta,ficheiro),fullPage:true,animations:'disabled'});
      const imagem = await sharp(bytes).metadata();
      const recortes = [];
      for (const r of p.recortes ?? []) {
        const alvo = pagina.locator(r.seletor);
        if (await alvo.count() !== 1) throw new Error(`${prefixo}: o recorte ${r.nome} não aparece uma vez`);
        const nome = prefixo+'-'+r.nome+'.png';
        // O recorte usa os píxeis da página completa, com a caixa medida
        // no documento, para permitir a conferência exata da sua origem.
        const caixa = await alvo.evaluate(el => {
          const r = el.getBoundingClientRect();
          const left = Math.floor(r.left + scrollX), top = Math.floor(r.top + scrollY);
          return {left,top,width:Math.ceil(r.right + scrollX)-left,height:Math.ceil(r.bottom + scrollY)-top};
        });
        if (caixa.left < 0 || caixa.top < 0 || caixa.width < 1 || caixa.height < 1 ||
            caixa.left + caixa.width > imagem.width || caixa.top + caixa.height > imagem.height) {
          throw new Error(`${prefixo}: o recorte ${r.nome} fica fora da imagem completa`);
        }
        const recorte = await sharp(bytes).extract(caixa).png().toBuffer();
        await fs.writeFile(path.join(pasta,nome),recorte);
        recortes.push({ficheiro:nome,seletor:r.seletor,origem:ficheiro,caixa,sha256:sha(recorte)});
      }
      resultados.push({ficheiro,rota,lingua,largura,...medidas,sha256:sha(bytes),recortes,externos,erros,recusados});
      if (externos.length || erros.length || recusados.length) falhas.push(`${prefixo}: pedidos externos, recursos em falta ou erros do navegador`);
    } finally { await contexto.close(); }
  }
} catch(e) { falhas.push(e.message.replaceAll(origem,'<origem-local>')); }
finally {
  await navegador?.close();
  await new Promise(r => servidor.close(r));
}
for (const [f,selo] of recursos) if (sha(await fs.readFile(path.join(dist,f))) !== selo) falhas.push(`recurso alterado: ${f}`);
const recibo = {cabeca:config.cabeca,capturador_sha256:sha(await fs.readFile(new URL(import.meta.url))),larguras,resultados,recursos:Object.fromEntries(recursos),falhas,ok:falhas.length===0};
await fs.writeFile(path.join(pasta,'capturas.json'),JSON.stringify(recibo,null,2)+'\n');
console.log(JSON.stringify({ok:recibo.ok,capturas:resultados.length,falhas}));
process.exitCode = recibo.ok ? 0 : 1;
