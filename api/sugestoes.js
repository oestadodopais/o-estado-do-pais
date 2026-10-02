/**
 * A caixa das sugestões (bloco S1): recebe o formulário simples de /sugestoes e
 * de /en/suggestions, confere a armadilha e se a sugestão traz texto, e entrega-a
 * à base pela única porta que a base tem (a função `enviar_sugestao`, que só
 * insere e que limita por marca horária). Não guarda o endereço IP: guarda,
 * durante uma hora, uma marca que é o resumo do IP com um sal que só a Vercel
 * conhece. Funciona sem JavaScript no leitor.
 *
 * Cada resposta é um redirecionamento 303 para uma página estática do sítio: o
 * formulário (o GET), ou uma das quatro páginas do resultado (a sugestão chegou,
 * vinha vazia, passou o limite da hora, não chegou). Os caminhos saem da tabela
 * das rotas do sítio (`src/lib/routes.mjs`), a mesma que constrói as páginas, e
 * o caminho vai relativo no `Location`, para servir igual no domínio e numa
 * pré-visualização.
 *
 * A chave abaixo é a chave PÚBLICA do projeto da base (a documentação da
 * Supabase diz que é segura no código-fonte): sozinha, só chega ao que a base
 * permite ao papel `anon`, que é chamar esta função e mais nada.
 *
 * Escrita pelo construtor do S1 a partir do protótipo do lugar de direção que o
 * commit do brief trouxe; a célula `tests/sugestoes/funcao.mjs` prova cada caso
 * com um `fetch` substituído, e cada caso tem a sua planta.
 */
import { createHash } from 'node:crypto';
import { routePath } from '../src/lib/routes.mjs';
import { ROTAS_DO_RESULTADO, LIMITES_DAS_SUGESTOES } from '../src/data/sugestoes.mjs';

const BASE = 'https://wyyuaotfebxopmdzdtbu.supabase.co';
const CHAVE_PUBLICA = 'sb_publishable_fUztx608CPszH72mK62RwA__UZu79BQ';

/**
 * Um redirecionamento 303 para uma página do sítio, que o navegador abre com um
 * GET. Nada se guarda em cache: a mesma resposta a dois envios diferentes seria
 * uma mentira a um deles.
 * @param {string} caminho
 */
function para(caminho) {
  return new Response(null, { status: 303, headers: { location: caminho, 'cache-control': 'no-store' } });
}

/**
 * A página do resultado de um envio, na edição do leitor.
 * @param {keyof typeof ROTAS_DO_RESULTADO} qual
 * @param {Lingua} lingua
 */
function resultado(qual, lingua) {
  return para(routePath(ROTAS_DO_RESULTADO[qual], lingua));
}

/**
 * Um campo do formulário, sem os espaços das pontas, com as quebras de linha
 * normalizadas e cortado no limite. O corte conta caracteres e não unidades de
 * UTF-16, como o `char_length` da base, para nunca partir um carácter a meio.
 * Um campo que o leitor não preencheu vai à base como `null`, e não como uma
 * cadeia vazia.
 * @param {FormData} dados
 * @param {string} nome
 * @param {number} maximo
 * @returns {string|null}
 */
function campo(dados, nome, maximo) {
  const v = dados.get(nome);
  const limpo = (typeof v === 'string' ? v : '').replace(/\r\n?/g, '\n').trim();
  return limpo === '' ? null : Array.from(limpo).slice(0, maximo).join('');
}

/**
 * A página de onde o leitor veio: o `?de=` da página do formulário, lido do
 * Referer (que o navegador manda inteiro só na mesma origem). Só um caminho
 * deste sítio, e nunca um endereço de fora.
 * @param {string|null} referer
 * @returns {string|null}
 */
function paginaDeOrigem(referer) {
  try {
    const de = new URL(referer ?? '').searchParams.get('de') ?? '';
    if (!de.startsWith('/') || de.startsWith('//') || /[\s<>"]/.test(de)) return null;
    return Array.from(de).slice(0, LIMITES_DAS_SUGESTOES.pagina).join('');
  } catch {
    return null;
  }
}

/** O GET leva ao formulário. */
export async function GET() {
  return para(routePath('sugestoes', 'pt'));
}

/** @param {Request} request */
export async function POST(request) {
  let dados;
  try {
    dados = await request.formData();
  } catch {
    return resultado('vazia', 'pt');
  }
  /** @type {Lingua} */
  const lingua = dados.get('lingua') === 'en' ? 'en' : 'pt';

  /* A armadilha: um campo que o leitor não vê e que um robô preenche. Finge-se que
     correu bem, e nada vai à base. */
  if (campo(dados, 'sitio', 10) !== null) return resultado('obrigado', lingua);

  const procurou = campo(dados, 'procurou', LIMITES_DAS_SUGESTOES.texto);
  const estudo = campo(dados, 'estudo', LIMITES_DAS_SUGESTOES.texto);
  const outro = campo(dados, 'outro', LIMITES_DAS_SUGESTOES.texto);
  const contacto = campo(dados, 'contacto', LIMITES_DAS_SUGESTOES.contacto);
  if (procurou === null && estudo === null && outro === null) return resultado('vazia', lingua);

  /* Sem o sal não há marca, e sem marca não há limite: a sugestão não vai. */
  const sal = process.env.SUGESTOES_SAL;
  if (!sal) return resultado('naoChegou', lingua);

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
  const marca = createHash('sha256').update(`${sal}|${ip}`).digest('hex');

  let resposta;
  try {
    resposta = await fetch(`${BASE}/rest/v1/rpc/enviar_sugestao`, {
      method: 'POST',
      headers: { apikey: CHAVE_PUBLICA, 'content-type': 'application/json' },
      body: JSON.stringify({
        p_lingua: lingua,
        p_pagina: paginaDeOrigem(request.headers.get('referer')),
        p_procurou: procurou,
        p_estudo: estudo,
        p_outro: outro,
        p_contacto: contacto,
        p_marca: marca,
      }),
    });
  } catch {
    return resultado('naoChegou', lingua);
  }
  if (resposta.ok) return resultado('obrigado', lingua);
  const erro = await resposta.json().catch(() => null);
  if (erro?.message === 'limite') return resultado('limite', lingua);
  /* A caixa do dia cheia (`cheia`) e qualquer outra recusa: a sugestão não chegou. */
  return resultado('naoChegou', lingua);
}
