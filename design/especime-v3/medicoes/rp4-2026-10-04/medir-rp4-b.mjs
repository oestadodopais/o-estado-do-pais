/** RP4-b: mede a cabeça conferida e as provas desta passagem, sem alterar dist/. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { conferirSeriesDosCartoes, plantasDosCartoesComSerie } from '../../../../tests/cartao/series.mjs';
import { documentoDosAssuntos } from '../../../../tests/inicio/paginas-dos-assuntos.mjs';
import { conferirEntradas, plantasDasEntradas } from '../../../../tests/inicio/entradas.mjs';
const O = 'design/especime-v3/medicoes/rp4-2026-10-04';
const ler = f => fs.readFileSync(path.join(O, f), 'utf8').trim();
const json = f => JSON.parse(ler(f));
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const codigo = s => { assert(/^\d+$/.test(s)); return Number(s); };
assert.equal(codigo('1'), 1); assert.throws(() => codigo(''));
const cabeca = ler('portoes/cabeca');
assert.equal(cabeca, ler('portoes/cabeca.fim'));
assert.equal(cabeca, JSON.parse(fs.readFileSync('dist/version.json')).commit);
execFileSync('git', ['merge-base', '--is-ancestor', 'fb364fe4', cabeca]);
const portoes = Object.fromEntries(['build','verify','typecheck'].map(g => {
 const c = codigo(ler(`portoes/${g}.codigo`)); assert.equal(c, 0);
 const inicio = ler(`portoes/${g}.inicio`), fim = ler(`portoes/${g}.fim`);
 return [g, { codigo:c, inicio, fim, segundos:(Date.parse(fim)-Date.parse(inicio))/1000 }];
}));
const cartoes = {};
for (const lang of ['pt','en']) {
 const doc = documentoDosAssuntos('dist', lang);
 const r = conferirSeriesDosCartoes(doc, lang);
 assert.deepEqual(r.erros, []);
 const presos = [...loadClaims().values()].filter(c => c.serie).map(c => c.id).sort();
 assert.deepEqual([...new Set(r.vistos)].sort(), presos);
 const plantas = plantasDosCartoesComSerie(doc.outerHTML, lang); assert(plantas.every(p=>p.mordeu));
 const precos = parse(fs.readFileSync(`dist/${lang==='pt'?'precos':'en/prices'}/index.html`, 'utf8'));
 assert.equal(precos.querySelectorAll('[data-cartao-medida="ihpc-variacao-homologa-ue"]').length, 0);
 const cartao = precos.querySelector('[data-cartao-medida="ihpc-variacao-homologa"]');
 const porta = cartao.querySelector('[data-cartao-serie]');
 assert.equal(porta.getAttribute('data-cartao-serie-linha'), 'ihpc-variacao-homologa-ue');
 const ficheiro = path.join('dist', porta.getAttribute('href'), 'index.html'); assert(fs.existsSync(ficheiro));
 cartoes[lang] = {linhas:[...new Set(r.vistos)].sort(), plantas, comparacao:{cartao:cartao.getAttribute('data-cartao-medida'),linha:porta.getAttribute('data-cartao-serie-linha'),serie:porta.getAttribute('data-cartao-serie'),porta:porta.getAttribute('href'),legenda:porta.querySelector('[data-cartao-serie-legenda]').textContent.trim()}, autonomos:0};
}
const entradas = {controlo:conferirEntradas('dist'), plantas:plantasDasEntradas('dist')};
assert.deepEqual(entradas.controlo.erros, []); assert(entradas.plantas.every(p=>p.mordeu));
const capturas = json('capturas.json');
assert.equal(capturas.cabeca, cabeca); assert.deepEqual(capturas.erros, []); assert(capturas.plantas.every(p=>p.mordeu));
for (const c of capturas.capturas) {const bytes=fs.readFileSync(c.ficheiro);assert.equal(hash(bytes), c.sha256);assert.equal(bytes.length,c.bytes);}
const protegidos = git('diff','--name-only','main',cabeca,'--','ledger','src/lib/series.mjs'); assert.equal(protegidos,'');
const series=json('rp4-b-series.json'); assert(Object.values(series.erros).every(e=>e.length===0)); assert(series.plantas.every(p=>p.mordeu));
const issues = fs.readFileSync('design/especime-v3/ISSUES.md','utf8');
for (const id of ['I195','I196','I197']) assert.equal(issues.split('\n').filter(l=>l.startsWith(`| ${id} |`)).length,1);
const leitura = 'design/especime-v3/critica/LEITURA-RP4-2026-10-05.md';
const plantas = 'design/especime-v3/critica/LEITURA-RP4-2026-10-05.plantas.json';
const resultado = {comando:'node '+O+'/medir-rp4-b.mjs',cabeca_do_codigo:cabeca,main:git('rev-parse','main'),portoes,
 cartoes,entradas,series:{contas:series.contas,plantas:series.plantas},
 capturas:{cabeca:capturas.cabeca,ficheiros:capturas.capturas.length,larguras:capturas.larguras,erros:capturas.erros,plantas:capturas.plantas,paginasDosCartoes:capturas.paginasDosCartoes},
 livro:{ficheiros_alterados:protegidos?protegidos.split('\n').length:0},
 leitura:[leitura,plantas].map(f=>({ficheiro:f,presente:fs.existsSync(f),sha256:fs.existsSync(f)?hash(fs.readFileSync(f)):null})),
 commits:git('log','--format=%H %s','main..'+cabeca).split('\n'),
 conhecido_positivo:{codigo_um:codigo('1'),codigo_vazio_recusado:true,plantas_k20:cartoes.pt.plantas.length+cartoes.en.plantas.length,plantas_e2:entradas.plantas.length}};
fs.writeFileSync(path.join(O,'rp4-b.json'),JSON.stringify(resultado,null,2)+'\n');
console.log(JSON.stringify({cabeca,portoes,plantas_k20:resultado.conhecido_positivo.plantas_k20,capturas:capturas.capturas.length},null,2));
