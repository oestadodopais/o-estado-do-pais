// Repete sem alterações o guião recebido no §0 e verifica cada resultado.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const raiz='design/especime-v3/medicoes/lar1-2026-11-03';
const saida=process.env.OEDP_LAR1_DIR??`${raiz}/depois`;
fs.mkdirSync(saida,{recursive:true});
for(const nome of ['familias','documentos']) {
  const ficheiro=`${saida}/${nome}.json`;
  const env={...process.env,PW:path.resolve('node_modules/playwright/index.mjs')};
  delete env.LISTA;
  if(nome==='documentos')env.LISTA=`${raiz}/antes/documentos.txt`;
  const inicio=performance.now();
  const r=spawnSync(process.execPath,[`${raiz}/antes/medir-largura.mjs`,'dist',ficheiro],{env,encoding:'utf8',timeout:600000});
  assert.equal(r.status,0,`${nome}: o guião recebido falhou`);
  const dados=JSON.parse(fs.readFileSync(ficheiro,'utf8'));
  assert.equal(dados.resultados.length,dados.paginas*5);
  assert(dados.resultados.every(r=>!r.erro && Number.isFinite(r.sw) && r.sw<=r.largura),`${nome}: há páginas largas ou erros`);
  console.log(`${nome}: ${dados.paginas} páginas, ${dados.resultados.length} medidas, zero excessos, ${((performance.now()-inicio)/1000).toFixed(3)} s.`);
}
