/**
 * A leitura repetida segue a página citada hoje no mesmo documento.
 * O caminho histórico e as portas para outros documentos ficam intactos.
 * @param {{source_url?: string | null, document?: {page?: number}}} linha
 * @param {{path?: string}} verificacao
 */
export function portaDaReleitura(linha, verificacao) {
  const anterior = verificacao.path;
  const atual = linha.source_url;
  const pagina = linha.document?.page;
  if (!anterior || !atual || typeof pagina !== 'number' || !Number.isInteger(pagina) || pagina < 1) return anterior;
  if (!/#page=\d+$/.test(anterior) || anterior.split('#')[0] !== atual.split('#')[0]) return anterior;
  return `${anterior.split('#')[0]}#page=${pagina}`;
}
