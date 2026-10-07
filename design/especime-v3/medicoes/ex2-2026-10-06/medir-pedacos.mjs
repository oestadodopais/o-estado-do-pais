/** EX2: os pedaços das definições confirmadas que também têm origem própria. */
import {allClaims} from '../../../../src/lib/ledger.mjs';
import {oQueEDaLinha} from '../../../../src/lib/o-que-e-o-numero.mjs';
import fs from 'node:fs';
const partes=allClaims().flatMap(l=>['pt','en'].flatMap(lang=>{const d=oQueEDaLinha(l.id,lang);return d.porConfirmar?[]:d.pedacos.filter(p=>typeof p!=='string').map(p=>({linha:l.id,lang,p}));}));
const r={comando:'node design/especime-v3/medicoes/ex2-2026-10-06/medir-pedacos.mjs',partes, claims:partes.filter(x=>x.p.claim).length, outras_linhas:partes.filter(x=>x.p.claim&&x.p.claim!==x.linha)};
fs.writeFileSync(new URL('pedacos.json',import.meta.url),JSON.stringify(r,null,2)+'\n');
console.log(JSON.stringify({partes:partes.length,claims:r.claims,outras_linhas:r.outras_linhas.length}));
