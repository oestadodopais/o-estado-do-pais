import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
import {normalizaFraseDoInventario as normal, nomeAcessivelDoTitulo, leInventario} from '../../scripts/voz.mjs';
const frase='O custo foi 79 milhões de euros.';
assert.equal(normal('O custo foi 79 milhões de euros .'),frase);
for(const outra of ['O custo foi 78 milhões de euros.','O custo foi 79 milhares de euros.','O custo foi 79 milhões de euros,'])assert.notEqual(normal(outra),normal(frase));
assert.notEqual(normal('1 .2'),normal('1.2'));
assert.notEqual(normal('Ana .'),normal('Eva.'));
const inv=leInventario(process.cwd());
const classes=new Map([...inv.mapa].map(([t,c])=>[normal(t),c]));
const viva=inv.linhas.find(x=>x.estado==='viva'&&/[\p{L}][.,]/u.test(x.texto));
assert(viva);assert.equal(classes.get(normal(viva.texto.replace(/([\p{L}])([.,])/u,'$1 $2'))),viva.classe);
assert(!classes.has(normal(viva.texto+' palavra plantada')));
const titulo=()=>parse('<h2 data-discussao-titulo aria-label="O orçamento: 79 milhões de euros"><span>O orçamento: 79</span> milhões de euros<a class="src-chip">fonte</a></h2>').querySelector('h2');
assert(nomeAcessivelDoTitulo(titulo()));
for(const nome of ['O orçamento: 78 milhões de euros','Outro orçamento: 79 milhões de euros','O orçamento; 79 milhões de euros']){const t=titulo();t.setAttribute('aria-label',nome);assert(!nomeAcessivelDoTitulo(t));}
console.log('SEL1: inventário conserva palavras, números, nomes e pontuação; nome acessível conferido integralmente.');

assert.equal(normal('(a balance of % of GDP )'),normal('(a balance of % of GDP)'));
assert.notEqual(normal('(a balance of % of GNI )'),normal('(a balance of % of GDP)'));
assert.notEqual(normal('(a balance of % of GDP ]'),normal('(a balance of % of GDP)'));
assert.notEqual(normal('(1 )'),normal('(1)'));
