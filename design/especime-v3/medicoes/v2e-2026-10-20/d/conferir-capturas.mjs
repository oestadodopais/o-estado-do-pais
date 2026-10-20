/** Compara cada recorte com os píxeis da captura completa identificada no manifesto. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const pasta=process.argv[2],out=process.argv[3];
const m=JSON.parse(fs.readFileSync(path.join(pasta,'capturas.json'))),provas=[];
const sha=b=>createHash('sha256').update(b).digest('hex');
assert.equal(m.ok,true);assert.deepEqual(m.falhas,[]);
for(const r of m.resultados){
 const pagina=fs.readFileSync(path.join(pasta,r.ficheiro));
 assert.equal(sha(pagina),r.sha256);assert(r.documento<=r.janela);
 for(const c of r.recortes){
  assert.equal(c.origem,r.ficheiro);
  const recorte=fs.readFileSync(path.join(pasta,c.ficheiro));assert.equal(sha(recorte),c.sha256);
  const a=await sharp(pagina).extract(c.caixa).ensureAlpha().raw().toBuffer();
  const b=await sharp(recorte).ensureAlpha().raw().toBuffer();
  assert(a.equals(b),'Recorte diferente da captura completa: '+c.ficheiro);
  provas.push({ficheiro:c.ficheiro,origem:c.origem,sha256:c.sha256,pixeis_iguais:true});
 }
}
fs.writeFileSync(out,JSON.stringify({cabeca:m.cabeca,capturas:m.resultados.length,recortes:provas},null,2)+'\n');
console.log(JSON.stringify({capturas:m.resultados.length,recortes_iguais:provas.length}));
