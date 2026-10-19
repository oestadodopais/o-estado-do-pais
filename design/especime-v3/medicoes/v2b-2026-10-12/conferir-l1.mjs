/** V2-b: o aumento da L1 vem das duas páginas novas, sem mudar a regra da contagem. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const pasta='design/especime-v3/medicoes/v2b-2026-10-12';
const atual=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const anterior=JSON.parse(fs.readFileSync('design/especime-v3/medicoes/v2a-2026-10-12/l1-destinos.json','utf8'));
const novas=['/en/under-discussion','/o-que-se-discute'];
const antigas=Object.keys(anterior.repetidos_por_pagina).sort();
function conferir(r){
 assert.equal(r.paginas,r.regua,'V2B L1: contagem diferente da régua');
 assert.deepEqual(Object.keys(r.repetidos_por_pagina).filter(p=>!novas.includes(p)).sort(),antigas,'V2B L1: mudou o conjunto das páginas anteriores com repetição');
 assert.deepEqual(Object.keys(r.repetidos_por_pagina).filter(p=>!antigas.includes(p)).sort(),novas,'V2B L1: as páginas novas não são as duas edições da discussão');
 for(const p of novas){
  const livro=p.startsWith('/en/')?'/en/ledger/':'/livro-razao/';
  assert.deepEqual(r.repetidos_por_pagina[p],{[p]:2,[livro+'afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09']:2,[livro+'oe-2027-ppp-total-encargos-liquidos-2027']:2},'V2B L1: destino ou multiplicidade imprevistos na página nova');
 }
 assert.equal(r.paginas,antigas.length+novas.length,'V2B L1: total diferente da decomposição');
}
conferir(atual);
const plantas=[];
for(const [nome,mut,re] of [
 ['página anterior acrescentada',r=>{r.repetidos_por_pagina['/planta']={'/metodo':2};},/conjunto das páginas anteriores/],
 ['edição em falta',r=>{delete r.repetidos_por_pagina[novas[0]];},/duas edições/],
 ['multiplicidade nova aumentada',r=>{r.repetidos_por_pagina[novas[0]][novas[0]]++;},/multiplicidade imprevistos/],
 ['contagem diferente da régua',r=>{r.regua++;},/diferente da régua/]
]){const copia=structuredClone(atual);mut(copia);assert.throws(()=>conferir(copia),re);plantas.push({nome,mordeu:true});}
const mudancas=Object.entries(atual.repetidos_por_pagina).filter(([p,d])=>p in anterior.repetidos_por_pagina&&JSON.stringify(d)!==JSON.stringify(anterior.repetidos_por_pagina[p])).map(([pagina,depois])=>({pagina,antes:anterior.repetidos_por_pagina[pagina],depois}));
const r={construcao:JSON.parse(fs.readFileSync('dist/version.json')).commit,contagens:{estudos:atual.paginas,anteriores:antigas.length,novas:novas.length},novas:Object.fromEntries(novas.map(p=>[p,atual.repetidos_por_pagina[p]])),plantas,mudancas_desde_fotografia_v2a:mudancas,razao:'A contagem integral coincide com a régua atual. O conjunto de páginas anteriores com destinos repetidos permanece o da fotografia V2-a. Entram apenas as duas edições da discussão. Cada uma repete os três destinos obrigatórios declarados, duas vezes cada. A regra da L1 não muda.',limite:'A fotografia V2-a é anterior ao ME1 e ao EX3. Não se afirma igualdade de multiplicidades nas páginas antigas: as diferenças ficam enumeradas, incluindo as portas mandatadas da primeira página e do índice, que a L1 conta sem fragmento. Nenhuma página antiga passou a integrar a contagem por causa do V2-b.'};
fs.writeFileSync(process.argv[3],JSON.stringify(r,null,2)+'\n');
if(process.argv.includes('--teto'))fs.writeFileSync('scripts/lugar-tetos-b1.json',JSON.stringify({l1_paginas:atual.paginas,medicao:pasta+'/retoma2/l1-v2b.json'},null,2)+'\n');
console.log(JSON.stringify({contagens:r.contagens,plantas}));
