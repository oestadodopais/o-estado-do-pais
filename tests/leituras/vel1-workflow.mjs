import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {load} from 'js-yaml';
const workflow = load(fs.readFileSync('.github/workflows/portao.yml','utf8'));
const visitados = new Set();
function importar(f) {
  if (visitados.has(f)) return;
  visitados.add(f);
  const texto = fs.readFileSync(f,'utf8');
  for (const m of texto.matchAll(/(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/g)) {
    if (m[1].startsWith('node:')) continue;
    assert(m[1].startsWith('.'), `dependência externa em ${f}: ${m[1]}`);
    importar(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));
  }
}
importar('scripts/verify-partes.mjs');
assert([...visitados].every(f=>f.startsWith('scripts/')));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'vel1-esparsa-'));
try {
  for (const f of [...visitados,'package.json','.nvmrc','package-lock.json']) {
    fs.mkdirSync(path.dirname(path.join(tmp,f)),{recursive:true});fs.copyFileSync(f,path.join(tmp,f));
  }
  const ensaio=`import {juntar} from './scripts/verify-partes.mjs';
    import crypto from 'node:crypto';
    const scripts={build:'escreve',verify:'escreve && confere'};
    const base={cabeca:'ensaio',partes:[['confere']]};
    const manifesto=crypto.createHash('sha256').update(JSON.stringify(base)).digest('hex');
    const p={parte:0,cabeca:'ensaio',manifesto,ok:true,celulas:{U:{ok:true},D:{ok:true},C:{ok:true}},corridos:[{passo:'confere',codigo:0}]};
    if(!juntar(scripts,base,[p]).ok)process.exit(1);`;
  execFileSync('node',['--input-type=module','-e',ensaio],{cwd:tmp,stdio:'pipe'});
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
console.log(JSON.stringify({juntar_importa:[...visitados],bytes:[...visitados].reduce((n,f)=>n+fs.statSync(f).size,0),arvore_esparsa:'união verde sem src, tests ou dependências instaladas'}));
