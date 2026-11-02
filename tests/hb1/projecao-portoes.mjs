/** PAI1-C: os dois leitores reais recusam um valor alterado numa cópia HB1. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const raiz=fileURLToPath(new URL('../../',import.meta.url));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'pai1-portoes-'));
const prova=JSON.parse(fs.readFileSync(path.join(raiz,'ledger/provas/hb1/series.json')));
const portoes=['gate-html.mjs','check-cadeia.mjs'];
try {
  for(const nome of fs.readdirSync(raiz)) {
    if(['scripts','ledger','.git'].includes(nome)) continue;
    fs.symlinkSync(path.join(raiz,nome),path.join(tmp,nome));
  }
  fs.mkdirSync(path.join(tmp,'scripts'));
  for(const nome of fs.readdirSync(path.join(raiz,'scripts'))) {
    const de=path.join(raiz,'scripts',nome),para=path.join(tmp,'scripts',nome);
    if(portoes.includes(nome)) fs.copyFileSync(de,para);else fs.symlinkSync(de,para);
  }
  fs.mkdirSync(path.join(tmp,'ledger/claims'),{recursive:true});
  for(const nome of fs.readdirSync(path.join(raiz,'ledger'))) if(nome!=='claims') fs.symlinkSync(path.join(raiz,'ledger',nome),path.join(tmp,'ledger',nome));
  for(const nome of fs.readdirSync(path.join(raiz,'ledger/claims'))) {
    const de=path.join(raiz,'ledger/claims',nome),para=path.join(tmp,'ledger/claims',nome);
    if(prova.rows[nome.replace(/\.yml$/,'')])fs.copyFileSync(de,para);else fs.symlinkSync(de,para);
  }
  // Os módulos importados conservam o livro original; cada portão lê a sua cópia por ROOT/RAIZ.
  // Assim a planta chega ao leitor do portão, em vez de parar antes no resolvedor do sítio.
  const correr=script=>spawnSync(process.execPath,[path.join(tmp,'scripts',script),'--prova-projecao-hb1'],{cwd:raiz,encoding:'utf8',maxBuffer:8*1024*1024});
  for(const script of portoes) {
    const controlo=correr(script);assert.equal(controlo.status,0,controlo.stdout+controlo.stderr);
    for(const id of Object.keys(prova.rows)) {
      const f=path.join(tmp,'ledger/claims',id+'.yml'),original=fs.readFileSync(f,'utf8');
      const alterado=original.replace(/^value:.*$/m,'value: "0"');assert.notEqual(alterado,original);
      fs.writeFileSync(f,alterado);const errado=correr(script);
      assert.equal(errado.status,1);assert.match(errado.stderr,/HB1: (resumo da série divergente|a linha mudou sem recompor o documento)/);
      const entrada='  - date: "2026-11-02"\n    result: "igual"\n';
      const historia=/^verifications:/m.test(original)?original.replace(/^verifications:[^\n]*\n/m,'$&'+entrada):original+'verifications:\n'+entrada;
      assert.notEqual(historia,original);fs.writeFileSync(f,historia);
      const relida=correr(script);assert.equal(relida.status,0,relida.stdout+relida.stderr);
      fs.writeFileSync(f,original);
      console.log(`PAI1-C: ${script}, ${id}: valor recusado, releitura aceite.`);
    }
  }
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
console.log('PAI1-C: dois controlos e dezasseis plantas nos leitores reais, código 0.');
