import assert from 'node:assert/strict';
import { WORKS, PUBLISHED_WORKS, PUBLISHED_EDITIONS, edicaoPublicada } from '../../src/data/studies.mjs';
import { conferirPaginasDosEstudos } from '../../scripts/estudos-retirados-conferir.mjs';
const retirados = WORKS.filter(w => w.estado === 'retirado');
assert.equal(retirados.length, 6);
assert(retirados.every(w => w.sucedidoPor?.length));
assert(PUBLISHED_WORKS.every(w => w.estado !== 'retirado'));
assert(PUBLISHED_EDITIONS.every(e => !retirados.some(w => w.id === e.workId)));
assert.equal(edicaoPublicada({estado:'retirado'}, {date:'2026-08-20'}), false);
const works = [{slug:'vivo'}, {slug:'antigo', estado:'retirado'}];
const rotas = ['/estudos/vivo', '/en/studies/vivo'];
assert.deepEqual(conferirPaginasDosEstudos(works, rotas), []);
for (const rota of ['/estudos/antigo', '/en/studies/antigo/document/2026-08-20', '/estudos/antigo/texto']) {
  assert(conferirPaginasDosEstudos(works, [...rotas, rota]).some(e => e.includes('retirado construído')));
}
assert(conferirPaginasDosEstudos(works, rotas.slice(1)).some(e => e.includes('sem página')));
console.log('REC2 estado: controlos verdes; página, documento datado e registo retirados recusados; publicado sem página recusado.');
