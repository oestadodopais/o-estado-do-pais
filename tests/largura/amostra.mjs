// Uma família nova entra sozinha; os documentos excedem o teto da amostra.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {amostraDist} from './largura.mjs';
const pasta=fs.mkdtempSync(path.join(os.tmpdir(),'lar1-amostra-'));
try {
  const rotas=['/','/en/','/familia-nova/a/','/familia-nova/b/','/familia-nova/c/',...['a','b','c'].map(s=>`/estudos/${s}/documento/`),'/estudos/c/documento/2026-10-01/','/en/studies/c/document/2026-10-01/'];
  for(const r of rotas){const p=path.join(pasta,r);fs.mkdirSync(p,{recursive:true});fs.writeFileSync(path.join(p,'index.html'),'<!doctype html>');}
  const a=amostraDist(pasta);
  assert.equal(a.familias['familia-nova/*'].length,2);
  assert.equal(a.documentos.length,5);
  for(const r of rotas.filter(r=>/document/.test(r)))assert(a.paginas.includes(r));
  fs.mkdirSync(path.join(pasta,'outra-familia'));fs.writeFileSync(path.join(pasta,'outra-familia/index.html'),'<!doctype html>');
  assert(amostraDist(pasta).paginas.includes('/outra-familia/'));
  console.log('Amostra: família nova descoberta; todos os documentos atuais e guardados incluídos.');
} finally {fs.rmSync(pasta,{recursive:true,force:true});}
