#!/usr/bin/env node
/** B2: as portas obrigatórias não dão dispensa ao resto de um bloco.
 * Corre a L1 real, sem cortar as outras células do check:lugar. A base e a
 * reposição têm de sair a zero; cada estrago tem de acusar a célula prevista.
 * A célula 8.4 é plantada à parte, retirando a origem do regime no recibo novo.
 * Os ficheiros de dist/ são repostos byte a byte antes de cada leitura e no fim.
 * Esta planta ocupa a máquina: não deve correr em paralelo com a construção. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { portasObrigatoriasB2 } from '../../scripts/portas-b2.mjs';

const dist = path.resolve('dist');
const medida = 'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025';
const recibos = [`livro-razao/${medida}/index.html`, `en/ledger/${medida}/index.html`];
const rotas = ['index.html', 'en/index.html', 'temas/index.html', 'en/themes/index.html', ...recibos];
const originais = new Map(rotas.map(f => [f, fs.readFileSync(path.join(dist, f), 'utf8')]));
const sha = s => createHash('sha256').update(s).digest('hex');
const teto = JSON.parse(fs.readFileSync('scripts/lugar-tetos-b1.json', 'utf8')).l1_paginas;
const resultados = [];
const repor = () => {
  for (const [f, texto] of originais) fs.writeFileSync(path.join(dist, f), texto);
};
const documento = rota => parse(fs.readFileSync(path.join(dist, rota), 'utf8'));
const portas = (doc, rota) => {
  const lang = rota.startsWith('en/') ? 'en' : 'pt';
  const home = rota === 'index.html' || rota === 'en/index.html';
  return portasObrigatoriasB2(doc, home ? 'home' : 'temas', lang,
    home ? documento(lang === 'pt' ? 'temas/index.html' : 'en/themes/index.html') : null);
};

function planta(nome, rota, alterar, mordida = null, incremento = 0, celula = 'L1') {
  repor();
  const alvo = path.join(dist, rota);
  const antes = originais.get(rota);
  const doc = documento(rota);
  if (alterar) {
    alterar(doc);
    assert.notEqual(doc.toString(), antes, `${nome}: o HTML não mudou.`);
    fs.writeFileSync(alvo, doc.toString());
  }
  const inicio = new Date().toISOString();
  let r;
  try {
    r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], {
      encoding: 'utf8', env: { ...process.env, AMOSTRA: '100000' },
      maxBuffer: 64 * 1024 * 1024,
    });
  } finally { repor(); }
  const fim = new Date().toISOString();
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  const contagem = Number(saida.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto/)?.[1]);
  const reposicao = Object.fromEntries(rotas.map(f => [f, {
    antes: sha(originais.get(f)), reposto: sha(fs.readFileSync(path.join(dist, f))),
  }]));
  const passou = r.status === (mordida ? 1 : 0)
    && contagem === teto + incremento
    && (!mordida || mordida.test(saida))
    && Object.values(reposicao).every(f => f.antes === f.reposto);
  resultados.push({ nome, celula, ficheiro: rota, comando: 'AMOSTRA=100000 node scripts/check-lugar.mjs',
    inicio, fim, codigo: r.status, contagem, teto, incremento,
    mordida: mordida?.source ?? null, passou, reposicao, saida: saida.trim() });
  console.log(`${passou ? 'OK' : 'FALHA'} ${nome}: código ${r.status}, L1 ${contagem}, esperado ${teto + incremento}`);
  assert.ok(passou, `${nome}: ${saida}`);
}

try {
  planta('l1-b2-limpo', 'index.html', null);
  planta('l1-b2-porta-final-repetida', 'temas/index.html', doc => {
    const a = doc.querySelector('[data-cartao-camaras] .pais-porta-tema a');
    a.insertAdjacentHTML('afterend', a.outerHTML);
    const l = portas(doc, 'temas/index.html');
    assert.ok(l.erros.some(e => /V2 pt: a porta final/.test(e)));
    assert.equal(l.portas.size, 0, 'um bloco inválido não dispensa portas');
  }, /L1 B2 · \/temas: V2 pt: a porta final/, 1);
  planta('l1-b2-porta-obrigatoria-alterada', 'en/index.html', doc => {
    doc.querySelector('[data-veredicto-pais] [data-prova="painel_fora_do_limiar"]')
      .setAttribute('href', '/en/places/');
    const l = portas(doc, 'en/index.html');
    assert.ok(l.erros.some(e => /V1 en: painel_fora_do_limiar: a contagem perdeu a porta/.test(e)));
    assert.equal(l.portas.size, 0, 'um bloco inválido não dispensa portas');
  }, /L1 B2 · \/en: V1 en: painel_fora_do_limiar: a contagem perdeu a porta/);
  planta('l1-b2-duas-portas-fora-do-bloco', 'temas/index.html', doc => {
    doc.querySelector('main').insertAdjacentHTML('beforeend',
      '<p data-planta-b2><a href="/lugares/">Os lugares</a> <a href="/lugares/">Os lugares</a></p>');
    const l = portas(doc, 'temas/index.html');
    assert.deepEqual(l.erros, []);
    for (const a of doc.querySelectorAll('[data-planta-b2] a')) assert.ok(!l.portas.has(a));
  }, /L1 · páginas com dois destinos iguais fora da mobília: \d+, acima do teto/, 1);
  planta('l1-b2-duas-portas-extra-dentro-do-bloco', 'en/themes/index.html', doc => {
    doc.querySelector('[data-cartao-camaras]').insertAdjacentHTML('beforeend',
      '<p data-planta-b2><a href="/en/places/">The places</a> <a href="/en/places/">The places</a></p>');
    const l = portas(doc, 'en/themes/index.html');
    assert.deepEqual(l.erros, []);
    for (const a of doc.querySelectorAll('[data-planta-b2] a')) assert.ok(!l.portas.has(a));
    for (const a of doc.querySelectorAll('[data-cartao-camaras] .src-chip')) assert.ok(!l.portas.has(a));
  }, /L1 · páginas com dois destinos iguais fora da mobília: \d+, acima do teto/, 1);
  for (const rota of recibos) {
    const lang = rota.startsWith('en/') ? 'en' : 'pt';
    planta(`origem-inquilinos-b2-retirada-${lang}`, rota, doc => {
      const origem = doc.querySelector(`[data-definicao="${medida}"] [data-def-origem="eurostat-tessi164-inquilinos"]`);
      assert.ok(origem, 'o recibo tem de render a origem do regime antes da planta');
      origem.remove();
    }, /a origem «eurostat-tessi164-inquilinos» não se rende na página/, 0, '8.4');
  }
  planta('l1-b2-reposto', 'index.html', null);
} finally {
  repor();
  const i = process.argv.indexOf('--json');
  if (i !== -1) fs.writeFileSync(process.argv[i + 1], JSON.stringify(resultados, null, 2) + '\n');
}
