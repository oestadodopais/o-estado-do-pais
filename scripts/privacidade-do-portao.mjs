/**
 * ---------------------------------------------------------------------------
 * A PÁGINA «PRIVACIDADE», LIDA PELO PORTÃO DE HTML (bloco H3, 05.10.2026)
 * ---------------------------------------------------------------------------
 * O brief H3 (§2 e §3, pontos 1 e 2) tira a nota longa da caixa das sugestões e põe no lugar dela uma linha e a porta
 * «Como tratamos os seus dados», que abre a página «Privacidade» (`/privacidade`, `/en/privacy`), ligada também do
 * rodapé de todas as páginas, ao lado da porta das sugestões. Três conferências, que o `gate:html` chama:
 *
 *   PORTA   · `conferirPortaDaPrivacidade()`, nas páginas que levam a porta das correções (todas, menos os documentos
 *             alojados): exatamente uma porta da privacidade, à vista, dentro do `<footer>`, ao lado da das sugestões,
 *             com uma ligação só, para a página da edição da página, e o nome da página nessa edição;
 *   PÁGINA  · `conferirPaginaDaPrivacidade()`: a página sem `noindex`, com o título da página, o texto declarado em
 *             `src/data/privacidade.mjs` carácter a carácter, uma ligação só dentro dele (o endereço de correio onde se
 *             pede o que se enviou) e nenhum guião no `<main>`;
 *   COOKIES · `conferirSemCookiesNemSeguimento()`, depois do varrimento: a frase «Este sítio não usa cookies nem segue
 *             quem o lê» é uma afirmação sobre o sítio inteiro, e enquanto estiver no texto o portão confere-a em cada
 *             construção, pela sua própria leitura: nenhuma página com um guião de outra origem, um recurso carregado
 *             de outra origem, um guião que escreva cookies (`document.cookie`, `cookieStore`) ou a assinatura de um
 *             serviço de seguimento conhecido; nenhum guião servido (`dist/**\/*.js`) que escreva cookies, mande
 *             balizas (`sendBeacon`) ou leve uma dessas assinaturas; nenhum cabeçalho `Set-Cookie` na configuração da
 *             Vercel (`vercel.json`); e nenhuma função de `api/` que ponha um cookie. É a metade estática da medida que o
 *             construtor fez antes de a frase entrar; a metade dinâmica (os cookies que o navegador guardou e os
 *             pedidos para fora, página a página) está no captor do bloco.
 *
 * AS PALAVRAS DO RÓTULO E DO TÍTULO estão escritas aqui, e não importadas de `src/i18n/strings.mjs`: uma conferência
 * que lesse a mesma cadeia que a página usa confirmava-se a si própria (a regra das portas do rodapé do R3,
 * `scripts/indice-do-portao.mjs`). O texto da página vem do ficheiro declarado, como o da caixa das sugestões: é o que a
 * página tem de render, e o guião das medições do bloco compara-o com o brief, byte a byte.
 *
 * `plantasDaPrivacidade()` corre em cada corrida do portão: cada planta é uma página, um guião ou uma configuração
 * estragada em memória, e a conferência tem de a recusar com a queixa esperada; a página intacta tem de passar. Uma
 * planta que não morde fecha a construção.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { routePath, normalizePath } from '../src/lib/routes.mjs';
import { PRIVACIDADE, FRASE_DOS_COOKIES } from '../src/data/privacidade.mjs';
import { ENDERECO_CORRECOES } from '../src/data/metodo.mjs';

/** O nome da página em cada edição: o rótulo da porta do rodapé e o título da página. */
export const NOME_DA_PRIVACIDADE = { pt: 'Privacidade', en: 'Privacy' };
const MARCO = 'footer,[role="contentinfo"]';

const desfaz = (s) =>
  String(s ?? '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
/** O texto de um nó como o leitor o lê: as entidades desfeitas e os espaços juntos. */
const textoDe = (no) => desfaz(no?.textContent ?? '').replace(/\s+/g, ' ').trim();

/** O antepassado que esconde um nó, se houver: `hidden`, `aria-hidden="true"` ou a classe `vh`. */
function escondidoPor(no) {
  for (let n = no; n && n.nodeType !== undefined; n = n.parentNode) {
    const a = n.attributes ?? {};
    if ('hidden' in a) return 'hidden';
    if ((a['aria-hidden'] ?? '') === 'true') return 'aria-hidden="true"';
    if (/(^|\s)vh(\s|$)/.test(String(a.class ?? ''))) return 'class="vh"';
  }
  return null;
}

/**
 * PORTA · a porta da privacidade no rodapé de uma página.
 * @param {import('node-html-parser').HTMLElement} root
 * @param {{ lang: Lingua }} pagina
 * @returns {string[]}
 */
export function conferirPortaDaPrivacidade(root, { lang }) {
  const erros = [];
  const portas = root.querySelectorAll('[data-porta-privacidade]');
  if (portas.length !== 1) {
    erros.push(`H3 porta: esta página tem ${portas.length} porta(s) da privacidade; tem de ter exatamente uma, no rodapé, ao lado da das sugestões (\`SiteFooter.astro\`).`);
    return erros;
  }
  const porta = portas[0];
  const escondida = escondidoPor(porta);
  if (escondida) erros.push(`H3 porta: a porta da privacidade está escondida por ${escondida}.`);
  if (!porta.closest(MARCO)) erros.push('H3 porta: a porta da privacidade não está dentro do <footer>.');
  const sugestoes = root.querySelector('[data-porta-sugestoes]');
  if (!sugestoes || sugestoes.parentNode !== porta.parentNode) erros.push('H3 porta: a porta da privacidade não está ao lado da porta das sugestões.');
  const ligacoes = porta.querySelectorAll('a[href]');
  if (ligacoes.length !== 1) {
    erros.push(`H3 porta: a porta da privacidade tem ${ligacoes.length} ligação(ões); tem de ter uma.`);
    return erros;
  }
  const destino = normalizePath(new URL(desfaz(ligacoes[0].getAttribute('href')), 'https://portao.invalid').pathname);
  const esperado = normalizePath(routePath('privacidade', lang));
  if (destino !== esperado) erros.push(`H3 porta: a porta da privacidade leva a "${destino}", e a página desta edição é "${esperado}".`);
  const rotulo = textoDe(ligacoes[0]);
  if (rotulo !== NOME_DA_PRIVACIDADE[lang]) erros.push(`H3 porta: o rótulo da porta da privacidade é «${rotulo}», e nesta edição é «${NOME_DA_PRIVACIDADE[lang]}».`);
  return erros;
}

/**
 * PÁGINA · a página «Privacidade» de uma edição.
 * @param {import('node-html-parser').HTMLElement} root
 * @param {{ key: string, lang: Lingua } | null} rota
 * @param {typeof PRIVACIDADE} [declarado] o texto declarado (as plantas passam uma cópia estragada)
 * @returns {string[]}
 */
export function conferirPaginaDaPrivacidade(root, rota, declarado = PRIVACIDADE) {
  const erros = [];
  if (!rota || rota.key !== 'privacidade') return erros;
  const lang = rota.lang;
  const robots = root.querySelectorAll('meta[name="robots"]').map((m) => desfaz(m.getAttribute('content')));
  if (robots.length) erros.push(`H3 privacidade: a página entra no índice e no mapa do sítio, e leva uma marca robots ${JSON.stringify(robots)}.`);
  const titulos = root.querySelectorAll('main h1');
  if (titulos.length !== 1 || textoDe(titulos[0]) !== NOME_DA_PRIVACIDADE[lang]) {
    erros.push(`H3 privacidade: o título da página tem de ser «${NOME_DA_PRIVACIDADE[lang]}», uma vez, e é ${JSON.stringify(titulos.map(textoDe))}.`);
  }
  const blocos = root.querySelectorAll('[data-privacidade-texto]');
  if (blocos.length !== 1) {
    erros.push(`H3 privacidade: a página tem ${blocos.length} bloco(s) [data-privacidade-texto], e tem de ter um.`);
    return erros;
  }
  const bloco = blocos[0];
  if (!bloco.closest('main')) erros.push('H3 privacidade: o texto não está no <main>.');
  if (bloco.getAttribute('data-privacidade-texto') !== lang) erros.push(`H3 privacidade: o texto diz ser da edição «${bloco.getAttribute('data-privacidade-texto')}», e a página é «${lang}».`);
  const lido = textoDe(bloco);
  if (lido !== declarado.texto[lang]) {
    erros.push(`H3 privacidade: o texto rendido não é o declarado.\n      rendido:   «${lido}»\n      declarado: «${declarado.texto[lang]}»`);
  }
  if (escondidoPor(bloco)) erros.push('H3 privacidade: o texto está escondido.');
  const ligacoes = bloco.querySelectorAll('a[href]');
  if (ligacoes.length !== 1 || desfaz(ligacoes[0].getAttribute('href')) !== `mailto:${ENDERECO_CORRECOES}` || textoDe(ligacoes[0]) !== ENDERECO_CORRECOES) {
    erros.push(`H3 privacidade: o texto tem de ter uma ligação só, a do endereço onde se pede o que se enviou (mailto:${ENDERECO_CORRECOES}), e tem ${ligacoes.length}.`);
  }
  if (root.querySelector('main')?.querySelector('script')) erros.push('H3 privacidade: há um guião no <main>.');
  return erros;
}

/* --------------------------------------------------------------------------- a célula dos cookies e do seguimento */

/**
 * As assinaturas dos serviços de seguimento e de medição de audiência conhecidos, nas formas em que se carregam: o
 * anfitrião, o ficheiro ou a chamada, e nunca a palavra solta. A primeira lista tinha «plausible», e a palavra inglesa
 * mordeu duas páginas de prosa («something plausible», na página do marcador e num documento alojado) na medida de
 * antes do bloco (`design/especime-v3/medicoes/h3-2026-10-05/cookies-e-seguimento-antes-primeira-lista.json`, guardada como saiu).
 */
export const ASSINATURAS_DE_SEGUIMENTO = [
  'googletagmanager.com', 'google-analytics.com', 'gtag/js', 'gtag(', 'doubleclick.net', 'adsbygoogle',
  'plausible.io', 'matomo.js', 'matomo.php', 'piwik.js', 'piwik.php', 'umami.is', 'hotjar.com', 'cdn.segment.com',
  'api.segment.io', 'fbq(', 'connect.facebook.net', 'clarity.ms', 'cloudflareinsights.com', 'statcounter.com',
  'quantserve.com', 'mixpanel.com', 'cdn.amplitude.com', 'posthog.com', '/_vercel/insights', '/_vercel/speed-insights',
  'va.vercel-scripts.com', 'vitals.vercel-insights.com', '@vercel/analytics', '@vercel/speed-insights',
];
/** O que escreve ou lê cookies num guião, e o que manda balizas para fora. */
const ESCRITA_DE_COOKIES = /document\s*\.\s*cookie|\bcookieStore\b/;
const BALIZA = /\bsendBeacon\b/;
/** Uma origem absoluta num atributo de endereço (`https://…`, `http://…` ou `//…`). */
const ABSOLUTO = /^(?:https?:)?\/\//i;
/** Os `rel` de `<link>` que fazem o navegador pedir alguma coisa ao carregar a página. */
const REL_QUE_PEDE = new Set(['stylesheet', 'preconnect', 'dns-prefetch', 'preload', 'prefetch', 'modulepreload', 'icon', 'apple-touch-icon', 'manifest', 'prerender']);

/**
 * O que uma página construída tem contra a frase dos cookies: guiões de outra origem, recursos carregados de outra
 * origem, guiões em linha que escrevem cookies, e assinaturas de seguimento. `proprios` são os anfitriões do próprio
 * sítio, que não contam como outra origem.
 * @param {string} html
 * @param {Set<string>} proprios
 * @returns {string[]}
 */
export function achadosNaPagina(html, proprios) {
  const achados = [];
  const raiz = parse(html, { blockTextElements: { script: true, style: true } });
  const deFora = (endereco) => {
    const e = desfaz(endereco ?? '').trim();
    if (!ABSOLUTO.test(e)) return false;
    try {
      return !proprios.has(new URL(e, 'https://portao.invalid').host);
    } catch {
      return true;
    }
  };
  for (const s of raiz.querySelectorAll('script')) {
    const src = s.getAttribute('src');
    if (src && deFora(src)) achados.push(`um guião de outra origem (${src})`);
    const corpo = s.textContent ?? '';
    if (ESCRITA_DE_COOKIES.test(corpo)) achados.push('um guião em linha que escreve ou lê cookies');
  }
  for (const el of raiz.querySelectorAll('img,iframe,source,video,audio,embed,track,object')) {
    const src = el.getAttribute('src') ?? el.getAttribute('data');
    if (src && deFora(src)) achados.push(`um recurso de outra origem carregado pela página (<${el.tagName.toLowerCase()}> ${src})`);
  }
  for (const l of raiz.querySelectorAll('link[href]')) {
    const rels = String(l.getAttribute('rel') ?? '').toLowerCase().split(/\s+/);
    if (rels.some((r) => REL_QUE_PEDE.has(r)) && deFora(l.getAttribute('href'))) achados.push(`um recurso de outra origem pedido ao carregar (<link rel="${l.getAttribute('rel')}"> ${l.getAttribute('href')})`);
  }
  const minusculas = html.toLowerCase();
  for (const a of ASSINATURAS_DE_SEGUIMENTO) if (minusculas.includes(a)) achados.push(`a assinatura de um serviço de seguimento («${a}»)`);
  return achados;
}

/** O que um guião servido tem contra a frase dos cookies. @param {string} js @returns {string[]} */
export function achadosNoGuiao(js) {
  const achados = [];
  if (ESCRITA_DE_COOKIES.test(js)) achados.push('escreve ou lê cookies');
  if (BALIZA.test(js)) achados.push('manda balizas para fora (sendBeacon)');
  const minusculas = js.toLowerCase();
  for (const a of ASSINATURAS_DE_SEGUIMENTO) if (minusculas.includes(a)) achados.push(`a assinatura de um serviço de seguimento («${a}»)`);
  return achados;
}

/** O que a configuração da Vercel tem contra a frase dos cookies: um cabeçalho `Set-Cookie`. @param {string} texto @returns {string[]} */
export function achadosNaConfiguracao(texto) {
  return /["']set-cookie["']\s*:/i.test(texto) ? ['um cabeçalho Set-Cookie nas respostas'] : [];
}

/** O que uma função de `api/` tem contra a frase dos cookies: um `Set-Cookie` ou um cookie escrito. @param {string} js @returns {string[]} */
export function achadosNaFuncao(js) {
  const achados = [];
  if (/set-cookie/i.test(js)) achados.push('põe um cabeçalho Set-Cookie');
  if (/\.cookies\s*\.\s*set\s*\(|\bserialize\s*\(\s*['"][^'"]+['"]\s*,/.test(js)) achados.push('escreve um cookie');
  return achados;
}

/** Os ficheiros de uma pasta, recursivamente, com uma extensão. @param {string} dir @param {string} ext @returns {string[]} */
function ficheirosCom(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  const saida = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) saida.push(...ficheirosCom(f, ext));
    else if (e.name.endsWith(ext)) saida.push(f);
  }
  return saida;
}

/**
 * COOKIES · a frase dos cookies contra o sítio construído e a sua configuração. As páginas leem-se no laço do portão
 * (`achadosNaPagina()`, página a página), e chegam aqui contadas; aqui leem-se os guiões servidos, a configuração da
 * Vercel e as funções de `api/`. Devolve os achados e as contagens, e se a frase está no texto das duas edições.
 * @param {{ dist: string, raiz: string, paginas: { lidas: number, achados: { rel: string, achado: string }[] } }} ctx
 */
export function conferirSemCookiesNemSeguimento({ dist, raiz, paginas }) {
  const achados = [...paginas.achados];
  const guioes = ficheirosCom(dist, '.js');
  for (const f of guioes) for (const a of achadosNoGuiao(fs.readFileSync(f, 'utf8'))) achados.push({ rel: path.relative(raiz, f), achado: a });
  const configuracao = path.join(raiz, 'vercel.json');
  const temConfiguracao = fs.existsSync(configuracao);
  if (temConfiguracao) for (const a of achadosNaConfiguracao(fs.readFileSync(configuracao, 'utf8'))) achados.push({ rel: 'vercel.json', achado: a });
  const funcoes = ficheirosCom(path.join(raiz, 'api'), '.js');
  for (const f of funcoes) for (const a of achadosNaFuncao(fs.readFileSync(f, 'utf8'))) achados.push({ rel: path.relative(raiz, f), achado: a });
  const fraseNoTexto = PRIVACIDADE.texto.pt.includes(FRASE_DOS_COOKIES.pt) && PRIVACIDADE.texto.en.includes(FRASE_DOS_COOKIES.en);
  const erros = fraseNoTexto
    ? achados.map((a) => `H3 cookies: a página «Privacidade» diz «${FRASE_DOS_COOKIES.pt}», e ${a.rel} tem ${a.achado}. Ou isto sai, ou a frase sai do texto, por decisão escrita.`)
    : [];
  return { erros, fraseNoTexto, contas: { paginas: paginas.lidas, guioes: guioes.length, configuracao: temConfiguracao ? 1 : 0, funcoes: funcoes.length, achados: achados.length } };
}

/**
 * AS PLANTAS DA PRIVACIDADE, em memória, em cada corrida: cada uma tem de ser recusada pela sua conferência com a
 * queixa esperada; a página e o rodapé intactos têm de passar. Devolve o nome de cada uma e se mordeu.
 * @returns {{ nome: string, mordeu: boolean }[]}
 */
export function plantasDaPrivacidade() {
  const lang = /** @type {Lingua} */ ('pt');
  const proprios = new Set(['xn--oestadodopas-2fb.pt']);
  const rodape = (portas) => parse(`<html><body><main><h1>x</h1></main><footer><span data-porta-correccoes>c</span> · <span data-porta-sugestoes><a href="/sugestoes?de=%2F">Sugestões</a></span>${portas}</footer></body></html>`);
  const boa = `<span data-porta-privacidade><a href="${routePath('privacidade', lang)}">${NOME_DA_PRIVACIDADE[lang]}</a></span>`;
  const texto = PRIVACIDADE.texto[lang];
  const [antes, depois] = texto.split(ENDERECO_CORRECOES);
  const pagina = (corpo, cabeca = '') => parse(`<html><head>${cabeca}</head><body><main><h1>${NOME_DA_PRIVACIDADE[lang]}</h1>${corpo}</main></body></html>`);
  const blocoBom = `<p data-privacidade-texto="pt">${antes}<a href="mailto:${ENDERECO_CORRECOES}">${ENDERECO_CORRECOES}</a>${depois}</p>`;
  const rota = { key: 'privacidade', lang };
  const casos = [
    { nome: 'h3-porta-controlo', espera: null, erros: () => conferirPortaDaPrivacidade(rodape(boa), { lang }) },
    { nome: 'h3-porta-em-falta', espera: /tem 0 porta\(s\) da privacidade/, erros: () => conferirPortaDaPrivacidade(rodape(''), { lang }) },
    { nome: 'h3-porta-a-dobrar', espera: /tem 2 porta\(s\) da privacidade/, erros: () => conferirPortaDaPrivacidade(rodape(boa + boa), { lang }) },
    { nome: 'h3-porta-da-outra-edicao', espera: /a página desta edição é/, erros: () => conferirPortaDaPrivacidade(rodape(boa.replace(routePath('privacidade', lang), routePath('privacidade', 'en'))), { lang }) },
    { nome: 'h3-porta-com-outro-rotulo', espera: /o rótulo da porta da privacidade é «Privacy»/, erros: () => conferirPortaDaPrivacidade(rodape(boa.replace(`>${NOME_DA_PRIVACIDADE.pt}<`, `>${NOME_DA_PRIVACIDADE.en}<`)), { lang }) },
    { nome: 'h3-porta-escondida', espera: /escondida/, erros: () => conferirPortaDaPrivacidade(rodape(boa.replace('<span data-porta-privacidade>', '<span data-porta-privacidade hidden>')), { lang }) },
    { nome: 'h3-pagina-controlo', espera: null, erros: () => conferirPaginaDaPrivacidade(pagina(blocoBom), rota) },
    { nome: 'h3-pagina-texto-mudado', espera: /o texto rendido não é o declarado/, erros: () => conferirPaginaDaPrivacidade(pagina(blocoBom.replace('noventa dias', 'trinta dias')), rota) },
    { nome: 'h3-pagina-sem-o-endereco', espera: /uma ligação só, a do endereço/, erros: () => conferirPaginaDaPrivacidade(pagina(blocoBom.replace(`<a href="mailto:${ENDERECO_CORRECOES}">${ENDERECO_CORRECOES}</a>`, ENDERECO_CORRECOES)), rota) },
    { nome: 'h3-pagina-com-noindex', espera: /leva uma marca robots/, erros: () => conferirPaginaDaPrivacidade(pagina(blocoBom, '<meta name="robots" content="noindex">'), rota) },
    { nome: 'h3-cookies-pagina-limpa', espera: null, erros: () => achadosNaPagina(`<html><head><link rel="canonical" href="https://xn--oestadodopas-2fb.pt/"><script src="/js/tema.js"></script></head><body><img src="/a.png" alt=""></body></html>`, proprios) },
    { nome: 'h3-cookies-guiao-de-fora', espera: /um guião de outra origem/, erros: () => achadosNaPagina('<html><head><script async src="https://www.googletagmanager.com/gtag/js?id=G-X"></script></head><body></body></html>', proprios) },
    { nome: 'h3-cookies-guiao-que-escreve', espera: /escreve ou lê cookies/, erros: () => achadosNaPagina('<html><head><script>document.cookie="visto=1"</script></head><body></body></html>', proprios) },
    { nome: 'h3-cookies-imagem-de-fora', espera: /recurso de outra origem carregado/, erros: () => achadosNaPagina('<html><body><img src="https://pixel.example/p.gif" alt=""></body></html>', proprios) },
    { nome: 'h3-cookies-letra-de-fora', espera: /pedido ao carregar/, erros: () => achadosNaPagina('<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=X"></head><body></body></html>', proprios) },
    { nome: 'h3-cookies-guiao-servido', espera: /manda balizas/, erros: () => achadosNoGuiao('navigator.sendBeacon("/x", "y");') },
    { nome: 'h3-cookies-guiao-servido-limpo', espera: null, erros: () => achadosNoGuiao("try { localStorage.getItem('tema'); } catch (e) {}") },
    { nome: 'h3-cookies-configuracao', espera: /Set-Cookie/, erros: () => achadosNaConfiguracao('{"routes":[{"src":"/(.*)","headers":{"Set-Cookie":"x=1"}}]}') },
    { nome: 'h3-cookies-funcao', espera: /Set-Cookie/, erros: () => achadosNaFuncao("res.setHeader('Set-Cookie', 'x=1');") },
  ];
  return casos.map((c) => {
    const erros = c.erros();
    const mordeu = c.espera === null ? erros.length === 0 : erros.some((e) => c.espera.test(e));
    return { nome: c.nome, mordeu };
  });
}
