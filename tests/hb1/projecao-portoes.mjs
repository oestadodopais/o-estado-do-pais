/** PAI1-C: os dois leitores reais recusam um valor alterado numa cópia HB1. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {conferirProjecaoHb1Html,conferirProjecaoHb1Cadeia} from '../../scripts/projecao-hb1-portoes.mjs';
const raiz=fileURLToPath(new URL('../../',import.meta.url));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pai1-portoes-'));
const prova=JSON.parse(fs.readFileSync(path.join(raiz,'ledger/provas/hb1/series.json')));
const portoes=[conferirProjecaoHb1Html,conferirProjecaoHb1Cadeia];
try {
  fs.mkdirSync(path.join(tmp,'ledger/provas/hb1'),{recursive:true});
  fs.mkdirSync(path.join(tmp,'ledger/claims'),{recursive:true});
  fs.writeFileSync(path.join(tmp,'ledger/provas/hb1/series.json'),JSON.stringify(prova));
  for(const r of Object.values(prova.rows))fs.copyFileSync(path.join(raiz,r.file),path.join(tmp,r.file));
  for(const conferir of portoes) {
    assert.equal(conferir(tmp).size,Object.keys(prova.rows).length);
    for(const id of Object.keys(prova.rows)) {
      const f=path.join(tmp,'ledger/claims',id+'.yml'),original=fs.readFileSync(f,'utf8');
      const alterado=original.replace(/^value:.*$/m,'value: "0"');assert.notEqual(alterado,original);
      fs.writeFileSync(f,alterado);
      assert.throws(()=>conferir(tmp),/HB1: (resumo da série divergente|a linha mudou sem recompor o documento)/);
      const entrada='  - date: "2026-11-02"\n    result: "igual"\n';
      const historia=/^verifications:/m.test(original)?original.replace(/^verifications:[^\n]*\n/m,'$&'+entrada):original+'verifications:\n'+entrada;
      assert.notEqual(historia,original);fs.writeFileSync(f,historia);
      assert.equal(conferir(tmp).size,Object.keys(prova.rows).length);
      fs.writeFileSync(f,original);
      console.log(`PAI1-C: ${conferir.name}, ${id}: valor recusado, releitura aceite.`);
    }
  }
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
console.log('PAI1-C: dois controlos e dezasseis plantas nos leitores reais, código 0.');
