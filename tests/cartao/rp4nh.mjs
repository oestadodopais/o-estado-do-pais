/** RP4-n-h: formas da marca, datas, localizadores e composição K2. */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {loadClaims} from '../../src/lib/ledger.mjs';
const plantas=[];
const ids=['penalizacao-antecipacao-um-ano-neutra','penalizacao-legal-um-ano-antecipacao-2026'];
const linhas=loadClaims();
const {conferirDataLocal}=await import('./origens-locais-rp4n.mjs');
const fontes=JSON.parse(fs.readFileSync('src/data/pensao-rp4n.json','utf8'));

const criacao=execFileSync('git',['log','--follow','--diff-filter=A','--format=%cs','--',`ledger/claims/${ids[1]}.yml`],{encoding:'utf8'}).trim();
assert.match(criacao,/^\d{4}-\d{2}-\d{2}$/);
function historia(c) {return (c.verifications??[]).some(v=>v.date<criacao)?['RP4N-h: reconferência anterior à criação da linha legal']:[];}
assert.deepEqual(historia(linhas.get(ids[1])),[]);
const le=f=>parse(fs.readFileSync(f,'utf8'));
const normal=s=>s.replace(/\s+/g,' ').trim();
export function lingua(root,lang) {
 const esperado=lang==='pt'?'[a verificar]':'[to verify]';
 const erros=[];
 for(const e of root.querySelectorAll('.marcador'))if(normal(e.textContent)!==esperado)erros.push('RP4N-h: marca fora da língua da edição ('+lang+', texto)');
 for(const e of root.querySelectorAll('[data-marca]'))if(e.getAttribute('data-marca')!==esperado)erros.push('RP4N-h: marca fora da língua da edição ('+lang+', marca de água)');
 // RP4-n-i: todos os atributos, mesmo fora dos componentes da marca.
 for(const e of root.querySelectorAll('*'))for(const [nome,valor] of Object.entries(e.attributes))
  if(valor.includes(lang==='pt'?'[to verify]':'[a verificar]'))erros.push('RP4N-i: marca fora da língua da edição ('+lang+', atributo '+nome+')');
 const copia=parse(root.toString());
 for(const e of copia.querySelectorAll('script,style,[data-verbatim]'))e.remove();
 if(copia.textContent.includes(lang==='pt'?'[to verify]':'[a verificar]'))erros.push('RP4N-h: marca fora da língua da edição ('+lang+', texto fora do componente)');
 return erros;
}
export function localizadores(root,c,lang) {
 return ['name_source','document.locator'].flatMap(campo=>{
  const objeto=campo.startsWith('document.')?c.document:c;
  const chave=campo.split('.').at(-1);
  if(!objeto?.[chave])return [];
  const k=lang==='en'?campo+'_en':campo;
  const el=root.querySelector(`[data-linha-campo="${k}"]`);
  return el && normal(el.textContent)===normal(objeto[lang==='en'?chave+'_en':chave]??'') ? [] : ['RP4N-h: localizador fora da língua da edição ('+lang+', '+campo+')'];
 });
}
export function dataAlojada(root,lang) {
 const el=root.querySelector('[data-de-campo="access_date"]');
 const esperado=lang==='pt'?'Cópia alojada a':'Copy hosted on';
 const dd=el?.closest('dd');
 return dd?.previousElementSibling?.textContent===esperado && dd.querySelector('a[href="/provas/pensao-alojamento.json"]') ? [] : ['RP4N-h: o recibo não distingue alojamento de leitura na fonte ('+lang+')'];
}
export function k2(root) {
 return root.querySelectorAll('.estudo-resumo .marcador-definicao, .cartao-medida-leitura .marcador-definicao, [data-leitura-parte] .marcador-definicao').length ? ['RP4N-h: a glosa interrompe a frase K2'] : [];
}
function morde(nome,erros,mensagem) {
 const real=erros.find(x=>x.includes(mensagem));assert(real,nome+': passou');plantas.push({nome,mensagem:real});
}
morde('reconferência anterior à criação',historia({verifications:[{date:'1900-01-01'}]}),'reconferência anterior');
for(const [nome,mexer] of [
 ['data local sem prova',o=>delete o.alojada.prova_data],
 ['data local trocada',o=>o.lido='1900-01-01'],
 ['manifesto local sem commit',o=>delete o.alojada.prova_data.registo.commit],
 ['tipo da data local inventado',o=>o.alojada.prova_data.tipo='data-inventada'],
]) {
 const origem=structuredClone(fontes['pensao-legal']);assert.equal(conferirDataLocal(origem),null);mexer(origem);
 morde(nome,[conferirDataLocal(origem)].filter(Boolean),'a data');
}
for(const f of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'))) {
 const root=le('dist/'+f);const lang=f.startsWith('en/')?'en':'pt';
 assert.deepEqual(lingua(root,lang),[],f);
}
for(const lang of ['pt','en']) {
 for(const id of ids) {
  const root=le(`dist/${lang==='pt'?'livro-razao':'en/ledger'}/${id}/index.html`);
  assert.deepEqual(localizadores(root,linhas.get(id),lang),[]);
  assert.deepEqual(dataAlojada(root,lang),[]);
  for(const campo of ['name_source','document.locator']) {
   const k=lang==='en'?campo+'_en':campo,el=root.querySelector(`[data-linha-campo="${k}"]`);
   if(!el)continue;
   const antes=el.innerHTML;el.set_content('localizador na outra língua');
   morde(`localizador trocado (${id}, ${lang}, ${campo})`,localizadores(root,linhas.get(id),lang),'localizador fora');el.set_content(antes);
  }
  const el=root.querySelector('[data-de-campo="access_date"]').closest('dd').previousElementSibling;
  el.set_content(lang==='pt'?'Lido na fonte a':'Read at the source on');
  morde(`alojamento dito leitura (${id}, ${lang})`,dataAlojada(root,lang),'não distingue');
 }
 const tema=le(`dist/${lang==='pt'?'salarios-pensoes-e-apoios':'en/pay-pensions-and-benefits'}/index.html`);
 assert.deepEqual(k2(tema),[]);
 const alvo=tema.querySelector('[data-claim="penalizacao-antecipacao-um-ano-neutra"]')?.closest('.estudo-resumo');assert(alvo);
 alvo.insertAdjacentHTML('beforeend','<span class="marcador-definicao">glosa intrusa</span>');
 morde(`glosa a meio da K2 (${lang})`,k2(tema),'a glosa interrompe');
 const errada=lang==='pt'?'[to verify]':'[a verificar]';
 for(const [forma,html] of [['selo',`<a class="src-chip"><span class="marcador">${errada}</span></a>`],['campo',`<a class="marcador" data-linha-campo="excerpt">${errada}</a>`],['frase',`<p>${errada}</p>`],['marca de água',`<span data-marca="${errada}"></span>`],...['title','aria-label','alt','data-prova','content'].map(a=>[a,`<span ${a}="${errada}"></span>`])]) {
  morde(`marca traduzida incorretamente (${lang}, ${forma})`,lingua(parse(html),lang),'marca fora');
 }
}
if(process.argv.includes('--registo-i'))fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/i/plantas-sitio.json',JSON.stringify({plantas},null,2)+'\n');
if(process.argv.includes('--registo-h'))fs.writeFileSync('design/especime-v3/medicoes/rp4n-2026-10-06/h/plantas-sitio.json',JSON.stringify({plantas},null,2)+'\n');
for(const p of plantas)console.log(`PLANTA ${p.nome}: ${p.mensagem}`);
console.log(`RP4N-h: PASS, ${plantas.length} plantas`);
