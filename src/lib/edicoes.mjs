/** ED1: as primeiras edições são documentos históricos, separados do texto atual. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'js-yaml';
import { STUDIES_SRC_DIR, comFaixa, comMarcasDaCasa, provaDosBytes } from './documentos.mjs';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function primeirasEdicoes() {
  return load(fs.readFileSync(path.join(STUDIES_SRC_DIR, 'manifest.yml'), 'utf8')).edicoes
    .filter(e => e.primeira_edicao).map(e => ({ slug: e.slug, lang: e.lang, ...e.primeira_edicao,
      ficheiro: path.join(STUDIES_SRC_DIR, e.primeira_edicao.file),
      rota: `${e.lang === 'pt' ? '/estudos' : '/en/studies'}/${e.slug}/${e.lang === 'pt' ? 'documento' : 'document'}/${e.primeira_edicao.date}` }));
}
export function primeiraEdicao(slug, lang) {
  return primeirasEdicoes().find(e => e.slug === slug && e.lang === lang) ?? null;
}
export function primeiraEdicaoServida(slug, lang, date) {
  const e = primeiraEdicao(slug, lang);
  if (!e || e.date !== date) throw new Error(`ED1: primeira edição desconhecida: ${slug}/${lang}/${date}`);
  const bytes = fs.readFileSync(e.ficheiro);
  if (sha256(bytes) !== e.sha256) throw new Error(`ED1: sha256 da primeira edição diverge: ${slug}/${lang}`);
  const bruto = bytes.toString('utf8');
  if (!Buffer.from(bruto).equals(bytes)) throw new Error('ED1: primeira edição não preserva UTF-8');
  const servido = comFaixa(comMarcasDaCasa(bruto, {slug, lang}), {slug, lang});
  const falha = provaDosBytes(bruto, servido);
  if (falha) throw new Error(`ED1: ${falha}`);
  return servido;
}
