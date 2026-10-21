import fs from 'node:fs';
import {createHash} from 'node:crypto';

const bytes = fs.readFileSync(new URL('../ledger/provas/eo1/provas.json', import.meta.url));
const registo = JSON.parse(fs.readFileSync(new URL('../ledger/cruzamentos/eo1-provas.json', import.meta.url), 'utf8'));
const provas = JSON.parse(bytes.toString('utf8')).rows;
const data = periodo => String(periodo).split('/').sort().at(-1);
const estudo = 'orcamento-2027-o-que-muda-e-para-quem';

/** O ficheiro de prova é o que atravessou do motor, pelos dois resumos do registo. */
export function selagemProvasEo1Confere(corpo, travessia) {
  const p = travessia?.files?.['provas.json'];
  const sha = createHash('sha256').update(corpo).digest('hex');
  return Boolean(p && travessia.origin === 'ResearchHub' &&
    p.destino === 'ledger/provas/eo1' && p.origin_path === 'publisher/recortes/eo1/provas.json' &&
    p.exporter === 'publisher/export_site_rows.py' && p.origin_sha256 === sha && p.exported_sha256 === sha);
}
const seladas = selagemProvasEo1Confere(bytes, registo);
export const temProvaEo1 = id => Object.hasOwn(provas, id);

/** Todas as linhas conferem nome bilingue e período; documentos conferem ainda excerto e recibo do corpo. */
export function localizadorEo1Confere(onde, linha) {
  const p = provas[linha?.id], d = linha?.document;
  if (!seladas || !p || linha.study !== estudo || !linha.name || !linha.name_en || linha.name !== p.name || linha.name_en !== p.name_en ||
      onde !== p.name_source || linha.reference_date !== (p.publication ? p.published_at : data(p.period))) return false;
  if (!p.document) return !d && Boolean(linha.derivation) && linha.check === p.derivation?.formula &&
    JSON.stringify(linha.derived_from) === JSON.stringify(p.derivation?.components);
  return Boolean(d && d.locator === p.document.locator && d.page === p.document.page &&
    /^[a-f0-9]{64}$/.test(d.source_sha256) && d.source_sha256 === p.document.source_sha256 &&
    d.source_sha256 === p.receipt?.sha256 && d.title === p.document.title && linha.excerpt === p.excerpt);
}
