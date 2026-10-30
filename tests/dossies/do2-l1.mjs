/** DO2: só as duas primeiras páginas perdem destinos repetidos, pela redução medida. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const [antes,depois,saida]=process.argv.slice(2);
function ler(f){
 const s=fs.readFileSync(f,'utf8').replace(/\x1b\[[0-9;]*m/g,'');
 const total=Number(s.match(/^  L1 · páginas com dois destinos iguais fora da mobília +(\d+)/m)?.[1]);
 const paginas=Object.fromEntries([...s.matchAll(/^      · (\/\S*) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/gm)].map(m=>[m[1],{destinos:+m[2],exemplo:m[3],vezes:+m[4]}]));
 assert.equal(Object.keys(paginas).length,total);return {total,paginas};
}
const a=ler(antes),b=ler(depois),esperada=structuredClone(a),reducao=Number(process.argv[5]??1);
assert(Number.isInteger(reducao)&&reducao>0,'A redução medida tem de ser um inteiro positivo');
for(const rota of ['/','/en'])esperada.paginas[rota].destinos-=reducao;
const conferir=m=>assert.deepEqual(m,esperada,'DO2: mudança da L1 fora das duas primeiras páginas');
conferir(b);
let plantas=0;
for(const mudar of [m=>m.total++,m=>m.paginas['/'].destinos++,m=>m.paginas['/en'].destinos++,m=>m.paginas['/'].vezes++,m=>delete m.paginas['/en']]){const c=structuredClone(b);mudar(c);assert.throws(()=>conferir(c));plantas++;}
const r={antes:a.total,depois:b.total,alteracoes:['/','/en'].map(rota=>({rota,antes:a.paginas[rota],depois:b.paginas[rota]})),plantas};
fs.writeFileSync(saida,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify(r));
