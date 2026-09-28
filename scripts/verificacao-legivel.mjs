/** A cópia independente da forma da data. Os restantes campos continuam literais. */
export function conferirValorDeProveniencia(correcao, campo, renderizado) {
  const normal = s => String(s).replace(/\s+/g, ' ').trim();
  let esperado = normal(correcao[campo]);
  if (correcao.kind === 'proveniencia' && correcao.field === 'access_date') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(esperado);
    if (m) esperado = `${m[3]}.${m[2]}.${m[1]}`;
  }
  return { esperado, confere: renderizado === esperado };
}

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
    const uso = el.querySelectorAll('[data-valor-em-uso]');
    const diferente = v.result === 'diverge' && n(v.found) !== n(linha.value);
    const fraseUso = lang === 'en' ? 'This page uses the value shown in the title.' : 'O valor do título é o que esta página usa.';
    if (diferente ? uso.length !== 1 || uso[0]?.textContent !== fraseUso : uso.length !== 0) {
      erros.push('C1c: a divergência não diz corretamente qual é o valor em uso');
    }
    const atualizacao = v.result === 'diverge' ? (linha.corrections ?? []).findIndex(c =>
      c.kind === 'atualizacao' && c.date >= v.date && n(c.new_value) === n(v.found)) : -1;
    const portas = el.querySelectorAll('[data-atualizacao-da-releitura]');
    if (atualizacao < 0 ? portas.length !== 0 : portas.length !== 1 || portas[0]?.getAttribute('href') !== `#alteracao-${atualizacao}`) {
      erros.push('C1: a segunda leitura não aponta para a atualização do valor encontrado');
    }
    if (atualizacao >= 0 && !root.querySelector(`#alteracao-${atualizacao}`)) erros.push('C1: atualização sem destino na história');
    const esperado = v.by === 'corredor-diario'
      ? (lang === 'en' ? 'Source file read again on' : 'Ficheiro da fonte relido a')
      : (lang === 'en' ? 'Re-read on' : 'Releitura a');
    if (el.previousElementSibling?.textContent !== esperado) erros.push('C1: o recibo não distingue a leitura do número da leitura do ficheiro');
  }
  return erros;
}
