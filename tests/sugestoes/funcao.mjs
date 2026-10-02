#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A CÉLULA DA FUNÇÃO DAS SUGESTÕES (bloco S1, 02.10.2026, ponto 7 do brief)
 * ---------------------------------------------------------------------------
 * Importa o `GET` e o `POST` de `api/sugestoes.js` com um `fetch` substituído e
 * um sal de ensaio gerado em cada corrida (nunca escrito em lado nenhum), e prova
 * cada caso pelo que a função responde e pelo que ela pede à base:
 *
 *   get          · o GET leva ao formulário;
 *   armadilha    · o campo armadilhado preenchido leva ao obrigado sem chamar a base;
 *   vazia        · as três caixas em branco levam à página da vazia sem chamar a base;
 *   boa          · uma sugestão chama a base uma vez, com os sete parâmetros e mais
 *                  nenhum, a marca igual a sha256(sal | ip) do primeiro endereço de
 *                  `x-forwarded-for`, a página lida do `?de=` do `Referer`, os
 *                  campos em branco como `null`, e leva ao obrigado;
 *   boa-en       · a edição inglesa leva às páginas inglesas, e sem `Referer` a
 *                  página vai como `null`;
 *   limite       · a recusa `limite` da base leva à página do limite;
 *   cheia        · a recusa `cheia` leva à página do não chegou;
 *   rede         · uma falha de rede leva à página do não chegou;
 *   sem-sal      · sem o sal, não chegou, e a base não é chamada;
 *   corte        · um texto mais comprido do que o limite chega cortado no limite,
 *                  contado em caracteres e sem partir um carácter a meio;
 *   de-fora      · um `?de=` que não é um caminho deste sítio vai como `null`;
 *   exportacoes  · o módulo exporta o `GET` e o `POST` e mais nada.
 *
 * Os caminhos esperados saem da tabela das rotas (`routePath`) e não de uma lista
 * escrita aqui: é assim que esta célula prova que a função manda o leitor para
 * as páginas que a construção faz.
 *
 * AS PLANTAS (`--prova`). Cada caso tem a sua: uma troca no código da função que
 * inverte a condição que o caso protege, numa cópia escrita numa pasta temporária
 * de nome único, fora da árvore. A planta morde quando o caso dela falha sobre a
 * cópia; uma troca que não ache o seu pedaço de código é um erro, porque uma
 * planta que não muda nada não prova nada. Sem rede: a base nunca é chamada.
 *
 * Uso:  node tests/sugestoes/funcao.mjs [--prova] [--json <ficheiro>]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { routePath } from '../../src/lib/routes.mjs';
import { ROTAS_DO_RESULTADO, LIMITES_DAS_SUGESTOES } from '../../src/data/sugestoes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FUNCAO = path.join(RAIZ, 'api', 'sugestoes.js');
/** Endereços de documentação (RFC 5737): não são de ninguém. */
const IP = '203.0.113.7';
const IP_DE_PASSAGEM = '198.51.100.23';
const ORIGEM = 'https://ensaio.invalid';

const resultadoEm = (qual, lang) => routePath(ROTAS_DO_RESULTADO[qual], lang);

/**
 * Corre um pedido contra um módulo, com o `fetch` e o sal dados, e devolve a
 * resposta e as chamadas à base.
 */
async function corre(modulo, { metodo = 'POST', campos = {}, cabecalhos = {}, sal, base }) {
  const chamadas = [];
  const fetchOriginal = globalThis.fetch;
  const salOriginal = process.env.SUGESTOES_SAL;
  globalThis.fetch = async (url, init) => {
    chamadas.push({ url: String(url), init });
    if (base === 'rede') throw new TypeError('falha de rede de ensaio');
    if (base === 'limite' || base === 'cheia') {
      return new Response(JSON.stringify({ code: 'P0001', details: null, hint: null, message: base }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(JSON.stringify('00000000-0000-4000-8000-000000000000'), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
  if (sal === null) delete process.env.SUGESTOES_SAL;
  else process.env.SUGESTOES_SAL = sal;
  try {
    const pedido =
      metodo === 'GET'
        ? new Request(`${ORIGEM}/api/sugestoes`)
        : new Request(`${ORIGEM}/api/sugestoes`, {
            method: 'POST',
            body: new URLSearchParams(campos),
            headers: cabecalhos,
          });
    const resposta = await (metodo === 'GET' ? modulo.GET(pedido) : modulo.POST(pedido));
    return { estado: resposta.status, location: resposta.headers.get('location'), chamadas };
  } finally {
    globalThis.fetch = fetchOriginal;
    if (salOriginal === undefined) delete process.env.SUGESTOES_SAL;
    else process.env.SUGESTOES_SAL = salOriginal;
  }
}

const marcaDe = (sal, ip) => createHash('sha256').update(`${sal}|${ip}`).digest('hex');
const SETE = ['p_contacto', 'p_estudo', 'p_lingua', 'p_marca', 'p_outro', 'p_pagina', 'p_procurou'];
const SURROGATO_SOLTO = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

/** O que se espera de um redirecionamento: 303 para o caminho dado. */
function redireciona(r, caminho, erros) {
  if (r.estado !== 303) erros.push(`o estado é ${r.estado}, e não 303`);
  if (r.location !== caminho) erros.push(`o location é ${JSON.stringify(r.location)}, e não ${JSON.stringify(caminho)}`);
}

/** O corpo da única chamada à base, conferido na forma; devolve o corpo lido. */
function chamadaUnica(r, erros) {
  if (r.chamadas.length !== 1) {
    erros.push(`a base foi chamada ${r.chamadas.length} vez(es), e não uma`);
    return null;
  }
  const { url, init } = r.chamadas[0];
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co\/rest\/v1\/rpc\/enviar_sugestao$/.test(url)) {
    erros.push(`o pedido vai para ${url}, e não para a função enviar_sugestao da base`);
  }
  if (init?.method !== 'POST') erros.push(`o pedido à base é ${init?.method}, e não POST`);
  const h = new Headers(init?.headers);
  if (!(h.get('apikey') ?? '').startsWith('sb_publishable_')) erros.push('a chave do pedido não é a chave pública');
  if (h.get('content-type') !== 'application/json') erros.push('o pedido à base não é JSON');
  let corpo = null;
  try {
    corpo = JSON.parse(String(init?.body));
  } catch {
    erros.push('o corpo do pedido à base não é JSON');
    return null;
  }
  const chaves = Object.keys(corpo).sort();
  if (JSON.stringify(chaves) !== JSON.stringify(SETE)) {
    erros.push(`os parâmetros são ${chaves.join(', ')}, e não os sete da função da base`);
  }
  return corpo;
}

/** Os casos, cada um com o pedido e o que se confere na resposta. */
const CASOS = {
  get: {
    pedido: () => ({ metodo: 'GET' }),
    confere: (r) => {
      const erros = [];
      redireciona(r, routePath('sugestoes', 'pt'), erros);
      if (r.chamadas.length) erros.push('o GET chamou a base');
      return erros;
    },
  },
  armadilha: {
    pedido: () => ({ campos: { lingua: 'pt', sitio: 'https://robo.invalid/', procurou: 'texto de um robô' } }),
    confere: (r) => {
      const erros = [];
      redireciona(r, resultadoEm('obrigado', 'pt'), erros);
      if (r.chamadas.length) erros.push(`a armadilha preenchida chamou a base ${r.chamadas.length} vez(es)`);
      return erros;
    },
  },
  vazia: {
    pedido: () => ({ campos: { lingua: 'pt', procurou: '   ', estudo: '', outro: '\r\n', contacto: 'leitor@example.org' } }),
    confere: (r) => {
      const erros = [];
      redireciona(r, resultadoEm('vazia', 'pt'), erros);
      if (r.chamadas.length) erros.push(`a sugestão vazia chamou a base ${r.chamadas.length} vez(es)`);
      return erros;
    },
  },
  boa: {
    pedido: () => ({
      campos: { lingua: 'pt', sitio: '', procurou: '  uma procura de ensaio\r\nem duas linhas  ', estudo: '', outro: '   ', contacto: '' },
      cabecalhos: { 'x-forwarded-for': `${IP}, ${IP_DE_PASSAGEM}`, referer: `${ORIGEM}/sugestoes?de=%2Flugares%2Fevora` },
    }),
    confere: (r, sal) => {
      const erros = [];
      redireciona(r, resultadoEm('obrigado', 'pt'), erros);
      const c = chamadaUnica(r, erros);
      if (c) {
        if (c.p_lingua !== 'pt') erros.push(`a língua foi ${JSON.stringify(c.p_lingua)}`);
        if (c.p_pagina !== '/lugares/evora') erros.push(`a página foi ${JSON.stringify(c.p_pagina)}, e não a do ?de= do Referer`);
        if (c.p_procurou !== 'uma procura de ensaio\nem duas linhas') erros.push(`o texto foi ${JSON.stringify(c.p_procurou)}`);
        for (const k of ['p_estudo', 'p_outro', 'p_contacto']) {
          if (c[k] !== null) erros.push(`${k} foi ${JSON.stringify(c[k])}, e um campo em branco vai como null`);
        }
        if (c.p_marca !== marcaDe(sal, IP)) erros.push('a marca não é sha256(sal | ip) do primeiro endereço de x-forwarded-for');
      }
      return erros;
    },
  },
  'boa-en': {
    pedido: () => ({
      campos: { lingua: 'en', estudo: 'a study of the rehearsal', contacto: ' leitor@example.org ' },
      cabecalhos: { 'x-forwarded-for': IP },
    }),
    confere: (r, sal) => {
      const erros = [];
      redireciona(r, resultadoEm('obrigado', 'en'), erros);
      const c = chamadaUnica(r, erros);
      if (c) {
        if (c.p_lingua !== 'en') erros.push(`a língua foi ${JSON.stringify(c.p_lingua)}`);
        if (c.p_pagina !== null) erros.push(`sem Referer a página foi ${JSON.stringify(c.p_pagina)}, e não null`);
        if (c.p_estudo !== 'a study of the rehearsal') erros.push(`o estudo foi ${JSON.stringify(c.p_estudo)}`);
        if (c.p_contacto !== 'leitor@example.org') erros.push(`o contacto foi ${JSON.stringify(c.p_contacto)}`);
        if (c.p_procurou !== null) erros.push(`o campo em branco foi ${JSON.stringify(c.p_procurou)}`);
        if (c.p_marca !== marcaDe(sal, IP)) erros.push('a marca não é sha256(sal | ip)');
      }
      return erros;
    },
  },
  limite: {
    pedido: () => ({ campos: { lingua: 'pt', outro: 'a sexta da hora' }, cabecalhos: { 'x-forwarded-for': IP } }),
    base: 'limite',
    confere: (r) => {
      const erros = [];
      redireciona(r, resultadoEm('limite', 'pt'), erros);
      if (r.chamadas.length !== 1) erros.push(`a base foi chamada ${r.chamadas.length} vez(es)`);
      return erros;
    },
  },
  cheia: {
    pedido: () => ({ campos: { lingua: 'en', outro: 'the box is full' }, cabecalhos: { 'x-forwarded-for': IP } }),
    base: 'cheia',
    confere: (r) => {
      const erros = [];
      redireciona(r, resultadoEm('naoChegou', 'en'), erros);
      return erros;
    },
  },
  rede: {
    pedido: () => ({ campos: { lingua: 'pt', procurou: 'a rede caiu' }, cabecalhos: { 'x-forwarded-for': IP } }),
    base: 'rede',
    confere: (r) => {
      const erros = [];
      redireciona(r, resultadoEm('naoChegou', 'pt'), erros);
      return erros;
    },
  },
  'sem-sal': {
    pedido: () => ({ campos: { lingua: 'pt', procurou: 'sem sal' }, cabecalhos: { 'x-forwarded-for': IP } }),
    semSal: true,
    confere: (r) => {
      const erros = [];
      redireciona(r, resultadoEm('naoChegou', 'pt'), erros);
      if (r.chamadas.length) erros.push(`sem o sal a base foi chamada ${r.chamadas.length} vez(es)`);
      return erros;
    },
  },
  corte: {
    pedido: () => ({
      campos: { lingua: 'pt', procurou: 'a'.repeat(LIMITES_DAS_SUGESTOES.texto - 1) + '😀' + 'b'.repeat(10) },
      cabecalhos: { 'x-forwarded-for': IP },
    }),
    confere: (r) => {
      const erros = [];
      redireciona(r, resultadoEm('obrigado', 'pt'), erros);
      const c = chamadaUnica(r, erros);
      if (c) {
        const t = String(c.p_procurou);
        if (Array.from(t).length !== LIMITES_DAS_SUGESTOES.texto) {
          erros.push(`o texto cortado tem ${Array.from(t).length} caracteres, e não o limite`);
        }
        if (SURROGATO_SOLTO.test(t)) erros.push('o corte partiu um carácter a meio');
      }
      return erros;
    },
  },
  'de-fora': {
    pedido: () => ({
      campos: { lingua: 'pt', procurou: 'um ?de= de fora' },
      cabecalhos: { 'x-forwarded-for': IP, referer: `${ORIGEM}/sugestoes?de=${encodeURIComponent('https://fora.invalid/')}` },
    }),
    confere: (r) => {
      const erros = [];
      const c = chamadaUnica(r, erros);
      if (c && c.p_pagina !== null) erros.push(`um ?de= de fora foi como página: ${JSON.stringify(c.p_pagina)}`);
      return erros;
    },
  },
  exportacoes: {
    estatico: true,
    confere: (_r, _sal, modulo) => {
      const nomes = Object.keys(modulo).sort();
      return JSON.stringify(nomes) === JSON.stringify(['GET', 'POST'])
        ? []
        : [`o módulo exporta ${nomes.join(', ')}, e não só o GET e o POST`];
    },
  },
};

/** Corre todos os casos (ou um) contra um módulo, e devolve os erros por caso. */
async function correCasos(modulo, so = null) {
  const sal = randomBytes(16).toString('hex');
  const resultados = [];
  for (const [nome, caso] of Object.entries(CASOS)) {
    if (so && nome !== so) continue;
    let erros;
    try {
      if (caso.estatico) erros = caso.confere(null, sal, modulo);
      else {
        const r = await corre(modulo, { ...caso.pedido(), sal: caso.semSal ? null : sal, base: caso.base ?? 'aceita' });
        erros = caso.confere(r, sal, modulo);
      }
    } catch (e) {
      erros = [`o caso atirou: ${e instanceof Error ? e.message : String(e)}`];
    }
    resultados.push({ caso: nome, passou: erros.length === 0, erros });
  }
  return resultados;
}

/**
 * AS PLANTAS: a troca no código da função que inverte a condição de cada caso.
 * `de` tem de estar no ficheiro exatamente uma vez.
 */
const PLANTAS = [
  { nome: 'get-para-outra-pagina', caso: 'get', de: "return para(routePath('sugestoes', 'pt'));", para: "return para(routePath('sugestoesObrigado', 'pt'));" },
  { nome: 'armadilha-invertida', caso: 'armadilha', de: "if (campo(dados, 'sitio', 10) !== null)", para: "if (campo(dados, 'sitio', 10) === null)" },
  { nome: 'vazia-invertida', caso: 'vazia', de: 'if (procurou === null && estudo === null && outro === null)', para: 'if (procurou !== null && estudo !== null && outro !== null)' },
  { nome: 'marca-sem-separador', caso: 'boa', de: '`${sal}|${ip}`', para: '`${sal}${ip}`' },
  { nome: 'marca-do-ultimo-endereco', caso: 'boa', de: ".split(',')[0].trim()", para: ".split(',').pop()?.trim()" },
  /* Só o parâmetro do estudo: trocar o `null` de `campo()` mexia também na armadilha, e a planta mordia por outra razão. */
  { nome: 'campo-em-branco-como-cadeia-vazia', caso: 'boa', de: 'p_estudo: estudo,', para: "p_estudo: estudo ?? '',"},
  { nome: 'pagina-sem-o-de-do-referer', caso: 'boa', de: "searchParams.get('de')", para: "searchParams.get('da')" },
  { nome: 'lingua-sempre-portuguesa', caso: 'boa-en', de: "dados.get('lingua') === 'en' ? 'en' : 'pt'", para: "dados.get('lingua') === 'en' ? 'pt' : 'pt'" },
  { nome: 'limite-invertido', caso: 'limite', de: "erro?.message === 'limite'", para: "erro?.message !== 'limite'" },
  { nome: 'cheia-como-limite', caso: 'cheia', de: "if (erro?.message === 'limite')", para: "if (erro?.message === 'limite' || erro?.message === 'cheia')" },
  { nome: 'rede-como-obrigado', caso: 'rede', de: "  } catch {\n    return resultado('naoChegou', lingua);\n  }", para: "  } catch {\n    return resultado('obrigado', lingua);\n  }" },
  { nome: 'sal-invertido', caso: 'sem-sal', de: 'if (!sal)', para: "if (sal === 'nunca')" },
  { nome: 'corte-em-unidades-de-utf16', caso: 'corte', de: "return limpo === '' ? null : Array.from(limpo).slice(0, maximo).join('');", para: "return limpo === '' ? null : limpo.slice(0, maximo);" },
  { nome: 'de-de-fora-aceite', caso: 'de-fora', de: "if (!de.startsWith('/') || de.startsWith('//') ||", para: "if (de.startsWith('//') ||" },
  { nome: 'exportacao-a-mais', caso: 'exportacoes', de: '/** O GET leva ao formulário. */', para: 'export const PLANTA = 1;\n/** O GET leva ao formulário. */' },
];

/** Escreve uma cópia da função com uma troca, numa pasta temporária, e importa-a. */
async function importaCopia(pasta, texto, n) {
  const ficheiro = path.join(pasta, `sugestoes-${n}.mjs`);
  const comImportacoes = texto
    .replace("'../src/lib/routes.mjs'", JSON.stringify(pathToFileURL(path.join(RAIZ, 'src/lib/routes.mjs')).href))
    .replace("'../src/data/sugestoes.mjs'", JSON.stringify(pathToFileURL(path.join(RAIZ, 'src/data/sugestoes.mjs')).href));
  fs.writeFileSync(ficheiro, comImportacoes);
  return import(pathToFileURL(ficheiro).href);
}

async function correPlantas() {
  const original = fs.readFileSync(FUNCAO, 'utf8');
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-sugestoes-'));
  const resultados = [];
  try {
    /* O controlo: a cópia sem troca nenhuma tem de passar todos os casos, senão
       uma planta mordia pela cópia e não pela troca. */
    const controlo = await correCasos(await importaCopia(pasta, original, 0));
    const controloMau = controlo.filter((c) => !c.passou);
    resultados.push({ nome: 'controlo-sem-troca', caso: '(todos)', mudou: false, mordeu: false, passou: controloMau.length === 0, erros: controloMau.flatMap((c) => c.erros) });
    let n = 1;
    for (const p of PLANTAS) {
      const vezes = original.split(p.de).length - 1;
      if (vezes !== 1) {
        resultados.push({ nome: p.nome, caso: p.caso, mudou: false, mordeu: false, passou: false, erros: [`a troca acha o seu pedaço ${vezes} vez(es), e tem de o achar uma`] });
        continue;
      }
      const modulo = await importaCopia(pasta, original.replace(p.de, p.para), n++);
      const [r] = await correCasos(modulo, p.caso);
      const mordeu = r ? !r.passou : false;
      resultados.push({ nome: p.nome, caso: p.caso, mudou: true, mordeu, passou: mordeu, erros: r?.erros ?? [] });
    }
  } finally {
    fs.rmSync(pasta, { recursive: true, force: true });
  }
  return resultados;
}

const argv = process.argv.slice(2);
const prova = argv.includes('--prova');
const iJson = argv.indexOf('--json');

const casos = await correCasos(await import(pathToFileURL(FUNCAO).href));
const plantas = prova ? await correPlantas() : [];
const casosMaus = casos.filter((c) => !c.passou);
const plantasMas = plantas.filter((p) => !p.passou);
const casosSemPlanta = prova ? Object.keys(CASOS).filter((c) => !PLANTAS.some((p) => p.caso === c)) : [];

const relatorio = {
  celula: 'a função das sugestões (bloco S1)',
  funcao: 'api/sugestoes.js',
  casos,
  plantas,
  casos_sem_planta: casosSemPlanta,
  passou: casosMaus.length === 0 && plantasMas.length === 0 && casosSemPlanta.length === 0,
};
if (iJson >= 0 && argv[iJson + 1]) fs.writeFileSync(argv[iJson + 1], JSON.stringify(relatorio, null, 2) + '\n');

for (const c of casos) console.log(`  ${c.passou ? '✓' : '✗'} ${c.caso}${c.passou ? '' : ` · ${c.erros.join(' · ')}`}`);
if (prova) {
  for (const p of plantas) console.log(`  ${p.passou ? '✓' : '✗'} planta ${p.nome} (${p.caso}) · ${p.mordeu ? 'mordeu' : p.nome === 'controlo-sem-troca' ? (p.passou ? 'a cópia sem troca passa' : 'a cópia sem troca falha') : 'NÃO MORDEU'}`);
  if (casosSemPlanta.length) console.log(`  ✗ casos sem planta: ${casosSemPlanta.join(', ')}`);
}
console.log(
  relatorio.passou
    ? `\n  a função das sugestões: ${casos.length} casos verdes${prova ? `, ${plantas.length - 1} plantas que mordem e a cópia de controlo verde` : ''}.`
    : `\n  a função das sugestões: ${casosMaus.length} caso(s) vermelho(s), ${plantasMas.length} planta(s) que não pegaram.`,
);
process.exitCode = relatorio.passou ? 0 : 1;
