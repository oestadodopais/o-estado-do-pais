#!/usr/bin/env node
/**
 * Conferência de aceitação das linhas cruzadas.
 *
 * O motor de investigação (ResearchHub) produz; este sítio publica. O que
 * atravessa a fronteira são linhas de livro-razão, não páginas construídas — e
 * cada linha que atravessa deixa uma entrada em `ledger/cruzamentos/*.json` com
 * dois resumos criptográficos: o da linha de origem, do lado do motor, e o dos
 * bytes que foram escritos aqui.
 *
 * Este script confere, para cada entrada:
 *
 *   1. o ficheiro da linha existe em ledger/claims/;
 *   2. o resumo dos seus bytes é ainda o que o registo declara — quem editou
 *      uma linha cruzada à mão pára o build;
 *   3. o `study` da linha é um trabalho que consta de src/data/studies.mjs.
 *
 * **Corre sem rede e sem o motor presente**, de propósito: o build acontece num
 * construtor remoto onde o ResearchHub não existe. Uma conferência que só
 * funcionasse na máquina de quem exporta não seria uma conferência de aceitação
 * — seria o produtor a assinar por si próprio.
 *
 * A comparação com o lado da ORIGEM — o resumo da linha do motor contra o
 * livro-razão vivo do motor — é o modo `--with-origin`, que só corre onde o
 * motor está em disco. Não entra no `npm run build`.
 *
 *   node scripts/check-cruzamento.mjs                        conferência local
 *   node scripts/check-cruzamento.mjs --with-origin          + contra o motor
 *   node scripts/check-cruzamento.mjs --accept-correction <id>
 *
 * ### A regra das correcções
 *
 * O resumo prende os bytes exportados, e é isso que o torna útil: uma linha
 * cruzada não se corrige editando-a. Há dois caminhos legítimos, e nenhum é
 * silencioso:
 *
 *   · **Voltar a cruzar** — o valor mudou no motor. Corrige-se lá, corre-se o
 *     exportador, o registo actualiza-se sozinho.
 *   · **Corrigir do lado do sítio** — é este sítio que admite um erro. Escreve-se
 *     a entrada em `corrections[]` da linha, com data, natureza, valor antigo,
 *     valor novo e motivo nas duas línguas, e corre-se
 *     `--accept-correction <id>`. A porta é estreita: exige que a lista de
 *     correcções tenha CRESCIDO desde a exportação e que o `value` publicado
 *     seja o `new_value` da correcção mais recente. Com isso o registo passa a
 *     guardar o resumo novo e a história do que foi aceite. Sem isso, recusa —
 *     de outro modo seria uma maneira de branquear qualquer edição.
 *
 * Uma correcção continua, portanto, possível — e continua a deixar rasto.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { load } from 'js-yaml';

import { STUDY_IDS } from '../src/data/studies.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR_CRUZAMENTOS = path.join(RAIZ, 'ledger', 'cruzamentos');
const DIR_CLAIMS = path.join(RAIZ, 'ledger', 'claims');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const CAMPOS_ENTRADA = [
  'rh_study',
  'rh_id',
  'rh_ledger_sha256',
  'origin_row_sha256',
  'exported_row_sha256',
  'corrections_at_export',
  'exported_at',
  'exporter',
  'site_corrections',
];

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function registos() {
  let ficheiros = [];
  try {
    ficheiros = fs.readdirSync(DIR_CRUZAMENTOS).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  ficheiros.sort();
  return ficheiros.map((f) => {
    const full = path.join(DIR_CRUZAMENTOS, f);
    return { ficheiro: f, caminho: full, dados: JSON.parse(fs.readFileSync(full, 'utf8')) };
  });
}

/* ------------------------------------------------------- aceitar correcção */

function aceitarCorreccao(id) {
  const erros = [];
  for (const reg of registos()) {
    const entrada = reg.dados.rows?.[id];
    if (!entrada) continue;
    const caminho = path.join(DIR_CLAIMS, `${id}.yml`);
    if (!fs.existsSync(caminho)) {
      erros.push(`${id}: não há ficheiro em ledger/claims/.`);
      break;
    }
    const bytes = fs.readFileSync(caminho);
    const linha = load(bytes.toString('utf8'));
    const antes = Number(entrada.corrections_at_export ?? 0);
    const agora = Array.isArray(linha.corrections) ? linha.corrections.length : 0;
    if (agora <= antes) {
      erros.push(
        `${id}: a lista de correcções não cresceu (${antes} → ${agora}). ` +
          `--accept-correction aceita uma linha que ADMITE um erro, não uma edição qualquer.`,
      );
      break;
    }
    const ultima = linha.corrections[agora - 1];
    if (String(linha.value) !== String(ultima?.new_value)) {
      erros.push(
        `${id}: o valor publicado é "${linha.value}" e a correcção mais recente diz ` +
          `new_value "${ultima?.new_value}". A correcção tem de descrever a alteração que foi feita.`,
      );
      break;
    }
    const novo = sha256(bytes);
    const historia = Array.isArray(entrada.site_corrections) ? entrada.site_corrections : [];
    historia.push({
      date: String(ultima.date),
      kind: String(ultima.kind),
      sha256_antes: entrada.exported_row_sha256,
      sha256_depois: novo,
    });
    entrada.site_corrections = historia;
    entrada.exported_row_sha256 = novo;
    entrada.corrections_at_export = agora;
    fs.writeFileSync(
      reg.caminho,
      JSON.stringify(reg.dados, null, 2).replace(/\n?$/, '\n'),
      'utf8',
    );
    console.log('');
    console.log(
      `  ${verde('✓')} correcção aceite em "${id}" (${antes} → ${agora}) — ` +
        `${reg.ficheiro} actualizado.`,
    );
    console.log(cinza('    O registo guarda o resumo antigo e o novo. Nada foi apagado.'));
    console.log('');
    return 0;
  }
  console.error('');
  console.error(vermelho('  CORRECÇÃO NÃO ACEITE'));
  console.error('');
  for (const e of erros) console.error('    ' + vermelho('✗') + ' ' + e);
  if (!erros.length) {
    console.error(
      '    ' + vermelho('✗') + ` "${id}" não consta de nenhum registo de cruzamento. ` +
        `Uma linha que não atravessou corrige-se como qualquer outra.`,
    );
  }
  console.error('');
  return 1;
}

/* ------------------------------------------------------------ conferência */

function main(argv) {
  const idx = argv.indexOf('--accept-correction');
  if (idx !== -1) {
    const id = argv[idx + 1];
    if (!id) {
      console.error(vermelho('\n  --accept-correction precisa do id da linha.\n'));
      return 2;
    }
    return aceitarCorreccao(id);
  }
  const comOrigem = argv.includes('--with-origin');

  const erros = [];
  const avisos = [];
  let total = 0;
  let ficheiros = 0;
  const porEstudo = new Map();

  const regs = registos();
  if (!regs.length) {
    console.log('');
    console.log(cinza('  cruzamentos · nenhum registo em ledger/cruzamentos/ — nada a conferir'));
    console.log('');
    return 0;
  }

  for (const { ficheiro, dados } of regs) {
    ficheiros++;
    const linhas = dados.rows;
    if (!linhas || typeof linhas !== 'object') {
      erros.push(`[${ficheiro}] não traz um mapa "rows".`);
      continue;
    }
    for (const [id, entrada] of Object.entries(linhas)) {
      total++;
      const onde = `[${ficheiro}] ${id}`;

      for (const k of Object.keys(entrada)) {
        if (!CAMPOS_ENTRADA.includes(k)) erros.push(`${onde}: campo desconhecido "${k}".`);
      }
      for (const k of ['rh_study', 'rh_id', 'origin_row_sha256', 'exported_row_sha256']) {
        if (!entrada[k]) erros.push(`${onde}: falta "${k}".`);
      }

      const caminho = path.join(DIR_CLAIMS, `${id}.yml`);
      if (!fs.existsSync(caminho)) {
        erros.push(
          `${onde}: o registo diz que esta linha atravessou, e não há ` +
            `ledger/claims/${id}.yml. Ou a linha voltou a ser exportada, ou foi apagada ` +
            `sem sair do registo.`,
        );
        continue;
      }

      const bytes = fs.readFileSync(caminho);
      const actual = sha256(bytes);
      if (actual !== entrada.exported_row_sha256) {
        erros.push(
          `${onde}: os bytes em disco já não são os que atravessaram.\n` +
            `        registo: ${entrada.exported_row_sha256}\n` +
            `        disco:   ${actual}\n` +
            `        Uma linha cruzada não se edita à mão. Ou se volta a cruzar no motor ` +
            `(ResearchHub/publisher/export_site_rows.py --write), ou — se é este sítio a ` +
            `admitir um erro — escreve-se a correcção em corrections[] e corre-se\n` +
            `        node scripts/check-cruzamento.mjs --accept-correction ${id}`,
        );
        continue;
      }

      let linha;
      try {
        linha = load(bytes.toString('utf8'));
      } catch (err) {
        erros.push(`${onde}: YAML inválido: ${err.message}`);
        continue;
      }
      if (linha?.id !== id) {
        erros.push(`${onde}: o ficheiro traz id "${linha?.id}".`);
      }
      if (!STUDY_IDS.has(linha?.study)) {
        erros.push(
          `${onde}: "study" é "${linha?.study}", que não consta de src/data/studies.mjs.`,
        );
      } else {
        porEstudo.set(linha.study, (porEstudo.get(linha.study) ?? 0) + 1);
      }
      const nCorr = Array.isArray(linha?.corrections) ? linha.corrections.length : 0;
      if (nCorr !== Number(entrada.corrections_at_export ?? 0)) {
        erros.push(
          `${onde}: a linha tem ${nCorr} correcção(ões) e o registo diz ` +
            `${entrada.corrections_at_export}. Corra --accept-correction ${id}.`,
        );
      }
    }
  }

  /* O lado da origem. Fora do build de propósito: o construtor remoto não tem o
     motor em disco, e uma conferência que dependesse dele passaria a ser uma
     conferência do ambiente e não do conteúdo. */
  let origem = null;
  if (comOrigem) {
    origem = { lidos: 0, divergentes: [], ausentes: [], ficheiroMudou: [] };
    const raizMotor = process.env.RESEARCHHUB_DIR
      ? path.resolve(process.env.RESEARCHHUB_DIR)
      : path.join(path.dirname(RAIZ), 'ResearchHub');
    if (!fs.existsSync(raizMotor)) {
      erros.push(
        `--with-origin: não encontrei o motor em ${raizMotor}. ` +
          `Defina RESEARCHHUB_DIR, ou corra sem --with-origin.`,
      );
    } else {
      const cacheLedger = new Map();
      for (const { ficheiro, dados } of regs) {
        for (const [id, entrada] of Object.entries(dados.rows ?? {})) {
          const caminhoLedger = path.join(raizMotor, 'content', entrada.rh_study, 'ledger.json');
          if (!cacheLedger.has(caminhoLedger)) {
            if (!fs.existsSync(caminhoLedger)) {
              cacheLedger.set(caminhoLedger, null);
            } else {
              const bruto = fs.readFileSync(caminhoLedger);
              const doc = JSON.parse(bruto.toString('utf8'));
              const mapa = new Map(doc.claims.map((c) => [c.id, c]));
              cacheLedger.set(caminhoLedger, { mapa, sha: sha256(bruto) });
            }
          }
          const led = cacheLedger.get(caminhoLedger);
          if (!led) {
            origem.ausentes.push(`${id}: ${entrada.rh_study}/ledger.json não existe no motor`);
            continue;
          }
          const linhaMotor = led.mapa.get(entrada.rh_id);
          if (!linhaMotor) {
            origem.ausentes.push(`${id}: o motor já não tem a linha "${entrada.rh_id}"`);
            continue;
          }
          origem.lidos++;
          if (canonicalSha(linhaMotor) !== entrada.origin_row_sha256) {
            origem.divergentes.push(
              `${id} ← ${entrada.rh_study}/${entrada.rh_id} (${ficheiro})`,
            );
          }
          if (led.sha !== entrada.rh_ledger_sha256 &&
              !origem.ficheiroMudou.includes(entrada.rh_study)) {
            origem.ficheiroMudou.push(entrada.rh_study);
          }
        }
      }
      if (origem.divergentes.length) {
        erros.push(
          `--with-origin: ${origem.divergentes.length} linha(s) já não são a linha do motor ` +
            `que atravessou:\n        ${origem.divergentes.join('\n        ')}\n` +
            `        Volte a cruzar: python3 publisher/export_site_rows.py --write`,
        );
      }
      for (const a of origem.ausentes) erros.push(`--with-origin: ${a}`);
      for (const s of origem.ficheiroMudou) {
        avisos.push(
          `o ledger.json de "${s}" já não é o que atravessou. Por si só isto não quer ` +
            `dizer nada: o ficheiro traz um "built_at" que muda a cada reconstrução. ` +
            `O que prende é o resumo de cada LINHA — se nenhuma foi nomeada acima, ` +
            `nenhuma mudou.`,
        );
      }
    }
  }

  console.log('');
  console.log(
    cinza(
      `  cruzamentos · ${total} linha(s) de origem externa em ${ficheiros} registo(s)` +
        (origem ? ` · ${origem.lidos} conferida(s) contra o motor` : ''),
    ),
  );
  for (const [estudo, n] of [...porEstudo].sort()) {
    console.log(cinza(`    ${estudo}: ${n}`));
  }

  if (avisos.length) {
    console.log('');
    console.log(amarelo(`  ${avisos.length} aviso(s):`));
    for (const a of avisos) console.log(cinza('    · ' + a));
  }

  if (erros.length) {
    console.log('');
    console.error(vermelho(`  A TRAVESSIA NÃO CONFERE — ${erros.length} erro(s):`));
    console.error('');
    for (const e of erros) console.error('    ' + vermelho('✗') + ' ' + e);
    console.error('');
    return 1;
  }

  console.log('');
  console.log(
    '  ' + verde('✓') +
      ' cada linha vinda do motor é, byte a byte, a que atravessou' +
      (origem ? ', e é ainda a linha que o motor tem.' : '.'),
  );
  console.log('');
  return 0;
}

/** O resumo da linha do motor: JSON canónico, chaves ordenadas, sem espaços. */
function canonicalSha(row) {
  return sha256(Buffer.from(jsonCanonico(row), 'utf8'));
}

function jsonCanonico(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(jsonCanonico).join(',') + ']';
  const chaves = Object.keys(v).sort();
  return '{' + chaves.map((k) => JSON.stringify(k) + ':' + jsonCanonico(v[k])).join(',') + '}';
}

process.exit(main(process.argv.slice(2)));
