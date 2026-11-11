/** Compara documentos e páginas dos estudos publicados nas duas línguas. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {compara, blocosDe, plantasParidade} from './paridade-numeros.mjs';

export const assinatura = r => ({total: Object.fromEntries(Object.entries(r.total).map(([k, v]) => [k, [...v].sort()])),
  blocos: r.blocos.map(b => ({i: b.i, soPt: [...b.soPt].sort(), soEn: [...b.soEn].sort()}))});
export function validarExcecoes(excecoes) {
  if (excecoes.data !== '2026-11-08' || excecoes.natureza !== 'permanente' || 'retirar' in excecoes ||
      typeof excecoes.razao !== 'string' || excecoes.razao.trim().length < 20) throw new Error('paridade: exceção sem data, natureza permanente ou razão');
  const permitidos = new Set(['a-casa-em-portugal-e-na-europa','evora-contas-da-camara-2010-2025','evora-2027-capital-europeia-da-cultura']);
  const chaves = excecoes.diferencas.map(e => e.estudo + '|' + e.tipo);
  if (new Set(chaves).size !== chaves.length || excecoes.diferencas.some(e => !permitidos.has(e.estudo) || !['documento', 'página'].includes(e.tipo))) throw new Error('paridade: exceção fora da lista fechada');
  for(const e of excecoes.diferencas.filter(e=>e.estudo==='evora-2027-capital-europeia-da-cultura')){
    if(e.data_fecho!=='2026-11-11'||typeof e.razao!=='string'||e.razao.length<20)throw Error('paridade: falta a origem julgada da diferença');
    for(const lang of ['pt','en'])if(e.documentos?.[lang]!==createHash('sha256').update(fs.readFileSync(`studies-src/${e.estudo}/${lang}.html`)).digest('hex'))throw Error('paridade: documento diferente do texto julgado');
  }
  return chaves;
}
export function conferirParidade(dist, excecoes) {
  const erros = [], medidas = [], usados = new Set();
  const chaves = validarExcecoes(excecoes);
  for (const s of fs.readdirSync(path.join(dist, 'estudos')).sort()) {
    const pt = path.join(dist, 'estudos', s), en = path.join(dist, 'en/studies', s);
    // Uma página de indisponibilidade não é uma edição inglesa publicada.
    if (!fs.existsSync(path.join(pt, 'documento/index.html')) || !fs.existsSync(path.join(en, 'document/index.html'))) continue;
    for (const [tipo, p, e] of [['documento', 'documento/index.html', 'document/index.html'], ['página', 'index.html', 'index.html']]) {
      const r = compara(blocosDe(fs.readFileSync(path.join(pt, p), 'utf8')), blocosDe(fs.readFileSync(path.join(en, e), 'utf8')));
      const numeros = assinatura(r), chave = s + '|' + tipo;
      const excecao = excecoes.diferencas.find(e => e.estudo === s && e.tipo === tipo);
      const difere = r.total.soPt.length || r.total.soEn.length || r.blocos.length;
      medidas.push({estudo:s, tipo, numeros, excecao: Boolean(excecao)});
      if (excecao) {
        usados.add(chave);
        if (!difere || JSON.stringify(numeros) !== JSON.stringify(excecao.numeros)) erros.push(`${chave}: diferença mudou; rever a exceção permanente da glosa`);
      } else if (difere) erros.push(`${chave}: diferença nova: ${JSON.stringify(numeros)}`);
    }
  }
  for (const chave of chaves) if (!usados.has(chave)) erros.push(`${chave}: exceção sem estudo bilingue publicado`);
  if (!medidas.length) erros.push('paridade: nenhum estudo bilingue medido');
  return {erros, medidas};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const r = conferirParidade(process.argv[2] ?? 'dist', JSON.parse(fs.readFileSync(new URL('./paridade-excecoes.json', import.meta.url), 'utf8')));
    console.log(`paridade: ${r.medidas.length} documentos e páginas; ${r.medidas.filter(m => m.excecao).length} exceções exatas, permanentes, com data e razão; plantas ${plantasParidade.filter(Boolean).length}/${plantasParidade.length}; recusas ${r.erros.length}`);
    for (const e of r.erros) console.error(e);
    process.exitCode = r.erros.length ? 1 : 0;
  } catch { console.error('paridade: dist ou exceções ilegíveis'); process.exitCode = 1; }
}
