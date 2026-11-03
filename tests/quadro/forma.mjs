/** PAI2 §2.2: a mesma N1C, sobre cópias independentes de cada edição. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'node-html-parser';
import {conferirBlocosUnicos} from '../inicio/blocos-unicos.mjs';
const dist=process.env.OEDP_DIST??'dist';
for(const [rel,porta] of [['temas/index.html','precos/index.html'],['en/themes/index.html','en/prices/index.html']]){
 const html=fs.readFileSync(path.join(dist,rel),'utf8');
 const controlo=conferirBlocosUnicos(dist,new Map([[rel,html]]),{paginas:[rel]});
 assert.deepEqual(controlo.erros,[],`${rel}: controlo`);
 const copia=parse(html),cartao=parse(fs.readFileSync(path.join(dist,porta),'utf8')).querySelector('[data-cartao-medida]');
 copia.querySelector('main').insertAdjacentHTML('beforeend',cartao.outerHTML);
 const planta=conferirBlocosUnicos(dist,new Map([[rel,copia.toString()]]),{paginas:[rel]});
 assert(planta.erros.some(e=>e.startsWith('N1C')),`${rel}: cartão inteiro não foi recusado`);
 console.log(`PAI2 N1C ${rel}: controlo verde; cartão copiado recusado.`);
}
