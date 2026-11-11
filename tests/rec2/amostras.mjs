import assert from 'node:assert/strict';
import { WORKS } from '../../src/data/studies.mjs';
import { documentoDaHistoriaServido } from '../../src/lib/edicoes.mjs';
import { ESTRAGOS } from '../documentos/moldura-plantas.mjs';

const slug = 'evora-contas-da-camara-2010-2025';
assert.notEqual(WORKS.find(w => w.slug === slug)?.estado, 'retirado');
for (const lang of ['pt','en']) {
  const html = documentoDaHistoriaServido(slug, lang);
  for (const estrago of ESTRAGOS) {
    assert.notEqual(estrago.faz(html), html, `${lang}: ${estrago.nome} não mudou a nova amostra`);
  }
}
console.log('REC2 amostra: as quatro plantas da moldura alteram o documento das contas nas duas línguas. A recusa pelas células mede-se no navegador.');
