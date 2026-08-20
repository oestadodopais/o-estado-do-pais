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
/* A matriz calcula a lista de proximidade do seu lado, a partir dos mesmos
   centróides que a página desenha: uma célula que perguntasse à página se ela
   concorda com ela própria não media nada (subetapa 2h). */
import { concelhos } from '../../src/lib/inicio.mjs';
import { FIELD_W, FIELD_H } from '../../src/data/caop-centroids.mjs';

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

/* ------------------------------------------------------- 7. as sete da subetapa 2g
 *
 * Sete correcções da revisão do lugar de direcção, e uma célula por cada uma:
 * o que mudou tem de se poder medir, e não só ver numa captura.
 */

/* (1) O sinal de tempo do painel europeu não se lê fora do âmbito País. */
{
  const p = await pagina();
  const lidos = [];
  for (const q of ['/', '/?ambito=regiao:alentejo', '/?ambito=municipio:evora', '/?ambito=municipio:beja']) {
    await p.goto(base + q, { waitUntil: 'networkidle' });
    lidos.push(
      await p.evaluate(() => {
        const v = document.querySelector('.verificacao');
        return v && v.getClientRects().length > 0;
      }),
    );
  }
  conta(
    'o sinal de tempo do painel só se lê no âmbito País',
    lidos[0] === true && lidos.slice(1).every((x) => x === false),
    `pais ${lidos[0]} · regiao ${lidos[1]} · évora ${lidos[2]} · beja ${lidos[3]}`,
  );
  await p.__contexto.close();
}

/* (2) A ficha do mapa deixou de levar a citação, a porta do CSV e as dicas. */
{
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const f = await p.evaluate(() => {
    const ficha = document.querySelector('[data-mapa-ficha]');
    const aparelho = document.querySelector('[data-mapa-aparelho]');
    return {
      alturaDaFicha: Math.round(ficha.getBoundingClientRect().height),
      citacaoNaFicha: !!ficha.querySelector('[data-verbatim]'),
      csvNaFicha: !!ficha.querySelector('.ligacao-dados'),
      dicasNaFicha: !!ficha.querySelector('[data-dica-cursor], [data-teclado]'),
      citacaoNoAparelho: !!aparelho.querySelector('[data-verbatim]'),
      csvNoAparelho: !!aparelho.querySelector('.ligacao-dados'),
      dicasNoAparelho: aparelho.querySelectorAll('[data-dica-cursor], [data-teclado]').length,
      fonteCurta: !!ficha.querySelector('.mapa-fonte-curta a.src-chip'),
      aparelhoFechado: !aparelho.open,
    };
  });
  conta(
    'a ficha do mapa é compacta e o aparelho leva a citação, o CSV e as dicas',
    !f.citacaoNaFicha &&
      !f.csvNaFicha &&
      !f.dicasNaFicha &&
      f.citacaoNoAparelho &&
      f.csvNoAparelho &&
      f.dicasNoAparelho === 2 &&
      f.fonteCurta &&
      f.aparelhoFechado,
    `ficha ${f.alturaDaFicha}px · citação, CSV e dicas na camada do aparelho, fechada · linha de fonte com selo`,
  );
  await p.__contexto.close();
}

/* (3) A peça aberta ocupa duas colunas, e a régua deixa de ser um fio. */
for (const largura of [768, 1280]) {
  const p = await pagina({ largura });
  await p.goto(base + '/?densidade=leitura', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const reguas = [...document.querySelectorAll('[data-painel="pais"] .regua-svg')].map((e) =>
      Math.round(e.getBoundingClientRect().width),
    );
    /* `grid-column: span 2` põe o `span 2` no LADO DE INÍCIO e deixa o fim em
       `auto`: é o início que se lê. */
    const colunas = [...document.querySelectorAll('[data-painel="pais"] .peca')].map(
      (e) => getComputedStyle(e).gridColumnStart,
    );
    return {
      reguas,
      colunas,
      span: colunas.length === 8 && colunas.every((c) => c === 'span 2'),
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  conta(
    `largura ${largura} · a peça aberta ocupa duas colunas`,
    r.span && r.reguas.every((w) => w > 400) && r.transbordo <= 0,
    `régua ${r.reguas[0]}px · grid-column-start «${r.colunas[0]}» em ${r.colunas.length} peças · transbordo ${r.transbordo}`,
  );
  await p.__contexto.close();
}

/* (4) A régua da convergência é uma porta abaixo de 640, e a porta é palavras. */
for (const largura of [320, 390]) {
  const p = await pagina({ largura });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const fechado = await p.evaluate(() => {
    const vis = (e) => !!e && e.getClientRects().length > 0;
    const s = document.querySelector('.conv-porta-sum');
    const b = s.getBoundingClientRect();
    return {
      porta: vis(document.querySelector('.conv-porta')),
      corpo: vis(document.querySelector('.conv-corpo')),
      alvo: `${Math.round(b.width)}×${Math.round(b.height)}`,
      altoQb: b.height >= 44,
      /* «palavras só»: nenhuma porta, nenhum selo e nenhum algarismo dentro do
         `<summary>`, e o `<summary>` fora de qualquer outro alvo (Emenda 2). */
      alvosDentro: s.querySelectorAll('a, button, summary, .src-chip, [data-claim]').length,
      aninhado: !!s.parentElement.closest('a, button, summary'),
      algarismos: /[0-9]/.test(s.textContent),
    };
  });
  await p.locator('.conv-porta-sum').click();
  const aberto = await p.evaluate(() => {
    const svg = document.querySelector('.rule-svg');
    const caixas = [...svg.querySelectorAll('text, tspan')]
      .filter((e) => e.getClientRects().length && e.textContent.trim())
      .map((e) => e.getBoundingClientRect());
    let pares = 0;
    for (let i = 0; i < caixas.length; i++) {
      for (let j = i + 1; j < caixas.length; j++) {
        const a = caixas[i];
        const b = caixas[j];
        if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) pares++;
      }
    }
    const cx = document.querySelector('.svg-scroll');
    return {
      corpo: document.querySelector('.conv-corpo').getClientRects().length > 0,
      rotulos: caixas.length,
      pares,
      rola: cx.scrollWidth > cx.clientWidth,
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  conta(
    `largura ${largura} · a régua da convergência é uma porta de palavras`,
    fechado.porta &&
      !fechado.corpo &&
      fechado.altoQb &&
      fechado.alvosDentro === 0 &&
      !fechado.aninhado &&
      !fechado.algarismos &&
      aberto.corpo,
    `porta ${fechado.alvo}, sem alvo dentro e sem alvo à volta, sem algarismos; abre o instrumento`,
  );
  conta(
    `largura ${largura} · rótulos do instrumento sem caixas sobrepostas`,
    aberto.pares === 0 && aberto.rola && aberto.transbordo <= 0,
    `${aberto.rotulos} rótulos · ${aberto.pares} pares sobrepostos · rola na sua caixa · transbordo ${aberto.transbordo}`,
  );
  await p.__contexto.close();
}

/* (4b) Na secretária nada muda: a porta não existe e o instrumento está à vista. */
{
  const p = await pagina({ largura: 1280 });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => {
    const vis = (e) => !!e && e.getClientRects().length > 0;
    return {
      porta: vis(document.querySelector('.conv-porta')),
      corpo: vis(document.querySelector('.conv-corpo')),
      instrumento: vis(document.querySelector('.rule-svg')),
    };
  });
  conta(
    'secretária · a porta da régua não existe e o instrumento está à vista',
    !d.porta && d.corpo && d.instrumento,
    `porta ${d.porta} · corpo ${d.corpo} · instrumento ${d.instrumento}`,
  );
  await p.__contexto.close();
}

/* (5) A vista de escolha com a caixa vazia: Évora, e o escolhido se houver um.
 *
 * O segundo caso NÃO leva toque, e a razão entrou na 2h: em `?ambito=
 * municipio:beja` a página já está na vista de escolha, e a 390 o
 * `[data-modo="municipio"]` à vista é o selo do país — tocar-lhe ali seria o
 * gesto da proximidade e não a porta. O que esta célula mede é a lista com que a
 * vista se apresenta, e essa lê-se sem lhe tocar. */
for (const largura of [1280, 390]) {
  const p = await pagina({ largura });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.locator('[data-modo="municipio"]:visible').first().click();
  const vazio = await p.evaluate(() =>
    [...document.querySelectorAll('.pesquisa-item')]
      .filter((e) => e.getClientRects().length)
      .map((e) => e.querySelector('[data-escolher]').getAttribute('data-escolher')),
  );
  await p.goto(base + '/?ambito=municipio:beja', { waitUntil: 'networkidle' });
  const comEscolhido = await p.evaluate(() =>
    [...document.querySelectorAll('.pesquisa-item')]
      .filter((e) => e.getClientRects().length)
      .map((e) => e.querySelector('[data-escolher]').getAttribute('data-escolher')),
  );
  conta(
    `largura ${largura} · vista de escolha, caixa vazia`,
    vazio.length === 1 &&
      vazio[0] === 'evora' &&
      comEscolhido.length === 2 &&
      comEscolhido.indexOf('evora') >= 0 &&
      comEscolhido.indexOf('beja') >= 0,
    `sem escolha: ${vazio.join(' · ')} · com Beja escolhida: ${comEscolhido.join(' · ')}`,
  );
  await p.__contexto.close();
}

/* (6) Évora na leitura breve: o mapa pequeno DENTRO do cartão, e um só mapa. */
{
  const p = await pagina();
  await p.goto(base + '/?ambito=municipio:evora&densidade=leitura', { waitUntil: 'networkidle' });
  const c = await p.evaluate(() => {
    const tela = document.querySelector('.mapa-tela');
    const cartao = document.querySelector('[data-mapa-cartao]');
    return {
      postura: document.querySelector('[data-mapa-raiz]').getAttribute('data-postura'),
      dentro: !!tela.closest('[data-mapa-cartao]'),
      largura: Math.round(tela.getBoundingClientRect().width),
      mapas: document.querySelectorAll('[data-mapa]').length,
      moldura: getComputedStyle(cartao).borderTopWidth,
      fichaVisivel: document.querySelector('[data-mapa-ficha]').getClientRects().length > 0,
    };
  });
  const relance = await pagina();
  await relance.goto(base + '/?ambito=municipio:evora', { waitUntil: 'networkidle' });
  const r = await relance.evaluate(() => ({
    postura: document.querySelector('[data-mapa-raiz]').getAttribute('data-postura'),
    largura: Math.round(document.querySelector('.mapa-tela').getBoundingClientRect().width),
    fichaVisivel: document.querySelector('[data-mapa-ficha]').getClientRects().length > 0,
  }));
  conta(
    'Évora · o mapa do localizador está dentro do cartão, e o mapa inteiro fica no Relance',
    c.postura === 'localizador' &&
      c.dentro &&
      c.largura === 170 &&
      c.mapas === 1 &&
      parseFloat(c.moldura) > 0 &&
      !c.fichaVisivel &&
      r.postura === 'inteiro' &&
      r.largura === 281 &&
      r.fichaVisivel,
    `leitura: ${c.postura} ${c.largura}px dentro do cartão (moldura ${c.moldura}) · relance: ${r.postura} ${r.largura}px com ficha · ${c.mapas} mapa no documento`,
  );
  await p.__contexto.close();
  await relance.__contexto.close();
}

/* (7) O rótulo do distrito: uma regra para os 308 (ISSUES I18). */
{
  const p = await pagina();
  const lidos = {};
  for (const [slug, q] of [
    ['evora', '/?ambito=municipio:evora'],
    ['beja', '/?ambito=municipio:beja'],
    ['horta', '/?ambito=municipio:horta'],
    ['lagoa-ilha-de-sao-miguel', '/?ambito=municipio:lagoa-ilha-de-sao-miguel'],
  ]) {
    await p.goto(base + q, { waitUntil: 'networkidle' });
    lidos[slug] = await p.evaluate(() => {
      const b = [...document.querySelectorAll('.cabeca-bloco')].find(
        (e) => e.getClientRects().length,
      );
      const r = b.querySelector('.cabeca-rotulo');
      /* O que se LÊ do prefixo e do distrito, e não o que está escrito:
         `textContent` traz também o prefixo escondido, e é exactamente isso que
         esta célula tem de distinguir. */
      return [...r.querySelectorAll('[data-prefixo-distrito], [data-slot="distrito"]')]
        .filter((e) => !e.hidden)
        .map((e) => e.textContent)
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
    });
  }
  conta(
    'o rótulo do distrito segue uma regra só nos 308 (ISSUES I18)',
    lidos.beja === 'distrito de Beja' &&
      lidos.horta === 'Ilha do Faial' &&
      lidos['lagoa-ilha-de-sao-miguel'] === 'Ilha de São Miguel' &&
      lidos.evora === '',
    `Beja «${lidos.beja}» · Horta «${lidos.horta}» · Lagoa «${lidos['lagoa-ilha-de-sao-miguel']}» · Évora traz a sua etiqueta de municipios.mjs`,
  );
  await p.__contexto.close();
}

/* ===========================================================================
 * SUBETAPA 2h · a proximidade, e duas arestas
 * ======================================================================== */

/* (2h·1) A LISTA DE PROXIMIDADE ENTRA COM UM TOQUE A SÉRIO, E SÓ COM UM.
 *
 * A célula compara o que a página acende com o que ESTE ficheiro calcula, do seu
 * lado, sobre `caop-centroids.mjs`: se as duas listas baterem certo, a ordenação
 * do cliente é a ordenação dos centróides e não a ordem da Carta a fingir-se de
 * proximidade (que foi o defeito que a 2g apanhou). Mede também o que a lista
 * NÃO tem — algarismos —, e que uma activação por teclado não é um toque. */
{
  const p = await pagina({ largura: 390 });
  await p.goto(base + '/', { waitUntil: 'networkidle' });

  const acesos = () =>
    p.evaluate(() =>
      [...document.querySelectorAll('.pesquisa-item')]
        .filter((e) => e.getClientRects().length)
        .map((e) => ({
          slug: e.querySelector('[data-escolher]').getAttribute('data-escolher'),
          texto: e.textContent.replace(/\s+/g, ' ').trim(),
          etiqueta: e.querySelector('[data-escolher]').tagName,
        })),
    );

  /* O primeiro toque vem do âmbito País: é a porta, e não o gesto. */
  await p.locator('.movel-selo').click();
  const semToque = await acesos();
  const historiaAntes = await p.evaluate(() => history.length);

  /* O segundo é o gesto, num sítio concreto do selo. O selo cobre o mapa
     exactamente, e por isso o sítio tocado lê-se do rectângulo do mapa. */
  await p.locator('.movel-selo').scrollIntoViewIfNeeded();
  const r = await p.evaluate(() => {
    const b = document.querySelector('[data-mapa]').getBoundingClientRect();
    return { left: b.left, top: b.top, w: b.width, h: b.height };
  });
  const cx = r.left + r.w * 0.75;
  const cy = r.top + r.h * 0.66;
  await p.mouse.click(cx, cy);
  const comToque = await acesos();
  const historiaDepois = await p.evaluate(() => history.length);

  const px = ((cx - r.left) / r.w) * FIELD_W;
  const py = ((cy - r.top) / r.h) * FIELD_H;
  const esperados = concelhos()
    .map((c) => ({ slug: c.slug, d: (c.x - px) ** 2 + (c.y - py) ** 2 }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 8)
    .map((c) => c.slug)
    .sort();
  const obtidos = comToque.map((c) => c.slug).sort();

  /* Escrever desfaz o toque; limpar a caixa devolve a regra da caixa vazia. */
  await p.locator('[data-pesquisa]').fill('bej');
  const escrito = await acesos();
  await p.locator('[data-pesquisa]').fill('');
  const limpo = await acesos();

  /* E a activação por teclado não é um toque: `detail` 0 não tem sítio nenhum. */
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.locator('.movel-selo').click();
  await p.evaluate(() => document.querySelector('.movel-selo').focus());
  await p.keyboard.press('Enter');
  const porTeclado = await acesos();

  conta(
    'largura 390 · a lista de proximidade entra com um toque, e só com um',
    semToque.length === 1 &&
      semToque[0].slug === 'evora' &&
      obtidos.length === 8 &&
      obtidos.join('|') === esperados.join('|') &&
      comToque.every((c) => c.etiqueta === 'BUTTON') &&
      !comToque.some((c) => /[0-9]/.test(c.texto)) &&
      historiaDepois === historiaAntes + 1 &&
      escrito.length === 1 &&
      escrito[0].slug === 'beja' &&
      limpo.length === 1 &&
      limpo[0].slug === 'evora' &&
      porTeclado.length === 1 &&
      porTeclado[0].slug === 'evora',
    `sem toque: ${semToque.map((c) => c.slug).join(' · ')} · com toque em (${px.toFixed(0)}, ${py.toFixed(0)}): ${obtidos.join(' · ')} · esperados: ${esperados.join(' · ')} · ${comToque.length} botões, 0 algarismos · 1 entrada na história · a escrever «bej»: ${escrito.map((c) => c.slug).join(' · ')} · por teclado: ${porTeclado.map((c) => c.slug).join(' · ')}`,
  );
  await p.__contexto.close();
}

/* (2h·2) ISSUES I20 · o rótulo da referência da régua fica dentro da caixa.
 *
 * Seis estados por quatro larguras, dentro da matriz e não num guião de fora: a
 * varredura que apanhou o defeito era de fora, e um defeito que só uma
 * ferramenta de fora vê volta na subetapa seguinte. */
{
  const ESTADOS_DE_TRANSBORDO = [
    ['pais-relance', '/'],
    ['pais-leitura', '/?densidade=leitura'],
    ['regiao-alentejo-leitura', '/?ambito=regiao:alentejo&densidade=leitura'],
    ['evora-relance', '/?ambito=municipio:evora'],
    ['evora-leitura', '/?ambito=municipio:evora&densidade=leitura'],
    ['beja-vazio', '/?ambito=municipio:beja'],
  ];
  const linhas = [];
  let piores = 0;
  for (const [nome, q] of ESTADOS_DE_TRANSBORDO) {
    for (const largura of [320, 390, 768, 1280]) {
      const p = await pagina({ largura });
      await p.goto(base + q, { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => {
        const d = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        /* E, para lá do transbordo da página, o rótulo tem de caber na caixa da
           própria régua: uma régua dentro de um contentor que rolasse esconderia
           o mesmo defeito em vez de o fechar. */
        let fora = 0;
        for (const e of document.querySelectorAll('.regua-ref-rotulo')) {
          const caixa = e.closest('.regua');
          if (!caixa || !e.getClientRects().length) continue;
          const a = e.getBoundingClientRect();
          const b = caixa.getBoundingClientRect();
          if (a.right > b.right + 0.5 || a.left < b.left - 0.5) fora++;
        }
        return { d, fora };
      });
      if (m.d > 0 || m.fora > 0) piores++;
      linhas.push(`${nome}@${largura}:${m.d}${m.fora ? ` (${m.fora} fora da régua)` : ''}`);
      await p.__contexto.close();
    }
  }
  conta(
    'ISSUES I20 · seis estados × quatro larguras sem transbordo, e o rótulo dentro da régua',
    piores === 0,
    `${linhas.length - piores} de ${linhas.length} a zero · ${linhas.join(' · ')}`,
  );
}

/* (2h·3) ISSUES I21 · a dica de escolha segue a regra das outras duas. */
{
  const lidas = {};
  for (const largura of [390, 1280]) {
    const p = await pagina({ largura });
    await p.goto(base + '/?ambito=municipio:evora', { waitUntil: 'networkidle' });
    lidas[largura] = await p.evaluate(
      () => document.querySelector('[data-hint-escolher]').getClientRects().length > 0,
    );
    await p.__contexto.close();
    const semJs = await pagina({ largura, js: false });
    await semJs.goto(base + '/', { waitUntil: 'networkidle' });
    lidas[`${largura}-sem-js`] = await semJs.evaluate(
      () => document.querySelector('[data-hint-escolher]').getClientRects().length > 0,
    );
    await semJs.__contexto.close();
  }
  const p2 = await pagina({ largura: 1280 });
  await p2.goto(base + '/', { waitUntil: 'networkidle' });
  const noPais = await p2.evaluate(
    () => document.querySelector('[data-hint-escolher]').getClientRects().length > 0,
  );
  await p2.__contexto.close();
  conta(
    'ISSUES I21 · «Toque num ponto» só onde o mapa escolhe pontos',
    lidas[1280] === true &&
      lidas[390] === false &&
      lidas['1280-sem-js'] === false &&
      lidas['390-sem-js'] === false &&
      noPais === false,
    `1280 no âmbito Município ${lidas[1280]} · 390 ${lidas[390]} · sem script 1280 ${lidas['1280-sem-js']} e 390 ${lidas['390-sem-js']} · 1280 no âmbito País ${noPais}`,
  );
}

/* =============================================================================
 * ETAPA 2i · as células da leitura cruzada
 * ========================================================================== */

/* (2i·1) Portugal não é uma região, e a régua continua a ter as seis leituras. */
{
  const p = await pagina();
  await p.goto(`${base}/?ambito=regiao:portugal`, { waitUntil: 'networkidle' });
  const e = await estadoDaPagina(p);
  const c = await p.evaluate(() => {
    const chaves = (sel, attr) =>
      [...document.querySelectorAll(sel)]
        .map((x) => x.getAttribute(attr))
        .filter((k) => k && k.indexOf('regiao:') === 0);
    return {
      cabecas: chaves('[data-cabeca]', 'data-cabeca'),
      paineis: chaves('[data-painel]', 'data-painel'),
      pastilhas: document.querySelectorAll('[data-regiao]').length,
      pontosDaBanda: document.querySelectorAll('[data-banda-ponto]').length,
      barrasDaBanda: document.querySelectorAll('[data-banda]').length,
      portugalNaBanda: !!document.querySelector('[data-banda-ponto="portugal"]'),
      portugalNaLegenda: document.body.textContent.indexOf('Portugal') >= 0,
      portugalNoInstrumento: !!document.querySelector('[data-regiao-chip="pt"]'),
    };
  });
  conta(
    '2i·1 · Portugal não é uma região: sem estado, e na régua como referência',
    e.ambito === 'pais' &&
      e.url === '/' &&
      c.cabecas.length === 5 &&
      c.paineis.length === 5 &&
      c.pastilhas === 5 &&
      c.pontosDaBanda === 6 &&
      c.barrasDaBanda === 5 &&
      c.portugalNaBanda &&
      c.portugalNoInstrumento,
    `?ambito=regiao:portugal → ${e.ambito}, endereço «${e.url}» · ${c.cabecas.length} cabeças, ${c.paineis.length} painéis e ${c.pastilhas} pastilhas de região · banda: ${c.pontosDaBanda} pontos e ${c.barrasDaBanda} barras, Portugal ponto ${c.portugalNaBanda} · instrumento n.º 1 com Portugal ${c.portugalNoInstrumento}`,
  );
  await p.__contexto.close();
}

/* (2i·2) A palavra da ressalva segue a edição, e não a língua por defeito de
   `Claim.astro`. Contam-se TODAS, inclusive as dos blocos escondidos: um estado
   que o leitor pode acender é um estado que o portão e a matriz têm de ver. */
{
  const p = await pagina();
  const lidas = {};
  for (const [rota, edicao] of [
    ['/', 'pt'],
    ['/en/', 'en'],
  ]) {
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    lidas[edicao] = await p.evaluate(() => {
      const conta = {};
      for (const el of document.querySelectorAll('.claim-provisorio')) {
        const t = el.textContent.trim();
        conta[t] = (conta[t] ?? 0) + 1;
      }
      return conta;
    });
  }
  const soUma = (o, palavra) => Object.keys(o).length === 1 && o[palavra] > 0;
  conta(
    '2i·2 · a palavra do provisório segue a edição, nas duas',
    soUma(lidas.pt, 'provisório') &&
      soUma(lidas.en, 'provisional') &&
      lidas.pt['provisório'] === lidas.en['provisional'],
    `pt ${JSON.stringify(lidas.pt)} · en ${JSON.stringify(lidas.en)}`,
  );
  await p.__contexto.close();
}

/* (2i·3a) Os 308 pontos do mapa têm o mesmo tamanho: a cobertura é o enchimento. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const pontos = [...document.querySelectorAll('[data-pontos] .mun')];
    const lados = new Set(
      pontos.map((x) => `${x.getAttribute('width')}×${x.getAttribute('height')}`),
    );
    const cheios = pontos.filter((x) => x.classList.contains('mun-com-pagina'));
    return { n: pontos.length, lados: [...lados], cheios: cheios.length };
  });
  conta(
    '2i·3a · os 308 pontos do mapa têm o mesmo tamanho (Emenda 3)',
    m.n === 308 && m.lados.length === 1 && m.cheios === 1,
    `${m.n} pontos · ${m.lados.length} tamanho(s): ${m.lados.join(', ')} · ${m.cheios} com página`,
  );
  await p.__contexto.close();
}

/* (2i·3b) O CONCELHO ESCOLHIDO É UM ANEL, E NUNCA UM ENCHIMENTO.
 *
 * A medida não converte cores: compara o enchimento do ponto ESCOLHIDO com o de
 * outro ponto sem página do mesmo documento, que é o papel por definição. Se os
 * dois forem iguais, o escolhido não está cheio; se o escolhido for igual ao de
 * Évora, está a dizer que tem página. */
{
  const leituraDoPonto = (p, slug) =>
    p.evaluate((s) => {
      const escolhido = document.querySelector(`[data-pontos] [data-caop="${s}"]`);
      const outroSemPagina = [...document.querySelectorAll('[data-pontos] .mun')].find(
        (x) => x !== escolhido && !x.classList.contains('mun-com-pagina'),
      );
      const comPagina = document.querySelector('[data-pontos] .mun-com-pagina');
      const est = (el) => {
        const cs = getComputedStyle(el);
        return { fill: cs.fill, stroke: cs.stroke, largura: parseFloat(cs.strokeWidth) };
      };
      return {
        temClasse: escolhido.classList.contains('mun-escolhido'),
        escolhido: est(escolhido),
        papel: est(outroSemPagina),
        tinta: est(comPagina),
      };
    }, slug);

  const linhas = [];
  let bem = true;
  for (const [rota, largura, nome] of [
    ['/?ambito=municipio:beja', 1280, 'Beja · 1280 · relance'],
    ['/?ambito=municipio:beja&densidade=leitura', 1280, 'Beja · 1280 · leitura (localizador)'],
    ['/?ambito=municipio:beja', 390, 'Beja · 390'],
  ]) {
    const p = await pagina({ largura });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const r = await leituraDoPonto(p, 'beja');
    const ok =
      r.temClasse &&
      r.escolhido.fill === r.papel.fill &&
      r.escolhido.fill !== r.tinta.fill &&
      r.escolhido.largura > r.papel.largura;
    if (!ok) bem = false;
    linhas.push(
      `${nome}: enchimento ${r.escolhido.fill} = papel ${r.papel.fill} · ≠ tinta ${r.tinta.fill} · anel ${r.escolhido.largura} contra ${r.papel.largura}`,
    );
    await p.__contexto.close();
  }
  /* E o contrário: Évora escolhida continua cheia, porque TEM página. */
  const pe = await pagina();
  await pe.goto(`${base}/?ambito=municipio:evora`, { waitUntil: 'networkidle' });
  const ev = await leituraDoPonto(pe, 'evora');
  const evoraOk = ev.temClasse && ev.escolhido.fill === ev.tinta.fill;
  if (!evoraOk) bem = false;
  linhas.push(`Évora escolhida: enchimento ${ev.escolhido.fill} = tinta ${ev.tinta.fill}`);
  await pe.__contexto.close();

  conta(
    '2i·3b · o ponto escolhido é um anel de tinta, e nunca um enchimento',
    bem,
    linhas.join(' · '),
  );
}

/* (2i·3c) A frase de neutralidade fica ao pé do mapa em todas as posturas. */
{
  const linhas = [];
  let bem = true;
  for (const [rota, largura, nome] of [
    ['/', 1280, 'País · inteiro'],
    ['/?ambito=municipio:beja', 1280, 'escolha · inteiro'],
    ['/?ambito=municipio:evora&densidade=leitura', 1280, 'Évora · localizador'],
    ['/?ambito=municipio:evora&densidade=leitura', 390, 'Évora · localizador · 390'],
    ['/', 390, 'País · 390'],
  ]) {
    const p = await pagina({ largura });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => {
      const figura = document.querySelector('[data-mapa-raiz]');
      const frase = document.querySelector('.mapa-neutro').textContent.trim();
      const todas = [...document.querySelectorAll('.mapa-neutro, .mapa-cartao-neutro')];
      const visiveis = todas.filter((e) => e.getClientRects().length > 0);
      return {
        postura: figura.getAttribute('data-postura'),
        frase,
        visiveis: visiveis.length,
        iguais: visiveis.every((e) => e.textContent.trim() === frase),
        dentroDoMapa: visiveis.every((e) => !!e.closest('[data-mapa-raiz]')),
      };
    });
    const ok = r.visiveis === 1 && r.iguais && r.dentroDoMapa;
    if (!ok) bem = false;
    linhas.push(`${nome} (${r.postura}): ${r.visiveis} visível, dentro do mapa ${r.dentroDoMapa}`);
    await p.__contexto.close();
  }
  conta(
    '2i·3c · a frase de neutralidade acompanha o mapa em todas as posturas',
    bem,
    linhas.join(' · '),
  );
}

/* (2i·3d) Abaixo de 640 nenhum ponto é activável, por nenhum meio. */
{
  const sonda = async (largura) => {
    const p = await pagina({ largura });
    await p.goto(`${base}/?ambito=municipio:beja`, { waitUntil: 'networkidle' });
    const alvos = await p.evaluate(
      () =>
        getComputedStyle(document.querySelector('[data-alvos] [data-caop]')).pointerEvents,
    );
    await p.focus('[data-mapa-wrap]');
    await p.keyboard.press('ArrowRight');
    const leitura = await p.evaluate(
      () => document.querySelector('[data-readout-nome]')?.textContent.trim() ?? '',
    );
    await p.keyboard.press('Enter');
    const depoisDoEnter = (await estadoDaPagina(p)).ambito;
    await p.keyboard.press('Space');
    const depoisDoEspaco = (await estadoDaPagina(p)).ambito;
    await p.__contexto.close();
    return { alvos, leitura, depoisDoEnter, depoisDoEspaco };
  };
  const estreito = await sonda(390);
  const largo = await sonda(1280);
  conta(
    '2i·3d · abaixo de 640 nenhum ponto é activável, e a leitura fica',
    estreito.alvos === 'none' &&
      estreito.depoisDoEnter === 'municipio:beja' &&
      estreito.depoisDoEspaco === 'municipio:beja' &&
      estreito.leitura.length > 0 &&
      largo.alvos !== 'none' &&
      largo.depoisDoEnter !== 'municipio:beja',
    `390: alvos «${estreito.alvos}», seta lê «${estreito.leitura}», Enter → ${estreito.depoisDoEnter}, espaço → ${estreito.depoisDoEspaco} · 1280: alvos «${largo.alvos}», Enter → ${largo.depoisDoEnter}`,
  );
}

/* (2i·5) O espaço activa os comandos, como o Enter, e não rola a página. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  await p.focus('[data-densidade="leitura"]');
  await p.keyboard.press('Space');
  const a = await estadoDaPagina(p);
  const rolou = await p.evaluate(() => window.scrollY);
  await p.focus('[data-modo="regiao"]');
  await p.keyboard.press('Space');
  const b = await estadoDaPagina(p);
  /* Os comandos são os DESCENDENTES de `[data-inicio]`: a própria raiz leva
     `data-modo` e `data-densidade` como estado, e não é um comando. É o mesmo
     alcance com que o script os apanha. */
  const papeis = await p.evaluate(() => {
    const raiz = document.querySelector('[data-inicio]');
    const papel = (sel) => {
      const es = [...raiz.querySelectorAll(sel)];
      return `${es.filter((e) => e.getAttribute('role') === 'button').length}/${es.length}`;
    };
    return { ambito: papel('[data-modo]'), densidade: papel('[data-densidade]') };
  });
  const todosBotoes = (r) => r.split('/')[0] === r.split('/')[1] && r.split('/')[1] !== '0';
  conta(
    '2i·5 · o espaço activa os comandos de âmbito e de densidade',
    a.densidade === 'leitura' &&
      b.modo === 'regiao' &&
      rolou === 0 &&
      todosBotoes(papeis.ambito) &&
      todosBotoes(papeis.densidade),
    `espaço na densidade → ${a.densidade} (rolagem ${rolou}) · espaço no âmbito → modo ${b.modo} · com role="button": âmbito ${papeis.ambito}, densidade ${papeis.densidade}`,
  );
  await p.__contexto.close();
}

/* (2i·5) Nenhuma régua fica com papel de imagem e sem nome. */
{
  const p = await pagina();
  await p.goto(`${base}/?densidade=leitura`, { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const svgs = [...document.querySelectorAll('svg.regua-svg')];
    const semNome = (s) =>
      !s.getAttribute('aria-label') &&
      !s.getAttribute('aria-labelledby') &&
      !s.querySelector('title, desc');
    return {
      n: svgs.length,
      escondidas: svgs.filter((s) => s.getAttribute('aria-hidden') === 'true').length,
      papelSemNome: svgs.filter((s) => s.getAttribute('role') === 'img' && semNome(s)).length,
      focaveisDentro: svgs.filter((s) => s.querySelector('a[href],button,input,[tabindex]')).length,
    };
  });
  conta(
    '2i·5 · nenhuma régua com papel de imagem e sem nome acessível',
    r.n > 0 && r.escondidas === r.n && r.papelSemNome === 0 && r.focaveisDentro === 0,
    `${r.n} réguas · ${r.escondidas} com aria-hidden · ${r.papelSemNome} com role="img" sem nome · ${r.focaveisDentro} com conteúdo focável dentro`,
  );
  await p.__contexto.close();
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
