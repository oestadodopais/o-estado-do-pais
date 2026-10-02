/**
 * A caixa das sugestões (bloco S1): recebe o formulário simples de /sugestoes/ e
 * de /en/suggestions/, confere a armadilha e os limites, e entrega a sugestão à
 * base pela única porta que a base tem (a função `enviar_sugestao`, que só
 * insere e que limita por marca horária). Não guarda o endereço IP: guarda,
 * durante uma hora, uma marca que é o resumo do IP com um sal que só a Vercel
 * conhece. Funciona sem JavaScript no leitor.
 *
 * A chave abaixo é a chave PÚBLICA do projeto da base (a documentação da
 * Supabase diz que é segura no código-fonte): sozinha, só chega ao que a base
 * permite ao papel `anon`, que é chamar esta função e mais nada.
 */
import { createHash } from 'node:crypto';

const BASE = 'https://wyyuaotfebxopmdzdtbu.supabase.co';
const CHAVE_PUBLICA = 'sb_publishable_fUztx608CPszH72mK62RwA__UZu79BQ';
const LIMITES = { pagina: 300, texto: 2000, contacto: 200 };
const FORMULARIO = { pt: '/sugestoes/', en: '/en/suggestions/' };
const OBRIGADO = { pt: '/sugestoes/obrigado/', en: '/en/suggestions/thank-you/' };

const TEXTOS = {
  pt: {
    titulo: 'Sugestões',
    vazia: 'A sugestão vinha vazia. Escreva pelo menos uma das três caixas.',
    limite: 'Chegaram cinco sugestões deste endereço na última hora. Volte a tentar mais tarde.',
    cheia: 'A caixa recebeu hoje tudo o que consegue ler. Volte a tentar amanhã.',
    falhou: 'A caixa não conseguiu guardar a sugestão. Volte a tentar daqui a uns minutos.',
    fechada: 'A caixa das sugestões ainda não está aberta.',
    voltar: 'Voltar ao formulário',
  },
  en: {
    titulo: 'Suggestions',
    vazia: 'The suggestion was empty. Write in at least one of the three boxes.',
    limite: 'Five suggestions arrived from this address in the last hour. Please try again later.',
    cheia: 'The box has received all it can read today. Please try again tomorrow.',
    falhou: 'The box could not save the suggestion. Please try again in a few minutes.',
    fechada: 'The suggestions box is not open yet.',
    voltar: 'Back to the form',
  },
};

function escapa(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pagina(lingua, mensagem, status) {
  const t = TEXTOS[lingua];
  const html = `<!doctype html><html lang="${lingua === 'pt' ? 'pt-PT' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${escapa(t.titulo)}</title></head><body><main><h1>${escapa(t.titulo)}</h1><p>${escapa(mensagem)}</p><p><a href="${FORMULARIO[lingua]}">${escapa(t.voltar)}</a></p></main></body></html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

function campo(dados, nome, maximo) {
  const v = dados.get(nome);
  return (typeof v === 'string' ? v : '').replace(/\r\n?/g, '\n').trim().slice(0, maximo);
}

/** A página de onde o leitor veio: o `?de=` da página do formulário, lido do Referer (mesma origem). */
function paginaDeOrigem(referer) {
  try {
    const de = new URL(referer).searchParams.get('de') || '';
    if (!de.startsWith('/') || de.startsWith('//') || /[\s<>"]/.test(de)) return '';
    return de.slice(0, LIMITES.pagina);
  } catch {
    return '';
  }
}

export async function GET(request) {
  const lingua = new URL(request.url).pathname.startsWith('/en/') ? 'en' : 'pt';
  return Response.redirect(new URL(FORMULARIO[lingua], request.url), 303);
}

export async function POST(request) {
  let dados;
  try {
    dados = await request.formData();
  } catch {
    return pagina('pt', TEXTOS.pt.vazia, 400);
  }
  const lingua = dados.get('lingua') === 'en' ? 'en' : 'pt';
  const t = TEXTOS[lingua];
  const sal = process.env.SUGESTOES_SAL;
  if (!sal) return pagina(lingua, t.fechada, 503);

  /* A armadilha: um campo que o leitor não vê e que um robô preenche. Finge-se que correu bem. */
  if (campo(dados, 'sitio', 10) !== '') return Response.redirect(new URL(OBRIGADO[lingua], request.url), 303);

  const procurou = campo(dados, 'procurou', LIMITES.texto);
  const estudo = campo(dados, 'estudo', LIMITES.texto);
  const outro = campo(dados, 'outro', LIMITES.texto);
  const contacto = campo(dados, 'contacto', LIMITES.contacto);
  if (!procurou && !estudo && !outro) return pagina(lingua, t.vazia, 400);

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
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
    return pagina(lingua, t.falhou, 502);
  }
  if (resposta.ok) return Response.redirect(new URL(OBRIGADO[lingua], request.url), 303);
  const erro = await resposta.json().catch(() => ({}));
  if (erro && erro.message === 'limite') return pagina(lingua, t.limite, 429);
  if (erro && erro.message === 'cheia') return pagina(lingua, t.cheia, 503);
  return pagina(lingua, t.falhou, 502);
}
