/** HB1-e: a lista família a família para o relatório (a origem e o seu excerto, e a frase como o dist/ a imprime),
    lida de origens-hb1e.json, de familias.mjs e de frases-dist.json. Escreve Markdown na saída. */
import fs from 'node:fs';
import {FAMILIAS_HB1} from '../familias.mjs';
const D='design/especime-v3/medicoes/hb1-2026-10-21/hb1e/';
const O=JSON.parse(fs.readFileSync(D+'origens-hb1e.json','utf8')),F=JSON.parse(fs.readFileSync(D+'frases-dist.json','utf8'));
const linhas=[];
for(const [id,f] of Object.entries(F)){
 const e=FAMILIAS_HB1.find(x=>x.chaves.includes(id));
 const ori=(e?.origens??[]).map(o=>`\`${o}\` (\`${O[o].selo.motor.replace('content/23 Habitacao/source/','')}\`, «${O[o].excerto}»)`).join('; ');
 linhas.push(`- \`${id}\`: ${ori?'origem '+ori:'sem origem de definição (a frase apoia-se na própria linha)'}.\n  - PT: «${f.pt}»\n  - EN: «${f.en}»`);
}
process.stdout.write(linhas.join('\n')+'\n');
