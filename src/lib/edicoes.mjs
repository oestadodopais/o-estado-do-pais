/** ED1: as primeiras edições são documentos históricos, separados do texto atual. */
import fs from 'node:fs';
import {marcarLeisDaEdicao,provaDosBytesDaEdicao} from './leis-da-edicao.mjs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'js-yaml';
import { STUDIES_SRC_DIR, comFaixa, comMarcasDaCasa } from './documentos.mjs';
/** @param {Buffer|string} bytes */
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function primeirasEdicoes() {
  const raiz = STUDIES_SRC_DIR;
  if (!raiz) throw new Error('ED1: pasta dos estudos ausente');
  const manifesto = /** @type {{edicoes: {slug:string, lang:Lingua, primeira_edicao?:{file:string,sha256:string,date:string,commit:string}}[]}} */ (load(fs.readFileSync(path.join(raiz, 'manifest.yml'), 'utf8')));
  return manifesto.edicoes
    .filter(e => e.primeira_edicao).map(e => {
      const p = e.primeira_edicao;
      if (!p) throw new Error("ED1: primeira edição ausente");
      return { slug: e.slug, lang: e.lang, ...p,
      ficheiro: path.join(raiz, p.file),
      rota: `${e.lang === 'pt' ? '/estudos' : '/en/studies'}/${e.slug}/${e.lang === 'pt' ? 'documento' : 'document'}/${p.date}` }; });
}
/** @param {string} slug @param {string} lang */
export function primeiraEdicao(slug, lang) {
  return primeirasEdicoes().find(e => e.slug === slug && e.lang === lang) ?? null;
}
/** @param {string} slug @param {Lingua} lang @param {string} date */
export function primeiraEdicaoServida(slug, lang, date) {
  const e = primeiraEdicao(slug, lang);
  if (!e || e.date !== date) throw new Error(`ED1: primeira edição desconhecida: ${slug}/${lang}/${date}`);
  const bytes = fs.readFileSync(e.ficheiro);
  if (sha256(bytes) !== e.sha256) throw new Error(`ED1: sha256 da primeira edição diverge: ${slug}/${lang}`);
  const bruto = bytes.toString('utf8');
  if (!Buffer.from(bruto).equals(bytes)) throw new Error('ED1: primeira edição não preserva UTF-8');
  const servido = marcarLeisDaEdicao(comFaixa(comMarcasDaCasa(bruto, {slug, lang}), {slug, lang}),lang);
  const falha = provaDosBytesDaEdicao(bruto, servido, lang);
  if (falha) throw new Error(`ED1: ${falha}`);
  return servido;
}
