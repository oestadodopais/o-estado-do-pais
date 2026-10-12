/** JD1-b: o quadro transcrito conserva todas as palavras, por ordem, e ganha células. */
/** @param {string} texto */
const normalizar = texto => texto.replace(/\s+/g, ' ').trim();

/** @param {string} excerto */
export function quadroFinanciamentoJd1(excerto) {
  if (typeof excerto !== 'string') throw new Error('JD1: falta o excerto do financiamento.');
  const linhas = excerto.trim().split(/\r?\n/).map(linha => linha.trim().split(/\s{2,}/));
  if (linhas.length !== 11 || linhas.some(linha => linha.length !== 3)) {
    throw new Error('JD1: o quadro do financiamento não tem o cabeçalho e as dez linhas de três colunas.');
  }
  const [cabecalho, ...corpo] = linhas;
  if (cabecalho[1] !== '2024' || cabecalho[2] !== '2025') throw new Error('JD1: os anos do quadro do financiamento mudaram.');
  if (normalizar(linhas.flat().join(' ')) !== normalizar(excerto)) throw new Error('JD1: as células alteraram o texto transcrito.');
  const dados = corpo.map(celulas => ({
    celulas,
    destaque: celulas[0].startsWith('2. AMORTIZAÇÕES E ANULAÇÕES ') ? 'parcela'
      : celulas[0].startsWith('3. NECESSIDADES BRUTAS DE FINANCIAMENTO ') ? 'total' : null,
    grupo: /^[123]\. /.test(celulas[0]),
  }));
  if (dados.filter(linha => linha.destaque === 'parcela').length !== 1 || dados.filter(linha => linha.destaque === 'total').length !== 1) {
    throw new Error('JD1: falta a parcela ou o total do financiamento no quadro.');
  }
  return { cabecalho, linhas: dados };
}
