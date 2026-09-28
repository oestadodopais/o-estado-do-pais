// O ensaio a seco dos cinco blocos (M31): rende cada frase, peça, legenda e título nas duas edições,
// com os valores das linhas da árvore principal, e avalia as condições. Não é o resolvedor do
// construtor: é a testemunha independente contra ele.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// uso: node design/observatorio/leituras/ensaio-blocos-primeira-pagina.mjs [raiz do sítio] [declarações]
const RAIZ = process.argv[2] || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DECL = process.argv[3] || path.join(RAIZ, 'design/observatorio/leituras/BLOCOS-primeira-pagina-2026-09-28.mjs');
const { getClaim, parsePtNumber } = await import(path.join(RAIZ, 'src/lib/ledger.mjs'));
const { dataDaCasa } = await import(path.join(RAIZ, 'src/lib/datas.mjs'));
const { t } = await import(path.join(RAIZ, 'src/i18n/strings.mjs'));
const { BLOCOS_DA_PRIMEIRA_PAGINA: B, ENTRADAS } = await import(DECL);
const refs = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/enquadramento/referencias.json'), 'utf8'));
const limiar = (id) => { const x = refs.indicadores.find((r) => r.id_da_linha === id); if (!x?.limiar) throw new Error(`sem limiar: ${id}`); return x.limiar.replace(/[%+]/g, ''); };
const num = (id) => parsePtNumber(getClaim(id).value);
let problemas = 0;
function render(partes, lang) {
  return partes.map((p) => {
    if (typeof p === 'string') return p;
    if ('claim' in p) { const c = getClaim(p.claim); return `${c.value}${p.sufixo ?? ''}${c.source_flag === 'p' ? ' (' + t(lang).prov.dadoProvisorio + ')' : ''}`; }
    if ('periodo' in p) return dataDaCasa(getClaim(p.periodo).reference_date, lang);
    if ('publicado' in p) return dataDaCasa(getClaim(p.publicado).published_at, lang);
    if ('referencia' in p) return limiar(p.referencia);
    if ('compara' in p) { const [a, b] = p.compara.map(num); const ramo = a < b ? p.menor : a > b ? p.maior : p.igual; return render(ramo, lang); }
    throw new Error('pedaço desconhecido ' + JSON.stringify(p));
  }).join('');
}
function avaliar(c) {
  if (c.mesmo_periodo) { const ps = new Set(c.mesmo_periodo.map((i) => getClaim(i).reference_date)); return ps.size === 1; }
  if ('mes' in c) return Number(getClaim(c.periodo).reference_date.slice(5, 7)) === c.mes;
  const a = num(c.a);
  const b = 'b' in c ? num(c.b) : 'valor' in c ? c.valor : parsePtNumber(limiar(c.referencia));
  return { '>': a > b, '<': a < b, '=': a === b, '!=': a !== b }[c.op];
}
function conferir(txt, onde) {
  const avisos = [];
  if (/\u2014|\u2013/.test(txt)) avisos.push('travessão');
  if (/  /.test(txt)) avisos.push('dois espaços');
  if (/ [,.;:]/.test(txt)) avisos.push('espaço antes da pontuação');
  if (/\.\./.test(txt)) avisos.push('dois pontos finais');
  if (avisos.length) { problemas++; console.log(`   !! ${onde}: ${avisos.join(', ')}`); }
}
for (const b of B) {
  const conds = b.condicao.map(avaliar);
  console.log(`\n## ${b.id}  condições ${conds.filter(Boolean).length}/${conds.length}${conds.every(Boolean) ? '' : '  FALHA'}`);
  for (const lang of ['pt', 'en']) {
    const tit = b.titulo[lang]; const fr = render(b.frase[lang], lang);
    console.log(` [${lang}] ${tit}\n       ${fr}`); conferir(fr, `${b.id}/${lang}/frase`);
    if (b.desenho.legenda) { const l = render(b.desenho.legenda[lang], lang); console.log(`       legenda: ${l}`); conferir(l, `${b.id}/${lang}/legenda`); }
    for (const p of b.pecas) {
      const ok = p.condicao.map(avaliar).every(Boolean);
      const txt = render(p[lang], lang);
      console.log(`       peça ${p.id}${ok ? '' : ' (SAI)'}${p.titulo ? ' «' + p.titulo[lang] + '»' : ''}: ${txt}`); conferir(txt, `${b.id}/${lang}/${p.id}`);
    }
    console.log(`       ressalva: ${b.ressalva[lang]}`); conferir(b.ressalva[lang], `${b.id}/${lang}/ressalva`);
  }
}
// as linhas mais recentes, para a data de «O que se passa»
const usadas = new Set();
const junta = (x) => { if (Array.isArray(x)) x.forEach(junta); else if (x && typeof x === 'object') { for (const k of ['claim', 'periodo', 'publicado', 'a', 'b', 'pt', 'ue', 'total']) if (typeof x[k] === 'string' && /-/.test(x[k])) usadas.add(x[k]); for (const v of Object.values(x)) if (typeof v === 'object') junta(v); } };
junta(B.map((b) => [b.frase, b.desenho, b.pecas.filter((p) => p.condicao.map(avaliar).every(Boolean))]));
const pub = [...usadas].map((i) => getClaim(i)?.published_at).filter(Boolean).sort();
console.log(`\nlinhas mostradas ${usadas.size}; published_at mais recente ${pub.at(-1)} → pt «${dataDaCasa(pub.at(-1), 'pt')}» en «${dataDaCasa(pub.at(-1), 'en')}»; sem published_at: ${[...usadas].filter((i) => !getClaim(i)?.published_at).length}`);
console.log(`entradas ${ENTRADAS.length}; problemas de escrita ${problemas}`);
