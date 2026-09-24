#!/usr/bin/env node
/**
 * O ENSAIO A SECO DAS LEITURAS (M31, 24.09.2026): rende cada leitura declarada
 * sobre o inventário medido do §0 do brief (`design/observatorio/medidas/BRIEF-L1.json`)
 * com um resolvedor de rascunho, independente do resolvedor do sítio, para que o
 * lugar de direção leia as frases antes de as entregar ao construtor, e para que
 * um construtor tenha uma testemunha contra o seu próprio resolvedor.
 *
 * uso: node design/observatorio/leituras/ensaio-a-seco.mjs [ficheiro-das-leituras.mjs] [inventario.json]
 *      (por omissão, o ficheiro do lugar de direção deste bloco e o inventário do BRIEF-L1)
 *
 * O que apanhou a 24.09.2026, antes de haver construtor: dois pares de ramos
 * trocados («pesa mais» onde era «pesa menos»; «cresceu menos» onde era «cresceu
 * mais») e um pedaço aninhado que o resolvedor não via. Um valor citado sai entre
 * «…» para se ver o que é selado e o que é palavra. Não escreve nada.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..');
const ficheiro = path.resolve(process.argv[2] ?? path.join(AQUI, 'LEITURAS-das-medidas-2026-09-24.mjs'));
const inventario = path.resolve(process.argv[3] ?? path.join(RAIZ, 'design', 'observatorio', 'medidas', 'BRIEF-L1.json'));
const { LEITURAS_DAS_MEDIDAS } = await import(pathToFileURL(ficheiro).href);
const d = JSON.parse(fs.readFileSync(inventario, 'utf8'));
const inv = d.medidas.find((m) => m.nome === 'inventario_das_medidas').valor;

/* O número de uma cadeia portuguesa: o separador dos milhares é um espaço (normal,
   insecável ou estreito), o decimal é a vírgula, e o sinal pode ser o menos tipográfico. */
const num = (s) => (s == null ? null : Number(String(s).replace(/[\s   ]/g, '').replace('−', '-').replace(',', '.')));

function referencia(r) {
  const v = r.referencia || '';
  const banda = v.match(/entre (−?)(\d+(?:,\d+)?) e (−?)(\d+(?:,\d+)?)/);
  if (banda) return { inferior: { nl: banda[2], sinal: banda[1] }, superior: { nl: banda[4], sinal: banda[3] } };
  const um = v.match(/\((?:acima|abaixo) de (−?)(\d+(?:,\d+)?) /);
  if (um) return { unico: { nl: um[2], sinal: um[1] } };
  return null;
}
function comparacao(r) {
  const v = r.referencia || '';
  if (/entre/.test(v)) return r.estado === 'dentro' ? 'entre' : null;
  if (/acima de/.test(v)) return r.estado === 'fora' ? 'acima' : 'abaixo';
  if (/abaixo de/.test(v)) return r.estado === 'fora' ? 'abaixo' : 'acima';
  return null;
}
const PROVA = { camaras_acima_do_limite: '10', municipios_com_pagina: '308', camaras_dentro_do_limite: '297', camaras_sem_valor: '1' };

function resolve(partes, r) {
  const saida = [];
  const valor = num(r.valor);
  for (const p of partes) {
    if (typeof p === 'string') { saida.push(p); continue; }
    if (Array.isArray(p)) { saida.push(resolve(p, r)); continue; }
    if (p.claim) { const v = p.claim === 'proprio' ? r.valor : p.claim === 'anterior' ? r.anterior?.valor : r.ue?.valor; saida.push(`«${v}»${p.sufixo ?? ''}`); continue; }
    if (p.periodo) { saida.push(`«${p.periodo === 'proprio' ? r.periodo : r.anterior?.periodo}»`); continue; }
    if (p.referencia) { const x = referencia(r)?.[p.referencia]; saida.push(x ? `«${p.semSinal ? '' : x.sinal}${x.nl}»` : '⟨SEM REFERÊNCIA⟩'); continue; }
    if (p.prova) { saida.push(`«${PROVA[p.prova] ?? '⟨CHAVE?⟩'}»`); continue; }
    if (p.nl) { saida.push(`«${p.nl}»`); continue; }
    if (p.sinal) { saida.push(resolve(p.sinal[valor > 0 ? 'positivo' : valor < 0 ? 'negativo' : 'zero'], r)); continue; }
    if (p.compara) {
      const outro = p.compara === 'anterior' ? r.anterior : r.ue;
      if (!outro) continue;
      const o = num(outro.valor);
      saida.push(resolve(p[valor > o ? 'maior' : valor < o ? 'menor' : 'igual'], r));
      continue;
    }
    if (p.estado) { if (r.estado) saida.push(resolve(p.estado[r.estado], r)); continue; }
    if (p.comparacao) { const c = comparacao(r); if (c) saida.push(resolve(p.comparacao[c], r)); continue; }
    saida.push('⟨PEDAÇO DESCONHECIDO⟩');
  }
  return saida.join('');
}

let n = 0;
const semLeitura = [];
let porResolver = 0;
for (const r of inv) {
  const l = LEITURAS_DAS_MEDIDAS[r.id];
  if (!l) { semLeitura.push(r.id); continue; }
  n++;
  console.log(`\n## ${r.id}  (${r.valor} ${r.unidade ?? ''} · ${r.periodo} · anterior ${r.anterior?.periodo ?? '-'}: ${r.anterior?.valor ?? '-'} · UE ${r.ue?.valor ?? '-'} · ${r.estado ?? '-'})`);
  for (const lang of ['pt', 'en']) {
    const texto = resolve(l[lang], r).replace(/\s+/g, ' ').trim();
    if (/⟨/.test(texto)) porResolver++;
    console.log(`  ${lang}: ${texto}`);
  }
}
console.log(`\n${n} cartões com leitura · sem leitura: ${semLeitura.join(', ') || 'nenhum'} · declaradas: ${Object.keys(LEITURAS_DAS_MEDIDAS).length} · frases com um pedaço por resolver: ${porResolver}`);
process.exit(semLeitura.length || porResolver ? 1 : 0);
