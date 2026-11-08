import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {conferirEdicoes} from '../../scripts/edicoes-conferir.mjs';
import {createHash} from 'node:crypto';
import {conferirTestemunhas} from '../../scripts/historia-edicoes-conferir.mjs';
import {HOST_PREFIX, HOST_HEAD, HOST_SUFFIX, RUNTIME_OPEN, RUNTIME_CLOSE} from '../../scripts/normalize-study.mjs';
const sha = b => createHash('sha256').update(b).digest('hex');
const corpo = '<p>A fonte publicou 12.</p>';
const normalizado = Buffer.from(HOST_PREFIX + HOST_HEAD + corpo + HOST_SUFFIX);
const bruto = runtime => Buffer.from(HOST_PREFIX + RUNTIME_OPEN + runtime + RUNTIME_CLOSE + HOST_HEAD + corpo + HOST_SUFFIX);
const entrada = {slug:'planta', lang:'pt', raw_file:'_raw/planta.pt.html', artifact_url:'https://example.test/artefacto', primeira_edicao:{commit:'a'.repeat(40), sha256:sha(normalizado)}};
const medir = (e, bytes, opcoes) => conferirTestemunhas({edicoes:[e]}, () => bytes, opcoes);
assert.deepEqual(medir(entrada, bruto('runtime original')), {erros:[], avisos:[]});
assert.deepEqual(medir(entrada, bruto('outro runtime')), {erros:[], avisos:[]});
assert.equal(medir(entrada, Buffer.from(bruto('runtime').toString().replace('12', '13'))).erros.length, 1);
assert.equal(medir(entrada, Buffer.from('invólucro inválido')).erros.length, 1);
assert.equal(medir(entrada, Buffer.from('invólucro inválido'), {permitirAusencia:true}).erros.length, 1);
const motor = {...entrada}; delete motor.artifact_url;
assert.deepEqual(medir(motor, normalizado), {erros:[], avisos:[]});
assert.equal(medir(motor, bruto('runtime')).erros.length, 1);
console.log('ED1 testemunhas: 7 controlos e plantas; só a origem externa normaliza o runtime.');

// Uma primeira edição guardada não inventa a data de publicação desconhecida.
const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'coragua-edicoes-'));
try {
 const antigo = Buffer.from('<p>Antigo.</p>'), atual = Buffer.from('<p>Corrigido.</p>');
 const primeiro = {data:'2026-08-20', sha256:sha(antigo), file:'_edicoes/planta.pt.2026-08-20.html'};
 const ultimo = {data:'2026-11-08', sha256:sha(atual), file:'planta/pt.html'};
 for (const [v, b] of [[primeiro, antigo], [ultimo, atual]]) {const f=path.join(raiz,v.file); fs.mkdirSync(path.dirname(f),{recursive:true}); fs.writeFileSync(f,b);}
 const e = {slug:'planta',lang:'pt',edicoes:[primeiro,ultimo],sha256_normalized:sha(atual),primeira_edicao:{date:primeiro.data,sha256:primeiro.sha256,file:primeiro.file,commit:'a'.repeat(40)}};
 const args = {raiz,works:[{slug:'planta',editions:[{lang:'pt',date:null,updated:ultimo.data}]}],manifesto:{historia_edicoes_base:'2026-11-02',edicoes:[e]},correcoes:[{slug:'planta',kind:'texto',data:ultimo.data,frase:{pt:'Texto corrigido.',en:'Corrected text.'}}]};
 assert.deepEqual(conferirEdicoes(args), []);
 assert(conferirEdicoes({...args, works:[{slug:'planta',editions:[{lang:'pt',date:'2026-08-19',updated:ultimo.data}]}]}).some(e=>e.startsWith('ED1 arquivo:')));
 const adulterada = structuredClone(args); adulterada.manifesto.edicoes[0].primeira_edicao.date='2026-08-19';
 assert(conferirEdicoes(adulterada).some(e=>e.startsWith('ED1 arquivo:')));
} finally { fs.rmSync(raiz, {recursive:true,force:true}); }
console.log('ED1 primeira edição: 3 controlos e plantas; data desconhecida preservada, história e publicação alteradas recusadas.');
