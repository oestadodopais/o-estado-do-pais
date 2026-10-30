/** DO3: seleção única de secções, com identidade e títulos presos à edição. */
import fs from 'node:fs';
import { WORKS } from '../data/studies.mjs';
import { fichaDoEstudo } from './estudos-b1.mjs';
import { registoDoHtml } from './eyetext.mjs';
import { registoDaEdicao, manifestoDosRegistos } from './registos.mjs';
import { pecasDoCorpo } from './registo-html.mjs';
import { linhaDoSitioDoEstudo } from './cruzamento.mjs';
import { t } from '../i18n/strings.mjs';
export const MOBILIA_DO_DOSSIE = {
  pt: {doEstudo:'Do estudo:', indice:'Neste dossiê', resto:'O resto do estudo: as contas em dois perímetros, as medidas, a dívida, os riscos e o que as afirmações deixam de fora →'},
  en: {doEstudo:'From the study:', indice:'In this dossier', resto:'The rest of the study: the accounts in two perimeters, the measures, the debt, the risks and what the statements leave out →'},
};
/** @param {any} d @param {'pt'|'en'} lang */
export function estudoDoDossie(d,lang) {
  const w=WORKS.find(w=>w.slug===d.pecas.estudos[0]);
  if(!w)throw new Error('DO3: estudo ausente do dossiê');
  return fichaDoEstudo(w,lang);
}
/** O id do HTML composto é a coordenada do bloco, conservada no recorte.
 * @param {RegistoDeConteudo} registo @param {any[]} selecao @param {'pt'|'en'} lang */
export function blocosDoDossie(registo, selecao, lang) {
  const usados = new Set();
  return selecao.map(sec => {
    const i = Number(sec.id.replace(/^bloco-/, ''));
    const b = registo.blocks.find(b => b.i === i);
    if (!/^bloco-\d+$/.test(sec.id) || usados.has(i) || !b || b.kind !== 'heading' || b.level !== 2 || b.text !== sec[lang])
      throw new Error(`DO3: secção ausente, repetida ou com título diferente: ${sec.id}/${lang}`);
    usados.add(i);
    const fim = registo.blocks.find(b => b.i > i && b.kind === 'heading' && Number(b.level) <= 2)?.i ?? registo.blocks.length;
    return {...sec, titulo:b.text, blocos:registo.blocks.filter(b => b.i >= i && b.i < fim)};
  });
}
/** @param {any} d @param {'pt'|'en'} lang */
export function leituraDoDossie(d, lang) {
  const slug = d.pecas.estudos[0], chave = `${slug}/${lang}`;
  const registo = registoDaEdicao(slug, lang);
  if(!registo)throw new Error(`DO3: registo ausente: ${chave}`);
  const seccoes = blocosDoDossie(registo, d.leitura, lang);
  const fonte = registoDoHtml(fs.readFileSync(`studies-src/${slug}/${lang}.html`, 'utf8'));
  for (const sec of seccoes) for (const bloco of sec.blocos) {
    const original = fonte[bloco.i];
    /** @param {any} b */
    const campos = b => b.kind === 'table' ? {kind:b.kind, rows:b.rows.map((/** @type {any[]} */ r)=>r.map((/** @type {any} */ c)=>({text:c.text,header:Boolean(c.header)})))}
      : b.kind === 'list' ? {kind:b.kind, ordered:b.ordered, items:b.items.map((/** @type {any} */ i)=>({text:i.text}))}
      : b.kind === 'heading' ? {kind:b.kind, level:b.level, text:b.text}
      : b.kind === 'paragraph' ? {kind:b.kind,text:b.text} : {kind:b.kind};
    if (!original || JSON.stringify(campos(original)) !== JSON.stringify(campos(bloco)))
      throw new Error(`DO3: bloco diferente do studies-src: ${chave}#${bloco.i}`);
  }
  const entrada = /** @type {{rh_study:string,rh_origens?:Record<string,string>}} */ (manifestoDosRegistos().registos[chave]);
  const pecas = pecasDoCorpo({registo, chave, linhaDoSitio:linhaDoSitioDoEstudo(entrada.rh_study, entrada.rh_origens ?? {}), rotuloDaPorta:t(lang).estudos.textoPortaDaLinha});
  // Separar nas fronteiras dos h2 preserva os objetos dos selos, sem os reescrever.
  const porSeccao = new Map(); let atual;
  for (const p of pecas) {
    if ('selo' in p) { if(atual) porSeccao.get(atual).push(p); continue; }
    for (const html of p.html.split(/(?=<h2 id="bloco-)/)) {
      const id = /^<h2 id="(bloco-\d+)"/.exec(html)?.[1];
      if(id) { atual=id; porSeccao.set(id, []); }
      if(atual) porSeccao.get(atual).push({html});
    }
  }
  return seccoes.map(sec => ({...sec, chave, pecas:porSeccao.get(sec.id).map((/** @type {any} */ p)=>'html' in p ? {html:String(p.html).replace(/<(\/?)h([2-5])\b/g,(_,fim,n)=>`<${fim}h${Number(n)+1}`)} : p)}));
}
