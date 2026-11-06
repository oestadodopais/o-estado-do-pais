/** MET1: as duas edições reais, portas e ausência do marcador na construção inteira. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {conferirLugaresIA,conferirLimitesSobre,recontarConferencias} from '../../scripts/metodo-do-portao.mjs';
import {APROVADO,campoLocalizadorMet1} from '../../scripts/metodo-do-portao.mjs';
import {PLANTAS_DO_METODO} from './plantas.mjs';
const medidas={conferencias_da_corrida:recontarConferencias(),plantas:PLANTAS_DO_METODO.length,edicoes:{},marcador:{pt:0,en:0},paginas:{pt:0,en:0}};
for(const [lang,f,sobre] of [['pt','metodo/index.html','sobre/index.html'],['en','en/method/index.html','en/about/index.html']]) {
 const html=fs.readFileSync(path.join('dist',f),'utf8'),r=parse(html);
 const recibo=parse(fs.readFileSync(path.join('dist',lang==='pt'?'livro-razao':'en/ledger',APROVADO.recibo.id,'index.html'),'utf8'));
 assert.equal(r.querySelector('[data-met1="recibo-nome"]').textContent.trim(),recibo.querySelector('h1').textContent.trim());
 const campo=campoLocalizadorMet1(lang),exemplo=r.querySelector(`[data-linha-campo="${campo}"]`),original=recibo.querySelector(`[data-linha-campo="${campo}"]`);
 assert.equal(exemplo.textContent,original.textContent);
 assert.equal(exemplo.closest('[lang]').getAttribute('lang'),original.closest('[lang]').getAttribute('lang'));
 assert.equal(r.querySelectorAll('[data-linha-campo="document.edition"]').length,0);
 assert.deepEqual(conferirLugaresIA(r,lang,html),[]);
 assert.deepEqual(conferirLimitesSobre(parse(fs.readFileSync(path.join('dist',sobre),'utf8')),lang),[]);
 assert(conferirLugaresIA(r,lang,html.replace('</main>','<p>Frase acrescentada.</p></main>')).length);
 const main=r.querySelector('main');main.querySelectorAll('script,style').forEach(n=>n.remove());
 medidas.edicoes[lang]={seccoes:main.querySelectorAll('.met1 > section').length,passos:main.querySelectorAll('.met1-percurso > li').length,palavras:main.structuredText.trim().split(/\s+/).length};
}
for(const f of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'))) {
 const lang=f.startsWith('en/')?'en':'pt';medidas.paginas[lang]++;
 const r=parse(fs.readFileSync(path.join('dist',f),'utf8'));r.querySelectorAll('script,style').forEach(n=>n.remove());
 medidas.marcador[lang]+=(r.textContent.match(/\[a verificar\]/g)??[]).length;
}
assert.equal(medidas.marcador.pt,0);assert.equal(medidas.marcador.en,0);
const rotas=JSON.parse(fs.readFileSync('vercel.json','utf8')).routes;
for(const [src,destino] of [['/a-verificar/?','/metodo#marcas'],['/en/to-verify/?','/en/method#marcas']])assert.equal(rotas.find(r=>r.src===src)?.headers?.Location,destino);
const css=fs.readFileSync('src/styles/metodo.css','utf8');assert.match(css,/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.met1-sinal\s*\{\s*animation: none;/);
console.log(JSON.stringify(medidas,null,2));
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(medidas,null,2)+'\n');
