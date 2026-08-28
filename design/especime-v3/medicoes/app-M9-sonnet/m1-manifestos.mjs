// medicoes/m1-manifestos.mjs — medição 1: os dois manifestos.
import fs from 'node:fs';
import path from 'node:path';
import { lerCabecaPNG } from './lib/png.mjs';
import { lerTokens } from './lib/tokens.mjs';

const EDICOES = [
  { edicao: 'pt', relManifesto: 'manifest.webmanifest', startUrl: '/', id: '/', lang: 'pt-PT' },
  { edicao: 'en', relManifesto: 'en/manifest.webmanifest', startUrl: '/en/', id: '/en/', lang: 'en' },
];

/**
 * Confere um objeto de manifesto já interpretado (ou `null` se o JSON não
 * interpretou) contra as regras da medição 1. Devolve uma lista de
 * problemas (cadeias); lista vazia = manifesto conforme.
 *
 * `resolverIcone(src)` devolve `{ existe, largura, altura, erro }` para um
 * `src` do manifesto, para que a função sirva tanto o manifesto real (contra
 * `dist/`) como um manifesto plantado (contra um diretório de teste).
 */
export function conferirManifesto(json, erroJSON, { startUrl, id, lang, tokensClaro, resolverIcone }) {
  const problemas = [];
  if (erroJSON) {
    problemas.push(`JSON não interpreta: ${erroJSON.message}`);
    return problemas; // sem objeto, as restantes conferências não fazem sentido
  }
  if (json.name !== 'O Estado do País') problemas.push(`name é ${JSON.stringify(json.name)}, esperava "O Estado do País"`);
  if (json.short_name !== 'O Estado') problemas.push(`short_name é ${JSON.stringify(json.short_name)}, esperava "O Estado"`);
  if (json.display !== 'standalone') problemas.push(`display é ${JSON.stringify(json.display)}, esperava "standalone"`);
  if (json.start_url !== startUrl) problemas.push(`start_url é ${JSON.stringify(json.start_url)}, esperava ${JSON.stringify(startUrl)}`);
  if (json.id !== id) problemas.push(`id é ${JSON.stringify(json.id)}, esperava ${JSON.stringify(id)}`);
  if (json.lang !== lang) problemas.push(`lang é ${JSON.stringify(json.lang)}, esperava ${JSON.stringify(lang)}`);
  if (json.background_color !== tokensClaro.paper)
    problemas.push(`background_color é ${JSON.stringify(json.background_color)}, esperava o token --paper claro ${tokensClaro.paper}`);
  if (json.theme_color !== tokensClaro.paper)
    problemas.push(`theme_color é ${JSON.stringify(json.theme_color)}, esperava o token --paper claro ${tokensClaro.paper}`);

  const icones = Array.isArray(json.icons) ? json.icons : [];
  const tem192 = icones.some((i) => i.sizes === '192x192' && i.purpose !== 'maskable');
  const tem512 = icones.some((i) => i.sizes === '512x512' && i.purpose !== 'maskable');
  const temMaskable512 = icones.some((i) => i.sizes === '512x512' && i.purpose === 'maskable');
  if (!tem192) problemas.push('falta um ícone 192x192 (não maskable) em icons');
  if (!tem512) problemas.push('falta um ícone 512x512 (não maskable) em icons');
  if (!temMaskable512) problemas.push('falta um ícone 512x512 purpose=maskable em icons');

  for (const icone of icones) {
    const r = resolverIcone(icone.src);
    if (!r.existe) {
      problemas.push(`ícone ${icone.src}: ficheiro não existe (${r.erro ?? ''})`);
      continue;
    }
    const declarado = String(icone.sizes || '');
    const real = `${r.largura}x${r.altura}`;
    if (declarado !== real) {
      problemas.push(`ícone ${icone.src}: manifesto diz sizes="${declarado}", a cabeça do PNG diz ${real}`);
    }
  }
  return problemas;
}

function carregarJSON(caminho) {
  let texto;
  try {
    texto = fs.readFileSync(caminho, 'utf8');
  } catch (erro) {
    return { json: null, erro };
  }
  try {
    return { json: JSON.parse(texto), erro: null };
  } catch (erro) {
    return { json: null, erro };
  }
}

function resolverIconeContraDist(distRoot, src) {
  if (!src || typeof src !== 'string') return { existe: false, erro: 'src ausente ou não é cadeia' };
  const rel = src.replace(/^\//, '');
  const caminho = path.join(distRoot, rel);
  if (!fs.existsSync(caminho)) return { existe: false, erro: `não encontrado em ${caminho}` };
  try {
    const cabeca = lerCabecaPNG(fs.readFileSync(caminho));
    return { existe: true, largura: cabeca.largura, altura: cabeca.altura };
  } catch (erro) {
    return { existe: false, erro: `não é PNG legível: ${erro.message}` };
  }
}

export async function medir({ distRoot, tokensCssPath, dirEscala }) {
  const tokensClaro = lerTokens(tokensCssPath).claro;
  const resultado = { medicao: 1, edicoes: {}, casoConhecido: null };

  for (const e of EDICOES) {
    const caminho = path.join(distRoot, e.relManifesto);
    const { json, erro } = carregarJSON(caminho);
    const problemas = conferirManifesto(json, erro, {
      startUrl: e.startUrl,
      id: e.id,
      lang: e.lang,
      tokensClaro,
      resolverIcone: (src) => resolverIconeContraDist(distRoot, src),
    });
    resultado.edicoes[e.edicao] = {
      caminho,
      json,
      problemas,
      conforme: problemas.length === 0,
    };
  }

  // ---- caso vermelho plantado --------------------------------------------
  // Duas mutações independentes no manifesto pt real: (a) short_name errado,
  // (b) o icon-192 apontado a declarar sizes="999x999" (a cabeça do PNG real
  // continua a dizer 192x192). As duas têm de acender.
  const ptReal = carregarJSON(path.join(distRoot, 'manifest.webmanifest')).json;
  const mutado = JSON.parse(JSON.stringify(ptReal));
  mutado.short_name = 'Nome Errado';
  mutado.icons = mutado.icons.map((i) => (i.sizes === '192x192' ? { ...i, sizes: '999x999' } : i));
  const problemasMutado = conferirManifesto(mutado, null, {
    startUrl: '/',
    id: '/',
    lang: 'pt-PT',
    tokensClaro,
    resolverIcone: (src) => resolverIconeContraDist(distRoot, src),
  });
  const jsonPartido = '{ "name": "O Estado do País", '; // vírgula final ilegal por falta de fecho
  const { json: jPartido, erro: ePartido } = (() => {
    try {
      return { json: JSON.parse(jsonPartido), erro: null };
    } catch (erro) {
      return { json: null, erro };
    }
  })();
  const problemasJsonPartido = conferirManifesto(jPartido, ePartido, {
    startUrl: '/',
    id: '/',
    lang: 'pt-PT',
    tokensClaro,
    resolverIcone: () => ({ existe: false }),
  });

  resultado.casoConhecido = {
    descricao:
      'cópia do manifesto pt com short_name trocado para "Nome Errado" e o icon-192 a declarar sizes="999x999" (a cabeça do PNG real continua 192x192); e um JSON propositadamente mal formado.',
    problemasNaCopiaMutada: problemasMutado,
    viuVermelhoNaCopiaMutada: problemasMutado.length > 0,
    problemasNoJsonPartido: problemasJsonPartido,
    viuVermelhoNoJsonPartido: problemasJsonPartido.length > 0,
  };

  return resultado;
}
