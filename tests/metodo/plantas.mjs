import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parse} from 'node-html-parser';
import {campoLocalizadorMet1, conferirLimitesSobre, APROVADO, unidades, conferirLugaresIA, recontarConferencias, campoDoReciboMet1} from '../../scripts/metodo-do-portao.mjs';
import {passosDaCorrida} from '../../src/lib/conferencias-da-corrida.mjs';
import {getClaim} from '../../src/lib/ledger.mjs';
import {routePath} from '../../src/lib/routes.mjs';
const esc = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
export const PLANTAS_DO_METODO = [];
const uNome=lang=>unidades(lang)['recibo-nome'];
const planta=(nome,cond)=>{assert(cond,nome);PLANTAS_DO_METODO.push({nome});};
function pagina(lang) {
 const u=unidades(lang), id=APROVADO.recibo.id;
 const texto=(k)=>`<p data-met1="${k}">${esc(u[k]).replace(/\{prova:([^}]+)\}/g,(_,chave)=>`<a data-prova="${chave}">${chave==='conferencias_da_corrida'?recontarConferencias():'valor'}</a>`)}</p>`;
 const linha=getClaim(id);
 const campo=k=>{if(k===campoLocalizadorMet1(lang))return `<div><dt data-met1="campo-2">${esc(u['campo-2'])}</dt><dd><span data-linha-claim="${id}" data-linha-campo="${k}">${esc(linha.document[k.split('.')[1]])}</span></dd></div>`;const href=k==='document.title'?linha.document.url:['source','document.edition'].includes(k)?linha.source_url:null;const span=['reference_date','access_date'].includes(k)?`<span data-nonledger="data-da-linha" data-de-linha="${id}" data-de-campo="${k}">2025</span>`:`<span data-linha-claim="${id}" data-linha-campo="${k}">campo</span>`;return href?`<a href="${href}">${span}</a>`:span;};
 return `<main><h1>${lang === 'pt' ? 'Método' : 'Method'}</h1><div class="met1">`+['conferir-um-numero','percurso','marcas','correcoes'].map((sec,i)=>`<section id="${sec}"><h2>${APROVADO.titulos[lang][i]}</h2></section>`).join('')+
 `<ol class="met1-percurso">${APROVADO.passos.map((_,i)=>`<li>${texto(`passo-${i}`)}</li>`).join('')}</ol>`+
 Object.keys(u).filter(k=>!k.startsWith('passo-')&&!k.startsWith('ligacao-')&&k!=='mudanca'&&k!=='campo-2').map(texto).join('')+
 `<p data-met1="mudanca"><a href="${routePath('correcoes',lang)}">${u.mudanca}</a></p><p class="met1-portas"><a data-met1="ligacao-0" href="${routePath('agenda',lang)}">${u['ligacao-0']}</a></p>`+
 `<div data-met1-recibo="${id}">${['reference_date','unit','source','document.title',campoLocalizadorMet1(lang),'excerpt','access_date'].map(campo).join('')}<span data-claim="${id}">89,2</span></div></div></main>`;
}
for(const lang of ['pt','en']) {
 const html=pagina(lang), conf=s=>conferirLugaresIA(parse(s),lang,s);
 assert.deepEqual(conf(html),[],`intacta ${lang}`);
 const reposta=html.replace('</main>','<a data-met1="ligacao-1" href="https://github.com/oestadodopais/o-estado-do-pais/blob/main/design/observatorio/POLITICA-DA-AUTONOMIA.md"></a></main>');
 planta(`porta do repositório reposta ${lang}`,conf(reposta).includes('MET2: ligação ao repositório no Método.'));
 const portaExtra=html.replace('</main>','<a data-met1="ligacao-1" href="/outra"></a></main>');
 planta(`segunda porta sem texto ${lang}`,conf(portaExtra).includes('MET2: o parágrafo das portas deve conter apenas a agenda.'));

 for(const [nome,alterar] of [
  ['título extra',s=>s.replace('</main>','<h1>Extra sentence.</h1></main>')],
  ['atributo extra',s=>s.replace('class="met1-percurso"','class="met1-percurso" title="Extra sentence."')],
  ['frase extra',s=>s.replace('</main>','<p>Extra sentence.</p></main>')],
  ['frase extra em noscript',s=>s.replace('</main>','<noscript>Extra sentence.</noscript></main>')],
  ['frase alterada',s=>s.replace(esc(unidades(lang).abrir),'Changed sentence.')],
  ['família alterada',s=>s.replace(esc(unidades(lang)['passo-6']),'Another model reads it.')],
  ['frase repetida',s=>s.replace('</main>',`<p data-met1="abrir">${esc(unidades(lang).abrir)}</p></main>`)],
  ['nome de modelo',s=>s.replace('</main>','<p>Opus 5</p></main>')],
  ['porta agenda',s=>s.replace(routePath('agenda',lang),'/outra')],
  ['porta correções',s=>s.replace(routePath('correcoes',lang),'/outra')],
  ['ligação da fonte trocada',s=>s.replace(getClaim(APROVADO.recibo.id).source_url,'/outra-fonte')],
  ['recibo trocado',s=>s.replaceAll(APROVADO.recibo.id,'outra-linha')],
  ['edição no lugar do localizador',s=>s.replace(`data-linha-campo="${campoLocalizadorMet1(lang)}"`,'data-linha-campo="document.edition"')],
  ['texto da edição sob marca do localizador',s=>s.replace(esc(getClaim(APROVADO.recibo.id).document[campoLocalizadorMet1(lang).split('.')[1]]),esc(getClaim(APROVADO.recibo.id).document.edition))],
  ['nome diferente do recibo',s=>s.replace(esc(uNome(lang)),'Nome trocado')],
  ['campo incompleto',s=>s.replace('data-linha-campo="excerpt"','data-linha-campo="unit"')],
  ['contagem aumentada',s=>s.replace(`>${recontarConferencias()}</a>`,`>${recontarConferencias()+1}</a>`)],
  ['contagem com zero à esquerda',s=>s.replace(`>${recontarConferencias()}</a>`,`>0${recontarConferencias()}</a>`)],
  ['prova trocada',s=>s.replace('conferencias_da_corrida','afirmacoes')],
 ]) planta(`${nome} ${lang}`,conf(alterar(html)).length>0);
 const field=parse(`<div data-met1-recibo="${APROVADO.recibo.id}"><span data-linha-campo="value"></span></div>`).querySelector('span');
 planta(`valor fora de Claim ${lang}`,!campoDoReciboMet1('metodo',field,APROVADO.recibo.id,'value'));
 planta(`campo fora do Método ${lang}`,!campoDoReciboMet1('home',field,APROVADO.recibo.id,'excerpt'));
}
// Executa só o extrator da lista real do shell, sem correr nenhuma conferência.
const shell=fs.readFileSync(new URL('../../scripts/leituras/conferir-tudo.sh',import.meta.url),'utf8');
const extrator=shell.match(/<<'PY'[^\n]*\n([\s\S]*?)\nPY\n/)?.[1];
assert(extrator,'lista de conferir-tudo.sh identificada');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'met1-lista-'));
try {
 const real=JSON.parse(fs.readFileSync(new URL('../../package.json',import.meta.url),'utf8')).scripts;
 for(const scripts of [real,{verify:'npm run a && npm run b',typecheck:'tsc'},{verify:'npm run a && npm run typecheck',typecheck:'tsc'},{verify:'npm run a'}]) {
  const f=path.join(tmp,'package.json');fs.writeFileSync(f,JSON.stringify({scripts}));
  const r=spawnSync('python3',['-c',extrator,f,'','',tmp],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  const lista=r.stdout.trim().split('\n');
  assert.deepEqual(passosDaCorrida(scripts),lista);
  assert.equal(recontarConferencias(scripts),lista.length);
  planta('contagem adulterada',recontarConferencias(scripts)!==lista.length+1);
 }
} finally {fs.rmSync(tmp,{recursive:true,force:true});}

const limites=JSON.parse(fs.readFileSync(new URL('../../scripts/sobre-limites-aprovados.json',import.meta.url),'utf8'));
for(const lang of ['pt','en']) {
 const h=limites.map(f=>`<p data-sobre-limite="${lang}">${esc(f[lang])}</p>`).join('');
 assert.deepEqual(conferirLimitesSobre(parse(h),lang),[]);
 planta(`Sobre alterado ${lang}`,conferirLimitesSobre(parse(h.replace(esc(limites[0][lang]),'Outra frase.')),lang).length>0);
 planta(`Sobre incompleto ${lang}`,conferirLimitesSobre(parse(''),lang).length>0);
}
