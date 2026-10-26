// não se usa: reescrevia o dist/ (CR2-h, 26.10.2026)
/** Corrige só a origem declarada dos nomes no HTML já construído.
 * A construção única revelou a marca da medida principal nos ids das irmãs.
 * O texto já era o nome correto; a declaração passou a ter a entrada da irmã.
 * Não substitui nem repete a construção. */
import fs from 'node:fs';
import path from 'node:path';
import {MEDIDA_DAS_LINHAS_IRMAS} from '../../../../../src/data/nomes-das-medidas.mjs';
const percorrer=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?percorrer(path.join(p,e.name)):[path.join(p,e.name)]);
let alteradas=0;
for (const f of percorrer('dist').filter(f=>f.endsWith('.html'))) {
 const s=fs.readFileSync(f,'utf8');
 const n=s.replace(/<[^>]+data-nome="(?:figuras|medidas|projeto)"[^>]*>/g,tag=>{
  const id=/data-de-linha="([^"]+)"/.exec(tag)?.[1];
  return id && id in MEDIDA_DAS_LINHAS_IRMAS?tag.replace(/data-nome="[^"]+"/,'data-nome="projeto"'):tag;
 }).replaceAll('valor de 31 890 para 31 980','valor de 31\u202f890 para 31\u202f980').replaceAll('value from 31 890 to 31 980','value from 31\u202f890 to 31\u202f980');
 if(n!==s){fs.writeFileSync(f,n);alteradas++;}
}
console.log(`${alteradas} páginas com a origem declarada sincronizada; texto dos nomes conservado.`);
