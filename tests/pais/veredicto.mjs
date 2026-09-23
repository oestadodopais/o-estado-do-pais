#!/usr/bin/env node
/** B2, peça 1. Plantas da V1 sobre cópias, sem tocar no dist/ construído.
 * Cada planta corre o check:pais inteiro e exige a mordida da célula esperada.
 * A reposição é conferida por sha256, e uma corrida limpa fecha o ensaio. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
const dist = path.resolve(process.env.OEDP_DIST ?? 'dist');
const temporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-veredicto-'));
const rotas = ['index.html', 'en/index.html', 'temas/index.html', 'en/themes/index.html',
  'correcoes/index.html', 'en/corrections/index.html', 'municipios/evora/index.html',
  'en/municipalities/evora/index.html', 'estudos/index.html', 'en/studies/index.html'];
const originais = new Map(rotas.map(f => [f, fs.readFileSync(path.join(dist, f), 'utf8')]));
const sha = s => createHash('sha256').update(s).digest('hex');
const resultados = [];
function repor() {
  for (const [f, s] of originais) {
    const destino = path.join(temporaria, f);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, s);
  }
}
function planta(nome, ficheiro, alterar, mordida) {
  repor();
  const destino = path.join(temporaria, ficheiro);
  const antes = fs.readFileSync(destino, 'utf8');
  const raiz = parse(antes);
  if (alterar) alterar(raiz);
  const alterado = raiz.toString();
  if (alterar && alterado === antes) throw Error(`${nome}: a planta não mudou o HTML.`);
  if (alterar) fs.writeFileSync(destino, alterado);
  let r;
  try {
    r = spawnSync(process.execPath, ['scripts/check-pais.mjs'], {
      encoding: 'utf8', env: { ...process.env, OEDP_DIST: temporaria }, maxBuffer: 64 * 1024 * 1024,
    });
  } finally { repor(); }
  const saida = (r.stdout ?? '') + (r.stderr ?? '');
  const reposto = sha(fs.readFileSync(destino));
  const passou = r.status === (mordida ? 1 : 0) && (!mordida || mordida.test(saida)) && sha(antes) === reposto;
  resultados.push({ nome, ficheiro, comando: 'node scripts/check-pais.mjs', codigo: r.status,
    mordida: mordida?.source ?? null, passou, antes: sha(antes), reposto, saida: saida.trim() });
  console.log(`${passou ? 'OK' : 'FALHA'} ${nome}: código ${r.status}`);
  if (!passou) throw Error(`${nome}: ${saida}`);
}
try {
  planta('veredicto-limpo', 'index.html', null, null);
  for (const f of ['index.html', 'en/index.html']) {
    const lang = f.startsWith('en/') ? 'en' : 'pt';
    planta(`contagem-trocada-${lang}`, f, r => {
      const a = r.querySelector('[data-veredicto-pais] [data-prova="painel_fora_do_limiar"]');
      a.set_content(String(Number(a.textContent) + 1));
    }, new RegExp(`V1 ${lang}: painel_fora_do_limiar: a frase não rende a contagem recontada`));
  }
  planta('chaves-trocadas', 'index.html', r => {
    const p = r.querySelectorAll('[data-veredicto-pais] [data-prova]');
    const k = p[0].getAttribute('data-prova');
    p[0].setAttribute('data-prova', p[1].getAttribute('data-prova'));
    p[1].setAttribute('data-prova', k);
  }, /V1 pt: as três chaves da prova/);
  planta('medidas-trocadas', 'index.html', r => {
    const a = r.querySelectorAll('[data-veredicto-medida]');
    const x = a[0].outerHTML;
    a[0].replaceWith(a[1].outerHTML);
    a[1].replaceWith(x);
  }, /V1 pt: a lista das medidas fora, ou a sua ordem/);
  planta('porta-da-medida-trocada', 'en/index.html', r => {
    r.querySelector('[data-veredicto-medida]').setAttribute('href', '/en/themes/#m-precos-da-habitacao-2025');
  }, /V1 en: divida-publica-2025: o nome ou a porta/);
  planta('ancora-do-cartao-ausente', 'temas/index.html', r => {
    r.querySelector('[id="m-divida-publica-2025"]').removeAttribute('id');
  }, /V1 pt: divida-publica-2025: a porta não abre exatamente o cartão/);
  planta('frase-trocada', 'index.html', r => {
    const p = r.querySelector('[data-veredicto-pais]');
    p.set_content(p.innerHTML.replace('está fora', 'está dentro'));
  }, /V1 pt: a frase construída difere/);
  planta('veredicto-depois-da-leitura', 'index.html', r => {
    const p = r.querySelector('[data-veredicto-pais]');
    const copia = p.outerHTML;
    p.remove();
    r.querySelector('[data-leitura-pais]').insertAdjacentHTML('afterend', copia);
  }, /V1 pt: o veredicto não precede a leitura/);
  planta('veredicto-reposto', 'index.html', null, null);
} finally {
  fs.rmSync(temporaria, { recursive: true, force: true });
  const i = process.argv.indexOf('--json');
  if (i !== -1) fs.writeFileSync(process.argv[i + 1], JSON.stringify(resultados, null, 2) + '\n');
}
