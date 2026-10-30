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
 * G1-c (21.10.2026): `toqueNoPrimeiro` toca o primeiro ponto; a etiqueta do `<svg>` mede-se também contra a caixa do
 *   `<svg>` (a recusa quando sai por um eixo); `desempate` toca entre dois meses vizinhos, mais perto do segundo em x
 *   por cinco centésimos de unidade do viewBox e à altura do primeiro, e recusa se não acender o segundo; `cartao`, o
 *   seletor da caixa de um cartão com série, toca (com o toque do navegador, que passa pelo teste de alvo) num ponto e
 *   fora dos pontos da mesma caixa, depois da captura, e guarda o que cada toque fez (a etiqueta e a navegação).
 * `conferirDossies`, por página, exige a régua e a planta da vírgula nas entradas dos dossiês.
 * Não altera dist/. Cada bloco acrescenta as suas réguas de conteúdo; estas
 * capturas comuns não substituem as células nem a leitura visual do bloco.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { conferirDisposicaoNovidades } from '../../tests/inicio/novidades-disposicao.mjs';
import { conferirDisposicaoDossies } from '../../tests/dossies/disposicao.mjs';
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
    const contexto = await navegador.newContext({viewport:{width:largura,height:900},deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce',hasTouch:Boolean(p.cartao)});
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
      if (p.conferirNovidades) medidas.novidades = await conferirDisposicaoNovidades(pagina);
      if (p.conferirDossies) medidas.dossies = await conferirDisposicaoDossies(pagina);
      if (p.toque && p.desempate) {
        medidas.desempate = await pagina.evaluate((sel) => {
          const el = document.querySelector(sel);
          el.scrollIntoView({ block: 'center' });
          const ps = [...el.querySelectorAll('[data-grafico-ponto]')].map((p) => ({ periodo: p.getAttribute('data-grafico-periodo'), cx: Number(p.querySelector('circle').getAttribute('cx')), cy: Number(p.querySelector('circle').getAttribute('cy')) }));
          let k = 0;
          for (let i = 1; i < ps.length - 1; i++) if (Math.abs(ps[i + 1].cy - ps[i].cy) > Math.abs(ps[k + 1].cy - ps[k].cy)) k = i;
          const [a, b] = [ps[k], ps[k + 1]];
          const vx = (a.cx + b.cx) / 2 + 0.05, vy = a.cy;
          const pt = new DOMPoint(vx, vy).matrixTransform(el.getScreenCTM());
          for (const tipo of ['pointerdown', 'pointerup']) el.dispatchEvent(new PointerEvent(tipo, { bubbles: true, pointerType: 'touch', isPrimary: true, clientX: pt.x, clientY: pt.y }));
          const ativo = el.querySelector('[data-grafico-ponto][data-ativo]')?.getAttribute('data-grafico-periodo') ?? null;
          return { primeiro: a, segundo: b, toqueNoViewBox: { x: Number(vx.toFixed(3)), y: vy }, dxAoPrimeiro: Number((vx - a.cx).toFixed(3)), dxAoSegundo: Number((b.cx - vx).toFixed(3)), dyAoPrimeiro: 0, dyAoSegundo: Number(Math.abs(b.cy - vy).toFixed(3)), ativoPeriodo: ativo, acendeuOSegundo: ativo === b.periodo };
        }, p.toque);
        if (!medidas.desempate.acendeuOSegundo) throw new Error(`${prefixo}: o desempate pelo y venceu um x mais perto`);
      }
      if (p.toque) {
        /* G1-b (21.10.2026, os achados 3 e 4 da leitura do Codex): o toque cai no centro do desenho, ou no ponto mais à
           direita (`toqueNoUltimo`); o registo guarda o período do ponto mais próximo do x do toque, conferido contra as
           posições dos círculos no `viewBox`, e o retângulo da etiqueta (a comum ou a do `<svg>`) contra a janela, nos
           dois eixos. */
        medidas.toque = await pagina.evaluate(({ sel, ultimo }) => {
          const el = document.querySelector(sel);
          if (!el) return { encontrado: false };
          el.scrollIntoView({ block: 'center' });
          const pontos = [...el.querySelectorAll('[data-grafico-ponto]')];
          const escolhido = ultimo === 'primeiro' ? pontos[0] : ultimo ? pontos.at(-1) : null;
          const alvo = escolhido ? (escolhido.querySelector('circle') ?? escolhido) : el;
          const r = alvo.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
          for (const tipo of ['pointerdown', 'pointerup']) el.dispatchEvent(new PointerEvent(tipo, { bubbles: true, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y }));
          const ativo = document.querySelector('[data-grafico-ponto][data-ativo]');
          let geometria = null;
          if (el instanceof SVGSVGElement) {
            const pt = new DOMPoint(x, y).matrixTransform(el.getScreenCTM().inverse());
            const cs = pontos.map((p) => ({ periodo: p.getAttribute('data-grafico-periodo'), cx: Number(p.querySelector('circle')?.getAttribute('cx')) }));
            const perto = cs.reduce((a, b) => (Math.abs(b.cx - pt.x) < Math.abs(a.cx - pt.x) ? b : a));
            const ativoPeriodo = ativo?.getAttribute('data-grafico-periodo') ?? null;
            geometria = { xDoToqueNoViewBox: Number(pt.x.toFixed(3)), maisProximo: perto, ativoPeriodo, bate: perto.periodo === ativoPeriodo };
          }
          const comum = [...document.querySelectorAll('.grafico-etiqueta')].find((e) => !e.hidden);
          const daSvg = ativo?.querySelector('text');
          const caixa = (comum ?? daSvg)?.getBoundingClientRect();
          const W = document.documentElement.clientWidth, H = document.documentElement.clientHeight;
          const sv = !comum && daSvg ? daSvg.ownerSVGElement.getBoundingClientRect() : null;
          const dentroDoSvg = sv ? {
            horizontal: caixa.left >= sv.left - 0.5 && caixa.right <= sv.right + 0.5,
            vertical: caixa.top >= sv.top - 0.5 && caixa.bottom <= sv.bottom + 0.5,
            svg: { left: Number(sv.left.toFixed(2)), right: Number(sv.right.toFixed(2)), top: Number(sv.top.toFixed(2)), bottom: Number(sv.bottom.toFixed(2)) },
            transform: daSvg.getAttribute('transform'),
          } : null;
          const etiquetaDentro = caixa ? {
            dentroDoSvg,
            forma: comum ? 'comum' : 'svg',
            horizontal: caixa.left >= 0 && caixa.right <= W,
            vertical: caixa.top >= 0 && caixa.bottom <= H,
            caixa: { left: Number(caixa.left.toFixed(2)), right: Number(caixa.right.toFixed(2)), top: Number(caixa.top.toFixed(2)), bottom: Number(caixa.bottom.toFixed(2)) },
            janela: { largura: W, altura: H },
          } : null;
          return { encontrado: true, ultimo: Boolean(ultimo), ativo: ativo?.getAttribute('aria-label') ?? null, etiqueta: (comum ?? daSvg)?.textContent ?? null, etiquetaDentro, geometria };
        }, { sel: p.toque, ultimo: p.toqueNoPrimeiro ? 'primeiro' : Boolean(p.toqueNoUltimo) });
        const ds = medidas.toque.etiquetaDentro?.dentroDoSvg;
        if (ds && (!ds.horizontal || !ds.vertical)) throw new Error(`${prefixo}: a etiqueta do toque em ${p.toque} sai do <svg>`);
        if (medidas.toque.encontrado && (!medidas.toque.etiquetaDentro?.horizontal || !medidas.toque.etiquetaDentro?.vertical)) throw new Error(`${prefixo}: a etiqueta do toque em ${p.toque} sai da janela`);
        if (medidas.toque.geometria && !medidas.toque.geometria.bate) throw new Error(`${prefixo}: o ponto aceso não é o mais próximo do x do toque`);
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
      if (p.cartao) {
        /* Os dois toques no cartão, com o toque do navegador (o teste de alvo decide quem o recebe). */
        const caixaDoCartao = pagina.locator(p.cartao).first();
        await caixaDoCartao.scrollIntoViewIfNeeded();
        const alvos = await caixaDoCartao.evaluate((c) => {
          const z = [...c.querySelectorAll('[data-grafico-ponto] rect')].at(-1).getBoundingClientRect();
          const s = c.querySelector('svg').getBoundingClientRect();
          return { ponto: { x: z.left + z.width / 2, y: z.top + z.height / 2 }, fora: { x: s.left + 4, y: s.top + s.height / 2 } };
        });
        const antes = pagina.url();
        await pagina.touchscreen.tap(alvos.ponto.x, alvos.ponto.y);
        await pagina.waitForTimeout(300);
        const noPonto = await caixaDoCartao.evaluate((c) => { const a = c.querySelector('[data-grafico-ponto][data-ativo]'); return { ativo: a?.getAttribute('aria-label') ?? null, etiqueta: a?.querySelector('text')?.textContent ?? null }; });
        noPonto.navegou = pagina.url() !== antes;
        noPonto.toque = alvos.ponto;
        const quem = await pagina.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y); return e ? `${e.tagName.toLowerCase()}${e.getAttribute('class') ? '.' + e.getAttribute('class').split(' ')[0] : ''}` : null; }, alvos.fora);
        await Promise.all([pagina.waitForLoadState('load').catch(() => null), pagina.touchscreen.tap(alvos.fora.x, alvos.fora.y)]);
        await pagina.waitForTimeout(800);
        const fora = { toque: alvos.fora, alvoDoToque: quem, navegou: pagina.url() !== antes, destino: pagina.url().replace(origem, '') };
        medidas.cartao = { seletor: p.cartao, rota: antes.replace(origem, ''), noPonto, fora };
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
