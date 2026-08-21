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
async function pagina({
  largura = 1280,
  js = true,
  movimento = null,
  /* A preferência do SISTEMA. Desde a Emenda 12 (21.08.2026) ela não decide
     nada: a folha é clara para toda a gente. Continua a poder emular-se, porque
     é isso que uma das células novas tem de provar. */
  sistema = 'light',
  /* A ESCOLHA DO LEITOR, guardada no aparelho: `'dark'`, `'light'` ou nada. */
  escolhaGuardada = null,
} = {}) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    javaScriptEnabled: js,
    reducedMotion: movimento === 'reduce' ? 'reduce' : 'no-preference',
    colorScheme: sistema === 'dark' ? 'dark' : 'light',
  });
  if (escolhaGuardada) {
    await contexto.addInitScript((v) => {
      try {
        localStorage.setItem('tema', v);
      } catch (e) {
        /* um aparelho que recusa o armazenamento fica em claro, e a célula vê-o */
      }
    }, escolhaGuardada);
  }
  const p = await contexto.newPage();
  p.__contexto = contexto;
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
  /* A MANCHETE DA EMENDA 16: duas contagens, e o nome do Procedimento por
     extenso. A célula lê o texto e as duas chaves da prova que o compõem. */
  const manchete = await p.evaluate(() => {
    const h1 = document.querySelector('[data-cabeca]:not([hidden]) h1');
    return {
      texto: h1.textContent.replace(/\s+/g, ' ').trim(),
      provas: [...h1.querySelectorAll('[data-prova]')].map((e) => e.getAttribute('data-prova')),
    };
  });
  conta(
    '2l · a manchete do País leva as duas contagens da Emenda 16',
    /Procedimento dos Desequil|Macroeconomic Imbalance Procedure/.test(manchete.texto) &&
      manchete.provas.join(',') === 'painel_fora_do_limiar,painel_dentro_do_limiar',
    `${manchete.texto} · ${manchete.provas.join(' + ')}`,
  );
  conta('painel do País com 13 peças (Emenda 16)', inicial.pecas === 13, `${inicial.pecas} peças`);

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
    /* A VIZINHANÇA DO VALOR NOVO (etapa 2m). `municipio` passou a ser um valor
       do esquema — a vista de escolha —, e por isso o que interessa medir é que
       o esquema não alargou com ele: nem o plural, nem o prefixo sem slug, nem
       um slug que não existe. */
    ['?ambito=municipios', 'o plural de um valor válido'],
    ['?ambito=municipio:', 'o prefixo sem concelho'],
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
  /* 1024 entrou na varredura a 21.08.2026, por instrução da leitura da
     pré-visualização n.º 1 — e foi a largura nova que apanhou um defeito de
     82px (90px na edição inglesa) que nenhuma das outras quatro via. */
  for (const largura of [320, 390, 768, 1024, 1280]) {
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
  /* OS DOIS TEMAS, PELO CAMINHO QUE A EMENDA 12 DEIXOU.
     O escuro deixou de vir da preferência do sistema: vem do controlo do
     cabeçalho, e a escolha fica no aparelho do leitor. A célula escreve a
     escolha em `localStorage` antes de a página correr — que é o estado de quem
     carregou no botão numa visita anterior — e deixa a guarda do `<head>`
     aplicá-la. Pôr o atributo à mão mediria a folha; assim mede-se o caminho. */
  for (const tema of ['claro', 'escuro']) {
    const p = await pagina({ escolhaGuardada: tema === 'escuro' ? 'dark' : 'light' });
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
  for (const q of [
    '/',
    '/?ambito=regiao:alentejo',
    '/?ambito=municipio:beja',
    /* O estado novo da etapa 2m entra nesta lista pela mesma razão dos outros:
       sem script ele mostra o defeito, com os comandos como ligações que abrem.
       A vista de escolha é uma vista com script, e a página di-lo por não a
       abrir em vez de a prometer. */
    '/?ambito=municipio',
    '/?densidade=leitura',
  ]) {
    const p = await pagina({ js: false });
    await p.goto(base + q, { waitUntil: 'load' });
    const e = await p.evaluate(() => ({
      bloco: document.querySelector('[data-cabeca]:not([hidden])')?.getAttribute('data-cabeca') ?? null,
      painel: document.querySelector('[data-painel]:not([hidden])')?.getAttribute('data-painel') ?? null,
      pecas: document.querySelectorAll('[data-painel]:not([hidden]) .peca').length,
      valores: document.querySelectorAll('[data-painel]:not([hidden]) [data-claim]').length,
      selos: document.querySelectorAll('[data-painel]:not([hidden]) a.src-chip').length,
      ligacoes: [...document.querySelectorAll('[data-comando] a')].map((a) => a.getAttribute('href')),
      nota: document.querySelector('[data-sem-js]') ? true : false,
      transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    const completo = e.bloco === 'pais' && e.painel === 'pais' && e.pecas === 13 && e.selos >= 13;
    conta(
      `sem JavaScript · ${q}`,
      completo && e.ligacoes.every(Boolean) && e.transbordo <= 0,
      q === '/'
        ? `completo e correcto: ${e.pecas} peças, ${e.valores} valores, ${e.selos} selos`
        : `mostra o defeito (${e.bloco}), com os comandos como ligações que abrem: ${e.ligacoes.join(' · ')}`,
    );
    /* A NOTA «SEM JAVASCRIPT» SAIU (Emenda 15). A célula deixa de exigir que ela
       esteja à vista e passa a exigir o contrário: que não exista, e que o que
       ela descrevia continue verdadeiro — os comandos são ligações que abrem, e
       o painel rende-se inteiro. As duas condições estão na célula acima. */
    conta(`sem JavaScript · nenhuma nota de mecânica · ${q}`, e.nota === false, `nota no documento: ${e.nota !== false}`);
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
  /* A CÉLULA MUDA DE PERGUNTA COM A EMENDA 15. Media que a linha «Painel
     europeu reconferido a …» só se lia no âmbito País; a emenda tirou-a da
     primeira página inteira, porque a mobília do cabeçalho já a leva em todas as
     páginas. O que a célula mede agora é isso: zero na primeira página, uma no
     cabeçalho, e a porta da chave a resolver para o painel. */
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  /* O sinal de tempo da mobília não é uma chave da prova: é a mesma data,
     marcada `data-nonledger="data-de-atualizacao"`, com a porta do painel. A
     chave `painel_reconferido_em` rende-se no Método, e a sua porta é a mesma. */
  const sinal = await p.evaluate(() => ({
    naPagina: document.querySelectorAll('.verificacao').length,
    naMobilia: document.querySelectorAll('header [data-sinal-de-tempo] .mob-leitura-porta .mob-leitura-v').length,
    porta: document.querySelector('header [data-sinal-de-tempo] .mob-leitura-porta')?.getAttribute('href') ?? null,
    ancora: !!document.querySelector('#painel'),
  }));
  conta(
    '2l · a linha da reconferência saiu da primeira página, e a porta abre o painel',
    sinal.naPagina === 0 && sinal.naMobilia === 1 && /#painel$/.test(sinal.porta ?? '') && sinal.ancora,
    `na página ${sinal.naPagina} · na mobília ${sinal.naMobilia} · porta ${sinal.porta}`,
  );
  await p.__contexto.close();
}

/* (2) A FICHA DO MAPA É UMA LINHA (Emenda 17), e a camada de aparelho saiu
   (Emenda 15). A célula mudou de pergunta com as emendas: media que a citação, o
   CSV e as dicas tinham descido para a camada do aparelho; agora mede que a
   camada não existe, que a citação saiu da primeira página, que a linha é a da
   emenda com o seu selo, e que as dicas passaram a descrição acessível do mapa.
   A PORTA DO CSV fica, e a célula di-lo: `scripts/check-dados.mjs` exige que as
   duas edições da primeira página liguem os dois ficheiros. */
{
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const f = await p.evaluate(() => {
    const ficha = document.querySelector('[data-mapa-ficha]');
    const svg = document.querySelector('[data-mapa]');
    const descrito = svg.getAttribute('aria-describedby');
    const desc = descrito ? document.getElementById(descrito) : null;
    return {
      alturaDaFicha: Math.round(ficha.getBoundingClientRect().height),
      aparelho: document.querySelectorAll('[data-mapa-aparelho]').length,
      citacaoNaPagina: document.querySelectorAll('[data-verbatim="caop-fonte"]').length,
      linha: ficha.querySelector('.mapa-linha-fonte')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
      seloNaLinha: !!ficha.querySelector('.mapa-linha-fonte a.src-chip'),
      valorNaLinha: ficha.querySelector('.mapa-linha-fonte [data-claim]')?.getAttribute('data-claim') ?? null,
      csv: !!ficha.querySelector('.ligacao-dados'),
      /* «Visível» aqui é «fora de um recorte `.vh`»: um elemento dentro de um
         `.vh` continua a ter caixa (é assim que ele fica na árvore de
         acessibilidade e fora do ecrã), e medir a caixa dizia o contrário do que
         o leitor vê. */
      dicasVisiveis: [...ficha.querySelectorAll('.mapa-hint')].filter((e) => !e.closest('.vh')).length,
      dicasNaDescricao: desc ? desc.querySelectorAll('.mapa-hint').length : 0,
      descricaoOculta: desc ? getComputedStyle(desc).position === 'absolute' : false,
    };
  });
  conta(
    '2l · Emenda 17 · por baixo do mapa uma só linha, com o selo',
    f.aparelho === 0 &&
      f.citacaoNaPagina === 0 &&
      f.seloNaLinha &&
      f.valorNaLinha === 'municipios-portugal-caop-2025' &&
      /CAOP/.test(f.linha ?? ''),
    `«${f.linha}» · ficha ${f.alturaDaFicha}px · camada de aparelho ${f.aparelho} · citação na página ${f.citacaoNaPagina} · CSV ${f.csv}`,
  );
  conta(
    '2l · Emenda 15 · as dicas do mapa são descrição acessível e não legenda',
    f.dicasVisiveis === 0 && f.dicasNaDescricao === 3 && f.descricaoOculta,
    `${f.dicasVisiveis} visíveis · ${f.dicasNaDescricao} na descrição · oculta ${f.descricaoOculta}`,
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
      span: colunas.length === 13 && colunas.every((c) => c === 'span 2'),
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
  /* O MAPA INTEIRO DEIXOU DE TER LARGURA PRÓPRIA (etapa 2m): enche a coluna da
     cabeça. A célula deixa de comparar com 281 — que era a largura escrita na
     folha — e passa a comparar com a COLUNA, que é a promessa nova: se um dia a
     mancha de texto mudar, a célula acompanha em vez de mentir. */
  const r = await relance.evaluate(() => ({
    postura: document.querySelector('[data-mapa-raiz]').getAttribute('data-postura'),
    largura: Math.round(document.querySelector('.mapa-tela').getBoundingClientRect().width),
    coluna: Math.round(document.querySelector('.cabeca-inst').getBoundingClientRect().width),
    fichaVisivel: document.querySelector('[data-mapa-ficha]').getClientRects().length > 0,
  }));
  conta(
    'Évora · o mapa do localizador está dentro do cartão, e o mapa inteiro enche a coluna no Relance',
    c.postura === 'localizador' &&
      c.dentro &&
      c.largura === 170 &&
      c.mapas === 1 &&
      parseFloat(c.moldura) > 0 &&
      !c.fichaVisivel &&
      r.postura === 'inteiro' &&
      r.largura === r.coluna &&
      r.fichaVisivel,
    `leitura: ${c.postura} ${c.largura}px dentro do cartão (moldura ${c.moldura}) · relance: ${r.postura} ${r.largura}px numa coluna de ${r.coluna}px, com ficha · ${c.mapas} mapa no documento`,
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
    for (const largura of [320, 390, 768, 1024, 1280]) {
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
    'ISSUES I20 · seis estados × cinco larguras sem transbordo, e o rótulo dentro da régua',
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

/* (2i·3a, revista pela Emenda 10) OS 308 PONTOS SÃO CÍRCULOS, DO MESMO TAMANHO,
 * E NENHUM VEM CHEIO.
 *
 * Três coisas numa célula, porque são a mesma regra: o glifo do mapa é o ponto
 * redondo (o quadrado ficou a marcar prova e estado), o raio é um só para os
 * 308, e o enchimento saiu — a cobertura diz-se por palavras ao lado do mapa.
 * A célula lê o `fill` CALCULADO e não a classe: uma classe que já não pinta
 * nada não prova nada. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const pontos = [...document.querySelectorAll('[data-pontos] .mun')];
    const etiquetas = new Set(pontos.map((x) => x.tagName.toLowerCase()));
    const raios = new Set(pontos.map((x) => x.getAttribute('r')));
    const enchimentos = new Set(pontos.map((x) => getComputedStyle(x).fill));
    const comPagina = pontos.filter((x) => x.getAttribute('data-pagina') === 'sim');
    return {
      n: pontos.length,
      etiquetas: [...etiquetas],
      raios: [...raios],
      enchimentos: [...enchimentos],
      comPagina: comPagina.length,
    };
  });
  conta(
    '2j·a · os 308 pontos são círculos iguais e nenhum vem cheio (Emendas 3 e 10)',
    m.n === 308 &&
      m.etiquetas.length === 1 &&
      m.etiquetas[0] === 'circle' &&
      m.raios.length === 1 &&
      m.enchimentos.length === 1 &&
      m.enchimentos[0] === 'none' &&
      m.comPagina === 1,
    `${m.n} <${m.etiquetas.join('/')}> · 1 raio: ${m.raios.join(', ')} · enchimento ${m.enchimentos.join(', ')} · ${m.comPagina} declarado com página`,
  );
  await p.__contexto.close();
}

/* (2i·3b, revista pela Emenda 10) O CONCELHO ESCOLHIDO É UM ANEL, E NUNCA UM
 * ENCHIMENTO — E AGORA NENHUM PONTO É UM ENCHIMENTO.
 *
 * A medida continua a não converter cores: compara o ponto ESCOLHIDO com outro
 * ponto qualquer do mesmo documento e com o de Évora, que é o único que a página
 * declara com página. Os três têm de ter o mesmo enchimento — nenhum — e o mesmo
 * raio; o que distingue o escolhido é a espessura do contorno, que é o anel. */
{
  const leituraDoPonto = (p, slug) =>
    p.evaluate((s) => {
      const escolhido = document.querySelector(`[data-pontos] [data-caop="${s}"]`);
      const outroSemPagina = [...document.querySelectorAll('[data-pontos] .mun')].find(
        (x) => x !== escolhido && x.getAttribute('data-pagina') !== 'sim',
      );
      const comPagina = document.querySelector('[data-pontos] [data-pagina="sim"]');
      const est = (el) => {
        const cs = getComputedStyle(el);
        return {
          fill: cs.fill,
          stroke: cs.stroke,
          largura: parseFloat(cs.strokeWidth),
          raio: el.getAttribute('r'),
        };
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
      r.escolhido.fill === 'none' &&
      r.papel.fill === 'none' &&
      r.tinta.fill === 'none' &&
      r.escolhido.raio === r.papel.raio &&
      r.escolhido.largura > r.papel.largura;
    if (!ok) bem = false;
    linhas.push(
      `${nome}: enchimento ${r.escolhido.fill} (todos ${r.papel.fill}/${r.tinta.fill}) · raio ${r.escolhido.raio} = ${r.papel.raio} · anel ${r.escolhido.largura} contra ${r.papel.largura}`,
    );
    await p.__contexto.close();
  }
  /* E Évora, que é o único concelho com página: escolhida ou não, o ponto é o
     mesmo dos outros 307. O enchimento deixou de dizer cobertura (Emenda 10). */
  const pe = await pagina();
  await pe.goto(`${base}/?ambito=municipio:evora`, { waitUntil: 'networkidle' });
  const ev = await leituraDoPonto(pe, 'evora');
  const evoraOk = ev.temClasse && ev.escolhido.fill === 'none' && ev.papel.fill === 'none';
  if (!evoraOk) bem = false;
  linhas.push(`Évora escolhida: enchimento ${ev.escolhido.fill}, como os outros 307`);
  await pe.__contexto.close();

  conta(
    '2j·a · o ponto escolhido é um anel, e nenhum ponto é um enchimento',
    bem,
    linhas.join(' · '),
  );
}

/* (2i·3c) A frase de neutralidade fica ao pé do mapa em todas as posturas. */
{
  /* A CÉLULA 2i·3c MUDA DE PERGUNTA COM A EMENDA 15. Media que a frase de
     neutralidade («os pontos são todos iguais e marcam a posição…, não marcam
     cobertura, qualidade nem importância») acompanhava o mapa nas cinco
     posturas. A emenda tirou-a: «uma legenda nomeia o que a coisa é … nunca o
     que não afirmamos». O que a célula mede agora é a ausência, nas mesmas
     cinco posturas, e que a linha da Emenda 17 está lá em vez dela. */
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
      return {
        postura: figura.getAttribute('data-postura'),
        neutras: document.querySelectorAll('.mapa-neutro, .mapa-cartao-neutro').length,
        cobertura: document.querySelectorAll('.mapa-titulo, .mapa-cartao-cobertura').length,
      };
    });
    const ok = r.neutras === 0 && r.cobertura === 0;
    if (!ok) bem = false;
    linhas.push(`${nome} (${r.postura}): ${r.neutras} neutras, ${r.cobertura} de cobertura`);
    await p.__contexto.close();
  }
  conta(
    '2l · Emenda 15 · a neutralidade e a cobertura saíram do mapa, em todas as posturas',
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

/* =============================================================== ETAPA 2j
 *
 * As células da leitura da pré-visualização n.º 1 pela direção: Emendas 10 a 14
 * e as quatro decisões de forma. Cada uma mede o que a emenda decide, e não o
 * que a folha escreve.
 * ====================================================================== */

/* (2j) EMENDA 12 · CLARO POR DEFEITO PARA TODOS, com o sistema em escuro e sem
 * escolha guardada. É a metade da emenda que a folha sozinha não prova: o bloco
 * da preferência do sistema saiu de `tokens.css`, e o que esta célula mede é que
 * um leitor com o sistema em escuro vê a página clara. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota] of [
    ['pt', '/'],
    ['en', '/en'],
  ]) {
    const p = await pagina({ sistema: 'dark' });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const e = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      guardado: (() => {
        try {
          return localStorage.getItem('tema');
        } catch (x) {
          return 'erro';
        }
      })(),
      controlo: !!document.querySelector('[data-tema-controlo]:not([hidden])'),
      premido: [...document.querySelectorAll('.tema-b')]
        .map((b) => `${b.getAttribute('data-tema')}:${b.getAttribute('aria-pressed')}`)
        .join(' '),
    }));
    const ok =
      e.atributo === null && e.guardado === null && e.controlo && e.premido === 'light:true dark:false';
    if (!ok) bem = false;
    linhas.push(`${edicao}: data-theme ${e.atributo} · papel ${e.papel} · guardado ${e.guardado} · ${e.premido}`);
    await p.__contexto.close();
  }
  conta(
    '2j · Emenda 12 · claro por defeito, com o sistema em escuro e sem escolha',
    bem,
    linhas.join(' · '),
  );
}

/* (2j) EMENDA 12 · A ESCOLHA FICA NO APARELHO E SOBREVIVE À RECARGA.
 * Carrega no botão a sério — não escreve o atributo —, recarrega, e vai a outra
 * rota do sítio, porque uma preferência de leitura que só valesse numa página
 * não era uma preferência. Nas duas edições. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota, outra] of [
    ['pt', '/', '/metodo'],
    ['en', '/en', '/en/method'],
  ]) {
    const p = await pagina();
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    await p.click('.tema-b[data-tema="dark"]');
    const depois = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      guardado: localStorage.getItem('tema'),
      premido: [...document.querySelectorAll('.tema-b')]
        .map((b) => `${b.getAttribute('data-tema')}:${b.getAttribute('aria-pressed')}`)
        .join(' '),
    }));
    await p.reload({ waitUntil: 'networkidle' });
    const recarga = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      premido: [...document.querySelectorAll('.tema-b')]
        .map((b) => `${b.getAttribute('data-tema')}:${b.getAttribute('aria-pressed')}`)
        .join(' '),
    }));
    await p.goto(base + outra, { waitUntil: 'networkidle' });
    const noutraRota = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
    }));
    await p.click('.tema-b[data-tema="light"]');
    const volta = await p.evaluate(() => ({
      atributo: document.documentElement.getAttribute('data-theme'),
      papel: getComputedStyle(document.body).backgroundColor,
      guardado: localStorage.getItem('tema'),
    }));
    const escuro = depois.papel;
    const ok =
      depois.atributo === 'dark' &&
      depois.guardado === 'dark' &&
      depois.premido === 'light:false dark:true' &&
      recarga.atributo === 'dark' &&
      recarga.papel === escuro &&
      recarga.premido === 'light:false dark:true' &&
      noutraRota.atributo === 'dark' &&
      noutraRota.papel === escuro &&
      volta.atributo === null &&
      volta.guardado === 'light' &&
      volta.papel !== escuro;
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: carregou ${depois.papel} (${depois.guardado}) · recarga ${recarga.papel} · ${outra} ${noutraRota.papel} · voltou a claro ${volta.papel} (${volta.guardado})`,
    );
    await p.__contexto.close();
  }
  conta('2j · Emenda 12 · a escolha do tema persiste, nas duas edições', bem, linhas.join(' · '));
}

/* (2j) EMENDA 12 · SEM JAVASCRIPT o sítio é claro e o controlo não aparece.
 * Um comando que não comanda nada é uma promessa falhada: entra `hidden` do
 * servidor, e é o script que o acende. */
{
  const p = await pagina({ js: false, sistema: 'dark' });
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const g = document.querySelector('[data-tema-controlo]');
    return {
      existe: !!g,
      escondido: g ? g.hasAttribute('hidden') : null,
      caixa: g ? g.getBoundingClientRect().height : null,
      atributo: document.documentElement.getAttribute('data-theme'),
    };
  });
  conta(
    '2j · Emenda 12 · sem JavaScript o controlo do tema não se vê, e a página é clara',
    m.existe && m.escondido === true && m.caixa === 0 && m.atributo === null,
    `existe ${m.existe} · hidden ${m.escondido} · altura ${m.caixa} · data-theme ${m.atributo}`,
  );
  await p.__contexto.close();
}

/* (2j) EMENDA 13 · A FILA DE ESTADOS SAIU DA CABEÇA, em todos os âmbitos, e as
 * contagens ficaram onde a emenda as manda estar: no rótulo e na manchete, por
 * chave da prova. E cada peça continua com o seu marcador e a sua palavra. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const filas = document.querySelectorAll('.fila, [class*="fila-"]');
    const raiz = document.querySelector('[data-inicio]');
    const provas = [...document.querySelectorAll('[data-cabeca] [data-prova]')].map((e) =>
      e.getAttribute('data-prova'),
    );
    const painel = document.querySelector('[data-painel="pais"]');
    const marcadores = painel.querySelectorAll('.peca-topo .sq').length;
    /* A PALAVRA DE ESTADO PASSOU AO TOPO DA PEÇA (etapa 2l). Vivia na linha do
       limiar quando não havia limiar, e no fecho da leitura breve quando havia;
       com treze peças a comparar, está sempre ao lado do marcador. */
    const palavras = [...painel.querySelectorAll('.peca-topo .peca-palavra')].filter(
      (e) => e.textContent.trim().length > 0,
    ).length;
    return { filas: filas.length, provas: [...new Set(provas)], marcadores, palavras, temRaiz: !!raiz };
  });
  conta(
    '2j · Emenda 13 · a fila de estados saiu da cabeça, e as contagens ficaram',
    m.filas === 0 &&
      m.provas.includes('painel_fora_do_limiar') &&
      m.provas.includes('painel_dentro_do_limiar') &&
      m.marcadores === 13 && m.palavras === 13,
    `${m.filas} filas · chaves da prova na cabeça: ${m.provas.join(', ')} · ${m.marcadores} marcadores e ${m.palavras} palavras nas peças`,
  );
  await p.__contexto.close();
}

/* (2j) AS PEÇAS SEM CAIXAS, SEPARADAS POR FIOS.
 * O que se mede não é a aparência: é que nenhuma peça tem moldura (`border-width`
 * a zero nos quatro lados) e que o intervalo da grelha é de 1px, que é o fio. */
{
  const p = await pagina();
  await p.goto(`${base}/`, { waitUntil: 'networkidle' });
  const m = await p.evaluate(() => {
    const painel = document.querySelector('[data-painel="pais"]');
    const cs = getComputedStyle(painel);
    const pecas = [...painel.querySelectorAll('.peca')];
    const molduras = pecas.filter((e) => {
      const c = getComputedStyle(e);
      return [c.borderTopWidth, c.borderRightWidth, c.borderBottomWidth, c.borderLeftWidth].some(
        (v) => parseFloat(v) > 0,
      );
    });
    return {
      pecas: pecas.length,
      comMoldura: molduras.length,
      intervaloCol: cs.columnGap,
      intervaloLin: cs.rowGap,
      sombra: pecas[0] ? getComputedStyle(pecas[0]).boxShadow : null,
    };
  });
  conta(
    '2j · as peças sem caixas, separadas por fios de 1px',
    m.pecas === 13 && m.comMoldura === 0 && m.intervaloCol === '1px' && m.intervaloLin === '1px' &&
      /1px/.test(m.sombra ?? ''),
    `${m.pecas} peças · ${m.comMoldura} com moldura · intervalo ${m.intervaloCol}/${m.intervaloLin} · fio «${m.sombra}»`,
  );
  await p.__contexto.close();
}

/* (2j) OS ALGARISMOS DA PEÇA NÃO PASSAM DE 56px, E NÃO SALTAM.
 * Cinco larguras, e em cada uma o maior corpo de valor do painel. O tecto é 56;
 * entre 320 e 1280 a série tem de ser crescente, que é o que prova que a escala
 * é fluida e não três patamares. */
{
  const serie = [];
  let bem = true;
  for (const largura of [320, 390, 768, 1024, 1280]) {
    const p = await pagina({ largura });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => {
      const corpos = [...document.querySelectorAll('[data-painel="pais"] .peca-valor')].map((e) =>
        parseFloat(getComputedStyle(e).fontSize),
      );
      return { maior: Math.max(...corpos), menor: Math.min(...corpos), n: corpos.length };
    });
    if (m.maior > 56.01) bem = false;
    serie.push({ largura, ...m });
    await p.__contexto.close();
  }
  for (let i = 1; i < serie.length; i++) if (serie[i].maior < serie[i - 1].maior) bem = false;
  conta(
    '2j · os algarismos da peça têm tecto de 56px e crescem sem saltos',
    bem,
    serie.map((x) => `${x.largura}: ${x.maior.toFixed(1)}px (menor ${x.menor.toFixed(1)})`).join(' · '),
  );
}

/* (2j) EMENDA 14 · UM CONCELHO SEM PÁGINA RENDE AS OITO MEDIDAS COMO PEÇAS
 * VAZIAS. Oito peças, cada uma com o nome e a unidade, as palavras «sem linha
 * ainda», e NENHUM algarismo, NENHUM selo e NENHUM marcador — que é o que a
 * emenda pede e o que o portão não pode conferir sozinho, porque um algarismo
 * numa peça vazia seria um algarismo legítimo em qualquer outro sítio. Nas duas
 * edições. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota, palavra] of [
    ['pt', '/?ambito=municipio:beja', 'sem linha ainda'],
    ['en', '/en?ambito=municipio:beja', 'no row yet'],
  ]) {
    const p = await pagina();
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => {
      const painel = document.querySelector('[data-painel="vazio"]');
      const vazias = [...painel.querySelectorAll('.peca-vazia')];
      const texto = vazias.map((e) => e.textContent.replace(/\s+/g, ' ').trim());
      return {
        visivel: !painel.hasAttribute('hidden'),
        n: vazias.length,
        algarismos: texto.filter((t) => /[0-9]/.test(t)).length,
        selos: painel.querySelectorAll('a.src-chip').length,
        marcadores: painel.querySelectorAll('.sq').length,
        valores: painel.querySelectorAll('[data-claim]').length,
        palavras: [...new Set(vazias.map((e) => e.querySelector('[data-cobertura]')?.textContent.trim()))],
        nomes: vazias.map((e) => e.querySelector('.peca-nome')?.textContent.trim()).filter(Boolean).length,
        unidades: vazias.map((e) => e.querySelector('.peca-unidade')?.textContent.trim()).filter(Boolean).length,
        /* A frase que explicava o estado vazio saiu com a Emenda 15: as oito
           peças dizem-no, cada uma em duas palavras. */
        fraseAcima: !!painel.querySelector('.vazio-texto'),
        ordem: !!painel.firstElementChild && painel.firstElementChild.classList.contains('peca-vazia'),
      };
    });
    const ok =
      m.visivel &&
      m.n === 8 &&
      m.algarismos === 0 &&
      m.selos === 0 &&
      m.marcadores === 0 &&
      m.valores === 0 &&
      m.nomes === 8 &&
      m.unidades === 8 &&
      m.palavras.length === 1 &&
      m.palavras[0] === palavra &&
      m.fraseAcima === false &&
      m.ordem;
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: ${m.n} peças vazias · ${m.algarismos} com algarismo · ${m.selos} selos · ${m.marcadores} marcadores · ${m.nomes} nomes · ${m.unidades} unidades · «${m.palavras.join('|')}» · frase por cima ${m.fraseAcima} · primeira célula é peça ${m.ordem}`,
    );
    await p.__contexto.close();
  }
  conta('2j · Emenda 14 · Beja rende as oito medidas como peças vazias', bem, linhas.join(' · '));
}

/* (2j) O INSTRUMENTO N.º 1 É MAIS PEQUENO, E OS RÓTULOS NÃO SE TOCAM.
 * Cinco larguras. Mede-se a altura da caixa da régua e o corpo do valor do
 * relance (tecto 56px), e conta-se qualquer par de caixas de rótulo do SVG que
 * se cruze — que é a medição que a subetapa 2g fez a 320 e a 390 e que agora se
 * faz também a 768, 1024 e 1280. */
{
  const serie = [];
  let bem = true;
  for (const largura of [320, 390, 768, 1024, 1280]) {
    const p = await pagina({ largura });
    await p.goto(`${base}/`, { waitUntil: 'networkidle' });
    /* Abaixo de 640 o instrumento está atrás de uma porta de palavras (2g,
       ponto 4). Uma medição feita com a porta fechada não mede nada: o SVG não
       tem caixa, e a célula diria «0 pares» sem ter olhado para um único
       rótulo. Abre-se a porta, que é o que o leitor faz. */
    const porta = await p.$('[data-conv-porta]');
    if (porta && (await porta.isVisible())) await porta.evaluate((d) => (d.open = true));
    const m = await p.evaluate(() => {
      const svg = document.querySelector('.rule-svg');
      const glance = document.querySelector('.glance-num');
      const rotulos = [...svg.querySelectorAll('text')].filter((e) => e.getClientRects().length);
      let pares = 0;
      for (let i = 0; i < rotulos.length; i++) {
        for (let j = i + 1; j < rotulos.length; j++) {
          const a = rotulos[i].getBoundingClientRect();
          const b = rotulos[j].getBoundingClientRect();
          if (a.right > b.left && b.right > a.left && a.bottom > b.top && b.bottom > a.top) pares++;
        }
      }
      return {
        altura: +svg.getBoundingClientRect().height.toFixed(1),
        largura: +svg.getBoundingClientRect().width.toFixed(1),
        relance: +parseFloat(getComputedStyle(glance).fontSize).toFixed(1),
        rotulos: rotulos.length,
        pares,
      };
    });
    if (m.pares > 0 || m.relance > 56.01) bem = false;
    serie.push({ w: largura, ...m });
    await p.__contexto.close();
  }
  conta(
    '2j · o Instrumento n.º 1 encolheu, e nenhum par de rótulos se cruza',
    bem,
    serie
      .map((x) => `${x.w}: régua ${x.largura}×${x.altura}px · relance ${x.relance}px · ${x.rotulos} rótulos, ${x.pares} pares`)
      .join(' · '),
  );
}

/* =============================================================== ETAPA 2k
 *
 * As duas correções reais da segunda leitura cruzada, triadas pela cadeira:
 * a palavra «provisório» ao pé das cópias desenhadas (achado 13) e o
 * `aria-controls` das duas divulgações por irmão (achado 16).
 * ====================================================================== */

/* (2k) A PALAVRA AO PÉ DA CÓPIA DESENHADA, NA ENTRADA DE LEGENDA DO SEU SELO.
 *
 * Dentro de um `<svg>` a palavra não pode ir ao pé do número (um `<span>` não é
 * filho de um `<text>`), e a decisão (d) manda-a estar ao pé do valor onde quer
 * que a fonte marque a linha como provisória. A direção decidiu o lugar: a
 * entrada da legenda de selos daquele valor, que é onde o selo já vive pela
 * convenção do §1.34.
 *
 * A célula mede na PÁGINA e não no ficheiro: para cada uma das seis linhas com
 * `source_flag: "p"`, conta as entradas de legenda que levam a palavra, e
 * confirma que ela está FORA do selo e FORA de qualquer `[data-claim]` — que é o
 * que faz `seloDaLinha()` e `formaDoValor()` continuarem a bater certo. As seis
 * linhas são lidas dos próprios `[data-claim]` desenhados, e não escritas aqui. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota, palavra] of [
    ['pt', '/', 'provisório'],
    ['en', '/en', 'provisional'],
  ]) {
    const p = await pagina();
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const m = await p.evaluate((palavra) => {
      const desenhadas = {};
      for (const el of document.querySelectorAll('[data-claim]')) {
        if (!el.closest('svg')) continue;
        const id = el.getAttribute('data-claim');
        desenhadas[id] = (desenhadas[id] || 0) + 1;
      }
      const legendas = [...document.querySelectorAll('[data-legenda-selos]')];
      const porLinha = {};
      let foraDoSelo = true;
      for (const id of Object.keys(desenhadas)) {
        porLinha[id] = 0;
        for (const legenda of legendas) {
          for (const chip of legenda.querySelectorAll('a.src-chip')) {
            const href = chip.getAttribute('href') || '';
            if (!href.replace(/\/$/, '').endsWith('/' + id)) continue;
            let entrada = chip.parentElement;
            while (entrada && entrada !== legenda && !entrada.querySelector('.claim-provisorio')) {
              entrada = entrada.parentElement;
            }
            const pal = entrada && entrada !== legenda ? entrada.querySelector('.claim-provisorio') : null;
            if (!pal || pal.textContent.trim() !== palavra) continue;
            if (pal.closest('a.src-chip') || pal.closest('[data-claim]')) foraDoSelo = false;
            porLinha[id]++;
          }
        }
      }
      return { desenhadas, porLinha, foraDoSelo };
    }, palavra);
    const ids = Object.keys(m.desenhadas).sort();
    /* Uma linha desenhada que a fonte NÃO marca como provisória não tem entrada
       com palavra nenhuma, e é o controlo negativo desta célula: a distância da
       régua é desenhada e não leva palavra. */
    const provisorias = ids.filter((id) => m.porLinha[id] > 0);
    const ok = provisorias.length === 6 && provisorias.every((id) => m.porLinha[id] === 2) && m.foraDoSelo;
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: ${ids.length} linhas desenhadas, ${provisorias.length} provisórias · ` +
        provisorias.map((id) => `${id}=${m.porLinha[id]}`).join(' ') +
        ` · fora do selo e do [data-claim]: ${m.foraDoSelo}`,
    );
    await p.__contexto.close();
  }
  conta('2k · a palavra «provisório» na entrada de legenda de cada cópia desenhada', bem, linhas.join(' · '));
}

/* (2k) AS DUAS DIVULGAÇÕES POR IRMÃO DIZEM O QUE ABREM.
 *
 * O «Menu» do cabeçalho e a porta do telemóvel do Instrumento n.º 1 revelam um
 * IRMÃO por `[open] ~`, e a razão está escrita nos dois sítios. O que faltava era
 * o atributo: `aria-controls` com o `id` do irmão, e um `aria-expanded` que
 * acompanha o `open`.
 *
 * A 390 a célula ABRE os dois a sério, com um toque, e vê o atributo virar e
 * voltar. A 1280 o comando do menu desaparece e a navegação está à vista, que é
 * o outro desenho da mesma folha. */
{
  const linhas = [];
  let bem = true;
  for (const [edicao, rota] of [
    ['pt', '/'],
    ['en', '/en'],
  ]) {
    const p = await pagina({ largura: 390 });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const alvos = await p.evaluate(() =>
      [...document.querySelectorAll('details > summary[aria-controls]')].map((sum) => {
        const id = sum.getAttribute('aria-controls');
        return {
          id,
          resolve: !!document.getElementById(id),
          irmao: !!(document.getElementById(id) && document.getElementById(id).parentElement === sum.parentElement.parentElement),
          inicial: sum.getAttribute('aria-expanded'),
        };
      }),
    );
    const passos = [];
    for (const alvo of alvos) {
      const sel = `details > summary[aria-controls="${alvo.id}"]`;
      await p.locator(sel).click();
      await p.waitForFunction(
        (s) => document.querySelector(s).getAttribute('aria-expanded') === 'true',
        sel,
        { timeout: 2000 },
      );
      const aberto = await p.evaluate(
        (s) => ({
          expandido: document.querySelector(s).getAttribute('aria-expanded'),
          open: document.querySelector(s).parentElement.open,
          corpoVisivel: !!document
            .getElementById(document.querySelector(s).getAttribute('aria-controls'))
            .getClientRects().length,
        }),
        sel,
      );
      await p.locator(sel).click();
      await p.waitForFunction(
        (s) => document.querySelector(s).getAttribute('aria-expanded') === 'false',
        sel,
        { timeout: 2000 },
      );
      const ok = alvo.resolve && alvo.inicial === 'false' && aberto.expandido === 'true' && aberto.open && aberto.corpoVisivel;
      if (!ok) bem = false;
      passos.push(`${alvo.id} resolve:${alvo.resolve} irmão:${alvo.irmao} ${alvo.inicial}→${aberto.expandido} corpo:${aberto.corpoVisivel}`);
    }
    if (alvos.length !== 2) bem = false;
    await p.__contexto.close();

    const q = await pagina({ largura: 1280 });
    await q.goto(base + rota, { waitUntil: 'networkidle' });
    const largo = await q.evaluate(() => {
      const sum = document.querySelector('.nav-menu > summary');
      const nav = document.getElementById('nav-principal');
      return {
        comando: !!sum.getClientRects().length,
        nav: !!nav.getClientRects().length,
      };
    });
    if (largo.comando || !largo.nav) bem = false;
    await q.__contexto.close();
    linhas.push(`${edicao}: 390 · ${passos.join(' · ')} · 1280 · comando à vista:${largo.comando} navegação à vista:${largo.nav}`);
  }
  conta('2k · as duas divulgações por irmão: aria-controls resolve e aria-expanded acompanha', bem, linhas.join(' · '));
}

/* --------------------------------------------------------------------- relatório */
/* ============================================================================
 * 2l · A SEGUNDA LEITURA DA PRÉ-VISUALIZAÇÃO N.º 1 (Emendas 15 a 17)
 * ========================================================================= */

/* (a) As duas bandas desenham DUAS referências, e a régua não transborda. */
{
  const p = await pagina();
  await p.goto(base + '/?densidade=leitura', { waitUntil: 'networkidle' });
  const b = await p.evaluate(() => {
    const alvo = ['saldo-da-balanca-corrente-2025', 'taxa-de-cambio-efectiva-real-2025'];
    return alvo.map((id) => {
      const peca = document.querySelector(`[data-medida="${id}"]`);
      const svg = peca.querySelector('.regua-svg');
      const refs = [...svg.querySelectorAll('.regua-ref')];
      const xs = refs.map((r) => Number(r.getAttribute('x1')));
      const linha = peca.querySelector('.peca-limiar').textContent.replace(/\s+/g, ' ').trim();
      const algarismos = [...peca.querySelectorAll('.peca-limiar [data-nonledger="limiar-do-quadro"]')].map(
        (e) => e.textContent.trim(),
      );
      return {
        id,
        refs: refs.length,
        distintas: new Set(xs).size,
        dentroDaCaixa: xs.every((x) => x >= 0 && x <= 600),
        linha,
        algarismos,
        estado: peca.getAttribute('data-estado'),
      };
    });
  });
  conta(
    '2l · a banda desenha duas referências, e os dois algarismos vão marcados',
    b.every((r) => r.refs === 2 && r.distintas === 2 && r.dentroDaCaixa && r.algarismos.length === 2 && r.estado === 'dentro'),
    b.map((r) => `${r.id}: ${r.refs} referências em ${r.distintas} posições · «${r.linha}»`).join(' · '),
  );
  await p.__contexto.close();
}

/* (b) O Painel Social Europeu: oito linhas, sem cor, com o selo fora de
   qualquer outro alvo e com área de toque de 44px. */
{
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const soc = await p.evaluate(() => {
    const lista = [...document.querySelectorAll('.social-linha')];
    const selos = lista.map((l) => {
      const a = l.querySelector('a.src-chip');
      if (!a) return null;
      const depois = getComputedStyle(a, '::after');
      const r = a.getBoundingClientRect();
      /* A mesma medição da célula dos selos da peça: a caixa do elemento e a da
         área de toque, e fica a maior das duas. */
      const largura = Math.max(r.width, parseFloat(depois.width) || 0, parseFloat(depois.minWidth) || 0);
      const altura = Math.max(r.height, parseFloat(depois.height) || 0);
      let aninhado = null;
      for (let no = a.parentElement; no; no = no.parentElement) {
        const t = no.tagName.toLowerCase();
        if (t === 'a' || t === 'button' || t === 'summary') { aninhado = t; break; }
      }
      return { largura: +largura.toFixed(1), altura: +altura.toFixed(1), aninhado };
    });
    return {
      n: lista.length,
      semSelo: selos.filter((x) => x === null).length,
      aninhados: selos.filter((x) => x && x.aninhado !== null).length,
      pequenos: selos.filter((x) => x && (x.altura < 44 || x.largura < 44)).length,
      marcadores: document.querySelectorAll('.social-linha .sq').length,
      palavras: document.querySelectorAll('.social-linha .peca-palavra, .social-linha .peca-estado').length,
      valores: document.querySelectorAll('.social-linha [data-claim]').length,
      medida: selos[0],
    };
  });
  conta(
    '2l · Emenda 16 · a lista social tem oito linhas, sem cor e com o selo fora de outro alvo',
    soc.n === 8 && soc.semSelo === 0 && soc.aninhados === 0 && soc.pequenos === 0 &&
      soc.marcadores === 0 && soc.palavras === 0 && soc.valores === 8,
    `${soc.n} linhas · ${soc.valores} valores · selo ${soc.medida?.largura}×${soc.medida?.altura}px · aninhados ${soc.aninhados} · marcadores ${soc.marcadores}`,
  );
  await p.__contexto.close();
}

/* (c) Emenda 17: a cabeça em duas colunas a partir de 1024, sem transbordo. */
{
  const linhas = [];
  let bem = true;
  for (const largura of [1024, 1180, 1280]) {
    for (const rota of ['/', '/en/']) {
      const p = await pagina({ largura });
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => {
        const grelha = document.querySelector('[data-grelha]');
        const cs = getComputedStyle(grelha);
        const texto = document.querySelector('.cabeca-col').getBoundingClientRect();
        const mapa = document.querySelector('[data-mapa-raiz]').getBoundingClientRect();
        return {
          colunas: cs.gridTemplateColumns,
          duas: cs.gridTemplateColumns.split(' ').length === 2,
          textoEsquerda: Math.round(texto.left),
          mapaEsquerda: Math.round(mapa.left),
          mapaLargura: Math.round(mapa.width),
          transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const ok = m.duas && m.mapaEsquerda > m.textoEsquerda && m.transbordo <= 0;
      if (!ok) bem = false;
      linhas.push(`${largura}${rota === '/' ? ' pt' : ' en'}: ${m.colunas} · mapa a ${m.mapaEsquerda}px (${m.mapaLargura}px) · transbordo ${m.transbordo}`);
      await p.__contexto.close();
    }
  }
  conta('2l · Emenda 17 · o texto à esquerda e o mapa à direita, de 1024 para cima', bem, linhas.join(' · '));
}

/* (d) As duas chaves novas da prova rendem-se e batem certo com o `prova.json`
   que o portão escreveu. A célula não recalcula nada: compara o que a página
   escreve com o que o portão gravou, que são duas contas independentes. */
{
  const p = await pagina();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const provaJson = await p.evaluate(async () => (await fetch('/prova.json')).json());
  const na = await p.evaluate(() =>
    [...document.querySelectorAll('[data-prova]')].map((e) => [
      e.getAttribute('data-prova'),
      e.textContent.trim(),
    ]),
  );
  const mapa = Object.fromEntries(na);
  const chaves = provaJson.prova;
  const valor = (k) => (chaves[k]?.valor ?? chaves[k]);
  conta(
    '2l · as chaves novas da prova: a página e o portão dizem o mesmo',
    String(valor('painel_dentro_do_limiar')) === mapa.painel_dentro_do_limiar &&
      String(valor('painel_fora_do_limiar')) === mapa.painel_fora_do_limiar &&
      String(valor('painel_total')) === '13' &&
      String(valor('painel_social_total')) === '8',
    `fora ${mapa.painel_fora_do_limiar}/${valor('painel_fora_do_limiar')} · dentro ${mapa.painel_dentro_do_limiar}/${valor('painel_dentro_do_limiar')} · total ${valor('painel_total')} · social ${valor('painel_social_total')}`,
  );
  await p.__contexto.close();
}

/* (e) O inventário das frases da casa: autorreferência a zero, nas duas
   edições. A conta é a da régua `medir-defeitos.mjs`, lida do seu JSON: a
   matriz não a refaz, porque duas implementações da mesma definição diriam a
   mesma coisa por construção. O que a matriz garante é que o alvo é conferido a
   cada corrida e não só quando alguém se lembra de correr a régua. */
{
  const { execFileSync } = await import('node:child_process');
  const saida = execFileSync(process.execPath, [path.join(RAIZ, 'scripts', 'medir-defeitos.mjs'), '--json'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const m = JSON.parse(saida).frases_da_casa;
  const rotas = Object.entries(m.por_rota);
  /* A CÉLULA PERGUNTA PELA PRIMEIRA PÁGINA, E A RÉGUA PASSOU A MEDIR MAIS ROTAS.
     A etapa 3 pôs `/livro-razao` e `/municipios` na lista declarada da medida 8,
     e o índice do livro-razão fica com DUAS frases de autorreferência que a
     `DECISIONS.md` §4 item AB manda preservar palavra por palavra até à fase da
     voz (nota da etapa 3, §3.3). A célula exigia zero em todas as rotas medidas,
     e por isso passou a falhar por uma decisão registada e não por um defeito.
     O que ela mede agora é o que o seu nome diz: zero na PRIMEIRA PÁGINA, nas
     duas edições, e nada por classificar em rota nenhuma — que é a condição que
     obriga alguém a decidir. As outras rotas continuam impressas na prova, para
     que o número não desapareça de vista. */
  const daPrimeira = rotas.filter(([rota]) => rota === '/' || rota === '/en');
  conta(
    '2l · Emenda 15 · zero frases de autorreferência na primeira página, nas duas edições',
    m.inventario_existe &&
      daPrimeira.length === 2 &&
      daPrimeira.every(([, r]) => r.por_classe.autorreferencia === 0) &&
      rotas.every(([, r]) => r.nao_classificados.length === 0),
    rotas
      .map(([rota, r]) => `${rota}: conteúdo ${r.por_classe.conteudo} · navegação ${r.por_classe.navegacao} · autorreferência ${r.por_classe.autorreferencia} · por classificar ${r.nao_classificados.length}`)
      .join(' · '),
  );
}

/* ============================================================================
 * (f) A ETAPA 2M · o mapa que enche a coluna e cresce para se escolher nele
 * ========================================================================== */

/* A distância mínima entre dois centróides, calculada AQUI a partir dos mesmos
   dados que a página desenha — 2,816 unidades de campo, Lajes das Flores e Santa
   Cruz das Flores. A matriz não pergunta à página se ela concorda com ela
   própria: lê o desenho construído e compara com esta conta. */
const MINIMA_EM_UNIDADES = (() => {
  const cs = concelhos();
  let d = Infinity;
  for (let i = 0; i < cs.length; i++) {
    for (let j = i + 1; j < cs.length; j++) {
      const e = Math.hypot(cs[i].x - cs[j].x, cs[i].y - cs[j].y);
      if (e < d) d = e;
    }
  }
  return d;
})();

/** O par mais próximo do desenho real, em CSS px. */
const minimaNoDesenho = () => {
  const nos = [...document.querySelectorAll('[data-pontos] [data-caop]')].map((n) => {
    const r = n.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  let d = Infinity;
  for (let i = 0; i < nos.length; i++) {
    for (let j = i + 1; j < nos.length; j++) {
      const e = Math.hypot(nos[i].x - nos[j].x, nos[i].y - nos[j].y);
      if (e < d) d = e;
    }
  }
  return d;
};

/* (f1) O mapa enche a coluna, e a legenda vai para o canto que as ilhas deixam. */
{
  const linhas = [];
  let bem = true;
  for (const largura of [1024, 1180, 1280, 1440]) {
    for (const rota of ['/', '/en/']) {
      const p = await pagina({ largura });
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => {
        const coluna = document.querySelector('.cabeca-inst').getBoundingClientRect();
        const tela = document.querySelector('.mapa-tela').getBoundingClientRect();
        const legenda = document.querySelector('.mapa-linha-fonte').getBoundingClientRect();
        return {
          coluna: +coluna.width.toFixed(1),
          mapa: +tela.width.toFixed(1),
          altura: +tela.height.toFixed(1),
          /* A legenda, em UNIDADES DO CAMPO: é assim que a instrução está
             escrita («à direita da moldura dos Açores, que acaba em x=264; por
             baixo do ponto mais a sul à direita dela, y=686,1»), e é assim que
             ela se confere sem depender da largura da página. */
          legX: +(((legenda.left - tela.left) / tela.width) * 600).toFixed(1),
          legY: +(((legenda.top - tela.top) / tela.height) * 790).toFixed(1),
          transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const ok =
        Math.abs(m.mapa - m.coluna) < 1 &&
        m.legX >= 264 &&
        m.legY >= 690.6 &&
        m.transbordo <= 0;
      if (!ok) bem = false;
      linhas.push(
        `${largura}${rota === '/' ? ' pt' : ' en'}: coluna ${m.coluna} · mapa ${m.mapa}×${m.altura} · legenda em x=${m.legX} y=${m.legY} do campo · transbordo ${m.transbordo}`,
      );
      await p.__contexto.close();
    }
  }
  conta('2m · o mapa enche a coluna da cabeça, e a legenda vai para o canto das ilhas', bem, linhas.join(' · '));
}

/* (f2) A vista de escolha: endereço próprio, largura do conteúdo, vizinhos mais
   separados e alvos maiores. */
{
  const linhas = [];
  let bem = true;
  for (const largura of [1024, 1280, 1440]) {
    for (const rota of ['/', '/en/']) {
      const p = await pagina({ largura });
      await p.goto(base + rota, { waitUntil: 'networkidle' });
      const antes = await p.evaluate(minimaNoDesenho);
      await p.goto(base + rota + '?ambito=municipio', { waitUntil: 'networkidle' });
      const m = await p.evaluate(() => {
        const raiz = document.querySelector('[data-inicio]');
        const conteudo = document.querySelector('[data-grelha]').getBoundingClientRect();
        const tela = document.querySelector('.mapa-tela').getBoundingClientRect();
        const alvos = [...document.querySelectorAll('[data-alvos] [data-caop]')].map(
          (n) => n.getBoundingClientRect().width,
        );
        alvos.sort((a, b) => a - b);
        return {
          ambito: raiz.getAttribute('data-ambito'),
          url: location.pathname + location.search,
          cabeca: document.querySelector('[data-cabeca]:not([hidden])')?.getAttribute('data-cabeca'),
          painel: document.querySelector('[data-painel]:not([hidden])')?.getAttribute('data-painel'),
          pesquisaAcima:
            document.querySelector('[data-sub="municipio"]').getBoundingClientRect().bottom <=
            tela.top + 1,
          conteudo: +conteudo.width.toFixed(1),
          mapa: +tela.width.toFixed(1),
          alvoMin: +alvos[0].toFixed(1),
          alvo24: alvos.filter((a) => a >= 24).length,
          fechar: (() => {
            const e = document.querySelector('[data-fechar-mapa]');
            const r = e.getBoundingClientRect();
            return { visivel: e.getClientRects().length > 0, w: Math.round(r.width), h: Math.round(r.height) };
          })(),
          transbordo: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      const depois = await p.evaluate(minimaNoDesenho);
      const ok =
        m.ambito === 'municipio' &&
        /\?ambito=municipio$/.test(m.url) &&
        m.cabeca === 'pais' &&
        m.painel === 'pais' &&
        m.pesquisaAcima &&
        Math.abs(m.mapa - m.conteudo) < 1 &&
        depois > antes &&
        m.alvoMin >= 20 &&
        m.fechar.visivel &&
        m.fechar.h >= 44 &&
        m.transbordo <= 0;
      if (!ok) bem = false;
      linhas.push(
        `${largura}${rota === '/' ? ' pt' : ' en'}: ${m.url} · mapa ${m.mapa} de ${m.conteudo} · mínimo entre pontos ${antes.toFixed(2)}px → ${depois.toFixed(2)}px · alvo mínimo ${m.alvoMin}px, ${m.alvo24} de 308 acima de 24px · fechar ${m.fechar.w}×${m.fechar.h} · transbordo ${m.transbordo}`,
      );
      await p.__contexto.close();
    }
  }
  conta(
    `2m · a vista de escolha abre à largura do conteúdo, e os vizinhos separam-se (mínimo ${MINIMA_EM_UNIDADES.toFixed(3)} unidades de campo)`,
    bem,
    linhas.join(' · '),
  );
}

/* (f3) A lente: 1× a 4×, o toque duplo repõe, e fora da vista de escolha a roda
   é da página. */
{
  const p = await pagina({ largura: 1280 });
  await p.goto(base + '/?ambito=municipio', { waitUntil: 'networkidle' });
  const transforma = () => p.evaluate(() => document.querySelector('[data-campo]').getAttribute('transform'));
  const escala = async () => {
    const t = await transforma();
    const m = /scale\(([\d.]+)\)/.exec(t ?? '');
    return m ? +(+m[1]).toFixed(3) : 1;
  };
  await p.evaluate(() => document.querySelector('.mapa-tela').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(80);
  const sitio = await p.evaluate(() => {
    const r = document.querySelector('.mapa-tela').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: Math.max(20, r.top) + 300 };
  });
  await p.mouse.move(sitio.x, sitio.y);
  const partida = await escala();
  const minimaAntes = await p.evaluate(minimaNoDesenho);
  for (let i = 0; i < 40; i++) await p.mouse.wheel(0, -100);
  const tecto = await escala();
  const minimaNoTecto = await p.evaluate(minimaNoDesenho);
  /* A LEITURA CONTINUA A DIZER O NOME CERTO DEBAIXO DA LENTE, e é a prova de que
     a conversão de coordenadas passou a atravessar a transformação em vez de
     ler o rectângulo cru. Mede-se sobre um concelho concreto: onde é que o
     desenho o pôs AGORA (o rectângulo do próprio nó já traz a lente aplicada), e
     o que a página lê quando o cursor lá está. Um sítio escolhido em píxeis do
     ecrã cairia no mar, que é onde o mapa não tem nada a dizer. */
  const alvoVisivel = await p.evaluate(() => {
    for (const n of document.querySelectorAll('[data-pontos] [data-caop]')) {
      const b = n.getBoundingClientRect();
      const x = b.left + b.width / 2;
      const y = b.top + b.height / 2;
      if (x > 8 && x < innerWidth - 8 && y > 8 && y < innerHeight - 8) {
        return { x: x, y: y, nome: n.getAttribute('data-m') };
      }
    }
    return null;
  });
  await p.mouse.move(alvoVisivel.x, alvoVisivel.y);
  const leAmpliado = await p.evaluate(() =>
    document.querySelector('[data-readout-nome]').textContent.trim(),
  );
  for (let i = 0; i < 60; i++) await p.mouse.wheel(0, 100);
  const piso = await escala();
  for (let i = 0; i < 15; i++) await p.mouse.wheel(0, -100);
  const meio = await escala();
  await p.mouse.dblclick(sitio.x, sitio.y);
  const reposta = await escala();
  /* Fora da vista de escolha a roda não é apanhada: rola a página. */
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.mouse.move(sitio.x, 400);
  for (let i = 0; i < 5; i++) await p.mouse.wheel(0, 200);
  await p.waitForTimeout(120);
  const rolou = await p.evaluate(() => window.scrollY);
  const semLente = await transforma();
  conta(
    '2m · a lente do mapa vai de 1× a 4×, o toque duplo repõe, e no âmbito País a roda é da página',
    partida === 1 &&
      tecto === 4 &&
      piso === 1 &&
      meio > 1 &&
      meio < 4 &&
      reposta === 1 &&
      minimaNoTecto > minimaAntes * 3.9 &&
      leAmpliado === alvoVisivel.nome &&
      rolou > 0 &&
      semLente === null,
    `1× → 40 entalhes ${tecto}× (mínimo entre pontos ${minimaAntes.toFixed(2)}px → ${minimaNoTecto.toFixed(2)}px) → 60 para baixo ${piso}× → 15 para cima ${meio}× → toque duplo ${reposta}× · com a lente no tecto, o cursor sobre o ponto de ${alvoVisivel.nome} lê «${leAmpliado}» · no País a roda rolou ${rolou}px e o campo não tem transformação`,
  );
  await p.__contexto.close();
}

/* (f4) A saída da vista de escolha: «fechar», Escape, e o Escape da pesquisa que
   continua a ser o da pesquisa. */
{
  const linhas = [];
  let bem = true;
  for (const via of ['fechar', 'escape']) {
    const p = await pagina({ largura: 1280 });
    await p.goto(base + '/?ambito=municipio', { waitUntil: 'networkidle' });
    if (via === 'fechar') await p.locator('[data-fechar-mapa]').click();
    else await p.keyboard.press('Escape');
    const e = await p.evaluate(() => ({
      ambito: document.querySelector('[data-inicio]').getAttribute('data-ambito'),
      url: location.pathname + location.search,
      foco: document.activeElement?.getAttribute('data-modo') ?? document.activeElement?.tagName,
      mapa: Math.round(document.querySelector('.mapa-tela').getBoundingClientRect().width),
      coluna: Math.round(document.querySelector('.cabeca-inst').getBoundingClientRect().width),
    }));
    const ok = e.ambito === 'pais' && e.url === '/' && e.foco === 'municipio' && e.mapa === e.coluna;
    if (!ok) bem = false;
    linhas.push(`${via}: ${e.ambito} · «${e.url}» · foco no comando «${e.foco}» · mapa ${e.mapa}px na coluna de ${e.coluna}px`);
    await p.__contexto.close();
  }
  {
    const p = await pagina({ largura: 1280 });
    await p.goto(base + '/?ambito=municipio', { waitUntil: 'networkidle' });
    await p.locator('[data-pesquisa]').fill('beja');
    await p.locator('[data-pesquisa]').press('Escape');
    const e = await p.evaluate(() => ({
      campo: document.querySelector('[data-pesquisa]').value,
      ambito: document.querySelector('[data-inicio]').getAttribute('data-ambito'),
    }));
    const ok = e.campo === '' && e.ambito === 'municipio';
    if (!ok) bem = false;
    linhas.push(`Escape na pesquisa: caixa «${e.campo}» e a vista continua em ${e.ambito}`);
    await p.__contexto.close();
  }
  conta('2m · «fechar» e Escape devolvem o mapa à coluna, e o Escape da pesquisa continua a ser o da pesquisa', bem, linhas.join(' · '));
}

/* (f5) O anel de leitura é um anel, e não um disco (achado da 2m). */
{
  const p = await pagina({ largura: 1280 });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const sitio = await p.evaluate(() => {
    const b = document.querySelector('.mapa-svg').getBoundingClientRect();
    return { x: b.left + b.width * 0.74, y: b.top + b.height * 0.64 };
  });
  await p.mouse.move(sitio.x, sitio.y);
  const a = await p.evaluate(() => {
    const anel = document.querySelector('.cursor-ring');
    if (!anel) return null;
    const cs = getComputedStyle(anel);
    return {
      fill: cs.fill,
      stroke: cs.stroke,
      tinta: getComputedStyle(document.documentElement).getPropertyValue('--ink').trim(),
      dentroDoCampo: !!anel.closest('[data-campo]'),
      leitura: document.querySelector('[data-readout-nome]').textContent.trim(),
    };
  });
  conta(
    '2m · o anel de leitura do mapa é um anel e não um disco (Emenda 10)',
    !!a && a.fill === 'none' && a.dentroDoCampo && a.leitura.length > 0,
    a ? `enchimento ${a.fill} · contorno ${a.stroke} · dentro do grupo da lente ${a.dentroDoCampo} · lê «${a.leitura}»` : 'sem anel',
  );
  await p.__contexto.close();
}

/* (f6) A LEDE DIZ AS MESMAS MEDIDAS QUE O PAINEL MARCA, e pela mesma ordem.
 *
 * Duas leituras da MESMA página, e nenhuma delas é a função que compôs a frase:
 * os nomes das peças cujo `data-estado` é «fora», pela ordem do documento, contra
 * os nomes que a lede nomeia, partidos pelos separadores da edição. O portão já
 * compara a CONTAGEM com a chave da prova; o que esta célula acrescenta é que os
 * nomes são aqueles e não outros quaisquer. */
{
  const linhas = [];
  let bem = true;
  for (const [rota, edicao, ultimo] of [['/', 'pt', ' e '], ['/en/', 'en', ' and ']]) {
    const p = await pagina({ largura: 1280 });
    await p.goto(base + rota, { waitUntil: 'networkidle' });
    const e = await p.evaluate(() => ({
      /* As peças do painel do País marcadas «fora», pela ordem do documento. */
      fora: [...document.querySelectorAll('[data-painel="pais"] .peca[data-estado="fora"]')].map(
        (a) => a.querySelector('[data-medida-nome]').textContent.trim(),
      ),
      lista: document.querySelector('[data-prova-lista]')?.textContent.trim() ?? null,
      chave: document.querySelector('[data-prova-lista]')?.getAttribute('data-prova-lista') ?? null,
      manchete: document.querySelector('[data-prova="painel_fora_do_limiar"]')?.textContent.trim(),
      lede: document.querySelector('.cabeca-lede')?.textContent.trim() ?? null,
      /* O ano da lede é o único algarismo que a frase escreve, e sai marcado. */
      ano: document.querySelector('.cabeca-lede [data-nonledger="data-de-referencia"]')?.textContent.trim() ?? null,
      /* … e tem de ser o período que as próprias peças declaram. */
      periodos: [...document.querySelectorAll('[data-painel="pais"] .peca[data-estado="fora"]')].map(
        (a) => a.querySelector('[data-medida-unidade]')?.textContent.trim() ?? '',
      ),
    }));
    const nomes = (e.lista ?? '').split(new RegExp(`,\\s+|${ultimo.replace(/\s/g, '\\s')}`));
    const esperados = e.fora.map((n) => n.charAt(0).toLowerCase() + n.slice(1));
    const ok =
      e.chave === 'painel_fora_do_limiar' &&
      nomes.length === e.fora.length &&
      String(e.fora.length) === e.manchete &&
      nomes.every((n, i) => n === esperados[i]) &&
      !!e.ano &&
      e.periodos.every((u) => u.includes(e.ano));
    if (!ok) bem = false;
    linhas.push(
      `${edicao}: manchete ${e.manchete} · lista de ${nomes.length} — «${nomes.join(' | ')}» · peças fora: «${esperados.join(' | ')}» · ano ${e.ano}, em todas as unidades das peças: ${e.periodos.every((u) => u.includes(e.ano))} · lede «${e.lede}»`,
    );
    await p.__contexto.close();
  }
  conta('2m · a lede nomeia as medidas que o painel marca fora, pela ordem do painel, nas duas edições', bem, linhas.join(' · '));
}

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
