import { provenienciaIncompleta } from '../../src/lib/ledger.mjs';

/** Higiene b, 13.10.2026: confere a ausência sem chamar o compositor da descrição. */
export function conferirAusenciaNosMetadados(raiz, linha, lang) {
  if (!provenienciaIncompleta(linha)) return [];
  const oracao = lang === 'en'
    ? 'provenance fields unconfirmed at the source'
    : 'campos da proveniência por confirmar na fonte';
  const erros = [];
  for (const seletor of ['meta[name="description"]', 'meta[property="og:description"]']) {
    const conteudo = raiz.querySelector(seletor)?.getAttribute('content') ?? '';
    if (!conteudo.toLowerCase().includes(oracao)) {
      erros.push(`HIG-5: ${seletor} omite a oração dos campos da proveniência por confirmar (${lang})`);
    }
  }
  return erros;
}
