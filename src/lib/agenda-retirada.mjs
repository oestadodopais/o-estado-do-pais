/** Um evento sem linhas vivas, sustentado apenas por documentos retirados, sai da agenda pública.
 * @param {{id: string, afecta_linhas?: unknown}} evento
 * @param {{itens?: {criterios?: unknown}[]}|null} agenda
 * @param {{slug: string, estado?: string}[]} works
 */
export function eventoDeEstudosRetirados(evento, agenda, works) {
  if (Array.isArray(evento.afecta_linhas) && evento.afecta_linhas.length) return false;
  const criterios = (agenda?.itens ?? []).flatMap(i => Array.isArray(i.criterios) ? i.criterios : []).filter(c => c.evento === evento.id);
  const documentos = criterios.flatMap(c => c.documentos ?? []);
  return documentos.length > 0 && documentos.every(d => works.some(w => w.slug === d.slug && w.estado === 'retirado'));
}
