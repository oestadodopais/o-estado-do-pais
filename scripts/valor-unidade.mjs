/** I143 e I158: o espaço do desenho também existe no texto que se copia e ouve. */
export function conferirValorUnidade(root) {
  const erros = [];
  const contas = { titulos: 0, cartoes: 0 };
  for (const el of root.querySelectorAll('h1.linha-valor, .cartao-medida-quantidade')) {
    const valor = el.querySelector('[data-claim]');
    const unidade = el.querySelector('[data-linha-campo="unit"]');
    if (!valor || !unidade) continue;
    const tipo = el.tagName === 'H1' ? 'titulos' : 'cartoes';
    contas[tipo]++;
    const texto = el.textContent;
    const inicio = texto.indexOf(valor.textContent);
    const fim = inicio + valor.textContent.length;
    const inicioUnidade = texto.indexOf(unidade.textContent, fim);
    if (inicio < 0 || inicioUnidade < 0 || !/\s/.test(texto.slice(fim, inicioUnidade))) {
      erros.push(`I143/I158: ${tipo === 'titulos' ? 'o título' : 'o cartão'} cola o valor à unidade (${valor.getAttribute('data-claim')})`);
    }
  }
  return { contas, erros };
}
