import fs from 'node:fs';import assert from 'node:assert/strict';
import {load} from 'js-yaml';
import {lerTextosJulgados,conferirTextosJulgados} from '../../scripts/textos-julgados.mjs';
import {blocosDaPagina,inventario,chave} from '../../scripts/frases-com-afirmacao.mjs';
const ds=lerTextosJulgados(),slug=ds[0].estudo;
const paginas=['pt','en'].flatMap(lingua=>['estudo','documento'].map(tipo=>{
 const rota=`/${lingua==='pt'?'estudos':'en/studies'}/${slug}${tipo==='documento'?(lingua==='pt'?'/documento':'/document'):''}`;
 return {estudo:slug,lingua,tipo,rota,par:`/${lingua==='en'?'estudos':'en/studies'}/${slug}${tipo==='documento'?(lingua==='en'?'/documento':'/document'):''}`,blocos:blocosDaPagina(fs.readFileSync(`dist${rota}/index.html`,'utf8'))};
}));
const frases=inventario(paginas),r=conferirTextosJulgados(ds,paginas,frases);
assert.deepEqual(r.erros,[]);assert(r.textos.size>0);assert.equal(r.mobilia.size,2);
for(const field of ['quem_julgou','data_fecho','texto']){
 const bad=structuredClone(ds);delete bad[0][field];const out=conferirTextosJulgados(bad,paginas,frases);
 assert(out.erros.length);assert(![...out.textos].some(k=>k.startsWith(slug+'|pt|')));
}
const documentos=load(fs.readFileSync('studies-src/manifest.yml','utf8'));
documentos.edicoes.find(e=>e.slug===slug&&e.lang==='pt').sha256_normalized='0'.repeat(64);
const bad=conferirTextosJulgados(ds,paginas,frases,{documentos});
assert(bad.erros.length);assert(![...bad.textos].some(k=>k.startsWith(slug+'|pt|')));
const plantadas=structuredClone(paginas),frase='A Câmara gastou 999 euros porque alterou a decisão.';
plantadas[0].blocos.push({frases:[frase],contextos:[frase],linhas:[],texto:frase,tag:'P'});
const f={estudo:slug,lingua:'pt',frase,ocorrencias:[{pagina:plantadas[0].rota,bloco:plantadas[0].blocos.length-1,indice:0}]};
assert(!conferirTextosJulgados(ds,plantadas,[f]).textos.has(chave(f)));
// O mesmo padrão, mas com um número adulterado, não herda a cobertura da chave antiga.
const real=frases.find(f=>r.textos.has(chave(f))&&/\d/.test(f.frase));assert(real);
const copia=structuredClone(paginas),o=real.ocorrencias[0];
copia.find(p=>p.rota===o.pagina).blocos[o.bloco].frases[o.indice]=real.frase.replace(/\d+/, '999999');
assert(!conferirTextosJulgados(ds,copia,[real]).textos.has(chave(real)));
assert.equal(conferirTextosJulgados([],paginas,frases).textos.size,0);
const aviso=frases.find(f=>r.mobilia.has(chave(f))),semPorta=structuredClone(paginas);
for(const p of semPorta)for(const b of p.blocos)b.rotuloIA=null;
assert(!conferirTextosJulgados(ds,semPorta,[aviso]).mobilia.has(chave(aviso)));
console.log(`EVA CAM2-A: ${r.textos.size} frases cobertas; resumo trocado, três campos ausentes, frase alheia e número adulterado recusados; estudo sem declaração conserva a via anterior.`);
