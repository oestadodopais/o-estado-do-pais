#!/usr/bin/env node
/** As medições da I129, contadas no `dist/` construído e no livro-razão.
 *  Nenhum número deste relatório se escreve de cabeça: sai daqui.
 *  Uso: node design/especime-v3/medicoes/i129-2026-09-22/medir-i129.mjs */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';

const RAIZ = process.cwd();
const DIST = path.resolve(process.env.OEDP_DIST ?? 'dist');
const normal = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const le = (rel) => parse(fs.readFileSync(path.join(DIST, rel, 'index.html'), 'utf8'));
const linha = (id) => load(fs.readFileSync(path.join(RAIZ, 'ledger/claims', `${id}.yml`), 'utf8'));

const saida = { linhas: {}, definicao: {}, mudanca: {}, recibo: {}, k13: {} };

/* 1 · As três linhas. */
for (const id of ['jovens-nem-2024', 'jovens-nem-2025', 'jovens-nem-2025-ue']) {
  const c = linha(id);
  saida.linhas[id] = {
    value: c.value, unit: c.unit, reference_date: c.reference_date,
    source_url: c.source_url, document_title: c.document.title,
    excerpt: c.excerpt,
    etiqueta_da_idade: (c.excerpt.match(/Age class: [^—]+/) ?? ['(nenhuma)'])[0].trim(),
    note_acaba_em: c.note.slice(-120),
    verificacoes: (c.verifications ?? []).length,
    correccoes: (c.corrections ?? []).length,
  };
}

/* 2 · A definição rendida, nas duas edições, lida do cartão. */
for (const [lang, rota] of [['pt', 'temas'], ['en', 'en/themes']]) {
  const doc = le(rota);
  const el = doc.querySelector('[data-cartao-definicao="jovens-nem-2025"]');
  saida.definicao[lang] = normal(el?.textContent) || '(não rendida)';
}

/* 3 · A mudança declarada, rendida na página do país. */
for (const [lang, rota] of [['pt', ''], ['en', 'en']]) {
  const doc = le(rota);
  const el = doc.querySelector('[data-mudanca-id="grupo-etario-jovens-nem-2026-09-22"]');
  saida.mudanca[lang] = {
    data: normal(el?.querySelector('[data-mudanca-campo="data"]')?.textContent),
    texto: normal(el?.querySelector('[data-mudanca-campo="texto"]')?.textContent),
  };
}

/* 4 · O recibo: o excerto novo e o título do Eurostat, lado a lado. */
for (const [lang, rota] of [['pt', 'livro-razao/jovens-nem-2025'], ['en', 'en/ledger/jovens-nem-2025']]) {
  const texto = normal(le(rota).textContent);
  saida.recibo[lang] = {
    tem_etiqueta_da_idade: texto.includes('Age class: From 15 to 29 years'),
    tem_titulo_do_eurostat: texto.includes('Young persons (aged 15-24) neither in employment'),
  };
}

/* 5 · A K13: quantas medidas e quais faltam. */
const { DEFINICOES_DAS_MEDIDAS, textoDaDefinicao } = await import(path.join(RAIZ, 'src/data/figuras.mjs'));
const comGrupo = [];
for (const id of Object.keys(DEFINICOES_DAS_MEDIDAS)) {
  const p = path.join(RAIZ, 'ledger/claims', `${id}.yml`);
  if (!fs.existsSync(p)) continue;
  const c = load(fs.readFileSync(p, 'utf8'));
  const ex = typeof c.excerpt === 'string' ? c.excerpt : '';
  const su = typeof c.source_url === 'string' ? c.source_url : '';
  const a = ex.match(/Age class: From (\d+) to (\d+) years/);
  const b = su.match(/[?&]age=Y?(\d+)-(\d+)/);
  if (!a && !b) continue;
  const lim = a ? [a[1], a[2]] : [b[1], b[2]];
  const escreve = ['pt', 'en'].every((lang) =>
    lim.every((n) => new RegExp(`(^|[^0-9])${n}([^0-9]|$)`).test(
      textoDaDefinicao(DEFINICOES_DAS_MEDIDAS[id][lang]))));
  comGrupo.push({ id, limites: lim.join('-'), onde: a ? 'excerto' : 'source_url', escreve });
}
saida.k13 = { medidas: comGrupo.length, passam: comGrupo.filter(m => m.escreve).length, detalhe: comGrupo };

console.log(JSON.stringify(saida, null, 2));
