import fs from 'node:fs';

const provas = JSON.parse(fs.readFileSync(new URL('../ledger/provas/eo1/provas.json', import.meta.url), 'utf8')).rows;
const data = periodo => String(periodo).split('/').sort().at(-1);

/** Todas as linhas conferem nome bilingue e período; documentos conferem ainda corpo e coordenadas. */
export function localizadorEo1Confere(onde, linha) {
  const p = provas[linha?.id], d = linha?.document;
  if (!p || !linha.name || !linha.name_en || linha.name !== p.name || linha.name_en !== p.name_en ||
      onde !== p.name_source || linha.reference_date !== (p.publication ? p.published_at : data(p.period))) return false;
  if (!p.document) return !d && Boolean(linha.derivation);
  return Boolean(d && d.locator === p.document.locator && d.page === p.document.page &&
    d.source_sha256 === p.document.source_sha256 && d.source_sha256 === p.receipt?.sha256 &&
    d.title === p.document.title && linha.excerpt === p.excerpt);
}
