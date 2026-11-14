import assert from 'node:assert/strict';
import {releituraPosteriorALeitura as mostra} from '../../src/lib/releitura-posterior.mjs';
assert.equal(mostra('2026-11-12', '2026-11-11T23:59:59Z'), false);
assert.equal(mostra('2026-11-12', '2026-11-13T00:00:00Z'), true);
assert.equal(mostra('2026-11-12', '2026-11-12T23:59:59Z'), false);
assert.equal(mostra(null, '2026-11-13'), false);
console.log('ZER0: releitura anterior e no mesmo dia omitidas; posterior apresentada.');
