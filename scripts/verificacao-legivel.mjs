/** C1: ausência de segunda leitura e porta da atualização, lidas do registo. */
export function conferirVerificacaoLegivel(root, linha, lang) {
  const erros = [];
  const n = v => Number(String(v).replace(/[\s\u202f]/g, '').replace('−', '-').replace(',', '.'));
  const vazio = root.querySelectorAll('[data-sem-segunda-leitura]');
  const sem = lang === 'en' ? 'No second reading yet.' : 'Ainda sem segunda leitura.';
  const tem = (linha.verifications ?? []).length > 0;
  if (tem ? vazio.length !== 0 : vazio.length !== 1 || vazio[0]?.textContent !== sem) {
    erros.push('C1: a ausência de segunda leitura não corresponde ao registo');
  }
  for (const el of root.querySelectorAll('[data-linha-verificacao]')) {
    const v = linha.verifications?.[Number(el.getAttribute('data-linha-verificacao'))];
    if (!v) { erros.push('C1: segunda leitura sem entrada no registo'); continue; }
    const atualizacao = v.result === 'diverge' ? (linha.corrections ?? []).findIndex(c =>
      c.kind === 'atualizacao' && c.date >= v.date && n(c.new_value) === n(v.found)) : -1;
    const portas = el.querySelectorAll('[data-atualizacao-da-releitura]');
    if (atualizacao < 0 ? portas.length !== 0 : portas.length !== 1 || portas[0]?.getAttribute('href') !== `#alteracao-${atualizacao}`) {
      erros.push('C1: a segunda leitura não aponta para a atualização do valor encontrado');
    }
    if (atualizacao >= 0 && !root.querySelector(`#alteracao-${atualizacao}`)) erros.push('C1: atualização sem destino na história');
    const esperado = v.by === 'corredor-diario'
      ? (lang === 'en' ? 'Source file read again on' : 'Ficheiro da fonte relido a')
      : (lang === 'en' ? 'Second reading on' : 'Segunda leitura a');
    if (el.previousElementSibling?.textContent !== esperado) erros.push('C1: o recibo não distingue a leitura do número da leitura do ficheiro');
  }
  return erros;
}
