/** Um evento sem linhas vivas, sustentado apenas por documentos retirados, sai da agenda pública.
 * @param {any} evento @param {any} agenda @param {any[]} works
 */
export function eventoDeEstudosRetirados(evento, agenda, works) {
  if (evento.afecta_linhas?.length) return false;
  const criterios = (agenda?.itens ?? []).flatMap(i => i.criterios ?? []).filter(c => c.evento === evento.id);
  const documentos = criterios.flatMap(c => c.documentos ?? []);
  return documentos.length > 0 && documentos.every(d => works.some(w => w.slug === d.slug && w.estado === 'retirado'));
}
