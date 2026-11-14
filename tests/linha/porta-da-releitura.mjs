import assert from 'node:assert/strict';
import {portaDaReleitura} from '../../src/lib/porta-da-releitura.mjs';
import {loadClaims, verificacoesDaLinha} from '../../src/lib/ledger.mjs';

const linha = loadClaims().get('evora-pael-emprestimo');
const v = verificacoesDaLinha(linha)[0];
const historico = JSON.stringify(linha.verifications);
const conferir = porta => assert.equal(porta(linha, v), linha.source_url);
conferir(portaDaReleitura);
assert.throws(() => conferir((_linha, verificacao) => verificacao.path), assert.AssertionError);
assert.equal(JSON.stringify(linha.verifications), historico);
const outraPagina = {...linha, document:{...linha.document, page:100}, source_url:linha.source_url.replace('#page=99', '#page=100')};
assert.equal(portaDaReleitura(outraPagina, v), outraPagina.source_url);
assert.equal(portaDaReleitura(linha, {path:'https://example.org/outro.pdf#page=84'}), 'https://example.org/outro.pdf#page=84');
assert.equal(portaDaReleitura(linha, {path:linha.source_url.split('#')[0]}), linha.source_url.split('#')[0]);
assert.equal(portaDaReleitura({source_url:linha.source_url}, v), v.path);
assert.equal(portaDaReleitura(linha, {path:linha.source_url}), linha.source_url);
const casos = [...loadClaims().values()].filter(c => {
  const ultima = verificacoesDaLinha(c)[0];
  return ultima && portaDaReleitura(c, ultima) !== ultima.path;
}).map(c => c.id);
console.log(JSON.stringify({linhasComPaginaAnterior:casos.length, linhas:casos, plantaRecusada:true, historicoIntacto:true}));
