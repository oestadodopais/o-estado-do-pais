/** I143 e I158: o espaço do desenho também existe no texto que se copia e ouve. */
export function conferirValorUnidade(root) {
  const erros = [];
  const contas = { titulos: 0, cartoes: 0 };
  const declarados = root.querySelectorAll('[data-cartao-medida]');
  if (declarados.some(c => c.querySelectorAll('.cartao-medida-quantidade').length !== 1)) erros.push('I143/I158: o seletor não conferiu todos os cartões declarados');
  for (const el of root.querySelectorAll('h1.linha-valor, .cartao-medida-quantidade')) {
    /* A contagem das câmaras vem da prova V2, que a confere separadamente. */
    const contagem = el.querySelector('[data-prova="camaras_acima_do_limite"]');
    const valor = el.querySelector('[data-claim]') ?? contagem;
    /* K2-c (02.10.2026): a unidade é o campo da linha ou, onde a definição declarada a traz, a unidade da casa; o
       espaço entre o número e a unidade exige-se nas duas (§1.135). */
    const unidade = el.querySelector('[data-linha-campo="unit"]') ?? el.querySelector('[data-unidade-da-casa]') ?? (contagem ? el.querySelector('.cartao-medida-unidade') : null);
    const tipo = el.tagName === 'H1' ? 'titulos' : 'cartoes';
    contas[tipo]++;
    const marca = el.querySelector('.cartao-medida-marca');
    if (marca) {
      if (valor || unidade) erros.push('I143/I158: uma marca sem valor publicado traz valor ou unidade');
      continue;
    }
    if (!valor || !unidade) {
      erros.push('I143/I158: faltam o valor ou a unidade na quantidade');
      continue;
    }
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
