/** VOZ-1, 03.11.2026. A narração da própria peça não é um facto da fonte.
 * Isenção VOZ-2: documentos dos estudos, até à passagem VOZ-2, que a retira.
 * A lista de ledes é fechada por rota e texto, nunca por classe de CSS.
 */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'node-html-parser';
import {loadClaims,provenienciaIncompleta} from '../src/lib/ledger.mjs';
import {matchPath} from '../src/lib/routes.mjs';
export const ISENCAO_VOZ2 = {nome:'documentos dos estudos', data:'2026-11-03', retirar:'VOZ-2', rotas:['documento','texto'], transcricoes:['estudo: unidades e índice','dossie: unidades com data-registo-unidade, conferidas pelo portão de HTML']};
const claims=loadClaims();
const normal = s => s.replace(/\s+/g,' ').trim();
export const CLASSE = /\b(?:(?:est[ae]|[oa])\s+(?:sítio|página|peça|explicação|estudo|projeto|trabalho)|(?:this|the)\s+(?:site|page|piece|explainer|explanation|study|project|work))\s+(?:(?:ainda|também|só|apenas|still|also|only)\s+)?(?:não\b|nunca\b|é(?![A-Za-zÀ-ÿ])|foi\b|mostra\b|lê(?![A-Za-zÀ-ÿ])|diz\b|conta\b|apresenta\b|publica\b|reúne\b|compara\b|explica\b|is\b|was\b|does\b|doesn’t\b|doesn't\b|shows?\b|reads?\b|says?\b|presents?\b|compares?\b|explains?\b)|(?<![\p{L}])é\s+deste\s+projeto\b|\bis this project[’']s\b|\b(?:aqui\s+(?:(?:ainda|também|só)\s+)?(?:não|ainda|mostra|tem|têm|lê|diz|publica)|(?:não|nunca)[^.!?;]{0,65}\baqui|(?:not|never)[^.!?;]{0,65}\bhere)\b/iu;
export function conferirProtecoes(root,rota,livro=claims) {
 const erros=[]; const hit=matchPath(rota);const lang=rota.startsWith('/en/')?'en':'pt';
 const ausencia=lang==='en'?'to be confirmed at the source':'por confirmar na fonte';
 if(root.querySelector('.marcador-definicao') || /um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado|a field not confirmed against the source, not a doubt about what is published/.test(root.textContent))erros.push('VOZ-1: definição do marcador reposta');
 for(const n of root.querySelectorAll('.marcador'))if(normal(n.textContent)!==ausencia)erros.push('VOZ-1: ausência fora da forma da edição');
 for(const n of root.querySelectorAll('[data-voz1-ausencia]'))if(n.textContent!==ausencia)erros.push('VOZ-1: apresentação da ausência histórica alterada');
 for(const selo of root.querySelectorAll('a.src-chip')){
  const destino=matchPath((selo.getAttribute('href')??'').split('#')[0]);
  if(destino?.key!=='linha')continue;
  const linha=livro.get(destino.params.slug);if(!linha)continue;
  if(provenienciaIncompleta(linha)!==selo.classList.contains('is-unverified'))erros.push('VOZ-1: selo sem o tracejado exigido pela proveniência');
 }
 if(hit?.key==='linha' && provenienciaIncompleta(livro.get(hit.params.slug))) {
  if(!/noindex/i.test(root.querySelector('meta[name="robots"]')?.getAttribute('content')??''))erros.push('VOZ-1: recibo incompleto indexável');
 }
 return erros;
}
export const frasesDoTexto = texto => normal(texto).split(/(?<=[.!?])\s+(?=[A-ZÀ-Þ])/u).filter(f=>CLASSE.test(f));
export function medirPagina(html, rota, ledes = {}) {
 const root=parse(html); root.querySelectorAll('script,style').forEach(n=>n.remove());
 const corpo=root.querySelector('body') ?? root;
 const protecao=conferirProtecoes(root,rota,claims);
 const marca=/\[\s*(?:a\s+verificar|to\s+verify)\s*\]/iu.test(corpo.textContent + ' ' + root.querySelectorAll('[data-marca], [aria-label], [title]').map(n=>[n.getAttribute('data-marca'),n.getAttribute('aria-label'),n.getAttribute('title')].join(' ')).join(' '));
 const hit=matchPath(rota);
 if(['metodo','sobre','linha','livro','serie','privacidade',...ISENCAO_VOZ2.rotas].includes(hit?.key)) return {marca,protecao,frases:[],ledes:[],isenta:true};
 const h1=corpo.querySelector('h1');
 const imediato = h1?.nextElementSibling?.tagName === 'P' ? h1.nextElementSibling : h1?.parentNode?.nextElementSibling?.tagName === 'P' ? h1.parentNode.nextElementSibling : null;
 const lede=imediato ? normal(imediato.textContent) : null;
 // Só transcrições explicitamente atribuídas: dados da agenda e frases das explicações entram.
 corpo.querySelectorAll('[data-verbatim]').forEach(n=>n.remove());
 if(hit?.key==='dossie') corpo.querySelectorAll('[data-registo-unidade], [data-registo-indice]').forEach(n=>n.remove());
 if(hit?.key==='estudo') corpo.querySelectorAll('[data-registo-unidade], .texto-artigo.estudo-leitura, .estudo-indice, .texto-sumario, .estudo-sumario, [data-registo-indice]').forEach(n=>n.remove());
 const candidatas=corpo.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,summary,div,section,article');
 const frases=[];
 for(const n of candidatas){
  if(n.querySelector('p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,summary,div,section,article'))continue;
  const texto=normal(n.textContent);
  if(CLASSE.test(texto) && !(n===imediato && ledes[rota]===texto)) frases.push(...frasesDoTexto(texto));
 }
 // As ledes editoriais são fechadas por rota e texto. Os campos calculados continuam conferidos pelas suas réguas.
 const ledesEncontradas=lede && !['data-explicacao-paragrafo','data-semana-frase','data-leitura-do-lugar','data-serie-o-que-conta','data-dossie-campo','data-dossie-ligacao','data-sugestoes-resultado','data-sugestoes-paragrafo','data-sucessor-edicao','data-verbatim'].some(k=>imediato.hasAttribute(k)) && !/^(?:lugar-leitura|serie-|livro-contas|estudo-descricao)/.test(imediato.classNames) ? [lede] : [];
 const ledesNovas=ledesEncontradas.filter(t=>ledes[rota]!==t);
 return {marca,protecao,frases:[...new Set(frases)],ledes:ledesEncontradas,ledesNovas};
}
export function conferirMapa(xml,livro=claims) {
 const erros=[];
 for(const loc of parse(xml).querySelectorAll('loc')){
  let rota;try{rota=new URL(loc.textContent).pathname;}catch{continue;}
  const hit=matchPath(rota);
  if(hit?.key==='linha' && provenienciaIncompleta(livro.get(hit.params.slug)))erros.push({rota:rota.replace(/\/$/,''),erro:'VOZ-1: recibo incompleto no sitemap'});
 }
 return erros;
}
export function medirDist(dist='dist', ledes={}) {
 const paginas={};
 function andar(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())andar(f);else if(e.name.endsWith('.html')){const rota='/'+path.relative(dist,f).replace(/index\.html$/,'').replace(/\/$/,'');paginas[rota]=medirPagina(fs.readFileSync(f,'utf8'),rota,ledes);}}}
 andar(dist);
 const mapas=fs.readdirSync(dist).filter(f=>/^sitemap.*\.xml$/.test(f));
 if(!mapas.length)paginas['/'].protecao.push('VOZ-1: sitemap ausente');
 for(const f of mapas)for(const e of conferirMapa(fs.readFileSync(path.join(dist,f),'utf8'))) (paginas[e.rota]??paginas['/']).protecao.push(e.erro);
 return paginas;
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const lista=JSON.parse(fs.readFileSync('scripts/voz-ledes.json','utf8'));
 const paginas=medirDist(process.env.OEDP_DIST ?? 'dist',lista);
 const relatorio={isencao:ISENCAO_VOZ2,paginas,totais:{paginas:Object.keys(paginas).length,marcador:Object.values(paginas).filter(p=>p.marca).length,protecao:Object.values(paginas).reduce((s,p)=>s+p.protecao.length,0),frases:Object.values(paginas).reduce((s,p)=>s+p.frases.length,0),ledesNovas:Object.values(paginas).reduce((s,p)=>s+(p.ledesNovas?.length??0),0)}};
 const destino=process.argv.indexOf('--medir');if(destino>=0)fs.writeFileSync(process.argv[destino+1],JSON.stringify(relatorio,null,2)+'\n');
 console.log(JSON.stringify(relatorio.totais));
 if(destino<0){for(const [r,p] of Object.entries(paginas)) for(const f of [...p.frases,...(p.ledesNovas??[]),...p.protecao])console.error(`${r}: ${f}`);if(relatorio.totais.protecao||relatorio.totais.frases||relatorio.totais.ledesNovas||relatorio.totais.marcador)process.exitCode=1;}
}
