/** A edição de lançamento declarada tem a data da sua única versão. */
export function dataEdicaoUnica(entrada, manifesto) {
  if (entrada.origem !== 'edicao-unica') return null;
  const edicao = manifesto.edicoes.find(e => e.slug === entrada.slug && e.lang === entrada.lang);
  if (edicao?.edicoes?.length !== 1 || edicao.primeira_edicao || edicao.edicoes[0].natureza ||
      edicao.edicoes[0].file !== `${entrada.slug}/${entrada.lang}.html` ||
      edicao.edicoes[0].sha256 !== edicao.sha256_normalized)
    throw Error(`Data de edição única sem versão provada: ${entrada.slug}/${entrada.lang}`);
  return edicao.edicoes[0].data;
}
