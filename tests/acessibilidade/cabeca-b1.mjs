/** H3: cada página HTML tem exatamente um título principal. */
export function cabecaValida(html, _relativo) {
  return (html.match(/<h1[\s>]/g) ?? []).length === 1;
}
