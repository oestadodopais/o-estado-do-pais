import {parse} from 'node-html-parser';
import {partesComMedida} from '../../src/lib/posicao-do-selo.mjs';
import {t} from '../../src/i18n/strings.mjs';
import {SITE_NAME} from '../../site.config.mjs';
import {eDerivada,provenienciaIncompleta,loadClaims} from '../../src/lib/ledger.mjs';
import {partesDaCorrecao} from '../../src/lib/texto-correcao.mjs';
const claims=loadClaims();
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function fraseHtml(c,lang){return partesComMedida(partesDaCorrecao(c,lang)).map(p=>typeof p==='string'?esc(p):p.claim?`<span data-claim="${p.claim}">${esc(String(claims.get(p.claim).value))}</span>${esc(p.sufixo??'')}${esc(p.cauda??'')}<a class="src-chip" href="${lang==='pt'?'/livro-razao/':'/en/ledger/'}${p.claim}">fonte</a>`:p.data?`<span data-nonledger="data-da-linha" data-de-linha="${p.data.id}" data-de-campo="${p.data.campo}">${p.data.valor}</span><a class="src-chip" href="${lang==='pt'?'/livro-razao/':'/en/ledger/'}${p.data.id}">fonte</a>`:`<span lang="pt-PT">${esc(p.termo)}</span>`).join('');}

// A página vazia não elimina as plantas das entradas históricas.
import fs from 'node:fs';
import {emEnsaio} from '../../site.config.mjs';
import {CORRECOES_TEXTO,KIND_LABELS} from '../../src/data/correcoes.mjs';
import {WORKS} from '../../src/data/studies.mjs';
import {portasDaCorrecao} from '../../src/lib/edicoes.mjs';
function fraseComSelos(c,lang) {
 const root=parse(fraseHtml(c,lang));
 for(const a of root.querySelectorAll('a.src-chip')) {
  const href=a.getAttribute('href'),c=claims.get(href.split('/').at(-1)),s=t(lang).prov;
  const conhecido=c.source && c.source!=='[a verificar]';
  const palavra=c.source===SITE_NAME?s.seloDaCasa:s.selo;
  a.set_content(esc(palavra+(conhecido?' · '+(eDerivada(c)?s.calculado+' · ':'')+c.source:c.source==='[a verificar]'?'':' · '+s.calculado)+(provenienciaIncompleta(c)?' · '+s.marcadorDoSelo:'')));

 }
 return root.toString();
}
export function registoParaPlantas(rota) {
 if(!emEnsaio()) return fs.readFileSync('dist'+rota+'/index.html','utf8');
 const lang=rota.startsWith('/en/')?'en':'pt';
 return '<html><body><main><ol>'+CORRECOES_TEXTO.map(c=>{
  const w=WORKS.find(w=>w.slug===c.slug),e=w.editions.find(e=>e.lang===lang)??w.editions[0],p=portasDaCorrecao(c.slug,lang,c.data);
  return `<li data-texto-estudo="${c.slug}" data-texto-data="${c.data}"><time datetime="${c.data}" data-texto-campo="data">${c.data.split('-').reverse().join('.')}</time><span data-texto-campo="kind">${KIND_LABELS[c.kind][lang]}</span><p><span data-texto-campo="titulo">${esc(e.title)}</span>: <span data-texto-campo="frase">${fraseComSelos(c,lang)}</span></p><a data-texto-porta="primeira" href="${p.antes.rota}">${p.rotuloAntes}</a><a data-texto-porta="atual" href="${p.depois.rota}">${p.rotuloDepois}</a></li>`;
 }).join('')+'</ol></main></body></html>';
}
