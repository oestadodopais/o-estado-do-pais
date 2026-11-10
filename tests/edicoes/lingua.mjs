import {loadClaims} from '../../src/lib/ledger.mjs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
for(const [nome,muda,queixa] of [
 ['edição atual sem língua',`delete LINGUA_DAS_EDICOES[${JSON.stringify(loadClaims().get('estudos-publicados').document.edition)}];`,'não tem língua declarada'],
 ['edição anterior órfã',"LINGUA_DAS_EDICOES['21.10.2026']=null;",'nenhuma linha do livro-razão traz'],
]) {
 const r=spawnSync(process.execPath,['--input-type=module','-e',`import {LINGUA_DAS_EDICOES} from './src/i18n/lingua-dos-titulos.mjs'; ${muda} await import('./scripts/check-lingua.mjs');`],{encoding:'utf8',maxBuffer:16*1024*1024});
 assert.equal(r.status,1,nome);assert((r.stdout+r.stderr).includes(queixa),nome);console.log(`ED1-A língua: ${nome} recusada.`);
}
