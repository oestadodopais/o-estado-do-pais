#!/usr/bin/env node
/**
 * OS TEMPOS DE UMA CORRIDA «portão», lidos na API do GitHub (bloco CI1,
 * 28.09.2026). Só lê: `gh api` para a corrida, os trabalhos e os passos, e
 * `gh run view --log` para as marcas de cada comando no registo. Escreve, por
 * corrida:
 *
 *   - a corrida inteira (do `run_started_at` ao `updated_at`) e cada trabalho;
 *   - cada passo de cada trabalho, com os segundos;
 *   - dentro do `build`, cada guião do npm pelas marcas «> pacote@versão nome»,
 *     e a construção do Astro pelas suas próprias marcas («generating static
 *     routes» até «[build] Complete!»);
 *   - as conferências que `scripts/verify-depois-do-build.mjs` correu, pela
 *     linha que ele escreve quando cada uma acaba («✓ passo · N s · código 0»),
 *     e as células do fim.
 *
 * O CONHECIDO-POSITIVO é a corrida de `main` de 28.09.2026 (a 36412381787),
 * cujos tempos o §1 do brief CI1 escreveu: o guião tem de ler nela o passo do
 * `build` e o do `verify` e a construção do Astro, ou sai com 2.
 *
 * Uso: node tempos-da-corrida.mjs <id da corrida> [<id> ...] [--json <saida>]
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const REPO = 'oestadodopais/o-estado-do-pais';
const REFERENCIA = '36412381787';
const args = process.argv.slice(2);
const json = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const ids = args.filter((a, i) => /^\d+$/.test(a) && args[i - 1] !== '--json');

const gh = (...a) => execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 512 * 2 ** 20 });
const seg = (a, b) => (Date.parse(b) - Date.parse(a)) / 1000;
const limpa = (s) => s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');

function tempos(id) {
  const run = JSON.parse(gh('api', `repos/${REPO}/actions/runs/${id}`));
  const trabalhos = JSON.parse(gh('api', `repos/${REPO}/actions/runs/${id}/jobs`)).jobs;
  const log = limpa(gh('run', 'view', id, '--repo', REPO, '--log'));
  /* Cada linha do registo: trabalho \t passo \t hora ISO + texto. */
  const linhas = log.split('\n').map((l) => {
    const m = /^([^\t]*)\t([^\t]*)\t(\d{4}-\d\d-\d\dT[\d:.]+Z) ?(.*)$/.exec(l);
    return m ? { trabalho: m[1], t: m[3], texto: m[4] } : null;
  }).filter(Boolean);
  const porTrabalho = {};
  for (const l of linhas) (porTrabalho[l.trabalho] ??= []).push(l);
  const saida = {
    corrida: id,
    cabeca: run.head_sha,
    ramo: run.head_branch,
    evento: run.event,
    conclusao: run.conclusion,
    inicio: run.run_started_at,
    fim: run.updated_at,
    minutos_da_corrida: +(seg(run.run_started_at, run.updated_at) / 60).toFixed(2),
    trabalhos: [],
  };
  for (const tr of trabalhos) {
    const ls = porTrabalho[tr.name] ?? [];
    const marcas = ls.map((l) => ({ t: l.t, m: /^> [^@\s]+@\S+ (\S+)/.exec(l.texto) })).filter((x) => x.m);
    const guioes = marcas.map((x, i) => ({ nome: x.m[1], inicio: x.t, segundos: +seg(x.t, marcas[i + 1]?.t ?? tr.completed_at).toFixed(1) }));
    const ini = ls.find((l) => /generating static routes/.test(l.texto));
    const fim = ls.find((l) => /\[build\] Complete!/.test(l.texto));
    /* O GitHub escreve o `::group::` e o `::error::` do guião como `##[group]` e
       `##[error]`; uma vermelha sai duas vezes (a anotação e a linha), e conta uma. */
    const vistas = new Set();
    const conferencias = ls
      .map((l) => /^(?:::group::|::error::|##\[group\]|##\[error\])?([✓✗]) (.+?) · ([\d.]+) s · código (\d+)/.exec(l.texto))
      .filter(Boolean)
      .map((m) => ({ passo: m[2], segundos: Number(m[3]), codigo: Number(m[4]) }))
      .filter((c) => !vistas.has(c.passo) && vistas.add(c.passo));
    const celulas = ls.map((l) => /^\s*([UDC]) ([✓✗]) (.*)$/.exec(l.texto)).filter(Boolean).map((m) => ({ celula: m[1], ok: m[2] === '✓', texto: m[3] }));
    saida.trabalhos.push({
      nome: tr.name,
      conclusao: tr.conclusion,
      minutos: +(seg(tr.started_at, tr.completed_at) / 60).toFixed(2),
      passos: tr.steps.map((s) => ({ nome: s.name, conclusao: s.conclusion, segundos: s.started_at && s.completed_at ? seg(s.started_at, s.completed_at) : null })),
      guioes_do_npm: guioes,
      astro_build_segundos: ini && fim ? +seg(ini.t, fim.t).toFixed(1) : null,
      conferencias_lado_a_lado: conferencias,
      celulas,
    });
  }
  return saida;
}

const ref = tempos(REFERENCIA);
const trRef = ref.trabalhos[0];
const passo = (n) => trRef?.passos.find((p) => p.nome === n)?.segundos ?? null;
const cpOk = passo('npm run build') > 600 && passo('npm run verify') > 600 && trRef.astro_build_segundos > 400;
if (!cpOk) {
  console.error('o conhecido-positivo falhou: na corrida de referência não li o build, o verify e o Astro', JSON.stringify(trRef?.passos));
  process.exit(2);
}
const resultado = { conhecido_positivo: { corrida: REFERENCIA, build_s: passo('npm run build'), verify_s: passo('npm run verify'), astro_s: trRef.astro_build_segundos, minutos_da_corrida: ref.minutos_da_corrida }, corridas: ids.map(tempos) };
for (const c of resultado.corridas) {
  console.log(`corrida ${c.corrida} · ${c.cabeca.slice(0, 8)} · ${c.evento} · ${c.conclusao} · ${c.minutos_da_corrida} min`);
  for (const tr of c.trabalhos) {
    console.log(`  trabalho ${tr.nome} · ${tr.conclusao} · ${tr.minutos} min · Astro ${tr.astro_build_segundos} s`);
    for (const p of tr.passos) console.log(`    ${String(p.segundos).padStart(6)} s  ${p.nome}`);
    for (const k of tr.conferencias_lado_a_lado) console.log(`      ${String(k.segundos).padStart(7)} s  ${k.passo} (código ${k.codigo})`);
    for (const k of tr.celulas) console.log(`      célula ${k.celula} ${k.ok ? 'passou' : 'FECHOU'}: ${k.texto}`);
  }
}
if (json) fs.writeFileSync(json, JSON.stringify(resultado, null, 1) + '\n');
