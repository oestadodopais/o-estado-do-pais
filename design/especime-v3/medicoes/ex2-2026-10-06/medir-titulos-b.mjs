import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {WORKS,linguaDoTitulo} from '../../../../src/data/studies.mjs';
const casos=WORKS.filter(w=>w.editions.some(e=>e.titleUnverified)).map(w=>({estudo:w.slug,edicoes:w.editions.map(e=>({lang:e.lang,titulo:e.title,titleUnverified:e.titleUnverified===true,lingua:linguaDoTitulo(e.title,e.lang)})),paginas:['pt','en'].map(lang=>{const r=parse(fs.readFileSync(`dist/${lang==='en'?'en/index':'indice'}/index.html`,'utf8'));const el=r.querySelector(`[data-estudo="${w.slug}"]`);return {lang,titulo:el?.querySelector('[data-nonledger="titulo-de-estudo"]')?.textContent,marcas:el?.querySelectorAll('.marcador-de-titulo').length};})}));
const resultado={comando:'node design/especime-v3/medicoes/ex2-2026-10-06/medir-titulos-b.mjs',causa:'TituloDeTrabalho lê titleUnverified e acrescenta Marcador. As duas edições inglesas mantêm o título português; as portuguesas não declaram titleUnverified.',casos};
fs.writeFileSync(new URL('titulos-antes-b.json',import.meta.url),JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify(resultado));
