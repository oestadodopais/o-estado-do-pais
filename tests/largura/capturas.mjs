// Prova o capturador real: página demasiado larga recusa PNG e guarda a medida.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const pasta=fs.mkdtempSync(path.join(os.tmpdir(),'lar1-capturas-'));
try {
  const dist=path.join(pasta,'dist');fs.mkdirSync(dist);
  const versao=JSON.parse(fs.readFileSync('dist/version.json','utf8'));
  fs.writeFileSync(path.join(dist,'version.json'),JSON.stringify(versao));
  const pedido=path.join(pasta,'pedido.json');
  fs.writeFileSync(pedido,JSON.stringify({cabeca:versao.commit,larguras:[390],paginas:[{nome:'planta',pt:'/',en:'/'}]}));
  for(const [nome,largura,codigo] of [['vermelha',800,1],['verde',300,0]]) {
    fs.writeFileSync(path.join(dist,'index.html'),`<!doctype html><html><head><meta charset="utf-8"><link rel="icon" href="data:,"></head><body style="margin:0"><div style="width:${largura}px;height:20px">Planta da largura</div></body></html>`);
    const saida=path.join(pasta,nome);
    const r=spawnSync(process.execPath,['scripts/leituras/captar.mjs',pedido,saida,dist],{encoding:'utf8',timeout:60000});
    assert.equal(r.status,codigo,`${nome}: código inesperado ${r.status}`);
    const manifesto=JSON.parse(fs.readFileSync(path.join(saida,'capturas.json'),'utf8'));
    assert.equal(manifesto.ok,codigo===0);
    assert(manifesto.resultados.length);
    assert(manifesto.resultados.every(r=>r.documento===(codigo?800:390)));
    if(codigo) {
      assert(manifesto.falhas.some(f=>f.includes('largura do documento 800 excede 390')));
      assert(manifesto.resultados[0].recusada);
      assert(!fs.readdirSync(saida).some(f=>f.endsWith('.png')));
    } else assert.equal(manifesto.resultados.length,2);
    console.log(`Capturas: ${nome}, código ${r.status}, largura medida ${manifesto.resultados[0].documento}.`);
  }
} finally {fs.rmSync(pasta,{recursive:true,force:true});}
