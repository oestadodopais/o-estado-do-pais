/** COR3-B: o título da notícia tem contexto explícito e prova no corpo. */
import assert from 'node:assert/strict';
import {tituloCitado} from '../../scripts/check-frases-afirmacao.mjs';
import {conferirCorpos} from '../../scripts/corpos-ledger.mjs';
import {loadClaims} from '../../src/lib/ledger.mjs';
const linha = loadClaims().get('posicao-be-rendimentos');
const titulo = linha.document.title;
for (const [lingua, contexto] of [['pt', 'pela notícia'], ['en', 'by the news report']]) {
  const frase = `${contexto} «${titulo}»`;
  assert.equal(tituloCitado(frase, lingua, titulo, [linha]), linha);
  assert.equal(tituloCitado(frase, lingua, titulo + ' inventado', [linha]), null);
  assert.equal(tituloCitado(`A fonte disse «${titulo}»`, lingua, titulo, [linha]), null);
  assert.equal(tituloCitado(frase, lingua, titulo, [{...linha, document: {...linha.document, source_sha256: null}}]), null);
}
const prova = {...linha, id: linha.id + '#titulo', excerpt: titulo};
const limpa = conferirCorpos([prova], true);
assert.equal(limpa.erros.length, 0);
assert(limpa.limpa && limpa.lidas === 1, 'o controlo exige o corpo alojado');
const inventada = {...prova, excerpt: titulo + ' Palavras inventadas.'};
assert(conferirCorpos([inventada], true).erros.some(e => e.includes('excerto ausente do corpo')));
console.log('COR3-B: título bilingue provado no corpo; contexto, título, resumo e palavras inventadas recusados.');

const quadro = loadClaims().get('oe-2027-quadro-a1-1-impacto-saldo');
for (const [lingua, contexto] of [['pt', 'Quadro'], ['en', 'table']]) {
  const frase = `${contexto} A1.1, «Quadro de políticas invariantes»`;
  assert.equal(tituloCitado(frase, lingua, 'Quadro de políticas invariantes', [quadro]), quadro);
  assert.equal(tituloCitado(frase.replace('A1.1', 'A1.2'), lingua, 'Quadro de políticas invariantes', [quadro]), null);
}
