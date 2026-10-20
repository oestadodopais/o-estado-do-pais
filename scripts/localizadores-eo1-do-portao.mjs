import fs from 'node:fs';

const provas = JSON.parse(fs.readFileSync(new URL('../ledger/provas/eo1/provas.json', import.meta.url), 'utf8')).rows;
const paginas = { '2-3': 41, '3-1': 54, '3-2': 59, '3-3': 61, '3-6': 65, '4-1': 68 };

/** Confere as coordenadas, o rótulo literal e o recibo, sem importar o gerador. */
export function localizadorEo1Confere(onde, linha) {
  const p = provas[linha?.id], d = linha?.document;
  if (!p || !d || d.locator !== p.document.locator || d.page !== p.document.page ||
      d.source_sha256 !== p.document.source_sha256 || d.source_sha256 !== p.receipt?.sha256 ||
      d.title !== p.document.title || linha.reference_date !== String(p.period).split('/')[0] ||
      linha.excerpt !== p.excerpt || !p.excerpt.includes(linha.name)) return false;
  const q = /^pm-q(\d-\d)-r\d+-c(\d+)$/.exec(linha.id);
  if (q) return onde === d.locator && d.page === paginas[q[1]] &&
    onde.startsWith(`Quadro ${q[1].replace('-', '.')}. `) &&
    onde.includes(`; ${linha.name}; coluna ${Number(q[2]) + 1}: `);
  if (/^irs-escalao-[1-9]-taxa-normal$/.test(linha.id))
    return d.page === 75 && linha.reference_date === '2027' &&
      onde === `Artigo 68.º; ${linha.name}; coluna 1: Normal (A), taxa em percentagem, 2027 proposta; p. 75 PDF (75 impressa)`;
  const ce = {
    'ce-primavera-2026-pib-2027': ['GDP', 9, '2027'],
    'ce-primavera-2026-saldo-2027': ['General government balance (c)', 7, '2027'],
    'ce-primavera-2026-divida-2026': ['General government gross debt (c)', 6, '2026'],
    'ce-primavera-2026-divida-2027': ['General government gross debt (c)', 7, '2027'],
  }[linha.id];
  if (ce) return linha.name === ce[0] && d.page === 143 && linha.reference_date === ce[2] &&
    onde === `Table III.18.1: Main features of country forecast - PORTUGAL; ${ce[0]}; coluna ${ce[1]}: ${ce[2]}; p. 143 PDF (127 impressa); rótulo da linha`;
  return linha.id === 'pm-grafico-3-5-poenmp-2027' && linha.name === 'POENMP' &&
    d.page === 65 && onde === 'Gráfico 3.5; série POENMP; 2027; p.65 PDF (49 impressa)';
}
