/** RP4-n: a marca de uma afirmação por confirmar fecha a página de leitor. */
export function conferirSemMarcadores(raiz) {
  const texto = (n) => {
    if (['SCRIPT', 'STYLE'].includes(n.tagName)) return '';
    if (n.nodeType === 3) return n.textContent;
    return (n.childNodes ?? []).map(texto).join('');
  };
  if (raiz.querySelector('.marcador, [data-por-confirmar-na-fonte]') || /\[\s*(?:a\s+verificar|to\s+verify)\s*\]/iu.test(texto(raiz))) {
    return 'RP4N: uma página de leitor contém uma marca de informação por confirmar';
  }
  return null;
}
