#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A CÉLULA DA FUNÇÃO DAS SUGESTÕES (bloco S1, 02.10.2026, ponto 7 do brief;
 * passagem S1-b, 03.10.2026)
 * ---------------------------------------------------------------------------
 * Importa o `GET` e o `POST` de `api/sugestoes.js` com um `fetch` substituído, um
 * sal e uma chave de ensaio gerados em cada corrida (nunca escritos em lado
 * nenhum; a chave leva uma quebra de linha no fim, como a variável da Vercel pode
 * levar) e o relógio fixo, e prova cada caso pelo que a função responde e pelo
 * que ela pede à base:
 *
 *   get                      · o GET leva ao formulário;
 *   armadilha                · o campo armadilhado preenchido leva ao obrigado sem chamar a base;
 *   vazia                    · as três caixas em branco levam à página da vazia sem chamar a base;
 *   boa                      · uma sugestão chama a base uma vez, com a marca igual a
 *                              sha256(sal | ip | hora) do primeiro endereço de `x-forwarded-for`
 *                              e da hora UTC inteira, a página lida do `?de=` de um `Referer` da
 *                              origem do pedido (o `request.url` em `http`, como a Vercel o
 *                              compõe, e o esquema público no `x-forwarded-proto`), os campos em
 *                              branco como `null`, e leva ao obrigado;
 *   boa-en                   · a edição inglesa leva às páginas inglesas, e sem `Referer` a página
 *                              vai como `null`;
 *   limite                   · a recusa `limite` da base leva à página do limite;
 *   cheia                    · a recusa `cheia` leva à página do não chegou;
 *   chave-recusada           · a recusa `chave` da base leva à página do não chegou;
 *   rede                     · uma falha de rede leva à página do não chegou;
 *   sem-sal                  · sem o sal, não chegou, e a base não é chamada;
 *   sem-chave                · sem a chave (ou com uma chave só de espaços), não chegou, e a base
 *                              não é chamada;
 *   sem-ip                   · sem `x-forwarded-for`, não chegou, e a base não é chamada;
 *   corte                    · um texto mais comprido do que o limite chega cortado no limite,
 *                              contado em caracteres e sem partir um carácter a meio;
 *   de-fora                  · um `?de=` que não é um caminho deste sítio vai como `null`;
 *   referer-de-outra-origem  · o `?de=` de um `Referer` de outro anfitrião ou de outro esquema vai
 *                              como `null`;
 *   marca-de-hora-a-hora     · a mesma pessoa tem uma marca dentro da mesma hora e outra na hora
 *                              seguinte, e cada marca tem 64 caracteres;
 *   exportacoes              · o módulo exporta o `GET` e o `POST` e mais nada.
 *
 * E EM TODOS OS CASOS (S1-b, os achados 2 e 9 da leitura a frio): cada corpo que vai à base leva os
 * oito parâmetros da função da base e mais nenhum, com a chave limpa das pontas e uma marca de 64
 * caracteres hexadecimais; e nenhuma resposta, no corpo ou nos cabeçalhos, traz o sal, a chave ou um
 * endereço do leitor.
 *
 * Os caminhos esperados saem da tabela das rotas (`routePath`) e não de uma lista escrita aqui: é
 * assim que esta célula prova que a função manda o leitor para as páginas que a construção faz.
 *
 * AS PLANTAS (`--prova`). Cada caso tem pelo menos uma: uma troca no código da função que inverte a
 * condição que o caso protege, numa cópia escrita numa pasta temporária de nome único, fora da
 * árvore. A planta morde quando o caso dela falha sobre a cópia COM A QUEIXA QUE A PLANTA NOMEIA; uma
 * troca que não ache o seu pedaço de código é um erro, porque uma planta que não muda nada não prova
 * nada, e uma que falhe por outra razão não prova a que diz. Sem rede: a base nunca é chamada.
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
/** O anfitrião do ensaio; o pedido chega em `http`, como a Vercel compõe o `request.url`. */
const ANFITRIAO = 'ensaio.invalid';
const URL_DO_PEDIDO = `http://${ANFITRIAO}/api/sugestoes`;
const ORIGEM_PUBLICA = `https://${ANFITRIAO}`;
/** O relógio fixo dos casos: 03.10.2026, 10:30 UTC. */
const AGORA = Date.parse('2026-10-03T10:30:00Z');

const resultadoEm = (qual, lang) => routePath(ROTAS_DO_RESULTADO[qual], lang);
const marcaDe = (sal, ip, quando) =>
  createHash('sha256').update(`${sal}|${ip}|${new Date(quando).toISOString().slice(0, 13)}`).digest('hex');
const OITO = ['p_chave', 'p_contacto', 'p_estudo', 'p_lingua', 'p_marca', 'p_outro', 'p_pagina', 'p_procurou'];
const SURROGATO_SOLTO = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

/**
 * Corre um pedido contra um módulo, com o `fetch`, o sal, a chave e o relógio dados, e devolve a
 * resposta inteira (o estado, o `location`, os cabeçalhos e o corpo) e as chamadas à base.
 */
async function corre(modulo, segredos, { metodo = 'POST', campos = {}, cabecalhos = {}, comSal = true, chave = undefined, base = 'aceita', agora = AGORA }) {
  const chamadas = [];
  const fetchOriginal = globalThis.fetch;
  const agoraOriginal = Date.now;
  const salOriginal = process.env.SUGESTOES_SAL;
  const chaveOriginal = process.env.SUGESTOES_CHAVE;
  globalThis.fetch = async (url, init) => {
    chamadas.push({ url: String(url), init });
    if (base === 'rede') throw new TypeError('falha de rede de ensaio');
    if (base !== 'aceita') {
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
  Date.now = () => agora;
  if (comSal) process.env.SUGESTOES_SAL = segredos.sal;
  else delete process.env.SUGESTOES_SAL;
  const valorDaChave = chave === undefined ? segredos.chave : chave;
  if (valorDaChave === null) delete process.env.SUGESTOES_CHAVE;
  else process.env.SUGESTOES_CHAVE = valorDaChave;
  try {
    const pedido =
      metodo === 'GET'
        ? new Request(URL_DO_PEDIDO)
        : new Request(URL_DO_PEDIDO, {
            method: 'POST',
            body: new URLSearchParams(campos),
            headers: { 'x-forwarded-proto': 'https', ...cabecalhos },
          });
    const resposta = await (metodo === 'GET' ? modulo.GET(pedido) : modulo.POST(pedido));
    return {
      estado: resposta.status,
      location: resposta.headers.get('location'),
      cabecalhos: [...resposta.headers.entries()],
      corpo: await resposta.text(),
      chamadas,
    };
  } finally {
    globalThis.fetch = fetchOriginal;
    Date.now = agoraOriginal;
    if (salOriginal === undefined) delete process.env.SUGESTOES_SAL;
    else process.env.SUGESTOES_SAL = salOriginal;
    if (chaveOriginal === undefined) delete process.env.SUGESTOES_CHAVE;
    else process.env.SUGESTOES_CHAVE = chaveOriginal;
  }
}

/** O corpo de uma chamada à base, lido. */
function corpoDe(chamada) {
  try {
    return JSON.parse(String(chamada.init?.body));
  } catch {
    return null;
  }
}

/**
 * O QUE SE CONFERE EM TODOS OS CASOS: cada corpo que vai à base leva os oito parâmetros, a chave
 * limpa e uma marca de 64 caracteres hexadecimais; nenhuma resposta traz o sal, a chave ou um
 * endereço do leitor, no corpo ou nos cabeçalhos.
 */
function confereSempre(r, segredos) {
  const erros = [];
  for (const chamada of r.chamadas) {
    const c = corpoDe(chamada);
    if (!c) {
      erros.push('um corpo enviado à base não é JSON');
      continue;
    }
    const chaves = Object.keys(c).sort();
    if (JSON.stringify(chaves) !== JSON.stringify(OITO)) erros.push(`um corpo enviado à base leva ${chaves.join(', ')}, e não os oito parâmetros da função da base`);
    if (c.p_chave !== segredos.chave.trim()) erros.push('um corpo enviado à base não leva a chave limpa das pontas');
    if (!/^[0-9a-f]{64}$/.test(String(c.p_marca))) erros.push(`a marca enviada à base não tem 64 caracteres hexadecimais (tem ${String(c.p_marca).length})`);
  }
  const resposta = [r.corpo, ...r.cabecalhos.flat()].join('\n');
  for (const [nome, valor] of [['o sal', segredos.sal], ['a chave', segredos.chave.trim()], ['o endereço do leitor', IP], ['o endereço de passagem', IP_DE_PASSAGEM]]) {
    if (valor && resposta.includes(valor)) erros.push(`a resposta traz ${nome}`);
  }
  return erros;
}

/** O que se espera de um redirecionamento: 303 para o caminho dado. */
function redireciona(r, caminho, erros) {
  if (r.estado !== 303) erros.push(`o estado é ${r.estado}, e não 303`);
  if (r.location !== caminho) erros.push(`o location é ${JSON.stringify(r.location)}, e não ${JSON.stringify(caminho)}`);
}

/** A única chamada à base, com a sua forma conferida; devolve o corpo lido. */
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
  return corpoDe(r.chamadas[0]);
}

const naoChamou = (r, oQue, erros) => {
  if (r.chamadas.length) erros.push(`${oQue} chamou a base ${r.chamadas.length} vez(es)`);
};

/** Os casos: cada um corre um ou mais pedidos e confere-os. */
const CASOS = {
  get: async (m, s) => {
    const r = await corre(m, s, { metodo: 'GET' });
    const erros = [];
    redireciona(r, routePath('sugestoes', 'pt'), erros);
    naoChamou(r, 'o GET', erros);
    return { respostas: [r], erros };
  },
  armadilha: async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', sitio: 'https://robo.invalid/', procurou: 'texto de um robô' }, cabecalhos: { 'x-forwarded-for': IP } });
    const erros = [];
    redireciona(r, resultadoEm('obrigado', 'pt'), erros);
    naoChamou(r, 'a armadilha preenchida', erros);
    return { respostas: [r], erros };
  },
  vazia: async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', procurou: '   ', estudo: '', outro: '\r\n', contacto: 'leitor@example.org' }, cabecalhos: { 'x-forwarded-for': IP } });
    const erros = [];
    redireciona(r, resultadoEm('vazia', 'pt'), erros);
    naoChamou(r, 'a sugestão vazia', erros);
    return { respostas: [r], erros };
  },
  boa: async (m, s) => {
    const r = await corre(m, s, {
      campos: { lingua: 'pt', sitio: '', procurou: '  uma procura de ensaio\r\nem duas linhas  ', estudo: '', outro: '   ', contacto: '' },
      cabecalhos: { 'x-forwarded-for': `${IP}, ${IP_DE_PASSAGEM}`, referer: `${ORIGEM_PUBLICA}/sugestoes?de=%2Flugares%2Fevora` },
    });
    const erros = [];
    redireciona(r, resultadoEm('obrigado', 'pt'), erros);
    const c = chamadaUnica(r, erros);
    if (c) {
      if (c.p_lingua !== 'pt') erros.push(`a língua foi ${JSON.stringify(c.p_lingua)}`);
      if (c.p_pagina !== '/lugares/evora') erros.push(`a página foi ${JSON.stringify(c.p_pagina)}, e não a do ?de= do Referer da origem do pedido`);
      if (c.p_procurou !== 'uma procura de ensaio\nem duas linhas') erros.push(`o texto foi ${JSON.stringify(c.p_procurou)}`);
      for (const k of ['p_estudo', 'p_outro', 'p_contacto']) {
        if (c[k] !== null) erros.push(`${k} foi ${JSON.stringify(c[k])}, e um campo em branco vai como null`);
      }
      if (c.p_marca !== marcaDe(s.sal, IP, AGORA)) erros.push('a marca não é sha256(sal | ip | hora) do primeiro endereço de x-forwarded-for e da hora UTC');
    }
    return { respostas: [r], erros };
  },
  'boa-en': async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'en', estudo: 'a study of the rehearsal', contacto: ' leitor@example.org ' }, cabecalhos: { 'x-forwarded-for': IP } });
    const erros = [];
    redireciona(r, resultadoEm('obrigado', 'en'), erros);
    const c = chamadaUnica(r, erros);
    if (c) {
      if (c.p_lingua !== 'en') erros.push(`a língua foi ${JSON.stringify(c.p_lingua)}`);
      if (c.p_pagina !== null) erros.push(`sem Referer a página foi ${JSON.stringify(c.p_pagina)}, e não null`);
      if (c.p_estudo !== 'a study of the rehearsal') erros.push(`o estudo foi ${JSON.stringify(c.p_estudo)}`);
      if (c.p_contacto !== 'leitor@example.org') erros.push(`o contacto foi ${JSON.stringify(c.p_contacto)}`);
      if (c.p_procurou !== null) erros.push(`o campo em branco foi ${JSON.stringify(c.p_procurou)}`);
    }
    return { respostas: [r], erros };
  },
  limite: async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', outro: 'a sexta da hora' }, cabecalhos: { 'x-forwarded-for': IP }, base: 'limite' });
    const erros = [];
    redireciona(r, resultadoEm('limite', 'pt'), erros);
    if (r.chamadas.length !== 1) erros.push(`a base foi chamada ${r.chamadas.length} vez(es)`);
    return { respostas: [r], erros };
  },
  cheia: async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'en', outro: 'the box is full' }, cabecalhos: { 'x-forwarded-for': IP }, base: 'cheia' });
    const erros = [];
    redireciona(r, resultadoEm('naoChegou', 'en'), erros);
    return { respostas: [r], erros };
  },
  'chave-recusada': async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', outro: 'a base recusa a chave' }, cabecalhos: { 'x-forwarded-for': IP }, base: 'chave' });
    const erros = [];
    redireciona(r, resultadoEm('naoChegou', 'pt'), erros);
    return { respostas: [r], erros };
  },
  rede: async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', procurou: 'a rede caiu' }, cabecalhos: { 'x-forwarded-for': IP }, base: 'rede' });
    const erros = [];
    redireciona(r, resultadoEm('naoChegou', 'pt'), erros);
    return { respostas: [r], erros };
  },
  'sem-sal': async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', procurou: 'sem sal' }, cabecalhos: { 'x-forwarded-for': IP }, comSal: false });
    const erros = [];
    redireciona(r, resultadoEm('naoChegou', 'pt'), erros);
    naoChamou(r, 'sem o sal, a função', erros);
    return { respostas: [r], erros };
  },
  'sem-chave': async (m, s) => {
    const erros = [];
    const respostas = [];
    for (const [chave, oQue] of [[null, 'sem a chave'], [' \n', 'com uma chave só de espaços']]) {
      const r = await corre(m, s, { campos: { lingua: 'pt', procurou: 'sem chave' }, cabecalhos: { 'x-forwarded-for': IP }, chave });
      respostas.push(r);
      const meus = [];
      redireciona(r, resultadoEm('naoChegou', 'pt'), meus);
      naoChamou(r, `${oQue}, a função`, meus);
      erros.push(...meus.map((e) => `${oQue}: ${e}`));
    }
    return { respostas, erros };
  },
  'sem-ip': async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', procurou: 'sem endereço' } });
    const erros = [];
    redireciona(r, resultadoEm('naoChegou', 'pt'), erros);
    naoChamou(r, 'sem x-forwarded-for, a função', erros);
    return { respostas: [r], erros };
  },
  corte: async (m, s) => {
    const r = await corre(m, s, { campos: { lingua: 'pt', procurou: 'a'.repeat(LIMITES_DAS_SUGESTOES.texto - 1) + '😀' + 'b'.repeat(10) }, cabecalhos: { 'x-forwarded-for': IP } });
    const erros = [];
    redireciona(r, resultadoEm('obrigado', 'pt'), erros);
    const c = chamadaUnica(r, erros);
    if (c) {
      const t = String(c.p_procurou);
      if (Array.from(t).length !== LIMITES_DAS_SUGESTOES.texto) erros.push(`o texto cortado tem ${Array.from(t).length} caracteres, e não o limite`);
      if (SURROGATO_SOLTO.test(t)) erros.push('o corte partiu um carácter a meio');
    }
    return { respostas: [r], erros };
  },
  'de-fora': async (m, s) => {
    const r = await corre(m, s, {
      campos: { lingua: 'pt', procurou: 'um ?de= de fora' },
      cabecalhos: { 'x-forwarded-for': IP, referer: `${ORIGEM_PUBLICA}/sugestoes?de=${encodeURIComponent('https://fora.invalid/')}` },
    });
    const erros = [];
    const c = chamadaUnica(r, erros);
    if (c && c.p_pagina !== null) erros.push(`um ?de= de fora foi como página: ${JSON.stringify(c.p_pagina)}`);
    return { respostas: [r], erros };
  },
  'referer-de-outra-origem': async (m, s) => {
    const erros = [];
    const respostas = [];
    for (const [referer, oQue] of [
      [`https://outro.invalid/sugestoes?de=%2Fforjada`, 'um Referer de outro anfitrião'],
      [`http://${ANFITRIAO}/sugestoes?de=%2Fforjada`, 'um Referer de outro esquema'],
    ]) {
      const r = await corre(m, s, { campos: { lingua: 'pt', procurou: 'uma proveniência forjada' }, cabecalhos: { 'x-forwarded-for': IP, referer } });
      respostas.push(r);
      const meus = [];
      const c = chamadaUnica(r, meus);
      if (c && c.p_pagina !== null) meus.push(`a página foi ${JSON.stringify(c.p_pagina)}, e não null`);
      erros.push(...meus.map((e) => `${oQue}: ${e}`));
    }
    return { respostas, erros };
  },
  'marca-de-hora-a-hora': async (m, s) => {
    const erros = [];
    const instantes = ['2026-10-03T10:00:00Z', '2026-10-03T10:59:59Z', '2026-10-03T11:00:00Z'].map((x) => Date.parse(x));
    const respostas = [];
    const marcas = [];
    for (const agora of instantes) {
      const r = await corre(m, s, { campos: { lingua: 'pt', procurou: 'a mesma pessoa' }, cabecalhos: { 'x-forwarded-for': IP }, agora });
      respostas.push(r);
      const c = chamadaUnica(r, erros);
      marcas.push(c?.p_marca ?? null);
      if (c && c.p_marca !== marcaDe(s.sal, IP, agora)) erros.push(`a marca de ${new Date(agora).toISOString()} não é sha256(sal | ip | hora) dessa hora`);
      if (c && String(c.p_marca).length !== 64) erros.push(`a marca tem ${String(c.p_marca).length} caracteres, e a base só aceita 64`);
    }
    if (marcas[0] !== marcas[1]) erros.push('dentro da mesma hora, a mesma pessoa tem duas marcas');
    if (marcas[1] === marcas[2]) erros.push('a marca não mudou de uma hora para a seguinte');
    return { respostas, erros };
  },
  exportacoes: async (m) => {
    const nomes = Object.keys(m).sort();
    return { respostas: [], erros: JSON.stringify(nomes) === JSON.stringify(['GET', 'POST']) ? [] : [`o módulo exporta ${nomes.join(', ')}, e não só o GET e o POST`] };
  },
};

/** Corre todos os casos (ou um) contra um módulo, e devolve os erros por caso. */
async function correCasos(modulo, so = null) {
  const segredos = { sal: randomBytes(16).toString('hex'), chave: `${randomBytes(16).toString('hex')}\n` };
  const resultados = [];
  for (const [nome, caso] of Object.entries(CASOS)) {
    if (so && nome !== so) continue;
    let erros;
    try {
      const { respostas, erros: doCaso } = await caso(modulo, segredos);
      erros = [...doCaso, ...respostas.flatMap((r) => confereSempre(r, segredos))];
    } catch (e) {
      erros = [`o caso atirou: ${e instanceof Error ? e.message : String(e)}`];
    }
    resultados.push({ caso: nome, passou: erros.length === 0, erros });
  }
  return resultados;
}

/**
 * AS PLANTAS: a troca no código da função que inverte a condição de cada caso, e a queixa que o caso
 * tem de dar sobre a cópia. `de` tem de estar no ficheiro exatamente uma vez.
 */
const PLANTAS = [
  { nome: 'get-para-outra-pagina', caso: 'get', espera: /o location é/, de: "return para(routePath('sugestoes', 'pt'));", para: "return para(routePath('sugestoesObrigado', 'pt'));" },
  { nome: 'armadilha-invertida', caso: 'armadilha', espera: /a armadilha preenchida chamou a base/, de: "if (campo(dados, 'sitio', 10) !== null)", para: "if (campo(dados, 'sitio', 10) === null)" },
  { nome: 'vazia-invertida', caso: 'vazia', espera: /a sugestão vazia chamou a base/, de: 'if (procurou === null && estudo === null && outro === null)', para: 'if (procurou !== null && estudo !== null && outro !== null)' },
  { nome: 'marca-sem-separador', caso: 'boa', espera: /a marca não é sha256/, de: '`${sal}|${ip}|${hora}`', para: '`${sal}${ip}|${hora}`' },
  { nome: 'marca-do-ultimo-endereco', caso: 'boa', espera: /a marca não é sha256/, de: "(request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim()", para: "((request.headers.get('x-forwarded-for') ?? '').split(',').pop() ?? '').trim()" },
  /* Só o parâmetro do estudo: trocar o `null` de `campo()` mexia também na armadilha, e a planta mordia por outra razão. */
  { nome: 'campo-em-branco-como-cadeia-vazia', caso: 'boa', espera: /p_estudo foi "", e um campo em branco vai como null/, de: 'p_estudo: estudo,', para: "p_estudo: estudo ?? ''," },
  { nome: 'pagina-sem-o-de-do-referer', caso: 'boa', espera: /a página foi null/, de: "searchParams.get('de')", para: "searchParams.get('da')" },
  /* A comparação com a origem do `request.url` e não com a pública: no ar o `request.url` é `http`, e a página perdia-se. */
  { nome: 'origem-sem-o-esquema-publico', caso: 'boa', espera: /a página foi null/, de: 'if (referer.origin !== origemDoPedido(request)) return null;', para: 'if (referer.origin !== new URL(request.url).origin) return null;' },
  { nome: 'chave-sem-trim', caso: 'boa', espera: /não leva a chave limpa das pontas/, de: "(process.env.SUGESTOES_CHAVE ?? '').trim()", para: "(process.env.SUGESTOES_CHAVE ?? '')" },
  { nome: 'corpo-sem-chave', caso: 'boa', espera: /e não os oito parâmetros/, de: '        p_chave: chave,\n', para: '' },
  { nome: 'fuga-do-sal', caso: 'boa', espera: /a resposta traz o sal/, de: "headers: { location: caminho, 'cache-control': 'no-store' }", para: "headers: { location: caminho, 'cache-control': 'no-store', 'x-ensaio': process.env.SUGESTOES_SAL ?? '' }" },
  { nome: 'fuga-da-chave', caso: 'boa', espera: /a resposta traz a chave/, de: 'return new Response(null, { status: 303,', para: "return new Response((process.env.SUGESTOES_CHAVE ?? '').trim() || null, { status: 303," },
  { nome: 'fuga-do-endereco', caso: 'boa', espera: /a resposta traz o endereço do leitor/, de: "if (resposta.ok) return resultado('obrigado', lingua);", para: "if (resposta.ok) { const r = resultado('obrigado', lingua); r.headers.set('x-ensaio', ip); return r; }" },
  { nome: 'lingua-sempre-portuguesa', caso: 'boa-en', espera: /o location é/, de: "dados.get('lingua') === 'en' ? 'en' : 'pt'", para: "dados.get('lingua') === 'en' ? 'pt' : 'pt'" },
  { nome: 'limite-invertido', caso: 'limite', espera: /o location é/, de: "erro?.message === 'limite'", para: "erro?.message !== 'limite'" },
  { nome: 'cheia-como-limite', caso: 'cheia', espera: /o location é/, de: "if (erro?.message === 'limite')", para: "if (erro?.message === 'limite' || erro?.message === 'cheia')" },
  { nome: 'chave-recusada-como-limite', caso: 'chave-recusada', espera: /o location é/, de: "if (erro?.message === 'limite')", para: "if (erro?.message === 'limite' || erro?.message === 'chave')" },
  { nome: 'rede-como-obrigado', caso: 'rede', espera: /o location é/, de: "  } catch {\n    return resultado('naoChegou', lingua);\n  }", para: "  } catch {\n    return resultado('obrigado', lingua);\n  }" },
  { nome: 'sal-invertido', caso: 'sem-sal', espera: /sem o sal, a função chamou a base/, de: 'if (!sal || !chave)', para: "if (sal === 'nunca' || !chave)" },
  { nome: 'chave-invertida', caso: 'sem-chave', espera: /sem a chave, a função chamou a base/, de: 'if (!sal || !chave)', para: "if (!sal || chave === 'nunca')" },
  { nome: 'ip-em-falta-invertido', caso: 'sem-ip', espera: /sem x-forwarded-for, a função chamou a base/, de: "if (!ip) return resultado('naoChegou', lingua);", para: "if (ip === 'nunca') return resultado('naoChegou', lingua);" },
  { nome: 'corte-em-unidades-de-utf16', caso: 'corte', espera: /partiu um carácter a meio/, de: "return limpo === '' ? null : Array.from(limpo).slice(0, maximo).join('');", para: "return limpo === '' ? null : limpo.slice(0, maximo);" },
  { nome: 'de-de-fora-aceite', caso: 'de-fora', espera: /um \?de= de fora foi como página/, de: "if (!de.startsWith('/') || de.startsWith('//') ||", para: "if (de.startsWith('//') ||" },
  { nome: 'referer-de-outra-origem-aceite', caso: 'referer-de-outra-origem', espera: /a página foi "\/forjada"/, de: '    if (referer.origin !== origemDoPedido(request)) return null;\n', para: '' },
  { nome: 'marca-sem-a-hora', caso: 'marca-de-hora-a-hora', espera: /a marca não mudou de uma hora para a seguinte/, de: '`${sal}|${ip}|${hora}`', para: '`${sal}|${ip}`' },
  { nome: 'marca-com-o-dia', caso: 'marca-de-hora-a-hora', espera: /a marca não mudou de uma hora para a seguinte/, de: '.toISOString().slice(0, 13)', para: '.toISOString().slice(0, 10)' },
  { nome: 'marca-em-base64', caso: 'marca-de-hora-a-hora', espera: /e a base só aceita 64/, de: ".digest('hex')", para: ".digest('base64')" },
  { nome: 'exportacao-a-mais', caso: 'exportacoes', espera: /e não só o GET e o POST/, de: '/** O GET leva ao formulário. */', para: 'export const PLANTA = 1;\n/** O GET leva ao formulário. */' },
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
      const erros = r?.erros ?? [];
      const comAQueixa = erros.some((e) => p.espera.test(e));
      resultados.push({ nome: p.nome, caso: p.caso, mudou: true, mordeu: erros.length > 0 && comAQueixa, passou: erros.length > 0 && comAQueixa, queixa_esperada: p.espera.source, erros });
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
  celula: 'a função das sugestões (bloco S1, passagem S1-b)',
  funcao: 'api/sugestoes.js',
  casos,
  plantas,
  casos_sem_planta: casosSemPlanta,
  passou: casosMaus.length === 0 && plantasMas.length === 0 && casosSemPlanta.length === 0,
};
if (iJson >= 0 && argv[iJson + 1]) fs.writeFileSync(argv[iJson + 1], JSON.stringify(relatorio, null, 2) + '\n');

for (const c of casos) console.log(`  ${c.passou ? '✓' : '✗'} ${c.caso}${c.passou ? '' : ` · ${c.erros.join(' · ')}`}`);
if (prova) {
  for (const p of plantas) console.log(`  ${p.passou ? '✓' : '✗'} planta ${p.nome} (${p.caso}) · ${p.nome === 'controlo-sem-troca' ? (p.passou ? 'a cópia sem troca passa' : 'a cópia sem troca falha') : p.mordeu ? 'mordeu com a queixa esperada' : `NÃO MORDEU como devia (${p.erros.join(' · ') || 'sem queixa'})`}`);
  if (casosSemPlanta.length) console.log(`  ✗ casos sem planta: ${casosSemPlanta.join(', ')}`);
}
console.log(
  relatorio.passou
    ? `\n  a função das sugestões: ${casos.length} casos verdes${prova ? `, ${plantas.length - 1} plantas que mordem com a queixa esperada e a cópia de controlo verde` : ''}.`
    : `\n  a função das sugestões: ${casosMaus.length} caso(s) vermelho(s), ${plantasMas.length} planta(s) que não pegaram.`,
);
process.exitCode = relatorio.passou ? 0 : 1;
