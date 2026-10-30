/** DO3: seleção única de secções, com identidade e títulos presos à edição. */
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { registoDaEdicao, manifestoDosRegistos } from './registos.mjs';
import { pecasDoCorpo } from './registo-html.mjs';
import { linhaDoSitioDoEstudo } from './cruzamento.mjs';
import { t } from '../i18n/strings.mjs';
export const MOBILIA_DO_DOSSIE = {
  pt: {indice:'Neste dossiê', resto:'O resto do estudo: as contas em dois perímetros, as medidas, a dívida, os riscos e o que as afirmações deixam de fora →'},
  en: {indice:'In this dossier', resto:'The rest of the study: the accounts in two perimeters, the measures, the debt, the risks and what the statements leave out →'},
};
/** O id do HTML composto é a coordenada do bloco, conservada no recorte.
 * @param {any} registo @param {any[]} selecao @param {'pt'|'en'} lang */
export function blocosDoDossie(registo, selecao, lang) {
  const usados = new Set();
  return selecao.map(sec => {
    const i = Number(sec.id.replace(/^bloco-/, ''));
    const b = registo.blocks.find(b => b.i === i);
    if (!/^bloco-\d+$/.test(sec.id) || usados.has(i) || !b || b.kind !== 'heading' || b.level !== 2 || b.text !== sec[lang])
      throw new Error(`DO3: secção ausente, repetida ou com título diferente: ${sec.id}/${lang}`);
    usados.add(i);
    const fim = registo.blocks.find(b => b.i > i && b.kind === 'heading' && b.level <= 2)?.i ?? registo.blocks.length;
    return {...sec, titulo:b.text, blocos:registo.blocks.filter(b => b.i >= i && b.i < fim)};
  });
}
/** @param {any} d @param {'pt'|'en'} lang */
export function leituraDoDossie(d, lang) {
  const slug = d.pecas.estudos[0], chave = `${slug}/${lang}`;
  const registo = registoDaEdicao(slug, lang);
  const seccoes = blocosDoDossie(registo, d.leitura, lang);
  const fonte = parse(fs.readFileSync(`studies-src/${slug}/${lang}.html`, 'utf8'));
  const titulos = fonte.querySelectorAll('h2').map(n => n.textContent.trim());
  const registados = registo.blocks.filter(b => b.kind === 'heading' && b.level === 2).map(b => b.text);
  if (JSON.stringify(titulos) !== JSON.stringify(registados)) throw new Error(`DO3: títulos diferentes do studies-src: ${chave}`);
  const entrada = manifestoDosRegistos().registos[chave];
  const pecas = pecasDoCorpo({registo, chave, linhaDoSitio:linhaDoSitioDoEstudo(entrada.rh_study, entrada.rh_origens ?? {}), rotuloDaPorta:t(lang).estudos.textoPortaDaLinha});
  // Separar nas fronteiras dos h2 preserva os objetos dos selos, sem os reescrever.
  const porSeccao = new Map(); let atual;
  for (const p of pecas) {
    if (p.selo !== undefined) { if(atual) porSeccao.get(atual).push(p); continue; }
    for (const html of p.html.split(/(?=<h2 id="bloco-)/)) {
      const id = /^<h2 id="(bloco-\d+)"/.exec(html)?.[1];
      if(id) { atual=id; porSeccao.set(id, []); }
      if(atual) porSeccao.get(atual).push({html});
    }
  }
  return seccoes.map(sec => ({...sec, chave, pecas:porSeccao.get(sec.id)}));
}
