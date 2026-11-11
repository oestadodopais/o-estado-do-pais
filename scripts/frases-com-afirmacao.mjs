/** CAM2-A: deteção sem modelo, sobre o texto impresso sem selos. */
import fs from 'node:fs';
import {tiposDaFrase} from './frases-marcas.mjs';
import {modeloDaFrase} from './frases-modelos.mjs';
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
import {MUNICIPIOS_COM_PAGINA} from '../src/data/municipios.mjs';
import {slugsDasUnidades} from '../src/lib/mapa.mjs';
import {slugsDasRegioes} from '../src/lib/regioes.mjs';
import {slugsDasAreas} from '../src/lib/areas.mjs';
import {edicoesGuardadas} from '../src/lib/edicoes.mjs';
import {ENTRADAS} from '../src/data/primeira-pagina.mjs';
export const normal = t => t.normalize('NFKC').replace(/\u200b/g, '').replace(/\s+/g, ' ').trim();
// Só a identidade editorial omite números; deteção, citações e excertos conservam-nos.
export const normalDaChave = t => normal(t).replace(/\p{Nd}+(?:(?:[.,:/]\p{Nd}+)|(?: \p{Nd}{3}(?!\p{Nd})))*%?/gu, '⟦número⟧');
export const sha256 = t => createHash('sha256').update(t).digest('hex');
export {MARCAS, marcasDaFrase, marcaLeitura, tiposDaFrase} from './frases-marcas.mjs';
// O corte adicional pertence só ao detetor; a régua da voz conserva o corte original.
export const cortar = t => frasesDoTexto(t, () => true).flatMap(f => f.split(/(?<=[.!?]»)\s+(?=\p{Lu})/u));
// Um fragmento separado de uma frase marcada continua a exigir auditoria.
export function tiposComContexto(frase, contexto, lingua, antes=false) {
  const diretos=tiposDaFrase(frase,lingua,antes);
  return diretos.length || !contexto || contexto===frase ? diretos : tiposDaFrase(contexto,lingua,antes).filter(t=>t!=='leitura');
}
export const chave = f => `${f.estudo}|${f.lingua}|${f.sha256 ?? sha256(normalDaChave(f.frase))}`;
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
    const partes=frasesDoTexto(texto,()=>true).flatMap(contexto=>cortar(contexto).map(frase=>({frase,contexto})));
    return {rotuloIA: n.matches('p.rotulo-ia-linha') && n.querySelectorAll('a').length === 1 ? n.querySelector('a').getAttribute('href') : null, texto, frases:partes.map(p=>p.frase), contextos:partes.map(p=>p.contexto), linhas, tag:n.tagName};
  }).filter(b => b.texto);
}
export function rotasDaProsa() {
  const rotas = new Map();
  const juntar = (key, params = {}) => {
    for (const lingua of ['pt','en']) {
      const rota = routePath(key, lingua, params).replace(/\/$/, '') || '/';
      const estudo = ['municipio','distrito','regiao','area','uniaoEuropeia'].includes(key) ? 'colecao-' + key : ['estudo','documento','texto'].includes(key) ? params.slug : routePath(key, 'pt', params).replace(/\/$/, '') || '/';
      rotas.set(rota, {rota, estudo, lingua, tipo:key, par:routePath(key, lingua === 'pt' ? 'en' : 'pt', params).replace(/\/$/, '') || '/'});
    }
  };
  // As coleções que constroem as páginas, sem percorrer prefixos do dist.
  for (const key of ['home','indice','estudos','discussao','dossies','temas','explicacoes','leituraDaSemana','correcoes','sobre','metodo','privacidade','agenda','lugares','regioes','areas','uniaoEuropeia','sugestoes','sugestoesObrigado','sugestoesVazia','sugestoesLimite','sugestoesNaoChegou']) juntar(key);
  for (const m of MUNICIPIOS_COM_PAGINA) juntar('municipio', {slug:m.slug});
  for (const [key, slugs] of [['distrito',slugsDasUnidades()],['regiao',slugsDasRegioes()],['area',slugsDasAreas()]]) for (const slug of slugs) juntar(key, {slug});
  for (const w of WORKS.filter(w => w.estado !== 'retirado')) juntar('estudo', {slug:w.slug});
  for (const d of DOSSIES) juntar('dossie', {slug:d.slug});
  for (const e of EXPLICACOES) juntar('explicacao', {slug:e.slug});
  for (const e of ENTRADAS) juntar(matchPath(e.rota.pt).key);
  for (const e of PUBLISHED_EDITIONS) {
    const rota = routePath('documento', e.lang, {slug:e.slug});
    rotas.set(rota, {rota, estudo:e.slug, lingua:e.lang, tipo:'documento', par:routePath('documento', e.lang === 'pt' ? 'en' : 'pt', {slug:e.slug})});
  }
  for (const e of edicoesGuardadas().filter(e => !WORKS.some(w => w.slug === e.slug && w.estado === 'retirado'))) {
    const rota = routePath('documento',e.lang,{slug:e.slug}) + '/' + e.date;
    rotas.set(rota, {rota,estudo:e.slug,lingua:e.lang,tipo:'arquivo',par:routePath('documento',e.lang==='pt'?'en':'pt',{slug:e.slug})+'/'+e.date});
  }
  for (const lingua of ['pt','en']) {
    const rota=lingua==='pt'?'/404.html':'/en/404';
    rotas.set(rota,{rota,estudo:'/404',lingua,tipo:'404',par:lingua==='pt'?'/en/404':'/404.html'});
  }
  return [...rotas.values()].sort((a,b) => a.rota.localeCompare(b.rota));
}
export function conferirAmbito(ficheiros, rotas) {
  const esperadas = new Set(rotas.map(p => p.rota.endsWith('.html') ? p.rota.slice(1) : path.join(p.rota.slice(1),'index.html')));
  return ficheiros.filter(f => f.endsWith('.html') && !esperadas.has(f)).filter(f => !['livro','livroConcelhos','livroConcelho','linha','serie'].includes(matchPath('/' + f.replace(/\/index.html$/,'').replace(/^index.html$/,''))?.key));
}
export function lerPaginas(dist) {
  const rotas=rotasDaProsa(), fora=conferirAmbito(fs.readdirSync(dist,{recursive:true}),rotas);
  if(fora.length)throw new Error('frases: HTML fora das coleções: '+fora.join(', '));
  return rotas.map(p => {
    const f = p.rota.endsWith('.html') ? path.join(dist,p.rota) : path.join(dist, p.rota, 'index.html');
    if (!fs.existsSync(f)) throw new Error(`frases: página da coleção ausente: ${p.rota}`);
    return {...p, blocos:blocosDaPagina(fs.readFileSync(f, 'utf8'))};
  });
}
export const rotasFora = () => Object.keys(ROUTES).filter(k => !rotasDaProsa().some(p => p.tipo === k));
function unidades(paginas, antes=false) {
  const unicas=new Map();
  for(const p of paginas) for(const [bloco,b] of p.blocos.entries()) for(const [indice,frase] of b.frases.entries()) {
    if (modeloDaFrase(frase,p.lingua,p.tipo)) continue;
    const tipos=tiposComContexto(frase,b.contextos?.[indice],p.lingua,antes);
    const f={estudo:p.estudo,lingua:p.lingua,frase,tipos,sha256:sha256(normalDaChave(frase))}, k=chave(f);
    if(!unicas.has(k))unicas.set(k,{...f,ocorrencias:[]});
    const u=unicas.get(k);u.tipos=[...new Set([...u.tipos,...tipos])];
    u.ocorrencias.push({pagina:p.rota,bloco,indice,linhas:b.linhas});
  }
  return unicas;
}
export function inventarioDireto(paginas, antes=false) {
  return [...unidades(paginas,antes).values()].filter(f=>f.tipos.length).sort((a,b)=>chave(a).localeCompare(chave(b)));
}
export function inventario(paginas, antes=false) {
  const todas=unidades(paginas,antes), diretas=[...todas.values()].filter(f=>f.tipos.length).map(f=>({...f,tipos:[...f.tipos]}));
  const chavesDiretas=new Set(diretas.map(chave)), porRota=new Map(paginas.map(p=>[p.rota,p]));
  // Ambas as direções partem do detetor, nunca de uma tradução inferida.
  for(const f of diretas) for(const o of f.ocorrencias) {
    const par=parDaFrase(paginas,o);if(!par)continue;
    const p=porRota.get(par.pagina), k=chave({estudo:p.estudo,lingua:p.lingua,frase:par.frase}), alvo=todas.get(k);
    if (!alvo) continue;
    alvo.tipos=['atribuicao','causa','leitura'].filter(t=>alvo.tipos.includes(t)||f.tipos.includes(t));
    alvo.pelo_par=!chavesDiretas.has(k);
  }
  return [...todas.values()].filter(f=>f.tipos.length).sort((a,b)=>chave(a).localeCompare(chave(b)));
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
  return {frase:b.frases[ocorrencia.indice], contexto:b.contextos?.[ocorrencia.indice], linhas:b.linhas, pagina:par.rota, bloco:indice, metodo:p.blocos.length === par.blocos.length ? 'blocos' : 'vizinhança'};
}
export function medirPares(paginas, detetorAntes = null) {
  const cobertura=new Set(inventario(paginas).map(chave));
  const r = {};
  for (const lingua of ['pt','en']) {
    const destino = lingua === 'pt' ? 'en' : 'pt';
    const m = r[lingua + '_para_' + destino] = {pares:0,sem_par:0,falhas_antes:detetorAntes?0:null,falhas_depois:0,sem_cobertura:0,falhas:[]};
    for (const f of inventarioDireto(paginas).filter(f => f.lingua === lingua)) {
      const par = f.ocorrencias.map(o => parDaFrase(paginas,o)).find(Boolean);
      if (!par) {m.sem_par++;continue;}
      m.pares++;
      if(detetorAntes) {
        const antes=detetorAntes(par.frase,destino);
        const contextoAntes=antes.length?antes:detetorAntes(par.contexto??par.frase,destino).filter(t=>t!=='leitura');
        if (!contextoAntes.length) m.falhas_antes++;
      }
      const pagina=paginas.find(p=>p.rota===par.pagina);
      if(!modeloDaFrase(par.frase,destino,pagina.tipo)&&!cobertura.has(chave({estudo:pagina.estudo,lingua:destino,frase:par.frase})))m.sem_cobertura++;
      if (!tiposComContexto(par.frase,par.contexto,destino).length) {m.falhas_depois++;m.falhas.push({estudo:f.estudo,[lingua]:f.frase,[destino]:par.frase});}
    }
  }
  return r;
}
