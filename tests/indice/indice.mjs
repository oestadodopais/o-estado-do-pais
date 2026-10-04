#!/usr/bin/env node
/**
 * ===========================================================================
 * check:indice-do-sitio · O ÍNDICE E O MAPA DO SÍTIO DIZEM AS MESMAS PÁGINAS DO LEITOR
 * (bloco R3, 04.10.2026, `design/observatorio/BRIEF-R3-o-indice-do-sitio.md`, §3, ponto 3)
 * ===========================================================================
 *
 * Chama-se `check:indice-do-sitio` para não colidir com o `check:indice`, que é a régua do índice
 * do livro-razão (`tests/livro/indice.mjs`).
 *
 * LEITOR PRÓPRIO. Lê só o que foi construído e a tabela das rotas: as duas páginas do índice, o
 * mapa do sítio (`dist/sitemap-*.xml`), as páginas de cada família, a lista dos estudos, as páginas
 * dos distritos e o registo das mudanças. Não importa `src/lib/indice.mjs`, nem as vistas, nem os
 * módulos de dados que o índice lê: uma conferência que usasse o código da página confirmava-se a
 * si própria.
 *
 *   I1 · cada porta do índice resolve num ficheiro construído pela regra da Vercel: um caminho sem
 *        extensão é uma pasta com o seu `index.html`, e nunca o ficheiro `.html` irmão (medido no
 *        ar a 04.10.2026: `/en/index` dava 404 com `en/index.html` presente); para `/en/index` o
 *        irmão seria a primeira página inglesa, e um resolvedor que o aceitasse daria por boa uma
 *        porta que no ar não abre o índice;
 *   I2 · o índice e o mapa do sítio dizem as mesmas páginas do leitor: cada endereço do mapa é uma
 *        porta do índice da mesma edição, menos as famílias por dado que entram pela sua lista (as
 *        linhas, pelo índice das linhas; os livros dos concelhos, pelo índice dos concelhos do
 *        livro-razão), cuja lista tem de ser uma porta, e menos a própria página; e cada porta do
 *        índice está no mapa, menos as páginas que levam `noindex` e que a lista da sua família
 *        também lista (os estudos sem leitura escrita, que a lista dos estudos mostra e o filtro do
 *        mapa do sítio exclui por escrito, em `astro.config.mjs`);
 *   I3 · todas as rotas de leitor da tabela estão no índice, nas duas edições: cada chave com páginas
 *        construídas tem a porta de cada uma, menos as páginas do resultado da caixa das sugestões,
 *        que não podem estar (§1.154), as famílias que entram pela sua lista, as edições datadas
 *        dos estudos com sucessor (§1.145) e a própria página;
 *   I4 · os 308 concelhos estão todos, uma vez cada, dentro de uma gaveta fechada, e cada gaveta tem
 *        exatamente os concelhos que a página construída do seu distrito ou ilha lista;
 *   I5 · os estudos do índice são os da lista dos estudos da mesma edição, pela mesma ordem, cada um
 *        com a mesma porta e a mesma data;
 *   I6 · «O que mudou» do índice é o começo do registo: as primeiras oito linhas distintas entre as
 *        correções e as atualizações do registo construído, cada uma com a sua entrada mais recente,
 *        a mesma data e os mesmos dois valores, e com a marca da fonte para o recibo da sua linha;
 *   I7 · nenhum destino se repete no corpo do índice (a regra da L1 do `check:lugar`, com as mesmas
 *        duas dispensas: a porta obrigatória do rótulo de IA e o marcador de um título por
 *        confirmar).
 *
 * PLANTAS (`--prova`), em memória, sobre cópias do HTML construído e do mapa lido, cada uma com a
 * queixa que tem de dar: uma rota tirada do índice, um concelho a menos, uma porta que não resolve,
 * uma porta para uma página que só existe como ficheiro `.html` irmão, uma página do resultado no
 * índice, um endereço do mapa sem porta, um estudo da lista em falta, um concelho na gaveta de
 * outro distrito, uma gaveta aberta, e uma linha repetida em «O que mudou». O índice intacto tem de
 * passar antes delas.
 *
 * Uso: node tests/indice/indice.mjs [--prova] [--json <ficheiro>]   (`OEDP_DIST` mede outra construção)
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { LANGS, matchPath, normalizePath, routePath } from '../../src/lib/routes.mjs';

const DIST = process.env.OEDP_DIST ?? 'dist';

/** As famílias por dado que entram pela sua lista, e a chave da página dessa lista. */
const PELA_LISTA = { linha: 'livro', livroConcelho: 'livroConcelhos', documento: 'estudo' };
/** As páginas do resultado da caixa das sugestões: fora dos índices e do mapa do sítio (§1.154). */
const RESULTADO_DA_CAIXA = new Set(['sugestoesObrigado', 'sugestoesVazia', 'sugestoesLimite', 'sugestoesNaoChegou']);
/** As famílias cujas páginas com `noindex` o índice lista, e a página da lista que também as lista. */
const LISTA_DA_FAMILIA = { estudo: 'estudos' };
/** O teto do que uma lista «O que mudou» mostra, escrito aqui e não importado (é o da A2 do `check:pais`). */
const TETO = 8;

const desfaz = (s) =>
  String(s ?? '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const texto = (no) => desfaz(no?.textContent ?? '').replace(/\s+/g, ' ').trim();
/** O destino de uma porta, sem a âncora nem a consulta, na forma da tabela das rotas. */
const destino = (href) => normalizePath(decodeURIComponent(desfaz(href).split('#')[0].split('?')[0]));
const ficheiroDaRota = (caminho) => path.join(DIST, caminho.replace(/^\//, ''), 'index.html');

/**
 * I1 · A REGRA DA VERCEL: um caminho com extensão é esse ficheiro; um sem extensão é uma pasta com o
 * seu `index.html`. Nunca `<caminho>.html`.
 * @param {string} caminho
 * @param {(f: string) => boolean} existe
 */
export function resolve(caminho, existe = (f) => fs.existsSync(f) && fs.statSync(f).isFile()) {
  const limpo = caminho.replace(/\/+$/, '');
  if (/\.[a-z0-9]+$/i.test(limpo)) return existe(path.join(DIST, limpo.replace(/^\//, ''))) ? limpo : null;
  const f = limpo === '' ? path.join(DIST, 'index.html') : path.join(DIST, limpo.replace(/^\//, ''), 'index.html');
  return existe(f) ? f : null;
}

/** As portas do corpo de uma página do índice, com as dispensas da L1 e sem as da lista das mudanças. */
function portasDoIndice(doc, lang) {
  const main = doc.querySelector('main');
  if (!main) return { portas: [], seccoes: [], todas: [] };
  const marcador = routePath('marcador', lang);
  const dispensada = (a) =>
    a.closest('[data-rotulo-ia="topo"]') !== null ||
    ((a.getAttribute('class') ?? '').split(/\s+/).includes('marcador-de-titulo') && destino(a.getAttribute('href')) === marcador);
  const todas = main.querySelectorAll('a[href]').filter((a) => !dispensada(a));
  const portas = todas.filter((a) => a.closest('[data-mudou-ambito]') === null);
  return { portas, todas, seccoes: main.querySelectorAll('[data-indice-seccao]').map((s) => s.getAttribute('data-indice-seccao')) };
}

/** Os caminhos do mapa do sítio construído. */
function lerMapa(dist = DIST) {
  const ficheiros = fs.readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f));
  const caminhos = new Set();
  for (const f of ficheiros) {
    for (const m of fs.readFileSync(path.join(dist, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      caminhos.add(normalizePath(decodeURIComponent(new URL(desfaz(m[1].trim())).pathname)));
    }
  }
  return { ficheiros, caminhos };
}

/** As páginas construídas, por caminho: `dist/x/index.html` → `/x`. */
function lerPaginas(dist = DIST) {
  const saida = [];
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name === 'index.html') saida.push(normalizePath('/' + path.relative(dist, dir).split(path.sep).join('/')));
    }
  };
  anda(dist);
  return saida;
}

const ler = (caminho) => {
  const f = ficheiroDaRota(caminho);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};

/**
 * TODAS AS CONFERÊNCIAS, sobre o que lhe derem: as páginas do índice já lidas, o mapa e as páginas
 * construídas. As plantas chamam esta função com cópias estragadas.
 * @param {{ indice: Record<string, string>, mapa: Set<string>, paginas: string[], existe?: (f: string) => boolean }} entrada
 */
export function conferirIndice({ indice, mapa, paginas, existe }) {
  const erros = [];
  const contas = {};
  /* As chaves das páginas construídas, por edição. */
  const porChave = new Map();
  for (const p of paginas) {
    const r = matchPath(p);
    if (!r) continue;
    const k = `${r.key}|${r.lang}`;
    if (!porChave.has(k)) porChave.set(k, []);
    porChave.get(k).push(p);
  }
  for (const lang of LANGS) {
    const proprio = normalizePath(routePath('indice', lang));
    const cru = indice[lang];
    if (!cru) { erros.push(`I0 ${lang}: a página do índice ${proprio} não foi construída.`); continue; }
    const doc = parse(cru);
    const { portas, todas, seccoes } = portasDoIndice(doc, lang);
    const destinos = portas.map((a) => destino(a.getAttribute('href')));
    const noIndice = new Set(destinos);
    contas[lang] = { portas: portas.length, destinos: noIndice.size, seccoes };

    /* I1 · cada porta resolve, pela regra da Vercel. */
    for (const a of todas) {
      const d = destino(a.getAttribute('href'));
      if (!resolve(d, existe)) erros.push(`I1 ${lang}: a porta «${texto(a)}» para ${d} não resolve num ficheiro construído (a pasta com o seu index.html, ou o ficheiro com extensão).`);
    }

    /* I2 · o mapa do sítio, de um lado e do outro. */
    let doMapa = 0;
    for (const c of mapa) {
      const r = matchPath(c);
      if (!r || r.lang !== lang || c === proprio) continue;
      if (r.key in PELA_LISTA) continue;
      doMapa++;
      if (!noIndice.has(c)) erros.push(`I2 ${lang}: ${c} está no mapa do sítio e não tem porta no índice.`);
    }
    for (const [familia, lista] of Object.entries(PELA_LISTA)) {
      if (familia === 'documento') continue; // a página do estudo é a lista, e cada estudo é uma porta (I3)
      const caminho = normalizePath(routePath(/** @type {ChaveDeRota} */ (lista), lang));
      if (!noIndice.has(caminho)) erros.push(`I2 ${lang}: as páginas de «${familia}» entram pela lista ${caminho}, e ela não é uma porta do índice.`);
    }
    for (const d of noIndice) {
      if (mapa.has(d)) continue;
      const r = matchPath(d);
      const pagina = ler(d);
      const comNoindex = pagina !== null && /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(pagina);
      const lista = r ? LISTA_DA_FAMILIA[/** @type {keyof typeof LISTA_DA_FAMILIA} */ (r.key)] : undefined;
      const naLista = lista ? (ler(routePath(/** @type {ChaveDeRota} */ (lista), lang)) ?? '').includes(`href="${d}"`) : false;
      if (!(comNoindex && naLista)) erros.push(`I2 ${lang}: a porta ${d} não está no mapa do sítio${comNoindex ? '' : ' e a página não leva noindex'}${lista ? (naLista ? '' : ', e a lista da família não a lista') : ', e a família dela não tem lista que a mostre'}.`);
    }
    contas[lang].enderecosDoMapa = doMapa;

    /* I3 · todas as rotas de leitor da tabela. */
    let rotas = 0;
    for (const [k, caminhos] of porChave) {
      const [chave, l] = k.split('|');
      if (l !== lang) continue;
      if (chave === 'indice' || chave in PELA_LISTA) continue;
      if (RESULTADO_DA_CAIXA.has(chave)) {
        for (const c of caminhos) if (noIndice.has(c)) erros.push(`I3 ${lang}: a página do resultado ${c} está no índice, e as páginas do resultado ficam fora dos índices (§1.154).`);
        continue;
      }
      rotas++;
      for (const c of caminhos) {
        if (chave === 'estudo' && /data-sucessor-edicao/.test(ler(c) ?? '')) {
          if (noIndice.has(c)) erros.push(`I3 ${lang}: a edição datada ${c} tem sucessor e está no índice; fica fora, como na lista dos estudos (§1.145).`);
          continue;
        }
        if (!noIndice.has(c)) erros.push(`I3 ${lang}: a página ${c} (rota «${chave}») foi construída e não tem porta no índice.`);
      }
    }
    contas[lang].rotasDeLeitor = rotas;

    /* I4 · os concelhos, dobrados por distrito. */
    const prefixo = routePath('municipio', lang, { slug: 'x' }).replace(/x$/, '');
    const eConcelho = (h) => h.startsWith(prefixo) && !h.slice(prefixo.length).includes('/');
    const concelhosNoIndice = destinos.filter(eConcelho);
    const gavetas = doc.querySelectorAll('main details');
    const concelhosConstruidos = (porChave.get(`municipio|${lang}`) ?? []).length;
    let dentro = 0;
    const vistos = new Set();
    for (const g of gavetas) {
      const nome = texto(g.querySelector('summary'));
      const aqui = g.querySelectorAll('a[href]').map((a) => destino(a.getAttribute('href'))).filter(eConcelho);
      if (!aqui.length) continue;
      if (g.hasAttribute('open')) erros.push(`I4 ${lang}: a gaveta «${nome}» chega aberta; os concelhos chegam dobrados por distrito.`);
      dentro += aqui.length;
      aqui.forEach((c) => vistos.add(c));
      const distrito = (porChave.get(`distrito|${lang}`) ?? []).find((d) => texto(parse(ler(d) ?? '').querySelector('main h1')) === nome);
      if (!distrito) { erros.push(`I4 ${lang}: a gaveta «${nome}» não é o nome de nenhuma página de distrito construída.`); continue; }
      const daPagina = new Set(parse(ler(distrito) ?? '').querySelector('main')?.querySelectorAll('a[href]').map((a) => destino(a.getAttribute('href'))).filter(eConcelho) ?? []);
      const aMais = aqui.filter((c) => !daPagina.has(c));
      const aMenos = [...daPagina].filter((c) => !aqui.includes(c));
      if (aMais.length || aMenos.length || new Set(aqui).size !== aqui.length) {
        erros.push(`I4 ${lang}: a gaveta «${nome}» tem ${aqui.length} concelho(s) e a página do distrito lista ${daPagina.size}` +
          `${aMais.length ? `; a mais: ${aMais.slice(0, 3).join(', ')}` : ''}${aMenos.length ? `; a menos: ${aMenos.slice(0, 3).join(', ')}` : ''}.`);
      }
    }
    if (concelhosNoIndice.length !== concelhosConstruidos || vistos.size !== concelhosConstruidos || dentro !== concelhosNoIndice.length) {
      erros.push(`I4 ${lang}: o índice tem ${concelhosNoIndice.length} porta(s) de concelho, ${dentro} dentro das gavetas, ${vistos.size} distinta(s), e foram construídas ${concelhosConstruidos} páginas de concelho.`);
    }
    contas[lang].concelhos = { portas: concelhosNoIndice.length, gavetas: gavetas.length, construidos: concelhosConstruidos };

    /* I5 · os estudos, os da lista dos estudos. */
    const daLista = parse(ler(routePath('estudos', lang)) ?? '').querySelectorAll('[data-estudo-edicao]');
    const doIndice = doc.querySelectorAll('main [data-estudo-edicao]');
    const ficha = (el) => [el.getAttribute('data-estudo-edicao'), destino(el.querySelector('a[href]')?.getAttribute('href') ?? ''), texto(el.querySelector('time'))].join(' · ');
    const a = doIndice.map(ficha);
    const b = daLista.map(ficha);
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      erros.push(`I5 ${lang}: o índice tem ${a.length} estudo(s) e a lista dos estudos ${b.length}, ou por outra ordem, porta ou data` +
        `${a.find((x, i) => x !== b[i]) ? `; o primeiro que difere: ${a.find((x, i) => x !== b[i])} contra ${b[a.findIndex((x, i) => x !== b[i])] ?? 'nada'}` : ''}.`);
    }
    contas[lang].estudos = a.length;

    /* I6 · «O que mudou», o começo do registo. */
    const registo = parse(ler(routePath('correcoes', lang)) ?? '').querySelectorAll('[data-mudou-registo] li[data-mudanca="correcao"]');
    const daEntrada = (li) => {
      const data = li.querySelector('[data-correcao-campo="date"]');
      return [li.getAttribute('data-correcao-entrada'), data?.getAttribute('data-correcao-n'), data?.getAttribute('datetime'),
        texto(li.querySelector('[data-correcao-campo="old_value"]')), texto(li.querySelector('[data-correcao-campo="new_value"]'))].join(' · ');
    };
    const esperadas = [];
    const linhas = new Set();
    for (const li of registo) {
      const linha = li.getAttribute('data-correcao-entrada');
      if (linhas.has(linha)) continue;
      linhas.add(linha);
      esperadas.push(daEntrada(li));
      if (esperadas.length === TETO) break;
    }
    const listas = doc.querySelectorAll('main [data-mudou-ambito="indice"]');
    const itens = listas.flatMap((l) => l.querySelectorAll('li'));
    const lidas = itens.map(daEntrada);
    if (listas.length !== 1 || JSON.stringify(lidas) !== JSON.stringify(esperadas)) {
      erros.push(`I6 ${lang}: «O que mudou» do índice tem ${lidas.length} linha(s) em ${listas.length} lista(s), e o começo do registo dá ${esperadas.length}` +
        `${lidas.find((x, i) => x !== esperadas[i]) ? `; a primeira que difere: ${lidas.find((x, i) => x !== esperadas[i])}` : ''}.`);
    }
    for (const li of itens) {
      const linha = li.getAttribute('data-correcao-entrada');
      const recibo = normalizePath(routePath('linha', lang, { slug: linha ?? 'x' }));
      if (!li.querySelectorAll('a.src-chip[href]').some((s) => destino(s.getAttribute('href')) === recibo)) {
        erros.push(`I6 ${lang}: a linha ${linha} de «O que mudou» não tem a marca da fonte para o recibo ${recibo}.`);
      }
    }
    contas[lang].mudou = lidas.length;

    /* I7 · nenhum destino repetido no corpo. */
    const todasOsDestinos = todas.map((x) => destino(x.getAttribute('href')));
    const repetidos = [...new Set(todasOsDestinos.filter((d, i) => todasOsDestinos.indexOf(d) !== i))];
    if (repetidos.length) erros.push(`I7 ${lang}: ${repetidos.length} destino(s) repetido(s) no corpo do índice, por exemplo ${repetidos.slice(0, 3).join(', ')}.`);
  }
  return { erros, contas };
}

/** O que a célula lê do disco, uma vez. */
function lerTudo() {
  const indice = Object.fromEntries(LANGS.map((l) => [l, ler(routePath('indice', l))]));
  const { ficheiros, caminhos } = lerMapa();
  return { indice, mapa: caminhos, paginas: lerPaginas(), ficheirosDoMapa: ficheiros };
}

/**
 * AS PLANTAS, em memória: cada uma estraga uma cópia e tem de dar a queixa que nomeia.
 * @param {ReturnType<typeof lerTudo>} base
 */
export function plantasDoIndice(base) {
  const comPt = (fn) => {
    const doc = parse(base.indice.pt ?? '');
    fn(doc);
    return { ...base, indice: { ...base.indice, pt: doc.toString() } };
  };
  const comEn = (fn) => {
    const doc = parse(base.indice.en ?? '');
    fn(doc);
    return { ...base, indice: { ...base.indice, en: doc.toString() } };
  };
  const porta = (doc, href) => doc.querySelectorAll('main a[href]').find((a) => a.getAttribute('href') === href);
  const casos = [
    ['r3-celula-rota-tirada', () => comPt((d) => porta(d, routePath('agenda', 'pt'))?.parentNode?.remove()), [/I2 pt: \/agenda está no mapa do sítio e não tem porta no índice/, /I3 pt: a página \/agenda \(rota «agenda»\)/]],
    ['r3-celula-concelho-a-menos', () => comPt((d) => d.querySelector('main details a[href]')?.parentNode?.remove()), [/I4 pt: a gaveta «Aveiro» tem 18 concelho\(s\)/, /I4 pt: o índice tem 307 porta\(s\) de concelho/]],
    ['r3-celula-porta-que-nao-resolve', () => comEn((d) => porta(d, routePath('agenda', 'en'))?.setAttribute('href', '/en/agenda-que-nao-existe')), [/I1 en: a porta «Agenda» para \/en\/agenda-que-nao-existe não resolve/]],
    ['r3-celula-porta-pelo-ficheiro-irmao', () => comPt((d) => d.querySelector('main [data-indice-seccao="projeto"] ul')?.insertAdjacentHTML('beforeend', '<li><a href="/404">404</a></li>')), [/I1 pt: a porta «404» para \/404 não resolve/]],
    ['r3-celula-pagina-do-resultado', () => comPt((d) => d.querySelector('main [data-indice-seccao="projeto"] ul')?.insertAdjacentHTML('beforeend', `<li><a href="${routePath('sugestoesObrigado', 'pt')}">Obrigado</a></li>`)), [/I3 pt: a página do resultado \/sugestoes\/obrigado está no índice/]],
    ['r3-celula-mapa-com-pagina-sem-porta', () => ({ ...base, mapa: new Set([...base.mapa, normalizePath(routePath('sugestoesVazia', 'en'))]) }), [/I2 en: \/en\/suggestions\/empty está no mapa do sítio e não tem porta no índice/]],
    ['r3-celula-estudo-em-falta', () => comEn((d) => d.querySelector('main [data-estudo-edicao]')?.remove()), [/I5 en: o índice tem 10 estudo\(s\) e a lista dos estudos 11/]],
    ['r3-celula-concelho-noutra-gaveta', () => comPt((d) => {
      const gavetas = d.querySelectorAll('main details');
      const li = gavetas[0]?.querySelector('a[href]')?.parentNode;
      if (li) {
        const html = li.toString();
        li.remove();
        gavetas[1]?.querySelector('ul')?.insertAdjacentHTML('beforeend', html);
      }
    }), [/I4 pt: a gaveta «Aveiro» tem 18 concelho\(s\)/, /I4 pt: a gaveta «Beja» tem 15 concelho\(s\)/]],
    ['r3-celula-gaveta-aberta', () => comPt((d) => d.querySelector('main details')?.setAttribute('open', '')), [/I4 pt: a gaveta «Aveiro» chega aberta/]],
    ['r3-celula-linha-repetida-em-o-que-mudou', () => comEn((d) => {
      const ol = d.querySelector('main [data-mudou-ambito="indice"]');
      const li = ol?.querySelector('li');
      if (ol && li) ol.insertAdjacentHTML('beforeend', li.toString());
    }), [/I6 en: «O que mudou» do índice tem 9 linha\(s\)/, /I7 en: 1 destino\(s\) repetido\(s\)/]],
  ];
  return casos.map(([nome, faz, mordidas]) => {
    const r = conferirIndice(faz());
    const mordeu = mordidas.every((re) => r.erros.some((e) => re.test(e)));
    return { nome, mordeu, queixas: r.erros.slice(0, 6) };
  });
}

const principal = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (principal) {
  if (!fs.existsSync(DIST)) {
    console.error(`check:indice-do-sitio: não existe ${DIST}/. Corra o build primeiro.`);
    process.exit(1);
  }
  const base = lerTudo();
  const r = conferirIndice(base);
  if (!base.ficheirosDoMapa.length) r.erros.push('I2: a construção não tem o mapa do sítio (sitemap-N.xml); a célula não mediu nada.');
  const prova = process.argv.includes('--prova');
  const plantas = prova ? plantasDoIndice(base) : [];
  for (const p of plantas) if (!p.mordeu) r.erros.push(`A planta não mordeu: ${p.nome} (queixas: ${p.queixas.join(' | ') || 'nenhuma'})`);
  const relatorio = { erros: r.erros, contas: r.contas, enderecos_no_mapa: base.mapa.size, paginas_construidas: base.paginas.length, plantas };
  const j = process.argv.indexOf('--json');
  if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(relatorio, null, 2) + '\n');
  for (const lang of LANGS) {
    const c = r.contas[lang];
    if (c) console.log(`check:indice-do-sitio ${lang}: ${c.portas} portas (${c.destinos} destinos), ${c.enderecosDoMapa} endereços do mapa conferidos, ${c.rotasDeLeitor} rotas de leitor, ${c.concelhos.portas} concelhos em ${c.concelhos.gavetas} gavetas, ${c.estudos} estudos, ${c.mudou} linhas de «O que mudou».`);
  }
  if (prova) console.log(`check:indice-do-sitio: ${plantas.filter((p) => p.mordeu).length} de ${plantas.length} plantas morderam.`);
  if (r.erros.length) {
    console.error(r.erros.map((e) => `  ✗ ${e}`).join('\n'));
    process.exitCode = 1;
  } else console.log('check:indice-do-sitio: todas as conferências a 0.');
}
