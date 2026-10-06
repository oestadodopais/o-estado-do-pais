/* Confere os bytes do pacote e das capturas, a cabeça dos portões e a ausência
   de caminhos privados. Não substitui a leitura independente. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { escrever } from './medir.mjs';
const pasta='design/especime-v3/medicoes/er1-2026-10-06';
const capturas='design/especime-v3/capturas/er1-2026-10-06';
const json=f=>JSON.parse(fs.readFileSync(`${pasta}/${f}`,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const pacote=json('pacote.json');
const resumo=json('resumo.json');
const controlo=json('controlo-plantas.json');
const navegador=json('navegador-final.json');
const falhasSemAlteracao=[];
for(const lang of ['pt','en']){
  const normal=navegador.casos.find(c=>c.lang===lang&&c.modo==='normal');
  const semGuião=navegador.casos.find(c=>c.lang===lang&&c.modo==='sem-js');
  assert.equal(normal.textos[2],semGuião.textos[2]);
  assert.deepEqual(normal.valores[2],semGuião.valores[2]);
  falhasSemAlteracao.push({lang,texto:normal.textos[2],atributos:normal.valores[2],iguaisAoCodigoSemGuiao:true});
}
for(const f of pacote.manifesto)assert.equal(sha(fs.readFileSync(f.ficheiro)),f.sha256,f.ficheiro);
for(const p of controlo.plantas){
  assert(p.mordeu);
  assert.notEqual(p.original,p.plantado);
  assert.equal(sha(fs.readFileSync(`${pasta}/leitura/${p.ficheiro}`)),p.plantado,p.nome);
}
assert.equal(pacote.plantas,controlo.plantas.length);
assert.equal(pacote.capturas,json('capturas-prova.json').capturas.length);
assert.equal(pacote.cabeca,resumo.cabecaCodigo);
const portoes=['build','verify','typecheck'].map(nome=>({nome,codigo:Number(fs.readFileSync(`${pasta}/portoes/${nome}.codigo`,'utf8'))}));
assert(portoes.every(p=>p.codigo===0));
assert.equal(fs.readFileSync(`${pasta}/portoes/cabeca.fim`,'utf8').trim(),pacote.cabeca);
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const cabeca=git('rev-parse','HEAD');
const depois=git('diff','--name-only',pacote.cabeca,cabeca).split('\n').filter(Boolean);
assert(depois.every(f=>f.startsWith(pasta+'/')||f.startsWith(capturas+'/')));
const commits=git('rev-list','--reverse',resumo.base+'..'+cabeca).split('\n');
for(const c of commits){
  const corpo=git('show','-s','--format=%B',c);
  assert(corpo.endsWith('Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>\nClaude-Session: https://claude.ai/code/session_019Dr4reeqSo5uscMFC16k9g'),c);
}
const privados=[process.cwd(),os.homedir(),os.tmpdir(),os.userInfo().username];
const lidos=[];
function conferirPasta(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const f=path.join(dir,e.name);
    if(e.isDirectory())conferirPasta(f);
    else if(!f.endsWith('.png')){
      const texto=fs.readFileSync(f,'utf8');
      assert(!privados.some(p=>p&&texto.includes(p)),`Caminho ou conta privada em ${f}`);
      lidos.push(f);
    }
  }
}
conferirPasta(pasta);conferirPasta(capturas);
const resultado={comando:'node '+pasta+'/conferir-entrega.mjs',cabecaMedida:cabeca,cabecaCodigo:pacote.cabeca,portoes,ficheirosDoPacote:pacote.manifesto.length,plantas:controlo.plantas.length,capturas:pacote.capturas,ficheirosLidosSemCaminhosPrivados:lidos.length,commitsConferidos:commits,alteracoesDepoisDoCodigo:depois,falhasSemAlteracao};
escrever('entrega-conferida',resultado);
console.log(JSON.stringify(resultado,null,2));
