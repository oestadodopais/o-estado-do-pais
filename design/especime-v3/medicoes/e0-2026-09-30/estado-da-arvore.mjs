/** Lê o formato porcelain sem cortar os espaços das duas colunas de estado. */
export function lerEstadoDaArvore(saida) {
  const pendentes = saida.split('\n').filter(Boolean);
  const codigoPorRegistar = pendentes.some(l => /\.(?:mjs|py|js|astro|ts|css)$/.test(l.slice(3)) ||
    !l.slice(3).startsWith('design/especime-v3/medicoes/e0-2026-09-30/') &&
    !l.slice(3).startsWith('design/especime-v3/capturas/e0-2026-09-30/'));
  return { pendentes, codigoPorRegistar };
}
