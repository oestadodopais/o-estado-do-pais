/** CAM2-A: deteção sem modelo, sobre o texto impresso sem selos. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'node-html-parser';
import {frasesDoTexto} from './voz-autorreferencia.mjs';
import {textoParaProcura, emparelharBlocos} from './leituras/conferir-frases.mjs';
import {tags} from './paridade-numeros.mjs';
import {matchPath, routePath, ROUTES} from '../src/lib/routes.mjs';
import {WORKS, PUBLISHED_EDITIONS} from '../src/data/studies.mjs';
import {DOSSIES} from '../src/data/dossies.mjs';
import {EXPLICACOES} from '../src/data/explicacoes/index.mjs';
import {ENTRADAS} from '../src/data/primeira-pagina.mjs';
export const normal = t => t.normalize('NFKC').replace(/\u200b/g, '').replace(/\s+/g, ' ').trim();
export const sha256 = t => createHash('sha256').update(t).digest('hex');
const palavra = t => new RegExp(`(?<![\\p{L}])(?:${t})(?![\\p{L}])`, 'iu');
const atrPt = {test: t => /«[^»]{12,}»/u.test(t) || palavra('segundo(?!\\s+(?:trimestre|semestre|ano|mandato|relatório|protocolo|lugar|desencontro|turno|ciclo|período|painel)\\b)|de acordo com|disse|disseram|afirmou|afirma|afirmam|defende|defendeu|considera|considerou|declarou|garantiu|acusou|criticou|reconheceu|prometeu|anunciou|escreveu|escreve').test(t)};
const cauPt = palavra('porque|devido a|devido ao|devido à|por causa d|graças a|explica|explicam|explicou|levou a|levaram a|resultou|resulta d|resultado d|fez com que|em consequência|consequentemente|motivad[oa]s? por|provocou|causou|deve-se a|deveu-se a');
const atrEnAntes = /“[^”]{12,}”|«[^»]{12,}»|\b(according to|said|says|stated|argued|argues|claimed|wrote|writes|promised|announced|acknowledged|declared|criticised|criticized|accused)\b/iu;
const cauEnAntes = /\b(because|due to|owing to|as a result|resulted in|results from|led to|leads to|caused|causes|explains|explained|thanks to|driven by|consequently)\b/iu;
const atrEnMais = palavra('say|states|claims?|argue|defends?|defended|considers?|considered|declares?|guaranteed|assured|recognised|recognized|told|reported|promises|announces?|written|in accordance with');
const cauEnMais = palavra('explain|resulting|resulted from|results? of|result of|result in|results in|lead to|leading to|caused by|causing|motivated by|as a consequence|therefore|attributable to');
export const marcaLeitura = (t, lingua) => (lingua === 'pt' ? /\((?:cálculo\s*:[^)]+|inferência)\)/iu : /\((?:calculation\s*:[^)]+|inference)\)/iu).test(t);
export function tiposDaFrase(t, lingua, antes = false) {
  const tipos = [];
  if ((lingua === 'pt' ? atrPt.test(t) : atrEnAntes.test(t) || (!antes && (atrEnMais.test(t) || /\bper\s+[A-ZÀ-Þ]/u.test(t) || /"[^"]{12,}"/u.test(t) || atrPt.test(t))))) tipos.push('atribuicao');
  if ((lingua === 'pt' ? cauPt.test(t) : cauEnAntes.test(t) || (!antes && (cauEnMais.test(t) || cauPt.test(t))))) tipos.push('causa');
  if (marcaLeitura(t, lingua)) tipos.push('leitura');
  return tipos;
}
export const cortar = t => frasesDoTexto(t, () => true);
export const chave = f => `${f.estudo}|${f.lingua}|${f.sha256 ?? sha256(normal(f.frase))}`;
export function blocosDaPagina(html) {
  const r = parse(html); r.querySelectorAll('script,style').forEach(n => n.remove());
  const c = r.querySelector('[data-oedp-moldura]') ?? r.querySelector('main') ?? r;
  // Os mesmos blocos e ordem da paridade; os selos conservam-se apenas para ler as linhas.
  return c.querySelectorAll(tags).filter(n => !n.closest('.src-chip') && !n.querySelectorAll(tags).some(f => !f.closest('.src-chip'))).map(n => {
    const texto = textoParaProcura(n).texto;
    const paragrafo = n.closest('p') ?? n;
    const linhas = [...new Set([paragrafo, ...paragrafo.querySelectorAll('[data-claim],a[href]')].flatMap(a => {
      const id = a.getAttribute('data-claim');
      const hit = matchPath((a.getAttribute('href') ?? '').split('#')[0]);
      return [id, hit?.key === 'linha' ? hit.params.slug : null].filter(Boolean);
    }))].sort();
    return {texto, frases:cortar(texto), linhas, tag:n.tagName};
  }).filter(b => b.texto);
}
export function rotasDaProsa() {
  const rotas = new Map();
  const juntar = (key, params = {}) => {
    for (const lingua of ['pt','en']) {
      const rota = routePath(key, lingua, params).replace(/\/$/, '') || '/';
      const estudo = ['estudo','documento','texto'].includes(key) ? params.slug : routePath(key, 'pt', params).replace(/\/$/, '') || '/';
      rotas.set(rota, {rota, estudo, lingua, tipo:key, par:routePath(key, lingua === 'pt' ? 'en' : 'pt', params).replace(/\/$/, '') || '/'});
    }
  };
  // As coleções que constroem as páginas, sem percorrer prefixos do dist.
  for (const key of ['home','indice','estudos','discussao','dossies','temas','explicacoes','leituraDaSemana','correcoes','sobre','metodo','privacidade','agenda']) juntar(key);
  for (const w of WORKS) juntar('estudo', {slug:w.slug});
  for (const d of DOSSIES) juntar('dossie', {slug:d.slug});
  for (const e of EXPLICACOES) juntar('explicacao', {slug:e.slug});
  for (const e of ENTRADAS) juntar(matchPath(e.rota.pt).key);
  for (const e of PUBLISHED_EDITIONS) {
    const rota = routePath('documento', e.lang, {slug:e.slug});
    rotas.set(rota, {rota, estudo:e.slug, lingua:e.lang, tipo:'documento', par:routePath('documento', e.lang === 'pt' ? 'en' : 'pt', {slug:e.slug})});
  }
  return [...rotas.values()].sort((a,b) => a.rota.localeCompare(b.rota));
}
export function lerPaginas(dist) {
  return rotasDaProsa().map(p => {
    const f = path.join(dist, p.rota, 'index.html');
    if (!fs.existsSync(f)) throw new Error(`frases: página da coleção ausente: ${p.rota}`);
    return {...p, blocos:blocosDaPagina(fs.readFileSync(f, 'utf8'))};
  });
}
export const rotasFora = () => Object.keys(ROUTES).filter(k => !rotasDaProsa().some(p => p.tipo === k));
export function inventario(paginas, antes = false) {
  const unicas = new Map();
  for (const p of paginas) for (const [bloco, b] of p.blocos.entries()) for (const [indice, frase] of b.frases.entries()) {
    const tipos = tiposDaFrase(frase, p.lingua, antes); if (!tipos.length) continue;
    const f = {estudo:p.estudo, lingua:p.lingua, frase, tipos, sha256:sha256(normal(frase))};
    const k = chave(f); if (!unicas.has(k)) unicas.set(k, {...f, ocorrencias:[]});
    unicas.get(k).ocorrencias.push({pagina:p.rota, bloco, indice, linhas:b.linhas});
  }
  return [...unicas.values()].sort((a,b) => chave(a).localeCompare(chave(b)));
}
const cachePares = new WeakMap();
export function alinhamento(p, par) {
  const direto = p.blocos.length === par.blocos.length;
  if (direto) return new Map(p.blocos.map((_, i) => [i,i]));
  // A mesma régua de vizinhança (até três blocos) da camada 0, por
  // assinatura estrutural; uma referência partilhada é uma âncora adicional.
  const assinatura = b => b.linhas.length ? 'linhas:' + b.linhas.join('|') : b.tag + ':' + b.frases.length;
  const pares = new Map();
  for (const sig of new Set(p.blocos.map(assinatura))) {
    const ip = p.blocos.flatMap((b,i) => assinatura(b) === sig ? [i] : []);
    const ie = par.blocos.flatMap((b,i) => assinatura(b) === sig ? [i] : []);
    for (const [a,b] of emparelharBlocos(ip, ie, false)) pares.set(a,b);
  }
  // Não aceitar cruzamentos produzidos por assinaturas distintas.
  const ordenados = [...pares].sort((a,b) => a[0]-b[0]);
  return new Map(ordenados.filter(([a,b], i) => !ordenados.some(([c,d], j) => j !== i && (a-c)*(b-d) <= 0)));
}
export function parDaFrase(paginas, ocorrencia) {
  const p = paginas.find(p => p.rota === ocorrencia.pagina), par = paginas.find(e => e.rota === p?.par);
  if (!p || !par) return null;
  let cache = cachePares.get(paginas); if (!cache) {cache = new Map(); cachePares.set(paginas, cache);}
  if (!cache.has(p.rota)) cache.set(p.rota, alinhamento(p, par));
  const indice = cache.get(p.rota).get(ocorrencia.bloco); if (indice === undefined) return null;
  const a = p.blocos[ocorrencia.bloco], b = par.blocos[indice];
  if (a.frases.length !== b.frases.length) return null;
  return {frase:b.frases[ocorrencia.indice], linhas:b.linhas, pagina:par.rota, bloco:indice, metodo:p.blocos.length === par.blocos.length ? 'blocos' : 'vizinhança'};
}
export function medirPares(paginas) {
  const pt = inventario(paginas).filter(f => f.lingua === 'pt');
  const r = {pares:0, sem_par:0, falhas_antes:0, falhas_depois:0, falhas:[]};
  for (const f of pt) {
    const par = f.ocorrencias.map(o => parDaFrase(paginas, o)).find(Boolean);
    if (!par) {r.sem_par++; continue;}
    r.pares++;
    if (!tiposDaFrase(par.frase, 'en', true).length) r.falhas_antes++;
    if (!tiposDaFrase(par.frase, 'en').length) {r.falhas_depois++; r.falhas.push({estudo:f.estudo, pt:f.frase, en:par.frase});}
  }
  return r;
}
