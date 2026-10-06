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
 * si própria. A única declaração que lê fora da construção, além das rotas, é a das medidas
 * reunidas (`MEDIDA_REUNIDA`, em `src/lib/pais.mjs`): é a casa a dizer que duas linhas são a mesma
 * medida, nenhuma página a escreve, e a regra que a usa está escrita aqui e não importada.
 *
 *   I1 · cada porta do índice resolve num ficheiro construído pela regra da Vercel: um caminho sem
 *        extensão é uma pasta com o seu `index.html`, e nunca o ficheiro `.html` irmão (medido no
 *        ar a 04.10.2026: `/en/index` dava 404 com `en/index.html` presente); para `/en/index` o
 *        irmão seria a primeira página inglesa, e um resolvedor que o aceitasse daria por boa uma
 *        porta que no ar não abre o índice;
 *   I2 · o índice e o mapa do sítio dizem as mesmas páginas do leitor (e as duas páginas do índice estão
 *        no mapa, e o mapa só tem rotas da tabela: um endereço que `matchPath()` não reconhece é um erro, e
 *        não um endereço saltado em silêncio, desde a passagem R3-b): cada endereço do mapa é uma
 *        porta do índice da mesma edição, menos as famílias por dado que entram pela sua lista (as
 *        linhas, pelo índice das linhas; os livros dos concelhos, pelo índice dos concelhos do
 *        livro-razão), cuja lista tem de ser uma porta, e menos a própria página; e cada porta do
 *        índice está no mapa, menos as páginas que levam `noindex` e que a lista da sua família
 *        também lista (os estudos sem leitura escrita, que a lista dos estudos mostra e o filtro do
 *        mapa do sítio exclui por escrito, em `astro.config.mjs`); «a lista mostra-a» quer dizer uma
 *        ligação `<a href>` para ela dentro do `<main>` da página da lista, analisada como HTML, e não a
 *        cadeia `href="…"` no texto cru, que um comentário também trazia (a passagem R3-b);
 *   I3 · todas as rotas de leitor da tabela estão no índice, nas duas edições: cada chave com páginas
 *        construídas tem a porta de cada uma, menos as páginas do resultado da caixa das sugestões,
 *        que não podem estar (§1.154), as famílias que entram pela sua lista, as edições datadas
 *        dos estudos com sucessor (§1.145) e a própria página;
 *   I4 · os 308 concelhos estão todos, uma vez cada, dentro de uma gaveta fechada, e cada gaveta tem
 *        exatamente os concelhos que a página construída do seu distrito ou ilha lista; e 308 é um facto
 *        escrito aqui, e não a contagem da construção: as portas distintas, as páginas construídas e a
 *        soma das gavetas têm de ser 308 (a passagem R3-b: um concelho que faltasse de forma coerente na
 *        construção, no mapa, na página do distrito e no índice passava);
 *   I5 · os estudos do índice são os da lista dos estudos da mesma edição, pela mesma ordem, cada um
 *        com a mesma porta e a mesma data;
 *   I6 · «O que mudou» do índice é o começo do registo: as primeiras oito linhas distintas entre as
 *        correções e as atualizações do registo construído, cada uma com a sua entrada mais recente
 *        (escolhida aqui pela data e, no mesmo dia, pelo número da entrada, e não pela posição no
 *        registo, desde a passagem R3-b),
 *        a mesma data, os mesmos dois valores e o mesmo lugar escrito, e com a marca da fonte para o
 *        recibo da sua linha; uma linha reunida noutra (`MEDIDA_REUNIDA`) não entra, porque a medida
 *        entra pela linha que fica; e nenhuma linha da lista se lê igual a outra (a passagem final do
 *        R3: as duas taxas de desemprego de 2025, uma por baixo da outra, eram duas linhas iguais
 *        para quem lê);
 *   I7 · nenhum destino se repete no corpo do índice (a regra da L1 do `check:lugar`, com as mesmas
 *        duas dispensas: a porta obrigatória do rótulo de IA e o marcador de um título por
 *        confirmar).
 *
 * PLANTAS (`--prova`), em memória, sobre cópias do HTML construído e do mapa lido, cada uma com a
 * queixa que tem de dar: uma rota tirada do índice, um concelho a menos, uma porta que não resolve,
 * uma porta para uma página que só existe como ficheiro `.html` irmão, uma página do resultado no
 * índice, um endereço do mapa sem porta, o próprio índice fora do mapa, um estudo da lista em falta,
 * um concelho na gaveta de outro distrito, uma gaveta aberta, uma linha repetida em «O que mudou», uma
 * linha reunida que entra como cópia de outra e se lê igual a ela, e o lugar de uma linha trocado; e as
 * quatro da passagem R3-b: um endereço do mapa fora da tabela das rotas, a porta de um estudo que a lista
 * só traz num comentário, uma construção coerente com 307 concelhos, e duas entradas da mesma linha no
 * mesmo dia pela ordem errada no registo. Uma planta pode exigir que as suas sejam as únicas queixas.
 * O índice intacto tem de passar antes delas.
 *
 * Uso: node tests/indice/indice.mjs [--prova] [--json <ficheiro>]   (`OEDP_DIST` mede outra construção)
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { LANGS, matchPath, normalizePath, routePath } from '../../src/lib/routes.mjs';
import { MEDIDA_REUNIDA } from '../../src/lib/pais.mjs';

const DIST = process.env.OEDP_DIST ?? 'dist';

/** As famílias por dado que entram pela sua lista, e a chave da página dessa lista. */
const PELA_LISTA = { linha: 'livro', livroConcelho: 'livroConcelhos', documento: 'estudo' };
/** As páginas do resultado da caixa das sugestões: fora dos índices e do mapa do sítio (§1.154). */
const RESULTADO_DA_CAIXA = new Set(['sugestoesObrigado', 'sugestoesVazia', 'sugestoesLimite', 'sugestoesNaoChegou']);
/** As famílias cujas páginas com `noindex` o índice lista, e a página da lista que também as lista. */
const LISTA_DA_FAMILIA = { estudo: 'estudos' };
/** O teto do que uma lista «O que mudou» mostra, escrito aqui e não importado (é o da A2 do `check:pais`). */
const TETO = 8;
/**
 * OS CONCELHOS DE PORTUGAL SÃO 308, e o número escreve-se aqui como um facto, não se conta na construção
 * (a passagem R3-b, o achado 8 da leitura a frio do Sol): são os municípios da Carta Administrativa
 * Oficial de Portugal (CAOP) de 2025, da Direção-Geral do Território, cujos três extratos o projeto aloja
 * em `public/dados/` (`src/data/carta-dos-lugares.mjs`) e que o `check:mapa` (R2) conta uma vez cada nas
 * páginas de distrito. Se a Carta mudar o número, muda esta linha, com a fonte.
 */
const CONCELHOS_DE_PORTUGAL = 308;

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
  const dispensada = (a) => a.closest('[data-rotulo-ia="topo"]') !== null;
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
 * @param {{ indice: Record<string, string>, mapa: Set<string>, paginas: string[], existe?: (f: string) => boolean, lerPagina?: (caminho: string) => string | null }} entrada
 */
export function conferirIndice({ indice, mapa, paginas, existe, lerPagina = ler }) {
  const erros = [];
  const contas = {};
  /* I2 · O MAPA SÓ TEM ROTAS DA TABELA (a passagem R3-b): um endereço que a tabela não reconhece era
     saltado em silêncio nas duas edições, e uma página inesperada escapava à comparação. */
  for (const c of mapa) {
    if (!matchPath(c)) erros.push(`I2: ${c} está no mapa do sítio e não é uma rota da tabela das rotas; o mapa só pode ter páginas da tabela.`);
  }
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

    /* I2 · o mapa do sítio, de um lado e do outro; e a própria página está nele (o mapa conhece a rota nova). */
    if (!mapa.has(proprio)) erros.push(`I2 ${lang}: a página do índice ${proprio} não está no mapa do sítio.`);
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
      const pagina = lerPagina(d);
      const comNoindex = pagina !== null && /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(pagina);
      const lista = r ? LISTA_DA_FAMILIA[/** @type {keyof typeof LISTA_DA_FAMILIA} */ (r.key)] : undefined;
      /* A LISTA MOSTRA A PORTA quando tem uma ligação para ela dentro do `<main>`, analisado como HTML, fora de
         um elemento escondido; a cadeia `href="…"` no texto cru também se achava num comentário (a passagem
         R3-b, o achado 7). */
      const mainDaLista = lista ? parse(lerPagina(routePath(/** @type {ChaveDeRota} */ (lista), lang)) ?? '').querySelector('main') : null;
      const naLista = mainDaLista
        ? mainDaLista.querySelectorAll('a[href]').some((a) => a.closest('[hidden]') === null && destino(a.getAttribute('href')) === d)
        : false;
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
        if (chave === 'estudo' && /data-sucessor-edicao/.test(lerPagina(c) ?? '')) {
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
      const distrito = (porChave.get(`distrito|${lang}`) ?? []).find((d) => texto(parse(lerPagina(d) ?? '').querySelector('main h1')) === nome);
      if (!distrito) { erros.push(`I4 ${lang}: a gaveta «${nome}» não é o nome de nenhuma página de distrito construída.`); continue; }
      const daPagina = new Set(parse(lerPagina(distrito) ?? '').querySelector('main')?.querySelectorAll('a[href]').map((a) => destino(a.getAttribute('href'))).filter(eConcelho) ?? []);
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
    /* E SÃO 308 (a passagem R3-b): a conferência de cima prova que o índice bate com a construção; esta
       prova que a construção, as gavetas e o índice têm os concelhos de Portugal todos. */
    const distintosNoIndice = new Set(concelhosNoIndice).size;
    if (distintosNoIndice !== CONCELHOS_DE_PORTUGAL || concelhosConstruidos !== CONCELHOS_DE_PORTUGAL || dentro !== CONCELHOS_DE_PORTUGAL) {
      erros.push(`I4 ${lang}: os concelhos de Portugal são ${CONCELHOS_DE_PORTUGAL}; o índice tem ${distintosNoIndice} porta(s) distinta(s) de concelho, as gavetas somam ${dentro}, e foram construídas ${concelhosConstruidos} páginas de concelho.`);
    }
    contas[lang].concelhos = { portas: concelhosNoIndice.length, gavetas: gavetas.length, construidos: concelhosConstruidos };

    /* I5 · os estudos, os da lista dos estudos. */
    const daLista = parse(lerPagina(routePath('estudos', lang)) ?? '').querySelectorAll('[data-estudo-edicao]');
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
    const registo = parse(lerPagina(routePath('correcoes', lang)) ?? '').querySelectorAll('[data-mudou-registo] li[data-mudanca="correcao"]');
    /* O lugar escrito: no registo é a porta do lugar; no índice é o nome sem porta. */
    const daEntrada = (li) => {
      const data = li.querySelector('[data-correcao-campo="date"]');
      return [li.getAttribute('data-correcao-entrada'), data?.getAttribute('data-correcao-n'), data?.getAttribute('datetime'),
        texto(li.querySelector('[data-correcao-campo="old_value"]')), texto(li.querySelector('[data-correcao-campo="new_value"]')),
        texto(li.querySelector('.registo-lugar, .indice-mudou-lugar'))].join(' · ');
    };
    /* A ENTRADA MAIS RECENTE DE CADA LINHA, PROVADA AQUI (a passagem R3-b, o achado 5): a de maior data e, no
       mesmo dia, a de maior número, seja qual for a posição dela no registo. A primeira forma copiava a primeira
       ocorrência de cada linha, e com ela a ordem do registo, que punha a entrada 0 antes da 1 no mesmo dia. Entre
       linhas diferentes com a mesma data, a ordem é a da primeira vez que o registo mostra cada linha. */
    const frescas = new Map();
    registo.forEach((li, ordem) => {
      const linha = li.getAttribute('data-correcao-entrada');
      if (!linha || Object.hasOwn(MEDIDA_REUNIDA, linha)) return;
      const d = li.querySelector('[data-correcao-campo="date"]');
      const data = d?.getAttribute('datetime') ?? '';
      const n = Number(d?.getAttribute('data-correcao-n') ?? -1);
      const atual = frescas.get(linha);
      if (!atual) frescas.set(linha, { li, data, n, ordem });
      else if (data > atual.data || (data === atual.data && n > atual.n)) frescas.set(linha, { li, data, n, ordem: atual.ordem });
    });
    const esperadas = [...frescas.values()]
      .sort((x, y) => y.data.localeCompare(x.data) || x.ordem - y.ordem)
      .slice(0, TETO)
      .map((x) => daEntrada(x.li));
    const listas = doc.querySelectorAll('main [data-mudou-ambito="indice"]');
    const itens = listas.flatMap((l) => l.querySelectorAll('li'));
    const lidas = itens.map(daEntrada);
    if (listas.length !== 1 || JSON.stringify(lidas) !== JSON.stringify(esperadas)) {
      const k = lidas.findIndex((x, i) => x !== esperadas[i]);
      erros.push(`I6 ${lang}: «O que mudou» do índice tem ${lidas.length} linha(s) em ${listas.length} lista(s), e o começo do registo dá ${esperadas.length}` +
        `${k >= 0 ? `; a primeira que difere: ${lidas[k]}, e o registo dá ${esperadas[k] ?? 'nada'}` : ''}.`);
    }
    /* O que o leitor lê de cada linha: o texto à vista, sem o que só um leitor de ecrã ouve, com um espaço
       entre os pedaços que a disposição separa (a data, o lugar, o nome, os valores e a marca da fonte). */
    const lidoPeloLeitor = (li) => {
      const copia = parse(li.toString());
      for (const el of copia.querySelectorAll('.vh, [hidden], [aria-hidden="true"]')) el.remove();
      const pedacos = [];
      const anda = (n) => {
        if (n.nodeType === 3) pedacos.push(n.rawText);
        else for (const f of n.childNodes ?? []) anda(f);
      };
      anda(copia);
      return desfaz(pedacos.join(' ')).replace(/\s+/g, ' ').trim();
    };
    const leituras = itens.map(lidoPeloLeitor);
    const iguais = [...new Set(leituras.filter((l, i) => leituras.indexOf(l) !== i))];
    for (const l of iguais) {
      erros.push(`I6 ${lang}: duas linhas de «O que mudou» leem-se iguais («${l}»); a mesma medida em duas linhas declara-se em MEDIDA_REUNIDA, e duas medidas não podem ter o mesmo nome no mesmo lugar.`);
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
  /* As plantas da passagem R3-b trocam também as páginas que a célula lê (o registo, a lista dos estudos, uma página
     de distrito): `comPaginas` dá à célula um leitor que devolve as cópias estragadas e lê o resto do disco. */
  const comPaginas = (extra, trocadas) => ({ ...base, ...extra, lerPagina: (c) => trocadas.get(normalizePath(c)) ?? ler(c) });
  const docPt = parse(base.indice.pt ?? '');
  /* A primeira linha de «O que mudou» do índice português, e o número da sua entrada. */
  const primeiraMudanca = docPt.querySelector('main [data-mudou-ambito="indice"] li');
  const linhaDaPrimeira = primeiraMudanca?.getAttribute('data-correcao-entrada') ?? '';
  const nDaPrimeira = Number(primeiraMudanca?.querySelector('[data-correcao-campo="date"]')?.getAttribute('data-correcao-n') ?? -1);
  /* A primeira porta do índice português que não está no mapa do sítio (um estudo sem leitura escrita, com noindex). */
  const portaSemMapa = portasDoIndice(docPt, 'pt').portas.map((a) => destino(a.getAttribute('href'))).find((d) => !base.mapa.has(d)) ?? '';
  /* O primeiro concelho da primeira gaveta, e a página do seu distrito. */
  const primeiraGaveta = docPt.querySelector('main details');
  const concelhoTirado = destino(primeiraGaveta?.querySelector('a[href]')?.getAttribute('href') ?? '');
  const nomeDaGaveta = texto(primeiraGaveta?.querySelector('summary'));
  const distritoDaGaveta = base.paginas.filter((c) => matchPath(c)?.key === 'distrito' && matchPath(c)?.lang === 'pt')
    .find((c) => texto(parse(ler(c) ?? '').querySelector('main h1')) === nomeDaGaveta) ?? '';
  const casos = [
    ['r3-celula-rota-tirada', () => comPt((d) => porta(d, routePath('agenda', 'pt'))?.parentNode?.remove()), [/I2 pt: \/agenda está no mapa do sítio e não tem porta no índice/, /I3 pt: a página \/agenda \(rota «agenda»\)/]],
    ['r3-celula-concelho-a-menos', () => comPt((d) => d.querySelector('main details a[href]')?.parentNode?.remove()), [/I4 pt: a gaveta «Aveiro» tem 18 concelho\(s\)/, /I4 pt: o índice tem 307 porta\(s\) de concelho/]],
    ['r3-celula-porta-que-nao-resolve', () => comEn((d) => porta(d, routePath('agenda', 'en'))?.setAttribute('href', '/en/agenda-que-nao-existe')), [/I1 en: a porta «Agenda» para \/en\/agenda-que-nao-existe não resolve/]],
    ['r3-celula-porta-pelo-ficheiro-irmao', () => comPt((d) => d.querySelector('main [data-indice-seccao="projeto"] ul')?.insertAdjacentHTML('beforeend', '<li><a href="/404">404</a></li>')), [/I1 pt: a porta «404» para \/404 não resolve/]],
    ['r3-celula-pagina-do-resultado', () => comPt((d) => d.querySelector('main [data-indice-seccao="projeto"] ul')?.insertAdjacentHTML('beforeend', `<li><a href="${routePath('sugestoesObrigado', 'pt')}">Obrigado</a></li>`)), [/I3 pt: a página do resultado \/sugestoes\/obrigado está no índice/]],
    ['r3-celula-mapa-com-pagina-sem-porta', () => ({ ...base, mapa: new Set([...base.mapa, normalizePath(routePath('sugestoesVazia', 'en'))]) }), [/I2 en: \/en\/suggestions\/empty está no mapa do sítio e não tem porta no índice/]],
    ['r3-celula-indice-fora-do-mapa', () => ({ ...base, mapa: new Set([...base.mapa].filter((c) => c !== normalizePath(routePath('indice', 'pt')))) }), [/I2 pt: a página do índice \/indice não está no mapa do sítio/]],
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
    /* Uma linha reunida noutra entra como cópia da primeira linha da lista, com a identidade da linha
       reunida, e a lista continua com oito: o começo do registo não a tem, e as duas leem-se iguais.
       Não depende de que linhas estão hoje na lista. */
    ['r3-celula-linha-reunida-que-se-le-igual', () => comEn((d) => {
      const reunida = Object.keys(MEDIDA_REUNIDA)[0];
      const ol = d.querySelector('main [data-mudou-ambito="indice"]');
      const itens = ol?.querySelectorAll('li') ?? [];
      const primeira = itens[0];
      if (!ol || !primeira || !reunida) return;
      const original = primeira.getAttribute('data-correcao-entrada') ?? '';
      const copia = parse(primeira.toString());
      const li = copia.querySelector('li');
      li?.setAttribute('data-correcao-entrada', reunida);
      for (const el of copia.querySelectorAll('[data-correcao-claim]')) el.setAttribute('data-correcao-claim', reunida);
      for (const a of copia.querySelectorAll('a.src-chip[href]')) {
        a.setAttribute('href', String(a.getAttribute('href')).replace(original, reunida));
      }
      itens[itens.length - 1]?.remove();
      primeira.insertAdjacentHTML('afterend', copia.toString());
    }), [new RegExp(`I6 en: «O que mudou» do índice tem 8 linha\\(s\\) em 1 lista\\(s\\), e o começo do registo dá 8; a primeira que difere: ${Object.keys(MEDIDA_REUNIDA)[0]} · `), /I6 en: duas linhas de «O que mudou» leem-se iguais/]],
    /* O lugar escrito de uma linha trocado por outro: o registo escreve outro lugar para a mesma entrada. */
    ['r3-celula-lugar-trocado-em-o-que-mudou', () => comPt((d) => {
      const lugar = d.querySelector('main [data-mudou-ambito="indice"] .indice-mudou-lugar');
      if (lugar) lugar.set_content(texto(lugar) === 'Portugal' ? 'Évora' : 'Portugal');
    }), [/I6 pt: «O que mudou» do índice tem 8 linha\(s\) em 1 lista\(s\), e o começo do registo dá 8; a primeira que difere: (\S+) · .* · (Évora|Portugal), e o registo dá \1 · /]],
    /* A PASSAGEM R3-b. Um endereço do mapa que a tabela das rotas não reconhece (o achado 7). */
    ['r3-celula-mapa-com-endereco-fora-da-tabela', () => ({ ...base, mapa: new Set([...base.mapa, '/caminho-que-nao-e-rota']) }),
      [/^I2: \/caminho-que-nao-e-rota está no mapa do sítio e não é uma rota da tabela das rotas/], true],
    /* A porta de um estudo com noindex que a lista dos estudos só traz num comentário (o achado 7): a ligação sai do
       <main> e fica num comentário dentro dele, onde a cadeia href="…" do texto cru ainda a achava. A I5 também se
       queixa, porque o estudo da lista fica sem porta. */
    ['r3-celula-lista-so-num-comentario', () => {
      const caminhoDaLista = normalizePath(routePath('estudos', 'pt'));
      const lista = parse(ler(caminhoDaLista) ?? '');
      for (const a of lista.querySelectorAll('main a[href]').filter((x) => destino(x.getAttribute('href')) === portaSemMapa)) a.remove();
      const copia = lista.toString().replace('</main>', `<!-- <a href="${portaSemMapa}">${portaSemMapa}</a> --></main>`);
      return comPaginas({}, new Map([[caminhoDaLista, copia]]));
    }, [new RegExp(`^I2 pt: a porta ${portaSemMapa} não está no mapa do sítio, e a lista da família não a lista\\.`), /^I5 pt: /], true],
    /* Uma construção coerente com 307 concelhos (o achado 8): o primeiro concelho da primeira gaveta sai do índice,
       das páginas construídas, do mapa do sítio e da página do seu distrito. As conferências de concordância passam
       todas; só a dos 308 morde. */
    ['r3-celula-construcao-com-307-concelhos', () => {
      const indice = parse(base.indice.pt ?? '');
      for (const a of indice.querySelectorAll('main details a[href]').filter((x) => destino(x.getAttribute('href')) === concelhoTirado)) a.parentNode?.remove();
      const distrito = parse(ler(distritoDaGaveta) ?? '');
      for (const a of distrito.querySelectorAll('main a[href]').filter((x) => destino(x.getAttribute('href')) === concelhoTirado)) a.remove();
      return comPaginas({
        indice: { ...base.indice, pt: indice.toString() },
        paginas: base.paginas.filter((c) => c !== concelhoTirado),
        mapa: new Set([...base.mapa].filter((c) => c !== concelhoTirado)),
      }, new Map([[normalizePath(distritoDaGaveta), distrito.toString()]]));
    }, [/^I4 pt: os concelhos de Portugal são 308; o índice tem 307 porta\(s\) distinta\(s\) de concelho, as gavetas somam 307, e foram construídas 307 páginas de concelho\./], true],
    /* Duas entradas da mesma linha no mesmo dia pela ordem errada (o achado 5): o registo ganha, depois da entrada que
       o índice mostra, uma entrada mais recente da mesma linha no mesmo dia (o número a seguir e outro valor novo),
       como a ordem antiga as punha. Copiar a primeira ocorrência dava por boa a entrada velha. */
    ['r3-celula-duas-entradas-no-mesmo-dia-pela-ordem-errada', () => {
      const caminhoDoRegisto = normalizePath(routePath('correcoes', 'pt'));
      const registo = parse(ler(caminhoDoRegisto) ?? '');
      const original = registo.querySelectorAll('[data-mudou-registo] li[data-mudanca="correcao"]')
        .find((li) => li.getAttribute('data-correcao-entrada') === linhaDaPrimeira);
      if (original) {
        const nova = parse(original.toString());
        for (const el of nova.querySelectorAll('[data-correcao-n]')) el.setAttribute('data-correcao-n', String(nDaPrimeira + 1));
        nova.querySelector('[data-correcao-campo="new_value"]')?.set_content('valor plantado');
        original.insertAdjacentHTML('afterend', nova.toString());
      }
      return comPaginas({}, new Map([[caminhoDoRegisto, registo.toString()]]));
    }, [new RegExp(`^I6 pt: «O que mudou» do índice tem 8 linha\\(s\\) em 1 lista\\(s\\), e o começo do registo dá 8; a primeira que difere: ${linhaDaPrimeira} · ${nDaPrimeira} · .*, e o registo dá ${linhaDaPrimeira} · ${nDaPrimeira + 1} · .* · valor plantado · `)], true],
  ];
  /* `soEstas`: a planta só morde se as queixas forem todas das que ela nomeia (as plantas da passagem R3-b provam
     que é a conferência nova que morde, e não outra pelo caminho). */
  return casos.map(([nome, faz, mordidas, soEstas = false]) => {
    const r = conferirIndice(faz());
    const todas = mordidas.every((re) => r.erros.some((e) => re.test(e)));
    const soAsDela = !soEstas || r.erros.every((e) => mordidas.some((re) => re.test(e)));
    return { nome, mordeu: todas && soAsDela, so_as_dela: soEstas ? soAsDela : undefined, queixas: r.erros.slice(0, 6) };
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
