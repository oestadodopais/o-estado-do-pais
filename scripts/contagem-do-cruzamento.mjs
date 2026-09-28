/** A contagem da travessia conserva-se; a última edição local pode acrescentar entradas. */
export function correcoesNoRegisto(entrada) {
  const ultima = entrada.site_corrections?.at(-1);
  return Number(ultima?.sha256_depois === entrada.exported_row_sha256 && Number.isInteger(ultima.corrections_after)
    ? ultima.corrections_after : entrada.corrections_at_export ?? 0);
}
