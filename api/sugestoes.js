/**
 * A caixa das sugestões (bloco S1): recebe o formulário simples de /sugestoes e
 * de /en/suggestions, confere a armadilha e se a sugestão traz texto, e entrega-a
 * à base pela única porta que a base tem (a função `enviar_sugestao`, que só
 * insere, que exige a chave que só a Vercel tem, e que limita por marca horária).
 * Não guarda o endereço IP: guarda, durante uma hora, uma marca que é o resumo do
 * IP e da hora com um sal que só a Vercel conhece. Funciona sem JavaScript no
 * leitor.
 *
 * Cada resposta é um redirecionamento 303 para uma página estática do sítio: o
 * formulário (o GET), ou uma das quatro páginas do resultado (a sugestão chegou,
 * vinha vazia, passou o limite da hora, não chegou). Os caminhos saem da tabela
 * das rotas do sítio (`src/lib/routes.mjs`), a mesma que constrói as páginas, e
 * o caminho vai relativo no `Location`, para servir igual no domínio e numa
 * pré-visualização.
 *
 * A PASSAGEM S1-b (03.10.2026, a leitura a frio do Sol, com a triagem do lugar de
 * direção em `design/especime-v3/critica/LEITURA-S1-2026-10-03.md`):
 *   · a chave (o achado 2): a função da base só aceita chamadas com a chave que a
 *     variável sensível `SUGESTOES_CHAVE` da Vercel guarda; sem a chave, como sem
 *     o sal, a sugestão não vai. O `trim` é de propósito: o valor da variável pode
 *     ter uma quebra de linha no fim;
 *   · a marca leva a hora UTC inteira (o achado 4), para não ser o mesmo
 *     identificador de hora para hora; o resumo tem sempre 64 caracteres, e a base
 *     recusa outro comprimento;
 *   · sem `x-forwarded-for`, que a Vercel escreve sempre, a sugestão não vai, em
 *     vez de cair na marca de todos; e o `?de=` só se lê de um `Referer` da origem
 *     do próprio pedido (o achado 10).
 *
 * A PASSAGEM S1-c (03.10.2026, decisão do diretor, §1.154): o campo do contacto
 * saiu do formulário, e a caixa não tem resposta. A função manda o parâmetro do
 * contacto sempre vazio, diga o pedido o que disser num campo `contacto`; a
 * coluna da base e o parâmetro da função da base ficam como estão.
 *
 * A chave pública abaixo é a do projeto da base (a documentação da Supabase diz
 * que é segura no código-fonte): sozinha, só chega à função `enviar_sugestao`, e a
 * função recusa quem não traga a outra chave, a que só a Vercel tem.
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
 * A origem pública do pedido. A Vercel compõe o `request.url` de uma função com o
 * `Host` que o leitor pediu e com `http` quando o `Host` não traz a porta 443 (é o
 * que faz o código do `@vercel/node` que adapta um «Web Handler»), e diz o esquema
 * público no `x-forwarded-proto` («typically `https` in production», na sua
 * documentação dos cabeçalhos). Sem este cuidado, a comparação com o `Referer`,
 * que é `https`, falhava sempre no ar, e a página de onde o leitor veio perdia-se
 * em silêncio.
 * @param {Request} request
 */
function origemDoPedido(request) {
  const url = new URL(request.url);
  const proto = (request.headers.get('x-forwarded-proto') ?? '').split(',')[0].trim().toLowerCase();
  return `${proto === 'https' || proto === 'http' ? proto : url.protocol.slice(0, -1)}://${url.host}`;
}

/**
 * A página de onde o leitor veio: o `?de=` da página do formulário, lido do
 * Referer, e só quando o Referer é da origem do próprio pedido (um formulário de
 * outro sítio que publique para aqui não escreve a página de onde se veio). Só um
 * caminho deste sítio, e nunca um endereço de fora.
 * @param {Request} request
 * @returns {string|null}
 */
function paginaDeOrigem(request) {
  try {
    const referer = new URL(request.headers.get('referer') ?? '');
    if (referer.origin !== origemDoPedido(request)) return null;
    const de = referer.searchParams.get('de') ?? '';
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
  if (procurou === null && estudo === null && outro === null) return resultado('vazia', lingua);

  /* Sem o sal não há marca, e sem a chave a base recusa: nos dois casos a sugestão
     não vai. A chave limpa-se das pontas, porque o valor guardado pode ter uma
     quebra de linha no fim. */
  const sal = process.env.SUGESTOES_SAL;
  const chave = (process.env.SUGESTOES_CHAVE ?? '').trim();
  if (!sal || !chave) return resultado('naoChegou', lingua);

  /* Sem o endereço do leitor, a marca seria a mesma para todos os que chegassem
     assim, e o limite de um seria o de todos: a sugestão não vai. */
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
  if (!ip) return resultado('naoChegou', lingua);

  /* A marca de uma hora: o resumo do sal, do endereço e da hora UTC inteira
     (AAAA-MM-DDTHH). Muda de hora para hora, e tem sempre 64 caracteres. */
  const hora = new Date(Date.now()).toISOString().slice(0, 13);
  const marca = createHash('sha256').update(`${sal}|${ip}|${hora}`).digest('hex');

  let resposta;
  try {
    resposta = await fetch(`${BASE}/rest/v1/rpc/enviar_sugestao`, {
      method: 'POST',
      headers: { apikey: CHAVE_PUBLICA, 'content-type': 'application/json' },
      body: JSON.stringify({
        p_chave: chave,
        p_lingua: lingua,
        p_pagina: paginaDeOrigem(request),
        p_procurou: procurou,
        p_estudo: estudo,
        p_outro: outro,
        /* Sempre vazio (S1-c): o leitor já não deixa contacto. */
        p_contacto: null,
        p_marca: marca,
      }),
    });
  } catch {
    return resultado('naoChegou', lingua);
  }
  if (resposta.ok) return resultado('obrigado', lingua);
  const erro = await resposta.json().catch(() => null);
  if (erro?.message === 'limite') return resultado('limite', lingua);
  /* A caixa do dia cheia (`cheia`), a chave recusada (`chave`), a marca recusada
     (`marca`) e qualquer outra recusa: a sugestão não chegou. */
  return resultado('naoChegou', lingua);
}
