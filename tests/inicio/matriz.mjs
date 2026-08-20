#!/usr/bin/env node
/**
 * A MATRIZ DE ACEITAÇÃO DA PRIMEIRA PÁGINA (plano §13).
 *
 * NÃO é um portão: não entra no `npm run build` e não falha nada por si. Corre
 * sobre `dist/` num Chromium sem cabeça e imprime UMA LINHA POR CÉLULA, com
 * «passa» ou «falha» e a prova ao lado. O que ele mede é o que a v2 nunca teve
 * de medir, porque a v2 não tinha estado: teclado, foco, anúncio, história,
 * recarga, edição, tema, largura, movimento reduzido, valores inválidos, e a
 * rendição sem JavaScript.
 *
 *   node tests/inicio/matriz.mjs             imprime a matriz
 *   node tests/inicio/matriz.mjs --json <f>  guarda também os despejos de texto
 *   node tests/inicio/matriz.mjs --capturas <dir>   guarda as capturas
 *
 * O servidor é o mesmo padrão de `scripts/medir-tipos.mjs`: um servidor de
 * ficheiros estáticos sobre `dist/`, na porta que o sistema der.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(RAIZ, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.csv': 'text/csv',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO_JSON = opcao('--json');
const DIR_CAPTURAS = opcao('--capturas');

if (!fs.existsSync(DIST)) {
  console.error('não existe dist/. Corra o build primeiro.');
  process.exit(2);
}

const servidor = http.createServer((req, res) => {
  const semQuery = req.url.split('?')[0];
  let ficheiro;
  try {
    ficheiro = path.resolve(DIST, '.' + decodeURIComponent(semQuery));
  } catch {
    ficheiro = path.resolve(DIST, '.' + semQuery);
  }
  if (!ficheiro.startsWith(DIST)) return void res.writeHead(403).end();
  if (fs.existsSync(ficheiro) && fs.statSync(ficheiro).isDirectory()) {
    ficheiro = path.join(ficheiro, 'index.html');
  }
  if (!fs.existsSync(ficheiro)) return void res.writeHead(404).end('404');
  res.writeHead(200, { 'content-type': MIME[path.extname(ficheiro)] ?? 'application/octet-stream' });
  fs.createReadStream(ficheiro).pipe(res);
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}`;

const navegador = await chromium.launch({ headless: true });
const celulas = [];
const despejos = {};
const conta = (nome, passa, prova) => celulas.push({ nome, passa: !!passa, prova: String(prova) });

/** Uma página nova, com as opções do contexto que a célula pede. */
async function pagina({ largura = 1280, js = true, tema = null, movimento = null } = {}) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    javaScriptEnabled: js,
    reducedMotion: movimento === 'reduce' ? 'reduce' : 'no-preference',
    colorScheme: tema === 'escuro' ? 'dark' : 'light',
  });
  const p = await contexto.newPage();
  p.__contexto = contexto;
  if (tema) {
    await contexto.addInitScript((t) => {
      document.addEventListener('DOMContentLoaded', () =>
        document.documentElement.setAttribute('data-theme', t === 'escuro' ? 'dark' : 'light'),
      );
    }, tema);
  }
  return p;
}

const estadoDaPagina = (p) =>
  p.evaluate(() => {
    const raiz = document.querySelector('[data-inicio]');
    const bloco = document.querySelector('[data-cabeca]:not([hidden])');
    const painel = document.querySelector('[data-painel]:not([hidden])');
    return {
      ambito: raiz?.getAttribute('data-ambito') ?? null,
      densidade: raiz?.getAttribute('data-densidade') ?? null,
      modo: raiz?.getAttribute('data-modo') ?? null,
      bloco: bloco?.getAttribute('data-cabeca') ?? null,
      painel: painel?.getAttribute('data-painel') ?? null,
      h1: document.querySelector('[data-cabeca]:not([hidden]) h1')?.textContent.trim() ?? null,
      anuncio: document.querySelector('[data-anuncio]')?.textContent.trim() ?? '',
      url: location.pathname + location.search,
      abertas: [...document.querySelectorAll('[data-painel]:not([hidden]) .peca-mais')].filter(
        (d) => d.open,
      ).length,
      pecas: document.querySelectorAll('[data-painel]:not([hidden]) .peca').length,
      focado: document.activeElement
        ? document.activeElement.getAttribute('data-modo') ??
          document.activeElement.getAttribute('data-densidade') ??
          document.activeElement.getAttribute('data-regiao') ??
          document.activeElement.getAttribute('data-escolher') ??
          document.activeElement.tagName
        : null,
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      /* O despejo de texto exclui `script` e `style`, como todas as réguas
         desta casa: a ilha de dados do instrumento é JSON, e não é texto que o
         leitor veja. Sem esta exclusão, o despejo trazia os ids das linhas. */
      texto: [...document.querySelectorAll('body *')]
        .filter(
          (e) =>
            !e.closest('[hidden]') &&
            e.children.length === 0 &&
            !e.matches('script, style, template'),
        )
        .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n'),
    };
  });

/* ------------------------------------------------------- 1. estados, teclado, foco */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const inicial = await estadoDaPagina(p);
  conta('estado inicial · País · Relance', inicial.ambito === 'pais' && inicial.densidade === 'relance', `${inicial.ambito} · ${inicial.densidade} · ${inicial.pecas} peças`);
  conta('manchete do País', /limiares europeus/.test(inicial.h1 ?? ''), inicial.h1);

  /* Ordem do teclado: da linha de comando até às portas, sem saltos para trás. */
  const ordem = await p.evaluate(() => {
    const alvos = [...document.querySelectorAll('a[href],button,summary,input,[tabindex]')].filter(
      (e) => !e.closest('[hidden]') && e.offsetParent !== null,
    );
    const marco = (sel) => alvos.findIndex((e) => e.matches(sel) || e.closest(sel));
    return {
      comando: marco('[data-comando]'),
      painel: marco('[data-painel]:not([hidden])'),
      portas: marco('.portas'),
      total: alvos.length,
    };
  });
  conta(
    'ordem do teclado · comando → painel → portas',
    ordem.comando >= 0 && ordem.comando < ordem.painel && ordem.painel < ordem.portas,
    `comando ${ordem.comando} · painel ${ordem.painel} · portas ${ordem.portas} · ${ordem.total} paragens`,
  );

  /* Cinco mudanças de estado, cada uma com foco e anúncio. */
  const passos = [
    ['[data-densidade="leitura"]', 'densidade → leitura'],
    ['[data-modo="regiao"]', 'âmbito → modo região'],
    ['[data-regiao="alentejo"]', 'região → Alentejo'],
    ['[data-modo="municipio"]', 'âmbito → modo município'],
    ['[data-escolher="evora"]', 'concelho → Évora'],
  ];
  const historia = [];
  for (const [sel, nome] of passos) {
    await p.click(sel);
    const e = await estadoDaPagina(p);
    historia.push(e);
    conta(`mudança · ${nome}`, true, `${e.url} · ${e.bloco}`);
    conta(`foco volta ao comando · ${nome}`, e.focado !== null && e.focado !== 'BODY', e.focado);
    conta(`região viva diz a mudança · ${nome}`, e.anuncio.length > 0, e.anuncio);
    despejos[`estado:${e.url}`] = e.texto;
  }

  conta('âmbito Alentejo · painel de uma peça', historia[2].painel === 'regiao:alentejo' && historia[2].pecas === 1, `${historia[2].painel} · ${historia[2].pecas} peça`);
  conta('âmbito Évora · painel de oito peças', historia[4].painel === 'municipio:evora' && historia[4].pecas === 8, `${historia[4].painel} · ${historia[4].pecas} peças`);

  /* Andar para trás cinco vezes e para a frente outra vez. */
  let ok = true;
  for (let i = historia.length - 2; i >= 0; i--) {
    await p.goBack();
    const e = await estadoDaPagina(p);
    if (e.url !== historia[i].url || e.bloco !== historia[i].bloco) ok = false;
  }
  conta('para trás, cinco vezes', ok, ok ? 'cada passo repôs o seu estado' : 'um passo não repôs');
  await p.goForward();
  const depoisDaFrente = await estadoDaPagina(p);
  conta('para a frente', depoisDaFrente.url === historia[1].url, depoisDaFrente.url);

  /* Recarga em cada estado. */
  let recargaOk = true;
  const recargas = [];
  for (const e of historia) {
    await p.goto(base + e.url, { waitUntil: 'networkidle' });
    const r = await estadoDaPagina(p);
    recargas.push(`${e.url} → ${r.bloco}`);
    if (r.bloco !== e.bloco || r.densidade !== e.densidade) recargaOk = false;
  }
  conta('recarga em cada estado', recargaOk, recargas.join(' · '));

  /* A peça abre-se sozinha, e o comando global não apaga a escolha das outras. */
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  await p.click('.peca:first-child .peca-abrir');
  const uma = await estadoDaPagina(p);
  conta('uma peça abre só a sua', uma.abertas === 1, `${uma.abertas} abertas`);
  await p.click('[data-densidade="leitura"]');
  const todas = await estadoDaPagina(p);
  conta('o comando global abre todas', todas.abertas === todas.pecas, `${todas.abertas} de ${todas.pecas}`);

  await p.__contexto.close();
}

/* ------------------------------------------------------------ 2. valores inválidos */
{
  const p = await pagina();
  const maus = [
    ['?ambito=lisboa', 'ambito=lisboa'],
    ['?densidade=fundo', 'densidade=fundo'],
    ['?ambito=municipio:evora;alert(1)', 'ambito com injecção'],
    [`?ambito=${'a'.repeat(2000)}`, 'ambito de 2 000 caracteres'],
    ['?ambito=regiao:atlantida', 'região que não existe'],
  ];
  for (const [q, nome] of maus) {
    await p.goto(`${base}/${q}`, { waitUntil: 'networkidle' });
    const e = await estadoDaPagina(p);
    /* «Sem texto de erro» mede-se contra o VALOR: a página não pode repetir o
       que veio no endereço. Procurar a palavra «erro» daria falso positivo, que
       a porta de correcções («Encontrou um erro») já garante em todas as
       páginas do sítio. */
    const bruto = decodeURIComponent(q.split('=').slice(1).join('='));
    /* A comparação é sensível à caixa, e é de propósito: o valor do endereço
       vem em caixa baixa («lisboa») e a página escreve os nomes próprios em
       caixa alta («Grande Lisboa», que o instrumento da convergência mostra).
       Comparar sem caixa dava um falso positivo por uma palavra que a página
       tem por outra razão. O que se mede é o ECO do valor tal como veio. */
    const semEco = !e.texto.includes(bruto);
    const passa = e.ambito === 'pais' && e.densidade === 'relance' && e.url === '/' && semEco;
    conta(
      `valor inválido · ${nome}`,
      passa,
      passa
        ? `caiu em ${e.ambito}/${e.densidade}, endereço normalizado para "${e.url}", e o valor não é ecoado na página`
        : `âmbito ${e.ambito} · densidade ${e.densidade} · endereço "${e.url}" · valor ecoado: ${!semEco}`,
    );
  }
  await p.__contexto.close();
}

/* ----------------------------------------------------- 3. edições e troca de idioma */
{
  for (const [rota, edicao] of [['/', 'pt'], ['/en', 'en']]) {
    const p = await pagina();
    await p.goto(`${base}${rota}?ambito=regiao:alentejo&densidade=leitura`, { waitUntil: 'networkidle' });
    const e = await estadoDaPagina(p);
    conta(`edição ${edicao} · estado do endereço`, e.ambito === 'regiao:alentejo' && e.densidade === 'leitura', `${e.ambito} · ${e.densidade}`);
    const href = await p.evaluate(() => document.querySelector('a.lang')?.getAttribute('href') ?? '');
    conta(
      `edição ${edicao} · a ligação de idioma leva o estado`,
      href.includes('ambito=regiao%3Aalentejo') || href.includes('ambito=regiao:alentejo'),
      href,
    );
    despejos[`edicao:${edicao}`] = e.texto;
    await p.__contexto.close();
  }
}

/* ---------------------------------------------------- 4. larguras, temas, movimento */
{
  for (const largura of [320, 390, 768, 1280]) {
    const p = await pagina({ largura });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const e = await estadoDaPagina(p);
    conta(`largura ${largura} · sem transbordo horizontal`, e.transbordo <= 0, `scrollWidth − clientWidth = ${e.transbordo}`);
    if (DIR_CAPTURAS) {
      fs.mkdirSync(DIR_CAPTURAS, { recursive: true });
      await p.screenshot({ path: path.join(DIR_CAPTURAS, `inicio-${largura}-pt-claro.png`), fullPage: true });
    }
    await p.__contexto.close();
  }
  for (const tema of ['claro', 'escuro']) {
    const p = await pagina({ tema });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const cores = await p.evaluate(() => {
      const c = getComputedStyle(document.body);
      const sq = document.querySelector('.sq-fora');
      return {
        papel: c.backgroundColor,
        tinta: c.color,
        marcador: sq ? getComputedStyle(sq).backgroundColor : null,
        contorno: sq ? getComputedStyle(sq).borderTopColor : null,
      };
    });
    conta(`tema ${tema} · papel e tinta`, cores.papel !== cores.tinta, `papel ${cores.papel} · tinta ${cores.tinta}`);
    conta(`tema ${tema} · o contorno do marcador é a tinta do tema`, cores.contorno === cores.tinta, `contorno ${cores.contorno}`);
    await p.__contexto.close();
  }
  {
    const p = await pagina({ movimento: 'reduce' });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const t = await p.evaluate(() => {
      const peca = document.querySelector('.peca');
      return peca ? getComputedStyle(peca).transitionDuration : null;
    });
    /* O Chromium sem cabeça, com o movimento reduzido emulado, escreve
       `1e-05s` em vez de `0s`: a duração é a que o motor força, e o que se mede
       é que nenhuma transição sobrevive. */
    const segundos = parseFloat(t);
    conta(
      'movimento reduzido · a peça não tem transição',
      Number.isFinite(segundos) && segundos <= 0.001,
      `transition-duration ${t}`,
    );
    await p.__contexto.close();
  }
}

/* --------------------------------------------------------- 5. o selo, alvo e aninho */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const selos = await p.evaluate(() => {
    const out = [];
    for (const a of document.querySelectorAll('.peca a.src-chip')) {
      const antes = getComputedStyle(a, '::after');
      const r = a.getBoundingClientRect();
      /* A área de toque vem de um `::after` posicionado e centrado no elemento.
         Mede-se a caixa do elemento e a da área, e fica a maior das duas. */
      const larguraArea = Math.max(r.width, parseFloat(antes.width) || 0, parseFloat(antes.minWidth) || 0);
      const alturaArea = Math.max(r.height, parseFloat(antes.height) || 0);
      let aninhado = null;
      for (let no = a.parentElement; no; no = no.parentElement) {
        const t = no.tagName.toLowerCase();
        if (t === 'a' || t === 'button' || t === 'summary') {
          aninhado = t;
          break;
        }
      }
      out.push({ w: +larguraArea.toFixed(1), h: +alturaArea.toFixed(1), aninhado });
    }
    return out;
  });
  const com44 = selos.filter((s) => s.w >= 44 && s.h >= 44).length;
  const aninhados = selos.filter((s) => s.aninhado).length;
  conta(
    'o selo de cada peça é alvo de 44×44',
    selos.length > 0 && com44 === selos.length,
    `${com44} de ${selos.length} selos de peça · mínimo ${Math.min(...selos.map((s) => s.w))}×${Math.min(...selos.map((s) => s.h))}`,
  );
  conta('nenhum selo dentro de outro alvo', aninhados === 0, `${aninhados} aninhados em ${selos.length}`);

  /* Duas áreas de toque sobrepostas não são um alvo maior: são uma porta que
     abre a linha do vizinho (medição da etapa 1d, ISSUES I13). */
  const sobrepostos = await p.evaluate(() => {
    const caixa = (e) => {
      const r = e.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const w = Math.max(r.width, e.matches('a.src-chip') ? 160 : 44);
      const h = Math.max(r.height, 44);
      return { x1: cx - w / 2, x2: cx + w / 2, y1: cy - h / 2, y2: cy + h / 2 };
    };
    let pares = 0;
    for (const peca of document.querySelectorAll('[data-painel]:not([hidden]) .peca')) {
      const alvos = [...peca.querySelectorAll('a,button,summary')].map(caixa);
      for (let i = 0; i < alvos.length; i++) {
        for (let j = i + 1; j < alvos.length; j++) {
          const a = alvos[i];
          const b = alvos[j];
          if (a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2) pares++;
        }
      }
    }
    return pares;
  });
  conta('nenhum par de áreas de toque sobrepostas na peça', sobrepostos === 0, `${sobrepostos} pares`);

  const maiorDaFila = await p.evaluate(() => {
    const peca = document.querySelector('.peca');
    if (!peca) return null;
    const selo = peca.querySelector('a.src-chip');
    const outros = [...peca.querySelectorAll('a,button,summary')].filter((e) => e !== selo);
    /* A área de um alvo, e para o selo é a do `::after` que a folha lhe dá: é
       ele que apanha o toque, e não a caixa da unidade em linha. */
    const area = (e) => {
      const r = e.getBoundingClientRect();
      const depois = e.matches('a.src-chip') ? getComputedStyle(e, '::after') : null;
      const w = Math.max(r.width, depois ? parseFloat(depois.minWidth) || 0 : 0, 44);
      const h = Math.max(r.height, depois ? parseFloat(depois.height) || 0 : 0, 44);
      return w * h;
    };
    const aSelo = selo ? area(selo) : 0;
    return { selo: Math.round(aSelo), maiorOutro: Math.round(Math.max(0, ...outros.map(area))) };
  });
  conta(
    'o selo é o maior alvo da peça',
    maiorDaFila && maiorDaFila.selo >= maiorDaFila.maiorOutro,
    `selo ${maiorDaFila?.selo}px² · maior outro ${maiorDaFila?.maiorOutro}px²`,
  );
  await p.__contexto.close();
}

/* ------------------------------------------------------------- 6. sem JavaScript */
{
  for (const q of ['/', '/?ambito=regiao:alentejo', '/?ambito=municipio:beja', '/?densidade=leitura']) {
    const p = await pagina({ js: false });
    await p.goto(base + q, { waitUntil: 'load' });
    const e = await p.evaluate(() => ({
      bloco: document.querySelector('[data-cabeca]:not([hidden])')?.getAttribute('data-cabeca') ?? null,
      painel: document.querySelector('[data-painel]:not([hidden])')?.getAttribute('data-painel') ?? null,
      pecas: document.querySelectorAll('[data-painel]:not([hidden]) .peca').length,
      valores: document.querySelectorAll('[data-painel]:not([hidden]) [data-claim]').length,
      selos: document.querySelectorAll('[data-painel]:not([hidden]) a.src-chip').length,
      ligacoes: [...document.querySelectorAll('[data-comando] a')].map((a) => a.getAttribute('href')),
      nota: document.querySelector('[data-sem-js]')?.hidden === false,
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    const completo = e.bloco === 'pais' && e.painel === 'pais' && e.pecas === 8 && e.selos >= 8;
    conta(
      `sem JavaScript · ${q}`,
      completo && e.ligacoes.every(Boolean) && e.transbordo <= 0,
      q === '/'
        ? `completo e correcto: ${e.pecas} peças, ${e.valores} valores, ${e.selos} selos`
        : `mostra o defeito (${e.bloco}), com os comandos como ligações que abrem: ${e.ligacoes.join(' · ')}`,
    );
    conta(`sem JavaScript · a nota da densidade está à vista · ${q}`, e.nota, `nota visível: ${e.nota}`);
    await p.__contexto.close();
  }
}

/* --------------------------------------------------------------------- relatório */
await navegador.close();
servidor.close();

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(FICHEIRO_JSON, JSON.stringify({ celulas, despejos }, null, 2));
}

console.log('');
console.log(cinza(`  matriz de aceitação · ${celulas.length} células`));
console.log('');
let falhas = 0;
for (const c of celulas) {
  if (!c.passa) falhas++;
  console.log(`  ${c.passa ? verde('passa') : vermelho('falha')}  ${c.nome}`);
  console.log(cinza(`         ${c.prova}`));
}
console.log('');
console.log(
  falhas === 0
    ? verde(`  ${celulas.length} de ${celulas.length} células passam.`)
    : vermelho(`  ${falhas} de ${celulas.length} células falham.`),
);
console.log('');
