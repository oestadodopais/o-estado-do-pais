import assert from 'node:assert/strict';
import { WORKS } from '../../src/data/studies.mjs';
import { documentoDaHistoriaServido } from '../../src/lib/edicoes.mjs';
import { ESTRAGOS } from '../documentos/moldura-plantas.mjs';

const slug = 'evora-contas-da-camara-2010-2025';
assert.notEqual(WORKS.find(w => w.slug === slug)?.estado, 'retirado');
for (const lang of ['pt','en']) {
  const html = documentoDaHistoriaServido(slug, lang);
  for (const estrago of ESTRAGOS) {
    const amostra = estrago.amostra ? estrago.amostra(html) : html;
    assert.notEqual(estrago.faz(amostra), amostra, `${lang}: ${estrago.nome} não mudou a nova amostra`);
  }
}
console.log(`REC2 amostra: ${ESTRAGOS.length} plantas da moldura alteram a sua amostra nas duas línguas, incluindo a remoção da regra da cor num caso fixo. A recusa pelas células mede-se no navegador.`);
