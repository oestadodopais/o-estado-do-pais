/** VOZ-1, 03.11.2026. A narração da própria peça não é um facto da fonte.
 * Isenção VOZ-2: onze estudos aguardam a VOZ-2B; edições datadas são arquivo.
 * A lista de ledes é fechada por rota e texto, nunca por classe de CSS.
 */
import {conferirTextoHtml} from './edicoes-conferir.mjs';
import {manifestoEd2} from './edicoes-linha-conferir.mjs';
import {WORKS} from '../src/data/studies.mjs';
import {CORRECOES_TEXTO} from '../src/data/correcoes.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'node-html-parser';
import {loadClaims,provenienciaIncompleta} from '../src/lib/ledger.mjs';
import {matchPath} from '../src/lib/routes.mjs';
export const ISENCAO_VOZ2 = {nome:'documentos dos estudos, leitura e sumário da página de cada estudo', data:'2026-11-03', retirar:'VOZ-2B', estudos:["a-casa-em-portugal-e-na-europa", "agua-nao-faturada", "alentejo-algarve", "avaliacao-economica-regional-de-portugal-2026", "evolucao-de-portugal-desde-1981", "evora-quem-governou-a-camara-2009-2025", "onde-esta-a-agua", "orcamento-2027-o-que-muda-e-para-quem", "which-door-is-yours"], rotas:['documento','texto'], transcricoes:['estudo: unidades e índice, .texto-artigo.estudo-leitura, .texto-sumario e .estudo-sumario','dossie: unidades e índices com data-registo-unidade e data-registo-indice, conferidos pelo portão de HTML']};
export const ISENCAO_RECIBOS = {nome:'recibos do livro-razão e séries',rotas:['linha','livro','livroConcelho','livroConcelhos','serie']};
const isentaVoz2 = hit => (hit?.key==='documento' && Boolean(hit?.params.date)) || ISENCAO_VOZ2.estudos.includes(hit?.params.slug);
const claims=loadClaims();
const normal = s => s.replace(/\s+/g,' ').trim();
const CLASSE_ANTERIOR = /\b(?:(?:est[ae]|[oa])\s+(?:sítio|página|peça|explicação|estudo|projeto|trabalho)|(?:this|the)\s+(?:site|page|piece|explainer|explanation|study|project|work))\s+(?:(?:ainda|também|só|apenas|still|also|only)\s+)?(?:não\b|nunca\b|é(?![A-Za-zÀ-ÿ])|foi\b|mostra\b|lê(?![A-Za-zÀ-ÿ])|diz\b|conta\b|apresenta\b|publica\b|reúne\b|compara\b|explica\b|is\b|was\b|does\b|doesn’t\b|doesn't\b|shows?\b|reads?\b|says?\b|presents?\b|compares?\b|explains?\b)|(?<![\p{L}])é\s+deste\s+projeto\b|\bis this project[’']s\b|\b(?:aqui\s+(?:(?:ainda|também|só)\s+)?(?:não|ainda|mostra|tem|têm|lê|diz|publica)|(?:não|nunca)[^.!?;]{0,65}\baqui|(?:not|never)[^.!?;]{0,65}\bhere)\b/iu;
// VOZ-1 B: a negação e a marca podem estar em qualquer ordem na mesma frase.
const NEGACAO = /(?<![\p{L}])(?:não|nem|nenhum[ao]?|nunca|nada|not|no|neither|none|never|nothing|doesn[’']t|isn[’']t|cannot|can[’']t|don[’']t|didn[’']t|won[’']t)(?![\p{L}])/iu;
const PROPRIA = /(?<![\p{L}])(?:[dn]?este projeto|[dn]?esta página|[dn]?esta explicação|[dn]?este estudo|[dn]?este documento|[dn]?esta leitura|aqui|não entram?|não se lê|inferências?|juízos?|this project|this site|this page|this explainer|this explanation|this study|this document|this reading|here|does not enter|do not enter|did not enter|is not read|inference|judgement|judgment|deste sítio|from this site)(?![\p{L}])/iu;
export const CLASSE = {test: frase => (NEGACAO.test(frase) && PROPRIA.test(frase)) || CLASSE_ANTERIOR.test(frase)};
export const EXCECOES = JSON.parse(fs.readFileSync(new URL('./voz-excecoes.json',import.meta.url),'utf8'));
const RAZOES = new Set(['facto de uma fonte','informação funcional','natureza do registo','limite declarado do estudo']);
if(EXCECOES.some(e=>!e.rota||!e.frase||!e.razao||!RAZOES.has(e.classe)) || new Set(EXCECOES.map(e=>e.rota+'|'+e.frase)).size!==EXCECOES.length) throw new Error('VOZ-1: lista de exceções inválida');
export function conferirProtecoes(root,rota,livro=claims) {
 const erros=[]; const hit=matchPath(rota);const lang=rota.startsWith('/en/')?'en':'pt';
 if(!(ISENCAO_VOZ2.rotas.includes(hit?.key) && isentaVoz2(hit)) && /\bResearch\s*Hub\b/i.test(root.textContent)) erros.push('VOZ-2: nome do motor no texto do leitor');
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
export const frasesDoTexto = (texto, filtro = f => CLASSE.test(f)) => normal(texto).split(/(?<=[.!?])\s+(?=[A-ZÀ-Þ])/u).filter(filtro);
export function medirPagina(html, rota, ledes = {}) {
 const root=parse(html); root.querySelectorAll('script,style').forEach(n=>n.remove());
 const corpo=root.querySelector('body') ?? root;
 const protecao=conferirProtecoes(root,rota,claims);
 const marca=/\[\s*(?:a\s+verificar|verificar|to\s+verify|verify)\s*\]/iu.test(corpo.textContent + ' ' + root.querySelectorAll('[data-marca], [aria-label], [title]').map(n=>[n.getAttribute('data-marca'),n.getAttribute('aria-label'),n.getAttribute('title')].join(' ')).join(' '));
 const hit=matchPath(rota);
 if(['metodo','sobre','privacidade',...ISENCAO_RECIBOS.rotas].includes(hit?.key) || (ISENCAO_VOZ2.rotas.includes(hit?.key) && isentaVoz2(hit))) return {marca,protecao,frases:[],ledes:[],isenta:true};
 const h1=corpo.querySelector('h1');
 const imediato = h1?.nextElementSibling?.tagName === 'P' ? h1.nextElementSibling : h1?.parentNode?.nextElementSibling?.tagName === 'P' ? h1.parentNode.nextElementSibling : null;
 const lede=imediato && !imediato.closest('header') ? normal(imediato.textContent) : null;
 // Só transcrições explicitamente atribuídas: dados da agenda e frases das explicações entram.
 if(hit?.key==='dossie') corpo.querySelectorAll('[data-registo-unidade], [data-registo-indice]').forEach(n=>n.remove());
 // As unidades transcritas e os índices continuam conferidos pela composição e pelo portão de HTML.
 if(hit?.key==='estudo') corpo.querySelectorAll('[data-registo-unidade], .estudo-indice, [data-registo-indice]').filter(n=>!n.closest('.texto-artigo.estudo-leitura, .texto-sumario, .estudo-sumario')).forEach(n=>n.remove());
 if(hit?.key==='estudo' && isentaVoz2(hit)) corpo.querySelectorAll('.texto-artigo.estudo-leitura, .texto-sumario, .estudo-sumario').forEach(n=>n.remove());
 const candidatas=corpo.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,td,th,summary,div,section,article');
 const frases=[],nosDasFrases=new Map();
 for(const n of candidatas){
  if(n.querySelector('p,li,h1,h2,h3,h4,h5,h6,figcaption,dd,dt,td,th,summary,div,section,article'))continue;
  const texto=normal(n.textContent);
  if(CLASSE.test(texto))for(const f of frasesDoTexto(texto)){frases.push(f);if(!nosDasFrases.has(f))nosDasFrases.set(f,[]);nosDasFrases.get(f).push(n);}
 }
 // As ledes editoriais são fechadas por rota e texto. Os campos calculados continuam conferidos pelas suas réguas.
 const ledesEncontradas=lede && !ISENCAO_VOZ2.rotas.includes(hit?.key) && !['data-explicacao-paragrafo','data-semana-frase','data-leitura-do-lugar','data-serie-o-que-conta','data-dossie-campo','data-dossie-ligacao','data-sugestoes-resultado','data-sugestoes-paragrafo','data-sucessor-edicao','data-verbatim'].some(k=>imediato.hasAttribute(k)) && !/^(?:lugar-leitura|serie-|livro-contas|estudo-descricao)/.test(imediato.classNames) ? [lede] : [];
 const ledesNovas=ledesEncontradas.filter(t=>ledes[rota]!==t);
 const captadas=[...new Set(frases)];
 const correcaoIntegra=(e,frase)=>{
  if(!e.correcao_textual)return true;
  if(hit?.key!=='correcoes')return false;
  const c=e.correcao_textual,el=corpo.querySelector(`[data-texto-estudo="${c.slug}"][data-texto-data="${c.data}"]`);
  return Boolean(el && nosDasFrases.get(frase)?.every(n=>n===el||n.closest('[data-texto-estudo]')===el) && !conferirTextoHtml(parse(el.outerHTML),hit.lang,WORKS,CORRECOES_TEXTO,manifestoEd2,claims).erros.length);
 };
 const permitidas=captadas.filter(f=>EXCECOES.some(e=>e.rota===rota && e.frase===f && correcaoIntegra(e,f)));
 return {marca,protecao,captadas,permitidas,frases:captadas.filter(f=>!permitidas.includes(f)),ledes:ledesEncontradas,ledesNovas};
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
 const relatorio={isencao:ISENCAO_VOZ2,recibos:ISENCAO_RECIBOS,paginas,totais:{paginas:Object.keys(paginas).length,marcador:Object.values(paginas).filter(p=>p.marca).length,protecao:Object.values(paginas).reduce((s,p)=>s+p.protecao.length,0),captadas:Object.values(paginas).reduce((s,p)=>s+(p.captadas?.length??0),0),permitidas:Object.values(paginas).reduce((s,p)=>s+(p.permitidas?.length??0),0),frases:Object.values(paginas).reduce((s,p)=>s+p.frases.length,0),ledesNovas:Object.values(paginas).reduce((s,p)=>s+(p.ledesNovas?.length??0),0)}};
 const destino=process.argv.indexOf('--medir');if(destino>=0)fs.writeFileSync(process.argv[destino+1],JSON.stringify(relatorio,null,2)+'\n');
 console.log(JSON.stringify(relatorio.totais));
 if(destino<0){for(const [r,p] of Object.entries(paginas)) for(const f of [...p.frases,...(p.ledesNovas??[]),...p.protecao])console.error(`${r}: ${f}`);if(relatorio.totais.protecao||relatorio.totais.frases||relatorio.totais.ledesNovas||relatorio.totais.marcador)process.exitCode=1;}
}
