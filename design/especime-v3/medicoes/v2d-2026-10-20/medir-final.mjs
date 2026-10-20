/** Inventário reproduzível das frases resolvidas e das portas dos recibos. */
import fs from 'node:fs';
import { itensResolvidos } from '../../../../src/lib/discussao.mjs';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
import { textoDosPedacosDaExplicacao } from '../../../../src/lib/explicacoes.mjs';
const pasta = new URL('./', import.meta.url);
const linhas = loadClaims();
const novos = new Set(Object.keys(JSON.parse(fs.readFileSync('ledger/cruzamentos/v2d.json', 'utf8')).rows));
const edicoes = Object.fromEntries(['pt', 'en'].map(lang => [lang, itensResolvidos(lang).map(e => ({
  slug: e.slug, titulo: e.tituloTexto, linhas: e.linhas,
  seccoes: e.seccoes.map(s => ({id: s.id, titulo: s.titulo,
    paragrafos: s.blocos.filter(b => b.tipo === 'paragrafo').map(b => textoDosPedacosDaExplicacao(b.pedacos, lang))})),
}))]));
const ids = [...new Set(edicoes.pt.flatMap(e => e.linhas))].sort();
const portas = ids.filter(id => novos.has(id));
const result = {edicoes, inventario: ids.map(id => ({id, value: linhas.get(id).value,
  reference_date: linhas.get(id).reference_date})),
  portas: {linhas_com_porta: ids.length, linhas_novas_com_porta: portas.length, novas: portas}};
fs.writeFileSync(new URL('frases-e-portas.json', pasta), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({linhas: ids.length, novas_com_porta: portas.length}));
